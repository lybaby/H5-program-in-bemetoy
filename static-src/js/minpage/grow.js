/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/grow', ['comm/utils', 'comm/url', 'comm/request','comm/clickevent', 'comm/unveil','helper/playerbar','helper/singleplayer','helper/app', 'require', 'exports'],
    function(mUtils, mUrl,mRequest,mClick,mUnveil,mPlayerbar, mSingleplayer,mApp, require, exports){
        "use strict";
        var _songList = {},
			_dataList ={},
            _playList={},
            isNew = mApp.changePlayList(),
			isLocal=mApp.changeAlbumLocal();
        var shareConfig = {
            title : "贝美时光说-成长场景",
            desc : '小囧熊英文乐园', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        };

        var _renderInfo = function(jdata,weixin){
            var ver1 = mApp.getUA(0);
            var ver2 = mApp.getUA(1);
            if(ver1 > 1 && ver2 > 0){
                $('.share_weixin').show();
            }
            if(ver1 > 1 && ver2 > 2){
                mApp.setTitle("育儿小妙招");
            }

            if(weixin == 1){
                $('.share_weixin').hide();
                $('.push-song').hide();
            }

            var $box = $('.grow-banner-box');
            $box.find('.img-cover').attr('src', mUtils.imageUrlStationHead(jdata.url,1));
            $box.find('.grow_name').text(jdata.name);
            $('#abstract').html(jdata.abstract);
            $('#description').html(jdata.description);
            var songList = $('#description').find('embed');
			_dataList['image'] = mUtils.imageUrlStationHead(jdata.url,1);
			_dataList['name'] = jdata.name;
			_dataList['song_list']=[];
            $.each(songList,function(i,song){
                _getSongInfo($(song).attr("song_id"),jdata.id,$(song),weixin)
            });
            var videoList = $('#description').find('video');
            $.each(videoList,function(i,video){
                var str ='';
                str = '<div class="song_list_name">'+$(video).attr("title")+'</div>';
                str +='<p class="play-video"><video src="'+$(video).attr("src")+'" controls="controls" poster="'+$(video).attr("width")+'"></video></p>';
                $(str).insertAfter($(video));
                $(video).remove();
            });
            var albumList = $('#description').find('article');
            $.each(albumList,function(i,album){
                _getAlbumInfo($(album).attr("album_id"),$(album),weixin);
            });

            var stationList = $('#description').find('station');
            $.each(stationList,function(i,station){
                _getStationInfo($(station).attr("album_id"),$(station),weixin);
            });

            var alist = $('#description').find('a');
            $.each(alist,function(i,a){
                var $this = $(a);
                var url=$this.attr('href');
                if(url.indexOf('book') >0){
                    $this.attr('href','javascript:void(0);');
                    $this.attr('url',url);
                    $this.attr('id','link_'+i);

                    $('#link_'+i).on('click',function(){
                        var jump_url = $(this).attr('url');
                        var type = jump_url.split('type=')[1];
                        if(+type == 0){
                            window.location.href=url;
                            return false;
                        }else{
                            if(((ver1 <= 2 || ver1 == undefined)&& (ver2 < 1 || ver2 == undefined)) || type == undefined ){
                                window.location.href=url;
                                return false;
                            }
                            else{
                                window.bemetoy.webViewTouchWithUrl(url,+type);
                            }
                        }
                    });

                }

            });

            var html ='';
            if(jdata.songs && jdata.songs.length > 0){
                if(weixin == 1){
                    html = mUtils.template('J_temp-item-weixin', {list:jdata.songs});
                }else{
					if(isNew){
						html = mUtils.template('J_temp-item-new', {list:jdata.songs});
						_playList = mApp.getSongJson(jdata.songs,mUtils.imageUrlStationHead(jdata.url,1),'成长场景');
					}else{
						html = mUtils.template('J_temp-item', {list:jdata.songs});
					    $.each(jdata.songs, function(i, info){
							info._type = 'album';
							info.tag = 'album';
							_songList[info.id] = info;
						});
					}
                }
                $('#J_song-box').html(html);
      
                $('#song_list_name').html(jdata.song_name);
                $('.song_list').show();
            }
            if(jdata.albums && jdata.albums.length > 0){
                $('#album_list_name').html(jdata.album_name);
                $.each(jdata.albums,function(i,album){
					album['album_id'] = album['id'];
                    if(weixin == 1){
                        album['id'] = '#!m=weixin&id='+ album['id'] + '&type=album';
                    }
                    else{
                        album['id'] = '#!m=albuminfo&id='+ album['id'];
                    }
					if(isLocal){
						album['id'] = 'javascript:void(0);';
					}
                });
                html = mUtils.template('J_temp-albumitem', {list:jdata.albums});
                $('#J_album-box').html(html);
                $('.album').show();
				if(isLocal){
					$("#J_album-box").on("click",'.item-a',function(){
						mClick.jumpLocalAlbum($(this));
					});
				}
                $("img.lazy").unveil();
            }
            mApp.backScroll();
			mApp.stopVideoMusic();

            shareConfig.title = jdata.name;
            shareConfig.desc = jdata.abstract;
            shareConfig.imgUrl = mUtils.imageUrl(jdata.url);
            if(weixin == 1){
                var weixin = require(['minpage/weixin'],function(context){
                    context.getWeixinConfig(shareConfig);
                });
            }
        };

        var _queryInfo = function(id,weixin){
            mRequest.getRequest({
                url : BEME.APIURL+'/grow/growInfo?id='+id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data,weixin);
                    }
                    else{
                    }
                }
            });
        };

        var _songinfo = function(jdata,id,obj,weixin){
            var str = '';
            var music_str = 'music_'+jdata.id;
            str = '<li class="music '+music_str+'" sid="'+jdata.id+'" md5="'+jdata.md5+'"  url="'+jdata.url+'" tag="grow" tagval="'+id+'"  size="'+jdata.filesize+'" type="'+jdata.type+'" >'+
            '<div class="title">'+jdata.name+'</div>'+
            '<a class="push-grow-song">推送给玩具</a>'+
            '</li>';
            var song_id = 'single_'+jdata.id;
            if(weixin == 1){
                mSingleplayer.initSingleWeixinPlayer(song_id,jdata,obj);
                $(str).insertAfter(obj);
                $('.push-grow-song').hide();
				obj.parent().addClass('music_div');
            }else{
				if(isNew){
					str = '<li class="music-new '+music_str+'" sid="'+jdata.id+'" md5="'+jdata.md5+'"  url="'+jdata.url+'" tag="grow" tagval="'+id+'"  size="'+jdata.filesize+'" type="'+jdata.type+'" >'+
					'<a class="play-new"><div class="text-over title">'+jdata.name+'</div>'+
					'<div class="time">'+mUtils.formatTime(jdata.song_time)+'</div></a>'+
					'<a class="push-grow-song">推送给玩具</a>'+
					'</li>';
					$(str).insertAfter(obj);
					 var songl = {};
					songl['id'] = jdata.id;
					songl['name'] = jdata.name;
					songl['filesize'] = jdata.filesize;
					songl['song_time'] = jdata.song_time;
					songl['type'] = jdata.type;
					songl['md5']= jdata.md5;
					songl['url']= jdata.url;
					songl['song_type']= 'grow';
					songl['tagval']=id;
					songl['link']=BEME.URL+'?m=weixin&id='+jdata.id+'&type=song&album_type=grow&album_id='+id;
					_dataList['song_list'].push(songl);
					obj.parent().addClass('muisc-div-new');				
				}else{
					mSingleplayer.initSinglePlayer(song_id,jdata,obj);
					$(str).insertAfter(obj);
					obj.parent().addClass('music_div');
				}
            }
            obj.remove();
			if(isNew){
			  $('.' + music_str).on('click','.play-new',function(){
					mClick.audition_new(_dataList,$(this));
				});
			}
            $('.' + music_str).on('click','.push-grow-song',function(){
                mClick.pushSong($(this));
            });

        };

        var _getSongInfo = function(song_id,id,obj,weixin){
            mRequest.getRequest({
                url : BEME.APIURL+'/grow/songInfo?id='+song_id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _songinfo(jdata.data,id,obj,weixin);
                    }
                    else{
                    }
                }
            });
        };

        var _albuminfo = function(jdata,obj,weixin){
            var html='';
            $.each(jdata.tags, function(i, tag){
                var color = mUtils.getRandColor();
                html += '<li style="color:'+ color+';border-color:'+ color+'">'+tag['name']+'</li>';
            });
            var str = '';
            if(weixin == 1){
                str = '<div class="album_list" ><a class="album_link" href="#!m=weixin&type=album&id='+jdata.id+'">';
            }else{
                str = '<div class="album_list" ><a class="album_link" href="#!m=albuminfo&id='+jdata.id+'">';
            }
			if(isLocal){
				 str = '<div class="album_list" id="album_'+jdata.id+'" ><a class="album_link" href="javascript:void(0);" id="'+jdata.id+'">';
			}

            str +='<img class="album_img" src="'+jdata.url +'">'+
            '<div class="title">'+jdata.name+'</div>'+
            '<ul class="tags">'+html+'</ul>'+
            '</a></div>';
            $(str).insertAfter(obj);
            obj.remove();
			if(isLocal){
				$("#album_"+jdata.id).on("click",".album_link",function(){
					mClick.jumpLocalAlbum($(this));
				});
			}
        };

        var _getAlbumInfo = function(album_id,obj,weixin){
            mRequest.getRequest({
                url : BEME.APIURL+'/grow/albumInfo?id='+album_id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _albuminfo(jdata.data,obj,weixin);
                    }
                    else{
                    }
                }
            });
        };

        var _stationinfo = function(jdata,obj,weixin){
            var html='';
            var str = '';
            if(weixin == 1){
                str = '<div class="album_list" ><a class="album_link" href="#!m=weixin&type=station&id='+jdata.id+'">';
            }else{
                str = '<div class="album_list" ><a class="album_link" href="#!m=fminfo&id='+jdata.id+'">';
            }

            str +='<img class="station_img" src="'+jdata.head_url +'">'+
            '<div class="name">'+jdata.name+'</div>'+
            '<div class="author">主播：'+jdata.author+'</div>'+
            '</a></div>';
            $(str).insertAfter(obj);
            obj.remove();
        };


        var _getStationInfo = function(station_id,obj,weixin){
            mRequest.getRequest({
                url : BEME.APIURL+'/grow/stationInfo?id='+station_id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _stationinfo(jdata.data,obj,weixin);
                    }
                    else{
                    }
                }
            });
        };

        var  _initEvent = function(id,weixin) {

            $('.share_weixin').on('click',function(){
                mClick.shareToWeixin(id,'grow');
            });

            if(weixin == 1){
                $('#J_song-box').on('click', '.item', function(){
                    var $this = $(this),
                        sid = $this.attr('sid');
                    mPlayerbar.initWeixinPlayer($this, _songList[+sid]);
                });
            }
            else{
				if(isNew){
					$('#J_song-box').on('click', '.item .item-a', function(){
						mClick.audition_new(_playList,this);
					});

					$('#J_song-box').on('click', '.item-play', function(){
						mClick.pushSong(this);
					});
				}else{
					$('#J_song-box').on('click', '.item .item-a', function(){
						mClick.pushSong(this);
					});

					$('#J_song-box').on('click', '.item-play', function(){
						mClick.audition(_songList,this);
					});
				}

            }
			

        };

        exports.init = function(){

            var hashs = mUrl.getParams();
            if(hashs.weixin == 1){
                mApp.setTitle("贝美时光说-成长场景");
            }
            else{
                mApp.setTitle("成长场景");
            }
            _queryInfo(hashs.id,hashs.weixin);
            _initEvent(hashs.id,hashs.weixin);

        };


        exports.uninit = function(){

        };
    });