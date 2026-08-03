import init, { CurveBuilder, CurveOverlay, FillRule, OverlayRule, } from "../i_shape/ishape_wasm.js";
import { requireCanvas2D, requireElement } from "../common/dom.js";
const WIDTH = 1000;
const HEIGHT = 680;
const HANDLE_RADIUS = 5.5;
const HANDLE_HIT_RADIUS = 16;
const tests = [
    {
        name: "Bloom & Sun",
        description: "A six-petal flower meets a warm elliptical sun.",
        operation: "Union",
        fillRule: "EvenOdd",
        create: createBloomTest,
    },
    {
        name: "Egg & Cracked Shell",
        description: "An egg settles into a shell with a playful zig-zag crack.",
        operation: "Difference",
        fillRule: "NonZero",
        create: createEggTest,
    },
    {
        name: "Moon Behind a Cloud",
        description: "Subtract the cloud to reveal a quiet crescent moon.",
        operation: "Difference",
        fillRule: "NonZero",
        create: createMoonTest,
    },
    {
        name: "Heart & Sparkle",
        description: "A soft heart overlaps a bright four-point sparkle.",
        operation: "Xor",
        fillRule: "NonZero",
        create: createHeartTest,
    },
];
const { canvas, context: ctx } = requireCanvas2D("curve-canvas");
const resetButton = requireElement("curve-reset", HTMLButtonElement);
const previousTestButton = requireElement("curve-test-prev", HTMLButtonElement);
const nextTestButton = requireElement("curve-test-next", HTMLButtonElement);
const testIndexElement = requireElement("curve-test-index", HTMLElement);
const testNameElement = requireElement("curve-test-name", HTMLElement);
const testDescriptionElement = requireElement("curve-test-description", HTMLElement);
const testDotsElement = requireElement("curve-test-dots", HTMLElement);
const statusElement = requireElement("curve-status", HTMLElement);
const operationStat = requireElement("curve-stat-operation", HTMLElement);
const inputStat = requireElement("curve-stat-input", HTMLElement);
const resultStat = requireElement("curve-stat-result", HTMLElement);
const timeStat = requireElement("curve-stat-time", HTMLElement);
const operationButtons = Array.from(document.querySelectorAll("[data-operation]"));
const fillRuleButtons = Array.from(document.querySelectorAll("[data-fill-rule]"));
let testIndex = 0;
let { subject, clip } = tests[testIndex].create();
let operationName = tests[testIndex].operation;
let fillRuleName = tests[testIndex].fillRule;
let dragState = null;
let hoverHandle = null;
let wasmReady = false;
let frameId = null;
operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        operationName = button.dataset.operation;
        setActiveButton(operationButtons, button);
        scheduleDraw();
    });
});
fillRuleButtons.forEach((button) => {
    button.addEventListener("click", () => {
        fillRuleName = button.dataset.fillRule;
        setActiveButton(fillRuleButtons, button);
        scheduleDraw();
    });
});
previousTestButton.addEventListener("click", () => selectTest(testIndex - 1));
nextTestButton.addEventListener("click", () => selectTest(testIndex + 1));
resetButton.addEventListener("click", () => {
    ({ subject, clip } = tests[testIndex].create());
    hoverHandle = null;
    scheduleDraw();
});
canvas.addEventListener("pointerdown", (event) => {
    if (!wasmReady) {
        return;
    }
    const point = clientToCanvasPoint(event);
    const handle = findHandle(point);
    if (handle !== null) {
        dragState = { kind: "handle", handle };
    }
    else {
        const paths = createInputPaths();
        if (pathContainsPoint(paths.clip, point)) {
            dragState = { kind: "figure", figure: "clip", previous: point };
        }
        else if (pathContainsPoint(paths.subject, point)) {
            dragState = { kind: "figure", figure: "subject", previous: point };
        }
    }
    if (dragState !== null) {
        canvas.setPointerCapture(event.pointerId);
        canvas.classList.add("is-dragging");
        event.preventDefault();
    }
});
canvas.addEventListener("pointermove", (event) => {
    const point = clientToCanvasPoint(event);
    if (dragState === null) {
        hoverHandle = findHandle(point);
        canvas.style.cursor = hoverHandle === null ? "grab" : "pointer";
        scheduleDraw();
        return;
    }
    if (dragState.kind === "figure") {
        const dx = point[0] - dragState.previous[0];
        const dy = point[1] - dragState.previous[1];
        moveFigure(dragState.figure, dx, dy);
        dragState.previous = point;
    }
    else {
        moveHandle(dragState.handle, point);
    }
    scheduleDraw();
});
canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);
canvas.addEventListener("pointerleave", () => {
    if (dragState === null && hoverHandle !== null) {
        hoverHandle = null;
        scheduleDraw();
    }
});
const canvasResizeObserver = new ResizeObserver(() => {
    syncCanvasResolution();
    scheduleDraw();
});
canvasResizeObserver.observe(canvas);
syncCanvasResolution();
createTestDots();
updateTestUI();
updateSelectedControls();
void run();
async function run() {
    try {
        await init();
        wasmReady = true;
        statusElement.textContent = "Ready · automatic curve conversion scale";
        scheduleDraw();
    }
    catch (error) {
        console.error(error);
        statusElement.textContent = "Could not initialize the WebAssembly module.";
        statusElement.classList.add("is-error");
    }
}
function createTestDots() {
    tests.forEach((test, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "curve-playground__test-dot";
        button.textContent = String(index + 1);
        button.setAttribute("aria-label", `Show ${test.name}`);
        button.addEventListener("click", () => selectTest(index));
        testDotsElement.appendChild(button);
    });
}
function selectTest(index) {
    testIndex = (index + tests.length) % tests.length;
    const test = tests[testIndex];
    ({ subject, clip } = test.create());
    operationName = test.operation;
    fillRuleName = test.fillRule;
    dragState = null;
    hoverHandle = null;
    canvas.classList.remove("is-dragging");
    updateTestUI();
    updateSelectedControls();
    scheduleDraw();
}
function updateTestUI() {
    const test = tests[testIndex];
    testIndexElement.textContent = `${testIndex + 1} / ${tests.length}`;
    testNameElement.textContent = test.name;
    testDescriptionElement.textContent = test.description;
    const dots = Array.from(testDotsElement.querySelectorAll("button"));
    dots.forEach((dot, index) => {
        const active = index === testIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-pressed", String(active));
    });
}
function updateSelectedControls() {
    operationButtons.forEach((button) => {
        const active = button.dataset.operation === operationName;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
    fillRuleButtons.forEach((button) => {
        const active = button.dataset.fillRule === fillRuleName;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}
function scheduleDraw() {
    if (!wasmReady || frameId !== null) {
        return;
    }
    frameId = requestAnimationFrame(draw);
}
function draw() {
    frameId = null;
    syncCanvasResolution();
    let subjectGeometry = null;
    let clipGeometry = null;
    let overlay = null;
    let resultGeometry = null;
    try {
        const startedAt = performance.now();
        subjectGeometry = buildFigureGeometry(subject);
        clipGeometry = buildFigureGeometry(clip);
        overlay = new CurveOverlay(subjectGeometry, clipGeometry);
        const scale = overlay.scale();
        const report = overlay.conversionReport();
        resultGeometry = overlay.overlay(selectedOverlayRule(), selectedFillRule());
        const elapsed = performance.now() - startedAt;
        drawScene(resultGeometry.toData());
        operationStat.textContent = `${operationLabel(operationName)} · ${fillRuleLabel(fillRuleName)}`;
        inputStat.textContent = `${subjectGeometry.segmentCount} + ${clipGeometry.segmentCount}`;
        resultStat.textContent = `${resultGeometry.segmentCount} seg · ${resultGeometry.contourCount} contours`;
        timeStat.textContent = `${elapsed.toFixed(2)} ms`;
        statusElement.textContent = report.hasDegeneracies
            ? `Scale ${formatScale(scale)} · conversion reported degeneracies`
            : `Scale ${formatScale(scale)} · no conversion degeneracies`;
        statusElement.classList.toggle("is-warning", report.hasDegeneracies);
        statusElement.classList.remove("is-error");
    }
    catch (error) {
        console.error(error);
        statusElement.textContent = error instanceof Error ? error.message : "Curve operation failed.";
        statusElement.classList.add("is-error");
    }
    finally {
        resultGeometry?.free();
        overlay?.free();
        clipGeometry?.free();
        subjectGeometry?.free();
    }
}
function buildFigureGeometry(figure) {
    const builder = new CurveBuilder();
    try {
        if (figure.kind === "ellipse") {
            builder.addEllipse(figure.position[0], figure.position[1], figure.radiusX, figure.radiusY, figure.rotation, figure.clockwise);
        }
        else {
            figure.contours.forEach((contour) => {
                builder.moveTo(...toWorld(figure.position, contour.start));
                contour.segments.forEach((segment) => addBuilderSegment(builder, figure.position, segment));
                builder.closeContour();
            });
        }
        return builder.build();
    }
    finally {
        builder.free();
    }
}
function addBuilderSegment(builder, position, segment) {
    if (segment.type === "line") {
        builder.lineTo(...toWorld(position, segment.to));
    }
    else if (segment.type === "quad") {
        builder.quadraticCurveTo(...toWorld(position, segment.ctrl), ...toWorld(position, segment.to));
    }
    else {
        builder.bezierCurveTo(...toWorld(position, segment.ctrl0), ...toWorld(position, segment.ctrl1), ...toWorld(position, segment.to));
    }
}
function drawScene(resultData) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    drawBackground();
    const paths = createInputPaths();
    drawInputPath(paths.subject, "rgba(249, 115, 22, 0.09)", "#ea580c");
    drawInputPath(paths.clip, "rgba(37, 99, 235, 0.08)", "#2563eb");
    resultData.forEach((shape) => {
        const path = curveShapeToPath(shape);
        ctx.fillStyle = "rgba(16, 185, 129, 0.24)";
        ctx.strokeStyle = "#047857";
        ctx.lineWidth = 2.25;
        ctx.setLineDash([]);
        ctx.fill(path, "nonzero");
        ctx.stroke(path);
    });
    ctx.setLineDash([]);
    drawControlLines();
    drawHandles();
}
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(1, "#eef2ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.beginPath();
    for (let x = 20; x < WIDTH; x += 40) {
        for (let y = 20; y < HEIGHT; y += 40) {
            ctx.moveTo(x + 1.2, y);
            ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        }
    }
    ctx.fillStyle = "rgba(100, 116, 139, 0.18)";
    ctx.fill();
}
function drawInputPath(path, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.75;
    ctx.setLineDash([7, 6]);
    ctx.fill(path, selectedCanvasFillRule());
    ctx.stroke(path);
}
function createInputPaths() {
    return {
        subject: figureToPath(subject),
        clip: figureToPath(clip),
    };
}
function pathContainsPoint(path, point) {
    ctx.save();
    ctx.resetTransform();
    const contains = ctx.isPointInPath(path, point[0], point[1], "nonzero");
    ctx.restore();
    return contains;
}
function figureToPath(figure) {
    const path = new Path2D();
    if (figure.kind === "ellipse") {
        path.ellipse(figure.position[0], figure.position[1], figure.radiusX, figure.radiusY, figure.rotation, 0, Math.PI * 2, figure.clockwise);
        path.closePath();
        return path;
    }
    figure.contours.forEach((contour) => {
        path.moveTo(...toWorld(figure.position, contour.start));
        contour.segments.forEach((segment) => addPathSegment(path, figure.position, segment));
        path.closePath();
    });
    return path;
}
function addPathSegment(path, position, segment) {
    if (segment.type === "line") {
        path.lineTo(...toWorld(position, segment.to));
    }
    else if (segment.type === "quad") {
        path.quadraticCurveTo(...toWorld(position, segment.ctrl), ...toWorld(position, segment.to));
    }
    else {
        path.bezierCurveTo(...toWorld(position, segment.ctrl0), ...toWorld(position, segment.ctrl1), ...toWorld(position, segment.to));
    }
}
function curveShapeToPath(shape) {
    const path = new Path2D();
    shape.forEach((contour) => {
        path.moveTo(...contour.start);
        contour.segments.forEach((segment) => {
            switch (segment.type) {
                case "line":
                    path.lineTo(...segment.to);
                    break;
                case "quad":
                    path.quadraticCurveTo(...segment.ctrl, ...segment.to);
                    break;
                case "cubic":
                    path.bezierCurveTo(...segment.ctrl0, ...segment.ctrl1, ...segment.to);
                    break;
                case "arc": {
                    const { ellipse, startAngle, sweepAngle } = segment.arc;
                    path.ellipse(ellipse.center[0], ellipse.center[1], ellipse.radiusX, ellipse.radiusY, ellipse.rotation, startAngle, startAngle + sweepAngle, sweepAngle < 0);
                    break;
                }
            }
        });
        path.closePath();
    });
    return path;
}
function drawControlLines() {
    drawFigureControlLines(subject, "rgba(234, 88, 12, 0.45)");
    drawFigureControlLines(clip, "rgba(37, 99, 235, 0.48)");
    ctx.setLineDash([]);
}
function drawFigureControlLines(figure, color) {
    ctx.beginPath();
    if (figure.kind === "ellipse") {
        ctx.moveTo(...figure.position);
        ctx.lineTo(...ellipseHandlePosition(figure, "x"));
        ctx.moveTo(...figure.position);
        ctx.lineTo(...ellipseHandlePosition(figure, "y"));
    }
    else {
        figure.contours.forEach((contour) => {
            let current = contour.start;
            contour.segments.forEach((segment) => {
                if (segment.type === "quad") {
                    drawControlLine(figure.position, current, segment.ctrl);
                    drawControlLine(figure.position, segment.to, segment.ctrl);
                }
                else if (segment.type === "cubic") {
                    drawControlLine(figure.position, current, segment.ctrl0);
                    drawControlLine(figure.position, segment.to, segment.ctrl1);
                }
                current = segment.to;
            });
        });
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.45;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
}
function drawControlLine(position, from, to) {
    ctx.moveTo(...toWorld(position, from));
    ctx.lineTo(...toWorld(position, to));
}
function drawHandles() {
    allHandles().forEach((handle) => {
        const color = handle.figure === "subject" ? "#ea580c" : "#2563eb";
        drawHandle(handlePosition(handle), color, handle.control, isHighlighted(handle));
    });
    [subject, clip].forEach((figure, index) => {
        if (figure.kind === "ellipse") {
            ctx.beginPath();
            ctx.arc(figure.position[0], figure.position[1], 4, 0, Math.PI * 2);
            ctx.fillStyle = index === 0 ? "#ea580c" : "#2563eb";
            ctx.fill();
        }
    });
}
function drawHandle(point, color, control, highlighted) {
    const radius = highlighted ? HANDLE_RADIUS + 2 : HANDLE_RADIUS;
    ctx.beginPath();
    ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
    ctx.fillStyle = control ? "#ffffff" : color;
    ctx.strokeStyle = color;
    ctx.lineWidth = highlighted ? 2.25 : 1.4;
    ctx.fill();
    ctx.stroke();
}
function allHandles() {
    return [
        ...figureHandles("subject", subject),
        ...figureHandles("clip", clip),
    ];
}
function figureHandles(name, figure) {
    if (figure.kind === "ellipse") {
        return [
            { kind: "radius", figure: name, axis: "x", control: true },
            { kind: "radius", figure: name, axis: "y", control: true },
        ];
    }
    const handles = [];
    const seen = new Set();
    const add = (point, control) => {
        if (!seen.has(point)) {
            seen.add(point);
            handles.push({ kind: "point", figure: name, point, control });
        }
    };
    figure.contours.forEach((contour) => {
        add(contour.start, false);
        contour.segments.forEach((segment) => {
            if (segment.type === "quad") {
                add(segment.ctrl, true);
            }
            else if (segment.type === "cubic") {
                add(segment.ctrl0, true);
                add(segment.ctrl1, true);
            }
            add(segment.to, false);
        });
    });
    return handles;
}
function findHandle(point) {
    let nearest = null;
    let nearestDistance = HANDLE_HIT_RADIUS;
    allHandles().forEach((handle) => {
        const position = handlePosition(handle);
        const distance = Math.hypot(position[0] - point[0], position[1] - point[1]);
        if (distance <= nearestDistance) {
            nearest = handle;
            nearestDistance = distance;
        }
    });
    return nearest;
}
function handlePosition(handle) {
    const figure = figureByName(handle.figure);
    if (handle.kind === "point") {
        return toWorld(figure.position, handle.point);
    }
    if (figure.kind !== "ellipse") {
        throw new Error("Radius handle requires an ellipse");
    }
    return ellipseHandlePosition(figure, handle.axis);
}
function ellipseHandlePosition(figure, axis) {
    const angle = figure.rotation + (axis === "x" ? 0 : Math.PI / 2);
    const radius = axis === "x" ? figure.radiusX : figure.radiusY;
    return [
        figure.position[0] + Math.cos(angle) * radius,
        figure.position[1] + Math.sin(angle) * radius,
    ];
}
function moveHandle(handle, point) {
    const figure = figureByName(handle.figure);
    const clamped = clampPoint(point, 24);
    if (handle.kind === "point") {
        handle.point[0] = clamped[0] - figure.position[0];
        handle.point[1] = clamped[1] - figure.position[1];
        return;
    }
    if (figure.kind !== "ellipse") {
        return;
    }
    const dx = clamped[0] - figure.position[0];
    const dy = clamped[1] - figure.position[1];
    const cos = Math.cos(figure.rotation);
    const sin = Math.sin(figure.rotation);
    const localX = cos * dx + sin * dy;
    const localY = -sin * dx + cos * dy;
    if (handle.axis === "x") {
        figure.radiusX = Math.min(250, Math.max(42, localX));
    }
    else {
        figure.radiusY = Math.min(210, Math.max(42, localY));
    }
}
function moveFigure(name, dx, dy) {
    const figure = figureByName(name);
    figure.position[0] = Math.min(WIDTH - 70, Math.max(70, figure.position[0] + dx));
    figure.position[1] = Math.min(HEIGHT - 70, Math.max(70, figure.position[1] + dy));
}
function figureByName(name) {
    return name === "subject" ? subject : clip;
}
function endDrag(event) {
    if (dragState === null) {
        return;
    }
    dragState = null;
    canvas.classList.remove("is-dragging");
    canvas.style.cursor = "grab";
    if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
    }
}
function clientToCanvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return [
        (event.clientX - rect.left) * (WIDTH / rect.width),
        (event.clientY - rect.top) * (HEIGHT / rect.height),
    ];
}
function syncCanvasResolution() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
        return;
    }
    const pixelRatio = Math.min(3, Math.max(1, window.devicePixelRatio || 1));
    const backingWidth = Math.max(1, Math.round(rect.width * pixelRatio));
    const backingHeight = Math.max(1, Math.round(rect.height * pixelRatio));
    if (canvas.width === backingWidth && canvas.height === backingHeight) {
        return;
    }
    canvas.width = backingWidth;
    canvas.height = backingHeight;
    ctx.setTransform(backingWidth / WIDTH, 0, 0, backingHeight / HEIGHT, 0, 0);
}
function selectedOverlayRule() {
    return OverlayRule[operationName];
}
function selectedFillRule() {
    return FillRule[fillRuleName];
}
function selectedCanvasFillRule() {
    return fillRuleName === "EvenOdd" ? "evenodd" : "nonzero";
}
function setActiveButton(buttons, activeButton) {
    buttons.forEach((button) => {
        const active = button === activeButton;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}
function operationLabel(name) {
    if (name === "InverseDifference") {
        return "Inverse Difference";
    }
    return name === "Xor" ? "Exclusion" : name;
}
function fillRuleLabel(name) {
    return name === "EvenOdd" ? "Even–Odd" : "Non-Zero";
}
function formatScale(scale) {
    return scale >= 1000 ? scale.toExponential(2) : scale.toFixed(2);
}
function isHighlighted(handle) {
    const activeHandle = dragState?.kind === "handle" ? dragState.handle : null;
    return sameHandle(hoverHandle, handle) || sameHandle(activeHandle, handle);
}
function sameHandle(a, b) {
    if (a === null || b === null || a.kind !== b.kind || a.figure !== b.figure) {
        return false;
    }
    return a.kind === "point" && b.kind === "point"
        ? a.point === b.point
        : a.kind === "radius" && b.kind === "radius" && a.axis === b.axis;
}
function toWorld(position, point) {
    return [position[0] + point[0], position[1] + point[1]];
}
function clampPoint(point, padding) {
    return [
        Math.min(WIDTH - padding, Math.max(padding, point[0])),
        Math.min(HEIGHT - padding, Math.max(padding, point[1])),
    ];
}
function createBloomTest() {
    const flowerStart = polarPoint(72, -Math.PI / 6);
    const flowerSegments = [];
    const step = Math.PI / 3;
    for (let index = 0; index < 6; index += 1) {
        const center = -Math.PI / 6 + (index + 0.5) * step;
        const end = index === 5 ? flowerStart : polarPoint(72, -Math.PI / 6 + (index + 1) * step);
        flowerSegments.push({
            type: "cubic",
            ctrl0: polarPoint(170, center - step * 0.22),
            ctrl1: polarPoint(170, center + step * 0.22),
            to: end,
        });
    }
    const coreStart = [-38, 0];
    const core = {
        start: coreStart,
        segments: [
            { type: "quad", ctrl: [-38, -38], to: [0, -38] },
            { type: "quad", ctrl: [38, -38], to: [38, 0] },
            { type: "quad", ctrl: [38, 38], to: [0, 38] },
            { type: "quad", ctrl: [-38, 38], to: coreStart },
        ],
    };
    return {
        subject: {
            kind: "path",
            position: [350, 340],
            contours: [{ start: flowerStart, segments: flowerSegments }, core],
        },
        clip: {
            kind: "ellipse",
            position: [620, 330],
            radiusX: 132,
            radiusY: 96,
            rotation: 0.18,
            clockwise: true,
        },
    };
}
function createEggTest() {
    const eggStart = [0, -172];
    const shellStart = [-118, 20];
    return {
        subject: {
            kind: "path",
            position: [500, 315],
            contours: [{
                    start: eggStart,
                    segments: [
                        { type: "cubic", ctrl0: [82, -150], ctrl1: [120, -55], to: [108, 35] },
                        { type: "cubic", ctrl0: [98, 120], ctrl1: [45, 170], to: [0, 174] },
                        { type: "cubic", ctrl0: [-45, 170], ctrl1: [-98, 120], to: [-108, 35] },
                        { type: "cubic", ctrl0: [-120, -55], ctrl1: [-82, -150], to: eggStart },
                    ],
                }],
        },
        clip: {
            kind: "path",
            position: [500, 330],
            contours: [{
                    start: shellStart,
                    segments: [
                        { type: "line", to: [-82, -2] },
                        { type: "line", to: [-48, 28] },
                        { type: "line", to: [-8, -7] },
                        { type: "line", to: [30, 30] },
                        { type: "line", to: [72, 0] },
                        { type: "line", to: [118, 22] },
                        { type: "cubic", ctrl0: [122, 92], ctrl1: [76, 148], to: [0, 155] },
                        { type: "cubic", ctrl0: [-76, 148], ctrl1: [-122, 92], to: shellStart },
                    ],
                }],
        },
    };
}
function createMoonTest() {
    const cloudStart = [-154, 54];
    return {
        subject: {
            kind: "ellipse",
            position: [365, 315],
            radiusX: 135,
            radiusY: 168,
            rotation: -0.12,
            clockwise: true,
        },
        clip: {
            kind: "path",
            position: [585, 385],
            contours: [{
                    start: cloudStart,
                    segments: [
                        { type: "cubic", ctrl0: [-172, 8], ctrl1: [-132, -38], to: [-86, -28] },
                        { type: "cubic", ctrl0: [-72, -96], ctrl1: [24, -108], to: [56, -40] },
                        { type: "cubic", ctrl0: [116, -58], ctrl1: [166, -12], to: [146, 36] },
                        { type: "cubic", ctrl0: [136, 70], ctrl1: [102, 82], to: [56, 78] },
                        { type: "line", to: [-96, 78] },
                        { type: "cubic", ctrl0: [-126, 78], ctrl1: [-150, 70], to: cloudStart },
                    ],
                }],
        },
    };
}
function createHeartTest() {
    const heartStart = [0, 154];
    const sparkleStart = [0, -132];
    return {
        subject: {
            kind: "path",
            position: [420, 330],
            contours: [{
                    start: heartStart,
                    segments: [
                        { type: "cubic", ctrl0: [-34, 116], ctrl1: [-152, 62], to: [-152, -22] },
                        { type: "cubic", ctrl0: [-152, -108], ctrl1: [-58, -142], to: [0, -62] },
                        { type: "cubic", ctrl0: [58, -142], ctrl1: [152, -108], to: [152, -22] },
                        { type: "cubic", ctrl0: [152, 62], ctrl1: [34, 116], to: heartStart },
                    ],
                }],
        },
        clip: {
            kind: "path",
            position: [590, 322],
            contours: [{
                    start: sparkleStart,
                    segments: [
                        { type: "cubic", ctrl0: [7, -82], ctrl1: [14, -48], to: [30, -30] },
                        { type: "cubic", ctrl0: [50, -13], ctrl1: [82, -7], to: [132, 0] },
                        { type: "cubic", ctrl0: [82, 7], ctrl1: [50, 13], to: [30, 30] },
                        { type: "cubic", ctrl0: [14, 48], ctrl1: [7, 82], to: [0, 132] },
                        { type: "cubic", ctrl0: [-7, 82], ctrl1: [-14, 48], to: [-30, 30] },
                        { type: "cubic", ctrl0: [-50, 13], ctrl1: [-82, 7], to: [-132, 0] },
                        { type: "cubic", ctrl0: [-82, -7], ctrl1: [-50, -13], to: [-30, -30] },
                        { type: "cubic", ctrl0: [-14, -48], ctrl1: [-7, -82], to: sparkleStart },
                    ],
                }],
        },
    };
}
function polarPoint(radius, angle) {
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
}
//# sourceMappingURL=boolean_playground.js.map