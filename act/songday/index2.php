<?php
include './inc/config2.php';
global $toyconfig, $prizeconfig;
$url = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME']).'/';

$today = isset($_GET['today']) ? $_GET['today'] : date('Y-m-d');
$tomore = $today=='2016-04-03' ? '奥斯卡评选活动已结束，感谢您的参与！本周内公布获得运动小熊得主，以及其他礼品的发放时间，要紧密关注哦！' : '欢迎明天再来参加，继续抽奖哦！';
?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name='format-detection' content='telephone=no'>
<meta name='viewport' content='width=device-width, minimum-scale=1.0, maximum-scale=1.0'>
<meta name='format-detection' content='telephone=no'>
<meta name="screen-orientation"content="portrait">
<meta name="x5-orientation" content="portrait">
<title>贝美儿歌节</title>

<link rel="stylesheet" type="text/css" href="./static/css/style.css?t=122">
<link rel="stylesheet" type="text/css" href="./static/css/act2.css?t=125">

<script type="text/javascript">
    var resizeBody = function(){
        var docEl = document.documentElement;
        docEl.style.fontSize = docEl.clientWidth/7.5+'px';
    };
    var key = "onorientationchange" in window ? "orientationchange" : "resize";
    window.addEventListener(key, resizeBody, false);

    resizeBody();
</script>
</head>
<body>

<div class="loading-box" id="J_loadingbox">
    <div class='uil-ripple-css' style='transform:scale(0.2);'><div></div><div></div></div>
    <div class="text">loading：<span>0%</span></div>
</div>

<div class="main" id="J_mainbox">
    <div class="topbox">
        <div class="topday">
            <img src="./static/images/top-day.png" class="autoh" alt="">
        </div>
        <div class="toydesc" id="J_toydesc">
            <img src="./static/images/top-desc2.png?12" class="autow" alt="">
        </div>
    </div>

    <div class="topbtns">
        <a href="javascript:void(0);" class="act2" id="J_act2"></a>
    </div>

    <div class="divgift"></div>

    <div class="textbox" id="J_rulebox">
        <div class="t">3.28-4.3（火热进行中）</div>
        <div class="txt">
            第一届贝美奥斯卡海选启动啦<br>
            在框内填写宝贝最爱儿歌<br>
            最受欢迎电台主播<br>
            勾选宝贝最佳拍档（卡通故事形象）<br>
            即可获得20贝壳<br>
            然后<span>分享到朋友圈</span>，即可开始抽奖<br>
            有机会获得<span>价值359元</span>的新品互联网玩具<br>
            <span>每天</span>都可以参加，<span>100%中奖</span>~<br>
            还等什么？赶紧行动吧！<br>
        </div>
        <div class="morebg"><img src="./static/images/toy2.jpg" class="autoh"></div>
    </div>

    <div class="textbox sharebox" id="J_sharebox">
        <div class="t">3.28-4.3（火热进行中）</div>
        <div class="result">
            投票成功！<br>
            将活动分享到朋友圈即可开始抽奖
        </div>
        <a href="javascript:void(0);" class="btn-share" id="J_btn-share"></a>
        <a href="javascript:void(0);" class="temp" id="J_prize-temp"></a>
    </div>

    <div class="textbox prizedbox" id="J_prizedbox">
        <div class="t">3.28-4.3（火热进行中）</div>
        <div class="result">
            恭喜你今日获得了&nbsp; <span>六福珠宝</span>
        </div>
        <div class="text"><?=$tomore; ?></div>
		<div class="btn-list">
			<a href="./prizelist.php" class="btn-history left"></a>
			<a href="javascript:void(0);" class="btn-share right" id="J_btn_share"></a>
		</div>
    </div>

    <div class="toybox" id="J_toybox">
        <img src="./static/images/toy.png" class="autow">
    </div>

    <div class="zhubolist" id="J_zhubobox">
        <div class="zhutitle">宝宝最喜欢哪位贝美主播：</div>
        <div class="zhuitem zhu1">
            <a href="http://m2.bemetoy.com/#!m=fminfo&id=19" class="link"></a>
            <a href="javascript:void(0);" index="1" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
        <div class="zhuitem zhu2">
            <a href="http://m2.bemetoy.com/#!m=fminfo&id=14" class="link"></a>
            <a href="javascript:void(0);" index="2" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
        <div class="zhuitem zhu3">
            <a href="http://m2.bemetoy.com/#!m=fminfo&id=16" class="link"></a>
            <a href="javascript:void(0);" index="3" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
        <div class="zhuitem zhu4">
            <a href="http://m2.bemetoy.com/#!m=fminfo&id=12" class="link"></a>
            <a href="javascript:void(0);" index="4" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
    </div>
    

    <div class="stoybox" id="J_stoybox">
        <div class="zhutitle">宝宝最喜欢的最佳拍档是：</div>
        <ul class="toyul">
            <? foreach ($toyconfig as $k => $name) {?>
            <li class="item item<?=$k+5; ?>">
                <a href="javascript:void(0);">
                    <div class="img" style="background:url('./static/images/bo<?=$k+1; ?>.jpg') no-repeat; background-size:100% auto;">
                        <div></div>
                    </div>
                    <div class="title textover"><i></i><?=$name; ?></div>
                </a>
                <div class="num">票数&nbsp;<span>--</span></div>
            </li>
            <? } ?>
        </ul>
    </div>

    <div class="songbox" id="J_songbox">
        <div class="zhutitle">写下宝宝最喜欢的3首贝美歌曲：</div>
        <div class="box">
            <input type="text">
            <input type="text">
            <input type="text">
        </div>

        <div class="textlist"></div>
    </div>

    <div class="submitbox">
        <a href="javascript:void(0);" class="submit" id="J_submit"></a>
    </div>

    <div class="textbox" id="J_tobe">
        <div class="t"><?=$tomore; ?></div>
    </div>
