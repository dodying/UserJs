// ==UserScript==
// @name        EH_QuickSearch
// @name:zh-CN  【EH】EH快捷搜索
// @namespace   Dodying
// @author      Dodying
// @description Add a button to top-right; Left Click:choose the keywords;Right Click:search in other site;
// @description:zh-CN 在右上角添加一个按钮；左键：选择搜索关键词，右键：在其他站点搜索
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
// @version     1.02
// @grant       none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @run-at      document-idle
// require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// ==/UserScript==
var bookname;
(window.location.href.indexOf('hentai.org/g/') < 0) ? bookname = document.querySelector('input.stdinput,form>input[name="favcat"]+div>input').value : bookname = document.querySelector('#gn').innerHTML;
bookname = bookname.replace(/"/g, '%22').replace(/ /g, '+');
(window.location.host == 'g.e-hentai.org') ? exurl = window.location.href.replace('g.e-', 'ex')  : exurl = window.location.href.replace('ex', 'g.e-');
var EH_QuickSearch_Button = document.createElement('div');
EH_QuickSearch_Button.id = 'EH_QuickSearch_Button';
EH_QuickSearch_Button.oncontextmenu = function () {
  return false
};
EH_QuickSearch_Button.style = 'left:' + eval(document.documentElement.clientWidth - 32) + 'px;top:0px;position:absolute;';
var EH_QuickSearch_Button_innerHTML = '<div onmousedown="switch (event.button){case 0:var div = document.querySelector(\'#EH_QuickSearch_box\');break;case 2:var div = document.querySelector(\'#SearchInOtherSite\');break;};(div.style.display == \'none\') ? div.style.display = \'inline\' : div.style.display = \'none\';"><img src="https://cdn0.iconfinder.com/data/icons/basic-ui-elements-round/700/09_search-32.png" /></a></div><div id="SearchInOtherSite" style="display:none">';
EH_QuickSearch_Button_innerHTML += '<a href="' + exurl + '"" target="_blank"><img width="32px" src="http://exhentai.org/favicon.ico" /></a>';
EH_QuickSearch_Button_innerHTML += '<a href="http://nhentai.net/search/?q=' + bookname + '" target="_blank"><img src="http://nhentai.net/favicon.ico" /></a>';
EH_QuickSearch_Button_innerHTML += '<a href="https://hitomi.la/search.html?' + bookname + '" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADMklEQVRYhe2X609TZxyA/WdKjyg9p0KgoxfatTUBdQhqwmWaCV8UdLanCm3DkE5cFTRxuuzTtszbVLIv+6iCE3WI2iXbKBXxAqJzeNmSRYG2pn38QKlQjohQ5j7wS57knOS8vzznvf7eJUu1Jt4nS/6XAoLWRIZGr4BhxmRq0YhaNExDkIyzFxAkIyvyV7KxejvVW2SqElRvlSn/pAZNrlUx0fIcCw2+/Xx/4gzfHTud5Nujpygpq0ItKstPE1CLBgrXVvLno2Gi0SjhSIRwJEI0+pK+/jsYrMWKf6TJtdJ5+SqpEYvFcbl9qLL0sxcoKvmYp8/+npbs3sB9DLbpAoJkJO8DOz//cIp/A9cYfXCfeCw2SaBp4QQErYl8nZVvqjbzu0cm6JHpa27kn2td4wLxOLK7CVVWPmrJiJBugUytCX95JSGvi2BCoKfewS2/j/DwX4w9eUxbk4/W8go+/WgdObmWKRLzEhAkE6Z8Gx07agl55aRA0CMT9Lp4cPo4tw+1EPLI3PS66PHIfLlxE2KOOT0CaslIsaWIwK4d9HpSBCZwO5PPvR6ZQJ2D9dZVqBM55ilgwqK30+ncRm9qD8xA7ZpSMuYsYC1OrmlBSsyBsoo390AKf7idbC4snpvAwOAQ1qINiHlWJJ0NSWdDzLNhKSiirWbLWyVCXhcdjlosejuCNIc5MDo2xo1ff6OrOzCFX7oDhK7f4O7Xh6aM+eSxv+l1cUXeTs3q0rkvw7fFyOAAfX7fuITbSbDeQWi3h/MuB/6yCtaYC8mczz4wm3jSfpaeegd9ext59NOPPL/dT93OBlQafXLmL6hA+PEwD9tOMjJ4D+KxSTthGrbi2UQ8FiMWCSff03oWvBgZ4eLlLs61X+RcR+cU2i9cUmyT3sNocIiClSVkrihgebY5ybJsM1qdnUtXuhdYILERKdcDH85QDyzgcfxaYKaCZFFgUWBR4B3KckEyklewisY9LfgPHMHfepjdzQf47PMWHLsa0ersiomWZZvZ5vSy7+BX+FuPJPmi9TCFaytRi8q3I+WrmWQkQ6NHNZms8euZ0vcTZIgGVFkp7TT6d7ua/de8d4FXbI5vop5oew4AAAAASUVORK5CYII=" /></a>';
EH_QuickSearch_Button_innerHTML += '<a href="https://members.luscious.net/c/-/albums/search/?q=' + bookname + '" target="_blank"><img width="32px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC20lEQVQ4jWWTTW/jVBSGkwWzZ4BJ2jSOYzv2tR3b14lrJ3HaNM6HmjRlUkqaikEIBNLwPaCBTVlEQmKDRmwAoW4BseUHjNjBDvG5hV/RH/CwSDsdYHEWd3Gfc+8575MrFJ6hWCxQKm2gKCWq1TK1moplaQihYds6tq0jxPpsmiq6rlCplNja2iBXLN5ic7OIopTQdQXTVHEcA9+3CAILKQVSCoLAwvctHMd4BFGUErnHL1uWRr1eIwxtosgljj2SxCOO1xVFLlIKXHcNqVbL5MrlTXRdQQgN37eIIpd2O6DXa/JCa5fvKi9yri/5+eZbfFu+Qxx7hKGN4xjUaiq5arWMaVbxPJMocklTSZZt8/JuxsWNM87iQ/b3OzzX34X8ik+NOVHk4vsWlqWRM4wKjmPQaNi02wFZts1kkvLbrXchv2I+3+P27R6vZWPIrzjXl7RaPmFoI4RGzjSr+L5FHHv0ek3G4zbv9w4gv+KP4j0WiyEPkhN+Kr0J+RWvb4/odCSNho1t6+SE0AjD6+7TacrX9Zcgv+LP4nucno75++Z9Lm58xBf+ksEg/jfg6vmdjmQwiJnNdvjmEvBD7Q1OT8csFkPm8z2m05Qsi2m3g+svuK5Bs+nQ7YYMhwmz2Q7fW69CfsUn2YLlcsTxccZ8vsdkktLvRySJRxBcDvG/gIODLn89eZ+H+l2WyxGLxZCjoz6HhzuMx21maYs49vB9C9NUrwFpKvlMHPPr0+9AfsXvhXs81O7yIDnhznTAdJrysfcsX6kLosjFdS9z4DgGYWjzpfI85Ff88tTbfO4t+fFy6ld18cQZ59oJSeIhpUAIDV1X1mus12v0peQVv0ev1yTLYkajFkd7O3wYTvhA7tPthiTJOoVX3SuVErnHY9xsOsSxR6cj6XZDut2QTkeSJP/3QFW31jaq6haGUUGItUhSChqNtUxR5NJo2Egp8DwT29YfSVQub7KxUeAfIUS0N3dit9AAAAAASUVORK5CYII=" /></a>';
EH_QuickSearch_Button_innerHTML += '</div>';
EH_QuickSearch_Button.innerHTML = EH_QuickSearch_Button_innerHTML;
document.body.appendChild(EH_QuickSearch_Button);
/*分割线*/
var EH_QuickSearch_box = document.createElement('div');
EH_QuickSearch_box.id = 'EH_QuickSearch_box';
var bgcolor;
(window.location.host == 'g.e-hentai.org') ? bgcolor = '#E3E0D1' : bgcolor = '#34353B';
EH_QuickSearch_box.style = 'z-index:999;width:600px;display:none;background-color:' + bgcolor + ';position:absolute;left:' + eval(document.documentElement.clientWidth / 2 - 300) + 'px;top:240px;border-color:black;border-style:solid;';
EH_QuickSearch_box.innerHTML = '<div id="EH_QuickSearch_exchange"><div style="font-size:larger;">跳转</div></div><div id="EH_QuickSearch_popular"><div style="font-size:larger;">常用</div></div><div id="EH_QuickSearch_used"><div style="font-size:larger;">已使用</div></div><br /><br /><br /><div id="EH_QuickSearch_other"><div style="font-size:larger;">其他</div></div><br /><br /><button id="EH_QuickSearch_apply">应用</button><button id="EH_QuickSearch_cancel">取消</button>';
document.body.appendChild(EH_QuickSearch_box);
document.querySelector('#EH_QuickSearch_box').onclick = function () {
  document.querySelector('#EH_QuickSearch_apply').focus();
}
document.querySelector('#EH_QuickSearch_apply').onclick = function () {
  var input_check = document.querySelectorAll('#EH_QuickSearch_box input:checked');
  var keyword_new = '';
  for (var i = 0; i < input_check.length; i++) {
    keyword_new += input_check[i].name + ' ';
    search_bar.value = keyword_new;
  }
  document.querySelector('#EH_QuickSearch_box').style.display = 'none';
  /*if (confirm('关键词为' + search_bar.value + '\r\n是否立即搜索'))*/
  if (window.location.href.indexOf('hentai.org/favorites.php') >= 0) {
    document.querySelector('input.stdbtn:nth-child(1)').click();
  } else {
    document.querySelector('input.stdbtn:nth-child(2)').click();
  }
}
document.querySelector('#EH_QuickSearch_cancel').onclick = function () {
  document.querySelector('#EH_QuickSearch_box').style.display = 'none';
}
var keyword_all = {
  'language:chinese$': '中文',
  'harem': '后宫',
  'uncensored': '无码',
  'tankoubon': '单行本',
  'incest': '乱伦',
  'female:lolicon$': '萝莉',
  '-futanari': '-扶她',
  '-tentacles': '-触手',
  '-insect': '-昆虫',
  '-monster': '-怪物',
  '-bestiality': '-兽奸',
  '-wore': '-丸吞',
  '-worm': '-虫子',
  '-amputee': '-残肢',
  '-female:"females only$"': '-只有女性',
  '-male:"males only$"': '-只有男性',
  '-yuri': '-女同',
  '-yaoi': '-男同',
  '-netorare': '-NTR',
  '-female:guro$': '-猎奇',
  '-female:scat$': '-排泄',
  '-ryona': '-虐待',
  '-female:rape$': '-强奸',
  '-furry': '-毛皮（动物）'
};
var keyword_exchange = [
  {
    'name': 'E-Hentai',
    'img': 'http://exhentai.org/favicon.ico',
    'url': exurl
  },
  {
    'name': 'nHentai',
    'img': 'http://nhentai.net/favicon.ico',
    'url': 'http://nhentai.net/search/?q=' + bookname
  },
  {
    'name': 'Hitomi',
    'img': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADMklEQVRYhe2X609TZxyA/WdKjyg9p0KgoxfatTUBdQhqwmWaCV8UdLanCm3DkE5cFTRxuuzTtszbVLIv+6iCE3WI2iXbKBXxAqJzeNmSRYG2pn38QKlQjohQ5j7wS57knOS8vzznvf7eJUu1Jt4nS/6XAoLWRIZGr4BhxmRq0YhaNExDkIyzFxAkIyvyV7KxejvVW2SqElRvlSn/pAZNrlUx0fIcCw2+/Xx/4gzfHTud5Nujpygpq0ItKstPE1CLBgrXVvLno2Gi0SjhSIRwJEI0+pK+/jsYrMWKf6TJtdJ5+SqpEYvFcbl9qLL0sxcoKvmYp8/+npbs3sB9DLbpAoJkJO8DOz//cIp/A9cYfXCfeCw2SaBp4QQErYl8nZVvqjbzu0cm6JHpa27kn2td4wLxOLK7CVVWPmrJiJBugUytCX95JSGvi2BCoKfewS2/j/DwX4w9eUxbk4/W8go+/WgdObmWKRLzEhAkE6Z8Gx07agl55aRA0CMT9Lp4cPo4tw+1EPLI3PS66PHIfLlxE2KOOT0CaslIsaWIwK4d9HpSBCZwO5PPvR6ZQJ2D9dZVqBM55ilgwqK30+ncRm9qD8xA7ZpSMuYsYC1OrmlBSsyBsoo390AKf7idbC4snpvAwOAQ1qINiHlWJJ0NSWdDzLNhKSiirWbLWyVCXhcdjlosejuCNIc5MDo2xo1ff6OrOzCFX7oDhK7f4O7Xh6aM+eSxv+l1cUXeTs3q0rkvw7fFyOAAfX7fuITbSbDeQWi3h/MuB/6yCtaYC8mczz4wm3jSfpaeegd9ext59NOPPL/dT93OBlQafXLmL6hA+PEwD9tOMjJ4D+KxSTthGrbi2UQ8FiMWCSff03oWvBgZ4eLlLs61X+RcR+cU2i9cUmyT3sNocIiClSVkrihgebY5ybJsM1qdnUtXuhdYILERKdcDH85QDyzgcfxaYKaCZFFgUWBR4B3KckEyklewisY9LfgPHMHfepjdzQf47PMWHLsa0ersiomWZZvZ5vSy7+BX+FuPJPmi9TCFaytRi8q3I+WrmWQkQ6NHNZms8euZ0vcTZIgGVFkp7TT6d7ua/de8d4FXbI5vop5oew4AAAAASUVORK5CYII=',
    'url': 'https://hitomi.la/search.html?' + bookname
  },
  {
    'name': 'Luscious',
    'img': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC20lEQVQ4jWWTTW/jVBSGkwWzZ4BJ2jSOYzv2tR3b14lrJ3HaNM6HmjRlUkqaikEIBNLwPaCBTVlEQmKDRmwAoW4BseUHjNjBDvG5hV/RH/CwSDsdYHEWd3Gfc+8575MrFJ6hWCxQKm2gKCWq1TK1moplaQihYds6tq0jxPpsmiq6rlCplNja2iBXLN5ic7OIopTQdQXTVHEcA9+3CAILKQVSCoLAwvctHMd4BFGUErnHL1uWRr1eIwxtosgljj2SxCOO1xVFLlIKXHcNqVbL5MrlTXRdQQgN37eIIpd2O6DXa/JCa5fvKi9yri/5+eZbfFu+Qxx7hKGN4xjUaiq5arWMaVbxPJMocklTSZZt8/JuxsWNM87iQ/b3OzzX34X8ik+NOVHk4vsWlqWRM4wKjmPQaNi02wFZts1kkvLbrXchv2I+3+P27R6vZWPIrzjXl7RaPmFoI4RGzjSr+L5FHHv0ek3G4zbv9w4gv+KP4j0WiyEPkhN+Kr0J+RWvb4/odCSNho1t6+SE0AjD6+7TacrX9Zcgv+LP4nucno75++Z9Lm58xBf+ksEg/jfg6vmdjmQwiJnNdvjmEvBD7Q1OT8csFkPm8z2m05Qsi2m3g+svuK5Bs+nQ7YYMhwmz2Q7fW69CfsUn2YLlcsTxccZ8vsdkktLvRySJRxBcDvG/gIODLn89eZ+H+l2WyxGLxZCjoz6HhzuMx21maYs49vB9C9NUrwFpKvlMHPPr0+9AfsXvhXs81O7yIDnhznTAdJrysfcsX6kLosjFdS9z4DgGYWjzpfI85Ff88tTbfO4t+fFy6ld18cQZ59oJSeIhpUAIDV1X1mus12v0peQVv0ev1yTLYkajFkd7O3wYTvhA7tPthiTJOoVX3SuVErnHY9xsOsSxR6cj6XZDut2QTkeSJP/3QFW31jaq6haGUUGItUhSChqNtUxR5NJo2Egp8DwT29YfSVQub7KxUeAfIUS0N3dit9AAAAAASUVORK5CYII=',
    'url': 'https://members.luscious.net/c/-/albums/search/?q=' + bookname
  }
];
for (var i = 0; i < keyword_exchange.length; i++) {
  EH_QuickSearch_Add2Exchange(keyword_exchange[i].name, keyword_exchange[i].img, keyword_exchange[i].url);
}
var keyword_popular = [
  {
    'name': 'chinese',
    'name_cn': '中文',
    'url': 'language:chinese$'
  },
  {
    'name': 'harem',
    'name_cn': '后宫',
    'url': 'harem'
  },
  {
    'name': 'uncensored',
    'name_cn': '无码',
    'url': 'uncensored'
  },
  {
    'name': 'tankoubon',
    'name_cn': '单行本',
    'url': 'tankoubon'
  }
]; //var keyword_popular=JSON.parse(window.localStorage.EH_QuickSearch_keyword_popular);
for (var i = 0; i < keyword_popular.length; i++) {
  EH_QuickSearch_Add2Popular(keyword_popular[i].name, keyword_popular[i].name_cn, keyword_popular[i].url);
}
var search_bar = document.querySelector('input.stdinput') || document.querySelector('input.fs');
var keyword_0 = search_bar.value;
keyword_0 = DeleteSpaceInQuotation(keyword_0).replace(/^ | $/, '');
var keyword = keyword_0.split(' ');
//console.log(keyword);
for (i = 0; i < keyword.length; i++) {
  keyword[i] = keyword[i].replace(/_/g, ' ');
  if (keyword[i] in keyword_all) {
    EH_QuickSearch_Add2Used(keyword[i], keyword_all[keyword[i]]);
  } else {
    EH_QuickSearch_Add2Used(keyword[i], keyword[i]);
  }
}
for (name in keyword_all) {
  EH_QuickSearch_Add2Other(name, keyword_all[name]);
}
var keyword_used = document.querySelectorAll('.EH_QuickSearch_used_keyword');
for (var i = 0; i < keyword_used.length; i++) {
  if (i % 10 == 9) {
    keyword_used[i].outerHTML += '<br /><br /><br />';
  }
}
var keyword_other = document.querySelectorAll('.EH_QuickSearch_other_keyword');
for (var i = 0; i < keyword_other.length; i++) {
  if (i % 10 == 9) {
    keyword_other[i].outerHTML += '<br /><br /><br />';
  }
}
SearchInOtherSite();
/////////////////////////////////////////////////
function DeleteSpaceInQuotation(word) {
  //var temp = word.match(/(-(|[a-zA-Z]{1,}:|)|)".*?"/g);
  var temp = word.match(/(-|)((language|artist|parody|male|female|group|character):|)".*?"/g);
  if (temp == null) return word;
  for (var i = 0; i < temp.length; i++) {
    word = word.replace(temp[i], '');
    temp[i] = temp[i].replace(/ /g, '_');
  }
  var temp = temp.join(' ');
  word = temp + word;
  delete temp;
  return word;
}
function EH_QuickSearch_Add2Exchange(name, img, url) {
  var a = document.createElement('a');
  //a.id = 'EH_QuickSearch_exchange_'+name;
  a.href = url;
  a.target = '_blank';
  //a.style = 'float:left;';
  a.innerHTML = '<img src="' + img + '" width="32px" />';
  document.querySelector('#EH_QuickSearch_exchange').appendChild(a);
  a.outerHTML+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
}
function EH_QuickSearch_Add2Popular(name, name_cn, url) {
  var a = document.createElement('a');
  //a.id = 'EH_QuickSearch_popular_'+name;
  a.href = '?f_search=' + url;
  a.target = '_blank';
  //a.style = 'float:left;';
  a.innerHTML = name_cn;
  document.querySelector('#EH_QuickSearch_popular').appendChild(a);
  a.outerHTML+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
}
function EH_QuickSearch_Add2Used(name, name_cn) {
  var div = document.createElement('div');
  div.style = 'float:left;';
  div.className = 'EH_QuickSearch_used_keyword';
  //div.innerHTML = name_cn + '[' + name + ']';
  div.innerHTML = name_cn;
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.name = name;
  input.checked = 'ture';
  div.appendChild(input);
  if (name in keyword_all) delete keyword_all[name];
  document.querySelector('#EH_QuickSearch_used').appendChild(div);
}
function EH_QuickSearch_Add2Other(name, name_cn) {
  var div = document.createElement('div');
  div.style = 'float:left;';
  div.className = 'EH_QuickSearch_other_keyword';
  //div.innerHTML = name_cn + '[' + name + ']';
  div.innerHTML = name_cn;
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.name = name;
  div.appendChild(input);
  if (document.querySelectorAll('.EH_QuickSearch_other_keyword').length % 5 == 0) div.innerHTML += '<br /><br />';
  //if (name in keyword_all) delete keyword_all[name];
  document.querySelector('#EH_QuickSearch_other').appendChild(div);
}
