// ==UserScript==
// @name        myNovelReaderForMobile
// @name:zh-CN  
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN  
// @include     *
// @version     1.00
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @run-at      document-end
// ==/UserScript==
(function () {
  $('style, link[rel=\'stylesheet\'], script').remove();
  $('head').append(function () {
    return '<style>h1,.btn{text-align:center;}.btn>a{display:inline-block;text-align:center;padding:5px 5px;background-color:rgb(244,240,233);color:rgb(0,128,0);border:1px solid rgb(236,230,218);}</style>' +
    '<meta name="MobileOptimized" content="240">' +
    '<meta name="applicable-device" content="mobile">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">';
  });
  newChapter(document);
}) ();
function newChapter(doc) {
  var Rule = {
    titleReplace: /^章节目录|^文章正文|^正文|全文免费阅读|最新章节|\(文\)|_.*$/g,
    nextSelector: 'a[rel=\'next\'], a:contains(\'下一页\'), a:contains(\'下一章\'), a:contains(\'下一节\'), a:contains(\'下页\')',
    prevSelector: 'a[rel=\'prev\'], a:contains(\'上一页\'), a:contains(\'上一章\'), a:contains(\'上一节\'), a:contains(\'上页\')',
    indexSelectors: 'a[href=\'index.html\'], a:contains(\'返回书目\'), a:contains(\'章节目录\'), a:contains(\'章节列表\'), a:contains(\'回目录\'), a:contains(\'回书目\'), a:contains(\'目 录\'), a:contains(\'目录\')',
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
      '.content'
    ],
    contentRemove: 'script, iframe',
    removeLineRegExp: /<p>[　\s。;，！\.∷〖]*<\/p>/g, // 移除只有一个字符的行
    replaceBrs: /(<br[^>]*>[ \n\r\t]*){1,}/gi, // 替换为<p>
  };
  var reader = {
    title: $('title', doc).text().replace(Rule.titleReplace, '').trim(),
    content: (function () {
      var i,
      target;
      for (i = 0; i < Rule.contentSelectors.length; i++) {
        target = $(Rule.contentSelectors[i], doc);
        if (target.length > 0 && target.text().length >= 50) return target.html();
      }
      return '无法找到文本';
    }) (),
    index: $(Rule.indexSelectors, doc).attr('href') || location.href.replace(/\/\d+\.html$/, ''),
    prev: $(Rule.prevSelector, doc).attr('href') || null,
    next: $(Rule.nextSelector, doc).attr('href') || null
  };
  //console.log(reader);
  if (doc === document) {
    $('body').empty('').css({
      color: 'rgb(0, 0, 0)',
      'background-color': 'RGB(204, 232, 207)'
    });
  }
  document.title = reader.title;
  $('body').append(function () {
    return '<div><h1>' + reader.title + '</h1>' +
    '<div>' + reader.content + '</div>' +
    '<div class="btn"><a href="' + reader.prev + '">上一章</a> <a href="' + reader.index + '">章节目录</a> <a href="' + reader.next + '">下一章</a></div></div>';
  });
  $(window).off().on('scroll', function () {
    if (reader.next !== null && getRemain() <= 100) {
      $(window).off('scroll');
      get(reader.next, function (e) {
        newChapter(e.target.response);
        history.pushState(null, null, reader.next);
      });
    }
  })
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
