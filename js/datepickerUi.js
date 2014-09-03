(function($, DateCore) {


    var Calendar = function(element, options) {
        this.$element = $(element);

        this.init('type', options);
    };


    Calendar.DEFAULTS = {
        css: 'css/ui.css',
        rootNode: 'calenderBox'
    };

    Calendar.prototype.init = function(type, options) {
        var me = this;
        me.type = type;
        me.options = me.getOptions(options),
        me.DateCore = DateCore;

        //加载css
        var css = me.options.css;
        if (css) {
            css = '<link rel="stylesheet" href="' + css + '" />';
            if ($('base')[0]) {
                $('base').before(css);
            } else {
                $('head').append(css);
            }
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
        var boxHtml = evalDom('<div class="' + me.options.rootNode + '">'),
            startInput = inputDom.eq(0),
            endInput = 0,
            boxTop = startInput.offset().top + startInput.height(),
            boxLeft = startInput.offset().left;
        if (inputDom.length > 1) {
            endInput = inputDom.eq(1);
        };
        var DateCore = new me.DateCore();
        var temp = DateCore.Datepanel(DateCore.currentDate.year, DateCore.currentDate.month, DateCore.currentDate.date);
        boxHtml.push('<p>' + temp + '</p>');
        boxHtml.push('</div>');
        $(inputDom).last().after(boxHtml.join(''));
        $(document).on('click.clearDom', function(event) {
            var elem = $(event.target);
            if (elem.closest('.' + me.options.rootNode + '').length == 0 && elem.closest(me.$element).length == 0) {
                me.calendarClose();
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
        return calendarTemp.remove();
    };

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

    $.fn.spcalendar = function(option) {
        var options = typeof option == 'object' && option;
        return new Calendar(this, options);
    };

})(jQuery, DateCore);
