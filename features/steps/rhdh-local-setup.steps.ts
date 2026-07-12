import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';
import * as fs from 'fs';
import * as path from 'path';
import { PROJECT_ROOT, RHDH_LOCAL_DIR, RHDH_URL, NAVIGATION_TIMEOUT, GUEST_LOGIN_TIMEOUT, readProjectReadme } from '../support/constants';
import { composeExec } from '../support/rhdh-helpers';

// --- Scenario 1: podman compose up で RHDH Local が起動する ---

Given('compose.yaml が存在する', async ({}) => {
  const composePath = path.join(RHDH_LOCAL_DIR, 'compose.yaml');
  expect(fs.existsSync(composePath)).toBe(true);
});

When('podman compose up を実行する', async ({}) => {
  composeExec('up -d');
});

Then('RHDH Local のコンテナが起動している', async ({}) => {
  const output = composeExec('ps');
  expect(output).toContain('rhdh');
});

// --- Scenario 2: ブラウザから RHDH Local の UI にアクセスできる ---

Given('RHDH Local が起動している', async ({}) => {
  const output = composeExec('ps');
  expect(output).toContain('rhdh');
});

When('ブラウザで RHDH Local の URL にアクセスする', async ({ page }) => {
  await page.goto(RHDH_URL, { waitUntil: 'domcontentloaded', timeout: NAVIGATION_TIMEOUT });
});

Then('RHDH Local のトップページが表示される', async ({ page }) => {
  await expect(page.locator('body')).toBeVisible({ timeout: GUEST_LOGIN_TIMEOUT });
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});

// --- Scenario 3: セットアップ手順が README に記載されている ---

Given('README.md が存在する', async ({}) => {
  const readmePath = path.join(PROJECT_ROOT, 'README.md');
  expect(fs.existsSync(readmePath)).toBe(true);
});

Then('README に RHDH Local の起動手順が記載されている', async ({}) => {
  expect(readProjectReadme()).toContain('podman compose up');
});

Then('README にカスタムテンプレートの登録手順が記載されている', async ({}) => {
  const content = readProjectReadme();
  expect(content).toContain('catalog');
  expect(content).toContain('template.yaml');
});
