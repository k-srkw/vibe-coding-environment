import { expect } from '@playwright/test';
import * as fs from 'fs';
import { Given, Then } from '../support/fixtures';
import { CI_YML_PATH, SETUP_YML_PATH } from '../support/constants';

// モジュールレベル変数でファイル内容を保持
let ciYmlContent = '';
let setupYmlContent = '';

/**
 * content 内で target が afterKeyword の後かつ beforeKeyword の前に
 * 出現することを検証するヘルパー。
 */
function assertStepOrder(
  content: string,
  target: string,
  afterKeyword: string,
  beforeKeyword: string,
): void {
  const targetPos = content.indexOf(target);
  const afterPos = content.indexOf(afterKeyword);
  const beforePos = content.indexOf(beforeKeyword);

  expect(targetPos, `${target} が見つかりません`).toBeGreaterThan(-1);
  expect(afterPos, `${afterKeyword} が見つかりません`).toBeGreaterThan(-1);
  expect(beforePos, `${beforeKeyword} が見つかりません`).toBeGreaterThan(-1);

  expect(targetPos, `${target} は ${afterKeyword} の後であるべき`).toBeGreaterThan(afterPos);
  expect(targetPos, `${target} は ${beforeKeyword} の前であるべき`).toBeLessThan(beforePos);
}

// --- Given ---

Given('skeleton の CI ワークフローファイルを読み込む', async ({}) => {
  ciYmlContent = fs.readFileSync(CI_YML_PATH, 'utf-8');
  expect(ciYmlContent.length).toBeGreaterThan(0);
});

Given('skeleton の setup ワークフローファイルを読み込む', async ({}) => {
  setupYmlContent = fs.readFileSync(SETUP_YML_PATH, 'utf-8');
  expect(setupYmlContent.length).toBeGreaterThan(0);
});

// --- Then: ci.yml ---

Then('CI ワークフローに {string} コマンドが含まれている', async ({}, command: string) => {
  expect(ciYmlContent).toContain(command);
});

Then('Playwright インストールステップが npm ci の後かつテスト実行の前に配置されている', async ({}) => {
  assertStepOrder(ciYmlContent, 'npx playwright install', 'npm ci', 'npm test');
});

// --- Then: setup.yml ---

Then('setup ワークフローに {string} コマンドが含まれている', async ({}, command: string) => {
  expect(setupYmlContent).toContain(command);
});

Then('Playwright インストールステップが npm ci の後かつ検証スクリプト実行の前に配置されている', async ({}) => {
  assertStepOrder(setupYmlContent, 'npx playwright install', 'npm ci', 'verify-setup.sh');
});
