// ==UserScript==
// @name        []Storage
// @namespace   https://github.com/dodying/UserJs
// @include     http://alt.hentaiverse.org/*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @author      Dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function() {
  var data = {
    'alt.hentaiverse.org': ['BazaarList', 'hvAA-option']
  };
  if (location.host in data) {
    var storage = GM_getValue(location.host, {});
    data[location.host].forEach(function(i) {
      if (i in localStorage) {
        storage[i] = localStorage[i];
      } else {
        localStorage[i] = storage[i];
      }
    });
    GM_setValue(location.host, storage);
  }
})();
