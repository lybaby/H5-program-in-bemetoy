/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/mycollection', ['comm/utils', 'comm/url', 'comm/request','comm/clickevent', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mClick, mApp, mTemp, require, exports){
        "use strict";
		var isLocal=mApp.changeAlbumLocal();
		
		
        var _renderInfo = function(jdata){
			$.each(jdata,function(i,album){
				album['album_id'] = album['id'];
				if(isLocal){
					album['id'] = 'javascript:void(0);';
				}else{
					album['id'] = '#!m=albuminfo&id='+ album['id'];
				}  
			});
            var html = mUtils.template('J_temp-citem', {list:jdata});
            $('#J_collection_list').html(html);
			if(isLocal){
				$("#J_collection_list").on("click",'.item-a',function(){
					mClick.jumpLocalAlbum($(this));
				});
			}
            $('#J_collectionnum').text(jdata.length);
			mApp.backScroll();
        };

        var _queryInfo = function(){

            mRequest.getRequest({
                url : BEME.APIURL+'/listen/customCollectionList',
				type : 'post',
				data:{
					uid:220531,
				},				
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
                }
            });
        };

        var  _initEvent = function() {

        };

        exports.init = function(){
            mApp.setTitle("收藏的专辑");
            $('.back-btn').show();
            mUtils.headerMenu();
			mApp.showHeader();
            _queryInfo();

            _initEvent();
        };


        exports.uninit = function(){

        };
    });