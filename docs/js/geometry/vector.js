export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static fromPoint(point) {
        return new Vector(point[0], point[1]);
    }
    static between(from, to) {
        return new Vector(to[0] - from[0], to[1] - from[1]);
    }
    static fromAngle(radians, length = 1) {
        return new Vector(Math.cos(radians) * length, Math.sin(radians) * length);
    }
    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }
    scale(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    divide(scalar) {
        if (scalar === 0) {
            throw new RangeError("Cannot divide a vector by zero");
        }
        return this.scale(1 / scalar);
    }
    negated() {
        return new Vector(-this.x, -this.y);
    }
    dot(other) {
        return this.x * other.x + this.y * other.y;
    }
    cross(other) {
        return this.x * other.y - this.y * other.x;
    }
    get lengthSquared() {
        return this.dot(this);
    }
    get length() {
        return Math.hypot(this.x, this.y);
    }
    normalized() {
        const normalized = this.normalizedOrNull();
        if (normalized === null) {
            throw new RangeError("Cannot normalize a zero-length vector");
        }
        return normalized;
    }
    normalizedOrNull() {
        const length = this.length;
        return length === 0 ? null : this.divide(length);
    }
    distanceSquaredTo(other) {
        return this.sub(other).lengthSquared;
    }
    distanceTo(other) {
        return this.sub(other).length;
    }
    angleTo(other) {
        const denominator = this.length * other.length;
        if (denominator === 0) {
            throw new RangeError("Cannot calculate an angle with a zero-length vector");
        }
        const cosine = this.dot(other) / denominator;
        return Math.acos(Math.max(-1, Math.min(1, cosine)));
    }
    perpendicular() {
        return new Vector(-this.y, this.x);
    }
    lerp(to, ratio) {
        return new Vector(this.x + (to.x - this.x) * ratio, this.y + (to.y - this.y) * ratio);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    almostEquals(other, epsilon = 1e-9) {
        return Math.abs(this.x - other.x) <= epsilon && Math.abs(this.y - other.y) <= epsilon;
    }
    toPoint() {
        return [this.x, this.y];
    }
    toString() {
        return `Vector(${this.x}, ${this.y})`;
    }
}
Vector.ZERO = new Vector(0, 0);
Vector.UNIT_X = new Vector(1, 0);
Vector.UNIT_Y = new Vector(0, 1);
//# sourceMappingURL=vector.js.map