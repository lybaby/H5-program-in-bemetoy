/* global define*/
define('helper/temphtml', ['require', 'exports'], function(require, exports){
    "use strict";

    //页面遮罩
    exports.bodyMaskHtml = '<div class="body-mask" id="J_body-mask"></div>';

    exports.playOptionHtml = [
        '<li class="item-option-box" id="J_jplayer-box">',
        '<div class="player-slider">',
        '<div class="played-time">00:00</div>',
        '<div class="total-time">00:00</div>',
        '<input class="slider" type="hidden" value="0"/>',
        '</div>',
        '<div class="player"></div>',
        '<div class="option-bar">',
        '<a class="item-a op-push op-btn" action="push" href="javascript:void(0);">推送给玩具</a>',
        '<a class="item-a op-play op-btn" action="play" href="javascript:void(0);">手机试听</a>',
        '<a class="item-a op-up op-btn" action="up" href="javascript:void(0);">点赞</a>',
        '<a class="item-a op-add op-btn" action="add" href="javascript:void(0);">加入歌单</a>',
        '<a class="item-a op-del op-btn" action="del" href="javascript:void(0);">删除</a>',
        '<a class="item-a op-share op-btn" action="share" href="javascript:void(0);">分享</a>',
        '</div>',
        '</li>'
    ].join('');

    exports.playOptionHtmlOther = [
        '<li class="item-option-box" id="J_jplayer-box_1">',
        '<div class="player-slider">',
        '<div class="played-time">00:00</div>',
        '<div class="total-time">00:00</div>',
        '<input class="slider" type="hidden" value="0"/>',
        '</div>',
        '<div class="player"></div>',
        '<div class="option-bar">',
        '<a class="item-a op-push op-btn" action="push" href="javascript:void(0);">推送给玩具</a>',
        '<a class="item-a op-play op-btn" action="play" href="javascript:void(0);">手机试听</a>',
        '<a class="item-a op-up op-btn" action="up" href="javascript:void(0);">点赞</a>',
        '<a class="item-a op-add op-btn" action="add" href="javascript:void(0);">加入歌单</a>',
        '<a class="item-a op-del op-btn" action="del" href="javascript:void(0);">删除</a>',
        '<a class="item-a op-share op-btn" action="share" href="javascript:void(0);">分享</a>',
        '</div>',
        '</li>'
    ].join('');

    exports.playWeixinHtml = [
        '<li class="item-option-box" id="J_jplayer-weixin">',
        '<div class="player-slider">',
        '<div class="played-time">00:00</div>',
        '<div class="total-time">00:00</div>',
        '<input class="slider" type="hidden" value="0"/>',
        '</div>',
        '<div class="player"></div>',
        '</li>'
    ].join('');
	
	exports.playBearHtml = [
        '<li class="item-bear-info" id="J_jplayer-bear">',
        '<div class="player-slider">',
        '<a class="play"></a>',
        '<input class="slider" type="hidden" value="0"/>',
        '</div>',
        '<div class="player"></div>',
        '</li>'
    ].join('');

    exports.playMikaHtml = [
        '<li class="item-mika-info item-bear-info" id="J_jplayer-mika">',
        '<div class="player-slider">',
        '<a class="play"></a>',
        '<input class="slider" type="hidden" value="0"/>',
        '</div>',
        '<div class="player"></div>',
        '</li>'
    ].join('');

    exports.playSingleHtml = [
        '<li class="item-grow-info item-bear-info">',
        '<div class="player-slider">',
        '<a class="play"></a>',
        '<input class="slider" type="hidden" value="0"/>',
        '</div>',
        '<div class="player"></div>',
        '</li>'
    ].join('');
	
	exports.playWeixinSongHtml = [
        '<li class="item-option-box item-for-weixin" id="J_jplayer-weixin-song">',
        '<div class="player-slider">',
        '<div class="played-time item-for-weixin-color">00:00</div>',
        '<div class="total-time item-for-weixin-color">00:00</div>',
        '<input class="slider" type="hidden" value="0"/>',
        '</div>',
        '<div class="player"></div>',
        '</li>'
    ].join('');
	
	
	exports.playBearSongHtml = [
        '<li class="item-option-box item-for-bear" id="J_jplayer-bear-song">',
        '<div class="player-slider">',
        '<div class="played-time item-for-bear-color">00:00</div>',
        '<div class="total-time item-for-bear-color">00:00</div>',
        '<input class="slider" type="hidden" value="0"/>',
        '</div>',
        '<div class="player"></div>',
        '</li>'
    ].join('');

    exports.playMikaSongHtml = [
        '<li class="item-option-box item-for-mika" id="J_jplayer-mika-song">',
        '<div class="player-slider">',
        '<div class="played-time item-for-mika-color">00:00</div>',
        '<div class="total-time item-for-mika-color">00:00</div>',
        '<input class="slider" type="hidden" value="0"/>',
        '</div>',
        '<div class="player"></div>',
        '</li>'
    ].join('');

    exports.myalbumAlertHtml = [
        '<div class="album-alert" id="J_album-alert">',
        '<div class="title-bar">添加到我的歌单',
        '<a href="javascript:void(0);" class="item-a close-btn">&times;</a>',
        '</div>',
        '<ul class="list">',
        '<li class="new-myalbum">',
        '<a href="javascript:void(0);" class="item-a new-btn">',
        '<div class="title text-over">新建歌单</div>',
        '</a>',
        '<div class="new-box">',
        '<input type="text" class="left input" placeholder="歌单名称">',
        '<a href="javascript:void(0);" type="ok" class="item-a left ok-btn">确定</a>',
        '<a href="javascript:void(0);" type="cancel" class="item-a left cancel-btn">取消</a>',
        '</div>',
        '</li>',
        '</ul>',
        '</div>'
    ].join('');


    exports.myalbumItemHtml = [
        '<% $.each(list, function(i, item){ %>',
        '<li class="item" albumid="<%=item.id %>">',
        '<a href="javascript:void(0);" class="item-a">',
        '<div class="img-b">',
        '<img class="img-auto" src="<%=item.cover||"./static/images/default-cover.png" %>" alt="">',
        '</div>',
        '<div class="title text-over"><div class="name"><%=item.name %></div><span>(共<%=item.count %>首)</span></div>',
        '</a>',
        '</li>',
        '<% }) %>',
    ].join('');


    exports.myrandomHtml = [
        '<div class="album-random" id="J_random-box">',
        '<div class="title-bar">为您选出5首随心听歌曲',
        '<a href="javascript:void(0);" class="item-a close-btn">&times;</a>',
        '</div>',
        '<ul class="list">',
        '</ul>',
        '<li class="footer"><a class="random_left"></a>',
        '<a class="random_right"></a></li>',
        '</div>'
    ].join('');

    exports.myipDescription = [
        '<div class="album-random" id="J_random-dec">',
        '<div class="title-people">人物介绍',
        '<a href="javascript:void(0);" class="item-a close-btn">&times;</a>',
        '</div>',
        '<ul class=" list-people">',
        '<li><a>角色：</a><span id="name"></span></li>',
        '<li><a>英文名：</a><span id="en_name"></span></li>',
        '<li><a>口号：</a><span id="catchword"></span></li>',
        '<li><a>性格特点：</a><span id="personal"></span></li>',
        '<li><a>介绍：</a><span id="recommend"></span></li>',
        '</ul>',
        '</div>'
    ].join('');


    exports.mysongHtml = [
        '<% $.each(list, function(i, item){ %>',
        ' <li class="item" sid="<%=item.id %>"  md5="<%=item.md5 %>" size="<%=item.filesize %>" tag="<%=item.tag %>" tagval="<%=item.tagval %>" url="<%=item.url %>" type="<%=item.type %>">',
        '<a class="checkbox">',
        '<span><%=i+1 %></span>',
        '</a>',
        '<a class="item-a" href="javascript:void(0);">',
        '<div class="title-box">',
        '<div class="title text-over"><%=item.name %></div>',
        '<div class="new"></div>',
        '</div>',
        '<div class="desc"><%=BEME.func.formatTime(item.song_time) %></div>',
        '</a>',
        '</li>',
        '<%});%>'
    ].join('');
	
	exports.ipTempHtml = [
		'<% $.each(list, function(i, item){ %>',
		' <li class="music-list" sid="<%=item.id %>"  md5="<%=item.md5 %>" size="<%=item.filesize %>" tag="<%=item.tag %>" tagval="<%=item.tagval %>" url="<%=item.url %>" type="<%=item.type %>">',
        '<div class="newHeader"><span class="circle"></span>本期音频<span class="circle"></span></div>',
        '<div class="newTitle" >',
        '<div class="text-over"><%=item.name %></div>',
        '<div class="desc"><%=BEME.func.formatTime(item.song_time) %></div>',
        '</div>',
		'<div class="newPush" href="javascript:void(0);">推送给玩具</div>',
        '</li>',
		'<%});%>'
	].join('');

});