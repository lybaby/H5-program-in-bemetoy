/*! 09-05-2016 */
define("minpage/bemeipinfo",["comm/utils","comm/url","comm/clickevent","helper/playerbar","page/bemeipindex","comm/request","helper/app","helper/temphtml","require","exports"],function(a,b,c,d,e,f,g,h,i,j){"use strict";var k={},l={title:"贝美童趣馆",desc:"超级飞侠故事屋",link:location.href,imgUrl:"专辑图片放进来"},m=function(b,c){var f=g.getUA(0),h=$(".ipinfo-page");g.setTitle(b.name);var j=a.template("J_temp-item-song",{list:b.song});$(".play-music").html(j),1==f&&($(".main-header").show(),$(".main-header .back-btn").show(),$("#J_wrapper").css("padding","1.1rem 0 0 0"),$(".sub").hide(),$(".share_weixin").hide());var m=g.getUA(1);f>1&&m>0&&$(".share_weixin").show(),1==c&&($(".sub").hide(),$(".share_weixin").hide(),$(".push-song").hide()),h.find(".img-cover").attr("src",b.url),h.find(".sub-title").text(b.sub_name),h.find(".description_ip").text(b.description),h.find(".place").text(b.place),h.find(".hello").text(b.place_hello),h.find(".question").text(b.question),h.find(".answer_content").text(b.answer),h.find(".play-video").html(b.video_url),l.imgUrl=b.url,h.find(".play-video").find("video").attr("poster",b.url),1==c&&($(".share_weixin").hide(),$(".push-song").hide()),$(".sub-day").text(e.changeDate(b.update_time)+"更新");var j=a.template("J_temp-personitem",{list:b.planes});$("#J_plane-box").html(j),$.each(b.song,function(a,b){k[b.id]=b});var n=h.find(" .music-list");if(d.initIpPlay(n,b.song[0]),1==c)var c=i(["minpage/weixin"],function(a){a.getWeixinConfig(l)});g.backScroll()},n=function(b,c){$.each(b,function(a,b){b.content="第"+b.sequence+"集("+b.update_time.replace(/\-/g,"")+")："+b.sub_name,1==c&&(b.id=b.id+"&weixin=1")});var d=a.template("J_temp-item",{list:b});$("#J_list-box_children").html(d)},o=function(a,b,c){f.getRequest({url:BEME.APIURL+"/ip/ipInfo?id="+a,successfn:function(a){g.loaded(),0===a.code&&m(a.data,c)}}),f.getRequest({url:BEME.APIURL+"/ip/ipList?type="+b,successfn:function(a){g.loaded(),0===a.code&&n(a.data.list,c)}}),1==c?$(".back-index").attr("href","?m=bemeipindex&weixin=1&type="+b):$(".back-index").attr("href","?m=bemeipindex&type="+b)},p=function(a){f.getRequest({url:BEME.APIURL+"/ip/personInfo?id="+a,successfn:function(a){g.loaded(),0===a.code&&e.showDescriptInfo(a.data)}})},q=function(a){$("#play-music").on("click",".music-list .push-song",function(){c.pushSong($(this).parent())}),$("#J_plane-box").on("click",".item-a",function(){var a=$(this).attr("person_id");p(a)}),$("#J_list-box_children").on("click",".item",function(){var a=$(this).find("a").attr("href_url");try{window.location.href=a}catch(b){alert(b)}}),$(".share_weixin").on("click",function(){c.shareToWeixin(a,"ip","ipinfo",1)})};j.init=function(){g.setTitle("贝美童趣馆");var a=b.getParams();o(a.id,a.type,a.weixin),g.hideAllBox(),q(a.id)},j.uninit=function(){$("#play-music").off("click")}});