</div>

<div class="body-mask" id="J_body-mask"></div>
<div class="alert-box" id="J_alert-box">
    <div class="content">
        <div class="desc">确定不再收藏该专辑？</div>
    </div>
    <div class="footer">
        <a href="javascript:void(0);"  class="abtn btn-cancel">取消</a>
        <a href="javascript:void(0);"  class="abtn btn-ok">确定</a>
    </div>
</div>

<div id="J_body-tips" class="body-tips textover">您尚未绑定玩具!</div>
<div id="J_jplayer" style="display:none;">
    <audio id="J_audio-1" src="./static/zhubo/1.mp3" preload="false" ></audio>
    <audio id="J_audio-2" src="./static/zhubo/2.mp3" preload="false" ></audio>
    <audio id="J_audio-3" src="./static/zhubo/3.mp3" preload="false" ></audio>
    <audio id="J_audio-4" src="./static/zhubo/4.mp3" preload="false" ></audio>
</div>

<script type="text/javascript">
window.onerror = function(e, l, o){
    //alert(e+l+o);
};

(function(){
    var dPlayer = document.getElementById('J_jplayer'),
    audios = dPlayer.getElementsByTagName('audio');
    for(var i=0,l=audios.length; i<l; i++){
        audios[i].addEventListener('canplay', function(){
            //this.pause();
        }, false);
    }
}());
</script>

<script type="text/javascript" src="./static/js/zepto-1.1.6.min.js?t=12"></script>
<script type="text/javascript" src="./static/js/utils.js?t=129"></script>

