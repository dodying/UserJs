// ==UserScript==
// @name        hBlockOwnedAV
// @name:zh-CN  【H】屏蔽已拥有AV
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description	1pondo.tv需按按钮
// @include     http://www.dmm.co.jp/*
// include      http*://www.baidu.com/*
// include      https://www.google.co.jp/*
// @include     *.tokyo-hot.com/*
// @include     *.caribbeancom.com/*
// @include     *.1000giri.net/*
// @include     *.10musume.com/*
// @include     *.heyzo.com/*
// @include     *.1pondo.tv/*
// @include     *bt*.*/*
// @include     *jav*.*/*
// @include     *av28*.*/*
// include     *fuli*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @run-at      document-end
// ==/UserScript==
var URL = window.location.toString();
if (URL.indexOf('http://www.javlibrary.com/cn/?v=jav') >= 0) {
  var Code_Try = document.querySelector('#video_id  .text').innerHTML;
} else {
  var Code_Try = CodeTry(URL);
}
QuickButton();
if (URL.indexOf('search') >= 0) {
  SearchResult();
}
Block(); //先屏蔽一次
DeleteSameCode('0');
DeleteSameCode('1');
DeleteSameCode('2');
window.onscroll = function () {
  document.querySelector('#QuickButton').style.top = document.documentElement.scrollTop + 'px';
}
window.addEventListener('keydown', function (e) {
  if (e.keyCode == 66) { //Bb
    document.querySelector('#QuickButton_Switch').click();
  }
}, true);
document.querySelector('#QuickButton_Switch').onclick = function () {
  if (document.querySelector('#QuickButton_Switch img').src == 'https://cdn1.iconfinder.com/data/icons/ui-icons-2/512/checkbox-off-01-24.png') {
    Block();
  } else {
    TurnOffBlock();
    document.querySelector('#QuickButton_Switch img').src = 'https://cdn1.iconfinder.com/data/icons/ui-icons-2/512/checkbox-off-01-24.png';
  }
}
document.querySelector('#QuickButton_Add').onclick = function () {
  var code = prompt('新增\n请输入【番号】：\n10musume-\nCarib-\nTokyo-Hot \n1000girls-\nHeyzo-\n1pon-', Code_Try).toUpperCase();
  var NewAdd = GM_getValue('NewAdd', '');
  if (NewAdd == '') {
    GM_setValue('NewAdd', code);
  } else if (NewAdd.indexOf(code) >= 0) {
    return;
  } else {
    GM_setValue('NewAdd', NewAdd + '|' + code);
  }
  document.querySelector('#QuickButton_Search').href = 'http://btio.pw/search/' + code;
  document.querySelector('#QuickButton_Apply').style.display = 'inline';
}
document.querySelector('#QuickButton_Abandon').onclick = function () {
  var code = prompt('抛弃\n请输入【番号】：\n10musume-\nCarib-\nTokyo-Hot \n1000girls-\nHeyzo-\n1pon-', Code_Try).toUpperCase();
  var NewDelete = GM_getValue('NewDelete', '');
  if (NewDelete == '') {
    GM_setValue('NewDelete', code);
  } else if (NewDelete.indexOf(code) >= 0) {
    return;
  } else {
    GM_setValue('NewDelete', NewDelete + '|' + code);
  }
  document.querySelector('#QuickButton_Apply').style.display = 'inline';
}
document.querySelector('#QuickButton_Delete').onclick = function () {
  var code = prompt('删除\n请输入【番号】：\n10musume-\nCarib-\nTokyo-Hot \n1000girls-\nHeyzo-\n1pon-', Code_Try).toUpperCase();
  var list = GM_listValues();
  for (i in list) {
    list[i] = GM_getValue(i);
    if (list[i].indexOf(code >= 0)) {
      list[i] = list[i].replace(code, '').replace(/$\|/, '').replace(/\|\|/g, '');
      GM_setValue(i, list[i])
    }
  }
  delete list;
  document.querySelector('#QuickButton_Apply').style.display = 'inline';
}
document.querySelector('#QuickButton_Change').onclick = function () {
  var code_all = prompt('更改\nWait2OK\n请输入【番号】，以[|]分割：', Code_Try).toUpperCase();
  var code = code_all.split('|');
  var Wait_all = GM_getValue('0');
  var Wait = Wait_all.split('|');
  for (var i = 0; i < code.length; i++) {
    for (var n = 0; n < Wait.length; n++) {
      //alert('code['+i+']\n'+Code[i]+'\nWait['+n+']\n'+Wait[n]);
      //alert(code[i]+'\n'+ Wait[n])
      if (code[i] == Wait[n]) {
        Wait.splice(n, 1);
        n = n - 1;
      }
    }
  }
  Wait_New = Wait.join('|');
  //Wait_all = Wait_all.replace(/\|\|/g, '');
  GM_setValue('0', Wait_New);
  GM_setValue('1', GM_getValue(1) + '|' + code_all);
  document.querySelector('#QuickButton_Apply').style.display = 'inline';
}
document.querySelector('#QuickButton_Apply').onclick = function () {
  Add2To1('0', 'NewAdd');
  var OK_all = GM_getValue('1');
  var OK = OK_all.split('|');
  var code_all = GM_getValue('NewDelete');
  var code = code_all.split('|');
  for (var i = 0; i < code.length; i++) {
    for (var n = 0; n < OK.length; n++) {
      //alert('code['+i+']\n'+Code[i]+'\nWait['+n+']\n'+Wait[n]);
      //alert(code[i]+'\n'+ Wait[n])
      if (code[i] == OK[n]) {
        OK.splice(n, 1);
        n = n - 1;
      }
    }
  }
  OK_New = OK.join('|');
  GM_setValue('1', OK_New);
  Add2To1('2', 'NewDelete');
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function QuickButton() {
  var div = document.createElement('div');
  div.id = 'QuickButton'
  var left = document.documentElement.clientWidth - 24;
  div.style = 'background-color:white;text-align:center;position:absolute;left:' + left + 'px; top:0px;z-index:9999;';
  //1开关 搜索 3添加 抛弃 5等待到OK 6应用
  div.innerHTML = '<a href="javascript:void(0)" id="QuickButton_Switch" title="开关"><img src="https://cdn1.iconfinder.com/data/icons/ui-icons-2/512/checkbox-off-01-24.png" /><br /></a><a target="_blank" href="http://btio.pw/search/' + Code_Try + '" id="QuickButton_Search" title="搜索"><img src="https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/48/utorrent.png" width=24 /><br /></a><a href="javascript:void(0)" id="QuickButton_Add" title="添加"><img src="https://cdn2.iconfinder.com/data/icons/flaticons-stroke/16/plus-3-24.png" /><br /></a><a href="javascript:void(0)" id="QuickButton_Abandon" title="抛弃"><img src="https://cdn3.iconfinder.com/data/icons/pictofoundry-pro-vector-set/512/BrokenHeart-24.png" /><br /></a><a href="javascript:void(0)" id="QuickButton_Delete" title="删除"><img src="https://cdn3.iconfinder.com/data/icons/edition/100/trashcan-24.png" /><br /></a><a href="javascript:void(0)" id="QuickButton_Change" title="从[等待]到[OK]"><img src="https://cdn0.iconfinder.com/data/icons/basic-ui-elements-round/700/012_restart-24.png" /><br /></a><a href="javascript:void(0)" style="display:none" id="QuickButton_Apply" title="应用"><img src="https://cdn0.iconfinder.com/data/icons/primitive-round-buttons-overcolor/512/yes-24.png" /><br /></a>';
  document.body.appendChild(div);
}
function SearchResult() {
  var parent = document.querySelectorAll('#list li');
  for (var i = 0; i < parent.length; i++) {
    var href = parent[i].querySelector('a').getAttribute('href');
    var no_video = new RegExp('pcgame|dlsoft|book|doujin|goods', 'gi');
    if (no_video.test(href)) {
      document.querySelector('#list').removeChild(parent[i]);
    }
  }
}
function Add2To1(name1, name2) {
  var all_1 = GM_getValue(name1);
  var all_2 = GM_getValue(name2);
  var all = all_1 + '|' + all_2;
  all = all.replace(/||/g, '');
  GM_setValue(name1, all);
  GM_deleteValue(name2);
}
function DeleteSameCode(name) {
  var array = GM_getValue(name).split('|');
  array.sort();
  for (var i = 0; i < array.length; i++) {
    if (array[i] == array[i + 1]) {
      array.splice(i + 1, 1);
    }
  }
  var all = array.join('|').toUpperCase();
  //console.log('数据库'+name+'  '+all);
  GM_setValue(name, all);
}
function Block() {
  var Code_All = new Array(); //0等待，1完成，2抛弃+女同，3动画，4欧美
  if (GM_getValue('NewAdd', '') == '') {
    Code_All[0] = GM_getValue('0');
  } else {
    Code_All[0] = GM_getValue('0') + '|' + GM_getValue('NewAdd', '');
  }
  Code_All[1] = GM_getValue('1');
  var del = GM_getValue('NewDelete', '');
  if (del != '') {
    var del_array = new Array();
    var del_array = del.split('|');
    for (var i = 0; i < del_array.length; i++) {
      Code_All[1] = Code_All[1].replace(del_array[i], '').replace(/||/g, '');
    }
  }
  if (GM_getValue('NewDelete', '') == '') { //抛弃+女同
    Code_All[2] = GM_getValue('2');
  } else {
    Code_All[2] = GM_getValue('2') + '|' + GM_getValue('NewDelete', '');
  }
  Code_All[3] = 'してあげちゃう-治癒|コワレモノ-璃沙|凌成敗|理-コトワリ|相姦遊戯|相思相愛ノート|相関遊戯|都合のよいセックスフレンド|ヌキどきッ|ピスはめ|ハーレムタイム|ツンツンメイドはエロエロです|Love-Selection|ばくあね|漫喫ハプニング|恋騎士|雨芳恋歌|娘ワレモノ|少女教育|夜這いする七人の孕女|なまイキ|学園で時間よ止まれ|女子校生の腰つき|メイドさんとボイン魂|デーモンバスターズ|小悪魔カノジョ|3PingLovers|イエナイコト'; //英文无效
  //Code_All[6]='1By-Day.14.02.15|EuroTeenErotica.14.01.30|EuroTeenErotica.14.04.17|EuroTeenErotica.15.06.22|EuroTeenErotica.15.08.24|EuroTeenErotica.15.01.01';
  for (var i = 0; i < Code_All.length; i++) {
    console.log(Code_All[i])
  }
  img_status_All_1 = 'Loading|OK|Abandoned|Flash';
  img_status_All = img_status_All_1.split('|');
  span_status_All_1 = 'yellow|green|black|green';
  span_status_All = span_status_All_1.split('|');
  href_status_All_1 = '#等待中|#已下载|#已删除|#已下载_动画';
  href_status_All = href_status_All_1.split('|');
  var URL_NeedChange = new RegExp('bt|tokyo-hot.com|www.caribbeancom.com|www.1000giri.net|www.10musume.com|www.heyzo.com|1pondo.tv', 'gi');
  if (URL_NeedChange.test(URL)) {
    for (var a = 0; a < Code_All.length; a++) {
      Code_All[a] = Code_All[a].replace(/10musume-/gi, '').replace(/Carib-/gi, '').replace(/Tokyo-Hot /gi, '').replace(/1000girls-/gi, '').replace(/Heyzo-/gi, '').replace(/1pon-/gi, '');
    }
  }
  var URL_img = new RegExp('av|dmm.co.jp|tokyo-hot.com|www.10musume.com|www.1000giri.net|heyzo.com|1pondo.tv', 'gi'); //图片
  if (URL_img.test(URL)) {
    var div_img = 'img';
    var img = document.querySelectorAll(div_img);
  }
  var URL_span = new RegExp('bt|www.baidu.com|www.google.co|dmm.co.jp|jav', 'gi'); //文字
  if (URL_span.test(URL)) {
    var div_span = 'div.c-abstract,h3 a,h3.r a,span.st,a.tag,div.file,div.tags-box+h3,table.mg-b20 tbody td,td.torrent_name a,pre.snippet,h1';
    /*
  百度：div.c-abstract,h3 a
  谷歌：h3.r a,span.st
  BTSOW：a.tag,div.file
  DMM:table.mg-b20 tbody td
  BTDIGG:td.torrent_name a,pre.snippet
  *:h1
  */
    var span = document.querySelectorAll(div_span);
    //console.log(span);
  }
  var URL_href = new RegExp('www.caribbeancom.com', 'gi'); //链接
  if (URL_href.test(URL)) {
    var div_href = '.list-area a>img,#slider-recom a img,#slider-rank a img,#slider-latest a img,.w-940 a img,#main-content a img'; //Carib
    var href = document.querySelectorAll(div_href);
    console.log(href);
  }
  for (num0 = 0; num0 < Code_All.length; num0++) {
    var Code = new Array();
    Code = Code_All[num0].toLowerCase().split('|');
    for (var i = 0; i < Code.length; i++) { //删除空元素
      if (Code[i] == '' || typeof (Code[i]) == 'undefined') {
        Code.splice(i, 1);
        i = i - 1;
      }
    }
    var img_status_1 = img_status_All[num0];
    img_status = 'https://raw.githubusercontent.com/dodying/HentaiVersePlus/master/HV/Temp/' + img_status_1 + '.png';
    var span_status = span_status_All[num0];
    var href_status = href_status_All[num0];
    for (num1 = 0; num1 < Code.length; num1++) {
      var Code_Find = new Array();
      Code_Find = Code[num1].toLowerCase().split('-');
      var OK_0 = '';
      for (i = 0; i < Code_Find.length; i++) {
        OK_0 += '1';
      }
      if (URL_img.test(URL)) {
        for (num2 = 0; num2 < img.length; num2++) {
          var ok = '';
          if (num0 == 3) {
            var img_2 = img[num2].getAttribute('alt') || '';
          } else {
            var img_1 = img[num2].getAttribute('blocksrc') || img[num2].getAttribute('src');
            var img_2 = img_1.toLowerCase().replace(/http:\/\/(pics|p)\.dmm\.(co\.jp|com).*\//, '');
          }
          for (num3 = 0; num3 < Code_Find.length; num3++) {
            if (img_2.indexOf(Code_Find[num3]) >= 0) {
              ok += '1';
              if (ok == OK_0) {
                img[num2].setAttribute('blocksrc', img_1);
                img[num2].setAttribute('src', img_status);
              }
            }
          }
        }
      }
      if (URL_span.test(URL)) {
        for (num4 = 0; num4 < span.length; num4++) {
          var ok = '';
          var span_1 = span[num4].innerHTML.toLowerCase();
          for (num5 = 0; num5 < Code_Find.length; num5++) {
            if (span_1.indexOf(Code_Find[num5]) >= 0) {
              ok += '1';
              if (ok == OK_0) {
                var Code_Find_RegExp = new RegExp(Code_Find[num5 - 1], 'gi');
                var style = '<b style="background-color:' + span_status + '">';
                span[num4].innerHTML = span[num4].innerHTML.replace(Code_Find_RegExp, style + Code_Find[num5 - 1].toUpperCase() + '</b>').replace(Code_Find[num5], style + Code_Find[num5] + '</b>');
              }
            }
          }
        }
      }
      if (URL_href.test(URL)) {
        //console.log('href.length=' + href.length);
        for (num6 = 0; num6 < href.length; num6++) {
          var ok = '';
          var href_1 = href[num6].parentNode.getAttribute('href').toLowerCase();
          //console.log('href[' + num6 + ']=' + href_1)
          for (num7 = 0; num7 < Code_Find.length; num7++) {
            if (href_1.indexOf(Code_Find[num7]) >= 0) {
              ok += '1';
              if (ok == OK_0) {
                //console.log('OK')
                //href[num6].setAttribute('href', href_1 + href_status);
                //if (href[num6].querySelector('img')) {
                var img_1 = href[num6].getAttribute('src');
                href[num6].setAttribute('blocksrc', img_1);
                href[num6].setAttribute('src', img_status);
                //}
              }
            }
          }
        }
      }
    }
  }
  document.querySelector('#QuickButton_Switch img').src = 'https://cdn1.iconfinder.com/data/icons/ui-icons-2/512/checkbox-on-green-01-24.png';
  if (document.title.indexOf('BTSOW') >= 0) {
    document.querySelector('#QuickButton_Search').style.display = 'none';
  }
  if (GM_getValue('NewAdd', '') != '' || GM_getValue('NewDelete', '') != '') {
    document.querySelector('#QuickButton_Apply').style.display = 'inline';
  }
}
function TurnOffBlock() {
  var img = document.querySelectorAll('img');
  for (var i = 0; i < img.length; i++) {
    var img_url = img[i].getAttribute('blocksrc') || '';
    if (img_url != '') {
      img[i].setAttribute('src', img_url);
      img[i].removeAttribute('blocksrc');
    }
  }
}
function CodeTry(URL) {
  switch (window.location.host) {
    case 'www.dmm.co.jp':
      if (URL.toUpperCase().match(/[a-zA-Z]+(\-|)[0-9]+/)) {
        var Code_Try = URL.toUpperCase().match(/[a-zA-Z]+(\-|)[0-9]+/) [0];
      } else {
        var Code_Try = URL;
      }
      break;
    case 'btio.pw':
      var Code_Try = URL.replace(/.*search\//, '');
      break;
    case 'www.caribbeancom.com':
      var Code_Try = URL.replace(/.*moviepages\/(.*)\/index.html/, 'Carib-$1');
      break;
    case 'www.heyzo.com':
      var Code_Try = URL.replace(/.*moviepages\/(.*)\/index.html/, 'Heyzo-$1');
      break;
  }
  return Code_Try;
}
