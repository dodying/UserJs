// ==UserScript==
// @name        audioTest
// @name:zh-CN  
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN  
// @include     http*://hentaiverse.org/*
// @version     1
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function () {
  var audio = document.createElement('audio');
  audio.src = 'http://zjyd.sc.chinaz.com/files/download/sound1/201601/6796.wav';
  document.body.appendChild(audio);
  var img = new Image();
  img.onload = function () {
    audio.play();
  };
  img.onerror = function () {
    audio.play();
  };
  img.src = '/y/hentaiverse.png';
}) ();
