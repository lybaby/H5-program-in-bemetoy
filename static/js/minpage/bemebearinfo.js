/*! 09-05-2016 */
define("minpage/bemebearinfo",["comm/utils","comm/url","helper/playerbar","comm/request","minpage/bemeipindex","comm/clickevent","helper/app","helper/temphtml","helper/jrange","require","exports"],function(a,b,c,d,e,f,g,h,i,j,k){"use strict";var l={},m={title:"贝美童趣馆",desc:"小囧熊英文乐园",link:location.href,imgUrl:"专辑图片放进来"},n=function(b,d){var f=$(".bear-info-page"),h=a.template("J_temp-item-song",{list:b.song});$("#play-music").html(h);var i=g.getUA(0);1==i&&($(".main-header").show(),$(".main-header .back-btn").show(),$("#J_wrapper").css("padding","1.1rem 0 0 0"),$(".sub").hide()),1==d&&($(".share_weixin").hide(),$(".push-song").hide());var k=g.getUA(1);i>1&&k>0&&$(".share_weixin").show(),f.find(".play-video").html(b.video_url),f.find(".task-text").html(b.place_hello),f.find(".single-word").html(b.description),f.find(".sentence-word").html(b.answer),f.find(".play-video").find("video").attr("poster",b.url);var l="";l="第"+b.sequence+"期："+b.sub_name;var n=e.changeDate(b.update_time)+"更新";$("#new-title").text(l),$("#new-day").text(n),m.desc="《小囧熊英文乐园》"+b.name,m.imgUrl=b.url;var o=f.find(" .music-list");if(1==d?(c.initIpIndexPlay(o,b.song[0],2),$(".push-bear-song").hide()):c.initIpIndexPlay(o,b.song[0],4),1==d)var d=j(["minpage/weixin"],function(a){a.getWeixinConfig(m)});g.backScroll()},o=function(b,c,d,e){if(e){$(".more-all").show(),$(".more-all").removeClass("showed"),$(".more-all").text("点击收起"),$.each(b.list,function(a,b){c==b.id&&(b.isCurrent=1),1==d&&(b.id=b.id+"&weixin=1")});var f=a.template("J_temp-item",{list:b.list.reverse()});$(".bear-table").html(f)}else{b.count>24?($(".more-all").show(),$(".more-all").addClass("showed"),$(".more-all").text("查看全部"),b.list=b.list.slice(0,24)):$(".more-all").hide(),$.each(b.list,function(a,b){c==b.id&&(b.isCurrent=1),1==d&&(b.id=b.id+"&weixin=1")});var f=a.template("J_temp-item",{list:b.list.reverse()});$(".bear-table").html(f)}},p=function(b,c){if(b){if(1==c){var d=a.template("J_temp-item-weixin",{list:b});$("#song-list-box").html(d)}else{var d=a.template("J_temp-item-somg",{list:b});$("#song-list-box").html(d)}$.each(b,function(a,b){b._type="album",l[b.id]=b})}},q=function(a,b,c){d.getRequest({url:BEME.APIURL+"/ip/ipInfo?id="+a,successfn:function(a){g.loaded(),0===a.code&&n(a.data,c)}}),d.getRequest({url:BEME.APIURL+"/ip/ipList",data:{type:b},successfn:function(b){g.loaded(),0===b.code&&o(b.data,a,c,!1)}}),d.getRequest({url:BEME.APIURL+"/ip/ipSongList",data:{type:b},successfn:function(a){g.loaded(),0===a.code&&p(a.data,c)}}),1==c?$(".back-index").attr("href","?m=bemebearindex&weixin=1&type="+b):$(".back-index").attr("href","?m=bemebearindex&type="+b)},r=function(a,b){var c=2;d.getRequest({url:BEME.APIURL+"/ip/ipList",data:{type:c},successfn:function(c){g.loaded(),0===c.code&&o(c.data,a,weixin,b)}})},s=function(a,b){$("#play-music").on("click",".music-list .push-bear-song",function(){f.pushSong($(this))}),window.onscroll=function(){$(".title-box").offset().top,$("#bear-song-list").offset().top,$(window).scrollTop()},$(".title-box").on("click",function(){var a=$(this).attr("value"),b="?m=bemeipinfo&id="+a+"&type=1";window.location.href=b}),$("#song-list-box").on("click",".item-play",function(){f.audition(l,this)}),1==b&&$("#song-list-box").on("click",".item",function(){var a=$(this),b=a.attr("sid");c.initWeixinPlayer(a,l[+b])}),$(".more-all").on("click",function(){var b=$(this).hasClass("showed");b?r(a,!0):r(a,!1)}),$(".share_weixin").on("click",function(){f.shareToWeixin(a,"ip","ipinfo",2)}),$(".bear-table").on("click","td",function(){var a=$(this).attr("href");window.location.href=a})};k.init=function(){g.setTitle("小囧熊英文乐园");var a=b.getParams();q(a.id,a.type,a.weixin),g.hideAllBox(),s(a.id,a.weixin)},k.uninit=function(){$("#play-music").off("click"),window.onscroll=null}});