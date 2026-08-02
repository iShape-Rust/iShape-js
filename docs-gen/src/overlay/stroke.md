<div class="demo-shell">
	<script type="text/javascript">
// in different environments the path is different
const paths = [
  '../js/overlay/stroke.js',
  './js/overlay/stroke.js',
  '/js/overlay/stroke.js'
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
	<h1 class="demo-title">Stroke Offset</h1>
    <div class="demo-controls">
        <div class="demo-control demo-control--range">
            <label for="strokeWidth">Stroke Width:</label>
            <input type="range" id="strokeWidth" min="0" max="500" value="50">
            <output class="demo-value" id="strokeWidthValue" for="strokeWidth">50</output>
        </div>
        <div class="demo-control demo-control--range">
            <label for="roundAngle">Round Angle:</label>
            <input type="range" id="roundAngle" min="0" max="100" value="10">
            <output class="demo-value" id="roundAngleValue" for="roundAngle">0.1</output>
        </div>
        <div class="demo-control demo-control--range">
            <label for="miterLimit">Miter Limit:</label>
            <input type="range" id="miterLimit" min="0" max="314" value="10">
            <output class="demo-value" id="miterLimitValue" for="miterLimit">0.1</output>
        </div>
        <div class="demo-control">
            <label for="startCap">Start Cap: </label>
            <select id="startCap">
                <option value="Butt">Butt</option>
                <option value="Round">Round</option>
                <option value="Square">Square</option>
            </select>
        </div>
        <div class="demo-control">
            <label for="endCap">End Cap: </label>
            <select id="endCap">
                <option value="Butt">Butt</option>
                <option value="Round">Round</option>
                <option value="Square">Square</option>
            </select>
        </div>
        <div class="demo-control">
            <label for="lineJoin">Line Join: </label>
            <select id="lineJoin">
                <option value="Bevel">Bevel</option>
                <option value="Miter">Miter</option>
                <option value="Round">Round</option>
            </select>
        </div>
        <div class="demo-control demo-control--toggle">
            <label for="closePath">Close Path: </label>
            <input type="checkbox" id="closePath" name="closePath" value="false">
        </div>
    </div><p class="demo-hint">Drag a vertex to edit the path.</p><div class="demo-navigation">
        <button type="button" class="demo-button" id="test-prev" aria-label="Previous test">← Prev</button>
        <h3 class="demo-test-title" id="test-name">Title</h3>
        <button type="button" class="demo-button" id="test-next" aria-label="Next test">Next →</button>
    </div>
    <canvas class="demo-canvas demo-canvas--draggable" id="editorCanvas" width="800" height="800"></canvas>
</div>
