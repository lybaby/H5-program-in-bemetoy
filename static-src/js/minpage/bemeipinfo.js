/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/bemeipinfo', ['comm/utils', 'comm/url', 'comm/clickevent', 'helper/playerbar','minpage/bemeipindex', 'comm/request', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl,mClick,mPlayerbar, mBeme,mRequest, mApp, mTemp, require, exports){
        "use strict";
		var _songList = {},
		_dataList={},
		isNew=mApp.changePlayList();
		var shareConfig = {
            title : "贝美童趣馆",
            desc : '超级飞侠故事屋', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        };
		
        var _renderInfo = function(jdata,weixin){
            var ver1 = mApp.getUA(0);
			var $box = $('.ipinfo-page');
            mApp.setTitle(jdata.name);
            if(ver1 == 1){
                $('.main-header').show();
                $('.main-header .back-btn').show();
                $('#J_wrapper').css('padding','1.1rem 0 0 0');
                $('.sub').hide();
				$('.share_weixin').hide();
            }
			var ver2 = mApp.getUA(1);
			if(ver1 > 1 && ver2 > 0){
				$('.share_weixin').show();
            }
			if(weixin == 1){
				  $('.sub').hide();
				  $('.share_weixin').hide();
				  $('.push-song').hide();
			}
		    $box.find('.img-cover').attr('src', jdata.url);
			$box.find('.sub-title').text(jdata.sub_name);
			$box.find('.description_ip').text(jdata.description);
			$box.find('.place').text(jdata.place);
			$box.find('.hello').text(jdata.place_hello);
			$box.find('.question').text(jdata.question);
			$box.find('.answer_content').text(jdata.answer);
			$box.find('.play-video').html(jdata.video_url);
			//shareConfig.title = jdata.name;
			//shareConfig.desc = jdata.description;
			shareConfig.imgUrl = jdata.url;
            $box.find('.play-video').find('video').attr('poster',jdata.url);
			if(isNew && weixin != 1){
				var html =  BEME.template(mTemp.ipTempHtml, {list:jdata.song});
				 $('#play-music').html(html);
				 _dataList = mApp.getSongJson(jdata.song,jdata.url,jdata.name);
			}else{
				var html = mUtils.template('J_temp-item-song', {list:jdata.song});
				$('.play-music').html(html);
				var $this = $box.find(' .music-list');
				mPlayerbar.initIpPlay($this, jdata.song[0]);	
			}
			
			
			if(weixin == 1){
				  $('.share_weixin').hide();
				  $('.push-song').hide();
			}
			
			
			$('.sub-day').text(mBeme.changeDate(jdata.update_time)+'更新');
			
			var html = mUtils.template('J_temp-personitem', {list:jdata.planes});
			$('#J_plane-box').html(html);		
			$.each(jdata.song, function(i, info){
                _songList[info.id] = info;
            });


			
			if(weixin == 1){
                var weixin = require(['minpage/weixin'],function(context){
					context.getWeixinConfig(shareConfig);
				});
			}
			//mApp.getWeixinConfig(shareConfig);
            _songEvent();
            mApp.backScroll();
            mApp.stopVideoMusic();

        };
		
		var _renderList = function(jdata,weixin){
			$.each(jdata,function(i,ip){
               ip['content'] = '第' + ip.sequence + '集(' + ip.update_time.replace(/\-/g,'')+')：'+ip.sub_name;
			    if(weixin == 1){
				   ip['id'] = ip['id'] + '&weixin=1';
			   }
            });
		    var html = mUtils.template('J_temp-item', {list:jdata});
            $('#J_list-box_children').html(html);
			
			mApp.backScroll();
		};
		

        var _queryInfo = function(id,type,weixin){
			
			
			mRequest.getRequest({
                url : BEME.APIURL+'/ip/ipInfo?id='+id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data,weixin);
                    }
					else{
						//alert(1);
					}
                }
            });
			
			mRequest.getRequest({
                url : BEME.APIURL+'/ip/ipList?type='+type,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderList(jdata.data.list,weixin);
                    }
					else{
						//alert(1);
					}
                }
            });
			
			if(weixin == 1){
				$('.back-index').attr('href','#!m=bemeipindex&weixin=1&type='+type);
			}else{
				$('.back-index').attr('href','#!m=bemeipindex&type='+type);
			}

			
        };
		
		var _queryPersonal= function(id){
			mRequest.getRequest({
                url : BEME.APIURL+'/ip/personInfo?id='+id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                       mBeme.showDescriptInfo(jdata.data);
                    }
					else{
						//alert(1);
					}
                }
            });
		};

        var _songEvent = function(){
            if(isNew){
                $('#play-music').on('click','.newTitle',function(){
                    mClick.audition_new(_dataList,this);
                });

                $('#play-music').on('click','.newPush',function(){
                    mClick.pushSongLi($(this).parent());
                });
            }else{
                $('#play-music').on('click','.music-list .push-song',function(){
                    mClick.pushSong($(this).parent());
                });
            }
        };

        var  _initEvent = function(id) {

			
			$('#J_plane-box').on('click','.item-a',function(){
				var id = $(this).attr('person_id');
				_queryPersonal(id);
			});
			
			$('#J_list-box_children').on('click','.item',function(){
				var herf = $(this).find('a').attr('href_url');
				//window.open(herf);
				//document.location.href=herf;
				//window.location.href= '';
				try{
						 window.location.href=herf;
				}
				catch(e){
					alert(e);
				}

				 
				// window.location.reload(true);
				return  false;
			});
			
			
			$('.share_weixin').on('click',function(){
				mClick.shareToWeixin(id,'ip','ipinfo',1);
			});

			
        };

        exports.init = function(){
            mApp.setTitle("贝美童趣馆");
			var hashs = mUrl.getParams();
            _queryInfo(hashs.id,hashs.type,hashs.weixin);
			mApp.hideAllBox();
            _initEvent(hashs.id);

        };


        exports.uninit = function(){
			$('#play-music').off('click');
        };
    });