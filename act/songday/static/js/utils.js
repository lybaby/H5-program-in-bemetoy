$.Deferred = $.Deferred || function(){
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

$.fn.addAnim = function(cls, time, cssopt, linefn){
    time = time || 300;
    cssopt = cssopt || {};
    endEve = 'webkitAnimationEnd webkitTransitionEnd';
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
        var css = 'all '+time+'ms '+ (linefn||'ease-in');
        $.extend(cssopt, {
            '-webkit-transition' : css,
            'transition' : css
        });
        $sl.one(endEve, fn).css(cssopt).addClass(cls);
    }, 0);
    return d.promise();
};

var bemeObject = {};

bemeObject.loadImages = function(imgs, callback, outtime){
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

bemeObject.getCookie =function getCookie(name)
{
	var arrstr = document.cookie.split("; ");
	for(var i = 0;i < arrstr.length;i ++)
	{
		var temp = arrstr[i].split("=");
		if(temp[0] == name)
			return unescape(temp[1]);
	}
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

var getUA = function(){
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

bemeObject.musicAddScore = function(){
    try{
        var uas = getUA();
        if(+uas[1]>0 && +uas[0]>1){
            window.bemetoy.musicAddScore();
        }else{
            bemeObject.showTips("版本太低，添加贝壳失败!");
        }
    }catch(e){
        bemeObject.showTips("版本太低，添加贝壳失败!");
    }
};

window.onMusicAddScoreResult = function(score){
    var point = parseInt(score);
    if(point > 0){
        $('#J_score-tips .point').text('+'+point);
        var $tips = $('#J_score-tips');
        $('#J_score-tips').show();
        $tips.addClass('tipsscore');

        setTimeout(function(){
            $tips.removeClass('tipsscore');
            $('#J_score-tips').hide();
        }, 3000);
    }else{
        $('#J_score-tips').hide();
    }
};

bemeObject.checkBind = function(msg){
    msg = msg || "您尚未绑定玩具!";
    var uinfo = bemeObject.getUid();
    if(uinfo.to<1){
        location.href="http://m2.bemetoy.com/#!m=pushfail&text=1&type=sdf";
        bemeObject.showTips(msg);
        return false;
    }
    return uinfo;
};

var _playing = false;
bemeObject.playMusic = function(data){
    var uinfo = bemeObject.checkBind(),
        jbuf = bemeObject.stringify(data);
    if(!uinfo){
        return ;
    }

    if(_playing){
        return bemeObject.showTips('正在推送中，请稍等...');
    }

    _playing = true;
    data = {
        "fromuid": uinfo.from,
        "touid": uinfo.to,
        "pushBuf": jbuf
    };
    //alert(bemeObject.getPushUrl()+'_'+JSON.stringify(data));
    $.ajax({
        url: bemeObject.getPushUrl(),
        dataType: "jsonp",
        type: "get",
        jsonp : 'cb',
        cache: false,
        data: data,
        error:function(a,b,c){
            bemeObject.showTips('网络出错啦！');
        },
        success: function(a) {
            if(a.result === 0){
                bemeObject.showTips('推送成功');
                bemeObject.musicAddScore();
            }else{
                //1001 玩具休眠
                bemeObject.showTips('出错了：'+a.res_info);
            }
        },
        complete : function(){
            _playing = false;
        }
    });
};


bemeObject.getUrlParam = function(name, url) {
	var u = url || window.location.search,
	reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
	r = u.substr(u.indexOf("?") + 1).match(reg);
	return r !== null ? r[2] : "";
};

bemeObject.checkPageEnv = function($box, weixinConfig){
    var ua = getUA();
    if(ua){
        if($('.share_weixin').length<1){
            $($box||document.body).append('<div class="share_weixin" style="display: block;"></div>');

            $('.share_weixin').on('click',function(){
                var uinfo = bemeObject.getUid();
                if(uinfo.from<1){
                    return bemeObject.showAlert('请下载贝美时光说app参加活动哦！', false, {hidecancel:true});
                }

                ///////////////////////这里加分享代码//////////////////////
                var data = {
                    'title':'贝美儿歌节，儿歌大闯关',
                    'desc':'贝美时光说首届儿歌节，猜儿歌赢大礼，21日开始，连续7天，不要错过哦！',
                    'url':window.location.href,
                    'shareType':0,
                    'imgUrl':'http://'+location.host+location.pathname+'static/images/song.png'
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
                //window.bemetoy.socialShareWithContent(weixinConfig);
            });
        }

        var flag = +ua[0]>1 && +ua[1]>0;
        if(flag){
            $('.share_weixin').show();
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
