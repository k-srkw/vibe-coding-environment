Feature: skeleton の CLAUDE.md から src/ 参照を修正

  PBI-13: skeleton/CLAUDE.md のディレクトリ構造セクションが実際の
  skeleton 内容と一致していることを検証する。

  # AC1: skeleton/CLAUDE.md のディレクトリ構造が実際の skeleton 内容と一致している
  Scenario: ディレクトリ構造に存在しないディレクトリが記載されていない
    Given skeleton/CLAUDE.md のディレクトリ構造セクションを読み込む
    Then ディレクトリ構造に記載された各エントリが skeleton 内に実在する

  Scenario: skeleton 内の主要ファイルがディレクトリ構造に記載されている
    Given skeleton/CLAUDE.md のディレクトリ構造セクションを読み込む
    Then ディレクトリ構造に "CLAUDE.md" が記載されている
    And ディレクトリ構造に "README.md" が記載されている
    And ディレクトリ構造に "package.json" が記載されている
    And ディレクトリ構造に "catalog-info.yaml" が記載されている
    And ディレクトリ構造に "tsconfig.json" が記載されている
    And ディレクトリ構造に "features/" が記載されている
    And ディレクトリ構造に ".github/" が記載されている
