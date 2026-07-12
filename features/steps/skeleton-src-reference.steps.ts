import { expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Given, Then } from '../support/fixtures';
import { readSkeletonClaudeMd, SKELETON_DIR } from '../support/constants';

// モジュールレベル変数（Playwright BDD のワールド変数は {} 内で展開されないため）
let directoryStructureText = '';
let parsedEntries: string[] = [];

/**
 * ディレクトリ構造のコードブロックを抽出する正規表現。
 */
const DIRECTORY_STRUCTURE_RE = /### ディレクトリ構造\s*\n\s*```\n([\s\S]*?)```/;

/**
 * ツリー行からエントリ名を抽出する正規表現。
 * ├── / └── の後のファイル名・ディレクトリ名を取得する。
 */
const TREE_ENTRY_RE = /[├└]── (.+?)(?:\s{2,}#.*)?$/;

/**
 * ディレクトリ構造セクション（``` ブロック内）をパースし、
 * skeleton ルートからの相対パスリストを返す。
 *
 * ツリーのインデント深さから親ディレクトリを推定し、
 * ネストされたエントリにはフルパスを構築する。
 */
function parseDirectoryEntries(content: string): string[] {
  const codeBlockMatch = content.match(DIRECTORY_STRUCTURE_RE);
  if (!codeBlockMatch) return [];

  const block = codeBlockMatch[1];
  const lines = block.split('\n').filter((l) => l.trim().length > 0);

  // 深さごとの親ディレクトリ名を保持するスタック
  const parentStack: string[] = [];
  const entries: string[] = [];

  for (const line of lines) {
    const entryMatch = line.match(TREE_ENTRY_RE);
    if (!entryMatch) continue;

    const entryName = entryMatch[1].trim();

    // インデント深さを計算（ツリー記号の前の │ や空白の数）
    const prefixMatch = line.match(/^([\s│]*)[├└]/);
    const depth = prefixMatch ? Math.floor(prefixMatch[1].length / 4) : 0;

    // スタックを現在の深さに合わせる
    parentStack.length = depth;

    const fullPath = [...parentStack, entryName].join('/');
    entries.push(fullPath);

    // ディレクトリの場合はスタックに追加
    if (entryName.endsWith('/')) {
      parentStack.push(entryName.replace(/\/$/, ''));
    }
  }

  return entries;
}

// --- Given ---

Given('skeleton\\/CLAUDE.md のディレクトリ構造セクションを読み込む', async ({}) => {
  const content = readSkeletonClaudeMd();
  const codeBlockMatch = content.match(DIRECTORY_STRUCTURE_RE);
  expect(codeBlockMatch).not.toBeNull();
  directoryStructureText = codeBlockMatch![1];
  parsedEntries = parseDirectoryEntries(content);
});

// --- Then: 各エントリが skeleton 内に実在する ---

Then('ディレクトリ構造に記載された各エントリが skeleton 内に実在する', async ({}) => {
  const missing: string[] = [];

  for (const entry of parsedEntries) {
    // ワイルドカード（*.feature 等）はスキップ
    if (entry.includes('*')) continue;

    const fullPath = path.join(SKELETON_DIR, entry);
    if (!fs.existsSync(fullPath)) {
      missing.push(entry);
    }
  }

  expect(missing, `skeleton 内に存在しないエントリ: ${missing.join(', ')}`).toEqual([]);
});

// --- Then: 特定エントリが記載されている ---

Then('ディレクトリ構造に {string} が記載されている', async ({}, name: string) => {
  expect(
    directoryStructureText,
    `ディレクトリ構造に "${name}" が見つかりません`,
  ).toContain(name);
});
