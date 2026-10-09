import type {Point} from "../geometry/vector.js";

// CSS owns both theme variants; the dark palette matches overlay_editor.
function color(styles: CSSStyleDeclaration, name: string): string {
    const value = styles.getPropertyValue(`--geometry-${name}`).trim();
    if (!/^#[\da-f]{6}$/i.test(value)) {
        throw new Error(`Expected --geometry-${name} to be a six-digit hex color`);
    }
    return value;
}

function readPalette() {
    const styles = getComputedStyle(document.documentElement);
    return {
        canvas: color(styles, "canvas"),
        border: color(styles, "border"),
        text: color(styles, "text"),
        muted: color(styles, "muted"),
        subject: color(styles, "subject"),
        clip: color(styles, "clip"),
        result: color(styles, "result"),
        accent: color(styles, "accent"),
        warm: color(styles, "warm"),
    };
}

export const geometryPalette = readPalette();
const themeListeners = new Set<() => void>();

export function onGeometryThemeChange(redraw: () => void): void {
    themeListeners.add(redraw);
}

const themeObserver = new MutationObserver(() => {
    const next = readPalette();
    const keys = Object.keys(next) as (keyof typeof next)[];
    if (keys.every((key) => next[key] === geometryPalette[key])) return;
    Object.assign(geometryPalette, next);
    themeListeners.forEach((redraw) => redraw());
});
themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
});

export const geometryStrokeWidth = 2;

export function withOpacity(color: string, opacity: number): string {
    return color + Math.round(Math.max(0, Math.min(1, opacity)) * 255)
        .toString(16).padStart(2, "0");
}

export function clearGeometryCanvas(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
): void {
    context.clearRect(0, 0, width, height);
    context.fillStyle = geometryPalette.canvas;
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.setLineDash([]);
}

export function drawGeometryPoint(
    context: CanvasRenderingContext2D,
    point: Point,
    color: string,
    state: "idle" | "hover" | "active" = "idle",
    control = false,
): void {
    const radius = state === "idle" ? 3.5 : 5;
    const fill = state === "active" ? geometryPalette.accent
        : state === "hover" ? geometryPalette.text : withOpacity(color, 0.65);
    const [x, y] = point;
    context.save();
    context.setLineDash([]);
    context.beginPath();
    context.moveTo(x - radius, y);
    context.lineTo(x, y - radius);
    context.lineTo(x + radius, y);
    context.lineTo(x, y + radius);
    context.closePath();
    context.fillStyle = control && state === "idle" ? geometryPalette.canvas : fill;
    context.strokeStyle = control && state === "idle" ? fill : geometryPalette.canvas;
    context.lineWidth = 1;
    context.fill();
    context.stroke();
    context.restore();
}
