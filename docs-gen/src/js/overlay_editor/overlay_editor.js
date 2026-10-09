/* @ts-self-types="./overlay_editor.d.ts" */

export class WebApp {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WebAppFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_webapp_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.webapp_create();
        this.__wbg_ptr = ret;
        WebAppFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    destroy() {
        wasm.webapp_destroy(this.__wbg_ptr);
    }
    /**
     * Keeps the existing five JSON arguments. Await the returned Promise to report startup errors.
     * @param {string} boolean_data
     * @param {string} string_data
     * @param {string} stroke_data
     * @param {string} variable_stroke_data
     * @param {string} outline_data
     * @returns {Promise<void>}
     */
    start(boolean_data, string_data, stroke_data, variable_stroke_data, outline_data) {
        const ptr0 = passStringToWasm0(boolean_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(string_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(stroke_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(variable_stroke_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passStringToWasm0(outline_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len4 = WASM_VECTOR_LEN;
        const ret = wasm.webapp_start(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4);
        return ret;
    }
}
if (Symbol.dispose) WebApp.prototype[Symbol.dispose] = WebApp.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Window_a07901001eb4269f: function(arg0) {
            const ret = arg0.Window;
            return ret;
        },
        __wbg_WorkerGlobalScope_d1b9459d53a39f3d: function(arg0) {
            const ret = arg0.WorkerGlobalScope;
            return ret;
        },
        __wbg___wbindgen_boolean_get_7a12af2b3f899c5a: function(arg0) {
            const v = arg0;
            const ret = typeof(v) === 'boolean' ? v : undefined;
            return isLikeNone(ret) ? 0xFFFFFF : ret ? 1 : 0;
        },
        __wbg___wbindgen_debug_string_0e68cf47c9cbd9b0: function(arg0, arg1) {
            const ret = debugString(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_in_50072d4d6e45c193: function(arg0, arg1) {
            const ret = arg0 in arg1;
            return ret;
        },
        __wbg___wbindgen_is_function_fcda5e3902d732fe: function(arg0) {
            const ret = typeof(arg0) === 'function';
            return ret;
        },
        __wbg___wbindgen_is_null_5160b3e381865372: function(arg0) {
            const ret = arg0 === null;
            return ret;
        },
        __wbg___wbindgen_is_undefined_8c687d0b90d5b524: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_number_get_1dc732b810cb937c: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'number' ? obj : undefined;
            getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
        },
        __wbg___wbindgen_string_get_92ab86bb19cbc12f: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_5d9e815e6fdf150f: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg__wbg_cb_unref_997e73d32238e655: function(arg0) {
            arg0._wbg_cb_unref();
        },
        __wbg_activeElement_a40cd04e4e5cfaff: function(arg0) {
            const ret = arg0.activeElement;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_activeElement_de88d64804eca0f5: function(arg0) {
            const ret = arg0.activeElement;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_activeTexture_79f1f4662ee9ed93: function(arg0, arg1) {
            arg0.activeTexture(arg1 >>> 0);
        },
        __wbg_activeTexture_e6dac82eb23d9409: function(arg0, arg1) {
            arg0.activeTexture(arg1 >>> 0);
        },
        __wbg_addEventListener_2f29f3aa43f18e91: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4);
        }, arguments); },
        __wbg_altKey_c75bf4903a5db4c2: function(arg0) {
            const ret = arg0.altKey;
            return ret;
        },
        __wbg_altKey_fa381deee4b395cd: function(arg0) {
            const ret = arg0.altKey;
            return ret;
        },
        __wbg_appendChild_0a61ee9a9da4556f: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.appendChild(arg1);
            return ret;
        }, arguments); },
        __wbg_arrayBuffer_432de2b072afe7fb: function(arg0) {
            const ret = arg0.arrayBuffer();
            return ret;
        },
        __wbg_at_157886d40f709ae7: function(arg0, arg1) {
            const ret = arg0.at(arg1);
            return ret;
        },
        __wbg_attachShader_74ecf95efc73ee58: function(arg0, arg1, arg2) {
            arg0.attachShader(arg1, arg2);
        },
        __wbg_attachShader_bfb57af27e3c4a25: function(arg0, arg1, arg2) {
            arg0.attachShader(arg1, arg2);
        },
        __wbg_beginQuery_8c123fa7e7aec2a4: function(arg0, arg1, arg2) {
            arg0.beginQuery(arg1 >>> 0, arg2);
        },
        __wbg_beginRenderPass_10e1d8bb36f2f74e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.beginRenderPass(arg1);
            return ret;
        }, arguments); },
        __wbg_bindAttribLocation_601c8f14be6021f1: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.bindAttribLocation(arg1, arg2 >>> 0, getStringFromWasm0(arg3, arg4));
        },
        __wbg_bindAttribLocation_f97028966e63a9a0: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.bindAttribLocation(arg1, arg2 >>> 0, getStringFromWasm0(arg3, arg4));
        },
        __wbg_bindBufferRange_34928ebaef37fa71: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.bindBufferRange(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
        },
        __wbg_bindBuffer_24fab2b14c509d6f: function(arg0, arg1, arg2) {
            arg0.bindBuffer(arg1 >>> 0, arg2);
        },
        __wbg_bindBuffer_f1f33e087b91687c: function(arg0, arg1, arg2) {
            arg0.bindBuffer(arg1 >>> 0, arg2);
        },
        __wbg_bindFramebuffer_6c6a9caf742c2cdb: function(arg0, arg1, arg2) {
            arg0.bindFramebuffer(arg1 >>> 0, arg2);
        },
        __wbg_bindFramebuffer_dc00cdd13fca80a8: function(arg0, arg1, arg2) {
            arg0.bindFramebuffer(arg1 >>> 0, arg2);
        },
        __wbg_bindRenderbuffer_27f21bc7608d07e3: function(arg0, arg1, arg2) {
            arg0.bindRenderbuffer(arg1 >>> 0, arg2);
        },
        __wbg_bindRenderbuffer_a5af5373faa4fb14: function(arg0, arg1, arg2) {
            arg0.bindRenderbuffer(arg1 >>> 0, arg2);
        },
        __wbg_bindSampler_06a184f24b4f473a: function(arg0, arg1, arg2) {
            arg0.bindSampler(arg1 >>> 0, arg2);
        },
        __wbg_bindTexture_7858cc136e95ec24: function(arg0, arg1, arg2) {
            arg0.bindTexture(arg1 >>> 0, arg2);
        },
        __wbg_bindTexture_e8a625bf5d240b0f: function(arg0, arg1, arg2) {
            arg0.bindTexture(arg1 >>> 0, arg2);
        },
        __wbg_bindVertexArrayOES_c947f00135eda668: function(arg0, arg1) {
            arg0.bindVertexArrayOES(arg1);
        },
        __wbg_bindVertexArray_4687bb1e8b327fc9: function(arg0, arg1) {
            arg0.bindVertexArray(arg1);
        },
        __wbg_blendColor_25f3208af2a1a86f: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.blendColor(arg1, arg2, arg3, arg4);
        },
        __wbg_blendColor_7b3873c65a61b8a7: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.blendColor(arg1, arg2, arg3, arg4);
        },
        __wbg_blendEquationSeparate_7255a352fb614ccb: function(arg0, arg1, arg2) {
            arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_blendEquationSeparate_a63d5c1a833c1137: function(arg0, arg1, arg2) {
            arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_blendEquation_1636f14afa7d37d0: function(arg0, arg1) {
            arg0.blendEquation(arg1 >>> 0);
        },
        __wbg_blendEquation_9a5ca6936a9438b3: function(arg0, arg1) {
            arg0.blendEquation(arg1 >>> 0);
        },
        __wbg_blendFuncSeparate_1afc51f9c96486b2: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
        },
        __wbg_blendFuncSeparate_222d39ec0d6bb147: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
        },
        __wbg_blendFunc_041c4d7dc50ac8c9: function(arg0, arg1, arg2) {
            arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_blendFunc_ad7d043180d4f86a: function(arg0, arg1, arg2) {
            arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_blitFramebuffer_beb217dd67c23446: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
            arg0.blitFramebuffer(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0);
        },
        __wbg_blockSize_726f0afadf8c1f3f: function(arg0) {
            const ret = arg0.blockSize;
            return ret;
        },
        __wbg_blur_c712b137baa8b295: function() { return handleError(function (arg0) {
            arg0.blur();
        }, arguments); },
        __wbg_body_7d83a19bffb260db: function(arg0) {
            const ret = arg0.body;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_bottom_89fa307d0439be2c: function(arg0) {
            const ret = arg0.bottom;
            return ret;
        },
        __wbg_bufferData_5d0d376bd14d58f3: function(arg0, arg1, arg2, arg3) {
            arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
        },
        __wbg_bufferData_9ce5cb209386d279: function(arg0, arg1, arg2, arg3) {
            arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
        },
        __wbg_bufferData_b58d3ee720ef8b13: function(arg0, arg1, arg2, arg3) {
            arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
        },
        __wbg_bufferData_c074912da5a8e8c2: function(arg0, arg1, arg2, arg3) {
            arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
        },
        __wbg_bufferSubData_1210904a130da787: function(arg0, arg1, arg2, arg3) {
            arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
        },
        __wbg_bufferSubData_bb3556faa77ce63a: function(arg0, arg1, arg2, arg3) {
            arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
        },
        __wbg_button_f6aa74c65b739064: function(arg0) {
            const ret = arg0.button;
            return ret;
        },
        __wbg_call_6bcf8d3e20937e46: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.call(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_cancelAnimationFrame_4fc0f227c45abccf: function() { return handleError(function (arg0, arg1) {
            arg0.cancelAnimationFrame(arg1);
        }, arguments); },
        __wbg_changedTouches_b982f6f6739b3f06: function(arg0) {
            const ret = arg0.changedTouches;
            return ret;
        },
        __wbg_clearBufferfv_5c3233abb46232dd: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.clearBufferfv(arg1 >>> 0, arg2, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_clearBufferiv_a6017e170f127402: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.clearBufferiv(arg1 >>> 0, arg2, getArrayI32FromWasm0(arg3, arg4));
        },
        __wbg_clearBufferuiv_a7ff44fb5a19e886: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.clearBufferuiv(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4));
        },
        __wbg_clearDepth_a4e9a96e0b87fadb: function(arg0, arg1) {
            arg0.clearDepth(arg1);
        },
        __wbg_clearDepth_ea9081c357d405be: function(arg0, arg1) {
            arg0.clearDepth(arg1);
        },
        __wbg_clearInterval_d8d44413537029f6: function(arg0, arg1) {
            arg0.clearInterval(arg1);
        },
        __wbg_clearStencil_8c03daa5a936cf97: function(arg0, arg1) {
            arg0.clearStencil(arg1);
        },
        __wbg_clearStencil_bd3508b2e4a055c8: function(arg0, arg1) {
            arg0.clearStencil(arg1);
        },
        __wbg_clear_55f5d5ab26fe80b4: function(arg0, arg1) {
            arg0.clear(arg1 >>> 0);
        },
        __wbg_clear_faad852996d5b5ca: function(arg0, arg1) {
            arg0.clear(arg1 >>> 0);
        },
        __wbg_clientWaitSync_1e222800321920a4: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.clientWaitSync(arg1, arg2 >>> 0, arg3 >>> 0);
            return ret;
        },
        __wbg_clientX_3cd572a5cd368348: function(arg0) {
            const ret = arg0.clientX;
            return ret;
        },
        __wbg_clientX_997500aa23d483d1: function(arg0) {
            const ret = arg0.clientX;
            return ret;
        },
        __wbg_clientY_4651eed688551d1c: function(arg0) {
            const ret = arg0.clientY;
            return ret;
        },
        __wbg_clientY_52b1b3958eb93e2d: function(arg0) {
            const ret = arg0.clientY;
            return ret;
        },
        __wbg_clipboardData_21dbd4d02fe62f91: function(arg0) {
            const ret = arg0.clipboardData;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_clipboard_e39061ae5482d3b8: function(arg0) {
            const ret = arg0.clipboard;
            return ret;
        },
        __wbg_colorMask_dc6ca7d28d90ca79: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
        },
        __wbg_colorMask_ee5503a19adab893: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
        },
        __wbg_compileShader_cabeb4aa8cb42914: function(arg0, arg1) {
            arg0.compileShader(arg1);
        },
        __wbg_compileShader_dada15a718167c7f: function(arg0, arg1) {
            arg0.compileShader(arg1);
        },
        __wbg_compressedTexSubImage2D_08a73ef1b07eadd4: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
        },
        __wbg_compressedTexSubImage2D_26483f478d06e5b6: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
        },
        __wbg_compressedTexSubImage2D_fd0d06f029b00475: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8, arg9);
        },
        __wbg_compressedTexSubImage3D_916c6fa47a2c6ca4: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
            arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10);
        },
        __wbg_compressedTexSubImage3D_ca08254972ab7956: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
            arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10, arg11);
        },
        __wbg_configure_3d64c677c7d68a15: function() { return handleError(function (arg0, arg1) {
            arg0.configure(arg1);
        }, arguments); },
        __wbg_contentBoxSize_da8ed0423f37fa73: function(arg0) {
            const ret = arg0.contentBoxSize;
            return ret;
        },
        __wbg_contentRect_d4183dcae16ce988: function(arg0) {
            const ret = arg0.contentRect;
            return ret;
        },
        __wbg_copyBufferSubData_4649cb7afad601b3: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.copyBufferSubData(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
        },
        __wbg_copyTexSubImage2D_b5dc78e744bb31d3: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        },
        __wbg_copyTexSubImage2D_f1d2043ea68078f1: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
            arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        },
        __wbg_copyTexSubImage3D_a6674efc4225de77: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.copyTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
        },
        __wbg_copyTextureToBuffer_4186c16aef1922a5: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            arg0.copyTextureToBuffer(arg1, arg2, arg3);
        }, arguments); },
        __wbg_createBindGroupLayout_9ea1a44942aaf13e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createBindGroupLayout(arg1);
            return ret;
        }, arguments); },
        __wbg_createBindGroup_2320df4db188406c: function(arg0, arg1) {
            const ret = arg0.createBindGroup(arg1);
            return ret;
        },
        __wbg_createBuffer_2f08c0205e04efca: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createBuffer(arg1);
            return ret;
        }, arguments); },
        __wbg_createBuffer_77a9a8580e5123cc: function(arg0) {
            const ret = arg0.createBuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createBuffer_b4dd77c6c40a2e87: function(arg0) {
            const ret = arg0.createBuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createCommandEncoder_cd88faca35d9ed68: function(arg0, arg1) {
            const ret = arg0.createCommandEncoder(arg1);
            return ret;
        },
        __wbg_createElement_b9024dc5ba95ac27: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_createFramebuffer_aa440c781a6c7da2: function(arg0) {
            const ret = arg0.createFramebuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createFramebuffer_ac4ca0fc2cfc1bd1: function(arg0) {
            const ret = arg0.createFramebuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createPipelineLayout_7a186f2e9bf0d605: function(arg0, arg1) {
            const ret = arg0.createPipelineLayout(arg1);
            return ret;
        },
        __wbg_createProgram_89a2bb21dab7e222: function(arg0) {
            const ret = arg0.createProgram();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createProgram_e43ace4085d1086d: function(arg0) {
            const ret = arg0.createProgram();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createQuery_731629e292b35522: function(arg0) {
            const ret = arg0.createQuery();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createRenderPipeline_f48187ba9f7701e8: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createRenderPipeline(arg1);
            return ret;
        }, arguments); },
        __wbg_createRenderbuffer_3605e09d07f5a422: function(arg0) {
            const ret = arg0.createRenderbuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createRenderbuffer_42eeb481e4c92ff2: function(arg0) {
            const ret = arg0.createRenderbuffer();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createSampler_248bd67c920af37d: function(arg0, arg1) {
            const ret = arg0.createSampler(arg1);
            return ret;
        },
        __wbg_createSampler_ebfb34feb26878f1: function(arg0) {
            const ret = arg0.createSampler();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createShaderModule_53701de4fb271c90: function(arg0, arg1) {
            const ret = arg0.createShaderModule(arg1);
            return ret;
        },
        __wbg_createShader_4d944e14daceede8: function(arg0, arg1) {
            const ret = arg0.createShader(arg1 >>> 0);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createShader_70a84327b207bda4: function(arg0, arg1) {
            const ret = arg0.createShader(arg1 >>> 0);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createTexture_9e76b80a2dc0d12e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createTexture(arg1);
            return ret;
        }, arguments); },
        __wbg_createTexture_a409a8c7972e99b3: function(arg0) {
            const ret = arg0.createTexture();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createTexture_ecccbb9df64e8c81: function(arg0) {
            const ret = arg0.createTexture();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createVertexArrayOES_083ec6fc6262613d: function(arg0) {
            const ret = arg0.createVertexArrayOES();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createVertexArray_9411e94d2ee6864e: function(arg0) {
            const ret = arg0.createVertexArray();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_createView_cc96b5bdd3d5bf5e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.createView(arg1);
            return ret;
        }, arguments); },
        __wbg_ctrlKey_785e802b8798af13: function(arg0) {
            const ret = arg0.ctrlKey;
            return ret;
        },
        __wbg_ctrlKey_ba07ac4b2ea90600: function(arg0) {
            const ret = arg0.ctrlKey;
            return ret;
        },
        __wbg_cullFace_3e14866a0c370004: function(arg0, arg1) {
            arg0.cullFace(arg1 >>> 0);
        },
        __wbg_cullFace_b64f84debd112644: function(arg0, arg1) {
            arg0.cullFace(arg1 >>> 0);
        },
        __wbg_dataTransfer_9d0a7bfb637e95b6: function(arg0) {
            const ret = arg0.dataTransfer;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_data_3634610ec0d56ca6: function(arg0, arg1) {
            const ret = arg1.data;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_debug_eb092a10b3338acb: function(arg0) {
            console.debug(arg0);
        },
        __wbg_deleteBuffer_54e287dbecb17d6e: function(arg0, arg1) {
            arg0.deleteBuffer(arg1);
        },
        __wbg_deleteBuffer_c9dc22cdbb93ffbc: function(arg0, arg1) {
            arg0.deleteBuffer(arg1);
        },
        __wbg_deleteFramebuffer_6c3b62109b65e8de: function(arg0, arg1) {
            arg0.deleteFramebuffer(arg1);
        },
        __wbg_deleteFramebuffer_977fae88c7df1c6f: function(arg0, arg1) {
            arg0.deleteFramebuffer(arg1);
        },
        __wbg_deleteProgram_16fe8b000141443c: function(arg0, arg1) {
            arg0.deleteProgram(arg1);
        },
        __wbg_deleteProgram_c990794adb74a326: function(arg0, arg1) {
            arg0.deleteProgram(arg1);
        },
        __wbg_deleteQuery_670219eac170c9fb: function(arg0, arg1) {
            arg0.deleteQuery(arg1);
        },
        __wbg_deleteRenderbuffer_1066bd086097d9c0: function(arg0, arg1) {
            arg0.deleteRenderbuffer(arg1);
        },
        __wbg_deleteRenderbuffer_be22a49b59807a79: function(arg0, arg1) {
            arg0.deleteRenderbuffer(arg1);
        },
        __wbg_deleteSampler_a7f5bf9c8096d80a: function(arg0, arg1) {
            arg0.deleteSampler(arg1);
        },
        __wbg_deleteShader_7169f1760153b284: function(arg0, arg1) {
            arg0.deleteShader(arg1);
        },
        __wbg_deleteShader_9b34ccd212c66de7: function(arg0, arg1) {
            arg0.deleteShader(arg1);
        },
        __wbg_deleteSync_5f19ce0564df8ade: function(arg0, arg1) {
            arg0.deleteSync(arg1);
        },
        __wbg_deleteTexture_4cc3a009d8de3629: function(arg0, arg1) {
            arg0.deleteTexture(arg1);
        },
        __wbg_deleteTexture_5f176c5fb10209e7: function(arg0, arg1) {
            arg0.deleteTexture(arg1);
        },
        __wbg_deleteVertexArrayOES_8ddbff0c3c4bd01b: function(arg0, arg1) {
            arg0.deleteVertexArrayOES(arg1);
        },
        __wbg_deleteVertexArray_a810728c9f325e4c: function(arg0, arg1) {
            arg0.deleteVertexArray(arg1);
        },
        __wbg_deltaMode_1f7b0a593ff1ea16: function(arg0) {
            const ret = arg0.deltaMode;
            return ret;
        },
        __wbg_deltaX_948c3a4bd666561a: function(arg0) {
            const ret = arg0.deltaX;
            return ret;
        },
        __wbg_deltaY_635e57899c7ee3a1: function(arg0) {
            const ret = arg0.deltaY;
            return ret;
        },
        __wbg_depthFunc_e3cb63d0ea760f4f: function(arg0, arg1) {
            arg0.depthFunc(arg1 >>> 0);
        },
        __wbg_depthFunc_fc1a3d2fde41ec92: function(arg0, arg1) {
            arg0.depthFunc(arg1 >>> 0);
        },
        __wbg_depthMask_77fed42fc2117471: function(arg0, arg1) {
            arg0.depthMask(arg1 !== 0);
        },
        __wbg_depthMask_e85b064c1ee5147d: function(arg0, arg1) {
            arg0.depthMask(arg1 !== 0);
        },
        __wbg_depthRange_2b6920405cfb1e3d: function(arg0, arg1, arg2) {
            arg0.depthRange(arg1, arg2);
        },
        __wbg_depthRange_6e341dd878a6597d: function(arg0, arg1, arg2) {
            arg0.depthRange(arg1, arg2);
        },
        __wbg_description_18d0a6d4077fec8e: function(arg0, arg1) {
            const ret = arg1.description;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_destroy_6601bc024448d3c7: function(arg0) {
            arg0.destroy();
        },
        __wbg_destroy_b5b39f25f0799295: function(arg0) {
            arg0.destroy();
        },
        __wbg_devicePixelContentBoxSize_b18683fceddaada3: function(arg0) {
            const ret = arg0.devicePixelContentBoxSize;
            return ret;
        },
        __wbg_devicePixelRatio_da557bfb3b99fb02: function(arg0) {
            const ret = arg0.devicePixelRatio;
            return ret;
        },
        __wbg_disableVertexAttribArray_45e2fd394cde8686: function(arg0, arg1) {
            arg0.disableVertexAttribArray(arg1 >>> 0);
        },
        __wbg_disableVertexAttribArray_b985896436c82562: function(arg0, arg1) {
            arg0.disableVertexAttribArray(arg1 >>> 0);
        },
        __wbg_disable_6907c683adc38e04: function(arg0, arg1) {
            arg0.disable(arg1 >>> 0);
        },
        __wbg_disable_71ea0d3d0529f100: function(arg0, arg1) {
            arg0.disable(arg1 >>> 0);
        },
        __wbg_disconnect_cef5c809f09463bb: function(arg0) {
            arg0.disconnect();
        },
        __wbg_document_c7f486c52d63d24e: function(arg0) {
            const ret = arg0.document;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_drawArraysInstancedANGLE_1161faf698564d6d: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.drawArraysInstancedANGLE(arg1 >>> 0, arg2, arg3, arg4);
        },
        __wbg_drawArraysInstanced_0ef1fbcdba111c38: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.drawArraysInstanced(arg1 >>> 0, arg2, arg3, arg4);
        },
        __wbg_drawArrays_983f352c9e94d800: function(arg0, arg1, arg2, arg3) {
            arg0.drawArrays(arg1 >>> 0, arg2, arg3);
        },
        __wbg_drawArrays_bc085b67da45ec03: function(arg0, arg1, arg2, arg3) {
            arg0.drawArrays(arg1 >>> 0, arg2, arg3);
        },
        __wbg_drawBuffersWEBGL_6cfb1b5e064e9ed2: function(arg0, arg1) {
            arg0.drawBuffersWEBGL(arg1);
        },
        __wbg_drawBuffers_9b22ea9d8f6a15f0: function(arg0, arg1) {
            arg0.drawBuffers(arg1);
        },
        __wbg_drawElementsInstancedANGLE_da080f7c11a85ead: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.drawElementsInstancedANGLE(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
        },
        __wbg_drawElementsInstanced_ea7d6b71beea79a4: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
        },
        __wbg_drawIndexed_68637ebab6dd8d6e: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
        },
        __wbg_draw_ad0811de56a2d768: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
        },
        __wbg_elementFromPoint_519b61865fc6f04f: function(arg0, arg1, arg2) {
            const ret = arg0.elementFromPoint(arg1, arg2);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_elementFromPoint_b50845d132176dc3: function(arg0, arg1, arg2) {
            const ret = arg0.elementFromPoint(arg1, arg2);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_enableVertexAttribArray_ad4d8ff487ea8fe1: function(arg0, arg1) {
            arg0.enableVertexAttribArray(arg1 >>> 0);
        },
        __wbg_enableVertexAttribArray_db5eef27f6b32c4a: function(arg0, arg1) {
            arg0.enableVertexAttribArray(arg1 >>> 0);
        },
        __wbg_enable_9fb8e4de75a17155: function(arg0, arg1) {
            arg0.enable(arg1 >>> 0);
        },
        __wbg_enable_9fca6962aca10f48: function(arg0, arg1) {
            arg0.enable(arg1 >>> 0);
        },
        __wbg_endQuery_4eea0267f103b625: function(arg0, arg1) {
            arg0.endQuery(arg1 >>> 0);
        },
        __wbg_end_414453a89205612c: function(arg0) {
            arg0.end();
        },
        __wbg_error_756c5934221e6fee: function(arg0) {
            console.error(arg0);
        },
        __wbg_error_757e9472f8410341: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_error_ea0280009d82f109: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_fenceSync_13999b65854e9b9b: function(arg0, arg1, arg2) {
            const ret = arg0.fenceSync(arg1 >>> 0, arg2 >>> 0);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_files_06af76c704b59946: function(arg0) {
            const ret = arg0.files;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_finish_087cb89c65c06eb1: function(arg0) {
            const ret = arg0.finish();
            return ret;
        },
        __wbg_finish_cfaeede3baf55be1: function(arg0, arg1) {
            const ret = arg0.finish(arg1);
            return ret;
        },
        __wbg_flush_824eea12383b8cca: function(arg0) {
            arg0.flush();
        },
        __wbg_flush_c4a6f752e79bfc53: function(arg0) {
            arg0.flush();
        },
        __wbg_focus_c1b2d4962209010b: function() { return handleError(function (arg0) {
            arg0.focus();
        }, arguments); },
        __wbg_force_a8103dca73d83d62: function(arg0) {
            const ret = arg0.force;
            return ret;
        },
        __wbg_framebufferRenderbuffer_aa5275e6a52dc6bd: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
        },
        __wbg_framebufferRenderbuffer_f5e60406b8ee912e: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
        },
        __wbg_framebufferTexture2D_7a85448ff0ab4b2c: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
        },
        __wbg_framebufferTexture2D_ee6a0d85fd7083aa: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
        },
        __wbg_framebufferTextureLayer_7c877ec2a0f9220b: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.framebufferTextureLayer(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
        },
        __wbg_framebufferTextureMultiviewOVR_64b070ac25c07833: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.framebufferTextureMultiviewOVR(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5, arg6);
        },
        __wbg_frontFace_77f09a7664c8cd54: function(arg0, arg1) {
            arg0.frontFace(arg1 >>> 0);
        },
        __wbg_frontFace_b3888c65efdb32fe: function(arg0, arg1) {
            arg0.frontFace(arg1 >>> 0);
        },
        __wbg_getBindGroupLayout_fb57edd4e8a62514: function(arg0, arg1) {
            const ret = arg0.getBindGroupLayout(arg1 >>> 0);
            return ret;
        },
        __wbg_getBoundingClientRect_299f40f8641457e6: function(arg0) {
            const ret = arg0.getBoundingClientRect();
            return ret;
        },
        __wbg_getBufferSubData_2c901ce3bd14301e: function(arg0, arg1, arg2, arg3) {
            arg0.getBufferSubData(arg1 >>> 0, arg2, arg3);
        },
        __wbg_getComputedStyle_89f9e5c4de4b7edf: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.getComputedStyle(arg1);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getContext_2c75bba1a1c9739b: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2), arg3);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getContext_5ff6bd600503b094: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getContext_db25e9527f2ccc08: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2), arg3);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getContext_e0c05ffee530bdcf: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getCurrentTexture_51975ae7185fd15f: function() { return handleError(function (arg0) {
            const ret = arg0.getCurrentTexture();
            return ret;
        }, arguments); },
        __wbg_getData_b19c87e3887bc0cb: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg1.getData(getStringFromWasm0(arg2, arg3));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_getElementById_ccc92d66acf76819: function(arg0, arg1, arg2) {
            const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_getExtension_112db5d69fdfc10f: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_getIndexedParameter_d4437eb4ad4a0bfa: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getIndexedParameter(arg1 >>> 0, arg2 >>> 0);
            return ret;
        }, arguments); },
        __wbg_getItem_5d579ac5f70ace34: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg1.getItem(getStringFromWasm0(arg2, arg3));
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_getMappedRange_5ed22727c9679168: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.getMappedRange(arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_getParameter_031885c3618c2d0c: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.getParameter(arg1 >>> 0);
            return ret;
        }, arguments); },
        __wbg_getParameter_7f269432cd46eb73: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.getParameter(arg1 >>> 0);
            return ret;
        }, arguments); },
        __wbg_getPreferredCanvasFormat_1b8495aeb1d11ab1: function(arg0) {
            const ret = arg0.getPreferredCanvasFormat();
            return (__wbindgen_enum_GpuTextureFormat.indexOf(ret) + 1 || 96) - 1;
        },
        __wbg_getProgramInfoLog_0e335b65673afba8: function(arg0, arg1, arg2) {
            const ret = arg1.getProgramInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getProgramInfoLog_82aa11c9d7e8d96e: function(arg0, arg1, arg2) {
            const ret = arg1.getProgramInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getProgramParameter_1a93fd2f4dcc0622: function(arg0, arg1, arg2) {
            const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getProgramParameter_2a5860ab824690ec: function(arg0, arg1, arg2) {
            const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getPropertyValue_778f881c5d299730: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            const ret = arg1.getPropertyValue(getStringFromWasm0(arg2, arg3));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_getQueryParameter_145128cfab5de56d: function(arg0, arg1, arg2) {
            const ret = arg0.getQueryParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getRootNode_499b77c43c2bc944: function(arg0) {
            const ret = arg0.getRootNode();
            return ret;
        },
        __wbg_getShaderInfoLog_416aea280f6fdf84: function(arg0, arg1, arg2) {
            const ret = arg1.getShaderInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getShaderInfoLog_e66ab6619bcd208d: function(arg0, arg1, arg2) {
            const ret = arg1.getShaderInfoLog(arg2);
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_getShaderParameter_b19fb6adcff77066: function(arg0, arg1, arg2) {
            const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getShaderParameter_d542b1412563ae42: function(arg0, arg1, arg2) {
            const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getSupportedExtensions_67cde11dd49cad1a: function(arg0) {
            const ret = arg0.getSupportedExtensions();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_getSupportedProfiles_abd53cd63178e1e0: function(arg0) {
            const ret = arg0.getSupportedProfiles();
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_getSyncParameter_f4eeca8570f06af5: function(arg0, arg1, arg2) {
            const ret = arg0.getSyncParameter(arg1, arg2 >>> 0);
            return ret;
        },
        __wbg_getUniformBlockIndex_db57fe2d6ed6af2a: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.getUniformBlockIndex(arg1, getStringFromWasm0(arg2, arg3));
            return ret;
        },
        __wbg_getUniformLocation_03b9677a8f868582: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_getUniformLocation_20bad5ce4a0aaae4: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_get_501ad1d6b5ba20fe: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_get_66aa90c49c0d309f: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_get_95e4d462165c92ae: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_get_989d0a1309644f2b: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_c3db89fbf291e5ab: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_get_unchecked_363572bdd397d473: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_gpu_a7c12045c25d009a: function(arg0) {
            const ret = arg0.gpu;
            return ret;
        },
        __wbg_hash_04b938b4a921e95e: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.hash;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_height_c15ee46a1345e9af: function(arg0) {
            const ret = arg0.height;
            return ret;
        },
        __wbg_height_d011730144e088ea: function(arg0) {
            const ret = arg0.height;
            return ret;
        },
        __wbg_hidden_a7eeac02f4edeb64: function(arg0) {
            const ret = arg0.hidden;
            return ret;
        },
        __wbg_host_1cf263d95b06dac3: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.host;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_hostname_5d1766a5db84699e: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.hostname;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_href_de709e84ed5de5d2: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.href;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_id_a2ad1f89e66cf394: function(arg0, arg1) {
            const ret = arg1.id;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_identifier_33e3b1ed04ae35c8: function(arg0) {
            const ret = arg0.identifier;
            return ret;
        },
        __wbg_includes_c0f578d8314b8dbf: function(arg0, arg1, arg2) {
            const ret = arg0.includes(arg1, arg2);
            return ret;
        },
        __wbg_info_22dcf1fd1b12bc7d: function(arg0) {
            const ret = arg0.info;
            return ret;
        },
        __wbg_info_f25c01bee103395d: function(arg0) {
            console.info(arg0);
        },
        __wbg_inlineSize_199278605b83587a: function(arg0) {
            const ret = arg0.inlineSize;
            return ret;
        },
        __wbg_instanceof_Document_9284a3da8a2e4796: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Document;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Element_c95c45635d03047e: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Element;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_GpuAdapter_fc7b89fc546de0bc: function(arg0) {
            let result;
            try {
                result = arg0 instanceof GPUAdapter;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_GpuCanvasContext_1a39fd0621603553: function(arg0) {
            let result;
            try {
                result = arg0 instanceof GPUCanvasContext;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_HtmlCanvasElement_4d7e131643d814c1: function(arg0) {
            let result;
            try {
                result = arg0 instanceof HTMLCanvasElement;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_HtmlElement_bd89ce6abf9dad44: function(arg0) {
            let result;
            try {
                result = arg0 instanceof HTMLElement;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_HtmlInputElement_086894dc9c868a64: function(arg0) {
            let result;
            try {
                result = arg0 instanceof HTMLInputElement;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_ResizeObserverEntry_e1c4a1881300a519: function(arg0) {
            let result;
            try {
                result = arg0 instanceof ResizeObserverEntry;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_ResizeObserverSize_367eb947e586239a: function(arg0) {
            let result;
            try {
                result = arg0 instanceof ResizeObserverSize;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_ShadowRoot_909fd69aa6c757e6: function(arg0) {
            let result;
            try {
                result = arg0 instanceof ShadowRoot;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_WebGl2RenderingContext_015d221b904a3c7b: function(arg0) {
            let result;
            try {
                result = arg0 instanceof WebGL2RenderingContext;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_instanceof_Window_a3b8566f0a9c5d1a: function(arg0) {
            let result;
            try {
                result = arg0 instanceof Window;
            } catch (_) {
                result = false;
            }
            const ret = result;
            return ret;
        },
        __wbg_invalidateFramebuffer_4538559f02a556ae: function() { return handleError(function (arg0, arg1, arg2) {
            arg0.invalidateFramebuffer(arg1 >>> 0, arg2);
        }, arguments); },
        __wbg_isComposing_2ab72d608a0a8d0e: function(arg0) {
            const ret = arg0.isComposing;
            return ret;
        },
        __wbg_isComposing_7d4f39b2d2fa2a3c: function(arg0) {
            const ret = arg0.isComposing;
            return ret;
        },
        __wbg_isSecureContext_86f8bb4ceb0b49bf: function(arg0) {
            const ret = arg0.isSecureContext;
            return ret;
        },
        __wbg_is_61443cc073056436: function(arg0, arg1) {
            const ret = Object.is(arg0, arg1);
            return ret;
        },
        __wbg_item_cb4cf0e176ede1ee: function(arg0, arg1) {
            const ret = arg0.item(arg1 >>> 0);
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_items_a8fdc4cf728ef922: function(arg0) {
            const ret = arg0.items;
            return ret;
        },
        __wbg_keyCode_0f64770e4df944c6: function(arg0) {
            const ret = arg0.keyCode;
            return ret;
        },
        __wbg_key_d29d670923b81510: function(arg0, arg1) {
            const ret = arg1.key;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_label_47480289cc2bce71: function(arg0, arg1) {
            const ret = arg1.label;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_lastModified_a90bb7a34b384061: function(arg0) {
            const ret = arg0.lastModified;
            return ret;
        },
        __wbg_left_644de747afd08e57: function(arg0) {
            const ret = arg0.left;
            return ret;
        },
        __wbg_length_31bdaf014f5fbde2: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_4e1adc0d42e23620: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_b9633f9f50fac3c7: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_c0ad739f2efc455b: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_f97c9822ab91d4f4: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_limits_1c25cb4f379a4418: function(arg0) {
            const ret = arg0.limits;
            return ret;
        },
        __wbg_linkProgram_794fd290a759542a: function(arg0, arg1) {
            arg0.linkProgram(arg1);
        },
        __wbg_linkProgram_e408ee5f93686f1f: function(arg0, arg1) {
            arg0.linkProgram(arg1);
        },
        __wbg_localStorage_72d815b9c2adaaad: function() { return handleError(function (arg0) {
            const ret = arg0.localStorage;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_location_382075cf6a393ad4: function(arg0) {
            const ret = arg0.location;
            return ret;
        },
        __wbg_log_363d83b9114c8831: function(arg0) {
            console.log(arg0);
        },
        __wbg_mapAsync_bb0029907dd91181: function(arg0, arg1, arg2, arg3) {
            const ret = arg0.mapAsync(arg1 >>> 0, arg2, arg3);
            return ret;
        },
        __wbg_matchMedia_0e1d9f8bfb0f1f46: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.matchMedia(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_matches_0c791086704a6cb5: function(arg0) {
            const ret = arg0.matches;
            return ret;
        },
        __wbg_maxBindGroups_14611ac9ed1c6b56: function(arg0) {
            const ret = arg0.maxBindGroups;
            return ret;
        },
        __wbg_maxBindingsPerBindGroup_dd3f66044d2a9bfb: function(arg0) {
            const ret = arg0.maxBindingsPerBindGroup;
            return ret;
        },
        __wbg_maxBufferSize_f7ce3e1856349d2f: function(arg0) {
            const ret = arg0.maxBufferSize;
            return ret;
        },
        __wbg_maxColorAttachmentBytesPerSample_55e64194645ea041: function(arg0) {
            const ret = arg0.maxColorAttachmentBytesPerSample;
            return ret;
        },
        __wbg_maxColorAttachments_fd9187f9f786da18: function(arg0) {
            const ret = arg0.maxColorAttachments;
            return ret;
        },
        __wbg_maxComputeInvocationsPerWorkgroup_9b3b1fc261129782: function(arg0) {
            const ret = arg0.maxComputeInvocationsPerWorkgroup;
            return ret;
        },
        __wbg_maxComputeWorkgroupSizeX_c55bbbcc02b75241: function(arg0) {
            const ret = arg0.maxComputeWorkgroupSizeX;
            return ret;
        },
        __wbg_maxComputeWorkgroupSizeY_96f40b1ec3102a3a: function(arg0) {
            const ret = arg0.maxComputeWorkgroupSizeY;
            return ret;
        },
        __wbg_maxComputeWorkgroupSizeZ_c2b1061d521561bb: function(arg0) {
            const ret = arg0.maxComputeWorkgroupSizeZ;
            return ret;
        },
        __wbg_maxComputeWorkgroupStorageSize_fac26e89d99e08f9: function(arg0) {
            const ret = arg0.maxComputeWorkgroupStorageSize;
            return ret;
        },
        __wbg_maxComputeWorkgroupsPerDimension_cd001f910e9b4d70: function(arg0) {
            const ret = arg0.maxComputeWorkgroupsPerDimension;
            return ret;
        },
        __wbg_maxDynamicStorageBuffersPerPipelineLayout_29399b82af020d86: function(arg0) {
            const ret = arg0.maxDynamicStorageBuffersPerPipelineLayout;
            return ret;
        },
        __wbg_maxDynamicUniformBuffersPerPipelineLayout_6d6cf80f3bd08e52: function(arg0) {
            const ret = arg0.maxDynamicUniformBuffersPerPipelineLayout;
            return ret;
        },
        __wbg_maxInterStageShaderVariables_8b000f47a166b1d5: function(arg0) {
            const ret = arg0.maxInterStageShaderVariables;
            return ret;
        },
        __wbg_maxSampledTexturesPerShaderStage_618a49f33217dde2: function(arg0) {
            const ret = arg0.maxSampledTexturesPerShaderStage;
            return ret;
        },
        __wbg_maxSamplersPerShaderStage_aa09fa0311712a1a: function(arg0) {
            const ret = arg0.maxSamplersPerShaderStage;
            return ret;
        },
        __wbg_maxStorageBufferBindingSize_0ec83ae10ad73180: function(arg0) {
            const ret = arg0.maxStorageBufferBindingSize;
            return ret;
        },
        __wbg_maxStorageBuffersPerShaderStage_0cca5b468fcf10b6: function(arg0) {
            const ret = arg0.maxStorageBuffersPerShaderStage;
            return ret;
        },
        __wbg_maxStorageTexturesPerShaderStage_9d6c35770f37866c: function(arg0) {
            const ret = arg0.maxStorageTexturesPerShaderStage;
            return ret;
        },
        __wbg_maxTextureArrayLayers_c2bf9c85285832d4: function(arg0) {
            const ret = arg0.maxTextureArrayLayers;
            return ret;
        },
        __wbg_maxTextureDimension1D_e09f86e22ea6bac9: function(arg0) {
            const ret = arg0.maxTextureDimension1D;
            return ret;
        },
        __wbg_maxTextureDimension2D_2631916ef9a3efa8: function(arg0) {
            const ret = arg0.maxTextureDimension2D;
            return ret;
        },
        __wbg_maxTextureDimension3D_06ee54121b37d431: function(arg0) {
            const ret = arg0.maxTextureDimension3D;
            return ret;
        },
        __wbg_maxUniformBufferBindingSize_af9e8a077907ed64: function(arg0) {
            const ret = arg0.maxUniformBufferBindingSize;
            return ret;
        },
        __wbg_maxUniformBuffersPerShaderStage_f871b70865df8c11: function(arg0) {
            const ret = arg0.maxUniformBuffersPerShaderStage;
            return ret;
        },
        __wbg_maxVertexAttributes_e72dabb2714f5cf5: function(arg0) {
            const ret = arg0.maxVertexAttributes;
            return ret;
        },
        __wbg_maxVertexBufferArrayStride_6a1cd814386082ce: function(arg0) {
            const ret = arg0.maxVertexBufferArrayStride;
            return ret;
        },
        __wbg_maxVertexBuffers_9c61c5fd286ebcc6: function(arg0) {
            const ret = arg0.maxVertexBuffers;
            return ret;
        },
        __wbg_metaKey_3f9183dfd5e1b726: function(arg0) {
            const ret = arg0.metaKey;
            return ret;
        },
        __wbg_metaKey_feb71e77f26b1a4c: function(arg0) {
            const ret = arg0.metaKey;
            return ret;
        },
        __wbg_minStorageBufferOffsetAlignment_e214f59628fb3558: function(arg0) {
            const ret = arg0.minStorageBufferOffsetAlignment;
            return ret;
        },
        __wbg_minUniformBufferOffsetAlignment_58b69e1c3924f6a4: function(arg0) {
            const ret = arg0.minUniformBufferOffsetAlignment;
            return ret;
        },
        __wbg_name_9240af9c79ef35aa: function(arg0, arg1) {
            const ret = arg1.name;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_navigator_d217ca64c4bbff48: function(arg0) {
            const ret = arg0.navigator;
            return ret;
        },
        __wbg_navigator_d25c0f071226f233: function(arg0) {
            const ret = arg0.navigator;
            return ret;
        },
        __wbg_new_1da3429bc3c4541c: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_new_b118e7e10d996427: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_new_bebc3f4757acf305: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_d0cecdd4b12bd7a1: function() { return handleError(function (arg0) {
            const ret = new ResizeObserver(arg0);
            return ret;
        }, arguments); },
        __wbg_new_ffa92086ea89f79c: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_from_slice_4ee02165f9de919e: function(arg0, arg1) {
            const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_new_typed_6f8b0d724fe26c07: function(arg0, arg1) {
            try {
                var state0 = {a: arg0, b: arg1};
                var cb0 = (arg0, arg1) => {
                    const a = state0.a;
                    state0.a = 0;
                    try {
                        return wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Function_fn_wasm_bindgen_cd4d31d4f9b3845d___JsValue_____wasm_bindgen_cd4d31d4f9b3845d___sys__Undefined___js_sys_fe22bded58295d21___Function_fn_wasm_bindgen_cd4d31d4f9b3845d___JsValue_____wasm_bindgen_cd4d31d4f9b3845d___sys__Undefined_______true_(a, state0.b, arg0, arg1);
                    } finally {
                        state0.a = a;
                    }
                };
                const ret = new Promise(cb0);
                return ret;
            } finally {
                state0.a = 0;
            }
        },
        __wbg_new_with_byte_offset_and_length_492c969e8b5da8a4: function(arg0, arg1, arg2) {
            const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
            return ret;
        },
        __wbg_new_with_record_from_str_to_blob_promise_8976936b3410abac: function() { return handleError(function (arg0) {
            const ret = new ClipboardItem(arg0);
            return ret;
        }, arguments); },
        __wbg_new_with_u8_array_sequence_and_options_19dab14721682b5e: function() { return handleError(function (arg0, arg1) {
            const ret = new Blob(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_now_0b7736bc17fd7719: function(arg0) {
            const ret = arg0.now();
            return ret;
        },
        __wbg_now_e7c6795a7f81e10f: function(arg0) {
            const ret = arg0.now();
            return ret;
        },
        __wbg_observe_756a715b58148858: function(arg0, arg1, arg2) {
            arg0.observe(arg1, arg2);
        },
        __wbg_of_1a3f47170341cefe: function(arg0) {
            const ret = Array.of(arg0);
            return ret;
        },
        __wbg_offsetTop_9fb0abaa307449b8: function(arg0) {
            const ret = arg0.offsetTop;
            return ret;
        },
        __wbg_onSubmittedWorkDone_1460145eecea40ef: function(arg0) {
            const ret = arg0.onSubmittedWorkDone();
            return ret;
        },
        __wbg_open_57ad7d64908aec7c: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            const ret = arg0.open(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_origin_68920816a16322f8: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.origin;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_performance_3fcf6e32a7e1ed0a: function(arg0) {
            const ret = arg0.performance;
            return ret;
        },
        __wbg_performance_d96ad0b441f4510a: function(arg0) {
            const ret = arg0.performance;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_pixelStorei_1bc7980b82e1ba4b: function(arg0, arg1, arg2) {
            arg0.pixelStorei(arg1 >>> 0, arg2);
        },
        __wbg_pixelStorei_d540c25aafa93789: function(arg0, arg1, arg2) {
            arg0.pixelStorei(arg1 >>> 0, arg2);
        },
        __wbg_polygonOffset_a97069c9fe385bff: function(arg0, arg1, arg2) {
            arg0.polygonOffset(arg1, arg2);
        },
        __wbg_polygonOffset_f99887a0cc3d7df4: function(arg0, arg1, arg2) {
            arg0.polygonOffset(arg1, arg2);
        },
        __wbg_port_21d77a99d157a126: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.port;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_preventDefault_4235a4ccf8540533: function(arg0) {
            arg0.preventDefault();
        },
        __wbg_protocol_0b0f691870228b69: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.protocol;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_prototypesetcall_ae9f5e7459250748: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_push_bfdf956ba476f65b: function(arg0, arg1) {
            const ret = arg0.push(arg1);
            return ret;
        },
        __wbg_queryCounterEXT_c9fb8ad39c35fdf6: function(arg0, arg1, arg2) {
            arg0.queryCounterEXT(arg1, arg2 >>> 0);
        },
        __wbg_querySelectorAll_fdbf93e11103921d: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.querySelectorAll(getStringFromWasm0(arg1, arg2));
            return ret;
        }, arguments); },
        __wbg_querySelector_5b1d9ebad373dc9d: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        }, arguments); },
        __wbg_queueMicrotask_85c90f6987555d65: function(arg0) {
            const ret = arg0.queueMicrotask;
            return ret;
        },
        __wbg_queueMicrotask_f6a1fa10b81d1fc0: function(arg0) {
            queueMicrotask(arg0);
        },
        __wbg_queue_65d985f3e6d786a6: function(arg0) {
            const ret = arg0.queue;
            return ret;
        },
        __wbg_readBuffer_1679a4b6dcd78e30: function(arg0, arg1) {
            arg0.readBuffer(arg1 >>> 0);
        },
        __wbg_readPixels_5d75a0ec1e2aab33: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
            arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
        }, arguments); },
        __wbg_readPixels_c60bfe6126f65619: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
            arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
        }, arguments); },
        __wbg_readPixels_dcde619ca94b6296: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
            arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
        }, arguments); },
        __wbg_removeEventListener_4c9706814dcfaf79: function() { return handleError(function (arg0, arg1, arg2, arg3) {
            arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
        }, arguments); },
        __wbg_remove_2d9ed324f8c6126a: function(arg0) {
            arg0.remove();
        },
        __wbg_renderbufferStorageMultisample_5d9012ce50f133e3: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.renderbufferStorageMultisample(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
        },
        __wbg_renderbufferStorage_2b50da85624a8b73: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
        },
        __wbg_renderbufferStorage_2eb3d4343d1a1c6e: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
        },
        __wbg_requestAdapter_9ff5c9d1ff271165: function(arg0, arg1) {
            const ret = arg0.requestAdapter(arg1);
            return ret;
        },
        __wbg_requestAdapter_c46930b8bc33722d: function(arg0) {
            const ret = arg0.requestAdapter();
            return ret;
        },
        __wbg_requestAnimationFrame_4988887658fcee2e: function() { return handleError(function (arg0, arg1) {
            const ret = arg0.requestAnimationFrame(arg1);
            return ret;
        }, arguments); },
        __wbg_requestDevice_c1c34f88a477e509: function(arg0, arg1) {
            const ret = arg0.requestDevice(arg1);
            return ret;
        },
        __wbg_resolve_35ec7e0c6af4c82c: function(arg0) {
            const ret = Promise.resolve(arg0);
            return ret;
        },
        __wbg_right_3b45e4b285b3f490: function(arg0) {
            const ret = arg0.right;
            return ret;
        },
        __wbg_samplerParameterf_34605394359af7ae: function(arg0, arg1, arg2, arg3) {
            arg0.samplerParameterf(arg1, arg2 >>> 0, arg3);
        },
        __wbg_samplerParameteri_ff1f558c8f43a220: function(arg0, arg1, arg2, arg3) {
            arg0.samplerParameteri(arg1, arg2 >>> 0, arg3);
        },
        __wbg_scissor_c53448a6fa939bfb: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.scissor(arg1, arg2, arg3, arg4);
        },
        __wbg_scissor_d896348c98d0c9ac: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.scissor(arg1, arg2, arg3, arg4);
        },
        __wbg_search_685c8e05aa5dd9ba: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.search;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_setAttribute_8c84e9351986b1f6: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_setBindGroup_4ba56e1e0d26f244: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
        }, arguments); },
        __wbg_setBindGroup_6124849cc8547086: function(arg0, arg1, arg2) {
            arg0.setBindGroup(arg1 >>> 0, arg2);
        },
        __wbg_setIndexBuffer_17431786d06c1b7c: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
        },
        __wbg_setIndexBuffer_a16ed5b869c87507: function(arg0, arg1, arg2, arg3) {
            arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3);
        },
        __wbg_setItem_51f02f76b24c5d18: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.setItem(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_setPipeline_bab24dbce96903b9: function(arg0, arg1) {
            arg0.setPipeline(arg1);
        },
        __wbg_setProperty_6139dd07828b5817: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
            arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        }, arguments); },
        __wbg_setScissorRect_40786fdec122b032: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
        },
        __wbg_setVertexBuffer_91c4b602d0289943: function(arg0, arg1, arg2, arg3) {
            arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3);
        },
        __wbg_setVertexBuffer_b508baf8d0ffe331: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3, arg4);
        },
        __wbg_setViewport_f9d423db4f4b4b58: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.setViewport(arg1, arg2, arg3, arg4, arg5, arg6);
        },
        __wbg_set_9cfc0f17d60ff0af: function(arg0, arg1, arg2) {
            arg0.set(arg1, arg2 >>> 0);
        },
        __wbg_set_a377297433dfea63: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_set_a_5f6e488475272136: function(arg0, arg1) {
            arg0.a = arg1;
        },
        __wbg_set_access_091f317905cd76a5: function(arg0, arg1) {
            arg0.access = __wbindgen_enum_GpuStorageTextureAccess[arg1];
        },
        __wbg_set_address_mode_u_a37cf1035585c638: function(arg0, arg1) {
            arg0.addressModeU = __wbindgen_enum_GpuAddressMode[arg1];
        },
        __wbg_set_address_mode_v_8ac049e029caef76: function(arg0, arg1) {
            arg0.addressModeV = __wbindgen_enum_GpuAddressMode[arg1];
        },
        __wbg_set_address_mode_w_eb9260ee11729e92: function(arg0, arg1) {
            arg0.addressModeW = __wbindgen_enum_GpuAddressMode[arg1];
        },
        __wbg_set_alpha_aa2e606e9e647b21: function(arg0, arg1) {
            arg0.alpha = arg1;
        },
        __wbg_set_alpha_mode_92402195b3ae1ee7: function(arg0, arg1) {
            arg0.alphaMode = __wbindgen_enum_GpuCanvasAlphaMode[arg1];
        },
        __wbg_set_alpha_to_coverage_enabled_b4ce9c3f7f8b7ad7: function(arg0, arg1) {
            arg0.alphaToCoverageEnabled = arg1 !== 0;
        },
        __wbg_set_array_layer_count_daec613068108a9d: function(arg0, arg1) {
            arg0.arrayLayerCount = arg1 >>> 0;
        },
        __wbg_set_array_stride_c2c009eabc18b5f6: function(arg0, arg1) {
            arg0.arrayStride = arg1;
        },
        __wbg_set_aspect_77332ac136ee94eb: function(arg0, arg1) {
            arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
        },
        __wbg_set_aspect_a823a14d00d42d37: function(arg0, arg1) {
            arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
        },
        __wbg_set_attributes_05f9117fd32ca606: function(arg0, arg1) {
            arg0.attributes = arg1;
        },
        __wbg_set_autofocus_f83a7dae18c34772: function() { return handleError(function (arg0, arg1) {
            arg0.autofocus = arg1 !== 0;
        }, arguments); },
        __wbg_set_b_688365d692bba214: function(arg0, arg1) {
            arg0.b = arg1;
        },
        __wbg_set_base_array_layer_cc6c68d233489c4b: function(arg0, arg1) {
            arg0.baseArrayLayer = arg1 >>> 0;
        },
        __wbg_set_base_mip_level_e07a3efe9006d5ea: function(arg0, arg1) {
            arg0.baseMipLevel = arg1 >>> 0;
        },
        __wbg_set_beginning_of_pass_write_index_27be5b0b35ec3de0: function(arg0, arg1) {
            arg0.beginningOfPassWriteIndex = arg1 >>> 0;
        },
        __wbg_set_bind_group_layouts_5325d038771af328: function(arg0, arg1) {
            arg0.bindGroupLayouts = arg1;
        },
        __wbg_set_binding_b6b0fe5c281b8c69: function(arg0, arg1) {
            arg0.binding = arg1 >>> 0;
        },
        __wbg_set_binding_f3c188a8cd21455b: function(arg0, arg1) {
            arg0.binding = arg1 >>> 0;
        },
        __wbg_set_blend_8d6e9c08b5702a09: function(arg0, arg1) {
            arg0.blend = arg1;
        },
        __wbg_set_box_334f2086d2b008d0: function(arg0, arg1) {
            arg0.box = __wbindgen_enum_ResizeObserverBoxOptions[arg1];
        },
        __wbg_set_buffer_55f096330c8912b4: function(arg0, arg1) {
            arg0.buffer = arg1;
        },
        __wbg_set_buffer_aa7bf4ad8f17b2bd: function(arg0, arg1) {
            arg0.buffer = arg1;
        },
        __wbg_set_buffer_e89095a9f0cafad3: function(arg0, arg1) {
            arg0.buffer = arg1;
        },
        __wbg_set_buffers_85a7238f4ef28ab4: function(arg0, arg1) {
            arg0.buffers = arg1;
        },
        __wbg_set_bytes_per_row_68a1ea90d4710bc9: function(arg0, arg1) {
            arg0.bytesPerRow = arg1 >>> 0;
        },
        __wbg_set_bytes_per_row_91681ca78d744888: function(arg0, arg1) {
            arg0.bytesPerRow = arg1 >>> 0;
        },
        __wbg_set_clear_value_642701f928a5ccb3: function(arg0, arg1) {
            arg0.clearValue = arg1;
        },
        __wbg_set_code_56e2d45ec1ff6c2d: function(arg0, arg1, arg2) {
            arg0.code = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_color_attachments_abe67f6631926e28: function(arg0, arg1) {
            arg0.colorAttachments = arg1;
        },
        __wbg_set_color_bc393d7efc3c8594: function(arg0, arg1) {
            arg0.color = arg1;
        },
        __wbg_set_compare_1509dc1a5420943f: function(arg0, arg1) {
            arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
        },
        __wbg_set_compare_42211fbf15e3b850: function(arg0, arg1) {
            arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
        },
        __wbg_set_count_26a934d1cd07d080: function(arg0, arg1) {
            arg0.count = arg1 >>> 0;
        },
        __wbg_set_cull_mode_9d466c1ab414cac8: function(arg0, arg1) {
            arg0.cullMode = __wbindgen_enum_GpuCullMode[arg1];
        },
        __wbg_set_depth_bias_428c9340b0fd937b: function(arg0, arg1) {
            arg0.depthBias = arg1;
        },
        __wbg_set_depth_bias_clamp_f009599ca67fa30c: function(arg0, arg1) {
            arg0.depthBiasClamp = arg1;
        },
        __wbg_set_depth_bias_slope_scale_7125880b4cb7a951: function(arg0, arg1) {
            arg0.depthBiasSlopeScale = arg1;
        },
        __wbg_set_depth_clear_value_442bf492734f63b6: function(arg0, arg1) {
            arg0.depthClearValue = arg1;
        },
        __wbg_set_depth_compare_30e9ea552da12fe2: function(arg0, arg1) {
            arg0.depthCompare = __wbindgen_enum_GpuCompareFunction[arg1];
        },
        __wbg_set_depth_fail_op_5e42dc3e4c382951: function(arg0, arg1) {
            arg0.depthFailOp = __wbindgen_enum_GpuStencilOperation[arg1];
        },
        __wbg_set_depth_load_op_34d430b74bb36d91: function(arg0, arg1) {
            arg0.depthLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
        },
        __wbg_set_depth_or_array_layers_4bbbeadacb393f02: function(arg0, arg1) {
            arg0.depthOrArrayLayers = arg1 >>> 0;
        },
        __wbg_set_depth_read_only_138a11b10c731094: function(arg0, arg1) {
            arg0.depthReadOnly = arg1 !== 0;
        },
        __wbg_set_depth_stencil_1bd50dbc450c8650: function(arg0, arg1) {
            arg0.depthStencil = arg1;
        },
        __wbg_set_depth_stencil_attachment_1ee0d93bc3273369: function(arg0, arg1) {
            arg0.depthStencilAttachment = arg1;
        },
        __wbg_set_depth_store_op_0ea0a215313dbda7: function(arg0, arg1) {
            arg0.depthStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
        },
        __wbg_set_depth_write_enabled_64c2e7f6fa4b6b7b: function(arg0, arg1) {
            arg0.depthWriteEnabled = arg1 !== 0;
        },
        __wbg_set_device_0d774b66e7288f72: function(arg0, arg1) {
            arg0.device = arg1;
        },
        __wbg_set_dimension_174ad7e2fb67fb4e: function(arg0, arg1) {
            arg0.dimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
        },
        __wbg_set_dimension_36e13ccecae5af4b: function(arg0, arg1) {
            arg0.dimension = __wbindgen_enum_GpuTextureDimension[arg1];
        },
        __wbg_set_dst_factor_1ed75271a89a711e: function(arg0, arg1) {
            arg0.dstFactor = __wbindgen_enum_GpuBlendFactor[arg1];
        },
        __wbg_set_end_of_pass_write_index_e8f52fc08bc0603e: function(arg0, arg1) {
            arg0.endOfPassWriteIndex = arg1 >>> 0;
        },
        __wbg_set_entries_3017e6132f938c6e: function(arg0, arg1) {
            arg0.entries = arg1;
        },
        __wbg_set_entries_fc76ca4d7da6a709: function(arg0, arg1) {
            arg0.entries = arg1;
        },
        __wbg_set_entry_point_6fec5723cc790927: function(arg0, arg1, arg2) {
            arg0.entryPoint = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_entry_point_8db3b6d103e3b865: function(arg0, arg1, arg2) {
            arg0.entryPoint = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_external_texture_825fe2bc7a0c0603: function(arg0, arg1) {
            arg0.externalTexture = arg1;
        },
        __wbg_set_fail_op_77ab26c98f847b65: function(arg0, arg1) {
            arg0.failOp = __wbindgen_enum_GpuStencilOperation[arg1];
        },
        __wbg_set_format_1786adb7bc74c7c9: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_6606f5c1fba6f459: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuVertexFormat[arg1];
        },
        __wbg_set_format_90860b0321868db4: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_abf7a1bc5425c56a: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_d347899cd860709c: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_e9d4b1475bb3bd3b: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_format_f9341112e43ea182: function(arg0, arg1) {
            arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
        },
        __wbg_set_fragment_1a595620425637e1: function(arg0, arg1) {
            arg0.fragment = arg1;
        },
        __wbg_set_front_face_50cdf4eb61504a46: function(arg0, arg1) {
            arg0.frontFace = __wbindgen_enum_GpuFrontFace[arg1];
        },
        __wbg_set_g_d4d1d77cf8fdd362: function(arg0, arg1) {
            arg0.g = arg1;
        },
        __wbg_set_has_dynamic_offset_7d30014fdbfe90c5: function(arg0, arg1) {
            arg0.hasDynamicOffset = arg1 !== 0;
        },
        __wbg_set_height_1202ad0eab43cbe0: function(arg0, arg1) {
            arg0.height = arg1 >>> 0;
        },
        __wbg_set_height_698fb3b255bc1348: function(arg0, arg1) {
            arg0.height = arg1 >>> 0;
        },
        __wbg_set_height_e8b5483b8c117d5e: function(arg0, arg1) {
            arg0.height = arg1 >>> 0;
        },
        __wbg_set_id_dc5bd387fca63e7d: function(arg0, arg1, arg2) {
            arg0.id = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_03d2396d4655a3e1: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_0c1bd0e976cf0a9a: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_1175a3329a06e52b: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_2d2227f4d5991e50: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_2f592bd1be3db6b3: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_8fd860a36d2c7b74: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_bae57fb9f24fde5c: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_be45aed56e4b9fee: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_c47c451211e2f6d2: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_cd567b7b35838e4c: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_d1c24b5a7a3ac31d: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_dcd98efbb9370da8: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_label_f92ae11c77d74198: function(arg0, arg1, arg2) {
            arg0.label = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_layout_7c5ba5bdcde8a0f0: function(arg0, arg1) {
            arg0.layout = arg1;
        },
        __wbg_set_layout_eeef59714f5bf48b: function(arg0, arg1) {
            arg0.layout = arg1;
        },
        __wbg_set_load_op_56844f51434037bf: function(arg0, arg1) {
            arg0.loadOp = __wbindgen_enum_GpuLoadOp[arg1];
        },
        __wbg_set_lod_max_clamp_3f157633f32c9f94: function(arg0, arg1) {
            arg0.lodMaxClamp = arg1;
        },
        __wbg_set_lod_min_clamp_7e246c739fb1a854: function(arg0, arg1) {
            arg0.lodMinClamp = arg1;
        },
        __wbg_set_mag_filter_69d846b974d4bcc0: function(arg0, arg1) {
            arg0.magFilter = __wbindgen_enum_GpuFilterMode[arg1];
        },
        __wbg_set_mapped_at_creation_48de4735fab51e78: function(arg0, arg1) {
            arg0.mappedAtCreation = arg1 !== 0;
        },
        __wbg_set_mask_0c49a66362fc0079: function(arg0, arg1) {
            arg0.mask = arg1 >>> 0;
        },
        __wbg_set_max_anisotropy_3ef0d5bca2336cc7: function(arg0, arg1) {
            arg0.maxAnisotropy = arg1;
        },
        __wbg_set_min_binding_size_689661b9ed25e083: function(arg0, arg1) {
            arg0.minBindingSize = arg1;
        },
        __wbg_set_min_filter_fbf2d8d9f503dcd7: function(arg0, arg1) {
            arg0.minFilter = __wbindgen_enum_GpuFilterMode[arg1];
        },
        __wbg_set_mip_level_246db61be15bdd69: function(arg0, arg1) {
            arg0.mipLevel = arg1 >>> 0;
        },
        __wbg_set_mip_level_count_72f8bc1f80f7539b: function(arg0, arg1) {
            arg0.mipLevelCount = arg1 >>> 0;
        },
        __wbg_set_mip_level_count_b19a0d9192e62d5d: function(arg0, arg1) {
            arg0.mipLevelCount = arg1 >>> 0;
        },
        __wbg_set_mipmap_filter_17fd50a3898fd5ff: function(arg0, arg1) {
            arg0.mipmapFilter = __wbindgen_enum_GpuMipmapFilterMode[arg1];
        },
        __wbg_set_module_08ad08e736d8edbf: function(arg0, arg1) {
            arg0.module = arg1;
        },
        __wbg_set_module_14e471fdd94c582d: function(arg0, arg1) {
            arg0.module = arg1;
        },
        __wbg_set_multisample_85f073947b782d07: function(arg0, arg1) {
            arg0.multisample = arg1;
        },
        __wbg_set_multisampled_40505c1381e1c32c: function(arg0, arg1) {
            arg0.multisampled = arg1 !== 0;
        },
        __wbg_set_offset_2c374e604504e0b2: function(arg0, arg1) {
            arg0.offset = arg1;
        },
        __wbg_set_offset_73156b0e0b41d79a: function(arg0, arg1) {
            arg0.offset = arg1;
        },
        __wbg_set_offset_8d9d9afffa18b591: function(arg0, arg1) {
            arg0.offset = arg1;
        },
        __wbg_set_offset_a097a8050a3a9a33: function(arg0, arg1) {
            arg0.offset = arg1;
        },
        __wbg_set_once_60a969fcdc22b373: function(arg0, arg1) {
            arg0.once = arg1 !== 0;
        },
        __wbg_set_operation_b5862f5a1a143b30: function(arg0, arg1) {
            arg0.operation = __wbindgen_enum_GpuBlendOperation[arg1];
        },
        __wbg_set_origin_9b3b0fbe0a5dc469: function(arg0, arg1) {
            arg0.origin = arg1;
        },
        __wbg_set_pass_op_e9470d1262fb8a8b: function(arg0, arg1) {
            arg0.passOp = __wbindgen_enum_GpuStencilOperation[arg1];
        },
        __wbg_set_power_preference_c0d3fa7ce46b1a2e: function(arg0, arg1) {
            arg0.powerPreference = __wbindgen_enum_GpuPowerPreference[arg1];
        },
        __wbg_set_primitive_369241acd17871f1: function(arg0, arg1) {
            arg0.primitive = arg1;
        },
        __wbg_set_query_set_18679a8580267d5a: function(arg0, arg1) {
            arg0.querySet = arg1;
        },
        __wbg_set_r_527e5a41c4b1a846: function(arg0, arg1) {
            arg0.r = arg1;
        },
        __wbg_set_required_features_54918de8185c5fab: function(arg0, arg1) {
            arg0.requiredFeatures = arg1;
        },
        __wbg_set_required_limits_3b031f66f838f4e3: function(arg0, arg1) {
            arg0.requiredLimits = arg1;
        },
        __wbg_set_resolve_target_fe76b3f99cf72078: function(arg0, arg1) {
            arg0.resolveTarget = arg1;
        },
        __wbg_set_resource_fe385d2e3dadaf63: function(arg0, arg1) {
            arg0.resource = arg1;
        },
        __wbg_set_rows_per_image_d198b7e73a38978b: function(arg0, arg1) {
            arg0.rowsPerImage = arg1 >>> 0;
        },
        __wbg_set_rows_per_image_f9878f4b10f4fd7f: function(arg0, arg1) {
            arg0.rowsPerImage = arg1 >>> 0;
        },
        __wbg_set_sample_count_865e1d19b84e27e6: function(arg0, arg1) {
            arg0.sampleCount = arg1 >>> 0;
        },
        __wbg_set_sample_type_7088b1efddce6a69: function(arg0, arg1) {
            arg0.sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];
        },
        __wbg_set_sampler_8c5d7fb1b02058c6: function(arg0, arg1) {
            arg0.sampler = arg1;
        },
        __wbg_set_shader_location_0ff30a733291a396: function(arg0, arg1) {
            arg0.shaderLocation = arg1 >>> 0;
        },
        __wbg_set_size_1e6281b07cd39177: function(arg0, arg1) {
            arg0.size = arg1;
        },
        __wbg_set_size_41cd9255ca1e4242: function(arg0, arg1) {
            arg0.size = arg1;
        },
        __wbg_set_size_a61ff22205255d61: function(arg0, arg1) {
            arg0.size = arg1;
        },
        __wbg_set_src_factor_1c4f755f8676df1b: function(arg0, arg1) {
            arg0.srcFactor = __wbindgen_enum_GpuBlendFactor[arg1];
        },
        __wbg_set_stencil_back_6ef4683123b19b25: function(arg0, arg1) {
            arg0.stencilBack = arg1;
        },
        __wbg_set_stencil_clear_value_10b58f674d0177c2: function(arg0, arg1) {
            arg0.stencilClearValue = arg1 >>> 0;
        },
        __wbg_set_stencil_front_aeb8580a97e5424b: function(arg0, arg1) {
            arg0.stencilFront = arg1;
        },
        __wbg_set_stencil_load_op_f20a90a66acd3d8c: function(arg0, arg1) {
            arg0.stencilLoadOp = __wbindgen_enum_GpuLoadOp[arg1];
        },
        __wbg_set_stencil_read_mask_2954f260d47349ea: function(arg0, arg1) {
            arg0.stencilReadMask = arg1 >>> 0;
        },
        __wbg_set_stencil_read_only_fb489d191b6d969b: function(arg0, arg1) {
            arg0.stencilReadOnly = arg1 !== 0;
        },
        __wbg_set_stencil_store_op_477c4cf6422dfa3f: function(arg0, arg1) {
            arg0.stencilStoreOp = __wbindgen_enum_GpuStoreOp[arg1];
        },
        __wbg_set_stencil_write_mask_3f8e9b3781814a95: function(arg0, arg1) {
            arg0.stencilWriteMask = arg1 >>> 0;
        },
        __wbg_set_step_mode_a35aef328761c452: function(arg0, arg1) {
            arg0.stepMode = __wbindgen_enum_GpuVertexStepMode[arg1];
        },
        __wbg_set_storage_texture_ab9eed9786337ef0: function(arg0, arg1) {
            arg0.storageTexture = arg1;
        },
        __wbg_set_store_op_caeede4654b3d847: function(arg0, arg1) {
            arg0.storeOp = __wbindgen_enum_GpuStoreOp[arg1];
        },
        __wbg_set_strip_index_format_0cd0510e166c4ec4: function(arg0, arg1) {
            arg0.stripIndexFormat = __wbindgen_enum_GpuIndexFormat[arg1];
        },
        __wbg_set_tabIndex_35927a28c713d094: function(arg0, arg1) {
            arg0.tabIndex = arg1;
        },
        __wbg_set_targets_6b0b3bdd87f35668: function(arg0, arg1) {
            arg0.targets = arg1;
        },
        __wbg_set_texture_16d2be474ce6ad0c: function(arg0, arg1) {
            arg0.texture = arg1;
        },
        __wbg_set_texture_e25a73da75cf5808: function(arg0, arg1) {
            arg0.texture = arg1;
        },
        __wbg_set_timestamp_writes_c552d52fbb417005: function(arg0, arg1) {
            arg0.timestampWrites = arg1;
        },
        __wbg_set_topology_beefb3aca0612b00: function(arg0, arg1) {
            arg0.topology = __wbindgen_enum_GpuPrimitiveTopology[arg1];
        },
        __wbg_set_type_38961e08504ca674: function(arg0, arg1) {
            arg0.type = __wbindgen_enum_GpuBufferBindingType[arg1];
        },
        __wbg_set_type_5904600aed60e21e: function(arg0, arg1, arg2) {
            arg0.type = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_type_69954a3c7c11a724: function(arg0, arg1, arg2) {
            arg0.type = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_type_c1eebc19f8a6aeb9: function(arg0, arg1) {
            arg0.type = __wbindgen_enum_GpuSamplerBindingType[arg1];
        },
        __wbg_set_unclipped_depth_5a4f7eb57fe006b2: function(arg0, arg1) {
            arg0.unclippedDepth = arg1 !== 0;
        },
        __wbg_set_usage_7f0dda8309469b1c: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_usage_7fa9cd18d1104aca: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_usage_908213a4d4bb8bde: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_usage_ae014e77ff77ce06: function(arg0, arg1) {
            arg0.usage = arg1 >>> 0;
        },
        __wbg_set_value_23f51d0287ae7cb7: function(arg0, arg1, arg2) {
            arg0.value = getStringFromWasm0(arg1, arg2);
        },
        __wbg_set_vertex_a4951dd9a7a4ed54: function(arg0, arg1) {
            arg0.vertex = arg1;
        },
        __wbg_set_view_bdeab150b5f0768c: function(arg0, arg1) {
            arg0.view = arg1;
        },
        __wbg_set_view_dbd0294573f64d05: function(arg0, arg1) {
            arg0.view = arg1;
        },
        __wbg_set_view_dimension_263387976511ebc9: function(arg0, arg1) {
            arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
        },
        __wbg_set_view_dimension_3ed01b237e85826f: function(arg0, arg1) {
            arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
        },
        __wbg_set_view_formats_bab284fc81b40e70: function(arg0, arg1) {
            arg0.viewFormats = arg1;
        },
        __wbg_set_view_formats_fe531a043efb71fa: function(arg0, arg1) {
            arg0.viewFormats = arg1;
        },
        __wbg_set_visibility_1bca121a89accba5: function(arg0, arg1) {
            arg0.visibility = arg1 >>> 0;
        },
        __wbg_set_width_1a5e2e86fa5bdcd8: function(arg0, arg1) {
            arg0.width = arg1 >>> 0;
        },
        __wbg_set_width_4c3a2252e0dea033: function(arg0, arg1) {
            arg0.width = arg1 >>> 0;
        },
        __wbg_set_width_f52a20e39808b138: function(arg0, arg1) {
            arg0.width = arg1 >>> 0;
        },
        __wbg_set_write_mask_144b25e2bd909124: function(arg0, arg1) {
            arg0.writeMask = arg1 >>> 0;
        },
        __wbg_set_x_56f0c2c08a62725c: function(arg0, arg1) {
            arg0.x = arg1 >>> 0;
        },
        __wbg_set_y_04fb8ce84735b4e1: function(arg0, arg1) {
            arg0.y = arg1 >>> 0;
        },
        __wbg_set_z_a51316db27a4941e: function(arg0, arg1) {
            arg0.z = arg1 >>> 0;
        },
        __wbg_shaderSource_108c27c8694ef4c0: function(arg0, arg1, arg2, arg3) {
            arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
        },
        __wbg_shaderSource_82a2cbfe223a86e0: function(arg0, arg1, arg2, arg3) {
            arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
        },
        __wbg_shiftKey_2b651c3e5a9c07f5: function(arg0) {
            const ret = arg0.shiftKey;
            return ret;
        },
        __wbg_shiftKey_9dd20e0fb9da6eb5: function(arg0) {
            const ret = arg0.shiftKey;
            return ret;
        },
        __wbg_size_1356eae711a92515: function(arg0) {
            const ret = arg0.size;
            return ret;
        },
        __wbg_size_338f1717fbf84c4e: function(arg0) {
            const ret = arg0.size;
            return ret;
        },
        __wbg_stack_3199f5c9e3d3cf6e: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_static_accessor_GLOBAL_8eb4cd83130a11a0: function() {
            const ret = typeof global === 'undefined' ? null : global;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_GLOBAL_THIS_1e7044f654e934db: function() {
            const ret = typeof globalThis === 'undefined' ? null : globalThis;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_SELF_d8b50611246a6d92: function() {
            const ret = typeof self === 'undefined' ? null : self;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_static_accessor_WINDOW_fd0bc376bf0f8b42: function() {
            const ret = typeof window === 'undefined' ? null : window;
            return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
        },
        __wbg_stencilFuncSeparate_d7b5956ce3fe1272: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
        },
        __wbg_stencilFuncSeparate_fd17ac8961fd8359: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
        },
        __wbg_stencilMaskSeparate_5f3823dfe31289be: function(arg0, arg1, arg2) {
            arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_stencilMaskSeparate_d0910e6d55b4605a: function(arg0, arg1, arg2) {
            arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_stencilMask_4a8c4bda850006f1: function(arg0, arg1) {
            arg0.stencilMask(arg1 >>> 0);
        },
        __wbg_stencilMask_cb69051e26a265bb: function(arg0, arg1) {
            arg0.stencilMask(arg1 >>> 0);
        },
        __wbg_stencilOpSeparate_3fe9feaf978f0a17: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
        },
        __wbg_stencilOpSeparate_cb0bb47587f022de: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
        },
        __wbg_stopPropagation_39aa52c205e873cd: function(arg0) {
            arg0.stopPropagation();
        },
        __wbg_style_b79c69cee0c004b9: function(arg0) {
            const ret = arg0.style;
            return ret;
        },
        __wbg_submit_1290d44bb76ecef4: function(arg0, arg1) {
            arg0.submit(arg1);
        },
        __wbg_texImage2D_1b8d273f15622f0e: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texImage2D_6fca8c58ea7e4c8e: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texImage2D_8c5d6403fa51874d: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texImage3D_2bba05e03e9def07: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
            arg0.texImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8 >>> 0, arg9 >>> 0, arg10);
        }, arguments); },
        __wbg_texImage3D_3977c422ce82cf99: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
            arg0.texImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8 >>> 0, arg9 >>> 0, arg10);
        }, arguments); },
        __wbg_texParameteri_1fea50207adbfd68: function(arg0, arg1, arg2, arg3) {
            arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
        },
        __wbg_texParameteri_e127aa385b821d68: function(arg0, arg1, arg2, arg3) {
            arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
        },
        __wbg_texStorage2D_eb27b3383d99c349: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.texStorage2D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
        },
        __wbg_texStorage3D_cb53309842f2c8eb: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.texStorage3D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5, arg6);
        },
        __wbg_texSubImage2D_0542ae723245dd04: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texSubImage2D_0721d9d910ecf097: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texSubImage2D_11c39463147c9d38: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texSubImage2D_21b4316b692aa7bc: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texSubImage2D_339324fe86d9879e: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texSubImage2D_6218009ef1e27c0e: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texSubImage2D_79b4ac26a5580960: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texSubImage2D_892cfa51f196ee93: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
            arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
        }, arguments); },
        __wbg_texSubImage3D_6458575ddb6df6b3: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
            arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
        }, arguments); },
        __wbg_texSubImage3D_747bc81ed2ed4116: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
            arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
        }, arguments); },
        __wbg_texSubImage3D_7a674dd9403f8be3: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
            arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
        }, arguments); },
        __wbg_texSubImage3D_805532d56bdd814d: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
            arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
        }, arguments); },
        __wbg_texSubImage3D_ad76ff2925daf174: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
            arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
        }, arguments); },
        __wbg_texSubImage3D_c65a616189ed3b19: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
            arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
        }, arguments); },
        __wbg_texSubImage3D_f99458987d5b061a: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
            arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
        }, arguments); },
        __wbg_then_114b14e3854c2390: function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        },
        __wbg_then_7a850dae4493f353: function(arg0, arg1, arg2) {
            const ret = arg0.then(arg1, arg2);
            return ret;
        },
        __wbg_then_b830475380919203: function(arg0, arg1) {
            const ret = arg0.then(arg1);
            return ret;
        },
        __wbg_top_319e8c7a40daacf1: function(arg0) {
            const ret = arg0.top;
            return ret;
        },
        __wbg_touches_fcb578b82332de47: function(arg0) {
            const ret = arg0.touches;
            return ret;
        },
        __wbg_type_b801ad2eeaceaba5: function(arg0, arg1) {
            const ret = arg1.type;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_type_de0ef83ccf892533: function(arg0, arg1) {
            const ret = arg1.type;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_uniform1f_6067a9c69ed38c8b: function(arg0, arg1, arg2) {
            arg0.uniform1f(arg1, arg2);
        },
        __wbg_uniform1f_d08261cd87e412e0: function(arg0, arg1, arg2) {
            arg0.uniform1f(arg1, arg2);
        },
        __wbg_uniform1i_25a3df9f69c2f765: function(arg0, arg1, arg2) {
            arg0.uniform1i(arg1, arg2);
        },
        __wbg_uniform1i_89c631d199860f60: function(arg0, arg1, arg2) {
            arg0.uniform1i(arg1, arg2);
        },
        __wbg_uniform1ui_58cbbe1a93e44a02: function(arg0, arg1, arg2) {
            arg0.uniform1ui(arg1, arg2 >>> 0);
        },
        __wbg_uniform2fv_6a494ce09154afdb: function(arg0, arg1, arg2, arg3) {
            arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
        },
        __wbg_uniform2fv_f85b3b2779a6c2b9: function(arg0, arg1, arg2, arg3) {
            arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
        },
        __wbg_uniform2iv_5c591a2edfd26c45: function(arg0, arg1, arg2, arg3) {
            arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
        },
        __wbg_uniform2iv_63a2ba7206eaf2b3: function(arg0, arg1, arg2, arg3) {
            arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
        },
        __wbg_uniform2uiv_aaa076c2f50b5c86: function(arg0, arg1, arg2, arg3) {
            arg0.uniform2uiv(arg1, getArrayU32FromWasm0(arg2, arg3));
        },
        __wbg_uniform3fv_2e139d144894f1ec: function(arg0, arg1, arg2, arg3) {
            arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
        },
        __wbg_uniform3fv_dfaba6b65cfc2c2b: function(arg0, arg1, arg2, arg3) {
            arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
        },
        __wbg_uniform3iv_700228c611ca323d: function(arg0, arg1, arg2, arg3) {
            arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
        },
        __wbg_uniform3iv_f32512d7179442f8: function(arg0, arg1, arg2, arg3) {
            arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
        },
        __wbg_uniform3uiv_c972de1ee5eb2b48: function(arg0, arg1, arg2, arg3) {
            arg0.uniform3uiv(arg1, getArrayU32FromWasm0(arg2, arg3));
        },
        __wbg_uniform4f_b5ea01e0388c425e: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
        },
        __wbg_uniform4f_b9880b3e743b1cf3: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
        },
        __wbg_uniform4fv_0763a5cfb3d561c9: function(arg0, arg1, arg2, arg3) {
            arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
        },
        __wbg_uniform4fv_95b1afba56301916: function(arg0, arg1, arg2, arg3) {
            arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
        },
        __wbg_uniform4iv_1269cd3a3f01909d: function(arg0, arg1, arg2, arg3) {
            arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
        },
        __wbg_uniform4iv_84dc6c0b2ea09256: function(arg0, arg1, arg2, arg3) {
            arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
        },
        __wbg_uniform4uiv_13ca9c250b538d85: function(arg0, arg1, arg2, arg3) {
            arg0.uniform4uiv(arg1, getArrayU32FromWasm0(arg2, arg3));
        },
        __wbg_uniformBlockBinding_d97dbfc1886608c9: function(arg0, arg1, arg2, arg3) {
            arg0.uniformBlockBinding(arg1, arg2 >>> 0, arg3 >>> 0);
        },
        __wbg_uniformMatrix2fv_4a95dd9315ceafce: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix2fv_554c771038fd18e7: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix2x3fv_18f2ff07b55f7458: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix2x3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix2x4fv_2b66cdeb52233873: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix2x4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix3fv_303d7eef53df7ed2: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix3fv_a9db97f34b3706b3: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix3x2fv_67c65614f0e122e8: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix3x2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix3x4fv_e3bd46b1bf5227ed: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix3x4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix4fv_db6f9ad4f00e3b76: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix4fv_e411faf4de6021c5: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix4x2fv_c59133281828fe8e: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix4x2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_uniformMatrix4x3fv_dc85828b88505234: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.uniformMatrix4x3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
        },
        __wbg_unmap_8f06698a75b8331a: function(arg0) {
            arg0.unmap();
        },
        __wbg_usage_ffc49211c0488f66: function(arg0) {
            const ret = arg0.usage;
            return ret;
        },
        __wbg_useProgram_7019ac9ef4bdbe96: function(arg0, arg1) {
            arg0.useProgram(arg1);
        },
        __wbg_useProgram_fcab4319331e0094: function(arg0, arg1) {
            arg0.useProgram(arg1);
        },
        __wbg_userAgent_8f029431f94bc023: function() { return handleError(function (arg0, arg1) {
            const ret = arg1.userAgent;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        }, arguments); },
        __wbg_value_8215ae6d5fec3d34: function(arg0, arg1) {
            const ret = arg1.value;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_vertexAttribDivisorANGLE_5bebd4490e25d0f4: function(arg0, arg1, arg2) {
            arg0.vertexAttribDivisorANGLE(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_vertexAttribDivisor_e2a9ba8c397af61b: function(arg0, arg1, arg2) {
            arg0.vertexAttribDivisor(arg1 >>> 0, arg2 >>> 0);
        },
        __wbg_vertexAttribIPointer_660e209bed7575ab: function(arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.vertexAttribIPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
        },
        __wbg_vertexAttribPointer_b6db7a62b9bda090: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
        },
        __wbg_vertexAttribPointer_ed019b681b1aaacf: function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
        },
        __wbg_viewport_704a6159fb0395cb: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.viewport(arg1, arg2, arg3, arg4);
        },
        __wbg_viewport_f9d3214251b38c39: function(arg0, arg1, arg2, arg3, arg4) {
            arg0.viewport(arg1, arg2, arg3, arg4);
        },
        __wbg_warn_d3544c7814fab534: function(arg0) {
            console.warn(arg0);
        },
        __wbg_width_66ae60ec9345f56c: function(arg0) {
            const ret = arg0.width;
            return ret;
        },
        __wbg_width_b5e609025d3f7451: function(arg0) {
            const ret = arg0.width;
            return ret;
        },
        __wbg_writeBuffer_b4bdd36178348ca5: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            arg0.writeBuffer(arg1, arg2, getArrayU8FromWasm0(arg3, arg4), arg5, arg6);
        }, arguments); },
        __wbg_writeText_efbdad9c92eb55b9: function(arg0, arg1, arg2) {
            const ret = arg0.writeText(getStringFromWasm0(arg1, arg2));
            return ret;
        },
        __wbg_writeTexture_b45b69132e46a227: function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
            arg0.writeTexture(arg1, getArrayU8FromWasm0(arg2, arg3), arg4, arg5);
        }, arguments); },
        __wbg_write_bab58216a7c54852: function(arg0, arg1) {
            const ret = arg0.write(arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 2365, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___wasm_bindgen_cd4d31d4f9b3845d___JsValue__core_608f92abc48d28da___result__Result_____wasm_bindgen_cd4d31d4f9b3845d___JsError___true_);
            return ret;
        },
        __wbindgen_generic_0000000000000002: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [Externref], shim_idx: 426, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___wasm_bindgen_cd4d31d4f9b3845d___JsValue______true_);
            return ret;
        },
        __wbindgen_generic_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("Array<any>")], shim_idx: 155, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Array______true_);
            return ret;
        },
        __wbindgen_generic_0000000000000004: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [NamedExternref("Event")], shim_idx: 155, ret: Unit, inner_ret: Some(Unit) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Array______true__7);
            return ret;
        },
        __wbindgen_generic_0000000000000005: function(arg0, arg1) {
            // Cast intrinsic for `Closure(Closure { owned: true, function: Function { arguments: [], shim_idx: 158, ret: Result(Unit), inner_ret: Some(Result(Unit)) }, mutable: true }) -> Externref`.
            const ret = makeMutClosure(arg0, arg1, wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___core_608f92abc48d28da___result__Result_____wasm_bindgen_cd4d31d4f9b3845d___JsValue___true_);
            return ret;
        },
        __wbindgen_generic_0000000000000006: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_generic_0000000000000007: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(F32)) -> NamedExternref("Float32Array")`.
            const ret = getArrayF32FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000008: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(I16)) -> NamedExternref("Int16Array")`.
            const ret = getArrayI16FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_0000000000000009: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(I32)) -> NamedExternref("Int32Array")`.
            const ret = getArrayI32FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_000000000000000a: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(I8)) -> NamedExternref("Int8Array")`.
            const ret = getArrayI8FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_000000000000000b: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U16)) -> NamedExternref("Uint16Array")`.
            const ret = getArrayU16FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_000000000000000c: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U32)) -> NamedExternref("Uint32Array")`.
            const ret = getArrayU32FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_000000000000000d: function(arg0, arg1) {
            // Cast intrinsic for `Ref(Slice(U8)) -> NamedExternref("Uint8Array")`.
            const ret = getArrayU8FromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_generic_000000000000000e: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./overlay_editor_bg.js": import0,
    };
}

function wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___core_608f92abc48d28da___result__Result_____wasm_bindgen_cd4d31d4f9b3845d___JsValue___true_(arg0, arg1) {
    const ret = wasm.wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___core_608f92abc48d28da___result__Result_____wasm_bindgen_cd4d31d4f9b3845d___JsValue___true_(arg0, arg1);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___wasm_bindgen_cd4d31d4f9b3845d___JsValue______true_(arg0, arg1, arg2) {
    wasm.wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___wasm_bindgen_cd4d31d4f9b3845d___JsValue______true_(arg0, arg1, arg2);
}

function wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Array______true_(arg0, arg1, arg2) {
    wasm.wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Array______true_(arg0, arg1, arg2);
}

function wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Array______true__7(arg0, arg1, arg2) {
    wasm.wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Array______true__7(arg0, arg1, arg2);
}

function wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___wasm_bindgen_cd4d31d4f9b3845d___JsValue__core_608f92abc48d28da___result__Result_____wasm_bindgen_cd4d31d4f9b3845d___JsError___true_(arg0, arg1, arg2) {
    const ret = wasm.wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___wasm_bindgen_cd4d31d4f9b3845d___JsValue__core_608f92abc48d28da___result__Result_____wasm_bindgen_cd4d31d4f9b3845d___JsError___true_(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Function_fn_wasm_bindgen_cd4d31d4f9b3845d___JsValue_____wasm_bindgen_cd4d31d4f9b3845d___sys__Undefined___js_sys_fe22bded58295d21___Function_fn_wasm_bindgen_cd4d31d4f9b3845d___JsValue_____wasm_bindgen_cd4d31d4f9b3845d___sys__Undefined_______true_(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen_cd4d31d4f9b3845d___convert__closures_____invoke___js_sys_fe22bded58295d21___Function_fn_wasm_bindgen_cd4d31d4f9b3845d___JsValue_____wasm_bindgen_cd4d31d4f9b3845d___sys__Undefined___js_sys_fe22bded58295d21___Function_fn_wasm_bindgen_cd4d31d4f9b3845d___JsValue_____wasm_bindgen_cd4d31d4f9b3845d___sys__Undefined_______true_(arg0, arg1, arg2, arg3);
}


const __wbindgen_enum_GpuAddressMode = ["clamp-to-edge", "repeat", "mirror-repeat"];


const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha"];


const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];


const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];


const __wbindgen_enum_GpuCanvasAlphaMode = ["opaque", "premultiplied"];


const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];


