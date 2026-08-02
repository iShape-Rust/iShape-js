import type {Point} from "../geometry/vector.js";

export function findNearestPoint<T extends Point>(
    points: readonly T[],
    x: number,
    y: number,
    radius: number,
): T | null {
    let nearest: T | null = null;
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

export function clampPoint(
    point: Point,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
): Point {
    return [
        Math.max(minX, Math.min(point[0], maxX)),
        Math.max(minY, Math.min(point[1], maxY)),
    ];
}
