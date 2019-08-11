// ==UserScript==
// @name        prettyJSON
// @description prettyJSON
// @include     *
// @version     1.0.37
// @modified    2019-8-6 13:30:18
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       none
// @noframes
// ==/UserScript==
(function () {
  'use strict'

  try {
    let json = JSON.parse(document.body.textContent)
    console.log(json)
    if (JSON.stringify(json) === '{}') return
    let html = htmlEscape(JSON.stringify(json, null, 2))
    html = html.replace(/(https?:\/\/.*?)(\s|")/g, '<a href="$1" target="_blank">$1</a>$2')
    if (typeof json === 'object') document.body.innerHTML = '<pre>' + html + '</pre>'
  } catch (error) {}

  function htmlEscape (text) {
    return text.replace(/["&<>]/g, function (match) {
      return {
        // '"': '&quot;',
        // '&': '&amp;',
        '"': '"',
        '&': '&',
        '<': '&lt;',
        '>': '&gt;'
      }[match]
    })
  }
})()
