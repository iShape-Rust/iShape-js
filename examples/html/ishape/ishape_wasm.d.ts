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
export enum FillRule {
  EvenOdd = 0,
  NonZero = 1,
  Positive = 2,
  Negative = 3,
}
/**
*/
export class Overlay {
  free(): void;
/**
* @param {any} subj_js
* @param {any} clip_js
* @returns {Overlay | undefined}
*/
  static new_with_subj_and_clip(subj_js: any, clip_js: any): Overlay | undefined;
/**
* @param {OverlayRule} overlay_rule
* @param {FillRule} fill_rule
* @returns {any}
*/
  overlay(overlay_rule: OverlayRule, fill_rule: FillRule): any;
/**
* @param {FillRule} fill_rule
* @returns {any}
*/
  separate_vectors(fill_rule: FillRule): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_overlay_free: (a: number, b: number) => void;
  readonly overlay_new_with_subj_and_clip: (a: number, b: number) => number;
  readonly overlay_overlay: (a: number, b: number, c: number) => number;
  readonly overlay_separate_vectors: (a: number, b: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
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
