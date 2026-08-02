export type PathCommand =
    | {type: "M" | "L"; x: number; y: number}
    | {type: "Q"; x1: number; y1: number; x: number; y: number}
    | {type: "C"; x1: number; y1: number; x2: number; y2: number; x: number; y: number}
    | {type: "Z"};

export type OpenTypePath = {
    commands: PathCommand[];
};

export type Glyph = {
    index: number;
    advanceWidth?: number;
    getPath(x: number, y: number, fontSize: number): OpenTypePath;
};

export type Font = {
    unitsPerEm: number;
    charToGlyph(character: string): Glyph;
    getAdvanceWidth(text: string, fontSize: number): number;
};

export function parse(buffer: ArrayBuffer): Font;
