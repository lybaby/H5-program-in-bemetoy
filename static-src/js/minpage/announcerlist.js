/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/announcerlist', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl,mRequest, mApp, require, exports){
        "use strict";
		
        var _renderInfo = function(jdata){
			 var html = mUtils.template('J_temp-announceritem', {list:jdata.list});
            $('#J_announcer_list').html(html);
        };

        var _queryInfo = function(){
            mRequest.getRequest({
                url : BEME.APIURL+'/announcer/announcerlist',
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
            mApp.setTitle("明星主播列表");
            var hashs = mUrl.getParams();
            _queryInfo();
            _initEvent();

        };


        exports.uninit = function(){

        };
    });