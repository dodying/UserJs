// ==UserScript==
// @name        hvFeed
// @name:zh-CN  【HV】喂食
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http*://alt.hentaiverse.org/?s=Bazaar&ss=ml
// @include     http*://hentaiverse.org/?s=Bazaar&ss=ml
// @version     1.01c
// @grant       none
// @run-at      document-idle
// ==/UserScript==
function init() {
  var items = document.querySelectorAll('.msa .fd4 div');
  var moraleBar = document.querySelectorAll('div[style*="moralebar.png"]');
  var level;
  for (var i = 0; i < moraleBar.length; i++) {
    level = items[5 * i + 2].innerHTML;
    if (level >= 100 && !moraleBar[i].querySelector('img[src*="bar_green.png"]')) break;
  }
  feed(i + 1, moraleBar);
}
function feed(refer, moraleBar) {
  var xhr;
  xhr = new XMLHttpRequest();
  xhr.open('POST', location + '&slot=' + refer);
  var parm = 'food_action=happyhappyjoyjoy';
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.responseType = 'document';
  xhr.send(parm);
  xhr.onload = function (e) {
    var data = e.target.response;
    if (!data.querySelector('div[style*="moralebar.png"]>img[src*="bar_green.png"]')) {
      document.title = 'Happy Pill has been uesd up.';
      return;
    } else {
      document.title = 'No.' + refer + ' Monster has been fed.';
      moraleBar[refer - 1].parentNode.replaceChild(data.querySelector('div[style*="moralebar.png"]'), moraleBar[refer - 1]);
      init();
    }
  }
}
init();
