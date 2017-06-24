/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/newyear', ['comm/utils', 'comm/url', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl, mApp, require, exports){
        "use strict";
		
        var _renderInfo = function(jdata,text){
		
        };

        var _queryInfo = function(){
            mApp.loaded();
			$('.footer_blank').css('background','#ae2919');
			$('.score-tips').hide();
			var scrollTo = $('.tab-all');
			window.scrollTo(0,scrollTo.offset().top-100);
        };
		
		var _clearAll = function(){
			$('.header').find('.tab-left').removeClass('selected-left');
			$('.header').find('.tab-left').removeClass('selected-right');
			$('.header').find('.tab-left').removeClass('selected');
			$('.header').find('.tab-right').removeClass('selected-left');
			$('.header').find('.tab-right').removeClass('selected-right');
			$('.header').find('.tab-right').removeClass('selected');
		};

        var  _initEvent = function() {
			$("#tab-one").on('click',function(){
				$(".tab-one").show();
				$(".tab-two").hide();
				$(".tab-three").hide();
				$(".tab-four").hide();
				_clearAll();
				$("#tab-one").parent().addClass('selected');	
				$("#tab-three").parent().addClass('selected-left');
				$(".tab-select").css('height','1.6rem');
				$("#tab-one").find('img').attr('src','./static/images/1.png');
                $("#tab-two").find('img').attr('src','./static/images/02.png');
                $("#tab-three").find('img').attr('src','./static/images/03.png');
                $("#tab-four").find('img').attr('src','./static/images/04.png');
				var scrollTo = $('.tab-all');
				window.scrollTo(0,scrollTo.offset().top-100);
				
			});
		
			$("#tab-two").on('click',function(){
				$(".tab-one").hide();
				$(".tab-two").show();
				$(".tab-three").hide();
				$(".tab-four").hide();
				_clearAll();
				
				$("#tab-one").parent().addClass('selected-right');	
				$("#tab-two").parent().addClass('selected');	
				$("#tab-three").parent().addClass('selected-right');
				$(".tab-select").css('height','1.6rem');
				$("#tab-one").find('img').attr('src','./static/images/01.png');
                $("#tab-two").find('img').attr('src','./static/images/kaishi2.png');
                $("#tab-three").find('img').attr('src','./static/images/03.png');
                $("#tab-four").find('img').attr('src','./static/images/04.png');
				var scrollTo = $('.tab-all');
				window.scrollTo(0,scrollTo.offset().top-100);
			});
			
			$("#tab-three").on('click',function(){
				$(".tab-one").hide();
				$(".tab-two").hide();
				$(".tab-three").show();
				$(".tab-four").hide();
				
				_clearAll();
				
				$("#tab-one").parent().addClass('selected-left');	
				$("#tab-two").parent().addClass('selected-left');	
				$("#tab-three").parent().addClass('selected');
				$(".tab-select").css('height','1.8rem');
				$("#tab-one").find('img').attr('src','./static/images/01.png');
                $("#tab-two").find('img').attr('src','./static/images/02.png');
                $("#tab-three").find('img').attr('src','./static/images/kaishi3.png');
                $("#tab-four").find('img').attr('src','./static/images/04.png');
				var scrollTo = $('.tab-all');
				window.scrollTo(0,scrollTo.offset().top-100);
			});
			
			$("#tab-four").on('click',function(){
				$(".tab-one").hide();
				$(".tab-two").hide();
				$(".tab-three").hide();
				$(".tab-four").show();
				_clearAll();
				
				$("#tab-one").parent().addClass('selected-right');	
				$("#tab-two").parent().addClass('selected-left');	
				$("#tab-three").parent().addClass('selected-right');
				$("#tab-four").parent().addClass('selected');
				$(".tab-select").css('height','1.8rem');
				$("#tab-one").find('img').attr('src','./static/images/01.png');
                $("#tab-two").find('img').attr('src','./static/images/02.png');
                $("#tab-three").find('img').attr('src','./static/images/03.png');
                $("#tab-four").find('img').attr('src','./static/images/kaishi4.png');
				var scrollTo = $('.tab-all');
				window.scrollTo(0,scrollTo.offset().top-100);
			});
			
			$('.say-beke').on('click','img',function(){
				try{
					window.bemetoy.showMyScore(1);
				}
				catch(e){
					mApp.showAlert('最新版本的用户才能参加哦，请到应用市场升级app');	
				}
				
			});
		
			$('.howuse-beke').on('click','img',function(){
				try{
					window.bemetoy.showMyScore(2);
				}
				catch(e){
					mApp.showAlert('最新版本的用户才能参加哦，请到应用市场升级app');
				}
				
			});
			
			$('.text-bless').on('focus',function(){
				//mApp.showAlert('活动尚未开始，2月1日等你来参加哦！');	
				$('.pencil').hide();
			});
			
			
			$('#learn-things').on('click',function(){
				mApp.showAlert('活动尚未开始，2月8日等你来参加哦');
			});
		
			$('#send-bless').on('click',function(){
				//mApp.showAlert('活动尚未开始，2月1日等你来参加哦！');	
				var textVal = $('.text-bless').val();
				if(textVal == ''){
					mApp.showAlert('请输入祝福！');
					return;
				}
				location.href = 'http://test.h5.bemetoy.com/m2/pages/newyear_bless.html?text='+textVal;
			});

        };

        exports.init = function(){
            mApp.setTitle("猴年-猴有礼");
            var hashs = mUrl.getParams();
            _queryInfo();
            _initEvent();

        };


        exports.uninit = function(){
			$('.footer_blank').css('background','#fff');
			$('.score-tips').show();
        };
    });