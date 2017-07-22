// ==UserScript==
// @name        【HV】自动加点
// @description
// @include     http://alt.hentaiverse.org/
// @include     http://alt.hentaiverse.org/?s=Character&ss=ch
// @include     http://alt.hentaiverse.org/?s=Battle&ss=ba&encounter=*
// @version     1.00
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function() {
  if (!document.querySelector('img[src="/y/character/inc.png"]')) return;
  var plus, grades, point, temp, min;
  while (document.querySelector('img[src="/y/character/inc.png"]')) {
    plus = document.querySelectorAll('#attr_table>tbody>tr>td:nth-child(7)>img');
    grades = [];
    points = document.querySelectorAll('#attr_table>tbody>tr>td:nth-child(2)>div');
    points.forEach(function(i) {
      if (i.querySelectorAll('div').length > 1) {
        temp = '';
        i.querySelectorAll('div').forEach(function(i) {
          temp = String(-parseInt(i.style.backgroundPositionY) / 12) + temp;
        });
        grades.push(temp * 1);
      } else {
        grades.push(i.textContent * 1);
      }
    });
    min = Math.min.apply(null, grades);
    plus[grades.indexOf(min)].click();
    plus = document.querySelectorAll('img[src="/y/character/inc.png"]');
  }
  document.querySelector('img[src="/y/character/apply.png"]').click();
})();
