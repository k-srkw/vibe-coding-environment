Feature: skeleton CI テンプレートに Playwright インストール追加

  PBI-21: skeleton の CI ワークフローに Playwright ブラウザのインストールステップを
  追加し、生成プロジェクトの CI でテストが正常に実行できるようにする。

  # AC1: skeleton の CI ワークフローに npx playwright install --with-deps ステップが追加されている
  Scenario: ci.yml に Playwright インストールステップが含まれている
    Given skeleton の CI ワークフローファイルを読み込む
    Then CI ワークフローに "npx playwright install" コマンドが含まれている
    And Playwright インストールステップが npm ci の後かつテスト実行の前に配置されている

  # AC3: setup.yml にも必要に応じて Playwright インストールステップが追加されている
  Scenario: setup.yml に Playwright インストールステップが含まれている
    Given skeleton の setup ワークフローファイルを読み込む
    Then setup ワークフローに "npx playwright install" コマンドが含まれている
    And Playwright インストールステップが npm ci の後かつ検証スクリプト実行の前に配置されている
