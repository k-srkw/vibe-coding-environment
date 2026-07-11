import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { PROJECT_ROOT, RHDH_LOCAL_DIR, COMPOSE_EXEC_TIMEOUT } from './constants';
import { waitForRhdh } from './rhdh-helpers';

const CATALOG_ENTITIES_DIR = path.join(RHDH_LOCAL_DIR, 'configs', 'catalog-entities');
const APP_CONFIG_LOCAL_PATH = path.join(RHDH_LOCAL_DIR, 'configs', 'app-config', 'app-config.local.yaml');
const CONTAINER_TEMPLATE_PATH = '/opt/app-root/src/configs/catalog-entities/template.yaml';

// --- app-config YAML helpers ---

function readAppConfig(): Record<string, unknown> {
  if (!fs.existsSync(APP_CONFIG_LOCAL_PATH)) return {};
  const content = fs.readFileSync(APP_CONFIG_LOCAL_PATH, 'utf-8');
  return (yaml.load(content) as Record<string, unknown>) || {};
}

function writeAppConfig(config: Record<string, unknown>): void {
  fs.writeFileSync(APP_CONFIG_LOCAL_PATH, yaml.dump(config, { lineWidth: -1 }), 'utf-8');
}

// --- Template file copy ---

function copyTemplateFiles(): boolean {
  const templateSrc = path.join(PROJECT_ROOT, 'template.yaml');
  const templateDest = path.join(CATALOG_ENTITIES_DIR, 'template.yaml');
  const skeletonSrc = path.join(PROJECT_ROOT, 'skeleton');
  const skeletonDest = path.join(CATALOG_ENTITIES_DIR, 'skeleton');

  if (fs.existsSync(templateDest)) {
    const srcContent = fs.readFileSync(templateSrc, 'utf-8');
    const destContent = fs.readFileSync(templateDest, 'utf-8');
    if (srcContent === destContent && fs.existsSync(skeletonDest)) {
      return false;
    }
  }

  fs.copyFileSync(templateSrc, templateDest);

  fs.cpSync(skeletonSrc, skeletonDest, { recursive: true });
  return true;
}

// --- Config update functions (each returns true if config was modified) ---

function addCatalogLocation(): boolean {
  const config = readAppConfig();
  const catalog = (config['catalog'] as Record<string, unknown>) || {};
  const locations = (catalog['locations'] as unknown[]) || [];

  const alreadyRegistered = locations.some(
    (loc) => typeof loc === 'object' && loc !== null && (loc as Record<string, unknown>)['target'] === CONTAINER_TEMPLATE_PATH,
  );
  if (alreadyRegistered) return false;

  const defaultLocations = [
    { type: 'file', target: '/opt/app-root/src/techdocs-workdir/catalog-info.yaml' },
    { type: 'file', target: '/opt/app-root/src/configs/catalog-entities/users.yaml', rules: [{ allow: ['User', 'Group'] }] },
  ];

  const existingTargets = new Set(
    locations.map((loc) => typeof loc === 'object' && loc !== null ? (loc as Record<string, unknown>)['target'] : undefined),
  );
  const merged = [...locations];
  for (const def of defaultLocations) {
    if (!existingTargets.has(def.target)) {
      merged.push(def);
    }
  }
  merged.push({ type: 'file', target: CONTAINER_TEMPLATE_PATH, rules: [{ allow: ['Template'] }] });

  catalog['locations'] = merged;
  config['catalog'] = catalog;
  writeAppConfig(config);
  return true;
}

// --- RHDH restart ---

function restartRhdhContainer(): void {
  execSync('podman restart rhdh', { encoding: 'utf-8', timeout: COMPOSE_EXEC_TIMEOUT });
}

async function restartIfChanged(changed: boolean): Promise<void> {
  if (changed) {
    restartRhdhContainer();
    await waitForRhdh();
  }
}

// --- Public API ---

export async function registerTemplate(): Promise<void> {
  await waitForRhdh();
  const filesChanged = copyTemplateFiles();
  const configChanged = addCatalogLocation();
  await restartIfChanged(filesChanged || configChanged);
}

