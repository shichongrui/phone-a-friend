/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(84);
	module.exports = __webpack_require__(81);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var global = typeof self != 'undefined' ? self : Function('return this')()
	  , core   = {}
	  , defineProperty = Object.defineProperty
	  , hasOwnProperty = {}.hasOwnProperty
	  , ceil  = Math.ceil
	  , floor = Math.floor
	  , max   = Math.max
	  , min   = Math.min;
	// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
	var DESC = !!function(){
	  try {
	    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
	  } catch(e){ /* empty */ }
	}();
	var hide = createDefiner(1);
	// 7.1.4 ToInteger
	function toInteger(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	}
	function desc(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	}
	function simpleSet(object, key, value){
	  object[key] = value;
	  return object;
	}
	function createDefiner(bitmap){
	  return DESC ? function(object, key, value){
	    return $.setDesc(object, key, desc(bitmap, value)); // eslint-disable-line no-use-before-define
	  } : simpleSet;
	}
	
	function isObject(it){
	  return it !== null && (typeof it == 'object' || typeof it == 'function');
	}
	function isFunction(it){
	  return typeof it == 'function';
	}
	function assertDefined(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	}
	
	var $ = module.exports = __webpack_require__(33)({
	  g: global,
	  core: core,
	  html: global.document && document.documentElement,
	  // http://jsperf.com/core-js-isobject
	  isObject:   isObject,
	  isFunction: isFunction,
	  it: function(it){
	    return it;
	  },
	  that: function(){
	    return this;
	  },
	  // 7.1.4 ToInteger
	  toInteger: toInteger,
	  // 7.1.15 ToLength
	  toLength: function(it){
	    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	  },
	  toIndex: function(index, length){
	    index = toInteger(index);
	    return index < 0 ? max(index + length, 0) : min(index, length);
	  },
	  has: function(it, key){
	    return hasOwnProperty.call(it, key);
	  },
	  create:     Object.create,
	  getProto:   Object.getPrototypeOf,
	  DESC:       DESC,
	  desc:       desc,
	  getDesc:    Object.getOwnPropertyDescriptor,
	  setDesc:    defineProperty,
	  getKeys:    Object.keys,
	  getNames:   Object.getOwnPropertyNames,
	  getSymbols: Object.getOwnPropertySymbols,
	  // Dummy, fix for not array-like ES3 string in es5 module
	  assertDefined: assertDefined,
	  ES5Object: Object,
	  toObject: function(it){
	    return $.ES5Object(assertDefined(it));
	  },
	  hide: hide,
	  def: createDefiner(0),
	  set: global.Symbol ? simpleSet : hide,
	  mix: function(target, src){
	    for(var key in src)hide(target, key, src[key]);
	    return target;
	  },
	  each: [].forEach
	});
	if(typeof __e != 'undefined')__e = core;
	if(typeof __g != 'undefined')__g = global;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(1)
	  , global     = $.g
	  , core       = $.core
	  , isFunction = $.isFunction;
	function ctx(fn, that){
	  return function(){
	    return fn.apply(that, arguments);
	  };
	}
	global.core = core;
	// type bitmap
	$def.F = 1;  // forced
	$def.G = 2;  // global
	$def.S = 4;  // static
	$def.P = 8;  // proto
	$def.B = 16; // bind
	$def.W = 32; // wrap
	function $def(type, name, source){
	  var key, own, out, exp
	    , isGlobal = type & $def.G
	    , target   = isGlobal ? global : type & $def.S
	        ? global[name] : (global[name] || {}).prototype
	    , exports  = isGlobal ? core : core[name] || (core[name] = {});
	  if(isGlobal)source = name;
	  for(key in source){
	    // contains in native
	    own = !(type & $def.F) && target && key in target;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    if(type & $def.B && own)exp = ctx(out, global);
	    else exp = type & $def.P && isFunction(out) ? ctx(Function.call, out) : out;
	    // extend global
	    if(target && !own){
	      if(isGlobal)target[key] = out;
	      else delete target[key] && $.hide(target, key, out);
	    }
	    // export
	    if(exports[key] != out)$.hide(exports, key, exp);
	  }
	}
	module.exports = $def;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	function assert(condition, msg1, msg2){
	  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
	}
	assert.def = $.assertDefined;
	assert.fn = function(it){
	  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
	  return it;
	};
	assert.obj = function(it){
	  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};
	assert.inst = function(it, Constructor, name){
	  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
	  return it;
	};
	module.exports = assert;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(1)
	  , TAG      = __webpack_require__(8)('toStringTag')
	  , toString = {}.toString;
	function cof(it){
	  return toString.call(it).slice(8, -1);
	}
	cof.classof = function(it){
	  var O, T;
	  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
	};
	cof.set = function(it, tag, stat){
	  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
	};
	module.exports = cof;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	// Optional / simple context binding
	var assertFunction = __webpack_require__(3).fn;
	module.exports = function(fn, that, length){
	  assertFunction(fn);
	  if(~length && that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  } return function(/* ...args */){
	      return fn.apply(that, arguments);
	    };
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $                 = __webpack_require__(1)
	  , ctx               = __webpack_require__(5)
	  , cof               = __webpack_require__(4)
	  , $def              = __webpack_require__(2)
	  , assertObject      = __webpack_require__(3).obj
	  , SYMBOL_ITERATOR   = __webpack_require__(8)('iterator')
	  , FF_ITERATOR       = '@@iterator'
	  , Iterators         = {}
	  , IteratorPrototype = {};
	// Safari has byggy iterators w/o `next`
	var BUGGY = 'keys' in [] && !('next' in [].keys());
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	setIterator(IteratorPrototype, $.that);
	function setIterator(O, value){
	  $.hide(O, SYMBOL_ITERATOR, value);
	  // Add iterator for FF iterator protocol
	  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
	}
	function defineIterator(Constructor, NAME, value, DEFAULT){
	  var proto = Constructor.prototype
	    , iter  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT] || value;
	  // Define iterator
	  if($.FW)setIterator(proto, iter);
	  if(iter !== value){
	    var iterProto = $.getProto(iter.call(new Constructor));
	    // Set @@toStringTag to native iterators
	    cof.set(iterProto, NAME + ' Iterator', true);
	    // FF fix
	    if($.FW)$.has(proto, FF_ITERATOR) && setIterator(iterProto, $.that);
	  }
	  // Plug for library
	  Iterators[NAME] = iter;
	  // FF & v8 fix
	  Iterators[NAME + ' Iterator'] = $.that;
	  return iter;
	}
	function getIterator(it){
	  var Symbol  = $.g.Symbol
	    , ext     = it[Symbol && Symbol.iterator || FF_ITERATOR]
	    , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[cof.classof(it)];
	  return assertObject(getIter.call(it));
	}
	function closeIterator(iterator){
	  var ret = iterator['return'];
	  if(ret !== undefined)assertObject(ret.call(iterator));
	}
	function stepCall(iterator, fn, value, entries){
	  try {
	    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
	  } catch(e){
	    closeIterator(iterator);
	    throw e;
	  }
	}
	var DANGER_CLOSING = true;
	!function(){
	  try {
	    var iter = [1].keys();
	    iter['return'] = function(){ DANGER_CLOSING = false; };
	    Array.from(iter, function(){ throw 2; });
	  } catch(e){ /* empty */ }
	}();
	var $iter = module.exports = {
	  BUGGY: BUGGY,
	  DANGER_CLOSING: DANGER_CLOSING,
	  fail: function(exec){
	    var fail = true;
	    try {
	      var arr  = [[{}, 1]]
	        , iter = arr[SYMBOL_ITERATOR]()
	        , next = iter.next;
	      iter.next = function(){
	        fail = false;
	        return next.call(this);
	      };
	      arr[SYMBOL_ITERATOR] = function(){
	        return iter;
	      };
	      exec(arr);
	    } catch(e){ /* empty */ }
	    return fail;
	  },
	  Iterators: Iterators,
	  prototype: IteratorPrototype,
	  step: function(done, value){
	    return {value: value, done: !!done};
	  },
	  stepCall: stepCall,
	  close: closeIterator,
	  is: function(it){
	    var O      = Object(it)
	      , Symbol = $.g.Symbol
	      , SYM    = Symbol && Symbol.iterator || FF_ITERATOR;
	    return SYM in O || SYMBOL_ITERATOR in O || $.has(Iterators, cof.classof(O));
	  },
	  get: getIterator,
	  set: setIterator,
	  create: function(Constructor, NAME, next, proto){
	    Constructor.prototype = $.create(proto || $iter.prototype, {next: $.desc(1, next)});
	    cof.set(Constructor, NAME + ' Iterator');
	  },
	  define: defineIterator,
	  std: function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
	    function createIter(kind){
	      return function(){
	        return new Constructor(this, kind);
	      };
	    }
	    $iter.create(Constructor, NAME, next);
	    var entries = createIter('key+value')
	      , values  = createIter('value')
	      , proto   = Base.prototype
	      , methods, key;
	    if(DEFAULT == 'value')values = defineIterator(Base, NAME, values, 'values');
	    else entries = defineIterator(Base, NAME, entries, 'entries');
	    if(DEFAULT){
	      methods = {
	        entries: entries,
	        keys:    IS_SET ? values : createIter('key'),
	        values:  values
	      };
	      $def($def.P + $def.F * BUGGY, NAME, methods);
	      if(FORCE)for(key in methods){
	        if(!(key in proto))$.hide(proto, key, methods[key]);
	      }
	    }
	  },
	  forOf: function(iterable, entries, fn, that){
	    var iterator = getIterator(iterable)
	      , f = ctx(fn, that, entries ? 2 : 1)
	      , step;
	    while(!(step = iterator.next()).done){
	      if(stepCall(iterator, f, step.value, entries) === false){
	        return closeIterator(iterator);
	      }
	    }
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var sid = 0;
	function uid(key){
	  return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);
	}
	uid.safe = __webpack_require__(1).g.Symbol || uid;
	module.exports = uid;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(1).g
	  , store  = {};
	module.exports = function(name){
	  return store[name] || (store[name] =
	    global.Symbol && global.Symbol[name] || __webpack_require__(7).safe('Symbol.' + name));
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// 22.1.3.31 Array.prototype[@@unscopables]
	var $           = __webpack_require__(1)
	  , UNSCOPABLES = __webpack_require__(8)('unscopables');
	if($.FW && !(UNSCOPABLES in []))$.hide(Array.prototype, UNSCOPABLES, {});
	module.exports = function(key){
	  if($.FW)[][UNSCOPABLES][key] = true;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var defaultConfig = {'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]};
	var dataCount = 1;
	
	var BinaryPack = __webpack_require__(29);
	var RTCPeerConnection = __webpack_require__(15).RTCPeerConnection;
	
	var util = {
	  noop: function() {},
	
	  CLOUD_HOST: '0.peerjs.com',
	  CLOUD_PORT: 9000,
	
	  // Browsers that need chunking:
	  chunkedBrowsers: {'Chrome': 1},
	  chunkedMTU: 16300, // The original 60000 bytes setting does not work when sending data from Firefox to Chrome, which is "cut off" after 16384 bytes and delivered individually.
	
	  // Logging logic
	  logLevel: 0,
	  setLogLevel: function(level) {
	    var debugLevel = parseInt(level, 10);
	    if (!isNaN(parseInt(level, 10))) {
	      util.logLevel = debugLevel;
	    } else {
	      // If they are using truthy/falsy values for debug
	      util.logLevel = level ? 3 : 0;
	    }
	    util.log = util.warn = util.error = util.noop;
	    if (util.logLevel > 0) {
	      util.error = util._printWith('ERROR');
	    }
	    if (util.logLevel > 1) {
	      util.warn = util._printWith('WARNING');
	    }
	    if (util.logLevel > 2) {
	      util.log = util._print;
	    }
	  },
	  setLogFunction: function(fn) {
	    if (fn.constructor !== Function) {
	      util.warn('The log function you passed in is not a function. Defaulting to regular logs.');
	    } else {
	      util._print = fn;
	    }
	  },
	
	  _printWith: function(prefix) {
	    return function() {
	      var copy = Array.prototype.slice.call(arguments);
	      copy.unshift(prefix);
	      util._print.apply(util, copy);
	    };
	  },
	  _print: function () {
	    var err = false;
	    var copy = Array.prototype.slice.call(arguments);
	    copy.unshift('PeerJS: ');
	    for (var i = 0, l = copy.length; i < l; i++){
	      if (copy[i] instanceof Error) {
	        copy[i] = '(' + copy[i].name + ') ' + copy[i].message;
	        err = true;
	      }
	    }
	    err ? console.error.apply(console, copy) : console.log.apply(console, copy);
	  },
	  //
	
	  // Returns browser-agnostic default config
	  defaultConfig: defaultConfig,
	  //
	
	  // Returns the current browser.
	  browser: (function() {
	    if (window.mozRTCPeerConnection) {
	      return 'Firefox';
	    } else if (window.webkitRTCPeerConnection) {
	      return 'Chrome';
	    } else if (window.RTCPeerConnection) {
	      return 'Supported';
	    } else {
	      return 'Unsupported';
	    }
	  })(),
	  //
	
	  // Lists which features are supported
	  supports: (function() {
	    if (typeof RTCPeerConnection === 'undefined') {
	      return {};
	    }
	
	    var data = true;
	    var audioVideo = true;
	
	    var binaryBlob = false;
	    var sctp = false;
	    var onnegotiationneeded = !!window.webkitRTCPeerConnection;
	
	    var pc, dc;
	    try {
	      pc = new RTCPeerConnection(defaultConfig, {optional: [{RtpDataChannels: true}]});
	    } catch (e) {
	      data = false;
	      audioVideo = false;
	    }
	
	    if (data) {
	      try {
	        dc = pc.createDataChannel('_PEERJSTEST');
	      } catch (e) {
	        data = false;
	      }
	    }
	
	    if (data) {
	      // Binary test
	      try {
	        dc.binaryType = 'blob';
	        binaryBlob = true;
	      } catch (e) {
	      }
	
	      // Reliable test.
	      // Unfortunately Chrome is a bit unreliable about whether or not they
	      // support reliable.
	      var reliablePC = new RTCPeerConnection(defaultConfig, {});
	      try {
	        var reliableDC = reliablePC.createDataChannel('_PEERJSRELIABLETEST', {});
	        sctp = reliableDC.reliable;
	      } catch (e) {
	      }
	      reliablePC.close();
	    }
	
	    // FIXME: not really the best check...
	    if (audioVideo) {
	      audioVideo = !!pc.addStream;
	    }
	
	    // FIXME: this is not great because in theory it doesn't work for
	    // av-only browsers (?).
	    if (!onnegotiationneeded && data) {
	      // sync default check.
	      var negotiationPC = new RTCPeerConnection(defaultConfig, {optional: [{RtpDataChannels: true}]});
	      negotiationPC.onnegotiationneeded = function() {
	        onnegotiationneeded = true;
	        // async check.
	        if (util && util.supports) {
	          util.supports.onnegotiationneeded = true;
	        }
	      };
	      negotiationPC.createDataChannel('_PEERJSNEGOTIATIONTEST');
	
	      setTimeout(function() {
	        negotiationPC.close();
	      }, 1000);
	    }
	
	    if (pc) {
	      pc.close();
	    }
	
	    return {
	      audioVideo: audioVideo,
	      data: data,
	      binaryBlob: binaryBlob,
	      binary: sctp, // deprecated; sctp implies binary support.
	      reliable: sctp, // deprecated; sctp implies reliable data.
	      sctp: sctp,
	      onnegotiationneeded: onnegotiationneeded
	    };
	  }()),
	  //
	
	  // Ensure alphanumeric ids
	  validateId: function(id) {
	    // Allow empty ids
	    return !id || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.exec(id);
	  },
	
	  validateKey: function(key) {
	    // Allow empty keys
	    return !key || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.exec(key);
	  },
	
	
	  debug: false,
	
	  inherits: function(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  },
	  extend: function(dest, source) {
	    for(var key in source) {
	      if(source.hasOwnProperty(key)) {
	        dest[key] = source[key];
	      }
	    }
	    return dest;
	  },
	  pack: BinaryPack.pack,
	  unpack: BinaryPack.unpack,
	
	  log: function () {
	    if (util.debug) {
	      var err = false;
	      var copy = Array.prototype.slice.call(arguments);
	      copy.unshift('PeerJS: ');
	      for (var i = 0, l = copy.length; i < l; i++){
	        if (copy[i] instanceof Error) {
	          copy[i] = '(' + copy[i].name + ') ' + copy[i].message;
	          err = true;
	        }
	      }
	      err ? console.error.apply(console, copy) : console.log.apply(console, copy);
	    }
	  },
	
	  setZeroTimeout: (function(global) {
	    var timeouts = [];
	    var messageName = 'zero-timeout-message';
	
	    // Like setTimeout, but only takes a function argument.	 There's
	    // no time argument (always zero) and no arguments (you have to
	    // use a closure).
	    function setZeroTimeoutPostMessage(fn) {
	      timeouts.push(fn);
	      global.postMessage(messageName, '*');
	    }
	
	    function handleMessage(event) {
	      if (event.source == global && event.data == messageName) {
	        if (event.stopPropagation) {
	          event.stopPropagation();
	        }
	        if (timeouts.length) {
	          timeouts.shift()();
	        }
	      }
	    }
	    if (global.addEventListener) {
	      global.addEventListener('message', handleMessage, true);
	    } else if (global.attachEvent) {
	      global.attachEvent('onmessage', handleMessage);
	    }
	    return setZeroTimeoutPostMessage;
	  }(window)),
	
	  // Binary stuff
	
	  // chunks a blob.
	  chunk: function(bl) {
	    var chunks = [];
	    var size = bl.size;
	    var start = index = 0;
	    var total = Math.ceil(size / util.chunkedMTU);
	    while (start < size) {
	      var end = Math.min(size, start + util.chunkedMTU);
	      var b = bl.slice(start, end);
	
	      var chunk = {
	        __peerData: dataCount,
	        n: index,
	        data: b,
	        total: total
	      };
	
	      chunks.push(chunk);
	
	      start = end;
	      index += 1;
	    }
	    dataCount += 1;
	    return chunks;
	  },
	
	  blobToArrayBuffer: function(blob, cb){
	    var fr = new FileReader();
	    fr.onload = function(evt) {
	      cb(evt.target.result);
	    };
	    fr.readAsArrayBuffer(blob);
	  },
	  blobToBinaryString: function(blob, cb){
	    var fr = new FileReader();
	    fr.onload = function(evt) {
	      cb(evt.target.result);
	    };
	    fr.readAsBinaryString(blob);
	  },
	  binaryStringToArrayBuffer: function(binary) {
	    var byteArray = new Uint8Array(binary.length);
	    for (var i = 0; i < binary.length; i++) {
	      byteArray[i] = binary.charCodeAt(i) & 0xff;
	    }
	    return byteArray.buffer;
	  },
	  randomToken: function () {
	    return Math.random().toString(36).substr(2);
	  },
	  //
	
	  isSecure: function() {
	    return location.protocol === 'https:';
	  }
	};
	
	module.exports = util;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var $   = __webpack_require__(1)
	  , ctx = __webpack_require__(5);
	module.exports = function(TYPE){
	  var IS_MAP        = TYPE == 1
	    , IS_FILTER     = TYPE == 2
	    , IS_SOME       = TYPE == 3
	    , IS_EVERY      = TYPE == 4
	    , IS_FIND_INDEX = TYPE == 6
	    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
	  return function(callbackfn/*, that = undefined */){
	    var O      = Object($.assertDefined(this))
	      , self   = $.ES5Object(O)
	      , f      = ctx(callbackfn, arguments[1], 3)
	      , length = $.toLength(self.length)
	      , index  = 0
	      , result = IS_MAP ? Array(length) : IS_FILTER ? [] : undefined
	      , val, res;
	    for(;length > index; index++)if(NO_HOLES || index in self){
	      val = self[index];
	      res = f(val, index, O);
	      if(TYPE){
	        if(IS_MAP)result[index] = res;            // map
	        else if(res)switch(TYPE){
	          case 3: return true;                    // some
	          case 5: return val;                     // find
	          case 6: return index;                   // findIndex
	          case 2: result.push(val);               // filter
	        } else if(IS_EVERY)return false;          // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $     = __webpack_require__(1)
	  , $def  = __webpack_require__(2)
	  , $iter = __webpack_require__(6)
	  , assertInstance = __webpack_require__(3).inst;
	
	module.exports = function(NAME, methods, common, IS_MAP, isWeak){
	  var Base  = $.g[NAME]
	    , C     = Base
	    , ADDER = IS_MAP ? 'set' : 'add'
	    , proto = C && C.prototype
	    , O     = {};
	  function fixMethod(KEY, CHAIN){
	    var method = proto[KEY];
	    if($.FW)proto[KEY] = function(a, b){
	      var result = method.call(this, a === 0 ? 0 : a, b);
	      return CHAIN ? this : result;
	    };
	  }
	  if(!$.isFunction(C) || !(isWeak || !$iter.BUGGY && proto.forEach && proto.entries)){
	    // create collection constructor
	    C = common.getConstructor(NAME, IS_MAP, ADDER);
	    $.mix(C.prototype, methods);
	  } else {
	    var inst  = new C
	      , chain = inst[ADDER](isWeak ? {} : -0, 1)
	      , buggyZero;
	    // wrap for init collections from iterable
	    if($iter.fail(function(iter){
	      new C(iter); // eslint-disable-line no-new
	    }) || $iter.DANGER_CLOSING){
	      C = function(iterable){
	        assertInstance(this, C, NAME);
	        var that = new Base;
	        if(iterable != undefined)$iter.forOf(iterable, IS_MAP, that[ADDER], that);
	        return that;
	      };
	      C.prototype = proto;
	      if($.FW)proto.constructor = C;
	    }
	    isWeak || inst.forEach(function(val, key){
	      buggyZero = 1 / key === -Infinity;
	    });
	    // fix converting -0 key to +0
	    if(buggyZero){
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }
	    // + fix .add & .set for chaining
	    if(buggyZero || chain !== inst)fixMethod(ADDER, true);
	  }
	
	  __webpack_require__(4).set(C, NAME);
	  __webpack_require__(14)(C);
	
	  O[NAME] = C;
	  $def($def.G + $def.W + $def.F * (C != Base), O);
	
	  // add .keys, .values, .entries, [@@iterator]
	  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	  if(!isWeak)$iter.std(
	    C, NAME,
	    common.getIterConstructor(), common.next,
	    IS_MAP ? 'key+value' : 'value' , !IS_MAP, true
	  );
	
	  return C;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// Fast apply
	// http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
	                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
	  } return              fn.apply(that, args);
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	module.exports = function(C){
	  if($.DESC && $.FW)$.setDesc(C, __webpack_require__(8)('species'), {
	    configurable: true,
	    get: $.that
	  });
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports.RTCSessionDescription = window.RTCSessionDescription ||
		window.mozRTCSessionDescription;
	module.exports.RTCPeerConnection = window.RTCPeerConnection ||
		window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	module.exports.RTCIceCandidate = window.RTCIceCandidate ||
		window.mozRTCIceCandidate;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Representation of a single EventEmitter function.
	 *
	 * @param {Function} fn Event handler to be called.
	 * @param {Mixed} context Context for function execution.
	 * @param {Boolean} once Only emit once
	 * @api private
	 */
	function EE(fn, context, once) {
	  this.fn = fn;
	  this.context = context;
	  this.once = once || false;
	}
	
	/**
	 * Minimal EventEmitter interface that is molded against the Node.js
	 * EventEmitter interface.
	 *
	 * @constructor
	 * @api public
	 */
	function EventEmitter() { /* Nothing to set */ }
	
	/**
	 * Holds the assigned EventEmitters by name.
	 *
	 * @type {Object}
	 * @private
	 */
	EventEmitter.prototype._events = undefined;
	
	/**
	 * Return a list of assigned event listeners.
	 *
	 * @param {String} event The events that should be listed.
	 * @returns {Array}
	 * @api public
	 */
	EventEmitter.prototype.listeners = function listeners(event) {
	  if (!this._events || !this._events[event]) return [];
	  if (this._events[event].fn) return [this._events[event].fn];
	
	  for (var i = 0, l = this._events[event].length, ee = new Array(l); i < l; i++) {
	    ee[i] = this._events[event][i].fn;
	  }
	
	  return ee;
	};
	
	/**
	 * Emit an event to all registered event listeners.
	 *
	 * @param {String} event The name of the event.
	 * @returns {Boolean} Indication if we've emitted an event.
	 * @api public
	 */
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
	  if (!this._events || !this._events[event]) return false;
	
	  var listeners = this._events[event]
	    , len = arguments.length
	    , args
	    , i;
	
	  if ('function' === typeof listeners.fn) {
	    if (listeners.once) this.removeListener(event, listeners.fn, true);
	
	    switch (len) {
	      case 1: return listeners.fn.call(listeners.context), true;
	      case 2: return listeners.fn.call(listeners.context, a1), true;
	      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
	      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
	      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
	      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
	    }
	
	    for (i = 1, args = new Array(len -1); i < len; i++) {
	      args[i - 1] = arguments[i];
	    }
	
	    listeners.fn.apply(listeners.context, args);
	  } else {
	    var length = listeners.length
	      , j;
	
	    for (i = 0; i < length; i++) {
	      if (listeners[i].once) this.removeListener(event, listeners[i].fn, true);
	
	      switch (len) {
	        case 1: listeners[i].fn.call(listeners[i].context); break;
	        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
	        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
	        default:
	          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
	            args[j - 1] = arguments[j];
	          }
	
	          listeners[i].fn.apply(listeners[i].context, args);
	      }
	    }
	  }
	
	  return true;
	};
	
	/**
	 * Register a new EventListener for the given event.
	 *
	 * @param {String} event Name of the event.
	 * @param {Functon} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.on = function on(event, fn, context) {
	  var listener = new EE(fn, context || this);
	
	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Add an EventListener that's only called once.
	 *
	 * @param {String} event Name of the event.
	 * @param {Function} fn Callback function.
	 * @param {Mixed} context The context of the function.
	 * @api public
	 */
	EventEmitter.prototype.once = function once(event, fn, context) {
	  var listener = new EE(fn, context || this, true);
	
	  if (!this._events) this._events = {};
	  if (!this._events[event]) this._events[event] = listener;
	  else {
	    if (!this._events[event].fn) this._events[event].push(listener);
	    else this._events[event] = [
	      this._events[event], listener
	    ];
	  }
	
	  return this;
	};
	
	/**
	 * Remove event listeners.
	 *
	 * @param {String} event The event we want to remove.
	 * @param {Function} fn The listener that we need to find.
	 * @param {Boolean} once Only remove once listeners.
	 * @api public
	 */
	EventEmitter.prototype.removeListener = function removeListener(event, fn, once) {
	  if (!this._events || !this._events[event]) return this;
	
	  var listeners = this._events[event]
	    , events = [];
	
	  if (fn) {
	    if (listeners.fn && (listeners.fn !== fn || (once && !listeners.once))) {
	      events.push(listeners);
	    }
	    if (!listeners.fn) for (var i = 0, length = listeners.length; i < length; i++) {
	      if (listeners[i].fn !== fn || (once && !listeners[i].once)) {
	        events.push(listeners[i]);
	      }
	    }
	  }
	
	  //
	  // Reset the array, or remove it completely if we have no more listeners.
	  //
	  if (events.length) {
	    this._events[event] = events.length === 1 ? events[0] : events;
	  } else {
	    delete this._events[event];
	  }
	
	  return this;
	};
	
	/**
	 * Remove all listeners or only the listeners for the specified event.
	 *
	 * @param {String} event The event want to remove all listeners for.
	 * @api public
	 */
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
	  if (!this._events) return this;
	
	  if (event) delete this._events[event];
	  else this._events = {};
	
	  return this;
	};
	
	//
	// Alias methods names because people roll like that.
	//
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	
	//
	// This function doesn't apply anymore.
	//
	EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
	  return this;
	};
	
	//
	// Expose the module.
	//
	EventEmitter.EventEmitter = EventEmitter;
	EventEmitter.EventEmitter2 = EventEmitter;
	EventEmitter.EventEmitter3 = EventEmitter;
	
	//
	// Expose the module.
	//
	module.exports = EventEmitter;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	module.exports = function(regExp, replace, isStatic){
	  var replacer = replace === Object(replace) ? function(part){
	    return replace[part];
	  } : replace;
	  return function(it){
	    return String(isStatic ? it : this).replace(regExp, replacer);
	  };
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// true  -> String#at
	// false -> String#codePointAt
	var $ = __webpack_require__(1);
	module.exports = function(TO_STRING){
	  return function(pos){
	    var s = String($.assertDefined(this))
	      , i = $.toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l
	      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	        ? TO_STRING ? s.charAt(i) : a
	        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// false -> Array#indexOf
	// true  -> Array#includes
	var $ = __webpack_require__(1);
	module.exports = function(IS_INCLUDES){
	  return function(el /*, fromIndex = 0 */){
	    var O      = $.toObject(this)
	      , length = $.toLength(O.length)
	      , index  = $.toIndex(arguments[1], length)
	      , value;
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $        = __webpack_require__(1)
	  , ctx      = __webpack_require__(5)
	  , safe     = __webpack_require__(7).safe
	  , assert   = __webpack_require__(3)
	  , $iter    = __webpack_require__(6)
	  , has      = $.has
	  , set      = $.set
	  , isObject = $.isObject
	  , hide     = $.hide
	  , step     = $iter.step
	  , isFrozen = Object.isFrozen || $.core.Object.isFrozen
	  , ID       = safe('id')
	  , O1       = safe('O1')
	  , LAST     = safe('last')
	  , FIRST    = safe('first')
	  , ITER     = safe('iter')
	  , SIZE     = $.DESC ? safe('size') : 'size'
	  , id       = 0;
	
	function fastKey(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
	  // can't set id to frozen object
	  if(isFrozen(it))return 'F';
	  if(!has(it, ID)){
	    // not necessary to add id
	    if(!create)return 'E';
	    // add missing object id
	    hide(it, ID, ++id);
	  // return object id with prefix
	  } return 'O' + it[ID];
	}
	
	function getEntry(that, key){
	  // fast case
	  var index = fastKey(key), entry;
	  if(index != 'F')return that[O1][index];
	  // frozen object case
	  for(entry = that[FIRST]; entry; entry = entry.n){
	    if(entry.k == key)return entry;
	  }
	}
	
	module.exports = {
	  getConstructor: function(NAME, IS_MAP, ADDER){
	    function C(iterable){
	      var that = assert.inst(this, C, NAME);
	      set(that, O1, $.create(null));
	      set(that, SIZE, 0);
	      set(that, LAST, undefined);
	      set(that, FIRST, undefined);
	      if(iterable != undefined)$iter.forOf(iterable, IS_MAP, that[ADDER], that);
	    }
	    $.mix(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function(){
	        for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
	          entry.r = true;
	          if(entry.p)entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that[FIRST] = that[LAST] = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function(key){
	        var that  = this
	          , entry = getEntry(that, key);
	        if(entry){
	          var next = entry.n
	            , prev = entry.p;
	          delete that[O1][entry.i];
	          entry.r = true;
	          if(prev)prev.n = next;
	          if(next)next.p = prev;
	          if(that[FIRST] == entry)that[FIRST] = next;
	          if(that[LAST] == entry)that[LAST] = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function(callbackfn /*, that = undefined */){
	        var f = ctx(callbackfn, arguments[1], 3)
	          , entry;
	        while(entry = entry ? entry.n : this[FIRST]){
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while(entry && entry.r)entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function(key){
	        return !!getEntry(this, key);
	      }
	    });
	    if($.DESC)$.setDesc(C.prototype, 'size', {
	      get: function(){
	        return assert.def(this[SIZE]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    var entry = getEntry(that, key)
	      , prev, index;
	    // change existing entry
	    if(entry){
	      entry.v = value;
	    // create new entry
	    } else {
	      that[LAST] = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that[LAST],          // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if(!that[FIRST])that[FIRST] = entry;
	      if(prev)prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if(index != 'F')that[O1][index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  getIterConstructor: function(){
	    return function(iterated, kind){
	      set(this, ITER, {o: iterated, k: kind});
	    };
	  },
	  next: function(){
	    var iter  = this[ITER]
	      , kind  = iter.k
	      , entry = iter.l;
	    // revert to the last existing entry
	    while(entry && entry.r)entry = entry.p;
	    // get next entry
	    if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
	      // or finish the iteration
	      iter.o = undefined;
	      return step(1);
	    }
	    // return step by kind
	    if(kind == 'key'  )return step(0, entry.k);
	    if(kind == 'value')return step(0, entry.v);
	    return step(0, [entry.k, entry.v]);
	  }
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $         = __webpack_require__(1)
	  , safe      = __webpack_require__(7).safe
	  , assert    = __webpack_require__(3)
	  , forOf     = __webpack_require__(6).forOf
	  , has       = $.has
	  , isObject  = $.isObject
	  , hide      = $.hide
	  , isFrozen  = Object.isFrozen || $.core.Object.isFrozen
	  , id        = 0
	  , ID        = safe('id')
	  , WEAK      = safe('weak')
	  , LEAK      = safe('leak')
	  , method    = __webpack_require__(11)
	  , find      = method(5)
	  , findIndex = method(6);
	function findFrozen(store, key){
	  return find.call(store.array, function(it){
	    return it[0] === key;
	  });
	}
	// fallback for frozen keys
	function leakStore(that){
	  return that[LEAK] || hide(that, LEAK, {
	    array: [],
	    get: function(key){
	      var entry = findFrozen(this, key);
	      if(entry)return entry[1];
	    },
	    has: function(key){
	      return !!findFrozen(this, key);
	    },
	    set: function(key, value){
	      var entry = findFrozen(this, key);
	      if(entry)entry[1] = value;
	      else this.array.push([key, value]);
	    },
	    'delete': function(key){
	      var index = findIndex.call(this.array, function(it){
	        return it[0] === key;
	      });
	      if(~index)this.array.splice(index, 1);
	      return !!~index;
	    }
	  })[LEAK];
	}
	
	module.exports = {
	  getConstructor: function(NAME, IS_MAP, ADDER){
	    function C(iterable){
	      $.set(assert.inst(this, C, NAME), ID, id++);
	      if(iterable != undefined)forOf(iterable, IS_MAP, this[ADDER], this);
	    }
	    $.mix(C.prototype, {
	      // 23.3.3.2 WeakMap.prototype.delete(key)
	      // 23.4.3.3 WeakSet.prototype.delete(value)
	      'delete': function(key){
	        if(!isObject(key))return false;
	        if(isFrozen(key))return leakStore(this)['delete'](key);
	        return has(key, WEAK) && has(key[WEAK], this[ID]) && delete key[WEAK][this[ID]];
	      },
	      // 23.3.3.4 WeakMap.prototype.has(key)
	      // 23.4.3.4 WeakSet.prototype.has(value)
	      has: function(key){
	        if(!isObject(key))return false;
	        if(isFrozen(key))return leakStore(this).has(key);
	        return has(key, WEAK) && has(key[WEAK], this[ID]);
	      }
	    });
	    return C;
	  },
	  def: function(that, key, value){
	    if(isFrozen(assert.obj(key))){
	      leakStore(that).set(key, value);
	    } else {
	      has(key, WEAK) || hide(key, WEAK, {});
	      key[WEAK][that[ID]] = value;
	    } return that;
	  },
	  leakStore: leakStore,
	  WEAK: WEAK,
	  ID: ID
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var $            = __webpack_require__(1)
	  , assertObject = __webpack_require__(3).obj;
	module.exports = function(it){
	  assertObject(it);
	  return $.getSymbols ? $.getNames(it).concat($.getSymbols(it)) : $.getNames(it);
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't works with null proto objects.
	/*eslint-disable no-proto */
	var $      = __webpack_require__(1)
	  , assert = __webpack_require__(3);
	module.exports = Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
	  ? function(buggy, set){
	      try {
	        set = __webpack_require__(5)(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
	        set({}, []);
	      } catch(e){ buggy = true; }
	      return function(O, proto){
	        assert.obj(O);
	        assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }()
	  : undefined);

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $      = __webpack_require__(1)
	  , ctx    = __webpack_require__(5)
	  , cof    = __webpack_require__(4)
	  , invoke = __webpack_require__(13)
	  , global             = $.g
	  , isFunction         = $.isFunction
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , postMessage        = global.postMessage
	  , addEventListener   = global.addEventListener
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	function run(){
	  var id = +this;
	  if($.has(queue, id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	}
	function listner(event){
	  run.call(event.data);
	}
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!isFunction(setTask) || !isFunction(clearTask)){
	  setTask = function(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(isFunction(fn) ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(cof(global.process) == 'process'){
	    defer = function(id){
	      global.process.nextTick(ctx(run, id, 1));
	    };
	  // Modern browsers, skip implementation for WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is object
	  } else if(addEventListener && isFunction(postMessage) && !$.g.importScripts){
	    defer = function(id){
	      postMessage(id, '*');
	    };
	    addEventListener('message', listner, false);
	  // WebWorkers
	  } else if(isFunction(MessageChannel)){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listner;
	    defer = ctx(port.postMessage, port, 1);
	  // IE8-
	  } else if($.g.document && ONREADYSTATECHANGE in document.createElement('script')){
	    defer = function(id){
	      $.html.appendChild(document.createElement('script'))[ONREADYSTATECHANGE] = function(){
	        $.html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var $          = __webpack_require__(1)
	  , setUnscope = __webpack_require__(9)
	  , ITER       = __webpack_require__(7).safe('iter')
	  , $iter      = __webpack_require__(6)
	  , step       = $iter.step
	  , Iterators  = $iter.Iterators;
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	$iter.std(Array, 'Array', function(iterated, kind){
	  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , kind  = iter.k
	    , index = iter.i++;
	  if(!O || index >= O.length){
	    iter.o = undefined;
	    return step(1);
	  }
	  if(kind == 'key'  )return step(0, index);
	  if(kind == 'value')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'value');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	setUnscope('keys');
	setUnscope('values');
	setUnscope('entries');

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj['default'] : obj; };
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.startServer = startServer;
	exports.connectToPeer = connectToPeer;
	exports.sendRequest = sendRequest;
	exports.on = on;
	
	var _Peer = __webpack_require__(88);
	
	var Peer = _interopRequire(_Peer);
	
	var _uuid = __webpack_require__(85);
	
	var uuid = _interopRequire(_uuid);
	
	var peer = null;
	var connections = {};
	var callbacks = {};
	var handlers = {};
	
	function setUpListeners(connection) {
	  return new Promise(function (resolve, reject) {
	    if (!connections[connection.peer]) {
	      connection.on('open', function () {
	        setupReceiver(connection);
	        connections[connection.peer] = connection;
	        resolve(connection.peer);
	      });
	      connection.on('error', function (err) {
	        reject(err);
	      });
	    } else {
	      resolve(connection.peer);
	    }
	  });
	}
	
	function setupReceiver(connection) {
	  connection.on('data', function (data) {
	    if (data.type === 'request') {
	      var request = Object.keys(data.request)[0];
	      handlers[request](data.request, sendResponse.bind(null, data.id, connection));
	    } else if (data.type === 'response') {
	      callbacks[data.id](data.response.errors, data.response);
	      delete callbacks[data.id];
	    }
	  });
	}
	
	function sendResponse(id, connection, data) {
	  var response = {
	    id: id,
	    type: 'response',
	    response: data
	  };
	  connection.send(response);
	}
	
	var peerId;
	
	exports.peerId = peerId;
	
	function startServer(key) {
	  peer = new Peer({
	    key: key
	  });
	
	  peer.on('connection', function (connection) {
	    setUpListeners(connection);
	  });
	
	  return new Promise(function (resolve, reject) {
	    peer.on('open', function (id) {
	      exports.peerId = peerId = id;
	      resolve(id);
	    });
	  });
	}
	
	function connectToPeer(peerId) {
	  var connection = connections[peerId] || peer.connect(peerId);
	  return setUpListeners(connection);
	}
	
	function sendRequest(peerId, data, cb) {
	  if (!connections[peerId]) {
	    return new Error('Connection not established with that id');
	  }
	  data.id = uuid.v1();
	  connections[peerId].send(data);
	  callbacks[data.id] = cb;
	}
	
	function on(requestName, func) {
	  handlers[requestName] = func;
	}

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.sendMessage = sendMessage;
	exports.on = on;
	var handlers = {};
	var workerPromise = Worker();
	
	function Worker() {
	  return new Promise(function (resolve, reject) {
	    if ('serviceWorker' in navigator) {
	      navigator.serviceWorker.register('/peer-assets.sw.js').then(function (registration) {
	        // Registration was successful
	        console.log('ServiceWorker registration successful with scope: ', registration.scope);
	        if (navigator.serviceWorker.controller) {
	          resolve(navigator.serviceWorker.controller);
	        } else {
	          console.log('Reload for service worker to take effect');
	        }
	      })['catch'](function (err) {
	        // registration failed :(
	        console.log('ServiceWorker registration failed: ', err);
	      });
	    }
	  });
	}
	
	window.onmessage = function (event) {
	  if (event.ports.length > 0) {
	    handlers[event.data.request](event.data.data).then(function (data) {
	      event.ports[0].postMessage({ data: data });
	    });
	  }
	};
	
	window.onbeforeunload = function () {
	  sendMessage({
	    request: 'ready',
	    ready: false
	  });
	};
	
	function sendMessage(data) {
	  return workerPromise.then(function () {
	    return new Promise(function (resolve, reject) {
	      var messageChannel = new MessageChannel();
	      messageChannel.port1.onmessage = function (event) {
	        if (event.data.error) {
	          reject(event.data.error);
	        } else {
	          resolve(event.data);
	        }
	      };
	      // This sends the message data as well as transferring messageChannel.port2 to the service worker.
	      // The service worker can then use the transferred port to reply via postMessage(), which
	      // will in turn trigger the onmessage handler on messageChannel.port1.
	      // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
	      navigator.serviceWorker.controller.postMessage(data, [messageChannel.port2]);
	    });
	  });
	}
	
	function on(name, func) {
	  handlers[name] = func;
	}

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(10);
	var RTCPeerConnection = __webpack_require__(15).RTCPeerConnection;
	var RTCSessionDescription = __webpack_require__(15).RTCSessionDescription;
	var RTCIceCandidate = __webpack_require__(15).RTCIceCandidate;
	
	/**
	 * Manages all negotiations between Peers.
	 */
	var Negotiator = {
	  pcs: {
	    data: {},
	    media: {}
	  }, // type => {peerId: {pc_id: pc}}.
	  //providers: {}, // provider's id => providers (there may be multiple providers/client.
	  queue: [] // connections that are delayed due to a PC being in use.
	}
	
	Negotiator._idPrefix = 'pc_';
	
	/** Returns a PeerConnection object set up correctly (for data, media). */
	Negotiator.startConnection = function(connection, options) {
	  var pc = Negotiator._getPeerConnection(connection, options);
	
	  if (connection.type === 'media' && options._stream) {
	    // Add the stream.
	    pc.addStream(options._stream);
	  }
	
	  // Set the connection's PC.
	  connection.pc = connection.peerConnection = pc;
	  // What do we need to do now?
	  if (options.originator) {
	    if (connection.type === 'data') {
	      // Create the datachannel.
	      var config = {};
	      // Dropping reliable:false support, since it seems to be crashing
	      // Chrome.
	      /*if (util.supports.sctp && !options.reliable) {
	        // If we have canonical reliable support...
	        config = {maxRetransmits: 0};
	      }*/
	      // Fallback to ensure older browsers don't crash.
	      if (!util.supports.sctp) {
	        config = {reliable: options.reliable};
	      }
	      var dc = pc.createDataChannel(connection.label, config);
	      connection.initialize(dc);
	    }
	
	    if (!util.supports.onnegotiationneeded) {
	      Negotiator._makeOffer(connection);
	    }
	  } else {
	    Negotiator.handleSDP('OFFER', connection, options.sdp);
	  }
	}
	
	Negotiator._getPeerConnection = function(connection, options) {
	  if (!Negotiator.pcs[connection.type]) {
	    util.error(connection.type + ' is not a valid connection type. Maybe you overrode the `type` property somewhere.');
	  }
	
	  if (!Negotiator.pcs[connection.type][connection.peer]) {
	    Negotiator.pcs[connection.type][connection.peer] = {};
	  }
	  var peerConnections = Negotiator.pcs[connection.type][connection.peer];
	
	  var pc;
	  // Not multiplexing while FF and Chrome have not-great support for it.
	  /*if (options.multiplex) {
	    ids = Object.keys(peerConnections);
	    for (var i = 0, ii = ids.length; i < ii; i += 1) {
	      pc = peerConnections[ids[i]];
	      if (pc.signalingState === 'stable') {
	        break; // We can go ahead and use this PC.
	      }
	    }
	  } else */
	  if (options.pc) { // Simplest case: PC id already provided for us.
	    pc = Negotiator.pcs[connection.type][connection.peer][options.pc];
	  }
	
	  if (!pc || pc.signalingState !== 'stable') {
	    pc = Negotiator._startPeerConnection(connection);
	  }
	  return pc;
	}
	
	/*
	Negotiator._addProvider = function(provider) {
	  if ((!provider.id && !provider.disconnected) || !provider.socket.open) {
	    // Wait for provider to obtain an ID.
	    provider.on('open', function(id) {
	      Negotiator._addProvider(provider);
	    });
	  } else {
	    Negotiator.providers[provider.id] = provider;
	  }
	}*/
	
	
	/** Start a PC. */
	Negotiator._startPeerConnection = function(connection) {
	  util.log('Creating RTCPeerConnection.');
	
	  var id = Negotiator._idPrefix + util.randomToken();
	  var optional = {};
	
	  if (connection.type === 'data' && !util.supports.sctp) {
	    optional = {optional: [{RtpDataChannels: true}]};
	  } else if (connection.type === 'media') {
	    // Interop req for chrome.
	    optional = {optional: [{DtlsSrtpKeyAgreement: true}]};
	  }
	
	  var pc = new RTCPeerConnection(connection.provider.options.config, optional);
	  Negotiator.pcs[connection.type][connection.peer][id] = pc;
	
	  Negotiator._setupListeners(connection, pc, id);
	
	  return pc;
	}
	
	/** Set up various WebRTC listeners. */
	Negotiator._setupListeners = function(connection, pc, pc_id) {
	  var peerId = connection.peer;
	  var connectionId = connection.id;
	  var provider = connection.provider;
	
	  // ICE CANDIDATES.
	  util.log('Listening for ICE candidates.');
	  pc.onicecandidate = function(evt) {
	    if (evt.candidate) {
	      util.log('Received ICE candidates for:', connection.peer);
	      provider.socket.send({
	        type: 'CANDIDATE',
	        payload: {
	          candidate: evt.candidate,
	          type: connection.type,
	          connectionId: connection.id
	        },
	        dst: peerId
	      });
	    }
	  };
	
	  pc.oniceconnectionstatechange = function() {
	    switch (pc.iceConnectionState) {
	      case 'disconnected':
	      case 'failed':
	        util.log('iceConnectionState is disconnected, closing connections to ' + peerId);
	        connection.close();
	        break;
	      case 'completed':
	        pc.onicecandidate = util.noop;
	        break;
	    }
	  };
	
	  // Fallback for older Chrome impls.
	  pc.onicechange = pc.oniceconnectionstatechange;
	
	  // ONNEGOTIATIONNEEDED (Chrome)
	  util.log('Listening for `negotiationneeded`');
	  pc.onnegotiationneeded = function() {
	    util.log('`negotiationneeded` triggered');
	    if (pc.signalingState == 'stable') {
	      Negotiator._makeOffer(connection);
	    } else {
	      util.log('onnegotiationneeded triggered when not stable. Is another connection being established?');
	    }
	  };
	
	  // DATACONNECTION.
	  util.log('Listening for data channel');
	  // Fired between offer and answer, so options should already be saved
	  // in the options hash.
	  pc.ondatachannel = function(evt) {
	    util.log('Received data channel');
	    var dc = evt.channel;
	    var connection = provider.getConnection(peerId, connectionId);
	    connection.initialize(dc);
	  };
	
	  // MEDIACONNECTION.
	  util.log('Listening for remote stream');
	  pc.onaddstream = function(evt) {
	    util.log('Received remote stream');
	    var stream = evt.stream;
	    var connection = provider.getConnection(peerId, connectionId);
	    // 10/10/2014: looks like in Chrome 38, onaddstream is triggered after
	    // setting the remote description. Our connection object in these cases
	    // is actually a DATA connection, so addStream fails.
	    // TODO: This is hopefully just a temporary fix. We should try to
	    // understand why this is happening.
	    if (connection.type === 'media') {
	      connection.addStream(stream);
	    }
	  };
	}
	
	Negotiator.cleanup = function(connection) {
	  util.log('Cleaning up PeerConnection to ' + connection.peer);
	
	  var pc = connection.pc;
	
	  if (!!pc && (pc.readyState !== 'closed' || pc.signalingState !== 'closed')) {
	    pc.close();
	    connection.pc = null;
	  }
	}
	
	Negotiator._makeOffer = function(connection) {
	  var pc = connection.pc;
	  pc.createOffer(function(offer) {
	    util.log('Created offer.');
	
	    if (!util.supports.sctp && connection.type === 'data' && connection.reliable) {
	      offer.sdp = Reliable.higherBandwidthSDP(offer.sdp);
	    }
	
	    pc.setLocalDescription(offer, function() {
	      util.log('Set localDescription: offer', 'for:', connection.peer);
	      connection.provider.socket.send({
	        type: 'OFFER',
	        payload: {
	          sdp: offer,
	          type: connection.type,
	          label: connection.label,
	          connectionId: connection.id,
	          reliable: connection.reliable,
	          serialization: connection.serialization,
	          metadata: connection.metadata,
	          browser: util.browser
	        },
	        dst: connection.peer
	      });
	    }, function(err) {
	      connection.provider.emitError('webrtc', err);
	      util.log('Failed to setLocalDescription, ', err);
	    });
	  }, function(err) {
	    connection.provider.emitError('webrtc', err);
	    util.log('Failed to createOffer, ', err);
	  }, connection.options.constraints);
	}
	
	Negotiator._makeAnswer = function(connection) {
	  var pc = connection.pc;
	
	  pc.createAnswer(function(answer) {
	    util.log('Created answer.');
	
	    if (!util.supports.sctp && connection.type === 'data' && connection.reliable) {
	      answer.sdp = Reliable.higherBandwidthSDP(answer.sdp);
	    }
	
	    pc.setLocalDescription(answer, function() {
	      util.log('Set localDescription: answer', 'for:', connection.peer);
	      connection.provider.socket.send({
	        type: 'ANSWER',
	        payload: {
	          sdp: answer,
	          type: connection.type,
	          connectionId: connection.id,
	          browser: util.browser
	        },
	        dst: connection.peer
	      });
	    }, function(err) {
	      connection.provider.emitError('webrtc', err);
	      util.log('Failed to setLocalDescription, ', err);
	    });
	  }, function(err) {
	    connection.provider.emitError('webrtc', err);
	    util.log('Failed to create answer, ', err);
	  });
	}
	
	/** Handle an SDP. */
	Negotiator.handleSDP = function(type, connection, sdp) {
	  sdp = new RTCSessionDescription(sdp);
	  var pc = connection.pc;
	
	  util.log('Setting remote description', sdp);
	  pc.setRemoteDescription(sdp, function() {
	    util.log('Set remoteDescription:', type, 'for:', connection.peer);
	
	    if (type === 'OFFER') {
	      Negotiator._makeAnswer(connection);
	    }
	  }, function(err) {
	    connection.provider.emitError('webrtc', err);
	    util.log('Failed to setRemoteDescription, ', err);
	  });
	}
	
	/** Handle a candidate. */
	Negotiator.handleCandidate = function(connection, ice) {
	  var candidate = ice.candidate;
	  var sdpMLineIndex = ice.sdpMLineIndex;
	  connection.pc.addIceCandidate(new RTCIceCandidate({
	    sdpMLineIndex: sdpMLineIndex,
	    candidate: candidate
	  }));
	  util.log('Added ICE candidate for:', connection.peer);
	}
	
	module.exports = Negotiator;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var BufferBuilder = __webpack_require__(30).BufferBuilder;
	var binaryFeatures = __webpack_require__(30).binaryFeatures;
	
	var BinaryPack = {
	  unpack: function(data){
	    var unpacker = new Unpacker(data);
	    return unpacker.unpack();
	  },
	  pack: function(data){
	    var packer = new Packer();
	    packer.pack(data);
	    var buffer = packer.getBuffer();
	    return buffer;
	  }
	};
	
	module.exports = BinaryPack;
	
	function Unpacker (data){
	  // Data is ArrayBuffer
	  this.index = 0;
	  this.dataBuffer = data;
	  this.dataView = new Uint8Array(this.dataBuffer);
	  this.length = this.dataBuffer.byteLength;
	}
	
	Unpacker.prototype.unpack = function(){
	  var type = this.unpack_uint8();
	  if (type < 0x80){
	    var positive_fixnum = type;
	    return positive_fixnum;
	  } else if ((type ^ 0xe0) < 0x20){
	    var negative_fixnum = (type ^ 0xe0) - 0x20;
	    return negative_fixnum;
	  }
	  var size;
	  if ((size = type ^ 0xa0) <= 0x0f){
	    return this.unpack_raw(size);
	  } else if ((size = type ^ 0xb0) <= 0x0f){
	    return this.unpack_string(size);
	  } else if ((size = type ^ 0x90) <= 0x0f){
	    return this.unpack_array(size);
	  } else if ((size = type ^ 0x80) <= 0x0f){
	    return this.unpack_map(size);
	  }
	  switch(type){
	    case 0xc0:
	      return null;
	    case 0xc1:
	      return undefined;
	    case 0xc2:
	      return false;
	    case 0xc3:
	      return true;
	    case 0xca:
	      return this.unpack_float();
	    case 0xcb:
	      return this.unpack_double();
	    case 0xcc:
	      return this.unpack_uint8();
	    case 0xcd:
	      return this.unpack_uint16();
	    case 0xce:
	      return this.unpack_uint32();
	    case 0xcf:
	      return this.unpack_uint64();
	    case 0xd0:
	      return this.unpack_int8();
	    case 0xd1:
	      return this.unpack_int16();
	    case 0xd2:
	      return this.unpack_int32();
	    case 0xd3:
	      return this.unpack_int64();
	    case 0xd4:
	      return undefined;
	    case 0xd5:
	      return undefined;
	    case 0xd6:
	      return undefined;
	    case 0xd7:
	      return undefined;
	    case 0xd8:
	      size = this.unpack_uint16();
	      return this.unpack_string(size);
	    case 0xd9:
	      size = this.unpack_uint32();
	      return this.unpack_string(size);
	    case 0xda:
	      size = this.unpack_uint16();
	      return this.unpack_raw(size);
	    case 0xdb:
	      size = this.unpack_uint32();
	      return this.unpack_raw(size);
	    case 0xdc:
	      size = this.unpack_uint16();
	      return this.unpack_array(size);
	    case 0xdd:
	      size = this.unpack_uint32();
	      return this.unpack_array(size);
	    case 0xde:
	      size = this.unpack_uint16();
	      return this.unpack_map(size);
	    case 0xdf:
	      size = this.unpack_uint32();
	      return this.unpack_map(size);
	  }
	}
	
	Unpacker.prototype.unpack_uint8 = function(){
	  var byte = this.dataView[this.index] & 0xff;
	  this.index++;
	  return byte;
	};
	
	Unpacker.prototype.unpack_uint16 = function(){
	  var bytes = this.read(2);
	  var uint16 =
	    ((bytes[0] & 0xff) * 256) + (bytes[1] & 0xff);
	  this.index += 2;
	  return uint16;
	}
	
	Unpacker.prototype.unpack_uint32 = function(){
	  var bytes = this.read(4);
	  var uint32 =
	     ((bytes[0]  * 256 +
	       bytes[1]) * 256 +
	       bytes[2]) * 256 +
	       bytes[3];
	  this.index += 4;
	  return uint32;
	}
	
	Unpacker.prototype.unpack_uint64 = function(){
	  var bytes = this.read(8);
	  var uint64 =
	   ((((((bytes[0]  * 256 +
	       bytes[1]) * 256 +
	       bytes[2]) * 256 +
	       bytes[3]) * 256 +
	       bytes[4]) * 256 +
	       bytes[5]) * 256 +
	       bytes[6]) * 256 +
	       bytes[7];
	  this.index += 8;
	  return uint64;
	}
	
	
	Unpacker.prototype.unpack_int8 = function(){
	  var uint8 = this.unpack_uint8();
	  return (uint8 < 0x80 ) ? uint8 : uint8 - (1 << 8);
	};
	
	Unpacker.prototype.unpack_int16 = function(){
	  var uint16 = this.unpack_uint16();
	  return (uint16 < 0x8000 ) ? uint16 : uint16 - (1 << 16);
	}
	
	Unpacker.prototype.unpack_int32 = function(){
	  var uint32 = this.unpack_uint32();
	  return (uint32 < Math.pow(2, 31) ) ? uint32 :
	    uint32 - Math.pow(2, 32);
	}
	
	Unpacker.prototype.unpack_int64 = function(){
	  var uint64 = this.unpack_uint64();
	  return (uint64 < Math.pow(2, 63) ) ? uint64 :
	    uint64 - Math.pow(2, 64);
	}
	
	Unpacker.prototype.unpack_raw = function(size){
	  if ( this.length < this.index + size){
	    throw new Error('BinaryPackFailure: index is out of range'
	      + ' ' + this.index + ' ' + size + ' ' + this.length);
	  }
	  var buf = this.dataBuffer.slice(this.index, this.index + size);
	  this.index += size;
	
	    //buf = util.bufferToString(buf);
	
	  return buf;
	}
	
	Unpacker.prototype.unpack_string = function(size){
	  var bytes = this.read(size);
	  var i = 0, str = '', c, code;
	  while(i < size){
	    c = bytes[i];
	    if ( c < 128){
	      str += String.fromCharCode(c);
	      i++;
	    } else if ((c ^ 0xc0) < 32){
	      code = ((c ^ 0xc0) << 6) | (bytes[i+1] & 63);
	      str += String.fromCharCode(code);
	      i += 2;
	    } else {
	      code = ((c & 15) << 12) | ((bytes[i+1] & 63) << 6) |
	        (bytes[i+2] & 63);
	      str += String.fromCharCode(code);
	      i += 3;
	    }
	  }
	  this.index += size;
	  return str;
	}
	
	Unpacker.prototype.unpack_array = function(size){
	  var objects = new Array(size);
	  for(var i = 0; i < size ; i++){
	    objects[i] = this.unpack();
	  }
	  return objects;
	}
	
	Unpacker.prototype.unpack_map = function(size){
	  var map = {};
	  for(var i = 0; i < size ; i++){
	    var key  = this.unpack();
	    var value = this.unpack();
	    map[key] = value;
	  }
	  return map;
	}
	
	Unpacker.prototype.unpack_float = function(){
	  var uint32 = this.unpack_uint32();
	  var sign = uint32 >> 31;
	  var exp  = ((uint32 >> 23) & 0xff) - 127;
	  var fraction = ( uint32 & 0x7fffff ) | 0x800000;
	  return (sign == 0 ? 1 : -1) *
	    fraction * Math.pow(2, exp - 23);
	}
	
	Unpacker.prototype.unpack_double = function(){
	  var h32 = this.unpack_uint32();
	  var l32 = this.unpack_uint32();
	  var sign = h32 >> 31;
	  var exp  = ((h32 >> 20) & 0x7ff) - 1023;
	  var hfrac = ( h32 & 0xfffff ) | 0x100000;
	  var frac = hfrac * Math.pow(2, exp - 20) +
	    l32   * Math.pow(2, exp - 52);
	  return (sign == 0 ? 1 : -1) * frac;
	}
	
	Unpacker.prototype.read = function(length){
	  var j = this.index;
	  if (j + length <= this.length) {
	    return this.dataView.subarray(j, j + length);
	  } else {
	    throw new Error('BinaryPackFailure: read index out of range');
	  }
	}
	
	function Packer(){
	  this.bufferBuilder = new BufferBuilder();
	}
	
	Packer.prototype.getBuffer = function(){
	  return this.bufferBuilder.getBuffer();
	}
	
	Packer.prototype.pack = function(value){
	  var type = typeof(value);
	  if (type == 'string'){
	    this.pack_string(value);
	  } else if (type == 'number'){
	    if (Math.floor(value) === value){
	      this.pack_integer(value);
	    } else{
	      this.pack_double(value);
	    }
	  } else if (type == 'boolean'){
	    if (value === true){
	      this.bufferBuilder.append(0xc3);
	    } else if (value === false){
	      this.bufferBuilder.append(0xc2);
	    }
	  } else if (type == 'undefined'){
	    this.bufferBuilder.append(0xc0);
	  } else if (type == 'object'){
	    if (value === null){
	      this.bufferBuilder.append(0xc0);
	    } else {
	      var constructor = value.constructor;
	      if (constructor == Array){
	        this.pack_array(value);
	      } else if (constructor == Blob || constructor == File) {
	        this.pack_bin(value);
	      } else if (constructor == ArrayBuffer) {
	        if(binaryFeatures.useArrayBufferView) {
	          this.pack_bin(new Uint8Array(value));
	        } else {
	          this.pack_bin(value);
	        }
	      } else if ('BYTES_PER_ELEMENT' in value){
	        if(binaryFeatures.useArrayBufferView) {
	          this.pack_bin(new Uint8Array(value.buffer));
	        } else {
	          this.pack_bin(value.buffer);
	        }
	      } else if (constructor == Object){
	        this.pack_object(value);
	      } else if (constructor == Date){
	        this.pack_string(value.toString());
	      } else if (typeof value.toBinaryPack == 'function'){
	        this.bufferBuilder.append(value.toBinaryPack());
	      } else {
	        throw new Error('Type "' + constructor.toString() + '" not yet supported');
	      }
	    }
	  } else {
	    throw new Error('Type "' + type + '" not yet supported');
	  }
	  this.bufferBuilder.flush();
	}
	
	
	Packer.prototype.pack_bin = function(blob){
	  var length = blob.length || blob.byteLength || blob.size;
	  if (length <= 0x0f){
	    this.pack_uint8(0xa0 + length);
	  } else if (length <= 0xffff){
	    this.bufferBuilder.append(0xda) ;
	    this.pack_uint16(length);
	  } else if (length <= 0xffffffff){
	    this.bufferBuilder.append(0xdb);
	    this.pack_uint32(length);
	  } else{
	    throw new Error('Invalid length');
	  }
	  this.bufferBuilder.append(blob);
	}
	
	Packer.prototype.pack_string = function(str){
	  var length = utf8Length(str);
	
	  if (length <= 0x0f){
	    this.pack_uint8(0xb0 + length);
	  } else if (length <= 0xffff){
	    this.bufferBuilder.append(0xd8) ;
	    this.pack_uint16(length);
	  } else if (length <= 0xffffffff){
	    this.bufferBuilder.append(0xd9);
	    this.pack_uint32(length);
	  } else{
	    throw new Error('Invalid length');
	  }
	  this.bufferBuilder.append(str);
	}
	
	Packer.prototype.pack_array = function(ary){
	  var length = ary.length;
	  if (length <= 0x0f){
	    this.pack_uint8(0x90 + length);
	  } else if (length <= 0xffff){
	    this.bufferBuilder.append(0xdc)
	    this.pack_uint16(length);
	  } else if (length <= 0xffffffff){
	    this.bufferBuilder.append(0xdd);
	    this.pack_uint32(length);
	  } else{
	    throw new Error('Invalid length');
	  }
	  for(var i = 0; i < length ; i++){
	    this.pack(ary[i]);
	  }
	}
	
	Packer.prototype.pack_integer = function(num){
	  if ( -0x20 <= num && num <= 0x7f){
	    this.bufferBuilder.append(num & 0xff);
	  } else if (0x00 <= num && num <= 0xff){
	    this.bufferBuilder.append(0xcc);
	    this.pack_uint8(num);
	  } else if (-0x80 <= num && num <= 0x7f){
	    this.bufferBuilder.append(0xd0);
	    this.pack_int8(num);
	  } else if ( 0x0000 <= num && num <= 0xffff){
	    this.bufferBuilder.append(0xcd);
	    this.pack_uint16(num);
	  } else if (-0x8000 <= num && num <= 0x7fff){
	    this.bufferBuilder.append(0xd1);
	    this.pack_int16(num);
	  } else if ( 0x00000000 <= num && num <= 0xffffffff){
	    this.bufferBuilder.append(0xce);
	    this.pack_uint32(num);
	  } else if (-0x80000000 <= num && num <= 0x7fffffff){
	    this.bufferBuilder.append(0xd2);
	    this.pack_int32(num);
	  } else if (-0x8000000000000000 <= num && num <= 0x7FFFFFFFFFFFFFFF){
	    this.bufferBuilder.append(0xd3);
	    this.pack_int64(num);
	  } else if (0x0000000000000000 <= num && num <= 0xFFFFFFFFFFFFFFFF){
	    this.bufferBuilder.append(0xcf);
	    this.pack_uint64(num);
	  } else{
	    throw new Error('Invalid integer');
	  }
	}
	
	Packer.prototype.pack_double = function(num){
	  var sign = 0;
	  if (num < 0){
	    sign = 1;
	    num = -num;
	  }
	  var exp  = Math.floor(Math.log(num) / Math.LN2);
	  var frac0 = num / Math.pow(2, exp) - 1;
	  var frac1 = Math.floor(frac0 * Math.pow(2, 52));
	  var b32   = Math.pow(2, 32);
	  var h32 = (sign << 31) | ((exp+1023) << 20) |
	      (frac1 / b32) & 0x0fffff;
	  var l32 = frac1 % b32;
	  this.bufferBuilder.append(0xcb);
	  this.pack_int32(h32);
	  this.pack_int32(l32);
	}
	
	Packer.prototype.pack_object = function(obj){
	  var keys = Object.keys(obj);
	  var length = keys.length;
	  if (length <= 0x0f){
	    this.pack_uint8(0x80 + length);
	  } else if (length <= 0xffff){
	    this.bufferBuilder.append(0xde);
	    this.pack_uint16(length);
	  } else if (length <= 0xffffffff){
	    this.bufferBuilder.append(0xdf);
	    this.pack_uint32(length);
	  } else{
	    throw new Error('Invalid length');
	  }
	  for(var prop in obj){
	    if (obj.hasOwnProperty(prop)){
	      this.pack(prop);
	      this.pack(obj[prop]);
	    }
	  }
	}
	
	Packer.prototype.pack_uint8 = function(num){
	  this.bufferBuilder.append(num);
	}
	
	Packer.prototype.pack_uint16 = function(num){
	  this.bufferBuilder.append(num >> 8);
	  this.bufferBuilder.append(num & 0xff);
	}
	
	Packer.prototype.pack_uint32 = function(num){
	  var n = num & 0xffffffff;
	  this.bufferBuilder.append((n & 0xff000000) >>> 24);
	  this.bufferBuilder.append((n & 0x00ff0000) >>> 16);
	  this.bufferBuilder.append((n & 0x0000ff00) >>>  8);
	  this.bufferBuilder.append((n & 0x000000ff));
	}
	
	Packer.prototype.pack_uint64 = function(num){
	  var high = num / Math.pow(2, 32);
	  var low  = num % Math.pow(2, 32);
	  this.bufferBuilder.append((high & 0xff000000) >>> 24);
	  this.bufferBuilder.append((high & 0x00ff0000) >>> 16);
	  this.bufferBuilder.append((high & 0x0000ff00) >>>  8);
	  this.bufferBuilder.append((high & 0x000000ff));
	  this.bufferBuilder.append((low  & 0xff000000) >>> 24);
	  this.bufferBuilder.append((low  & 0x00ff0000) >>> 16);
	  this.bufferBuilder.append((low  & 0x0000ff00) >>>  8);
	  this.bufferBuilder.append((low  & 0x000000ff));
	}
	
	Packer.prototype.pack_int8 = function(num){
	  this.bufferBuilder.append(num & 0xff);
	}
	
	Packer.prototype.pack_int16 = function(num){
	  this.bufferBuilder.append((num & 0xff00) >> 8);
	  this.bufferBuilder.append(num & 0xff);
	}
	
	Packer.prototype.pack_int32 = function(num){
	  this.bufferBuilder.append((num >>> 24) & 0xff);
	  this.bufferBuilder.append((num & 0x00ff0000) >>> 16);
	  this.bufferBuilder.append((num & 0x0000ff00) >>> 8);
	  this.bufferBuilder.append((num & 0x000000ff));
	}
	
	Packer.prototype.pack_int64 = function(num){
	  var high = Math.floor(num / Math.pow(2, 32));
	  var low  = num % Math.pow(2, 32);
	  this.bufferBuilder.append((high & 0xff000000) >>> 24);
	  this.bufferBuilder.append((high & 0x00ff0000) >>> 16);
	  this.bufferBuilder.append((high & 0x0000ff00) >>>  8);
	  this.bufferBuilder.append((high & 0x000000ff));
	  this.bufferBuilder.append((low  & 0xff000000) >>> 24);
	  this.bufferBuilder.append((low  & 0x00ff0000) >>> 16);
	  this.bufferBuilder.append((low  & 0x0000ff00) >>>  8);
	  this.bufferBuilder.append((low  & 0x000000ff));
	}
	
	function _utf8Replace(m){
	  var code = m.charCodeAt(0);
	
	  if(code <= 0x7ff) return '00';
	  if(code <= 0xffff) return '000';
	  if(code <= 0x1fffff) return '0000';
	  if(code <= 0x3ffffff) return '00000';
	  return '000000';
	}
	
	function utf8Length(str){
	  if (str.length > 600) {
	    // Blob method faster for large strings
	    return (new Blob([str])).size;
	  } else {
	    return str.replace(/[^\u0000-\u007F]/g, _utf8Replace).length;
	  }
	}


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var binaryFeatures = {};
	binaryFeatures.useBlobBuilder = (function(){
	  try {
	    new Blob([]);
	    return false;
	  } catch (e) {
	    return true;
	  }
	})();
	
	binaryFeatures.useArrayBufferView = !binaryFeatures.useBlobBuilder && (function(){
	  try {
	    return (new Blob([new Uint8Array([])])).size === 0;
	  } catch (e) {
	    return true;
	  }
	})();
	
	module.exports.binaryFeatures = binaryFeatures;
	var BlobBuilder = module.exports.BlobBuilder;
	if (typeof window != 'undefined') {
	  BlobBuilder = module.exports.BlobBuilder = window.WebKitBlobBuilder ||
	    window.MozBlobBuilder || window.MSBlobBuilder || window.BlobBuilder;
	}
	
	function BufferBuilder(){
	  this._pieces = [];
	  this._parts = [];
	}
	
	BufferBuilder.prototype.append = function(data) {
	  if(typeof data === 'number') {
	    this._pieces.push(data);
	  } else {
	    this.flush();
	    this._parts.push(data);
	  }
	};
	
	BufferBuilder.prototype.flush = function() {
	  if (this._pieces.length > 0) {
	    var buf = new Uint8Array(this._pieces);
	    if(!binaryFeatures.useArrayBufferView) {
	      buf = buf.buffer;
	    }
	    this._parts.push(buf);
	    this._pieces = [];
	  }
	};
	
	BufferBuilder.prototype.getBuffer = function() {
	  this.flush();
	  if(binaryFeatures.useBlobBuilder) {
	    var builder = new BlobBuilder();
	    for(var i = 0, ii = this._parts.length; i < ii; i++) {
	      builder.append(this._parts[i]);
	    }
	    return builder.getBlob();
	  } else {
	    return new Blob(this._parts);
	  }
	};
	
	module.exports.BufferBuilder = BufferBuilder;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	if (global._babelPolyfill) {
	  throw new Error("only one instance of babel/polyfill is allowed");
	}
	global._babelPolyfill = true;
	
	__webpack_require__(78);
	
	__webpack_require__(79);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	// 19.1.2.1 Object.assign(target, source, ...)
	module.exports = Object.assign || function(target, source){ // eslint-disable-line no-unused-vars
	  var T = Object($.assertDefined(target))
	    , l = arguments.length
	    , i = 1;
	  while(l > i){
	    var S      = $.ES5Object(arguments[i++])
	      , keys   = $.getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)T[key = keys[j++]] = S[key];
	  }
	  return T;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function($){
	  $.FW   = true;
	  $.path = $.g;
	  return $;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);
	module.exports = function(object, el){
	  var O      = $.toObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $      = __webpack_require__(1)
	  , invoke = __webpack_require__(13)
	  , assertFunction = __webpack_require__(3).fn;
	module.exports = function(/* ...pargs */){
	  var fn     = assertFunction(this)
	    , length = arguments.length
	    , pargs  = Array(length)
	    , i      = 0
	    , _      = $.path._
	    , holder = false;
	  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
	  return function(/* ...args */){
	    var that    = this
	      , _length = arguments.length
	      , j = 0, k = 0, args;
	    if(!holder && !_length)return invoke(fn, pargs, that);
	    args = pargs.slice();
	    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
	    while(_length > k)args.push(arguments[k++]);
	    return invoke(fn, args, that);
	  };
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var $                = __webpack_require__(1)
	  , cof              = __webpack_require__(4)
	  , $def             = __webpack_require__(2)
	  , invoke           = __webpack_require__(13)
	  , arrayMethod      = __webpack_require__(11)
	  , IE_PROTO         = __webpack_require__(7).safe('__proto__')
	  , assert           = __webpack_require__(3)
	  , assertObject     = assert.obj
	  , ObjectProto      = Object.prototype
	  , A                = []
	  , slice            = A.slice
	  , indexOf          = A.indexOf
	  , classof          = cof.classof
	  , defineProperties = Object.defineProperties
	  , has              = $.has
	  , defineProperty   = $.setDesc
	  , getOwnDescriptor = $.getDesc
	  , isFunction       = $.isFunction
	  , toObject         = $.toObject
	  , toLength         = $.toLength
	  , IE8_DOM_DEFINE   = false;
	
	if(!$.DESC){
	  try {
	    IE8_DOM_DEFINE = defineProperty(document.createElement('div'), 'x',
	      {get: function(){ return 8; }}
	    ).x == 8;
	  } catch(e){ /* empty */ }
	  $.setDesc = function(O, P, Attributes){
	    if(IE8_DOM_DEFINE)try {
	      return defineProperty(O, P, Attributes);
	    } catch(e){ /* empty */ }
	    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	    if('value' in Attributes)assertObject(O)[P] = Attributes.value;
	    return O;
	  };
	  $.getDesc = function(O, P){
	    if(IE8_DOM_DEFINE)try {
	      return getOwnDescriptor(O, P);
	    } catch(e){ /* empty */ }
	    if(has(O, P))return $.desc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
	  };
	  defineProperties = function(O, Properties){
	    assertObject(O);
	    var keys   = $.getKeys(Properties)
	      , length = keys.length
	      , i = 0
	      , P;
	    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
	    return O;
	  };
	}
	$def($def.S + $def.F * !$.DESC, 'Object', {
	  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $.getDesc,
	  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	  defineProperty: $.setDesc,
	  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	  defineProperties: defineProperties
	});
	
	  // IE 8- don't enum bug keys
	var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
	            'toLocaleString,toString,valueOf').split(',')
	  // Additional keys for getOwnPropertyNames
	  , keys2 = keys1.concat('length', 'prototype')
	  , keysLen1 = keys1.length;
	
	// Create object with `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = document.createElement('iframe')
	    , i      = keysLen1
	    , iframeDocument;
	  iframe.style.display = 'none';
	  $.html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script>');
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict.prototype[keys1[i]];
	  return createDict();
	};
	function createGetKeys(names, length){
	  return function(object){
	    var O      = toObject(object)
	      , i      = 0
	      , result = []
	      , key;
	    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	    // Don't enum bug & hidden keys
	    while(length > i)if(has(O, key = names[i++])){
	      ~indexOf.call(result, key) || result.push(key);
	    }
	    return result;
	  };
	}
	function isPrimitive(it){ return !$.isObject(it); }
	function Empty(){}
	$def($def.S, 'Object', {
	  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	  getPrototypeOf: $.getProto = $.getProto || function(O){
	    O = Object(assert.def(O));
	    if(has(O, IE_PROTO))return O[IE_PROTO];
	    if(isFunction(O.constructor) && O instanceof O.constructor){
	      return O.constructor.prototype;
	    } return O instanceof Object ? ObjectProto : null;
	  },
	  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
	  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	  create: $.create = $.create || function(O, /*?*/Properties){
	    var result;
	    if(O !== null){
	      Empty.prototype = assertObject(O);
	      result = new Empty();
	      Empty.prototype = null;
	      // add "__proto__" for Object.getPrototypeOf shim
	      result[IE_PROTO] = O;
	    } else result = createDict();
	    return Properties === undefined ? result : defineProperties(result, Properties);
	  },
	  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
	  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),
	  // 19.1.2.17 / 15.2.3.8 Object.seal(O)
	  seal: $.it, // <- cap
	  // 19.1.2.5 / 15.2.3.9 Object.freeze(O)
	  freeze: $.it, // <- cap
	  // 19.1.2.15 / 15.2.3.10 Object.preventExtensions(O)
	  preventExtensions: $.it, // <- cap
	  // 19.1.2.13 / 15.2.3.11 Object.isSealed(O)
	  isSealed: isPrimitive, // <- cap
	  // 19.1.2.12 / 15.2.3.12 Object.isFrozen(O)
	  isFrozen: isPrimitive, // <- cap
	  // 19.1.2.11 / 15.2.3.13 Object.isExtensible(O)
	  isExtensible: $.isObject // <- cap
	});
	
	// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
	$def($def.P, 'Function', {
	  bind: function(that /*, args... */){
	    var fn       = assert.fn(this)
	      , partArgs = slice.call(arguments, 1);
	    function bound(/* args... */){
	      var args = partArgs.concat(slice.call(arguments));
	      return invoke(fn, args, this instanceof bound ? $.create(fn.prototype) : that);
	    }
	    if(fn.prototype)bound.prototype = fn.prototype;
	    return bound;
	  }
	});
	
	// Fix for not array-like ES3 string
	function arrayMethodFix(fn){
	  return function(){
	    return fn.apply($.ES5Object(this), arguments);
	  };
	}
	if(!(0 in Object('z') && 'z'[0] == 'z')){
	  $.ES5Object = function(it){
	    return cof(it) == 'String' ? it.split('') : Object(it);
	  };
	}
	$def($def.P + $def.F * ($.ES5Object != Object), 'Array', {
	  slice: arrayMethodFix(slice),
	  join: arrayMethodFix(A.join)
	});
	
	// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
	$def($def.S, 'Array', {
	  isArray: function(arg){
	    return cof(arg) == 'Array';
	  }
	});
	function createArrayReduce(isRight){
	  return function(callbackfn, memo){
	    assert.fn(callbackfn);
	    var O      = toObject(this)
	      , length = toLength(O.length)
	      , index  = isRight ? length - 1 : 0
	      , i      = isRight ? -1 : 1;
	    if(arguments.length < 2)for(;;){
	      if(index in O){
	        memo = O[index];
	        index += i;
	        break;
	      }
	      index += i;
	      assert(isRight ? index >= 0 : length > index, 'Reduce of empty array with no initial value');
	    }
	    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
	      memo = callbackfn(memo, O[index], index, this);
	    }
	    return memo;
	  };
	}
	$def($def.P, 'Array', {
	  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
	  forEach: $.each = $.each || arrayMethod(0),
	  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
	  map: arrayMethod(1),
	  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
	  filter: arrayMethod(2),
	  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
	  some: arrayMethod(3),
	  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
	  every: arrayMethod(4),
	  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
	  reduce: createArrayReduce(false),
	  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
	  reduceRight: createArrayReduce(true),
	  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
	  indexOf: indexOf = indexOf || __webpack_require__(19)(false),
	  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
	  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
	    var O      = toObject(this)
	      , length = toLength(O.length)
	      , index  = length - 1;
	    if(arguments.length > 1)index = Math.min(index, $.toInteger(fromIndex));
	    if(index < 0)index = toLength(length + index);
	    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
	    return -1;
	  }
	});
	
	// 21.1.3.25 / 15.5.4.20 String.prototype.trim()
	$def($def.P, 'String', {trim: __webpack_require__(17)(/^\s*([\s\S]*\S)?\s*$/, '$1')});
	
	// 20.3.3.1 / 15.9.4.4 Date.now()
	$def($def.S, 'Date', {now: function(){
	  return +new Date;
	}});
	
	function lz(num){
	  return num > 9 ? num : '0' + num;
	}
	// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
	$def($def.P, 'Date', {toISOString: function(){
	  if(!isFinite(this))throw RangeError('Invalid time value');
	  var d = this
	    , y = d.getUTCFullYear()
	    , m = d.getUTCMilliseconds()
	    , s = y < 0 ? '-' : y > 9999 ? '+' : '';
	  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
	    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
	    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
	    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
	}});
	
	if(classof(function(){ return arguments; }()) == 'Object')cof.classof = function(it){
	  var tag = classof(it);
	  return tag == 'Object' && isFunction(it.callee) ? 'Arguments' : tag;
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $       = __webpack_require__(1)
	  , $def    = __webpack_require__(2)
	  , toIndex = $.toIndex;
	$def($def.P, 'Array', {
	  // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
	  copyWithin: function(target/* = 0 */, start /* = 0, end = @length */){
	    var O     = Object($.assertDefined(this))
	      , len   = $.toLength(O.length)
	      , to    = toIndex(target, len)
	      , from  = toIndex(start, len)
	      , end   = arguments[2]
	      , fin   = end === undefined ? len : toIndex(end, len)
	      , count = Math.min(fin - from, len - to)
	      , inc   = 1;
	    if(from < to && to < from + count){
	      inc  = -1;
	      from = from + count - 1;
	      to   = to   + count - 1;
	    }
	    while(count-- > 0){
	      if(from in O)O[to] = O[from];
	      else delete O[to];
	      to   += inc;
	      from += inc;
	    } return O;
	  }
	});
	__webpack_require__(9)('copyWithin');

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $       = __webpack_require__(1)
	  , $def    = __webpack_require__(2)
	  , toIndex = $.toIndex;
	$def($def.P, 'Array', {
	  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
	  fill: function(value /*, start = 0, end = @length */){
	    var O      = Object($.assertDefined(this))
	      , length = $.toLength(O.length)
	      , index  = toIndex(arguments[1], length)
	      , end    = arguments[2]
	      , endPos = end === undefined ? length : toIndex(end, length);
	    while(endPos > index)O[index++] = value;
	    return O;
	  }
	});
	__webpack_require__(9)('fill');

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var $def = __webpack_require__(2);
	$def($def.P, 'Array', {
	  // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
	  findIndex: __webpack_require__(11)(6)
	});
	__webpack_require__(9)('findIndex');

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var $def = __webpack_require__(2);
	$def($def.P, 'Array', {
	  // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
	  find: __webpack_require__(11)(5)
	});
	__webpack_require__(9)('find');

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var $     = __webpack_require__(1)
	  , ctx   = __webpack_require__(5)
	  , $def  = __webpack_require__(2)
	  , $iter = __webpack_require__(6)
	  , stepCall = $iter.stepCall;
	$def($def.S + $def.F * $iter.DANGER_CLOSING, 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = Object($.assertDefined(arrayLike))
	      , mapfn   = arguments[1]
	      , mapping = mapfn !== undefined
	      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
	      , index   = 0
	      , length, result, step, iterator;
	    if($iter.is(O)){
	      iterator = $iter.get(O);
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      result   = new (typeof this == 'function' ? this : Array);
	      for(; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? stepCall(iterator, f, [step.value, index], true) : step.value;
	      }
	    } else {
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
	      for(; length > index; index++){
	        result[index] = mapping ? f(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var $def = __webpack_require__(2);
	$def($def.S, 'Array', {
	  // 22.1.2.3 Array.of( ...items)
	  of: function(/* ...args */){
	    var index  = 0
	      , length = arguments.length
	      // strange IE quirks mode bug -> use typeof instead of isFunction
	      , result = new (typeof this == 'function' ? this : Array)(length);
	    while(length > index)result[index] = arguments[index++];
	    result.length = length;
	    return result;
	  }
	});

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(14)(Array);

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $    = __webpack_require__(1)
	  , NAME = 'name'
	  , setDesc = $.setDesc
	  , FunctionProto = Function.prototype;
	// 19.2.4.2 name
	NAME in FunctionProto || $.FW && $.DESC && setDesc(FunctionProto, NAME, {
	  configurable: true,
	  get: function(){
	    var match = String(this).match(/^\s*function ([^ (]*)/)
	      , name  = match ? match[1] : '';
	    $.has(this, NAME) || setDesc(this, NAME, $.desc(5, name));
	    return name;
	  },
	  set: function(value){
	    $.has(this, NAME) || setDesc(this, NAME, $.desc(0, value));
	  }
	});

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(20);
	
	// 23.1 Map Objects
	__webpack_require__(12)('Map', {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function(key){
	    var entry = strong.getEntry(this, key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function(key, value){
	    return strong.def(this, key === 0 ? 0 : key, value);
	  }
	}, strong, true);

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var Infinity = 1 / 0
	  , $def  = __webpack_require__(2)
	  , E     = Math.E
	  , pow   = Math.pow
	  , abs   = Math.abs
	  , exp   = Math.exp
	  , log   = Math.log
	  , sqrt  = Math.sqrt
	  , ceil  = Math.ceil
	  , floor = Math.floor
	  , sign  = Math.sign || function(x){
	      return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
	    };
	
	// 20.2.2.5 Math.asinh(x)
	function asinh(x){
	  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
	}
	// 20.2.2.14 Math.expm1(x)
	function expm1(x){
	  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
	}
	
	$def($def.S, 'Math', {
	  // 20.2.2.3 Math.acosh(x)
	  acosh: function(x){
	    return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
	  },
	  // 20.2.2.5 Math.asinh(x)
	  asinh: asinh,
	  // 20.2.2.7 Math.atanh(x)
	  atanh: function(x){
	    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
	  },
	  // 20.2.2.9 Math.cbrt(x)
	  cbrt: function(x){
	    return sign(x = +x) * pow(abs(x), 1 / 3);
	  },
	  // 20.2.2.11 Math.clz32(x)
	  clz32: function(x){
	    return (x >>>= 0) ? 32 - x.toString(2).length : 32;
	  },
	  // 20.2.2.12 Math.cosh(x)
	  cosh: function(x){
	    return (exp(x = +x) + exp(-x)) / 2;
	  },
	  // 20.2.2.14 Math.expm1(x)
	  expm1: expm1,
	  // 20.2.2.16 Math.fround(x)
	  // TODO: fallback for IE9-
	  fround: function(x){
	    return new Float32Array([x])[0];
	  },
	  // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
	  hypot: function(value1, value2){ // eslint-disable-line no-unused-vars
	    var sum  = 0
	      , len1 = arguments.length
	      , len2 = len1
	      , args = Array(len1)
	      , larg = -Infinity
	      , arg;
	    while(len1--){
	      arg = args[len1] = +arguments[len1];
	      if(arg == Infinity || arg == -Infinity)return Infinity;
	      if(arg > larg)larg = arg;
	    }
	    larg = arg || 1;
	    while(len2--)sum += pow(args[len2] / larg, 2);
	    return larg * sqrt(sum);
	  },
	  // 20.2.2.18 Math.imul(x, y)
	  imul: function(x, y){
	    var UInt16 = 0xffff
	      , xn = +x
	      , yn = +y
	      , xl = UInt16 & xn
	      , yl = UInt16 & yn;
	    return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
	  },
	  // 20.2.2.20 Math.log1p(x)
	  log1p: function(x){
	    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
	  },
	  // 20.2.2.21 Math.log10(x)
	  log10: function(x){
	    return log(x) / Math.LN10;
	  },
	  // 20.2.2.22 Math.log2(x)
	  log2: function(x){
	    return log(x) / Math.LN2;
	  },
	  // 20.2.2.28 Math.sign(x)
	  sign: sign,
	  // 20.2.2.30 Math.sinh(x)
	  sinh: function(x){
	    return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
	  },
	  // 20.2.2.33 Math.tanh(x)
	  tanh: function(x){
	    var a = expm1(x = +x)
	      , b = expm1(-x);
	    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
	  },
	  // 20.2.2.34 Math.trunc(x)
	  trunc: function(it){
	    return (it > 0 ? floor : ceil)(it);
	  }
	});

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $          = __webpack_require__(1)
	  , isObject   = $.isObject
	  , isFunction = $.isFunction
	  , NUMBER     = 'Number'
	  , Number     = $.g[NUMBER]
	  , Base       = Number
	  , proto      = Number.prototype;
	function toPrimitive(it){
	  var fn, val;
	  if(isFunction(fn = it.valueOf) && !isObject(val = fn.call(it)))return val;
	  if(isFunction(fn = it.toString) && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to number");
	}
	function toNumber(it){
	  if(isObject(it))it = toPrimitive(it);
	  if(typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48){
	    var binary = false;
	    switch(it.charCodeAt(1)){
	      case 66 : case 98  : binary = true;
	      case 79 : case 111 : return parseInt(it.slice(2), binary ? 2 : 8);
	    }
	  } return +it;
	}
	if($.FW && !(Number('0o1') && Number('0b1'))){
	  Number = function Number(it){
	    return this instanceof Number ? new Base(toNumber(it)) : toNumber(it);
	  };
	  $.each.call($.DESC ? $.getNames(Base) : (
	      // ES3:
	      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	      // ES6 (in case, if modules with ES6 Number statics required before):
	      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
	      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
	    ).split(','), function(key){
	      if($.has(Base, key) && !$.has(Number, key)){
	        $.setDesc(Number, key, $.getDesc(Base, key));
	      }
	    }
	  );
	  Number.prototype = proto;
	  proto.constructor = Number;
	  $.hide($.g, NUMBER, Number);
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var $     = __webpack_require__(1)
	  , $def  = __webpack_require__(2)
	  , abs   = Math.abs
	  , floor = Math.floor
	  , MAX_SAFE_INTEGER = 0x1fffffffffffff; // pow(2, 53) - 1 == 9007199254740991;
	function isInteger(it){
	  return !$.isObject(it) && isFinite(it) && floor(it) === it;
	}
	$def($def.S, 'Number', {
	  // 20.1.2.1 Number.EPSILON
	  EPSILON: Math.pow(2, -52),
	  // 20.1.2.2 Number.isFinite(number)
	  isFinite: function(it){
	    return typeof it == 'number' && isFinite(it);
	  },
	  // 20.1.2.3 Number.isInteger(number)
	  isInteger: isInteger,
	  // 20.1.2.4 Number.isNaN(number)
	  isNaN: function(number){
	    return number != number;
	  },
	  // 20.1.2.5 Number.isSafeInteger(number)
	  isSafeInteger: function(number){
	    return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
	  },
	  // 20.1.2.6 Number.MAX_SAFE_INTEGER
	  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
	  // 20.1.2.10 Number.MIN_SAFE_INTEGER
	  MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
	  // 20.1.2.12 Number.parseFloat(string)
	  parseFloat: parseFloat,
	  // 20.1.2.13 Number.parseInt(string, radix)
	  parseInt: parseInt
	});

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $def = __webpack_require__(2);
	$def($def.S, 'Object', {assign: __webpack_require__(32)});

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.10 Object.is(value1, value2)
	var $def = __webpack_require__(2);
	$def($def.S, 'Object', {
	  is: function(x, y){
	    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	  }
	});

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $def = __webpack_require__(2);
	$def($def.S, 'Object', {setPrototypeOf: __webpack_require__(23)});

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var $        = __webpack_require__(1)
	  , $def     = __webpack_require__(2)
	  , isObject = $.isObject
	  , toObject = $.toObject;
	function wrapObjectMethod(METHOD, MODE){
	  var fn  = ($.core.Object || {})[METHOD] || Object[METHOD]
	    , f   = 0
	    , o   = {};
	  o[METHOD] = MODE == 1 ? function(it){
	    return isObject(it) ? fn(it) : it;
	  } : MODE == 2 ? function(it){
	    return isObject(it) ? fn(it) : true;
	  } : MODE == 3 ? function(it){
	    return isObject(it) ? fn(it) : false;
	  } : MODE == 4 ? function(it, key){
	    return fn(toObject(it), key);
	  } : MODE == 5 ? function(it){
	    return fn(Object($.assertDefined(it)));
	  } : function(it){
	    return fn(toObject(it));
	  };
	  try {
	    fn('z');
	  } catch(e){
	    f = 1;
	  }
	  $def($def.S + $def.F * f, 'Object', o);
	}
	wrapObjectMethod('freeze', 1);
	wrapObjectMethod('seal', 1);
	wrapObjectMethod('preventExtensions', 1);
	wrapObjectMethod('isFrozen', 2);
	wrapObjectMethod('isSealed', 2);
	wrapObjectMethod('isExtensible', 3);
	wrapObjectMethod('getOwnPropertyDescriptor', 4);
	wrapObjectMethod('getPrototypeOf', 5);
	wrapObjectMethod('keys');
	wrapObjectMethod('getOwnPropertyNames');

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()
	var $   = __webpack_require__(1)
	  , cof = __webpack_require__(4)
	  , tmp = {};
	tmp[__webpack_require__(8)('toStringTag')] = 'z';
	if($.FW && cof(tmp) != 'z')$.hide(Object.prototype, 'toString', function(){
	  return '[object ' + cof.classof(this) + ']';
	});

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $       = __webpack_require__(1)
	  , ctx     = __webpack_require__(5)
	  , cof     = __webpack_require__(4)
	  , $def    = __webpack_require__(2)
	  , assert  = __webpack_require__(3)
	  , $iter   = __webpack_require__(6)
	  , SPECIES = __webpack_require__(8)('species')
	  , RECORD  = __webpack_require__(7).safe('record')
	  , forOf   = $iter.forOf
	  , PROMISE = 'Promise'
	  , global  = $.g
	  , process = global.process
	  , asap    = process && process.nextTick || __webpack_require__(24).set
	  , Promise = global[PROMISE]
	  , Base    = Promise
	  , isFunction     = $.isFunction
	  , isObject       = $.isObject
	  , assertFunction = assert.fn
	  , assertObject   = assert.obj
	  , test;
	function getConstructor(C){
	  var S = assertObject(C)[SPECIES];
	  return S != undefined ? S : C;
	}
	isFunction(Promise) && isFunction(Promise.resolve)
	&& Promise.resolve(test = new Promise(function(){})) == test
	|| function(){
	  function isThenable(it){
	    var then;
	    if(isObject(it))then = it.then;
	    return isFunction(then) ? then : false;
	  }
	  function handledRejectionOrHasOnRejected(promise){
	    var record = promise[RECORD]
	      , chain  = record.c
	      , i      = 0
	      , react;
	    if(record.h)return true;
	    while(chain.length > i){
	      react = chain[i++];
	      if(react.fail || handledRejectionOrHasOnRejected(react.P))return true;
	    }
	  }
	  function notify(record, isReject){
	    var chain = record.c;
	    if(isReject || chain.length)asap(function(){
	      var promise = record.p
	        , value   = record.v
	        , ok      = record.s == 1
	        , i       = 0;
	      if(isReject && !handledRejectionOrHasOnRejected(promise)){
	        setTimeout(function(){
	          if(!handledRejectionOrHasOnRejected(promise)){
	            if(cof(process) == 'process'){
	              process.emit('unhandledRejection', value, promise);
	            } else if(global.console && isFunction(console.error)){
	              console.error('Unhandled promise rejection', value);
	            }
	          }
	        }, 1e3);
	      } else while(chain.length > i)!function(react){
	        var cb = ok ? react.ok : react.fail
	          , ret, then;
	        try {
	          if(cb){
	            if(!ok)record.h = true;
	            ret = cb === true ? value : cb(value);
	            if(ret === react.P){
	              react.rej(TypeError(PROMISE + '-chain cycle'));
	            } else if(then = isThenable(ret)){
	              then.call(ret, react.res, react.rej);
	            } else react.res(ret);
	          } else react.rej(value);
	        } catch(err){
	          react.rej(err);
	        }
	      }(chain[i++]);
	      chain.length = 0;
	    });
	  }
	  function reject(value){
	    var record = this;
	    if(record.d)return;
	    record.d = true;
	    record = record.r || record; // unwrap
	    record.v = value;
	    record.s = 2;
	    notify(record, true);
	  }
	  function resolve(value){
	    var record = this
	      , then, wrapper;
	    if(record.d)return;
	    record.d = true;
	    record = record.r || record; // unwrap
	    try {
	      if(then = isThenable(value)){
	        wrapper = {r: record, d: false}; // wrap
	        then.call(value, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
	      } else {
	        record.v = value;
	        record.s = 1;
	        notify(record);
	      }
	    } catch(err){
	      reject.call(wrapper || {r: record, d: false}, err); // wrap
	    }
	  }
	  // 25.4.3.1 Promise(executor)
	  Promise = function(executor){
	    assertFunction(executor);
	    var record = {
	      p: assert.inst(this, Promise, PROMISE), // <- promise
	      c: [],                                  // <- chain
	      s: 0,                                   // <- state
	      d: false,                               // <- done
	      v: undefined,                           // <- value
	      h: false                                // <- handled rejection
	    };
	    $.hide(this, RECORD, record);
	    try {
	      executor(ctx(resolve, record, 1), ctx(reject, record, 1));
	    } catch(err){
	      reject.call(record, err);
	    }
	  };
	  $.mix(Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function(onFulfilled, onRejected){
	      var S = assertObject(assertObject(this).constructor)[SPECIES];
	      var react = {
	        ok:   isFunction(onFulfilled) ? onFulfilled : true,
	        fail: isFunction(onRejected)  ? onRejected  : false
	      };
	      var P = react.P = new (S != undefined ? S : Promise)(function(res, rej){
	        react.res = assertFunction(res);
	        react.rej = assertFunction(rej);
	      });
	      var record = this[RECORD];
	      record.c.push(react);
	      record.s && notify(record);
	      return P;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	}();
	$def($def.G + $def.W + $def.F * (Promise != Base), {Promise: Promise});
	$def($def.S, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function(r){
	    return new (getConstructor(this))(function(res, rej){
	      rej(r);
	    });
	  },
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function(x){
	    return isObject(x) && RECORD in x && $.getProto(x) === this.prototype
	      ? x : new (getConstructor(this))(function(res){
	        res(x);
	      });
	  }
	});
	$def($def.S + $def.F * ($iter.fail(function(iter){
	  Promise.all(iter)['catch'](function(){});
	}) || $iter.DANGER_CLOSING), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function(iterable){
	    var C      = getConstructor(this)
	      , values = [];
	    return new C(function(resolve, reject){
	      forOf(iterable, false, values.push, values);
	      var remaining = values.length
	        , results   = Array(remaining);
	      if(remaining)$.each.call(values, function(promise, index){
	        C.resolve(promise).then(function(value){
	          results[index] = value;
	          --remaining || resolve(results);
	        }, reject);
	      });
	      else resolve(results);
	    });
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function(iterable){
	    var C = getConstructor(this);
	    return new C(function(resolve, reject){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(resolve, reject);
	      });
	    });
	  }
	});
	cof.set(Promise, PROMISE);
	__webpack_require__(14)(Promise);

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(1)
	  , $def      = __webpack_require__(2)
	  , setProto  = __webpack_require__(23)
	  , $iter     = __webpack_require__(6)
	  , ITER      = __webpack_require__(7).safe('iter')
	  , step      = $iter.step
	  , assert    = __webpack_require__(3)
	  , isObject  = $.isObject
	  , getDesc   = $.getDesc
	  , setDesc   = $.setDesc
	  , getProto  = $.getProto
	  , apply     = Function.apply
	  , assertObject = assert.obj
	  , isExtensible = Object.isExtensible || $.it;
	function Enumerate(iterated){
	  var keys = [], key;
	  for(key in iterated)keys.push(key);
	  $.set(this, ITER, {o: iterated, a: keys, i: 0});
	}
	$iter.create(Enumerate, 'Object', function(){
	  var iter = this[ITER]
	    , keys = iter.a
	    , key;
	  do {
	    if(iter.i >= keys.length)return step(1);
	  } while(!((key = keys[iter.i++]) in iter.o));
	  return step(0, key);
	});
	
	function wrap(fn){
	  return function(it){
	    assertObject(it);
	    try {
	      fn.apply(undefined, arguments);
	      return true;
	    } catch(e){
	      return false;
	    }
	  };
	}
	
	function reflectGet(target, propertyKey/*, receiver*/){
	  var receiver = arguments.length < 3 ? target : arguments[2]
	    , desc = getDesc(assertObject(target), propertyKey), proto;
	  if(desc)return $.has(desc, 'value')
	    ? desc.value
	    : desc.get === undefined
	      ? undefined
	      : desc.get.call(receiver);
	  return isObject(proto = getProto(target))
	    ? reflectGet(proto, propertyKey, receiver)
	    : undefined;
	}
	function reflectSet(target, propertyKey, V/*, receiver*/){
	  var receiver = arguments.length < 4 ? target : arguments[3]
	    , ownDesc  = getDesc(assertObject(target), propertyKey)
	    , existingDescriptor, proto;
	  if(!ownDesc){
	    if(isObject(proto = getProto(target))){
	      return reflectSet(proto, propertyKey, V, receiver);
	    }
	    ownDesc = $.desc(0);
	  }
	  if($.has(ownDesc, 'value')){
	    if(ownDesc.writable === false || !isObject(receiver))return false;
	    existingDescriptor = getDesc(receiver, propertyKey) || $.desc(0);
	    existingDescriptor.value = V;
	    setDesc(receiver, propertyKey, existingDescriptor);
	    return true;
	  }
	  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
	}
	
	var reflect = {
	  // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
	  apply: __webpack_require__(5)(Function.call, apply, 3),
	  // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
	  construct: function(target, argumentsList /*, newTarget*/){
	    var proto    = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype
	      , instance = $.create(isObject(proto) ? proto : Object.prototype)
	      , result   = apply.call(target, instance, argumentsList);
	    return isObject(result) ? result : instance;
	  },
	  // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
	  defineProperty: wrap(setDesc),
	  // 26.1.4 Reflect.deleteProperty(target, propertyKey)
	  deleteProperty: function(target, propertyKey){
	    var desc = getDesc(assertObject(target), propertyKey);
	    return desc && !desc.configurable ? false : delete target[propertyKey];
	  },
	  // 26.1.5 Reflect.enumerate(target)
	  enumerate: function(target){
	    return new Enumerate(assertObject(target));
	  },
	  // 26.1.6 Reflect.get(target, propertyKey [, receiver])
	  get: reflectGet,
	  // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
	  getOwnPropertyDescriptor: function(target, propertyKey){
	    return getDesc(assertObject(target), propertyKey);
	  },
	  // 26.1.8 Reflect.getPrototypeOf(target)
	  getPrototypeOf: function(target){
	    return getProto(assertObject(target));
	  },
	  // 26.1.9 Reflect.has(target, propertyKey)
	  has: function(target, propertyKey){
	    return propertyKey in target;
	  },
	  // 26.1.10 Reflect.isExtensible(target)
	  isExtensible: function(target){
	    return !!isExtensible(assertObject(target));
	  },
	  // 26.1.11 Reflect.ownKeys(target)
	  ownKeys: __webpack_require__(22),
	  // 26.1.12 Reflect.preventExtensions(target)
	  preventExtensions: wrap(Object.preventExtensions || $.it),
	  // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
	  set: reflectSet
	};
	// 26.1.14 Reflect.setPrototypeOf(target, proto)
	if(setProto)reflect.setPrototypeOf = function(target, proto){
	  setProto(assertObject(target), proto);
	  return true;
	};
	
	$def($def.G, {Reflect: {}});
	$def($def.S, 'Reflect', reflect);

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var $      = __webpack_require__(1)
	  , cof    = __webpack_require__(4)
	  , RegExp = $.g.RegExp
	  , Base   = RegExp
	  , proto  = RegExp.prototype;
	if($.FW && $.DESC){
	  // RegExp allows a regex with flags as the pattern
	  if(!function(){try{ return RegExp(/a/g, 'i') == '/a/i'; }catch(e){ /* empty */ }}()){
	    RegExp = function RegExp(pattern, flags){
	      return new Base(cof(pattern) == 'RegExp' && flags !== undefined
	        ? pattern.source : pattern, flags);
	    };
	    $.each.call($.getNames(Base), function(key){
	      key in RegExp || $.setDesc(RegExp, key, {
	        configurable: true,
	        get: function(){ return Base[key]; },
	        set: function(it){ Base[key] = it; }
	      });
	    });
	    proto.constructor = RegExp;
	    RegExp.prototype = proto;
	    $.hide($.g, 'RegExp', RegExp);
	  }
	  // 21.2.5.3 get RegExp.prototype.flags()
	  if(/./g.flags != 'g')$.setDesc(proto, 'flags', {
	    configurable: true,
	    get: __webpack_require__(17)(/^.*\/(\w*)$/, '$1')
	  });
	}
	__webpack_require__(14)(RegExp);

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var strong = __webpack_require__(20);
	
	// 23.2 Set Objects
	__webpack_require__(12)('Set', {
	  // 23.2.3.1 Set.prototype.add(value)
	  add: function(value){
	    return strong.def(this, value = value === 0 ? 0 : value, value);
	  }
	}, strong);

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	var $def = __webpack_require__(2);
	$def($def.P, 'String', {
	  // 21.1.3.3 String.prototype.codePointAt(pos)
	  codePointAt: __webpack_require__(18)(false)
	});

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $    = __webpack_require__(1)
	  , cof  = __webpack_require__(4)
	  , $def = __webpack_require__(2)
	  , toLength = $.toLength;
	
	$def($def.P, 'String', {
	  // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
	  endsWith: function(searchString /*, endPosition = @length */){
	    if(cof(searchString) == 'RegExp')throw TypeError();
	    var that = String($.assertDefined(this))
	      , endPosition = arguments[1]
	      , len = toLength(that.length)
	      , end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
	    searchString += '';
	    return that.slice(end - searchString.length, end) === searchString;
	  }
	});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	var $def    = __webpack_require__(2)
	  , toIndex = __webpack_require__(1).toIndex
	  , fromCharCode = String.fromCharCode;
	
	$def($def.S, 'String', {
	  // 21.1.2.2 String.fromCodePoint(...codePoints)
	  fromCodePoint: function(x){ // eslint-disable-line no-unused-vars
	    var res = []
	      , len = arguments.length
	      , i   = 0
	      , code;
	    while(len > i){
	      code = +arguments[i++];
	      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
	      res.push(code < 0x10000
	        ? fromCharCode(code)
	        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
	      );
	    } return res.join('');
	  }
	});

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $    = __webpack_require__(1)
	  , cof  = __webpack_require__(4)
	  , $def = __webpack_require__(2);
	
	$def($def.P, 'String', {
	  // 21.1.3.7 String.prototype.includes(searchString, position = 0)
	  includes: function(searchString /*, position = 0 */){
	    if(cof(searchString) == 'RegExp')throw TypeError();
	    return !!~String($.assertDefined(this)).indexOf(searchString, arguments[1]);
	  }
	});

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	var set   = __webpack_require__(1).set
	  , at    = __webpack_require__(18)(true)
	  , ITER  = __webpack_require__(7).safe('iter')
	  , $iter = __webpack_require__(6)
	  , step  = $iter.step;
	
	// 21.1.3.27 String.prototype[@@iterator]()
	$iter.std(String, 'String', function(iterated){
	  set(this, ITER, {o: String(iterated), i: 0});
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var iter  = this[ITER]
	    , O     = iter.o
	    , index = iter.i
	    , point;
	  if(index >= O.length)return step(1);
	  point = at.call(O, index);
	  iter.i += point.length;
	  return step(0, point);
	});

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	var $    = __webpack_require__(1)
	  , $def = __webpack_require__(2);
	
	$def($def.S, 'String', {
	  // 21.1.2.4 String.raw(callSite, ...substitutions)
	  raw: function(callSite){
	    var raw = $.toObject(callSite.raw)
	      , len = $.toLength(raw.length)
	      , sln = arguments.length
	      , res = []
	      , i   = 0;
	    while(len > i){
	      res.push(String(raw[i++]));
	      if(i < sln)res.push(String(arguments[i]));
	    } return res.join('');
	  }
	});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $    = __webpack_require__(1)
	  , $def = __webpack_require__(2);
	
	$def($def.P, 'String', {
	  // 21.1.3.13 String.prototype.repeat(count)
	  repeat: function(count){
	    var str = String($.assertDefined(this))
	      , res = ''
	      , n   = $.toInteger(count);
	    if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
	    for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
	    return res;
	  }
	});

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $    = __webpack_require__(1)
	  , cof  = __webpack_require__(4)
	  , $def = __webpack_require__(2);
	
	$def($def.P, 'String', {
	  // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
	  startsWith: function(searchString /*, position = 0 */){
	    if(cof(searchString) == 'RegExp')throw TypeError();
	    var that  = String($.assertDefined(this))
	      , index = $.toLength(Math.min(arguments[1], that.length));
	    searchString += '';
	    return that.slice(index, index + searchString.length) === searchString;
	  }
	});

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $        = __webpack_require__(1)
	  , setTag   = __webpack_require__(4).set
	  , uid      = __webpack_require__(7)
	  , $def     = __webpack_require__(2)
	  , keyOf    = __webpack_require__(34)
	  , has      = $.has
	  , hide     = $.hide
	  , getNames = $.getNames
	  , toObject = $.toObject
	  , Symbol   = $.g.Symbol
	  , Base     = Symbol
	  , setter   = false
	  , TAG      = uid.safe('tag')
	  , SymbolRegistry = {}
	  , AllSymbols     = {};
	
	function wrap(tag){
	  var sym = AllSymbols[tag] = $.set($.create(Symbol.prototype), TAG, tag);
	  $.DESC && setter && $.setDesc(Object.prototype, tag, {
	    configurable: true,
	    set: function(value){
	      hide(this, tag, value);
	    }
	  });
	  return sym;
	}
	
	// 19.4.1.1 Symbol([description])
	if(!$.isFunction(Symbol)){
	  Symbol = function(description){
	    if(this instanceof Symbol)throw TypeError('Symbol is not a constructor');
	    return wrap(uid(description));
	  };
	  hide(Symbol.prototype, 'toString', function(){
	    return this[TAG];
	  });
	}
	$def($def.G + $def.W, {Symbol: Symbol});
	
	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  pure: uid.safe,
	  set: $.set,
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	    'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	    'species,split,toPrimitive,toStringTag,unscopables'
	  ).split(','), function(it){
	    var sym = __webpack_require__(8)(it);
	    symbolStatics[it] = Symbol === Base ? sym : wrap(sym);
	  }
	);
	
	setter = true;
	
	$def($def.S, 'Symbol', symbolStatics);
	
	$def($def.S + $def.F * (Symbol != Base), 'Object', {
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: function(it){
	    var names = getNames(toObject(it)), result = [], key, i = 0;
	    while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
	    return result;
	  },
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: function(it){
	    var names = getNames(toObject(it)), result = [], key, i = 0;
	    while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
	    return result;
	  }
	});
	
	setTag(Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setTag($.g.JSON, 'JSON', true);

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $         = __webpack_require__(1)
	  , weak      = __webpack_require__(21)
	  , leakStore = weak.leakStore
	  , ID        = weak.ID
	  , WEAK      = weak.WEAK
	  , has       = $.has
	  , isObject  = $.isObject
	  , isFrozen  = Object.isFrozen || $.core.Object.isFrozen
	  , tmp       = {};
	
	// 23.3 WeakMap Objects
	var WeakMap = __webpack_require__(12)('WeakMap', {
	  // 23.3.3.3 WeakMap.prototype.get(key)
	  get: function(key){
	    if(isObject(key)){
	      if(isFrozen(key))return leakStore(this).get(key);
	      if(has(key, WEAK))return key[WEAK][this[ID]];
	    }
	  },
	  // 23.3.3.5 WeakMap.prototype.set(key, value)
	  set: function(key, value){
	    return weak.def(this, key, value);
	  }
	}, weak, true, true);
	
	// IE11 WeakMap frozen keys fix
	if($.FW && new WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
	  $.each.call(['delete', 'has', 'get', 'set'], function(key){
	    var method = WeakMap.prototype[key];
	    WeakMap.prototype[key] = function(a, b){
	      // store frozen objects on leaky map
	      if(isObject(a) && isFrozen(a)){
	        var result = leakStore(this)[key](a, b);
	        return key == 'set' ? this : result;
	      // store all the rest on native weakmap
	      } return method.call(this, a, b);
	    };
	  });
	}

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var weak = __webpack_require__(21);
	
	// 23.4 WeakSet Objects
	__webpack_require__(12)('WeakSet', {
	  // 23.4.3.1 WeakSet.prototype.add(value)
	  add: function(value){
	    return weak.def(this, value, true);
	  }
	}, weak, false, true);

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/domenic/Array.prototype.includes
	var $def = __webpack_require__(2);
	$def($def.P, 'Array', {
	  includes: __webpack_require__(19)(true)
	});
	__webpack_require__(9)('includes');

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// https://gist.github.com/WebReflection/9353781
	var $       = __webpack_require__(1)
	  , $def    = __webpack_require__(2)
	  , ownKeys = __webpack_require__(22);
	
	$def($def.S, 'Object', {
	  getOwnPropertyDescriptors: function(object){
	    var O      = $.toObject(object)
	      , result = {};
	    $.each.call(ownKeys(O), function(key){
	      $.setDesc(result, key, $.desc(0, $.getDesc(O, key)));
	    });
	    return result;
	  }
	});

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	// http://goo.gl/XkBrjD
	var $    = __webpack_require__(1)
	  , $def = __webpack_require__(2);
	function createObjectToArray(isEntries){
	  return function(object){
	    var O      = $.toObject(object)
	      , keys   = $.getKeys(object)
	      , length = keys.length
	      , i      = 0
	      , result = Array(length)
	      , key;
	    if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
	    else while(length > i)result[i] = O[keys[i++]];
	    return result;
	  };
	}
	$def($def.S, 'Object', {
	  values:  createObjectToArray(false),
	  entries: createObjectToArray(true)
	});

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// https://gist.github.com/kangax/9698100
	var $def = __webpack_require__(2);
	$def($def.S, 'RegExp', {
	  escape: __webpack_require__(17)(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
	});

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// https://github.com/mathiasbynens/String.prototype.at
	var $def = __webpack_require__(2);
	$def($def.P, 'String', {
	  at: __webpack_require__(18)(true)
	});

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// JavaScript 1.6 / Strawman array statics shim
	var $       = __webpack_require__(1)
	  , $def    = __webpack_require__(2)
	  , core    = $.core
	  , statics = {};
	function setStatics(keys, length){
	  $.each.call(keys.split(','), function(key){
	    if(length == undefined && key in core.Array)statics[key] = core.Array[key];
	    else if(key in [])statics[key] = __webpack_require__(5)(Function.call, [][key], length);
	  });
	}
	setStatics('pop,reverse,shift,keys,values,entries', 1);
	setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
	setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
	           'reduce,reduceRight,copyWithin,fill,turn');
	$def($def.S, 'Array', statics);

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(25);
	var $         = __webpack_require__(1)
	  , Iterators = __webpack_require__(6).Iterators
	  , ITERATOR  = __webpack_require__(8)('iterator')
	  , NodeList  = $.g.NodeList;
	if($.FW && NodeList && !(ITERATOR in NodeList.prototype)){
	  $.hide(NodeList.prototype, ITERATOR, Iterators.Array);
	}
	Iterators.NodeList = Iterators.Array;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var $def  = __webpack_require__(2)
	  , $task = __webpack_require__(24);
	$def($def.G + $def.B, {
	  setImmediate:   $task.set,
	  clearImmediate: $task.clear
	});

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	// ie9- setTimeout & setInterval additional parameters fix
	var $       = __webpack_require__(1)
	  , $def    = __webpack_require__(2)
	  , invoke  = __webpack_require__(13)
	  , partial = __webpack_require__(35)
	  , MSIE    = !!$.g.navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
	function wrap(set){
	  return MSIE ? function(fn, time /*, ...args */){
	    return set(invoke(
	      partial,
	      [].slice.call(arguments, 2),
	      $.isFunction(fn) ? fn : Function(fn)
	    ), time);
	  } : set;
	}
	$def($def.G + $def.B + $def.F * MSIE, {
	  setTimeout:  wrap($.g.setTimeout),
	  setInterval: wrap($.g.setInterval)
	});

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(36);
	__webpack_require__(66);
	__webpack_require__(49);
	__webpack_require__(50);
	__webpack_require__(51);
	__webpack_require__(53);
	__webpack_require__(52);
	__webpack_require__(44);
	__webpack_require__(47);
	__webpack_require__(48);
	__webpack_require__(46);
	__webpack_require__(60);
	__webpack_require__(63);
	__webpack_require__(62);
	__webpack_require__(58);
	__webpack_require__(59);
	__webpack_require__(61);
	__webpack_require__(64);
	__webpack_require__(65);
	__webpack_require__(41);
	__webpack_require__(42);
	__webpack_require__(25);
	__webpack_require__(43);
	__webpack_require__(37);
	__webpack_require__(38);
	__webpack_require__(40);
	__webpack_require__(39);
	__webpack_require__(56);
	__webpack_require__(54);
	__webpack_require__(45);
	__webpack_require__(57);
	__webpack_require__(67);
	__webpack_require__(68);
	__webpack_require__(55);
	__webpack_require__(69);
	__webpack_require__(73);
	__webpack_require__(72);
	__webpack_require__(70);
	__webpack_require__(71);
	__webpack_require__(74);
	__webpack_require__(77);
	__webpack_require__(76);
	__webpack_require__(75);
	module.exports = __webpack_require__(1).core;

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Copyright (c) 2014, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
	 * additional grant of patent rights can be found in the PATENTS file in
	 * the same directory.
	 */
	
	!(function(global) {
	  "use strict";
	
	  var hasOwn = Object.prototype.hasOwnProperty;
	  var undefined; // More compressible than void 0.
	  var iteratorSymbol =
	    typeof Symbol === "function" && Symbol.iterator || "@@iterator";
	
	  var inModule = typeof module === "object";
	  var runtime = global.regeneratorRuntime;
	  if (runtime) {
	    if (inModule) {
	      // If regeneratorRuntime is defined globally and we're in a module,
	      // make the exports object identical to regeneratorRuntime.
	      module.exports = runtime;
	    }
	    // Don't bother evaluating the rest of this file if the runtime was
	    // already defined globally.
	    return;
	  }
	
	  // Define the runtime globally (as expected by generated code) as either
	  // module.exports (if we're in a module) or a new, empty object.
	  runtime = global.regeneratorRuntime = inModule ? module.exports : {};
	
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    return new Generator(innerFn, outerFn, self || null, tryLocsList || []);
	  }
	  runtime.wrap = wrap;
	
	  // Try/catch helper to minimize deoptimizations. Returns a completion
	  // record like context.tryEntries[i].completion. This interface could
	  // have been (and was previously) designed to take a closure to be
	  // invoked without arguments, but in all the cases we care about we
	  // already have an existing method we want to call, so there's no need
	  // to create a new function object. We can even get away with assuming
	  // the method takes exactly one argument, since that happens to be true
	  // in every case, so we don't have to touch the arguments object. The
	  // only additional allocation required is the completion record, which
	  // has a stable shape and so hopefully should be cheap to allocate.
	  function tryCatch(fn, obj, arg) {
	    try {
	      return { type: "normal", arg: fn.call(obj, arg) };
	    } catch (err) {
	      return { type: "throw", arg: err };
	    }
	  }
	
	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed";
	
	  // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.
	  var ContinueSentinel = {};
	
	  // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	
	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunction.displayName = "GeneratorFunction";
	
	  runtime.isGeneratorFunction = function(genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor
	      ? ctor === GeneratorFunction ||
	        // For the native GeneratorFunction constructor, the best we can
	        // do is to check its .name property.
	        (ctor.displayName || ctor.name) === "GeneratorFunction"
	      : false;
	  };
	
	  runtime.mark = function(genFun) {
	    genFun.__proto__ = GeneratorFunctionPrototype;
	    genFun.prototype = Object.create(Gp);
	    return genFun;
	  };
	
	  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
	    return new Promise(function(resolve, reject) {
	      var generator = wrap(innerFn, outerFn, self, tryLocsList);
	      var callNext = step.bind(generator.next);
	      var callThrow = step.bind(generator["throw"]);
	
	      function step(arg) {
	        var record = tryCatch(this, null, arg);
	        if (record.type === "throw") {
	          reject(record.arg);
	          return;
	        }
	
	        var info = record.arg;
	        if (info.done) {
	          resolve(info.value);
	        } else {
	          Promise.resolve(info.value).then(callNext, callThrow);
	        }
	      }
	
	      callNext();
	    });
	  };
	
	  function Generator(innerFn, outerFn, self, tryLocsList) {
	    var generator = outerFn ? Object.create(outerFn.prototype) : this;
	    var context = new Context(tryLocsList);
	    var state = GenStateSuspendedStart;
	
	    function invoke(method, arg) {
	      if (state === GenStateExecuting) {
	        throw new Error("Generator is already running");
	      }
	
	      if (state === GenStateCompleted) {
	        // Be forgiving, per 25.3.3.3.3 of the spec:
	        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	        return doneResult();
	      }
	
	      while (true) {
	        var delegate = context.delegate;
	        if (delegate) {
	          var record = tryCatch(
	            delegate.iterator[method],
	            delegate.iterator,
	            arg
	          );
	
	          if (record.type === "throw") {
	            context.delegate = null;
	
	            // Like returning generator.throw(uncaught), but without the
	            // overhead of an extra function call.
	            method = "throw";
	            arg = record.arg;
	
	            continue;
	          }
	
	          // Delegate generator ran and handled its own exceptions so
	          // regardless of what the method was, we continue as if it is
	          // "next" with an undefined arg.
	          method = "next";
	          arg = undefined;
	
	          var info = record.arg;
	          if (info.done) {
	            context[delegate.resultName] = info.value;
	            context.next = delegate.nextLoc;
	          } else {
	            state = GenStateSuspendedYield;
	            return info;
	          }
	
	          context.delegate = null;
	        }
	
	        if (method === "next") {
	          if (state === GenStateSuspendedStart &&
	              typeof arg !== "undefined") {
	            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
	            throw new TypeError(
	              "attempt to send " + JSON.stringify(arg) + " to newborn generator"
	            );
	          }
	
	          if (state === GenStateSuspendedYield) {
	            context.sent = arg;
	          } else {
	            delete context.sent;
	          }
	
	        } else if (method === "throw") {
	          if (state === GenStateSuspendedStart) {
	            state = GenStateCompleted;
	            throw arg;
	          }
	
	          if (context.dispatchException(arg)) {
	            // If the dispatched exception was caught by a catch block,
	            // then let that catch block handle the exception normally.
	            method = "next";
	            arg = undefined;
	          }
	
	        } else if (method === "return") {
	          context.abrupt("return", arg);
	        }
	
	        state = GenStateExecuting;
	
	        var record = tryCatch(innerFn, self, context);
	        if (record.type === "normal") {
	          // If an exception is thrown from innerFn, we leave state ===
	          // GenStateExecuting and loop back for another invocation.
	          state = context.done
	            ? GenStateCompleted
	            : GenStateSuspendedYield;
	
	          var info = {
	            value: record.arg,
	            done: context.done
	          };
	
	          if (record.arg === ContinueSentinel) {
	            if (context.delegate && method === "next") {
	              // Deliberately forget the last sent value so that we don't
	              // accidentally pass it on to the delegate.
	              arg = undefined;
	            }
	          } else {
	            return info;
	          }
	
	        } else if (record.type === "throw") {
	          state = GenStateCompleted;
	
	          if (method === "next") {
	            context.dispatchException(record.arg);
	          } else {
	            arg = record.arg;
	          }
	        }
	      }
	    }
	
	    generator.next = invoke.bind(generator, "next");
	    generator["throw"] = invoke.bind(generator, "throw");
	    generator["return"] = invoke.bind(generator, "return");
	
	    return generator;
	  }
	
	  Gp[iteratorSymbol] = function() {
	    return this;
	  };
	
	  Gp.toString = function() {
	    return "[object Generator]";
	  };
	
	  function pushTryEntry(locs) {
	    var entry = { tryLoc: locs[0] };
	
	    if (1 in locs) {
	      entry.catchLoc = locs[1];
	    }
	
	    if (2 in locs) {
	      entry.finallyLoc = locs[2];
	      entry.afterLoc = locs[3];
	    }
	
	    this.tryEntries.push(entry);
	  }
	
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal";
	    delete record.arg;
	    entry.completion = record;
	  }
	
	  function Context(tryLocsList) {
	    // The root entry object (effectively a try statement without a catch
	    // or a finally block) gives us a place to store values thrown from
	    // locations where there is no enclosing try statement.
	    this.tryEntries = [{ tryLoc: "root" }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset();
	  }
	
	  runtime.keys = function(object) {
	    var keys = [];
	    for (var key in object) {
	      keys.push(key);
	    }
	    keys.reverse();
	
	    // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.
	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();
	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      }
	
	      // To avoid creating an additional object, we just hang the .value
	      // and .done properties off the next function object itself. This
	      // also ensures that the minifier will not anonymize the function.
	      next.done = true;
	      return next;
	    };
	  };
	
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) {
	        return iteratorMethod.call(iterable);
	      }
	
	      if (typeof iterable.next === "function") {
	        return iterable;
	      }
	
	      if (!isNaN(iterable.length)) {
	        var i = -1, next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }
	
	          next.value = undefined;
	          next.done = true;
	
	          return next;
	        };
	
	        return next.next = next;
	      }
	    }
	
	    // Return an iterator with no values.
	    return { next: doneResult };
	  }
	  runtime.values = values;
	
	  function doneResult() {
	    return { value: undefined, done: true };
	  }
	
	  Context.prototype = {
	    constructor: Context,
	
	    reset: function() {
	      this.prev = 0;
	      this.next = 0;
	      this.sent = undefined;
	      this.done = false;
	      this.delegate = null;
	
	      this.tryEntries.forEach(resetTryEntry);
	
	      // Pre-initialize at least 20 temporary variables to enable hidden
	      // class optimizations for simple generators.
	      for (var tempIndex = 0, tempName;
	           hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20;
	           ++tempIndex) {
	        this[tempName] = null;
	      }
	    },
	
	    stop: function() {
	      this.done = true;
	
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;
	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }
	
	      return this.rval;
	    },
	
	    dispatchException: function(exception) {
	      if (this.done) {
	        throw exception;
	      }
	
	      var context = this;
	      function handle(loc, caught) {
	        record.type = "throw";
	        record.arg = exception;
	        context.next = loc;
	        return !!caught;
	      }
	
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        var record = entry.completion;
	
	        if (entry.tryLoc === "root") {
	          // Exception thrown outside of any try block that could handle
	          // it, so set the completion value of the entire function to
	          // throw the exception.
	          return handle("end");
	        }
	
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc");
	          var hasFinally = hasOwn.call(entry, "finallyLoc");
	
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            } else if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) {
	              return handle(entry.catchLoc, true);
	            }
	
	          } else if (hasFinally) {
	            if (this.prev < entry.finallyLoc) {
	              return handle(entry.finallyLoc);
	            }
	
	          } else {
	            throw new Error("try statement without catch or finally");
	          }
	        }
	      }
	    },
	
	    abrupt: function(type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev &&
	            hasOwn.call(entry, "finallyLoc") &&
	            this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	
	      if (finallyEntry &&
	          (type === "break" ||
	           type === "continue") &&
	          finallyEntry.tryLoc <= arg &&
	          arg < finallyEntry.finallyLoc) {
	        // Ignore the finally entry if control is not jumping to a
	        // location outside the try/catch block.
	        finallyEntry = null;
	      }
	
	      var record = finallyEntry ? finallyEntry.completion : {};
	      record.type = type;
	      record.arg = arg;
	
	      if (finallyEntry) {
	        this.next = finallyEntry.finallyLoc;
	      } else {
	        this.complete(record);
	      }
	
	      return ContinueSentinel;
	    },
	
	    complete: function(record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }
	
	      if (record.type === "break" ||
	          record.type === "continue") {
	        this.next = record.arg;
	      } else if (record.type === "return") {
	        this.rval = record.arg;
	        this.next = "end";
	      } else if (record.type === "normal" && afterLoc) {
	        this.next = afterLoc;
	      }
	
	      return ContinueSentinel;
	    },
	
	    finish: function(finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) {
	          return this.complete(entry.completion, entry.afterLoc);
	        }
	      }
	    },
	
	    "catch": function(tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if (record.type === "throw") {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	
	      // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.
	      throw new Error("illegal catch attempt");
	    },
	
	    delegateYield: function(iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };
	
	      return ContinueSentinel;
	    }
	  };
	})(
	  // Among the various tricks for obtaining a reference to the global
	  // object, this seems to be the most reliable technique that does not
	  // use indirect eval (which violates Content Security Policy).
	  typeof global === "object" ? global :
	  typeof window === "object" ? window : this
	);
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(31);


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	var _import = __webpack_require__(27);
	
	var Worker = _interopRequireWildcard(_import);
	
	var _import2 = __webpack_require__(26);
	
	var PeerServer = _interopRequireWildcard(_import2);
	
	var _import3 = __webpack_require__(82);
	
	var PeerHandlers = _interopRequireWildcard(_import3);
	
	var _import4 = __webpack_require__(83);
	
	var WorkerHandlers = _interopRequireWildcard(_import4);
	
	var peer = null;
	
	var ready = PeerServer.startServer('txhk8bqkc2pam7vi').then(function () {
	  return Worker.sendMessage({
	    request: 'ready',
	    ready: true
	  });
	});
	
	// peer handlers
	PeerServer.on('file', PeerHandlers.getFile);
	
	// worker handlers
	Worker.on('file-from-user', WorkerHandlers.getFile);
	Worker.on('peer-id', WorkerHandlers.getPeerId);

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.getFile = getFile;
	
	var _import = __webpack_require__(27);
	
	var Worker = _interopRequireWildcard(_import);
	
	function getFile(req, res) {
	  Worker.sendMessage({
	    request: 'file',
	    file: req.file
	  }).then(function (data) {
	    res(data);
	  });
	}

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports.getFile = getFile;
	exports.getPeerId = getPeerId;
	
	var _import = __webpack_require__(26);
	
	var PeerServer = _interopRequireWildcard(_import);
	
	function getFile(data) {
	  return new Promise(function (resolve, reject) {
	    PeerServer.connectToPeer(data.peerId).then(function () {
	      PeerServer.sendRequest(data.peerId, {
	        type: 'request',
	        request: {
	          file: data.url
	        }
	      }, function (err, file) {
	        if (err) {
	          return reject(err);
	        }
	
	        resolve(file);
	      });
	    });
	  });
	}
	
	function getPeerId() {
	  return new Promise(function (resolve, reject) {
	    resolve(PeerServer.peerId);
	  });
	}

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(80);


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;//     uuid.js
	//
	//     Copyright (c) 2010-2012 Robert Kieffer
	//     MIT License - http://opensource.org/licenses/mit-license.php
	
	(function() {
	  var _global = this;
	
	  // Unique ID creation requires a high quality random # generator.  We feature
	  // detect to determine the best RNG source, normalizing to a function that
	  // returns 128-bits of randomness, since that's what's usually required
	  var _rng;
	
	  // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
	  //
	  // Moderately fast, high quality
	  if (typeof(_global.require) == 'function') {
	    try {
	      var _rb = _global.require('crypto').randomBytes;
	      _rng = _rb && function() {return _rb(16);};
	    } catch(e) {}
	  }
	
	  if (!_rng && _global.crypto && crypto.getRandomValues) {
	    // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
	    //
	    // Moderately fast, high quality
	    var _rnds8 = new Uint8Array(16);
	    _rng = function whatwgRNG() {
	      crypto.getRandomValues(_rnds8);
	      return _rnds8;
	    };
	  }
	
	  if (!_rng) {
	    // Math.random()-based (RNG)
	    //
	    // If all else fails, use Math.random().  It's fast, but is of unspecified
	    // quality.
	    var  _rnds = new Array(16);
	    _rng = function() {
	      for (var i = 0, r; i < 16; i++) {
	        if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
	        _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
	      }
	
	      return _rnds;
	    };
	  }
	
	  // Buffer class to use
	  var BufferClass = typeof(_global.Buffer) == 'function' ? _global.Buffer : Array;
	
	  // Maps for number <-> hex string conversion
	  var _byteToHex = [];
	  var _hexToByte = {};
	  for (var i = 0; i < 256; i++) {
	    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
	    _hexToByte[_byteToHex[i]] = i;
	  }
	
	  // **`parse()` - Parse a UUID into it's component bytes**
	  function parse(s, buf, offset) {
	    var i = (buf && offset) || 0, ii = 0;
	
	    buf = buf || [];
	    s.toLowerCase().replace(/[0-9a-f]{2}/g, function(oct) {
	      if (ii < 16) { // Don't overflow!
	        buf[i + ii++] = _hexToByte[oct];
	      }
	    });
	
	    // Zero out remaining bytes if string was short
	    while (ii < 16) {
	      buf[i + ii++] = 0;
	    }
	
	    return buf;
	  }
	
	  // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
	  function unparse(buf, offset) {
	    var i = offset || 0, bth = _byteToHex;
	    return  bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] + '-' +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]] +
	            bth[buf[i++]] + bth[buf[i++]];
	  }
	
	  // **`v1()` - Generate time-based UUID**
	  //
	  // Inspired by https://github.com/LiosK/UUID.js
	  // and http://docs.python.org/library/uuid.html
	
	  // random #'s we need to init node and clockseq
	  var _seedBytes = _rng();
	
	  // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
	  var _nodeId = [
	    _seedBytes[0] | 0x01,
	    _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
	  ];
	
	  // Per 4.2.2, randomize (14 bit) clockseq
	  var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;
	
	  // Previous uuid creation time
	  var _lastMSecs = 0, _lastNSecs = 0;
	
	  // See https://github.com/broofa/node-uuid for API details
	  function v1(options, buf, offset) {
	    var i = buf && offset || 0;
	    var b = buf || [];
	
	    options = options || {};
	
	    var clockseq = options.clockseq != null ? options.clockseq : _clockseq;
	
	    // UUID timestamps are 100 nano-second units since the Gregorian epoch,
	    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
	    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
	    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
	    var msecs = options.msecs != null ? options.msecs : new Date().getTime();
	
	    // Per 4.2.1.2, use count of uuid's generated during the current clock
	    // cycle to simulate higher resolution clock
	    var nsecs = options.nsecs != null ? options.nsecs : _lastNSecs + 1;
	
	    // Time since last uuid creation (in msecs)
	    var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;
	
	    // Per 4.2.1.2, Bump clockseq on clock regression
	    if (dt < 0 && options.clockseq == null) {
	      clockseq = clockseq + 1 & 0x3fff;
	    }
	
	    // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
	    // time interval
	    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
	      nsecs = 0;
	    }
	
	    // Per 4.2.1.2 Throw error if too many uuids are requested
	    if (nsecs >= 10000) {
	      throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
	    }
	
	    _lastMSecs = msecs;
	    _lastNSecs = nsecs;
	    _clockseq = clockseq;
	
	    // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
	    msecs += 12219292800000;
	
	    // `time_low`
	    var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
	    b[i++] = tl >>> 24 & 0xff;
	    b[i++] = tl >>> 16 & 0xff;
	    b[i++] = tl >>> 8 & 0xff;
	    b[i++] = tl & 0xff;
	
	    // `time_mid`
	    var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
	    b[i++] = tmh >>> 8 & 0xff;
	    b[i++] = tmh & 0xff;
	
	    // `time_high_and_version`
	    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
	    b[i++] = tmh >>> 16 & 0xff;
	
	    // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
	    b[i++] = clockseq >>> 8 | 0x80;
	
	    // `clock_seq_low`
	    b[i++] = clockseq & 0xff;
	
	    // `node`
	    var node = options.node || _nodeId;
	    for (var n = 0; n < 6; n++) {
	      b[i + n] = node[n];
	    }
	
	    return buf ? buf : unparse(b);
	  }
	
	  // **`v4()` - Generate random UUID**
	
	  // See https://github.com/broofa/node-uuid for API details
	  function v4(options, buf, offset) {
	    // Deprecated - 'format' argument, as supported in v1.2
	    var i = buf && offset || 0;
	
	    if (typeof(options) == 'string') {
	      buf = options == 'binary' ? new BufferClass(16) : null;
	      options = null;
	    }
	    options = options || {};
	
	    var rnds = options.random || (options.rng || _rng)();
	
	    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
	    rnds[6] = (rnds[6] & 0x0f) | 0x40;
	    rnds[8] = (rnds[8] & 0x3f) | 0x80;
	
	    // Copy bytes to buffer, if provided
	    if (buf) {
	      for (var ii = 0; ii < 16; ii++) {
	        buf[i + ii] = rnds[ii];
	      }
	    }
	
	    return buf || unparse(rnds);
	  }
	
	  // Export public API
	  var uuid = v4;
	  uuid.v1 = v1;
	  uuid.v4 = v4;
	  uuid.parse = parse;
	  uuid.unparse = unparse;
	  uuid.BufferClass = BufferClass;
	
	  if (typeof(module) != 'undefined' && module.exports) {
	    // Publish as node.js module
	    module.exports = uuid;
	  } else  if (true) {
	    // Publish as AMD module
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {return uuid;}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	 
	
	  } else {
	    // Publish as global (in browsers)
	    var _previousRoot = _global.uuid;
	
	    // **`noConflict()` - (browser only) to reset global 'uuid' var**
	    uuid.noConflict = function() {
	      _global.uuid = _previousRoot;
	      return uuid;
	    };
	
	    _global.uuid = uuid;
	  }
	}).call(this);


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(10);
	var EventEmitter = __webpack_require__(16);
	var Negotiator = __webpack_require__(28);
	var Reliable = __webpack_require__(90);
	
	/**
	 * Wraps a DataChannel between two Peers.
	 */
	function DataConnection(peer, provider, options) {
	  if (!(this instanceof DataConnection)) return new DataConnection(peer, provider, options);
	  EventEmitter.call(this);
	
	  this.options = util.extend({
	    serialization: 'binary',
	    reliable: false
	  }, options);
	
	  // Connection is not open yet.
	  this.open = false;
	  this.type = 'data';
	  this.peer = peer;
	  this.provider = provider;
	
	  this.id = this.options.connectionId || DataConnection._idPrefix + util.randomToken();
	
	  this.label = this.options.label || this.id;
	  this.metadata = this.options.metadata;
	  this.serialization = this.options.serialization;
	  this.reliable = this.options.reliable;
	
	  // Data channel buffering.
	  this._buffer = [];
	  this._buffering = false;
	  this.bufferSize = 0;
	
	  // For storing large data.
	  this._chunkedData = {};
	
	  if (this.options._payload) {
	    this._peerBrowser = this.options._payload.browser;
	  }
	
	  Negotiator.startConnection(
	    this,
	    this.options._payload || {
	      originator: true
	    }
	  );
	}
	
	util.inherits(DataConnection, EventEmitter);
	
	DataConnection._idPrefix = 'dc_';
	
	/** Called by the Negotiator when the DataChannel is ready. */
	DataConnection.prototype.initialize = function(dc) {
	  this._dc = this.dataChannel = dc;
	  this._configureDataChannel();
	}
	
	DataConnection.prototype._configureDataChannel = function() {
	  var self = this;
	  if (util.supports.sctp) {
	    this._dc.binaryType = 'arraybuffer';
	  }
	  this._dc.onopen = function() {
	    util.log('Data channel connection success');
	    self.open = true;
	    self.emit('open');
	  }
	
	  // Use the Reliable shim for non Firefox browsers
	  if (!util.supports.sctp && this.reliable) {
	    this._reliable = new Reliable(this._dc, util.debug);
	  }
	
	  if (this._reliable) {
	    this._reliable.onmessage = function(msg) {
	      self.emit('data', msg);
	    };
	  } else {
	    this._dc.onmessage = function(e) {
	      self._handleDataMessage(e);
	    };
	  }
	  this._dc.onclose = function(e) {
	    util.log('DataChannel closed for:', self.peer);
	    self.close();
	  };
	}
	
	// Handles a DataChannel message.
	DataConnection.prototype._handleDataMessage = function(e) {
	  var self = this;
	  var data = e.data;
	  var datatype = data.constructor;
	  if (this.serialization === 'binary' || this.serialization === 'binary-utf8') {
	    if (datatype === Blob) {
	      // Datatype should never be blob
	      util.blobToArrayBuffer(data, function(ab) {
	        data = util.unpack(ab);
	        self.emit('data', data);
	      });
	      return;
	    } else if (datatype === ArrayBuffer) {
	      data = util.unpack(data);
	    } else if (datatype === String) {
	      // String fallback for binary data for browsers that don't support binary yet
	      var ab = util.binaryStringToArrayBuffer(data);
	      data = util.unpack(ab);
	    }
	  } else if (this.serialization === 'json') {
	    data = JSON.parse(data);
	  }
	
	  // Check if we've chunked--if so, piece things back together.
	  // We're guaranteed that this isn't 0.
	  if (data.__peerData) {
	    var id = data.__peerData;
	    var chunkInfo = this._chunkedData[id] || {data: [], count: 0, total: data.total};
	
	    chunkInfo.data[data.n] = data.data;
	    chunkInfo.count += 1;
	
	    if (chunkInfo.total === chunkInfo.count) {
	      // Clean up before making the recursive call to `_handleDataMessage`.
	      delete this._chunkedData[id];
	
	      // We've received all the chunks--time to construct the complete data.
	      data = new Blob(chunkInfo.data);
	      this._handleDataMessage({data: data});
	    }
	
	    this._chunkedData[id] = chunkInfo;
	    return;
	  }
	
	  this.emit('data', data);
	}
	
	/**
	 * Exposed functionality for users.
	 */
	
	/** Allows user to close connection. */
	DataConnection.prototype.close = function() {
	  if (!this.open) {
	    return;
	  }
	  this.open = false;
	  Negotiator.cleanup(this);
	  this.emit('close');
	}
	
	/** Allows user to send data. */
	DataConnection.prototype.send = function(data, chunked) {
	  if (!this.open) {
	    this.emit('error', new Error('Connection is not open. You should listen for the `open` event before sending messages.'));
	    return;
	  }
	  if (this._reliable) {
	    // Note: reliable shim sending will make it so that you cannot customize
	    // serialization.
	    this._reliable.send(data);
	    return;
	  }
	  var self = this;
	  if (this.serialization === 'json') {
	    this._bufferedSend(JSON.stringify(data));
	  } else if (this.serialization === 'binary' || this.serialization === 'binary-utf8') {
	    var blob = util.pack(data);
	
	    // For Chrome-Firefox interoperability, we need to make Firefox "chunk"
	    // the data it sends out.
	    var needsChunking = util.chunkedBrowsers[this._peerBrowser] || util.chunkedBrowsers[util.browser];
	    if (needsChunking && !chunked && blob.size > util.chunkedMTU) {
	      this._sendChunks(blob);
	      return;
	    }
	
	    // DataChannel currently only supports strings.
	    if (!util.supports.sctp) {
	      util.blobToBinaryString(blob, function(str) {
	        self._bufferedSend(str);
	      });
	    } else if (!util.supports.binaryBlob) {
	      // We only do this if we really need to (e.g. blobs are not supported),
	      // because this conversion is costly.
	      util.blobToArrayBuffer(blob, function(ab) {
	        self._bufferedSend(ab);
	      });
	    } else {
	      this._bufferedSend(blob);
	    }
	  } else {
	    this._bufferedSend(data);
	  }
	}
	
	DataConnection.prototype._bufferedSend = function(msg) {
	  if (this._buffering || !this._trySend(msg)) {
	    this._buffer.push(msg);
	    this.bufferSize = this._buffer.length;
	  }
	}
	
	// Returns true if the send succeeds.
	DataConnection.prototype._trySend = function(msg) {
	  try {
	    this._dc.send(msg);
	  } catch (e) {
	    this._buffering = true;
	
	    var self = this;
	    setTimeout(function() {
	      // Try again.
	      self._buffering = false;
	      self._tryBuffer();
	    }, 100);
	    return false;
	  }
	  return true;
	}
	
	// Try to send the first message in the buffer.
	DataConnection.prototype._tryBuffer = function() {
	  if (this._buffer.length === 0) {
	    return;
	  }
	
	  var msg = this._buffer[0];
	
	  if (this._trySend(msg)) {
	    this._buffer.shift();
	    this.bufferSize = this._buffer.length;
	    this._tryBuffer();
	  }
	}
	
	DataConnection.prototype._sendChunks = function(blob) {
	  var blobs = util.chunk(blob);
	  for (var i = 0, ii = blobs.length; i < ii; i += 1) {
	    var blob = blobs[i];
	    this.send(blob, true);
	  }
	}
	
	DataConnection.prototype.handleMessage = function(message) {
	  var payload = message.payload;
	
	  switch (message.type) {
	    case 'ANSWER':
	      this._peerBrowser = payload.browser;
	
	      // Forward to negotiator
	      Negotiator.handleSDP(message.type, this, payload.sdp);
	      break;
	    case 'CANDIDATE':
	      Negotiator.handleCandidate(this, payload.candidate);
	      break;
	    default:
	      util.warn('Unrecognized message type:', message.type, 'from peer:', this.peer);
	      break;
	  }
	}
	
	module.exports = DataConnection;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(10);
	var EventEmitter = __webpack_require__(16);
	var Negotiator = __webpack_require__(28);
	
	/**
	 * Wraps the streaming interface between two Peers.
	 */
	function MediaConnection(peer, provider, options) {
	  if (!(this instanceof MediaConnection)) return new MediaConnection(peer, provider, options);
	  EventEmitter.call(this);
	
	  this.options = util.extend({}, options);
	
	  this.open = false;
	  this.type = 'media';
	  this.peer = peer;
	  this.provider = provider;
	  this.metadata = this.options.metadata;
	  this.localStream = this.options._stream;
	
	  this.id = this.options.connectionId || MediaConnection._idPrefix + util.randomToken();
	  if (this.localStream) {
	    Negotiator.startConnection(
	      this,
	      {_stream: this.localStream, originator: true}
	    );
	  }
	};
	
	util.inherits(MediaConnection, EventEmitter);
	
	MediaConnection._idPrefix = 'mc_';
	
	MediaConnection.prototype.addStream = function(remoteStream) {
	  util.log('Receiving stream', remoteStream);
	
	  this.remoteStream = remoteStream;
	  this.emit('stream', remoteStream); // Should we call this `open`?
	
	};
	
	MediaConnection.prototype.handleMessage = function(message) {
	  var payload = message.payload;
	
	  switch (message.type) {
	    case 'ANSWER':
	      // Forward to negotiator
	      Negotiator.handleSDP(message.type, this, payload.sdp);
	      this.open = true;
	      break;
	    case 'CANDIDATE':
	      Negotiator.handleCandidate(this, payload.candidate);
	      break;
	    default:
	      util.warn('Unrecognized message type:', message.type, 'from peer:', this.peer);
	      break;
	  }
	}
	
	MediaConnection.prototype.answer = function(stream) {
	  if (this.localStream) {
	    util.warn('Local stream already exists on this MediaConnection. Are you answering a call twice?');
	    return;
	  }
	
	  this.options._payload._stream = stream;
	
	  this.localStream = stream;
	  Negotiator.startConnection(
	    this,
	    this.options._payload
	  )
	  // Retrieve lost messages stored because PeerConnection not set up.
	  var messages = this.provider._getMessages(this.id);
	  for (var i = 0, ii = messages.length; i < ii; i += 1) {
	    this.handleMessage(messages[i]);
	  }
	  this.open = true;
	};
	
	/**
	 * Exposed functionality for users.
	 */
	
	/** Allows user to close connection. */
	MediaConnection.prototype.close = function() {
	  if (!this.open) {
	    return;
	  }
	  this.open = false;
	  Negotiator.cleanup(this);
	  this.emit('close')
	};
	
	module.exports = MediaConnection;


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(10);
	var EventEmitter = __webpack_require__(16);
	var Socket = __webpack_require__(89);
	var MediaConnection = __webpack_require__(87);
	var DataConnection = __webpack_require__(86);
	
	/**
	 * A peer who can initiate connections with other peers.
	 */
	function Peer(id, options) {
	  if (!(this instanceof Peer)) return new Peer(id, options);
	  EventEmitter.call(this);
	
	  // Deal with overloading
	  if (id && id.constructor == Object) {
	    options = id;
	    id = undefined;
	  } else if (id) {
	    // Ensure id is a string
	    id = id.toString();
	  }
	  //
	
	  // Configurize options
	  options = util.extend({
	    debug: 0, // 1: Errors, 2: Warnings, 3: All logs
	    host: util.CLOUD_HOST,
	    port: util.CLOUD_PORT,
	    key: 'peerjs',
	    path: '/',
	    token: util.randomToken(),
	    config: util.defaultConfig
	  }, options);
	  this.options = options;
	  // Detect relative URL host.
	  if (options.host === '/') {
	    options.host = window.location.hostname;
	  }
	  // Set path correctly.
	  if (options.path[0] !== '/') {
	    options.path = '/' + options.path;
	  }
	  if (options.path[options.path.length - 1] !== '/') {
	    options.path += '/';
	  }
	
	  // Set whether we use SSL to same as current host
	  if (options.secure === undefined && options.host !== util.CLOUD_HOST) {
	    options.secure = util.isSecure();
	  }
	  // Set a custom log function if present
	  if (options.logFunction) {
	    util.setLogFunction(options.logFunction);
	  }
	  util.setLogLevel(options.debug);
	  //
	
	  // Sanity checks
	  // Ensure WebRTC supported
	  if (!util.supports.audioVideo && !util.supports.data ) {
	    this._delayedAbort('browser-incompatible', 'The current browser does not support WebRTC');
	    return;
	  }
	  // Ensure alphanumeric id
	  if (!util.validateId(id)) {
	    this._delayedAbort('invalid-id', 'ID "' + id + '" is invalid');
	    return;
	  }
	  // Ensure valid key
	  if (!util.validateKey(options.key)) {
	    this._delayedAbort('invalid-key', 'API KEY "' + options.key + '" is invalid');
	    return;
	  }
	  // Ensure not using unsecure cloud server on SSL page
	  if (options.secure && options.host === '0.peerjs.com') {
	    this._delayedAbort('ssl-unavailable',
	      'The cloud server currently does not support HTTPS. Please run your own PeerServer to use HTTPS.');
	    return;
	  }
	  //
	
	  // States.
	  this.destroyed = false; // Connections have been killed
	  this.disconnected = false; // Connection to PeerServer killed but P2P connections still active
	  this.open = false; // Sockets and such are not yet open.
	  //
	
	  // References
	  this.connections = {}; // DataConnections for this peer.
	  this._lostMessages = {}; // src => [list of messages]
	  //
	
	  // Start the server connection
	  this._initializeServerConnection();
	  if (id) {
	    this._initialize(id);
	  } else {
	    this._retrieveId();
	  }
	  //
	}
	
	util.inherits(Peer, EventEmitter);
	
	// Initialize the 'socket' (which is actually a mix of XHR streaming and
	// websockets.)
	Peer.prototype._initializeServerConnection = function() {
	  var self = this;
	  this.socket = new Socket(this.options.secure, this.options.host, this.options.port, this.options.path, this.options.key);
	  this.socket.on('message', function(data) {
	    self._handleMessage(data);
	  });
	  this.socket.on('error', function(error) {
	    self._abort('socket-error', error);
	  });
	  this.socket.on('disconnected', function() {
	    // If we haven't explicitly disconnected, emit error and disconnect.
	    if (!self.disconnected) {
	      self.emitError('network', 'Lost connection to server.');
	      self.disconnect();
	    }
	  });
	  this.socket.on('close', function() {
	    // If we haven't explicitly disconnected, emit error.
	    if (!self.disconnected) {
	      self._abort('socket-closed', 'Underlying socket is already closed.');
	    }
	  });
	};
	
	/** Get a unique ID from the server via XHR. */
	Peer.prototype._retrieveId = function(cb) {
	  var self = this;
	  var http = new XMLHttpRequest();
	  var protocol = this.options.secure ? 'https://' : 'http://';
	  var url = protocol + this.options.host + ':' + this.options.port +
	    this.options.path + this.options.key + '/id';
	  var queryString = '?ts=' + new Date().getTime() + '' + Math.random();
	  url += queryString;
	
	  // If there's no ID we need to wait for one before trying to init socket.
	  http.open('get', url, true);
	  http.onerror = function(e) {
	    util.error('Error retrieving ID', e);
	    var pathError = '';
	    if (self.options.path === '/' && self.options.host !== util.CLOUD_HOST) {
	      pathError = ' If you passed in a `path` to your self-hosted PeerServer, ' +
	        'you\'ll also need to pass in that same path when creating a new ' +
	        'Peer.';
	    }
	    self._abort('server-error', 'Could not get an ID from the server.' + pathError);
	  };
	  http.onreadystatechange = function() {
	    if (http.readyState !== 4) {
	      return;
	    }
	    if (http.status !== 200) {
	      http.onerror();
	      return;
	    }
	    self._initialize(http.responseText);
	  };
	  http.send(null);
	};
	
	/** Initialize a connection with the server. */
	Peer.prototype._initialize = function(id) {
	  this.id = id;
	  this.socket.start(this.id, this.options.token);
	};
	
	/** Handles messages from the server. */
	Peer.prototype._handleMessage = function(message) {
	  var type = message.type;
	  var payload = message.payload;
	  var peer = message.src;
	  var connection;
	
	  switch (type) {
	    case 'OPEN': // The connection to the server is open.
	      this.emit('open', this.id);
	      this.open = true;
	      break;
	    case 'ERROR': // Server error.
	      this._abort('server-error', payload.msg);
	      break;
	    case 'ID-TAKEN': // The selected ID is taken.
	      this._abort('unavailable-id', 'ID `' + this.id + '` is taken');
	      break;
	    case 'INVALID-KEY': // The given API key cannot be found.
	      this._abort('invalid-key', 'API KEY "' + this.options.key + '" is invalid');
	      break;
	
	    //
	    case 'LEAVE': // Another peer has closed its connection to this peer.
	      util.log('Received leave message from', peer);
	      this._cleanupPeer(peer);
	      break;
	
	    case 'EXPIRE': // The offer sent to a peer has expired without response.
	      this.emitError('peer-unavailable', 'Could not connect to peer ' + peer);
	      break;
	    case 'OFFER': // we should consider switching this to CALL/CONNECT, but this is the least breaking option.
	      var connectionId = payload.connectionId;
	      connection = this.getConnection(peer, connectionId);
	
	      if (connection) {
	        util.warn('Offer received for existing Connection ID:', connectionId);
	        //connection.handleMessage(message);
	      } else {
	        // Create a new connection.
	        if (payload.type === 'media') {
	          connection = new MediaConnection(peer, this, {
	            connectionId: connectionId,
	            _payload: payload,
	            metadata: payload.metadata
	          });
	          this._addConnection(peer, connection);
	          this.emit('call', connection);
	        } else if (payload.type === 'data') {
	          connection = new DataConnection(peer, this, {
	            connectionId: connectionId,
	            _payload: payload,
	            metadata: payload.metadata,
	            label: payload.label,
	            serialization: payload.serialization,
	            reliable: payload.reliable
	          });
	          this._addConnection(peer, connection);
	          this.emit('connection', connection);
	        } else {
	          util.warn('Received malformed connection type:', payload.type);
	          return;
	        }
	        // Find messages.
	        var messages = this._getMessages(connectionId);
	        for (var i = 0, ii = messages.length; i < ii; i += 1) {
	          connection.handleMessage(messages[i]);
	        }
	      }
	      break;
	    default:
	      if (!payload) {
	        util.warn('You received a malformed message from ' + peer + ' of type ' + type);
	        return;
	      }
	
	      var id = payload.connectionId;
	      connection = this.getConnection(peer, id);
	
	      if (connection && connection.pc) {
	        // Pass it on.
	        connection.handleMessage(message);
	      } else if (id) {
	        // Store for possible later use
	        this._storeMessage(id, message);
	      } else {
	        util.warn('You received an unrecognized message:', message);
	      }
	      break;
	  }
	};
	
	/** Stores messages without a set up connection, to be claimed later. */
	Peer.prototype._storeMessage = function(connectionId, message) {
	  if (!this._lostMessages[connectionId]) {
	    this._lostMessages[connectionId] = [];
	  }
	  this._lostMessages[connectionId].push(message);
	};
	
	/** Retrieve messages from lost message store */
	Peer.prototype._getMessages = function(connectionId) {
	  var messages = this._lostMessages[connectionId];
	  if (messages) {
	    delete this._lostMessages[connectionId];
	    return messages;
	  } else {
	    return [];
	  }
	};
	
	/**
	 * Returns a DataConnection to the specified peer. See documentation for a
	 * complete list of options.
	 */
	Peer.prototype.connect = function(peer, options) {
	  if (this.disconnected) {
	    util.warn('You cannot connect to a new Peer because you called ' +
	      '.disconnect() on this Peer and ended your connection with the ' +
	      'server. You can create a new Peer to reconnect, or call reconnect ' +
	      'on this peer if you believe its ID to still be available.');
	    this.emitError('disconnected', 'Cannot connect to new Peer after disconnecting from server.');
	    return;
	  }
	  var connection = new DataConnection(peer, this, options);
	  this._addConnection(peer, connection);
	  return connection;
	};
	
	/**
	 * Returns a MediaConnection to the specified peer. See documentation for a
	 * complete list of options.
	 */
	Peer.prototype.call = function(peer, stream, options) {
	  if (this.disconnected) {
	    util.warn('You cannot connect to a new Peer because you called ' +
	      '.disconnect() on this Peer and ended your connection with the ' +
	      'server. You can create a new Peer to reconnect.');
	    this.emitError('disconnected', 'Cannot connect to new Peer after disconnecting from server.');
	    return;
	  }
	  if (!stream) {
	    util.error('To call a peer, you must provide a stream from your browser\'s `getUserMedia`.');
	    return;
	  }
	  options = options || {};
	  options._stream = stream;
	  var call = new MediaConnection(peer, this, options);
	  this._addConnection(peer, call);
	  return call;
	};
	
	/** Add a data/media connection to this peer. */
	Peer.prototype._addConnection = function(peer, connection) {
	  if (!this.connections[peer]) {
	    this.connections[peer] = [];
	  }
	  this.connections[peer].push(connection);
	};
	
	/** Retrieve a data/media connection for this peer. */
	Peer.prototype.getConnection = function(peer, id) {
	  var connections = this.connections[peer];
	  if (!connections) {
	    return null;
	  }
	  for (var i = 0, ii = connections.length; i < ii; i++) {
	    if (connections[i].id === id) {
	      return connections[i];
	    }
	  }
	  return null;
	};
	
	Peer.prototype._delayedAbort = function(type, message) {
	  var self = this;
	  util.setZeroTimeout(function(){
	    self._abort(type, message);
	  });
	};
	
	/**
	 * Destroys the Peer and emits an error message.
	 * The Peer is not destroyed if it's in a disconnected state, in which case
	 * it retains its disconnected state and its existing connections.
	 */
	Peer.prototype._abort = function(type, message) {
	  util.error('Aborting!');
	  if (!this._lastServerId) {
	    this.destroy();
	  } else {
	    this.disconnect();
	  }
	  this.emitError(type, message);
	};
	
	/** Emits a typed error message. */
	Peer.prototype.emitError = function(type, err) {
	  util.error('Error:', err);
	  if (typeof err === 'string') {
	    err = new Error(err);
	  }
	  err.type = type;
	  this.emit('error', err);
	};
	
	/**
	 * Destroys the Peer: closes all active connections as well as the connection
	 *  to the server.
	 * Warning: The peer can no longer create or accept connections after being
	 *  destroyed.
	 */
	Peer.prototype.destroy = function() {
	  if (!this.destroyed) {
	    this._cleanup();
	    this.disconnect();
	    this.destroyed = true;
	  }
	};
	
	
	/** Disconnects every connection on this peer. */
	Peer.prototype._cleanup = function() {
	  if (this.connections) {
	    var peers = Object.keys(this.connections);
	    for (var i = 0, ii = peers.length; i < ii; i++) {
	      this._cleanupPeer(peers[i]);
	    }
	  }
	  this.emit('close');
	};
	
	/** Closes all connections to this peer. */
	Peer.prototype._cleanupPeer = function(peer) {
	  var connections = this.connections[peer];
	  for (var j = 0, jj = connections.length; j < jj; j += 1) {
	    connections[j].close();
	  }
	};
	
	/**
	 * Disconnects the Peer's connection to the PeerServer. Does not close any
	 *  active connections.
	 * Warning: The peer can no longer create or accept connections after being
	 *  disconnected. It also cannot reconnect to the server.
	 */
	Peer.prototype.disconnect = function() {
	  var self = this;
	  util.setZeroTimeout(function(){
	    if (!self.disconnected) {
	      self.disconnected = true;
	      self.open = false;
	      if (self.socket) {
	        self.socket.close();
	      }
	      self.emit('disconnected', self.id);
	      self._lastServerId = self.id;
	      self.id = null;
	    }
	  });
	};
	
	/** Attempts to reconnect with the same ID. */
	Peer.prototype.reconnect = function() {
	  if (this.disconnected && !this.destroyed) {
	    util.log('Attempting reconnection to server with ID ' + this._lastServerId);
	    this.disconnected = false;
	    this._initializeServerConnection();
	    this._initialize(this._lastServerId);
	  } else if (this.destroyed) {
	    throw new Error('This peer cannot reconnect to the server. It has already been destroyed.');
	  } else if (!this.disconnected && !this.open) {
	    // Do nothing. We're still connecting the first time.
	    util.error('In a hurry? We\'re still trying to make the initial connection!');
	  } else {
	    throw new Error('Peer ' + this.id + ' cannot reconnect because it is not disconnected from the server!');
	  }
	};
	
	/**
	 * Get a list of available peer IDs. If you're running your own server, you'll
	 * want to set allow_discovery: true in the PeerServer options. If you're using
	 * the cloud server, email team@peerjs.com to get the functionality enabled for
	 * your key.
	 */
	Peer.prototype.listAllPeers = function(cb) {
	  cb = cb || function() {};
	  var self = this;
	  var http = new XMLHttpRequest();
	  var protocol = this.options.secure ? 'https://' : 'http://';
	  var url = protocol + this.options.host + ':' + this.options.port +
	    this.options.path + this.options.key + '/peers';
	  var queryString = '?ts=' + new Date().getTime() + '' + Math.random();
	  url += queryString;
	
	  // If there's no ID we need to wait for one before trying to init socket.
	  http.open('get', url, true);
	  http.onerror = function(e) {
	    self._abort('server-error', 'Could not get peers from the server.');
	    cb([]);
	  };
	  http.onreadystatechange = function() {
	    if (http.readyState !== 4) {
	      return;
	    }
	    if (http.status === 401) {
	      var helpfulError = '';
	      if (self.options.host !== util.CLOUD_HOST) {
	        helpfulError = 'It looks like you\'re using the cloud server. You can email ' +
	          'team@peerjs.com to enable peer listing for your API key.';
	      } else {
	        helpfulError = 'You need to enable `allow_discovery` on your self-hosted ' +
	          'PeerServer to use this feature.';
	      }
	      cb([]);
	      throw new Error('It doesn\'t look like you have permission to list peers IDs. ' + helpfulError);
	    } else if (http.status !== 200) {
	      cb([]);
	    } else {
	      cb(JSON.parse(http.responseText));
	    }
	  };
	  http.send(null);
	};
	
	module.exports = Peer;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(10);
	var EventEmitter = __webpack_require__(16);
	
	/**
	 * An abstraction on top of WebSockets and XHR streaming to provide fastest
	 * possible connection for peers.
	 */
	function Socket(secure, host, port, path, key) {
	  if (!(this instanceof Socket)) return new Socket(secure, host, port, path, key);
	
	  EventEmitter.call(this);
	
	  // Disconnected manually.
	  this.disconnected = false;
	  this._queue = [];
	
	  var httpProtocol = secure ? 'https://' : 'http://';
	  var wsProtocol = secure ? 'wss://' : 'ws://';
	  this._httpUrl = httpProtocol + host + ':' + port + path + key;
	  this._wsUrl = wsProtocol + host + ':' + port + path + 'peerjs?key=' + key;
	}
	
	util.inherits(Socket, EventEmitter);
	
	
	/** Check in with ID or get one from server. */
	Socket.prototype.start = function(id, token) {
	  this.id = id;
	
	  this._httpUrl += '/' + id + '/' + token;
	  this._wsUrl += '&id=' + id + '&token=' + token;
	
	  this._startXhrStream();
	  this._startWebSocket();
	}
	
	
	/** Start up websocket communications. */
	Socket.prototype._startWebSocket = function(id) {
	  var self = this;
	
	  if (this._socket) {
	    return;
	  }
	
	  this._socket = new WebSocket(this._wsUrl);
	
	  this._socket.onmessage = function(event) {
	    try {
	      var data = JSON.parse(event.data);
	    } catch(e) {
	      util.log('Invalid server message', event.data);
	      return;
	    }
	    self.emit('message', data);
	  };
	
	  this._socket.onclose = function(event) {
	    util.log('Socket closed.');
	    self.disconnected = true;
	    self.emit('disconnected');
	  };
	
	  // Take care of the queue of connections if necessary and make sure Peer knows
	  // socket is open.
	  this._socket.onopen = function() {
	    if (self._timeout) {
	      clearTimeout(self._timeout);
	      setTimeout(function(){
	        self._http.abort();
	        self._http = null;
	      }, 5000);
	    }
	    self._sendQueuedMessages();
	    util.log('Socket open');
	  };
	}
	
	/** Start XHR streaming. */
	Socket.prototype._startXhrStream = function(n) {
	  try {
	    var self = this;
	    this._http = new XMLHttpRequest();
	    this._http._index = 1;
	    this._http._streamIndex = n || 0;
	    this._http.open('post', this._httpUrl + '/id?i=' + this._http._streamIndex, true);
	    this._http.onerror = function() {
	      // If we get an error, likely something went wrong.
	      // Stop streaming.
	      clearTimeout(self._timeout);
	      self.emit('disconnected');
	    }
	    this._http.onreadystatechange = function() {
	      if (this.readyState == 2 && this.old) {
	        this.old.abort();
	        delete this.old;
	      } else if (this.readyState > 2 && this.status === 200 && this.responseText) {
	        self._handleStream(this);
	      }
	    };
	    this._http.send(null);
	    this._setHTTPTimeout();
	  } catch(e) {
	    util.log('XMLHttpRequest not available; defaulting to WebSockets');
	  }
	}
	
	
	/** Handles onreadystatechange response as a stream. */
	Socket.prototype._handleStream = function(http) {
	  // 3 and 4 are loading/done state. All others are not relevant.
	  var messages = http.responseText.split('\n');
	
	  // Check to see if anything needs to be processed on buffer.
	  if (http._buffer) {
	    while (http._buffer.length > 0) {
	      var index = http._buffer.shift();
	      var bufferedMessage = messages[index];
	      try {
	        bufferedMessage = JSON.parse(bufferedMessage);
	      } catch(e) {
	        http._buffer.shift(index);
	        break;
	      }
	      this.emit('message', bufferedMessage);
	    }
	  }
	
	  var message = messages[http._index];
	  if (message) {
	    http._index += 1;
	    // Buffering--this message is incomplete and we'll get to it next time.
	    // This checks if the httpResponse ended in a `\n`, in which case the last
	    // element of messages should be the empty string.
	    if (http._index === messages.length) {
	      if (!http._buffer) {
	        http._buffer = [];
	      }
	      http._buffer.push(http._index - 1);
	    } else {
	      try {
	        message = JSON.parse(message);
	      } catch(e) {
	        util.log('Invalid server message', message);
	        return;
	      }
	      this.emit('message', message);
	    }
	  }
	}
	
	Socket.prototype._setHTTPTimeout = function() {
	  var self = this;
	  this._timeout = setTimeout(function() {
	    var old = self._http;
	    if (!self._wsOpen()) {
	      self._startXhrStream(old._streamIndex + 1);
	      self._http.old = old;
	    } else {
	      old.abort();
	    }
	  }, 25000);
	}
	
	/** Is the websocket currently open? */
	Socket.prototype._wsOpen = function() {
	  return this._socket && this._socket.readyState == 1;
	}
	
	/** Send queued messages. */
	Socket.prototype._sendQueuedMessages = function() {
	  for (var i = 0, ii = this._queue.length; i < ii; i += 1) {
	    this.send(this._queue[i]);
	  }
	}
	
	/** Exposed send for DC & Peer. */
	Socket.prototype.send = function(data) {
	  if (this.disconnected) {
	    return;
	  }
	
	  // If we didn't get an ID yet, we can't yet send anything so we should queue
	  // up these messages.
	  if (!this.id) {
	    this._queue.push(data);
	    return;
	  }
	
	  if (!data.type) {
	    this.emit('error', 'Invalid message');
	    return;
	  }
	
	  var message = JSON.stringify(data);
	  if (this._wsOpen()) {
	    this._socket.send(message);
	  } else {
	    var http = new XMLHttpRequest();
	    var url = this._httpUrl + '/' + data.type.toLowerCase();
	    http.open('post', url, true);
	    http.setRequestHeader('Content-Type', 'application/json');
	    http.send(message);
	  }
	}
	
	Socket.prototype.close = function() {
	  if (!this.disconnected && this._wsOpen()) {
	    this._socket.close();
	    this.disconnected = true;
	  }
	}
	
	module.exports = Socket;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(91);
	
	/**
	 * Reliable transfer for Chrome Canary DataChannel impl.
	 * Author: @michellebu
	 */
	function Reliable(dc, debug) {
	  if (!(this instanceof Reliable)) return new Reliable(dc);
	  this._dc = dc;
	
	  util.debug = debug;
	
	  // Messages sent/received so far.
	  // id: { ack: n, chunks: [...] }
	  this._outgoing = {};
	  // id: { ack: ['ack', id, n], chunks: [...] }
	  this._incoming = {};
	  this._received = {};
	
	  // Window size.
	  this._window = 1000;
	  // MTU.
	  this._mtu = 500;
	  // Interval for setInterval. In ms.
	  this._interval = 0;
	
	  // Messages sent.
	  this._count = 0;
	
	  // Outgoing message queue.
	  this._queue = [];
	
	  this._setupDC();
	};
	
	// Send a message reliably.
	Reliable.prototype.send = function(msg) {
	  // Determine if chunking is necessary.
	  var bl = util.pack(msg);
	  if (bl.size < this._mtu) {
	    this._handleSend(['no', bl]);
	    return;
	  }
	
	  this._outgoing[this._count] = {
	    ack: 0,
	    chunks: this._chunk(bl)
	  };
	
	  if (util.debug) {
	    this._outgoing[this._count].timer = new Date();
	  }
	
	  // Send prelim window.
	  this._sendWindowedChunks(this._count);
	  this._count += 1;
	};
	
	// Set up interval for processing queue.
	Reliable.prototype._setupInterval = function() {
	  // TODO: fail gracefully.
	
	  var self = this;
	  this._timeout = setInterval(function() {
	    // FIXME: String stuff makes things terribly async.
	    var msg = self._queue.shift();
	    if (msg._multiple) {
	      for (var i = 0, ii = msg.length; i < ii; i += 1) {
	        self._intervalSend(msg[i]);
	      }
	    } else {
	      self._intervalSend(msg);
	    }
	  }, this._interval);
	};
	
	Reliable.prototype._intervalSend = function(msg) {
	  var self = this;
	  msg = util.pack(msg);
	  util.blobToBinaryString(msg, function(str) {
	    self._dc.send(str);
	  });
	  if (self._queue.length === 0) {
	    clearTimeout(self._timeout);
	    self._timeout = null;
	    //self._processAcks();
	  }
	};
	
	// Go through ACKs to send missing pieces.
	Reliable.prototype._processAcks = function() {
	  for (var id in this._outgoing) {
	    if (this._outgoing.hasOwnProperty(id)) {
	      this._sendWindowedChunks(id);
	    }
	  }
	};
	
	// Handle sending a message.
	// FIXME: Don't wait for interval time for all messages...
	Reliable.prototype._handleSend = function(msg) {
	  var push = true;
	  for (var i = 0, ii = this._queue.length; i < ii; i += 1) {
	    var item = this._queue[i];
	    if (item === msg) {
	      push = false;
	    } else if (item._multiple && item.indexOf(msg) !== -1) {
	      push = false;
	    }
	  }
	  if (push) {
	    this._queue.push(msg);
	    if (!this._timeout) {
	      this._setupInterval();
	    }
	  }
	};
	
	// Set up DataChannel handlers.
	Reliable.prototype._setupDC = function() {
	  // Handle various message types.
	  var self = this;
	  this._dc.onmessage = function(e) {
	    var msg = e.data;
	    var datatype = msg.constructor;
	    // FIXME: msg is String until binary is supported.
	    // Once that happens, this will have to be smarter.
	    if (datatype === String) {
	      var ab = util.binaryStringToArrayBuffer(msg);
	      msg = util.unpack(ab);
	      self._handleMessage(msg);
	    }
	  };
	};
	
	// Handles an incoming message.
	Reliable.prototype._handleMessage = function(msg) {
	  var id = msg[1];
	  var idata = this._incoming[id];
	  var odata = this._outgoing[id];
	  var data;
	  switch (msg[0]) {
	    // No chunking was done.
	    case 'no':
	      var message = id;
	      if (!!message) {
	        this.onmessage(util.unpack(message));
	      }
	      break;
	    // Reached the end of the message.
	    case 'end':
	      data = idata;
	
	      // In case end comes first.
	      this._received[id] = msg[2];
	
	      if (!data) {
	        break;
	      }
	
	      this._ack(id);
	      break;
	    case 'ack':
	      data = odata;
	      if (!!data) {
	        var ack = msg[2];
	        // Take the larger ACK, for out of order messages.
	        data.ack = Math.max(ack, data.ack);
	
	        // Clean up when all chunks are ACKed.
	        if (data.ack >= data.chunks.length) {
	          util.log('Time: ', new Date() - data.timer);
	          delete this._outgoing[id];
	        } else {
	          this._processAcks();
	        }
	      }
	      // If !data, just ignore.
	      break;
	    // Received a chunk of data.
	    case 'chunk':
	      // Create a new entry if none exists.
	      data = idata;
	      if (!data) {
	        var end = this._received[id];
	        if (end === true) {
	          break;
	        }
	        data = {
	          ack: ['ack', id, 0],
	          chunks: []
	        };
	        this._incoming[id] = data;
	      }
	
	      var n = msg[2];
	      var chunk = msg[3];
	      data.chunks[n] = new Uint8Array(chunk);
	
	      // If we get the chunk we're looking for, ACK for next missing.
	      // Otherwise, ACK the same N again.
	      if (n === data.ack[2]) {
	        this._calculateNextAck(id);
	      }
	      this._ack(id);
	      break;
	    default:
	      // Shouldn't happen, but would make sense for message to just go
	      // through as is.
	      this._handleSend(msg);
	      break;
	  }
	};
	
	// Chunks BL into smaller messages.
	Reliable.prototype._chunk = function(bl) {
	  var chunks = [];
	  var size = bl.size;
	  var start = 0;
	  while (start < size) {
	    var end = Math.min(size, start + this._mtu);
	    var b = bl.slice(start, end);
	    var chunk = {
	      payload: b
	    }
	    chunks.push(chunk);
	    start = end;
	  }
	  util.log('Created', chunks.length, 'chunks.');
	  return chunks;
	};
	
	// Sends ACK N, expecting Nth blob chunk for message ID.
	Reliable.prototype._ack = function(id) {
	  var ack = this._incoming[id].ack;
	
	  // if ack is the end value, then call _complete.
	  if (this._received[id] === ack[2]) {
	    this._complete(id);
	    this._received[id] = true;
	  }
	
	  this._handleSend(ack);
	};
	
	// Calculates the next ACK number, given chunks.
	Reliable.prototype._calculateNextAck = function(id) {
	  var data = this._incoming[id];
	  var chunks = data.chunks;
	  for (var i = 0, ii = chunks.length; i < ii; i += 1) {
	    // This chunk is missing!!! Better ACK for it.
	    if (chunks[i] === undefined) {
	      data.ack[2] = i;
	      return;
	    }
	  }
	  data.ack[2] = chunks.length;
	};
	
	// Sends the next window of chunks.
	Reliable.prototype._sendWindowedChunks = function(id) {
	  util.log('sendWindowedChunks for: ', id);
	  var data = this._outgoing[id];
	  var ch = data.chunks;
	  var chunks = [];
	  var limit = Math.min(data.ack + this._window, ch.length);
	  for (var i = data.ack; i < limit; i += 1) {
	    if (!ch[i].sent || i === data.ack) {
	      ch[i].sent = true;
	      chunks.push(['chunk', id, i, ch[i].payload]);
	    }
	  }
	  if (data.ack + this._window >= ch.length) {
	    chunks.push(['end', id, ch.length])
	  }
	  chunks._multiple = true;
	  this._handleSend(chunks);
	};
	
	// Puts together a message from chunks.
	Reliable.prototype._complete = function(id) {
	  util.log('Completed called for', id);
	  var self = this;
	  var chunks = this._incoming[id].chunks;
	  var bl = new Blob(chunks);
	  util.blobToArrayBuffer(bl, function(ab) {
	    self.onmessage(util.unpack(ab));
	  });
	  delete this._incoming[id];
	};
	
	// Ups bandwidth limit on SDP. Meant to be called during offer/answer.
	Reliable.higherBandwidthSDP = function(sdp) {
	  // AS stands for Application-Specific Maximum.
	  // Bandwidth number is in kilobits / sec.
	  // See RFC for more info: http://www.ietf.org/rfc/rfc2327.txt
	
	  // Chrome 31+ doesn't want us munging the SDP, so we'll let them have their
	  // way.
	  var version = navigator.appVersion.match(/Chrome\/(.*?) /);
	  if (version) {
	    version = parseInt(version[1].split('.').shift());
	    if (version < 31) {
	      var parts = sdp.split('b=AS:30');
	      var replace = 'b=AS:102400'; // 100 Mbps
	      if (parts.length > 1) {
	        return parts[0] + replace + parts[1];
	      }
	    }
	  }
	
	  return sdp;
	};
	
	// Overwritten, typically.
	Reliable.prototype.onmessage = function(msg) {};
	
	module.exports.Reliable = Reliable;


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	var BinaryPack = __webpack_require__(29);
	
	var util = {
	  debug: false,
	  
	  inherits: function(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  },
	  extend: function(dest, source) {
	    for(var key in source) {
	      if(source.hasOwnProperty(key)) {
	        dest[key] = source[key];
	      }
	    }
	    return dest;
	  },
	  pack: BinaryPack.pack,
	  unpack: BinaryPack.unpack,
	  
	  log: function () {
	    if (util.debug) {
	      var copy = [];
	      for (var i = 0; i < arguments.length; i++) {
	        copy[i] = arguments[i];
	      }
	      copy.unshift('Reliable: ');
	      console.log.apply(console, copy);
	    }
	  },
	
	  setZeroTimeout: (function(global) {
	    var timeouts = [];
	    var messageName = 'zero-timeout-message';
	
	    // Like setTimeout, but only takes a function argument.	 There's
	    // no time argument (always zero) and no arguments (you have to
	    // use a closure).
	    function setZeroTimeoutPostMessage(fn) {
	      timeouts.push(fn);
	      global.postMessage(messageName, '*');
	    }		
	
	    function handleMessage(event) {
	      if (event.source == global && event.data == messageName) {
	        if (event.stopPropagation) {
	          event.stopPropagation();
	        }
	        if (timeouts.length) {
	          timeouts.shift()();
	        }
	      }
	    }
	    if (global.addEventListener) {
	      global.addEventListener('message', handleMessage, true);
	    } else if (global.attachEvent) {
	      global.attachEvent('onmessage', handleMessage);
	    }
	    return setZeroTimeoutPostMessage;
	  }(this)),
	  
	  blobToArrayBuffer: function(blob, cb){
	    var fr = new FileReader();
	    fr.onload = function(evt) {
	      cb(evt.target.result);
	    };
	    fr.readAsArrayBuffer(blob);
	  },
	  blobToBinaryString: function(blob, cb){
	    var fr = new FileReader();
	    fr.onload = function(evt) {
	      cb(evt.target.result);
	    };
	    fr.readAsBinaryString(blob);
	  },
	  binaryStringToArrayBuffer: function(binary) {
	    var byteArray = new Uint8Array(binary.length);
	    for (var i = 0; i < binary.length; i++) {
	      byteArray[i] = binary.charCodeAt(i) & 0xff;
	    }
	    return byteArray.buffer;
	  },
	  randomToken: function () {
	    return Math.random().toString(36).substr(2);
	  }
	};
	
	module.exports = util;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map