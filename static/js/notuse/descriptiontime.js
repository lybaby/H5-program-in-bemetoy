/*! 09-05-2016 */
define("page/descriptiontime",["comm/utils","comm/url","comm/request","helper/app","helper/temphtml","require","exports"],function(a,b,c,d,e,f,g){"use strict";var h=!1,i=function(a){if(d.setTitle(a.name),a.subscription){h=!0,$("#init_time").text(hours+":00");$(".time-box").find("a");if(+a.user_push>=7&&+a.user_push<=22){var b=$(".time-box").find("a")[+a.user_push-7];$(b).css("background","#e6f4c6"),$(b).css("border","1px solid #ceed88"),$(b).append('<img src="./static/images/duihao.png">')}else $(".init-time").find("a").css("border","1px solid #ceed88"),$(".init-time").find("span").append('<img src="./static/images/duihao.png">')}else $("#init_time").text(a.push_time_hours+":00"),$(".init-time").find("a").css("border","1px solid #ceed88"),$(".init-time").find("span").append('<img src="./static/images/duihao.png">')},j=function(a){c.getRequest({url:BEME.APIURL+"/station/getStationPushTime?id="+a,successfn:function(a){d.loaded(),0===a.code&&i(a.data)}})},k=function(a){$(".description .time-box").on("click","a",function(){var a=$(this),b=a.parent().parent().parent().find("img");b.length>0&&($(b[0]).parent().css("background","#f9eaeb"),$(b[0]).parent().css("border","1px solid #fad1d4"),$(b[0]).remove());var c=a.parent().parent().parent().parent().find("img");c.length>0&&($(c[0]).parent().parent().css("border","1px solid #fad1d4"),$(c[0]).remove()),a.css("background","#e6f4c6"),a.css("border","1px solid #ceed88"),a.append('<img src="./static/images/duihao.png">')}),$(".description .init-time").on("click","a",function(){var a=$(this),b=a.parent().find("img");if(!(b.length>0)){var c=a.parent().parent().find("img");c.length>0&&($(c[0]).parent().css("background","#f9eaeb"),$(c[0]).parent().css("border","1px solid #fad1d4"),$(c[0]).remove()),a.css("border","1px solid #ceed88"),a.children().append('<img src="./static/images/duihao.png">')}}),$("#save_station").on("click",function(){var b="";$(".description").find("img").parent().length&&(b=$(".description").find("img").parent().text().split(":")[0]);try{window.bemetoy.subscribeRadio(a,1,b)}catch(c){alert(c)}})};g.init=function(){$(".back-btn").show(),a.headerMenu(),$("#save_station").show();var c=b.getParams();d.showHeader(),j(c.id),h=!1,k(c.id)},g.uninit=function(){$(".description .time-box, .description .init-time,#save_station").off("click")}});