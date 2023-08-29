import init, { JsOverlay, JsOverlayGraph, JsShapeType, JsFillRule} from '../i_shape/i_shape_js.js';

const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
let testIndex = 0; // will be controlled
const twoPI = 2 * Math.PI;
let selectedPoint = null;
let candidatePoint = null;
let isSubjSelected = false;
let isSubjCandidate = false;
let isMousePressed = false;

const subjStroke = "#ff0000ff";
const subjFill = "#FF3B3008";
const clipStroke = "#0066ffff";
const clipFill = "#007AFF08";

const operationTypeSelect = document.getElementById('operationType');
const snapTextField = document.getElementById('snap');
const fillTextField = document.getElementById('fill');
const prevButton = document.getElementById('test-prev');
const nextButton = document.getElementById('test-next');
const testTitle = document.getElementById('test-name');

const SegmentFill = {
  subjTop: 0b0001,
  subjBottom: 0b0010,
  clipTop: 0b0100,
  clipBottom: 0b1000
};

prevButton.addEventListener('click', function() {
    const n = testData.length;
    testIndex = (testIndex - 1 + n) % n;
    requestAnimationFrame(draw);
    testTitle.textContent = testData[testIndex].name;
});

nextButton.addEventListener('click', function() {
    const n = testData.length;
    testIndex = (testIndex + 1) % n;
    requestAnimationFrame(draw);
    testTitle.textContent = testData[testIndex].name;
});

operationTypeSelect.addEventListener('change', function(event) {
   requestAnimationFrame(draw); 
});

fillTextField.addEventListener('change', function(event) {
   requestAnimationFrame(draw); 
});

async function run() {
  await init(); // Initialize the wasm module
  requestAnimationFrame(draw);
  testTitle.textContent = testData[testIndex].name;
}

run();

canvas.addEventListener('mousedown', function(event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;
  
    const test = testData[testIndex];
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
});

