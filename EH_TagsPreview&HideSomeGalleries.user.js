// ==UserScript==
// @name        EH_TagsPreview&HideSomeGalleries
// @name:zh-CN  【EH】标签预览+隐藏画集
// @namespace   Dodying
// @author      Dodying
// @description 移动到画廊上可预览标签，同时如果标签里有不喜欢的标签则会隐藏该画集
// @description:zh-CN 移动到画廊上可预览标签，同时如果标签里有不喜欢的标签则会隐藏该画集
// @include     http://exhentai.org/
// @include     http://exhentai.org/?*
// @include     http://exhentai.org/tag/*
// @include     http://exhentai.org/favorites.php
// @include     http://exhentai.org/favorites.php?*
// @include     http://exhentai.org/uploader/*
// @include     http://g.e-hentai.org/
// @include     http://g.e-hentai.org/?*
// @include     http://g.e-hentai.org/tag/*
// @include     http://g.e-hentai.org/favorites.php
// @include     http://g.e-hentai.org/favorites.php?*
// @include     http://g.e-hentai.org/uploader/*
// @version     1.01
// @grant       none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @run-at      document-idle
// ==/UserScript==
/*要隐藏的标签*/
var UnlikeTags = /yaoi|females only|males only|vore|tentacles|guro|scat|netorare|bestiality|insect|worm|furry|amputee/g;
/*男同|只有女性|只有男性|活吞|触手|猎奇|排泄|NTR|兽奸|昆虫|虫子|毛皮|残肢*/
/*要隐藏的标签*/
var Div = document.querySelectorAll('.it5>a');
var gidlist = new Array;
var gmetadata_all = new Array();
for (var i = 0; i < Div.length; i++) {
  var url_array = Div[i].href.split('/');
  gidlist.push([url_array[4],
  url_array[5]])
  if (i % 25 == 24) {
    xhr(gidlist);
    var gidlist = new Array;
  }
}/**/

function xhr(gidlist) {
  var gdata = {
    'method': 'gdata',
    'gidlist': gidlist
  }
  var xhr = 'xhr_' + Math.random().toString();
  xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://g.e-hentai.org/api.php', true);
  xhr.onload = function () {
    var apirsp = JSON.parse(xhr.responseText);
    //console.log(apirsp['gmetadata']);
    TagPreview(apirsp['gmetadata']);
  };
  xhr.send(JSON.stringify(gdata));
}
function TagPreview(gmetadata) {
  gmetadata_all.concat(gmetadata);
  //console.log(gmetadata_all)
  var Box = document.createElement('div');
  Box.id = 'TagPreview';
  var bgcolor;
  (window.location.host == 'g.e-hentai.org') ? bgcolor = '#E3E0D1' : bgcolor = '#34353B';
  Box.style = 'position:absolute;padding:5px;display:none;z-index:999;background-color:' + bgcolor + ';font-size:larger;';
  for (var i = 0; i < Div.length; i++) {
    Div[i].className = 'TagPreview_' + i;
    Div[i].onmousemove = function (event) {
      //console.log(gmetadata_all)
      var id = this.className.replace('TagPreview_', '');
      //console.log(gmetadata_all[id])
      var tag = gmetadata_all[id].tags.join('<br >');
      if (UnlikeTags.test(tag)) {
        this.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        return;
      }
      var MousePos = getMousePos(event);
      //console.log(MousePos);
      Box.style.display = 'block';
      Box.style.left = eval(MousePos['x'] + 5) + 'px';
      Box.style.top = eval(MousePos['y'] + 5) + 'px';
      Box.innerHTML = tag;
    }
    Div[i].onmouseout = function () {
      //Box.innerHTML = '';
      var id = this.className.replace('TagPreview_', '');
      document.querySelector('#EH_a' + id + '+div').style.visibility = 'hidden';
      setTimeout(function () {
        Box.style.display = 'none';
      }, 1000);
    }
  }
  document.body.appendChild(Box);
}
function getMousePos(event) {
  var e = event || window.event;
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  var x = e.pageX || e.clientX + scrollX;
  var y = e.pageY || e.clientY + scrollY;
  //alert('x: ' + x + '\ny: ' + y);
  return {
    'x': x,
    'y': y
  };
}
