# PBI-1: RHDH Local 環境のセットアップ

## ステータス: 完了

## 依存

なし（最初に着手可能）

## 説明

RHDH Local をローカルで起動し、カスタム Software Template を登録できる状態にする。

## 受け入れ条件

- [x] `podman compose up` で RHDH Local が起動する
- [x] ブラウザから RHDH Local の UI にアクセスできる
- [x] カスタムテンプレートのカタログ登録方法が確立されている
- [x] 手順が README に記載されている

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| `podman compose up` で RHDH Local が起動する | 自動テスト | podman compose up で RHDH Local が起動する |
| ブラウザから RHDH Local の UI にアクセスできる | 自動テスト | ブラウザから RHDH Local の UI にアクセスできる |
| カスタムテンプレートのカタログ登録方法が確立されている | 手動確認 | — |
| 手順が README に記載されている | 自動テスト | セットアップ手順が README に記載されている |

## 想定する成果物

- `rhdh-local/compose.yaml`（公式リポジトリ clone、ローカル管理）
- `README.md`（セットアップ手順）

## 完了証跡

- テスト実行結果: 4 scenarios, 全ステップ passed（11.8s）
- 確認日時: 2026-07-05
- 備考:
  - AC3（カスタムテンプレートのカタログ登録方法の確立）は手動確認。README.md にローカルファイル / GitHub URL 両方の登録手順を記載済み
  - compose.yaml は公式 rhdh-local リポジトリを clone して使用（`rhdh-local/` は `.gitignore` でローカル管理）
  - Playwright ブラウザバージョン更新が必要だった（`npx playwright install chromium`）
- 関連 ADR: [ADR-0001](../adr/0001-clone-rhdh-local-repository.md)
