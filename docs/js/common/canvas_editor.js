export function findNearestPoint(points, x, y, radius) {
    let nearest = null;
    let nearestDistanceSquared = radius * radius;
    for (const point of points) {
        const dx = point[0] - x;
        const dy = point[1] - y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared <= nearestDistanceSquared) {
            nearest = point;
            nearestDistanceSquared = distanceSquared;
        }
    }
    return nearest;
}
export function clampPoint(point, minX, minY, maxX, maxY) {
    return [
        Math.max(minX, Math.min(point[0], maxX)),
        Math.max(minY, Math.min(point[1], maxY)),
    ];
}
//# sourceMappingURL=canvas_editor.js.map