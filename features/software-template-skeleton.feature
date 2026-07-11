Feature: Software Template の骨格作成

  PBI-2: バイブコーディング環境を払い出すための Software Template の基本構造を作成する。
  テンプレートは最小限のパラメータ（プロジェクト名・オーナー・リポジトリ名）を受け取り、
  GitHub リポジトリを作成する。

  # AC1: template.yaml が定義され、RHDH Local に登録できる
  Scenario: template.yaml が定義され RHDH Local に登録できる
    Given template.yaml が存在する
    And テンプレートが RHDH Local に登録されている
    When テンプレートカタログを表示する
    Then テンプレート一覧にバイブコーディング環境テンプレートが表示される

  # AC2: テンプレート UI でパラメータを入力できる
  Scenario: テンプレート UI でパラメータを入力できる
    Given テンプレートが RHDH Local に登録されている
    When バイブコーディング環境テンプレートの作成画面を開く
    Then プロジェクト名の入力フィールドが表示される
    And オーナーの入力フィールドが表示される
    And リポジトリ名の入力フィールドが表示される

  # AC3: テンプレート実行で GitHub リポジトリが作成される
  # RHDH Scaffolder API でテンプレートを実行し、GitHub リポジトリ作成を検証する。
  # GITHUB_TOKEN 未設定時はスキップする。
  @github
  Scenario: テンプレート実行で GitHub リポジトリが作成される
    Given テンプレートが RHDH Local に登録されている
    And GitHub 連携が設定されている
    When Scaffolder API でテンプレートを実行する
    Then GitHub にリポジトリが作成される
    And 作成されたリポジトリに skeleton のファイルが含まれている

  # AC4: skeleton/ ディレクトリに雛形ファイルが含まれている
  Scenario: skeleton ディレクトリに雛形ファイルが含まれている
    Given template.yaml が存在する
    Then skeleton ディレクトリが存在する
    And skeleton ディレクトリにファイルが含まれている
