/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/bememikainfo', ['comm/utils', 'comm/url','helper/playerbar','minpage/bemeipindex', 'comm/request' ,'comm/clickevent','helper/temphtml','helper/app','require', 'exports'],
    function(mUtils, mUrl,mPlayerbar,mBeme, mRequest,mClick,mTemp, mApp, require, exports){
        "use strict";

		var _songList = {},
		_dataList={},
		isNew=mApp.changePlayList();
		var shareConfig = {
            title : "贝美童趣馆",
            desc : '米卡分龄教育', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        };

        var _renderInfo = function(jdata,weixin){
            var $box = $('.mika-info-page');
            var html = mUtils.template('J_temp-mika-song', {list:jdata.song});
            $('#play-music').html(html);
            var ver1 = mApp.getUA(0);
            if(ver1 == 1){
                $('.main-header').show();
                $('.main-header .back-btn').show();
                $('#J_wrapper').css('padding','1.1rem 0 0 0');
                $('.sub').hide();
            }
			if(weixin == 1){
				  $('.share_weixin').hide();
				  $('.push-song').hide();
			}
			var ver2 = mApp.getUA(1);
            if(ver1 > 1 && ver2 > 0){
                $('.share_weixin').show();
            }

			$box.find('.problem').html(jdata.question);
			$box.find('.answer').html(jdata.answer);
			var title = '';
			title = '第'+jdata.sequence+'期：'+ jdata.sub_name;
			var date = mBeme.changeDate(jdata.update_time) + '更新';
			$('#new-title').text(title);
			$('#new-day').text(date);
			
			//shareConfig.title = jdata.name;
			shareConfig.desc = "《米卡分龄教育》"+jdata.name;
			shareConfig.imgUrl = jdata.url;
			
			 if(weixin == 1){
				var html = mUtils.template('J_temp-mika-song', {list:jdata.song});
			    $('#play-music').html(html);
				var $this = $box.find(' .music-list');
                mPlayerbar.initIpIndexPlay($this, jdata.song[0],3);
               $('.push-mika-song').hide();
            }
            else{
				if(isNew){
				   var html =  BEME.template(mTemp.ipTempHtml, {list:jdata.song});
				   $('#play-music').html(html);
				   _dataList = mApp.getSongJson(jdata.song,jdata.url,jdata.sub_name);
			   }
			   else{
					var html = mUtils.template('J_temp-mika-song', {list:jdata.song});
					$('#play-music').html(html);
					var $this = $box.find(' .music-list');
					 mPlayerbar.initIpIndexPlay($this, jdata.song[0],5);
			   }	
            }
			
			

            if(weixin == 1){
                var weixin = require(['minpage/weixin'],function(context){
                    context.getWeixinConfig(shareConfig);
                });
            }
			$box.find('.play-video').html(jdata.video_url);
            $box.find('.play-video').find('video').attr('poster',jdata.url);
			//mApp.getWeixinConfig(shareConfig);
            _songEvent();
            mApp.backScroll();
            mApp.stopVideoMusic();
        };
		
		var _renderList = function(jdata,id,weixin,isShow){
			 $.each(jdata.list,function(i,ip){
                ip['content'] = '第' + ip.sequence + '期：'+ip.sub_name;
                ip['question'] =  exports.changeDate(ip.update_time);
                if(weixin == 1){
                    ip['id'] = ip['id'] + '&weixin=1';
                }
            });
            _rendListBox(jdata.list,weixin);
            var num = parseInt(jdata.count/10);
            var num_a = jdata.count%10;
            var html = '';
            for(var i=0; i < num;i++){
                if(i%3 == 0){
                    html += '<li><a  style="margin:0;" value='+(i+1)+' type=3>第'+i+'1-'+(i+1)+'0期</a></li>';
                }
                else if(i%3 == 1){
                    html += '<li style="margin: 0 5%;"><a style="margin:0;" value='+(i+1)+' type=3>第'+i+'1-'+(i+1)+'0期</a></li>';
                }
                else{
                    html += '<li><a  style="margin:0;" value='+(i+1)+' type=3>第'+i+'1-'+(i+1)+'0期</a></li>';
                }
            }
            if(num_a == 2){
                html += '<li style="margin:0 5%;"><a style="margin:0;" value='+(i+1)+' type=3>第'+(num*10+1)+'-'+jdata.count+'期</a></li>';
            }else if(num_a == 1){
                html += '<li><a style="margin:0;" value='+(i+1)+' type=3>第'+(num*10+1)+'-'+jdata.count+'期</a></li>';
            }

            $('.page-list').html(html);

            $('.page-list li').on('click',function(){
                var page = $(this).find('a').attr('value');
                var type = $(this).find('a').attr('type');
                $(this).parent().find('a').removeClass('selected');
                $(this).find('a').addClass('selected');
                _queryPage(type,page,weixin);
            });
		};
		
		var _rendListBox =  function(jdata,weixin){
            $.each(jdata,function(i,ip){
                ip['content'] = '第' + ip.sequence + '期：'+ip.sub_name+"（" +ip.classify_name +"）";
                ip['question'] =  exports.changeDate(ip.update_time);
                if(weixin == 1){
                    ip['id'] = ip['id'] + '&weixin=1';
                }
            });
            var html = mUtils.template('J_temp-item', {list:jdata});
            $('#J_list-box').html(html);
        };
		
        exports.changeDate = function(date){
            var dat = new Date(date);
            var res = (dat.getMonth() + 1) + "月" + dat.getDate() + "日 ";
            return res;
        };
		
		var _queryPage = function(type,page,weixin){
            mRequest.getRequest({
                url : BEME.APIURL+'/ip/mikaPage',
                data:{
                    type:type,
                    page:page,
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _rendListBox(jdata.data.list.reverse(),weixin);
                    }
                    else{
                        //alert(1);
                    }
                }
            });
        };
		
		
        var _queryInfo = function(id,type,weixin){
			mRequest.getRequest({
                url : BEME.APIURL+'/ip/mikaPage',
				data:{
					page:0
				},
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderList(jdata.data,id,weixin,false);
                    }
					else{
						//alert(1);
					}
                }
            });
			
			mRequest.getRequest({
                url : BEME.APIURL+'/ip/mikaInfo?id='+id,
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
			
		
			
			if(weixin == 1){
				$('.back-index').attr('href','#!m=bememikaindex&weixin=1&type='+type);
			}else{
				$('.back-index').attr('href','#!m=bememikaindex&type='+type);
			}
			
        };
		
		
		
		
			
		var _getAllPage = function(isShow){
			mRequest.getRequest({
                url : BEME.APIURL+'/ip/ipList',
				data:{
					type:type,
				},
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderList(jdata.data,type,weixin,true);
                    }
					else{
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
                    mClick.pushSong($(this));
                });
            }else{
                $('#play-music').on('click','.music-list .push-mika-song',function(){
                    mClick.pushSong($(this));
                });

            }
        };
		
        var  _initEvent = function(id,weixin) {

			
			window.onscroll = function(){
                var played_top = $('.title-box').offset().top;
                var waiting_top = $('#bear-song-list').offset().top;
                var scroll_height = $(window).scrollTop();
                if(waiting_top - scroll_height < played_top){
               //     $('#bear-song-list').addClass('push-bear-fixed');
                }else{
                 //    $('#bear-song-list').removeClass('push-bear-fixed');
                }   
            };
			
			
			
			
			
			$('.share_weixin').on('click',function(){
				mClick.shareToWeixin(id,'ip','ipinfo',3);
			});
			
			$('.bear-table').on('click','td',function(){
				var herf = $(this).attr('href');
				 window.location.href=herf;
				// window.location.reload();
				return ;
			});

        };

        exports.init = function(){
            mApp.setTitle("米卡分龄教育");
			var hashs = mUrl.getParams();
            _queryInfo(hashs.id,hashs.type,hashs.weixin);
			mApp.hideAllBox();
            _initEvent(hashs.id,hashs.weixin);

        };


        exports.uninit = function(){
				$('#play-music').off('click');
				window.onscroll = null;
        };
    });