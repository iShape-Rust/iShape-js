import init, { JsOverlay, JsOverlayGraph, JsShapeType, JsFillRule} from '../i_shape/i_shape_js.js';

const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');
let subjAngle = 0;
let clipAngle = 0;

let lastFrameTime = 0;
const maxFPS = 60;
const frameDuration = 1000 / maxFPS;

const subjFirstRadiusSlider = document.getElementById('subjFirstRadius');
const subjSecondRadiusSlider = document.getElementById('subjSecondRadius');
const subjRotationSpeedSlider = document.getElementById('subjRotationSpeed');
const subjAngleCountSlider = document.getElementById('subjAngleCount');

const clipFirstRadiusSlider = document.getElementById('clipFirstRadius');
const clipSecondRadiusSlider = document.getElementById('clipSecondRadius');
const clipRotationSpeedSlider = document.getElementById('clipRotationSpeed');
const clipAngleCountSlider = document.getElementById('clipAngleCount');

const operationTypeSelect = document.getElementById('operationType');

const colorStore = [
    "#FF9500", // Orange
    "#5856D6", // Purple
    "#FF2D55", // Pink
    "#5AC8FA", // Blue
    "#4CD964", // Green
    "#FFCC00", // Yellow
    "#8E8E93", // Gray
    "#FF3B30", // Red
    "#34C759", // Green
    "#007AFF", // Blue
    "#AF52DE", // Indigo
    "#FFD60A"  // Teal
];

run();

async function run() {
  await init(); // Initialize the wasm module

  requestAnimationFrame(draw);
}

function draw(currentTime) {
    const deltaTime = currentTime - lastFrameTime;

    const a = 0.45 * 0.01 * Math.min(canvas.width, canvas.height);

    if (deltaTime < frameDuration) {
        requestAnimationFrame(draw);
        return;
    }

    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const subjFirstRadius = a * parseInt(subjFirstRadiusSlider.value, 10);
    const subjSecondRadius = a * parseInt(subjSecondRadiusSlider.value, 10);
    const subjRotationSpeed = parseInt(subjRotationSpeedSlider.value, 10) * 0.0005;
    const subjAngleCount = parseInt(subjAngleCountSlider.value, 10);
    
    const clipFirstRadius = a * parseInt(clipFirstRadiusSlider.value, 10);
    const clipSecondRadius = a * parseInt(clipSecondRadiusSlider.value, 10);
    const clipRotationSpeed = parseInt(clipRotationSpeedSlider.value, 10) * 0.0005;
    const clipAngleCount = parseInt(clipAngleCountSlider.value, 10);
    
    const selectedOperation = operationTypeSelect.value;

    let fillRule;
    switch (selectedOperation) {
        case 'Union':
            fillRule = JsFillRule.Union;
            break;
        case 'Intersect':
            fillRule = JsFillRule.Intersect;
            break;
        case 'Difference':
            fillRule = JsFillRule.Difference;
            break;
        case 'Xor':
            fillRule = JsFillRule.Xor;
            break;
        case 'Subject':
            fillRule = JsFillRule.Subject;  // Replace with the actual value
            break;
        case 'Clip':
            fillRule = JsFillRule.Clip;  // Replace with the actual value
            break;
    }

    let x0 = 0.5 * canvas.width;
    let y0 = 0.5 * canvas.height;

    const subj = createStar({ x: x0, y: y0 }, subjFirstRadius, subjSecondRadius, subjAngleCount, subjAngle);
    const clip = createStar({ x: x0, y: y0 }, clipFirstRadius, clipSecondRadius, clipAngleCount, clipAngle);

    const overlay = new JsOverlay();

    overlay.add_shape(subj, JsShapeType.Subject);
    overlay.add_shape(clip, JsShapeType.Clip);

    const graph = overlay.build_graph();
    const result = graph.extract_shapes(fillRule);

    var index = 0;
    result.shapes.forEach((shape) => {
      const stroke = getColorByIndex(index);
      const fill = getColorByIndex(index, 0.5);


      drawShape(ctx, shape, fill, stroke, 8);
      index += 1;
    });

    subjAngle += subjRotationSpeed;
    clipAngle -= clipRotationSpeed;

    requestAnimationFrame(draw);
}

function createStar(center, r0, r1, count, angle) {
  const da = Math.PI / count;
  let a = angle;
  const x0 = center.x;
  const y0 = center.y;

  const points = [];

  for (let i = 0; i < count; i++) {
    const xr0 = r0 * Math.cos(a);
    const yr0 = r0 * Math.sin(a);

    a += da;

    const xr1 = r1 * Math.cos(a);
    const yr1 = r1 * Math.sin(a);

    a += da;

    points.push([x0 + xr0, y0 + yr0]);
    points.push([x0 + xr1, y0 + yr1]);
  }

  return {
    paths: [{ points: points }]
  };
}

function drawShape(ctx, shape, fillColor, strokeColor, lineWidth) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let region = new Path2D();

    shape.paths.forEach((path) => {
        const points = path.points;
        const [x0, y0] = points[0];
        region.moveTo(x0, y0);

        for (let i = 1; i < points.length; i++) {
          const [x, y] = points[i];
          region.lineTo(x, y);
        }

        region.closePath();
    });

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;

    ctx.stroke(region);
    ctx.fill(region, 'evenodd');
}

function getColorByIndex(index, opacity = 1) {
    const n = colorStore.length;
    const i = index % n;
    const color = colorStore[i];

    if (opacity === 1) {
        return color;
    }

    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return color + alpha;
}

