/*global $*/
$(document).ready(function(){

$.fn.getFormValues = function(){
    var $sele = this,
        form = {};
    $sele.find('[name]').each(function(i, obj){
        var $this = $(obj);
        form[$this.attr('name')] = $this.val();
    });
    return form;
};

$.fn.setFormValues = function(data){
    var $sele = this;
    if(!data){
        return $sele.find('[name]').each(function(i, obj){
            $(obj).val('');
        });
    }

    $.each(data, function(k, v){
        $sele.find('[name="'+k+'"]').val(v);
    });
    return $sele;
};

var sessionid = 'xygdlEsIzS24ueSbaeR2LEKk56QNDMN8';
document.cookie="session_id="+sessionid+";domain=.bemetoy.com;path=/";

var _initAlert = function(){
    var $alertBox = $('#J_alert-box'),
        config = _initAlert.setting;
    if(!_initAlert.isInit){
        _initAlert.isInit = true;

        var context = {
            close : function(){
                $('#J_body-mask, #J_alert-box').hide();
            }
        };
        $alertBox.find('.btn-cancel').on('click', function(e){
            config = _initAlert.setting;
            if(config.cancel){
                config.cancel.call(context, e);
            }else{
                context.close();
            }
        });
        $alertBox.find('.btn-ok').on('click', function(e){
            config = _initAlert.setting;
            if(config.ok){
                config.ok.call(context, e);
                context.close();
            }else{
                context.close();
            }
        });
    }
    if(config.hideCancel){
        $alertBox.find('.btn-cancel').hide();
        $alertBox.find('a').css('width','100%');
    }else{
        $alertBox.find('.btn-cancel').show();
        $alertBox.find('a').css('width','50%');
    }

    $alertBox.find('.title').html(config.title);
    $alertBox.find('.content').html(config.content);
    $alertBox.find('.btn-ok').html(config.okWording);
    $alertBox.find('.btn-cancel').html(config.cancelWording);
    $('#J_body-mask, #J_alert-box').show();
};

var showAlert = function(setting, okFn){
    var _defaut = {
        title : '提示',
        content : '描述',
        hideCancel : false,
        ok : okFn,
        cancel : false,
        okWording : '确定',
        cancelWording : '取消'
    };
    if(typeof setting==='string'){
        setting = {
            hideCancel : true,
            content : setting,
            okWording : '确定',
            ok : false
        };
    }
    _initAlert.setting = $.extend(_defaut, setting);
    _initAlert();
};

var showTips = function(text, seconds){
    seconds = seconds || 2000;
    var $tips = $('#J_body-tips');
    $tips.text(text).removeClass('tips-in tips-out').css('zoom');
    $tips.addClass('tips-in');
    setTimeout(function(){
        $tips.removeClass('tips-in tips-out').css('zoom');
        $tips.addClass('tips-out');
    }, seconds);
};

var topConfig = {
    "xiaoxiong" : '贝美小熊',
    "feixia" : '飞侠',
    "weini" : '维尼',
    "mengmeng" : '萌萌',
    "xiangxiang" : '响响'
};

var api = 'http://dev.h5.bemetoy.com/app/dealers/dealers',
    _g_userData = false;
var query = function(path, options){
    options = options || {};
    var _default = {
        url : api+path,
        type : 'POST',
        xhrFields : {"withCredentials":true},
        dataType : 'json'
    };
    options = $.extend(_default, options);
    return $.ajax(options);
};

var _getUserInfo = function(callback){
    query('/userInfo', {
        success : function(data){
            _g_userData = data.data;
            if(_g_userData){
                var header = _g_userData.url || './static/images/header.png';
                $('#J_user-info .img').attr('src', header);
                $('#J_user-info .username').text(_g_userData.name);
                $('#J_user-info .address').text(_g_userData.address);
            }
            callback && callback(_g_userData);
        }
    });
};

var saleList = {};
var showPage = function(id, refresh){
    if(id=='J_page_list' && refresh){
        query('/toySalesList', {
            success : function(data){
                if(!data.data || data.data.length<1){
                    $('.page').hide();
                    return $('#'+id).show();
                }
                $('#J_page_list .item-list').html('');
                var temp = $('#J_temp-sale').html(),
                    xtemp = '';

                $.each(data.data, function(i, info){
                    saleList[info.id] = info;
                    xtemp = $(temp);
                    xtemp.find('.name').text(topConfig[info.toytype]);
                    xtemp.find('.num').text(info.toynum);
                    xtemp.find('.date').text(info.uptime);

                    xtemp.data('infoid', info.id);
                    $('#J_page_list .item-list').append(xtemp);
                });

                $('.page').hide();
                $('#'+id).show();
            }
        });
    }else{
        $('.page').hide();
        $('#'+id).show();
    }
};

var isNumeric = function(n){
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var addFile = function(files){
    $('#J_pic-box .xpic').remove();
    var temp = $('#J_temp-file').html(),
        xhtml = '';
    $.each(files, function(i, img){
        xhtml += temp.replace('{src}', img);
    });
    $('#J_pic-box').prepend(xhtml);
};

var initEvent = function(){
    $('#J_btn-join').on('click', function(){
        showPage('J_page_apply');
    });

    $('#J_user-info').on('click', function(){
        showPage('J_page_apply');
        $('#J_form-apply').setFormValues(_g_userData);
        $('#J_form-apply .btn').val('点击修改');
    });

    $('#J_pic-box').on('click', '.x', function(){
        $(this).parent().remove();
        return false;
    });

    $('#J_addsale-btn').on('click', function(){
        showPage('J_page_sale');
        $('#J_form-sale').setFormValues({
            id : 0,
            toytype : 'xiaoxiong',
            toynum : 1
        });
        $('#J_form-sale [action="delete"]').hide();
        addFile([]);
        return false;
    });

    $('#J_page_list .item-list').on('click', '.item', function(){
        var $this = $(this),
            id = $this.data('infoid');
        $('#J_form-sale').setFormValues(saleList[id]);
        if(saleList[id].invoice){
            addFile(saleList[id].invoice.split(';'));
        }
        $('#J_form-sale [action="delete"]').show();
        showPage('J_page_sale');
    });

    $('#J_file-input').uploadPicture({
        name : 'userfile',
        url : api+'/fileUpload',
        success : function(jdata){
            addFile([jdata.data.url]);
        }
    });

    $('#J_form-apply').on('submit', function(){
        var $form = $(this),
            formData = $form.getFormValues();

        if(!formData.name){
            showAlert('请输入名称');
            return false;
        }
        if(!formData.telphone){
            showAlert('请输入联系方式');
            return false;
        }
        if(!formData.address){
            showAlert('请输入所在地址');
            return false;
        }

        query('/editDealers', {
            data : formData,
            success : function(data){
                if(data.data===true){
                    _getUserInfo(function(){
                        showPage('J_page_list');
                    });
                }else{
                    $.showAlert(data.msg);
                }
            }
        });
        return false;
    });

    $('#J_form-sale').on('submit', function(){
        var $form = $(this),
            formData = $form.getFormValues();
        if(!isNumeric(formData.toynum) || +formData.toynum<1){
            showAlert('请输入正确的玩偶个数');
            return false;
        }

        var $pics = $('#J_pic-box img'),
            pics = [];
        $pics.each(function(i, obj){
            var img = $(obj).attr('src');
            if(img.substr(0,4)=='http'){
                pics.push(img);
            }
        });

        if(pics.length<1){
            showAlert('请上传发票图片');
            return false;
        }

        query('/saveToySales', {
            data : {
                id : formData.id,
                toytype : formData.toytype,
                toynum : formData.toynum,
                invoice : pics.join(';'), //发票
                description : '备注'
            },
            success : function(data){
                if(!data.data){
                    return showAlert(data.msg);
                }

                showPage('J_page_list', true);
            }
        });
        return false;
    });

    $('#J_form-sale .btn[action]').on('click', function(){
        var $this = $(this),
            action = $this.attr('action');
        if(action=='cancel'){
            return showPage('J_page_list');
        }else if(action=='delete'){
            showAlert({
                content : '你确定要删除该记录吗',
                ok : function(){
                    query('/deleteToySales', {
                        data : {id:$('#J_form-sale input[name="id"]').val()},
                        success : function(data){
                            if(!data.data){
                                return showAlert(data.msg);
                            }
                            showPage('J_page_list', true);
                        }
                    });
                },
                cancel : function(){
                    this.close();
                    return showPage('J_page_list');
                }
            });
        }
    });

    _getUserInfo(function(userinfo){
        if(!userinfo){
            return showPage('J_page_no');
        }
        showPage('J_page_list', true);
    });
};


initEvent();


/**/

/**/



/*/
query('/saveToySales', {
    id : 4,
    toytype : '测试shan',
    toynum : 2,
    invoice : '122222', //发票
    description : '备注'
}).success(function(data){
    console.log(data);
});*/



});

