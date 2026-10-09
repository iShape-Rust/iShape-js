import {
    clearGeometryCanvas,
    drawGeometryPoint,
    geometryPalette,
    geometryStrokeWidth,
    withOpacity,
    onGeometryThemeChange,
} from "../common/geometry_style.js";
import init, {Overlay, FillRule, OverlayRule, type SeparatedVectors} from '../i_shape/ishape_wasm.js';
import {clientToCanvasPoint, requireCanvas2D, requireElement} from '../common/dom.js';
import {findNearestPoint} from '../common/canvas_editor.js';
import {formatTestTitle} from '../common/demo.js';
import type {Shape, Shapes, WorkingArea} from '../geometry/path.js';
import type {Point, Vector} from '../geometry/vector.js';
import {Segment} from './segment.js';
import * as data from './editor_data.js';

const overlayRuleSelect = requireElement('overlayRule', HTMLSelectElement);
const fillRuleSelect = requireElement('fillRule', HTMLSelectElement);
const snapTextField = requireElement('snap', HTMLInputElement);
const fillTextField = requireElement('fill', HTMLInputElement);
const arrowsTextField = requireElement('arrows', HTMLInputElement);
const prevButton = requireElement('test-prev', HTMLButtonElement);
const nextButton = requireElement('test-next', HTMLButtonElement);
const testTitle = requireElement('test-name', HTMLElement);
const {canvas, context: ctx} = requireCanvas2D('editorCanvas');

const twoPI = 2 * Math.PI;

const SegmentFill = {
    subjTop: 0b0001,
    subjBottom: 0b0010,
    clipTop: 0b0100,
    clipBottom: 0b1000
};

let testIndex = 0;
let selectedPoint: Point | null = null;
let candidatePoint: Point | null = null;
let isSubjSelected = false;
let isSubjCandidate = false;
let isMousePressed = false;

let scale = 1.0;

if (window.devicePixelRatio > 1) {
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    scale = window.devicePixelRatio;
}

async function run(): Promise<void> {
    await init();
    onGeometryThemeChange(() => requestAnimationFrame(draw));
    requestAnimationFrame(draw);
    testTitle.textContent = formatTestTitle(testIndex, data.tests.length, data.tests[testIndex].name);
}

void run();

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

overlayRuleSelect.addEventListener('change', function (event) {
    requestAnimationFrame(draw);
});

fillRuleSelect.addEventListener('change', function (event) {
    requestAnimationFrame(draw);
});

fillTextField.addEventListener('change', function (event) {
    requestAnimationFrame(draw);
});

arrowsTextField.addEventListener('change', function (event) {
    requestAnimationFrame(draw);
});

canvas.addEventListener('touchstart', function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    pressDown(touch.clientX, touch.clientY);
    requestAnimationFrame(draw);
});

canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    move(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchend', function (event) {
    event.preventDefault(); // Prevent click emulation and scrolling
    selectedPoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});

canvas.addEventListener('mousedown', function (event) {
    pressDown(event.clientX, event.clientY);
    requestAnimationFrame(draw);
});

canvas.addEventListener('mousemove', function (event) {
    move(event.clientX, event.clientY);
});

canvas.addEventListener('mouseup', function (event) {
    selectedPoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});

canvas.addEventListener('mouseout', function (event) {
    selectedPoint = null;
    candidatePoint = null;
    isMousePressed = false;
    requestAnimationFrame(draw);
});

function pressDown(eX: number, eY: number): void {
    const [x, y] = clientToCanvasPoint(canvas, eX, eY, scale);

    const test = data.tests[testIndex];
    isMousePressed = true;

    for (let i = 0; i < test.subj.length; i++) {
        const shape = test.subj[i];
        selectedPoint = findPoint(shape, x, y);
        if (selectedPoint !== null) {
            isSubjSelected = true;
            candidatePoint = null;
            isSubjCandidate = false;
            return;
        }
    }

    for (let i = 0; i < test.clip.length; i++) {
        const shape = test.clip[i];
        selectedPoint = findPoint(shape, x, y);
        if (selectedPoint !== null) {
            isSubjSelected = false;
            candidatePoint = null;
            isSubjCandidate = false;
            return;
        }
    }
}

