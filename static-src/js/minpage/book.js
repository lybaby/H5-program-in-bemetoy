/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/book', ['comm/utils', 'comm/pushsong','comm/url', 'comm/request','jplayer','hammer','helper/app', 'require', 'exports'],
    function(mUtils, mPush,mUrl,mRequest,jPlayer,mHammer,mApp, require, exports){
        "use strict";
        var _songList = [];
		var _imgs =[],
			_songUrl=[],
			_resourceLoaded = false,
			_mp3Loaded = false,
			pageSlideOk=false,
			_currentIndex = 0,
			_totalPage = 0,
			playerObj = null,
			screenModel= 0,
			_currentModel=0,
			isFrist = true,
			width = 0,
			height = 0,
			isOver = false,
			isAuto = true,
			$jPlayer = $('#player'),
			isHave=false;
        var shareConfig = {
            title : "贝美时光说-成长场景",
            desc : '小囧熊英文乐园', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        };

        var _renderInfo = function(jdata,weixin){
			
			height =$(window).height();
			width =$(window).width();
			var temp = 0;
			if(height < width){
				temp = height;
				height = width -60;
				width = temp;
			}else{
				width = width - 50;
			}
			
		   $(document.body).css('height', height);
		   $(document.body).css('overflow','hidden');
           $.each(jdata.song,function(i,song){
			   _imgs.push(song['img_url']);
			   if(i > 0){
				   if(song['url']){
					   _songUrl.push(song['url']); 
				   }else{
						_songUrl.push(1); 
				   }  
			   }else{
				   if(song['url']){
					   isHave = true;
				   }
				   _songUrl.push(1); 
			   }
			   _songList.push(song);
		   });
		   $("#J_btn-replay").hide();

		   
		   $('.footer_blank').hide();
		   shareConfig.title= jdata.name;
		   shareConfig.desc = jdata.description;
		   shareConfig.imgUrl = jdata.url;
		   screenModel = jdata.screenModel;
			_totalPage = jdata.song.length; 
			if(screenModel == 1){
				$('.show-warning').show();
				$('.img-block').addClass('h-block');

				$(document.body).css('height', height);
				$('#J_slidebox').removeClass('hslide-box');
				$('#J_btnsbox').removeClass('btns-box-in btns-box-out').css('zoom');
				$('#J_btnsbox').addClass('btns-box-in');
				$('#J_btnsbox').addClass('btns-h');
				if(window.orientation ==90){
					document.documentElement.style.fontSize = height/7.5+'px';
					$('.show-warning').hide();
					$('.img-block').removeClass('h-block');
					$(document.body).css('height', width);
					$('#J_slidebox').addClass('hslide-box');
					$('#J_btnsbox').removeClass('btns-h');
					$('#book-img').addClass('imgClass');
					_hideBtn(4000);
					$(".book-page").addClass('vertical_book_page');
				}
			}else{
				$('.show-warning').hide();
				$('.img-block').removeClass('h-block');
				$('#J_slidebox').removeClass('hslide-box');
				$('#J_btnsbox').addClass('btns-h');
				//_hideBtn();
			}

            var cutArr = [];
            cutArr.push(_imgs.slice(0,2));
            cutArr.push(_imgs.slice(2,_imgs.length));

		   mUtils.loadImages(cutArr[0], function(loadall, loadedNum){
				if(loadall){
					_resourceLoaded = true;
					_initPage();
				}else{
					var perNum = 100.0/cutArr[0].length,
						process = Math.floor(loadedNum*perNum+(Math.random()*perNum));
					if(process>100){
						process = 100;
					}
					return $('#J_loadingbox .text span').text(process+'%');
				}
			});

            mUtils.loadImages(cutArr[1],function(){});

            var version1 = mApp.getUA(1);
            var version2 = mApp.getUA(2);
            if((version1 <= 2 || version1 == undefined)&& (version2 < 1 || version2 == undefined)){
                $('.show-warning').html('');
            }
			if(version1 > 0){
				//alert(1);
                $('#J_btn-share').css("display","inline-block");
            }

            $('#book-img').attr('src',_imgs[0]);
			

			isFrist = false;
			$('#J_slidebox .left').removeClass('leftin').css('zoom');
			$('#J_slidebox .right').removeClass('rightin').css('zoom');
			$('#J_slidebox').show();
			$('#J_slidebox .left').addClass('leftin').css('zoom');
			$('#J_slidebox .right').addClass('rightin').css('zoom');
			$('#J_slidebox .left').addAnim('leftin');
			pageSlideOk = true;
			$('#J_btnsbox').hide();
			if(weixin == 1){
				$('#J_btnsbox').remove();
				$('.footer-weixin').show();
				$(".push_all").hide();
				 var weixin = require(['minpage/weixin'],function(context){
                    context.getWeixinConfig(shareConfig);
                });
			}
			$('#J_pagenum').show().text('第1'+'/'+_totalPage+"页");
			
			if(jdata.collected){
				$('#J_btn-collection').addClass('favoritesed');
			}
			
        };
		
		var _showPushAll = function(isHave){
		   if(isHave){
			   $('.book-page .push_all').show();
		   }else{
			   $('.book-page .push_all').hide();
		   }
		};
		
		var _hideBtn = function(time){
		   var $tips = $(".push_all");
		   $tips.removeClass('btns-box-in btns-box-out').css('zoom');
		   $tips.addClass('btns-box-in');
		    setTimeout(function(){
				if(_currentModel){
					$tips.removeClass('btns-box-in btns-box-out').css('zoom');
					$tips.addClass('btns-box-out');
					$("#J_slidebox").hide();
				}
				if(isOver){
					slidePage(1);
					isOver = false;
				}
				isAuto = true;
            }, time);
		};
		
		
		var _setMusic = function(mp3url){
			$jPlayer.jPlayer({
				ready: function(event){
					$(this).jPlayer("setMedia", {
						mp3 : _songUrl[_currentIndex]
					}).jPlayer("play");
					//alert(_songUrl[_currentIndex]);
				},
					
				ended: function(event){
					isOver = true;
					if(isAuto){
						slidePage(1);
					}
                },
                supplied: "mp3",
                preload : "auto",
                wmode: "window",
				
            });
		    $jPlayer.jPlayer("setMedia", {mp3 : mp3url});
			//alert(1);
            $jPlayer.jPlayer("play");
			isOver = false;
			try{
				window.bemetoy.stopNaviteMusic(); 
			}
			catch(e){};
			$('#J_btnsbox').show();
		};

        var _queryInfo = function(id,weixin){
            mRequest.getRequest({
                url : BEME.APIURL+'/book/bookInfo',
				data : {
                    id : id,
                    uid:mUtils.getUid()
                },
                type:'POST',
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data,weixin);
                    }
                    else{
                    }
                }
            });
        };
		
		var orientationchange = function(){
            resizeBody();

            var $doc = $(document.body),
                $win = $(window),
                bw = $win.width(),
                bh = $win.height();
            alert(bw);
            alert(bh);
            if(!window.orientation){
                window.orientation = bw>bh ? 90 : 0;
            }else{
                $doc.css('height', bh);
                return;
            }
            $doc.css('overflow','hidden');
            if(window.orientation==180||window.orientation==0){
                $doc.css('height', bh);
            }else if(window.orientation==90||window.orientation==-90){

                $doc.height(bh);
            }
        };

        var initBodyHeight = function(){
            var key = "onorientationchange" in window ? "orientationchange" : "resize";
            window.addEventListener(key, orientationchange, false);
            orientationchange();
        };
		
		
		var _initPage = function(){
			if(!_resourceLoaded){
				return ;
			}

			$('#J_loadingbox').hide();
			$('.book-page').show();
			if(_songUrl[_currentIndex] != 1){
				_setMusic(_songUrl[_currentIndex]);
			}

		};
		
		
		var _pageOut = function(pageIndex){
			 pageSlideOk = false;
			 var d = $.Deferred();
			if(pageIndex<0){
				pageIndex = totalPage+pageIndex;
			}
			$('#J_slidebox .left').removeClass('leftin');
			$('#J_slidebox .right').removeClass('rightin');
			setTimeout(function(){
				d.resolve();
			}, 0);
			return d.promise();
		};
		
		var _pageIn = function(){
			var img = _imgs[_currentIndex];
			$('#book-img').attr('src',img);
			
			$('#J_slidebox .left').removeClass('leftin').css('zoom');
			$('#J_slidebox .right').removeClass('rightin').css('zoom');
			$('#J_slidebox').show();
			$('#J_slidebox .left').addAnim('leftin');
			$('#J_slidebox .right').addAnim('rightin').done(function(){
				pageSlideOk = true;
			});
		}
		
		var  slidePage= function(flag){
			if(!pageSlideOk){
				return false;
			}
			pageSlideOk = false;

			var _oldIndex = _currentIndex;

			_currentIndex += flag;
			if(_currentIndex<0){
				_currentIndex += _totalPage;
			}else{
				_currentIndex = _currentIndex % _totalPage;
			}

			$('#J_pagenum').show().text('第'+(_currentIndex+1)+'/'+_totalPage+'页');
			
			if(_songUrl[_currentIndex] != 1){
				_setMusic(_songUrl[_currentIndex]);
				$('#J_btn-replay').show();
			}else{
				$('#player').jPlayer('stop');
				//$('#J_btnsbox').hide();
			
				if(_currentIndex > 1){
					$('#J_btn-replay').show();
				}else{
					$('#J_btn-replay').hide();
					_showPushAll(isHave);
				}	
			}
			//playerObj.play();

			_pageOut(_oldIndex).done(function(){
				_pageIn();
			});
			return false;
		}
		
		var _actionCollection = function(albumid, action){
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/collectionAlbum',
                data : {
                    album_id : albumid,
                    type : 'book',
                    uid:mUtils.getUid(),
                    action:action
                },
                type:'POST',
                successfn : function(jdata){
                    if(jdata.code===0){
                        var $box = $('#J_btn-collection');
                        if(action==='add'){
                            $box.addClass('favoritesed');
                            mApp.showTips('收藏成功！');
                        }else{
                            $box.removeClass('favoritesed');
                            mApp.showTips('已取消收藏！');
                        }
                    }
					else{
						//alert(action);
					}
                }
            });
        };


		
        var  _initEvent = function(id,weixin) {

			$(window).bind( 'orientationchange', function(e){
					//resizeBody();
					if(screenModel == 1){
						$('.show-warning').show();
						if(window.orientation == 0){
							document.documentElement.style.fontSize = (width+50)/7.5+'px';
							$('.img-block').addClass('h-block');
							$('.push_all').removeClass('btns-box-in btns-box-out').css('zoom');
							$('.push_all').addClass('btns-box-in');
							$(document.body).css('height', height);
							$('#J_slidebox').removeClass('hslide-box');
							$("#J_alert-box").removeClass("ver_alert");
							$('#J_slidebox').show();
							$(".book-page").removeClass('vertical_book_page');
							_currentModel = 0;
						}else{
							document.documentElement.style.fontSize = height/7.5+'px';
							$('.show-warning').hide();
							$('.img-block').removeClass('h-block');
							$(document.body).css('height', width);
							$('#J_slidebox').addClass('hslide-box');
							$("#J_alert-box").addClass("ver_alert");
							$(".book-page").addClass('vertical_book_page');
							_currentModel = 1;
							_hideBtn(4000);
						}
						
					}else{
						$('.show-warning').hide();
						$('.img-block').removeClass('h-block');
						$('#J_slidebox').removeClass('hslide-box');
						//_hideBtn();
					}
				});
				
			$('#J_slidebox .sbtn').on('touchstart', function(){
				var flag = 1;
				if($(this).hasClass('left')){
					flag = -1;
				}
				slidePage(flag);
			});
			
			$('.img-block').on('click',function(){
				if(screenModel == 1 && window.orientation == 90){
					if($('.push_all').hasClass('btns-box-out')){
						$('.push_all').removeClass('btns-box-in btns-box-out').css('zoom');
						$('.push_all').addClass('btns-box-in');
						$('#J_slidebox').show();
						isAuto = false;
						_hideBtn(4000);
						
					}
					else{
						_hideBtn(500);
					}
				}			
			});
			
			 $('#J_btn-replay').on('click',function(){
				$('#player').jPlayer('stop');
				$('#player').jPlayer('play');
				try{
					window.bemetoy.stopNaviteMusic(); 
				}
				catch(e){};
			});
			
			 $('#J_btn-pushtoy').on('touchstart', function(){
				var data={},
				info = _songList[0];
				data['url']=info.url;
				data['md5']=info.md5;
				data['type'] = info.type;
				data['tag']='picture_book';
				data['tagval']=id;
				data['size'] = info.filesize;
				var  current = $.extend({}, data);
				current['bid'] = data['tagval'];
				current['fid'] =info.id;
				mPush.playMusic(data,current);
				_czc.push(["_trackEvent",'歌曲推送数','歌曲推送数','歌曲推送数']);
				_czc.push(["_trackEvent",'有声绘本',shareConfig.title,info.name]);
			});
			
			$("#J_push_all").on('click',function(){
				var data={},
				info = _songList[1];
				data['url']=info.url;
				data['md5']=info.md5;
				data['type'] = info.type;
				data['tag']='picture_book';
				data['tagval']=id;
				data['size'] = info.filesize;
				var  current = $.extend({}, data);
				current['bid'] = data['tagval'];
				current['fid'] =info.id;
				mPush.playMusic(data,current);
				_czc.push(["_trackEvent",'歌曲推送数','歌曲推送数','歌曲推送数']);
				_czc.push(["_trackEvent",'有声绘本',shareConfig.title+'推送全部',info.name]);
			});

			
			 if('onbeforeunload' in window){
				window.onbeforeunload = function(){
					$('#player').jPlayer('stop');
				};
			}else if('pagehide' in document){
				document.pagehide =  function(){
					$('#player').jPlayer('stop');
				};
			}
			
			 $('#J_btn-share').on('click',function(){
				 var url = window.location.href + '&weixin=1';
				  var data = {
                    'title':shareConfig.title,
                    'desc':shareConfig.desc,
                    'url':url,
                    'shareType':0,
                    'imgUrl':mUtils.imageWeixin(shareConfig.imgUrl)
                };
                mApp.shareWeixinUrl(data);
            });
			
			var isChange = false; 
			
			/*$(document.body).swipeAsyn(function(e, direction){
				direction = direction.toLowerCase();
				if(direction=='left'||direction=='right'){
					var flag = direction=='left' ? 1 : -1;
					if(!isChange){
						slidePage(flag);
					}else{
						$('#book-img').css('-webkit-transform','translate(0,-10px)');
					}
				}else{
					if(direction == 'up'){
						$('#book-img').css('-webkit-transform','scale(2)');
						isChange = true;
					}else{
						$('#book-img').css('-webkit-transform','scale(1)');
						isChange = false;
					}
				}
				//$(document.body).prepend(e.target.tagName+'_'+direction);
				e.preventDefault();
			});*/
			
			/*var beforeX=0,beforeY=0,x=0,y=0;
			
			var hammertime = new Hammer(document.getElementById('img-block'));
			 hammertime.on("pan", function (e) {
				 if(isChange){
					 //beforeX = beforeX +e.deltaX;
					 y = y +e.deltaY;
					 if(e.additionalEvent == 'panright'){
						 beforeX -= 10; 
					 }
					 if(e.additionalEvent == 'panleft'){
						 beforeX += 10; 
					 }
					 if(e.additionalEvent == 'panup'){
						 beforeY += 10; 
					 }
					  if(e.additionalEvent == 'pandown'){
						 beforeY -= 10; 
					 }
					 if(beforeX > $("#book-img").width()/2){
						 beforeX = $("#book-img").width()/2;
					 }else if(beforeX < -$("#book-img").width()/2){
						  beforeX = -$("#book-img").width()/2;
					 }
					 if(beforeY > $("#book-img").height()/2){
						 beforeY = $("#book-img").height()/2;
					 }else if(beforeY < -$("#book-img").height()/2){
						  beforeY = -$("#book-img").height()/2;
					 }
	
					$('#book-img').css('transform-origin', beforeX+'px '+ beforeY+'px 0px'); 
					
				 }

			});
			
			hammertime.on("swipeleft",function(e){
				 if(!isChange){
						 slidePage(1); 
				 } 
			 });
			  
			hammertime.on("swiperight",function(e){
				 if(!isChange){
						 slidePage(-1); 
				 } 
			 });*/
			
			/* hammertime.add(new Hammer.Pinch());
			 //添加事件
			 hammertime.on("pinchin", function (e) {
				//$('#book-img').css('width','100%');
				$('#img-block').css('z-index','0');
				$('#book-img').css('transform-origin','0px 0px 0px'); 
				$('#book-img').css('transform','scale3d(1, 1, 1)');
				$('#book-img').css("transition",'transform 300ms ease-out');
				beforeX = 0;
				beforeY = 0;
				isChange = false;
				 //控制台输出
				 e.preventDefault();
			 });
			 

			 
			 hammertime.on("pinchout", function (e) {
				//$('#book-img').css('width',$('#book-img').width()*2 +"px");
				//$('#book-img').css('height','auto');
				$('#book-img').css('transform','scale3d(2, 2, 1)');
				$('#book-img').css("transition",'transform 300ms ease-out');
				$('#img-block').css('z-index','10');
				isChange = true;
				 //控制台输出
				 e.preventDefault();
			 });
			 */

			 
			$(document.body).swipeAsyn(function(e, direction){
                direction = direction.toLowerCase();
                if(direction=='left'||direction=='right'){
                    var flag = direction=='left' ? 1 : -1;
                    slidePage(flag);
                }
                //$(document.body).prepend(e.target.tagName+'_'+direction);
                e.preventDefault();
            });

			

			
			$('#J_btn-collection').on('click',function(){
				var $this = $(this);
                var setting ={};
                setting['content']='确定不再收藏该绘本？';
                if($this.hasClass('favoritesed')){
                    mApp.showAlert(setting,function(){
                        _actionCollection(id, 'del');
                    });
                }else{
                    _actionCollection(id, 'add');
                }
				
			});
			
			

        };

        exports.init = function(){
            var hashs = mUrl.getParams();
            if(hashs.weixin == 1){
                mApp.setTitle("有声绘本");
            }
            else{
                mApp.setTitle("有声绘本");
            }
            _queryInfo(hashs.id,hashs.weixin);
            _initEvent(hashs.id,hashs.weixin);
				//	initBodyHeight();
        };


        exports.uninit = function(){
				$('#player').remove();
        };
    });