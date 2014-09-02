
(function($,DateCore) {


    var Calendar = function(element, options) {
        this.$element = $(element);

        this.init('type', options);
    };


    Calendar.DEFAULTS = {
        css: 'css/ui.css'
    };

    Calendar.prototype.init = function(type, options) {
        var me = this;
        this.type = type;
        this.options = this.getOptions(options),
        this.DateCore = DateCore;

        //加载css
        var css = this.options.css;
        if (css) {
            css = '<link rel="stylesheet" href="' + css + '" />';
            if ($('base')[0]) {
                $('base').before(css);
            } else {
                $('head').append(css);
            }
        }

        //初始化input，并且绑定事件
        this.inputReady();

    };

    //混合config
    Calendar.prototype.getOptions = function(options) {
        options = $.extend({}, Calendar.DEFAULTS, options);
        return options;
    };

    Calendar.prototype.inputReady = function() {
        var me = this;
        var inputDom = me.$element;
        inputDom.prop("readonly", "readonly");
        inputDom.on('click', function() {
            me.calendarShow();
            return false;
        });
    };


    Calendar.prototype.calendarShow = function() {
        var me = this;
        var inputDom = me.$element;
        var boxHtml = '<div id="calenderBox"></div>',
            startInput = inputDom.eq(0),
            endInput = 0,
            boxTop = startInput.offset().top + startInput.height(),
            boxLeft = startInput.offset().left;
        if (inputDom.length > 1) {
            endInput = inputDom.eq(1);
        };
        var DateCore = new me.DateCore();
        $(boxHtml).html();

    };

    $.fn.spcalendar = function(option) {
        var options = typeof option == 'object' && option;
        return new Calendar(this, options);
    };

})(jQuery,DateCore);
