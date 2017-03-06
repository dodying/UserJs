// ==UserScript==
// @name		【HV】HV随机遭遇战通知
// @namespace		sigo8@e-hentai.org
// @author		sigo8, LangTuTaiHoa, GaryMcNabb
// @version		1.3.4
// @include		http*://hentaiverse.org/*
// @include		http*://alt.hentaiverse.org/*
// @exclude		http*://hentaiverse.org/pages/showequip*
// @exclude		http*://alt.hentaiverse.org/pages/showequip*
// @include		https://e-hentai.org/news.php
// @grant     none
// @run-at		document-end
// ==/UserScript==
if (window.location.host === 'e-hentai.org') {
  if (document.querySelector('#eventpane>div>a')) {
    location = document.querySelector('#eventpane>div>a').href.replace('hentaiverse.org', 'alt.hentaiverse.org');
  } else {
    location = 'http://alt.hentaiverse.org/';
  }
  return;
}
if (document.querySelector('#riddlemaster')) return;
self.setInterval(function () {
  if (!document.querySelector('#Random_Encounter')) return;
  var time = document.querySelector('#Random_Encounter a').innerHTML;
  if (time == 'Ready') {
    xhr = new XMLHttpRequest();
    xhr.open('POST', window.location.href);
    var parm = 'recover=all';
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(parm);
    xhr.onload = function () {
      document.querySelectorAll('#Random_Encounter a') [1].click();
      window.location = document.querySelector('#Random_Encounter a').getAttribute('href');
    };
  }
}, 3000);
var battleLog = document.getElementById('togpane_log'),
rawDate,
timeToDawn = {
},
logRows,
timerDiv,
timerLink,
resetLink,
time,
timerID,
minute,
second;
function updateTimeToDawn() {
  rawDate = new Date();
  timeToDawn = {
    hour: rawDate.getUTCHours(),
    minute: rawDate.getUTCMinutes() - 1,
    second: rawDate.getUTCSeconds()
  };
}
function timerUpdate() {
  if (--second < 0) {
    second = 59;
    if (--minute < 0) {
      timerLink.href = 'https://e-hentai.org/news.php';
      timerLink.target = '_blank';
      timerLink.onclick = timerReset;
      timerLink.style.setProperty('color', 'red');
      timerLink.innerHTML = 'Ready';
      clearInterval(timerID);
      return;
    }
  }
  timerLink.innerHTML = minute + ':' + (second < 10 ? '0' : '') + second;
}
function timerReset() {
  updateTimeToDawn();
  if ((timeToDawn.hour === 23) && (timeToDawn.minute >= 30)) {
    localStorage.lastRandomEncounter = Date.now() - (((timeToDawn.minute - 30) * 60000) + (timeToDawn.second * 1000));
    minute = 59 - timeToDawn.minute;
    second = 60 - timeToDawn.second;
  } else {
    localStorage.lastRandomEncounter = Date.now();
    minute = 30;
    second = 0;
  }
  timerLink.innerHTML = minute + ':' + (second < 10 ? '0' : '') + second;
  timerLink.style.color = '#5C0C11';
  if (timerID) clearInterval(timerID);
  timerID = setInterval(timerUpdate, 1000);
}
if (battleLog) {
  logRows = battleLog.firstElementChild.firstElementChild.children;
  if (logRows[0].firstElementChild.textContent === '0' && logRows[logRows.length - 2].lastElementChild.textContent[13] === 'r') {
    updateTimeToDawn();
    localStorage.lastRandomEncounter = ((!((timeToDawn.hour === 23) && (timeToDawn.minute >= 30))) ? Date.now()  : Date.now() - (((timeToDawn.minute - 30) * 60000) + (timeToDawn.second * 1000)));
  }
} else {
  timerDiv = document.createElement('div');
  timerLink = document.createElement('a');
  resetLink = document.createElement('a');
  if (!localStorage.lastRandomEncounter) timerReset();
  time = localStorage.lastRandomEncounter - (Date.now() - 1800000);
  minute = second = 0;
  var left = document.documentElement.clientWidth - 100;
  timerDiv.id = 'Random_Encounter';
  timerDiv.style.cssText = 'display:block; position: absolute; top:0px; left:' + left + 'px;';
  timerLink.style.cssText = 'text-decoration:none; font-size:20px; font-weight:bold; color:#5C0C11;';
  resetLink.style.cssText = 'text-decoration:none; color:red; top:-3px; position:relative; left:3px;';
  resetLink.innerHTML = 'RESET';
  resetLink.onclick = timerReset;
  resetLink.href = '#';
  timerDiv.appendChild(timerLink);
  timerDiv.appendChild(resetLink);
  if (time < 0) {
    timerLink.href = 'https://e-hentai.org/news.php';
    timerLink.target = '_blank';
    timerLink.onclick = timerReset;
    timerLink.style.color = 'red';
    timerLink.innerHTML = 'Ready';
  } else {
    time = Math.round(time / 1000);
    minute = Math.floor(time / 60);
    second = time - (minute * 60);
    timerLink.innerHTML = minute + ':' + (second < 10 ? '0' : '') + second;
    timerID = setInterval(timerUpdate, 1000);
  }
  document.body.appendChild(timerDiv);
}
