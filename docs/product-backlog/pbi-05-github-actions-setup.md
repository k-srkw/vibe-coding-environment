# PBI-5: GitHub Actions — 環境構築自動化ワークフロー

## ステータス: 完了

## 依存

- [PBI-2: Software Template の骨格作成](pbi-02-software-template-skeleton.md)
- [PBI-4: Cucumber/Gherkin テスト構造の作成](pbi-04-cucumber-gherkin-structure.md)

## 説明

テンプレートからリポジトリ作成後に自動実行される GitHub Actions ワークフローを作成する。依存パッケージのインストール、初期設定、環境構築が完了したことの基本検証を行う。

## 受け入れ条件

- [x] `skeleton/.github/workflows/setup.yml` が存在する
- [x] リポジトリ作成後の初回 push（または手動トリガー）で実行される
- [x] 依存パッケージのインストール（`npm ci`）が成功する
- [x] 環境構築の基本的な検証ステップが含まれている（ビルド成功、テスト実行可能）
- [x] 結果が GitHub Actions の UI で確認できる

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| `skeleton/.github/workflows/setup.yml` が存在する | ファイル存在チェック（自動テスト） | setup.yml ワークフローファイルが存在する |
| 初回 push または手動トリガーで実行される | YAML の `on` トリガー設定を検証（自動テスト） | 初回 push または手動トリガーで実行される |
| `npm ci` が成功する | YAML に `npm ci` ステップが含まれることを検証（自動テスト） | npm ci による依存パッケージインストールステップが含まれている |
| 環境構築の基本的な検証ステップが含まれている | YAML にビルド・テスト実行ステップを検証（自動テスト） | ビルドとテスト実行の検証ステップが含まれている |
| 結果が GitHub Actions の UI で確認できる | ワークフロー名・ジョブ名の存在を検証（自動テスト） | ワークフローとジョブに名前が定義されている |

## 想定する成果物

- `skeleton/.github/workflows/setup.yml`

## 完了証跡

- テスト実行結果: 22 tests (21 passed, 1 skipped), 5 シナリオ全て Green
- 確認日時: 2026-07-11
- 備考: PBI-5 の 5 シナリオすべて passed。skipped は既存の `@github` タグ付きテスト（PBI-2、GITHUB_TOKEN 未設定時スキップ）。既存テストのリグレッションなし。
