"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[879],{238:function(e,t,n){e.exports=n.p+"static/media/pna_bg.046173e0.wasm"},7879:function(e,t,n){let r;n.r(t),n.d(t,{Archive:function(){return Archive},Entries:function(){return Entries},Entry:function(){return Entry},initSync:function(){return initSync}}),e=n.hmd(e);let _=Array(128).fill(void 0);_.push(void 0,null,!0,!1);let a=_.length;function dropObject(e){e<132||(_[e]=a,a=e)}function takeObject(e){let t=_[e];return dropObject(e),t}let i="undefined"!=typeof TextDecoder?new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};"undefined"!=typeof TextDecoder&&i.decode();let o=null;function getUint8Memory0(){return(null===o||0===o.byteLength)&&(o=new Uint8Array(r.memory.buffer)),o}function getStringFromWasm0(e,t){return e>>>=0,i.decode(getUint8Memory0().subarray(e,e+t))}function addHeapObject(e){a===_.length&&_.push(_.length+1);let t=a;return a=_[t],_[t]=e,t}function debugString(e){let t;let n=typeof e;if("number"==n||"boolean"==n||null==e)return"".concat(e);if("string"==n)return'"'.concat(e,'"');if("symbol"==n){let t=e.description;return null==t?"Symbol":"Symbol(".concat(t,")")}if("function"==n){let t=e.name;return"string"==typeof t&&t.length>0?"Function(".concat(t,")"):"Function"}if(Array.isArray(e)){let t=e.length,n="[";t>0&&(n+=debugString(e[0]));for(let r=1;r<t;r++)n+=", "+debugString(e[r]);return n+"]"}let r=/\[object ([^\]]+)\]/.exec(toString.call(e));if(!(r.length>1))return toString.call(e);if("Object"==(t=r[1]))try{return"Object("+JSON.stringify(e)+")"}catch(e){return"Object"}return e instanceof Error?"".concat(e.name,": ").concat(e.message,"\n").concat(e.stack):t}let c=0,b="undefined"!=typeof TextEncoder?new TextEncoder("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},u="function"==typeof b.encodeInto?function(e,t){return b.encodeInto(e,t)}:function(e,t){let n=b.encode(e);return t.set(n),{read:e.length,written:n.length}};function passStringToWasm0(e,t,n){if(void 0===n){let n=b.encode(e),r=t(n.length,1)>>>0;return getUint8Memory0().subarray(r,r+n.length).set(n),c=n.length,r}let r=e.length,_=t(r,1)>>>0,a=getUint8Memory0(),i=0;for(;i<r;i++){let t=e.charCodeAt(i);if(t>127)break;a[_+i]=t}if(i!==r){0!==i&&(e=e.slice(i)),_=n(_,r,r=i+3*e.length,1)>>>0;let t=getUint8Memory0().subarray(_+i,_+r),a=u(e,t);i+=a.written}return c=i,_}let l=null;function getInt32Memory0(){return(null===l||0===l.byteLength)&&(l=new Int32Array(r.memory.buffer)),l}function makeMutClosure(e,t,n,_){let a={a:e,b:t,cnt:1,dtor:n},real=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];a.cnt++;let i=a.a;a.a=0;try{return _(i,a.b,...t)}finally{0==--a.cnt?r.__wbindgen_export_2.get(a.dtor)(i,a.b):a.a=i}};return real.original=a,real}function __wbg_adapter_24(e,t,n){r._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h39069a78a0e1a442(e,t,addHeapObject(n))}let g=null;function getUint32Memory0(){return(null===g||0===g.byteLength)&&(g=new Uint32Array(r.memory.buffer)),g}function getArrayJsValueFromWasm0(e,t){e>>>=0;let n=getUint32Memory0(),r=n.subarray(e/4,e/4+t),_=[];for(let e=0;e<r.length;e++)_.push(takeObject(r[e]));return _}function passArrayJsValueToWasm0(e,t){let n=t(4*e.length,4)>>>0,r=getUint32Memory0();for(let t=0;t<e.length;t++)r[n/4+t]=addHeapObject(e[t]);return c=e.length,n}function handleError(e,t){try{return e.apply(this,t)}catch(e){r.__wbindgen_exn_store(addHeapObject(e))}}function __wbg_adapter_78(e,t,n,_){r.wasm_bindgen__convert__closures__invoke2_mut__h110667800ab2d66a(e,t,addHeapObject(n),addHeapObject(_))}let Archive=class Archive{static __wrap(e){e>>>=0;let t=Object.create(Archive.prototype);return t.__wbg_ptr=e,t}__destroy_into_raw(){let e=this.__wbg_ptr;return this.__wbg_ptr=0,e}free(){let e=this.__destroy_into_raw();r.__wbg_archive_free(e)}static create(e){let t=passArrayJsValueToWasm0(e,r.__wbindgen_malloc),n=c,_=r.archive_create(t,n);return Archive.__wrap(_)}static from(e){let t=r.archive_from(addHeapObject(e));return takeObject(t)}entries(){let e=r.archive_entries(this.__wbg_ptr);return takeObject(e)}static extract_to_entries(e){let t=r.archive_extract_to_entries(addHeapObject(e));return takeObject(t)}to_u8array(){let e=r.archive_to_u8array(this.__wbg_ptr);return takeObject(e)}};let Entries=class Entries{static __wrap(e){e>>>=0;let t=Object.create(Entries.prototype);return t.__wbg_ptr=e,t}__destroy_into_raw(){let e=this.__wbg_ptr;return this.__wbg_ptr=0,e}free(){let e=this.__destroy_into_raw();r.__wbg_entries_free(e)}array(){try{let _=this.__destroy_into_raw(),a=r.__wbindgen_add_to_stack_pointer(-16);r.entries_array(a,_);var e=getInt32Memory0()[a/4+0],t=getInt32Memory0()[a/4+1],n=getArrayJsValueFromWasm0(e,t).slice();return r.__wbindgen_free(e,4*t,4),n}finally{r.__wbindgen_add_to_stack_pointer(16)}}};let Entry=class Entry{static __wrap(e){e>>>=0;let t=Object.create(Entry.prototype);return t.__wbg_ptr=e,t}static __unwrap(e){return e instanceof Entry?e.__destroy_into_raw():0}__destroy_into_raw(){let e=this.__wbg_ptr;return this.__wbg_ptr=0,e}free(){let e=this.__destroy_into_raw();r.__wbg_entry_free(e)}static new(e){let t=r.entry_new(addHeapObject(e));return takeObject(t)}name(){let e,t;try{let a=r.__wbindgen_add_to_stack_pointer(-16);r.entry_name(a,this.__wbg_ptr);var n=getInt32Memory0()[a/4+0],_=getInt32Memory0()[a/4+1];return e=n,t=_,getStringFromWasm0(n,_)}finally{r.__wbindgen_add_to_stack_pointer(16),r.__wbindgen_free(e,t,1)}}extract(){let e=r.entry_extract(this.__wbg_ptr);return takeObject(e)}};async function __wbg_load(e,t){if("function"==typeof Response&&e instanceof Response){if("function"==typeof WebAssembly.instantiateStreaming)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if("application/wasm"!=e.headers.get("Content-Type"))console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",t);else throw t}let n=await e.arrayBuffer();return await WebAssembly.instantiate(n,t)}{let n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}}function __wbg_get_imports(){let t={};return t.wbg={},t.wbg.__wbg_archive_new=function(e){let t=Archive.__wrap(e);return addHeapObject(t)},t.wbg.__wbg_entry_unwrap=function(e){let t=Entry.__unwrap(takeObject(e));return t},t.wbg.__wbindgen_object_drop_ref=function(e){takeObject(e)},t.wbg.__wbg_entry_new=function(e){let t=Entry.__wrap(e);return addHeapObject(t)},t.wbg.__wbg_entries_new=function(e){let t=Entries.__wrap(e);return addHeapObject(t)},t.wbg.__wbg_arrayBuffer_a9d862b05aaee2f9=function(e){let t=_[e].arrayBuffer();return addHeapObject(t)},t.wbg.__wbg_name_bbf9c43b9611377a=function(e,t){let n=_[t].name,a=passStringToWasm0(n,r.__wbindgen_malloc,r.__wbindgen_realloc),i=c;getInt32Memory0()[e/4+1]=i,getInt32Memory0()[e/4+0]=a},t.wbg.__wbg_crypto_58f13aa23ffcb166=function(e){let t=_[e].crypto;return addHeapObject(t)},t.wbg.__wbindgen_is_object=function(e){let t=_[e];return"object"==typeof t&&null!==t},t.wbg.__wbg_process_5b786e71d465a513=function(e){let t=_[e].process;return addHeapObject(t)},t.wbg.__wbg_versions_c2ab80650590b6a2=function(e){let t=_[e].versions;return addHeapObject(t)},t.wbg.__wbg_node_523d7bd03ef69fba=function(e){let t=_[e].node;return addHeapObject(t)},t.wbg.__wbindgen_is_string=function(e){let t="string"==typeof _[e];return t},t.wbg.__wbg_require_2784e593a4674877=function(){return handleError(function(){let t=e.require;return addHeapObject(t)},arguments)},t.wbg.__wbindgen_string_new=function(e,t){let n=getStringFromWasm0(e,t);return addHeapObject(n)},t.wbg.__wbg_msCrypto_abcb1295e768d1f2=function(e){let t=_[e].msCrypto;return addHeapObject(t)},t.wbg.__wbg_randomFillSync_a0d98aa11c81fe89=function(){return handleError(function(e,t){_[e].randomFillSync(takeObject(t))},arguments)},t.wbg.__wbg_getRandomValues_504510b5564925af=function(){return handleError(function(e,t){_[e].getRandomValues(_[t])},arguments)},t.wbg.__wbg_new_abda76e883ba8a5f=function(){let e=Error();return addHeapObject(e)},t.wbg.__wbg_stack_658279fe44541cf6=function(e,t){let n=_[t].stack,a=passStringToWasm0(n,r.__wbindgen_malloc,r.__wbindgen_realloc),i=c;getInt32Memory0()[e/4+1]=i,getInt32Memory0()[e/4+0]=a},t.wbg.__wbg_error_f851667af71bcfc6=function(e,t){let n,_;try{n=e,_=t,console.error(getStringFromWasm0(e,t))}finally{r.__wbindgen_free(n,_,1)}},t.wbg.__wbindgen_cb_drop=function(e){let t=takeObject(e).original;return 1==t.cnt--&&(t.a=0,!0)},t.wbg.__wbg_queueMicrotask_4d890031a6a5a50c=function(e){queueMicrotask(_[e])},t.wbg.__wbg_queueMicrotask_adae4bc085237231=function(e){let t=_[e].queueMicrotask;return addHeapObject(t)},t.wbg.__wbindgen_is_function=function(e){let t="function"==typeof _[e];return t},t.wbg.__wbg_newnoargs_c62ea9419c21fbac=function(e,t){let n=Function(getStringFromWasm0(e,t));return addHeapObject(n)},t.wbg.__wbg_call_90c26b09837aba1c=function(){return handleError(function(e,t){let n=_[e].call(_[t]);return addHeapObject(n)},arguments)},t.wbg.__wbg_self_f0e34d89f33b99fd=function(){return handleError(function(){let e=self.self;return addHeapObject(e)},arguments)},t.wbg.__wbg_window_d3b084224f4774d7=function(){return handleError(function(){let e=window.window;return addHeapObject(e)},arguments)},t.wbg.__wbg_globalThis_9caa27ff917c6860=function(){return handleError(function(){let e=globalThis.globalThis;return addHeapObject(e)},arguments)},t.wbg.__wbg_global_35dfdd59a4da3e74=function(){return handleError(function(){let e=n.g.global;return addHeapObject(e)},arguments)},t.wbg.__wbindgen_is_undefined=function(e){let t=void 0===_[e];return t},t.wbg.__wbg_call_5da1969d7cd31ccd=function(){return handleError(function(e,t,n){let r=_[e].call(_[t],_[n]);return addHeapObject(r)},arguments)},t.wbg.__wbg_new_60f57089c7563e81=function(e,t){try{var n={a:e,b:t};let r=new Promise((e,t)=>{let r=n.a;n.a=0;try{return __wbg_adapter_78(r,n.b,e,t)}finally{n.a=r}});return addHeapObject(r)}finally{n.a=n.b=0}},t.wbg.__wbg_resolve_6e1c6553a82f85b7=function(e){let t=Promise.resolve(_[e]);return addHeapObject(t)},t.wbg.__wbg_then_3ab08cd4fbb91ae9=function(e,t){let n=_[e].then(_[t]);return addHeapObject(n)},t.wbg.__wbg_then_8371cc12cfedc5a2=function(e,t,n){let r=_[e].then(_[t],_[n]);return addHeapObject(r)},t.wbg.__wbg_buffer_a448f833075b71ba=function(e){let t=_[e].buffer;return addHeapObject(t)},t.wbg.__wbg_newwithbyteoffsetandlength_d0482f893617af71=function(e,t,n){let r=new Uint8Array(_[e],t>>>0,n>>>0);return addHeapObject(r)},t.wbg.__wbg_new_8f67e318f15d7254=function(e){let t=new Uint8Array(_[e]);return addHeapObject(t)},t.wbg.__wbg_set_2357bf09366ee480=function(e,t,n){_[e].set(_[t],n>>>0)},t.wbg.__wbg_length_1d25fa9e4ac21ce7=function(e){let t=_[e].length;return t},t.wbg.__wbg_newwithlength_6c2df9e2f3028c43=function(e){let t=new Uint8Array(e>>>0);return addHeapObject(t)},t.wbg.__wbg_subarray_2e940e41c0f5a1d9=function(e,t,n){let r=_[e].subarray(t>>>0,n>>>0);return addHeapObject(r)},t.wbg.__wbindgen_object_clone_ref=function(e){let t=_[e];return addHeapObject(t)},t.wbg.__wbindgen_debug_string=function(e,t){let n=debugString(_[t]),a=passStringToWasm0(n,r.__wbindgen_malloc,r.__wbindgen_realloc),i=c;getInt32Memory0()[e/4+1]=i,getInt32Memory0()[e/4+0]=a},t.wbg.__wbindgen_throw=function(e,t){throw Error(getStringFromWasm0(e,t))},t.wbg.__wbindgen_memory=function(){let e=r.memory;return addHeapObject(e)},t.wbg.__wbindgen_closure_wrapper1718=function(e,t,n){let r=makeMutClosure(e,t,422,__wbg_adapter_24);return addHeapObject(r)},t}function __wbg_finalize_init(e,t){return r=e.exports,__wbg_init.__wbindgen_wasm_module=t,l=null,g=null,o=null,r}function initSync(e){if(void 0!==r)return r;let t=__wbg_get_imports();e instanceof WebAssembly.Module||(e=new WebAssembly.Module(e));let n=new WebAssembly.Instance(e,t);return __wbg_finalize_init(n,e)}async function __wbg_init(e){if(void 0!==r)return r;void 0===e&&(e=new n.U(n(238)));let t=__wbg_get_imports();("string"==typeof e||"function"==typeof Request&&e instanceof Request||"function"==typeof URL&&e instanceof URL)&&(e=fetch(e));let{instance:_,module:a}=await __wbg_load(await e,t);return __wbg_finalize_init(_,a)}t.default=__wbg_init}}]);