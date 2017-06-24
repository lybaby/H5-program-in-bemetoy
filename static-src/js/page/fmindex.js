/* global define, $, BEME*/
define('page/fmindex', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mApp, require, exports){
    "use strict";

    var _renderInfo = function(jdata){
        var html = mUtils.template('J_temp-fmitem1', {list:jdata.recommend});
        $('#J_recommend-fm').html(html);

        html = mUtils.template('J_temp-fmitem2', {list:jdata.hot});
        $('#J_hot-fm').html(html);

        html = mUtils.template('J_temp-fmitem3', {list:jdata.normal});
        $('#J_normal-fm').html(html);
		mApp.showImage();
		
		mApp.backScroll();
    };

    //请求一些业务数据
    var _queryInfo = function(){
        mRequest.getLocalRequest({
            url : BEME.APIURL+'/station/stationList',
            successfn : function(jdata){
                mApp.loaded();

                if(jdata.code===0){
                    _renderInfo(jdata.data);
                }
            }
        });
    };

    //初始化页面
    exports.init = function(){
        mApp.setTitle("电台节目");
	    $('.back-btn').show();
        mUtils.headerMenu();
        $('#myplay').show();
		mApp.showHeader();
        _queryInfo();
    };


    //反初始化绑定事件
    exports.uninit = function(){
        
    };
});