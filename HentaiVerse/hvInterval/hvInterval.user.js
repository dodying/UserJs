// ==UserScript==
// @name        [HV]Interval
// @description 更新: 战役外报错
// @author      Dodying
// @include     http*://hentaiverse.org/*
// @include     http://alt.hentaiverse.org/*
// @version     1.01
// @grant       GM_xmlhttpRequest
// @connect     127.0.0.1
// @run-at      document-idle
// ==/UserScript==
(function() {
  if ($('#riddlecounter')) {
    var url = $('#riddlebot>img').src;
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://127.0.0.1:5000/?img=' + encodeURIComponent(url),
      timeout: 60 * 1000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      onload: function(e) {
        if (e.response.match(/^[abc]$/)) {
          $('#riddleanswer').value = e.response;
          $('#riddleanswer+img').click();
        }
      }
    });
  } else if ($('#textlog').textContent) {
    if (/Time Bonus/.test($('#textlog').textContent)) {
      logResult('True');
    } else if (/You lose \d+ Stamina/.test($('#textlog').textContent)) {
      logResult('False');
    }
  }

  function $(e) {
    return document.querySelector(e);
  }

  function logResult(isTrue) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://127.0.0.1:5000/?answer=' + isTrue,
      timeout: 60 * 1000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
  }
})();
