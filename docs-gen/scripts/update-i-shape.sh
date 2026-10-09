#!/usr/bin/env bash
set -euo pipefail

task_docs_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
task_root_dir="$(cd "$task_docs_dir/.." && pwd)"
task_bindgen="${WASM_BINDGEN_BIN:-wasm-bindgen}"

cargo build --locked --release --target wasm32-unknown-unknown --lib --manifest-path "$task_root_dir/Cargo.toml"
task_bindgen_version="$(python3 - "$task_root_dir/Cargo.lock" <<'VERSION'
import re, sys
from pathlib import Path
match = re.search(r'name = "wasm-bindgen"\nversion = "([^"\n]+)"', Path(sys.argv[1]).read_text())
if not match:
    raise SystemExit('Could not find wasm-bindgen in Cargo.lock')
print(match.group(1))
VERSION
)"
if ! command -v "$task_bindgen" >/dev/null 2>&1 || [[ "$("$task_bindgen" --version)" != "wasm-bindgen $task_bindgen_version" ]]; then
    echo "Use wasm-bindgen-cli $task_bindgen_version, or set WASM_BINDGEN_BIN to a matching executable." >&2
    exit 1
fi
task_target_dir="$(cargo metadata --no-deps --format-version 1 --manifest-path "$task_root_dir/Cargo.toml" | python3 -c 'import json, sys; print(json.load(sys.stdin)["target_directory"])')"
"$task_bindgen" --target web --out-name ishape_wasm --out-dir "$task_root_dir/pkg" "$task_target_dir/wasm32-unknown-unknown/release/ishape_wasm.wasm"

for task_destination in "$task_docs_dir/src/js/i_shape" "$task_root_dir/examples/html/ishape"; do
    for task_filename in ishape_wasm.js ishape_wasm.d.ts ishape_wasm_bg.wasm ishape_wasm_bg.wasm.d.ts; do
        cp "$task_root_dir/pkg/$task_filename" "$task_destination/$task_filename"
    done
done
cp "$task_root_dir/README.md" "$task_root_dir/pkg/README.md"
