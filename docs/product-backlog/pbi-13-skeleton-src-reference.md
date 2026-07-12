# PBI-13: skeleton の CLAUDE.md から src/ 参照を修正

## ステータス: 完了

## 依存

- なし

## 説明

`skeleton/CLAUDE.md` のディレクトリ構造セクションが `src/` ディレクトリを参照しているが、skeleton に `src/` は存在しない。生成されたプロジェクトを受け取った開発者が混乱する可能性があるため、ドキュメントと実態を一致させる。

## 受け入れ条件

- [x] skeleton/CLAUDE.md のディレクトリ構造が実際の skeleton 内容と一致している
- [x] 全テストが Green である

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| skeleton/CLAUDE.md のディレクトリ構造が実際の skeleton 内容と一致している | 自動テスト | ディレクトリ構造に存在しないディレクトリが記載されていない / skeleton 内の主要ファイルがディレクトリ構造に記載されている |
| 全テストが Green である | `npm test` | 全シナリオ実行 |

## 想定する成果物

- `skeleton/CLAUDE.md` の更新

## 完了証跡

- テスト実行結果: 42 passed, 2 skipped (12.3s) — 新規 2 シナリオ含む
- 確認日時: 2026-07-12
- 備考: skeleton/CLAUDE.md から存在しない `src/` を削除し、実際のファイル構成（tsconfig.json, playwright.config.ts, .gitignore, scripts/）を追加。ADR なし（軽微なドキュメント修正のため）。
