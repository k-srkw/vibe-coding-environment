Feature: GitHub Actions PR レビュー・CI ワークフロー

  PBI-7: PR 作成時に Cucumber テストを自動実行し、レビューを支援する CI ワークフローを作成する。

  # AC1: skeleton/.github/workflows/ci.yml が存在する
  Scenario: ci.yml ワークフローファイルが存在する
    Then skeleton/.github/workflows/ci.yml が存在する

  # AC2: PR 作成・更新時に自動でトリガーされる
  Scenario: PR 作成・更新時に自動でトリガーされる
    Given ci.yml を読み込んでいる
    Then pull_request トリガーが設定されている

  # AC3: Cucumber/Gherkin テストが実行される
  Scenario: Cucumber テスト実行ステップが含まれている
    Given ci.yml を読み込んでいる
    Then テストを実行するステップが含まれている

  # AC4: リント・型チェックが実行される
  Scenario: リント・型チェックのステップが含まれている
    Given ci.yml を読み込んでいる
    Then 型チェックを実行するステップが含まれている

  # AC5: テスト結果が PR のチェックとして表示される
  Scenario: テスト結果が PR のチェックとして表示される
    Given ci.yml を読み込んでいる
    Then ワークフローに name が定義されている
    And ジョブに name が定義されている

  # AC6: テスト失敗時にわかりやすいエラーレポートが出る
  Scenario: テスト失敗時にエラーレポートが生成される
    Given ci.yml を読み込んでいる
    Then テスト結果レポートをアップロードするステップが含まれている
