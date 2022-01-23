/* eslint-env browser */
// ==UserScript==
// @name        []newTab
// @raw-author  daysv
// @raw-namespace http://daysv.github.com
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @description 链接强制在新建标签中打开 Open a URL in a new tab
// @raw-version 0.2.0.0
// @version     0.0.113

// @include     http*://*/*

// @exclude     http*://*.gitbooks.io/*/content/*
// @exclude     http*://*.github.io/*/docs/*
// @exclude     http*://mail.*/*
// @exclude     http*://*.mail.*/*

// @icon        https://gitee.com/dodying/userJs/raw/master/Logo.png
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// ==/UserScript==
/* global GM_registerMenuCommand GM_getValue GM_setValue */
(function total() {
  if (document.title.match(/^Index of /) && document.querySelector('[href="../"]')) {
    return;
  }

  const blacklist = GM_getValue('blacklist', []);
  const { host } = window.location;

  if (blacklist.includes(host)) {
    GM_registerMenuCommand(`newTab: Effect ${host}`, () => {
      const blacklist = GM_getValue('blacklist', []);
      if (blacklist.includes(host)) {
        blacklist.splice(blacklist.indexOf(host), 1);
        GM_setValue('blacklist', blacklist);
        window.location.reload();
      }
    }, 'N');
  } else {
    init();
    const observer = new window.MutationObserver((mutationsList) => {
      let list = mutationsList.filter((i) => i.addedNodes.length).map((i) => [...i.addedNodes]);
      list = [].concat(...list);
      if (list.length) init(list);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    GM_registerMenuCommand(`newTab: DO NOT Effect ${host}`, () => {
      const blacklist = GM_getValue('blacklist', []);
      if (!blacklist.includes(host)) {
        blacklist.push(host);
        GM_setValue('blacklist', blacklist);
        window.location.reload();
      }
    }, 'N');
  }

  function init(parents) {
    let elems = parents || [document];
    elems = elems.filter((i) => i.querySelectorAll).map((i) => (['A', 'AREA'].includes(i.tagName) ? i : [...i.querySelectorAll(':not([target="_blank"]):not([data-newtab="true"])')].filter((j) => ['A', 'AREA'].includes(j.tagName)))); // BASE FORM
    elems = [].concat(...elems);

    // let raw = []
    // let changed = []
    elems.forEach((link) => {
      link.setAttribute('data-newtab', 'true');
      const prop = link.tagName === 'FORM' ? 'action' : 'href';
      if (!link[prop]) return;
      const url = new URL(link[prop]);
      const protocol = !url.protocol.match(/^(http.?|ftp):$/);
      const host = url.href === window.location.origin || url.href === `${window.location.origin}/`;
      const hash = !!url.href.match('#') && url.pathname === window.location.pathname;
      const next = link.hasAttribute('rel') && !!link.getAttribute('rel').match(/^(prev|next)$/);
      const text = !!link.textContent.trim().match(/^(\d+|<|>|<<|>>)$|(上|下|前|后|首|末|尾)一?(章|页|话|集|节|卷|篇|章|頁|話|集|節|卷|篇)|Prev(ious)?|Next/i);
      if (protocol || host || hash || next || text) {
        // raw.push({
        //   target: link,
        //   url: link[prop],
        //   text: link.textContent,
        //   html: link.innerHTML,
        //   info: {
        //     protocol: protocol,
        //     root: host,
        //     hash: hash,
        //     next: next,
        //     textMatch: text
        //   }
        // })
      } else {
        // changed.push(link)
        link.setAttribute('target', '_blank');
      }
    });
    /* console.error('Set newtab: ', changed, '\ndon\'t change: ', raw); */
  }
}());
