# Claude Code バイブコーディング環境

## プロジェクト概要

RHDH Local (Red Hat Developer Hub Local) の Software Template を使用して、Claude Code によるバイブコーディング環境をワンクリックで払い出すための基盤リポジトリ。

## Product Goal

RHDH Local の Software Template を通じて、Claude Code によるバイブコーディング環境（GitHub リポジトリ + CLAUDE.md + ATDD テストハーネス + CI/CD）をワンクリックで払い出し、品質を担保しながら AI 支援開発を実践できるようにする。

## 前提条件

- コンテナ実行環境: **Podman** + **podman-compose** (`podman compose`)
- テスト: **Cucumber/Gherkin** (ATDD)
- CI/CD: **GitHub Actions**
- 対象言語 (MVP): **Node.js / TypeScript**

## プロダクトバックログ

MVP の定義と Product Backlog Items は [docs/product-backlog/](docs/product-backlog/README.md) を参照。

各 PBI は独立したファイルとして管理されており、個別に Plan → 実装できる。PBI に着手する際は該当ファイルを読み込み、依存関係・受け入れ条件を確認してから進めること。

## ADR（Architecture Decision Records）

PBI 実装時の設計判断は [docs/adr/](docs/adr/README.md) に記録する。詳細は ADR README を参照。

## セキュリティ

- `.env` ファイルには秘密情報（パスワード、API キー、トークン等）が含まれる可能性がある
- `.claude/settings.json` の deny ルールにより、`.env` / `.env.*` / `**/*.env` の Read はブロックされている
- `.env` の内容が必要な場合は、ユーザーが必要な箇所だけを手動で共有すること
- 秘密情報をコード・コミットメッセージ・出力に含めないこと

## PBI 完了ルール (Definition of Done)

**以下のルールは厳守。例外は認めない。**

詳細な DoD チェックリストは [docs/product-backlog/definition-of-done.md](docs/product-backlog/definition-of-done.md) を参照。

### テスト先行 (ATDD)

1. 受け入れ条件を Gherkin シナリオ（`.feature` ファイル）に変換してから実装に入ること
2. Gherkin シナリオは受け入れ条件と 1:1 で対応させること
3. `npm test` が全件 Green であること

テスト環境がない段階の PBI は、検証方法テーブルに「手動確認」と明記して管理する。

### 完了前チェック手順

PBI のステータスを「完了」に変更する前に、以下を順番に実行すること:

1. 受け入れ条件のチェックリストを 1 項目ずつ検証し、`- [x]` に更新する
2. 「想定する成果物」のファイルがすべて存在することを確認する
3. 既完了 PBI のテストがリグレッションしていないことを確認する
4. PBI ファイルの「完了証跡」セクションにテスト結果を記録する
5. PBI ファイルのステータスを「完了」に更新する
6. `docs/product-backlog/README.md` の一覧テーブルを更新する
7. 実装で得た知見があれば CLAUDE.md または関連ドキュメントに追記する
8. 実装中の設計判断を振り返り、記録すべきものは ADR として `docs/adr/` に保存する

### 禁止事項

- テストを書かずに実装コードだけをコミットしてはならない
- 受け入れ条件を検証せずにステータスを「完了」にしてはならない
- 完了証跡セクションが空の状態で「完了」にしてはならない
