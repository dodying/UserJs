// ==UserScript==
// @name        getHostForNovelDownloader
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  
// @description:zh-CN  
// @include     *
// @exclude     *.baidu.com*
// @version     1
// @grant       GM_setClipboard
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @run-at      document-end
// ==/UserScript==
jQuery(window).keydown(function (e) {
  if (e.shiftKey && e.keyCode === 72) { //H
    if (jQuery('meta[content*="charset=gb"]').length > 0) {
      GM_setClipboard('\naddIRule(\'' + location.host + '\',\'\',\'\',\'\');\naddCRule(\'' + location.host + '\',\'\',\'\',0,1);');
    } else {
      GM_setClipboard('\naddIRule(\'' + location.host + '\',\'\',\'\',\'\');\naddCRule(\'' + location.host + '\',\'\',\'\',0);');
    }
    var pretitle = document.title;
    document.title = '[已复制Host]' + pretitle;
    setTimeout(function () {
      document.title = pretitle;
    }, 3000);
  } else if (e.shiftKey && e.keyCode === 85) { //U
    GM_setClipboard('\n// @include     ' + location.href);
    var pretitle = document.title;
    document.title = '[已复制Url]' + pretitle;
    setTimeout(function () {
      document.title = pretitle;
    }, 3000);
  } else if (e.shiftKey && e.keyCode === 82) { //R
    GM_setClipboard('\naddRRule(\'' + location.host + '\', \'\\\\s+||| \', \'\');');
    var pretitle = document.title;
    document.title = '[已复制Re]' + pretitle;
    setTimeout(function () {
      document.title = pretitle;
    }, 3000);
  }
});
