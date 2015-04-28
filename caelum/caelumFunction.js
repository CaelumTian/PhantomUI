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

var P = (function(prototype, ownProperty, undefined) {
	function P(_superclass, definition) {
		//如果没有传递子类，则说明是创建一个类
		//继承Object，父子类交换
		if(definition === undefined) {
			definition = _superclass;
			_superclass = Object;
		}
		//要返回的继承后的类
		function C() {
			var self = this instanceof C ? this : new Bare; //修复省略new的bug
			self.init.apply(self, arguments);   //执行构造函数
			return self;
		}
		//中介者负责保存原形
		function Bare() {}
		C.Bare = Bare;
		var _super = Bare[prototype] = _superclass[prototype];  //父类原形保存，防止子类原形改动对父类原形产生修改
		var proto = Bare[prototype] = C[prototype] = C.p = new Bare;  //Bare的是实例化对象给C类原形，B类原形(全部为引用) 这里proto相当于一个对象
		proto.constructor = C;    //构造器指向本身
		C.extend = function(def) { 
			return P(C, def);
		}
		return (C.open = function(def){
			//对传入的子类，调用自身传入C的this指针,子类原形,父类原形,子类,父类
			if(typeof def === 'function') {
				def = def.call(C, proto, _super, C, _superclass);
			}
			if(typeof def === 'object') {
				for(var key in def) {
					if(ownProperty.call(def, key)) {
						proto[key] = def[key];    //复制非原形对象
					}
				}
			}
			if(!('init' in proto)){
				proto.init = _superclass;	//如果子类没有构造器，则沿用父类构造器
			}
			return C;    //返回C类
		})(definition)
	}	
	return P;
})('prototype', ({}).hasOwnProperty);