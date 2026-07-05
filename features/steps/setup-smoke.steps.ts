import { expect } from '@playwright/test';
import { Given, Then } from '../support/fixtures';

Given('テスト環境が初期化されている', async ({}) => {
  // playwright-bdd + Playwright Test が正しく動作していることを確認
});

Then('テストが正常に実行できる', async ({}) => {
  expect(true).toBe(true);
});
