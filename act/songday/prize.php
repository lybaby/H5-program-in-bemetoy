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

<link rel="stylesheet" type="text/css" href="./static/css/style.css">
<link rel="stylesheet" type="text/css" href="./static/css/act2.css">
<style type="text/css">
.main{padding-bottom: 2rem;}
.prizebox{overflow: hidden; width: 6.2rem; height: 6.2rem; margin: 1rem auto 1rem auto; position: relative;}
.prizebg{-webkit-transform:rotate(0); position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('./static/images/prize-bg.png') no-repeat center center; background-size: 100% 100%;}
.btn-pointer{width: 1.7rem; height: 2.4rem; background: url('./static/images/btn-prize.png') no-repeat; background-size: 100% 100%; margin: 1.6rem auto 0 auto;}
.btn-prize{position: relative; display: block; width: 1.7rem; height: 1.7rem; margin: 2.3rem auto 0 auto; }
.btn-prize img{width: 100%; margin-top: -0.7rem;}
.prize-anim{ -webkit-transition:all 5s ease-in-out;}
.btnp-anim{-webkit-animation: rotatebtn 5s ease-out;}

.prizelist{width: 6.2rem; height: 4.2rem; padding-top: 1.5rem; margin: 0.6rem auto 0 auto; background: url('./static/images/prized-list-bg.png') no-repeat 0 0; background-size: 100% 100%; }
.prizelist div{height: 0.6rem; line-height: 0.6rem; font-size: 15px; margin-left: 0.4rem;}

@-webkit-keyframes rotatebtn {
    0{-webkit-transform:rotate(0);}
    15%{-webkit-transform:rotate(20deg);}
    30%{-webkit-transform:rotate(-10deg);}
    45%{-webkit-transform:rotate(15deg);}
    60%{-webkit-transform:rotate(-15deg);}
    75%{-webkit-transform:rotate(10deg);}
    90%{-webkit-transform:rotate(-10deg);}
    100%{-webkit-transform:rotate(0);}
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
            <img src="./static/images/top-desc2.png?12" class="autow" alt="">
        </div>
    </div>

    <div class="topbtns">
        <a href="javascript:void(0);" class="act2" id="J_act2"></a>
    </div>

    <div class="divgift"></div>

    <div class="textbox">
        <div class="t" style="padding:0 1rem;">恭喜完成任务！</div>
        <div class="txt">
            你有一次抽奖机会
        </div>
    </div>

    <div class="prizebox" id="J_prizebox">
        <div class="prizebg"></div>
        <a href="javascript:void(0);" class="btn-prize">
            <img src="./static/images/btn-prize.png">
        </a>
    </div>

    <div class="prizelist" id="J_prizelist">
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

<script type="text/javascript" src="./static/js/zepto-1.1.6.min.js?t=12"></script>
<script type="text/javascript" src="./static/js/utils.js?t=123"></script>

<script type="text/javascript">
$(document).ready(function(){
    var config = <?=json_encode($prizeconfig); ?>;

    var today = <?=$today; ?>,
        _requestComplete = false,
        _resourceLoaded = false;

    var imgs = [];
    imgs = [
        './static/images/btn-prize.png',
        './static/images/prize-bg.png',
        './static/images/prized-list-bg.png'
    ];

    var _initPage = function(){
        if(!_resourceLoaded || !_requestComplete){
            return ;
        }

        $('#J_loadingbox').hide();
        $('#J_mainbox').show();
    };

    $('#J_act2').on('click', function(){
        bemeObject.showAlert('活动一已经结束了，赶紧去参加活动二的奥斯卡评选，359元新品小熊等你拿！', null, {hidecancel:true});
    });

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

    var doAnimPrize = function(num, config, callback){
        num = num % config.length;
        var $bg = $('#J_prizebox .prizebg');
        $bg.removeClass('prize-anim').attr('style', '').css('zoom');

        var deg = num*(360/config.length)+1800+22;
        $bg.addAnim('prize-anim', 5000, {
            'transform' : 'rotate('+deg+'deg)',
            '-webkit-transform' : 'rotate('+deg+'deg)'
        }, 'ease-in-out').done(function(){
            //转盘结束了
            callback && callback();
        });
        
        var $this = $('#J_prizebox .btn-prize');
        if($this.hasClass('btnp-anim')){
            $this.removeClass('btnp-anim').css('zoom');
        }
        $this.addClass('btnp-anim');
    };
    
    var url = 'http://dev.h5.bemetoy.com/app/m2/active/',
        uid = 491,
		test = 0,
        isPrized = false,
        loading = false;

    var queryPrize = function(){
        if(isPrized){
            return bemeObject.showAlert('您已经抽取过奖品了！', function(isok){
                this.close();
            }, {hidecancel:true});
        }

        if(loading){
            return ;
        }

        loading = true;
		var sessionid=bemeObject.getCookie('session_id'); 
		if(!sessionid){
			try{
				uid = window.bemetoy.getFromUerid();
				test = 1;
			}
			catch(e){
				
			}
		}
        return $.ajax({
            url : url+'userPrize',
            data : {
                uid : uid,
				test:test
            },
			type: "post",
            cache : false,
            dataType : 'json',
            timeout : 3000,
            xhrFields : {"withCredentials":true},
            success : function(data){
                loading = false;
                if(!data.data){
                    return bemeObject.showAlert('出错了：'+data.message, null, {hidecancel:true});
                }

                isPrized = true;
                var index = data.data-1;
                if(!config[index]){
                    return bemeObject.showAlert('接口返回错误：'+index, null, {hidecancel:true});
                }

                doAnimPrize(index, config, function(){
                    bemeObject.showAlert('抽到了：'+config[index], function(isok){
                        location.replace("./prizelist.php");
                    }, {hidecancel:true});
                });
            },

            error : function(jqXHR, textStatus, errorThrown){
                loading = false;
                bemeObject.showAlert('请求出错，请重试:'+textStatus, function(isok){
                    location.reload();
                }, {hidecancel:true});
            }
        });
    };

    $('#J_prizebox .btn-prize').on('click', function(){
        queryPrize();
    });

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
            url : url+'isChecked',
            data : {
				uid : uid,
				test:test
            },
			type: "post",
            cache : false,
            dataType : 'json',
            timeout : 8000,
            xhrFields : {"withCredentials":true},
            success : function(data){
                _requestComplete = true;
                _initPage();

                var html = '';
                $.each(data.data.win_list, function(i, info){
                    if(i>6){
                        return true;
                    }
                    html += '<div>'+(info.phone||'110****0000').substr(0, 11)+'&nbsp;领取了'+config[+info.prize-1]+'</div>';
                });
                $('#J_prizelist').html(html);

                if(+data.data.isChecked){
                    isPrized = true;
                    return bemeObject.showAlert('您已经抽取过奖品了！', function(isok){
                        location.replace("./prizelist.php");
                    }, {hidecancel:true});
                }
            },

            error : function(jqXHR, textStatus, errorThrown){
                bemeObject.showAlert('网络请求出错啦，点击确认重新加载:'+textStatus, function(isok){
                    location.reload();
                }, {hidecancel:true});
            }
        });
    };

    queryList();
});

</script>

</body>
</html>
