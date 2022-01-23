/* eslint-env browser */
// ==UserScript==
// @name        [HV]Challenge
// @description
// @include
// @version     1.01
// @include     http*://hentaiverse.org/*
// @include     http://alt.hentaiverse.org/*
// @author      dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://gitee.com/dodying/userJs/raw/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function () {
  if (!gE('#navbar')) return;
  const challenges = ['Normal', 'Hard', 'Nightmare', 'Hell', 'Nintendo', 'IWBTH', 'PFUDOR'];
  const options = challenges.map((i, j) => `<option value="${j + 1}">${i}</option>`);
  const init = function () {
    gE('#level_readout>div.fc4.far.fcb>div').onclick = function (e) {
      e.target.onclick = null;
      const text = e.target.textContent.split(' ');
      e.target.innerHTML = `<select style="position:relative;top:-5px;">${options}</select> ${text[1]}`;
      e.target.querySelector('select').value = challenges.indexOf(text[0]) + 1;
      e.target.querySelector('select').onchange = function (e1) {
        changeChallenge(e1.target.value, () => {
          gE('#level_readout>div.fc4.far.fcb>div').textContent = `${challenges[e1.target.value - 1]} ${text[1]}`;
          init();
        });
      };
    };
  };
  init();

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

  function changeChallenge(level, func) { // level=1-7
    post('?s=Character&ss=se', (data) => {
      const settings = [...gE('#settings_outer input,#settings_outer select', 'all', data)].map((i) => {
        if (i.type === 'radio' || i.type === 'checkbox') {
          return i.checked ? `${i.name}=${i.value}` : '';
        }
        return `${i.name}=${i.value}`;
      }).filter((i) => i).join('&');
      post('?s=Character&ss=se', () => {
        func();
      }, settings.replace(/difflevel=\d+/, `difflevel=${level}ch`));
    });
  }
}());
