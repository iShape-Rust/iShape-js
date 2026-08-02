<div class="demo-shell">
	<script type="text/javascript">
// in different environments the path is different
const paths = [
  '../js/overlay/stars.js',
  './js/overlay/stars.js',
  '/js/overlay/stars.js'
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
	<h1 class="demo-title">Stars Rotation</h1>
	<div class="demo-controls">
	    <div class="demo-control-group">
	        <h3 class="title">Subject Star</h3>
	        <div class="demo-control demo-control--range">
	            <label for="subjFirstRadius">First Radius: </label>
	            <input type="range" id="subjFirstRadius" min="10" max="100" value="60">
	            <output class="demo-value" id="subjFirstRadiusValue" for="subjFirstRadius">60</output>
	        </div>
	        <div class="demo-control demo-control--range">
	            <label for="subjSecondRadius">Second Radius: </label>
	            <input type="range" id="subjSecondRadius" min="10" max="100" value="30">
	            <output class="demo-value" id="subjSecondRadiusValue" for="subjSecondRadius">30</output>
	        </div>
	        <div class="demo-control demo-control--range">
	            <label for="subjRotationSpeed">Rotation Speed: </label>
	            <input type="range" id="subjRotationSpeed" min="1" max="100" value="5">
	            <output class="demo-value" id="subjRotationSpeedValue" for="subjRotationSpeed">5</output>
	        </div>
	        <div class="demo-control demo-control--range">
	            <label for="subjAngleCount">Corner Count: </label>
	            <input type="range" id="subjAngleCount" min="3" max="24" value="7">
	            <output class="demo-value" id="subjAngleCountValue" for="subjAngleCount">7</output>
	        </div>
	    </div>
	    <div class="demo-control-group">
	        <h3 class="title">Clip Star</h3>
	        <div class="demo-control demo-control--range">
	            <label for="clipFirstRadius">First Radius: </label>
	            <input type="range" id="clipFirstRadius" min="10" max="100" value="60">
	            <output class="demo-value" id="clipFirstRadiusValue" for="clipFirstRadius">60</output>
	        </div>
	        <div class="demo-control demo-control--range">
	            <label for="clipSecondRadius">Second Radius: </label>
	            <input type="range" id="clipSecondRadius" min="10" max="100" value="30">
	            <output class="demo-value" id="clipSecondRadiusValue" for="clipSecondRadius">30</output>
	        </div>
	        <div class="demo-control demo-control--range">
	            <label for="clipRotationSpeed">Rotation Speed: </label>
	            <input type="range" id="clipRotationSpeed" min="1" max="100" value="5">
	            <output class="demo-value" id="clipRotationSpeedValue" for="clipRotationSpeed">5</output>
	        </div>
	        <div class="demo-control demo-control--range">
	            <label for="clipAngleCount">Corner Count: </label>
	            <input type="range" id="clipAngleCount" min="3" max="24" value="7">
	            <output class="demo-value" id="clipAngleCountValue" for="clipAngleCount">7</output>
	        </div>
	    </div><div class="demo-control demo-control--wide">
            <label for="operationType">Operation:</label>
            <select id="operationType">
                <option value="Xor">Xor</option>
                <option value="Union">Union</option>
                <option value="Intersect">Intersect</option>
                <option value="Difference">Difference</option>
                <option value="InverseDifference">Inverse Difference</option>
                <option value="Subject">Subject</option>
                <option value="Clip">Clip</option>
		    </select>
        </div>
    </div>
    <div class="demo-actions">
        <button type="button" class="demo-button" id="animation-toggle" aria-pressed="false">Pause</button>
        <button type="button" class="demo-button" id="animation-reset">Reset</button>
    </div>
    <canvas class="demo-canvas demo-canvas--stars" id="starCanvas" width="750" height="750"></canvas>
</div>
