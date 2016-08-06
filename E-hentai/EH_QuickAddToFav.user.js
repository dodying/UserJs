// ==UserScript==
// @name        EH_QuickAddToFav
// @name:zh-CN  【EH】EH快速收藏
// @description 左键：加入到fav0，中键：弹出选项，右键：快速添加到上次的收藏夹，双击：移除收藏
// @description:zh-CN 左键：加入到fav0，中键：弹出选项，右键：快速添加到上次的收藏夹，双击：移除收藏
// @namespace   https://github.com/dodying/Dodying-UserJs
// @author      Dodying
// @include     http://g.e-hentai.org/
// @include     http://g.e-hentai.org/?*
// @include     http://g.e-hentai.org/tag/*
// @include     http://g.e-hentai.org/g/*
// @include     http://g.e-hentai.org/uploader/*
// @include     http://g.e-hentai.org/favorites.php*
// @include     http://exhentai.org/
// @include     http://exhentai.org/?*
// @include     http://exhentai.org/tag/*
// @include     http://exhentai.org/g/*
// @include     http://exhentai.org/uploader/*
// @include     http://exhentai.org/favorites.php*
// @version     1.04
// @grant       none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// ==/UserScript==
if (document.querySelector('div.i')) {
  var Fav = document.querySelectorAll('div.i');
  for (var i = 0; i < Fav.length; i++) {
    if (Fav[i].style.backgroundImage == 'url("http://exhentai.org/img/fav.png")' || Fav[i].style.backgroundImage == 'url("http://ehgt.org/g/fav.png")') {
      Fav[i].style.backgroundImage = 'url("https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/fav.png")';
    }
  }
}
if (document.querySelector('.it5')) { //如果存在搜索结果
  var Chs = new RegExp('chinese|汉化|漢化|家族', 'gi');
  var ChsFind = Chs.test(document.querySelector('input.stdinput,form>input[name="favcat"]+div>input').value);
  var down_div = document.querySelectorAll('div.i a'); //去除BT显示
  for (var i = 0; i < down_div.length; i++) {
    down_div[i].parentNode.style.display = 'none';
  }
  document.querySelector('body>div.ido').style.maxWidth='99999px';
  document.querySelector('body>div.ido table.itg').style.maxWidth='99999px';
  var text = document.querySelectorAll('.it5');
  //console.log(text);
  for (var i = 0; i < text.length; i++) {
    text[i].style.maxWidth = '790px'; //限定大小
    text[i].querySelector('a').innerHTML = text[i].querySelector('a').innerHTML.replace(/^\(.*?\)( |)/, ''); //去除漫展标签
    if (!ChsFind) { //加粗突出汉化本
      if (Chs.test(text[i].querySelector('a').innerHTML)) text[i].style.fontWeight = 'bold';
    }
  }
  EH_QuickButton_AddFav('.it5', 'a', 'style="float:left;"', '.itd div[style="position:relative"]');
}
if (document.querySelector('.id1')) { //如果存在热门推荐
  EH_QuickButton_AddFav('.id1', 'b', 'style="float:left;"', '.id44');
}
if (document.querySelector('#gdc')) { //如果是信息页
  document.getElementById('gn').innerHTML = document.getElementById('gn').innerHTML.replace(/^\(.*?\)( |)/, ''); //去除漫展标签
  var addurl = get_addurl(window.location.href);
  var host = window.location.host;
  var name_book = encodeURIComponent(document.querySelector('h1').innerHTML.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\{.*?\}/g, '').replace(/\【.*?\】/g, '').replace(/\|.*/, '').replace(/\s+/g, ' ').replace(/^ | $/g, '').replace(/,/g, ' ').replace(/:/g, '" "')); //.replace(/\d+/g, '" "')
  var div = document.createElement('div');
  div.id = 'EH_QuickButton_InfoPage';
  var left = document.documentElement.clientWidth - 1000;
  div.style = 'color:red;position:absolute;left:' + left + 'px;top:140px;z-index:999;';
  div.innerHTML = '<div oncontextmenu="return false"><a href="javascript:void(0);"><div style="background-image:url(https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/Plus.png);width:16px;height:16px;float:left;"></div></a><a target="_blank" href="http://' + host + '/?f_search=%22' + name_book + '%22&f_apply=Apply+Filter&advsearch=1&f_sname=on&f_stags=on&f_sh=on"><img src="https://cdn0.iconfinder.com/data/icons/basic-ui-elements-round/700/09_search-16.png" /></a></div>';
  div.querySelector('a').onmousedown = function (event) {
    xhr_send(event.button, addurl, 'EH_QuickButton_InfoPage');
  }
  div.querySelector('a').ondblclick = function () {
    xhr_send(3, addurl, 'EH_QuickButton_InfoPage');
  }
  document.body.appendChild(div);
} /////////////////////////////////////////////////////

