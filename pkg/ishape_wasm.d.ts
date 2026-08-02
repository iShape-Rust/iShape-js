/* tslint:disable */
/* eslint-disable */

/** A two-dimensional point. */
export type CurvePoint = [number, number];

export type CurveEllipseData = {
    center: CurvePoint;
    radiusX: number;
    radiusY: number;
    rotation: number;
};

/**
 * A rational quadratic arc. Its control points and weights are the
 * authoritative geometry; the ellipse is retained as semantic metadata.
 */
export type RationalArcData = {
    ellipse: CurveEllipseData;
    controlPoints: [CurvePoint, CurvePoint, CurvePoint];
    weights: [number, number, number];
    startAngle: number;
    sweepAngle: number;
};

export type CurveSegmentData =
| { type: "line"; to: CurvePoint }
| { type: "quad"; ctrl: CurvePoint; to: CurvePoint }
| { type: "cubic"; ctrl0: CurvePoint; ctrl1: CurvePoint; to: CurvePoint }
| { type: "arc"; arc: RationalArcData };

export type CurveContourData = {
    start: CurvePoint;
    segments: CurveSegmentData[];
};

export type CurveShapeData = CurveContourData[];
export type CurveShapesData = CurveShapeData[];

export type CurveConversionReport = {
    contourCount: number;
    collapsedContourCount: number;
    collapsedSegmentCount: number;
    linearizedArcCount: number;
    hasDegeneracies: boolean;
};

export type CurveOverlayConversionReport = {
    subject: CurveConversionReport;
    clip?: CurveConversionReport;
    hasDegeneracies: boolean;
};

export type CurveApproximationOptions = {
    /** Absolute minimum accepted chord length in input coordinates. */
    minChordLength?: number;
    /** Maximum sine deviation used for near-linear classification. Default: 0.125. */
    angleTolerance?: number;
    /** Maximum local subdivision depth from 0 through 16. Default: 16. */
    maxDepth?: number;
};



export type PathData = ContourData | ShapeData | ShapesData;
export type ContourData = [number, number][];
export type ShapeData = ContourData[];
export type ShapesData = ShapeData[];

/** The result of triangulation, containing the points and the triangles formed by those points. */
export type TriangulationData = {
    /** Each pair of numbers represents the x and y coordinates of a point. */
    points: [number, number][];
    /** Each group of three numbers represents the indices of the points that form a triangle. */
    indices: number[];
};

export type SeparatedVectors = {
    vectors: {
        ax: number;
        ay: number;
        bx: number;
        by: number;
        fill: number;
    }[]
};


/**
 * Canvas-like builder for reusable closed curve geometry.
 */
export class CurveBuilder {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Adds a complete ellipse as a closed contour.
     */
    addEllipse(x: number, y: number, radiusX: number, radiusY: number, rotation: number, clockwise: boolean): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    /**
     * Builds one shape and resets the builder for reuse after success.
     */
    build(): CurveGeometry;
    closeContour(): void;
    /**
     * Adds an elliptic arc. If no contour is active, its start point is used
     * automatically. Otherwise, the current point must equal the arc start.
     */
    ellipticArcTo(x: number, y: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, sweepAngle: number): void;
    lineTo(x: number, y: number): void;
    /**
     * Starts a new contour. The preceding contour must already be closed.
     */
    moveTo(x: number, y: number): void;
    constructor();
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
}

/**
 * Reusable curve geometry that can contain one or more shapes.
 */
export class CurveGeometry {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Converts this reusable geometry into ordinary JavaScript data.
     */
    toData(): CurveShapesData;
    readonly contourCount: number;
    readonly segmentCount: number;
    readonly shapeCount: number;
}

/**
 * Boolean overlay for reusable curve geometry.
 */
export class CurveOverlay {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Reports geometry collapsed or linearized during conversion.
     */
    conversionReport(): CurveOverlayConversionReport;
    /**
     * Creates a subject-only overlay for resolving its fill rule.
     */
    static fromSubject(subject: CurveGeometry): CurveOverlay;
    /**
     * Creates an overlay with an automatically selected conversion scale.
     */
    constructor(subject: CurveGeometry, clip: CurveGeometry);
    /**
     * Performs the operation. A CurveOverlay is consumed once; the returned
     * CurveGeometry can be used directly in another operation.
     */
    overlay(overlayRule: OverlayRule, fillRule: FillRule): CurveGeometry;
    /**
     * Resolves subject contours using a fill rule. Create this operation with
     * `CurveOverlay.fromSubject()` when no clip geometry is needed.
     */
    resolveSubject(fillRule: FillRule): CurveGeometry;
    /**
     * Returns the effective float-to-integer conversion scale.
     */
    scale(): number;
    /**
     * Configures curve approximation before running the operation.
     */
    setApproximation(options: CurveApproximationOptions): void;
    /**
     * Creates an overlay with an explicit float-to-integer scale.
     */
    static withScale(subject: CurveGeometry, clip: CurveGeometry, scale: number): CurveOverlay;
}

