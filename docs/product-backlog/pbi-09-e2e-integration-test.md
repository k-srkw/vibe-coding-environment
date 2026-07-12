# PBI-9: E2E 統合テスト — テンプレートから環境払い出しの通し検証

## ステータス: 完了

## 依存

- [PBI-1: RHDH Local 環境のセットアップ](pbi-01-rhdh-local-setup.md)
- [PBI-2: Software Template の骨格作成](pbi-02-software-template-skeleton.md)
- [PBI-3: CLAUDE.md テンプレートの作成](pbi-03-claude-md-template.md)
- [PBI-4: Cucumber/Gherkin テスト構造の作成](pbi-04-cucumber-gherkin-structure.md)
- [PBI-5: GitHub Actions 環境構築自動化](pbi-05-github-actions-setup.md)
- [PBI-6: 環境構築完了の自動検証](pbi-06-setup-verification.md)
- [PBI-7: GitHub Actions PR レビュー・CI](pbi-07-github-actions-ci.md)
- [PBI-8: ATDD ワークフローの統合と文書化](pbi-08-atdd-workflow.md)

## 説明

テンプレート実行から環境構築完了・ATDD ワークフロー実行まで、エンドツーエンドで通しの検証を行い、MVP としての完成を確認する。

## 受け入れ条件

- [x] RHDH Local でテンプレートを実行し、GitHub リポジトリが作成される
- [x] GitHub Actions の setup ワークフローが成功する
- [x] 環境構築完了の検証がパスする
- [x] Gherkin でテストを書き、Claude Code で実装し、PR を作成する一連の流れが成功する
- [x] CI ワークフローがトリガーされ、テスト結果が PR に表示される
- [x] 全体の手順が README に記載されている

## 受け入れ条件の検証方法

| 受け入れ条件 | 検証方法 | 対応するシナリオ |
|-------------|---------|----------------|
| RHDH Local でテンプレートを実行し、GitHub リポジトリが作成される | 自動テスト (@github) | テンプレート実行で GitHub リポジトリが作成され MVP 構成ファイルが含まれている |
| GitHub Actions の setup ワークフローが成功する | 手動確認: テンプレート実行後、GitHub の Actions タブで setup ワークフローの成功を確認 | — |
| 環境構築完了の検証がパスする | 手動確認: setup ワークフローのログで verify-setup ステップの成功を確認 | — |
| Gherkin でテストを書き、Claude Code で実装し、PR を作成する一連の流れが成功する | 手動確認: E2E 手順に従い ATDD ワークフローを実行 | — |
| CI ワークフローがトリガーされ、テスト結果が PR に表示される | 手動確認: PR 作成後、CI ワークフローの結果を PR 画面で確認 | — |
| 全体の手順が README に記載されている | 自動テスト | E2E テスト手順が README に記載されている |

## 手動テスト手順

以下の手順で AC2〜AC5 を通しで検証する。AC1 の自動テストとは別に、テンプレートからリポジトリを作成して残しておく必要がある。

### 前提条件

- RHDH Local が起動していること（`podman compose up -d`）
- テンプレートが RHDH Local に登録されていること
- `GITHUB_TOKEN`（`repo` + `workflow` + `delete_repo` scope）が設定されていること
- Claude Code が利用可能であること

### 手順 1: テンプレートからリポジトリを作成する

1. ブラウザで http://localhost:7007/create を開く
2. 「バイブコーディング環境」テンプレートの **Choose** をクリックする
3. 以下のパラメータを入力する:
   - プロジェクト名: `E2E 手動テスト`
   - オーナー: （自分の GitHub ユーザー名）
   - リポジトリ名: `vibe-coding-e2e-manual-test`
4. **Next** → **Create** をクリックしてテンプレートを実行する
5. 実行が完了したら、リポジトリの URL をクリックして GitHub で開く

**確認ポイント:**
- リポジトリが作成されている
- `CLAUDE.md`、`package.json`、`features/`、`.github/workflows/` が含まれている

### 手順 2: setup ワークフローの成功を確認する（AC2 + AC3）

1. 作成されたリポジトリの GitHub ページで **Actions** タブを開く
2. 「Setup and Verify」ワークフローの実行を確認する（初回 push 時に自動トリガーされる）
3. ワークフローが完了するまで待つ（2〜5 分程度）

