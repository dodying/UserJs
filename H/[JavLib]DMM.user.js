// ==UserScript==
// @name        [JavLib]DMM
// @namespace   https://github.com/dodying/UserJs
// @include     http://www.javlibrary.com/cn/?v=javli*
// @version     1
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function() {
  'use strict';
  const $ = e => document.querySelector(e);
  if ($('#video_jacket_img') && $('#video_jacket_img').src.match(/http:\/\/pics.dmm.co.jp\/mono\/movie\/adult\/(.*?)\/(.*?)pl\.jpg/)) {
    var code = $('#video_jacket_img').src.match(/http:\/\/pics.dmm.co.jp\/mono\/movie\/adult\/(.*?)\/(.*?)pl\.jpg/)[1];
    $('#video_jacket_img').onclick = () => {
      window.open(`http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=${code}/`);
    }
  }
})();
