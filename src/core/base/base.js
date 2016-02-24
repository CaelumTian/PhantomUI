/**
 * Created by caelumtian on 16/2/20.
 */
(function(global) {
    "use strict"
    global.CONST_ATTR_KEYS = ['value', 'setter', 'getter'];
    global.CONST_ATTR_ERROR = "SET ATTR ERROR";
    /**
     * Event类, 用于创建事件监听中的event对象
     * event.stopPropagation() 停止方法传递
     */
    var Event = Class.create({
        _bubbles : true,
        init : function(target, type) {
            this.target = target;
            this.type = type;
        },
        stopPropagation : function() {
            this._bubbles = false;
        }
    });
    var Base = Class.create({
        init : function(config) {
            this._initAttrs(config);
        },
        destroy : function() {
            this.off();
            for(var name in this) {
                if(this.hasOwnProperty(name)) {
                    delete this[name];
                }
            }
            this.destroy = function(){};
        },
        /**
         * Event: 用于自定义事件的操作
         * 注册事件 -> this.on(eventType, callback, [context])
         * 注销事件 -> this.off(eventType, [callback])
         * 触发事件 -> this.trigger(eventType, [Array args])
         */
        on : function(events, callback, context) {
            var event;
            //事件缓存对象
            this._events = this._events || {};

            if(typeof callback !== "function" || callback === undefined) {
                console.warn("fail on subscribe: callback is error");
                return this;
            }

            //把多个事件提成数组, 注意会出现空字符串, 循环过滤掉
            events = events.split(/\s+/);
            while(event = events.shift()) {
                if(event) {
                    this._events[event] = this._events[event] || [];
                    //存储结构: [[fn, context], ...]
                    this._events[event].push([callback, context]);
                }
            }
            return this;
        },
        off : function(events, callback) {
            var event;
            //若不传参数, 则清空所有事件
            if(!events) {
                delete this._events;
                return this;
            }
            events = events.split(/\s+/);
            while(event = events.shift()) {
                if(event) {
                    //取出函数数组
                    var handlers = this._events[event];
                    //若callback为空, 则清楚所有event的绑定事件
                    if(!callback) {
                        delete this._events[event];
                    }else if(handlers) {
                        for(var i = 0, len = handlers.length; i < len; i++) {
                            if(handlers[i][0] === callback) {
                                //删除fn和context
                                handlers.splice(i, 1);
                            }
                        }
                    }
                }
            }
            return this;
        },
        trigger : function(events) {
            var event,
                self = this;
            if(!events) {
                console.warn("EventError : there must be an event");
                return false;
            }
            events = events.split(/\s+/);
            while(event = events.shift()) {
                if(event) {
                    var handlers = this._events[event];
                    var _event = new Event(self, event);
                    if(handlers) {
                        for(var i = 0, len = handlers.length; i < len; i++) {
                            //执行函数, 上下文环境, 传入参数
                            var fn = handlers[i][0];
                            var context = handlers[i][1] || self;
                            var args = arguments[1] ? arguments[1] : [];

                            //参数混入event对象
                            args.unshift(_event);

                            fn.apply(context, args);
                            //终止事件继续进行下去
                            if(_event._bubbles === false) {
                                break;
                            }
                        }
                    }else {
                        console.warn("EventError : this event is not find");
                    }
                }
            }
            return true;
        },
        //属性模块
        /**
         *
         * @param name {String} 属性名
         * @param val 属性值
         * @param options {Object} 选项
         */
        _initAttrs : function(config) {
            //继承attrs
            var self = this;
            var currAttrs = {};
            var attrs;
            //获取原型, _protoChain存储所有原型(自身 + 父类 + 爷爷...)
            var _proto = self.constructor.prototype,
                _protoChain = [];
            while(_proto && !$.isEmptyObject(_proto)) {
                _protoChain.push(_proto);
                _proto = _proto.constructor.prototype._super;    //父类原型
            }
            //继承原型上的attrs
            while(_proto = _protoChain.pop()) {
                attrs = Util.normalizeAttr(_proto.attrs || {});
                for(var name in attrs) {
                    //如果attrs[name].attrMerge的值为true, 则和父类该属性混合
                    if(attrs[name].attrMerge) {
                        currAttrs[name] = $.extend(true, {}, currAttrs[name], attrs[name]);
                    }else {
                        currAttrs[name] = attrs[name];
                    }
                }
            }
            //最终给attrs赋值
            config = config || {};
            currAttrs = $.extend(true, {}, currAttrs, Util.normalizeAttr(config));
            self.attrs = currAttrs;

        },
        set : function(name, val, options) {
            var self = this;
            //临时存储操作过的属性
            var attrs = {};

            //已经有的attrs属性
            var curAttr = this.attrs;

            if(typeof name === "string") {
                attrs[name] = val;
            }else {
                //传入对象参数情况
                attrs = name;
                options = val;
            }
            options = options || {};

            for(var name in attrs) {
                //根据.划分属性名
                var path = name.split(".");
                var attrName = path[0];
                //检测是含有子节点 a.b 的形式
                var hasSubAttr = path.length > 1;
                var preVal = curAttr[attrName];     //当前值

                //若没有改属性则函数返回false
                if(!preVal) {
                    return false;
                }
                if(hasSubAttr) {
                    //检查是a.b是否能添加
                    var subAttr = Util.getProperty(preVal.value, path.slice(1, -1).join("."));
                    if(subAttr === undefined || !$.isPlainObject(subAttr) ) {
                        return false;
                    }
                    //拷贝一份当前值, 加入子属性后赋值给attrs;不直接修改是因为还要有setter判断才能决定最后结果.
                    var newValue = $.extend({}, preVal.value);
                    subAttr = Util.getProperty(newValue, path.slice(1, -1).join("."));
                    subAttr[path[path.length - 1]] = attrs[name];
                    attrs[name] = newValue;
                }

                //若有定义setter 则调用setter, setter返回设置的值(注意死循环)
                if(preVal.setter && typeof preVal.setter === "function") {
                    attrs[name] = preVal.setter.call(self, attrs[name], name, options.data);
                    if(attrs[name] === CONST_ATTR_ERROR) {
                        return false;
                    }
                }

                //决定是否保留原attrName中的其他属性
                if(options.merge) {
                    attrs[name] = ($.extend(true, {}, preVal, {value : attrs[name]})).value;
                }
                preVal = preVal.value;
                curAttr[attrName].value = attrs[name];

                /**
                 *  触发 change:attrname 变动事件
                 *  触发 change:* 变动事件
                 *  传入参数: 变动属性当前值, 原值, 属性明, 额外参数
                 */
                if(options.event) {
                    self.trigger('change:' + attrName, [self.get(attrName), preVal, name, options.data]);
                    self.trigger('change:*' + attrName, [self.get(attrName), preVal, name, options.data]);
                }

            }
            return true;
        },
        get : function(name) {
            var self = this;
            if(!name) {
                var attrs = {};
                for(var name in self.attrs) {
                    attrs[name] = self.get(name);   //取所有值
                }
                return attrs;
            }else {
                var path = name.split('.');
                //不存在值
                if(!self.attrs.hasOwnProperty(path[0])) {
                    return false;
                }
                var attr = self.attrs[path[0]];
                var val = attr.value;
                if(attr.getter) {
                    val = attr.getter.call(self, val, name);
                }
                val = Util.getProperty(val, path.slice(1).join('.'));
                if(val === CONST_ATTR_ERROR) {
                    val = undefined;
                }
                return val;
            }
        }
    });
    global.Base = Base;

    //支持函数
    var Util = {
        /**
         * 获得字属性 (obj, "a.b") 返回 obj.b的值
         * @param obj   要混入的对象
         * @param path  属性路径字符串
         */
        getProperty : function(obj, path) {
            var keys = path ? path.split(".") : [];
            for(var i = 0, len = keys.length; i < len; i++) {
                if(obj === undefined) {
                    return;
                }
                obj = obj[keys[i]];
            }
            return obj;
        },
        /**
         * 将attr改写成带有value的形式 {'name' : 'tgy'} --> {'name' : {value : 'tgy'}}
         * @param attrs [Object]
         */
        normalizeAttr : function(attrs) {
            //用于存储序列好的属性对象
            var newAttrs = {};
            for(var name in attrs) {
                var val = attrs[name];
                //如果属性值不是纯对象, 即 {name : 1}情况;或者对象中没有 value 属性
                if(!$.isPlainObject(attrs[name]) || !Util.hasOwnProperty(attrs[name], CONST_ATTR_KEYS)) {
                    attrs[name] = {
                        "value" : val
                    }
                }
                newAttrs[name] = attrs[name];
            }
            return newAttrs;
        },
        /**
         * 检测obj中是否含有properties中的属性
         * @param obj [Object]
         * @param properties [Array] 待检查信息
         */
        hasOwnProperty : function(obj, properties) {
            var result = false;
            $.each(properties, function(index, val) {
                if(obj.hasOwnProperty(val)) result = true;
            });
            return result;
        }
    };
})(this);