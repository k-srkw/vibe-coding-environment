import { expect } from '@playwright/test';
import { Given, Then } from '../support/fixtures';
import {
  TEMPLATE_TEST_YML_PATH,
  BRANCH_PROTECTION_GUIDE_PATH,
} from '../support/constants';
import { Workflow } from '../support/workflow-types';
import {
  setWorkflow,
  hasRunStepContaining,
  hasUsesStepContaining,
} from '../support/workflow-state';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

// --- AC1: .github/workflows/test.yml が存在する ---

Then('.github\\/workflows\\/test.yml が存在する', async ({}) => {
  expect(fs.existsSync(TEMPLATE_TEST_YML_PATH)).toBe(true);
});

// --- AC2: push / PR 作成時にテストが自動実行される ---

Given(
  'テンプレートプロジェクトの test.yml を読み込んでいる',
  async ({}) => {
    const content = fs.readFileSync(TEMPLATE_TEST_YML_PATH, 'utf-8');
    setWorkflow(yaml.load(content) as Workflow);
  },
);

// push トリガー / pull_request トリガーは既存ステップ定義で対応済み

// --- AC3: ワークフローで npm test が実行される ---

Then(
  'ワークフローに {string} を実行するステップが含まれている',
  async ({}, command: string) => {
    expect(hasRunStepContaining(command)).toBe(true);
  },
);

// --- AC3: テスト結果がアーティファクトとしてアップロードされる ---

Then(
  'テスト結果をアーティファクトとしてアップロードするステップが含まれている',
  async ({}) => {
    expect(hasUsesStepContaining('upload-artifact')).toBe(true);
  },
);

// --- AC4: ブランチ保護ルール設定ガイドが存在する ---

Then('docs\\/branch-protection-guide.md が存在する', async ({}) => {
  expect(fs.existsSync(BRANCH_PROTECTION_GUIDE_PATH)).toBe(true);
});
