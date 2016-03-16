/**
 * Created by caelumtian on 16/3/16.
 */
;(function(global) {
    var Swiper = Class.create(Widget, {
        touchDown : false,
        startPos : NaN,
        endPos : NaN,
        steps : NaN,
        attrs : {
            limitDistance : 50,     //拉动阀值
            animationTime : 500,  //切换时间
            easing : "ease",      //切换动画
            pagination : true,    //是否显示导航
            direction : "horizon", //默认方向水平
            loop : true,            //是否允许循环(定时采用)
            callbackStart : null,
            callbackEnd : null
        },
        setup : function() {
            //页面容器,总共页面数量, 单容器宽度
            this.sections = this.$element.find("section");
            this.total = this.sections.length;
            this.offsetValue = this.get("direction") === "vertical" ? this.sections.eq(0).height() : this.sections.eq(0).width();
            for(var i = 0; i < this.total; i++) {
                this.sections.eq(i).attr("data-index", (i + 1));
            }
            this.sections.eq(0).addClass("active");
            this.on("swiperStart", this._handleStart);
            this.on("swiperEnd", this._handleEnd);

            this.delegateEvents(document, "touchstart .swiper-container", this._handleTouchStart);
            this.delegateEvents(document, "touchmove .swiper-container", this._handleTouchMove);
            this.delegateEvents(document, "touchend .swiper-container", this._handleTouchEnd);
            //PC端, 最后可以删去
            this.delegateEvents(document, "mousedown .swiper-container", this._handleTouchStart);
            this.delegateEvents(document, "mousemove .swiper-container", this._handleTouchMove);
            this.delegateEvents(document, "mouseup .swiper-container", this._handleTouchEnd);
        },
        _handleTouchStart : function(event) {
            event.preventDefault();
            this.touchDown = true;
            this.steps = 1;
            //修正PC端和移动端
            if(event.type === "touchstart") {
                var pageX = event.targetTouches[0].pageX;
                var pageY = event.targetTouches[0].pageY;
            }else {
                var pageX = event.pageX;
                var pageY = event.pageY;
            }
            this.get("direction") === "horizon" ? this.startPos = pageX : this.startPos = pageY;
        },
        _handleTouchMove : function(event) {
            event.preventDefault();
            if(this.touchDown === false) {
                return false;
            }
            if(event.type === "touchmove") {
                var pageX = event.targetTouches[0].pageX;
                var pageY = event.targetTouches[0].pageY;
            }else {
                var pageX = event.pageX;
                var pageY = event.pageY;
            }
            this.get("direction") === "horizon" ? this.endPos = pageX : this.endPos = pageY;
            this._scrollMove();
        },
        _scrollMove : function() {
            var index = this.$element.find("section.active").data("index"),
                $current = this.$element.find("[data-index='" + index + "']"),
                $pre = this.$element.find("[data-index='" + (index - 1) + "']"),
                $next = this.$element.find("[data-index='" + (index + 1) + "']"),
                comPos = this.endPos - this.startPos;
            if(comPos < 0) {
                if($next.length === 0) {
                    return false;
                }
            }else {
                if($pre.length === 0) {
                    return false;
                }
            }
            var currentIndex = parseInt(index) - 1;
            this.$element.css({
                "-webkit-transform": (this.get("direction") === 'vertical') ? "translate3d(0," + (comPos - this.offsetValue * currentIndex) + "px,0)" : "translate3d(" + (comPos - this.offsetValue * currentIndex) + "px,0,0)",
                "-webkit-transition": "all " + 0 + "ms ",
                "transform": (this.get("direction") === 'vertical') ? "translate3d(0," + (comPos - this.offsetValue * currentIndex) + "px,0)" : "translate3d(" + (comPos - this.offsetValue * currentIndex) + "px,0,0)",
                "transition": "all " + 0 + "ms "
            });
            this.steps = 2;
        },
        _handleTouchEnd : function(event) {
            event.preventDefault();
            if(this.steps !== 2) {
                return;
            }else {
                this.touchDown = false;
            }
            var comPos =  this.endPos - this.startPos,
                index = this.$element.find("section.active").data("index");

            if(Math.abs(comPos) < this.get("limitDistance")) {
                this.$element.css({
                    "-webkit-transform": (this.get("direction") === 'vertical') ? "translate3d(0," + (parseInt( index - 1) * -100) + "%, 0)" : "translate3d(" + (parseInt(index - 1) * -100) + "%,0,0)",
                    "-webkit-transition": "all " + 500 + "ms ",
                    "transform": (this.get("direction") === 'vertical') ? "translate3d(0," + (parseInt(index - 1) * -100) + "%,0)":"translate3d(" + (parseInt(index - 1) * -100) + "%,0,0)",
                    "transition": "all " + 500 + "ms "
                })
            }else {
                if(comPos < 0) {
                    this.turnNext();
                }else {
                    this.turnPre();
                }
            }
            this.steps = 3;
        },
        /**
         * 跳转到下一个页面
         * @returns {boolean} 是否成功
         */
        turnNext : function() {
            var index = this.$element.find("section.active").data("index"),
                $current = this.$element.find("[data-index='" + index + "']"),
                $next = this.$element.find("[data-index='" + (index + 1) + "']");
            if($next.length === 0) {
                //开启循环设置, 则直接跳转到第一个
                if(this.get("loop")) {
                    var pos = 0;
                    $next = this.$element.find("[data-index='1']");
                }else {
                    return false;
                }
            }else {
                var pos = (index * 100) * -1;
            }
            $current.removeClass("active");
            $next.addClass("active");
            this._transformPage(pos, $next.data("index"));
        },
        /**
         * 跳转到上一个页面
         * @returns {boolean} 是否成功
         */
        turnPre : function() {
            var index = this.$element.find("section.active").data("index"),
                $current = this.$element.find("[data-index='" + index + "']"),
                $pre = this.$element.find("[data-index='" + (index - 1) + "']");
            if($pre.length === 0) {
                if(this.get("loop")) {
                    var pos = ((this.total - 1) * 100) * -1;
                    $pre = this.$element.find("[data-index='" + this.total + "']");
                }else {
                    return;
                }
            } else {
                var pos = (($pre.data("index") - 1) * 100) * -1;
            }
            $current.removeClass("active");
            $pre.addClass("active");

            this._transformPage(pos, $pre.data("index"));
        },
        /**
         * 运动函数
         * @param pos   运动距离
         * @param index 当前索引
         * @private
         */
        _transformPage : function(pos, index) {
            var self = this;
            this.trigger("swiperStart");
            this.$element.css({
                "-webkit-transform": (this.get("direction") == 'horizon') ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
                "-webkit-transition": "all " + this.get("animationTime") + "ms " + this.get("easing"),
                "-moz-transform": (this.get("direction") == 'horizon') ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
                "-moz-transition": "all " +  this.get("animationTime") + "ms " + this.get("easing"),
                "-ms-transform": (this.get("direction") == 'horizon') ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
                "-ms-transition": "all " +  this.get("animationTime") + "ms " + this.get("easing"),
                "transform": (this.get("direction") == 'horizon') ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
                "transition": "all " +  this.get("animationTime") + "ms " + this.get("easing")
            });
            this.$element.on("transitoinEnd webkitTransitionEnd", function() {
                //滚动完毕,触发回掉
                self.trigger("swiperEnd");
                self.$element.off("transitionEnd webkitTransitionEnd");
            })
        },
        _handleStart : function() {
            if(typeof this.get("callbackStart") === "function") {
                this.get("callbackStart").call(this);
            }
        },
        _handleEnd : function() {
            if(typeof this.get("callbackEnd") === "function") {
                this.get("callbackEnd").call(this);
            }
        }
    });
    global.Swiper = Swiper;
})(this);
