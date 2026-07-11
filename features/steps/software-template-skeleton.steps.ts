import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';
import { test } from '../support/fixtures';
import { PROJECT_ROOT, RHDH_URL, NAVIGATION_TIMEOUT, UI_ELEMENT_TIMEOUT, SCAFFOLDER_TASK_TIMEOUT } from '../support/constants';
import { navigateWithGuestLogin } from '../support/rhdh-helpers';
import { registerTemplate } from '../support/rhdh-template-helper';
import { githubHeaders, getGitHubOwner, removeCatalogLocation } from '../support/github-helpers';
import * as fs from 'fs';
import * as path from 'path';

const TEST_REPO_NAME = 'vibe-coding-test-pbi2';

let scaffolderTaskResult: {
  status: string;
  owner: string;
  repoName: string;
  backstageToken: string;
  error?: string;
} | null = null;

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
  const owner = await getGitHubOwner();

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

  await removeCatalogLocation(backstageToken!, owner, TEST_REPO_NAME);

  const createRes = await fetch(`${RHDH_URL}/api/scaffolder/v2/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': backstageToken!,
    },
    body: JSON.stringify({
      templateRef: 'template:default/vibe-coding-environment',
      values: {
        projectName: 'PBI-2 テストプロジェクト',
        owner,
        repoName: TEST_REPO_NAME,
      },
    }),
  });
  if (!createRes.ok) {
    throw new Error(`Scaffolder API returned ${createRes.status}: ${await createRes.text()}`);
  }
  const { id: taskId } = (await createRes.json()) as { id: string };

  const start = Date.now();
  let status = 'open';
  let taskError: string | undefined;
  while (Date.now() - start < SCAFFOLDER_TASK_TIMEOUT) {
    const taskRes = await fetch(`${RHDH_URL}/api/scaffolder/v2/tasks/${taskId}`, {
      headers: { Authorization: backstageToken! },
    });
    if (taskRes.ok) {
      const taskData = (await taskRes.json()) as { status: string; steps?: Array<{ status: string; name: string; message?: string }> };
      status = taskData.status;
      if (status === 'failed') {
        const failedSteps = (taskData.steps || []).filter((s) => s.status === 'failed');
        taskError = failedSteps.map((s) => `${s.name}: ${s.message || 'unknown'}`).join('; ');
      }
      if (status === 'completed' || status === 'failed') break;
    }
    await new Promise((r) => setTimeout(r, 3_000));
  }

  scaffolderTaskResult = {
    status,
    owner,
    repoName: TEST_REPO_NAME,
    backstageToken: backstageToken!,
    error: taskError,
  };
});

Then('GitHub にリポジトリが作成される', async ({}) => {
  expect(scaffolderTaskResult).not.toBeNull();
  expect(scaffolderTaskResult!.status, `Scaffolder task failed: ${scaffolderTaskResult!.error}`).toBe('completed');

  const { owner, repoName } = scaffolderTaskResult!;
  const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
    headers: githubHeaders(),
  });
  expect(res.status).toBe(200);
});

Then('作成されたリポジトリに skeleton のファイルが含まれている', async ({}) => {
  const { owner, repoName, backstageToken } = scaffolderTaskResult!;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents`, {
    headers: githubHeaders(),
  });
  expect(res.status).toBe(200);

  const contents = (await res.json()) as Array<{ name: string }>;
  const fileNames = contents.map((f) => f.name);
  expect(fileNames).toContain('package.json');
  expect(fileNames).toContain('README.md');

  await removeCatalogLocation(backstageToken, owner, repoName);
  await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
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
