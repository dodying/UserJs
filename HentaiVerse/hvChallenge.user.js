// ==UserScript==
// @name        [HV]Challenge
// @description
// @include
// @version     1.00
// @include     http*://hentaiverse.org/*
// @include     http://alt.hentaiverse.org/*
// @author      Dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function() {
  if (!gE('#navbar')) return;
  var challenges = ['Normal', 'Hard', 'Nightmare', 'Hell', 'Nintendo', 'IWBTH', 'PFUDOR'];
  var options = '';
  challenges.forEach(function(i, j) {
    options += '<option value="' + (j + 1) + '">' + i + '</option>';
  });
  var init = function() {
    gE('#level_readout>div.fc4.far.fcb>div').onclick = function() {
      this.onclick = null;
      var text = this.textContent.split(' ');
      var _ch = challenges.indexOf(text[0]) + 1;
      this.innerHTML = '<select style="position:relative;top:-5px;">' + options + '</select> ' + text[1];
      this.querySelector('select').value = _ch;
      this.querySelector('select').onchange = function() {
        var value = this.value;
        var iframe = gE('body').appendChild(document.createElement('iframe'));
        iframe.id = 'hvChallenge';
        iframe.src = '?s=Character&ss=se';
        iframe.style.cssText = 'display:none;';
        iframe.onload = function() {
          var target = gE('[name="difflevel"][value="' + value + 'ch"]', iframe.contentWindow.document).checked;
          if (target) {
            iframe.onload = null;
            gE('body').removeChild(iframe);
            gE('#level_readout>div.fc4.far.fcb>div').textContent = gE('#level_readout>div.fc4.far.fcb>div>select>option:nth-child(' + value + ')').textContent + ' ' + text[1];
            init();
            return;
          }
          gE('[name="difflevel"][value="' + value + 'ch"]', iframe.contentWindow.document).checked = true;
          gE('[type="submit"]', iframe.contentWindow.document).click();
        };
      };
    };
  };
  init();

  function gE(ele, mode, parent) { //获取元素
    if (typeof ele === 'object') {
      return ele;
    } else if (mode === undefined && parent === undefined) {
      return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
    } else if (mode === 'all') {
      return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
    } else if (typeof mode === 'object' && parent === undefined) {
      return mode.querySelector(ele);
    }
  }
})();
