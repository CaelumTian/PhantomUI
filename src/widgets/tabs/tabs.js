/**
 * Created by caelumtian on 16/3/15.
 */
;(function(global) {
    var Tabs = Class.create(Widget, {
        element : ".tabs-group",
        attrs : {
            container : ".tabs",
            aimClass : ".tab-link"
        },
        setup : function() {
            //事件修复注意
            this.delegateEvents(document, "click .tab-link", this._showTab);
            this.on("showTab", this._handlerShow);
            this.render();
        },
        _handlerShow : function() {

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
            if (tabs.length === 0) {
                return false;
            }
            var oldTab = tabs.children('.tab.active').removeClass('active');
            newTab.addClass('active');
            this.trigger("showTab");
        }
    });
    global.Tabs = Tabs;
})(this);
