import * as fs from 'fs';
import * as path from 'path';

export const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
export const SKELETON_DIR = path.join(PROJECT_ROOT, 'skeleton');
export const RHDH_LOCAL_DIR = path.join(PROJECT_ROOT, 'rhdh-local');
export const RHDH_URL = 'http://localhost:7007';
export const SETUP_YML_PATH = path.join(SKELETON_DIR, '.github', 'workflows', 'setup.yml');
export const VERIFY_SCRIPT_PATH = path.join(SKELETON_DIR, 'scripts', 'verify-setup.sh');
export const CI_YML_PATH = path.join(SKELETON_DIR, '.github', 'workflows', 'ci.yml');

// skeleton 内の主要ディレクトリ・ファイルパス
export const SKELETON_CLAUDE_MD_PATH = path.join(SKELETON_DIR, 'CLAUDE.md');
export const SKELETON_FEATURES_DIR = path.join(SKELETON_DIR, 'features');
export const SKELETON_STEPS_DIR = path.join(SKELETON_FEATURES_DIR, 'steps');
export const SKELETON_SUPPORT_DIR = path.join(SKELETON_FEATURES_DIR, 'support');
export const SKELETON_PACKAGE_JSON_PATH = path.join(SKELETON_DIR, 'package.json');

/**
 * skeleton/CLAUDE.md の内容を文字列として読み込む。
 * 複数のステップ定義ファイルから共通で使用される。
 */
export function readSkeletonClaudeMd(): string {
  return fs.readFileSync(SKELETON_CLAUDE_MD_PATH, 'utf-8');
}

/**
 * プロジェクトルートの README.md の内容を文字列として読み込む。
 * 複数のステップ定義ファイルから共通で使用される。
 */
export function readProjectReadme(): string {
  return fs.readFileSync(path.join(PROJECT_ROOT, 'README.md'), 'utf-8');
}

export const RHDH_READY_TIMEOUT = 90_000;
export const NAVIGATION_TIMEOUT = 30_000;
export const GUEST_LOGIN_TIMEOUT = 10_000;
export const UI_ELEMENT_TIMEOUT = 15_000;
export const COMPOSE_EXEC_TIMEOUT = 120_000;
export const SCAFFOLDER_TASK_TIMEOUT = 120_000;
