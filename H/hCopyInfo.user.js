// ==UserScript==
// @name        hCopyInfo
// @name:zh-CN  【H】复制信息
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN  
// @include     http://www.javlibrary.com/*
// @include     https://www.javbus.com/*
// @version     1.00
// @grant       GM_setClipboard
// @author      Dodying
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function () {
  var linkLib = {
    'www.javlibrary.com': {
      searchInput: '#idsearchbox',
      searchSubmit: '#idsearchbutton',
      code: '#video_id .text',
      name: '.post-title',
      star: '.star>a',
      genre: '.genre>a',
      score: '.score',
      length: '#video_length'
    },
    'www.javbus.com': {
      searchInput: '#search-input',
      searchSubmit: '#search-input+span>button',
      code: '.info>p>span:eq(1)',
      name: 'h3',
      star: '.star-show~p:eq(0)>.genre>a',
      genre: '.header:contains(類別)~p:eq(0)>.genre>a',
      score: '',
      length: '.info>p:eq(2)'
    }
  };
  var rule = linkLib[location.host];
  $(rule.searchInput).on('paste', function () {
    setTimeout(function () {
      $(rule.searchSubmit).click();
    }, 100);
  });
  var stars = new Array();
  var genres = new Array();
  $(rule.star).each(function () {
    stars.push(this.innerText);
  });
  $(rule.genre).each(function () {
    genres.push(this.innerText);
  });
  var info = [
    $(rule.code).text(), //code
    $(rule.name).text().replace(/(.*?) /, ''), //name
    stars.join(' '), //star
    genres.join(' '), //genre
  ];
  if ($(rule.score).length > 0) info.push($(rule.score).text().match(/[\d\.]+/) [0]), //score
  info.push($(rule.length).text().match(/\d+/) [0]); //length
  document.onkeydown = function (e) {
    if (e.keyCode === 67) GM_setClipboard(info.join('\t'));
  }
}) ();
