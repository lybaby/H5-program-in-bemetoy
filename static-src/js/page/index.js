/* global define, $, BEME, LocalCheck*/
define('page/index', ['comm/utils', 'comm/url', 'comm/request','comm/pushsong','helper/playerbar', 'helper/temphtml', 'helper/app','jplayer', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mPush,mPlayerbar,mTemp, mApp,jPlayer, require, exports){
        "use strict";
        var _currmentModel = '',
            cacheVersion = '2016.05.26',
            _lastUrl = '',
            cacheConfig = {};

        var _renderBody = function(bodyHtml, setting){
            if(setting.preRender) setting.preRender();

            $(setting.containID).html(bodyHtml);

            //加载完成回调
            if(setting.afterRender) setting.afterRender();
        };

        var _getBodyHtml = function(html){
            var bstart = html.indexOf('<body>'),
                bend = html.indexOf('</body>'),
                bodyHtml = html.substring(bstart+6, bend);

            return bstart<0 ? '' : bodyHtml;
        };

        var _queryPageHtml = function(pageUrl, setting){
            //页面加载中
            mApp.loading();

            window.BEME._currentScroll = document.body.scrollTop;
            setting.times = setting.times || 0;
            if(cacheConfig[pageUrl]){
                return _renderBody(cacheConfig[pageUrl], setting);
            }

            //支持缓存
            if(window.LocalCheck && gHTMLFileHashConfig[setting.pagename]){
                gHTMLFileHashConfig = gHTMLFileHashConfig || {};
                return LocalCheck.require({
                    unique : gHTMLFileHashConfig[setting.pagename] || '',
                    url:pageUrl, execute:false, formatFn:_getBodyHtml
                }).done(function(info){
                    cacheConfig[pageUrl] = info.content;
                    _renderBody(info.content, setting);
                });
            }

            $.ajax({
                url : pageUrl,
                timeout : 45000,
                success : function(html){
                    var bodyHtml = _getBodyHtml(html);
                    if(!bodyHtml){
                        return ;
                    }

                    cacheConfig[pageUrl] = bodyHtml;
                    _renderBody(bodyHtml, setting);
                },

                error : function(XMLHttpRequest, textStatus, errorThrown){
                    if(setting.times<4 && XMLHttpRequest.status<1){ //会出现请求返回status为0的情况
                        var flag = pageUrl.indexOf('?')>-1 ? '&' : '?';
                        pageUrl = pageUrl+flag+'t='+Math.random();
                        ++setting.times;
                        _queryPageHtml(pageUrl, setting);
                    }
                    mApp.loadingFail();
                }
            });
        };

        exports.loadPage = function(pagename, setting){
            setting = setting || {};
            setting.containID = setting.containID || '#J_wrapper-prepare';

          /*  if(_currmentModel!=pagename ){*/
                _currmentModel = pagename.substr(0, 20);
                var pageUrl = 'pages/'+_currmentModel+'.html';

                setting.pagename = _currmentModel;
                _queryPageHtml(pageUrl, setting);
           /* }*/
            $('#J_body-mask').removeClass('mask-in');
            $(document.body).removeClass('show-image');
        };

        //加载主框架页面
        var _loadMainPage = function(e){
            var hashs = mUrl.getParams();
            hashs.m = hashs.m || 'main';
            BEME.hashs = hashs;
            var _m = hashs.m;
            exports.loadPage(_m, {
                afterRender : function(){
                    //反初始化操作
                    if(BEME.curPageInstance && BEME.curPageInstance.uninit){
                        mApp.hideAllBox();
                        console.log('uninit '+BEME.PAGENAME);
                        BEME.curPageInstance.uninit();
                        BEME.curPageInstance = null;
                    }
                    var params = location.hash.replace(/^[#!]+/g,''),
                        curUrl = '';
                    params = params ? '?'+params : params;
                    curUrl = 'pages/'+_m+'.html'+params;
                    curUrl = location.hash;
                    try{
                        if(typeof _czc.push==='function'){
                            _czc.push(﻿["_trackPageview", curUrl, _lastUrl]);
                        }
                    }
                    catch (e){}
                    _lastUrl = curUrl;
                }
            });
        };

        //主页加载完成事件
        var _domReady = function(){
            mApp.initEvent();
            _loadMainPage();

            mApp.onHashchange('mainchange', _loadMainPage);
        };

        var _queryInfo = function(){
            mRequest.getLocalRequest({
                url : BEME.APIURL+'/listen/customRandom',
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        var html = BEME.template(mTemp.mysongHtml, {list:jdata.data});
                        $('#J_random-box').find('.item').remove();
                        $('#J_random-box').find('.list').append(html);
                        $($('#J_random-box').find('li')[4]).find('.item-a').css('border','0');
                    }
                }
            });
        };

        exports.pushAllSong = function($this){
            var $this = $($this).parent().parent().find('.item');
            var conf = ['url', 'md5', 'type', 'tag', 'tagval','size'];
            var arr=[];
            var arrInfo = [];
            var nameInfo = [];
            $.each($this,function(i,li){
                var  data ={};
                $.each(conf,function(j,key){
                    data[key] = $(li).attr(key);
                });
                arr.push(data);
                var info = $.extend({}, data);
                info['bid'] = data['tagval'];
                info['fid'] =$this.attr('sid');
                arrInfo.push(info);
                nameInfo.push($(li).find('.title').text());
            });
            mPush.playAllMusic(arr,arrInfo);
        };

        var _showRandomBox = function(){
            var $myBox = $('#J_random-box');
            if($myBox.length<1){
                $(document.body).append(mTemp.myrandomHtml);
                $('#J_random-box').on('click', '.close-btn', function(){
                    $('#J_random-box, #J_body-mask').hide();
                    mApp.hideMask();
                });
                $('#J_random-box .random_left').on('click', function(){
                    _queryInfo();
                });
                $('#J_random-box .random_right').on('click', function(){
                    exports.pushAllSong(this);
                  //  _czc.push(["_trackEvent",'随心听推送','随心听推送','随心听推送']);
                });
                $('#J_random-box .list').on('touchstart',function(){
                    return false;
                });

            }
            else{
                var display = $('#J_body-mask').css('display');
                if(display != 'none'){
                    return;
                }
            }
            mApp.showMask();
            // $('#J_body-mask').show();
            $myBox.show();
            _queryInfo();
          //  _czc.push(["_trackEvent",'随心听','随心听','随心听']);
        };

        window.showRandomListening = function(){
            _showRandomBox();
        };

        window.showMyListening = function(){
            location.href ='http://test.h5.bemetoy.com/m2/#!m=myindex' ;
        };

        window.showSearch = function(){
            location.href ='http://test.h5.bemetoy.com/m2/#!m=search' ;
        };

        window.showMyFootprint = function(){
            location.href ='http://test.h5.bemetoy.com/m2/#!m=myhistory' ;
        };
		
		window.testFunction = function(){
			 mApp.showAlert('测试分享成功');
		};


        window.colseMusic = function(){
            $('#J_body-mask').hide();
            try{
                $('#J_random-box').hide();
                $('#J_alert-box').hide();
                $('#J_album-alert').hide();
                $('#J_newplay-box').hide();
            }
            catch(e) {}
            if($('.item-option-showplay').length > 0) {
                mPlayerbar.stopPlayer();
                //$('.item-option-showplay .play').click();
                //$('.item-option-showplay .op-play').click();
               // $('.item-option-showplay').remove();
                $('.item-option-showplay').find('.player').jPlayer('stop');
            }
            if( $('#player').length>0){
                $('#player').jPlayer('pause');
                $('#player').jPlayer('stop');
                $('audio')[0].stop();
                $('#player').remove();
            }
        };



        //初始化一些点击事件
        var _initEvent = function(){
            $('.main-header-box').on('click','.back-btn',function(){
                history.go(-1);
            });

            $('.loading-fail-box').on('click',function(){
                window.location.reload(true);
            });
            $('#J_body-mask').on('click',function(){
                mApp.hideMask();
                //$('#J_body-mask').hide();
                if($('#J_random-box').length){
                    $('#J_random-box').hide();
                }
                $('#J_alert-box').hide();
                if($('#J_album-alert').length){
                    $('#J_album-alert').hide();
                }
                if($('#J_newplay-box').length){
                    $('#J_newplay-box').hide();
                }
            });
			
			window.onerror=function(sMessage,sUrl,sLine){
				var fromUserid = '';
				try{
				 fromUserid = window.bemetoy.getFromUerid();
				}catch(e){
					fromUserid = 'pc';
				}
				var errorStr = '';
				errorStr = "userId:"+fromUserid+"    Error: " + sMessage +"   Line: " + sLine +"  URL: " + sUrl;
				$.ajax({
					url: "http://dev.h5.bemetoy.com/app/m2/ranking/writeLogToServer",              //请求地址
					type: "GET",   
					xhrFields: { withCredentials: true }, 			//跨域
					data: { data: errorStr},        //请求参数
					dataType: "json",
					success: function (response, xml) {
						// 此处放成功后执行的代码
					},
					fail: function (status) {
						// 此处放失败后执行的代码
					}
				});
				return false;
			};

            $('#J_body-mask').on('touchstart',function(){
                return false;
            });

            if('onbeforeunload' in window){
                window.onbeforeunload = function(){
                    window.colseMusic();
                };
            }else if('pagehide' in document){
                document.pagehide =  function(){
                    window.colseMusic();
                };
            };
			

			
        };


        exports.init = function(){
            var cvKey = 'cache-'+cacheVersion;
            if(!mUtils.cache.get(cvKey)){ //清除老cache
                console.log('clear all cache!');
                if(window.LocalCheck){ //不请localcheck的缓存
                    window.LocalCheck.clearOther();
                }else{
                    mUtils.cache.clear();
                }
                mUtils.cache.set(cvKey, '1');
            }
            _domReady();
            var hashs = mUrl.getParams();
            mApp.hideAllBox();
            //alert(window.location.href);
            _initEvent();
        };

        return exports;
    });