/*global define, $, BEME*/

define('comm/pushsong', ['comm/url','helper/app', 'comm/request', 'require', 'exports'], function(mUrl,mApp,  mRequest,require, exports){
    "use strict";


    var _playReport = function(bid, sid, tag){
        if(mApp.getUA(0) > 1){
            mApp.showTips("推送成功!");
        }
        else{
            mApp.showOneTips("推送成功!");
        }
        mRequest.getRequest({
            url : BEME.APIURL+'/albums/playSong',
            data:
            {
                tag:tag,
                tag_id:bid,
                song_id: sid
            },
            type:'POST',
            successfn : function(jdata){
            }
        });

        if($("#num")){
            var num = $("#num").text();
            num = +num +1;
            $("#num").html(num);
        }
    };

    var _playAllSong = function(info,isSleep){
        mApp.showTips("推送成功!");
        $('#J_random-box').hide();
        mApp.hideMask();
        if(!isSleep){
            mRequest.getRequest({
                url : BEME.APIURL+'/listen/getUnPlay',
                type:'POST',
                successfn : function(jdata){
                    if(jdata.code==0 && jdata.data > 30){
                        var str = '玩具已有'+jdata.data+'首歌曲尚未播放，快去播给宝宝听吧~';
                        mApp.showAlert(str);
                    }
                }
            });
        }
        else{
            $('#J_body-mask').show();
        }
        $.each(info,function(i,inf){
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/playSong',
                data:
                {
                    tag:inf.tag,
                    tag_id:inf.bid,
                    song_id: inf.fid
                },
                type:'POST',
                successfn : function(jdata){
                }
            });
        });
        if($("#num")){
            var num = $("#num").text();
            num = +num + info.length;
            $("#num").html(num);
        }

    };

    exports.getUid = function() {
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

    exports.getPushUrl = function(){
        var api = 'short.bemetoy.com/push_music',
            hostArr = location.host.split('.');
        if(hostArr.length>3){
            api = hostArr[0]+'.'+api;
        }
		api = 'dev.short.bemetoy.com/push_music';
        return 'http://'+api;
    };

    var _v = {};

    _v.stringify = function(vContent){
        if(vContent instanceof Object){
            var sOutput = '';
            if(vContent.constructor === Array){
                for(var nId = 0; nId < vContent.length; sOutput += _v.stringify(vContent[nId]) + ",", nId++){}
                return '[' + sOutput.substr(0, sOutput.length - 1) + ']';
            }
            if(vContent.toString !== Object.prototype.toString){
                return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\"";
            }
            for(var sProp in vContent){
                sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + _v.stringify(vContent[sProp]) + ",";
            }
            return '{' + sOutput.substr(0, sOutput.length - 1) + '}';
        }
        return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
    };


    exports.stringify=_v.stringify;

    exports.playMusic = function(data, info){
        var uinfo = exports.getUid(),
            jbuf = exports.stringify(data);
        if(uinfo.to <1){
            //mApp.showTips("您尚未绑定玩具！");
			if(mApp.changePlayList()){
				try{
					 window.bemetoy.bindToyByType(1);
				}
				catch(e){
					alert(e);
				}	
			}else{
				if(mApp.getUA(0) > 1){
					window.location.href='#!m=pushfail&text=1&type='+data.tag;
				}
				else{
					mApp.showOneTips("您尚未绑定玩具!");
				}
			}
            
           // window.location.href='#!m=pushfail&text=1&type='+data.tag;
            return ;
        }

        data = {
            "fromuid": uinfo.from,
            "touid": uinfo.to,
            "pushBuf": jbuf
        };
        $.ajax({
            url: exports.getPushUrl(),
            dataType: "jsonp",
            type: "get",
            jsonp : 'cb',
            cache: false,
            data: data,
            error:function(a,b,c){
                var d = 1;
            },
            success: function(a) {
                if(a.result === 1001)
                {
                    mApp.showAlert(a.res_info);
                }
				exports.musicAddScore();
                _playReport(info.bid, info.fid, info.tag);
            }
        });
    };
	
	exports.musicAddScore = function(){
		try{
			var ver1 = mApp.getUA(1);
			var ver2 = mApp.getUA(0);
			 if(ver1 > 0 && ver2 > 1){
			    window.bemetoy.musicAddScore();
			}
		}
		catch(e){
			//alert(e);
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

    exports.playAllMusic = function(data,info){
        var uinfo = exports.getUid(),
            jbuf = exports.stringify(data);
        if(uinfo.to <1){
           if(mApp.changePlayList()){
				try{
					 window.bemetoy.bindToyByType(1);
				}
				catch(e){
					//alert(e);
				}	
			}else{
				$('#J_random-box').hide();
				mApp.hideMask();
				window.location.href='#!m=pushfail&text=1&type='+data[0].tag;
			}

            return ;
        }

        data = {
            "fromuid": uinfo.from,
            "touid": uinfo.to,
            "pushBuf": jbuf
        };
        $.ajax({
            url: exports.getPushUrl(),
            dataType: "jsonp",
            type: "get",
            jsonp : 'cb',
            cache: false,
            data: data,
            success: function(a) {
                var isSleep = false;
                if(a.result === 1001)
                {
                    isSleep = true;
                    mApp.showAlert(a.res_info);
                }

				exports.musicAddScore();
                $('.item-a').filter(".play-btn").attr('value',0);
                _playAllSong(info,isSleep);
            }
        });
    };
});

