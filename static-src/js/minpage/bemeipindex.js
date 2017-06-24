/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/bemeipindex', ['comm/utils', 'comm/url','helper/playerbar', 'comm/request', 'comm/clickevent','helper/app', 'helper/temphtml','helper/jrange', 'require', 'exports'],
    function(mUtils, mUrl,mPlayerbar, mRequest,mClick, mApp, mTemp, jrange, require, exports){
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
            var $box = $('.ip-page');
            $box.find('.banner .img-cover').attr('src', jdata.url);
           
            var ver1 = mApp.getUA(0);
            if(ver1 == 1){
                $('.main-header').show();
                $('.main-header .back-btn').show();
                $('#J_wrapper').css('padding','1.1rem 0 0 0');
                $('.sub').hide();
				$('.share_weixin').hide();
            }
			if(weixin == 1){
				  $('.sub').hide();
				  $('.share_weixin').hide();
				  $('.push-song').hide();
			}
			var ver2 = mApp.getUA(1);
			if(ver1 > 1 && ver2 > 0){
				$('.share_weixin').show();
            }

			//shareConfig.desc=jdata.description;
			shareConfig.imgUrl=jdata.url;
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

            var html = mUtils.template('J_temp-item-person', {list:jdata.planes});
            $('#person_list').html(html);

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
			var title = '';
			title = exports.changeDate(jdata[0].update_time) + '刚刚更新：' + jdata[0].sub_name;
			$('#new-title').text(title);
			$('.title-box').attr('value',jdata[0].id);
		    var html = mUtils.template('J_temp-item', {list:jdata});
            $('#J_list-box').html(html);

		};
		
        var _queryInfo = function(type,weixin){
			mRequest.getLocalRequest({
                url : BEME.APIURL+'/ip/ipClass?type='+type,
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
			
			mRequest.getLocalRequest({
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
			
        };
		
		exports.changeDate = function(date){
			var dat = new Date(date);
			var res = (dat.getMonth() + 1) + "月" + dat.getDate() + "日 ";
			return res;
		};
		
		exports.showDescriptInfo= function(conf){
			var $myBox = $('#J_random-dec');
            if($myBox.length<1){
                $(document.body).append(mTemp.myipDescription);
                $('#J_random-dec').on('click', '.close-btn', function(){
                    $('#J_random-dec, #J_body-mask').hide();
                    mApp.hideMask();
                });
            }
            else{
                var display = $('#J_body-mask').css('display');
                if(display != 'none'){
                    return;
                }
            }
			var data = ['name','en_name','feature','catchword','personal','recommend'];
			 $.each(data,function(j,key){
                 $('#'+key).text(conf[key]);
            });
            mApp.showMask();
            $myBox.show();
		};
		
		var _queryPersonal= function(id){
			mRequest.getRequest({
                url : BEME.APIURL+'/ip/personInfo?id='+id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                       exports.showDescriptInfo(jdata.data);
                    }
					else{
						//alert(1);
					}
                }
            });
		};

        var   _songEvent = function(){
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


        var  _initEvent = function(type,weixin) {
						

			
			
			$('#person_list').on('click','.item',function(){
				var id = $(this).attr('person_id');
				_queryPersonal(id);
			});
			
			$('.title-box').on('click',function(){
				var id = $(this).attr('value');
				var herf = '#!m=bemeipinfo&id='+id+'&type='+type;
				if(weixin == 1){
					herf = '#!m=bemeipinfo&weixin=1&id='+id+'&type='+type;
				}
				 window.location.href=herf;
                return false;
			});
			
			$('.share_weixin').on('click',function(){
				mClick.shareToWeixin(type,'ip','ipindex');
			});
		
        };
		

        exports.init = function(){
            mApp.setTitle("超级飞侠故事屋");
			var hashs = mUrl.getParams();
            _queryInfo(hashs.type,hashs.weixin);
			mApp.hideAllBox();
            _initEvent(hashs.type,hashs.weixin);

        };


        exports.uninit = function(){
				$('#play-music').off('click');
        };
    });