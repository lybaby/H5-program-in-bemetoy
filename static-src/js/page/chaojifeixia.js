/**
 * Created by tiny on 2015/10/29.
 */
/* global define, $, BEME*/
define('page/chaojifeixia', ['comm/utils', 'comm/url', 'helper/app', 'require', 'exports'],
    function(mUtils, mUrl, mApp, require, exports){
        "use strict";
		
        var _renderInfo = function(jdata,text){
		
        };

        var _queryInfo = function(){
            mApp.loaded();
        };

        var  _initEvent = function() {
			$("#player1").on('play',function(){
				document.getElementById("player2").pause(); 
				document.getElementById("player3").pause();
				document.getElementById("player4").pause(); 			
			});
		
			$("#player2").on('play',function(){
				document.getElementById("player1").pause(); 
				document.getElementById("player3").pause();
				document.getElementById("player4").pause(); 			
			});
			$("#player3").on('play',function(){
				document.getElementById("player2").pause(); 
				document.getElementById("player1").pause();
				document.getElementById("player4").pause(); 			
			});
			$("#player4").on('play',function(){
				document.getElementById("player2").pause(); 
				document.getElementById("player3").pause();
				document.getElementById("player1").pause(); 			
			});
			

        };

        exports.init = function(){
            var hashs = mUrl.getParams();
            _queryInfo();
            _initEvent();

        };


        exports.uninit = function(){

        };
    });