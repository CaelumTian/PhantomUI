/**
 * Created by caelumtian on 16/2/27.
 */
(function(global) {
    //组件实例缓存
    var cacheWidget = {};

    var Widget = Class.create(Base, {
        element : null,
        $element : null,
        events : null,
        attrs : {
            id : null,
            className : null,
            style : null,
            //渲染模板, 节点插入位置
            template : "<div></div>",
            parentNode : document.body
        },
        init : function(config) {
            config = this._parseConfig(config);
            this._super.init.call(this, config);
            this._parseElement();
            //加入缓存实例
            this._stamp();
            //初始化事件
            this.delegateEvents();
        },
        _parseConfig : function(config) {
            config = config || {};
            //element, events不作为attrs
            this.element = config.element;
            delete config.element;
            this.events = $.extend(this.events || {}, config.events);
            delete config.events;
            var dataApi = Util.parseDataApi(this.element);
            config = $.extend({}, dataApi, config);
            return config;
        },
        _parseElement : function() {
            if(!this.element) {
                //使用模板
                this._isTemplate = true;
            }
            this.$element = this.element ? $(this.element) : $(this.get('template'));
            this.element = this.$element[0];
        },
        _stamp : function() {
            var uuid = this.uuid = Util.getUuid();
            cacheWidget[uuid] = this;
            this.$element.attr("data-widget-id", uuid);
        },

        /**
         * 事件代理程序
         * @param element
         * @param events
         * @param handler
         */
        delegateEvents : function(element, events, handler) {
            var self = this;
            //用于初始化的时候
            if(arguments.length === 0) {
                events = self.events;
                element = self.element;
            }
            // 写法delegateEvents({'click .btn': handler})
            else if(arguments.length == 1) {
                events = element;
                element = self.element;
            }
            // 写法delegateEvents('click .btn', handler);
            // 写法delegateEvents(element, {'click .btn': handler});
            else if(arguments.length === 2){
                if(!$.isPlainObject(events)) {
                    var obj = {};
                    obj[element] = events;
                    events = obj;
                    element = self.element;
                }
            }
            // 写法delegateEvents(element, 'click .btn', handler);
            else if(arguments.length === 3) {
                var obj = {};
                obj[events] = handler;
                events = obj;
            }
            //通过如上,组合成 events : {"事件名" : "回调函数"}
            if(element != this.element) {
                if(!this.delegateElements) {
                    this.delegateElements = [];
                }
                this.delegateElements.push($(element));
            }
            element = $(element);
            if(events) {
                $.each(events, function(eventKey, handler) {

                })
            }
        }
    });
    var Util = {
        uuid : 0,
        //解析element中data属性
        getUuid : function() {
            return Util.uuid++;
        },
        parseDataApi : function(element) {
            var api = {};
            var $element = $(element);
            if(!$element[0] || $element.data("api") != 'on') {
                return;
            }
            var dataSet = $element[0].dataset || $element.data();
            for(var attrName in dataSet) {
                // zepto 会对 data中数据类型自动转换
                var val = element.data(attrName);
                //转换成驼峰形式
                attrName = Util.camelize(attrName);
                api[attrName] = Util.normalizeData(val);
            }
            return api;
        },
        camelize : function(string) {
            string = string.replace(/-([a-z])/g, function() {
                return (arguments[1]).toUpperCase();
            });
            return string;
        },
        normalizeData : function(data) {
            if(/^\s*[\[{].*[\]}]\s*$/.test(data)) {
                //json格式标准 是双引号 才能解析
                data = data.replace(/'/g, '"');
                data = JSON.parse(data);
            }
            return data;
        }
    };
    global.Widget = Widget;
})(this);
