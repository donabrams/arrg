
//Thank craftsy
;(function() {

Arrg.req = Arrg.required = {};
function Arrg(func, args, allowMutable) {
	if (typeof func !== "function") { 
		throw new Error("no function passed");
	}
	args = args || [];
	allowMutable = !!allowMutable;
	return decorateFuncWithArgs(func, args, allowMutable);
}

function decorateFuncWithArgs(func, argDescrs, allowMutable) {
	if (!allowMutable) {
		deepFreeze(argDescrs);
	}
	var numRequired = argDescrs.reduce(function(acc, arg){
		return acc + (arg === Arrg.req ? 1 : 0);
	}, 0);
	return function() {
		var extraArgs = arguments.length - numRequired;
		if (extraArgs < 0) {
			throw Error('Missing required parameters');
		}
		var paramIndex = 0;
		var args = arguments;
		var newArgs = argDescrs.map(function(arg) {
			var newArg;
			if (arg === Arrg.req) {
				newArg = args[paramIndex];
				paramIndex += 1;
			} else if (extraArgs > 0) {
				newArg = args[paramIndex];
				paramIndex += 1;
				extraArgs -= 1;
			} else {
				newArg = allowMutable ? deepCopy(arg) : arg;
			}
			return newArg;
		});
		return func.apply(this, newArgs);
	};
}

function deepFreeze(o) {
	var prop, propKey;
	if (typeof o === "object") {
		Object.freeze(o);
		for (propKey in o) {
			prop = o[propKey];
			if (!o.hasOwnProperty(propKey) || !(typeof prop === 'object') || Object.isFrozen(prop)) {
				continue;
			}
			deepFreeze(prop);
		}
	}
}

function deepCopy(o) {
	//TODO: does not handle assigning correct Object.prototype
	//Fastest method as per http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
	return JSON.parse(JSON.stringify(o));
}


/* Crazy part so I can export this for most build/js environments 
	including io, amd, browser, etc */

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };
  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it is the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = (objectTypes[typeof window] && window !== (this && this.window)) ? window : this;

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Arrg to the global object when an AMD loader is present to avoid
    // errors in cases where Arrg is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root.__ = Arrg;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "arrg" module.
    define(function() {
      return Arrg;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {
    // Export for Node.js or RingoJS.
    if (moduleExports) {
      (freeModule.exports = Arrg).__ = Arrg;
    }
    // Export for Narwhal or Rhino -require.
    else {
      freeExports.__ = Arg;
    }
  }
  else {
    // Export for a browser or Rhino.
    root.__ = Arrg;
  }
}.call(this));
