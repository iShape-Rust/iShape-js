<div class="demo-shell demo-shell--wide curve-playground curve-motion">
<script type="text/javascript">
document.documentElement.classList.add('curve-playground-page');
// In different environments the path is different.
const paths = [
  '../js/curve/motion_lab.js',
  './js/curve/motion_lab.js',
  '/js/curve/motion_lab.js'
];
async function fileExists(path) {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch (e) {
    return false;
  }
}
(async () => {
  for (const path of paths) {
    if (await fileExists(path)) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = `${path}?v=${encodeURIComponent(document.lastModified)}`;
      document.head.appendChild(script);
      break;
    }
  }
})();
</script>
<header class="curve-playground__header">
    <p class="curve-playground__eyebrow">iCurve · animated WASM benchmark</p>
    <h1 class="demo-title">Curve Motion Lab</h1>
    <p class="curve-playground__intro">Stress-test live Boolean operations on continuously rebuilt cubic Bézier contours. Increase the workload and watch both the geometry and timings respond.</p>
</header>
<section class="curve-playground__panel" aria-label="Curve motion controls">
    <div class="curve-motion__control-grid">
        <label class="curve-motion__field">
            <span class="curve-playground__label">Curve pairs <output id="curve-motion-count-output">9</output></span>
            <input id="curve-motion-count" type="range" min="1" max="36" step="1" value="9">
        </label>
        <label class="curve-motion__field">
            <span class="curve-playground__label">Segments per contour <output id="curve-motion-detail-output">20</output></span>
            <input id="curve-motion-detail" type="range" min="8" max="64" step="4" value="20">
        </label>
        <label class="curve-motion__field">
            <span class="curve-playground__label">Size <output id="curve-motion-size-output">82%</output></span>
            <input id="curve-motion-size" type="range" min="45" max="125" step="1" value="82">
        </label>
        <label class="curve-motion__field">
            <span class="curve-playground__label">Motion <output id="curve-motion-speed-output">1.0×</output></span>
            <input id="curve-motion-speed" type="range" min="0" max="200" step="5" value="100">
        </label>
        <label class="curve-motion__field">
            <span class="curve-playground__label">Angle tolerance <output id="curve-motion-tolerance-output">0.125</output></span>
            <input id="curve-motion-tolerance" type="range" min="25" max="500" step="25" value="125">
        </label>
    </div>
    <div class="curve-motion__toolbar">
        <div class="curve-playground__control-block">
            <span class="curve-playground__label" id="curve-motion-operation-label">Operation</span>
            <div class="curve-playground__segments" role="group" aria-labelledby="curve-motion-operation-label">
                <button type="button" class="curve-playground__segment" data-operation="Union" aria-pressed="false">Union</button>
                <button type="button" class="curve-playground__segment is-active" data-operation="Intersect" aria-pressed="true">Intersect</button>
                <button type="button" class="curve-playground__segment" data-operation="Difference" aria-pressed="false">Difference</button>
                <button type="button" class="curve-playground__segment" data-operation="Xor" aria-pressed="false">Exclusion</button>
            </div>
        </div>
        <button type="button" class="demo-button curve-playground__reset" id="curve-motion-toggle" aria-pressed="false">Pause</button>
    </div>
</section>
<div class="curve-playground__legend" aria-label="Canvas legend">
    <span><i class="curve-playground__key curve-playground__key--subject"></i>Subject curves</span>
    <span><i class="curve-playground__key curve-playground__key--clip"></i>Clip curves</span>
    <span><i class="curve-playground__key curve-playground__key--result"></i>Boolean result</span>
</div>
<div class="curve-playground__stage">
    <canvas class="demo-canvas curve-playground__canvas curve-motion__canvas" id="curve-motion-canvas" width="1000" height="620" aria-label="Animated Boolean operations over cubic Bézier contours"></canvas>
    <p class="curve-playground__canvas-hint">Dashed inputs · solid result · measured in this browser</p>
</div>
<section class="curve-playground__stats curve-motion__stats" aria-label="Live benchmark statistics">
    <div class="curve-playground__stat">
        <span>Input</span>
        <strong id="curve-motion-stat-input">—</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Result</span>
        <strong id="curve-motion-stat-result">—</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Solve median</span>
        <strong id="curve-motion-stat-median">—</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Solve p95</span>
        <strong id="curve-motion-stat-p95">—</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Frame rate</span>
        <strong id="curve-motion-stat-fps">—</strong>
    </div>
</section>
<p class="curve-playground__status" id="curve-motion-status">Loading WebAssembly…</p>
</div>
