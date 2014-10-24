(function($) {
    var Modal = function(element, options) {
        this.options = options;
        this.$element = $(element);
        //Modal.list === undefined ? Modal.list = {} : Modal.list;
        this.init('modal', element, options);
    };
    /**
     * 基本参数设置
     * @param title 标题
     * @param mode 弹窗模式  'normal'|'confirm'|'alert'
     * @param content '文字文字' 弹窗的内容
     * @param width 弹窗的宽度
     * @param height 弹窗的高度
     * @param okvalue 确认按钮文字
     * @param ok 点击确定的回调
     * @param cancelvalue 取消按钮文字
     * @param cancel 点击取消的回调
     * @param template 内容模板
     */

    Modal.DEFAULTS = {
        title: '标题',
        mode: 'normal',
        content: '你确定么？',
        width: 412,
        height: 190,
        closed: false,
        maskLayer: true,
        okvalue: '确认',
        ok: function() {},
        cancelvalue: '取消',
        cancel: function() {},
        callback: function() {},
        template: "<div class='sppopwin'>" +
            "<div class='sppopwin-out'>" +
            "<div class='sppopwin-in'>" +
            "<div class='sppopwin-title'>" +
            "<h3></h3>" +
            "<span class='sppopwin-close sppopwin-action-c'>关闭</span>" +
            "</div>" +
            "<div class='sppopwin-content'></div>" +
            "</div>" +
            "</div>" +
            "</div>"
    };

    Modal.prototype.init = function(type, element, options) {
        /*      if (options instanceof Array) {
         for (var i = 0; i < options.length; i++) {
         this.stringDo(options[i]);
         };
         };*/
        this.enabled = true;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        //this.id === undefined ? this.id = (50 * Math.random() | 0) : this.id;
        this.content = this.DOMCuttor(this.options.content);
    };

    Modal.prototype.DOMCuttor = function(data) {
        var me = this;
        var content = '';
        if (data instanceof Object) {
            content = data.html();
            data.remove();
        } else if (typeof data === 'string') {
            content = data;
        }
        return content;
    };

    Modal.prototype.setContent = function(data) {
        this.options.content = this.DOMCuttor(data);
    };

    Modal.prototype.show = function() {
        var toolbar = null;
        if (this.options.mode == 'confirm') {
            toolbar = "<div class='text-center'>" + this.content + "</div><p class='sppopwin-bottom-toolbar'><button class='spbtn spbtn-sure sppopwin-action-s'>" + this.options.okvalue + "</button><button class='spbtn spbtn-cancel sppopwin-action-c ml'>" + this.options.cancelvalue + "</button></p>";
        } else if (this.options.mode == 'alert') {
            toolbar = "<div class='text-center'>" + this.content + "</div><p class='sppopwin-bottom-toolbar'><button class='spbtn spbtn-sure sppopwin-action-s'>" + this.options.okvalue + "</button></p>";
        } else {
            toolbar = "<div class='text-center'>" + this.content + "</div>";
        }
        this.pop(toolbar);
    };

    Modal.prototype.stringDo = function(whatido) {
        switch (whatido) {
            case "open":
                break;
        }
    };

    Modal.prototype.getDefaults = function() {
        return Modal.DEFAULTS;
    };

    Modal.prototype.getOptions = function(options) {
        options = $.extend({}, this.getDefaults(), options);

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            };
        }
        return options;
    };

    Modal.prototype.tip = function() {
        return this.$tip = this.$tip || $(this.options.template);
    };

    Modal.prototype.close = function() {
        var $tip = this.tip();
        $(window).unbind('.popresize');
        $tip.fadeOut(300, function() {
            $(".popup_mask").remove();
            $(".popup_iframe").remove();
            return $tip.remove();
        });
    };

    Modal.prototype.resize = function() {
        var _popupWidth = this.options.width;
        var _popupHeight = this.tip().height();
        var _winScrollTop = $(window).scrollTop();
        var _winHeight = $(window).height();
        var _docHeight = $(document).height();
        this.tip().css({
            'width': _popupWidth,
            'margin-left': -(_popupWidth / 2),
            'top': (_winHeight - _popupHeight) / 2
        });
        if (_popupHeight > _winHeight) {
            this.tip().css('top', 0);
        }
        if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
            this.tip().css('top', (_winHeight - _popupHeight) / 2 + _winScrollTop);
        }
        return {
            '_winScrollTop': _winScrollTop,
            '_winHeight': _winHeight,
            '_docHeight': _docHeight
        };
    };

    Modal.prototype.pop = function(toolbar) {
        var _this = this;
        var $tip = _this.tip();

        var setContent = toolbar;
        $tip.find(".sppopwin-content").html(setContent).end().find(".sppopwin-title > h3").text(_this.options.title);

        $("body").append($tip);
        var tempObj = _this.resize();
        $tip.fadeIn(300);
        if (_this.options.maskLayer) {
            if ($('.popup_mask').length === 0) {
                $tip.after("<div class='popup_mask'></div>");
                $(".popup_mask").css("height", tempObj._docHeight);
                if ($.browser.msie && $.browser.version <= 6) {
                    $(".popup_mask").after("<iframe class='popup_iframe' frameborder='0'></iframe>");
                    $(".popup_iframe").css("height", tempObj._docHeight);
                }
            }
        }
        _this.options.callback();
        $tip.find(".sppopwin-action-c").on("click", function() {
            var fn = _this.options.cancel;
            return typeof fn !== 'function' || fn.call(this) !== false ?
                _this.close() : this;
        });
        $tip.find(".sppopwin-action-s").on("click", function() {
            var fn = _this.options.ok;
            return typeof fn !== 'function' || fn.call(this) !== false ?
                _this.close() : this;
        });

        $(window).bind('resize.popresize', function() {
            _this.resize();
        });
    };

    $.fn.spmodal = function(option) {
        var options = typeof option == 'object' && option;
        return new Modal(this, options);
    };

})(jQuery);
