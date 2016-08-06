// ==UserScript==
// @name        ExHentai2E-Hantai
// @name:zh-CN  【EH】里站跳转
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http*://exhentai.org/g/*#2
// @include     http*://g.e-hentai.org/g/*#2
// @exclude     http*://exhentai.org/g/*/?p=*
// @exclude     http*://g.e-hentai.org/g/*/?p=*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// ==/UserScript==
var PreUrl = window.location.href;
if (PreUrl.indexOf('exhentai') >= 0) {
  if (GM_getValue('EH', '0') != '1') {
    if (!document.getElementById('ta_female:lolicon') && !document.getElementById('ta_male:shotacon')) {
      window.location = location.href.replace('exhentai', 'g.e-hentai');
    }
  }
} else if (PreUrl.indexOf('g.e-hentai') >= 0) {
  if (document.querySelector('.d')) {
    window.location = location.href.replace('g.e-hentai', 'exhentai');
    GM_setValue('EH', '1');
  }
}
window.addEventListener('beforeunload', function () { //页面关闭
  GM_setValue('EH', '0');
}, true);
/*
window.addEventListener('unload', function () {//页面改变
  GM_setValue('unload', GM_getValue('unload', '') + '2')
}, true);
*/
