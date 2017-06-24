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

var _requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || function(cb){setTimeout(cb,1000/60)};


$.fn.stepText = function(text, inverse){
    if(!text) return false;

    var d = $.Deferred(),
        textLen = text.length,
        flag = inverse ? -1 : 1;
        $this = $(this);

    var _move = function(_index){
        if(_index>textLen || _index<0){
            return d.resolve();
        }

        $this.text(text.substr(0, _index));
        _requestAnimationFrame(function(){
            _move(_index+flag);
        });
    };

    if(inverse){
        _move(textLen);
    }else{
        _move(1);
    }
    return d.promise();
};

function fakeClick(fn) {
    var $a = $('<a href="#" id="fakeClick"></a>');
        $a.bind("click", function(e) {
            e.preventDefault();
            fn();
        });

    $("body").append($a);

    var evt, 
        el = $("#fakeClick").get(0);

    if (document.createEvent) {
        evt = document.createEvent("MouseEvents");
        if (evt.initMouseEvent) {
            evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            el.dispatchEvent(evt);
        }
    }

    $(el).remove();
}


var playAudio = function(src, callback){
    var $audio = $('#audio');
    if($audio.length>0){
        $audio[0].pause();
        $audio.remove();
    }

    $(document.body).append('<audio id="audio" src="'+src+'" preload="auto" autoplay="true">');
    var videoMusic = $('#audio')[0];

    var musicLoaded = function(){
        fakeClick(function(){
            var videoMusic = $('#audio')[0];
            videoMusic.play();
        });
        callback && callback();
    };
    
    videoMusic.addEventListener('canplay', function(){
        musicLoaded();
    });

    if(videoMusic.readyState==4){
        musicLoaded();
    }
    videoMusic.load();
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
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
    exp = $.expando = 'Zepto' + (+new Date()), emptyArray = [];

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id];
    if (name === undefined) return store || setData(node);
    else {
      if (store) {
        if (name in store) return store[name];
        var camelName = camelize(name);
        if (camelName in store) return store[camelName];
      }
      return dataAttr.call($(node), name);
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node));
    if (name !== undefined) store[camelize(name)] = value;
    return store;
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {};
    $.each(node.attributes || emptyArray, function(i, attr){
      if (attr.name.indexOf('data-') == 0)
        store[camelize(attr.name.replace('data-', ''))] =
          $.zepto.deserializeValue(attr.value);
    });
    return store;
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value); });
        }) :
        // get value from first element
        (0 in this ? getData(this[0], name) : undefined) :
      // set value on all elements
      this.each(function(){ setData(this, name, value); });
  };

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/);
    return this.each(function(){
      var id = this[exp], store = id && data[id];
      if (store) $.each(names || store, function(key){
        delete store[names ? camelize(this) : key];
      });
    });
  }

  // Generate extended `remove` and `empty` functions
  ;['remove', 'empty'].forEach(function(methodName){
    var origFn = $.fn[methodName];
    $.fn[methodName] = function() {
      var elements = this.find('*');
      if (methodName === 'remove') elements = elements.add(this);
      elements.removeData();
      return origFn.call(this);
    };
  });
}());

//https://github.com/madrobby/zepto/blob/master/src/touch.js#files
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