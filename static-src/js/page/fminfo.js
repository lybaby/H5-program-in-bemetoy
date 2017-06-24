/* global define, $, BEME*/
define('page/fminfo', ['comm/utils', 'comm/url', 'comm/request','comm/pushsong','comm/clickevent',  'page/myalbum','helper/app', 'helper/playerbar', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mPush,mClick,mMyalbum, mApp, mPlayerbar, require, exports){
        "use strict";

        var _songList = {},
            _playList = {},
            _dataList = [],
            isNew = mApp.changePlayList();
        var is_subscription=false;

        var _renderInfo = function(jdata){
            var ver = mApp.getUA(1);
            if(ver > 0){
                $('.infoclick .share').show();
            }

            var $box = $('#J_top-box');
            $box.find('.img-cover').attr('imgsrc', mUtils.imageUrlStationHead(jdata.station.url,1));
            if(jdata.station.is_regular == 1){
                $box.find('.uptime').text('定时更新');
            }
            else{
                $box.find('.uptime').text('每'+mUtils.formatPushTime(jdata.station.push_time)+'更新');
            }
            $box.find('.name').text(jdata.station.name);
            $box.find('.playbox').text(jdata.station.demand_num);
            if(!jdata.subscription){
                var $parent = $('#J_description').parent();
                if($parent.hasClass('btn-subscribed')){
                    $parent.removeClass('btn-subscribed');
                }
                $('#J_description').text('订阅');
            }
            else{
                is_subscription = true;
                var $parent = $('#J_description').parent()
                if(!$parent.hasClass('btn-subscribed')){
                    $parent.addClass('btn-subscribed');
                }
                $('#J_description').text('已订阅');
            }
            $('#J_album-desc').text(jdata.station.description);
            $('#J_ordernum').text(jdata.station.subscription_num);
            if(jdata.radios){
                $('#J_songnum').text(jdata.radios.length);
            }
            else{
                $('#J_songnum').text(0);
            }
            $('#person_name').text(jdata.station.author);

            $.each(jdata.radios,function(i,radio){
                radio['tagval'] = jdata.station.id;
            });

            var html='';
            _dataList = jdata.radios;

            if(isNew){
                var songlist=[];
                var songl = {};
                $.each(_dataList,function(i,song){
                    songl = {};
                    songl['id'] = song.id;
                    songl['name'] = song.name;
                    songl['filesize'] = song.filesize;
					songl['song_time'] = song.radio_time;
                    songl['type'] = 3;
                    songl['md5']= song.md5;
                    songl['url']= song.url;
                    songl['song_type']= 'station';
                    songl['tagval']=jdata.station.id;
                    songl['link']=BEME.URL+'?m=weixin&id='+song.id+'&type=song&album_type=station&album_id='+jdata.station.id;
                    songlist.push(songl);
                });
                _playList['image']=  mUtils.imageUrlStationHead(jdata.station.head_url,0);
                _playList['name']=jdata.station.name;
                _playList['song_list']=songlist;
                html = mUtils.template('J_temp-item-new', {list:_dataList, flag:true});
            }else{
                $.each(jdata.radios, function(i, info){
                    info._type = 'station';
                    info.tag = 'station';
                    _songList[info.id] = info;
                });
                html = mUtils.template('J_temp-item', {list:_dataList, flag:true});
            }

            $('#J_song-box').html(html);


            mApp.showImage();
            mApp.backScroll();
        };

        //请求一些业务数据
        var _queryInfo = function(albumid){
			var toy_id =  0;
			try{
				toy_id= window.bemetoy.getToUerid();
			}catch(e){
				toy_id = 0;
			}
            mRequest.getRequest({
            url : BEME.APIURL+'/station/radiolist',
            type : 'post',
            data:{
                id:albumid,
                uid:mUtils.getUid(),
				toy_id: toy_id
            },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data);
                    }
                }
            });
        };

        var _showStationSuccess = function(identity){
            mRequest.getRequest({
                url : BEME.APIURL+'/station/getStationPushTime',
                type : 'post',
                 data:{
                     id:identity,
                     uid:mUtils.getUid()
                 },
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        var str = jdata.data.name + '电台节目将在每';
                        if(jdata.data.is_regular == 1){
                            str += "次更新的";
                        }
                        else{
                            str += mUtils.formatPushTime(jdata.data.push_time);
                        }
                        str +=jdata.data.push_time_hours + ':00点准时推送给玩具，记得收听哦';
                        mApp.showAlert(str);
                    }
                }
            });
        };

        window.onSubscribeRadioResult = function(identity, state, isSuccess){
            if(state == 1){
                if(isSuccess){
                    var $parent = $('#J_description').parent();
                    _showStationSuccess(identity);
                    $('#J_description').text('已订阅');
                    $parent.addClass('btn-subscribed');
                }
                else{
                    mApp.showTips("订阅失败!");
                }
                return;
            }
            if(state == 0){
                if(isSuccess){
                    var $parent = $('#J_description').parent();
                    if($parent.hasClass('btn-subscribed')){
                        $('#J_description').text('订阅');
                        $parent.removeClass('btn-subscribed');
                    }
                    is_subscription = false;
                    mApp.showTips("取消订阅成功!");
                }
                else{
                    mApp.showTips("取消订阅失败!");
                }
            }
            return;

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


            $('.infoclick .btn-subscribe').on('click', function(){
                try{
                    var $this = $(this);
                    if($this.hasClass('btn-subscribed')){
                        var setting ={};
                        setting['content']='确定不再订阅该电台？';
                        mApp.showAlert(setting,function(){
                            var a=  window.bemetoy.subscribeRadio(albumid,0,'');
                        });
                    }else{
                        var uid = mPush.getUid();
                        if(uid.to < 1){
                            if(isNew){
                                try{
                                    window.bemetoy.bindToyByType(2);
                                }
                                catch(e){
                                    //alert(e);
                                }
                            }
                            else{
                                window.location.href='#!m=pushfail&type=station&text=2';
                            }
                            return ;
                        }
                        else{
                            var a=  window.bemetoy.subscribeRadio(albumid,1,'');
                        }
                    }
                }
                catch(e){
                    //alert(e);
                }
            });

            if(isNew){
                $('#J_song-box').on('click', '.item .item-a .title-box,.item .item-a .desc', function(){
                    mClick.audition_new(_playList,$(this).parent());
                });

                $('#J_song-box').on('click', '.item-play', function(){
                    mClick.pushSong($(this).parent());
                });
            }else{
                $('#J_song-box').on('click', '.item .item-a .title-box,.item .item-a .desc', function(){
                    mClick.pushSong($(this).parent());
                });

                $('#J_song-box').on('click', '.item-play', function(){
                    mClick.audition(_songList,$(this).parent());
                });
            }


            var flag = true;
            $('#J_option-btn').on('click', function(){
                if(flag){
                    $('#J_option-btn').removeClass('option-btn');
                    $('#J_option-btn').addClass('option-btn-on');
                }else{
                    $('#J_option-btn').removeClass('option-btn-on');
                    $('#J_option-btn').addClass('option-btn');
                }
                flag = !flag;
                _dataList.reverse();
                var html = '';
                if(isNew){
                    html = mUtils.template('J_temp-item-new', {list:_dataList, flag:flag});
                }
                else{
                    html = mUtils.template('J_temp-item', {list:_dataList, flag:flag});
                }

                $('#J_song-box').html(html);
            });

            $('.top').on('click','.edit',function(){
                location.href ='#!m=descriptiontime&id='+albumid;
            });

            $('.top').on('click','.cancel',function(){
                var $this = $(this);
                var setting ={};
                setting['content']='确定不再订阅该电台？';
                mApp.showAlert(setting,function(){
                    try{
                        window.bemetoy.subscribeRadio(albumid,0,'');
                    }
                    catch(e){
                        alert(e);
                    }

                });
                $('.top').hide();
            });


            $('.info-box').on('click', '.share', function(){
                mClick.shareToWeixin(albumid,'station',albumid);
            });
        };

        //初始化页面
        exports.init = function(){
            mApp.setTitle("电台");
            $('.back-btn').show();
            mUtils.headerMenu();
            $('#myplay').show();
            is_subscription = false;
            var hashs = mUrl.getParams();
            mApp.showHeader();
            //请求数据

            _queryInfo(hashs.id);

            _initEvent(hashs.id);
        };


        //反初始化绑定事件
        exports.uninit = function(){
            $('#J_album-desc, #J_song-box, #J_option-btn, #J_info-box .btn-subscribe').off('click');
        };
    });

