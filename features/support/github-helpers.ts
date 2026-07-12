import { expect } from '@playwright/test';
import { RHDH_URL } from './constants';

let cachedOwner: string | undefined;

export function githubHeaders(): Record<string, string> {
  return {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${process.env.GITHUB_TOKEN}`,
  };
}

export async function getGitHubOwner(): Promise<string> {
  if (process.env.GITHUB_TEST_OWNER) {
    return process.env.GITHUB_TEST_OWNER;
  }
  if (cachedOwner) return cachedOwner;

  const res = await fetch('https://api.github.com/user', {
    headers: githubHeaders(),
  });
  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}`);
  }
  const data = (await res.json()) as { login: string };
  cachedOwner = data.login;
  return cachedOwner;
}

/**
 * GitHub リポジトリが存在するかを確認する。
 * @returns true ならリポジトリが存在する
 */
export async function checkRepoExists(owner: string, repoName: string): Promise<boolean> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
    headers: githubHeaders(),
  });
  return res.status === 200;
}

/**
 * GitHub リポジトリの指定パス配下のファイル名一覧を取得する。
 * @param owner リポジトリオーナー
 * @param repoName リポジトリ名
 * @param dirPath 取得するディレクトリパス（省略時はルート）
 * @returns ファイル名の配列
 */
export async function getRepoFileNames(owner: string, repoName: string, dirPath = ''): Promise<string[]> {
  const pathSegment = dirPath ? `/${dirPath}` : '';
  const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/contents${pathSegment}`, {
    headers: githubHeaders(),
  });
  expect(res.status).toBe(200);

  const contents = (await res.json()) as Array<{ name: string }>;
  return contents.map((f) => f.name);
}

/**
 * GitHub リポジトリを削除する。リポジトリが存在しない場合は無視する。
 */
export async function deleteGitHubRepo(owner: string, repoName: string): Promise<void> {
  try {
    await fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
      method: 'DELETE',
      headers: githubHeaders(),
    });
  } catch {
    // リポジトリが存在しない場合は無視
  }
}

export async function removeCatalogLocation(backstageToken: string, owner: string, repoName: string): Promise<void> {
  const catalogLocationUrl = `https://github.com/${owner}/${repoName}/tree/main/catalog-info.yaml`;
  try {
    const locationsRes = await fetch(`${RHDH_URL}/api/catalog/locations`, {
      headers: { Authorization: backstageToken },
    });
    if (!locationsRes.ok) return;
    const locations = (await locationsRes.json()) as Array<{ data: { id: string; target: string } }>;
    const match = locations.find((l) => l.data.target === catalogLocationUrl);
    if (match) {
      await fetch(`${RHDH_URL}/api/catalog/locations/${match.data.id}`, {
        method: 'DELETE',
        headers: { Authorization: backstageToken },
      });
    }
  } catch {
    // ignore — RHDH may not be reachable
  }
}
