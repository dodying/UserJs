/* eslint-env browser */
// ==UserScript==
// @name        copyModify
// @description copyModify
// @include     *
// @version     1.0.7
// @created     2020-12-05 15:44:53
// @modified    2024-07-09 21:13:40
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://github.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// @grant       none
// @noframes
// ==/UserScript==
/* eslint-disable no-debugger  */
(function () {
  document.addEventListener('copy', (e) => {
    const text = window.getSelection().toString().trim();
    if (text) {
      // GM_setClipboard(text);
      e.clipboardData.setData('text/plain', text);
      e.clipboardData.setData('text/html', text);
    }
    e.preventDefault();
  }, false);
}());
