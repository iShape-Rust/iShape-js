import { clearGeometryCanvas, drawGeometryPoint, geometryPalette, geometryStrokeWidth, withOpacity, onGeometryThemeChange, } from "../common/geometry_style.js";
import init, { LineCap, LineJoin, StrokeStyle, StrokeBuilder } from '../i_shape/ishape_wasm.js';
import { clientToCanvasPoint, requireCanvas2D, requireElement } from '../common/dom.js';
import { bindRangeOutput, formatHundredths, formatTestTitle } from '../common/demo.js';
import * as data from './stroke_data.js';
const strokeWidthSlider = requireElement('strokeWidth', HTMLInputElement);
const roundAngleSlider = requireElement('roundAngle', HTMLInputElement);
const miterLimitSlider = requireElement('miterLimit', HTMLInputElement);
const strokeWidthOutput = requireElement('strokeWidthValue', HTMLOutputElement);
const roundAngleOutput = requireElement('roundAngleValue', HTMLOutputElement);
const miterLimitOutput = requireElement('miterLimitValue', HTMLOutputElement);
bindRangeOutput(strokeWidthSlider, strokeWidthOutput);
bindRangeOutput(roundAngleSlider, roundAngleOutput, formatHundredths);
bindRangeOutput(miterLimitSlider, miterLimitOutput, formatHundredths);
const startCapSelect = requireElement('startCap', HTMLSelectElement);
const endCapSelect = requireElement('endCap', HTMLSelectElement);
const lineJoinSelect = requireElement('lineJoin', HTMLSelectElement);
const closePathTextField = requireElement('closePath', HTMLInputElement);
const prevButton = requireElement('test-prev', HTMLButtonElement);
const nextButton = requireElement('test-next', HTMLButtonElement);
const testTitle = requireElement('test-name', HTMLElement);
const { canvas, context: ctx } = requireCanvas2D('editorCanvas');
let testIndex = 0;
let selectedPoint = null;
let candidatePoint = null;
let isMousePressed = false;
let scale = 1.0;
if (window.devicePixelRatio > 1) {
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;
    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    scale = window.devicePixelRatio;
}
async function run() {
    await init();
    onGeometryThemeChange(() => requestAnimationFrame(draw));
    requestAnimationFrame(draw);
    testTitle.textContent = formatTestTitle(testIndex, data.tests.length, data.tests[testIndex].name);
}
void run();
function updateFrame() {
    requestAnimationFrame(draw);
}
prevButton.addEventListener('click', function () {
    const n = data.tests.length;
    testIndex = (testIndex - 1 + n) % n;
    requestAnimationFrame(draw);
    testTitle.textContent = formatTestTitle(testIndex, data.tests.length, data.tests[testIndex].name);
});
nextButton.addEventListener('click', function () {
    const n = data.tests.length;
    testIndex = (testIndex + 1) % n;
    requestAnimationFrame(draw);
    testTitle.textContent = formatTestTitle(testIndex, data.tests.length, data.tests[testIndex].name);
});
startCapSelect.addEventListener('change', updateFrame);
endCapSelect.addEventListener('change', updateFrame);
lineJoinSelect.addEventListener('change', updateFrame);
closePathTextField.addEventListener('change', updateFrame);
strokeWidthSlider.addEventListener('change', updateFrame);
strokeWidthSlider.addEventListener('input', updateFrame);
roundAngleSlider.addEventListener('change', updateFrame);
roundAngleSlider.addEventListener('input', updateFrame);
miterLimitSlider.addEventListener('change', updateFrame);
miterLimitSlider.addEventListener('input', updateFrame);
canvas.addEventListener('touchstart', function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    pressDown(touch.clientX, touch.clientY);
    requestAnimationFrame(draw);
}, { passive: false });
canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    move(touch.clientX, touch.clientY);
}, { passive: false });
canvas.addEventListener('touchend', function (event) {
    event.preventDefault();
    selectedPoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});
canvas.addEventListener('mousedown', function (event) {
    pressDown(event.clientX, event.clientY);
    requestAnimationFrame(draw);
});
canvas.addEventListener('mousemove', function (event) {
    move(event.clientX, event.clientY);
});
canvas.addEventListener('mouseup', function (event) {
    selectedPoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});
canvas.addEventListener('mouseout', function (event) {
    selectedPoint = null;
    candidatePoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});
