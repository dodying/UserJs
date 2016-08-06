// ==UserScript==
// @name        btHelper
// @name        【BT】助手
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @version     1
// @include     *bt*/magnet/detail/hash/*
// @include     *bt*/search/*
// @grant       none
// @run-at      document-end
// ==/UserScript==
document.getElementById('qrshareModal').previousElementSibling.innerHTML = '';
self.setInterval('if(document.querySelector(\'h1\').innerHTML.indexOf(\'It looks like you\')>=0){document.location=document.location;}', 1000);
if (window.location.href.indexOf('search') >= 0) {
  SortResult();
} else {
  SortList();
  document.querySelector('#magnetLink').onclick = function () {
    document.querySelector('#magnetLink').focus();
    document.querySelector('#magnetLink').select();
  }
}
//MagnetBox
document.getElementById('magnetLink').innerHTML = document.getElementById('magnetLink').innerHTML.replace(/dn=.*/gi, '&dn=');
//名称
var Size = document.querySelectorAll('div.col-md-10') [2].innerHTML;
var UpTime = document.querySelectorAll('div.col-md-10') [3].innerHTML;
document.getElementsByTagName('h3') [0].innerHTML = '[' + Size + ']' + '[' + UpTime + ']' + document.getElementsByTagName('h3') [0].innerHTML.replace(/#_|-AVI/gi, '').toUpperCase().match(/[\w-]+/g);
//下载该种子
var bith = window.location.href.toString().replace(/.*\/detail\/hash\//g, '');
var DownloadTorrent = document.createElement('div');
DownloadTorrent.style = 'font-size:larger;';
DownloadTorrent.innerHTML = '下载该种子:  <a target="_blank" href="https://btso.pw/torrent/detail/hash/' + bith + '"><img src="https://btso.pw/app/bts/View/img/favicon.ico"></img>BTSOW</a><a target="_blank" href="http://btcache.me/torrent/' + bith + '"><img src="http://btcache.me/app/btc/View/images/favicon.ico"></img>BTCache</a><a target="_blank" href="http://torcache.net/torrent/' + bith + '.torrent"><img src="http://torcache.net/favicon.ico"></img>Torcache</a>';
document.querySelector('#magnetLink+div').appendChild(DownloadTorrent);
//////////////////////////////////////////////////////
function SortResult() {
  var prefer = new RegExp('Maho|.sub|字幕|魔穗|脸肿|宵夜|第一会所|第一會所|#_|-AVI|SIS001|3xplanet|thz.la|最果|神狐', 'gi');
  var div_a = document.querySelectorAll('.data-list a');
  var html = document.querySelector('.data-list .row').outerHTML;
  var html_1 = '';
  var separator = '<div class="row" style="text-align:center;color:red;">----------分割线----------</div>';
  for (var i = 0; i < div_a.length; i++) {
    var title = div_a[i].getAttribute('title');
    if (prefer.test(title)) {
      html = html + document.querySelectorAll('.data-list .row') [i + 1].outerHTML;
    } else {
      html_1 = html_1 + document.querySelectorAll('.data-list .row') [i + 1].outerHTML;
    }
  }
  document.querySelector('.data-list').innerHTML = html + separator + html_1;
}
function SortList() {
  var prefer = new RegExp('480P|GB|PSP|rmvb', 'gi');
  var blur = new RegExp('.jpg|.gif', 'gi');
  var div_list = document.querySelectorAll('.col-xs-8');
  var html = document.querySelectorAll('.data-list') [1].querySelectorAll('.row') [0].outerHTML;
  var html_1 = '';
  var html_2 = '';
  var separator = '<div class="row" style="text-align:center;color:red;">----------分割线----------</div>';
  //var File = new Array();
  //var Video = new RegExp('mp4|avi|wmv', 'gi');
  for (var i = 1; i < div_list.length; i++) {
    if (prefer.test(div_list[i].innerHTML) && !blur.test(div_list[i].innerHTML)) {
      html = html + '<em style="color:blue;font-weight:bold;">' + document.querySelectorAll('.detail') [1].querySelectorAll('.row') [i].outerHTML + '</em>';
    } else if (div_list[i].innerHTML.indexOf('<span class="glyphicon glyphicon-film">') >= 0) {
      html_1 = html_1 + '<em style="color:red;font-weight:bold;">' + document.querySelectorAll('.detail') [1].querySelectorAll('.row') [i].outerHTML + '</em>';
    } else {
      html_2 = html_2 + document.querySelectorAll('.detail') [1].querySelectorAll('.row') [i].outerHTML;
    }
  }
  document.querySelectorAll('div.detail') [1].innerHTML = html + separator + html_1 + separator + html_2;
}
