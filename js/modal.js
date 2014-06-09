(function ($) {
	var Modal = function (element, options) {
	  this.options   = options;
	  this.$element  = $(element);

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
		width: 360,
		height: 190,
		closed: false,
		maskLayer: true,
		okvalue:'确认',
		ok: function(){},
		cancelvalue:'取消',
		cancel: function(){},
		callback: function(){},
		template: "<div class='sppopwin'><div class='sppopwin-out'><div class='sppopwin-in'><div class='sppopwin-title'><h3></h3> <span class='sppopwin-close sppopwin-action-c'>关闭</span></div><div class='sppopwin-content'></div></div></div></div>"
	}

	Modal.prototype.init = function (type, element, options) {
/*		if (options instanceof Array) {
			for (var i = 0; i < options.length; i++) {
				this.stringDo(options[i]);
			};
		};*/
		this.enabled  = true
		this.type     = type
		this.$element = $(element)
		this.options  = this.getOptions(options);

		var mode = this.options.mode;
		if (mode == 'confirm') {
			this.confirm();
		}else if(mode == 'alert'){
			this.alert();
		}
	}

	Modal.prototype.alert = function(){
		var _this = this;
		var _popupWidth = _this.options.width;
		var _popupHeight = _this.options.height;
		var _winScrollTop = $(window).scrollTop();
		var _winHeight = $(window).height();
		var _docHeight = $(document).height();

		var $tip = _this.tip();
		var setContent = "<div class='text-center'>"+_this.options.content+"</div><p class='text-center mt30'><button class='spbtn spbtn-sure sppopwin-action-s'>"+_this.options.okvalue+"</button></p>";
		$tip.find(".sppopwin-content").html(setContent).end().find(".sppopwin-title > h3").text(_this.options.title);

		$tip.css({"width":_this.options.width,"margin-left":-(_popupWidth/2),top:(_winHeight-_popupHeight)/2});
		
		if(_this.options.maskLayer){
			if($tip.nextAll('.popup_mask').length == 0){
				$("body").append($tip);
				$tip.after("<div class='popup_mask'></div>");
				$(".popup_mask").css("height",_docHeight);
				if ($.browser.msie && $.browser.version <= 6){
					$(".popup_mask").after("<iframe class='popup_iframe' frameborder='0'></iframe>");
					$(".popup_iframe").css("height",_docHeight);
				}
			}
			_this.options.callback();
		}
		$tip.find(".sppopwin-action-c").one("click",function(){
			$tip.remove();
			$(".popup_mask").remove();
			$(".popup_iframe").remove();
		});
		$tip.find(".sppopwin-action-s").one("click",function(){
			_this.options.ok();
			$tip.remove();
			$(".popup_mask").remove();
			$(".popup_iframe").remove();
		});
	}

	Modal.prototype.confirm = function(){
		var _this = this;
		var _popupWidth = _this.options.width;
		var _popupHeight = _this.options.height;
		var _winScrollTop = $(window).scrollTop();
		var _winHeight = $(window).height();
		var _docHeight = $(document).height();

		var $tip = _this.tip();
		var setContent = "<div class='text-center'>"+_this.options.content+"</div><p class='text-center mt30'><button class='spbtn spbtn-sure sppopwin-action-s'>"+_this.options.okvalue+"</button><button class='spbtn spbtn-cancel sppopwin-action-c ml'>"+_this.options.cancelvalue+"</button></p>";
		$tip.find(".sppopwin-content").html(setContent).end().find(".sppopwin-title > h3").text(_this.options.title);

		$tip.css({"width":_this.options.width,"margin-left":-(_popupWidth/2),top:(_winHeight-_popupHeight)/2});
		
		if(_this.options.maskLayer){
			if($tip.nextAll('.popup_mask').length == 0){
				$("body").append($tip);
				$tip.after("<div class='popup_mask'></div>");
				$(".popup_mask").css("height",_docHeight);
				if ($.browser.msie && $.browser.version <= 6){
					$(".popup_mask").after("<iframe class='popup_iframe' frameborder='0'></iframe>");
					$(".popup_iframe").css("height",_docHeight);
				}
				_this.options.callback();
			}
		}
		$tip.find(".sppopwin-action-c").one("click",function(){
			$tip.remove();
			$(".popup_mask").remove();
			$(".popup_iframe").remove();
			_this.options.cancel();
		});
		$tip.find(".sppopwin-action-s").one("click",function(){
			_this.options.ok();
			$tip.remove();
			$(".popup_mask").remove();
			$(".popup_iframe").remove();
		});
	}

	Modal.prototype.stringDo = function (whatido) {
		switch(whatido){
			case "open":
			break;
		}
	}

	Modal.prototype.getDefaults = function () {
	  return Modal.DEFAULTS
	}

	Modal.prototype.getOptions = function (options) {
	  options = $.extend({}, this.getDefaults() , options)

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

	 $.fn.spmodal = function (option) {
	 	var options = typeof option == 'object' && option;
	    return this.each(function () {
	    var $this   = $(this)
		//new Modal(this, options);
		 if (typeof option == 'string'){
		 	new Modal(this,[option]);
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
*/
