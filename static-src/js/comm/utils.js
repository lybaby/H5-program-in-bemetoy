/*global define, $, BEME*/

define('comm/utils', ['comm/url', 'require', 'exports'], function(mUrl, require, exports){
    "use strict";
    var emptyFunc = function(){},
        lstore = window.localStorage;

    Object.keys = Object.keys||function(obj){
        var keys = [];
        for(var prop in obj){
            if(obj.hasOwnProperty(prop)){
                keys.push(prop);
            }
        }
        return keys;
    };

    //获取url参数
    exports.getQueryString = function (name, dval){
        var _paramsReg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"),
            r = window.location.search.substr(1).match(_paramsReg);
        if (r!==null){
            return r[2];
        }
        return dval;
    };

    var _tempdata = {};
    exports.getUrlSearchInfo = function(){
        if(_tempdata.searchData){
            return _tempdata.searchData;
        }
        var l = window.location,
            s = l.search.replace(/^[\?]+/, ''),
            h = location.hash.replace(/^[#!]+/, ''),
            _k, _v;
        s = s+'&'+h;
        s = s.split('&');

        _tempdata.searchData = {};
        $.each(s, function(i, info){
            if(!info){
                return true;
            }

            i = info.indexOf('=');
            if(i>-1){
                _k = info.substr(0, i);
                _v = info.substr(i+1);
            }else{
                _k = info;
                _v = '';
            }
            _tempdata.searchData[_k] = _v;
        });

        return _tempdata.searchData;
    };

    var cacheModel = {
        set : function(key, value){
            try{
                return lstore.setItem(key, value);
            }catch(e){
                try{
                    lstore.removeItem(key);
                    return lstore.setItem(key, value);
                }catch(ee){
                    lstore.clear();
                    console.log('cache['+key+'] set error!');
                }
            }
            return false;
        },

        get : function(key){
            try{
                return lstore.getItem(key);
            }catch(e){
                return false;
            }
        },

        del : function(key){
            try{
                return lstore.removeItem(key);
            }catch(e){
                return false;
            }
        },

        clear : function(){
            lstore.clear();
        }
    };

    exports.cache = cacheModel;

    //不支持重置掉
    if(!lstore){
        exports.cache = {
            set : emptyFunc,
            get : emptyFunc,
            del : emptyFunc,
            clear : emptyFunc
        };
    }

    exports.template = function(id, data, setting){
        var dom = $('#'+id),
            html = dom.html();
        return BEME.template(html, data, setting);
    };

    //获取页面Url
    //chrome bug:http://stackoverflow.com/questions/26017978/iframe-causes-parent-elements-to-scroll-up-on-google-chrome-when-url-contains-fr
    //iframeurl中有空#则会导致页面自动滚到顶部
    exports.getHashUrl = function(hashs, split){
        split = split || '#!';
        var params = '';
        params = mUrl.buildQuery(hashs);
        return split+params;
    };

    exports.replaceHashUrl = function(hashs, split){
        split = split || '#!';
        var params = '',
            _hashs = mUrl.getParams();
        $.extend(hashs, _hashs);
        params = mUrl.buildQuery(hashs);
        return split+params;
    };

    exports.getDateInfo = function(timestamp, key){
        var theDate = new Date(timestamp * 1000),
            info = {
                y : theDate.getFullYear(),
                m : theDate.getMonth()+1,
                d : theDate.getDate(),
                H : theDate.getHours(),
                M : theDate.getMinutes(),
                S : theDate.getSeconds()
            };
        $.each(info, function(k, v){
            info[k] = v<10 ? '0'+v : v;
        });
        return key ? info[key] : info;
    };

    exports.formatDate = function(timestamp){
        var info = exports.getDateInfo(timestamp),
            dateStr = info.m+'-'+info.d;
        if(info.y!=(new Date()).getFullYear()){
            dateStr = info.y+'-'+dateStr;
        }
        return dateStr;
    };
	
	exports.changeDate = function(date){
		var dat = new Date(date);
		var res =dat.getFullYear() +'-'+ (dat.getMonth() + 1) + "-" + dat.getDate();
		return res;
	};

    exports.appCookie = function _appCookie(key, val, conf){
        var doc = document,
            host = window.location.hostname;
        if(typeof val == "undefined"){
            if(0 < doc.cookie.length){
                var k = doc.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
                return (null === k) ? '': k[2];
            }
            return '';
        }

        if(_appCookie(key) == val){
            return false;
        }

        conf = $.extend({
            expires: 1,
            path: "/",
            domain: host
        }, conf || {});

        if(val === null){
            val = '';
            conf.expires = -1;
        }

        var expires = '';
        if(conf.expires && (typeof conf.expires == "number" || conf.expires.toUTCString)){
            var h;
            if(typeof conf.expires == "number"){
                h = new Date();
                h.setTime(h.getTime() + (conf.expires * 1 * 60 * 60 * 1000));
            }else{
                h = conf.expires;
            }
            expires = h.toUTCString();
        }
        var l = conf.path ? "; path=" + (conf.path) : "";
        var i = conf.domain ? '; domain=' + (conf.domain) : host;
        var e = conf.secure ? '; secure': '';
        doc.cookie = key + "=" + val + "; path=" + l + "; domain=" + i + "; expires=" + expires;

        return _appCookie(key);
    };

    exports.formatTime = function(timeNum){
        var strArr = [],
            pnum = 0,
            num = 0;
        for(var i=1; i>-1; i--){
            pnum = Math.pow(60, i);
            num = Math.floor(timeNum/pnum);
            num = num<10 ? '0'+num : num;
            strArr.push(num);
            timeNum = timeNum % pnum;
        }

        return strArr.join('\'')+'\"';
    };

    exports.imageUrl = function(url){
        if(url){
            var str = url.split('.');
            str[str.length - 2] = str[str.length - 2] + '_335px_70qu';
            return str.join('.');
        }
    };

    exports.imageUrlHead = function(url){
        if(url){
            var str = url.split('.');
            str[str.length - 2] = str[str.length - 2] + '_335px_90qu';
            return str.join('.');
        }
    };
	
	exports.imageWeixin = function(url){
        if(url){
            var str = url.split('.');
            str[str.length - 2] = str[str.length - 2] + '_70px_70qu';
            return str.join('.');
        }
    };

    exports.imageUrlStationHead = function(url,type){
        if(url){
            var str = url.split('.');
            if(type == 1){
                str[str.length - 2] = str[str.length - 2] + '_640px_90qu';
            }
            if(type == 0){
                str[str.length - 2] = str[str.length - 2] + '_320px_90qu';
            }
            return str.join('.');
        }
    };

    exports.formatPushTime = function(timestr){
        timestr = timestr.replace(/(,$)/, '');
        var times = timestr.split(',');
        if(times.length===7){
            return '天';
        }
        var rets = [],
            conf = ['日', '一', '二', '三', '四', '五', '六'];
        times.sort();
        if(+times[0]===0){ //把周日放最后
            times.splice(0, 1);
            times.push(0);
        }
        $.each(times, function(i, v){
            rets.push('周'+conf[+v]);
        });
        return rets.join('、');
    };

    var COLOR_ARRAY = ['#eb67d5','#33b833','#ed5239','#288be1','#ff8800'];
    exports.getRandColor = (function(){
        var randArr = [];
        return function(){
            if(randArr.length<1){
                randArr = COLOR_ARRAY.slice(0);
            }
            var color = randArr[Math.floor(randArr.length*Math.random())];
            var index = randArr.indexOf(color);
            randArr.splice(index, 1);
            return color;
        }
    }());


    exports.headerMenu = function(){
        $('#myplay').hide();
        $('#editplay').hide();
        $('#addplay').hide();
        $('#save_station').hide();
        $('#delete_play').hide();
    };

    exports.hideHeader= function(){
        $('.main-header').hide();
        $('#J_wrapper').css('margin-top','-1.1rem');
        $('#J_body-tips').css('margin-top','-1.05rem');
    };
	
	exports.loadImages = function(imgs, callback, outtime){
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
	
	
	exports.getCookie =function(name){
        var arrstr = document.cookie.split("; ");
        for(var i = 0;i < arrstr.length;i ++)
        {
            var temp = arrstr[i].split("=");
            if(temp[0] == name)
                return unescape(temp[1]);
        }
    };

    exports.getUid = function(){
        var uid = 0;
        var sessionid=exports.getCookie('session_id');
        if(!sessionid){
            try{
                uid = window.bemetoy.getFromUerid();
            }
            catch(e){

            }
        }
        return uid;
    };
	
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


    //注册给模板调用
    BEME.func = BEME.func || {};
    BEME.func.appCookie = exports.appCookie;
    BEME.func.getHashUrl = exports.getHashUrl;
    BEME.func.replaceHashUrl = exports.replaceHashUrl;
    BEME.func.getDateInfo = exports.getDateInfo;
    BEME.func.formatDate = exports.formatDate;
    BEME.func.formatTime = exports.formatTime;
	BEME.func.changeDate = exports.changeDate;
    BEME.func.formatPushTime = exports.formatPushTime;
    BEME.func.imageUrl = exports.imageUrl;
    BEME.func.imageUrlHead = exports.imageUrlHead;
    BEME.func.imageUrlStationHead = exports.imageUrlStationHead;
    return exports;
});
