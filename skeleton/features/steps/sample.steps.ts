import { expect } from '@playwright/test';
import { Given, When, Then } from '../support/fixtures';

let result: boolean | null;

Given('前提条件が満たされている', async ({}) => {
  result = null;
});

When('アクションを実行する', async ({}) => {
  result = true;
});

Then('期待する結果が得られる', async ({}) => {
  expect(result).toBe(true);
});
