/* global define, $, BEME*/
define('page/albuminfo', ['comm/utils', 'comm/url', 'comm/request','comm/pushsong','comm/clickevent', 'comm/unveil', 'helper/app', 'helper/playerbar','page/myalbum', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mPush,mClick,mUnveil, mApp, mPlayerbar,mMyalbum, require, exports){
        "use strict";

        var _songList = {},
		_playList = {},
		isNew = mApp.changePlayList();

        var _renderInfo = function(jdata){

            var $box = $('#J_album-box');
		    var ver = mApp.getUA(1);
			 if(ver >0){
				$('#J_album-box .share').show().css("display","inline-block");
            }
	
            $box.find('.img-cover').attr('imgsrc', mUtils.imageUrl(jdata.album.url));
            $box.find('.title').text(jdata.album.name);
            $box.find('.desc').text(jdata.album.description);
            $('#num').text(jdata.album.cnt);
            $('#collection_num').text(jdata.album.collection_num);
            var html = '';
            $.each(jdata.tags, function(i, tag){
                var color = mUtils.getRandColor();
                html += '<li style="color:'+ color+';border-color:'+ color+'">'+tag['name']+'</li>';
            });
            $box.find('.tags').html(html);
		    $.each(jdata.songs,function(i,song){
                song['tagval'] = jdata.album.id;
            });
			
			if(isNew){
				
				$("#old_select").remove();
				$("#old_box").remove();
				$('#J_songnum').text(jdata.songs.length);
				
				html = mUtils.template('J_temp-item-new', {list:jdata.songs});
				$('#J_song-box').html(html);
				

				var songlist=[];
				 var songl = {};
				 $.each(jdata.songs,function(i,song){
					songl = {};
					songl['id'] = song.id;
					songl['name'] = song.name;
					songl['filesize'] = song.filesize;
					songl['song_time'] = song.song_time;
					songl['type'] = song.type;
					songl['md5']= song.md5;
					songl['url']= song.url;
					songl['song_type']= 'album';
					songl['tagval']=jdata.album.id;
					songl['link']=BEME.URL+'?m=weixin&id='+song.id+'&type=song&album_type=album&album_id='+jdata.album.id;
					songlist.push(songl);
				});
				_playList['image']=  mUtils.imageUrl(jdata.album.url);
				_playList['name']=jdata.album.name;
				_playList['song_list']=songlist;
				
			}else{
				
				$("#new_select").remove();
				$("#new_box").remove();
				$('#J_songnum').text(jdata.songs.length);
				html = mUtils.template('J_temp-item', {list:jdata.songs});
				$('#J_song-box').html(html);
				$.each(jdata.songs, function(i, info){
					info._type = 'album';
					info.tag = 'album';
					_songList[info.id] = info;
				});
			}
			
			if(jdata.albums && jdata.albums.length > 0){
                $.each(jdata.albums,function(i,album){
                    album['id'] = '#!m=albuminfo&id='+ album['id'];
                });
                html = mUtils.template('J_temp-albumitem', {list:jdata.albums});
                $('#J_album-list').html(html);
                $('#album_list').show();
                $("img.lazy").unveil();
            }
		


			mApp.showImage();

        };

        var _actionCollection = function(albumid, action){
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/collectionAlbum',
                data : {
                    album_id : albumid,
                    type : 'album',
                    action:action
                },
                xhrFields: {
                    withCredentials: true
                },
                type:'POST',
                successfn : function(jdata){
                    if(jdata.code===0){
                        var $box = $('#J_album-box .favorites');
                        if(action==='add'){
                            $box.addClass('favoritesed');
							$('#J_album-box #content').text('已收藏');
                            mApp.showTips('收藏成功！');
                        }else{
                            $box.removeClass('favoritesed');
							$('#J_album-box #content').text('收藏');
                            mApp.showTips('已取消收藏！');
                        }
                        $('#collection_num').text(jdata.data.count);
                    }
					else{
						//alert(action);
					}
                }
            });
        };

        //请求一些业务数据
        var _queryInfo = function(albumid){
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/albumList?id='+albumid,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
					else{
						//alert(1);
					}
                }
            });

            mRequest.getRequest({
                url : BEME.APIURL+'/albums/iscollection?type=album&album_id='+albumid,
                successfn : function(jdata){
                    if(jdata.code===0 && jdata.data === 1){
                        $('#J_album-box .favorites').addClass('favoritesed');
					    $('#J_album-box #content').text('已收藏');
                    }
                }
            });
        };

        //初始化一些点击事件
        var _initEvent = function(albumid){
            $('#J_album-desc').on('click', function(){
                var $this = $(this);
                if($this.attr('block')){
                    $this.css('display', '-webkit-box');
                    $this.attr('block', null);
                }else{
                    $this.css('display', 'block');
                    $this.attr('block', 1);
                }
            });

            $('#J_album-box .favorites').on('click', function(){
                var $this = $(this);
                var setting ={};
                setting['content']='确定不再收藏该专辑？';
                if($this.hasClass('favoritesed')){
                    mApp.showAlert(setting,function(){
                        _actionCollection(albumid, 'del');
                    });
                }else{
                    _actionCollection(albumid, 'add');
                }
            });

			if(isNew){
				$('#J_song-box').on('click', '.item .item-a', function(){
					mClick.audition_new(_playList,this);
				});
				
				$('#J_song-box').on('click', '.item-play', function(){
					 mClick.pushSong(this);
				});
				
				
				$('#play_edit_new').on('click',function(){
					mClick.playEdit('caction-box',isNew);
				});
				
			}else{
				$('#J_song-box').on('click', '.item .item-a', function(){
					 mClick.pushSong(this);
				});

				$('#J_song-box').on('click', '.item-play', function(){
					 mClick.audition(_songList,this);
				});

				$('.caction-box').on('click', '.play-btn', function(){
					mClick.pushAllSong(this);
				});
				
			

				$("#J_song-box").on('click','.checkbox',function() {
				   // mClick.check(this);
				});
				
				$('#play_edit').on('click',function(){
					mClick.playEdit('caction-box',isNew);
				});	
			}
			

			mClick.initSelectAllEvent('caction-box',isNew);
			
			$('#J_album-box .share').on('click',function(){
				mClick.shareToWeixin(albumid,'album',albumid);
			});



        };

        //初始化页面
        exports.init = function(){
            mApp.setTitle("专辑");
            $('.back-btn').show();
            mUtils.headerMenu();
            $('#myplay').show();
            var hashs = mUrl.getParams();
			mApp.showHeader();
            //请求数据
			mApp.backScroll();
			isNew = mApp.changePlayList();
            _queryInfo(hashs.id);

            _initEvent(hashs.id);
        };


        //反初始化绑定事件
        exports.uninit = function(){
            $('#J_album-desc,.select-all, #J_song-box, #J_album-box .favorites').off('click');
        };
    });