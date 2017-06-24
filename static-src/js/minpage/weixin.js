/* global define, $, BEME*/
define('minpage/weixin', ['jweixin', 'comm/utils', 'comm/url', 'comm/request','helper/app', 'helper/playerbar', 'require', 'exports'],
    function(wx, mUtils, mUrl, mRequest, mApp, mPlayerbar, require, exports){
        "use strict";

        var _songList = {};


        var shareConfig = {
            title : "这里是标题",
            desc : '这里是描述语言', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        };

        var _renderInfo = function(jdata){
            var $box = $('#J_album-box');
            $box.find('.img-cover').attr('imgsrc', mUtils.imageUrl(jdata.url));
            shareConfig.desc = jdata.description;
            shareConfig.imgUrl = mUtils.imageUrl(jdata.url);
            $box.find('.desc').text(jdata.description);
            _queryInfo(jdata.type,jdata.album_id);
        };
		
		var _showAlbum = function(jdata){
			var html = '';
			var $box = $('#J_album-box');
			$box.find('.title').text(jdata.album.name);
			shareConfig.title = jdata.album.name;
			shareConfig.desc = jdata.album.description;
            shareConfig.imgUrl = jdata.album.url;
			$box.find('.img-cover').attr('src', mUtils.imageUrl(jdata.album.url));
			$box.find('.desc').text(jdata.album.description);
			if(jdata.tags){
				$.each(jdata.tags, function(i, tag){
					var color = mUtils.getRandColor();
					html += '<li style="color:'+ color+';border-color:'+ color+'">'+tag['name']+'</li>';
				});
				$box.find('.tags').html(html);
			}	
			$box.show();
			$('#J_topic-box').hide();
			html = mUtils.template('J_temp-item', {list:jdata.songs});
			$('#J_song-box').html(html);

			$.each(jdata.songs, function(i, info){
				_songList[info.id] = info;
			});	
		};
		
		var _showTopic = function(jdata){
			var html = '';
			var $box = $('#J_topic-box');
			$box.find('.img-cover').attr('src', mUtils.imageUrlStationHead(jdata.topic.cover));
			$box.find('.title').text(jdata.topic.name);
			shareConfig.title = jdata.topic.name;
			shareConfig.desc = jdata.topic.description;
			shareConfig.imgUrl =jdata.topic.cover;
			$('#J_album-box').hide();
			$('#J_topic-box').show();
			html = mUtils.template('J_temp-item', {list:jdata.songs});
			$('#J_song-box').html(html);

			$.each(jdata.songs, function(i, info){
				_songList[info.id] = info;
			});
		};
		
		var _showStation = function(jdata){
			var html = '';
			var $box = $('#J_topic-box');
			$box.find('.img-cover').attr('src', mUtils.imageUrlStationHead(jdata.station.url));
			$box.find('.title').text(jdata.station.name);
			$('#J_album-box').hide();
			$('#J_topic-box').show();
			shareConfig.title = jdata.station.name;
			shareConfig.desc = jdata.station.description;
			shareConfig.imgUrl = jdata.station.url;
			var cutArr =jdata.radios.slice(0,8);
			html = mUtils.template('J_temp-item', {list:cutArr});
			$('#J_song-box').html(html);
			
			$.each(cutArr, function(i, info){
				_songList[info.id] = info;
			});
		};
		
		var _showSong = function(jdata,type){
			$('.weixin-page').hide();
			var $box = $('.song-page');
			if(type == 'album'){
				$box.find('.image').attr('src',jdata.image);
			}else{
				$box.find('.image').hide();
				$box.find('.header-image').css('background-image',"url("+jdata.image+")");
				$box.find('.header-image').show();
			}

			$box.find('.name').text(jdata.name);
			shareConfig.title = jdata.name;
			shareConfig.desc = jdata.description;
			shareConfig.imgUrl = mUtils.imageUrl(mUtils.imageUrlStationHead(jdata.image));
			var $this = $box.find(' .play');
            mPlayerbar.initWeixinSongPlay($this, jdata);
			$box.show();
		}

        var _renderAlbum = function(type,jdata,album_type){
			var html = '';
			switch(type){
				case 'album':
					_showAlbum(jdata);break;
				case 'topic':
					_showTopic(jdata);break;
				case 'station':
					_showStation(jdata);break;	
				case 'song':
					_showSong(jdata,album_type);break;	
			}
			exports.getWeixinConfig(shareConfig);
        };
		
		
		exports.getWeixinConfig =function(shareConfig) {
			var url = window.location.href; 
			 mRequest.getRequest({
				url : BEME.APIURL+'/weixin/getWeixinConfig',
				data:{
						url:url,				
				},
				successfn : function(jdata){
					_weiXinInit(jdata,shareConfig)
				}
			});
		};
		
		var _weiXinInit = function(jdata,shareConfig){
			wx.config({
				debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId: jdata.data.appid, // 必填，公众号的唯一标识
				timestamp: jdata.data.time, // 必填，生成签名的时间戳
				nonceStr: jdata.data.nonce, // 必填，生成签名的随机串
				signature: jdata.data.sign,// 必填，签名，见附录1
				jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});

            wx.ready(function(){
                wx.onMenuShareTimeline(shareConfig);
                wx.onMenuShareAppMessage(shareConfig);
                wx.onMenuShareQQ(shareConfig);
                wx.onMenuShareWeibo(shareConfig);
                wx.onMenuShareQZone(shareConfig);
            });
            wx.error(function(res){
                //alert(res);
            });
		}

        //请求一些业务数据
        var _queryInfo = function(id,type,album_type,albumid){
			if(!type){
				return;
			}
			var url = '';
			switch(type){
				case 'album':
					url =  BEME.APIURL+'/albums/albumList';break;
				case 'topic':
					url =  BEME.APIURL+'/albums/topicList';break;
				case 'station':
					url =  BEME.APIURL+'/station/radiolist';break;	
				case 'song':
					url =  BEME.APIURL+'/weixin/getWeixinSongPage';break;	
				case 'radio':
					url =  BEME.APIURL+'/weixin/getWeixinSongPage';break;	
			}
			if(url == '')
			{
				return;
			}
			 mRequest.getRequest({
				url : url,
				data:{
						id:id,
						type:type,
						album_type:album_type,
						album_id:albumid		
				},
				successfn : function(jdata){
					mApp.loaded();

					if(jdata.code===0){
						_renderAlbum(type,jdata.data,album_type);
					}
					else{
					}
				}
			});

        };
		
        //初始化一些点击事件
        var _initEvent = function(albumid){
            $('#J_album-desc').on('click', function(){
                var $this = $(this);
                if($this.attr('block')){
                    $this.css('display', '-webkit-box');
                    $this.attr('block', null);
                }else{
                    $this.css('display', 'block');
                    $this.attr('block', 1);
                }
            });

            $('#J_song-box').on('click', '.item', function(){
                var $this = $(this),
                    sid = $this.attr('sid');
                mPlayerbar.initWeixinPlayer($this, _songList[+sid]);
            });
			
			$('.song-page ').on('click','.play-cover',function(){
				var $this = $(this);
				if($this.hasClass('pause')){
					$('#J_jplayer-weixin-song .btn-song').click();
					$this.removeClass('pause');
					$this.attr('src',"./static/images/zanting.png");
				}else{
					$('#J_jplayer-weixin-song .btn-song').click();
					$this.addClass('pause');
					$this.attr('src',"./static/images/bofang.png");
				}
				
			});

        };

        //初始化页面
        exports.init = function(){
            mApp.setTitle("专辑");
            var hashs = mUrl.getParams();
            mApp.showHeader();
			if(hashs.three == 1){
				$('.footer-weixin').remove();
				$('.weixin-box').remove();
			}			
            //请求数据
            _queryInfo(hashs.id,hashs.type,hashs.album_type,hashs.album_id);


            _initEvent(hashs.id);
        };


        //反初始化绑定事件
        exports.uninit = function(){
            $('#J_album-desc,.select-all, #J_song-box, #J_album-box .favorites').off('click');
        };
    });