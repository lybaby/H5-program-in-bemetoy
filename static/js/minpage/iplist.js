/*! 09-05-2016 */
define("minpage/iplist",["comm/utils","comm/url","comm/request","helper/app","require","exports"],function(a,b,c,d,e,f){"use strict";var g=function(b){$.each(b,function(a,b){b.question=d.changeDate(1e3*b.update_time)});var c=a.template("J_temp-item-class",{list:b});$("#ip-classlist").html(c);var e=d.getUA(0),f=d.getUA(1);e>1&&f>2&&d.setTitle("早教动画")},h=function(){c.getLocalRequest({url:BEME.APIURL+"/ip/ipMain",successfn:function(a){d.loaded(),0===a.code&&g(a.data)}})},i=function(){};f.init=function(){d.setTitle("贝美童趣馆列表");b.getParams();h(),i()},f.uninit=function(){}});