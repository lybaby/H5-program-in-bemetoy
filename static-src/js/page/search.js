/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/search', ['comm/utils', 'comm/url', 'comm/request','comm/clickevent', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mClick, mApp, mTemp, require, exports){
        "use strict";
		var inputString = '';
        var _songList = {};
		var _isJump_album = false;
		var _isJump_station = false;
		
        var _renderInfo = function(jdata){
			 var $box = $('.search_suggest');
			 var html = '';
			 html = mUtils.template('J_temp_hot_list', {list:jdata.hot});
            $box.find('.hot_ul').html(html);
			$('#search_input').focus();
            mApp.backScroll();
        };

        var _queryInfo = function(type,name){
			mRequest.getRequest({
                url : BEME.APIURL+'/search/searchHot',
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
                url : BEME.APIURL+'/search/searchUser',
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        var html = mUtils.template('J_temp_search_history', {list:jdata.data.users});
						$('.history_ul').html(html);
						$('.search_history').show();
                    }
					else{
						$('.search_history').hide();
					}
				}
			});
			name = decodeURI(name);
			//alert(name);
			if(type == 'album'){
				
				 $('#search_input').val(name);
				 $('.search_header .delete-btn').show();
				 _isJump_album = true;
				 $('.result_header .h_album').click();
				 $('.header_btn').addClass('enter_btn');
			}
			if(type == 'station'){
				 $('#search_input').val(name);
				 $('.search_header .delete-btn').show();
				 _isJump_station = true;
				 $('.result_header .h_station').click();
				 $('.header_btn').addClass('enter_btn');
			}
		};
		
		var _renderSongInfo = function(jdata,name){
			var $box = $('.search_result');
			$box.find('.result_header').find('.cur').removeClass('cur');
			$box.find('.result_header').find('.h_song').addClass('cur');
			var html = '';
			_songList ={};
			$.each(jdata.songs, function(i, info){
			    info._type = 'album';
                info.tag = 'album';
                _songList[info.id] = info;
            });
			_changeNameColor(jdata.songs,name)
			html = mUtils.template('J_temp_song_list', {list:jdata.songs});
			$('.search_result').find("#song-box").html(html);
			$('.search_suggest').hide();
			$('.search_list').hide();
			$('.album_list').hide();
			$('.station_list').hide();
			$('.song_list').show();
			$('.no_song').hide();
			$box.show();
			 $('#song-box').off('click');
			$('#song-box').on('click', '.item .item-a', function(){
                 mClick.pushSong(this);
            });

            $('#song-box').on('click', '.item-play', function(){
				 mClick.audition(_songList,this);
            });	
		};
		
		var _renderAlbumInfo = function(jdata,name){
			var $box = $('.search_result');
			$box.find('.result_header').find('.cur').removeClass('cur');
			$box.find('.result_header').find('.h_album').addClass('cur');
			var html = '';
			_changeNameColor(jdata.albums,name)
			html = mUtils.template('J_temp_album_list', {list:jdata.albums});
			$('.search_result').find("#album_list").html(html);
			$('.search_suggest').hide();
			$('.search_list').hide();
			$('.album_list').show();
			$('#album_list').show();
			$('.station_list').hide();
			$('.song_list').hide();
			$('.no_song').hide();
			$box.show();
		};
		
		var _renderStationInfo = function(jdata,name){
			var $box = $('.search_result');
			$box.find('.result_header').find('.cur').removeClass('cur');
			$box.find('.result_header').find('.h_station').addClass('cur');
			var html = '';
			_changeNameColor(jdata.stations,name)
			html = mUtils.template('J_temp_station_list', {list:jdata.stations});
			$('.search_result').find("#station_list").html(html);
			$('.search_suggest').hide();
			$('.search_list').hide();
			$('.album_list').hide();
			$('.station_list').show();
			$('#station_list').show();
			$('.song_list').hide();
			$('.no_song').hide();
			$box.show();
		};
		
		var _renderNoSongInfo = function(){
			$('.search_result').show();
			$('.no_song').show();
			$('.search_suggest').hide();
			$('.search_list').hide();
			$('.search_result').find("#station_list").html('');
            $('.search_result').find("#album_list").html('');
            $('.search_result').find("#song-box").html('');
			mRequest.getRequest({
                url : BEME.APIURL+'/listen/customRandom',
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        var html = mUtils.template('J_temp_song_list', {list:jdata.data});
                        $('#random_song').html(html);
						_songList ={};
						$.each(jdata.data, function(i, info){
							info._type = 'album';
							info.tag = 'album';
							_songList[info.id] = info;
						});
						
						$('#random_song').off('click');
						
						$('#random_song').on('click', '.item .item-a', function(){
							 mClick.pushSong(this);
						});

						$('#random_song').on('click', '.item-play', function(){
							 mClick.audition(_songList,this);
						});	
                    }
                }
            });
		};
		
		var _changeNameColor = function(lists,name){
			if(name == '' || lists.length <= 0){
				return;
			}
			$.each(lists,function(i,list){
				var na = list['name'];
				var reg = /(.)(?=.*\1)/g;
				var l = list['name'];
				//l = na.replace(reg, "");
				name = name.replace(reg, "");
				for(var j =0; j < name.length;j++){
					if(j >=1 && name[j] == name[j-1]){
						continue;
					}
					if(name[j] == ' '){
						continue;
					}
					//na = na.replace(new RegExp(name[j],"g"),'<span>'+name[j]+'</span>');
					l = l.replace(new RegExp(name[j],"g"),'$'+name[j]+'#');
					l = l.replace(new RegExp(name[j].toUpperCase(),"g"),'$'+name[j].toUpperCase()+'#');
				}
				console.log(l);
				l = l.replace(new RegExp("\\$","g"),'<span>');
				l = l.replace(new RegExp("\\#","g"),'</span>');
				console.log(l);
				list['name'] = l;
			});
		};
		
		var _searchSongInfo = function(name){			
			mRequest.getRequest({
                url : BEME.APIURL+'/search/searchByWord?type=song&name='+name,
                successfn : function(jdata){
                    mApp.loaded();
					var realname = $('#search_input').val().replace(/(^\s*)|(\s*$)/g, "");
                    if(jdata.code===0){
					
                        _renderSongInfo(jdata.data,realname);
						$('#song-box').show();
						_addUserInfo(realname,jdata.data.songs.length,'song');
                    }
					else{
						$('#song-box').hide();
						$('#album_list').hide();
						$('#station_list').hide();
						$('.song_list').show();
						_renderNoSongInfo();
						_addUserInfo(realname,0,'song');
					}
				}
			});
		};
		
		var _searchAlbumInfo = function(name){			
			mRequest.getRequest({
                url : BEME.APIURL+'/search/searchByWord?type=album&name='+name,
                successfn : function(jdata){
                    mApp.loaded();
					var realname = $('#search_input').val().replace(/(^\s*)|(\s*$)/g, "");
                    if(jdata.code===0){
                        _renderAlbumInfo(jdata.data,realname);
						$('#album-box').show();
						_addUserInfo(realname,jdata.data.albums.length,'album');
                    }
					else{
						$('#album_list').html('');
						$('#album_list').hide();
						_renderNoSongInfo();
						_addUserInfo(realname,0,'album');
					}
				}
			});
		};
		
		var _searchStationInfo = function(name){			
			mRequest.getRequest({
                url : BEME.APIURL+'/search/searchByWord?type=station&name='+name,
                successfn : function(jdata){
                    mApp.loaded();
					var realname = $('#search_input').val().replace(/(^\s*)|(\s*$)/g, "");
                    if(jdata.code===0){
                        _renderStationInfo(jdata.data,realname);
						$('#station-box').show();
						_addUserInfo(realname,jdata.data.stations.length,'station');
                    }
					else{
						$('#station_list').html('');
						$('#station_list').hide();
						_renderNoSongInfo();
						_addUserInfo(realname,0,'station');	
					}
				}
			});
		};
		
		
		var _addUserInfo = function(name,num,type){
			mRequest.getRequest({
                url : BEME.APIURL+'/search/addUserInfo',
				data:{
					name:name,
					num:num,
					type:type
				},
                successfn : function(jdata){
                    mApp.loaded();              
				}
			});
		};
		
		var _deleteUserInfo = function(id){
			mRequest.getRequest({
                url : BEME.APIURL+'/search/delUserInfo',
				data:{
					id:id
				},
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){    
                    }
					else{
					}
				}
			});
		};
		
		var _showRecommend = function(name){
			mRequest.getRequest({
                url : BEME.APIURL+'/search/searchRecommend',
				data:{
					name:name
				},
                successfn : function(jdata){
					var html ='';
					if(jdata.code === 0){
					    html = mUtils.template('J_temp_search_list', {list:jdata.data});   
					}
					$('.search_ul').html(html);  
				}
			});
		};
		
		
		var _showFirstPage = function(){
			$('.search_list').hide();
			$('.search_suggest').show();
			$('.search_header .delete-btn').hide();
			$('.search_result').hide();
			$('.no_song').hide();
			$('.header_btn').removeClass('enter_btn');
			//$('.header_btn').text('取消');
			_queryInfo();
			
		};
		
		var _searchFirst = function(){
			var $box = $('.search_result');
			$box.find('.result_header').find('.cur').removeClass('cur');
			$box.find('.result_header').find('.h_song').addClass('cur');
			$box.find('.header_song').find('.current').removeClass('current');
			$box.find('.header_song').find('.h_all_1').addClass('current');
			$('.search_header .delete-btn').show();
		};
		
		
		

        var  _initEvent = function() {
			
			$('#search_input').on('input propertychange',function(){
				var inputText = $('#search_input').val().replace(/(^\s*)|(\s*$)/g, "");
				if(inputText != inputString && inputText != ''){
					inputString = inputText;
					_showRecommend(inputText);
				}
				if(inputText == ''){
					_showFirstPage();
				}else{
					$('.search_list').show();
					$('.search_suggest').hide();
					$('.search_header .delete-btn').show();
					$('.search_result').hide();
					$('.header_btn').addClass('enter_btn');
					//$('.header_btn').text('进入');
				}
				
			});	
			
			
			$('#search_input').on('keypress',function(event){
					if(event.keyCode == "13"){
						$('.header_btn').click();				
					}
				});
			
			$('.header_btn').on('click',function(){
				var $this = $(this);
				if($this.hasClass('enter_btn')){
					 $('.result_header .h_song').click();
					 $('.header_song .h_all_1').click();
				}else{
					
				}
			});
			
			$('.history_ul').on('click','.search_name',function(){
				var name = $(this).text();
				_searchSongInfo(name);
				$('#search_input').val(name);
				_searchFirst();
			});
			
			$('.history_ul').on('click','.delete',function(){
				var id = $(this).attr('_id');
				var setting ={};
				setting['content']='确定删除所选历史？';
				mApp.showAlert(setting,function(){
					_deleteUserInfo(id);
					_queryInfo();
				});
				
			});
			
			$('.clear_list').on('click','a',function(){
				var setting ={};
				setting['content']='确定删除所有历史？';
				mApp.showAlert(setting,function(){
					_deleteUserInfo(0);
					_queryInfo();
				});
			});
			
						
			
			$('.result_header').on('click','li',function(){
				var $this = $(this);
				$this.parent().find('.cur').removeClass('cur');
				$this.addClass('cur');	
				var type = $this.attr("_type");
				var search_text = $('#search_input').val().replace(/(^\s*)|(\s*$)/g, "");
				if(type == 'song'){
					$('.song_list').show();
					$('.album_list').hide();
					$('.station_list').hide();
					_searchSongInfo(search_text);
					return;
				}
				if(type == 'album'){
					$('.song_list').hide();
					$('.album_list').show();
					$('.station_list').hide();
					if(_isJump_album){
						_searchAlbumInfo(search_text);
					}else{
						window.location.href='#!m=search&type=album&name='+search_text;	
						//window.location.reload(false);
					}
					return;
				}
				if(type == 'station'){
					$('.song_list').hide();
					$('.album_list').hide();
					$('.station_list').show();
					if(_isJump_station){
						_searchStationInfo(search_text);
					}else{
						window.location.href='#!m=search&type=station&name='+search_text;	
						//window.location.reload(false);
					}
					return;
				}				
			});
			
			$('#header_song').on('click','li',function(){
				var $this = $(this);
				$this.parent().find('.current').removeClass('current');
				$this.addClass('current');	
				var type = $this.attr("_id");
				var search_text = $('#search_input').val().replace(/(^\s*)|(\s*$)/g, "");
				if(type != ''){
					search_text +=  '@tags_name' + type;
				}
				
				_searchSongInfo(search_text);
			});
			
			$('.search_ul').on('click','li',function(){
				var $this = $(this);
				$('#search_input').val($this.text());
				$('.header_btn').click();
				_searchFirst();
			});
			
			$('.hot_ul').on('click','a',function(){
				var $this = $(this);
				_searchSongInfo($this.text());
				$('#search_input').val($this.text());
				_searchFirst();
			});
			
			$('.delete-btn').on('click',function(){
				$('#search_input').val('');
				inputString = '';
				_showFirstPage();
			});
				

        };

        exports.init = function(){
            var hashs = mUrl.getParams();
            mUtils.headerMenu();
			mApp.showHeader();
			mApp.setTitle("搜索");
			_initEvent();
            _queryInfo(hashs.type,hashs.name);

        };


        exports.uninit = function(){
			$('.item-option-showplay').find('.player').jPlayer('stop');
        };
    });