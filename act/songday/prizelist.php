<?php
include './inc/config2.php';
global $toyconfig, $prizeconfig, $prizedesc;
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
.list-body{padding: 0.4rem;}
.desc{font-size: 16px;color: #df4e0c;}
.desc-box a{display: inline-block; margin-top: 0.3rem; font-size: 16px; color: #df4e0c; text-decoration: underline; display: none;}
.desc-sub{font-size:13px; margin-top: 0.3rem; text-align: center;}
.time{font-size: 16px;color: #df4e0c;    line-height: 0.8rem;}
.prize-list{margin-top:0.5rem;}
.prize-list li{border-bottom: 1px solid #fff;}
.prize-list li:last-child{border:none;}
.prize-list li img{height:1.2rem;}
.prize-list li span{ font-size: 14px;margin-left: 0.2rem;line-height: 1.6rem;}

.addressbox{font-size: 14px; line-height: 0.6rem; display: none;}
.addressbox .hdesc{}
.addressinp{background: #fda54f; font-size: 15px; border:0; width: 5.5rem; height: 2.1rem; padding: 0.6rem; color: #fff; border-radius: 0.6rem;}
.addressbox .fdesc{text-align: center;}
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

<div class="main list-body" id="J_mainbox">
    <div class="contentbox" id="J_contentbox">
        <div class="desc-box">
            <div class="desc">恭喜你获得以下礼品，活动进行到4月3日，每天都可以抽奖，再接再厉哦！</div>
            <div class="desc-sub">活动结束后将发放礼品，新品运动熊将在5月前送出<br>
                <a href="javascript:void(0);" id="J_editaddr" >修改地址</a>
            </div>
        </div>

        <div class="prize-list">
            <ul id="prize-list">
                <li style="font-size:15px; text-align:center; line-height:2rem;">还没有中奖物品</li>
            </ul>
        </div>
    </div>
    
    <div class="addressbox" id="J_addressbox">
        <div class="hdesc">请填写您的详细收件信息，活动结束后将为您送出：</div>
        <textarea name="addressinp" class="addressinp" id="J_addressinp" cols="30" rows="10"></textarea>
        <div class="fdesc">
            请填写收件人姓名、手机号以及详细住址
        </div>

        <div class="submitbox">
            <a href="javascript:void(0);" class="submit" id="J_submit"></a>
        </div>
    </div>
</div>


<script type="text/javascript" src="./static/js/zepto-1.1.6.min.js?t=12"></script>
<script type="text/javascript" src="./static/js/utils.js?t=123"></script>

<script type="text/javascript">
$(document).ready(function(){
    var config = <?=json_encode($prizeconfig); ?>,
        descconfig = <?=json_encode($prizedesc); ?>,
        realConf = {1:1, 3:1, 5:1, 7:1};
    var imgConfig = [
        './static/images/bear4.jpg',
        './static/images/beike.jpg',
        './static/images/pencil.jpg',
        './static/images/beike.jpg',
        './static/images/yachi.jpg',
        './static/images/beike.jpg',
        './static/images/draw.jpg',
        './static/images/beike.jpg',
    ];

    var today = "<?=$today; ?>",
        _requestComplete = false,
        _resourceLoaded = false;

    var imgs = [];
    imgs = [
        './static/images/pencil.jpg',
        './static/images/draw.jpg',
        './static/images/bear4.jpg',
        './static/images/beike.jpg',
        './static/images/yachi.jpg'
    ];

    var _initPage = function(){
        if(!_resourceLoaded || !_requestComplete){
            return ;
        }

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

    var changeDate = function(date){
        return date.substr(5, 2)+'月'+date.substr(8, 2)+'日';
        var dat = new Date(date);
        var res = (dat.getMonth() + 1) + "月" + dat.getDate() + "日 ";
        return res;
    };

    $('#J_act2').on('click', function(){
        bemeObject.showAlert('活动一已经结束了，赶紧去参加活动二的奥斯卡评选，359元新品小熊等你拿！', null, {hidecancel:true});
    });

    var renderPrizeList = function(data){
        var html = '',
            isReal = false,
            todayReal = false;

        if(!data){
            return [false, false];
        }
        for(var l=data.length-1; l>-1; l--){
            var da = data[l];
            html +='<li><div class="time">抽奖时间：'+changeDate(da.create_time)+'</div>';
            html +='<div><img src="'+imgConfig[+da.prize_num-1]+'">';
            html += '<span>抽到'+descconfig[+da.prize_num-1]+'</span></div>';
            html += '</li>';

            isReal = isReal || realConf[+da.prize_num];
            todayReal = todayReal || realConf[+da.prize_num] && da.create_time.substr(0, 10)==today;
        }
        $('#prize-list').html(html);
        return [isReal, todayReal];
    };

    var url = 'http://dev.h5.bemetoy.com/app/m2/active/',
        uid = 220374,
		test = 0,
        loading = false;

    var queryAn = function(val){
        $('#J_submit').addClass('i-doing');
		var sessionid=bemeObject.getCookie('session_id'); 
		if(!sessionid){
			try{
				uid = window.bemetoy.getFromUerid();
				test = 1;
			}
			catch(e){
				
			}
		}
        $.ajax({
            url : url+'submitAddress',
            data : {
                addr  : val,
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
                
                $('#J_contentbox').show();
                $('#J_addressbox').hide();
            },

            complete : function(){
                $('#J_submit').removeClass('i-doing');
            }
        });
    };


    var queryList = function(){
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
            url : url+'prizeList',
            data : {
                uid : uid,
				test:test
            },
            cache : false,
            dataType : 'json',
            timeout : 8000,
			type: "post",
            xhrFields : {"withCredentials":true},
            success : function(data){
                _requestComplete = true;
                _initPage();

                var reinfo = [false, false];
                if(data.code == 0){
                    reinfo = renderPrizeList(data.data.list);
                }

                if(reinfo[1] && !data.data.address){
                    $('#J_contentbox').hide();
                    $('#J_addressbox').show();
                }else{
                    $('#J_addressinp').val(data.data.address||'');
                }

                if(reinfo[0]){
                    $('#J_editaddr').show();
                }
            },

            error : function(){
                bemeObject.showAlert('网络请求出错啦，点击确认重新加载！', function(isok){
                    location.reload();
                }, {hidecancel:true});
            }
        });
    };

    $('#J_submit').on('click', function(){
        if($(this).hasClass('i-doing')){
            return false;
        }

        var $inp = $('#J_addressinp'),
            val = $.trim($inp.val());
        if(!val){
            return bemeObject.showAlert('填写的联系信息不能为空', function(){
                $inp.focus();
                this.close();
            }, {hidecancel:true});
        }

        //用户选择的答案
        queryAn(val);
    });

    $('#J_editaddr').on('click', function(){
        $('#J_contentbox').hide();
        $('#J_addressbox').show();
    });

    queryList();
});

</script>

</body>
</html>
