/*! 09-05-2016 */
define("minpage/growlist",["comm/utils","comm/url","comm/request","helper/app","require","exports"],function(a,b,c,d,e,f){"use strict";var g=function(b){var c="";c=a.template("J_temp-growitem",{list:b.list}),$("#J_grow_list").html(c),d.showImage(),d.backScroll();var e=d.getUA(0),f=d.getUA(1);e>1&&f>2&&d.setTitle("育儿小妙招")},h=function(){c.getRequest({url:BEME.APIURL+"/grow/growList",successfn:function(a){d.loaded(),0===a.code&&g(a.data)}})},i=function(){};f.init=function(){d.setTitle("成长场景");b.getParams();h(),i()},f.uninit=function(){}});