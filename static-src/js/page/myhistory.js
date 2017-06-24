/* global define, $, BEME*/
define('page/myhistory', ['comm/utils', 'comm/url', 'comm/request','comm/clickevent','page/myalbum', 'helper/app', 'helper/playerbar', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mClick, mMyalbum,mApp, mPlayerbar, require, exports){
        "use strict";

        var _songList = {},
			_dataList_unhave={},
			_dataList_unplay={},
			_dataList_playing={},
			_dataList_history={},
            isDelete = false,isNew = mApp.changePlayList(),
			isInit = false;

        var _renderInfo = function(jdata){

            if(jdata.count === 0){
                $('#have-history').hide();
                $('.song-fail').show();
                mApp.noScroll();
                return;
            }
            if(!jdata.playing_count&&!jdata.unplaying_count&&!jdata.history_count&&!jdata.have_count)
            {
                $('#have-history').hide();
                $('.song-fail').show();
                return;
            }
			 $('#have-new-history').hide();
			 $('#have-history').show();

            if(!jdata.playing_count){
                var html = '<div class="no-content">玩具没有正在收听节目</div>';
                $('#J_play_list').html(html);
            }
            else{
                var html = mUtils.template('J_temp-nitem', {list:jdata.playing_count});
                $('#J_play_list').html(html);
            }
            if(!jdata.unplaying_count){
                var html = '<div class="no-content">玩具尚无待接收歌曲</div>';
                $('#J_noplay_list').html(html);
            }
            else{
                var html = mUtils.template('J_temp-nitem', {list:jdata.unplaying_count});
                $('#J_noplay_list').html(html);
            }
            if(!jdata.history_count){
                var html = '<div class="no-content">玩具尚无已播放歌曲</div>';
                $('#J_played_list').html(html);
            }
            else{
                var html = mUtils.template('J_temp-nitem', {list:jdata.history_count});
                $('#J_played_list').html(html);
            }
            if(!jdata.have_count){
                var html = '<div class="no-content">玩具尚无待播放歌曲</div>';
                $('#J_waiting_list').html(html);
            }
            else{
                var html = mUtils.template('J_temp-nitem', {list:jdata.have_count});
                $('#J_waiting_list').html(html);
            }

			
			
			if(isNew){
				$('.item').find('.item-play img').attr('src','./static/images/feiji.png');
				_dataList_history = mApp.getSongJson(jdata.history_count,'','已播放歌曲');
				_dataList_playing = mApp.getSongJson(jdata.playing_count,'','正在播放');
				_dataList_unhave = mApp.getSongJson(jdata.unplaying_count,'','待接收');
				_dataList_unplay = mApp.getSongJson(jdata.have_count,'','待播放');	
			}
			else{
				$.each(jdata.history_count, function(i, info){
					info._type = 'history';
					_songList[info.relate_id] = info;
				});
				$.each(jdata.playing_count, function(i, info){
					info._type = 'history';
					_songList[info.relate_id] = info;
				});
				$.each(jdata.unplaying_count, function(i, info){
					info._type = 'history';
					_songList[info.relate_id] = info;
				});
				$.each(jdata.have_count, function(i, info){
					info._type = 'history';
					_songList[info.relate_id] = info;
				});
			}
			if(!isInit){
				_initEvent();
				isInit = true;
			}
            mApp.backScroll();
        };
		
		
		var _renderNewInfo = function(jdata){
			if(jdata.count === 0){
                $('#have-new-history').hide();
                $('.song-fail').show();
                mApp.noScroll();
                return;
            }
            if(!jdata.playing_count&&!jdata.unplaying_count&&!jdata.history_count&&!jdata.have_count)
            {
                $('#have-new-history').hide();
                $('.song-fail').show();
                return;
            }
			 $('#have-new-history').show();
			 $('#have-history').hide();
			if(!jdata.playing_count){
                var html = '<div class="no-content">玩具没有正在收听节目</div>';
                $('#J_new_playing').html(html);
            }
            else{
                var html = mUtils.template('J_temp-nitem', {list:jdata.playing_count});
                $('#J_new_playing').html(html);
				$('#J_new_playing').find('.checkbox').remove();
				
            }
			
			if(!jdata.unplaying_count && !jdata.have_count){
                var html = '<div class="no-content">玩具尚无待播放歌曲</div>';
                $('#J_new_unplay').html(html);
            }
            else{
				var html = '';
				if(jdata.have_count){
					html += mUtils.template('J_temp-nitem', {list:jdata.have_count});
				}
				if(jdata.unplaying_count){
					html += mUtils.template('J_temp-nitem', {list:jdata.unplaying_count});
				}
                $('#J_new_unplay').html(html);
            }
			
			if(!jdata.history_count){
                var html = '<div class="no-content">玩具尚无已播放歌曲</div>';
                $('#J_new_played').html(html);
            }
            else{
                var html = mUtils.template('J_temp-nitem', {list:jdata.history_count});
                $('#J_new_played').html(html);
            }
			
			if(!isInit){
				initNewEvent();
				isInit = true;
			}
            mApp.backScroll();
			
			
			if(isNew){
				$('.item').find('.item-play img').attr('src','./static/images/feiji.png');
				_dataList_history = mApp.getSongJson(jdata.history_count,'','已播放歌曲');
				_dataList_playing = mApp.getSongJson(jdata.playing_count,'','正在播放');
				if(jdata.have_count){
					_dataList_unplay = mApp.getSongJson(jdata.have_count.concat(jdata.unplaying_count),'','待播放');	
				}
			}
			else{
				$.each(jdata.history_count, function(i, info){
					info._type = 'history';
					_songList[info.relate_id] = info;
				});
				$.each(jdata.playing_count, function(i, info){
					info._type = 'history';
					_songList[info.relate_id] = info;
				});
				$.each(jdata.unplaying_count, function(i, info){
					info._type = 'history';
					_songList[info.relate_id] = info;
				});
				$.each(jdata.have_count, function(i, info){
					info._type = 'history';
					_songList[info.relate_id] = info;
				});
			}
			

		
			 
		};


        //请求一些业务数据
        var _queryInfo = function(){
			
			var toy_id =  0;
			try{
				toy_id= window.bemetoy.getToUerid();
			}catch(e){
				toy_id = 0;
			}
			//toy_id = 618;
            mRequest.getRequest({
                url : BEME.APIURL+'/listen/getHistory',
                type : 'post',
                data:{
                    uid:mUtils.getUid(),
					toy_id: toy_id
                },
                successfn : function(jdata){
                    mApp.loaded();
                    if(jdata.code===0){

						if(!jdata.data.isNew){
							_renderInfo(jdata.data);
						}else{
							_renderNewInfo(jdata.data);
						}

                    }
                    else{
                        $('#have-history').hide();
                        $('.song-fail').show();
                        mApp.noScroll();
                        return;
                    }
                }
            });

        };

        exports.deleteHistory = function(id,isNew){
			 mRequest.getRequest({
				url : BEME.APIURL+'/listen/deleteHistory',
				data:{
					id:id,
					uid:mUtils.getUid(),
					isNew:isNew
				},
				type : 'POST',
				successfn : function(jdata){
					mApp.showTips('删除歌曲成功');
					if(jdata.code===0){
						_queryInfo();
						$('.select-all').hide();
						$('#J_wrapper .item').find('.checkbox').hide();
						$('.title').show();
					}
				}
			});

        };

        exports.deleteNoHistory = function(id,isNew){
			mRequest.getRequest({
				url : BEME.APIURL+'/listen/deleteNoSendSong',
				data:{
					ids:id,
					uid:mUtils.getUid(),
					isNew:isNew
				},
				type : 'POST',
				successfn : function(jdata){
					mApp.showTips('删除歌曲成功');
					if(jdata.code===0){
						_queryInfo();
						$('.select-all').hide();
						$('#J_wrapper .item').find('.checkbox').hide();
						$('.title').show();
					}
				}
			});

        };

        var addSelectAll = function(obj,type,isNew){
            $('.select-all').remove();
            var html='<div class="select-all"  _type="'+type+'" _isNew="'+isNew+'">'+
                '<a class="left" href="javascript:void(0);" value="0"><img src="./static/images/xuanzekong.png"></a>'+
                '<a class="title" style="line-height: 0.8rem;">全选</a>'+
                '<a class="right content" href="javascript:void(0);" id="cancel">取消</a>'+
                '<a class="right content_add"  href="javascript:void(0);" id="delete">删除</a>'+
                '</div>';
			$(html).insertAfter($(obj));
			if(isNew){
				$('#J_played_list').find('.item-play img').hide();
			}
            initSelectEvent();
        };

        var checkbox_all = function($this){
            var val = $this.find('.checkbox').attr('value');
            var play = $this.parent().parent().find('.item').find('.checkbox');
            if(+val == 0) {
                $($this.find('.checkbox')).find('img').attr('src','./static/images/xuanze.png');
                $this.find('.checkbox').attr('value','1');

                var is_all = 0;
                var is_select = false;
                $.each(play,function(i,p){
                    if($(p).attr('value') == 0){
                        is_all++;
                    }
                    if($(p).attr('value') == 1){
                        is_select = true;
                    }
                });
                if(!is_all){
                    if($('.delete-all .left').length){
                        $('.delete-all .left img').attr('src','./static/images/xuanze.png');
                        $('.delete-all .left').attr('value',1);
                        $('.select-all .left img').attr('src','./static/images/xuanze.png');
                        $('.select-all .left').attr('value',1);
                    }
                    else{
                        $('.select-all .left img').attr('src','./static/images/xuanze.png');
                        $('.select-all .left').attr('value',1);
                    }
                }
                if(is_select){
                    $('#add').removeClass('content_add');
                    $('#add').addClass('content');
                    $('#delete').removeClass('content_add');
                    $('#delete').addClass('content');
                }else{
                    $('#add').removeClass('content');
                    $('#add').addClass('content_add');
                    $('#delete').removeClass('content');
                    $('#delete').addClass('content_add');
                }
            }
            else{
                $($this.find('.checkbox')).find('img').attr('src','./static/images/xuanzekong.png');
                $this.find('.checkbox').attr('value','0');
                var is_select = false;
                $.each(play,function(i,p){
                    if($(p).attr('value') == 1){
                        is_select = true;
                    }
                });
                if(is_select){
                    $('#add').removeClass('content_add');
                    $('#add').addClass('content');
                    $('#delete').removeClass('content_add');
                    $('#delete').addClass('content');
                }else{
                    $('#add').removeClass('content');
                    $('#add').addClass('content_add');
                    $('#delete').removeClass('content');
                    $('#delete').addClass('content_add');
                }
                if($('.delete-all .left').length){
                    var all = $('.delete-all .left').attr('value');
                    if(+all == 1){
                        $('.delete-all .left img').attr('src','./static/images/xuanzekong.png');
                        $('.delete-all .left').attr('value',0);
                        $('.select-all .left img').attr('src','./static/images/xuanzekong.png');
                        $('.select-all .left').attr('value',0);
                    }
                }
                else{
                    var all = $('.select-all .left').attr('value');
                    if(+all == 1){
                        $('.select-all .left img').attr('src','./static/images/xuanzekong.png');
                        $('.select-all .left').attr('value',0);
                    }
                }
            }
        };


        //初始化一些点击事件
        var _initEvent = function(){
			if(isNew){
				$('#have-history').on('click', '.item-play', function(e){
					if(!isDelete){
						mClick.pushSong($(this));
						setTimeout(function(){_queryInfo();}, 1000);
					}
				});	
				
				$('#J_played_list').on('click','.item .item-c', function(){
					var $this = $(this);

					if(!isDelete){
						mClick.audition_new(_dataList_history,this);
					}else{
						checkbox_all($(this));
					}
				});
				
				$('#J_play_list').on('click','.item .item-c', function(){
					var $this = $(this);

					if(!isDelete){
						mClick.audition_new(_dataList_playing,this);
					}else{
						checkbox_all($(this));
					}
				});
				
				$('#J_waiting_list').on('click','.item .item-c', function(){
					var $this = $(this);

					if(!isDelete){
						mClick.audition_new(_dataList_unplay,this);
					}else{
						checkbox_all($(this));
					}
				});
				
				$('#J_noplay_list').on('click','.item .item-c', function(){
					var $this = $(this);

					if(!isDelete){
						mClick.audition_new(_dataList_unhave,this);
					}else{
						checkbox_all($(this));
					}
				});
				
			}else{
				$('#have-history').on('click', '.item .item-c', function(){
					var $this = $(this);

					if(!isDelete){
						mClick.pushSong($this);
						setTimeout(function(){_queryInfo();}, 1000);
					}else{
						checkbox_all($(this));
					}
				});

				$('#have-history').on('click', '.item-play', function(e){
					if(!isDelete){
						var $this = $(this).parent(),
							sid = $this.attr('rid');
						mPlayerbar.initPlayer($this, _songList[+sid]);
					}
				});	
			}


            $('#have-history .header').on('click','a',function(){
                var $this =$(this);
                $('#have-history  .header').find('.cur').removeClass('cur');
                $(this).parent().addClass('cur');
                var type = $this.attr("_type");
                if(type == 1){
                    $('.no_song').show();
                    $('.have_song').hide();
                    $('.have_played').hide();
                }
                if(type == 2){
                    $('.no_song').hide();
                    $('.have_song').show();
                    $('.have_played').hide();
                    _queryInfo();
                }
                if(type == 3){
                    $('.no_song').hide();
                    $('.have_song').hide();
                    $('.have_played').show();
                }

            });


            $('#delete-noplay').on('click',function(){
                var setting ={};
                setting['content']='删除全部曲目？删除后玩具将不会收到这些歌曲';
                var arr = [];
                var playList = $('#J_noplay_list').find('.item');
                if(playList.length == 0 ){
                    return;
                }
                $.each(playList,function(i,play){
                    arr.push($(play).attr('rid'));
                });
                if(arr.length == 0){
                    return;
                }
                mApp.showAlert(setting,function(){
                    exports.deleteNoHistory(arr.join(','));
                });
            });

            $('#delete-played').on('click',function(){
                addSelectAll($(this),2,0);
                var $this = $(this);
                $(this).hide();
                $(".select-all").show();
                $('.have_played .item').find('.checkbox').show();
                isDelete = true;
            });

        };
		
		
		var initNewEvent = function(){
			if(isNew){
				$('#have-new-history').on('click', '.item-play', function(e){
					if(!isDelete){
						mClick.pushSong($(this));
						setTimeout(function(){_queryInfo();}, 1000);
					}
				});	
				
				$('#J_new_played').on('click','.item .item-c', function(){
					var $this = $(this);

					if(!isDelete){
						mClick.audition_new(_dataList_history,this);
					}else{
						checkbox_all($(this));
					}
				});
				
				$('#J_new_playing').on('click','.item .item-c', function(){
					var $this = $(this);

					if(!isDelete){
						mClick.audition_new(_dataList_playing,this);
					}else{
						checkbox_all($(this));
					}
				});
				
				$('#J_new_unplay').on('click','.item .item-c', function(){
					var $this = $(this);

					if(!isDelete){
						mClick.audition_new(_dataList_unhave,this);
					}else{
						checkbox_all($(this));
					}
				});
				
			}else{
				$('#have-new-history').on('click', '.item .item-c', function(){
					var $this = $(this);

					if(!isDelete){
						mClick.pushSong($this);
						setTimeout(function(){_queryInfo();}, 1000);
					}else{
						checkbox_all($(this));
					}
				});

				$('#have-new-history').on('click', '.item-play', function(e){
					if(!isDelete){
						var $this = $(this).parent(),
							sid = $this.attr('rid');
						mPlayerbar.initPlayer($this, _songList[+sid]);
					}
				});	
			}
						
			
			
			$('#have-new-history .header').on('click','a',function(){
                var $this =$(this);
                $('#have-new-history .header').find('.cur').removeClass('cur');
                $(this).parent().addClass('cur');
                var type = $this.attr("_type");
                if(type == 1){
                    $('.have_song').show();
                    $('.have_played').hide();
					 _queryInfo();
                }
                if(type == 2){
                    $('.have_song').hide();
                    $('.have_played').show();
                }

            });
			
			
			 $('#delete-new-played').on('click',function(){
                addSelectAll($(this),2,1);
                var $this = $(this);
                $(this).hide();
                $(".select-all").show();
                $('.have_played .item').find('.checkbox').show();
                isDelete = true;
            });
			
			 $('#delete-new-unplayed').on('click',function(){
                addSelectAll($(this),1,1);
                var $this = $(this);
                $(this).hide();
                $(".select-all").show();
                $('.have_song  .item').find('.checkbox').show();
                isDelete = true;
            });
			
			
		}


        var initSelectEvent = function(){

            $(".select-all").off('click');

            $(".select-all").on('click','.left',function() {
                var $this = $(this).parent();
                var val = $this.find('.left').attr('value');
                var play = $this.parent().parent().find('.item').find('.checkbox');
                if(+val == 0) {
                    $this.find('img').attr('src','./static/images/xuanze.png');
                    $this.find('.left').attr('value',1);
                    $.each(play,function(i,p){
                        $(p).find('img').attr('src','./static/images/xuanze.png');
                        $(p).attr('value',1);
                    });
                    $('#delete').removeClass('content_add');
                    $('#delete').addClass('content');
                }
                else {
                    $this.find('img').attr('src','./static/images/xuanzekong.png');
                    $this.find('.left').attr('value',0);
                    $.each(play,function(i,p){
                        $(p).find('img').attr('src','./static/images/xuanzekong.png');
                        $(p).attr('value',0);
                    });
                    $('#delete').removeClass('content');
                    $('#delete').addClass('content_add');
                }
            });

            $(".select-all").on('click','#cancel',function(){
                $('.select-all').hide();
                $('#J_wrapper .item').find('.checkbox').hide();
                $.each($('#J_wrapper .item').find('.checkbox'),function(i,p){
                    $(p).find('img').attr('src','./static/images/xuanzekong.png');
                    $(p).attr('value',0);
                });
				if(isNew){
					$('#J_played_list').find('.item-play img').show();
				}
                $('.title').show();
                isDelete = false;
            });

            $(".select-all").on('click','#delete',function(){
                var playList = $(this).parent().parent().find('.item');
                var _type =  $(this).parent().attr('_type');
				var _isNew =  $(this).parent().attr('_isnew');
                var arr = [];
                $.each(playList,function(i,play){
                    var $this = $(play);
                    var val = $this.find('.checkbox').attr('value');
                    if(+val === 1) {
                        arr.push($this.attr('rid'));
                    }
                });
                if(arr.length === 0){
                    //mApp.showAlert('您尚未选择任何歌曲！',true);
                }
                else{
                    var setting ={};
                    setting['content']='确定删除所选歌曲？';
                    mApp.showAlert(setting,function(){
                        if(_type == 1){
                            exports.deleteNoHistory(arr.join(','),_isNew);
                        }else{
                            exports.deleteHistory(arr.join(','),_isNew);
                        }
                        isDelete = false;
                    });
                }
            });
        };

        //初始化页面
        exports.init = function(){

            mApp.setTitle('点播足迹');

            var hashs = mUrl.getParams();

            $('.back-btn').show();
            mUtils.headerMenu();
            $('#myplay').show();
            mApp.showHeader();
            //请求数据
            _queryInfo();
			
            //_initEvent();
        };


        //反初始化绑定事件
        exports.uninit = function(){
			isInit = false;
			isDelete = false;
        };
    });