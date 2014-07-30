(function ($) {
    var Modal = function (element, options) {
        this.options = options;
        this.$element = $(element);

        this.init('modal', element, options)
    }
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
        ok: function () {
        },
        cancelvalue: '取消',
        cancel: function () {
        },
        callback: function () {
        },
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
    }

    Modal.prototype.init = function (type, element, options) {
        /*      if (options instanceof Array) {
         for (var i = 0; i < options.length; i++) {
         this.stringDo(options[i]);
         };
         };*/
        this.enabled = true
        this.type = type
        this.$element = $(element)
        this.options = this.getOptions(options);

        var mode = this.options.mode;
        if (mode == 'confirm') {
            this.confirm();
        } else if (mode == 'alert') {
            this.alert();
        } else {
            this.normal();
        }
    }

    Modal.prototype.alert = function () {
        var toolbar = "<div class='text-center'>" + this.options.content + "</div><p class='sppopwin-bottom-toolbar'><button class='spbtn spbtn-sure sppopwin-action-s'>" + this.options.okvalue + "</button></p>";
        this.pop(toolbar);
    }

    Modal.prototype.confirm = function () {
        var toolbar = "<div class='text-center'>" + this.options.content + "</div><p class='sppopwin-bottom-toolbar'><button class='spbtn spbtn-sure sppopwin-action-s'>" + this.options.okvalue + "</button><button class='spbtn spbtn-cancel sppopwin-action-c ml'>" + this.options.cancelvalue + "</button></p>";
        this.pop(toolbar);
    }

    Modal.prototype.normal = function () {
        var toolbar = "<div class='text-center'>" + this.options.content + "</div>";
        this.pop(toolbar);
    }

    Modal.prototype.stringDo = function (whatido) {
        switch (whatido) {
            case "open":
                break;
        }
    }

    Modal.prototype.getDefaults = function () {
        return Modal.DEFAULTS
    }

    Modal.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Modal.prototype.tip = function () {
        return this.$tip = this.$tip || $(this.options.template)
    }

    Modal.prototype.close = function () {
        var $tip = this.tip();
        $(".popup_mask").remove();
        $(".popup_iframe").remove();
        return $tip.remove();
    }

    Modal.prototype.pop = function (toolbar) {
        var _this = this;
        var _popupWidth = _this.options.width;
        var _popupHeight = _this.options.height;
        var _winScrollTop = $(window).scrollTop();
        var _winHeight = $(window).height();
        var _docHeight = $(document).height();

        var $tip = _this.tip();
        var setContent = toolbar;
        $tip.find(".sppopwin-content").html(setContent).end().find(".sppopwin-title > h3").text(_this.options.title);

        $tip.css({
            "width": _this.options.width,
            "margin-left": -(_popupWidth / 2),
            top: (_winHeight - _popupHeight) / 2
        });
        $("body").append($tip);
        if (_this.options.maskLayer) {
            if ($tip.nextAll('.popup_mask').length == 0) {
                $tip.after("<div class='popup_mask'></div>");
                $(".popup_mask").css("height", _docHeight);
                if ($.browser.msie && $.browser.version <= 6) {
                    $(".popup_mask").after("<iframe class='popup_iframe' frameborder='0'></iframe>");
                    $(".popup_iframe").css("height", _docHeight);
                }
            }
        }
        _this.options.callback();
        $tip.find(".sppopwin-action-c").on("click", function () {
            var fn = _this.options.cancel;
            return typeof fn !== 'function' || fn.call(this) !== false ?
                _this.close().remove() : this;
        });
        $tip.find(".sppopwin-action-s").on("click", function () {
            var fn = _this.options.ok;
            return typeof fn !== 'function' || fn.call(this) !== false ?
                _this.close().remove() : this;
        });
    }

    $.fn.spmodal = function (option) {
        var options = typeof option == 'object' && option;
        return this.each(function () {
            var $this = $(this)
            //new Modal(this, options);
            if (typeof option == 'string') {
                new Modal(this, [option]);
            } else {
                new Modal(this, options);
            }
        })
    }

})(jQuery)

/*edit log
 2014/04/29
 1.加入弹出后callback函数

 2014/05/05
 1.支持修改按钮文字(L30、L32)

 2014/05/14
 1.修复弹窗按钮绑定bug(L122、L128)

 2014/06/11
 1.合并pop

 2014/06/12
 1.可控制弹窗是否关闭
 2.修复遮罩bug

 2014/07/24
 1.加入normal无toolbar模式
 */
