<style>

.demo-title {
    text-align: center;
}

.test-title {
    text-align: center;
    margin-top: 0;
}

.sheet-container {
    max-width: 1000px;
    min-width: 800px;
    margin: auto;
 }

.operation-selection {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 20px;
    font-size: 20px;
}

.operation-content {
    width: 320px;
    display: flex;
    align-items: center;
}

.operation-selection label {
    flex: none;
    width: 150px;
    white-space: nowrap;
    text-align: right;
    margin-right: 20px;
    font-size: 20px;
}

.operation-selection select {
    flex-grow: 1;
    width: auto;
    min-width: 0;
    font-size: 20px;
}

.operation-selection input {
    flex-grow: 1;
    width: auto;
    min-width: 0;
    font-size: 20px;
}

#editorCanvas {
    display: block;
    border: 2px dotted #80808080;
}

.editor-input-container {
    margin-top: 60px;
    display: flex;
    justify-content: space-between;
}

.editor-input-tool {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    justify-content: center;
    margin: 30px;
}

.editor-input-group {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    width: 160px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    flex: 1;
    margin-left: 32px;
}

.editor-input-group label {
    white-space: nowrap;
    text-align: left;
    margin-right: 10px;
    flex: 1;
}

.editor-input-group input {
    margin-left: auto;
}

.nav-button {
    width: 100px;
    height: 32px;
    font-size: 14px;
}

</style>
<div class="sheet-container">
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
    <div class="operation-selection">
        <div class="operation-content">
            <label for="strokeWidth">Stroke Width:</label>
            <input type="range" id="strokeWidth" min="0" max="500" value="50">
        </div>
    </div>
    <div class="operation-selection">
        <div class="operation-content">
            <label for="roundAngle">Round Angle:</label>
            <input type="range" id="roundAngle" min="0" max="100" value="10">
        </div>
    </div>
    <div class="operation-selection">
        <div class="operation-content">
            <label for="miterLimit">Miter Limit:</label>
            <input type="range" id="miterLimit" min="0" max="314" value="10">
        </div>
    </div>
    <div class="operation-selection">
        <div class="operation-content">
            <label for="startCap">Start Cap: </label>
            <select id="startCap">
                <option value="Butt">Butt</option>
                <option value="Round">Round</option>
                <option value="Square">Square</option>
            </select>
        </div>
    </div>
    <div class="operation-selection">
        <div class="operation-content">
            <label for="endCap">End Cap: </label>
            <select id="endCap">
                <option value="Butt">Butt</option>
                <option value="Round">Round</option>
                <option value="Square">Square</option>
            </select>
        </div>
    </div>
    <div class="operation-selection">
        <div class="operation-content">
            <label for="lineJoin">LineJoin: </label>
            <select id="lineJoin">
                <option value="Bevel">Bevel</option>
                <option value="Miter">Miter</option>
                <option value="Round">Round</option>
            </select>
        </div>
    </div>
    <div class="operation-selection">
        <div class="operation-content">
            <label for="closePath">Close Path: </label>
            <input style="flex-grow: 0;" type="checkbox" id="closePath" name="closePath" value="false">
        </div>
    </div>
    <div class="editor-input-container">
        <button type="button" class="nav-button" id="test-prev">Prev</button>
        <h3 class="test-title" id="test-name">Title</h3>
        <button type="button" class="nav-button" id="test-next">Next</button>
    </div>
    <canvas id="editorCanvas" width="800" height="800"></canvas>
</div>