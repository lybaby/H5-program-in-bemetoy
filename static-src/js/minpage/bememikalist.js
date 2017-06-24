/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('minpage/bememikalist', ['comm/utils', 'comm/url', 'comm/request' ,'helper/app', 'require', 'exports'],
    function(mUtils, mUrl, mRequest,mApp,require, exports){
        "use strict";

        var _renderInfo = function(jdata,weixin){
			 mApp.setTitle(jdata.name);
            var $box = $('.mika-info-page');
			 $.each(jdata.list,function(i,ip){
                ip['content'] = '第' + ip.sequence + '期：'+ip.sub_name;
                ip['question'] =  exports.changeDate(ip.update_time);
                if(weixin == 1){
                    ip['id'] = ip['id'] + '&weixin=1';
                }
            });
            var html = mUtils.template('J_temp-item-class', {list:jdata.list});
            $('#mika-classlist').html(html);
            var ver1 = mApp.getUA(0);
            if(ver1 < 2){
                $('.main-header').show();
                $('.main-header .back-btn').show();
                $('#J_wrapper').css('padding','1.1rem 0 0 0');
                $('.sub').hide();
            }
			var list =$('#mika-classlist').find('.mika_list_banner');
			$.each(list,function(i,li){
				var url = $(li).attr('img_url');
				$(li).css('background-image',"url("+url+")" );
			});
			mApp.backScroll();
        };
					
        var _queryInfo = function(id,weixin){
			mRequest.getRequest({
                url : BEME.APIURL+'/ip/mikaList?id='+id,
                successfn : function(jdata){
                    mApp.loaded();

                    if(jdata.code===0){
                        _renderInfo(jdata.data,weixin);
                    }
					else{
						//alert(1);
					}
                }
            });		
			
        };
		
		exports.changeDate = function(date){
            var dat = new Date(date);
            var res = (dat.getMonth() + 1) + "月" + dat.getDate() + "日 ";
            return res;
        };
		
        var  _initEvent = function(id,weixin) {
							
        };

        exports.init = function(){
            mApp.setTitle("小囧熊英文乐园");
			var hashs = mUrl.getParams();
            _queryInfo(hashs.id,hashs.weixin);
			mApp.hideAllBox();
            _initEvent(hashs.id,hashs.weixin);

        };


        exports.uninit = function(){
        };
    });