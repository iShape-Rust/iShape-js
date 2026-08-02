<div class="demo-shell demo-shell--wide curve-playground type-curve">
<script type="text/javascript">
// In different environments the path is different.
const paths = [
  '../js/curve/type_curve.js',
  './js/curve/type_curve.js',
  '/js/curve/type_curve.js'
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
    <p class="curve-playground__eyebrow">iCurve · text outlines · live WASM</p>
    <h1 class="demo-title">TypeCurve</h1>
</header>
<section class="curve-playground__panel" aria-label="Text curve editor controls">
    <div class="curve-playground__text-controls">
        <label class="curve-playground__field">
            <span class="curve-playground__label">Text</span>
            <input id="type-curve-text" class="curve-playground__text-input" type="text" value="CURVE 8" maxlength="12" inputmode="text" autocomplete="off" spellcheck="false" aria-describedby="type-curve-text-help">
        </label>
        <label class="curve-playground__field curve-playground__field--size">
            <span class="curve-playground__label">Font size <output id="type-curve-size-output">240 px</output></span>
            <input id="type-curve-size" type="range" min="144" max="288" step="4" value="240">
        </label>
        <button type="button" class="demo-button curve-playground__reset" id="type-curve-reset">Reset layout</button>
    </div>
    <p class="curve-playground__field-help" id="type-curve-text-help">One line of Latin letters and digits, up to 12 characters. Spaces do not affect Subject / Clip alternation.</p>
    <div class="curve-playground__control-grid">
        <div class="curve-playground__control-block curve-playground__control-block--operation">
            <span class="curve-playground__label" id="operation-label">Operation</span>
            <div class="curve-playground__segments" role="group" aria-labelledby="operation-label">
                <button type="button" class="curve-playground__segment is-active" data-operation="Union" aria-pressed="true">Union</button>
                <button type="button" class="curve-playground__segment" data-operation="Intersect">Intersect</button>
                <button type="button" class="curve-playground__segment" data-operation="Difference">Difference</button>
                <button type="button" class="curve-playground__segment" data-operation="InverseDifference">Inverse Difference</button>
                <button type="button" class="curve-playground__segment" data-operation="Xor">Exclusion</button>
            </div>
        </div>
        <div class="curve-playground__control-block">
            <span class="curve-playground__label" id="fill-rule-label">Fill rule</span>
            <div class="curve-playground__segments" role="group" aria-labelledby="fill-rule-label">
                <button type="button" class="curve-playground__segment is-active" data-fill-rule="EvenOdd" aria-pressed="true">Even–Odd</button>
                <button type="button" class="curve-playground__segment" data-fill-rule="NonZero" aria-pressed="false">Non-Zero</button>
            </div>
        </div>
    </div>
</section>
<div class="curve-playground__legend" aria-label="Canvas legend">
    <span><i class="curve-playground__key curve-playground__key--subject"></i>Subject glyphs</span>
    <span><i class="curve-playground__key curve-playground__key--clip"></i>Clip glyphs</span>
    <span><i class="curve-playground__key curve-playground__key--result"></i>Boolean result</span>
    <span><i class="curve-playground__key curve-playground__key--selected"></i>Selected glyph</span>
    <span><i class="curve-playground__handle-key"></i>Anchor / control</span>
</div>
<div class="curve-playground__stage">
    <canvas class="demo-canvas demo-canvas--draggable curve-playground__canvas" id="type-curve-canvas" width="1000" height="520" aria-label="Interactive editor for alternating Subject and Clip font outlines"></canvas>
    <p class="curve-playground__canvas-hint">Click a letter to edit · drag its fill to move · drag handles to reshape</p>
</div>
<section class="curve-playground__stats" aria-label="Live operation statistics" aria-live="polite">
    <div class="curve-playground__stat">
        <span>Selection</span>
        <strong id="type-curve-stat-selection">—</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Operation</span>
        <strong id="type-curve-stat-operation">Union</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Input</span>
        <strong id="type-curve-stat-input">—</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Result</span>
        <strong id="type-curve-stat-result">—</strong>
    </div>
    <div class="curve-playground__stat">
        <span>Compute</span>
        <strong id="type-curve-stat-time">—</strong>
    </div>
</section>
<p class="curve-playground__status" id="type-curve-status" role="status">Loading the local font and WebAssembly…</p>
<p class="curve-playground__attribution">Typeface: <a href="https://github.com/googlefonts/atkinson-hyperlegible">Atkinson Hyperlegible</a> by Braille Institute, licensed under <a href="../assets/fonts/AtkinsonHyperlegible-OFL.txt">SIL OFL 1.1</a>. Local outline parsing uses <a href="https://github.com/opentypejs/opentype.js">opentype.js</a> under the <a href="../js/vendor/OPENTYPE-LICENSE.txt">MIT License</a>.</p>
</div>
