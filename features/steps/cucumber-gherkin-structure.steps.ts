import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';
import { SKELETON_DIR } from '../support/constants';
import { buildCleanEnv, createSkeletonWorkDir, cleanupWorkDir } from '../support/skeleton-helpers';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const FEATURES_DIR = path.join(SKELETON_DIR, 'features');
const STEPS_DIR = path.join(FEATURES_DIR, 'steps');
const SUPPORT_DIR = path.join(FEATURES_DIR, 'support');
const PACKAGE_JSON_PATH = path.join(SKELETON_DIR, 'package.json');

function readSkeletonPackageJson(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
}

// --- AC1: skeleton/features/ にサンプル .feature ファイルが含まれている ---

Then('skeleton\\/features\\/ ディレクトリが存在する', async ({}) => {
  expect(fs.existsSync(FEATURES_DIR)).toBe(true);
});

Then('skeleton\\/features\\/ に .feature ファイルが含まれている', async ({}) => {
  const files = fs.readdirSync(FEATURES_DIR);
  const featureFiles = files.filter((f) => f.endsWith('.feature'));
  expect(featureFiles.length).toBeGreaterThan(0);
});

// --- AC2: skeleton/features/steps/ にステップ定義の雛形が含まれている ---

Then('skeleton\\/features\\/steps\\/ ディレクトリが存在する', async ({}) => {
  expect(fs.existsSync(STEPS_DIR)).toBe(true);
});

Then('skeleton\\/features\\/steps\\/ にステップ定義ファイルが含まれている', async ({}) => {
  const files = fs.readdirSync(STEPS_DIR);
  const stepFiles = files.filter((f) => f.endsWith('.ts'));
  expect(stepFiles.length).toBeGreaterThan(0);
});

// --- AC3: skeleton/features/support/ にワールド設定が含まれている ---

Then('skeleton\\/features\\/support\\/ ディレクトリが存在する', async ({}) => {
  expect(fs.existsSync(SUPPORT_DIR)).toBe(true);
});

Then('skeleton\\/features\\/support\\/ にワールド設定ファイルが含まれている', async ({}) => {
  const files = fs.readdirSync(SUPPORT_DIR);
  const tsFiles = files.filter((f) => f.endsWith('.ts'));
  expect(tsFiles.length).toBeGreaterThan(0);
});

// --- AC4: package.json に playwright-bdd と関連パッケージが定義されている ---

Then('skeleton\\/package.json に playwright-bdd が定義されている', async ({}) => {
  const pkg = readSkeletonPackageJson();
  const devDeps = pkg.devDependencies as Record<string, string>;
  expect(devDeps).toBeDefined();
  expect(devDeps['playwright-bdd']).toBeDefined();
});

Then('skeleton\\/package.json に test スクリプトが定義されている', async ({}) => {
  const pkg = readSkeletonPackageJson();
  const scripts = pkg.scripts as Record<string, string>;
  expect(scripts).toBeDefined();
  expect(scripts.test).toBeDefined();
});

// --- AC5: npm test でサンプルテストが実行・パスする ---

let testDir: string;

Given('skeleton をテスト用ディレクトリに展開している', async ({}) => {
  testDir = createSkeletonWorkDir();
});

When('テスト用ディレクトリで npm test を実行する', async ({}) => {
  const cleanEnv = buildCleanEnv();
  try {
    execSync('npm test', { cwd: testDir, timeout: 60_000, stdio: 'pipe', env: cleanEnv });
  } catch (error) {
    cleanupWorkDir(testDir);
    throw error;
  }
});

Then('テストが正常に完了する', async ({}) => {
  // execSync in the When step would have thrown on non-zero exit code.
  cleanupWorkDir(testDir);
});
