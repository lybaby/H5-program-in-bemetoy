/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/albummain', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mApp, mTemp, require, exports){
        "use strict";

        var _renderInfo = function(jdata){
			
        };

        var _queryInfo = function(){
            mApp.loaded();
			window.BEME.jumpPage = 0;
			mApp.backScroll();
        };

        var  _initEvent = function() {

        };

        exports.init = function(){
            mApp.setTitle("专辑分类");
            $('.back-btn').show();
            mUtils.headerMenu();
            $('#myplay').show();
			mApp.showHeader();
            _queryInfo();

            _initEvent();

        };


        exports.uninit = function(){

        };
    });