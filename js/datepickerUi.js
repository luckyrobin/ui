(function ($, DateCore, dateLanguage) {
    var Calendar = function (element, options) {
        this.$element = $(element);
        this.$Lang = dateLanguage.cn;
        this.CACHE = {
            currentStyle: []
        };

        this.init('type', options);
    };

    Calendar.DEFAULTS = {
        css: 'css/ui.css',
        rootNode: 'calenderBox',
        weekStart: 7,
        radio: false,
        daypanel: 1,
        startLimitDate: null, //禁用传入日期之后的所有日期,如果不传入任何值则默认为当天
        endLimitDate: null, //禁用传入日期之前的所有日期
        callbackFun: '', //选择后回调方法
        trigger: 'input',  //弹出日历控件方式  input | auto
        datejson: null
    };

    Calendar.prototype.init = function (type, options) {
        var me = this;
        me.type = type;
        me.options = me.getOptions(options);
        me.DateCore = DateCore;

        //动态加载css
        var css = me.options.css;
        if (css && !($.data(document.body).isLoadStyle)) {
            css = '<link rel="stylesheet" href="' + css + '" />';
            if ($('base')[0]) {
                $('base').before(css);
            } else {
                $('head').append(css);
            }
            $.data(document.body, 'isLoadStyle', true);
        }

        //初始化input，并且绑定事件
        if (me.options.trigger == 'auto') {
            me.calendarShow();
        } else if (me.options.trigger == 'input') {
            me.inputReady();
        }
    };

    //混合config
    Calendar.prototype.getOptions = function (options) {
        options = $.extend({}, Calendar.DEFAULTS, options);
        return options;
    };

    Calendar.prototype.inputReady = function () {
        var me = this;
        me.$element.prop('readonly', 'readonly');
        me.$element.on('click', function () {
            if (isExist.call(me)) {
                me.calendarClose();
            } else {
                me.calendarShow();
            }
        });
    };

    /**
     * [calendarShow 打开日历]
     * @return {[type]} [description]
     */
    Calendar.prototype.calendarShow = function (mode) {
        this.calendarClose();
        var me = this;
        var inputDom = me.$element;
        var startInput = inputDom.eq(0),
            endInput = 0,
            boxTop = startInput.offset().top + startInput.outerHeight(),
            boxLeft = startInput.offset().left,
            dateboxFrame = evalJquery('<div class="' + me.options.rootNode + '"></div>');

        if (!me.options.radio) {
            var timeBlock = [];
            endInput = inputDom.eq(1);
        }
        dateboxFrame.css({
            top: boxTop,
            left: boxLeft
        });
        $(inputDom).last().after(dateboxFrame);

        //载入日期模板
        var DateCore = new me.DateCore(me.options);
        var curYear = DateCore.currentDate.year,
            curMonth = DateCore.currentDate.month,
            curDate = DateCore.currentDate.date;
        var changedYear = curYear,
            changedMonth = curMonth,
            changedDate = curDate;
        if (startInput.val() !== '') {
            var aDateSplit = startInput.val().split('-');
            curYear = parseInt(aDateSplit[0], 10);
            curMonth = parseInt(aDateSplit[1], 10);
            curDate = parseInt(aDateSplit[2], 10);
        }

        switch (mode) {
            case 'date':
                loadDate.call(me, dateboxFrame, DateCore, curYear, curMonth, curDate);
                break;
            case 'month':
                loadMonth.call(me, dateboxFrame, DateCore, curYear, curMonth);
                break;
            case 'year':
                loadYear.call(me, dateboxFrame, DateCore, curYear);
                break;
            default :
                loadDate.call(me, dateboxFrame, DateCore, curYear, curMonth, curDate);
        }

        if (me.options.trigger !== 'auto') {
            //绑定document关闭事件
            $(document).on('click.clearDom', function (event) {
                var elem = $(event.target);
                if (elem.closest('.' + me.options.rootNode + '').length === 0 && elem.closest(me.$element).length === 0 && elem.closest('*[data-trigger = "spcalendar"]').length === 0) {
                    me.calendarClose();
                }
            });
        }

        //动态绑定日期单元格事件
        dateboxFrame.delegate('td.day', 'click', function (event) {
            event.stopPropagation();
            changedDate = getCellDate($(this));
            if (!changedDate) {
                return false;
            }
            //是否选择时间段
            if (me.options.radio) {
                //单选
                if (me.CACHE.currentStyle.length) {
                    clearAreaStyle.call(me);
                    me.CACHE.currentStyle.length = 0;
                }
                me.CACHE.currentStyle.push($(this));
                me.CACHE.currentStyle[0].addClass('pressed');
                startInput.val(changedDate);
                (me.options.callbackFun && typeof(me.options.callbackFun) === 'function') && me.options.callbackFun(changedDate);
            } else {
                //选择区间
                if (me.CACHE.currentStyle.length >= 2) {
                    clearAreaStyle.call(me);

                    me.CACHE.currentStyle.length = 0;
                }
                me.CACHE.currentStyle.push($(this));
                for (var i = 0; i < me.CACHE.currentStyle.length; i++) {
                    me.CACHE.currentStyle[i].addClass('pressed');
                }

                //line
                timeBlock.push(changedDate);
                if (timeBlock.length >= 2) {
                    var mDate = getDateCompared(timeBlock);
                    startInput.val(mDate.min);
                    endInput.val(mDate.max);
                    completionAreaStyle.call(me, mDate.min, mDate.max);
                    timeBlock.length = 0;
                    (me.options.callbackFun && typeof(me.options.callbackFun) === 'function') && me.options.callbackFun([mDate.min,mDate.max]);
                }
            }
        });

        //动态绑定年面板单元格事件
        dateboxFrame.delegate('td.year', 'click', function (event) {
            event.stopPropagation();
            changedYear = parseInt(getCellDate($(this)), 10);
            if (!changedYear) {
                return false;
            }
            loadDate.call(me, dateboxFrame, DateCore, changedYear, changedMonth, changedDate);
        });

        //动态绑定月面板单元格事件
        dateboxFrame.delegate('td.month', 'click', function (event) {
            event.stopPropagation();
            var splitStr = getCellDate($(this)).split('-');
            changedYear = parseInt(splitStr[0], 10);
            changedMonth = parseInt(splitStr[1], 10);
            if (!changedMonth) {
                return false;
            }
            loadDate.call(me, dateboxFrame, DateCore, changedYear, changedMonth, changedDate);
        });
    };

    /**
     * [calendarClose 关闭日历]
     * @return {[type]} [description]
     */
    Calendar.prototype.calendarClose = function () {
        var me = this;
        var calendarTemp = $('.' + me.options.rootNode + '');
        $(document).off('click.clearDom');
        return calendarTemp.empty().remove();
    };

    /**
     * [loadDate description]
     * @param  {object} dateboxFrame 外层div的jquery对象
     * @param  {object} DateCore     实例化的core
     * @param  {number} year         年
     * @param  {number} month        月
     * @param  {number} date         日
     * @return {[type]}              reload日期视图
     */
    function loadDate(dateboxFrame, DateCore, year, month, date) {
        var me = this;
        year = parseInt(year, 10);
        month = parseInt(month, 10);
        date = parseInt(date, 10);
        var calenderInner = evalDom('<div class="calenderInner">');
        var mutipanel = {
            year: year,
            month: month,
            date: date
        };
        //生成日期模板

        for (var i = 0; i < me.options.daypanel; i++) {
            if (mutipanel.month > 12) {
                mutipanel.month = 1;
                mutipanel.year++;
            }
            generateDateTemplate.call(me, calenderInner, DateCore, mutipanel.year, mutipanel.month++, mutipanel.date);
        }

        calenderInner.push('</div>');
        calenderInner.push('<a class="prev"></a>');
        calenderInner.push('<a class="next"></a>');


        if (dateboxFrame.contents().length !== 0) {
            dateboxFrame.contents().remove();
        }
        dateboxFrame.append(calenderInner.join(''));

        //选择后重绘区间样式
        if (me.$element.eq(0).val() !== '') {
            completionAreaStyle.call(me, me.$element.eq(0).val(), me.options.radio ? me.$element.eq(0).val() : me.$element.eq(1).val());
        }

        //绑定翻页按钮事件
        var dateBoxDOM = me.$element.last().nextAll('.' + me.options.rootNode + '');
        dateBoxDOM.find('.next').one('click', function (event) {
            event.stopPropagation();
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
            loadDate.call(me, dateboxFrame, DateCore, year, month, date);
        });

        dateBoxDOM.find('.prev').one('click', function (event) {
            event.stopPropagation();
            month--;
            if (month <= 0) {
                month = 12;
                year--;
            }
            loadDate.call(me, dateboxFrame, DateCore, year, month, date);
        });

        //绑定切换视图事件
        dateBoxDOM.find('.switch-year').one('click', function (event) {
            event.stopPropagation();
            loadYear.call(me, dateboxFrame, DateCore, year);
        });

        dateBoxDOM.find('.switch-month').one('click', function (event) {
            event.stopPropagation();
            loadMonth.call(me, dateboxFrame, DateCore, year, month);
        });
    }

    /**
     * [generateDateTemplate 生成日视图模板]
     * @param  {Array} templateArray 模板头数组
     * @param  {object} DateCore      实例化的core
     * @param  {number} year          年
     * @param  {number} month         月
     * @param  {number} date          日
     * @return {Array}               模板
     */
    function generateDateTemplate(templateArray, DateCore, year, month, date) {
        var me = this;
        var data_Date = DateCore.Datepanel(year, month, date);
        var dayOrder = getDayOrder.call(me, me.options.weekStart);
        templateArray.push('<table class="table-condensed">');
        templateArray.push('<thead><tr><th colspan="7" class="switch"><span class="switch-year">' + year + me.$Lang.str_year + '</span>&nbsp;&nbsp;<span class="switch-month">' + me.$Lang.monthsShort[month - 1] + me.$Lang.str_month + '</span></th></tr>');
        templateArray.push('<tr>');
        for (var i = 0; i < dayOrder.length; i++) {
            templateArray.push('<th class="dow">' + dayOrder[i] + '</th>');
        }
        templateArray.push('</tr>');
        templateArray.push('</thead>');
        templateArray.push('<tbody>');
        for (var m = 0, k = 0; m < data_Date.length / 7; m++) {
            templateArray.push('<tr>');
            for (var n = 0; n < 7; n++) {
                var reg = /old|new|disabled/g;
                var tempString = year + '-' + autoCompletion(month) + '-' + autoCompletion(data_Date[k].date);
                if (reg.test(data_Date[k].modal)) {
                    tempString = '';
                }
                templateArray.push('<td class="day ' + data_Date[k].modal + '" title="' + tempString + '"><p>' + data_Date[k].date + '</p><p>' + data_Date[k].spdate + '</p></td>');
                k++;
            }
            templateArray.push('</tr>');
        }
        templateArray.push('</tbody>');
        templateArray.push('</table>');
        return templateArray;
    }

    /**
     * [getCellDate 获取单元格日期]
     * @return {[type]} [description]
     */
    function getCellDate(cellObj) {
        if (cellObj.hasClass('old') || cellObj.hasClass('new') || cellObj.hasClass('disabled')) {
            return false;
        }
        return cellObj.prop('title');
    }

    /**
     * [getDayOrder description]
     * @param  {number} weekStart 起始星期
     * @return {Array}          返回日期顺序序列
     */
    function getDayOrder(weekStart) {
        var me = this,
            dayOrder = [];
        for (var i = 0, j = weekStart - 1; i < me.$Lang.daysShort.length; i++) {
            if (j === me.$Lang.daysShort.length - 1) {
                dayOrder.push(me.$Lang.daysShort[j]);
                j = 0;
                continue;
            }
            dayOrder.push(me.$Lang.daysShort[j]);
            j++;
        }
        return dayOrder;
    }

    /**
     * [loadYear description]
     * @param  {object} dateboxFrame 外层div的jquery对象
     * @param  {object} DateCore     实例化的core
     * @param  {number} year         年
     * @return {[type]}
     */
    function loadYear(dateboxFrame, DateCore, year) {
        var me = this;

        var calenderInner = evalDom('<div class="calenderInner">');

        //生成年视图模板
        generateYearTemplate.call(me, calenderInner, DateCore, year);
        calenderInner.push('</div>');
        calenderInner.push('<a class="prev"></a>');
        calenderInner.push('<a class="next"></a>');

        if (dateboxFrame.contents().length !== 0) {
            dateboxFrame.contents().remove();
        }
        dateboxFrame.append(calenderInner.join(''));

        //绑定翻页按钮事件
        var dateBoxDOM = me.$element.last().nextAll('.' + me.options.rootNode + '');
        dateBoxDOM.find('.next').one('click', function (event) {
            event.stopPropagation();
            loadYear.call(me, dateboxFrame, DateCore, year + 10);
        });

        dateBoxDOM.find('.prev').one('click', function (event) {
            event.stopPropagation();
            loadYear.call(me, dateboxFrame, DateCore, year - 10);
        });
    }

    function generateYearTemplate(templateArray, DateCore, year) {
        var me = this;
        var data_Year = DateCore.Yearpanel(year);
        templateArray.push('<table class="table-condensed">');
        templateArray.push('<thead><tr><th colspan="4" class="switch"><span class="switch-year">' + data_Year[1].year + '--' + data_Year[data_Year.length - 2].year + '</span></th></tr>');
        templateArray.push('</thead>');
        templateArray.push('<tbody>');
        for (var m = 0, k = 0; m < data_Year.length / 4; m++) {
            templateArray.push('<tr>');
            for (var n = 0; n < 4; n++) {
                var tempString = data_Year[k].year;
                templateArray.push('<td class="year ' + data_Year[k].modal + '" title="' + tempString + '">' + data_Year[k].year + '</td>');
                k++;
            }
            templateArray.push('</tr>');
        }
        templateArray.push('</tbody>');
        templateArray.push('</table>');
        return templateArray;
    }

    function loadMonth(dateboxFrame, DateCore, year, month) {
        var me = this;

        var calenderInner = evalDom('<div class="calenderInner">');

        //生成月视图模板
        generateMonthTemplate.call(me, calenderInner, DateCore, year);
        calenderInner.push('</div>');
        calenderInner.push('<a class="prev"></a>');
        calenderInner.push('<a class="next"></a>');

        if (dateboxFrame.contents().length !== 0) {
            dateboxFrame.contents().remove();
        }
        dateboxFrame.append(calenderInner.join(''));

        //绑定翻页按钮事件
        var dateBoxDOM = me.$element.last().nextAll('.' + me.options.rootNode + '');
        dateBoxDOM.find('.next').one('click', function (event) {
            event.stopPropagation();
            loadMonth.call(me, dateboxFrame, DateCore, year + 1);
        });

        dateBoxDOM.find('.prev').one('click', function (event) {
            event.stopPropagation();
            loadMonth.call(me, dateboxFrame, DateCore, year - 1);
        });

        //绑定切换视图事件
        dateBoxDOM.find('.switch-year').one('click', function (event) {
            event.stopPropagation();
            loadYear.call(me, dateboxFrame, DateCore, year);
        });
    }

    function generateMonthTemplate(templateArray, DateCore, year, month) {
        var me = this;
        var data_Month = DateCore.Monthpanel(year);
        templateArray.push('<table class="table-condensed">');
        templateArray.push('<thead><tr><th colspan="4" class="switch"><span class="switch-year">' + year + me.$Lang.str_year + '</span></th></tr>');
        templateArray.push('</thead>');
        templateArray.push('<tbody>');
        for (var m = 0, k = 0; m < data_Month.length / 4; m++) {
            templateArray.push('<tr>');
            for (var n = 0; n < 4; n++) {
                var tempString = year + '-' + autoCompletion(data_Month[k]);
                templateArray.push('<td class="month ' + 'waiting' + '" title="' + tempString + '">' + me.$Lang.months[data_Month[k] - 1] + '</td>');
                k++;
            }
            templateArray.push('</tr>');
        }
        templateArray.push('</tbody>');
        templateArray.push('</table>');
        return templateArray;
    }

    //TOOL

    /**
     * [isExist 判断日历DOM是否存在]
     * @return {Number} 返回DOM长度
     */
    function isExist() {
        return this.$element.last().nextAll('.' + this.options.rootNode + '').length;
    }

    /**
     * [evalDom description]
     * @param  {String} str DOM字符串
     * @return {Array}     返回新数组
     */
    function evalDom(str) {
        var arr = [];
        arr.push(str);
        return arr;
    }

    /**
     * [evalJquery description]
     * @param  {[type]} str DOM字符串
     * @return {[type]}     返回jquery包装后的对象
     */
    function evalJquery(str) {
        return this.$tip = this.$tip || $(str);
    }

    /**
     * [autoCompletion description]
     * @param  {Number} num 需要自动补全的数
     * @return {String}     返回补全后的数
     */
    function autoCompletion(num) {
        return !/^\d{2}$/.test(num) && num < 10 ? '0' + num : num;
    }

    /**
     * [getDateCompared description]
     * @param  {Array} arr 需要排序的数组
     * @return {Object}     包含最大和最小日期的对象
     */
    function getDateCompared(arr) {
        if (!(arr instanceof Array)) {
            return false;
        }
        var obj = {};
        var sorted = arr.sort(function (date1, date2) {
            return dateToNumber(date1) - dateToNumber(date2);
        });
        obj.min = sorted[0];
        obj.max = sorted[sorted.length - 1];
        return obj;
    }

    /**
     * [completionArea description]
     * @param  {String} min 最小日期
     * @param  {String} max 最大日期
     * @return {[type]}     补全区间内样式
     */
    function completionAreaStyle(min, max) {
        var me = this;
        min = dateToNumber(min);
        max = dateToNumber(max);
        $('.table-condensed td.day').each(function () {
            var t = dateToNumber($(this).prop('title'));
            if (isNaN(t)) {
                return;
            }
            if (t >= min && t <= max) {
                me.CACHE.currentStyle.push($(this));
                $(this).addClass('pressed');
            }
        });
    }

    /**
     * [clearAreaStyle description]
     * @return {[type]} 清除Cache中的区间样式
     */
    function clearAreaStyle() {
        var tempArray = this.CACHE.currentStyle;
        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].hasClass('pressed')) {
                tempArray[i].removeClass('pressed');
            }
        }
    }

    /**
     * [dateToNumber description]
     * @param  {String} date 日期型字符串
     * @return {Number}      数字化后的日期
     */
    function dateToNumber(date) {
        return parseInt(date.split('-').join(''), 10);
    }

    $.fn.spcalendar = function (option) {
        var options = typeof option === 'object' && option;
        return new Calendar(this, options);
    };

})(jQuery, DateCore, dateLanguage);
