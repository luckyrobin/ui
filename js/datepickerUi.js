(function($, DateCore) {


    var Calendar = function(element, options) {
        this.$element = $(element);
        this.$Lang = dateLanguage.cn;

        this.init('type', options);
    };


    Calendar.DEFAULTS = {
        css: 'css/ui.css',
        rootNode: 'calenderBox',
        startDay: 7
    };

    Calendar.prototype.init = function(type, options) {
        var me = this;
        me.type = type;
        me.options = me.getOptions(options),
        me.DateCore = DateCore;

        //加载css
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
        me.inputReady();

    };

    //混合config
    Calendar.prototype.getOptions = function(options) {
        options = $.extend({}, Calendar.DEFAULTS, options);
        return options;
    };

    Calendar.prototype.inputReady = function() {
        var me = this;
        me.$element.prop("readonly", "readonly");
        me.$element.on('click', function() {
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
    Calendar.prototype.calendarShow = function() {
        this.calendarClose();
        var me = this;
        var inputDom = me.$element;
        var startInput = inputDom.eq(0),
            endInput = 0,
            currentStyle = [],
            boxTop = startInput.offset().top + startInput.outerHeight(),
            boxLeft = startInput.offset().left,
            dateboxFrame = evalJquery('<div class="' + me.options.rootNode + '"></div>');
        //boxHtml = evalDom('<div class="' + me.options.rootNode + '" style="top:'+boxTop+'px;left:'+boxLeft+'px">');
        if (inputDom.length > 1) {
            var timeBlock = [];
            endInput = inputDom.eq(1);
        };
        dateboxFrame.css({
            top: boxTop,
            left: boxLeft
        });
        $(inputDom).last().after(dateboxFrame);
        var DateCore = new me.DateCore(me.options);
        var curYear = DateCore.currentDate.year,
            curMonth = DateCore.currentDate.month,
            curDate = DateCore.currentDate.date;
        loadDate.call(me, dateboxFrame, DateCore, curYear, curMonth, curDate);


        //绑定document关闭事件
        $(document).on('click.clearDom', function(event) {
            var elem = $(event.target);
            if (elem.closest('.' + me.options.rootNode + '').length == 0 && elem.closest(me.$element).length == 0) {
                me.calendarClose();
            }
        });

        //动态绑定日期单元格事件
        dateboxFrame.delegate("td.day", "click", function() {
            var str = getCellDate(dateboxFrame, $(this));
            if (!str) return false;
            //是否选择时间段
            if (!endInput) {
                if (currentStyle.length) {
                    currentStyle[0].removeClass('pressed');
                    currentStyle.length = 0;
                }
                currentStyle.push($(this));
                currentStyle[0].addClass('pressed');
                startInput.val(str);
            } else {
                currentStyle.push($(this));
                for (var i = 0; i < currentStyle.length; i++) {
                    currentStyle[i].addClass('pressed');
                };
                if (currentStyle.length > 2) {
                    for (var i = 0; i < currentStyle.length; i++) {
                        currentStyle[i].removeClass('pressed');
                    };
                    currentStyle.length = 0;
                }
                //line
                timeBlock.push(str);
                if (timeBlock.length >= 2) {
                    var mDate = getDateCompared(timeBlock);
                    timeBlock.length = 0;
                };
            }
        });

    };

    /**
     * [calendarClose 关闭日历]
     * @return {[type]} [description]
     */
    Calendar.prototype.calendarClose = function() {
        var me = this;
        var calendarTemp = $('.' + this.options.rootNode + '');
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
        var data_Date = DateCore.Datepanel(year, month, date);
        var dayOrder = getDayOrder.call(me, me.options.startDay);

        var dateboxTable = evalDom('<table class="table-condensed">');

        //生成日期模板
        dateboxTable.push('<thead><tr><th class="prev"></th><th colspan="5" class="switch"><span>' + year + me.$Lang.str_year + '</span>&nbsp;&nbsp;<span>' + me.$Lang.monthsShort[month - 1] + '月</span></th><th class="next"></th></tr>');
        dateboxTable.push('<tr>');
        for (var i = 0; i < dayOrder.length; i++) {
            dateboxTable.push('<th class="dow">' + dayOrder[i] + '</th>');
        };
        dateboxTable.push('</tr>');
        dateboxTable.push('</thead>');
        dateboxTable.push('<tbody>');
        for (var m = 0, k = 0; m < data_Date.length / 7; m++) {
            dateboxTable.push('<tr>');
            for (var n = 0; n < 7; n++) {
                dateboxTable.push('<td class="day ' + data_Date[k].modal + '">' + data_Date[k].date + '</td>');
                k++;
            };
            dateboxTable.push('</tr>');
        };
        dateboxTable.push('</tbody>');
        dateboxTable.push('</table>');

        if (dateboxFrame.contents().length !== 0) {
            dateboxFrame.contents().remove();
        }
        dateboxFrame.append(dateboxTable.join(''));

        //绑定翻页按钮事件
        var dateBoxDOM = me.$element.last().nextAll('.' + this.options.rootNode + '');
        dateBoxDOM.find(".table-condensed .next").one("click", function(event) {
            event.stopPropagation();
            month++;
            if (month > 12) {
                month = 1;
                year++;
            }
            loadDate.call(me, dateboxFrame, DateCore, year, month, date);
        });

        dateBoxDOM.find(".table-condensed .prev").one("click", function(event) {
            event.stopPropagation();
            month--;
            if (month <= 0) {
                month = 12;
                year--;
            }
            loadDate.call(me, dateboxFrame, DateCore, year, month, date);
        });

    }

    /**
     * [getCellDate 获取单元格日期]
     * @return {[type]} [description]
     */
    function getCellDate(dateboxFrame, cellObj) {
        var tempArray = [],
            year = parseInt(dateboxFrame.find('.switch span:eq(0)').text()),
            month = parseInt(dateboxFrame.find('.switch span:eq(1)').text());
        var date = parseInt(cellObj.text());
        if (cellObj.hasClass('old') || cellObj.hasClass('new')) return false;
        tempArray.push(year);
        tempArray.push(autoCompletion(month));
        tempArray.push(autoCompletion(date));
        return tempArray.join('-');
    }

    /**
     * [getDayOrder description]
     * @param  {number} startDay 起始星期
     * @return {Array}          返回日期顺序序列
     */
    function getDayOrder(startDay) {
        var dayOrder = [];
        for (var i = 0, j = startDay - 1; i < this.$Lang.daysShort.length; i++) {
            if (j === this.$Lang.daysShort.length - 1) {
                dayOrder.push(this.$Lang.daysShort[j]);
                j = 0;
                continue;
            };
            dayOrder.push(this.$Lang.daysShort[j]);
            j++;
        };
        return dayOrder;
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
     * [evalJquery description]
     * @param  {[type]} str DOM字符串
     * @return {[type]}     返回jquery包装后的对象
     */
    function autoCompletion(num) {
        if (num > 0 && num < 10) {
            num = '0' + num;
        }
        return num;
    }

    /**
     * [getDateCompared description]
     * @param  {Array} arr 需要排序的数组
     * @return {Object}     包含最大和最小日期的对象
     */
    function getDateCompared(arr) {
        if (!(arr instanceof Array)) return false;
        var obj = {};
        var sorted = arr.sort(function(date1, date2) {
            return date1.split('-').join('') - date2.split('-').join('')
        });
        obj.min = sorted[0];
        obj.max = sorted[sorted.length - 1];
        return obj;
    }

    $.fn.spcalendar = function(option) {
        var options = typeof option == 'object' && option;
        return new Calendar(this, options);
    };

})(jQuery, DateCore);
