// ==UserScript==
// @name        []Search
// @description
// @version     1.00
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @include     https://btdb.to/*
// ==/UserScript==
(function() {
  var keywords = {
    'btdb.to': ['720P', '字幕', 'Thz.la']
  };
  var data = {
    'btdb.to': {
      match: 'https:\/\/btdb.to\/q\/',
      input: '#search-input',
      button: '.search-btn',
      after: '.toolbar'
    }
  };
  var rule, i, re;
  for (i in data) {
    re = new RegExp(data[i].match, 'i');
    if (re.test(location.href)) {
      rule = data[i];
      break;
    }
  }
  if (!rule) return;
  var bar = cE('div');
  keywords[i].forEach(function(keyword) {
    let a = cE('a');
    a.textContent = keyword;
    a.href = 'javascript:;';
    a.onclick = updateValue;
    bar.appendChild(a);
  });
  if ('append' in rule) {
    gE(rule.append).appendChild(bar);
  } else if ('prepend' in rule) {
    gE(rule.prepend).insertBefore(bar, gE(rule.prepend).children[0]);
  } else if ('before' in rule) {
    gE(rule.before).parentNode.insertBefore(bar, gE(rule.before));
  } else if ('after' in rule) {
    gE(rule.after).parentNode.insertBefore(bar, gE(rule.after).nextSibling);
  }

  function updateValue(e) {
    var text = e.target.textContent;
    var inputs = gE(rule.input).value.split(' ');
    if (inputs.indexOf(text) >= 0) {
      inputs.splice(inputs.indexOf(text), 1);
    } else {
      inputs.push(text);
    }
    gE(rule.input).value = inputs.join(' ');
    setTimeout(function() {
      gE(rule.button).click();
    }, 100);
  }
})();

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
