/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/mybook', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl,mRequest, mApp, require, exports){
        "use strict";
		
        var _renderInfo = function(jdata){
			 var html = mUtils.template('J_temp-bookitem', {list:jdata});
            $('#J_book_list').html(html);			
        };

        var _queryInfo = function(){
            mRequest.getRequest({
                url : BEME.APIURL+'/listen/getCollectionBookList',
                type : 'post',
                data:{
                    uid:mUtils.getUid()
                },
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

        var  _initEvent = function() {
			$('.book-list').on('click','.item-a',function(){
				var $this = $(this);
				var url = $this.attr('url');
				var type = $this.attr('type');
				var version1 = mApp.getUA(1);
				var version2 = mApp.getUA(2);
				try{
					
					if(+type == 0){
						 window.location.href=url;
						// window.location.reload(false);
					}
					else{
                        if((version1 <= 2 || version1 == undefined)&& (version2 < 1 || version2 == undefined)){
							window.location.href=url;
							//window.location.reload(false);
						}
						else{
							window.bemetoy.webViewTouchWithUrl(url,+type); 
						}

					}	
				}
				catch(e){
					
				}
			});
			
        };

        exports.init = function(){
            mApp.setTitle("收藏的绘本");
            var hashs = mUrl.getParams();
            _queryInfo();
            _initEvent();

        };


        exports.uninit = function(){

        };
    });