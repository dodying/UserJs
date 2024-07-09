/* eslint-env browser */
// ==UserScript==
// @name        []cached
// @description cached
// @include     http://*
// @include     https://*
// @version     1.0.110
// @created     2019-11-24 18:48:14
// @modified    2022-03-26 20:15:46
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @grant       GM_openInTab
// @grant       GM_registerMenuCommand
// @noframes
// ==/UserScript==
/* eslint-disable no-debugger  */

(async function () {
  const blacklist = GM_getValue('blacklist', []);
  const checkedlist = GM_getValue('checkedlist', []);
  const { host } = window.location;
  const url = `https://2tool.top/kuaizhao.php?k=${encodeURIComponent(window.location.href)}`;

  if (blacklist.includes(host)) {
    GM_registerMenuCommand(`Cached: Effect ${host}`, () => {
      const blacklist = GM_getValue('blacklist', []);
      if (blacklist.includes(host)) {
        blacklist.splice(blacklist.indexOf(host), 1);
        GM_setValue('blacklist', blacklist);
        window.location.reload();
      }
    });
    return;
  }

  GM_registerMenuCommand(`Cached: DO NOT Effect ${host}`, () => {
    const blacklist = GM_getValue('blacklist', []);
    if (!blacklist.includes(host)) {
      blacklist.push(host);
      GM_setValue('blacklist', blacklist);
      window.location.reload();
    }
  });

  if (checkedlist.includes(host)) {
    GM_registerMenuCommand('Cached: Show cached', () => {
      GM_openInTab(url, true);
    });
    return;
  }

  const body = await xhrSync(url);
  const args = body.response.match(/doLoadKz\(('.*)\)/g).map((i) => i.match(/doLoadKz\(('.*)\)/)[1]).map((i) => i.split(',').map((j) => j.replace(/^['"](.*)['"]$/, '$1')));
  await Promise.all(args.map((arg) => doLoadKz(...arg))).then((result) => {
    const caches = result.map((i) => i.response.match(/^callback\d\((.*)\)$/)[1]).map((i) => JSON.parse(i)).map((i) => i.kzUrl).filter((i) => i);
    if (caches.length) {
      const checkedlist = GM_getValue('checkedlist', []);
      checkedlist.push(host);
      GM_setValue('checkedlist', checkedlist);
    }
    if (!caches.length) {
      GM_notification({
        text: caches.length ? '已有快照' : '不存在快照',
        title: document.title,
        image: `${window.location.origin}/favicon.ico`,
        tag: GM_info.script.name,
        timeout: 10 * 1000,
        onclick() {
          GM_openInTab(caches.length ? url : `https://web.archive.org/save/${window.location.href}`, true);
        },
      });
    }
  });
}());

async function doLoadKz(s, typeId, num) {
  const preUrl = 'https://2tool.top';
  const url = `${preUrl}/kz.php?s=${s}&num=${num}`;
  return xhrSync(url);
}

function xhrSync(url, parm = null, opt = {}) {
  console.log({ url, parm });
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: parm ? 'POST' : 'GET',
      url,
      data: parm,
      timeout: opt.timeout || 60 * 1000,
      responseType: ['arraybuffer', 'blob', 'json'].includes(opt.responseType) ? opt.responseType : null,
      headers: opt.headers || {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      onload(res) {
        resolve(res);
      },
      ontimeout(res) {
        reject(res);
      },
      onerror(res) {
        reject(res);
      },
    });
  });
}
