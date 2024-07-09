/* eslint-env browser */
// ==UserScript==
// @name        []https
// @description
// @include     http://*
// @include     https://*
// @version     1.0.8
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @connect     *
// @noframes
// @run-at      document-start
// ==/UserScript==
(function total() {
  const blacklist = GM_getValue('blacklist', []);
  const { host } = window.location;
  if (blacklist.includes(host)) {
    let id;
    id = GM_registerMenuCommand(`S: Effect ${host}`, () => {
      const blacklist = GM_getValue('blacklist', []);
      if (blacklist.includes(host)) {
        blacklist.splice(blacklist.indexOf(host), 1);
        GM_setValue('blacklist', blacklist);
        GM_unregisterMenuCommand(id);
        total();
      }
    }, 's');
  } else {
    if (window.location.protocol === 'http:') {
      const url = window.location.href.replace(/^http:/, 'https:');
      GM_xmlhttpRequest({
        url,
        method: 'HEAD',
        timeout: 5 * 1000,
        onload(res) {
          if (new URL(res.finalUrl).protocol === 'https:' && res.status === 200) window.location.href = res.finalUrl;
        },
      });
    }
    GM_registerMenuCommand(`S: DO NOT Effect ${host}`, () => {
      const blacklist = GM_getValue('blacklist', []);
      if (!(blacklist.includes(host))) {
        blacklist.push(host);
        GM_setValue('blacklist', blacklist);
        window.location.href = window.location.href.replace(/^https:/, 'http:');
      }
    }, 's');
  }
}());
