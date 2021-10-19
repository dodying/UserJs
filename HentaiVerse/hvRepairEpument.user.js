// ==UserScript==
// @name        [HV]RepairEpument
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http*://hentaiverse.org/?s=Forge&ss=re*
// @include     http://alt.hentaiverse.org/?s=Forge&ss=re*
// @version     1.00
// @grant       none
// @run-at      document-end
// ==/UserScript==
(function () {
  const Material = [
    {
      name: 'Scrap Cloth',
      code: '60051',
      cost: '100',
    },
    {
      name: 'Scrap Leather',
      code: '60052',
      cost: '100',
    },
    {
      name: 'Scrap Metal',
      code: '60053',
      cost: '100',
    },
    {
      name: 'Scrap Wood',
      code: '60054',
      cost: '100',
    },
    {
      name: 'Energy Cell',
      code: '60071',
      cost: '200',
    },
  ];
  const materialsList = document.querySelectorAll('#repairall+div span');
  const xhr = new window.XMLHttpRequest();
  xhr.open('GET', `${window.location.origin}/?s=Bazaar&ss=is&filter=ma`);
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.responseType = 'document';
  xhr.onload = function () {
    const token = xhr.response.querySelector('input[name="storetoken"]').value;
    if (materialsList.length > 0) {
      for (let i = 0; i < materialsList.length; i++) {
        const amount = materialsList[i].innerHTML.match(/\d+/)[0];
        const { code } = Material[materialsName2Code(materialsList[i].innerHTML.match(/\d+x (.*)/)[1])];
        Buy(code, amount, Material[i].cost, token);
      }
      setTimeout(() => {
        document.querySelector('#repairall div').click();
      }, 3000);
    }
  };
  xhr.send(null);
}());
/// ////////////////////////////////////////////////////////////
function materialsName2Code(name) {
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
function Buy(code, amount, cost, token) {
  let xhr = `xhr_Buy${Math.random().toString()}`;
  xhr = new window.XMLHttpRequest();
  xhr.open('POST', `${window.location.origin}/?s=Bazaar&ss=is&filter=ma`);
  const parm = `storetoken=${token}&select_mode=shop_pane&select_item=${code}&select_count=${amount}`; // item_pane卖 shop_pane买
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(parm);
  xhr.onload = function () {
  };
}
