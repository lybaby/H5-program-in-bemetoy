/* global define, $, BEME*/
define('page/newmain', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mApp, require, exports){
    "use strict";

    var _renderCustomList = function(jdata){
    };

    //请求一些业务数据
    var _queryInfo = function(){
            
        mRequest.getLocalRequest({
            url : BEME.APIURL+'/home/listeningList',
			type : 'get',
			successfn : function(jdata){
				 mApp.loaded();
                if(jdata.code===0){
                    var html = mUtils.template('J_temp-cateitem', {list:jdata.data});
                    $('#J_cate-box').html(html);
					img_onload();
                }
            }
        });
    };
	
	var img_onload = function(){
		$('.item-a .img-auto').each(function(i, img){
			 img.onload = function(){
				$(this).parent().find('.info-box').show();
			}
		});
		mApp.showImage();
	};
	

    //初始化一些点击事件
    var _initEvent = function(){
    };

    //初始化页面
    exports.init = function(){
        mApp.setTitle("听听");
        $('.back-btn').hide();
        mUtils.headerMenu();
        $('#myplay').show();
		mApp.showHeader();
        //请求数据
        _queryInfo();

        _initEvent();
    };


    //反初始化绑定事件
    exports.uninit = function(){
        
    };
});