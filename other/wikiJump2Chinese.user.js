// ==UserScript==
// @name        wikiJump2Chinese
// @name:zh-CN  维基页面跳转到中文
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description:zh-CN 
// @include     https://*.wikipedia.org/wiki/*
// @include     https://*.wiktionary.org/wiki/*
// @version     1
// @grant       none
// @run-at      document-idle
// ==/UserScript==
if (document.querySelector('.interwiki-zh')) {
  document.querySelector('.interwiki-zh a').click();
}
