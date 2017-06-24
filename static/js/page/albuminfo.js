/*! 09-05-2016 */
define("page/albuminfo",["comm/utils","comm/url","comm/request","comm/pushsong","comm/clickevent","helper/app","helper/playerbar","page/myalbum","require","exports"],function(a,b,c,d,e,f,g,h,i,j){"use strict";var k={},l=function(b){var c=$("#J_album-box"),d=f.getUA(1);d>0&&$("#J_album-box .share").show().css("display","inline-block"),c.find(".img-cover").attr("imgsrc",a.imageUrl(b.album.url)),c.find(".title").text(b.album.name),c.find(".desc").text(b.album.description),$("#J_songnum").text(b.songs.length),$("#num").text(b.album.cnt),$("#collection_num").text(b.album.collection_num);var e="";$.each(b.tags,function(b,c){var d=a.getRandColor();e+='<li style="color:'+d+";border-color:"+d+'">'+c.name+"</li>"}),c.find(".tags").html(e),$.each(b.songs,function(a,c){c.tagval=b.album.id}),e=a.template("J_temp-item",{list:b.songs}),$("#J_song-box").html(e),$.each(b.songs,function(a,b){b._type="album",b.tag="album",k[b.id]=b}),f.showImage(),f.backScroll()},m=function(b,d){c.getRequest({url:BEME.APIURL+"/albums/collectionAlbum",data:{album_id:b,type:"album",uid:a.getUid(),action:d},xhrFields:{withCredentials:!0},type:"POST",successfn:function(a){if(0===a.code){var b=$("#J_album-box .favorites");"add"===d?(b.addClass("favoritesed"),$("#J_album-box #content").text("已收藏"),f.showTips("收藏成功！")):(b.removeClass("favoritesed"),$("#J_album-box #content").text("收藏"),f.showTips("已取消收藏！")),$("#collection_num").text(a.data.count)}}})},n=function(b){c.getRequest({url:BEME.APIURL+"/albums/albumList?id="+b,successfn:function(a){f.loaded(),0===a.code&&l(a.data)}}),c.getRequest({url:BEME.APIURL+"/albums/iscollection",data:{album_id:b,type:"album",uid:a.getUid()},type:"POST",successfn:function(a){0===a.code&&1===a.data&&($("#J_album-box .favorites").addClass("favoritesed"),$("#J_album-box #content").text("已收藏"))}})},o=function(a){$("#J_album-desc").on("click",function(){var a=$(this);a.attr("block")?(a.css("display","-webkit-box"),a.attr("block",null)):(a.css("display","block"),a.attr("block",1))}),$("#J_album-box .favorites").on("click",function(){var b=$(this),c={};c.content="确定不再收藏该专辑？",b.hasClass("favoritesed")?f.showAlert(c,function(){m(a,"del")}):m(a,"add")}),$("#J_song-box").on("click",".item .item-a",function(){e.pushSong(this)}),$("#J_song-box").on("click",".item-play",function(){e.audition(k,this)}),$(".caction-box").on("click",".play-btn",function(){e.pushAllSong(this)}),$("#play_edit").on("click",function(){e.playEdit("caction-box",this)}),$("#J_song-box").on("click",".checkbox",function(){}),$("#J_album-box .share").on("click",function(){e.shareToWeixin(a,"album",a)}),e.initSelectAllEvent("caction-box")};j.init=function(){f.setTitle("专辑"),$(".back-btn").show(),a.headerMenu(),$("#myplay").show();var c=b.getParams();f.showHeader(),n(c.id),o(c.id)},j.uninit=function(){$("#J_album-desc,.select-all, #J_song-box, #J_album-box .favorites").off("click")}});