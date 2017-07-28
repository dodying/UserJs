// ==UserScript==
// @name        hvBazaarList
// @name:zh-CN  【HV】购物清单
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN
// @include     http*://hentaiverse.org/?s=Bazaar&ss=is*
// @include     http*://alt.hentaiverse.org/?s=Bazaar&ss=is*
// @version     1.02
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function() {
  //style
  var style = gE('head').appendChild(cE('style'));
  style.textContent = '#listBox{position:absolute;z-index:9;background-color:#EDEBDF;border:1px solid black;display:none;}#showText{position:absolute;top:28px;right:2px;}';
  //listBox
  var listBox = gE('body').appendChild(cE('div'));
  listBox.id = 'listBox';
  listBox.innerHTML = [
    'ID:<input name="itemId"type="text"><br>',
    'Name:<input name="itemName"type="text"><br>',
    'Amount:<input name="itemAmount"type="text" placeholder="1000"><br>',
    'Credit:<input name="itemCredit"type="text" placeholder="0"><br>',
    'Round:<input name="itemFix"type="text" placeholder="100"><br>',
    '<button id="listDel">REMOVE</button>',
    '<button id="listSave">SAVE</button>'
  ].join('');
  gE('#listDel', listBox).onclick = function() {
    var info = getValue('BazaarList', true);
    if (!info) return;
    delete info[gE('input[name=itemId]', listBox).value];
    setValue('BazaarList', info);
    listBox.style.display = 'none';
  };
  gE('#listSave', listBox).onclick = function() {
    var info = getValue('BazaarList', true) || {};
    info[gE('input[name=itemId]', listBox).value] = {
      name: gE('input[name=itemName]', listBox).value,
      amount: gE('input[name=itemAmount]', listBox).value * 1 || 1000,
      credit: gE('input[name=itemCredit]', listBox).value * 1,
      fix: gE('input[name=itemFix]', listBox).value * 1 || 100
    };
    setValue('BazaarList', info);
    listBox.style.display = 'none';
  };
  //Event
  gE('#itshop_outer').onclick = function(e) {
    var target = e.target;
    if (target.getAttribute('onmouseout') !== 'common.hide_popup_box()') return;
    if (target.style.color !== 'rgb(0, 48, 203)') {
      listBox.style.display = 'none';
    } else {
      var id = target.getAttribute('onclick').match(/\d+/)[0] * 1;
      var info = getValue('BazaarList', true) || {};
      gE('input[name=itemId]', listBox).value = id;
      if (id in info) {
        gE('input[name=itemName]', listBox).value = info[id].name;
        gE('input[name=itemAmount]', listBox).value = info[id].amount;
        gE('input[name=itemCredit]', listBox).value = info[id].credit;
        gE('input[name=itemFix]', listBox).value = info[id].fix;
      } else {
        gE('input[name=itemName]', listBox).value = target.textContent;
        gE('input[name=itemAmount]', listBox).value = '';
        gE('input[name=itemCredit]', listBox).value = '';
        gE('input[name=itemFix]', listBox).value = '';
      }
      listBox.style.display = 'block';
      listBox.style.left = e.pageX - e.offsetX + target.offsetWidth + 'px';
      listBox.style.top = e.pageY - e.offsetY + target.offsetHeight + 'px';
    }
  };
  //显示结果
  var showText = gE('body').appendChild(cE('button'));
  showText.id = 'showText';
  showText.textContent = 'Generate List';
  showText.onclick = function() {
    var info = getValue('BazaarList', true);
    if (!info) return;
    //新窗口
    var OpenWindow = window.open('', 'newwin', 'height=250,width=250,toolbar=no,menubar=no');
    var doc = OpenWindow.document;
    var style2 = gE('head', doc).appendChild(cE('style'));
    style2.textContent = '*{margin:5px;text-align:center;}textarea{width:100%;height:300px;text-align:left;}input,button{}';
    var bazaarBox = gE('body', doc).appendChild(cE('div'));
    var noteUser = bazaarBox.appendChild(cE('span'));
    noteUser.textContent = 'To: ';
    var mmUser = bazaarBox.appendChild(cE('input'));
    if ('BazaarUser' in localStorage) mmUser.value = localStorage.BazaarUser;
    bazaarBox.appendChild(cE('br'));
    var noteSubject = bazaarBox.appendChild(cE('span'));
    noteSubject.textContent = 'Subject: ';
    var mmSubject = bazaarBox.appendChild(cE('input'));
    if ('BazaarSubject' in localStorage) mmSubject.value = localStorage.BazaarSubject;
    bazaarBox.appendChild(cE('br'));
    var mmBody = bazaarBox.appendChild(cE('textarea'));
    bazaarBox.appendChild(cE('br'));
    var toggleBtn = bazaarBox.appendChild(cE('button'));
    toggleBtn.textContent = '价格';
    var sendBtn = bazaarBox.appendChild(cE('button'));
    sendBtn.textContent = '发送';
    var html = ['', ''];
    console.log(info);
    var itemPane, amount, i, credit;
    var creditAll = 0;
    for (i in info) {
      itemPane = gE('#item_pane div[onclick*="' + i + '"]');
      if (itemPane) {
        amount = info[i].amount * 1 - itemPane.parentNode.nextSibling.textContent * 1;
        if (amount <= 0) continue;
        if (info[i].fix) amount = (Math.floor(amount / info[i].fix) + 1) * info[i].fix;
      } else {
        amount = info[i].amount;
      }
      credit = amount * (info[i].credit || 0);
      creditAll += credit;
      html[0] += amount + 'x ' + info[i].name + ' @' + (info[i].credit) + ' = ' + credit + '\n';
      html[1] += amount + 'x ' + info[i].name + '\n';
    }
    html[0] += '- - - - -\nAll: ' + creditAll + '\n';
    html[1] += '- - - - -\n';
    mmBody.value = html[0];
    toggleBtn.onclick = function() {
      [html[0], html[1]] = [html[1], html[0]];
      mmBody.value = html[0];
    };
    sendBtn.onclick = function() {
      post('?s=Bazaar&ss=mm&filter=new', function(data) {
        var token = gE('input[name="mmtoken"]', data).value;
        post('?s=Bazaar&ss=mm&filter=new', function() {
          localStorage.BazaarUser = mmUser.value;
          localStorage.BazaarSubject = mmSubject.value;
          OpenWindow.close();
        }, 'mmtoken=' + token + '&action=send&action_value=0&select_item=0&select_count=0&select_pane=0&message_to_name=' + mmUser.value + '&message_subject=' + mmSubject.value + '&message_body=' + encodeURIComponent(mmBody.value).replace(/%20/g, '+').replace(/%0A/g, '%0D%0A'));
      });
    };
    OpenWindow.document.close();
  };
})();

function setValue(item, value) {
  localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
}

function getValue(item, toJSON) {
  return (localStorage[item]) ? ((toJSON) ? JSON.parse(localStorage[item]) : localStorage[item]) : null;
}

function post(href, func, parm) { //post
  var xhr = new XMLHttpRequest();
  xhr.open(parm ? 'POST' : 'GET', href);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.responseType = 'document';
  xhr.onerror = function() {
    xhr = null;
    post(href, func, parm);
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
