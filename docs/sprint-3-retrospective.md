# Sprint 3 レトロスペクティブ

- 実施日: 2026-07-12
- 対象期間: Sprint 2 レトロスペクティブ以降（10 コミット）
- 観点: 開発ワークフロー・Agent ワークフロー・SDLC、アーキテクチャ、テスト妥当性、CI テスト実行環境

## 観点 1: 開発ワークフロー・Agent ワークフロー・SDLC

### Keep

| # | 項目 | 根拠 |
|---|------|------|
| K1 | PBI-20 で Red-Green-Refactor の中間コミットが実現 | feat → fix → refactor → docs の 4 コミット構成。Sprint 1 の「1 PBI = 1 スカッシュコミットで履歴消失」問題が改善 |
| K2 | CI/CD パイプラインの自動化達成 | PBI-20 完了。push/PR 時に 52 テストが自動実行。CI 初回失敗も同日中に修正・Green 化 |
| K3 | README と PBI ファイルのステータス整合性 100% | 全 24 PBI で不整合なし |
| K4 | 完了 PBI の ADR 要否明記が定着傾向 | PBI-13「ADR なし（軽微なドキュメント修正のため）」、PBI-21「ADR なし（軽微な CI 設定変更のため）」と理由付きで記載 |

### Problem → Try

| # | Problem | 影響 | Try | 対応 PBI |
|---|---------|------|-----|---------|
| P1 | 全 31 コミットが main 直接コミット | 並列作業不可、レビューなしでマージ | feature branch + PR ワークフローを導入 | **PBI-18**（既存） |
| P2 | Sprint 2 の 14 Problem のうち解決は 3 件のみ（21%） | 改善サイクルが回っていない | 次スプリントで優先度の高い改善 PBI（PBI-10, PBI-11）を先に消化 | 既存 PBI の優先度調整 |
| P3 | PBI-20 の完了証跡に ADR 要否の明示的記載がない | DoD 7 項目目の準拠漏れ（PBI-03, PBI-05, PBI-06 と同様の再発） | DoD 自体に ADR 要否記載を必須化 | **PBI-11**（既存） |
| P4 | Phase 番号ギャップ（3 → 5）が未修正のまま | スキル利用時の混乱リスク | Phase 番号を修正 | **PBI-10**（既存） |

---

## 観点 2: アーキテクチャ

### Keep

| # | 項目 | 根拠 |
|---|------|------|
| K1 | RHDH 可用性チェックを `isRhdhAvailable()` に共通化 | 3 箇所の重複チェックを `constants.ts` のヘルパー関数に集約。CI スキップも自然に動作 |
| K2 | `hasUsesStepContaining()` ヘルパーの追加と再利用 | `workflow-state.ts` に追加し、2 つのステップ定義ファイルで共有 |
| K3 | support モジュールの責務分離が明確 | 9 モジュール・564 行。constants / fixtures / workflow 系 / helpers 各系統の責務が明確 |
| K4 | パス定数の集約 | 全パス定数が `constants.ts` に集約。13 ステップ定義中 12 が参照 |

### Problem → Try

| # | Problem | 影響 | Try | 対応 PBI |
|---|---------|------|-----|---------|
| P1 | `workflow-state.ts` がモジュールレベル変数でミュータブル状態を保持 | テスト間の状態リーク、並列テスト時の競合リスク | Playwright fixture ベースに移行 | **PBI-12**（既存） |
| P2 | CLAUDE.md にアーキテクチャ概要がない | Claude Code が features/support の構造や skeleton との関係を把握できない | アーキテクチャセクションを追加 | **PBI-22**（既存） |
| P3 | skeleton の `@types/node` が `^22.0.0`、ルートは `^26.1.1` | 生成プロジェクトが古い型定義に依存。将来的な型不整合リスク | バージョンを統一 | **PBI-25**（新規） |
| P4 | `settings.local.json` にデバッグ時の残骸ルール | git commit ルールの重複等 | クリーンアップ | **PBI-23**（既存） |

---

## 観点 3: テスト妥当性

### Keep

