import { expect } from '@playwright/test';
import { Given, Then } from '../support/fixtures';
import { CI_YML_PATH } from '../support/constants';
import { Workflow, getAllSteps } from '../support/workflow-types';
import {
  setWorkflow,
  getWorkflow,
  hasTrigger,
  hasKeywordInWorkflow,
} from '../support/workflow-state';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

// --- AC1: skeleton/.github/workflows/ci.yml が存在する ---

Then('skeleton\\/.github\\/workflows\\/ci.yml が存在する', async ({}) => {
  expect(fs.existsSync(CI_YML_PATH)).toBe(true);
});

// --- AC2: PR 作成・更新時に自動でトリガーされる ---

Given('ci.yml を読み込んでいる', async ({}) => {
  const content = fs.readFileSync(CI_YML_PATH, 'utf-8');
  setWorkflow(yaml.load(content) as Workflow);
});

Then('pull_request トリガーが設定されている', async ({}) => {
  expect(hasTrigger('pull_request')).toBe(true);
});

// --- AC4: リント・型チェックが実行される ---

Then('型チェックを実行するステップが含まれている', async ({}) => {
  expect(hasKeywordInWorkflow('tsc')).toBe(true);
});

// --- AC6: テスト失敗時にわかりやすいエラーレポートが出る ---

Then('テスト結果レポートをアップロードするステップが含まれている', async ({}) => {
  const steps = getAllSteps(getWorkflow());
  const hasUploadStep = steps.some((step) =>
    step.uses?.includes('upload-artifact'),
  );
  expect(hasUploadStep).toBe(true);
});
