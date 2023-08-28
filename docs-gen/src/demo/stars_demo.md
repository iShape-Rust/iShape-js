<style>

.demo-title {
    color: #333;
    text-align: center;
}

.sheet-container {
    max-width: 1000px;
    margin: auto;
 }

.rotating-stars-input-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.star-input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
}

.star-input-group {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
}

.star-input-group label {
    flex: none;
    width: 150px;
    white-space: nowrap;
    text-align: right;
    margin-right: 20px;
}

.star-input-group input {
    flex: none;
    width: 150px;
}

#starCanvas {
    display: block;
    margin: 20px auto;
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
</style>
<div class="sheet-container">
	<script type="module" src="./js/demo/stars.js" defer></script>
	<h1 class="demo-title">Stars Rotation</h1>
	<div class="rotating-stars-input-container">
	    <div class="star-input-container">
	        <h3 class="title">Subject Star</h3>
	        <div class="star-input-group">
	            <label for="subjFirstRadius">First Radius: </label>
	            <input type="range" id="subjFirstRadius" min="10" max="100" value="60">
	        </div>
	        <div class="star-input-group">
	            <label for="subjSecondRadius">Second Radius: </label>
	            <input type="range" id="subjSecondRadius" min="10" max="100" value="30">
	        </div>
	        <div class="star-input-group">
	            <label for="subjRotationSpeed">Rotation Speed: </label>
	            <input type="range" id="subjRotationSpeed" min="1" max="100" value="5">
	        </div>
	        <div class="star-input-group">
	            <label for="subjAngleCount">Corners Count: </label>
	            <input type="range" id="subjAngleCount" min="3" max="24" value="7">
	        </div>
	    </div>
	    <div class="star-input-container">
	        <h3 class="title">Clip Star</h3>
	        <div class="star-input-group">
	            <label for="clipFirstRadius">First Radius: </label>
	            <input type="range" id="clipFirstRadius" min="10" max="100" value="60">
	        </div>
	        <div class="star-input-group">
	            <label for="clipSecondRadius">Second Radius: </label>
	            <input type="range" id="clipSecondRadius" min="10" max="100" value="30">
	        </div>
	        <div class="star-input-group">
	            <label for="clipRotationSpeed">Rotation Speed: </label>
	            <input type="range" id="clipRotationSpeed" min="1" max="100" value="5">
	        </div>
	        <div class="star-input-group">
	            <label for="clipAngleCount">Corners Count: </label>
	            <input type="range" id="clipAngleCount" min="3" max="24" value="7">
	        </div>
	    </div>
	</div>
    <div class="operation-selection">
        <label for="operationType">Operation: </label>
        <select id="operationType">
            <option value="Xor">Xor</option>
            <option value="Union">Union</option>
            <option value="Intersect">Intersect</option>
            <option value="Difference">Difference</option>
            <option value="Subject">Subject</option>
            <option value="Clip">Clip</option>
		</select>
    </div>
    <canvas id="starCanvas" width="800" height="800"/>
</div>
