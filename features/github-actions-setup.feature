Feature: GitHub Actions 環境構築自動化ワークフロー

  PBI-5: テンプレートからリポジトリ作成後に自動実行される GitHub Actions ワークフローを作成する。
  依存パッケージのインストール、初期設定、環境構築が完了したことの基本検証を行う。

  # AC1: skeleton/.github/workflows/setup.yml が存在する
  Scenario: setup.yml ワークフローファイルが存在する
    Then skeleton/.github/workflows/setup.yml が存在する

  # AC2: リポジトリ作成後の初回 push（または手動トリガー）で実行される
  Scenario: 初回 push または手動トリガーで実行される
    Given setup.yml を読み込んでいる
    Then push トリガーが設定されている
    And workflow_dispatch トリガーが設定されている

  # AC3: 依存パッケージのインストール（npm ci）が成功する
  Scenario: npm ci による依存パッケージインストールステップが含まれている
    Given setup.yml を読み込んでいる
    Then npm ci を実行するステップが含まれている

  # AC4: 環境構築の基本的な検証ステップが含まれている（ビルド成功、テスト実行可能）
  Scenario: ビルドとテスト実行の検証ステップが含まれている
    Given setup.yml を読み込んでいる
    Then ビルドを実行するステップが含まれている
    And テストを実行するステップが含まれている

  # AC5: 結果が GitHub Actions の UI で確認できる
  Scenario: ワークフローとジョブに名前が定義されている
    Given setup.yml を読み込んでいる
    Then ワークフローに name が定義されている
    And ジョブに name が定義されている
