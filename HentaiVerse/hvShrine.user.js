// ==UserScript==
// @name         [HV]Shrine
// @version      1.02
// @author       dodying
// @namespace    https://github.com/dodying/
// @supportURL   https://github.com/dodying/UserJs/issues
// @icon         https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @include      http*://hentaiverse.org/?s=Bazaar&ss=ss
// @include      http://alt.hentaiverse.org/?s=Bazaar&ss=ss
// @grant        none
// @run-at       document-end
// ==/UserScript==
main();

function main() {
  var id = document.querySelector('.nosel.itemlist div').getAttribute('onclick').match(/(\d+)/)[1];
  if (id < 30000) {
    xhr(id, '0');
  } else if (id < 70000) {
    if ('equip' in sessionStorage && sessionStorage.getItem('equip').match(/^[1-7]$/)) {
      xhr(id, sessionStorage.getItem('equip'));
    } else {
      let equip = prompt('Which you want to get: \n1.One-Handed\n2.Two-Handed\n3.Staffs\n4.Shields\n5.Cloth Armor\n6.Light Armor\n7.Heavy Armor');
      if (!equip.match(/^[1-7]$/)) return;
      sessionStorage.setItem('equip', equip);
      xhr(id, sessionStorage.getItem('equip'));
    }
  } else {
    return;
  }
}

function xhr(id, reward) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', location.href);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.responseType = 'document';
  var parm = 'select_item=' + id + '&select_reward=' + reward;
  xhr.send(parm);
  xhr.onload = function(e) {
    var data = e.target.response;
    var messageBoxNew = data.querySelector('#messagebox');
    messageBoxNew.innerHTML = messageBoxNew.innerHTML;
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
