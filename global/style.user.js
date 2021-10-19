/* eslint-env browser */
// ==UserScript==
// @name        []style
// @version     1.1.0
// @grant       none
// @author      dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// @noframes
// @include     *
// ==/UserScript==
(function () {
  const id = `style_${Math.random()}`;
  const init = function () {
    if (!document.getElementById(id)) {
      const rule = [
        {
          url: '.*',
          style: [
            'a:visited{color:rgb(35,173,173)!important;}',
            '::-webkit-scrollbar{width:9px;height:9px}::-webkit-scrollbar-track-piece{background-color:transparent}body::-webkit-scrollbar-track-piece{background-color:white}::-webkit-scrollbar-thumb{background-color:#7d7d7d;border-radius:3px;min-height:10vh;}::-webkit-scrollbar-thumb:hover{background-color:#999}::-webkit-scrollbar-thumb:active{background-color:#666}',
          ],
        },
      ];
      const style = rule.filter((i) => window.location.href.match(i.url)).map((i) => [].concat(i.style).join('\n'));
      const ele = document.createElement('style');
      ele.id = id;
      ele.textContent = style.join('\n');
      document.head.appendChild(ele);
    }
  };

  init();
  const observer = new window.MutationObserver(init);
  observer.observe(document.head, {
    childList: true,
    subtree: true,
  });
}());
