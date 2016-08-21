// ==UserScript==
// @name        novelDownloaderHelper
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【小说】下载脚本助手
// @description:zh-CN  
// @include     *
// @exclude     *.baidu.com*
// @exclude     *.google.*
// @version     1.03
// @grant       GM_setClipboard
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
var info;
var pretitle = document.title;
window.onkeydown = function (e) {
  if (e.altKey || e.ctrlKey || e.metaKey || e.keyCode === 13) return
  info = '';
  if (e.shiftKey && e.keyCode === 72) { //H
    var gbk = (document.querySelector('meta[content*="charset=gb"]')) ? ',0,1' : '';
    var text = '\n'
    + 'addIRule(\'' + location.host + '\',\'' + pretitle.replace(/.*\- /, '') + '\',\'\',\'\');\n'
    + 'addCRule(\'' + location.host + '\',\'\',\'\'' + gbk + ');';
    info = 'index';
  } else if (e.shiftKey && e.keyCode === 85) { //U
    var text = '\n'
    + '// @include     ' + location.href;
    info = 'include';
  } else if (e.shiftKey && e.keyCode === 82) { //R
    var text = 'addRRule(\'' + location.host + '\', \'\\\\s+||| \', \'\');';
    info = 're';
  } else if (e.shiftKey && e.keyCode === 65) { //A
    var gbk = (document.querySelector('meta[content*="charset=gb"]')) ? ',0,1' : '';
    var space = '    ';
    var text = '\n'
    + space + '"' + location.host + '": {\n'
    + space + space + '"include1": "' + location.href + '",\n'
    + space + space + '"indexRule": "' + 'addIRule(\'' + location.host + '\',\'' + pretitle.replace(/.*\- /, '') + '\',\'\',\'\');' + '",\n'
    + space + space + '"chapterRule": "' + 'addCRule(\'' + location.host + '\',\'\',\'\'' + gbk + ');' + '"\n'
    + space + '},';
    info = 'all';
  }
  if (info !== '') {
    GM_setClipboard(text);
    document.title = '[已复制' + info + ']' + pretitle;
    setTimeout(function () {
      document.title = pretitle;
    }, 3000);
  }
};
