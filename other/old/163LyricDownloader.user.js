// ==UserScript==
// @name        163LyricDownloader
// @namespace   https://github.com/dodying/Dodying-UserJs
// @include     http://music.163.com/*
// @version     1.00
// @grant       GM_xmlhttpRequest
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @require     http://cdn.bootcss.com/jszip/3.0.0/jszip.min.js
// @run-at      document-end
// ==/UserScript==
init();
function init() {
  document.querySelector('.wrap>ul>li.lst').innerHTML = '<span><a><em class="_163LyricDownloader">下载歌词</em></a></span>'
  document.querySelector('._163LyricDownloader').onclick = function () {
    getStatus();
  }
}
function getStatus() {
  var musicHref = window.frames['contentFrame'].document.querySelectorAll('.txt>a');
  if (musicHref.length === 0) return;
  var musicAuthor = window.frames['contentFrame'].document.querySelectorAll('.text>span');
  var musicStatus = new Object();
  musicStatus.length = musicHref.length;
  var downloadingList = new Array();
  var downloadingNow = new Array();
  var tempId;
  for (var i = 0; i < musicHref.length; i++) {
    tempId = musicHref[i].href.replace(/.*song\?id=/, '');
    musicStatus[tempId] = {
      'id': tempId,
      'ok': false,
      'musicUrl': musicHref[i].href,
      'lyricUrl': 'http://music.163.com/api/song/media?id=' + tempId,
      'name': musicHref[i].innerText,
      'singer': musicAuthor[i].innerText.replace(/\//g, ','),
      'lyric': ''
    };
    downloadingList.push(tempId);
  }
  window._status = musicStatus;
  window._list = downloadingList;
  window._now = downloadingNow;
  var isDownloaded = setInterval(function () {
    addDownloadTask();
    if (checkDownloaded()) {
      clearInterval(isDownloaded);
      var zip = new JSZip();
      for (var i in window._status) {
        if (!/^\d+$/.test(i)) continue;
        zip.file(window._status[i].singer + ' - ' + window._status[i].name + '.lrc', window._status[i].lyric);
      }
      zip.generateAsync({
        type: 'blob'
      }).then(function (content) {
        saveAs(content, window.frames['contentFrame'].document.querySelector('h2.f-ff2').innerText + '.zip');
      });
    }
  }, 200);
}
function addDownloadTask() {
  for (var i = 0; i < window._now.length; i++) {
    if (!window._now[i].start) {
      window._now[i].start = true;
      getLyric(i);
    }
    if (window._now[i].ok) {
      window._now.splice(i, 1);
      i--;
    }
  }
  if (window._now.length < 10 && window._list.length > 0) {
    window._now.push({
      id: window._list[0],
      start: false,
      ok: false
    });
    window._list.splice(0, 1);
    addDownloadTask();
  }
}
function getLyric(num) {
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://music.163.com/api/song/media?id=' + window._now[num].id,
    timeout: 1500,
    onload: function (res) {
      window._status[window._now[num].id].lyric = JSON.parse(res.response).lyric;
      window._now[num].ok = true;
      window._status[window._now[num].id].ok = true;
    },
    ontimeout: function () {
      window._status[window._now[num].id].lyric = '下载超时，请重试';
      window._now[num].ok = true;
      window._status[window._now[num].id].ok = true;
    }
  });
}
function checkDownloaded() {
  var downloaded = 0;
  for (var i in window._status) {
    if (!/^\d+$/.test(i)) continue;
    if (window._status[i].ok) downloaded++;
  }
  if (downloaded === window._status.length) {
    document.title = '歌词下载完成';
    return true;
  } else {
    document.title = downloaded + '/' + window._status.length;
    return false;
  }
}
