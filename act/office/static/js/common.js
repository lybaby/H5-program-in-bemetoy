/**
 * Created by jing on 2016/10/21.
 */


function isEmail(str) {
    return /^\s*\w+([-+.]\w+)*@\w+([-.]\w+)*(\.\w+([-.]\w+)*){1,2}\s*$/i.test(str);
};

function isTel(str) {
    var reg = /^([\d\uFF10-\uFF19]{2,5}[-\uFF0D])?([\d\uFF10-\uFF19]{3,5}[-\uFF0D])?[1-9\uFF11-\uFF19]{1}[\d\uFF10-\uFF19]{5,7}([-\uFF0D][1-9\uFF11-\uFF19]{1}[\d\uFF10-\uFF19]{1,3})?$/;
    var reg2 = /^[\d\uFF10-\uFF19]{7,8}$/;
    return reg.test(str) || reg2.test(str);
};


function isEmpty(str){
	 return /^[\s　]*$/.test(str);
};


function setCookie(name,value){
	var Days = 1;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days*24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name){
	var arrstr = document.cookie.split("; ");
	for(var i = 0;i < arrstr.length;i ++)
	{
		var temp = arrstr[i].split("=");
		if(temp[0] == name)
			return unescape(temp[1]);
	}
};