import init, {
    CurveBuilder,
    CurveOverlay,
    FillRule,
    OverlayRule,
    type CurveGeometry,
    type CurveShapeData,
    type CurveShapesData,
} from "../i_shape/ishape_wasm.js";
import {requireCanvas2D, requireElement} from "../common/dom.js";
import {bindRangeOutput} from "../common/demo.js";

type Point = [number, number];
type OperationName = "Union" | "Intersect" | "Difference" | "Xor";

type CubicSegment = {
    ctrl0: Point;
    ctrl1: Point;
    to: Point;
};

type CubicContour = {
    start: Point;
    segments: CubicSegment[];
};

const WIDTH = 1000;
const HEIGHT = 620;
const SAMPLE_LIMIT = 90;
const TWO_PI = 2 * Math.PI;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const {canvas, context: ctx} = requireCanvas2D("curve-motion-canvas");
const countInput = requireElement("curve-motion-count", HTMLInputElement);
const detailInput = requireElement("curve-motion-detail", HTMLInputElement);
const sizeInput = requireElement("curve-motion-size", HTMLInputElement);
const speedInput = requireElement("curve-motion-speed", HTMLInputElement);
const toleranceInput = requireElement("curve-motion-tolerance", HTMLInputElement);
const toggleButton = requireElement("curve-motion-toggle", HTMLButtonElement);
const inputStat = requireElement("curve-motion-stat-input", HTMLElement);
const resultStat = requireElement("curve-motion-stat-result", HTMLElement);
const medianStat = requireElement("curve-motion-stat-median", HTMLElement);
const p95Stat = requireElement("curve-motion-stat-p95", HTMLElement);
const fpsStat = requireElement("curve-motion-stat-fps", HTMLElement);
const statusElement = requireElement("curve-motion-status", HTMLElement);
const operationButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".curve-motion [data-operation]"));

bindRangeOutput(countInput, requireElement("curve-motion-count-output", HTMLOutputElement));
bindRangeOutput(detailInput, requireElement("curve-motion-detail-output", HTMLOutputElement));
bindRangeOutput(
    sizeInput,
    requireElement("curve-motion-size-output", HTMLOutputElement),
    (value) => `${value}%`,
);
bindRangeOutput(
    speedInput,
    requireElement("curve-motion-speed-output", HTMLOutputElement),
    (value) => `${(value / 100).toFixed(1)}×`,
);
bindRangeOutput(
    toleranceInput,
    requireElement("curve-motion-tolerance-output", HTMLOutputElement),
    (value) => (value / 1000).toFixed(3),
);

let operationName: OperationName = "Intersect";
let isPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let ready = false;
let frameId: number | null = null;
let previousFrameTime = 0;
let phase = 0;
let smoothFps = 60;
let solveSamples: number[] = [];

[countInput, detailInput, sizeInput, toleranceInput].forEach((input) => {
    input.addEventListener("input", () => {
        solveSamples = [];
        scheduleDraw();
    });
});
speedInput.addEventListener("input", scheduleDraw);

operationButtons.forEach((button) => {
    button.addEventListener("click", () => {
        operationName = button.dataset.operation as OperationName;
        operationButtons.forEach((candidate) => {
            const active = candidate === button;
            candidate.classList.toggle("is-active", active);
            candidate.setAttribute("aria-pressed", String(active));
        });
        solveSamples = [];
        scheduleDraw();
    });
});

toggleButton.addEventListener("click", () => {
    isPaused = !isPaused;
    previousFrameTime = performance.now();
    updateToggleButton();
    scheduleDraw();
});

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
        isPaused = true;
        updateToggleButton();
        scheduleDraw();
    }
});

const canvasResizeObserver = new ResizeObserver(() => {
    syncCanvasResolution();
    scheduleDraw();
});
canvasResizeObserver.observe(canvas);
syncCanvasResolution();
updateToggleButton();
void run();

async function run(): Promise<void> {
    try {
        await init();
        ready = true;
        previousFrameTime = performance.now();
        scheduleDraw();
    } catch (error) {
        console.error(error);
        statusElement.textContent = "Could not initialize the WebAssembly module.";
        statusElement.classList.add("is-error");
    }
}

function scheduleDraw(): void {
    if (ready && frameId === null) {
        frameId = requestAnimationFrame(draw);
    }
}

