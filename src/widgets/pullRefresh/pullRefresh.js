/**
 * Created by caelumtian on 16/3/10.
 */
;(function(global) {
    var PullRefresh = Class.create(Widget, {
        element : ".pull-refresh-content",
        isTouched : false,
        isMoved : false,
        isScolling : undefined,
        wasScrolled : undefined,
        touchesStart  : {},
        attrs : {
            top : 0,            //下拉刷新 容器 上端距离
            distance : 45,
            handleRefresh : null,
        },
        setup : function() {
            //重新计算距离位置
            this.$element.css({
                "top" : this.get("top")
            });

            //注册事件
            this.on("refresh", this._handlerRefresh);
            this.delegateEvents(document, "touchstart .pull-refresh-content", this._handleTouchStart);
            this.delegateEvents(document, "touchmove .pull-refresh-content", this._handleTouchMove);
            this.delegateEvents(document, "touchend .pull-refresh-content", this._handleTouchEnd);

            //监听鼠标事件, 最后可以考虑删去
            this.delegateEvents(document, "mousedown .pull-refresh-content", this._handleTouchStart);
            this.delegateEvents(document, "mousemove .pull-refresh-content", this._handleTouchMove);
            this.delegateEvents(document, "mouseup .pull-refresh-content", this._handleTouchEnd);
        },
        _handleTouchStart : function(event) {
            this.isTouched = true;
            if(event.type === "touchstart") {
                this.touchesStart.x = event.targetTouches[0].pageX;
                this.touchesStart.y = event.targetTouches[0].pageY;
            }else {
                this.touchesStart.x = event.pageX;
                this.touchesStart.y = event.pageY;
            }
        },
        _handleTouchMove : function(event) {
            if(!this.isTouched) {
                return;
            }
            if(event.type === "touchmove") {
                var pageX = event.targetTouches[0].pageX;
                var pageY = event.targetTouches[0].pageY;
            }else {
                var pageX = event.pageX;
                var pageY = event.pageY;
            }
            if (typeof this.isScrolling === 'undefined') {
                this.isScrolling = !!(this.isScrolling || Math.abs(pageY - this.touchesStart.y) > Math.abs(pageX - this.touchesStart.x));
            }
            if(!this.isScrolling) {
                this.isTouched = false;
                return;
            }
            this.scrollTop = this.element.scrollTop;
            if(typeof this.wasScrolled === 'undefined' && this.scrollTop !== 0) {
                this.wasScrolled = true;
            }
            if(!this.isMoved) {
                console.log("111");
                this.$element.removeClass("transitioning");
                if(this.scrollTop > this.element.offsetHeight) {
                    this.isTouched = false;
                    return;
                }
                this.startTranslate = this.$element.hasClass('refreshing') ? this.get("distance") : 0;
                console.log(this.startTranslate);

                this.useTranslate = true;
            }
            this.isMoved = true;
            //移动距离
            this.touchesDiff = pageY - this.touchesStart.y;


            if(this.touchesDiff > 0 && this.scrollTop <= 0 || this.scrollTop < 0) {
                if(this.useTranslate) {
                    event.preventDefault();
                    this.translate = (Math.pow(this.touchesDiff, 0.85) + this.startTranslate);
                    //移动容器
                    this.$element.css({
                        "transform" : 'translate3d(0,' + this.translate + 'px,0)'
                    })
                }
                if ((this.useTranslate && Math.pow(this.touchesDiff, 0.85) > this.get("distance")) || (!this.useTranslate && this.touchesDiff >= this.get("distance") * 2)) {
                    this.refresh = true;
                    this.$element.addClass('pull-up').removeClass('pull-down');
                } else {
                    this.refresh = false;
                    this.$element.removeClass('pull-up').addClass('pull-down');
                }

            }else {
                this.$element.removeClass('pull-up pull-down');
                this.refresh = false;
                return;
            }
        },
        _handleTouchEnd : function() {
            if(!this.isTouched || !this.isMoved) {
                this.isTouched = false;
                this.isMoved = false;
                return;
            }
            if (this.translate) {
                this.$element.addClass('transitioning');
                this.translate = 0;
            }
            this.$element.css({
                "transform" : ""
            });
            if (this.refresh) {
                //防止二次触发
                if(this.$element.hasClass('refreshing')) return;
                this.$element.addClass('refreshing');
                this.trigger('refresh');
            } else {
                this.$element.removeClass('pull-down');
            }

            this.isTouched = false;
            this.isMoved = false;
        },
        refreshDone : function() {
            var self = this;
            this.$element.removeClass('refreshing').addClass('transitioning');
            this.$element.on("transitionEnd webkitTransitionEnd", function() {
                self.$element.removeClass('transitioning pull-up pull-down');
                self.$element.off("transitionEnd webkitTransitionEnd");
            })
        },
        _handlerRefresh : function() {
            var callback = this.get("handleRefresh");
            if(typeof callback === "function") {
                callback.call(this);
            }else {
                console.warn("refresh function is not find");
                this.refreshDone();
            }
        }
    });
    global.PullRefresh = PullRefresh;
})(this);
