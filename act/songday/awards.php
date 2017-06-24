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
li{list-style: none;;}
.main{padding-bottom: 2rem;}
.topbox{    background: url('./static/images/banner_02.jpg') no-repeat center 0;background-size: 100% auto;height: 4.2rem;padding-top: 0.3rem;    padding-bottom: 0.5rem;}
div{font-size:14px;line-height: 0.5rem;text-align:center;color:black;}
.bear_pirze,.bear_pirze,.fm_pirze,.ip_prize,.song_prize{   text-align: center;}
.title{padding: 0.4rem 0 0.2rem 0;line-height: 0.6rem;}
.title a{font-size: 16px;line-height: 0.45rem;height: 0.45rem;display: inline-block;border-radius: 10px;background: #fde5e7;padding: 0 0.2rem;color: #df4e0c;}
.list{    display: inline-block;width: 100%;font-size:15px;}
.list img{    vertical-align: top; width: 2rem;float: left;margin: 0 0.2rem;    border-radius: 10px;}
.list ul{    display: inline-block;width: 4.9rem;background: #fff;margin-right: 0.2rem;}
.list li{float:left; width:50%;    line-height: 0.5rem;height: 0.5rem;}
.drop_title{font-size:16px;text-align:center;}
.sub_title{font-size:14px;padding: 0 0.2rem;}
.ip_prize ul{    padding: 0.2rem 0;}
.ip_prize li{display: inline-block;margin-bottom: 0.5rem;}
.ip_prize img{    width: 2rem;float: left;margin: 0 0.2rem;}
.ip_prize .right-desc{    font-size: 14px;margin: 0 0.2rem;line-height: 0.5rem;}
.ip_prize .name{    font-size: 17px;color: #df4e0c;line-height: 0.6rem;}
.desc{font-size: 14px;text-align:left;}
.go_fm{    margin: 0.5rem 0;}
.go_fm img{width:auto;height:1rem;}
.music_div{position: relative;height: 2rem;}
.music_div .title{
	color: #fd8925;
    line-height: 0.8rem;
    background: none;
    text-align: center;
    font-size: 16px;
	padding: 0;
}
.music_div .pushsong{
	-webkit-tap-highlight-color: rgba(0,0,0,0.1);
    position: absolute;
    right: 1%;
    height: 0.85rem;
    line-height: 0.85rem;
    width: 2.05rem;
    text-align: center;
    background: #ff8903;
    font-size: 15px;
    border-radius: 0 15px 15px 0;
    color: #fff;
    border: 1px solid #ff8903;
    border-left: 0;
}
.music_div .music_info{
	height: 0.85rem;
    display: inline-block;
    border-radius: 15px 0 0 15px;
    position: absolute;
    left: 0.1rem;
    right: 2.15rem;
	border: 1px solid #fd8925;
	background: #fffef5;
}
.music_div .player-slider{
	height: 0.15rem;
    padding: 0.3rem 0 0.25rem 0;
    position: relative;
	display: block;
}
.music_div .play{    
	background: url('./static/images/bofang.png') no-repeat;
    background-size: cover;
    height: 0.55rem;
    width: 0.55rem;
    position: absolute;
    top: 0.13rem;
    left: 0.05rem;
	}
.music_div 	.pause{
	background: url('./static/images/zanting.png') no-repeat;
    background-size: cover;
}
.music_div .slider-container{    margin: 0.06rem 0 0 0.9rem;}
.music_div .back-bar{   
		height: 0.1rem;
		position: absolute;
		background: #606060;
		border-radius: 0.1rem;
		width: 80%;
		z-index: 1;
	}
.selected-bar{    position: absolute;height: 100%;background: #fd8925;border-radius: 0.1rem;z-index: 3;}
.slider-container .back-bar .pointer{position: absolute;width: 0.55rem; height: 0.55rem;border-radius: 0.55rem; background: rgba(64,194,176,0.2);z-index: 3;top: -0.15rem;}
.slider-container  .back-bar .btn-single{
	background: url('./static/images/jindu.png') no-repeat;
    background-size: 0.3rem;
    height: 0.6rem;
    width: 0.6rem;
    background-position: center;
    margin: -0.1rem 0;
	border-radius: 0.55rem;
	position: absolute;
	z-index: 3;
    top: -0.15rem;
}
.slider-container .clickable-dummy{cursor: pointer;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;}
	
.slider-container .load-bar{    height: 0.1rem;
    position: absolute;
    background: #acacac;
    border-radius: 0.1rem;
    z-index: 2;}	
.slider-container .scale{    top: 2px;
    position: relative;
    display: none;}
.pointer-label{display:none;}
.album_list{    padding: 2%;border: 1px solid #e5e5e5;margin: 2% 2%;width: 90%;display: inline-block;background: #fffef5;}
.album_list .album_link .album_img{    width:1.5rem;height: 1.5rem;float: left;}
.album_list .name{font-size: 16px;color: black;margin-left: 2rem;    text-align: left;}
.album_list .tags{margin-left: 1.9rem;margin-top: 0.2rem;}
.album_list .tags li{float: left;margin: 0 .08rem;margin-bottom: .1rem;margin-right: .1rem;height: .4rem;line-height: .4rem;padding: 0 .08rem;border: 1px red solid;border-radius: 3px;text-align: center;}
.album_list .album_link{    display: inline-block;width: 100%;background: url('./static/images/grow_jiantou.png') right center;background-repeat: no-repeat;background-size: 0.2rem;-webkit-tap-highlight-color: rgba(0,0,0,0.1);}
.album_list_name,.grow-page .song_list_name{font-size: 16px;text-indent: 0.2rem;background: #f0edea;height: 0.8rem; line-height: 0.8rem;    margin-top: 0.3rem;}
.score-tips{opacity: 0; position: fixed; right: 1rem;z-index: 70;height: 1.2rem;line-height: 0.6rem;background: url('./static/images/score.png') no-repeat center;text-align: center;font-size: 15px;color: white;bottom: 1rem;width: 1.5rem;background-size: 1.5rem auto;display: none;}
.score-tips .title{    line-height: 0.9rem;padding:0;color:white;}
.score-tips .point{line-height: 0;color:white;}
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
<body style="background: #facace;">
<div class="loading-box" id="J_loadingbox">
    <div class='uil-ripple-css' style='transform:scale(0.2);'><div></div><div></div></div>
    <div class="text">loading：<span>0%</span></div>
</div>

<div class="main" id="J_mainbox">
    <div class="topbox">
    </div>


    <div class="textbox" >
		<div style="font-size:16px;">潮爸and辣妈，小绅士and小淑女们：</div>
		<div style="font-size:16px;">欢迎来到“贝美奥斯卡”颁奖盛典</div>
    </div>

	<div class="bear_pirze">
		<div class="title"><a>噔噔噔~首先公布运动小熊获奖名单</a></div>
		<div class="list">
			<img src="./static/images/toy2.jpg">
			<div>
				<ul>
				<li>157****3157</li>
				<li>152****9807</li>
				<li>139****9864</li>
				<li>150****0650</li>
				<li>138****6672 </li>
				<li>138****0860</li>
				<li>185****0425</li>
				</ul>
			</div>
		</div>
		<div class="drop_title">恭喜以上幸运粉丝嗷~</div>
		<div class="sub_title" style="padding: 0 0.8rem;">小熊将在5月前送出，其他抽奖礼品也会陆续寄出，亲们坐等收礼物吧~</div>
	</div>

	<div  class="fm_pirze">
		<div class="title"><a>接下来颁发贝美人气主播奖</a></div>
		<div class="sub_title" >四位主播战况激烈，究竟谁能一举夺冠？<br>是你喜欢的Ta吗？</div>
		<a href="fm.php"><img src="./static/images/shipin1.png" style="width: 80%;padding: 0.1rem 0;"></a>
		<div class="drop_title">戳上图揭开TA的神秘面纱吧！</div>
	</div>
	
	<div class="ip_prize">
		<div class="title"><a>马上颁发贝美宝宝最佳拍档奖</a></div>
		<div class="sub_title" style="padding: 0 0.8rem;">给宝宝最好的陪伴，我们是“贝美宝宝好拍档”！</div>
		<div>
			<ul>
				<li>
					<a href="http://m2.bemetoy.com/#!m=bemeipindex&type=1" style="display:inline-block;">
						<img src="./static/images/01.png">
						<div class="right-desc">
							<div class="name">超级飞侠</div>
							<div class="desc">乐迪每天和伙伴们环游世界，为小朋友解决困难！快跟随乐迪见识绚丽多彩的地球吧！</div>
						</div>
					</a>
				</li>
				<li>
					<a href="http://m2.bemetoy.com/#!m=albuminfo&id=372" style="display:inline-block;">
						<img src="./static/images/02.png">
						<div class="right-desc">
							<div class="name">粉红猪小妹</div>
							<div class="desc">漂亮的粉红猪佩佩，和家人快乐的在一起，脑子里许多稀奇主意，每次都给大家带来惊喜！</div>
						</div>
					</a>
				</li>
				<li style="margin-bottom:0;">
					<a href="http://m2.bemetoy.com/#!m=bemebearindex&type=2" style="display:inline-block;">
						<img src="./static/images/03.png">
						<div class="right-desc">
							<div class="name">小囧熊</div>
							<div class="desc">酷爱波波糖的小囧熊，和小伙伴们生活在盛产奶油土豆的小岛上，经历着一系列有趣的事情…</div>
						</div>
					</a>
				</li>
			</ul>
		</div>
	</div>
	
	<div class="song_prize">
		<div class="title"><a>现在，我们要颁发贝美儿歌金曲奖：</a></div>

		<div class="music_div">
			<li class="music" sid="34485" md5="803f23d051c5de18a652cc8d176a1ff9" url="http://s.bemetoy.com/dance/80/803f23d051c5de18a652cc8d176a1ff9.mp3" tag="album" tagval="267" size="5870684" type="0">
				<div class="title">第一名：小苹果</div>
				<a class="pushsong">推送给玩具</a>
			</li>
			<li  class="music_info" id="single_1">
				<div class="player-slider">
					<a class="play"></a>
					<input class="slider" type="hidden" value="0"/>
				</div>
				<div class="player"></div>
			</li>
		</div>
		<div class="music_div">
			<li class="item" sid="34748" md5="23db0756b7c9754fbdd0d3c4492e2c7e" url="http://s.bemetoy.com/dance/23/23db0756b7c9754fbdd0d3c4492e2c7e.mp3" tag="album" tagval="289" size="2175209" type="0">
				<div class="title">第二名：三只小熊</div>
				<a class="pushsong">推送给玩具</a>
			</li>
			<li  class="music_info" id="single_2">
				<div class="player-slider">
					<a class="play"></a>
					<input class="slider" type="hidden" value="0"/>
				</div>
				<div class="player"></div>
			</li>
		</div>

		<div class="music_div">
			<li class="item" sid="35434" md5="76ddc084be0689694daaf6aa285c7b88" url="http://s.bemetoy.com/dance/76/76ddc084be0689694daaf6aa285c7b88.mp3" tag="album" tagval="349" size="1150569" type="0">
				<div class="title">第三名：世上只有妈妈好</div>
				<a class="pushsong">推送给玩具</a>
			</li>
			<li  class="music_info" id="single_3">
				<div class="player-slider">
					<a class="play"></a>
					<input class="slider" type="hidden" value="0"/>
				</div>
				<div class="player"></div>
			</li>
		</div>
		<div class="sub_title">小编还把其他高票歌曲收集了起来<br>赶紧让宝宝大饱耳福~</div>
		<div class="album_list">
			<a class="album_link" href="http://m2.bemetoy.com/#!m=albuminfo&id=402">
				<img class="album_img" src="http://s.bemetoy.com/img/f3/f38cdccb116a67c9e1a57846eff4e0d6.jpg">
				<div class="name">贝美儿歌奥斯卡</div>
				<ul class="tags">
					<li style="color:#ff8800;border-color:#ff8800">经典</li>
					<li style="color:#33b833;border-color:#33b833">活力</li>
				</ul>
			</a>
		</div>
	</div>
	<div class="say_bye">
		<div class="sub_title" style="margin-bottom:0.5rem;">首届贝美奥斯卡颁奖典礼进行到这<br>要和大家说再见啦~</div>
		<div>心仪的主播没拿奖？</div>
		<div>没事儿！</div>
		<div class="sub_title">听众对节目的喜爱就是主播们最大的快乐~<br>快来订电台阅吧！</div>
		<div class="go_fm"><a href="http://test.h5.bemetoy.com/m2/#!m=fmindex"><img src="./static/images/guangdiantai.png" ></a></div>
		<div>贝美新品没领到？</div>
		<div>别泄气！</div>
		<div>接下来贝美还有新活动，敬请关注！</div>
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

<script type="text/javascript" src="./static/js/jquery-1.11.1.min.js?t=12"></script>
<script type="text/javascript" src="./static/js/jquery.jplayer.min.js"></script>
<script type="text/javascript" src="./static/js/utils.js?t=123"></script>
<script type="text/javascript" src="./static/js/jrange.js?t=123"></script>
<script type="text/javascript" src="./static/js/playerbar.js?t=123"></script>
<script type="text/javascript">
$(document).ready(function(){
    var config = <?=json_encode($prizeconfig); ?>;

    var today = "<?=$today; ?>",
        _requestComplete = false,
        _resourceLoaded = false;

    var imgs = [];
	imgs = [
			'./static/images/banner_02.jpg',
            './static/images/toy2.jpg',
            './static/images/shipin1.png',
            './static/images/guangdiantai.png',
            './static/images/01.png',
            './static/images/02.png',
            './static/images/03.png'
        ];

    var url = 'http://h5.bemetoy.com/app/m2/active/',
        uid = 491,
        isPrized = false,
        loading = false;
	var _initPage = function(){
            if(!_resourceLoaded){
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
				if(process == 0){
					 process = 30;
				}
                return $('#J_loadingbox .text span').text(process+'%');
            }
	});	

	

    $('.song_prize .pushsong').on('click', function(){
        var $this = $(this).parent();
		var conf = ['url', 'md5', 'type', 'tag', 'tagval','size'],
			data ={};
		$.each(conf,function(i,key){
			data[key] = $this.attr(key);
		});
		var info = $.extend({}, data);
		info['bid'] = data['tagval'];
		info['fid'] =$this.attr('sid');
		 bemeObject.playMusic(data);
    });
	
	
	initSinglePlayer('single_1','http://s.bemetoy.com/dance/80/803f23d051c5de18a652cc8d176a1ff9.mp3');
	initSinglePlayer('single_2','http://s.bemetoy.com/dance/23/23db0756b7c9754fbdd0d3c4492e2c7e.mp3');
	initSinglePlayer('single_3','http://s.bemetoy.com/dance/76/76ddc084be0689694daaf6aa285c7b88.mp3');
});

</script>


</body>
</html>
