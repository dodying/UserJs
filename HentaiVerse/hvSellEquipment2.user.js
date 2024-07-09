/* eslint-env browser */
// ==UserScript==
// @name        [HV]SellEquipment2
// @description
// @include     http*://hentaiverse.org/
// @include     http*://hentaiverse.org/?s=Character&ss=ch
// @include     http*://hentaiverse.org/?s=Battle&ss=ba&encounter=*
// @include     http://alt.hentaiverse.org/
// @include     http://alt.hentaiverse.org/?s=Character&ss=ch
// @include     http://alt.hentaiverse.org/?s=Battle&ss=ba&encounter=*
// @version     1.03
// @grant       none
// @author      dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://github.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function () {
  /**
   * [keepEqps description]
   * the Equipment that you DON'T want to sell
   * @type {Array}
   * Eg. ['Magnificent', 'Legendary', 'Peerless']
   * Eg. ['Legendary Arctic Redwood Staff of Destruction']
   */
  let keepEqps = ['Magnificent', 'Legendary', 'Peerless'];
  /**
   * [func description]
   * here put in what you want to do after sell the eqps
   */
  const func = function () {
    // grFunc();//start GrindFest
    // location.href = location.href;//page reload
  };
  /**
   * [price description]
   * here put in the price of each material
   */
  const price = [{ // Scrap
    Cloth: 0,
    Leather: 0,
    Metal: 0,
    Wood: 0,
  }, { // Low-Grade
    Cloth: 0,
    Leather: 0,
    Metal: 0,
    Wood: 0,
  }, { // Mid-Grade
    Cloth: 0,
    Leather: 0,
    Metal: 0,
    Wood: 0,
  }, { // High-Grade
    Cloth: 0,
    Leather: 0,
    Metal: 0,
    Wood: 0,
  }];
  /*
  var price = [{ //Scrap
    Cloth: 90,
    Leather: 85,
    Metal: 85,
    Wood: 90,
  }, { //Low-Grade
    Cloth: 200,
    Leather: 200,
    Metal: 200,
    Wood: 200,
  }, { //Mid-Grade
    Cloth: 600,
    Leather: 550,
    Metal: 550,
    Wood: 600,
  }, { //High-Grade
    Cloth: 20000,
    Leather: 800,
    Metal: 1200,
    Wood: 9500
  }];
  */
  /**
   *
   */
  if (!gE('#navbar')) return;
  const quality = [/Crude|Fair|Average/, /Superior/, /Exquisite/, /Magnificent|Legendary|Peerless/];
  const material = {
    '1handed': 'Metal',
    '2handed': 'Metal',
    staff: 'Wood',
    shield: 'Wood',
    acloth: 'Cloth',
    alight: 'Leather',
    aheavy: 'Metal',
  };
  const url = ['1handed', '2handed', 'staff', 'shield', 'acloth', 'alight', 'aheavy'];
  keepEqps = new RegExp(keepEqps.join('|'));
  let eids;
  const eidsSell = [];
  const eidsSalvage = {
    '1handed': [],
    '2handed': [],
    staff: [],
    shield: [],
    acloth: [],
    alight: [],
    aheavy: [],
  };
  let amountSalvage = 0;
  let eqvalue;
  let valueSell;
  let valueSalvage;
  let len = 0;
  let i; let
    j;
  let amount;
  let doSell;
  let doSalvage = 0;
  const result = {};
  let text;
  let html = '';
  url.forEach((i) => {
    post(`?s=Bazaar&ss=es&filter=${i}`, (data) => {
      checkFunc(data, i);
    });
  });

  var checkFunc = function (data, url) {
    len++;
    eids = {};
    gE('#eqshop_outer>.eqshop_pane:nth-child(1) .eqp>.iu+div[id]', 'all', data).forEach((i) => {
      if (!keepEqps.test(i.textContent)) eids[i.id.match(/\d+/)[0]] = i.textContent;
    });
    if (Object.keys(eids).length !== 0) {
      eqvalue = JSON.parse(gE('#mainpane>script[src]+script', data).text.match(/var eqvalue = (.*?);/)[1]);
      for (i in eids) {
        valueSell = eqvalue[i];
        if (quality[0].test(eids[i])) {
          amount = Math.ceil(valueSell / 100);
          valueSalvage = amount * price[0][material[url]];
        } else {
          amount = Math.ceil(valueSell / 500);
          valueSalvage = amount * price[0][material[url]];
          for (j = 1; j < quality.length; j++) {
            if (quality[j].test(eids[i])) break;
          }
          valueSalvage = valueSalvage + price[j][material[url]];
        }
        if (valueSell >= valueSalvage) {
          eidsSell.push(i);
        } else {
          amountSalvage++;
          eidsSalvage[url].push(i);
        }
      }
    }
    if (len === 7) {
      console.log(eidsSell, eidsSalvage);
      if (eidsSell.length > 0) {
        post('?s=Bazaar&ss=es', () => {
          doSell = true;
          if (doSell && doSalvage === amountSalvage) doFunc();
        }, `storetoken=${gE('input[name="storetoken"]', data).value}&select_group=item_pane&select_eids=${encodeURIComponent(eidsSell.join())}`);
      } else {
        doSell = true;
      }
      salvageFunc(eidsSalvage);
    }
  };
  var salvageFunc = function (eidsSalvage) {
    for (i in eidsSalvage) {
      if (eidsSalvage[i].length === 0) {
        delete eidsSalvage[i];
        continue;
      } else {
        break;
      }
    }
    if (Object.keys(eidsSalvage).length === 0) return;
    post(`?s=Forge&ss=sa&filter=${i}`, () => {
      countResult(gE('#messagebox>div:nth-child(2)>div>div>div>div>div', 'all'));
      eidsSalvage[i].splice(0, 1);
      doSalvage++;
      if (doSell && doSalvage === amountSalvage) {
        doFunc();
      } else {
        salvageFunc(eidsSalvage);
      }
    }, `select_item=${eidsSalvage[i][0]}`);
  };
  var doFunc = function () {
    if (amountSalvage !== 0) {
      for (i in result) {
        html = `${html}<div><div style="width:530px; height:20px"><div style="width:530px; height:17px"><div class="fc2 fac fcb" style="width:530px"><div>Salvaged ${result[i]}x ${i}</div></div></div></div></div>`;
      }
      gE('#messagebox>div:nth-child(2)').innerHTML = html;
    }
    func();
  };
  var countResult = function (obj) {
    obj.forEach((i) => {
      text = i.textContent.replace(/^Salvaged (\d+x )/, '');
      amount = i.textContent.match(/\d+/) ? i.textContent.match(/\d+/)[0] * 1 : 1;
      if (text in result) {
        result[text] += amount || 1;
      } else {
        result[text] = amount || 1;
      }
    });
  };
  const grFunc = function () {
    post('?s=Battle&ss=gr', (data) => {
      post('?s=Battle&ss=gr', () => {
        window.location.href = window.location.href;
      }, `initid=1&inittoken=${gE('img[src*="startgrindfest.png"]', data).getAttribute('onclick').match(/init_battle\(1, '(.*?)'\)/)[1]}`);
    });
  };

  function gE(ele, mode, parent) { // 获取元素
    if (typeof ele === 'object') {
      return ele;
    } if (mode === undefined && parent === undefined) {
      return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
    } if (mode === 'all') {
      return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
    } if (typeof mode === 'object' && parent === undefined) {
      return mode.querySelector(ele);
    }
  }

  function post(href, func, parm, type) { // post
    let xhr = new window.XMLHttpRequest();
    xhr.open(parm ? 'POST' : 'GET', href);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.responseType = type || 'document';
    xhr.onerror = function () {
      xhr = null;
      post(href, func, parm, type);
    };
    xhr.onload = function (e) {
      if (e.target.status >= 200 && e.target.status < 400 && typeof func === 'function') {
        const data = e.target.response;
        if (xhr.responseType === 'document' && gE('#messagebox', data)) {
          if (gE('#messagebox')) {
            gE('#csp').replaceChild(gE('#messagebox', data), gE('#messagebox'));
          } else {
            gE('#csp').appendChild(gE('#messagebox', data));
          }
        }
        func(data, e);
      }
      xhr = null;
    };
    xhr.send(parm);
  }
}());
