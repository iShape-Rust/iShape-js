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

const operationTypeSelect = document.getElementById('operationType');
const snapTextField = document.getElementById('snap');
const fillTextField = document.getElementById('fill');
const prevButton = document.getElementById('test-prev');
const nextButton = document.getElementById('test-next');

prevButton.addEventListener('click', function() {
    const n = testData.length;
    testIndex = (testIndex - 1 + n) % n;
    requestAnimationFrame(draw);
});

nextButton.addEventListener('click', function() {
    const n = testData.length;
    testIndex = (testIndex + 1) % n;
    requestAnimationFrame(draw);
});

operationTypeSelect.addEventListener('change', function(event) {
   requestAnimationFrame(draw); 
});


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

async function run() {
  await init(); // Initialize the wasm module
  requestAnimationFrame(draw);
}

run();

canvas.addEventListener('mousedown', function(event) {
    let x = event.clientX - canvas.getBoundingClientRect().left;
    let y = event.clientY - canvas.getBoundingClientRect().top;
  
    let test = testData[testIndex];
    isMousePressed = true;

    for(let i = 0; i < test.subjs.length; i++) {
        let shape = test.subjs[i];
        selectedPoint = findPoint(shape, x, y);
        if (selectedPoint !== null) {
            isSubjSelected = true;
            candidatePoint = null;
            isSubjCandidate = false;
            return;
        }
    }

    for(let i = 0; i < test.clips.length; i++) {
        let shape = test.clips[i];
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
            let isSnap = snapTextField.checked;

            let x = event.clientX - canvas.getBoundingClientRect().left;
            let y = event.clientY - canvas.getBoundingClientRect().top;

            if (isSnap) {
                x = Math.round(x * 0.1) * 10;
                y = Math.round(y * 0.1) * 10;
            }


            let minX = 50;
            let maxX = canvas.width - 50;
            let maxY = 0.5 * canvas.height;
            let minY = 50;

            selectedPoint[0] = Math.max(Math.min(x, maxX), minX);
            selectedPoint[1] = Math.max(Math.min(y, maxY), minY);
            
            requestAnimationFrame(draw);
        }
    } else {
        let wasCandidate = candidatePoint !== null;
        let x = event.clientX - canvas.getBoundingClientRect().left;
        let y = event.clientY - canvas.getBoundingClientRect().top;
      
        let test = testData[testIndex];

        for(let i = 0; i < test.subjs.length; i++) {
            let shape = test.subjs[i];
            candidatePoint = findPoint(shape, x, y);
            if (candidatePoint !== null) {
                isSubjCandidate = true;
                requestAnimationFrame(draw);
                return;
            }
        }

        for(let i = 0; i < test.clips.length; i++) {
            let shape = test.clips[i];
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
    }

    let test = testData[testIndex];

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
      const stroke = "#ff0000ff";
      const fill = "#FF3B3008";

      drawShape(ctx, shape, fill, stroke, 1.6, 0.0);
    });

    drawPoints(ctx, test.subjs, "#ff0000ff");

    test.clips.forEach((shape) => {
      const stroke = "#0066ffff";
      const fill = "#007AFF08";

      drawShape(ctx, shape, fill, stroke, 1.6, 0.0);
    });

    drawPoints(ctx, test.clips, "#0066ffff");

    if (selectedPoint !== null) {
        let color = isSubjSelected ? "#ff0000ff" : "#0066ffff";
        drawPoint(ctx, selectedPoint, color)
    }
    if (candidatePoint !== null) {
        let color = isSubjCandidate ? "#ff0000ff" : "#0066ffff";
        drawPoint(ctx, candidatePoint, color)
    }

    let maxY = 0.5 * canvas.height;

    result.shapes.forEach((shape) => {
      const stroke = "#FF9500";
      const fill = "#FF950008";

      drawShape(ctx, shape, fill, stroke, 1.6, maxY);
    });
}

function drawWorkingAreaSplitLine(ctx) {
    let minX = 50;
    let maxX = canvas.width - 50;
    let maxY = 0.5 * canvas.height;
    let minY = 50;

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

function drawOperation(ctx, subj, clip) {

}

function drawFill(ctx, subj, clip) {
    
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

    shape.paths.forEach((path) => {
        ctx.beginPath();

        const points = path.points;
        const [x0, y0] = points[0];
        ctx.moveTo(x0, y0 + dy);

        for (let i = 1; i < points.length; i++) {
          const [x, y] = points[i];
          ctx.lineTo(x, y + dy);
        }

        ctx.closePath();
    });

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    ctx.fill('evenodd');
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


function getColorByIndex(index, opacity = 1) {
    const n = colorStore.length;
    const i = index % n;
    const color = colorStore[i];
  
    if (opacity < 0 || opacity > 1) {
        console.warn("Opacity should be between 0 and 1.");
        opacity = 1;
    }

    if (opacity === 1) {
        return color;
    }

    const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
    return color + alpha;
}

const testData = [
{
    name: "Squares 1",
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
    name: "Squares 2",
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
}
]
