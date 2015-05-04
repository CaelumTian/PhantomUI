var Class = (function(global){
	function _isPlainObject(obj) {
		if(typeof obj === 'object' && obj !== null) {
			return Object.getPrototypeOf(obj) === Object.prototype || Object.getPrototypeOf(obj) === null;
		}
		return false;
	}     //判断是否为纯净对象
})(window)