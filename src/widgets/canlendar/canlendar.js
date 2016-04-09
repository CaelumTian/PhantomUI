/**
 * Created by caelumtian on 16/4/7.
 */
var doc = window.document;
var Calendar = function(options) {
    "use strict";
    //默认参数
    var defaults = {
        //中文格式内容
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月' , '九月' , '十月', '十一月', '十二月'],
        dayNames : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayLongNames : ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        holiday : {
            "1-1" : "元旦",
            "2-2" : "湿地日",
            "2-14" : "情人节",
            "3-8" : "妇女节",
            "3-12" : "植树节",
            "3-15" : "消费者权益日",
            "4-1" : "愚人节",
            "4-22" : "地球日",
            "5-1" : "劳动节",
            "5-4" : "青年节",
            "5-12" : "护士节",
            "5-18" : "博物馆日",
            "6-1" : "儿童节",
            "6-5" : "环境日",
            "6-23" : "奥林匹克日",
            "6-24" : "骨质疏松日",
            "7-1" : "建党节",
            "8-1" : "建军节",
            "9-3" : "抗战胜利日",
            "9-10" : "教师节",
            "10-1" : "国庆节",
            "11-17" : "学生日",
            "12-1" : "艾滋病日",
            "12-24" : "平安夜",
            "12-25" : "圣诞节"
        },

        firstDay: 1,         // 从周一开始,计算
        weekendDays: [0, 6], // 周六, 周日
        dateFormat: 'yyyy-mm-dd',  //打印格式, formatDate 对应,
        weekHandler : "dayThead",
        monthContainer : "dateUl",

        limitDis : 80        //滑动距离限制, 大于该距离时, 触发切换页面
    };
    //参数调整
    options = options || {};
    for (var prop in defaults) {
        if (typeof options[prop] === 'undefined') {
            options[prop] = defaults[prop];
        }
    }
    this.attrs = options;
    //触摸起始点记录
    this.touchesStart = {};
    this.init();
};
Calendar.prototype = {
    constructor : Calendar,
    init : function() {
        //初始化事件
        this.initEvents();
        //布局页面
        this.layout();
        //初始化参数
        this.index = 0;
        this._interval = true;
        this.offsetValue = this.monthEle.offsetWidth;
        //节点操作
        this.timeNowEle = doc.querySelector(".timeNow");
        this.bigTimeEle = doc.querySelector(".bigTime");
        this.noliDateEle = doc.querySelector(".noliDate");
        this.gooList = doc.querySelector(".gooList");
        this.badList = doc.querySelector(".badList");

        //初始化 aside页面
        this.setAside();
    },
    setAside : function(date) {
        date = date || new Date();
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate();
        var noli = Util.getLunarCalendar(year, month + 1, day);
        var suitTaboo = Util.getSuitAndTaboo(year, month + 1, day);
        var gooStr = "<i>宜</i>";
        var badStr = "<i>忌</i>";
        this.timeNowEle.innerHTML =   "<span>" + year + "年" + (month + 1) + "月" + "</span>"
            + "<span>" + this.attrs.dayLongNames[date.getDay()] + "</span>";
        this.bigTimeEle.innerHTML = "<span>" + day + "</span>";
        this.noliDateEle.innerHTML =   "<p>" + noli["month"] + noli["date"] +"</p>"
            + "<p>" + Util.getSexagenaryCycle(year) + "【" +Util.getZodiac(year) + "】" +"</p>";

        for(var i = 0, len = suitTaboo["suit"].length; i < len; i++) {
            gooStr += "<span>" +  suitTaboo["suit"][i] +"</span>";
        }
        for(var i = 0, len = suitTaboo["taboo"].length; i < len; i++) {
            badStr += "<span>" + suitTaboo["taboo"][i] + "</span>";
        }
        this.gooList.innerHTML = gooStr;
        this.badList.innerHTML = badStr;
    },
    initEvents : function() {
        var self = this;
        var monthEle = this.monthEle = doc.querySelector("." + this.attrs.monthContainer);
        this.goPrev = doc.querySelector(".goPrev");
        this.goNext = doc.querySelector(".goNext");

        monthEle.addEventListener("mousedown", this._handleTouchStart.bind(this), false);
        monthEle.addEventListener("mousemove", this._handleTouchMove.bind(this), false);
        monthEle.addEventListener("mouseup", this._handleTouchEnd.bind(this), false);
        monthEle.addEventListener("click", this._handleClick.bind(this), false);

        this.goPrev.addEventListener("click", function(event) {
            self.turnPre();
        }, false);
        this.goNext.addEventListener("click", function(event) {
            self.turnNext();
        }, false);
        /**
         * 问题, bind(this)的事件函数, 无法removeEventListener
         */
        monthEle.addEventListener("transitionend", this._transformEnd.bind(this), false);
        monthEle.addEventListener("webkitTransitionEnd", this._transformEnd.bind(this), false);
    },
    _handleClick : function(event) {
        event.preventDefault();
        var target = event.target,
            eleName = target.nodeName;
        if(eleName === "SPAN") {
            var aim = target.parentNode;
            var year = parseInt(aim.getAttribute("data-year")),
                month = parseInt(aim.getAttribute("data-month")),
                day = parseInt(aim.getAttribute("data-day"));
            if(this._oldEle) {
                this._oldEle.classList.remove("date-selected");
            }
            aim.classList.add("date-selected");
            this._oldEle = aim;
            this.setAside(new Date(year, month, day))
        }else {
            return;
        }
    },
    _handleTouchStart : function(event) {
        event.preventDefault();
        this.isTouched = true;
        if(event.type === "touchstart") {
            this.touchesStart.x = event.targetTouches[0].pageX;
        }else {
            this.touchesStart.x = event.pageX;
        }
    },
    _handleTouchMove : function(event) {
        event.preventDefault();
        if(!this.isTouched) {
            return;
        }
        this.isMoved = true;
        if(event.type === "touchmove") {
            var pageX = event.targetTouches[0].pageX;
        }else {
            var pageX = event.pageX;
        }
        //横向移动距离
        this.touchesDiff = pageX - this.touchesStart.x;
        //设置样式
        this.monthEle.style[Util.prefix + "transition"] = "0ms";
        this.monthEle.style[Util.prefix + "transform"] = "translate3d(" + (this.index * this.offsetValue + this.touchesDiff) + "px, 0px, 0px";

    },
    _handleTouchEnd : function(event) {
        event.preventDefault();
        if(!this.isTouched || !this.isMoved) {
            this.isTouched = false;
            this.isMoved = false;
            return;
        }

        if(event.type === "touchend") {
            var pageX = event.targetTouches[0].pageX;
        }else {
            var pageX = event.pageX;
        }
        var comPos = pageX - this.touchesStart.x;
        if(Math.abs(comPos) < this.attrs.limitDis) {
            this._transformPage();
        }else {
            if(comPos < 0) {
                this.turnNext();  //下一页
            }else {
                this.turnPre();   //上一页
            }
        }

        this.isTouched = false;
        this.isMoved = false;
    },
    turnPre : function() {
        if(!this._interval) {
            return;
        }
        this.index++;
        this._isTurnPage = true;
        this._offset = "prev";
        //锁上操作, 防止多次触发
        this._interval = false;
        this._transformPage();
    },
    turnNext : function() {
        if(!this._interval) {
            return;
        }
        this.index--;
        this._isTurnPage = true;
        this._offset = "next";
        //锁上操作, 防止多次触发
        this._interval = false;
        this._transformPage();
    },
    _transformPage : function() {
        console.log(this.index);
        this.monthEle.style[Util.prefix + "transition"] = "300ms";
        this.monthEle.style[Util.prefix + "transform"] = "translate3d(" + (this.index * 100) + "%, 0, 0)";
    },

    _transformEnd : function() {
        //不是翻页不行
        var offset = this._offset;
        if(!this._isTurnPage) {
            return;
        }
        console.log("时间运算");
        var date = new Date(this.value);
        var year = date.getFullYear(),
            month = date.getMonth();

        //下个月
        if (offset === 'next') {
            if (month === 11) {
                date = new Date(year + 1, 0);
            }else {
                date = new Date(year, month + 1, 1);
            }
        }
        //上个月
        if (offset === 'prev') {
            if (month === 0) {
                date = new Date(year - 1, 11);
            }else {
                date = new Date(year, month - 1, 1);
            }
        }
        this.value = date;
        console.log(this.value);
        this.layout();
        // 重定位
        var index = this.index * -1;

        this.prevMonthEle = doc.querySelector(".prev-month-html");
        this.currMonthEle = doc.querySelector(".current-month-html");
        this.nextMonthEle = doc.querySelector(".next-month-html");

        this.prevMonthEle.style[Util.prefix + "transform"] = "translate3d(" + (index - 1) * 100  + "%, 0px, 0px)";
        this.currMonthEle.style[Util.prefix + "transform"] = "translate3d(" + (index) * 100 + "%, 0px, 0px)";
        this.nextMonthEle.style[Util.prefix + "transform"] = "translate3d(" + (index + 1) * 100 + "%, 0px, 0px)";

        //恢复锁,可以继续触发
        this._interval = true;
        this._isTurnPage = false;
    },
    /**
     * 重置时间
     * @param date
     */
    resetDate : function(date) {
        this.value = date;
        this.index = 0;
        this.monthEle.style[Util.prefix + "transition"] = "0ms";
        this.monthEle.style[Util.prefix + "transform"] = "translate3d(0 ,0 ,0)";
        this.prevMonthEle.style[Util.prefix + "transform"] = "translate3d(-100%, 0px, 0px)";
        this.currMonthEle.style[Util.prefix + "transform"] = "translate3d(0%, 0px, 0px)";
        this.nextMonthEle.style[Util.prefix + "transform"] = "translate3d(100%, 0px, 0px)";
        this.layout();
    },
    layout : function() {
        var layoutDate = this.value ? this.value: new Date().setHours(0,0,0,0);
        this.value = layoutDate;

        //三个月的 HTML信息
        var prevMonthHTML = this.monthHTML(layoutDate, 'prev');
        var currentMonthHTML = this.monthHTML(layoutDate);
        var nextMonthHTML = this.monthHTML(layoutDate, 'next');
        var monthHTML =   '<div class="dateLi prev-month-html"><div class="dayTbody">' + prevMonthHTML + "</div></div>"
            + '<div class="dateLi current-month-html"><div class="dayTbody">' + currentMonthHTML + "</div></div>"
            + '<div class="dateLi next-month-html"><div class="dayTbody">' + nextMonthHTML + "</div></div>"

        //渲染 星期头部
        var weekHeaderHTML = [];
        for(var i = 0; i < 7; i++) {
            var weekDayIndex = (i + this.attrs.firstDay > 6) ? (i - 7 + this.attrs.firstDay) : (i + this.attrs.firstDay);
            var dayName = this.attrs.dayNames[weekDayIndex];
            if(this.attrs.weekendDays.indexOf(weekDayIndex) !== -1) {
                //休息日样式
                weekHeaderHTML.push('<div class="dayTd active">' + dayName + '</div>');
            }else {
                weekHeaderHTML.push('<div class="dayTd">' + dayName + '</div>');
            }
        }

        //渲染各部分HTML
        doc.querySelector("." + this.attrs.weekHandler).innerHTML = weekHeaderHTML.join("");
        doc.querySelector("." + this.attrs.monthContainer).innerHTML = monthHTML;
    },
    /**
     * 获取当月总天数
     * @param date 日期
     */
    totalDaysInMonth : function(date) {
        var d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    },
    /**
     * 日期HTML设置
     * @param date   设置时间
     * @param offset 设置偏移 ["next" -> "下个月"  "prev" -> "上个月"]
     * @returns {string} 返回拼接好的HTML字符串
     */
    monthHTML : function(date, offset) {
        var date = new Date(date);
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate();

        //下个月
        if (offset === 'next') {
            if (month === 11) {
                date = new Date(year + 1, 0);
            }else {
                date = new Date(year, month + 1, 1);
            }
        }
        //上个月
        if (offset === 'prev') {
            if (month === 0) {
                date = new Date(year - 1, 11);
            }else {
                date = new Date(year, month - 1, 1);
            }
        }
        //调整时间
        if (offset === 'next' || offset === 'prev') {
            month = date.getMonth();
            year = date.getFullYear();
        }

        //上月 | 本月 总天数, 本月第一天索引
        var daysInPrevMonth = this.totalDaysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
            daysInMonth = this.totalDaysInMonth(date),
            firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();

        if (firstDayOfMonthIndex === 0) {
            firstDayOfMonthIndex = 7;
        }

        var dayDate,
            rows = 6,
            cols = 7,
            monthHTML = [],
            dayIndex = 0 + (this.attrs.firstDay - 1),
            today = new Date().setHours(0,0,0,0);

        for(var i = 1; i <= rows; i++) {
            var row = i;
            var tdList = [];
            for(var j = 1; j <= cols; j++) {
                var col = j;
                dayIndex ++;

                var dayNumber = dayIndex - firstDayOfMonthIndex;
                //要添加的类名, 默认dayTd
                var classNames = ["dayTd"];
                if(dayNumber < 0) {
                    //上个月日期
                    classNames.push("date-prev");
                    dayNumber = daysInPrevMonth + dayNumber + 1;
                    dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                }else {
                    dayNumber = dayNumber + 1;
                    if (dayNumber > daysInMonth) {
                        //下个月日期
                        classNames.push("date-next");
                        dayNumber = dayNumber - daysInMonth;
                        dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                    }else {
                        dayDate = new Date(year, month, dayNumber).getTime();
                    }
                }
                //今天
                if (dayDate === today) {
                    classNames.push("date-current");
                }
                //周六日
                if(dayIndex % 7 === this.attrs.weekendDays[0] || dayIndex % 7 === this.attrs.weekendDays[1]) {
                    classNames.push("date-reset");
                }
                dayDate = new Date(dayDate);

                var dayYear = dayDate.getFullYear();
                var dayMonth = dayDate.getMonth();

                //农历日期
                var ccalendar = Util.getLunarCalendar(dayYear, dayMonth + 1, dayNumber);
                var holiday = this.attrs.holiday[(dayMonth + 1) + "-" + dayNumber];
                if(holiday) {
                    var alamanac = holiday;
                    classNames.push("date-holiday");
                }else {
                    if(ccalendar["solarTerm"]) {
                        var alamanac = ccalendar["solarTerm"];
                        classNames.push("date-holiday");
                    }else {
                        var alamanac = ccalendar["date"];
                    }
                }

                tdList.push(
                    '<div class="' + classNames.join(" ") + '" data-year=' + dayYear + ' data-month=' + dayMonth + ' data-day=' + dayNumber + '>'
                    +   '<span class="dayNumber">' + dayNumber + "</span>"
                    +   '<span class="almanac">' + alamanac + "</span>"
                    + '</div>'
                )
            }
            monthHTML.push(
                '<div class="dayTr">' + tdList.join("") + '</div>'
            )
        }
        //这里需要重构, 多页面, 这里仅作测试
        //doc.querySelector(".dayTbody").innerHTML = monthHTML.join("");
        return monthHTML.join("");
    },
    formatDate : function(date) {
        date = new Date(date);
        var year = date.getFullYear();
        var month = date.getMonth();
        var month1 = month + 1;
        var day = date.getDate();
        var weekDay = date.getDay();
        return this.attrs.dateFormat
            .replace(/yyyy/g, year)
            .replace(/yy/g, (year + '').substring(2))
            .replace(/mm/g, month1 < 10 ? '0' + month1 : month1)
            .replace(/m/g, month1)
            .replace(/MM/g, this.attrs.monthNames[month])
            .replace(/dd/g, day < 10 ? '0' + day : day)
            .replace(/d/g, day)
            .replace(/DD/g, this.attrs.dayNames[weekDay])
    }
};
var Util = {
    /**
     * css前缀
     */
    prefix : (function() {
        var div = document.createElement('div');
        var cssText = '-webkit-transition:all .1s; -moz-transition:all .1s; -o-transition:all .1s; -ms-transition:all .1s; transition:all .1s;';
        div.style.cssText = cssText;
        var style = div.style;
        if(style.transition) {
            return '';
        }
        if (style.webkitTransition) {
            return '-webkit-';
        }
        if (style.MozTransition) {
            return '-moz-';
        }
        if (style.oTransition) {
            return '-o-';
        }
        if (style.msTransition) {
            return '-ms-';
        }
    })(),
    /**
     * 公历转化为积日（积日：1900年1月0日到当天的天数
     * @param year
     * @param month
     * @param day
     * @returns {number}
     * @private
     */
    _gregorianCalendarToAccumulateDate : function(year,month,day){
        var accumulateDate = 0;
        accumulateDate += (year - 1900) * 365;  //假设每年365天，计算天数
        accumulateDate += parseInt((year - 1901) / 4);  //将闰年数累加计数
        for (var eachMonth = month - 1;eachMonth > 0 ;eachMonth--){
            accumulateDate += (new Date(year, eachMonth, 0)).getDate();  //累加当年各月天数
        }
        accumulateDate += day;  //累加最后一月天数
        return accumulateDate;  //返回公历日期对应积日
    },
    /**
     * 计算积日的农历日期
     * @param accumulateDate
     * @returns {number}
     * @private
     */
    _getLunarDate : function(accumulateDate){
        //逆推估算是第几个朔日
        var reverseCalends = parseInt((accumulateDate-1.6) / 29.5306 );
        var calends = reverseCalends - 1;
        do{
            calends ++;
            //计算朔日积日
            var calendsAccumulateDate = parseInt(1.6 + 29.5306 * calends + 0.4 * Math.sin(1 - 0.45058 * calends));
            var solarTermDate = accumulateDate - calendsAccumulateDate + 1 ;
        }while(solarTermDate >= 30);
        //下一个朔日在当天的次日，当月即为大月，当日为农历三十
        if(solarTermDate === 0)
            return 30;
        else
            return solarTermDate;
    },
    /**
     * 计算某年某个节气的积日（公式）
     * @param differenceYear
     * @param solarTermSerialNumber
     * @returns {Number}
     * @private
     */
    _getSolarTermAccumulateDate : function(differenceYear,solarTermSerialNumber){
        var solarTermAccumulateDate = parseInt(365.242 * differenceYear + 6.2 + 15.22 * solarTermSerialNumber - 1.9 * Math.sin(0.262 * solarTermSerialNumber));
        return solarTermAccumulateDate;
    },
    /**
     * 获取农历日期
     * @param year
     * @param month
     * @param day
     * @returns {{month: string, date: string, solarTerm: string, festival: *}}
     */
    getLunarCalendar : function(year,month,day) {

        //常量数组
        var monthName = ["正月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","腊月"];
        var dateName = ["十","一","二","三","四","五","六","七","八","九"];
        var datePrefixName = ["初","十","廿","三"];
        var solarTermName = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨", "立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑", "露水","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
        var festivalName = {
            "0101" : "春节",
            "0115" : "元宵节",
            "0202" : "龙头节",
            "0505" : "端午",
            "0707" : "七夕",
            "0715" : "中元节",
            "0815" : "中秋",
            "0909" : "重阳节",
            "1001" : "寒衣节",
            "1015" : "下元节",
            "1208" : "腊八节",
            "1223" : "小年",
            "1230" : "除夕"
        };

        var differenceYear = year - 1900;  //年份距1900年差值
        var solarTermSerialNumber = month * 2 - 1;  //节气序号
        var lunarCalendarMonth = (month - 1 + 12) % 12;  //理论农历月份
        var accumulateDate = Util._gregorianCalendarToAccumulateDate(year, month, day);  //计算当前日期积日
        var lunarDate = Util._getLunarDate(accumulateDate);  //计算农历日期

        //计算前一个月、当月、后一个月、前半个月以及后半个月的节气日期(STLD)和节气积日(STAD)
        var curSTLD = Util._getLunarDate(Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber));
        var prevSTLD = Util._getLunarDate(Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber - 2));
        var nextSTLD = Util._getLunarDate(Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber + 2));
        var halfPrevSTLD = Util._getLunarDate(Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber - 1));
        var halfNextSTLD = Util._getLunarDate(Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber + 1));
        var curSTAD = Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber);
        var prevSTAD = Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber - 2);
        var nextSTAD = Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber + 2);
        var halfPrevSTAD = Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber - 1);
        var halfNextSTAD = Util._getSolarTermAccumulateDate(differenceYear, solarTermSerialNumber + 1);

        //通过节气日期判断闰月情况，调整月份
        if(accumulateDate < curSTAD && lunarDate + curSTAD - accumulateDate !== curSTLD)
            lunarCalendarMonth --;
        else if(accumulateDate > curSTAD && lunarDate - (accumulateDate - curSTAD) !== curSTLD && lunarDate + nextSTLD - accumulateDate === nextSTAD)
            lunarCalendarMonth ++;

        //判断是否是节气
        if(curSTAD === accumulateDate)
            var solarTerm = solarTermName[solarTermSerialNumber];
        else if (halfPrevSTAD === accumulateDate)
            var solarTerm = solarTermName[solarTermSerialNumber - 1];
        else if (halfNextSTAD === accumulateDate)
            var solarTerm = solarTermName[solarTermSerialNumber + 1];

        //计算是否节日
        var monthNumber = lunarCalendarMonth;
        if(monthNumber < 10)
            var festivalNumber = "0" + monthNumber;
        else
            var festivalNumber = monthNumber;
        if(lunarDate < 10)
            festivalNumber += "0" + lunarDate;
        else
            festivalNumber += lunarDate;  //拼接字符串
        var festivalString = festivalName[festivalNumber];  //调用节日

        //计算农历名称
        var monthString = monthName[(monthNumber + 11) % 12];  //月份名称
        var prefix = parseInt((lunarDate - 1) / 10);
        if(lunarDate === 20 || lunarDate === 30)
            var dateString = datePrefixName[prefix+1];
        else
            var dateString = datePrefixName[prefix];
        dateString += dateName[lunarDate % 10];  //日期名称

        //返回结果
        var result = {
            'month' : monthString,
            'date' : dateString,
            'solarTerm' : solarTerm,
            'festival' : festivalString
        };
        return result;
    },
    /**
     * 判断年份干支
     * @param year 公历年份
     * @returns {string} 返回干支
     */
    getSexagenaryCycle : function(year){

        //常量数组
        var heavenlyStems = ["癸","甲","乙","丙","丁","戊","己","庚","辛","壬"];
        var earthlyBranches = ["亥","子","丑","寅","卯","辰","巳","午","未","申","酉","戌"];

        //计算与1963年的差值(1964年为甲子年)
        var yearSerialNumber = year - 1863;

        //拼接该年干支
        var sexagenaryCycle = heavenlyStems [yearSerialNumber % 10];
        sexagenaryCycle += earthlyBranches [yearSerialNumber % 12];
        sexagenaryCycle += "年";
        return sexagenaryCycle;
    },
    /**
     * 获取生肖年份
     * @param year
     * @returns {string}
     */
    getZodiac : function(year){
        //常量数组
        var zodiacName = ["猪年","鼠年","牛年","虎年","兔年","龙年","蛇年","马年","羊年","猴年","鸡年","狗年"];

        //计算与1963年的差值(1964年为甲子年)
        var yearSerialNumber = year - 1863;

        return zodiacName[yearSerialNumber % 12];
    },
    /**
     * 玄学啊,获取禁忌事情
     * @param year
     * @param month
     * @param day
     * @returns {{suit: string, taboo: string}}
     */
    getSuitAndTaboo : function(year, month, day) {

        var suit  = ["开光","嫁娶","入宅","上梁","祭祀","出行","作灶","破土","订盟","祈福"];
        var taboo = ["纳采","冠笄","竖柱","掘井","伐木","理发","交易","探病","雕刻","斋醮"];

        var dateString = parseInt((year * month * day) % 1025).toString(2);
        var len = dateString.length;
        if(len < 10)
            for(;len < 10 ;len ++)
                dateString = "0" + dateString;
        dateString = dateString.split("").reverse().join("");
        var dateNum = parseInt(dateString, 2);
        var suitResult = [];
        var tabooResult = [];

        for(var i = 0; i < 10; i ++ ) {
            if(dateNum % 2)
                suitResult.push(taboo[i]);
            else
                tabooResult.push(suit[i]);
            dateNum = parseInt(dateNum / 2);
        }

        var suitString = suitResult;
        var tabooString = tabooResult;
        var result = {
            'suit' : suitString,
            'taboo' : tabooString
        }
        return result;
    }
};
