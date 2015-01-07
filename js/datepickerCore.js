(function (window) {
    'use strict';
    function DateCore(config) {
        this.config = config;
        this.WEEKORDER = [0, 6, 5, 4, 3, 2, 1];
        this.init();
        //console.log(config);
    }

    DateCore.prototype.init = function () {
        var me = this;
        var nowDate = new Date();
        me.currentDate = {
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            day: nowDate.getDay(),
            date: nowDate.getDate(),
            hour: nowDate.getHours(),
            minute: nowDate.getMinutes()
        }
    };

    DateCore.prototype.Datepanel = function (year, month, date) {
        var me = this;
        year = parseInt(year, 10);
        month = parseInt(month, 10);
        date = parseInt(date, 10);
        var myDate = new Date(year, month - 1);
        var firstDay = myDate.getDay();
        var monthDayNum = monthDays(year, month - 1);
        var dateArray = new Array(42);
        var loop = false;

        var startLimitDate = me.config.startLimitDate;
        var endLimitDate = me.config.endLimitDate;
        var curDate = 0;
        var weekStart = me.WEEKORDER[me.config.weekStart - 1];

        //載入動態數據
        var datejson = {};

        for (var spdate in this.config.datejson) {
            var tempArr = spdate.split('-');
            if (tempArr[0] == year && tempArr[1] == month) {
                datejson[tempArr[2]] = this.config.datejson[spdate];
            }
        }

        //限制日期
        if (startLimitDate !== null || endLimitDate !== null) {
            startLimitDate = hasLimitExec.call(me, startLimitDate);
            endLimitDate = hasLimitExec.call(me, endLimitDate);
        }
        for (var i = firstDay + weekStart - 1, startDate = 1; i < dateArray.length; i++) {
            if (startDate > monthDayNum) {
                startDate = 1;
                loop = true;
            }
            !loop ? dateArray[i] = {
                'date': startDate++,
                'modal': '',
                'spdate': ''
            } : dateArray[i] = {
                'date': startDate++,
                'modal': 'new',
                'spdate': ''
            };

            if (me.currentDate.year === year && me.currentDate.month === month && !loop && me.currentDate.date === startDate - 1) {
                dateArray[i].modal += ' active';
            }

            for (var spdate in datejson) {
                if (!loop && startDate - 1 == spdate) {
                    dateArray[i].spdate = datejson[spdate];
                    delete datejson[spdate];
                }
            }

            curDate = dateToNumber(year + '-' + autoCompletion(month) + '-' + autoCompletion(dateArray[i].date));

            if ((startLimitDate && !endLimitDate) && (curDate > startLimitDate)) {
                dateArray[i].modal += ' disabled';
            }

            if ((endLimitDate && !startLimitDate) && (curDate < endLimitDate)) {
                dateArray[i].modal += ' disabled';
            }

            if ((startLimitDate && endLimitDate) && (curDate < startLimitDate && curDate > endLimitDate)) {
                dateArray[i].modal += ' disabled';
            }
        }
        for (var j = firstDay + weekStart - 2, startDate = monthDays(year, (month - 2) < 0 ? 11 : (month - 2)); j >= 0; j--) {
            dateArray[j] = {
                'date': startDate--,
                'modal': 'old',
                'spdate': ''
            };
        }
        return dateArray;
    };

    DateCore.prototype.getDates = function (year, month, num) {
        var me = this;
        var monthDayNum = new Date(year, month, 0).getDate();

        // return new Date(year,month-1);
    };

    DateCore.prototype.Monthpanel = function (year, num) {
        var me = this;
        var monthNum = num || 12;
        var monthStart = 1;
        var monthArray = [];
        for (var i = 0; i < monthNum; i++) {
            monthArray.push(monthStart++);
        }
        return monthArray;
    };


    DateCore.prototype.Yearpanel = function (year, num) {
        var me = this;
        year = parseInt(year, 10);
        var yearNum = num || 12;
        var yearCurrent = year;
        var yearPosition = getYearLastPos(yearCurrent);
        var yearStart = yearCurrent - yearPosition - 1;
        var yearArray = new Array(yearNum);
        for (var i = 0; i < yearArray.length; i++) {
            if (i === 0) {
                yearArray[i] = {
                    'year': yearStart++,
                    'modal': 'old'
                };
                continue;
            } else if (i === 11) {
                yearArray[i] = {
                    'year': yearStart++,
                    'modal': 'new'
                };
                continue;
            }

            if (me.currentDate.year === yearStart) {
                yearArray[i] = {
                    'year': yearStart++,
                    'modal': 'active'
                };
                continue;
            }

            yearArray[i] = {
                'year': yearStart++,
                'modal': ''
            };

        }
        return yearArray;
    };

    function getYearLastPos(year) {
        return parseInt(String(year).charAt(String(year).length - 1), 10);
    }

    DateCore.prototype.Weekpanel = function (year) {
        var me = this;
        year = parseInt(year, 10);
        var weekArray = [];
        var weekon = 0;
        var weekoff = (me.config.weekStart === 7 ? 0 : me.config.weekStart);
        for (var i = 0; i < 7; i++) {
            if ((new Date(year, 0, i + 1)).getDay() == weekoff) {
                weekon = year + '-01-' + autoCompletion(i + 1);
                break;
            }
        }
        var tempdate = weekon;
        //console.log(nextDate('2015-01-31'));
        for (var j = 0; j < 53; j++) {
            weekArray[j] = {
                weekdateStart: 0,
                weekdateEnd: 0
            };
            for (var k = 0; k < 7; k++) {
                if (k === 0) {
                    weekArray[j].weekdateStart = tempdate;
                } else if (k === 6) {
                    weekArray[j].weekdateEnd = tempdate;
                }
                tempdate = nextDate(tempdate);
            }
            if (dateToNumber(tempdate) > dateToNumber(year + '-12-31')) break;
        }
        return weekArray;
    };

    /**
     * 获取月天数
     * @param year 年
     * @param month 月
     * @return {*}
     */
    function monthDays(year, month) {
        var monthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) {
            monthArray[1] = 29;
        }
        if (month >= 0) {
            return monthArray[month];
        } else {
            return monthArray;
        }
    }

    /**
     * [dateToNumber description]
     * @param  {String} date 日期型字符串
     * @return {Number}      数字化后的日期
     */
    function dateToNumber(date) {
        //if(typeof date !== 'string') return;
        return parseInt(date.split('-').join(''), 10);
    }

    /**
     * [autoCompletion description]
     * @param  {Number} num 需要自动补全的数
     * @return {String}     返回补全后的数
     */
    function autoCompletion(num) {
        return !/^\d{2}$/.test(num) && num < 10 ? '0' + num : num;
    }

    function hasLimitExec(limitexec) {
        if (limitexec === null) {
            return;
        }
        if (limitexec === '') {
            var today = this.currentDate.year + '-' + autoCompletion(this.currentDate.month) + '-' + autoCompletion(this.currentDate.date);
            return dateToNumber(today);
        } else {
            return dateToNumber(limitexec);
        }
    }

    /**
     * 返回下一天
     * @param d such as'2015-01-05'
     * @returns {string}
     */
    function nextDate(d) {
        var d1 = d.replace(/\-/g, '\/');
        var date = new Date(d1);
        date.setDate(date.getDate() + 1);
        date.setMonth(date.getMonth());
        return date.getFullYear() + "-" + autoCompletion(date.getMonth() + 1) + "-" + autoCompletion(date.getDate());
    }


    window.DateCore = DateCore;
})(window);