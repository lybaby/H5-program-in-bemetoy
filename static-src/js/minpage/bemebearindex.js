/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/bemebearindex', ['comm/utils', 'comm/url','helper/playerbar','comm/request', 'comm/clickevent','helper/app', 'helper/temphtml','helper/jrange', 'require', 'exports'],
    function(mUtils, mUrl,mPlayerbar, mRequest,mClick, mApp, mTemp, jrange, require, exports){
        "use strict";

        var shareConfig = {
            title : "贝美童趣馆",
            desc : '小囧熊英文乐园', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        },
		isLocal=mApp.changeAlbumLocal();

        var _renderInfo = function(jdata,weixin){
            var $box = $('.bear-page');
            $box.find('.banner .img-cover').attr('src', jdata.url);
            var ver1 = mApp.getUA(0);
            if(ver1 == 1){
                $('.main-header').show();
                $('.main-header .back-btn').show();
                $('#J_wrapper').css('padding','1.1rem 0 0 0');
                $('.sub').hide();
            }

            var ver2 = mApp.getUA(1);
            if(ver1 > 1 && ver2 > 0){
                $('.share_weixin').show();
            }

            if(weixin == 1){
                $('.share_weixin').hide();
                $('.push-song').hide();
            }
           // shareConfig.title = jdata.name;
            //shareConfig.desc = jdata.description;
            shareConfig.imgUrl = jdata.url;
            if(jdata.album){
                $.each(jdata.album,function(i,album){
					album['album_id'] = album['id'];
                    if(weixin == 1){
                        album['id'] = '#!m=weixin&id='+ album['id'] + '&type=album';
                    }
                    else{
                        album['id'] = '#!m=albuminfo&id='+ album['id'];
                    }
					if(isLocal){
						album['id'] = 'javascript:void(0);';
					}
                });
                var html = mUtils.template('J_temp-item-album', {list:jdata.album});
                $('#album_list').html(html);
				if(isLocal){
					$("#album_list").on("click",'.item-a',function(){
						mClick.jumpLocalAlbum($(this));
					});
				}
				
            }

            if(weixin == 1){
                var weixin = require(['minpage/weixin'],function(context){
                    context.getWeixinConfig(shareConfig);
                });
            }
            mApp.backScroll();
            //mApp.getWeixinConfig(shareConfig);
        };

        var _renderList = function(jdata,type,weixin){
            $.each(jdata.list,function(i,ip){
                ip['content'] = '第' + ip.sequence + '期：'+ip.sub_name;
                ip['question'] =  exports.changeDate(ip.update_time);
                if(weixin == 1){
                    ip['id'] = ip['id'] + '&weixin=1';
                }
            });
            var title = '';
            title = exports.changeDate(jdata.list[0].update_time)+'最新期——'+ jdata.list[0].sub_name;
            $('#new-title').text(title);
            $('.title-box').attr('value',jdata.list[0].id);
            _rendListBox(jdata.list.slice(0,5).reverse(),weixin);
            var num = parseInt(jdata.count/10);
            var num_a = jdata.count%10;
            var html = '';
            for(var i=0; i < num;i++){
                if(i/3 == 0){
                    html += '<li><a class="selected" style="margin:0;" value='+(i+1)+' type='+ type+'>第'+i+'1-'+(i+1)+'0期</a></li>';
                }
                else if(i/3 == 2){
                    html += '<li><a class="selected" style="margin:0;float:right;" value='+(i+1)+' type='+ type+'>第'+i+'1-'+(i+1)+'0期</a></li>';
                }
                else{
                    html += '<li><a  class="selected" style="margin:0;" value='+(i+1)+' type='+ type+'>第'+i+'1-'+(i+1)+'0期</a></li>';
                }
            }
            html += '<li><a class="selected" style="margin:0;" value='+(i+1)+' type='+ type+'>第'+(num*10+1)+'-'+jdata.count+'期</a></li>';

            $('.page-list').html(html);

            $('.page-list li').on('click',function(){
                var page = $(this).find('a').attr('value');
                var type = $(this).find('a').attr('type');
                $(this).parent().find('a').addClass('selected');
                $(this).find('a').removeClass('selected');
                _queryPage(type,page,weixin);
            });

        };


        var _rendListBox =  function(jdata,weixin){
            $.each(jdata,function(i,ip){
                ip['content'] = '第' + ip.sequence + '期：'+ip.sub_name;
                ip['question'] =  exports.changeDate(ip.update_time);
                if(weixin == 1){
                    ip['id'] = ip['id'] + '&weixin=1';
                }
            });
            var html = mUtils.template('J_temp-item', {list:jdata.reverse()});
            $('#J_list-box').html(html);
        }

        var _queryPage = function(type,page,weixin){
            mRequest.getRequest({
                url : BEME.APIURL+'/ip/ipList',
                data:{
                    type:type,
                    page:page,
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _rendListBox(jdata.data.list,weixin);
                    }
                    else{
                        //alert(1);
                    }
                }
            });
        };

        var _queryInfo = function(type,weixin){
            mRequest.getLocalRequest({
                url : BEME.APIURL+'/ip/ipClass?type='+type,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data,weixin);
                    }
                    else{
                        //alert(1);
                    }
                }
            });

            mRequest.getLocalRequest({
                url : BEME.APIURL+'/ip/ipList',
                data:{
                    type:type
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderList(jdata.data,type,weixin);
                    }
                    else{
                        //alert(1);
                    }
                }
            });

        };

        exports.changeDate = function(date){
            var dat = new Date(date);
            var res = (dat.getMonth() + 1) + "月" + dat.getDate() + "日 ";
            return res;
        };
		
		

        var  _initEvent = function(type) {

            $('#play-music').on('click','.music-list .push-song',function(){
                mClick.pushSong($(this).parent());
            });

            $('.title-box').on('click',function(){
                var id = $(this).attr('value');
                var herf = '#!m=bemebearinfo&id='+id+'&type=2';
                window.location.href=herf;
            });

            $('.play-other').on('click','.show-list',function(){
                var $div = $('#J_list-box').find('.list');
                if($div.hasClass('hide-all')){
                    $div.removeClass('hide-all');
                    $div.addClass('show-all');
                    $('.play-other .show-list').removeClass('show-list-down');
                    $('.play-other .show-list').addClass('show-list-up');
                }
                else{
                    $div.removeClass('show-all');
                    $div.addClass('hide-all');
                    $('.play-other .show-list').addClass('show-list-down');
                    $('.play-other .show-list').removeClass('show-list-up');
                }
            });

            $('.share_weixin').on('click',function(){
                mClick.shareToWeixin(type,'ip','ipindex');
            });

            $('.show-preson').on('click',function(){
                $('.show-preson').hide();
                $('.show-hide-all').show();
            });

            $('.hide-preson').on('click',function(){
                $('.show-preson').show();
                $('.show-hide-all').hide();
            });

        };

        exports.init = function(){
            mApp.setTitle("小囧熊英文乐园");
            var hashs = mUrl.getParams();
            _queryInfo(hashs.type,hashs.weixin);
            mApp.hideAllBox();
            _initEvent(hashs.type);

        };


        exports.uninit = function(){
            $('#play-music').off('click');
        };
    });