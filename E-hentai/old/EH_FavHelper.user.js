// ==UserScript==
// @name        EH_FavHelper
// @name:zh-CN  【EH】扫图助手
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @include     http*://exhentai.org/*
// @include     http*://e-hentai.org/*
// @include     http*://exhentai.org/g/*
// @include     http*://e-hentai.org/g/*
// @exclude     http*://exhentai.org/s/*
// @exclude     http*://e-hentai.org/s/*
// @version     1.01
// @grant       GM_addStyle
// @grant       GM_openInTab
// @run-at      document-idle
// ==/UserScript==
(function () {
  if (!document.querySelector('#taglist')) { //搜索页
    window.BatchTime = 0;
    GM_addStyle('.itg>tbody>tr[type="hover"]{background-color:#669933}.itg>tbody>tr:hover{background-color:#4a86e8}.itd>label{cursor:pointer;}.stdbtn.EH_FavHelper{z-index:9999;float:right;position:fixed;bottom:10px;}');
    document.querySelector('.itg').oncontextmenu = function (e) { //右键：下载
      console.log(e);
      e.preventDefault();
      if (e.target.className.indexOf('TagPreview_') >= 0) {
        GM_openInTab(e.target.href + '#2', true);
      } else if (window.BatchTime > 0 && e.target.className === 'EH_QuickAddToFav' || e.target.className.match('ehLBAdd')) {
        window.BatchTime = window.BatchTime - 0.25;
      }
    }
    var tr = document.querySelectorAll('.itg>tbody>tr');
    if (!document.querySelector('.itg>tbody>tr>td>input')) {
      if (tr.length === 2 && confirm('搜索到1本，是否立即下载')) GM_openInTab(tr[1].querySelector('.itd>div>.it5>a').href + '#2', true);
      tr.forEach(function (_tr, i) {
        var div = (i === 0) ? document.createElement('th')  : document.createElement('td');
        div.style = 'text-align:center;';
        div.innerHTML = '<input id="EH_FavHelper_' + i + '" type="checkbox">';
        if (i === 0) {
          div.querySelector('input').addEventListener('click', function () { //全选
            var _this = this;
            document.querySelectorAll('tr.gtr0 input,tr.gtr1 input').forEach(function (i) {
              i.checked = (_this.checked === true) ? true : false;
            });
          });
        }
        div.querySelector('input').addEventListener('change', function () { //高亮选中
          var a = this.parentNode.parentNode;
          a.setAttribute('type', (a.getAttribute('type') === 'hover') ? '' : 'hover');
        });
        _tr.appendChild(div);
        if (_tr.querySelector('.itd')) _tr.querySelector('.itd').innerHTML = '<label for="EH_FavHelper_' + i + '">' + _tr.querySelector('.itd').innerHTML + '</label>';
      });
    } else {
      if (tr.length === 2) GM_openInTab(tr[1].querySelector('.itd>div>.it5>a').href + '#2', true); //搜索到1本，立即下载
    };
    var Open = document.createElement('input');
    Open.value = 'Open';
    Open.className = 'stdbtn EH_FavHelper';
    Open.type = 'button';
    Open.style = 'right:20px;';
    Open.oncontextmenu = function () {
      return false;
    }
    Open.onmousedown = function (event) {
      var input_check = document.querySelectorAll('.itg>tbody>tr>td>input:checked');
      //console.log(input_check);
      input_check.forEach(function (i) {
        var _tr = i.parentNode.parentNode;
        if (_tr.style.display !== 'none' && _tr.querySelector('.itd>div>.it5>a')) GM_openInTab(_tr.querySelector('.itd>div>.it5>a').href + '#' + event.buttons, true);
      });
    }
    document.body.appendChild(Open);
    var Batch = document.createElement('input');
    Batch.value = 'Batch';
    Batch.className = 'stdbtn EH_FavHelper';
    Batch.type = 'button';
    Batch.style = 'right:70px;';
    Batch.oncontextmenu = function () {
      window.BatchTime = 0;
      return false;
    }
    Batch.onclick = function () {
      var input = new Array();
      document.querySelectorAll('tr.gtr0,tr.gtr1').forEach(function (i) {
        if (i.style.display !== 'none' && (!i.querySelector('.i[id^="favicon_"]') || i.querySelector('.i[id^="favicon_"]').style.backgroundPositionY === '-2px') && i.querySelector('.ehLBAdd') && (i.querySelector('.EH_QuickAddToFav').style.backgroundPositionY === '' || i.querySelector('.EH_QuickAddToFav').style.backgroundPositionY === '-2px')) {
          input.push(i.querySelector('td>input'));
        } else {
          i.querySelector('td>input').checked = false;
          i.removeAttribute('type');
        }
      });
      if (window.BatchTime * 4 >= input.length) window.BatchTime = 0;
      input.forEach(function (_input, i) {
        if (i <= 4 * window.BatchTime + 3 && i >= 4 * window.BatchTime) {
          _input.checked = true;
          _input.parentNode.parentNode.setAttribute('type', 'hover');
        } else {
          _input.checked = false;
          _input.parentNode.parentNode.removeAttribute('type');
        }
      });
      window.BatchTime++;
    }
    document.body.appendChild(Batch);
  } else { //信息页
    if (location.hash === '#2') {
      var start = setInterval(function () {
        if (document.querySelector('.ehD-box>.g2')) {
          clearInterval(start);
          document.querySelector('.ehD-box>.g2').click();
        }
      }, 800);
      var end = setInterval(function () {
        if (document.querySelector('.ehD-dialog>.ehD-pt-gen-filename+button').innerHTML === 'Not download? Click here to download') {
          clearInterval(end);
          setTimeout(function () {
            self.close();
          }, 3000);
        }
      }, 3000);
    }
  }
}
) ();
