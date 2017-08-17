// ==UserScript==
// @name        [HV]SellEquipment2
// @description
// @include     http*://hentaiverse.org/
// @include     http*://hentaiverse.org/?s=Character&ss=ch
// @include     http://alt.hentaiverse.org/
// @include     http://alt.hentaiverse.org/?s=Character&ss=ch
// @version     1.01
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function() {
  /**
   * [keepEqps description]
   * the Equipment that you DON'T want to sell
   * @type {Array}
   * Eg. ['Magnificent', 'Legendary', 'Peerless']
   * Eg. ['Legendary Arctic Redwood Staff of Destruction']
   */
  var keepEqps = ['Magnificent', 'Legendary', 'Peerless'];
  /**
   * [func description]
   * here put in what you want to do after sell the eqps
   */
  var func = function() {
    //grFunc();//start GrindFest
    //location.href = location.href;//page reload
  };
  /**
   * [price description]
   * here put in the price of each material
   */
  var price = [{ //Scrap
    Cloth: 0,
    Leather: 0,
    Metal: 0,
    Wood: 0,
  }, { //Low-Grade
    Cloth: 0,
    Leather: 0,
    Metal: 0,
    Wood: 0,
  }, { //Mid-Grade
    Cloth: 0,
    Leather: 0,
    Metal: 0,
    Wood: 0,
  }, { //High-Grade
    Cloth: 0,
    Leather: 0,
    Metal: 0,
    Wood: 0
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
  var quality = [/Crude|Fair|Average/, /Superior/, /Exquisite/, /Magnificent|Legendary|Peerless/];
  var material = {
    '1handed': 'Metal',
    '2handed': 'Metal',
    staff: 'Wood',
    shield: 'Wood',
    acloth: 'Cloth',
    alight: 'Leather',
    aheavy: 'Metal',
  };
  var url = ['1handed', '2handed', 'staff', 'shield', 'acloth', 'alight', 'aheavy'];
  keepEqps = new RegExp(keepEqps.join('|'));
  var eids;
  var eidsSell = [];
  var eidsSalvage = {
    '1handed': [],
    '2handed': [],
    staff: [],
    shield: [],
    acloth: [],
    alight: [],
    aheavy: []
  };
  var amountSalvage = 0;
  var eqvalue;
  var valueSell;
  var valueSalvage;
  var len = 0;
  var i, j;
  var amount;
  var doSell;
  var doSalvage = 0;
  var result = {};
  var text;
  var html = '';
  url.forEach(function(i) {
    post('?s=Bazaar&ss=es&filter=' + i, function(data) {
      checkFunc(data, i);
    });
  });

  var checkFunc = function(data, url) {
    len++;
    eids = {};
    gE('#eqshop_outer>.eqshop_pane:nth-child(1) .eqp>.iu+div[id]', 'all', data).forEach(function(i) {
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
          valueSalvage += price[j][material[url]];
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
        post('?s=Bazaar&ss=es', function() {
          doSell = true;
          if (doSell && doSalvage === amountSalvage) doFunc();
        }, 'storetoken=' + gE('input[name="storetoken"]', data).value + '&select_group=item_pane&select_eids=' + encodeURIComponent(eidsSell.join()));
      } else {
        doSell = true;
      }
      salvageFunc(eidsSalvage);
    }
  };
  var salvageFunc = function(eidsSalvage) {
    for (i in eidsSalvage) {
      if (eidsSalvage[i].length === 0) {
        delete eidsSalvage[i];
        continue;
      } else {
        break;
      }
    }
    if (Object.keys(eidsSalvage).length === 0) return;
    post('?s=Forge&ss=sa&filter=' + i, function() {
      countResult(gE('#messagebox>div:nth-child(2)>div>div>div>div>div', 'all'));
      eidsSalvage[i].splice(0, 1);
      doSalvage++;
      if (doSell && doSalvage === amountSalvage) {
        doFunc();
      } else {
        salvageFunc(eidsSalvage);
      }
    }, 'select_item=' + eidsSalvage[i][0]);
  };
  var doFunc = function() {
    if (amountSalvage !== 0) {
      for (i in result) {
        html += '<div><div style="width:530px; height:20px"><div style="width:530px; height:17px"><div class="fc2 fac fcb" style="width:530px"><div>Salvaged ' + result[i] + 'x ' + i + '</div></div></div></div></div>';
      }
      gE('#messagebox>div:nth-child(2)').innerHTML = html;
    }
    func();
  };
  var countResult = function(obj) {
    obj.forEach(function(i) {
      text = i.textContent.replace(/^Salvaged (\d+x )/, '');
      amount = i.textContent.match(/\d+/) ? i.textContent.match(/\d+/)[0] * 1 : 1;
      if (text in result) {
        result[text] += amount || 1;
      } else {
        result[text] = amount || 1;
      }
    });
  };
  var grFunc = function() {
    post('?s=Battle&ss=gr', function(data) {
      post('?s=Battle&ss=gr', function() {
        location.href = location.href;
      }, 'initid=1&inittoken=' + gE('img[src*="startgrindfest.png"]', data).getAttribute('onclick').match(/init_battle\(1, '(.*?)'\)/)[1]);
    });
  };

  function gE(ele, mode, parent) { //获取元素
    if (typeof ele === 'object') {
      return ele;
    } else if (mode === undefined && parent === undefined) {
      return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
    } else if (mode === 'all') {
      return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
    } else if (typeof mode === 'object' && parent === undefined) {
      return mode.querySelector(ele);
    }
  }

  function cE(name) { //创建元素
    return document.createElement(name);
  }

  function post(href, func, parm, type) { //post
    var xhr = new XMLHttpRequest();
    xhr.open(parm ? 'POST' : 'GET', href);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.responseType = type || 'document';
    xhr.onerror = function() {
      xhr = null;
      post(href, func, parm, type);
    };
    xhr.onload = function(e) {
      if (e.target.status >= 200 && e.target.status < 400 && typeof func === 'function') {
        var data = e.target.response;
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
})();
