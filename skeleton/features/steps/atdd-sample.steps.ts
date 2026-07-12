import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';

let result: string | number | null;

Given('フォーマッターが初期化されている', async ({}) => {
  result = null;
});

When('{string} を大文字に変換する', async ({}, input: string) => {
  result = input.toUpperCase();
});

When('{string} を小文字に変換する', async ({}, input: string) => {
  result = input.toLowerCase();
});

When('{string} の長さを取得する', async ({}, input: string) => {
  result = input.length;
});

Then('結果は {string} である', async ({}, expected: string) => {
  expect(result).toBe(expected);
});

Then('結果は {int} である', async ({}, expected: number) => {
  expect(result).toBe(expected);
});
