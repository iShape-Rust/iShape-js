import type { Point } from "../geometry/vector.js";

type ElementConstructor<T extends Element> = {
    new (): T;
};

export function requireElement<T extends Element>(
    id: string,
    constructor: ElementConstructor<T>,
): T {
    const element = document.getElementById(id);
    if (!(element instanceof constructor)) {
        throw new Error(`Expected #${id} to be a ${constructor.name}`);
    }

    return element;
}

export function requireCanvas2D(id: string): {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
} {
    const canvas = requireElement(id, HTMLCanvasElement);
    const context = canvas.getContext("2d");
    if (context === null) {
        throw new Error(`Canvas #${id} does not support a 2D context`);
    }

    return { canvas, context };
}

export function clientToCanvasPoint(
    canvas: HTMLCanvasElement,
    clientX: number,
    clientY: number,
    backingScale = 1,
): Point {
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) {
        throw new Error(`Canvas #${canvas.id} has no visible size`);
    }

    const logicalWidth = canvas.width / backingScale;
    const logicalHeight = canvas.height / backingScale;

    return [
        (clientX - bounds.left) * logicalWidth / bounds.width,
        (clientY - bounds.top) * logicalHeight / bounds.height,
    ];
}
