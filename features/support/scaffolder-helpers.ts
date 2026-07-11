import { RHDH_URL, SCAFFOLDER_TASK_TIMEOUT } from './constants';

export interface ScaffolderTaskResult {
  status: string;
  error?: string;
}

export async function runScaffolderTask(
  templateRef: string,
  values: Record<string, string>,
  token: string,
): Promise<ScaffolderTaskResult> {
  const createRes = await fetch(`${RHDH_URL}/api/scaffolder/v2/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ templateRef, values }),
  });
  if (!createRes.ok) {
    throw new Error(`Scaffolder API returned ${createRes.status}: ${await createRes.text()}`);
  }
  const { id: taskId } = (await createRes.json()) as { id: string };

  const result = await pollTask(taskId, token);
  if (result.status === 'failed' && !result.error) {
    result.error = await fetchErrorFromEventStream(taskId, token);
  }
  return result;
}

async function pollTask(taskId: string, token: string): Promise<ScaffolderTaskResult> {
  const start = Date.now();
  while (Date.now() - start < SCAFFOLDER_TASK_TIMEOUT) {
    const res = await fetch(`${RHDH_URL}/api/scaffolder/v2/tasks/${taskId}`, {
      headers: { Authorization: token },
    });
    if (res.ok) {
      const data = (await res.json()) as {
        status: string;
        steps?: Array<{ status: string; name: string; message?: string }>;
      };
      if (data.status === 'completed' || data.status === 'failed') {
        const failedSteps = (data.steps || []).filter((s) => s.status === 'failed');
        return {
          status: data.status,
          error: failedSteps.map((s) => `${s.name}: ${s.message || 'unknown'}`).join('; ') || undefined,
        };
      }
    }
    await new Promise((r) => setTimeout(r, 3_000));
  }
  return { status: 'timeout', error: `task did not complete within ${SCAFFOLDER_TASK_TIMEOUT}ms` };
}

async function fetchErrorFromEventStream(taskId: string, token: string): Promise<string> {
  try {
    const res = await fetch(`${RHDH_URL}/api/scaffolder/v2/tasks/${taskId}/eventstream`, {
      headers: { Authorization: token },
    });
    if (!res.ok) return 'task failed (event stream unavailable)';

    const text = await res.text();
    const messages = text
      .split('\n')
      .filter((line) => line.startsWith('data:'))
      .flatMap((line) => {
        try {
          const event = JSON.parse(line.slice(5));
          if (event?.body?.error?.message) return [event.body.error.message as string];
          if (event?.body?.message?.toLowerCase().includes('error')) return [event.body.message as string];
        } catch { /* skip malformed lines */ }
        return [];
      });
    return messages.join('; ') || 'task failed with no step-level error details (check RHDH container logs)';
  } catch {
    return 'task failed (event stream unavailable)';
  }
}
