import init, { Overlay, OverlayGraph, ShapeType, FillRule, OverlayRule} from '../i_shape/ishape_wasm.js';
import { Segment } from './segment.js';
import * as data from './editor_data.js';

const operationTypeSelect = document.getElementById('operationType');
const snapTextField = document.getElementById('snap');
const fillTextField = document.getElementById('fill');
const prevButton = document.getElementById('test-prev');
const nextButton = document.getElementById('test-next');
const testTitle = document.getElementById('test-name');
const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');

const twoPI = 2 * Math.PI;

const subjStroke = "#ff0000";
const subjFill = "#FF3B3020";

const clipStroke = "#0066ff";
const clipFill = "#007AFF20";

const comnStroke = "#10a500";

const resultStroke = "#FF9500";
const resultFill = "#FF950010";

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

async function run() {
  await init();
  requestAnimationFrame(draw);
  testTitle.textContent = data.tests[testIndex].name;
}

run();

prevButton.addEventListener('click', function() {
    const n = data.tests.length;
    testIndex = (testIndex - 1 + n) % n;
    requestAnimationFrame(draw);
    testTitle.textContent = data.tests[testIndex].name;
});

nextButton.addEventListener('click', function() {
    const n = data.tests.length;
    testIndex = (testIndex + 1) % n;
    requestAnimationFrame(draw);
    testTitle.textContent = data.tests[testIndex].name;
});

operationTypeSelect.addEventListener('change', function(event) {
   requestAnimationFrame(draw); 
});

fillTextField.addEventListener('change', function(event) {
   requestAnimationFrame(draw); 
});

canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();
    const touch = event.touches[0];
    pressDown(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
    const touch = event.touches[0];
    move(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchend', function(event) {
    event.preventDefault(); // Prevent click emulation and scrolling
    selectedPoint = null;
    isMousePressed = false;
});

canvas.addEventListener('mousedown', function(event) {
    pressDown(event.clientX, event.clientY);
});

canvas.addEventListener('mousemove', function(event) {
    move(event.clientX, event.clientY);
});

canvas.addEventListener('mouseup', function(event) {
    selectedPoint = null;
    isMousePressed = false;
});

