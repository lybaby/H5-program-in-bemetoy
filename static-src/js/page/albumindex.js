/* global define, $, BEME*/
define('page/albumindex', ['comm/utils', 'comm/url', 'comm/request', 'comm/unveil', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mUnveil, mApp, require, exports){
        "use strict";
		
		var height = 0;
        var page  = 1;
		var is_loading= false;
        //初始化一些点击事件

        var _renderAlbumList = function(jdata){
            if(jdata.classify) {
                if(jdata.classify.name) {
                    mApp.setTitle(jdata.classify.name);
                }
                else{
                    var data=['其他','0-24个月','2-3岁','3-4岁','4-5岁','5岁以上'];
                    mApp.setTitle(data[jdata.classify.age]);
                }
            }
            else{
                mApp.setTitle('全部专辑');
            }

            $('#song_num').html(jdata.count);
            $('#album_num').html(jdata.album_num)
            var html = mUtils.template('J_temp-albumitem', {list:jdata.album});
            $('#album_list').html(html);

			$("img.lazy").unveil();
			 setTimeout(mApp.backScroll(),window.BEME.jumpPage*50);
        };

        //请求一些业务数据
        var _queryInfo = function(id,age){
            mRequest.getLocalRequest({
                url : BEME.APIURL+'/albums/albumTagsPage',
                data:{
                    tag_id:id,
                    classify_age:age,
					page:1
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderAlbumList(jdata.data);
						//height = document.body.scrollHeight;
                    }
                }
            });
        };
		
		var  loading = function(){
			$('#album_list').append('<div class="pageloading"><span>正在加载...</span></div>');
		};
		
		var  loaded = function(){
			$('.pageloading').remove();
		}
		
		var _queryInfoPage = function(id,age,page){
			loading();
			is_loading= true;
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/albumTagsPage',
                data:{
                    tag_id:id,
                    classify_age:age,
                    page:page
                },
                successfn : function(jdata){
                   // mApp.loaded();
				   loaded();
                    if(jdata.code===0){
                        var html = mUtils.template('J_temp-albumitem', {list:jdata.data.album});
                        $('#album_list').append(html);
						$("img.lazy").unveil();
                    }
					is_loading = false;
                }
            });
        };
		
		var _queryPrePage = function(id,age,page){
			is_loading= true;
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/albumTagsPage',
                data:{
                    tag_id:id,
                    classify_age:age,
                    page:page,
					all:1
                },
                successfn : function(jdata){
                   mApp.loaded();
                    if(jdata.code===0){
                        _renderAlbumList(jdata.data);
                    }
					is_loading = false;
					//window.BEME.jumpPage =0;
                }
            });
        };


        var _initEvent = function(id,age){
			window.onscroll = function(){
                    var top = document.body.scrollTop;
                    var clientHeight = document.body.clientHeight;
                    var scrollHeight = document.body.scrollHeight;
                    if( scrollHeight - (top+clientHeight)  < 30 && height <scrollHeight && !is_loading){
                        page = page +1;
						height = scrollHeight;
                        _queryInfoPage(id,age,page);
						//_replacePage(page);
						window.BEME.jumpPage = page;
                    }
                };
				
        };
		
		var _replacePage = function(page){
			var parms={page:page},
			indexHash=mUrl.getParams();
			indexHash = $.extend(indexHash,parms);
			location.replace('#!'+mUrl.buildQuery(indexHash));
		};

        //初始化页面
        exports.init = function(){


            //请求数据
            var hashs = mUrl.getParams();
           

            $('.back-btn').show();
            mUtils.headerMenu();
            $('#myplay').show();
			mApp.showHeader();
			if(window.BEME.jumpPage == 0){
				_queryInfo(hashs.id,hashs.age);	
				height = 0;
				page = 1;
			}
			else{
				_queryPrePage(hashs.id,hashs.age,window.BEME.jumpPage);	
				//alert(window.BEME.jumpPage);
				page = window.BEME.jumpPage;
			}

			
			is_loading= false;
            _initEvent(hashs.id,hashs.age);
        };


        //反初始化绑定事件
        exports.uninit = function(){
			window.onscroll=null;
        };
    });