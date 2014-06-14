function robinpop(options) {
    this.options = options;
    this.init(options);
}

robinpop.prototype.DEFAULTS = {
    title: '标题',
    mode: 'normal',
    content: '你确定么？',
    width: 360,
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
robinpop.prototype.init = function (options) {
    this.options = this.getOptions(options);
}
robinpop.prototype.getDefaults = function () {
    return this.DEFAULTS;
}
robinpop.prototype.getOptions = function (options) {
    options = extend({}, this.getDefaults(), options);
    console.log(options);
}
/*tool function*/
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

