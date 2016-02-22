/**
 * 提供简单的OO原型继承
 */
(function(global) {
    "use strict"
    global.Class = {
        /**
         * @param superclass  父类
         * @param definition  类的属性设置
         * @returns {_Object}  返回生成好的类
         */
        create : function(superclass, definition) {
            if(arguments.length === 1) {
                definition = superclass;
                superclass = Object;
            }
            if(typeof superclass !== "function") {
                throw new Error("superclass must be fun");
            }
            var _super = superclass.prototype;

            //删去静态方法（静态方法不能被继承）
            var statics = definition.statics;
            delete definition.statics;

            // 用于返回的中间类,调去deinition对象中的内容
            function _Object() {
                this.init.apply(this, arguments);
            }
            _Object.prototype = Object.create(_super);

            //_super 属性保存父类原型
            _Object.prototype._super = _super;
            _Object.prototype.constructor = _Object;

            //确保一定存在init方法
            if(typeof _Object.prototype.init !== 'function') {
                _Object.prototype.init = function() {
                    superclass.apply(this, arguments);
                }
            }
            //copy对象内容到原型中
            for(var name in definition) {
                _Object.prototype[name] = definition[name];
            }

            //绑定静态内容
            _Object.statics = {};
            for(var name in statics) {
                _Object.statics[name] = statics[name];
            }

            return _Object;
        }
    }

})(this);