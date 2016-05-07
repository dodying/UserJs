// ==UserScript==
// @name        EH_QuickButtonToAddFav
// @name:zh-CN  【EH】EH快速收藏
// @description 左键：加入到fav0，中键：弹出选项，右键：快速添加到上次的收藏夹，双击：移除收藏
// @description:zh-CN 左键：加入到fav0，中键：弹出选项，右键：快速添加到上次的收藏夹，双击：移除收藏
// @namespace   Dodying
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
// @version     1.03
// @grant       none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// ==/UserScript==
var script = document.createElement('script');
//function xhr_send(status,addurl,id){switch(status){case 0:var parm="favcat=0&favnote=&submit=Apply+Changes&update=1";var pic="True";break;case 1:if(!localStorage.default_favcat){var favcat=prompt("请选择（取消相当于10）：\\n0.未下载\\n1.连载-系列\\n2.CG-COS-画集-女同\\n3.东方-LL-舰娘\\n4.同人\\n5.大师-萝莉\\n6.纯爱-Np-1♂\\n7.纯爱-乱伦\\n8.纯爱-2p-♂♀\\n9.难定-杂志\\n10.从收藏中移除","0")}else{var favcat=prompt("请选择（取消相当于10）：\\n0.未下载\\n1.连载-系列\\n2.CG-COS-画集-女同\\n3.东方-LL-舰娘\\n4.同人\\n5.大师-萝莉\\n6.纯爱-Np-1♂\\n7.纯爱-乱伦\\n8.纯爱-2p-♂♀\\n9.难定-故事-非汉化\\n10.从收藏中移除",localStorage.default_favcat)}var pic="Change";if(favcat=="10"||favcat==null){var favcat="favdel";var pic="False"}if(favcat=="favdel"){localStorage.default_favcat="10"}else{localStorage.default_favcat=favcat}document.querySelector("#"+id).innerHTML+=favcat;var parm="favcat="+favcat+"&favnote=&submit=Apply+Changes&update=1";break;case 3:var parm="favcat=favdel&favnote=&submit=Apply+Changes&update=1";var pic="False";break;case 2:var favcat=localStorage.default_favcat;var pic="Change";document.querySelector("#"+id).innerHTML+=favcat;var parm="favcat="+favcat+"&favnote=&submit=Apply+Changes&update=1"}var xhr_send="xhr_send"+Math.random();xhr_send=new XMLHttpRequest();xhr_send.open("POST",addurl);xhr_send.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");xhr_send.setRequestHeader("Content-Type","application/x-www-form-urlencoded");xhr_send.send(parm);xhr_send.onload=function(){document.querySelector("#"+id+" img").setAttribute("src","https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/"+pic+".png")}};
script.innerHTML = 'function xhr_send(status,addurl,id){switch(status){case 0:var parm="favcat=0&favnote=&submit=Apply+Changes&update=1";var pic="True";break;case 1:if(!localStorage.default_favcat){var favcat=prompt("请选择（取消相当于10）：\\n0.未下载\\n1.连载-系列\\n2.CG-COS-画集-女同\\n3.东方-LL-舰娘\\n4.同人\\n5.大师-萝莉\\n6.纯爱-Np-1♂\\n7.纯爱-乱伦\\n8.纯爱-2p-♂♀\\n9.难定-杂志\\n10.从收藏中移除","0")}else{var favcat=prompt("请选择（取消相当于10）：\\n0.未下载\\n1.连载-系列\\n2.CG-COS-画集-女同\\n3.东方-LL-舰娘\\n4.同人\\n5.大师-萝莉\\n6.纯爱-Np-1♂\\n7.纯爱-乱伦\\n8.纯爱-2p-♂♀\\n9.难定-故事-非汉化\\n10.从收藏中移除",localStorage.default_favcat)}var pic="Change";if(favcat=="10"||favcat==null){var favcat="favdel";var pic="False"}if(favcat=="favdel"){localStorage.default_favcat="10"}else{localStorage.default_favcat=favcat}document.querySelector("#"+id).innerHTML+=favcat;var parm="favcat="+favcat+"&favnote=&submit=Apply+Changes&update=1";break;case 3:var parm="favcat=favdel&favnote=&submit=Apply+Changes&update=1";var pic="False";break;case 2:var favcat=localStorage.default_favcat;var pic="Change";document.querySelector("#"+id).innerHTML+=favcat;var parm="favcat="+favcat+"&favnote=&submit=Apply+Changes&update=1"}var xhr_send="xhr_send"+Math.random();xhr_send=new XMLHttpRequest();xhr_send.open("POST",addurl);xhr_send.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");xhr_send.setRequestHeader("Content-Type","application/x-www-form-urlencoded");xhr_send.send(parm);xhr_send.onload=function(){document.querySelector("#"+id+" img").setAttribute("src","https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/"+pic+".png")}};';
document.body.appendChild(script);
if (document.querySelector('.it5')) { //如果存在搜索结果
  if (document.querySelector('.nopm input')) { //更改标题
    date = new Date().toLocaleDateString();
    document.title = '[' + date + ']' + document.querySelector('input.stdinput').value + ' -' + document.title;
  } else if (document.querySelector('input.fs')) {
    document.title = document.querySelector('input.fs').value + ' -' + document.title;
  }
  var down_div = document.querySelectorAll('div.i a'); //去除BT显示
  for (var i = 0; i < down_div.length; i++) {
    down_div[i].parentNode.style.display = 'none';
  }
  var text = document.querySelectorAll('.it5');
  //console.log(text);
  for (var i = 0; i < text.length; i++) {
    text[i].style = 'max-width:640px'; //限定大小
    text[i].querySelector('a').innerHTML = text[i].querySelector('a').innerHTML.replace(/^\(.*?\)( |)/, ''); //去除漫展标签
  }
  EH_QuickButton_AddFav('.it5', 'a', 'style="float: left;"', '.itd div[style="position:relative"]');
  if (!document.querySelector('.fp')) {
    //SortResult();
  }
}
if (document.querySelector('.id1')) { //如果存在热门推荐
  EH_QuickButton_AddFav('.id1', 'b', 'style="float: left;"', '.id44');
}
if (document.querySelector('#gdc')) { //如果是信息页
  document.getElementById('gn').innerHTML = document.getElementById('gn').innerHTML.replace(/^\(.*?\)( |)/, ''); //去除漫展标签
  var addurl = get_addurl(window.location.href);
  var host = window.location.host;
  var name_book = encodeURIComponent(document.querySelector('h1').innerHTML.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\{.*?\}/g, '').replace(/\【.*?\】/g, '').replace(/\|.*/, '').replace(/\s+/g, ' ').replace(/^ | $/g, '').replace(/,/g, ' ')); //.replace(/\d+/g, '%22+%22')
  var div = document.createElement('div');
  div.id = 'EH_QuickButton_InfoPage';
  var left = document.documentElement.clientWidth - 1000;
  div.style = 'color: red;position: absolute;left: ' + left + 'px;top: 140px;z-index: 999;';
  div.innerHTML = '<div oncontextmenu="return false"><a href="javascript:void(0);" onmousedown="xhr_send(event.button, \'' + addurl + '\', \'EH_QuickButton_InfoPage\');" ondblclick="xhr_send(3, \'' + addurl + '\', \'EH_QuickButton_InfoPage\');"><img src="https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/Plus.png" /></a><a target="_blank" href="http://' + host + '/?f_search=%22' + name_book + '%22&f_apply=Apply+Filter&advsearch=1&f_sname=on&f_stags=on&f_sh=on"><img src="https://cdn0.iconfinder.com/data/icons/basic-ui-elements-round/700/09_search-16.png" /></a></div>';
  document.body.appendChild(div);
}
/////////////////////////////////////////////////////
function EH_QuickButton_AddFav(a, name, style, box) {
  var a_url = document.querySelectorAll(a);
  var host = window.location.host;
  for (var i = 0; i < a_url.length; i++) {
    var name_book = encodeURIComponent(a_url[i].querySelector('a').innerHTML.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\{.*?\}/g, '').replace(/\【.*?\】/g, '').replace(/\|.*/, '').replace(/\s+/g, ' ').replace(/^ | $/g, '').replace(/,/g, ' ')); //.replace(/\d+/g, '%22+%22')
    var url = a_url[i].querySelector('a').getAttribute('href');
    var addurl = get_addurl(url);
    var div = document.createElement('div');
    var id = 'EH_' + name + i;
    div.id = id;
    div.innerHTML = '<div oncontextmenu="return false" ' + style + '><a href="javascript:void(0);" onmousedown="xhr_send(event.button, \'' + addurl + '\', \'' + id + '\');" ondblclick="xhr_send(3, \'' + addurl + '\', \'' + id + '\');"><img src="https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/Plus.png" /></a><a target="_blank" href="http://' + host + '/?f_search=%22' + name_book + '%22&f_apply=Apply+Filter&advsearch=1&f_sname=on&f_stags=on&f_sh=on"><img src="https://cdn0.iconfinder.com/data/icons/basic-ui-elements-round/700/09_search-16.png" /></a></div>';
    //document.querySelector('.gtr0 .itd div[style="position:relative"]').appendChild(a);
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
function SortResult() {
  var type = document.querySelectorAll('.itg img.ic');
  eval('var type_array = [\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\',\'\'];');
  for (var i = 0; i < type.length; i++) {
    switch (type[i].alt)
      {
      case 'doujinshi':
        var num = 0;
        break;
      case 'manga':
        var num = 1;
        break;
      case 'artistcg':
        var num = 2;
        break;
      case 'gamecg':
        var num = 3;
        break;
      case 'western':
        var num = 4;
        break;
      case 'non-h':
        var num = 5;
        break;
      case 'imageset':
        var num = 6;
        break;
      case 'cosplay':
        var num = 7;
        break;
      case 'asianporn':
        var num = 8;
        break;
      case 'misc':
        var num = 9;
        break;
    }
    type_array[num] += type[i].parentNode.parentNode.parentNode.outerHTML.replace(/[\r\n]/g, '');
    //type_array[num] += '||||' + type[i].parentNode.parentNode.parentNode.outerHTML.replace(/[\r\n]/g, '');
  }  //for (var i = 0; i < type_array.length; i++) {
  //var type_array2 = new Array();
  //type_array2 = type_array[i].split('||||');
  //for (var n = 1; n < type_array2.length; n++) {
  //var name = type_array2[n].replace(/.*hide_image_pane\([0-9]{1,}\)">/, '').replace(/<\/a><\/div><div class="it4">.*/, '').replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\{.*?\}/g, '').replace(/\s+/g, ' ').replace(/^ | $/g, '');
  //console.log(name);
  //}
  //}

  document.querySelector('.itg>tbody').innerHTML = document.querySelector('.itg>tbody>tr').outerHTML + type_array.join('').replace(/||||/g, '');
}
