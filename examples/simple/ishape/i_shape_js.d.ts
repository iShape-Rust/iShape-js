/* tslint:disable */
/* eslint-disable */
/**
*/
export enum JsFillRule {
  Subject = 0,
  Clip = 1,
  Intersect = 2,
  Union = 3,
  Difference = 4,
  Xor = 5,
}
/**
*/
export enum JsShapeType {
  Subject = 0,
  Clip = 1,
}
/**
*/
export class JsOverlay {
  free(): void;
/**
*/
  constructor();
/**
* @param {any} js_path
* @param {number} js_shape_type
*/
  add_path(js_path: any, js_shape_type: number): void;
/**
* @param {any} js_shape
* @param {number} js_shape_type
*/
  add_shape(js_shape: any, js_shape_type: number): void;
/**
* @returns {JsOverlayGraph}
*/
  build_graph(): JsOverlayGraph;
}
/**
*/
export class JsOverlayGraph {
  free(): void;
/**
* @param {number} js_fill_rule
* @returns {any}
*/
  extract_shapes(js_fill_rule: number): any;
/**
* @param {number} js_fill_rule
* @param {number} min_area_f64
* @returns {any}
*/
  extract_shapes_min_area(js_fill_rule: number, min_area_f64: number): any;
/**
* @returns {any}
*/
  links(): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_jsoverlay_free: (a: number) => void;
  readonly jsoverlay_create: () => number;
  readonly jsoverlay_add_path: (a: number, b: number, c: number) => void;
  readonly jsoverlay_add_shape: (a: number, b: number, c: number) => void;
  readonly jsoverlay_build_graph: (a: number) => number;
  readonly __wbg_jsoverlaygraph_free: (a: number) => void;
  readonly jsoverlaygraph_extract_shapes: (a: number, b: number) => number;
  readonly jsoverlaygraph_extract_shapes_min_area: (a: number, b: number, c: number) => number;
  readonly jsoverlaygraph_links: (a: number) => number;
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
