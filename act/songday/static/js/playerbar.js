 "use strict";

function initPlayer($jPlayer,mp3url,obj){
			$jPlayer._slider = obj.find('.slider');
           $jPlayer.jPlayer({
                ready: function(event){
                    $(this).jPlayer("setMedia", {
                        mp3 : mp3url
                    });

                    if(event.jPlayer.html.used && event.jPlayer.html.audio.available) {
                        this._audio = $(this).data("jPlayer").htmlElement.audio;
                    }
                },

                progress : function(event){
                    var totaltime = event.jPlayer.status.remaining || 0,
                        state = event.jPlayer.status.readyState;
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
                   obj.find('.load-bar').css('width', percent+'%');
                    console.log(percent);
                },

                timeupdate: function(event){
					var status = event.jPlayer.status,
                        process = status.currentPercentAbsolute;
				    var slide = $jPlayer._slider.data('plugin_jRange');
                    if(slide){
                        slide.setValue(process);
                        if(process == 100){
                            slide.setValue(0);
                        }
                    }
                },

                play: function(event) {
                     $('.play_song').addClass('btn-pause');         
                },

                pause: function(event){  
					$('.play_song').removeClass('btn-pause'); 				
                },

                ended: function(event){
					//播放下一首   
					obj.find('.pause').removeClass('pause');					
                },

                smoothPlayBar: true,
                supplied: "mp3",
                preload : "none",
                wmode: "window"
            });
}


function initEvent(id){
	var playerBox = $(id);
	var $jPlayer = playerBox.find('.player');
    $jPlayer._slider = playerBox.find('.slider');
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

	$jPlayer.jPlayer( "clearMedia");

	 playerBox.on('click', '.play', function(){	
		var $this = $(this);
		if($this.hasClass('pause')){
			$jPlayer.jPlayer("pause");
			$this.removeClass('pause');
			
		}else{
			$('#single_1').find('.player').jPlayer('pause');
			$('#single_2').find('.player').jPlayer('pause');
			$('#single_3').find('.player').jPlayer('pause');
			$('.song_prize').find('.pause').removeClass('pause');
			$jPlayer.jPlayer("play");
			$this.addClass('pause');
		}
		return false;
	});
	
};

function initSinglePlayer(id,url){
	initEvent('#'+id);
	var $this = $('#'+id);
	var $jPlayer = $this.find('.player');
	 initPlayer($jPlayer,url,$('#'+id));

     $jPlayer.jPlayer("setMedia", {mp3 :url});
}
