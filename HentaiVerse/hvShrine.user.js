// ==UserScript==
// @name        [HV]Shrine
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http*://hentaiverse.org/?s=Bazaar&ss=ss
// @include     http://alt.hentaiverse.org/?s=Bazaar&ss=ss
// @version     1.01a
// @grant       none
// @run-at      document-end
// ==/UserScript==
main();

function main() {
  var id = document.querySelector('.nosel.itemlist div').getAttribute('onclick').match(/(\d+)/)[1];
  if (id < 30000) {
    xhr(id, '0');
  } else if (id < 70000) {
    /*
  1 One-Handed
  2 Two-Handed
  3 Staffs
  4 Shields
  5 Cloth Armor
  6 Light Armor
  7 Heavy Armor
  */
    //xhr(id, '7');
  } else {
    return;
  }
}

function xhr(id, reward) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', window.location.href);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.responseType = 'document';
  var parm = 'select_item=' + id + '&select_reward=' + reward;
  xhr.send(parm);
  xhr.onload = function(e) {
    var data = e.target.response;
    var messageBoxNew = data.querySelector('#messagebox');
    messageBoxNew.innerHTML = messageBoxNew.innerHTML.replace(/Exquisite/g, '5精致的').replace(/Magnificent/g, '6华丽的').replace(/Legendary/g, '7传奇的').replace(/Peerless/g, '8无双的');
    if (document.querySelector('#messagebox')) {
      var messageBox = document.querySelector('#messagebox');
      messageBox.parentNode.replaceChild(messageBoxNew, messageBox);
    } else {
      document.body.appendChild(messageBoxNew);
    }
    var itemBoxNew = data.querySelector('#item_pane');
    var itemBox = document.querySelector('#item_pane');
    itemBox.parentNode.replaceChild(itemBoxNew, itemBox);
    if (document.querySelector('.nosel.itemlist div')) main();
  };
}
