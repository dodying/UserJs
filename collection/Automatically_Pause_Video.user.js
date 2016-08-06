// ==UserScript==
// @name        Automatically Pause Video
// @namespace   http://tieba.baidu.com/f?kw=firefox
// @updateURL 	https://github.com/FirefoxBar/userscript/raw/master/Automatically_Pause_Video/Automatically_Pause_Video.meta.js
// @downloadURL https://github.com/FirefoxBar/userscript/raw/master/Automatically_Pause_Video/Automatically_Pause_Video.user.js
// @include     http://www.tudou.com/*
// @include     http://www.iqiyi.com/*
// @include     http://v.qq.com/*
// @include     http://www.letv.com/*
// @include     http://v.youku.com/*
// @include     http://tv.sohu.com/*
// @include     http://vod.xunlei.com/*
// @include     http://vod.kankan.com/*
// @include     http://pan.baidu.com/play/*
// @include     http://www.56.com/*
// @version     0.1
// @grant       none
// @author		网络中二行客
// ==/UserScript==

;(function(UW){
	var sites = {
		tudou : function(h){
			h ? UW.playerEx.pause() : 
			UW.playerEx.play();
		},
		iqiyi : function(h){
			h ? UW._player.pause() : 
			UW._player.resume();
		},
		qq : function(h){
			h ? UW.txv.playdata.player.pause() : 
			UW.txv.playdata.player.play();
		},
		letv : function(h){
			h ? UW.__PLAYER__.pause() :
			UW.__PLAYER__.play();
		},
		youku : function(h){
			h ? UW.PlayerPause(1) : 
			UW.PlayerPause(0);
		},
		sohu : function(h){
			h ? UW.sohuHD.getElem('player').pauseVideo() : 
			UW.sohuHD.getElem('player').playVideo();
		},
		xunlei : function(h){
			h ? UW.G_PLAYER_INSTANCE.pause() :
			UW.G_PLAYER_INSTANCE.play();
		},
		kankan : function(h){
			h ? UW.G_PLAYER_INSTANCE.pause() :
			UW.G_PLAYER_INSTANCE.play();
		},
		baidu : function(h){
			h ? UW.disk.ui.VideoPlayer.myFlashPlayer.pause() :
			UW.disk.ui.VideoPlayer.myFlashPlayer.play();
		},
		"56" : function(h){
			h ? UW.video_player.j2s_setVideoPauseAll() :
			UW.video_player.j2s_setVideoResumeAll();
		}
	},
	current,
	url = window.location.host,
	autoPause = {
		handleEvent: function(){
			sites[current](document.mozHidden || document.webkitHidden);
		},
		init: function(){
			for(var i in sites){
				(url.search(i) !== -1) && (current = i);
			}
			var change = typeof document.mozHidden !== "undefined" ?
			"mozvisibilitychange" : "webkitvisibilitychange";	
			current && document.addEventListener(change,this,false);
		}
	};	
	autoPause.init();
})(unsafeWindow);
