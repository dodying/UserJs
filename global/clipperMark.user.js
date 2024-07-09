/* eslint-env browser */
// ==UserScript==
// @name        clipper-mark
// @description clipper-mark
// @include     *
// @version     1.0.31
// @created     2022-07-10 11:53:17
// @modified    2022-11-13 18:15:34
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// require     https://cdn.jsdelivr.net/gh/mozilla/readability@master/Readability.js
// require     https://cdnjs.cloudflare.com/ajax/libs/turndown/7.1.1/turndown.js
// ==/UserScript==
/* global $ GM_setValue GM_getValue */
/* -global  Readability TurndownService */
/* eslint-disable no-debugger  */
// https://github.com/mozilla/readability
// https://github.com/mixmark-io/turndown
(function () {
  function getId() {
    if (window.location.href.match(/https:\/\/github.com\/([^\/]+\/[^\/]+)/) && $('#code-tab[aria-current="page"]').length) {
      return `user://github/${window.location.href.match(/https:\/\/github.com\/([^\/]+\/[^\/]+)/)[1]}`;
    }
    return window.location.href;
  }

  const observer = new window.MutationObserver((mutationsList) => {
    if ($('iframe[src="chrome-extension://mhfbofiokmppgdliakminbgdgcmbhbac/tool.html"],iframe[src="moz-extension://8091c1b9-cbe2-4522-89e9-6fd285b540d9/tool.html"]').length) {
      observer.disconnect();
      const id = getId();
      if (GM_getValue(id)) alert(`已添加: ${id}`);
      else GM_setValue(id, '1');
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}());
