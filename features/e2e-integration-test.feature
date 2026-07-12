Feature: E2E 統合テスト — テンプレートから環境払い出しの通し検証

  PBI-9: テンプレート実行から環境構築完了・ATDD ワークフロー実行まで、
  エンドツーエンドで通しの検証を行い、MVP としての完成を確認する。

  # AC1: RHDH Local でテンプレートを実行し、GitHub リポジトリが作成される
  @github
  Scenario: テンプレート実行で GitHub リポジトリが作成され MVP 構成ファイルが含まれている
    Given テンプレートが RHDH Local に登録されている
    And GitHub 連携が設定されている
    When Scaffolder API で E2E テスト用テンプレートを実行する
    Then GitHub に E2E テスト用リポジトリが作成される
    And E2E テスト用リポジトリに CLAUDE.md が含まれている
    And E2E テスト用リポジトリに Cucumber テスト構造が含まれている
    And E2E テスト用リポジトリに GitHub Actions ワークフローが含まれている

  # AC2: GitHub Actions の setup ワークフローが成功する — 手動確認
  # AC3: 環境構築完了の検証がパスする — 手動確認
  # AC4: ATDD ワークフローの一連の流れが成功する — 手動確認
  # AC5: CI ワークフローがトリガーされ、テスト結果が PR に表示される — 手動確認

  # AC6: 全体の手順が README に記載されている
  Scenario: E2E テスト手順が README に記載されている
    Given プロジェクトルートに README.md が存在する
    Then README に E2E テストの実行手順セクションが含まれている
    And README に前提条件が記載されている
    And README に手順の概要が記載されている
