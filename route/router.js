/**
 * Created by caelumtian on 16/3/2.
 */
(function(global) {
    "use strict";
    var Util = {
        /**
         * 获取url中hash值
         * @param url
         * @returns {String}
         */
        getUrlHashValue : function(url) {
            var index = url.indexOf('#');
            return index === -1 ? "" : url.slice(index + 1);
        },
        getAbsoluteUrl : function(url) {
            var link = document.createElement("a");
            link.setAttribute("href", url);
            url = link.href;
            link = null;   //删除link
            return url;
        },
        getBaseUrl : function(url) {
            var index = url.indexOf("#");
            return index === -1 ? url : url.slice(0, index);
        },
        /**
         * 把一个字符串的 url 转为一个可获取其 base 和 fragment 等的对象
         *
         * @param {String} url url
         * @returns {UrlObject}
         */
        toUrlObject: function(url) {
            var fullUrl = Util.getAbsoluteUrl(url),
                baseUrl = Util.getBaseUrl(fullUrl),
                hash = Util.getUrlHashValue(url);

            return {
                base: baseUrl,
                full: fullUrl,
                original: url,
                hash: hash
            };
        },
        /**
         * 判断浏览器是否支持sessionStorage
         */
        supportStorage : function() {
            return global.sessionStorage !== undefined && typeof global.sessionStorage === 'object';
        }
    };
    var Router = Class.create(Widget, {
        attrs : {
            sessionGroupClass : "page-group",
            //当前page class
            curPageClass : "page-current",
            //visiblePage 才是当前展示出来的page
            visiblePageClass: 'page-visible',
            //容器标识
            pageClass : "page",
            //页面进入方向
            direction : {
                value : {
                    leftToRight : "from-left-to-right",
                    rightToLeft : "from-right-to-left"
                }
            },
            sessionNames : {
                value : {
                    currentState : 'router-currentState',
                    maxStateId : "router-maxStateId"
                }
            }
        },
        init : function(config) {
            Router._super.init.call(this, config);
            this._init();
            this.xhr = null;
            window.addEventListener('popstate', this._onPopState.bind(this));
        },
        /**
         * 初始化函数, 把当前页面缓存起来
         * @private
         */
        _init : function() {
            this.$view = $("body");
            //页面缓存
            this.cache = {};
            var $doc = $(document);
            var currentUrl = global.location.href;
            this._saveDocumentIntoCache($doc, currentUrl);
            var curPageId;
            //当前url对象
            var currentUrlObj = Util.toUrlObject(currentUrl);
            //所有要切换的页面 .page
            var $allSections = $doc.find('.' + this.get("pageClass"));

            //当前显示的页面
            var $visibleSection = $doc.find('.' + this.get("curPageClass"));
            var $curVisibleSection = $visibleSection.eq(0);

            //利用hash的页面
            var $hashSection;

            if (currentUrlObj.hash) {
                $hashSection = $doc.find('#' + currentUrlObj.hash);
            }

            if ($hashSection && $hashSection.length > 0) {
                $visibleSection = $hashSection.eq(0);
            } else if (!$visibleSection.length) {
                $visibleSection = $allSections.eq(0);
            }

            //生成显示页面一个随机id
            if (!$visibleSection.attr('id')) {
                $visibleSection.attr('id', this._getRandomId());
            }

            //currPage visiblePage 不一致时
            if($curVisibleSection.length && ($curVisibleSection.attr("id") !== $visibleSection.attr("id"))) {
                $curVisibleSection.removeClass(this.get("curPageClass"));
                $visibleSection.addClass(this.get("curPageClass"));
            }else {
                $visibleSection.addClass(this.get("curPageClass"));
            }
            curPageId = $visibleSection.attr("id");

            //如果是第一次进入页面, 修改history加入最初页面
            if (global.history.state === null) {
                var curState = {
                    id: this._getNextStateId(),   //第一个页面 1
                    url: Util.toUrlObject(currentUrl),
                    pageId: curPageId
                };

                global.history.replaceState(curState, '', currentUrl);
                this._saveAsCurrentState(curState);
                this._incMaxStateId();
            }
        },
        /**
         * 把页面信息保存在this.cache中
         * key : currentUrl -> baseUrl
         * value : documentCache
         * @private
         */
        _saveDocumentIntoCache : function(doc, url) {
            var key = Util.toUrlObject(url).base;
            var $doc = $(doc);
            this.cache[key] = {
                "$doc" : $doc,
                "$content" : $doc.find('.' + this.get("sessionGroupClass"))
            }
        },
        /**
         * 存入history新的状态, maxState的id + 1
         * @param url  新的url
         * @param sectionId  元素id
         * @private
         */
        _pushNewState : function(url, sectionId) {
            var state = {
                id: this._getNextStateId(),
                pageId: sectionId,
                url: Util.toUrlObject(url)
            };

            global.history.pushState(state, '', url);
            this._saveAsCurrentState(state);
            this._incMaxStateId();
        },
        _getRandomId : function() {
            return "page" + (+new Date());
        },
        /**
         * 获取下一个state的id 保存在了sessionStorage id中,默认1
         * @private
         */
        _getNextStateId : function() {
            var maxStateId = global.sessionStorage.getItem(this.get("sessionNames.maxStateId"));
            return maxStateId ? parseInt(maxStateId) + 1 : 1;
        },
        /**
         * 把状态保存在sessionSotrage中
         * @param state {Object}
         * @private
         */
        _saveAsCurrentState : function(state) {
            global.sessionStorage.setItem(this.get("sessionNames.currentState"), JSON.stringify(state));
        },
        _incMaxStateId : function() {
            global.sessionStorage.setItem(this.get("sessionNames.maxStateId"), this._getNextStateId());
        },
        /**
         * 切换到指定的内容还是文档
         * @param url 如果url为当前路径,则切换已存在的.page  否则加载文档
         * @param ignoreCache  是否强制请求不使用缓存 默认false
         */
        load : function(url, ignoreCache) {
            if (ignoreCache === undefined) {
                ignoreCache = false;
            }
            if(this._isTheSameUrl(global.location.href, url)) {
                //如果是, 切换内容块(hash);
                this._switchToSection(Util.getUrlHashValue(url));
            }else {
                this._saveDocumentIntoCache($(document), location.href);
                this._switchToDocument(url, ignoreCache);
            }
        },
        /**
         * 判断两个url 是否去hash后一样
         */
        _isTheSameUrl : function(firstUrl, secUrl) {
            return Util.toUrlObject(firstUrl).base === Util.toUrlObject(secUrl).base;
        },

        _getCurrentSection : function() {
            return this.$view.find('.' + this.get("curPageClass")).eq(0);
        },
        _switchToSection : function(sectionId) {
            if(!sectionId) {
                return;
            }
            var $curPage = this._getCurrentSection(),
                $newPage = $('#' + sectionId);
            if ($curPage === $newPage) {
                return;
            }

            this._animateSection($curPage, $newPage, this.get("direction.rightToLeft"));
            this._pushNewState('#' + sectionId, sectionId);
        },
        /**
         *  载入一个新的页面
         * @param url  新的页面url
         * @param ignoreCache   是否忽略缓存 默认false
         * @param isPushState   是否需要pushState
         * @param direction     新文档切入方向
         * @private
         */
        _switchToDocument : function(url, ignoreCache, isPushState, direction) {
            var baseUrl = Util.toUrlObject(url).base;
            if(ignoreCache) {
                delete this.cache[baseUrl];
            }
            var cacheDocument = this.cache[baseUrl];
            var self = this;
            if(cacheDocument) {
                this._doSwitchDocument(url, isPushState, direction);
            }else {
                this._loadDocument(url, {
                    success : function($doc) {
                        try {
                            self._parseDocument(url, $doc);
                            self._doSwitchDocument(url, isPushState, direction);
                        }catch(e) {
                            global.location.href = url;
                        }
                    },
                    error : function() {
                        console.warn("请求错误,location.href返回");
                        global.location.href = url;
                    }
                })
            }
        },
        _loadDocument : function(url, callback) {
            var self = this;
            //防止之前的没有加载完,重复加载
            if(this.xhr && this.xhr.readyState < 4) {
                this.xhr.onreadystatechange = function(){};
                this.xhr.abort();   //取消请求
                this.trigger("pageLoadCancel");
            }
            this.trigger("pageLoadStart");
            callback = callback || {};
            this.xhr = $.ajax({
                url : url,
                success: $.proxy(function(data, status, xhr) {
                    // 给包一层 <html/>，从而可以拿到完整的结构
                    var $doc = $('<html></html>');
                    $doc.append(data);
                    callback.success && callback.success.call(null, $doc, status, xhr);
                }, this),
                error: function(xhr, status, err) {
                    callback.error && callback.error.call(null, xhr, status, err);
                },
                complete: function(xhr, status) {
                    callback.complete && callback.complete.call(null, xhr, status);
                }
            })
        },
        /**
         * 缓存页面
         * @param url
         * @param $doc
         * @private
         */
        _parseDocument : function(url, $doc) {
            var $innerView = $doc.find("." + this.get("sessionGroupClass"));
            if($innerView.length === 0) {
                throw new Error("找不到page-group容器");
            }
            this._saveDocumentIntoCache($doc, url);
        },
        /**
         * 切换文档操作
         * @param url
         * @param isPushState
         * @param direction
         * @private
         */
        _doSwitchDocument : function(url, isPushState, direction) {
            if (typeof isPushState === 'undefined') {
                isPushState = true;
            }
            var urlObj = Util.toUrlObject(url);
            var $currentDoc = this.$view.find('.' + this.get("sessionGroupClass"));
            var $newDoc = $($('<div></div>').append(this.cache[urlObj.base].$content).html());
            //确定页面展示顺序
            var $allSections = $newDoc.find('.' + this.get("pageClass"));
            var $visibleSection = $newDoc.find('.' + this.get("curPageClass"));
            var $hasSection;
            if(urlObj.hash) {
                $hasSection = $newDoc.find("#" + urlObj.hash);
            }
            if($hasSection && $hasSection.length) {
                $visibleSection = $hasSection.eq(0);
            }else if(!$visibleSection.length) {
                $visibleSection = $allSections.eq(0);
            }
            if(!$visibleSection.attr("id")) {
                $visibleSection.attr('id', this._getRandomId());
            }
            var $currentSection = this._getCurrentSection();
            this.trigger("beforePageSwitch", [$currentSection.attr("id"), $currentSection]);
            $allSections.removeClass(this.get("curPageClass"));
            $visibleSection.addClass(this.get("curPageClass"));

            this.$view.prepend($newDoc);

            this._animateDocument($currentDoc, $newDoc, $visibleSection, direction);

            if (isPushState) {
                this._pushNewState(url, $visibleSection.attr('id'));
            }
        },
        _animateDocument : function($from, $to, $visibleSection, direction) {
            var self = this;
            var sectionId = $visibleSection.attr("id");
            var $visibleSectionInFrom = $from.find('.' + this.get("curPageClass"));

            this._animateElement($from, $to, direction);

            window.requestAnimationFrame(function() {
                $visibleSectionInFrom.addClass(self.get("visiblePageClass")).removeClass(self.get("curPageClass"));
            });
            this.trigger("pageAnimationStart", [sectionId, $visibleSection]);
            //开始动画

            $from.on("animationEnd webkitAnimationEnd", function() {
                $visibleSectionInFrom.removeClass(self.get("visiblePageClass"));
                self.trigger("beforePageRemove", [$from]);
                $from.remove();
                self.trigger("pageRemoved");
            });
            $to.on("animationEnd webkitAnimationEnd",function() {
                self.trigger("pageAnimationEnd", [sectionId, $visibleSection]);
                // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
                self.trigger("pageInit", [sectionId, $visibleSection]);
            });
        },
        /**
         * 动画切换效果, 可以自己添加, 注意animPageClasses
         * @param $from 切换前页面 $(ele)
         * @param $to   切换后页面 $(ele)
         * @param direction 方向
         * @private
         */
        _animateElement : function($from, $to, direction) {
            if (typeof direction === 'undefined') {
                direction = this.get("direction.rightToLeft");
            }
            //所有可能类名称, 用于移除
            var animPageClasses = [
                'page-from-center-to-left',
                'page-from-center-to-right',
                'page-from-right-to-center',
                'page-from-left-to-center'].join(' ');

            var classForFrom,
                classForTo;

            switch(direction) {
                case this.get("direction.rightToLeft"):
                    classForFrom = 'page-from-center-to-left';
                    classForTo = 'page-from-right-to-center';
                    break;
                case this.get("direction.leftToRight"):
                    classForFrom = 'page-from-center-to-right';
                    classForTo = 'page-from-left-to-center';
                    break;
                default:
                    classForFrom = 'page-from-center-to-left';
                    classForTo = 'page-from-right-to-center';
                    break;
            }

            $from.removeClass(animPageClasses).addClass(classForFrom);
            $to.removeClass(animPageClasses).addClass(classForTo);

            $from.on("animationEnd webkitAnimationEnd",function() {
                $from.removeClass(animPageClasses);
            });
            $to.on("animationEnd webkitAnimationEnd",function() {
                $to.removeClass(animPageClasses);
            });

        },
        _animateSection : function($from, $to, direction) {
            var self = this;
            var toId = $to.attr("id");

            this.trigger("beforePageSwitch", [$from.attr('id'), $from]);
            self._animateElement($from, $to, direction);

            window.requestAnimationFrame(function() {
                $from.removeClass(this.get("curPageClass"));
                $to.addClass(this.get("curPageClass"));
            });

            this.trigger("pageAnimationStart", [toId, $to]);


            $to.on("animationEnd webkitAnimationEnd", function() {
                self.trigger("pageAnimationEnd", [toId, $to]);
                self.trigger("pageInit", [toId, $to]);
            })
        },
        forward : function() {
            global.history.forward();
        },
        back : function() {
            global.history.back();
        },
        /**
         * 从sessionStorage中获取页面当前状态
         * @private
         */
        _getLastState : function() {
            var currentState = global.sessionStorage.getItem(this.get("sessionNames.currentState"));
            try {
                currentState = JSON.parse(currentState);
            }catch(e) {
                currentState = null;
            }
            return currentState;
        },
        /**
         * popstate 事件处理
         * @private
         */
        _onPopState : function(event) {
            var state = event.state;
            if (!state || !state.pageId) {
                return;
            }
            var lastState = this._getLastState();
            if(!lastState) {
                console.warn("缺少state");
            }
            if(state.id === lastState.id) {
                return;
            }
            if (state.id < lastState.id) {
                this._back(state, lastState);
            } else {
                this._forward(state, lastState);
            }
        },
        _back : function(state, lastState) {
            if(this._isTheSameUrl(state.url.full, lastState.url.full)) {
                var $newPage = $('#' + state.pageId);
                if ($newPage.length) {
                    var $currentPage = this._getCurrentSection();
                    this._animateSection($currentPage, $newPage, this.get("direction.leftToRight"));
                    this._saveAsCurrentState(state);
                } else {
                    location.href = state.url.full;
                }
            }else {
                this._saveDocumentIntoCache($(document), lastState.url.full);
                this._switchToDocument(state.url.full, false, false, this.get("direction.leftToRight"));
                this._saveAsCurrentState(state);
            }
        },
        _forward : function(state, lastState) {
            if(this._isTheSameUrl(state.url.full, lastState.url.full)) {
                var $newPage = $('#' + state.pageId);
                if ($newPage.length) {
                    var $currentPage = this._getCurrentSection();
                    this._animateSection($currentPage, $newPage, this.get("direction.rightToLeft"));
                    this._saveAsCurrentState(state);
                } else {
                    location.href = state.url.full;
                }
            }else {
                this._saveDocumentIntoCache($(document), lastState.url.full);
                this._switchToDocument(state.url.full, false, false, this.get("direction.rightToLeft"));
                this._saveAsCurrentState(state);
            }
        }
        //************ 事件模块 *****************
        //************ 拦截link事件 *************
    });
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            location.reload();
        }
    });
    $(document).ready(function() {
        window.router = new Router({});
        $(document).on("click touchstart", "a", function(event) {
            //阻止a的默认事件   这里还要添加配置是否开启router
            event.preventDefault();
            var $target = $(event.currentTarget);

            if ($target.hasClass('back')) {
                router.back();
            } else {
                var url = $target.attr('href');
                if (!url || url === '#') {
                    return;
                }

                var ignoreCache = $target.attr('data-no-cache') === 'true';

                router.load(url, ignoreCache);
            }
        });
    });
    global.Router = Router;
})(this);