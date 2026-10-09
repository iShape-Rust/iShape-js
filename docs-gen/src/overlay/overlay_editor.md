<style>
:root {
    --content-max-width: none;
}

.overlay-editor {
    max-width: 1440px;
}

.overlay-editor .demo-app-viewport {
    overflow: hidden;
    border: 1px solid #303641;
    background: #15181d;
}

.overlay-editor .demo-app-canvas {
    width: 100%;
    height: clamp(560px, 76vh, 900px);
    touch-action: none;
}

.overlay-editor [hidden] {
    display: none !important;
}

.overlay-editor-status {
    text-align: center;
}
</style>

<div class="demo-shell demo-shell--wide overlay-editor">
    <h1 class="demo-title">Overlay Editor</h1>
    <p class="overlay-editor-status" id="overlay-editor-status" role="status" aria-live="polite">Loading editor…</p>
    <div class="demo-warning" id="unsupported-warning" role="alert" hidden>
        <p id="overlay-editor-error">The editor could not start.</p>
    </div>
    <div class="demo-app-viewport">
        <canvas class="demo-app-canvas" id="overlay-editor-canvas" width="1280" height="800" tabindex="0" aria-label="Interactive geometry editor"></canvas>
    </div>
</div>

<script type="text/javascript">
(async () => {
  const paths = [
    '../js/overlay_editor/web_app.js',
    './js/overlay_editor/web_app.js',
    '/js/overlay_editor/web_app.js'
  ];
  try {
    for (const path of paths) {
      const response = await fetch(path, { method: 'HEAD' });
      if (response.ok) {
        await import(path);
        return;
      }
    }
    throw new Error('The editor module could not be loaded.');
  } catch (error) {
    document.getElementById('overlay-editor-status').hidden = true;
    document.getElementById('overlay-editor-canvas').hidden = true;
    document.getElementById('overlay-editor-error').textContent = error instanceof Error ? error.message : String(error);
    document.getElementById('unsupported-warning').hidden = false;
  }
})();
</script>

Drag a point to edit its coordinates, drag the canvas to pan, and scroll to zoom.
Use **Up / Down** to switch examples. The **Parameters** button hides the right
inspector to give the canvas more space.

Modes: **Boolean**, **String**, **Stroke**, **Variable Stroke**, and **Outline**.
The Eagle and Star examples are available in Outline (`test_8` / `test_9`) and
Boolean (`test_11` / `test_12`); choose **Intersect** to cut them with a spiral.
