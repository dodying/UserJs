// ==UserScript==
// @name        [HV]SellEquipment
// @description
// @include     http*://hentaiverse.org/
// @include     http*://hentaiverse.org/?s=Character&ss=ch
// @include     http://alt.hentaiverse.org/
// @include     http://alt.hentaiverse.org/?s=Character&ss=ch
// @version     1.01a
// @grant       none
// @author      dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
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
  const keepEqps = ['Superior', 'Exquisite', 'Magnificent', 'Legendary', 'Peerless'];
  /**
   * [func description]
   * here put in what you want to do after sell the eqps
   * the default is the page reload.
   */
  const func = function () {
    window.location.href = window.location.href;
  };
  if (!gE('#navbar')) return;
  const regexp = new RegExp(keepEqps.join('|'));
  const soldEqps = window.localStorage.soldEqps || [];
  const sellEids = [];
  post('?s=Bazaar&ss=es', (data) => {
    post(gE('#mainpane>script[src]', data).src, (data1) => {
      const json = JSON.parse(data1.match(/{.*}/)[0]);
      for (const i in json) {
        if (soldEqps.indexOf(i) === -1 && !regexp.test(json[i].t)) sellEids.push(i);
      }
      if (sellEids.length === 0) return;
      window.localStorage.soldEqps = soldEqps.concat(sellEids);
      post('?s=Bazaar&ss=es', () => {
        func();
      }, `storetoken=${gE('input[name="storetoken"]', data).value}&select_group=item_pane&select_eids=${encodeURIComponent(sellEids.join())}`);
    }, null, 'text');
  });

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
