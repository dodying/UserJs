// ==UserScript==
// @name        baiduShareCopyForZhidao
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【百度云】分享-答题专用
// @description:zh-CN
// @include     http://pan.baidu.com/disk/home*
// @version     1.03
// @grant       GM_setClipboard
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// ==/UserScript==
var interval = setInterval(() => {
  if (document.querySelector('input.share-url')) {
    const inputUrl = document.querySelector('input.share-url');
    inputUrl.oncopy = function (e) {
      e.preventDefault();
      const sharedName = document.querySelector('.item-active>.file-name>.text>a.filename').innerText;
      const sharedSize = document.querySelector('.item-active>.file-size').innerText;
      const sharedUpdateTime = document.querySelector('.item-active>.ctime').innerText;
      const inputPwd = document.querySelector('.share-password');
      let clip = `链接:${inputUrl.value}`;
      if (inputPwd.value !== '') { // 无提取密码
        clip = `${clip} 密码:${inputPwd.value}`;
      }
      clip = `文件名称:${sharedName}\n文件大小:${sharedSize}\n上传时间:${sharedUpdateTime}\n${clip}`;
      const word = '请享用。\n如无误，请及时采纳，谢谢。（￣︶￣）/\n';
      clip = word + clip;
      GM_setClipboard(clip);
    };
    clearInterval(interval);
  }
}, 200);