function draw(currentTime: number): void {
    frameId = null;
    syncCanvasResolution();

    const elapsed = previousFrameTime === 0 ? 0 : Math.min(100, currentTime - previousFrameTime);
    previousFrameTime = currentTime;
    if (!isPaused) {
        phase += elapsed * 0.00055 * (Number(speedInput.value) / 100);
    }
    if (elapsed > 0) {
        const instantaneousFps = 1000 / elapsed;
        smoothFps += (instantaneousFps - smoothFps) * 0.08;
    }

    let subjectGeometry: CurveGeometry | null = null;
    let clipGeometry: CurveGeometry | null = null;
    let overlay: CurveOverlay | null = null;
    let resultGeometry: CurveGeometry | null = null;

    try {
        const scene = createScene();
        subjectGeometry = buildGeometry(scene.subject);
        clipGeometry = buildGeometry(scene.clip);

        const solveStartedAt = performance.now();
        overlay = new CurveOverlay(subjectGeometry, clipGeometry);
        overlay.setApproximation({angleTolerance: Number(toleranceInput.value) / 1000});
        const scale = overlay.scale();
        const report = overlay.conversionReport();
        resultGeometry = overlay.overlay(selectedOverlayRule(), FillRule.NonZero);
        const solveElapsed = performance.now() - solveStartedAt;
        recordSolveSample(solveElapsed);

        const resultData = resultGeometry.toData();
        drawScene(scene, resultData);
        updateStats(subjectGeometry, clipGeometry, resultGeometry, resultData);

        statusElement.textContent = report.hasDegeneracies
            ? `Scale ${formatScale(scale)} · conversion reported degeneracies`
            : `Scale ${formatScale(scale)} · conversion clean`;
        statusElement.classList.toggle("is-warning", report.hasDegeneracies);
        statusElement.classList.remove("is-error");
    } catch (error) {
        console.error(error);
        statusElement.textContent = error instanceof Error ? error.message : "Curve operation failed.";
        statusElement.classList.add("is-error");
    } finally {
        resultGeometry?.free();
        overlay?.free();
        clipGeometry?.free();
        subjectGeometry?.free();
    }

    if (!isPaused) {
        scheduleDraw();
    }
}

function createScene(): {subject: CubicContour[]; clip: CubicContour[]} {
    const count = Number(countInput.value);
    const segmentCount = Number(detailInput.value);
    const size = Number(sizeInput.value) / 100;
    const columns = Math.ceil(Math.sqrt(count * WIDTH / HEIGHT));
    const rows = Math.ceil(count / columns);
    const cellWidth = (WIDTH - 64) / columns;
    const cellHeight = (HEIGHT - 64) / rows;
    const baseRadius = Math.min(190, Math.min(cellWidth, cellHeight) * 0.36 * size);
    const subject: CubicContour[] = [];
    const clip: CubicContour[] = [];

    for (let index = 0; index < count; index += 1) {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const centerX = 32 + cellWidth * (column + 0.5);
        const centerY = 32 + cellHeight * (row + 0.5);
        const seed = index * GOLDEN_ANGLE;
        const orbit = baseRadius * 0.2;
        const orbitX = Math.cos(phase * 1.23 + seed) * orbit;
        const orbitY = Math.sin(phase * 0.91 + seed * 1.7) * orbit * 0.65;
        const lobes = 3 + index % 5;

        subject.push(createBlob(
            centerX + orbitX,
            centerY + orbitY,
            baseRadius,
            baseRadius * (0.84 + 0.05 * Math.sin(seed)),
            segmentCount,
            lobes,
            phase * 1.7 + seed,
            0.11,
        ));
        clip.push(createBlob(
            centerX - orbitX,
            centerY - orbitY,
            baseRadius * 0.92,
            baseRadius * (0.88 + 0.04 * Math.cos(seed)),
            segmentCount,
            lobes + 1,
            -phase * 1.45 + seed * 0.73,
            0.095,
        ));
    }

    return {subject, clip};
}

function createBlob(
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    segmentCount: number,
    lobes: number,
    radialPhase: number,
    ripple: number,
): CubicContour {
    const step = TWO_PI / segmentCount;
    const samples = Array.from({length: segmentCount}, (_, index) => {
        const angle = index * step;
        return blobSample(centerX, centerY, radiusX, radiusY, lobes, radialPhase, ripple, angle);
    });
    const segments: CubicSegment[] = [];

    for (let index = 0; index < segmentCount; index += 1) {
        const current = samples[index];
        const next = samples[(index + 1) % segmentCount];
        segments.push({
            ctrl0: [current.point[0] + current.derivative[0] * step / 3, current.point[1] + current.derivative[1] * step / 3],
            ctrl1: [next.point[0] - next.derivative[0] * step / 3, next.point[1] - next.derivative[1] * step / 3],
            to: next.point,
        });
    }

    return {start: samples[0].point, segments};
}

function blobSample(
    centerX: number,
    centerY: number,
    radiusX: number,
    radiusY: number,
    lobes: number,
    radialPhase: number,
    ripple: number,
    angle: number,
): {point: Point; derivative: Point} {
    const secondaryLobes = lobes + 2;
    const wave = 1
        + ripple * Math.sin(lobes * angle + radialPhase)
        + ripple * 0.35 * Math.sin(secondaryLobes * angle - radialPhase * 0.7);
    const waveDerivative = ripple * lobes * Math.cos(lobes * angle + radialPhase)
        + ripple * 0.35 * secondaryLobes * Math.cos(secondaryLobes * angle - radialPhase * 0.7);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        point: [centerX + radiusX * wave * cos, centerY + radiusY * wave * sin],
        derivative: [
            radiusX * (waveDerivative * cos - wave * sin),
            radiusY * (waveDerivative * sin + wave * cos),
        ],
    };
}

