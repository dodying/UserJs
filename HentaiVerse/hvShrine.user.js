// ==UserScript==
// @name        hvShrine
// @name:zh-CN  【HV】祭坛
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http://hentaiverse.org/?s=Bazaar&ss=ss
// @version     1
// @grant       none
// @run-at      document-end
// ==/UserScript==
var id = document.querySelector('.idp').getAttribute('id').replace('item_pane', '');
if (id < 30000) {
  xhr(id, '0');
} else {
  /*
  1 One-Handed
  2 Two-Handed
  3 Staffs
  4 Shields
  5 Cloth Armor
  6 Light Armor
  7 Heavy Armor
  */
  xhr(id, '5');
}
function xhr(id, reward) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', window.location.href);
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  var parm = 'select_item=' + id + '&select_reward=' + reward;
  xhr.send(parm);
  xhr.onload = function () {
    var output = xhr.responseText.replace(/[\r\n]/g, '').replace(/.*<!-- \/stuffbox -->/, '').replace(/<.*?>/g, '').replace(/\s+/g, ' ').replace(/Exquisite/g, '5精致的').replace(/Magnificent/g, '6华丽的').replace(/Legendary/g, '7传奇的').replace(/Peerless/g, '8无双的');
    var check = confirm(output);
    if (check == true || check == false) {
      document.location = document.location;
    }
  }
}
