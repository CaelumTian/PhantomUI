	var defaults={
		max:500,				//队列最大长度
		maxAge:1000*60*60  		//最大生存时间
	}
	function hasOp(obj,key){
		return Object.hasOwnProperty.call(obj,key);
	}
	function LRUcache(options){
		if(!(this instanceof LRUcache)){
			return new LRUcache(options);  
		}  //安全构造函数
		if(!options.max || !(typeof options.max === "undefined") || options.max<=0){
			this._max = defaults.max;
		}else{
			this._max = options.max;
		}  //设置最大长度
		this._maxAge = typeof options.maxAge === "number" ? options.maxAge : defaults.maxAge;
		this._dispose = options.dispose;
		this.init();
	}
	LRUcache.prototype.init=function(){
		this._cache = Object.create(null); //防止原形污染
		this._lruList = Object.create(null);
		this._mru = 0;
		this._lru = 0;
		this._length = 0;
		this._itemCount = 0;
	}
	LRUcache.prototype.set=function(key,value){
		if(hasOp(this._cache,key)){
			if(this._maxAge){
				this._cache[key].now = Date.now();
			}
			this._cache[key].value=value;  //设置缓存
		}
		var len=this._lengthCalculator(value);
	}
	function Entry(key,value,lu,length,now){
		this.key = key;
		this.value = value;
		this.lu = lu;
		this.length = length;
		this.now = now;
	}
