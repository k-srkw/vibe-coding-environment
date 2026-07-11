Feature: 環境構築完了の自動検証

  PBI-6: 環境構築が正しく完了したことを検証するヘルスチェックの仕組みを作成する。
  検証結果をわかりやすくレポートする。

  # --- AC1: 自動検証項目 ---

  Scenario: 検証スクリプトが skeleton に存在する
    Given skeleton ディレクトリが存在する
    Then skeleton/scripts/verify-setup.sh が存在する

  Scenario: 必要なファイルの存在を自動検証する
    Given skeleton ディレクトリが存在する
    Then 検証スクリプトに CLAUDE.md の存在チェックが含まれている
    And 検証スクリプトに package.json の存在チェックが含まれている
    And 検証スクリプトに feature ファイルの存在チェックが含まれている

  Scenario: 依存パッケージのインストール状態を自動検証する
    Given skeleton ディレクトリが存在する
    Then 検証スクリプトに依存パッケージのインストールチェックが含まれている

  Scenario: Cucumber テストの実行可能性を自動検証する
    Given skeleton ディレクトリが存在する
    Then 検証スクリプトにテスト実行可能チェックが含まれている

  Scenario: ビルドの成功を自動検証する
    Given skeleton ディレクトリが存在する
    Then 検証スクリプトにビルドチェックが含まれている

  # --- AC2: ジョブサマリー ---

  Scenario: 検証結果が GitHub Actions のジョブサマリーに表示される
    Given setup.yml を読み込んでいる
    Then setup.yml に検証スクリプトの実行ステップが含まれている
    And setup.yml にジョブサマリー出力が含まれている

  # --- AC3: 全パスで環境構築完了 ---

  Scenario: 全チェック項目がパスした場合に環境構築完了と判定される
    Given セットアップ済みの skeleton 作業ディレクトリが存在する
    When 検証スクリプトを実行する
    Then 終了コードが 0 である
    And 出力に環境構築完了メッセージが含まれる

  # --- AC4: 失敗時エラー明示 ---

  Scenario: 1 項目でも失敗した場合にエラー内容が明示される
    Given 必要なファイルが欠けた作業ディレクトリが存在する
    When 検証スクリプトを実行する
    Then 終了コードが 0 以外である
    And 出力に失敗した項目のエラー内容が含まれる
