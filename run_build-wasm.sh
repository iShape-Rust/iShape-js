#!/bin/bash

set -euo pipefail
task_root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$task_root_dir"

wasm-pack build --release --target web
wasm-pack pack
