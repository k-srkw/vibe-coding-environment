/**
 * Shared workflow state module.
 *
 * setup.yml and ci.yml feature files share common Then steps
 * (e.g. "ワークフローに name が定義されている") that reference the same
 * workflow variable. This module provides a single place to store and
 * query the current workflow under test.
 */

import * as fs from 'fs';
import * as path from 'path';
import { SKELETON_DIR } from './constants';
import { Workflow, getAllSteps } from './workflow-types';

let workflow: Workflow;

/** Set the current workflow state. */
export function setWorkflow(w: Workflow): void {
  workflow = w;
}

/** Get the current workflow state. */
export function getWorkflow(): Workflow {
  return workflow;
}

/** Check if any run step directly contains the given keyword. */
export function hasRunStepContaining(keyword: string): boolean {
  return getAllSteps(workflow).some((step) => step.run?.includes(keyword));
}

/**
 * Check if a keyword appears in any run step directly,
 * or in scripts referenced by the workflow (e.g. verify-setup.sh).
 */
export function hasKeywordInWorkflow(keyword: string): boolean {
  if (hasRunStepContaining(keyword)) return true;
  for (const step of getAllSteps(workflow)) {
    const run = step.run ?? '';
    const scriptMatch = run.match(/bash\s+(scripts\/\S+)/);
    if (scriptMatch) {
      const scriptPath = path.join(SKELETON_DIR, scriptMatch[1]);
      if (fs.existsSync(scriptPath)) {
        const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
        if (scriptContent.includes(keyword)) return true;
      }
    }
  }
  return false;
}

/** Check if the specified trigger is configured on the workflow. */
export function hasTrigger(triggerName: string): boolean {
  return workflow.on != null && triggerName in workflow.on;
}
