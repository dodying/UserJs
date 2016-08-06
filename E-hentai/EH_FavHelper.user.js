// ==UserScript==
// @name        EH_FavHelper
// @name:zh-CN  【EH】扫图助手
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description:zh-CN 
// @include     http*://exhentai.org/
// @include     http*://exhentai.org/?*
// @include     http*://exhentai.org/g/*
// @include     http*://exhentai.org/tag/*
// @include     http*://exhentai.org/favorites.php
// @include     http*://exhentai.org/favorites.php?*
// @include     http*://exhentai.org/uploader/*
// @include     http*://g.e-hentai.org/
// @include     http*://g.e-hentai.org/?*
// @include     http*://g.e-hentai.org/g/*
// @include     http*://g.e-hentai.org/tag/*
// @include     http*://g.e-hentai.org/favorites.php
// @include     http*://g.e-hentai.org/favorites.php?*
// @include     http*://g.e-hentai.org/uploader/*
// @version     1
// @grant       GM_addStyle
// @grant       GM_openInTab
// @run-at      document-idle
// ==/UserScript==
if (!document.querySelector('#taglist')) {
  document.querySelector('.itg').oncontextmenu = function (e) {
    //console.log(e);
    if (e.target.className.indexOf('TagPreview_') >= 0) {
      window.open(e.target.href + '#2');
      e.preventDefault();
    }
  }
  GM_addStyle('.itg>tbody>tr.hover{background-color:#669933}.itg>tbody>tr:hover{background-color:#4a86e8}');
  document.querySelector('input.stdinput,form>input[name="favcat"]+div>input').oncontextmenu = function () {
    this.value = '';
  }
  var tr = document.querySelectorAll('.itg>tbody>tr');
  if (!document.querySelector('.itg>tbody>tr>td>input')) {
    if (tr.length === 2) {
      if (confirm('搜索到1本，是否立即下载')) {
        GM_openInTab(tr[1].querySelector('.itd>div>.it5>a').href + '#2');
      }
    }
    for (var i = 0; i < tr.length; i++) {
      if (i === 0) {
        var div = document.createElement('th');
      } else {
        var div = document.createElement('td');
      }
      div.style.textAlign = 'center';
      div.innerHTML = '<input id="EH_FavHelper_' + i + '" type="checkbox" onchange="var a=this.parentNode.parentNode;if(a.className.indexOf(\' hover\')>=0){a.className=a.className.replace(\' hover\',\'\')}else{a.className+=\' hover\'}" />';
      if (i === 0) {
        div.onclick = function () {
          var input = document.querySelectorAll('.itg input');
          for (var i = 0; i < input.length; i++) {
            if (this.querySelector('input').checked === true) {
              input[i].checked = true;
            } else {
              input[i].checked = false;
            }
          }
        }
      }
      tr[i].appendChild(div);
      if (tr[i].querySelector('.itd')) tr[i].querySelector('.itd').innerHTML = '<label for="EH_FavHelper_' + i + '">' + tr[i].querySelector('.itd').innerHTML + '</label>';
    }
  } else {
    if (tr.length === 2) { //搜索到1本，是否立即下载
      GM_openInTab(tr[1].querySelector('.itd>div>.it5>a').href + '#2');
    }
  }
  var Open = document.createElement('input');
  Open.name = 'open';
  Open.value = 'Open';
  Open.className = 'stdbtn';
  Open.type = 'button';
  Open.style.zIndex = '9999';
  Open.style.float = 'right';
  Open.style.left = document.documentElement.clientWidth - 120 + 'px';
  Open.style.position = 'absolute';
  Open.oncontextmenu = function () {
    return false;
  }
  Open.onmousedown = function (event) {
    var url = new Array();
    var input_check = document.querySelectorAll('.itg>tbody>tr>td>input:checked');
    console.log(input_check)
    for (var i = 0; i < input_check.length; i++) {
      if (input_check[i].parentNode.parentNode.style.display !== 'none') {
        if (input_check[i].parentNode.parentNode.querySelector('.itd>div>.it5>a')) {
          url.push(input_check[i].parentNode.parentNode.querySelector('.itd>div>.it5>a').href + '#' + event.buttons);
        }
      }
    }
    for (var i = 0; i < url.length; i++) {
      GM_openInTab(url[i]);
    }
  }
  document.body.appendChild(Open);
  var Batch = document.createElement('input');
  Batch.name = 'batch';
  Batch.value = 'Batch';
  Batch.className = 'stdbtn';
  Batch.type = 'button';
  Batch.style.zIndex = '9999';
  Batch.style.float = 'right';
  Batch.style.left = document.documentElement.clientWidth - 170 + 'px';
  Batch.style.position = 'absolute';
  Batch.oncontextmenu = function () {
    window.BatchTime = 0;
    return false;
  }
  Batch.onclick = function () {
    if (!window.BatchTime) {
      window.BatchTime = 0;
    }
    var input = document.querySelectorAll('.itg>tbody>tr>td>input');
    if (window.BatchTime * 4 > input.length) {
      window.BatchTime = 0;
    }
    var time = - 1;
    for (var i = 0; i < input.length; i++) {
      time++;
      if (input[i].parentNode.parentNode.style.display === 'none') {
        time--;
        continue;
      }
      if (time <= 4 * window.BatchTime + 3 && time >= 4 * window.BatchTime) {
        input[i].checked = true;
        input[i].parentNode.parentNode.className += ' hover';
      } else {
        input[i].checked = false;
        input[i].parentNode.parentNode.className = input[i].parentNode.parentNode.className.replace(' hover', '');
      }
    }
    window.BatchTime++;
  }
  document.body.appendChild(Batch);
  window.onscroll = function () {
    Batch.style.top = document.documentElement.scrollTop + window.innerHeight - 40 + 'px';
    Open.style.top = document.documentElement.scrollTop + window.innerHeight - 40 + 'px';
  }
} else {
  var type = window.location.href.toString().replace(/.*\//, '');
  if (type === '#2') {
    setTimeout(function () {
      document.querySelector('.ehD-box>.g2').click();
    }, 1000);
    setInterval(function () {
      if (document.querySelector('.ehD-dialog>.ehD-pt-gen-filename+button').innerHTML === 'Not download? Click here to download') {
        setTimeout(function () {
          self.close();
        }, 1000);
      }
    }, 5000);
  }
}
