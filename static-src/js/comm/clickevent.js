/*global define, $, BEME*/

define('comm/clickevent', ['comm/url','comm/pushsong','comm/request','helper/playerbar','helper/app','page/myalbum', 'require', 'exports'], function(mUrl,mPush,mRequest,mPlayerbar,mApp,mMyalbum, require, exports){
    "use strict";
	var isSubmiting = false;


    exports.audition = function(_songList,_this){
        var $this = $(_this).parent(),
            sid = $this.attr('sid');
        var select = $('.select-all').css('display');
        var select_d= $('.delete-all');
        if(select === undefined ||select === '' ||(select ==='none'&&select_d.length ===0) || (select ==='none'&&select_d.css('display') === 'none') ){
            mPlayerbar.initPlayer($this, _songList[+sid]);
        }
        else{
            exports.checkbox_all($this);
        }
    };
	
	
	exports.audition_new = function(_songList,_this){
        var $this = $(_this).parent(),
            sid = $this.attr('sid');
        var select = $('.select-all').css('display');
        var select_d= $('.delete-all');
        if(select === undefined ||select === '' ||(select ==='none'&&select_d.length ===0) || (select ==='none'&&select_d.css('display') === 'none') ){
             var index = $this.index();
				try{
					_songList['index'] = index;
					window.bemetoy.playMuiscByApp(JSON.stringify(_songList));
				}
				catch(e){}
        }
        else{
            exports.checkbox_all($this,true);
        }
    };


    exports.initSelectAllEvent = function(className,isNew){

        $('.select-all').on('click','.left,.title',function(){
            var $this = $(this).parent();
            var val = $this.find('.left').attr('value');
            var play = $('.item').find('.checkbox');
            if(+val == 0) {
                $this.find('img').attr('src','./static/images/xuanze.png');
                $this.find('.left').attr('value',1);
                $.each(play,function(i,p){
                    $(p).find('img').attr('src','./static/images/xuanze.png');
                    $(p).attr('value',1);
                });
                $('#add').removeClass('content_add');
				$('#add').removeClass('add_no');
                $('#add').addClass('content');
                $('#delete').removeClass('content_add');
                $('#delete').addClass('content');
				$('#push').removeClass('push_no');
            }
            else {
                $this.find('img').attr('src','./static/images/xuanzekong.png');
                $this.find('.left').attr('value',0);
                $.each(play,function(i,p){
                    $(p).find('img').attr('src','./static/images/xuanzekong.png');
                    $(p).attr('value',0);
                });
               $('#add').removeClass('content');
                $('#add').addClass('content_add');
				if(isNew){
					$('#add').addClass('add_no');
				}
                $('#delete').removeClass('content');
                $('#delete').addClass('content_add');
				$('#push').addClass('push_no');
            }
        });

        $('.select-all').on('click','#cancel',function(){
            $('.'+className).show();
            $('.select-all').hide();
            $('.item').find('.checkbox').hide();
            if($('.item').find('.checkbox span').length){
                $('.item').find('.checkbox').show();
                $('.item').find('.checkbox span').show();
                $('.item').find('.checkbox img').hide();
            }
			if(isNew){
				$('.item').find('.item-play img').show();
			}
        });

        $('.select-all').on('click','#add',function(){
            var playList = $('.item');
            var arr = [];
            var arrType= [];
            var arrIds =[];
            $.each(playList,function(i,play){
                var $this = $(play);
                var val = $this.find('.checkbox').attr('value');
                if(+val === 1) {
                    arr.push($this.attr('sid'));
                    arrType.push($this.attr('tag'));
                    arrIds.push($this.attr('tagval'));
                }
            });
            if(mMyalbum.showAddMyablumBox(arr.join(','), arrType.join(','),arrIds.join(','),className)){
            }
        });
		
		$('.select-all').on('click','#push',function(){
			var playList = $('.item');
            var arr = [],
			arrInfo = [],
			nameInfo = [],
			cutArr = [],
			num = 0;
            $.each(playList,function(i,play){
                var $this = $(play);
                var val = $this.find('.checkbox').attr('value');
                if(+val === 1) {
                    var  data ={};
					var conf = ['url', 'md5', 'type', 'tag', 'tagval','size'];
					$.each(conf,function(j,key){
						data[key] = $this.attr(key);
					});
					arr.push(data);
					var info = $.extend({}, data);
					info['bid'] = data['tagval'];
					info['fid'] =$this.attr('sid');
					arrInfo.push(info);
					nameInfo.push($this.find('.title').text());
                }
            });
			if(arrInfo.length > 10){
				num = Math.ceil(arrInfo.length/10);
				for(var i =0; i< num;i++){
					cutArr.push(arrInfo.slice(i*10,(i+1)*10));
				}
				$.each(cutArr,function(j,key){
					mPush.playAllMusic(key,key);
				});
			}else{
				mPush.playAllMusic(arr,arrInfo);
			}
			var title = document.title;
			var sName = exports.findName();
			_czc.push(["_trackEvent",'全部播放',sName,'全部播放']);
			$.each(nameInfo,function(j,name){
				_czc.push(["_trackEvent",'歌曲推送数','歌曲推送数','歌曲推送数']);
				_czc.push(["_trackEvent",title,sName,name]);
			});
		});

    };

    exports.playEdit = function(className,isNew){
        if($('.item').find('.checkbox')[0].style.display === "none" || $('.item').find('.checkbox')[0].style.display === '') {
            $('.'+className).hide();
            $('.select-all').show();
            $('.item').find('.checkbox').show();
            if($('.item').find('.checkbox span').length){
                $('.item').find('.checkbox span').hide();
                $('.item').find('.checkbox img').show();
            }
			if(isNew){
				$('.item').find('.item-play img').hide();
			}
        }
    };


    exports.pushSong = function($this){
        var $this = $($this).parent(),
            sid = $this.attr('sid');
        var select = $('.select-all').css('display');
        var select_d= $('.delete-all');
        if(!$('.select-all').length || select === '' ||(select ==='none'&&select_d.length ===0) || (select ==='none'&&select_d.css('display') === 'none') ){
            var conf = ['url', 'md5', 'type', 'tag', 'tagval','size'],
                data ={};
            $.each(conf,function(i,key){
                data[key] = $this.attr(key);
            });
            var info = $.extend({}, data);
            info['bid'] = data['tagval'];
            info['fid'] =$this.attr('sid');
            mPush.playMusic(data,info);
            var title = document.title;
            var name = $($this).find('.title').text();
			if(name == ''|| name == null){
                name = $($this).find('.name').text();
            }
            var sName = exports.findName();
           // _czc.push(["_trackEvent",title,sName,name]);
        }
        else{
            exports.checkbox_all($this);
        }
    };

    exports.pushAllSong = function($this){
        if($('.item-a').filter(".play-btn").attr('value') != 0){
            return;
        }
        $('.item-a').filter(".play-btn").attr('value',1);
        var $this = $($this).parent().parent().find('.item');
        var conf = ['url', 'md5', 'type', 'tag', 'tagval','size'];
        var arr=[];
        var arrInfo = [];
        var nameInfo = [];
        var cutArr = [];
        var num = 0;
        $.each($this,function(i,li){
            var  data ={};
            $.each(conf,function(j,key){
                data[key] = $(li).attr(key);
            });
            arr.push(data);
            var info = $.extend({}, data);
            info['bid'] = data['tagval'];
            info['fid'] =$(li).attr('sid');
            arrInfo.push(info);
            nameInfo.push($(li).find('.title').text());
        });

        if(arrInfo.length > 10){
            num = Math.ceil(arrInfo.length/10);
            for(var i =0; i< num;i++){
                cutArr.push(arrInfo.slice(i*10,(i+1)*10));
            }
            $.each(cutArr,function(j,key){
                mPush.playAllMusic(key,key);
            });
        }else{
            mPush.playAllMusic(arr,arrInfo);
        }
        var title = document.title;
        var sName = exports.findName();
       // _czc.push(["_trackEvent",'全部播放',sName,'全部播放']);
        $.each(nameInfo,function(j,name){
           // _czc.push(["_trackEvent",title,sName,name]);
        });

    };

    exports.pushSongLi = function($this){
        var $this = $($this),
            sid = $this.attr('sid');
        var conf = ['url', 'md5', 'type', 'tag', 'tagval','size'],
            data ={};
        $.each(conf,function(i,key){
            data[key] = $this.attr(key);
        });
        var info = $.extend({}, data);
        info['bid'] = data['tagval'];
        info['fid'] =$this.attr('sid');
        mPush.playMusic(data,info);
        var title = document.title;
        var name = $($this).find('.title').text();
        var sName = exports.findName();
        //_czc.push(["_trackEvent",title,sName,name]);
    };

    exports.findName = function(){
        var title = document.title;
        var sName ='';
        switch(title){
            case '电台':
                sName = $(document).find('.name-box').find('.name').text();break;
            case '专辑':
                sName = $(document).find('.info-box').find('.title').text();break;
            case '专题':
                sName = $(document).find('.infotitle').text();break;
            case '点播排行':
                sName = $(document).find('.menu-list').find('.cur').text();break;
            case '点播足迹':
                sName = '点播足迹';break;
            default:
                sName = '我的听听';break;

        }
        return sName;
    }

    exports.newPlayEvent = function(){
		isSubmiting = false;
        $('#J_newplay-box').on('click','.btn-cancel',function(){
            $('#J_newplay-box').hide();
            mApp.hideMask();
            $('#play_name').val('');
            $('#J_newplay-box .btn-ok').css("color",'#acacac');
        });
        $('#J_newplay-box').on('click','.btn-ok',function(){
            if( $('#play_name').val() == null ||  $('#play_name').val() ==''){
                return;
            }
			if(isSubmiting){
				return;
			}
			isSubmiting = true;
            var name= $('#play_name').val();
            var id= $('#play_id').val();
            if(id == ''){
                mRequest.getRequest({
                    url : BEME.APIURL+'/albums/addPlayList',
                    data : {name : name},
                    type : 'POST',
                    successfn : function(jdata){
						isSubmiting = false;
                        if(jdata.code===0){
                            $('#J_newplay-box').hide();
                            mApp.hideMask();
                            window.location.reload();
                        }else{
                            mApp.showTips('添加失败！');
                            $('#J_newplay-box').hide();
                            mApp.hideMask();
                            $('#play_name').val('');
                            $('#J_newplay-box .btn-ok').css("color",'#acacac');
                        }
                    }
                });
                return;
            }
            mRequest.getRequest({
                url : BEME.APIURL+'/albums/editPlayList',
                data : {name : name,id:id},
                type : 'POST',
                successfn : function(jdata){
					isSubmiting = false;
                    if(jdata.code===0){
                        $('#J_newplay-box').hide();
                        mApp.hideMask();
                        window.location.reload();
                    }else{
                        mApp.showTips('添加失败！');
                        $('#J_newplay-box').hide();
                        mApp.hideMask();
                        $('#play_name').val('');
                        $('#J_newplay-box .btn-ok').css("color",'#acacac');
                    }
                }
            });
        });


        $('#play_name').on('input propertychange',function(){
            if( $('#play_name').val() == null ||  $('#play_name').val() ==''){
                $('#J_newplay-box .btn-ok').css("color",'#acacac');
            }else{
                $('#J_newplay-box .btn-ok').css("color",'#0091ff');
            }
        });

    };
	
	

    exports.checkbox_all = function($this,isNew){
        var val = $this.find('.checkbox').attr('value');
		var is_select = false;
        if(+val == 0) {
            $($this.find('.checkbox')).find('img').attr('src','./static/images/xuanze.png');
            $this.find('.checkbox').attr('value','1');
            var play = $('.item').find('.checkbox');
            var is_all = 0;
            $.each(play,function(i,p){
                if($(p).attr('value') == 0){
                    is_all++;
                }
                if($(p).attr('value') == 1){
                    is_select = true;
                }
            });
            if(!is_all){
                if($('.delete-all .left').length){
                    $('.delete-all .left img').attr('src','./static/images/xuanze.png');
                    $('.delete-all .left').attr('value',1);
                    $('.select-all .left img').attr('src','./static/images/xuanze.png');
                    $('.select-all .left').attr('value',1);
                }
                else{
                    $('.select-all .left img').attr('src','./static/images/xuanze.png');
                    $('.select-all .left').attr('value',1);
                }
            } 
        }
        else{
            $($this.find('.checkbox')).find('img').attr('src','./static/images/xuanzekong.png');
            $this.find('.checkbox').attr('value','0');
            var play = $('.item').find('.checkbox');
            $.each(play,function(i,p){
                if($(p).attr('value') == 1){
                    is_select = true;
                }
            });
            if($('.delete-all .left').length){
                var all = $('.delete-all .left').attr('value');
                if(+all == 1){
                    $('.delete-all .left img').attr('src','./static/images/xuanzekong.png');
                    $('.delete-all .left').attr('value',0);
                    $('.select-all .left img').attr('src','./static/images/xuanzekong.png');
                    $('.select-all .left').attr('value',0);
                }
            }
            else{
                var all = $('.select-all .left').attr('value');
                if(+all == 1){
                    $('.select-all .left img').attr('src','./static/images/xuanzekong.png');
                    $('.select-all .left').attr('value',0);
                }
            }
        }
		
		 if(is_select){
                $('#add').removeClass('content_add');
				$('#add').removeClass('add_no');
                $('#add').addClass('content');
                $('#delete').removeClass('content_add');
                $('#delete').addClass('content');
				$('#push').removeClass('push_no');
		}else{
			$('#add').removeClass('content');
			$('#add').addClass('content_add');
			if(isNew){
				$('#add').addClass('add_no');
			}
			$('#delete').removeClass('content');
			$('#delete').addClass('content_add');
			$('#push').addClass('push_no');
		}
    };
	
	
	//add2.4.1
	exports.jumpLocalAlbum = function(obj){
		var $this = $(obj);
		var id = $this.attr('id');
		try{
			if(id > 0){
				window.bemetoy.jumpNativePageWithResourceType('album',id,'');
			}
		}
		catch(e){
			alert(e);
		}
	}
	
	exports.shareToWeixin = function(id,type,album_type,album_id,functionName){
		  mRequest.getRequest({
				url : BEME.APIURL+'/weixin/getWeixinJosn',
				data:{
					id:id,
					type:type,
					album_type:album_type,
					album_id:album_id,
					isNew:mApp.changePlayList,
					functionName:functionName
				},
				successfn : function(jdata){
					if(jdata.code == 0){
						 window.bemetoy.socialShareWithContent(jdata.data);
					}
				}
			});
	};


});

