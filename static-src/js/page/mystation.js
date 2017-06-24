/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/mystation', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mApp, mTemp, require, exports){
        "use strict";

        var _renderInfo = function(jdata){
            var html = mUtils.template('J_temp-ditem', {list:jdata});
            $('#J_description_list').html(html);
            $('#J_descriptionnum').text(jdata.length);
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
                url : BEME.APIURL+'/listen/customStationList',
                data:{
                    uid:mUtils.getUid(),
					toy_id: toy_id
                },
                type : 'post',
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
            mApp.setTitle("订阅的电台");

            $('.back-btn').show();
            mUtils.headerMenu();
			mApp.showHeader();
            _queryInfo();

            _initEvent();
        };


        exports.uninit = function(){

        };
    });