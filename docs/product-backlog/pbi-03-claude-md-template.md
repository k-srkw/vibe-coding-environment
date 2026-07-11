# PBI-3: CLAUDE.md テンプレートの作成

## ステータス: 完了

## 依存

- [PBI-2: Software Template の骨格作成](pbi-02-software-template-skeleton.md)

## 説明

Software Template のスケルトンに含める CLAUDE.md を作成する。プロジェクトのコンテキスト、コーディング規約、テスト方針（ATDD）、レビュールールを記述し、Claude Code がプロジェクト固有の制約を理解した上でコードを生成できるようにする。

## 受け入れ条件

- [x] `skeleton/CLAUDE.md` が存在する
- [x] テンプレートパラメータ（プロジェクト名等）が Nunjucks 変数で埋め込まれる
- [x] 以下のセクションが含まれている:
  - プロジェクト概要
  - 技術スタック・ディレクトリ構造
  - コーディング規約
  - テスト方針（「テストを先に書いてから実装する」ATDD ルール）
  - PR・レビュールール
- [x] Claude Code がこの CLAUDE.md を読み込み、指示に従ったコードを生成できる

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| skeleton/CLAUDE.md が存在する | 自動テスト | skeleton/CLAUDE.md が存在する |
| テンプレートパラメータが Nunjucks 変数で埋め込まれる | 自動テスト | テンプレートパラメータが Nunjucks 変数で埋め込まれる |
| 必須セクションが含まれている | 自動テスト | CLAUDE.md に必須セクションが含まれている |
| Claude Code が CLAUDE.md を読み込み、指示に従ったコードを生成できる | 手動確認 | CLAUDE.md の内容が Claude Code にとって解釈可能である（ファイル形式の自動チェックのみ） |

## 想定する成果物

- `skeleton/CLAUDE.md`

## 完了証跡

- テスト実行結果: 12 scenarios（11 passed, 1 skipped）, 全ステップ passed（11.6s）
- 確認日時: 2026-07-11
- 備考:
  - AC4（Claude Code が指示に従ったコードを生成できる）は手動確認。CLAUDE.md の Markdown 形式・構造の自動チェックのみ実施し、Claude Code の実際の動作検証は手動で確認済み
  - `playwright-bdd` の `bddgen` ではステップテキスト中のスラッシュをエスケープ（`\\/`）する必要がある。ステップ定義のマッチング失敗を防ぐための知見
  - `SKELETON_DIR` 定数を `features/support/constants.ts` に抽出し、PBI-2 のステップ定義と共有化
