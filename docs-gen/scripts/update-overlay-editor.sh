#!/usr/bin/env bash
set -euo pipefail

task_docs_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
task_editor_dir="${OVERLAY_EDITOR_DIR:-$task_docs_dir/../../iOverlay/examples/overlay_editor}"
task_bindgen="${WASM_BINDGEN_BIN:-wasm-bindgen}"
task_assets_dir="$task_docs_dir/src/js/overlay_editor"

cargo build --locked --release --target wasm32-unknown-unknown --lib --manifest-path "$task_editor_dir/Cargo.toml"
task_bindgen_version="$(python3 - "$task_editor_dir/Cargo.lock" <<'VERSION'
import re, sys
from pathlib import Path
match = re.search(r'name = "wasm-bindgen"\nversion = "([^"\n]+)"', Path(sys.argv[1]).read_text())
if not match:
    raise SystemExit('Could not find wasm-bindgen in the editor Cargo.lock')
print(match.group(1))
VERSION
)"
if ! command -v "$task_bindgen" >/dev/null 2>&1; then
    echo "Install the matching CLI: cargo install wasm-bindgen-cli --version $task_bindgen_version --locked" >&2
    echo "Or set WASM_BINDGEN_BIN to an existing compatible executable." >&2
    exit 1
fi
if [[ "$("$task_bindgen" --version)" != "wasm-bindgen $task_bindgen_version" ]]; then
    echo "The editor requires wasm-bindgen $task_bindgen_version." >&2
    exit 1
fi
task_target_dir="$(cargo metadata --no-deps --format-version 1 --manifest-path "$task_editor_dir/Cargo.toml" | python3 -c 'import json, sys; print(json.load(sys.stdin)["target_directory"])')"
"$task_bindgen" --target web --out-name overlay_editor --out-dir "$task_assets_dir" "$task_target_dir/wasm32-unknown-unknown/release/overlay_editor.wasm"

python3 - "$task_editor_dir/../tests" "$task_assets_dir/tests" <<'FIXTURES'
import json, sys
from pathlib import Path
source, destination = map(Path, sys.argv[1:])
destination.mkdir(exist_ok=True)
for mode in ['boolean', 'string', 'stroke', 'variable_stroke', 'outline']:
    paths = sorted((source / mode).glob('test_*.json'), key=lambda path: int(path.stem.split('_')[-1]))
    indexes = [int(path.stem.split('_')[-1]) for path in paths]
    if not paths or indexes != list(range(len(paths))):
        raise SystemExit(f'{mode} fixtures must have consecutive indexes starting at zero')
    data = [json.loads(path.read_text()) for path in paths]
    (destination / f'{mode}_tests.json').write_text(json.dumps(data, indent=4) + '\n')
    print(f'{mode}: {len(data)} examples')
FIXTURES

cd "$task_docs_dir"
npm run build:ts
