import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';
import { test } from '../support/fixtures';
import { PROJECT_ROOT, RHDH_URL, NAVIGATION_TIMEOUT, UI_ELEMENT_TIMEOUT } from '../support/constants';
import { navigateWithGuestLogin } from '../support/rhdh-helpers';
import { registerTemplate } from '../support/rhdh-template-helper';
import { githubHeaders, getGitHubOwner, removeCatalogLocation } from '../support/github-helpers';
import { runScaffolderTask, type ScaffolderTaskResult } from '../support/scaffolder-helpers';
import * as fs from 'fs';
import * as path from 'path';

const TEST_REPO_NAME = 'vibe-coding-test-pbi2';

let taskResult: ScaffolderTaskResult | null = null;
let taskOwner: string;
let taskBackstageToken: string;

// --- AC1 & AC4: template.yaml / skeleton ---

Given('template.yaml が存在する', async ({}) => {
  const templatePath = path.join(PROJECT_ROOT, 'template.yaml');
  expect(fs.existsSync(templatePath)).toBe(true);
});

Given('テンプレートが RHDH Local に登録されている', async ({}) => {
  await registerTemplate();
});

When('テンプレートカタログを表示する', async ({ page }) => {
  await navigateWithGuestLogin(page, `${RHDH_URL}/create`);
});

Then('テンプレート一覧にバイブコーディング環境テンプレートが表示される', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'バイブコーディング環境' })).toBeVisible({ timeout: NAVIGATION_TIMEOUT });
});

// --- AC2: パラメータ入力 ---

When('バイブコーディング環境テンプレートの作成画面を開く', async ({ page }) => {
  await navigateWithGuestLogin(page, `${RHDH_URL}/create`);
  const templateHeading = page.getByRole('heading', { name: 'バイブコーディング環境' });
  await expect(templateHeading).toBeVisible({ timeout: NAVIGATION_TIMEOUT });
  const templateCard = page.locator('[class*="MuiCard-root"]', { has: templateHeading });
  await templateCard.getByRole('button', { name: /choose/i }).click({ timeout: UI_ELEMENT_TIMEOUT });
  await page.waitForLoadState('domcontentloaded');
});

Then('プロジェクト名の入力フィールドが表示される', async ({ page }) => {
  await expect(page.getByLabel('プロジェクト名')).toBeVisible({ timeout: UI_ELEMENT_TIMEOUT });
});

Then('オーナーの入力フィールドが表示される', async ({ page }) => {
  await expect(page.getByLabel('オーナー')).toBeVisible({ timeout: UI_ELEMENT_TIMEOUT });
});

Then('リポジトリ名の入力フィールドが表示される', async ({ page }) => {
  await expect(page.getByLabel('リポジトリ名')).toBeVisible({ timeout: UI_ELEMENT_TIMEOUT });
});

// --- AC3: GitHub リポジトリ作成 ---

Given('GitHub 連携が設定されている', async ({}) => {
  test.skip(!process.env.GITHUB_TOKEN, 'GITHUB_TOKEN が設定されていないためスキップ');

  const owner = await getGitHubOwner();
  try {
    await fetch(`https://api.github.com/repos/${owner}/${TEST_REPO_NAME}`, {
      method: 'DELETE',
      headers: githubHeaders(),
    });
  } catch {
    // Repo may not exist
  }
});

When('Scaffolder API でテンプレートを実行する', async ({ page }) => {
  taskOwner = await getGitHubOwner();

  let backstageToken: string | undefined;
  page.on('request', (request) => {
    const auth = request.headers()['authorization'];
    if (auth && request.url().includes('/api/')) {
      backstageToken = auth;
    }
  });

  await navigateWithGuestLogin(page, `${RHDH_URL}/create`);
  await page.waitForSelector('[class*="MuiCard-root"]', { timeout: NAVIGATION_TIMEOUT });
  expect(backstageToken).toBeDefined();
  taskBackstageToken = backstageToken!;

  await removeCatalogLocation(taskBackstageToken, taskOwner, TEST_REPO_NAME);

  taskResult = await runScaffolderTask(
    'template:default/vibe-coding-environment',
    { projectName: 'PBI-2 テストプロジェクト', owner: taskOwner, repoName: TEST_REPO_NAME },
    taskBackstageToken,
  );
});

Then('GitHub にリポジトリが作成される', async ({}) => {
  expect(taskResult).not.toBeNull();
  expect(taskResult!.status, `Scaffolder task failed: ${taskResult!.error}`).toBe('completed');

  const res = await fetch(`https://api.github.com/repos/${taskOwner}/${TEST_REPO_NAME}`, {
    headers: githubHeaders(),
  });
  expect(res.status).toBe(200);
});

Then('作成されたリポジトリに skeleton のファイルが含まれている', async ({}) => {
  const res = await fetch(`https://api.github.com/repos/${taskOwner}/${TEST_REPO_NAME}/contents`, {
    headers: githubHeaders(),
  });
  expect(res.status).toBe(200);

  const contents = (await res.json()) as Array<{ name: string }>;
  const fileNames = contents.map((f) => f.name);
  expect(fileNames).toContain('package.json');
  expect(fileNames).toContain('README.md');

  await removeCatalogLocation(taskBackstageToken, taskOwner, TEST_REPO_NAME);
  await fetch(`https://api.github.com/repos/${taskOwner}/${TEST_REPO_NAME}`, {
    method: 'DELETE',
    headers: githubHeaders(),
  });
});

// --- AC4: skeleton ディレクトリ ---

Then('skeleton ディレクトリが存在する', async ({}) => {
  const skeletonDir = path.join(PROJECT_ROOT, 'skeleton');
  expect(fs.existsSync(skeletonDir)).toBe(true);
});

Then('skeleton ディレクトリにファイルが含まれている', async ({}) => {
  const skeletonDir = path.join(PROJECT_ROOT, 'skeleton');
  const files = fs.readdirSync(skeletonDir);
  expect(files.length).toBeGreaterThan(0);
});
