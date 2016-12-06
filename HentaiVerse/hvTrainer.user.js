// ==UserScript==
// @name        hvTrainer
// @name:zh-CN  【HV】训练
// @namespace   https://github.com/dodying/Dodying-UserJs
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @include     http://hentaiverse.org/*
// @version     1.01
// @grant       none
// @run-at      document-end
// ==/UserScript==
(function () {
  var dateObj = new Date();
  var countdownBox = document.createElement('div');
  countdownBox.className = 'trainCountdown';
  countdownBox.style.cssText = 'font-weight:bold;font-size:large;';
  $('div.clb').appendChild(countdownBox);
  if (!$('#progress_counter_1')) { //不位于训练界面或训练完成
    var timeEnd = localStorage.timeEnd || '';
    if (timeEnd === '' || timeEnd <= dateObj.getTime()) { //训练完成
      $('.trainCountdown').innerHTML = '<a href="http://hentaiverse.org/?s=Character&ss=tr">训练已完成</a>';
      document.title = '训练已完成';
    } else { //不位于训练界面
      var timeLast = parseInt((timeEnd - dateObj.getTime()) / 1000);
      $('.trainCountdown').innerHTML = timeLast;
      var timeDecrease = 0;
      var timeUpdateIntarval = setInterval(timeUpdate, 1000);
    }
  } else { //位于训练界面且训练中
    var nowTraining = $('#mainpane>div>table>tbody>tr>td>strong').innerText;
    var nowTrainingProcess = $('#progress_counter_1').innerText;
    var traningItems = document.querySelectorAll('#trainform tr>td:nth-child(1) .fd4>div');
    for (var i = 0; i < traningItems.length; i++) {
      if (traningItems[i].innerText === nowTraining) break;
    }
    var timeAll = parseInt($('#trainform tbody>tr:nth-child(' + (i + 2) + ')>td:nth-child(4) .fd4>div').innerText);
    var timeLast = parseInt(timeAll * (1 - 0.01 * nowTrainingProcess) * 60 * 60);
    localStorage.timeEnd = dateObj.getTime() + timeLast * 1000;
    $('.trainCountdown').innerHTML = timeLast;
    var timeDecrease = 0;
    var timeUpdateIntarval = setInterval(timeUpdate, 1000);
  }
  function timeUpdate() {
    timeDecrease++;
    if (timeLast <= timeDecrease) {
      $('.trainCountdown').innerHTML = '<a href="http://hentaiverse.org/?s=Character&ss=tr">训练已完成</a>';
      document.title = '训练已完成';
      clearInterval(timeUpdateIntarval);
    } else {
      var timeCountdownNow = timeLast - timeDecrease;
      var second = Math.floor(timeCountdownNow % 60);
      if (second < 10) second = '0' + second.toString();
      var minite = Math.floor((timeCountdownNow / 60) % 60);
      if (minite < 10) minite = '0' + minite.toString();
      var hour = Math.floor((timeCountdownNow / 3600) % 24);
      if (hour < 10) hour = '0' + hour.toString();
      $('.trainCountdown').innerText = hour + ':' + minite + ':' + second;
    }
  }
  function $(e) {
    return document.querySelector(e);
  }
}) ();
