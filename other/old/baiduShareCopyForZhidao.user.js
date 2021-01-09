// ==UserScript==
// @name        baiduShareCopyForZhidao
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【百度云】分享-答题专用
// @description:zh-CN
// @include     http://pan.baidu.com/disk/home*
// @version     1.02
// @grant       GM_setClipboard
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// ==/UserScript==
var interval = setInterval(function () {
  if (document.querySelector('input.share-url')) {
    var inputUrl = document.querySelector('input.share-url');
    inputUrl.oncopy = function (e) {
      e.preventDefault();
      var sharedName = document.querySelector('.item-active>.file-name>.text>a.filename').innerText;
      var sharedSize = document.querySelector('.item-active>.file-size').innerText;
      var sharedUpdateTime = document.querySelector('.item-active>.ctime').innerText;
      var inputPwd = document.querySelector('.share-password');
      var clip = '链接:' + inputUrl.value;
      if (inputPwd.value !== '') { //无提取密码
        clip += ' 密码:' + inputPwd.value;
      }
      clip = '文件名称:' + sharedName + '\n文件大小:' + sharedSize + '\n上传时间:' + sharedUpdateTime + '\n' + clip;
      var word = '请享用。\n如无误，请及时采纳，谢谢。（￣︶￣）/\n';
      clip = word + clip;
      GM_setClipboard(clip);
    }
    clearInterval(interval);
  }
}, 200);
