// ==UserScript==
// @name        EH_SortBook
// @name:zh-CN  【EH】搜索结果排序
// @author      Dodying
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
/*
var script=document.createElement('script');
script.innerHTML='setTimeout(function(){var ex1=new tableSort(".itg",1,2,999,"up","down","hov")},10000);var tableSort=function(){this.initialize.apply(this,arguments)};tableSort.prototype={initialize:function(tableId,clickRow,startRow,endRow,classUp,classDown,selectClass){this.Table=document.querySelector(tableId);this.rows=this.Table.rows;this.Tags=this.rows[clickRow-1].cells;this.up=classUp;this.down=classDown;this.startRow=startRow;this.selectClass=selectClass;this.endRow=(endRow==999?this.rows.length:endRow);this.T2Arr=this._td2Array();this.setShow()},setShow:function(){var defaultClass=this.Tags[0].className;for(var Tag,i=0;Tag=this.Tags[i];i++){Tag.index=i;addEventListener(Tag,"click",Bind(Tag,statu))}var _this=this;var turn=0;function statu(){for(var i=0;i<_this.Tags.length;i++){_this.Tags[i].className=defaultClass}if(turn==0){addClass(this,_this.down);_this.startArray(0,this.index);turn=1}else{addClass(this,_this.up);_this.startArray(1,this.index);turn=0}}},colClassSet:function(num,cla){for(var i=(this.startRow-1);i<(this.endRow);i++){for(var n=0;n<this.rows[i].cells.length;n++){removeClass(this.rows[i].cells[n],cla)}addClass(this.rows[i].cells[num],cla)}},startArray:function(aord,num){var afterSort=this.sortMethod(this.T2Arr,aord,num);this.array2Td(num,afterSort)},_td2Array:function(){var arr=[];for(var i=(this.startRow-1),l=0;i<(this.endRow);i++,l++){arr[l]=[];for(var n=0;n<this.rows[i].cells.length;n++){arr[l].push(this.rows[i].cells[n].innerHTML)}}return arr},array2Td:function(num,arr){this.colClassSet(num,this.selectClass);for(var i=(this.startRow-1),l=0;i<(this.endRow);i++,l++){for(var n=0;n<this.Tags.length;n++){this.rows[i].cells[n].innerHTML=arr[l][n]}}},sortMethod:function(arr,aord,w){arr.sort(function(a,b){x=killHTML(a[w]);y=killHTML(b[w]);x=x.replace(/,/g,"");y=y.replace(/,/g,"");switch(isNaN(x)){case false:return Number(x)-Number(y);break;case true:return x.localeCompare(y);break}});arr=aord==0?arr:arr.reverse();return arr}};function addEventListener(o,type,fn){if(o.attachEvent){o.attachEvent("on"+type,fn)}else{if(o.addEventListener){o.addEventListener(type,fn,false)}else{o["on"+type]=fn}}}function hasClass(element,className){var reg=new RegExp("(\\s|^)"+className+"(\\s|$)");return element.className.match(reg)}function addClass(element,className){if(!this.hasClass(element,className)){element.className+=" "+className}}function removeClass(element,className){if(hasClass(element,className)){var reg=new RegExp("(\\s|^)"+className+"(\\s|$)");element.className=element.className.replace(reg," ")}}var Bind=function(object,fun){return function(){return fun.apply(object,arguments)}};function killHTML(str){return str.replace(/<[^>]+>/g,"")};'
document.head.appendChild(script);*/
