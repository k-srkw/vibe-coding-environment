# PBI-4: Cucumber/Gherkin テスト構造の作成

## ステータス: 完了

## 依存

- [PBI-2: Software Template の骨格作成](pbi-02-software-template-skeleton.md)

## 説明

Software Template のスケルトンに Cucumber/Gherkin のディレクトリ構造とサンプルテストを含め、払い出し直後から ATDD を開始できる状態にする。

## 受け入れ条件

- [x] `skeleton/features/` にサンプル `.feature` ファイルが含まれている
- [x] `skeleton/features/steps/` にステップ定義の雛形が含まれている
- [x] `skeleton/features/support/` にワールド設定が含まれている
- [x] `package.json` に `playwright-bdd` と関連パッケージが定義されている
- [x] `npm test` でサンプルテストが実行・パスする

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| skeleton/features/ にサンプル .feature ファイルが含まれている | 自動テスト | skeleton/features/ にサンプル .feature ファイルが含まれている |
| skeleton/features/steps/ にステップ定義の雛形が含まれている | 自動テスト | skeleton/features/steps/ にステップ定義の雛形が含まれている |
| skeleton/features/support/ にワールド設定が含まれている | 自動テスト | skeleton/features/support/ にワールド設定が含まれている |
| package.json に playwright-bdd と関連パッケージが定義されている | 自動テスト | package.json に playwright-bdd 関連パッケージが定義されている |
| npm test でサンプルテストが実行・パスする | 自動テスト | skeleton のサンプルテストが実行・パスする |

## 想定する成果物

- `skeleton/features/` ディレクトリ
- `skeleton/features/sample.feature`
- `skeleton/features/steps/sample.steps.ts`
- `skeleton/features/support/fixtures.ts`
- `skeleton/package.json`
- `skeleton/playwright.config.ts`
- `skeleton/tsconfig.json`

## 完了証跡

- テスト実行結果: 16 passed（5 scenarios for PBI-4 + 11 existing）, 1 skipped（GITHUB_TOKEN 未設定）
- 確認日時: 2026-07-11
- 備考:
  - skeleton のテストフレームワークは root プロジェクトと同じ playwright-bdd を採用（PBI 原案の `@cucumber/cucumber` から変更）
  - AC5 テストでは skeleton を一時ディレクトリにコピーし、Nunjucks 変数を置換後に `npm install` + `npm test` を実行して検証
  - サブプロセスでの `npm test` 実行時、親プロセスの `PLAYWRIGHT_BDD_CONFIGS` 等の環境変数が漏れるとモジュール解決エラーが発生するため、`buildCleanEnv()` ヘルパーで Playwright/npm/test-runner 関連の環境変数をストリップ
  - skeleton/CLAUDE.md のディレクトリ構造に `support/` を追加
  - 関連 ADR: なし（フレームワーク選定は root プロジェクトとの一貫性で決定、新規の設計判断なし）
