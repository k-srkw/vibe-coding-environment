# PBI-9: E2E 統合テスト — テンプレートから環境払い出しの通し検証

## ステータス: 未着手

## 依存

- [PBI-1: RHDH Local 環境のセットアップ](pbi-01-rhdh-local-setup.md)
- [PBI-2: Software Template の骨格作成](pbi-02-software-template-skeleton.md)
- [PBI-3: CLAUDE.md テンプレートの作成](pbi-03-claude-md-template.md)
- [PBI-4: Cucumber/Gherkin テスト構造の作成](pbi-04-cucumber-gherkin-structure.md)
- [PBI-5: GitHub Actions 環境構築自動化](pbi-05-github-actions-setup.md)
- [PBI-6: 環境構築完了の自動検証](pbi-06-setup-verification.md)
- [PBI-7: GitHub Actions PR レビュー・CI](pbi-07-github-actions-ci.md)
- [PBI-8: ATDD ワークフローの統合と文書化](pbi-08-atdd-workflow.md)

## 説明

テンプレート実行から環境構築完了・ATDD ワークフロー実行まで、エンドツーエンドで通しの検証を行い、MVP としての完成を確認する。

## 受け入れ条件

- [ ] RHDH Local でテンプレートを実行し、GitHub リポジトリが作成される
- [ ] GitHub Actions の setup ワークフローが成功する
- [ ] 環境構築完了の検証がパスする
- [ ] Gherkin でテストを書き、Claude Code で実装し、PR を作成する一連の流れが成功する
- [ ] CI ワークフローがトリガーされ、テスト結果が PR に表示される
- [ ] 全体の手順が README に記載されている

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| <!-- 着手時に記入 --> | | |

## 想定する成果物

- E2E テスト結果
- README の最終更新

## 完了証跡

<!-- PBI 完了時に記入。このセクションが空の状態で「完了」にしてはならない -->
- テスト実行結果:
- 確認日時:
- 備考:
