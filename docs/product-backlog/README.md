# プロダクトバックログ

## Product Goal

> RHDH Local の Software Template を通じて、Claude Code によるバイブコーディング環境（GitHub リポジトリ + CLAUDE.md + ATDD テストハーネス + CI/CD）をワンクリックで払い出し、品質を担保しながら AI 支援開発を実践できるようにする。

## 前提条件

| 項目 | 選定 |
|------|------|
| コンテナ実行環境 | Podman + podman-compose (`podman compose`) |
| RHDH | RHDH Local (ローカル開発環境) |
| テストフレームワーク | Cucumber/Gherkin (ATDD) |
| CI/CD | GitHub Actions |
| 対象言語 (MVP) | Node.js / TypeScript |

## MVP 定義

### スコープ内

- RHDH Local 上で動作する Software Template 1 種類（Node.js/TypeScript 向け）
- テンプレートから GitHub リポジトリを自動作成（CLAUDE.md・Cucumber 構造・GitHub Actions を含む）
- GitHub Actions による環境構築の自動化（依存パッケージインストール・初期設定）
- 環境構築完了の自動検証（ヘルスチェック）
- PR ベースのコードレビューワークフロー（GitHub Actions で Cucumber テスト実行）
- ATDD ワークフロー（Gherkin でテストを書き → Claude Code で実装 → CI で検証）

### スコープ外

- 複数言語/フレームワーク対応
- RHDH クラスタ版（OpenShift 上）への対応
- Tekton/OpenShift Pipelines 連携
- Dev Container 定義
- TechDocs 自動生成
- テンプレートの GUI カスタマイズ機能

## PBI 一覧

| # | PBI | ステータス | 依存 |
|---|-----|-----------|------|
| 1 | [RHDH Local 環境のセットアップ](pbi-01-rhdh-local-setup.md) | 完了 | なし |
| 2 | [Software Template の骨格作成](pbi-02-software-template-skeleton.md) | 完了 | PBI-1 |
| 3 | [CLAUDE.md テンプレートの作成](pbi-03-claude-md-template.md) | 完了 | PBI-2 |
| 4 | [Cucumber/Gherkin テスト構造の作成](pbi-04-cucumber-gherkin-structure.md) | 完了 | PBI-2 |
| 5 | [GitHub Actions 環境構築自動化](pbi-05-github-actions-setup.md) | 完了 | PBI-2, PBI-4 |
| 6 | [環境構築完了の自動検証](pbi-06-setup-verification.md) | 完了 | PBI-5 |
| 7 | [GitHub Actions PR レビュー・CI](pbi-07-github-actions-ci.md) | 未着手 | PBI-4 |
| 8 | [ATDD ワークフローの統合と文書化](pbi-08-atdd-workflow.md) | 未着手 | PBI-3, PBI-4, PBI-7 |
| 9 | [E2E 統合テスト](pbi-09-e2e-integration-test.md) | 未着手 | PBI-1〜8 |

## 依存関係

```
PBI-1 (依存なし) ← 最初に着手可能
  └→ PBI-2
       ├→ PBI-3 ──────┐
       ├→ PBI-4 ──────┤→ PBI-8
       │    ├→ PBI-5 → PBI-6
       │    └→ PBI-7 ─┘
       └──────────────────→ PBI-9
```

## Definition of Done (DoD)

全 PBI に共通の完了基準。詳細は [definition-of-done.md](definition-of-done.md) を参照。

## PBI の進め方

### 着手前

1. 着手する PBI のファイルを読み込む
2. 依存する PBI がすべて「完了」であることを確認する
3. 受け入れ条件を Gherkin シナリオに変換する（`.feature` ファイルを作成）
4. Plan モードで実装計画を立てる

### 実装

5. Gherkin シナリオに対応するステップ定義と実装コードを作成する
6. テストが Green になるまで実装を繰り返す

### 完了判定（DoD チェック）

7. [definition-of-done.md](definition-of-done.md) のチェックリストを全項目検証する
8. PBI ファイルの「完了証跡」セクションにテスト結果を記録する
9. PBI ファイルのステータスを「完了」に更新し、この README の一覧テーブルも更新する
