Feature: Cucumber/Gherkin テスト構造の作成

  PBI-4: Software Template のスケルトンに Cucumber/Gherkin のディレクトリ構造と
  サンプルテストを含め、払い出し直後から ATDD を開始できる状態にする。

  # AC1: skeleton/features/ にサンプル .feature ファイルが含まれている
  Scenario: skeleton/features/ にサンプル .feature ファイルが含まれている
    Then skeleton/features/ ディレクトリが存在する
    And skeleton/features/ に .feature ファイルが含まれている

  # AC2: skeleton/features/steps/ にステップ定義の雛形が含まれている
  Scenario: skeleton/features/steps/ にステップ定義の雛形が含まれている
    Then skeleton/features/steps/ ディレクトリが存在する
    And skeleton/features/steps/ にステップ定義ファイルが含まれている

  # AC3: skeleton/features/support/ にワールド設定が含まれている
  Scenario: skeleton/features/support/ にワールド設定が含まれている
    Then skeleton/features/support/ ディレクトリが存在する
    And skeleton/features/support/ にワールド設定ファイルが含まれている

  # AC4: package.json に playwright-bdd と関連パッケージが定義されている
  Scenario: package.json に playwright-bdd 関連パッケージが定義されている
    Then skeleton/package.json に playwright-bdd が定義されている
    And skeleton/package.json に test スクリプトが定義されている

  # AC5: npm test でサンプルテストが実行・パスする
  Scenario: skeleton のサンプルテストが実行・パスする
    Given skeleton をテスト用ディレクトリに展開している
    When テスト用ディレクトリで npm test を実行する
    Then テストが正常に完了する