export class Delaunay {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    refine_with_circumcenters(min_area: number): void;
    refine_with_circumcenters_by_obtuse_angle(min_area: number): void;
    to_centroid_net(min_area: number): ShapeData;
    to_convex_polygons(): ShapeData;
    to_triangulation(): TriangulationData;
}

export enum FillRule {
    EvenOdd = 0,
    NonZero = 1,
    Positive = 2,
    Negative = 3,
}

export enum LineCap {
    Butt = 0,
    Round = 1,
    Square = 2,
}

export enum LineJoin {
    Bevel = 0,
    Miter = 1,
    Round = 2,
}

export class OutlineBuilder {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    build(path_js: PathData): ShapesData;
    static with_style(style: OutlineStyle): OutlineBuilder;
    style: OutlineStyle;
}

export class OutlineStyle {
    free(): void;
    [Symbol.dispose](): void;
    constructor();
    inner_offset: number;
    join: LineJoin;
    miter_limit: number;
    outer_offset: number;
    round_angle: number;
}

export class Overlay {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    static new_with_subj_and_clip(subj_js: PathData, clip_js: PathData): Overlay | undefined;
    overlay(overlay_rule: OverlayRule, fill_rule: FillRule): ShapesData;
    separate_vectors(fill_rule: FillRule): SeparatedVectors;
}

export enum OverlayRule {
    Subject = 0,
    Clip = 1,
    Intersect = 2,
    Union = 3,
    Difference = 4,
    InverseDifference = 5,
    Xor = 6,
}

export class RawTriangulation {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    into_delaunay(): Delaunay;
    to_triangulation(): TriangulationData;
}

export enum ShapeType {
    Subject = 0,
    Clip = 1,
}

export class StrokeBuilder {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    build(path_js: PathData, is_closed_path: boolean): ShapesData;
    static with_style(style: StrokeStyle): StrokeBuilder;
    style: StrokeStyle;
}

export class StrokeStyle {
    free(): void;
    [Symbol.dispose](): void;
    constructor();
    get_end_cap(): LineCap;
    get_line_join(): LineJoin;
    get_start_cap(): LineCap;
    get_width(): number;
    set_end_cap(cap: LineCap): void;
    set_line_join(join: LineJoin): void;
    set_miter_limit(limit: number): void;
    set_round_angle(angle: number): void;
    set_start_cap(cap: LineCap): void;
    set_width(width: number): void;
    end_cap: LineCap;
    join: LineJoin;
    miter_limit: number;
    round_angle: number;
    start_cap: LineCap;
    width: number;
}

export class Triangulator {
    free(): void;
    [Symbol.dispose](): void;
    constructor();
    triangulate(path_js: PathData): RawTriangulation;
    triangulate_with_points(path_js: PathData, points_js: ContourData): RawTriangulation;
}

