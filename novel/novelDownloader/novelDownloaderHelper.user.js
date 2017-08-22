// ==UserScript==
// @name        novelDownloaderHelper
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【小说】下载脚本助手
// @description:zh-CN
// @include     *
// @exclude     *.baidu.com*
// @exclude     *.google.*
// @version     1.031a
// @grant       GM_setClipboard
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
window.onkeydown = function(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.altKey || e.ctrlKey || e.metaKey || e.keyCode === 13) return;
  var info = '';
  var pretitle = document.title;
  var text = '';
  if (e.shiftKey && e.keyCode === 72) { //Shift+H
    var h1 = document.querySelectorAll('h1').length === 1 ? 'h1' : '';
    var gbk = (document.querySelector('meta[content*="charset=gb"],meta[charset*="gb"],script[charset*="gb"]')) ? ',1' : '';
    text = '\n' +
      'addIRule(\'' + location.host + '\',\'' + pretitle.replace(/.*(,|-)/, '').trim() + '\',\'' + h1 + '\',\'\');\n' +
      'addCRule(\'' + location.host + '\',\'\',\'\'' + gbk + ');';
    info = 'index';
  } else if (e.shiftKey && e.keyCode === 85) { //Shift+U
    text = '\n' + '// @include     ' + location.href;
    info = 'include';
  } else if (e.shiftKey && e.keyCode === 82) { //Shift+R
    text = 'addRRule(\'' + location.host + '\', \'\\\\s+||| \', \'\');';
    info = 're';
  }
  if (info !== '') {
    GM_setClipboard(text);
    document.title = '[已复制' + info + ']' + pretitle;
    setTimeout(function() {
      document.title = pretitle;
    }, 3000);
  }
};
