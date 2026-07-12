# PBI-21: skeleton CI テンプレートに Playwright インストール追加

## ステータス: 未着手

## 依存
- なし

## 説明
レトロスペクティブ（ハーネスエンジニアリング P4）で指摘された「skeleton の CI ワークフローに `playwright install` が欠落しており、生成プロジェクトの CI が Playwright ブラウザ未インストールで失敗する可能性がある」問題に対応する。

skeleton の `ci.yml` および `setup.yml` には `npx playwright install` ステップがなく、`npm test` 実行時に Chromium が見つからずテストが失敗する可能性がある。

## 受け入れ条件
- [ ] skeleton の CI ワークフローに `npx playwright install --with-deps` ステップが追加されている
- [ ] 生成プロジェクトのテストが CI 環境で正常に実行できることが検証されている
- [ ] setup.yml にも必要に応じて Playwright インストールステップが追加されている

## 受け入れ条件の検証方法
| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| <!-- 着手時に記入 --> | | |

## 想定する成果物
- `skeleton/template/.github/workflows/ci.yml.njk`（更新）
- `skeleton/template/.github/workflows/setup.yml.njk`（更新）

## 完了証跡
<!-- PBI 完了時に記入。このセクションが空の状態で「完了」にしてはならない -->
- テスト実行結果:
- 確認日時:
- 備考:
