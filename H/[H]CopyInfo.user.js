// ==UserScript==
// @name        [H]CopyInfo
// @name:zh-CN  [H]复制信息
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN
// @include     http*://www.javlibrary.com/*
// @include     http*://www.javbus.com/*
// @include     http*://www.caribbeancom.com/moviepages/*
// @include     http*://www.caribbeancompr.com/moviepages/*
// @version     1.01.1
// @grant       GM_setClipboard
// @author      Dodying
// @require     https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function() {
  if (location.href.match('/search/') && $('.item').length === 1) {
    location = $('.item>a').attr('href');
    return;
  } else if (location.href.match('vl_searchbyid')) {
    var find = $('.id').filter(function() {
      return this.textContent === location.href.match(/keyword=(.*?)$/)[1] && !$(this).parents().eq(1).text().match('（ブルーレイディスク）');
    });
    if (find.length === 1) location = find.parent().attr('href');
    return;
  }
  var linkLib = {
    'www.javlibrary.com': {
      searchInput: '#idsearchbox',
      searchButton: '#idsearchbutton',
      code: '#video_id .text',
      name: '.post-title',
      star: 'span.star>a',
      genre: '.genre>a',
      score: 'span.score',
      length: '#video_length .text'
    },
    'www.javbus.com': {
      searchInput: '#search-input',
      searchButton: '#navbar .btn[type="submit"]',
      code: '.info>p>span:eq(1)',
      name: 'h3',
      star: '.star-show~p:eq(0)>.genre>a',
      genre: '.header:contains(類別)~p:eq(0)>.genre>a',
      score: '',
      length: '.info>p:eq(2)'
    },
    'www.caribbeancompr.com': {
      searchInput: '#q',
      searchUrl: 'https://www.caribbeancompr.com/moviepages/{{q}}/',
      code: /moviepages\/(.*?)\//,
      name: '.video-detail>h1',
      star: '.movie-info>dl:contains("出演") a',
      genre: '.movie-info-cat>dd>a',
      score: '',
      length: function() {
        var time = $('.movie-info>dl:contains("再生時間")>dd').text();
        time = new Date('1970-01-01 ' + time + ' GMT+000').getTime();
        return Math.round(time / 1000 / 60);
      }
    },
    'www.caribbeancom.com': {
      searchInput: '#q',
      searchUrl: 'https://www.caribbeancom.com/moviepages/{{q}}/',
      code: /moviepages\/(.*?)\//,
      name: '.video-detail>h1',
      star: '.movie-info>dl:contains("出演") a',
      genre: '.movie-info-cat>dd>a',
      score: '',
      length: function() {
        var time = $('.movie-info>dl:contains("再生時間")>dd').text();
        time = new Date('1970-01-01 ' + time + ' GMT+000').getTime();
        return Math.round(time / 1000 / 60);
      }
    }
  };
  var rule = linkLib[location.host];
  $(rule.searchInput).on('paste', function() {
    var _ = this;
    setTimeout(function() {
      _.value = _.value.replace(/\..*$/, '');
      if (_.value && rule.searchButton) {
        $(rule.searchButton).click();
      } else if (_.value && rule.searchUrl) {
        location.href = rule.searchUrl.replace('{{q}}', _.value);
      }
    }, 20);
  });
  var stars, genres, info; //total info
  var stars2 = []; //stars
  stars = [];
  genres = [];
  $(rule.star).each(function() {
    stars.push(this.innerText);
    stars2.push(this.innerText + '\t' + this.href);
  });
  $(rule.genre).each(function() {
    genres.push(this.innerText);
  });
  info = [
    typeof rule.code === 'string' ? $(rule.code).text().trim() : location.href.match(rule.code)[1], //code
    $(rule.name).text().replace(/^(\w+(_|-))?\w+ /, '').replace(/\n/g, '').trim(), //name
    stars.join(' '), //star
    genres.join(' '), //genre
  ];
  if (!info[0]) return;
  if (typeof rule.score === 'string' && $(rule.score).length > 0) { //score
    info.push($(rule.score).text() ? $(rule.score).text().match(/[\d\.]+/)[0] : '');
  }
  if (typeof rule.length === 'string' && $(rule.length).length > 0) { //length
    info.push($(rule.length).text().match(/\d+/)[0]);
  } else {
    info.push(rule.length());
  }
  document.title = info[0];
  document.onkeydown = function(e) {
    if (e.ctrlKey && e.key === 'c' && window.getSelection().toString() === '') {
      GM_setClipboard(info.join('\t'));
      if ($('.hBanner')) $('.addCode').click();
    } else if (e.ctrlKey && e.key === 'v' && e.target.tagName === 'BODY') {
      $(rule.searchInput).select();
    } else if (e.ctrlKey && e.key === 'x' && window.getSelection().toString() === '') {
      GM_setClipboard(stars2.join('\r\n'));
    }
  };
})();
