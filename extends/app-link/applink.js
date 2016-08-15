"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 私有变量
 */
var win = window,
    doc = win.document,
    ua = win.navigator.userAgent,
    isWin = /Windows\sPhone\s(?:OS\s)?[\d\.]+/i.test(ua) || /Windows\sNT\s[\d\.]+/i.test(ua),
    isIOS = /iPhone|iPad|iPod/i.test(ua),
    isAndroid = /Android/i.test(ua);

var uuid = 1,
    iframePool = [],
    iframeLimit = 3;

var __instance = function () {
    var instance = void 0;
    return function (newInstance) {
        if (newInstance) {
            instance = newInstance;
        }
        return instance;
    };
}();

/**
 * 保存回调函数
 * @type {{}}
 * @private
 */
var __funcs = {};

var __Applink = {
    onComplete: function onComplete(uuid, data, type) {
        clearTimeout(uuid);
        var result = void 0;
        var call = __Applink.cancelRegisterCall(uuid);
        var success = call.success,
            fail = call.fail,
            deferred = call.deferred;
        if (data && typeof data === "string") {
            try {
                result = JSON.parse(data);
            } catch (e) {
                result = {
                    ret: "[ Error ]: native返回数据无法解析"
                };
            }
        } else {
            result = data || {};
        }
        if (type === "success") {
            success && success(result);
            deferred && deferred.resolve(result);
        } else if (type === 'failure') {
            fail && fail(result);
            deferred && deferred.reject(result);
        }
        //IOS下回收iframe
        if (isIOS) {
            __Applink.recoverIframe(uuid);
        }
    },
    cancelRegisterCall: function cancelRegisterCall() {
        var sucId = Applink.SUCCESS_PRE + uuid,
            failId = Applink.FAILURE_PRE + uuid,
            defId = Applink.DEFERRED_PRE + uuid;
        var result = {};
        if (__funcs[sucId]) {
            result.success = __funcs[sucId];
            delete __funcs[sucId];
        }
        if (__funcs[failId]) {
            result.fail = __funcs[failId];
            delete __funcs[failId];
        }
        if (__funcs[defId]) {
            result.deferred = __funcs[defId];
            delete __funcs[defId];
        }
        return result;
    },
    recoverIframe: function recoverIframe(uuid) {
        var iframeId = Applink.IFRAME_PRE + uuid,
            iframe = doc.querySelector('#' + iframeId);
        if (iframePool.length >= iframeLimit) {
            doc.body.removeChild(iframe);
        } else {
            iframePool.push(iframe);
        }
    },
    getUuid: function getUuid() {
        return Math.floor(Math.random() * (1 << 50)) + '' + uuid++;
    },

    /**
     * 注册native 执行成功后的回调函数
     * @param uuid
     * @param success
     * @param fail
     * @param deferred
     * @private
     */
    registerCall: function registerCall(uuid, success, fail, deferred) {
        if (success) {
            __funcs[Applink.SUCCESS_PRE + uuid] = success;
        }
        if (fail) {
            __funcs[Applink.FAILURE_PRE + uuid] = fail;
        }
        if (deferred) {
            __funcs[Applink.DEFERRED_PRE + uuid] = deferred;
        }
    },
    registerGC: function registerGC(uuid, timeout, GC_TIME) {
        var self = this;
        var gc_time = Math.max(timeout || 0, GC_TIME);

        setTimeout(function () {
            __Applink.cancelRegisterCall(uuid);
        }, gc_time);
    },
    useIframe: function useIframe(uuid, uri) {
        var iframeId = Applink.IFRAME_PRE + uuid;
        var iframe = iframePool.pop();
        if (!iframe) {
            iframe = doc.createElement("iframe");
            iframe.setAttribute('frameborder', '0');
            iframe.style.cssText = 'width:0;height:0;border:0;display:none;';
        }
        iframe.setAttribute("id", iframeId);
        iframe.setAttribute("src", url);
        if (!iframe.parentNode) {
            setTimeout(function () {
                doc.body.appendChild(iframe);
            }, 10);
        }
    },
    postMessage: function postMessage(objName, method, params, uuid, PROTOCOL_NAME) {
        if (params && (typeof params === "undefined" ? "undefined" : _typeof(params)) === 'object') {
            params = JSON.stringify(params);
        } else {
            params = "";
        }
        if (isWin) {
            __Applink.onComplete(uuid, { res: "[ Error ]: windows环境下,或者设备不支持" }, "fail");
        } else {
            //协议格式
            var uri = PROTOCOL_NAME + "://" + objName + ":" + uuid + "/" + method + "?" + params;
            if (isIOS) {
                __Applink.useIframe(uuid, uri);
            } else if (isAndroid) {
                var value = PROTOCOL_NAME + ":";
                win.prompt(uri, value);
            } else {
                __Applink.onComplete(uuid, { res: "[ Error ]: jsbridge并不在支持的设备中" }, "fail");
            }
        }
    }
};

