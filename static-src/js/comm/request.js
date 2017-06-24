/*global define, $*/

define('comm/request', ['comm/utils','helper/app','require', 'exports'], function(mUtils,mApp, require, exports){
    "use strict";
    
    exports.hookSuccess = function(){};
    var isSuccess = false;

    var globalRequestHook = {};
    exports.addGlobalRequestHook = function(name, fn){
        if(!fn){
            delete globalRequestHook[name];
        }else{
            globalRequestHook[name] = fn;
        }
    };

    var _execHookFunc = function(data, params){
        exports.hookSuccess(data, params);
        $.each(globalRequestHook, function(name, fn){
            fn(data, params);
        });
    };

    exports.getRequest = function(params){
		isSuccess = false;
        params = params || {};
        if(!params.url){
            return ;
        }
        params.xhrFields = {"withCredentials":true};
        params.success = function(data){
            if(params.successfn){
                var jdata = data ? $.parseJSON(data) : {};
                params.successfn(jdata);
                _execHookFunc(jdata, params);
            }
        };
        params.timeout = 45000;
        params.error = function(XMLHttpRequest, textStatus, errorThrown){
            if(!isSuccess){
                mApp.loadingFail();
            }
        };
        return $.ajax(params);
    };

    var __callback = function(data, params){
        var jdata = $.parseJSON(data);
        params.successfn(jdata, {from:'local'});
        _execHookFunc(jdata, params);
        return jdata;
    };

    var _callback = function(data, params){
        return __callback(data, params);
    };

    exports.getLocalRequest = function(params){
		isSuccess = false;
        params = params || {};
        if(!params.url){
            return ;
        }
        params.name = params.name || params.url;
        var cachedata = mUtils.cache.get(params.name);
        if(cachedata){
            if(params.successfn){
                _callback(cachedata, params);
            }
        }

        params.success = function(data){
            if(!data){
                return ;
            }

            var jdata = null;
            if((!cachedata || cachedata!=data) && params.successfn){ //是否请求后回调
                jdata = _callback(data, params);
            }else{
                jdata = $.parseJSON(data);
            }
            
            if(jdata && jdata.code==0 && cachedata!=data && params.name){
                mUtils.cache.set(params.name, data);
            }
        };
        params.xhrFields = {"withCredentials":true};
        params.timeout = 45000;
        params.error = function(XMLHttpRequest, textStatus, errorThrown){
            if(!isSuccess){
                mApp.loadingFail();
            }
        };
        if(cachedata){
            isSuccess = true;
            setTimeout(function(){
                $.ajax(params);
            }, 100);
        }else{
            $.ajax(params);
        }
    };
    
    exports.getScript = function(src, func) {
        var script = document.createElement('script');
        script.async = "async";
        script.src = src;
        if (func) {
           script.onload = func;
        }
        document.getElementsByTagName("head")[0].appendChild( script );
    };
});