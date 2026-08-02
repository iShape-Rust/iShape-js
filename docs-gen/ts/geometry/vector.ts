export type Point = [number, number];
export type ReadonlyPoint = readonly [number, number];

export class Vector {
    static readonly ZERO = new Vector(0, 0);
    static readonly UNIT_X = new Vector(1, 0);
    static readonly UNIT_Y = new Vector(0, 1);

    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static fromPoint(point: ReadonlyPoint): Vector {
        return new Vector(point[0], point[1]);
    }

    static between(from: ReadonlyPoint, to: ReadonlyPoint): Vector {
        return new Vector(to[0] - from[0], to[1] - from[1]);
    }

    static fromAngle(radians: number, length = 1): Vector {
        return new Vector(Math.cos(radians) * length, Math.sin(radians) * length);
    }

    add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    sub(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    scale(scalar: number): Vector {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number): Vector {
        if (scalar === 0) {
            throw new RangeError("Cannot divide a vector by zero");
        }

        return this.scale(1 / scalar);
    }

    negated(): Vector {
        return new Vector(-this.x, -this.y);
    }

    dot(other: Vector): number {
        return this.x * other.x + this.y * other.y;
    }

    cross(other: Vector): number {
        return this.x * other.y - this.y * other.x;
    }

    get lengthSquared(): number {
        return this.dot(this);
    }

    get length(): number {
        return Math.hypot(this.x, this.y);
    }

    normalized(): Vector {
        const normalized = this.normalizedOrNull();
        if (normalized === null) {
            throw new RangeError("Cannot normalize a zero-length vector");
        }

        return normalized;
    }

    normalizedOrNull(): Vector | null {
        const length = this.length;
        return length === 0 ? null : this.divide(length);
    }

    distanceSquaredTo(other: Vector): number {
        return this.sub(other).lengthSquared;
    }

    distanceTo(other: Vector): number {
        return this.sub(other).length;
    }

    angleTo(other: Vector): number {
        const denominator = this.length * other.length;
        if (denominator === 0) {
            throw new RangeError("Cannot calculate an angle with a zero-length vector");
        }

        const cosine = this.dot(other) / denominator;
        return Math.acos(Math.max(-1, Math.min(1, cosine)));
    }

    perpendicular(): Vector {
        return new Vector(-this.y, this.x);
    }

    lerp(to: Vector, ratio: number): Vector {
        return new Vector(
            this.x + (to.x - this.x) * ratio,
            this.y + (to.y - this.y) * ratio,
        );
    }

    equals(other: Vector): boolean {
        return this.x === other.x && this.y === other.y;
    }

    almostEquals(other: Vector, epsilon = 1e-9): boolean {
        return Math.abs(this.x - other.x) <= epsilon && Math.abs(this.y - other.y) <= epsilon;
    }

    toPoint(): Point {
        return [this.x, this.y];
    }

    toString(): string {
        return `Vector(${this.x}, ${this.y})`;
    }
}