function buildGeometry(contours: CubicContour[]): CurveGeometry {
    const builder = new CurveBuilder();
    try {
        contours.forEach((contour) => {
            builder.moveTo(...contour.start);
            contour.segments.forEach((segment) => {
                builder.bezierCurveTo(...segment.ctrl0, ...segment.ctrl1, ...segment.to);
            });
            builder.closeContour();
        });
        return builder.build();
    } finally {
        builder.free();
    }
}

function drawScene(scene: {subject: CubicContour[]; clip: CubicContour[]}, result: CurveShapesData): void {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawBackground();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    drawInputContours(scene.subject, "rgba(249, 115, 22, 0.055)", "rgba(234, 88, 12, 0.68)");
    drawInputContours(scene.clip, "rgba(37, 99, 235, 0.05)", "rgba(37, 99, 235, 0.66)");

    result.forEach((shape) => {
        const path = curveShapeToPath(shape);
        ctx.fillStyle = "rgba(16, 185, 129, 0.26)";
        ctx.strokeStyle = "#047857";
        ctx.lineWidth = 1.65;
        ctx.setLineDash([]);
        ctx.fill(path, "nonzero");
        ctx.stroke(path);
    });
}

function drawBackground(): void {
    const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, "#f8fafc");
    gradient.addColorStop(1, "#eef2ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.beginPath();
    for (let x = 20; x < WIDTH; x += 40) {
        for (let y = 20; y < HEIGHT; y += 40) {
            ctx.moveTo(x + 1, y);
            ctx.arc(x, y, 1, 0, TWO_PI);
        }
    }
    ctx.fillStyle = "rgba(100, 116, 139, 0.15)";
    ctx.fill();
}

function drawInputContours(contours: CubicContour[], fill: string, stroke: string): void {
    const path = new Path2D();
    contours.forEach((contour) => addCubicContour(path, contour));
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.8;
    ctx.setLineDash([5, 5]);
    ctx.fill(path, "nonzero");
    ctx.stroke(path);
}

function addCubicContour(path: Path2D, contour: CubicContour): void {
    path.moveTo(...contour.start);
    contour.segments.forEach((segment) => {
        path.bezierCurveTo(...segment.ctrl0, ...segment.ctrl1, ...segment.to);
    });
    path.closePath();
}

function curveShapeToPath(shape: CurveShapeData): Path2D {
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
                    const {ellipse, startAngle, sweepAngle} = segment.arc;
                    path.ellipse(
                        ellipse.center[0],
                        ellipse.center[1],
                        ellipse.radiusX,
                        ellipse.radiusY,
                        ellipse.rotation,
                        startAngle,
                        startAngle + sweepAngle,
                        sweepAngle < 0,
                    );
                    break;
                }
            }
        });
        path.closePath();
    });
    return path;
}

function updateStats(
    subject: CurveGeometry,
    clip: CurveGeometry,
    result: CurveGeometry,
    resultData: CurveShapesData,
): void {
    const curvedSegments = countCurvedSegments(resultData);
    inputStat.textContent = `${subject.contourCount + clip.contourCount} contours · ${subject.segmentCount + clip.segmentCount} seg`;
    resultStat.textContent = `${result.contourCount} contours · ${curvedSegments}/${result.segmentCount} curved`;
    medianStat.textContent = `${percentile(solveSamples, 0.5).toFixed(2)} ms`;
    p95Stat.textContent = `${percentile(solveSamples, 0.95).toFixed(2)} ms`;
    fpsStat.textContent = isPaused ? "Paused" : `${Math.min(999, smoothFps).toFixed(0)} FPS`;
}

function countCurvedSegments(shapes: CurveShapesData): number {
    let count = 0;
    shapes.forEach((shape) => {
        shape.forEach((contour) => {
            contour.segments.forEach((segment) => {
                if (segment.type !== "line") {
                    count += 1;
                }
            });
        });
    });
    return count;
}

function recordSolveSample(value: number): void {
    solveSamples.push(value);
    if (solveSamples.length > SAMPLE_LIMIT) {
        solveSamples.shift();
    }
}

function percentile(values: number[], fraction: number): number {
    if (values.length === 0) {
        return 0;
    }
    const sorted = [...values].sort((a, b) => a - b);
    return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * fraction))];
}

function selectedOverlayRule(): OverlayRule {
    return OverlayRule[operationName];
}

function updateToggleButton(): void {
    toggleButton.textContent = isPaused ? "Resume" : "Pause";
    toggleButton.setAttribute("aria-pressed", String(isPaused));
}

function formatScale(scale: number): string {
    return scale >= 1000 ? scale.toExponential(2) : scale.toFixed(2);
}

function syncCanvasResolution(): void {
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
