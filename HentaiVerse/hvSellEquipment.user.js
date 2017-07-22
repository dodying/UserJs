// ==UserScript==
// @name        hvSellEquipment
// @description
// @include     http*://hentaiverse.org/
// @include     http*://alt.hentaiverse.org/
// @include     http*://hentaiverse.org/?s=Character&ss=ch
// @include     http*://alt.hentaiverse.org/?s=Character&ss=ch
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
  var keepEqps = ['Average', 'Superior', 'Exquisite', 'Magnificent', 'Legendary', 'Peerless'];
  /**
   * [func description]
   * here put in what you want to do after sell the eqps
   * the default is the page reload.
   */
  var func = function() {
    location.href = location.href;
  };
  var regexp = new RegExp(keepEqps.join('|'));
  var soldEqps = localStorage.soldEqps || [];
  var keepEids = [];
  post('?s=Bazaar&ss=es', function(data) {
    post(gE('#mainpane>script[src]', data).src, function(data1) {
      var json = JSON.parse(data1.match(/{.*}/)[0]);
      for (var i in json) {
        if (soldEqps.indexOf(i) === -1 && !regexp.test(json[i].t)) keepEids.push(i);
      }
      if (keepEids.length === 0) return;
      localStorage.soldEqps = soldEqps.concat(keepEids);
      post('?s=Bazaar&ss=es', function() {
        func();
      }, 'storetoken=' + gE('input[name="storetoken"]', data).value + '&select_group=item_pane&select_eids=' + encodeURIComponent(keepEids.join()));
    }, null, 'text');
  });

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
