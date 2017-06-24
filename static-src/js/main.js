/* global require, BEME */

(function(){
    "use strict";

    //全局命名空间
    var _beme = window.BEME || {};
    _beme.APP_STATUS = _beme.APP_STATUS || "online";
    _beme.APIURL = 'http://dev.h5.bemetoy.com/app/m2';
	_beme.URL="http://test.h5.bemetoy.com/m2";
    _beme.data = {};
    _beme.userInfo = {};
    _beme.urlList = new Array();
    _beme.scrollList = new Array();
    _beme._lastScroll = 0;
    _beme._currentScroll = 0;
	_beme.jumpPage = 0;
    window.BEME = _beme;

    //配置requirejs加载路径
    var path = location.pathname,
        pindex = path.lastIndexOf('/');
    path = path.substr(0, pindex).replace('/pages', '');
    
    //配置requirejs
    var rqconf = {
        baseUrl: path+"/static-src/js/",
        paths: {
			swaper:path+"/static-src/js/swiper.min",
            jplayer: '../../static/lib/jquery.jplayer.min',
            jweixin : 'http://res.wx.qq.com/open/js/jweixin-1.0.0'
        },
        
        /*localcheck : {
			mustUnique : true,
            excludes : {},
            unique : gJSFileHashConfig
        },*/
        waitSeconds: 60
    };
    if(window.BEME.APP_STATUS!='online'){
        rqconf.baseUrl = path+"/static-src/js/";
        //rqconf.urlArgs = "_t="+(new Date()).getTime();
    }
    //rqconf.urlArgs =  "_t=2016042601";
    require.config(rqconf);


    var docEl = document.documentElement;
    docEl.style.fontSize = docEl.clientWidth/7.5+'px';
}());


if(window.Zepto){
    define('zepto', [], function(){
        return window.Zepto;
    });
}

window.console = window.console || {
    log : function(){}
};

window.BEME.initPage = function(pageName){
    "use strict";
    BEME.PAGENAME = pageName;
    require(['page/'+pageName], function(context){
        //if(!context) return;
        context.init();
		var docEl = document.documentElement;
		docEl.style.fontSize = docEl.clientWidth/7.5+'px';
        window.BEME.curPageInstance = context;
    });
};

window.BEME.initMinPage = function(pageName){
    "use strict";
    BEME.PAGENAME = pageName;
    require(['minpage/'+pageName], function(context){
        //if(!context) return;
        context.init();
        var docEl = document.documentElement;
        docEl.style.fontSize = docEl.clientWidth/7.5+'px';
        window.BEME.curPageInstance = context;
    });
};

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

BEME.template = _v.template;

})();


;(function($){
    var touch = {},
        touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
        longTapDelay = 750,
        _callback = false,
        gesture

    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
        Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }

    function longTap() {
        longTapTimeout = null
        if (touch.last) {
            touch.el.trigger('longTap')
            touch = {}
        }
    }

    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout)
        longTapTimeout = null
    }

    function cancelAll() {
        if (touchTimeout) clearTimeout(touchTimeout)
        if (tapTimeout) clearTimeout(tapTimeout)
        if (swipeTimeout) clearTimeout(swipeTimeout)
        if (longTapTimeout) clearTimeout(longTapTimeout)
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
        touch = {}
    }

    function isPrimaryTouch(event){
        return (event.pointerType == 'touch' ||
            event.pointerType == event.MSPOINTER_TYPE_TOUCH)
            && event.isPrimary
    }

    function isPointerEventType(e, type){
        return (e.type == 'pointer'+type ||
        e.type.toLowerCase() == 'mspointer'+type)
    }

    $(document).ready(function(){
        var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType

        if ('MSGesture' in window) {
            gesture = new MSGesture()
            gesture.target = document.body
        }

        $(document)
            .bind('MSGestureEnd', function(e){
                var swipeDirectionFromVelocity =
                    e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
                if (swipeDirectionFromVelocity) {
                    touch.el.trigger('swipe')
                    touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
                }
            })
            .on('touchstart MSPointerDown pointerdown', function(e){
                if((_isPointerType = isPointerEventType(e, 'down')) &&
                    !isPrimaryTouch(e)) return
                firstTouch = _isPointerType ? e : e.touches[0]
                if (e.touches && e.touches.length === 1 && touch.x2) {
                    // Clear out touch movement data if we have it sticking around
                    // This can occur if touchcancel doesn't fire due to preventDefault, etc.
                    touch.x2 = undefined
                    touch.y2 = undefined
                }
                now = Date.now()
                delta = now - (touch.last || now)
                touch.el = $('tagName' in firstTouch.target ?
                    firstTouch.target : firstTouch.target.parentNode)
                touchTimeout && clearTimeout(touchTimeout)
                touch.x1 = firstTouch.pageX
                touch.y1 = firstTouch.pageY
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true
                touch.last = now
                longTapTimeout = setTimeout(longTap, longTapDelay)
                // adds the current touch contact for IE gesture recognition
                if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
            })
            .on('touchmove MSPointerMove pointermove', function(e){
                if((_isPointerType = isPointerEventType(e, 'move')) &&
                    !isPrimaryTouch(e)) return
                firstTouch = _isPointerType ? e : e.touches[0]
                cancelLongTap()
                touch.x2 = firstTouch.pageX
                touch.y2 = firstTouch.pageY

                deltaX += Math.abs(touch.x1 - touch.x2)
                deltaY += Math.abs(touch.y1 - touch.y2)
            })
            .on('touchend MSPointerUp pointerup', function(e){
                if((_isPointerType = isPointerEventType(e, 'up')) &&
                    !isPrimaryTouch(e)) return
                cancelLongTap()

                // swipe
                if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                    (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)){

                    swipeTimeout = setTimeout(function() {
                        touch.el.trigger('swipe')
                        var direct = swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
                        touch.el.trigger('swipe' + direct);
                        touch = {}
                    }, 0)

                    var direct = swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2);
                    _callback && _callback.call(this, e, direct);

                    // normal tap
                }else if ('last' in touch)
                // don't fire tap when delta position changed by more than 30 pixels,
                // for instance when moving to a point and back to origin
                    if (deltaX < 30 && deltaY < 30) {
                        // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                        // ('tap' fires before 'scroll')
                        tapTimeout = setTimeout(function() {

                            // trigger universal 'tap' with the option to cancelTouch()
                            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                            var event = $.Event('tap')
                            event.cancelTouch = cancelAll
                            touch.el.trigger(event)

                            // trigger double tap immediately
                            if (touch.isDoubleTap) {
                                if (touch.el) touch.el.trigger('doubleTap')
                                touch = {}
                            }

                            // trigger single tap after 250ms of inactivity
                            else {
                                touchTimeout = setTimeout(function(){
                                    touchTimeout = null
                                    if (touch.el) touch.el.trigger('singleTap')
                                    touch = {}
                                }, 250)
                            }
                        }, 0)
                    } else {
                        touch = {}
                    }
                deltaX = deltaY = 0

            })
            // when the browser window loses focus,
            // for example when a modal dialog is shown,
            // cancel all ongoing events
            .on('touchcancel MSPointerCancel pointercancel', cancelAll)

        // scrolling the window indicates intention of the user
        // to scroll, not tap or swipe, so cancel all ongoing events
        $(window).on('scroll', cancelAll)
    })

    ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
        'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
            $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
            $.fn.swipeAsyn = function(callback){
                _callback = callback;
            };
        })
})(Zepto);


