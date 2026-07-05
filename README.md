# Claude Code バイブコーディング環境

RHDH Local の Software Template を使用して、Claude Code によるバイブコーディング環境をワンクリックで払い出すための基盤リポジトリ。

## 前提条件

- [Podman](https://podman.io/) + [podman-compose](https://github.com/containers/podman-compose)
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

### 3. UI アクセス

ブラウザで http://localhost:7007 にアクセスし、**Guest** としてログインします。

### 4. 停止

```bash
cd rhdh-local
podman compose down
```

データを含めて完全にリセットする場合:

```bash
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
