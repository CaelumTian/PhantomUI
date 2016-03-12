/**
 * Created by caelumtian on 16/3/12.
 */
;(function(global) {
    var OffCanvas = Class.create(Widget, {
        element : ".offcanvas",
        isOpen : false,
        attrs : {
            direction : "left",
            effect : "cover"      //导航效果
        },
        setup : function() {
            this.on("opened", this._opened);
            this.on("closed", this._closed);
            this.$element.addClass("offcanvas-" + this.get("direction"));
            this.$element.addClass("offcanvas-" + this.get("effect"));
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

            //触发 layout, 不触发会导致cover动画效果消失
            this.element.offsetWidth;

            var transitionTarget = this.get("effect") === "reveal" ? $(".page").eq(0) : this.$element;
            console.log(transitionTarget);

            transitionTarget.on("transitionEnd webkitTransitionEnd", function(event) {
                self.isOpen = true;
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

            console.log(transitionTarget);
            transitionTarget.on("transitionEnd webkitTransitionEnd", function(event) {
                self.isOpen = false;
                self.trigger("closed");
                self.$element.css({
                    display : "none"
                });
                transitionTarget.off("transitionEnd webkitTransitionEnd");
            });
            $(document.body).addClass("offcanvas-closing").removeClass("with-offcanvas-" + this.get("direction") + "-" + this.get("effect"))
        },
        _opened : function() {
            console.log("菜单已经打开");
        },
        _closed : function() {
            console.log("菜单已经关闭");
        }
    });
    global.OffCanvas = OffCanvas;
})(this);