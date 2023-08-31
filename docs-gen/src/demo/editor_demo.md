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

.operation-selection label {
    flex: none;
    width: 150px;
    white-space: nowrap;
    text-align: right;
    margin-right: 20px;
    font-size: 20px;
}

.operation-selection select {
	-webkit-appearance: none;
    padding-left: 4px;
    flex: none;
    width: 150px;
    font-size: 20px;
}

#editorCanvas {
    display: block;
    border: 2px dotted #80808080;
}

.editor-input-container {
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
	<!-- <script type="module" src="../js/demo/editor.js" defer></script> -->
	<script type="module" src="/js/demo/editor.js" defer></script>
	<h1 class="demo-title">Shapes Editor</h1>
    <div class="operation-selection">
        <label for="operationType">Operation: </label>
        <select id="operationType">
            <option value="Union">Union</option>
            <option value="Xor">Xor</option>
            <option value="Intersect">Intersect</option>
            <option value="Difference">Difference</option>
        </select>
    </div>
    <div class="editor-input-tool">
        <div class="editor-input-group">
            <div class="input-wrapper">
                <label for="snap">Snap to Grid: </label>
                <input type="checkbox" id="snap" name="snap" value="true" checked>
            </div>
        </div>
        <div class="editor-input-group">
            <div class="input-wrapper">
                <label for="fill">Fill Segments: </label>
                <input type="checkbox" id="fill" name="fill" value="true" checked>
            </div>
        </div>
    </div>
    <div class="editor-input-container">
        <button type="button" class="nav-button" id="test-prev">Prev</button>
        <h3 class="test-title" id="test-name">Title</h3>
        <button type="button" class="nav-button" id="test-next">Next</button>
    </div>
    <canvas id="editorCanvas" width="750" height="900"/>
</div>
