# PBI-2: Software Template の骨格作成

## ステータス: 完了

## 依存

- [PBI-1: RHDH Local 環境のセットアップ](pbi-01-rhdh-local-setup.md)

## 説明

バイブコーディング環境を払い出すための Software Template の基本構造を作成する。テンプレートは最小限のパラメータ（プロジェクト名・オーナー・リポジトリ名）を受け取り、GitHub リポジトリを作成する。

## 受け入れ条件

- [x] `template.yaml` が定義され、RHDH Local に登録できる
- [x] テンプレート UI でパラメータを入力できる
- [x] テンプレート実行で GitHub リポジトリが作成される
- [x] `skeleton/` ディレクトリに雛形ファイルが含まれている

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| template.yaml が定義され、RHDH Local に登録できる | 自動テスト | template.yaml が定義され RHDH Local に登録できる |
| テンプレート UI でパラメータを入力できる | 自動テスト | テンプレート UI でパラメータを入力できる |
| テンプレート実行で GitHub リポジトリが作成される | 自動テスト | テンプレート実行で GitHub リポジトリが作成される（Scaffolder API 経由。GITHUB_TOKEN 未設定時はスキップ） |
| skeleton/ ディレクトリに雛形ファイルが含まれている | 自動テスト | skeleton ディレクトリに雛形ファイルが含まれている |

## 想定する成果物

- `template.yaml`
- `skeleton/` ディレクトリ

## 完了証跡

- テスト実行結果: 8 scenarios（8 passed）, 全ステップ passed（14.6s）
- 確認日時: 2026-07-11
- 備考:
  - AC3（テンプレート実行で GitHub リポジトリが作成される）は GITHUB_TOKEN 設定時のみ実行される自動テスト。未設定時は正常にスキップ
  - GitHub 連携は RHDH Local に設定済みの GitHub App credentials を使用。テスト用 PAT（`GITHUB_TOKEN`）はテストコードからの GitHub API 呼び出し（検証・クリーンアップ）にのみ使用し、`app-config.local.yaml` には書き込まない
  - テスト前後にカタログ Location と GitHub リポジトリをクリーンアップし、繰り返し実行時の `catalog:register` 409 Conflict を防止
  - テンプレート登録は `app-config.local.yaml` への `catalog.locations` 追加 + RHDH コンテナ再起動で実現。Backstage の config 配列上書きルールに対応するため、デフォルトエントリも含めて設定
  - ゲストログイン処理: GitHub 認証との共存時にサインイン画面が表示されるため、`navigateWithGuestLogin` ヘルパーで Enter ボタンのクリックを自動化
  - PBI-1 との共通コード（`composeExec`, 定数類）を `features/support/` に共通モジュールとして抽出
- 関連 ADR: [ADR-0002](../adr/0002-template-registration-via-app-config.md)
