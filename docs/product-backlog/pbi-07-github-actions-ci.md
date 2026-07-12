# PBI-7: GitHub Actions — PR レビュー・CI ワークフロー

## ステータス: 完了

## 依存

- [PBI-4: Cucumber/Gherkin テスト構造の作成](pbi-04-cucumber-gherkin-structure.md)

## 説明

PR 作成時に Cucumber テストを自動実行し、レビューを支援する CI ワークフローを作成する。

## 受け入れ条件

- [x] `skeleton/.github/workflows/ci.yml` が存在する
- [x] PR 作成・更新時に自動でトリガーされる
- [x] Cucumber/Gherkin テストが実行される
- [x] リント・型チェックが実行される
- [x] テスト結果が PR のチェックとして表示される
- [x] テスト失敗時にわかりやすいエラーレポートが出る

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| skeleton/.github/workflows/ci.yml が存在する | 自動テスト | ci.yml ワークフローファイルが存在する |
| PR 作成・更新時に自動でトリガーされる | 自動テスト | PR 作成・更新時に自動でトリガーされる |
| Cucumber/Gherkin テストが実行される | 自動テスト | Cucumber テスト実行ステップが含まれている |
| リント・型チェックが実行される | 自動テスト | リント・型チェックのステップが含まれている |
| テスト結果が PR のチェックとして表示される | 自動テスト | テスト結果が PR のチェックとして表示される |
| テスト失敗時にわかりやすいエラーレポートが出る | 自動テスト | テスト失敗時にエラーレポートが生成される |

## 想定する成果物

- `skeleton/.github/workflows/ci.yml`

## 完了証跡

- テスト実行結果: 35 passed（6 scenarios for PBI-7 + 29 existing）, 1 skipped（GITHUB_TOKEN 未設定）
- 確認日時: 2026-07-12
- 備考:
  - CI ワークフローは `pull_request` トリガーで PR 作成・更新時に自動実行
  - 型チェックは `npx tsc --noEmit` で実行（ESLint 等の追加ツール不要）
  - テスト結果レポートは `actions/upload-artifact@v4` で `test-results/` をアップロード（`if: always()` で失敗時も実行）
  - setup.yml と ci.yml のステップ定義で共有する Then ステップのために `workflow-state.ts` を導入し、ワークフロー状態を共有モジュールで管理
  - 関連 ADR: なし（既存パターンの踏襲のみ、新規の設計判断なし）
