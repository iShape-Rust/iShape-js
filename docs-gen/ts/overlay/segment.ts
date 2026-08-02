import { Vector } from "../geometry/vector.js";

export interface SegmentLink {
    ax: number;
    ay: number;
    bx: number;
    by: number;
}

export class Segment {
    readonly start: Vector;
    readonly end: Vector;

    constructor(link: SegmentLink) {
        this.start = new Vector(link.ax, link.ay);
        this.end = new Vector(link.bx, link.by);
    }

    get subjTopPos(): Vector {
        return this.labelPosition(6, 4);
    }

    get subjBottomPos(): Vector {
        return this.labelPosition(-6, 4);
    }

    get clipTopPos(): Vector {
        return this.labelPosition(6, -4);
    }

    get clipBottomPos(): Vector {
        return this.labelPosition(-6, -4);
    }

    private labelPosition(normalOffset: number, tangentOffset: number): Vector {
        const tangent = this.start.sub(this.end).normalized();
        const normal = tangent.perpendicular().negated();
        const midpoint = this.start.lerp(this.end, 0.5);

        return midpoint
            .add(normal.scale(normalOffset))
            .add(tangent.scale(tangentOffset));
    }
}
