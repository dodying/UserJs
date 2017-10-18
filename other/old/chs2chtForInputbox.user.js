// ==UserScript==
// @name        chs2chtForInputbox
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  
// @description:zh-CN  
// @include     *
// @version     1
// @grant       GM_registerMenuCommand
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/21541/code/chs2cht.js?version=137286
// @run-at      document-end
// ==/UserScript==
/*
document.onkeydown = function (e) {
  if (e.target.onblur === null) {
    e.target.onblur = function () {
      this.value = tranStr(this.value, true);//true转为繁体,false转为简体
    }
  }
}
*/
GM_registerMenuCommand('转为繁体', function () {
  tran(true);
}, 'T');
GM_registerMenuCommand('转为简体', function () {
  tran(false);
}, 'S');
function tran(toBig5) {
  jQuery('input:text,textarea,[contenteditable="true"]').val(function () {
    return tranStr(this.value, toBig5);
  });
}
