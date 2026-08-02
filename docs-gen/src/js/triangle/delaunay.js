import { Vector } from "../geometry/vector.js";
(() => {
    const canvasElement = document.getElementById("delaunayCanvas");
    if (!(canvasElement instanceof HTMLCanvasElement)) {
        throw new Error("Canvas #delaunayCanvas was not found");
    }
    const context = canvasElement.getContext("2d");
    if (context === null) {
        throw new Error("Canvas 2D context is unavailable");
    }
    const canvas = canvasElement;
    const ctx = context;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const twoPI = 2 * Math.PI;
    let selectedPoint = null;
    let candidatePoint = null;
    let isMousePressed = false;
    let palette = readPalette();
    const points = [
        [250, 450],
        [100, 250],
        [350, 50],
        [450, 250],
    ];
    const pixelRatio = window.devicePixelRatio;
    if (pixelRatio > 1) {
        canvas.width = canvasWidth * pixelRatio;
        canvas.height = canvasHeight * pixelRatio;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx.scale(pixelRatio, pixelRatio);
    }
    const themeObserver = new MutationObserver(() => {
        palette = readPalette();
        requestAnimationFrame(draw);
    });
    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });
    requestAnimationFrame(draw);
    canvas.addEventListener("touchstart", (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        if (touch !== undefined) {
            pressDown(touch.clientX, touch.clientY);
        }
    });
    canvas.addEventListener("touchmove", (event) => {
        event.preventDefault();
        const touch = event.touches[0];
        if (touch !== undefined) {
            move(touch.clientX, touch.clientY);
        }
    });
    canvas.addEventListener("touchend", (event) => {
        event.preventDefault();
        selectedPoint = null;
        isMousePressed = false;
    });
    canvas.addEventListener("mousedown", (event) => {
        pressDown(event.clientX, event.clientY);
    });
    canvas.addEventListener("mousemove", (event) => {
        move(event.clientX, event.clientY);
    });
    canvas.addEventListener("mouseup", () => {
        selectedPoint = null;
        isMousePressed = false;
    });
    canvas.addEventListener("mouseout", () => {
        selectedPoint = null;
        candidatePoint = null;
        isMousePressed = false;
        requestAnimationFrame(draw);
    });
    function pressDown(eventX, eventY) {
        const bounds = canvas.getBoundingClientRect();
        const x = eventX - bounds.left;
        const y = eventY - bounds.top;
        isMousePressed = true;
        selectedPoint = findPoint(x, y);
        candidatePoint = null;
    }
    function move(eventX, eventY) {
        const bounds = canvas.getBoundingClientRect();
        const x = eventX - bounds.left;
        const y = eventY - bounds.top;
        if (isMousePressed) {
            if (selectedPoint !== null) {
                const rect = workingArea();
                selectedPoint[0] = Math.max(Math.min(x, rect.maxX), rect.minX);
                selectedPoint[1] = Math.max(Math.min(y, rect.maxY), rect.minY);
                requestAnimationFrame(draw);
            }
        }
        else {
            const wasCandidate = candidatePoint !== null;
            candidatePoint = findPoint(x, y);
            if (candidatePoint !== null) {
                requestAnimationFrame(draw);
                return;
            }
            if (wasCandidate) {
                requestAnimationFrame(draw);
            }
        }
    }
    function findPoint(x, y) {
        for (const point of points) {
            const [pointX, pointY] = point;
            if (Math.abs(pointX - x) < 10 && Math.abs(pointY - y) < 10) {
                return point;
            }
        }
        return null;
    }
    function draw() {
        const [point0, point1, point2, point3] = points;
        const alpha = angle(point1, point3, point0);
        const beta = angle(point1, point3, point2);
        const condition = alpha.angle + beta.angle < 180;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "#00000000";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        if (selectedPoint !== null) {
            drawPoint(ctx, 5, selectedPoint, palette.accent);
        }
        if (candidatePoint !== null) {
            drawPoint(ctx, 7, candidatePoint, palette.accent);
        }
        drawCircle(ctx);
        drawTriangles(ctx, condition);
        drawAngles(ctx, alpha, beta, condition);
    }
    function drawPoint(context, radius, point, color) {
        context.fillStyle = color;
        context.beginPath();
        context.arc(point[0], point[1], radius, 0, twoPI);
        context.fill();
    }
    function drawTriangles(context, condition) {
        const [point0, point1, point2, point3] = points;
        context.fillStyle = palette.fill;
        context.strokeStyle = palette.primary;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(point0[0], point0[1]);
        context.lineTo(point1[0], point1[1]);
        context.lineTo(point2[0], point2[1]);
        context.lineTo(point3[0], point3[1]);
        context.closePath();
        context.stroke();
        context.fill();
        context.setLineDash([12, 8]);
        context.beginPath();
        if (condition) {
            context.moveTo(point1[0], point1[1]);
            context.lineTo(point3[0], point3[1]);
        }
        else {
            context.moveTo(point0[0], point0[1]);
            context.lineTo(point2[0], point2[1]);
        }
        context.stroke();
        context.setLineDash([]);
    }
    function workingArea() {
        return {
            minX: 50,
            minY: 50,
            maxX: canvasWidth - 50,
            maxY: canvasHeight - 50,
        };
    }
    function drawCircle(context) {
        const [, point1, point2, point3] = points;
        const [ax, ay] = point1;
        const [bx, by] = point2;
        const [cx, cy] = point3;
        const magnitudeA = ax * ax + ay * ay;
        const magnitudeB = bx * bx + by * by;
        const magnitudeC = cx * cx + cy * cy;
        const denominator = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
        const x = (magnitudeA * (by - cy) + magnitudeB * (cy - ay) + magnitudeC * (ay - by)) /
            denominator;
        const y = (magnitudeA * (cx - bx) + magnitudeB * (ax - cx) + magnitudeC * (bx - ax)) /
            denominator;
        const radius = Math.hypot(ax - x, ay - y);
        context.strokeStyle = palette.guide;
        context.lineWidth = 2;
        context.setLineDash([12, 8]);
        context.beginPath();
        context.arc(x, y, radius, 0, twoPI);
        context.stroke();
        context.setLineDash([]);
    }
    function drawAngles(context, alpha, beta, condition) {
        context.fillStyle = condition ? palette.success : palette.danger;
        context.beginPath();
        context.arc(alpha.px, alpha.py, 30, alpha.startAngle, alpha.endAngle);
        context.stroke();
        context.beginPath();
        context.arc(beta.px, beta.py, 30, beta.endAngle, beta.startAngle);
        context.stroke();
        context.font = "26px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(alpha.angle.toFixed(1), alpha.x, alpha.y);
        context.fillText(beta.angle.toFixed(1), beta.x, beta.y);
        const rect = workingArea();
        const angleSum = (beta.angle + alpha.angle).toFixed(0);
        context.fillText(`α + β = ${angleSum}`, 0.5 * rect.maxX + 30, rect.maxY + 30);
    }
    function readPalette() {
        const styles = getComputedStyle(canvas);
        return {
            primary: readColor(styles, "--delaunay-primary"),
            guide: readColor(styles, "--delaunay-guide"),
            fill: readColor(styles, "--delaunay-fill"),
            accent: readColor(styles, "--delaunay-accent"),
            success: readColor(styles, "--delaunay-success"),
            danger: readColor(styles, "--delaunay-danger"),
        };
    }
    function readColor(styles, property) {
        const color = styles.getPropertyValue(property).trim();
        if (color.length === 0) {
            throw new Error(`Missing CSS color ${property}`);
        }
        return color;
    }
    function angle(pointA, pointB, origin) {
        const vectorA = Vector.between(origin, pointA);
        const vectorB = Vector.between(origin, pointB);
        const normalizedA = vectorA.normalized();
        const normalizedB = vectorB.normalized();
        const radians = vectorA.angleTo(vectorB);
        const degrees = (radians * 180) / Math.PI;
        const startAngle = Math.atan2(normalizedA.y, normalizedA.x);
        const endAngle = Math.atan2(normalizedB.y, normalizedB.x);
        const center = Vector.fromPoint(origin);
        const labelA = center.add(normalizedA.scale(60));
        const labelB = center.add(normalizedB.scale(60));
        const label = labelA.lerp(labelB, 0.5);
        return {
            x: label.x,
            y: label.y,
            px: origin[0],
            py: origin[1],
            angle: degrees,
            startAngle,
            endAngle,
        };
    }
})();
//# sourceMappingURL=delaunay.js.map