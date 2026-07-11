import * as path from 'path';

export const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
export const SKELETON_DIR = path.join(PROJECT_ROOT, 'skeleton');
export const RHDH_LOCAL_DIR = path.join(PROJECT_ROOT, 'rhdh-local');
export const RHDH_URL = 'http://localhost:7007';
export const SETUP_YML_PATH = path.join(SKELETON_DIR, '.github', 'workflows', 'setup.yml');
export const VERIFY_SCRIPT_PATH = path.join(SKELETON_DIR, 'scripts', 'verify-setup.sh');

export const RHDH_READY_TIMEOUT = 90_000;
export const NAVIGATION_TIMEOUT = 30_000;
export const GUEST_LOGIN_TIMEOUT = 10_000;
export const UI_ELEMENT_TIMEOUT = 15_000;
export const COMPOSE_EXEC_TIMEOUT = 120_000;
export const SCAFFOLDER_TASK_TIMEOUT = 120_000;
