<div class="demo-shell demo-shell--wide curve-playground">
<script type="text/javascript">
document.documentElement.classList.add('curve-playground-page');
// In different environments the path is different.
const paths = [
  '../js/curve/boolean_playground.js',
  './js/curve/boolean_playground.js',
  '/js/curve/boolean_playground.js'
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
  script.defer = true;
  document.head.appendChild(script);
  break;
}
  }
})();
</script>
<header class="curve-playground__header">
    <p class="curve-playground__eyebrow">iCurve · live WASM</p>
    <h1 class="demo-title">Boolean Playground</h1>
    <p class="curve-playground__intro">Move the shapes or edit their curve handles. Every change is rebuilt with <code>CurveBuilder</code> and resolved by <code>CurveOverlay</code>.</p>
</header>
<section class="curve-playground__test-switcher" aria-label="Playground examples">
    <button type="button" class="demo-button curve-playground__test-arrow" id="curve-test-prev" aria-label="Previous example">←</button>
    <div class="curve-playground__test-copy">
        <span class="curve-playground__test-index" id="curve-test-index">1 / 4</span>
        <h2 id="curve-test-name">Bloom &amp; Sun</h2>
        <p id="curve-test-description">A six-petal flower meets a warm elliptical sun.</p>
        <div class="curve-playground__test-dots" id="curve-test-dots" aria-label="Choose example"></div>
    </div>
    <button type="button" class="demo-button curve-playground__test-arrow" id="curve-test-next" aria-label="Next example">→</button>
</section>
<section class="curve-playground__panel" aria-label="Boolean playground controls">
    <div class="curve-playground__control-block">
        <span class="curve-playground__label" id="operation-label">Operation</span>
        <div class="curve-playground__segments" role="group" aria-labelledby="operation-label">
            <button type="button" class="curve-playground__segment is-active" data-operation="Union" aria-pressed="true">Union</button>
            <button type="button" class="curve-playground__segment" data-operation="Intersect">Intersect</button>
            <button type="button" class="curve-playground__segment" data-operation="Difference">Difference</button>
            <button type="button" class="curve-playground__segment" data-operation="InverseDifference">Inverse Difference</button>
            <button type="button" class="curve-playground__segment" data-operation="Xor">Exclusion</button>
        </div>
    </div>
    <div class="curve-playground__toolbar">
        <div class="curve-playground__control-block curve-playground__control-block--compact">
            <span class="curve-playground__label" id="fill-rule-label">Fill rule</span>
            <div class="curve-playground__segments" role="group" aria-labelledby="fill-rule-label">
                <button type="button" class="curve-playground__segment is-active" data-fill-rule="EvenOdd" aria-pressed="true">Even–Odd</button>
                <button type="button" class="curve-playground__segment" data-fill-rule="NonZero">Non-Zero</button>
            </div>
        </div>
        <button type="button" class="demo-button curve-playground__reset" id="curve-reset">Reset shapes</button>
    </div>
</section>
<div class="curve-playground__legend" aria-label="Canvas legend">
    <span><i class="curve-playground__key curve-playground__key--subject"></i>Subject</span>
    <span><i class="curve-playground__key curve-playground__key--clip"></i>Clip</span>
    <span><i class="curve-playground__key curve-playground__key--result"></i>Boolean result</span>
    <span><i class="curve-playground__handle-key"></i>Anchor / control</span>
</div>
<div class="curve-playground__stage">
    <canvas class="demo-canvas demo-canvas--draggable curve-playground__canvas" id="curve-canvas" width="1000" height="680" aria-label="Interactive Boolean operation over two editable curve shapes"></canvas>
    <p class="curve-playground__canvas-hint">Drag a filled shape to move it · drag any handle to reshape it</p>
</div>
<section class="curve-playground__stats" aria-label="Live operation statistics" aria-live="polite">
    <div class="curve-playground__stat">
        <span>Operation</span>
        <strong id="curve-stat-operation">Intersect</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Input segments</span>
        <strong id="curve-stat-input">—</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Result</span>
        <strong id="curve-stat-result">—</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Compute</span>
        <strong id="curve-stat-time">—</strong>
    </div>
</section>
<p class="curve-playground__status" id="curve-status" role="status">Loading WebAssembly…</p>
</div>
