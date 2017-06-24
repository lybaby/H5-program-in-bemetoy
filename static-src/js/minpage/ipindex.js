/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/ipindex', ['comm/utils', 'comm/url', 'comm/swipe', 'comm/request', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl,mSwipe,mRequest, mApp, require, exports){
        "use strict";
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
			var $box = $('.animation-page');
            mApp.setTitle(jdata.name);
			var ver2 = mApp.getUA(1);
			if(ver1 > 1 && ver2 > 0){
				$('.share_weixin').show();
            }
			if(weixin == 1){
				  $('.share_weixin').hide();
				  $('.push-song').hide();
			}
		    $box.find('#J_banner_img').attr('src', jdata.url);
			$box.find('#J_iplist_desc').text(jdata.description);
            $box.find('.family_name').text(jdata.sub_name);
			if(jdata.person.length >=3 ){
				$box.find('#preson_1').attr('src', jdata.person[0].url);
				$box.find('#preson_2').attr('src', jdata.person[1].url);
				$box.find('#preson_3').attr('src', jdata.person[2].url);
			}else{
				$box.find('.img').hide();
				$.each(jdata.person,function(i,per){
					$box.find('#preson_'+(i+1)).attr('src', jdata.person[i].url);
					$box.find('#preson_'+(i+1)).parent().show();
				});
			}


			shareConfig.imgUrl = jdata.url;

			var html = mUtils.template('J_temp-person', {list:jdata.person});
			$('#J_preson-box').prepend(html);

			
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

            mApp.backScroll();
        };


        var _queryInfo = function(id,weixin){

			mRequest.getRequest({
                url : BEME.APIURL+'/ip/getIpList?id='+id,
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
            mApp.setTitle("贝美童趣馆");
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