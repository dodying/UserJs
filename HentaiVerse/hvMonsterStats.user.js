// ==UserScript==
// @name        [HV]MonsterStats
// @namespace   https://github.com/dodying/UserJs
// @include     http://alt.hentaiverse.org/?s=Bazaar&ss=ml&slot=*
// @include     http*://hentaiverse.org/?s=Bazaar&ss=ml&slot=*
// @version     1.01
// @grant       none
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function () {
  var morale = $$('.msl>div>div>img')[1].style.width
  var i
  if (morale.match(/\d+/)[0] * 1 <= 110) { // Morale<=110
    var grades = []
    var elements = $$('.mcr tr>td:nth-child(2)')
    for (i = 0; i < elements.length; i++) {
      grades.push(($$('.mcr tr')[i].querySelector('td:nth-child(1)>img[src*="_a.png"]')) ? parseInt(elements[i].textContent) : Infinity)
    }
    var min = Math.min.apply(null, grades)
    elements = $$('.mcr tr>td:nth-child(1)>img')
    var target
    for (i = 0; i < elements.length; i++) {
      target = elements[inArray(min, grades)]
      if (target.hasAttribute('onclick')) {
        target.click()
        break
      } else {
        grades[inArray(min, grades)] = -1
      }
    }
  } else if ($('[src="/y/character/inc.png"]')) {
    var img = $$('[src="/y/character/inc.png"]')
    var costs = Array.prototype.map.call(img, function (i) {
      return i.getAttribute('onmouseover').match(/Upgrade Cost: (\d+) Chaos Tokens?[ ]+Stock: (\d+)/)[1] * 1
    })
    img[costs.indexOf(Math.min.apply(null, costs))].click()
  } else {
    var slot = window.location.href.match(/slot=(\d+)/)[1]
    var dateNow = new Date()
    dateNow = dateNow.getUTCFullYear() + '/' + (dateNow.getUTCMonth() + 1) + '/' + dateNow.getUTCDate()
    var monsterLab = (window.localStorage.monsterLab) ? JSON.parse(window.localStorage.monsterLab) : {
      date: dateNow
    }
    if (monsterLab.date === dateNow && monsterLab[slot] === true) {
      return
    } else if (monsterLab.date !== dateNow) {
      monsterLab = {
        date: dateNow
      }
    }
    monsterLab[slot] = true
    window.localStorage.monsterLab = JSON.stringify(monsterLab)
    $('#monster_nav>div:nth-child(3)>img').click()
  }

  function $ (e) {
    return document.querySelector(e)
  }

  function $$ (e) {
    return document.querySelectorAll(e)
  }

  function inArray (text, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === text) return i
    }
    return false
  }
})()
