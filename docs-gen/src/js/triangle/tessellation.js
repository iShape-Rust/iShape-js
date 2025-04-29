import init, {RawTriangulation, Triangulator, Delaunay} from '../i_shape/ishape_wasm.js';
import * as data from './triangulation_data.js';

const modeSelect = document.getElementById('mode');

const prevButton = document.getElementById('test-prev');
const nextButton = document.getElementById('test-next');
const testTitle = document.getElementById('test-name');
const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');

const maxAreaSlider = document.getElementById('maxArea');

const twoPI = 2 * Math.PI;

const subjStroke = "#ff0000";
const pathStroke = "#d0d0d0";
const pathFill = "#e8e8e8";

const resultStroke = "rgba(39,182,0,1.0)";
const resultFill = "rgba(45,214,0,0.13)";

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
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    scale = window.devicePixelRatio;
}

async function run() {
    await init();
    testTitle.textContent = data.tests[testIndex].name;
    requestAnimationFrame(draw);
}

run();

function updateFrame(event) {
    requestAnimationFrame(draw);
}

prevButton.addEventListener('click', function () {
    const n = data.tests.length;
    testIndex = (testIndex - 1 + n) % n;
    requestAnimationFrame(draw);
    testTitle.textContent = data.tests[testIndex].name;
});

nextButton.addEventListener('click', function () {
    const n = data.tests.length;
    testIndex = (testIndex + 1) % n;
    requestAnimationFrame(draw);
    testTitle.textContent = data.tests[testIndex].name;
});

maxAreaSlider.addEventListener('change', updateFrame);
maxAreaSlider.addEventListener('input', updateFrame);
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

canvas.addEventListener('mouseup', function (event) {
    selectedPoint = null;
    isMousePressed = false;
});

canvas.addEventListener('mouseout', function (event) {
    selectedPoint = null;
    candidatePoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});

function pressDown(eX, eY) {
    const x = eX - canvas.getBoundingClientRect().left;
    const y = eY - canvas.getBoundingClientRect().top;

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
    let x = eX - canvas.getBoundingClientRect().left;
    let y = eY - canvas.getBoundingClientRect().top;

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

        if (wasCandidate) {
            requestAnimationFrame(draw);
            candidatePoint = null;
        }
    }
}

function findPointInShape(shape, x, y) {
    for (let path of shape) {
        for (let point of path) {
            const [px, py] = point;
            if (Math.abs(px - x) < 10 && Math.abs(py - y) < 10) {
                return point;
            }
        }
    }
    return null;
}

function findPoint(points, x, y) {
    for (let point of points) {
        const [px, py] = point;
        if (Math.abs(px - x) < 10 && Math.abs(py - y) < 10) {
            return point;
        }
    }
    
    return null;
}

function draw() {

    const test = data.tests[testIndex];
    const triangulator = new Triangulator();

    const areaValue = parseInt(maxAreaSlider.value, 10);
    const maxArea = areaValue * areaValue;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FAFAFAF8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWorkingArea(ctx);

    const delaunay = triangulator.triangulate(test.shapes).into_delaunay();

    switch (modeSelect.value) {
        case 'Triangles':
            delaunay.refine_with_circumcenters(maxArea);
            drawTriangulation(ctx, delaunay.to_triangulation(), resultFill, resultStroke, 2.0);
            break;
        case 'Centroids':
            delaunay.refine_with_circumcenters(maxArea);

            const centroids = delaunay.to_centroid_net();

            centroids.forEach((polygon) => {
                drawConvex(ctx, polygon, resultFill, resultStroke, 2.0);
            });
            break;
        case 'Convex':
            delaunay.refine_with_circumcenters(maxArea);

            const polygons = delaunay.to_convex_polygons();
            polygons.forEach((polygon) => {
                drawConvex(ctx, polygon, resultFill, resultStroke, 2.0);
            });
            break;
    }

    test.shapes.forEach((shape) => {
        drawGroupOfPoints(ctx, shape, subjStroke);
    });

    if (selectedPoint !== null) {
        drawPoint(ctx, selectedPoint, subjStroke);
    }

    if (candidatePoint !== null) {
        drawPoint(ctx, candidatePoint, subjStroke);
    }
}

function drawWorkingArea(ctx) {
    const rect = workingArea();

    ctx.setLineDash([4, 10]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';

    ctx.beginPath();
    ctx.moveTo(rect.minX, rect.minY);
    ctx.lineTo(rect.minX, rect.maxY);
    ctx.lineTo(rect.maxX, rect.maxY);
    ctx.lineTo(rect.maxX, rect.minY);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawPoint(ctx, point, color) {
    ctx.fillStyle = color;
    ctx.lineWidth = null;
    ctx.beginPath();
    ctx.arc(point[0], point[1], 6, 0, twoPI);
    ctx.fill();
}

function drawTriangulation(ctx, triangulation, fillColor, strokeColor, lineWidth) {
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

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;

    ctx.stroke(region);
    ctx.fill(region, 'nonzero');
}

function drawConvex(ctx, points, fillColor, strokeColor, lineWidth) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let region = new Path2D();

    const [x0, y0] = points[0];
    region.moveTo(x0, y0);

    for (let i = 1; i < points.length; i++) {
        const [x, y] = points[i];
        region.lineTo(x, y);
    }

    region.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill(region, 'nonzero');

    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke(region);
}

function drawGroupOfPoints(ctx, group, color) {
    group.forEach((points) => {
        drawPoints(ctx, points, color);
    });
}

function drawPoints(ctx, points, color) {
    ctx.fillStyle = color;
    ctx.lineWidth = null;

    for (let i = 0; i < points.length; i++) {
        const [x, y] = points[i];
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, twoPI);
        ctx.fill();
    }
}


function workingArea() {
    const minX = 50;
    const maxX = canvas.width / scale - 50;
    const maxY = canvas.height / scale - 50;
    const minY = 50;
    return {minX, minY, maxX, maxY};
}