<div class="demo-shell minkowski-demo">
<script type="module">
const paths = ['../js/triangle/minkowski.js', './js/triangle/minkowski.js', '/js/triangle/minkowski.js'];
for (const path of paths) {
    let response;
    try { response = await fetch(path, { method: 'HEAD' }); } catch { continue; }
    if (response.ok) {
        await import(path);
        break;
    }
}
</script>
<h1 class="demo-title">Minkowski Operations</h1>
<div class="demo-controls">
<div class="demo-control">
<label class="geometry-subject" for="minkowski-a">Shape A:</label>
<select id="minkowski-a" disabled></select>
</div>
<div class="demo-control">
<label class="geometry-clip" for="minkowski-b">Shape B:</label>
<select id="minkowski-b" disabled></select>
</div>
<div class="demo-control">
<label for="minkowski-operation">Operation:</label>
<select id="minkowski-operation" disabled>
<option value="sum">Sum: A + B</option>
<option value="difference">Difference: A − B</option>
</select>
</div>
</div>
<div class="minkowski-toolbar">
<p class="demo-hint">Drag the vertices of either shape, including the hole, to update the result.</p>
<button class="demo-button" id="minkowski-reset" type="button" disabled>Reset shapes</button>
</div>
<div class="minkowski-legend" aria-label="Shape colors">
<span class="geometry-subject">■ A</span>
<span class="geometry-clip">■ B</span>
<span class="minkowski-result">■ Result: <strong id="minkowski-formula">A + B</strong></span>
</div>
<canvas class="demo-canvas minkowski-canvas" id="minkowski-canvas" width="800" height="640" aria-label="Minkowski result and editable vertices of shapes A and B on a shared coordinate grid"></canvas>
<p class="minkowski-status" id="minkowski-status" role="status" aria-live="polite">Loading Minkowski operations…</p>
<p class="demo-hint">Both shapes share the same origin. The sum contains all point sums a + b; the difference contains all a − b and reflects B through the origin. Minkowski difference is not Boolean subtraction or erosion. Shapes use the Non-Zero fill rule. Circle is a 24-sided polygon.</p>
</div>
