/* global define, $, BEME*/
define('page/lantern', ['comm/utils', 'comm/url', 'comm/request','comm/pushsong','comm/clickevent', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mPush,mClick,mApp, require, exports){
        "use strict";

        var _songList = {};
		var play = 0;

        var _renderInfo = function(jdata){
			
			if(!jdata){
				return;
			}
			$.each(jdata,function(i,ans){
				changefooterDiv(ans);
			});
		
        };

		var changefooterDiv = function(obj){
			var div = $('#footer_'+obj.riddle_num);
			var input_t = $('#answer_'+obj.riddle_num);
			div.html("恭喜答对了！");
			input_t.val(obj.answer);
			input_t.attr("readonly","readonly");
		};
		
		
        //请求一些业务数据
        var _queryInfo = function(){
            mRequest.getRequest({
                url : BEME.APIURL+'/ip/getUserAnswer',
                successfn : function(jdata){
                    mApp.loaded();
                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }	
                }
            });

        };
		
		var _checkAnswer = function(answer,num){
			mRequest.getRequest({
                url : BEME.APIURL+'/ip/checkAnswer',
				data : {
					answer:answer,
					num:num
				},
				type : 'POST',
                successfn : function(jdata){
                    mApp.loaded();
					var div = $('#footer_'+num);
					var input_t = $('#answer_'+num);
                    if(jdata.code===0){
						div.html("恭喜答对了！");
						input_t.attr("readonly","readonly");
                    }	
					else{
						div.find('a').text("答案错误，再试试！");
					}
                }
            });
		}

        //初始化一些点击事件
        var _initEvent = function(albumid){

			$('.footer_div').on('click','a',function(){
				var num = $(this).attr('num');
				var answer = $("#answer_"+num).val();
				_checkAnswer(answer,num);	
			});

			
			$('input').on('focus',function(){
				var $this = $(this).parent().parent().find('.footer_div').find('a');
				$this.text('确定');
			});

			$('.dengmi_push').on('click',function(){
				 mClick.pushSong($(this).parent().parent());
			});
          
		  
		   $('#show_rule').on('click',function(){
                try{
                    window.bemetoy.showMyScore(2);
                }
                catch(e){
                    mApp.showAlert('最新版本的用户才能参加哦，请到应用市场升级app');
                }

            });

        };

        //初始化页面
        exports.init = function(){
			
			mApp.setTitle("欢乐元宵节");
			mUtils.headerMenu();
			
			 $('.footer_blank').hide();
            //请求数据
            _queryInfo();
            _initEvent();
        };


        //反初始化绑定事件
        exports.uninit = function(){
			 $('.footer_div, input, .dengmi_push, #show_rule').off('click');
        };
    });