/* global define, $, BEME*/
define('page/myplay', ['comm/utils', 'comm/url', 'comm/request','comm/pushsong','comm/clickevent','page/myalbum', 'helper/app', 'helper/playerbar', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mPush,mClick, mMyalbum,mApp, mPlayerbar, require, exports){
        "use strict";

        var _songList = {},
		_playList={},
		isNew = mApp.changePlayList();;
		var play = 0;

        var _renderInfo = function(jdata){

            mApp.setTitle(jdata.play.name);

            if(jdata.count === 0){
				$('#J_songnum').text(0);
				$('.title3').show();
                $('#play_list').hide();
                $('.song-fail').show();
                return;
            }

            var html = mUtils.template('J_temp-mpitem', {list:jdata.songs});

            $('#J_songnum').text(jdata.songs.length);
            $('#J_play_name').text(jdata.play.name);
            $('#J_songnum_all').text(jdata.songs.length);
			$('.title3').show();
			$('.select-all').hide();
			$('#J_wrapper .item').find('.checkbox').hide();
			var html;
			if(isNew){
				_playList = mApp.getSongJson(jdata.songs,'',jdata.play.name);
				html = mUtils.template('J_temp-mpitem-new', {list:jdata.songs, flag:true});
			}else{
				html = mUtils.template('J_temp-mpitem', {list:jdata.songs, flag:true});
				 $.each(jdata.songs, function(i, info){
					info._type = 'play';
					info.tag = info.song_type;
					info.user = true;
					_songList[info.id] = info;
				});
			}
			$('#J_song_list').html(html);
			
          
			mApp.backScroll();
        };


        //请求一些业务数据
        var _queryInfo = function(albumid){
            mRequest.getRequest({
                url : BEME.APIURL+'/listen/customPlayDetail?id='+albumid,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
					else{
						$('#play_list').hide();
						$('.song-fail').show();
					}
                }
            });

        };

        var _deletePlaySongList = function(ids,albumid){
			var playList = $('.item');
			var arr = [];
			$.each(playList,function(i,play){
                    var $this = $(play);
                    $this.find('.checkbox').attr('value','0');
                    $($this.find('.checkbox')).find('img').attr('src','./static/images/xuanzekong.png');
			});
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/deletePlayListSong',
                data : {ids:ids},
                type : 'POST',
                successfn : function(jdata){
                    mApp.showTips('删除歌曲'+jdata.message);
                    if(jdata.code===0){
                       _queryInfo(albumid);
                    }
                }
            });

        };
		
		exports.deletePlay = function(id){
            _deletePlaySongList(id,play);
        };


        //初始化一些点击事件
        var _initEvent = function(albumid){

            $("#editplay").on('click',function(){
                $('.delete-all').show();
                $('#J_wrapper .item').find('.checkbox').show();
                $('#delete_play').show();
                $('#editplay').hide();
                $('.back-btn').hide();
                $('.title3').hide();
                $('#cancel_edit').show();
            });



           $(".select-all").on('click','#delete',function(){
                var playList = $('.item');
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
					   _deletePlaySongList(arr.join(','),albumid);
                    });
                }
            });
			
		
			if(isNew){
				$('#J_song_list').on('click', '.item .item_a', function(){
					 mClick.audition_new(_playList,this); 
				});
				
				$('#J_song_list').on('click', '.item-play', function(){              
					mClick.pushSong(this);
				});
				
			}else{
				$('#J_song_list').on('click', '.item .item_a', function(){
					 mClick.pushSong(this);
				});
				
				

				$('#J_song_list').on('click', '.item-play', function(){              
					 mClick.audition(_songList,this);
				});
				
			}
			
			$(".select-all").on('click','#cancel',function(){
                $('.select-all').hide();
                $('#J_wrapper .item').find('.checkbox').hide();
                $('.title3').show();
				if(isNew){
					$('.item').find('.item-play img').show();
				}
            });
			
			$('.title3').on('click', '.play-btn', function(){
				mClick.pushAllSong(this);
			});
			
            $('#listen_edit').on('click',function(e){
				e.stopPropagation();
				if($('.top').css('display') == 'none'){
                 $('.top').show();
                 }
                 else{
                 $('.top').hide();
                 }
            });
			
			$(document).click(function(){
				 $('.top').hide();
			});
			
			$('.top').on('click','.edit',function(e){
				e.stopPropagation();
				 if($('.item').find('.checkbox')[0].style.display === "none" || $('.item').find('.checkbox')[0].style.display === '') {
					$('.select-all').show();
					$('.myplay .title3').hide();
					$('.item').find('.checkbox').show();
					if($('.item').find('.checkbox span').length){
						$('.item').find('.checkbox span').hide();
						$('.item').find('.checkbox img').show();
					}
				}
				if(isNew){
					$('.item').find('.item-play img').hide();
				}
				$('.top').hide();
			});
			
			$('.top').on('click','.cancel',function(e){
				e.stopPropagation();
				 $('#J_newplay-box').show();
				 $('#J_newplay-box .play_title').text('修改歌单名');
				 $('#J_newplay-box #play_name').val(document.title);
				 $('#J_newplay-box #play_name').focus();
				 $('#J_newplay-box #play_id').attr('value',albumid);
				 $('#J_newplay-box .btn-ok').css("color",'#0091ff');
				  mApp.showMask();
                //$('#J_body-mask').show();
				$('.top').hide();
			});
			
			mClick.newPlayEvent();

            $("#J_song_list").on('click','.checkbox',function() {
                mClick.check(this);
            });
			
		    $(".select-all").on('click','.left',function() {
				var $this = $(this).parent();
				var val = $this.find('.left').attr('value');
				var play = $('.item').find('.checkbox');
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

        };

        //初始化页面
        exports.init = function(){

            var hashs = mUrl.getParams();

            $('.back-btn').show();
            mUtils.headerMenu();
            $('#editplay').show();
			mApp.showHeader();
            //请求数据
            _queryInfo(hashs.id);
			play = hashs.id;
            _initEvent(hashs.id);
        };


        //反初始化绑定事件
        exports.uninit = function(){
            $('#editplay, .select-all,#listen_edit, #J_play_list, #delete_play, #cancel_edit').off('click');
        };
    });