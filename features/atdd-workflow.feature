Feature: ATDD ワークフローの統合と文書化
  PBI-8: CLAUDE.md にハーネスエンジニアリングのワークフローを記載し、
  サンプル Feature ファイルとともに ATDD のベストプラクティスをテンプレートに組み込む。

  Scenario: CLAUDE.md に ATDD ワークフローの手順が記載されている
    Given skeleton/CLAUDE.md ファイルが存在する
    Then skeleton/CLAUDE.md に「ATDD ワークフロー」セクションが含まれている
    And ATDD ワークフローに Gherkin でテストを記述するステップが含まれている
    And ATDD ワークフローに実装するステップが含まれている
    And ATDD ワークフローに CI で検証するステップが含まれている

  Scenario: Claude Code に .feature ファイル先行ルールが設定されている
    Given skeleton/CLAUDE.md ファイルが存在する
    Then skeleton/CLAUDE.md に .feature ファイルを先に書くルールが記載されている
    And そのルールが厳守事項として記載されている

  Scenario: サンプルの Feature ファイルが具体的な ATDD パターンを示している
    Given skeleton/features/ に ATDD サンプルの .feature ファイルが存在する
    Then サンプル Feature ファイルに Scenario Outline パターンが含まれている
    And サンプル Feature ファイルに Background パターンが含まれている
    And サンプル Feature ファイルにタグの使用例が含まれている

  Scenario: テンプレートから払い出した環境で ATDD フローを一通り実行できる
    Given skeleton をテスト用ディレクトリに展開している
    When テスト用ディレクトリで npm test を実行する
    Then テストが正常に完了する
