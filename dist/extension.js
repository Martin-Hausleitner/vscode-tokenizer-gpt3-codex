/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

"use strict";
module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const wasm = __webpack_require__(3);
let imports = {};
imports["./tiktoken_bg.js"] = wasm;
const path = __webpack_require__(4);
const fs = __webpack_require__(5);

const candidates = __dirname
  .split(path.sep)
  .reduce((memo, _, index, array) => {
    const prefix = array.slice(0, index + 1).join(path.sep) + path.sep;
    if (!prefix.includes("node_modules" + path.sep)) {
      memo.unshift(
        path.join(
          prefix,
          "node_modules",
          "tiktoken",
          "",
          "./tiktoken_bg.wasm"
        )
      );
    }
    return memo;
  }, [])
candidates.unshift(path.join(__dirname, "./tiktoken_bg.wasm"));

let bytes = null;
for (const candidate of candidates) {
  try {
    bytes = fs.readFileSync(candidate);
    break;
  } catch {}
}

if (bytes == null) throw new Error("Missing tiktoken_bg.wasm");
const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm.__wbg_set_wasm(wasmInstance.exports);
exports.get_encoding = wasm["get_encoding"];
exports.encoding_for_model = wasm["encoding_for_model"];
exports.Tiktoken = wasm["Tiktoken"];

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
let wasm;
module.exports.__wbg_set_wasm = function(val) {
    wasm = val;
};
const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

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

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32ArrayMemory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
module.exports.get_encoding = function(encoding, extend_special_tokens) {
    if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(encoding, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.get_encoding(retptr, ptr0, len0, addHeapObject(extend_special_tokens));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return Tiktoken.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};
module.exports.encoding_for_model = function(model, extend_special_tokens) {
    if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(model, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.encoding_for_model(retptr, ptr0, len0, addHeapObject(extend_special_tokens));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return Tiktoken.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export_3(addHeapObject(e));
    }
}

const TiktokenFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tiktoken_free(ptr >>> 0, 1));
/** */
class Tiktoken {
    /**
     * @param {string} tiktoken_bfe
     * @param {any} special_tokens
     * @param {string} pat_str
     */
    constructor(tiktoken_bfe, special_tokens, pat_str) {
        if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
        const ptr0 = passStringToWasm0(tiktoken_bfe, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(pat_str, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.tiktoken_new(ptr0, len0, addHeapObject(special_tokens), ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        TiktokenFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }

    /** @returns {string | undefined} */
    get name() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tiktoken_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_2(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Tiktoken.prototype);
        obj.__wbg_ptr = ptr;
        TiktokenFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TiktokenFinalization.unregister(this);
        return ptr;
    }

    free() {
        if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tiktoken_free(ptr, 0);
    }

    /**
     * @param {string} text
     * @param {any} allowed_special
     * @param {any} disallowed_special
     * @returns {Uint32Array}
     */
    encode(text, allowed_special, disallowed_special) {
        if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.tiktoken_encode(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(allowed_special), addHeapObject(disallowed_special));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v2 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_2(r0, r1 * 4, 4);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
     * @param {string} text
     * @returns {Uint32Array}
     */
    encode_ordinary(text) {
        if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.tiktoken_encode_ordinary(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v2 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_2(r0, r1 * 4, 4);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
     * @param {string} text
     * @param {any} allowed_special
     * @param {any} disallowed_special
     * @returns {any}
     */
    encode_with_unstable(text, allowed_special, disallowed_special) {
        if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.tiktoken_encode_with_unstable(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(allowed_special), addHeapObject(disallowed_special));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
     * @param {Uint8Array} bytes
     * @returns {number}
     */
    encode_single_token(bytes) {
        if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.tiktoken_encode_single_token(this.__wbg_ptr, ptr0, len0);
        return ret >>> 0;
    }

    /**
     * @param {Uint32Array} tokens
     * @returns {Uint8Array}
     */
    decode(tokens) {
        if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray32ToWasm0(tokens, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            wasm.tiktoken_decode(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v2 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_2(r0, r1 * 1, 1);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
     * @param {number} token
     * @returns {Uint8Array}
     */
    decode_single_token_bytes(token) {
        if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tiktoken_decode_single_token_bytes(retptr, this.__wbg_ptr, token);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_2(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /** @returns {any} */
    token_byte_values() {
        if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
        const ret = wasm.tiktoken_token_byte_values(this.__wbg_ptr);
        return takeObject(ret);
    }
}
module.exports.Tiktoken = Tiktoken;
module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};
;
module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};
;
module.exports.__wbindgen_string_get = function(arg0, arg1) {
    if (wasm == null) throw new Error("tiktoken: WASM binary has not been propery initialized.");
    const obj = getObject(arg1);
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};
;
module.exports.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};
;
module.exports.__wbg_parse_52202f117ec9ecfa = function() {
    return handleError(function (arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
;
module.exports.__wbg_stringify_bbf45426c92a6bf5 = function() {
    return handleError(function (arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
;
module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
;



/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const vscode = __webpack_require__(1);
const tiktoken_1 = __webpack_require__(2);
const validModels = [
    "davinci-002",
    "babbage-002",
    "text-davinci-003",
    "text-davinci-002",
    "text-davinci-001",
    "text-curie-001",
    "text-babbage-001",
    "text-ada-001",
    "davinci",
    "curie",
    "babbage",
    "ada",
    "code-davinci-002",
    "code-davinci-001",
    "code-cushman-002",
    "code-cushman-001",
    "davinci-codex",
    "cushman-codex",
    "text-davinci-edit-001",
    "code-davinci-edit-001",
    "text-embedding-ada-002",
    "text-similarity-davinci-001",
    "text-similarity-curie-001",
    "text-similarity-babbage-001",
    "text-similarity-ada-001",
    "text-search-davinci-doc-001",
    "text-search-curie-doc-001",
    "text-search-babbage-doc-001",
    "text-search-ada-doc-001",
    "code-search-babbage-code-001",
    "code-search-ada-code-001",
    "gpt2",
    "gpt-3.5-turbo",
    "gpt-35-turbo",
    "gpt-3.5-turbo-0301",
    "gpt-3.5-turbo-0613",
    "gpt-3.5-turbo-1106",
    "gpt-3.5-turbo-0125",
    "gpt-3.5-turbo-16k",
    "gpt-3.5-turbo-16k-0613",
    "gpt-3.5-turbo-instruct",
    "gpt-3.5-turbo-instruct-0914",
    "gpt-4",
    "gpt-4-0314",
    "gpt-4-0613",
    "gpt-4-32k",
    "gpt-4-32k-0314",
    "gpt-4-32k-0613",
    "gpt-4-turbo",
    "gpt-4-turbo-2024-04-09",
    "gpt-4-turbo-preview",
    "gpt-4-1106-preview",
    "gpt-4-0125-preview",
    "gpt-4-vision-preview",
    "gpt-4o",
    "gpt-4o-2024-05-13"
];
function activate(context) {
    const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    context.subscriptions.push(statusBar);
    statusBar.command = "vscode-tokenizer-gpt3-codex.changeTokenizerType"; // Füge Command zum Statusbar-Item hinzu
    let displayEnabled = true;
    updateStatusBarItem();
    context.subscriptions.push(vscode.commands.registerCommand("vscode-tokenizer-gpt3-codex.toggleTokenCount", () => {
        displayEnabled = !displayEnabled;
        updateStatusBarItem();
        vscode.window.showInformationMessage("🔄 Token count toggled!");
    }));
    context.subscriptions.push(vscode.commands.registerCommand("vscode-tokenizer-gpt3-codex.changeTokenizerType", async () => {
        const type = await vscode.window.showQuickPick(validModels);
        if (type) {
            const config = vscode.workspace.getConfiguration("openaiTokenizer");
            await config.update("type", type, vscode.ConfigurationTarget.Global);
            updateStatusBarItem();
            vscode.window.showInformationMessage(`🔀 Tokenizer type changed to ${type}!`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand("vscode-tokenizer-gpt3-codex.toggleTokenizerType", async () => {
        const config = vscode.workspace.getConfiguration("openaiTokenizer");
        const currentType = config.get("type") || "gpt-4";
        const newType = currentType === "gpt-4" ? "gpt-3.5-turbo" : "gpt-4";
        await config.update("type", newType, vscode.ConfigurationTarget.Global);
        updateStatusBarItem();
        vscode.window.showInformationMessage(`🔄 Tokenizer type toggled to ${newType}!`);
    }));
    vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem, null, context.subscriptions);
    vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(updateStatusBarItem, null, context.subscriptions);
    function updateStatusBarItem() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !displayEnabled) {
            statusBar.hide();
            return;
        }
        const document = editor.document;
        const selection = editor.selection;
        let content = "";
        if (!selection.isEmpty) {
            content = document.getText(selection);
        }
        else {
            content = document.getText();
        }
        const config = vscode.workspace.getConfiguration("openaiTokenizer");
        var type = config.get("type") || "gpt-4";
        // check if type is valid
        if (!validModels.includes(type)) {
            type = "gpt-4";
        }
        const encoder = (0, tiktoken_1.encoding_for_model)(type);
        const tokens = encoder.encode(content);
        statusBar.text = `${tokens.length} Tokens (${type})`;
        encoder.free();
        statusBar.show();
    }
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map