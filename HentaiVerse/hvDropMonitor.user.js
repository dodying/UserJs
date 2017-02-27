// ==UserScript==
// @name        hvDropMonitor
// @name:zh-CN  【HV】掉落监测
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN  
// @include     http*://hentaiverse.org/*
// @version     1
// @grant       GM_registerMenuCommand
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function () {
  if (document.getElementById('navbar')) return;
  if (!localStorage.dropQuality) dropQuality();
  dropMonitor();
  var mo = new MutationObserver(dropMonitor);
  mo.observe(document.getElementById('monsterpane'), {
    childList: true
  });
  GM_registerMenuCommand('dropMonitor-config', dropQuality, 'c');
  GM_registerMenuCommand('dropMonitor-reset', function () {
    localStorage.removeItem('dropMonitor');
  }, 'r');
  GM_registerMenuCommand('dropMonitor-show', dropShow, 's');
}) ();
function dropQuality() {
  var dropQuality = parseInt(prompt('0.Crude\n1.Fair\n2.Average\n3.Superior\n4.Exquisite\n5.Magnificent\n6.Legendary\n7.Peerless\ndefault 5', localStorage.dropQuality || ''));
  if (isNaN(dropQuality)) dropQuality = localStorage.dropQuality || 5;
  localStorage.dropQuality = dropQuality;
}
function dropMonitor() {
  if (document.querySelectorAll('div.btm1').length === document.querySelectorAll('img[src*="nbardead"]').length) {
    var dropQuality = localStorage.dropQuality;
    var battleLog = document.querySelectorAll('#togpane_log>table>tbody>tr>td:nth-child(3)');
    var drop = (localStorage.dropMonitor) ? JSON.parse(localStorage.dropMonitor)  : {
      '#startTime': new Date().toLocaleString(),
      '#0_Turn': 0,
      '#1_Round': 0,
      '#2_Battle': 0,
      '#EXP': 0,
      '#Credit': 0
    };
    drop['#0_Turn'] = ('#0_Turn' in drop) ? drop['#0_Turn'] + parseInt(document.querySelector('#togpane_log>table>tbody>tr>td').textContent)  : 1;
    drop['#1_Round'] = ('#1_Round' in drop) ? drop['#1_Round'] + 1 : 1;
    var text;
    var item;
    for (var i = 0; ; i++) {
      text = battleLog[i].textContent;
      if (text === 'You are Victorious!') {
        break;
      } else if (/^You gain \d+ EXP!$/.test(text)) {
        drop['#EXP'] += parseInt(text.match(/\d+/) [0]);
      } else if (/dropped \[(\d+) Credits\]$/.test(text)) {
        drop['#Credit'] += parseInt(text.match(/\[(\d+) Credits\]$/) [1]);
      } else if (/dropped \[(.*?)\]$/.test(text)) {
        item = text.match(/\[(.*?)\]$/) [1];
        if (battleLog[i].children[0].style.color === 'rgb(255, 0, 0)') {
          var quality = new Array('Crude', 'Fair', 'Average', 'Superior', 'Exquisite', 'Magnificent', 'Legendary', 'Peerless');
          for (var j = dropQuality; j < quality.length; j++) {
            if (text.match(quality[j])) {
              item = quality[j] + ' Equipment';
              drop[item] = (item in drop) ? drop[item] + 1 : 1;
              break;
            }
          }
        } else {
          drop[item] = (item in drop) ? drop[item] + 1 : 1;
        }
      }
    }
    localStorage.dropMonitor = JSON.stringify(drop);
  }
}
function dropShow() {
  var drop = (localStorage.dropMonitor) ? JSON.parse(localStorage.dropMonitor)  : new Object();
  drop = objSort(drop);
  var _html = '<tbody><tr><td>Name</td><td>Amount</td></tr>';
  for (var i in drop) {
    _html += '<tr><td>' + i + '</td><td>' + drop[i] + '</td></tr>';
  }
  _html += '</tbody>';
  var table = document.createElement('table');
  table.style = 'border-collapse:collapse;border:1px solid #000;margin:0 auto;background-color:#EDEBDF;';
  table.innerHTML = _html;
  document.querySelector('.stuffbox').appendChild(table);
}
function objSort(obj) {
  var arr = new Array();
  for (var i in obj) {
    arr.push(i);
  }
  arr.sort();
  var objNew = new Object();
  for (var i = 0; i < arr.length; i++) {
    objNew[arr[i]] = obj[arr[i]];
  }
  return objNew;
}
