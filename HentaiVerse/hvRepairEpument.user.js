// ==UserScript==
// @name        hvRepairEpument
// @name:zh-CN  【HV】修复装备
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http://hentaiverse.org/?s=Forge&ss=re
// @version     1
// @grant       none
// @run-at      document-end
// ==/UserScript==
var Material = [
  {
    'name': 'Scrap Cloth',
    'code': '60051',
    'cost': '100'
  },
  {
    'name': 'Scrap Leather',
    'code': '60052',
    'cost': '100'
  },
  {
    'name': 'Scrap Metal',
    'code': '60053',
    'cost': '100'
  },
  {
    'name': 'Scrap Wood',
    'code': '60054',
    'cost': '100'
  },
  {
    'name': 'Energy Cell',
    'code': '60071',
    'cost': '200'
  },
];
var Materials_List = document.querySelectorAll('#repairall+div span');
if (Materials_List.length > 0) {
  for (var i = 0; i < Materials_List.length; i++) {
    var amount = Materials_List[i].innerHTML.replace(/x .*/, '');
    var code = Material[Materials_Name2Code(Materials_List[i].innerHTML.replace(/.*x /, ''))].code;
    Buy(code, amount, Material[i].cost);
  }
  setTimeout(function () {
    document.querySelector('#repairall div').click();
  }, 3000);
}
///////////////////////////////////////////////////////////////

function Materials_Name2Code(name) {
  switch (name) {
    case 'Scrap Cloth':
      return '0';
    case 'Scrap Leather':
      return '1';
    case 'Scrap Metal':
      return '2';
    case 'Scrap Wood':
      return '3';
    case 'Energy Cell':
      return '4';
  }
}
function Buy(code, amount, cost) {
  var xhr = 'xhr_Buy' + Math.random().toString();
  xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://hentaiverse.org/?s=Bazaar&ss=is&filter=ma');
  var parm = 'select_mode=shop_pane&select_item=' + code + '&select_count=' + amount; //item_pane卖 shop_pane买
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(parm);
  xhr.onload = function () {
    var money_last = document.querySelectorAll('.cit .fd4 div') [8].innerHTML.replace(',', '') - cost * amount;
    var arr = money_last.toString().split('');
    for (var i = arr.length - 4; i > - 1; i -= 3) arr[i] += ',';
    var money_last = arr.join('');
    document.querySelectorAll('.cit .fd4 div') [8].innerHTML = money_last;
  }
}
