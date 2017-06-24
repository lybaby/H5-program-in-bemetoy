/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/bemebearinfo', ['comm/utils', 'comm/url','helper/playerbar', 'comm/request' ,'minpage/bemeipindex','comm/clickevent','helper/app', 'helper/temphtml','helper/jrange', 'require', 'exports'],
    function(mUtils, mUrl,mPlayerbar, mRequest,mBeme,mClick, mApp, mTemp, jrange, require, exports){
        "use strict";

        var _songList = {},
		_dataList ={},
		_playList={},
		isNew = mApp.changePlayList();
        var shareConfig = {
            title : "贝美童趣馆",
            desc : '小囧熊英文乐园', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        };

        var _renderInfo = function(jdata,weixin){
            var $box = $('.bear-info-page');
            var ver1 = mApp.getUA(0);
            if(ver1 == 1){
                $('.main-header').show();
                $('.main-header .back-btn').show();
                $('#J_wrapper').css('padding','1.1rem 0 0 0');
                $('.sub').hide();
            }
            if(weixin == 1){
                $('.share_weixin').hide();
                $('.push-song').hide();
            }
			mApp.showShare();
			
			
            $box.find('.play-video').html(jdata.video_url);
            $box.find('.task-text').html(jdata.place_hello);
            $box.find('.single-word').html(jdata.description);
            $box.find('.sentence-word').html(jdata.answer);
            $box.find('.play-video').find('video').attr('poster',jdata.url);
			_playList['image']= jdata.url;
			_playList['name']=jdata.sub_name;
            var title = '';
            title = '第'+jdata.sequence+'期：'+ jdata.sub_name;
            var date = mBeme.changeDate(jdata.update_time) + '更新';
            $('#new-title').text(title);
            $('#new-day').text(date);

            //shareConfig.title = jdata.name;
            shareConfig.desc = "《小囧熊英文乐园》"+jdata.name;
            shareConfig.imgUrl = jdata.url;

            if(weixin == 1){
				var html = mUtils.template('J_temp-item-song', {list:jdata.song});
			    $('#play-music').html(html);
				var $this = $box.find(' .music-list');
                mPlayerbar.initIpIndexPlay($this, jdata.song[0],2);
                $('.push-bear-song').hide();
            }
            else{
				if(isNew){
				   var html =  BEME.template(mTemp.ipTempHtml, {list:jdata.song});
				   $('#play-music').css('background','white');
				   $('#play-music').html(html);
				   _dataList = mApp.getSongJson(jdata.song,jdata.url,jdata.name);
			   }
			   else{
					var html = mUtils.template('J_temp-item-song', {list:jdata.song});
					$('#play-music').html(html);
					var $this = $box.find(' .music-list');
					mPlayerbar.initIpIndexPlay($this, jdata.song[0],4);
			   }	
            }

            if(weixin == 1){
                var weixin = require(['minpage/weixin'],function(context){
                    context.getWeixinConfig(shareConfig);
                });
            }
            //mApp.getWeixinConfig(shareConfig);
            _songSingleEvent();
            mApp.backScroll();
            mApp.stopVideoMusic();
        };

        var _renderList = function(jdata,id,weixin,isShow){
            if(!isShow){
                if(jdata.count >24){
                    $('.more-all').show();
                    $('.more-all').addClass('showed');
                    $('.more-all').text('查看全部');
                    jdata.list=jdata.list.slice(0,24);
                }
                else{
                    $('.more-all').hide();
                }
                $.each(jdata.list,function(i,ip){
                    if(id == ip['id']){
                        ip['isCurrent'] = 1;
                    }
                    if(weixin == 1){
                        ip['id'] = ip['id'] + '&weixin=1';
                    }
                });
                var html = mUtils.template('J_temp-item', {list:jdata.list.reverse()});
                $('.bear-table').html(html);
            }
            else{
                $('.more-all').show();
                $('.more-all').removeClass('showed');
                $('.more-all').text('点击收起');
                $.each(jdata.list,function(i,ip){
                    if(id == ip['id']){
                        ip['isCurrent'] = 1;
                    }
                    if(weixin == 1){
                        ip['id'] = ip['id'] + '&weixin=1';
                    }
                });
                var html = mUtils.template('J_temp-item', {list:jdata.list.reverse()});
                $('.bear-table').html(html);
            }

        };

        var _renderSongList = function(data,weixin){
            if(data){
                if(weixin == 1){
                    var html = mUtils.template('J_temp-item-weixin', {list:data});
                    $('#song-list-box').html(html);
                }
                else{
					var html = '';
                   	if(isNew){
						var songlist=[];
						var songl = {};
						 $.each(data,function(i,song){
							songl = {};
							songl['id'] = song.id;
							songl['name'] = song.name;
							songl['filesize'] = song.filesize;
							songl['song_time'] = song.song_time;
							songl['type'] = song.type;
							songl['md5']= song.md5;
							songl['url']= song.url;
							songl['song_type']= song.tag;
							songl['tagval']=song.tagval;
							songl['link']=BEME.URL+'?m=weixin&id='+song.id+'&type=song&album_type='+song.tag+'&album_id='+song.tagval;
							songlist.push(songl);
						});
						_playList['song_list']=songlist;
						html = mUtils.template('J_temp-item-song-new', {list:data, flag:true});
					}else{
						 $.each(data, function(i, info){
							info._type = 'album';
							_songList[info.id] = info;
						});
						html = mUtils.template('J_temp-item-somg', {list:data});
				  
					}
					  $('#song-list-box').html(html);
					  _songEvent();
                }

               
            }
        };


        var _queryInfo = function(id,type,weixin){
            mRequest.getRequest({
                url : BEME.APIURL+'/ip/ipInfo?id='+id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data,weixin);
                    }
                    else{
                        //alert(1);
                    }
                }
            });

            mRequest.getRequest({
                url : BEME.APIURL+'/ip/ipList',
                data:{
                    type:type,
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderList(jdata.data,id,weixin,false);
                    }
                    else{
                        //alert(1);
                    }
                }
            });

            mRequest.getRequest({
                url : BEME.APIURL+'/ip/ipSongList',
                data:{
                    type:type,
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderSongList(jdata.data,weixin);
                    }
                    else{
                    }
                }
            });
            if(weixin == 1){
                $('.back-index').attr('href','#!m=bemebearindex&weixin=1&type='+type);
            }else{
                $('.back-index').attr('href','#!m=bemebearindex&type='+type);
            }

        };





        var _getAllPage = function(id,isShow){
            var type = 2;
            mRequest.getRequest({
                url : BEME.APIURL+'/ip/ipList',
                data:{
                    type:type
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderList(jdata.data,id,weixin,isShow);
                    }
                    else{
                    }
                }
            });
        };
		
		var _songEvent = function(){
			if(isNew){
				$('#song-list-box').on('click', '.item .item-a', function(){
						mClick.audition_new(_playList,this);
				});
				
				 $('#song-list-box').on('click', '.item .item-play', function(){
					 mClick.pushSong($(this).parent());
				});
			}else{

				
				$('#song-list-box').on('click','.item .item-a',function(){
					mClick.pushSong($(this).parent());
				});
			
				
				$('#song-list-box').on('click', '.item-play', function(){
					mClick.audition(_songList,this);
				});
			}
		};

        var _songSingleEvent = function(){
            if(isNew){
                $('#play-music').on('click','.newTitle',function(){
                    mClick.audition_new(_dataList,this);
                });

                $('#play-music').on('click','.newPush',function(){
                    mClick.pushSong($(this))
                });
            }else{
                $('#play-music').on('click','.music-list .push-bear-song',function(){
                    mClick.pushSong($(this));
                });
            }
        };

        var  _initEvent = function(id,weixin) {

            window.onscroll = function(){
                var played_top = $('.title-box').offset().top;
                var waiting_top = $('#bear-song-list').offset().top;
                var scroll_height = $(window).scrollTop();
                if(waiting_top - scroll_height < played_top){
                    //      $('#bear-song-list').addClass('push-bear-fixed');
                }else{
                    //      $('#bear-song-list').removeClass('push-bear-fixed');
                }
            };

            $('.title-box').on('click',function(){
                var id = $(this).attr('value');
                var herf = '?m=bemeipinfo&id='+id+'&type=1';
                window.location.href=herf;
            });


            if(weixin == 1){
                $('#song-list-box').on('click', '.item', function(){
                    var $this = $(this),
                        sid = $this.attr('sid');
                    mPlayerbar.initWeixinPlayer($this, _songList[+sid]);
                });
            }

            $(".more-all").on('click',function(){
                var $this = $(this).hasClass('showed');
                if($this){
                    _getAllPage(id,true);
                }
                else{
                    _getAllPage(id,false);
                }
            });


            $('.share_weixin').on('click',function(){
                mClick.shareToWeixin(id,'ip','ipinfo',2);
            });

            $('.bear-table').on('click','td',function(){
                var herf = $(this).attr('href');
                window.location.href=herf;
                // window.location.reload();
                return ;
            });


        };

        exports.init = function(){
            mApp.setTitle("小囧熊英文乐园");
            var hashs = mUrl.getParams();
            _queryInfo(hashs.id,hashs.type,hashs.weixin);
            mApp.hideAllBox();
            _initEvent(hashs.id,hashs.weixin);

        };


        exports.uninit = function(){
            $('#play-music').off('click');
            window.onscroll = null;
        };
    });