Feature: RHDH Local 環境のセットアップ

  PBI-1: RHDH Local をローカルで起動し、カスタム Software Template を登録できる状態にする。

  # AC1: podman compose up で RHDH Local が起動する
  Scenario: podman compose up で RHDH Local が起動する
    Given compose.yaml が存在する
    When podman compose up を実行する
    Then RHDH Local のコンテナが起動している

  # AC2: ブラウザから RHDH Local の UI にアクセスできる
  Scenario: ブラウザから RHDH Local の UI にアクセスできる
    Given RHDH Local が起動している
    When ブラウザで RHDH Local の URL にアクセスする
    Then RHDH Local のトップページが表示される

  # AC3: カスタムテンプレートのカタログ登録方法が確立されている
  # → 手動確認（方法論の確立は自動テストに不向き）

  # AC4: 手順が README に記載されている
  Scenario: セットアップ手順が README に記載されている
    Given README.md が存在する
    Then README に RHDH Local の起動手順が記載されている
    And README にカスタムテンプレートの登録手順が記載されている
