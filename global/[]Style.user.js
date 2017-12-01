// ==UserScript==
// @name        []Style
// @description
// @version     1.00
// @grant       GM_addStyle
// @author      Dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @include     *
// ==/UserScript==
(function() {
  var style = [
    'a:visited{color:rgb(35,173,173);}'
  ];
  GM_addStyle(style.join(''));
})();
