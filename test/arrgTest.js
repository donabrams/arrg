var expect = require('chai').expect;

describe('arrg', function() {
	var __ = require('../arrg');
	var f = function() { return arguments; };

	it('can be called with all parameters specified', function() {
		var func = __(f, ["foo", "bar", __.req]);
		var res = func(1, 2, 3);
		expect(res[0]).to.equal(1);
		expect(res[1]).to.equal(2);
		expect(res[2]).to.equal(3);
	});
	it('can default a parameter', function() {
		var func = __(f, ['a', 'b']);
		var res = func(1);
		expect(res[0]).to.equal(1);
		expect(res[1]).to.equal('b');
	});
	it('can default multiple parameters', function() {
		var func = __(f, ['a', 'b']);
		var res = func();
		expect(res[0]).to.equal('a');
		expect(res[1]).to.equal('b');
	});
	it('respects required parameters', function() {
		var func = __(f, ['a', __.required]);
		var res = func('b');
		expect(res[0]).to.equal('a');
		expect(res[1]).to.equal('b');
	});
	it('does not change the value of this', function() {
		var func = __(function() { return this.something; });
		var res = func.call({something:'yay'})
		expect(res).to.equal('yay');
	});
	it('supports use of __.req or __.required', function() {
		expect(__.req).to.equal(__.required);
	});
	it('makes all default args immutable by default', function() {
		var func = __(function(a) { a.b[0].c = "bad"; return a.b[0].c}, [{b:[{c:"good"}]}]);
		var res = func();
		expect(res).to.equal('good');
	});
	it('copies default args if mutability is desired', function() {
		var func = __(function(a) { 
			a.b[0].c = (a.b[0].c === "bad") ? "good" : "bad"; 
			return a.b[0].c;
		}, [{b:[{c:"bad"}]}], true);
		expect(func()).to.equal('good');
		expect(func()).to.equal('good');
	});
});
