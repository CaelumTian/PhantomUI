/**
 * Created by caelumtian on 16/3/15.
 */
;(function(global) {
    var Tabs = Class.create(Widget, {
        element : ".tabs-group",
        attrs : {
            links : ".buttons-tab",
            container : ".tabs",
            aimClass : ".tab-link",
            handlerShow : null
        },
        setup : function() {
            //事件修复注意
            this.delegateEvents(document, "click .tab-link", this._showTab);
            this.on("showTab", this._handlerShow);
            this.render();
        },
        _handlerShow : function() {
            if(typeof this.handlerShow === "function") {
                this.handlerShow.call(this);
            }
        },
        _showTab : function(event) {
            event.preventDefault();
            var clicked = $(event.target);
            this._doShowTab(clicked.attr("href"), clicked);
        },
        _doShowTab : function(tab, force) {
            //获取要展示出来的新div
            var newTab = $(tab);
            if(newTab.hasClass("active")) {
                return false;
            }
            var tabs = newTab.parent(this.get("container"));
            var links = force.parent(this.get("links"));


            if (tabs.length === 0) {
                return false;
            }
            tabs.children('.tab.tab-active').removeClass('tab-active');
            links.children('.tab-link.active').removeClass("active");


            force.addClass("active");
            newTab.addClass('tab-active');
            this.trigger("showTab");
        }
    });
    global.Tabs = Tabs;
})(this);
