// ==UserScript==
// @name        hvBazaarList
// @name:zh-CN  【HV】购物清单
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN
// @include     http*://hentaiverse.org/?s=Bazaar&ss=is*
// @include     http*://alt.hentaiverse.org/?s=Bazaar&ss=is*
// @version     1.01
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @run-at      document-end
// ==/UserScript==
(function($) {
  $('<div class="listBox"></div>').attr('style', 'position:absolute;top:120px;left:550px;z-index:9;background-color:#EDEBDF;border:1px solid black;display:none;').appendTo('body').html('\
    ID:<input name="itemId"type="text"><br>\
    Name:<input name="itemName"type="text"><br>\
    Amount:<input name="itemAmount"type="text" placeholder="1000"><br>\
    Credit:<input name="itemCredit"type="text"><br>\
    Round:<input name="itemFix"type="text" placeholder="100"><br>\
    <button class="listHide">X</button>\
    <button class="listDel">REMOVE</button>\
    <button class="listSave">SAVE</button>\
    ');
  $('.listHide').click(function() {
    $('.listBox').hide();
  });
  $('.listDel').click(function() {
    var info = getValue('BazaarList', true);
    if (!info) return;
    delete info[$('input[name=itemId]').val()];
    setValue('BazaarList', info);
    $('.listBox').hide();
  });
  $('.listSave').click(function() {
    var info = getValue('BazaarList', true) || {};
    info[$('input[name=itemId]').val()] = {
      name: $('input[name=itemName]').val(),
      amount: $('input[name=itemAmount]').val() * 1 || 1000,
      credit: $('input[name=itemCredit]').val() * 1 || 0,
      fix: $('input[name=itemFix]').val() * 1 || 100
    };
    setValue('BazaarList', info);
    $('.listBox').hide();
  });
  $('<span></span>').html('+').prependTo('.nosel.itemlist tr>td:nth-child(1)').attr('style', 'cursor:pointer;font-size:large;').on('click', function() {
    var id = parseInt($(this).next().attr('onclick').match(/\d+/)[0]);
    $('input[name=itemId]').val(id);
    if (getValue('BazaarList') && id in getValue('BazaarList', true)) {
      var info = getValue('BazaarList', true);
      $('input[name=itemName]').val(info[id].name);
      $('input[name=itemAmount]').val(info[id].amount);
      $('input[name=itemCredit]').val(info[id].credit);
      $('input[name=itemFix]').val(info[id].fix);
    } else {
      $('input[name=itemName]').val($('[onmouseover*=' + id + ']:eq(0)').text());
      $('input[name=itemAmount]').val('');
      $('input[name=itemCredit]').val('');
      $('input[name=itemFix]').val('');
    }
    $('.listBox').show();
    $('.listSave').focus();
  });
  $('<button></button>').text('Generate List').click(function() {
    var info = getValue('BazaarList', true);
    if (!info) return;
    console.log(info);
    var itemPane, amount, i, credit;
    var creditAll = 0;
    var _html = '';
    for (i in info) {
      itemPane = $('#item_pane div[onclick*="' + i + '"]');
      if (itemPane.length !== 0) {
        amount = parseInt(info[i].amount) - parseInt(itemPane.parent().next().text());
        if (amount < 0) continue;
        if (info[i].fix) amount = (Math.floor(amount / info[i].fix) + 1) * info[i].fix;
      } else {
        amount = info[i].amount;
      }
      credit = amount * (info[i].credit || 0);
      creditAll += credit;
      _html += amount + 'x ' + info[i].name + ' @' + (info[i].credit || 0) + ' = ' + credit + '<br>';
    }
    _html += '- - - - -<br>All: ' + creditAll;
    var OpenWindow = window.open('', 'newwin', 'height=250,width=250,toolbar=no,menubar=no');
    OpenWindow.document.write(_html);
    OpenWindow.document.close();
  }).css({
    position: 'absolute',
    top: '28px',
    right: '2px'
  }).appendTo('body');

  function setValue(item, value) {
    localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
  }

  function getValue(item, toJSON) {
    return (localStorage[item]) ? ((toJSON) ? JSON.parse(localStorage[item]) : localStorage[item]) : null;
  }
})($);
