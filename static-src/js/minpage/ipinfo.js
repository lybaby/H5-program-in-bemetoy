/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/ipinfo', ['comm/utils', 'comm/url', 'comm/swipe', 'helper/playerbar','comm/clickevent','comm/request', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl,mSwipe,mPlayerbar, mClick,mRequest, mApp, mTemp, require, exports){
        "use strict";
		var _songList = {},
			_dataList ={},
			_playList={},
			isNew = mApp.changePlayList();
        var shareConfig = {
            title : "贝美童趣馆",
            desc : '超级飞侠故事屋', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        };
		var weixin = 0,
			id=0,
			page=1,
			_currentTab=0,
			height= 0,
			is_loading=false;

        var _renderInfo = function(jdata){
            var ver1 = mApp.getUA(0);
			var $box = $('.animinfo-page');
            mApp.setTitle(jdata.name);
			var ver2 = mApp.getUA(1);
			if(ver1 > 1 && ver2 > 0){
				$('.share_weixin').show();
            }
			if(weixin == 1){
				  $('.share_weixin').hide();
				  $('.push-song').hide();
			}
		    $box.find('.play-video').html(jdata.video_url);
            $box.find('.play-video').find('video').attr('poster',jdata.url);
			if(jdata.question){
				$box.find('#question').text(jdata.question);
				$box.find('#answer').text('答案是：'+jdata.answer);	
			}else{
				$box.find('.guidebox').hide();
			}

			var title = '';
            title = '第'+jdata.sequence+'期：'+ jdata.name;
            var date = mApp.changeDate(jdata.update_time) + '更新';
            $('#new-title').text(title);
            $('#new-day').text(date);
			
			shareConfig.imgUrl = jdata.url;
			
			if(weixin == 1){
				var html = mUtils.template('J_temp-item-song', {list:jdata.song});
			    $('#play-music').html(html);
				var $this = $box.find(' .music-list');
                mPlayerbar.initIpIndexPlay($this, jdata.song[0],2);
                $('.push-bear-song').hide();
            }
            else{
				if(isNew){
				   var html =  BEME.template(mTemp.ipTempHtml, {list:jdata.song});
				   $('#play-music').css('background','white');
				   $('#play-music').html(html);
				   _dataList = mApp.getSongJson(jdata.song,jdata.url,jdata.name);
			   }
			   else{
					var html = mUtils.template('J_temp-item-song', {list:jdata.song});
					$('#play-music').html(html);
					var $this = $box.find(' .music-list');
					mPlayerbar.initIpIndexPlay($this, jdata.song[0],4);
			   }	
            }

			
			jdata.tag.splice(0, 0, {id:0, name:'全部分类'});
            html = mUtils.template('J_temp-tag', {list:jdata.tag});
            $('#J_cate-box').html(html);
            $('#J_top-box').Swipe({
                continuous:false,
                callback: function(pos){
                    $('#J_cate-box .menu-list').eq(pos).find('.item-a').eq(0).click();
                }
            });
			$('#J_cate-box .menu-list').eq(0).find('li').eq(0).addClass('cur');
			

			_renderList(jdata.iplist);

			
			if(weixin == 1){
                var weixin = require(['minpage/weixin'],function(context){
					context.getWeixinConfig(shareConfig);
				});
			}

            _songSingleEvent();
            mApp.backScroll();
            mApp.stopVideoMusic();
        };


        var _queryInfo = function(id,weixin){

			mRequest.getRequest({
                url : BEME.APIURL+'/ip/getIpInfo?id='+id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                      _renderInfo(jdata.data);
                    }
					else{
						//alert(1);
					}
                }
            });
        };
		
		var _queryTagInfo = function(cateid,page){
			 is_loading= true;
            mRequest.getRequest({
                url : BEME.APIURL+'/ip/getIpTagList',
				data:{
					id:cateid,
					page:page,
					idlist:id
				},
                successfn : function(jdata){

                    if(jdata.code===0){
                        _renderList(jdata.data,weixin);
                    }
                    else{
                        $('#J_song-box').html('');
                        $('#J_songnum').text('0');
                    }
					is_loading = false;
                }
            });
        };
		
		var _renderList = function(data){
			 $.each(data,function(i,ip){
                if(weixin == 1){
                    ip['id'] = ip['id'] + '&weixin=1';
                }
            });

            var html = mUtils.template('J_temp-list', {list:data});
            $('#J_video-list').append(html);
		};
		
		var _songSingleEvent = function(){
            if(isNew){
                $('#play-music').on('click','.newTitle',function(){
                    mClick.audition_new(_dataList,this);
                });

                $('#play-music').on('click','.newPush',function(){
                    mClick.pushSong($(this))
                });
            }else{
                $('#play-music').on('click','.music-list .push-bear-song',function(){
                    mClick.pushSong($(this));
                });
            }
        };


        var  _initEvent = function(id) {
            $('#J_iplist_desc').on('click', function(){
                var $this = $(this);
                if($this.attr('block')){
                    $this.css('display', '-webkit-box');
                    $this.attr('block', null);
                }else{
                    $this.css('display', 'block');
                    $this.attr('block', 1);
                }
            });
			
			 $('#J_cate-box').on('click', '.item-a', function(){
                var $this = $(this),
                    id = $this.data('id');
                _queryTagInfo(id,1);
				_currentTab = id ;
				page = 1;
				height=0;
				$('#J_video-list').html('');
                $('#J_cate-box li').removeClass('cur');
                $this.parent().addClass('cur');
            });
			
			$("#show_family").on("click",function(){
				if($('.toysinfo').hasClass('hide-all')){
					$('.toysinfo').removeClass('hide-all');
					$(this).addClass('hide-more-block');
				}else{
					$('.toysinfo').addClass('hide-all');
					$(this).removeClass('hide-more-block');
				}
				
			});
			
			$(".guidebox .a-btn").on('click',function(){
				if($('#answer').hasClass("hide-all")){
					$('#answer').removeClass("hide-all");
					$(this).text("点击收起");
				}else{
					$('#answer').addClass("hide-all");
					$(this).text("点击看答案");
				}
			});
			

			
			if(weixin == 1){
                $('#song-list-box').on('click', '.item', function(){
                    var $this = $(this),
                        sid = $this.attr('sid');
                    mPlayerbar.initWeixinPlayer($this, _songList[+sid]);
                });
            }

			$(".btn-hide").on("click",function(){
				$('.toysinfo').addClass('hide-all');
			});
			
			window.onscroll = function(){
                var top = document.body.scrollTop;
                var clientHeight = document.body.clientHeight;
                var scrollHeight = document.body.scrollHeight;
                if( scrollHeight - (top+clientHeight)  < 30 && height <scrollHeight && !is_loading){
                    page = page +1;
                    height = scrollHeight;
                    _queryTagInfo(_currentTab,page);           
                }
            };


			
        };

        exports.init = function(){
            mApp.setTitle("早教动画");
			var hashs = mUrl.getParams();
            _queryInfo(hashs.id,hashs.weixin);
			weixin = hashs.weixin;
			id = hashs.id;
			mApp.hideAllBox();
            _initEvent(hashs.id);
        };


        exports.uninit = function(){
        };
    });