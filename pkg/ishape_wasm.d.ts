/* tslint:disable */
/* eslint-disable */
/**
*/
export enum ShapeType {
  Subject = 0,
  Clip = 1,
}
/**
*/
export enum FillRule {
  EvenOdd = 0,
  NonZero = 1,
}
/**
*/
export enum OverlayRule {
  Subject = 0,
  Clip = 1,
  Intersect = 2,
  Union = 3,
  Difference = 4,
  InverseDifference = 5,
  Xor = 6,
}
/**
*/
export class Overlay {
  free(): void;
/**
*/
  constructor();
/**
* @param {any} js_path
* @param {ShapeType} shape_type
*/
  add_path(js_path: any, shape_type: ShapeType): void;
/**
* @param {any} js_shape
* @param {ShapeType} shape_type
*/
  add_paths(js_shape: any, shape_type: ShapeType): void;
/**
* @param {FillRule} fill_rule
* @returns {OverlayGraph}
*/
  build_graph(fill_rule: FillRule): OverlayGraph;
}
/**
*/
export class OverlayGraph {
  free(): void;
/**
* @param {OverlayRule} overlay_rule
* @returns {any}
*/
  extract_shapes(overlay_rule: OverlayRule): any;
/**
* @param {OverlayRule} overlay_rule
* @param {number} min_area_f64
* @returns {any}
*/
  extract_shapes_min_area(overlay_rule: OverlayRule, min_area_f64: number): any;
/**
* @returns {any}
*/
  links(): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_overlaygraph_free: (a: number) => void;
  readonly overlaygraph_extract_shapes: (a: number, b: number) => number;
  readonly overlaygraph_extract_shapes_min_area: (a: number, b: number, c: number) => number;
  readonly overlaygraph_links: (a: number) => number;
  readonly __wbg_overlay_free: (a: number) => void;
  readonly overlay_create: () => number;
  readonly overlay_add_path: (a: number, b: number, c: number) => void;
  readonly overlay_add_paths: (a: number, b: number, c: number) => void;
  readonly overlay_build_graph: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
