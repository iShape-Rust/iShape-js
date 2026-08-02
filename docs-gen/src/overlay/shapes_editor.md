<div class="demo-shell">
	<script type="text/javascript">
// in different environments the path is different
const paths = [
  '../js/overlay/editor.js',
  './js/overlay/editor.js',
  '/js/overlay/editor.js'
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
      script.src = path;
      script.defer = true;
      document.head.appendChild(script);
      break;
    }
  }
})();
</script>
	<h1 class="demo-title">Shapes Editor</h1>
    <div class="demo-controls">
        <div class="demo-control">
            <label for="overlayRule">Overlay Rule:</label>
            <select id="overlayRule">
                <option value="Union">Union</option>
                <option value="Intersect">Intersect</option>
                <option value="Difference">Difference</option>
                <option value="InverseDifference">Inverse Difference</option>
                <option value="Xor">Xor</option>
                <option value="Subject">Subject</option>
                <option value="Clip">Clip</option>
            </select>
        </div>
        <div class="demo-control">
            <label for="fillRule">Fill Rule:</label>
            <select id="fillRule">
                <option value="EvenOdd">Even–Odd</option>
                <option value="NonZero">Non-Zero</option>
            </select>
        </div>
    </div><div class="demo-options">
        <label class="demo-option" for="snap">Snap to Grid <input type="checkbox" id="snap" name="snap" value="true" checked></label>
        <label class="demo-option" for="fill">Fill Segments <input type="checkbox" id="fill" name="fill" value="true"></label>
        <label class="demo-option" for="arrows">Show Arrows <input type="checkbox" id="arrows" name="arrows" value="true" checked></label>
    </div><div class="demo-legend" aria-label="Canvas legend">
        <span class="demo-legend-item"><span class="demo-swatch demo-swatch--subject"></span>Subject</span>
        <span class="demo-legend-item"><span class="demo-swatch demo-swatch--clip"></span>Clip</span>
        <span class="demo-legend-item"><span class="demo-swatch demo-swatch--result"></span>Result</span>
    </div><p class="demo-hint">Drag a vertex to edit the shape.</p><div class="demo-navigation">
        <button type="button" class="demo-button" id="test-prev" aria-label="Previous test">← Prev</button>
        <h3 class="demo-test-title" id="test-name">Title</h3>
        <button type="button" class="demo-button" id="test-next" aria-label="Next test">Next →</button>
    </div>
    <canvas class="demo-canvas demo-canvas--portrait demo-canvas--draggable" id="editorCanvas" width="750" height="1000"></canvas>
</div>