<script type="text/javascript">
$(document).ready(function(){
    var today = "<?=$today; ?>",
        _requestComplete = false,
        _resourceLoaded = false,
        _prizeConfig = <?=json_encode($prizeconfig); ?>;

    var $topdesc = $('#J_toydesc'),
        $toybox = $('#J_toybox'),
        imgs = [];
    imgs = [
        './static/images/top-bg.png',
        './static/images/cicle-bg1.png',
        './static/images/title-btn2.png?12',
        './static/images/act-1.png?12',
        './static/images/top-day.png',
        './static/images/top-desc2.png?12',
        './static/images/toy2.jpg',
        './static/images/zhubo1.jpg',
        './static/images/zhubo2.jpg',
        './static/images/zhubo3.jpg',
        './static/images/zhubo4.jpg',
        './static/images/icon-checked.png',
        './static/images/voice.gif'
    ];

    var _initPage = function(){
        if(!_resourceLoaded || !_requestComplete){
            return ;
        }
        $topdesc.addAnim('swing', 1600).done(function(){
            $toybox.addAnim('toybox-in', 200);
        });

        $('#J_loadingbox').hide();
        $('#J_mainbox').show();

        $('#J_jplayer audio').each(function(i, audio){
            //audio.src = $(audio).attr('presrc');
            audio.pause();
        });
    };

    bemeObject.loadImages(imgs, function(loadall, loadedNum){
        if(loadall){
            _resourceLoaded = true;
            _initPage();
        }else{
            var perNum = 100.0/imgs.length,
                process = Math.floor(loadedNum*perNum+(Math.random()*perNum));
            if(process>100){
                process = 100;
            }
            return $('#J_loadingbox .text span').text(process+'%');
        }
    });

    $('#J_stoybox .item a').on('click', function(){
        if($('#J_stoybox').hasClass('toyselected')){
            return false;
        }
        var $this = $(this);
        if($this.hasClass('selected')){
            $this.removeClass('selected');
            $this.find('i').removeClass('checked');
        }else{
            $this.addClass('selected');
            $this.find('i').addClass('checked');
        }
    });

    $('#J_zhubobox .btnvote').on('click', function(){
        var $this = $(this);
        if($this.hasClass('hasvoted')){
            return false;
        }
        if(!$this.hasClass('btnvoted')){
            $this.addClass('btnvoted');
        }else{
            $this.removeClass('btnvoted');
        }
    });

    $('#J_act2').on('click', function(){
        bemeObject.showAlert('活动一已经结束了，赶紧去参加活动二的奥斯卡评选，359元新品小熊等你拿！', null, {hidecancel:true});
    });

    var url = 'http://dev.h5.bemetoy.com/app/m2/active/',
        uid = 121,
        votearr=[],test = 0,
        userInfo = {};
    var queryAn = function(ips, person, song){
        $('#J_submit').addClass('i-doing');
		var sessionid=bemeObject.getCookie('session_id'); 
		if(!sessionid){
			uid = window.bemetoy.getFromUerid();
			test = 1;
		}
        $.ajax({
            url : url+'submit',
            data : {
                ip  : ips,
                person : person,
                song : song,
                uid : uid,
				test:test
            },
			type: "post",
            dataType : 'json',
            xhrFields : {"withCredentials":true},
            success : function(data){
                if(!data.data){
                    return bemeObject.showAlert(data.message, function(isok){
                        this.close();
                    }, {hidecancel:true});
                }
                
                $(window).scrollTop(0);

                _setAnsw(person, ips, song);
                bemeObject.showAlert('信息已提交，恭喜获得20贝壳。将活动转发至朋友圈，即可开始抽奖。359元运动小熊等你拿~！', function(isok){
                    if(isok){
                        shareWX();
                    }
                    this.close();
                }, {cancelText:"返回",okText:"分享"});
            },

            complete : function(){
                $('#J_submit').removeClass('i-doing');
            },

            error : function(jqXHR, textStatus, errorThrown){
                bemeObject.showAlert('信息提交失败，请重试:'+textStatus, null, {hidecancel:true});
            }
        });
    };

    var _setAnsw = function(anchors, ips, song_name){
        var _anchors = anchors.split(','),
            _ips = ips.split(','),
            _songs = song_name.split('##');

        var $btnvotes = $('#J_zhubobox .btnvote');
        $btnvotes.hide();
        $.each(_anchors, function(i, index){
            $btnvotes.eq(+index-1).addClass('btnvoted hasvoted').show();
        });

        var $stoybox = $('#J_stoybox').addClass('toyselected');
        var $items = $stoybox.find('.item').hide();
        $.each(_ips, function(i, index){
            $items.eq(+index-5).show().find('a').addClass('selected');
        });

        if(song_name){
            $('#J_songbox .box').hide();
            $.each(_songs, function(i, song){
               var $temp = $('<div><span></span></div>');
               $('#J_songbox .textlist').append($temp);
               $temp.find('span').text(song);
            });
            $('#J_songbox .textlist').show();
        }else{
            $('#J_songbox').hide();
        }
        
        $('#J_submit, #J_rulebox').hide();
        $('#J_sharebox').show();
    };

    var queryList = function(){
		var sessionid=bemeObject.getCookie('session_id'); 
		if(!sessionid){
			try{
				uid = window.bemetoy.getFromUerid();
				test = 1;
				alert(1);
			}
			catch(e){
				
			}
		}
        return $.ajax({
            url : url+'queryUser',
            data : {
                uid : uid,
				test:test
            },
            cache : false,
			type: "post",
            dataType : 'json',
            xhrFields : {"withCredentials":true},
            success : function(data){
                _requestComplete = true;
                _initPage();

                userInfo = data.data.user || {};
                if(!userInfo.isFirst){
                    $('#J_songbox').hide();
                }

                votearr = data.data.vote;
                if(votearr){
                    $.each(votearr, function(i, info){
                        if(+info.id<5){
                            $('#J_zhubobox .zhu'+info.id+' .votenum span').text(info.vote_num);
                        }else{
                            $('#J_stoybox .item'+info.id+' span').text(info.vote_num);
                        }
                    });
                }

                data = data.data;
                if(!data.user || !data.user.anchors_id){
                    return ;
                }

                _setAnsw(data.user.anchors_id, data.user.ips_id, data.user.song_name, votearr);

                var uinfo = bemeObject.getUid();
                var shared = localStorage.getItem('_songday_act'+uinfo.from+today),
                    prizeid = +data.user.isChecked;
                if(!prizeid && shared){ //还没有抽奖且分享过了
                    location.href="./prize.php";
                }

                if(prizeid){
                    $('#J_prizedbox .result span').text(_prizeConfig[prizeid-1]);
                    $('#J_submit, #J_rulebox, #J_sharebox').hide();
                    $('#J_tobe, #J_prizedbox').show();
                }
            },

            error : function(jqXHR, textStatus, errorThrown){
                bemeObject.showAlert('网络请求出错啦，点击确认重新加载:'+textStatus, function(isok){
                    location.reload();
                }, {hidecancel:true});
            }
        });
    };

    var shareWX = function(){
        var data = {
            'title':'百分百中奖，快来领取359元贝美互联网玩具！贝美奥斯卡活动，连续七天礼品送不停',
            'desc':'我正在参加贝美时光说活动，100%中奖几率！价值359元的互联网玩具等你拿，亲们快来一起领取吧~',
            'url':window.location.href.replace('index2', 'share'),
            'shareType':0,
            'imgUrl':'http://'+location.host+'/m2/act/songday/static/images/song2.png'
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

        var uinfo = bemeObject.getUid();
        localStorage.setItem('_songday_act'+uinfo.from+today, 1);
    };

    $('#J_submit').on('click', function(){
        if($(this).hasClass('i-doing')){
            return false;
        }

        var uinfo = bemeObject.getUid();
        if(uinfo.from<1){
            bemeObject.showAlert('请下载贝美时光说app参加活动哦！', false, {hidecancel:true});
            return;
        }

        var $btnvotes = $('#J_zhubobox .btnvote');
        var zhubovotes = [];
        $btnvotes.each(function(i, btn){
            if($(btn).hasClass('btnvoted')){
                zhubovotes.push(i+1);
            }
        });
        if(zhubovotes.length<1){
            return bemeObject.showAlert('您还没给主播们投票哦！', null, {hidecancel:true});
        }

        var $toyboxs = $('#J_stoybox .item a'),
            toys = [];
        $toyboxs.each(function(i, btn){
            if($(btn).hasClass('selected')){
                toys.push(i+5);
            }
        });
        if(toys.length<1){
            return bemeObject.showAlert('您还没给卡通角色投票哦！', null, {hidecancel:true});
        }

        var $inps = $('#J_songbox input'),
            songs = [];
        $inps.each(function(i, inp){
            var val = $.trim($(inp).val());
            if(val){
                songs.push(val);
            }
        });
        if(songs.length<1 && userInfo.isFirst){
            return bemeObject.showAlert('请至少填写一首宝宝喜欢的贝美歌曲哦！', null, {hidecancel:true});
        }

        //用户选择的答案
        queryAn(toys.join(','), zhubovotes.join(','), songs.join('##'));
    });

    $('#J_btn-share').on('click', function(){
        shareWX();
    });

	$('#J_btn_share').on('click', function(){
        shareWX();
    });

	
    $('#J_zhubobox .btnplay').on('click', function(){
        var $this = $(this),
            index = $this.attr('index'),
            $icon = $this.find('.icon');
        var isplay = $icon.hasClass('playing'),
            curaudio = $('#J_audio-'+index)[0];

        $('#J_jplayer audio').each(function(i, audio){
            if($(audio).attr('isplayed')){
                audio.currentTime=0;
                audio.pause();
            }
        });
        $('#J_zhubobox .btnplay').each(function(i, btn){
            $(btn).find('.icon').removeClass('playing');
        });
        
        $(curaudio).attr('isplayed', 1);
        if(isplay){
            $icon.removeClass('playing');
            curaudio.pause();
        }else{
            $icon.addClass('playing');
            curaudio.play();
        }
        return false;
    });

    $('#J_prize-temp').on('click', function(){
        var uinfo = bemeObject.getUid();
        var shared = localStorage.getItem('_songday_act'+uinfo.from+today);
        if(!shared){ //还没有抽奖且分享过了
            return bemeObject.showAlert('请将此活动分享到朋友圈，分享成功后即可开始抽奖！', null, {hidecancel:true});
        }else{
            location.href="./prize.php";
        }
    });
    
    queryList();

    $('#J_jplayer audio').on('ended', function(){
        this.pause();
        $('#J_zhubobox .btnplay .icon').removeClass('playing');
    });
});

//客户端调用关闭音乐接口
window.colseMusic = function(){
    try{
        var dPlayer = document.getElementById('J_jplayer'),
            audios = dPlayer.getElementsByTagName('audio');
        for(var i=0,l=audios.length; i<l; i++){
            audios[i].pause();
        }
    }catch(e){}
};

//stop audio
if('onbeforeunload' in window){
    window.onbeforeunload = window.colseMusic;
}else if('pagehide' in document){
    document.pagehide = window.colseMusic;
}

</script>

</body>
</html>
