<style>
:root {
    --content-max-width: none;
    width: auto;
}

.demo-title {
    color: #333;
    text-align: center;
}

.sheet-container {
    min-width: 1200px;
    min-height: 1400px;
    max-width: 2000px;
    margin: auto;
}

#iced {
    max-width: 2000px; 
}

#unsupported-warning {
    display: none;
    text-align: center;
    font-size: 1.2em;
    color: red;
    padding: 20px;
    background-color: #f9eaea;
    border: 1px solid #d4a5a5;
    border-radius: 5px;
    max-width: 800px;
}

#unsupported-warning img {
    width: 150px;
    height: auto;
    margin-top: 10px;
}
</style>

<div class="sheet-container">
    <h1 class="demo-title">Overlay Editor</h1>
    <div id="unsupported-warning">
        <p>Your browser does not support WebGPU.</p>
        <p>Please use a WebGPU-supported browser, such as the latest version of Chrome.</p>
        <img src="./webgpu.svg" alt="WebGPU not supported">
    </div>
    <canvas id="iced" width="1750" height="1750"></canvas>
</div>

<script type="text/javascript">
(async () => {
  // Feature detection for WebGPU
  if (!navigator.gpu) {
    document.getElementById('iced').style.display = 'none';
    document.getElementById('unsupported-warning').style.display = 'block';
    return;
  }

  // In different environments, the path is different
  const paths = [
    '../js/overlay_editor/editor.js',
    './js/overlay_editor/editor.js',
    '/js/overlay_editor/editor.js'
  ];

  async function fileExists(path) {
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch (e) {
      return false;
    }
  }

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
