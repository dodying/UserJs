// ==UserScript==
// @name        新标签打开链接
// @author      daysv
// @namespace   http://daysv.github.com
// @description 链接强制在新建标签中打开 Open a URL in a new tab
// @version     0.2.0
// @include    http://www.javlibrary.com/cn/*
// @include    http://g.e-hentai.org/*
// @include    https://exhentai.org/*
// include     *
// exclude     http://115.com/?*
// exclude     http://music.163.com*
// exclude     https://*mail.qq.com/*
// @grant       GM_openInTab
// ==/UserScript==
(function (document) {
  [
  ].slice.call(document.links).forEach(function (aTag) {
    aTag.setAttribute('target', '_blank');
  })
}) (document)
