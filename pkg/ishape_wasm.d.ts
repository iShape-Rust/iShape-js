/* tslint:disable */
/* eslint-disable */
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
export enum OverlayRule {
  Subject = 0,
  Clip = 1,
  Intersect = 2,
  Union = 3,
  Difference = 4,
  InverseDifference = 5,
  Xor = 6,
}
export enum ShapeType {
  Subject = 0,
  Clip = 1,
}
export class Delaunay {
  private constructor();
  free(): void;
  to_triangulation(): any;
}
export class OutlineBuilder {
  private constructor();
  free(): void;
  static with_style(style: OutlineStyle): OutlineBuilder;
  build(path_js: any): any;
  style: OutlineStyle;
}
export class OutlineStyle {
  free(): void;
  constructor();
  join: LineJoin;
  outer_offset: number;
  inner_offset: number;
  round_angle: number;
  miter_limit: number;
}
export class Overlay {
  private constructor();
  free(): void;
  static new_with_subj_and_clip(subj_js: any, clip_js: any): Overlay | undefined;
  overlay(overlay_rule: OverlayRule, fill_rule: FillRule): any;
  separate_vectors(fill_rule: FillRule): any;
}
export class RawTriangulation {
  private constructor();
  free(): void;
  to_triangulation(): any;
  into_delaunay(): Delaunay;
}
export class StrokeBuilder {
  private constructor();
  free(): void;
  static with_style(style: StrokeStyle): StrokeBuilder;
  build(path_js: any, is_closed_path: boolean): any;
  style: StrokeStyle;
}
export class StrokeStyle {
  free(): void;
  constructor();
  set_width(width: number): void;
  get_width(): number;
  get_line_join(): LineJoin;
  set_line_join(join: LineJoin): void;
  set_round_angle(angle: number): void;
  set_miter_limit(limit: number): void;
  get_start_cap(): LineCap;
  set_start_cap(cap: LineCap): void;
  get_end_cap(): LineCap;
  set_end_cap(cap: LineCap): void;
  start_cap: LineCap;
  end_cap: LineCap;
  join: LineJoin;
  width: number;
  round_angle: number;
  miter_limit: number;
}
export class Triangulator {
  free(): void;
  constructor();
  triangulate(path_js: any): RawTriangulation;
  triangulate_with_points(path_js: any, points_js: any): RawTriangulation;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_delaunay_free: (a: number, b: number) => void;
  readonly __wbg_triangulator_free: (a: number, b: number) => void;
  readonly triangulator_create: () => number;
  readonly triangulator_triangulate: (a: number, b: any) => number;
  readonly triangulator_triangulate_with_points: (a: number, b: any, c: any) => number;
  readonly rawtriangulation_to_triangulation: (a: number) => any;
  readonly rawtriangulation_into_delaunay: (a: number) => number;
  readonly delaunay_to_triangulation: (a: number) => any;
  readonly __wbg_strokebuilder_free: (a: number, b: number) => void;
  readonly __wbg_get_strokebuilder_style: (a: number) => number;
  readonly __wbg_set_strokebuilder_style: (a: number, b: number) => void;
  readonly __wbg_outlinebuilder_free: (a: number, b: number) => void;
  readonly __wbg_get_outlinebuilder_style: (a: number) => number;
  readonly __wbg_set_outlinebuilder_style: (a: number, b: number) => void;
  readonly strokebuilder_with_style: (a: number) => number;
  readonly strokebuilder_build: (a: number, b: any, c: number) => any;
  readonly outlinebuilder_with_style: (a: number) => number;
  readonly outlinebuilder_build: (a: number, b: any) => any;
  readonly __wbg_overlay_free: (a: number, b: number) => void;
  readonly overlay_new_with_subj_and_clip: (a: any, b: any) => number;
  readonly overlay_overlay: (a: number, b: number, c: number) => any;
  readonly overlay_separate_vectors: (a: number, b: number) => any;
  readonly __wbg_get_strokestyle_start_cap: (a: number) => number;
  readonly __wbg_set_strokestyle_start_cap: (a: number, b: number) => void;
  readonly __wbg_get_strokestyle_end_cap: (a: number) => number;
  readonly __wbg_set_strokestyle_end_cap: (a: number, b: number) => void;
  readonly __wbg_get_strokestyle_join: (a: number) => number;
  readonly __wbg_set_strokestyle_join: (a: number, b: number) => void;
  readonly __wbg_get_outlinestyle_join: (a: number) => number;
  readonly __wbg_set_outlinestyle_join: (a: number, b: number) => void;
  readonly __wbg_get_outlinestyle_outer_offset: (a: number) => number;
  readonly __wbg_set_outlinestyle_outer_offset: (a: number, b: number) => void;
  readonly __wbg_get_outlinestyle_inner_offset: (a: number) => number;
  readonly __wbg_set_outlinestyle_inner_offset: (a: number, b: number) => void;
  readonly __wbg_get_outlinestyle_round_angle: (a: number) => number;
  readonly __wbg_set_outlinestyle_round_angle: (a: number, b: number) => void;
  readonly __wbg_get_outlinestyle_miter_limit: (a: number) => number;
  readonly __wbg_set_outlinestyle_miter_limit: (a: number, b: number) => void;
  readonly strokestyle_create: () => number;
  readonly strokestyle_set_width: (a: number, b: number) => void;
  readonly strokestyle_get_width: (a: number) => number;
  readonly strokestyle_get_line_join: (a: number) => number;
  readonly strokestyle_set_line_join: (a: number, b: number) => void;
  readonly strokestyle_set_round_angle: (a: number, b: number) => void;
  readonly strokestyle_set_miter_limit: (a: number, b: number) => void;
  readonly strokestyle_get_start_cap: (a: number) => number;
  readonly strokestyle_set_start_cap: (a: number, b: number) => void;
  readonly strokestyle_get_end_cap: (a: number) => number;
  readonly strokestyle_set_end_cap: (a: number, b: number) => void;
  readonly outlinestyle_create: () => number;
  readonly __wbg_get_strokestyle_width: (a: number) => number;
  readonly __wbg_get_strokestyle_round_angle: (a: number) => number;
  readonly __wbg_get_strokestyle_miter_limit: (a: number) => number;
  readonly __wbg_rawtriangulation_free: (a: number, b: number) => void;
  readonly __wbg_set_strokestyle_width: (a: number, b: number) => void;
  readonly __wbg_set_strokestyle_round_angle: (a: number, b: number) => void;
  readonly __wbg_set_strokestyle_miter_limit: (a: number, b: number) => void;
  readonly __wbg_outlinestyle_free: (a: number, b: number) => void;
  readonly __wbg_strokestyle_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
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
