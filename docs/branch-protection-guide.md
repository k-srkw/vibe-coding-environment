# ブランチ保護ルール設定ガイド

テスト失敗時にマージをブロックするための GitHub ブランチ保護ルールの設定手順を説明します。

## 前提条件

- リポジトリの **管理者権限（Admin）** が必要です

## 設定手順

1. GitHub リポジトリページで **Settings** タブを開く
2. 左メニューから **Branches** を選択する
3. 「Branch protection rules」セクションの **Add branch protection rule** をクリックする
4. 以下の項目を設定する:

### Branch name pattern

```
main
```

### 必須設定

- **Require status checks to pass before merging** を有効にする
- 検索ボックスに `Test` と入力し、必須ステータスチェックとして **Test** を追加する

### 推奨設定

- **Require branches to be up to date before merging** を有効にする
  - マージ前にブランチが最新であることを要求し、古いブランチのマージによるリグレッションを防止します

5. **Create** ボタンをクリックして保存する

## 設定確認方法

1. テストが失敗するコミットを含むプルリクエストを作成する
2. ステータスチェックが失敗し、マージボタンが無効化されていることを確認する
3. テストを修正してプッシュし、ステータスチェックが成功した後にマージが可能になることを確認する
