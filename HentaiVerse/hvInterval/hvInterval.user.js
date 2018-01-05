// ==UserScript==
// @name        [HV]Interval
// @author      Dodying
// @include     http*://hentaiverse.org/*
// @include     http://alt.hentaiverse.org/*
// @version     1
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
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      onload: function(e) {
        $('#riddleanswer').value = e.response;
        //$('#riddleanswer+img').click();
      }
    });
  } else if (/Time Bonus/.test($('#textlog').textContent)) {
    logResult('True');
  } else if (/You lose \d+ Stamina/.test($('#textlog').textContent)) {
    logResult('False');
  }

  function $(e) {
    return document.querySelector(e);
  }

  function logResult(isTrue) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://127.0.0.1:5000/?answer=' + isTrue,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    });
  }
})();
