import { expect } from '@playwright/test';
import { Then } from '../support/fixtures';
import { SKELETON_DIR } from '../support/constants';
import * as fs from 'fs';
import * as path from 'path';

const CLAUDE_MD_PATH = path.join(SKELETON_DIR, 'CLAUDE.md');

function readClaudeMd(): string {
  return fs.readFileSync(CLAUDE_MD_PATH, 'utf-8');
}

// --- AC1: skeleton/CLAUDE.md が存在する ---

Then('skeleton\\/CLAUDE.md ファイルが存在する', async ({}) => {
  expect(fs.existsSync(CLAUDE_MD_PATH)).toBe(true);
});

// --- AC2: テンプレートパラメータが Nunjucks 変数で埋め込まれる ---

Then('skeleton\\/CLAUDE.md にプロジェクト名の Nunjucks 変数が含まれている', async ({}) => {
  expect(readClaudeMd()).toContain('${{ values.projectName }}');
});

Then('skeleton\\/CLAUDE.md にオーナーの Nunjucks 変数が含まれている', async ({}) => {
  expect(readClaudeMd()).toContain('${{ values.owner }}');
});

Then('skeleton\\/CLAUDE.md にリポジトリ名の Nunjucks 変数が含まれている', async ({}) => {
  expect(readClaudeMd()).toContain('${{ values.repoName }}');
});

// --- AC3: 必須セクションが含まれている ---

Then('skeleton\\/CLAUDE.md に「プロジェクト概要」セクションが含まれている', async ({}) => {
  expect(readClaudeMd()).toContain('プロジェクト概要');
});

Then('skeleton\\/CLAUDE.md に「技術スタック」セクションが含まれている', async ({}) => {
  expect(readClaudeMd()).toContain('技術スタック');
});

Then('skeleton\\/CLAUDE.md に「コーディング規約」セクションが含まれている', async ({}) => {
  expect(readClaudeMd()).toContain('コーディング規約');
});

Then('skeleton\\/CLAUDE.md に「テスト方針」セクションが含まれている', async ({}) => {
  expect(readClaudeMd()).toContain('テスト方針');
});

Then('skeleton\\/CLAUDE.md に「PR・レビュールール」セクションが含まれている', async ({}) => {
  expect(readClaudeMd()).toContain('PR・レビュールール');
});

// --- AC4: CLAUDE.md の内容が Claude Code にとって解釈可能である ---

Then('skeleton\\/CLAUDE.md が空でない', async ({}) => {
  expect(readClaudeMd().trim().length).toBeGreaterThan(0);
});

Then('skeleton\\/CLAUDE.md が有効な Markdown 形式である', async ({}) => {
  const content = readClaudeMd();
  const hasHeading = /^#{1,6}\s+.+/m.test(content);
  expect(hasHeading).toBe(true);
});
