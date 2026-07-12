/** Types for parsed GitHub Actions workflow YAML */

export type WorkflowStep = { run?: string; name?: string; uses?: string; with?: Record<string, unknown>; if?: string };
export type WorkflowJob = { name?: string; steps?: WorkflowStep[] };
export type Workflow = {
  name?: string;
  on?: Record<string, unknown>;
  jobs?: Record<string, WorkflowJob>;
};

/** Extract all steps from all jobs in a workflow. */
export function getAllSteps(workflow: Workflow): WorkflowStep[] {
  const jobs = workflow.jobs ?? {};
  return Object.values(jobs).flatMap((job) => job.steps ?? []);
}