**確認ポイント（AC2）:**
- [ ] 「Setup and Verify」ワークフローのステータスが緑（成功）になっている

4. ワークフローの実行ログをクリックして開く
5. 「Setup Environment」ジョブの各ステップを確認する

**確認ポイント（AC3）:**
- [ ] 「npm ci」ステップが成功している
- [ ] 「Verify Setup」ステップが成功している（`verify-setup.sh` の全チェック項目がパス）

### 手順 3: ATDD ワークフローを実行する（AC4）

作成されたリポジトリを clone して、ATDD ワークフローを一通り実行する。

```bash
git clone https://github.com/<owner>/vibe-coding-e2e-manual-test.git
cd vibe-coding-e2e-manual-test
npm install
npx playwright install --with-deps chromium
```

#### 3-1. Gherkin でテストを書く

`features/e2e-sample.feature` を作成する:

```gherkin
Feature: E2E サンプル機能

  Scenario: 挨拶メッセージを返す
    Given 名前が "テスター" である
    When 挨拶を生成する
    Then "こんにちは、テスター！" と表示される
```

#### 3-2. Claude Code で実装する

Claude Code にステップ定義と実装コードの作成を指示する:

```
features/e2e-sample.feature のステップ定義と実装コードを作成してください。
npm test でテストが Green になるようにしてください。
```

#### 3-3. テストが Green になることを確認する

```bash
npm test
```

#### 3-4. PR を作成する

```bash
git checkout -b feature/e2e-sample
git add .
git commit -m "feat: E2E サンプル機能を追加"
git push origin feature/e2e-sample
```

GitHub で PR を作成する。

**確認ポイント（AC4）:**
- [ ] Gherkin シナリオを書き → Claude Code で実装し → PR を作成する一連の流れが成功している

### 手順 4: CI ワークフローの結果を確認する（AC5）

1. 作成した PR の画面を開く
2. PR の Checks セクションを確認する

**確認ポイント（AC5）:**
- [ ] CI ワークフロー（「CI」）が自動的にトリガーされている
- [ ] テスト結果が PR の Checks に表示されている
- [ ] CI が成功（緑）になっている

### 手順 5: クリーンアップ

テスト完了後、作成したリポジトリを削除する:

```bash
gh repo delete <owner>/vibe-coding-e2e-manual-test --yes
```

### 結果記録

| AC | 確認項目 | 結果 | 確認日時 |
|----|---------|------|---------|
| AC2 | setup ワークフロー成功 | ✅ Setup and Verify #3 success | 2026-07-12 |
| AC3 | verify-setup ステップ成功 | ✅ npm ci + Verify Setup 全ステップ success | 2026-07-12 |
| AC4 | ATDD ワークフロー（Gherkin → 実装 → PR）成功 | ✅ Gherkin → 実装 → 7テスト Green → PR #1 作成 | 2026-07-12 |
| AC5 | CI ワークフロートリガー・結果表示 | ✅ CI ワークフロー自動トリガー、Lint and Test 全ステップ success | 2026-07-12 |

## 想定する成果物

- E2E テスト結果
- README の最終更新

## 完了証跡

- テスト実行結果: 42 シナリオ — 40 passed, 2 skipped（GITHUB_TOKEN 未設定時）/ 42 passed（GITHUB_TOKEN 設定時）
- 確認日時: 2026-07-12
- 備考:
  - AC1（テンプレート実行）: 自動テスト Green ✓ — Scaffolder API でリポジトリ作成、CLAUDE.md・Cucumber 構造・GitHub Actions ワークフローの存在を検証
  - AC2（setup ワークフロー）: 手動確認 ✓ — GitHub Actions「Setup and Verify」ワークフロー成功（run #3）
  - AC3（環境構築検証）: 手動確認 ✓ — npm ci + Verify Setup ステップ全成功
  - AC4（ATDD ワークフロー）: 手動確認 ✓ — Gherkin シナリオ作成 → ステップ定義実装 → 7テスト Green → PR #1 作成
  - AC5（CI ワークフロー）: 手動確認 ✓ — PR #1 で CI 自動トリガー、Lint and Test 全ステップ成功
  - AC6（README 記載）: 自動テスト Green ✓
  - バグ修正: `rhdh-template-helper.ts` の skeleton コピーが stale になるバグを修正
  - バグ修正: skeleton に `package-lock.json` が未含のため `npm ci` が失敗する問題を修正
