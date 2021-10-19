// ==UserScript==
// @name        GithubCopyCodeInIssues
// @name:zh-CN  【GitHub】复制Issues里的代码
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description:zh-CN
// @include     https://github.com/*/*/issues/*
// @version     1
// @grant       GM_setClipboard
// @run-at      document-idle
// ==/UserScript==
const code = document.querySelectorAll('pre,code');
// console.log(code);
for (let i = 0; i < code.length; i++) {
  const copy_div = document.createElement('button');
  copy_div.innerHTML = '复制';
  copy_div.onclick = function () {
    const Code = this.nextElementSibling.innerText;
    console.log(Code);
    GM_setClipboard(Code);
  };
  code[i].parentNode.insertBefore(copy_div, code[i]);
}
