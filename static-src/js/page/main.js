/* global define, $, BEME*/
define('page/main', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mApp, require, exports){
    "use strict";

    var _renderCustomList = function(jdata){
        var $box = $('#J_custom-box');
        if(jdata.name) {
            $box.find('.title').text('为'+jdata.name+'定制');
			jdata.description = jdata.description.replace('宝宝',jdata.name);
        }
        $box.find('.desc').text(jdata.description);

        var html = mUtils.template('J_temp-customitem', {list:jdata.album_list});
        $box.find('.list').html(html);
			img_onload();
    };

    //请求一些业务数据
    var _queryInfo = function(){
        mRequest.getLocalRequest({
            url : BEME.APIURL+'/home/customList',
			type : 'post',
			data:{
				uid:mUtils.getUid(),
			},
            successfn : function(jdata){
                mApp.loaded();

                if(jdata.code===0){
                    _renderCustomList(jdata.data);
                }
            }
        });
        
        mRequest.getLocalRequest({
            url : BEME.APIURL+'/home/listeningList',
			type : 'get',
			successfn : function(jdata){
                if(jdata.code===0){
                    var html = mUtils.template('J_temp-cateitem', {list:jdata.data});
                    $('#J_cate-box').html(html);
					img_onload();
                }
            }
        });

        mRequest.getLocalRequest({
            url : BEME.APIURL+'/home/stationList',
			type : 'get',
            successfn : function(jdata){
                if(jdata.code===0){
                    var html = mUtils.template('J_temp-fmitem', {list:jdata.data});
                    $('#J_fm-box').html(html);
					img_onload();
					mApp.backScroll();
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
		//alert(history.length);
        _initEvent();
    };


    //反初始化绑定事件
    exports.uninit = function(){
        
    };
});