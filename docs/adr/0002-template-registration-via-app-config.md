# ADR-0002: テンプレート登録に app-config.local.yaml 変更 + RHDH 再起動方式を採用

## Status

Accepted

## Context

PBI-2 で作成した Software Template を RHDH Local のカタログに登録する方法として、以下の選択肢があった:

1. **app-config.local.yaml に catalog.locations を追加し RHDH を再起動する**
2. **Backstage Catalog REST API（POST /api/catalog/locations）で動的に登録する**

API 方式は再起動不要で高速だが、ゲスト認証のセッション管理が複雑になる（ブラウザコンテキスト外からの API 呼び出しに認証トークンが必要）。また、登録が RHDH 再起動後に失われるため、テスト実行のたびに再登録が必要になる。

app-config 方式は再起動が必要だが、実際のユーザーがテンプレートを登録する手順と一致し、登録が永続化される。

なお、Backstage では `app-config.local.yaml` の配列キー（`catalog.locations`）がデフォルト設定を上書き（マージではなく置換）するため、テンプレート登録時にデフォルトのカタログエントリ（`users.yaml` 等）も含める必要がある。

## Decision

app-config.local.yaml 変更 + RHDH コンテナ再起動方式を採用する。

- テスト用ヘルパー（`rhdh-template-helper.ts`）が `js-yaml` で設定ファイルを安全に読み書きし、冪等にテンプレートを登録する
- デフォルトのカタログエントリは明示的に含めて配列置換の問題を回避する
- コンテナ再起動は `podman restart rhdh`（compose restart ではなく）を使用し、完了済みの `install-dynamic-plugins` サービスとの依存関係問題を回避する

## Consequences

- Good: ユーザーの実運用手順と一致するため、テストが実態に近い検証になる
- Good: 登録が永続化されるため、RHDH が再起動しても設定が維持される
- Good: 冪等性を確保し、2 回目以降のテスト実行では再起動をスキップする
- Bad: 初回テスト実行時に RHDH 再起動のオーバーヘッド（約 10-20 秒）がある
- Bad: `js-yaml` への依存が追加される

## Related

- PBI: PBI-2
