/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/iplist', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl,mRequest, mApp, require, exports){
        "use strict";
		
        var _renderInfo = function(jdata){
			$.each(jdata,function(i,ip){
                ip['question'] =  mApp.changeDate(ip.update_time*1000);       
            });
			 var html = mUtils.template('J_temp-item-class', {list:jdata});
            $('#ip-classlist').html(html);
			var ver1 = mApp.getUA(0);
			var ver2 = mApp.getUA(1);
			if(ver1 > 1 && ver2 > 2){
				 mApp.setTitle("育儿小妙招");
			}
        };

        var _queryInfo = function(){
            mRequest.getRequest({
                url : BEME.APIURL+'/ip/ipMain',
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
        };

        exports.init = function(){
            mApp.setTitle("贝美童趣馆列表");
            var hashs = mUrl.getParams();
            _queryInfo();
            _initEvent();

        };


        exports.uninit = function(){

        };
    });