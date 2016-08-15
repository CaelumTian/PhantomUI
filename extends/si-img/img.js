"use strict";

;
(function (win) {
    "use strict";

    var configs = {
        lazyWidth: 0,
        lazyHeight: 0,
        realSrc: "data-src",
        class: "img-load",
        cachePrefix: "img_cache_url_",
        cachePoolName: "img_cache_pool",
        cachePoolLength: 50,
        wait: 100,
        fadeIn: null
    };
    var opts = {};
    var lazyImgs = void 0;
    //是否支持图片缓存设置
    var isSupportCached = !!window.localStorage && !!document.createElement("canvas").getContext;
    var Util = {
        /**
         * 返回浅拷贝
         */

        extends: function _extends(target, obj) {
            if (Object.assign) {
                return Object.assign(target, obj);
            } else {
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        target[prop] = obj[prop];
                    }
                }
                return target;
            }
        },

        /**
         * 类数组转换数组
         * @param {Array} 类数组
         * @return{Array} 数组
         */
        toArray: function toArray(likeArray) {
            if (Array.from) {
                return Array.from(likeArray);
            } else {
                Array.prototype.slice.call(likeArray);
            }
        }
    };
    /**
     * 函数节流
     * @param func {Function} 执行函数  
     * @param wait {Number}   节流时间ms  
     * @param mustRunDelay {Number} 必定触发时间
     * @return {Function}     节流函数
     * @private
     */
    var _throttle = function _throttle(func, wait) {
        var mustRunDelay = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

        var timeout = null;
        var start_time = void 0;
        return function () {
            var context = this,
                args = arguments,
                curr_time = +new Date();
            clearTimeout(timeout);
            if (!start_time) {
                start_time = curr_time;
            }
            if (curr_time - start_time >= mustRunDelay) {
                func.apply(context, args);
            } else {
                timeout = setTimeout(function () {
                    func.apply(context, args);
                }, wait);
            }
        };
    };
    /**
     * 获取相对于浏览器的坐标  
     * @param obj {HTMLElement} 元素节点  
     * @param param {Object} 偏移量  
     * @return {Object} 坐标信息  
     * @private  
     */
    function _getOffset(obj, param) {
        if (!obj) {
            return;
        }
        if (!param) {
            param = {
                x: 0,
                y: 0
            };
        }
        if (obj !== window) {
            var el = obj.getBoundingClientRect(),
                t = el.top,
                r = el.right,
                b = el.bottom,
                l = el.left;
        } else {
            t = 0;
            l = 0;
            r = l + obj.innerWidth;
            b = t + obj.innerHeight;
        }
        return {
            "top": t,
            "right": r + param.x,
            "bottom": b + param.y,
            "left": l
        };
    }
    /**
     * 比较元素位置 d2, 在d1中
     */
    function _compareOffset(d1, d2) {
        var left = d2.right > d1.left && d2.left < d1.right;
        var top = d2.bottom > d1.top && d2.top < d1.bottom;
        return left && top;
    }
    /**
     * 获得所有的懒加载图片
     */
    function getLazyImgs() {
        lazyImgs = Util.toArray(document.querySelectorAll("." + opts.class));
        if (lazyImgs.length) {
            lazyImgs.forEach(function (ele, index) {
                if (ele.getAttribute("data-cache") == '1') {
                    //缓存图片base64
                    _cacheImg(ele);
                }
            });
        }
    }

    function _cacheImg(img) {
        var imgSrc = img.src || img.getAttribute(opts.realSrc);
        if (!isSupportCached || imgSrc.substring(0, 4) === 'data') {
            return;
        }
        var canvas = document.createElement("canvas"),
            ctx = canvas.getContext("2d");
        //允许js对图片跨域访问, 无法得到base64
        var tempImg = new Image();
        tempImg.setAttribute('crossOrigin', 'anonymous');
        tempImg.onload = function () {
            if (!this.getAttribute(opts.realSrc) && this.src.substring(0, 4) != 'data') {
                var w = this.width,
                    h = this.height,
                    imgData = {};
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(this, 0, 0, w, h);
                var baseImg = canvas.toDataURL();
                imgData[this.src] = baseImg;

                //图片base64格式
                var cacheData = localStorage.getItem(opts.cachePrefix + this.src);
                var cachePool = localStorage.getItem(opts.cachePoolName);
                //缓存列表
                cachePool = cachePool ? JSON.parse(cachePool) : [];
                if (!cacheData) {
                    //{前缀图片连接: base64}
                    localStorage.setItem(opts.cachePrefix + this.src, baseImg);
                    if (cachePool >= 200) {
                        //删除第一个
                        var firstKey = cachePool.shift();
                        localStorage.removeItem(firstKey);
                    }
                    //图片缓存的键名放入缓存池中
                    cachePool.push(opts.cachePrefix + this.src);
                    localStorage.setItem(opts.cachePoolName, JSON.stringify(cachePool));
                }
            }
            delete this;
        };
        tempImg.setAttribute("src", imgSrc);
    }

    function loadImg() {
        var srcAttr = opts.realSrc,
            winOffset = _getOffset(window, {
            'x': opts.lazyWidth,
            'y': opts.lazyHeight
        });
        if (lazyImgs.length) {
            lazyImgs.forEach(function (ele, index) {
                var realSrc = ele.getAttribute(srcAttr),
                    eleOffset = _getOffset(ele),
                    isInViewPort = _compareOffset(winOffset, eleOffset);
                //这里可以加入对网络环境或者设备的判断，考虑不用惰性加载
                if (realSrc) {
                    if (isInViewPort) {
                        __load(ele, realSrc);
                    }
                }
            });
        }
        function __load(ele, url) {
            ele.removeAttribute(srcAttr);
            if (ele.nodeName === "IMG") {
                if (ele.getAttribute("data-cache") == 1) {
                    var cacheData = _getImgBase64Data(url);
                    ele.setAttribute("src", cacheData || url);
                } else {
                    ele.setAttribute("src", url);
                }
            } else {
                //背景图片设置src
                var _cacheData = _getImgBase64Data(url);
                ele.style.backgroundImage = "url(" + _cacheData || url + ")";
            }
            //删除惰性加载的样式
            ele.classList.remove(opts.class);
            if (opts.fadeIn) {
                opts.fadeIn.call(ele);
            }
        }
    }

    /**
     * 从localStorage中获得base64数据
     */
    function _getImgBase64Data(url) {
        if (!isSupportCached) {
            return null;
        }
        var cacheData = localStorage.getItem(opts.cachePrefix + url);
        return cacheData;
    }

    function _init() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        opts = Util.extends(configs, options);
        //绑定惰性加载
        getLazyImgs();
        loadImg();
        var handler = _throttle(loadImg, opts.wait);
        window.addEventListener('scroll', handler, false);
    }

    window.SI = window.SI || {};
    window.SI.img = function (options) {
        _init(options);
    };
})(window);