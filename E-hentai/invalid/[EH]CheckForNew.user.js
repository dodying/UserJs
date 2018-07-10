// ==UserScript==
// @name        [EH]CheckForNew
// @name:zh-CN  [EH]检查新本子
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description A monitor for EH
// @description:zh-CN 详见帮助
// @include     https://e-hentai.org/
// @include     https://e-hentai.org/?*
// @include     https://e-hentai.org/tag/*
// @include     https://e-hentai.org/g/*
// @include     https://e-hentai.org/uploader/*
// @include     https://e-hentai.org/favorites.php*
// @include     https://exhentai.org/
// @include     https://exhentai.org/?*
// @include     https://exhentai.org/tag/*
// @include     https://exhentai.org/g/*
// @include     https://exhentai.org/uploader/*
// @include     https://exhentai.org/favorites.php*
// @version     1.00
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addStyle
// @run-at      document-idle
// ==/UserScript==
var EH_CheckForNew_Button = document.createElement('span');
EH_CheckForNew_Button.innerHTML = '<img src="http://exhentai.org/img/mr.gif" alt=""><a id="EH_CheckForNew_Add" href="javascript:#"> 保存</a><img src="http://exhentai.org/img/mr.gif" alt=""><a id="EH_CheckForNew_All" href="javascript:#"> 列表</a>';
//EH_CheckForNew_Button.style = 'position:absolute;left:' + eval(document.documentElement.clientWidth - 150) + 'px;top:0px;z-index:999;';
EH_CheckForNew_Button.querySelector('#EH_CheckForNew_Add').onclick = function() {
  var Url = window.location.href;
  var Id = getEmpty();
  var FavUrl, FavSort;
  if (!GM_getValue('FavUrl')) {
    FavUrl = {};
    FavUrl[Url] = 1;
    FavSort = [1];
  } else {
    FavUrl = GM_getValue('FavUrl');
    FavSort = GM_getValue('FavSort');
    //console.log(FavUrl)
    //console.log(Url in FavUrl)
    if (Url in FavUrl) {
      alert('已经收藏！');
      return;
    } else {
      FavUrl[Url] = Id;
      FavSort.unshift(Id);
    }
  }
  var BookName, LastPost, Keyword;
  if (document.querySelector('h1#gn')) {
    BookName = document.querySelector('h1#gn').innerText.replace(/\[.*?\]|\(.*?\)|【.*?】/g, '').replace(/^\s+|\s+$/g, '');
    LastPost = document.querySelector('.itd').innerText;
    Keyword = BookName;
  } else {
    BookName = '';
    LastPost = document.querySelector('tr.gtr1:nth-child(3) > td:nth-child(2)').innerText;
    Keyword = document.querySelector('input.stdinput,form>input[name="favcat"]+div>input').value;
  }
  var Title = prompt('请输入名称', BookName);
  if (!Title) return false;
  Title = Title.replace(/\[\d+(\/|\-)\d+(\/|\-)\d+\]/, '');
  GM_setValue('FavUrl', FavUrl);
  var Today = new Date();
  var BookmarkInfo = {
    'Id': Id,
    'Title': Title,
    'LastUpdateTime': Today,
    'LastPostTime': LastPost,
    'Url': Url,
    'Keyword': decodeURIComponent(Keyword).replace(/\+/g, ' ').replace('parody', '同人').replace(/(.*)language\:chinese\$/, '[中文]$1').replace(/^\s+|\s+$/g, '')
  };
  GM_setValue(Id, BookmarkInfo);
  GM_setValue('FavSort', FavSort);
  window.location = window.location;
};
EH_CheckForNew_Button.querySelector('#EH_CheckForNew_All').onclick = function() {
  if (document.querySelector('#EH_CheckForNew_Table')) {
    if (document.querySelector('#EH_CheckForNew_Table').style.display === 'none') {
      document.querySelector('#EH_CheckForNew_Table').style.display = 'block';
      this.innerHTML = ' 隐藏';
    } else {
      document.querySelector('#EH_CheckForNew_Table').style.display = 'none';
      this.innerHTML = ' 显示';
    }
  } else {
    this.innerHTML = ' 隐藏';
    var bgcolor = (window.location.host === 'g.e-hentai.org') ? '#E3E0D1' : '#34353B';
    var EH_CheckForNew_Table = document.createElement('div');
    EH_CheckForNew_Table.id = 'EH_CheckForNew_Table';
    EH_CheckForNew_Table.style = 'z-index:999;width:640px;background-color:' + bgcolor + ';position:relative;top:-' + eval(document.body.scrollHeight - 270) + 'px;border-color:black;border-style:solid;text-align:center;z-index:999;margin: 2px auto 0px;';
    EH_CheckForNew_Table.innerHTML = '<table><tbody><tr><td><input type="checkbox"></td><td>ID</td><td>LastUpdateTime</td><td>LastPostTime</td><td>Url</td><td>Keyword</td></tr></tbody></table><div style="height:600px;overflow:auto;"><table id="EH_CheckForNew_Table_Content"><tbody></tbody></table></div><button class="stdbtn" id="EH_CheckForNew_Batch_Update">更新</button><button class="stdbtn" id="EH_CheckForNew_Batch_Delete">删除</button>';
    var FavSort = GM_getValue('FavSort', []);
    for (var i = FavSort.length - 1; i >= 0; i--) {
      //for (var i = 0; i < FavSort.length; i++) {
      var temp = GM_getValue(FavSort[i]);
      var tr = document.createElement('tr');
      tr.innerHTML = '<td><input type="checkbox"></td><td>' + temp['Id'] + '</td><td>' + temp['LastUpdateTime'].substr(0, 16).replace('T', ' ') + '</td><td>' + temp['LastPostTime'] + '</td><td><a target="_blank" href="' + temp['Url'] + '">' + temp['Title'] + '</a></td><td>' + temp['Keyword'] + '</td>';
      EH_CheckForNew_Table.querySelector('#EH_CheckForNew_Table_Content>tbody').appendChild(tr);
    }
    EH_CheckForNew_Table.querySelector('#EH_CheckForNew_Batch_Update').onmousedown = function(e) {
      var input = EH_CheckForNew_Table.querySelectorAll('input:checked');
      var Id_arr = [];
      var i;
      for (i = 0; i < input.length; i++) {
        Id_arr.push(input[i].parentNode.nextElementSibling.innerText);
      }
      for (i = 0; i < Id_arr.length; i++) {
        Id = Id_arr[i];
        UpdateBookmark(Id, false, e.button);
      }
      window.location = window.location;
    };
    EH_CheckForNew_Table.querySelector('#EH_CheckForNew_Batch_Delete').onclick = function() {
      var input = EH_CheckForNew_Table.querySelectorAll('input:checked');
      var Id_arr = [];
      var i;
      for (i = 0; i < input.length; i++) {
        Id_arr.push(input[i].parentNode.nextElementSibling.innerText);
      }
      for (i = 0; i < Id_arr.length; i++) {
        Id = Id_arr[i];
        DeleteBookmark(Id, false);
      }
      window.location = window.location;
    };
    document.body.appendChild(EH_CheckForNew_Table);
    GM_addStyle('#EH_CheckForNew_Table table{margin: 0px auto;}#EH_CheckForNew_Table td:nth-child(1){width:16px !important;}#EH_CheckForNew_Table td:nth-child(2){width:24px !important;}#EH_CheckForNew_Table td:nth-child(3),#EH_CheckForNew_Table td:nth-child(4){width:90px !important;}#EH_CheckForNew_Table td:nth-child(5),#EH_CheckForNew_Table td:nth-child(6){width:200px !important;}');
  }
};
document.all.nb.appendChild(EH_CheckForNew_Button);
document.all.nb.style.height = '16px';
var FavUrl = GM_getValue('FavUrl');
if (FavUrl) {
  var Url = window.location.href;
  if (Url in FavUrl) {
    var Id = FavUrl[Url];
    var FavInfo = GM_getValue(Id);
    //console.log(FavInfo);
    var Title = FavInfo['Title'];
    var TodayUTC = getNowFormatDate();
    document.title = '[' + TodayUTC + ']' + Title;
    var time = document.querySelectorAll('table.itg>tbody>tr>td:nth-child(2)');
    for (var i = 0; i < time.length; i++) {
      var PostTime = Date.parse(time[i].innerText.replace(/ /, 'T'));
      if (PostTime < Date.parse(FavInfo['LastUpdateTime']))
        break;
    }
    var tr = document.createElement('tr');
    tr.id = 'EH_CheckForNew';
    tr.style = 'text-align:center;';
    tr.innerHTML = '<td colspan="4"><div>上次检查时间为 ' + FavInfo['LastUpdateTime'].substr(0, 16).replace('T', ' ') + ' <button id="EH_CheckForNew_Update" class="stdbtn">更新</button><button id="EH_CheckForNew_Delete" class="stdbtn">删除</button><input onclick="this.select();" value="[' + TodayUTC + ']' + Title + '" /></div></td>';
    tr.querySelector('#EH_CheckForNew_Update').onmousedown = function(e) {
      UpdateBookmark(Id, true, e.button);
    };
    tr.querySelector('#EH_CheckForNew_Delete').onclick = function() {
      DeleteBookmark(Id, true);
    };
    document.querySelector('table.itg>tbody').insertBefore(tr, document.querySelector('table.itg>tbody>tr:nth-child(' + eval(i + 2) + ')'));
  }
}
//////////////////////////////////////////////////
function DeleteBookmark(Id, reload) {
  var Url = GM_getValue(Id).Url;
  GM_deleteValue(Id);
  var FavUrl = GM_getValue('FavUrl');
  delete FavUrl[Url];
  GM_setValue('FavUrl', FavUrl);
  var FavSort = GM_getValue('FavSort');
  for (var i = 0; i < FavSort.length; i++) {
    if (FavSort[i] === Id) {
      FavSort.splice(i, 1);
      break;
    }
  }
  GM_setValue('FavSort', FavSort);
  if (reload) window.location = window.location;
}
//////////////////////////////////////////////////
function UpdateBookmark(Id, reload, status) {
  var FavInfo = GM_getValue(Id);
  var Title;
  switch (status) {
    case 0:
      Title = FavInfo['Title'];
      break;
    case 2:
      Title = prompt('请输入名称', FavInfo['Title']);
      break;
  }
  var Now = new Date();
  var LastPost = document.querySelector('.itd').innerText;
  Id = FavInfo['Id'];
  var BookmarkInfo = {
    'Id': Id,
    'Title': Title,
    'LastUpdateTime': Now,
    'LastPostTime': LastPost,
    'Url': FavInfo['Url'],
    'Keyword': FavInfo['Keyword']
  };
  //console.log(BookmarkInfo);
  GM_setValue(Id, BookmarkInfo);
  var FavSort = GM_getValue('FavSort');
  for (var i = 0; i < FavSort.length; i++) {
    if (FavSort[i] === Id) {
      FavSort.splice(i, 1);
      break;
    }
  }
  FavSort.unshift(Id);
  GM_setValue('FavSort', FavSort);
  if (reload) window.location = window.location;
}
//////////////////////////////////////////////////
function getNowFormatDate() {
  var date = new Date();
  var month = date.getUTCMonth() + 1;
  var strDate = date.getUTCDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  var currentdate = date.getFullYear() + '-' + month + '-' + strDate;
  return currentdate;
}
//////////////////////////////////////////////////
function getEmpty() {
  var arr = GM_getValue('FavSort', 0);
  if (arr === 0) return 1;
  arr.sort(function(a, b) {
    return a - b;
  });
  var num;
  for (var i = 0; i < arr.length; i++) {
    if (i + 1 !== arr[i]) {
      num = i + 1;
      break;
    }
    num = i + 2;
  }
  return num;
}
