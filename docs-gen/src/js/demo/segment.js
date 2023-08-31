function normalize(vector) {
    const magnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
    return { x: vector.x / magnitude, y: vector.y / magnitude };
}

function sub(vectorA, vectorB) {
    return { x: vectorA.x - vectorB.x, y: vectorA.y - vectorB.y };
}

function add(vectorA, vectorB) {
    return { x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y };
}

function mul(vector, scalar) {
    return { x: vector.x * scalar, y: vector.y * scalar };
}

export class Segment {
  constructor(link) {
    this.start = { x: link.ax, y: link.ay };
    this.end = { x: link.bx, y: link.by };
  }

  get subjTopPos() {
    const n = normalize(sub(this.start, this.end));
    const o = { x: n.y, y: -n.x };
    return add(
      mul(add(this.start, this.end), 0.5),
      add(mul(o, 6), mul(n, 4))
    );
  }

  get subjBottomPos() {
    const n = normalize(sub(this.start, this.end));
    const o = { x: -n.y, y: n.x };
    return add(
      mul(add(this.start, this.end), 0.5),
      add(mul(o, 6), mul(n, 4))
    );
  }

  get clipTopPos() {
    const n = normalize(sub(this.start, this.end));
    const o = { x: n.y, y: -n.x };
    return add(
      mul(add(this.start, this.end), 0.5),
      add(mul(o, 6), mul(n, -4))
    );
  }

  get clipBottomPos() {
    const n = normalize(sub(this.start, this.end));
    const o = { x: -n.y, y: n.x };
    return add(
      mul(add(this.start, this.end), 0.5),
      add(mul(o, 6), mul(n, -4))
    );
  }
}