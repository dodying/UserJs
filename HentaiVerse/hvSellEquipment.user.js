// ==UserScript==
// @name        hvSellEquipment
// @name:zh-CN  【HV】出售装备
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http://hentaiverse.org/?s=Character&ss=ch
// @include     http://hentaiverse.org/
// @version     1.00a
// @grant       none
// @run-at      document-end
// ==/UserScript==
if (document.querySelector('#togpane_log')) {
  return;
}
var ReferURL = [
  '1handed',
  '2handed',
  'staff',
  'shield',
  'acloth',
  'alight',
  'aheavy'
];
var left = document.documentElement.clientWidth - 80;
var div = document.createElement('div');
div.id = 'ShowEquip';
div.style = 'color: red;position: fixed;right: 5px;top: 30px;z-index: 999;';
div.innerHTML = '<button type="button">Show EQPT</button><br><button type="button" style="display:none">SELL All</button><br><button type="button" style="display:none">Reload</button>';
document.body.appendChild(div);
var script = document.createElement('script');
script.innerHTML = 'function Equiplock(g, f) {var e = f.className == \'il\' || f.className == \'ilp\';var h = f.className == \'ilp\' || f.className == \'iup\';f.className = \'i\' + (e ? \'u\' : \'l\') + (h ? \'p\' : \'\');var i = get_rpcsession();xhr(MAIN_URL + \'rpc/rpc_equip.php?act=toggle_lock&eid=\' + g + \'&val=\' + (e ? 0 : 1));};function xhr(url) {var xhr = \'xhr\' + Math.random().toString();xhr = new XMLHttpRequest();xhr.open(\'GET\', url, true);xhr.send(null);};';
document.body.appendChild(script);
document.querySelector('#ShowEquip button').addEventListener('click', function () {
  if (!document.querySelector('#Equip')) {
    CreateEquipDIV();
    document.querySelector('#ShowEquip button').innerHTML = 'Hide EQPT';
    document.querySelectorAll('#ShowEquip button') [1].setAttribute('style', '');
    document.querySelectorAll('#ShowEquip button') [2].setAttribute('style', '');
  } else {
    var style = document.querySelector('#Equip').getAttribute('style');
    if (style.indexOf('display: none') < 0) {
      document.querySelector('#Equip').setAttribute('style', style + 'display: none;');
      document.querySelector('#ShowEquip button').innerHTML = 'Show EQPT';
      document.querySelectorAll('#ShowEquip button') [1].setAttribute('style', 'display: none;');
      document.querySelectorAll('#ShowEquip button') [2].setAttribute('style', 'display: none;');
    } else {
      document.querySelector('#Equip').setAttribute('style', style.replace('display: none;', ''));
      document.querySelector('#ShowEquip button').innerHTML = 'Hide EQPT';
      document.querySelectorAll('#ShowEquip button') [1].setAttribute('style', '');
      document.querySelectorAll('#ShowEquip button') [2].setAttribute('style', '');
    }
  }
});
document.querySelectorAll('#ShowEquip button') [1].addEventListener('click', function () {
  var check = confirm('Whether to SELL all equipments?\nYou can lock the EQPT you dont want to sell in left panel.');
  if (check == true) {
    for (var i = 0; i < ReferURL.length; i++) {
      Sell(ReferURL[i]);
    }
  }
});
document.querySelectorAll('#ShowEquip button') [2].addEventListener('click', function () {
  var check = confirm('Whether to reload equipments?');
  if (check == true) {
    var temp = document.querySelector('#Equip');
    document.body.removeChild(temp);
    CreateEquipDIV();
  }
});
///////////////////////////////////////////////////////////////
function Sell(refer) {
  var xhr = 'xhr_Sell' + Math.random().toString();
  xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://hentaiverse.org/?s=Bazaar&ss=es&filter=' + refer);
  var parm = 'sell_all=1dca93d84fffb8614cb251bbe9a4e37571c7ff0c';
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(parm);
}
function CreateEquipDIV() {
  var xhr = 'xhr_CreateEquipDIV' + Math.random().toString();
  xhr = new XMLHttpRequest();
  xhr.open('GET', 'http://hentaiverse.org/?s=Character&ss=in');
  xhr.onload = function () {
    var Equip_html = xhr.responseText.replace(/[\r\n]/g, '').replace(/.*?<div class="eqp/, '<div class="eqp').replace(/<\/div><div class="csps".*/, '').replace(/<div class="(eqp|eqpp)" style="width:630px"><div class="il.*?<div class="c"><\/div><\/div><\/div><\/div><\/div>/g, '').replace(/on(mouseout|mouseover)=".*?"/g, '').replace(/equips\.lock/g, 'Equiplock').replace(/Crude/g, '1-☆').replace(/Fair/g, '2-★').replace(/Average/g, '3-★☆').replace(/Superior/g, '4-★★').replace(/Exquisite/g, '5-★★☆').replace(/Magnificent/g, '<b>6-★★★</b>').replace(/Legendary/g, '<b>7-★★★☆</b>').replace(/Peerless/g, '<b>8-★★★★</b>');
    //alert(Equip_html);
    var div1 = document.createElement('div');
    div1.id = 'Equip';
    div1.style = 'position: absolute;left: 230px;top: 210px;z-index: 999;font-size: 14px;background: white;';
    div1.innerHTML = 'The following are equipments which is not locked' + Equip_html;
    document.body.appendChild(div1);
  }
  xhr.send(null);
}
