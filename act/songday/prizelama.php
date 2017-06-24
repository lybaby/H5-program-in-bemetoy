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
.list-body{padding: 0.4rem; display:block;}
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
.addressbox .hdesc{    margin-bottom: 0.2rem;}
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
	<div class="textbox" >
		<div class="t" id="prize-name">恭喜你获得了<span style="color:#feed29"></span></div>
	</div>
	<div class="main list-body" id="J_mainbox">
	  

	  
		<div class="addressbox" id="J_telephonebox">
			<div class="hdesc">请您下载贝美时光说，并在以下对话框输入贝美时光说手机账号，活动结束后将为您送出</div>
			<textarea name="telephoneinp" class="addressinp" id="J_telephoneinp" cols="30" rows="10"></textarea>
			<div class="fdesc">
			  贝壳可在贝美时光说兑换奖品哦！
			</div>
		</div>
		
		<div class="addressbox" id="J_addressbox">
			<div class="hdesc">请填写您的详细收件信息，活动结束后将为您送出：<br>
				更多活动在贝美时光说参加哦！
			</div>
			<textarea name="addressinp" class="addressinp" id="J_addressinp" cols="30" rows="10"></textarea>
			<div class="fdesc">
				请填写收件人姓名、手机号以及详细住址
			</div>
		</div>
		
	   <div class="submitbox">
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

<script type="text/javascript" src="./static/js/zepto-1.1.6.min.js?t=12"></script>
<script type="text/javascript" src="./static/js/utils.js?t=123"></script>
<script type="text/javascript"  src="http://st.lmbang.com/js/vendor/LmbJsBridge.js?t=12352"></script>

<script type="text/javascript">
$(document).ready(function(){
    var _prizeConfig = <?=json_encode($prizeconfig); ?>,
        descconfig = <?=json_encode($prizedesc); ?>,
		_prizedesc = <?=json_encode($prizedesc); ?>,
		type = 0,
        realConf = {1:1, 3:1, 5:1, 7:1};

    var changeDate = function(date){
        return date.substr(5, 2)+'月'+date.substr(8, 2)+'日';
        var dat = new Date(date);
        var res = (dat.getMonth() + 1) + "月" + dat.getDate() + "日 ";
        return res;
    };



    var url = 'http://dev.h5.bemetoy.com/app/m2/active/',
        uid =bemeObject.getUrlParam('enuid'),
        loading = false;

    var queryAn = function(phone,val){
        $('#J_submit').addClass('i-doing');
        $.ajax({
            url : url+'submitLamaAddress',
            data : {
				phone:phone,
                addr  : val,
                uid : uid
            },
			type:'post',
            dataType : 'json',
            xhrFields : {"withCredentials":true},
            success : function(data){
                if(!data.data){
                    return bemeObject.showAlert(data.message, function(isok){
                        this.close();
                    }, {hidecancel:true});
                }
				return bemeObject.showAlert('提交成功', function(isok){
						history.go(-1);
                        this.close();
				}, {hidecancel:true});
            },

            complete : function(){
                $('#J_submit').removeClass('i-doing');
            }
        });
    };


    var queryList = function(){
        return $.ajax({
            url : url+'prizeLamaList',
            data : {
                uid : uid
            },
            cache : false,
			type:'post',
            dataType : 'json',
            timeout : 8000,
            xhrFields : {"withCredentials":true},
            success : function(data){
                _requestComplete = true;
                var reinfo = [false, false];
                if(data.code == 0){
					$('#prize-name span').text(_prizedesc[data.data.prize_num-1]);
                   if(data.data.prize_num%2 != 0 && data.data.prize_num != 5){
					   $('#J_addressbox').show();
					   type = 1;
					   if(data.data.address){
						    $('#J_addressinp').val(data.data.address||'');
					   }
				   }
				   else{
					   type = 2;
					    $('#J_telephonebox').show();
					   if(data.data.lama_phone){
						    $('#J_telephoneinp').val(data.data.lama_phone||'');
					   }
				   }
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
		var val,phone;
		if(type == 1){
			var $inp = $('#J_addressinp');
            val = $.trim($inp.val());
			 if(!val){
				return bemeObject.showAlert('填写的联系信息不能为空', function(){
					$inp.focus();
					this.close();
				}, {hidecancel:true});
			}
		}else{
			var $inp = $('#J_telephoneinp');
            phone = $.trim($inp.val());
			 if(!phone){
				return bemeObject.showAlert('填写的手机号码不能为空', function(){
					$inp.focus();
					this.close();
				}, {hidecancel:true});
			}
		}

       
        //用户选择的答案
        queryAn(phone,val);
    });

    $('#J_editaddr').on('click', function(){
        $('#J_contentbox').hide();
        $('#J_addressbox').show();
    });

    queryList();
	
	var dataweixin = {
		'title': '贝美时光说儿歌节',
		'id': 1,
		'share_type': 'QQF,WCHATF,WCHATFQ,SINA',
		'link': 'http://dev.h5.bemetoy.com/m2/act/songday/lama.php',
		'content':'我正在辣妈帮参加贝美首届儿歌节，领取359元互联网玩具，一起来参加吧！',
		'img':'http://dev.h5.bemetoy.com/m2/act/songday/static/lama/banner.jpg'
	};
	var datalama = {
		'title': '贝美时光说儿歌节',
		'id': 1,
		'share_type': 'LMBQ,LMBF',
		'link': 'http://dev.h5.bemetoy.com/m2/act/songday/lama.php',
		'content':'我正在辣妈帮参加贝美首届儿歌节，领取359元互联网玩具，一起来参加吧！',
		'img':'http://dev.h5.bemetoy.com/m2/act/songday/static/lama/banner.jpg'
	};
	LmbJsBridge.init();
	LmbJsBridge.onShare(dataweixin);
});

</script>

<div style="display:none">
<script src="http://s95.cnzz.com/z_stat.php?id=1257010428&web_id=1257010428" language="JavaScript"></script>
</div>

</body>
</html>
