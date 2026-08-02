import type { Point } from "./vector.js";

export type Contour = Point[];
export type Shape = Contour[];
export type Shapes = Shape[];

export interface WorkingArea {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
