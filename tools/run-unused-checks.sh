#!/usr/bin/env bash

set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TMP_DIR="$ROOT_DIR/tmp"
mkdir -p "$TMP_DIR"

run_checks() {
  local label="$1"
  local dir="$2"
  local ts_prune_out="$TMP_DIR/ts-prune-${label}.json"
  local depcheck_out="$TMP_DIR/depcheck-${label}.json"

  echo "==> Running checks for ${label} (${dir})"

  if [ -f "$dir/tsconfig.json" ]; then
    (
      cd "$dir"
      npx ts-prune --project tsconfig.json --json > "$ts_prune_out" || true
    )
  else
    echo "[]" > "$ts_prune_out"
  fi

  (
    cd "$dir"
    npx depcheck --json > "$depcheck_out" || true
  )
}

run_checks "frontend" "$ROOT_DIR"
run_checks "backend" "$ROOT_DIR/hms-backend"

node - "$TMP_DIR" <<'NODE'
const fs = require('fs');
const path = require('path');

const tmpDir = process.argv[2];
const readJSON = (name, fallback) => {
  const filePath = path.join(tmpDir, name);
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const text = fs.readFileSync(filePath, 'utf8').trim();
    return text ? JSON.parse(text) : fallback;
  } catch {
    return fallback;
  }
};

const tsPrune = {
  frontend: readJSON('ts-prune-frontend.json', []),
  backend: readJSON('ts-prune-backend.json', []),
};
const depcheck = {
  frontend: readJSON('depcheck-frontend.json', {}),
  backend: readJSON('depcheck-backend.json', {}),
};

fs.writeFileSync(path.join(tmpDir, 'ts-prune.json'), JSON.stringify(tsPrune, null, 2) + '\n');
fs.writeFileSync(path.join(tmpDir, 'depcheck.json'), JSON.stringify(depcheck, null, 2) + '\n');

const depCount = (payload = {}) => (
  (payload.dependencies || []).length +
  (payload.devDependencies || []).length +
  Object.keys(payload.missing || {}).length
);

const missingCount = (payload = {}) => Object.keys(payload.missing || {}).length;

console.log('\nSummary');
console.log(`- frontend ts-prune candidates: ${Array.isArray(tsPrune.frontend) ? tsPrune.frontend.length : 0}`);
console.log(`- backend ts-prune candidates: ${Array.isArray(tsPrune.backend) ? tsPrune.backend.length : 0}`);
console.log(`- frontend depcheck candidates: ${depCount(depcheck.frontend)} (missing: ${missingCount(depcheck.frontend)})`);
console.log(`- backend depcheck candidates: ${depCount(depcheck.backend)} (missing: ${missingCount(depcheck.backend)})`);
console.log(`- aggregated files: ${path.join(tmpDir, 'ts-prune.json')}, ${path.join(tmpDir, 'depcheck.json')}`);
NODE
