// ==UserScript==
// @name        [EH]EX2EH
// @version     1.01
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @include     https://exhentai.org/g/*
// @include     https://e-hentai.org/g/*
// @exclude     https://exhentai.org/g/*/?p=*
// @exclude     https://e-hentai.org/g/*/?p=*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @run-at      document-end
// ==/UserScript==
const url = location.href;
const gid = url.split('/')[4];
const $_ = e => document.getElementById(e);
const $ = e => document.querySelector(e);
if (url.match('exhentai')) { //里站
  if (GM_getValue(gid, true)) { //尝试跳转
    if (!$_('ta_female:lolicon') && !$_('ta_male:shotacon')) location = url.replace('exhentai', 'e-hentai');
  }
} else if (url.match('e-hentai')) { //表站
  if ($('.d')) { //不存在则返回
    location = url.replace('e-hentai', 'exhentai');
    GM_setValue(gid, false);
  }
}
window.addEventListener('beforeunload', () => { //页面关闭
  GM_deleteValue(gid);
}, true);
/*
window.addEventListener('unload', function () {//页面改变
  GM_setValue('unload', GM_getValue('unload', '') + '2')
}, true);
*/
