import { expect } from '@playwright/test';
import { Given, Then } from '../support/fixtures';
import { SKELETON_FEATURES_DIR, readSkeletonClaudeMd } from '../support/constants';
import * as fs from 'fs';
import * as path from 'path';

// --- AC1: CLAUDE.md に ATDD ワークフローの手順が記載されている ---
// Note: 'skeleton/CLAUDE.md ファイルが存在する' は claude-md-template.steps.ts で Then として定義済み。
// playwright-bdd では Given/When/Then のキーワードに関わらずパターンでマッチするため、再定義不要。

Then('skeleton\\/CLAUDE.md に「ATDD ワークフロー」セクションが含まれている', async ({}) => {
  const content = readSkeletonClaudeMd();
  expect(content).toMatch(/#{1,6}\s+.*ATDD ワークフロー/);
});

Then('ATDD ワークフローに Gherkin でテストを記述するステップが含まれている', async ({}) => {
  const content = readSkeletonClaudeMd();
  expect(content).toMatch(/Gherkin.*テスト.*記述|\.feature.*シナリオ.*記述/);
});

Then('ATDD ワークフローに実装するステップが含まれている', async ({}) => {
  const content = readSkeletonClaudeMd();
  expect(content).toMatch(/実装.*ステップ定義|ステップ定義.*実装コード/);
});

Then('ATDD ワークフローに CI で検証するステップが含まれている', async ({}) => {
  const content = readSkeletonClaudeMd();
  expect(content).toMatch(/CI.*検証|GitHub Actions.*テスト/);
});

// --- AC2: .feature ファイル先行ルールが設定されている ---

Then('skeleton\\/CLAUDE.md に .feature ファイルを先に書くルールが記載されている', async ({}) => {
  const content = readSkeletonClaudeMd();
  expect(content).toMatch(/\.feature.*先に|\.feature.*書いてから/);
});

Then('そのルールが厳守事項として記載されている', async ({}) => {
  const content = readSkeletonClaudeMd();
  expect(content).toMatch(/厳守|例外は認めない/);
});

// --- AC3: サンプル Feature ファイルが ATDD パターンを示している ---

const ATDD_SAMPLE_PATH = path.join(SKELETON_FEATURES_DIR, 'atdd-sample.feature');

function readAtddSampleFeature(): string {
  return fs.readFileSync(ATDD_SAMPLE_PATH, 'utf-8');
}

Given('skeleton\\/features\\/ に ATDD サンプルの .feature ファイルが存在する', async ({}) => {
  expect(fs.existsSync(ATDD_SAMPLE_PATH)).toBe(true);
});

Then('サンプル Feature ファイルに Scenario Outline パターンが含まれている', async ({}) => {
  expect(readAtddSampleFeature()).toContain('Scenario Outline');
});

Then('サンプル Feature ファイルに Background パターンが含まれている', async ({}) => {
  expect(readAtddSampleFeature()).toContain('Background');
});

Then('サンプル Feature ファイルにタグの使用例が含まれている', async ({}) => {
  expect(readAtddSampleFeature()).toMatch(/@\w+/);
});