function EH_QuickButton_AddFav(a, name, style, box) {
  var a_url = document.querySelectorAll(a);
  var host = window.location.host;
  for (var i = 0; i < a_url.length; i++) {
    var name_book = encodeURIComponent(a_url[i].querySelector('a').innerHTML.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\{.*?\}/g, '').replace(/\【.*?\】/g, '').replace(/\|.*/, '').replace(/\s+/g, ' ').replace(/^ | $/g, '').replace(/,/g, ' ').replace(/:/g, '" "')); //.replace(/\d+/g, '" "')
    var url = a_url[i].querySelector('a').getAttribute('href');
    var addurl = get_addurl(url);
    var div = document.createElement('div');
    var id = 'EH_' + name + i;
    div.id = id;
    div.innerHTML = '<div oncontextmenu="return false" ' + style + '><a href="javascript:void(0);" title="' + addurl + '|||' + id + '"><div style="background-image:url(https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/Plus.png);width:16px;height:16px;float:left;"></div></a><a target="_blank" href="http://' + host + '/?f_search=%22' + name_book + '%22&f_apply=Apply+Filter&advsearch=1&f_sname=on&f_stags=on&f_sh=on"><img src="https://cdn0.iconfinder.com/data/icons/basic-ui-elements-round/700/09_search-16.png" /></a></div>';
    div.querySelector('a').onmousedown = function (event) {
      xhr_send(event.button, this.title.split('|||') [0], this.title.split('|||') [1]);
    }
    div.querySelector('a').ondblclick = function () {
      xhr_send(3, this.title.split('|||') [0], this.title.split('|||') [1]);
    } //document.querySelector('.gtr0 .itd div[style="position:relative"]').appendChild(a);

    var box1 = document.querySelectorAll(box);
    box1[i].insertBefore(div, box1[i].childNodes[0]);
  }
}
function get_addurl(url) {
  var all = url.replace('http://g.e-hentai.org/g/', '').replace('http://exhentai.org/g/', '');
  var t = all.replace(/[0-9]{1,9}\//, '').replace('/', '');
  var gid = all.replace('/' + t + '/', '');
  if (url.indexOf('http://g.e-hentai.org/g/') >= 0) {
    var addurl = 'http://g.e-hentai.org/gallerypopups.php?gid=' + gid + '&t=' + t + '&act=addfav';
  } else if (url.indexOf('http://exhentai.org/g/') >= 0) {
    var addurl = 'http://exhentai.org/gallerypopups.php?gid=' + gid + '&t=' + t + '&act=addfav';
  }
  return addurl;
}
function xhr_send(status, addurl, id) {
  switch (status) {
    case 0:
      var parm = 'favcat=0&favnote=&submit=Apply+Changes&update=1';
      var pic = '2';
      break;
    case 1:
      if (!localStorage.EH_QuickButtonToAddFav_LastFavcat) {
        var favcat = prompt('请选择：\n0.未下载\n1.连载-系列\n2.CG-COS-画集-女同\n3.东方-LL-舰娘-偶像大师\n4.同人\n5.大师-萝莉\n6.纯爱-Np-1♂\n7.纯爱-乱伦\n8.纯爱-2p-♂♀\n9.难定-杂志\n10.从收藏中移除', '0');
      } else {
        var favcat = prompt('请选择：\n0.未下载\n1.连载-系列\n2.CG-COS-画集-女同\n3.东方-LL-舰娘-偶像大师\n4.同人\n5.大师-萝莉\n6.纯爱-Np-1♂\n7.纯爱-乱伦\n8.纯爱-2p-♂♀\n9.难定-杂志\n10.从收藏中移除', localStorage.EH_QuickButtonToAddFav_LastFavcat);
      }
      if (!/[0-9]/.test(favcat) || favcat < 0 || favcat > 10) return;
      var pic = favcat * 19 + 2;
      localStorage.EH_QuickButtonToAddFav_LastFavcat = favcat;
      if (favcat == '10') var favcat = 'favdel';
      var parm = 'favcat=' + favcat + '&favnote=&submit=Apply+Changes&update=1';
      break;
    case 3:
      var favcat = 'favdel';
      var parm = 'favcat=favdel&favnote=&submit=Apply+Changes&update=1';
      break;
    case 2:
      var favcat = localStorage.EH_QuickButtonToAddFav_LastFavcat;
      if (favcat == '10') var favcat = 'favdel';
      var pic = favcat * 19 + 2;
      var parm = 'favcat=' + favcat + '&favnote=&submit=Apply+Changes&update=1';
      break;
  }
  var xhr_send = 'xhr_send' + Math.random();
  xhr_send = new XMLHttpRequest();
  xhr_send.open('POST', addurl);
  xhr_send.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr_send.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr_send.send(parm);
  xhr_send.onload = function () {
    (favcat != 'favdel') ? document.querySelector('#' + id + '>div>a>div').style = 'background-image:url(https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/fav.png);width:15px;height:15px;float:left;background-position:0px -' + pic + 'px;' : document.querySelector('#' + id + '>div>a>div').style = 'background-image:url(https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/Delete-16.png);width:16px;height:16px;float:left;';
}
};
