// ==UserScript==
// @name        GithubCopyRawLink
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【Github】复制原始链接
// @description:zh-CN  
// @include     https://github.com/*/blob/*
// @include     https://github.com/*/tree/*
// @version     1
// @grant       GM_setClipboard
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
setTimeout(function () {
  if (document.querySelector('.files>tbody>.js-navigation-item')) {
    var line = document.querySelectorAll('.files>tbody>.js-navigation-item');
    for (var i = 1; i < line.length; i++) {
      var td = document.createElement('td');
      var btn = document.createElement('button');
      btn.innerHTML = '复制Raw';
      btn.onclick = function () {
        GM_setClipboard(decodeURI(this.parentNode.parentNode.querySelector('.content>span>.js-navigation-open').href.replace('/blob/', '/raw/')));
      }
      td.appendChild(btn);
      line[i].insertBefore(td, line[i].querySelector('.icon'));
    }
  }
}, 1000);
