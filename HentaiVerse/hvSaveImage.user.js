// ==UserScript==
// @name        [HV]SaveImage
// @author      dodying
// @include     http*://hentaiverse.org/*
// @include     http://alt.hentaiverse.org/*
// @version     1.00
// @grant       GM_xmlhttpRequest
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @run-at      document-idle
// ==/UserScript==
(function() {
  if (document.getElementById('riddlecounter')) {
    var url = document.querySelector('#riddlebot>img').src;
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      onload: function(e) {
        saveAs(new Blob([e.response], {
          type: 'image/jpeg'
        }), new Date().getTime() + '.jpg');
      }
    });
  }
})();