const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];


const __wbindgen_enum_GpuFilterMode = ["nearest", "linear"];


const __wbindgen_enum_GpuFrontFace = ["ccw", "cw"];


const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];


const __wbindgen_enum_GpuLoadOp = ["load", "clear"];


const __wbindgen_enum_GpuMipmapFilterMode = ["nearest", "linear"];


const __wbindgen_enum_GpuPowerPreference = ["low-power", "high-performance"];


const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];


const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];


const __wbindgen_enum_GpuStencilOperation = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];


const __wbindgen_enum_GpuStorageTextureAccess = ["write-only", "read-only", "read-write"];


const __wbindgen_enum_GpuStoreOp = ["store", "discard"];


const __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];


const __wbindgen_enum_GpuTextureDimension = ["1d", "2d", "3d"];


const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];


const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];


const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];


const __wbindgen_enum_GpuVertexFormat = ["uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra"];


const __wbindgen_enum_GpuVertexStepMode = ["vertex", "instance"];


const __wbindgen_enum_ResizeObserverBoxOptions = ["border-box", "content-box", "device-pixel-content-box"];
const WebAppFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_webapp_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => wasm.__wbindgen_destroy_closure(state.a, state.b));

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

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayI16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayI8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayU16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedFloat32ArrayMemory0 = null;
function getFloat32ArrayMemory0() {
    if (cachedFloat32ArrayMemory0 === null || cachedFloat32ArrayMemory0.byteLength === 0) {
        cachedFloat32ArrayMemory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32ArrayMemory0;
}

let cachedInt16ArrayMemory0 = null;
function getInt16ArrayMemory0() {
    if (cachedInt16ArrayMemory0 === null || cachedInt16ArrayMemory0.byteLength === 0) {
        cachedInt16ArrayMemory0 = new Int16Array(wasm.memory.buffer);
    }
    return cachedInt16ArrayMemory0;
}

let cachedInt32ArrayMemory0 = null;
function getInt32ArrayMemory0() {
    if (cachedInt32ArrayMemory0 === null || cachedInt32ArrayMemory0.byteLength === 0) {
        cachedInt32ArrayMemory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32ArrayMemory0;
}

let cachedInt8ArrayMemory0 = null;
function getInt8ArrayMemory0() {
    if (cachedInt8ArrayMemory0 === null || cachedInt8ArrayMemory0.byteLength === 0) {
        cachedInt8ArrayMemory0 = new Int8Array(wasm.memory.buffer);
    }
    return cachedInt8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint16ArrayMemory0 = null;
function getUint16ArrayMemory0() {
    if (cachedUint16ArrayMemory0 === null || cachedUint16ArrayMemory0.byteLength === 0) {
        cachedUint16ArrayMemory0 = new Uint16Array(wasm.memory.buffer);
    }
    return cachedUint16ArrayMemory0;
}

let cachedUint32ArrayMemory0 = null;
function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
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

function makeMutClosure(arg0, arg1, f) {
    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (...args) => {

        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            state.a = a;
            real._wbg_cb_unref();
        }
    };
    real._wbg_cb_unref = () => {
        if (--state.cnt === 0) {
            wasm.__wbindgen_destroy_closure(state.a, state.b);
            state.a = 0;
            CLOSURE_DTORS.unregister(state);
        }
    };
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

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
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedFloat32ArrayMemory0 = null;
    cachedInt16ArrayMemory0 = null;
    cachedInt32ArrayMemory0 = null;
    cachedInt8ArrayMemory0 = null;
    cachedUint16ArrayMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
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

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('overlay_editor_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
