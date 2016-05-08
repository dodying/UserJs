// ==UserScript==
// @name        NSFW_Mode
// @name:zh-CN  绅士模式
// @namespace   Dodying
// @author      Dodying
// @description Fake the page when view nsfw in puc
// @description:zh-CN 在光天化日之下浏览不健康的网站时，伪装页面
// @include     http://exhentai.org/*
// @include     http://g.e-hentai.org/*
// @version     1
// @grant       none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @run-at      document-idle
// ==/UserScript==
var pretitle = document.title;
var icon;
(document.querySelector('link[rel="icon"]')) ? icon = document.querySelector('link[rel="icon"]').href : icon = '';
window.addEventListener('blur', function () {
  document.title = '知乎_百度搜索';
  if (!document.querySelector('link[rel="icon"]')) {
    var link = document.createElement('link');
    link.href = 'https://www.baidu.com/favicon.ico';
    link.rel = 'icon';
    document.head.appendChild(link);
  } else {
    document.querySelector('link[rel="icon"]').href = 'https://www.baidu.com/favicon.ico';
  }
});
window.addEventListener('focus', function () {
  document.title = pretitle;
  document.querySelector('link[rel="icon"]').href = icon;
});
var img = document.querySelectorAll('img');
for (var i = 0; i < img.length; i++) {
  img[i].src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWP4////fwAJ+wP9CNHoHgAAAABJRU5ErkJggg==';
}
