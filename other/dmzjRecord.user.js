// ==UserScript==
// @name        [dmzj]record
// @description 这是一个 [Manga Loader](https://greasyfork.org/zh-CN/scripts/692) 的插件，页面滚动时自动更新浏览记录
// @include     https://manhua.dmzj.com/*.shtml*
// @version     1.0.0.1537692950363
// @Date        2018-9-23 16:55:50
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       none
// ==/UserScript==
(function () {
  'use strict'
  /* eslint-disable camelcase  */
  setInterval(() => {
    if ($.cookie('history_CookieR'))historyLog($.cookie('history_CookieR'))
  }, 5 * 1000)
  $(window).on({
    scroll: () => {
      if (!$.cookie('my')) return
      var item_obj = {}
      item_obj[comic_id] = chapter_id
      item_obj['comicId'] = comic_id // 漫画id
      item_obj['chapterId'] = chapter_id // 话id
      item_obj['page'] = getReadingPage() // 第几页
      item_obj['time'] = Date.parse(new Date()).toString().substr(0, 10) // 观看时间
      $.cookie('history_CookieR', JSON.stringify([item_obj]), { path: '/', expires: 99999 })
    }
  })
  function getReadingPage () {
    let top = $(window).scrollTop()
    let imgTop = $('.ml-counter').toArray().map(i => i.offsetTop)
    let page = imgTop.map(i => i > top).indexOf(true) + 1
    return page
  }
})()
