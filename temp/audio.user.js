// ==UserScript==
// @name        audio
// @name:zh-CN  
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN  
// @include     *
// @version     1
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
var audio = document.createElement('audio');
audio.src = 'https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/Win.wav';
audio.controls = true;
document.body.appendChild(audio);
audio.play();