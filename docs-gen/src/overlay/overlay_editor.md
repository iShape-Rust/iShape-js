<style>
:root {
    --content-max-width: none;
}

#unsupported-warning {
    display: none;
}
</style>

<div class="demo-shell demo-shell--wide">
    <h1 class="demo-title">Overlay Editor</h1>
    <div class="demo-warning" id="unsupported-warning">
        <p>Your browser does not support WebGPU.</p>
        <p>Please use a WebGPU-supported browser, such as the latest version of Chrome.</p>
        <img src="./webgpu.svg" alt="WebGPU not supported">
    </div><div class="demo-app-viewport">
        <canvas class="demo-app-canvas" id="iced" width="800" height="800"></canvas>
    </div>
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
    '../js/overlay_editor/web_app.js',
    './js/overlay_editor/web_app.js',
    '/js/overlay_editor/web_app.js'
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
