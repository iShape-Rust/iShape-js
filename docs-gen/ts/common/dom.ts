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
