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

var JS = {}
JS.Class = function(definition) {
	//实际构造器
	function getClassBase() {
		return function() {
			if(typeof this['construct'] === 'function' && preventJSBaseConstructorCall === false) {
				this.construct.apply(this, arguments);
			}
		}
	}
	//添加原形类和方法
	function createClassDefinition(definition) {
		var parent = this.prototype["parent"] || (this.prototype["parent"] = {});
		for (var prop in definition) {
			if(prop === 'statics') {
				//复制静态方法,给类本身
				for(var sprop in definition.statics) {
					this[sprop] = definition.statics[sprop];
				}
			}else{
				//如果有同名的原形方法，则给 Base.parent属性，没有则直接添加
				if(typeof this.prototype[prop] === 'function') {
					var parentMethod = this.prototype[prop];
					parent[prop] = parnetMethod;
				}
				this.prototype[prop] = definition[prop];
			}
		}
	}
	var preventJSBaseConstructorCall = true;  //还是不太明白有什么用，及时没有这个不也能成功么？
	var Base = getClassBase();
	preventJSBaseConstructorCall = false;
	createClassDefinition.call(Base, definition);  //给Base添加属性
	Base.extend = function(definition) {
		preventJSBaseConstructorCall = true;
		var SonClass = getClassBase();
		SonClass.prototype = new this();   //Base实例化对象，给SonClass原形链
		preventJSBaseConstructorCall = false;
		createClassDefinition.call(SonClass, definition);
		SonClass.extend = this.extend;
		return SonClass;   //再次绑定
	}
	return Base;
}

(function(global){
	if(!Object.create){
		Object.create= (function(){
			function F(){}   //中介函数
			return function(obj) {
				if(arguments.length !== 1) {
					throw new Error("仅支持一个参数");
				}
				F.prototype = obj;   //原形绑定
				return new F();
			}
		})()
	}
	//检测func.toString能否返回函数内容，能就匹配 _super对象，不能则返回一个永远为真的正则
	var fnText = /xyz/.test(function(){xyz}) ? /\b_super\b/ : /.*/;
	function BaseClass(){}   //基类
	BaseClass.extend = function(props) {
		var _super = this.prototype;    //获取基类prototype
		var proto = Object.create(_super); //创建原形
		for(var name in props) {
			//检测子类方法props中是否含有基类原形，有则重写方法
			proto[name] = typeof props[name] === 'function' && typeof _super[name] === 'function' && fnText.test(props[name]) ?
			(function(name, fn){   //属性名，子类属性方法
				return function() {
					var tmp = this._super;   //我觉得是为了方式 this._super存在而书写的,以免被覆盖
					console.log(tmp + "11111");
					this._super = _super[name];
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    return ret;
				}
			})(name, props[name]) : props[name];
		}
		var newClass = function() {
			if(typeof this.init === 'function') {
				this.init.apply(this, arguments);
			}
		}
		newClass.prototype = proto;
		proto.constructor = newClass;
		newClass.extend = BaseClass.extend;
		return newClass;
	}
	global.Class = BaseClass;
})(window)