canvas.addEventListener('mouseout', function(event) {
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

    for(let i = 0; i < test.subjs.length; i++) {
        const shape = test.subjs[i];
        selectedPoint = findPoint(shape, x, y);
        if (selectedPoint !== null) {
            isSubjSelected = true;
            candidatePoint = null;
            isSubjCandidate = false;
            return;
        }
    }

    for(let i = 0; i < test.clips.length; i++) {
        const shape = test.clips[i];
        selectedPoint = findPoint(shape, x, y);
        if (selectedPoint !== null) {
            isSubjSelected = false;
            candidatePoint = null;
            isSubjCandidate = false;
            return;
        }
    }
}

function move(eX, eY) {
    let x = eX - canvas.getBoundingClientRect().left;
    let y = eY - canvas.getBoundingClientRect().top;

    if (isMousePressed) {
        // Left mouse button was pressed
        if (selectedPoint !== null) {
            const isSnap = snapTextField.checked;

            if (isSnap) {
                x = Math.round(x * 0.1) * 10;
                y = Math.round(y * 0.1) * 10;
            }

            const rect = workingArea();

            selectedPoint[0] = Math.max(Math.min(x, rect.maxX), rect.minX);
            selectedPoint[1] = Math.max(Math.min(y, rect.maxY), rect.minY);
            
            requestAnimationFrame(draw);
        }
    } else {
        const wasCandidate = candidatePoint !== null;
        const test = data.tests[testIndex];

        for(let i = 0; i < test.subjs.length; i++) {
            const shape = test.subjs[i];
            candidatePoint = findPoint(shape, x, y);
            if (candidatePoint !== null) {
                isSubjCandidate = true;
                requestAnimationFrame(draw);
                return;
            }
        }

        for(let i = 0; i < test.clips.length; i++) {
            const shape = test.clips[i];
            candidatePoint = findPoint(shape, x, y);
            if (candidatePoint !== null) {
                isSubjCandidate = false;
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
    const overlay = new Overlay();

    test.subjs.forEach((subj) => {
        overlay.add_paths(subj, ShapeType.Subject);
    });

    test.clips.forEach((clip) => {
        overlay.add_paths(clip, ShapeType.Clip);
    });

    const graph = overlay.build_graph(FillRule.EvenOdd);
    const result = graph.extract_shapes(fillRule());

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FAFAFAF8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWorkingAreaSplitLine(ctx);

    test.subjs.forEach((shape) => {
      drawShape(ctx, shape, subjFill, null, 0.0, 0.0);
    });

    test.clips.forEach((shape) => {
      drawShape(ctx, shape, clipFill, null, 0.0, 0.0);
    });

    const isFill = fillTextField.checked;
    if (isFill) {
        const links = graph.links();
        drawFill(ctx, links);
    }

    drawPoints(ctx, test.subjs, subjStroke);
    drawPoints(ctx, test.clips, clipStroke);

    if (selectedPoint !== null) {
        const color = isSubjSelected ? subjStroke : clipStroke;
        drawPoint(ctx, selectedPoint, color);
    }

    if (candidatePoint !== null) {
        const color = isSubjCandidate ? subjStroke : clipStroke;
        drawPoint(ctx, candidatePoint, color);
    }

    const maxY = 0.5 * canvas.height;

    result.forEach((shape) => {
      const stroke = resultStroke;
      const fill = resultFill;

      drawShape(ctx, shape, fill, stroke, 2.5, maxY);
    });

}

function drawWorkingAreaSplitLine(ctx) {
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

function drawFill(ctx, data) {
    data.links.forEach((link) => {
        const fill = link.fill;
        const seg = new Segment(link);

        const isFillSubjTop = (fill & SegmentFill.subjTop) == SegmentFill.subjTop;
        const isFillClipTop = (fill & SegmentFill.clipTop) == SegmentFill.clipTop;

        const isFillSubjBottom = (fill & SegmentFill.subjBottom) == SegmentFill.subjBottom;
        const isFillClipBottom = (fill & SegmentFill.clipBottom) == SegmentFill.clipBottom;

        const isSubj = isFillSubjTop || isFillSubjBottom;
        const isClip = isFillClipTop || isFillClipBottom;

        drawEdge(ctx, seg.start, seg.end, isSubj, isClip);

        drawCircle(ctx, seg.subjTopPos, isFillSubjTop, subjStroke);
        drawCircle(ctx, seg.clipTopPos, isFillClipTop, clipStroke);
        drawCircle(ctx, seg.subjBottomPos, isFillSubjBottom, subjStroke);
        drawCircle(ctx, seg.clipBottomPos, isFillClipBottom, clipStroke);

    });
}

function drawCircle(ctx, p, isFill, color) {
    ctx.beginPath();

    if (isFill) {
        ctx.arc(p.x, p.y, 3, 0, twoPI);
        ctx.fillStyle = color;
        ctx.fill();
    } else {
        ctx.arc(p.x, p.y, 2.6, 0, twoPI);
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    ctx.closePath();
}

function drawEdge(ctx, a, b, isFillSubj, isFillClip) {
    ctx.lineWidth = 2;

    if (isFillSubj && isFillClip) {
        ctx.strokeStyle = comnStroke;
    } else if (isFillSubj) {
        ctx.strokeStyle = subjStroke;
    } else if (isFillClip) {
        ctx.strokeStyle = clipStroke;
    } else {
        ctx.strokeStyle = 'gray';
    }

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();

    ctx.closePath();
}

function drawPoint(ctx, point, color) {
    ctx.fillStyle = color;
    ctx.lineWidth = null;
    ctx.beginPath();
    ctx.arc(point[0], point[1], 6, 0, twoPI);
    ctx.fill();
}

function drawShape(ctx, shape, fillColor, strokeColor, lineWidth, dy) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let region = new Path2D();

    shape.forEach((points) => {
        const [x0, y0] = points[0];
        region.moveTo(x0, y0 + dy);

        for (let i = 1; i < points.length; i++) {
          const [x, y] = points[i];
          region.lineTo(x, y + dy);
        }

        region.closePath();
    });

    ctx.fillStyle = fillColor;

    if (lineWidth > 0 && strokeColor !== null) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke(region);
    }

    ctx.fill(region, 'evenodd');
}

function drawPoints(ctx, shapes, color) {
    ctx.fillStyle = color;
    ctx.lineWidth = null;

    shapes.forEach((shape) => {
        shape.forEach((points) => {
            for (let i = 0; i < points.length; i++) {
                const [x, y] = points[i];
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, twoPI);
                ctx.fill();
            }
        });
    });
}

function fillRule() {
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
    }
}

function workingArea() {
    const minX = 50;
    const maxX = canvas.width - 50;
    const maxY = 0.5 * canvas.height;
    const minY = 50;
    return { minX, minY, maxX, maxY };
}