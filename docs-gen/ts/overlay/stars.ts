import init, { Overlay, FillRule, OverlayRule} from '../i_shape/ishape_wasm.js';
import {requireCanvas2D, requireElement} from '../common/dom.js';
import type {Contour, Shape, Shapes} from '../geometry/path.js';
import {Vector} from '../geometry/vector.js';

const {canvas, context: ctx} = requireCanvas2D('starCanvas');
let subjAngle = 0;
let clipAngle = 0;

let lastFrameTime = 0;
const maxFPS = 60;
const frameDuration = 1000 / maxFPS;

const subjFirstRadiusSlider = requireElement('subjFirstRadius', HTMLInputElement);
const subjSecondRadiusSlider = requireElement('subjSecondRadius', HTMLInputElement);
const subjRotationSpeedSlider = requireElement('subjRotationSpeed', HTMLInputElement);
const subjAngleCountSlider = requireElement('subjAngleCount', HTMLInputElement);

const clipFirstRadiusSlider = requireElement('clipFirstRadius', HTMLInputElement);
const clipSecondRadiusSlider = requireElement('clipSecondRadius', HTMLInputElement);
const clipRotationSpeedSlider = requireElement('clipRotationSpeed', HTMLInputElement);
const clipAngleCountSlider = requireElement('clipAngleCount', HTMLInputElement);

const operationTypeSelect = requireElement('operationType', HTMLSelectElement);

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

void run();

async function run(): Promise<void> {
  await init(); // Initialize the wasm module

  requestAnimationFrame(draw);
}

function draw(currentTime: number): void {
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

    const overlayRule = selectedOverlayRule();
    const center = new Vector(0.5 * canvas.width, 0.5 * canvas.height);

    const subj = createStar(center, subjFirstRadius, subjSecondRadius, subjAngleCount, subjAngle);
    const clip = createStar(center, clipFirstRadius, clipSecondRadius, clipAngleCount, clipAngle);

    const overlay = createOverlay(subj, clip);
    const result = overlay.overlay(overlayRule, FillRule.EvenOdd);

    let index = 0;
    result.forEach((shape) => {
      const stroke = getColorByIndex(index);
      const fill = getColorByIndex(index, 0.5);


      drawShape(ctx, shape, fill, stroke, 8);
      index += 1;
    });

    subjAngle += subjRotationSpeed;
    clipAngle -= clipRotationSpeed;

    requestAnimationFrame(draw);
}

function createStar(center: Vector, r0: number, r1: number, count: number, angle: number): Contour {
  const da = Math.PI / count;
  let a = angle;
  const points: Contour = [];

  for (let i = 0; i < count; i++) {
    const outer = center.add(Vector.fromAngle(a, r0));

    a += da;

    const inner = center.add(Vector.fromAngle(a, r1));

    a += da;

    points.push(outer.toPoint());
    points.push(inner.toPoint());
  }

  return points;
}

function drawShape(ctx: CanvasRenderingContext2D, shape: Shape, fillColor: string, strokeColor: string, lineWidth: number): void {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const region = new Path2D();

    shape.forEach((points) => {
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

function getColorByIndex(index: number, opacity = 1): string {
    const n = colorStore.length;
    const i = index % n;
    const color = colorStore[i];

    if (opacity === 1) {
        return color;
    }

    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return color + alpha;
}

function selectedOverlayRule(): OverlayRule {
    switch (operationTypeSelect.value) {
        case 'Union':
            return OverlayRule.Union;
        case 'Intersect':
            return OverlayRule.Intersect;
        case 'Difference':
            return OverlayRule.Difference;
        case 'InverseDifference':
            return OverlayRule.InverseDifference;
        case 'Xor':
            return OverlayRule.Xor;
        case 'Subject':
            return OverlayRule.Subject;
        case 'Clip':
            return OverlayRule.Clip;
        default:
            throw new Error(`Unknown overlay rule: ${operationTypeSelect.value}`);
    }
}

function createOverlay(subj: Contour, clip: Contour): Overlay {
    const overlay = Overlay.new_with_subj_and_clip(subj, clip);
    if (overlay === undefined) {
        throw new Error('Could not create overlay');
    }

    return overlay;
}