function pressDown(eX, eY) {
    const [x, y] = clientToCanvasPoint(canvas, eX, eY, scale);
    const test = data.tests[testIndex];
    isMousePressed = true;
    const paths = test.paths;
    selectedPoint = findPoint(paths, x, y);
    if (selectedPoint !== null) {
        candidatePoint = null;
        return;
    }
}
function move(eX, eY) {
    const [x, y] = clientToCanvasPoint(canvas, eX, eY, scale);
    if (isMousePressed) {
        // Left mouse button was pressed
        if (selectedPoint !== null) {
            const rect = workingArea();
            selectedPoint[0] = Math.max(Math.min(x, rect.maxX), rect.minX);
            selectedPoint[1] = Math.max(Math.min(y, rect.maxY), rect.minY);
            requestAnimationFrame(draw);
        }
    }
    else {
        const wasCandidate = candidatePoint !== null;
        const test = data.tests[testIndex];
        candidatePoint = findPoint(test.paths, x, y);
        if (candidatePoint !== null) {
            requestAnimationFrame(draw);
            return;
        }
        if (wasCandidate) {
            requestAnimationFrame(draw);
            candidatePoint = null;
        }
    }
}
function findPoint(paths, x, y) {
    for (const path of paths) {
        for (let point of path) {
            const [px, py] = point;
            if (Math.abs(px - x) < 10 && Math.abs(py - y) < 10) {
                return point;
            }
        }
    }
    return null;
}
function draw() {
    const test = data.tests[testIndex];
    const strokeWidth = parseInt(strokeWidthSlider.value, 10);
    const roundAngle = 0.01 * parseInt(roundAngleSlider.value, 10);
    const miterLimit = 0.01 * parseInt(miterLimitSlider.value, 10);
    const startCap = toLineCap(startCapSelect.value);
    const endCap = toLineCap(endCapSelect.value);
    const lineJoin = toLineJoin(lineJoinSelect.value);
    const isClosedPath = closePathTextField.checked;
    const style = new StrokeStyle();
    style.width = strokeWidth;
    style.round_angle = roundAngle;
    style.miter_limit = miterLimit;
    style.start_cap = startCap;
    style.end_cap = endCap;
    style.join = lineJoin;
    const builder = StrokeBuilder.with_style(style);
    const result = builder.build(test.paths, isClosedPath);
    clearGeometryCanvas(ctx, canvas.width / scale, canvas.height / scale);
    drawWorkingArea(ctx);
    drawPaths(ctx, test.paths, geometryPalette.subject, geometryStrokeWidth, isClosedPath);
    result.forEach((shape) => {
        const stroke = geometryPalette.result;
        const fill = withOpacity(geometryPalette.result, 0.12);
        drawShape(ctx, shape, fill, stroke, geometryStrokeWidth);
    });
    drawPoints(ctx, test.paths, geometryPalette.subject);
    if (selectedPoint !== null) {
        drawGeometryPoint(ctx, selectedPoint, geometryPalette.subject, "active");
    }
    if (candidatePoint !== null) {
        drawGeometryPoint(ctx, candidatePoint, geometryPalette.subject, "hover");
    }
}
function drawWorkingArea(ctx) {
    const rect = workingArea();
    ctx.setLineDash([4, 10]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = geometryPalette.border;
    ctx.beginPath();
    ctx.moveTo(rect.minX, rect.minY);
    ctx.lineTo(rect.minX, rect.maxY);
    ctx.lineTo(rect.maxX, rect.maxY);
    ctx.lineTo(rect.maxX, rect.minY);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
}
function drawShape(ctx, shape, fillColor, strokeColor, lineWidth) {
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
    ctx.fill(region, "nonzero");
    if (lineWidth > 0 && strokeColor !== null) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke(region);
    }
}
function drawPaths(ctx, paths, strokeColor, lineWidth, isClose) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const region = new Path2D();
    paths.forEach((points) => {
        const [x0, y0] = points[0];
        region.moveTo(x0, y0);
        for (let i = 1; i < points.length; i++) {
            const [x, y] = points[i];
            region.lineTo(x, y);
        }
        if (isClose) {
            region.closePath();
        }
    });
    if (lineWidth > 0 && strokeColor !== null) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke(region);
    }
}
function drawPoints(ctx, paths, color) {
    ctx.fillStyle = color;
    paths.forEach((points) => {
        for (let i = 0; i < points.length; i++) {
            drawGeometryPoint(ctx, points[i], color);
        }
    });
}
function toLineJoin(value) {
    switch (value) {
        case 'Bevel':
            return LineJoin.Bevel;
        case 'Miter':
            return LineJoin.Miter;
        case 'Round':
            return LineJoin.Round;
        default:
            throw new Error(`Unknown line join: ${value}`);
    }
}
function toLineCap(value) {
    switch (value) {
        case 'Butt':
            return LineCap.Butt;
        case 'Round':
            return LineCap.Round;
        case 'Square':
            return LineCap.Square;
        default:
            throw new Error(`Unknown line cap: ${value}`);
    }
}
function workingArea() {
    const minX = 50;
    const maxX = canvas.width / scale - 50;
    const maxY = canvas.height / scale - 50;
    const minY = 50;
    return { minX, minY, maxX, maxY };
}
//# sourceMappingURL=stroke.js.map