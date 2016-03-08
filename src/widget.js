/**
 * Created by caelumtian on 16/2/27.
 */
(function(global) {
    //组件实例缓存
    var cacheWidgets = {};
    //事件命名空间
    var CONST_EVENT_NS = ".widget-";
    var Widget = Class.create(Base, {
        element : null,
        $element : null,
        events : null,
        attrs : {
            id : null,
            className : null,
            style : null,
            parentNode : document.body,
            //渲染模板, 节点插入位置
            template : "<div></div>"
        },
        init : function(config) {
            config = this._parseConfig(config);
            Widget._super.init.call(this, config);
            this._initTemplate();
            this._parseElement();
            //加入缓存实例
            this._stamp();
            //初始化事件
            this.delegateEvents();
            this.setup();
        },
        _initTemplate : function() {},
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
            cacheWidgets[uuid] = this;
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
                    var event = Util.parseEventKey(self, eventKey);
                    var callback;
                    if(typeof handler === 'string') {
                        callback = function(ev) {
                            // 当handler为字符串时,说明调用this上的方法
                            self[handler](ev);
                        }
                    }else if(typeof handler === 'function') {
                        callback = function(ev) {
                            handler.call(self, ev);
                        }
                    }
                    element.on(event.type, event.selector, callback);
                });
            }
            return this;
        },
        undelegateEvents : function(element, eventKey) {
            //删除全部事件
            if(arguments.length === 0) {
                var uuid = this.uuid;
                this.$element.off(CONST_EVENT_NS + uuid);
                if(this.delegateElements) {
                    $.each(this.delegateElements, function(index, element) {
                        element.off(CONST_EVENT_NS + uuid);
                    })
                }
            }
            /**
             *  undelegateEvents("click .btn");
             *  undelegateEvents(element);
             *  undelegateEvents(element, 'click .btn');
             */
            else {
                if(arguments.length === 1) {
                    if(!Util.contain(document.documentElement, $(element)[0])) {
                        eventKey = element;
                        element = this.element;
                    }
                }
                element = $(element);
                var event = eventKey && Util.parseEventKey(this, eventKey);
                if(event) {
                    element.off(event.type, event.selector);
                }else {
                    element.off(CONST_EVENT_NS + this.uuid);
                }
            }
            return this;
        },
        /**
         *  组件生命周期
         *  setup : 组件初始化重载方法
         */
        setup : function() {},
        /**
         *  渲染this.element 调用_onRenderAttr
         *  若this.element是由模板生成, 则将其添加到parentNode中
         *  如果希望组件初始化时渲染，可在setup中调用render
         */
        render : function() {
            //初次调用render方法
            if(!this.rendered) {
                this._renderAndBindAttrs();
                this.rendered = true;
            }

            // 若element不在DOM中，插入到parentNode
            var parentNode = this.get('parentNode');
            if(parentNode && !Util.contain(document.documentElement, this.element)) {
                this.$element.appendTo(parentNode);
            }
            return this;
        },
        /**
         * 注销对象
         */
        destroy: function() {
            // 注销事件代理
            this.undelegateEvents();

            // 清除组件缓存
            delete cacheWidgets[this.uuid];

            // 如果是通过模板生成element, 则从DOM中删除
            if(this.$element && this._isTemplate) {
                this.$element.off();
                this.$element.remove();
            }

            this.element = null;
            Widget._super.destroy.call(this);
        },
        _renderAndBindAttrs : function() {
            var self = this;
            $.each(self, function(name, func) {
                var match = name.match(/^_onRender([A-Z](.)*)/);
                if(!match){
                    return;
                }
                //绑定change:attrName变化事件
                var attrName = Util.firstLetterToLc(match[1]);
                self.on("change:" + attrName, func);

                // 若attr有合法初始值(非null, undefined), 则触发onRenderAttr
                var val = self.get(attrName);
                if(val !== undefined && val !== null) {
                    self.trigger('change:' + attrName, [val, undefined, attrName]);
                }
            })
        },

        //已经定义好的_onRenderAttr
        _onRenderId: function(ev, val) {
            this.$element.attr('id', val);
        },

        _onRenderClassName: function(ev, val, prev) {
            prev && this.$element.removeClass(prev);
            this.$element.addClass(val);
        },

        _onRenderStyle: function(ev, val, prev) {
            this.$element.css(val);
        },

        statics : {
            query : function(selector) {
                var uuid = parseInt($(selector).attr("data-widget-id"));
                return cacheWidgets[uuid];
            }
        }
    });
    // 根据selector获取widget实例
    Widget.query = function(selector) {
        var result = [];
        $(selector).each(function(index, ele) {
            var uuid = parseInt($(ele).attr("data-widget-id"), 10);
            result.push(cacheWidgets[uuid]);
        });
        return result;
    };
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
        },
        parseEventKey : function(self, eventKey) {
            var event = {};
            //匹配 "click .btn" -> ["click .btn", "click", ".btn"]
            var re = eventKey.match(/^(\S+)\s*(.*)$/);
            //事件+命名空间
            event.type = re[1] + CONST_EVENT_NS + self.uuid;
            //event 添加{$attrName}支持
            event.selector = re[2].replace(/{\$(.*)}/, function() {
                return self.get(arguments[1]);
            });
            return event;
        },
        firstLetterToLc : function(string) {
            return string.charAt(0).toLowerCase() + string.substring(1);
        },
        contain : function(a, b) {
            return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
        }
    };
    global.Widget = Widget;
})(this);
