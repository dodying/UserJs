// ==UserScript==
// @name        baiduShareCopyForZhidao
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【百度云】分享-答题专用
// @description:zh-CN  
// @include     http://pan.baidu.com/disk/home*
// @version     1
// @grant       GM_setClipboard
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
var interval = setInterval(function () {
  if (document.querySelector('input.share-url')) {
    var inputUrl = document.querySelector('input.share-url');
    inputUrl.oncopy = function (e) {
      e.preventDefault();
      var inputPwd = document.querySelector('.share-password');
      var clip = '链接:' + inputUrl.value;
      if (inputPwd.value !== '') { //无提取密码
        clip += ' 密码:' + inputPwd.value;
      }
      var word = '请享用。\n如无误，请及时采纳，谢谢。☆（ゝω・）v\n';
      clip = word + clip;
      GM_setClipboard(clip);
    }
    clearInterval(interval);
  }
}, 200);