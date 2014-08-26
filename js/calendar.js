(function($) {
    var Tooltip = function(element, options) {
            this.type =
                this.options =
                this.enabled =
                this.$element = null;
            this.timer = null;

            this.init('tooltip', element, options);
        };
        /**
         * 基本参数设置
         * @param isautohide 是否自动关闭
         * @param placement 箭头方向  'bottom'|'top'|'right'|'left'
         * @param trigger 触发方式 'click'|'hover'|'focus'
         * @param template 内容模板
         */
    Tooltip.DEFAULTS = {
        isautohide: true,
        placement: 'top',
        template: '<div class="sptooltip"><div class="sptooltip-arrow"><em>◆</em><i>◆</i></div><div class="sptooltip-inner"></div></div>',
        html: false,
        trigger: 'hover focus',
        container: false

    };

    Tooltip.prototype.init = function(type, element, options) {
        this.enabled = true;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);

        var triggers = this.options.trigger.split(' ');

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i];

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.generate, this));
            } else if (trigger != 'manual') {
                var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';
                var _this = this;

                setTimeout(function() {
                    _this.$element.on(eventIn + '.' + _this.type, _this.options.selector, $.proxy(_this.generate, _this));
                },0);
                if (this.options.isautohide) {
                    this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.destroy, this));
                }
            }
        }

    };



    Tooltip.prototype.getDefaults = function() {
        return Tooltip.DEFAULTS;
    };

    Tooltip.prototype.getOptions = function(options) {
        options = $.extend({}, this.getDefaults(), options);

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            };
        }

        return options;
    };

    Tooltip.prototype.hasContent = function() {
        var obj_content = this.$element.siblings('.sptooltip-content');
        if (obj_content.hasClass('sptooltip-content')) {
            return obj_content;
        } else {
            return false;
        }
    };

    Tooltip.prototype.show = function() {
        var $tip = this.tip();
        if (this.hasContent()) {
            $tip.addClass(this.options.placement).find(".sptooltip-inner").html(this.hasContent().html());
        } else {
            return false;
        }
        /*        if (!this.$element.children().hasClass('sptooltip')) {
            this.$element.append($tip)
        } else {
            return;
        }*/
        if (!$("body").hasClass('sptooltip')) {
            $("body").append($tip);
        } else {
            return;
        }
    };

    Tooltip.prototype.generate = function() {
        clearTimeout(this.timer);
        var _this = this,
        eleHeight = this.$element.height(),
        oWidth = null,
        oHeight = null,
        resultTop = 0,
        resultLeft = 0;

        this.show();

        if (this.hasContent()) {
            oWidth = this.tip().outerWidth(true);
            oHeight = this.tip().outerHeight();
        }
        switch (this.options.placement) {
            case 'top':
                resultTop = Math.round(this.$element.offset().top - $(window).scrollTop() + eleHeight);
                resultLeft = Math.round(this.$element.offset().left + this.$element.outerWidth() / 2 - $(window).scrollLeft() - oWidth / 2);
                break;
            case 'bottom':
                resultTop = Math.round(this.$element.offset().top - $(window).scrollTop() - this.tip().outerHeight() - eleHeight);
                resultLeft = Math.round(this.$element.offset().left + this.$element.outerWidth() / 2 - $(window).scrollLeft() - oWidth / 2);
                break;
            case 'right':
                resultTop = Math.round(this.$element.offset().top - $(window).scrollTop() - oHeight / 2);
                resultLeft = Math.round(this.$element.offset().left + this.$element.outerWidth() - $(window).scrollLeft());
                break;
            case 'left':
                resultTop = Math.round(this.$element.offset().top - $(window).scrollTop() - oHeight / 2);
                resultLeft = Math.round(this.$element.offset().left - $(window).scrollLeft() - oWidth);
                break;
        }
        this.tip().css({
            top: resultTop,
            left: resultLeft
        });

        this.tip().one({
            'mouseenter': function() {
                clearTimeout(_this.timer);
            },
            'mouseleave': function() {
                _this.destroy();
            }
        });
    };

    Tooltip.prototype.destroy = function() {
        var _this = this;
        _this.timer = setTimeout(function() {
            _this.tip().remove();
        }, 30);
    };

    Tooltip.prototype.tip = function() {
        return this.$tip = this.$tip || $(this.options.template);
    };

    $.fn.spcalendar = function(option) {
        var options = typeof option == 'object' && option;
        return this.each(function() {
            var $this = $(this);
                //new Tooltip(this, options);
            if (typeof option == 'string') {
                new Tooltip(this)[option]();
            } else {
                new Tooltip(this, options);
            }
        });
    };

})(jQuery);
