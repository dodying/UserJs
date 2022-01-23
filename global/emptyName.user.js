/* eslint-env browser */
// ==UserScript==
// @name        []emptyName
// @namespace   https://github.com/dodying/UserJs
// @version     1.1
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @noframes
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://gitee.com/dodying/userJs/raw/master/Logo.png
// @run-at      document-idle
// @include     *
// ==/UserScript==
(function () {
  const { host } = window.location;
  GM_registerMenuCommand('Add to White', () => {
    addList(host, 0);
  }, 'w');
  GM_registerMenuCommand('Add to Black', () => {
    addList(host, 1);
  }, 'b');
  const list = GM_getValue('list', {});
  if (host in list) {
    if (list[host] === 1) document.title = '';
    return;
  }
  const blackWord = ['性', '父', '母', '爸', '妈', '姊', '姐', '妹', '哥', '兄', '弟', '女儿', '姑', '嫂', '舅', '丰满', '鸡巴', '柔嫩', '女儿', '乱伦', '乳', '屁股', '淫', '欲', '色', '成人'];
  const t = document.title;
  let i;
  for (i = 0; i < blackWord.length; i++) {
    if (t.match(blackWord[i])) {
      addList(host, 1);
      break;
    }
  }

  function addList(host, status) {
    const list = GM_getValue('list', {});
    list[host] = status;
    GM_setValue('list', list);
    if (status) document.title = '';
  }
}());
