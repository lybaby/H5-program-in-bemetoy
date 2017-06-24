/* global define, $, BEME*/
define('page/ranking', ['comm/utils', 'comm/url', 'comm/request','comm/pushsong', 'swaper', 'comm/clickevent','helper/app', 'helper/playerbar','page/myalbum', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mPush, mSwipe,mClick, mApp, mPlayerbar,mMyalbum, require, exports){
        "use strict";

        var _songList = {},
		_playList = {},
		isNew = mApp.changePlayList(),
		mySwipe  = '';;

        var _renderInfo = function(jdata){
            $('#J_songnum').text(jdata.length);
			var ver = mApp.getUA(1),html;
			if(isNew){
				_playList = mApp.getSongJson(jdata,'','排行榜');
				html = mUtils.template('J_temp-item-new', {list:jdata, flag:true});
			}else{
				html = mUtils.template('J_temp-item', {list:jdata, flag:true});
				$.each(jdata, function(i, info){
					info._type = 'ranking';
					_songList[info.id] = info;
				});
			}
			$('#J_song-box').html(html);
			mApp.backScroll();
        };

        var _queryCate = function(){
            mRequest.getRequest({
                url : BEME.APIURL+'/ranking/getAllTag',
                successfn : function(jdata){
                    if(jdata.code===0){
						  mApp.loaded(); 
						var html = mUtils.template('J_temp-all', {list:jdata.data});
						$('#J_all-box').html(html);
                        jdata.data.splice(0, 0, {id:0, name:'全部分类'});
						html = mUtils.template('J_temp-cate', {list:jdata.data});
                        $('#J_cate-box').html(html);
                       /* $('#J_top-box').Swipe({
                            continuous:false,
                            callback: function(pos){
                                $('#J_cate-box .menu-list').eq(pos).find('.item-a').eq(0).click();
                            }
                        });*/
						mySwipe =$('#J_cate-box').swiper({
							slidesPerView: 'auto',
							freeMode:true,
							freeModeFluid:true,
							onSlideClick: function(nav){
								//pages.swipeTo( nav.clickedSlideIndex )
							}
						});
                        $('#J_cate-box .menu-list').eq(0).find('.item-a').eq(0).click();
                    }
                }
            });
        };

        var _queryInfo = function(cateid){
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
        };

        var _initEvent = function(){
            $('#J_cate-box').on('click', '.item-a', function(){
                var $this = $(this),
                    id = $this.data('id');
                _queryInfo(id);
                $('#J_cate-box div').removeClass('cur');
                $this.parent().addClass('cur');
				$(".show_more").removeClass('hide_more');
				$(".back-cover").hide();
				$("#J_all-box").hide();
            });
			
						
			$("#J_all-box").on("click",".item-a",function(){
				var $this = $(this),
                    id = $this.data('id');
                //_queryInfo(id);
                //$('#J_cate-box li').removeClass('cur');
				var $this = $('#J_cate-box div').find("span[data-id = '"+id+"']");
				var index = $this.parent().index();
				mySwipe.swipeTo(index);
				$this.click();
			});

		
			if(isNew){
				$('#J_song-box').on('click', '.item .item-a', function(){
						mClick.audition_new(_playList,this);
				});
				
				 $('#J_song-box').on('click', '.item .item-play', function(){
					 mClick.pushSong($(this));
				});
			}else{
				$('#J_song-box').on('click','.item .item-a',function(){
					  mClick.pushSong(this);
				});

				$('#J_song-box').on('click', '.item-play', function(){
				   var $this = $(this).parent(),
						sid = $this.attr('sid');
					mPlayerbar.initPlayer($this, _songList[+sid]);
				});
			}
			
			$('.caction-box').on('click', '.play-btn', function(){
					mClick.pushAllSong(this);
			});
			
						
			$(".show_more").on("click",function(){
				var $this = $(this);
				if($this.hasClass('hide_more')){
					$(".show_more").removeClass('hide_more');
					$(".back-cover").hide();
					$("#J_all-box").hide();
				}else{
					$this.addClass('hide_more');
					$(".back-cover").show();
					$("#J_all-box").show();
				}
			});
		

        };

        exports.init = function(){
            mApp.setTitle("点播排行");
            $('.back-btn').show();
            mUtils.headerMenu();
            $('#myplay').show();
            var hashs = mUrl.getParams();
			mApp.showHeader();
            _initEvent();
            _queryCate();
        };

        exports.uninit = function(){
            $('#J_cate-box, #J_song-box').off('click');
        };
    });