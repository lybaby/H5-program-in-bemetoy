/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/descriptiontime', ['comm/utils', 'comm/url', 'comm/request', 'helper/app', 'helper/temphtml', 'require', 'exports'],
    function(mUtils, mUrl, mRequest, mApp, mTemp, require, exports){
        "use strict";

		var is_subscription = false;
		
        var _renderInfo = function(jdata){
			
			mApp.setTitle(jdata.name);
			if(jdata.subscription){
				is_subscription = true;
				$('#init_time').text(hours+':00');
				var this_all = $('.time-box').find('a');
				if(+jdata.user_push >=7 && + jdata.user_push <=22){
					var this_a = $('.time-box').find('a')[+jdata.user_push - 7];
					$(this_a).css('background','#e6f4c6');
					$(this_a).css('border','1px solid #ceed88');
					$(this_a).append('<img src="./static/images/duihao.png">')
				}else{
					$('.init-time').find('a').css('border','1px solid #ceed88');
					$('.init-time').find('span').append('<img src="./static/images/duihao.png">')	
				}
			}else{
				$('#init_time').text(jdata.push_time_hours+':00');
				$('.init-time').find('a').css('border','1px solid #ceed88');
				$('.init-time').find('span').append('<img src="./static/images/duihao.png">');
			}
        };

        var _queryInfo = function(stationid){
			 mRequest.getRequest({
                url : BEME.APIURL+'/station/getStationPushTime?id='+stationid,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
                }
            });
        };

        var  _initEvent = function(stationid) {
            $(".description .time-box").on("click",'a',function(){
                var $this = $(this);
                var img = $this.parent().parent().parent().find('img');
                if(img.length > 0)
                {
                    $(img[0]).parent().css('background','#f9eaeb');
                    $(img[0]).parent().css('border','1px solid #fad1d4');
                    $(img[0]).remove();
                }
                var img_init = $this.parent().parent().parent().parent().find('img');
                if(img_init.length > 0)
                {
                    $(img_init[0]).parent().parent().css('border','1px solid #fad1d4');
                    $(img_init[0]).remove();
                }
                $this.css('background','#e6f4c6');
                $this.css('border','1px solid #ceed88');
                $this.append('<img src="./static/images/duihao.png">')
            });

            $(".description .init-time").on("click",'a',function(){
                var $this = $(this);
                var img_init = $this.parent().find('img');
                if(img_init.length > 0)
                {
                    return;
                }
                var img = $this.parent().parent().find('img');
                if(img.length > 0)
                {
                    $(img[0]).parent().css('background','#f9eaeb');
                    $(img[0]).parent().css('border','1px solid #fad1d4');
                    $(img[0]).remove();
                }
                $this.css('border','1px solid #ceed88');
                $this.children().append('<img src="./static/images/duihao.png">');
            });
			
			$('#save_station').on('click',function(){
				var pushTime ='';
				if($('.description').find('img').parent().length){
					pushTime = $('.description').find('img').parent().text().split(":")[0];
				}
				try{
					 var a=  window.bemetoy.subscribeRadio(stationid,1,pushTime);
				}
				catch(e){
					alert(e);
				}
			});

        };
		
        exports.init = function(){
            $('.back-btn').show();
            mUtils.headerMenu();
            $('#save_station').show();
            var hashs = mUrl.getParams();
			mApp.showHeader();
            _queryInfo(hashs.id);
			is_subscription = false;
            _initEvent(hashs.id);

        };


        exports.uninit = function(){
            $('.description .time-box, .description .init-time,#save_station').off('click');
        };
    });