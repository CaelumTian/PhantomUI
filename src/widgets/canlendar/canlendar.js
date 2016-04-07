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
        dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

        firstDay: 1,         // 从周一开始,计算
        weekendDays: [0, 6], // 周六, 周日
        dateFormat: 'yyyy-mm-dd',  //打印格式, formatDate 对应,
        weekHandler : "dayThead"
    };
    //参数调整
    options = options || {};
    for (var prop in defaults) {
        if (typeof options[prop] === 'undefined') {
            options[prop] = defaults[prop];
        }
    }
    this.attrs = options;
    this.init();
};
Calendar.prototype = {
    constructor : Calendar,
    init : function() {
        //布局页面
        this.layout();
    },
    layout : function() {
        var layoutDate = this.value ? this.value : new Date().setHours(0,0,0,0);
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
        doc.querySelector("." + this.attrs.weekHandler).innerHTML = weekHeaderHTML.join("");
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
     * @param offset 设置偏移 "next" -> "下个月"  "prev" -> "上个月"
     */
    dayHTML : function(date, offset) {
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
                dayDate = new Date(dayDate);
                var dayYear = dayDate.getFullYear();
                var dayMonth = dayDate.getMonth();
                tdList.push(
                    '<div class="' + classNames.join(" ") + '" data-year=' + dayYear + ' data-month=' + dayMonth + ' data-day=' + dayNumber + '>'
                    +   '<span class="dayNumber">' + dayNumber + "</span>"
                    +   '<span class="almanac">' + "初一" + "</span>"
                    + '</div>'
                )
            }
            monthHTML.push(
                '<div class="dayTr">' + tdList.join("") + '</div>'
            )
        }
        //这里需要重构, 多页面, 这里仅作测试
        doc.querySelector(".dayTbody").innerHTML = monthHTML.join("");
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
