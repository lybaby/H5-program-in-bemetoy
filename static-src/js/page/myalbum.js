/* global define, $, BEME*/
define('page/myalbum', ['comm/utils', 'comm/url', 'comm/request','comm/clickevent', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mClick,mApp, mTemp, require, exports){
        "use strict";

        var _renderInfo = function(jdata){
			$('.select-all').hide();
			$('.myalbum .title').show();
			if(jdata.length){
				var html = mUtils.template('J_temp-pitem', {list:jdata});
				$('#J_play_list').html(html);
				$('#J_playnum').text(jdata.length);
				$('#J_playnum_1').text(jdata.length);	
			}
			else{
				$('#J_play_list').html('');
				$('#J_playnum').text(0);
				$('#J_playnum_1').text(0);	
			}
			mApp.backScroll();
        };

        var _queryInfo = function(callback){

            mRequest.getRequest({
                url : BEME.APIURL+'/albums/userPlayList',
				type:'post',
                data:{
                    uid:mUtils.getUid()
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        callback(jdata.data);
                    }
                }
            });
        };

        var _getInfo = function(){
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/userPlayList',
				type:'post',
                data:{
                    uid:mUtils.getUid()
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
                }
            });
        }

        var _deletePlayList = function(ids){
			var playList = $('.item');
			var arr = [];
			$.each(playList,function(i,play){
                    var $this = $(play);
                    $this.find('.checkbox').attr('value','0');
                    $($this.find('.checkbox')).find('img').attr('src','./static/images/xuanzekong.png');
			});
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/deletePlayList',
                data : {ids:ids},
                type : 'POST',
                successfn : function(jdata){
                    if(jdata.code===0){
                        mApp.showTips('歌单已删除');
                         _getInfo();
                    }else{
                        mApp.showTips('歌单删除失败');
                    }
                }
            });

        };

        var _newAlbum = function(name){
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/addPlayList',
				data : {
                    name : name,
                    uid:mUtils.getUid()
                },
                type : 'POST',
                successfn : function(jdata){
                    $('#J_album-alert .ok-btn').removeClass('disabled');
                    //alert('添加'+jdata.message);
                    if(jdata.code===0){
                        $('#J_album-alert .new-myalbum').removeClass('showinput');
                        $('#J_album-alert .input').val('');
                    }
					var $myBox = $('#J_album-alert'),
                    ids = $myBox.attr('ids'),
                    type = $myBox.attr('type'),
                    album_ids = $myBox.attr('album_ids');
					_addToAlbum(jdata.data, ids, type,album_ids,'');
                    //exports.showAddMyablumBox();
					/*_queryInfo(function(jdata){
					var html = BEME.template(mTemp.myalbumItemHtml, {list:jdata});
						$('#J_album-alert').find('.item').remove();
						$('#J_album-alert').find('.list').append(html);
					});*/
                }
            });
        };

        var _addToAlbum = function(albumid, ids, type,album_ids,className){
            type = type || 'album';
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/insertIntoPlayList',
                data : {play_id : albumid, type:type, song_ids:ids,album_ids:album_ids},
                type : 'POST',
                successfn : function(jdata){
                    mApp.showTips(jdata.message+'加入歌单');
                    if(jdata.code===0){
                        $('#J_album-alert, #J_body-mask').hide();
						if($('.caction-box').length){
							$('.caction-box').show();
						}
						if($('.title').length){
							$('.title').show();
						}
                        $('.'+className).show();
                        $('.select-all').hide();
                        $('.select-all').find('.left').attr('value','0');
                        $('.select-all').find('img').attr('src','./static/images/xuanzekong.png');
						var playList = $('.item');
						$.each(playList,function(i,play){
							var $this = $(play);
							$this.find('.checkbox').attr('value','0');
							$($this.find('.checkbox')).find('img').attr('src','./static/images/xuanzekong.png');
						});
                        $('.item').find('.checkbox').hide();
						if($('.item').find('.station').length){
							$('.item').find('.checkbox').show();
						}
                        if(mApp.changePlayList()){
                            $('.item').find('.item-play img').show();
                        }
                    }
                }
            });
        };

        var _initAddMyablumBoxEvent = function($box,className){
            $('#J_album-alert').on('click', '.close-btn', function(){
                $('#J_album-alert, #J_body-mask').hide();
				mApp.hideMask();
				 $('#J_album-alert .new-myalbum').removeClass('showinput');
            }).on('click', '.new-btn', function(){
                $('#J_album-alert .new-myalbum').addClass('showinput');
				$('#J_album-alert .new-myalbum').find('.input').focus();
            }).on('click', '.cancel-btn', function(){
                $('#J_album-alert .new-myalbum').removeClass('showinput');
            }).on('click', '.ok-btn', function(){
                var $this = $(this),
                    $inp = $('#J_album-alert .input'),
                    val = $.trim($inp.val());
                if($this.hasClass('disabled')){
                    return false;
                }

                if(!val){
                    return $inp.focus();
                }

                _newAlbum(val);
                $('#J_album-alert .ok-btn').addClass('disabled');
            }).on('click', '.item', function(){
                var $this = $(this),
                    albumid = $this.attr('albumid');

                var $myBox = $('#J_album-alert'),
                    ids = $myBox.attr('ids'),
                    type = $myBox.attr('type'),
                    album_ids = $myBox.attr('album_ids');


                _addToAlbum(albumid, ids, type,album_ids,className);
            });
        };


        exports.showAddMyablumBox = function(ids, type,album_ids,className){
            var $myBox = $('#J_album-alert');
            if(ids === ''){
                //mApp.showAlert('您尚未选择任何歌曲！',true);
                return false;
            }
            if($myBox.length<1){
                $(document.body).append(mTemp.myalbumAlertHtml);
                $myBox = $('#J_album-alert');
                _initAddMyablumBoxEvent($myBox,className);
            }

            if(ids){
                $myBox.attr({
                    ids : ids,
                    type : type,
                    album_ids:album_ids
                }).show();
            }

			 mApp.showMask();
            //$('#J_body-mask').show();
            $myBox.show();
			$('#J_album-alert .close-btn').show();
            _queryInfo(function(jdata){
                var html = BEME.template(mTemp.myalbumItemHtml, {list:jdata});
                $myBox.find('.item').remove();
                $myBox.find('.list').append(html);
            });
            return true;
        };


        var  _initEvent = function(){
			
			$('#play_edit').on('click',function(){
				if($('.item').find('.checkbox')[0].style.display === "none" || $('.item').find('.checkbox')[0].style.display === '') {
                    $('.select-all').show();
                    $('.myalbum .title').hide();
                    $('.item').find('.checkbox').show();
                    if($('.item').find('.checkbox span').length){
                        $('.item').find('.checkbox span').hide();
                        $('.item').find('.checkbox img').show();
                    }
					$.each($('.item .item-a'),function(i,a){
						$(a).attr('href','javascript:void(0);');
					});
                }
			});
			

            mClick.newPlayEvent();

            $('.select-all .left').on('click',function(){
                var $this = $(this).parent();
                var val = $this.find(".check_all").attr('value');
                var play = $('.item').find('.checkbox');
                if(+val == 0) {
                    $this.find('img').attr('src','./static/images/xuanze.png');
                    $this.find(".check_all").attr('value',1);
                    $.each(play,function(i,p){
                        $(p).find('img').attr('src','./static/images/xuanze.png');
                        $(p).attr('value',1);
                    });
					$('#delete').removeClass('content_add');
					$('#delete').addClass('content');
                }
                else {
                    $this.find('img').attr('src','./static/images/xuanzekong.png');
                    $this.find(".check_all").attr('value',0);
                    $.each(play,function(i,p){
                        $(p).find('img').attr('src','./static/images/xuanzekong.png');
                        $(p).attr('value',0);
                    });
					$('#delete').removeClass('content');
					$('#delete').addClass('content_add');
                }
            });
			
			 $('.select-all #cancel').on('click',function(){
				$('.select-all').hide();
				$('.myalbum .title').show();
				$('.item').find('.checkbox').hide();
				$.each($('.item'),function(i,a){
					var sid = $(a).attr('sid');
					var href = '#!m=myplay&id='+sid;
					$(a).find('.item-a').attr('href',href);
				});
            });
			
			

            $("#J_play_list").on('click','.checkbox',function() {
                mClick.pushSong(this);
            });
			
		    $("#J_play_list").on('click','.item-a',function() {
				var check = $(this).parent().find('.checkbox');
                mClick.pushSong(this);
            });



            $('.select-all #delete').on('click',function(){
                var playList = $('.item');
                var arr = [];
                $.each(playList,function(i,play){
                    var $this = $(play);
                    var val = $this.find('.checkbox').attr('value');
                    if(+val === 1) {
                        arr.push($this.attr('sid'));
                    }
                  //  $this.find('.checkbox').attr('value','0');
                  //  $($this.find('.checkbox')).find('img').attr('src','./static/images/xuanzekong.png');
                });
                if(arr.length === 0){
                    //mApp.showAlert('您尚未选择任何歌曲！',true);
                }
                else{
                    var setting ={};
                    setting['content']='确定删除所选歌单？';
                    mApp.showAlert(setting,function(){
                        _deletePlayList(arr.join(','));
                    });
                }
            });

        };


        exports.init = function(){
            mApp.setTitle("我创建的歌单");

            $('.back-btn').show();
            mUtils.headerMenu();
            $('#editplay').show();
			mApp.showHeader();
            _getInfo();
            //_queryInfo(_renderInfo);

            _initEvent();
        };


        exports.uninit = function(){
            $('#editplay, .myalbum .title .check, #J_play_list, #delete_play, #cancel_edit,#J_newplay-box').off('click');
        };
    });