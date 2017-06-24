/*global define*/
define('comm/url', ['require', 'exports'], function(require, exports) {
    "use strict";

    exports.setHash = function(val, win) {
        console.log('set hash:'+val);
        win = win || window;
        val = val.replace(/^[#!]+/, '');
        win.location.hash = '#!'+val;
        return val;
    };
    
    exports.getHash = function(url) {
        var u = location.hash||location.search,
            indx = 0;
        if(url){
            indx = url.indexOf('#');
            u = indx>-1 ? url.substr(indx+1) : '';
        }
        return u ? u.replace(/^[#!\?]+/, '') : "";
    };

    exports.getParams = function(url) {
        var param = {}, xx,
            hash = this.getHash(url),
            paramArr = hash ? hash.split("&") : [];
        for (var i=0, l=paramArr.length; i<l; i++) {
            xx = paramArr[i].split('=');
            param[xx[0]] = xx[1];
        }
        return param;
    };

    exports.buildQuery = function(params){
        var urls = [];
        $.each(params, function(k, v){
            if(v!==null && typeof v!=='undefined'){
                urls.push(k + '=' + v);
            }
        });
        urls = urls.join('&');
        return urls;
    };

    exports.setParams = function(params){
        var urls = exports.buildQuery(params);
        return exports.setHash(urls);
    };

    //扩展url信息
    exports.extParams = function(params){
        var indexHash = exports.getParams();

        //设置当前url
        indexHash = $.extend(indexHash, params);
        return exports.setParams(indexHash);
    };

    exports.reload = function(url) {
        var params = this.getParams(url);
        params.t = Math.ceil(Math.random()*1000);
        return this.setParams(params);
    };

    exports.getHashParam = function(name) {
        var result = exports.getHash().match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"));
        return result !== null ? result[2] : "";
    };

    exports.getUrlParam = function(name, url) {
        var u = url || window.location.search,
        reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
        r = u.substr(u.indexOf("?") + 1).match(reg);
        return r !== null ? r[2] : "";
    };

});