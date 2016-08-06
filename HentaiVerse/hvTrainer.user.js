// ==UserScript==
// @name        hvTrainer
// @namespace   https://github.com/dodying/Dodying-UserJs
// @include     http://hentaiverse.org/*
// @version     1
// @grant       none
// @require     http://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @run-at      document-end
// ==/UserScript==
/*
var script = document.createElement('script');
script.src = 'http://libs.baidu.com/jquery/1.9.1/jquery.min.js';
document.head.appendChild(script);
*/
var dateObj = new Date();
if (!document.querySelector('#progress_counter_1')) {
  var timeEnd;
  if (localStorage.timeEnd) {
    timeEnd = localStorage.timeEnd;
  }
  //console.log(timeEnd)
  if (timeEnd === undefined || timeEnd <= dateObj.getTime()) {
    $('div.clb').append('<div id="trainCountdown" style="font-weight:bold;font-size:large;"><a href="http://hentaiverse.org/?s=Character&ss=tr">训练已完成</a></div>');
  } else {
    var timeLast = parseInt((timeEnd - dateObj.getTime()) / 1000);
    //console.log(timeLast)
    $('div.clb').append('<div id="trainCountdown" style="font-weight:bold;font-size:large;">' + timeLast + '</div>');
    var timeDecrease = 0;
    var timeUpdateInterval = window.setInterval(timeUpdate, 1000);
  }
} else {
  var nowTraining = $('#mainpane>div>table>tbody>tr>td>strong').text();
  var nowTrainingProcess = $('#progress_counter_1').text();
  var timeAll = parseInt($('#trainform>table>tbody>tr:contains(' + nowTraining + ')>td:nth-child(4)>div.fd4>div').text());
  var timeLast = parseInt(timeAll * (1 - 0.01 * nowTrainingProcess) * 60 * 60);
  localStorage.timeEnd = dateObj.getTime() + timeLast * 1000;
  $('div.clb').append('<div id="trainCountdown" style="font-weight:bold;font-size:large;">' + timeLast + '</div>');
  var timeDecrease = 0;
  var timeUpdateInterval = window.setInterval(timeUpdate, 1000);
}
function timeUpdate() {
  timeDecrease++;
  if (timeLast <= timeDecrease) {
    $('#trainCountdown').html('<a href="http://hentaiverse.org/?s=Character&ss=tr">训练已完成</a>')
  } else {
    var timeCountdownNow = timeLast - timeDecrease;
    var second = Math.floor(timeCountdownNow % 60);
    if (second < 10) second = '0' + second.toString();
    var minite = Math.floor((timeCountdownNow / 60) % 60);
    if (minite < 10) minite = '0' + minite.toString();
    var hour = Math.floor((timeCountdownNow / 3600) % 24);
    if (hour < 10) hour = '0' + hour.toString();
    $('#trainCountdown').text(hour + ':' + minite + ':' + second);
  }
}
