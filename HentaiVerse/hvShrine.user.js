/* eslint-env browser */
// ==UserScript==
// @name         [HV]Shrine
// @version      1.04
// @author       dodying
// @namespace    https://github.com/dodying/
// @supportURL   https://github.com/dodying/UserJs/issues
// @icon         https://github.com/dodying/UserJs/raw/master/Logo.png
// @include      http*://hentaiverse.org/?s=Bazaar&ss=ss
// @include      http://alt.hentaiverse.org/?s=Bazaar&ss=ss
// @grant        none
// @run-at       document-end
// ==/UserScript==
main();

function main() {
  const id = document.querySelector('.nosel.itemlist div').getAttribute('onclick').match(/(\d+)/)[1];
  if (id < 30000) {
    xhr(id, '0');
  } else if (id < 70000) {
    if ('equip' in window.sessionStorage && window.sessionStorage.getItem('equip').match(/^[1-7]$/)) {
      xhr(id, window.sessionStorage.getItem('equip'));
    } else {
      const equip = window.prompt('Which you want to get: \n1.One-Handed\n2.Two-Handed\n3.Staffs\n4.Shields\n5.Cloth Armor\n6.Light Armor\n7.Heavy Armor');
      if (!equip || !equip.match(/^[1-7]$/)) return;
      window.sessionStorage.setItem('equip', equip);
      xhr(id, window.sessionStorage.getItem('equip'));
    }
  } else {

  }
}

function xhr(id, reward) {
  const xhr = new window.XMLHttpRequest();
  xhr.open('POST', window.location.href);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.responseType = 'document';
  const parm = `select_item=${id}&select_reward=${reward}`;
  xhr.send(parm);
  xhr.onload = function (e) {
    const data = e.target.response;
    const messageBoxNew = data.querySelector('#messagebox');
    messageBoxNew.innerHTML = messageBoxNew.innerHTML;
    if (document.querySelector('#messagebox')) {
      const messageBox = document.querySelector('#messagebox');
      messageBox.parentNode.replaceChild(messageBoxNew, messageBox);
    } else {
      document.body.appendChild(messageBoxNew);
    }
    const itemBoxNew = data.querySelector('#item_pane');
    const itemBox = document.querySelector('#item_pane');
    itemBox.parentNode.replaceChild(itemBoxNew, itemBox);
    if (document.querySelector('.nosel.itemlist div')) main();
  };
}
