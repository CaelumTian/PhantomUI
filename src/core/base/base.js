/**
 * Created by caelumtian on 16/2/20.
 */
(function(global) {
    "use strict"
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
            //这里先空着,用于attr
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
                console.warn("there must be an event");
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
                    }
                }
            }
            return true;
        }
    });
    global.Base = Base;
})(this);