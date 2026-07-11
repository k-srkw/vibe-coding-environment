Feature: CLAUDE.md テンプレートの作成

  PBI-3: Software Template のスケルトンに含める CLAUDE.md を作成する。
  プロジェクトのコンテキスト、コーディング規約、テスト方針（ATDD）、
  レビュールールを記述し、Claude Code がプロジェクト固有の制約を理解した上で
  コードを生成できるようにする。

  # AC1: skeleton/CLAUDE.md が存在する
  Scenario: skeleton/CLAUDE.md が存在する
    Then skeleton/CLAUDE.md ファイルが存在する

  # AC2: テンプレートパラメータが Nunjucks 変数で埋め込まれる
  Scenario: テンプレートパラメータが Nunjucks 変数で埋め込まれる
    Then skeleton/CLAUDE.md にプロジェクト名の Nunjucks 変数が含まれている
    And skeleton/CLAUDE.md にオーナーの Nunjucks 変数が含まれている
    And skeleton/CLAUDE.md にリポジトリ名の Nunjucks 変数が含まれている

  # AC3: 必須セクションが含まれている
  Scenario: CLAUDE.md に必須セクションが含まれている
    Then skeleton/CLAUDE.md に「プロジェクト概要」セクションが含まれている
    And skeleton/CLAUDE.md に「技術スタック」セクションが含まれている
    And skeleton/CLAUDE.md に「コーディング規約」セクションが含まれている
    And skeleton/CLAUDE.md に「テスト方針」セクションが含まれている
    And skeleton/CLAUDE.md に「PR・レビュールール」セクションが含まれている

  # AC4: Claude Code がこの CLAUDE.md を読み込み、指示に従ったコードを生成できる
  # Claude Code の動作は自動テストで検証できないため手動確認
  Scenario: CLAUDE.md の内容が Claude Code にとって解釈可能である
    Then skeleton/CLAUDE.md が空でない
    And skeleton/CLAUDE.md が有効な Markdown 形式である
