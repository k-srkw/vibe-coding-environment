import { expect } from '@playwright/test';
import { Given, Then } from '../support/fixtures';
import { SKELETON_DIR } from '../support/constants';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

const SETUP_YML_PATH = path.join(
  SKELETON_DIR,
  '.github',
  'workflows',
  'setup.yml',
);

type WorkflowStep = { run?: string; uses?: string };
type WorkflowJob = { name?: string; steps?: WorkflowStep[] };
type Workflow = {
  name?: string;
  on?: Record<string, unknown>;
  jobs?: Record<string, WorkflowJob>;
};

let workflow: Workflow;

function getAllSteps(): WorkflowStep[] {
  const jobs = workflow.jobs ?? {};
  return Object.values(jobs).flatMap((job) => job.steps ?? []);
}

function hasRunStepContaining(keyword: string): boolean {
  return getAllSteps().some((step) => step.run?.includes(keyword));
}

function hasTrigger(triggerName: string): boolean {
  return workflow.on != null && triggerName in workflow.on;
}

// --- AC1: skeleton/.github/workflows/setup.yml が存在する ---

Then('skeleton\\/.github\\/workflows\\/setup.yml が存在する', async ({}) => {
  expect(fs.existsSync(SETUP_YML_PATH)).toBe(true);
});

// --- AC2: リポジトリ作成後の初回 push（または手動トリガー）で実行される ---

Given('setup.yml を読み込んでいる', async ({}) => {
  const content = fs.readFileSync(SETUP_YML_PATH, 'utf-8');
  workflow = yaml.load(content) as Workflow;
});

Then('push トリガーが設定されている', async ({}) => {
  expect(hasTrigger('push')).toBe(true);
});

Then('workflow_dispatch トリガーが設定されている', async ({}) => {
  expect(hasTrigger('workflow_dispatch')).toBe(true);
});

// --- AC3: 依存パッケージのインストール（npm ci）が成功する ---

Then('npm ci を実行するステップが含まれている', async ({}) => {
  expect(hasRunStepContaining('npm ci')).toBe(true);
});

// --- AC4: 環境構築の基本的な検証ステップが含まれている ---

Then('ビルドを実行するステップが含まれている', async ({}) => {
  expect(hasRunStepContaining('tsc')).toBe(true);
});

Then('テストを実行するステップが含まれている', async ({}) => {
  expect(hasRunStepContaining('npm test')).toBe(true);
});

// --- AC5: 結果が GitHub Actions の UI で確認できる ---

Then('ワークフローに name が定義されている', async ({}) => {
  expect(workflow.name).toBeDefined();
  expect(typeof workflow.name).toBe('string');
});

Then('ジョブに name が定義されている', async ({}) => {
  const jobs = workflow.jobs ?? {};
  const jobEntries = Object.values(jobs);
  expect(jobEntries.length).toBeGreaterThan(0);
  for (const job of jobEntries) {
    expect(job.name).toBeDefined();
    expect(typeof job.name).toBe('string');
  }
});
