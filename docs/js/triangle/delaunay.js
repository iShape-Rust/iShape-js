const canvas = document.getElementById('delaunayCanvas');
const ctx = canvas.getContext('2d');

const twoPI = 2 * Math.PI;

let selectedPoint = null;
let candidatePoint = null;
let isMousePressed = false;

let mainColor = '#FF7400FF';
let opacColor = '#FF740080';
let fillColor = '#FF740015';

let points = [[250, 450], [100, 250], [350, 50], [450, 250]];

requestAnimationFrame(draw);

canvas.addEventListener('touchstart', function(event) {
    event.preventDefault();
    const touch = event.touches[0];
    pressDown(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
    const touch = event.touches[0];
    move(touch.clientX, touch.clientY);
});

canvas.addEventListener('touchend', function(event) {
    event.preventDefault(); // Prevent click emulation and scrolling
    selectedPoint = null;
    isMousePressed = false;
});

canvas.addEventListener('mousedown', function(event) {
    pressDown(event.clientX, event.clientY);
});

canvas.addEventListener('mousemove', function(event) {
    move(event.clientX, event.clientY);
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

function pressDown(eX, eY) {
    const x = eX - canvas.getBoundingClientRect().left;
    const y = eY - canvas.getBoundingClientRect().top;
  
    isMousePressed = true;

    selectedPoint = findPoint(x, y);
    candidatePoint = null;
  
}

function move(eX, eY) {
    let x = eX - canvas.getBoundingClientRect().left;
    let y = eY - canvas.getBoundingClientRect().top;

    if (isMousePressed) {
        if (selectedPoint !== null) {
            const rect = workingArea();

            selectedPoint[0] = Math.max(Math.min(x, rect.maxX), rect.minX);
            selectedPoint[1] = Math.max(Math.min(y, rect.maxY), rect.minY);
            
            requestAnimationFrame(draw);
        }
    } else {
        const wasCandidate = candidatePoint !== null;

        candidatePoint = findPoint(x, y);
        if (candidatePoint !== null) {
            requestAnimationFrame(draw);
            return;
        }
        

        if (wasCandidate) {
            requestAnimationFrame(draw);
            candidatePoint = null;
        }
    }
}

function findPoint(x, y) {
    for (let point of points) {
        const [px, py] = point;
        if (Math.abs(px - x) < 10 && Math.abs(py - y) < 10) {
            return point;
        }
    }
    
    return null;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (selectedPoint !== null) {
        drawPoint(ctx, 4, selectedPoint, mainColor);
    }

    if (candidatePoint !== null) {
        drawPoint(ctx, 6, candidatePoint, mainColor);
    }

    drawСircle(ctx);
    drawTriangles(ctx);
    drawAngles(ctx);
}

function drawPoint(ctx, r, p, color) {
    ctx.fillStyle = color;
    ctx.lineWidth = null;
    ctx.beginPath();
    ctx.arc(p[0], p[1], r, 0, twoPI);
    ctx.fill();
}

function drawTriangles(ctx) {
    let p0 = points[0];
    let p1 = points[1];
    let p2 = points[2];
    let p3 = points[3];

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.lineTo(p3[0], p3[1]);
    ctx.closePath()
    
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p3[0], p3[1]);

    ctx.stroke();
}

function workingArea() {
    const minX = 50;
    const maxX = canvas.width - 50;
    const maxY = canvas.height - 50;
    const minY = 50;
    return { minX, minY, maxX, maxY };
}

function drawСircle(ctx) {
    const ax = points[1][0];
    const ay = points[1][1];
    const bx = points[2][0];
    const by = points[2][1];
    const cx = points[3][0];
    const cy = points[3][1];

    const ma = ax * ax + ay * ay;
    const mb = bx * bx + by * by;
    const mc = cx * cx + cy * cy;

    const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
    const x = (ma * (by - cy) + mb * (cy - ay) + mc * (ay - by)) / d;
    const y = (ma * (cx - bx) + mb * (ax - cx) + mc * (bx - ax)) / d;
    
    const r = Math.sqrt((ax - x) * (ax - x) + (ay - y) * (ay - y));
    
    ctx.strokeStyle = opacColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 8]);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, twoPI);
    ctx.stroke();
    ctx.setLineDash([]);
}

function drawAngles(ctx) {
    const alpha = angle(points[1], points[3], points[0]);
    const beta = angle(points[1], points[3], points[2]);
 
    if (alpha.angle + beta.angle < 180) {
        ctx.fillStyle = "green";
    } else {
        ctx.fillStyle = "red";
    }

    ctx.beginPath();
    ctx.arc(alpha.px, alpha.py, 30, alpha.startAngle, alpha.endAngle);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(beta.px, beta.py, 30, beta.endAngle, beta.startAngle);

    ctx.stroke();

    ctx.font = "26px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(alpha.angle.toFixed(0), alpha.x, alpha.y);
    ctx.fillText(beta.angle.toFixed(0), beta.x, beta.y);


    const rect = workingArea();

    ctx.fillText("α + β = "+(beta.angle + alpha.angle).toFixed(0), 0.5 * rect.maxX + 30, rect.maxY + 30);

}

function vec(p) {
    return { x: p[0], y: p[1] };
}

function normalize(v) {
    const m = Math.sqrt(v.x ** 2 + v.y ** 2);
    return { x: v.x / m, y: v.y / m };
}

function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y };
}

function sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y };
}

function mul(v, s) {
    return { x: v.x * s, y: v.y * s };
}

function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}

function angle(pa, pb, p) {
    const a = sub(vec(pa), vec(p));
    const b = sub(vec(pb), vec(p));

    const na = normalize(a);
    const nb = normalize(b);

    const rad = Math.acos(dot(na, nb));
    const grad = rad * 180 / Math.PI;

    const startAngle = Math.atan2(na.y, na.x);
    const endAngle = Math.atan2(nb.y, nb.x);

    const la = add(mul(na, 60), vec(p));
    const lb = add(mul(nb, 60), vec(p));

    const x = 0.5 * (la.x + lb.x);
    const y = 0.5 * (la.y + lb.y);

    return { x: x, y: y, px: p[0], py: p[1], angle: grad, startAngle: startAngle, endAngle: endAngle };
}