export function simplify(contours_js: PathData, fill_rule: FillRule): ShapesData | undefined;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_curvebuilder_free: (a: number, b: number) => void;
    readonly __wbg_curvegeometry_free: (a: number, b: number) => void;
    readonly __wbg_curveoverlay_free: (a: number, b: number) => void;
    readonly __wbg_delaunay_free: (a: number, b: number) => void;
    readonly __wbg_get_outlinebuilder_style: (a: number) => number;
    readonly __wbg_get_outlinestyle_inner_offset: (a: number) => number;
    readonly __wbg_get_outlinestyle_join: (a: number) => number;
    readonly __wbg_get_outlinestyle_miter_limit: (a: number) => number;
    readonly __wbg_get_outlinestyle_outer_offset: (a: number) => number;
    readonly __wbg_get_outlinestyle_round_angle: (a: number) => number;
    readonly __wbg_get_strokebuilder_style: (a: number) => number;
    readonly __wbg_get_strokestyle_end_cap: (a: number) => number;
    readonly __wbg_get_strokestyle_join: (a: number) => number;
    readonly __wbg_get_strokestyle_start_cap: (a: number) => number;
    readonly __wbg_outlinebuilder_free: (a: number, b: number) => void;
    readonly __wbg_overlay_free: (a: number, b: number) => void;
    readonly __wbg_set_outlinebuilder_style: (a: number, b: number) => void;
    readonly __wbg_set_outlinestyle_inner_offset: (a: number, b: number) => void;
    readonly __wbg_set_outlinestyle_join: (a: number, b: number) => void;
    readonly __wbg_set_outlinestyle_miter_limit: (a: number, b: number) => void;
    readonly __wbg_set_outlinestyle_outer_offset: (a: number, b: number) => void;
    readonly __wbg_set_outlinestyle_round_angle: (a: number, b: number) => void;
    readonly __wbg_set_strokebuilder_style: (a: number, b: number) => void;
    readonly __wbg_set_strokestyle_end_cap: (a: number, b: number) => void;
    readonly __wbg_set_strokestyle_join: (a: number, b: number) => void;
    readonly __wbg_set_strokestyle_start_cap: (a: number, b: number) => void;
    readonly __wbg_strokebuilder_free: (a: number, b: number) => void;
    readonly __wbg_triangulator_free: (a: number, b: number) => void;
    readonly curvebuilder_addEllipse: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly curvebuilder_bezierCurveTo: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly curvebuilder_build: (a: number) => [number, number, number];
    readonly curvebuilder_closeContour: (a: number) => [number, number];
    readonly curvebuilder_ellipticArcTo: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number];
    readonly curvebuilder_lineTo: (a: number, b: number, c: number) => [number, number];
    readonly curvebuilder_moveTo: (a: number, b: number, c: number) => [number, number];
    readonly curvebuilder_new: () => number;
    readonly curvebuilder_quadraticCurveTo: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly curvegeometry_contourCount: (a: number) => number;
    readonly curvegeometry_segmentCount: (a: number) => number;
    readonly curvegeometry_shapeCount: (a: number) => number;
    readonly curvegeometry_toData: (a: number) => any;
    readonly curveoverlay_conversionReport: (a: number) => [number, number, number];
    readonly curveoverlay_fromSubject: (a: number) => number;
    readonly curveoverlay_new: (a: number, b: number) => number;
    readonly curveoverlay_overlay: (a: number, b: number, c: number) => [number, number, number];
    readonly curveoverlay_resolveSubject: (a: number, b: number) => [number, number, number];
    readonly curveoverlay_scale: (a: number) => [number, number, number];
    readonly curveoverlay_setApproximation: (a: number, b: any) => [number, number];
    readonly curveoverlay_withScale: (a: number, b: number, c: number) => [number, number, number];
    readonly delaunay_refine_with_circumcenters: (a: number, b: number) => void;
    readonly delaunay_refine_with_circumcenters_by_obtuse_angle: (a: number, b: number) => void;
    readonly delaunay_to_centroid_net: (a: number, b: number) => any;
    readonly delaunay_to_convex_polygons: (a: number) => any;
    readonly delaunay_to_triangulation: (a: number) => any;
    readonly outlinebuilder_build: (a: number, b: any) => any;
    readonly outlinebuilder_with_style: (a: number) => number;
    readonly outlinestyle_create: () => number;
    readonly overlay_new_with_subj_and_clip: (a: any, b: any) => number;
    readonly overlay_overlay: (a: number, b: number, c: number) => any;
    readonly overlay_separate_vectors: (a: number, b: number) => any;
    readonly rawtriangulation_into_delaunay: (a: number) => number;
    readonly rawtriangulation_to_triangulation: (a: number) => any;
    readonly simplify: (a: any, b: number) => any;
    readonly strokebuilder_build: (a: number, b: any, c: number) => any;
    readonly strokebuilder_with_style: (a: number) => number;
    readonly strokestyle_create: () => number;
    readonly strokestyle_get_end_cap: (a: number) => number;
    readonly strokestyle_get_line_join: (a: number) => number;
    readonly strokestyle_get_start_cap: (a: number) => number;
    readonly strokestyle_get_width: (a: number) => number;
    readonly strokestyle_set_end_cap: (a: number, b: number) => void;
    readonly strokestyle_set_line_join: (a: number, b: number) => void;
    readonly strokestyle_set_miter_limit: (a: number, b: number) => void;
    readonly strokestyle_set_round_angle: (a: number, b: number) => void;
    readonly strokestyle_set_start_cap: (a: number, b: number) => void;
    readonly strokestyle_set_width: (a: number, b: number) => void;
    readonly triangulator_create: () => number;
    readonly triangulator_triangulate: (a: number, b: any) => number;
    readonly triangulator_triangulate_with_points: (a: number, b: any, c: any) => number;
    readonly __wbg_get_strokestyle_miter_limit: (a: number) => number;
    readonly __wbg_get_strokestyle_round_angle: (a: number) => number;
    readonly __wbg_get_strokestyle_width: (a: number) => number;
    readonly __wbg_set_strokestyle_miter_limit: (a: number, b: number) => void;
    readonly __wbg_set_strokestyle_round_angle: (a: number, b: number) => void;
    readonly __wbg_set_strokestyle_width: (a: number, b: number) => void;
    readonly __wbg_outlinestyle_free: (a: number, b: number) => void;
    readonly __wbg_strokestyle_free: (a: number, b: number) => void;
    readonly __wbg_rawtriangulation_free: (a: number, b: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
