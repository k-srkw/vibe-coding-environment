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

## 優先順位の決定方法

Product Goal 達成に対する **Impact（貢献度）** と **Effort（コスト）** の 2 軸で優先順位を決定する。

### Impact（Product Goal 達成への貢献度）

| レベル | 基準 |
|--------|------|
| **H**（高） | Product Goal の実現に直結する（機能の核心、ブロッカー解消） |
| **M**（中） | Product Goal を間接的に支援する（品質向上、効率改善） |
| **L**（低） | あると良いが、なくても Product Goal は達成可能 |

### Effort（T-Shirt Sizing）

| レベル | 基準 |
|--------|------|
| **S** | 即座に完了できる（設定変更、ドキュメント修正） |
| **M** | 半日程度の実装 |
| **L** | 1 日以上かかる大きな変更 |

### 優先順位マトリクス

| 優先度 | Impact × Effort | アクション |
|--------|----------------|-----------|
| 1 | H × S | 即効で大きな価値 |
| 2 | H × M | 計画して着手 |
| 3 | M × S | クイックウィン |
| 4 | H × L | 重要だが大きい、計画的に |
| 5 | M × M | 中程度 |
| 6 | M × L | 余裕があれば |
| 7 | L × S | ついでに |
| 8 | L × M | 後回し |
| 9 | L × L | やらない（バックログから除外を検討） |

## PBI 一覧

### 未着手（優先度順）

| 優先度 | # | PBI | ステータス | Impact | Effort |
|--------|---|-----|-----------|--------|--------|
| 3 | 18 | [Feature branch + PR ワークフローの導入](pbi-18-feature-branch-workflow.md) | 未着手 | M | S |
| 4 | 17 | [@github テストの CI 実行環境整備](pbi-17-github-ci-e2e-setup.md) | 未着手 | H | L |
| 5 | 12 | [workflow-state.ts を Playwright fixture に移行](pbi-12-workflow-state-fixture.md) | 未着手 | M | M |
| 5 | 14 | [RHDH Local の認証情報管理を環境変数ベースに統一](pbi-14-rhdh-credential-management.md) | 未着手 | M | M |
| 5 | 15 | [テンプレートパラメータ境界値テスト](pbi-15-template-parameter-boundary-test.md) | 未着手 | M | M |
| 5 | 16 | [生成プロジェクトの動的行動テスト強化](pbi-16-behavioral-test-enhancement.md) | 未着手 | M | M |
| 5 | 19 | [PBI ワークフロースキルに並列実装モードを追加](pbi-19-parallel-pbi-implementation.md) | 未着手 | M | M |
| 5 | 22 | [CLAUDE.md にアーキテクチャ概要セクションを追加](pbi-22-claude-md-architecture-section.md) | 未着手 | M | M |
| 6 | 24 | [スキル間コンテキスト共有メカニズムの設計](pbi-24-skill-context-sharing.md) | 未着手 | M | L |
| 7 | 23 | [settings.local.json のクリーンアップ](pbi-23-settings-local-cleanup.md) | 未着手 | L | S |
| 7 | 25 | [skeleton の @types/node バージョンをルートプロジェクトと統一](pbi-25-skeleton-types-node-update.md) | 未着手 | L | S |

### 完了済み

| # | PBI | ステータス | Impact | Effort |
|---|-----|-----------|--------|--------|
| 1 | [RHDH Local 環境のセットアップ](pbi-01-rhdh-local-setup.md) | 完了 | H | M |
| 2 | [Software Template の骨格作成](pbi-02-software-template-skeleton.md) | 完了 | H | M |
| 3 | [CLAUDE.md テンプレートの作成](pbi-03-claude-md-template.md) | 完了 | H | S |
| 4 | [Cucumber/Gherkin テスト構造の作成](pbi-04-cucumber-gherkin-structure.md) | 完了 | H | M |
| 5 | [GitHub Actions 環境構築自動化](pbi-05-github-actions-setup.md) | 完了 | H | M |
| 6 | [環境構築完了の自動検証](pbi-06-setup-verification.md) | 完了 | H | M |
| 7 | [GitHub Actions PR レビュー・CI](pbi-07-github-actions-ci.md) | 完了 | H | M |
| 8 | [ATDD ワークフローの統合と文書化](pbi-08-atdd-workflow.md) | 完了 | H | M |
| 9 | [E2E 統合テスト](pbi-09-e2e-integration-test.md) | 完了 | H | L |
| 13 | [skeleton の CLAUDE.md から src/ 参照を修正](pbi-13-skeleton-src-reference.md) | 完了 | H | S |
| 20 | [テンプレートプロジェクトの CI/CD パイプライン追加](pbi-20-template-project-ci.md) | 完了 | H | M |
| 21 | [skeleton CI テンプレートに Playwright インストール追加](pbi-21-skeleton-ci-playwright-install.md) | 完了 | H | S |
| 10 | [PBI ワークフロースキルの Phase 番号修正](pbi-10-workflow-phase-numbering.md) | 完了 | M | S |
| 11 | [DoD に ADR 要否判断の記録を必須化](pbi-11-dod-adr-requirement.md) | 完了 | M | S |

## 依存関係

### PBI-1〜9（MVP）

```
PBI-1 (依存なし) ← 最初に着手可能
  └→ PBI-2
       ├→ PBI-3 ──────┐
       ├→ PBI-4 ──────┤→ PBI-8
       │    ├→ PBI-5 → PBI-6
       │    └→ PBI-7 ─┘
       └──────────────────→ PBI-9
```

### PBI-10〜24

```
全て依存なし（任意の順序で着手可能）
推奨着手順: 優先度 1 → 2 → ... → 7（Impact/Effort マトリクス順）
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
