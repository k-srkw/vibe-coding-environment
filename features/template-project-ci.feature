Feature: テンプレートプロジェクトの CI/CD パイプライン追加

  PBI-20: テンプレートプロジェクト（vibe-coding-environment）自体に CI/CD パイプラインを追加し、
  テストの自動実行によるリグレッション検出を実現する。

  # AC1: .github/workflows/ にテスト実行ワークフローが追加されている
  Scenario: テスト実行ワークフローファイルが存在する
    Then .github/workflows/test.yml が存在する

  # AC2: push / PR 作成時にテストが自動実行される
  Scenario: push 時にテストが自動実行される
    Given テンプレートプロジェクトの test.yml を読み込んでいる
    Then push トリガーが設定されている

  Scenario: PR 作成時にテストが自動実行される
    Given テンプレートプロジェクトの test.yml を読み込んでいる
    Then pull_request トリガーが設定されている

  # AC3: ワークフローで npm test が実行され、結果が PR にレポートされる
  Scenario: ワークフローで npm test が実行される
    Given テンプレートプロジェクトの test.yml を読み込んでいる
    Then ワークフローに "npm test" を実行するステップが含まれている

  Scenario: テスト結果が PR にレポートされる
    Given テンプレートプロジェクトの test.yml を読み込んでいる
    Then テスト結果をアーティファクトとしてアップロードするステップが含まれている

  # AC4: テスト失敗時にマージがブロックされる設定ガイドがある
  Scenario: ブランチ保護ルール設定ガイドが存在する
    Then docs/branch-protection-guide.md が存在する
