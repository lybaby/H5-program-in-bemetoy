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
div{font-size:15px;line-height: 0.5rem;text-align:center;}
.album_list{    padding: 2%;border: 1px solid #e5e5e5;margin: 2% 2%;width: 90%;display: inline-block;background: #fffef5;}
.album_list .album_link .album_img{   height: 1.5rem;float: left;}
.album_list .name{font-size: 16px;color: black;margin-left: 2.3rem;  line-height: 0.8rem;  text-align: left;}
.album_list .tags{margin-left: 2.3rem;margin-top: 0.2rem;line-height: 0;}
.album_list .tags li{float: left;margin: 0 .08rem;margin-bottom: .1rem;margin-right: .1rem;height: .4rem;line-height: .4rem;padding: 0 .08rem;border: 1px red solid;border-radius: 3px;text-align: center;}
.album_list .album_link{    display: inline-block;width: 100%;background: url('./static/images/grow_jiantou.png') right center;background-repeat: no-repeat;background-size: 0.2rem;-webkit-tap-highlight-color: rgba(0,0,0,0.1);}
.album_list_name,.grow-page .song_list_name{font-size: 16px;text-indent: 0.2rem;background: #f0edea;height: 0.8rem; line-height: 0.8rem;    margin-top: 0.3rem;}
.play-video{    padding: 0.3rem 5%;}
video{width:100%;}
.say{font-size: 16px;color: #df4e0c;}
.fm{margin: 0.3rem 0;}
.header{    font-size: 20px;margin: 0.5rem;color: #df4e0c;font-weight:bolder;}
.desc{padding:0.3rem 2%;text-align:left;text-indent:0.7rem;}
.pic{display: inline-block;width: 96%;}
.pic img{    width: 2rem;float: left;}
.pic .name{font-size:18px;line-height:1rem;}
.pic .sub_name{font-size:16px;}
</style>

<script type="text/javascript">
    var resizeBody = function(){
        var docEl = document.documentElement;
        docEl.style.fontSize = docEl.clientWidth/7.5+'px';
    };
    resizeBody();
</script>
</head>
<body style="background: #facace;">

<div class="main" style="display:block;" >
	<div class="header">贝美最佳人气主播奖</div>
	<div class="pic">
		<img src="./static/images/zhubo.png">
		<div>
			<div class="name" >贝美君</div>
			<div class="sub_name">——《贝美节日小广播》主播</div>
		</div>
	</div>
	<div class="desc">毕业于深圳大学播音主持系，五年的主持配音经历，两年的儿童动画片配音经验，曾经参与多部国产动画的配音，《巴拉巴拉小魔仙》、《机械战甲》等等，喜马拉雅主播，现任深圳电台主持人</div>
	<div>
		<div class="say">听听贝美君获奖感言：</div>
		<div class="play-video">
				<video src="./static/images/shiping.mp4" controls="controls" poster="./static/images/shipin2.png"></video>
		</div>
	</div>
    <div class="fm">
		<div class="say">围观贝美君主播电台~</div>
		<div class="album_list">
			<a class="album_link" href="http://test.h5.bemetoy.com/m2/#!m=fminfo&id=19">
				<img class="album_img" src=" http://s.bemetoy.com/img/ec/ec7a5f59a86cba5d4c7e6ef7d1c1336b.jpg">
				<div class="name">贝美君节日小广播</div>
				<div class="tags" style="text-align:left;color:black;">
					主播：贝美君
				</div>
			</a>
		</div>
	</div>
</div>



<div id="J_body-tips" class="body-tips textover">您尚未绑定玩具!</div>

<script type="text/javascript" src="./static/js/zepto-1.1.6.min.js?t=12"></script>
<script type="text/javascript" src="./static/js/utils.js?t=123"></script>

<script type="text/javascript">
$(document).ready(function(){
 
});

</script>

<div style="display:none">
<script src="http://s95.cnzz.com/z_stat.php?id=1257010428&web_id=1257010428" language="JavaScript"></script>
</div>

</body>
</html>
