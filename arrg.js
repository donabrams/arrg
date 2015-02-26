module.exports = Arrg;

Arrg.req = Arrg.required = {};
function Arrg() {
	var descr = Array.prototype.slice.call(arguments);
	var func = descr.shift();
	descr = descr.shift() || [];
	if (typeof func !== "function") { 
		throw new Error("no function passed");
	}
	var numRequired = descr.reduce(function(acc, arg){
		return acc + (arg === Arrg.req ? 1 : 0);
	}, 0);
	var f = function() {
		var extraArgs = arguments.length - numRequired;
		if (extraArgs < 0) {
			throw Error('Missing required parameters');
		}
		var toConsume = Array.prototype.slice.call(arguments);
		var newArgs = descr.map(function(arg) {
			var newArg;
			if (arg === Arrg.req) {
				newArg = toConsume.shift();
			} else if (extraArgs > 0) {
				newArg = toConsume.shift();
				extraArgs -= 1;
			} else {
				newArg = arg;
			}
			return newArg;
		});
		return func.apply(this, newArgs);
	};
	return f;
}