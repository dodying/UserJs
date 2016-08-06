// ==UserScript==
// @name        hvAutoFeed
// @name:zh-CN  【HV】自动喂食
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http://hentaiverse.org/?s=Bazaar&ss=ml
// @version     1
// @grant       none
// @run-at      document-idle
// ==/UserScript==
var Morale_Bar = document.querySelectorAll('div[style="position:absolute; top:2px; left:0px; z-index:2; height:22px; width:200px; background-image:url(/y/monster/moralebar.png)"]');
for (var i = 0; i < Morale_Bar.length; i++) {
  var level = document.querySelectorAll('.msa .fd4 div') [5 * i + 2].innerHTML;
  if (level >= 100 && (Morale_Bar[i].querySelector('img[src*="bar_yellow.png"]') || Morale_Bar[i].querySelector('img[src*="bar_red.png"]'))) {
    xhr(i + 1);
  }
}
function xhr(refer) {
  xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://hentaiverse.org/?s=Bazaar&ss=ml&slot=' + refer);
  var parm = 'food_action=happyhappyjoyjoy';
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(parm);
  xhr.onload = function () {
    document.location = document.location;
  }
}
