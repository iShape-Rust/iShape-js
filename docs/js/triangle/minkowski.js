import init, { FillRule, minkowski_difference, minkowski_sum, } from "../i_shape/ishape_wasm.js";
import { clampPoint, findNearestPoint } from "../common/canvas_editor.js";
import { clientToCanvasPoint, requireCanvas2D, requireElement } from "../common/dom.js";
import { clearGeometryCanvas, drawGeometryPoint, geometryPalette, geometryStrokeWidth, onGeometryThemeChange, withOpacity, } from "../common/geometry_style.js";
import { createMinkowskiShape, minkowskiPresets } from "./minkowski_data.js";
const selectA = requireElement("minkowski-a", HTMLSelectElement);
const selectB = requireElement("minkowski-b", HTMLSelectElement);
const operation = requireElement("minkowski-operation", HTMLSelectElement);
const reset = requireElement("minkowski-reset", HTMLButtonElement);
const status = requireElement("minkowski-status", HTMLElement);
const formula = requireElement("minkowski-formula", HTMLElement);
const { canvas, context: ctx } = requireCanvas2D("minkowski-canvas");
const width = canvas.width;
const height = canvas.height;
const pixelRatio = window.devicePixelRatio || 1;
const units = 36;
canvas.width = Math.round(width * pixelRatio);
canvas.height = Math.round(height * pixelRatio);
ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
for (const select of [selectA, selectB]) {
    for (const preset of minkowskiPresets) {
        select.add(new Option(preset.name, preset.id));
    }
}
selectA.value = "l-shape";
selectB.value = "triangle";
let a = createMinkowskiShape("l-shape", "a");
let b = createMinkowskiShape("triangle", "b");
let result = [];
let selected = null;
let hovered = null;
let pointer = null;
let ready = false;
let pending = false;
let dirty = false;
function screen([x, y]) {
    return [width / 2 + x * units, height / 2 - y * units];
}
function world(event) {
    const [x, y] = clientToCanvasPoint(canvas, event.clientX, event.clientY, pixelRatio);
    return [(x - width / 2) / units, (height / 2 - y) / units];
}
function hit(event) {
    const [x, y] = world(event);
    const radius = (event.pointerType === "touch" ? 22 : 10) * width
        / canvas.getBoundingClientRect().width / units;
    return findNearestPoint([...a.flat(), ...b.flat()], x, y, radius);
}
function requestDraw(recalculate = false) {
    dirty || (dirty = recalculate);
    if (pending)
        return;
    pending = true;
    requestAnimationFrame(() => {
        pending = false;
        if (dirty) {
            dirty = false;
            update();
        }
        else {
            draw();
        }
    });
}
function update() {
    if (!ready)
        return;
    const difference = operation.value === "difference";
    formula.textContent = difference ? "A − B = A + (−B)" : "A + B";
    try {
        result = (difference ? minkowski_difference : minkowski_sum)(a, b, FillRule.NonZero);
        status.classList.remove("is-error");
        status.textContent = result.length === 0
            ? "The selected shapes have no filled result."
            : `${result.length} region${result.length === 1 ? "" : "s"} · ${result.reduce((sum, shape) => sum + shape.reduce((n, contour) => n + contour.length, 0), 0)} result vertices`;
    }
    catch (error) {
        result = [];
        status.classList.add("is-error");
        status.textContent = error instanceof Error ? error.message : String(error);
    }
    draw();
}
function drawGrid() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = withOpacity(geometryPalette.border, 0.55);
    ctx.beginPath();
    for (let x = -10; x <= 10; x++) {
        const [px] = screen([x, 0]);
        ctx.moveTo(px, 28);
        ctx.lineTo(px, height - 28);
    }
    for (let y = -7; y <= 7; y++) {
        const [, py] = screen([0, y]);
        ctx.moveTo(28, py);
        ctx.lineTo(width - 28, py);
    }
    ctx.stroke();
    ctx.strokeStyle = geometryPalette.muted;
    ctx.beginPath();
    ctx.moveTo(28, height / 2);
    ctx.lineTo(width - 28, height / 2);
    ctx.moveTo(width / 2, 28);
    ctx.lineTo(width / 2, height - 28);
    ctx.stroke();
    ctx.fillStyle = geometryPalette.muted;
    ctx.font = "12px sans-serif";
    for (let x = -10; x <= 10; x += 2) {
        const [px, py] = screen([x, 0]);
        ctx.fillText(String(x), px + 5, py + 16);
    }
    for (let y = -6; y <= 6; y += 2) {
        if (y === 0)
            continue;
        const [px, py] = screen([0, y]);
        ctx.fillText(String(y), px + 5, py - 5);
    }
    ctx.fillText("x", width - 20, height / 2 + 4);
    ctx.fillText("y", width / 2 - 4, 18);
}
function drawShape(shape, color, source) {
    const path = new Path2D();
    for (const contour of shape) {
        contour.forEach((point, index) => {
            const [x, y] = screen(point);
            if (index === 0)
                path.moveTo(x, y);
            else
                path.lineTo(x, y);
        });
        path.closePath();
    }
    ctx.fillStyle = withOpacity(color, source ? 0.06 : 0.16);
    ctx.strokeStyle = color;
    ctx.lineWidth = geometryStrokeWidth;
    ctx.setLineDash(source ? [5, 5] : []);
    ctx.fill(path, "nonzero");
    ctx.stroke(path);
    ctx.setLineDash([]);
}
function draw() {
    clearGeometryCanvas(ctx, width, height);
    drawGrid();
    for (const shape of result)
        drawShape(shape, geometryPalette.result, false);
    drawShape(a, geometryPalette.subject, true);
    drawShape(b, geometryPalette.clip, true);
    for (const [shape, color] of [[a, geometryPalette.subject], [b, geometryPalette.clip]]) {
        for (const point of shape.flat()) {
            drawGeometryPoint(ctx, screen(point), color, point === selected ? "active" : point === hovered ? "hover" : "idle");
        }
    }
    canvas.style.cursor = selected ? "grabbing" : hovered ? "grab" : "default";
}
for (const [select, body] of [[selectA, "a"], [selectB, "b"]]) {
    select.addEventListener("change", () => {
        const shape = createMinkowskiShape(select.value, body);
        if (body === "a")
            a = shape;
        else
            b = shape;
        selected = hovered = null;
        update();
    });
}
operation.addEventListener("change", update);
reset.addEventListener("click", () => {
    a = createMinkowskiShape(selectA.value, "a");
    b = createMinkowskiShape(selectB.value, "b");
    selected = hovered = null;
    update();
});
canvas.addEventListener("pointerdown", event => {
    if (!ready || !event.isPrimary || event.button !== 0)
        return;
    selected = hit(event);
    if (!selected)
        return;
    event.preventDefault();
    pointer = event.pointerId;
    hovered = null;
    canvas.setPointerCapture(event.pointerId);
    requestDraw();
});
canvas.addEventListener("pointermove", event => {
    if (!ready)
        return;
    if (selected && event.pointerId === pointer) {
        const point = clampPoint(world(event), -4.5, -3.5, 4.5, 3.5);
        selected[0] = point[0];
        selected[1] = point[1];
        requestDraw(true);
    }
    else if (pointer === null) {
        hovered = hit(event);
        requestDraw();
    }
});
function endDrag(event) {
    if (event.pointerId !== pointer)
        return;
    selected = null;
    pointer = null;
    if (canvas.hasPointerCapture(event.pointerId))
        canvas.releasePointerCapture(event.pointerId);
    update();
}
canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);
canvas.addEventListener("lostpointercapture", endDrag);
canvas.addEventListener("pointerleave", () => {
    hovered = null;
    requestDraw();
});
onGeometryThemeChange(requestDraw);
draw();
async function run() {
    try {
        await init();
        ready = true;
        for (const control of [selectA, selectB, operation, reset])
            control.disabled = false;
        update();
    }
    catch (error) {
        status.classList.add("is-error");
        status.textContent = `Could not load Minkowski operations: ${error instanceof Error ? error.message : String(error)}`;
    }
}
void run();
//# sourceMappingURL=minkowski.js.map