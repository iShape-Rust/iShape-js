import init, { Triangulator, type TriangulationData } from "../i_shape/ishape_wasm.js";
import * as data from './triangulation_data.js';
import { clientToCanvasPoint, requireCanvas2D, requireElement } from "../common/dom.js";
import { formatTestTitle } from "../common/demo.js";
import type { Contour, Shape, WorkingArea } from "../geometry/path.js";
import type { Point } from "../geometry/vector.js";

const modeSelect = requireElement("mode", HTMLSelectElement);

const prevButton = requireElement("test-prev", HTMLButtonElement);
const nextButton = requireElement("test-next", HTMLButtonElement);
const testTitle = requireElement("test-name", HTMLElement);
const { canvas, context: ctx } = requireCanvas2D("editorCanvas");

const pointsTextField = requireElement("points", HTMLInputElement);

const twoPI = 2 * Math.PI;

const subjStroke = "#ff0000";
const pathStroke = "#d0d0d0";
const pathFill = "#e8e8e8";

const resultStroke = "rgba(39,182,0,1.0)";
const resultFill = "rgba(45,214,0,0.13)";

let testIndex = 0;
let selectedPoint: Point | null = null;
let candidatePoint: Point | null = null;
let isMousePressed = false;

let scale = 1.0;

if (window.devicePixelRatio > 1) {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    scale = window.devicePixelRatio;
}

async function run(): Promise<void> {
    await init();
    testTitle.textContent = formatTestTitle(testIndex, data.tests.length, data.tests[testIndex].name);
    requestAnimationFrame(draw);
}

void run();

function updateFrame(): void {
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

pointsTextField.addEventListener('change', updateFrame);
modeSelect.addEventListener('change', updateFrame);

canvas.addEventListener('touchstart', function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    pressDown(touch.clientX, touch.clientY);
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
});

canvas.addEventListener('mousedown', function (event) {
    pressDown(event.clientX, event.clientY);
});

canvas.addEventListener('mousemove', function (event) {
    move(event.clientX, event.clientY);
});

canvas.addEventListener('mouseup', function () {
    selectedPoint = null;
    isMousePressed = false;
});

canvas.addEventListener('mouseout', function () {
    selectedPoint = null;
    candidatePoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});

function pressDown(eX: number, eY: number): void {
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

    const isSteinerPoints = pointsTextField.checked;
    if (isSteinerPoints) {
        selectedPoint = findPoint(test.points, x, y);
        
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

function move(eX: number, eY: number): void {
    const [x, y] = clientToCanvasPoint(canvas, eX, eY, scale);

    if (isMousePressed) {
        // Left mouse button was pressed
        if (selectedPoint !== null) {

            const rect = workingArea();

            selectedPoint[0] = Math.max(Math.min(x, rect.maxX), rect.minX);
            selectedPoint[1] = Math.max(Math.min(y, rect.maxY), rect.minY);

            requestAnimationFrame(draw);
        }
    } else {
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

        const isSteinerPoints = pointsTextField.checked;
        if (isSteinerPoints) {
            candidatePoint = findPoint(test.points, x, y);
            
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

function findPointInShape(shape: Shape, x: number, y: number): Point | null {
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

function findPoint(points: Contour, x: number, y: number): Point | null {
    for (const point of points) {
        const [px, py] = point;
        if (Math.abs(px - x) < 10 && Math.abs(py - y) < 10) {
            return point;
        }
    }
    
    return null;
}

function draw(): void {

    const test = data.tests[testIndex];
    const triangulator = new Triangulator();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FAFAFAF8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWorkingArea(ctx);

    const isSteinerPoints = pointsTextField.checked;

    const raw = isSteinerPoints
        ? triangulator.triangulate_with_points(test.shapes, test.points)
        : triangulator.triangulate(test.shapes);

    switch (modeSelect.value) {
        case 'Raw':
            const triangulation = raw.to_triangulation();
            drawTriangulation(ctx, triangulation, resultFill, resultStroke, 2.0);
            break;
        case 'Delaunay':
            const delaunay = raw.into_delaunay().to_triangulation();
            drawTriangulation(ctx, delaunay, resultFill, resultStroke, 2.0);
            break;
        case 'Convex':
            const polygons = raw.into_delaunay().to_convex_polygons();
            polygons.forEach((polygon) => {
                drawConvex(ctx, polygon, resultFill, resultStroke, 2.0);
            });
            break;
    }

    test.shapes.forEach((shape) => {
        drawGroupOfPoints(ctx, shape, subjStroke);
    });

    if (isSteinerPoints) {
        drawPoints(ctx, test.points, subjStroke);
    }

    if (selectedPoint !== null) {
        drawPoint(ctx, selectedPoint, subjStroke);
    }

    if (candidatePoint !== null) {
        drawPoint(ctx, candidatePoint, subjStroke);
    }
}

function drawWorkingArea(context: CanvasRenderingContext2D): void {
    const rect = workingArea();

    context.setLineDash([4, 10]);
    context.lineWidth = 1;
    context.strokeStyle = 'gray';

    context.beginPath();
    context.moveTo(rect.minX, rect.minY);
    context.lineTo(rect.minX, rect.maxY);
    context.lineTo(rect.maxX, rect.maxY);
    context.lineTo(rect.maxX, rect.minY);
    context.closePath();
    context.stroke();
    context.setLineDash([]);
}

function drawPoint(context: CanvasRenderingContext2D, point: Point, color: string): void {
    context.fillStyle = color;
    context.beginPath();
    context.arc(point[0], point[1], 6, 0, twoPI);
    context.fill();
}

function drawTriangulation(
    context: CanvasRenderingContext2D,
    triangulation: TriangulationData,
    fillColor: string,
    strokeColor: string,
    lineWidth: number,
): void {
    const { points, indices } = triangulation;

    if (!points || !indices) return;

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

function drawConvex(
    context: CanvasRenderingContext2D,
    points: Contour,
    fillColor: string,
    strokeColor: string,
    lineWidth: number,
): void {
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

function drawGroupOfPoints(context: CanvasRenderingContext2D, group: Shape, color: string): void {
    group.forEach((points) => {
        drawPoints(context, points, color);
    });
}

function drawPoints(context: CanvasRenderingContext2D, points: Contour, color: string): void {
    context.fillStyle = color;

    for (let i = 0; i < points.length; i++) {
        const [x, y] = points[i];
        context.beginPath();
        context.arc(x, y, 3, 0, twoPI);
        context.fill();
    }
}


function workingArea(): WorkingArea {
    const minX = 50;
    const maxX = canvas.width / scale - 50;
    const maxY = canvas.height / scale - 50;
    const minY = 50;
    return {minX, minY, maxX, maxY};
}
