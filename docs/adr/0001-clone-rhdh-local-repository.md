# ADR-0001: RHDH Local は公式リポジトリを clone して利用する

## Status

Accepted

## Context

PBI-1 で RHDH Local 環境を構築する際、compose.yaml をどのように管理するか判断が必要だった。選択肢として:

1. 自前で最小構成の compose.yaml を作成する
2. 公式リポジトリ（redhat-developer/rhdh-local）を clone してそのまま利用する

公式リポジトリにはプラグインインストーラー、app-config のレイヤー構成、カタログエンティティのサンプルなど、Software Template 開発に必要な構成が含まれている。

## Decision

公式リポジトリを clone して利用する。clone 先（`rhdh-local/`）は `.gitignore` に追加し、ローカルのみで管理する。

理由:
- 公式の compose.yaml は動的プラグインのインストール、設定ファイルのレイヤー構成など複雑な構成を含んでおり、自前で再現するのは非効率
- 公式リポジトリの更新に追従しやすい（`git pull` するだけ）
- PBI-2 以降でカスタムテンプレートを登録する際、公式の app-config 構成をそのまま活用できる

## Consequences

- Good: 公式のベストプラクティスに沿った構成が即座に利用可能
- Good: 公式リポジトリの更新に `git pull` で追従可能
- Bad: rhdh-local リポジトリが .gitignore されるため、初回セットアップ時に clone が必要
- Bad: 公式リポジトリの破壊的変更の影響を受ける可能性がある

## Related

- PBI: PBI-1
