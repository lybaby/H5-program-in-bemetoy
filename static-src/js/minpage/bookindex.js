/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/bookindex', ['comm/utils', 'comm/url','comm/swipe', 'comm/request', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl,mSwipe,mRequest, mApp, require, exports){
        "use strict";
		var mySwipe  = '';
		
        var _renderInfo = function(jdata){
			 var html = mUtils.template('J_temp-bookitem', {list:jdata.list});
            $('#J_book_list').html(html);			
        };

        var _queryInfo = function(id){
            mRequest.getRequest({
                url : BEME.APIURL+'/book/bookByTag?id='+id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
                    else{
                        $('#J_book_list').html('');
                    }
                }
            });
        };


        var _queryCate = function(){
            mRequest.getRequest({
                url : BEME.APIURL+'/book/getAllTag',
                successfn : function(jdata){
                    if(jdata.code===0){
                        mApp.loaded();
						var html = mUtils.template('J_temp-all', {list:jdata.data});
						 $('#J_all-box').html(html);
                        jdata.data.splice(0, 0, {id:0, name:'全部'});
                        html = mUtils.template('J_temp-cate', {list:jdata.data});
                        $('#J_cate-box').html(html);

						/*mySwipe =$.Swipe( $('#J_top-box'),{
                            continuous:false,
                            callback: function(pos){
                                $('#J_cate-box .menu-list').eq(pos).find('.item-a').eq(0).click();
                            }
                        });*/
                      mySwipe = $('#J_top-box').Swipe({
                            continuous:false,
                            callback: function(pos){
                               // $('#J_cate-box .menu-list').eq(pos).find('.item-a').eq(0).click();
                            }
                        }).data('Swipe');
                        $('#J_cate-box .menu-list').eq(0).find('.item-a').eq(0).click();
                    }
                }
            });
        };

       /* var _queryInfo = function(cateid){
            mRequest.getRequest({
                url : BEME.APIURL+'/ranking/rankingList?classify_id='+cateid,
                successfn : function(jdata){

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
                    else{
                        $('#J_song-box').html('');
                        $('#J_songnum').text('0');
                    }
                }
            });
        };*/
		var hideAll = function(){
			$(".show_more").removeClass('hide_more');
			$(".back-cover").hide();
			$("#J_all-box").hide();
		};


        var  _initEvent = function() {
			  $('#J_cate-box').on('click', '.item-a', function(){
                var $this = $(this),
                    id = $this.data('id');
                _queryInfo(id);
                $('#J_cate-box li').removeClass('cur');
                $this.parent().addClass('cur');
				hideAll();
            });
			
			$("#J_all-box").on("click",".item-a",function(){
				var $this = $(this),
                    id = $this.data('id');
                //_queryInfo(id);
                //$('#J_cate-box li').removeClass('cur');
				var $this = $('#J_cate-box li').find("span[data-id = '"+id+"']");
				var index = $this.parent().parent().attr('data-index');
				mySwipe.slide(index);
				$this.click();
			});
			
			$(".show_more").on("click",function(){
				var $this = $(this);
				if($this.hasClass('hide_more')){
					hideAll();
				}else{
					$this.addClass('hide_more');
					$(".back-cover").show();
					$("#J_all-box").show();
				}
			});
			
			$('.back-cover').on("click",function(){
				hideAll();
			});
			
			
			$('.book-list').on('click','.item-a',function(){
				var $this = $(this);
				var url = $this.attr('url');
				var type = $this.attr('type');
				var version1 = mApp.getUA(1);
				var version2 = mApp.getUA(2);
				//alert(version1);
				//alert(version2);
				try{
					
					if(+type == 0){
						 window.location.href=url;
						// window.location.reload(false);
					}
					else{
                        if((version1 <= 2 || version1 == undefined)&& (version2 < 1 || version2 == undefined)){
							window.location.href=url;
							//window.location.reload(false);
						}
						else{
							window.bemetoy.webViewTouchWithUrl(url,+type); 
						}

					}	
				}
				catch(e){
					
				}
			});
			
        };

        exports.init = function(){
            mApp.setTitle("有声绘本世界");
            var hashs = mUrl.getParams();
			_queryCate();
			
            _initEvent();

        };


        exports.uninit = function(){

        };
    });