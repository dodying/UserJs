// ==UserScript==
// @name        [EH]QuickSearch
// @name:zh-CN  [EH]快捷搜索
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description Add a button to top-right; Left Click:choose the keywords;Right Click:search in other site;
// @description:zh-CN 在右上角添加一个按钮；左键：选择搜索关键词，中间：添加\删除关键词：中文，右键：在其他站点搜索
// @include     https://exhentai.org/*
// @include     https://e-hentai.org/*
// @exclude     https://exhentai.org/g/*
// @exclude     https://e-hentai.org/g/*
// @exclude     https://exhentai.org/s/*
// @exclude     https://e-hentai.org/s/*
// @version     1.040
// @grant       none
// @run-at      document-idle
// require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// ==/UserScript==
let bookname = (location.href.indexOf('hentai.org/g/') < 0) ? document.querySelector('input.stdinput,form>input[name="favcat"]+div>input').value : document.querySelector('#gn').innerHTML;
bookname = bookname.replace(/"/g, '%22').replace(/ /g, '+');
const exurl = (location.host === 'e-hentai.org') ? location.href.replace('e-', 'ex') : location.href.replace('ex', 'e-');
const EH_QuickSearch_Button = document.createElement('div');
EH_QuickSearch_Button.id = 'EH_QuickSearch_Button';
EH_QuickSearch_Button.oncontextmenu = function () {
  return false;
};
EH_QuickSearch_Button.onmousedown = function () {
  return false;
};
EH_QuickSearch_Button.style = `left:${eval(window.innerWidth - 58)}px;top:0px;position:absolute;width:32px;`;
let EH_QuickSearch_Button_innerHTML = '<a style="cursor:pointer;" onmousedown="switch (event.button){case 0:var div = document.querySelector(\'#EH_QuickSearch_Box\');break;case 1:document.getElementById(\'EH_QuickSearch_Keyword_language:chinese$\').click();document.getElementById(\'EH_QuickSearch_Apply\').click();;break;case 2:var div = document.querySelector(\'#SearchInOtherSite\');break;};(div.style.display == \'none\') ? div.style.display = \'block\' : div.style.display = \'none\';"><img src="https://cdn0.iconfinder.com/data/icons/basic-ui-elements-round/700/09_search-32.png" /></a><br><div id="SearchInOtherSite" style="display:none">';
EH_QuickSearch_Button_innerHTML = `${EH_QuickSearch_Button_innerHTML}<a href="${exurl}"" target="_blank"><img width="32px" src="http://exhentai.org/favicon.ico" /></a>`;
EH_QuickSearch_Button_innerHTML = `${EH_QuickSearch_Button_innerHTML}<a href="http://nhentai.net/search/?q=${bookname}" target="_blank"><img src="http://nhentai.net/favicon.ico" /></a>`;
EH_QuickSearch_Button_innerHTML = `${EH_QuickSearch_Button_innerHTML}<a href="https://hitomi.la/search.html?${bookname}" target="_blank"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADMklEQVRYhe2X609TZxyA/WdKjyg9p0KgoxfatTUBdQhqwmWaCV8UdLanCm3DkE5cFTRxuuzTtszbVLIv+6iCE3WI2iXbKBXxAqJzeNmSRYG2pn38QKlQjohQ5j7wS57knOS8vzznvf7eJUu1Jt4nS/6XAoLWRIZGr4BhxmRq0YhaNExDkIyzFxAkIyvyV7KxejvVW2SqElRvlSn/pAZNrlUx0fIcCw2+/Xx/4gzfHTud5Nujpygpq0ItKstPE1CLBgrXVvLno2Gi0SjhSIRwJEI0+pK+/jsYrMWKf6TJtdJ5+SqpEYvFcbl9qLL0sxcoKvmYp8/+npbs3sB9DLbpAoJkJO8DOz//cIp/A9cYfXCfeCw2SaBp4QQErYl8nZVvqjbzu0cm6JHpa27kn2td4wLxOLK7CVVWPmrJiJBugUytCX95JSGvi2BCoKfewS2/j/DwX4w9eUxbk4/W8go+/WgdObmWKRLzEhAkE6Z8Gx07agl55aRA0CMT9Lp4cPo4tw+1EPLI3PS66PHIfLlxE2KOOT0CaslIsaWIwK4d9HpSBCZwO5PPvR6ZQJ2D9dZVqBM55ilgwqK30+ncRm9qD8xA7ZpSMuYsYC1OrmlBSsyBsoo390AKf7idbC4snpvAwOAQ1qINiHlWJJ0NSWdDzLNhKSiirWbLWyVCXhcdjlosejuCNIc5MDo2xo1ff6OrOzCFX7oDhK7f4O7Xh6aM+eSxv+l1cUXeTs3q0rkvw7fFyOAAfX7fuITbSbDeQWi3h/MuB/6yCtaYC8mczz4wm3jSfpaeegd9ext59NOPPL/dT93OBlQafXLmL6hA+PEwD9tOMjJ4D+KxSTthGrbi2UQ8FiMWCSff03oWvBgZ4eLlLs61X+RcR+cU2i9cUmyT3sNocIiClSVkrihgebY5ybJsM1qdnUtXuhdYILERKdcDH85QDyzgcfxaYKaCZFFgUWBR4B3KckEyklewisY9LfgPHMHfepjdzQf47PMWHLsa0ersiomWZZvZ5vSy7+BX+FuPJPmi9TCFaytRi8q3I+WrmWQkQ6NHNZms8euZ0vcTZIgGVFkp7TT6d7ua/de8d4FXbI5vop5oew4AAAAASUVORK5CYII=" /></a>`;
EH_QuickSearch_Button_innerHTML = `${EH_QuickSearch_Button_innerHTML}<a href="https://members.luscious.net/c/-/albums/search/?q=${bookname}" target="_blank"><img width="32px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC20lEQVQ4jWWTTW/jVBSGkwWzZ4BJ2jSOYzv2tR3b14lrJ3HaNM6HmjRlUkqaikEIBNLwPaCBTVlEQmKDRmwAoW4BseUHjNjBDvG5hV/RH/CwSDsdYHEWd3Gfc+8575MrFJ6hWCxQKm2gKCWq1TK1moplaQihYds6tq0jxPpsmiq6rlCplNja2iBXLN5ic7OIopTQdQXTVHEcA9+3CAILKQVSCoLAwvctHMd4BFGUErnHL1uWRr1eIwxtosgljj2SxCOO1xVFLlIKXHcNqVbL5MrlTXRdQQgN37eIIpd2O6DXa/JCa5fvKi9yri/5+eZbfFu+Qxx7hKGN4xjUaiq5arWMaVbxPJMocklTSZZt8/JuxsWNM87iQ/b3OzzX34X8ik+NOVHk4vsWlqWRM4wKjmPQaNi02wFZts1kkvLbrXchv2I+3+P27R6vZWPIrzjXl7RaPmFoI4RGzjSr+L5FHHv0ek3G4zbv9w4gv+KP4j0WiyEPkhN+Kr0J+RWvb4/odCSNho1t6+SE0AjD6+7TacrX9Zcgv+LP4nucno75++Z9Lm58xBf+ksEg/jfg6vmdjmQwiJnNdvjmEvBD7Q1OT8csFkPm8z2m05Qsi2m3g+svuK5Bs+nQ7YYMhwmz2Q7fW69CfsUn2YLlcsTxccZ8vsdkktLvRySJRxBcDvG/gIODLn89eZ+H+l2WyxGLxZCjoz6HhzuMx21maYs49vB9C9NUrwFpKvlMHPPr0+9AfsXvhXs81O7yIDnhznTAdJrysfcsX6kLosjFdS9z4DgGYWjzpfI85Ff88tTbfO4t+fFy6ld18cQZ59oJSeIhpUAIDV1X1mus12v0peQVv0ev1yTLYkajFkd7O3wYTvhA7tPthiTJOoVX3SuVErnHY9xsOsSxR6cj6XZDut2QTkeSJP/3QFW31jaq6haGUUGItUhSChqNtUxR5NJo2Egp8DwT29YfSVQub7KxUeAfIUS0N3dit9AAAAAASUVORK5CYII=" /></a>`;
EH_QuickSearch_Button_innerHTML = `${EH_QuickSearch_Button_innerHTML}</div>`;
EH_QuickSearch_Button.innerHTML = EH_QuickSearch_Button_innerHTML;
document.body.appendChild(EH_QuickSearch_Button);
/* 分割线 */
const EH_QuickSearch_Box = document.createElement('div');
EH_QuickSearch_Box.id = 'EH_QuickSearch_Box';
const bgcolor = (location.host === 'e-hentai.org') ? '#E3E0D1' : '#34353B';
EH_QuickSearch_Box.style = `z-index:999;width:400px;display:none;background-color:${bgcolor};position:absolute;left:${eval(window.innerWidth / 2 - 200)}px;top:240px;border-color:black;border-style:solid;transform:scale(1.05);`;
EH_QuickSearch_Box.innerHTML = '<div id="EH_QuickSearch_Exchange"><div style="font-size:larger;">跳转</div></div><div id="EH_QuickSearch_Popular"><div style="font-size:larger;">常用</div></div><div id="EH_QuickSearch_Used"><div style="font-size:larger;">已使用</div></div><div id="EH_QuickSearch_Plus"><div style="font-size:larger;">要选择的</div></div><div id="EH_QuickSearch_Delete"><div style="font-size:larger;">要排除的</div></div><button id="EH_QuickSearch_Apply" class="stdbtn">应用</button><button id="EH_QuickSearch_Cancel" class="stdbtn">取消</button>';
document.body.appendChild(EH_QuickSearch_Box);
document.querySelector('#EH_QuickSearch_Box').onclick = function () {
  document.querySelector('#EH_QuickSearch_Apply').focus();
};
document.querySelector('#EH_QuickSearch_Apply').onclick = function () {
  const input_check = document.querySelectorAll('#EH_QuickSearch_Box input:checked');
  let Keyword_New = '';
  for (let i = 0; i < input_check.length; i++) {
    Keyword_New = `${Keyword_New}${input_check[i].name.replace(/\'\'/g, '"')} `;
    search_bar.value = Keyword_New;
  }
  document.querySelector('#EH_QuickSearch_Box').style.display = 'none';
  /* if (confirm('关键词为' + search_bar.value + '\r\n是否立即搜索')) */
  if (location.href.indexOf('hentai.org/favorites.php') >= 0) {
    document.querySelector('input.stdbtn:nth-child(1)').click();
  } else {
    document.querySelector('input.stdbtn:nth-child(2)').click();
  }
};
document.querySelector('#EH_QuickSearch_Cancel').onclick = function () {
  document.querySelector('#EH_QuickSearch_Box').style.display = 'none';
};
const Keyword_All = {
  'language:chinese$': '中文',
  '-language:translated$': '-翻译本',
  harem: '后宫',
  uncensored: '无码',
  tankoubon: '单行本',
  incest: '乱伦',
  // 'female:lolicon$': '萝莉',
  lolicon: '萝莉',
  '"multi-work series$"': '系列作品',
  '"ffm threesome$"': '二女一男（3P）',
  'parody:"touhou project$"': '东方Project',
  'parody:"kantai collection$"': '舰C',
  'parody:"the idolmaster$"': '偶像大师',
  'parody:"love live$"': 'LL',
  '-futanari': '-扶她',
  '-dilf': '-大叔',
  '-bbm': '-胖男人',
  '-male:"dark skin$"': '-男：黑皮肤',
  '-drugs': '-药物',
  '-"mind control$"': '-精神控制',
  '-"mind break$"': '-心神崩溃',
  '-tentacles': '-触手',
  '-insect': '-昆虫',
  '-monster': '-怪物',
  '-bestiality': '-兽奸',
  '-vore': '-丸吞',
  '-worm': '-虫子',
  '-amputee': '-残肢',
  '-female:"females only$"': '-只有女性',
  '-male:"males only$"': '-只有男性',
  '-yuri': '-女同',
  '-yaoi': '-男同',
  '-netorare': '-NTR',
  '-guro': '-猎奇',
  '-scat': '-排泄',
  '-ryona': '-虐待',
  '-rape': '-强奸',
  '-furry': '-毛皮（动物）',
};
const Keyword_Exchange = [{
  name: 'E-Hentai',
  img: 'http://exhentai.org/favicon.ico',
  url: exurl,
},
{
  name: 'nHentai',
  img: 'http://nhentai.net/favicon.ico',
  url: `http://nhentai.net/search/?q=${bookname}`,
},
{
  name: 'Hitomi',
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADMklEQVRYhe2X609TZxyA/WdKjyg9p0KgoxfatTUBdQhqwmWaCV8UdLanCm3DkE5cFTRxuuzTtszbVLIv+6iCE3WI2iXbKBXxAqJzeNmSRYG2pn38QKlQjohQ5j7wS57knOS8vzznvf7eJUu1Jt4nS/6XAoLWRIZGr4BhxmRq0YhaNExDkIyzFxAkIyvyV7KxejvVW2SqElRvlSn/pAZNrlUx0fIcCw2+/Xx/4gzfHTud5Nujpygpq0ItKstPE1CLBgrXVvLno2Gi0SjhSIRwJEI0+pK+/jsYrMWKf6TJtdJ5+SqpEYvFcbl9qLL0sxcoKvmYp8/+npbs3sB9DLbpAoJkJO8DOz//cIp/A9cYfXCfeCw2SaBp4QQErYl8nZVvqjbzu0cm6JHpa27kn2td4wLxOLK7CVVWPmrJiJBugUytCX95JSGvi2BCoKfewS2/j/DwX4w9eUxbk4/W8go+/WgdObmWKRLzEhAkE6Z8Gx07agl55aRA0CMT9Lp4cPo4tw+1EPLI3PS66PHIfLlxE2KOOT0CaslIsaWIwK4d9HpSBCZwO5PPvR6ZQJ2D9dZVqBM55ilgwqK30+ncRm9qD8xA7ZpSMuYsYC1OrmlBSsyBsoo390AKf7idbC4snpvAwOAQ1qINiHlWJJ0NSWdDzLNhKSiirWbLWyVCXhcdjlosejuCNIc5MDo2xo1ff6OrOzCFX7oDhK7f4O7Xh6aM+eSxv+l1cUXeTs3q0rkvw7fFyOAAfX7fuITbSbDeQWi3h/MuB/6yCtaYC8mczz4wm3jSfpaeegd9ext59NOPPL/dT93OBlQafXLmL6hA+PEwD9tOMjJ4D+KxSTthGrbi2UQ8FiMWCSff03oWvBgZ4eLlLs61X+RcR+cU2i9cUmyT3sNocIiClSVkrihgebY5ybJsM1qdnUtXuhdYILERKdcDH85QDyzgcfxaYKaCZFFgUWBR4B3KckEyklewisY9LfgPHMHfepjdzQf47PMWHLsa0ersiomWZZvZ5vSy7+BX+FuPJPmi9TCFaytRi8q3I+WrmWQkQ6NHNZms8euZ0vcTZIgGVFkp7TT6d7ua/de8d4FXbI5vop5oew4AAAAASUVORK5CYII=',
  url: `https://hitomi.la/search.html?${bookname}`,
},
{
  name: 'Luscious',
  img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC20lEQVQ4jWWTTW/jVBSGkwWzZ4BJ2jSOYzv2tR3b14lrJ3HaNM6HmjRlUkqaikEIBNLwPaCBTVlEQmKDRmwAoW4BseUHjNjBDvG5hV/RH/CwSDsdYHEWd3Gfc+8575MrFJ6hWCxQKm2gKCWq1TK1moplaQihYds6tq0jxPpsmiq6rlCplNja2iBXLN5ic7OIopTQdQXTVHEcA9+3CAILKQVSCoLAwvctHMd4BFGUErnHL1uWRr1eIwxtosgljj2SxCOO1xVFLlIKXHcNqVbL5MrlTXRdQQgN37eIIpd2O6DXa/JCa5fvKi9yri/5+eZbfFu+Qxx7hKGN4xjUaiq5arWMaVbxPJMocklTSZZt8/JuxsWNM87iQ/b3OzzX34X8ik+NOVHk4vsWlqWRM4wKjmPQaNi02wFZts1kkvLbrXchv2I+3+P27R6vZWPIrzjXl7RaPmFoI4RGzjSr+L5FHHv0ek3G4zbv9w4gv+KP4j0WiyEPkhN+Kr0J+RWvb4/odCSNho1t6+SE0AjD6+7TacrX9Zcgv+LP4nucno75++Z9Lm58xBf+ksEg/jfg6vmdjmQwiJnNdvjmEvBD7Q1OT8csFkPm8z2m05Qsi2m3g+svuK5Bs+nQ7YYMhwmz2Q7fW69CfsUn2YLlcsTxccZ8vsdkktLvRySJRxBcDvG/gIODLn89eZ+H+l2WyxGLxZCjoz6HhzuMx21maYs49vB9C9NUrwFpKvlMHPPr0+9AfsXvhXs81O7yIDnhznTAdJrysfcsX6kLosjFdS9z4DgGYWjzpfI85Ff88tTbfO4t+fFy6ld18cQZ59oJSeIhpUAIDV1X1mus12v0peQVv0ev1yTLYkajFkd7O3wYTvhA7tPthiTJOoVX3SuVErnHY9xsOsSxR6cj6XZDut2QTkeSJP/3QFW31jaq6haGUUGItUhSChqNtUxR5NJo2Egp8DwT29YfSVQub7KxUeAfIUS0N3dit9AAAAAASUVORK5CYII=',
  url: `https://members.luscious.net/c/-/albums/search/?q=${bookname}`,
},
];
for (var i = 0; i < Keyword_Exchange.length; i++) {
  EH_QuickSearch_Add2Exchange(Keyword_Exchange[i].name, Keyword_Exchange[i].img, Keyword_Exchange[i].url);
}
const Keyword_Popular = [{
  name: 'chinese',
  name_cn: '中文',
  url: 'language:chinese$',
},
{
  name: 'harem',
  name_cn: '后宫',
  url: 'language:chinese$ harem',
},
{
  name: 'uncensored',
  name_cn: '无码',
  url: 'language:chinese$ uncensored',
},
{
  name: 'tankoubon',
  name_cn: '单行本',
  url: 'language:chinese$ tankoubon',
},
{
  name: 'ffm',
  name_cn: '二女一男（3P）',
  url: 'language:chinese$ "ffm threesome$"',
},
];
for (var i = 0; i < Keyword_Popular.length; i++) {
  EH_QuickSearch_Add2Popular(Keyword_Popular[i].name, Keyword_Popular[i].name_cn, Keyword_Popular[i].url);
}
var search_bar = document.querySelector('input.stdinput') || document.querySelector('input.fs');
const keyword = DeleteSpaceInQuotation(search_bar.value);
// console.log(keyword);
for (i = 0; i < keyword.length; i++) {
  keyword[i] = keyword[i].replace(/_/g, ' ');
  if (keyword[i] in Keyword_All) {
    EH_QuickSearch_Add2Used(keyword[i], Keyword_All[keyword[i]]);
  } else {
    EH_QuickSearch_Add2Used(keyword[i], keyword[i]);
  }
}
for (name in Keyword_All) {
  if (name.match(/^-/)) {
    EH_QuickSearch_Add('-', name, Keyword_All[name]);
  } else {
    EH_QuickSearch_Add('+', name, Keyword_All[name]);
  }
}
EH_QuickSearch_Sort();
/// //////////////////////////////////////////////
function DeleteSpaceInQuotation(word) {
  let temp = word.match(/(-|)((language|artist|parody|male|female|group|character):|)".*?"/g);
  if (temp !== null) {
    for (let i = 0; i < temp.length; i++) {
      word = word.replace(temp[i], '');
      temp[i] = temp[i].replace(/ /g, '_');
    }
    temp = temp.join(' ');
    word = `${temp} ${word}`;
  }
  word = word.replace(/\s+/g, ' ').replace(/^ | $/g, '').split(' ');
  return word;
}

function EH_QuickSearch_Add2Exchange(name, img, url) {
  const a = document.createElement('a');
  // a.id = 'EH_QuickSearch_Exchange_' + name;
  a.href = url;
  a.target = '_blank';
  a.innerHTML = `<img src="${img}" width="32px" />`;
  document.querySelector('#EH_QuickSearch_Exchange').appendChild(a);
  a.outerHTML = `${a.outerHTML}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`; // 空格
}

function EH_QuickSearch_Add2Popular(name, name_cn, url) {
  const a = document.createElement('a');
  // a.id = 'EH_QuickSearch_Popular_' + name;
  a.href = `?f_search=${url.replace(/\s+/g, '+')}`;
  a.target = '_blank';
  a.innerHTML = name_cn;
  document.querySelector('#EH_QuickSearch_Popular').appendChild(a);
  a.outerHTML = `${a.outerHTML}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`;
}

function EH_QuickSearch_Add2Used(name, name_cn) {
  const name_2 = name.replace(/"/g, '\'\'');
  const span = document.createElement('span');
  span.className = 'EH_QuickSearch_Keyword_Used';
  span.innerHTML = `<input type="checkbox" checked="true" id="EH_QuickSearch_Keyword_${name_2}" name="${name_2}" />` + `<label for="EH_QuickSearch_Keyword_${name_2}" style="cursor:pointer;">${name_cn}</label>`;
  if (name in Keyword_All) delete Keyword_All[name];
  document.querySelector('#EH_QuickSearch_Used').appendChild(span);
}

function EH_QuickSearch_Add(type, name, name_cn) {
  const name_2 = name.replace(/"/g, '\'\'');
  const span = document.createElement('span');
  span.innerHTML = `<input type="checkbox" id="EH_QuickSearch_Keyword_${name_2}" name="${name_2}" />` + `<label for="EH_QuickSearch_Keyword_${name_2}" style="cursor:pointer;">${name_cn}</label>`;
  switch (type) {
    case '+':
      span.className = 'EH_QuickSearch_Keyword_Plus';
      document.querySelector('#EH_QuickSearch_Plus').appendChild(span);
      break;
    case '-':
      span.className = 'EH_QuickSearch_Keyword_Delete';
      document.querySelector('#EH_QuickSearch_Delete').appendChild(span);
      break;
  }
}

function EH_QuickSearch_Sort() {
  const EH_QuickSearch_Sort_div = [
    'EH_QuickSearch_Keyword_Used',
    'EH_QuickSearch_Keyword_Plus',
    'EH_QuickSearch_Keyword_Delete',
  ];
  for (let i = 0; i < EH_QuickSearch_Sort_div.length; i++) {
    const div = EH_QuickSearch_Sort_div[i];
    const div_ele = document.getElementsByClassName(div);
    for (let n = 0; n < div_ele.length; n++) {
      if (n % 6 === 5) {
        div_ele[n].outerHTML += '<br>';
      }
    }
  }
}
