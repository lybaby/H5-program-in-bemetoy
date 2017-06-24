/*global define*/
define('comm/touch', ['require', 'exports'], function(require, exports) {
    "use strict";
    
    exports.drag = function(sele) {
        var firstPos = false,
            config = {
                timeLimit : 100, //两次感应间隔时间为200
                speedLimit : 80, //速度限制为80
                stopLimit : 400,
                callback : function(){},
                end : function(){}
            };

        var $sele = $(sele),
            sx,sy,cx=0,cy=0,
            offset = 0,
            css = '',
            bodyOffset = $(document.body).offset(),
            nowPos;

        $sele.on('touchstart', function(e){
            offset = $sele.offset();
            if(e.targetTouches || (e.touches && e.touches.length == 1)){
                var ex = e.touches || e.targetTouches || [e];
                firstPos = {x:ex[0].pageX, y:ex[0].pageY};
            }
            sx = firstPos.x-cx;
            sy = firstPos.y-cy;
            //e.preventDefault();
        }).on('touchmove', function(e){
            var ex = e.touches || e.targetTouches || [e];
            nowPos = {x:ex[0].pageX, y:ex[0].pageY};
            css = 'translate('+(nowPos.x-sx)+'px, '+(nowPos.y-sy)+'px)';
            $sele.css({
                'transform' : css,
                '-webkit-transform' : css
            });
            e.preventDefault();
        }).on('touchend', function(e){
            config.end(e);
            cx = 0; cy = 0;
            if(!nowPos){
                return true;
            }

            css = {};
            css.left = Math.max(offset.left+nowPos.x-sx, 0);
            css.top = Math.max(offset.top+nowPos.y-sy, 0);
            css.left = Math.min(css.left, bodyOffset.width-60);
            css.top = Math.min(css.top, bodyOffset.height-60);

            css['transform'] = null;
            css['-webkit-transform'] = null;
            $sele.css(css);
            nowPos = false;
            e.preventDefault();
        });
    };

});