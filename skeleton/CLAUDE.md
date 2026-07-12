# ${{ values.projectName }}

## プロジェクト概要

- **プロジェクト名**: ${{ values.projectName }}
- **オーナー**: ${{ values.owner }}
- **リポジトリ**: ${{ values.repoName }}

このプロジェクトは RHDH Software Template から生成されたバイブコーディング環境です。Claude Code がこの CLAUDE.md を読み込み、プロジェクト固有の制約を理解した上でコード生成を行います。

## 技術スタック・ディレクトリ構造

### 技術スタック

- **言語**: Node.js / TypeScript
- **パッケージマネージャー**: npm
- **テストフレームワーク**: Cucumber / Gherkin (ATDD)
- **CI/CD**: GitHub Actions

### ディレクトリ構造

```
.
├── CLAUDE.md              # プロジェクト指示書（このファイル）
├── README.md              # プロジェクト概要
├── package.json           # 依存関係・スクリプト定義
├── catalog-info.yaml      # Backstage カタログ情報
├── src/                   # アプリケーションソースコード
├── features/              # Gherkin フィーチャーファイル
│   ├── *.feature          # テストシナリオ
│   ├── steps/             # ステップ定義
│   └── support/           # フィクスチャ・ヘルパー
└── .github/
    └── workflows/         # GitHub Actions ワークフロー
```

## コーディング規約

### TypeScript スタイルルール

- **命名規則**:
  - 変数・関数: `camelCase`
  - クラス・インターフェース・型: `PascalCase`
  - 定数: `UPPER_SNAKE_CASE`
  - ファイル名: `kebab-case.ts`
- **フォーマット**:
  - インデント: スペース 2 つ
  - セミコロン: あり
  - クォート: シングルクォート
  - 末尾カンマ: あり
- **import**:
  - 外部モジュール → 内部モジュールの順に記述する
  - 使用していない import は削除する
- **型安全性**:
  - `any` の使用を避け、適切な型を定義する
  - `strict: true` を有効にする

## テスト方針

### ATDD（受け入れテスト駆動開発）

**まず .feature ファイルを書いてから実装する。** これは厳守ルールであり、例外は認めない。

実装コードを書く前に、必ず受け入れ条件を Gherkin シナリオとして `.feature` ファイルに記述すること。`.feature` ファイルが存在しない状態で実装コードを書き始めてはならない。

### ATDD ワークフロー

ATDD は以下の 3 ステップで進める:

1. **Gherkin でテストを記述する**: 受け入れ条件を `.feature` ファイルにシナリオとして記述する。1 シナリオにつき 1 つの受け入れ条件を検証する。シナリオは日本語で記述し、Given（前提条件）/ When（操作）/ Then（期待結果）の構造に従う。
2. **Claude Code で実装する**: `.feature` ファイルに対応するステップ定義（`features/steps/*.ts`）と実装コードを作成する。ステップ定義を実装したらテストを実行し、Red から Green になることを確認する。
3. **CI で検証する**: GitHub Actions で `npm test` を自動実行し、全テストが Green であることを確認する。PR マージ前に CI が通ることを必須条件とする。

### ATDD パターンガイド

Gherkin シナリオでは以下のパターンを活用する:

- **Scenario Outline + Examples**: 同じシナリオを異なるデータで繰り返しテストする場合に使用する。`<placeholder>` でパラメータを定義し、`Examples` テーブルで具体的な値を列挙する。
  ```gherkin
  Scenario Outline: 入力値を検証する
    When "<input>" を処理する
    Then 結果は <expected> である

    Examples:
      | input | expected |
      | a     | 1        |
      | bb    | 2        |
  ```
- **Background**: Feature 内の全シナリオで共通する前提条件を定義する。各シナリオの `Given` の重複を排除できる。
  ```gherkin
  Background:
    Given システムが初期化されている
  ```
- **タグ**: `@` で始まるタグをシナリオや Feature に付与し、テスト実行の絞り込みに使用する。`@smoke` で重要なテスト、`@wip` で作業中のテストを識別する等の運用ができる。
  ```gherkin
  @smoke
  Scenario: 重要な機能のテスト
  ```

### テストの書き方

- Feature ファイルは `features/` ディレクトリに配置する
- ステップ定義は `features/steps/` ディレクトリに配置する
- シナリオは日本語で記述する
- 1 シナリオにつき 1 つの受け入れ条件を検証する
- Gherkin シナリオは受け入れ条件と 1:1 で対応させる
- `npm test` で全テストが Green であることを確認する

## PR・レビュールール

### PR の粒度

- 1 つの PR は 1 つの PBI（Product Backlog Item）または論理的にまとまった変更単位とする
- 大きな変更は複数の PR に分割する

### レビュー観点

- コーディング規約に準拠しているか
- テストが追加・更新されているか
- CLAUDE.md やドキュメントが必要に応じて更新されているか
- セキュリティ上の問題がないか（秘密情報の混入等）

### マージ条件

- 全テストが Green であること（`npm test` が成功）
- レビュー承認を得ていること
- コンフリクトが解消されていること
