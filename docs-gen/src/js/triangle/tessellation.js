import { clearGeometryCanvas, drawGeometryPoint, geometryPalette, geometryStrokeWidth, withOpacity, onGeometryThemeChange, } from "../common/geometry_style.js";
import init, { Triangulator } from "../i_shape/ishape_wasm.js";
import * as data from './triangulation_data.js';
import { clientToCanvasPoint, requireCanvas2D, requireElement } from "../common/dom.js";
import { bindRangeOutput, formatTestTitle } from "../common/demo.js";
const modeSelect = requireElement("mode", HTMLSelectElement);
const subdivisionSelect = requireElement("subdivision", HTMLSelectElement);
const relaxationCheckbox = requireElement("relaxation", HTMLInputElement);
const prevButton = requireElement("test-prev", HTMLButtonElement);
const nextButton = requireElement("test-next", HTMLButtonElement);
const testTitle = requireElement("test-name", HTMLElement);
const { canvas, context: ctx } = requireCanvas2D("editorCanvas");
const meshSizeSlider = requireElement("meshSize", HTMLInputElement);
const meshSizeOutput = requireElement("meshSizeValue", HTMLOutputElement);
const meshSizeLabel = requireElement("meshSizeLabel", HTMLLabelElement);
bindRangeOutput(meshSizeSlider, meshSizeOutput, value => String(subdivisionSelect.value === 'Uniform' ? value : value * value));
function updateMeshSizeControl() {
    const uniform = subdivisionSelect.value === 'Uniform';
    meshSizeLabel.textContent = uniform ? 'Edge length:' : 'Max area:';
    const size = Number(meshSizeSlider.value);
    meshSizeOutput.value = String(uniform ? size : size * size);
}
updateMeshSizeControl();
let testIndex = 0;
let selectedPoint = null;
let candidatePoint = null;
let isMousePressed = false;
let scale = 1.0;
if (window.devicePixelRatio > 1) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    scale = window.devicePixelRatio;
}
async function run() {
    await init();
    onGeometryThemeChange(() => requestAnimationFrame(draw));
    testTitle.textContent = formatTestTitle(testIndex, data.tests.length, data.tests[testIndex].name);
    requestAnimationFrame(draw);
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
meshSizeSlider.addEventListener('change', updateFrame);
meshSizeSlider.addEventListener('input', updateFrame);
subdivisionSelect.addEventListener('change', () => {
    updateMeshSizeControl();
    updateFrame();
});
modeSelect.addEventListener('change', updateFrame);
relaxationCheckbox.addEventListener('change', updateFrame);
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
canvas.addEventListener('mouseup', function () {
    selectedPoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});
canvas.addEventListener('mouseout', function () {
    selectedPoint = null;
    candidatePoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});
function pressDown(eX, eY) {
    const [x, y] = clientToCanvasPoint(canvas, eX, eY, scale);
    const test = data.tests[testIndex];
    isMousePressed = true;
    for (let i = 0; i < test.shapes.length; i++) {
        const shape = test.shapes[i];
        selectedPoint = findPointInShape(shape, x, y);
        if (selectedPoint !== null) {
            candidatePoint = null;
            return;
        }
    }
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
        for (let i = 0; i < test.shapes.length; i++) {
            const shape = test.shapes[i];
            candidatePoint = findPointInShape(shape, x, y);
            if (candidatePoint !== null) {
                requestAnimationFrame(draw);
                return;
            }
        }
        if (wasCandidate) {
            requestAnimationFrame(draw);
            candidatePoint = null;
        }
    }
}
function findPointInShape(shape, x, y) {
    for (const path of shape) {
        for (const point of path) {
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
    const triangulator = new Triangulator();
    const size = Number(meshSizeSlider.value);
    const maxArea = size * size;
    const uniform = subdivisionSelect.value === 'Uniform';
    clearGeometryCanvas(ctx, canvas.width / scale, canvas.height / scale);
    drawWorkingArea(ctx);
    const delaunay = (() => {
        try {
            return uniform
                ? triangulator.uniform_triangulate(test.shapes, size)
                : triangulator.triangulate(test.shapes).into_delaunay();
        }
        finally {
            triangulator.free();
        }
    })();
    try {
        if (!uniform) {
            delaunay.refine_with_circumcenters(maxArea);
        }
        if (relaxationCheckbox.checked) {
            delaunay.relax_mut({ maxIterations: 24 });
        }
        switch (modeSelect.value) {
            case 'Triangles':
                drawTriangulation(ctx, delaunay.to_triangulation(), withOpacity(geometryPalette.result, 0.12), geometryPalette.result, geometryStrokeWidth);
                break;
            case 'Centroids':
                // This argument filters out small cells; show the complete net.
                const centroids = delaunay.to_centroid_net(0);
                centroids.forEach((polygon) => {
                    drawConvex(ctx, polygon, withOpacity(geometryPalette.result, 0.12), geometryPalette.result, geometryStrokeWidth);
                });
                break;
            case 'Convex':
                const polygons = delaunay.to_convex_polygons();
                polygons.forEach((polygon) => {
                    drawConvex(ctx, polygon, withOpacity(geometryPalette.result, 0.12), geometryPalette.result, geometryStrokeWidth);
                });
                break;
        }
    }
    finally {
        delaunay.free();
    }
    test.shapes.forEach((shape) => {
        drawGroupOfPoints(ctx, shape, geometryPalette.subject);
    });
    if (selectedPoint !== null) {
        drawGeometryPoint(ctx, selectedPoint, geometryPalette.subject, "active");
    }
    if (candidatePoint !== null) {
        drawGeometryPoint(ctx, candidatePoint, geometryPalette.subject, "hover");
    }
}
function drawWorkingArea(context) {
    const rect = workingArea();
    context.setLineDash([4, 10]);
    context.lineWidth = 1;
    context.strokeStyle = geometryPalette.border;
    context.beginPath();
    context.moveTo(rect.minX, rect.minY);
    context.lineTo(rect.minX, rect.maxY);
    context.lineTo(rect.maxX, rect.maxY);
    context.lineTo(rect.maxX, rect.minY);
    context.closePath();
    context.stroke();
    context.setLineDash([]);
}
function drawTriangulation(context, triangulation, fillColor, strokeColor, lineWidth) {
    const { points, indices } = triangulation;
    if (!points || !indices)
        return;
    let region = new Path2D();
    for (let i = 0; i < indices.length; i += 3) {
        const ia = indices[i];
        const ib = indices[i + 1];
        const ic = indices[i + 2];
        const a = points[ia];
        const b = points[ib];
        const c = points[ic];
        region.moveTo(a[0], a[1]);
        region.lineTo(b[0], b[1]);
        region.lineTo(c[0], c[1]);
        region.closePath();
    }
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = lineWidth;
    context.strokeStyle = strokeColor;
    context.fillStyle = fillColor;
    context.stroke(region);
    context.fill(region, 'nonzero');
}
function drawConvex(context, points, fillColor, strokeColor, lineWidth) {
    context.lineCap = 'round';
    context.lineJoin = 'round';
    let region = new Path2D();
    const [x0, y0] = points[0];
    region.moveTo(x0, y0);
    for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i];
        region.lineTo(x, y);
    }
    region.closePath();
    context.fillStyle = fillColor;
    context.fill(region, 'nonzero');
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    context.stroke(region);
}
function drawGroupOfPoints(context, group, color) {
    group.forEach((points) => {
        drawPoints(context, points, color);
    });
}
function drawPoints(context, points, color) {
    context.fillStyle = color;
    for (let i = 0; i < points.length; i++) {
        drawGeometryPoint(context, points[i], color);
    }
}
function workingArea() {
    const minX = 50;
    const maxX = canvas.width / scale - 50;
    const maxY = canvas.height / scale - 50;
    const minY = 50;
    return { minX, minY, maxX, maxY };
}
//# sourceMappingURL=tessellation.js.map