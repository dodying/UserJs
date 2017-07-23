// ==UserScript==
// @name        【HV】怪物实验室-自动加点
// @namespace   https://github.com/dodying/UserJs
// @include     http://alt.hentaiverse.org/?s=Bazaar&ss=ml&slot=*
// @version     1
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function() {
  var morale = document.querySelectorAll('.msl>div>div>img')[1].style.width;
  if (morale !== '120px') {
    var grades = [];
    var elements = document.querySelectorAll('.mcr tr>td:nth-child(2)');
    for (var i = 0; i < elements.length; i++) {
      grades.push((document.querySelectorAll('.mcr tr')[i].querySelector('td:nth-child(1)>img[src*="_a.png"]')) ? parseInt(elements[i].textContent) : Infinity);
    }
    var min = Math.min.apply(null, grades);
    elements = document.querySelectorAll('.mcr tr>td:nth-child(1)>img');
    var target;
    for (i = 0; i < elements.length; i++) {
      target = elements[inArray(min, grades)];
      if (target.hasAttribute('onclick')) {
        target.click();
        break;
      } else {
        grades[inArray(min, grades)] = -1;
      }
    }
  } else {
    if (document.querySelector('[src="/y/character/inc.png"]')) {
      var img = document.querySelectorAll('[src="/y/character/inc.png"]');
      for (var i = 0; i < img.length; i++) {
        var temp = img[i].getAttribute('onmouseover').match(/Upgrade Cost: (\d+) Chaos Tokens?[ ]+Stock: (\d+)/);
        if (parseInt(temp[1]) <= parseInt(temp[2])) {
          img[i].click();
          return;
        }
      }
    }
    var slot = location.href.match(/slot=(\d+)/)[1];
    var dateNow = new Date();
    dateNow = dateNow.getUTCFullYear() + '/' + (dateNow.getUTCMonth() + 1) + '/' + dateNow.getUTCDate();
    var monsterLab = (localStorage.monsterLab) ? JSON.parse(localStorage.monsterLab) : {
      date: dateNow
    };
    if (monsterLab.date === dateNow && monsterLab[slot] === true) {
      return;
    } else if (monsterLab.date !== dateNow) {
      monsterLab = {
        date: dateNow
      };
    }
    monsterLab[slot] = true;
    localStorage.monsterLab = JSON.stringify(monsterLab);
    document.querySelector('#monster_nav>div:nth-child(3)>img').click();
  }

  function inArray(text, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === text) return i;
    }
    return false;
  }
})();
