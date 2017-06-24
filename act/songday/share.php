<?php
include './inc/config2.php';
global $toyconfig, $prizeconfig;
$url = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME']).'/';

$today = isset($_GET['today']) ? $_GET['today'] : date('Y-m-d');
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
<link rel="stylesheet" type="text/css" href="./static/css/act2.css?t=122">
<style type="text/css">
.zhubolist .votebox .btnvote{display: none;}
.sharebox{display: block;}
#J_tobe{display: block;}
.footer-weixin{bottom: auto; top: 0; z-index: 1000;}
</style>

<script type="text/javascript">
    var resizeBody = function(){
        var docEl = document.documentElement;
        docEl.style.fontSize = docEl.clientWidth/7.5+'px';
    };
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
        <div class="t">参与方式</div>
        <div class="txt" style="color:#e45837;">
            下载贝美时光说<br>
            选出宝宝喜欢的贝美主播<br>
            即有机会获得贝美新品互联网玩具&nbsp;价值359元！<br>
            百分百中奖，赶紧来参加吧~
        </div>
        <div class="morebg"><img src="./static/images/toy2.png" class="autoh"></div>
    </div>

    <div class="zhubolist" id="J_zhubobox">
        <div class="zhutitle">宝宝最喜欢哪位贝美主播：</div>
        <div class="zhuitem zhu1">
            <a href="javascript:void(0);" index="1" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
        <div class="zhuitem zhu2">
            <a href="javascript:void(0);" index="2" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
        <div class="zhuitem zhu3">
            <a href="javascript:void(0);" index="3" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
        <div class="zhuitem zhu4">
            <a href="javascript:void(0);" index="4" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
    </div>
    
    <div class="textbox sharebox" id="J_sharebox">
        <a class="temp" href="javascript:void(0);" id="J_tempprize"></a>
    </div>

    <div class="textbox" id="J_tobe">
        <div class="txt">声明：本活动抽奖奖品与Apple.Inc无关</div>
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
    <audio id="J_audio-1" src="./static/zhubo/1.mp3" preload="auto" autoplay="autoplay"></audio>
    <audio id="J_audio-2" src="./static/zhubo/2.mp3" preload="auto" autoplay="autoplay"></audio>
    <audio id="J_audio-3" src="./static/zhubo/3.mp3" preload="auto" autoplay="autoplay"></audio>
    <audio id="J_audio-4" src="./static/zhubo/4.mp3" preload="auto" autoplay="autoplay"></audio>
</div>

<script type="text/javascript">
(function(){
    var dPlayer = document.getElementById('J_jplayer'),
    audios = dPlayer.getElementsByTagName('audio');
    for(var i=0,l=audios.length; i<l; i++){
        audios[i].addEventListener('canplay', function(){
            this.pause();
        }, false);
    }
}());
</script>

<script type="text/javascript" src="./static/js/zepto-1.1.6.min.js?t=12"></script>
<script type="text/javascript" src="./static/js/utils.js?t=123"></script>

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
        './static/images/toy2.png',
        './static/images/zhubo1.png',
        './static/images/zhubo2.png',
        './static/images/zhubo3.png',
        './static/images/zhubo4.png'
    ];

    var _initPage = function(){
        if(!_resourceLoaded || !_requestComplete){
            return ;
        }
        $topdesc.addAnim('swing', 1600).done(function(){

        });

        $('#J_loadingbox').hide();
        $('#J_mainbox').show();
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

    $('#J_act2').on('click', function(){
        bemeObject.showAlert('活动一已经结束了，赶紧去参加活动二的奥斯卡评选，359元新品小熊等你拿！', null, {hidecancel:true});
    });

    var url = 'http://dev.h5.bemetoy.com/app/m2/active/',
        uid = 1,
        votearr=[];
    
    var queryList = function(){
        return $.ajax({
            url : url+'queryUser',
            data : {
                uid : uid
            },
            cache : false,
            dataType : 'json',
            timeout : 8000,
            xhrFields : {"withCredentials":true},
            success : function(data){
                _requestComplete = true;
                _initPage();

                votearr = data.data.vote;
                if(votearr){
                    $.each(votearr, function(i, info){
                        $('#J_zhubobox .zhu'+info.id+' .votenum span').text(info.vote_num);
                    });
                }

                data = data.data;
                if(!data.user || !data.user.anchors_id){
                    return ;
                }

                _setAnsw(data.user.anchors_id, data.user.ips_id, data.user.song_name, votearr);

                var shared = localStorage.getItem('_songday_act'+today),
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

            error : function(e){
                bemeObject.showAlert('网络请求出错啦，点击确认重新加载！', function(isok){
                    location.reload();
                }, {hidecancel:true});
            }
        });
    };

    $('#J_zhubobox .btnplay').on('click', function(){
        var $this = $(this),
            index = $this.attr('index'),
            $icon = $this.find('.icon');
        var isplay = $icon.hasClass('playing'),
            curaudio = $('#J_audio-'+index)[0];

        $('#J_jplayer audio').each(function(i, audio){
            audio.currentTime=0;
            audio.pause();
        });
        $('#J_zhubobox .btnplay').each(function(i, btn){
            $(btn).find('.icon').removeClass('playing');
        });
        
        if(isplay){
            $icon.removeClass('playing');
            curaudio.pause();
        }else{
            $icon.addClass('playing');
            curaudio.play();
        }
        return false;
    });

    $('#J_jplayer audio').on('ended', function(){
        this.pause();
        $('#J_zhubobox .btnplay .icon').removeClass('playing');
    });

    $('#J_tempprize').on('click', function(){
        return bemeObject.showAlert('活动从3月28日到4月3日，连续7天火热进行，赶紧下载贝美时光说参加吧！', null, {hidecancel:true});
    });
    
    queryList();
    bemeObject.checkPageEnv('#J_mainbox');
});

</script>

</body>
</html>
