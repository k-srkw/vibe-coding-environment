# ADR-0003: skeleton への package-lock.json 追加とコピー検出の改善

## Status

Accepted

## Context

PBI-9 の E2E テストで、テンプレートから作成された GitHub リポジトリの setup ワークフロー（`npm ci`）が失敗した。原因は 2 つ:

1. skeleton に `package-lock.json` が含まれておらず、`npm ci` が lockfile を要求して失敗した
2. `rhdh-template-helper.ts` の `copyTemplateFiles()` が skeleton ディレクトリの内容変更を検出できず、stale なコピーが RHDH に登録され続けていた（PBI-2 時点の 4 ファイルのみ）

## Decision

1. **skeleton に `package-lock.json` を追加する**: `npm ci` は CI 環境で推奨される方法であり、ワークフローの `npm ci` を `npm install` に変更するよりも lockfile を同梱するほうが正しい。lockfile の `name` フィールドにはテンプレート変数 `${{ values.repoName }}` を使用する。

2. **skeleton コピーの変更検出を改善する**: `template.yaml` の内容比較だけでなく、skeleton ディレクトリ内の全ファイルを再帰的に比較する `skeletonMatchesDest()` 関数を追加した。ファイル数とファイル内容が一致する場合のみコピーをスキップする。不一致時は既存コピーを削除してから再コピーする。

## Consequences

- Good: テンプレートから作成されたリポジトリで `npm ci` が確実に成功する
- Good: skeleton にファイルを追加・変更した際、次回テスト実行時に自動的に RHDH に反映される
- Bad: skeleton のファイル数が増えるとコピー検出の比較コストが増加する（実用上は問題にならない規模）

## Related

- PBI: PBI-9
