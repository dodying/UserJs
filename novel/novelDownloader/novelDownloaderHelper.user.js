// ==UserScript==
// @name        novelDownloaderHelper
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【小说】下载脚本助手
// @description:zh-CN  
// @include     *
// @exclude     *.baidu.com*
// @exclude     *.google.*
// @version     1.01
// @grant       GM_setClipboard
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @run-at      document-end
// ==/UserScript==
var info;
jQuery(window).keydown(function (e) {
  info = '';
  if (e.shiftKey && e.keyCode === 72) { //H
    var gbk = (jQuery('meta[content*="charset=gb"]').length > 0) ? ',1' : '';
    var text = '\n'
    + 'addIRule(\'' + location.host + '\',\'\',\'\',\'\');\n'
    + 'addCRule(\'' + location.host + '\',\'\',\'\',0' + gbk + ');';
    info = 'index';
  } else if (e.shiftKey && e.keyCode === 85) { //U
    var text = '\n'
    + '// @include     ' + location.href;
    info = 'include';
  } else if (e.shiftKey && e.keyCode === 82) { //R
    var text = '\n'
    + 'addRRule(\'' + location.host + '\', \'\\\\s+||| \', \'\');';
    info = 're';
  } else if (e.shiftKey && e.keyCode === 65) { //A
    var gbk = (jQuery('meta[content*="charset=gb"]').length > 0) ? ',1' : '';
    var space = '    ';
    var text = '\n'
    + space + '"' + location.host + '": {\n'
    + space + space + '"include1": "' + location.href + '",\n'
    + space + space + '"indexRule": "' + 'addIRule(\'' + location.host + '\',\'\',\'\',\'\');' + '",\n'
    + space + space + '"chapterRule": "' + 'addCRule(\'' + location.host + '\',\'\',\'\',0' + gbk + ');' + '"\n'
    + space + '},';
    info = 'all';
  }
  if (info !== '') {
    GM_setClipboard(text);
    var pretitle = document.title;
    document.title = '[已复制' + info + ']' + pretitle;
    setTimeout(function () {
      document.title = pretitle;
    }, 3000);
  }
});
