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
            direction : "horizon" //默认方向水平
        },
        setup : function() {
            //页面容器,总共页面数量, 单容器宽度
            this.sections = this.$element.find("section");
            this.total = this.sections.length;
            this.offsetValue = this.get("direction") === "vertical" ? this.sections.eq(0).height() : this.sections.eq(0).width();
            for(var i = 0; i < this.total; i++) {
                this.sections.eq(i).css({
                    "position" : "absolute",
                    "top" : "0px",
                    "left" : i * 100+ "%"
                }).attr("data-index", (i + 1));
            }
            this.sections.eq(0).addClass("active");
            this.delegateEvents(document, "touchstart .swiper-container", this._handleTouchStart);
            this.delegateEvents(document, "touchmove .swiper-container", this._handleTouchMove);
            this.delegateEvents(document, "touchend .swiper-container", this._handleTouchEnd);
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
                "-webkit-transform": (this.get("direction") === 'vertical') ? "translate3d(0," + (comPos - this.get("offWidth") * currentIndex) + "px,0)" : "translate3d(" + (comPos - this.get("offWidth") * currentIndex) + "px,0,0)",
                "-webkit-transition": "all " + 0 + "ms ",
                "transform": (this.get("direction") == 'vertical') ? "translate3d(0," + (comPos - this.get("offWidth") * currentIndex) + "px,0)" : "translate3d(" + (comPos - this.get("offWidth") * currentIndex) + "px,0,0)",
                "transition": "all " + 0 + "ms "
            });
            this.steps = 2;
        }
    });
    global.Swiper = Swiper;
})(this);
