#!/usr/bin/env bash
# verify-setup.sh — 環境構築完了の自動検証スクリプト
# 各チェック項目を順にテストし、結果を集計してレポートする。

PASS_COUNT=0
FAIL_COUNT=0
RESULTS=()

report() {
  local status="$1"
  local label="$2"
  local detail="${3:-}"
  if [ "$status" = "PASS" ]; then
    PASS_COUNT=$((PASS_COUNT + 1))
    echo "PASS: $label"
  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
    echo "FAIL: $label"
    if [ -n "$detail" ]; then
      echo "  -> $detail"
    fi
  fi
  RESULTS+=("$status|$label|$detail")
}

# --- 1. 必要なファイルの存在チェック ---

check_file_exists() {
  local file="$1"
  if [ -f "$file" ]; then
    report "PASS" "$file が存在する"
  else
    report "FAIL" "$file が存在する" "$file が見つかりません"
  fi
}

check_file_exists "CLAUDE.md"
check_file_exists "package.json"

FEATURE_FILES=$(find features -name '*.feature' 2>/dev/null)
if [ -n "$FEATURE_FILES" ]; then
  report "PASS" "feature ファイルが存在する"
else
  report "FAIL" "feature ファイルが存在する" "features/ ディレクトリに .feature ファイルが見つかりません"
fi

# --- 2. 依存パッケージのインストールチェック ---

if [ -d "node_modules" ]; then
  report "PASS" "依存パッケージがインストールされている"
else
  report "FAIL" "依存パッケージがインストールされている" "node_modules ディレクトリが見つかりません"
fi

# --- 3. ビルドチェック ---

BUILD_OUTPUT=""
if BUILD_OUTPUT=$(npx tsc --noEmit 2>&1); then
  report "PASS" "ビルドが成功する"
else
  report "FAIL" "ビルドが成功する" "$BUILD_OUTPUT"
fi

# --- 4. テスト実行可能チェック ---

TEST_OUTPUT=""
if TEST_OUTPUT=$(npm test 2>&1); then
  report "PASS" "テストが実行可能である"
else
  report "FAIL" "テストが実行可能である" "$TEST_OUTPUT"
fi

# --- 結果サマリー ---

echo ""
echo "===== 検証結果 ====="
echo "PASS: $PASS_COUNT / FAIL: $FAIL_COUNT"

# GitHub Actions ジョブサマリー出力
if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    echo "## 環境構築検証結果"
    echo ""
    echo "| 結果 | チェック項目 | 詳細 |"
    echo "|------|-------------|------|"
    for entry in "${RESULTS[@]}"; do
      IFS='|' read -r status label detail <<< "$entry"
      if [ "$status" = "PASS" ]; then
        icon="✅"
      else
        icon="❌"
      fi
      echo "| $icon $status | $label | $detail |"
    done
    echo ""
    if [ "$FAIL_COUNT" -eq 0 ]; then
      echo "**環境構築完了** — 全 $PASS_COUNT 項目がパスしました。"
    else
      echo "**環境構築に問題があります** — $FAIL_COUNT 項目が失敗しました。"
    fi
  } >> "$GITHUB_STEP_SUMMARY"
fi

if [ "$FAIL_COUNT" -eq 0 ]; then
  echo "環境構築完了"
  exit 0
else
  echo "環境構築に失敗した項目があります"
  exit 1
fi
