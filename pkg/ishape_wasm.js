let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * @enum {0 | 1 | 2 | 3}
 */
export const FillRule = Object.freeze({
    EvenOdd: 0, "0": "EvenOdd",
    NonZero: 1, "1": "NonZero",
    Positive: 2, "2": "Positive",
    Negative: 3, "3": "Negative",
});
/**
 * @enum {0 | 1 | 2}
 */
export const LineCap = Object.freeze({
    Butt: 0, "0": "Butt",
    Round: 1, "1": "Round",
    Square: 2, "2": "Square",
});
/**
 * @enum {0 | 1 | 2}
 */
export const LineJoin = Object.freeze({
    Bevel: 0, "0": "Bevel",
    Miter: 1, "1": "Miter",
    Round: 2, "2": "Round",
});
/**
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6}
 */
export const OverlayRule = Object.freeze({
    Subject: 0, "0": "Subject",
    Clip: 1, "1": "Clip",
    Intersect: 2, "2": "Intersect",
    Union: 3, "3": "Union",
    Difference: 4, "4": "Difference",
    InverseDifference: 5, "5": "InverseDifference",
    Xor: 6, "6": "Xor",
});
/**
 * @enum {0 | 1}
 */
export const ShapeType = Object.freeze({
    Subject: 0, "0": "Subject",
    Clip: 1, "1": "Clip",
});

const DelaunayFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_delaunay_free(ptr >>> 0, 1));

export class Delaunay {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Delaunay.prototype);
        obj.__wbg_ptr = ptr;
        DelaunayFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DelaunayFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_delaunay_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    to_triangulation() {
        const ret = wasm.delaunay_to_triangulation(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any}
     */
    to_convex_polygons() {
        const ret = wasm.delaunay_to_convex_polygons(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} min_area
     */
    refine_with_circumcenters(min_area) {
        wasm.delaunay_refine_with_circumcenters(this.__wbg_ptr, min_area);
    }
    /**
     * @param {number} min_area
     */
    refine_with_circumcenters_by_obtuse_angle(min_area) {
        wasm.delaunay_refine_with_circumcenters_by_obtuse_angle(this.__wbg_ptr, min_area);
    }
    /**
     * @param {number} min_area
     * @returns {any}
     */
    to_centroid_net(min_area) {
        const ret = wasm.delaunay_to_centroid_net(this.__wbg_ptr, min_area);
        return ret;
    }
}

const OutlineBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_outlinebuilder_free(ptr >>> 0, 1));

export class OutlineBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OutlineBuilder.prototype);
        obj.__wbg_ptr = ptr;
        OutlineBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OutlineBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_outlinebuilder_free(ptr, 0);
    }
    /**
     * @returns {OutlineStyle}
     */
    get style() {
        const ret = wasm.__wbg_get_outlinebuilder_style(this.__wbg_ptr);
        return OutlineStyle.__wrap(ret);
    }
    /**
     * @param {OutlineStyle} arg0
     */
    set style(arg0) {
        _assertClass(arg0, OutlineStyle);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_outlinebuilder_style(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {OutlineStyle} style
     * @returns {OutlineBuilder}
     */
    static with_style(style) {
        _assertClass(style, OutlineStyle);
        var ptr0 = style.__destroy_into_raw();
        const ret = wasm.outlinebuilder_with_style(ptr0);
        return OutlineBuilder.__wrap(ret);
    }
    /**
     * @param {any} path_js
     * @returns {any}
     */
    build(path_js) {
        const ret = wasm.outlinebuilder_build(this.__wbg_ptr, path_js);
        return ret;
    }
}

const OutlineStyleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_outlinestyle_free(ptr >>> 0, 1));

