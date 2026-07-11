import { execSync } from 'child_process';
import type { Page } from '@playwright/test';
import { RHDH_LOCAL_DIR, RHDH_URL, RHDH_READY_TIMEOUT, NAVIGATION_TIMEOUT, GUEST_LOGIN_TIMEOUT, COMPOSE_EXEC_TIMEOUT } from './constants';

export function composeExec(command: string): string {
  return execSync(`podman compose ${command}`, {
    cwd: RHDH_LOCAL_DIR,
    encoding: 'utf-8',
    timeout: COMPOSE_EXEC_TIMEOUT,
  });
}

export async function waitForRhdh(timeoutMs = RHDH_READY_TIMEOUT): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(RHDH_URL);
      if (res.ok) return;
    } catch {
      // Not yet ready
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }
  throw new Error(`RHDH did not become ready within ${timeoutMs}ms`);
}

export async function navigateWithGuestLogin(page: Page, targetUrl: string): Promise<void> {
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: NAVIGATION_TIMEOUT });

  const enterButton = page.getByRole('button', { name: 'Enter' });
  try {
    await enterButton.waitFor({ state: 'visible', timeout: GUEST_LOGIN_TIMEOUT });
    await enterButton.click();
    await page.getByRole('heading', { name: 'Select a sign-in method' })
      .waitFor({ state: 'hidden', timeout: NAVIGATION_TIMEOUT });
    if (!page.url().includes(new URL(targetUrl).pathname)) {
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: NAVIGATION_TIMEOUT });
    }
  } catch {
    // Login page didn't appear — already authenticated
  }
}
