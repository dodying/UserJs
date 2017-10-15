// ==UserScript==
// @name        [EHD]CombineArchive2One
// @name:zh-CN  [EHD]合并压缩卷
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description Combine the Archive from EHD A too One Archive
// @description:zh-CN 合并下载自EHD的压缩包
// @include     http*://e-hentai.org/g/*
// @include     http*://exhentai.org/g/*
// @version     1.00b
// @grant       none
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @run-at      document-idle
// ==/UserScript==
var div = document.createElement('div');
var BLeft = document.querySelector('.ehD-box').offsetLeft + 150;
var BTop = document.querySelector('.ehD-box').offsetTop - 20;
div.style = 'color:red;position:absolute;left:' + BLeft + 'px;top:' + BTop + 'px;z-index:999;';
div.innerHTML = '请选择分页数目<select><option></option><option value ="2">2</option><option value ="3">3</option><option value ="4">4</option><option value ="5">5</option><option value ="6">6</option><option value ="7">7</option><option value ="8">8</option><option value ="9">9</option><option value ="10">10</option></select><button style="display:none;">第1次下载</button><button style="display:none;">下载BAT文件</button>';
div.querySelector('select').onchange = function () {
  var amount = this.value;
  var pages = document.querySelector('#gdd > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)').innerHTML.replace(' pages', '');
  var page_avg = parseInt(pages / amount);
  var page = new Array;
  var temp = 1;
  for (var i = 0; i < amount; i++) {
    page[i] = temp + '-' + eval(temp + page_avg);
    temp += page_avg + 1;
  }
  page[amount - 1] = page[amount - 1].replace(/\-.*/, '-' + pages);
  //console.log(page);
  div.querySelectorAll('button') [0].style.display = '';
  div.querySelectorAll('button') [1].style.display = '';
  window.EHD_DPR_page = page;
  window.EHD_DPR_time = 1;
}
div.querySelectorAll('button') [0].onclick = function () {
  var time = window.EHD_DPR_time;
  var page = window.EHD_DPR_page;
  if (time == page.length) {
    this.innerHTML = '已完成';
  } else if (time > page.length) {
    return;
  } else {
    this.innerHTML = '第' + eval(time + 1) + '次下载';
  }  //document.querySelector('div.g2:nth-child(5) > a:nth-child(2) > label:nth-child(1) > input:nth-child(1)').focus();
  //document.querySelector('div.g2:nth-child(3)').click();

  document.querySelector('div.g2:nth-child(5) > a:nth-child(2) > label:nth-child(1) > input:nth-child(1)').value = page[time - 1];
  window.EHD_DPR_time++;
}
div.querySelectorAll('button') [1].onclick = function () {
  var amount = div.querySelector('select').value;
  var name = document.querySelector('#gn').innerHTML.replace(/\|/g, '-');
  download(name, amount);
}
document.body.appendChild(div);
//var size = document.querySelector('#gdd > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)').innerHTML;
//download('[Kuroneko Smith] Kaa-san no Ana Tsukawasete ~Kouhen~ [Chinese] [翻譯機腦補漢化]', '3');
///////////////////////////////////////////////////////////////////////////////////
function download(name, amount) {
  if (!localStorage.Directory_7z) { //localStorage.removeItem('Directory_7z');
    localStorage.Directory_7z = prompt('请输入7Z命令符的绝对位置:\n可以有英文，Bat文件中加入了将CMD临时转换为UTF-8格式的语句', 'D:\\Program Files\\7z\\7z.exe');
  }
  var Directory_7z = localStorage.Directory_7z;
  var content = '\r\n';
  content += 'chcp 65001\r\n';
  content += '@echo off\r\n';
  content += '"' + Directory_7z + '"' + ' x -r "' + name + '.zip" -o"%cd%\\' + name + '\\"\r\n';
  for (var i = 1; i < amount; i++) {
    content += '"' + Directory_7z + '"' + ' x -r -x!info.txt "' + name + '(' + i + ').zip" -o"%cd%\\' + name + '\\"\r\n';
  }
  content += '"' + Directory_7z + '" a "' + name + '.rar" "' + name + '\\" -r -mx0\r\n';
  content += 'rd /s /q "' + name + '\\"\r\n';
  content += 'for /f "tokens=* delims=" %%a in (\'dir /s /b "' + name + '.zip"\') do (set /a PreSize=%%~za/1024/1024)\r\n';
  for (var i = 1; i < amount; i++) {
    content += 'for /f "tokens=* delims=" %%a in (\'dir /s /b "' + name + '(' + i + ').zip"\') do (set /a PreSize=%%~za+%PreSize%)\r\n';
  }
  content += 'for /f "tokens=* delims=" %%a in (\'dir /s /b "' + name + '.rar"\') do (set /a Size=%%~za)\r\n';
  content += 'set /a Check=%Size%/50\r\n';
  content += 'set /a Differ=%PreSize%-%Size%\r\n';
  content += 'if %Differ% lss %Check% (del "' + name + '*.zip")\r\n';
  content += 'del "' + name + '.bat"';
  console.log(content);
  var blob = new Blob([content], {
    type: 'application/bat;charset=utf-8'
  });
  saveAs(blob, name + '.bat');
}
