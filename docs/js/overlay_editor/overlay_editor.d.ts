/* tslint:disable */
/* eslint-disable */

export class WebApp {
    free(): void;
    [Symbol.dispose](): void;
    constructor();
    destroy(): void;
    /**
     * Keeps the existing five JSON arguments. Await the returned Promise to report startup errors.
     */
    start(boolean_data: string, string_data: string, stroke_data: string, variable_stroke_data: string, outline_data: string): Promise<void>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_webapp_free: (a: number, b: number) => void;
    readonly webapp_create: () => number;
    readonly webapp_destroy: (a: number) => void;
    readonly webapp_start: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => any;
    readonly wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Function_fn_wasm_bindgen_cd4d31d4f9b3845d___JsValue_____wasm_bindgen_cd4d31d4f9b3845d___sys__Undefined___js_sys_fe22bded58295d21___Function_fn_wasm_bindgen_cd4d31d4f9b3845d___JsValue_____wasm_bindgen_cd4d31d4f9b3845d___sys__Undefined_______true_: (a: number, b: number, c: any, d: any) => void;
    readonly wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___wasm_bindgen_cd4d31d4f9b3845d___JsValue__core_608f92abc48d28da___result__Result_____wasm_bindgen_cd4d31d4f9b3845d___JsError___true_: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___core_608f92abc48d28da___result__Result_____wasm_bindgen_cd4d31d4f9b3845d___JsValue___true_: (a: number, b: number) => [number, number];
    readonly wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Array______true_: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Array______true__7: (a: number, b: number, c: any) => void;
    readonly wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___wasm_bindgen_cd4d31d4f9b3845d___JsValue______true_: (a: number, b: number, c: any) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
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
