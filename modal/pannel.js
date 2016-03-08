/**
 * Created by caelumtian on 16/3/6.
 */
(function(global) {
    /**
     * 要不要设计成单例模式?
     * 遮罩层代码
     * @type {*|_Object}
     */
    var Pannel = Class.create(Widget, {
        attrs : {
            className : "page-panel",
            hiddenClass : "scoll-hidden",
            template: '<div></div>'
        },
        setup : function() {
            this.$body = $("body");
            this.render();
        },
        show : function() {
            var $body = this.$body;
            if(!$body.hasClass(this.get("hiddenClass"))) {
                $body.addClass(this.get("hiddenClass"));
                this.$element.css({
                    "visibility" : "visible",
                    "opacity" : 1
                });
            }
        },
        hide : function() {
            var self = this;
            this.$body.removeClass(this.get("hiddenClass"));
            this.$element.css({
                "opacity" : 0
            });
            this.$element.on("transitionEnd webkitTransitionEnd", function() {
                self.$element.css({
                    "visibility" : "hidden"
                });
                self.$element.off("transitionEnd webkitTransitionEnd");
            })
        }
    });
    global.Pannel = Pannel;
})(this);
