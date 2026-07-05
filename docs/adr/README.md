# Architecture Decision Records (ADR)

PBI 実装時に行った設計判断を MADR (Markdown Any Decision Records) 形式で記録する。

## 運用ルール

- PBI 完了判定（Phase 5）で、実装中の意思決定を振り返り ADR を作成する
- ファイル命名規則: `NNNN-kebab-case-title.md`（例: `0001-use-playwright-bdd.md`）
- テンプレート: [adr-template.md](adr-template.md)
- 軽微な判断や自明な選択は記録不要。技術選定・設計方針・トレードオフを伴う判断を対象とする

## 一覧

| 番号 | タイトル | ステータス | 関連 PBI | 日付 |
|------|---------|-----------|---------|------|
| ADR-0001 | [RHDH Local は公式リポジトリを clone して利用する](0001-clone-rhdh-local-repository.md) | Accepted | PBI-1 | 2026-07-05 |
