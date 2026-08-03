import init, { CurveBuilder, CurveOverlay, FillRule, OverlayRule, } from "../i_shape/ishape_wasm.js";
import { findNearestPoint, clampPoint } from "../common/canvas_editor.js";
import { requireCanvas2D, requireElement } from "../common/dom.js";
import { parse } from "../vendor/opentype.min.mjs";
const WIDTH = 1000;
const HEIGHT = 520;
const HANDLE_RADIUS = 5.5;
const HANDLE_HIT_RADIUS = 24;
const GLYPH_BASELINE = 390;
const DEFAULT_FONT_SIZE = 240;
const FONT_URL = new URL("../../assets/fonts/AtkinsonHyperlegible-Regular.otf", import.meta.url);
const { canvas, context: ctx } = requireCanvas2D("type-curve-canvas");
const textInput = requireElement("type-curve-text", HTMLInputElement);
const sizeInput = requireElement("type-curve-size", HTMLInputElement);
const sizeOutput = requireElement("type-curve-size-output", HTMLOutputElement);
const resetButton = requireElement("type-curve-reset", HTMLButtonElement);
const statusElement = requireElement("type-curve-status", HTMLElement);
const selectionStat = requireElement("type-curve-stat-selection", HTMLElement);
const operationStat = requireElement("type-curve-stat-operation", HTMLElement);
const inputStat = requireElement("type-curve-stat-input", HTMLElement);
const resultStat = requireElement("type-curve-stat-result", HTMLElement);
const timeStat = requireElement("type-curve-stat-time", HTMLElement);
const operationButtons = Array.from(document.querySelectorAll("[data-operation]"));
const fillRuleButtons = Array.from(document.querySelectorAll("[data-fill-rule]"));
let font = null;
let glyphs = [];
let selectedObjectId = null;
let operationName = "Union";
let fillRuleName = "EvenOdd";
let renderedFontSize = DEFAULT_FONT_SIZE;
let dragState = null;
let hoverHandle = null;
let frameId = null;
let ready = false;
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
textInput.addEventListener("input", () => {
    const cleanText = textInput.value.replace(/[^A-Za-z0-9 ]/g, "").slice(0, 12);
    if (cleanText !== textInput.value) {
        textInput.value = cleanText;
    }
    rebuildGlyphs();
});
sizeInput.addEventListener("input", () => {
    sizeOutput.value = `${sizeInput.value} px`;
    rebuildGlyphs();
});
resetButton.addEventListener("click", () => {
    rebuildGlyphs();
});
canvas.addEventListener("pointerdown", (event) => {
    if (!ready) {
        return;
    }
    const point = pointerPoint(event);
    const selected = selectedObject();
    const handle = selected === null ? null : findHandle(selected, point);
    if (selected !== null && handle !== null) {
        dragState = { kind: "handle", object: selected, handle };
    }
    else {
        const object = hitObject(point);
        if (object !== null) {
            selectObject(object);
            dragState = { kind: "object", object, previous: point };
        }
    }
    if (dragState !== null) {
        canvas.setPointerCapture(event.pointerId);
        canvas.classList.add("is-dragging");
        event.preventDefault();
        scheduleDraw();
    }
});
canvas.addEventListener("pointermove", (event) => {
    const point = pointerPoint(event);
    if (dragState === null) {
        const selected = selectedObject();
        hoverHandle = selected === null ? null : findHandle(selected, point);
        canvas.style.cursor = hoverHandle === null ? "grab" : "pointer";
        scheduleDraw();
        return;
    }
    if (dragState.kind === "handle") {
        const clamped = clampPoint(point, 16, 16, WIDTH - 16, HEIGHT - 16);
        dragState.handle.point[0] = clamped[0] - dragState.object.position[0];
        dragState.handle.point[1] = clamped[1] - dragState.object.position[1];
    }
    else {
        const dx = point[0] - dragState.previous[0];
        const dy = point[1] - dragState.previous[1];
        dragState.object.position[0] += dx;
        dragState.object.position[1] += dy;
        dragState.previous = point;
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
void run();
async function run() {
    try {
        const fontRequest = fetch(FONT_URL);
        const [, response] = await Promise.all([init(), fontRequest]);
        if (!response.ok) {
            throw new Error(`Font request failed with status ${response.status}`);
        }
        font = parse(await response.arrayBuffer());
        ready = true;
        rebuildGlyphs();
    }
    catch (error) {
        console.error(error);
        statusElement.textContent = "Could not initialize the local font or WebAssembly module.";
        statusElement.classList.add("is-error");
    }
}
function rebuildGlyphs() {
    if (font === null) {
        return;
    }
    const text = textInput.value;
    const requestedSize = Number(sizeInput.value) || DEFAULT_FONT_SIZE;
    const requestedWidth = measureText(text, requestedSize);
    renderedFontSize = requestedSize * Math.min(1, 950 / Math.max(requestedWidth, 1));
    const width = measureText(text, renderedFontSize);
    let cursorX = Math.max(50, (WIDTH - width) * 0.5);
    const nextGlyphs = [];
    let visibleGlyphIndex = 0;
    Array.from(text).forEach((character, index) => {
        const advance = font?.getAdvanceWidth(character, renderedFontSize) ?? 0;
        if (character !== " ") {
            const glyph = font.charToGlyph(character);
            const contours = commandsToContours(glyph.getPath(0, 0, renderedFontSize).commands);
            if (contours.length > 0) {
                nextGlyphs.push({
                    id: `glyph-${index}`,
                    label: character,
                    role: visibleGlyphIndex % 2 === 0 ? "subject" : "clip",
                    position: [cursorX, GLYPH_BASELINE],
                    contours,
                });
                visibleGlyphIndex += 1;
            }
        }
        cursorX += advance;
    });
    glyphs = nextGlyphs;
    selectedObjectId = glyphs[0]?.id ?? null;
    dragState = null;
    hoverHandle = null;
    scheduleDraw();
}
function measureText(text, size) {
    if (font === null) {
        return 0;
    }
    return Array.from(text).reduce((width, character) => width + font.getAdvanceWidth(character, size), 0);
}
function commandsToContours(commands) {
    const contours = [];
    let contour = null;
    const finishContour = () => {
        if (contour !== null && contour.segments.length > 0) {
            contours.push(contour);
        }
        contour = null;
    };
    commands.forEach((command) => {
        switch (command.type) {
            case "M":
                finishContour();
                contour = { start: [command.x, command.y], segments: [] };
                break;
            case "L":
                contour?.segments.push({ type: "line", to: [command.x, command.y] });
                break;
            case "Q":
                contour?.segments.push({
                    type: "quad",
                    ctrl: [command.x1, command.y1],
                    to: [command.x, command.y],
                });
                break;
            case "C":
                contour?.segments.push({
                    type: "cubic",
                    ctrl0: [command.x1, command.y1],
                    ctrl1: [command.x2, command.y2],
                    to: [command.x, command.y],
                });
                break;
            case "Z":
                finishContour();
                break;
        }
    });
    finishContour();
    return contours;
}
function scheduleDraw() {
    if (!ready || frameId !== null) {
        return;
    }
    frameId = requestAnimationFrame(draw);
}
function draw() {
    frameId = null;
    syncCanvasResolution();
    const subjects = glyphs.filter((glyph) => glyph.role === "subject");
    const clips = glyphs.filter((glyph) => glyph.role === "clip");
    if (subjects.length === 0) {
        drawScene([]);
        selectionStat.textContent = "No glyph";
        operationStat.textContent = `${operationLabel(operationName)} · ${fillRuleLabel(fillRuleName)}`;
        inputStat.textContent = "—";
        resultStat.textContent = "—";
        timeStat.textContent = "—";
        statusElement.textContent = "Enter at least one Latin letter or digit.";
        return;
    }
    if (clips.length === 0) {
        drawScene([]);
        selectionStat.textContent = selectionLabel();
        operationStat.textContent = `${operationLabel(operationName)} · ${fillRuleLabel(fillRuleName)}`;
        inputStat.textContent = `${countSegments(subjects)} subj · 0 clip`;
        resultStat.textContent = "—";
        timeStat.textContent = "—";
        statusElement.textContent = "Enter a second glyph to create the Clip input.";
        return;
    }
    let subjectGeometry = null;
    let clipGeometry = null;
    let overlay = null;
    let resultGeometry = null;
    try {
        const startedAt = performance.now();
        subjectGeometry = buildGeometry(subjects);
        clipGeometry = buildGeometry(clips);
        overlay = new CurveOverlay(subjectGeometry, clipGeometry);
        const scale = overlay.scale();
        const report = overlay.conversionReport();
        resultGeometry = overlay.overlay(OverlayRule[operationName], FillRule[fillRuleName]);
        const elapsed = performance.now() - startedAt;
        drawScene(resultGeometry.toData());
        selectionStat.textContent = selectionLabel();
        operationStat.textContent = `${operationLabel(operationName)} · ${fillRuleLabel(fillRuleName)}`;
        inputStat.textContent = `${subjectGeometry.segmentCount} subj + ${clipGeometry.segmentCount} clip`;
        resultStat.textContent = `${resultGeometry.segmentCount} seg · ${resultGeometry.contourCount} contours`;
        timeStat.textContent = `${elapsed.toFixed(2)} ms`;
        const fitNote = renderedFontSize + 0.1 < Number(sizeInput.value)
            ? ` · fitted to ${Math.round(renderedFontSize)} px`
            : "";
        statusElement.textContent = report.hasDegeneracies
            ? `Scale ${formatScale(scale)}${fitNote} · conversion reported degeneracies`
            : `Scale ${formatScale(scale)}${fitNote} · local font, no conversion degeneracies`;
        statusElement.classList.toggle("is-warning", report.hasDegeneracies);
        statusElement.classList.remove("is-error");
    }
    catch (error) {
        console.error(error);
        drawScene([]);
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
function buildGeometry(objects) {
    const builder = new CurveBuilder();
    try {
        objects.forEach((object) => {
            object.contours.forEach((contour) => {
                builder.moveTo(...toWorld(object, contour.start));
                contour.segments.forEach((segment) => addBuilderSegment(builder, object, segment));
                builder.closeContour();
            });
        });
        return builder.build();
    }
    finally {
        builder.free();
    }
}
function countSegments(objects) {
    return objects.reduce((total, object) => total + object.contours.reduce((contourTotal, contour) => contourTotal + contour.segments.length, 0), 0);
}
function addBuilderSegment(builder, object, segment) {
    if (segment.type === "line") {
        builder.lineTo(...toWorld(object, segment.to));
    }
    else if (segment.type === "quad") {
        builder.quadraticCurveTo(...toWorld(object, segment.ctrl), ...toWorld(object, segment.to));
    }
    else {
        builder.bezierCurveTo(...toWorld(object, segment.ctrl0), ...toWorld(object, segment.ctrl1), ...toWorld(object, segment.to));
    }
}
function drawScene(resultData) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    drawBackground();
    glyphs.forEach(drawObject);
    resultData.forEach((shape) => {
        const path = curveShapeToPath(shape);
        ctx.fillStyle = "rgba(16, 185, 129, 0.24)";
        ctx.strokeStyle = "#047857";
        ctx.lineWidth = 2.25;
        ctx.setLineDash([]);
        ctx.fill(path, "nonzero");
        ctx.stroke(path);
    });
    const selected = selectedObject();
    if (selected !== null) {
        const path = objectToPath(selected);
        ctx.strokeStyle = "#7c3aed";
        ctx.lineWidth = 1.1;
        ctx.setLineDash([3, 5]);
        ctx.stroke(path);
        drawControlLines(selected);
        drawHandles(selected);
    }
    ctx.setLineDash([]);
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
    ctx.fillStyle = "rgba(100, 116, 139, 0.17)";
    ctx.fill();
    ctx.strokeStyle = "rgba(100, 116, 139, 0.22)";
    ctx.lineWidth = 1;
    ctx.setLineDash([7, 9]);
    ctx.beginPath();
    ctx.moveTo(34, GLYPH_BASELINE);
    ctx.lineTo(WIDTH - 34, GLYPH_BASELINE);
    ctx.stroke();
    ctx.fillStyle = "rgba(71, 85, 105, 0.62)";
    ctx.font = "700 13px system-ui, sans-serif";
    ctx.fillText("ALTERNATING SUBJECT / CLIP GLYPHS", 34, 42);
}
function drawObject(object) {
    const path = objectToPath(object);
    const isSubject = object.role === "subject";
    ctx.fillStyle = isSubject ? "rgba(249, 115, 22, 0.09)" : "rgba(37, 99, 235, 0.08)";
    ctx.strokeStyle = isSubject ? "#ea580c" : "#2563eb";
    ctx.lineWidth = 0.75;
    ctx.setLineDash([4, 6]);
    ctx.fill(path, canvasFillRule());
    ctx.stroke(path);
}
function objectToPath(object) {
    const path = new Path2D();
    object.contours.forEach((contour) => {
        path.moveTo(...toWorld(object, contour.start));
        contour.segments.forEach((segment) => addPathSegment(path, object, segment));
        path.closePath();
    });
    return path;
}
function addPathSegment(path, object, segment) {
    if (segment.type === "line") {
        path.lineTo(...toWorld(object, segment.to));
    }
    else if (segment.type === "quad") {
        path.quadraticCurveTo(...toWorld(object, segment.ctrl), ...toWorld(object, segment.to));
    }
    else {
        path.bezierCurveTo(...toWorld(object, segment.ctrl0), ...toWorld(object, segment.ctrl1), ...toWorld(object, segment.to));
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
function drawControlLines(object) {
    ctx.beginPath();
    object.contours.forEach((contour) => {
        let current = contour.start;
        contour.segments.forEach((segment) => {
            if (segment.type === "quad") {
                controlLine(object, current, segment.ctrl);
                controlLine(object, segment.to, segment.ctrl);
            }
            else if (segment.type === "cubic") {
                controlLine(object, current, segment.ctrl0);
                controlLine(object, segment.to, segment.ctrl1);
            }
            current = segment.to;
        });
    });
    ctx.strokeStyle = "rgba(124, 58, 237, 0.55)";
    ctx.lineWidth = 0.45;
    ctx.setLineDash([3, 5]);
    ctx.stroke();
}
function controlLine(object, from, to) {
    ctx.moveTo(...toWorld(object, from));
    ctx.lineTo(...toWorld(object, to));
}
function drawHandles(object) {
    objectHandles(object).forEach((handle) => {
        const point = toWorld(object, handle.point);
        const highlighted = handle.point === hoverHandle?.point
            || (dragState?.kind === "handle" && dragState.handle.point === handle.point);
        const radius = highlighted ? HANDLE_RADIUS + 2 : HANDLE_RADIUS;
        ctx.beginPath();
        ctx.arc(point[0], point[1], radius, 0, Math.PI * 2);
        ctx.fillStyle = handle.control ? "#ffffff" : "#7c3aed";
        ctx.strokeStyle = "#7c3aed";
        ctx.lineWidth = highlighted ? 2.25 : 1.4;
        ctx.fill();
        ctx.stroke();
    });
}
function objectHandles(object) {
    const handles = [];
    const seen = new Set();
    const add = (point, control) => {
        if (!seen.has(point)) {
            seen.add(point);
            handles.push({ point, control });
        }
    };
    object.contours.forEach((contour) => {
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
function findHandle(object, worldPoint) {
    const handles = objectHandles(object);
    const localPoint = [worldPoint[0] - object.position[0], worldPoint[1] - object.position[1]];
    const nearest = findNearestPoint(handles.map((handle) => handle.point), localPoint[0], localPoint[1], HANDLE_HIT_RADIUS);
    return nearest === null ? null : handles.find((handle) => handle.point === nearest) ?? null;
}
function hitObject(point) {
    const ordered = [...glyphs].reverse();
    for (const object of ordered) {
        if (pathContainsPoint(objectToPath(object), point)) {
            return object;
        }
    }
    return null;
}
function selectObject(object) {
    selectedObjectId = object.id;
    hoverHandle = null;
}
function selectedObject() {
    return glyphs.find((object) => object.id === selectedObjectId) ?? null;
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
    scheduleDraw();
}
function pointerPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return [
        (event.clientX - rect.left) * (WIDTH / rect.width),
        (event.clientY - rect.top) * (HEIGHT / rect.height),
    ];
}
function pathContainsPoint(path, point) {
    ctx.save();
    ctx.resetTransform();
    const contains = ctx.isPointInPath(path, point[0], point[1], canvasFillRule());
    ctx.restore();
    return contains;
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
function canvasFillRule() {
    return fillRuleName === "EvenOdd" ? "evenodd" : "nonzero";
}
function setActiveButton(buttons, activeButton) {
    buttons.forEach((button) => {
        const active = button === activeButton;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}
function selectionLabel() {
    const selected = selectedObject();
    if (selected === null) {
        return "—";
    }
    const role = selected.role === "subject" ? "Subject" : "Clip";
    return `${role} “${selected.label}”`;
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
function toWorld(object, point) {
    return [object.position[0] + point[0], object.position[1] + point[1]];
}
//# sourceMappingURL=type_curve.js.map