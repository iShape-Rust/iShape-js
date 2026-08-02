import { Vector } from "../geometry/vector.js";
export class Segment {
    constructor(link) {
        this.start = new Vector(link.ax, link.ay);
        this.end = new Vector(link.bx, link.by);
    }
    get subjTopPos() {
        return this.labelPosition(6, 4);
    }
    get subjBottomPos() {
        return this.labelPosition(-6, 4);
    }
    get clipTopPos() {
        return this.labelPosition(6, -4);
    }
    get clipBottomPos() {
        return this.labelPosition(-6, -4);
    }
    labelPosition(normalOffset, tangentOffset) {
        const tangent = this.start.sub(this.end).normalized();
        const normal = tangent.perpendicular().negated();
        const midpoint = this.start.lerp(this.end, 0.5);
        return midpoint
            .add(normal.scale(normalOffset))
            .add(tangent.scale(tangentOffset));
    }
}
//# sourceMappingURL=segment.js.map