<div class="demo-shell">
	<script type="text/javascript">
// in different environments the path is different
const paths = [
  '../js/triangle/triangulation.js',
  './js/triangle/triangulation.js',
  '/js/triangle/triangulation.js'
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
	<h1 class="demo-title">Triangulation</h1>
    <div class="demo-controls">
        <div class="demo-control">
            <label for="mode">Mode: </label>
            <select id="mode">
                <option value="Delaunay">Delaunay</option>
                <option value="Raw">Raw</option>
                <option value="Convex">Convex</option>
            </select>
        </div>
        <div class="demo-control demo-control--toggle">
            <label for="points">Steiner Points: </label>
            <input type="checkbox" id="points" name="points" value="true" checked>
        </div>
    </div><p class="demo-hint">Drag a vertex to edit the shape.</p><div class="demo-navigation">
        <button type="button" class="demo-button" id="test-prev" aria-label="Previous test">← Prev</button>
        <h3 class="demo-test-title" id="test-name">Title</h3>
        <button type="button" class="demo-button" id="test-next" aria-label="Next test">Next →</button>
    </div>
    <canvas class="demo-canvas demo-canvas--draggable" id="editorCanvas" width="800" height="800"></canvas>
</div>
