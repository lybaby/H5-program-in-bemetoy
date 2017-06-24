/* global define, $, BEME*/
define('helper/singleplayer', ['comm/utils', 'comm/zeptodata','comm/clickevent', 'helper/app', 'helper/temphtml', 'helper/jrange',  'jplayer' , 'require', 'exports'],
    function(mUtils, mZeptoData,mClick, mApp, mTemp, jrange, jPlayer, require, exports){
        "use strict";

       

        var _initSingleEvent = function(id){
			var $playBox = $(id);
            var $jPlayer = $playBox.find('.player');
            $jPlayer.playedTime = $playBox.find('.played-time');
            $jPlayer._totalTime = $playBox.find('.total-time');
            $jPlayer._slider = $playBox.find('.slider');

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
			

            $playBox.on('click','.btn-play', function(e){
				  e.stopPropagation();
                var $this = $(this);
                if($this.hasClass('btn-pause')){
                    $jPlayer.jPlayer("pause");
                }else{
                    $jPlayer.jPlayer("play");
                }
                return false;
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

        exports.initSinglePlayer = function(id, _songinfo,$obj){
			 var $playBox = $(mTemp.playSingleHtml);
			 $playBox.attr('id',id);
             $playBox.insertAfter($obj);
			_initSingleEvent('#'+id);
			var $this = $('#'+id);
			$this.find('.player-slider').show();
			$this.addClass('item-option-showplay');
			var $jPlayer = $this.find('.player');
			$this.find('.total-time').text(mUtils.formatTime(_songinfo.song_time||_songinfo.radio_time));

			_initPlayer($this,$jPlayer,_songinfo.url);
			//$playBox.find('.btn-single').removeClass('btn-single');

			$jPlayer.jPlayer("setMedia", {mp3 : _songinfo.url});
        };
		
		exports.initSingleWeixinPlayer = function(id, _songinfo,$obj){
			 var $playBox = $(mTemp.playBearSongHtml);
			 $playBox.attr('id',id);
             $playBox.insertAfter($obj);
			_initSingleEvent('#'+id);
			var $this = $('#'+id);
			$this.find('.player-slider').show();
			$this.addClass('item-option-showplay');
			var $jPlayer = $this.find('.player');
			$this.find('.total-time').text(mUtils.formatTime(_songinfo.song_time||_songinfo.radio_time));

			_initPlayer($this,$jPlayer,_songinfo.url);
			$playBox.find('.btn-single').removeClass('btn-single');

			$jPlayer.jPlayer("setMedia", {mp3 : _songinfo.url});
        };


        var _initPlayer = function($playBox,$jPlayer,mp3url){
			 $jPlayer.playedTime = $playBox.find('.played-time');
            $jPlayer._totalTime = $playBox.find('.total-time');
            $jPlayer._slider = $playBox.find('.slider');

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
					}
                },

                pause: function(event){
                    $playBox.find('.btn-play').removeClass('btn-pause');
                },

                ended: function(event){
					var currentIndex = $(this).parent().parent().index();
					var items = $(this).parent().parent().parent().find('.music-list');
					var nextindex = (++currentIndex)%items.length;
					var $nextitem = items.eq(nextindex);
					 $nextitem.find('.btn-play').click();
                },

                smoothPlayBar: true,
                supplied: "mp3",
                preload : "none",
                wmode: "window"
            });

            if($jPlayer._slider){
              //  $jPlayer._slider.data('plugin_jRange').setValue(0);
            }
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