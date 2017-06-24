/*global define, BEME, $*/

define('helper/app', ['comm/url', 'comm/utils', 'comm/request', 'require', 'exports'],
    function(mUrl, mUtils, mRequest, require, exports){
        "use strict";

        var _globalData = {};

        var _initAlert = function(){
            var $alertBox = $('#J_alert-box'),
                config = _initAlert.setting;
            if(!_initAlert.isInit){
                _initAlert.isInit = true;

                var context = {
                    close : function(){
                        $('#J_body-mask, #J_alert-box').hide();
                    }
                };
                $alertBox.find('.btn-cancel').on('click', function(e){
                    config = _initAlert.setting;
                    if(config.cancel){
                        config.cancel.call(context, e);
                    }else{
                        context.close();
                    }
                });
                $alertBox.find('.btn-ok').on('click', function(e){
                    config = _initAlert.setting;
                    if(config.ok){
                        config.ok.call(context, e);
                        context.close();
                    }else{
                        context.close();
                    }
                });
            }
            if(config.hideCancel){
                $alertBox.find('.btn-cancel').hide();
                $alertBox.find('a').css('width','100%');
            }else{
                $alertBox.find('.btn-cancel').show();
                $alertBox.find('a').css('width','50%');
            }

            $alertBox.find('.title').html(config.title);
            $alertBox.find('.content').html(config.content);
            $alertBox.find('.btn-ok').html(config.okWording);
            $alertBox.find('.btn-cancel').html(config.cancelWording);
            $('#J_body-mask, #J_alert-box').show();
        };

        exports.showAlert = function(setting, okFn){
            var _defaut = {
                title : '提示',
                content : '描述',
                hideCancel : false,
                ok : okFn,
                cancel : false,
                okWording : '确定',
                cancelWording : '取消'
            };
            if(typeof setting==='string'){
                setting = {
                    hideCancel : true,
                    content : setting,
                    okWording : '确定',
                    ok : false
                };
            }
            _initAlert.setting = $.extend(_defaut, setting);
            _initAlert();
        };

        exports.showTips = function(text, seconds){
            seconds = seconds || 2000;
            var $tips = $('#J_body-tips');
            $tips.text(text).removeClass('tips-in tips-out').css('zoom');
            $tips.addClass('tips-in');
            setTimeout(function(){
                $tips.removeClass('tips-in tips-out').css('zoom');
                $tips.addClass('tips-out');
            }, seconds);
        };

        exports.showOneTips = function(text, seconds){
            seconds = seconds || 2000;
            var $tips = $('#J_body-tips');
            $tips.text(text).removeClass('tipsone-in tipsone-out').css('zoom');
            $tips.addClass('tipsone-in');
            setTimeout(function(){
                $tips.removeClass('tipsone-in tipsone-out').css('zoom');
                $tips.addClass('tipsone-out');
            }, seconds);
        };

        var hashchangeFuncs = {};
        exports.onHashchange = function(key, fn){
            hashchangeFuncs[key] = fn;
        };

        exports.offHashchange = function(key){
            delete hashchangeFuncs[key];
        };

        exports.initEvent = function(){
            $(window).on('hashchange', function(e){
                var _self = this;
                $.each(hashchangeFuncs, function(key, fn){
                    fn.call(_self, e);
                });
            });
        };

        var _replaceContent = function(){
            $('#J_wrapper-prepare').find('script[type="text/javascript"]').remove();
            var $children = $('#J_wrapper-prepare').children();
            if($children.length>0){
				
                $('#J_wrapper').empty().append($children);
				$(window).scrollTop(0);//跳页后返回顶部
            }
        };

        exports.loaded = function(){
            _globalData._pageStatus = 'loaded';
            $(document.body).removeClass('loading');
            _replaceContent();
        };

        exports.loading = function(){
            _globalData._pageStatus = 'loading';
            if(_globalData._loadingTimer){
                clearTimeout(_globalData._loadingTimer);
            }
            _globalData._loadingTimer = setTimeout(function(){
                if(_globalData._pageStatus == 'loading'){
                    $(document.body).addClass('loading');
                    _replaceContent();
                }
            }, 300);
        };

        exports.loadingFail = function(){
            $(document.body).removeClass('loading');
            $(document.body).addClass('loading-f');
        };

        exports.noScroll = function(){
            $(document.body).addClass('overflow');
        };
		
		exports.showMask = function(){
            $('#J_body-mask').show();
            $(document.body).addClass('overflow');
        };
		
		exports.hideMask = function(){
            $('#J_body-mask').hide();
            $(document.body).removeClass('overflow');
        };

        exports.setTitle = function(name){
            document.title = name;
            $('#J_header-title span').text(name);
        };

        exports.showImage = function(){
            $('img[imgsrc]').each(function(i, img){
                var src=$(this).attr('imgsrc'),
                    self = this;
                var img = document.createElement('img');
                img.onload = function(){
                    $(self).attr('src',img.src);
                }
                img.src = src;
            });
        };

        exports.hideAllBox= function(){
            $('#J_body-mask').hide();
            try{
                $('#J_random-box').hide();
                $('#J_alert-box').hide();
                $('#J_album-alert').hide();
                $('#J_newplay-box').hide();
            }
            catch(e) {}

        };

        exports.getUA = function(num){
                var u = navigator.userAgent;
                var ua = u.toLowerCase().match(/(bemetoy)\/([\d.]+)/);
				//alert(u);
                if(ua != null)
                {
                    var version = ua[2].split('.');
                   return version[num];
                }
                else{
                  return 0;
                }
        };

        //后退滚动条回原位
        exports.backScroll = function(){
            var href = location.href;
            var length = window.BEME.urlList.length ;
            if(length > 0){
                if(href == window.BEME.urlList[length - 2]){
                    setTimeout(function(){
						
                        window.scrollTo(0,window.BEME.scrollList[window.BEME.scrollList.length - 1]);
                        window.BEME.urlList.pop();
                        window.BEME.scrollList.pop();
                    },50);
                }
                else{
                    if(href == window.BEME.urlList[length - 1]){
                        return;
                    }else{
                        window.scrollTo(0,0);
                        window.BEME.scrollList.push(window.BEME._currentScroll);
                        window.BEME.urlList.push(href);
                    }
                }
            }else{
                window.BEME.scrollList.push(window.BEME._currentScroll);
                window.BEME.urlList.push(href);
            }
        };

        exports.changeDate = function(date){
            var dat = new Date(date);
            var res = (dat.getMonth() + 1) + "月" + dat.getDate() + "日 ";
            return res;
        };

        exports.showHeader = function(){
            var hashs = mUrl.getParams();
            var isHave = true;
            var header =['myindex','myalbum','myindex','myplay','mystation'];
            $.each(header,function(i,v){
                if(hashs.m === v){
                    isHave = false;
                    return false;
                }
            });
            try{
                window.bemetoy.showMyListenHeader(isHave);
            }
            catch(e){
                //console.error(e);
            }
        };

        exports.showShare = function(){
            var ver1 = exports.getUA(0);
            var ver2 = exports.getUA(1);
            if((ver1 > 1 && ver2 > 0) ||ver1 > 2){
                $('.share_weixin').show();
            }
        };
		
		
		
		
		//客户端歌曲Json数据
		exports.getSongJson = function(songs,imgurl,name){
			var _playList={};
			var songlist=[];
			 var songl = {};
			 $.each(songs,function(i,song){
				songl = {};
				songl['id'] = song.id;
				songl['name'] = song.name;
				songl['filesize'] = song.filesize;
				songl['type'] = song.type;
				songl['song_time'] = song.song_time;
				songl['md5']= song.md5;
				songl['url']= song.url;
				songl['song_type']= song.tag;
				songl['tagval']=song.tagval;
				songl['link']=BEME.URL+'?m=weixin&id='+song.id+'&type=song&album_type='+song.tag+'&album_id='+song.tagval;
				songlist.push(songl);
			});
			_playList['image']=  imgurl;
			_playList['name']=name;
			_playList['song_list']=songlist;
			return _playList;
		};
		
		exports.changePlayList = function(){
			var isNew = false;
			var ver0 = exports.getUA(0);
            var ver1 = exports.getUA(1);
            if((ver0 > 1 && ver1 > 3) || ver0 > 2){
               isNew = true;
            }
			isNew = true;
			return isNew;
		};
		
		
		exports.changeAlbumLocal = function(){
			var isNew = false;
			var ver0 = exports.getUA(0);
            var ver1 = exports.getUA(1);
			var ver2 = exports.getUA(2);
            if((ver0 > 1 && ver1 > 3 && ver2 > 0) ||(ver0 > 1 && ver1 > 4) || ver0 > 2){
               isNew = true;
            }
			//isNew = true;
			return isNew;
		};
		
		
		
		exports.stopVideoMusic=function(){
			$(document.getElementsByTagName('video')[0]).on('play',function(){
				try{
					window.bemetoy.stopNaviteMusic(); 
				}
				catch(e){};			
			});
			
		};


        exports.shareWeixinUrl = function(data){
            $.ajax({
                url:BEME.APIURL+ '/weixin/getWeixinContent',
                dataType: "json",
                type: "get",
                xhrFields : {"withCredentials":true},
                cache: false,
                data:data,
                success:function(jdata){
                    if(jdata.code == 0){
                        try{
                            window.bemetoy.socialShareWithContent(jdata.data);
                        }
                        catch (e){
                            alert(e);
                        }

                    }
                }
            });
        };

    });
