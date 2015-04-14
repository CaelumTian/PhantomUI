if (typeof String.prototype.trim === "undefined") {
    String.prototype.trim = function() {　　
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
}
function Validator(value) {
    if (! (this instanceof Validator)) {
        return new Validator(value);
    }
    this._value = value.trim();
}
Validator.prototype = {
    _removeAllSpace: function() {
        var localString = '';
        for (var index = 0; index < this._value.length; index++) if (this._value.charCodeAt(index) != 32) {
            localString += this._value.charAt(index);
        };
        this._value = localString; //返回值
    },
    isIdCard: function() {
        var Valide = {
            Wi: [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1],
            //加权因子，
            Code: [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2] //省份证验证值10为x
        }
        this._removeAllSpace();
        if (this._value.length === 15) {
            return validId15(this._value); //15位验证
        } else {
            var a_idCard = this._value.split(""); //得到身份证数组
            if (validId18(this._value) && isTrueValidate(a_idCard)) {
                return true;
            } else {
                return false;
            }
        }
        function validId15(idValue) {
            var year = idValue.substring(6, 8);
            var month = idValue.substring(8, 10);
            var day = idValue.substring(10, 12);
            var temp_data = new Date(year, parseFloat(month) - 1, parseFloat(day));
            if (temp_data.getYear() != parseFloat(year) || temp_data.getMonth() != parseFloat(month) - 1 || temp.data.getDate() != parseFloat(day)) {
                return false;
            } else {
                return true;
            }
        }
        function validId18(idValue) {
            var year = idValue.substring(6, 10);
            var month = idValue.substring(10, 12);
            var day = idValue.substring(12, 14);
            var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
            if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
                return false;
            } else {
                return true;
            }
        }
        function isTrueValidate(a_idCard) {
            var sum = 0;
            if (a_idCard[17].toLowerCase() === 'x') {
                a_idCard[17] = 10;
            }
            for (var i = 0; i < 17; i++) {
                sum += Valide.Wi[i] * a_idCard[i];
            }
            valCodePosition = sum % 11;
            if (a_idCard[17] == Valide.Code[valCodePosition]) {
                return true;
            } else {
                return false;
            }
        }
    },
    //验证身份证号
    isCarNum: function() {
        return /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/.test(this._value);
    },
    //车牌号
    isMobile: function() {
        return /^13\d{9}$|^14\d{9}$|^15\d{9}$|^18\d{9}$|^17\d{9}$/.test(this._value);
    },
    isTelNum: function() {
        return /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(this._value);
    },
    isEmail: function() {
        return /^[a-z0-9-_.]+@[\da-z][\.\w-]+\.[a-z]{2,4}$/i.test(this._value);
    },
    isIpv4: function() {
        return /^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/.test(this._value);
    },
    isChEnNum: function() {
        return /^[0-9a-zA-Z\u4e00-\u9fa5]+$/.test(this._value);
    },
    //是否只有中文英文数字
    isNumber: function() {
        return /^(\d*\.)?\d+$/.test(this._value);
    },
    //是否为实数
    isQQ: function() {
        return /[1-9][0-9]{4,}/.text(this._value);
    }
}