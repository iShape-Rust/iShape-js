export function requireElement(id, constructor) {
    const element = document.getElementById(id);
    if (!(element instanceof constructor)) {
        throw new Error(`Expected #${id} to be a ${constructor.name}`);
    }
    return element;
}
export function requireCanvas2D(id) {
    const canvas = requireElement(id, HTMLCanvasElement);
    const context = canvas.getContext("2d");
    if (context === null) {
        throw new Error(`Canvas #${id} does not support a 2D context`);
    }
    return { canvas, context };
}
//# sourceMappingURL=dom.js.map