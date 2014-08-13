function robinpop(options) {
    this.options = options;
    this.init(options);
}

robinpop.prototype.DEFAULTS = {
    title: 'title',
    mode: 'normal',
    content: 'are you sure',
    width: 360,
    height: 190,
    closed: false,
    maskLayer: true,
    okvalue: 'OK',
    ok: function () {
    },
    cancelvalue: 'Cancel',
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
robinpop.prototype.init = function (options) {
    this.options = this.getOptions(options);
    this.generate();
}
robinpop.prototype.getDefaults = function () {
    return this.DEFAULTS;
}
robinpop.prototype.getOptions = function (options) {
    options = extend({}, this.getDefaults(), options);
    return options;
}
robinpop.prototype.generate = function(){
    this.pop();
}
robinpop.prototype.pop = function(toolbar) {
    var _this = this;
    var _popWidth = this.options.width;
    var _popHeight = this.options.height;
    var _winHeight = height(document);

    var $tip = _this.tip();
    var setContent = 'toolbar';
    var popBody = getElementsByClass($tip,'sppopwin-content')[0];
    popBody.innerHTML = setContent;
    getElementsByClass($tip,'sppopwin-title')[0].getElementsByTagName('h3')[0].innerText = _this.options.title;
    console.log(css($tip,{"width": (_this.options.width)+'px', "marginLeft": -(_popWidth / 2)+'px'}));
    console.log($tip);
}
robinpop.prototype.tip = function () {
    var DOM = document.createElement('div');
    DOM.innerHTML=(this.options.template);
    return this.$tip = this.$tip || DOM.childNodes[0];
}
/*tool function*/
function css(obj,key,value){
	var _arr = arguments;
	if(_arr.length==2){
		return getStyle(obj,key);
	}
	else if(_arr.length==3)
	{
		obj.style[key] = value;	
	}
}
/**
 *  new add function , it use Compatible IE for get computed style
**/
function getStyle(obj,key)
{
	if（obj.currentStyle)
	{
		return obj.currentStyle[key];	
	}
	else
	{
		return getComputedStyle(obj,null)[key]
	}
}

function height(obj){
    var _objHeight = 0;
    if(!obj) return;
    switch(obj.nodeType) {
        case 1:
        _objHeight = obj.offsetHeight;
        break;
        case 9:
        _objHeight = obj.documentElement.clientHeight || obj.body.clientHeight;
        break;
        default:
        _objHeight = undefined;
    }
    return _objHeight;
}
function getElementsByClass(parent,classname){
    var _result = [];
    var _curobj = parent.getElementsByTagName('*');
    for (var i = 0; i < _curobj.length; i++) {
    	if((_curobj[i].className).search(classname) != -1){
    		_result.push(_curobj[i]);
    	} else {
    		continue;
    	}
    };
    return _result;
}
function extend() {
    var _result = {};
    var _extend = function me(dest, source) {
        var name;
        for (name in dest) {
            if (dest.hasOwnProperty(name)) {
                //当前属性是否为对象,如果为对象，则进行递归
                if ((dest[name] instanceof Object) && (source[name] instanceof Object)) {
                    me(dest[name], source[name]);
                }
                //检测该属性是否存在
                if (source.hasOwnProperty(name)) {
                    continue;
                } else {
                    source[name] = dest[name];
                }
            }
        }
    }
    var arr = arguments;
    //遍历属性，至后向前
    for (var i = arr.length - 1; i >= 0; i--) {
        _extend(arr[i], _result);
    }
    arr[0] = _result;
    return _result;
}

