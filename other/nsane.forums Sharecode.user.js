// ==UserScript==
// @name        nsane.forums Sharecode
// @description nsane.forums Sharecode
// @include     https://www.nsaneforums.com/topic/*
// @version     1.0.47
// @modified    2019-8-6 13:30:22
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       none
// @noframes
// require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js
// ==/UserScript==
/* eslint-disable no-debugger  */
(function () {
  'use strict'
  ;[...document.querySelectorAll('[data-role="commentContent"]')].forEach(i => {
    [...i.querySelectorAll('div,p')].forEach(j => {
      let text = j.textContent.replace(/&#\d+;/g)
      let site = text.match(/Site:\s*(https?:.*?)(\n|Sharecode)/i)
      let sharecode = text.match(/Sharecode(\[\?\])*:\s*(.*?)(\n|$)/i)
      if (site && sharecode) {
        let link = `${site[1]}${sharecode[2]}`
        console.log(link)
        j.innerHTML += `<br><a target="_blank" href="${link}">${link}</a>`
      }
    })
  })
})()
