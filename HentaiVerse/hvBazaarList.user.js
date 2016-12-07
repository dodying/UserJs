// ==UserScript==
// @name        hvBazaarList
// @name:zh-CN  【HV】购物清单
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN  
// @include     http://hentaiverse.org/?s=Bazaar&ss=is*
// @version     1
// @grant       unsafeWindow
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @run-at      document-end
// ==/UserScript==
(function ($) {
  $('<div class="listBox"></div>').html('ID:<input name="itemId"type="text"><br>名字:<input name="itemName"type="text"><br>数量:<input name="itemAmount"type="text"><br>取整:<input name="itemFix"type="text"><br><button class="listHide">X</button> <button class="listDel">去除</button> <button class="listSave">保存</button>').attr('style', 'position:absolute;top:120px;left:550px;z-index:9;background-color:#EDEBDF;border:1px solid black;display:none;').appendTo('body');
  $('.listHide').click(function () {
    $('.listBox').hide();
  });
  $('.listDel').click(function () {
    var info = getValue('BazaarList', true);
    if (!info) return;
    delete info[$('input[name=itemId]').val()];
    setValue('BazaarList', info);
    $('.listBox').hide();
  });
  $('.listSave').click(function () {
    var info = getValue('BazaarList', true) || new Object();
    info[$('input[name=itemId]').val()] = {
      name: $('input[name=itemName]').val(),
      amount: $('input[name=itemAmount]').val(),
      fix: $('input[name=itemFix]').val()
    };
    setValue('BazaarList', info);
    $('.listBox').hide();
  });
  $('<span></span>').html('+').prependTo('.iop,.io').attr('style', 'cursor:pointer;font-size:large;').on('click', function () {
    var id = parseInt($(this).next().attr('id'));
    $('input[name=itemId]').val(id);
    if (getValue('BazaarList') && id in getValue('BazaarList', true)) {
      var info = getValue('BazaarList', true);
      $('input[name=itemName]').val(info[id].name);
      $('input[name=itemAmount]').val(info[id].amount);
      $('input[name=itemFix]').val(info[id].fix);
    } else {
      $('input[name=itemName]').val($('[id^=' + id + ']:eq(0)').text());
      $('input[name=itemAmount]').val('');
      $('input[name=itemFix]').val('');
    }
    $('.listBox').show();
  });
  $('<button></button>').text('生成清单').click(function () {
    var info = getValue('BazaarList', true);
    if (!info) return;
    var _html = '';
    var itemPane;
    var amount;
    var i;
    for (i in info) {
      itemPane = $('#' + i + 'item_pane');
      if (itemPane.length !== 0) {
        amount = parseInt(info[i].amount) - parseInt(itemPane.parent().next().text());
        if (amount < 0) continue;
        if (info[i].fix) amount = (Math.floor(amount / info[i].fix) + 1) * info[i].fix;
      } else {
        amount = info[i].amount;
      }
      _html += amount + 'x ' + info[i].name + '<br>';
    }
    var OpenWindow = unsafeWindow.open('', 'newwin', 'height=250,width=250,toolbar=no,menubar=no');
    OpenWindow.document.write(_html);
    OpenWindow.document.close();
  }).appendTo('.clb');
  function setValue(item, value) {
    localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
  }
  function getValue(item, toJSON) {
    return (localStorage[item]) ? ((toJSON) ? JSON.parse(localStorage[item])  : localStorage[item])  : null;
  }
}) ($);