export class OutlineStyle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OutlineStyle.prototype);
        obj.__wbg_ptr = ptr;
        OutlineStyleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OutlineStyleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_outlinestyle_free(ptr, 0);
    }
    /**
     * @returns {LineJoin}
     */
    get join() {
        const ret = wasm.__wbg_get_outlinestyle_join(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LineJoin} arg0
     */
    set join(arg0) {
        wasm.__wbg_set_outlinestyle_join(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get outer_offset() {
        const ret = wasm.__wbg_get_outlinestyle_outer_offset(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set outer_offset(arg0) {
        wasm.__wbg_set_outlinestyle_outer_offset(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get inner_offset() {
        const ret = wasm.__wbg_get_outlinestyle_inner_offset(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set inner_offset(arg0) {
        wasm.__wbg_set_outlinestyle_inner_offset(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get round_angle() {
        const ret = wasm.__wbg_get_outlinestyle_round_angle(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set round_angle(arg0) {
        wasm.__wbg_set_outlinestyle_round_angle(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get miter_limit() {
        const ret = wasm.__wbg_get_outlinestyle_miter_limit(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set miter_limit(arg0) {
        wasm.__wbg_set_outlinestyle_miter_limit(this.__wbg_ptr, arg0);
    }
    constructor() {
        const ret = wasm.outlinestyle_create();
        this.__wbg_ptr = ret >>> 0;
        OutlineStyleFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const OverlayFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_overlay_free(ptr >>> 0, 1));

export class Overlay {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Overlay.prototype);
        obj.__wbg_ptr = ptr;
        OverlayFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OverlayFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_overlay_free(ptr, 0);
    }
    /**
     * @param {any} subj_js
     * @param {any} clip_js
     * @returns {Overlay | undefined}
     */
    static new_with_subj_and_clip(subj_js, clip_js) {
        const ret = wasm.overlay_new_with_subj_and_clip(subj_js, clip_js);
        return ret === 0 ? undefined : Overlay.__wrap(ret);
    }
    /**
     * @param {OverlayRule} overlay_rule
     * @param {FillRule} fill_rule
     * @returns {any}
     */
    overlay(overlay_rule, fill_rule) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.overlay_overlay(ptr, overlay_rule, fill_rule);
        return ret;
    }
    /**
     * @param {FillRule} fill_rule
     * @returns {any}
     */
    separate_vectors(fill_rule) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.overlay_separate_vectors(ptr, fill_rule);
        return ret;
    }
}

const RawTriangulationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rawtriangulation_free(ptr >>> 0, 1));

export class RawTriangulation {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RawTriangulation.prototype);
        obj.__wbg_ptr = ptr;
        RawTriangulationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RawTriangulationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rawtriangulation_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    to_triangulation() {
        const ret = wasm.rawtriangulation_to_triangulation(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Delaunay}
     */
    into_delaunay() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.rawtriangulation_into_delaunay(ptr);
        return Delaunay.__wrap(ret);
    }
}

const StrokeBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_strokebuilder_free(ptr >>> 0, 1));

export class StrokeBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StrokeBuilder.prototype);
        obj.__wbg_ptr = ptr;
        StrokeBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StrokeBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_strokebuilder_free(ptr, 0);
    }
    /**
     * @returns {StrokeStyle}
     */
    get style() {
        const ret = wasm.__wbg_get_strokebuilder_style(this.__wbg_ptr);
        return StrokeStyle.__wrap(ret);
    }
    /**
     * @param {StrokeStyle} arg0
     */
    set style(arg0) {
        _assertClass(arg0, StrokeStyle);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_strokebuilder_style(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {StrokeStyle} style
     * @returns {StrokeBuilder}
     */
    static with_style(style) {
        _assertClass(style, StrokeStyle);
        var ptr0 = style.__destroy_into_raw();
        const ret = wasm.strokebuilder_with_style(ptr0);
        return StrokeBuilder.__wrap(ret);
    }
    /**
     * @param {any} path_js
     * @param {boolean} is_closed_path
     * @returns {any}
     */
    build(path_js, is_closed_path) {
        const ret = wasm.strokebuilder_build(this.__wbg_ptr, path_js, is_closed_path);
        return ret;
    }
}

const StrokeStyleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_strokestyle_free(ptr >>> 0, 1));

export class StrokeStyle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StrokeStyle.prototype);
        obj.__wbg_ptr = ptr;
        StrokeStyleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StrokeStyleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_strokestyle_free(ptr, 0);
    }
    /**
     * @returns {LineCap}
     */
    get start_cap() {
        const ret = wasm.__wbg_get_strokestyle_start_cap(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LineCap} arg0
     */
    set start_cap(arg0) {
        wasm.__wbg_set_strokestyle_start_cap(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {LineCap}
     */
    get end_cap() {
        const ret = wasm.__wbg_get_strokestyle_end_cap(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LineCap} arg0
     */
    set end_cap(arg0) {
        wasm.__wbg_set_strokestyle_end_cap(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {LineJoin}
     */
    get join() {
        const ret = wasm.__wbg_get_strokestyle_join(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LineJoin} arg0
     */
    set join(arg0) {
        wasm.__wbg_set_strokestyle_join(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get width() {
        const ret = wasm.__wbg_get_outlinestyle_outer_offset(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set width(arg0) {
        wasm.__wbg_set_outlinestyle_outer_offset(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get round_angle() {
        const ret = wasm.__wbg_get_outlinestyle_inner_offset(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set round_angle(arg0) {
        wasm.__wbg_set_outlinestyle_inner_offset(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get miter_limit() {
        const ret = wasm.__wbg_get_outlinestyle_round_angle(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set miter_limit(arg0) {
        wasm.__wbg_set_outlinestyle_round_angle(this.__wbg_ptr, arg0);
    }
    constructor() {
        const ret = wasm.strokestyle_create();
        this.__wbg_ptr = ret >>> 0;
        StrokeStyleFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} width
     */
    set_width(width) {
        wasm.strokestyle_set_width(this.__wbg_ptr, width);
    }
    /**
     * @returns {number}
     */
    get_width() {
        const ret = wasm.strokestyle_get_width(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {LineJoin}
     */
    get_line_join() {
        const ret = wasm.strokestyle_get_line_join(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LineJoin} join
     */
    set_line_join(join) {
        wasm.strokestyle_set_line_join(this.__wbg_ptr, join);
    }
    /**
     * @param {number} angle
     */
    set_round_angle(angle) {
        wasm.strokestyle_set_round_angle(this.__wbg_ptr, angle);
    }
    /**
     * @param {number} limit
     */
    set_miter_limit(limit) {
        wasm.strokestyle_set_miter_limit(this.__wbg_ptr, limit);
    }
    /**
     * @returns {LineCap}
     */
    get_start_cap() {
        const ret = wasm.strokestyle_get_start_cap(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LineCap} cap
     */
    set_start_cap(cap) {
        wasm.strokestyle_set_start_cap(this.__wbg_ptr, cap);
    }
    /**
     * @returns {LineCap}
     */
    get_end_cap() {
        const ret = wasm.strokestyle_get_end_cap(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {LineCap} cap
     */
    set_end_cap(cap) {
        wasm.strokestyle_set_end_cap(this.__wbg_ptr, cap);
    }
}

const TriangulatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_triangulator_free(ptr >>> 0, 1));

export class Triangulator {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TriangulatorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_triangulator_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.triangulator_create();
        this.__wbg_ptr = ret >>> 0;
        TriangulatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} path_js
     * @returns {RawTriangulation}
     */
    triangulate(path_js) {
        const ret = wasm.triangulator_triangulate(this.__wbg_ptr, path_js);
        return RawTriangulation.__wrap(ret);
    }
    /**
     * @param {any} path_js
     * @param {any} points_js
     * @returns {RawTriangulation}
     */
    triangulate_with_points(path_js, points_js) {
        const ret = wasm.triangulator_triangulate_with_points(this.__wbg_ptr, path_js, points_js);
        return RawTriangulation.__wrap(ret);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_done_769e5ede4b31c67b = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_entries_3265d4158b33e5dc = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Map_f3469ce2244d2430 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Map;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_343e2beeeece1bb0 = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbg_iterator_9a24c88df860dc65 = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_78feb108b6472713 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_next_25feadfc0913fea9 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('ishape_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