canvas.addEventListener('mousemove', function(event) {
    if (isMousePressed) {
        // Left mouse button was pressed
        if (selectedPoint !== null) {
            const isSnap = snapTextField.checked;

            let x = event.clientX - canvas.getBoundingClientRect().left;
            let y = event.clientY - canvas.getBoundingClientRect().top;

            if (isSnap) {
                x = Math.round(x * 0.1) * 10;
                y = Math.round(y * 0.1) * 10;
            }

            const minX = 50;
            const maxX = canvas.width - 50;
            const maxY = 0.5 * canvas.height;
            const minY = 50;

            selectedPoint[0] = Math.max(Math.min(x, maxX), minX);
            selectedPoint[1] = Math.max(Math.min(y, maxY), minY);
            
            requestAnimationFrame(draw);
        }
    } else {
        const wasCandidate = candidatePoint !== null;
        const x = event.clientX - canvas.getBoundingClientRect().left;
        const y = event.clientY - canvas.getBoundingClientRect().top;
      
        let test = testData[testIndex];

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

function findPoint(shape, x, y) {
    for (let path of shape.paths) {
        for (let point of path.points) {
            const [px, py] = point;
            if (Math.abs(px - x) < 10 && Math.abs(py - y) < 10) {
                return point;
            }
        }
    }
    return null;
}

function draw() {
    let fillRule;
    switch (operationTypeSelect.value) {
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
    }

    const test = testData[testIndex];

    const overlay = new JsOverlay();

    test.subjs.forEach((subj) => {
        overlay.add_shape(subj, JsShapeType.Subject);
    });

    test.clips.forEach((clip) => {
        overlay.add_shape(clip, JsShapeType.Clip);
    });

    const graph = overlay.build_graph();
    const result = graph.extract_shapes(fillRule);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FAFAFAF8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawWorkingAreaSplitLine(ctx);

    test.subjs.forEach((shape) => {
      drawShape(ctx, shape, subjFill, subjStroke, 1.6, 0.0);
    });

    drawPoints(ctx, test.subjs, subjStroke);

    test.clips.forEach((shape) => {
      const stroke = clipStroke;
      const fill = clipFill;

      drawShape(ctx, shape, fill, stroke, 1.6, 0.0);
    });

    drawPoints(ctx, test.clips, clipStroke);

    if (selectedPoint !== null) {
        const color = isSubjSelected ? subjStroke : clipStroke
        drawPoint(ctx, selectedPoint, color)
    }
    if (candidatePoint !== null) {
        const color = isSubjCandidate ? subjStroke : clipStroke;
        drawPoint(ctx, candidatePoint, color)
    }

    const maxY = 0.5 * canvas.height;

    result.shapes.forEach((shape) => {
      const stroke = "#FF9500";
      const fill = "#FF950010";

      drawShape(ctx, shape, fill, stroke, 1.6, maxY);
    });


    const isFill = fillTextField.checked;
    if (isFill) {
        const links = graph.links();
        drawFill(ctx, links);
    }

}

function drawWorkingAreaSplitLine(ctx) {
    const minX = 50;
    const maxX = canvas.width - 50;
    const maxY = 0.5 * canvas.height;
    const minY = 50;

    ctx.setLineDash([4, 10]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'gray';
    
    ctx.beginPath();
    ctx.moveTo(minX, minY);
    ctx.lineTo(minX, maxY);
    ctx.lineTo(maxX, maxY);
    ctx.lineTo(maxX, minY);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawFill(ctx, data) {
    data.links.forEach((link) => {
        const fill = link.fill;
        const seg = new Segment(link);

        const isFillSubjTop = fill & SegmentFill.subjTop == SegmentFill.subjTop;
        const isFillClipTop = fill & SegmentFill.clipTop == SegmentFill.clipTop;

        const isFillClipBottom = fill & SegmentFill.clipBottom == SegmentFill.clipBottom;
        const isFillSubjBottom = fill & SegmentFill.subjBottom == SegmentFill.subjBottom;


        drawCircle(ctx, seg.subjTopPos, isFillSubjTop, subjStroke)
        drawCircle(ctx, seg.clipTopPos, isFillClipTop, clipStroke)
        drawCircle(ctx, seg.subjBottomPos, isFillSubjBottom, subjStroke)
        drawCircle(ctx, seg.clipBottomPos, isFillClipBottom, clipStroke)
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

    shape.paths.forEach((path) => {
        const points = path.points;
        const [x0, y0] = points[0];
        region.moveTo(x0, y0 + dy);

        for (let i = 1; i < points.length; i++) {
          const [x, y] = points[i];
          region.lineTo(x, y + dy);
        }

        region.closePath();
    });

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;

    ctx.stroke(region);
    ctx.fill(region, 'evenodd');
}

function drawPoints(ctx, shapes, color) {
    ctx.fillStyle = color;
    ctx.lineWidth = null;

    shapes.forEach((shape) => {
        shape.paths.forEach((path) => {
            const points = path.points;
            for (let i = 0; i < points.length; i++) {
                const [x, y] = points[i];
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, twoPI);
                ctx.fill();
            }
        });
    });
}

const testData = [
{
    name: "Simple",
    subjs: [
        {
            paths: [
            {
                points: [[200, 300], [200, 100], [400, 100], [400, 300]]
            }
            ]
        }
    ],
    clips: [
        {
            paths: [
            {
                points: [[300, 400], [300, 200], [500, 200], [500, 400]]
            }
            ]
        }
    ]
},
{
    name: "Overlap",
    subjs: [
        {
            paths: [
            {
                points: [[200, 350], [200, 150], [400, 150], [400, 350]]
            }
            ]
        }
    ],
    clips: [
        {
            paths: [
            {
                points: [[300, 350], [300, 150], [500, 150], [500, 350]]
            }
            ]
        }
    ]
},
{
    name: "Hole",
    subjs: [
        {
            paths: [
            {
                points: [[300, 150], [300, 350], [500, 350], [500, 150]]
            }
            ]
        }
    ],
    clips: [
        {
            paths: [
            {
                points: [[350, 200], [350, 300], [450, 300], [450, 200]]
            }
            ]
        }
    ]
},
{
    name: "Separate",
    subjs: [
        {
            paths: [
            {
                points: [[100, 150], [100, 350], [300, 350], [300, 150]]
            }
            ]
        }
    ],
    clips: [
        {
            paths: [
            {
                points: [[450, 150], [450, 350], [650, 350], [650, 150]]
            }
            ]
        }
    ]
}
]

function normalize(vector) {
    const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    return { x: vector.x / magnitude, y: vector.y / magnitude };
}

function subtractVectors(vectorA, vectorB) {
    return { x: vectorA.x - vectorB.x, y: vectorA.y - vectorB.y };
}

function addVectors(vectorA, vectorB) {
    return { x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y };
}

function multiplyVectorByScalar(vector, scalar) {
    return { x: vector.x * scalar, y: vector.y * scalar };
}

class Segment {
  constructor(link) {
    this.start = { x: link.ax, y: link.ay };
    this.end = { x: link.bx, y: link.by };
  }

  get subjTopPos() {
    const n = normalize(subtractVectors(this.start, this.end));
    const o = { x: -n.y, y: n.x };
    return addVectors(
      multiplyVectorByScalar(addVectors(this.start, this.end), 0.5),
      addVectors(multiplyVectorByScalar(o, 6), multiplyVectorByScalar(n, 4))
    );
  }

  get subjBottomPos() {
    const n = normalize(subtractVectors(this.start, this.end));
    const o = { x: n.y, y: -n.x };
    return addVectors(
      multiplyVectorByScalar(addVectors(this.start, this.end), 0.5),
      addVectors(multiplyVectorByScalar(o, 6), multiplyVectorByScalar(n, 4))
    );
  }

  get clipTopPos() {
    const n = normalize(subtractVectors(this.start, this.end));
    const o = { x: -n.y, y: n.x };
    return addVectors(
      multiplyVectorByScalar(addVectors(this.start, this.end), 0.5),
      addVectors(multiplyVectorByScalar(o, 6), multiplyVectorByScalar(n, -4))
    );
  }

  get clipBottomPos() {
    const n = normalize(subtractVectors(this.start, this.end));
    const o = { x: n.y, y: -n.x };
    return addVectors(
      multiplyVectorByScalar(addVectors(this.start, this.end), 0.5),
      addVectors(multiplyVectorByScalar(o, 6), multiplyVectorByScalar(n, -4))
    );
  }
}


