// ==UserScript==
// @name        hvTrainer
// @name:zh-CN  【HV】训练
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @include     http*://hentaiverse.org/*
// @include     http*://alt.hentaiverse.org/*
// @version     1.01d
// @grant       none
// @run-at      document-end
// ==/UserScript==
(function() {
  if (!gE('#navbar')) return;
  var trainItem = 'Adept Learner';
  var countdownBox = gE('body').appendChild(cE('div'));
  countdownBox.style.cssText = 'font-weight:bold;font-size:large;position:absolute;top:2px;right:2px';
  var timeLast;
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
  post('?s=Character&ss=tr', function(data) {
    if (gE('#train_progcnt', data)) {
      var nowTraining = gE('#train_progress>div>strong', data).innerText;
      var nowTrainingProcess = gE('#train_progcnt', data).innerText;
      var timeAll = trainList[nowTraining].time;
      timeLast = parseInt(timeAll * (1 - 0.01 * nowTrainingProcess) * 60 * 60);
      timeUpdate();
    } else {
      if (trainItem !== '') autoTrain(trainList[trainItem]);
      countdownBox.innerHTML = '<a href="/?s=Character&ss=tr">Train Completed</a>';
      document.title = 'Train Completed';
    }
  });

  function timeUpdate() {
    var h, m, s;
    setInterval(function() {
      timeLast--;
      if (timeLast <= 0) {
        location.href = location.href;
      } else {
        s = Math.floor(timeLast % 60);
        if (s < 10) s = '0' + s.toString();
        m = Math.floor((timeLast / 60) % 60);
        if (m < 10) m = '0' + m.toString();
        h = Math.floor((timeLast / 3600) % 24);
        if (h < 10) h = '0' + h.toString();
        countdownBox.innerText = h + ':' + m + ':' + s;
      }
    }, 1000);
    setTimeout(function() {
      location.href = location.href;
    }, 1000 * 60 * 10);
  }


  function autoTrain(item) {
    post('?s=Character&ss=tr', function() {
      location.href = location.href;
    }, 'start_train=' + item.id);
  }

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

  function cE(name) { //创建元素
    return document.createElement(name);
  }

  function post(href, func, parm) { //post
    var xhr = new XMLHttpRequest();
    xhr.open(parm ? 'POST' : 'GET', href);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.responseType = 'document';
    xhr.onerror = function() {
      xhr = null;
      post(href, func, parm);
    };
    xhr.onload = function(e) {
      if (e.target.status >= 200 && e.target.status < 400 && typeof func === 'function') {
        var data = e.target.response;
        if (xhr.responseType === 'document' && gE('#messagebox', data)) {
          if (gE('#messagebox')) {
            gE('#csp').replaceChild(gE('#messagebox', data), gE('#messagebox'));
          } else {
            gE('#csp').appendChild(gE('#messagebox', data));
          }
        }
        func(data, e);
      }
      xhr = null;
    };
    xhr.send(parm);
  }
})();
