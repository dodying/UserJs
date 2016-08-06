// ==UserScript==
// @name        hvBuyItem
// @name:zh-CN  【HV】补充物品
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http://hentaiverse.org/?s=Bazaar&ss=is
// @version     1
// @grant       none
// @run-at      document-end
// ==/UserScript==
var Item = [
  {
    'name': 'Health Draught',
    'name_cn': '初级HP药水',
    'code': '11191',
    'cost': '25',
    'amount': '100'
  },
  {
    'name': 'Health Potion',
    'name_cn': '中级HP药水',
    'code': '11195',
    'cost': '50',
    'amount': '100'
  },
  {
    'name':'Health Elixir',
    'name_cn': '高级HP药水',
    'code': '11199',
    'cost': '500',
    'amount': '100'
  },
  {
    'name': 'Mana Draught',
    'name_cn': '初级MP药水',
    'code': '11291',
    'cost': '50',
    'amount': '100'
  },
  {
    'name': 'Mana Potion',
    'name_cn': '中级MP药水',
    'code': '11295',
    'cost': '100',
    'amount': '100'
  },
  {
    'name':'Mana Elixir',
    'name_cn': '高级MP药水',
    'code': '11299',
    'cost': '1000',
    'amount': '100'
  },
  {
    'name': 'Spirit Draught',
    'name_cn': '初级SP药水',
    'code': '11391',
    'cost': '50',
    'amount': '100'
  },
  {
    'name': 'Spirit Potion',
    'name_cn': '中级SP药水',
    'code': '11395',
    'cost': '100',
    'amount': '100'
  },
  {
    'name':'Spirit Elixir',
    'name_cn': '高级SP药水',
    'code': '11399',
    'cost': '1000',
    'amount': '100'
  },
  {
    'name': 'Infusion of Flames',
    'name_cn': '魔药-火',
    'code': '12101',
    'cost': '200',
    'amount': '100'
  },
  {
    'name': 'Scroll of Life',
    'name_cn': '卷轴-生命',
    'code': '13221',
    'cost': '300',
    'amount': '100'
  },
  {
    'name': 'Scroll of Swiftness',
    'name_cn': '卷轴-急速',
    'code': '13101',
    'cost': '200',
    'amount': '100'
  },
  {
    'name': 'Scroll of Protection',
    'name_cn': '卷轴-防护',
    'code': '13111',
    'cost': '200',
    'amount': '100'
  },
  {
    'name': 'Scroll of Shadows',
    'name_cn': '卷轴-影砂',
    'code': '13211',
    'cost': '200',
    'amount': '100'
  },
];
for (var i = 0; i < Item.length; i++) {
  var ItemCount = document.querySelector('.idp[onmouseover*="' + Item[i].name + '"]').parentNode.parentNode.querySelector('.ii>.fd2>div').innerHTML;
  var select_count = Item[i].amount - ItemCount;
  if (select_count > 0) {
    Buy(Item[i].code, Item[i].amount - ItemCount, Item[i].name_cn, Item[i].amount, Item[i].cost)
  } else {
    var div = 'div' + Math.random().toString();
    var div = document.createElement('div');
    div.innerHTML = Item[i].name_cn + '已充足。';
    document.querySelector('.clb').appendChild(div);
  }
}
function Buy(code, select_count, name_cn, amount, cost) {
  var xhr = 'xhr_Buy' + Math.random().toString();
  xhr = new XMLHttpRequest();
  xhr.open('POST', window.location.href);
  var parm = 'select_mode=shop_pane&select_item=' + code + '&select_count=' + select_count; //item_pane卖 shop_pane买
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(parm);
  xhr.onload = function () {
    var div_Buy = 'div_Buy' + Math.random().toString();
    var div_Buy = document.createElement('div');
    div_Buy.innerHTML = '已购买[' + name_cn + '][' + select_count + ']瓶';
    document.querySelector('.clb').appendChild(div_Buy);
    var money_last = document.querySelectorAll('.cit .fd4 div') [8].innerHTML.replace(',', '') - cost * select_count;
    var arr = money_last.toString().split('');
    for (var i = arr.length - 4; i > - 1; i -= 3) arr[i] += ',';
    var money_last = arr.join('');
    document.querySelectorAll('.cit .fd4 div') [8].innerHTML = money_last;
  }
}
