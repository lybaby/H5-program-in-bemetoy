/*! 10-05-2016 */
!function(){"use strict";var a=window.BEME||{};a.APP_STATUS=a.APP_STATUS||"online",a.APIURL="http://dev.h5.bemetoy.com/app/m2",a.data={},a.userInfo={},a.urlList=new Array,a.scrollList=new Array,a._lastScroll=0,a._currentScroll=0,window.BEME=a;var b=location.pathname,c=b.lastIndexOf("/");b=b.substr(0,c).replace("/pages","");var d={baseUrl:b+"/static/js/",paths:{jplayer:"jplayer",jweixin:"http://res.wx.qq.com/open/js/jweixin-1.0.0"},localcheck:{mustUnique:!0,unique:gJSFileHashConfig},waitSeconds:6};"online"!=window.BEME.APP_STATUS&&(d.baseUrl=b+"/static-src/js/",d.urlArgs="_t="+(new Date).getTime()),require.config(d);var e=document.documentElement;e.style.fontSize=e.clientWidth/7.5+"px"}(),window.Zepto&&define("zepto",[],function(){return window.Zepto}),window.console=window.console||{log:function(){}},window.BEME.initPage=function(a){"use strict";BEME.PAGENAME=a,require(["page/"+a],function(a){a.init();var b=document.documentElement;b.style.fontSize=b.clientWidth/7.5+"px",window.BEME.curPageInstance=a})},window.BEME.initMinPage=function(a){"use strict";BEME.PAGENAME=a,require(["minpage/"+a],function(a){a.init();var b=document.documentElement;b.style.fontSize=b.clientWidth/7.5+"px",window.BEME.curPageInstance=a})},function(){var a={};a.keys=function(a){var b=[];for(var c in a)a.hasOwnProperty(c)&&b.push(c);return b},a.invert=function(b){for(var c={},d=a.keys(b),e=0,f=d.length;f>e;e++)c[b[d[e]]]=d[e];return c},a.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var b=/(.)^/,c={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},d=/\\|'|\r|\n|\u2028|\u2029/g,e=function(a){return"\\"+c[a]},f={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},g=a.invert(f),h=function(b){var c=function(a){return b[a]},d="(?:"+a.keys(b).join("|")+")",e=RegExp(d),f=RegExp(d,"g");return function(a){return a=null==a?"":""+a,e.test(a)?a.replace(f,c):a}};a.escape=h(f),a.unescape=h(g),a.template=function(c,f,g){g=$.extend({},g,a.templateSettings);var h=RegExp([(g.escape||b).source,(g.interpolate||b).source,(g.evaluate||b).source].join("|")+"|$","g"),i=0,j="__p+='";c.replace(h,function(a,b,f,g,h){return j+=c.slice(i,h).replace(d,e),i=h+a.length,b?j+="'+\n((__t=("+b+"))==null?'':_v.escape(__t))+\n'":f?j+="'+\n((__t=("+f+"))==null?'':__t)+\n'":g&&(j+="';\n"+g+"\n__p+='"),a}),j+="';\n",g.variable||(j="with(obj||{}){\n"+j+"}\n"),j="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+j+"return __p;\n";var k="";try{k=Function(g.variable||"obj","_v",j)}catch(l){throw l.source=j,l}if(f)return k(f,a);var m=function(b){return k.call(this,b,a)},n=g.variable||"obj";return m.source="function("+n+"){\n"+j+"}",m},BEME.template=a.template}(),function(a){function b(a,b,c,d){return Math.abs(a-b)>=Math.abs(c-d)?a-b>0?"Left":"Right":c-d>0?"Up":"Down"}function c(){k=null,m.last&&(m.el.trigger("longTap"),m={})}function d(){k&&clearTimeout(k),k=null}function e(){h&&clearTimeout(h),i&&clearTimeout(i),j&&clearTimeout(j),k&&clearTimeout(k),h=i=j=k=null,m={}}function f(a){return("touch"==a.pointerType||a.pointerType==a.MSPOINTER_TYPE_TOUCH)&&a.isPrimary}function g(a,b){return a.type=="pointer"+b||a.type.toLowerCase()=="mspointer"+b}var h,i,j,k,l,m={},n=750,o=!1;a(document).ready(function(){var p,q,r,s,t=0,u=0;"MSGesture"in window&&(l=new MSGesture,l.target=document.body),a(document).bind("MSGestureEnd",function(a){var b=a.velocityX>1?"Right":a.velocityX<-1?"Left":a.velocityY>1?"Down":a.velocityY<-1?"Up":null;b&&(m.el.trigger("swipe"),m.el.trigger("swipe"+b))}).on("touchstart MSPointerDown pointerdown",function(b){(!(s=g(b,"down"))||f(b))&&(r=s?b:b.touches[0],b.touches&&1===b.touches.length&&m.x2&&(m.x2=void 0,m.y2=void 0),p=Date.now(),q=p-(m.last||p),m.el=a("tagName"in r.target?r.target:r.target.parentNode),h&&clearTimeout(h),m.x1=r.pageX,m.y1=r.pageY,q>0&&250>=q&&(m.isDoubleTap=!0),m.last=p,k=setTimeout(c,n),l&&s&&l.addPointer(b.pointerId))}).on("touchmove MSPointerMove pointermove",function(a){(!(s=g(a,"move"))||f(a))&&(r=s?a:a.touches[0],d(),m.x2=r.pageX,m.y2=r.pageY,t+=Math.abs(m.x1-m.x2),u+=Math.abs(m.y1-m.y2))}).on("touchend MSPointerUp pointerup",function(c){if(!(s=g(c,"up"))||f(c)){if(d(),m.x2&&Math.abs(m.x1-m.x2)>30||m.y2&&Math.abs(m.y1-m.y2)>30){j=setTimeout(function(){m.el.trigger("swipe");var a=b(m.x1,m.x2,m.y1,m.y2);m.el.trigger("swipe"+a),m={}},0);var k=b(m.x1,m.x2,m.y1,m.y2);o&&o.call(this,c,k)}else"last"in m&&(30>t&&30>u?i=setTimeout(function(){var b=a.Event("tap");b.cancelTouch=e,m.el.trigger(b),m.isDoubleTap?(m.el&&m.el.trigger("doubleTap"),m={}):h=setTimeout(function(){h=null,m.el&&m.el.trigger("singleTap"),m={}},250)},0):m={});t=u=0}}).on("touchcancel MSPointerCancel pointercancel",e),a(window).on("scroll",e)}),["swipe","swipeLeft","swipeRight","swipeUp","swipeDown","doubleTap","tap","singleTap","longTap"].forEach(function(b){a.fn[b]=function(a){return this.on(b,a)},a.fn.swipeAsyn=function(a){o=a}})}(Zepto);