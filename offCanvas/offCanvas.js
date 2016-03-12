/**
 * Created by caelumtian on 16/3/12.
 */
;(function(global) {
    var OffCanvas = Class.create(Widget, {
        element : ".offcanvas",
        isOpen : false,
        touchesStart  : {},         //记录鼠标位置x,y
        $overlay : null,
        isTouched : false,
        isMoved : false,
        attrs : {
            touchAction : true,   //是否开启手势滑动, 暂未开启
            overlayShow : false,  //遮罩层是否显示
            direction : "left",
            effect : "reveal",      //导航效果,
            callbackOpen : null,
            callbackClose : null,
        },
        setup : function() {
            //初始化配置
            this.$overlay = $('.offcanvas-overlay');

            //配置事件监听
            this.on("opened", this._opened);
            this.on("closed", this._closed);

            //遮罩层关闭事件
            this.delegateEvents(document, "click .offcanvas-overlay", this._handleClose);
            this.delegateEvents(document, "touchstart .offcanvas-overlay", this._handleClose);

            this.render();
        },
        _handleClose : function() {
            if(!this.isOpen) {
                return;
            }
            this.closeCanvas();
        },
        openCanvas : function() {
            var self = this;
            if(this.isOpen) {
                return;
            }
            if(this.$element.hasClass("active") || this.$element.length === 0) {
                return;
            }
            this.$element.css({
                display: 'block'
            }).addClass('active');

            self.isOpen = true;
            //触发 layout, 不触发会导致cover动画效果消失
            this.element.offsetWidth;

            var transitionTarget = this.get("effect") === "reveal" ? $(".page").eq(0) : this.$element;

            transitionTarget.on("transitionEnd webkitTransitionEnd", function(event) {
                self.trigger("opened");
                transitionTarget.off("transitionEnd webkitTransitionEnd");
            });

            $(document.body).addClass("with-offcanvas-" + this.get("direction") + "-" + this.get("effect"));

        },
        closeCanvas : function() {
            var self = this;
            if(!this.isOpen) {
                return;
            }
            this.$element.removeClass("active");
            var transitionTarget = this.get("effect") === "reveal" ? $(".page").eq(0) : this.$element;
            self.isOpen = false;
            transitionTarget.on("transitionEnd webkitTransitionEnd", function(event) {
                self.trigger("closed");
                self.$element.css({
                    display : "none"
                });
                $(document.body).removeClass("offcanvas-closing");
                transitionTarget.off("transitionEnd webkitTransitionEnd");
            });
            $(document.body).addClass("offcanvas-closing").removeClass("with-offcanvas-" + this.get("direction") + "-" + this.get("effect"))
        },
        _onRenderOverlayShow : function() {
            if(this.get("overlayShow")) {
                this.$overlay.css({
                    background : "rgba(0, 0, 0, 0.5)"
                })
            }
        },
        _onRenderEffect : function() {
            //重置属性
            this.$element.removeClass("offcanvas-reveal offcanvas-cover");
            this.$element.addClass("offcanvas-" + this.get("effect"));
        },
        _onRenderDirection : function() {
            //重置方向
            this.$element.removeClass("offcanvas-left offcanvas-right");
            this.$element.addClass("offcanvas-" + this.get("direction"));
        },
        _handleTouchStart : function() {

        },
        _handleTouchMove : function() {

        },
        _handleTouchEnd : function() {

        },
        _opened : function() {
            console.log("菜单已经打开");
            if(typeof this.get("callbackOpen") === "function") {
                this.get("callbackOpen").call(this);
            }
        },
        _closed : function() {
            console.log("菜单已经关闭");
            if(typeof this.get("callbackClose") === "function") {
                this.get("callbackClose").call(this);
            }
        }
    });
    global.OffCanvas = OffCanvas;
})(this);