| # | 項目 | 根拠 |
|---|------|------|
| K1 | テスト数 46 → 52 に増加（6 新規シナリオ） | PBI-20 で template-project-ci.feature を追加 |
| K2 | CI 環境でのテストスキップが適切に動作 | `isRhdhAvailable()` で RHDH 依存テストをスキップ、`test.skip(!GITHUB_TOKEN)` で @github テストをスキップ |
| K3 | 全完了 PBI の検証方法テーブルが記入済み | Phase 2 のワークフロー指示が運用に定着 |

### Problem → Try

| # | Problem | 影響 | Try | 対応 PBI |
|---|---------|------|-----|---------|
| P1 | テスト種別の偏り: 静的 81% vs 動的 19% | 構造は正しいが振る舞いが壊れるリグレッションを検出できない | 動的行動テストの比率を高める | **PBI-16**（既存） |
| P2 | 手動確認の受け入れ条件が 7 件残存 | 自動リグレッション検出の対象外 | CI 環境整備後に自動化を検討 | **PBI-17**（既存）が前提 |
| P3 | @github テストが CI で実行されない | E2E 統合テストがリグレッション対象外 | CI に GITHUB_TOKEN を設定し有効化 | **PBI-17**（既存） |

---

## 観点 4: CI テスト実行環境

### Keep

| # | 項目 | 根拠 |
|---|------|------|
| K1 | CI パイプラインが稼働し Green を維持 | PBI-20 で追加した `.github/workflows/test.yml` が正常動作。初回失敗を同日修正 |
| K2 | RHDH 依存テストのスキップが安全に動作 | `isRhdhAvailable()` による条件スキップで CI が false-negative にならない |

### Problem → Try

| # | Problem | 影響 | Try | 対応 PBI |
|---|---------|------|-----|---------|
| P1 | CI で RHDH Local 依存テスト 6 件がスキップされている | 動的行動テスト（テンプレート登録、UI アクセス、compose 起動）が CI で一切検証されない。CI の Green は構造の正しさのみ保証し、振る舞いの正しさは保証していない | GitHub Actions で Podman コンテナを起動して RHDH Local テストを CI で実行可能にする | **PBI-17**（既存、スコープ拡張を検討） |
| P2 | CI テスト 52 件中 8 件（15%）がスキップ | テストカバレッジの実効値が 85% にとどまる | PBI-17 の完了後に RHDH + @github テストの両方を CI で有効化 | **PBI-17**（既存） |

---

## メトリクスサマリー

| メトリクス | 値 | 備考 |
|-----------|-----|------|
| 対象期間コミット数 | 10 | Sprint 2 レトロスペクティブ以降 |
| 完了 PBI 数（今期） | 3 | PBI-13, PBI-20, PBI-21 |
| 累計完了 PBI 数 | 12/24 | 50% 完了 |
| テスト数（ローカル） | 52 | 50 passed, 2 skipped |
| テスト数（CI） | 52 | 44 passed, 8 skipped |
| CI テストカバレッジ実効値 | 85% | 8/52 テストがスキップ |
| ADR 数 | 3 | 今期の新規 ADR なし |
| テスト種別比率 | 静的 81% / 動的 19% | Sprint 2 時点の 76%/24% から静的寄りに微増 |
| Sprint 2 Problem 解決率 | 3/14 (21%) | PBI-13, PBI-20, PBI-21 |
| DoD 完全準拠率 | 8/12 (67%) | ADR 要否記載漏れ: PBI-03, 05, 06, 20 |

## 改善 PBI 一覧

### 新規作成

| # | PBI | カテゴリ |
|---|-----|---------|
| PBI-25 | [skeleton の @types/node バージョンをルートプロジェクトと統一](product-backlog/pbi-25-skeleton-types-node-update.md) | アーキテクチャ |

### 既存 PBI で対応済み

| Problem | 対応 PBI |
|---------|---------|
| main 直接コミット（ブランチ戦略なし） | PBI-18 |
| ADR 要否記載の DoD 必須化 | PBI-11 |
| Phase 番号ギャップ | PBI-10 |
| workflow-state.ts ミュータブル状態 | PBI-12 |
| CLAUDE.md アーキテクチャ概要なし | PBI-22 |
| settings.local.json デバッグ残骸 | PBI-23 |
| テスト種別偏り（静的 81%） | PBI-16 |
| @github テスト CI 未実行 | PBI-17 |
| RHDH Local テスト CI 未実行 | PBI-17（スコープ拡張を検討） |
