// ==UserScript==
// @name        [HV]SaveImage
// @author      dodying
// @include     http*://hentaiverse.org/*
// @include     http://alt.hentaiverse.org/*
// @version     1.10
// @grant       GM_xmlhttpRequest
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @run-at      document-idle
// ==/UserScript==
(function () {
  if (document.getElementById('riddlecounter')) {
    const url = document.querySelector('#riddlebot>img').src;
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      onload(e) {
        /* global saveAs */
        saveAs(new window.Blob([e.response], {
          type: 'image/jpeg',
        }), `${new Date().getTime()}.jpg`);
      },
    });
  }
}());
