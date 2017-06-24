$.Deferred = function(){
    var _tempData = {};

    var promiseObject = {
        done : function(fn){
            _tempData.success = fn;
        }
    };

    return {
        resolve : function(){
            if(_tempData.success){
                _tempData.success.apply(this, arguments);
            }
        },

        promise : function(){
            return promiseObject;
        },

        resolveWith : function(){},
        rejectWith : function(){}
    };
};

$.fn.addAnim = function(cls, time, endEve){
    time = time || 300;
    endEve = endEve || 'webkitAnimationEnd webkitTransitionEnd';
    var d = $.Deferred(),
        $sl = $(this);
    
    var fn = function(e){
        $sl.css({
            '-webkit-transition' : '',
            'transition' : ''
        }).css('zoom');

        $sl.off(endEve, fn);
        d.resolve($sl);
    };

    setTimeout(function(){
        var css = 'all '+time+'ms ease-in';
        $sl.one(endEve, fn).css({
            '-webkit-transition' : css,
            'transition' : css
        }).addClass(cls);
    }, 0);
    return d.promise();
};

var loadImages = function(imgs, callback, outtime){
    var loaded = 0,
        len = imgs.length,
        img = null,
        iscall = false,
        rimgs = {};

    var loadComplete = function(){
        this.onload = null;
        this.onerror = null;
        var src = this.getAttribute('_src');
        rimgs[src] = this;
        if(++loaded == len && callback){
            if(!iscall){
                iscall = true;
                return callback(true, loaded, rimgs);
            }
        }
        callback(false, loaded, rimgs);
    };

    for(var i=0; i<len; i++){
        img = new Image();
        img.onload = loadComplete;
        img.onerror = loadComplete;
        img.setAttribute('_src', imgs[i]);
        img.src = imgs[i];
    }

    if(outtime){
        setTimeout(function(){
            if(!iscall){
                iscall = true;
                callback(rimgs);
            }
        }, outtime);
    }
};

var loadResource = function(srcs, callback){
    var loaded = 0,
        len = srcs.length,
        iscall = false,
        robjs = {};

    var handler = function(src){
        if(this.readyState !== 4) {
            return;
        }
        if(this.status === 200){
            robjs[src] = this;
        }else{
            robjs[src] = null;
        }
        
        loaded += 1;
        if(loaded == len && callback){
            if(!iscall){
                iscall = true;
                return callback(true, loaded, robjs);
            }
        }
        callback(false, loaded, robjs);
    };

    for(var i=0; i<len; i++){
        var _XHR = new XMLHttpRequest();
        _XHR.open("GET", srcs[i]);
        _XHR.onreadystatechange = function(){
            handler.call(this, srcs[i]);
        };
        _XHR.send();
    }
};

var bemeObject = {};

bemeObject.showTips = function(text, seconds){
    if(bemeObject._timer){
        clearTimeout(bemeObject._timer);
    }
    seconds = seconds || 2000;
    var $tips = $('#J_body-tips');
    $tips.text(text).removeClass('tips-in tips-out').css('zoom');
    $tips.addClass('tips-in');
    bemeObject._timer = setTimeout(function(){
        $tips.removeClass('tips-in tips-out').css('zoom');
        $tips.addClass('tips-out');
    }, seconds);
};

bemeObject.showAlert = function(msg, fn, opts){
    opts = opts || {};
    var $box = $('#J_alert-box');
    $box.find('.desc').text(msg);
    $('#J_body-mask, #J_alert-box').show();
    if(opts.hidecancel){
        $box.find('.footer').addClass('hidecancel');
    }else{
        $box.find('.footer').removeClass('hidecancel');
    }

    $box.find('.btn-cancel').text(opts.cancelText || '取消');
    $box.find('.btn-ok').text(opts.okText || '确定');

    bemeObject._showAlertFn = fn;
    if($box.data('isinit')){
        return ;
    }

    $box.data('isinit', 1);
    $box.find('.abtn').off('click').on('click', function(){
        var ok = $(this).hasClass('btn-ok');
        if(!bemeObject._showAlertFn){
            return $('#J_body-mask, #J_alert-box').hide();
        }
        bemeObject._showAlertFn.call({
            close : function(){
                $('#J_body-mask, #J_alert-box').hide();
            }
        }, ok);
    });
};

bemeObject.getUid = function() {
    var fromUserid, toUserid;
    try {
        fromUserid = window.bemetoy.getFromUerid();
        toUserid = window.bemetoy.getToUerid();
    } catch(e) {
        fromUserid = 0;
        toUserid = 0;
    }
    return {
        from: fromUserid,
        to: toUserid
    };
};

bemeObject.getPushUrl = function(){
    var api = 'short.bemetoy.com/push_music',
        hostArr = location.host.split('.');
    if(hostArr.length>3){
        api = hostArr[0]+'.'+api;
    }
    return 'http://'+api;
};

bemeObject.stringify = function(vContent){
    if(vContent instanceof Object){
        var sOutput = '';
        if(vContent.constructor === Array){
            for(var nId = 0; nId < vContent.length; sOutput += bemeObject.stringify(vContent[nId]) + ",", nId++){}
            return '[' + sOutput.substr(0, sOutput.length - 1) + ']';
        }
        if(vContent.toString !== Object.prototype.toString){
            return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\"";
        }
        for(var sProp in vContent){
            sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + bemeObject.stringify(vContent[sProp]) + ",";
        }
        return '{' + sOutput.substr(0, sOutput.length - 1) + '}';
    }
    return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
};

