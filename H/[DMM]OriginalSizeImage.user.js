// ==UserScript==
// @name        [DMM]OriginalSizeImage
// @name:zh-CN  [DMM]原始图片大小
// @namespace   https://github.com/dodying/Dodying-UserJs
// @include     http://www.dmm.co.jp/*
// @include     http://www.javlibrary.com/cn/?v=jav*
// @version     1
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @grant       none
// @run-at       document-end
// ==/UserScript==
(function() {
  var style = document.createElement('style');
  style.textContent = '#toplogo,.socialmedia{display:none!important;}.previewthumbs{height:auto!important;width:auto!important;}.previewthumbs>img{height:auto!important;width:auto!important;}';
  document.head.appendChild(style);
  window.onclick = function() {
    var img = document.querySelectorAll('#sample-image-block>a>img,.previewthumbs>img');
    for (var i = 0; i < img.length; i++) {
      img[i].src = preview_src(img[i].src);
      img[i].parentNode.onclick = function() {
        return false;
      };
    }
    window.onclick = null;
  };
})();

function preview_src(src) {
  if (src.match(/(p[a-z]\.)jpg/)) {
    return src.replace(RegExp.$1, 'pl.');
  } else if (src.match(/consumer_game/)) {
    return src.replace('js-', '-');
  } else if (src.match(/js\-([0-9]+)\.jpg$/)) {
    return src.replace('js-', 'jp-');
  } else if (src.match(/ts\-([0-9]+)\.jpg$/)) {
    return src.replace('ts-', 'tl-');
  } else if (src.match(/(\-[0-9]+\.)jpg$/)) {
    return src.replace(RegExp.$1, 'jp' + RegExp.$1);
  } else {
    return src.replace('-', 'jp-');
  }
}
