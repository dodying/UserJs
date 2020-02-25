// ==UserScript==
// @name        []https
// @description
// @include     http://*
// @include     https://*
// @version     1.0.7
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @connect     *
// @noframes
// @run-at      document-start
// ==/UserScript==
(function total () {
  'use strict'
  let blacklist = GM_getValue('blacklist', [])
  let host = window.location.host
  if (blacklist.includes(host)) {
    let id
    id = GM_registerMenuCommand('S: Effect ' + host, function () {
      let blacklist = GM_getValue('blacklist', [])
      if (blacklist.includes(host)) {
        blacklist.splice(blacklist.indexOf(host), 1)
        GM_setValue('blacklist', blacklist)
        GM_unregisterMenuCommand(id)
        total()
      }
    }, 's')
  } else {
    if (window.location.protocol === 'http:') {
      let url = window.location.href.replace(/^http:/, 'https:')
      GM_xmlhttpRequest({
        url: url,
        method: 'HEAD',
        timeout: 5 * 1000,
        onload: function (res) {
          if (new URL(res.finalUrl).protocol === 'https:' && res.status === 200) window.location.href = res.finalUrl
        }
      })
    }
    GM_registerMenuCommand('S: DO NOT Effect ' + host, function () {
      let blacklist = GM_getValue('blacklist', [])
      if (!(blacklist.includes(host))) {
        blacklist.push(host)
        GM_setValue('blacklist', blacklist)
        window.location.href = window.location.href.replace(/^https:/, 'http:')
      }
    }, 's')
  }
})()
