// ==UserScript==
// @name        ExHentai2E-Hantai
// @description 已整合到[EH]Enhance
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @include     https://exhentai.org/g/*
// @include     https://e-hentai.org/g/*
// @exclude     https://exhentai.org/g/*/?p=*
// @exclude     https://e-hentai.org/g/*/?p=*
// @version     1.02
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @run-at      document-end
// ==/UserScript==
const gid = location.href.split('/')[4];
if (location.host === 'exhentai.org') { // 里站
  if (GM_getValue(gid, true)) { // 尝试跳转
    if (!['ta_female:lolicon', 'ta_male:shotacon'].some((i) => document.getElementById(i))) location = `//e-hentai.org${location.pathname}`;
  } else {
    GM_deleteValue(gid);
  }
} else if (location.host === 'e-hentai.org') { // 表站
  if (document.querySelector('.d')) { // 不存在则返回
    location = `//exhentai.org${location.pathname}`;
    GM_setValue(gid, false);
  }
}