var Applink = function () {
    /**
     * 单例模式
     * @param name {String} 协议头
     * @param time {Number} GC时间
     */

    function Applink() {
        var name = arguments.length <= 0 || arguments[0] === undefined ? "applink" : arguments[0];
        var time = arguments.length <= 1 || arguments[1] === undefined ? 60 * 1000 * 5 : arguments[1];

        _classCallCheck(this, Applink);

        if (__instance()) {
            return __instance();
        }
        this.PROTOCOL_NAME = name;
        this.GC_TIME = time;
        __instance(this);
    }
    /**
     * web调用原生应用
     * @param {String} objName 调用原生的类名
     * @param method  调用原生类中的方法
     * @param {Object} params  传递的参数
     * @param {Function}success 成功回调函数
     * @param fail    失败回调函数
     * @param {Number} timeout 超时时间
     */


    _createClass(Applink, [{
        key: "invoke",
        value: function invoke(objName, method, params) {
            var success = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
            var fail = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
            var timeout = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];

            var uuid = void 0,
                deferred = void 0,
                self = this;
            if (typeof success !== 'function' || typeof fail !== 'function') {
                throw new Error("[ Error ]: 参数非法, 必须传递函数");
            }
            if (Promise) {
                deferred = {};
                deferred.promise = new Promise(function (resolve, reject) {
                    deferred.resolve = resolve;
                    deferred.reject = reject;
                });
            }
            //超时设定
            if (timeout > 0) {
                uuid = setTimeout(function () {
                    __Applink.onComplete(uuid, { res: "[ Error ]: native响应超时" }, "fail");
                }, timeout);
            } else {
                uuid = __Applink.getUuid();
            }
            __Applink.registerCall(uuid, success, fail, deferred);
            __Applink.registerGC(uuid, timeout, this.GC_TIME);
            __Applink.postMessage(objName, method, params, uuid, this.PROTOCOL_NAME);

            if (deferred) {
                return deferred.promise;
            }
        }
        /**
         * 用来触发事件, native调用js绑定好的事件
         * @param eventname {String} 事件名
         * @param eventdata {String} 参数
         */

    }, {
        key: "fireEvent",
        value: function fireEvent(eventName, eventData) {
            var ev = doc.createEvent('HTMLEvents');
            //事件名, 不冒泡, 可以取消
            ev.initEvent(eventName, false, true);
            //都赋值给了event.param对象
            ev.param = JSON.parse(eventData);
            //分发这个事件到浏览器
            doc.dispatchEvent(ev);
        }
        //给客户端的成功与失败回掉

    }, {
        key: "onSuccess",
        value: function onSuccess(uuid, data) {
            __Applink.onComplete(uuid, data, 'success');
        }
    }, {
        key: "onFail",
        value: function onFail(uuid, data) {
            __Applink.onComplete(uuid, data, 'fail');
        }
    }]);

    return Applink;
}();

Applink.IFRAME_PRE = "iframe_";
Applink.SUCCESS_PRE = "succ_";
Applink.FAILURE_PRE = "fail_";
Applink.DEFERRED_PRE = "defe_";


window.Applink = Applink;