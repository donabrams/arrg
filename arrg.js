module.exports = Arrg;

Arrg.req = Arrg.required = {};
function Arrg(func, args, allowMutable) {
	return decorateFuncWithArgs(func, args || [], allowMutable);
}

function decorateFuncWithArgs(func, argDescrs, allowMutable) { 
	if (typeof func !== "function") { 
		throw new Error("no function passed");
	}
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
	//fastest method as per http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
	return JSON.parse(JSON.stringify(o));
}