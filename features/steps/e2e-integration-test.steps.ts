import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';
import { PROJECT_ROOT, readProjectReadme } from '../support/constants';
import { captureBackstageToken } from '../support/rhdh-helpers';
import { getGitHubOwner, checkRepoExists, getRepoFileNames, deleteGitHubRepo, removeCatalogLocation } from '../support/github-helpers';
import { runScaffolderTask, type ScaffolderTaskResult } from '../support/scaffolder-helpers';
import * as fs from 'fs';
import * as path from 'path';

const E2E_TEST_REPO_NAME = 'vibe-coding-test-e2e';

let taskResult: ScaffolderTaskResult | null = null;
let taskOwner: string;
let taskBackstageToken: string;

// --- @github シナリオ: E2E テンプレート実行 ---

When('Scaffolder API で E2E テスト用テンプレートを実行する', async ({ page }) => {
  taskOwner = await getGitHubOwner();
  taskBackstageToken = await captureBackstageToken(page);

  // クリーンアップ: 既存のカタログロケーションとリポジトリを削除
  await removeCatalogLocation(taskBackstageToken, taskOwner, E2E_TEST_REPO_NAME);
  await deleteGitHubRepo(taskOwner, E2E_TEST_REPO_NAME);

  taskResult = await runScaffolderTask(
    'template:default/vibe-coding-environment',
    { projectName: 'E2E テストプロジェクト', owner: taskOwner, repoName: E2E_TEST_REPO_NAME },
    taskBackstageToken,
  );
});

Then('GitHub に E2E テスト用リポジトリが作成される', async ({}) => {
  expect(taskResult).not.toBeNull();
  expect(taskResult!.status, `Scaffolder task failed: ${taskResult!.error}`).toBe('completed');

  expect(await checkRepoExists(taskOwner, E2E_TEST_REPO_NAME)).toBe(true);
});

Then('E2E テスト用リポジトリに CLAUDE.md が含まれている', async ({}) => {
  const fileNames = await getRepoFileNames(taskOwner, E2E_TEST_REPO_NAME);
  expect(fileNames).toContain('CLAUDE.md');
});

Then('E2E テスト用リポジトリに Cucumber テスト構造が含まれている', async ({}) => {
  // features ディレクトリに .feature ファイルが存在すること
  const featureFiles = await getRepoFileNames(taskOwner, E2E_TEST_REPO_NAME, 'features');
  expect(featureFiles.some((name) => name.endsWith('.feature'))).toBe(true);

  // features/steps ディレクトリに .steps.ts ファイルが存在すること
  const stepFiles = await getRepoFileNames(taskOwner, E2E_TEST_REPO_NAME, 'features/steps');
  expect(stepFiles.some((name) => name.endsWith('.steps.ts'))).toBe(true);
});

Then('E2E テスト用リポジトリに GitHub Actions ワークフローが含まれている', async ({}) => {
  const workflowNames = await getRepoFileNames(taskOwner, E2E_TEST_REPO_NAME, '.github/workflows');
  expect(workflowNames).toContain('ci.yml');
  expect(workflowNames).toContain('setup.yml');

  // 最後のステップなのでクリーンアップを実行
  await removeCatalogLocation(taskBackstageToken, taskOwner, E2E_TEST_REPO_NAME);
  await deleteGitHubRepo(taskOwner, E2E_TEST_REPO_NAME);
});

// --- README シナリオ: E2E テスト手順の記載確認 ---

Given('プロジェクトルートに README.md が存在する', async ({}) => {
  expect(fs.existsSync(path.join(PROJECT_ROOT, 'README.md'))).toBe(true);
});

Then('README に E2E テストの実行手順セクションが含まれている', async ({}) => {
  expect(readProjectReadme()).toContain('E2E テスト');
});

Then('README に前提条件が記載されている', async ({}) => {
  const content = readProjectReadme();
  expect(content).toContain('RHDH Local');
  expect(content).toContain('GITHUB_TOKEN');
});

Then('README に手順の概要が記載されている', async ({}) => {
  expect(readProjectReadme()).toContain('npm test');
});
