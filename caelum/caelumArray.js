var Caelum = {};
Caelum.Array = (function() {
	var arrayPrototype = Array.prototype;
	var _unshift = Array.prototype.unshift;
	var _splice = Array.prototype.splice;
	function arrayFix(){
		if (!('indexOf' in arrayPrototype)) {
			arrayPrototype.indexOf = function(item, index) {
				var len = this.length,
					i = ~~index;    //若index为字符串，则0
				if (i < 0){
					i = i + len;
				}  
				for(; i < len; i++){
					if(this[i] === item){
						return i;
					}
				}
				return -1;
			}
		}
		if(!('lastIndexOf') in arrayPrototype) {
			arrayPrototype.lastIndexOf = function(item, index) {
				var len = this.length,
					i = ~~index;
				if(i < 0) {
					i = Math.max(0,n+i);
				}
				for(;i >= 0; i--){
					if(this[i] === item) {
						return i;
					}
				}
				return -1;
			}
		}
		if(!('forEach') in arrayPrototype) {
			arrayPrototype.forEach = function(fn, scope) {   //scope为运行作用域
				for(var i = 0, j = this.length; i < j; i++){
					fn.call(scope, this[i], i, this);        //为回调传入三个参数：this，当前内容，索引，迭代的对象
				}
			}
		}
		if(!('filter') in arrayPrototype) {
			arrayPrototype.filter = function(fn, scope) {   //scope为运行作用域
				var result = [];
				for(var i = 0, j = this.length; i < j; i++) {
					if(fn.call(scope, this[i], i, this)) {     //若fn返回true，则添加
						result.push(this[i]);
					}
				}
				return result;     //返回结果
			}
		}
		if(!('map') in arrayPrototype) {
			arrayPrototype.map = function(fn, scope) {   //scope为运行作用域
				var result = [];
				for(var i = 0, j = this.length; i < j; i++) {
					result[i] = fn.call(scope,scope, this[i], i, this);	
				}
				return result;
			}
		}
		if(!('every') in arrayPrototype) {
			arrayPrototype.every = function(fn, scope) {   //scope为运行作用域
				if (!fn.call(scope, array[i], i, array)) {
                    return false;   //有错误的就返回false
                }
				return true;
			}
		}
		if(!('some') in arrayPrototype) {
			arrayPrototype.some = function(fn, scope) {   //scope为运行作用域
				if (fn.call(scope, array[i], i, array)) {
                    return true;   //有错误的就返回false
                }
				return false;
			}
		}
		if([].unshift(1) !== 1) {
			Array.prototype.unshift = function() {
				_unshift.apply(this, arguments);
				return this.length;    //修复不返回长度的
			}
		}
	}
})()