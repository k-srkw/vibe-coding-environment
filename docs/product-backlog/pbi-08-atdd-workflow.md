# PBI-8: ATDD ワークフローの統合と文書化

## ステータス: 未着手

## 依存

- [PBI-3: CLAUDE.md テンプレートの作成](pbi-03-claude-md-template.md)
- [PBI-4: Cucumber/Gherkin テスト構造の作成](pbi-04-cucumber-gherkin-structure.md)
- [PBI-7: GitHub Actions PR レビュー・CI](pbi-07-github-actions-ci.md)

## 説明

CLAUDE.md にハーネスエンジニアリングの具体的なワークフロー（Gherkin でテスト記述 → Claude Code で実装 → CI で検証）を記載し、サンプルの Feature ファイルとともに ATDD のベストプラクティスをテンプレートに組み込む。

## 受け入れ条件

- [ ] CLAUDE.md に ATDD ワークフローの手順が記載されている
- [ ] Claude Code に「まず .feature ファイルを書いてから実装する」というルールが設定されている
- [ ] サンプルの Feature ファイルが具体的な ATDD パターンを示している
- [ ] テンプレートから払い出した環境で ATDD フローを一通り実行できる

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| <!-- 着手時に記入 --> | | |

## 想定する成果物

- `skeleton/CLAUDE.md` の更新
- サンプル Feature ファイル

## 完了証跡

<!-- PBI 完了時に記入。このセクションが空の状態で「完了」にしてはならない -->
- テスト実行結果:
- 確認日時:
- 備考:
