/* global define, $, BEME*/
define('helper/playerbar', ['comm/utils', 'comm/zeptodata','comm/clickevent', 'helper/app', 'helper/temphtml', 'helper/jrange',  'jplayer', 'page/myalbum','page/myhistory', 'page/myplay', 'require', 'exports'],
    function(mUtils, mZeptoData,mClick, mApp, mTemp, jrange, jPlayer, mMyalbum,mHistory,mPlay, require, exports){
        "use strict";

        var _playID = '#J_jplayer-box',
            $playBox = null,
            $playotherBox = null,
            $jPlayer = false,
            $jPlayer_other = false,
            _playOtherID = '#J_jplayer-box_1',
            _playWeixinID ='#J_jplayer-weixin',
            _isStop = true,
            _isPlaying = false,
            _songInfo = {},
            _currentIndex = 0,
            _curObj = null, //当前正在播放的item
			is_set = false,
            _clickObj = null; //当前点击的item

        var setObjectPlay = function($obj){
            var cls = 'active-play-item',
                songUrl = $obj.attr('url');
            $("#J_wrapper").find('.'+cls).removeClass(cls);
            $obj.addClass(cls);
            if($playotherBox.length >0){
                if($obj.attr('sid') == $playotherBox.attr('sid')){
                    if($playotherBox.css('display') != 'none'){
                        $playotherBox.remove();
                        $playBox.addClass('item-option-showplay');
                        $playBox.show();
                    }
                    $playotherBox.remove();
                }
            }
            $playBox.find('.op-del').hide();
            if($obj.attr('user') == 'true'){
                $playBox.find('.op-del').show();
            }
            $playBox.attr('sid',$obj.attr('sid'))
            $playBox.insertAfter($obj);
            $jPlayer._totalTime.text($obj.find('.desc').text());
            $('.load-bar').css('width', '0');
            $jPlayer.jPlayer("setMedia", {mp3 : songUrl});
            $jPlayer.jPlayer("play");
			is_set = false;

            try{
                var title = '试听'+ document.title;
                var name = '试听'+$($obj).find('.title').text();
                var sName = '试听'+ mClick.findName();
                _czc.push(["_trackEvent",title,sName,name]);
            }
            catch(e){

            }

        };

        var setWeiXinbox = function($obj){
            var cls = 'active-play-item',
                songUrl = $obj.attr('url');
            $obj.parent().find('.item').removeClass(cls);
            $obj.addClass(cls);
            var $playWeixinBox = $(_playWeixinID);
            $playWeixinBox.attr('sid',$obj.attr('sid'))
            $playWeixinBox.insertAfter($obj);
            $jPlayer._totalTime.text($obj.find('.desc').text());
            $('.load-bar').css('width', '0');
            $jPlayer.jPlayer("setMedia", {mp3 : songUrl});
            $jPlayer.jPlayer("play");

        }

        var _initPlayer = function(mp3url){

            $jPlayer.jPlayer({
                ready: function(event){
                    $jPlayer.jPlayer("setMedia", {
                        mp3 : mp3url
                    });

                    if(event.jPlayer.html.used && event.jPlayer.html.audio.available) {
                        this._audio = $(this).data("jPlayer").htmlElement.audio;
                    }
                },

                progress : function(event){
                    var totaltime = event.jPlayer.status.remaining || 0,
                        state = event.jPlayer.status.readyState;
                    //console.log(event.jPlayer.status);
                    if(state<1){
                        // $jPlayer._totalTime.show();
                    }else{
                        // $jPlayer._totalTime.text(mUtils.formatTime(totaltime)).show();
                    }

                    //code from https://github.com/maboa/circleplayer/blob/master/js/circle.player.js
                    var percent = 0,
                        self = this;
                    if((typeof self._audio.buffered === "object") && (self._audio.buffered.length > 0)) {
                        if(self._audio.duration > 0) {
                            var bufferTime = 0;
                            for(var i = 0; i < self._audio.buffered.length; i++) {
                                bufferTime += self._audio.buffered.end(i) - self._audio.buffered.start(i);
                            }
                            percent = 100 * bufferTime / self._audio.duration;
                        }
                    } else {
                        percent = 0;
                    }
                    var percent1 = 100*(self._audio.duration-totaltime)/self._audio.duration;
                    //这里更新一下进度条，加一个div和播放进度条在一起的，设置背景色，比如加载进度条的div是load-process-bar
                    if(percent1 + percent  >= 100){
                        percent = 100;
                    }else{
                        percent = percent1 + percent;
                    }
                    $('.load-bar').css('width', percent+'%');
                    console.log(percent);
                },

                timeupdate: function(event){
                    var status = event.jPlayer.status,
                        process = status.currentPercentAbsolute;
						if(!status.waitForLoad&&!is_set){
							try{
								var arr = {};
								arr['name']= $(this).parent().attr('name') ;
								is_set = true;
								window.bemetoy.playMusicWithInfo(JSON.stringify(arr));
							}
							catch(e){
								
							}
						}
                    $jPlayer.playedTime.text(mUtils.formatTime(status.currentTime||0));
                    //$jPlayer._totalTime.text(mUtils.formatTime(status.duration-status.currentTime));
                    var slide = $jPlayer._slider.data('plugin_jRange');
                    if(slide){
                        slide.setValue(process);
                        if(process == 100){
                            slide.setValue(0);
                            $jPlayer.playedTime.text('00:00');
                        }
                    }
                },

                play: function(event) {
					if($playBox.find('.btn-single').length <1){
						  $playBox.find('.btn-play').addClass('btn-pause');
					}else{
						$playBox.find('.op-play').addClass('op-pause');
					}
                    _isPlaying = true;
                },

                pause: function(event){
                     if($playBox.find('.btn-single').length <1){
                        $playBox.find('.btn-play').removeClass('btn-pause');
                    }else{
                        $playBox.find('.op-play').removeClass('op-pause');
                    }
                },

                ended: function(event){
                  if($playBox.find('.btn-single').length <1){
						  $playBox.find('.btn-play').removeClass('btn-pause');
					}else{
						$playBox.find('.op-play').removeClass('op-pause');
					}
                    //播放下一首
					if($('.song-page').length > 0){
						var $this = $('.song-page .play-cover');
						$this.addClass('pause');
						$this.attr('src',"./static/images/bofang.png");
					}
                    var cls = 'active-play-item',
                        $activeObj = $('.'+cls),
                        $items = $activeObj.parent().find('.item'),
                        nextindex = (++_currentIndex)%$items.length,
                        $nextitem = $items.eq(nextindex);
                    if($(_playWeixinID).length > 0){
                        setWeiXinbox($nextitem);
                    }else{
                        setObjectPlay($nextitem);
                    }		
                },

                smoothPlayBar: true,
                supplied: "mp3",
                preload : "none",
                wmode: "window"
            });

            if($jPlayer._slider){
                $jPlayer._slider.data('plugin_jRange').setValue(0);
            }
        };

        var _initEvent = function(){
            $jPlayer = $playBox.find('.player');
            $jPlayer.playedTime = $playBox.find('.played-time');
            $jPlayer._totalTime = $playBox.find('.total-time');
            $jPlayer._slider = $playBox.find('.slider');

            $jPlayer.jPlayer( "clearMedia");
            $jPlayer._slider.jRange({
                from: 0, to: 100, step: 1,
                width: '68%', format: '%s',
                ondragchange : function(val){
                    if(this.__timeout){
                        clearTimeout(this.__timeout);
                    }
                    this.__timeout = setTimeout(function(){
                        $jPlayer.jPlayer("playHead", val);
                    }, 100);
                }
            });

            $playBox.on('click', '.btn-play', function(){
				return;
                var $this = $(this);
                if($this.hasClass('btn-pause')){
                    $jPlayer.jPlayer("pause");
                }else{
                    $jPlayer.jPlayer("play");
                }
                return false;
            }).on('click', '.op-push', function(){
                var index = $(_playID).index() - 1;
                mClick.pushSongLi($(_playID).parent().find('li')[index]);
            }).on('click', '.op-play', function(){
                var cls = 'item-option-showplay';
                _currentIndex = $('#J_jplayer-box').index() - 1;
                if($(_playOtherID).length > 0){
                    if($(_playOtherID).index() < _currentIndex){
                        _currentIndex = _currentIndex -1;
                    }
                }
                if($playBox.hasClass(cls)){
                    //$playBox.removeClass(cls);
					if($(this).hasClass('op-pause')){
						$(this).removeClass('op-pause');
						 $jPlayer.jPlayer("pause");
					}else{
						$(this).addClass('op-pause');
						  $jPlayer.jPlayer("play");
					}
                }else{
                    $playBox.addClass(cls);
					$(this).addClass('op-pause');
                    var $items = $('#J_jplayer-box').parent().find('.item');
                    setObjectPlay($items.eq((_currentIndex)%$items.length));
                }
            }).on('click', '.op-up', function(){
                mApp.showTips('产品原因，点不动');
            }).on('click', '.op-add', function(){
                mMyalbum.showAddMyablumBox(_songInfo.id, _songInfo.tag,_songInfo.tagval);
            }).on('click','.op-del',function(){
                if(_songInfo._type === 'history'){
                    mHistory.deleteHistory(_songInfo.relate_id);
                }
                if(_songInfo._type === 'play'){
                    mPlay.deletePlay(_songInfo.relate_id);
                }
				if(_songInfo._type == 'no_have'){
					mHistory.deleteNoHistory(_songInfo.relate_id);
				}
            }).on('click', '.op-share', function(){
                mClick.shareToWeixin(_songInfo.id,'song',_songInfo.tag,_songInfo.tagval);
            });
        };


        var _initOtherEvent = function($obj){
            $jPlayer_other = $playotherBox.find('.player');

            $playotherBox.on('click', '.btn-play', function(){
                var $this = $(this);
                if($this.hasClass('op-pause')){
					$(this).removeClass('op-pause');
                    $jPlayer_other.jPlayer("pause");
                }else{
					
                    $jPlayer_other.jPlayer("play");
					 $jPlayer.jPlayer("play");
                }
                return false;
            }).on('click', '.op-push', function(){
                var index = $(_playOtherID).index() - 1;
                mClick.pushSongLi($(_playOtherID).parent().find('li')[index]);
            }).on('click', '.op-play', function(){
                _currentIndex =  $playotherBox.index() - 2;
                if($playotherBox.index() < $playBox.index()){
                    _currentIndex =  $playotherBox.index() - 1;
                }
                $playotherBox.remove();
                setObjectPlay($obj);
                $playBox.show();
            }).on('click', '.op-up', function(){
                mApp.showTips('产品原因，点不动');
            }).on('click', '.op-add', function(){
                mMyalbum.showAddMyablumBox(_songInfo.id, _songInfo.tag,_songInfo.tagval);
            }).on('click','.op-del',function(){
                if(_songInfo._type === 'history'){
                    mHistory.deleteHistory(_songInfo.relate_id);
                }
                if(_songInfo._type === 'play'){
                    mPlay.deletePlay(_songInfo.relate_id);
                }
				if(_songInfo._type == 'no_have'){
					mHistory.deleteNoHistory(_songInfo.relate_id);
				}
            });
        };
		
		var _initWeixinEvent = function($obj){
            $jPlayer = $playBox.find('.player');
            $jPlayer.playedTime = $playBox.find('.played-time');
            $jPlayer._totalTime = $playBox.find('.total-time');
            $jPlayer._slider = $playBox.find('.slider');

            $jPlayer.jPlayer( "clearMedia");
            $jPlayer._slider.jRange({
                from: 0, to: 100, step: 1,
                width: '68%', format: '%s',
                ondragchange : function(val){
                    if(this.__timeout){
                        clearTimeout(this.__timeout);
                    }
                    this.__timeout = setTimeout(function(){
                        $jPlayer.jPlayer("playHead", val);
                    }, 100);
                }
            });

            $playBox.on('click', '.btn-play', function(e){
				  e.stopPropagation();
                var $this = $(this);
                if($this.hasClass('btn-pause')){
                    $jPlayer.jPlayer("pause");
					$this.removeClass('btn-pause');
                }else{
                    $jPlayer.jPlayer("play");
					$this.addClass('btn-pause');
                }
                return false;
            }).on('click', '.btn-song', function(){
				if($('.song-page').length > 0){
					var $this = $('.song-page .play-cover');
					if($this.hasClass('pause')){
						$this.removeClass('pause');
						$jPlayer.jPlayer("play");
						$this.attr('src',"./static/images/zanting.png");
					}else{
						$this.addClass('pause');
						$jPlayer.jPlayer("pause");
						$this.attr('src',"./static/images/bofang.png");
					}
					return;
				}
            }).on('click', '.play', function(){
                var $this = $(this);
                if($this.hasClass('pause')){
                    $jPlayer.jPlayer("pause");
					$this.removeClass('pause');
                }else{
                    $jPlayer.jPlayer("play");
					$this.addClass('pause');
                }
                return false;
            });
        };
		
		//初始化播放器


        exports.initPlayer = function($obj, songinfo, $objList){
            _clickObj = _curObj = $obj;
            _songInfo = songinfo;
            $playBox = $(_playID);
            $playotherBox =$(_playOtherID);
            var isInit = true;

            var sid = $playBox.attr('sid');
            if(sid==songinfo.id){
                if($playBox.css('display') != 'none'){
                    return $playBox.hide();
                }else{
                    $playotherBox.hide();
                    return $playBox.show();
                }
            }

            var oid = $playotherBox.attr('sid');
            if(oid==songinfo.id){
                if($playotherBox.css('display') != 'none'){
                    return $playotherBox.hide();
                }else{
                    $playBox.hide();
                    return $playotherBox.show();
                }
            }

            if($playBox.length<1){
                $playBox = $(mTemp.playOptionHtml);
                $playBox.insertAfter($obj);
                _initEvent();
                $playBox.find('.btn-play').removeClass('btn-pause');
                $playBox.removeClass('item-option-showplay');
                $jPlayer._totalTime.text(mUtils.formatTime(_songInfo.song_time||_songInfo.radio_time));

                $playBox.find('.op-del').hide();
                if(songinfo.user){
                    $playBox.find('.op-del').show();
                }
                $playBox.find('.op-up').hide();

                $playBox.attr('sid', songinfo.id).show();
				$playBox.attr('name', songinfo.name);
                _initPlayer(_songInfo.url);

                _isStop = false;
                $jPlayer.jPlayer("setMedia", {mp3 : _songInfo.url});
            }else{
                if(_isPlaying){
                    $playotherBox.remove();
                    $playBox.hide();
                    if($playotherBox.length < 1){
                        $playotherBox = $(mTemp.playOptionHtmlOther);
                    }
                    $playotherBox.insertAfter($obj);
                    _initOtherEvent($obj);
                    $playotherBox.removeClass('item-option-showplay');

                    $playotherBox.find('.op-del').hide();
                    if(songinfo.user){
                        $playotherBox.find('.op-del').show();
                    }
                    $playotherBox.find('.op-up').hide();

                    $playotherBox.attr('sid', songinfo.id).show();
					$playotherBox.attr('name', songinfo.name);
                }
                else{
                    $playBox.insertAfter($obj);
                    $playBox.find('.btn-play').removeClass('btn-pause');
                    $playBox.removeClass('item-option-showplay');
                    $jPlayer._totalTime.text(mUtils.formatTime(_songInfo.song_time||_songInfo.radio_time));

                    $playBox.find('.op-del').hide();
                    if(songinfo.user){
                        $playBox.find('.op-del').show();
                    }
                    $playBox.find('.op-up').hide();

                    $playBox.attr('sid', songinfo.id).show();
					$playBox.attr('name', songinfo.name);
                    _initPlayer(_songInfo.url);

                    _isStop = false;
                    $jPlayer.jPlayer("setMedia", {mp3 : _songInfo.url});
                }
            }
			var ver = mApp.getUA(1);
			 if(ver > 0 ){
				$('.item-option-box .op-share').show();
			}
        };
		
		exports.initWeixinPlayer = function($obj, _songinfo, $objList){
            $playBox = $(_playWeixinID);
            var cls = 'active-play-item';
            var sid = $playBox.attr('sid');
            if(sid==_songinfo.id){
                if($playBox.css('display') != 'none'){
                    return $playBox.hide();
                }else{
                    return $playBox.show();
                }
            }
            if($playBox.length<1){
                _currentIndex = $obj.index();
                $playBox = $(mTemp.playWeixinHtml);
                $playBox.insertAfter($obj);
                _initWeixinEvent();
                $playBox.find('.player-slider').show();
                $playBox.addClass('item-option-showplay');
                $jPlayer._totalTime.text(mUtils.formatTime(_songinfo.song_time||_songinfo.radio_time));

                $playBox.attr('sid', _songinfo.id).show();
                _initPlayer(_songinfo.url);
				$playBox.find('.btn-single').removeClass('btn-single');
                _isStop = false;
                $jPlayer.jPlayer("setMedia", {mp3 : _songinfo.url});
                $obj.addClass(cls);
                setTimeout(function(){
                    $jPlayer.jPlayer("play");
                }, 100);
            }
            else{
                _currentIndex = $obj.index();
                if($playBox.index() < _currentIndex){
                    _currentIndex = _currentIndex - 1;
                }
                $playBox.insertAfter($obj);
                $playBox.find('.btn-play').removeClass('btn-pause');
                $playBox.addClass('item-option-showplay');
                $jPlayer._totalTime.text(mUtils.formatTime(_songinfo.song_time||_songinfo.radio_time));


                $playBox.attr('sid', _songinfo.id).show();
                _initPlayer(_songinfo.url);
				
				$playBox.find('.btn-single').removeClass('btn-single');
                _isStop = false;
                $jPlayer.jPlayer("setMedia", {mp3 : _songinfo.url});
                $obj.parent().find('.item').removeClass(cls);
                $obj.addClass(cls);
                $jPlayer.jPlayer("play");

            }
        };

        exports.initIpPlay = function($obj,_songinfo){
            $playBox = $(mTemp.playWeixinHtml);
            $playBox.insertAfter($obj);
            _initWeixinEvent();
            $playBox.find('.player-slider').show();
            $playBox.addClass('item-option-showplay');
            $jPlayer._totalTime.text(mUtils.formatTime(_songinfo.song_time||_songinfo.radio_time));

            $playBox.attr('sid', _songinfo.id).show();
            _initPlayer(_songinfo.url);
			$playBox.find('.btn-single').removeClass('btn-single');
            _isStop = false;
            $jPlayer.jPlayer("setMedia", {mp3 : _songinfo.url});

        };
		
		exports.initIpIndexPlay = function($obj,_songinfo,type){
			//超级飞侠
			if(type == 1){
				 $playBox = $(mTemp.playWeixinHtml);
			}
			//小囧熊分享
			if(type == 2){
				 $playBox = $(mTemp.playBearSongHtml);
			}
			//米卡分享
			if(type == 3){
				$playBox = $(mTemp.playMikaSongHtml);
			}
			//小囧熊
			if(type == 4){
				 $playBox = $(mTemp.playBearHtml);
			}
			//米卡
			if(type == 5){
				$playBox = $(mTemp.playMikaHtml);
			}
			$playBox.insertAfter($obj);
            _initWeixinEvent();
            $playBox.find('.player-slider').show();
            $playBox.addClass('item-option-showplay');
            $jPlayer._totalTime.text(mUtils.formatTime(_songinfo.song_time||_songinfo.radio_time));

            $playBox.attr('sid', _songinfo.id).show();
			$playBox.attr('name', _songinfo.name);
            _initPlayer(_songinfo.url);
			// $playBox.find('.btn-single').removeClass('btn-single');
            _isStop = false;
            $jPlayer.jPlayer("setMedia", {mp3 : _songinfo.url});
		};
			
		

        exports.initWeixinSongPlay = function($obj,_songinfo){
            $playBox = $(mTemp.playWeixinSongHtml);
            $playBox.insertAfter($obj);
            _initWeixinEvent();
            $playBox.find('.player-slider').show();
            $playBox.addClass('item-option-showplay');
            $jPlayer._totalTime.text(mUtils.formatTime(_songinfo.song_time||_songinfo.radio_time));

            $playBox.attr('sid', _songinfo.id).show();
            _initPlayer(_songinfo.url);

			$playBox.find('.slider-container').find('.high').removeClass('btn-play');
			$playBox.find('.slider-container').find('.high').addClass('btn-song');
			
            _isStop = false;
            $jPlayer.jPlayer("setMedia", {mp3 : _songinfo.url});

        };

        exports.stopPlayer = function(){
            if($jPlayer){
                $jPlayer.jPlayer("stop");
            }
            _isStop = true;
        };

		
        exports.uninit = function(){
            //isInit = false;
            _currentIndex = 0;
            $playBox.off('click');
            exports.stopPlayer();
        };

    });