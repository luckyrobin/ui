(function(window) {
    var DateCore = function(config) {
        this.config = config;
        this.init();
        //console.log(config);
    };

    DateCore.prototype.init = function() {
        var me = this;
        var nowDate = new Date();
        me.currentDate = {
            year: nowDate.getFullYear(),
            month: nowDate.getMonth() + 1,
            day: nowDate.getDay(),
            date: nowDate.getDate(),
            hour: nowDate.getHours(),
            minute: nowDate.getMinutes()
        };
    };

    DateCore.prototype.Datepanel = function(year, month, date, num) {
        var me = this;
        var year = parseInt(year);
        var month = parseInt(month);
        var date = parseInt(date);
        var myDate = new Date(year, month - 1);
        var firstDay = myDate.getDay();
        var monthDayNum = monthDays(year, month - 1);
        var dateArray = new Array(42);
        var loop = false;

        var startLimitDate = me.config.startLimitDate;
        var endLimitDate = me.config.endLimitDate;
        var curDate = 0;

        if (startLimitDate !== null || endLimitDate !== null) {
            startLimitDate = hasLimitExec.call(me, startLimitDate);
            endLimitDate = hasLimitExec.call(me, endLimitDate);
        }

        for (var i = firstDay, startDate = 1; i < dateArray.length; i++) {
            if (startDate > monthDayNum) {
                startDate = 1;
                loop = true;
            }

            loop ? dateArray[i] = {
                'date': startDate++,
                'modal': 'new'
            } : dateArray[i] = {
                'date': startDate++,
                'modal': ''
            };


            if (me.currentDate.year === year && me.currentDate.month === month && !loop && me.currentDate.date === startDate - 1) {
                dateArray[i].modal += ' active';
            }

            curDate = dateToNumber(year + '-' + autoCompletion(month) + '-' + autoCompletion(dateArray[i].date));

            if ((startLimitDate && !endLimitDate) && (curDate > startLimitDate)) {
                dateArray[i].modal += ' disabled';
            }

            if ((endLimitDate && !startLimitDate) && (curDate < endLimitDate)) {
                dateArray[i].modal += ' disabled';
            }

            if ((startLimitDate && endLimitDate) && (curDate < startLimitDate && curDate > endLimitDate)){
                 dateArray[i].modal += ' disabled';
            }
        }

        for (var i = firstDay - 1, startDate = monthDays(year, (month - 2) < 0 ? 11 : (month - 2)); i >= 0; i--) {
            dateArray[i] = {
                'date': startDate--,
                'modal': 'old'
            };
        }
        return dateArray;
    };

    DateCore.prototype.getDates = function(year, month, num) {
        var me = this;
        var monthDayNum = new Date(year, month, 0).getDate();

        // return new Date(year,month-1);
    };

    DateCore.prototype.Monthpanel = function(year, num) {
        var me = this;
        var monthNum = num || 12;
        var monthStart = 1;
        var monthArray = [];
        for (var i = 0; i < monthNum; i++) {
            monthArray.push(monthStart++);
        }
        return monthArray;
    };


    DateCore.prototype.Yearpanel = function(year, num) {
        var me = this;
        var year = parseInt(year);
        var month = parseInt(month);
        var date = parseInt(date);
        var yearNum = num || 12;
        var yearCurrent = year;
        var yearPosition = getYearLastPos(yearCurrent);
        var yearStart = yearCurrent - yearPosition - 1;
        var yearArray = new Array(yearNum);
        var loop = false;
        for (var i = 0; i < yearArray.length; i++) {
            if (i === 0) {
                yearArray[i] = {
                    'year': yearStart++,
                    'modal': 'old'
                }
                continue;
            } else if (i === 11) {
                yearArray[i] = {
                    'year': yearStart++,
                    'modal': 'new'
                }
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
            }

        };
        return yearArray;
    };

    function getYearLastPos(year) {
        return parseInt(String(year).charAt(String(year).length - 1));
    }

    /**
     * 获取月天数
     * @param year 年
     * @param month 月
     * @return {*}
     */
    function monthDays(year, month) {
        var monthArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
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
        return parseInt(date.split('-').join(''));
    }

    /**
     * [autoCompletion description]
     * @param  {Number} num 需要自动补全的数
     * @return {String}     返回补全后的数
     */
    function autoCompletion(num) {
        return !/^\d{2}$/.test(num) && num < 10 ? "0" + num : num;
    }

    function hasLimitExec(limitexec) {
        if (limitexec === null) return;
        if (limitexec === '') {
            var today = this.currentDate.year + '-' + autoCompletion(this.currentDate.month) + '-' + autoCompletion(this.currentDate.date);
            return dateToNumber(today);
        } else {
            return dateToNumber(limitexec);
        }

    }

    window.DateCore = DateCore;
})(window);
