;(function(win) {
    var ua = win.navigator.userAgent;
    var env = {};
    var matched;
    /**
     * 获取url参数
     */
    (function() {
        var search = window.location.search.replace(/^\?/, "");
        var params = {};
        if(search) {
            var t_params = search.split("&");
            for(var i = 0, len = t_params.length; i < len; i++) {
                var p = t_params[i].split("=")[0];
                var key = p + "=";
                var value = t_params[i].split(key)[1];

                t_params[i] = t_params[i].split("=");

                try {
                    params[t_params[i][0]] = decodeURIComponent(value);
                }catch(e) {
                    params[t_params[i][0]] = value;
                }
            }
        }
        env.params = params;
    })();
    /**
     * 判断浏览器类型, webview类型
     * 主要有: chrome, safari, firefox, IE, UC, QQ, Andriod
     */
    (function() {
        var browser = {
            name: "unknown",
            version: "0.0.0"
        };
        if((matched = ua.match(/(?:Chrome|CriOS)\/([\d\.]+)/))) {
            browser = {
                name: "Chrome",
                isChrome: true,
                version: matched[1]
            };
            if(ua.match(/Version\/[\d+\.]+\s*Chrome]/)) {
                browser.name = "Chrome Webview";
                browser.isWebview = true;
            }
        }else if(ua.match(/iPhone|iPad|iPod/)) {
            if(ua.match(/Safari/) && (matched = ua.match(/Version\/([\d\.]+)/))) {
                browser = {
                    name: "Safari",
                    isSafari: true,
                    version: matched[1]
                }
            }else if((matched = ua.match(/OS ([\d_\.]+) like Mac OS X/))) {
                browser = {
                    name: "iOS Webview",
                    isWebview: true,
                    version: matched[1].split('_').join(".")
                }
            }
        }else if((matched = ua.match(/MISE\s([\d\.]+)/)) || (matched = ua.match(/IEMobile\/([\d\.]+)/))) {
            browser = {
                version: matched[1]
            };
            if(ua.match(/IEMobile/)) {
                browser.name = "IEMobile";
                browser.isIEMobile = true;
            }else {
                browser.name = "IE";
                browser.isIE = true;
            }
            if(ua.match(/Android|iPhone/)) {
                browser.isIELikeWebkit = true;
            }
        }else if(!!ua.match(/Safari/) && (matched = ua.match(/Android[\s\/]([\d\.]+)/))) {
            browser = {
                name: "Android",
                isAndroid: true,
                version: matched[1]
            }
        }else if((mathced = ua.match(/(?:UCWEB|UCBrowser\/)([\d\.]+)/))) {
            browser = {
                name: "UC",
                isUC: true,
                version: matched[1]
            }
        }else if((matched = ua.match(/MQQBrowser\/([\d\.]+)/))) {
            browser = {
                name: "QQ",
                isQQ: true,
                version: matched[1]
            }
        }else if((matched = ua.match(/(?:Firefox|FxiOS)\/([\d\.]+)/))) {
            browser = {
                name: "Firefox",
                isFirefox: true,
                version: matched[1]
            }
        }
        env.browser = browser;
    })();
    /**
     * 判断屏幕尺寸,dpr,缩放比例
     */
    (function() {
        var screen = {};
        screen.dpr = window.devicePixelRatio;
        screen.vw = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth;
        screen.vh = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;

        var match = document.querySelector("meta[name=viewport]").getAttribute("content").match(/initial\-scale=([\d\.]+)/);
        if(match) {
            screen.scale = parseFloat(match[1]);
        }else {
            screen.scale = parseFloat((1 / screen.dpr).toFixed(2));
        }
        env.screen = screen;
    })();
    /**
     * 判断设备系统类型
     * 主要有: windows phone, Android, AndroidPad, iOS, iPad
     */
    (function() {
        var os = {
            name: "unknown",
            version: "0.0.0"
        };
        if((matched = ua.match(/Windows\sPhone\s(?:OS\s)?([\d\.]+)/))) {
            os = {
                name: "Windows Phone",
                isWindowsPhone: true,
                version: matched[1]
            }
        }else if(!!ua.match(/Safari/) && (matched = ua.match(/Android[\s\/]([\d\.]+)/))) {
            os = {
                version: matched[1]
            };
            if(!!ua.match(/Mobile\s+Safari/)) {
                os.name = "Android";
                os.isAndroid = true;
            }else {
                os.name = 'AndroidPad';
                os.isAndroidPad = true;
            }
        }else if((matched = ua.match(/(iPhone|iPad|iPod)/))) {
            let name = matched[1];
            if((matched = ua.match(/OS ([\d_\.]+) like Mac OS X/))) {
                os = {
                    name: name,
                    isIPhone: (name === "iPhone" || name === "iPod"),
                    isIPad: name === "iPad",
                    isIOS: true,
                    version: matched[1].split('_').join(".")
                }
            }
        }
        env.os = os;
    })();
    /**
     * 判断三方app类型
     */
    (function() {
        var thirdapp = {};

        if(!!ua.match(/MicroMessage/i)) {
            thirdapp = {
                appname: "WeiXin",
                isWeiXin: true
            }
        }else if(!!ua.match(/QQ/i)) {
            thirdapp = {
                appname: "QQ",
                isQQ: true
            }
        }
        env.thirdapp = thirdapp;
    })();

    win.SI = win.SI || {};
    win.SI.env = env;
})(window);
