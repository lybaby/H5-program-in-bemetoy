/* global define, $, BEME*/
define('minpage/topicinfo', ['comm/utils', 'comm/url', 'comm/request','comm/pushsong','comm/clickevent', 'helper/app', 'helper/playerbar','page/myalbum', 'require', 'exports'],
function(mUtils, mUrl, mRequest,mPush,mClick, mApp, mPlayerbar,mMyalbum, require, exports){
    "use strict";

    var _songList = {},
	_playList = {},
	isNew=false;

    var _renderInfo = function(jdata){
        $('#J_top-box img').attr('src', mUtils.imageUrlStationHead(jdata.topic.banner,1));
        $('#J_album-title').text(jdata.topic.name);
        $('#J_album-desc').text(jdata.topic.description);
        $('#J_songnum').text(jdata.songs.length);
		$.each(jdata.songs,function(i,song){
			song['tagval'] = jdata.topic.id;
		});
		
		var ver = mApp.getUA(1),html='';
		 if(ver > 0){
			$('.caction-box .share').show();
		}
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
				songl['song_type']= 'topic';
				songl['tagval']=jdata.topic.id;
				songl['link']=BEME.URL+'?m=weixin&id='+song.id+'&type=song&album_type=topic&album_id='+jdata.topic.id;
				songlist.push(songl);
			});
			_playList['image']=   mUtils.imageUrlStationHead(jdata.topic.banner,1);
			_playList['name']=jdata.topic.name;
			_playList['song_list']=songlist;			
		}else{
			$('#J_songnum').text(jdata.songs.length);
			html = mUtils.template('J_temp-item', {list:jdata.songs});
			$('#J_song-box').html(html);
			$.each(jdata.songs, function(i, info){
				info._type = 'topic';
				info.tag = 'topic';
				_songList[info.id] = info;
			});
		}


    };

    //请求一些业务数据
    var _queryInfo = function(albumid){
        mRequest.getRequest({
            url : BEME.APIURL+'/albums/topicList?id='+albumid,
            successfn : function(jdata){
                mApp.loaded();

                if(jdata.code===0){
                    _renderInfo(jdata.data);
                }
            }
        });
    };

    //初始化一些点击事件
    var _initEvent = function(albumid){
		
	
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
				mClick.playEdit('caction-box',this);
			});	
		}
		
			
        mClick.initSelectAllEvent('caction-box',isNew);
		
		$('.caction-box').on('click', '.share', function(){
			mClick.shareToWeixin(albumid,'topic',albumid);
		});
    };

    //初始化页面
    exports.init = function(){
        mApp.setTitle("专题");
        $('.back-btn').show();
        mUtils.headerMenu();
        $('#myplay').show();
        var hashs = mUrl.getParams();
		mApp.showHeader();
		
		isNew = mApp.changePlayList();
        //请求数据
        _queryInfo(hashs.id);

        _initEvent(hashs.id);
    };


    //反初始化绑定事件
    exports.uninit = function(){
        $('#J_album-desc, #J_song-box').off('click');
    };
});