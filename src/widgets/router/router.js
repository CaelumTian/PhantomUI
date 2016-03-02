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
                    rightToLeft : "from-right-left"
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
            if($curVisibleSection.length > 0 && ($curVisibleSection.attr("id") !== $visibleSection.attr("id"))) {
                $curVisibleSection.removeClass(this.get("curPageClass"));
                $visibleSection.addClass(this.get("curPageClass"));
            }else {
                $visibleSection.addClass()
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
                url: Util.toUrlObject(url),
                pageId: sectionId
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
            ignoreCache = ignoreCache || false;
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
            return Util.toUrlObject(firstUrl).base === Util.toUrlObject(secUrl);
        },

        _getCurrentSection : function() {
            return this.$view.find('.' + this.get("curPageClass")).eq(0);
        },
        _switchToSection : function(sectionId) {
            if(!sectionId) {
                return false;
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
            isPushState === isPushState || true;
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
            if($hasSection && $hasSection.length > 0) {
                $visibleSection = $hashSection.eq(0);
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
            var sectionId = $visibleSection.attr("id");
            var $visibleSectionInFrom = $from.find('.' + this.get("curPageClass"));
            $visibleSectionInFrom.addClass(this.get("visiblePageClass")).removeClass(this.get("curPageClass"));
            this.trigger("pageAnimationStart", [sectionId, $visibleSection]);
            //开始动画
            this._animateElement($from, $to, direction);
            $from.animationEnd(function() {
                $visibleSectionInFrom.removeClass(this.get("visiblePageClass"));
                this.trigger("beforePageRemove", [$from]);
                $from.remove();
                this.trigger("pageRemoved");
            });
            $to.animationEnd(function() {
                this.trigger("pageAnimationEnd", [sectionId, $visibleSection]);
                // 外层（init.js）中会绑定 pageInitInternal 事件，然后对页面进行初始化
                this.trigger("pageInit", [sectionId, $visibleSection]);
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
            direction = direction || this.get("direction.rightToLeft");

            //所有可能类名称, 用于移除
            var animPageClasses = [
                'page-from-center-to-left',
                'page-from-center-to-right',
                'page-from-right-to-center',
                'page-from-left-to-center'
            ].join(' ');

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

            $from.animationEnd(function() {
                $from.removeClass(animPageClasses);
            });
            $to.animationEnd(function() {
                $to.removeClass(animPageClasses);
            });

        },
        _animateSection : function($from, $to, direction) {
            var toId = $to.attr("id");

            this.trigger("beforePageSwitch", [$from.attr('id'), $from]);
            $from.removeClass(this.get("curPageClass"));
            $to.addClass(this.get("curPageClass"));
            this.trigger("pageAnimationStart", [toId, $to]);

            this._animateElement($from, $to, direction);
        }
        //************ 事件模块 *****************

    });
    global.Router = Router;
})(this);
