import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';
import { SETUP_YML_PATH, VERIFY_SCRIPT_PATH } from '../support/constants';
import { buildCleanEnv, createSkeletonWorkDir, cleanupWorkDir } from '../support/skeleton-helpers';
import { Workflow, getAllSteps } from '../support/workflow-types';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as yaml from 'js-yaml';

function readVerifyScript(): string {
  return fs.readFileSync(VERIFY_SCRIPT_PATH, 'utf-8');
}

// --- AC1: 検証スクリプトの存在・内容の静的検証 ---

Then('skeleton\\/scripts\\/verify-setup.sh が存在する', async ({}) => {
  expect(fs.existsSync(VERIFY_SCRIPT_PATH)).toBe(true);
});

Then('検証スクリプトに CLAUDE.md の存在チェックが含まれている', async ({}) => {
  const content = readVerifyScript();
  expect(content).toContain('CLAUDE.md');
});

Then('検証スクリプトに package.json の存在チェックが含まれている', async ({}) => {
  const content = readVerifyScript();
  expect(content).toContain('package.json');
});

Then('検証スクリプトに feature ファイルの存在チェックが含まれている', async ({}) => {
  const content = readVerifyScript();
  expect(content).toContain('.feature');
});

Then('検証スクリプトに依存パッケージのインストールチェックが含まれている', async ({}) => {
  const content = readVerifyScript();
  expect(content).toContain('node_modules');
});

Then('検証スクリプトにテスト実行可能チェックが含まれている', async ({}) => {
  const content = readVerifyScript();
  expect(content).toContain('npm test');
});

Then('検証スクリプトにビルドチェックが含まれている', async ({}) => {
  const content = readVerifyScript();
  expect(content).toContain('tsc');
});

// --- AC2: setup.yml に検証スクリプトが組み込まれている ---

Then('setup.yml に検証スクリプトの実行ステップが含まれている', async ({}) => {
  const content = fs.readFileSync(SETUP_YML_PATH, 'utf-8');
  const workflow = yaml.load(content) as Workflow;
  const hasVerifyStep = getAllSteps(workflow).some(
    (step) => step.run?.includes('verify-setup.sh'),
  );
  expect(hasVerifyStep).toBe(true);
});

Then('setup.yml にジョブサマリー出力が含まれている', async ({}) => {
  const scriptContent = readVerifyScript();
  expect(scriptContent).toContain('GITHUB_STEP_SUMMARY');
});

// --- AC3: 動的検証 — 全パスで環境構築完了 ---

let testDir: string;
let exitCode: number;
let scriptOutput: string;

Given('セットアップ済みの skeleton 作業ディレクトリが存在する', async ({}) => {
  testDir = createSkeletonWorkDir('verify-setup-');
});

When('検証スクリプトを実行する', async ({}) => {
  const cleanEnv = buildCleanEnv();
  try {
    const output = execSync('bash scripts/verify-setup.sh', {
      cwd: testDir,
      timeout: 120_000,
      stdio: 'pipe',
      env: cleanEnv,
    });
    scriptOutput = output.toString();
    exitCode = 0;
  } catch (error: unknown) {
    const execError = error as { status: number; stdout: Buffer; stderr: Buffer };
    exitCode = execError.status;
    scriptOutput = (execError.stdout?.toString() ?? '') + (execError.stderr?.toString() ?? '');
  }
});

Then('終了コードが 0 である', async ({}) => {
  expect(exitCode).toBe(0);
  cleanupWorkDir(testDir);
});

Then('出力に環境構築完了メッセージが含まれる', async ({}) => {
  expect(scriptOutput).toContain('環境構築完了');
});

// --- AC4: 動的検証 — 失敗時エラー明示 ---

Given('必要なファイルが欠けた作業ディレクトリが存在する', async ({}) => {
  testDir = createSkeletonWorkDir('verify-setup-fail-');
  // CLAUDE.md を削除して検証失敗を起こす
  fs.unlinkSync(path.join(testDir, 'CLAUDE.md'));
});

Then('終了コードが 0 以外である', async ({}) => {
  expect(exitCode).not.toBe(0);
  cleanupWorkDir(testDir);
});

Then('出力に失敗した項目のエラー内容が含まれる', async ({}) => {
  expect(scriptOutput).toContain('FAIL');
});
