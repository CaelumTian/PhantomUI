/*
 *  Tphantom.js  
 *	核心框架组件,不考虑IE8以下,主要为移动端构建
 *	version 0.1
 */
var Tphantom = (function() {
	var $,
		emptyArray = [],
		tphantom = {},
		toString = Object.prototype.toString;
		isArray = Array.isArray || function(object){
			return toString.call(object) === "[object Array]";
		}
	function type(obj) {
		var _type = {
			"undefined" : undefined,
			"number" : "number",
			"boolean" : "boolean",
			"string" : "string",
			"[object Function]" : "function",
			"[object RegExp]" : "regexp",
			"[object Array]" : "array",
			"[object Date]" : "date",
			"[object Error]" : "error"
		}
		return _type[typeof obj] || _type[toString.call(obj)] || {obj ? "object" : "null"};
	}
})()