var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function(a) {
  return a.raw = a;
};
$jscomp.createTemplateTagFirstArgWithRaw = function(a, b) {
  a.raw = b;
  return a;
};
$jscomp.owns = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
$jscomp.getGlobal = function(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global,];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(a, b, c) {
  if (!c || null != a) {
    c = $jscomp.propertyToPolyfillSymbol[b];
    if (null == c) {
      return a[b];
    }
    c = a[c];
    return void 0 !== c ? c : a[b];
  }
};
$jscomp.polyfill = function(a, b, c, d) {
  b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, c, d) : $jscomp.polyfillUnisolated(a, b, c, d));
};
$jscomp.polyfillUnisolated = function(a, b, c, d) {
  c = $jscomp.global;
  a = a.split(".");
  for (d = 0; d < a.length - 1; d++) {
    var e = a[d];
    if (!(e in c)) {
      return;
    }
    c = c[e];
  }
  a = a[a.length - 1];
  d = c[a];
  b = b(d);
  b != d && null != b && $jscomp.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
};
$jscomp.polyfillIsolated = function(a, b, c, d) {
  var e = a.split(".");
  a = 1 === e.length;
  d = e[0];
  d = !a && d in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var f = 0; f < e.length - 1; f++) {
    var h = e[f];
    if (!(h in d)) {
      return;
    }
    d = d[h];
  }
  e = e[e.length - 1];
  c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? d[e] : null;
  b = b(c);
  null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, e, {configurable:!0, writable:!0, value:b}) : b !== c && (void 0 === $jscomp.propertyToPolyfillSymbol[e] && (c = 1E9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[e] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(e) : $jscomp.POLYFILL_PREFIX + c + "$" + e), $jscomp.defineProperty(d, $jscomp.propertyToPolyfillSymbol[e], {configurable:!0, writable:!0, value:b})));
};
$jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (d) {
      for (var e in d) {
        $jscomp.owns(d, e) && (a[e] = d[e]);
      }
    }
  }
  return a;
};
$jscomp.polyfill("Object.assign", function(a) {
  return a || $jscomp.assign;
}, "es6", "es3");
$jscomp.polyfill("globalThis", function(a) {
  return a || $jscomp.global;
}, "es_2020", "es3");
$jscomp.checkStringArgs = function(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
};
$jscomp.polyfill("String.prototype.startsWith", function(a) {
  return a ? a : function(b, c) {
    var d = $jscomp.checkStringArgs(this, b, "startsWith");
    b += "";
    var e = d.length, f = b.length;
    c = Math.max(0, Math.min(c | 0, d.length));
    for (var h = 0; h < f && c < e;) {
      if (d[c++] != b[h++]) {
        return !1;
      }
    }
    return h >= f;
  };
}, "es6", "es3");
$jscomp.polyfill("Object.is", function(a) {
  return a ? a : function(b, c) {
    return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    var d = this;
    d instanceof String && (d = String(d));
    var e = d.length;
    c = c || 0;
    for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
      var f = d[c];
      if (f === b || Object.is(f, b)) {
        return !0;
      }
    }
    return !1;
  };
}, "es7", "es3");
$jscomp.polyfill("String.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    return -1 !== $jscomp.checkStringArgs(this, b, "includes").indexOf(b, c || 0);
  };
}, "es6", "es3");
$jscomp.arrayIteratorImpl = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++],} : {done:!0};
  };
};
$jscomp.arrayIterator = function(a) {
  return {next:$jscomp.arrayIteratorImpl(a)};
};
$jscomp.initSymbol = function() {
};
$jscomp.polyfill("Symbol", function(a) {
  if (a) {
    return a;
  }
  var b = function(f, h) {
    this.$jscomp$symbol$id_ = f;
    $jscomp.defineProperty(this, "description", {configurable:!0, writable:!0, value:h});
  };
  b.prototype.toString = function() {
    return this.$jscomp$symbol$id_;
  };
  var c = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_", d = 0, e = function(f) {
    if (this instanceof e) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new b(c + (f || "") + "_" + d++, f);
  };
  return e;
}, "es6", "es3");
$jscomp.polyfill("Symbol.iterator", function(a) {
  if (a) {
    return a;
  }
  a = Symbol("Symbol.iterator");
  for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
    var d = $jscomp.global[b[c]];
    "function" === typeof d && "function" != typeof d.prototype[a] && $jscomp.defineProperty(d.prototype, a, {configurable:!0, writable:!0, value:function() {
      return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
    }});
  }
  return a;
}, "es6", "es3");
$jscomp.iteratorPrototype = function(a) {
  a = {next:a};
  a[Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function(a, b) {
  a instanceof String && (a += "");
  var c = 0, d = !1, e = {next:function() {
    if (!d && c < a.length) {
      var f = c++;
      return {value:b(f, a[f]), done:!1};
    }
    d = !0;
    return {done:!0, value:void 0};
  }};
  e[Symbol.iterator] = function() {
    return e;
  };
  return e;
};
$jscomp.polyfill("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(b) {
      return b;
    });
  };
}, "es6", "es3");
var Module = "undefined" != typeof Module ? Module : {}, Promise = function() {
  function a() {
  }
  function b(k, l) {
    return function() {
      k.apply(l, arguments);
    };
  }
  function c(k) {
    if (!(this instanceof c)) {
      throw new TypeError("Promises must be constructed via new");
    }
    if ("function" != typeof k) {
      throw new TypeError("not a function");
    }
    this._state = 0;
    this._handled = !1;
    this._value = void 0;
    this._deferreds = [];
    p(k, this);
  }
  function d(k, l) {
    for (; 3 === k._state;) {
      k = k._value;
    }
    0 === k._state ? k._deferreds.push(l) : (k._handled = !0, c._immediateFn(function() {
      var m = 1 === k._state ? l.onFulfilled : l.onRejected;
      if (null === m) {
        (1 === k._state ? e : f)(l.promise, k._value);
      } else {
        try {
          var t = m(k._value);
        } catch (g) {
          f(l.promise, g);
          return;
        }
        e(l.promise, t);
      }
    }));
  }
  function e(k, l) {
    try {
      if (l === k) {
        throw new TypeError("A promise cannot be resolved with itself.");
      }
      if (l && ("object" == typeof l || "function" == typeof l)) {
        var m = l.then;
        if (l instanceof c) {
          k._state = 3;
          k._value = l;
          h(k);
          return;
        }
        if ("function" == typeof m) {
          p(b(m, l), k);
          return;
        }
      }
      k._state = 1;
      k._value = l;
      h(k);
    } catch (t) {
      f(k, t);
    }
  }
  function f(k, l) {
    k._state = 2;
    k._value = l;
    h(k);
  }
  function h(k) {
    2 === k._state && 0 === k._deferreds.length && c._immediateFn(function() {
      k._handled || c._unhandledRejectionFn(k._value);
    });
    for (var l = 0, m = k._deferreds.length; l < m; l++) {
      d(k, k._deferreds[l]);
    }
    k._deferreds = null;
  }
  function n(k, l, m) {
    this.onFulfilled = "function" == typeof k ? k : null;
    this.onRejected = "function" == typeof l ? l : null;
    this.promise = m;
  }
  function p(k, l) {
    var m = !1;
    try {
      k(function(t) {
        m || (m = !0, e(l, t));
      }, function(t) {
        m || (m = !0, f(l, t));
      });
    } catch (t) {
      m || (m = !0, f(l, t));
    }
  }
  c.prototype["catch"] = function(k) {
    return this.then(null, k);
  };
  c.prototype.then = function(k, l) {
    var m = new this.constructor(a);
    d(this, new n(k, l, m));
    return m;
  };
  c.all = function(k) {
    return new c(function(l, m) {
      function t(v, u) {
        try {
          if (u && ("object" == typeof u || "function" == typeof u)) {
            var x = u.then;
            if ("function" == typeof x) {
              x.call(u, function(y) {
                t(v, y);
              }, m);
              return;
            }
          }
          g[v] = u;
          0 === --q && l(g);
        } catch (y) {
          m(y);
        }
      }
      if (!Array.isArray(k)) {
        return m(new TypeError("Promise.all accepts an array"));
      }
      var g = Array.prototype.slice.call(k);
      if (0 === g.length) {
        return l([]);
      }
      for (var q = g.length, r = 0; r < g.length; r++) {
        t(r, g[r]);
      }
    });
  };
  c.resolve = function(k) {
    return k && "object" == typeof k && k.constructor == c ? k : new c(function(l) {
      l(k);
    });
  };
  c.reject = function(k) {
    return new c(function(l, m) {
      m(k);
    });
  };
  c.race = function(k) {
    return new c(function(l, m) {
      if (!Array.isArray(k)) {
        return m(new TypeError("Promise.race accepts an array"));
      }
      for (var t = 0, g = k.length; t < g; t++) {
        c.resolve(k[t]).then(l, m);
      }
    });
  };
  c._immediateFn = "function" == typeof setImmediate && function(k) {
    setImmediate(k);
  } || function(k) {
    setTimeout(k, 0);
  };
  c._unhandledRejectionFn = function(k) {
    "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", k);
  };
  return c;
}();
"undefined" == typeof Object.assign && (Object.assign = function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    if (b = arguments[c]) {
      for (var d in b) {
        b.hasOwnProperty(d) && (a[d] = b[d]);
      }
    }
  }
  return a;
});
var moduleOverrides = Object.assign({}, Module), arguments_ = [], thisProgram = "./this.program", quit_ = function(a, b) {
  throw b;
}, ENVIRONMENT_IS_WEB = "object" == typeof window, ENVIRONMENT_IS_WORKER = "function" == typeof importScripts, ENVIRONMENT_IS_NODE = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, scriptDirectory = "";
function locateFile(a) {
  return Module.locateFile ? Module.locateFile(a, scriptDirectory) : scriptDirectory + a;
}
var read_, readAsync, readBinary;
if (ENVIRONMENT_IS_NODE) {
  var fs = require("fs"), nodePath = require("path");
  scriptDirectory = ENVIRONMENT_IS_WORKER ? nodePath.dirname(scriptDirectory) + "/" : __dirname + "/";
  read_ = function(a, b) {
    a = isFileURI(a) ? new URL(a) : nodePath.normalize(a);
    return fs.readFileSync(a, b ? void 0 : "utf8");
  };
  readBinary = function(a) {
    a = read_(a, !0);
    a.buffer || (a = new Uint8Array(a));
    return a;
  };
  readAsync = function(a, b, c, d) {
    d = void 0 === d ? !0 : d;
    a = isFileURI(a) ? new URL(a) : nodePath.normalize(a);
    fs.readFile(a, d ? void 0 : "utf8", function(e, f) {
      e ? c(e) : b(d ? f.buffer : f);
    });
  };
  !Module.thisProgram && 1 < process.argv.length && (thisProgram = process.argv[1].replace(/\\/g, "/"));
  arguments_ = process.argv.slice(2);
  "undefined" != typeof module && (module.exports = Module);
  process.on("uncaughtException", function(a) {
    if (!("unwind" === a || a instanceof ExitStatus || a.context instanceof ExitStatus)) {
      throw a;
    }
  });
  var nodeMajor = process.versions.node.split(".")[0];
  if (15 > nodeMajor) {
    process.on("unhandledRejection", function(a) {
      throw a;
    });
  }
  quit_ = function(a, b) {
    process.exitCode = a;
    throw b;
  };
  Module.inspect = function() {
    return "[Emscripten Module object]";
  };
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  ENVIRONMENT_IS_WORKER ? scriptDirectory = self.location.href : "undefined" != typeof document && document.currentScript && (scriptDirectory = document.currentScript.src), scriptDirectory = 0 !== scriptDirectory.indexOf("blob:") ? scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", read_ = function(a) {
    var b = new XMLHttpRequest();
    b.open("GET", a, !1);
    b.send(null);
    return b.responseText;
  }, ENVIRONMENT_IS_WORKER && (readBinary = function(a) {
    var b = new XMLHttpRequest();
    b.open("GET", a, !1);
    b.responseType = "arraybuffer";
    b.send(null);
    return new Uint8Array(b.response);
  }), readAsync = function(a, b, c) {
    var d = new XMLHttpRequest();
    d.open("GET", a, !0);
    d.responseType = "arraybuffer";
    d.onload = function() {
      200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
    };
    d.onerror = c;
    d.send(null);
  };
}
var out = Module.print || console.log.bind(console), err = Module.printErr || console.error.bind(console);
Object.assign(Module, moduleOverrides);
moduleOverrides = null;
Module.arguments && (arguments_ = Module.arguments);
Module.thisProgram && (thisProgram = Module.thisProgram);
Module.quit && (quit_ = Module.quit);
var wasmBinary;
Module.wasmBinary && (wasmBinary = Module.wasmBinary);
var WebAssembly = {Memory:function(a) {
  this.buffer = new ArrayBuffer(65536 * a.initial);
}, Module:function(a) {
}, Instance:function(a, b) {
  this.exports = (
// EMSCRIPTEN_START_ASM
function instantiate(wa){function c(d){d.set=function(a,b){this[a]=b};d.get=function(a){return this[a]};return d}var e;var f=new Uint8Array(123);for(var a=25;a>=0;--a){f[48+a]=52+a;f[65+a]=a;f[97+a]=26+a}f[43]=62;f[47]=63;function l(m,n,o){var g,h,a=0,i=n,j=o.length,k=n+(j*3>>2)-(o[j-2]=="=")-(o[j-1]=="=");for(;a<j;a+=4){g=f[o.charCodeAt(a+1)];h=f[o.charCodeAt(a+2)];m[i++]=f[o.charCodeAt(a)]<<2|g>>4;if(i<k)m[i++]=g<<4|h>>2;if(i<k)m[i++]=h<<6|f[o.charCodeAt(a+3)]}}function p(q){l(e,1024,"4payAOKWoADinJYA4pePAOKYhQB7fQBdfQB7AGluZmluaXR5AEZlYnJ1YXJ5AEphbnVhcnkASnVseQBUaHVyc2RheQBUdWVzZGF5AFdlZG5lc2RheQBTYXR1cmRheQBTdW5kYXkATW9uZGF5AEZyaWRheQBNYXkAJW0vJWQvJXkALSsgICAwWDB4AC0wWCswWCAwWC0weCsweCAweABOb3YAVGh1AHVuc3VwcG9ydGVkIGxvY2FsZSBmb3Igc3RhbmRhcmQgaW5wdXQAQXVndXN0AG1hcmtldABPY3QAU2F0AGNyb3NzAEFwcgB2ZWN0b3IAT2N0b2JlcgBOb3ZlbWJlcgBTZXB0ZW1iZXIARGVjZW1iZXIAaW9zX2Jhc2U6OmNsZWFyAE1hcgBTZXAAJUk6JU06JVMgJXAAU3VuAEp1bgAtLWpzb24Ac3RkOjpleGNlcHRpb24AaG9sZF9vbgBNb24AbmFuAHBsYXllcl9odW1hbgBKYW4ASnVsAGxsAEFwcmlsAGNoZWNrAEZyaQAtLWFpLXZzLWFpAGJhZF9hcnJheV9uZXdfbGVuZ3RoAE1hcmNoAEF1ZwBiYXNpY19zdHJpbmcAaW5mACUuMExmACVMZgB0cnVlAFR1ZQBmYWxzZQBzcXVhcmUASnVuZQBlbXB0eSBwaWxlAGNpcmNsZQBsYXN0X2NhcmQAc3VzcGVuZABjbG9ja19nZXR0aW1lKENMT0NLX1JFQUxUSU1FKSBmYWlsZWQAV2VkAHN0ZDo6YmFkX2FsbG9jAERlYwBGZWIAY2FyZF8AImxvZ3MiOlsAImhhbmQiOlsAJWEgJWIgJWQgJUg6JU06JVMgJVkAUE9TSVgAJUg6JU06JVMATkFOAFBNAEFNAExDX0FMTABMQU5HAElORgBDACJjdXJyZW50VHVyblBsYXllckluZGV4IjoAImJvdCI6ACJtYXJrZXRDb3VudCI6ACJwZW5kaW5nUGlja0NvdW50IjoAImNhcmRDb3VudCI6ACJwbGF5ZWRDb3VudCI6ACJpc0dhbWVPdmVyIjoAIiwibnVtYmVyIjoAImh1bWFuIjoAImlzSHVtYW4iOgAiZGVjayI6ACJzY29yZSI6ACJ0b3BDYXJkIjoAQy5VVEYtOABwaWNrMwBwaWNrMgBJbnZhbGlkIGNhcmQgc2VsZWN0aW9uIGluZGV4LgBEZWFsdCA2IGNhcmRzIHRvIFlvdSBhbmQgTmFpamEgQm90LgAgY2FyZChzKSBmcm9tIG1hcmtldC4AQm90IGRyZXcgY2FyZHMuAEdhbWUgaXMgYWxyZWFkeSBvdmVyLgBOb3QgQm90J3MgdHVybiBvciBnYW1lIG92ZXIuACBkcmF3cyAxIGNhcmQuACBjYXJkKHMpLgAtLS0gTmV3IEMrKyBXaG90IEdhbWUgU3RhcnRlZCAtLS0AIiwAWW91IChQbGF5ZXIpAChudWxsKQBHYW1lIGluaXRpYWxpemVkIChDKysgRW5naW5lKQBOYWlqYSBCb3QgKEFJKQAgKABcIgAiLCJzdWl0IjoiACJyZXF1ZXN0ZWRTdWl0IjoiACJuYW1lIjoiAHsiaWQiOiIAIndpbm5lcklkIjoiAFBpY2sgMyBmb3IgeW91cnNlbGYhIE5haWphIFdob3Qgbm8gYmUgcGxheSEAT3lhIHBpY2sgMiBteSBmcmllbmQhIE5vIGNhcnJ5IGxhc3QhAEkgY2hhbmdlIHN1aXQhIFNob3cgbWUgd2hhdCB5b3UgZ290IQBDSEVDSyEgR2FtZSBvdmVyIQBMQVNUIENBUkQhIFdhcm5pbmcgbyEASXQgaXMgbm90IHlvdXIgdHVybiEAIGdldHMgYW5vdGhlciB0dXJuIQBIb2xkIE9uISBMZXQgbWUgcGxheSBhZ2FpbiEAR28gdG8gbWFya2V0ISBCdXkgZnJlc2ggeWFtIQBTdXNwZW5kZWQhIFJlc3Qgc21hbGwhAFlvdXIgdHVybiwgcGxheSB3aXNlIQAncyB0dXJuIGlzIHNraXBwZWQhAFB1cmUgdmlydHVhbCBmdW5jdGlvbiBjYWxsZWQhADogQ0hFQ0shIEdBTUUgT1ZFUiEAOiBMQVNUIENBUkQhACB3b24gdGhlIGdhbWUgKENIRUNLKSEAQ2Fubm90IHBsYXkgAFBJQ0sgMyEgUGVuZGluZyBwaWNrIGNvdW50IGlzIG5vdyAAUElDSyAyISBQZW5kaW5nIHBpY2sgY291bnQgaXMgbm93IABOYWlqYSBCb3QgZHJldyAAWW91IHdlbnQgdG8gbWFya2V0IGFuZCBkcmV3IABEcmV3IAAgYWdhaW5zdCAAIGNhbGxlZCBXSE9UIHN1aXQ6IABUb3AgY2FyZCBvbiB0YWJsZTogAFdIT1QgMjAgAEdFTkVSQUwgTUFSS0VUISAASE9MRCBPTiEgAFNVU1BFTkQhIABSdW5uaW5nIEFJIHZzIEFJIEMrKyBTaW11bGF0aW9uLi4uCgAAAQAAAAIAAAADAAAABAAAAAUAAAAHAAAACAAAAAoAAAALAAAADAAAAA0AAAAOAAAAAQAAAAIAAAADAAAABQAAAAcAAAAKAAAACwAAAA0AAAAOAAAAAQAAAAIAAAADAAAABAAAAAUAAAAHAAAACAAAABQAAAAUAAAAFAAAABQAAAAUAAAAAAAAAOgNAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAAQAAAAEQAAABIAAAATAAAAFAAAAAgAAAAAAAAAIA4AABUAAAAWAAAA+P////j///8gDgAAFwAAABgAAAA4DAAATAwAAAQAAAAAAAAAaA4AABkAAAAaAAAA/P////z///9oDgAAGwAAABwAAABoDAAAfAwAAAAAAAD8DgAAHQAAAB4AAAAfAAAAIAAAACEAAAAiAAAAIwAAACQAAAAlAAAAJgAAACcAAAAoAAAAKQAAACoAAAAIAAAAAAAAADQPAAArAAAALAAAAPj////4////NA8AAC0AAAAuAAAA2AwAAOwMAAAEAAAAAAAAAHwPAAAvAAAAMAAAAPz////8////fA8AADEAAAAyAAAACA0AABwNAAAAAAAA2A8AADMAAAA0AAAACQAAAAoAAAA1AAAANgAAAA0AAAAOAAAADwAAADcAAAARAAAAOAAAABMAAAA5AAAAAAAAAKgNAAA6AAAAOwAAAE5TdDNfXzI5YmFzaWNfaW9zSWNOU18xMWNoYXJfdHJhaXRzSWNFRUVFAAAAmD8AAHwNAAC8EAAATlN0M19fMjE1YmFzaWNfc3RyZWFtYnVmSWNOU18xMWNoYXJfdHJhaXRzSWNFRUVFAAAAAHA/AAC0DQAATlN0M19fMjEzYmFzaWNfaXN0cmVhbUljTlNfMTFjaGFyX3RyYWl0c0ljRUVFRQAA9D8AAPANAAAAAAAAAQAAAKgNAAAD9P//TlN0M19fMjEzYmFzaWNfb3N0cmVhbUljTlNfMTFjaGFyX3RyYWl0c0ljRUVFRQAA9D8AADgOAAAAAAAAAQAAAKgNAAAD9P//AAAAALwOAAA8AAAAPQAAAE5TdDNfXzI5YmFzaWNfaW9zSXdOU18xMWNoYXJfdHJhaXRzSXdFRUVFAAAAmD8AAJAOAAC8EAAATlN0M19fMjE1YmFzaWNfc3RyZWFtYnVmSXdOU18xMWNoYXJfdHJhaXRzSXdFRUVFAAAAAHA/AADIDgAATlN0M19fMjEzYmFzaWNfaXN0cmVhbUl3TlNfMTFjaGFyX3RyYWl0c0l3RUVFRQAA9D8AAAQPAAAAAAAAAQAAALwOAAAD9P//TlN0M19fMjEzYmFzaWNfb3N0cmVhbUl3TlNfMTFjaGFyX3RyYWl0c0l3RUVFRQAA9D8AAEwPAAAAAAAAAQAAALwOAAAD9P//TlN0M19fMjE1YmFzaWNfc3RyaW5nYnVmSWNOU18xMWNoYXJfdHJhaXRzSWNFRU5TXzlhbGxvY2F0b3JJY0VFRUUAAACYPwAAlA8AAOgNAAA4AAAAAAAAAIwQAAA+AAAAPwAAAMj////I////jBAAAEAAAABBAAAA8A8AACgQAAA8EAAABBAAADgAAAAAAAAAaA4AABkAAAAaAAAAyP///8j///9oDgAAGwAAABwAAABOU3QzX18yMTliYXNpY19vc3RyaW5nc3RyZWFtSWNOU18xMWNoYXJfdHJhaXRzSWNFRU5TXzlhbGxvY2F0b3JJY0VFRUUAAACYPwAARBAAAGgOAAAAAAAAvBAAAEIAAABDAAAATlN0M19fMjhpb3NfYmFzZUUAAABwPwAAqBAAAJhBAAAoQgAAwEIAAN4SBJUAAAAA////////////////0BAAABQAAABDLlVURi04");l(e,4384,"5BA=");l(e,4416,"AgAAwAMAAMAEAADABQAAwAYAAMAHAADACAAAwAkAAMAKAADACwAAwAwAAMANAADADgAAwA8AAMAQAADAEQAAwBIAAMATAADAFAAAwBUAAMAWAADAFwAAwBgAAMAZAADAGgAAwBsAAMAcAADAHQAAwB4AAMAfAADAAAAAswEAAMMCAADDAwAAwwQAAMMFAADDBgAAwwcAAMMIAADDCQAAwwoAAMMLAADDDAAAww0AANMOAADDDwAAwwAADLsBAAzDAgAMwwMADMMEAAzbAAAAAGQSAAAHAAAATAAAAE0AAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAABOAAAATwAAAFAAAAATAAAAFAAAAE5TdDNfXzIxMF9fc3RkaW5idWZJY0VFAJg/AABMEgAA6A0AAAAAAADMEgAABwAAAFEAAABSAAAACgAAAAsAAAAMAAAAUwAAAA4AAAAPAAAAEAAAABEAAAASAAAAVAAAAFUAAABOU3QzX18yMTFfX3N0ZG91dGJ1ZkljRUUAAAAAmD8AALASAADoDQAAAAAAADATAAAdAAAAVgAAAFcAAAAgAAAAIQAAACIAAAAjAAAAJAAAACUAAABYAAAAWQAAAFoAAAApAAAAKgAAAE5TdDNfXzIxMF9fc3RkaW5idWZJd0VFAJg/AAAYEwAA/A4AAAAAAACYEwAAHQAAAFsAAABcAAAAIAAAACEAAAAiAAAAXQAAACQAAAAlAAAAJgAAACcAAAAoAAAAXgAAAF8AAABOU3QzX18yMTFfX3N0ZG91dGJ1Zkl3RUUAAAAAmD8AAHwTAAD8Dg==");l(e,5040,"0XSeAFedvSqAcFIP//8+JwoAAABkAAAA6AMAABAnAACghgEAQEIPAICWmAAA4fUFGAAAADUAAABxAAAAa////877//+Sv///AAAAAAAAAAD/////////////////////////////////////////////////////////////////AAECAwQFBgcICf////////8KCwwNDg8QERITFBUWFxgZGhscHR4fICEiI////////woLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIj/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wABAgQHAwYFAAAAAAAAAExDX0NUWVBFAAAAAExDX05VTUVSSUMAAExDX1RJTUUAAAAAAExDX0NPTExBVEUAAExDX01PTkVUQVJZAExDX01FU1NBR0VT");l(e,5472,"GQAKABkZGQAAAAAFAAAAAAAACQAAAAALAAAAAAAAAAAZABEKGRkZAwoHAAEACQsYAAAJBgsAAAsABhkAAAAZGRk=");l(e,5553,"DgAAAAAAAAAAGQAKDRkZGQANAAACAAkOAAAACQAOAAAO");l(e,5611,"DA==");l(e,5623,"EwAAAAATAAAAAAkMAAAAAAAMAAAM");l(e,5669,"EA==");l(e,5681,"DwAAAAQPAAAAAAkQAAAAAAAQAAAQ");l(e,5727,"Eg==");l(e,5739,"EQAAAAARAAAAAAkSAAAAAAASAAASAAAaAAAAGhoa");l(e,5794,"GgAAABoaGgAAAAAAAAk=");l(e,5843,"FA==");l(e,5855,"FwAAAAAXAAAAAAkUAAAAAAAUAAAU");l(e,5901,"Fg==");l(e,5913,"FQAAAAAVAAAAAAkWAAAAAAAWAAAWAAAwMTIzNDU2Nzg5QUJDREVGUBk=");l(e,6484,"AQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAHwAAACAAAAAhAAAAIgAAACMAAAAkAAAAJQAAACYAAAAnAAAAKAAAACkAAAAqAAAAKwAAACwAAAAtAAAALgAAAC8AAAAwAAAAMQAAADIAAAAzAAAANAAAADUAAAA2AAAANwAAADgAAAA5AAAAOgAAADsAAAA8AAAAPQAAAD4AAAA/AAAAQAAAAEEAAABCAAAAQwAAAEQAAABFAAAARgAAAEcAAABIAAAASQAAAEoAAABLAAAATAAAAE0AAABOAAAATwAAAFAAAABRAAAAUgAAAFMAAABUAAAAVQAAAFYAAABXAAAAWAAAAFkAAABaAAAAWwAAAFwAAABdAAAAXgAAAF8AAABgAAAAQQAAAEIAAABDAAAARAAAAEUAAABGAAAARwAAAEgAAABJAAAASgAAAEsAAABMAAAATQAAAE4AAABPAAAAUAAAAFEAAABSAAAAUwAAAFQAAABVAAAAVgAAAFcAAABYAAAAWQAAAFoAAAB7AAAAfAAAAH0AAAB+AAAAfw==");l(e,7504,"YB8=");l(e,8036,"AQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAHwAAACAAAAAhAAAAIgAAACMAAAAkAAAAJQAAACYAAAAnAAAAKAAAACkAAAAqAAAAKwAAACwAAAAtAAAALgAAAC8AAAAwAAAAMQAAADIAAAAzAAAANAAAADUAAAA2AAAANwAAADgAAAA5AAAAOgAAADsAAAA8AAAAPQAAAD4AAAA/AAAAQAAAAGEAAABiAAAAYwAAAGQAAABlAAAAZgAAAGcAAABoAAAAaQAAAGoAAABrAAAAbAAAAG0AAABuAAAAbwAAAHAAAABxAAAAcgAAAHMAAAB0AAAAdQAAAHYAAAB3AAAAeAAAAHkAAAB6AAAAWwAAAFwAAABdAAAAXgAAAF8AAABgAAAAYQAAAGIAAABjAAAAZAAAAGUAAABmAAAAZwAAAGgAAABpAAAAagAAAGsAAABsAAAAbQAAAG4AAABvAAAAcAAAAHEAAAByAAAAcwAAAHQAAAB1AAAAdgAAAHcAAAB4AAAAeQAAAHoAAAB7AAAAfAAAAH0AAAB+AAAAfw==");l(e,9056,"MDEyMzQ1Njc4OWFiY2RlZkFCQ0RFRnhYKy1wUGlJbk4AAAAAAAAAANQsAAB2AAAAdwAAAHgAAAAAAAAANC0AAHkAAAB6AAAAeAAAAHsAAAB8AAAAfQAAAH4AAAB/AAAAgAAAAIEAAACCAAAAAAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAUCAAAFAAAABQAAAAUAAAAFAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAAAwIAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAggAAAEIBAABCAQAAQgEAAEIBAABCAQAAQgEAAEIBAABCAQAAQgEAAEIBAACCAAAAggAAAIIAAACCAAAAggAAAIIAAACCAAAAKgEAACoBAAAqAQAAKgEAACoBAAAqAQAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAACCAAAAggAAAIIAAACCAAAAggAAAIIAAAAyAQAAMgEAADIBAAAyAQAAMgEAADIBAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAADIAAAAyAAAAMgAAAIIAAACCAAAAggAAAIIAAAAE");l(e,10196,"nCwAAIMAAACEAAAAeAAAAIUAAACGAAAAhwAAAIgAAACJAAAAigAAAIsAAAAAAAAAbC0AAIwAAACNAAAAeAAAAI4AAACPAAAAkAAAAJEAAACSAAAAAAAAAJAtAACTAAAAlAAAAHgAAACVAAAAlgAAAJcAAACYAAAAmQAAAHQAAAByAAAAdQAAAGUAAAAAAAAAZgAAAGEAAABsAAAAcwAAAGUAAAAAAAAAJQAAAG0AAAAvAAAAJQAAAGQAAAAvAAAAJQAAAHkAAAAAAAAAJQAAAEgAAAA6AAAAJQAAAE0AAAA6AAAAJQAAAFMAAAAAAAAAJQAAAGEAAAAgAAAAJQAAAGIAAAAgAAAAJQAAAGQAAAAgAAAAJQAAAEgAAAA6AAAAJQAAAE0AAAA6AAAAJQAAAFMAAAAgAAAAJQAAAFkAAAAAAAAAJQAAAEkAAAA6AAAAJQAAAE0AAAA6AAAAJQAAAFMAAAAgAAAAJQAAAHA=");l(e,10572,"dCkAAJoAAACbAAAAeAAAAE5TdDNfXzI2bG9jYWxlNWZhY2V0RQAAAJg/AABcKQAAoD0AAAAAAAD0KQAAmgAAAJwAAAB4AAAAnQAAAJ4AAACfAAAAoAAAAKEAAACiAAAAowAAAKQAAAClAAAApgAAAKcAAACoAAAATlN0M19fMjVjdHlwZUl3RUUATlN0M19fMjEwY3R5cGVfYmFzZUUAAHA/AADWKQAA9D8AAMQpAAAAAAAAAgAAAHQpAAACAAAA7CkAAAIAAAAAAAAAiCoAAJoAAACpAAAAeAAAAKoAAACrAAAArAAAAK0AAACuAAAArwAAALAAAABOU3QzX18yN2NvZGVjdnRJY2MxMV9fbWJzdGF0ZV90RUUATlN0M19fMjEyY29kZWN2dF9iYXNlRQAAAABwPwAAZioAAPQ/AABEKgAAAAAAAAIAAAB0KQAAAgAAAIAqAAACAAAAAAAAAPwqAACaAAAAsQAAAHgAAACyAAAAswAAALQAAAC1AAAAtgAAALcAAAC4AAAATlN0M19fMjdjb2RlY3Z0SURzYzExX19tYnN0YXRlX3RFRQAA9D8AANgqAAAAAAAAAgAAAHQpAAACAAAAgCoAAAIAAAAAAAAAcCsAAJoAAAC5AAAAeAAAALoAAAC7AAAAvAAAAL0AAAC+AAAAvwAAAMAAAABOU3QzX18yN2NvZGVjdnRJRHNEdTExX19tYnN0YXRlX3RFRQD0PwAATCsAAAAAAAACAAAAdCkAAAIAAACAKgAAAgAAAAAAAADkKwAAmgAAAMEAAAB4AAAAwgAAAMMAAADEAAAAxQAAAMYAAADHAAAAyAAAAE5TdDNfXzI3Y29kZWN2dElEaWMxMV9fbWJzdGF0ZV90RUUAAPQ/AADAKwAAAAAAAAIAAAB0KQAAAgAAAIAqAAACAAAAAAAAAFgsAACaAAAAyQAAAHgAAADKAAAAywAAAMwAAADNAAAAzgAAAM8AAADQAAAATlN0M19fMjdjb2RlY3Z0SURpRHUxMV9fbWJzdGF0ZV90RUUA9D8AADQsAAAAAAAAAgAAAHQpAAACAAAAgCoAAAIAAABOU3QzX18yN2NvZGVjdnRJd2MxMV9fbWJzdGF0ZV90RUUAAAD0PwAAeCwAAAAAAAACAAAAdCkAAAIAAACAKgAAAgAAAE5TdDNfXzI2bG9jYWxlNV9faW1wRQAAAJg/AAC8LAAAdCkAAE5TdDNfXzI3Y29sbGF0ZUljRUUAmD8AAOAsAAB0KQAATlN0M19fMjdjb2xsYXRlSXdFRQCYPwAAAC0AAHQpAABOU3QzX18yNWN0eXBlSWNFRQAAAPQ/AAAgLQAAAAAAAAIAAAB0KQAAAgAAAOwpAAACAAAATlN0M19fMjhudW1wdW5jdEljRUUAAAAAmD8AAFQtAAB0KQAATlN0M19fMjhudW1wdW5jdEl3RUUAAAAAmD8AAHgtAAB0KQAAAAAAAPQsAADRAAAA0gAAAHgAAADTAAAA1AAAANUAAAAAAAAAFC0AANYAAADXAAAAeAAAANgAAADZAAAA2gAAAAAAAACwLgAAmgAAANsAAAB4AAAA3AAAAN0AAADeAAAA3wAAAOAAAADhAAAA4gAAAOMAAADkAAAA5QAAAOYAAABOU3QzX18yN251bV9nZXRJY05TXzE5aXN0cmVhbWJ1Zl9pdGVyYXRvckljTlNfMTFjaGFyX3RyYWl0c0ljRUVFRUVFAE5TdDNfXzI5X19udW1fZ2V0SWNFRQBOU3QzX18yMTRfX251bV9nZXRfYmFzZUUAAHA/AAB2LgAA9D8AAGAuAAAAAAAAAQAAAJAuAAAAAAAA9D8AABwuAAAAAAAAAgAAAHQpAAACAAAAmC4=");l(e,11988,"hC8AAJoAAADnAAAAeAAAAOgAAADpAAAA6gAAAOsAAADsAAAA7QAAAO4AAADvAAAA8AAAAPEAAADyAAAATlN0M19fMjdudW1fZ2V0SXdOU18xOWlzdHJlYW1idWZfaXRlcmF0b3JJd05TXzExY2hhcl90cmFpdHNJd0VFRUVFRQBOU3QzX18yOV9fbnVtX2dldEl3RUUAAAD0PwAAVC8AAAAAAAABAAAAkC4AAAAAAAD0PwAAEC8AAAAAAAACAAAAdCkAAAIAAABsLw==");l(e,12200,"bDAAAJoAAADzAAAAeAAAAPQAAAD1AAAA9gAAAPcAAAD4AAAA+QAAAPoAAAD7AAAATlN0M19fMjdudW1fcHV0SWNOU18xOW9zdHJlYW1idWZfaXRlcmF0b3JJY05TXzExY2hhcl90cmFpdHNJY0VFRUVFRQBOU3QzX18yOV9fbnVtX3B1dEljRUUATlN0M19fMjE0X19udW1fcHV0X2Jhc2VFAABwPwAAMjAAAPQ/AAAcMAAAAAAAAAEAAABMMAAAAAAAAPQ/AADYLwAAAAAAAAIAAAB0KQAAAgAAAFQw");l(e,12432,"NDEAAJoAAAD8AAAAeAAAAP0AAAD+AAAA/wAAAAABAAABAQAAAgEAAAMBAAAEAQAATlN0M19fMjdudW1fcHV0SXdOU18xOW9zdHJlYW1idWZfaXRlcmF0b3JJd05TXzExY2hhcl90cmFpdHNJd0VFRUVFRQBOU3QzX18yOV9fbnVtX3B1dEl3RUUAAAD0PwAABDEAAAAAAAABAAAATDAAAAAAAAD0PwAAwDAAAAAAAAACAAAAdCkAAAIAAAAcMQ==");l(e,12632,"NDIAAAUBAAAGAQAAeAAAAAcBAAAIAQAACQEAAAoBAAALAQAADAEAAA0BAAD4////NDIAAA4BAAAPAQAAEAEAABEBAAASAQAAEwEAABQBAABOU3QzX18yOHRpbWVfZ2V0SWNOU18xOWlzdHJlYW1idWZfaXRlcmF0b3JJY05TXzExY2hhcl90cmFpdHNJY0VFRUVFRQBOU3QzX18yOXRpbWVfYmFzZUUAcD8AAO0xAABOU3QzX18yMjBfX3RpbWVfZ2V0X2Nfc3RvcmFnZUljRUUAAABwPwAACDIAAPQ/AACoMQAAAAAAAAMAAAB0KQAAAgAAAAAyAAACAAAALDIAAAAIAAAAAAAAIDMAABUBAAAWAQAAeAAAABcBAAAYAQAAGQEAABoBAAAbAQAAHAEAAB0BAAD4////IDMAAB4BAAAfAQAAIAEAACEBAAAiAQAAIwEAACQBAABOU3QzX18yOHRpbWVfZ2V0SXdOU18xOWlzdHJlYW1idWZfaXRlcmF0b3JJd05TXzExY2hhcl90cmFpdHNJd0VFRUVFRQBOU3QzX18yMjBfX3RpbWVfZ2V0X2Nfc3RvcmFnZUl3RUUAAHA/AAD1MgAA9D8AALAyAAAAAAAAAwAAAHQpAAACAAAAADIAAAIAAAAYMwAAAAgAAAAAAADEMwAAJQEAACYBAAB4AAAAJwEAAE5TdDNfXzI4dGltZV9wdXRJY05TXzE5b3N0cmVhbWJ1Zl9pdGVyYXRvckljTlNfMTFjaGFyX3RyYWl0c0ljRUVFRUVFAE5TdDNfXzIxMF9fdGltZV9wdXRFAAAAcD8AAKUzAAD0PwAAYDMAAAAAAAACAAAAdCkAAAIAAAC8MwAAAAgAAAAAAABENAAAKAEAACkBAAB4AAAAKgEAAE5TdDNfXzI4dGltZV9wdXRJd05TXzE5b3N0cmVhbWJ1Zl9pdGVyYXRvckl3TlNfMTFjaGFyX3RyYWl0c0l3RUVFRUVFAAAAAPQ/AAD8MwAAAAAAAAIAAAB0KQAAAgAAALwzAAAACAAAAAAAANg0AACaAAAAKwEAAHgAAAAsAQAALQEAAC4BAAAvAQAAMAEAADEBAAAyAQAAMwEAADQBAABOU3QzX18yMTBtb25leXB1bmN0SWNMYjBFRUUATlN0M19fMjEwbW9uZXlfYmFzZUUAAAAAcD8AALg0AAD0PwAAnDQAAAAAAAACAAAAdCkAAAIAAADQNAAAAgAAAAAAAABMNQAAmgAAADUBAAB4AAAANgEAADcBAAA4AQAAOQEAADoBAAA7AQAAPAEAAD0BAAA+AQAATlN0M19fMjEwbW9uZXlwdW5jdEljTGIxRUVFAPQ/AAAwNQAAAAAAAAIAAAB0KQAAAgAAANA0AAACAAAAAAAAAMA1AACaAAAAPwEAAHgAAABAAQAAQQEAAEIBAABDAQAARAEAAEUBAABGAQAARwEAAEgBAABOU3QzX18yMTBtb25leXB1bmN0SXdMYjBFRUUA9D8AAKQ1AAAAAAAAAgAAAHQpAAACAAAA0DQAAAIAAAAAAAAANDYAAJoAAABJAQAAeAAAAEoBAABLAQAATAEAAE0BAABOAQAATwEAAFABAABRAQAAUgEAAE5TdDNfXzIxMG1vbmV5cHVuY3RJd0xiMUVFRQD0PwAAGDYAAAAAAAACAAAAdCkAAAIAAADQNAAAAgAAAAAAAADYNgAAmgAAAFMBAAB4AAAAVAEAAFUBAABOU3QzX18yOW1vbmV5X2dldEljTlNfMTlpc3RyZWFtYnVmX2l0ZXJhdG9ySWNOU18xMWNoYXJfdHJhaXRzSWNFRUVFRUUATlN0M19fMjExX19tb25leV9nZXRJY0VFAABwPwAAtjYAAPQ/AABwNgAAAAAAAAIAAAB0KQAAAgAAANA2");l(e,14076,"fDcAAJoAAABWAQAAeAAAAFcBAABYAQAATlN0M19fMjltb25leV9nZXRJd05TXzE5aXN0cmVhbWJ1Zl9pdGVyYXRvckl3TlNfMTFjaGFyX3RyYWl0c0l3RUVFRUVFAE5TdDNfXzIxMV9fbW9uZXlfZ2V0SXdFRQAAcD8AAFo3AAD0PwAAFDcAAAAAAAACAAAAdCkAAAIAAAB0Nw==");l(e,14240,"IDgAAJoAAABZAQAAeAAAAFoBAABbAQAATlN0M19fMjltb25leV9wdXRJY05TXzE5b3N0cmVhbWJ1Zl9pdGVyYXRvckljTlNfMTFjaGFyX3RyYWl0c0ljRUVFRUVFAE5TdDNfXzIxMV9fbW9uZXlfcHV0SWNFRQAAcD8AAP43AAD0PwAAuDcAAAAAAAACAAAAdCkAAAIAAAAYOA==");l(e,14404,"xDgAAJoAAABcAQAAeAAAAF0BAABeAQAATlN0M19fMjltb25leV9wdXRJd05TXzE5b3N0cmVhbWJ1Zl9pdGVyYXRvckl3TlNfMTFjaGFyX3RyYWl0c0l3RUVFRUVFAE5TdDNfXzIxMV9fbW9uZXlfcHV0SXdFRQAAcD8AAKI4AAD0PwAAXDgAAAAAAAACAAAAdCkAAAIAAAC8OA==");l(e,14568,"PDkAAJoAAABfAQAAeAAAAGABAABhAQAAYgEAAE5TdDNfXzI4bWVzc2FnZXNJY0VFAE5TdDNfXzIxM21lc3NhZ2VzX2Jhc2VFAAAAAHA/AAAZOQAA9D8AAAQ5AAAAAAAAAgAAAHQpAAACAAAANDkAAAIAAAAAAAAAlDkAAJoAAABjAQAAeAAAAGQBAABlAQAAZgEAAE5TdDNfXzI4bWVzc2FnZXNJd0VFAAAAAPQ/AAB8OQAAAAAAAAIAAAB0KQAAAgAAADQ5AAACAAAAUwAAAHUAAABuAAAAZAAAAGEAAAB5AAAAAAAAAE0AAABvAAAAbgAAAGQAAABhAAAAeQAAAAAAAABUAAAAdQAAAGUAAABzAAAAZAAAAGEAAAB5AAAAAAAAAFcAAABlAAAAZAAAAG4AAABlAAAAcwAAAGQAAABhAAAAeQAAAAAAAABUAAAAaAAAAHUAAAByAAAAcwAAAGQAAABhAAAAeQAAAAAAAABGAAAAcgAAAGkAAABkAAAAYQAAAHkAAAAAAAAAUwAAAGEAAAB0AAAAdQAAAHIAAABkAAAAYQAAAHkAAAAAAAAAUwAAAHUAAABuAAAAAAAAAE0AAABvAAAAbgAAAAAAAABUAAAAdQAAAGUAAAAAAAAAVwAAAGUAAABkAAAAAAAAAFQAAABoAAAAdQAAAAAAAABGAAAAcgAAAGkAAAAAAAAAUwAAAGEAAAB0AAAAAAAAAEoAAABhAAAAbgAAAHUAAABhAAAAcgAAAHkAAAAAAAAARgAAAGUAAABiAAAAcgAAAHUAAABhAAAAcgAAAHkAAAAAAAAATQAAAGEAAAByAAAAYwAAAGgAAAAAAAAAQQAAAHAAAAByAAAAaQAAAGwAAAAAAAAATQAAAGEAAAB5AAAAAAAAAEoAAAB1AAAAbgAAAGUAAAAAAAAASgAAAHUAAABsAAAAeQAAAAAAAABBAAAAdQAAAGcAAAB1AAAAcwAAAHQAAAAAAAAAUwAAAGUAAABwAAAAdAAAAGUAAABtAAAAYgAAAGUAAAByAAAAAAAAAE8AAABjAAAAdAAAAG8AAABiAAAAZQAAAHIAAAAAAAAATgAAAG8AAAB2AAAAZQAAAG0AAABiAAAAZQAAAHIAAAAAAAAARAAAAGUAAABjAAAAZQAAAG0AAABiAAAAZQAAAHIAAAAAAAAASgAAAGEAAABuAAAAAAAAAEYAAABlAAAAYgAAAAAAAABNAAAAYQAAAHIAAAAAAAAAQQAAAHAAAAByAAAAAAAAAEoAAAB1AAAAbgAAAAAAAABKAAAAdQAAAGwAAAAAAAAAQQAAAHUAAABnAAAAAAAAAFMAAABlAAAAcAAAAAAAAABPAAAAYwAAAHQAAAAAAAAATgAAAG8AAAB2AAAAAAAAAEQAAABlAAAAYwAAAAAAAABBAAAATQAAAAAAAABQAAAATQ==");l(e,15660,"LDIAAA4BAAAPAQAAEAEAABEBAAASAQAAEwEAABQBAAAAAAAAGDMAAB4BAAAfAQAAIAEAACEBAAAiAQAAIwEAACQBAAAAAAAAoD0AAGcBAABoAQAAaQEAAE5TdDNfXzIxNF9fc2hhcmVkX2NvdW50RQAAAABwPwAAhD0=");l(e,15796,"CgAAAGQAAADoAwAAECcAAKCGAQBAQg8AgJaYAADh9QUAypo7AAAAAAAAAAAwMDAxMDIwMzA0MDUwNjA3MDgwOTEwMTExMjEzMTQxNTE2MTcxODE5MjAyMTIyMjMyNDI1MjYyNzI4MjkzMDMxMzIzMzM0MzUzNjM3MzgzOTQwNDE0MjQzNDQ0NTQ2NDc0ODQ5NTA1MTUyNTM1NDU1NTY1NzU4NTk2MDYxNjI2MzY0NjU2NjY3Njg2OTcwNzE3MjczNzQ3NTc2Nzc3ODc5ODA4MTgyODM4NDg1ODY4Nzg4ODk5MDkxOTI5Mzk0OTU5Njk3OTg5OU4xMF9fY3h4YWJpdjExNl9fc2hpbV90eXBlX2luZm9FAAAAAJg/AACoPgAAiEEAAE4xMF9fY3h4YWJpdjExN19fY2xhc3NfdHlwZV9pbmZvRQAAAJg/AADYPgAAzD4AAE4xMF9fY3h4YWJpdjExN19fcGJhc2VfdHlwZV9pbmZvRQAAAJg/AAAIPwAAzD4AAE4xMF9fY3h4YWJpdjExOV9fcG9pbnRlcl90eXBlX2luZm9FAJg/AAA4PwAALD8AAAAAAAD8PgAAagEAAGsBAABsAQAAbQEAAG4BAABvAQAAcAEAAHEBAAAAAAAA4D8AAGoBAAByAQAAbAEAAG0BAABuAQAAcwEAAHQBAAB1AQAATjEwX19jeHhhYml2MTIwX19zaV9jbGFzc190eXBlX2luZm9FAAAAAJg/AAC4PwAA/D4AAAAAAAA8QAAAagEAAHYBAABsAQAAbQEAAG4BAAB3AQAAeAEAAHkBAABOMTBfX2N4eGFiaXYxMjFfX3ZtaV9jbGFzc190eXBlX2luZm9FAAAAmD8AABRAAAD8PgAAAAAAAKxAAAACAAAAegEAAHsBAAAAAAAA1EAAAAIAAAB8AQAAfQEAAAAAAACUQAAAAgAAAH4BAAB/AQAAU3Q5ZXhjZXB0aW9uAAAAAHA/AACEQAAAU3Q5YmFkX2FsbG9jAAAAAJg/AACcQAAAlEAAAFN0MjBiYWRfYXJyYXlfbmV3X2xlbmd0aAAAAACYPwAAuEAAAKxAAAAAAAAABEEAAAEAAACAAQAAgQEAAFN0MTFsb2dpY19lcnJvcgCYPwAA9EAAAJRAAAAAAAAAOEEAAAEAAACCAQAAgQEAAFN0MTJsZW5ndGhfZXJyb3IAAAAAmD8AACRBAAAEQQAAAAAAAGxBAAABAAAAgwEAAIEBAABTdDEyb3V0X29mX3JhbmdlAAAAAJg/AABYQQAABEEAAFN0OXR5cGVfaW5mbwAAAABwPwAAeEE=");l(e,16784,"wFoBAAAAAAAJ");l(e,16804,"RA==");l(e,16824,"RQAAAAAAAABGAAAAyEUAAAAE");l(e,16868,"/////w==");l(e,16936,"BQ==");l(e,16948,"Rw==");l(e,16972,"SAAAAEkAAADYSQAAAAQ=");l(e,16996,"AQ==");l(e,17012,"/////wo=");l(e,17080,"KEIAAAAAAAAF");l(e,17100,"RA==");l(e,17124,"SAAAAEYAAADgTQ==");l(e,17148,"Ag==");l(e,17164,"//////////8=");l(e,17232,"wEI=")}var r=new ArrayBuffer(16);var s=new Int32Array(r);var t=new Float32Array(r);var u=new Float64Array(r);function v(w){return s[w]}function x(w,y){s[w]=y}function z(){return u[0]}function A(y){u[0]=y}function B(){throw new Error("abort")}function C(y){t[2]=y}function D(){return t[2]}function va(q){var E=q.env;var F=E.memory;var G=F.buffer;F.grow=ta;var H=new Int8Array(G);var I=new Int16Array(G);var J=new Int32Array(G);var K=new Uint8Array(G);var L=new Uint16Array(G);var M=new Uint32Array(G);var N=new Float32Array(G);var O=new Float64Array(G);var P=Math.imul;var Q=Math.fround;var R=Math.abs;var S=Math.clz32;var T=Math.min;var U=Math.max;var V=Math.floor;var W=Math.ceil;var X=Math.trunc;var Y=Math.sqrt;var Z=E.__cxa_throw;var _=E.emscripten_memcpy_js;var $=E.emscripten_date_now;var aa=E._emscripten_get_now_is_monotonic;var ba=E.emscripten_resize_heap;var ca=q.wasi_snapshot_preview1;var da=ca.fd_write;var ea=ca.fd_read;var fa=ca.fd_close;var ga=E.abort;var ha=ca.environ_sizes_get;var ia=ca.environ_get;var ja=E.strftime_l;var ka=ca.fd_seek;var la=88768;var ma=0;
// EMSCRIPTEN_START_FUNCS
function Cf(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,A=0,B=0,D=0,E=0,F=0,G=0,I=0;s=la-48|0;la=s;a:{if(c>>>0<=2){c=c<<2;A=J[c+5100>>2];B=J[c+5088>>2];while(1){c=J[b+4>>2];b:{if((c|0)!=J[b+104>>2]){J[b+4>>2]=c+1;c=K[c|0];break b}c=kf(b)}if(hf(c)){continue}break}l=1;c:{d:{switch(c-43|0){case 0:case 2:break d;default:break c}}l=(c|0)==45?-1:1;c=J[b+4>>2];if((c|0)!=J[b+104>>2]){J[b+4>>2]=c+1;c=K[c|0];break c}c=kf(b)}e:{f:{while(1){if(H[g+1052|0]==(c|32)){g:{if(g>>>0>6){break g}c=J[b+4>>2];if((c|0)!=J[b+104>>2]){J[b+4>>2]=c+1;c=K[c|0];break g}c=kf(b)}g=g+1|0;if((g|0)!=8){continue}break f}break}if((g|0)!=3){f=(g|0)==8;if(f){break f}if(!d|g>>>0<4){break e}if(f){break f}}c=J[b+116>>2];if((c|0)>=0|(c|0)>0){J[b+4>>2]=J[b+4>>2]-1}if(!d|g>>>0<4){break f}c=(c|0)<0;while(1){if(!c){J[b+4>>2]=J[b+4>>2]-1}g=g-1|0;if(g>>>0>3){continue}break}}m=la-16|0;la=m;i=(C(Q(Q(l|0)*Q(Infinity))),v(2));b=i&2147483647;h:{if(b-8388608>>>0<=2130706431){c=b;b=b>>>7|0;c=c<<25;d=b+1065353216|0;break h}c=i<<25;d=i>>>7|2147418112;if(b>>>0>=2139095040){break h}c=0;d=0;if(!b){break h}c=b;b=S(b);mf(m,c,0,0,0,b+81|0);j=J[m>>2];h=J[m+4>>2];c=J[m+8>>2];d=J[m+12>>2]^65536|16265-b<<16}J[s>>2]=j;J[s+4>>2]=h;J[s+8>>2]=c;J[s+12>>2]=i&-2147483648|d;la=m+16|0;j=J[s+8>>2];h=J[s+12>>2];i=J[s>>2];k=J[s+4>>2];break a}i:{j:{k:{if(g){break k}g=0;while(1){if(H[g+1381|0]!=(c|32)){break k}l:{if(g>>>0>1){break l}c=J[b+4>>2];if((c|0)!=J[b+104>>2]){J[b+4>>2]=c+1;c=K[c|0];break l}c=kf(b)}g=g+1|0;if((g|0)!=3){continue}break}break j}m:{switch(g|0){case 0:n:{if((c|0)!=48){break n}g=J[b+4>>2];o:{if((g|0)!=J[b+104>>2]){J[b+4>>2]=g+1;g=K[g|0];break o}g=kf(b)}if((g&-33)==88){D=s+16|0;f=la-432|0;la=f;c=J[b+4>>2];p:{if((c|0)!=J[b+104>>2]){J[b+4>>2]=c+1;g=K[c|0];break p}g=kf(b)}q:{r:{while(1){s:{if((g|0)!=48){if((g|0)!=46){break q}c=J[b+4>>2];if((c|0)==J[b+104>>2]){break s}J[b+4>>2]=c+1;g=K[c|0];break r}c=J[b+4>>2];if((c|0)!=J[b+104>>2]){t=1;J[b+4>>2]=c+1;g=K[c|0]}else{t=1;g=kf(b)}continue}break}g=kf(b)}e=1;if((g|0)!=48){break q}while(1){c=n;n=c-1|0;r=r-!c|0;c=J[b+4>>2];t:{if((c|0)!=J[b+104>>2]){J[b+4>>2]=c+1;g=K[c|0];break t}g=kf(b)}if((g|0)==48){continue}break}t=1}k=1073676288;while(1){u:{c=g|32;v:{w:{E=g-48|0;if(E>>>0<10){break w}G=(g|0)!=46;if(G&c-97>>>0>5){break u}if(G){break w}if(e){break u}e=1;n=j;r=h;break v}c=(g|0)>57?c-87|0:E;x:{if((h|0)<=0&j>>>0<=7|(h|0)<0){p=c+(p<<4)|0;break x}if(!h&j>>>0<=28){nf(f+48|0,c);pf(f+32|0,y,z,i,k,0,0,0,1073414144);y=J[f+32>>2];z=J[f+36>>2];i=J[f+40>>2];k=J[f+44>>2];pf(f+16|0,J[f+48>>2],J[f+52>>2],J[f+56>>2],J[f+60>>2],y,z,i,k);qf(f,J[f+16>>2],J[f+20>>2],J[f+24>>2],J[f+28>>2],m,q,w,x);w=J[f+8>>2];x=J[f+12>>2];m=J[f>>2];q=J[f+4>>2];break x}if(o|!c){break x}pf(f+80|0,y,z,i,k,0,0,0,1073610752);qf(f- -64|0,J[f+80>>2],J[f+84>>2],J[f+88>>2],J[f+92>>2],m,q,w,x);w=J[f+72>>2];x=J[f+76>>2];o=1;m=J[f+64>>2];q=J[f+68>>2]}j=j+1|0;h=j?h:h+1|0;t=1}c=J[b+4>>2];if((c|0)!=J[b+104>>2]){J[b+4>>2]=c+1;g=K[c|0]}else{g=kf(b)}continue}break}y:{if(!t){c=J[b+116>>2];if((c|0)>0){c=1}else{c=(c|0)>=0}z:{A:{if(c){c=J[b+4>>2];J[b+4>>2]=c-1;if(!d){break A}J[b+4>>2]=c-2;if(!e){break z}J[b+4>>2]=c-3;break z}if(d){break z}}jf(b,0,0)}rf(f+96|0,+(l|0)*0);m=J[f+96>>2];q=J[f+100>>2];d=J[f+108>>2];b=J[f+104>>2];break y}if((h|0)<=0&j>>>0<=7|(h|0)<0){i=j;k=h;while(1){p=p<<4;i=i+1|0;k=i?k:k+1|0;if((i|0)!=8|k){continue}break}}B:{C:{D:{if((g&-33)==80){i=Df(b,d);c=ma;k=c;if(i|(c|0)!=-2147483648){break B}if(d){c=J[b+116>>2];if((c|0)>0){c=1}else{c=(c|0)>=0}if(c){break D}break C}m=0;q=0;jf(b,0,0);d=0;b=0;break y}i=0;k=0;if(J[b+116>>2]<0){break B}}J[b+4>>2]=J[b+4>>2]-1}i=0;k=0}if(!p){rf(f+112|0,+(l|0)*0);m=J[f+112>>2];q=J[f+116>>2];d=J[f+124>>2];b=J[f+120>>2];break y}b=e?n:j;d=i+(b<<2)|0;b=k+((e?r:h)<<2|b>>>30)|0;j=d-32|0;c=0-A|0;h=(d>>>0<i>>>0?b+1|0:b)-(d>>>0<32)|0;b=h;if((b|0)>0){b=1}else{b=c>>>0<j>>>0&(b|0)>=0}if(b){J[4322]=68;nf(f+160|0,l);pf(f+144|0,J[f+160>>2],J[f+164>>2],J[f+168>>2],J[f+172>>2],-1,-1,-1,2147418111);pf(f+128|0,J[f+144>>2],J[f+148>>2],J[f+152>>2],J[f+156>>2],-1,-1,-1,2147418111);m=J[f+128>>2];q=J[f+132>>2];d=J[f+140>>2];b=J[f+136>>2];break y}b=A-226|0;c=b>>31;if((h|0)>=(c|0)&b>>>0<=j>>>0|(c|0)<(h|0)){if((p|0)>=0){while(1){qf(f+416|0,m,q,w,x,0,0,0,-1073807360);b=tf(m,q,w,x,1073610752);c=(b|0)>=0;b=c;qf(f+400|0,m,q,w,x,b?J[f+416>>2]:m,b?J[f+420>>2]:q,b?J[f+424>>2]:w,b?J[f+428>>2]:x);b=j;j=b-1|0;h=h-!b|0;w=J[f+408>>2];x=J[f+412>>2];m=J[f+400>>2];q=J[f+404>>2];p=c|p<<1;if((p|0)>=0){continue}break}}b=h-((A>>31)+(j>>>0<A>>>0)|0)|0;c=(j-A|0)+32|0;b=c>>>0<32?b+1|0:b;c=c>>>0<B>>>0&(b|0)<=0|(b|0)<0?(c|0)>0?c:0:B;E:{if((c|0)>=113){nf(f+384|0,l);n=J[f+392>>2];r=J[f+396>>2];y=J[f+384>>2];z=J[f+388>>2];i=0;b=0;break E}rf(f+352|0,uf(144-c|0));nf(f+336|0,l);y=J[f+336>>2];z=J[f+340>>2];n=J[f+344>>2];r=J[f+348>>2];vf(f+368|0,J[f+352>>2],J[f+356>>2],J[f+360>>2],J[f+364>>2],y,z,n,r);u=J[f+376>>2];F=J[f+380>>2];i=J[f+372>>2];b=J[f+368>>2]}d=!(p&1)&((sf(m,q,w,x,0,0,0,0)|0)!=0&(c|0)<32);wf(f+320|0,d+p|0);pf(f+304|0,y,z,n,r,J[f+320>>2],J[f+324>>2],J[f+328>>2],J[f+332>>2]);c=b;qf(f+272|0,J[f+304>>2],J[f+308>>2],J[f+312>>2],J[f+316>>2],b,i,u,F);b=d;pf(f+288|0,y,z,n,r,b?0:m,b?0:q,b?0:w,b?0:x);qf(f+256|0,J[f+288>>2],J[f+292>>2],J[f+296>>2],J[f+300>>2],J[f+272>>2],J[f+276>>2],J[f+280>>2],J[f+284>>2]);xf(f+240|0,J[f+256>>2],J[f+260>>2],J[f+264>>2],J[f+268>>2],c,i,u,F);b=J[f+240>>2];d=J[f+244>>2];c=J[f+248>>2];i=J[f+252>>2];if(!sf(b,d,c,i,0,0,0,0)){J[4322]=68}yf(f+224|0,b,d,c,i,j);m=J[f+224>>2];q=J[f+228>>2];d=J[f+236>>2];b=J[f+232>>2];break y}J[4322]=68;nf(f+208|0,l);pf(f+192|0,J[f+208>>2],J[f+212>>2],J[f+216>>2],J[f+220>>2],0,0,0,65536);pf(f+176|0,J[f+192>>2],J[f+196>>2],J[f+200>>2],J[f+204>>2],0,0,0,65536);m=J[f+176>>2];q=J[f+180>>2];d=J[f+188>>2];b=J[f+184>>2]}c=D;J[c>>2]=m;J[c+4>>2]=q;J[c+8>>2]=b;J[c+12>>2]=d;la=f+432|0;j=J[s+24>>2];h=J[s+28>>2];i=J[s+16>>2];k=J[s+20>>2];break a}if(J[b+116>>2]<0){break n}J[b+4>>2]=J[b+4>>2]-1}D=s+32|0;g=b;u=l;f=d;l=0;e=la-8976|0;la=e;E=0-A|0;F=E-B|0;F:{G:{while(1){H:{if((c|0)!=48){if((c|0)!=46){break F}b=J[g+4>>2];if((b|0)==J[g+104>>2]){break H}J[g+4>>2]=b+1;c=K[b|0];break G}b=J[g+4>>2];if((b|0)!=J[g+104>>2]){l=1;J[g+4>>2]=b+1;c=K[b|0]}else{l=1;c=kf(g)}continue}break}c=kf(g)}n=1;if((c|0)!=48){break F}while(1){b=j;j=b-1|0;h=h-!b|0;b=J[g+4>>2];I:{if((b|0)!=J[g+104>>2]){J[g+4>>2]=b+1;c=K[b|0];break I}c=kf(g)}if((c|0)==48){continue}break}l=1}J[e+784>>2]=0;J:{K:{b=(c|0)==46;d=c-48|0;L:{M:{N:{if(b|d>>>0<=9){while(1){O:{if(b&1){if(!n){j=i;h=k;n=1;break O}b=!l;break N}i=i+1|0;k=i?k:k+1|0;if((p|0)<=2044){t=(c|0)==48?t:i;b=(e+784|0)+(p<<2)|0;if(o){d=(P(J[b>>2],10)+c|0)-48|0}J[b>>2]=d;l=1;c=o+1|0;b=(c|0)==9;o=b?0:c;p=b+p|0;break O}if((c|0)==48){break O}J[e+8960>>2]=J[e+8960>>2]|1;t=18396}b=J[g+4>>2];P:{if((b|0)!=J[g+104>>2]){J[g+4>>2]=b+1;c=K[b|0];break P}c=kf(g)}b=(c|0)==46;d=c-48|0;if(b|d>>>0<10){continue}break}}j=n?j:i;h=n?h:k;if(!(!l|(c&-33)!=69)){n=Df(g,f);b=ma;r=b;Q:{if(n|(b|0)!=-2147483648){break Q}if(!f){break L}n=0;r=0;if(J[g+116>>2]<0){break Q}J[g+4>>2]=J[g+4>>2]-1}h=h+r|0;j=j+n|0;h=j>>>0<n>>>0?h+1|0:h;break K}b=!l;if((c|0)<0){break M}}if(J[g+116>>2]<0){break M}J[g+4>>2]=J[g+4>>2]-1}if(!b){break K}J[4322]=28}i=0;k=0;jf(g,0,0);c=0;b=0;break J}b=J[e+784>>2];if(!b){rf(e,+(u|0)*0);i=J[e>>2];k=J[e+4>>2];c=J[e+12>>2];b=J[e+8>>2];break J}if(!(i>>>0>9&(k|0)>=0|(k|0)>0|((j|0)!=(i|0)|(h|0)!=(k|0))|(b>>>B|0?(B|0)<=30:0))){nf(e+48|0,u);wf(e+32|0,b);pf(e+16|0,J[e+48>>2],J[e+52>>2],J[e+56>>2],J[e+60>>2],J[e+32>>2],J[e+36>>2],J[e+40>>2],J[e+44>>2]);i=J[e+16>>2];k=J[e+20>>2];c=J[e+28>>2];b=J[e+24>>2];break J}b=E>>>1|0;if(b>>>0<j>>>0&(h|0)>=0|(h|0)>0){J[4322]=68;nf(e+96|0,u);pf(e+80|0,J[e+96>>2],J[e+100>>2],J[e+104>>2],J[e+108>>2],-1,-1,-1,2147418111);pf(e- -64|0,J[e+80>>2],J[e+84>>2],J[e+88>>2],J[e+92>>2],-1,-1,-1,2147418111);i=J[e+64>>2];k=J[e+68>>2];c=J[e+76>>2];b=J[e+72>>2];break J}b=A-226|0;c=j>>>0<b>>>0;b=b>>31;if(c&(h|0)<=(b|0)|(b|0)>(h|0)){J[4322]=68;nf(e+144|0,u);pf(e+128|0,J[e+144>>2],J[e+148>>2],J[e+152>>2],J[e+156>>2],0,0,0,65536);pf(e+112|0,J[e+128>>2],J[e+132>>2],J[e+136>>2],J[e+140>>2],0,0,0,65536);i=J[e+112>>2];k=J[e+116>>2];c=J[e+124>>2];b=J[e+120>>2];break J}if(o){if((o|0)<=8){b=(e+784|0)+(p<<2)|0;g=J[b>>2];while(1){g=P(g,10);o=o+1|0;if((o|0)!=9){continue}break}J[b>>2]=g}p=p+1|0}o=j;R:{if((j|0)<(t|0)|(t|0)>=9|(j|0)>17){break R}if((j|0)==9){nf(e+192|0,u);wf(e+176|0,J[e+784>>2]);pf(e+160|0,J[e+192>>2],J[e+196>>2],J[e+200>>2],J[e+204>>2],J[e+176>>2],J[e+180>>2],J[e+184>>2],J[e+188>>2]);i=J[e+160>>2];k=J[e+164>>2];c=J[e+172>>2];b=J[e+168>>2];break J}if((o|0)<=8){nf(e+272|0,u);wf(e+256|0,J[e+784>>2]);pf(e+240|0,J[e+272>>2],J[e+276>>2],J[e+280>>2],J[e+284>>2],J[e+256>>2],J[e+260>>2],J[e+264>>2],J[e+268>>2]);nf(e+224|0,J[(0-o<<2)+5088>>2]);Af(e+208|0,J[e+240>>2],J[e+244>>2],J[e+248>>2],J[e+252>>2],J[e+224>>2],J[e+228>>2],J[e+232>>2],J[e+236>>2]);i=J[e+208>>2];k=J[e+212>>2];c=J[e+220>>2];b=J[e+216>>2];break J}b=(P(o,-3)+B|0)+27|0;c=J[e+784>>2];if(c>>>b|0?(b|0)<=30:0){break R}nf(e+352|0,u);wf(e+336|0,c);pf(e+320|0,J[e+352>>2],J[e+356>>2],J[e+360>>2],J[e+364>>2],J[e+336>>2],J[e+340>>2],J[e+344>>2],J[e+348>>2]);nf(e+304|0,J[(o<<2)+5016>>2]);pf(e+288|0,J[e+320>>2],J[e+324>>2],J[e+328>>2],J[e+332>>2],J[e+304>>2],J[e+308>>2],J[e+312>>2],J[e+316>>2]);i=J[e+288>>2];k=J[e+292>>2];c=J[e+300>>2];b=J[e+296>>2];break J}while(1){b=p;p=b-1|0;if(!J[(e+784|0)+(p<<2)>>2]){continue}break}t=0;c=(o|0)%9|0;S:{if(!c){d=0;break S}d=0;j=(o|0)<0?c+9|0:c;T:{if(!b){b=0;break T}i=J[(0-j<<2)+5088>>2];h=1e9/(i|0)|0;c=0;g=0;while(1){p=e+784|0;n=p+(g<<2)|0;k=J[n>>2];l=(k>>>0)/(i>>>0)|0;c=l+c|0;J[n>>2]=c;c=!c&(d|0)==(g|0);d=c?d+1&2047:d;o=c?o-9|0:o;c=P(h,k-P(i,l)|0);g=g+1|0;if((g|0)!=(b|0)){continue}break}if(!c){break T}J[(b<<2)+p>>2]=c;b=b+1|0}o=(o-j|0)+9|0}while(1){n=(e+784|0)+(d<<2)|0;g=(o|0)<36;U:{while(1){if(!g&((o|0)!=36|M[n>>2]>=10384593)){break U}p=b+2047|0;l=0;while(1){c=b;i=p&2047;r=(e+784|0)+(i<<2)|0;b=J[r>>2];k=b>>>3|0;h=b<<29;j=h+l|0;b=k;h=j>>>0<h>>>0?b+1|0:b;if(!h&j>>>0<1000000001){l=0}else{b=j;l=xn(b,h,1e9);j=b-wn(l,ma,1e9,0)|0}J[r>>2]=j;b=(d|0)==(i|0)?c:j?c:i;j=c-1&2047;b=(j|0)!=(i|0)?c:b;p=i-1|0;if((d|0)!=(i|0)){continue}break}t=t-29|0;b=c;if(!l){continue}break}d=d-1&2047;if((d|0)==(b|0)){h=e+784|0;b=h+((b+2046&2047)<<2)|0;J[b>>2]=J[b>>2]|J[(j<<2)+h>>2];b=j}o=o+9|0;J[(e+784|0)+(d<<2)>>2]=l;continue}break}V:{W:while(1){c=b+1&2047;i=(e+784|0)+((b-1&2047)<<2)|0;while(1){j=(o|0)>45?9:1;X:{while(1){l=d;g=0;Y:{while(1){Z:{d=g+l&2047;if((d|0)==(b|0)){break Z}d=J[(e+784|0)+(d<<2)>>2];h=J[(g<<2)+5040>>2];if(d>>>0<h>>>0){break Z}if(d>>>0>h>>>0){break Y}g=g+1|0;if((g|0)!=4){continue}}break}if((o|0)!=36){break Y}j=0;h=0;g=0;i=0;k=0;while(1){c=g+l&2047;if((c|0)==(b|0)){b=b+1&2047;J[(e+(b<<2)|0)+780>>2]=0}wf(e+768|0,J[(e+784|0)+(c<<2)>>2]);pf(e+752|0,j,h,i,k,0,0,1342177280,1075633366);qf(e+736|0,J[e+752>>2],J[e+756>>2],J[e+760>>2],J[e+764>>2],J[e+768>>2],J[e+772>>2],J[e+776>>2],J[e+780>>2]);i=J[e+744>>2];k=J[e+748>>2];j=J[e+736>>2];h=J[e+740>>2];g=g+1|0;if((g|0)!=4){continue}break}nf(e+720|0,u);pf(e+704|0,j,h,i,k,J[e+720>>2],J[e+724>>2],J[e+728>>2],J[e+732>>2]);i=J[e+712>>2];k=J[e+716>>2];j=0;h=0;n=J[e+704>>2];r=J[e+708>>2];p=t+113|0;d=p-A|0;g=(d|0)<(B|0);c=g?(d|0)>0?d:0:B;if((c|0)<=112){break X}break V}t=j+t|0;d=b;if((b|0)==(l|0)){continue}break}n=1e9>>>j|0;k=-1<<j^-1;g=0;d=l;while(1){h=g;p=e+784|0;g=p+(l<<2)|0;r=J[g>>2];h=h+(r>>>j|0)|0;J[g>>2]=h;h=!h&(d|0)==(l|0);d=h?d+1&2047:d;o=h?o-9|0:o;g=P(n,k&r);l=l+1&2047;if((l|0)!=(b|0)){continue}break}if(!g){continue}if((c|0)!=(d|0)){J[(b<<2)+p>>2]=g;b=c;continue W}J[i>>2]=J[i>>2]|1;continue}break}break}rf(e+656|0,uf(225-c|0));vf(e+688|0,J[e+656>>2],J[e+660>>2],J[e+664>>2],J[e+668>>2],n,r,i,k);y=J[e+696>>2];z=J[e+700>>2];w=J[e+688>>2];x=J[e+692>>2];rf(e+640|0,uf(113-c|0));Bf(e+672|0,n,r,i,k,J[e+640>>2],J[e+644>>2],J[e+648>>2],J[e+652>>2]);j=J[e+672>>2];h=J[e+676>>2];m=J[e+680>>2];q=J[e+684>>2];xf(e+624|0,n,r,i,k,j,h,m,q);qf(e+608|0,w,x,y,z,J[e+624>>2],J[e+628>>2],J[e+632>>2],J[e+636>>2]);i=J[e+616>>2];k=J[e+620>>2];n=J[e+608>>2];r=J[e+612>>2]}o=l+4&2047;_:{if((o|0)==(b|0)){break _}o=J[(e+784|0)+(o<<2)>>2];$:{if(o>>>0<=499999999){if(!o&(l+5&2047)==(b|0)){break $}rf(e+496|0,+(u|0)*.25);qf(e+480|0,j,h,m,q,J[e+496>>2],J[e+500>>2],J[e+504>>2],J[e+508>>2]);m=J[e+488>>2];q=J[e+492>>2];j=J[e+480>>2];h=J[e+484>>2];break $}if((o|0)!=5e8){rf(e+592|0,+(u|0)*.75);qf(e+576|0,j,h,m,q,J[e+592>>2],J[e+596>>2],J[e+600>>2],J[e+604>>2]);m=J[e+584>>2];q=J[e+588>>2];j=J[e+576>>2];h=J[e+580>>2];break $}I=+(u|0);if((l+5&2047)==(b|0)){rf(e+528|0,I*.5);qf(e+512|0,j,h,m,q,J[e+528>>2],J[e+532>>2],J[e+536>>2],J[e+540>>2]);m=J[e+520>>2];q=J[e+524>>2];j=J[e+512>>2];h=J[e+516>>2];break $}rf(e+560|0,I*.75);qf(e+544|0,j,h,m,q,J[e+560>>2],J[e+564>>2],J[e+568>>2],J[e+572>>2]);m=J[e+552>>2];q=J[e+556>>2];j=J[e+544>>2];h=J[e+548>>2]}if((c|0)>111){break _}Bf(e+464|0,j,h,m,q,0,0,0,1073676288);if(sf(J[e+464>>2],J[e+468>>2],J[e+472>>2],J[e+476>>2],0,0,0,0)){break _}qf(e+448|0,j,h,m,q,0,0,0,1073676288);m=J[e+456>>2];q=J[e+460>>2];j=J[e+448>>2];h=J[e+452>>2]}qf(e+432|0,n,r,i,k,j,h,m,q);xf(e+416|0,J[e+432>>2],J[e+436>>2],J[e+440>>2],J[e+444>>2],w,x,y,z);i=J[e+424>>2];k=J[e+428>>2];n=J[e+416>>2];r=J[e+420>>2];aa:{if((F-2|0)>=(p&2147483647)){break aa}b=e+400|0;J[b+8>>2]=i;J[b+12>>2]=k&2147483647;J[b>>2]=n;J[b+4>>2]=r;pf(e+384|0,n,r,i,k,0,0,0,1073610752);l=tf(J[e+400>>2],J[e+404>>2],J[e+408>>2],J[e+412>>2],1081081856);b=(l|0)>=0;i=b?J[e+392>>2]:i;k=b?J[e+396>>2]:k;n=b?J[e+384>>2]:n;r=b?J[e+388>>2]:r;j=sf(j,h,m,q,0,0,0,0);t=b+t|0;if((t+110|0)<=(F|0)){if(!(g&((c|0)!=(d|0)|(l|0)<0)&(j|0)!=0)){break aa}}J[4322]=68}yf(e+368|0,n,r,i,k,t);i=J[e+368>>2];k=J[e+372>>2];c=J[e+380>>2];b=J[e+376>>2]}J[D+8>>2]=b;J[D+12>>2]=c;J[D>>2]=i;J[D+4>>2]=k;la=e+8976|0;j=J[s+40>>2];h=J[s+44>>2];i=J[s+32>>2];k=J[s+36>>2];break a;case 3:break j;default:break m}}c=J[b+116>>2];if((c|0)>0){c=1}else{c=(c|0)>=0}if(c){J[b+4>>2]=J[b+4>>2]-1}break i}ba:{c=J[b+4>>2];ca:{if((c|0)!=J[b+104>>2]){J[b+4>>2]=c+1;c=K[c|0];break ca}c=kf(b)}if((c|0)==40){g=1;break ba}h=2147450880;if(J[b+116>>2]<0){break a}J[b+4>>2]=J[b+4>>2]-1;break a}while(1){da:{c=J[b+4>>2];ea:{if((c|0)!=J[b+104>>2]){J[b+4>>2]=c+1;c=K[c|0];break ea}c=kf(b)}if(!(c-48>>>0<10|c-65>>>0<26|(c|0)==95)){if(c-97>>>0>=26){break da}}g=g+1|0;continue}break}h=2147450880;if((c|0)==41){break a}c=J[b+116>>2];if((c|0)>=0|(c|0)>0){J[b+4>>2]=J[b+4>>2]-1}fa:{if(d){if(g){break fa}break a}break i}while(1){if((c|0)>0|(c|0)>=0){J[b+4>>2]=J[b+4>>2]-1}g=g-1|0;if(g){continue}break}break a}J[4322]=28;jf(b,0,0)}h=0}J[a>>2]=i;J[a+4>>2]=k;J[a+8>>2]=j;J[a+12>>2]=h;la=s+48|0}function Ha(a,b,c,d,e,f){var g=0,h=0,i=0,j=0,k=0,l=0,m=0;g=la-112|0;la=g;J[a+4>>2]=0;J[a+8>>2]=0;J[a+20>>2]=0;J[a+24>>2]=0;H[a|0]=1;H[a+9|0]=0;H[a+10|0]=0;H[a+11|0]=0;H[a+12|0]=0;H[a+13|0]=0;H[a+14|0]=0;H[a+15|0]=0;H[a+16|0]=0;J[a+28>>2]=0;J[a+32>>2]=0;J[a+36>>2]=0;J[a+40>>2]=0;h=J[b+96>>2];a:{if((h|0)!=J[b+100>>2]){b:{if(H[e+11|0]>=0){k=J[e+4>>2];J[h>>2]=J[e>>2];J[h+4>>2]=k;J[h+8>>2]=J[e+8>>2];break b}vm(h,J[e>>2],J[e+4>>2])}k=J[e+16>>2];J[h+12>>2]=J[e+12>>2];J[h+16>>2]=k;J[b+96>>2]=h+20;break a}Da(b+92|0,e)}J[b+104>>2]=6;h=K[c+23|0];l=h<<24>>24;c:{d:{e:{f:{g:{j=(l|0)<0?J[c+16>>2]:h;i=j+8|0;if(i>>>0<2147483632){k=c+12|0;h:{i:{if(i>>>0>=11){m=(i|15)+1|0;h=om(m);J[g+84>>2]=i;J[g+80>>2]=h;J[g+88>>2]=m|-2147483648;break i}J[g+88>>2]=0;J[g+80>>2]=0;J[g+84>>2]=0;H[g+91|0]=i;h=g+80|0;if(!j){break h}}jb(h,(l|0)<0?J[k>>2]:k,j)}h=h+j|0;H[h+8|0]=0;H[h|0]=32;H[h+1|0]=112;H[h+2|0]=108;H[h+3|0]=97;H[h+4|0]=121;H[h+5|0]=101;H[h+6|0]=100;H[h+7|0]=32;h=g- -64|0;Fa(h,e);j=h;h=K[g+75|0];i=h<<24>>24<0;h=xm(g+80|0,i?J[g+64>>2]:j,i?J[g+68>>2]:h);i=h+8|0;J[g+104>>2]=J[i>>2];j=J[h+4>>2];J[g+96>>2]=J[h>>2];J[g+100>>2]=j;J[h>>2]=0;J[h+4>>2]=0;J[i>>2]=0;h=Dm(g+96|0,2077);i=h+8|0;J[g+8>>2]=J[i>>2];j=J[h+4>>2];J[g>>2]=J[h>>2];J[g+4>>2]=j;J[h>>2]=0;J[h+4>>2]=0;J[i>>2]=0;Ea(b,g);if(H[g+11|0]<0){tb(J[g>>2])}if(H[g+107|0]<0){tb(J[g+96>>2])}if(H[g+75|0]<0){tb(J[g+64>>2])}if(H[g+91|0]<0){tb(J[g+80>>2])}h=J[c+32>>2];i=J[c+28>>2];if((h-i|0)==20){h=K[c+23|0];l=h<<24>>24;j=(l|0)<0?J[c+16>>2]:h;i=j+12|0;if(i>>>0>=2147483632){break g}j:{k:{if(i>>>0<=10){J[g+8>>2]=0;J[g>>2]=0;J[g+4>>2]=0;H[g+11|0]=i;h=g;break k}m=(i|15)+1|0;h=om(m);J[g+4>>2]=i;J[g>>2]=h;J[g+8>>2]=m|-2147483648;if(!j){break j}}jb(h,(l|0)<0?J[k>>2]:k,j)}i=K[2621]|K[2622]<<8|(K[2623]<<16|K[2624]<<24);h=h+j|0;j=K[2617]|K[2618]<<8|(K[2619]<<16|K[2620]<<24);H[h|0]=j;H[h+1|0]=j>>>8;H[h+2|0]=j>>>16;H[h+3|0]=j>>>24;H[h+4|0]=i;H[h+5|0]=i>>>8;H[h+6|0]=i>>>16;H[h+7|0]=i>>>24;H[h+12|0]=0;i=K[2625]|K[2626]<<8|(K[2627]<<16|K[2628]<<24);H[h+8|0]=i;H[h+9|0]=i>>>8;H[h+10|0]=i>>>16;H[h+11|0]=i>>>24;Ea(b,g);if(H[g+11|0]<0){tb(J[g>>2])}H[g+104|0]=K[1547];H[g+107|0]=9;h=K[1543]|K[1544]<<8|(K[1545]<<16|K[1546]<<24);J[g+96>>2]=K[1539]|K[1540]<<8|(K[1541]<<16|K[1542]<<24);J[g+100>>2]=h;H[g+105|0]=0;Ia(g,g+96|0);h=H[g+107|0];J[a+40>>2]=J[g+8>>2];i=J[g+4>>2];J[a+32>>2]=J[g>>2];J[a+36>>2]=i;H[g+11|0]=0;H[g|0]=0;if((h|0)>=0){break f}tb(J[g+96>>2]);break f}if((h|0)!=(i|0)){break f}d=K[c+23|0];h=d<<24>>24;f=(h|0)<0?J[c+16>>2]:d;e=f+19|0;if(e>>>0>=2147483632){break g}l:{m:{if(e>>>0<=10){J[g+8>>2]=0;J[g>>2]=0;J[g+4>>2]=0;H[g+11|0]=e;d=g;break m}i=(e|15)+1|0;d=om(i);J[g+4>>2]=e;J[g>>2]=d;J[g+8>>2]=i|-2147483648;if(!f){break l}}jb(d,(h|0)<0?J[k>>2]:k,f)}e=K[2601]|K[2602]<<8|(K[2603]<<16|K[2604]<<24);d=d+f|0;f=K[2597]|K[2598]<<8|(K[2599]<<16|K[2600]<<24);H[d|0]=f;H[d+1|0]=f>>>8;H[d+2|0]=f>>>16;H[d+3|0]=f>>>24;H[d+4|0]=e;H[d+5|0]=e>>>8;H[d+6|0]=e>>>16;H[d+7|0]=e>>>24;H[d+19|0]=0;e=K[2612]|K[2613]<<8|(K[2614]<<16|K[2615]<<24);H[d+15|0]=e;H[d+16|0]=e>>>8;H[d+17|0]=e>>>16;H[d+18|0]=e>>>24;e=K[2609]|K[2610]<<8|(K[2611]<<16|K[2612]<<24);f=K[2605]|K[2606]<<8|(K[2607]<<16|K[2608]<<24);H[d+8|0]=f;H[d+9|0]=f>>>8;H[d+10|0]=f>>>16;H[d+11|0]=f>>>24;H[d+12|0]=e;H[d+13|0]=e>>>8;H[d+14|0]=e>>>16;H[d+15|0]=e>>>24;Ea(b,g);if(H[g+11|0]<0){tb(J[g>>2])}e=a+20|0;H[b+124|0]=1;d=b+128|0;n:{if((d|0)==(c|0)){break n}h=K[c+11|0];f=h<<24>>24;if(H[b+139|0]>=0){if((f|0)>=0){f=J[c+4>>2];J[d>>2]=J[c>>2];J[d+4>>2]=f;J[d+8>>2]=J[c+8>>2];break n}Bm(d,J[c>>2],J[c+4>>2]);break n}f=(f|0)<0;Am(d,f?J[c>>2]:c,f?J[c+4>>2]:h)}H[a+16|0]=1;o:{if((d|0)==(e|0)){break o}if(H[b+139|0]>=0){b=J[d+4>>2];J[e>>2]=J[d>>2];J[e+4>>2]=b;J[e+8>>2]=J[d+8>>2];break o}Bm(e,J[b+128>>2],J[b+132>>2])}b=K[c+23|0];f=b<<24>>24;e=(f|0)<0?J[c+16>>2]:b;b=e+22|0;if(b>>>0>=2147483632){break g}p:{q:{if(b>>>0<=10){J[g+8>>2]=0;J[g>>2]=0;J[g+4>>2]=0;H[g+11|0]=b;d=g;break q}c=(b|15)+1|0;d=om(c);J[g+4>>2]=b;J[g>>2]=d;J[g+8>>2]=c|-2147483648;if(!e){break p}}jb(d,(f|0)<0?J[k>>2]:k,e)}c=a+4|0;b=d+e|0;d=K[2634]|K[2635]<<8|(K[2636]<<16|K[2637]<<24);e=K[2630]|K[2631]<<8|(K[2632]<<16|K[2633]<<24);H[b|0]=e;H[b+1|0]=e>>>8;H[b+2|0]=e>>>16;H[b+3|0]=e>>>24;H[b+4|0]=d;H[b+5|0]=d>>>8;H[b+6|0]=d>>>16;H[b+7|0]=d>>>24;H[b+22|0]=0;d=K[2648]|K[2649]<<8|(K[2650]<<16|K[2651]<<24);e=K[2644]|K[2645]<<8|(K[2646]<<16|K[2647]<<24);H[b+14|0]=e;H[b+15|0]=e>>>8;H[b+16|0]=e>>>16;H[b+17|0]=e>>>24;H[b+18|0]=d;H[b+19|0]=d>>>8;H[b+20|0]=d>>>16;H[b+21|0]=d>>>24;d=K[2642]|K[2643]<<8|(K[2644]<<16|K[2645]<<24);e=K[2638]|K[2639]<<8|(K[2640]<<16|K[2641]<<24);H[b+8|0]=e;H[b+9|0]=e>>>8;H[b+10|0]=e>>>16;H[b+11|0]=e>>>24;H[b+12|0]=d;H[b+13|0]=d>>>8;H[b+14|0]=d>>>16;H[b+15|0]=d>>>24;if(H[a+15|0]<0){tb(J[c>>2])}b=J[g+4>>2];J[c>>2]=J[g>>2];J[c+4>>2]=b;J[c+8>>2]=J[g+8>>2];H[g+101|0]=0;H[g+100|0]=K[1419];H[g+107|0]=5;J[g+96>>2]=K[1415]|K[1416]<<8|(K[1417]<<16|K[1418]<<24);Ia(g,g+96|0);b=a+32|0;if(H[a+43|0]<0){tb(J[b>>2])}a=J[g+4>>2];J[b>>2]=J[g>>2];J[b+4>>2]=a;J[b+8>>2]=J[g+8>>2];H[g+11|0]=0;H[g|0]=0;if(H[g+107|0]>=0){break e}tb(J[g+96>>2]);break e}Ba();B()}Ba();B()}r:{s:{if(J[e+12>>2]==5){j=(f|0)!=6?f:0;J[b+104>>2]=j;d=K[c+23|0];i=d<<24>>24;f=(i|0)<0?J[c+16>>2]:d;d=f+19|0;if(d>>>0>=2147483632){break d}t:{u:{if(d>>>0<=10){J[g+56>>2]=0;J[g+48>>2]=0;J[g+52>>2]=0;H[g+59|0]=d;h=g+48|0;break u}l=(d|15)+1|0;h=om(l);J[g+52>>2]=d;J[g+48>>2]=h;J[g+56>>2]=l|-2147483648;if(!f){break t}}jb(h,(i|0)<0?J[k>>2]:k,f)}f=f+h|0;d=f;h=K[2801]|K[2802]<<8|(K[2803]<<16|K[2804]<<24);i=K[2797]|K[2798]<<8|(K[2799]<<16|K[2800]<<24);H[d|0]=i;H[d+1|0]=i>>>8;H[d+2|0]=i>>>16;H[d+3|0]=i>>>24;H[d+4|0]=h;H[d+5|0]=h>>>8;H[d+6|0]=h>>>16;H[d+7|0]=h>>>24;H[d+19|0]=0;h=K[2812]|K[2813]<<8|(K[2814]<<16|K[2815]<<24);H[d+15|0]=h;H[d+16|0]=h>>>8;H[d+17|0]=h>>>16;H[d+18|0]=h>>>24;d=8;h=K[2809]|K[2810]<<8|(K[2811]<<16|K[2812]<<24);i=K[2805]|K[2806]<<8|(K[2807]<<16|K[2808]<<24);H[f+8|0]=i;H[f+9|0]=i>>>8;H[f+10|0]=i>>>16;H[f+11|0]=i>>>24;H[f+12|0]=h;H[f+13|0]=h>>>8;H[f+14|0]=h>>>16;H[f+15|0]=h>>>24;v:{w:{x:{y:{switch(j|0){case 0:d=6;H[g+43|0]=6;J[g+32>>2]=K[1532]|K[1533]<<8|(K[1534]<<16|K[1535]<<24);I[g+36>>1]=K[1536]|K[1537]<<8;break v;case 1:J[g+32>>2]=1634300532;J[g+36>>2]=1701603182;break w;case 2:d=5;H[g+43|0]=5;J[g+32>>2]=K[1250]|K[1251]<<8|(K[1252]<<16|K[1253]<<24);H[g+36|0]=K[1254];break v;case 3:d=6;H[g+43|0]=6;J[g+32>>2]=K[1509]|K[1510]<<8|(K[1511]<<16|K[1512]<<24);I[g+36>>1]=K[1513]|K[1514]<<8;break v;case 4:J[g+32>>2]=1918989427;break x;case 5:J[g+32>>2]=1953458295;break x;default:break y}}J[g+32>>2]=1701736302}d=4}H[g+43|0]=d}f=d;d=g+32|0;H[f+d|0]=0;h=d;d=K[g+43|0];f=d<<24>>24<0;d=xm(g+48|0,f?J[g+32>>2]:h,f?J[g+36>>2]:d);f=d+8|0;J[g+72>>2]=J[f>>2];h=J[d+4>>2];J[g+64>>2]=J[d>>2];J[g+68>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;d=Dm(g- -64|0,2181);f=d+8|0;J[g+88>>2]=J[f>>2];h=J[d+4>>2];J[g+80>>2]=J[d>>2];J[g+84>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;z:{A:{B:{switch(j|0){case 0:d=3;H[g+31|0]=3;I[g+20>>1]=K[1036]|K[1037]<<8;H[g+22|0]=K[1038];break z;case 1:d=3;H[g+31|0]=3;I[g+20>>1]=K[1024]|K[1025]<<8;H[g+22|0]=K[1026];break z;case 2:d=3;H[g+31|0]=3;I[g+20>>1]=K[1032]|K[1033]<<8;H[g+22|0]=K[1034];break z;case 3:d=3;H[g+31|0]=3;I[g+20>>1]=K[1028]|K[1029]<<8;H[g+22|0]=K[1030];break z;case 4:d=3;H[g+31|0]=3;I[g+20>>1]=K[1040]|K[1041]<<8;H[g+22|0]=K[1042];break z;case 5:J[g+20>>2]=-1852727312;d=4;break A;default:break B}}H[g+20|0]=63;d=1}H[g+31|0]=d}f=g+20|0;H[f+d|0]=0;d=xm(g+80|0,f,d);f=d+8|0;J[g+104>>2]=J[f>>2];h=J[d+4>>2];J[g+96>>2]=J[d>>2];J[g+100>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;d=Dm(g+96|0,2179);f=d+8|0;J[g+8>>2]=J[f>>2];h=J[d+4>>2];J[g>>2]=J[d>>2];J[g+4>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;Ea(b,g);if(H[g+11|0]<0){tb(J[g>>2])}if(H[g+107|0]<0){tb(J[g+96>>2])}if(H[g+31|0]<0){tb(J[g+20>>2])}if(H[g+91|0]<0){tb(J[g+80>>2])}if(H[g+75|0]<0){tb(J[g+64>>2])}if(H[g+43|0]<0){tb(J[g+32>>2])}if(H[g+59|0]<0){tb(J[g+48>>2])}H[g+100|0]=0;J[g+96>>2]=1953458295;H[g+107|0]=4;Ia(g,g+96|0);d=a+32|0;if(H[a+43|0]<0){tb(J[d>>2])}f=J[g+4>>2];J[d>>2]=J[g>>2];J[d+4>>2]=f;J[d+8>>2]=J[g+8>>2];H[g+11|0]=0;H[g|0]=0;if(H[g+107|0]>=0){break s}tb(J[g+96>>2]);break s}C:{D:{E:{F:{f=J[e+16>>2];switch(f-1|0){case 4:break D;case 1:break E;case 0:break F;default:break C}}d=g+96|0;Hm(d,2863,k);d=Dm(d,2425);f=d+8|0;J[g+8>>2]=J[f>>2];h=J[d+4>>2];J[g>>2]=J[d>>2];J[g+4>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;Ea(b,g);if(H[g+11|0]<0){tb(J[g>>2])}if(H[g+107|0]<0){tb(J[g+96>>2])}H[g+107|0]=7;H[g+103|0]=0;J[g+96>>2]=K[1369]|K[1370]<<8|(K[1371]<<16|K[1372]<<24);b=K[1372]|K[1373]<<8|(K[1374]<<16|K[1375]<<24);H[g+99|0]=b;H[g+100|0]=b>>>8;H[g+101|0]=b>>>16;H[g+102|0]=b>>>24;Ia(g,g+96|0);b=a+32|0;if(H[a+43|0]<0){tb(J[b>>2])}d=J[g+4>>2];J[b>>2]=J[g>>2];J[b+4>>2]=d;J[b+8>>2]=J[g+8>>2];H[g+11|0]=0;H[g|0]=0;if(H[g+107|0]>=0){break r}tb(J[g+96>>2]);break r}f=b+108|0;d=J[f>>2]+2|0;J[f>>2]=d;f=g+80|0;Im(f,d);d=zm(f,2701);f=d+8|0;J[g+104>>2]=J[f>>2];h=J[d+4>>2];J[g+96>>2]=J[d>>2];J[g+100>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;d=Dm(g+96|0,2077);f=d+8|0;J[g+8>>2]=J[f>>2];h=J[d+4>>2];J[g>>2]=J[d>>2];J[g+4>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;Ea(b,g);if(H[g+11|0]<0){tb(J[g>>2])}if(H[g+107|0]<0){tb(J[g+96>>2])}if(H[g+91|0]<0){tb(J[g+80>>2])}H[g+101|0]=0;H[g+100|0]=K[1897];H[g+107|0]=5;J[g+96>>2]=K[1893]|K[1894]<<8|(K[1895]<<16|K[1896]<<24);Ia(g,g+96|0);d=a+32|0;if(H[a+43|0]<0){tb(J[d>>2])}f=J[g+4>>2];J[d>>2]=J[g>>2];J[d+4>>2]=f;J[d+8>>2]=J[g+8>>2];H[g+11|0]=0;H[g|0]=0;if(H[g+107|0]>=0){break s}tb(J[g+96>>2]);break s}if(!K[b+115|0]){break s}f=b+108|0;d=J[f>>2]+3|0;J[f>>2]=d;f=g+80|0;Im(f,d);d=zm(f,2666);f=d+8|0;J[g+104>>2]=J[f>>2];h=J[d+4>>2];J[g+96>>2]=J[d>>2];J[g+100>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;d=Dm(g+96|0,2077);f=d+8|0;J[g+8>>2]=J[f>>2];h=J[d+4>>2];J[g>>2]=J[d>>2];J[g+4>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;Ea(b,g);if(H[g+11|0]<0){tb(J[g>>2])}if(H[g+107|0]<0){tb(J[g+96>>2])}if(H[g+91|0]<0){tb(J[g+80>>2])}H[g+101|0]=0;H[g+100|0]=K[1891];H[g+107|0]=5;J[g+96>>2]=K[1887]|K[1888]<<8|(K[1889]<<16|K[1890]<<24);Ia(g,g+96|0);d=a+32|0;if(H[a+43|0]<0){tb(J[d>>2])}f=J[g+4>>2];J[d>>2]=J[g>>2];J[d+4>>2]=f;J[d+8>>2]=J[g+8>>2];H[g+11|0]=0;H[g|0]=0;if(H[g+107|0]>=0){break s}tb(J[g+96>>2]);break s}if(!(!K[b+116|0]|(f|0)!=8)){f=g+96|0;Hm(f,2873,d+12|0);d=Dm(f,2547);f=d+8|0;J[g+8>>2]=J[f>>2];h=J[d+4>>2];J[g>>2]=J[d>>2];J[g+4>>2]=h;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;Ea(b,g);if(H[g+11|0]<0){tb(J[g>>2])}if(H[g+107|0]<0){tb(J[g+96>>2])}H[g+107|0]=7;H[g+103|0]=0;J[g+96>>2]=K[1549]|K[1550]<<8|(K[1551]<<16|K[1552]<<24);b=K[1552]|K[1553]<<8|(K[1554]<<16|K[1555]<<24);H[g+99|0]=b;H[g+100|0]=b>>>8;H[g+101|0]=b>>>16;H[g+102|0]=b>>>24;Ia(g,g+96|0);b=a+32|0;if(H[a+43|0]<0){tb(J[b>>2])}d=J[g+4>>2];J[b>>2]=J[g>>2];J[b+4>>2]=d;J[b+8>>2]=J[g+8>>2];H[g+11|0]=0;H[g|0]=0;if(H[g+107|0]>=0){break r}tb(J[g+96>>2]);break r}if((f|0)!=14){break s}f=g+96|0;Hm(f,2846,d+12|0);f=Dm(f,2054);h=f+8|0;J[g+8>>2]=J[h>>2];i=J[f+4>>2];J[g>>2]=J[f>>2];J[g+4>>2]=i;J[f>>2]=0;J[f+4>>2]=0;J[h>>2]=0;Ea(b,g);if(H[g+11|0]<0){tb(J[g>>2])}f=b+80|0;if(H[g+107|0]<0){tb(J[g+96>>2])}Ca(g,f);f=K[g+11|0];if(f<<24>>24<0?J[g+4>>2]:f){f=K[g+11|0];h=f<<24>>24;i=J[g+4>>2];if((h|0)<0?i:f){G:{f=J[d+32>>2];if((f|0)!=J[d+36>>2]){H:{if((h|0)>=0){h=J[g+4>>2];J[f>>2]=J[g>>2];J[f+4>>2]=h;J[f+8>>2]=J[g+8>>2];break H}vm(f,J[g>>2],i)}h=J[g+16>>2];J[f+12>>2]=J[g+12>>2];J[f+16>>2]=h;J[d+32>>2]=f+20;break G}Da(d+28|0,g)}}}H[g+86|0]=0;I[g+84>>1]=K[1239]|K[1240]<<8;H[g+91|0]=6;J[g+80>>2]=K[1235]|K[1236]<<8|(K[1237]<<16|K[1238]<<24);Ia(g+96|0,g+80|0);d=a+32|0;if(H[a+43|0]<0){tb(J[d>>2])}f=J[g+100>>2];J[d>>2]=J[g+96>>2];J[d+4>>2]=f;J[d+8>>2]=J[g+104>>2];H[g+107|0]=0;H[g+96|0]=0;if(H[g+91|0]<0){tb(J[g+80>>2])}if(H[g+11|0]>=0){break s}tb(J[g>>2])}J[b+120>>2]=!J[b+120>>2]}b=K[c+23|0];f=b<<24>>24;c=(f|0)<0?J[c+16>>2]:b;b=c+8|0;if(b>>>0>=2147483632){break c}I:{J:{if(b>>>0>=11){h=(b|15)+1|0;d=om(h);J[g+100>>2]=b;J[g+96>>2]=d;J[g+104>>2]=h|-2147483648;break J}J[g+104>>2]=0;J[g+96>>2]=0;J[g+100>>2]=0;H[g+107|0]=b;d=g+96|0;if(!c){break I}}jb(d,(f|0)<0?J[k>>2]:k,c)}b=c+d|0;H[b+8|0]=0;H[b|0]=32;H[b+1|0]=112;H[b+2|0]=108;H[b+3|0]=97;H[b+4|0]=121;H[b+5|0]=101;H[b+6|0]=100;H[b+7|0]=32;b=g+80|0;Fa(b,e);d=b;b=K[g+91|0];c=b<<24>>24<0;b=xm(g+96|0,c?J[g+80>>2]:d,c?J[g+84>>2]:b);c=b+8|0;J[g+8>>2]=J[c>>2];d=J[b+4>>2];J[g>>2]=J[b>>2];J[g+4>>2]=d;J[b>>2]=0;J[b+4>>2]=0;J[c>>2]=0;b=Dm(g,2077);d=J[b>>2];J[g+64>>2]=J[b+4>>2];c=K[b+7|0]|K[b+8|0]<<8|(K[b+9|0]<<16|K[b+10|0]<<24);H[g+67|0]=c;H[g+68|0]=c>>>8;H[g+69|0]=c>>>16;H[g+70|0]=c>>>24;J[b>>2]=0;J[b+4>>2]=0;c=K[b+11|0];J[b+8>>2]=0;e=H[g+11|0];J[a+4>>2]=d;J[a+8>>2]=J[g+64>>2];b=K[g+67|0]|K[g+68|0]<<8|(K[g+69|0]<<16|K[g+70|0]<<24);H[a+11|0]=b;H[a+12|0]=b>>>8;H[a+13|0]=b>>>16;H[a+14|0]=b>>>24;H[a+15|0]=c;if((e|0)<0){tb(J[g>>2])}if(H[g+91|0]<0){tb(J[g+80>>2])}if(H[g+107|0]>=0){break e}tb(J[g+96>>2])}la=g+112|0;return}Ba();B()}Ba();B()}function sb(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;l=la-16|0;la=l;a:{b:{c:{d:{e:{f:{g:{h:{i:{if(a>>>0<=244){h=J[4324];g=a>>>0<11?16:a+11&-8;b=g>>>3|0;a=h>>>b|0;if(a&3){c=b+((a^-1)&1)|0;a=c<<3;b=a+17336|0;d=J[a+17344>>2];a=J[d+8>>2];j:{if((b|0)==(a|0)){m=17296,n=yn(c)&h,J[m>>2]=n;break j}J[a+12>>2]=b;J[b+8>>2]=a}a=d+8|0;b=c<<3;J[d+4>>2]=b|3;b=b+d|0;J[b+4>>2]=J[b+4>>2]|1;break a}k=J[4326];if(k>>>0>=g>>>0){break i}if(a){c=a<<b;a=2<<b;d=vn(c&(0-a|a));a=d<<3;b=a+17336|0;e=J[a+17344>>2];a=J[e+8>>2];k:{if((b|0)==(a|0)){h=yn(d)&h;J[4324]=h;break k}J[a+12>>2]=b;J[b+8>>2]=a}J[e+4>>2]=g|3;c=e+g|0;a=d<<3;d=a-g|0;J[c+4>>2]=d|1;J[a+e>>2]=d;if(k){b=(k&-8)+17336|0;f=J[4329];a=1<<(k>>>3);l:{if(!(a&h)){J[4324]=a|h;a=b;break l}a=J[b+8>>2]}J[b+8>>2]=f;J[a+12>>2]=f;J[f+12>>2]=b;J[f+8>>2]=a}a=e+8|0;J[4329]=c;J[4326]=d;break a}j=J[4325];if(!j){break i}c=J[(vn(j)<<2)+17600>>2];e=(J[c+4>>2]&-8)-g|0;b=c;while(1){m:{a=J[b+16>>2];if(!a){a=J[b+20>>2];if(!a){break m}}b=(J[a+4>>2]&-8)-g|0;d=b>>>0<e>>>0;e=d?b:e;c=d?a:c;b=a;continue}break}i=J[c+24>>2];d=J[c+12>>2];if((d|0)!=(c|0)){a=J[c+8>>2];J[a+12>>2]=d;J[d+8>>2]=a;break b}b=c+20|0;a=J[b>>2];if(!a){a=J[c+16>>2];if(!a){break h}b=c+16|0}while(1){f=b;d=a;b=a+20|0;a=J[b>>2];if(a){continue}b=d+16|0;a=J[d+16>>2];if(a){continue}break}J[f>>2]=0;break b}g=-1;if(a>>>0>4294967231){break i}a=a+11|0;g=a&-8;j=J[4325];if(!j){break i}e=0-g|0;h=0;n:{if(g>>>0<256){break n}h=31;if(g>>>0>16777215){break n}a=S(a>>>8|0);h=((g>>>38-a&1)-(a<<1)|0)+62|0}b=J[(h<<2)+17600>>2];o:{p:{q:{if(!b){a=0;break q}a=0;c=g<<((h|0)!=31?25-(h>>>1|0)|0:0);while(1){r:{f=(J[b+4>>2]&-8)-g|0;if(f>>>0>=e>>>0){break r}d=b;e=f;if(e){break r}e=0;a=b;break p}f=J[b+20>>2];b=J[((c>>>29&4)+b|0)+16>>2];a=f?(f|0)==(b|0)?a:f:a;c=c<<1;if(b){continue}break}}if(!(a|d)){d=0;a=2<<h;a=(0-a|a)&j;if(!a){break i}a=J[(vn(a)<<2)+17600>>2]}if(!a){break o}}while(1){b=(J[a+4>>2]&-8)-g|0;c=b>>>0<e>>>0;e=c?b:e;d=c?a:d;b=J[a+16>>2];if(b){a=b}else{a=J[a+20>>2]}if(a){continue}break}}if(!d|J[4326]-g>>>0<=e>>>0){break i}h=J[d+24>>2];c=J[d+12>>2];if((d|0)!=(c|0)){a=J[d+8>>2];J[a+12>>2]=c;J[c+8>>2]=a;break c}b=d+20|0;a=J[b>>2];if(!a){a=J[d+16>>2];if(!a){break g}b=d+16|0}while(1){f=b;c=a;b=a+20|0;a=J[b>>2];if(a){continue}b=c+16|0;a=J[c+16>>2];if(a){continue}break}J[f>>2]=0;break c}a=J[4326];if(a>>>0>=g>>>0){d=J[4329];b=a-g|0;s:{if(b>>>0>=16){c=d+g|0;J[c+4>>2]=b|1;J[a+d>>2]=b;J[d+4>>2]=g|3;break s}J[d+4>>2]=a|3;a=a+d|0;J[a+4>>2]=J[a+4>>2]|1;c=0;b=0}J[4326]=b;J[4329]=c;a=d+8|0;break a}i=J[4327];if(i>>>0>g>>>0){b=i-g|0;J[4327]=b;c=J[4330];a=c+g|0;J[4330]=a;J[a+4>>2]=b|1;J[c+4>>2]=g|3;a=c+8|0;break a}a=0;e=g+47|0;if(J[4442]){c=J[4444]}else{J[4445]=-1;J[4446]=-1;J[4443]=4096;J[4444]=4096;J[4442]=l+12&-16^1431655768;J[4447]=0;J[4435]=0;c=4096}h=e+c|0;f=0-c|0;b=h&f;if(b>>>0<=g>>>0){break a}d=J[4434];if(d){c=J[4432];j=c+b|0;if(d>>>0<j>>>0|c>>>0>=j>>>0){break a}}t:{if(!(K[17740]&4)){u:{v:{w:{x:{d=J[4330];if(d){a=17744;while(1){c=J[a>>2];if(c>>>0<=d>>>0&d>>>0<c+J[a+4>>2]>>>0){break x}a=J[a+8>>2];if(a){continue}break}}c=rb(0);if((c|0)==-1){break u}h=b;d=J[4443];a=d-1|0;if(a&c){h=(b-c|0)+(a+c&0-d)|0}if(g>>>0>=h>>>0){break u}d=J[4434];if(d){a=J[4432];f=a+h|0;if(d>>>0<f>>>0|a>>>0>=f>>>0){break u}}a=rb(h);if((c|0)!=(a|0)){break w}break t}h=f&h-i;c=rb(h);if((c|0)==(J[a>>2]+J[a+4>>2]|0)){break v}a=c}if((a|0)==-1){break u}if(g+48>>>0<=h>>>0){c=a;break t}c=J[4444];c=c+(e-h|0)&0-c;if((rb(c)|0)==-1){break u}h=c+h|0;c=a;break t}if((c|0)!=-1){break t}}J[4435]=J[4435]|4}c=rb(b);a=rb(0);if((c|0)==-1|(a|0)==-1|a>>>0<=c>>>0){break d}h=a-c|0;if(h>>>0<=g+40>>>0){break d}}a=J[4432]+h|0;J[4432]=a;if(a>>>0>M[4433]){J[4433]=a}y:{e=J[4330];if(e){a=17744;while(1){d=J[a>>2];b=J[a+4>>2];if((d+b|0)==(c|0)){break y}a=J[a+8>>2];if(a){continue}break}break f}a=J[4328];if(!(a>>>0<=c>>>0?a:0)){J[4328]=c}a=0;J[4437]=h;J[4436]=c;J[4332]=-1;J[4333]=J[4442];J[4439]=0;while(1){d=a<<3;b=d+17336|0;J[d+17344>>2]=b;J[d+17348>>2]=b;a=a+1|0;if((a|0)!=32){continue}break}d=h-40|0;a=-8-c&7;b=d-a|0;J[4327]=b;a=a+c|0;J[4330]=a;J[a+4>>2]=b|1;J[(c+d|0)+4>>2]=40;J[4331]=J[4446];break e}if(J[a+12>>2]&8|(c>>>0<=e>>>0|d>>>0>e>>>0)){break f}J[a+4>>2]=b+h;a=-8-e&7;c=a+e|0;J[4330]=c;b=J[4327]+h|0;a=b-a|0;J[4327]=a;J[c+4>>2]=a|1;J[(b+e|0)+4>>2]=40;J[4331]=J[4446];break e}d=0;break b}c=0;break c}if(M[4328]>c>>>0){J[4328]=c}b=c+h|0;a=17744;z:{A:{B:{while(1){if((b|0)!=J[a>>2]){a=J[a+8>>2];if(a){continue}break B}break}if(!(K[a+12|0]&8)){break A}}a=17744;while(1){C:{b=J[a>>2];if(b>>>0<=e>>>0){f=b+J[a+4>>2]|0;if(f>>>0>e>>>0){break C}}a=J[a+8>>2];continue}break}d=h-40|0;a=-8-c&7;b=d-a|0;J[4327]=b;a=a+c|0;J[4330]=a;J[a+4>>2]=b|1;J[(c+d|0)+4>>2]=40;J[4331]=J[4446];a=(f+(39-f&7)|0)-47|0;d=a>>>0<e+16>>>0?e:a;J[d+4>>2]=27;a=J[4439];J[d+16>>2]=J[4438];J[d+20>>2]=a;a=J[4437];J[d+8>>2]=J[4436];J[d+12>>2]=a;J[4438]=d+8;J[4437]=h;J[4436]=c;J[4439]=0;a=d+24|0;while(1){J[a+4>>2]=7;b=a+8|0;a=a+4|0;if(b>>>0<f>>>0){continue}break}if((d|0)==(e|0)){break e}J[d+4>>2]=J[d+4>>2]&-2;f=d-e|0;J[e+4>>2]=f|1;J[d>>2]=f;if(f>>>0<=255){b=(f&-8)+17336|0;c=J[4324];a=1<<(f>>>3);D:{if(!(c&a)){J[4324]=a|c;a=b;break D}a=J[b+8>>2]}J[b+8>>2]=e;J[a+12>>2]=e;J[e+12>>2]=b;J[e+8>>2]=a;break e}a=31;if(f>>>0<=16777215){a=S(f>>>8|0);a=((f>>>38-a&1)-(a<<1)|0)+62|0}J[e+28>>2]=a;J[e+16>>2]=0;J[e+20>>2]=0;d=(a<<2)+17600|0;c=J[4325];b=1<<a;E:{if(!(c&b)){J[4325]=c|b;J[d>>2]=e;J[e+24>>2]=d;break E}a=f<<((a|0)!=31?25-(a>>>1|0)|0:0);d=J[d>>2];while(1){b=d;if((f|0)==(J[b+4>>2]&-8)){break z}c=a>>>29|0;a=a<<1;c=(b+(c&4)|0)+16|0;d=J[c>>2];if(d){continue}break}J[c>>2]=e;J[e+24>>2]=b}J[e+12>>2]=e;J[e+8>>2]=e;break e}J[a>>2]=c;J[a+4>>2]=J[a+4>>2]+h;h=(-8-c&7)+c|0;J[h+4>>2]=g|3;e=b+(-8-b&7)|0;i=g+h|0;g=e-i|0;F:{if(J[4330]==(e|0)){J[4330]=i;a=J[4327]+g|0;J[4327]=a;J[i+4>>2]=a|1;break F}if(J[4329]==(e|0)){J[4329]=i;a=J[4326]+g|0;J[4326]=a;J[i+4>>2]=a|1;J[a+i>>2]=a;break F}c=J[e+4>>2];if((c&3)==1){f=c&-8;G:{if(c>>>0<=255){a=c>>>3|0;c=J[e+12>>2];b=J[e+8>>2];if((c|0)==(b|0)){m=17296,n=J[4324]&yn(a),J[m>>2]=n;break G}J[b+12>>2]=c;J[c+8>>2]=b;break G}j=J[e+24>>2];a=J[e+12>>2];H:{if((e|0)!=(a|0)){b=J[e+8>>2];J[b+12>>2]=a;J[a+8>>2]=b;break H}I:{b=e+20|0;c=J[b>>2];if(!c){c=J[e+16>>2];if(!c){break I}b=e+16|0}while(1){d=b;a=c;b=a+20|0;c=J[b>>2];if(c){continue}b=a+16|0;c=J[a+16>>2];if(c){continue}break}J[d>>2]=0;break H}a=0}if(!j){break G}c=J[e+28>>2];b=(c<<2)+17600|0;J:{if(J[b>>2]==(e|0)){J[b>>2]=a;if(a){break J}m=17300,n=J[4325]&yn(c),J[m>>2]=n;break G}J[j+(J[j+16>>2]==(e|0)?16:20)>>2]=a;if(!a){break G}}J[a+24>>2]=j;b=J[e+16>>2];if(b){J[a+16>>2]=b;J[b+24>>2]=a}b=J[e+20>>2];if(!b){break G}J[a+20>>2]=b;J[b+24>>2]=a}g=f+g|0;e=e+f|0;c=J[e+4>>2]}J[e+4>>2]=c&-2;J[i+4>>2]=g|1;J[g+i>>2]=g;if(g>>>0<=255){b=(g&-8)+17336|0;c=J[4324];a=1<<(g>>>3);K:{if(!(c&a)){J[4324]=a|c;a=b;break K}a=J[b+8>>2]}J[b+8>>2]=i;J[a+12>>2]=i;J[i+12>>2]=b;J[i+8>>2]=a;break F}c=31;if(g>>>0<=16777215){a=S(g>>>8|0);c=((g>>>38-a&1)-(a<<1)|0)+62|0}J[i+28>>2]=c;J[i+16>>2]=0;J[i+20>>2]=0;d=(c<<2)+17600|0;L:{b=J[4325];a=1<<c;M:{if(!(b&a)){J[4325]=a|b;J[d>>2]=i;J[i+24>>2]=d;break M}c=g<<((c|0)!=31?25-(c>>>1|0)|0:0);a=J[d>>2];while(1){b=a;if((J[a+4>>2]&-8)==(g|0)){break L}d=c>>>29|0;c=c<<1;d=(a+(d&4)|0)+16|0;a=J[d>>2];if(a){continue}break}J[d>>2]=i;J[i+24>>2]=b}J[i+12>>2]=i;J[i+8>>2]=i;break F}a=J[b+8>>2];J[a+12>>2]=i;J[b+8>>2]=i;J[i+24>>2]=0;J[i+12>>2]=b;J[i+8>>2]=a}a=h+8|0;break a}a=J[b+8>>2];J[a+12>>2]=e;J[b+8>>2]=e;J[e+24>>2]=0;J[e+12>>2]=b;J[e+8>>2]=a}a=J[4327];if(a>>>0<=g>>>0){break d}b=a-g|0;J[4327]=b;c=J[4330];a=c+g|0;J[4330]=a;J[a+4>>2]=b|1;J[c+4>>2]=g|3;a=c+8|0;break a}J[4322]=48;a=0;break a}N:{if(!h){break N}b=J[d+28>>2];a=(b<<2)+17600|0;O:{if(J[a>>2]==(d|0)){J[a>>2]=c;if(c){break O}j=yn(b)&j;J[4325]=j;break N}J[h+(J[h+16>>2]==(d|0)?16:20)>>2]=c;if(!c){break N}}J[c+24>>2]=h;a=J[d+16>>2];if(a){J[c+16>>2]=a;J[a+24>>2]=c}a=J[d+20>>2];if(!a){break N}J[c+20>>2]=a;J[a+24>>2]=c}P:{if(e>>>0<=15){a=e+g|0;J[d+4>>2]=a|3;a=a+d|0;J[a+4>>2]=J[a+4>>2]|1;break P}J[d+4>>2]=g|3;f=d+g|0;J[f+4>>2]=e|1;J[e+f>>2]=e;if(e>>>0<=255){b=(e&-8)+17336|0;c=J[4324];a=1<<(e>>>3);Q:{if(!(c&a)){J[4324]=a|c;a=b;break Q}a=J[b+8>>2]}J[b+8>>2]=f;J[a+12>>2]=f;J[f+12>>2]=b;J[f+8>>2]=a;break P}a=31;if(e>>>0<=16777215){a=S(e>>>8|0);a=((e>>>38-a&1)-(a<<1)|0)+62|0}J[f+28>>2]=a;J[f+16>>2]=0;J[f+20>>2]=0;c=(a<<2)+17600|0;R:{b=1<<a;S:{if(!(b&j)){J[4325]=b|j;J[c>>2]=f;J[f+24>>2]=c;break S}a=e<<((a|0)!=31?25-(a>>>1|0)|0:0);g=J[c>>2];while(1){b=g;if((J[b+4>>2]&-8)==(e|0)){break R}c=a>>>29|0;a=a<<1;c=(b+(c&4)|0)+16|0;g=J[c>>2];if(g){continue}break}J[c>>2]=f;J[f+24>>2]=b}J[f+12>>2]=f;J[f+8>>2]=f;break P}a=J[b+8>>2];J[a+12>>2]=f;J[b+8>>2]=f;J[f+24>>2]=0;J[f+12>>2]=b;J[f+8>>2]=a}a=d+8|0;break a}T:{if(!i){break T}b=J[c+28>>2];a=(b<<2)+17600|0;U:{if(J[a>>2]==(c|0)){J[a>>2]=d;if(d){break U}m=17300,n=yn(b)&j,J[m>>2]=n;break T}J[i+(J[i+16>>2]==(c|0)?16:20)>>2]=d;if(!d){break T}}J[d+24>>2]=i;a=J[c+16>>2];if(a){J[d+16>>2]=a;J[a+24>>2]=d}a=J[c+20>>2];if(!a){break T}J[d+20>>2]=a;J[a+24>>2]=d}V:{if(e>>>0<=15){a=e+g|0;J[c+4>>2]=a|3;a=a+c|0;J[a+4>>2]=J[a+4>>2]|1;break V}J[c+4>>2]=g|3;d=c+g|0;J[d+4>>2]=e|1;J[d+e>>2]=e;if(k){b=(k&-8)+17336|0;f=J[4329];a=1<<(k>>>3);W:{if(!(a&h)){J[4324]=a|h;a=b;break W}a=J[b+8>>2]}J[b+8>>2]=f;J[a+12>>2]=f;J[f+12>>2]=b;J[f+8>>2]=a}J[4329]=d;J[4326]=e}a=c+8|0}la=l+16|0;return a}function If(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=Q(0),B=0;d=la-144|0;la=d;e=kb(d,0,144);J[e+76>>2]=-1;J[e+44>>2]=a;J[e+32>>2]=96;J[e+84>>2]=a;d=b;u=c;a=0;j=la-304|0;la=j;a:{b:{if(!J[e+4>>2]){Gb(e);if(!J[e+4>>2]){break b}}c=K[d|0];if(!c){break a}x=j+16|0;c:{d:{e:{f:{g:{while(1){h:{i:{if(hf(c&255)){while(1){c=d;d=d+1|0;if(hf(K[c+1|0])){continue}break}jf(e,0,0);while(1){b=J[e+4>>2];j:{if((b|0)!=J[e+104>>2]){J[e+4>>2]=b+1;b=K[b|0];break j}b=kf(e)}if(hf(b)){continue}break}d=J[e+4>>2];b=J[e+116>>2];if((b|0)>0){b=1}else{b=(b|0)>=0}if(b){d=d-1|0;J[e+4>>2]=d}b=d-J[e+44>>2]|0;d=b;h=o+J[e+124>>2]|0;f=b>>31;b=l+J[e+120>>2]|0;h=f+(b>>>0<l>>>0?h+1|0:h)|0;l=b+d|0;o=l>>>0<b>>>0?h+1|0:h;break i}k:{l:{m:{if(K[d|0]==37){b=K[d+1|0];if((b|0)==42){break m}if((b|0)!=37){break l}}jf(e,0,0);n:{if(K[d|0]==37){while(1){b=J[e+4>>2];o:{if((b|0)!=J[e+104>>2]){J[e+4>>2]=b+1;c=K[b|0];break o}c=kf(e)}if(hf(c)){continue}break}d=d+1|0;break n}b=J[e+4>>2];if((b|0)!=J[e+104>>2]){J[e+4>>2]=b+1;c=K[b|0];break n}c=kf(e)}if(K[d|0]!=(c|0)){a=J[e+116>>2];if((a|0)>0){a=1}else{a=(a|0)>=0}if(a){J[e+4>>2]=J[e+4>>2]-1}if(t|(c|0)>=0){break a}break b}b=J[e+4>>2]-J[e+44>>2]|0;f=b;g=b>>31;b=o+J[e+124>>2]|0;c=l+J[e+120>>2]|0;i=(c>>>0<l>>>0?b+1|0:b)+g|0;l=c+f|0;o=l>>>0<c>>>0?i+1|0:i;c=d;break i}k=0;c=d+2|0;break k}if(!(!lf(b)|K[d+2|0]!=36)){b=K[d+1|0]-48|0;c=la-16|0;J[c+12>>2]=u;b=b>>>0>1?((b<<2)+u|0)-4|0:u;J[c+8>>2]=b+4;k=J[b>>2];c=d+3|0;break k}k=J[u>>2];u=u+4|0;c=d+1|0}r=0;d=0;if(lf(K[c|0])){while(1){d=(K[c|0]+P(d,10)|0)-48|0;b=K[c+1|0];c=c+1|0;if(lf(b)){continue}break}}i=K[c|0];if((i|0)!=109){b=c}else{n=0;r=(k|0)!=0;i=K[c+1|0];a=0;b=c+1|0}c=b+1|0;f=3;g=r;p:{q:{switch((i&255)-65|0){case 39:f=b+2|0;b=K[b+1|0]==104;c=b?f:c;f=b?-2:-1;break p;case 43:f=b+2|0;b=K[b+1|0]==108;c=b?f:c;f=b?3:1;break p;case 51:case 57:f=1;break p;case 11:f=2;break p;case 41:break p;case 0:case 2:case 4:case 5:case 6:case 18:case 23:case 26:case 32:case 34:case 35:case 36:case 37:case 38:case 40:case 45:case 46:case 47:case 50:case 52:case 55:break q;default:break d}}f=0;c=b}g=f;b=K[c|0];f=(b&47)==3;v=f?1:g;p=f?b|32:b;r:{if((p|0)==91){break r}s:{if((p|0)!=110){if((p|0)!=99){break s}d=(d|0)<=1?1:d;break r}Gf(k,v,l,o);break i}jf(e,0,0);while(1){b=J[e+4>>2];t:{if((b|0)!=J[e+104>>2]){J[e+4>>2]=b+1;b=K[b|0];break t}b=kf(e)}if(hf(b)){continue}break}b=J[e+4>>2];f=J[e+116>>2];if((f|0)>0){f=1}else{f=(f|0)>=0}if(f){b=b-1|0;J[e+4>>2]=b}b=b-J[e+44>>2]|0;f=b;h=o+J[e+124>>2]|0;g=b>>31;b=l+J[e+120>>2]|0;o=g+(b>>>0<l>>>0?h+1|0:h)|0;l=b+f|0;o=l>>>0<b>>>0?o+1|0:o}i=d;q=d>>31;jf(e,d,q);b=J[e+4>>2];u:{if((b|0)!=J[e+104>>2]){J[e+4>>2]=b+1;break u}if((kf(e)|0)<0){break e}}b=J[e+116>>2];if((b|0)>0){b=1}else{b=(b|0)>=0}if(b){J[e+4>>2]=J[e+4>>2]-1}b=16;v:{w:{x:{y:{z:{switch(p-88|0){default:b=p-65|0;if(b>>>0>6|!(1<<b&113)){break v}case 9:case 13:case 14:case 15:Cf(j+8|0,e,v,0);b=J[e+4>>2]-J[e+44>>2]|0;if(J[e+120>>2]!=(0-b|0)|J[e+124>>2]!=(0-((b>>31)+((b|0)!=0)|0)|0)){break x}break f;case 3:case 11:case 27:if((p|16)==115){kb(j+32|0,-1,257);H[j+32|0]=0;if((p|0)!=115){break w}H[j+65|0]=0;H[j+46|0]=0;I[j+42>>1]=0;I[j+44>>1]=0;break w}f=K[c+1|0];g=(f|0)==94;kb(j+32|0,g,257);H[j+32|0]=0;b=g?c+2|0:c+1|0;A:{B:{C:{c=K[(g?2:1)+c|0];if((c|0)!=45){if((c|0)==93){break C}f=(f|0)!=94;break A}f=(f|0)!=94;H[j+78|0]=f;break B}f=(f|0)!=94;H[j+126|0]=f}b=b+1|0}c=b;while(1){b=K[c|0];D:{if((b|0)!=45){if(!b){break e}if((b|0)==93){break w}break D}b=45;g=K[c+1|0];if(!g|(g|0)==93){break D}h=c+1|0;c=K[c-1|0];E:{if(g>>>0<=c>>>0){b=g;break E}while(1){c=c+1|0;H[c+(j+32|0)|0]=f;b=K[h|0];if(c>>>0<b>>>0){continue}break}}c=h}H[(b+j|0)+33|0]=f;c=c+1|0;continue};case 23:b=8;break y;case 12:case 29:b=10;break y;case 1:case 2:case 4:case 5:case 6:case 7:case 8:case 10:case 16:case 18:case 19:case 20:case 21:case 22:case 25:case 26:case 28:case 30:case 31:break v;case 0:case 24:case 32:break y;case 17:break z}}b=0}h=0;f=0;g=0;i=0;q=0;w=la-16|0;la=w;F:{if(!((b|0)!=1&b>>>0<=36)){J[4322]=28;break F}while(1){d=J[e+4>>2];G:{if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break G}d=kf(e)}if(hf(d)){continue}break}H:{I:{switch(d-43|0){case 0:case 2:break I;default:break H}}q=(d|0)==45?-1:0;d=J[e+4>>2];if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break H}d=kf(e)}J:{K:{L:{M:{if(!((b|0)!=0&(b|0)!=16|(d|0)!=48)){d=J[e+4>>2];N:{if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break N}d=kf(e)}if((d&-33)==88){b=16;d=J[e+4>>2];O:{if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break O}d=kf(e)}if(K[d+5121|0]<16){break L}b=J[e+116>>2];if((b|0)>0){b=1}else{b=(b|0)>=0}if(b){J[e+4>>2]=J[e+4>>2]-1}jf(e,0,0);break F}if(b){break M}b=8;break L}b=b?b:10;if(b>>>0>K[d+5121|0]){break M}b=J[e+116>>2];if((b|0)>0){b=1}else{b=(b|0)>=0}if(b){J[e+4>>2]=J[e+4>>2]-1}jf(e,0,0);J[4322]=28;break F}if((b|0)!=10){break L}f=d-48|0;if(f>>>0<=9){d=0;while(1){d=P(d,10)+f|0;g=d>>>0<429496729;b=J[e+4>>2];P:{if((b|0)!=J[e+104>>2]){J[e+4>>2]=b+1;b=K[b|0];break P}b=kf(e)}f=b-48|0;if(g&f>>>0<=9){continue}break}g=d}if(f>>>0>9){break J}b=wn(g,0,10,0);i=ma;while(1){h=i;g=b+f|0;h=g>>>0<b>>>0?h+1|0:h;b=(h|0)==429496729&g>>>0<2576980378|h>>>0<429496729;d=J[e+4>>2];Q:{if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break Q}d=kf(e)}m=d-48|0;if(!(b&m>>>0<=9)){b=10;if(m>>>0<=9){break K}break J}b=wn(g,h,10,0);i=ma;f=m;if((i|0)==-1&(f^-1)>>>0>=b>>>0|(i|0)!=-1){continue}break}b=10;break K}if(b-1&b){i=K[d+5121|0];if(i>>>0<b>>>0){while(1){f=P(b,f)+i|0;g=f>>>0<119304647;d=J[e+4>>2];R:{if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break R}d=kf(e)}i=K[d+5121|0];if(g&i>>>0<b>>>0){continue}break}g=f}if(b>>>0<=i>>>0){break K}while(1){f=wn(g,h,b,0);m=ma;i=i&255;if((m|0)==-1&(i^-1)>>>0<f>>>0){break K}h=m;g=f+i|0;h=g>>>0<i>>>0?h+1|0:h;d=J[e+4>>2];S:{if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break S}d=kf(e)}i=K[d+5121|0];if(b>>>0<=i>>>0){break K}zf(w,b,0,0,0,g,h,0,0);if(!(J[w+8>>2]|J[w+12>>2])){continue}break}break K}m=H[(P(b,23)>>>5&7)+5377|0];f=K[d+5121|0];if(f>>>0<b>>>0){while(1){i=i<<m|f;g=i>>>0<134217728;d=J[e+4>>2];T:{if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break T}d=kf(e)}f=K[d+5121|0];if(g&f>>>0<b>>>0){continue}break}g=i}if(b>>>0<=f>>>0){break K}s=m&31;if((m&63)>>>0>=32){i=0;s=-1>>>s|0}else{i=-1>>>s|0;s=i|(1<<s)-1<<32-s}if(!i&g>>>0>s>>>0){break K}while(1){y=f&255;f=g;d=m&31;if((m&63)>>>0>=32){h=f<<d;d=0}else{h=(1<<d)-1&f>>>32-d|h<<d;d=f<<d}g=y|d;d=J[e+4>>2];U:{if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break U}d=kf(e)}f=K[d+5121|0];if(b>>>0<=f>>>0){break K}if((h|0)==(i|0)&g>>>0<=s>>>0|h>>>0<i>>>0){continue}break}}if(K[d+5121|0]>=b>>>0){break J}while(1){d=J[e+4>>2];V:{if((d|0)!=J[e+104>>2]){J[e+4>>2]=d+1;d=K[d|0];break V}d=kf(e)}if(K[d+5121|0]<b>>>0){continue}break}J[4322]=68;q=0;g=-1;h=-1}b=J[e+116>>2];if((b|0)>0){b=1}else{b=(b|0)>=0}if(b){J[e+4>>2]=J[e+4>>2]-1}W:{if((g&h)!=-1){break W}}b=g^q;f=b-q|0;d=q>>31;g=(d^h)-((b>>>0<q>>>0)+d|0)|0}la=w+16|0;b=J[e+4>>2]-J[e+44>>2]|0;if(J[e+120>>2]==(0-b|0)&J[e+124>>2]==(0-((b>>31)+((b|0)!=0)|0)|0)){break f}if(!(!k|(p|0)!=112)){J[k>>2]=f;break v}Gf(k,v,f,g);break v}if(!k){break v}b=J[x>>2];f=J[x+4>>2];d=J[j+8>>2];g=J[j+12>>2];X:{switch(v|0){case 0:z=k,A=Ef(d,g,b,f),N[z>>2]=A;break v;case 1:z=k,B=Ff(d,g,b,f),O[z>>3]=B;break v;case 2:break X;default:break v}}J[k>>2]=d;J[k+4>>2]=g;J[k+8>>2]=b;J[k+12>>2]=f;break v}m=(p|0)!=99;f=m?31:d+1|0;Y:{if((v|0)==1){b=k;if(r){b=sb(f<<2);if(!b){break g}}J[j+296>>2]=0;J[j+300>>2]=0;d=0;while(1){a=b;Z:{while(1){b=J[e+4>>2];_:{if((b|0)!=J[e+104>>2]){J[e+4>>2]=b+1;b=K[b|0];break _}b=kf(e)}if(!K[(b+j|0)+33|0]){break Z}H[j+27|0]=b;b=we(j+28|0,j+27|0,1,j+296|0);if((b|0)==-2){continue}if((b|0)==-1){n=0;break e}if(a){J[(d<<2)+a>>2]=J[j+28>>2];d=d+1|0}if(!r|(d|0)!=(f|0)){continue}break}g=1;n=0;f=f<<1|1;b=ub(a,f<<2);if(b){continue}break d}break}n=0;f=a;b=j+296|0;if(b){b=J[b>>2]}else{b=0}if(b){break e}break Y}if(r){d=0;b=sb(f);if(!b){break g}while(1){a=b;while(1){b=J[e+4>>2];$:{if((b|0)!=J[e+104>>2]){J[e+4>>2]=b+1;b=K[b|0];break $}b=kf(e)}if(!K[(b+j|0)+33|0]){f=0;n=a;break Y}H[a+d|0]=b;d=d+1|0;if((f|0)!=(d|0)){continue}break}g=1;f=f<<1|1;b=ub(a,f);if(b){continue}break}n=a;a=0;break d}d=0;if(k){while(1){a=J[e+4>>2];aa:{if((a|0)!=J[e+104>>2]){J[e+4>>2]=a+1;a=K[a|0];break aa}a=kf(e)}if(K[(a+j|0)+33|0]){H[d+k|0]=a;d=d+1|0;continue}else{f=0;a=k;n=a;break Y}}}while(1){a=J[e+4>>2];ba:{if((a|0)!=J[e+104>>2]){J[e+4>>2]=a+1;a=K[a|0];break ba}a=kf(e)}if(K[(a+j|0)+33|0]){continue}break}a=0;n=0;f=0}b=J[e+4>>2];g=J[e+116>>2];if((g|0)>0){g=1}else{g=(g|0)>=0}if(g){b=b-1|0;J[e+4>>2]=b}g=b-J[e+44>>2]|0;b=g+J[e+120>>2]|0;h=J[e+124>>2]+(g>>31)|0;h=b>>>0<g>>>0?h+1|0:h;if(!(h|b)|!(m|(b|0)==(i|0)&(h|0)==(q|0))){break h}if(r){J[k>>2]=a}ca:{if((p|0)==99){break ca}if(f){J[(d<<2)+f>>2]=0}if(!n){n=0;break ca}H[d+n|0]=0}a=f}b=J[e+4>>2]-J[e+44>>2]|0;f=b;g=b>>31;b=o+J[e+124>>2]|0;d=l+J[e+120>>2]|0;h=(d>>>0<l>>>0?b+1|0:b)+g|0;l=d+f|0;o=l>>>0<d>>>0?h+1|0:h;t=((k|0)!=0)+t|0}d=c+1|0;c=K[c+1|0];if(c){continue}break a}break}a=f;break f}g=1;n=0;a=0;break d}g=r;break c}g=r}t=t?t:-1}if(!g){break a}tb(n);tb(a);break a}t=-1}la=j+304|0;la=e+144|0;return t}function ya(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;J[a+80>>2]=0;J[a+84>>2]=0;H[a+63|0]=0;H[a+64|0]=0;H[a+51|0]=0;J[a+28>>2]=0;J[a+32>>2]=0;H[a+23|0]=0;H[a+24|0]=0;J[a+12>>2]=0;H[a+11|0]=0;J[a>>2]=0;J[a+76>>2]=0;J[a+68>>2]=0;J[a+72>>2]=0;J[a+52>>2]=0;J[a+36>>2]=0;J[a+40>>2]=0;J[a+88>>2]=0;J[a+92>>2]=0;J[a+96>>2]=0;J[a+100>>2]=0;J[a+104>>2]=6;J[a+108>>2]=0;J[a+112>>2]=16843009;H[a+116|0]=1;H[a+117|0]=0;h=a+80|0;za(h);H[a+139|0]=0;H[a+140|0]=0;H[a+141|0]=0;H[a+142|0]=0;H[a+143|0]=0;H[a+144|0]=0;H[a+145|0]=0;H[a+146|0]=0;H[a+128|0]=0;H[a+124|0]=0;J[a+120>>2]=0;H[a+144|0]=0;H[a+145|0]=0;H[a+146|0]=0;H[a+147|0]=0;H[a+148|0]=0;H[a+149|0]=0;H[a+150|0]=0;H[a+151|0]=0;d=la+-64|0;la=d;J[d+40>>2]=0;J[d+44>>2]=0;J[d+32>>2]=0;J[d+36>>2]=0;J[d+24>>2]=0;J[d+28>>2]=0;J[d+48>>2]=6;J[d+52>>2]=0;I[d+60>>1]=K[b+4|0]|K[b+5|0]<<8;J[d+56>>2]=K[b|0]|K[b+1|0]<<8|(K[b+2|0]<<16|K[b+3|0]<<24);za(d+24|0);c=J[a+80>>2];if(c){b=c;e=J[a+84>>2];if((b|0)!=(e|0)){while(1){b=e-20|0;if(H[e-9|0]<0){tb(J[b>>2])}e=b;if((b|0)!=(c|0)){continue}break}b=J[h>>2]}J[a+84>>2]=c;tb(b)}c=d+48|0;J[a+80>>2]=J[d+24>>2];J[a+84>>2]=J[d+28>>2];J[a+88>>2]=J[d+32>>2];J[d+32>>2]=0;J[d+24>>2]=0;J[d+28>>2]=0;f=J[a+92>>2];if(f){b=f;e=J[a+96>>2];if((b|0)!=(e|0)){while(1){b=e-20|0;if(H[e-9|0]<0){tb(J[b>>2])}e=b;if((b|0)!=(f|0)){continue}break}b=J[a+92>>2]}J[a+96>>2]=f;tb(b);g=J[d+24>>2]}J[a+92>>2]=J[d+36>>2];J[a+96>>2]=J[d+40>>2];b=d+44|0;J[a+100>>2]=J[b>>2];J[b>>2]=0;J[d+36>>2]=0;J[d+40>>2]=0;e=L[c+10>>1]|L[c+12>>1]<<16;b=L[c+6>>1]|L[c+8>>1]<<16;I[a+110>>1]=b;I[a+112>>1]=b>>>16;I[a+114>>1]=e;I[a+116>>1]=e>>>16;b=J[c+4>>2];J[a+104>>2]=J[c>>2];J[a+108>>2]=b;if(g){b=g;e=J[d+28>>2];if((b|0)!=(e|0)){while(1){b=e-20|0;if(H[e-9|0]<0){tb(J[b>>2])}e=b;if((b|0)!=(g|0)){continue}break}b=J[d+24>>2]}J[d+28>>2]=g;tb(b)}g=om(16);H[g+12|0]=0;b=K[1393]|K[1394]<<8|(K[1395]<<16|K[1396]<<24);H[g+8|0]=b;H[g+9|0]=b>>>8;H[g+10|0]=b>>>16;H[g+11|0]=b>>>24;e=K[1389]|K[1390]<<8|(K[1391]<<16|K[1392]<<24);b=K[1385]|K[1386]<<8|(K[1387]<<16|K[1388]<<24);H[g|0]=b;H[g+1|0]=b>>>8;H[g+2|0]=b>>>16;H[g+3|0]=b>>>24;H[g+4|0]=e;H[g+5|0]=e>>>8;H[g+6|0]=e>>>16;H[g+7|0]=e>>>24;f=om(16);H[f+12|0]=0;b=K[2124]|K[2125]<<8|(K[2126]<<16|K[2127]<<24);H[f+8|0]=b;H[f+9|0]=b>>>8;H[f+10|0]=b>>>16;H[f+11|0]=b>>>24;e=K[2120]|K[2121]<<8|(K[2122]<<16|K[2123]<<24);b=K[2116]|K[2117]<<8|(K[2118]<<16|K[2119]<<24);H[f|0]=b;H[f+1|0]=b>>>8;H[f+2|0]=b>>>16;H[f+3|0]=b>>>24;H[f+4|0]=e;H[f+5|0]=e>>>8;H[f+6|0]=e>>>16;H[f+7|0]=e>>>24;vm(d+24|0,g,12);b=d+36|0;vm(b,f,12);J[d+60>>2]=0;J[d+52>>2]=0;J[d+56>>2]=0;H[d+48|0]=1;if(H[a+11|0]<0){tb(J[a>>2])}e=J[d+28>>2];J[a>>2]=J[d+24>>2];J[a+4>>2]=e;J[a+8>>2]=J[d+32>>2];H[d+35|0]=0;H[d+24|0]=0;c=a+12|0;if(H[a+23|0]<0){tb(J[c>>2])}e=J[b+4>>2];J[c>>2]=J[b>>2];J[c+4>>2]=e;J[c+8>>2]=J[b+8>>2];H[d+36|0]=0;H[d+47|0]=0;H[a+24|0]=K[d+48|0];i=a+28|0;b=0;c=J[a+28>>2];if(c){b=c;e=J[a+32>>2];if((b|0)!=(e|0)){while(1){b=e-20|0;if(H[e-9|0]<0){tb(J[b>>2])}e=b;if((b|0)!=(c|0)){continue}break}b=J[i>>2]}J[a+32>>2]=c;tb(b);b=K[d+47|0]}J[a+28>>2]=J[d+52>>2];J[a+32>>2]=J[d+56>>2];J[a+36>>2]=J[d+60>>2];J[d+60>>2]=0;J[d+52>>2]=0;J[d+56>>2]=0;if(b<<24>>24<0){tb(J[d+36>>2])}if(H[d+35|0]<0){tb(J[d+24>>2])}tb(f);tb(g);c=om(16);H[c+14|0]=0;e=K[2176]|K[2177]<<8|(K[2178]<<16|K[2179]<<24);b=K[2172]|K[2173]<<8|(K[2174]<<16|K[2175]<<24);H[c+6|0]=b;H[c+7|0]=b>>>8;H[c+8|0]=b>>>16;H[c+9|0]=b>>>24;H[c+10|0]=e;H[c+11|0]=e>>>8;H[c+12|0]=e>>>16;H[c+13|0]=e>>>24;e=K[2170]|K[2171]<<8|(K[2172]<<16|K[2173]<<24);b=K[2166]|K[2167]<<8|(K[2168]<<16|K[2169]<<24);H[c|0]=b;H[c+1|0]=b>>>8;H[c+2|0]=b>>>16;H[c+3|0]=b>>>24;H[c+4|0]=e;H[c+5|0]=e>>>8;H[c+6|0]=e>>>16;H[c+7|0]=e>>>24;J[d+24>>2]=2036427888;J[d+28>>2]=1650422373;J[d+32>>2]=167801967;b=d+36|0;vm(b,c,14);J[d+60>>2]=0;J[d+52>>2]=0;J[d+56>>2]=0;H[d+48|0]=0;f=a+40|0;if(H[a+51|0]<0){tb(J[f>>2])}e=J[d+28>>2];J[f>>2]=J[d+24>>2];J[f+4>>2]=e;J[f+8>>2]=J[d+32>>2];H[d+35|0]=0;H[d+24|0]=0;f=a+52|0;if(H[a+63|0]<0){tb(J[f>>2])}e=J[b+4>>2];J[f>>2]=J[b>>2];J[f+4>>2]=e;J[f+8>>2]=J[b+8>>2];H[d+36|0]=0;H[d+47|0]=0;H[a- -64|0]=K[d+48|0];b=0;g=a+68|0;f=J[g>>2];if(f){b=f;e=J[a+72>>2];if((b|0)!=(e|0)){while(1){b=e-20|0;if(H[e-9|0]<0){tb(J[b>>2])}e=b;if((b|0)!=(f|0)){continue}break}b=J[g>>2]}J[a+72>>2]=f;tb(b);b=H[d+47|0]<0}J[a+68>>2]=J[d+52>>2];J[a+72>>2]=J[d+56>>2];J[a+76>>2]=J[d+60>>2];J[d+60>>2]=0;J[d+52>>2]=0;J[d+56>>2]=0;if(b){tb(J[d+36>>2])}if(H[d+35|0]<0){tb(J[d+24>>2])}tb(c);b=H[a+139|0];H[a+124|0]=0;J[a+120>>2]=0;a:{if((b|0)<0){J[a+132>>2]=0;b=J[a+128>>2];break a}H[a+139|0]=0;b=a+128|0}H[b|0]=0;e=J[a+144>>2];c=J[a+140>>2];if((e|0)!=(c|0)){while(1){b=e-12|0;if(H[e-1|0]<0){tb(J[b>>2])}e=b;if((b|0)!=(c|0)){continue}break}}J[a+144>>2]=c;e=0;while(1){Ca(d+24|0,h);c=K[d+35|0];f=c<<24>>24<0;b=J[d+28>>2];b:{if(!(f?b:c)){break b}c=J[a+32>>2];if((c|0)!=J[a+36>>2]){c:{if(!f){b=J[d+28>>2];J[c>>2]=J[d+24>>2];J[c+4>>2]=b;J[c+8>>2]=J[d+32>>2];break c}vm(c,J[d+24>>2],b)}b=J[d+40>>2];J[c+12>>2]=J[d+36>>2];J[c+16>>2]=b;J[a+32>>2]=c+20;break b}Da(i,d+24|0)}if(H[d+35|0]<0){tb(J[d+24>>2])}Ca(d+24|0,h);c=K[d+35|0];f=c<<24>>24<0;b=J[d+28>>2];d:{if(!(f?b:c)){break d}c=J[a+72>>2];if((c|0)!=J[a+76>>2]){e:{if(!f){b=J[d+28>>2];J[c>>2]=J[d+24>>2];J[c+4>>2]=b;J[c+8>>2]=J[d+32>>2];break e}vm(c,J[d+24>>2],b)}b=J[d+40>>2];J[c+12>>2]=J[d+36>>2];J[c+16>>2]=b;J[a+72>>2]=c+20;break d}Da(g,d+24|0)}if(H[d+35|0]<0){tb(J[d+24>>2])}e=e+1|0;if((e|0)!=6){continue}break}b=om(48);J[d+24>>2]=b;J[d+28>>2]=33;J[d+32>>2]=-2147483600;H[b+32|0]=K[2111];c=K[2107]|K[2108]<<8|(K[2109]<<16|K[2110]<<24);e=K[2103]|K[2104]<<8|(K[2105]<<16|K[2106]<<24);H[b+24|0]=e;H[b+25|0]=e>>>8;H[b+26|0]=e>>>16;H[b+27|0]=e>>>24;H[b+28|0]=c;H[b+29|0]=c>>>8;H[b+30|0]=c>>>16;H[b+31|0]=c>>>24;c=K[2099]|K[2100]<<8|(K[2101]<<16|K[2102]<<24);e=K[2095]|K[2096]<<8|(K[2097]<<16|K[2098]<<24);H[b+16|0]=e;H[b+17|0]=e>>>8;H[b+18|0]=e>>>16;H[b+19|0]=e>>>24;H[b+20|0]=c;H[b+21|0]=c>>>8;H[b+22|0]=c>>>16;H[b+23|0]=c>>>24;c=K[2091]|K[2092]<<8|(K[2093]<<16|K[2094]<<24);e=K[2087]|K[2088]<<8|(K[2089]<<16|K[2090]<<24);H[b+8|0]=e;H[b+9|0]=e>>>8;H[b+10|0]=e>>>16;H[b+11|0]=e>>>24;H[b+12|0]=c;H[b+13|0]=c>>>8;H[b+14|0]=c>>>16;H[b+15|0]=c>>>24;c=K[2083]|K[2084]<<8|(K[2085]<<16|K[2086]<<24);e=K[2079]|K[2080]<<8|(K[2081]<<16|K[2082]<<24);H[b|0]=e;H[b+1|0]=e>>>8;H[b+2|0]=e>>>16;H[b+3|0]=e>>>24;H[b+4|0]=c;H[b+5|0]=c>>>8;H[b+6|0]=c>>>16;H[b+7|0]=c>>>24;H[b+33|0]=0;Ea(a,d+24|0);if(H[d+35|0]<0){tb(J[d+24>>2])}c=om(48);J[d+24>>2]=c;J[d+28>>2]=35;J[d+32>>2]=-2147483600;b=K[1960]|K[1961]<<8|(K[1962]<<16|K[1963]<<24);H[c+31|0]=b;H[c+32|0]=b>>>8;H[c+33|0]=b>>>16;H[c+34|0]=b>>>24;e=K[1957]|K[1958]<<8|(K[1959]<<16|K[1960]<<24);b=K[1953]|K[1954]<<8|(K[1955]<<16|K[1956]<<24);H[c+24|0]=b;H[c+25|0]=b>>>8;H[c+26|0]=b>>>16;H[c+27|0]=b>>>24;H[c+28|0]=e;H[c+29|0]=e>>>8;H[c+30|0]=e>>>16;H[c+31|0]=e>>>24;e=K[1949]|K[1950]<<8|(K[1951]<<16|K[1952]<<24);b=K[1945]|K[1946]<<8|(K[1947]<<16|K[1948]<<24);H[c+16|0]=b;H[c+17|0]=b>>>8;H[c+18|0]=b>>>16;H[c+19|0]=b>>>24;H[c+20|0]=e;H[c+21|0]=e>>>8;H[c+22|0]=e>>>16;H[c+23|0]=e>>>24;e=K[1941]|K[1942]<<8|(K[1943]<<16|K[1944]<<24);b=K[1937]|K[1938]<<8|(K[1939]<<16|K[1940]<<24);H[c+8|0]=b;H[c+9|0]=b>>>8;H[c+10|0]=b>>>16;H[c+11|0]=b>>>24;H[c+12|0]=e;H[c+13|0]=e>>>8;H[c+14|0]=e>>>16;H[c+15|0]=e>>>24;e=K[1933]|K[1934]<<8|(K[1935]<<16|K[1936]<<24);b=K[1929]|K[1930]<<8|(K[1931]<<16|K[1932]<<24);H[c|0]=b;H[c+1|0]=b>>>8;H[c+2|0]=b>>>16;H[c+3|0]=b>>>24;H[c+4|0]=e;H[c+5|0]=e>>>8;H[c+6|0]=e>>>16;H[c+7|0]=e>>>24;H[c+35|0]=0;Ea(a,d+24|0);if(H[d+35|0]<0){tb(J[d+24>>2])}b=J[a+96>>2];f:{if((b|0)==J[a+92>>2]){break f}e=d+12|0;Fa(e,b-20|0);b=zm(e,2817);c=b+8|0;J[d+32>>2]=J[c>>2];e=J[b+4>>2];J[d+24>>2]=J[b>>2];J[d+28>>2]=e;J[b>>2]=0;J[b+4>>2]=0;J[c>>2]=0;Ea(a,d+24|0);if(H[d+35|0]<0){tb(J[d+24>>2])}if(H[d+23|0]>=0){break f}tb(J[d+12>>2])}la=d- -64|0;return a}function Af(a,b,c,d,e,f,g,h,i){var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,K=0,L=0,N=0,O=0,P=0,Q=0;k=la-336|0;la=k;m=h;n=i&65535;o=d;p=e&65535;t=(e^i)&-2147483648;q=i>>>16&32767;u=e>>>16&32767;a:{b:{if(q-32767>>>0>4294934529&u-32767>>>0>=4294934530){break b}j=e&2147483647;if(!(!d&(j|0)==2147418112?!(b|c):j>>>0<2147418112)){r=d;t=e|32768;break a}e=i&2147483647;if(!(!h&(e|0)==2147418112?!(f|g):e>>>0<2147418112)){r=h;t=i|32768;b=f;c=g;break a}if(!(b|d|(j^2147418112|c))){if(!(f|h|(e^2147418112|g))){b=0;c=0;t=2147450880;break a}t=t|2147418112;b=0;c=0;break a}if(!(f|h|(e^2147418112|g))){b=0;c=0;break a}if(!(b|d|(c|j))){b=!(f|h|(e|g));r=b?0:r;t=b?2147450880:t;b=0;c=0;break a}if(!(f|h|(e|g))){t=t|2147418112;b=0;c=0;break a}if((j|0)==65535|j>>>0<65535){d=!(p|o);i=d;j=d?b:o;d=d<<6;i=S(i?c:p);d=d+((i|0)==32?S(j)+32|0:i)|0;mf(k+320|0,b,c,o,p,d-15|0);s=16-d|0;o=J[k+328>>2];p=J[k+332>>2];c=J[k+324>>2];b=J[k+320>>2]}if(e>>>0>65535){break b}d=!(m|n);h=d;i=d?f:m;d=d<<6;h=S(h?g:n);d=d+((h|0)==32?S(i)+32|0:h)|0;mf(k+304|0,f,g,m,n,d-15|0);s=(d+s|0)-16|0;m=J[k+312>>2];n=J[k+316>>2];f=J[k+304>>2];g=J[k+308>>2]}e=n|65536;y=e;z=m;d=m;j=e<<15|d>>>17;e=d<<15|g>>>17;d=e;i=0-d|0;h=j;j=1963258675-(j+((d|0)!=0)|0)|0;zf(k+288|0,d,h,0,0,i,j,0,0);d=J[k+296>>2];zf(k+272|0,0-d|0,0-(J[k+300>>2]+((d|0)!=0)|0)|0,0,0,i,j,0,0);d=J[k+280>>2];i=d<<1|J[k+276>>2]>>>31;d=J[k+284>>2]<<1|d>>>31;zf(k+256|0,i,d,0,0,e,h,0,0);j=J[k+264>>2];zf(k+240|0,i,d,0,0,0-j|0,0-(J[k+268>>2]+((j|0)!=0)|0)|0,0,0);i=J[k+248>>2];j=i<<1|J[k+244>>2]>>>31;d=J[k+252>>2]<<1|i>>>31;zf(k+224|0,j,d,0,0,e,h,0,0);i=J[k+232>>2];zf(k+208|0,j,d,0,0,0-i|0,0-(J[k+236>>2]+((i|0)!=0)|0)|0,0,0);d=J[k+216>>2];i=d<<1|J[k+212>>2]>>>31;d=J[k+220>>2]<<1|d>>>31;zf(k+192|0,i,d,0,0,e,h,0,0);j=J[k+200>>2];zf(k+176|0,i,d,0,0,0-j|0,0-(J[k+204>>2]+((j|0)!=0)|0)|0,0,0);i=e;e=J[k+184>>2];d=h;m=e<<1|J[k+180>>2]>>>31;h=m-1|0;e=(J[k+188>>2]<<1|e>>>31)-!m|0;zf(k+160|0,i,d,0,0,h,e,0,0);d=h;zf(k+144|0,f<<15,g<<15|f>>>17,0,0,d,e,0,0);w=k+112|0;h=J[k+172>>2];m=J[k+160>>2];i=J[k+152>>2];l=m+i|0;n=J[k+164>>2];j=n+J[k+156>>2]|0;j=i>>>0>l>>>0?j+1|0:j;i=j;j=(n|0)==(j|0)&l>>>0<m>>>0|j>>>0<n>>>0;n=j+J[k+168>>2]|0;j=j>>>0>n>>>0?h+1|0:h;m=!i&l>>>0>1|(i|0)!=0;h=m+n|0;j=m>>>0>h>>>0?j+1|0:j;zf(w,d,e,0,0,0-h|0,0-(((h|0)!=0)+j|0)|0,0,0);zf(k+128|0,1-l|0,0-((l>>>0>1)+i|0)|0,0,0,d,e,0,0);I=(u-q|0)+s|0;e=J[k+116>>2];u=e;d=J[k+112>>2];j=e<<1|d>>>31;i=d<<1;m=j;d=j;h=J[k+140>>2];x=h;e=J[k+136>>2];j=h<<1|e>>>31;l=e<<1|J[k+132>>2]>>>31;h=l+i|0;d=d+j|0;d=h>>>0<l>>>0?d+1|0:d;e=d;d=d-(h>>>0<13927)|0;v=d;w=d;l=0;j=p|65536;K=j;L=o;d=o;j=j<<1|d>>>31;O=d<<1;P=j;D=j;d=wn(v,l,j,0);j=ma;A=d;B=j;F=b<<1;d=c<<1|b>>>31;s=d;j=0;q=j;n=h-13927|0;v=(e|0)==(v|0)&n>>>0<h>>>0|e>>>0>v>>>0;e=(e|0)==(m|0)&h>>>0<i>>>0|e>>>0<m>>>0;d=J[k+120>>2];h=J[k+124>>2]<<1|d>>>31;d=d<<1|u>>>31;l=x>>>31|0;d=l+d|0;j=h;j=d>>>0<l>>>0?j+1|0:j;h=d;d=d+e|0;j=h>>>0>d>>>0?j+1|0:j;e=d;d=d+v|0;l=e>>>0>d>>>0?j+1|0:j;e=d-1|0;C=l-!d|0;x=0;i=wn(s,q,C,x);d=i+A|0;h=ma+B|0;h=d>>>0<i>>>0?h+1|0:h;i=d;u=(h|0)==(B|0)&d>>>0<A>>>0|h>>>0<B>>>0;j=0;A=e;N=c>>>31|0;E=N|o<<1;v=0;e=wn(e,j,E,v);d=e+d|0;j=ma+h|0;o=d;l=0;j=d>>>0<e>>>0?j+1|0:j;m=j;d=(h|0)==(j|0)&d>>>0<i>>>0|h>>>0>j>>>0;e=d;d=d+u|0;l=e>>>0>d>>>0?1:l;e=wn(D,q,C,x);d=e+d|0;j=ma+l|0;p=d;d=d>>>0<e>>>0?j+1|0:j;e=wn(D,q,A,v);l=ma;h=e;e=wn(E,v,C,x);i=h+e|0;j=ma+l|0;j=e>>>0>i>>>0?j+1|0:j;e=j;j=(l|0)==(j|0)&h>>>0>i>>>0|j>>>0<l>>>0;l=p+e|0;d=d+j|0;d=l>>>0<e>>>0?d+1|0:d;p=l;e=0;l=e+o|0;j=i+m|0;j=e>>>0>l>>>0?j+1|0:j;e=j;h=(m|0)==(j|0)&l>>>0<o>>>0|j>>>0<m>>>0;j=d;d=h+p|0;j=d>>>0<h>>>0?j+1|0:j;u=d;o=j;B=n;d=wn(n,0,E,v);m=ma;i=d;h=wn(w,r,s,r);d=d+h|0;j=ma+m|0;j=d>>>0<h>>>0?j+1|0:j;h=j;m=(m|0)==(j|0)&d>>>0<i>>>0|j>>>0<m>>>0;G=F&-2;i=wn(A,v,G,0);n=i+d|0;j=ma+j|0;j=i>>>0>n>>>0?j+1|0:j;i=j;d=(h|0)==(j|0)&d>>>0>n>>>0|h>>>0>j>>>0;h=0;j=d+m|0;d=(j>>>0<d>>>0?1:h)+e|0;p=j+l|0;d=p>>>0<j>>>0?d+1|0:d;j=o;m=d;d=(e|0)==(d|0)&l>>>0>p>>>0|d>>>0<e>>>0;e=d;d=d+u|0;j=e>>>0>d>>>0?j+1|0:j;Q=d;u=j;d=wn(D,q,B,r);H=ma;D=d;e=wn(C,x,G,r);d=d+e|0;j=ma+H|0;j=d>>>0<e>>>0?j+1|0:j;o=d;l=wn(w,r,E,v);e=d+l|0;h=j;d=j+ma|0;d=e>>>0<l>>>0?d+1|0:d;q=e;j=wn(s,r,A,v);e=e+j|0;l=ma+d|0;l=e>>>0<j>>>0?l+1|0:l;C=(d|0)==(l|0)&e>>>0<q>>>0|d>>>0>l>>>0;j=(h|0)==(H|0)&o>>>0<D>>>0|h>>>0<H>>>0;d=(d|0)==(h|0)&o>>>0>q>>>0|d>>>0<h>>>0;d=d+j|0;d=d+C|0;h=l;q=h+p|0;j=(d|x)+m|0;j=h>>>0>q>>>0?j+1|0:j;o=j;d=(m|0)==(j|0)&p>>>0>q>>>0|j>>>0<m>>>0;j=u;h=d;d=d+Q|0;j=h>>>0>d>>>0?j+1|0:j;x=d;m=j;d=wn(w,r,G,r);w=ma;p=d;h=wn(s,r,B,r);d=d+h|0;j=ma+w|0;j=d>>>0<h>>>0?j+1|0:j;u=0;h=(j|0)==(w|0)&d>>>0<p>>>0|j>>>0<w>>>0;p=j;d=j+n|0;j=(h|u)+i|0;j=d>>>0<p>>>0?j+1|0:j;i=(i|0)==(j|0)&d>>>0<n>>>0|i>>>0>j>>>0;h=j;j=e;n=0;e=n+d|0;l=h+j|0;j=0;l=e>>>0<n>>>0?l+1|0:l;d=(h|0)==(l|0)&d>>>0>e>>>0|h>>>0>l>>>0;e=d;d=d+i|0;j=(e>>>0>d>>>0?1:j)+o|0;l=m;e=d;d=d+q|0;j=e>>>0>d>>>0?j+1|0:j;e=j;h=(o|0)==(j|0)&d>>>0<q>>>0|j>>>0<o>>>0;i=h;h=h+x|0;l=i>>>0>h>>>0?l+1|0:l;i=l;c:{if((l|0)==131071|l>>>0<131071){L=O|N;K=v|P;zf(k+80|0,d,j,h,l,f,g,z,y);l=J[k+84>>2];p=l;j=b<<17;o=0;n=J[k+88>>2];b=o-n|0;c=J[k+80>>2];l=(l|c)!=0;m=b-l|0;n=(j-(J[k+92>>2]+(n>>>0>o>>>0)|0)|0)-(b>>>0<l>>>0)|0;q=I+16382|0;o=0-(((c|0)!=0)+p|0)|0;p=0-c|0;break c}d=(e&1)<<31|d>>>1;e=h<<31|e>>>1;h=(i&1)<<31|h>>>1;i=i>>>1|0;zf(k+96|0,d,e,h,i,f,g,z,y);m=J[k+100>>2];u=m;p=0;s=J[k+104>>2];o=p-s|0;l=J[k+96>>2];n=(m|l)!=0;m=o-n|0;n=((b<<16)-(J[k+108>>2]+(p>>>0<s>>>0)|0)|0)-(n>>>0>o>>>0)|0;q=I+16383|0;F=b;s=c;o=0-(((l|0)!=0)+u|0)|0;p=0-l|0}if((q|0)>=32767){t=t|2147418112;b=0;c=0;break a}d:{if((q|0)>0){b=m<<1|o>>>31;c=n<<1|m>>>31;m=h;n=i&65535|q<<16;l=o<<1|p>>>31;o=p<<1;break d}if((q|0)<=-113){b=0;c=0;break a}of(k- -64|0,d,e,h,i,1-q|0);mf(k+48|0,F,s,L,K,q+112|0);d=J[k+64>>2];e=J[k+68>>2];m=J[k+72>>2];n=J[k+76>>2];zf(k+32|0,f,g,z,y,d,e,m,n);b=J[k+40>>2];c=J[k+56>>2];i=J[k+36>>2];p=b<<1|i>>>31;l=c-p|0;p=J[k+60>>2]-((J[k+44>>2]<<1|b>>>31)+(c>>>0<p>>>0)|0)|0;c=J[k+52>>2];s=c;b=J[k+32>>2];h=i<<1|b>>>31;o=b<<1;b=o;j=J[k+48>>2];c=(c|0)==(h|0)&b>>>0>j>>>0|c>>>0<h>>>0;b=l-c|0;c=p-(c>>>0>l>>>0)|0;l=s-((j>>>0<o>>>0)+h|0)|0;o=j-o|0}i=o;zf(k+16|0,f,g,z,y,3,0,0,0);zf(k,f,g,z,y,5,0,0,0);j=0;h=l+j|0;l=d&1;i=i+l|0;h=o>>>0>i>>>0?h+1|0:h;g=(g|0)==(h|0)&f>>>0<i>>>0|g>>>0<h>>>0;f=(h|0)==(j|0)&i>>>0<l>>>0|h>>>0<j>>>0;l=c;j=e;c=b+f|0;l=c>>>0<f>>>0?l+1|0:l;b=(y|0)==(l|0);b=b&(c|0)==(z|0)?g:b&c>>>0>z>>>0|l>>>0>y>>>0;f=b+d|0;j=b>>>0>f>>>0?j+1|0:j;b=j;d=(e|0)==(j|0)&d>>>0>f>>>0|e>>>0>j>>>0;j=n;e=d;d=d+m|0;j=e>>>0>d>>>0?j+1|0:j;g=d;e=J[k+20>>2];m=(e|0)==(h|0)&M[k+16>>2]<i>>>0|e>>>0<h>>>0;e=J[k+28>>2];d=J[k+24>>2];e=j>>>0<2147418112&((c|0)==(d|0)&(e|0)==(l|0)?m:(e|0)==(l|0)&d>>>0<c>>>0|e>>>0<l>>>0);d=b;m=e;e=e+f|0;d=m>>>0>e>>>0?d+1|0:d;b=(b|0)==(d|0)&e>>>0<f>>>0|b>>>0>d>>>0;f=b;b=b+g|0;j=f>>>0>b>>>0?j+1|0:j;f=b;g=J[k+4>>2];h=(g|0)==(h|0)&M[k>>2]<i>>>0|g>>>0<h>>>0;g=J[k+12>>2];b=J[k+8>>2];b=j>>>0<2147418112&((b|0)==(c|0)&(g|0)==(l|0)?h:(g|0)==(l|0)&b>>>0<c>>>0|g>>>0<l>>>0);c=b;b=b+e|0;l=c>>>0>b>>>0?d+1|0:d;c=l;e=(d|0)==(l|0)&b>>>0<e>>>0|d>>>0>l>>>0;d=j;g=e;e=e+f|0;d=g>>>0>e>>>0?d+1|0:d;r=e|r;t=d|t}J[a>>2]=b;J[a+4>>2]=c;J[a+8>>2]=r;J[a+12>>2]=t;la=k+336|0}function Ka(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;d=la-128|0;la=d;J[a+4>>2]=0;J[a+8>>2]=0;H[a|0]=0;J[a+20>>2]=0;J[a+24>>2]=0;H[a+9|0]=0;H[a+10|0]=0;H[a+11|0]=0;H[a+12|0]=0;H[a+13|0]=0;H[a+14|0]=0;H[a+15|0]=0;H[a+16|0]=0;J[a+28>>2]=0;J[a+32>>2]=0;J[a+36>>2]=0;J[a+40>>2]=0;r=a+4|0;a:{if(!(!K[b+124|0]&J[b+120>>2]==1)){wm(r,2025,28);break a}J[d+124>>2]=6;j=la-32|0;la=j;s=d+124|0;J[s>>2]=6;p=b+80|0;q=j+20|0;J[q+8>>2]=0;J[q>>2]=0;J[q+4>>2]=0;n=b+40|0;m=J[n+32>>2];b:{c:{d:{o=J[n+28>>2];if((m|0)!=(o|0)){while(1){g=J[p+16>>2];e:{f:{if((g|0)==J[p+12>>2]){break f}k=P(l,20)+o|0;f=J[k+12>>2];if((f|0)==5){break f}if(J[p+28>>2]>0){f=J[g-4>>2];c=J[k+16>>2];if((f|0)==2&(c|0)==2){break f}if((f|0)!=5|(c|0)!=5){break e}if(K[p+35|0]){break f}break e}c=J[p+24>>2];if((c|0)!=6){if((c|0)==(f|0)){break f}break e}if((f|0)==J[g-8>>2]){break f}if(J[k+16>>2]!=J[g-4>>2]){break e}}if(e>>>0<h>>>0){J[e>>2]=l;e=e+4|0;J[q+4>>2]=e;break e}k=e-i>>2;g=k+1|0;if(g>>>0>=1073741824){break d}f=h-i|0;c=f>>1;h=f>>>0>=2147483644?1073741823:c>>>0>g>>>0?c:g;if(h){if(h>>>0>=1073741824){break c}c=om(h<<2)}else{c=0}f=c+(k<<2)|0;J[f>>2]=l;h=c+(h<<2)|0;c=f+4|0;if((e|0)!=(i|0)){while(1){f=f-4|0;e=e-4|0;J[f>>2]=J[e>>2];if((e|0)!=(i|0)){continue}break}}J[q+8>>2]=h;J[q+4>>2]=c;J[q>>2]=f;if(i){tb(i);m=J[n+32>>2];o=J[n+28>>2]}i=f;e=c}l=l+1|0;if(l>>>0<(m-o|0)/20>>>0){continue}break}}break b}Ra();B()}Va();B()}e=J[j+20>>2];k=J[j+24>>2];g:{if((e|0)==(k|0)){l=-1;break g}if(J[p+28>>2]>0){f=J[n+28>>2];c=e;while(1){h:{l=J[c>>2];switch(J[(f+P(l,20)|0)+16>>2]-2|0){case 0:case 3:break g;default:break h}}c=c+4|0;if((k|0)!=(c|0)){continue}break}}h=J[n+28>>2];c=e;while(1){l=J[c>>2];i=h+P(l,20)|0;f=J[i+16>>2];if(!(f>>>0>14|!(1<<f&16678))&J[i+12>>2]!=5){break g}c=c+4|0;if((k|0)!=(c|0)){continue}break}i=J[n+28>>2];c=e;while(1){l=J[c>>2];if(J[(P(l,20)+i|0)+12>>2]!=5){break g}c=c+4|0;if((k|0)!=(c|0)){continue}break}l=J[e>>2];k=j+12|0;J[j+8>>2]=k;J[j+12>>2]=0;J[j+16>>2]=0;o=J[n+32>>2];i:{if((o|0)==(i|0)){g=0;break i}while(1){g=J[i+12>>2];if((g|0)!=5){h=k;c=h;f=J[j+12>>2];j:{k:{if(!f){break k}while(1){c=f;e=J[c+16>>2];if((e|0)>(g|0)){h=c;f=J[c>>2];if(f){continue}break k}if((e|0)>=(g|0)){break j}f=J[c+4>>2];if(f){continue}break}h=c+4|0}f=om(24);J[f+16>>2]=g;J[f+8>>2]=c;J[f>>2]=0;J[f+4>>2]=0;J[f+20>>2]=0;J[h>>2]=f;c=f;e=J[J[j+8>>2]>>2];if(e){J[j+8>>2]=e;c=J[h>>2]}e=c;m=J[j+12>>2];c=(m|0)==(c|0);H[e+12|0]=c;l:{if(c){break l}while(1){c=J[e+8>>2];if(K[c+12|0]){break l}m:{g=J[c+8>>2];h=J[g>>2];if((h|0)==(c|0)){h=J[g+4>>2];if(!(!h|K[h+12|0])){break m}n:{if(J[c>>2]==(e|0)){h=c;break n}h=J[c+4>>2];m=J[h>>2];J[c+4>>2]=m;e=c;if(m){J[m+8>>2]=c;g=J[c+8>>2];e=J[g>>2]}J[h+8>>2]=g;J[((c|0)==(e|0)?g:g+4|0)>>2]=h;J[h>>2]=c;J[c+8>>2]=h;g=J[h+8>>2];c=J[g>>2]}H[h+12|0]=1;H[g+12|0]=0;e=J[c+4>>2];J[g>>2]=e;if(e){J[e+8>>2]=g}e=J[g+8>>2];J[c+8>>2]=e;J[e+((J[e>>2]!=(g|0))<<2)>>2]=c;J[c+4>>2]=g;J[g+8>>2]=c;break l}if(!(K[h+12|0]|!h)){break m}o:{if(J[c>>2]!=(e|0)){e=c;break o}h=J[e+4>>2];J[c>>2]=h;if(h){J[h+8>>2]=c;g=J[c+8>>2]}J[e+8>>2]=g;J[(J[g>>2]==(c|0)?g:g+4|0)>>2]=e;J[e+4>>2]=c;J[c+8>>2]=e;g=J[e+8>>2]}H[e+12|0]=1;H[g+12|0]=0;e=J[g+4>>2];c=J[e>>2];J[g+4>>2]=c;if(c){J[c+8>>2]=g}c=J[g+8>>2];J[e+8>>2]=c;J[c+((J[c>>2]!=(g|0))<<2)>>2]=e;J[e>>2]=g;J[g+8>>2]=e;break l}h=h+12|0;H[c+12|0]=1;H[g+12|0]=(g|0)==(m|0);H[h|0]=1;e=g;if((m|0)!=(e|0)){continue}break}}J[j+16>>2]=J[j+16>>2]+1}c=f+20|0;J[c>>2]=J[c>>2]+1}i=i+20|0;if((o|0)!=(i|0)){continue}break}g=0;i=J[j+8>>2];if((k|0)==(i|0)){break i}h=-1;while(1){o=J[i+20>>2];m=(o|0)>(h|0);e=i;f=J[e+4>>2];p:{if(f){while(1){c=f;f=J[c>>2];if(f){continue}break p}}while(1){c=J[e+8>>2];f=J[c>>2]!=(e|0);e=c;if(f){continue}break}}h=m?o:h;g=m?J[i+16>>2]:g;i=c;if((c|0)!=(k|0)){continue}break}}J[s>>2]=g;La(j+8|0,J[j+12>>2]);e=J[j+20>>2]}if(e){J[j+24>>2]=e;tb(e)}g=a+20|0;la=j+32|0;c=l;if((c|0)>=0){f=J[b+68>>2];i=f+P(c,20)|0;q:{if(H[i+11|0]>=0){J[d+112>>2]=J[i+8>>2];e=J[i+4>>2];J[d+104>>2]=J[i>>2];J[d+108>>2]=e;break q}vm(d+104|0,J[i>>2],J[i+4>>2])}f=f+P(c,20)|0;e=J[f+16>>2];J[d+116>>2]=J[f+12>>2];J[d+120>>2]=e;J[d+88>>2]=0;J[d+80>>2]=0;J[d+84>>2]=0;Ga(n,c,d+80|0);r:{if(H[d+115|0]>=0){J[d+16>>2]=J[d+112>>2];c=J[d+108>>2];J[d+8>>2]=J[d+104>>2];J[d+12>>2]=c;break r}vm(d+8|0,J[d+104>>2],J[d+108>>2])}c=J[d+120>>2];J[d+20>>2]=J[d+116>>2];J[d+24>>2]=c;Ha(d+32|0,b,n,b,d+8|0,J[d+124>>2]);H[a|0]=K[d+32|0];c=d+36|0;if(H[a+15|0]<0){tb(J[r>>2])}b=J[c+4>>2];J[r>>2]=J[c>>2];J[r+4>>2]=b;J[r+8>>2]=J[c+8>>2];H[d+36|0]=0;H[d+47|0]=0;H[a+16|0]=K[d+48|0];c=d+52|0;if(H[a+31|0]<0){tb(J[g>>2])}b=J[c+4>>2];J[g>>2]=J[c>>2];J[g+4>>2]=b;J[g+8>>2]=J[c+8>>2];H[d+52|0]=0;H[d+63|0]=0;c=a+32|0;s:{if(H[a+43|0]>=0){a=J[d+68>>2];J[c>>2]=J[d+64>>2];J[c+4>>2]=a;J[c+8>>2]=J[d+72>>2];H[d+75|0]=0;H[d+64|0]=0;break s}tb(J[c>>2]);b=H[d+63|0];J[c+8>>2]=J[d+72>>2];a=J[d+68>>2];J[c>>2]=J[d+64>>2];J[c+4>>2]=a;H[d+75|0]=0;H[d+64|0]=0;if((b|0)>=0){break s}tb(J[d+52>>2])}if(H[d+47|0]<0){tb(J[d+36>>2])}if(H[d+19|0]<0){tb(J[d+8>>2])}if(H[d+91|0]<0){tb(J[d+80>>2])}if(H[d+115|0]>=0){break a}tb(J[d+104>>2]);break a}c=b+108|0;e=J[c>>2];J[c>>2]=0;k=(e|0)<=1?1:e;h=b+68|0;f=0;while(1){Ca(d+32|0,p);i=K[d+43|0];c=i<<24>>24;l=(c|0)<0;e=J[d+36>>2];if(l?e:i){i=J[b+72>>2];t:{if((i|0)!=J[b+76>>2]){u:{if(!l){c=J[d+36>>2];J[i>>2]=J[d+32>>2];J[i+4>>2]=c;J[i+8>>2]=J[d+40>>2];break u}vm(i,J[d+32>>2],e)}c=J[d+48>>2];J[i+12>>2]=J[d+44>>2];J[i+16>>2]=c;J[b+72>>2]=i+20;break t}Da(h,d+32|0)}t=t+1|0;c=K[d+43|0]}if(c<<24>>24<0){tb(J[d+32>>2])}f=f+1|0;if((k|0)!=(f|0)){continue}break}c=d+80|0;Im(c,t);f=zm(c,2736);e=f+8|0;J[d+112>>2]=J[e>>2];c=J[f+4>>2];J[d+104>>2]=J[f>>2];J[d+108>>2]=c;J[f>>2]=0;J[f+4>>2]=0;J[e>>2]=0;f=Dm(d+104|0,1965);e=f+8|0;J[d+40>>2]=J[e>>2];c=J[f+4>>2];J[d+32>>2]=J[f>>2];J[d+36>>2]=c;J[f>>2]=0;J[f+4>>2]=0;J[e>>2]=0;Ea(b,d+32|0);if(H[d+43|0]<0){tb(J[d+32>>2])}if(H[d+115|0]<0){tb(J[d+104>>2])}if(H[d+91|0]<0){tb(J[d+80>>2])}H[a|0]=1;wm(r,1987,15);H[d+110|0]=0;I[d+108>>1]=K[1239]|K[1240]<<8;H[d+115|0]=6;J[d+104>>2]=K[1235]|K[1236]<<8|(K[1237]<<16|K[1238]<<24);Ia(d+32|0,d+104|0);e=a+32|0;if(H[a+43|0]<0){tb(J[e>>2])}c=J[d+36>>2];J[e>>2]=J[d+32>>2];J[e+4>>2]=c;J[e+8>>2]=J[d+40>>2];H[d+43|0]=0;H[d+32|0]=0;if(H[d+115|0]<0){tb(J[d+104>>2])}J[b+120>>2]=0;if(!K[b+117|0]|J[b+80>>2]!=J[b+84>>2]){break a}Ja(b);H[a+16|0]=K[b+124|0];f=b+128|0;if((f|0)==(g|0)){break a}c=K[b+139|0];e=c<<24>>24;if(H[a+31|0]>=0){if((e|0)>=0){a=J[f+4>>2];J[g>>2]=J[f>>2];J[g+4>>2]=a;J[g+8>>2]=J[f+8>>2];break a}Bm(g,J[b+128>>2],J[b+132>>2]);break a}a=(e|0)<0;Am(g,a?J[b+128>>2]:f,a?J[b+132>>2]:c)}la=d+128|0}function za(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;b=la-224|0;la=b;d=J[a+4>>2];h=J[a>>2];if((d|0)!=(h|0)){while(1){c=d-20|0;if(H[d-9|0]<0){tb(J[c>>2])}d=c;if((c|0)!=(h|0)){continue}break}}J[a+4>>2]=h;d=J[a+16>>2];h=J[a+12>>2];if((d|0)!=(h|0)){while(1){c=d-20|0;if(H[d-9|0]<0){tb(J[c>>2])}d=c;if((c|0)!=(h|0)){continue}break}}J[a+24>>2]=6;J[a+28>>2]=0;J[a+16>>2]=h;J[b+128>>2]=0;e=om(48);j=e+48|0;J[b+140>>2]=j;J[b+132>>2]=e;g=J[741];d=J[740];J[e+40>>2]=d;J[e+44>>2]=g;m=J[739];c=J[738];J[e+32>>2]=c;J[e+36>>2]=m;l=J[737];h=J[736];J[e+24>>2]=h;J[e+28>>2]=l;n=J[735];f=J[734];J[e+16>>2]=f;J[e+20>>2]=n;o=J[733];i=J[732];J[e+8>>2]=i;J[e+12>>2]=o;p=J[731];k=J[730];J[e>>2]=k;J[e+4>>2]=p;J[b+136>>2]=j;J[b+144>>2]=1;e=om(48);J[b+148>>2]=e;j=e+48|0;J[b+156>>2]=j;J[e+40>>2]=d;J[e+44>>2]=g;J[e+32>>2]=c;J[e+36>>2]=m;J[e+24>>2]=h;J[e+28>>2]=l;J[e+16>>2]=f;J[e+20>>2]=n;J[e+8>>2]=i;J[e+12>>2]=o;J[e>>2]=k;J[e+4>>2]=p;J[b+152>>2]=j;J[b+160>>2]=2;i=om(36);J[b+164>>2]=i;l=i+36|0;J[b+172>>2]=l;n=J[750];J[i+32>>2]=n;k=J[749];d=J[748];J[i+24>>2]=d;J[i+28>>2]=k;e=J[747];c=J[746];J[i+16>>2]=c;J[i+20>>2]=e;g=J[745];h=J[744];J[i+8>>2]=h;J[i+12>>2]=g;m=J[743];f=J[742];J[i>>2]=f;J[i+4>>2]=m;J[b+168>>2]=l;J[b+176>>2]=3;i=om(36);J[b+180>>2]=i;l=i+36|0;J[b+188>>2]=l;J[i+32>>2]=n;J[i+24>>2]=d;J[i+28>>2]=k;J[i+16>>2]=c;J[i+20>>2]=e;J[i+8>>2]=h;J[i+12>>2]=g;J[i>>2]=f;J[i+4>>2]=m;J[b+184>>2]=l;J[b+192>>2]=4;d=om(28);J[b+196>>2]=d;c=d+28|0;J[b+204>>2]=c;J[d+24>>2]=J[757];h=J[756];J[d+16>>2]=J[755];J[d+20>>2]=h;h=J[754];J[d+8>>2]=J[753];J[d+12>>2]=h;h=J[752];J[d>>2]=J[751];J[d+4>>2]=h;J[b+200>>2]=c;J[b+208>>2]=5;d=om(20);J[b+212>>2]=d;c=d+20|0;J[b+220>>2]=c;J[d+16>>2]=J[762];h=J[761];J[d+8>>2]=J[760];J[d+12>>2]=h;h=J[759];J[d>>2]=J[758];J[d+4>>2]=h;J[b+216>>2]=c;c=0;i=om(96);h=i;a:{b:{while(1){f=(b+128|0)+c|0;k=J[f>>2];J[h+12>>2]=0;J[h+4>>2]=0;J[h+8>>2]=0;J[h>>2]=k;e=J[f+8>>2];k=J[f+4>>2];if((e|0)!=(k|0)){e=e-k|0;g=e>>2;if(g>>>0>=1073741824){break b}f=om(e);J[h+8>>2]=f;J[h+4>>2]=f;g=f+(g<<2)|0;J[h+12>>2]=g;ib(f,k,e);J[h+8>>2]=g}h=h+16|0;c=c+16|0;if((c|0)!=96){continue}break}tb(d);d=J[b+196>>2];if(d){tb(d)}d=J[b+180>>2];if(d){tb(d)}d=J[b+164>>2];if(d){tb(d)}d=J[b+148>>2];if(d){tb(d)}d=J[b+132>>2];if(d){tb(d)}J[b+124>>2]=0;J[b+116>>2]=0;J[b+120>>2]=0;l=(h|0)==(i|0);if(l){break a}n=b+132|0;k=n+3|0;e=1;f=i;while(1){c:{if(!K[a+34|0]&J[f>>2]==5){break c}d=J[f+4>>2];o=J[f+8>>2];if((d|0)==(o|0)){break c}while(1){m=J[d>>2];p=b+136|0;J[p>>2]=0;J[b+128>>2]=0;J[b+132>>2]=0;d:{e:{f:{g:{switch(J[f>>2]){case 0:c=6;H[b+43|0]=6;J[b+32>>2]=K[1532]|K[1533]<<8|(K[1534]<<16|K[1535]<<24);I[b+36>>1]=K[1536]|K[1537]<<8;break d;case 1:J[b+32>>2]=1634300532;J[b+36>>2]=1701603182;c=8;break e;case 2:c=5;H[b+43|0]=5;J[b+32>>2]=K[1250]|K[1251]<<8|(K[1252]<<16|K[1253]<<24);H[b+36|0]=K[1254];break d;case 3:c=6;H[b+43|0]=6;J[b+32>>2]=K[1509]|K[1510]<<8|(K[1511]<<16|K[1512]<<24);I[b+36>>1]=K[1513]|K[1514]<<8;break d;case 4:J[b+32>>2]=1918989427;break f;case 5:J[b+32>>2]=1953458295;break f;default:break g}}J[b+32>>2]=1701736302}c=4}H[b+43|0]=c}j=c;c=b+32|0;H[j+c|0]=0;c=zm(c,1621);g=c+8|0;J[b+56>>2]=J[g>>2];j=J[c+4>>2];J[b+48>>2]=J[c>>2];J[b+52>>2]=j;J[c>>2]=0;J[c+4>>2]=0;J[g>>2]=0;c=Dm(b+48|0,1625);g=c+8|0;J[b+72>>2]=J[g>>2];j=J[c+4>>2];J[b+64>>2]=J[c>>2];J[b+68>>2]=j;J[c>>2]=0;J[c+4>>2]=0;J[g>>2]=0;c=b+20|0;Im(c,m);j=c;c=K[b+31|0];g=c<<24>>24<0;c=xm(b- -64|0,g?J[b+20>>2]:j,g?J[b+24>>2]:c);g=c+8|0;J[b+88>>2]=J[g>>2];j=J[c+4>>2];J[b+80>>2]=J[c>>2];J[b+84>>2]=j;J[c>>2]=0;J[c+4>>2]=0;J[g>>2]=0;c=Dm(b+80|0,1625);g=c+8|0;J[b+104>>2]=J[g>>2];j=J[c+4>>2];J[b+96>>2]=J[c>>2];J[b+100>>2]=j;J[c>>2]=0;J[c+4>>2]=0;J[g>>2]=0;c=b+8|0;Im(c,e);j=c;c=K[b+19|0];g=c<<24>>24<0;c=xm(b+96|0,g?J[b+8>>2]:j,g?J[b+12>>2]:c);j=J[c>>2];J[b+108>>2]=J[c+4>>2];g=K[c+7|0]|K[c+8|0]<<8|(K[c+9|0]<<16|K[c+10|0]<<24);H[b+111|0]=g;H[b+112|0]=g>>>8;H[b+113|0]=g>>>16;H[b+114|0]=g>>>24;J[c>>2]=0;J[c+4>>2]=0;q=K[c+11|0];J[c+8>>2]=0;if(H[b+139|0]<0){tb(J[b+128>>2])}J[b+128>>2]=j;c=k;g=K[b+111|0]|K[b+112|0]<<8|(K[b+113|0]<<16|K[b+114|0]<<24);H[c|0]=g;H[c+1|0]=g>>>8;H[c+2|0]=g>>>16;H[c+3|0]=g>>>24;J[n>>2]=J[b+108>>2];H[b+139|0]=q;if(H[b+19|0]<0){tb(J[b+8>>2])}if(H[b+107|0]<0){tb(J[b+96>>2])}if(H[b+91|0]<0){tb(J[b+80>>2])}if(H[b+31|0]<0){tb(J[b+20>>2])}if(H[b+75|0]<0){tb(J[b+64>>2])}if(H[b+59|0]<0){tb(J[b+48>>2])}if(H[b+43|0]<0){tb(J[b+32>>2])}c=J[f>>2];J[b+144>>2]=m;J[b+140>>2]=c;c=J[b+120>>2];h:{if((c|0)!=J[b+124>>2]){i:{if(H[b+139|0]>=0){g=J[b+132>>2];J[c>>2]=J[b+128>>2];J[c+4>>2]=g;J[c+8>>2]=J[p>>2];break i}vm(c,J[b+128>>2],J[b+132>>2])}g=J[b+144>>2];J[c+12>>2]=J[b+140>>2];J[c+16>>2]=g;J[b+120>>2]=c+20;break h}Da(b+116|0,b+128|0)}if(H[b+139|0]<0){tb(J[b+128>>2])}e=e+1|0;d=d+4|0;if((o|0)!=(d|0)){continue}break}}f=f+16|0;if((h|0)!=(f|0)){continue}break}break a}Ra();B()}d=(pb()>>>0)%2147483647|0;J[b+80>>2]=d>>>0<=1?1:d;d=J[b+120>>2];c=J[b+116>>2];f=d-c|0;j:{if((f|0)<21){break j}J[b+128>>2]=0;J[b+132>>2]=2147483647;k=d-20|0;if(k>>>0<=c>>>0){break j}e=(f>>>0)/20|0;while(1){J[b+96>>2]=0;e=e-1|0;J[b+100>>2]=e;f=Sa(b+80|0,b+96|0);if(f){g=J[c>>2];J[b+96>>2]=J[c+4>>2];d=K[c+7|0]|K[c+8|0]<<8|(K[c+9|0]<<16|K[c+10|0]<<24);H[b+99|0]=d;H[b+100|0]=d>>>8;H[b+101|0]=d>>>16;H[b+102|0]=d>>>24;d=P(f,20)+c|0;f=J[d+4>>2];J[c>>2]=J[d>>2];J[c+4>>2]=f;m=K[c+11|0];J[c+8>>2]=J[d+8>>2];n=J[c+12>>2];o=J[c+16>>2];f=J[d+16>>2];J[c+12>>2]=J[d+12>>2];J[c+16>>2]=f;J[d>>2]=g;J[d+4>>2]=J[b+96>>2];f=K[b+99|0]|K[b+100|0]<<8|(K[b+101|0]<<16|K[b+102|0]<<24);H[d+7|0]=f;H[d+8|0]=f>>>8;H[d+9|0]=f>>>16;H[d+10|0]=f>>>24;J[d+12>>2]=n;J[d+16>>2]=o;H[d+11|0]=m}c=c+20|0;if(k>>>0>c>>>0){continue}break}}if((b+116|0)!=(a|0)){d=J[b+116>>2];c=J[b+120>>2];Ta(a,d,c,(c-d|0)/20|0)}f=J[a+4>>2];if((f|0)!=J[a>>2]){k=a+12|0;c=f-20|0;d=J[a+16>>2];k:{if((d|0)!=J[a+20>>2]){l:{if(H[f-9|0]>=0){k=J[c+4>>2];J[d>>2]=J[c>>2];J[d+4>>2]=k;J[d+8>>2]=J[c+8>>2];break l}vm(d,J[c>>2],J[f-16>>2])}c=f-8|0;f=J[c+4>>2];J[d+12>>2]=J[c>>2];J[d+16>>2]=f;J[a+16>>2]=d+20;break k}Da(k,c)}c=J[a+4>>2];d=c-20|0;if(H[c-9|0]<0){tb(J[d>>2])}J[a+4>>2]=d}a=J[b+116>>2];if(a){c=a;d=J[b+120>>2];if((c|0)!=(d|0)){while(1){c=d-20|0;if(H[d-9|0]<0){tb(J[c>>2])}d=c;if((c|0)!=(a|0)){continue}break}c=J[b+116>>2]}J[b+120>>2]=a;tb(c)}if(!l){while(1){a=h-16|0;d=J[a+4>>2];if(d){J[h-8>>2]=d;tb(d)}h=a;if((h|0)!=(i|0)){continue}break}}tb(i);la=b+224|0}function Wf(a,b,c,d,e,f){a=a|0;b=+b;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,w=0,x=0,y=0,z=0,B=0,C=0;l=la-560|0;la=l;J[l+44>>2]=0;A(+b);g=v(1)|0;v(0)|0;a:{if((g|0)<0){t=1;x=1163;b=-b;A(+b);g=v(1)|0;v(0)|0;break a}if(e&2048){t=1;x=1166;break a}t=e&1;x=t?1169:1164;z=!t}b:{if((g&2146435072)==2146435072){g=t+3|0;Vf(a,32,c,g,e&-65537);Rf(a,x,t);d=f&32;Rf(a,b!=b?d?1381:1681:d?1480:1703,3);Vf(a,32,c,g,e^8192);n=(c|0)<(g|0)?g:c;break b}u=l+16|0;c:{d:{e:{b=Pf(b,l+44|0);b=b+b;if(b!=0){g=J[l+44>>2];J[l+44>>2]=g-1;w=f|32;if((w|0)!=97){break e}break c}w=f|32;if((w|0)==97){break c}k=J[l+44>>2];j=(d|0)<0?6:d;break d}k=g-29|0;J[l+44>>2]=k;b=b*268435456;j=(d|0)<0?6:d}q=(l+48|0)+((k|0)>=0?288:0)|0;h=q;while(1){if(b<4294967296&b>=0){d=~~b>>>0}else{d=0}J[h>>2]=d;h=h+4|0;b=(b-+(d>>>0))*1e9;if(b!=0){continue}break}f:{if((k|0)<=0){d=k;g=h;i=q;break f}i=q;d=k;while(1){p=(d|0)>=29?29:d;g=h-4|0;g:{if(i>>>0>g>>>0){break g}o=0;while(1){d=J[g>>2];m=p&31;y=o;if((p&63)>>>0>=32){o=d<<m;d=0}else{o=(1<<m)-1&d>>>32-m;d=d<<m}m=y+d|0;o=n+o|0;o=xn(m,d>>>0>m>>>0?o+1|0:o,1e9);B=g,C=m-wn(o,ma,1e9,0)|0,J[B>>2]=C;g=g-4|0;if(i>>>0<=g>>>0){continue}break}if(!o){break g}i=i-4|0;J[i>>2]=o}while(1){g=h;if(i>>>0<g>>>0){h=g-4|0;if(!J[h>>2]){continue}}break}d=J[l+44>>2]-p|0;J[l+44>>2]=d;h=g;if((d|0)>0){continue}break}}if((d|0)<0){s=((j+25>>>0)/9|0)+1|0;n=(w|0)==102;while(1){d=0-d|0;m=(d|0)>=9?9:d;h:{if(g>>>0<=i>>>0){h=J[i>>2];break h}o=1e9>>>m|0;p=-1<<m^-1;d=0;h=i;while(1){y=d;d=J[h>>2];J[h>>2]=y+(d>>>m|0);d=P(o,d&p);h=h+4|0;if(h>>>0<g>>>0){continue}break}h=J[i>>2];if(!d){break h}J[g>>2]=d;g=g+4|0}d=m+J[l+44>>2]|0;J[l+44>>2]=d;i=(!h<<2)+i|0;h=n?q:i;g=g-h>>2>(s|0)?h+(s<<2)|0:g;if((d|0)<0){continue}break}}d=0;i:{if(g>>>0<=i>>>0){break i}d=P(q-i>>2,9);h=10;p=J[i>>2];if(p>>>0<10){break i}while(1){d=d+1|0;h=P(h,10);if(p>>>0>=h>>>0){continue}break}}h=(j-((w|0)!=102?d:0)|0)-((w|0)==103&(j|0)!=0)|0;if((h|0)<(P(g-q>>2,9)-9|0)){o=(l+48|0)+((k|0)<0?4:292)|0;p=h+9216|0;k=(p|0)/9|0;s=o+(k<<2)|0;m=s-4096|0;h=10;n=p-P(k,9)|0;if((n|0)<=7){while(1){h=P(h,10);n=n+1|0;if((n|0)!=8){continue}break}}o=J[m>>2];p=(o>>>0)/(h>>>0)|0;n=o-P(h,p)|0;k=s-4092|0;j:{if(!n&(k|0)==(g|0)){break j}k:{if(!(p&1)){b=9007199254740992;if(!(H[s-4100|0]&1)|((h|0)!=1e9|i>>>0>=m>>>0)){break k}}b=9007199254740994}r=(g|0)==(k|0)?1:1.5;k=h>>>1|0;r=k>>>0>n>>>0?.5:(k|0)==(n|0)?r:1.5;if(!(K[x|0]!=45|z)){r=-r;b=-b}k=o-n|0;J[m>>2]=k;if(b+r==b){break j}d=h+k|0;J[m>>2]=d;if(d>>>0>=1e9){while(1){J[m>>2]=0;m=m-4|0;if(m>>>0<i>>>0){i=i-4|0;J[i>>2]=0}d=J[m>>2]+1|0;J[m>>2]=d;if(d>>>0>999999999){continue}break}}d=P(q-i>>2,9);h=10;k=J[i>>2];if(k>>>0<10){break j}while(1){d=d+1|0;h=P(h,10);if(k>>>0>=h>>>0){continue}break}}h=m+4|0;g=g>>>0>h>>>0?h:g}while(1){k=g;p=g>>>0<=i>>>0;if(!p){g=g-4|0;if(!J[g>>2]){continue}}break}l:{if((w|0)!=103){m=e&8;break l}h=j?j:1;g=(h|0)>(d|0)&(d|0)>-5;j=(g?d^-1:-1)+h|0;f=(g?-1:-2)+f|0;m=e&8;if(m){break l}g=-9;m:{if(p){break m}p=J[k-4>>2];if(!p){break m}n=10;g=0;if((p>>>0)%10|0){break m}while(1){h=g;g=g+1|0;n=P(n,10);if(!((p>>>0)%(n>>>0)|0)){continue}break}g=h^-1}h=P(k-q>>2,9);if((f&-33)==70){m=0;g=(g+h|0)-9|0;g=(g|0)>0?g:0;j=(g|0)>(j|0)?j:g;break l}m=0;g=((d+h|0)+g|0)-9|0;g=(g|0)>0?g:0;j=(g|0)>(j|0)?j:g}n=-1;p=j|m;if(((p?2147483645:2147483646)|0)<(j|0)){break b}o=(((p|0)!=0)+j|0)+1|0;h=f&-33;n:{if((h|0)==70){if((o^2147483647)<(d|0)){break b}g=(d|0)>0?d:0;break n}g=d>>31;g=Uf((g^d)-g|0,0,u);if((u-g|0)<=1){while(1){g=g-1|0;H[g|0]=48;if((u-g|0)<2){continue}break}}s=g-2|0;H[s|0]=f;H[g-1|0]=(d|0)<0?45:43;g=u-s|0;if((g|0)>(o^2147483647)){break b}}d=g+o|0;if((d|0)>(t^2147483647)){break b}n=d+t|0;Vf(a,32,c,n,e);Rf(a,x,t);Vf(a,48,c,n,e^65536);o:{p:{q:{if((h|0)==70){f=l+16|0;d=f|8;o=f|9;h=i>>>0>q>>>0?q:i;i=h;while(1){g=Uf(J[i>>2],0,o);r:{if((h|0)!=(i|0)){if(l+16>>>0>=g>>>0){break r}while(1){g=g-1|0;H[g|0]=48;if(l+16>>>0<g>>>0){continue}break}break r}if((g|0)!=(o|0)){break r}H[l+24|0]=48;g=d}Rf(a,g,o-g|0);i=i+4|0;if(q>>>0>=i>>>0){continue}break}if(p){Rf(a,2077,1)}if((j|0)<=0|i>>>0>=k>>>0){break q}while(1){g=Uf(J[i>>2],0,o);if(g>>>0>l+16>>>0){while(1){g=g-1|0;H[g|0]=48;if(l+16>>>0<g>>>0){continue}break}}Rf(a,g,(j|0)>=9?9:j);g=j-9|0;i=i+4|0;if(k>>>0<=i>>>0){break p}d=(j|0)>9;j=g;if(d){continue}break}break p}s:{if((j|0)<0){break s}k=i>>>0<k>>>0?k:i+4|0;f=l+16|0;d=f|8;q=f|9;h=i;while(1){g=Uf(J[h>>2],0,q);if((q|0)==(g|0)){H[l+24|0]=48;g=d}t:{if((h|0)!=(i|0)){if(l+16>>>0>=g>>>0){break t}while(1){g=g-1|0;H[g|0]=48;if(l+16>>>0<g>>>0){continue}break}break t}Rf(a,g,1);g=g+1|0;if(!(j|m)){break t}Rf(a,2077,1)}f=q-g|0;Rf(a,g,(f|0)<(j|0)?f:j);j=j-f|0;h=h+4|0;if(k>>>0<=h>>>0){break s}if((j|0)>=0){continue}break}}Vf(a,48,j+18|0,18,0);Rf(a,s,u-s|0);break o}g=j}Vf(a,48,g+9|0,9,0)}Vf(a,32,c,n,e^8192);n=(c|0)<(n|0)?n:c;break b}q=(f<<26>>31&9)+x|0;u:{if(d>>>0>11){break u}g=12-d|0;r=16;while(1){r=r*16;g=g-1|0;if(g){continue}break}if(K[q|0]==45){b=-(r+(-b-r));break u}b=b+r-r}g=J[l+44>>2];h=g>>31;g=Uf((g^h)-h|0,0,u);if((u|0)==(g|0)){H[l+15|0]=48;g=l+15|0}k=t|2;i=f&32;h=J[l+44>>2];j=g-2|0;H[j|0]=f+15;H[g-1|0]=(h|0)<0?45:43;g=e&8;h=l+16|0;while(1){f=h;f=h;if(R(b)<2147483648){h=~~b}else{h=-2147483648}H[f|0]=i|K[h+5936|0];b=(b-+(h|0))*16;h=f+1|0;if(!(!((d|0)>0|g)&b==0|(h-(l+16|0)|0)!=1)){H[f+1|0]=46;h=f+2|0}if(b!=0){continue}break}n=-1;g=u-j|0;f=g+k|0;if((2147483645-f|0)<(d|0)){break b}i=l+16|0;h=h-i|0;d=d?(h-2|0)<(d|0)?d+2|0:h:h;f=d+f|0;Vf(a,32,c,f,e);Rf(a,q,k);Vf(a,48,c,f,e^65536);Rf(a,i,h);Vf(a,48,d-h|0,0,0);Rf(a,j,g);Vf(a,32,c,f,e^8192);n=(c|0)<(f|0)?f:c}la=l+560|0;return n|0}function Ia(a,b){var c=0,d=0;c=K[b+11|0];d=c<<24>>24<0;a:{b:{switch((d?J[b+4>>2]:c)-4|0){case 1:c=d?J[b>>2]:b;if(!lb(c,1893,5)){c=om(48);J[a>>2]=c;J[a+4>>2]=36;J[a+8>>2]=-2147483600;a=K[2322]|K[2323]<<8|(K[2324]<<16|K[2325]<<24);H[c+32|0]=a;H[c+33|0]=a>>>8;H[c+34|0]=a>>>16;H[c+35|0]=a>>>24;b=K[2318]|K[2319]<<8|(K[2320]<<16|K[2321]<<24);a=K[2314]|K[2315]<<8|(K[2316]<<16|K[2317]<<24);H[c+24|0]=a;H[c+25|0]=a>>>8;H[c+26|0]=a>>>16;H[c+27|0]=a>>>24;H[c+28|0]=b;H[c+29|0]=b>>>8;H[c+30|0]=b>>>16;H[c+31|0]=b>>>24;b=K[2310]|K[2311]<<8|(K[2312]<<16|K[2313]<<24);a=K[2306]|K[2307]<<8|(K[2308]<<16|K[2309]<<24);H[c+16|0]=a;H[c+17|0]=a>>>8;H[c+18|0]=a>>>16;H[c+19|0]=a>>>24;H[c+20|0]=b;H[c+21|0]=b>>>8;H[c+22|0]=b>>>16;H[c+23|0]=b>>>24;b=K[2302]|K[2303]<<8|(K[2304]<<16|K[2305]<<24);a=K[2298]|K[2299]<<8|(K[2300]<<16|K[2301]<<24);H[c+8|0]=a;H[c+9|0]=a>>>8;H[c+10|0]=a>>>16;H[c+11|0]=a>>>24;H[c+12|0]=b;H[c+13|0]=b>>>8;H[c+14|0]=b>>>16;H[c+15|0]=b>>>24;b=K[2294]|K[2295]<<8|(K[2296]<<16|K[2297]<<24);a=K[2290]|K[2291]<<8|(K[2292]<<16|K[2293]<<24);H[c|0]=a;H[c+1|0]=a>>>8;H[c+2|0]=a>>>16;H[c+3|0]=a>>>24;H[c+4|0]=b;H[c+5|0]=b>>>8;H[c+6|0]=b>>>16;H[c+7|0]=b>>>24;H[c+36|0]=0;return}if(lb(c,1887,5)){break a}c=om(48);J[a>>2]=c;J[a+4>>2]=43;J[a+8>>2]=-2147483600;a=K[2285]|K[2286]<<8|(K[2287]<<16|K[2288]<<24);H[c+39|0]=a;H[c+40|0]=a>>>8;H[c+41|0]=a>>>16;H[c+42|0]=a>>>24;b=K[2282]|K[2283]<<8|(K[2284]<<16|K[2285]<<24);a=K[2278]|K[2279]<<8|(K[2280]<<16|K[2281]<<24);H[c+32|0]=a;H[c+33|0]=a>>>8;H[c+34|0]=a>>>16;H[c+35|0]=a>>>24;H[c+36|0]=b;H[c+37|0]=b>>>8;H[c+38|0]=b>>>16;H[c+39|0]=b>>>24;b=K[2274]|K[2275]<<8|(K[2276]<<16|K[2277]<<24);a=K[2270]|K[2271]<<8|(K[2272]<<16|K[2273]<<24);H[c+24|0]=a;H[c+25|0]=a>>>8;H[c+26|0]=a>>>16;H[c+27|0]=a>>>24;H[c+28|0]=b;H[c+29|0]=b>>>8;H[c+30|0]=b>>>16;H[c+31|0]=b>>>24;b=K[2266]|K[2267]<<8|(K[2268]<<16|K[2269]<<24);a=K[2262]|K[2263]<<8|(K[2264]<<16|K[2265]<<24);H[c+16|0]=a;H[c+17|0]=a>>>8;H[c+18|0]=a>>>16;H[c+19|0]=a>>>24;H[c+20|0]=b;H[c+21|0]=b>>>8;H[c+22|0]=b>>>16;H[c+23|0]=b>>>24;b=K[2258]|K[2259]<<8|(K[2260]<<16|K[2261]<<24);a=K[2254]|K[2255]<<8|(K[2256]<<16|K[2257]<<24);H[c+8|0]=a;H[c+9|0]=a>>>8;H[c+10|0]=a>>>16;H[c+11|0]=a>>>24;H[c+12|0]=b;H[c+13|0]=b>>>8;H[c+14|0]=b>>>16;H[c+15|0]=b>>>24;b=K[2250]|K[2251]<<8|(K[2252]<<16|K[2253]<<24);a=K[2246]|K[2247]<<8|(K[2248]<<16|K[2249]<<24);H[c|0]=a;H[c+1|0]=a>>>8;H[c+2|0]=a>>>16;H[c+3|0]=a>>>24;H[c+4|0]=b;H[c+5|0]=b>>>8;H[c+6|0]=b>>>16;H[c+7|0]=b>>>24;H[c+43|0]=0;return;case 0:c=d?J[b>>2]:b;if((K[c|0]|K[c+1|0]<<8|(K[c+2|0]<<16|K[c+3|0]<<24))!=1953458295){break a}c=om(48);J[a>>2]=c;J[a+4>>2]=36;J[a+8>>2]=-2147483600;a=K[2359]|K[2360]<<8|(K[2361]<<16|K[2362]<<24);H[c+32|0]=a;H[c+33|0]=a>>>8;H[c+34|0]=a>>>16;H[c+35|0]=a>>>24;b=K[2355]|K[2356]<<8|(K[2357]<<16|K[2358]<<24);a=K[2351]|K[2352]<<8|(K[2353]<<16|K[2354]<<24);H[c+24|0]=a;H[c+25|0]=a>>>8;H[c+26|0]=a>>>16;H[c+27|0]=a>>>24;H[c+28|0]=b;H[c+29|0]=b>>>8;H[c+30|0]=b>>>16;H[c+31|0]=b>>>24;b=K[2347]|K[2348]<<8|(K[2349]<<16|K[2350]<<24);a=K[2343]|K[2344]<<8|(K[2345]<<16|K[2346]<<24);H[c+16|0]=a;H[c+17|0]=a>>>8;H[c+18|0]=a>>>16;H[c+19|0]=a>>>24;H[c+20|0]=b;H[c+21|0]=b>>>8;H[c+22|0]=b>>>16;H[c+23|0]=b>>>24;b=K[2339]|K[2340]<<8|(K[2341]<<16|K[2342]<<24);a=K[2335]|K[2336]<<8|(K[2337]<<16|K[2338]<<24);H[c+8|0]=a;H[c+9|0]=a>>>8;H[c+10|0]=a>>>16;H[c+11|0]=a>>>24;H[c+12|0]=b;H[c+13|0]=b>>>8;H[c+14|0]=b>>>16;H[c+15|0]=b>>>24;b=K[2331]|K[2332]<<8|(K[2333]<<16|K[2334]<<24);a=K[2327]|K[2328]<<8|(K[2329]<<16|K[2330]<<24);H[c|0]=a;H[c+1|0]=a>>>8;H[c+2|0]=a>>>16;H[c+3|0]=a>>>24;H[c+4|0]=b;H[c+5|0]=b>>>8;H[c+6|0]=b>>>16;H[c+7|0]=b>>>24;H[c+36|0]=0;return;case 3:c=d?J[b>>2]:b;if(!lb(c,1369,7)){c=om(32);J[a>>2]=c;J[a+4>>2]=27;J[a+8>>2]=-2147483616;a=K[2468]|K[2469]<<8|(K[2470]<<16|K[2471]<<24);H[c+23|0]=a;H[c+24|0]=a>>>8;H[c+25|0]=a>>>16;H[c+26|0]=a>>>24;b=K[2465]|K[2466]<<8|(K[2467]<<16|K[2468]<<24);a=K[2461]|K[2462]<<8|(K[2463]<<16|K[2464]<<24);H[c+16|0]=a;H[c+17|0]=a>>>8;H[c+18|0]=a>>>16;H[c+19|0]=a>>>24;H[c+20|0]=b;H[c+21|0]=b>>>8;H[c+22|0]=b>>>16;H[c+23|0]=b>>>24;b=K[2457]|K[2458]<<8|(K[2459]<<16|K[2460]<<24);a=K[2453]|K[2454]<<8|(K[2455]<<16|K[2456]<<24);H[c+8|0]=a;H[c+9|0]=a>>>8;H[c+10|0]=a>>>16;H[c+11|0]=a>>>24;H[c+12|0]=b;H[c+13|0]=b>>>8;H[c+14|0]=b>>>16;H[c+15|0]=b>>>24;b=K[2449]|K[2450]<<8|(K[2451]<<16|K[2452]<<24);a=K[2445]|K[2446]<<8|(K[2447]<<16|K[2448]<<24);H[c|0]=a;H[c+1|0]=a>>>8;H[c+2|0]=a>>>16;H[c+3|0]=a>>>24;H[c+4|0]=b;H[c+5|0]=b>>>8;H[c+6|0]=b>>>16;H[c+7|0]=b>>>24;H[c+27|0]=0;return}if(lb(c,1549,7)){break a}b=om(32);J[a>>2]=b;J[a+4>>2]=22;J[a+8>>2]=-2147483616;c=K[2520]|K[2521]<<8|(K[2522]<<16|K[2523]<<24);a=K[2516]|K[2517]<<8|(K[2518]<<16|K[2519]<<24);H[b+14|0]=a;H[b+15|0]=a>>>8;H[b+16|0]=a>>>16;H[b+17|0]=a>>>24;H[b+18|0]=c;H[b+19|0]=c>>>8;H[b+20|0]=c>>>16;H[b+21|0]=c>>>24;c=K[2514]|K[2515]<<8|(K[2516]<<16|K[2517]<<24);a=K[2510]|K[2511]<<8|(K[2512]<<16|K[2513]<<24);H[b+8|0]=a;H[b+9|0]=a>>>8;H[b+10|0]=a>>>16;H[b+11|0]=a>>>24;H[b+12|0]=c;H[b+13|0]=c>>>8;H[b+14|0]=c>>>16;H[b+15|0]=c>>>24;c=K[2506]|K[2507]<<8|(K[2508]<<16|K[2509]<<24);a=K[2502]|K[2503]<<8|(K[2504]<<16|K[2505]<<24);H[b|0]=a;H[b+1|0]=a>>>8;H[b+2|0]=a>>>16;H[b+3|0]=a>>>24;H[b+4|0]=c;H[b+5|0]=c>>>8;H[b+6|0]=c>>>16;H[b+7|0]=c>>>24;H[b+22|0]=0;return;case 2:break b;default:break a}}if(lb(d?J[b>>2]:b,1235,6)){break a}Aa(a,2473);return}if(Ma(b,1539)){Aa(a,2382);return}if(Ma(b,1415)){Aa(a,2364);return}Aa(a,2525)}function Qf(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;i=la-80|0;la=i;J[i+76>>2]=b;w=e-192|0;x=d-384|0;z=i+55|0;p=i+56|0;a:{b:{c:{d:while(1){f=0;e:while(1){j=b;if((o^2147483647)<(f|0)){break c}o=f+o|0;f:{g:{h:{f=b;g=K[f|0];if(g){while(1){i:{b=g&255;j:{if(!b){b=f;break j}if((b|0)!=37){break i}g=f;while(1){if(K[g+1|0]!=37){b=g;break j}f=f+1|0;h=K[g+2|0];b=g+2|0;g=b;if((h|0)==37){continue}break}}f=f-j|0;y=o^2147483647;if((f|0)>(y|0)){break c}if(a){Rf(a,j,f)}if(f){continue e}J[i+76>>2]=b;f=b+1|0;m=-1;if(!(!lf(H[b+1|0])|K[b+2|0]!=36)){m=H[b+1|0]-48|0;q=1;f=b+3|0}J[i+76>>2]=f;k=0;g=H[f|0];b=g-32|0;k:{if(b>>>0>31){h=f;break k}h=f;b=1<<b;if(!(b&75913)){break k}while(1){h=f+1|0;J[i+76>>2]=h;k=b|k;g=H[f+1|0];b=g-32|0;if(b>>>0>=32){break k}f=h;b=1<<b;if(b&75913){continue}break}}l:{if((g|0)==42){g=h+1|0;m:{if(!(!lf(H[h+1|0])|K[h+2|0]!=36)){b=H[g|0];g=h+3|0;q=1;n:{if(!a){J[(b<<2)+w>>2]=10;b=0;break n}b=J[(b<<3)+x>>2]}break m}if(q){break h}if(!a){J[i+76>>2]=g;q=0;n=0;break l}b=J[c>>2];J[c>>2]=b+4;q=0;b=J[b>>2]}n=b;J[i+76>>2]=g;if((n|0)>=0){break l}n=0-n|0;k=k|8192;break l}n=Sf(i+76|0);if((n|0)<0){break c}g=J[i+76>>2]}f=0;h=-1;o:{if(K[g|0]!=46){b=g;g=0;break o}if(K[g+1|0]==42){b=g+2|0;p:{if(!(!lf(H[g+2|0])|K[g+3|0]!=36)){h=H[b|0];b=g+4|0;q:{if(!a){J[(h<<2)+w>>2]=10;h=0;break q}h=J[(h<<3)+x>>2]}break p}if(q){break h}h=0;if(!a){break p}g=J[c>>2];J[c>>2]=g+4;h=J[g>>2]}J[i+76>>2]=b;g=(h|0)>=0;break o}J[i+76>>2]=g+1;h=Sf(i+76|0);b=J[i+76>>2];g=1}r=g;while(1){t=f;l=28;u=b;g=H[b|0];if(g-123>>>0<4294967238){break b}b=b+1|0;f=K[(g+P(f,58)|0)+5407|0];if(f-1>>>0<8){continue}break}J[i+76>>2]=b;r:{if((f|0)!=27){if(!f){break b}if((m|0)>=0){if(!a){J[(m<<2)+e>>2]=f;continue d}f=(m<<3)+d|0;g=J[f+4>>2];J[i+64>>2]=J[f>>2];J[i+68>>2]=g;break r}if(!a){break f}Tf(i- -64|0,f,c);break r}if((m|0)>=0){break b}f=0;if(!a){continue e}}l=-1;if(K[a|0]&32){break a}g=k&-65537;k=k&8192?g:k;m=0;s=1153;v=p;s:{t:{u:{v:{w:{x:{y:{z:{A:{B:{C:{D:{E:{F:{G:{H:{f=H[u|0];f=t?(f&15)==3?f&-33:f:f;switch(f-88|0){case 11:break s;case 9:case 13:case 14:case 15:break t;case 27:break y;case 12:case 17:break B;case 23:break C;case 0:case 32:break D;case 24:break E;case 22:break F;case 29:break G;case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 10:case 16:case 18:case 19:case 20:case 21:case 25:case 26:case 28:case 30:case 31:break g;default:break H}}I:{switch(f-65|0){case 0:case 4:case 5:case 6:break t;case 2:break w;case 1:case 3:break g;default:break I}}if((f|0)==83){break x}break g}j=J[i+64>>2];g=J[i+68>>2];s=1153;break A}f=0;J:{switch(t&255){case 0:J[J[i+64>>2]>>2]=o;continue e;case 1:J[J[i+64>>2]>>2]=o;continue e;case 2:j=J[i+64>>2];J[j>>2]=o;J[j+4>>2]=o>>31;continue e;case 3:I[J[i+64>>2]>>1]=o;continue e;case 4:H[J[i+64>>2]]=o;continue e;case 6:J[J[i+64>>2]>>2]=o;continue e;case 7:break J;default:continue e}}j=J[i+64>>2];J[j>>2]=o;J[j+4>>2]=o>>31;continue e}h=h>>>0<=8?8:h;k=k|8;f=120}b=p;t=f&32;j=J[i+64>>2];g=J[i+68>>2];if(j|g){while(1){b=b-1|0;H[b|0]=t|K[(j&15)+5936|0];u=!g&j>>>0>15|(g|0)!=0;j=(g&15)<<28|j>>>4;g=g>>>4|0;if(u){continue}break}}j=b;if(!(J[i+64>>2]|J[i+68>>2])|!(k&8)){break z}s=(f>>>4|0)+1153|0;m=2;break z}b=p;f=J[i+68>>2];g=f;j=J[i+64>>2];if(f|j){while(1){b=b-1|0;H[b|0]=j&7|48;l=!g&j>>>0>7|(g|0)!=0;j=(g&7)<<29|j>>>3;g=g>>>3|0;if(l){continue}break}}j=b;if(!(k&8)){break z}b=p-b|0;h=(b|0)<(h|0)?h:b+1|0;break z}j=J[i+64>>2];b=J[i+68>>2];g=b;if((b|0)<0){f=0-(b+((j|0)!=0)|0)|0;g=f;j=0-j|0;J[i+64>>2]=j;J[i+68>>2]=f;m=1;s=1153;break A}if(k&2048){m=1;s=1154;break A}m=k&1;s=m?1155:1153}j=Uf(j,g,p)}if((h|0)<0&r){break c}k=r?k&-65537:k;b=J[i+64>>2];f=J[i+68>>2];if(!(h|(b|f)!=0)){j=p;h=0;break g}b=!(b|f)+(p-j|0)|0;h=(b|0)<(h|0)?h:b;break g}b=J[i+64>>2];j=b?b:2129;f=j;b=h>>>0>=2147483647?2147483647:h;k=Hf(f,0,b);b=k?k-f|0:b;v=b+f|0;if((h|0)>=0){k=g;h=b;break g}k=g;h=b;if(K[v|0]){break c}break g}g=J[i+64>>2];if(h){break v}f=0;Vf(a,32,n,0,k);break u}J[i+12>>2]=0;J[i+8>>2]=J[i+64>>2];f=i+8|0;J[i+64>>2]=f;h=-1;g=f}f=0;K:{while(1){j=J[g>>2];if(!j){break K}j=ze(i+4|0,j);r=(j|0)<0;if(!(r|j>>>0>h-f>>>0)){g=g+4|0;f=f+j|0;if(h>>>0>f>>>0){continue}break K}break}if(r){break a}}l=61;if((f|0)<0){break b}Vf(a,32,n,f,k);if(!f){f=0;break u}h=0;g=J[i+64>>2];while(1){j=J[g>>2];if(!j){break u}l=i+4|0;j=ze(l,j);h=j+h|0;if(h>>>0>f>>>0){break u}Rf(a,l,j);g=g+4|0;if(f>>>0>h>>>0){continue}break}}Vf(a,32,n,f,k^8192);f=(f|0)<(n|0)?n:f;continue e}if((h|0)<0&r){break c}l=61;f=Wf(a,O[i+64>>3],n,h,k,f);if((f|0)>=0){continue e}break b}H[i+55|0]=J[i+64>>2];h=1;j=z;k=g;break g}g=K[f+1|0];f=f+1|0;continue}}l=o;if(a){break a}if(!q){break f}f=1;while(1){a=J[(f<<2)+e>>2];if(a){Tf((f<<3)+d|0,a,c);l=1;f=f+1|0;if((f|0)!=10){continue}break a}break}l=1;if(f>>>0>=10){break a}while(1){if(J[(f<<2)+e>>2]){break h}f=f+1|0;if((f|0)!=10){continue}break}break a}l=28;break b}g=v-j|0;h=(g|0)<(h|0)?h:g;if((h|0)>(m^2147483647)){break c}l=61;b=h+m|0;f=(b|0)<(n|0)?n:b;if((y|0)<(f|0)){break b}Vf(a,32,f,b,k);Rf(a,s,m);Vf(a,48,f,b,k^65536);Vf(a,48,h,g,0);Rf(a,j,g);Vf(a,32,f,b,k^8192);b=J[i+76>>2];continue}break}break}l=0;break a}l=61}J[4322]=l;l=-1}la=i+80|0;return l}function pf(a,b,c,d,e,f,g,h,i){var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,T=0;k=la-96|0;la=k;o=i&65535;m=(e^i)&-2147483648;r=e&65535;y=r;R=i>>>16&32767;T=e>>>16&32767;a:{b:{if(R-32767>>>0>4294934529&T-32767>>>0>=4294934530){break b}s=e&2147483647;p=s;j=d;if(!(!d&(p|0)==2147418112?!(b|c):p>>>0<2147418112)){l=d;m=e|32768;break a}s=i&2147483647;n=s;e=h;if(!(!e&(n|0)==2147418112?!(f|g):n>>>0<2147418112)){l=e;m=i|32768;b=f;c=g;break a}if(!(b|j|(p^2147418112|c))){if(!(e|f|(g|n))){m=2147450880;b=0;c=0;break a}m=m|2147418112;b=0;c=0;break a}if(!(e|f|(n^2147418112|g))){e=b|j;d=c|p;b=0;c=0;if(!(d|e)){m=2147450880;break a}m=m|2147418112;break a}if(!(b|j|(c|p))){b=0;c=0;break a}if(!(e|f|(g|n))){b=0;c=0;break a}if((p|0)==65535|p>>>0<65535){j=!(d|r);i=j?b:d;s=j<<6;e=S(i)+32|0;i=S(j?c:r);i=s+((i|0)==32?e:i)|0;mf(k+80|0,b,c,d,r,i-15|0);L=16-i|0;d=J[k+88>>2];y=J[k+92>>2];c=J[k+84>>2];b=J[k+80>>2]}if(n>>>0>65535){break b}i=!(h|o);e=i?f:h;r=i<<6;j=S(e)+32|0;e=S(i?g:o);e=r+((e|0)==32?j:e)|0;mf(k- -64|0,f,g,h,o,e-15|0);L=(L-e|0)+16|0;h=J[k+72>>2];o=J[k+76>>2];f=J[k+64>>2];g=J[k+68>>2]}e=f;f=g<<15|e>>>17;i=e<<15;e=0;u=i&-32768;M=c;s=wn(u,e,c,0);e=ma;B=e;N=f;p=b;c=wn(f,0,b,0);b=c+s|0;f=ma+e|0;i=b;c=b>>>0<c>>>0?f+1|0:f;f=b;j=0;b=wn(p,x,u,x);n=j+b|0;e=ma+f|0;e=b>>>0>n>>>0?e+1|0:e;r=e;v=(f|0)==(e|0)&j>>>0>n>>>0|e>>>0<f>>>0;O=d;z=wn(u,x,d,0);P=ma;b=wn(M,w,N,w);t=b+z|0;j=ma+P|0;j=b>>>0>t>>>0?j+1|0:j;b=o<<15|h>>>17;C=h<<15|g>>>17;d=wn(C,0,p,x);D=d+t|0;f=ma+j|0;f=d>>>0>D>>>0?f+1|0:f;E=f;e=f;d=(c|0)==(B|0)&i>>>0<s>>>0|c>>>0<B>>>0;F=c+D|0;f=d+e|0;f=c>>>0>F>>>0?f+1|0:f;i=f;g=F;c=f;G=y|65536;y=wn(u,x,G,q);Q=ma;d=wn(N,w,O,l);H=d+y|0;e=ma+Q|0;e=d>>>0>H>>>0?e+1|0:e;h=e;I=b|-2147483648;b=wn(I,0,p,x);u=b+H|0;f=ma+e|0;f=b>>>0>u>>>0?f+1|0:f;d=wn(C,l,M,w);b=d+u|0;K=f;f=f+ma|0;B=b;s=b>>>0<d>>>0?f+1|0:f;f=b;b=0;p=b+g|0;e=c+f|0;e=b>>>0>p>>>0?e+1|0:e;x=e;b=p+v|0;c=b>>>0<p>>>0?e+1|0:e;v=((T+R|0)+L|0)-16383|0;e=wn(I,A,M,w);q=ma;g=wn(N,w,G,l);d=g+e|0;f=ma+q|0;f=d>>>0<g>>>0?f+1|0:f;o=f;w=(q|0)==(f|0)&d>>>0<e>>>0|f>>>0<q>>>0;e=wn(C,l,O,l);g=e+d|0;f=ma+f|0;f=e>>>0>g>>>0?f+1|0:f;q=f;d=(o|0)==(f|0)&d>>>0>g>>>0|f>>>0<o>>>0;f=0;e=d;d=d+w|0;f=e>>>0>d>>>0?1:f;e=d;d=wn(I,A,G,l);e=e+d|0;f=ma+f|0;w=e;d=d>>>0>e>>>0?f+1|0:f;e=(j|0)==(P|0)&t>>>0<z>>>0|j>>>0<P>>>0;f=0;j=(j|0)==(E|0)&t>>>0>D>>>0|j>>>0>E>>>0;o=j;j=e+j|0;e=(o>>>0>j>>>0?1:f)+q|0;f=g+j|0;e=f>>>0<j>>>0?e+1|0:e;o=e;z=f;e=(q|0)==(e|0)&g>>>0>f>>>0|e>>>0<q>>>0;f=d;d=e+w|0;f=d>>>0<e>>>0?f+1|0:f;j=d;q=f;e=wn(C,l,G,l);t=ma;g=wn(I,A,O,l);d=g+e|0;f=ma+t|0;f=d>>>0<g>>>0?f+1|0:f;g=f;f=(t|0)==(f|0)&d>>>0<e>>>0|f>>>0<t>>>0;A=g+j|0;e=f+q|0;e=g>>>0>A>>>0?e+1|0:e;t=A;j=d;d=0;g=d+z|0;f=j+o|0;f=d>>>0>g>>>0?f+1|0:f;q=f;d=(o|0)==(f|0)&g>>>0<z>>>0|f>>>0<o>>>0;f=e;e=d;d=d+t|0;f=e>>>0>d>>>0?f+1|0:f;o=d;d=f;j=(s|0)==(K|0)&u>>>0>B>>>0|s>>>0<K>>>0;e=(h|0)==(Q|0)&y>>>0>H>>>0|h>>>0<Q>>>0;h=(h|0)==(K|0)&u>>>0<H>>>0|h>>>0>K>>>0;e=e+h|0;e=e+j|0;j=s;h=j+g|0;e=e+q|0;f=d;e=h>>>0<j>>>0?e+1|0:e;j=e;e=(q|0)==(e|0)&g>>>0>h>>>0|e>>>0<q>>>0;d=e+o|0;f=e>>>0>d>>>0?f+1|0:f;q=d;g=f;f=0;e=(i|0)==(x|0)&p>>>0<F>>>0|i>>>0>x>>>0;d=e+((i|0)==(E|0)&D>>>0>F>>>0|i>>>0<E>>>0)|0;e=(e>>>0>d>>>0?1:f)+j|0;f=g;g=d;d=d+h|0;e=g>>>0>d>>>0?e+1|0:e;h=(j|0)==(e|0)&d>>>0<h>>>0|e>>>0<j>>>0;g=h;h=h+q|0;f=g>>>0>h>>>0?f+1|0:f;i=f;c:{if(f&65536){v=v+1|0;break c}j=r>>>31|0;g=0;f=i<<1|h>>>31;h=h<<1|e>>>31;i=f;f=e<<1|d>>>31;d=d<<1|c>>>31;e=f;f=r<<1|n>>>31;n=n<<1;r=f;f=c<<1|b>>>31;b=b<<1|j;c=f|g}if((v|0)>=32767){m=m|2147418112;b=0;c=0;break a}d:{if((v|0)<=0){g=1-v|0;if(g>>>0<=127){f=v+127|0;mf(k+48|0,n,r,b,c,f);mf(k+32|0,d,e,h,i,f);of(k+16|0,n,r,b,c,g);of(k,d,e,h,i,g);n=J[k+32>>2]|J[k+16>>2]|(J[k+48>>2]|J[k+56>>2]|(J[k+52>>2]|J[k+60>>2]))!=0;r=J[k+36>>2]|J[k+20>>2];b=J[k+40>>2]|J[k+24>>2];c=J[k+44>>2]|J[k+28>>2];d=J[k>>2];e=J[k+4>>2];g=J[k+8>>2];f=J[k+12>>2];break d}b=0;c=0;break a}g=h;f=i&65535|v<<16}l=g|l;m=f|m;if(!(!b&(c|0)==-2147483648?!(n|r):(c|0)>0|(c|0)>=0)){b=d+1|0;j=b?e:e+1|0;e=m;c=j;d=!(j|b);l=d+l|0;m=d>>>0>l>>>0?e+1|0:e;break a}if(b|n|(c^-2147483648|r)){b=d;c=e;break a}b=d&1;c=b;b=b+d|0;c=c>>>0>b>>>0?e+1|0:e;d=(e|0)==(c|0)&b>>>0<d>>>0|c>>>0<e>>>0;f=m;l=d+l|0;m=l>>>0<d>>>0?f+1|0:f}J[a>>2]=b;J[a+4>>2]=c;J[a+8>>2]=l;J[a+12>>2]=m;la=k+96|0}function Oa(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;e=la-176|0;la=e;J[e+96>>2]=4100;c=J[1028];J[e+40>>2]=c;f=e+40|0;J[f+J[c-12>>2]>>2]=J[1029];c=f+J[J[e+40>>2]-12>>2]|0;d=e+44|0;oe(c,d);J[c+72>>2]=0;J[c+76>>2]=-1;J[e+96>>2]=4100;J[e+40>>2]=4080;n=Ob(d);J[n>>2]=3380;J[e+84>>2]=0;J[e+88>>2]=0;J[e+76>>2]=0;J[e+80>>2]=0;J[e+92>>2]=16;d=Na(Na(f,1050,1),1805,13);c=K[b+124|0];f=Na(Na(Na(d,c?1494:1503,c?4:5),2114,1),2233,12);c=K[b+139|0];d=c<<24>>24<0;c=Na(Na(Cc(Na(Na(Na(f,d?J[b+128>>2]:b+128|0,d?J[b+132>>2]:c),2113,2),1709,25),J[b+120>>2]),2114,1),1831,8);f=e+24|0;Pa(f,b);g=c;c=K[e+35|0];d=c<<24>>24<0;c=Na(Na(Na(g,d?J[e+24>>2]:f,d?J[e+28>>2]:c),2114,1),1735,6);f=e+12|0;Pa(f,b+40|0);g=c;c=K[e+23|0];d=c<<24>>24<0;k=Na(Na(Na(g,d?J[e+12>>2]:f,d?J[e+16>>2]:c),2114,1),1851,7);c=la-160|0;la=c;J[c+80>>2]=4100;d=J[1028];J[c+24>>2]=d;m=c+24|0;J[m+J[d-12>>2]>>2]=J[1029];d=4;f=m+J[J[c+24>>2]-12>>2]|0;h=c+28|0;oe(f,h);J[f+72>>2]=0;J[f+76>>2]=-1;J[c+80>>2]=4100;J[c+24>>2]=4080;h=Ob(h);J[h>>2]=3380;J[c+68>>2]=0;J[c+72>>2]=0;J[c+60>>2]=0;J[c+64>>2]=0;J[c+76>>2]=16;f=b+80|0;g=f+16|0;j=Na(Na(Dc(Na(Na(Dc(Na(Na(m,1050,1),1742,14),(J[f+4>>2]-J[f>>2]|0)/20|0),2114,1),1790,14),(J[g>>2]-J[f+12>>2]|0)/20|0),2114,1),1868,10);g=J[g>>2];a:{if((g|0)!=J[f+12>>2]){Qa(c+12|0,g-20|0);d=K[c+23|0];i=J[c+12>>2];break a}H[c+16|0]=0;J[c+12>>2]=1819047278;H[c+23|0]=4;i=1819047278}g=d<<24>>24<0;g=Na(Na(Na(j,g?i:c+12|0,g?J[c+16>>2]:d&255),2114,1),2198,17);b:{c:{d:{e:{switch(J[f+24>>2]){case 0:d=6;H[c+11|0]=6;J[c>>2]=K[1532]|K[1533]<<8|(K[1534]<<16|K[1535]<<24);I[c+4>>1]=K[1536]|K[1537]<<8;break b;case 1:J[c>>2]=1634300532;J[c+4>>2]=1701603182;d=8;break c;case 2:d=5;H[c+11|0]=5;J[c>>2]=K[1250]|K[1251]<<8|(K[1252]<<16|K[1253]<<24);H[c+4|0]=K[1254];break b;case 3:d=6;H[c+11|0]=6;J[c>>2]=K[1509]|K[1510]<<8|(K[1511]<<16|K[1512]<<24);I[c+4>>1]=K[1513]|K[1514]<<8;break b;case 4:J[c>>2]=1918989427;break d;case 5:J[c>>2]=1953458295;break d;default:break e}}J[c>>2]=1701736302}d=4}H[c+11|0]=d}H[c+d|0]=0;i=g;d=K[c+11|0];g=d<<24>>24<0;Na(Cc(Na(Na(Na(i,g?J[c>>2]:c,g?J[c+4>>2]:d),2113,2),1757,19),J[f+28>>2]),1048,1);if(H[c+11|0]<0){tb(J[c>>2])}if(H[c+23|0]<0){tb(J[c+12>>2])}d=c+80|0;fd(e,h);f=J[1027];J[c+24>>2]=f;J[J[f-12>>2]+(c+24|0)>>2]=J[1030];J[h>>2]=3380;if(H[c+71|0]<0){tb(J[c+60>>2])}Mb(h);ne(d);la=c+160|0;c=K[e+11|0];d=c<<24>>24<0;Na(Na(Na(k,d?J[e>>2]:e,d?J[e+4>>2]:c),2114,1),1627,8);if(H[e+11|0]<0){tb(J[e>>2])}if(H[e+23|0]<0){tb(J[e+12>>2])}if(H[e+35|0]<0){tb(J[e+24>>2])}f=J[b+140>>2];if((f|0)!=J[b+144>>2]){while(1){c=P(o,12)+f|0;f:{if(H[c+11|0]>=0){J[e+32>>2]=J[c+8>>2];d=J[c+4>>2];J[e+24>>2]=J[c>>2];J[e+28>>2]=d;break f}vm(e+24|0,J[c>>2],J[c+4>>2])}f=ym(e+24|0,0);if((f|0)!=-1){while(1){d=nb(2184);p=2184;h=la-16|0;la=h;J[h+12>>2]=1;g:{h:{c=f;l=e+24|0;g=jd(l);if(c>>>0<=g>>>0){i=g-c|0;J[h+8>>2]=i;r=h,s=J[wd(h+12|0,h+8|0)>>2],J[r+12>>2]=s;k=kd(l);j=J[h+12>>2];if((k-g|0)+j>>>0>=d>>>0){k=dd(l);j=J[h+12>>2];if(!((j|0)==(d|0)|(i|0)==(j|0))){q=i-j|0;i=c+k|0;if(d>>>0<j>>>0){break h}m=Rl(i+1|0,g+k|0,2184);j=J[h+12>>2];i:{if(!m){break i}if(i+j>>>0<=2184){p=(d-j|0)+2184|0;break i}rm(i,2184,j);i=J[h+12>>2];j=0;J[h+12>>2]=0;p=d+2184|0;d=d-i|0;c=c+i|0}i=c+k|0;rm(i+d|0,i+j|0,q)}rm(c+k|0,p,d);Ol(l,k,(d+g|0)-J[h+12>>2]|0);break g}sm(l,k,d+g-(j+k)|0,g,c,j,d,2184);break g}ce();B()}rm(i,2184,d);rm(d+i|0,i+J[h+12>>2]|0,q);Ol(l,k,(d+g|0)-J[h+12>>2]|0)}la=h+16|0;f=ym(e+24|0,f+2|0);if((f|0)!=-1){continue}break}}f=e+40|0;g=Na(f,2244,1);c=K[e+35|0];d=c<<24>>24<0;Na(Na(g,d?J[e+24>>2]:e+24|0,d?J[e+28>>2]:c),2244,1);o=o+1|0;if(o>>>0<(J[b+144>>2]-J[b+140>>2]|0)/12>>>0){Na(f,2114,1)}if(H[e+35|0]<0){tb(J[e+24>>2])}f=J[b+140>>2];if((J[b+144>>2]-f|0)/12>>>0>o>>>0){continue}break}}b=e+96|0;f=e+40|0;Na(f,1047,2);fd(a,n);a=J[1027];J[e+40>>2]=a;J[f+J[a-12>>2]>>2]=J[1030];J[n>>2]=3380;if(H[e+87|0]<0){tb(J[e+76>>2])}Mb(n);ne(b);la=e+176|0}function ab(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=la+-64|0;la=e;a:{if(J[4312]){break a}I[e+24>>1]=1;J[e+20>>2]=16843009;d=ya(om(152),e+20|0);h=J[4312];J[4312]=d;if(!h){break a}tb(Xa(h))}g=J[4312];b=b-1|0;k=b>>>0>=5?6:b;c=la-160|0;la=c;f=e+20|0;b=f;J[b+4>>2]=0;J[b+8>>2]=0;H[b|0]=0;J[b+20>>2]=0;J[b+24>>2]=0;H[b+9|0]=0;H[b+10|0]=0;H[b+11|0]=0;H[b+12|0]=0;H[b+13|0]=0;H[b+14|0]=0;H[b+15|0]=0;H[b+16|0]=0;J[b+28>>2]=0;J[b+32>>2]=0;J[b+36>>2]=0;J[b+40>>2]=0;i=b+4|0;b:{if(K[g+124|0]){wm(i,2003,21);break b}if(J[g+120>>2]){wm(i,2404,20);break b}d=J[g+28>>2];if((J[g+32>>2]-d|0)/20>>>0<=a>>>0){wm(i,1899,29);break b}h=d+P(a,20)|0;c:{if(H[h+11|0]>=0){J[c+144>>2]=J[h+8>>2];b=J[h+4>>2];J[c+136>>2]=J[h>>2];J[c+140>>2]=b;break c}vm(c+136|0,J[h>>2],J[h+4>>2])}d=d+P(a,20)|0;b=J[d+12>>2];d=J[d+16>>2];J[c+148>>2]=b;J[c+152>>2]=d;d:{e:{j=J[g+96>>2];if((j|0)==J[g+92>>2]|(b|0)==5){break e}f:{if(J[g+108>>2]>0){b=J[j-4>>2];if((b|0)==2&(d|0)==2){break e}if((b|0)!=5|(d|0)!=5){break f}if(K[g+115|0]){break e}break f}h=J[g+104>>2];if((h|0)!=6){if((b|0)!=(h|0)){break f}break e}if((b|0)==J[j-8>>2]|J[j-4>>2]==(d|0)){break e}}a=c+116|0;Fa(a,c+136|0);a=zm(a,2653);d=a+8|0;J[c+88>>2]=J[d>>2];b=J[a+4>>2];J[c+80>>2]=J[a>>2];J[c+84>>2]=b;J[a>>2]=0;J[a+4>>2]=0;J[d>>2]=0;a=Dm(c+80|0,2787);d=a+8|0;J[c+40>>2]=J[d>>2];b=J[a+4>>2];J[c+32>>2]=J[a>>2];J[c+36>>2]=b;J[a>>2]=0;J[a+4>>2]=0;J[d>>2]=0;a=J[g+96>>2];g:{if((a|0)!=J[g+92>>2]){Fa(c+104|0,a-20|0);break g}Aa(c+104|0,1521)}b=K[c+115|0];a=b<<24>>24<0;d=xm(c+32|0,a?J[c+104>>2]:c+104|0,a?J[c+108>>2]:b);b=J[d>>2];J[c+128>>2]=J[d+4>>2];a=K[d+7|0]|K[d+8|0]<<8|(K[d+9|0]<<16|K[d+10|0]<<24);H[c+131|0]=a;H[c+132|0]=a>>>8;H[c+133|0]=a>>>16;H[c+134|0]=a>>>24;J[d>>2]=0;J[d+4>>2]=0;a=K[d+11|0];J[d+8>>2]=0;if(H[f+15|0]<0){tb(J[i>>2])}J[f+4>>2]=b;J[f+8>>2]=J[c+128>>2];b=K[c+131|0]|K[c+132|0]<<8|(K[c+133|0]<<16|K[c+134|0]<<24);H[f+11|0]=b;H[f+12|0]=b>>>8;H[f+13|0]=b>>>16;H[f+14|0]=b>>>24;H[f+15|0]=a;if(H[c+115|0]<0){tb(J[c+104>>2])}if(H[c+43|0]<0){tb(J[c+32>>2])}if(H[c+91|0]<0){tb(J[c+80>>2])}if(H[c+127|0]>=0){break d}tb(J[c+116>>2]);break d}J[c+88>>2]=0;J[c+80>>2]=0;J[c+84>>2]=0;Ga(g,a,c+80|0);b=g+40|0;h:{if(H[c+147|0]>=0){J[c+16>>2]=J[c+144>>2];a=J[c+140>>2];J[c+8>>2]=J[c+136>>2];J[c+12>>2]=a;break h}vm(c+8|0,J[c+136>>2],J[c+140>>2])}a=J[c+152>>2];J[c+20>>2]=J[c+148>>2];J[c+24>>2]=a;Ha(c+32|0,g,g,b,c+8|0,k);H[f|0]=K[c+32|0];a=c+36|0;if(H[f+15|0]<0){tb(J[i>>2])}d=f+20|0;b=J[a+4>>2];J[i>>2]=J[a>>2];J[i+4>>2]=b;J[i+8>>2]=J[a+8>>2];H[c+36|0]=0;H[c+47|0]=0;H[f+16|0]=K[c+48|0];a=c+52|0;if(H[f+31|0]<0){tb(J[d>>2])}b=J[a+4>>2];J[d>>2]=J[a>>2];J[d+4>>2]=b;J[d+8>>2]=J[a+8>>2];H[c+52|0]=0;H[c+63|0]=0;d=f+32|0;i:{if(H[f+43|0]>=0){a=J[c+68>>2];J[d>>2]=J[c+64>>2];J[d+4>>2]=a;J[d+8>>2]=J[c+72>>2];H[c+75|0]=0;H[c+64|0]=0;break i}tb(J[d>>2]);b=H[c+63|0];J[d+8>>2]=J[c+72>>2];a=J[c+68>>2];J[d>>2]=J[c+64>>2];J[d+4>>2]=a;H[c+75|0]=0;H[c+64|0]=0;if((b|0)>=0){break i}tb(J[c+52>>2])}if(H[c+47|0]<0){tb(J[c+36>>2])}if(H[c+19|0]<0){tb(J[c+8>>2])}if(H[c+91|0]>=0){break d}tb(J[c+80>>2])}if(H[c+147|0]>=0){break b}tb(J[c+136>>2])}la=c+160|0;Oa(e+8|0,J[4312]);if(H[17263]<0){tb(J[4313])}a=J[e+12>>2];J[4313]=J[e+8>>2];J[4314]=a;J[4315]=J[e+16>>2];b=H[e+35|0];d=e+24|0;j:{if(H[17275]>=0){if((b|0)>=0){a=J[d+4>>2];J[4316]=J[d>>2];J[4317]=a;J[4318]=J[d+8>>2];break j}Bm(17264,J[e+24>>2],J[e+28>>2]);break j}a=(b|0)<0;Am(17264,a?J[e+24>>2]:d,a?J[e+28>>2]:b&255)}b=K[e+63|0];a=b<<24>>24;d=e+52|0;k:{l:{if(H[17287]>=0){if((a|0)>=0){a=J[d+4>>2];J[4319]=J[d>>2];J[4320]=a;J[4321]=J[d+8>>2];b=K[e+20|0];break k}Bm(17276,J[e+52>>2],J[e+56>>2]);break l}a=(a|0)<0;Am(17276,a?J[e+52>>2]:d,a?J[e+56>>2]:b)}b=K[e+20|0];if(H[e+63|0]>=0){break k}tb(J[e+52>>2])}if(H[e+51|0]<0){tb(J[e+40>>2])}if(H[e+35|0]<0){tb(J[e+24>>2])}la=e- -64|0;return b&255}function Xi(a,b,c,d,e,f,g,h,i,j,k){var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;l=la-528|0;la=l;J[l+520>>2]=k;J[l+524>>2]=b;a:{if(ic(a,l+524|0)){J[f>>2]=J[f>>2]|4;a=0;break a}J[l+76>>2]=101;k=l+76|0;q=wg(l+104|0,l+112|0,k);b=J[q>>2];J[l+100>>2]=b;J[l+96>>2]=b+400;s=Wc(k);n=Wc(l- -64|0);p=Wc(l+52|0);o=Wc(l+40|0);r=Wc(l+28|0);k=l+92|0;t=l+91|0;u=l+90|0;b=la-16|0;la=b;b:{if(c){m=b+4|0;c=dj(d);ej(m,c);d=J[b+4>>2];H[k|0]=d;H[k+1|0]=d>>>8;H[k+2|0]=d>>>16;H[k+3|0]=d>>>24;fj(m,c);_c(o,m);tm(m);sg(m,c);_c(p,m);tm(b+4|0);v=t,w=xh(c),H[v|0]=w;v=u,w=yh(c),H[v|0]=w;zh(m,c);_c(s,m);tm(b+4|0);rg(m,c);_c(n,m);tm(b+4|0);c=gj(c);break b}m=b+4|0;c=hj(d);ej(m,c);d=J[b+4>>2];H[k|0]=d;H[k+1|0]=d>>>8;H[k+2|0]=d>>>16;H[k+3|0]=d>>>24;fj(m,c);_c(o,m);tm(m);sg(m,c);_c(p,m);tm(b+4|0);v=t,w=xh(c),H[v|0]=w;v=u,w=yh(c),H[v|0]=w;zh(m,c);_c(s,m);tm(b+4|0);rg(m,c);_c(n,m);tm(b+4|0);c=gj(c)}J[l+24>>2]=c;la=b+16|0;J[j>>2]=J[i>>2];t=e&512;d=0;b=0;while(1){c=b;c:{d:{e:{f:{if((d|0)==4){break f}if(ic(a,l+524|0)){break f}k=0;g:{h:{i:{j:{k:{switch(H[(l+92|0)+d|0]){case 1:if((d|0)==3){break d}if(kc(h,1,jc(a))){Yi(l+16|0,a);Cm(r,H[l+16|0]);break j}J[f>>2]=J[f>>2]|4;a=0;break e;case 4:break g;case 2:break h;case 3:break i;case 0:break k;default:break c}}if((d|0)==3){break d}}while(1){if(ic(a,l+524|0)){break d}if(!kc(h,1,jc(a))){break d}Yi(l+16|0,a);Cm(r,H[l+16|0]);continue}}l:{if(!jd(p)){break l}if((jc(a)&255)!=K[zg(p,0)|0]){break l}lc(a);H[g|0]=0;b=jd(p)>>>0>1?p:c;break c}m:{if(!jd(o)){break m}if((jc(a)&255)!=K[zg(o,0)|0]){break m}lc(a);H[g|0]=1;b=jd(o)>>>0>1?o:c;break c}n:{if(!jd(p)){break n}if(!jd(o)){break n}J[f>>2]=J[f>>2]|4;a=0;break e}if(!jd(p)){if(!jd(o)){break d}}v=g,w=!jd(o),H[v|0]=w;break d}if(!(t|(c|d>>>0<2))){b=0;if(!((d|0)==2&K[l+95|0]!=0)){break c}}v=l,w=Bh(n),J[v+12>>2]=w;b=pe(l+16|0,l+12|0);o:{if(!d|K[(d+l|0)+91|0]>1){break o}while(1){p:{v=l,w=Ch(n),J[v+12>>2]=w;if(!Dh(b,l+12|0)){break p}if(!kc(h,1,H[J[b>>2]])){break p}Eh(b);continue}break}v=l,w=Bh(n),J[v+12>>2]=w;e=J[b>>2]-J[l+12>>2]|0;if(jd(r)>>>0>=e>>>0){v=l,w=Ch(r),J[v+12>>2]=w;e=ij(l+12|0,0-e|0);k=Ch(r);u=Bh(n);m=la-16|0;la=m;e=Sl(e);k=Sl(k);e=!lb(e,Sl(u),k-e|0);la=m+16|0;if(e){break o}}v=l,w=Bh(n),J[v+8>>2]=w;v=b,w=J[pe(l+12|0,l+8|0)>>2],J[v>>2]=w}J[l+12>>2]=J[b>>2];while(1){q:{v=l,w=Ch(n),J[v+8>>2]=w;b=l+12|0;if(!Dh(b,l+8|0)){break q}if(ic(a,l+524|0)){break q}if((jc(a)&255)!=K[J[l+12>>2]]){break q}lc(a);Eh(b);continue}break}if(!t){break d}v=l,w=Ch(n),J[v+8>>2]=w;if(!Dh(l+12|0,l+8|0)){break d}J[f>>2]=J[f>>2]|4;a=0;break e}while(1){r:{if(ic(a,l+524|0)){break r}b=jc(a);s:{if(kc(h,64,b)){e=J[j>>2];if((e|0)==J[l+520>>2]){Zi(i,j,l+520|0);e=J[j>>2]}J[j>>2]=e+1;H[e|0]=b;k=k+1|0;break s}if(!jd(s)|!k|K[l+90|0]!=(b&255)){break r}b=J[l+100>>2];if((b|0)==J[l+96>>2]){_i(q,l+100|0,l+96|0);b=J[l+100>>2]}J[l+100>>2]=b+4;J[b>>2]=k;k=0}lc(a);continue}break}b=J[l+100>>2];if(!(!k|(b|0)==J[q>>2])){if(J[l+96>>2]==(b|0)){_i(q,l+100|0,l+96|0);b=J[l+100>>2]}J[l+100>>2]=b+4;J[b>>2]=k}t:{if(J[l+24>>2]<=0){break t}u:{if(!ic(a,l+524|0)){if((jc(a)&255)==K[l+91|0]){break u}}J[f>>2]=J[f>>2]|4;a=0;break e}while(1){lc(a);if(J[l+24>>2]<=0){break t}v:{if(!ic(a,l+524|0)){if(kc(h,64,jc(a))){break v}}J[f>>2]=J[f>>2]|4;a=0;break e}if(J[j>>2]==J[l+520>>2]){Zi(i,j,l+520|0)}b=jc(a);e=J[j>>2];J[j>>2]=e+1;H[e|0]=b;J[l+24>>2]=J[l+24>>2]-1;continue}}b=c;if(J[i>>2]!=J[j>>2]){break c}J[f>>2]=J[f>>2]|4;a=0;break e}w:{if(!c){break w}k=1;while(1){if(jd(c)>>>0<=k>>>0){break w}x:{if(!ic(a,l+524|0)){if((jc(a)&255)==K[zg(c,k)|0]){break x}}J[f>>2]=J[f>>2]|4;a=0;break e}lc(a);k=k+1|0;continue}}a=1;if(J[q>>2]==J[l+100>>2]){break e}a=0;J[l+16>>2]=0;Hg(s,J[q>>2],J[l+100>>2],l+16|0);if(J[l+16>>2]){J[f>>2]=J[f>>2]|4;break e}a=1}tm(r);tm(o);tm(p);tm(n);tm(s);Bg(q);break a}b=c}d=d+1|0;continue}}la=l+528|0;return a}function mj(a,b,c,d,e,f,g,h,i,j,k){var l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;l=la-528|0;la=l;J[l+520>>2]=k;J[l+524>>2]=b;a:{if(Pc(a,l+524|0)){J[f>>2]=J[f>>2]|4;a=0;break a}J[l+72>>2]=101;k=l+72|0;q=wg(l+104|0,l+112|0,k);b=J[q>>2];J[l+100>>2]=b;J[l+96>>2]=b+400;s=Wc(k);n=Wc(l+60|0);p=Wc(l+48|0);o=Wc(l+36|0);r=Wc(l+24|0);k=l+92|0;t=l+88|0;u=l+84|0;b=la-16|0;la=b;b:{if(c){m=b+4|0;c=tj(d);ej(m,c);d=J[b+4>>2];H[k|0]=d;H[k+1|0]=d>>>8;H[k+2|0]=d>>>16;H[k+3|0]=d>>>24;fj(m,c);uj(o,m);Fm(m);sg(m,c);uj(p,m);Fm(b+4|0);v=t,w=xh(c),J[v>>2]=w;v=u,w=yh(c),J[v>>2]=w;zh(m,c);_c(s,m);tm(m);rg(m,c);uj(n,m);Fm(b+4|0);c=gj(c);break b}m=b+4|0;c=vj(d);ej(m,c);d=J[b+4>>2];H[k|0]=d;H[k+1|0]=d>>>8;H[k+2|0]=d>>>16;H[k+3|0]=d>>>24;fj(m,c);uj(o,m);Fm(m);sg(m,c);uj(p,m);Fm(b+4|0);v=t,w=xh(c),J[v>>2]=w;v=u,w=yh(c),J[v>>2]=w;zh(m,c);_c(s,m);tm(m);rg(m,c);uj(n,m);Fm(b+4|0);c=gj(c)}J[l+20>>2]=c;la=b+16|0;J[j>>2]=J[i>>2];t=e&512;d=0;b=0;while(1){c=b;c:{d:{e:{f:{if((d|0)==4){break f}if(Pc(a,l+524|0)){break f}k=0;g:{h:{i:{j:{k:{switch(H[(l+92|0)+d|0]){case 1:if((d|0)==3){break d}if(Rc(h,1,Qc(a))){nj(l+12|0,a);Gm(r,J[l+12>>2]);break j}J[f>>2]=J[f>>2]|4;a=0;break e;case 4:break g;case 2:break h;case 3:break i;case 0:break k;default:break c}}if((d|0)==3){break d}}while(1){if(Pc(a,l+524|0)){break d}if(!Rc(h,1,Qc(a))){break d}nj(l+12|0,a);Gm(r,J[l+12>>2]);continue}}l:{if(!jd(p)){break l}if((Qc(a)|0)!=J[dd(p)>>2]){break l}Sc(a);H[g|0]=0;b=jd(p)>>>0>1?p:c;break c}m:{if(!jd(o)){break m}if((Qc(a)|0)!=J[dd(o)>>2]){break m}Sc(a);H[g|0]=1;b=jd(o)>>>0>1?o:c;break c}n:{if(!jd(p)){break n}if(!jd(o)){break n}J[f>>2]=J[f>>2]|4;a=0;break e}if(!jd(p)){if(!jd(o)){break d}}v=g,w=!jd(o),H[v|0]=w;break d}if(!(t|(c|d>>>0<2))){b=0;if(!((d|0)==2&K[l+95|0]!=0)){break c}}v=l,w=Bh(n),J[v+8>>2]=w;b=pe(l+12|0,l+8|0);o:{if(!d|K[(d+l|0)+91|0]>1){break o}while(1){p:{v=l,w=Yh(n),J[v+8>>2]=w;if(!Dh(b,l+8|0)){break p}if(!Rc(h,1,J[J[b>>2]>>2])){break p}Zh(b);continue}break}v=l,w=Bh(n),J[v+8>>2]=w;e=J[b>>2]-J[l+8>>2]>>2;if(jd(r)>>>0>=e>>>0){v=l,w=Yh(r),J[v+8>>2]=w;e=wj(l+8|0,0-e|0);k=Yh(r);u=Bh(n);m=la-16|0;la=m;e=Sl(e);k=Sl(k);e=!lb(e,Sl(u),k-e&-4);la=m+16|0;if(e){break o}}v=l,w=Bh(n),J[v+4>>2]=w;v=b,w=J[pe(l+8|0,l+4|0)>>2],J[v>>2]=w}J[l+8>>2]=J[b>>2];while(1){q:{v=l,w=Yh(n),J[v+4>>2]=w;b=l+8|0;if(!Dh(b,l+4|0)){break q}if(Pc(a,l+524|0)){break q}if((Qc(a)|0)!=J[J[l+8>>2]>>2]){break q}Sc(a);Zh(b);continue}break}if(!t){break d}v=l,w=Yh(n),J[v+4>>2]=w;if(!Dh(l+8|0,l+4|0)){break d}J[f>>2]=J[f>>2]|4;a=0;break e}while(1){r:{if(Pc(a,l+524|0)){break r}b=Qc(a);s:{if(Rc(h,64,b)){e=J[j>>2];if((e|0)==J[l+520>>2]){_i(i,j,l+520|0);e=J[j>>2]}J[j>>2]=e+4;J[e>>2]=b;k=k+1|0;break s}if(!jd(s)|!k|(b|0)!=J[l+84>>2]){break r}b=J[l+100>>2];if((b|0)==J[l+96>>2]){_i(q,l+100|0,l+96|0);b=J[l+100>>2]}J[l+100>>2]=b+4;J[b>>2]=k;k=0}Sc(a);continue}break}b=J[l+100>>2];if(!(!k|(b|0)==J[q>>2])){if(J[l+96>>2]==(b|0)){_i(q,l+100|0,l+96|0);b=J[l+100>>2]}J[l+100>>2]=b+4;J[b>>2]=k}t:{if(J[l+20>>2]<=0){break t}u:{if(!Pc(a,l+524|0)){if((Qc(a)|0)==J[l+88>>2]){break u}}J[f>>2]=J[f>>2]|4;a=0;break e}while(1){Sc(a);if(J[l+20>>2]<=0){break t}v:{if(!Pc(a,l+524|0)){if(Rc(h,64,Qc(a))){break v}}J[f>>2]=J[f>>2]|4;a=0;break e}if(J[j>>2]==J[l+520>>2]){_i(i,j,l+520|0)}b=Qc(a);e=J[j>>2];J[j>>2]=e+4;J[e>>2]=b;J[l+20>>2]=J[l+20>>2]-1;continue}}b=c;if(J[i>>2]!=J[j>>2]){break c}J[f>>2]=J[f>>2]|4;a=0;break e}w:{if(!c){break w}k=1;while(1){if(jd(c)>>>0<=k>>>0){break w}x:{if(!Pc(a,l+524|0)){if((Qc(a)|0)==J[gh(c,k)>>2]){break x}}J[f>>2]=J[f>>2]|4;a=0;break e}Sc(a);k=k+1|0;continue}}a=1;if(J[q>>2]==J[l+100>>2]){break e}a=0;J[l+12>>2]=0;Hg(s,J[q>>2],J[l+100>>2],l+12|0);if(J[l+12>>2]){J[f>>2]=J[f>>2]|4;break e}a=1}Fm(r);Fm(o);Fm(p);Fm(n);tm(s);Bg(q);break a}b=c}d=d+1|0;continue}}la=l+528|0;return a}function Ji(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0;h=la-48|0;la=h;J[h+44>>2]=b;J[e>>2]=0;le(h,d);i=Oc(h);ak(h);a:{b:{c:{d:{switch(g-65|0){case 0:case 32:Di(a,f+24|0,h+44|0,c,e,i);break b;case 1:case 33:case 39:Fi(a,f+16|0,h+44|0,c,e,i);break b;case 34:b=na[J[J[a+8>>2]+12>>2]](a+8|0)|0;j=h,k=yi(a,J[h+44>>2],c,d,e,f,dd(b),dd(b)+(jd(b)<<2)|0),J[j+44>>2]=k;break b;case 35:case 36:d=f+12|0;a=Ii(h+44|0,c,e,i,2);b=J[e>>2];e:{if(!(a-1>>>0>30|b&4)){J[d>>2]=a;break e}J[e>>2]=b|4}break b;case 3:J[h+24>>2]=37;J[h+28>>2]=121;J[h+16>>2]=100;J[h+20>>2]=47;J[h+8>>2]=47;J[h+12>>2]=37;J[h>>2]=37;J[h+4>>2]=109;j=h,k=yi(a,b,c,d,e,f,h,h+32|0),J[j+44>>2]=k;break b;case 5:J[h+24>>2]=37;J[h+28>>2]=100;J[h+16>>2]=109;J[h+20>>2]=45;J[h+8>>2]=45;J[h+12>>2]=37;J[h>>2]=37;J[h+4>>2]=89;j=h,k=yi(a,b,c,d,e,f,h,h+32|0),J[j+44>>2]=k;break b;case 7:d=f+8|0;a=Ii(h+44|0,c,e,i,2);b=J[e>>2];f:{if(!((a|0)>23|b&4)){J[d>>2]=a;break f}J[e>>2]=b|4}break b;case 8:d=f+8|0;a=Ii(h+44|0,c,e,i,2);b=J[e>>2];g:{if(!(a-1>>>0>11|b&4)){J[d>>2]=a;break g}J[e>>2]=b|4}break b;case 41:d=f+28|0;a=Ii(h+44|0,c,e,i,3);b=J[e>>2];h:{if(!((a|0)>365|b&4)){J[d>>2]=a;break h}J[e>>2]=b|4}break b;case 44:b=f+16|0;c=Ii(h+44|0,c,e,i,2)-1|0;a=J[e>>2];i:{if(!(c>>>0>11|a&4)){J[b>>2]=c;break i}J[e>>2]=a|4}break b;case 12:d=f+4|0;a=Ii(h+44|0,c,e,i,2);b=J[e>>2];j:{if(!((a|0)>59|b&4)){J[d>>2]=a;break j}J[e>>2]=b|4}break b;case 45:case 51:a=h+44|0;b=la-16|0;la=b;J[b+12>>2]=c;while(1){k:{if(Pc(a,b+12|0)){break k}if(!Rc(i,1,Qc(a))){break k}Sc(a);continue}break};if(Pc(a,b+12|0)){J[e>>2]=J[e>>2]|2}la=b+16|0;break b;case 47:b=f+8|0;d=h+44|0;a=na[J[J[a+8>>2]+8>>2]](a+8|0)|0;l:{if((jd(a)|0)==(0-jd(a+12|0)|0)){J[e>>2]=J[e>>2]|4;break l}d=fh(d,c,a,a+24|0,i,e,0);c=J[b>>2];if(!((d|0)!=(a|0)|(c|0)!=12)){J[b>>2]=0;break l}if(!((d-a|0)!=12|(c|0)>11)){J[b>>2]=c+12}}break b;case 49:J[h+40>>2]=112;J[h+32>>2]=32;J[h+36>>2]=37;J[h+24>>2]=37;J[h+28>>2]=83;J[h+16>>2]=77;J[h+20>>2]=58;J[h+8>>2]=58;J[h+12>>2]=37;J[h>>2]=37;J[h+4>>2]=73;j=h,k=yi(a,b,c,d,e,f,h,h+44|0),J[j+44>>2]=k;break b;case 17:J[h+16>>2]=77;J[h+8>>2]=58;J[h+12>>2]=37;J[h>>2]=37;J[h+4>>2]=72;j=h,k=yi(a,b,c,d,e,f,h,h+20|0),J[j+44>>2]=k;break b;case 18:a=Ii(h+44|0,c,e,i,2);b=J[e>>2];m:{if(!((a|0)>60|b&4)){J[f>>2]=a;break m}J[e>>2]=b|4}break b;case 19:J[h+24>>2]=37;J[h+28>>2]=83;J[h+16>>2]=77;J[h+20>>2]=58;J[h+8>>2]=58;J[h+12>>2]=37;J[h>>2]=37;J[h+4>>2]=72;j=h,k=yi(a,b,c,d,e,f,h,h+32|0),J[j+44>>2]=k;break b;case 54:d=f+24|0;a=Ii(h+44|0,c,e,i,1);b=J[e>>2];n:{if(!((a|0)>6|b&4)){J[d>>2]=a;break n}J[e>>2]=b|4}break b;case 55:a=na[J[J[a>>2]+20>>2]](a,b,c,d,e,f)|0;break a;case 23:b=na[J[J[a+8>>2]+24>>2]](a+8|0)|0;j=h,k=yi(a,J[h+44>>2],c,d,e,f,dd(b),dd(b)+(jd(b)<<2)|0),J[j+44>>2]=k;break b;case 56:Hi(f+20|0,h+44|0,c,e,i);break b;case 24:a=f+20|0;b=Ii(h+44|0,c,e,i,4);if(!(K[e|0]&4)){J[a>>2]=b-1900}break b;default:if((g|0)==37){break c}break;case 2:case 4:case 6:case 9:case 10:case 11:case 13:case 14:case 15:case 16:case 20:case 21:case 22:case 25:case 26:case 27:case 28:case 29:case 30:case 31:case 37:case 38:case 40:case 42:case 43:case 46:case 48:case 50:case 52:case 53:break d}}J[e>>2]=J[e>>2]|4;break b}a=la-16|0;la=a;J[a+12>>2]=c;c=6;b=h+44|0;d=a+12|0;o:{p:{if(Pc(b,d)){break p}c=4;if((zi(i,Qc(b))|0)!=37){break p}c=2;if(!Pc(Sc(b),d)){break o}}J[e>>2]=J[e>>2]|c}la=a+16|0}a=J[h+44>>2]}la=h+48|0;return a|0}function xi(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0;h=la-16|0;la=h;J[h+12>>2]=b;J[e>>2]=0;le(h,d);i=hc(h);ak(h);a:{b:{c:{d:{switch(g-65|0){case 0:case 32:ri(a,f+24|0,h+12|0,c,e,i);break b;case 1:case 33:case 39:ti(a,f+16|0,h+12|0,c,e,i);break b;case 34:b=na[J[J[a+8>>2]+12>>2]](a+8|0)|0;j=h,k=li(a,J[h+12>>2],c,d,e,f,dd(b),dd(b)+jd(b)|0),J[j+12>>2]=k;break b;case 35:case 36:d=f+12|0;a=wi(h+12|0,c,e,i,2);b=J[e>>2];e:{if(!(a-1>>>0>30|b&4)){J[d>>2]=a;break e}J[e>>2]=b|4}break b;case 3:H[h|0]=37;H[h+1|0]=109;H[h+2|0]=47;H[h+3|0]=37;H[h+4|0]=100;H[h+5|0]=47;H[h+6|0]=37;H[h+7|0]=121;j=h,k=li(a,b,c,d,e,f,h,h+8|0),J[j+12>>2]=k;break b;case 5:H[h|0]=37;H[h+1|0]=89;H[h+2|0]=45;H[h+3|0]=37;H[h+4|0]=109;H[h+5|0]=45;H[h+6|0]=37;H[h+7|0]=100;j=h,k=li(a,b,c,d,e,f,h,h+8|0),J[j+12>>2]=k;break b;case 7:d=f+8|0;a=wi(h+12|0,c,e,i,2);b=J[e>>2];f:{if(!((a|0)>23|b&4)){J[d>>2]=a;break f}J[e>>2]=b|4}break b;case 8:d=f+8|0;a=wi(h+12|0,c,e,i,2);b=J[e>>2];g:{if(!(a-1>>>0>11|b&4)){J[d>>2]=a;break g}J[e>>2]=b|4}break b;case 41:d=f+28|0;a=wi(h+12|0,c,e,i,3);b=J[e>>2];h:{if(!((a|0)>365|b&4)){J[d>>2]=a;break h}J[e>>2]=b|4}break b;case 44:b=f+16|0;c=wi(h+12|0,c,e,i,2)-1|0;a=J[e>>2];i:{if(!(c>>>0>11|a&4)){J[b>>2]=c;break i}J[e>>2]=a|4}break b;case 12:d=f+4|0;a=wi(h+12|0,c,e,i,2);b=J[e>>2];j:{if(!((a|0)>59|b&4)){J[d>>2]=a;break j}J[e>>2]=b|4}break b;case 45:case 51:a=h+12|0;b=la-16|0;la=b;J[b+12>>2]=c;while(1){k:{if(ic(a,b+12|0)){break k}if(!kc(i,1,jc(a))){break k}lc(a);continue}break};if(ic(a,b+12|0)){J[e>>2]=J[e>>2]|2}la=b+16|0;break b;case 47:b=f+8|0;d=h+12|0;a=na[J[J[a+8>>2]+8>>2]](a+8|0)|0;l:{if((jd(a)|0)==(0-jd(a+12|0)|0)){J[e>>2]=J[e>>2]|4;break l}d=tg(d,c,a,a+24|0,i,e,0);c=J[b>>2];if(!((d|0)!=(a|0)|(c|0)!=12)){J[b>>2]=0;break l}if(!((d-a|0)!=12|(c|0)>11)){J[b>>2]=c+12}}break b;case 49:H[h+10|0]=112;H[h+8|0]=32;H[h+9|0]=37;H[h|0]=37;H[h+1|0]=73;H[h+2|0]=58;H[h+3|0]=37;H[h+4|0]=77;H[h+5|0]=58;H[h+6|0]=37;H[h+7|0]=83;j=h,k=li(a,b,c,d,e,f,h,h+11|0),J[j+12>>2]=k;break b;case 17:H[h+4|0]=77;H[h|0]=37;H[h+1|0]=72;H[h+2|0]=58;H[h+3|0]=37;j=h,k=li(a,b,c,d,e,f,h,h+5|0),J[j+12>>2]=k;break b;case 18:a=wi(h+12|0,c,e,i,2);b=J[e>>2];m:{if(!((a|0)>60|b&4)){J[f>>2]=a;break m}J[e>>2]=b|4}break b;case 19:H[h|0]=37;H[h+1|0]=72;H[h+2|0]=58;H[h+3|0]=37;H[h+4|0]=77;H[h+5|0]=58;H[h+6|0]=37;H[h+7|0]=83;j=h,k=li(a,b,c,d,e,f,h,h+8|0),J[j+12>>2]=k;break b;case 54:d=f+24|0;a=wi(h+12|0,c,e,i,1);b=J[e>>2];n:{if(!((a|0)>6|b&4)){J[d>>2]=a;break n}J[e>>2]=b|4}break b;case 55:a=na[J[J[a>>2]+20>>2]](a,b,c,d,e,f)|0;break a;case 23:b=na[J[J[a+8>>2]+24>>2]](a+8|0)|0;j=h,k=li(a,J[h+12>>2],c,d,e,f,dd(b),dd(b)+jd(b)|0),J[j+12>>2]=k;break b;case 56:vi(f+20|0,h+12|0,c,e,i);break b;case 24:a=f+20|0;b=wi(h+12|0,c,e,i,4);if(!(K[e|0]&4)){J[a>>2]=b-1900}break b;default:if((g|0)==37){break c}break;case 2:case 4:case 6:case 9:case 10:case 11:case 13:case 14:case 15:case 16:case 20:case 21:case 22:case 25:case 26:case 27:case 28:case 29:case 30:case 31:case 37:case 38:case 40:case 42:case 43:case 46:case 48:case 50:case 52:case 53:break d}}J[e>>2]=J[e>>2]|4;break b}a=la-16|0;la=a;J[a+12>>2]=c;c=6;b=h+12|0;d=a+12|0;o:{p:{if(ic(b,d)){break p}c=4;if((mi(i,jc(b))|0)!=37){break p}c=2;if(!ic(lc(b),d)){break o}}J[e>>2]=J[e>>2]|c}la=a+16|0}a=J[h+12>>2]}la=h+16|0;return a|0}function qf(a,b,c,d,e,f,g,h,i){var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;j=la-112|0;la=j;l=i&2147483647;a:{b:{m=e&2147483647;o=2147418112;n=!(b|c);if(!(d|m?m-o>>>0<2147549184:n)){k=l-o|0;if(!h&(k|0)==-2147418112?f|g:(k|0)==-2147418112&(h|0)!=0|k>>>0>2147549184){break b}}if(!(!d&(m|0)==2147418112?n:m>>>0<2147418112)){h=d;i=e|32768;f=b;g=c;break a}if(!(!h&(l|0)==2147418112?!(f|g):l>>>0<2147418112)){i=i|32768;break a}if(!(b|d|(m^2147418112|c))){k=d;d=!(b^f|d^h|(c^g|e^i^-2147483648));h=d?0:k;i=d?2147450880:e;f=d?0:b;g=d?0:c;break a}o=f|h;if(!(o|(l^2147418112|g))){break a}if(!(b|d|(c|m))){if(g|l|o){break a}f=b&f;g=c&g;h=d&h;i=e&i;break a}if(f|h|(g|l)){break b}f=b;g=c;h=d;i=e;break a}o=(l|0)==(m|0);q=o&(d|0)==(h|0)?(c|0)==(g|0)&b>>>0<f>>>0|c>>>0<g>>>0:o&d>>>0<h>>>0|l>>>0>m>>>0;k=q;m=k?f:b;r=k?g:c;n=k?i:e;s=n;k=k?h:d;n=n&65535;d=q?d:h;e=q?e:i;t=e;p=e>>>16&32767;o=s>>>16&32767;if(!o){e=!(k|n);i=e;l=e?m:k;e=e<<6;i=S(i?r:n);e=e+((i|0)==32?S(l)+32|0:i)|0;mf(j+96|0,m,r,k,n,e-15|0);o=16-e|0;r=J[j+100>>2];k=J[j+104>>2];n=J[j+108>>2];m=J[j+96>>2]}f=q?b:f;g=q?c:g;h=d;i=t&65535;if(!p){b=!(d|i);e=b;l=e?f:d;b=e<<6;e=S(e?g:i);b=b+((e|0)==32?S(l)+32|0:e)|0;mf(j+80|0,f,g,d,i,b-15|0);p=16-b|0;h=J[j+88>>2];i=J[j+92>>2];g=J[j+84>>2];f=J[j+80>>2]}b=h<<3|g>>>29;c=i<<3|h>>>29|524288;h=k<<3|r>>>29;e=n<<3|k>>>29;k=f<<3;n=g<<3|f>>>29;f=s^t;c:{if((o|0)==(p|0)){break c}d=o-p|0;if(d>>>0>127){b=0;c=0;k=1;n=0;break c}mf(j- -64|0,k,n,b,c,128-d|0);of(j+48|0,k,n,b,c,d);k=J[j+48>>2]|(J[j+64>>2]|J[j+72>>2]|(J[j+68>>2]|J[j+76>>2]))!=0;n=J[j+52>>2];b=J[j+56>>2];c=J[j+60>>2]}p=h;q=e|524288;e=r<<3|m>>>29;m=m<<3;l=e;d:{if((f|0)<0){f=0;g=0;h=0;i=0;if(!(k^m|b^p|(e^n|c^q))){break a}d=m-k|0;e=e-((k>>>0>m>>>0)+n|0)|0;f=p-b|0;g=(l|0)==(n|0)&k>>>0>m>>>0|l>>>0<n>>>0;h=f-g|0;b=(q-((b>>>0>p>>>0)+c|0)|0)-(f>>>0<g>>>0)|0;i=b;if(b>>>0>524287){break d}c=!(b|h);g=c;i=c?d:h;c=c<<6;g=S(g?e:b);c=c+((g|0)==32?S(i)+32|0:g)|0;f=b;b=c-12|0;mf(j+32|0,d,e,h,f,b);o=o-b|0;h=J[j+40>>2];i=J[j+44>>2];d=J[j+32>>2];e=J[j+36>>2];break d}e=l+n|0;d=k+m|0;e=d>>>0<m>>>0?e+1|0:e;f=(n|0)==(e|0)&d>>>0<k>>>0|e>>>0<n>>>0;l=c+q|0;b=b+p|0;l=b>>>0<p>>>0?l+1|0:l;h=b+f|0;i=h>>>0<b>>>0?l+1|0:l;if(!(i&1048576)){break d}d=k&1|((e&1)<<31|d>>>1);e=h<<31|e>>>1;o=o+1|0;h=(i&1)<<31|h>>>1;i=i>>>1|0}f=0;b=s&-2147483648;k=b;if((o|0)>=32767){h=f;i=b|2147418112;g=0;break a}b=0;e:{if((o|0)>0){b=o;break e}mf(j+16|0,d,e,h,i,o+127|0);of(j,d,e,h,i,1-o|0);d=J[j>>2]|(J[j+16>>2]|J[j+24>>2]|(J[j+20>>2]|J[j+28>>2]))!=0;e=J[j+4>>2];h=J[j+8>>2];i=J[j+12>>2]}m=(e&7)<<29|d>>>3;c=h<<29|e>>>3;e=(i&7)<<29|h>>>3;h=i>>>3&65535;l=e|f;i=k|(b<<16|h);e=c;b=d&7;d=b>>>0>4;f=d+m|0;e=d>>>0>f>>>0?e+1|0:e;c=(c|0)==(e|0)&f>>>0<m>>>0|c>>>0>e>>>0;h=c+l|0;i=c>>>0>h>>>0?i+1|0:i;f:{g:{if((b|0)!=4){g=e;break g}b=0;g=e+b|0;e=i;d=f;c=f&1;f=f+c|0;g=d>>>0>f>>>0?g+1|0:g;b=(b|0)==(g|0)&c>>>0>f>>>0|b>>>0>g>>>0;h=b+h|0;i=b>>>0>h>>>0?e+1|0:e;break f}if(!b){break a}}}J[a>>2]=f;J[a+4>>2]=g;J[a+8>>2]=h;J[a+12>>2]=i;la=j+112|0}function bb(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;c=la+-64|0;la=c;d=J[4312];if(d){b=la+-64|0;la=b;e=c+20|0;a=e;J[a+4>>2]=0;J[a+8>>2]=0;H[a|0]=0;J[a+20>>2]=0;J[a+24>>2]=0;H[a+9|0]=0;H[a+10|0]=0;H[a+11|0]=0;H[a+12|0]=0;H[a+13|0]=0;H[a+14|0]=0;H[a+15|0]=0;H[a+16|0]=0;J[a+28>>2]=0;J[a+32>>2]=0;J[a+36>>2]=0;J[a+40>>2]=0;i=a+4|0;a:{if(K[d+124|0]){wm(i,2003,21);break a}if(J[d+120>>2]){wm(i,2404,20);break a}f=d+108|0;a=J[f>>2];J[f>>2]=0;l=(a|0)<=1?1:a;m=d+28|0;n=d+80|0;f=0;while(1){Ca(b+40|0,n);j=K[b+51|0];a=j<<24>>24;h=(a|0)<0;k=J[b+44>>2];if(h?k:j){a=J[d+32>>2];b:{if((a|0)!=J[d+36>>2]){c:{if(!h){h=J[b+44>>2];J[a>>2]=J[b+40>>2];J[a+4>>2]=h;J[a+8>>2]=J[b+48>>2];break c}vm(a,J[b+40>>2],k)}h=J[b+56>>2];J[a+12>>2]=J[b+52>>2];J[a+16>>2]=h;J[d+32>>2]=a+20;break b}Da(m,b+40|0)}g=g+1|0;a=K[b+51|0]}if(a<<24>>24<0){tb(J[b+40>>2])}f=f+1|0;if((l|0)!=(f|0)){continue}break}a=b+12|0;Im(a,g);a=zm(a,2752);f=a+8|0;J[b+32>>2]=J[f>>2];h=J[a+4>>2];J[b+24>>2]=J[a>>2];J[b+28>>2]=h;J[a>>2]=0;J[a+4>>2]=0;J[f>>2]=0;a=Dm(b+24|0,2069);f=a+8|0;J[b+48>>2]=J[f>>2];h=J[a+4>>2];J[b+40>>2]=J[a>>2];J[b+44>>2]=h;J[a>>2]=0;J[a+4>>2]=0;J[f>>2]=0;Ea(d,b+40|0);if(H[b+51|0]<0){tb(J[b+40>>2])}if(H[b+35|0]<0){tb(J[b+24>>2])}if(H[b+23|0]<0){tb(J[b+12>>2])}H[e|0]=1;a=b+24|0;Im(a,g);a=zm(a,2781);g=a+8|0;J[b+48>>2]=J[g>>2];f=J[a+4>>2];J[b+40>>2]=J[a>>2];J[b+44>>2]=f;J[a>>2]=0;J[a+4>>2]=0;J[g>>2]=0;a=Dm(b+40|0,1965);f=J[a>>2];J[b+12>>2]=J[a+4>>2];g=K[a+7|0]|K[a+8|0]<<8|(K[a+9|0]<<16|K[a+10|0]<<24);H[b+15|0]=g;H[b+16|0]=g>>>8;H[b+17|0]=g>>>16;H[b+18|0]=g>>>24;J[a>>2]=0;J[a+4>>2]=0;g=K[a+11|0];J[a+8>>2]=0;if(H[e+15|0]<0){tb(J[i>>2])}J[e+4>>2]=f;J[e+8>>2]=J[b+12>>2];a=K[b+15|0]|K[b+16|0]<<8|(K[b+17|0]<<16|K[b+18|0]<<24);H[e+11|0]=a;H[e+12|0]=a>>>8;H[e+13|0]=a>>>16;H[e+14|0]=a>>>24;H[e+15|0]=g;if(H[b+51|0]<0){tb(J[b+40>>2])}if(H[b+35|0]<0){tb(J[b+24>>2])}J[d+120>>2]=1;if(!K[d+117|0]|J[d+80>>2]!=J[d+84>>2]){break a}Ja(d);H[e+16|0]=K[d+124|0];i=d+128|0;a=e+20|0;if((i|0)==(a|0)){break a}f=K[d+139|0];g=f<<24>>24;if(H[e+31|0]>=0){if((g|0)>=0){d=J[i+4>>2];J[a>>2]=J[i>>2];J[a+4>>2]=d;J[a+8>>2]=J[i+8>>2];break a}Bm(a,J[d+128>>2],J[d+132>>2]);break a}e=a;a=(g|0)<0;Am(e,a?J[d+128>>2]:i,a?J[d+132>>2]:f)}la=b- -64|0;Oa(c+8|0,J[4312]);if(H[17263]<0){tb(J[4313])}a=J[c+12>>2];J[4313]=J[c+8>>2];J[4314]=a;J[4315]=J[c+16>>2];b=H[c+35|0];a=c+24|0;d:{if(H[17275]>=0){if((b|0)>=0){b=J[a+4>>2];J[4316]=J[a>>2];J[4317]=b;J[4318]=J[a+8>>2];break d}Bm(17264,J[c+24>>2],J[c+28>>2]);break d}e=a;a=(b|0)<0;Am(17264,a?J[c+24>>2]:e,a?J[c+28>>2]:b&255)}d=K[c+63|0];b=d<<24>>24;a=c+52|0;e:{f:{if(H[17287]>=0){if((b|0)>=0){b=J[a+4>>2];J[4319]=J[a>>2];J[4320]=b;J[4321]=J[a+8>>2];a=K[c+20|0];break e}Bm(17276,J[c+52>>2],J[c+56>>2]);break f}e=a;a=(b|0)<0;Am(17276,a?J[c+52>>2]:e,a?J[c+56>>2]:d)}a=K[c+20|0];if(H[c+63|0]>=0){break e}tb(J[c+52>>2])}if(H[c+51|0]<0){tb(J[c+40>>2])}if(H[c+35|0]<0){tb(J[c+24>>2])}}la=c- -64|0;return a|0}function tb(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;a:{if(!a){break a}d=a-8|0;b=J[a-4>>2];a=b&-8;f=d+a|0;b:{if(b&1){break b}if(!(b&3)){break a}b=J[d>>2];d=d-b|0;if(d>>>0<M[4328]){break a}a=a+b|0;c:{d:{if(J[4329]!=(d|0)){if(b>>>0<=255){e=b>>>3|0;b=J[d+12>>2];c=J[d+8>>2];if((b|0)==(c|0)){i=17296,j=J[4324]&yn(e),J[i>>2]=j;break b}J[c+12>>2]=b;J[b+8>>2]=c;break b}h=J[d+24>>2];b=J[d+12>>2];if((b|0)!=(d|0)){c=J[d+8>>2];J[c+12>>2]=b;J[b+8>>2]=c;break c}e=d+20|0;c=J[e>>2];if(!c){c=J[d+16>>2];if(!c){break d}e=d+16|0}while(1){g=e;b=c;e=b+20|0;c=J[e>>2];if(c){continue}e=b+16|0;c=J[b+16>>2];if(c){continue}break}J[g>>2]=0;break c}b=J[f+4>>2];if((b&3)!=3){break b}J[4326]=a;J[f+4>>2]=b&-2;J[d+4>>2]=a|1;J[f>>2]=a;return}b=0}if(!h){break b}c=J[d+28>>2];e=(c<<2)+17600|0;e:{if(J[e>>2]==(d|0)){J[e>>2]=b;if(b){break e}i=17300,j=J[4325]&yn(c),J[i>>2]=j;break b}J[h+(J[h+16>>2]==(d|0)?16:20)>>2]=b;if(!b){break b}}J[b+24>>2]=h;c=J[d+16>>2];if(c){J[b+16>>2]=c;J[c+24>>2]=b}c=J[d+20>>2];if(!c){break b}J[b+20>>2]=c;J[c+24>>2]=b}if(d>>>0>=f>>>0){break a}b=J[f+4>>2];if(!(b&1)){break a}f:{g:{h:{i:{if(!(b&2)){if((f|0)==J[4330]){J[4330]=d;a=J[4327]+a|0;J[4327]=a;J[d+4>>2]=a|1;if(J[4329]!=(d|0)){break a}J[4326]=0;J[4329]=0;return}if((f|0)==J[4329]){J[4329]=d;a=J[4326]+a|0;J[4326]=a;J[d+4>>2]=a|1;J[a+d>>2]=a;return}a=(b&-8)+a|0;if(b>>>0<=255){e=b>>>3|0;b=J[f+12>>2];c=J[f+8>>2];if((b|0)==(c|0)){i=17296,j=J[4324]&yn(e),J[i>>2]=j;break g}J[c+12>>2]=b;J[b+8>>2]=c;break g}h=J[f+24>>2];b=J[f+12>>2];if((f|0)!=(b|0)){c=J[f+8>>2];J[c+12>>2]=b;J[b+8>>2]=c;break h}e=f+20|0;c=J[e>>2];if(!c){c=J[f+16>>2];if(!c){break i}e=f+16|0}while(1){g=e;b=c;e=b+20|0;c=J[e>>2];if(c){continue}e=b+16|0;c=J[b+16>>2];if(c){continue}break}J[g>>2]=0;break h}J[f+4>>2]=b&-2;J[d+4>>2]=a|1;J[a+d>>2]=a;break f}b=0}if(!h){break g}c=J[f+28>>2];e=(c<<2)+17600|0;j:{if((f|0)==J[e>>2]){J[e>>2]=b;if(b){break j}i=17300,j=J[4325]&yn(c),J[i>>2]=j;break g}J[h+((f|0)==J[h+16>>2]?16:20)>>2]=b;if(!b){break g}}J[b+24>>2]=h;c=J[f+16>>2];if(c){J[b+16>>2]=c;J[c+24>>2]=b}c=J[f+20>>2];if(!c){break g}J[b+20>>2]=c;J[c+24>>2]=b}J[d+4>>2]=a|1;J[a+d>>2]=a;if(J[4329]!=(d|0)){break f}J[4326]=a;return}if(a>>>0<=255){b=(a&-8)+17336|0;c=J[4324];a=1<<(a>>>3);k:{if(!(c&a)){J[4324]=a|c;a=b;break k}a=J[b+8>>2]}J[b+8>>2]=d;J[a+12>>2]=d;J[d+12>>2]=b;J[d+8>>2]=a;return}c=31;if(a>>>0<=16777215){b=S(a>>>8|0);c=((a>>>38-b&1)-(b<<1)|0)+62|0}J[d+28>>2]=c;J[d+16>>2]=0;J[d+20>>2]=0;b=(c<<2)+17600|0;l:{m:{e=J[4325];g=1<<c;n:{if(!(e&g)){J[4325]=e|g;J[b>>2]=d;J[d+24>>2]=b;break n}c=a<<((c|0)!=31?25-(c>>>1|0)|0:0);b=J[b>>2];while(1){e=b;if((J[b+4>>2]&-8)==(a|0)){break m}g=c>>>29|0;c=c<<1;g=(b+(g&4)|0)+16|0;b=J[g>>2];if(b){continue}break}J[g>>2]=d;J[d+24>>2]=e}J[d+12>>2]=d;J[d+8>>2]=d;break l}a=J[e+8>>2];J[a+12>>2]=d;J[e+8>>2]=d;J[d+24>>2]=0;J[d+12>>2]=e;J[d+8>>2]=a}a=J[4332]-1|0;J[4332]=a?a:-1}}function vb(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;f=a+b|0;c=J[a+4>>2];a:{b:{if(c&1){break b}if(!(c&3)){break a}c=J[a>>2];b=c+b|0;c:{d:{e:{a=a-c|0;if((a|0)!=J[4329]){if(c>>>0<=255){d=J[a+8>>2];e=J[a+12>>2];if((d|0)!=(e|0)){break e}i=17296,j=J[4324]&yn(c>>>3|0),J[i>>2]=j;break b}h=J[a+24>>2];c=J[a+12>>2];if((c|0)!=(a|0)){d=J[a+8>>2];J[d+12>>2]=c;J[c+8>>2]=d;break c}e=a+20|0;d=J[e>>2];if(!d){d=J[a+16>>2];if(!d){break d}e=a+16|0}while(1){g=e;c=d;e=c+20|0;d=J[e>>2];if(d){continue}e=c+16|0;d=J[c+16>>2];if(d){continue}break}J[g>>2]=0;break c}c=J[f+4>>2];if((c&3)!=3){break b}J[4326]=b;J[f+4>>2]=c&-2;J[a+4>>2]=b|1;J[f>>2]=b;return}J[d+12>>2]=e;J[e+8>>2]=d;break b}c=0}if(!h){break b}d=J[a+28>>2];e=(d<<2)+17600|0;f:{if(J[e>>2]==(a|0)){J[e>>2]=c;if(c){break f}i=17300,j=J[4325]&yn(d),J[i>>2]=j;break b}J[h+(J[h+16>>2]==(a|0)?16:20)>>2]=c;if(!c){break b}}J[c+24>>2]=h;d=J[a+16>>2];if(d){J[c+16>>2]=d;J[d+24>>2]=c}d=J[a+20>>2];if(!d){break b}J[c+20>>2]=d;J[d+24>>2]=c}g:{h:{i:{j:{c=J[f+4>>2];if(!(c&2)){if((f|0)==J[4330]){J[4330]=a;b=J[4327]+b|0;J[4327]=b;J[a+4>>2]=b|1;if(J[4329]!=(a|0)){break a}J[4326]=0;J[4329]=0;return}if((f|0)==J[4329]){J[4329]=a;b=J[4326]+b|0;J[4326]=b;J[a+4>>2]=b|1;J[a+b>>2]=b;return}b=(c&-8)+b|0;if(c>>>0<=255){e=c>>>3|0;c=J[f+12>>2];d=J[f+8>>2];if((c|0)==(d|0)){i=17296,j=J[4324]&yn(e),J[i>>2]=j;break h}J[d+12>>2]=c;J[c+8>>2]=d;break h}h=J[f+24>>2];c=J[f+12>>2];if((f|0)!=(c|0)){d=J[f+8>>2];J[d+12>>2]=c;J[c+8>>2]=d;break i}e=f+20|0;d=J[e>>2];if(!d){d=J[f+16>>2];if(!d){break j}e=f+16|0}while(1){g=e;c=d;e=c+20|0;d=J[e>>2];if(d){continue}e=c+16|0;d=J[c+16>>2];if(d){continue}break}J[g>>2]=0;break i}J[f+4>>2]=c&-2;J[a+4>>2]=b|1;J[a+b>>2]=b;break g}c=0}if(!h){break h}d=J[f+28>>2];e=(d<<2)+17600|0;k:{if((f|0)==J[e>>2]){J[e>>2]=c;if(c){break k}i=17300,j=J[4325]&yn(d),J[i>>2]=j;break h}J[h+((f|0)==J[h+16>>2]?16:20)>>2]=c;if(!c){break h}}J[c+24>>2]=h;d=J[f+16>>2];if(d){J[c+16>>2]=d;J[d+24>>2]=c}d=J[f+20>>2];if(!d){break h}J[c+20>>2]=d;J[d+24>>2]=c}J[a+4>>2]=b|1;J[a+b>>2]=b;if(J[4329]!=(a|0)){break g}J[4326]=b;return}if(b>>>0<=255){c=(b&-8)+17336|0;d=J[4324];b=1<<(b>>>3);l:{if(!(d&b)){J[4324]=b|d;b=c;break l}b=J[c+8>>2]}J[c+8>>2]=a;J[b+12>>2]=a;J[a+12>>2]=c;J[a+8>>2]=b;return}d=31;if(b>>>0<=16777215){c=S(b>>>8|0);d=((b>>>38-c&1)-(c<<1)|0)+62|0}J[a+28>>2]=d;J[a+16>>2]=0;J[a+20>>2]=0;c=(d<<2)+17600|0;m:{e=J[4325];g=1<<d;n:{if(!(e&g)){J[4325]=e|g;J[c>>2]=a;J[a+24>>2]=c;break n}d=b<<((d|0)!=31?25-(d>>>1|0)|0:0);c=J[c>>2];while(1){e=c;if((J[c+4>>2]&-8)==(b|0)){break m}g=d>>>29|0;d=d<<1;g=(c+(g&4)|0)+16|0;c=J[g>>2];if(c){continue}break}J[g>>2]=a;J[a+24>>2]=e}J[a+12>>2]=a;J[a+8>>2]=a;return}b=J[e+8>>2];J[b+12>>2]=a;J[e+8>>2]=a;J[a+24>>2]=0;J[a+12>>2]=e;J[a+8>>2]=b}}function Ca(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;a:{d=J[b+4>>2];c=J[b>>2];if((d|0)==(c|0)){if(K[b+37|0]){break a}e=la+-64|0;la=e;b:{c:{c=J[b+16>>2];d:{if((c-J[b+12>>2]|0)/20>>>0<2){break d}d=c-20|0;e:{if(H[c-9|0]>=0){J[e+32>>2]=J[d+8>>2];f=J[d+4>>2];J[e+24>>2]=J[d>>2];J[e+28>>2]=f;d=c;break e}vm(e+24|0,J[d>>2],J[c-16>>2]);d=J[b+16>>2]}c=c-8|0;f=J[c+4>>2];J[e+36>>2]=J[c>>2];J[e+40>>2]=f;f=d-20|0;if(H[d-9|0]<0){tb(J[f>>2])}J[b+16>>2]=f;J[e+20>>2]=0;J[e+12>>2]=0;J[e+16>>2]=0;d=J[b+12>>2];g=f-d|0;c=(g|0)/20|0;f:{if((d|0)==(f|0)){break f}if(c>>>0>=214748365){break c}g=om(g);J[e+16>>2]=g;J[e+12>>2]=g;J[e+20>>2]=g+P(c,20);c=g;while(1){g:{if(H[d+11|0]>=0){h=J[d+4>>2];J[c>>2]=J[d>>2];J[c+4>>2]=h;J[c+8>>2]=J[d+8>>2];break g}vm(c,J[d>>2],J[d+4>>2])}h=J[d+16>>2];J[c+12>>2]=J[d+12>>2];J[c+16>>2]=h;c=c+20|0;d=d+20|0;if((f|0)!=(d|0)){continue}break}J[e+16>>2]=g+P((c-g|0)/20|0,20);c=J[b+16>>2];f=J[b+12>>2];if((c|0)==(f|0)){break f}while(1){d=c-20|0;if(H[c-9|0]<0){tb(J[d>>2])}c=d;if((c|0)!=(f|0)){continue}break}}J[b+16>>2]=f;h:{if(J[b+20>>2]!=(f|0)){i:{if(H[e+35|0]>=0){c=J[e+28>>2];J[f>>2]=J[e+24>>2];J[f+4>>2]=c;J[f+8>>2]=J[e+32>>2];break i}vm(f,J[e+24>>2],J[e+28>>2])}c=J[e+40>>2];J[f+12>>2]=J[e+36>>2];J[f+16>>2]=c;J[b+16>>2]=f+20;break h}Da(b+12|0,e+24|0)}c=(pb()>>>0)%2147483647|0;J[e+8>>2]=c>>>0<=1?1:c;c=J[e+16>>2];d=J[e+12>>2];f=c-d|0;j:{if((f|0)<21){break j}J[e+56>>2]=0;J[e+60>>2]=2147483647;h=c-20|0;if(h>>>0<=d>>>0){break j}f=(f>>>0)/20|0;while(1){J[e+48>>2]=0;f=f-1|0;J[e+52>>2]=f;g=Sa(e+8|0,e+48|0);if(g){i=J[d>>2];J[e+48>>2]=J[d+4>>2];c=K[d+7|0]|K[d+8|0]<<8|(K[d+9|0]<<16|K[d+10|0]<<24);H[e+51|0]=c;H[e+52|0]=c>>>8;H[e+53|0]=c>>>16;H[e+54|0]=c>>>24;c=P(g,20)+d|0;g=J[c+4>>2];J[d>>2]=J[c>>2];J[d+4>>2]=g;j=K[d+11|0];J[d+8>>2]=J[c+8>>2];k=J[d+12>>2];l=J[d+16>>2];g=J[c+16>>2];J[d+12>>2]=J[c+12>>2];J[d+16>>2]=g;J[c>>2]=i;J[c+4>>2]=J[e+48>>2];g=K[e+51|0]|K[e+52|0]<<8|(K[e+53|0]<<16|K[e+54|0]<<24);H[c+7|0]=g;H[c+8|0]=g>>>8;H[c+9|0]=g>>>16;H[c+10|0]=g>>>24;J[c+12>>2]=k;J[c+16>>2]=l;H[c+11|0]=j}d=d+20|0;if(h>>>0>d>>>0){continue}break}d=J[e+12>>2]}if((e+12|0)!=(b|0)){c=J[e+16>>2];Ta(b,d,c,(c-d|0)/20|0);d=J[e+12>>2]}if(d){c=d;f=J[e+16>>2];if((c|0)!=(f|0)){while(1){c=f-20|0;if(H[f-9|0]<0){tb(J[c>>2])}f=c;if((c|0)!=(d|0)){continue}break}c=J[e+12>>2]}J[e+16>>2]=d;tb(c)}if(H[e+35|0]>=0){break d}tb(J[e+24>>2])}la=e- -64|0;break b}Ra();B()}d=J[b+4>>2];c=J[b>>2]}if((c|0)==(d|0)){break a}c=d-20|0;k:{if(H[d-9|0]>=0){f=J[c+4>>2];J[a>>2]=J[c>>2];J[a+4>>2]=f;J[a+8>>2]=J[c+8>>2];c=d;break k}vm(a,J[c>>2],J[d-16>>2]);c=J[b+4>>2]}d=d-8|0;f=J[d+4>>2];J[a+12>>2]=J[d>>2];J[a+16>>2]=f;a=c-20|0;if(H[c-9|0]<0){tb(J[a>>2])}J[b+4>>2]=a;return}J[a+12>>2]=6;J[a+16>>2]=0;H[a|0]=0;H[a+11|0]=0}function _j(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0;f=a;if(K[21368]){a=J[5341]}else{if(K[21356]){a=J[5338]}else{a=Mj(22984);J[a>>2]=9100;c=la-16|0;la=c;b=a+8|0;J[b>>2]=0;J[b+4>>2]=0;J[c+12>>2]=0;h=Vl(b+8|0),i=0,H[h+128|0]=i;Nj(c+4|0,b);H[c+10|0]=0;d=la-16|0;la=d;if(Wl(b)>>>0<30){ce();B()}Yl(d+8|0,Xl(b),30);e=J[d+8>>2];J[b+4>>2]=e;J[b>>2]=e;g=J[d+12>>2];h=Zl(b),i=(g<<2)+e|0,J[h>>2]=i;_l(b,0);la=d+16|0;Oj(b,30);H[c+10|0]=1;la=c+16|0;ke(a+152|0,1707);Pj(b);Qj(b);Rj(b);h=Mj(22656),i=11684,J[h>>2]=i;Tj(a,22656,Sj(21180));h=Mj(22664),i=11716,J[h>>2]=i;Tj(a,22664,Sj(21188));b=Mj(22672);H[b+12|0]=0;J[b+8>>2]=0;J[b>>2]=9120;J[b+8>>2]=9168;Tj(a,22672,Sj(21384));h=Mj(22688),i=10632,J[h>>2]=i;Tj(a,22688,Sj(21376));h=Mj(22696),i=10780,J[h>>2]=i;Tj(a,22696,Sj(21392));b=Mj(22704);J[b>>2]=10200;h=b,i=_g(),J[h+8>>2]=i;Tj(a,22704,Sj(21400));h=Mj(22720),i=10928,J[h>>2]=i;Tj(a,22720,Sj(21408));h=Mj(22728),i=11160,J[h>>2]=i;Tj(a,22728,Sj(21424));h=Mj(22736),i=11044,J[h>>2]=i;Tj(a,22736,Sj(21416));h=Mj(22744),i=11276,J[h>>2]=i;Tj(a,22744,Sj(21432));b=Mj(22752);I[b+8>>1]=11310;J[b>>2]=10248;Wc(b+12|0);Tj(a,22752,Sj(21440));b=Mj(22776);J[b+8>>2]=46;J[b+12>>2]=44;J[b>>2]=10288;Wc(b+16|0);Tj(a,22776,Sj(21448));h=Mj(22808),i=11748,J[h>>2]=i;Tj(a,22808,Sj(21196));h=Mj(22816),i=11992,J[h>>2]=i;Tj(a,22816,Sj(21204));h=Mj(22824),i=12204,J[h>>2]=i;Tj(a,22824,Sj(21212));h=Mj(22832),i=12436,J[h>>2]=i;Tj(a,22832,Sj(21220));h=Mj(22840),i=13420,J[h>>2]=i;Tj(a,22840,Sj(21260));h=Mj(22848),i=13568,J[h>>2]=i;Tj(a,22848,Sj(21268));h=Mj(22856),i=13684,J[h>>2]=i;Tj(a,22856,Sj(21276));h=Mj(22864),i=13800,J[h>>2]=i;Tj(a,22864,Sj(21284));h=Mj(22872),i=13916,J[h>>2]=i;Tj(a,22872,Sj(21292));h=Mj(22880),i=14080,J[h>>2]=i;Tj(a,22880,Sj(21300));h=Mj(22888),i=14244,J[h>>2]=i;Tj(a,22888,Sj(21308));h=Mj(22896),i=14408,J[h>>2]=i;Tj(a,22896,Sj(21316));b=Mj(22904);c=b+8|0;J[c>>2]=15664;J[b>>2]=12636;J[c>>2]=12684;Tj(a,22904,Sj(21228));b=Mj(22920);c=b+8|0;J[c>>2]=15700;J[b>>2]=12900;J[c>>2]=12948;Tj(a,22920,Sj(21236));b=Mj(22936);km(b+8|0);J[b>>2]=13136;Tj(a,22936,Sj(21244));b=Mj(22952);km(b+8|0);J[b>>2]=13292;Tj(a,22952,Sj(21252));h=Mj(22968),i=14572,J[h>>2]=i;Tj(a,22968,Sj(21324));h=Mj(22976),i=14692,J[h>>2]=i;Tj(a,22976,Sj(21332));J[5337]=22984;H[21356]=1;J[5338]=21348;a=21348}$j(21360,a);H[21368]=1;J[5341]=21360;a=21360}a=J[a>>2];J[f>>2]=a;Vj(a)}function Fa(a,b){var c=0,d=0,e=0,f=0;c=la-112|0;la=c;d=J[b+12>>2];a:{if((d|0)==5){H[c+100|0]=0;J[c+96>>2]=-1852727312;H[c+107|0]=4;b=zm(c+96|0,2837);d=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=d;d=a;a=b+8|0;J[d+8>>2]=J[a>>2];J[b>>2]=0;J[b+4>>2]=0;J[a>>2]=0;if(H[c+107|0]>=0){break a}tb(J[c+96>>2]);break a}b:{c:{d:{e:{switch(d|0){case 0:d=6;H[c+43|0]=6;J[c+32>>2]=K[1532]|K[1533]<<8|(K[1534]<<16|K[1535]<<24);I[c+36>>1]=K[1536]|K[1537]<<8;break b;case 1:J[c+32>>2]=1634300532;J[c+36>>2]=1701603182;d=8;break c;case 2:d=5;H[c+43|0]=5;J[c+32>>2]=K[1250]|K[1251]<<8|(K[1252]<<16|K[1253]<<24);H[c+36|0]=K[1254];break b;case 3:d=6;H[c+43|0]=6;J[c+32>>2]=K[1509]|K[1510]<<8|(K[1511]<<16|K[1512]<<24);I[c+36>>1]=K[1513]|K[1514]<<8;break b;case 4:J[c+32>>2]=1918989427;break d;default:break e}}J[c+32>>2]=1701736302}d=4}H[c+43|0]=d}f=d;d=c+32|0;H[f+d|0]=0;d=Dm(d,2881);e=d+8|0;J[c+56>>2]=J[e>>2];f=J[d+4>>2];J[c+48>>2]=J[d>>2];J[c+52>>2]=f;J[d>>2]=0;J[d+4>>2]=0;J[e>>2]=0;d=c+20|0;Im(d,J[b+16>>2]);f=d;d=K[c+31|0];e=d<<24>>24<0;d=xm(c+48|0,e?J[c+20>>2]:f,e?J[c+24>>2]:d);e=d+8|0;J[c+72>>2]=J[e>>2];f=J[d+4>>2];J[c+64>>2]=J[d>>2];J[c+68>>2]=f;J[d>>2]=0;J[d+4>>2]=0;J[e>>2]=0;d=Dm(c- -64|0,2181);e=d+8|0;J[c+88>>2]=J[e>>2];f=J[d+4>>2];J[c+80>>2]=J[d>>2];J[c+84>>2]=f;J[d>>2]=0;J[d+4>>2]=0;J[e>>2]=0;f:{g:{h:{switch(J[b+12>>2]){case 0:b=3;H[c+19|0]=3;I[c+8>>1]=K[1036]|K[1037]<<8;H[c+10|0]=K[1038];break f;case 1:b=3;H[c+19|0]=3;I[c+8>>1]=K[1024]|K[1025]<<8;H[c+10|0]=K[1026];break f;case 2:b=3;H[c+19|0]=3;I[c+8>>1]=K[1032]|K[1033]<<8;H[c+10|0]=K[1034];break f;case 3:b=3;H[c+19|0]=3;I[c+8>>1]=K[1028]|K[1029]<<8;H[c+10|0]=K[1030];break f;case 4:b=3;H[c+19|0]=3;I[c+8>>1]=K[1040]|K[1041]<<8;H[c+10|0]=K[1042];break f;case 5:J[c+8>>2]=-1852727312;b=4;break g;default:break h}}H[c+8|0]=63;b=1}H[c+19|0]=b}d=c+8|0;H[d+b|0]=0;b=xm(c+80|0,d,b);d=b+8|0;J[c+104>>2]=J[d>>2];e=J[b+4>>2];J[c+96>>2]=J[b>>2];J[c+100>>2]=e;J[b>>2]=0;J[b+4>>2]=0;J[d>>2]=0;b=Dm(c+96|0,2179);d=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=d;d=a;a=b+8|0;J[d+8>>2]=J[a>>2];J[b>>2]=0;J[b+4>>2]=0;J[a>>2]=0;if(H[c+107|0]<0){tb(J[c+96>>2])}if(H[c+19|0]<0){tb(J[c+8>>2])}if(H[c+91|0]<0){tb(J[c+80>>2])}if(H[c+75|0]<0){tb(J[c+64>>2])}if(H[c+31|0]<0){tb(J[c+20>>2])}if(H[c+59|0]<0){tb(J[c+48>>2])}if(H[c+43|0]>=0){break a}tb(J[c+32>>2])}la=c+112|0}function Bf(a,b,c,d,e,f,g,h,i){var j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;j=la-128|0;la=j;a:{b:{c:{if(!sf(f,g,h,i,0,0,0,0)){break c}k=i&65535;n=i>>>16&32767;d:{e:{if((n|0)!=32767){l=4;if(n){break e}l=f|h|(g|k)?3:2;break d}l=!(f|h|(g|k))}}s=e>>>16|0;o=s&32767;if((o|0)==32767){break c}if(l){break b}}pf(j+16|0,b,c,d,e,f,g,h,i);b=J[j+16>>2];d=J[j+20>>2];e=J[j+24>>2];c=J[j+28>>2];Af(j,b,d,e,c,b,d,e,c);d=J[j+8>>2];e=J[j+12>>2];h=J[j>>2];i=J[j+4>>2];break a}l=d;p=e&2147483647;k=p;n=h;m=i&2147483647;if((sf(b,c,l,k,f,g,h,m)|0)<=0){if(sf(b,c,l,k,f,g,h,m)){h=b;i=c;break a}pf(j+112|0,b,c,d,e,0,0,0,0);d=J[j+120>>2];e=J[j+124>>2];h=J[j+112>>2];i=J[j+116>>2];break a}q=i>>>16&32767;if(o){i=c;h=b}else{pf(j+96|0,b,c,l,p,0,0,0,1081540608);l=J[j+104>>2];h=J[j+108>>2];p=h;o=(h>>>16|0)-120|0;i=J[j+100>>2];h=J[j+96>>2]}if(!q){pf(j+80|0,f,g,n,m,0,0,0,1081540608);n=J[j+88>>2];f=J[j+92>>2];m=f;q=(f>>>16|0)-120|0;g=J[j+84>>2];f=J[j+80>>2]}r=n;t=m&65535|65536;p=p&65535|65536;if((o|0)>(q|0)){while(1){m=l-r|0;k=(g|0)==(i|0)&f>>>0>h>>>0|g>>>0>i>>>0;n=m-k|0;k=(p-((l>>>0<r>>>0)+t|0)|0)-(k>>>0>m>>>0)|0;f:{if((k|0)>=0|(k|0)>0){l=h;h=h-f|0;i=i-((f>>>0>l>>>0)+g|0)|0;if(!(h|n|(i|k))){pf(j+32|0,b,c,d,e,0,0,0,0);d=J[j+40>>2];e=J[j+44>>2];h=J[j+32>>2];i=J[j+36>>2];break a}k=k<<1|n>>>31;l=n<<1|i>>>31;break f}k=p<<1|l>>>31;l=l<<1|i>>>31}p=k;k=i<<1|h>>>31;h=h<<1;i=k;o=o-1|0;if((q|0)<(o|0)){continue}break}o=q}m=l-r|0;k=(g|0)==(i|0)&f>>>0>h>>>0|g>>>0>i>>>0;n=m-k|0;k=(p-((l>>>0<r>>>0)+t|0)|0)-(k>>>0>m>>>0)|0;m=k;g:{if((k|0)<0){n=l;m=p;break g}l=h;h=h-f|0;i=i-((f>>>0>l>>>0)+g|0)|0;if(h|n|(i|m)){break g}pf(j+48|0,b,c,d,e,0,0,0,0);d=J[j+56>>2];e=J[j+60>>2];h=J[j+48>>2];i=J[j+52>>2];break a}if((m|0)==65535|m>>>0<65535){while(1){b=i>>>31|0;o=o-1|0;p=i<<1|h>>>31;h=h<<1;i=p;c=b;b=m<<1|n>>>31;n=c|n<<1;m=b;if(b>>>0<65536){continue}break}}b=s&32768;if((o|0)<=0){pf(j- -64|0,h,i,n,m&65535|(b|o+120)<<16,0,0,0,1065811968);d=J[j+72>>2];e=J[j+76>>2];h=J[j+64>>2];i=J[j+68>>2];break a}d=n;e=m&65535|(b|o)<<16}J[a>>2]=h;J[a+4>>2]=i;J[a+8>>2]=d;J[a+12>>2]=e;la=j+128|0}function Ta(a,b,c,d){var e=0,f=0,g=0;e=J[a+8>>2];f=J[a>>2];if((e-f|0)/20>>>0>=d>>>0){e=d;g=J[a+4>>2];d=(g-f|0)/20|0;if(e>>>0>d>>>0){e=P(d,20)+b|0;if((f|0)!=(g|0)){while(1){a:{if((b|0)==(f|0)){break a}g=K[b+11|0];d=g<<24>>24;if(H[f+11|0]>=0){if((d|0)>=0){d=J[b+4>>2];J[f>>2]=J[b>>2];J[f+4>>2]=d;J[f+8>>2]=J[b+8>>2];break a}Bm(f,J[b>>2],J[b+4>>2]);break a}d=(d|0)<0;Am(f,d?J[b>>2]:b,d?J[b+4>>2]:g)}d=J[b+16>>2];J[f+12>>2]=J[b+12>>2];J[f+16>>2]=d;f=f+20|0;b=b+20|0;if((e|0)!=(b|0)){continue}break}f=J[a+4>>2]}b=f;if((c|0)!=(e|0)){while(1){b:{if(H[e+11|0]>=0){d=J[e+4>>2];J[b>>2]=J[e>>2];J[b+4>>2]=d;J[b+8>>2]=J[e+8>>2];break b}vm(b,J[e>>2],J[e+4>>2])}d=J[e+16>>2];J[b+12>>2]=J[e+12>>2];J[b+16>>2]=d;b=b+20|0;e=e+20|0;if((e|0)!=(c|0)){continue}break}}J[a+4>>2]=P((b-f|0)/20|0,20)+f;return}c:{if((b|0)==(c|0)){e=f;break c}e=f;while(1){d:{if((b|0)==(e|0)){break d}g=K[b+11|0];d=g<<24>>24;if(H[e+11|0]>=0){if((d|0)>=0){d=J[b+4>>2];J[e>>2]=J[b>>2];J[e+4>>2]=d;J[e+8>>2]=J[b+8>>2];break d}Bm(e,J[b>>2],J[b+4>>2]);break d}d=(d|0)<0;Am(e,d?J[b>>2]:b,d?J[b+4>>2]:g)}d=J[b+16>>2];J[e+12>>2]=J[b+12>>2];J[e+16>>2]=d;e=e+20|0;b=b+20|0;if((c|0)!=(b|0)){continue}break}g=J[a+4>>2]}c=P((e-f|0)/20|0,20)+f|0;if((c|0)!=(g|0)){while(1){b=g-20|0;if(H[g-9|0]<0){tb(J[b>>2])}g=b;if((b|0)!=(c|0)){continue}break}}J[a+4>>2]=c;return}if(f){e=f;g=J[a+4>>2];if((f|0)!=(g|0)){while(1){e=g-20|0;if(H[g-9|0]<0){tb(J[e>>2])}g=e;if((e|0)!=(f|0)){continue}break}e=J[a>>2]}J[a+4>>2]=f;tb(e);J[a+8>>2]=0;J[a>>2]=0;J[a+4>>2]=0;e=0}e:{if(d>>>0>=214748365){break e}f=(e|0)/20|0;e=f<<1;d=f>>>0>=107374182?214748364:d>>>0<e>>>0?e:d;if(d>>>0>=214748365){break e}f=P(d,20);d=om(f);J[a+4>>2]=d;J[a>>2]=d;J[a+8>>2]=d+f;f=d;if((b|0)!=(c|0)){while(1){f:{if(H[b+11|0]>=0){e=J[b+4>>2];J[f>>2]=J[b>>2];J[f+4>>2]=e;J[f+8>>2]=J[b+8>>2];break f}vm(f,J[b>>2],J[b+4>>2])}e=J[b+16>>2];J[f+12>>2]=J[b+12>>2];J[f+16>>2]=e;f=f+20|0;b=b+20|0;if((c|0)!=(b|0)){continue}break}}J[a+4>>2]=d+P((f-d|0)/20|0,20);return}Ra();B()}function cg(a,b,c,d){var e=0,f=0,g=0,h=0,i=0;e=J[b>>2];a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{k:{l:{if(!d){break l}g=J[d>>2];if(!g){break l}if(!a){d=c;break j}J[d>>2]=0;d=c;break k}m:{if(!J[J[5008]>>2]){if(!a){break m}if(!c){break a}g=c;while(1){d=H[e|0];if(d){J[a>>2]=d&57343;a=a+4|0;e=e+1|0;g=g-1|0;if(g){continue}break a}break}J[a>>2]=0;J[b>>2]=0;return c-g|0}d=c;if(!a){break i}break g}return nb(e)}f=1;break g}f=0;break h}f=1}while(1){if(!f){f=K[e|0]>>>3|0;if((f-16|f+(g>>26))>>>0>7){break f}f=e+1|0;n:{if(!(g&33554432)){break n}if((K[f|0]&192)!=128){e=e-1|0;break d}f=e+2|0;if(!(g&524288)){break n}if((K[f|0]&192)!=128){e=e-1|0;break d}f=e+3|0}e=f;d=d-1|0;f=1;continue}while(1){g=K[e|0];o:{if(e&3|g-1>>>0>126){break o}g=J[e>>2];if((g|g-16843009)&-2139062144){break o}while(1){d=d-4|0;g=J[e+4>>2];e=e+4|0;if(!((g-16843009|g)&-2139062144)){continue}break}}f=g&255;if(f-1>>>0<=126){d=d-1|0;e=e+1|0;continue}break}f=f-194|0;if(f>>>0>50){break e}e=e+1|0;g=J[(f<<2)+4416>>2];f=0;continue}}while(1){if(!f){if(!d){break a}while(1){p:{f=K[e|0];h=f-1|0;q:{r:{if(h>>>0>126){g=f;break r}if(e&3|d>>>0<5){break q}s:{while(1){g=J[e>>2];if((g|g-16843009)&-2139062144){break s}J[a>>2]=g&255;J[a+4>>2]=K[e+1|0];J[a+8>>2]=K[e+2|0];J[a+12>>2]=K[e+3|0];a=a+16|0;e=e+4|0;d=d-4|0;if(d>>>0>4){continue}break}g=K[e|0]}f=g&255;h=f-1|0}if(h>>>0>126){break p}}J[a>>2]=f;a=a+4|0;e=e+1|0;d=d-1|0;if(d){continue}break a}break}f=f-194|0;if(f>>>0>50){break e}e=e+1|0;g=J[(f<<2)+4416>>2];f=1;continue}i=K[e|0];f=i>>>3|0;if((f-16|f+(g>>26))>>>0>7){break f}t:{u:{h=e+1|0;f=i-128|g<<6;v:{if((f|0)>=0){break v}i=K[h|0]-128|0;if(i>>>0>63){break u}h=e+2|0;f=i|f<<6;if((f|0)>=0){break v}h=K[h|0]-128|0;if(h>>>0>63){break u}f=h|f<<6;h=e+3|0}e=h;J[a>>2]=f;d=d-1|0;a=a+4|0;break t}J[4322]=25;e=e-1|0;break c}f=0;continue}}e=e-1|0;if(g){break d}g=K[e|0]}if(g&255){break d}if(a){J[a>>2]=0;J[b>>2]=0}return c-d|0}J[4322]=25;if(!a){break b}}J[b>>2]=e}return-1}J[b>>2]=e;return c}function Tj(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;m=la-16|0;la=m;Vj(b);d=la-16|0;la=d;J[d+12>>2]=b;b=pe(m+12|0,d+12|0);la=d+16|0;f=a+8|0;if(Pj(f)>>>0<=c>>>0){a:{d=c+1|0;a=Pj(f);if(d>>>0>a>>>0){n=la-32|0;la=n;g=d-a|0;b:{if(g>>>0<=J[Zl(f)>>2]-J[f+4>>2]>>2>>>0){Oj(f,g);break b}h=Xl(f);d=n+12|0;a=Pj(f)+g|0;i=la-16|0;la=i;J[i+12>>2]=a;c:{e=Wl(f);if(a>>>0<=e>>>0){a=$l(f);if(a>>>0<e>>>1>>>0){J[i+8>>2]=a<<1;e=J[qd(i+8|0,i+12|0)>>2]}la=i+16|0;a=e;break c}ce();B()}i=Pj(f);e=0;k=la-16|0;la=k;J[k+12>>2]=0;Nj(Vl(d+12|0)+4|0,h);if(a){Yl(k+4|0,em(d),a);e=J[k+4>>2];h=J[k+8>>2]}else{h=0}J[d>>2]=e;a=(i<<2)+e|0;J[d+8>>2]=a;J[d+4>>2]=a;p=fm(d),q=(h<<2)+e|0,J[p>>2]=q;la=k+16|0;h=la-16|0;la=h;e=d+8|0;i=J[e>>2];a=h+4|0;J[a+8>>2]=e;J[a>>2]=i;J[a+4>>2]=i+(g<<2);e=J[a>>2];while(1){if(J[a+4>>2]!=(e|0)){em(d);am(J[a>>2]);e=J[a>>2]+4|0;J[a>>2]=e;continue}break}J[J[a+8>>2]>>2]=J[a>>2];la=h+16|0;l=la-16|0;la=l;cm(f);Xl(f);g=Nj(l+8|0,J[f+4>>2]);a=Nj(l+4|0,J[f>>2]);e=Nj(l,J[d+4>>2]);a=J[a>>2];h=J[e>>2];k=la-16|0;la=k;i=k+8|0;j=la-32|0;la=j;e=la-16|0;la=e;J[e+12>>2]=J[g>>2];J[e+8>>2]=a;Nd(j+24|0,e+12|0,e+8|0);la=e+16|0;e=j+16|0;a=J[j+24>>2];g=la-16|0;la=g;J[g+8>>2]=J[j+28>>2];J[g+12>>2]=a;J[g+4>>2]=h;while(1){if(J[g+12>>2]!=J[g+8>>2]){h=g+12|0;a=J[hm(h)>>2];o=g+4|0;p=hm(o),q=a,J[p>>2]=q;im(h);im(o);continue}break}Md(e,g+12|0,g+4|0);la=g+16|0;J[j+12>>2]=J[j+16>>2];J[j+8>>2]=J[j+20>>2];Md(i,j+12|0,j+8|0);la=j+32|0;la=k+16|0;J[l+12>>2]=J[k+12>>2];J[d+4>>2]=J[l+12>>2];ed(f,d+4|0);ed(f+4|0,d+8|0);ed(Zl(f),fm(d));J[d>>2]=J[d+4>>2];_l(f,Pj(f));la=l+16|0;a=J[d+4>>2];while(1){if((a|0)!=J[d+8>>2]){em(d);J[d+8>>2]=J[d+8>>2]-4;continue}break}if(J[d>>2]){dm(em(d),J[d>>2],J[fm(d)>>2]-J[d>>2]>>2)}}la=n+32|0;break a}if(a>>>0>d>>>0){d=J[f>>2]+(d<<2)|0;Pj(f);bm(f,d);Rj(f)}}}if(J[Uj(f,c)>>2]){Wj(J[Uj(f,c)>>2])}a=jj(b);p=Uj(f,c),q=a,J[p>>2]=q;a=J[b>>2];J[b>>2]=0;if(a){Wj(a)}la=m+16|0}function ub(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;if(!a){return sb(b)}if(b>>>0>=4294967232){J[4322]=48;return 0}g=b>>>0<11?16:b+11&-8;e=a-8|0;i=J[e+4>>2];d=i&-8;a:{if(!(i&3)){if(g>>>0<256){break a}if(d>>>0>=g+4>>>0){c=e;if(d-g>>>0<=J[4444]<<1>>>0){break a}}c=0;break a}h=d+e|0;b:{if(d>>>0>=g>>>0){c=d-g|0;if(c>>>0<16){break b}J[e+4>>2]=g|i&1|2;d=e+g|0;J[d+4>>2]=c|3;J[h+4>>2]=J[h+4>>2]|1;vb(d,c);break b}if(J[4330]==(h|0)){d=d+J[4327]|0;if(d>>>0<=g>>>0){break a}J[e+4>>2]=g|i&1|2;c=e+g|0;d=d-g|0;J[c+4>>2]=d|1;J[4327]=d;J[4330]=c;break b}if(J[4329]==(h|0)){d=d+J[4326]|0;if(d>>>0<g>>>0){break a}c=d-g|0;c:{if(c>>>0>=16){J[e+4>>2]=g|i&1|2;f=e+g|0;J[f+4>>2]=c|1;d=d+e|0;J[d>>2]=c;J[d+4>>2]=J[d+4>>2]&-2;break c}J[e+4>>2]=d|i&1|2;c=d+e|0;J[c+4>>2]=J[c+4>>2]|1;c=0}J[4329]=f;J[4326]=c;break b}f=J[h+4>>2];if(f&2){break a}j=d+(f&-8)|0;if(g>>>0>j>>>0){break a}l=j-g|0;d:{if(f>>>0<=255){f=f>>>3|0;c=J[h+12>>2];d=J[h+8>>2];if((c|0)==(d|0)){n=17296,o=J[4324]&yn(f),J[n>>2]=o;break d}J[d+12>>2]=c;J[c+8>>2]=d;break d}k=J[h+24>>2];d=J[h+12>>2];e:{if((d|0)!=(h|0)){c=J[h+8>>2];J[c+12>>2]=d;J[d+8>>2]=c;break e}f:{c=h+20|0;f=J[c>>2];if(!f){f=J[h+16>>2];if(!f){break f}c=h+16|0}while(1){m=c;d=f;c=d+20|0;f=J[c>>2];if(f){continue}c=d+16|0;f=J[d+16>>2];if(f){continue}break}J[m>>2]=0;break e}d=0}if(!k){break d}c=J[h+28>>2];f=(c<<2)+17600|0;g:{if(J[f>>2]==(h|0)){J[f>>2]=d;if(d){break g}n=17300,o=J[4325]&yn(c),J[n>>2]=o;break d}J[(J[k+16>>2]==(h|0)?16:20)+k>>2]=d;if(!d){break d}}J[d+24>>2]=k;c=J[h+16>>2];if(c){J[d+16>>2]=c;J[c+24>>2]=d}c=J[h+20>>2];if(!c){break d}J[d+20>>2]=c;J[c+24>>2]=d}if(l>>>0<=15){J[e+4>>2]=i&1|j|2;c=e+j|0;J[c+4>>2]=J[c+4>>2]|1;break b}J[e+4>>2]=g|i&1|2;c=e+g|0;J[c+4>>2]=l|3;d=e+j|0;J[d+4>>2]=J[d+4>>2]|1;vb(c,l)}c=e}if(c){return c+8|0}c=sb(b);if(!c){return 0}e=J[a-4>>2];e=(e&3?-4:-8)+(e&-8)|0;ib(c,a,b>>>0>e>>>0?e:b);tb(a);return c}function Fk(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;q=la-16|0;la=q;i=c;while(1){a:{if((d|0)==(i|0)){i=d;break a}if(!K[i|0]){break a}i=i+1|0;continue}break}J[h>>2]=f;J[e>>2]=c;while(1){b:{c:{d:{if((c|0)==(d|0)|(f|0)==(g|0)){break d}j=J[b+4>>2];J[q+8>>2]=J[b>>2];J[q+12>>2]=j;r=la-16|0;la=r;J[r+12>>2]=J[a+8>>2];u=bh(r+8|0,r+12|0);o=i-c|0;j=0;m=la-1040|0;la=m;n=J[e>>2];J[m+12>>2]=n;p=f?f:m+16|0;l=f?g-f>>2:256;e:{f:{g:{if(!(!n|!l)){while(1){k=o>>>2|0;if(!(o>>>0>131|k>>>0>=l>>>0)){k=n;break f}s=cg(p,m+12|0,k>>>0<l>>>0?k:l,b);k=J[m+12>>2];if((s|0)==-1){l=0;j=-1;break g}t=(m+16|0)!=(p|0)?s:0;l=l-t|0;p=(t<<2)+p|0;o=k?(n+o|0)-k|0:0;j=j+s|0;if(!k){break g}n=k;if(l){continue}break}break g}k=n}if(!k){break e}}if(!l|!o){break e}n=j;while(1){h:{j=we(p,k,o,b);i:{if(j+2>>>0<=2){j:{switch(j+1|0){case 1:J[m+12>>2]=0;break i;case 0:break e;default:break j}}J[b>>2]=0;break i}k=J[m+12>>2]+j|0;J[m+12>>2]=k;n=n+1|0;l=l-1|0;if(l){break h}}j=n;break e}p=p+4|0;o=o-j|0;j=n;if(o){continue}break}}if(f){J[e>>2]=J[m+12>>2]}la=m+1040|0;ch(u);la=r+16|0;k:{l:{m:{n:{if((j|0)==-1){while(1){o:{J[h>>2]=f;if(J[e>>2]==(c|0)){break o}g=1;p:{q:{r:{b=Gk(f,c,i-c|0,q+8|0,J[a+8>>2]);switch(b+2|0){case 0:break l;case 2:break p;case 1:break r;default:break q}}J[e>>2]=c;break n}g=b}c=c+g|0;f=J[h>>2]+4|0;continue}break}J[e>>2]=c;break d}f=J[h>>2]+(j<<2)|0;J[h>>2]=f;if((f|0)==(g|0)){break k}c=J[e>>2];if((d|0)==(i|0)){i=d;continue}if(!Gk(f,c,1,b,J[a+8>>2])){break m}}a=2;break c}J[h>>2]=J[h>>2]+4;c=J[e>>2]+1|0;J[e>>2]=c;i=c;while(1){if((d|0)==(i|0)){i=d;break b}if(!K[i|0]){break b}i=i+1|0;continue}}J[e>>2]=c;a=1;break c}c=J[e>>2]}a=(c|0)!=(d|0)}la=q+16|0;return a|0}f=J[h>>2];continue}}function Qa(a,b){var c=0,d=0,e=0,f=0,g=0;c=la-112|0;la=c;d=c+36|0;Hm(d,2225,b);e=8;d=Dm(d,2187);f=d+8|0;J[c+56>>2]=J[f>>2];g=J[d+4>>2];J[c+48>>2]=J[d>>2];J[c+52>>2]=g;J[d>>2]=0;J[d+4>>2]=0;J[f>>2]=0;a:{b:{c:{d:{switch(J[b+12>>2]){case 0:e=6;H[c+35|0]=6;J[c+24>>2]=K[1532]|K[1533]<<8|(K[1534]<<16|K[1535]<<24);I[c+28>>1]=K[1536]|K[1537]<<8;break a;case 1:J[c+24>>2]=1634300532;J[c+28>>2]=1701603182;break b;case 2:e=5;H[c+35|0]=5;J[c+24>>2]=K[1250]|K[1251]<<8|(K[1252]<<16|K[1253]<<24);H[c+28|0]=K[1254];break a;case 3:e=6;H[c+35|0]=6;J[c+24>>2]=K[1509]|K[1510]<<8|(K[1511]<<16|K[1512]<<24);I[c+28>>1]=K[1513]|K[1514]<<8;break a;case 4:J[c+24>>2]=1918989427;break c;case 5:J[c+24>>2]=1953458295;break c;default:break d}}J[c+24>>2]=1701736302}e=4}H[c+35|0]=e}d=c+24|0;H[d+e|0]=0;f=d;d=K[c+35|0];e=d<<24>>24<0;d=xm(c+48|0,e?J[c+24>>2]:f,e?J[c+28>>2]:d);e=d+8|0;J[c+72>>2]=J[e>>2];f=J[d+4>>2];J[c+64>>2]=J[d>>2];J[c+68>>2]=f;J[d>>2]=0;J[d+4>>2]=0;J[e>>2]=0;d=Dm(c- -64|0,1819);e=d+8|0;J[c+88>>2]=J[e>>2];f=J[d+4>>2];J[c+80>>2]=J[d>>2];J[c+84>>2]=f;J[d>>2]=0;J[d+4>>2]=0;J[e>>2]=0;d=c+12|0;Im(d,J[b+16>>2]);f=d;b=K[c+23|0];d=b<<24>>24<0;b=xm(c+80|0,d?J[c+12>>2]:f,d?J[c+16>>2]:b);d=b+8|0;J[c+104>>2]=J[d>>2];e=J[b+4>>2];J[c+96>>2]=J[b>>2];J[c+100>>2]=e;J[b>>2]=0;J[b+4>>2]=0;J[d>>2]=0;b=Dm(c+96|0,1048);d=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=d;d=a;a=b+8|0;J[d+8>>2]=J[a>>2];J[b>>2]=0;J[b+4>>2]=0;J[a>>2]=0;if(H[c+107|0]<0){tb(J[c+96>>2])}if(H[c+23|0]<0){tb(J[c+12>>2])}if(H[c+91|0]<0){tb(J[c+80>>2])}if(H[c+75|0]<0){tb(J[c+64>>2])}if(H[c+35|0]<0){tb(J[c+24>>2])}if(H[c+59|0]<0){tb(J[c+48>>2])}if(H[c+47|0]<0){tb(J[c+36>>2])}la=c+112|0}function Ja(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0;a:{b:{c:{d:{e:{f:{g:{d=J[a+28>>2];c=J[a+32>>2];g=(d|0)==(c|0);h:{if(!g){b=d;while(1){e=20;i:{j:{switch(J[b+12>>2]-4|0){case 0:e=J[b+16>>2]<<1;break i;case 1:break i;default:break j}}e=J[b+16>>2]}h=e+h|0;b=b+20|0;if((c|0)!=(b|0)){continue}break}e=a+40|0;b=J[a+68>>2];f=J[a+72>>2];if((b|0)!=(f|0)){break h}H[a+124|0]=1;if((c|0)==(d|0)){break d}b=a+128|0;d=K[a+51|0];c=d<<24>>24;if(H[a+139|0]<0){break g}if((c|0)<0){break c}a=J[e+4>>2];J[b>>2]=J[e>>2];J[b+4>>2]=a;J[b+8>>2]=J[e+8>>2];return}b=J[a+68>>2];f=J[a+72>>2];if((b|0)==(f|0)){break e}e=a+40|0}c=e;d=0;while(1){e=20;k:{l:{switch(J[b+12>>2]-4|0){case 0:e=J[b+16>>2]<<1;break k;case 1:break k;default:break l}}e=J[b+16>>2]}d=d+e|0;b=b+20|0;if((f|0)!=(b|0)){continue}break}H[a+124|0]=1;if(!g){break f}break d}c=(c|0)<0;Am(b,c?J[a+40>>2]:e,c?J[a+44>>2]:d);return}if((d|0)>(h|0)){b=a+128|0;d=K[a+11|0];c=d<<24>>24;if(H[a+139|0]>=0){if((c|0)>=0){break b}break a}c=(c|0)<0;Am(b,c?J[a>>2]:a,c?J[a+4>>2]:d);return}b=a+128|0;f=H[a+139|0];if((d|0)<(h|0)){d=K[a+51|0];g=d<<24>>24;if((f|0)>=0){if((g|0)>=0){a=J[c+4>>2];J[b>>2]=J[c>>2];J[b+4>>2]=a;J[b+8>>2]=J[c+8>>2];return}break c}e=c;c=(g|0)<0;Am(b,c?J[a+40>>2]:e,c?J[a+44>>2]:d);return}m:{if((f|0)<0){J[a+132>>2]=4;b=J[a+128>>2];break m}H[a+139|0]=4}H[b+4|0]=0;H[b|0]=68;H[b+1|0]=82;H[b+2|0]=65;H[b+3|0]=87;return}H[a+124|0]=1}b=a+128|0;d=K[a+11|0];c=d<<24>>24;if(H[a+139|0]>=0){if((c|0)>=0){break b}break a}c=(c|0)<0;Am(b,c?J[a>>2]:a,c?J[a+4>>2]:d);return}Bm(b,J[a+40>>2],J[a+44>>2]);return}c=J[a+4>>2];J[b>>2]=J[a>>2];J[b+4>>2]=c;J[b+8>>2]=J[a+8>>2];return}Bm(b,J[a>>2],J[a+4>>2])}function Sa(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;l=J[b>>2];b=J[b+4>>2];if((l|0)!=(b|0)){j=(b-l|0)+1|0;if(!j){b=J[a>>2];while(1){c=b;b=(b>>>0)/44488|0;c=P(c-P(b,44488)|0,48271);b=P(b,3399);b=(c>>>0<b>>>0?2147483647:0)+(c-b|0)|0;h=b-1|0;if(h>>>0>2147418111){continue}break}while(1){c=b;b=(b>>>0)/44488|0;c=P(c-P(b,44488)|0,48271);b=P(b,3399);b=(c>>>0<b>>>0?2147483647:0)+(c-b|0)|0;c=b-1|0;if(c>>>0>2147418111){continue}break}J[a>>2]=b;return c&65535|h<<16}a:{b:{c:{b=S(j);c=(2147483647>>>b&j?32:31)-b|0;b=c&255;f=(((c>>>0<30?c:c-30|0)|0)!=0)+(c>>>0>29)|0;d=(b>>>0)/(f>>>0)|0;i=d>>>0<32?-1<<d&2147483646:0;if((i^2147483646)>>>0>(i>>>0)/(f>>>0)>>>0){f=f+1|0;d=(b>>>0)/((f&255)>>>0)|0;if(d>>>0>31){break c}i=-1<<d&2147483646}k=f-((b>>>0)%((f&255)>>>0)|0)|0;if(d>>>0>=31){break b}n=d?-1>>>32-d|0:0;o=-1>>>31-d|0;m=d+1|0;h=1073741823>>>d<<m;break a}k=f-(c-P(d,f)&255)|0;i=0;d=32}m=d+1|0;o=-1;n=-1>>>32-d|0;h=0}b=J[a>>2];p=d>>>0<31;q=d>>>0<32;while(1){c=0;g=0;if(k){while(1){e=b;b=(b>>>0)/44488|0;e=P(e-P(b,44488)|0,48271);b=P(b,3399);b=(e>>>0<b>>>0?2147483647:0)+(e-b|0)|0;e=b-1|0;if(e>>>0>=i>>>0){continue}c=(e&n)+(q?c<<d:0)|0;g=g+1|0;if((k|0)!=(g|0)){continue}break}J[a>>2]=b;g=c}c=k;if(c>>>0<f>>>0){while(1){e=b;b=(b>>>0)/44488|0;e=P(e-P(b,44488)|0,48271);b=P(b,3399);b=(e>>>0<b>>>0?2147483647:0)+(e-b|0)|0;e=b-1|0;if(e>>>0>=h>>>0){continue}g=(e&o)+(p?g<<m:0)|0;c=c+1|0;if((c|0)!=(f|0)){continue}break}J[a>>2]=b}if(g>>>0>=j>>>0){continue}break}b=g+l|0}return b}function Ea(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;e=a+140|0;c=J[a+144>>2];a:{if((c|0)!=J[a+148>>2]){b:{if(H[b+11|0]>=0){d=J[b+4>>2];J[c>>2]=J[b>>2];J[c+4>>2]=d;J[c+8>>2]=J[b+8>>2];break b}vm(c,J[b>>2],J[b+4>>2])}d=c+12|0;J[a+144>>2]=d;break a}c:{d:{e:{c=J[e+4>>2];f=J[e>>2];g=(c-f|0)/12|0;d=g+1|0;if(d>>>0<357913942){i=(J[e+8>>2]-f|0)/12|0;j=i<<1;d=i>>>0>=178956970?357913941:d>>>0<j>>>0?j:d;if(d){if(d>>>0>=357913942){break e}h=om(P(d,12))}i=P(d,12);d=P(g,12)+h|0;f:{if(H[b+11|0]>=0){g=J[b+4>>2];J[d>>2]=J[b>>2];J[d+4>>2]=g;J[d+8>>2]=J[b+8>>2];break f}vm(d,J[b>>2],J[b+4>>2]);f=J[e>>2];c=J[e+4>>2]}b=h+i|0;h=d+12|0;if((c|0)==(f|0)){break d}while(1){c=c-12|0;g=J[c+4>>2];d=d-12|0;J[d>>2]=J[c>>2];J[d+4>>2]=g;g=c+8|0;J[d+8>>2]=J[g>>2];J[c>>2]=0;J[c+4>>2]=0;J[g>>2]=0;if((c|0)!=(f|0)){continue}break}J[e+8>>2]=b;b=J[e+4>>2];J[e+4>>2]=h;f=J[e>>2];J[e>>2]=d;if((b|0)==(f|0)){break c}while(1){c=b-12|0;if(H[b-1|0]<0){tb(J[c>>2])}b=c;if((f|0)!=(b|0)){continue}break}break c}Ra();B()}Va();B()}J[e+8>>2]=b;J[e+4>>2]=h;J[e>>2]=d}if(f){tb(f)}d=J[a+144>>2]}e=J[e>>2];if((d-e|0)/12>>>0>=51){b=e+12|0;g:{if((d|0)==(b|0)){c=e;break g}c=e;while(1){if(H[c+11|0]<0){tb(J[c>>2])}f=J[b+4>>2];J[c>>2]=J[b>>2];J[c+4>>2]=f;J[c+8>>2]=J[b+8>>2];H[b+11|0]=0;H[b|0]=0;c=c+12|0;b=b+12|0;if((d|0)!=(b|0)){continue}break}d=J[a+144>>2]}c=e+P((c-e|0)/12|0,12)|0;if((c|0)!=(d|0)){while(1){b=d-12|0;if(H[d-1|0]<0){tb(J[b>>2])}d=b;if((b|0)!=(c|0)){continue}break}}J[a+144>>2]=c}}function Fj(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;t=la-16|0;la=t;J[c>>2]=a;w=d&512;x=h<<2;while(1){if((u|0)==4){if(jd(n)>>>0>1){z=t,A=Bh(n),J[z+12>>2]=A;z=c,A=Gj(wj(t+12|0,1),Yh(n),J[c>>2]),J[z>>2]=A}d=d&176;if((d|0)!=16){if((d|0)==32){a=J[c>>2]}J[b>>2]=a}la=t+16|0}else{a:{b:{switch(H[i+u|0]){case 0:J[b>>2]=J[c>>2];break a;case 1:J[b>>2]=J[c>>2];h=je(g,32);p=J[c>>2];J[c>>2]=p+4;J[p>>2]=h;break a;case 3:if(Ag(n)){break a}h=J[gh(n,0)>>2];p=J[c>>2];J[c>>2]=p+4;J[p>>2]=h;break a;case 2:if(Ag(m)|!w){break a}z=c,A=Gj(Bh(m),Yh(m),J[c>>2]),J[z>>2]=A;break a;case 4:break b;default:break a}}y=J[c>>2];e=e+x|0;h=e;while(1){c:{if(f>>>0<=h>>>0){break c}if(!Rc(g,64,J[h>>2])){break c}h=h+4|0;continue}break}if((o|0)>0){p=J[c>>2];q=o;while(1){if(!(!q|e>>>0>=h>>>0)){q=q-1|0;h=h-4|0;s=J[h>>2];r=p+4|0;J[c>>2]=r;J[p>>2]=s;p=r;continue}break}d:{if(!q){r=0;break d}r=je(g,48);p=J[c>>2]}while(1){s=p+4|0;if((q|0)>0){J[p>>2]=r;q=q-1|0;p=s;continue}break}J[c>>2]=s;J[p>>2]=j}e:{if((e|0)==(h|0)){p=je(g,48);q=J[c>>2];h=q+4|0;J[c>>2]=h;J[q>>2]=p;break e}if(Ag(l)){r=-1}else{r=H[zg(l,0)|0]}p=0;s=0;while(1){if((e|0)!=(h|0)){f:{if((p|0)!=(r|0)){q=p;break f}q=J[c>>2];J[c>>2]=q+4;J[q>>2]=k;q=0;s=s+1|0;if(jd(l)>>>0<=s>>>0){r=p;break f}if(K[zg(l,s)|0]==127){r=-1;break f}r=H[zg(l,s)|0]}h=h-4|0;p=J[h>>2];v=J[c>>2];J[c>>2]=v+4;J[v>>2]=p;p=q+1|0;continue}break}h=J[c>>2]}ki(y,h)}u=u+1|0;continue}break}}function Dk(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;n=la-16|0;la=n;i=c;while(1){a:{if((d|0)==(i|0)){i=d;break a}if(!J[i>>2]){break a}i=i+4|0;continue}break}J[h>>2]=f;J[e>>2]=c;b:{while(1){c:{d:{if(!((c|0)==(d|0)|(f|0)==(g|0))){j=J[b+4>>2];J[n+8>>2]=J[b>>2];J[n+12>>2]=j;s=1;o=la-16|0;la=o;J[o+12>>2]=J[a+8>>2];t=bh(o+8|0,o+12|0);j=f;k=g-f|0;p=0;q=la-16|0;la=q;l=J[e>>2];r=i-c>>2;e:{if(!l|!r){break e}k=f?k:0;while(1){m=ye(k>>>0<4?q+12|0:j,J[l>>2]);if((m|0)==-1){p=-1;break e}if(j){if(k>>>0<=3){if(k>>>0<m>>>0){break e}ib(j,q+12|0,m)}k=k-m|0;j=j+m|0}else{j=0}if(!J[l>>2]){l=0;break e}p=p+m|0;l=l+4|0;r=r-1|0;if(r){continue}break}}if(j){J[e>>2]=l}la=q+16|0;ch(t);la=o+16|0;f:{g:{h:{switch(p+1|0){case 0:J[h>>2]=f;while(1){if(J[e>>2]==(c|0)){break g}b=Ek(f,J[c>>2],J[a+8>>2]);if((b|0)==-1){break g}f=b+J[h>>2]|0;J[h>>2]=f;c=c+4|0;continue};case 1:break b;default:break h}}f=p+J[h>>2]|0;J[h>>2]=f;if((f|0)==(g|0)){break f}if((d|0)==(i|0)){c=J[e>>2];i=d;continue}c=n+4|0;i=Ek(c,0,J[a+8>>2]);if((i|0)==-1){break c}if(g-J[h>>2]>>>0<i>>>0){break b}while(1){if(i){f=K[c|0];j=J[h>>2];J[h>>2]=j+1;H[j|0]=f;i=i-1|0;c=c+1|0;continue}break}c=J[e>>2]+4|0;J[e>>2]=c;i=c;while(1){if((d|0)==(i|0)){i=d;break d}if(!J[i>>2]){break d}i=i+4|0;continue}}J[e>>2]=c;break c}c=J[e>>2]}s=(c|0)!=(d|0);break b}f=J[h>>2];continue}break}s=2}la=n+16|0;return s|0}function Pa(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;d=la-160|0;la=d;J[d+80>>2]=4100;c=J[1028];J[d+24>>2]=c;g=d+24|0;J[g+J[c-12>>2]>>2]=J[1029];c=g+J[J[d+24>>2]-12>>2]|0;e=d+28|0;oe(c,e);J[c+72>>2]=0;J[c+76>>2]=-1;J[d+80>>2]=4100;J[d+24>>2]=4080;h=Ob(e);J[h>>2]=3380;J[d+68>>2]=0;J[d+72>>2]=0;J[d+60>>2]=0;J[d+64>>2]=0;J[d+76>>2]=16;g=Na(Na(g,1050,1),2226,6);c=K[b+11|0];e=c<<24>>24<0;g=Na(Na(Na(g,e?J[b>>2]:b,e?J[b+4>>2]:c),2113,2),2216,8);c=K[b+23|0];e=c<<24>>24<0;g=Na(Na(Na(g,e?J[b+12>>2]:b+12|0,e?J[b+16>>2]:c),2113,2),1840,10);c=K[b+24|0];e=b+32|0;g=Na(Na(Dc(Na(Na(Na(g,c?1494:1503,c?4:5),2114,1),1777,12),(J[e>>2]-J[b+28>>2]|0)/20|0),2114,1),1859,8);c=J[b+28>>2];i=J[e>>2];if((c|0)!=(i|0)){while(1){e=20;a:{b:{switch(J[c+12>>2]-4|0){case 0:e=J[c+16>>2]<<1;break a;case 1:break a;default:break b}}e=J[c+16>>2]}f=e+f|0;c=c+20|0;if((i|0)!=(c|0)){continue}break}}Na(Na(Cc(g,f),2114,1),1636,8);e=J[b+28>>2];if((e|0)!=J[b+32>>2]){c=0;while(1){f=d+12|0;Qa(f,P(c,20)+e|0);g=f;e=K[d+23|0];f=e<<24>>24<0;Na(d+24|0,f?J[d+12>>2]:g,f?J[d+16>>2]:e);if(H[d+23|0]<0){tb(J[d+12>>2])}c=c+1|0;e=J[b+28>>2];f=(J[b+32>>2]-e|0)/20|0;if(c>>>0<f>>>0){Na(d+24|0,2114,1);e=J[b+28>>2];f=(J[b+32>>2]-e|0)/20|0}if(c>>>0<f>>>0){continue}break}}b=d+80|0;f=d+24|0;Na(f,1047,2);fd(a,h);a=J[1027];J[d+24>>2]=a;J[f+J[a-12>>2]>>2]=J[1030];J[h>>2]=3380;if(H[d+71|0]<0){tb(J[d+60>>2])}Mb(h);ne(b);la=d+160|0}function zj(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o){var p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0;u=la-16|0;la=u;J[c>>2]=a;x=d&512;while(1){if((v|0)==4){if(jd(n)>>>0>1){z=u,A=Bh(n),J[z+12>>2]=A;z=c,A=Bj(ij(u+12|0,1),Ch(n),J[c>>2]),J[z>>2]=A}d=d&176;if((d|0)!=16){if((d|0)==32){a=J[c>>2]}J[b>>2]=a}la=u+16|0}else{a:{b:{switch(H[i+v|0]){case 0:J[b>>2]=J[c>>2];break a;case 1:J[b>>2]=J[c>>2];q=he(g,32);p=J[c>>2];J[c>>2]=p+1;H[p|0]=q;break a;case 3:if(Ag(n)){break a}q=K[zg(n,0)|0];p=J[c>>2];J[c>>2]=p+1;H[p|0]=q;break a;case 2:if(Ag(m)|!x){break a}z=c,A=Bj(Bh(m),Ch(m),J[c>>2]),J[z>>2]=A;break a;case 4:break b;default:break a}}y=J[c>>2];e=e+h|0;r=e;while(1){c:{if(f>>>0<=r>>>0){break c}if(!kc(g,64,H[r|0])){break c}r=r+1|0;continue}break}q=o;if((q|0)>0){while(1){if(!(!q|e>>>0>=r>>>0)){q=q-1|0;r=r-1|0;p=K[r|0];s=J[c>>2];J[c>>2]=s+1;H[s|0]=p;continue}break}if(q){p=he(g,48)}else{p=0}while(1){s=J[c>>2];J[c>>2]=s+1;if((q|0)>0){H[s|0]=p;q=q-1|0;continue}break}H[s|0]=j}d:{if((e|0)==(r|0)){q=he(g,48);p=J[c>>2];J[c>>2]=p+1;H[p|0]=q;break d}if(Ag(l)){p=-1}else{p=H[zg(l,0)|0]}q=0;t=0;while(1){if((e|0)==(r|0)){break d}e:{if((q|0)!=(p|0)){s=q;break e}p=J[c>>2];J[c>>2]=p+1;H[p|0]=k;s=0;t=t+1|0;if(jd(l)>>>0<=t>>>0){p=q;break e}if(K[zg(l,t)|0]==127){p=-1;break e}p=H[zg(l,t)|0]}r=r-1|0;q=K[r|0];w=J[c>>2];J[c>>2]=w+1;H[w|0]=q;q=s+1|0;continue}}ji(y,J[c>>2])}v=v+1|0;continue}break}}function Nk(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0;a=la-16|0;la=a;J[a+12>>2]=c;J[a+8>>2]=f;m=a+12|0;J[m>>2]=c;l=a+8|0;J[l>>2]=f;a:{b:{c:{while(1){d:{c=J[m>>2];if(c>>>0>=d>>>0){break d}j=J[l>>2];if(j>>>0>=g>>>0){break d}b=2;f=K[c|0];e:{if(f<<24>>24>=0){I[j>>1]=f;b=c+1|0;break e}if(f>>>0<194){break b}if(f>>>0<=223){if((d-c|0)<2){break c}i=K[c+1|0];if((i&192)!=128){break a}I[j>>1]=i&63|f<<6&1984;b=c+2|0;break e}if(f>>>0<=239){if((d-c|0)<3){break c}k=K[c+2|0];i=K[c+1|0];f:{g:{if((f|0)!=237){if((f|0)!=224){break g}if((i&224)==160){break f}break a}if((i&224)==128){break f}break a}if((i&192)!=128){break a}}if((k&192)!=128){break a}I[j>>1]=k&63|((i&63)<<6|f<<12);b=c+3|0;break e}if(f>>>0>244){break b}b=1;if((d-c|0)<4){break a}k=K[c+3|0];i=K[c+2|0];c=K[c+1|0];h:{i:{switch(f-240|0){case 0:if((c+112&255)>>>0>=48){break b}break h;case 4:if((c&240)!=128){break b}break h;default:break i}}if((c&192)!=128){break b}}if((i&192)!=128|(k&192)!=128){break b}if((g-j|0)<4){break a}b=2;k=k&63;n=i<<6;f=f&7;if((k|(n&4032|(c<<12&258048|f<<18)))>>>0>1114111){break a}b=c<<2;I[j>>1]=(i>>>4&3|(b&192|f<<8|b&60))+16320|55296;J[l>>2]=j+2;I[j+2>>1]=k|n&960|56320;b=J[m>>2]+4|0}J[m>>2]=b;J[l>>2]=J[l>>2]+2;continue}break}b=c>>>0<d>>>0;break a}b=1;break a}b=2}J[e>>2]=J[a+12>>2];J[h>>2]=J[a+8>>2];la=a+16|0;return b|0}function Mk(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0;a=la-16|0;la=a;J[a+12>>2]=c;J[a+8>>2]=f;j=a+12|0;J[j>>2]=c;b=a+8|0;J[b>>2]=f;c=J[j>>2];a:{b:{while(1){if(c>>>0>=d>>>0){f=0;break a}f=2;c:{i=L[c>>1];d:{if(i>>>0<=127){f=1;c=J[b>>2];if((g-c|0)<=0){break a}J[b>>2]=c+1;H[c|0]=i;break d}if(i>>>0<=2047){c=J[b>>2];if((g-c|0)<2){break b}J[b>>2]=c+1;H[c|0]=i>>>6|192;c=J[b>>2];J[b>>2]=c+1;H[c|0]=i&63|128;break d}if(i>>>0<=55295){c=J[b>>2];if((g-c|0)<3){break b}J[b>>2]=c+1;H[c|0]=i>>>12|224;c=J[b>>2];J[b>>2]=c+1;H[c|0]=i>>>6&63|128;c=J[b>>2];J[b>>2]=c+1;H[c|0]=i&63|128;break d}if(i>>>0<=56319){f=1;if((d-c|0)<4){break a}k=L[c+2>>1];if((k&64512)!=56320){break c}if((g-J[b>>2]|0)<4){break a}f=i&960;if((k&1023|(i<<10&64512|f<<10))>>>0>1048575){break c}J[j>>2]=c+2;c=J[b>>2];J[b>>2]=c+1;l=c;c=(f>>>6|0)+1|0;H[l|0]=c>>>2|240;f=J[b>>2];J[b>>2]=f+1;H[f|0]=c<<4&48|i>>>2&15|128;c=J[b>>2];J[b>>2]=c+1;H[c|0]=k>>>6&15|i<<4&48|128;c=J[b>>2];J[b>>2]=c+1;H[c|0]=k&63|128;break d}if(i>>>0<57344){break a}c=J[b>>2];if((g-c|0)<3){break b}J[b>>2]=c+1;H[c|0]=i>>>12|224;c=J[b>>2];J[b>>2]=c+1;H[c|0]=i>>>6&63|128;c=J[b>>2];J[b>>2]=c+1;H[c|0]=i&63|128}c=J[j>>2]+2|0;J[j>>2]=c;continue}break}f=2;break a}f=1}J[e>>2]=J[a+12>>2];J[h>>2]=J[a+8>>2];la=a+16|0;return f|0}function xa(){var a=0,b=0,c=0,d=0,e=0;if(!K[21109]){d=J[1073];b=la-16|0;la=b;a=Ob(20756);J[a+40>>2]=20812;J[a+32>>2]=d;J[a>>2]=4628;H[a+52|0]=0;J[a+48>>2]=-1;c=b+12|0;cd(c,a);na[J[J[a>>2]+8>>2]](a,c);ak(c);la=b+16|0;a=Ge(20080);J[5018]=3128;J[a>>2]=3148;J[5019]=0;He(a,20756);c=J[1074];Be(20820,c,20868);Ce(20248,20820);e=J[1075];Be(20876,e,20924);Ce(20416,20876);Ce(20584,J[(J[J[5104]-12>>2]+20416|0)+24>>2]);De(J[J[5018]-12>>2]+20072|0,20248);Ie(J[J[5104]-12>>2]+20416|0);De(J[J[5104]-12>>2]+20416|0,20248);b=la-16|0;la=b;a=Ic(20932);J[a+40>>2]=20988;J[a+32>>2]=d;J[a>>2]=4832;H[a+52|0]=0;J[a+48>>2]=-1;cd(b+12|0,a);na[J[J[a>>2]+8>>2]](a,b+12|0);ak(b+12|0);la=b+16|0;a=Je(20168);J[5040]=3288;J[a>>2]=3308;J[5041]=0;He(a,20932);Ee(20996,c,21044);Fe(20332,20996);Ee(21052,e,21100);Fe(20500,21052);Fe(20668,J[(J[J[5125]-12>>2]+20500|0)+24>>2]);De(J[J[5040]-12>>2]+20160|0,20332);Ie(J[J[5125]-12>>2]+20500|0);De(J[J[5125]-12>>2]+20500|0,20332);H[21109]=1}a=la-16|0;la=a;a:{if(ha(a+12|0,a+8|0)|0){break a}b=sb((J[a+12>>2]<<2)+4|0);J[5278]=b;if(!b){break a}b=sb(J[a+8>>2]);if(b){J[J[5278]+(J[a+12>>2]<<2)>>2]=0;if(!(ia(J[5278],b|0)|0)){break a}}J[5278]=0}la=a+16|0;I[8626]=32123;H[17263]=2;H[17254]=0;H[17264]=0;H[17275]=0;H[17276]=0;H[17287]=0;J[5008]=17824;J[4990]=42}function Df(a,b){var c=0,d=0,e=0,f=0,g=0;a:{b:{c:{d:{e:{c=J[a+4>>2];f:{if((c|0)!=J[a+104>>2]){J[a+4>>2]=c+1;c=K[c|0];break f}c=kf(a)}switch(c-43|0){case 0:case 2:break e;default:break d}}g=(c|0)==45;b=!b;c=J[a+4>>2];g:{if((c|0)!=J[a+104>>2]){J[a+4>>2]=c+1;c=K[c|0];break g}c=kf(a)}d=c-58|0;if(b|d>>>0>4294967285){break c}if(J[a+116>>2]<0){break b}J[a+4>>2]=J[a+4>>2]-1;break b}d=c-58|0}if(d>>>0<4294967286){break b}h:{if(c-48>>>0>=10){break h}while(1){e=(P(e,10)+c|0)-48|0;f=(e|0)<214748364;c=J[a+4>>2];i:{if((c|0)!=J[a+104>>2]){J[a+4>>2]=c+1;c=K[c|0];break i}c=kf(a)}b=c-48|0;if(f&b>>>0<=9){continue}break}f=e>>31;if(b>>>0>=10){break h}while(1){b=c;c=wn(e,f,10,0);d=b+c|0;b=ma;e=d-48|0;d=(c>>>0>d>>>0?b+1|0:b)-(d>>>0<48)|0;f=d;d=e>>>0<2061584302&(d|0)<=21474836|(d|0)<21474836;c=J[a+4>>2];j:{if((c|0)!=J[a+104>>2]){J[a+4>>2]=c+1;c=K[c|0];break j}c=kf(a)}b=c-48|0;if(d&b>>>0<=9){continue}break}if(b>>>0>=10){break h}while(1){b=J[a+4>>2];k:{if((b|0)!=J[a+104>>2]){J[a+4>>2]=b+1;b=K[b|0];break k}b=kf(a)}if(b-48>>>0<10){continue}break}}b=J[a+116>>2];if((b|0)>0){b=1}else{b=(b|0)>=0}if(b){J[a+4>>2]=J[a+4>>2]-1}a=e;e=g?0-a|0:a;f=g?0-(((a|0)!=0)+f|0)|0:f;break a}f=-2147483648;if(J[a+116>>2]<0){break a}J[a+4>>2]=J[a+4>>2]-1;ma=-2147483648;return 0}ma=f;return e}function fi(a,b,c,d,e,f,g){var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;k=la-16|0;la=k;l=Oc(g);o=eh(g);zh(k+4|0,o);J[f>>2]=d;a:{b:{h=a;g=K[h|0];switch(g-43|0){case 0:case 2:break b;default:break a}}g=je(l,g<<24>>24);i=J[f>>2];J[f>>2]=i+4;J[i>>2]=g;h=a+1|0}c:{g=h;if(!((c-g|0)<=1|K[g|0]!=48|(K[g+1|0]|32)!=120)){i=je(l,48);h=J[f>>2];J[f>>2]=h+4;J[h>>2]=i;i=je(l,H[g+1|0]);h=J[f>>2];J[f>>2]=h+4;J[h>>2]=i;h=g+2|0;g=h;while(1){if(c>>>0<=g>>>0){break c}if(!_f(H[g|0],_g())){break c}g=g+1|0;continue}}while(1){if(c>>>0<=g>>>0){break c}i=H[g|0];_g();if(!lf(i)){break c}g=g+1|0;continue}}d:{if(Ag(k+4|0)){vh(l,h,g,J[f>>2]);J[f>>2]=J[f>>2]+(g-h<<2);break d}ji(h,g);q=yh(o);i=h;while(1){if(g>>>0<=i>>>0){ki((h-a<<2)+d|0,J[f>>2])}else{m=k+4|0;e:{if(H[zg(m,n)|0]<=0){break e}if(H[zg(k+4|0,n)|0]!=(j|0)){break e}j=J[f>>2];J[f>>2]=j+4;J[j>>2]=q;n=(jd(m)-1>>>0>n>>>0)+n|0;j=0}m=je(l,H[i|0]);p=J[f>>2];J[f>>2]=p+4;J[p>>2]=m;i=i+1|0;j=j+1|0;continue}break}}f:{g:{while(1){if(c>>>0<=g>>>0){break g}i=g+1|0;g=K[g|0];if((g|0)!=46){g=je(l,g<<24>>24);h=J[f>>2];J[f>>2]=h+4;J[h>>2]=g;g=i;continue}break}g=xh(o);h=J[f>>2];j=h+4|0;J[f>>2]=j;J[h>>2]=g;break f}j=J[f>>2];i=g}vh(l,i,c,j);g=f;f=J[f>>2]+(c-i<<2)|0;J[g>>2]=f;J[e>>2]=(b|0)==(c|0)?f:(b-a<<2)+d|0;tm(k+4|0);la=k+16|0}function Rk(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0;a=la-16|0;la=a;J[a+12>>2]=c;J[a+8>>2]=f;m=a+12|0;J[m>>2]=c;l=a+8|0;J[l>>2]=f;a:{b:{while(1){c:{c=J[m>>2];if(c>>>0>=d>>>0){break c}n=J[l>>2];if(n>>>0>=g>>>0){break c}j=H[c|0];f=j&255;d:{if((j|0)>=0){if(f>>>0<=1114111){j=1;break d}b=2;break a}b=2;if(j>>>0<4294967234){break a}if(j>>>0<=4294967263){if((d-c|0)<2){break b}i=K[c+1|0];if((i&192)!=128){break a}j=2;f=i&63|f<<6&1984;break d}if(j>>>0<=4294967279){if((d-c|0)<3){break b}k=K[c+2|0];i=K[c+1|0];e:{f:{if((f|0)!=237){if((f|0)!=224){break f}if((i&224)==160){break e}break a}if((i&224)==128){break e}break a}if((i&192)!=128){break a}}if((k&192)!=128){break a}j=3;f=k&63|(f<<12&61440|(i&63)<<6);break d}if(j>>>0>4294967284){break a}if((d-c|0)<4){break b}k=K[c+3|0];o=K[c+2|0];i=K[c+1|0];g:{h:{switch(f-240|0){case 0:if((i+112&255)>>>0<48){break g}break a;case 4:if((i&240)==128){break g}break a;default:break h}}if((i&192)!=128){break a}}if((o&192)!=128|(k&192)!=128){break a}j=4;f=k&63|(o<<6&4032|(f<<18&1835008|(i&63)<<12));if(f>>>0>1114111){break a}}J[n>>2]=f;J[m>>2]=c+j;J[l>>2]=J[l>>2]+4;continue}break}b=c>>>0<d>>>0;break a}b=1}J[e>>2]=J[a+12>>2];J[h>>2]=J[a+8>>2];la=a+16|0;return b|0}function Sh(a,b,c,d,e,f,g){var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;j=la-16|0;la=j;k=hc(g);o=qg(g);zh(j+4|0,o);J[f>>2]=d;a:{b:{h=a;g=K[h|0];switch(g-43|0){case 0:case 2:break b;default:break a}}g=he(k,g<<24>>24);i=J[f>>2];J[f>>2]=i+1;H[i|0]=g;h=a+1|0}c:{g=h;if(!((c-g|0)<=1|K[g|0]!=48|(K[g+1|0]|32)!=120)){i=he(k,48);h=J[f>>2];J[f>>2]=h+1;H[h|0]=i;i=he(k,H[g+1|0]);h=J[f>>2];J[f>>2]=h+1;H[h|0]=i;h=g+2|0;g=h;while(1){if(c>>>0<=g>>>0){break c}if(!_f(H[g|0],_g())){break c}g=g+1|0;continue}}while(1){if(c>>>0<=g>>>0){break c}i=H[g|0];_g();if(!lf(i)){break c}g=g+1|0;continue}}d:{if(Ag(j+4|0)){Zg(k,h,g,J[f>>2]);J[f>>2]=J[f>>2]+(g-h|0);break d}ji(h,g);q=yh(o);i=h;while(1){if(g>>>0<=i>>>0){ji((h-a|0)+d|0,J[f>>2])}else{m=j+4|0;e:{if(H[zg(m,n)|0]<=0){break e}if(H[zg(j+4|0,n)|0]!=(l|0)){break e}l=J[f>>2];J[f>>2]=l+1;H[l|0]=q;n=(jd(m)-1>>>0>n>>>0)+n|0;l=0}m=he(k,H[i|0]);p=J[f>>2];J[f>>2]=p+1;H[p|0]=m;i=i+1|0;l=l+1|0;continue}break}}while(1){f:{g:{if(c>>>0<=g>>>0){i=g;break g}i=g+1|0;g=K[g|0];if((g|0)!=46){break f}g=xh(o);h=J[f>>2];J[f>>2]=h+1;H[h|0]=g}Zg(k,i,c,J[f>>2]);g=f;f=J[f>>2]+(c-i|0)|0;J[g>>2]=f;J[e>>2]=(b|0)==(c|0)?f:(b-a|0)+d|0;tm(j+4|0);la=j+16|0;return}g=he(k,g<<24>>24);h=J[f>>2];J[f>>2]=h+1;H[h|0]=g;g=i;continue}}function eg(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;l=la-16|0;la=l;a:{b:{c:{if((c|0)<=36){g=K[a|0];if(g){break c}f=a;break b}J[4322]=28;d=0;e=0;break a}f=a;d:{while(1){if(!hf(g<<24>>24)){break d}g=K[f+1|0];f=f+1|0;if(g){continue}break}break b}e:{g=K[f|0];switch(g-43|0){case 0:case 2:break e;default:break b}}i=(g|0)==45?-1:0;f=f+1|0}f:{if(!((c|16)!=16|K[f|0]!=48)){o=1;if((K[f+1|0]&223)==88){f=f+2|0;m=16;break f}f=f+1|0;m=c?c:8;break f}m=c?c:10}c=0;while(1){g:{g=-48;j=H[f|0];h:{if((j-48&255)>>>0<10){break h}g=-87;if((j-97&255)>>>0<26){break h}g=-55;if((j-65&255)>>>0>25){break g}}n=g+j|0;if((n|0)>=(m|0)){break g}zf(l,m,0,0,0,k,h,0,0);g=1;i:{if(J[l+8>>2]|J[l+12>>2]){break i}p=wn(m,0,k,h);j=ma;if((j|0)==-1&(n^-1)>>>0<p>>>0){break i}h=j;k=n+p|0;h=k>>>0<n>>>0?h+1|0:h;o=1;g=c}f=f+1|0;c=g;continue}break}if(b){J[b>>2]=o?f:a}j:{k:{if(c){J[4322]=68;b=d&1;a=0;i=b|a?0:i;k=d;h=e;break k}if((e|0)==(h|0)&d>>>0>k>>>0|e>>>0>h>>>0){break j}b=d&1;a=0}if(!(i|(a|b)!=0)){J[4322]=68;a=d;d=a-1|0;e=e-!a|0;break a}if((e|0)==(h|0)&d>>>0>=k>>>0|e>>>0>h>>>0){break j}J[4322]=68;break a}a=i^k;d=a-i|0;b=i>>31;e=(b^h)-((a>>>0<i>>>0)+b|0)|0}la=l+16|0;ma=e;return d}function oj(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0;a=la-448|0;la=a;J[a+440>>2]=c;J[a+444>>2]=b;J[a+20>>2]=101;i=a+20|0;k=wg(a+24|0,a+32|0,i);b=a+16|0;le(b,e);h=Oc(b);H[a+15|0]=0;if(mj(a+444|0,c,d,b,J[e+4>>2],f,a+15|0,h,k,i,a+432|0)){b=la-16|0;la=b;a:{if(id(g)){c=J[g>>2];J[b+12>>2]=0;pj(c,b+12|0);be(g,0);break a}J[b+8>>2]=0;pj(g,b+8|0);Sd(g,0)}la=b+16|0;if(K[a+15|0]){Gm(g,je(h,45))}b=je(h,48);c=J[k>>2];h=J[a+20>>2];d=h-4|0;while(1){if(!((b|0)!=J[c>>2]|c>>>0>=d>>>0)){c=c+4|0;continue}break}e=la-16|0;la=e;d=jd(g);b=qj(g);i=rj(c,h);b:{if(!i){break b}if(!Rl(dd(g),(dd(g)+(jd(g)<<2)|0)+4|0,c)){if(i>>>0>b-d>>>0){sj(g,b,i+(d-b|0)|0,d,d)}b=dd(g)+(d<<2)|0;while(1){if((c|0)!=(h|0)){pj(b,c);c=c+4|0;b=b+4|0;continue}break}J[e+4>>2]=0;pj(b,e+4|0);cj(g,d+i|0);break b}d=la-16|0;la=d;b=e+4|0;ng(b,c,h);la=d+16|0;i=dd(b);c=jd(b);h=la-16|0;la=h;j=qj(g);d=jd(g);c:{if(c>>>0<=j-d>>>0){if(!c){break c}j=dd(g);Kc(j+(d<<2)|0,i,c);c=c+d|0;cj(g,c);J[h+12>>2]=0;pj(j+(c<<2)|0,h+12|0);break c}Em(g,j,d+(c-j|0)|0,d,d,0,c,i)}la=h+16|0;Fm(b)}la=e+16|0}if(Pc(a+444|0,a+440|0)){J[f>>2]=J[f>>2]|2}b=J[a+444>>2];ak(a+16|0);Bg(k);la=a+448|0;return b|0}function ee(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;if(Vd(b)){e=b>>>0<=4?4:b;j=a>>>0<=1?1:a;while(1){a:{a=(e+j|0)-1&0-e;d=a>>>0>j>>>0?a:j;a=0;i=la-16|0;la=i;if(!((d>>>0)%(e>>>0)|e&3)){k=i+12|0;b:{c:{if((e|0)==8){b=sb(d);break c}a=28;if(e&3|e>>>0<4){break b}b=e>>>2|0;if(b-1&b){break b}a=48;if(d>>>0>-64-e>>>0){break b}a=16;b=e>>>0<=16?16:e;c=b>>>0<=16?16:b;d:{if(!(c-1&c)){b=c;break d}while(1){b=a;a=b<<1;if(b>>>0<c>>>0){continue}break}}e:{if(d>>>0>=-64-b>>>0){J[4322]=48;a=0;break e}h=d>>>0<11?16:d+11&-8;f=sb((h+b|0)+12|0);a=0;if(!f){break e}a=f-8|0;f:{if(!(f&b-1)){b=a;break f}d=f-4|0;c=J[d>>2];g=b;b=((b+f|0)-1&0-b)-8|0;b=(b-a>>>0<=15?g:0)+b|0;g=b-a|0;f=(c&-8)-g|0;if(!(c&3)){a=J[a>>2];J[b+4>>2]=f;J[b>>2]=a+g;break f}J[b+4>>2]=f|J[b+4>>2]&1|2;c=b+f|0;J[c+4>>2]=J[c+4>>2]|1;J[d>>2]=g|J[d>>2]&1|2;c=a+g|0;J[c+4>>2]=J[c+4>>2]|1;vb(a,g)}c=J[b+4>>2];g:{if(!(c&3)){break g}a=c&-8;if(a>>>0<=h+16>>>0){break g}J[b+4>>2]=h|c&1|2;d=b+h|0;c=a-h|0;J[d+4>>2]=c|3;a=a+b|0;J[a+4>>2]=J[a+4>>2]|1;vb(d,c)}a=b+8|0}b=a}a=48;if(!b){break b}J[k>>2]=b;a=0}a=a?0:J[i+12>>2]}la=i+16|0;if(a){break a}b=J[5806];if(!b){break a}na[b|0]();continue}break}return a}return om(a)}function pb(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;c=la+-64|0;la=c;a=c+40|0;if(!K[17292]){k=17293,l=aa()|0,H[k|0]=l;H[17292]=1}i=+$();e=i/1e3;a:{if(R(e)<0x8000000000000000){f=~~e>>>0;if(R(e)>=1){b=~~(e>0?T(V(e*2.3283064365386963e-10),4294967295):W((e-+(~~e>>>0>>>0))*2.3283064365386963e-10))>>>0}else{b=0}break a}b=-2147483648}J[a>>2]=f;J[a+4>>2]=b;e=(i-(+(wn(f,b,1e3,0)>>>0)+ +(ma|0)*4294967296))*1e3*1e3;b:{if(R(e)<2147483648){b=~~e;break b}b=-2147483648}J[a+8>>2]=b;g=qb(c+24|0,c+40|0);J[c+12>>2]=J[c+48>>2]/1e3;h=c+16|0;b=h;a=J[c+12>>2];J[b>>2]=a;J[b+4>>2]=a>>31;f=la-32|0;la=f;b=la-16|0;la=b;j=la-16|0;la=j;a=la-16|0;la=a;k=a,l=wn(J[g>>2],J[g+4>>2],1e6,0),J[k>>2]=l;J[a+4>>2]=ma;d=qb(a+8|0,a);g=J[d>>2];d=J[d+4>>2];la=a+16|0;la=j+16|0;J[b+8>>2]=g;J[b+12>>2]=d;a=J[b+12>>2];d=f+8|0;J[d>>2]=J[b+8>>2];J[d+4>>2]=a;la=b+16|0;g=J[d>>2];d=J[d+4>>2];a=J[h+4>>2];J[f>>2]=J[h>>2];J[f+4>>2]=a;d=J[f+4>>2]+d|0;a=f;b=J[a>>2];g=g+b|0;J[a+16>>2]=g;J[a+20>>2]=b>>>0>g>>>0?d+1|0:d;a=qb(a+24|0,a+16|0);b=J[a>>2];a=J[a+4>>2];la=f+32|0;J[c+32>>2]=b;J[c+36>>2]=a;a=J[c+36>>2];b=c+56|0;J[b>>2]=J[c+32>>2];J[b+4>>2]=a;la=c- -64|0;ma=J[b+4>>2];return J[b>>2]}function _m(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0;if(Pm(a,J[b+8>>2],e)){Zm(b,c,d);return}a:{b:{if(Pm(a,J[b>>2],e)){if(!(J[b+16>>2]!=(c|0)&J[b+20>>2]!=(c|0))){if((d|0)!=1){break a}J[b+32>>2]=1;return}J[b+32>>2]=d;if(J[b+44>>2]==4){break b}f=a+16|0;d=f+(J[a+12>>2]<<3)|0;while(1){c:{d:{e:{f:{if(d>>>0<=f>>>0){break f}I[b+52>>1]=0;$m(f,b,c,c,1,e);if(K[b+54|0]){break f}if(!K[b+53|0]){break c}if(K[b+52|0]){if(J[b+24>>2]==1){break d}g=1;h=1;if(!(K[a+8|0]&2)){break d}break c}g=1;if(H[a+8|0]&1){break c}a=3;break e}a=g?3:4}J[b+44>>2]=a;if(h){break a}break b}J[b+44>>2]=3;break a}f=f+8|0;continue}}f=J[a+12>>2];g=a+16|0;an(g,b,c,d,e);if((f|0)<2){break a}g=g+(f<<3)|0;f=a+24|0;a=J[a+8>>2];if(!(!(a&2)&J[b+36>>2]!=1)){while(1){if(K[b+54|0]){break a}an(f,b,c,d,e);f=f+8|0;if(g>>>0>f>>>0){continue}break}break a}if(!(a&1)){while(1){if(K[b+54|0]|J[b+36>>2]==1){break a}an(f,b,c,d,e);f=f+8|0;if(g>>>0>f>>>0){continue}break a}}while(1){if(K[b+54|0]|J[b+36>>2]==1&J[b+24>>2]==1){break a}an(f,b,c,d,e);f=f+8|0;if(g>>>0>f>>>0){continue}break}break a}J[b+20>>2]=c;J[b+40>>2]=J[b+40>>2]+1;if(J[b+36>>2]!=1|J[b+24>>2]!=2){break a}H[b+54|0]=1}}function gi(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0;a=la-416|0;la=a;H[a+412|0]=0;H[a+413|0]=0;H[a+414|0]=0;H[a+415|0]=0;H[a+409|0]=0;H[a+410|0]=0;H[a+411|0]=0;H[a+412|0]=0;H[a+408|0]=37;m=Qh(a+409|0,1696,J[c+4>>2]);k=a+368|0;J[a+364>>2]=k;i=_g();a:{if(m){j=J[c+8>>2];l=a- -64|0;J[l>>2]=g;J[l+4>>2]=h;J[a+56>>2]=e;J[a+60>>2]=f;J[a+48>>2]=j;i=Ih(k,30,i,a+408|0,a+48|0);break a}J[a+80>>2]=e;J[a+84>>2]=f;J[a+88>>2]=g;J[a+92>>2]=h;i=Ih(a+368|0,30,i,a+408|0,a+80|0)}J[a+128>>2]=100;l=wg(a+356|0,0,a+128|0);k=a+368|0;j=k;b:{c:{if((i|0)>=30){i=_g();d:{if(m){j=J[c+8>>2];J[a+16>>2]=g;J[a+20>>2]=h;J[a+8>>2]=e;J[a+12>>2]=f;J[a>>2]=j;i=Rh(a+364|0,i,a+408|0,a);break d}J[a+32>>2]=e;J[a+36>>2]=f;J[a+40>>2]=g;J[a+44>>2]=h;i=Rh(a+364|0,i,a+408|0,a+32|0)}if((i|0)==-1){break c}xg(l,J[a+364>>2]);j=J[a+364>>2]}f=i+j|0;g=Jh(j,f,c);J[a+128>>2]=100;h=a+128|0;e=wg(a+120|0,0,h);e:{if(J[a+364>>2]==(a+368|0)){i=h;break e}i=sb(i<<3);if(!i){break c}xg(e,i);k=J[a+364>>2]}h=a+108|0;le(h,c);fi(k,g,f,i,a+116|0,a+112|0,h);ak(h);b=ai(b,i,J[a+116>>2],J[a+112>>2],c,d);Bg(e);Bg(l);la=a+416|0;break b}yd();B()}return b|0}function Th(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0,k=0,l=0,m=0;a=la-256|0;la=a;H[a+252|0]=0;H[a+253|0]=0;H[a+254|0]=0;H[a+255|0]=0;H[a+249|0]=0;H[a+250|0]=0;H[a+251|0]=0;H[a+252|0]=0;H[a+248|0]=37;m=Qh(a+249|0,1696,J[c+4>>2]);k=a+208|0;J[a+204>>2]=k;i=_g();a:{if(m){j=J[c+8>>2];l=a- -64|0;J[l>>2]=g;J[l+4>>2]=h;J[a+56>>2]=e;J[a+60>>2]=f;J[a+48>>2]=j;i=Ih(k,30,i,a+248|0,a+48|0);break a}J[a+80>>2]=e;J[a+84>>2]=f;J[a+88>>2]=g;J[a+92>>2]=h;i=Ih(a+208|0,30,i,a+248|0,a+80|0)}J[a+128>>2]=100;l=wg(a+196|0,0,a+128|0);k=a+208|0;j=k;b:{c:{if((i|0)>=30){i=_g();d:{if(m){j=J[c+8>>2];J[a+16>>2]=g;J[a+20>>2]=h;J[a+8>>2]=e;J[a+12>>2]=f;J[a>>2]=j;i=Rh(a+204|0,i,a+248|0,a);break d}J[a+32>>2]=e;J[a+36>>2]=f;J[a+40>>2]=g;J[a+44>>2]=h;i=Rh(a+204|0,i,a+248|0,a+32|0)}if((i|0)==-1){break c}xg(l,J[a+204>>2]);j=J[a+204>>2]}f=i+j|0;g=Jh(j,f,c);J[a+128>>2]=100;h=a+128|0;e=wg(a+120|0,0,h);e:{if(J[a+204>>2]==(a+208|0)){i=h;break e}i=sb(i<<1);if(!i){break c}xg(e,i);k=J[a+204>>2]}h=a+108|0;le(h,c);Sh(k,g,f,i,a+116|0,a+112|0,h);ak(h);b=Lh(b,i,J[a+116>>2],J[a+112>>2],c,d);Bg(e);Bg(l);la=a+256|0;break b}yd();B()}return b|0}function Dj(a,b,c,d,e,f,g,h,i){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0;a=la-1056|0;la=a;J[a+16>>2]=f;J[a+20>>2]=g;J[a+24>>2]=h;J[a+28>>2]=i;k=a+944|0;J[a+940>>2]=k;j=ag(k,a+16|0);J[a+528>>2]=100;k=a+528|0;o=wg(a+520|0,0,k);J[a+528>>2]=100;l=wg(a+512|0,0,k);a:{if(j>>>0>=100){j=_g();J[a>>2]=f;J[a+4>>2]=g;J[a+8>>2]=h;J[a+12>>2]=i;j=Rh(a+940|0,j,1484,a);if((j|0)==-1){break a}xg(o,J[a+940>>2]);xg(l,sb(j<<2));if(Bc(l)){break a}k=J[l>>2]}f=a+508|0;le(f,d);p=Oc(f);f=J[a+940>>2];vh(p,f,f+j|0,k);m=(j|0)>0?K[J[a+940>>2]]==45:m;n=Wc(a+484|0);f=Wc(a+472|0);g=Wc(a+460|0);Ej(c,m,a+508|0,a+504|0,a+500|0,a+496|0,n,f,g,a+456|0);J[a+48>>2]=100;h=wg(a+40|0,0,a+48|0);c=J[a+456>>2];b:{if((c|0)<(j|0)){i=(((jd(g)+(j-c<<1)|0)+jd(f)|0)+J[a+456>>2]|0)+1|0;break b}i=((jd(g)+jd(f)|0)+J[a+456>>2]|0)+2|0}c=a+48|0;if(i>>>0>=101){xg(h,sb(i<<2));c=J[h>>2];if(!c){break a}}Fj(c,a+36|0,a+32|0,J[d+4>>2],k,(j<<2)+k|0,p,m,a+504|0,J[a+500>>2],J[a+496>>2],n,f,g,J[a+456>>2]);b=ai(b,c,J[a+36>>2],J[a+32>>2],d,e);Bg(h);Fm(g);Fm(f);tm(n);ak(a+508|0);Bg(l);Bg(o);la=a+1056|0;return b|0}yd();B()}function ib(a,b,c){var d=0,e=0,f=0;if(c>>>0>=512){_(a|0,b|0,c|0);return a}e=a+c|0;a:{if(!((a^b)&3)){b:{if(!(a&3)){c=a;break b}if(!c){c=a;break b}c=a;while(1){H[c|0]=K[b|0];b=b+1|0;c=c+1|0;if(!(c&3)){break b}if(c>>>0<e>>>0){continue}break}}d=e&-4;c:{if(d>>>0<64){break c}f=d+-64|0;if(f>>>0<c>>>0){break c}while(1){J[c>>2]=J[b>>2];J[c+4>>2]=J[b+4>>2];J[c+8>>2]=J[b+8>>2];J[c+12>>2]=J[b+12>>2];J[c+16>>2]=J[b+16>>2];J[c+20>>2]=J[b+20>>2];J[c+24>>2]=J[b+24>>2];J[c+28>>2]=J[b+28>>2];J[c+32>>2]=J[b+32>>2];J[c+36>>2]=J[b+36>>2];J[c+40>>2]=J[b+40>>2];J[c+44>>2]=J[b+44>>2];J[c+48>>2]=J[b+48>>2];J[c+52>>2]=J[b+52>>2];J[c+56>>2]=J[b+56>>2];J[c+60>>2]=J[b+60>>2];b=b- -64|0;c=c- -64|0;if(f>>>0>=c>>>0){continue}break}}if(c>>>0>=d>>>0){break a}while(1){J[c>>2]=J[b>>2];b=b+4|0;c=c+4|0;if(d>>>0>c>>>0){continue}break}break a}if(e>>>0<4){c=a;break a}d=e-4|0;if(d>>>0<a>>>0){c=a;break a}c=a;while(1){H[c|0]=K[b|0];H[c+1|0]=K[b+1|0];H[c+2|0]=K[b+2|0];H[c+3|0]=K[b+3|0];b=b+4|0;c=c+4|0;if(d>>>0>=c>>>0){continue}break}}if(c>>>0<e>>>0){while(1){H[c|0]=K[b|0];b=b+1|0;c=c+1|0;if((e|0)!=(c|0)){continue}break}}return a}function xj(a,b,c,d,e,f,g,h,i){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;var j=0,k=0,l=0,m=0,n=0,o=0,p=0;a=la-448|0;la=a;J[a+16>>2]=f;J[a+20>>2]=g;J[a+24>>2]=h;J[a+28>>2]=i;k=a+336|0;J[a+332>>2]=k;j=ag(k,a+16|0);J[a+224>>2]=100;k=a+224|0;o=wg(a+216|0,0,k);J[a+224>>2]=100;l=wg(a+208|0,0,k);a:{if(j>>>0>=100){j=_g();J[a>>2]=f;J[a+4>>2]=g;J[a+8>>2]=h;J[a+12>>2]=i;j=Rh(a+332|0,j,1484,a);if((j|0)==-1){break a}xg(o,J[a+332>>2]);xg(l,sb(j));if(Bc(l)){break a}k=J[l>>2]}f=a+204|0;le(f,d);p=hc(f);f=J[a+332>>2];Zg(p,f,f+j|0,k);m=(j|0)>0?K[J[a+332>>2]]==45:m;n=Wc(a+184|0);f=Wc(a+172|0);g=Wc(a+160|0);yj(c,m,a+204|0,a+200|0,a+199|0,a+198|0,n,f,g,a+156|0);J[a+48>>2]=100;h=wg(a+40|0,0,a+48|0);c=J[a+156>>2];b:{if((c|0)<(j|0)){i=(((jd(g)+(j-c<<1)|0)+jd(f)|0)+J[a+156>>2]|0)+1|0;break b}i=((jd(g)+jd(f)|0)+J[a+156>>2]|0)+2|0}c=a+48|0;if(i>>>0>=101){xg(h,sb(i));c=J[h>>2];if(!c){break a}}zj(c,a+36|0,a+32|0,J[d+4>>2],k,j+k|0,p,m,a+200|0,H[a+199|0],H[a+198|0],n,f,g,J[a+156>>2]);b=Lh(b,c,J[a+36>>2],J[a+32>>2],d,e);Bg(h);tm(g);tm(f);tm(n);ak(a+204|0);Bg(l);Bg(o);la=a+448|0;return b|0}yd();B()}function af(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=la-32|0;la=d;a:{if(K[a+52|0]){c=J[a+48>>2];if(!b){break a}H[a+52|0]=0;J[a+48>>2]=-1;break a}b:{if(K[a+53|0]){e=d+24|0;c=J[a+32>>2];c:{if(J[c+76>>2]<0){c=xe(c);break c}c=xe(c)}if((c|0)!=-1){J[e>>2]=c}if((c|0)==-1){break b}c=J[d+24>>2];d:{if(!b){if(!df(c,J[a+32>>2])){break b}break d}J[a+48>>2]=c}break a}J[d+24>>2]=1;e=J[Te(d+24|0,a+44|0)>>2];f=(e|0)>0?e:0;while(1){if((c|0)!=(f|0)){g=te(J[a+32>>2]);if((g|0)==-1){break b}H[(d+24|0)+c|0]=g;c=c+1|0;continue}break}g=d+24|0;e:{while(1){f:{f=J[a+40>>2];c=J[f>>2];i=J[f+4>>2];g:{h=f;f=d+24|0;j=f;f=e+f|0;switch(xd(J[a+36>>2],h,j,f,d+16|0,d+20|0,g,d+12|0)-1|0){case 2:break f;case 0:break g;case 1:break b;default:break e}}h=J[a+40>>2];J[h>>2]=c;J[h+4>>2]=i;if((e|0)==8){break b}c=te(J[a+32>>2]);if((c|0)==-1){break b}H[f|0]=c;e=e+1|0;continue}break}J[d+20>>2]=H[d+24|0]}h:{if(!b){while(1){if((e|0)<=0){break h}e=e-1|0;if((re(H[e+(d+24|0)|0],J[a+32>>2])|0)!=-1){continue}break b}}J[a+48>>2]=J[d+20>>2]}c=J[d+20>>2];break a}c=-1}la=d+32|0;return c}function Pe(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;d=la-32|0;la=d;a:{if(K[a+52|0]){c=J[a+48>>2];if(!b){break a}H[a+52|0]=0;J[a+48>>2]=-1;break a}b:{if(K[a+53|0]){e=d+24|0;c=te(J[a+32>>2]);if((c|0)!=-1){H[e|0]=c}if((c|0)==-1){break b}e=H[d+24|0];c=_b(e);c:{if(!b){if(!Se(c,J[a+32>>2])){break b}break c}J[a+48>>2]=c}c=_b(e);break a}J[d+24>>2]=1;e=J[Te(d+24|0,a+44|0)>>2];f=(e|0)>0?e:0;while(1){if((c|0)!=(f|0)){g=te(J[a+32>>2]);if((g|0)==-1){break b}H[(d+24|0)+c|0]=g;c=c+1|0;continue}break}g=d+24|0;d:{while(1){e:{f=J[a+40>>2];c=J[f>>2];i=J[f+4>>2];f:{h=f;f=d+24|0;j=f;f=e+f|0;switch(xd(J[a+36>>2],h,j,f,d+16|0,d+23|0,g,d+12|0)-1|0){case 2:break e;case 0:break f;case 1:break b;default:break d}}h=J[a+40>>2];J[h>>2]=c;J[h+4>>2]=i;if((e|0)==8){break b}c=te(J[a+32>>2]);if((c|0)==-1){break b}H[f|0]=c;e=e+1|0;continue}break}H[d+23|0]=K[d+24|0]}g:{if(!b){while(1){if((e|0)<=0){break g}e=e-1|0;if((re(_b(H[e+(d+24|0)|0]),J[a+32>>2])|0)!=-1){continue}break b}}k=a,l=_b(H[d+23|0]),J[k+48>>2]=l}c=_b(H[d+23|0]);break a}c=-1}la=d+32|0;return c}function tg(a,b,c,d,e,f,g){var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;j=la-128|0;la=j;J[j+124>>2]=b;k=vg(c,d);J[j+16>>2]=100;i=j+16|0;o=wg(j+8|0,0,i);a:{b:{if(k>>>0>=101){i=sb(k);if(!i){break b}xg(o,i)}h=i;b=c;while(1)if((b|0)==(d|0)){c:while(1){if(s=ic(a,j+124|0),t=1,u=k,u?s:t){if(ic(a,j+124|0)){J[f>>2]=J[f>>2]|2}break a}b=jc(a);n=p+1|0;q=0;if(!g){b=yg(e,b)}r=b&255;h=i;b=c;while(1)if((b|0)==(d|0)){p=n;if(!q){continue c}lc(a);h=i;b=c;if(k+m>>>0<2){continue c}while(1){if((b|0)==(d|0)){continue c}d:{if(K[h|0]!=2){break d}if((jd(b)|0)==(n|0)){break d}H[h|0]=0;m=m-1|0}h=h+1|0;b=b+12|0;continue}}else{e:{if(K[h|0]!=1){break e}l=K[zg(b,p)|0];if(!g){l=yg(e,l<<24>>24)}f:{if((l&255)==(r|0)){q=1;if((jd(b)|0)!=(n|0)){break e}H[h|0]=2;m=m+1|0;break f}H[h|0]=0}k=k-1|0}h=h+1|0;b=b+12|0;continue}}}else{l=Ag(b);H[h|0]=l?2:1;h=h+1|0;b=b+12|0;m=m+l|0;k=k-l|0;continue}}yd();B()}g:{h:{while(1){if((c|0)==(d|0)){break h}if(K[i|0]!=2){i=i+1|0;c=c+12|0;continue}break}d=c;break g}J[f>>2]=J[f>>2]|4}Bg(o);la=j+128|0;return d}function Xa(a){var b=0,c=0,d=0;b=J[a+140>>2];if(b){c=b;d=J[a+144>>2];if((b|0)!=(d|0)){while(1){c=d-12|0;if(H[d-1|0]<0){tb(J[c>>2])}d=c;if((d|0)!=(b|0)){continue}break}c=J[a+140>>2]}J[a+144>>2]=b;tb(c)}if(H[a+139|0]<0){tb(J[a+128>>2])}b=J[a+92>>2];if(b){c=b;d=J[a+96>>2];if((b|0)!=(d|0)){while(1){c=d-20|0;if(H[d-9|0]<0){tb(J[c>>2])}d=c;if((d|0)!=(b|0)){continue}break}c=J[a+92>>2]}J[a+96>>2]=b;tb(c)}b=J[a+80>>2];if(b){c=b;d=J[a+84>>2];if((b|0)!=(d|0)){while(1){c=d-20|0;if(H[d-9|0]<0){tb(J[c>>2])}d=c;if((d|0)!=(b|0)){continue}break}c=J[a+80>>2]}J[a+84>>2]=b;tb(c)}b=J[a+68>>2];if(b){c=b;d=J[a+72>>2];if((b|0)!=(d|0)){while(1){c=d-20|0;if(H[d-9|0]<0){tb(J[c>>2])}d=c;if((d|0)!=(b|0)){continue}break}c=J[a+68>>2]}J[a+72>>2]=b;tb(c)}if(H[a+63|0]<0){tb(J[a+52>>2])}if(H[a+51|0]<0){tb(J[a+40>>2])}b=J[a+28>>2];if(b){c=b;d=J[a+32>>2];if((b|0)!=(d|0)){while(1){c=d-20|0;if(H[d-9|0]<0){tb(J[c>>2])}d=c;if((d|0)!=(b|0)){continue}break}c=J[a+28>>2]}J[a+32>>2]=b;tb(c)}if(H[a+23|0]<0){tb(J[a+12>>2])}if(H[a+11|0]<0){tb(J[a>>2])}return a}function fh(a,b,c,d,e,f,g){var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;j=la-128|0;la=j;J[j+124>>2]=b;k=vg(c,d);J[j+16>>2]=100;i=j+16|0;p=wg(j+8|0,0,i);a:{b:{if(k>>>0>=101){i=sb(k);if(!i){break b}xg(p,i)}h=i;b=c;while(1)if((b|0)==(d|0)){c:while(1){if(s=Pc(a,j+124|0),t=1,u=k,u?s:t){if(Pc(a,j+124|0)){J[f>>2]=J[f>>2]|2}break a}n=Qc(a);if(!g){n=he(e,n)}o=q+1|0;r=0;h=i;b=c;while(1)if((b|0)==(d|0)){q=o;if(!r){continue c}Sc(a);h=i;b=c;if(k+m>>>0<2){continue c}while(1){if((b|0)==(d|0)){continue c}d:{if(K[h|0]!=2){break d}if((jd(b)|0)==(o|0)){break d}H[h|0]=0;m=m-1|0}h=h+1|0;b=b+12|0;continue}}else{e:{if(K[h|0]!=1){break e}l=J[gh(b,q)>>2];if(!g){l=he(e,l)}f:{if((l|0)==(n|0)){r=1;if((jd(b)|0)!=(o|0)){break e}H[h|0]=2;m=m+1|0;break f}H[h|0]=0}k=k-1|0}h=h+1|0;b=b+12|0;continue}}}else{l=Ag(b);H[h|0]=l?2:1;h=h+1|0;b=b+12|0;m=m+l|0;k=k-l|0;continue}}yd();B()}g:{h:{while(1){if((c|0)==(d|0)){break h}if(K[i|0]!=2){i=i+1|0;c=c+12|0;continue}break}d=c;break g}J[f>>2]=J[f>>2]|4}Bg(p);la=j+128|0;return d}function Rm(a,b){var c=0,d=0,e=0,f=0;c=la-112|0;la=c;d=J[a>>2];e=J[d-4>>2];f=J[d-8>>2];J[c+80>>2]=0;J[c+84>>2]=0;J[c+88>>2]=0;J[c+92>>2]=0;J[c+96>>2]=0;J[c+100>>2]=0;H[c+103|0]=0;H[c+104|0]=0;H[c+105|0]=0;H[c+106|0]=0;H[c+107|0]=0;H[c+108|0]=0;H[c+109|0]=0;H[c+110|0]=0;J[c+72>>2]=0;J[c+76>>2]=0;J[c+68>>2]=0;J[c+64>>2]=16076;J[c+60>>2]=a;J[c+56>>2]=b;d=a+f|0;a:{if(Pm(e,b,0)){a=f?0:d;break a}if((a|0)>=(d|0)){H[c+47|0]=0;H[c+48|0]=0;H[c+49|0]=0;H[c+50|0]=0;H[c+51|0]=0;H[c+52|0]=0;H[c+53|0]=0;H[c+54|0]=0;f=c+24|0;J[f>>2]=0;J[f+4>>2]=0;J[c+32>>2]=0;J[c+36>>2]=0;J[c+40>>2]=0;J[c+44>>2]=0;J[c+16>>2]=0;J[c+20>>2]=0;J[c+12>>2]=0;J[c+8>>2]=b;J[c+4>>2]=a;J[c>>2]=e;J[c+48>>2]=1;na[J[J[e>>2]+20>>2]](e,c,d,d,1,0);if(J[f>>2]){break a}}a=0;na[J[J[e>>2]+24>>2]](e,c+56|0,d,1,0);b:{switch(J[c+92>>2]){case 0:a=J[c+96>>2]==1?J[c+84>>2]==1?J[c+88>>2]==1?J[c+76>>2]:0:0:0;break a;case 1:break b;default:break a}}if(J[c+80>>2]!=1){if(J[c+96>>2]|J[c+84>>2]!=1|J[c+88>>2]!=1){break a}}a=J[c+72>>2]}la=c+112|0;return a}function Ff(a,b,c,d){var e=0,f=0,g=0,h=0;g=la-32|0;la=g;e=d&2147483647;h=e;f=e-1006698496|0;e=e-1140785152|0;a:{if((f|0)==(e|0)&0|e>>>0>f>>>0){e=c<<4|b>>>28;c=d<<4|c>>>28;b=b&268435455;if((b|0)==134217728&(a|0)!=0|b>>>0>134217728){f=c+1073741824|0;e=e+1|0;f=e?f:f+1|0;break a}f=c+1073741824|0;if(a|(b|0)!=134217728){break a}a=e&1;e=a+e|0;f=a>>>0>e>>>0?f+1|0:f;break a}if(!(!c&(h|0)==2147418112?!(a|b):h>>>0<2147418112)){a=d<<4|c>>>28;e=c<<4|b>>>28;f=a&524287|2146959360;break a}e=0;f=2146435072;if(h>>>0>1140785151){break a}f=0;h=h>>>16|0;if(h>>>0<15249){break a}e=d&65535|65536;mf(g+16|0,a,b,c,e,h-15233|0);of(g,a,b,c,e,15361-h|0);b=J[g+8>>2];e=b<<4;b=J[g+12>>2]<<4|b>>>28;c=J[g>>2];f=J[g+4>>2];h=f;e=f>>>28|e;f=b;a=h&268435455;b=c|(J[g+16>>2]|J[g+24>>2]|(J[g+20>>2]|J[g+28>>2]))!=0;if((a|0)==134217728&(b|0)!=0|a>>>0>134217728){e=e+1|0;f=e?f:f+1|0;break a}if(b|(a|0)!=134217728){break a}a=e;e=e+(e&1)|0;f=a>>>0>e>>>0?f+1|0:f}la=g+32|0;x(0,e|0);x(1,d&-2147483648|f);return+z()}function Na(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;h=la-16|0;la=h;l=wc(h+4|0,a);a:{if(!K[l|0]){break a}i=b+c|0;g=J[J[a>>2]-12>>2]+a|0;j=(J[g+4>>2]&176)==32?i:b;e=J[g+24>>2];c=J[g+76>>2];if((c|0)==-1){d=h+12|0;le(d,g);c=ug(d,21384);c=na[J[J[c>>2]+28>>2]](c,32)|0;ak(d);J[g+76>>2]=c}m=c<<24>>24;c=0;d=la-16|0;la=d;b:{c:{d:{if(!e){break d}f=J[g+12>>2];k=j-b|0;if((k|0)>0){if((na[J[J[e>>2]+48>>2]](e,b,k)|0)!=(k|0)){break d}}b=i-b|0;b=(b|0)<(f|0)?f-b|0:0;if((b|0)>0){if(b>>>0>=2147483632){break c}e:{if(b>>>0>=11){c=(b|15)+1|0;f=om(c);J[d+12>>2]=c|-2147483648;J[d+4>>2]=f;J[d+8>>2]=b;break e}H[d+15|0]=b;f=d+4|0}c=0;n=kb(f,m,b)+b|0,o=0,H[n|0]=o;f=na[J[J[e>>2]+48>>2]](e,H[d+15|0]<0?J[d+4>>2]:d+4|0,b)|0;if(H[d+15|0]<0){tb(J[d+4>>2])}if((b|0)!=(f|0)){break d}}b=i-j|0;if((b|0)>0){if((na[J[J[e>>2]+48>>2]](e,j,b)|0)!=(b|0)){break d}}J[g+12>>2]=0;c=e}la=d+16|0;break b}Ba();B()}if(c){break a}b=J[J[a>>2]-12>>2]+a|0;me(b,J[b+16>>2]|5)}xc(l);la=h+16|0;return a}function lj(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0;a=la-624|0;la=a;J[a+616>>2]=c;J[a+620>>2]=b;J[a+16>>2]=101;h=a+16|0;b=wg(a+200|0,a+208|0,h);i=a+192|0;le(i,e);j=Oc(i);H[a+191|0]=0;a:{if(!mj(a+620|0,c,d,i,J[e+4>>2],f,a+191|0,j,b,a+196|0,a+608|0)){break a}H[a+190|0]=0;H[a+188|0]=56;H[a+189|0]=57;H[a+180|0]=48;H[a+181|0]=49;H[a+182|0]=50;H[a+183|0]=51;H[a+184|0]=52;H[a+185|0]=53;H[a+186|0]=54;H[a+187|0]=55;vh(j,a+180|0,a+190|0,a+128|0);J[a+16>>2]=100;d=wg(a+8|0,0,h);e=h;b:{c=J[a+196>>2]-J[b>>2]|0;if((c|0)>=393){xg(d,sb((c>>2)+2|0));if(!J[d>>2]){break b}e=J[d>>2]}if(K[a+191|0]){H[e|0]=45;e=e+1|0}c=J[b>>2];while(1){if(M[a+196>>2]<=c>>>0){c:{H[e|0]=0;J[a>>2]=g;if(($f(a+16|0,a)|0)!=1){break c}Bg(d);break a}}else{h=a+128|0;k=e,l=K[(a+180|0)+(wh(h,a+168|0,c)-h>>2)|0],H[k|0]=l;e=e+1|0;c=c+4|0;continue}break}yd();B()}yd();B()}if(Pc(a+620|0,a+616|0)){J[f>>2]=J[f>>2]|2}c=J[a+620>>2];ak(a+192|0);Bg(b);la=a+624|0;return c|0}function Wi(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0;a=la-272|0;la=a;J[a+264>>2]=c;J[a+268>>2]=b;J[a+16>>2]=101;h=a+16|0;b=wg(a+152|0,a+160|0,h);i=a+144|0;le(i,e);j=hc(i);H[a+143|0]=0;a:{if(!Xi(a+268|0,c,d,i,J[e+4>>2],f,a+143|0,j,b,a+148|0,a+260|0)){break a}H[a+142|0]=0;H[a+140|0]=56;H[a+141|0]=57;H[a+132|0]=48;H[a+133|0]=49;H[a+134|0]=50;H[a+135|0]=51;H[a+136|0]=52;H[a+137|0]=53;H[a+138|0]=54;H[a+139|0]=55;Zg(j,a+132|0,a+142|0,a+122|0);J[a+16>>2]=100;d=wg(a+8|0,0,h);e=h;b:{c=J[a+148>>2]-J[b>>2]|0;if((c|0)>=99){xg(d,sb(c+2|0));if(!J[d>>2]){break b}e=J[d>>2]}if(K[a+143|0]){H[e|0]=45;e=e+1|0}c=J[b>>2];while(1){if(M[a+148>>2]<=c>>>0){c:{H[e|0]=0;J[a>>2]=g;if(($f(a+16|0,a)|0)!=1){break c}Bg(d);break a}}else{k=e,l=K[((ah(a+122|0,a+132|0,c)-a|0)+a|0)+10|0],H[k|0]=l;e=e+1|0;c=c+1|0;continue}break}yd();B()}yd();B()}if(ic(a+268|0,a+264|0)){J[f>>2]=J[f>>2]|2}c=J[a+268>>2];ak(a+144|0);Bg(b);la=a+272|0;return c|0}function ei(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=+e;var f=0,g=0,h=0,i=0,j=0,k=0,l=0;a=la-368|0;la=a;H[a+364|0]=0;H[a+365|0]=0;H[a+366|0]=0;H[a+367|0]=0;H[a+361|0]=0;H[a+362|0]=0;H[a+363|0]=0;H[a+364|0]=0;H[a+360|0]=37;i=Qh(a+361|0,2918,J[c+4>>2]);h=a+320|0;J[a+316>>2]=h;f=_g();a:{if(i){g=J[c+8>>2];O[a+40>>3]=e;J[a+32>>2]=g;f=Ih(h,30,f,a+360|0,a+32|0);break a}O[a+48>>3]=e;f=Ih(a+320|0,30,f,a+360|0,a+48|0)}J[a+80>>2]=100;k=wg(a+308|0,0,a+80|0);j=a+320|0;g=j;b:{c:{if((f|0)>=30){f=_g();d:{if(i){g=J[c+8>>2];O[a+8>>3]=e;J[a>>2]=g;f=Rh(a+316|0,f,a+360|0,a);break d}O[a+16>>3]=e;f=Rh(a+316|0,f,a+360|0,a+16|0)}if((f|0)==-1){break c}xg(k,J[a+316>>2]);g=J[a+316>>2]}i=f+g|0;l=Jh(g,i,c);J[a+80>>2]=100;h=a+80|0;g=wg(a+72|0,0,h);e:{if(J[a+316>>2]==(a+320|0)){f=h;break e}f=sb(f<<3);if(!f){break c}xg(g,f);j=J[a+316>>2]}h=a+60|0;le(h,c);fi(j,l,i,f,a+68|0,a- -64|0,h);ak(h);b=ai(b,f,J[a+68>>2],J[a+64>>2],c,d);Bg(g);Bg(k);la=a+368|0;break b}yd();B()}return b|0}function Ph(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=+e;var f=0,g=0,h=0,i=0,j=0,k=0,l=0;a=la-208|0;la=a;H[a+204|0]=0;H[a+205|0]=0;H[a+206|0]=0;H[a+207|0]=0;H[a+201|0]=0;H[a+202|0]=0;H[a+203|0]=0;H[a+204|0]=0;H[a+200|0]=37;i=Qh(a+201|0,2918,J[c+4>>2]);h=a+160|0;J[a+156>>2]=h;f=_g();a:{if(i){g=J[c+8>>2];O[a+40>>3]=e;J[a+32>>2]=g;f=Ih(h,30,f,a+200|0,a+32|0);break a}O[a+48>>3]=e;f=Ih(a+160|0,30,f,a+200|0,a+48|0)}J[a+80>>2]=100;k=wg(a+148|0,0,a+80|0);j=a+160|0;g=j;b:{c:{if((f|0)>=30){f=_g();d:{if(i){g=J[c+8>>2];O[a+8>>3]=e;J[a>>2]=g;f=Rh(a+156|0,f,a+200|0,a);break d}O[a+16>>3]=e;f=Rh(a+156|0,f,a+200|0,a+16|0)}if((f|0)==-1){break c}xg(k,J[a+156>>2]);g=J[a+156>>2]}i=f+g|0;l=Jh(g,i,c);J[a+80>>2]=100;h=a+80|0;g=wg(a+72|0,0,h);e:{if(J[a+156>>2]==(a+160|0)){f=h;break e}f=sb(f<<1);if(!f){break c}xg(g,f);j=J[a+156>>2]}h=a+60|0;le(h,c);Sh(j,l,i,f,a+68|0,a- -64|0,h);ak(h);b=Lh(b,f,J[a+68>>2],J[a+64>>2],c,d);Bg(g);Bg(k);la=a+208|0;break b}yd();B()}return b|0}function Da(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;a:{b:{c:{d=J[a+4>>2];e=J[a>>2];h=(d-e|0)/20|0;c=h+1|0;if(c>>>0<214748365){g=(J[a+8>>2]-e|0)/20|0;i=g<<1;c=g>>>0>=107374182?214748364:c>>>0<i>>>0?i:c;if(c){if(c>>>0>=214748365){break c}f=om(P(c,20))}g=P(c,20);c=P(h,20)+f|0;d:{if(H[b+11|0]>=0){i=J[b+4>>2];J[c>>2]=J[b>>2];J[c+4>>2]=i;J[c+8>>2]=J[b+8>>2];break d}vm(c,J[b>>2],J[b+4>>2]);e=J[a>>2];d=J[a+4>>2]}g=f+g|0;f=P(h,20)+f|0;h=J[b+16>>2];J[f+12>>2]=J[b+12>>2];J[f+16>>2]=h;f=c+20|0;if((d|0)==(e|0)){break b}while(1){d=d-20|0;b=J[d+4>>2];c=c-20|0;J[c>>2]=J[d>>2];J[c+4>>2]=b;b=d+8|0;J[c+8>>2]=J[b>>2];J[d>>2]=0;J[d+4>>2]=0;J[b>>2]=0;b=J[d+16>>2];J[c+12>>2]=J[d+12>>2];J[c+16>>2]=b;if((d|0)!=(e|0)){continue}break}J[a+8>>2]=g;b=J[a+4>>2];J[a+4>>2]=f;e=J[a>>2];J[a>>2]=c;if((b|0)==(e|0)){break a}while(1){a=b-20|0;if(H[b-9|0]<0){tb(J[a>>2])}b=a;if((b|0)!=(e|0)){continue}break}break a}Ra();B()}Va();B()}J[a+8>>2]=g;J[a+4>>2]=f;J[a>>2]=c}if(e){tb(e)}}function rh(a,b,c,d,e,f,g,h,i,j,k,l){var m=0,n=0,o=0;m=la-16|0;la=m;J[m+12>>2]=a;a:{b:{if((a|0)==(f|0)){if(!K[b|0]){break b}a=0;H[b|0]=0;b=J[e>>2];J[e>>2]=b+1;H[b|0]=46;if(!jd(h)){break a}b=J[j>>2];if((b-i|0)>159){break a}c=J[k>>2];J[j>>2]=b+4;J[b>>2]=c;break a}c:{if((a|0)!=(g|0)){break c}if(!jd(h)){break c}if(!K[b|0]){break b}a=0;b=J[j>>2];if((b-i|0)>159){break a}a=J[k>>2];J[j>>2]=b+4;J[b>>2]=a;a=0;J[k>>2]=0;break a}a=-1;l=wh(l,l+128|0,m+12|0)-l|0;g=l>>2;if((g|0)>31){break a}f=H[g+9056|0];d:{e:{a=l&-5;if((a|0)!=88){if((a|0)!=96){break e}b=J[e>>2];if((b|0)!=(d|0)){a=-1;if((Nf(H[b-1|0])|0)!=(Nf(H[c|0])|0)){break a}}J[e>>2]=b+1;H[b|0]=f;a=0;break a}H[c|0]=80;break d}a=Nf(f);if((a|0)!=H[c|0]){break d}n=c,o=Of(a),H[n|0]=o;if(!K[b|0]){break d}H[b|0]=0;if(!jd(h)){break d}a=J[j>>2];if((a-i|0)>159){break d}b=J[k>>2];J[j>>2]=a+4;J[a>>2]=b}a=J[e>>2];J[e>>2]=a+1;H[a|0]=f;a=0;if((g|0)>21){break a}J[k>>2]=J[k>>2]+1;break a}a=-1}la=m+16|0;return a}function Sg(a,b,c,d,e,f,g,h,i,j,k,l){var m=0,n=0,o=0;m=la-16|0;la=m;H[m+15|0]=a;a:{b:{if((a|0)==(f|0)){if(!K[b|0]){break b}a=0;H[b|0]=0;b=J[e>>2];J[e>>2]=b+1;H[b|0]=46;if(!jd(h)){break a}b=J[j>>2];if((b-i|0)>159){break a}c=J[k>>2];J[j>>2]=b+4;J[b>>2]=c;break a}c:{if((a|0)!=(g|0)){break c}if(!jd(h)){break c}if(!K[b|0]){break b}a=0;b=J[j>>2];if((b-i|0)>159){break a}a=J[k>>2];J[j>>2]=b+4;J[b>>2]=a;a=0;J[k>>2]=0;break a}a=-1;f=ah(l,l+32|0,m+15|0)-l|0;if((f|0)>31){break a}g=H[f+9056|0];d:{e:{switch((f&-2)-22|0){case 2:b=J[e>>2];if((b|0)!=(d|0)){if((Nf(H[b-1|0])|0)!=(Nf(H[c|0])|0)){break a}}J[e>>2]=b+1;H[b|0]=g;a=0;break a;case 0:H[c|0]=80;break d;default:break e}}a=Nf(g);if((a|0)!=H[c|0]){break d}n=c,o=Of(a),H[n|0]=o;if(!K[b|0]){break d}H[b|0]=0;if(!jd(h)){break d}a=J[j>>2];if((a-i|0)>159){break d}b=J[k>>2];J[j>>2]=a+4;J[a>>2]=b}a=J[e>>2];J[e>>2]=a+1;H[a|0]=g;a=0;if((f|0)>21){break a}J[k>>2]=J[k>>2]+1;break a}a=-1}la=m+16|0;return a}function aj(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0;a=la-144|0;la=a;J[a+136>>2]=c;J[a+140>>2]=b;J[a+20>>2]=101;i=a+20|0;j=wg(a+24|0,a+32|0,i);b=a+16|0;le(b,e);h=hc(b);H[a+15|0]=0;if(Xi(a+140|0,c,d,b,J[e+4>>2],f,a+15|0,h,j,i,a+132|0)){b=la-16|0;la=b;a:{if(id(g)){c=J[g>>2];H[b+15|0]=0;Td(c,b+15|0);be(g,0);break a}H[b+14|0]=0;Td(g,b+14|0);Sd(g,0)}la=b+16|0;if(K[a+15|0]){Cm(g,he(h,45))}b=he(h,48);c=J[j>>2];h=J[a+20>>2];d=h-1|0;b=b&255;while(1){if(!((b|0)!=K[c|0]|c>>>0>=d>>>0)){c=c+1|0;continue}break}e=la-16|0;la=e;d=jd(g);b=kd(g);i=Wd(c,h);b:{if(!i){break b}if(!Rl(dd(g),(dd(g)+jd(g)|0)+1|0,c)){if(b-d>>>0<i>>>0){bj(g,b,(d-b|0)+i|0,d,d)}b=dd(g)+d|0;while(1){if((c|0)!=(h|0)){Td(b,c);c=c+1|0;b=b+1|0;continue}break}H[e+15|0]=0;Td(b,e+15|0);cj(g,d+i|0);break b}b=gd(e,c,h);xm(g,dd(b),jd(b));tm(b)}la=e+16|0}if(ic(a+140|0,a+136|0)){J[f>>2]=J[f>>2]|2}b=J[a+140>>2];ak(a+16|0);Bg(j);la=a+144|0;return b|0}function Qk(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;var i=0,j=0;a=la-16|0;la=a;J[a+12>>2]=c;J[a+8>>2]=f;j=a+12|0;J[j>>2]=c;b=a+8|0;J[b>>2]=f;f=J[j>>2];a:{while(1){if(d>>>0<=f>>>0){c=0;break a}c=2;f=J[f>>2];if(f>>>0>1114111|(f&-2048)==55296){break a}b:{c:{if(f>>>0<=127){c=1;i=J[b>>2];if((g-i|0)<=0){break a}J[b>>2]=i+1;H[i|0]=f;break c}if(f>>>0<=2047){c=J[b>>2];if((g-c|0)<2){break b}J[b>>2]=c+1;H[c|0]=f>>>6|192;c=J[b>>2];J[b>>2]=c+1;H[c|0]=f&63|128;break c}c=J[b>>2];i=g-c|0;if(f>>>0<=65535){if((i|0)<3){break b}J[b>>2]=c+1;H[c|0]=f>>>12|224;c=J[b>>2];J[b>>2]=c+1;H[c|0]=f>>>6&63|128;c=J[b>>2];J[b>>2]=c+1;H[c|0]=f&63|128;break c}if((i|0)<4){break b}J[b>>2]=c+1;H[c|0]=f>>>18|240;c=J[b>>2];J[b>>2]=c+1;H[c|0]=f>>>12&63|128;c=J[b>>2];J[b>>2]=c+1;H[c|0]=f>>>6&63|128;c=J[b>>2];J[b>>2]=c+1;H[c|0]=f&63|128}f=J[j>>2]+4|0;J[j>>2]=f;continue}break}c=1}J[e>>2]=J[a+12>>2];J[h>>2]=J[a+8>>2];la=a+16|0;return c|0}function Sk(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;a=c;a:{if((d-a|0)<3){break a}}while(1){b:{if(e>>>0<=h>>>0|a>>>0>=d>>>0){break b}b=H[a|0];g=b&255;c:{if((b|0)>=0){b=1;break c}if(b>>>0<4294967234){break b}if(b>>>0<=4294967263){if((K[a+1|0]&192)!=128|(d-a|0)<2){break b}b=2;break c}if(b>>>0<=4294967279){if((d-a|0)<3){break b}f=K[a+2|0];b=K[a+1|0];d:{e:{if((g|0)!=237){if((g|0)!=224){break e}if((b&224)==160){break d}break b}if((b&224)!=128){break b}break d}if((b&192)!=128){break b}}if((f&192)!=128){break b}b=3;break c}if((d-a|0)<4|b>>>0>4294967284){break b}i=K[a+3|0];j=K[a+2|0];f=K[a+1|0];f:{g:{switch(g-240|0){case 0:if((f+112&255)>>>0>=48){break b}break f;case 4:if((f&240)!=128){break b}break f;default:break g}}if((f&192)!=128){break b}}if((j&192)!=128|(i&192)!=128){break b}b=4;if((i&63|(j<<6&4032|(g<<18&1835008|(f&63)<<12)))>>>0>1114111){break b}}h=h+1|0;a=a+b|0;continue}break}return a-c|0}function Ok(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;a=c;a:{if((d-a|0)<3){break a}}while(1){b:{if(e>>>0<=g>>>0|a>>>0>=d>>>0){break b}b=K[a|0];f=a+1|0;c:{if(b<<24>>24>=0){break c}if(b>>>0<194){break b}if(b>>>0<=223){if((K[a+1|0]&192)!=128|(d-a|0)<2){break b}f=a+2|0;break c}if(b>>>0<=239){if((d-a|0)<3){break b}h=K[a+2|0];f=K[a+1|0];d:{e:{if((b|0)!=237){if((b|0)!=224){break e}if((f&224)==160){break d}break b}if((f&224)!=128){break b}break d}if((f&192)!=128){break b}}if((h&192)!=128){break b}f=a+3|0;break c}if((d-a|0)<4|b>>>0>244|e-g>>>0<2){break b}h=K[a+3|0];i=K[a+2|0];f=K[a+1|0];f:{g:{switch(b-240|0){case 0:if((f+112&255)>>>0>=48){break b}break f;case 4:if((f&240)!=128){break b}break f;default:break g}}if((f&192)!=128){break b}}if((i&192)!=128|(h&192)!=128|(h&63|(i<<6&4032|(b<<18&1835008|(f&63)<<12)))>>>0>1114111){break b}g=g+1|0;f=a+4|0}a=f;g=g+1|0;continue}break}return a-c|0}function yi(a,b,c,d,e,f,g,h){var i=0,j=0,k=0,l=0,m=0,n=0;i=la-16|0;la=i;J[i+8>>2]=c;J[i+12>>2]=b;b=i+4|0;le(b,d);j=Oc(b);ak(b);J[e>>2]=0;b=0;a:{while(1){if(b|(g|0)==(h|0)){break a}b:{if(Pc(i+12|0,i+8|0)){break b}c:{if((zi(j,J[g>>2])|0)==37){b=g+4|0;if((b|0)==(h|0)){break b}c=0;d:{e:{b=zi(j,J[b>>2]);if((b|0)==69){break e}k=1;if((b&255)==48){break e}l=b;break d}c=g+8|0;if((c|0)==(h|0)){break b}k=2;l=zi(j,J[c>>2]);c=b}m=i,n=na[J[J[a>>2]+36>>2]](a,J[i+12>>2],J[i+8>>2],d,e,f,l,c)|0,J[m+12>>2]=n;g=((k<<2)+g|0)+4|0;break c}if(Rc(j,1,J[g>>2])){while(1){f:{g=g+4|0;if((h|0)==(g|0)){g=h;break f}if(Rc(j,1,J[g>>2])){continue}}break}while(1){b=i+12|0;if(Pc(b,i+8|0)){break c}if(!Rc(j,1,Qc(b))){break c}Sc(b);continue}}b=i+12|0;if((he(j,Qc(b))|0)==(he(j,J[g>>2])|0)){g=g+4|0;Sc(b);break c}J[e>>2]=4}b=J[e>>2];continue}break}J[e>>2]=4}if(Pc(i+12|0,i+8|0)){J[e>>2]=J[e>>2]|2}la=i+16|0;return J[i+12>>2]}function th(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0;a=la-384|0;la=a;J[a+376>>2]=c;J[a+380>>2]=b;qh(a+220|0,d,a+240|0,a+236|0,a+232|0);c=Wc(a+208|0);ld(c,kd(c));b=zg(c,0);J[a+204>>2]=b;J[a+28>>2]=a+32;J[a+24>>2]=0;H[a+23|0]=1;H[a+22|0]=69;while(1){a:{if(Pc(a+380|0,a+376|0)){break a}if(J[a+204>>2]==(jd(c)+b|0)){d=jd(c);ld(c,jd(c)<<1);ld(c,kd(c));b=zg(c,0);J[a+204>>2]=d+b}d=a+380|0;if(rh(Qc(d),a+23|0,a+22|0,b,a+204|0,J[a+236>>2],J[a+232>>2],a+220|0,a+32|0,a+28|0,a+24|0,a+240|0)){break a}Sc(d);continue}break}b:{if(!jd(a+220|0)|!K[a+23|0]){break b}d=J[a+28>>2];if((d-(a+32|0)|0)>159){break b}J[a+28>>2]=d+4;J[d>>2]=J[a+24>>2]}Xg(a,b,J[a+204>>2],e);b=J[a>>2];d=J[a+4>>2];g=J[a+12>>2];J[f+8>>2]=J[a+8>>2];J[f+12>>2]=g;J[f>>2]=b;J[f+4>>2]=d;Hg(a+220|0,a+32|0,J[a+28>>2],e);if(Pc(a+380|0,a+376|0)){J[e>>2]=J[e>>2]|2}b=J[a+380>>2];tm(c);tm(a+220|0);la=a+384|0;return b|0}function li(a,b,c,d,e,f,g,h){var i=0,j=0,k=0,l=0,m=0,n=0;i=la-16|0;la=i;J[i+8>>2]=c;J[i+12>>2]=b;b=i+4|0;le(b,d);j=hc(b);ak(b);J[e>>2]=0;b=0;a:{while(1){if(b|(g|0)==(h|0)){break a}b:{if(ic(i+12|0,i+8|0)){break b}c:{if((mi(j,H[g|0])|0)==37){b=g+1|0;if((b|0)==(h|0)){break b}c=0;d:{e:{b=mi(j,H[b|0]);if((b|0)==69){break e}k=1;if((b&255)==48){break e}l=b;break d}c=g+2|0;if((c|0)==(h|0)){break b}k=2;l=mi(j,H[c|0]);c=b}m=i,n=na[J[J[a>>2]+36>>2]](a,J[i+12>>2],J[i+8>>2],d,e,f,l,c)|0,J[m+12>>2]=n;g=(g+k|0)+1|0;break c}if(kc(j,1,H[g|0])){while(1){f:{g=g+1|0;if((h|0)==(g|0)){g=h;break f}if(kc(j,1,H[g|0])){continue}}break}while(1){b=i+12|0;if(ic(b,i+8|0)){break c}if(!kc(j,1,jc(b))){break c}lc(b);continue}}b=i+12|0;if((yg(j,jc(b))|0)==(yg(j,H[g|0])|0)){g=g+1|0;lc(b);break c}J[e>>2]=4}b=J[e>>2];continue}break}J[e>>2]=4}if(ic(i+12|0,i+8|0)){J[e>>2]=J[e>>2]|2}la=i+16|0;return J[i+12>>2]}function Wg(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0;a=la-272|0;la=a;J[a+264>>2]=c;J[a+268>>2]=b;Rg(a+208|0,d,a+224|0,a+223|0,a+222|0);c=Wc(a+196|0);ld(c,kd(c));b=zg(c,0);J[a+192>>2]=b;J[a+28>>2]=a+32;J[a+24>>2]=0;H[a+23|0]=1;H[a+22|0]=69;while(1){a:{if(ic(a+268|0,a+264|0)){break a}if(J[a+192>>2]==(jd(c)+b|0)){d=jd(c);ld(c,jd(c)<<1);ld(c,kd(c));b=zg(c,0);J[a+192>>2]=d+b}d=a+268|0;if(Sg(jc(d),a+23|0,a+22|0,b,a+192|0,H[a+223|0],H[a+222|0],a+208|0,a+32|0,a+28|0,a+24|0,a+224|0)){break a}lc(d);continue}break}b:{if(!jd(a+208|0)|!K[a+23|0]){break b}d=J[a+28>>2];if((d-(a+32|0)|0)>159){break b}J[a+28>>2]=d+4;J[d>>2]=J[a+24>>2]}Xg(a,b,J[a+192>>2],e);b=J[a>>2];d=J[a+4>>2];g=J[a+12>>2];J[f+8>>2]=J[a+8>>2];J[f+12>>2]=g;J[f>>2]=b;J[f+4>>2]=d;Hg(a+208|0,a+32|0,J[a+28>>2],e);if(ic(a+268|0,a+264|0)){J[e>>2]=J[e>>2]|2}b=J[a+268>>2];tm(c);tm(a+208|0);la=a+272|0;return b|0}function Ef(a,b,c,d){var e=0,f=0,g=0,h=0;g=la-32|0;la=g;f=d&2147483647;e=f-1065418752|0;h=f-1082064896|0;a:{if((e|0)==(h|0)&0|e>>>0<h>>>0){f=(d&33554431)<<7|c>>>25;e=0;h=e;c=c&33554431;if(!(!e&(c|0)==16777216?!(a|b):!e&c>>>0<16777216)){e=f+1073741825|0;break a}e=f+1073741824|0;if(c^16777216|a|(b|h)){break a}e=(f&1)+e|0;break a}if(!(!c&(f|0)==2147418112?!(a|b):f>>>0<2147418112)){e=((d&33554431)<<7|c>>>25)&4194303|2143289344;break a}e=2139095040;if(f>>>0>1082064895){break a}e=0;f=f>>>16|0;if(f>>>0<16145){break a}e=d&65535|65536;mf(g+16|0,a,b,c,e,f-16129|0);of(g,a,b,c,e,16257-f|0);a=J[g+8>>2];e=(J[g+12>>2]&33554431)<<7|a>>>25;c=J[g>>2]|(J[g+16>>2]|J[g+24>>2]|(J[g+20>>2]|J[g+28>>2]))!=0;f=J[g+4>>2];b=0;a=a&33554431;if(!(!b&(a|0)==16777216?!(c|f):!b&a>>>0<16777216)){e=e+1|0;break a}if(a^16777216|c|(b|f)){break a}e=(e&1)+e|0}la=g+32|0;return x(2,d&-2147483648|e),D()}function xn(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{if(b){if(!c){break j}break i}ma=0;a=(a>>>0)/(c>>>0)|0;break a}if(!a){break h}break g}if(!(c-1&c)){break f}f=(S(c)+33|0)-S(b)|0;g=0-f|0;break d}ma=0;a=(b>>>0)/0|0;break a}d=32-S(b)|0;if(d>>>0<31){break e}break c}if((c|0)==1){break b}f=vn(c);c=f&31;if((f&63)>>>0>=32){a=b>>>c|0}else{d=b>>>c|0;a=((1<<c)-1&b)<<32-c|a>>>c}ma=d;break a}f=d+1|0;g=63-d|0}d=f&63;e=d&31;if(d>>>0>=32){d=0;h=b>>>e|0}else{d=b>>>e|0;h=((1<<e)-1&b)<<32-e|a>>>e}g=g&63;e=g&31;if(g>>>0>=32){b=a<<e;a=0}else{b=(1<<e)-1&a>>>32-e|b<<e;a=a<<e}if(f){g=c-1|0;l=(g|0)==-1?-1:0;while(1){i=d<<1|h>>>31;d=h<<1|b>>>31;e=l-(i+(d>>>0>g>>>0)|0)>>31;j=c&e;h=d-j|0;d=i-(d>>>0<j>>>0)|0;b=b<<1|a>>>31;a=k|a<<1;k=e&1;f=f-1|0;if(f){continue}break}}ma=b<<1|a>>>31;a=k|a<<1;break a}a=0;b=0}ma=b}return a}function Tf(a,b,c){a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{k:{switch(b-9|0){case 1:case 4:case 14:break c;case 2:case 5:case 11:case 15:break b;case 3:case 10:case 12:case 13:break a;case 9:break g;case 8:break h;case 7:break i;case 6:break j;case 0:break k;case 17:break e;case 16:break f;default:break d}}b=J[c>>2];J[c>>2]=b+4;J[a>>2]=J[b>>2];return}b=J[c>>2];J[c>>2]=b+4;b=I[b>>1];J[a>>2]=b;J[a+4>>2]=b>>31;return}b=J[c>>2];J[c>>2]=b+4;J[a>>2]=L[b>>1];J[a+4>>2]=0;return}b=J[c>>2];J[c>>2]=b+4;b=H[b|0];J[a>>2]=b;J[a+4>>2]=b>>31;return}b=J[c>>2];J[c>>2]=b+4;J[a>>2]=K[b|0];J[a+4>>2]=0;return}b=J[c>>2]+7&-8;J[c>>2]=b+8;O[a>>3]=O[b>>3];return}Xf(a,c)}return}b=J[c>>2];J[c>>2]=b+4;b=J[b>>2];J[a>>2]=b;J[a+4>>2]=b>>31;return}b=J[c>>2];J[c>>2]=b+4;J[a>>2]=J[b>>2];J[a+4>>2]=0;return}b=J[c>>2]+7&-8;J[c>>2]=b+8;c=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=c}function Ga(a,b,c){var d=0,e=0,f=0,g=0;f=J[a+28>>2];if((J[a+32>>2]-f|0)/20>>>0>b>>>0){d=f+P(b,20)|0;a:{if((d|0)==(c|0)){break a}g=K[d+11|0];e=g<<24>>24;if(H[c+11|0]>=0){if((e|0)>=0){e=J[d+4>>2];J[c>>2]=J[d>>2];J[c+4>>2]=e;J[c+8>>2]=J[d+8>>2];break a}Bm(c,J[d>>2],J[d+4>>2]);break a}e=(e|0)<0;Am(c,e?J[d>>2]:d,e?J[d+4>>2]:g)}b=P(b,20);d=b+f|0;f=J[d+16>>2];J[c+12>>2]=J[d+12>>2];J[c+16>>2]=f;d=b+J[a+28>>2]|0;c=d+20|0;f=J[a+32>>2];b:{if((c|0)==(f|0)){b=d;break b}b=d;while(1){if(H[b+11|0]<0){tb(J[b>>2])}e=J[c+4>>2];J[b>>2]=J[c>>2];J[b+4>>2]=e;J[b+8>>2]=J[c+8>>2];H[c+11|0]=0;H[c|0]=0;e=J[c+16>>2];J[b+12>>2]=J[c+12>>2];J[b+16>>2]=e;b=b+20|0;c=c+20|0;if((f|0)!=(c|0)){continue}break}c=J[a+32>>2]}d=d+P((b-d|0)/20|0,20)|0;if((d|0)!=(c|0)){while(1){b=c-20|0;if(H[c-9|0]<0){tb(J[b>>2])}c=b;if((d|0)!=(c|0)){continue}break}}J[a+32>>2]=d}}function Kf(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0;b=a;a:{if(b&3){while(1){c=K[b|0];if(!c|(c|0)==61){break a}b=b+1|0;if(b&3){continue}break}}c=J[b>>2];b:{if((c^-1)&c-16843009&-2139062144){break b}while(1){c=c^1027423549;if((c^-1)&c-16843009&-2139062144){break b}c=J[b+4>>2];b=b+4|0;if(!(c-16843009&(c^-1)&-2139062144)){continue}break}}while(1){c=b;d=K[b|0];if(d){b=b+1|0;if((d|0)!=61){continue}}break}b=c}if((a|0)==(b|0)){return 0}g=b-a|0;c:{if(K[g+a|0]){break c}e=J[5278];if(!e){break c}b=J[e>>2];if(!b){break c}while(1){d:{c=a;h=g;f=0;e:{if(!g){break e}d=K[c|0];if(d){f:{while(1){f=K[b|0];if((f|0)!=(d|0)|!f){break f}h=h-1|0;if(!h){break f}b=b+1|0;d=K[c+1|0];c=c+1|0;if(d){continue}break}d=0}}else{d=0}f=d-K[b|0]|0}if(!f){b=g+J[e>>2]|0;if(K[b|0]==61){break d}}b=J[e+4>>2];e=e+4|0;if(b){continue}break c}break}i=b+1|0}return i}function Yf(a,b,c,d){var e=0,f=0,g=0;e=la-160|0;la=e;g=b?a:e+158|0;J[e+148>>2]=g;a=-1;f=b-1|0;J[e+152>>2]=b>>>0>=f>>>0?f:0;e=kb(e,0,144);J[e+76>>2]=-1;J[e+36>>2]=99;J[e+80>>2]=-1;J[e+44>>2]=e+159;J[e+84>>2]=e+148;a:{if((b|0)<0){J[4322]=61;break a}H[g|0]=0;b=0;a=la-208|0;la=a;J[a+204>>2]=d;d=a+160|0;kb(d,0,40);J[a+200>>2]=J[a+204>>2];b:{if((Qf(0,c,a+200|0,a+80|0,d)|0)<0){c=-1;break b}g=J[e+76>>2]<0;f=J[e>>2];J[e>>2]=f&-33;c:{d:{e:{if(!J[e+48>>2]){J[e+48>>2]=80;J[e+28>>2]=0;J[e+16>>2]=0;J[e+20>>2]=0;b=J[e+44>>2];J[e+44>>2]=a;break e}if(J[e+16>>2]){break d}}d=-1;if(Hb(e)){break c}}d=Qf(e,c,a+200|0,a+80|0,a+160|0)}c=f&32;if(b){na[J[e+36>>2]](e,0,0)|0;J[e+48>>2]=0;J[e+44>>2]=b;J[e+28>>2]=0;b=J[e+20>>2];J[e+16>>2]=0;J[e+20>>2]=0;d=b?d:-1}b=J[e>>2];J[e>>2]=b|c;c=b&32?-1:d;if(g){break b}}la=a+208|0;a=c}la=e+160|0;return a}function $h(a,b,c,d,e,f,g){var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;k=la-16|0;la=k;l=Oc(g);h=k+4|0;g=eh(g);zh(h,g);a:{if(Ag(h)){vh(l,a,c,d);g=(c-a<<2)+d|0;J[f>>2]=g;break a}J[f>>2]=d;b:{c:{h=a;i=K[h|0];switch(i-43|0){case 0:case 2:break c;default:break b}}h=je(l,i<<24>>24);i=J[f>>2];J[f>>2]=i+4;J[i>>2]=h;h=a+1|0}if(!(K[h|0]!=48|(c-h|0)<2|(K[h+1|0]|32)!=120)){i=je(l,48);j=J[f>>2];J[f>>2]=j+4;J[j>>2]=i;i=je(l,H[h+1|0]);j=J[f>>2];J[f>>2]=j+4;J[j>>2]=i;h=h+2|0}ji(h,c);j=0;o=yh(g);i=0;g=h;while(1){if(c>>>0<=g>>>0){ki((h-a<<2)+d|0,J[f>>2]);g=J[f>>2]}else{m=k+4|0;d:{if(!K[zg(m,i)|0]){break d}if(H[zg(k+4|0,i)|0]!=(j|0)){break d}j=J[f>>2];J[f>>2]=j+4;J[j>>2]=o;i=(jd(m)-1>>>0>i>>>0)+i|0;j=0}m=je(l,H[g|0]);n=J[f>>2];J[f>>2]=n+4;J[n>>2]=m;g=g+1|0;j=j+1|0;continue}break}}J[e>>2]=(b|0)==(c|0)?g:(b-a<<2)+d|0;tm(k+4|0);la=k+16|0}function Kh(a,b,c,d,e,f,g){var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;k=la-16|0;la=k;l=hc(g);h=k+4|0;g=qg(g);zh(h,g);a:{if(Ag(h)){Zg(l,a,c,d);g=(c-a|0)+d|0;J[f>>2]=g;break a}J[f>>2]=d;b:{c:{h=a;i=K[h|0];switch(i-43|0){case 0:case 2:break c;default:break b}}h=he(l,i<<24>>24);i=J[f>>2];J[f>>2]=i+1;H[i|0]=h;h=a+1|0}if(!(K[h|0]!=48|(c-h|0)<2|(K[h+1|0]|32)!=120)){i=he(l,48);j=J[f>>2];J[f>>2]=j+1;H[j|0]=i;i=he(l,H[h+1|0]);j=J[f>>2];J[f>>2]=j+1;H[j|0]=i;h=h+2|0}ji(h,c);j=0;o=yh(g);i=0;g=h;while(1){if(c>>>0<=g>>>0){ji((h-a|0)+d|0,J[f>>2]);g=J[f>>2]}else{m=k+4|0;d:{if(!K[zg(m,i)|0]){break d}if(H[zg(k+4|0,i)|0]!=(j|0)){break d}j=J[f>>2];J[f>>2]=j+1;H[j|0]=o;i=(jd(m)-1>>>0>i>>>0)+i|0;j=0}m=he(l,H[g|0]);n=J[f>>2];J[f>>2]=n+1;H[n|0]=m;g=g+1|0;j=j+1|0;continue}break}}J[e>>2]=(b|0)==(c|0)?g:(b-a|0)+d|0;tm(k+4|0);la=k+16|0}function Xg(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;g=la-32|0;la=g;a:{b:{c:{if((b|0)!=(c|0)){k=J[4322];J[4322]=0;h=la-16|0;la=h;_g();f=la-16|0;la=f;e=la-16|0;la=e;fg(e,b,g+28|0,2);i=J[e>>2];j=J[e+4>>2];b=f;f=J[e+12>>2];J[b+8>>2]=J[e+8>>2];J[b+12>>2]=f;J[b>>2]=i;J[b+4>>2]=j;la=e+16|0;f=J[b>>2];i=J[b+4>>2];e=h;h=J[b+12>>2];J[e+8>>2]=J[b+8>>2];J[e+12>>2]=h;J[e>>2]=f;J[e+4>>2]=i;la=b+16|0;h=J[e>>2];f=J[e+4>>2];i=J[e+12>>2];b=g+8|0;J[b+8>>2]=J[e+8>>2];J[b+12>>2]=i;J[b>>2]=h;J[b+4>>2]=f;la=e+16|0;e=J[g+16>>2];f=J[g+20>>2];h=J[g+8>>2];b=J[g+12>>2];i=b;j=J[4322];if(!j){break c}if(J[g+28>>2]!=(c|0)){break b}l=h;m=b;n=e;o=f;if((j|0)!=68){break a}break b}J[d>>2]=4;break a}J[4322]=k;if(J[g+28>>2]==(c|0)){break a}}J[d>>2]=4;h=l;i=m;e=n;f=o}J[a>>2]=h;J[a+4>>2]=i;J[a+8>>2]=e;J[a+12>>2]=f;la=g+32|0}function ph(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=Q(0);a=la-368|0;la=a;J[a+360>>2]=c;J[a+364>>2]=b;qh(a+204|0,d,a+224|0,a+220|0,a+216|0);c=Wc(a+192|0);ld(c,kd(c));b=zg(c,0);J[a+188>>2]=b;J[a+12>>2]=a+16;J[a+8>>2]=0;H[a+7|0]=1;H[a+6|0]=69;while(1){a:{if(Pc(a+364|0,a+360|0)){break a}if(J[a+188>>2]==(jd(c)+b|0)){d=jd(c);ld(c,jd(c)<<1);ld(c,kd(c));b=zg(c,0);J[a+188>>2]=d+b}d=a+364|0;if(rh(Qc(d),a+7|0,a+6|0,b,a+188|0,J[a+220>>2],J[a+216>>2],a+204|0,a+16|0,a+12|0,a+8|0,a+224|0)){break a}Sc(d);continue}break}b:{if(!jd(a+204|0)|!K[a+7|0]){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}g=f,h=Tg(b,J[a+188>>2],e),N[g>>2]=h;Hg(a+204|0,a+16|0,J[a+12>>2],e);if(Pc(a+364|0,a+360|0)){J[e>>2]=J[e>>2]|2}b=J[a+364>>2];tm(c);tm(a+204|0);la=a+368|0;return b|0}function Im(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;e=la-32|0;la=e;g=e+12|0;d=e+21|0;c=e+32|0;if(!((d|0)==(c|0)|(b|0)>=0)){H[d|0]=45;d=d+1|0;b=0-b|0}h=c-d|0;a:{if((h|0)<=9){i=P(32-S(b|1)|0,1233)>>12;f=61;if((h|0)<(i+(M[(i<<2)+15792>>2]<=b>>>0)|0)){break a}}b:{if(b>>>0<=999999){if(b>>>0<=9999){if(b>>>0<=99){if(b>>>0<=9){c=Jm(d,b);break b}c=Km(d,b);break b}if(b>>>0<=999){c=(b>>>0)/100|0;c=Km(Jm(d,c),b-P(c,100)|0);break b}c=Lm(d,b);break b}if(b>>>0<=99999){c=(b>>>0)/1e4|0;c=Lm(Jm(d,c),b-P(c,1e4)|0);break b}c=Mm(d,b);break b}if(b>>>0<=99999999){if(b>>>0<=9999999){c=(b>>>0)/1e6|0;c=Mm(Jm(d,c),b-P(c,1e6)|0);break b}c=Nm(d,b);break b}if(b>>>0<=999999999){c=(b>>>0)/1e8|0;c=Nm(Jm(d,c),b-P(c,1e8)|0);break b}c=(b>>>0)/1e8|0;c=Nm(Km(d,c),b-P(c,1e8)|0)}f=0}J[g+4>>2]=f;J[g>>2]=c;jg(a,e+21|0,J[e+12>>2]);la=e+32|0}function Qg(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=Q(0);a=la-256|0;la=a;J[a+248>>2]=c;J[a+252>>2]=b;Rg(a+192|0,d,a+208|0,a+207|0,a+206|0);c=Wc(a+180|0);ld(c,kd(c));b=zg(c,0);J[a+176>>2]=b;J[a+12>>2]=a+16;J[a+8>>2]=0;H[a+7|0]=1;H[a+6|0]=69;while(1){a:{if(ic(a+252|0,a+248|0)){break a}if(J[a+176>>2]==(jd(c)+b|0)){d=jd(c);ld(c,jd(c)<<1);ld(c,kd(c));b=zg(c,0);J[a+176>>2]=d+b}d=a+252|0;if(Sg(jc(d),a+7|0,a+6|0,b,a+176|0,H[a+207|0],H[a+206|0],a+192|0,a+16|0,a+12|0,a+8|0,a+208|0)){break a}lc(d);continue}break}b:{if(!jd(a+192|0)|!K[a+7|0]){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}g=f,h=Tg(b,J[a+176>>2],e),N[g>>2]=h;Hg(a+192|0,a+16|0,J[a+12>>2],e);if(ic(a+252|0,a+248|0)){J[e>>2]=J[e>>2]|2}b=J[a+252>>2];tm(c);tm(a+192|0);la=a+256|0;return b|0}function sh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;a=la-368|0;la=a;J[a+360>>2]=c;J[a+364>>2]=b;qh(a+204|0,d,a+224|0,a+220|0,a+216|0);c=Wc(a+192|0);ld(c,kd(c));b=zg(c,0);J[a+188>>2]=b;J[a+12>>2]=a+16;J[a+8>>2]=0;H[a+7|0]=1;H[a+6|0]=69;while(1){a:{if(Pc(a+364|0,a+360|0)){break a}if(J[a+188>>2]==(jd(c)+b|0)){d=jd(c);ld(c,jd(c)<<1);ld(c,kd(c));b=zg(c,0);J[a+188>>2]=d+b}d=a+364|0;if(rh(Qc(d),a+7|0,a+6|0,b,a+188|0,J[a+220>>2],J[a+216>>2],a+204|0,a+16|0,a+12|0,a+8|0,a+224|0)){break a}Sc(d);continue}break}b:{if(!jd(a+204|0)|!K[a+7|0]){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}g=f,h=Vg(b,J[a+188>>2],e),O[g>>3]=h;Hg(a+204|0,a+16|0,J[a+12>>2],e);if(Pc(a+364|0,a+360|0)){J[e>>2]=J[e>>2]|2}b=J[a+364>>2];tm(c);tm(a+204|0);la=a+368|0;return b|0}function Ug(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;a=la-256|0;la=a;J[a+248>>2]=c;J[a+252>>2]=b;Rg(a+192|0,d,a+208|0,a+207|0,a+206|0);c=Wc(a+180|0);ld(c,kd(c));b=zg(c,0);J[a+176>>2]=b;J[a+12>>2]=a+16;J[a+8>>2]=0;H[a+7|0]=1;H[a+6|0]=69;while(1){a:{if(ic(a+252|0,a+248|0)){break a}if(J[a+176>>2]==(jd(c)+b|0)){d=jd(c);ld(c,jd(c)<<1);ld(c,kd(c));b=zg(c,0);J[a+176>>2]=d+b}d=a+252|0;if(Sg(jc(d),a+7|0,a+6|0,b,a+176|0,H[a+207|0],H[a+206|0],a+192|0,a+16|0,a+12|0,a+8|0,a+208|0)){break a}lc(d);continue}break}b:{if(!jd(a+192|0)|!K[a+7|0]){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}g=f,h=Vg(b,J[a+176>>2],e),O[g>>3]=h;Hg(a+192|0,a+16|0,J[a+12>>2],e);if(ic(a+252|0,a+248|0)){J[e>>2]=J[e>>2]|2}b=J[a+252>>2];tm(c);tm(a+192|0);la=a+256|0;return b|0}function Ni(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0;c=la-416|0;la=c;J[c+12>>2]=c+416;d=la-144|0;la=d;J[d+28>>2]=d+132;a=a+8|0;h=d+32|0;Li(a,h,d+28|0,e,f,g);J[d+16>>2]=0;J[d+20>>2]=0;J[d+12>>2]=h;f=c+16|0;g=c+12|0;h=Oi(f,J[g>>2]);e=la-16|0;la=e;J[e+12>>2]=J[a>>2];i=bh(e+8|0,e+12|0);a=cg(f,d+12|0,h,d+16|0);ch(i);la=e+16|0;if((a|0)==-1){yd();B()}J[g>>2]=f+(a<<2);la=d+144|0;e=la-16|0;la=e;g=e+8|0;a=la-32|0;la=a;h=c+16|0;Id(a+24|0,h,J[c+12>>2]);i=a+16|0;j=J[a+28>>2];d=la-16|0;la=d;f=J[a+24>>2];J[d+8>>2]=f;J[d+12>>2]=b;while(1){if((f|0)!=(j|0)){Vc(d+12|0,J[f>>2]);f=f+4|0;J[d+8>>2]=f;continue}break}Md(i,d+8|0,d+12|0);la=d+16|0;k=a,l=Kd(h,J[a+16>>2]),J[k+12>>2]=l;J[a+8>>2]=J[a+20>>2];Md(g,a+12|0,a+8|0);la=a+32|0;la=e+16|0;la=c+416|0;return J[e+12>>2]}function kf(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;b=J[a+112>>2];d=J[a+116>>2];i=(b|d)!=0;h=b;e=J[a+4>>2];f=J[a+44>>2];b=e-f|0;g=b;c=b+J[a+120>>2]|0;b=J[a+124>>2]+(b>>31)|0;a:{b=c>>>0<g>>>0?b+1|0:b;if(!(((b|0)>=(d|0)&c>>>0>=h>>>0|(b|0)>(d|0))&i)){i=se(a);if((i|0)>=0){break a}f=J[a+44>>2];e=J[a+4>>2]}J[a+112>>2]=-1;J[a+116>>2]=-1;J[a+104>>2]=e;g=c;c=f-e|0;d=g+c|0;b=(c>>31)+b|0;J[a+120>>2]=d;J[a+124>>2]=c>>>0>d>>>0?b+1|0:b;return-1}d=c+1|0;b=d?b:b+1|0;h=J[a+4>>2];e=J[a+8>>2];c=J[a+116>>2];g=c;f=J[a+112>>2];b:{if(!(c|f)){break b}c=f-d|0;f=g-(b+(d>>>0>f>>>0)|0)|0;j=e-h|0;g=j>>31;if((f|0)>=(g|0)&c>>>0>=j>>>0|(f|0)>(g|0)){break b}e=c+h|0}J[a+104>>2]=e;c=J[a+44>>2];e=c-h|0;d=e+d|0;b=(e>>31)+b|0;J[a+120>>2]=d;J[a+124>>2]=d>>>0<e>>>0?b+1|0:b;if(c>>>0>=h>>>0){H[h-1|0]=i}return i}function cb(){var a=0,b=0,c=0,d=0,e=0;a=la+-64|0;la=a;c=J[4312];if(c){Ka(a+20|0,c);Oa(a+8|0,J[4312]);if(H[17263]<0){tb(J[4313])}b=J[a+12>>2];J[4313]=J[a+8>>2];J[4314]=b;J[4315]=J[a+16>>2];c=H[a+35|0];b=a+24|0;a:{if(H[17275]>=0){if((c|0)>=0){c=J[b+4>>2];J[4316]=J[b>>2];J[4317]=c;J[4318]=J[b+8>>2];break a}Bm(17264,J[a+24>>2],J[a+28>>2]);break a}d=b;b=(c|0)<0;Am(17264,b?J[a+24>>2]:d,b?J[a+28>>2]:c&255)}e=K[a+63|0];c=e<<24>>24;b=a+52|0;b:{c:{if(H[17287]>=0){if((c|0)>=0){c=J[b+4>>2];J[4319]=J[b>>2];J[4320]=c;J[4321]=J[b+8>>2];b=K[a+20|0];break b}Bm(17276,J[a+52>>2],J[a+56>>2]);break c}d=b;b=(c|0)<0;Am(17276,b?J[a+52>>2]:d,b?J[a+56>>2]:e)}b=K[a+20|0];if(H[a+63|0]>=0){break b}tb(J[a+52>>2])}if(H[a+51|0]<0){tb(J[a+40>>2])}if(H[a+35|0]<0){tb(J[a+24>>2])}}la=a- -64|0;return b|0}function hb(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=la-176|0;la=c;a:{if((a|0)<2){break a}a=J[b+4>>2];if(!mb(a,1425)){b=0;a=la-208|0;la=a;I[a+204>>1]=1;J[a+200>>2]=16843009;d=ya(a+48|0,a+200|0);Na(20248,2883,35);while(1){if(!(K[d+124|0]|b>>>0>199)){Ka(a+4|0,d);e=K[d+124|0];if(H[a+47|0]<0){tb(J[a+36>>2])}if(H[a+35|0]<0){tb(J[a+24>>2])}if(H[a+19|0]<0){tb(J[a+8>>2])}b=b+1|0;if(!e){continue}}break}b=a+4|0;Oa(b,d);f=b;b=K[a+15|0];e=b<<24>>24<0;Na(Na(20248,e?J[a+4>>2]:f,e?J[a+8>>2]:b),2917,1);if(H[a+15|0]<0){tb(J[a+4>>2])}Xa(d);la=a+208|0;break a}if(mb(a,1347)){break a}I[c+172>>1]=1;J[c+168>>2]=16843009;b=c+4|0;a=ya(c+16|0,c+168|0);Oa(b,a);f=b;b=K[c+15|0];d=b<<24>>24<0;Na(Na(20248,d?J[c+4>>2]:f,d?J[c+8>>2]:b),2917,1);if(H[c+15|0]<0){tb(J[c+4>>2])}Xa(a)}la=c+176|0;return 0}function oh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0;a=la-336|0;la=a;J[a+328>>2]=c;J[a+332>>2]=b;g=Dg(d);h=ih(d,a+208|0);jh(a+196|0,d,a+324|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(Pc(a+332|0,a+328|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+332|0;if(kh(Qc(d),g,c,a+180|0,a+8|0,J[a+324>>2],a+196|0,a+16|0,a+12|0,h)){break a}Sc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}i=f,j=Pg(c,J[a+180>>2],e,g),J[i>>2]=j;J[f+4>>2]=ma;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(Pc(a+332|0,a+328|0)){J[e>>2]=J[e>>2]|2}c=J[a+332>>2];tm(b);tm(a+196|0);la=a+336|0;return c|0}function lh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0;a=la-336|0;la=a;J[a+328>>2]=c;J[a+332>>2]=b;g=Dg(d);h=ih(d,a+208|0);jh(a+196|0,d,a+324|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(Pc(a+332|0,a+328|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+332|0;if(kh(Qc(d),g,c,a+180|0,a+8|0,J[a+324>>2],a+196|0,a+16|0,a+12|0,h)){break a}Sc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}i=f,j=Jg(c,J[a+180>>2],e,g),J[i>>2]=j;J[f+4>>2]=ma;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(Pc(a+332|0,a+328|0)){J[e>>2]=J[e>>2]|2}c=J[a+332>>2];tm(b);tm(a+196|0);la=a+336|0;return c|0}function Ae(a,b){var c=0,d=0,e=0,f=0,g=0;e=la-16|0;la=e;g=J[5008];if(J[b+72>>2]<=0){ue(b)}J[5008]=J[b+136>>2];a:{b:{c:{if(a>>>0<=127){d:{if(J[b+80>>2]==(a|0)){break d}c=J[b+20>>2];if((c|0)==J[b+16>>2]){break d}J[b+20>>2]=c+1;H[c|0]=a;break a}d=la-16|0;la=d;H[d+15|0]=a;c=J[b+16>>2];e:{if(!c){c=-1;if(Hb(b)){break e}c=J[b+16>>2]}f:{f=J[b+20>>2];if((c|0)==(f|0)){break f}c=a&255;if((c|0)==J[b+80>>2]){break f}J[b+20>>2]=f+1;H[f|0]=a;break e}c=-1;if((na[J[b+36>>2]](b,d+15|0,1)|0)!=1){break e}c=K[d+15|0]}la=d+16|0;a=c;break c}c=J[b+20>>2];if(M[b+16>>2]>c+4>>>0){c=ze(c,a);if((c|0)<0){break b}J[b+20>>2]=c+J[b+20>>2];break c}d=e+12|0;c=ze(d,a);if((c|0)<0){break b}if(Ib(d,c,b)>>>0<c>>>0){break b}}if((a|0)!=-1){break a}}J[b>>2]=J[b>>2]|32;a=-1}J[5008]=g;la=e+16|0;return a}function nh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0;a=la-336|0;la=a;J[a+328>>2]=c;J[a+332>>2]=b;g=Dg(d);h=ih(d,a+208|0);jh(a+196|0,d,a+324|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(Pc(a+332|0,a+328|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+332|0;if(kh(Qc(d),g,c,a+180|0,a+8|0,J[a+324>>2],a+196|0,a+16|0,a+12|0,h)){break a}Sc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}i=f,j=Ng(c,J[a+180>>2],e,g),J[i>>2]=j;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(Pc(a+332|0,a+328|0)){J[e>>2]=J[e>>2]|2}c=J[a+332>>2];tm(b);tm(a+196|0);la=a+336|0;return c|0}function mh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0;a=la-336|0;la=a;J[a+328>>2]=c;J[a+332>>2]=b;g=Dg(d);h=ih(d,a+208|0);jh(a+196|0,d,a+324|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(Pc(a+332|0,a+328|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+332|0;if(kh(Qc(d),g,c,a+180|0,a+8|0,J[a+324>>2],a+196|0,a+16|0,a+12|0,h)){break a}Sc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}i=f,j=Lg(c,J[a+180>>2],e,g),I[i>>1]=j;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(Pc(a+332|0,a+328|0)){J[e>>2]=J[e>>2]|2}c=J[a+332>>2];tm(b);tm(a+196|0);la=a+336|0;return c|0}function hh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0;a=la-336|0;la=a;J[a+328>>2]=c;J[a+332>>2]=b;g=Dg(d);h=ih(d,a+208|0);jh(a+196|0,d,a+324|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(Pc(a+332|0,a+328|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+332|0;if(kh(Qc(d),g,c,a+180|0,a+8|0,J[a+324>>2],a+196|0,a+16|0,a+12|0,h)){break a}Sc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}i=f,j=Gg(c,J[a+180>>2],e,g),J[i>>2]=j;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(Pc(a+332|0,a+328|0)){J[e>>2]=J[e>>2]|2}c=J[a+332>>2];tm(b);tm(a+196|0);la=a+336|0;return c|0}function yj(a,b,c,d,e,f,g,h,i,j){var k=0,l=0,m=0;k=la-16|0;la=k;a:{if(a){a=dj(c);b:{if(b){c=k+4|0;ej(c,a);b=J[k+4>>2];H[d|0]=b;H[d+1|0]=b>>>8;H[d+2|0]=b>>>16;H[d+3|0]=b>>>24;fj(c,a);break b}c=k+4|0;Aj(c,a);b=J[k+4>>2];H[d|0]=b;H[d+1|0]=b>>>8;H[d+2|0]=b>>>16;H[d+3|0]=b>>>24;sg(c,a)}_c(i,c);tm(c);l=e,m=xh(a),H[l|0]=m;l=f,m=yh(a),H[l|0]=m;b=k+4|0;zh(b,a);_c(g,b);tm(b);rg(b,a);_c(h,b);tm(k+4|0);a=gj(a);break a}a=hj(c);c:{if(b){c=k+4|0;ej(c,a);b=J[k+4>>2];H[d|0]=b;H[d+1|0]=b>>>8;H[d+2|0]=b>>>16;H[d+3|0]=b>>>24;fj(c,a);break c}c=k+4|0;Aj(c,a);b=J[k+4>>2];H[d|0]=b;H[d+1|0]=b>>>8;H[d+2|0]=b>>>16;H[d+3|0]=b>>>24;sg(c,a)}_c(i,c);tm(c);l=e,m=xh(a),H[l|0]=m;l=f,m=yh(a),H[l|0]=m;b=k+4|0;zh(b,a);_c(g,b);tm(b);rg(b,a);_c(h,b);tm(k+4|0);a=gj(a)}J[j>>2]=a;la=k+16|0}function Og(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;a=la-256|0;la=a;J[a+248>>2]=c;J[a+252>>2]=b;g=Dg(d);Eg(a+196|0,d,a+247|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(ic(a+252|0,a+248|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+252|0;if(Fg(jc(d),g,c,a+180|0,a+8|0,H[a+247|0],a+196|0,a+16|0,a+12|0,9056)){break a}lc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}h=f,i=Pg(c,J[a+180>>2],e,g),J[h>>2]=i;J[f+4>>2]=ma;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(ic(a+252|0,a+248|0)){J[e>>2]=J[e>>2]|2}c=J[a+252>>2];tm(b);tm(a+196|0);la=a+256|0;return c|0}function Ig(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;a=la-256|0;la=a;J[a+248>>2]=c;J[a+252>>2]=b;g=Dg(d);Eg(a+196|0,d,a+247|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(ic(a+252|0,a+248|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+252|0;if(Fg(jc(d),g,c,a+180|0,a+8|0,H[a+247|0],a+196|0,a+16|0,a+12|0,9056)){break a}lc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}h=f,i=Jg(c,J[a+180>>2],e,g),J[h>>2]=i;J[f+4>>2]=ma;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(ic(a+252|0,a+248|0)){J[e>>2]=J[e>>2]|2}c=J[a+252>>2];tm(b);tm(a+196|0);la=a+256|0;return c|0}function Ej(a,b,c,d,e,f,g,h,i,j){var k=0,l=0,m=0;k=la-16|0;la=k;a:{if(a){a=tj(c);b:{if(b){c=k+4|0;ej(c,a);b=J[k+4>>2];H[d|0]=b;H[d+1|0]=b>>>8;H[d+2|0]=b>>>16;H[d+3|0]=b>>>24;fj(c,a);break b}c=k+4|0;Aj(c,a);b=J[k+4>>2];H[d|0]=b;H[d+1|0]=b>>>8;H[d+2|0]=b>>>16;H[d+3|0]=b>>>24;sg(c,a)}uj(i,c);Fm(c);l=e,m=xh(a),J[l>>2]=m;l=f,m=yh(a),J[l>>2]=m;b=k+4|0;zh(b,a);_c(g,b);tm(b);rg(b,a);uj(h,b);Fm(b);a=gj(a);break a}a=vj(c);c:{if(b){c=k+4|0;ej(c,a);b=J[k+4>>2];H[d|0]=b;H[d+1|0]=b>>>8;H[d+2|0]=b>>>16;H[d+3|0]=b>>>24;fj(c,a);break c}c=k+4|0;Aj(c,a);b=J[k+4>>2];H[d|0]=b;H[d+1|0]=b>>>8;H[d+2|0]=b>>>16;H[d+3|0]=b>>>24;sg(c,a)}uj(i,c);Fm(c);l=e,m=xh(a),J[l>>2]=m;l=f,m=yh(a),J[l>>2]=m;b=k+4|0;zh(b,a);_c(g,b);tm(b);rg(b,a);uj(h,b);Fm(b);a=gj(a)}J[j>>2]=a;la=k+16|0}function Mg(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;a=la-256|0;la=a;J[a+248>>2]=c;J[a+252>>2]=b;g=Dg(d);Eg(a+196|0,d,a+247|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(ic(a+252|0,a+248|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+252|0;if(Fg(jc(d),g,c,a+180|0,a+8|0,H[a+247|0],a+196|0,a+16|0,a+12|0,9056)){break a}lc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}h=f,i=Ng(c,J[a+180>>2],e,g),J[h>>2]=i;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(ic(a+252|0,a+248|0)){J[e>>2]=J[e>>2]|2}c=J[a+252>>2];tm(b);tm(a+196|0);la=a+256|0;return c|0}function Kg(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;a=la-256|0;la=a;J[a+248>>2]=c;J[a+252>>2]=b;g=Dg(d);Eg(a+196|0,d,a+247|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(ic(a+252|0,a+248|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+252|0;if(Fg(jc(d),g,c,a+180|0,a+8|0,H[a+247|0],a+196|0,a+16|0,a+12|0,9056)){break a}lc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}h=f,i=Lg(c,J[a+180>>2],e,g),I[h>>1]=i;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(ic(a+252|0,a+248|0)){J[e>>2]=J[e>>2]|2}c=J[a+252>>2];tm(b);tm(a+196|0);la=a+256|0;return c|0}function Cg(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;a=la-256|0;la=a;J[a+248>>2]=c;J[a+252>>2]=b;g=Dg(d);Eg(a+196|0,d,a+247|0);b=Wc(a+184|0);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=c;J[a+12>>2]=a+16;J[a+8>>2]=0;while(1){a:{if(ic(a+252|0,a+248|0)){break a}if(J[a+180>>2]==(jd(b)+c|0)){d=jd(b);ld(b,jd(b)<<1);ld(b,kd(b));c=zg(b,0);J[a+180>>2]=d+c}d=a+252|0;if(Fg(jc(d),g,c,a+180|0,a+8|0,H[a+247|0],a+196|0,a+16|0,a+12|0,9056)){break a}lc(d);continue}break}b:{if(!jd(a+196|0)){break b}d=J[a+12>>2];if((d-(a+16|0)|0)>159){break b}J[a+12>>2]=d+4;J[d>>2]=J[a+8>>2]}h=f,i=Gg(c,J[a+180>>2],e,g),J[h>>2]=i;Hg(a+196|0,a+16|0,J[a+12>>2],e);if(ic(a+252|0,a+248|0)){J[e>>2]=J[e>>2]|2}c=J[a+252>>2];tm(b);tm(a+196|0);la=a+256|0;return c|0}function Hj(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0;a=la-480|0;la=a;g=a+476|0;le(g,d);l=Oc(g);if(jd(f)){m=J[gh(f,0)>>2]==(je(l,45)|0)}j=Wc(a+452|0);g=Wc(a+440|0);h=Wc(a+428|0);Ej(c,m,a+476|0,a+472|0,a+468|0,a+464|0,j,g,h,a+424|0);J[a+16>>2]=100;k=wg(a+8|0,0,a+16|0);a:{if((jd(f)|0)>J[a+424>>2]){c=jd(f);i=J[a+424>>2];i=(((jd(h)+(c-i<<1)|0)+jd(g)|0)+J[a+424>>2]|0)+1|0;break a}i=((jd(h)+jd(g)|0)+J[a+424>>2]|0)+2|0}c=a+16|0;b:{if(i>>>0<101){break b}xg(k,sb(i<<2));c=J[k>>2];if(c){break b}yd();B()}Fj(c,a+4|0,a,J[d+4>>2],dd(f),dd(f)+(jd(f)<<2)|0,l,m,a+472|0,J[a+468>>2],J[a+464>>2],j,g,h,J[a+424>>2]);b=ai(b,c,J[a+4>>2],J[a>>2],d,e);Bg(k);Fm(h);Fm(g);tm(j);ak(a+476|0);la=a+480|0;return b|0}function _g(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0;if(K[21344]){return J[5335]}c=la-32|0;la=c;a:{b:{while(1){d=c+8|0;e=Lf(a,1<<a&2147483647?1707:2918);J[d+(a<<2)>>2]=e;if((e|0)==-1){break b}a=a+1|0;if((a|0)!=6){continue}break}if(!Mf(0)){b=4360;if(!lb(d,4360,24)){break a}b=4384;if(!lb(d,4384,24)){break a}a=0;if(!K[21172]){while(1){f=(a<<2)+21124|0,g=Lf(a,2918),J[f>>2]=g;a=a+1|0;if((a|0)!=6){continue}break}H[21172]=1;J[5287]=J[5281]}b=21124;a=c+8|0;if(!lb(a,21124,24)){break a}b=21148;if(!lb(a,21148,24)){break a}b=sb(24);if(!b){break b}}a=J[c+12>>2];J[b>>2]=J[c+8>>2];J[b+4>>2]=a;a=J[c+28>>2];J[b+16>>2]=J[c+24>>2];J[b+20>>2]=a;a=J[c+20>>2];J[b+8>>2]=J[c+16>>2];J[b+12>>2]=a;break a}b=0}la=c+32|0;H[21344]=1;J[5335]=b;return b}function yb(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=la-32|0;la=d;e=J[a+28>>2];J[d+16>>2]=e;f=J[a+20>>2];J[d+28>>2]=c;J[d+24>>2]=b;b=f-e|0;J[d+20>>2]=b;f=b+c|0;b=d+16|0;i=2;a:{b:{c:{d:{if(wb(da(J[a+60>>2],b|0,2,d+12|0)|0)){e=b;break d}while(1){g=J[d+12>>2];if((g|0)==(f|0)){break c}if((g|0)<0){e=b;break b}h=J[b+4>>2];j=h>>>0<g>>>0;e=(j<<3)+b|0;h=g-(j?h:0)|0;J[e>>2]=h+J[e>>2];b=(j?12:4)+b|0;J[b>>2]=J[b>>2]-h;f=f-g|0;b=e;i=i-j|0;if(!wb(da(J[a+60>>2],b|0,i|0,d+12|0)|0)){continue}break}}if((f|0)!=-1){break b}}b=J[a+44>>2];J[a+28>>2]=b;J[a+20>>2]=b;J[a+16>>2]=b+J[a+48>>2];a=c;break a}J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;J[a>>2]=J[a>>2]|32;a=0;if((i|0)==2){break a}a=c-J[e+4>>2]|0}la=d+32|0;return a|0}function yf(a,b,c,d,e,f){var g=0;g=la-80|0;la=g;a:{if((f|0)>=16384){pf(g+32|0,b,c,d,e,0,0,0,2147352576);d=J[g+40>>2];e=J[g+44>>2];b=J[g+32>>2];c=J[g+36>>2];if(f>>>0<32767){f=f-16383|0;break a}pf(g+16|0,b,c,d,e,0,0,0,2147352576);f=((f|0)>=49149?49149:f)-32766|0;d=J[g+24>>2];e=J[g+28>>2];b=J[g+16>>2];c=J[g+20>>2];break a}if((f|0)>-16383){break a}pf(g- -64|0,b,c,d,e,0,0,0,7471104);d=J[g+72>>2];e=J[g+76>>2];b=J[g+64>>2];c=J[g+68>>2];if(f>>>0>4294934644){f=f+16269|0;break a}pf(g+48|0,b,c,d,e,0,0,0,7471104);f=((f|0)<=-48920?-48920:f)+32538|0;d=J[g+56>>2];e=J[g+60>>2];b=J[g+48>>2];c=J[g+52>>2]}pf(g,b,c,d,e,0,0,0,f+16383<<16);b=J[g+12>>2];J[a+8>>2]=J[g+8>>2];J[a+12>>2]=b;b=J[g+4>>2];J[a>>2]=J[g>>2];J[a+4>>2]=b;la=g+80|0}function jb(a,b,c){var d=0,e=0;a:{if((a|0)==(b|0)){break a}e=a+c|0;if(b-e>>>0<=0-(c<<1)>>>0){ib(a,b,c);return}d=(a^b)&3;b:{c:{if(a>>>0<b>>>0){if(d){break b}if(!(a&3)){break c}while(1){if(!c){break a}H[a|0]=K[b|0];b=b+1|0;c=c-1|0;a=a+1|0;if(a&3){continue}break}break c}d:{if(d){break d}if(e&3){while(1){if(!c){break a}c=c-1|0;d=c+a|0;H[d|0]=K[b+c|0];if(d&3){continue}break}}if(c>>>0<=3){break d}while(1){c=c-4|0;J[c+a>>2]=J[b+c>>2];if(c>>>0>3){continue}break}}if(!c){break a}while(1){c=c-1|0;H[c+a|0]=K[b+c|0];if(c){continue}break}break a}if(c>>>0<=3){break b}while(1){J[a>>2]=J[b>>2];b=b+4|0;a=a+4|0;c=c-4|0;if(c>>>0>3){continue}break}}if(!c){break a}while(1){H[a|0]=K[b|0];a=a+1|0;b=b+1|0;c=c-1|0;if(c){continue}break}}}function Cj(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0;a=la-176|0;la=a;g=a+172|0;le(g,d);l=hc(g);if(jd(f)){m=K[zg(f,0)|0]==(he(l,45)&255)}j=Wc(a+152|0);g=Wc(a+140|0);h=Wc(a+128|0);yj(c,m,a+172|0,a+168|0,a+167|0,a+166|0,j,g,h,a+124|0);J[a+16>>2]=100;k=wg(a+8|0,0,a+16|0);a:{if((jd(f)|0)>J[a+124>>2]){c=jd(f);i=J[a+124>>2];i=(((jd(h)+(c-i<<1)|0)+jd(g)|0)+J[a+124>>2]|0)+1|0;break a}i=((jd(h)+jd(g)|0)+J[a+124>>2]|0)+2|0}c=a+16|0;b:{if(i>>>0<101){break b}xg(k,sb(i));c=J[k>>2];if(c){break b}yd();B()}zj(c,a+4|0,a,J[d+4>>2],dd(f),dd(f)+jd(f)|0,l,m,a+168|0,H[a+167|0],H[a+166|0],j,g,h,J[a+124>>2]);b=Lh(b,c,J[a+4>>2],J[a>>2],d,e);Bg(k);tm(h);tm(g);tm(j);ak(a+172|0);la=a+176|0;return b|0}function td(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0;if(M[b+24>>2]>M[b+44>>2]){J[b+44>>2]=J[b+24>>2]}l=-1;m=-1;h=f&24;a:{if(!h|(e|0)==1&(h|0)==24){break a}h=J[b+44>>2];if(h){i=h-dd(b+32|0)|0;j=i>>31}b:{c:{switch(e|0){case 1:if(f&8){g=J[b+12>>2]-J[b+8>>2]|0;k=g>>31;break b}g=J[b+24>>2]-J[b+20>>2]|0;k=g>>31;break b;case 0:break b;case 2:break c;default:break a}}g=i;k=j}d=d+k|0;c=c+g|0;d=g>>>0>c>>>0?d+1|0:d;if((d|0)<0|(c>>>0>i>>>0&(d|0)>=(j|0)|(d|0)>(j|0))){break a}e=f&8;d:{if(!(c|d)){break d}if(J[b+12>>2]?0:e){break a}if(!(f&16)){break d}if(!J[b+24>>2]){break a}}if(e){$c(b,J[b+8>>2],c+J[b+8>>2]|0,J[b+44>>2])}if(f&16){ad(b,J[b+20>>2],J[b+28>>2]);bd(b,c)}l=c;m=d}Sb(a,l,m)}function Fg(a,b,c,d,e,f,g,h,i,j){var k=0,l=0,m=0;k=la-16|0;la=k;H[k+15|0]=a;a:{b:{c:{if(J[d>>2]!=(c|0)){break c}l=43;m=a&255;if((m|0)!=K[j+24|0]){l=45;if(K[j+25|0]!=(m|0)){break c}}J[d>>2]=c+1;H[c|0]=l;break b}if(!(!jd(g)|(a|0)!=(f|0))){a=0;b=J[i>>2];if((b-h|0)>159){break a}a=J[e>>2];J[i>>2]=b+4;J[b>>2]=a;break b}a=-1;f=ah(j,j+26|0,k+15|0)-j|0;if((f|0)>23){break a}d:{e:{switch(b-8|0){case 0:case 2:if((b|0)>(f|0)){break d}break a;case 1:break d;default:break e}}if((b|0)!=16|(f|0)<22){break d}b=J[d>>2];if((b|0)==(c|0)|(b-c|0)>2|K[b-1|0]!=48){break a}a=0;J[e>>2]=0;J[d>>2]=b+1;H[b|0]=K[f+9056|0];break a}a=J[d>>2];J[d>>2]=a+1;H[a|0]=K[f+9056|0];J[e>>2]=J[e>>2]+1;a=0;break a}a=0;J[e>>2]=0}la=k+16|0;return a}function kb(a,b,c){var d=0,e=0,f=0,g=0;a:{if(!c){break a}H[a|0]=b;d=a+c|0;H[d-1|0]=b;if(c>>>0<3){break a}H[a+2|0]=b;H[a+1|0]=b;H[d-3|0]=b;H[d-2|0]=b;if(c>>>0<7){break a}H[a+3|0]=b;H[d-4|0]=b;if(c>>>0<9){break a}d=0-a&3;e=d+a|0;b=P(b&255,16843009);J[e>>2]=b;d=c-d&-4;c=d+e|0;J[c-4>>2]=b;if(d>>>0<9){break a}J[e+8>>2]=b;J[e+4>>2]=b;J[c-8>>2]=b;J[c-12>>2]=b;if(d>>>0<25){break a}J[e+24>>2]=b;J[e+20>>2]=b;J[e+16>>2]=b;J[e+12>>2]=b;J[c-16>>2]=b;J[c-20>>2]=b;J[c-24>>2]=b;J[c-28>>2]=b;g=e&4|24;c=d-g|0;if(c>>>0<32){break a}d=wn(b,0,1,1);f=ma;b=e+g|0;while(1){J[b+24>>2]=d;J[b+28>>2]=f;J[b+16>>2]=d;J[b+20>>2]=f;J[b+8>>2]=d;J[b+12>>2]=f;J[b>>2]=d;J[b+4>>2]=f;b=b+32|0;c=c-32|0;if(c>>>0>31){continue}break}}return a}function kh(a,b,c,d,e,f,g,h,i,j){var k=0,l=0;k=la-16|0;la=k;J[k+12>>2]=a;a:{b:{c:{if(J[d>>2]!=(c|0)){break c}l=43;if(J[j+96>>2]!=(a|0)){l=45;if(J[j+100>>2]!=(a|0)){break c}}J[d>>2]=c+1;H[c|0]=l;break b}if(!(!jd(g)|(a|0)!=(f|0))){a=0;b=J[i>>2];if((b-h|0)>159){break a}a=J[e>>2];J[i>>2]=b+4;J[b>>2]=a;break b}a=-1;f=wh(j,j+104|0,k+12|0)-j>>2;if((f|0)>23){break a}d:{e:{switch(b-8|0){case 0:case 2:if((b|0)>(f|0)){break d}break a;case 1:break d;default:break e}}if((b|0)!=16|(f|0)<22){break d}b=J[d>>2];if((b|0)==(c|0)|(b-c|0)>2|K[b-1|0]!=48){break a}a=0;J[e>>2]=0;J[d>>2]=b+1;H[b|0]=K[f+9056|0];break a}a=J[d>>2];J[d>>2]=a+1;H[a|0]=K[f+9056|0];J[e>>2]=J[e>>2]+1;a=0;break a}a=0;J[e>>2]=0}la=k+16|0;return a}function Lf(a,b){var c=0,d=0,e=0;a:{if(K[b|0]){break a}b=Kf(1691);if(K[b|0]?b:0){break a}b=Kf(P(a,12)+5392|0);if(K[b|0]?b:0){break a}b=Kf(1698);if(K[b|0]?b:0){break a}b=1879}b:{while(1){d=K[b+c|0];if(!(!d|(d|0)==47)){d=23;c=c+1|0;if((c|0)!=23){continue}break b}break}d=c}e=1879;c:{d:{c=K[b|0];e:{f:{if(!(K[b+d|0]|(c|0)==46)){e=b;if((c|0)!=67){break f}}if(!K[e+1|0]){break e}}if(!mb(e,1879)){break e}if(mb(e,1666)){break d}}if(!a){c=4324;if(K[e+1|0]==46){break c}}return 0}c=J[5280];if(c){while(1){if(!mb(e,c+8|0)){break c}c=J[c+32>>2];if(c){continue}break}}c=sb(36);if(c){b=J[1082];J[c>>2]=J[1081];J[c+4>>2]=b;b=c+8|0;ib(b,e,d);H[b+d|0]=0;J[c+32>>2]=J[5280];J[5280]=c}c=a|c?c:4324}return c}function xe(a){var b=0,c=0,d=0,e=0,f=0;f=J[5008];if(J[a+72>>2]<=0){ue(a)}J[5008]=J[a+136>>2];b=la-32|0;la=b;a:{b:{c:{d=J[a+4>>2];c=a;a=J[a+8>>2];if((d|0)==(a|0)){break c}a=ve(b+28|0,d,a-d|0);if((a|0)==-1){break c}J[c+4>>2]=!a+(a+J[c+4>>2]|0);break b}J[b+16>>2]=0;J[b+20>>2]=0;a=0;while(1){d=a;d:{a=J[c+4>>2];if((a|0)!=J[c+8>>2]){J[c+4>>2]=a+1;H[b+15|0]=K[a|0];break d}a=se(c);H[b+15|0]=a;if((a|0)>=0){break d}a=-1;if(!(d&1)){break a}J[c>>2]=J[c>>2]|32;J[4322]=25;break a}a=1;e=we(b+28|0,b+15|0,1,b+16|0);if((e|0)==-2){continue}break}a=-1;if((e|0)!=-1){break b}if(!(d&1)){break a}J[c>>2]=J[c>>2]|32;re(K[b+15|0],c);break a}a=J[b+28>>2]}la=b+32|0;J[5008]=f;return a}function uh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;a=la-320|0;la=a;J[a+312>>2]=c;J[a+316>>2]=b;h=Wc(a+196|0);g=a+16|0;le(g,d);vh(Oc(g),9056,9082,a+208|0);ak(g);c=Wc(a+184|0);ld(c,kd(c));b=zg(c,0);J[a+180>>2]=b;J[a+12>>2]=g;J[a+8>>2]=0;while(1){a:{if(Pc(a+316|0,a+312|0)){break a}if(J[a+180>>2]==(jd(c)+b|0)){d=jd(c);ld(c,jd(c)<<1);ld(c,kd(c));b=zg(c,0);J[a+180>>2]=d+b}d=a+316|0;if(kh(Qc(d),16,b,a+180|0,a+8|0,0,h,a+16|0,a+12|0,a+208|0)){break a}Sc(d);continue}break}ld(c,J[a+180>>2]-b|0);b=dd(c);d=_g();J[a>>2]=f;if(($g(b,d,a)|0)!=1){J[e>>2]=4}if(Pc(a+316|0,a+312|0)){J[e>>2]=J[e>>2]|2}b=J[a+316>>2];tm(c);tm(h);la=a+320|0;return b|0}function Yg(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;a=la-256|0;la=a;J[a+248>>2]=c;J[a+252>>2]=b;h=Wc(a+196|0);g=a+16|0;le(g,d);Zg(hc(g),9056,9082,a+208|0);ak(g);c=Wc(a+184|0);ld(c,kd(c));b=zg(c,0);J[a+180>>2]=b;J[a+12>>2]=g;J[a+8>>2]=0;while(1){a:{if(ic(a+252|0,a+248|0)){break a}if(J[a+180>>2]==(jd(c)+b|0)){d=jd(c);ld(c,jd(c)<<1);ld(c,kd(c));b=zg(c,0);J[a+180>>2]=d+b}d=a+252|0;if(Fg(jc(d),16,b,a+180|0,a+8|0,0,h,a+16|0,a+12|0,a+208|0)){break a}lc(d);continue}break}ld(c,J[a+180>>2]-b|0);b=dd(c);d=_g();J[a>>2]=f;if(($g(b,d,a)|0)!=1){J[e>>2]=4}if(ic(a+252|0,a+248|0)){J[e>>2]=J[e>>2]|2}b=J[a+252>>2];tm(c);tm(h);la=a+256|0;return b|0}function Re(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=la-32|0;la=c;a:{if(qc(b,-1)){if(K[a+52|0]){break a}b=J[a+48>>2];e=a,f=qc(b,-1)^1,H[e+52|0]=f;break a}b:{c:{d=K[a+52|0];if(!(!K[a+53|0]|!d)){if(Se(J[a+48>>2],J[a+32>>2])){break c}break b}if(!d){break c}H[c+19|0]=J[a+48>>2]<<24>>24;d:{e:{d=c+20|0;switch(zd(J[a+36>>2],J[a+40>>2],c+19|0,d,c+12|0,c+24|0,c+32|0,d)-1|0){case 0:case 1:break b;case 2:break e;default:break d}}d=J[a+48>>2];J[c+20>>2]=c+25;H[c+24|0]=d}while(1){d=J[c+20>>2];if(d>>>0<=c+24>>>0){break c}d=d-1|0;J[c+20>>2]=d;if((re(H[d|0],J[a+32>>2])|0)!=-1){continue}break}break b}H[a+52|0]=1;J[a+48>>2]=b;break a}b=-1}la=c+32|0;return b|0}function cf(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=la-32|0;la=c;a:{if(qc(b,-1)){if(K[a+52|0]){break a}b=J[a+48>>2];e=a,f=qc(b,-1)^1,H[e+52|0]=f;break a}b:{c:{d=K[a+52|0];if(!(!K[a+53|0]|!d)){if(df(J[a+48>>2],J[a+32>>2])){break c}break b}if(!d){break c}J[c+16>>2]=J[a+48>>2];d:{e:{d=c+20|0;switch(zd(J[a+36>>2],J[a+40>>2],c+16|0,d,c+12|0,c+24|0,c+32|0,d)-1|0){case 0:case 1:break b;case 2:break e;default:break d}}d=J[a+48>>2];J[c+20>>2]=c+25;H[c+24|0]=d}while(1){d=J[c+20>>2];if(d>>>0<=c+24>>>0){break c}d=d-1|0;J[c+20>>2]=d;if((re(H[d|0],J[a+32>>2])|0)!=-1){continue}break}break b}H[a+52|0]=1;J[a+48>>2]=b;break a}b=-1}la=c+32|0;return b|0}function sf(a,b,c,d,e,f,g,h){var i=0,j=0,k=0,l=0;j=1;i=d&2147483647;k=i;l=(i|0)==2147418112;a:{if(l&!c?a|b:l&(c|0)!=0|i>>>0>2147418112){break a}i=h&2147483647;if(!g&(i|0)==2147418112?e|f:(i|0)==2147418112&(g|0)!=0|i>>>0>2147418112){break a}if(!(a|e|(c|g)|(b|f|(i|k)))){return 0}j=d&h;if((j|0)>0){k=1}else{k=(j|0)>=0}if(k){j=-1;if((c|0)==(g|0)&(d|0)==(h|0)?(b|0)==(f|0)&a>>>0<e>>>0|b>>>0<f>>>0:c>>>0<g>>>0&(d|0)<=(h|0)|(d|0)<(h|0)){break a}return(a^e|c^g|(b^f|d^h))!=0}j=-1;if((c|0)==(g|0)&(d|0)==(h|0)?(b|0)==(f|0)&a>>>0>e>>>0|b>>>0>f>>>0:c>>>0>g>>>0&(d|0)>=(h|0)|(d|0)>(h|0)){break a}j=(a^e|c^g|(b^f|d^h))!=0}return j}function ve(a,b,c){var d=0,e=0;if(!b){return 0}a:{b:{if(!c){break b}d=K[b|0];e=d<<24>>24;if((e|0)>=0){if(a){J[a>>2]=d}return(e|0)!=0}if(!J[J[5008]>>2]){b=1;if(!a){break a}J[a>>2]=e&57343;return 1}d=d-194|0;if(d>>>0>50){break b}d=J[(d<<2)+4416>>2];if(c>>>0<=3){if(d<<P(c,6)-6<0){break b}}c=K[b+1|0];e=c>>>3|0;if((e-16|e+(d>>26))>>>0>7){break b}c=c-128|d<<6;if((c|0)>=0){b=2;if(!a){break a}J[a>>2]=c;return 2}d=K[b+2|0]-128|0;if(d>>>0>63){break b}c=d|c<<6;if((c|0)>=0){b=3;if(!a){break a}J[a>>2]=c;return 3}d=K[b+3|0]-128|0;if(d>>>0>63){break b}b=4;if(!a){break a}J[a>>2]=d|c<<6;return 4}J[4322]=25;b=-1}return b}function Ye(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0;d=la-32|0;la=d;a:{b:{c:{if(qc(b,-1)){break c}c=b<<24>>24;H[d+23|0]=c;if(K[a+44|0]){e=J[a+32>>2];a=la-16|0;la=a;H[a+15|0]=c;c=Jb(a+15|0,1,1,e);la=a+16|0;if((c|0)!=1){break b}break c}f=d+24|0;J[d+16>>2]=f;g=d+32|0;c=d+23|0;while(1){e=zd(J[a+36>>2],J[a+40>>2],c,f,d+12|0,d+24|0,g,d+16|0);if(J[d+12>>2]==(c|0)){break b}if((e|0)==3){if((Jb(c,1,1,J[a+32>>2])|0)==1){break c}break b}if(e>>>0>1){break b}c=d+24|0;h=c;c=J[d+16>>2]-c|0;if((Jb(h,1,c,J[a+32>>2])|0)!=(c|0)){break b}c=J[d+12>>2];if((e|0)==1){continue}break}}a=od(b);break a}a=-1}la=d+32|0;return a|0}function we(a,b,c,d){var e=0,f=0,g=0,h=0;g=d?d:20068;d=J[g>>2];a:{b:{c:{if(!b){if(d){break c}return 0}e=-2;if(!c){break b}d:{if(d){e=c;break d}d=K[b|0];f=d<<24>>24;if((f|0)>=0){if(a){J[a>>2]=d}return(f|0)!=0}if(!J[J[5008]>>2]){e=1;if(!a){break b}J[a>>2]=f&57343;return 1}d=d-194|0;if(d>>>0>50){break c}d=J[(d<<2)+4416>>2];e=c-1|0;if(!e){break a}b=b+1|0}f=K[b|0];h=f>>>3|0;if((h-16|(d>>26)+h)>>>0>7){break c}while(1){e=e-1|0;d=f-128|d<<6;if((d|0)>=0){J[g>>2]=0;if(a){J[a>>2]=d}return c-e|0}if(!e){break a}b=b+1|0;f=K[b|0];if((f&192)==128){continue}break}}J[g>>2]=0;J[4322]=25;e=-1}return e}J[g>>2]=d;return-2}function gf(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0;c=la-32|0;la=c;a:{b:{c:{if(qc(b,-1)){break c}J[c+20>>2]=b;if(K[a+44|0]){a=J[a+32>>2];d:{if(J[a+76>>2]<0){a=Ae(b,a);break d}a=Ae(b,a)}if((a|0)==-1){break b}break c}f=c+24|0;J[c+16>>2]=f;g=c+32|0;d=c+20|0;while(1){e=zd(J[a+36>>2],J[a+40>>2],d,f,c+12|0,c+24|0,g,c+16|0);if(J[c+12>>2]==(d|0)){break b}if((e|0)==3){if((Jb(d,1,1,J[a+32>>2])|0)==1){break c}break b}if(e>>>0>1){break b}d=c+24|0;h=d;d=J[c+16>>2]-d|0;if((Jb(h,1,d,J[a+32>>2])|0)!=(d|0)){break b}d=J[c+12>>2];if((e|0)==1){continue}break}}a=od(b);break a}a=-1}la=c+32|0;return a|0}function dn(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0;if(Pm(a,J[b+8>>2],f)){Ym(b,c,d,e);return}h=K[b+53|0];g=J[a+12>>2];H[b+53|0]=0;i=K[b+52|0];H[b+52|0]=0;j=a+16|0;$m(j,b,c,d,e,f);k=K[b+52|0];i=(i|k)!=0;l=K[b+53|0];h=(h|l)!=0;a:{if((g|0)<2){break a}j=j+(g<<3)|0;g=a+24|0;while(1){if(K[b+54|0]){break a}b:{if(k){if(J[b+24>>2]==1){break a}if(K[a+8|0]&2){break b}break a}if(!l){break b}if(!(H[a+8|0]&1)){break a}}I[b+52>>1]=0;$m(g,b,c,d,e,f);l=K[b+53|0];h=(h|l)!=0;k=K[b+52|0];i=(i|k)!=0;g=g+8|0;if(j>>>0>g>>>0){continue}break}}H[b+53|0]=h;H[b+52|0]=i}function gb(a){a=a|0;var b=0,c=0,d=0,e=0;b=la-16|0;la=b;a:{if(a){b:{if(J[4312]){break b}I[b+8>>1]=1;J[b+4>>2]=16843009;d=ya(om(152),b+4|0);c=J[4312];J[4312]=d;if(!c){break b}tb(Xa(c))}c=nb(a);if(c>>>0>=2147483632){break a}c:{d:{if(c>>>0>=11){e=(c|15)+1|0;d=om(e);J[b+12>>2]=e|-2147483648;J[b+4>>2]=d;J[b+8>>2]=c;break d}H[b+15|0]=c;d=b+4|0;if(!c){break c}}ib(d,a,c)}H[c+d|0]=0;c=1;if(H[b+15|0]<0){tb(J[b+4>>2])}Oa(b+4|0,J[4312]);if(H[17263]<0){tb(J[4313])}a=J[b+8>>2];J[4313]=J[b+4>>2];J[4314]=a;J[4315]=J[b+12>>2]}la=b+16|0;return c|0}Ba();B()}function Ki(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0,j=0,k=0,l=0;c=la-128|0;la=c;J[c+12>>2]=c+116;h=c+16|0;Li(a+8|0,h,c+12|0,e,f,g);e=la-16|0;la=e;g=e+8|0;a=la-32|0;la=a;Id(a+24|0,h,J[c+12>>2]);i=a+16|0;j=J[a+28>>2];d=la-16|0;la=d;f=J[a+24>>2];J[d+8>>2]=f;J[d+12>>2]=b;while(1){if((f|0)!=(j|0)){Ec(d+12|0,H[f|0]);f=f+1|0;J[d+8>>2]=f;continue}break}Md(i,d+8|0,d+12|0);la=d+16|0;k=a,l=Kd(h,J[a+16>>2]),J[k+12>>2]=l;J[a+8>>2]=J[a+20>>2];Md(g,a+12|0,a+8|0);la=a+32|0;la=e+16|0;la=c+128|0;return J[e+12>>2]}function pd(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;d=la-16|0;la=d;a:{if(!qc(b,-1)){f=J[a+12>>2];g=J[a+8>>2];if(J[a+24>>2]==J[a+28>>2]){c=-1;if(!(K[a+48|0]&16)){break a}h=J[a+24>>2];i=J[a+20>>2];j=J[a+44>>2];k=J[a+20>>2];c=a+32|0;Cm(c,0);ld(c,kd(c));e=dd(c);ad(a,e,jd(c)+e|0);bd(a,h-i|0);J[a+44>>2]=J[a+20>>2]+(j-k|0)}J[d+12>>2]=J[a+24>>2]+1;l=a,m=J[qd(d+12|0,a+44|0)>>2],J[l+44>>2]=m;if(K[a+48|0]&8){c=dd(a+32|0);$c(a,c,c+(f-g|0)|0,J[a+44>>2])}c=rc(a,b<<24>>24);break a}c=od(b)}a=c;la=d+16|0;return a|0}function rf(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;e=la-16|0;la=e;A(+b);g=v(1)|0;c=v(0)|0;d=g&2147483647;f=d+-1048576|0;a:{if((f|0)==2145386495|f>>>0<2145386495){h=c<<28;c=(d&15)<<28|c>>>4;d=(d>>>4|0)+1006632960|0;break a}if((d|0)==2146435072|d>>>0>2146435072){h=c<<28;c=(g&15)<<28|c>>>4;d=g>>>4|2147418112;break a}if(!(c|d)){c=0;d=0;break a}f=c;c=d?S(d):S(c)+32|0;mf(e,f,d,0,0,c+49|0);i=J[e>>2];h=J[e+4>>2];f=15372-c<<16;c=J[e+8>>2];d=f|J[e+12>>2]^65536}J[a>>2]=i;J[a+4>>2]=h;J[a+8>>2]=c;J[a+12>>2]=g&-2147483648|d;la=e+16|0}function bn(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;if(Pm(a,J[b+8>>2],e)){Zm(b,c,d);return}a:{if(Pm(a,J[b>>2],e)){if(!(J[b+16>>2]!=(c|0)&J[b+20>>2]!=(c|0))){if((d|0)!=1){break a}J[b+32>>2]=1;return}J[b+32>>2]=d;b:{if(J[b+44>>2]==4){break b}I[b+52>>1]=0;a=J[a+8>>2];na[J[J[a>>2]+20>>2]](a,b,c,c,1,e);if(K[b+53|0]){J[b+44>>2]=3;if(!K[b+52|0]){break b}break a}J[b+44>>2]=4}J[b+20>>2]=c;J[b+40>>2]=J[b+40>>2]+1;if(J[b+36>>2]!=1|J[b+24>>2]!=2){break a}H[b+54|0]=1;return}a=J[a+8>>2];na[J[J[a>>2]+24>>2]](a,b,c,d,e)}}function of(a,b,c,d,e,f){var g=0,h=0,i=0,j=0;a:{if(f&64){c=f+-64|0;b=c&31;if((c&63)>>>0>=32){c=0;b=e>>>b|0}else{c=e>>>b|0;b=((1<<b)-1&e)<<32-b|d>>>b}d=0;e=0;break a}if(!f){break a}i=d;h=64-f|0;g=h&31;if((h&63)>>>0>=32){h=d<<g;j=0}else{h=(1<<g)-1&i>>>32-g|e<<g;j=i<<g}i=b;b=f&31;if((f&63)>>>0>=32){g=0;b=c>>>b|0}else{g=c>>>b|0;b=((1<<b)-1&c)<<32-b|i>>>b}b=j|b;c=g|h;g=d;d=f&31;if((f&63)>>>0>=32){h=0;d=e>>>d|0}else{h=e>>>d|0;d=((1<<d)-1&e)<<32-d|g>>>d}e=h}J[a>>2]=b;J[a+4>>2]=c;J[a+8>>2]=d;J[a+12>>2]=e}function pg(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;g=la-32|0;la=g;J[g+28>>2]=b;a:{if(!(J[d+4>>2]&1)){J[g>>2]=-1;b=na[J[J[a>>2]+16>>2]](a,b,c,d,e,g)|0;b:{switch(J[g>>2]){case 0:H[f|0]=0;break a;case 1:H[f|0]=1;break a;default:break b}}H[f|0]=1;J[e>>2]=4;break a}le(g,d);b=hc(g);ak(g);le(g,d);a=qg(g);ak(g);rg(g,a);sg(g|12,a);d=g+24|0;h=f,i=(tg(g+28|0,c,g,d,b,e,1)|0)==(g|0),H[h|0]=i;b=J[g+28>>2];while(1){d=tm(d-12|0);if((g|0)!=(d|0)){continue}break}}la=g+32|0;return b|0}function dh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;g=la-32|0;la=g;J[g+28>>2]=b;a:{if(!(J[d+4>>2]&1)){J[g>>2]=-1;b=na[J[J[a>>2]+16>>2]](a,b,c,d,e,g)|0;b:{switch(J[g>>2]){case 0:H[f|0]=0;break a;case 1:H[f|0]=1;break a;default:break b}}H[f|0]=1;J[e>>2]=4;break a}le(g,d);b=Oc(g);ak(g);le(g,d);a=eh(g);ak(g);rg(g,a);sg(g|12,a);d=g+24|0;h=f,i=(fh(g+28|0,c,g,d,b,e,1)|0)==(g|0),H[h|0]=i;b=J[g+28>>2];while(1){d=Fm(d-12|0);if((g|0)!=(d|0)){continue}break}}la=g+32|0;return b|0}function ml(a){a=a|0;if(K[21484]){return J[5370]}if(!K[22576]){H[22576]=1}jl(22288,15112);jl(22300,15144);jl(22312,15180);jl(22324,15204);jl(22336,15228);jl(22348,15244);jl(22360,15264);jl(22372,15284);jl(22384,15312);jl(22396,15352);jl(22408,15384);jl(22420,15420);jl(22432,15456);jl(22444,15472);jl(22456,15488);jl(22468,15504);jl(22480,15228);jl(22492,15520);jl(22504,15536);jl(22516,15552);jl(22528,15568);jl(22540,15584);jl(22552,15600);jl(22564,15616);H[21484]=1;J[5370]=22288;return 22288}function mf(a,b,c,d,e,f){var g=0,h=0,i=0;a:{if(f&64){e=f+-64|0;f=b;d=e&31;if((e&63)>>>0>=32){e=f<<d;d=0}else{e=(1<<d)-1&f>>>32-d|c<<d;d=f<<d}b=0;c=0;break a}if(!f){break a}h=d;g=f&31;if((f&63)>>>0>=32){i=d<<g;h=0}else{i=(1<<g)-1&h>>>32-g|e<<g;h=h<<g}g=b;e=64-f|0;d=e&31;if((e&63)>>>0>=32){e=0;d=c>>>d|0}else{e=c>>>d|0;d=((1<<d)-1&c)<<32-d|g>>>d}d=h|d;e=e|i;h=b;g=f&31;if((f&63)>>>0>=32){i=b<<g;b=0}else{i=(1<<g)-1&h>>>32-g|c<<g;b=h<<g}c=i}J[a>>2]=b;J[a+4>>2]=c;J[a+8>>2]=d;J[a+12>>2]=e}function Fb(a){var b=0,c=0,d=0;if(!a){if(J[4270]){b=Fb(J[4270])}if(J[4308]){b=Fb(J[4308])|b}a=J[4463];if(a){while(1){if(J[a+20>>2]!=J[a+28>>2]){b=Fb(a)|b}a=J[a+56>>2];if(a){continue}break}}return b}d=J[a+76>>2]<0;a:{b:{if(J[a+20>>2]==J[a+28>>2]){break b}na[J[a+36>>2]](a,0,0)|0;if(J[a+20>>2]){break b}b=-1;break a}b=J[a+8>>2];c=J[a+4>>2];if((b|0)!=(c|0)){b=c-b|0;na[J[a+40>>2]](a,b,b>>31,1)|0}b=0;J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;J[a+4>>2]=0;J[a+8>>2]=0;if(d){break a}}return b}function kl(a){a=a|0;if(K[21476]){return J[5368]}if(!K[22272]){H[22272]=1}el(21984,1070);el(21996,1061);el(22008,1457);el(22020,1409);el(22032,1140);el(22044,1516);el(22056,1078);el(22068,1228);el(22080,1284);el(22092,1267);el(22104,1275);el(22116,1294);el(22128,1398);el(22140,1617);el(22152,1319);el(22164,1256);el(22176,1140);el(22188,1343);el(22200,1402);el(22212,1463);el(22224,1323);el(22236,1242);el(22248,1182);el(22260,1613);H[21476]=1;J[5368]=21984;return 21984}function $a(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0;g=la-32|0;la=g;H[g+31|0]=(f|0)!=0;H[g+30|0]=(e|0)!=0;H[g+29|0]=(d|0)!=0;H[g+28|0]=(c|0)!=0;H[g+27|0]=(b|0)!=0;H[g+26|0]=(a|0)!=0;a=ya(om(152),g+26|0);b=J[4312];J[4312]=a;c=g+12|0;if(b){tb(Xa(b));a=J[4312]}Oa(c,a);if(H[17263]<0){tb(J[4313])}a=J[g+16>>2];J[4313]=J[g+12>>2];J[4314]=a;J[4315]=J[g+20>>2];wm(17264,2136,29);a:{if(H[17287]<0){J[4320]=0;a=J[4319];break a}H[17287]=0;a=17276}H[a|0]=0;la=g+32|0}function Em(a,b,c,d,e,f,g,h){var i=0,j=0,k=0,l=0;i=la-16|0;la=i;j=1073741807;if(j+(b^-1)>>>0>=c>>>0){k=dd(a);l=i+4|0;if(b>>>0<536870887){J[i+12>>2]=b<<1;J[i+4>>2]=b+c;j=Ll(J[qd(l,i+12|0)>>2])+1|0}Ml(l,j);c=J[i+4>>2];if(e){Kc(c,k,e)}if(g){Kc(c+(e<<2)|0,h,g)}j=e+f|0;h=d-j|0;if((d|0)!=(j|0)){d=e<<2;Kc((d+c|0)+(g<<2)|0,(d+k|0)+(f<<2)|0,h)}if((b|0)!=1){Pl(k)}$d(a,c);ae(a,J[i+8>>2]);b=a;a=h+(e+g|0)|0;be(b,a);J[i+12>>2]=0;pj(c+(a<<2)|0,i+12|0);la=i+16|0;return}ce();B()}function Hf(a,b,c){var d=0,e=0;d=(c|0)!=0;a:{b:{c:{if(!(a&3)|!c){break c}e=b&255;while(1){if((e|0)==K[a|0]){break b}c=c-1|0;d=(c|0)!=0;a=a+1|0;if(!(a&3)){break c}if(c){continue}break}}if(!d){break a}d=b&255;if(!((d|0)==K[a|0]|c>>>0<4)){d=P(d,16843009);while(1){e=d^J[a>>2];if((e^-1)&e-16843009&-2139062144){break b}a=a+4|0;c=c-4|0;if(c>>>0>3){continue}break}}if(!c){break a}}b=b&255;while(1){if((b|0)==K[a|0]){return a}a=a+1|0;c=c-1|0;if(c){continue}break}}return 0}function sm(a,b,c,d,e,f,g,h){var i=0,j=0,k=0;i=la-16|0;la=i;if((b^-1)+2147483631>>>0>=c>>>0){k=dd(a);j=i+4|0;if(b>>>0<1073741799){J[i+12>>2]=b<<1;J[i+4>>2]=b+c;c=Zd(J[qd(j,i+12|0)>>2])+1|0}else{c=2147483631}_d(j,c);c=J[i+4>>2];if(e){Wb(c,k,e)}if(g){Wb(c+e|0,h,g)}j=e+f|0;h=d-j|0;if((d|0)!=(j|0)){Wb((c+e|0)+g|0,(e+k|0)+f|0,h)}b=b+1|0;if((b|0)!=11){Rd(k,b)}$d(a,c);ae(a,J[i+8>>2]);b=a;a=h+(e+g|0)|0;be(b,a);H[i+12|0]=0;Td(a+c|0,i+12|0);la=i+16|0;return}ce();B()}function Pg(a,b,c,d){var e=0,f=0,g=0,h=0;e=la-16|0;la=e;a:{b:{c:{if((a|0)!=(b|0)){d:{e:{f=K[a|0];if((f|0)!=45){break e}a=a+1|0;if((b|0)!=(a|0)){break e}break d}h=J[4322];J[4322]=0;a=mm(a,e+12|0,d,_g());d=ma;g=J[4322];f:{if(g){if(J[e+12>>2]!=(b|0)){break f}if((g|0)==68){break c}break b}J[4322]=h;if(J[e+12>>2]==(b|0)){break b}}}}J[c>>2]=4;b=0;a=0;break a}J[c>>2]=4;b=-1;a=-1;break a}c=(f|0)==45;b=c?0-a|0:a;a=c?0-(d+((a|0)!=0)|0)|0:d}la=e+16|0;ma=a;return b}function Lg(a,b,c,d){var e=0,f=0,g=0,h=0;e=la-16|0;la=e;a:{b:{c:{d:{if((a|0)!=(b|0)){e:{f:{f=K[a|0];if((f|0)!=45){break f}a=a+1|0;if((b|0)!=(a|0)){break f}break e}h=J[4322];J[4322]=0;a=mm(a,e+12|0,d,_g());d=ma;g=J[4322];g:{if(g){if(J[e+12>>2]!=(b|0)){break g}if((g|0)==68){break c}break d}J[4322]=h;if(J[e+12>>2]==(b|0)){break d}}}}J[c>>2]=4;a=0;break a}if(!d&a>>>0<=65535){break b}}J[c>>2]=4;a=65535;break a}a=(f|0)==45?0-a|0:a}la=e+16|0;return a&65535}function tf(a,b,c,d,e){var f=0,g=0,h=0;h=-1;g=d&2147483647;f=(g|0)==2147418112;a:{if(f&!c?a|b:f&(c|0)!=0|g>>>0>2147418112){break a}f=e&2147483647;if(((f|0)==2147418112&0|f>>>0>2147418112)&(f|0)!=2147418112){break a}if(!(a|c|(f|g|b))){return 0}f=d&e;if((f|0)>0){f=1}else{f=(f|0)>=0}if(f){if(((c|0)!=0|(d|0)!=(e|0))&(d|0)<(e|0)){break a}return(a|c|(d^e|b))!=0}if(!c&(d|0)==(e|0)?a|b:(c|0)!=0&(d|0)>=(e|0)|(d|0)>(e|0)){break a}h=(a|c|(d^e|b))!=0}return h}function Gg(a,b,c,d){var e=0,f=0,g=0;e=la-16|0;la=e;a:{b:{c:{if((a|0)!=(b|0)){g=J[4322];J[4322]=0;d=lm(a,e+12|0,d,_g());a=ma;f=J[4322];d:{if(f){if(J[e+12>>2]!=(b|0)){break d}if((f|0)==68){break b}break c}J[4322]=g;if(J[e+12>>2]==(b|0)){break c}}}J[c>>2]=4;b=0;break a}if((a|0)<0&d>>>0<2147483648|(a|0)<-1|(d>>>0>2147483647&(a|0)>=0|(a|0)>0)){break b}b=d;break a}J[c>>2]=4;b=2147483647;if(!!d&(a|0)>=0|(a|0)>0){break a}b=-2147483648}la=e+16|0;return b}function zb(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;d=la-32|0;la=d;J[d+16>>2]=b;e=J[a+48>>2];J[d+20>>2]=c-((e|0)!=0);g=J[a+44>>2];J[d+28>>2]=e;J[d+24>>2]=g;a:{b:{if(wb(ea(J[a+60>>2],d+16|0,2,d+12|0)|0)){b=32}else{e=J[d+12>>2];if((e|0)>0){break b}b=e?32:16}J[a>>2]=b|J[a>>2];break a}f=e;g=J[d+20>>2];if(g>>>0>=e>>>0){break a}f=J[a+44>>2];J[a+4>>2]=f;J[a+8>>2]=f+(e-g|0);if(J[a+48>>2]){J[a+4>>2]=f+1;H[(b+c|0)-1|0]=K[f|0]}f=c}la=d+32|0;return f|0}function di(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;a=la-256|0;la=a;H[a+252|0]=0;H[a+253|0]=0;H[a+254|0]=0;H[a+255|0]=0;H[a+249|0]=0;H[a+250|0]=0;H[a+251|0]=0;H[a+252|0]=0;H[a+248|0]=37;Hh(a+249|0,1406,0,J[c+4>>2]);g=_g();J[a>>2]=e;J[a+4>>2]=f;h=a+224|0;e=Ih(h,24,g,a+248|0,a)+h|0;f=Jh(h,e,c);g=a+20|0;le(g,c);i=e;e=a+32|0;$h(h,f,i,e,a+28|0,a+24|0,g);ak(g);b=ai(b,e,J[a+28>>2],J[a+24>>2],c,d);la=a+256|0;return b|0}function bi(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;a=la-256|0;la=a;H[a+252|0]=0;H[a+253|0]=0;H[a+254|0]=0;H[a+255|0]=0;H[a+249|0]=0;H[a+250|0]=0;H[a+251|0]=0;H[a+252|0]=0;H[a+248|0]=37;Hh(a+249|0,1406,1,J[c+4>>2]);g=_g();J[a>>2]=e;J[a+4>>2]=f;h=a+224|0;e=Ih(h,24,g,a+248|0,a)+h|0;f=Jh(h,e,c);g=a+20|0;le(g,c);i=e;e=a+32|0;$h(h,f,i,e,a+28|0,a+24|0,g);ak(g);b=ai(b,e,J[a+28>>2],J[a+24>>2],c,d);la=a+256|0;return b|0}function ye(a,b){a:{if(a){if(b>>>0<=127){break a}b:{if(!J[J[5008]>>2]){if((b&-128)==57216){break a}break b}if(b>>>0<=2047){H[a+1|0]=b&63|128;H[a|0]=b>>>6|192;return 2}if(!((b&-8192)!=57344&b>>>0>=55296)){H[a+2|0]=b&63|128;H[a|0]=b>>>12|224;H[a+1|0]=b>>>6&63|128;return 3}if(b-65536>>>0<=1048575){H[a+3|0]=b&63|128;H[a|0]=b>>>18|240;H[a+2|0]=b>>>6&63|128;H[a+1|0]=b>>>12&63|128;return 4}}J[4322]=25;a=-1}else{a=1}return a}H[a|0]=b;return 1}function Oh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;a=la-112|0;la=a;H[a+108|0]=0;H[a+109|0]=0;H[a+110|0]=0;H[a+111|0]=0;H[a+105|0]=0;H[a+106|0]=0;H[a+107|0]=0;H[a+108|0]=0;H[a+104|0]=37;Hh(a+105|0,1406,0,J[c+4>>2]);g=_g();J[a>>2]=e;J[a+4>>2]=f;h=a+80|0;e=Ih(h,24,g,a+104|0,a)+h|0;f=Jh(h,e,c);g=a+20|0;le(g,c);i=e;e=a+32|0;Kh(h,f,i,e,a+28|0,a+24|0,g);ak(g);b=Lh(b,e,J[a+28>>2],J[a+24>>2],c,d);la=a+112|0;return b|0}function Mh(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0;a=la-112|0;la=a;H[a+108|0]=0;H[a+109|0]=0;H[a+110|0]=0;H[a+111|0]=0;H[a+105|0]=0;H[a+106|0]=0;H[a+107|0]=0;H[a+108|0]=0;H[a+104|0]=37;Hh(a+105|0,1406,1,J[c+4>>2]);g=_g();J[a>>2]=e;J[a+4>>2]=f;h=a+80|0;e=Ih(h,24,g,a+104|0,a)+h|0;f=Jh(h,e,c);g=a+20|0;le(g,c);i=e;e=a+32|0;Kh(h,f,i,e,a+28|0,a+24|0,g);ak(g);b=Lh(b,e,J[a+28>>2],J[a+24>>2],c,d);la=a+112|0;return b|0}function Ng(a,b,c,d){var e=0,f=0,g=0,h=0;e=la-16|0;la=e;a:{b:{c:{d:{if((a|0)!=(b|0)){e:{f:{f=K[a|0];if((f|0)!=45){break f}a=a+1|0;if((b|0)!=(a|0)){break f}break e}h=J[4322];J[4322]=0;a=mm(a,e+12|0,d,_g());d=ma;g=J[4322];g:{if(g){if(J[e+12>>2]!=(b|0)){break g}if((g|0)==68){break c}break d}J[4322]=h;if(J[e+12>>2]==(b|0)){break d}}}}J[c>>2]=4;a=0;break a}if(!d){break b}}J[c>>2]=4;a=-1;break a}a=(f|0)==45?0-a|0:a}la=e+16|0;return a}function zf(a,b,c,d,e,f,g,h,i){var j=0,k=0,l=0,m=0;i=wn(b,c,h,i);h=ma;e=wn(d,e,f,g);i=e+i|0;d=ma+h|0;h=e>>>0>i>>>0?d+1|0:d;j=g;e=0;k=c;d=0;c=wn(g,e,c,d);g=c+i|0;i=ma+h|0;l=g;c=c>>>0>g>>>0?i+1|0:i;g=wn(f,0,b,0);h=ma;i=0;d=wn(f,i,k,d);h=h+d|0;f=ma+i|0;f=d>>>0>h>>>0?f+1|0:f;i=f+l|0;d=c;f=f>>>0>i>>>0?d+1|0:d;b=wn(b,m,j,e)+h|0;e=ma;e=b>>>0<h>>>0?e+1|0:e;h=e+i|0;i=f;J[a+8>>2]=h;J[a+12>>2]=e>>>0>h>>>0?i+1|0:i;J[a>>2]=g;J[a+4>>2]=b}function Jc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;e=la-16|0;la=e;while(1){a:{if((c|0)<=(g|0)){break a}d=J[a+16>>2];f=J[a+12>>2];b:{if(d>>>0>f>>>0){J[e+12>>2]=2147483647;J[e+8>>2]=d-f>>2;J[e+4>>2]=c-g;d=J[Vb(e+12|0,Vb(e+8|0,e+4|0))>>2];Kc(b,J[a+12>>2],d);f=d<<2;J[a+12>>2]=f+J[a+12>>2];b=b+f|0;break b}d=na[J[J[a>>2]+40>>2]](a)|0;if((d|0)==-1){break a}J[b>>2]=d;d=1;b=b+4|0}g=d+g|0;continue}break}la=e+16|0;return g|0}function Xh(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=la-32|0;la=f;J[f+28>>2]=b;a:{if(!(J[c+4>>2]&1)){c=na[J[J[a>>2]+24>>2]](a,b,c,d,e)|0;break a}b=f+16|0;le(b,c);a=eh(b);ak(b);b:{if(e){rg(b,a);break b}sg(f+16|0,a)}g=f,h=Bh(f+16|0),J[g+12>>2]=h;while(1){g=f,h=Yh(f+16|0),J[g+8>>2]=h;a=f+12|0;if(Dh(a,f+8|0)){Vc(f+28|0,J[J[a>>2]>>2]);Zh(a);continue}else{c=J[f+28>>2];Fm(f+16|0)}break}}la=f+32|0;return c|0}function ci(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;a=la-144|0;la=a;H[a+140|0]=0;H[a+141|0]=0;H[a+142|0]=0;H[a+143|0]=0;H[a+137|0]=0;H[a+138|0]=0;H[a+139|0]=0;H[a+140|0]=0;H[a+136|0]=37;Hh(a+137|0,1413,0,J[c+4>>2]);g=_g();J[a>>2]=e;f=a+123|0;e=Ih(f,13,g,a+136|0,a)+f|0;g=Jh(f,e,c);h=a+4|0;le(h,c);i=e;e=a+16|0;$h(f,g,i,e,a+12|0,a+8|0,h);ak(h);b=ai(b,e,J[a+12>>2],J[a+8>>2],c,d);la=a+144|0;return b|0}function _h(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;a=la-144|0;la=a;H[a+140|0]=0;H[a+141|0]=0;H[a+142|0]=0;H[a+143|0]=0;H[a+137|0]=0;H[a+138|0]=0;H[a+139|0]=0;H[a+140|0]=0;H[a+136|0]=37;Hh(a+137|0,1413,1,J[c+4>>2]);g=_g();J[a>>2]=e;f=a+123|0;e=Ih(f,13,g,a+136|0,a)+f|0;g=Jh(f,e,c);h=a+4|0;le(h,c);i=e;e=a+16|0;$h(f,g,i,e,a+12|0,a+8|0,h);ak(h);b=ai(b,e,J[a+12>>2],J[a+8>>2],c,d);la=a+144|0;return b|0}function Ah(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0;f=la-32|0;la=f;J[f+28>>2]=b;a:{if(!(J[c+4>>2]&1)){c=na[J[J[a>>2]+24>>2]](a,b,c,d,e)|0;break a}b=f+16|0;le(b,c);a=qg(b);ak(b);b:{if(e){rg(b,a);break b}sg(f+16|0,a)}g=f,h=Bh(f+16|0),J[g+12>>2]=h;while(1){g=f,h=Ch(f+16|0),J[g+8>>2]=h;a=f+12|0;if(Dh(a,f+8|0)){Ec(f+28|0,H[J[a>>2]]);Eh(a);continue}else{c=J[f+28>>2];tm(f+16|0)}break}}la=f+32|0;return c|0}function df(a,b){var c=0,d=0,e=0,f=0,g=0;e=la-16|0;la=e;g=J[5008];if(J[b+72>>2]<=0){ue(b)}J[5008]=J[b+136>>2];c=-1;if(!J[b+4>>2]){Gb(b);d=!J[b+4>>2]}a:{if(d|(a|0)==-1){break a}d=ye(e+12|0,a);if((d|0)<0){break a}f=J[b+4>>2];if(f>>>0<(d+J[b+44>>2]|0)-8>>>0){break a}b:{if(a>>>0<=127){c=f-1|0;J[b+4>>2]=c;H[c|0]=a;break b}c=f-d|0;J[b+4>>2]=c;ib(c,e+12|0,d)}J[b>>2]=J[b>>2]&-17;c=a}J[5008]=g;la=e+16|0;return(c|0)!=-1}function Ub(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;e=la-16|0;la=e;while(1){a:{if((c|0)<=(f|0)){break a}d=J[a+16>>2];g=J[a+12>>2];b:{if(d>>>0>g>>>0){J[e+12>>2]=2147483647;J[e+8>>2]=d-g;J[e+4>>2]=c-f;d=J[Vb(e+12|0,Vb(e+8|0,e+4|0))>>2];Wb(b,J[a+12>>2],d);J[a+12>>2]=J[a+12>>2]+d;break b}d=na[J[J[a>>2]+40>>2]](a)|0;if((d|0)==-1){break a}H[b|0]=d<<24>>24;d=1}b=b+d|0;f=d+f|0;continue}break}la=e+16|0;return f|0}function Nh(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;a=la+-64|0;la=a;H[a+60|0]=0;H[a+61|0]=0;H[a+62|0]=0;H[a+63|0]=0;H[a+57|0]=0;H[a+58|0]=0;H[a+59|0]=0;H[a+60|0]=0;H[a+56|0]=37;Hh(a+57|0,1413,0,J[c+4>>2]);g=_g();J[a>>2]=e;f=a+43|0;e=Ih(f,13,g,a+56|0,a)+f|0;g=Jh(f,e,c);h=a+4|0;le(h,c);i=e;e=a+16|0;Kh(f,g,i,e,a+12|0,a+8|0,h);ak(h);b=Lh(b,e,J[a+12>>2],J[a+8>>2],c,d);la=a- -64|0;return b|0}function Gh(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;a=la+-64|0;la=a;H[a+60|0]=0;H[a+61|0]=0;H[a+62|0]=0;H[a+63|0]=0;H[a+57|0]=0;H[a+58|0]=0;H[a+59|0]=0;H[a+60|0]=0;H[a+56|0]=37;Hh(a+57|0,1413,1,J[c+4>>2]);g=_g();J[a>>2]=e;f=a+43|0;e=Ih(f,13,g,a+56|0,a)+f|0;g=Jh(f,e,c);h=a+4|0;le(h,c);i=e;e=a+16|0;Kh(f,g,i,e,a+12|0,a+8|0,h);ak(h);b=Lh(b,e,J[a+12>>2],J[a+8>>2],c,d);la=a- -64|0;return b|0}function ac(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;e=la-16|0;la=e;while(1){a:{if((c|0)<=(f|0)){break a}d=J[a+28>>2];g=J[a+24>>2];if(d>>>0<=g>>>0){if(((i=a,j=_b(H[b|0]),h=J[J[a>>2]+52>>2],na[h](i|0,j|0)|0)|0)==-1){break a}f=f+1|0;b=b+1|0}else{J[e+12>>2]=d-g;J[e+8>>2]=c-f;d=J[Vb(e+12|0,e+8|0)>>2];Wb(J[a+24>>2],b,d);J[a+24>>2]=d+J[a+24>>2];f=f+d|0;b=b+d|0}continue}break}la=e+16|0;return f|0}function Ib(a,b,c){var d=0,e=0,f=0;d=J[c+16>>2];a:{if(!d){if(Hb(c)){break a}d=J[c+16>>2]}e=J[c+20>>2];if(d-e>>>0<b>>>0){return na[J[c+36>>2]](c,a,b)|0}b:{c:{if(!b|J[c+80>>2]<0){break c}d=b;while(1){f=a+d|0;if(K[f-1|0]!=10){d=d-1|0;if(d){continue}break c}break}e=na[J[c+36>>2]](c,a,d)|0;if(e>>>0<d>>>0){break a}b=b-d|0;e=J[c+20>>2];break b}f=a;d=0}ib(e,f,b);J[c+20>>2]=J[c+20>>2]+b;e=b+d|0}return e}function ii(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0;h=la-16|0;la=h;d=la-16|0;la=d;a:{if(b>>>0<=1073741807){b:{if(Kl(b)){Sd(a,b);e=a;break b}Ml(d+8|0,Ll(b)+1|0);e=J[d+8>>2];$d(a,e);ae(a,J[d+12>>2]);be(a,b)}f=la-16|0;la=f;J[f+12>>2]=c;g=e;c=b;i=f+12|0;while(1){if(c){J[g>>2]=J[i>>2];c=c-1|0;g=g+4|0;continue}break}la=f+16|0;J[d+4>>2]=0;pj((b<<2)+e|0,d+4|0);la=d+16|0;break a}ce();B()}la=h+16|0;return a}function Mc(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;d=la-16|0;la=d;while(1){a:{if((c|0)<=(e|0)){break a}f=J[a+24>>2];g=J[a+28>>2];if(f>>>0>=g>>>0){if((na[J[J[a>>2]+52>>2]](a,J[b>>2])|0)==-1){break a}e=e+1|0;b=b+4|0}else{J[d+12>>2]=g-f>>2;J[d+8>>2]=c-e;f=J[Vb(d+12|0,d+8|0)>>2];Kc(J[a+24>>2],b,f);g=f<<2;J[a+24>>2]=g+J[a+24>>2];e=e+f|0;b=b+g|0}continue}break}la=d+16|0;return e|0}function Tg(a,b,c){var d=0,e=0,f=Q(0),g=0,h=Q(0);e=la-16|0;la=e;a:{b:{c:{if((a|0)!=(b|0)){g=J[4322];J[4322]=0;_g();d=la-16|0;la=d;fg(d,a,e+12|0,0);f=Ef(J[d>>2],J[d+4>>2],J[d+8>>2],J[d+12>>2]);la=d+16|0;a=J[4322];if(!a){break c}if(J[e+12>>2]!=(b|0)){break b}h=f;if((a|0)!=68){break a}break b}J[c>>2]=4;break a}J[4322]=g;if(J[e+12>>2]==(b|0)){break a}}J[c>>2]=4;f=h}la=e+16|0;return f}function Kj(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;e=la-16|0;la=e;a:{if(!id(f)){J[a+8>>2]=J[f+8>>2];b=J[f+4>>2];J[a>>2]=J[f>>2];J[a+4>>2]=b;break a}d=J[f>>2];c=la-16|0;la=c;b:{c:{f=J[f+4>>2];d:{if(Kl(f)){b=a;Sd(a,f);break d}if(f>>>0>1073741807){break c}Ml(c+8|0,Ll(f)+1|0);b=J[c+8>>2];$d(a,b);ae(a,J[c+12>>2]);be(a,f)}Kc(b,d,f+1|0);la=c+16|0;break b}ce();B()}}la=e+16|0}function Vg(a,b,c){var d=0,e=0,f=0,g=0,h=0;e=la-16|0;la=e;a:{b:{c:{if((a|0)!=(b|0)){g=J[4322];J[4322]=0;_g();d=la-16|0;la=d;fg(d,a,e+12|0,1);f=Ff(J[d>>2],J[d+4>>2],J[d+8>>2],J[d+12>>2]);la=d+16|0;a=J[4322];if(!a){break c}if(J[e+12>>2]!=(b|0)){break b}h=f;if((a|0)!=68){break a}break b}J[c>>2]=4;break a}J[4322]=g;if(J[e+12>>2]==(b|0)){break a}}J[c>>2]=4;f=h}la=e+16|0;return f}function Jg(a,b,c,d){var e=0,f=0,g=0;e=la-16|0;la=e;a:{b:{if((a|0)!=(b|0)){g=J[4322];J[4322]=0;a=lm(a,e+12|0,d,_g());d=ma;f=J[4322];c:{if(f){if(J[e+12>>2]!=(b|0)){break c}if((f|0)==68){break b}break a}J[4322]=g;if(J[e+12>>2]==(b|0)){break a}}}J[c>>2]=4;a=0;d=0;break a}J[c>>2]=4;if(!!a&(d|0)>=0|(d|0)>0){a=-1;d=2147483647;break a}a=0;d=-2147483648}la=e+16|0;ma=d;return a}function Qh(a,b,c){var d=0,e=0;if(c&2048){H[a|0]=43;a=a+1|0}if(c&1024){H[a|0]=35;a=a+1|0}d=c&260;if((d|0)!=260){H[a|0]=46;H[a+1|0]=42;a=a+2|0}c=c&16384;while(1){e=K[b|0];if(e){H[a|0]=e;a=a+1|0;b=b+1|0;continue}break}a:{b:{if((d|0)!=256){if((d|0)!=4){break b}b=c?70:102;break a}b=c?69:101;break a}b=c?65:97;if((d|0)==260){break a}b=c?71:103}H[a|0]=b;return(d|0)!=260}function bj(a,b,c,d,e){var f=0,g=0,h=0;f=la-16|0;la=f;a:{if(2147483631-b>>>0>=c>>>0){g=dd(a);h=f+4|0;if(b>>>0<1073741799){J[f+12>>2]=b<<1;J[f+4>>2]=b+c;c=Zd(J[qd(h,f+12|0)>>2])+1|0}else{c=2147483631}_d(h,c);c=J[f+4>>2];if(e){Wb(c,g,e)}if((d|0)!=(e|0)){Wb(c+e|0,e+g|0,d-e|0)}b=b+1|0;if((b|0)!=11){Rd(g,b)}$d(a,c);ae(a,J[f+8>>2]);la=f+16|0;break a}ce();B()}be(a,d)}function Sj(a){var b=0,c=0,d=0;b=la-32|0;la=b;J[b+16>>2]=0;J[b+12>>2]=102;c=J[b+16>>2];J[b>>2]=J[b+12>>2];J[b+4>>2]=c;d=J[b+4>>2];c=b+20|0;J[c+4>>2]=J[b>>2];J[c+8>>2]=d;J[c>>2]=a;d=la-16|0;la=d;if(J[a>>2]!=-1){c=Nj(d+8|0,Nj(d+12|0,c));while(1){if(J[a>>2]==1){continue}break}if(!J[a>>2]){J[a>>2]=1;dk(c);J[a>>2]=-1}}la=d+16|0;la=b+32|0;return J[a+4>>2]-1|0}function wi(a,b,c,d,e){var f=0,g=0,h=0;f=la-16|0;la=f;J[f+12>>2]=b;b=0;g=6;a:{b:{if(ic(a,f+12|0)){break b}g=4;h=jc(a);if(!kc(d,64,h)){break b}b=mi(d,h);while(1){c:{lc(a);b=b-48|0;if(ic(a,f+12|0)|(e|0)<2){break c}g=jc(a);if(!kc(d,64,g)){break a}e=e-1|0;b=mi(d,g)+P(b,10)|0;continue}break}g=2;if(!ic(a,f+12|0)){break a}}J[c>>2]=J[c>>2]|g}la=f+16|0;return b}function Kk(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0;while(1){a:{if((c|0)==(d|0)|e>>>0<=h>>>0){break a}g=1;f=la-16|0;la=f;J[f+12>>2]=J[a+8>>2];k=bh(f+8|0,f+12|0);i=we(0,c,d-c|0,b?b:21176);ch(k);la=f+16|0;b:{switch(i+2|0){default:g=i;break;case 0:case 1:break a;case 2:break b}}h=h+1|0;j=g+j|0;c=c+g|0;continue}break}return j|0}function Ii(a,b,c,d,e){var f=0,g=0,h=0;f=la-16|0;la=f;J[f+12>>2]=b;b=0;g=6;a:{b:{if(Pc(a,f+12|0)){break b}g=4;h=Qc(a);if(!Rc(d,64,h)){break b}b=zi(d,h);while(1){c:{Sc(a);b=b-48|0;if(Pc(a,f+12|0)|(e|0)<2){break c}g=Qc(a);if(!Rc(d,64,g)){break a}e=e-1|0;b=zi(d,g)+P(b,10)|0;continue}break}g=2;if(!Pc(a,f+12|0)){break a}}J[c>>2]=J[c>>2]|g}la=f+16|0;return b}function Zf(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0;e=J[a+84>>2];f=J[e>>2];d=J[e+4>>2];h=J[a+28>>2];g=J[a+20>>2]-h|0;g=d>>>0<g>>>0?d:g;if(g){ib(f,h,g);f=g+J[e>>2]|0;J[e>>2]=f;d=J[e+4>>2]-g|0;J[e+4>>2]=d}d=c>>>0>d>>>0?d:c;if(d){ib(f,b,d);f=d+J[e>>2]|0;J[e>>2]=f;J[e+4>>2]=J[e+4>>2]-d}H[f|0]=0;b=J[a+44>>2];J[a+28>>2]=b;J[a+20>>2]=b;return c|0}function sj(a,b,c,d,e){var f=0,g=0,h=0,i=0;f=la-16|0;la=f;a:{g=1073741807;if(g-b>>>0>=c>>>0){h=dd(a);i=f+4|0;if(b>>>0<536870887){J[f+12>>2]=b<<1;J[f+4>>2]=b+c;g=Ll(J[qd(i,f+12|0)>>2])+1|0}Ml(i,g);c=J[f+4>>2];if(e){Kc(c,h,e)}if((d|0)!=(e|0)){g=e<<2;Kc(g+c|0,g+h|0,d-e|0)}if((b|0)!=1){Pl(h)}$d(a,c);ae(a,J[f+8>>2]);la=f+16|0;break a}ce();B()}be(a,d)}function Zi(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0;e=la-16|0;la=e;f=J[$i(a)>>2];d=J[c>>2]-J[a>>2]|0;a:{if(d>>>0<2147483647){d=d<<1;break a}d=-1}d=d>>>0<=1?1:d;h=J[b>>2];i=J[a>>2];g=ub((f|0)!=101?J[a>>2]:0,d);if(g){if((f|0)!=101){jj(a)}J[e+4>>2]=100;f=wg(e+8|0,g,e+4|0);kj(a,f);Bg(f);J[b>>2]=J[a>>2]+(h-i|0);J[c>>2]=d+J[a>>2];la=e+16|0;return}yd();B()}function Ym(a,b,c,d){H[a+53|0]=1;a:{if(J[a+4>>2]!=(c|0)){break a}H[a+52|0]=1;c=J[a+16>>2];b:{if(!c){J[a+36>>2]=1;J[a+24>>2]=d;J[a+16>>2]=b;if((d|0)!=1){break a}if(J[a+48>>2]==1){break b}break a}if((b|0)==(c|0)){c=J[a+24>>2];if((c|0)==2){J[a+24>>2]=d;c=d}if(J[a+48>>2]!=1){break a}if((c|0)==1){break b}break a}J[a+36>>2]=J[a+36>>2]+1}H[a+54|0]=1}}function _i(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0;e=la-16|0;la=e;f=J[$i(a)>>2];d=J[c>>2]-J[a>>2]|0;a:{if(d>>>0<2147483647){d=d<<1;break a}d=-1}d=d?d:4;h=J[b>>2];i=J[a>>2];g=ub((f|0)!=101?J[a>>2]:0,d);if(g){if((f|0)!=101){jj(a)}J[e+4>>2]=100;f=wg(e+8|0,g,e+4|0);kj(a,f);Bg(f);J[b>>2]=J[a>>2]+(h-i|0);J[c>>2]=J[a>>2]+(d&-4);la=e+16|0;return}yd();B()}function ai(a,b,c,d,e,f){var g=0,h=0,i=0,j=0;h=la-16|0;la=h;a:{if(!a){break a}g=J[e+12>>2];i=c-b>>2;if((i|0)>0){if((Fc(a,b,i)|0)!=(i|0)){break a}}b=d-b>>2;b=(b|0)<(g|0)?g-b|0:0;if((b|0)>0){f=ii(h+4|0,b,f);g=Fc(a,dd(f),b);Fm(f);if((b|0)!=(g|0)){break a}}b=d-c>>2;if((b|0)>0){if((Fc(a,c,b)|0)!=(b|0)){break a}}Wh(e);j=a}la=h+16|0;return j}function Qm(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=la+-64|0;la=d;e=1;a:{if(Pm(a,b,0)){break a}e=0;if(!b){break a}b=Rm(b,16124);e=0;if(!b){break a}kb(d+12|0,0,52);J[d+56>>2]=1;J[d+20>>2]=-1;J[d+16>>2]=a;J[d+8>>2]=b;na[J[J[b>>2]+28>>2]](b,d+8|0,J[c>>2],1);a=J[d+32>>2];if((a|0)==1){J[c>>2]=J[d+24>>2]}e=(a|0)==1}a=e;la=d- -64|0;return a|0}function nd(a,b){a=a|0;b=b|0;if(M[a+24>>2]>M[a+44>>2]){J[a+44>>2]=J[a+24>>2]}a:{if(M[a+8>>2]>=M[a+12>>2]){break a}if(qc(b,-1)){$c(a,J[a+8>>2],J[a+12>>2]-1|0,J[a+44>>2]);return od(b)|0}if(!(K[a+48|0]&16)){if(!qc(b<<24>>24,H[J[a+12>>2]-1|0])){break a}}$c(a,J[a+8>>2],J[a+12>>2]-1|0,J[a+44>>2]);H[J[a+12>>2]]=b<<24>>24;return b|0}return-1}function hl(a){a=a|0;if(K[21468]){return J[5366]}if(!K[21976]){H[21976]=1}jl(21808,14772);jl(21820,14800);jl(21832,14828);jl(21844,14860);jl(21856,14900);jl(21868,14936);jl(21880,14964);jl(21892,15e3);jl(21904,15016);jl(21916,15032);jl(21928,15048);jl(21940,15064);jl(21952,15080);jl(21964,15096);H[21468]=1;J[5366]=21808;return 21808}function We(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;b=la-16|0;la=b;f=b+16|0;a:{while(1){c=J[a+36>>2];d=b+8|0;g=na[J[J[c>>2]+20>>2]](c,J[a+40>>2],d,f,b+4|0)|0;c=-1;e=J[b+4>>2]-d|0;if((e|0)!=(Jb(d,1,e,J[a+32>>2])|0)){break a}b:{switch(g-1|0){case 1:break a;case 0:continue;default:break b}}break}c=Fb(J[a+32>>2])?-1:0}la=b+16|0;return c|0}function Lh(a,b,c,d,e,f){var g=0,h=0,i=0,j=0;h=la-16|0;la=h;a:{if(!a){break a}g=J[e+12>>2];i=c-b|0;if((i|0)>0){if((Fc(a,b,i)|0)!=(i|0)){break a}}b=d-b|0;b=(b|0)<(g|0)?g-b|0:0;if((b|0)>0){f=Vh(h+4|0,b,f);g=Fc(a,dd(f),b);tm(f);if((b|0)!=(g|0)){break a}}b=d-c|0;if((b|0)>0){if((Fc(a,c,b)|0)!=(b|0)){break a}}Wh(e);j=a}la=h+16|0;return j}function Dc(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;c=la-16|0;la=c;d=c+8|0;wc(d,a);a:{if(!K[d|0]){break a}d=c+4|0;le(d,J[J[a>>2]-12>>2]+a|0);e=yc(d);ak(d);g=zc(c,a);f=J[J[a>>2]-12>>2]+a|0;h=Ac(f);i=c,j=na[J[J[e>>2]+24>>2]](e,J[g>>2],f,h,b)|0,J[i+4>>2]=j;if(!Bc(d)){break a}mc(J[J[a>>2]-12>>2]+a|0,5)}xc(c+8|0);la=c+16|0;return a}function Cc(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;c=la-16|0;la=c;d=c+8|0;wc(d,a);a:{if(!K[d|0]){break a}d=c+4|0;le(d,J[J[a>>2]-12>>2]+a|0);e=yc(d);ak(d);g=zc(c,a);f=J[J[a>>2]-12>>2]+a|0;h=Ac(f);i=c,j=na[J[J[e>>2]+16>>2]](e,J[g>>2],f,h,b)|0,J[i+4>>2]=j;if(!Bc(d)){break a}mc(J[J[a>>2]-12>>2]+a|0,5)}xc(c+8|0);la=c+16|0;return a}function Hm(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0,j=0;g=la-16|0;la=g;e=nb(b);f=jd(c);h=la-16|0;la=h;a:{d=e+f|0;if(d>>>0<=2147483631){b:{if(Yd(d)){J[a>>2]=0;J[a+4>>2]=0;J[a+8>>2]=0;Sd(a,d);break b}i=Zd(d)+1|0;j=de(i);ae(a,i);$d(a,j);be(a,d)}la=h+16|0;break a}ce();B()}a=dd(a);Wb(a,b,e);a=a+e|0;Wb(a,dd(c),f);um(a+f|0,1,0);la=g+16|0}function Nc(a){var b=0,c=0,d=0;b=la-16|0;la=b;if(J[(J[J[a>>2]-12>>2]+a|0)+24>>2]){c=b+8|0;J[c+4>>2]=a;H[c|0]=0;if(fc(J[J[a>>2]-12>>2]+a|0)){d=J[(J[J[a>>2]-12>>2]+a|0)+72>>2];if(d){Nc(d)}H[c|0]=1}a:{if(!K[b+8|0]){break a}if((nc(J[(J[J[a>>2]-12>>2]+a|0)+24>>2])|0)!=-1){break a}mc(J[J[a>>2]-12>>2]+a|0,1)}xc(b+8|0)}la=b+16|0}function fl(a){a=a|0;if(K[21460]){return J[5364]}if(!K[21800]){H[21800]=1}el(21632,1119);el(21644,1126);el(21656,1092);el(21668,1100);el(21680,1083);el(21692,1133);el(21704,1110);el(21716,1339);el(21728,1377);el(21740,1499);el(21752,1594);el(21764,1186);el(21776,1421);el(21788,1246);H[21460]=1;J[5364]=21632;return 21632}function cn(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;if(Pm(a,J[b+8>>2],e)){Zm(b,c,d);return}a:{if(!Pm(a,J[b>>2],e)){break a}if(!(J[b+16>>2]!=(c|0)&J[b+20>>2]!=(c|0))){if((d|0)!=1){break a}J[b+32>>2]=1;return}J[b+20>>2]=c;J[b+32>>2]=d;J[b+40>>2]=J[b+40>>2]+1;if(!(J[b+36>>2]!=1|J[b+24>>2]!=2)){H[b+54|0]=1}J[b+44>>2]=4}}function uf(a){var b=0;b=1;a:{if((a|0)>=1024){b=898846567431158e293;if(a>>>0<2047){a=a-1023|0;break a}b=Infinity;a=((a|0)>=3069?3069:a)-2046|0;break a}if((a|0)>-1023){break a}b=2004168360008973e-307;if(a>>>0>4294965304){a=a+969|0;break a}b=0;a=((a|0)<=-2960?-2960:a)+1938|0}x(0,0);x(1,a+1023<<20);return b*+z()}function Hk(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0;g=la-16|0;la=g;J[e>>2]=c;b=g+12|0;a=Ek(b,0,J[a+8>>2]);f=2;a:{if(a+1>>>0<2){break a}c=a-1|0;f=1;if(c>>>0>d-J[e>>2]>>>0){break a}d=b;while(1){if(c){a=K[d|0];b=J[e>>2];J[e>>2]=b+1;H[b|0]=a;c=c-1|0;d=d+1|0;continue}break}f=0}b=f;la=g+16|0;return b|0}function Hg(a,b,c,d){var e=0,f=0;a:{if(!jd(a)|(c-b|0)<5){break a}ki(b,c);e=c-4|0;c=dd(a);f=c+jd(a)|0;b:{while(1){c:{a=H[c|0];if(b>>>0>=e>>>0){break c}if(!((a|0)<=0|(a|0)>=127)&J[b>>2]!=H[c|0]){break b}b=b+4|0;c=((f-c|0)>1)+c|0;continue}break}if((a|0)<=0|(a|0)>=127|H[c|0]>>>0>J[e>>2]-1>>>0){break a}}J[d>>2]=4}}function Gj(a,b,c){var d=0,e=0,f=0,g=0,h=0;e=la-16|0;la=e;d=la-32|0;la=d;Ul(d+24|0,a,b);Pd(d+16|0,J[d+24>>2],J[d+28>>2],c);f=J[d+16>>2];b=la-16|0;la=b;J[b+12>>2]=a;a=b+12|0;a=wj(a,f-Tl(a)>>2);la=b+16|0;J[d+12>>2]=a;g=d,h=Ld(c,J[d+20>>2]),J[g+8>>2]=h;Md(e+8|0,d+12|0,d+8|0);la=d+32|0;la=e+16|0;return J[e+12>>2]}function Bj(a,b,c){var d=0,e=0,f=0,g=0,h=0;e=la-16|0;la=e;d=la-32|0;la=d;Ul(d+24|0,a,b);Jd(d+16|0,J[d+24>>2],J[d+28>>2],c);f=J[d+16>>2];b=la-16|0;la=b;J[b+12>>2]=a;a=b+12|0;a=ij(a,f-Tl(a)|0);la=b+16|0;J[d+12>>2]=a;g=d,h=Ld(c,J[d+20>>2]),J[g+8>>2]=h;Md(e+8|0,d+12|0,d+8|0);la=d+32|0;la=e+16|0;return J[e+12>>2]}function te(a){var b=0,c=0;b=J[a+76>>2];a:{if(!((b|0)>=0&(!b|J[4990]!=(b&-1073741825)))){b=J[a+4>>2];if((b|0)!=J[a+8>>2]){J[a+4>>2]=b+1;a=K[b|0];break a}a=se(a);break a}b=a+76|0;c=J[b>>2];J[b>>2]=c?c:1073741823;c=J[a+4>>2];b:{if((c|0)!=J[a+8>>2]){J[a+4>>2]=c+1;a=K[c|0];break b}a=se(a)}J[b>>2]=0}return a}function xc(a){var b=0;a:{b=J[a+4>>2];if(!J[(J[J[b>>2]-12>>2]+b|0)+24>>2]){break a}b=J[a+4>>2];if(!fc(J[J[b>>2]-12>>2]+b|0)){break a}b=J[a+4>>2];if(!(J[(J[J[b>>2]-12>>2]+b|0)+4>>2]&8192)){break a}b=J[a+4>>2];if((nc(J[(J[J[b>>2]-12>>2]+b|0)+24>>2])|0)!=-1){break a}a=J[a+4>>2];mc(J[J[a>>2]-12>>2]+a|0,1)}}function Hh(a,b,c,d){var e=0;a:{if(!(d&2048)){break a}e=d&74;if(!c|((e|0)==8|(e|0)==64)){break a}H[a|0]=43;a=a+1|0}if(d&512){H[a|0]=35;a=a+1|0}while(1){e=K[b|0];if(e){H[a|0]=e;a=a+1|0;b=b+1|0;continue}break}e=d&74;b=111;b:{if((e|0)==64){break b}b=d&16384?88:120;if((e|0)==8){break b}b=c?100:117}H[a|0]=b}function Gm(a,b){var c=0,d=0,e=0;c=la-16|0;la=c;J[c+12>>2]=b;e=id(a);a:{if(!e){b=1;d=sd(a);break a}b=rd(a)-1|0;d=J[a+4>>2]}b:{c:{if((b|0)==(d|0)){sj(a,b,1,b,b);dd(a);break c}dd(a);if(e){break c}b=a;Sd(a,d+1|0);break b}b=J[a>>2];be(a,d+1|0)}a=(d<<2)+b|0;pj(a,c+12|0);J[c+8>>2]=0;pj(a+4|0,c+8|0);la=c+16|0}function ng(a,b,c){var d=0,e=0,f=0;a:{f=rj(b,c);d=la-16|0;la=d;if(f>>>0<=1073741807){b:{if(Kl(f)){Sd(a,f);e=a;break b}Ml(d+8|0,Ll(f)+1|0);e=J[d+8>>2];$d(a,e);ae(a,J[d+12>>2]);be(a,f)}while(1){if((b|0)!=(c|0)){pj(e,b);e=e+4|0;b=b+4|0;continue}break}J[d+4>>2]=0;pj(e,d+4|0);la=d+16|0;break a}ce();B()}}function Cm(a,b){var c=0,d=0,e=0;c=la-16|0;la=c;H[c+15|0]=b;e=id(a);a:{if(!e){b=10;d=sd(a);break a}b=rd(a)-1|0;d=J[a+4>>2]}b:{c:{if((b|0)==(d|0)){bj(a,b,1,b,b);dd(a);break c}dd(a);if(e){break c}b=a;Sd(a,d+1|0);break b}b=J[a>>2];be(a,d+1|0)}a=b+d|0;Td(a,c+15|0);H[c+14|0]=0;Td(a+1|0,c+14|0);la=c+16|0}function hd(a,b,c){var d=0,e=0,f=0;a:{f=Wd(b,c);d=la-16|0;la=d;if(f>>>0<=2147483631){b:{if(Yd(f)){Sd(a,f);e=a;break b}_d(d+8|0,Zd(f)+1|0);e=J[d+8>>2];$d(a,e);ae(a,J[d+12>>2]);be(a,f)}while(1){if((b|0)!=(c|0)){Td(e,b);e=e+1|0;b=b+1|0;continue}break}H[d+7|0]=0;Td(e,d+7|0);la=d+16|0;break a}ce();B()}}function Rh(a,b,c,d){var e=0,f=0,g=0,h=0;e=la-16|0;la=e;J[e+12>>2]=b;J[e+8>>2]=d;g=bh(e+4|0,e+12|0);b=la-16|0;la=b;d=J[e+8>>2];J[b+12>>2]=d;J[b+8>>2]=d;f=-1;d=Yf(0,0,c,d);a:{if((d|0)<0){break a}h=a;d=d+1|0;a=sb(d);J[h>>2]=a;if(!a){break a}f=Yf(a,d,c,J[b+12>>2])}la=b+16|0;ch(g);la=e+16|0;return f}function nb(a){var b=0,c=0,d=0;a:{b:{b=a;if(!(b&3)){break b}if(!K[b|0]){return 0}while(1){b=b+1|0;if(!(b&3)){break b}if(K[b|0]){continue}break}break a}while(1){c=b;b=b+4|0;d=J[c>>2];if(!((d^-1)&d-16843009&-2139062144)){continue}break}while(1){b=c;c=b+1|0;if(K[b|0]){continue}break}}return b-a|0}function lb(a,b,c){var d=0,e=0;a:{b:{if(c>>>0>=4){if((a|b)&3){break b}while(1){if(J[a>>2]!=J[b>>2]){break b}b=b+4|0;a=a+4|0;c=c-4|0;if(c>>>0>3){continue}break}}if(!c){break a}}while(1){d=K[a|0];e=K[b|0];if((d|0)==(e|0)){b=b+1|0;a=a+1|0;c=c-1|0;if(c){continue}break a}break}return d-e|0}return 0}function zm(a,b){var c=0,d=0,e=0,f=0;d=nb(b);f=la-16|0;la=f;e=jd(a);c=kd(a);a:{if(d>>>0<=c-e>>>0){if(!d){break a}c=dd(a);if(e){rm(c+d|0,c,e);b=(b>>>0>=c>>>0?c+e>>>0>b>>>0?d:0:0)+b|0}rm(c,b,d);b=d+e|0;cj(a,b);H[f+15|0]=0;Td(b+c|0,f+15|0);break a}sm(a,c,(d+e|0)-c|0,e,0,0,d,b)}la=f+16|0;return a}function nf(a,b){var c=0,d=0,e=0,f=0;d=la-16|0;la=d;a:{if(!b){b=0;break a}c=b>>31;e=(c^b)-c|0;c=S(e);mf(d,e,0,0,0,c+81|0);e=0+J[d+8>>2]|0;c=(J[d+12>>2]^65536)+(16414-c<<16)|0;c=e>>>0<f>>>0?c+1|0:c;f=b&-2147483648|c;c=J[d+4>>2];b=J[d>>2]}J[a>>2]=b;J[a+4>>2]=c;J[a+8>>2]=e;J[a+12>>2]=f;la=d+16|0}function hi(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;a=la-208|0;la=a;h=_g();J[a>>2]=e;f=a+176|0;i=Ih(f,20,h,1336,a);e=i+f|0;h=Jh(f,e,c);g=a+16|0;le(g,c);j=Oc(g);ak(g);vh(j,f,e,g);f=b;b=(i<<2)+g|0;b=ai(f,g,(e|0)==(h|0)?b:((h-a<<2)+a|0)-688|0,b,c,d);la=a+208|0;return b|0}function Xj(a){a=a|0;var b=0,c=0,d=0;J[a>>2]=9100;b=a+8|0;while(1){if(Pj(b)>>>0>c>>>0){if(J[Uj(b,c)>>2]){Wj(J[Uj(b,c)>>2])}c=c+1|0;continue}break}tm(a+152|0);c=la-16|0;la=c;b=Nj(c+12|0,b);d=J[b>>2];if(J[d>>2]){Qj(d);cm(J[b>>2]);d=Xl(J[b>>2]);b=J[b>>2];dm(d,J[b>>2],$l(b))}la=c+16|0;return a|0}function fg(a,b,c,d){var e=0,f=0,g=0,h=0;e=la-160|0;la=e;J[e+60>>2]=b;J[e+20>>2]=b;J[e+24>>2]=-1;f=e+16|0;jf(f,0,0);Cf(e,f,d,1);d=J[e+8>>2];f=J[e+12>>2];g=J[e>>2];h=J[e+4>>2];if(c){J[c>>2]=J[e+136>>2]+((J[e+20>>2]-J[e+60>>2]|0)+b|0)}J[a+8>>2]=d;J[a+12>>2]=f;J[a>>2]=g;J[a+4>>2]=h;la=e+160|0}function Uh(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0;a=la-96|0;la=a;h=_g();J[a>>2]=e;f=a- -64|0;i=Ih(f,20,h,1336,a);e=i+f|0;h=Jh(f,e,c);g=a+16|0;le(g,c);j=hc(g);ak(g);Zg(j,f,e,g);f=b;b=g+i|0;b=Lh(f,g,(e|0)==(h|0)?b:((h-a|0)+a|0)-48|0,b,c,d);la=a+96|0;return b|0}function bl(a,b){var c=0,d=0,e=0,f=0;f=la-16|0;la=f;c=jm(b);d=la-16|0;la=d;a:{if(c>>>0<=1073741807){b:{if(Kl(c)){Sd(a,c);e=a;break b}Ml(d+8|0,Ll(c)+1|0);e=J[d+8>>2];$d(a,e);ae(a,J[d+12>>2]);be(a,c)}Kc(e,b,c);J[d+4>>2]=0;pj((c<<2)+e|0,d+4|0);la=d+16|0;break a}ce();B()}la=f+16|0}function ke(a,b){var c=0,d=0,e=0,f=0;f=la-16|0;la=f;c=nb(b);d=la-16|0;la=d;a:{if(c>>>0<=2147483631){b:{if(Yd(c)){Sd(a,c);e=a;break b}_d(d+8|0,Zd(c)+1|0);e=J[d+8>>2];$d(a,e);ae(a,J[d+12>>2]);be(a,c)}Wb(e,b,c);H[d+7|0]=0;Td(c+e|0,d+7|0);la=d+16|0;break a}ce();B()}la=f+16|0}function hg(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0;h=(e-d|0)+b|0;a:{while(1){if((d|0)!=(e|0)){a=-1;if((b|0)==(c|0)){break a}f=H[b|0];g=H[d|0];if((f|0)<(g|0)){break a}if((f|0)>(g|0)){return 1}else{d=d+1|0;b=b+1|0;continue}}break}a=(c|0)!=(h|0)}return a|0}function Vh(a,b,c){var d=0,e=0,f=0;f=la-16|0;la=f;d=la-16|0;la=d;a:{if(b>>>0<=2147483631){b:{if(Yd(b)){Sd(a,b);e=a;break b}_d(d+8|0,Zd(b)+1|0);e=J[d+8>>2];$d(a,e);ae(a,J[d+12>>2]);be(a,b)}um(e,b,c);H[d+7|0]=0;Td(b+e|0,d+7|0);la=d+16|0;break a}ce();B()}la=f+16|0;return a}function Xe(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;a:{if(!K[a+44|0]){c=(c|0)>0?c:0;while(1){if((c|0)==(d|0)){break a}if(((f=a,g=_b(H[b|0]),e=J[J[a>>2]+52>>2],na[e](f|0,g|0)|0)|0)==-1){return d|0}else{b=b+1|0;d=d+1|0;continue}}}c=Jb(b,1,c,J[a+32>>2])}return c|0}function wf(a,b){var c=0,d=0,e=0,f=0;c=la-16|0;la=c;a:{if(!b){b=0;break a}d=b;b=S(b);mf(c,d,0,0,0,112-(b^31)|0);d=0+J[c+8>>2]|0;b=(J[c+12>>2]^65536)+(16414-b<<16)|0;f=e>>>0>d>>>0?b+1|0:b;e=J[c+4>>2];b=J[c>>2]}J[a>>2]=b;J[a+4>>2]=e;J[a+8>>2]=d;J[a+12>>2]=f;la=c+16|0}function re(a,b){var c=0,d=0,e=0;d=-1;a:{if((a|0)==-1){break a}e=J[b+76>>2]<0;b:{c=J[b+4>>2];c:{if(!c){Gb(b);c=J[b+4>>2];if(!c){break c}}if(J[b+44>>2]-8>>>0<c>>>0){break b}}if(e){break a}return-1}c=c-1|0;J[b+4>>2]=c;H[c|0]=a;J[b>>2]=J[b>>2]&-17;d=a&255}return d}function Xm(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;if(Pm(a,J[b+8>>2],0)){Sm(b,c,d);return}e=J[a+12>>2];f=a+16|0;Vm(f,b,c,d);a:{if((e|0)<2){break a}e=(e<<3)+f|0;a=a+24|0;while(1){Vm(a,b,c,d);if(K[b+54|0]){break a}a=a+8|0;if(e>>>0>a>>>0){continue}break}}}function lg(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0;a:{while(1){if((d|0)!=(e|0)){a=-1;if((b|0)==(c|0)){break a}f=J[b>>2];g=J[d>>2];if((f|0)<(g|0)){break a}if((f|0)>(g|0)){return 1}else{d=d+4|0;b=b+4|0;continue}}break}a=(b|0)!=(c|0)}return a|0}function Uf(a,b,c){var d=0,e=0,f=0,g=0;if(b){while(1){c=c-1|0;e=a;a=xn(a,b,10);d=ma;f=c,g=e-wn(a,d,10,0)|48,H[f|0]=g;e=b>>>0>9;b=d;if(e){continue}break}}if(a){while(1){c=c-1|0;b=(a>>>0)/10|0;H[c|0]=a-P(b,10)|48;d=a>>>0>9;a=b;if(d){continue}break}}return c}function ld(a,b){var c=0,d=0,e=0,f=0;a:{c=jd(a);if(c>>>0<b>>>0){e=la-16|0;la=e;c=b-c|0;if(c){d=kd(a);b=jd(a);if(c>>>0>d-b>>>0){bj(a,d,b+(c-d|0)|0,b,b)}d=dd(a);um(d+b|0,c,0);f=a;a=b+c|0;cj(f,a);H[e+15|0]=0;Td(a+d|0,e+15|0)}la=e+16|0;break a}Ol(a,dd(a),b)}}function Xb(a,b,c){var d=0,e=0,f=0,g=0;e=la-16|0;la=e;d=la-32|0;la=d;Id(d+24|0,a,a+b|0);Jd(d+16|0,J[d+24>>2],J[d+28>>2],c);f=d,g=Kd(a,J[d+16>>2]),J[f+12>>2]=g;f=d,g=Ld(c,J[d+20>>2]),J[f+8>>2]=g;Md(e+8|0,d+12|0,d+8|0);la=d+32|0;la=e+16|0;return J[e+12>>2]}function Gb(a){var b=0,c=0;b=J[a+72>>2];J[a+72>>2]=b-1|b;if(J[a+20>>2]!=J[a+28>>2]){na[J[a+36>>2]](a,0,0)|0}J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;b=J[a>>2];if(b&4){J[a>>2]=b|32;return-1}c=J[a+44>>2]+J[a+48>>2]|0;J[a+8>>2]=c;J[a+4>>2]=c;return b<<27>>31}function jf(a,b,c){var d=0,e=0,f=0,g=0;J[a+112>>2]=b;J[a+116>>2]=c;e=J[a+4>>2];d=J[a+44>>2]-e|0;J[a+120>>2]=d;J[a+124>>2]=d>>31;d=J[a+8>>2];a:{if(!(b|c)){break a}f=d-e|0;g=f>>31;if((c|0)>=(g|0)&b>>>0>=f>>>0|(c|0)>(g|0)){break a}d=b+e|0}J[a+104>>2]=d}function Oj(a,b){var c=0,d=0,e=0;e=la-16|0;la=e;c=e+4|0;J[c>>2]=a;d=J[a+4>>2];J[c+4>>2]=d;J[c+8>>2]=d+(b<<2);b=J[c+4>>2];d=J[c+8>>2];while(1){if((b|0)==(d|0)){J[J[c>>2]+4>>2]=J[c+4>>2];la=e+16|0}else{Xl(a);am(b);b=b+4|0;J[c+4>>2]=b;continue}break}}function Pf(a,b){var c=0,d=0,e=0;A(+a);d=v(1)|0;e=v(0)|0;c=d>>>20&2047;if((c|0)!=2047){if(!c){if(a==0){c=0}else{a=Pf(a*0x10000000000000000,b);c=J[b>>2]+-64|0}J[b>>2]=c;return a}J[b>>2]=c-1022;x(0,e|0);x(1,d&-2146435073|1071644672);a=+z()}return a}function Ai(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=la-32|0;la=g;J[g+24>>2]=37;J[g+28>>2]=83;J[g+16>>2]=77;J[g+20>>2]=58;J[g+8>>2]=58;J[g+12>>2]=37;J[g>>2]=37;J[g+4>>2]=72;h=b;b=g+32|0;a=yi(a,h,c,d,e,f,g,b);la=b;return a|0}function oi(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=la-16|0;la=g;H[g+8|0]=37;H[g+9|0]=72;H[g+10|0]=58;H[g+11|0]=37;H[g+12|0]=77;H[g+13|0]=58;H[g+14|0]=37;H[g+15|0]=83;h=b;b=g+16|0;a=li(a,h,c,d,e,f,g+8|0,b);la=b;return a|0}function Kc(a,b,c){var d=0,e=0,f=0,g=0;e=la-16|0;la=e;d=la-32|0;la=d;Id(d+24|0,b,(c<<2)+b|0);Pd(d+16|0,J[d+24>>2],J[d+28>>2],a);f=d,g=Kd(b,J[d+16>>2]),J[f+12>>2]=g;f=d,g=Ld(a,J[d+20>>2]),J[f+8>>2]=g;Md(e+8|0,d+12|0,d+8|0);la=d+32|0;la=e+16|0}function fd(a,b){var c=0,d=0;c=la-16|0;la=c;d=J[b+48>>2];a:{if(d&16){if(M[b+24>>2]>M[b+44>>2]){J[b+44>>2]=J[b+24>>2]}gd(a,J[b+20>>2],J[b+44>>2]);break a}if(d&8){gd(a,J[b+8>>2],J[b+16>>2]);break a}b=la-16|0;la=b;Xc(a);la=b+16|0}la=c+16|0}function md(a){a=a|0;if(M[a+24>>2]>M[a+44>>2]){J[a+44>>2]=J[a+24>>2]}a:{if(!(K[a+48|0]&8)){break a}if(M[a+16>>2]<M[a+44>>2]){$c(a,J[a+8>>2],J[a+12>>2],J[a+44>>2])}if(M[a+12>>2]>=M[a+16>>2]){break a}return _b(H[J[a+12>>2]])|0}return-1}function ne(a){a=a|0;var b=0,c=0;J[a>>2]=4256;b=J[a+40>>2];while(1){if(b){b=b-1|0;c=b<<2;na[J[J[a+32>>2]+c>>2]](0,a,J[c+J[a+36>>2]>>2]);continue}break}ak(a+28|0);tb(J[a+32>>2]);tb(J[a+36>>2]);tb(J[a+48>>2]);tb(J[a+60>>2]);return a|0}function Jh(a,b,c){c=J[c+4>>2]&176;if((c|0)==32){return b}a:{if((c|0)!=16){break a}b:{c:{c=K[a|0];switch(c-43|0){case 0:case 2:break c;default:break b}}return a+1|0}if((c|0)!=48|(b-a|0)<2|(K[a+1|0]|32)!=120){break a}a=a+2|0}return a}function ff(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;a:{if(!K[a+44|0]){c=(c|0)>0?c:0;while(1){if((c|0)==(d|0)){break a}if((na[J[J[a>>2]+52>>2]](a,J[b>>2])|0)==-1){return d|0}else{b=b+4|0;d=d+1|0;continue}}}c=Jb(b,4,c,J[a+32>>2])}return c|0}function xm(a,b,c){var d=0,e=0,f=0;f=la-16|0;la=f;d=kd(a);e=jd(a);a:{if(d-e>>>0>=c>>>0){if(!c){break a}d=dd(a);Wb(d+e|0,b,c);b=c+e|0;cj(a,b);H[f+15|0]=0;Td(b+d|0,f+15|0);break a}sm(a,d,(c-d|0)+e|0,e,e,0,c,b)}la=f+16|0;return a}function Aa(a,b){var c=0,d=0,e=0;c=nb(b);if(c>>>0<2147483632){a:{b:{if(c>>>0>=11){e=(c|15)+1|0;d=om(e);J[a+8>>2]=e|-2147483648;J[a>>2]=d;J[a+4>>2]=c;break b}H[a+11|0]=c;d=a;if(!c){break a}}jb(d,b,c)}H[c+d|0]=0;return}Ba();B()}function ki(a,b){var c=0;c=la-16|0;la=c;J[c+12>>2]=a;a:{if((a|0)==(b|0)){break a}while(1){b=b-4|0;J[c+8>>2]=b;if(a>>>0>=b>>>0){break a}ed(J[c+12>>2],J[c+8>>2]);a=J[c+12>>2]+4|0;J[c+12>>2]=a;b=J[c+8>>2];continue}}la=c+16|0}function ji(a,b){var c=0;c=la-16|0;la=c;J[c+12>>2]=a;a:{if((a|0)==(b|0)){break a}while(1){b=b-1|0;J[c+8>>2]=b;if(a>>>0>=b>>>0){break a}Mi(J[c+12>>2],J[c+8>>2]);a=J[c+12>>2]+1|0;J[c+12>>2]=a;b=J[c+8>>2];continue}}la=c+16|0}function db(){var a=0,b=0,c=0;b=la-16|0;la=b;a=J[4312];if(a){Oa(b+4|0,a);if(H[17263]<0){tb(J[4313])}J[4315]=J[b+12>>2];c=J[b+8>>2];a=J[b+4>>2];J[4313]=a;J[4314]=c;a=H[17263]>=0?17252:a}else{a=1044}la=b+16|0;return a|0}function Sf(a){var b=0,c=0,d=0;if(!lf(H[J[a>>2]])){return 0}while(1){d=J[a>>2];c=-1;if(b>>>0<=214748364){c=H[d|0]-48|0;b=P(b,10);c=(c|0)>(b^2147483647)?-1:c+b|0}J[a>>2]=d+1;b=c;if(lf(H[d+1|0])){continue}break}return b}function Ma(a,b){var c=0,d=0,e=0;d=nb(b);c=K[a+11|0];a:{e=c;c=c<<24>>24<0;if(((c?J[a+4>>2]:e)|0)==(d|0)){if((d|0)==-1){break a}a=!lb(c?J[a>>2]:a,b,d)}else{a=0}return a}a=qm(Om(8),1467);J[a>>2]=16716;Z(a|0,16748,1);B()}function wn(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0;e=c>>>16|0;f=a>>>16|0;j=P(e,f);g=c&65535;h=a&65535;i=P(g,h);f=(i>>>16|0)+P(f,g)|0;e=(f&65535)+P(e,h)|0;ma=(P(b,c)+j|0)+P(a,d)+(f>>>16)+(e>>>16)|0;return i&65535|e<<16}function vm(a,b,c){var d=0,e=0;d=la-16|0;la=d;a:{b:{if(Yd(c)){e=a;Sd(a,c);break b}if(c>>>0>2147483631){break a}_d(d+8|0,Zd(c)+1|0);e=J[d+8>>2];$d(a,e);ae(a,J[d+12>>2]);be(a,c)}Wb(e,b,c+1|0);la=d+16|0;return}ce();B()}function gc(a){var b=0;b=la-16|0;la=b;if(J[(J[J[a>>2]-12>>2]+a|0)+24>>2]){wc(b+8|0,a);a:{if(!K[b+8|0]){break a}if((nc(J[(J[J[a>>2]-12>>2]+a|0)+24>>2])|0)!=-1){break a}mc(J[J[a>>2]-12>>2]+a|0,1)}xc(b+8|0)}la=b+16|0}function Sm(a,b,c){var d=0;d=J[a+16>>2];if(!d){J[a+36>>2]=1;J[a+24>>2]=c;J[a+16>>2]=b;return}a:{if((b|0)==(d|0)){if(J[a+24>>2]!=2){break a}J[a+24>>2]=c;return}H[a+54|0]=1;J[a+24>>2]=2;J[a+36>>2]=J[a+36>>2]+1}}function Li(a,b,c,d,e,f){var g=0,h=0,i=0;g=la-16|0;la=g;H[g+15|0]=0;H[g+14|0]=f;H[g+13|0]=e;H[g+12|0]=37;if(f){Mi(g+13|0,g+14|0)}h=c,i=(ja(b|0,Xd(b,J[c>>2])|0,g+12|0,d|0,J[a>>2])|0)+b|0,J[h>>2]=i;la=g+16|0}function Vf(a,b,c,d,e){var f=0;f=la-256|0;la=f;if(!(e&73728|(c|0)<=(d|0))){d=c-d|0;c=d>>>0<256;kb(f,b&255,c?d:256);if(!c){while(1){Rf(a,f,256);d=d-256|0;if(d>>>0>255){continue}break}}Rf(a,f,d)}la=f+256|0}
function Am(a,b,c){var d=0,e=0,f=0;e=la-16|0;la=e;d=rd(a);a:{if(d>>>0>c>>>0){d=J[a>>2];be(a,c);Wb(d,b,c);H[e+15|0]=0;Td(c+d|0,e+15|0);break a}f=a;a=J[a+4>>2];sm(f,d-1|0,(c-d|0)+1|0,a,0,a,c,b)}la=e+16|0}function jl(a,b){var c=0,d=0,e=0;a:{c=jm(b);d=qj(a);if(c>>>0<=d>>>0){d=dd(a);Qd(d,b,c);b=la-16|0;la=b;cj(a,c);J[b+12>>2]=0;pj(d+(c<<2)|0,b+12|0);la=b+16|0;break a}e=a;a=jd(a);Em(e,d,c-d|0,a,0,a,c,b)}}function wh(a,b,c){var d=0,e=0,f=0;d=la-16|0;la=d;e=J[c>>2];f=a;c=b-a>>2;a:{if(c){while(1){if(J[a>>2]==(e|0)){break a}a=a+4|0;c=c-1|0;if(c){continue}break}}a=0}a=Ld(f,a?a:b);la=d+16|0;return a}function Vc(a,b){var c=0,d=0;a:{c=J[a>>2];if(!c){break a}d=J[c+24>>2];b:{if((d|0)==J[c+28>>2]){b=na[J[J[c>>2]+52>>2]](c,b)|0;break b}J[c+24>>2]=d+4;J[d>>2]=b}if(!qc(b,-1)){break a}J[a>>2]=0}}function Ik(a){a=a|0;var b=0,c=0,d=0;b=la-16|0;la=b;J[b+12>>2]=J[a+8>>2];c=bh(b+8|0,b+12|0);d=ve(0,0,4);ch(c);la=b+16|0;if(d){a=-1}else{a=J[a+8>>2];if(!a){return 1}a=(Jk(a)|0)==1}return a|0}function Hb(a){var b=0;b=J[a+72>>2];J[a+72>>2]=b-1|b;b=J[a>>2];if(b&8){J[a>>2]=b|32;return-1}J[a+4>>2]=0;J[a+8>>2]=0;b=J[a+44>>2];J[a+28>>2]=b;J[a+20>>2]=b;J[a+16>>2]=b+J[a+48>>2];return 0}function Gf(a,b,c,d){a:{if(!a){break a}b:{switch(b+2|0){case 0:H[a|0]=c;return;case 1:I[a>>1]=c;return;case 2:case 3:J[a>>2]=c;return;case 5:break b;default:break a}}J[a>>2]=c;J[a+4>>2]=d}}function xf(a,b,c,d,e,f,g,h,i){var j=0;j=la-16|0;la=j;qf(j,b,c,d,e,f,g,h,i^-2147483648);d=J[j>>2];c=J[j+4>>2];b=J[j+12>>2];J[a+8>>2]=J[j+8>>2];J[a+12>>2]=b;J[a>>2]=d;J[a+4>>2]=c;la=j+16|0}function mb(a,b){var c=0,d=0;c=K[a|0];d=K[b|0];a:{if(!c|(c|0)!=(d|0)){break a}while(1){d=K[b+1|0];c=K[a+1|0];if(!c){break a}b=b+1|0;a=a+1|0;if((c|0)==(d|0)){continue}break}}return c-d|0}function Jf(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0;e=J[a+84>>2];d=c+256|0;f=Hf(e,0,d);d=f?f-e|0:d;c=c>>>0>d>>>0?d:c;ib(b,e,c);b=e+d|0;J[a+84>>2]=b;J[a+8>>2]=b;J[a+4>>2]=c+e;return c|0}function si(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=la-16|0;la=g;J[g+12>>2]=b;h=g+8|0;le(h,d);b=hc(h);ak(h);ti(a,f+16|0,g+12|0,c,e,b);la=g+16|0;return J[g+12>>2]}function qi(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=la-16|0;la=g;J[g+12>>2]=b;h=g+8|0;le(h,d);b=hc(h);ak(h);ri(a,f+24|0,g+12|0,c,e,b);la=g+16|0;return J[g+12>>2]}function Ei(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=la-16|0;la=g;J[g+12>>2]=b;h=g+8|0;le(h,d);b=Oc(h);ak(h);Fi(a,f+16|0,g+12|0,c,e,b);la=g+16|0;return J[g+12>>2]}function Ci(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;g=la-16|0;la=g;J[g+12>>2]=b;h=g+8|0;le(h,d);b=Oc(h);ak(h);Di(a,f+24|0,g+12|0,c,e,b);la=g+16|0;return J[g+12>>2]}function uj(a,b){var c=0,d=0;c=la-16|0;la=c;if(id(a)){d=J[a>>2];rd(a);Pl(d)}J[a+8>>2]=J[b+8>>2];d=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=d;Sd(b,0);J[c+12>>2]=0;pj(b,c+12|0);la=c+16|0}function ui(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0;a=la-16|0;la=a;J[a+12>>2]=b;g=a+8|0;le(g,d);b=hc(g);ak(g);vi(f+20|0,a+12|0,c,e,b);la=a+16|0;return J[a+12>>2]}function Gi(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0;a=la-16|0;la=a;J[a+12>>2]=b;g=a+8|0;le(g,d);b=Oc(g);ak(g);Hi(f+20|0,a+12|0,c,e,b);la=a+16|0;return J[a+12>>2]}function Ee(a,b,c){var d=0,e=0,f=0,g=0;d=la-16|0;la=d;a=Ic(a);J[a+32>>2]=b;J[a>>2]=4932;e=d+12|0;cd(e,a);b=Ke(e);ak(e);J[a+40>>2]=c;J[a+36>>2]=b;f=a,g=vd(b),H[f+44|0]=g;la=d+16|0}function Be(a,b,c){var d=0,e=0,f=0,g=0;d=la-16|0;la=d;a=Ob(a);J[a+32>>2]=b;J[a>>2]=4728;e=d+12|0;cd(e,a);b=ud(e);ak(e);J[a+40>>2]=c;J[a+36>>2]=b;f=a,g=vd(b),H[f+44|0]=g;la=d+16|0}function ym(a,b){var c=0,d=0,e=0;e=dd(a);d=jd(a);a=la-16|0;la=a;H[a+15|0]=34;c=-1;if(b>>>0<d>>>0){d=d-b|0;if(d){c=Ql(b+e|0,H[a+15|0],d)}else{c=0}c=c?c-e|0:-1}la=a+16|0;return c}function fk(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;while(1){if((b|0)!=(c|0)){a=J[b>>2];if(a>>>0<=127){a=J[(a<<2)+9168>>2]}else{a=0}J[d>>2]=a;d=d+4|0;b=b+4|0;continue}break}return c|0}function _c(a,b){var c=0,d=0;c=la-16|0;la=c;if(id(a)){Rd(J[a>>2],rd(a))}J[a+8>>2]=J[b+8>>2];d=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=d;Sd(b,0);H[c+15|0]=0;Td(b,c+15|0);la=c+16|0}function Ac(a){var b=0,c=0,d=0;a:{if(!qc(-1,J[a+76>>2])){a=J[a+76>>2];break a}d=a;b=la-16|0;la=b;c=b+12|0;le(c,a);a=he(hc(c),32);ak(c);la=b+16|0;J[d+76>>2]=a}return a<<24>>24}function rb(a){var b=0,c=0;b=J[4196];c=a+7&-8;a=b+c|0;a:{if(a>>>0<=b>>>0?c:0){break a}if(a>>>0>oa()<<16>>>0){if(!(ba(a|0)|0)){break a}}J[4196]=a;return b}J[4322]=48;return-1}function qh(a,b,c,d,e){var f=0,g=0,h=0,i=0;g=la-16|0;la=g;f=g+12|0;le(f,b);vh(Oc(f),9056,9088,c);b=eh(f);h=d,i=xh(b),J[h>>2]=i;h=e,i=yh(b),J[h>>2]=i;zh(a,b);ak(f);la=g+16|0}function Rg(a,b,c,d,e){var f=0,g=0,h=0,i=0;g=la-16|0;la=g;f=g+12|0;le(f,b);Zg(hc(f),9056,9088,c);b=qg(f);h=d,i=xh(b),H[h|0]=i;h=e,i=yh(b),H[h|0]=i;zh(a,b);ak(f);la=g+16|0}function hk(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;a:{while(1){if((c|0)==(d|0)){break a}a=J[c>>2];if(!(a>>>0>127|!(J[(a<<2)+9168>>2]&b))){c=c+4|0;continue}break}d=c}return d|0}function gk(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;while(1){a:{if((c|0)!=(d|0)){a=J[c>>2];if(a>>>0>127|!(J[(a<<2)+9168>>2]&b)){break a}}else{c=d}return c|0}c=c+4|0;continue}}function Bm(a,b,c){var d=0,e=0;d=la-16|0;la=d;a:{if(c>>>0<=10){Sd(a,c);Wb(a,b,c);H[d+15|0]=0;Td(a+c|0,d+15|0);break a}e=a;a=sd(a);sm(e,10,c-10|0,a,0,a,c,b)}la=d+16|0}function xb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=la-16|0;la=e;a=wb(ka(J[a+60>>2],b|0,c|0,d&255,e+8|0)|0);la=e+16|0;ma=a?-1:J[e+12>>2];return(a?-1:J[e+8>>2])|0}function rc(a,b){var c=0,d=0,e=0,f=0;c=J[a+24>>2];if((c|0)==J[a+28>>2]){return e=a,f=_b(b),d=J[J[a>>2]+52>>2],na[d](e|0,f|0)|0}J[a+24>>2]=c+1;H[c|0]=b;return _b(b)}function qm(a,b){var c=0,d=0,e=0,f=0;d=pm(a);J[d>>2]=16616;a=nb(b);c=om(a+13|0);J[c+8>>2]=0;J[c+4>>2]=a;J[c>>2]=a;e=d+4|0,f=ib(c+12|0,b,a+1|0),J[e>>2]=f;return d}function lk(a,b,c){a=a|0;b=b|0;c=c|0;while(1){if((b|0)!=(c|0)){a=J[b>>2];if(a>>>0<=127){a=J[J[1876]+(J[b>>2]<<2)>>2]}J[b>>2]=a;b=b+4|0;continue}break}return c|0}function jk(a,b,c){a=a|0;b=b|0;c=c|0;while(1){if((b|0)!=(c|0)){a=J[b>>2];if(a>>>0<=127){a=J[J[1488]+(J[b>>2]<<2)>>2]}J[b>>2]=a;b=b+4|0;continue}break}return c|0}function Vi(a,b){var c=0,d=0;c=la-16|0;la=c;a:{if(!id(b)){J[a+8>>2]=J[b+8>>2];d=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=d;break a}vm(a,J[b>>2],J[b+4>>2])}la=c+16|0}function Vm(a,b,c,d){var e=0,f=0;f=J[a+4>>2];e=0;a:{if(!c){break a}e=f>>8;if(!(f&1)){break a}e=Wm(J[c>>2],e)}a=J[a>>2];na[J[J[a>>2]+28>>2]](a,b,c+e|0,f&2?d:2)}function og(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;a=0;while(1){if((b|0)!=(c|0)){a=J[b>>2]+(a<<4)|0;d=a&-268435456;a=(d|d>>>24)^a;b=b+4|0;continue}break}return a|0}function kg(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;a=0;while(1){if((b|0)!=(c|0)){a=H[b|0]+(a<<4)|0;d=a&-268435456;a=(d|d>>>24)^a;b=b+1|0;continue}break}return a|0}function Bi(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0;g=a;a=na[J[J[a+8>>2]+20>>2]](a+8|0)|0;return yi(g,b,c,d,e,f,dd(a),dd(a)+(jd(a)<<2)|0)|0}function vk(a,b,c){a=a|0;b=b|0;c=c|0;while(1){if((b|0)!=(c|0)){a=H[b|0];if((a|0)>=0){a=J[J[1876]+(H[b|0]<<2)>>2]}H[b|0]=a;b=b+1|0;continue}break}return c|0}function tk(a,b,c){a=a|0;b=b|0;c=c|0;while(1){if((b|0)!=(c|0)){a=H[b|0];if((a|0)>=0){a=J[J[1488]+(H[b|0]<<2)>>2]}H[b|0]=a;b=b+1|0;continue}break}return c|0}function pk(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;while(1){if((b|0)!=(c|0)){a=J[b>>2];H[e|0]=a>>>0<128?a:d;e=e+1|0;b=b+4|0;continue}break}return c|0}function pi(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0;g=a;a=na[J[J[a+8>>2]+20>>2]](a+8|0)|0;return li(g,b,c,d,e,f,dd(a),dd(a)+jd(a)|0)|0}function yk(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;while(1){if((b|0)!=(c|0)){a=H[b|0];H[e|0]=(a|0)<0?d:a;e=e+1|0;b=b+1|0;continue}break}return c|0}function un(a,b,c,d,e,f,g,h,i,j){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;j=j|0;var k=0;k=b;b=0;return na[a|0](k,c,d,e,f,b|g,h,b|i,j)|0}function en(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;if(Pm(a,J[b+8>>2],f)){Ym(b,c,d,e);return}a=J[a+8>>2];na[J[J[a>>2]+20>>2]](a,b,c,d,e,f)}function _e(a,b){a=a|0;b=b|0;var c=0,d=0;b=Ke(b);J[a+36>>2]=b;c=a,d=nc(b),J[c+44>>2]=d;c=a,d=vd(J[a+36>>2]),H[c+53|0]=d;if(J[a+44>>2]>=9){yd();B()}}function Ne(a,b){a=a|0;b=b|0;var c=0,d=0;b=ud(b);J[a+36>>2]=b;c=a,d=nc(b),J[c+44>>2]=d;c=a,d=vd(J[a+36>>2]),H[c+53|0]=d;if(J[a+44>>2]>=9){yd();B()}}function se(a){var b=0,c=0;b=la-16|0;la=b;c=-1;a:{if(Gb(a)){break a}if((na[J[a+32>>2]](a,b+15|0,1)|0)!=1){break a}c=K[b+15|0]}la=b+16|0;return c}function ql(a){a=a|0;if(K[21500]){return J[5374]}if(!K[22648]){H[22648]=1}jl(22624,15632);jl(22636,15644);H[21500]=1;J[5374]=22624;return 22624}function Jb(a,b,c,d){var e=0;e=P(b,c);a:{if(J[d+76>>2]<0){a=Ib(a,e,d);break a}a=Ib(a,e,d)}if((e|0)==(a|0)){return b?c:0}return(a>>>0)/(b>>>0)|0}function ol(a){a=a|0;if(K[21492]){return J[5372]}if(!K[22616]){H[22616]=1}el(22592,1688);el(22604,1685);H[21492]=1;J[5372]=22592;return 22592}function Rl(a,b,c){var d=0;d=la-16|0;la=d;J[d+8>>2]=b;J[d+12>>2]=a;J[d+4>>2]=c;b=0;a=d+4|0;if(!fe(a,d+12|0)){b=fe(a,d+8|0)}la=d+16|0;return b}function Bk(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;a=la-16|0;la=a;J[a+12>>2]=e;J[a+8>>2]=d-c;b=J[wd(a+12|0,a+8|0)>>2];la=a+16|0;return b|0}function ug(a,b){var c=0;c=J[a>>2];a=Sj(b);b=c+8|0;if(Pj(b)>>>0>a>>>0){b=J[Uj(b,a)>>2]!=0}else{b=0}if(!b){yd();B()}return J[Uj(c+8|0,a)>>2]}function tn(a,b,c,d,e,f,g,h,i){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;i=i|0;var j=0;j=b;b=0;return na[a|0](j,c,d,e,b|f,g,b|h,i)|0}function Ih(a,b,c,d,e){var f=0;f=la-16|0;la=f;J[f+12>>2]=c;J[f+8>>2]=e;c=bh(f+4|0,f+12|0);a=Yf(a,b,d,J[f+8>>2]);ch(c);la=f+16|0;return a}function Xf(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=b;b=J[b>>2]+7&-8;J[c>>2]=b+16;d=a,e=Ff(J[b>>2],J[b+4>>2],J[b+8>>2],J[b+12>>2]),O[d>>3]=e}function $m(a,b,c,d,e,f){var g=0,h=0;g=J[a+4>>2];h=g>>8;if(g&1){h=Wm(J[d>>2],h)}a=J[a>>2];na[J[J[a>>2]+20>>2]](a,b,c,d+h|0,g&2?e:2,f)}function $g(a,b,c){var d=0;d=la-16|0;la=d;J[d+12>>2]=b;J[d+8>>2]=c;b=bh(d+4|0,d+12|0);a=If(a,1336,J[d+8>>2]);ch(b);la=d+16|0;return a}function um(a,b,c){var d=0;d=la-16|0;la=d;H[d+15|0]=c;c=d+15|0;while(1){if(b){H[a|0]=K[c|0];b=b-1|0;a=a+1|0;continue}break}la=d+16|0}function Yl(a,b,c){var d=0;d=la-16|0;la=d;a:{if(!(K[b+120|0]|c>>>0>30)){H[b+120|0]=1;break a}b=Nl(c)}la=d+16|0;J[a+4>>2]=c;J[a>>2]=b}function wc(a,b){J[a+4>>2]=b;H[a|0]=0;if(fc(J[J[b>>2]-12>>2]+b|0)){b=J[(J[J[b>>2]-12>>2]+b|0)+72>>2];if(b){gc(b)}H[a|0]=1}return a}function om(a){var b=0;a=a>>>0<=1?1:a;a:{while(1){b=sb(a);if(b){break a}b=J[5806];if(b){na[b|0]();continue}break}ga();B()}return b}function Wl(a){var b=0;b=la-16|0;la=b;Xl(a);J[b+12>>2]=1073741823;J[b+8>>2]=2147483647;a=J[wd(b+12|0,b+8|0)>>2];la=b+16|0;return a}function an(a,b,c,d,e){var f=0,g=0;f=J[a+4>>2];g=f>>8;if(f&1){g=Wm(J[c>>2],g)}a=J[a>>2];na[J[J[a>>2]+24>>2]](a,b,c+g|0,f&2?d:2,e)}function dk(a){a=a|0;var b=0,c=0;b=J[J[a>>2]>>2];c=J[b+8>>2];a=J[b+4>>2];b=J[b>>2]+(c>>1)|0;if(c&1){a=J[a+J[b>>2]>>2]}na[a|0](b)}function Pd(a,b,c,d){var e=0,f=0;e=la-16|0;la=e;J[e+12>>2]=c;f=b;b=c-b|0;Qd(d,f,b>>2);J[e+8>>2]=b+d;Md(a,e+12|0,e+8|0);la=e+16|0}function ti(a,b,c,d,e,f){a=na[J[J[a+8>>2]+4>>2]](a+8|0)|0;a=tg(c,d,a,a+288|0,f,e,0)-a|0;if((a|0)<=287){J[b>>2]=((a|0)/12|0)%12}}function nk(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;while(1){if((b|0)!=(c|0)){J[d>>2]=H[b|0];d=d+4|0;b=b+1|0;continue}break}return c|0}function Ul(a,b,c){var d=0,e=0,f=0;d=la-16|0;la=d;e=d,f=Sl(b),J[e+12>>2]=f;e=d,f=Sl(c),J[e+8>>2]=f;Nd(a,d+12|0,d+8|0);la=d+16|0}function Fi(a,b,c,d,e,f){a=na[J[J[a+8>>2]+4>>2]](a+8|0)|0;a=fh(c,d,a,a+288|0,f,e,0)-a|0;if((a|0)<=287){J[b>>2]=((a|0)/12|0)%12}}function wm(a,b,c){var d=0,e=0;d=kd(a);if(d>>>0>=c>>>0){d=dd(a);rm(d,b,c);Ol(a,d,c);return}e=a;a=jd(a);sm(e,d,c-d|0,a,0,a,c,b)}function wk(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;while(1){if((b|0)!=(c|0)){H[d|0]=K[b|0];d=d+1|0;b=b+1|0;continue}break}return c|0}function Zb(a){a=a|0;var b=0;if((na[J[J[a>>2]+36>>2]](a)|0)==-1){return-1}b=a;a=J[a+12>>2];J[b+12>>2]=a+1;return _b(H[a|0])|0}function Um(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if(Pm(a,J[b+8>>2],0)){Sm(b,c,d);return}a=J[a+8>>2];na[J[J[a>>2]+28>>2]](a,b,c,d)}function Jd(a,b,c,d){var e=0,f=0;e=la-16|0;la=e;J[e+12>>2]=c;f=b;b=c-b|0;Od(d,f,b);J[e+8>>2]=b+d;Md(a,e+12|0,e+8|0);la=e+16|0}function ri(a,b,c,d,e,f){a=na[J[J[a+8>>2]>>2]](a+8|0)|0;a=tg(c,d,a,a+168|0,f,e,0)-a|0;if((a|0)<=167){J[b>>2]=((a|0)/12|0)%7}}function jh(a,b,c){var d=0,e=0,f=0,g=0;d=la-16|0;la=d;e=d+12|0;le(e,b);b=eh(e);f=c,g=yh(b),J[f>>2]=g;zh(a,b);ak(e);la=d+16|0}function Di(a,b,c,d,e,f){a=na[J[J[a+8>>2]>>2]](a+8|0)|0;a=fh(c,d,a,a+168|0,f,e,0)-a|0;if((a|0)<=167){J[b>>2]=((a|0)/12|0)%7}}function pc(a){var b=0;b=J[a+12>>2];if((b|0)==J[a+16>>2]){return na[J[J[a>>2]+40>>2]](a)|0}J[a+12>>2]=b+1;return _b(H[b|0])}function oe(a,b){J[a+20>>2]=0;J[a+24>>2]=b;J[a+12>>2]=0;J[a+4>>2]=4098;J[a+8>>2]=6;J[a+16>>2]=!b;kb(a+32|0,0,40);_j(a+28|0)}function Ob(a){J[a>>2]=3060;_j(a+4|0);J[a+24>>2]=0;J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;J[a+8>>2]=0;J[a+12>>2]=0;return a}function Ic(a){J[a>>2]=3220;_j(a+4|0);J[a+24>>2]=0;J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;J[a+8>>2]=0;J[a+12>>2]=0;return a}function Eg(a,b,c){var d=0,e=0,f=0,g=0;d=la-16|0;la=d;e=d+12|0;le(e,b);b=qg(e);f=c,g=yh(b),H[f|0]=g;zh(a,b);ak(e);la=d+16|0}function vf(a,b,c,d,e,f,g,h,i){J[a>>2]=b;J[a+4>>2]=c;J[a+8>>2]=d;J[a+12>>2]=e&65535|(i>>>16&32768|(e&2147418112)>>>16)<<16}function Uc(a){var b=0;b=J[a+12>>2];if((b|0)==J[a+16>>2]){return na[J[J[a>>2]+40>>2]](a)|0}J[a+12>>2]=b+4;return J[b>>2]}function Lc(a){a=a|0;var b=0;if((na[J[J[a>>2]+36>>2]](a)|0)==-1){return-1}b=a;a=J[a+12>>2];J[b+12>>2]=a+4;return J[a>>2]}function wj(a,b){var c=0;c=la-16|0;la=c;J[c+12>>2]=J[a>>2];a=c+12|0;J[a>>2]=J[a>>2]+(b<<2);la=c+16|0;return J[c+12>>2]}function Jk(a){var b=0,c=0;b=la-16|0;la=b;J[b+12>>2]=a;a=bh(b+8|0,b+12|0);c=J[J[5008]>>2];ch(a);la=b+16|0;return c?4:1}function Gk(a,b,c,d,e){var f=0;f=la-16|0;la=f;J[f+12>>2]=e;e=bh(f+8|0,f+12|0);a=we(a,b,c,d);ch(e);la=f+16|0;return a}function ij(a,b){var c=0;c=la-16|0;la=c;J[c+12>>2]=J[a>>2];a=c+12|0;J[a>>2]=J[a>>2]+b;la=c+16|0;return J[c+12>>2]}function ef(a,b){a=a|0;b=b|0;var c=0,d=0;na[J[J[a>>2]+24>>2]](a)|0;b=Ke(b);J[a+36>>2]=b;c=a,d=vd(b),H[c+44|0]=d}function Ve(a,b){a=a|0;b=b|0;var c=0,d=0;na[J[J[a>>2]+24>>2]](a)|0;b=ud(b);J[a+36>>2]=b;c=a,d=vd(b),H[c+44|0]=d}function Dg(a){a:{a=J[a+4>>2]&74;if(a){if((a|0)==64){return 8}if((a|0)!=8){break a}return 16}return 0}return 10}function Pm(a,b,c){if(!c){return J[a+4>>2]==J[b+4>>2]}if((a|0)==(b|0)){return 1}return!mb(J[a+4>>2],J[b+4>>2])}function vi(a,b,c,d,e){b=wi(b,c,d,e,4);if(!(K[d|0]&4)){J[a>>2]=((b|0)<69?b+2e3|0:b>>>0<100?b+1900|0:b)-1900}}function oc(a){var b=0;b=J[a+12>>2];if((b|0)==J[a+16>>2]){return na[J[J[a>>2]+36>>2]](a)|0}return _b(H[b|0])}function Hi(a,b,c,d,e){b=Ii(b,c,d,e,4);if(!(K[d|0]&4)){J[a>>2]=((b|0)<69?b+2e3|0:b>>>0<100?b+1900|0:b)-1900}}function Ek(a,b,c){var d=0;d=la-16|0;la=d;J[d+12>>2]=c;c=bh(d+8|0,d+12|0);a=ye(a,b);ch(c);la=d+16|0;return a}function ih(a,b){var c=0,d=0;c=la-16|0;la=c;d=c+12|0;le(d,a);vh(Oc(d),9056,9082,b);ak(d);la=c+16|0;return b}function Dd(a){a=a|0;var b=0;b=J[1027];J[a>>2]=b;J[J[b-12>>2]+a>>2]=J[1030];Ad(a+4|0);ne(a+56|0);return a|0}function zk(a,b,c,d,e,f,g,h){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;h=h|0;J[e>>2]=c;J[h>>2]=f;return 3}function Tc(a){var b=0;b=J[a+12>>2];if((b|0)==J[a+16>>2]){return na[J[J[a>>2]+36>>2]](a)|0}return J[b>>2]}function bm(a,b){var c=0;c=J[a+4>>2];while(1){if((b|0)!=(c|0)){Xl(a);c=c-4|0;continue}break}J[a+4>>2]=b}function ah(a,b,c){var d=0,e=0;d=la-16|0;la=d;e=a;a=Ql(a,H[c|0],b-a|0);a=Ld(e,a?a:b);la=d+16|0;return a}function wg(a,b,c){var d=0;d=la-16|0;la=d;J[d+12>>2]=b;a=pe(a,d+12|0);pe(a+4|0,c);la=d+16|0;return a}function sn(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;return na[a|0](b,c,d,e,f,g)|0}function ek(a,b,c){a=a|0;b=b|0;c=c|0;if(c>>>0<=127){a=(J[(c<<2)+9168>>2]&b)!=0}else{a=0}return a|0}function ue(a){if(!J[a+136>>2]){J[a+136>>2]=J[J[5008]>>2]?4384:4360}if(!J[a+72>>2]){J[a+72>>2]=1}}function ln(a){a=a|0;var b=0;J[a>>2]=16616;b=J[a+4>>2]-12|0;if((Yj(b+8|0)|0)<0){tb(b)}return a|0}function fn(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;if(Pm(a,J[b+8>>2],f)){Ym(b,c,d,e)}}function Id(a,b,c){var d=0;d=la-16|0;la=d;J[d+12>>2]=b;J[d+8>>2]=c;Nd(a,d+12|0,d+8|0);la=d+16|0}function Cd(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;na[J[J[b>>2]+16>>2]](a,b,J[c+8>>2],J[c+12>>2],0,d)}function ae(a,b){J[a+8>>2]=J[a+8>>2]&-2147483648|b&2147483647;J[a+8>>2]=J[a+8>>2]|-2147483648}function jm(a){var b=0,c=0;c=a;while(1){b=c;c=b+4|0;if(J[b>>2]){continue}break}return b-a>>2}function qk(a){a=a|0;var b=0;J[a>>2]=9120;b=J[a+8>>2];if(!(!b|!K[a+12|0])){tb(b)}return a|0}function Ec(a,b){var c=0;a:{c=J[a>>2];if(!c){break a}if(!qc(rc(c,b),-1)){break a}J[a>>2]=0}}function ie(a){var b=0;b=J[a>>2];if(b){if(!qc(Tc(b),-1)){return!J[a>>2]}J[a>>2]=0}return 1}function ge(a){var b=0;b=J[a>>2];if(b){if(!qc(oc(b),-1)){return!J[a>>2]}J[a>>2]=0}return 1}function dm(a,b,c){c=la-16|0;la=c;a:{if((a|0)==(b|0)){H[b+120|0]=0;break a}Pl(b)}la=c+16|0}function ag(a,b){var c=0;c=la-16|0;la=c;J[c+12>>2]=b;a=Yf(a,100,1484,b);la=c+16|0;return a}function Zd(a){var b=0;if(a>>>0>=11){b=a+16&-16;a=b-1|0;a=(a|0)==11?b:a}else{a=10}return a}function qn(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;na[a|0](b,c,d,e,f,g)}function dg(a){var b=0;b=J[5008];if(a){J[5008]=(a|0)==-1?17824:a}return(b|0)==17824?-1:b}function Ol(a,b,c){var d=0;d=la-16|0;la=d;cj(a,c);H[d+15|0]=0;Td(b+c|0,d+15|0);la=d+16|0}function uk(a,b){a=a|0;b=b|0;if((b|0)>=0){b=J[J[1876]+((b&255)<<2)>>2]}return b<<24>>24}function sk(a,b){a=a|0;b=b|0;if((b|0)>=0){b=J[J[1488]+((b&255)<<2)>>2]}return b<<24>>24}function kc(a,b,c){if((c|0)>=0){a=(J[J[a+8>>2]+((c&255)<<2)>>2]&b)!=0}else{a=0}return a}function $f(a,b){var c=0;c=la-16|0;la=c;J[c+12>>2]=b;a=If(a,1490,b);la=c+16|0;return a}function Ll(a){var b=0;if(a>>>0>=2){b=a+4&-4;a=b-1|0;a=(a|0)==2?b:a}else{a=1}return a}function Tl(a){var b=0;b=la-16|0;la=b;J[b+12>>2]=J[a>>2];la=b+16|0;return J[b+12>>2]}function rl(a){a=a|0;a=22648;while(1){a=Fm(a-12|0);if((a|0)!=22624){continue}break}}function pl(a){a=a|0;a=22616;while(1){a=tm(a-12|0);if((a|0)!=22592){continue}break}}function nl(a){a=a|0;a=22576;while(1){a=Fm(a-12|0);if((a|0)!=22288){continue}break}}function ll(a){a=a|0;a=22272;while(1){a=tm(a-12|0);if((a|0)!=21984){continue}break}}function il(a){a=a|0;a=21976;while(1){a=Fm(a-12|0);if((a|0)!=21808){continue}break}}function gl(a){a=a|0;a=21800;while(1){a=tm(a-12|0);if((a|0)!=21632){continue}break}}function Lj(a){a=a|0;J[a>>2]=10200;if(J[a+8>>2]!=(_g()|0)){bg(J[a+8>>2])}return a|0}function Sl(a){var b=0;b=la-16|0;la=b;J[b+12>>2]=a;a=Tl(b+12|0);la=b+16|0;return a}function Jl(a){a=a|0;var b=0;b=a+8|0;if(J[b>>2]!=(_g()|0)){bg(J[b>>2])}return a|0}function Va(){var a=0;a=pm(Om(4));J[a>>2]=16464;J[a>>2]=16484;Z(a|0,16596,2);B()}function mg(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;b=la-16|0;la=b;ng(a,c,d);la=b+16|0}function Mf(a){return(a|0)!=0&(a|0)!=4360&(a|0)!=4384&(a|0)!=21124&(a|0)!=21148}function rn(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;return na[a|0](b,c,d,e)|0}function kk(a,b){a=a|0;b=b|0;if(b>>>0<=127){b=J[J[1876]+(b<<2)>>2]}return b|0}function ik(a,b){a=a|0;b=b|0;if(b>>>0<=127){b=J[J[1488]+(b<<2)>>2]}return b|0}function Tm(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if(Pm(a,J[b+8>>2],0)){Sm(b,c,d)}}function Fh(a){var b=0;b=la-16|0;la=b;a=J[Nj(b+12|0,a)>>2];la=b+16|0;return a}function wd(a,b){var c=0,d=0;c=la-16|0;la=c;d=fe(b,a);la=c+16|0;return d?b:a}function qd(a,b){var c=0,d=0;c=la-16|0;la=c;d=fe(a,b);la=c+16|0;return d?b:a}function kj(a,b){var c=0,d=0;xg(a,jj(b));b=J[$i(b)>>2];c=$i(a),d=b,J[c>>2]=d}function Vb(a,b){var c=0,d=0;c=la-16|0;la=c;d=Hd(b,a);la=c+16|0;return d?b:a}function Te(a,b){var c=0,d=0;c=la-16|0;la=c;d=Hd(a,b);la=c+16|0;return d?b:a}function Nm(a,b){var c=0;c=a;a=(b>>>0)/1e6|0;return Mm(Km(c,a),b-P(a,1e6)|0)}function Mm(a,b){var c=0;c=a;a=(b>>>0)/1e4|0;return Lm(Km(c,a),b-P(a,1e4)|0)}function Lm(a,b){var c=0;c=a;a=(b>>>0)/100|0;return Km(Km(c,a),b-P(a,100)|0)}function zd(a,b,c,d,e,f,g,h){return na[J[J[a>>2]+12>>2]](a,b,c,d,e,f,g,h)|0}function yn(a){var b=0;b=a&31;a=0-a&31;return(-1>>>b&-2)<<b|(-1<<a&-2)>>>a}
function xd(a,b,c,d,e,f,g,h){return na[J[J[a>>2]+16>>2]](a,b,c,d,e,f,g,h)|0}function yl(a){a=a|0;if(!K[21564]){bl(21552,10400);H[21564]=1}return 21552}function ul(a){a=a|0;if(!K[21532]){bl(21520,10364);H[21532]=1}return 21520}function Gl(a){a=a|0;if(!K[21628]){bl(21616,10520);H[21628]=1}return 21616}function Cl(a){a=a|0;if(!K[21596]){bl(21584,10436);H[21596]=1}return 21584}function wl(a){a=a|0;if(!K[21548]){ke(21536,1672);H[21548]=1}return 21536}function sl(a){a=a|0;if(!K[21516]){ke(21504,1144);H[21516]=1}return 21504}function qb(a,b){var c=0;c=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=c;return a}function Yi(a,b){var c=0;c=pc(J[b>>2])<<24;J[a+4>>2]=J[b>>2];H[a|0]=c>>24}function El(a){a=a|0;if(!K[21612]){ke(21600,1327);H[21612]=1}return 21600}function Al(a){a=a|0;if(!K[21580]){ke(21568,1645);H[21580]=1}return 21568}function me(a,b){b=!J[a+24>>2]|b;J[a+16>>2]=b;if(b&J[a+20>>2]){yd();B()}}function Rb(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;Sb(a,-1,-1)}function Ak(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;J[e>>2]=c;return 3}function xg(a,b){var c=0;c=J[a>>2];J[a>>2]=b;if(c){na[J[$i(a)>>2]](c)}}function gd(a,b,c){var d=0;d=la-16|0;la=d;hd(a,b,c);la=d+16|0;return a}function Zm(a,b,c){if(!(J[a+28>>2]==1|J[a+4>>2]!=(b|0))){J[a+28>>2]=c}}function Si(a,b){a=a|0;b=b|0;H[a|0]=2;H[a+1|0]=3;H[a+2|0]=0;H[a+3|0]=4}function Sd(a,b){H[a+11|0]=K[a+11|0]&128|b&127;H[a+11|0]=K[a+11|0]&127}function Fe(a,b){var c=0;c=Je(a+4|0);J[a>>2]=3336;J[c>>2]=3356;He(c,b)}function Ce(a,b){var c=0;c=Ge(a+4|0);J[a>>2]=3176;J[c>>2]=3196;He(c,b)}function Jj(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;Vi(a,f)}function ok(a,b,c){a=a|0;b=b|0;c=c|0;return(b>>>0<128?b:c)<<24>>24}function nj(a,b){var c=0;c=Uc(J[b>>2]);J[a+4>>2]=J[b>>2];J[a>>2]=c}function zc(a,b){J[a>>2]=J[(J[J[b>>2]-12>>2]+b|0)+24>>2];return a}function bh(a,b){var c=0,d=0;c=a,d=dg(J[b>>2]),J[c>>2]=d;return a}function Sb(a,b,c){J[a+8>>2]=b;J[a+12>>2]=c;J[a>>2]=0;J[a+4>>2]=0}function bk(a){a=a|0;var b=0;b=J[5343]+1|0;J[5343]=b;J[a+4>>2]=b}function gn(a){a=a|0;if(!a){return 0}return(Rm(a,16220)|0)!=0|0}function Mj(a){J[a+4>>2]=0;J[a>>2]=15736;J[a>>2]=10576;return a}function Lk(a){a=a|0;a=J[a+8>>2];if(!a){return 1}return Jk(a)|0}function Fm(a){var b=0;if(id(a)){b=J[a>>2];rd(a);Pl(b)}return a}function Wc(a){var b=0;b=la-16|0;la=b;Xc(a);la=b+16|0;return a}function Nl(a){if(a>>>0>1073741823){yd();B()}return ee(a<<2,4)}function jg(a,b,c){var d=0;d=la-16|0;la=d;hd(a,b,c);la=d+16|0}function Ua(a){a=qm(Om(8),a);J[a>>2]=16664;Z(a|0,16696,1);B()}function ed(a,b){var c=0;c=J[a>>2];J[a>>2]=J[b>>2];J[b>>2]=c}function Wj(a){if((Yj(a+4|0)|0)==-1){na[J[J[a>>2]+8>>2]](a)}}function Le(a){a=a|0;gc(20248);gc(20584);Nc(20332);Nc(20668)}function Yj(a){var b=0;b=a;a=J[a>>2]-1|0;J[b>>2]=a;return a}function La(a,b){if(b){La(a,J[b>>2]);La(a,J[b+4>>2]);tb(b)}}function Ad(a){a=a|0;J[a>>2]=3380;tm(a+32|0);return Mb(a)|0}function xk(a,b,c){a=a|0;b=b|0;c=c|0;return((b|0)<0?c:b)|0}function qe(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ma=0;return 0}function $c(a,b,c,d){J[a+16>>2]=d;J[a+12>>2]=c;J[a+8>>2]=b}function ad(a,b,c){J[a+28>>2]=c;J[a+20>>2]=b;J[a+24>>2]=b}function Wa(a){a=a|0;a=J[4312];J[4312]=0;if(a){tb(Xa(a))}}function Vk(a){a=a|0;J[a>>2]=10288;tm(a+16|0);return a|0}function Tk(a){a=a|0;J[a>>2]=10248;tm(a+12|0);return a|0}function Tb(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;Sb(a,-1,-1)}function Mi(a,b){var c=0;c=K[a|0];H[a|0]=K[b|0];H[b|0]=c}function lm(a,b,c,d){a=eg(a,b,c,0,-2147483648);return a}function kd(a){if(id(a)){a=rd(a)-1|0}else{a=10}return a}function Rc(a,b,c){return na[J[J[a>>2]+12>>2]](a,b,c)|0}function Fc(a,b,c){return na[J[J[a>>2]+48>>2]](a,b,c)|0}function tc(a){a=a|0;return sc(J[J[a>>2]-12>>2]+a|0)|0}function qj(a){if(id(a)){a=rd(a)-1|0}else{a=1}return a}function jd(a){if(id(a)){return J[a+4>>2]}return sd(a)}function ig(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;jg(a,c,d)}function cc(a){a=a|0;return bc(J[J[a>>2]-12>>2]+a|0)|0}function _d(a,b){var c=0;c=de(b);J[a+4>>2]=b;J[a>>2]=c}function Ml(a,b){var c=0;c=Nl(b);J[a+4>>2]=b;J[a>>2]=c}function Mb(a){a=a|0;J[a>>2]=3060;ak(a+4|0);return a|0}function Gc(a){a=a|0;J[a>>2]=3220;ak(a+4|0);return a|0}function Fd(a){a=a|0;return Dd(J[J[a>>2]-12>>2]+a|0)|0}function $j(a,b){var c=0;c=a;a=J[b>>2];J[c>>2]=a;Vj(a)}function zi(a,b){return na[J[J[a>>2]+52>>2]](a,b,0)|0}function mi(a,b){return na[J[J[a>>2]+36>>2]](a,b,0)|0}function vh(a,b,c,d){na[J[J[a>>2]+48>>2]](a,b,c,d)|0}function Zg(a,b,c,d){na[J[J[a>>2]+32>>2]](a,b,c,d)|0}function Nd(a,b,c){J[a>>2]=J[b>>2];J[a+4>>2]=J[c>>2]}function yg(a,b){return na[J[J[a>>2]+12>>2]](a,b)|0}function vn(a){if(a){return 31-S(a-1^a)|0}return 32}function tm(a){if(id(a)){Rd(J[a>>2],rd(a))}return a}function jj(a){var b=0;b=J[a>>2];J[a>>2]=0;return b}function je(a,b){return na[J[J[a>>2]+44>>2]](a,b)|0}function he(a,b){return na[J[J[a>>2]+28>>2]](a,b)|0}function _f(a,b){return(lf(a)|0)!=0|(a|32)-97>>>0<6}function He(a,b){oe(a,b);J[a+72>>2]=0;J[a+76>>2]=-1}function wb(a){if(!a){return 0}J[4322]=a;return-1}function fb(){return(H[17287]>=0?17276:J[4319])|0}function eb(){return(H[17275]>=0?17264:J[4316])|0}function cj(a,b){if(id(a)){be(a,b);return}Sd(a,b)}function dd(a){if(id(a)){return J[a>>2]}return a}function _a(a){a=a|0;if(H[17287]<0){tb(J[4319])}}function Za(a){a=a|0;if(H[17275]<0){tb(J[4316])}}function Ya(a){a=a|0;if(H[17263]<0){tb(J[4313])}}function Xc(a){J[a>>2]=0;J[a+4>>2]=0;J[a+8>>2]=0}function ze(a,b){if(!a){return 0}return ye(a,b)}function yh(a){return na[J[J[a>>2]+16>>2]](a)|0}function xh(a){return na[J[J[a>>2]+12>>2]](a)|0}function vd(a){return na[J[J[a>>2]+28>>2]](a)|0}function pn(a){a=a|0;a=la-a&-16;la=a;return a|0}function nc(a){return na[J[J[a>>2]+24>>2]](a)|0}function mm(a,b,c,d){a=eg(a,b,c,-1,-1);return a}function km(a){var b=0,c=0;b=a,c=_g(),J[b>>2]=c}function gj(a){return na[J[J[a>>2]+36>>2]](a)|0}function Qb(a,b,c){a=a|0;b=b|0;c=c|0;return a|0}function Rf(a,b,c){if(!(K[a|0]&32)){Ib(b,c,a)}}function Km(a,b){return Xb((b<<1)+15840|0,2,a)}function vc(a){a=a|0;uc(J[J[a>>2]-12>>2]+a|0)}function ec(a){a=a|0;dc(J[J[a>>2]-12>>2]+a|0)}function Ud(a,b){if(Vd(b)){tb(a);return}tb(a)}function Ij(a,b,c){a=a|0;b=b|0;c=c|0;return-1}function Gd(a){a=a|0;Ed(J[J[a>>2]-12>>2]+a|0)}function Yh(a){return Fh(dd(a)+(jd(a)<<2)|0)}function Je(a){a=Ue(a);J[a>>2]=3720;return a}function Ge(a){a=Ue(a);J[a>>2]=3444;return a}function Bb(a){a=a|0;return fa(J[a+60>>2])|0}function $l(a){return J[Zl(a)>>2]-J[a>>2]>>2}function ck(a){a=a|0;na[J[J[a>>2]+4>>2]](a)}function zh(a,b){na[J[J[b>>2]+20>>2]](a,b)}function sg(a,b){na[J[J[b>>2]+28>>2]](a,b)}function rg(a,b){na[J[J[b>>2]+24>>2]](a,b)}function rd(a){return J[a+8>>2]&2147483647}function fj(a,b){na[J[J[b>>2]+32>>2]](a,b)}function ej(a,b){na[J[J[b>>2]+44>>2]](a,b)}function Pj(a){return J[a+4>>2]-J[a>>2]>>2}function Aj(a,b){na[J[J[b>>2]+40>>2]](a,b)}function sc(a){a=a|0;ne(a+4|0);return a|0}function pe(a,b){J[a>>2]=J[b>>2];return a}function jc(a){return oc(J[a>>2])<<24>>24}function bc(a){a=a|0;ne(a+8|0);return a|0}function _k(a,b){a=a|0;b=b|0;Vi(a,b+16|0)}function Zk(a,b){a=a|0;b=b|0;Vi(a,b+12|0)}function Jm(a,b){H[a|0]=b+48;return a+1|0}function hf(a){return(a|0)==32|a-9>>>0<5}function dl(a,b){a=a|0;b=b|0;bl(a,10340)}function bd(a,b){J[a+24>>2]=J[a+24>>2]+b}function al(a,b){a=a|0;b=b|0;bl(a,10320)}function Vj(a){a=a+4|0;J[a>>2]=J[a>>2]+1}function Uj(a,b){return J[a>>2]+(b<<2)|0}function Of(a){return a-65>>>0<26?a|32:a}function Nf(a){return a-97>>>0<26?a&95:a}function Dh(a,b){return J[a>>2]!=J[b>>2]}function mk(a,b){a=a|0;b=b|0;return b|0}function fe(a,b){return M[a>>2]<M[b>>2]}function cl(a,b){a=a|0;b=b|0;ke(a,1503)}function Ui(a,b){a=a|0;b=b|0;ii(a,1,45)}function Ri(a,b){a=a|0;b=b|0;Vh(a,1,45)}function Ie(a){J[a+4>>2]=J[a+4>>2]|8192}function Hd(a,b){return J[a>>2]<J[b>>2]}function Ch(a){return Fh(dd(a)+jd(a)|0)}function $k(a,b){a=a|0;b=b|0;ke(a,1494)}function gh(a,b){return dd(a)+(b<<2)|0}function Zc(a){a=a|0;return J[a+12>>2]}function Ti(a){a=a|0;return 2147483647}function Se(a,b){return(re(a,b)|0)!=-1}function Qd(a,b,c){if(c){jb(a,b,c<<2)}}function pm(a){J[a>>2]=16504;return a}function id(a){return K[a+11|0]>>>7|0}function ic(a,b){return ge(a)^ge(b)^1}function gm(a){a=a|0;return J[a+4>>2]}function ch(a){a=J[a>>2];if(a){dg(a)}}function bf(a){a=a|0;return af(a,1)|0}function Yc(a){a=a|0;return J[a+8>>2]}function Qe(a){a=a|0;return Pe(a,1)|0}function Pc(a,b){return ie(a)^ie(b)^1}function Om(a){return sb(a+80|0)+80|0}function Oe(a){a=a|0;return Pe(a,0)|0}function Dm(a,b){return xm(a,b,nb(b))}function $e(a){a=a|0;return af(a,0)|0}function $b(a,b){a=a|0;b=b|0;return-1}function Yk(a){a=a|0;return H[a+9|0]}function Xk(a){a=a|0;return H[a+8|0]}function Ue(a){J[a>>2]=4256;return a}function vg(a,b){return(b-a|0)/12|0}function sd(a){return K[a+11|0]&127}function qc(a,b){return(a|0)==(b|0)}function mc(a,b){me(a,J[a+16>>2]|b)}function lc(a){pc(J[a>>2]);return a}function Sc(a){Uc(J[a>>2]);return a}function Ql(a,b,c){return Hf(a,b,c)}function Od(a,b,c){if(c){jb(a,b,c)}}function Nj(a,b){J[a>>2]=b;return a}function Kb(a){a=a|0;return ne(a)|0}function od(a){return qc(a,-1)?0:a}function Qi(a,b){a=a|0;b=b|0;Wc(a)}function Ld(a,b){return(b-a|0)+a|0}function zg(a,b){return dd(a)+b|0}function yc(a){return ug(a,21212)}function vj(a){return ug(a,21276)}function ud(a){return ug(a,21392)}function tj(a){return ug(a,21284)}function qg(a){return ug(a,21440)}function lf(a){return a-48>>>0<10}function hm(a){return J[a>>2]-4|0}function hj(a){return ug(a,21260)}function hc(a){return ug(a,21384)}function eh(a){return ug(a,21448)}function dj(a){return ug(a,21268)}function Wm(a,b){return J[a+b>>2]}function Vl(a){J[a>>2]=0;return a}function Qc(a){return Tc(J[a>>2])}function Oc(a){return ug(a,21376)}function Ke(a){return ug(a,21400)}function rk(a){a=a|0;qk(a);tb(a)}function pj(a,b){J[a>>2]=J[b>>2]}function mn(a){a=a|0;ln(a);tb(a)}function kn(a){a=a|0;return 1436}function jn(a){a=a|0;return 1598}function im(a){J[a>>2]=J[a>>2]-4}function hn(a){a=a|0;return 1354}function fc(a){return!J[a+16>>2]}function em(a){return gm(a+12|0)}function cm(a){$l(a);Pj(a);$l(a)}function Zj(a){a=a|0;Xj(a);tb(a)}function Zh(a){J[a>>2]=J[a>>2]+4}function Wk(a){a=a|0;Vk(a);tb(a)}function Uk(a){a=a|0;Tk(a);tb(a)}function Nb(a){a=a|0;Mb(a);tb(a)}function Lb(a){a=a|0;ne(a);tb(a)}function Hc(a){a=a|0;Gc(a);tb(a)}function Eh(a){J[a>>2]=J[a>>2]+1}function Ck(a){a=a|0;Lj(a);tb(a)}function rj(a,b){return Oi(a,b)}function bg(a){if(Mf(a)){tb(a)}}function Wd(a,b){return Xd(a,b)}function Pi(a){a=a|0;return 127}function Kd(a,b){return Ld(a,b)}function Bh(a){return Fh(dd(a))}function Ab(a){a=a|0;return a|0}function zl(a){a=a|0;Fm(21552)}function xl(a){a=a|0;tm(21536)}function vl(a){a=a|0;Fm(21520)}function uc(a){a=a|0;tb(sc(a))}function tl(a){a=a|0;tm(21504)}function el(a,b){wm(a,b,nb(b))}function dc(a){a=a|0;tb(bc(a))}function Ze(a){a=a|0;tb(Gc(a))}function Yd(a){return a>>>0<11}function Td(a,b){H[a|0]=K[b|0]}function Oi(a,b){return b-a>>2}function Me(a){a=a|0;tb(Mb(a))}function Il(a){a=a|0;tb(Jl(a))}function Hl(a){a=a|0;Fm(21616)}function Fl(a){a=a|0;tm(21600)}function Ed(a){a=a|0;tb(Dd(a))}function Dl(a){a=a|0;Fm(21584)}function Bl(a){a=a|0;tm(21568)}function Bd(a){a=a|0;tb(Ad(a))}function ni(a){a=a|0;return 2}function le(a,b){$j(a,b+28|0)}function de(a){return ee(a,1)}function Yb(a){a=a|0;return-1}function Xd(a,b){return b-a|0}function Vd(a){return a>>>0>8}function Pk(a){a=a|0;return 4}function Kl(a){return a>>>0<2}function Eb(a){a=a|0;return 1}function De(a,b){J[a+72>>2]=b}function Cb(a){a=a|0;return 0}function Bc(a){return!J[a>>2]}function rm(a,b,c){Od(a,b,c)}function fm(a){return a+12|0}function cd(a,b){$j(a,b+4|0)}function be(a,b){J[a+4>>2]=b}function _l(a,b){$l(a);$l(a)}function Xl(a){return a+16|0}function Wb(a,b,c){Xb(b,c,a)}function Qj(a){bm(a,J[a>>2])}function Pb(a,b){a=a|0;b=b|0}function Md(a,b,c){Nd(a,b,c)}function _b(a){return a&255}function Zl(a){return a+8|0}function Wh(a){J[a+12>>2]=0}function Ag(a){return!jd(a)}function $i(a){return a+4|0}function ob(){return 17288}function gg(a){a=a|0;tb(a)}function ak(a){Wj(J[a>>2])}function Rj(a){$l(a);Pj(a)}function Ra(){Ua(1260);B()}function Ba(){Ua(1467);B()}function $d(a,b){J[a>>2]=b}function on(a){a=a|0;la=a}function nn(){return la|0}function nm(a){a=a|0;B()}function am(a){J[a>>2]=0}function Rd(a,b){Ud(a,1)}function yd(){ga();B()}function ce(){yd();B()}function Pl(a){Ud(a,4)}function Bg(a){xg(a,0)}function Db(a){a=a|0}
// EMSCRIPTEN_END_FUNCS
e=K;p(q);var na=c([null,ln,Ab,Wa,Ya,Za,_a,Mb,Nb,Pb,Qb,Rb,Tb,Cb,Cb,Ub,Yb,Zb,$b,ac,$b,bc,dc,cc,ec,sc,uc,tc,vc,Gc,Hc,Pb,Qb,Rb,Tb,Cb,Cb,Jc,Yb,Lc,$b,Mc,$b,bc,dc,cc,ec,sc,uc,tc,vc,Ad,Bd,td,Cd,md,nd,pd,Kb,Lb,Kb,Lb,Dd,Ed,Fd,Gd,ne,Lb,Bb,zb,xb,Cb,yb,qe,Db,Le,Me,Ne,Oe,Qe,Re,Me,Ve,We,Xe,Ye,Ze,_e,$e,bf,cf,Ze,ef,We,ff,gf,Jf,Wf,Xf,Zf,tb,Db,bk,dk,gl,il,ll,nl,pl,rl,tl,vl,xl,zl,Bl,Dl,Fl,Hl,Xj,Zj,ck,qk,rk,sk,tk,uk,vk,mk,wk,xk,yk,Lj,Ck,Dk,Fk,Hk,Ik,Cb,Kk,Lk,Tk,Uk,Xk,Yk,Zk,$k,cl,Vk,Wk,Yc,Zc,_k,al,dl,Ab,gg,gg,ek,fk,gk,hk,ik,jk,kk,lk,mk,nk,ok,pk,gg,zk,zk,Ak,Eb,Eb,Bk,Eb,gg,Mk,Nk,Ak,Cb,Cb,Ok,Pk,gg,Mk,Nk,Ak,Cb,Cb,Ok,Pk,gg,Qk,Rk,Ak,Cb,Cb,Sk,Pk,gg,Qk,Rk,Ak,Cb,Cb,Sk,Pk,Ab,gg,hg,ig,kg,Ab,gg,lg,mg,og,gg,pg,Cg,Ig,Kg,Mg,Mg,Og,Qg,Ug,Wg,Yg,gg,dh,hh,lh,mh,nh,nh,oh,ph,sh,th,uh,gg,Ah,Gh,Mh,Nh,Oh,Ph,Th,Uh,gg,Xh,_h,bi,ci,di,ei,gi,hi,Ab,gg,ni,oi,pi,qi,si,ui,xi,fl,kl,ol,Al,El,sl,wl,Ab,gg,ni,Ai,Bi,Ci,Ei,Gi,Ji,hl,ml,ql,Cl,Gl,ul,yl,Jl,Il,Ki,Jl,Il,Ni,gg,Pi,Pi,Qi,Qi,Qi,Ri,Cb,Si,Si,gg,Pi,Pi,Qi,Qi,Qi,Ri,Cb,Si,Si,gg,Ti,Ti,Qi,Qi,Qi,Ui,Cb,Si,Si,gg,Ti,Ti,Qi,Qi,Qi,Ui,Cb,Si,Si,gg,Wi,aj,gg,lj,oj,gg,xj,Cj,gg,Dj,Hj,gg,Ij,Jj,Pb,gg,Ij,Kj,Pb,Ab,nm,yd,Ab,gg,Db,Db,Qm,fn,cn,Tm,gg,en,bn,Um,gg,dn,_m,Xm,gg,jn,gg,kn,gg,hn,mn,gm,mn,mn]);function oa(){return G.byteLength/65536|0}function ta(ua){ua=ua|0;var pa=oa()|0;var qa=pa+ua|0;if(pa<qa&&qa<65536){var ra=new ArrayBuffer(P(qa,65536));var sa=new Int8Array(ra);sa.set(H);H=new Int8Array(ra);I=new Int16Array(ra);J=new Int32Array(ra);K=new Uint8Array(ra);L=new Uint16Array(ra);M=new Uint32Array(ra);N=new Float32Array(ra);O=new Float64Array(ra);G=ra;F.buffer=G;e=K}return pa}return{"__wasm_call_ctors":xa,"__indirect_function_table":na,"whot_init_game":$a,"whot_play_card":ab,"whot_draw_market":bb,"whot_bot_turn":cb,"whot_get_state_json":db,"whot_get_last_message":eb,"whot_get_last_banter":fb,"whot_serialize_state":db,"whot_deserialize_state":gb,"__main_argc_argv":hb,"__errno_location":ob,"stackSave":nn,"stackRestore":on,"stackAlloc":pn,"__cxa_is_pointer_type":gn,"dynCall_viijii":qn,"dynCall_jiji":rn,"dynCall_iiiiij":sn,"dynCall_iiiiijj":tn,"dynCall_iiiiiijj":un}}return va(wa)}
// EMSCRIPTEN_END_ASM


)(b);
}, instantiate:function(a, b) {
  return {then:function(c) {
    var d = new WebAssembly.Module(a);
    c({instance:new WebAssembly.Instance(d, b)});
  }};
}, RuntimeError:Error};
wasmBinary = [];
"object" != typeof WebAssembly && abort("no native wasm support detected");
"undefined" == typeof atob && ("undefined" != typeof global && "undefined" == typeof globalThis && (globalThis = global), globalThis.atob = function(a) {
  var b = "", c = 0;
  a = a.replace(/[^A-Za-z0-9\+\/=]/g, "");
  do {
    var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
    var e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
    var f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
    var h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(c++));
    d = d << 2 | e >> 4;
    e = (e & 15) << 4 | f >> 2;
    var n = (f & 3) << 6 | h;
    b += String.fromCharCode(d);
    64 !== f && (b += String.fromCharCode(e));
    64 !== h && (b += String.fromCharCode(n));
  } while (c < a.length);
  return b;
});
function intArrayFromBase64(a) {
  if ("undefined" != typeof ENVIRONMENT_IS_NODE && ENVIRONMENT_IS_NODE) {
    return a = Buffer.from(a, "base64"), new Uint8Array(a.buffer, a.byteOffset, a.length);
  }
  a = atob(a);
  for (var b = new Uint8Array(a.length), c = 0; c < a.length; ++c) {
    b[c] = a.charCodeAt(c);
  }
  return b;
}
function tryParseAsDataURI(a) {
  if (isDataURI(a)) {
    return intArrayFromBase64(a.slice(dataURIPrefix.length));
  }
}
var wasmMemory, ABORT = !1, EXITSTATUS;
function assert(a, b) {
  a || abort(b);
}
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateMemoryViews() {
  var a = wasmMemory.buffer;
  Module.HEAP8 = HEAP8 = new Int8Array(a);
  Module.HEAP16 = HEAP16 = new Int16Array(a);
  Module.HEAPU8 = HEAPU8 = new Uint8Array(a);
  Module.HEAPU16 = HEAPU16 = new Uint16Array(a);
  Module.HEAP32 = HEAP32 = new Int32Array(a);
  Module.HEAPU32 = HEAPU32 = new Uint32Array(a);
  Module.HEAPF32 = HEAPF32 = new Float32Array(a);
  Module.HEAPF64 = HEAPF64 = new Float64Array(a);
}
var INITIAL_MEMORY = Module.INITIAL_MEMORY || 16777216;
wasmMemory = Module.wasmMemory ? Module.wasmMemory : new WebAssembly.Memory({initial:INITIAL_MEMORY / 65536, maximum:32768});
updateMemoryViews();
INITIAL_MEMORY = wasmMemory.buffer.byteLength;
var __ATPRERUN__ = [], __ATINIT__ = [], __ATMAIN__ = [], __ATPOSTRUN__ = [], runtimeInitialized = !1;
function preRun() {
  if (Module.preRun) {
    for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) {
      addOnPreRun(Module.preRun.shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  runtimeInitialized = !0;
  Module.noFSInit || FS.init.initialized || FS.init();
  FS.ignorePermissions = !1;
  TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function postRun() {
  if (Module.postRun) {
    for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) {
      addOnPostRun(Module.postRun.shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(a) {
  __ATPRERUN__.unshift(a);
}
function addOnInit(a) {
  __ATINIT__.unshift(a);
}
function addOnPostRun(a) {
  __ATPOSTRUN__.unshift(a);
}
Math.imul || (Math.imul = function(a, b) {
  var c = a & 65535, d = b & 65535;
  return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16) | 0;
});
if (!Math.fround) {
  var froundBuffer = new Float32Array(1);
  Math.fround = function(a) {
    froundBuffer[0] = a;
    return froundBuffer[0];
  };
}
Math.clz32 || (Math.clz32 = function(a) {
  var b = 32, c = a >> 16;
  c && (b -= 16, a = c);
  if (c = a >> 8) {
    b -= 8, a = c;
  }
  if (c = a >> 4) {
    b -= 4, a = c;
  }
  if (c = a >> 2) {
    b -= 2, a = c;
  }
  return a >> 1 ? b - 2 : b - a;
});
Math.trunc || (Math.trunc = function(a) {
  return 0 > a ? Math.ceil(a) : Math.floor(a);
});
var runDependencies = 0, runDependencyWatcher = null, dependenciesFulfilled = null;
function getUniqueRunDependency(a) {
  return a;
}
function addRunDependency(a) {
  runDependencies++;
  Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies);
}
function removeRunDependency(a) {
  runDependencies--;
  Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies);
  0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled && (a = dependenciesFulfilled, dependenciesFulfilled = null, a()));
}
function abort(a) {
  if (Module.onAbort) {
    Module.onAbort(a);
  }
  a = "Aborted(" + a + ")";
  err(a);
  ABORT = !0;
  EXITSTATUS = 1;
  throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
}
var dataURIPrefix = "data:application/octet-stream;base64,", isDataURI = function(a) {
  return a.startsWith(dataURIPrefix);
}, isFileURI = function(a) {
  return a.startsWith("file://");
}, wasmBinaryFile;
wasmBinaryFile = "<<< WASM_BINARY_FILE >>>";
isDataURI(wasmBinaryFile) || (wasmBinaryFile = locateFile(wasmBinaryFile));
function getBinarySync(a) {
  if (a == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  var b = tryParseAsDataURI(a);
  if (b) {
    return b;
  }
  if (readBinary) {
    return readBinary(a);
  }
  throw "both async and sync fetching of the wasm failed";
}
function getBinaryPromise(a) {
  return Promise.resolve().then(function() {
    return getBinarySync(a);
  });
}
function instantiateArrayBuffer(a, b, c) {
  return getBinaryPromise(a).then(function(d) {
    return WebAssembly.instantiate(d, b);
  }).then(function(d) {
    return d;
  }).then(c, function(d) {
    err("failed to asynchronously prepare wasm: " + d);
    abort(d);
  });
}
function instantiateAsync(a, b, c, d) {
  return instantiateArrayBuffer(b, c, d);
}
function createWasm() {
  function a(c, d) {
    wasmExports = c.exports;
    addOnInit(wasmExports.__wasm_call_ctors);
    removeRunDependency("wasm-instantiate");
    return wasmExports;
  }
  var b = {env:wasmImports, wasi_snapshot_preview1:wasmImports};
  addRunDependency("wasm-instantiate");
  if (Module.instantiateWasm) {
    try {
      return Module.instantiateWasm(b, a);
    } catch (c) {
      return err("Module.instantiateWasm callback failed with error: " + c), !1;
    }
  }
  instantiateAsync(wasmBinary, wasmBinaryFile, b, function(c) {
    a(c.instance);
  });
  return {};
}
var tempDouble, tempI64;
function ExitStatus(a) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + a + ")";
  this.status = a;
}
var callRuntimeCallbacks = function(a) {
  for (; 0 < a.length;) {
    a.shift()(Module);
  }
}, noExitRuntime = Module.noExitRuntime || !0;
function ExceptionInfo(a) {
  this.excPtr = a;
  this.ptr = a - 24;
  this.set_type = function(b) {
    HEAPU32[this.ptr + 4 >> 2] = b;
  };
  this.get_type = function() {
    return HEAPU32[this.ptr + 4 >> 2];
  };
  this.set_destructor = function(b) {
    HEAPU32[this.ptr + 8 >> 2] = b;
  };
  this.get_destructor = function() {
    return HEAPU32[this.ptr + 8 >> 2];
  };
  this.set_caught = function(b) {
    HEAP8[this.ptr + 12 >> 0] = b ? 1 : 0;
  };
  this.get_caught = function() {
    return 0 != HEAP8[this.ptr + 12 >> 0];
  };
  this.set_rethrown = function(b) {
    HEAP8[this.ptr + 13 >> 0] = b ? 1 : 0;
  };
  this.get_rethrown = function() {
    return 0 != HEAP8[this.ptr + 13 >> 0];
  };
  this.init = function(b, c) {
    this.set_adjusted_ptr(0);
    this.set_type(b);
    this.set_destructor(c);
  };
  this.set_adjusted_ptr = function(b) {
    HEAPU32[this.ptr + 16 >> 2] = b;
  };
  this.get_adjusted_ptr = function() {
    return HEAPU32[this.ptr + 16 >> 2];
  };
  this.get_exception_ptr = function() {
    if (___cxa_is_pointer_type(this.get_type())) {
      return HEAPU32[this.excPtr >> 2];
    }
    var b = this.get_adjusted_ptr();
    return 0 !== b ? b : this.excPtr;
  };
}
var exceptionLast = 0, uncaughtExceptionCount = 0, ___cxa_throw = function(a, b, c) {
  (new ExceptionInfo(a)).init(b, c);
  exceptionLast = a;
  uncaughtExceptionCount++;
  throw exceptionLast;
}, nowIsMonotonic = "object" == typeof performance && performance && "function" == typeof performance.now || ENVIRONMENT_IS_NODE, __emscripten_get_now_is_monotonic = function() {
  return nowIsMonotonic;
}, _abort = function() {
  abort("");
}, _emscripten_date_now = function() {
  return Date.now();
}, _emscripten_get_now;
ENVIRONMENT_IS_NODE && (global.performance = require("perf_hooks").performance);
_emscripten_get_now = "undefined" != typeof performance && performance.now ? function() {
  return performance.now();
} : Date.now;
var _emscripten_memcpy_js = Uint8Array.prototype.copyWithin ? function(a, b, c) {
  return HEAPU8.copyWithin(a, b, b + c);
} : function(a, b, c) {
  return HEAPU8.set(HEAPU8.subarray(b, b + c), a);
}, getHeapMax = function() {
  return 2147483648;
}, growMemory = function(a) {
  a = (a - wasmMemory.buffer.byteLength + 65535) / 65536;
  try {
    return wasmMemory.grow(a), updateMemoryViews(), 1;
  } catch (b) {
  }
}, _emscripten_resize_heap = function(a) {
  var b = HEAPU8.length;
  a >>>= 0;
  var c = getHeapMax();
  if (a > c) {
    return !1;
  }
  for (var d = 1; 4 >= d; d *= 2) {
    var e = b * (1 + .2 / d);
    e = Math.min(e, a + 100663296);
    var f = Math;
    e = Math.max(a, e);
    f = f.min.call(f, c, e + (65536 - e % 65536) % 65536);
    if (growMemory(f)) {
      return !0;
    }
  }
  return !1;
}, ENV = {}, getExecutableName = function() {
  return thisProgram || "./this.program";
}, getEnvStrings = function() {
  if (!getEnvStrings.strings) {
    var a = {USER:"web_user", LOGNAME:"web_user", PATH:"/", PWD:"/", HOME:"/home/web_user", LANG:("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", _:getExecutableName()}, b;
    for (b in ENV) {
      void 0 === ENV[b] ? delete a[b] : a[b] = ENV[b];
    }
    var c = [];
    for (b in a) {
      c.push(b + "=" + a[b]);
    }
    getEnvStrings.strings = c;
  }
  return getEnvStrings.strings;
}, stringToAscii = function(a, b) {
  for (var c = 0; c < a.length; ++c) {
    HEAP8[b++ >> 0] = a.charCodeAt(c);
  }
  HEAP8[b >> 0] = 0;
}, PATH = {isAbs:function(a) {
  return "/" === a.charAt(0);
}, splitPath:function(a) {
  return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
}, normalizeArray:function(a, b) {
  for (var c = 0, d = a.length - 1; 0 <= d; d--) {
    var e = a[d];
    "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
  }
  if (b) {
    for (; c; c--) {
      a.unshift("..");
    }
  }
  return a;
}, normalize:function(a) {
  var b = PATH.isAbs(a), c = "/" === a.substr(-1);
  (a = PATH.normalizeArray(a.split("/").filter(function(d) {
    return !!d;
  }), !b).join("/")) || b || (a = ".");
  a && c && (a += "/");
  return (b ? "/" : "") + a;
}, dirname:function(a) {
  var b = PATH.splitPath(a);
  a = b[0];
  b = b[1];
  if (!a && !b) {
    return ".";
  }
  b && (b = b.substr(0, b.length - 1));
  return a + b;
}, basename:function(a) {
  if ("/" === a) {
    return "/";
  }
  a = PATH.normalize(a);
  a = a.replace(/\/$/, "");
  var b = a.lastIndexOf("/");
  return -1 === b ? a : a.substr(b + 1);
}, join:function() {
  var a = Array.prototype.slice.call(arguments);
  return PATH.normalize(a.join("/"));
}, join2:function(a, b) {
  return PATH.normalize(a + "/" + b);
}}, initRandomFill = function() {
  if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
    return function(c) {
      return crypto.getRandomValues(c);
    };
  }
  if (ENVIRONMENT_IS_NODE) {
    try {
      var a = require("crypto");
      if (a.randomFillSync) {
        return function(c) {
          return a.randomFillSync(c);
        };
      }
      var b = a.randomBytes;
      return function(c) {
        return c.set(b(c.byteLength)), c;
      };
    } catch (c) {
    }
  }
  abort("initRandomDevice");
}, randomFill = function(a) {
  return (randomFill = initRandomFill())(a);
}, PATH_FS = {resolve:function() {
  for (var a = "", b = !1, c = arguments.length - 1; -1 <= c && !b; c--) {
    b = 0 <= c ? arguments[c] : FS.cwd();
    if ("string" != typeof b) {
      throw new TypeError("Arguments to path.resolve must be strings");
    }
    if (!b) {
      return "";
    }
    a = b + "/" + a;
    b = PATH.isAbs(b);
  }
  a = PATH.normalizeArray(a.split("/").filter(function(d) {
    return !!d;
  }), !b).join("/");
  return (b ? "/" : "") + a || ".";
}, relative:function(a, b) {
  function c(h) {
    for (var n = 0; n < h.length && "" === h[n]; n++) {
    }
    for (var p = h.length - 1; 0 <= p && "" === h[p]; p--) {
    }
    return n > p ? [] : h.slice(n, p - n + 1);
  }
  a = PATH_FS.resolve(a).substr(1);
  b = PATH_FS.resolve(b).substr(1);
  a = c(a.split("/"));
  b = c(b.split("/"));
  for (var d = Math.min(a.length, b.length), e = d, f = 0; f < d; f++) {
    if (a[f] !== b[f]) {
      e = f;
      break;
    }
  }
  d = [];
  for (f = e; f < a.length; f++) {
    d.push("..");
  }
  d = d.concat(b.slice(e));
  return d.join("/");
}}, UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, UTF8ArrayToString = function(a, b, c) {
  var d = b + c;
  for (c = b; a[c] && !(c >= d);) {
    ++c;
  }
  if (16 < c - b && a.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(a.subarray(b, c));
  }
  for (d = ""; b < c;) {
    var e = a[b++];
    if (e & 128) {
      var f = a[b++] & 63;
      if (192 == (e & 224)) {
        d += String.fromCharCode((e & 31) << 6 | f);
      } else {
        var h = a[b++] & 63;
        e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | h : (e & 7) << 18 | f << 12 | h << 6 | a[b++] & 63;
        65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
      }
    } else {
      d += String.fromCharCode(e);
    }
  }
  return d;
}, FS_stdin_getChar_buffer = [], lengthBytesUTF8 = function(a) {
  for (var b = 0, c = 0; c < a.length; ++c) {
    var d = a.charCodeAt(c);
    127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
  }
  return b;
}, stringToUTF8Array = function(a, b, c, d) {
  if (!(0 < d)) {
    return 0;
  }
  var e = c;
  d = c + d - 1;
  for (var f = 0; f < a.length; ++f) {
    var h = a.charCodeAt(f);
    if (55296 <= h && 57343 >= h) {
      var n = a.charCodeAt(++f);
      h = 65536 + ((h & 1023) << 10) | n & 1023;
    }
    if (127 >= h) {
      if (c >= d) {
        break;
      }
      b[c++] = h;
    } else {
      if (2047 >= h) {
        if (c + 1 >= d) {
          break;
        }
        b[c++] = 192 | h >> 6;
      } else {
        if (65535 >= h) {
          if (c + 2 >= d) {
            break;
          }
          b[c++] = 224 | h >> 12;
        } else {
          if (c + 3 >= d) {
            break;
          }
          b[c++] = 240 | h >> 18;
          b[c++] = 128 | h >> 12 & 63;
        }
        b[c++] = 128 | h >> 6 & 63;
      }
      b[c++] = 128 | h & 63;
    }
  }
  b[c] = 0;
  return c - e;
};
function intArrayFromString(a, b, c) {
  c = 0 < c ? c : lengthBytesUTF8(a) + 1;
  c = Array(c);
  a = stringToUTF8Array(a, c, 0, c.length);
  b && (c.length = a);
  return c;
}
var FS_stdin_getChar = function() {
  if (!FS_stdin_getChar_buffer.length) {
    var a = null;
    if (ENVIRONMENT_IS_NODE) {
      a = Buffer.alloc(256);
      var b = 0, c = process.stdin.fd;
      try {
        b = fs.readSync(c, a);
      } catch (d) {
        if (d.toString().includes("EOF")) {
          b = 0;
        } else {
          throw d;
        }
      }
      a = 0 < b ? a.slice(0, b).toString("utf-8") : null;
    } else {
      "undefined" != typeof window && "function" == typeof window.prompt ? (a = window.prompt("Input: "), null !== a && (a += "\n")) : "function" == typeof readline && (a = readline(), null !== a && (a += "\n"));
    }
    if (!a) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(a, !0);
  }
  return FS_stdin_getChar_buffer.shift();
}, TTY = {ttys:[], init:function() {
}, shutdown:function() {
}, register:function(a, b) {
  TTY.ttys[a] = {input:[], output:[], ops:b};
  FS.registerDevice(a, TTY.stream_ops);
}, stream_ops:{open:function(a) {
  var b = TTY.ttys[a.node.rdev];
  if (!b) {
    throw new FS.ErrnoError(43);
  }
  a.tty = b;
  a.seekable = !1;
}, close:function(a) {
  a.tty.ops.fsync(a.tty);
}, fsync:function(a) {
  a.tty.ops.fsync(a.tty);
}, read:function(a, b, c, d, e) {
  if (!a.tty || !a.tty.ops.get_char) {
    throw new FS.ErrnoError(60);
  }
  for (var f = e = 0; f < d; f++) {
    try {
      var h = a.tty.ops.get_char(a.tty);
    } catch (n) {
      throw new FS.ErrnoError(29);
    }
    if (void 0 === h && 0 === e) {
      throw new FS.ErrnoError(6);
    }
    if (null === h || void 0 === h) {
      break;
    }
    e++;
    b[c + f] = h;
  }
  e && (a.node.timestamp = Date.now());
  return e;
}, write:function(a, b, c, d, e) {
  if (!a.tty || !a.tty.ops.put_char) {
    throw new FS.ErrnoError(60);
  }
  try {
    for (e = 0; e < d; e++) {
      a.tty.ops.put_char(a.tty, b[c + e]);
    }
  } catch (f) {
    throw new FS.ErrnoError(29);
  }
  d && (a.node.timestamp = Date.now());
  return e;
}}, default_tty_ops:{get_char:function(a) {
  return FS_stdin_getChar();
}, put_char:function(a, b) {
  null === b || 10 === b ? (out(UTF8ArrayToString(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
}, fsync:function(a) {
  a.output && 0 < a.output.length && (out(UTF8ArrayToString(a.output, 0)), a.output = []);
}, ioctl_tcgets:function(a) {
  return {c_iflag:25856, c_oflag:5, c_cflag:191, c_lflag:35387, c_cc:[3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]};
}, ioctl_tcsets:function(a, b, c) {
  return 0;
}, ioctl_tiocgwinsz:function(a) {
  return [24, 80];
}}, default_tty1_ops:{put_char:function(a, b) {
  null === b || 10 === b ? (err(UTF8ArrayToString(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
}, fsync:function(a) {
  a.output && 0 < a.output.length && (err(UTF8ArrayToString(a.output, 0)), a.output = []);
}}}, mmapAlloc = function(a) {
  abort();
}, MEMFS = {ops_table:null, mount:function(a) {
  return MEMFS.createNode(null, "/", 16895, 0);
}, createNode:function(a, b, c, d) {
  if (FS.isBlkdev(c) || FS.isFIFO(c)) {
    throw new FS.ErrnoError(63);
  }
  MEMFS.ops_table || (MEMFS.ops_table = {dir:{node:{getattr:MEMFS.node_ops.getattr, setattr:MEMFS.node_ops.setattr, lookup:MEMFS.node_ops.lookup, mknod:MEMFS.node_ops.mknod, rename:MEMFS.node_ops.rename, unlink:MEMFS.node_ops.unlink, rmdir:MEMFS.node_ops.rmdir, readdir:MEMFS.node_ops.readdir, symlink:MEMFS.node_ops.symlink}, stream:{llseek:MEMFS.stream_ops.llseek}}, file:{node:{getattr:MEMFS.node_ops.getattr, setattr:MEMFS.node_ops.setattr}, stream:{llseek:MEMFS.stream_ops.llseek, read:MEMFS.stream_ops.read, 
  write:MEMFS.stream_ops.write, allocate:MEMFS.stream_ops.allocate, mmap:MEMFS.stream_ops.mmap, msync:MEMFS.stream_ops.msync}}, link:{node:{getattr:MEMFS.node_ops.getattr, setattr:MEMFS.node_ops.setattr, readlink:MEMFS.node_ops.readlink}, stream:{}}, chrdev:{node:{getattr:MEMFS.node_ops.getattr, setattr:MEMFS.node_ops.setattr}, stream:FS.chrdev_stream_ops}});
  c = FS.createNode(a, b, c, d);
  FS.isDir(c.mode) ? (c.node_ops = MEMFS.ops_table.dir.node, c.stream_ops = MEMFS.ops_table.dir.stream, c.contents = {}) : FS.isFile(c.mode) ? (c.node_ops = MEMFS.ops_table.file.node, c.stream_ops = MEMFS.ops_table.file.stream, c.usedBytes = 0, c.contents = null) : FS.isLink(c.mode) ? (c.node_ops = MEMFS.ops_table.link.node, c.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(c.mode) && (c.node_ops = MEMFS.ops_table.chrdev.node, c.stream_ops = MEMFS.ops_table.chrdev.stream);
  c.timestamp = Date.now();
  a && (a.contents[b] = c, a.timestamp = c.timestamp);
  return c;
}, getFileDataAsTypedArray:function(a) {
  return a.contents ? a.contents.subarray ? a.contents.subarray(0, a.usedBytes) : new Uint8Array(a.contents) : new Uint8Array(0);
}, expandFileStorage:function(a, b) {
  var c = a.contents ? a.contents.length : 0;
  c >= b || (b = Math.max(b, c * (1048576 > c ? 2 : 1.125) >>> 0), 0 != c && (b = Math.max(b, 256)), c = a.contents, a.contents = new Uint8Array(b), 0 < a.usedBytes && a.contents.set(c.subarray(0, a.usedBytes), 0));
}, resizeFileStorage:function(a, b) {
  if (a.usedBytes != b) {
    if (0 == b) {
      a.contents = null, a.usedBytes = 0;
    } else {
      var c = a.contents;
      a.contents = new Uint8Array(b);
      c && a.contents.set(c.subarray(0, Math.min(b, a.usedBytes)));
      a.usedBytes = b;
    }
  }
}, node_ops:{getattr:function(a) {
  var b = {};
  b.dev = FS.isChrdev(a.mode) ? a.id : 1;
  b.ino = a.id;
  b.mode = a.mode;
  b.nlink = 1;
  b.uid = 0;
  b.gid = 0;
  b.rdev = a.rdev;
  FS.isDir(a.mode) ? b.size = 4096 : FS.isFile(a.mode) ? b.size = a.usedBytes : FS.isLink(a.mode) ? b.size = a.link.length : b.size = 0;
  b.atime = new Date(a.timestamp);
  b.mtime = new Date(a.timestamp);
  b.ctime = new Date(a.timestamp);
  b.blksize = 4096;
  b.blocks = Math.ceil(b.size / b.blksize);
  return b;
}, setattr:function(a, b) {
  void 0 !== b.mode && (a.mode = b.mode);
  void 0 !== b.timestamp && (a.timestamp = b.timestamp);
  void 0 !== b.size && MEMFS.resizeFileStorage(a, b.size);
}, lookup:function(a, b) {
  throw FS.genericErrors[44];
}, mknod:function(a, b, c, d) {
  return MEMFS.createNode(a, b, c, d);
}, rename:function(a, b, c) {
  if (FS.isDir(a.mode)) {
    try {
      var d = FS.lookupNode(b, c);
    } catch (f) {
    }
    if (d) {
      for (var e in d.contents) {
        throw new FS.ErrnoError(55);
      }
    }
  }
  delete a.parent.contents[a.name];
  a.parent.timestamp = Date.now();
  a.name = c;
  b.contents[c] = a;
  b.timestamp = a.parent.timestamp;
  a.parent = b;
}, unlink:function(a, b) {
  delete a.contents[b];
  a.timestamp = Date.now();
}, rmdir:function(a, b) {
  var c = FS.lookupNode(a, b), d;
  for (d in c.contents) {
    throw new FS.ErrnoError(55);
  }
  delete a.contents[b];
  a.timestamp = Date.now();
}, readdir:function(a) {
  var b = [".", ".."], c;
  for (c in a.contents) {
    a.contents.hasOwnProperty(c) && b.push(c);
  }
  return b;
}, symlink:function(a, b, c) {
  a = MEMFS.createNode(a, b, 41471, 0);
  a.link = c;
  return a;
}, readlink:function(a) {
  if (!FS.isLink(a.mode)) {
    throw new FS.ErrnoError(28);
  }
  return a.link;
}}, stream_ops:{read:function(a, b, c, d, e) {
  var f = a.node.contents;
  if (e >= a.node.usedBytes) {
    return 0;
  }
  a = Math.min(a.node.usedBytes - e, d);
  if (8 < a && f.subarray) {
    b.set(f.subarray(e, e + a), c);
  } else {
    for (d = 0; d < a; d++) {
      b[c + d] = f[e + d];
    }
  }
  return a;
}, write:function(a, b, c, d, e, f) {
  b.buffer === HEAP8.buffer && (f = !1);
  if (!d) {
    return 0;
  }
  a = a.node;
  a.timestamp = Date.now();
  if (b.subarray && (!a.contents || a.contents.subarray)) {
    if (f) {
      return a.contents = b.subarray(c, c + d), a.usedBytes = d;
    }
    if (0 === a.usedBytes && 0 === e) {
      return a.contents = b.slice(c, c + d), a.usedBytes = d;
    }
    if (e + d <= a.usedBytes) {
      return a.contents.set(b.subarray(c, c + d), e), d;
    }
  }
  MEMFS.expandFileStorage(a, e + d);
  if (a.contents.subarray && b.subarray) {
    a.contents.set(b.subarray(c, c + d), e);
  } else {
    for (f = 0; f < d; f++) {
      a.contents[e + f] = b[c + f];
    }
  }
  a.usedBytes = Math.max(a.usedBytes, e + d);
  return d;
}, llseek:function(a, b, c) {
  1 === c ? b += a.position : 2 === c && FS.isFile(a.node.mode) && (b += a.node.usedBytes);
  if (0 > b) {
    throw new FS.ErrnoError(28);
  }
  return b;
}, allocate:function(a, b, c) {
  MEMFS.expandFileStorage(a.node, b + c);
  a.node.usedBytes = Math.max(a.node.usedBytes, b + c);
}, mmap:function(a, b, c, d, e) {
  if (!FS.isFile(a.node.mode)) {
    throw new FS.ErrnoError(43);
  }
  a = a.node.contents;
  if (e & 2 || a.buffer !== HEAP8.buffer) {
    if (0 < c || c + b < a.length) {
      a = a.subarray ? a.subarray(c, c + b) : Array.prototype.slice.call(a, c, c + b);
    }
    c = !0;
    b = mmapAlloc(b);
    if (!b) {
      throw new FS.ErrnoError(48);
    }
    HEAP8.set(a, b);
  } else {
    c = !1, b = a.byteOffset;
  }
  return {ptr:b, allocated:c};
}, msync:function(a, b, c, d, e) {
  MEMFS.stream_ops.write(a, b, 0, d, c, !1);
  return 0;
}}}, asyncLoad = function(a, b, c, d) {
  var e = d ? "" : getUniqueRunDependency("al " + a);
  readAsync(a, function(f) {
    assert(f, 'Loading data file "' + a + '" failed (no arrayBuffer).');
    b(new Uint8Array(f));
    e && removeRunDependency(e);
  }, function(f) {
    if (c) {
      c();
    } else {
      throw 'Loading data file "' + a + '" failed.';
    }
  });
  e && addRunDependency(e);
}, FS_createDataFile = function(a, b, c, d, e, f) {
  FS.createDataFile(a, b, c, d, e, f);
}, preloadPlugins = Module.preloadPlugins || [], FS_handledByPreloadPlugin = function(a, b, c, d) {
  "undefined" != typeof Browser && Browser.init();
  var e = !1;
  preloadPlugins.forEach(function(f) {
    !e && f.canHandle(b) && (f.handle(a, b, c, d), e = !0);
  });
  return e;
}, FS_createPreloadedFile = function(a, b, c, d, e, f, h, n, p, k) {
  function l(g) {
    function q(r) {
      k && k();
      n || FS_createDataFile(a, b, r, d, e, p);
      f && f();
      removeRunDependency(t);
    }
    FS_handledByPreloadPlugin(g, m, q, function() {
      h && h();
      removeRunDependency(t);
    }) || q(g);
  }
  var m = b ? PATH_FS.resolve(PATH.join2(a, b)) : a, t = getUniqueRunDependency("cp " + m);
  addRunDependency(t);
  "string" == typeof c ? asyncLoad(c, function(g) {
    return l(g);
  }, h) : l(c);
}, FS_modeStringToFlags = function(a) {
  var b = {r:0, "r+":2, w:577, "w+":578, a:1089, "a+":1090}[a];
  if ("undefined" == typeof b) {
    throw Error("Unknown file open mode: " + a);
  }
  return b;
}, FS_getMode = function(a, b) {
  var c = 0;
  a && (c |= 365);
  b && (c |= 146);
  return c;
}, FS = {root:null, mounts:[], devices:{}, streams:[], nextInode:1, nameTable:null, currentPath:"/", initialized:!1, ignorePermissions:!0, ErrnoError:null, genericErrors:{}, filesystems:null, syncFSRequests:0, lookupPath:function(a, b) {
  b = void 0 === b ? {} : b;
  a = PATH_FS.resolve(a);
  if (!a) {
    return {path:"", node:null};
  }
  b = Object.assign({follow_mount:!0, recurse_count:0}, b);
  if (8 < b.recurse_count) {
    throw new FS.ErrnoError(32);
  }
  a = a.split("/").filter(function(h) {
    return !!h;
  });
  for (var c = FS.root, d = "/", e = 0; e < a.length; e++) {
    var f = e === a.length - 1;
    if (f && b.parent) {
      break;
    }
    c = FS.lookupNode(c, a[e]);
    d = PATH.join2(d, a[e]);
    FS.isMountpoint(c) && (!f || f && b.follow_mount) && (c = c.mounted.root);
    if (!f || b.follow) {
      for (f = 0; FS.isLink(c.mode);) {
        if (c = FS.readlink(d), d = PATH_FS.resolve(PATH.dirname(d), c), c = FS.lookupPath(d, {recurse_count:b.recurse_count + 1}).node, 40 < f++) {
          throw new FS.ErrnoError(32);
        }
      }
    }
  }
  return {path:d, node:c};
}, getPath:function(a) {
  for (var b;;) {
    if (FS.isRoot(a)) {
      return a = a.mount.mountpoint, b ? "/" !== a[a.length - 1] ? a + "/" + b : a + b : a;
    }
    b = b ? a.name + "/" + b : a.name;
    a = a.parent;
  }
}, hashName:function(a, b) {
  for (var c = 0, d = 0; d < b.length; d++) {
    c = (c << 5) - c + b.charCodeAt(d) | 0;
  }
  return (a + c >>> 0) % FS.nameTable.length;
}, hashAddNode:function(a) {
  var b = FS.hashName(a.parent.id, a.name);
  a.name_next = FS.nameTable[b];
  FS.nameTable[b] = a;
}, hashRemoveNode:function(a) {
  var b = FS.hashName(a.parent.id, a.name);
  if (FS.nameTable[b] === a) {
    FS.nameTable[b] = a.name_next;
  } else {
    for (b = FS.nameTable[b]; b;) {
      if (b.name_next === a) {
        b.name_next = a.name_next;
        break;
      }
      b = b.name_next;
    }
  }
}, lookupNode:function(a, b) {
  var c = FS.mayLookup(a);
  if (c) {
    throw new FS.ErrnoError(c, a);
  }
  c = FS.hashName(a.id, b);
  for (c = FS.nameTable[c]; c; c = c.name_next) {
    var d = c.name;
    if (c.parent.id === a.id && d === b) {
      return c;
    }
  }
  return FS.lookup(a, b);
}, createNode:function(a, b, c, d) {
  a = new FS.FSNode(a, b, c, d);
  FS.hashAddNode(a);
  return a;
}, destroyNode:function(a) {
  FS.hashRemoveNode(a);
}, isRoot:function(a) {
  return a === a.parent;
}, isMountpoint:function(a) {
  return !!a.mounted;
}, isFile:function(a) {
  return 32768 === (a & 61440);
}, isDir:function(a) {
  return 16384 === (a & 61440);
}, isLink:function(a) {
  return 40960 === (a & 61440);
}, isChrdev:function(a) {
  return 8192 === (a & 61440);
}, isBlkdev:function(a) {
  return 24576 === (a & 61440);
}, isFIFO:function(a) {
  return 4096 === (a & 61440);
}, isSocket:function(a) {
  return 49152 === (a & 49152);
}, flagsToPermissionString:function(a) {
  var b = ["r", "w", "rw"][a & 3];
  a & 512 && (b += "w");
  return b;
}, nodePermissions:function(a, b) {
  if (FS.ignorePermissions) {
    return 0;
  }
  if (!b.includes("r") || a.mode & 292) {
    if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) {
      return 2;
    }
  } else {
    return 2;
  }
  return 0;
}, mayLookup:function(a) {
  var b = FS.nodePermissions(a, "x");
  return b ? b : a.node_ops.lookup ? 0 : 2;
}, mayCreate:function(a, b) {
  try {
    return FS.lookupNode(a, b), 20;
  } catch (c) {
  }
  return FS.nodePermissions(a, "wx");
}, mayDelete:function(a, b, c) {
  try {
    var d = FS.lookupNode(a, b);
  } catch (e) {
    return e.errno;
  }
  if (a = FS.nodePermissions(a, "wx")) {
    return a;
  }
  if (c) {
    if (!FS.isDir(d.mode)) {
      return 54;
    }
    if (FS.isRoot(d) || FS.getPath(d) === FS.cwd()) {
      return 10;
    }
  } else {
    if (FS.isDir(d.mode)) {
      return 31;
    }
  }
  return 0;
}, mayOpen:function(a, b) {
  return a ? FS.isLink(a.mode) ? 32 : FS.isDir(a.mode) && ("r" !== FS.flagsToPermissionString(b) || b & 512) ? 31 : FS.nodePermissions(a, FS.flagsToPermissionString(b)) : 44;
}, MAX_OPEN_FDS:4096, nextfd:function() {
  for (var a = 0; a <= FS.MAX_OPEN_FDS; a++) {
    if (!FS.streams[a]) {
      return a;
    }
  }
  throw new FS.ErrnoError(33);
}, getStreamChecked:function(a) {
  a = FS.getStream(a);
  if (!a) {
    throw new FS.ErrnoError(8);
  }
  return a;
}, getStream:function(a) {
  return FS.streams[a];
}, createStream:function(a, b) {
  b = void 0 === b ? -1 : b;
  FS.FSStream || (FS.FSStream = function() {
    this.shared = {};
  }, FS.FSStream.prototype = {}, Object.defineProperties(FS.FSStream.prototype, {object:{get:function() {
    return this.node;
  }, set:function(c) {
    this.node = c;
  }}, isRead:{get:function() {
    return 1 !== (this.flags & 2097155);
  }}, isWrite:{get:function() {
    return 0 !== (this.flags & 2097155);
  }}, isAppend:{get:function() {
    return this.flags & 1024;
  }}, flags:{get:function() {
    return this.shared.flags;
  }, set:function(c) {
    this.shared.flags = c;
  }}, position:{get:function() {
    return this.shared.position;
  }, set:function(c) {
    this.shared.position = c;
  }}}));
  a = Object.assign(new FS.FSStream(), a);
  -1 == b && (b = FS.nextfd());
  a.fd = b;
  return FS.streams[b] = a;
}, closeStream:function(a) {
  FS.streams[a] = null;
}, chrdev_stream_ops:{open:function(a) {
  var b = FS.getDevice(a.node.rdev);
  a.stream_ops = b.stream_ops;
  a.stream_ops.open && a.stream_ops.open(a);
}, llseek:function() {
  throw new FS.ErrnoError(70);
}}, major:function(a) {
  return a >> 8;
}, minor:function(a) {
  return a & 255;
}, makedev:function(a, b) {
  return a << 8 | b;
}, registerDevice:function(a, b) {
  FS.devices[a] = {stream_ops:b};
}, getDevice:function(a) {
  return FS.devices[a];
}, getMounts:function(a) {
  var b = [];
  for (a = [a]; a.length;) {
    var c = a.pop();
    b.push(c);
    a.push.apply(a, c.mounts);
  }
  return b;
}, syncfs:function(a, b) {
  function c(h) {
    FS.syncFSRequests--;
    return b(h);
  }
  function d(h) {
    if (h) {
      if (!d.errored) {
        return d.errored = !0, c(h);
      }
    } else {
      ++f >= e.length && c(null);
    }
  }
  "function" == typeof a && (b = a, a = !1);
  FS.syncFSRequests++;
  1 < FS.syncFSRequests && err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
  var e = FS.getMounts(FS.root.mount), f = 0;
  e.forEach(function(h) {
    if (!h.type.syncfs) {
      return d(null);
    }
    h.type.syncfs(h, a, d);
  });
}, mount:function(a, b, c) {
  var d = "/" === c, e = !c;
  if (d && FS.root) {
    throw new FS.ErrnoError(10);
  }
  if (!d && !e) {
    var f = FS.lookupPath(c, {follow_mount:!1});
    c = f.path;
    f = f.node;
    if (FS.isMountpoint(f)) {
      throw new FS.ErrnoError(10);
    }
    if (!FS.isDir(f.mode)) {
      throw new FS.ErrnoError(54);
    }
  }
  b = {type:a, opts:b, mountpoint:c, mounts:[]};
  a = a.mount(b);
  a.mount = b;
  b.root = a;
  d ? FS.root = a : f && (f.mounted = b, f.mount && f.mount.mounts.push(b));
  return a;
}, unmount:function(a) {
  a = FS.lookupPath(a, {follow_mount:!1});
  if (!FS.isMountpoint(a.node)) {
    throw new FS.ErrnoError(28);
  }
  a = a.node;
  var b = a.mounted, c = FS.getMounts(b);
  Object.keys(FS.nameTable).forEach(function(d) {
    for (d = FS.nameTable[d]; d;) {
      var e = d.name_next;
      c.includes(d.mount) && FS.destroyNode(d);
      d = e;
    }
  });
  a.mounted = null;
  b = a.mount.mounts.indexOf(b);
  a.mount.mounts.splice(b, 1);
}, lookup:function(a, b) {
  return a.node_ops.lookup(a, b);
}, mknod:function(a, b, c) {
  var d = FS.lookupPath(a, {parent:!0}).node;
  a = PATH.basename(a);
  if (!a || "." === a || ".." === a) {
    throw new FS.ErrnoError(28);
  }
  var e = FS.mayCreate(d, a);
  if (e) {
    throw new FS.ErrnoError(e);
  }
  if (!d.node_ops.mknod) {
    throw new FS.ErrnoError(63);
  }
  return d.node_ops.mknod(d, a, b, c);
}, create:function(a, b) {
  return FS.mknod(a, (void 0 !== b ? b : 438) & 4095 | 32768, 0);
}, mkdir:function(a, b) {
  return FS.mknod(a, (void 0 !== b ? b : 511) & 1023 | 16384, 0);
}, mkdirTree:function(a, b) {
  a = a.split("/");
  for (var c = "", d = 0; d < a.length; ++d) {
    if (a[d]) {
      c += "/" + a[d];
      try {
        FS.mkdir(c, b);
      } catch (e) {
        if (20 != e.errno) {
          throw e;
        }
      }
    }
  }
}, mkdev:function(a, b, c) {
  "undefined" == typeof c && (c = b, b = 438);
  return FS.mknod(a, b | 8192, c);
}, symlink:function(a, b) {
  if (!PATH_FS.resolve(a)) {
    throw new FS.ErrnoError(44);
  }
  var c = FS.lookupPath(b, {parent:!0}).node;
  if (!c) {
    throw new FS.ErrnoError(44);
  }
  b = PATH.basename(b);
  var d = FS.mayCreate(c, b);
  if (d) {
    throw new FS.ErrnoError(d);
  }
  if (!c.node_ops.symlink) {
    throw new FS.ErrnoError(63);
  }
  return c.node_ops.symlink(c, b, a);
}, rename:function(a, b) {
  var c = PATH.dirname(a), d = PATH.dirname(b), e = PATH.basename(a), f = PATH.basename(b);
  var h = FS.lookupPath(a, {parent:!0});
  var n = h.node;
  h = FS.lookupPath(b, {parent:!0});
  h = h.node;
  if (!n || !h) {
    throw new FS.ErrnoError(44);
  }
  if (n.mount !== h.mount) {
    throw new FS.ErrnoError(75);
  }
  var p = FS.lookupNode(n, e);
  a = PATH_FS.relative(a, d);
  if ("." !== a.charAt(0)) {
    throw new FS.ErrnoError(28);
  }
  a = PATH_FS.relative(b, c);
  if ("." !== a.charAt(0)) {
    throw new FS.ErrnoError(55);
  }
  try {
    var k = FS.lookupNode(h, f);
  } catch (l) {
  }
  if (p !== k) {
    b = FS.isDir(p.mode);
    if (e = FS.mayDelete(n, e, b)) {
      throw new FS.ErrnoError(e);
    }
    if (e = k ? FS.mayDelete(h, f, b) : FS.mayCreate(h, f)) {
      throw new FS.ErrnoError(e);
    }
    if (!n.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(p) || k && FS.isMountpoint(k)) {
      throw new FS.ErrnoError(10);
    }
    if (h !== n && (e = FS.nodePermissions(n, "w"))) {
      throw new FS.ErrnoError(e);
    }
    FS.hashRemoveNode(p);
    try {
      n.node_ops.rename(p, h, f);
    } catch (l) {
      throw l;
    } finally {
      FS.hashAddNode(p);
    }
  }
}, rmdir:function(a) {
  var b = FS.lookupPath(a, {parent:!0}).node;
  a = PATH.basename(a);
  var c = FS.lookupNode(b, a), d = FS.mayDelete(b, a, !0);
  if (d) {
    throw new FS.ErrnoError(d);
  }
  if (!b.node_ops.rmdir) {
    throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(c)) {
    throw new FS.ErrnoError(10);
  }
  b.node_ops.rmdir(b, a);
  FS.destroyNode(c);
}, readdir:function(a) {
  a = FS.lookupPath(a, {follow:!0}).node;
  if (!a.node_ops.readdir) {
    throw new FS.ErrnoError(54);
  }
  return a.node_ops.readdir(a);
}, unlink:function(a) {
  var b = FS.lookupPath(a, {parent:!0}).node;
  if (!b) {
    throw new FS.ErrnoError(44);
  }
  a = PATH.basename(a);
  var c = FS.lookupNode(b, a), d = FS.mayDelete(b, a, !1);
  if (d) {
    throw new FS.ErrnoError(d);
  }
  if (!b.node_ops.unlink) {
    throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(c)) {
    throw new FS.ErrnoError(10);
  }
  b.node_ops.unlink(b, a);
  FS.destroyNode(c);
}, readlink:function(a) {
  a = FS.lookupPath(a).node;
  if (!a) {
    throw new FS.ErrnoError(44);
  }
  if (!a.node_ops.readlink) {
    throw new FS.ErrnoError(28);
  }
  return PATH_FS.resolve(FS.getPath(a.parent), a.node_ops.readlink(a));
}, stat:function(a, b) {
  a = FS.lookupPath(a, {follow:!b}).node;
  if (!a) {
    throw new FS.ErrnoError(44);
  }
  if (!a.node_ops.getattr) {
    throw new FS.ErrnoError(63);
  }
  return a.node_ops.getattr(a);
}, lstat:function(a) {
  return FS.stat(a, !0);
}, chmod:function(a, b, c) {
  a = "string" == typeof a ? FS.lookupPath(a, {follow:!c}).node : a;
  if (!a.node_ops.setattr) {
    throw new FS.ErrnoError(63);
  }
  a.node_ops.setattr(a, {mode:b & 4095 | a.mode & -4096, timestamp:Date.now()});
}, lchmod:function(a, b) {
  FS.chmod(a, b, !0);
}, fchmod:function(a, b) {
  a = FS.getStreamChecked(a);
  FS.chmod(a.node, b);
}, chown:function(a, b, c, d) {
  a = "string" == typeof a ? FS.lookupPath(a, {follow:!d}).node : a;
  if (!a.node_ops.setattr) {
    throw new FS.ErrnoError(63);
  }
  a.node_ops.setattr(a, {timestamp:Date.now()});
}, lchown:function(a, b, c) {
  FS.chown(a, b, c, !0);
}, fchown:function(a, b, c) {
  a = FS.getStreamChecked(a);
  FS.chown(a.node, b, c);
}, truncate:function(a, b) {
  if (0 > b) {
    throw new FS.ErrnoError(28);
  }
  a = "string" == typeof a ? FS.lookupPath(a, {follow:!0}).node : a;
  if (!a.node_ops.setattr) {
    throw new FS.ErrnoError(63);
  }
  if (FS.isDir(a.mode)) {
    throw new FS.ErrnoError(31);
  }
  if (!FS.isFile(a.mode)) {
    throw new FS.ErrnoError(28);
  }
  var c = FS.nodePermissions(a, "w");
  if (c) {
    throw new FS.ErrnoError(c);
  }
  a.node_ops.setattr(a, {size:b, timestamp:Date.now()});
}, ftruncate:function(a, b) {
  a = FS.getStreamChecked(a);
  if (0 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(28);
  }
  FS.truncate(a.node, b);
}, utime:function(a, b, c) {
  a = FS.lookupPath(a, {follow:!0}).node;
  a.node_ops.setattr(a, {timestamp:Math.max(b, c)});
}, open:function(a, b, c) {
  if ("" === a) {
    throw new FS.ErrnoError(44);
  }
  b = "string" == typeof b ? FS_modeStringToFlags(b) : b;
  c = b & 64 ? ("undefined" == typeof c ? 438 : c) & 4095 | 32768 : 0;
  if ("object" == typeof a) {
    var d = a;
  } else {
    a = PATH.normalize(a);
    try {
      d = FS.lookupPath(a, {follow:!(b & 131072)}).node;
    } catch (f) {
    }
  }
  var e = !1;
  if (b & 64) {
    if (d) {
      if (b & 128) {
        throw new FS.ErrnoError(20);
      }
    } else {
      d = FS.mknod(a, c, 0), e = !0;
    }
  }
  if (!d) {
    throw new FS.ErrnoError(44);
  }
  FS.isChrdev(d.mode) && (b &= -513);
  if (b & 65536 && !FS.isDir(d.mode)) {
    throw new FS.ErrnoError(54);
  }
  if (!e && (c = FS.mayOpen(d, b))) {
    throw new FS.ErrnoError(c);
  }
  b & 512 && !e && FS.truncate(d, 0);
  b &= -131713;
  d = FS.createStream({node:d, path:FS.getPath(d), flags:b, seekable:!0, position:0, stream_ops:d.stream_ops, ungotten:[], error:!1});
  d.stream_ops.open && d.stream_ops.open(d);
  !Module.logReadFiles || b & 1 || (FS.readFiles || (FS.readFiles = {}), a in FS.readFiles || (FS.readFiles[a] = 1));
  return d;
}, close:function(a) {
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  a.getdents && (a.getdents = null);
  try {
    a.stream_ops.close && a.stream_ops.close(a);
  } catch (b) {
    throw b;
  } finally {
    FS.closeStream(a.fd);
  }
  a.fd = null;
}, isClosed:function(a) {
  return null === a.fd;
}, llseek:function(a, b, c) {
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  if (!a.seekable || !a.stream_ops.llseek) {
    throw new FS.ErrnoError(70);
  }
  if (0 != c && 1 != c && 2 != c) {
    throw new FS.ErrnoError(28);
  }
  a.position = a.stream_ops.llseek(a, b, c);
  a.ungotten = [];
  return a.position;
}, read:function(a, b, c, d, e) {
  if (0 > d || 0 > e) {
    throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  if (1 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(8);
  }
  if (FS.isDir(a.node.mode)) {
    throw new FS.ErrnoError(31);
  }
  if (!a.stream_ops.read) {
    throw new FS.ErrnoError(28);
  }
  var f = "undefined" != typeof e;
  if (!f) {
    e = a.position;
  } else if (!a.seekable) {
    throw new FS.ErrnoError(70);
  }
  b = a.stream_ops.read(a, b, c, d, e);
  f || (a.position += b);
  return b;
}, write:function(a, b, c, d, e, f) {
  if (0 > d || 0 > e) {
    throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  if (0 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(8);
  }
  if (FS.isDir(a.node.mode)) {
    throw new FS.ErrnoError(31);
  }
  if (!a.stream_ops.write) {
    throw new FS.ErrnoError(28);
  }
  a.seekable && a.flags & 1024 && FS.llseek(a, 0, 2);
  var h = "undefined" != typeof e;
  if (!h) {
    e = a.position;
  } else if (!a.seekable) {
    throw new FS.ErrnoError(70);
  }
  b = a.stream_ops.write(a, b, c, d, e, f);
  h || (a.position += b);
  return b;
}, allocate:function(a, b, c) {
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  if (0 > b || 0 >= c) {
    throw new FS.ErrnoError(28);
  }
  if (0 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(8);
  }
  if (!FS.isFile(a.node.mode) && !FS.isDir(a.node.mode)) {
    throw new FS.ErrnoError(43);
  }
  if (!a.stream_ops.allocate) {
    throw new FS.ErrnoError(138);
  }
  a.stream_ops.allocate(a, b, c);
}, mmap:function(a, b, c, d, e) {
  if (0 !== (d & 2) && 0 === (e & 2) && 2 !== (a.flags & 2097155)) {
    throw new FS.ErrnoError(2);
  }
  if (1 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(2);
  }
  if (!a.stream_ops.mmap) {
    throw new FS.ErrnoError(43);
  }
  return a.stream_ops.mmap(a, b, c, d, e);
}, msync:function(a, b, c, d, e) {
  return a.stream_ops.msync ? a.stream_ops.msync(a, b, c, d, e) : 0;
}, munmap:function(a) {
  return 0;
}, ioctl:function(a, b, c) {
  if (!a.stream_ops.ioctl) {
    throw new FS.ErrnoError(59);
  }
  return a.stream_ops.ioctl(a, b, c);
}, readFile:function(a, b) {
  b = void 0 === b ? {} : b;
  b.flags = b.flags || 0;
  b.encoding = b.encoding || "binary";
  if ("utf8" !== b.encoding && "binary" !== b.encoding) {
    throw Error('Invalid encoding type "' + b.encoding + '"');
  }
  var c, d = FS.open(a, b.flags);
  a = FS.stat(a).size;
  var e = new Uint8Array(a);
  FS.read(d, e, 0, a, 0);
  "utf8" === b.encoding ? c = UTF8ArrayToString(e, 0) : "binary" === b.encoding && (c = e);
  FS.close(d);
  return c;
}, writeFile:function(a, b, c) {
  c = void 0 === c ? {} : c;
  c.flags = c.flags || 577;
  a = FS.open(a, c.flags, c.mode);
  if ("string" == typeof b) {
    var d = new Uint8Array(lengthBytesUTF8(b) + 1);
    b = stringToUTF8Array(b, d, 0, d.length);
    FS.write(a, d, 0, b, void 0, c.canOwn);
  } else if (ArrayBuffer.isView(b)) {
    FS.write(a, b, 0, b.byteLength, void 0, c.canOwn);
  } else {
    throw Error("Unsupported data type");
  }
  FS.close(a);
}, cwd:function() {
  return FS.currentPath;
}, chdir:function(a) {
  a = FS.lookupPath(a, {follow:!0});
  if (null === a.node) {
    throw new FS.ErrnoError(44);
  }
  if (!FS.isDir(a.node.mode)) {
    throw new FS.ErrnoError(54);
  }
  var b = FS.nodePermissions(a.node, "x");
  if (b) {
    throw new FS.ErrnoError(b);
  }
  FS.currentPath = a.path;
}, createDefaultDirectories:function() {
  FS.mkdir("/tmp");
  FS.mkdir("/home");
  FS.mkdir("/home/web_user");
}, createDefaultDevices:function() {
  FS.mkdir("/dev");
  FS.registerDevice(FS.makedev(1, 3), {read:function() {
    return 0;
  }, write:function(d, e, f, h, n) {
    return h;
  }});
  FS.mkdev("/dev/null", FS.makedev(1, 3));
  TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
  TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
  FS.mkdev("/dev/tty", FS.makedev(5, 0));
  FS.mkdev("/dev/tty1", FS.makedev(6, 0));
  var a = new Uint8Array(1024), b = 0, c = function() {
    0 === b && (b = randomFill(a).byteLength);
    return a[--b];
  };
  FS.createDevice("/dev", "random", c);
  FS.createDevice("/dev", "urandom", c);
  FS.mkdir("/dev/shm");
  FS.mkdir("/dev/shm/tmp");
}, createSpecialDirectories:function() {
  FS.mkdir("/proc");
  var a = FS.mkdir("/proc/self");
  FS.mkdir("/proc/self/fd");
  FS.mount({mount:function() {
    var b = FS.createNode(a, "fd", 16895, 73);
    b.node_ops = {lookup:function(c, d) {
      var e = FS.getStreamChecked(+d);
      c = {parent:null, mount:{mountpoint:"fake"}, node_ops:{readlink:function() {
        return e.path;
      }}};
      return c.parent = c;
    }};
    return b;
  }}, {}, "/proc/self/fd");
}, createStandardStreams:function() {
  Module.stdin ? FS.createDevice("/dev", "stdin", Module.stdin) : FS.symlink("/dev/tty", "/dev/stdin");
  Module.stdout ? FS.createDevice("/dev", "stdout", null, Module.stdout) : FS.symlink("/dev/tty", "/dev/stdout");
  Module.stderr ? FS.createDevice("/dev", "stderr", null, Module.stderr) : FS.symlink("/dev/tty1", "/dev/stderr");
  FS.open("/dev/stdin", 0);
  FS.open("/dev/stdout", 1);
  FS.open("/dev/stderr", 1);
}, ensureErrnoError:function() {
  FS.ErrnoError || (FS.ErrnoError = function(a, b) {
    this.name = "ErrnoError";
    this.node = b;
    this.setErrno = function(c) {
      this.errno = c;
    };
    this.setErrno(a);
    this.message = "FS error";
  }, FS.ErrnoError.prototype = Error(), FS.ErrnoError.prototype.constructor = FS.ErrnoError, [44].forEach(function(a) {
    FS.genericErrors[a] = new FS.ErrnoError(a);
    FS.genericErrors[a].stack = "<generic error, no stack>";
  }));
}, staticInit:function() {
  FS.ensureErrnoError();
  FS.nameTable = Array(4096);
  FS.mount(MEMFS, {}, "/");
  FS.createDefaultDirectories();
  FS.createDefaultDevices();
  FS.createSpecialDirectories();
  FS.filesystems = {MEMFS:MEMFS};
}, init:function(a, b, c) {
  FS.init.initialized = !0;
  FS.ensureErrnoError();
  Module.stdin = a || Module.stdin;
  Module.stdout = b || Module.stdout;
  Module.stderr = c || Module.stderr;
  FS.createStandardStreams();
}, quit:function() {
  FS.init.initialized = !1;
  for (var a = 0; a < FS.streams.length; a++) {
    var b = FS.streams[a];
    b && FS.close(b);
  }
}, findObject:function(a, b) {
  a = FS.analyzePath(a, b);
  return a.exists ? a.object : null;
}, analyzePath:function(a, b) {
  try {
    var c = FS.lookupPath(a, {follow:!b});
    a = c.path;
  } catch (e) {
  }
  var d = {isRoot:!1, exists:!1, error:0, name:null, path:null, object:null, parentExists:!1, parentPath:null, parentObject:null};
  try {
    c = FS.lookupPath(a, {parent:!0}), d.parentExists = !0, d.parentPath = c.path, d.parentObject = c.node, d.name = PATH.basename(a), c = FS.lookupPath(a, {follow:!b}), d.exists = !0, d.path = c.path, d.object = c.node, d.name = c.node.name, d.isRoot = "/" === c.path;
  } catch (e) {
    d.error = e.errno;
  }
  return d;
}, createPath:function(a, b, c, d) {
  a = "string" == typeof a ? a : FS.getPath(a);
  for (b = b.split("/").reverse(); b.length;) {
    if (c = b.pop()) {
      var e = PATH.join2(a, c);
      try {
        FS.mkdir(e);
      } catch (f) {
      }
      a = e;
    }
  }
  return e;
}, createFile:function(a, b, c, d, e) {
  a = PATH.join2("string" == typeof a ? a : FS.getPath(a), b);
  d = FS_getMode(d, e);
  return FS.create(a, d);
}, createDataFile:function(a, b, c, d, e, f) {
  var h = b;
  a && (a = "string" == typeof a ? a : FS.getPath(a), h = b ? PATH.join2(a, b) : a);
  a = FS_getMode(d, e);
  h = FS.create(h, a);
  if (c) {
    if ("string" == typeof c) {
      b = Array(c.length);
      d = 0;
      for (e = c.length; d < e; ++d) {
        b[d] = c.charCodeAt(d);
      }
      c = b;
    }
    FS.chmod(h, a | 146);
    b = FS.open(h, 577);
    FS.write(b, c, 0, c.length, 0, f);
    FS.close(b);
    FS.chmod(h, a);
  }
}, createDevice:function(a, b, c, d) {
  a = PATH.join2("string" == typeof a ? a : FS.getPath(a), b);
  b = FS_getMode(!!c, !!d);
  FS.createDevice.major || (FS.createDevice.major = 64);
  var e = FS.makedev(FS.createDevice.major++, 0);
  FS.registerDevice(e, {open:function(f) {
    f.seekable = !1;
  }, close:function(f) {
    d && d.buffer && d.buffer.length && d(10);
  }, read:function(f, h, n, p, k) {
    for (var l = k = 0; l < p; l++) {
      try {
        var m = c();
      } catch (t) {
        throw new FS.ErrnoError(29);
      }
      if (void 0 === m && 0 === k) {
        throw new FS.ErrnoError(6);
      }
      if (null === m || void 0 === m) {
        break;
      }
      k++;
      h[n + l] = m;
    }
    k && (f.node.timestamp = Date.now());
    return k;
  }, write:function(f, h, n, p, k) {
    for (k = 0; k < p; k++) {
      try {
        d(h[n + k]);
      } catch (l) {
        throw new FS.ErrnoError(29);
      }
    }
    p && (f.node.timestamp = Date.now());
    return k;
  }});
  return FS.mkdev(a, b, e);
}, forceLoadFile:function(a) {
  if (a.isDevice || a.isFolder || a.link || a.contents) {
    return !0;
  }
  if ("undefined" != typeof XMLHttpRequest) {
    throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
  }
  if (read_) {
    try {
      a.contents = intArrayFromString(read_(a.url), !0), a.usedBytes = a.contents.length;
    } catch (b) {
      throw new FS.ErrnoError(29);
    }
  } else {
    throw Error("Cannot load without read() or XMLHttpRequest.");
  }
}, createLazyFile:function(a, b, c, d, e) {
  function f() {
    this.lengthKnown = !1;
    this.chunks = [];
  }
  function h(l, m, t, g, q) {
    l = l.node.contents;
    if (q >= l.length) {
      return 0;
    }
    g = Math.min(l.length - q, g);
    if (l.slice) {
      for (var r = 0; r < g; r++) {
        m[t + r] = l[q + r];
      }
    } else {
      for (r = 0; r < g; r++) {
        m[t + r] = l.get(q + r);
      }
    }
    return g;
  }
  f.prototype.get = function(l) {
    if (!(l > this.length - 1 || 0 > l)) {
      var m = l % this.chunkSize;
      return this.getter(l / this.chunkSize | 0)[m];
    }
  };
  f.prototype.setDataGetter = function(l) {
    this.getter = l;
  };
  f.prototype.cacheLength = function() {
    var l = new XMLHttpRequest();
    l.open("HEAD", c, !1);
    l.send(null);
    if (!(200 <= l.status && 300 > l.status || 304 === l.status)) {
      throw Error("Couldn't load " + c + ". Status: " + l.status);
    }
    var m = Number(l.getResponseHeader("Content-length")), t, g = (t = l.getResponseHeader("Accept-Ranges")) && "bytes" === t;
    l = (t = l.getResponseHeader("Content-Encoding")) && "gzip" === t;
    var q = 1048576;
    g || (q = m);
    var r = this;
    r.setDataGetter(function(v) {
      var u = v * q, x = (v + 1) * q - 1;
      x = Math.min(x, m - 1);
      if ("undefined" == typeof r.chunks[v]) {
        var y = r.chunks;
        if (u > x) {
          throw Error("invalid range (" + u + ", " + x + ") or no bytes requested!");
        }
        if (x > m - 1) {
          throw Error("only " + m + " bytes available! programmer error!");
        }
        var w = new XMLHttpRequest();
        w.open("GET", c, !1);
        m !== q && w.setRequestHeader("Range", "bytes=" + u + "-" + x);
        w.responseType = "arraybuffer";
        w.overrideMimeType && w.overrideMimeType("text/plain; charset=x-user-defined");
        w.send(null);
        if (!(200 <= w.status && 300 > w.status || 304 === w.status)) {
          throw Error("Couldn't load " + c + ". Status: " + w.status);
        }
        u = void 0 !== w.response ? new Uint8Array(w.response || []) : intArrayFromString(w.responseText || "", !0);
        y[v] = u;
      }
      if ("undefined" == typeof r.chunks[v]) {
        throw Error("doXHR failed!");
      }
      return r.chunks[v];
    });
    if (l || !m) {
      q = m = 1, q = m = this.getter(0).length, out("LazyFiles on gzip forces download of the whole file when length is accessed");
    }
    this._length = m;
    this._chunkSize = q;
    this.lengthKnown = !0;
  };
  if ("undefined" != typeof XMLHttpRequest) {
    if (!ENVIRONMENT_IS_WORKER) {
      throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
    }
    var n = new f();
    Object.defineProperties(n, {length:{get:function() {
      this.lengthKnown || this.cacheLength();
      return this._length;
    }}, chunkSize:{get:function() {
      this.lengthKnown || this.cacheLength();
      return this._chunkSize;
    }}});
    n = {isDevice:!1, contents:n};
  } else {
    n = {isDevice:!1, url:c};
  }
  var p = FS.createFile(a, b, n, d, e);
  n.contents ? p.contents = n.contents : n.url && (p.contents = null, p.url = n.url);
  Object.defineProperties(p, {usedBytes:{get:function() {
    return this.contents.length;
  }}});
  var k = {};
  Object.keys(p.stream_ops).forEach(function(l) {
    var m = p.stream_ops[l];
    k[l] = function() {
      FS.forceLoadFile(p);
      return m.apply(null, arguments);
    };
  });
  k.read = function(l, m, t, g, q) {
    FS.forceLoadFile(p);
    return h(l, m, t, g, q);
  };
  k.mmap = function(l, m, t, g, q) {
    FS.forceLoadFile(p);
    g = mmapAlloc(m);
    if (!g) {
      throw new FS.ErrnoError(48);
    }
    h(l, HEAP8, g, m, t);
    return {ptr:g, allocated:!0};
  };
  p.stream_ops = k;
  return p;
}}, UTF8ToString = function(a, b) {
  return a ? UTF8ArrayToString(HEAPU8, a, b) : "";
}, SYSCALLS = {DEFAULT_POLLMASK:5, calculateAt:function(a, b, c) {
  if (PATH.isAbs(b)) {
    return b;
  }
  a = -100 === a ? FS.cwd() : SYSCALLS.getStreamFromFD(a).path;
  if (0 == b.length) {
    if (!c) {
      throw new FS.ErrnoError(44);
    }
    return a;
  }
  return PATH.join2(a, b);
}, doStat:function(a, b, c) {
  try {
    var d = a(b);
  } catch (f) {
    if (f && f.node && PATH.normalize(b) !== PATH.normalize(FS.getPath(f.node))) {
      return -54;
    }
    throw f;
  }
  HEAP32[c >> 2] = d.dev;
  HEAP32[c + 4 >> 2] = d.mode;
  HEAPU32[c + 8 >> 2] = d.nlink;
  HEAP32[c + 12 >> 2] = d.uid;
  HEAP32[c + 16 >> 2] = d.gid;
  HEAP32[c + 20 >> 2] = d.rdev;
  tempI64 = [d.size >>> 0, (tempDouble = d.size, 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 24 >> 2] = tempI64[0];
  HEAP32[c + 28 >> 2] = tempI64[1];
  HEAP32[c + 32 >> 2] = 4096;
  HEAP32[c + 36 >> 2] = d.blocks;
  a = d.atime.getTime();
  b = d.mtime.getTime();
  var e = d.ctime.getTime();
  tempI64 = [Math.floor(a / 1E3) >>> 0, (tempDouble = Math.floor(a / 1E3), 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 40 >> 2] = tempI64[0];
  HEAP32[c + 44 >> 2] = tempI64[1];
  HEAPU32[c + 48 >> 2] = a % 1E3 * 1E3;
  tempI64 = [Math.floor(b / 1E3) >>> 0, (tempDouble = Math.floor(b / 1E3), 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 56 >> 2] = tempI64[0];
  HEAP32[c + 60 >> 2] = tempI64[1];
  HEAPU32[c + 64 >> 2] = b % 1E3 * 1E3;
  tempI64 = [Math.floor(e / 1E3) >>> 0, (tempDouble = Math.floor(e / 1E3), 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 72 >> 2] = tempI64[0];
  HEAP32[c + 76 >> 2] = tempI64[1];
  HEAPU32[c + 80 >> 2] = e % 1E3 * 1E3;
  tempI64 = [d.ino >>> 0, (tempDouble = d.ino, 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 88 >> 2] = tempI64[0];
  HEAP32[c + 92 >> 2] = tempI64[1];
  return 0;
}, doMsync:function(a, b, c, d, e) {
  if (!FS.isFile(b.node.mode)) {
    throw new FS.ErrnoError(43);
  }
  if (d & 2) {
    return 0;
  }
  a = HEAPU8.slice(a, a + c);
  FS.msync(b, a, e, c, d);
}, varargs:void 0, get:function() {
  var a = HEAP32[+SYSCALLS.varargs >> 2];
  SYSCALLS.varargs += 4;
  return a;
}, getp:function() {
  return SYSCALLS.get();
}, getStr:function(a) {
  return UTF8ToString(a);
}, getStreamFromFD:function(a) {
  return FS.getStreamChecked(a);
}}, _environ_get = function(a, b) {
  var c = 0;
  getEnvStrings().forEach(function(d, e) {
    var f = b + c;
    HEAPU32[a + 4 * e >> 2] = f;
    stringToAscii(d, f);
    c += d.length + 1;
  });
  return 0;
}, _environ_sizes_get = function(a, b) {
  var c = getEnvStrings();
  HEAPU32[a >> 2] = c.length;
  var d = 0;
  c.forEach(function(e) {
    return d += e.length + 1;
  });
  HEAPU32[b >> 2] = d;
  return 0;
};
function _fd_close(a) {
  try {
    var b = SYSCALLS.getStreamFromFD(a);
    FS.close(b);
    return 0;
  } catch (c) {
    if ("undefined" == typeof FS || "ErrnoError" !== c.name) {
      throw c;
    }
    return c.errno;
  }
}
var doReadv = function(a, b, c, d) {
  for (var e = 0, f = 0; f < c; f++) {
    var h = HEAPU32[b >> 2], n = HEAPU32[b + 4 >> 2];
    b += 8;
    h = FS.read(a, HEAP8, h, n, d);
    if (0 > h) {
      return -1;
    }
    e += h;
    if (h < n) {
      break;
    }
    "undefined" !== typeof d && (d += h);
  }
  return e;
};
function _fd_read(a, b, c, d) {
  try {
    var e = SYSCALLS.getStreamFromFD(a), f = doReadv(e, b, c);
    HEAPU32[d >> 2] = f;
    return 0;
  } catch (h) {
    if ("undefined" == typeof FS || "ErrnoError" !== h.name) {
      throw h;
    }
    return h.errno;
  }
}
var convertI32PairToI53Checked = function(a, b) {
  return b + 2097152 >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * b : NaN;
};
function _fd_seek(a, b, c, d, e) {
  b = convertI32PairToI53Checked(b, c);
  try {
    if (isNaN(b)) {
      return 61;
    }
    var f = SYSCALLS.getStreamFromFD(a);
    FS.llseek(f, b, d);
    tempI64 = [f.position >>> 0, (tempDouble = f.position, 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
    HEAP32[e >> 2] = tempI64[0];
    HEAP32[e + 4 >> 2] = tempI64[1];
    f.getdents && 0 === b && 0 === d && (f.getdents = null);
    return 0;
  } catch (h) {
    if ("undefined" == typeof FS || "ErrnoError" !== h.name) {
      throw h;
    }
    return h.errno;
  }
}
var doWritev = function(a, b, c, d) {
  for (var e = 0, f = 0; f < c; f++) {
    var h = HEAPU32[b >> 2], n = HEAPU32[b + 4 >> 2];
    b += 8;
    h = FS.write(a, HEAP8, h, n, d);
    if (0 > h) {
      return -1;
    }
    e += h;
    "undefined" !== typeof d && (d += h);
  }
  return e;
};
function _fd_write(a, b, c, d) {
  try {
    var e = SYSCALLS.getStreamFromFD(a), f = doWritev(e, b, c);
    HEAPU32[d >> 2] = f;
    return 0;
  } catch (h) {
    if ("undefined" == typeof FS || "ErrnoError" !== h.name) {
      throw h;
    }
    return h.errno;
  }
}
var isLeapYear = function(a) {
  return 0 === a % 4 && (0 !== a % 100 || 0 === a % 400);
}, arraySum = function(a, b) {
  for (var c = 0, d = 0; d <= b; c += a[d++]) {
  }
  return c;
}, MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], addDays = function(a, b) {
  for (a = new Date(a.getTime()); 0 < b;) {
    var c = isLeapYear(a.getFullYear()), d = a.getMonth();
    c = (c ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR)[d];
    if (b > c - a.getDate()) {
      b -= c - a.getDate() + 1, a.setDate(1), 11 > d ? a.setMonth(d + 1) : (a.setMonth(0), a.setFullYear(a.getFullYear() + 1));
    } else {
      a.setDate(a.getDate() + b);
      break;
    }
  }
  return a;
}, writeArrayToMemory = function(a, b) {
  HEAP8.set(a, b);
}, _strftime = function(a, b, c, d) {
  function e(g, q, r) {
    for (g = "number" == typeof g ? g.toString() : g || ""; g.length < q;) {
      g = r[0] + g;
    }
    return g;
  }
  function f(g, q) {
    return e(g, q, "0");
  }
  function h(g, q) {
    function r(u) {
      return 0 > u ? -1 : 0 < u ? 1 : 0;
    }
    var v;
    0 === (v = r(g.getFullYear() - q.getFullYear())) && 0 === (v = r(g.getMonth() - q.getMonth())) && (v = r(g.getDate() - q.getDate()));
    return v;
  }
  function n(g) {
    switch(g.getDay()) {
      case 0:
        return new Date(g.getFullYear() - 1, 11, 29);
      case 1:
        return g;
      case 2:
        return new Date(g.getFullYear(), 0, 3);
      case 3:
        return new Date(g.getFullYear(), 0, 2);
      case 4:
        return new Date(g.getFullYear(), 0, 1);
      case 5:
        return new Date(g.getFullYear() - 1, 11, 31);
      case 6:
        return new Date(g.getFullYear() - 1, 11, 30);
    }
  }
  function p(g) {
    g = addDays(new Date(g.tm_year + 1900, 0, 1), g.tm_yday);
    var q = new Date(g.getFullYear(), 0, 4), r = new Date(g.getFullYear() + 1, 0, 4);
    q = n(q);
    r = n(r);
    return 0 >= h(q, g) ? 0 >= h(r, g) ? g.getFullYear() + 1 : g.getFullYear() : g.getFullYear() - 1;
  }
  var k = HEAPU32[d + 40 >> 2];
  d = {tm_sec:HEAP32[d >> 2], tm_min:HEAP32[d + 4 >> 2], tm_hour:HEAP32[d + 8 >> 2], tm_mday:HEAP32[d + 12 >> 2], tm_mon:HEAP32[d + 16 >> 2], tm_year:HEAP32[d + 20 >> 2], tm_wday:HEAP32[d + 24 >> 2], tm_yday:HEAP32[d + 28 >> 2], tm_isdst:HEAP32[d + 32 >> 2], tm_gmtoff:HEAP32[d + 36 >> 2], tm_zone:k ? UTF8ToString(k) : ""};
  c = UTF8ToString(c);
  k = {"%c":"%a %b %d %H:%M:%S %Y", "%D":"%m/%d/%y", "%F":"%Y-%m-%d", "%h":"%b", "%r":"%I:%M:%S %p", "%R":"%H:%M", "%T":"%H:%M:%S", "%x":"%m/%d/%y", "%X":"%H:%M:%S", "%Ec":"%c", "%EC":"%C", "%Ex":"%m/%d/%y", "%EX":"%H:%M:%S", "%Ey":"%y", "%EY":"%Y", "%Od":"%d", "%Oe":"%e", "%OH":"%H", "%OI":"%I", "%Om":"%m", "%OM":"%M", "%OS":"%S", "%Ou":"%u", "%OU":"%U", "%OV":"%V", "%Ow":"%w", "%OW":"%W", "%Oy":"%y"};
  for (var l in k) {
    c = c.replace(new RegExp(l, "g"), k[l]);
  }
  var m = "Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "), t = "January February March April May June July August September October November December".split(" ");
  k = {"%a":function(g) {
    return m[g.tm_wday].substring(0, 3);
  }, "%A":function(g) {
    return m[g.tm_wday];
  }, "%b":function(g) {
    return t[g.tm_mon].substring(0, 3);
  }, "%B":function(g) {
    return t[g.tm_mon];
  }, "%C":function(g) {
    return f((g.tm_year + 1900) / 100 | 0, 2);
  }, "%d":function(g) {
    return f(g.tm_mday, 2);
  }, "%e":function(g) {
    return e(g.tm_mday, 2, " ");
  }, "%g":function(g) {
    return p(g).toString().substring(2);
  }, "%G":function(g) {
    return p(g);
  }, "%H":function(g) {
    return f(g.tm_hour, 2);
  }, "%I":function(g) {
    g = g.tm_hour;
    0 == g ? g = 12 : 12 < g && (g -= 12);
    return f(g, 2);
  }, "%j":function(g) {
    return f(g.tm_mday + arraySum(isLeapYear(g.tm_year + 1900) ? MONTH_DAYS_LEAP : MONTH_DAYS_REGULAR, g.tm_mon - 1), 3);
  }, "%m":function(g) {
    return f(g.tm_mon + 1, 2);
  }, "%M":function(g) {
    return f(g.tm_min, 2);
  }, "%n":function() {
    return "\n";
  }, "%p":function(g) {
    return 0 <= g.tm_hour && 12 > g.tm_hour ? "AM" : "PM";
  }, "%S":function(g) {
    return f(g.tm_sec, 2);
  }, "%t":function() {
    return "\t";
  }, "%u":function(g) {
    return g.tm_wday || 7;
  }, "%U":function(g) {
    return f(Math.floor((g.tm_yday + 7 - g.tm_wday) / 7), 2);
  }, "%V":function(g) {
    var q = Math.floor((g.tm_yday + 7 - (g.tm_wday + 6) % 7) / 7);
    2 >= (g.tm_wday + 371 - g.tm_yday - 2) % 7 && q++;
    if (q) {
      53 == q && (r = (g.tm_wday + 371 - g.tm_yday) % 7, 4 == r || 3 == r && isLeapYear(g.tm_year) || (q = 1));
    } else {
      q = 52;
      var r = (g.tm_wday + 7 - g.tm_yday - 1) % 7;
      (4 == r || 5 == r && isLeapYear(g.tm_year % 400 - 1)) && q++;
    }
    return f(q, 2);
  }, "%w":function(g) {
    return g.tm_wday;
  }, "%W":function(g) {
    return f(Math.floor((g.tm_yday + 7 - (g.tm_wday + 6) % 7) / 7), 2);
  }, "%y":function(g) {
    return (g.tm_year + 1900).toString().substring(2);
  }, "%Y":function(g) {
    return g.tm_year + 1900;
  }, "%z":function(g) {
    g = g.tm_gmtoff;
    var q = 0 <= g;
    g = Math.abs(g) / 60;
    return (q ? "+" : "-") + String("0000" + (g / 60 * 100 + g % 60)).slice(-4);
  }, "%Z":function(g) {
    return g.tm_zone;
  }, "%%":function() {
    return "%";
  }};
  c = c.replace(/%%/g, "\x00\x00");
  for (l in k) {
    c.includes(l) && (c = c.replace(new RegExp(l, "g"), k[l](d)));
  }
  c = c.replace(/\0\0/g, "%");
  l = intArrayFromString(c, !1);
  if (l.length > b) {
    return 0;
  }
  writeArrayToMemory(l, a);
  return l.length - 1;
}, _strftime_l = function(a, b, c, d, e) {
  return _strftime(a, b, c, d);
}, runtimeKeepaliveCounter = 0, keepRuntimeAlive = function() {
  return noExitRuntime || 0 < runtimeKeepaliveCounter;
}, _proc_exit = function(a) {
  EXITSTATUS = a;
  if (!keepRuntimeAlive()) {
    if (Module.onExit) {
      Module.onExit(a);
    }
    ABORT = !0;
  }
  quit_(a, new ExitStatus(a));
}, exitJS = function(a, b) {
  EXITSTATUS = a;
  _proc_exit(a);
}, handleException = function(a) {
  if (a instanceof ExitStatus || "unwind" == a) {
    return EXITSTATUS;
  }
  quit_(1, a);
}, stringToUTF8 = function(a, b, c) {
  return stringToUTF8Array(a, HEAPU8, b, c);
}, stringToUTF8OnStack = function(a) {
  var b = lengthBytesUTF8(a) + 1, c = stackAlloc(b);
  stringToUTF8(a, c, b);
  return c;
}, getCFunc = function(a) {
  return Module["_" + a];
}, ccall = function(a, b, c, d, e) {
  e = {string:function(k) {
    var l = 0;
    null !== k && void 0 !== k && 0 !== k && (l = stringToUTF8OnStack(k));
    return l;
  }, array:function(k) {
    var l = stackAlloc(k.length);
    writeArrayToMemory(k, l);
    return l;
  }};
  a = getCFunc(a);
  var f = [], h = 0;
  if (d) {
    for (var n = 0; n < d.length; n++) {
      var p = e[c[n]];
      p ? (0 === h && (h = stackSave()), f[n] = p(d[n])) : f[n] = d[n];
    }
  }
  c = a.apply(null, f);
  return c = function(k) {
    0 !== h && stackRestore(h);
    k = "string" === b ? UTF8ToString(k) : "boolean" === b ? !!k : k;
    return k;
  }(c);
}, cwrap = function(a, b, c, d) {
  var e = !c || c.every(function(f) {
    return "number" === f || "boolean" === f;
  });
  return "string" !== b && e && !d ? getCFunc(a) : function() {
    return ccall(a, b, c, arguments, d);
  };
}, FSNode = function(a, b, c, d) {
  a || (a = this);
  this.parent = a;
  this.mount = a.mount;
  this.mounted = null;
  this.id = FS.nextInode++;
  this.name = b;
  this.mode = c;
  this.node_ops = {};
  this.stream_ops = {};
  this.rdev = d;
}, readMode = 365, writeMode = 146;
Object.defineProperties(FSNode.prototype, {read:{get:function() {
  return (this.mode & readMode) === readMode;
}, set:function(a) {
  a ? this.mode |= readMode : this.mode &= ~readMode;
}}, write:{get:function() {
  return (this.mode & writeMode) === writeMode;
}, set:function(a) {
  a ? this.mode |= writeMode : this.mode &= ~writeMode;
}}, isFolder:{get:function() {
  return FS.isDir(this.mode);
}}, isDevice:{get:function() {
  return FS.isChrdev(this.mode);
}}});
FS.FSNode = FSNode;
FS.createPreloadedFile = FS_createPreloadedFile;
FS.staticInit();
var wasmImports = {__cxa_throw:___cxa_throw, _emscripten_get_now_is_monotonic:__emscripten_get_now_is_monotonic, abort:_abort, emscripten_date_now:_emscripten_date_now, emscripten_get_now:_emscripten_get_now, emscripten_memcpy_js:_emscripten_memcpy_js, emscripten_resize_heap:_emscripten_resize_heap, environ_get:_environ_get, environ_sizes_get:_environ_sizes_get, fd_close:_fd_close, fd_read:_fd_read, fd_seek:_fd_seek, fd_write:_fd_write, memory:wasmMemory, strftime_l:_strftime_l}, wasmExports = createWasm(), 
___wasm_call_ctors = function() {
  return (___wasm_call_ctors = wasmExports.__wasm_call_ctors)();
}, _whot_init_game = Module._whot_init_game = function(a, b, c, d, e, f) {
  return (_whot_init_game = Module._whot_init_game = wasmExports.whot_init_game)(a, b, c, d, e, f);
}, _whot_play_card = Module._whot_play_card = function(a, b) {
  return (_whot_play_card = Module._whot_play_card = wasmExports.whot_play_card)(a, b);
}, _whot_draw_market = Module._whot_draw_market = function() {
  return (_whot_draw_market = Module._whot_draw_market = wasmExports.whot_draw_market)();
}, _whot_bot_turn = Module._whot_bot_turn = function() {
  return (_whot_bot_turn = Module._whot_bot_turn = wasmExports.whot_bot_turn)();
}, _whot_get_state_json = Module._whot_get_state_json = function() {
  return (_whot_get_state_json = Module._whot_get_state_json = wasmExports.whot_get_state_json)();
}, _whot_get_last_message = Module._whot_get_last_message = function() {
  return (_whot_get_last_message = Module._whot_get_last_message = wasmExports.whot_get_last_message)();
}, _whot_get_last_banter = Module._whot_get_last_banter = function() {
  return (_whot_get_last_banter = Module._whot_get_last_banter = wasmExports.whot_get_last_banter)();
}, _whot_serialize_state = Module._whot_serialize_state = function() {
  return (_whot_serialize_state = Module._whot_serialize_state = wasmExports.whot_serialize_state)();
}, _whot_deserialize_state = Module._whot_deserialize_state = function(a) {
  return (_whot_deserialize_state = Module._whot_deserialize_state = wasmExports.whot_deserialize_state)(a);
}, _main = Module._main = function(a, b) {
  return (_main = Module._main = wasmExports.__main_argc_argv)(a, b);
}, ___errno_location = function() {
  return (___errno_location = wasmExports.__errno_location)();
}, stackSave = function() {
  return (stackSave = wasmExports.stackSave)();
}, stackRestore = function(a) {
  return (stackRestore = wasmExports.stackRestore)(a);
}, stackAlloc = function(a) {
  return (stackAlloc = wasmExports.stackAlloc)(a);
}, ___cxa_is_pointer_type = function(a) {
  return (___cxa_is_pointer_type = wasmExports.__cxa_is_pointer_type)(a);
}, dynCall_viijii = Module.dynCall_viijii = function(a, b, c, d, e, f, h) {
  return (dynCall_viijii = Module.dynCall_viijii = wasmExports.dynCall_viijii)(a, b, c, d, e, f, h);
}, dynCall_jiji = Module.dynCall_jiji = function(a, b, c, d, e) {
  return (dynCall_jiji = Module.dynCall_jiji = wasmExports.dynCall_jiji)(a, b, c, d, e);
}, dynCall_iiiiij = Module.dynCall_iiiiij = function(a, b, c, d, e, f, h) {
  return (dynCall_iiiiij = Module.dynCall_iiiiij = wasmExports.dynCall_iiiiij)(a, b, c, d, e, f, h);
}, dynCall_iiiiijj = Module.dynCall_iiiiijj = function(a, b, c, d, e, f, h, n, p) {
  return (dynCall_iiiiijj = Module.dynCall_iiiiijj = wasmExports.dynCall_iiiiijj)(a, b, c, d, e, f, h, n, p);
}, dynCall_iiiiiijj = Module.dynCall_iiiiiijj = function(a, b, c, d, e, f, h, n, p, k) {
  return (dynCall_iiiiiijj = Module.dynCall_iiiiiijj = wasmExports.dynCall_iiiiiijj)(a, b, c, d, e, f, h, n, p, k);
};
Module.ccall = ccall;
Module.cwrap = cwrap;
Module.UTF8ToString = UTF8ToString;
Module.stringToUTF8 = stringToUTF8;
var calledRun;
dependenciesFulfilled = function runCaller() {
  calledRun || run();
  calledRun || (dependenciesFulfilled = runCaller);
};
function callMain(a) {
  a = void 0 === a ? [] : a;
  var b = _main;
  a.unshift(thisProgram);
  var c = a.length, d = stackAlloc(4 * (c + 1)), e = d;
  a.forEach(function(h) {
    HEAPU32[e >> 2] = stringToUTF8OnStack(h);
    e += 4;
  });
  HEAPU32[e >> 2] = 0;
  try {
    var f = b(c, d);
    exitJS(f, !0);
    return f;
  } catch (h) {
    return handleException(h);
  }
}
function run(a) {
  function b() {
    if (!calledRun && (calledRun = !0, Module.calledRun = !0, !ABORT)) {
      initRuntime();
      preMain();
      if (Module.onRuntimeInitialized) {
        Module.onRuntimeInitialized();
      }
      shouldRunNow && callMain(a);
      postRun();
    }
  }
  a = void 0 === a ? arguments_ : a;
  0 < runDependencies || (preRun(), 0 < runDependencies || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
    setTimeout(function() {
      Module.setStatus("");
    }, 1);
    b();
  }, 1)) : b()));
}
if (Module.preInit) {
  for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); 0 < Module.preInit.length;) {
    Module.preInit.pop()();
  }
}
var shouldRunNow = !0;
Module.noInitialRun && (shouldRunNow = !1);
run();

