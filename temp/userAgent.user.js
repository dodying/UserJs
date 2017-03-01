// ==UserScript==
// @name        userAgent
// @name:zh-CN  
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN  
// @include     *
// @version     1
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function () {
  alert(navigator);
  var d = document;
  var t = d.createElement('table');
  var h = '<tbody><tr><td>名</td><td>类型</td><td>值</td></tr>';
  var n = navigator;
  var i;
  for (i in n) {
    h += '<tr><td>' + i + '</td><td>' + (typeof n[i]) + '</td><td>' + n[i] + '</td></tr>';
  }
  h += '</tbody>';
  t.innerHTML = h;
  d.body.appendChild(t);
}) ();
