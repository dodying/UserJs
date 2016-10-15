// ==UserScript==
// @name        dmmOriginalSizeImage
// @name:zh-CN  【DMM】原始图片大小
// @namespace   https://github.com/dodying/Dodying-UserJs
// @include     http://www.dmm.co.jp/*
// @include     http://www.javlibrary.com/*
// @version     1
// @grant       none
// ==/UserScript==
if (location.href.indexOf('detail/=/cid=') >= 0 && location.href.indexOf('dmm.co.jp') >= 0) {
  var code = location.href.split(/\/|=/) [10];
  var date = document.querySelector('table.mg-b20').innerHTML.replace(/[\r\n]/g, '').replace(/ /g, '').replace(/.*日：<\/td>.*?>/, '').replace(/<.*/, '');
  var time = parseInt(document.querySelector('table.mg-b20').innerHTML.replace(/[\r\n]/g, '').replace(/ /g, '').replace(/.*時間：<\/td>.*?>/, '').replace(/<.*/, '')) / 60;
  document.querySelector('title').innerHTML = '[' + date + ']' + '[' + time.toPrecision(2) + 'H]' + code;
  //document.querySelector('meta[name="description"]').setAttribute('content', date);//更改描述
};
var img = document.querySelectorAll('#sample-image-block>a>img,.previewthumbs>img');
console.log(img);
for (var i = 0; i < img.length; i++) {
  img[i].src = preview_src(img[i].src);
  img[i].style.width = img[i].naturalWidth + 'px';
  img[i].style.height = img[i].naturalHeight + 'px';
  img[i].parentNode.style.width = img[i].naturalWidth + 'px';
  img[i].parentNode.style.height = img[i].naturalHeight + 'px';
  img[i].parentNode.onclick = function () {
    return false;
  };
}
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