function move(eX: number, eY: number): void {
    let [x, y] = clientToCanvasPoint(canvas, eX, eY, scale);

    if (isMousePressed) {
        // Left mouse button was pressed
        if (selectedPoint !== null) {
            const isSnap = snapTextField.checked;

            if (isSnap) {
                x = Math.round(x * 0.2) * 5;
                y = Math.round(y * 0.2) * 5;
            }

            const rect = workingArea();

            selectedPoint[0] = Math.max(Math.min(x, rect.maxX), rect.minX);
            selectedPoint[1] = Math.max(Math.min(y, rect.maxY), rect.minY);

            requestAnimationFrame(draw);
        }
    } else {
        const wasCandidate = candidatePoint !== null;
        const test = data.tests[testIndex];

        for (let i = 0; i < test.subj.length; i++) {
            const shape = test.subj[i];
            candidatePoint = findPoint(shape, x, y);
            if (candidatePoint !== null) {
                isSubjCandidate = true;
                requestAnimationFrame(draw);
                return;
            }
        }

        for (let i = 0; i < test.clip.length; i++) {
            const shape = test.clip[i];
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

function findPoint(shape: Shape, x: number, y: number): Point | null {
    for (let path of shape) {
        const point = findNearestPoint(path, x, y, 10);
        if (point !== null) {
            return point;
        }
    }
    return null;
}

function draw(): void {

    const test = data.tests[testIndex];

    const fill_rule = fillRule();
    const overlay_rule = overlayRule();

    const overlay = createOverlay(test.subj, test.clip);
    const result = overlay.overlay(overlay_rule, fill_rule);

    clearGeometryCanvas(ctx, canvas.width / scale, canvas.height / scale);

    drawWorkingAreaSplitLine(ctx);

    const isArrows = arrowsTextField.checked;

    test.subj.forEach((shape) => {
        drawShape(ctx, shape,
            withOpacity(geometryPalette.subject, 0.12),
            withOpacity(geometryPalette.subject, 0.55),
            geometryStrokeWidth, 0.0, fill_rule, isArrows);
    });

    test.clip.forEach((shape) => {
        drawShape(ctx, shape,
            withOpacity(geometryPalette.clip, 0.12),
            withOpacity(geometryPalette.clip, 0.55),
            geometryStrokeWidth, 0.0, fill_rule, isArrows);
    });

    const isFill = fillTextField.checked;
    if (isFill) {
        const overlay = createOverlay(test.subj, test.clip);
        const vectors = overlay.separate_vectors(fill_rule);
        drawFill(ctx, vectors);
    }

    drawPoints(ctx, test.subj, geometryPalette.subject);
    drawPoints(ctx, test.clip, geometryPalette.clip);

    if (selectedPoint !== null) {
        const color = isSubjSelected ? geometryPalette.subject : geometryPalette.clip;
        drawGeometryPoint(ctx, selectedPoint, color, "active");
    }

    if (candidatePoint !== null) {
        const color = isSubjCandidate ? geometryPalette.subject : geometryPalette.clip;
        drawGeometryPoint(ctx, candidatePoint, color, "hover");
    }

    const maxY = 0.5 * canvas.height / scale;

    result.forEach((shape) => {
        const stroke = geometryPalette.result;
        const fill = withOpacity(geometryPalette.result, 0.12);

        drawShape(ctx, shape, fill, stroke, geometryStrokeWidth, maxY, fill_rule, false);
    });

}

function drawWorkingAreaSplitLine(ctx: CanvasRenderingContext2D): void {
    const rect = workingArea();

    ctx.setLineDash([4, 10]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = geometryPalette.border;

    ctx.beginPath();
    ctx.moveTo(rect.minX, rect.minY);
    ctx.lineTo(rect.minX, rect.maxY);
    ctx.lineTo(rect.maxX, rect.maxY);
    ctx.lineTo(rect.maxX, rect.minY);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawFill(ctx: CanvasRenderingContext2D, data: SeparatedVectors): void {
    data.vectors.forEach((vector) => {
        const fill = vector.fill;
        const seg = new Segment(vector);

        const isFillSubjTop = (fill & SegmentFill.subjTop) === SegmentFill.subjTop;
        const isFillClipTop = (fill & SegmentFill.clipTop) === SegmentFill.clipTop;

        const isFillSubjBottom = (fill & SegmentFill.subjBottom) === SegmentFill.subjBottom;
        const isFillClipBottom = (fill & SegmentFill.clipBottom) === SegmentFill.clipBottom;

        drawCircle(ctx, seg.subjTopPos, isFillSubjTop, geometryPalette.subject);
        drawCircle(ctx, seg.clipTopPos, isFillClipTop, geometryPalette.clip);
        drawCircle(ctx, seg.subjBottomPos, isFillSubjBottom, geometryPalette.subject);
        drawCircle(ctx, seg.clipBottomPos, isFillClipBottom, geometryPalette.clip);

    });
}

function drawCircle(ctx: CanvasRenderingContext2D, p: Vector, isFill: boolean, color: string): void {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2 * geometryStrokeWidth, 0, twoPI);
    ctx.fillStyle = isFill ? color : withOpacity(color, 0.05);
    ctx.fill();
}

function drawShape(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    fillColor: string,
    strokeColor: string | null,
    lineWidth: number,
    dy: number,
    fillRule: FillRule,
    showArrows: boolean,
): void {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const region = new Path2D();
    const arrows = new Path2D();

    shape.forEach((points) => {
        const [x0, y0] = points[0];
        region.moveTo(x0, y0 + dy);

        for (let i = 1; i < points.length; i++) {
            const [x, y] = points[i];
            region.lineTo(x, y + dy);

            if (showArrows) {
                drawArrow(arrows, points[i - 1][0], points[i - 1][1] + dy, x, y + dy);
            }
        }

        region.closePath();

        if (showArrows) {
            // Draw arrow for the last segment that closes the shape
            drawArrow(arrows, points[points.length - 1][0], points[points.length - 1][1] + dy, x0, y0 + dy);
        }
    });

    ctx.fillStyle = fillColor;

    if (lineWidth > 0 && strokeColor !== null) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.stroke(region);
        if (showArrows) {
            ctx.stroke(arrows);
        }
    }

    switch (fillRule) {
        case FillRule.EvenOdd:
            ctx.fill(region, 'evenodd');
            break;
        case FillRule.NonZero:
            ctx.fill(region, 'nonzero');
            break;
    }
}

function drawPoints(ctx: CanvasRenderingContext2D, shapes: Shapes, color: string): void {
    ctx.fillStyle = color;

    shapes.forEach((shape) => {
        shape.forEach((points) => {
            for (let i = 0; i < points.length; i++) {
                drawGeometryPoint(ctx, points[i], color);
            }
        });
    });
}

function overlayRule(): OverlayRule {
    switch (overlayRuleSelect.value) {
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
        case 'Subject':
            return OverlayRule.Subject;
        case 'Clip':
            return OverlayRule.Clip;
        default:
            throw new Error(`Unknown overlay rule: ${overlayRuleSelect.value}`);
    }
}

function fillRule(): FillRule {
    switch (fillRuleSelect.value) {
        case 'EvenOdd':
            return FillRule.EvenOdd;
        case 'NonZero':
            return FillRule.NonZero;
        default:
            throw new Error(`Unknown fill rule: ${fillRuleSelect.value}`);
    }
}

function workingArea(): WorkingArea {
    const minX = 50;
    const maxX = canvas.width / scale - 50;
    const maxY = 0.5 * canvas.height / scale;
    const minY = 50;
    return {minX, minY, maxX, maxY};
}

function drawArrow(arrows: Path2D, fromX: number, fromY: number, toX: number, toY: number): void {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const length = Math.hypot(dx, dy);
    if (length < 1e-5) return;
    const nx = dx / length;
    const ny = dy / length;
    const tipX = 0.5 * (fromX + toX);
    const tipY = 0.5 * (fromY + toY);
    const baseX = tipX - nx * 4 * geometryStrokeWidth;
    const baseY = tipY - ny * 4 * geometryStrokeWidth;
    const side = 2 * geometryStrokeWidth;
    arrows.moveTo(baseX - ny * side, baseY + nx * side);
    arrows.lineTo(tipX, tipY);
    arrows.lineTo(baseX + ny * side, baseY - nx * side);
}

function createOverlay(subj: Shapes, clip: Shapes): Overlay {
    const overlay = Overlay.new_with_subj_and_clip(subj, clip);
    if (overlay === undefined) {
        throw new Error('Could not create overlay');
    }

    return overlay;
}