bemeObject.playMusic = function(data){
    var uinfo = bemeObject.getUid(),
        jbuf = bemeObject.stringify(data);
    if(uinfo.to<1){
        return bemeObject.showTips("您尚未绑定玩具!");
    }

    data = {
        "fromuid": uinfo.from,
        "touid": uinfo.to,
        "pushBuf": jbuf
    };
    $.ajax({
        url: bemeObject.getPushUrl(),
        dataType: "jsonp",
        type: "get",
        jsonp : 'cb',
        cache: false,
        data: data,
        error:function(a,b,c){
            var d = 1;
        },
        success: function(a) {
            if(a.result === 1001){
                bemeObject.showTips(a.res_info);
            }
            return bemeObject.showTips("推送成功!");
        }
    });
};

;(function ($) { 
    $.getScript = function(src, func) {
        var script = document.createElement('script');
        script.async = "async";
        script.src = src;
        if (func) {
           script.onload = func;
        }
        document.getElementsByTagName("head")[0].appendChild( script );
    }
})($);

(function(){
var _v = {};
_v.keys = function(object){
    var keys = [];
    for(var prop in object){
        if(object.hasOwnProperty(prop)){
            keys.push(prop);
        }
    }
    return keys;
};

_v.invert = function(obj) {
    var result = {};
    var keys = _v.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
        result[obj[keys[i]]] = keys[i];
    }
    return result;
};

_v.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
};
var noMatch = /(.)^/;
var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};

var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
var escapeChar = function(match) {
    return '\\' + escapes[match];
};

// List of HTML entities for escaping.
var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
};
var unescapeMap = _v.invert(escapeMap);

// Functions for escaping and unescaping strings to/from HTML interpolation.
var createEscaper = function(map) {
    var escaper = function(match) {
        return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _v.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
};
_v.escape = createEscaper(escapeMap);
_v.unescape = createEscaper(unescapeMap);

_v.template = function(text, data, settings) {
    settings = $.extend({}, settings, _v.templateSettings);
    var matcher = RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset){
        source += text.slice(index, offset).replace(escaper, escapeChar);
        index = offset + match.length;
        if (escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':_v.escape(__t))+\n'";
        } else if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        } else if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
        }
        return match;
    });
    source += "';\n";
    if (!settings.variable){
        source = 'with(obj||{}){\n' + source + '}\n';
    }

    source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + 'return __p;\n';

    var render = '';
    try {
        render = Function(settings.variable || 'obj', '_v', source);
    } catch (e) {
        e.source = source;
        throw e;
    }

    if(data){
        return render(data, _v);
    }
    var template = function(data) {
      return render.call(this, data, _v);
    };

    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
};

bemeObject.template = _v.template;

})();

bemeObject.getQueryString = function(name){
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"),
			url = window.location.href,
			r;
	if(typeof url !="undefined"){
		r = url.replace(/^.*\?/,"").match(reg);
	}else{
		r = window.location.search.substr(1).match(reg);
	}
	if (r!=null) return r[2];
	return '';
};


bemeObject._getUA = function(){
    var u = navigator.userAgent;
    var ua = u.toLowerCase().match(/(bemetoy)\/([\d.]+)/);
    if(ua != null){
        var version = ua[2].split('.');
        return version;
    }
    else{
        return null;
    }
};

bemeObject.checkPageEnv = function($box, weixinConfig){
    weixinConfig = weixinConfig || {};
    var ua = bemeObject._getUA();
    if(ua){
        $($box||document.body).append('<div class="share_weixin J_share" style="display: block;"></div>');

        $('.J_share').on('click',function(){
            var uinfo = bemeObject.getUid();
            if(uinfo.from<1){
                return bemeObject.showAlert('请下载贝美时光说app参加活动哦！', false, {hidecancel:true});
            }

            ///////////////////////这里加分享代码//////////////////////
			var descId = $("#descId").attr("value");
			url = weixinConfig.url +"?id="+descId;
            var data = {
                'title':weixinConfig.title,
                'desc':weixinConfig.desc,
                'url':url||window.location.href,
                'shareType':0,
                'imgUrl':'http://'+location.host+location.pathname+'static/images/share-img.jpg'
            };
            $.ajax({
                url: '/app/m2/weixin/getWeixinContent',
                dataType: "json",
                type: "get",
                withCredentials:true,
                cache: false,
                data:data,
                success:function(jdata){
                    if(jdata.code == 0){
                        window.bemetoy.socialShareWithContent(jdata.data);
                    }
                }
            });
        });

        var flag = +ua[0]>1 && +ua[1]>0;
        if(flag){
            $('.share_weixin').show();
        }else{
			 $('.share_weixin').hide();
		}
        return ;
    }


    if($('.push-song').length<1){
        var html = ['<div class="footer-weixin">',
            '<img src="http://m2.bemetoy.com/static/images/app-header.png" class="app">',
            '<span class="text">宝宝爱听,贝美时光说</span>',
            '<a class="download" href="http://www.bemetoy.com/download/download.html">点击下载</a>',
            '</div>'].join('');
        $($box||document.body).append(html);
    }

    $('.share_weixin').hide();
    $('.push-song').hide();
};