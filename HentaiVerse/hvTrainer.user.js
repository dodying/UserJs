// ==UserScript==
// @name        hvTrainer
// @name:zh-CN  【HV】训练
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @include     http*://hentaiverse.org/*
// @include     http*://alt.hentaiverse.org/*
// @version     1.01e
// @grant       none
// @run-at      document-end
// ==/UserScript==
(function () {
  if (!$('#navbar')) return;
  var trainItem = '';
  var dateObj = new Date();
  var countdownBox = document.createElement('div');
  countdownBox.className = 'trainCountdown';
  countdownBox.style.cssText = 'font-weight:bold;font-size:large;';
  $('body').appendChild(countdownBox);
  if (!$('#train_progress')) { //不位于训练界面或训练完成
    var trainTimeEnd = localStorage.trainTimeEnd || '';
    if (trainTimeEnd === '' || trainTimeEnd <= dateObj.getTime() || $('#train_table')) { //训练完成
      countdownBox.innerHTML = '<a href="/?s=Character&ss=tr">Train Completed</a>';
      document.title = 'Train Completed';
      if (trainItem) autoTrain(trainItem); //自动训练
    } else { //不位于训练界面
      var timeLast = parseInt((trainTimeEnd - dateObj.getTime()) / 1000);
      countdownBox.innerHTML = timeLast;
      var timeDecrease = 0;
      var timeUpdateIntarval = setInterval(timeUpdate, 1000);
    }
  } else { //位于训练界面且训练中
    var nowTraining = $('#train_progress>div>strong').innerText;
    var nowTrainingProcess = $('#train_progcnt').innerText;
    var traningItems = document.querySelectorAll('#train_table tr>td:nth-child(1)>div>div');
    for (var i = 0; i < traningItems.length; i++) {
      if (traningItems[i].innerText === nowTraining) break;
    }
    var timeAll = parseInt($('#train_table>tbody>tr:nth-child(' + (i + 2) + ')>td:nth-child(4)>div>div').innerText);
    var timeLast = parseInt(timeAll * (1 - 0.01 * nowTrainingProcess) * 60 * 60);
    localStorage.trainTimeEnd = dateObj.getTime() + timeLast * 1000;
    countdownBox.innerHTML = timeLast;
    var timeDecrease = 0;
    var timeUpdateIntarval = setInterval(timeUpdate, 1000);
  }
  function timeUpdate() {
    timeDecrease++;
    if (timeLast <= timeDecrease) {
      location = location.href;
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
  function autoTrain(name) {
    if (location.search !== '?s=Character&ss=tr') {
      location.search = '?s=Character&ss=tr';
      return;
    }
    var trainList = {
      'Adept Learner': {
        id: 50,
        time: 1
      },
      'Assimilator': {
        'id': '51',
        'time': 24
      },
      'Ability Boost': {
        'id': '80',
        'time': 2
      },
      'Manifest Destiny': {
        'id': '81',
        'time': 24
      },
      'Scavenger': {
        'id': '70',
        'time': 4
      },
      'Luck of the Draw': {
        'id': '71',
        'time': 8
      },
      'Quartermaster': {
        'id': '72',
        'time': 12
      },
      'Archaeologist': {
        'id': '', //
        'time': 24
      },
      'Metabolism': {
        'id': '84',
        'time': 24
      },
      'Inspiration': {
        'id': '85',
        'time': 24
      },
      'Scholar of War': {
        'id': '90',
        'time': 0
      },
      'Tincture': {
        'id': '91',
        'time': 0
      },
      'Pack Rat': {
        'id': '98',
        'time': 0
      },
      'Dissociation': {
        'id': '88',
        'time': 24
      },
      'Set Collector': {
        'id': '96',
        'time': 12
      }
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', location);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.onload = function () {
      localStorage.trainTimeEnd = new Date().getTime() + trainList[name].time * 60 * 60 * 1000;
      location = location.href;
    }
    xhr.send('start_train=' + trainList[name].id);
  }
}) ();
