// ==UserScript==
// @name        []newTab
// @raw-author  daysv
// @raw-namespace http://daysv.github.com
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @description 链接强制在新建标签中打开 Open a URL in a new tab
// @raw-version 0.2.0.0
// @version     0.0.78

// @include     http*://*/*

// @exclude     http*://*.gitbooks.io/*/content/*
// @exclude     http*://*.github.io/*/docs/*
// @exclude     http*://mail.*/*
// @exclude     http*://*.mail.*/*

// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// ==/UserScript==
(function total () {
  if (document.title.match(/^Index of /) && document.querySelector('[href="../"]')) {
    return;
  }

  const blacklist = GM_getValue('blacklist', []);
  const host = window.location.host;

  if (blacklist.includes(host)) {
    GM_registerMenuCommand('newTab: Effect ' + host, function () {
      const blacklist = GM_getValue('blacklist', []);
      if (blacklist.includes(host)) {
        blacklist.splice(blacklist.indexOf(host), 1);
        GM_setValue('blacklist', blacklist);
        window.location.reload();
      }
    }, 'N');
  } else {
    init();
    const observer = new window.MutationObserver(mutationsList => {
      let list = mutationsList.filter(i => i.addedNodes.length).map(i => [...i.addedNodes]);
      list = [].concat(...list);
      if (list.length) init(list);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    GM_registerMenuCommand('newTab: DO NOT Effect ' + host, function () {
      const blacklist = GM_getValue('blacklist', []);
      if (!blacklist.includes(host)) {
        blacklist.push(host);
        GM_setValue('blacklist', blacklist);
        window.location.reload();
      }
    }, 'N');
  }

  function init (parents) {
    let elems = parents || [document];
    elems = elems.filter(i => i.querySelectorAll).map(i => i.tagName === 'A' ? i : [...i.querySelectorAll('a:not([target="_blank"]):not([newtab="true"])')]);
    elems = [].concat(...elems);

    // let raw = []
    // let changed = []
    let protocol, host, hash, next, text;
    elems.forEach(link => {
      link.setAttribute('newtab', 'true');
      protocol = !link.protocol.match(/^(http.?|ftp):$/);
      host = link.href === window.location.origin || link.href === window.location.origin + '/';
      hash = !!link.href.match('#') && link.pathname === window.location.pathname;
      next = link.hasAttribute('rel') && !!link.getAttribute('rel').match(/^(prev|next)$/);
      text = !!link.textContent.trim().match(/^(\d+|<|>|<<|>>)$|(上|下|前|后|第)一?(章|页|话|集)|Previous|Next|首页|末页|尾页/i);
      if (protocol || host || hash || next || text) {
        // raw.push({
        //   target: link,
        //   url: link.href,
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
})();
