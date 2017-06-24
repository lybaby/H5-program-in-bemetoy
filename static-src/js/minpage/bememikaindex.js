/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/bememikaindex', ['comm/utils', 'comm/url','helper/playerbar','comm/request', 'comm/clickevent','helper/app','require', 'exports'],
    function(mUtils, mUrl,mPlayerbar, mRequest,mClick, mApp, require, exports){
        "use strict";

        var shareConfig = {
            title : "贝美童趣馆",
            desc : '米卡分龄教育', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        };

        var _renderInfo = function(jdata,weixin){
            var $box = $('.mika-info-page');
            $box.find('.banner .img-cover').attr('src', jdata.url);
            var ver1 = mApp.getUA(0);
            if(ver1 == 1){
                $('.main-header').show();
                $('.main-header .back-btn').show();
                $('#J_wrapper').css('padding','1.1rem 0 0 0');
            }

            var ver2 = mApp.getUA(1);
            if(ver1 > 1 && ver2 > 0){
                $('.share_weixin').show();
            }

            if(weixin == 1){
                $('.share_weixin').hide();
            }
          //  shareConfig.title = jdata.name;
            //shareConfig.desc = jdata.description;
            shareConfig.imgUrl = jdata.url;
			
			 var html = mUtils.template('J_temp-item-classify', {list:jdata.classifys});
			$('.classify-list').html(html);

            if(weixin == 1){
                var weixin = require(['page/weixin'],function(context){
                    context.getWeixinConfig(shareConfig);
                });
            }
            //mApp.getWeixinConfig(shareConfig);
            mApp.backScroll();
        };

        var _renderList = function(jdata,type,weixin){
            _rendListBox(jdata.list,weixin);
            var num = parseInt(jdata.count/10);
            var num_a = jdata.count%10;
            var html = '';
            for(var i=0; i < num;i++){
                if(i%3 == 0){
                    html += '<li><a  style="margin:0;" value='+(i+1)+' type=3>第'+i+'1-'+(i+1)+'0期</a></li>';
                }
                else if(i%3 == 1){
                    html += '<li style="margin: 0 5%;"><a style="margin:0;" value='+(i+1)+' type=3>第'+i+'1-'+(i+1)+'0期</a></li>';
                }
                else{
                    html += '<li><a  style="margin:0;" value='+(i+1)+' type=3>第'+i+'1-'+(i+1)+'0期</a></li>';
                }
            }
            if(num_a == 2){
                html += '<li style="margin:0 5%;"><a style="margin:0;" value='+(i+1)+' type=3>第'+(num*10+1)+'-'+jdata.count+'期</a></li>';
            }else if(num_a == 1){
                html += '<li><a style="margin:0;" value='+(i+1)+' type=3>第'+(num*10+1)+'-'+jdata.count+'期</a></li>';
            }
       
            $('.page-list').html(html);

            $('.page-list li').on('click',function(){
                var page = $(this).find('a').attr('value');
                var type = $(this).find('a').attr('type');
                $(this).parent().find('a').removeClass('selected');
                $(this).find('a').addClass('selected');
                _queryPage(type,page,weixin);
            });

        };


        var _rendListBox =  function(jdata,weixin){
            $.each(jdata,function(i,ip){
                ip['content'] = ip.sub_name ;
                ip['question'] =  exports.changeDate(ip.update_time);
                if(weixin == 1){
                    ip['id'] = ip['id'] + '&weixin=1';
                }
            });
            var html = mUtils.template('J_temp-item', {list:jdata});
            $('#J_list-box').html(html);
        }

   		var _queryPage = function(type,page,weixin){
            mRequest.getRequest({
                url : BEME.APIURL+'/ip/mikaPage',
                data:{
                    type:type,
                    page:page,
                },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _rendListBox(jdata.data.list.reverse(),weixin);
                    }
                    else{
                        //alert(1);
                    }
                }
            });
        };

        var _queryInfo = function(type,weixin){
            mRequest.getLocalRequest({
                url : BEME.APIURL+'/ip/mikaIndex?type='+type,
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
                url : BEME.APIURL+'/ip/mikaPage',
				data:{
					page:0
				},
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderList(jdata.data,weixin,false);
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

            $('.share_weixin').on('click',function(){
                mClick.shareToWeixin(type,'ip','ipindex');
            });

        };

        exports.init = function(){
            mApp.setTitle("米卡分龄教育");
            var hashs = mUrl.getParams();
            _queryInfo(hashs.type,hashs.weixin);
            mApp.hideAllBox();
            _initEvent(hashs.type);

        };


        exports.uninit = function(){
            $('#play-music').off('click');
        };
    });