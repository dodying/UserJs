// ==UserScript==
// @name        []newTab
// @author      daysv dodying
// @namespace   http://daysv.github.com
// @description 链接强制在新建标签中打开 Open a URL in a new tab
// @version     0.2.0.0+1
// @include     http*://*/*
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// ==/UserScript==
(function total() {
  /*
    var observer = new MutationObserver(init);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  */
  let blacklist = GM_getValue('blacklist', []);
  let host = location.host;
  if (blacklist.includes(host)) {
    let id;
    id = GM_registerMenuCommand('newTab: Effect ' + host, function() {
      let blacklist = GM_getValue('blacklist', []);
      if (blacklist.includes(host)) {
        blacklist.splice(blacklist.indexOf(host), 1);
        GM_setValue('blacklist', blacklist);
        GM_unregisterMenuCommand(id);
        total();
      }
    }, 'N');
  } else {
    init();
    let id;
    id = GM_registerMenuCommand('newTab: DO NOT Effect ' + host, function() {
      let blacklist = GM_getValue('blacklist', []);
      if (!blacklist.includes(host)) {
        blacklist.push(host);
        GM_setValue('blacklist', blacklist);
        GM_unregisterMenuCommand(id);
        total();
      }
    }, 'N');
  }

  function init() {
    var raw = [];
    var changed = [];
    var protocol, host, hash, next, text;
    [...document.links].forEach(link => {
      protocol = !link.protocol.match(/^(http.?|ftp):$/);
      host = link.href === location.origin || link.href === location.origin + '/';
      hash = !!link.href.match('#') && link.pathname === location.pathname;
      next = link.hasAttribute('rel') && !!link.getAttribute('rel').match(/^(prev|next)$/);
      text = !!link.textContent.trim().match(/^(\d+|<|>|<<|>>)$|(上|下|前|后)一(章|页)|Previous|Next|首页|末页/i);
      if (protocol || host || hash || next || text) {
        raw.push({
          target: link,
          url: link.href,
          text: link.textContent,
          html: link.innerHTML,
          info: {
            protocol: protocol,
            root: host,
            hash: hash,
            next: next,
            textMatch: text
          }
        });
      } else {
        changed.push(link);
        link.setAttribute('target', '_blank');
      }
    });
    /*console.error('Set newtab: ', changed, '\ndon\'t change: ', raw);*/
  }
})();
