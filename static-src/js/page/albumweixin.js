/* global define, $, BEME*/
define('page/albumweixin', ['jweixin', 'comm/utils', 'comm/url', 'comm/request','comm/pushsong','comm/clickevent', 'helper/app', 'helper/playerbar','page/myalbum', 'require', 'exports'],
    function(wx, mUtils, mUrl, mRequest,mPush,mClick, mApp, mPlayerbar,mMyalbum, require, exports){
        "use strict";

        var _songList = {};


        var shareConfig = {
            title : "这里是标题",
            desc : '这里是描述语言', //分享给朋友需要
            link : location.href, //如果不加统计参数,
            imgUrl : '专辑图片放进来'
        };

        var _renderInfo = function(jdata){
            var $box = $('#J_album-box');
            $box.find('.img-cover').attr('imgsrc', mUtils.imageUrl(jdata.url));
            shareConfig.desc = jdata.description;
            shareConfig.imgUrl = mUtils.imageUrl(jdata.url);
            $box.find('.desc').text(jdata.description);
            _queryInfo(jdata.type,jdata.album_id);
        };

        var _renderAlbum = function(type,jdata){
            var $box = $('#J_album-box');
            if(type == 1){
                $box.find('.title').text(jdata.album.name);
                shareConfig.title = jdata.album.name;
            }
            if(type == 2){
                $box.find('.title').text(jdata.topic.name);
                shareConfig.title = jdata.topic.name;
            }
            if(type == 3){
                $box.find('.title').text(jdata.station.name);
                shareConfig.title = jdata.station.name;
            }
            if(jdata.tags){
                var html = '';
                $.each(jdata.tags, function(i, tag){
                    var color = mUtils.getRandColor();
                    html += '<li style="color:'+ color+';border-color:'+ color+'">'+tag['name']+'</li>';
                });
                $box.find('.tags').html(html);
            }

            if(type == 3){
                html = mUtils.template('J_temp-item', {list:jdata.radios});
                $('#J_song-box').html(html);
            }
            else{
                html = mUtils.template('J_temp-item', {list:jdata.songs});
                $('#J_song-box').html(html);

                $.each(jdata.songs, function(i, info){
                    _songList[info.id] = info;
                });
            }
            mApp.showImage();
            wx.onMenuShareTimeline(shareConfig);
            wx.onMenuShareAppMessage(shareConfig);
            wx.onMenuShareQQ(shareConfig);
            wx.onMenuShareWeibo(shareConfig);
            wx.onMenuShareQZone(shareConfig);
        };

        var _queryWeixin = function(albumid){
            mRequest.getRequest({
                url : BEME.APIURL+'/weixin/getWeixin?id='+albumid,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
                    else{
                    }
                }
            });

        }

        //请求一些业务数据
        var _queryInfo = function(type,albumid){
            if(type == 'album'){
                mRequest.getRequest({
                    url : BEME.APIURL+'/albums/albumList?id='+albumid,
                    successfn : function(jdata){
                        mApp.loaded();

                        if(jdata.code===0){
                            _renderAlbum(1,jdata.data);
                        }
                        else{
                            //alert(1);
                        }
                    }
                });
            }
            if(type == 'topic'){
                mRequest.getRequest({
                    url : BEME.APIURL+'/albums/topicList?id='+albumid,
                    successfn : function(jdata){
                        mApp.loaded();

                        if(jdata.code===0){
                            _renderAlbum(2,jdata.data);
                        }
                        else{
                            //alert(1);
                        }
                    }
                });
            }
            if(type == 'station'){
                mRequest.getRequest({
                    url : BEME.APIURL+'/station/radiolist?id='+albumid,
                    successfn : function(jdata){
                        mApp.loaded();

                        if(jdata.code===0){
                            _renderAlbum(3,jdata.data);
                        }
                        else{
                            //alert(1);
                        }
                    }
                });
            }

        };

        //初始化一些点击事件
        var _initEvent = function(albumid){
            $('#J_album-desc').on('click', function(){
                var $this = $(this);
                if($this.attr('block')){
                    $this.css('display', '-webkit-box');
                    $this.attr('block', null);
                }else{
                    $this.css('display', 'block');
                    $this.attr('block', 1);
                }
            });

            $('#J_song-box').on('click', '.item', function(){
                var $this = $(this),
                    sid = $this.attr('sid');
                mPlayerbar.initWeixinPlayer($this, _songList[+sid]);
            });

        };

        //初始化页面
        exports.init = function(){
            mApp.setTitle("专辑");
            var hashs = mUrl.getParams();
            mApp.showHeader();
            //请求数据
            _queryWeixin(hashs.id);

            _initEvent(hashs.id);
        };


        //反初始化绑定事件
        exports.uninit = function(){
            $('#J_album-desc,.select-all, #J_song-box, #J_album-box .favorites').off('click');
        };
    });