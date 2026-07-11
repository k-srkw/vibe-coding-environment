import * as fs from 'fs';
import * as path from 'path';

/**
 * Build a clean environment for subprocess npm/test commands.
 * Strips Playwright, npm, and test-runner env vars to prevent the parent project's
 * module resolution paths from leaking into the subprocess.
 */
export function buildCleanEnv(): Record<string, string> {
  const STRIP_PREFIXES = ['npm_', 'PLAYWRIGHT_', 'TEST_'];
  const STRIP_KEYS = new Set(['NODE_OPTIONS']);
  return Object.fromEntries(
    Object.entries(process.env)
      .filter(([key]) => !STRIP_PREFIXES.some((p) => key.startsWith(p)) && !STRIP_KEYS.has(key))
      .map(([key, value]) => [key, value ?? '']),
  );
}

/** Default test values for replacing Nunjucks template variables. */
const NUNJUCKS_TEST_VALUES: Record<string, string> = {
  '${{ values.repoName }}': 'test-repo',
  '${{ values.projectName }}': 'Test Project',
  '${{ values.owner }}': 'test-owner',
};

const TEXT_EXTENSIONS = new Set([
  '.json', '.ts', '.js', '.md', '.yaml', '.yml', '.feature', '.html', '.css', '.txt',
]);

/**
 * Replace Nunjucks template variables (${{ values.xxx }}) with test values
 * in all text files under the given directory.
 */
export function replaceNunjucksVariables(
  dir: string,
  replacements: Record<string, string> = NUNJUCKS_TEST_VALUES,
): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      replaceNunjucksVariables(fullPath, replacements);
    } else if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let changed = false;
      for (const [pattern, value] of Object.entries(replacements)) {
        if (content.includes(pattern)) {
          content = content.replaceAll(pattern, value);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf-8');
      }
    }
  }
}
