@atdd
Feature: 文字列フォーマッター
  ATDD パターンのサンプル。Scenario Outline、Background、タグの使用例を含む。

  Background:
    Given フォーマッターが初期化されている

  @smoke
  Scenario: 文字列を大文字に変換する
    When "hello" を大文字に変換する
    Then 結果は "HELLO" である

  Scenario: 文字列を小文字に変換する
    When "WORLD" を小文字に変換する
    Then 結果は "world" である

  Scenario Outline: 文字列の長さを検証する
    When "<input>" の長さを取得する
    Then 結果は <length> である

    Examples:
      | input | length |
      | hello | 5      |
      | world | 5      |
      | hi    | 2      |
