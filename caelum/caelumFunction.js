function curry(fn) {
	function inner(len, arg) {
		if(len <= 0) {
			console.log(arg);
			return fn.apply(null, arg);
		}
		return function() {
			console.log(arg);
			return inner(len - arguments.length, arg.concat([].slice.call(arguments)));
		}		
	}
	return inner(fn.length, []);
}
function sum (x,y,z,w) {
	console.log(x+y+z+w);
}