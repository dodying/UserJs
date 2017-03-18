// ==UserScript==
// @name        myNovelReaderLite
// @name:zh-CN  【小说】阅读脚本-简版
// @namespace   https://github.com/dodying/UserJs
// @description Read novel easily.
// @description:zh-CN  一些代码来自ywzhaiqi大大的My Novel Reader
// @include     *
// @version     1.01a
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @run-at      document-end
// ==/UserScript==
(function () {
  var Rule = {
    bookSelector: 'h1:contains(\'《\'):contains(\'》\')',
    titleReplace: /^章节目录|^文章正文|^正文|全文免费阅读|最新章节|\(文\)|_.*$/g,
    nextSelector: 'a[rel=\'next\'], a:contains(\'下一页\'), a:contains(\'下一章\'), a:contains(\'下一节\'), a:contains(\'下页\')',
    prevSelector: 'a[rel=\'prev\'], a:contains(\'上一页\'), a:contains(\'上一章\'), a:contains(\'上一节\'), a:contains(\'上页\')',
    indexSelector: 'a[href=\'index.html\'], a:contains(\'返回书目\'), a:contains(\'章节目录\'), a:contains(\'章节列表\'), a:contains(\'回目录\'), a:contains(\'回书目\'), a:contains(\'目 录\'), a:contains(\'目录\')',
    contentSelectors: [
      '#pagecontent',
      '#contentbox',
      '#bmsy_content',
      '#bookpartinfo',
      '#htmlContent',
      '#text_area',
      '#chapter_content',
      '#chapterContent',
      '#partbody',
      '#article_content',
      '#BookTextRead',
      '#booktext',
      '#BookText',
      '#readtext',
      '#text_c',
      '#txt_td',
      '#TXT',
      '#txt',
      '#zjneirong',
      '.novel_content',
      '.readmain_inner',
      '.noveltext',
      '.booktext',
      '.yd_text2',
      '#contentTxt',
      '#oldtext',
      '#a_content',
      '#contents',
      '#content2',
      '#contentts',
      '#content',
      '.content',
      '#nr1',
      '.TxtContent'
    ],
    contentRemove: 'script, iframe',
    removeLineRegExp: /<p>[　\s。;，！\.∷〖]*<\/p>/g, // 移除只有一个字符的行
    replaceBrs: /(<br[^>]*>[ \n\r\t]*){1,}/gi, // 替换为<p>
  };
  if (/Android|iPhone|iPad/gi.test(navigator.userAgent)) {
    var script = document.createElement('script');
    script.id = 'jQuery';
    script.src = 'http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js';
    document.head.appendChild(script);
    alert(1)
  }
  document.addEventListener('DOMContentLoaded', function () {
    $(window).off();
    $(document).off();
    newChapter(Rule, document, location.href, 0);
    $('style, link[rel=\'stylesheet\'], script:not(#jQuery)').remove();
    $('head').append(function () {
      return '<style>' +
      'a {color:RGB(6,84,136);}' +
      'a:link {text-decoration:none;}' +
      '.readerbtn {position:fixed;right:10px;bottom:10px;z-index:2247483648;padding:20px 5px;width:50px;height:20px;line-height:20px;text-align:center;border:1px solid;border-color:RGB(136,136,136);border-radius:50%;background:rgba(0,0,0,.5);color:RGB(255,255,255);font:12px/1.5 "微软雅黑","宋体",Arial;cursor:pointer;}' +
      '#menu {position:fixed;top:0;bottom:0;left:0;z-index:100;width:270px;max-width:100%;background:RGB(51,51,51);overflow-y:auto;}' +
      '#header {color:RGB(119,119,119);margin-top:0;border-top:1px solid rgba(0,0,0,0.3);background:RGB(64,64,64);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);text-shadow:0 1px 0 rgba(0,0,0,0.5);padding:10px 12px;text-transform:uppercase;font-weight:bold;font-size:20px;}' +
      '#header a {color:RGB(119,119,119);}' +
      '#divider {position:relative;z-index:300;border-top:1px solid rgba(255,255,255,0.01);border-bottom:1px solid rgba(0,0,0,0.3);margin:0;height:4px;background:rgba(0,0,0,0.2);box-shadow:0 1px 0 rgba(255,255,255,0.05),inset 0 1px 3px rgba(0,0,0,0.3);}' +
      '#chapter-list {position:relative;bottom:0;left:0;right:0;z-index:200;margin:0;padding:0;overflow-y:auto;}' +
      '.chapter.active a {background:rgb(26,26,26);color:rgb(255,255,255);font-size:16px;box-shadow:inset 0 1px 3px rgba(0,0,0,0.3);}' +
      '.chapter a {color:rgb(204,204,204);font-size:15px;padding:8px 20px;border-top:1px solid rgba(0,0,0,0.3);box-shadow:inset 0 1px 0 rgba(255,255,255,0.05);text-shadow:0 1px 0 rgba(0,0,0,0.5);display:block;text-decoration:none;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}' +
      '#mynovelreader-content {width:800px;font-size:22px;font-family:微软雅黑,宋体,黑体,楷体;line-height:2em;margin-left:320px;margin-right:auto;padding-bottom:15px;}' +
      'article {margin-top:55px;word-wrap:break-word;}' +
      '.chapter-footer-nav {text-align:center;font-size:0.9em;margin:-10px 0px 30px 0px;}' +
      '#loading {color:rgb(255,255,255);text-align:center;font:12px "微软雅黑","宋体","Times New Roman","Verdana";margin-top:20px;margin-left:auto;margin-right:auto;width:376px;height:32px;line-height:32px;border-radius:20px;border:1px solid RGB(102,102,102);background-color:RGB(51,51,51);}' +
      '#loading img {vertical-align:middle;}' +
      '#loading a {color:rgb(255,255,255);}' +
      '</style>' +
      '<meta name="MobileOptimized" content="240">' +
      '<meta name="applicable-device" content="mobile">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">';
    });
  }, false);
}) ();
function newChapter(Rule, doc, url, chapterCount) {
  var bookTitle = $(Rule.bookSelector, doc).text().trim().replace(/.*《|》.*/g, '').replace('最新章节', '') || '章节目录';
  var reader = {
    book: bookTitle,
    title: $('title', doc).text().replace(bookTitle, '').replace(Rule.titleReplace, '').trim(),
    content: (function () {
      var i,
      target;
      for (i = 0; i < Rule.contentSelectors.length; i++) {
        target = $(Rule.contentSelectors[i], doc);
        if (target.length > 0 && target.text().replace(/[ \t\r\n]+/g, '').length >= 1000) {
          target.find(Rule.contentRemove).remove();
          return target.html().replace(Rule.removeLineRegExp, '').replace(Rule.replaceBrs, '<p>');
        }
      }
      throw '无法找到文本';
      //return '无法找到文本';
    }) (),
    index: $(Rule.indexSelector, doc).attr('href') || url.replace(/\/\d+\.html$/, ''),
    prev: $(Rule.prevSelector, doc).attr('href') || null,
    next: $(Rule.nextSelector, doc).attr('href') || null
  };
  //console.log(reader);
  if (doc === document) {
    $('body').html('<div id="container"></div>').css({
      color: 'rgb(0, 0, 0)',
      'background-color': 'RGB(204, 232, 207)'
    });
    $('<div id="menu"><div id="header"><a href="' + reader.index + '" target="_blank">' + reader.book + '</a></div><div id="divider"></div><ul id="chapter-list"></ul></div>').appendTo('#container');
    $('<div id="mynovelreader-content"></div>').appendTo('#container');
    $('<div id="loading"><img src="data:image/gif;base64,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"><a title="点击打开下一页链接">正在载入下一页...</a></div>').appendTo('#container');
    $('<div class="readerbtn">退出</div>').on('click', function () {
      location.reload();
    }).appendTo('body');
  }
  document.title = reader.title;
  $('.chapter').removeClass('active');
  $('<li class="chapter active"><a href="#page-' + chapterCount + '" realhref="' + url + '" onclick="return false">' + reader.title + '</a></li>').appendTo('#chapter-list').on('click', function () {
    var _this = $(this).find('a');
    history.pushState(null, null, _this.attr('realhref'));
    $('html, body').scrollTop($(_this.attr('href')).offset().top - parseInt($(_this.attr('href')).css('margin-top'), 10));
    $(this).addClass('active');
    $('#chapter-list>li').not(this).removeClass('active');
  });
  $('#mynovelreader-content').append(function () {
    return '<article id="page-' + chapterCount + '">' +
    '<h1>' + reader.title + '</h1>' +
    '<div>' + reader.content + '</div>' +
    '<div class="chapter-footer-nav"><a class="prev-page" href="' + reader.prev + '">上一页</a> | <a class="index-page" href="' + reader.index + '">目录</a> | <a class="next-page" href="' + reader.next + '">下一页</a></div>' +
    '</article>';
  });
  $('#loading>a').attr('href', reader.next);
  $(window).on('scroll', function () {
    if (reader.next !== null && getRemain() <= 100) {
      $(window).off('scroll');
      get(reader.next, function (e) {
        newChapter(Rule, e.target.response, reader.next, chapterCount + 1);
        history.pushState(null, null, reader.next);
      });
    }
  });
}
function get(href, func) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', href);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.responseType = 'document';
  xhr.timeout = 10 * 1000;
  xhr.onerror = function () {
    xhr = null;
    get(href, func);
  }
  xhr.ontimeout = function () {
    xhr = null;
    get(href, func);
  }
  xhr.onload = function (e) {
    if (e.target.status >= 200 && e.target.status < 400) func(e);
    xhr = null;
  }
  xhr.send();
}
function getRemain() {
  var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
  var remain = scrollHeight - window.innerHeight - window.scrollY;
  return remain;
}
