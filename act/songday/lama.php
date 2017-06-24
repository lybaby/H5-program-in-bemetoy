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
	<style>
	.bannerbox{}
	.auto-img{width:100%;height:100%;}
	.sub-banner{display:-webkit-inline-box;    width: 100%;text-align: center;}
	.sub-banner div{width:33.3%;}
	.sub-banner img{height:2rem;width:auto;}
	.sub-banner .img1{    position: absolute;left: 0.8rem;}
	.sub-banner .img3{    position: absolute;right: 0.9rem;}
	.textbox .t_t{fontSize:18px;margin-top:0.5rem;}
	.textbox .t{margin:0.2rem 0 0.5rem 0;}
	.prize-list {width: 100%;text-align: center;}
	.prize-list div{    width: 41%;float: left;margin: 4%;}
	.prize-list div:nth-child(odd){margin: 4% 3% 4% 6%;}
	.prize-list div:nth-child(even){margin: 4% 6% 4% 3%;}
	.prize-list img{width:100%;}
	.prizebox{overflow: hidden; width: 6.2rem; height: 6.2rem; margin: 0.5rem auto 0.5rem auto; position: relative;}
	.prizebg{-webkit-transform:rotate(0); position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('./static/lama/zhuanpan3.png') no-repeat center center; background-size: 100% 100%;}
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


	.zhubolist .zhuitem{background:#fcf0be;border-radius: 20px;height:6.1rem;}
	.zhubolist .newitem{background:#fcf0be;border-radius: 20px;height:6.1rem;}
	.zhubolist .zhuitem	.zhubo-item{display:inline-block;margin:0.3rem 0.2rem;}
	.zhubo-item .image-zhubo{width: 3rem;float: left;margin-right: 0.2rem;}
	.zhubolist .name{font-size:16px;    line-height:0.7rem;}
	.zhubolist .desc{font-size:14px;}
	.zhubo-item .name{text-align:center;}
	.zhubo-item .fm-name{    font-size: 12px;line-height: 0.8rem;color: #e67e4c;text-align:center;}
	.zhubolist .iplist{    width: 7.1rem;margin: 0 auto 0.3rem auto;position: relative;background: #fcf0be;border-radius: 20px;height:4.8rem;} 
	.zhubolist .votebox .hasvoted{background-image:url('./static/lama/yitou.png')}
	.iplist .katong-item{display:inline-block;margin:0.3rem 0.2rem;}
	.katong-item .image-ip{width: 2.1rem;float: left;margin-right: 0.2rem;}
	.listen{font-size:16px;margin-left:0.2rem;}
	.beme-desc{    margin: 0.2rem 0.3rem;font-size: 16px; border-radius: 10px;border: 1px dashed #fc6244; padding: 0.1rem;text-indent: 0.6rem; display:none;}
	.show_w{display:none;}
	</style>
</head>
<body>

<div class="loading-box" id="J_loadingbox">
    <div class='uil-ripple-css' style='transform:scale(0.2);'><div></div><div></div></div>
    <div class="text">loading：<span>0%</span></div>
</div>

<div class="main" id="J_mainbox">
    <div class="bannerbox">
            <img src="./static/lama/banner.jpg" class="auto-img" alt="">
    </div>

	<div class="sub-banner" id="J_banner">
		<div><img src="./static/lama/xiong.png" class="img1"></div>
		<div><img src="./static/lama/jieshao.png?12"></div>
		<div><img src="./static/lama/shouji.png" class="img3"></div>
	
	</div>


    <div class="textbox" id="J_rulebox">
		<div class="t_t">回答以下问题即可抽奖</div>
        <div class="t">贝美时光说、辣妈帮邀请亲们一起评选</div>
    </div>
	
	
	<div class="textbox sharebox" id="J_sharebox">
        <div class="t" style="margin-bottom:0;">投票成功!</div>
		<div class="t_t" style="margin-top:0.2rem;">恭喜您获得一次抽奖机会</div>
		<div class="prizebox" id="J_prizebox">
			<div class="prizebg"></div>
			<a href="javascript:void(0);" class="btn-prize">
				<img src="./static/images/btn-prize.png">
			</a>
		</div>
    </div>

    <div class="textbox prizedbox" id="J_prizedbox">
        <div class="t" style="margin-bottom:0.2rem;" id="prize-name">恭喜你获得了&nbsp; <span style="color:#feed29"></span></div>
		<div class="text show_w">请填写所需信息，活动结束后将为您送出！</div>
        <div class="text" id="prize-title">更多活动请在贝美时光说参加哦！</div>
        <div class="btn-list" style="margin-bottom:0;">
            <a href="http://ad.lmbang.com/Business-Thirdservice?url=http://dev.h5.bemetoy.com/m2/act/songday/prizelama.php" class="btn-history left" style="margin-bottom:0;" ></a>
        </div>
    </div>

    <div class="toybox" id="J_toybox">
        <img src="./static/images/toy.png" class="autow">
    </div>
	
	<div></div>

    <div class="zhubolist" id="J_zhubobox">
        <div class="zhutitle">一、宝宝最喜欢哪位贝美主播：</div>
        <div class="zhuitem newitem" >
			<div class="zhubo-item">
				<img src="./static/lama/1.png" class="image-zhubo" >
				<div class="name">贝美君—陈若林</div>
				<div class="fm-name">《贝美君节日小广播》主播</div>
				<div class="desc"> 每到节日，“贝美君”会为小朋友们介绍节日小知识。为什么“福”字要倒着贴？听了就知道~</div>
			</div>
			<div class="listen">听听他的代表作：</div>
            <a href="javascript:void(0);" index="1" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum num_1">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
        <div class="zhuitem newitem">
			<div class="zhubo-item">
				<img src="./static/lama/2.png" class="image-zhubo" >
				<div class="name">猫头鹰博士—娄枕岳</div>
				<div class="fm-name">《十亿个为什么》主播</div>
				<div class="desc"> 猫头鹰博士为小朋友们解答了身边的百科知识，让小朋友们能够在轻松快乐的环境中学习到知识。</div>
			</div>
			<div class="listen">听听他的代表作：</div>
            <a href="javascript:void(0);" index="2" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum num_2">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
        <div class="zhuitem newitem">
			<div class="zhubo-item">
				<img src="./static/lama/3.png" class="image-zhubo" >
				<div class="name">袋鼠妈妈—刘佳</div>
				<div class="fm-name">《危险来了我不怕》主播</div>
				<div class="desc"> 袋鼠妈妈通过有趣的童话故事教会儿童如何保护自己，树立儿童安全自我保护意识。</div>
			</div>
			<div class="listen">听听她的代表作：</div>
            <a href="javascript:void(0);" index="3" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum num_3">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
        <div class="zhuitem newitem">
			<div class="zhubo-item">
				<img src="./static/lama/4.png" class="image-zhubo" >
				<div class="name">小葵姐姐—郑海音</div>
				<div class="fm-name">《贝美幼乐园》主播</div>
				<div class="desc">小葵姐姐每周在贝美时光说跟小朋友们分享有趣的故事以及益智知识，小朋友们千万不要错过哟。</div>
			</div>
			<div class="listen">听听她的代表作：</div>
            <a href="javascript:void(0);" index="4" class="btnplay">
                <div class="icon"></div>
            </a>
            <div class="votebox">
                <div class="votenum num_4">票数&nbsp; <span>--</span></div>
                <a href="javascript:void(0);" class="btnvote">请选择:</a>
            </div>
        </div>
    </div>


    <div class=" zhubolist" id="J_stoybox">
        <div class="zhutitle">二、贝美卡通形象秀：</div>
		<div class="zhuitem iplist">
			<div class="katong-item">
				<img src="./static/lama/bo1.png" class="image-ip" >
				<div class="name">超级飞侠</div>
				<div class="desc"> 乐迪，每天和伙伴们环游世界，为小朋友解决困难！快跟随乐迪的见识绚丽多彩的地球吧！</div>
			</div>
			<div class="listen">听听她的代表作：</div>
			<a href="javascript:void(0);" index="5" class="btnplay">
				<div class="icon"></div>
			</a>
			<div class="votebox">
				<div class="votenum num_5">票数&nbsp; <span>--</span></div>
				<a href="javascript:void(0);" class="btnvote">请选择:</a>
			</div>
		</div>
		<div class="zhuitem iplist">
			<div class="katong-item">
				<img src="./static/lama/bo3.png" class="image-ip" >
				<div class="name">粉红猪小妹</div>
				<div class="desc">漂亮的粉红猪佩佩，和家人快乐的在一起，脑子里许多稀奇主意，每次都给大家带来惊喜！</div>
			</div>
			<div class="listen">听听她的代表作：</div>
			<a href="javascript:void(0);" index="6" class="btnplay">
				<div class="icon"></div>
			</a>
			<div class="votebox">
				<div class="votenum num_6">票数&nbsp; <span>--</span></div>
				<a href="javascript:void(0);" class="btnvote">请选择:</a>
			</div>
		</div>
		<div class="zhuitem iplist">
			<div class="katong-item">
				<img src="./static/lama/bo2.png" class="image-ip" >
				<div class="name">小囧熊英文乐园</div>
				<div class="desc">酷爱波波糖的小囧熊，和小伙伴们生活在盛产奶油土豆的小岛上，经历着一系列有趣的事情…</div>
			</div>
			<div class="listen">听听她的代表作：</div>
			<a href="javascript:void(0);" index="7" class="btnplay">
				<div class="icon"></div>
			</a>
			<div class="votebox">
				<div class="votenum num_7">票数&nbsp; <span>--</span></div>
				<a href="javascript:void(0);" class="btnvote">请选择:</a>
			</div>
		</div>
		<div class="zhuitem iplist">
			<div class="katong-item">
				<img src="./static/lama/bo4.png" class="image-ip" >
				<div class="name">巴拉拉小魔仙</div>
				<div class="desc">爱、友情和勇气是世上最珍贵的东西，快来看小魔仙用它们来重建音乐魔法世界的故事吧！</div>
			</div>
			<div class="listen">听听她的代表作：</div>
			<a href="javascript:void(0);" index="8" class="btnplay">
				<div class="icon"></div>
			</a>
			<div class="votebox">
				<div class="votenum num_8">票数&nbsp; <span>--</span></div>
				<a href="javascript:void(0);" class="btnvote">请选择:</a>
			</div>
		</div>
		<div class="zhuitem iplist">
			<div class="katong-item">
				<img src="./static/lama/bo5.png" class="image-ip" >
				<div class="name">托马斯和他的朋友们</div>
				<div class="desc">乐于助人的火车头托马斯，和朋友们每天热情勤奋的工作着，在不断发生的趣事中认识到友爱和公平的重要性。</div>
			</div>
			<div class="listen">听听她的代表作：</div>
			<a href="javascript:void(0);" index="9" class="btnplay">
				<div class="icon"></div>
			</a>
			<div class="votebox">
				<div class="votenum num_9">票数&nbsp; <span>--</span></div>
				<a href="javascript:void(0);" class="btnvote">请选择:</a>
			</div>
		</div>
		
    </div>

    <div class="submitbox">
        <a href="javascript:void(0);" class="submit" id="J_submit"></a>
    </div>
	
	<div id="J_prize_desc">
		<div class="textbox prize-select">
			<div class="t_t">提交成功后即可开始抽奖</div>
			
			 <div class="prizebox" id="J_prizebox_no">
				<div class="prizebg"></div>
				<a href="javascript:void(0);" class="btn-prize">
					<img src="./static/images/btn-prize.png">
				</a>
			</div>
			<div class="t">贝壳可在贝美时光说商城兑换礼品</div>
		</div>
		
		<div class="prize-list">
			<div><img src="./static/lama/01.png"></div>
			<div><img src="./static/lama/02.png"></div>
			<div><img src="./static/lama/03.png"></div>
			<div><img src="./static/lama/04.png"></div>
			<div><img src="./static/lama/05.png"></div>
			<div><img src="./static/lama/06.png"></div>
		</div>
	
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

<div id="J_jplayer" style="display:none;">
    <audio id="J_audio-1" src="./static/lama_m/chuxi_1.mp3" preload="none" ></audio>
    <audio id="J_audio-2" src="./static/lama_m/weishenme_2.mp3" preload="none" ></audio>
    <audio id="J_audio-3" src="./static/lama_m/weixian_3.mp3" preload="none" ></audio>
    <audio id="J_audio-4" src="./static/lama_m/youleyuan_4.mp3" preload="none" ></audio>
	<audio id="J_audio-5" src="./static/lama_m/feixia_5.mp3" preload="none" ></audio>
    <audio id="J_audio-6" src="./static/lama_m/zhuxiaomei_6.mp3" preload="none" ></audio>
    <audio id="J_audio-7" src="./static/lama_m/xiaojiongxiong_7.mp3" preload="none" ></audio>
    <audio id="J_audio-8" src="./static/lama_m/moxian_8.mp3" preload="none" ></audio>
	<audio id="J_audio-9" src="./static/lama_m/tuomasi_9.mp3" preload="none" ></audio>
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
<script type="text/javascript"  src="http://st.lmbang.com/js/vendor/LmbJsBridge.js?t=12352"></script>

<script type="text/javascript">
    $(document).ready(function(){
        var today = "<?=$today; ?>",
            _requestComplete = false,
            _resourceLoaded = false,
            _prizeConfig = <?=json_encode($prizeconfig); ?>,
			_prizeTitle = <?=json_encode($prizetitle); ?>,
			_prizedesc = <?=json_encode($prizedesc); ?>;

        var $topdesc = $('#J_toydesc'),
            $toybox = $('#J_toybox'),
            imgs = [];
        imgs = [
            './static/lama/1.png',
            './static/lama/2.png',
            './static/lama/3.png?12',
            './static/lama/4.png?12',
            './static/lama/01.png',
            './static/lama/02.png',
            './static/lama/03.png?12',
            './static/lama/04.png?12',
            './static/lama/05.png',
            './static/lama/06.png',
            './static/lama/banner.jpg',
            './static/lama/bo1.png',
            './static/lama/bo2.jpg',
            './static/lama/bo3.png',
            './static/lama/bo4.jpg',
            './static/lama/bo5.png',
            './static/lama/zhuanpan3.png',
            './static/lama/shouji.png',
            './static/lama/xiong.png'
        ];

        var _initPage = function(){
            if(!_resourceLoaded || !_requestComplete){
                return ;
            }

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


        $('.zhuitem .btnvote').on('click', function(){
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


    var url = 'http://dev.h5.bemetoy.com/app/m2/active/',
		lamarul=' http://ad.lmbang.com/Business-Thirdservice?url=',
        uid =bemeObject.getUrlParam('enuid'),
            votearr=[],
            userInfo = {};
        var queryAn = function(ips, person){
            $('#J_submit').addClass('i-doing');
            $.ajax({
                url : url+'submitLama',
                data : {
                    ip  : ips,
                    person : person,     
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

                    $(window).scrollTop(0);

                    _setAnsw(person, ips);
                    bemeObject.showAlert('投票成功！可以开始抽奖咯~', function(isok){
                        this.close();
                    }, {hidecancel:true});
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
                _ips = ips.split(',');

            var $btnvotes = $('#J_zhubobox .btnvote');
            $btnvotes.hide();
            $.each(_anchors, function(i, index){
                $btnvotes.eq(+index-1).addClass('btnvoted hasvoted').show();
            });

            var $stoybox = $('#J_stoybox').addClass('toyselected');
            var $items = $stoybox.find('.btnvote').hide();
            $.each(_ips, function(i, index){
                $items.eq(+index-5).addClass('btnvoted hasvoted').show();
            });

            $('#J_submit, #J_rulebox').hide();
            $('#J_sharebox').show();
			$('#J_prize_desc').hide();
        };

        var queryList = function(){
            return $.ajax({
                url : url+'queryLamaUser',
                data : {
                    uid : uid
                },
				type:'post',
                cache : false,
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
							$('.zhuitem .num_'+(i+1)+' span').text(info.vote_num);                         
                        });
                    }

                    data = data.data;
                    if(!data.user || !data.user.anchors_id){
                        return ;
                    }

                    _setAnsw(data.user.anchors_id, data.user.ips_id, data.user.song_name, votearr);

                    var uinfo = bemeObject.getUid();
                    var  prizeid = +data.user.isChecked;            
                    if(prizeid){
                        $('#prize-name span').text(_prizedesc[prizeid-1]);
						$('#prize-title').text(_prizeTitle[prizeid-1]);
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
		
		var isPrized = false,loading = false;
		
		var queryPrize = function(){
			if(loading){
				return;
			}
			loading = true;
			if(isPrized){
				return;
				return bemeObject.showAlert('您已经抽取过奖品了！', function(isok){
					this.close();
				}, {hidecancel:true});
			}
			return $.ajax({
				url : url+'userLamaPrize',
				data : {
					uid : uid
				},
				type:'post',
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
					if(!_prizeConfig[index]){
						return bemeObject.showAlert('接口返回错误：'+index, null, {hidecancel:true});
					}

					doAnimPrize(index, _prizeConfig, function(){
						bemeObject.showAlert('抽到了：'+_prizedesc[index], function(isok){
							location.replace("http://ad.lmbang.com/Business-Thirdservice?url=http://dev.h5.bemetoy.com/m2/act/songday/prizelama.php");
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

        $('#J_submit').on('click', function(){
            if($(this).hasClass('i-doing')){
                return false;
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

            var $toyboxs = $('#J_stoybox .btnvote'),
                toys = [];
            $toyboxs.each(function(i, btn){
                if($(btn).hasClass('btnvoted')){
                    toys.push(i+5);
                }
            });
            if(toys.length<1){
                return bemeObject.showAlert('您还没给卡通角色投票哦！', null, {hidecancel:true});
            }
            //用户选择的答案
            queryAn(toys.join(','), zhubovotes.join(','));
        });


        $('.zhubolist .btnplay').on('click', function(){
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
            $('.zhubolist .btnplay').each(function(i, btn){
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

        $('#J_prizebox_no').on('click', function(){
                return bemeObject.showAlert('请先提交投票结果，然后即可开始抽奖！', null, {hidecancel:true});      
        });
		
		$('#J_prizebox .btn-prize').on('click', function(){
			queryPrize();
		});

        queryList();

        $('#J_jplayer audio').on('ended', function(){
            this.pause();
            $('#J_zhubobox .btnplay .icon').removeClass('playing');
        });
		
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
		//LmbJsBridge.onShare(datalama);
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
