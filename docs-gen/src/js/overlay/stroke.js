import init, {LineCap, LineJoin, StrokeStyle, StrokeBuilder} from '../i_shape/ishape_wasm.js';
import {Segment} from './segment.js';
import * as data from './stroke_data.js';

const strokeWidthSlider = document.getElementById('strokeWidth');
const roundAngleSlider = document.getElementById('roundAngle');
const miterLimitSlider = document.getElementById('miterLimit');

const startCapSelect = document.getElementById('startCap');
const endCapSelect = document.getElementById('endCap');
const lineJoinSelect = document.getElementById('lineJoin');

const closePathTextField = document.getElementById('closePath');

const prevButton = document.getElementById('test-prev');
const nextButton = document.getElementById('test-next');
const testTitle = document.getElementById('test-name');
const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');

const twoPI = 2 * Math.PI;

const subjStroke = "#ff0000";

const pathStroke = "#d0d0d0";

const resultStroke = "rgba(39,182,0,0.5)";
const resultFill = "rgba(45,214,0,0.13)";

const SegmentFill = {
    subjTop: 0b0001,
    subjBottom: 0b0010,
    clipTop: 0b0100,
    clipBottom: 0b1000
};

let testIndex = 0;
let selectedPoint = null;
let candidatePoint = null;
let isSubjSelected = false;
let isSubjCandidate = false;
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
    requestAnimationFrame(draw);
    testTitle.textContent = data.tests[testIndex].name;
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
}, { passive: false });

canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    move(touch.clientX, touch.clientY);
}, { passive: false });

canvas.addEventListener('touchend', function (event) {
    event.preventDefault(); // Prevent click emulation and scrolling
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

    
    const paths = test.paths;
    selectedPoint = findPoint(paths, x, y);
    if (selectedPoint !== null) {
        isSubjSelected = true;
        candidatePoint = null;
        isSubjCandidate = false;
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
            
        candidatePoint = findPoint(test.paths, x, y);
        if (candidatePoint !== null) {
            isSubjCandidate = true;
            requestAnimationFrame(draw);
            return;
        }

        if (wasCandidate) {
            requestAnimationFrame(draw);
            candidatePoint = null;
        }
    }
}

function findPoint(shape, x, y) {
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

function draw() {

    const test = data.tests[testIndex];

    const strokeWidth = parseInt(strokeWidthSlider.value, 10);
    const roundAngle = 0.01 * parseInt(roundAngleSlider.value, 10);
    const miterLimit = 0.01 * parseInt(miterLimitSlider.value, 10);

    const startCap = toLineCap(startCapSelect.value);
    const endCap = toLineCap(endCapSelect.value);
    const lineJoin = toLineJoin(lineJoinSelect.value);

    console.log(roundAngle);

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FAFAFAF8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWorkingArea(ctx);

    drawPaths(ctx, test.paths, pathStroke, 4.0, isClosedPath);

    result.forEach((shape) => {
        const stroke = resultStroke;
        const fill = resultFill;

        drawShape(ctx, shape, fill, stroke, 4.0);
    });

    drawPoints(ctx, test.paths, subjStroke);

    if (selectedPoint !== null) {
        const color = isSubjSelected ? subjStroke : clipStroke;
        drawPoint(ctx, selectedPoint, color);
    }

    if (candidatePoint !== null) {
        const color = isSubjCandidate ? subjStroke : clipStroke;
        drawPoint(ctx, candidatePoint, color);
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

function drawShape(ctx, shape, fillColor, strokeColor, lineWidth) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let region = new Path2D();
    let arrows = new Path2D();

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

    if (lineWidth > 0 && strokeColor !== null) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke(region);
    }
}

function drawPaths(ctx, paths, strokeColor, lineWidth, isClose) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let region = new Path2D();
    let arrows = new Path2D();

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
    ctx.lineWidth = null;

    paths.forEach((points) => {
        for (let i = 0; i < points.length; i++) {
            const [x, y] = points[i];
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, twoPI);
            ctx.fill();
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
    }
}

function workingArea() {
    const minX = 50;
    const maxX = canvas.width / scale - 50;
    const maxY = canvas.height / scale - 50;
    const minY = 50;
    return {minX, minY, maxX, maxY};
}