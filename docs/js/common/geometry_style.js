// CSS owns both theme variants; the dark palette matches overlay_editor.
function color(styles, name) {
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
const themeListeners = new Set();
export function onGeometryThemeChange(redraw) {
    themeListeners.add(redraw);
}
const themeObserver = new MutationObserver(() => {
    const next = readPalette();
    const keys = Object.keys(next);
    if (keys.every((key) => next[key] === geometryPalette[key]))
        return;
    Object.assign(geometryPalette, next);
    themeListeners.forEach((redraw) => redraw());
});
themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
});
export const geometryStrokeWidth = 2;
export function withOpacity(color, opacity) {
    return color + Math.round(Math.max(0, Math.min(1, opacity)) * 255)
        .toString(16).padStart(2, "0");
}
export function clearGeometryCanvas(context, width, height) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = geometryPalette.canvas;
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.setLineDash([]);
}
export function drawGeometryPoint(context, point, color, state = "idle", control = false) {
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
//# sourceMappingURL=geometry_style.js.map