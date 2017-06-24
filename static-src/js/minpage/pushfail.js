/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/pushfail', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mApp, mTemp, require, exports){
        "use strict";
		var str_jd = 'http://item.jd.com/1917166.html';

        var _renderInfo = function(jdata,text){
			if(jdata == 'album')
            {
                mApp.setTitle("专辑");
            }
            if(jdata == 'topic')
            {
                mApp.setTitle("专题");
            }
            if(jdata == 'station')
            {
                mApp.setTitle("电台");
            }
			var conf = ['0','推送失败','订阅失败'];
			$('.push .title').text(conf[+text]);

            mApp.backScroll();
        };

        var _queryInfo = function(){
            mApp.loaded();
        };

        var  _initEvent = function(type) {
			
			$('.connect_app').on('click',function(){
				
				var ver0= mApp.getUA(0),ver1= mApp.getUA(1);
				if(ver0 > 1 && ver1 > 3){
					try{
						 window.bemetoy.bindToyByType(+type);
					}
					catch(e){
						//alert(e);
					}		
				}else{
					try{
						 window.bemetoy.bindToy();
					}
					catch(e){
						//alert(e);
					}	
				}
			});
			
			$('.buy-jd').on('click',function(){
				try{
					 window.bemetoy.openSystemExplorer(str_jd);
				}
				catch(e){
					//alert(e);
				}
			});
			

        };

        exports.init = function(){
            var hashs = mUrl.getParams();
            $('.back-btn').show();
            mUtils.headerMenu();
            $('#myplay').show();
			mApp.showHeader();
            _queryInfo();
			_renderInfo(hashs.type,hashs.text);
            _initEvent(hashs.text);

        };


        exports.uninit = function(){

        };
    });