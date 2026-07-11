# Claude Code バイブコーディング環境

RHDH Local の Software Template を使用して、Claude Code によるバイブコーディング環境をワンクリックで払い出すための基盤リポジトリ。

## 前提条件

- [Podman](https://podman.io/) + [podman-compose](https://github.com/containers/podman-compose)
- [Node.js](https://nodejs.org/) v18 以上
- Git

## RHDH Local のセットアップ

### 1. リポジトリの clone

```bash
git clone https://github.com/redhat-developer/rhdh-local.git
```

### 2. 起動

```bash
cd rhdh-local
podman compose up -d
```

初回はコンテナイメージのダウンロードに数分かかります。

### 3. GitHub 連携設定

GitHub からのカタログ読み込みや GitHub 認証を利用するには、以下の設定が必要です。

#### 3-1. GitHub App の作成

GitHub で [GitHub App を新規登録](https://github.com/settings/apps/new) し、以下を設定します:

| 項目 | 値 |
|---|---|
| Homepage URL | `http://localhost:7007` |
| Authorization callback URL | `http://localhost:7007/api/auth/github/handler/frame` |
| Permissions | Repository: `Checks`, `Contents`, `Metadata` (Read) / Organization: `Members` (Read) |

作成後、以下の値を控えます:

- **App ID**
- **Client ID**
- **Client Secret**（生成する）
- **Private Key**（生成してダウンロード）

#### 3-2. 認証情報ファイルの設定

```bash
cd rhdh-local
cp configs/extra-files/github-app-credentials.example.yaml configs/extra-files/github-app-credentials.yaml
```

`github-app-credentials.yaml` に App ID、Client ID、Client Secret、Private Key を設定します。

#### 3-3. 環境変数の設定

`.env` ファイルに GitHub App の認証情報を追加します:

```bash
GITHUB_APP_CLIENT_ID=<your-client-id>
GITHUB_APP_CLIENT_SECRET=<your-client-secret>
GITHUB_APP_APP_ID=<your-app-id>
GITHUB_APP_WEBHOOK_SECRET=<your-webhook-secret>
GITHUB_APP_PRIVATE_KEY=<your-private-key>
```

#### 3-4. アプリケーション設定の有効化

`app-config.local.yaml` で GitHub 認証・連携・カタログ検出を有効にします:

```bash
cp configs/app-config/app-config.local.example.yaml configs/app-config/app-config.local.yaml
```

主な設定項目:

- `auth.providers.github` — GitHub ログイン
- `integrations.github` — GitHub App による API 連携
- `catalog.providers.github` — GitHub Organization からのカタログ自動検出

詳細は [GitHub Auth Guide](rhdh-local/docs/rhdh-local-guide/github-auth.md) を参照してください。

#### 3-5. RHDH Local の再起動

```bash
cd rhdh-local
podman compose up -d --force-recreate
```

ログで起動を確認:

```bash
podman compose logs -f rhdh
```

### 4. UI アクセス

ブラウザで http://localhost:7007 にアクセスします。GitHub 連携が設定済みの場合は **GitHub** アカウントでログインできます。未設定の場合は **Guest** としてログインします。

### 5. 停止

```bash
cd rhdh-local
podman compose down
```

データを含めて完全にリセットする場合:

```bash
cd rhdh-local
podman compose down --volumes
```

## カスタム Software Template の登録

### ローカルファイルから登録する場合

1. `rhdh-local/configs/app-config/app-config.local.example.yaml` を `app-config.local.yaml` にコピーする

```bash
cd rhdh-local/configs/app-config
cp app-config.local.example.yaml app-config.local.yaml
```

2. `app-config.local.yaml` に `catalog.locations` を追加する

```yaml
catalog:
  locations:
    - type: file
      target: /opt/app-root/src/configs/catalog-entities/template.yaml
      rules:
        - allow: [Template]
```

3. テンプレートファイルを `rhdh-local/configs/catalog-entities/` に配置する

4. RHDH Local を再起動する

```bash
cd rhdh-local
podman compose restart rhdh
```

### GitHub リポジトリから登録する場合

`app-config.local.yaml` に URL を指定する:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/<org>/<repo>/blob/main/template.yaml
      rules:
        - allow: [Template]
```

## 開発

### 依存パッケージのインストール

```bash
npm install
npx playwright install --with-deps chromium
```

### テストの実行

RHDH Local が起動している状態で実行します:

```bash
npm test
```

GitHub 連携テスト（テンプレート実行によるリポジトリ作成）を含める場合:

```bash
GITHUB_TOKEN=<your-personal-access-token> npm test
```

`GITHUB_TOKEN` が未設定の場合、GitHub 連携テストは自動的にスキップされます。

## プロジェクト構成

```
├── template.yaml          # Software Template 定義
├── skeleton/              # テンプレートから生成されるファイルの雛形
├── features/              # ATDD テスト (Cucumber/Gherkin)
│   ├── *.feature          #   Gherkin シナリオ
│   ├── steps/             #   ステップ定義
│   └── support/           #   ヘルパー・定数・フィクスチャ
├── docs/
│   ├── product-backlog/   # プロダクトバックログ (PBI)
│   └── adr/               # Architecture Decision Records
├── CLAUDE.md              # Claude Code 用プロジェクト指示
└── rhdh-local/            # RHDH Local (git clone、.gitignore 対象)
```
