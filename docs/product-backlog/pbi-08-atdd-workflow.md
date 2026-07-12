# PBI-8: ATDD ワークフローの統合と文書化

## ステータス: 完了

## 依存

- [PBI-3: CLAUDE.md テンプレートの作成](pbi-03-claude-md-template.md)
- [PBI-4: Cucumber/Gherkin テスト構造の作成](pbi-04-cucumber-gherkin-structure.md)
- [PBI-7: GitHub Actions PR レビュー・CI](pbi-07-github-actions-ci.md)

## 説明

CLAUDE.md にハーネスエンジニアリングの具体的なワークフロー（Gherkin でテスト記述 → Claude Code で実装 → CI で検証）を記載し、サンプルの Feature ファイルとともに ATDD のベストプラクティスをテンプレートに組み込む。

## 受け入れ条件

- [x] CLAUDE.md に ATDD ワークフローの手順が記載されている
- [x] Claude Code に「まず .feature ファイルを書いてから実装する」というルールが設定されている
- [x] サンプルの Feature ファイルが具体的な ATDD パターンを示している
- [x] テンプレートから払い出した環境で ATDD フローを一通り実行できる

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| CLAUDE.md に ATDD ワークフローの手順が記載されている | 自動テスト | CLAUDE.md に ATDD ワークフローの手順が記載されている |
| Claude Code に .feature ファイル先行ルールが設定されている | 自動テスト | Claude Code に .feature ファイル先行ルールが設定されている |
| サンプルの Feature ファイルが具体的な ATDD パターンを示している | 自動テスト | サンプルの Feature ファイルが具体的な ATDD パターンを示している |
| テンプレートから払い出した環境で ATDD フローを一通り実行できる | 自動テスト | テンプレートから払い出した環境で ATDD フローを一通り実行できる |

## 想定する成果物

- `skeleton/CLAUDE.md` の更新
- サンプル Feature ファイル

## 完了証跡

- テスト実行結果: 39 passed（4 scenarios for PBI-8 + 35 existing）, 1 skipped（GITHUB_TOKEN 未設定）
- 確認日時: 2026-07-12
- 備考:
  - skeleton/CLAUDE.md に「ATDD ワークフロー」セクションを追加し、Gherkin 記述→実装→CI 検証の 3 ステップを明文化
  - `.feature ファイルを先に書く` ルールを厳守事項として明示化（既存の「テストを先に書く」を具体化）
  - ATDD パターンガイド（Scenario Outline / Background / タグ）を CLAUDE.md に追加
  - `skeleton/features/atdd-sample.feature` で文字列フォーマッターを題材に ATDD パターンのサンプルを提供
  - AC4 のテストは PBI-4 のステップ定義（skeleton 展開・npm test 実行）を再利用
  - playwright-bdd では Given/When/Then のキーワードに関わらずステップテキストでマッチングされるため、異なるキーワードで同一ステップを再利用可能
  - 関連 ADR: なし（既存パターンの踏襲のみ、新規の設計判断なし）
