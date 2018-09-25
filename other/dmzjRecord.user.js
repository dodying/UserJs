// ==UserScript==
// @name        [dmzj]record
// @description 自动更新浏览记录
// @include     https://manhua.dmzj.com/*.shtml*
// @version     1.0.2.1537869263042
// @Date        2018-9-25 17:54:23
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       none
// @require     https://static.dmzj.com/public/js/jquery-1.8.2.min.js
// @require     https://static.dmzj.com/public/js/jquery.cookie.js
// ==/UserScript==
(function () {
  'use strict'
  /* eslint-disable camelcase  */
  let getReadingPage = () => {
    let top = $(window).scrollTop()
    let imgTop = $('.ml-images>img,.inner_img img').toArray().map(i => i.offsetTop)
    let page = imgTop.map(i => i > top).indexOf(true)
    let length = imgTop.length
    return page === -1 ? length : page || page + 1
  }
  let getReadingPage2 = () => $('#page_select>option:selected').index() + 1
  let historyLog = historyJson => {
    if ($.cookie('my') != null) {
      var userId = $.cookie('my').split('|')[0]
      $.ajax({
        type: 'get',
        url: '//interface.dmzj.com/api/record/getRe',
        dataType: 'jsonp',
        jsonp: 'callback',
        jsonpCallback: 'record_jsonpCallback',
        data: {uid: userId, type: 1, st: 'comic', json: historyJson},
        success: function (e) {
        }
      })
    }
  }

  setInterval(() => {
    if ($.cookie('history_CookieR')) historyLog($.cookie('history_CookieR'))
  }, 1 * 1000)
  $(window).on({
    scroll: () => {
      if (!$.cookie('my')) return
      var item_obj = {}
      try {
        item_obj[comic_id] = chapter_id
        item_obj['comicId'] = comic_id // 漫画id
        item_obj['chapterId'] = chapter_id // 话id
      } catch (error) {
        let arr = $('img[ori-src]').attr('ori-src').split('/')
        let comic_id = arr[4]
        let chapter_id = arr[5]
        item_obj[comic_id] = chapter_id
        item_obj['comicId'] = comic_id // 漫画id
        item_obj['chapterId'] = chapter_id // 话id
      }
      item_obj['page'] = $('.ml-images>img,.inner_img img').length ? getReadingPage() : getReadingPage2() // 第几页
      item_obj['time'] = Date.parse(new Date()).toString().substr(0, 10) // 观看时间
      $.cookie('history_CookieR', JSON.stringify([item_obj]), { path: '/', expires: 99999 })
    }
  })
})()
