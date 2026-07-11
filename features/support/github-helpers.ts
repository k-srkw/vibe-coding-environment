import { RHDH_URL } from './constants';

let cachedOwner: string | undefined;

export function githubHeaders(): Record<string, string> {
  return {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  };
}

export async function getGitHubOwner(): Promise<string> {
  if (process.env.GITHUB_TEST_OWNER) {
    return process.env.GITHUB_TEST_OWNER;
  }
  if (cachedOwner) return cachedOwner;

  const res = await fetch('https://api.github.com/user', {
    headers: githubHeaders(),
  });
  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}`);
  }
  const data = (await res.json()) as { login: string };
  cachedOwner = data.login;
  return cachedOwner;
}

export async function removeCatalogLocation(backstageToken: string, owner: string, repoName: string): Promise<void> {
  const catalogLocationUrl = `https://github.com/${owner}/${repoName}/tree/main/catalog-info.yaml`;
  try {
    const locationsRes = await fetch(`${RHDH_URL}/api/catalog/locations`, {
      headers: { Authorization: backstageToken },
    });
    if (!locationsRes.ok) return;
    const locations = (await locationsRes.json()) as Array<{ data: { id: string; target: string } }>;
    const match = locations.find((l) => l.data.target === catalogLocationUrl);
    if (match) {
      await fetch(`${RHDH_URL}/api/catalog/locations/${match.data.id}`, {
        method: 'DELETE',
        headers: { Authorization: backstageToken },
      });
    }
  } catch {
    // ignore — RHDH may not be reachable
  }
}
