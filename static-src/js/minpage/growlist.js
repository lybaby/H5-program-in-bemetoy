/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/growlist', ['comm/utils', 'comm/url', 'comm/request','helper/app', 'require', 'exports'],
    function(mUtils, mUrl,mRequest,mApp, require, exports){
        "use strict";
		
        var _renderInfo = function(jdata){
			var html = '';
			html = mUtils.template('J_temp-growitem', {list:jdata.list});
            $('#J_grow_list').html(html);
			mApp.showImage();
            mApp.backScroll();
			var ver1 = mApp.getUA(0);
			var ver2 = mApp.getUA(1);
			if(ver1 > 1 && ver2 > 2){
				 mApp.setTitle("育儿小妙招");
			}
        };

        var _queryInfo = function(){
			mRequest.getRequest({
                url : BEME.APIURL+'/grow/growList',
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
					else{
					}
                }
            });
        };
		

        var  _initEvent = function() {
			
        };

        exports.init = function(){
            mApp.setTitle("成长场景");
            var hashs = mUrl.getParams();
            _queryInfo();
            _initEvent();

        };


        exports.uninit = function(){

        };
    });