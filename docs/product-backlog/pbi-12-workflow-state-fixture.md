# PBI-12: workflow-state.ts の共有ミュータブル状態を Playwright fixture に移行

## ステータス: 未着手

## 依存

- なし

## 説明

`features/support/workflow-state.ts` がモジュールレベルの `let workflow` 変数で状態を共有しており、テスト実行順序やワーカー数の変更で干渉リスクがある。Playwright fixture（テスト単位のスコープ）に移行し、テスト間の状態分離を保証する。

## 受け入れ条件

- [ ] `workflow-state.ts` のモジュールレベル変数が廃止されている
- [ ] ワークフロー YAML の状態が Playwright fixture で管理されている
- [ ] `github-actions-setup.steps.ts` と `github-actions-ci.steps.ts` が fixture 経由で状態を受け取っている
- [ ] 全テストが Green である

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| <!-- 着手時に記入 --> | | |

## 想定する成果物

- `features/support/workflow-state.ts` の更新（または廃止）
- `features/support/fixtures.ts` の更新
- `features/steps/github-actions-setup.steps.ts` の更新
- `features/steps/github-actions-ci.steps.ts` の更新

## 完了証跡

<!-- PBI 完了時に記入。このセクションが空の状態で「完了」にしてはならない -->
- テスト実行結果:
- 確認日時:
- 備考:
- ADR: <!-- ADR 要否の判断理由を記入（例: 「設計判断は軽微のため ADR なし」） -->
