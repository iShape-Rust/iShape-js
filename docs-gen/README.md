# Documentation site

Build the TypeScript modules and mdBook pages with `npm run build`.
Use `npm run serve` for the local documentation server.

## Updating iShape WASM

After changing the Rust API, regenerate the web bindings and copy them into the
documentation and HTML examples:

```sh
rustup target add wasm32-unknown-unknown
# Install the wasm-bindgen-cli version recorded in the root Cargo.lock.
npm run build:i-shape
npm run build
```

Set `WASM_BINDGEN_BIN` to use an existing compatible wasm-bindgen executable.
The command checks its version against Cargo.lock and updates `pkg` alongside
the demo assets. Run `node --test tests/triangle_relaxation.mjs` from the repository
root to check relaxation against the generated WASM.

## Updating Overlay Editor

The Overlay Editor page embeds the `eframe`/`egui` editor from the neighboring
`iOverlay/examples/overlay_editor` project. Its generated browser module and all
five numerically ordered fixture datasets are checked into
`src/js/overlay_editor`, so normal documentation builds do not require Rust.

To update the embedded editor after changing Rust source or fixtures:

```sh
rustup target add wasm32-unknown-unknown
# Use the wasm-bindgen-cli version from the editor Cargo.lock.
cargo install wasm-bindgen-cli --version 0.2.128 --locked
npm run build:overlay-editor
npm run build
```

Set `OVERLAY_EDITOR_DIR` if the Rust editor is in a different directory, or
`WASM_BINDGEN_BIN` to use an existing compatible wasm-bindgen executable.
The update command verifies the CLI version against Cargo.lock.

The demo requires WebGPU and an HTTPS or localhost origin. Startup errors appear
in the page. Its modes are Boolean, String, Stroke, Variable Stroke, and Outline.
