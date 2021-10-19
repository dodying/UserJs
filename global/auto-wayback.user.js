// ==UserScript==
// @name        []auto-wayback
// @description 自动保存当前网页到时间机器
// @include     *
// @exclude     https://web.archive.org/*
// @exclude     https://duckduckgo.com/*
// @version     1.0.65
// @created     2020-09-24 15:51:26
// @modified    2020/9/24 16:28:14
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @require     https://greasyfork.org/scripts/398502-download/code/download.js?version=821561
// ==/UserScript==
/* eslint-disable no-debugger  */
/* global GM_registerMenuCommand GM_getValue GM_setValue */
/* global $ xhr */
(function () {
  const whitelist = GM_getValue('whitelist', []);
  const { host } = window.location;
  const urls = GM_getValue('urls', []);

  if (whitelist.includes(host)) {
    init();
    $(window).on('mousedown keydown scroll', (e) => {
      init();
    });

    GM_registerMenuCommand(`Auto-WaybackMachine: DO NOT Effect ${host}`, () => {
      const whitelist = GM_getValue('whitelist', []);
      if (whitelist.includes(host)) {
        whitelist.splice(whitelist.indexOf(host), 1);
        GM_setValue('whitelist', whitelist);
        window.location.reload();
      }
    }, 'N');
  } else {
    GM_registerMenuCommand(`Auto-WaybackMachine: Effect ${host}`, () => {
      const whitelist = GM_getValue('whitelist', []);
      if (!whitelist.includes(host)) {
        whitelist.push(host);
        GM_setValue('whitelist', whitelist);
        window.location.reload();
      }
    }, 'N');
  }

  async function init(url) {
    url = url || window.location.href;
    if (urls.includes(url)) return;
    urls.push(url);
    GM_setValue('urls', urls);

    const res = await xhr.sync(`https://archive.org/wayback/available?url=${url}`, null, { responseType: 'json' });
    console.log('查询结果', res);
    if (!res.response.archived_snapshots.closest || new Date().getTime() - new Date(res.response.archived_snapshots.closest.timestamp.substr(0, 8).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')).getTime() >= 1000 * 60 * 60 * 24 * 30) {
      const res = await xhr.sync(`https://web.archive.org/save/${url}`);
      console.log('保存成功', res);
    } else {
      console.log('近期快照', res.response.archived_snapshots.closest.url);
    }
  }
}());
