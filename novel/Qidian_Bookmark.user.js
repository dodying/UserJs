// ==UserScript==
// @name        Qidian_Bookmark
// @name:zh-CN  【小说】起点书签
// @namespace   Dodying
// @author      dodying
// @description 在“起点个人中心-我的书架”里增加阅读记录，通过点击章节页里的按钮添加到阅读记录里
// @description:zh-CN 在“起点个人中心-我的书架”里增加阅读记录，通过点击章节页里的按钮添加到阅读记录里
// @include     http://read.qidian.com/BookReader/*,*.aspx
// @include     http://vipreader.qidian.com/BookReader/vip,*,*.aspx
// @include     http://me.qidian.com/bookCase/bookCase.aspx*
// @version     1.02
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @run-at      document-idle
// ==/UserScript==
if (window.location.host == 'vipreader.qidian.com' || window.location.host == 'read.qidian.com') {
  var Js_MyNovelReader = document.querySelector('body[name="MyNovelReader"]');
  if (Js_MyNovelReader) {
    window.onscroll = function () {
      if (!document.querySelector('#QidianBookmark')) {
        var div = document.createElement('div');
        div.id = 'QidianBookmark';
        div.style = 'top:0px;left:270px;position:absolute;z-index:999;';
        div.innerHTML = '<a href="javascript:void(0)"><img src="https://cdn3.iconfinder.com/data/icons/line/36/star-24.png" /></a>';
        document.body.appendChild(div);
        div.querySelector('a').onclick = function () {
          this.querySelector('img').src = 'https://cdn1.iconfinder.com/data/icons/smashicons-the-essentials-flat/54/122_-_Flag_Flat-24.png';
          var BookName = document.title.replace(/ \- .*/, '');
          var BookVip;
          (window.location.host == 'vipreader.qidian.com') ? BookVip = true : BookVip = false;
          var BookInfoURL = '';
          var BookDirURL = document.querySelector('#header>a').href;
          var BookChapterName = document.querySelector('.active>div').title;
          var BookChapterURL = document.querySelector('.active>div').outerHTML.replace(/.*realhref="(.*\.aspx)".*/, '$1');
          var BookInfo = {
            'BookName': BookName,
            'BookVip': BookVip,
            'BookInfoURL': BookInfoURL,
            'BookDirURL': BookDirURL,
            'BookChapterName': BookChapterName,
            'BookChapterURL': BookChapterURL
          };
          GM_setValue(BookName, BookInfo);
        }
      } else {
        document.querySelector('#QidianBookmark').style = 'top:' + document.documentElement.scrollTop + 'px;left:270px;position:absolute;z-index:999;';
      }
      var BookActiveChapter = document.title.replace(/.* \- /, '');
      if (window.localStorage['BookActiveChapter'] != BookActiveChapter) {
        window.localStorage['BookActiveChapter'] = BookActiveChapter;
        document.querySelector('#QidianBookmark>a>img').src = 'https://cdn3.iconfinder.com/data/icons/line/36/star-24.png';
      }
    }
  } else {
    var div = document.createElement('div');
    div.id = 'QidianBookmark';
    div.style = 'top:0px;left:0px;position:absolute;z-index:999;';
    div.innerHTML = '<a href="javascript:void(0)"><img src="https://cdn3.iconfinder.com/data/icons/line/36/star-24.png" /></a>';
    document.body.appendChild(div);
    div.querySelector('a').onclick = function () {
      var BookName = document.title.replace(/^小说:/, '').replace(/\/.*/, '').replace(/(独家|)首发$/, '');
      var BookVip;
      (window.location.host == 'vipreader.qidian.com') ? BookVip = true : BookVip = false;
      var BookInfoURL = document.querySelector('.bookNav>a[href^="http://www.qidian.com/Book/"]').href;
      var BookDirURL = document.querySelector('#dirBottomBtn').href;
      document.querySelector('#tools_directory').click();
      var BookChapterName = document.querySelector('.dirList .redFont').innerHTML;
      var BookChapterURL = document.querySelector('.dirList .redFont').href;
      document.querySelector('.closeLeft').click();
      var BookInfo = {
        'BookName': BookName,
        'BookVip': BookVip,
        'BookInfoURL': BookInfoURL,
        'BookDirURL': BookDirURL,
        'BookChapterName': BookChapterName,
        'BookChapterURL': BookChapterURL
      };
      GM_setValue(BookName, BookInfo);
      this.querySelector('img').src = 'https://cdn1.iconfinder.com/data/icons/smashicons-the-essentials-flat/54/122_-_Flag_Flat-24.png';
    }
    window.onscroll = function () {
      var BookPage = document.querySelectorAll('.textbox').length;
      if (window.localStorage['BookPage'] != BookPage) {
        window.localStorage['BookPage'] = BookPage;
        document.querySelector('#QidianBookmark>a>img').src = 'https://cdn3.iconfinder.com/data/icons/line/36/star-24.png';
      }
      document.querySelector('#QidianBookmark').style = 'top:' + document.documentElement.scrollTop + 'px;left:0px;position:absolute;z-index:999;';
    }
  }
}
if (window.location.href.indexOf('http://me.qidian.com/bookCase/bookCase.aspx') >= 0) {
  var th = document.createElement('th');
  th.width = '100';
  th.innerHTML = '阅读记录';
  document.querySelector('.bookcaseTable>thead>tr').appendChild(th);
  var BookInfoPage = document.querySelectorAll('#tbBookList>tr>td>a[href^="http://www.qidian.com/Book/"]');
  for (var i = 0; i < BookInfoPage.length; i++) {
    var BookName = BookInfoPage[i].innerHTML;
    if (GM_getValue(BookName, '')) {
      var Book = GM_getValue(BookName);
      var Bookmark = document.createElement('td');
      Bookmark.innerHTML = '<a href="' + Book['BookChapterURL'] + '" target="_blank">' + Book['BookChapterName'] + '</a>';
      document.querySelector('#tbBookList>tr:nth-child(' + eval(i + 1) + ')').appendChild(Bookmark);
    }
  }
  if (window.location.href == 'http://me.qidian.com/bookCase/bookCase.aspx?caseId=-2') return;
  QidianBookmark_Old();
  var MarkRead = document.createElement('input');
  MarkRead.type = 'button';
  MarkRead.value = '标记已读';
  MarkRead.className = 'btnbook';
  MarkRead.onclick = function () {
    var input_check = document.querySelectorAll('#tbBookList input:checked');
    for (var i = 0; i < input_check.length; i++) {
      var BookName = input_check[i].parentNode.parentNode.querySelector('a[href^="http://www.qidian.com/Book/"]').innerHTML;
      var BookVip;
      (input_check[i].parentNode.parentNode.querySelector('font')) ? BookVip = true : BookVip = false;
      var BookInfoURL = input_check[i].parentNode.parentNode.querySelector('a[href^="http://www.qidian.com/Book/"]').href;
      var BookChapterName = input_check[i].parentNode.parentNode.querySelector('a[href^="http://www.qidian.com/Book/"]').nextElementSibling.innerHTML;
      var BookChapterURL = input_check[i].parentNode.parentNode.querySelector('a[href^="http://www.qidian.com/Book/"]').nextElementSibling.href;
      var BookInfo = {
        'BookName': BookName,
        'BookVip': BookVip,
        'BookInfoURL': BookInfoURL,
        'BookChapterName': BookChapterName,
        'BookChapterURL': BookChapterURL
      };
      //console.log(BookInfo);
      GM_setValue(BookName, BookInfo);
    }
    window.location = window.location;
  }
  document.querySelector('.bookcaseTable>tfoot>tr>th:nth-child(2)').appendChild(MarkRead);
  var MardDelete = document.createElement('input');
  MardDelete.type = 'button';
  MardDelete.value = '删除书签';
  MardDelete.className = 'btnbook';
  MardDelete.onclick = function () {
    if (confirm('是否删除书签')) {
      var input_check = document.querySelectorAll('#tbBookList input:checked');
      for (var i = 0; i < input_check.length; i++) {
        var BookName = input_check[i].parentNode.parentNode.querySelector('a[href^="http://www.qidian.com/Book/"]').innerHTML;
        if (GM_getValue(BookName)) {
          GM_deleteValue(BookName);
        }
      }
      window.location = window.location;
    }
  }
  document.querySelector('.bookcaseTable>tfoot>tr>th:nth-child(2)').appendChild(MardDelete);
} //////////////////////////////////

function QidianBookmark_Old() {
  document.querySelector('.bookcaseTable > thead:nth-child(1) > tr:nth-child(1) > th:nth-child(5)').width = '';
  var QidianBookmark_Old = document.querySelectorAll('#tbBookList>tr>td:nth-child(5)>a');
  for (var i = 0; i < QidianBookmark_Old.length; i++) {
    QidianBookmark_Old[i].innerHTML = QidianBookmark_Old[i].title.replace('书签章节：', '');
  }
}
