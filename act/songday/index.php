<?php
include './inc/config.php';
global $config, $dayconfig, $imgData;

$today = isset($_GET['today']) ? $_GET['today'] : date('Y-m-d');

$todayInfo = $config[$today];
$tayIndex = $dayconfig[$today];
$url = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME']).'/';
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

<link rel="stylesheet" type="text/css" href="./static/css/style.css">
<style type="text/css">
.textover{white-space:nowrap; text-overflow:ellipsis; overflow: hidden;}
.main{position: relative; background: url('./static/images/cicle-bg1.png') repeat-y; background-size: 100% auto; display: none; padding-bottom: 0.5rem;}
.topbox{background: url('./static/images/top-bg.png') no-repeat center 0; background-size: 100% auto; height: 4.2rem; padding-top: 0.3rem;}
.topday{height: 0.7rem; margin: 0 auto; text-align: center; position: relative; z-index: 2;}
.toydesc{width: 4.6rem; margin: 0 auto; margin-top: -0.4rem; position: relative; z-index: 1; overflow: hidden;}
.toybox{width: 1.6rem; position: absolute; left: -1.6rem; top: 4rem; z-index: 10; -webkit-transition:all .5s ease-in-out;}
.toybox-in{ top: 3rem; left: 0.6rem;}
.topbtns{width: 7.2rem; height: 2.5rem; margin: 0 auto; background: url('./static/images/title-btn.png?13') no-repeat center 0; background-size: 100% auto; overflow: hidden;}
.topbtns .act2{ display: block; float: right; width:3.25rem; height: 1.5rem; background: url('./static/images/act-2.png?13') no-repeat center 0; background-size: 100% auto; margin:0.73rem 0.2rem 0 0;}
.textbox{text-align: center; font-size: 15px; line-height: 23px;}
.textbox .t{display: inline-block; background: #ff613c; color: #feed29; border-radius: 20px; padding: 2px 10px; margin: 0.5rem 0 0.2rem 0;}
.textbox span{color: #df4e0c;}
.itema{display: inline-block; background: #fed528; border:1px #cd411f solid; color: #df4e0c; border-radius: 20px; font-size: 14px; padding: 0 10px; margin: 10px 0 6px 0;}
.morebg{height: 0.8rem; margin: 8px 0 0 0;}

.musicbox{padding: 0.5rem 0 1rem 0; margin: 0.2rem 0 0.2rem 0; background:url('./static/images/cicle-bg1.png') #fce99e repeat-y 0 -5rem; font-size: 15px; position: relative;}
.musictitle{width: 6.5rem; height: 1rem; background: url('./static/images/music-icon.png') #fba13c no-repeat 10px center; background-size: auto 60%; margin: 0 auto; border:2px #cd411f solid; border-radius: 5px; overflow: hidden;}
.musictitle .txt{width: 3.1rem; line-height: 1rem; font-size: 15px; margin-left: 1rem; text-align: center; float: left;}
.musictitle .btn-push{width: 2.3rem; height: 1rem; background: url('./static/images/btn-push.png') 0 0 no-repeat; background-size: 100% 100%; float: right;}
.musicbox .t{margin: 0.4rem 0 0.2rem 0.5rem;}
.musicbox .item{width: 4.9rem; height: 0.85rem; line-height: 0.85rem; margin: 8px auto; text-align: center; background: #fffcee; -webkit-transition:all .5s ease-in-out;}
.musicbox .songsele{position: relative; padding: 0.2rem 0; overflow: hidden; -webkit-tap-highlight-color: rgba(0,0,0,0); }
.musicbox .songsele .cur{background: #fba13c;}
.musicbox .disabledsele .item{}
.musicbox .disabledsele .right{background: #8fc31f;}
.musicbox .disabledsele .wrong{background: #ff613c;}

.divgift{width: 4.5rem; height: 1.2rem; position: absolute; top: 4rem; right: 0.6rem; background: url('./static/images/gift-bg.png') no-repeat center center; background-size: 100% auto; z-index: 1000;}

.musicbox .btn{position: absolute; top: 1.5rem; left: 0.5rem; width: 0.55rem; height: 0.7rem; background: url('./static/images/sli-left.png') no-repeat center center; background-size: 100% auto; text-indent: -1000px;}
.musicbox .right-btn{ background: url('./static/images/sli-right.png') no-repeat center center; left: auto; right: 0.5rem; background-size: 100% auto;}
.submit{width: 2.5rem; height: 0.85rem; display: block; margin:0 auto; background: url('./static/images/btn-submit.png') no-repeat center center; background-size: 100% auto;}
.i-right, .i-right:hover, .i-right:active{width: 3.68rem; background: url('./static/images/i-right.png') no-repeat center center; background-size: 100% auto;  -webkit-tap-highlight-color: rgba(0,0,0,0);}
.i-wrong, .i-wrong:hover, .i-wrong:active{width: 3.68rem; background: url('./static/images/i-wrong.png') no-repeat center center; background-size: 100% auto; -webkit-tap-highlight-color: rgba(0,0,0,0);}
.i-doing, .i-doing:hover, .i-doing:active{width: 2.5rem; background: url('./static/images/i-doing.png') no-repeat center center; background-size: 100% auto; height: 0.85rem; -webkit-tap-highlight-color: rgba(0,0,0,0);}

.anim-left{-webkit-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0); opacity: 0;}
.anim-right{-webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0); opacity: 0;}

.body-tips{position:fixed; top:-1.2rem; left:0; right:0; z-index:70; height:.85rem; line-height:.85rem; text-align:center; background:#fff6e4; font-size:16px; color:#ff8698; -webkit-transition:all .5s ease-in-out;}
.tips-in{top:0}
.tips-out{top:-1.2rem}

/*弹泡*/
.body-mask{display: none; position: fixed; z-index: 9999; top: 0; left: 0; bottom: 0; right: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7);}

.alert-box{position: fixed;z-index: 10000; width: 70%; left: 10%; min-height:4rem; background: #fff; border-radius: 16px; overflow: hidden; top: 30%; padding: 0 5%; display: none;}
.alert-box .content{margin-top:1.3rem;  text-align: center;font-size:16px}
.alert-box .footer{position: absolute; bottom: 0; left: 0; right: 0; height:1rem; line-height: 1rem; margin-right: -1px; border-top: 1px #bebebe solid;}
.alert-box .footer a{display: inline-block; width: 50%; text-align: center; float: left; color: #0091ff; }
.alert-box .hidecancel .btn-ok{width: 100%; }
.alert-box .hidecancel .btn-cancel{display: none;}
.alert-box .footer .btn-ok{ font-size: 16px;border-left: 1px #bebebe solid;margin-left: -1px;}
.alert-box .footer .btn-cancel{border-bottom-right-radius: 1rem; font-size: 16px;}
.alert-box .content .title{height: 3rem; font-size: 1.8rem; line-height: 3rem; text-align: center; margin-top: 1rem;}
.alert-box .content .desc{ margin-top:1.3rem;  text-align: center;font-size:16px}
.alert-box .header{margin-top: 0.6rem;  text-align: center;  font-size: 16px;}
.alert-box .header .text{margin-top: 0.4rem; padding-left: 0.2rem; font-size: 16px;  width: 100%;  height: 0.7rem;  border-radius: 5px;border: 1px solid #acacac}

.score-tips{opacity: 0; position: fixed; right: 1rem;z-index: 70;height: 1.2rem;line-height: 0.6rem;background: url('./static/images/score.png') no-repeat center;text-align: center;font-size: 15px;color: white;bottom: 1rem;width: 1.5rem;background-size: 1.5rem auto;display: none;}
.score-tips .title{    line-height: 0.9rem;}
.score-tips .point{line-height: 0;}
.tipsscore-in{ -webkit-transition: all 0.5s ease-in-out; bottom: 1.1rem;}
.tipsscore-out{ -webkit-transition: all 0.5s ease-in-out; bottom: 2.2rem;}
@-webkit-keyframes drop
{
    0%{ -webkit-transform: translate(0, 0); }
    100% { -webkit-transform: translate(0, -1.2rem); }
}

@-webkit-keyframes fadeIn {
    0% {opacity: 1;}
    50% {opacity: 1;}
    100% {opacity: 0;}
}

.tipsscore
{-webkit-animation-name: fadeIn,drop;
    -webkit-animation-duration: 3s;
    -webkit-animation-iteration-count: 1;
    -webkit-animation-delay: 0s;
}

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
            <img src="./static/images/top-desc.png?12" class="autow" alt="">
        </div>
    </div>

    <div class="topbtns">
        <a href="javascript:void(0);" class="act2" id="J_act2"></a>
    </div>

    <div class="divgift"></div>

    <div class="textbox">
        <div class="t">3.21-3.27（火热进行中）</div>
        <div class="txt">
            贝美君<span>每日</span>在这里放5首经典儿歌<br>
            <span>推送给玩具</span><br>
            和宝宝一起<span>猜出歌名</span><br>
            一重奖：每答对一首，奖励5贝壳！<br>
            （每天可获25贝壳）<br>
            二重奖：连续7天闯关成功，再赠送30贝壳！<br>
            （活动后统一赠出）<br><br>
            贝壳换大礼，不知道？
        </div>

        <a href="javascript:void(0);" id="J_tomyscore" class="itema">进入贝壳商城</a>
        <div class="txt">今日歌曲</div>
        <div class="morebg"><img src="./static/images/morebg.png" class="autoh"></div>
    </div>

    <div class="toybox" id="J_toybox">
        <img src="./static/images/toy.png" class="autow">
    </div>
    
    <div class="musicbox">
        <div class="musictitle">
            <div class="txt">第一首</div>
            <a href="javascript:void(0);" class="btn-push" id="J_pushsong"></a>
        </div>
        <div class="t">请选择歌名：</div>

        <div class="songsele" id="J_songsele">
            <? foreach ($todayInfo[0]['list'] as $k => $info) { ?>
                <div class="item" sval="<?=$info[0];?>"><?=$info[0].'.'.$info[1]?></div>
            <? } ?>

            <a href="javascript:void(0);" class="btn left-btn">上一首</a>
            <a href="javascript:void(0);" class="btn right-btn">下一首</a>
        </div>

        <a href="javascript:void(0);" class="submit" id="J_submit"></a>
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

 <div id="J_score-tips" class="score-tips">
    <div class="title">贝壳</div>
    <div class="point"></div>
 </div>


<div id="J_body-tips" class="body-tips textover">您尚未绑定玩具!</div>

<script type="text/javascript" src="./static/js/zepto-1.1.6.min.js?t=12"></script>
<script type="text/javascript" src="./static/js/utils.js?t=123"></script>

<script type="text/javascript">
$(document).ready(function(){
    var songConfig = <?=json_encode($todayInfo); ?>;
    var dayIndex = <?=$tayIndex; ?>,
        _requestComplete = false,
        _resourceLoaded = false;

    var $topdesc = $('#J_toydesc'),
        $toybox = $('#J_toybox'),
        imgs = [];

    imgs = [
        './static/images/top-bg.png',
        './static/images/cicle-bg1.png',
        './static/images/morebg.png',
        './static/images/title-btn.png?12',
        './static/images/act-2.png?12',
        './static/images/top-day.png',
        './static/images/top-desc.png?12',
        './static/images/toy.png',
        './static/images/sli-left.png',
        './static/images/sli-right.png'
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

    var _index = 0,
        numConf = ['一', '二', '三', '四', '五'];
    $('#J_songsele').on('click', '.item', function(){
        if($('#J_songsele').hasClass('disabledsele')){
            return false;
        }
        $('#J_songsele .item').removeClass('cur');
        $(this).addClass('cur');
    }).on('click', '.btn', function(){
        if($(this).hasClass('right-btn')){
            _index += 1;
        }else{
            _index -= 1;
        }
        if(_index<0){
            _index += songConfig.length;
        }else{
            _index = _index % songConfig.length;
        }

        $('#J_songsele .item').each(function(i){
            var isOut = false;
            $(this).addAnim(i%2 ? 'anim-left' : 'anim-right').done(function(){
                if(isOut) return ;
                isOut = true;

                var info = songConfig[_index];
                $('.musictitle .txt').text('第'+numConf[_index]+'首');
                $('#J_songsele .item').each(function(i){
                    var $this = $(this);
                    $this.text(info.list[i][0]+'.'+info.list[i][1]).attr('sval', info.list[i][0]);
                    $this.removeClass(i%2 ? 'anim-left' : 'anim-right');
                });

                _setAnsw(_index);
            });
        });
    });

    var _isAlert = false,
        _timer = 0;

    var _checkOver = function(autoslide){
        if(_isAlert){
            return false;
        }

        var has = false;
        $.each(songConfig, function(i, info){
            has = has || (!info._rightansw);
            if(has){
                return false;
            }
        });
        if(has){return false;}

        var msg = '今天的题目已经回答完毕咯，欢迎明天继续闯关！';
        if(dayIndex==7){
            msg = '今天的题目回答完毕，第一场活动结束了，欢迎明天继续参加第二场~';
        }

        _isAlert = true;

        _timer = setTimeout(function(){
            bemeObject.showAlert(msg, function(isok){
                this.close();
            }, {hidecancel:true});
        }, 1000);
        return true;
    };

    var _setAnsw = function(index, autoslide){
        if(autoslide){
            var isover = _checkOver(autoslide);
            if(!isover){
                clearTimeout(_timer);
                _timer = setTimeout(function(){
                    $('#J_songsele .right-btn').click();
                }, 1000);
            }
        }

        var info = songConfig[index];
        $('#J_songsele .item').removeClass('right wrong cur');
        $('#J_submit').removeClass('i-right i-wrong i-doing');
        if(info._rightansw){
            $('#J_songsele').addClass('disabledsele');

            $('#J_songsele .item[sval='+info._rightansw+']').addClass('right');
            if(info._rightansw != info._useransw){
                if(info._useransw){
                    $('#J_songsele .item[sval='+info._useransw+']').addClass('wrong');
                }
                $('#J_submit').addClass('i-wrong');
            }else{
                $('#J_submit').addClass('i-right');
            }
        }else{
            $('#J_songsele').removeClass('disabledsele');
            $('#J_songsele .item').removeClass('right wrong cur');
            $('#J_submit').removeClass('i-wrong i-right i-doing');
        }
    };

    var url = 'http://h5.bemetoy.com/app/m2/active/',
        uid = 23;
    var queryAn = function(sid, sval){
        $('#J_submit').addClass('i-doing');
        $.ajax({
            url : url+'checkAnswer',
            data : {
                answ : sval,
                quest : (dayIndex-1)*5 + sid, 
                uid : uid
            },
            dataType : 'json',
            xhrFields : {"withCredentials":true},
            success : function(data){
                if(!data.data){
                    return bemeObject.showAlert(data.message, function(isok){
                        this.close();
                    }, {hidecancel:true});
                }
                songConfig[sid-1]._rightansw = data.data.rightansw;
                songConfig[sid-1]._useransw = data.data.useransw;
                
                _setAnsw(sid-1, true);
                //bemeObject.musicAddScore();
            },

            complete : function(){
                $('#J_submit').removeClass('i-doing');
            }
        });
    };

    var queryList = function(){
        return $.ajax({
            url : url+'getAnswerList',
            data : {
                uid : uid
            },
            cache : false,
            dataType : 'json',
			timeout : 3000,
            xhrFields : {"withCredentials":true},
            success : function(data){
                _requestComplete = true;
                _initPage();

                if(!data.data){
                    return ;
                }

                var conf = {};
                $.each(data.data, function(i, info){
                    conf[+info.quest] = info;
                });

                $.each(songConfig, function(i, info){
                    var _i = (dayIndex-1)*5 + i + 1,
                        _x = conf[_i];
                    if(_x){
                        info._rightansw = _x.rightansw;
                        info._useransw = _x.useransw;
                    }
                });
                _setAnsw(0);
            },

            error : function(){
                bemeObject.showAlert('网络请求出错啦，点击确认重新加载！', function(isok){
                    location.reload();
                }, {hidecancel:true});
            }
        });
    };

    $('#J_submit').on('click', function(){
        if($('#J_songsele').hasClass('disabledsele')){
            return false;
        }

        if($(this).hasClass('i-doing')){
            return false;
        }

        var $curitem = $('#J_songsele .cur');
        if($curitem.length<1){
            return bemeObject.showAlert('请选择歌名', null, {hidecancel:true});
        }

        var uinfo = bemeObject.getUid();
        if(uinfo.from<1){
            bemeObject.showAlert('请下载贝美时光说app参加活动哦！', false, {hidecancel:true});
            return;
        }

        //用户选择的答案
        var sval = $curitem.attr('sval');
        queryAn(_index+1, sval);
    });

    $('#J_pushsong').on('click', function(){
        var uinfo = bemeObject.getUid();
        if(uinfo.from<1){
            bemeObject.showAlert('请下载贝美时光说app参加活动哦！', false, {hidecancel:true});
            return;
        }

        var info = songConfig[_index];
        var data = {
            'url' : 'http://'+location.host+location.pathname+info.mp3,
            'md5' : info.md5,
            'type' : 0,
            'tag' : 'album',
            'tagval': '1',
            'size': info.size.toString()
        }
        console.log(data);
        bemeObject.playMusic(data);
        return false;
    });

    $('#J_tomyscore').on('click', function(){
        try{
            window.bemetoy.showMyScore(1);
        }catch(e){
            bemeObject.showAlert('请下载贝美时光说app参加活动哦！', false, {hidecancel:true});
        }   
    });

    $('#J_act2').on('click', function(){
        bemeObject.showAlert('活动二尚未开始，领取价值359新品小熊，28号约定你哦！', null, {hidecancel:true});
    });

    queryList();
    bemeObject.checkPageEnv('#J_mainbox');
});

</script>

</body>
</html>