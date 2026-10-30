export const minkowskiPresets = [
    { id: "square", name: "Square" },
    { id: "triangle", name: "Triangle" },
    { id: "circle", name: "Circle" },
    { id: "star", name: "Star" },
    { id: "l-shape", name: "L-shape" },
    { id: "frame", name: "Frame with a hole" },
];
function radial(count, radius) {
    return Array.from({ length: count }, (_, index) => {
        const angle = index * 2 * Math.PI / count + Math.PI / 2;
        const r = radius(index);
        return [r * Math.cos(angle), r * Math.sin(angle)];
    });
}
export function createMinkowskiShape(preset, body) {
    let shape;
    switch (preset) {
        case "square":
            shape = [[[-1, -1], [1, -1], [1, 1], [-1, 1]]];
            break;
        case "triangle":
            shape = [[[-0.9, -0.8], [1, -0.5], [-0.35, 1]]];
            break;
        case "circle":
            shape = [radial(24, () => 1)];
            break;
        case "star":
            shape = [radial(10, index => index % 2 === 0 ? 1 : 0.45)];
            break;
        case "l-shape":
            shape = [[[-1, -1], [1, -1], [1, -0.2], [-0.2, -0.2], [-0.2, 1], [-1, 1]]];
            break;
        case "frame":
            shape = [
                [[-1, -1], [1, -1], [1, 1], [-1, 1]],
                [[-0.55, -0.55], [-0.55, 0.55], [0.55, 0.55], [0.55, -0.55]],
            ];
            break;
    }
    const size = body === "a" ? 1.7 : 1.1;
    const x = body === "a" ? -1.8 : 2;
    const y = body === "a" ? 0 : 0.6;
    return shape.map(contour => contour.map(([px, py]) => [x + size * px, y + size * py]));
}
//# sourceMappingURL=minkowski_data.js.map