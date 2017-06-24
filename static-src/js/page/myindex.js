/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/myindex', ['comm/utils', 'comm/url', 'comm/request','comm/clickevent', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mClick, mApp, mTemp, require, exports){
        "use strict";
		var isLocal=mApp.changeAlbumLocal();
		
        var _renderInfo = function(jdata){
            $('#history_num').html(jdata.history_count);
			if(jdata.history_count == 0&&!jdata.play_list&&!jdata.collection_list&&!jdata.station_list)
			{
				$('#not-have-play').show();
				$('#have-play').hide();
				$('#addplay').hide();
				mApp.noScroll();
				return;
			}
            var html = mUtils.template('J_temp-mpitem', {list:jdata.play_list});
            if(!jdata.play_list){
                var html = '<div class="no-content">无创建的歌单</div>';
                $('#J_play_list').html(html);
                $('#J_play_list').parent().find('.right').hide();
            }else{
                $('#J_play_list').html(html);
            }
           
            if(!jdata.collection_list){
                var html = '<div class="no-content">暂无收藏的专辑</div>';
                $('#J_collection_list').html(html);
                $('#J_collection_list').parent().find('.right').hide();
            }else{
			    $.each(jdata.collection_list,function(i,album){
					album['album_id'] = album['id'];
					if(isLocal){
						album['id'] = 'javascript:void(0);';
					}else{
						album['id'] = '#!m=albuminfo&id='+ album['id'];
					}  
				});
				 html = mUtils.template('J_temp-mcitem', {list:jdata.collection_list});
                $('#J_collection_list').html(html);
				if(isLocal){
					$("#J_collection_list").on("click",'.item-a',function(){
						mClick.jumpLocalAlbum($(this));
					});
				}
            }
			
			
            if(!jdata.book_list){
                var html = '<div class="no-content">暂无收藏的绘本</div>';
                $('#J_book_list').html(html);
                $('#J_book_list').parent().find('.right').hide();
            }else{
				html = mUtils.template('J_temp-mbitem', {list:jdata.book_list});
                $('#J_book_list').html(html);
            }
			
			
           
            if(!jdata.station_list){
                var html = '<div class="no-content">您尚未订阅电台</div>';
                $('#J_description_list').html(html);
                $('#J_description_list').parent().find('.right').hide();
            }else{
				 html = mUtils.template('J_temp-msitem', {list:jdata.station_list});
                $('#J_description_list').html(html);
            }
			

            mApp.backScroll();
        };

        var _queryInfo = function(){
			var toy_id =  0;
			try{
				toy_id= window.bemetoy.getToUerid();
			}catch(e){
				toy_id = 0;
			}
            mRequest.getRequest({
                url : BEME.APIURL+'/listen/customListenList',
                type : 'post',
                data:{
                    uid:mUtils.getUid(),
					toy_id: toy_id
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
                    else{
                        $('#not-have-play').show();
                        $('#have-play').hide();
						$('#addplay').hide();
						mApp.noScroll();
                    }

                }
            });
        };

        var  _initEvent = function() {
            $('#addplay').on('click',function(){
                $('#J_newplay-box').show();
				 mApp.showMask();
                //$('#J_body-mask').show();
            });
			
			$('#create_play').on('click',function(){
				$('#J_newplay-box').show();
				 mApp.showMask();
                //$('#J_body-mask').show(); 
				$('#J_newplay-box ').find('.text').focus();
			});
			
			$('#add_myalbum').on('click',function(){
				$('#J_newplay-box').show();
				 mApp.showMask();
                //$('#J_body-mask').show(); 
				$('#J_newplay-box ').find('.text').focus();
			});
			
			 $('#J_book_list').on('click','.item-a',function(){
                var $this = $(this);
                var url = $this.attr('url');
                var type = $this.attr('type');
                var version1 = mApp.getUA(1);
                var version2 = mApp.getUA(2);
                try{

                    if(+type == 0){
                        window.location.href=url;
                    }
                    else{
                        if((version1 <= 2 || version1 == undefined)&& (version2 < 1 || version2 == undefined)){
                            window.location.href=url;
                        }
                        else{
                            window.bemetoy.webViewTouchWithUrl(url,+type);
                        }
                    }
                }
                catch(e){

                }
            });
			
            mClick.newPlayEvent();
        };

        exports.init = function(){
            mApp.setTitle("我的听听");
            $('.back-btn').show();
			mApp.showHeader();
            mUtils.headerMenu();
            $('#addplay').show();
            _queryInfo();

            _initEvent();
        };


        exports.uninit = function(){
            $('#addplay, #J_newplay-box,#J_collection_list').off('click');
        };
    });