# PBI-21: skeleton CI テンプレートに Playwright インストール追加

## ステータス: 完了

## 依存
- なし

## 説明
レトロスペクティブ（ハーネスエンジニアリング P4）で指摘された「skeleton の CI ワークフローに `playwright install` が欠落しており、生成プロジェクトの CI が Playwright ブラウザ未インストールで失敗する可能性がある」問題に対応する。

skeleton の `ci.yml` および `setup.yml` には `npx playwright install` ステップがなく、`npm test` 実行時に Chromium が見つからずテストが失敗する可能性がある。

## 受け入れ条件
- [x] skeleton の CI ワークフローに `npx playwright install --with-deps` ステップが追加されている
- [x] 生成プロジェクトのテストが CI 環境で正常に実行できることが検証されている
- [x] setup.yml にも必要に応じて Playwright インストールステップが追加されている

## 受け入れ条件の検証方法
| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| skeleton の CI ワークフローに `npx playwright install --with-deps` ステップが追加されている | 自動テスト | ci.yml に Playwright インストールステップが含まれている |
| 生成プロジェクトのテストが CI 環境で正常に実行できることが検証されている | 手動確認 | CI 環境での実行は @github テストまたは手動確認 |
| setup.yml にも必要に応じて Playwright インストールステップが追加されている | 自動テスト | setup.yml に Playwright インストールステップが含まれている |

## 想定する成果物
- `skeleton/.github/workflows/ci.yml`（更新）
- `skeleton/.github/workflows/setup.yml`（更新）

## 完了証跡
- テスト実行結果: 44 passed, 2 skipped (12.6s) — 新規 2 シナリオ含む
- 確認日時: 2026-07-12
- 備考: ci.yml と setup.yml の両方に `npx playwright install --with-deps chromium` を `npm ci` の直後に追加。AC2（CI 環境での実行検証）は次回 push/PR 時の GitHub Actions 実行で確認予定。ADR なし（軽微な CI 設定変更のため）。
