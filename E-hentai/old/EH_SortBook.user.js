// ==UserScript==
// @name        EH_SortBook
// @name:zh-CN  【EH】搜索结果排序
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description:zh-CN
// @include     http*://exhentai.org/*
// @exclude     http*://exhentai.org/g/*
// @version     1
// @grant       none
// @run-at      document-idle
// ==/UserScript==
var button = document.createElement('button');
button.innerHTML = '排序';
button.className = 'stdbtn';
button.style.zIndex= '999';
button.style.position= 'absolute';
button.style.top= '200px';
button.style.left= window.innerWidth-200+'px';
button.onclick = function () {
  var BookDiv = document.querySelectorAll('.it5>a');
  var BookTr = document.querySelectorAll('.gtr0,.gtr1');
  var BookName = [
  ];
  var BookIndex = {
  };
  var BookHTML = [
  ];
  console.log(1);
  for (var i = 0; i < BookDiv.length; i++) {
    BookName.push(BookDiv[i].innerHTML);
    BookIndex[BookDiv[i].innerHTML] = i;
  }
  BookName.sort();
  for (var i = 0; i < BookName.length; i++) {
    if (BookName[i] in BookIndex) {
      BookHTML.push(BookTr[BookIndex[BookName[i]]].outerHTML);
    }
  }
  if (document.querySelector('#EH_CheckForNew')) {
    document.querySelector('.itg>tbody').innerHTML = document.querySelector('.itg>tbody>tr').outerHTML + document.querySelector('#EH_CheckForNew').outerHTML + BookHTML.join('');
  } else {
    document.querySelector('.itg>tbody').innerHTML = document.querySelector('.itg>tbody>tr').outerHTML + BookHTML.join('');
  }
  this.style.display = 'none';
}
document.body.appendChild(button);
