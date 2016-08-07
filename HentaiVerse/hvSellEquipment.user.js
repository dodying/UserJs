// ==UserScript==
// @name        hvSellEquipment
// @name:zh-CN  【HV】出售装备
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http://hentaiverse.org/?s=Character&ss=ch
// @include     http://hentaiverse.org/
// @version     1
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
div.style = 'color: red;position: absolute;left: ' + left + 'px;top: 30px;z-index: 999;';
div.innerHTML = '<button type="button">显示装备</button><button type="button" style="display:none">出售所有装备</button><button type="button" style="display:none">重载装备</button>';
document.body.appendChild(div);
var script = document.createElement('script');
script.innerHTML = 'function Equiplock(g, f) {var e = f.className == \'il\' || f.className == \'ilp\';var h = f.className == \'ilp\' || f.className == \'iup\';f.className = \'i\' + (e ? \'u\' : \'l\') + (h ? \'p\' : \'\');var i = get_rpcsession();xhr(MAIN_URL + \'rpc/rpc_equip.php?act=toggle_lock&eid=\' + g + \'&val=\' + (e ? 0 : 1));};function xhr(url) {var xhr = \'xhr\' + Math.random().toString();xhr = new XMLHttpRequest();xhr.open(\'GET\', url, true);xhr.send(null);};';
document.body.appendChild(script);
document.querySelector('#ShowEquip button').addEventListener('click', function () {
  if (!document.querySelector('#Equip')) {
    CreateEquipDIV();
    document.querySelector('#ShowEquip button').innerHTML = '隐藏装备';
    document.querySelectorAll('#ShowEquip button') [1].setAttribute('style', '');
    document.querySelectorAll('#ShowEquip button') [2].setAttribute('style', '');
  } else {
    var style = document.querySelector('#Equip').getAttribute('style');
    if (style.indexOf('display: none') < 0) {
      document.querySelector('#Equip').setAttribute('style', style + 'display: none;');
      document.querySelector('#ShowEquip button').innerHTML = '显示装备';
      document.querySelectorAll('#ShowEquip button') [1].setAttribute('style', 'display: none;');
      document.querySelectorAll('#ShowEquip button') [2].setAttribute('style', 'display: none;');
    } else {
      document.querySelector('#Equip').setAttribute('style', style.replace('display: none;', ''));
      document.querySelector('#ShowEquip button').innerHTML = '隐藏装备';
      document.querySelectorAll('#ShowEquip button') [1].setAttribute('style', '');
      document.querySelectorAll('#ShowEquip button') [2].setAttribute('style', '');
    }
  }
});
document.querySelectorAll('#ShowEquip button') [1].addEventListener('click', function () {
  var check = confirm('是否出售所有装备');
  if (check == true) {
    for (var i = 0; i < ReferURL.length; i++) {
      Sell(ReferURL[i]);
    }
  }
});
document.querySelectorAll('#ShowEquip button') [2].addEventListener('click', function () {
  var check = confirm('是否重载装备');
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
    var Equip_html = xhr.responseText.replace(/[\r\n]/g, '').replace(/.*?<div class="eqp/, '<div class="eqp').replace(/<\/div><div class="csps".*/, '').replace(/<div class="(eqp|eqpp)" style="width:630px"><div class="il.*?<div class="c"><\/div><\/div><\/div><\/div><\/div>/g, '').replace(/on(mouseout|mouseover)=".*?"/g, '').replace(/equips\.lock/g, 'Equiplock').replace(/Crude/g, '1粗糙的').replace(/Fair/g, '2尚可的').replace(/Average/g, '3普通的').replace(/Superior/g, '4优秀的').replace(/Exquisite/g, '<b>5精致的</b>').replace(/Magnificent/g, '<b>6华丽的</b>').replace(/Legendary/g, '<b>7传奇的</b>').replace(/Peerless/g, '<b>8无双的</b>');
    //alert(Equip_html);
    var div1 = document.createElement('div');
    div1.id = 'Equip';
    div1.style = 'position: absolute;left: 230px;top: 210px;z-index: 999;font-size: 14px;background: white;';
    div1.innerHTML = '以下是未锁定的装备' + Equip_html;
    document.body.appendChild(div1);
  }
  xhr.send(null);
}
