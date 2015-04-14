(function(window,document){
	var defaults={
		tolerance : {
		    up : 0,
		    down : 0
		},                                      //容差
		offset : 0,
		scroller : window,
		classes : {
		    pinned : 'headroom--pinned',  		//向上滚动class
		    unpinned : 'headroom--unpinned', 	//向下滚动class
		    top : 'headroom--top',
		    notTop : 'headroom--not-top',
		    initial : 'headroom'				//元素初始化class
		}
	}
	function isDOMELement(obj){
		return obj && typeof window !== 'undefined' && (obj === window || obj.nodeType);   //排除HTML对象
	}
	function extend(obj){
		if(arguments.length <= 0){
			throw new Error("没有参数");
		}
		var result = obj || {};    			//保存结果
		for(var i = 1, j = arguments.length; i < j; i++){
			var temp = arguments[i] || {};
			for(var key in temp){
				if(typeof result[key] === "object" && !isDOMElement(result[key])){
					result[key] = extend(result[key],temp[key]);
				}else{
					result[key] = result[key] || temp[key]; //没有该属性就添加，有就不改变（后一个参数为默认）
				}
			}
		}
		return result;
	}
	function ScrollSpy(elem,options){
		options = extend(options, defaults);
		this.elem = elem;
		this.lastKnownScrollY;    //默认滚动0
		this.tolerance = typeof options.tolerance === "number" ? { down : options.tolerance, up : options.tolerance} : options.tolerance;
		this.
		this.initialised = true;
		this.classes = options.classes;
		this.scroller = options.scroller;
	}
	ScrollSpy.prototype = {
		init : function(){
			this.element.classList.add(this.classes.initial);   //插入默认class

			//事件注册
			setTimeout(this.attachEvent.bind(this),100);   //延迟添加事件
			return this;
		},
		attachEvent:function(){
			if(this.initialised){
				this.initialised=false;    //只添加一次
				this.scroller.addEventListener("scroll",事件,false);   //添加事件
			}
		},
		update:function(){
			var currentScrollY = this.getScrollY(),
				scrollDirection = currentScrollY > this.lastKnownScrollY ? 'down' : 'up',  //滚动方向
		},
		getScrollY:function(){
			return (this.scroller.pageYOffset !== undefined) ? this.scroller.pageYOffset : (this.scroller.scrollTop !== undefined)? this.scroller.scrollTop: (document.documentElement || document.body.parentNode || document.body).scrollTop;
		},   //获取滚动条滚动距离
	}
})(window,document)