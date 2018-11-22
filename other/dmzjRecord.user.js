// ==UserScript==
// @name        [dmzj]record
// @description 自动更新浏览记录，获取书签
// @include     https://manhua.dmzj.com/*
// @include     https://i.dmzj.com/subscribe
// @version     1.0.6.1542891504588
// @Date        2018-11-22 20:58:24
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @require     https://static.dmzj.com/public/js/jquery-1.8.2.min.js
// @require     https://static.dmzj.com/public/js/jquery.cookie.js
// ==/UserScript==
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
  if ($.cookie('my') !== null) {
    let userId = $.cookie('my').split('|')[0]
    xhrSync(`//interface.dmzj.com/api/record/getRe?callback=callback&uid=${userId}&type=1&st=comic&json=${encodeURIComponent(historyJson)}`)
  }
}

let xhrSync = (url, parm = null, opt = {}) => {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: parm ? 'POST' : 'GET',
      url: url,
      data: parm instanceof Object ? Object.keys(parm).map(i => i + '=' + parm[i]).join('&') : parm,
      timeout: opt.timeout || 60 * 1000,
      responseType: ['arraybuffer', 'blob', 'json'].includes(opt.responseType) ? opt.responseType : null,
      headers: opt.headers || {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      onload (res) {
        resolve(res)
      },
      ontimeout (res) {
        reject(res)
      },
      onerror (res) {
        reject(res)
      }
    })
  })
}

let updateBookmark = async () => {
  let now = new Date().getTime()
  let last = GM_getValue('update', 0)
  if (now - last < 60 * 60 * 1000) return
  let userId = $.cookie('my').split('|')[0]
  if (!userId) return
  let res = await xhrSync(`//interface.dmzj.com/api/getReInfo/comic/${userId}/0`)
  try {
    let bookmark = JSON.parse(res.response)
    let bookmarkLocal = GM_getValue('bookmark', {})
    for (let i of bookmark) {
      if (!(i.comic_id in bookmarkLocal) || i.viewing_time > bookmarkLocal[i.comic_id][2]) { // 保留网上的记录
        bookmarkLocal[i.comic_id] = [i.chapter_id, i.record, i.viewing_time]
      }
    }
    GM_setValue('bookmark', bookmarkLocal)
    GM_setValue('update', now)
    window.location.reload()
  } catch (error) {}
}

let forIndex = async () => {
  let bookmark = GM_getValue('bookmark', {})
  let getChapter = () => {
    let comicId = unsafeWindow.g_comic_id
    if (comicId in bookmark) { // 存在记录
      let info = bookmark[comicId]
      let chapters = $('.cartoon_online_border>ul>li>a')
      let chapter = chapters.toArray().filter(i => i.href.split(/\/|\./)[6] * 1 === info[0] * 1)
      if (chapter.length === 1) {
        chapter = chapter[0]
        $('#last_read_history').html('上次看到：').append($(chapter).clone().removeAttr('class')).append(` <a href="${chapter.href}#page=${info[1]}" target="_blank">第${info[1]}页</a>`).show()
      } else {
        let href = window.location.href + info[0] + '.shtml'
        $('#last_read_history').html(`上次看到： <a href="${href}" target="_blank">未知话</a> <a href="${href}#page=${info[1]}" target="_blank">第${info[1]}页</a>`).show()
      }
    } else {
      $('#last_read_history').html('没有阅读记录，请开始阅读：').append($('.cartoon_online_border>ul>li>a').eq(0).clone()).show()
    }
  }
  if ($('.cartoon_online_border>ul>li>a').length) {
    getChapter()
  } else { // 被屏蔽的漫画
    // 监视DOM
    let observer
    observer = new window.MutationObserver((mutationsList) => {
      for (let i of mutationsList) {
        if (i.addedNodes.length && [...i.addedNodes].filter(j => j.classList && [...j.classList].includes('cartoon_online_button')).length) {
          observer.disconnect()
          getChapter()
          return
        }
      }
    })
    observer.observe($('.middleright_mr')[0], {
      childList: true,
      subtree: true
    })
  }
}

let forRead = () => {
  setInterval(() => {
    if ($.cookie('history_CookieR')) historyLog($.cookie('history_CookieR'))
  }, 10 * 1000)
  $(window).on({
    scroll: () => {
      if (!$.cookie('my')) return
      var item_obj = {}
      if ('comic_id' in unsafeWindow && 'chapter_id' in unsafeWindow) {
        item_obj[unsafeWindow.comic_id] = unsafeWindow.chapter_id
        item_obj['comicId'] = unsafeWindow.comic_id
        item_obj['chapterId'] = unsafeWindow.chapter_id
      } else {
        let arr = $('img[ori-src]').attr('ori-src').split('/')
        let comic_id = arr[4]
        let chapter_id = arr[5]
        item_obj[comic_id] = chapter_id
        item_obj['comicId'] = comic_id
        item_obj['chapterId'] = chapter_id
      }
      item_obj['page'] = $('.ml-images>img,.inner_img img').length ? getReadingPage() : getReadingPage2()
      item_obj['time'] = Date.parse(new Date()) / 1000 // 观看时间
      $.cookie('history_CookieR', JSON.stringify([item_obj]), { path: '/', expires: 99999 })

      let bookmark = GM_getValue('bookmark', {})
      bookmark[item_obj['comicId']] = [item_obj['chapterId'], item_obj['page'], item_obj['time']]
      GM_setValue('bookmark', bookmark)
    },
    click: () => {
      if ($.cookie('history_CookieR')) historyLog($.cookie('history_CookieR'))
    },
    unload: () => {
      if ($.cookie('history_CookieR')) historyLog($.cookie('history_CookieR'))
    }
  })
  if (window.location.hash.match(/^#@page=\d+/)) window.location.hash = window.location.hash.replace('#@page=', '#page=')
}

let forSubscribe = () => {
  let observer = new window.MutationObserver((mutationsList) => {
    let bookmark = GM_getValue('bookmark', {})
    let contents = $('.dy_content_li').toArray()
    for (let i of contents) {
      let comicId = $(i).find('.qx').attr('value')
      if (comicId in bookmark) {
        let href = $(i).find('.begin').attr('href')
        href = href.trim() + '/' + bookmark[comicId][0] + '.shtml#page=' + bookmark[comicId][1]
        $(i).find('.begin').attr('href', href).text('继续阅读')
        if (bookmark[comicId][0] === $(i).find('.c_space>a').attr('href').split(/[/.]/)[6] * 1) $(i).find('.begin').text('已阅读完')
      }
    }
  })
  observer.observe($('.dy_content')[0], {
    childList: true
  })
}

(async function () {
  await updateBookmark()
  if (window.location.href.match(/dmzj.com\/.*?\/\d+.shtml/)) {
    forRead()
  } else if ($('.path_lv3').length) {
    forIndex()
  } else if (window.location.href === 'https://i.dmzj.com/subscribe' && $('#sf-resetcontent').length === 0) {
    forSubscribe()
  }
})()
