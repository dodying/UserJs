// ==UserScript==
// @name        prettyJSON
// @description prettyJSON
// @include     *
// @version     1.0.7
// @date        2019-2-8 18:36:21
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
    document.body.innerHTML = '<pre>' + htmlEscape(JSON.stringify(json, null, 2)) + '</pre>'
    console.log(json)
  } catch (error) {

  }
  function htmlEscape (text) {
    return text.replace(/["&<>]/g, function (match) {
      return {
        '"': '&quot;',
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
      }[match]
    })
  }
})()
