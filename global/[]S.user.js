// ==UserScript==
// @name        []S
// @description
// @include     http://*
// @include     https://*
// @version     1.0.0
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
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
  'use strict';
  let blacklist = GM_getValue('blacklist', []);
  let host = location.host;
  if (blacklist.includes(host)) {
    let id;
    id = GM_registerMenuCommand('S: Effect ' + host, function () {
      let blacklist = GM_getValue('blacklist', []);
      if (blacklist.includes(host)) {
        blacklist.splice(blacklist.indexOf(host), 1);
        GM_setValue('blacklist', blacklist);
        GM_unregisterMenuCommand(id);
        total();
      }
    }, 's');
  } else {
    if (location.protocol === 'http:') {
      let url = location.href.replace(/^http:/, 'https:');
      GM_xmlhttpRequest({
        url: url,
        method: 'HEAD',
        timeout: 5 * 1000,
        onload: function () {
          location.href = url;
        }
      });
    }
    let id;
    id = GM_registerMenuCommand('S: DO NOT Effect ' + host, function () {
      let blacklist = GM_getValue('blacklist', []);
      if (!(blacklist.includes(host))) {
        blacklist.push(host);
        GM_setValue('blacklist', blacklist);
        location.href = location.href.replace(/^https:/, 'http:');
      }
    }, 's');
  }

})();
