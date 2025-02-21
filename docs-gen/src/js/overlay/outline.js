import init, {LineCap, LineJoin, OutlineStyle, OutlineBuilder} from '../i_shape/ishape_wasm.js';
import * as data from './outline_data.js';

const outerOffsetSlider = document.getElementById('outerOffset');
const innerOffsetSlider = document.getElementById('innerOffset');
const roundAngleSlider = document.getElementById('roundAngle');
const miterLimitSlider = document.getElementById('miterLimit');

const lineJoinSelect = document.getElementById('lineJoin');

const prevButton = document.getElementById('test-prev');
const nextButton = document.getElementById('test-next');
const testTitle = document.getElementById('test-name');
const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');

const twoPI = 2 * Math.PI;

const subjStroke = "#ff0000";
const pathStroke = "#d0d0d0";
const pathFill = "#e8e8e8";

const resultStroke = "rgba(39,182,0,0.5)";
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

lineJoinSelect.addEventListener('change', updateFrame);
outerOffsetSlider.addEventListener('change', updateFrame);
outerOffsetSlider.addEventListener('input', updateFrame);
innerOffsetSlider.addEventListener('change', updateFrame);
innerOffsetSlider.addEventListener('input', updateFrame);
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
        selectedPoint = findPoint(shape, x, y);
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

        test.shapes.forEach((shape) => {
            
        });

        for (let i = 0; i < test.shapes.length; i++) {
            const shape = test.shapes[i];
            candidatePoint = findPoint(shape, x, y);
            
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

    const outerOffset = parseInt(outerOffsetSlider.value, 10);
    const innerOffset = parseInt(innerOffsetSlider.value, 10);
    const roundAngle = 0.01 * parseInt(roundAngleSlider.value, 10);
    const miterLimit = 0.01 * parseInt(miterLimitSlider.value, 10);
    const lineJoin = toLineJoin(lineJoinSelect.value);

    const style = new OutlineStyle();
    style.outer_offset = outerOffset;
    style.inner_offset = innerOffset;
    style.round_angle = roundAngle;
    style.miter_limit = miterLimit;
    style.join = lineJoin;

    const builder = OutlineBuilder.with_style(style);
    const result = builder.build(test.shapes);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FAFAFAF8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWorkingArea(ctx);

    test.shapes.forEach((shape) => {
        drawShape(ctx, shape, pathFill, pathStroke, 4.0);
    });

    result.forEach((shape) => {
        const stroke = resultStroke;
        const fill = resultFill;

        drawShape(ctx, shape, fill, stroke, 4.0);
    });

    test.shapes.forEach((shape) => {
        drawPoints(ctx, shape, subjStroke);
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

function drawShape(ctx, paths, fillColor, strokeColor, lineWidth) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let region = new Path2D();

    paths.forEach((points) => {
        const [x0, y0] = points[0];
        region.moveTo(x0, y0);

        for (let i = 1; i < points.length; i++) {
            const [x, y] = points[i];
            region.lineTo(x, y);
        }

        region.closePath();
    });

    ctx.fillStyle = fillColor;
    ctx.fill(region, 'nonzero');

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