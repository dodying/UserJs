// ==UserScript==
// @name        [EH]Enhance
// @version     1.16.2.1537614467949
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
//              里站
// @include     https://exhentai.org/
// @include     https://exhentai.org/favorites.php*
// @include     https://exhentai.org/?*
// @include     https://exhentai.org/g/*
// @include     https://exhentai.org/tag/*
// @include     https://exhentai.org/uploader/*
//              表站
// @include     https://e-hentai.org/
// @include     https://e-hentai.org/favorites.php*
// @include     https://e-hentai.org/?*
// @include     https://e-hentai.org/g/*
// @include     https://e-hentai.org/tag/*
// @include     https://e-hentai.org/uploader/*
// @grant       window.close
// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_notification
// @connect     *
// @require     https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://cdn.bootcss.com/jszip/3.1.5/jszip.min.js
// @run-at      document-end
// @compatible  firefox 52+(ES2017)
// @compatible  chrome 55+(ES2017)
// ==/UserScript==
/* global JSZip */

const G = { // 全局变量
  debug: false,
  infoPage: $('.ido').length === 0,
  config: GM_getValue('config', {}),
  'ehD-setting': JSON.parse(GM_getValue('ehD-setting', '{}')),
  EHT: [],
  gmetadata: [],
  favicon: {
    0: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAL0lEQVR42mNgGBQgjU3wPzomJI+ihmoGEHIhTvWDxwBkCVxs2howjAKR/ilxQAEA0niUcVUdSr0AAAAASUVORK5CYII=',
    1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK0lEQVR42mNgGBQgjU3wPzrGp452BhDr0kFsALICbIppb8AwCkT6p8QBBQBmZWTxFXfR8AAAAABJRU5ErkJggg==',
    2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVR42mNgGBQgjU3wPzomJI+ihmoGkOriQWgAsgQ2NtGBSLYBRDuZVAX0M2DgUuKAAgB3d4iRNiZLcAAAAABJRU5ErkJggg==',
    3: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVR42mNgGBQgjU3wPzomJI+ihmoGkOriQWgAsgQ2NtGBSLYBwygQ6Z8SBxQAAOjoiJF+j7m3AAAAAElFTkSuQmCC',
    4: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVR42mNgGBQgjU3wPzrGJo+LTz0DCLlwCBiALIGNjTOcqGYAqdE+CA3AlZBob8CAAgCuIn+p3J00ugAAAABJRU5ErkJggg==',
    5: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANUlEQVR42mNgGBQgjU3wPzomJI+ihmoGEHIhA7kK6GcAskJsbKIDkWwDSI32QWjAwKXEAQUAd3eIkeLwZzcAAAAASUVORK5CYII=',
    d: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABTSURBVHjaYvj//z8DJZiBKgaksQn+R8cMSABdjmIDkA1BMYABB0DXhMwfZAYgG4SNTXsDCHmBgYFhgA1IYxNUJioMyE5IZCflAc2NAAAAAP//AwAC/Mv3iQhmBgAAAABJRU5ErkJggg==',
    p: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABTSURBVHjaYvj//z8DJZiBKgaksQn+R8cMSACbfBqb4H/qG8CAA6DLD2IDkBViYxMdiGQbQIwX8KYDmhuQxiaoTGlKlKXUAG7aZCZKMAAAAP//AwCS0Ls1SQllgAAAAABJRU5ErkJggg=='
  },
  introPicName: [
    /999\.(png|jpg)$/i,
    /^i_\.(png|jpg)$/i,
    /^zCREDIT/i,
    '招募圖',
    '無邪気',
    /^Read(|_)(|\d+)\.(png|jpg)$/i,
    /^CEwanted\.(png|jpg)$/i,
    /\.gif$/i
  ],
  digitalJpRe: /[0-9０-９零一二三四五六七八九十百千万零壹贰参肆伍陆柒捌玖拾佰仟萬]/g,
  digitalRomaji: {
    rei: 0,
    ichi: 1,
    ni: 2,
    san: 3,
    yon: 4,
    shi: 4,
    go: 5,
    roku: 6,
    nana: 7,
    shichi: 7,
    hachi: 8,
    kyu: 9,
    jyu: 10,
    ix: 9,
    x: 10,
    viii: 8,
    vii: 7,
    vi: 6,
    iv: 4,
    v: 5,
    iii: 3,
    ii: 2,
    i: 1
  },
  timeout: null,
  downloading: false,
  imageD: [],
  imageS: [],
  imageEnd: false,
  imageData: null,
  autoDownload: false,
  downloadSizeChanged: false,
  taskInterval: null,
  this: (() => {
    let used = ['addEventListener', 'alert', 'applicationCache', 'atob', 'blur', 'browser', 'btoa', 'caches', 'cancelAnimationFrame', 'cancelIdleCallback', 'captureEvents', 'chrome', 'clearInterval', 'clearTimeout', 'clientInformation', 'close', 'closed', 'confirm', 'createImageBitmap', 'crypto', 'customElements', 'decodeURI', 'decodeURI', 'decodeURIComponent', 'defaultStatus', 'defaultstatus', 'devicePixelRatio', 'dispatchEvent', 'document', 'encodeURI', 'encodeURIComponent', 'eval', 'external', 'fetch', 'find', 'focus', 'frameElement', 'frames', 'getComputedStyle', 'getSelection', 'history', 'indexedDB', 'innerHeight', 'innerWidth', 'isFinite', 'isNaN', 'isSecureContext', 'length', 'localStorage', 'location', 'locationbar', 'matchMedia', 'menubar', 'moveBy', 'moveTo', 'name', 'navigator', 'onabort', 'onafterprint', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'onappinstalled', 'onauxclick', 'onbeforeinstallprompt', 'onbeforeprint', 'onbeforeunload', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondevicemotion', 'ondeviceorientation', 'ondeviceorientationabsolute', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'ongotpointercapture', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onlanguagechange', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onlostpointercapture', 'onmessage', 'onmessageerror', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpause', 'onplay', 'onplaying', 'onpointercancel', 'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove', 'onpointerout', 'onpointerover', 'onpointerup', 'onpopstate', 'onprogress', 'onratechange', 'onrejectionhandled', 'onreset', 'onresize', 'onscroll', 'onsearch', 'onseeked', 'onseeking', 'onselect', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'ontransitionend', 'onunhandledrejection', 'onunload', 'onvolumechange', 'onwaiting', 'onwebkitanimationend', 'onwebkitanimationiteration', 'onwebkitanimationstart', 'onwebkittransitionend', 'onwheel', 'open', 'openDatabase', 'opener', 'origin', 'outerHeight', 'outerWidth', 'pageXOffset', 'pageYOffset', 'parent', 'parseFloat', 'parseInt', 'performance', 'personalbar', 'postMessage', 'print', 'prompt', 'releaseEvents', 'removeEventListener', 'requestAnimationFrame', 'requestIdleCallback', 'resizeBy', 'resizeTo', 'screen', 'screenLeft', 'screenTop', 'screenX', 'screenY', 'scroll', 'scrollBy', 'scrollTo', 'scrollX', 'scrollY', 'scrollbars', 'self', 'sessionStorage', 'setInterval', 'setTimeout', 'speechSynthesis', 'status', 'statusbar', 'stop', 'styleMedia', 'toolbar', 'top', 'visualViewport', 'webkitCancelAnimationFrame', 'webkitRequestAnimationFrame', 'webkitRequestFileSystem', 'webkitResolveLocalFileSystemURL', 'webkitStorageInfo']

    let variabled = {}
    for (let i in this) {
      if (!used.includes(i)) {
        variabled[i] = this[i]
      }
    }
    return variabled
  })(),
  function: { init, abortPending, add2Fav, addStyle, arrUnique, autoDownload, autoComplete, batchDownload, btnAddFav0, btnAddFav, btnAddFav2, btnFake, btnFake2, btnSearch, btnSearch2, btnTask, btnTask2, calcRelativeTime, changeEConfig, changeFav, changeName, checkExist, checkForNew, checkImageSize, combineText, copyInfo, defaultConfig, downloadAdd, downloadRemove, findData, getEConfig, getEditDistance, getInfo, hideGalleries, highlightBlacklist, htmlEscape, introPic, jumpHost, languageCode, makeRange, openUrl, quickDownload, rateInSearchPage, reEscape, saveAs, saveAs2, saveLink, setNotification, setNotification2, searchInOtherSite, showAllThumb, showConfig, showTooltip, sortObj, tagEvent, tagPreview, task, taskRemove, tagTranslate, toggleBlacklist, translateText, updateEHD, updateEHT, waitInMs, waitForElement, xhr, xhrSync }
}
G.autoDownload = window.location.hash.match(/^#[0-2]$/) && G.config['autoStartDownload']
G.downloadSizeChanged = !G['ehD-setting']['store-in-fs'] && G.config['enableEHD'] && G.config['showAllThumb'] && G.config['enableChangeSize'] && G.config['sizeS'] !== G.config['sizeD'] && G.config['downloadSizeChanged']
G.digitalRomajiRe = new RegExp('(\\W)(' + Object.keys(G.digitalRomaji).join('|') + ')(\\W)', 'gi')

async function init () {
  GM_registerMenuCommand(GM_info.script.name + ': Show Global', function () {
    console.log(G)
  }, 'S')
  defaultConfig() // 默认设置
  addStyle() // 添加样式
  $('<div class="ehNavBar" style="bottom:0;"><div></div><div></div><div></div></div>').appendTo('body')
  $(window).on({
    scroll: () => {
      $('.ehNavBar').attr('style', $(window).scrollTop() >= 30 && G.infoPage ? 'top:0;' : 'bottom:0;')
    }
  })

  let now = new Date().getTime()
  let lastTime = GM_getValue('EHT_checkTime', 0)
  if (G.config['updateIntervalEHT'] !== 0 && now - lastTime >= G.config['updateIntervalEHT'] * 24 * 60 * 60 * 1000) {
    try {
      await updateEHT()
    } catch (err) { }
  }
  if (GM_getValue('EHT')) {
    G.EHT = JSON.parse(GM_getValue('EHT')).dataset
  } else {
    let res = await xhrSync('https://github.com/dodying/UserJs/raw/master/E-hentai/EHT.json')
    let EHT = res.response
    GM_setValue('EHT', EHT)
    G.EHT = JSON.parse(EHT).dataset
  }

  if (G.infoPage) { // 信息页
    if (G.config['enableEHD']) {
      let now = new Date().getTime()
      let lastTime = GM_getValue('EHD_checkTime', 0)
      if (!GM_getValue('EHD_code') || (G.config['updateIntervalEHD'] !== 0 && now - lastTime >= G.config['updateIntervalEHD'] * 24 * 60 * 60 * 1000)) {
        try {
          await updateEHD()
        } catch (err) { }
      }
      let recordEHDUrl = [
        'let __record = false',
        'console.log = function (...msg) {',
        `  if (msg.length && typeof msg[0] === 'string' && msg[0].match(/\\[EHD\\] #\\d+: Network Error/)) {`,
        '    __record = true',
        '  } else if (__record && msg.length === 10) {',
        `    let record = GM_getValue('EHD_record', [])`,
        '    let host = new URL(msg[8]).hostname',
        '    if (!record.includes(host)) {',
        '      record.push(host)',
        `      GM_setValue('EHD_record', record)`,
        '    }',
        '    __record = false',
        '  }',
        '}'
      ]
      let toEavl = [
        '(function () {',
        `var loadSetting = function () { return new Promise(resolve => { resolve(GM_getValue('ehD-setting')) }) }`,
        'let console = {}',
        'for (let i in window.console) { console[i] = new Function() }',
        'let alert = function () { }',
        'let confirm = function () { return true }',
        (G.config['recordEHDUrl'] ? recordEHDUrl.join('\n') : ''),
        GM_getValue('EHD_code'),
        'let checkInterval = function () {',
        '  if (totalCount <= 0) return',
        '  if (totalCount === downloadedCount && failedCount > 0) { failedCount = 0; checkFailed() }',
        `  if (fetchCount < 0) { fetchCount = [...document.querySelectorAll('.ehD-pt-progress')].filter(i => { let value = i.getAttribute('value'); return value === null || (value * 1 < 1 && value * 1 > 0) }).length; updateTotalStatus(); checkFailed() }`,
        `  if (downloadedCount + failedCount >= totalCount && failedCount > 0 && fetchCount > 0) { retryAllFailed() }`,
        // '  window.console.log("totalCount:\t", totalCount, "\nfetchCount:\t", fetchCount, "\ndownloadedCount:\t", downloadedCount, "\nfailedCount:\t", failedCount)',
        // '  window.console.log(JSON.stringify({"总计": totalCount, "下载中": fetchCount, "已完成": downloadedCount, "下载失败": failedCount}))',
        // '  window.console.log(totalCount, fetchCount, downloadedCount, failedCount)',
        '}',
        'setInterval(checkInterval, 300)',
        '})()'
      ]
      /* eslint-disable no-eval */
      eval(toEavl.join('\n')) // 运行EHD
    } else {
      let loaded = await waitForElement('.ehD-box', 30 * 1000)
      if (!loaded) console.error('载入 E-Hentai-Downloader 超时')
      setNotification('载入 E-Hentai-Downloader 超时')
    }
    $('.g2:contains("Download Archive")').click(e => { // 使用EHD下载时, 添加到下载列表
      if (e.originalEvent && G.downloadSizeChanged) autoDownload()
      downloadAdd()
      if ($('[rel="shortcut icon"]').length === 0) changeFav(G.favicon.d)
      $('.ehNavBar').attr('style', 'top:0;')
    })
    $(window).on('unload', () => { // 关闭页面时, 从下载列表中移除
      downloadRemove()
    })
    if (G.config['ex2eh'] && jumpHost()) return // 里站跳转
    changeName('#gn') // 修改本子标题（移除集会名）
    document.title = $('#gn').text()
    tagTranslate() // 标签翻译
    if (!GM_getValue('apikey')) {
      GM_setValue('apikey', unsafeWindow.apikey)
      GM_setValue('apiuid', unsafeWindow.apiuid)
    }
    btnAddFav() // 按钮 -> 加入收藏(信息页)
    btnSearch() // 按钮 -> 搜索(信息页)
    btnFake() // 按钮 -> 下载空文档(信息页)
    btnTask() // 按钮 -> 添加到下载任务(信息页)
    tagEvent() // 标签事件
    copyInfo() // 复制信息
    abortPending() // 终止EHD所有下载
    if (G.config['showAllThumb']) await showAllThumb()
    introPic() // 宣传图
    if (G.config['enableChangeSize'] && G.config['sizeS'] !== G.config['sizeD']) await checkImageSize()
    await waitInMs(500)
    if (G.autoDownload) await autoDownload() // 自动开始下载
  } else { // 搜索页
    if (G.config['eh2ex'] && window.location.host === 'e-hentai.org' && $('[name="f_search"]').val()) {
      window.location = window.location.href.replace('//e-hentai.org', '//exhentai.org')
      return
    }
    $('[name="f_apply"]').hide()
    $('<input type="button" value="Apply Filter" title="右键: 添加/删除 中文">').on({
      click: () => {
        $('[name="f_apply"]').click()
      },
      contextmenu: () => {
        let value = $('[name="f_search"]').val()
        value = value.match('language:"chinese"\\$') ? value.replace('language:"chinese"$', '').trim() : value + ' language:"chinese"$'
        $('[name="f_search"]').val(value)
        $('[name="f_apply"]').click()
      }
    }).insertBefore('[name="f_apply"]')
    if ($('[name="f_search"]').val()) document.title = translateText($('[name="f_search"]').val())
    $('<div class="ehContainer"></div>').insertAfter('.it3,.id4')
    btnAddFav2() // 按钮 -> 加入收藏(搜索页)
    btnSearch2() // 按钮 -> 搜索(搜索页)
    quickDownload() // 右键：下载
    if ($('table.itg').length) batchDownload() // Displsy: List => 批量下载
    btnFake2() // 按钮 -> 下载空文档(搜索页)
    btnTask2() // 按钮 -> 添加到下载任务(搜索页)
    if (G.config['checkExist']) checkExist() // 检查本地是否存在
    let _gmetadata = await getInfo() || []
    G.gmetadata.push(..._gmetadata)
    changeName('.it5>a,.id2>a') // 修改本子标题（移除集会名）
    if (G.config['languageCode']) languageCode() // 显示iso语言代码
    tagPreview() // 标签预览
    hideGalleries() // 隐藏某些画集
    if (G.config['checkExistAtStart']) $('input:button[name="checkExist"]').click()
    if ($('table.itg').length && G.config['preloadPaneImage']) $('.itd:visible[onmouseover]').trigger('mouseover')
    rateInSearchPage() // 在搜索页评分
    autoComplete() // 自动填充
    checkForNew() // 检查有无新本子
  }
  highlightBlacklist() // 高亮黑名单相关的画廊(通用)
  showConfig()
  searchInOtherSite()
  if (G.config['saveLink']) saveLink() // 保存链接
  $('<input type="button" value="Clear Downloading" tooltip="重置下载列表">').on({
    click: () => {
      GM_setValue('downloading', [])
    },
    mouseenter: e => {
      $(e.target).attr('title', '当前下载列表:<br> ' + GM_getValue('downloading', []).join('<br> '))
    }
  }).prependTo('.ehNavBar>div:eq(2)')
  $('<input type="button" value="Start Task" tooltip="' + htmlEscape('左键: 开始下载任务<br>右键: 重置当前下载任务') + '">').on({
    mousedown: e => {
      if (e.button === 0) {
        task()
      } else if (e.button === 2) {
        GM_deleteValue('tasking')
      }
    },
    mouseenter: e => {
      let task = GM_getValue('task', [])
      $(e.target).attr('title', '当前任务:<br> ' + GM_getValue('tasking', '') + '<hr>当前任务列表: ' + task.length + '<br> ' + task.join('<br> '))
    }
  }).appendTo('.ehNavBar>div:eq(2)')
  showTooltip() // 显示提示
  $('body').on('mousedown', 'a,button,input[type="button"],div:empty', e => {
    $(e.target).css('border-color', 'red').css('border-style', 'solid').css('border-width', '1px')
  })
  $('body').on('mousedown', '[copy]', e => {
    e.preventDefault()
    let copy = $(e.target).attr('copy')
    setNotification(copy, '已复制')
    GM_setClipboard(copy)
  }).on('contextmenu', () => false)
  $('.ehNavBar').attr('oncontextmenu', 'return false')
}

function abortPending () { // 终止EHD所有下载
  $('<input type="button" value="Force Abort" title="终止EHD所有下载">').on({
    click: () => {
      $('.ehD-pt-item:not(.ehD-pt-succeed,.ehD-pt-failed) .ehD-pt-abort').click()
    }
  }).appendTo('.ehNavBar>div:eq(1)')
}

function add2Fav (gid, token, i, target) { // 添加收藏
  if (i === '10') i = 'favdel'
  xhr(`/gallerypopups.php?gid=${gid}&t=${token}&act=addfav`, () => {
    target = $(target)
    if (i === 'favdel') {
      target.attr('class', 'btnAddFav').removeAttr('id').removeAttr('style')
    } else {
      target.attr('id', 'favicon_' + gid).attr('class', 'i').css('background-position', `0px -${i * 19 + 2}px`)
    }
  }, `favcat=${i}&favnote=&submit=Apply+Changes&update=1`)
}

function addStyle () { // 添加样式
  let backgroundColor = $('body').css('background-color')
  $('<style></style>').text([
    'input[type="number"]{width:60px;border:1px solid #B5A4A4;margin:3px 1px 0;padding:1px 3px 3px;border-radius:3px;}',
    'input:disabled{cursor:progress;color:#808080;}',
    '.ido,.itg,#pp{max-width:9999px!important;min-width:0!important;justify-content:center;}',
    'div.itg,#pp{display:flex;flex-wrap:wrap;flex-flow:row wrap;align-items:flex-start;}',
    'div.itg,.id1{box-sizing:border-box;height:auto!important;}',
    '.it5{max-width:9999px!important;}',
    '.ehNavBar{display:flex;width:99%;background-color:' + backgroundColor + ';position:fixed;z-index:1000;padding:0 10px;}',
    '.ehNavBar>div{flex-grow:1;}',
    '.ehNavBar>div:nth-child(1){text-align:left;}',
    '.ehNavBar>div:nth-child(2){text-align:center;}',
    '.ehNavBar>div:nth-child(3){text-align:right;}',
    '.btnSearch{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVQ4jX1TvW7iQBBeJCLBPQOF66PwzuwWRjTrwjUVz8Aj2D2iRLmTsJLIut4UfgCfkIJ0D0ARUkR5AlMvLrJSvmvAR0wuI02xs/N98y9ES5hZMfMDM78S0dtJX4joTkop2/6NKKW+EdEvpRS+UiK6HwwG/SuwlPLPpaPWClpraH1NIqV89DyvJ4ToCCGEaEeezWYoigLb7RZ5nmM6nV6RMHNqjOkKZlaXH1mWwVqL/X6PzWaDqqrgnEOSJGhn6Ps+CWZ+uIxsrcVyuWwcgyBAWZao6xpRFJ3AGlprMPNKMPPrmbEoCuz3+6t0wzCEcw6LxaIBa63AzM+CiN7OrNvtFpvN5tPuV1WFNF01BKeJ1BcECnmeo6oqBEHwATyZTGCtRRzHDfhEcBRE9HI2TKdTOOdQliXCMGzAu90Oh8MB4/G4Pc4nQUR3l8YkSVDXNZxzqKoK1locDgccj0fkef4hA2a+FVJK2a43iiIsFguk6QpxHGM8HmO9XgMAsiw7g9+Hw+H38yLdt0n+dVs37yzLMJ/PoZSC7/s/m00cDAZ9KeXj/8CfrPJvz/N6xphucw+e5/WYOf3qBpj5nZl/eJ7XG41GfaXUzeVNdYwxXd/3iZlXzPxMRDURHaWUT8x8e6q5Y4zpKqVujDHdv6rJoiTHuLTjAAAAAElFTkSuQmCC);}',
    '.btnAddFav{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVQ4ja2TSwrDMAxERyNvEgg9jFdC25y9tMdpcwB3k4/j2GkoFQiMkZ9GHwPAE0D60R84CxCR1U/itkNmYmZdjLE3sw6A4GhNAN19GMd4c/cBACuPsSgsAeXj9+ylkeQBIJXMtfLo7oOq7gFm1lVkN8sjufVARFKMsc9kVzuuyilLsgfM3WYLEIImVX3VyltqaY6qMZXTPVgBIWhqjPQrgKqcCtkHdS3AlWX6/yYmAIlkUtWUzbnq+SY+lsuLvy+Lw/0DpJalxJ3rpocAAAAASUVORK5CYII=);}',
    '.id44>.btnAddFav,.id44>.i[id^="favicon_"],.id44>.btnSearch{float:right;margin:4px 2px 0 0;}',
    '.i[id^="favicon_"],#fav>.i{cursor:pointer;background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAADSCAYAAACVdpq7AAALdElEQVRoge2a/0/Tdx7H+SfwlyX+0OKJsMap0x/4oWauEm+4JcjiD1wuuYVAlgHzDAKd3t08ik5ZoMNpN4+Im3yg35CJl3iS0iET1h0Xk4rYFEkRcaM0DS0dxYHsw+N+KJ9PaPspX7r74RJ9Jk34kufz9Xq+Xq/3q+9+ycj4v4Moiuj1eubn59kUcXFhgZKSEnQ6HYWFhUQikY0JRCIRCgsLKSwspKSkRP55ampqbYGpqak4ovQoLCxEp9Pxo29SWeBH36ScZklJCQaDgcWFBURR5I6zTxYYGhqKF/B4PHHEkpISgsEgPT096PV6gsEgjQ0NssAdZ19M4I6zL4nY2NDA/Pw8jQ0N6PV67jj7uOPsi7Ngs3eSkehRr9fTdkUgFAphMBgwGAzY7J14PJ6kGihGvmS6SDAYxGAwoNfr48hxkZU8S2nr9Xr0ej09PT309PQke05V7VAohM3eiV6vZ2pqCoPBoFxtpT4bDAaCwSCiKNLT04NOp8Pj8aw9KGlPmITE2Q6FQps7HGmfqhcVoijy3Z//zML8s81X2pqfj1mjwZqfTzQyuzGBaGQWa34+w7k5oNXyk0qFNT+fcMC//hqy5ufzk0oFWi19Z+qpN33NTyoVZo2GwOMJZYHA4wnMGo1M1D14QAbQeP1fcgZmjYYn9+7FC0yOuOOIFBdDdTXnXa4YubgYtFrm1GrMGg2+3t6YgK+3F7NGw5xaHUekqYnzLhfnXa7Y7wkCXquVjNUeVxMRBM6OjcXITU2KAr8t8nqeq+4OpPa8XrUzAJV/OnW1U/VZirhunyXMhUOKExb4cXzja2j1bM+F01hDaZ2qFxWiKPLtFx9tvmCLCwvYTxTQ+d527CcKNrGGohHsJwoYrdrG8oX9jFZtQyjbt/4aCgf8CGX7GK3axuHzt3nlk1Fe+WSUC3+tRCjbl3rKAj+Oy8RzZ01UNVuhu5pvv/iIVz4ZJXRKjVC2j8kRd7zA00fDCGX7CJ1Ss3xhP/Wmr6k3fQ19TdBdzSufjLJ8YT+hU2o639vO2JAzJjDxHwed722XiVwrhu7qGPE/AjZ7J5e/vA7XiuMEvE4rGasjJhLvOPtiC3Alg9UCQtk+Uka22TtTEuXISp6//eKjWKorxKpmq7LnxGqHTqnj2iQ9UlZbqc+ShdUe111D0chsehMmIXG201pDaZ2qFxWiKPJdbyULC5u8PoqiiL2jgC7zduwdBUSjG3xRFo1GsHcU8HA4C6Jano6qaG/du/7NNxQK0d66l4fDWRQe7iJzi4/MLT4+NVbS3rqXQOBxijUUeEx7616ejqr4rrcS3ZuD/Dpfw79/OEHmFh/BiVgGE5MJB2Ni0k17616CEyqIauFZMb/O18BiE/2OZgoPd0FUy9y0mvbWvYyNSmto3EGXebsicdcOL7t2eOl3NMOzYlmgy7wd70MrGaki/vJrJ7/82on3oZVdO7yxv68SaLm0k4yJcQftrXuZm1YrCrDYROmfBrn5zZnkyEqeb35zBt2bg7DYxMSogcwtPqbH30n2rFTt6fF30L05KLeqsaEhdbUlzIT9soBkYfWgpOzzehM2E97MGlo12z/PpXMb6q1kcWHh5RraCERR5MPv63m22TW0uLBA0c1Kfnf7EPnWPxLZ6BqKRCPkW/9IlrcILeW813IMbftR/OHA2gL+cABt+1GZ+Fm7EU+2DfXMEXYLb/Mk1Xg+CTxmt/A26pkjaCmnmL8zWGTDk21DS7ks8GByOF7gweRwErGtro22KwKebBvF/F0WyLbk4xwbiAk4JgbItuTHERvc/8DWPETnyC082TaOPTcmCXSO3CJD2340jnjsuZHBIhudI7fwWq14sm20upMFdgtvkxT52HMjt99vx1XRhauiC0+2jdvvt3PsuTE5cirPx54baXXbFD07JgZQrLbUpg+/r+f2++14sm00H7+Qutqp+pzoMWWfU01YlrdoYxMmIXG2Q3Phza+htE7ViwpRFPmqr2bzt6HFhQXq7QX89fbvqLcXbHwNRaMR6u0FNI+p6V7eT/OYmpNC3vrPVTNhPyeFPGpLP6c00yc/PjVWclLISz2egcBjTgp5XA6oOHfWhJNiBpdqcVJM9/J+LgdUVJtzkw/GxKSbanMulwMqupf3c+6sicGlWka4GCfw1ZyaanMubt/K+yRuXy/V5ly+mot5dFJMY+11KrZ5KM308fFbdxUFBr1WMqRUJeLgUi2Xv7zOcNjCcNiCqXyAy19eTxI41rITxchSyiNcxGbvxFQ+oBxZyXPFNo8s8PFbd7lkuqjsWcKTlWo3j6lpPn5BbtPpd2+sXW0J/nBAFpAsSMQ1+ywhku6ESUic7bRuQ2mdqhcVoihSdXeA+c1eHxcXFiiw29E4HBTY7YTm5jYmMBuNUmC3s230Edpl2Db6iDxBwB9e5ynHHw6TJwhoHA4GDh3CtyWT4dwcWWA8kOLJbjwQIE8QUPmnGTh0iEumi1Qvw3BuDlXd3aj80+R2mHFPJnzU5p6cJLfDjMo/zdHnSwzn5lC9DE1A9TIcfb6EdhnUsxFyO8z0+nwxgV6fj9wOM+rZCNplqOruZjg3Jy7ts2NjskDW/DNyO8xYvV4ypFS1KxHOu1z8pFLxz/5+OoG+M/U4q6riMsiaf8bOlhaSIp8dG2M4N4cmoBNo6+9n4NAh5ciJnrUrRWq7ItAEdNTV0VFXp+x5dbV3trSg8k9TdXeA4dwcfFsy5agpq53YZ2lApFRV/ml2trSk7rOE0NxcehMmIe3ZlpD2qXpRIYoitcdd6X1gX3i4iz05FgoPdxGZjW7wRdlslMLDXeza4aVAC6+pZ3gjT2Dav86QBP1h3sgTZGJpMXECT8ZTjOeT8QBv5Am8pp7h3FkTbl+m/Hg4nMWuHV725Fh46E44GA/dk+zJsfCaeoYCLXzWbqSpwY2pCQx/CXPJdFHOYE+OBadj5U1yp2M8jlhaDH+rBlMT2AS4+c0ZDH8Jx1nYk2PhltVLhpSqEtHpGOfb7+owNcX+niiwZuR//3ACW/OQIvGWdWUNJXqWBNy+TMWUZc9K1S7QQu1xF25fZhIxqdpyn4NBWaD0T4O4fZkb6/NvnjAJibMdDqWxhmqPu4hGNngoXnSIooipfIBn82nchk6/e4OKVy3UHDBvvOLRSJSaA2bq1eNc00K9epyaA2aCG1lDNQfMnH73BnrvVvTerdTdy+Pjt+7ywe6ra6+hD3ZfpV49jt67lba6Nhy1S1wyXeR0v45G9SwVr6ZYQx/svkqjepZrWjjdr8PWPITLuISteYjz3SVc0yIL3OtduRnc6/VR8apFJnb9QcTWPETdvTw+d5XwuasER+0SXX8Q4wRuWb1k1BwwxxEdtUt81VdDl+Nr7jj7qLuXh83emSTwwe6rKEauu5eHy7jEAwFcxiX03q3KkRM9X/19GL13q+y57YrA6X6dsmelap87a4prlal8IHW1E/ssDYiUar16fO0+/+YJk5A42z+ns4bSOlUvKkRRxFXRtfnbkCiKWA42YNEYsBxs2NwashxsYDTrGmgHGM26huVgA2H/zDof2PtnZGLRzUoyfUfI9B2h+fgFLBrD2t8bsmgMjGZdo7GhgaKblVB2n4lyJ1neIjzZNlp2nmTSnXCiJt0+LBoDIfUN0A5QZY19cXDJOAZl9ynpPkVbXRsh9Q0sGgNjzpW3OyYcD+OIlN3ns3YjH35fD8JT+ttuk+Ut4pLpImgHZIFHwhAZloMNcUTK7vNIGOL1kVIyfUd4faSU10dKabsixP6/ItCy8ySKkSm7H0tZeMqScYwsbxGuiq7kyEqeJ8qdZPqOsGQc47N2IzpXRRxR9qxU7el3etC5Ksj0HUHnqmD6nR6ZmFRtpT7LFqRB0RhSf01Vws+hufQmTELibKe1hlwVXS8/sH+Jl3iJl/if478+4qV4DzoUcgAAAABJRU5ErkJggg==")!important;}',
    '.ehConfig{position:fixed;top:30px;bottom:23px;left:0;right:0;min-width:720px;max-width:1200px;margin:3px auto;padding:3px 5px;;border:solid 1px black;z-index:3;overflow:auto;background-color:' + backgroundColor + ';}',
    '.ehConfig>ul{text-align:left;}',
    '.ehTagEvent{display:none;font-weight:bold;}',
    '.ehTagEvent::before{margin-left:10px;content:url("https://ehgt.org/g/mr.gif") " " attr(name);}',
    '.ehTagEvent>a{cursor:pointer;text-decoration:none;}',
    '.ehTagEvent>a::before{margin-left:10px;margin-right:2px;content:url("https://ehgt.org/g/mr.gif");}',
    '.ehDatalist{display:none;overflow-y:auto;max-height:300px;}',
    '.ehDatalist>ol{list-style:decimal;text-align:left;}',
    '.ehDatalist>ol>li{cursor:pointer;}',
    '.ehDatalist>ol>li::after{content:"  "attr(cname);font-size:9pt;font-weight:bold;}',
    '.ehDatalistHover{color:#f00;font-weight:bold;font-size:large;}',
    'div.itg .ehContainer,,#pp .ehContainer{width:220px;min-height:5px;margin:auto;}',
    '.ehExistContainer{float:left;max-width:240px;max-height:20px;overflow:auto;}',
    '.ehExistContainer::-webkit-scrollbar{height:2px;width:2px;}',
    '.ehExistContainer::-webkit-scrollbar-track{background:#ddd;}',
    '.ehExistContainer::-webkit-scrollbar-thumb{background:#666;}',
    '.ehExist{display:inline-block;color:#fff;background:#000;border:black 1px solid;cursor:pointer;margin:1px;}',
    '.ehExist::before{content:attr(fileSize) "M";}',
    '.ehExist[filesize="0.00"]::before{content:"X";color:#f00;}',
    '.ehExist[name="force"]{color:#0f0;}',
    '.ehExist[name="force1"]{color:#00f;}',
    '.ehExist[name="incomplete"]{color:#f00;background:#00f;}',
    '.ehTagPreview{position:fixed;padding:5px;display:none;z-index:999999;font-size:larger;width:250px;border-color:#000;border-style:solid;color:#fff;background-color:#34353b;}',
    '.ehTagPreviewLi{color:#ffffff;}',
    '.ehTagPreviewLi[name="language"]>span{background-color:#ff0000;}',
    '.ehTagPreviewLi[name="language"]::before{content:"语言: ";}',
    '.ehTagPreviewLi[name="reclass"]::before{content:"重新分类: ";}',
    '.ehTagPreviewLi[name="artist"]>span{font-size:larger;background-color:#0000ff;}',
    '.ehTagPreviewLi[name="artist"]::before{content:"漫画家: ";}',
    '.ehTagPreviewLi[name="group"]>span{font-size:larger;background-color:#00ff00;}',
    '.ehTagPreviewLi[name="group"]::before{content:"组织: "}',
    '.ehTagPreviewLi[name="parody"]>span{font-size:larger;background-color:#3d7878;}',
    '.ehTagPreviewLi[name="parody"]::before{content:"同人: ";}',
    '.ehTagPreviewLi[name="character"]>span{background-color:#9f0050;}',
    '.ehTagPreviewLi[name="character"]::before{content:"角色: ";}',
    '.ehTagPreviewLi[name="female"]>span{background-color:#00008b;}',
    '.ehTagPreviewLi[name="female"]::before{content:"女: ";}',
    '.ehTagPreviewLi[name="male"]>span{background-color:#800080;}',
    '.ehTagPreviewLi[name="male"]::before{content:"男: ";}',
    '.ehTagPreviewLi[name="misc"]>span{background-color:#808080;}',
    '.ehTagPreviewLi[name="misc"]::before{content:"杂项: ";}',
    '.ehTagPreviewLi[name="other"]::before{content:"未分类: ";}',
    '.ehTagPreviewLi>span{display:inline;margin:0 2px;border:1px #456F78 solid;}',
    '.ih>li{margin:0 2px;cursor:pointer;list-style:none;}',
    '.ih>li::before{content:attr(name) ": ";}',
    '.ih>li>span,.ehTagNotice{margin:1px;}',
    '.ehTagNotice{float:left;}',
    '.ehTagNotice[name="Unlike"],#taglist div[id][name="Unlike"]{color:#f00;background-color:#00f;}',
    '.ehTagNotice[name="Alert"],#taglist div[id][name="Alert"]{color:#ff0;background-color:#080;}',
    '.ehTagNotice[name="Like"],#taglist div[id][name="Like"]{color:#000;background-color:#0ff;}',
    '.ehTagEvent>.ehTagEventNotice[on="true"]::after{content:attr(name);}',
    '.ehTagEvent>.ehTagEventNotice[on="false"]::after{content:"NOT " attr(name);}',
    '.ehTooltip{max-width:50%;display:none;position:fixed;text-align:left;z-index:99999;border:2px solid #8d8d8d;background-color:' + backgroundColor + ';}',
    '.ehTooltip>ul{margin:0;}',
    '.ehCheckTableContainer{position:fixed;top:23px;bottom:16px;left:0;right:0;min-width:950px;max-width:1200px;margin:10px auto;padding:5px;border:solid 1px black;z-index:2;background-color:' + backgroundColor + ';}',
    '.ehCheckTableContainer>div{overflow:auto;}',
    '.ehCheckTable{counter-reset:checkOrder;height:calc(100% - 65px);}',
    '.ehCheckTable>table{margin:0 auto;border-collapse:collapse;}',
    '.ehCheckTable th,.ehCheckTable td{border:2px ridge #000;}',
    '.ehCheckTable tr>td:nth-child(1)::before{counter-increment:checkOrder;content:counter(checkOrder);}',
    '.ehCheckTable a{text-decoration:none;}',
    '.ehPages>a{display:inline;margin:0 1px;cursor:pointer;}',
    '.ehPages>a::before{content:attr(name)}',
    '.ehPagesHover{color:red;font-weight:bold;}',
    '.ehCheckContainer{text-align:center;}',
    '.ehCheckContainer>td{padding:3px 4px;border-right:1px solid #40454b;}',
    '.ehBlacklist{color:#000;background-color:#000;}',
    '.ehBlacklist:hover{color:inherit;background-color:inherit;}',
    'table.itg>tbody>tr.ehBatchHover{background-color:#669933;}',
    'table.itg>tbody>tr:hover{background-color:#4a86e8;}',
    '.gdtm [name="intro"]{white-space:nowrap;}',
    '.gdtm [name="intro"][on="true"]::after{content:"Block: " attr(file);}',
    '.gdtm [name="intro"][on="false"]::after{content:"Unblock: " attr(file);}',
    '[copy]{cursor:pointer;}',
    '.ehSites{display:inline-block;}',
    '.ehSites>a{display:none;}',
    '.ehSites>a:nth-child(1),.ehSites:hover>a{display:list-item;list-style:none;}',
    '.ehSites>a>img{margin:-3px 0!important;height:16px!important;width:16px!important;}',
    '.ehHighlight{color:#0f0;background-color:#000;margin:3px;font-size:125%;font-weight:bold;}',
    'span.ehLang{float:left;border:black 1px solid;color:#0f0;margin:1px;background:#000;}',
    '.ehNew{width:25px;height:12px;float:left;background-image:url(https://ehgt.org/g/n.gif);}',
    '.ehConfig [name="selectFile"]{width:.1px;height:.1px;opacity:0;overflow:hidden;}',
    '.ehNotification{display:flex;z-index:2147483647;position:fixed;bottom:1px;right:1px;border:solid 1px #000;background-color:' + backgroundColor + ';min-width:300px;cursor:pointer;}',
    '.ehNotification>div:nth-child(1){flex:1;}',
    '.ehNotification>div:nth-child(2){flex:4;}',
    '.ehNotification>div:nth-child(2)>div:nth-child(1){font-size:16px;font-weight:bold;white-space:nowrap;}',
    '.ehFavicion{background: url(favicon.ico) no-repeat center center;}',
    '.ehIgnore{filter:blur(1px) grayscale(1);}',
    '.ehIgnore:hover{filter:none;}'
  ].join('\n')).appendTo('head')
  $('.i:has(.n),.id44>div>a:has(.tn)').css('float', 'right') // .hide(); //隐藏种子图标
}

function arrUnique (arr) { // 数组去重
  return [...(new Set(arr))]
}

async function autoDownload (isEnd) { // 自动开始下载
  // isEnd false: 下载小图, true: 下载大图
  if (G.downloadSizeChanged) {
    if (G.imageD.length && G.imageS.length) {
      let imageSize = isEnd ? G.config['sizeD'] : G.config['sizeS']
      await changeEConfig('xr', imageSize)
      changeFav(G.favicon[imageSize])
      $('label:contains("Pages Range")>input').val(makeRange(isEnd ? G.imageD : G.imageS))
      G.imageEnd = isEnd
    } else {
      G.downloadSizeChanged = false
      $('label:contains("Pages Range")>input').val(makeRange(G.imageD.length ? G.imageD : G.imageS))
    }
  }
  $('.ehD-box>.g2:eq(0)').click()
}

function autoComplete () { // 自动填充
  let main = (G.config['acItem'] || 'language,artist,female,male,parody,character,group,misc').split(',')
  main = G.EHT.filter(i => main.includes(i.name))
  $('<div class="ehDatalist"><ol start="0"></ol></div>').on('click', 'li', function (e) {
    let value = $('[name="f_search"]').val().split(/\s+/)
    value[value.length - 1] = e.target.textContent
    $('[name="f_search"]').val(value.filter(i => i).join(' ')).focus()
    $('.ehDatalist>ol').empty()
    $('.ehDatalist').show()
  }).appendTo('form:has([name="f_search"])')
  let lastValue
  $('[name="f_search"]').attr('title', `当输入大于${G.config['acLength']}个字符时，显示选单<br>使用主键盘区的数字/加减/方向键快速选择<br>点击/Enter/Insert键填充<br>使用输入法时，无法使用数字/加减选择`).on({
    focusin: function () {
      $('.ehDatalist').show()
    },
    focusout: function () {
      setTimeout(() => {
        $('.ehDatalist').hide()
      }, 100)
    },
    keydown: function (e) {
      let hasItem = $('.ehDatalist li').length
      let onItem = $('.ehDatalistHover').index()
      if (hasItem && e.keyCode <= 57 && e.keyCode >= 48) { // 选择选项: 0-9
        e.preventDefault()
        $('.ehDatalist li').eq(e.keyCode - 48).click()
      } else if (hasItem && [187, 189, 37, 38, 39, 40].includes(e.keyCode)) { // 选择选项: 加减/方向键
        e.preventDefault()
        if ([187, 40].includes(e.keyCode)) { // 选择选项: +下
          onItem = onItem + 1
        } else if ([189, 38].includes(e.keyCode)) { // 选择选项: -上
          onItem = onItem - 1
        } else if (e.keyCode === 39) { // 选择选项: 右
          onItem = onItem + 10
        } else if (e.keyCode === 37) { // 选择选项: 左
          onItem = onItem - 10
        }
        if (onItem < 0) {
          onItem = 0
        } else if (onItem > hasItem - 1) {
          onItem = hasItem - 1
        }
        $('.ehDatalist li').removeClass('ehDatalistHover')
        $('.ehDatalist li').eq(onItem).addClass('ehDatalistHover')
        $('.ehDatalist').scrollTop($('.ehDatalistHover').position().top - $('.ehDatalist>ol').position().top - 150 + $('.ehDatalistHover').height() / 2)
      } else if (onItem >= 0 && [13, 45].includes(e.keyCode)) { // 选择选项: Insert
        e.preventDefault()
        $('.ehDatalistHover').click()
      }
    },
    keyup: function (e) {
      let value = e.target.value.split(/\s+/)
      value = value[value.length - 1]
      if (value === lastValue) return
      $('.ehDatalist>ol').empty()
      if (!value || (value.length <= G.config['acLength'] && !value.match(/[\u4e00-\u9fa5]/))) return
      lastValue = value
      value = new RegExp(value, 'i')
      main.forEach(i => {
        i.tags.filter(j => j.name && (j.name.match(value) || combineText(j.cname, true).match(value))).forEach(j => {
          $(`<li cname="${combineText(j.cname, true)}">${i.name}:"${j.name}"$</li>`).appendTo('.ehDatalist>ol')
        })
      })
      $('.ehDatalist').show()
    }
  })
}

function batchDownload () { // 批量下载
  $('<th><input type="checkbox" title="全选"></th>').appendTo('table.itg tr:eq(0)')
  $('table.itg tr:eq(0) input').on('click', function (e) {
    $('table.itg tr:gt(0) input').prop('checked', e.target.checked)
    if (e.target.checked) {
      $('table.itg tr:gt(0):not(.ehCheckContainer)').addClass('ehBatchHover')
    } else {
      $('table.itg tr:gt(0):not(.ehCheckContainer)').removeClass('ehBatchHover')
    }
  })
  $('<td><input type="checkbox"></td>').appendTo('table.itg tr:gt(0):not(.ehCheckContainer)')
  $('table.itg tr:gt(0):not(.ehCheckContainer)').on('click', e => {
    if ($(e.target).is('a,input') || $(e.target).parents().filter('a,input').length) return
    $(e.currentTarget).find('input[type="checkbox"]').click()
  })
  $('table.itg tr:gt(0) input').on('click', function (e) {
    if (e.target.checked) {
      $(e.target).parentsUntil('tbody').eq(-1).addClass('ehBatchHover')
    } else {
      $(e.target).parentsUntil('tbody').eq(-1).removeClass('ehBatchHover')
    }
  })
  window.sessionStorage.setItem('batch', 0)
  $('<input type="button" value="Batch" title="' + htmlEscape('左键: Batch<br>右键: 重置Batch') + '">').on('mousedown', e => {
    if (e.button === 2) {
      window.sessionStorage.setItem('batch', 0)
    } else {
      let batch = window.sessionStorage.getItem('batch') * 1
      $('table.itg tr input:checked').click()
      let books = $('table.itg tr:gt(0):visible:not(:has(.i[id^="favicon_"],.ehExist,.ehBlacklist),.ehCheckContainer)').toArray()
      books.splice(batch * G.config['batch'], G.config['batch']).forEach(i => {
        $(i).find('input[type="checkbox"]').click()
      })
      window.sessionStorage.setItem('batch', batch * G.config['batch'] <= books.length ? batch + 1 : 0)
    }
  }).appendTo('.ehNavBar>div:eq(2)')
  $('<input type="button" value="Open" title="' + htmlEscape('左中右'.split('')[G.config['auto2Fav']] + '键: Open + Add to Favorites (上次选择)<br>其他: Open') + '">').on('mousedown', e => {
    $('.ehBatchHover .it5>a').toArray().forEach(i => {
      openUrl(i.href + '#' + e.button)
    })
    if (e.button === G.config['auto2Fav'] * 1) {
      $('.ehBatchHover').toArray().forEach(i => {
        let arr = $(i).find('.it5>a').attr('href').split('/')
        add2Fav(arr[4], arr[5], GM_getValue('lastFavcat', '0'), $(i).find('.i[id^="favicon"],.btnAddFav')[0])
      })
    }
  }).appendTo('.ehNavBar>div:eq(2)')
  $('<input type="button" value="Add Favorites" title="' + htmlEscape('左键: Add to Favorites (上次选择)<br>中键: Add to Favorites (自行选择)<br>右键: Remove from Favorites') + '">').on('mousedown', function (e) {
    let favcat = e.button === 0 ? GM_getValue('lastFavcat', '0')
      : e.button === 1 ? window.prompt(`请选择：\n${G.config['bookmark'].split(',').join('\n')}\n10.从收藏中移除`, GM_getValue('lastFavcat', '0')) : '10'
    if (!favcat) return
    $('.ehBatchHover').toArray().forEach(i => {
      let arr = $(i).find('.it5>a').attr('href').split('/')
      add2Fav(arr[4], arr[5], favcat, $(i).find('.i[id^="favicon"],.btnAddFav')[0])
    })
  }).appendTo('.ehNavBar>div:eq(2)')
}

function btnAddFav0 (e, url) { // 按钮 -> 加入收藏(通用事件)
  let event = G.config['bookmarkEvent'].split('|').filter(i => i.match(new RegExp(`^${e.button},`)))
  for (let i = 0; i < event.length; i++) {
    let arr = event[i].split(',')
    let keydown = arr[1] === '-1' ? true : e[['altKey', 'ctrlKey', 'shiftKey'][arr[1]]]
    if (keydown) {
      if (arr[2] === 'b') {
        let keyword = $('.ido').length ? $(e.target).parentsUntil('tr,.itg').eq(-1).find('.it5,.id2').text() : $('#gn').text()
        keyword = window.prompt('请输入加入黑名单或从黑名单中移除的关键词', keyword)
        if (keyword) toggleBlacklist(keyword.trim())
        highlightBlacklist()
      } else {
        let favcat = arr[2] === undefined ? GM_getValue('lastFavcat', '0') : arr[2]
        if (favcat === '-1') {
          favcat = window.prompt(`请选择：\n${G.config['bookmark'].split(',').join('\n')}\n10.从收藏中移除`, GM_getValue('lastFavcat', '0'))
          if (!favcat) return
          GM_setValue('lastFavcat', favcat)
        }
        add2Fav(url[4], url[5], favcat, e.target)
      }
      break
    }
  }
}

function btnAddFav () { // 按钮 -> 加入收藏(信息页)
  let fav = -1
  if ($('#gdf>#fav>.i').length > 0) fav = 0 - (parseInt($('#gdf>#fav>.i').css('background-position-y')) + 2) / 19
  let url = window.location.href.split('/')
  $('#gdf').attr('title', G.config['bookmarkEventChs']).empty().removeAttr('onclick').on({
    contextmenu: () => false,
    mousedown: e => {
      btnAddFav0(e, url)
    }
  })
  if (fav === -1) {
    $('#gdf').attr('class', 'btnAddFav').removeAttr('id').removeAttr('style')
  } else {
    $('#gdf').attr('class', 'i').attr('id', 'favicon_' + url[4]).css('background-position', '0px -' + (fav * 19 + 2) + 'px')
  }
}

function btnAddFav2 () { // 按钮 -> 加入收藏(搜索页)
  $('<div class="btnAddFav"></div>').appendTo($('.it3,.id44').filter(':not(:has(.i[id^="favicon_"]))'))
  $('.i[id^="favicon_"]').attr('class', 'btnAddFav i').removeAttr('onclick')
  $('.btnAddFav').attr('title', G.config['bookmarkEventChs']).on({
    contextmenu: () => false,
    mousedown: e => {
      let href = $(e.target).parentsUntil('.itd,div.itg,#pp').eq(-1).find('.it5>a,.id2>a').attr('href')
      btnAddFav0(e, href.split('/'))
    }
  })
}

function btnFake () { // 按钮 -> 下载空文档(信息页)
  $('<input type="button" value="Fake" title="' + htmlEscape('下载一个 <span class="ehHighlight">名称.cbz</span> 的空文档') + '">').on('mousedown', e => {
    saveAs('', $('#gn').text().trim() + '.cbz')
  }).appendTo('.ehNavBar>div:eq(2)')
}

function btnFake2 () { // 按钮 -> 下载空文档(搜索页)
  $('<input type="button" value="Fake" title="' + htmlEscape('下载一个 <span class="ehHighlight">名称.cbz</span> 的空文档') + '">').on('mousedown', e => {
    $('.ehBatchHover .it5>a').toArray().forEach(i => {
      saveAs('', i.textContent.trim() + '.cbz')
    })
  }).appendTo('.ehNavBar>div:eq(2)')
}

function btnSearch () { // 按钮 -> 搜索(信息页)
  let text = $('#gn').text() || $('#gj').text()
  if (text === '') return
  $('<div class="ehSearch"></div>').appendTo('#gd2')
  text = text.split(/[[\](){}【】|\-\d]+/)
  for (let i = 0; i < text.length; i++) {
    text[i] = text[i].trim()
    if (text[i]) $('<span></span>').html(`<input id="ehSearch_${i}" type="checkbox"><label for="ehSearch_${i}">${text[i]}</label>`).appendTo('.ehSearch')
  }
  $('<input type="button" value="Search" title="搜索">').appendTo('.ehSearch').click(() => {
    let keyword = $('.ehSearch input:checked+label').toArray().map(i => '"' + i.textContent + '"').join(' ')
    if (keyword.length > 0) openUrl(G.config['searchArguments'].replace(/{q}/g, encodeURIComponent(keyword)))
  })
}

function btnSearch2 () { // 按钮 -> 搜索(搜索页)
  $('<div class="btnSearch"></div>').attr('title', G.config['searchEventChs']).appendTo('.it3,.id44').on({
    contextmenu: () => false,
    mousedown: e => {
      let event = G.config['searchEvent'].split('|').filter(i => i.match(new RegExp(`^${e.button},`)))
      for (let i = 0; i < event.length; i++) {
        let arr = event[i].split(',')
        let keydown = arr[1] === '-1' ? true : e[['altKey', 'ctrlKey', 'shiftKey'][arr[1]]]
        if (keydown) {
          let name
          let gid = $(e.target).parentsUntil('.itd,div.itg,#pp').eq(-1).find('.it5>a,.id2>a').attr('href').match(/\/g\/(\d+)/)[1] * 1
          let tags = G.gmetadata.filter(i => i.gid === gid)[0].tags.map(i => i.match(/^\w+:/) ? i.replace(/^(\w+:)/, '$1"') + '"$' : `misc:"${i}"$`)
          if (arr[2] === '-1') {
            let order = window.prompt(tags.map((i, j) => `${j}: ${translateText(i)}`).join('\n'))
            if (order) {
              name = tags[order]
            } else {
              return
            }
          } else if (arr[2] === '0') {
            name = $(e.target).parentsUntil('.itd,div.itg,#pp').eq(-1).find('.it5>a,.id2>a').text()
            name = name.replace(/\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）|-|!/g, '').replace(/\|.*/, '').trim()
            name = '"' + name + '"'
          } else if (arr[2] === '1' && tags.filter(i => i.match(/^(artist|group):/)).length) {
            name = tags.filter(i => i.match(/^artist:/)).length ? tags.filter(i => i.match(/^artist:/))[0] : tags.filter(i => i.match(/^group:/))[0]
          } else {
            return
          }
          if (arr[3] === '1') name += ' language:"chinese"$'
          openUrl(G.config['searchArguments'].replace(/{q}/g, encodeURIComponent(name)))
          break
        }
      }
    }
  })
}

function btnTask () { // 按钮 -> 添加到下载任务(信息页)
  $('<input type="button" value="Add Task" tooltip="' + htmlEscape('左键: 添加到下载任务<br>中键: 重置下载任务<br>右键: 从任务列表中删除') + '">').on({
    mousedown: e => {
      if (e.button === 0) {
        let task = GM_getValue('task', [])
        let url = window.location.href.replace(/#\d+$/, '')
        if (!(task.includes(url))) {
          task.push(url)
          GM_setValue('task', task)
        }
      } else if (e.button === 1) {
        GM_setValue('task', [])
      } else if (e.button === 2) {
        let task = GM_getValue('task', [])
        let url = window.location.href.replace(/#\d+$/, '')
        if (task.includes(url)) {
          task.splice(task.indexOf(url), 1)
          GM_setValue('task', task)
        }
      }
    },
    mouseenter: e => {
      let task = GM_getValue('task', [])
      $(e.target).attr('title', '当前任务列表: ' + task.length + '<br> ' + task.join('<br> '))
    }
  }).appendTo('.ehNavBar>div:eq(2)')
}

function btnTask2 () { // 按钮 -> 添加到下载任务(搜索页)
  $('<input type="button" value="Add Task" tooltip="' + htmlEscape('左键: 添加到下载任务<br>中键: 重置下载任务<br>右键: 从任务列表中删除') + '">').on({
    mousedown: e => {
      if (e.button === 0) {
        let task = GM_getValue('task', [])
        $('.ehBatchHover .it5>a').toArray().forEach(i => {
          if (!(task.includes(i.href))) task.push(i.href)
        })
        GM_setValue('task', task)
      } else if (e.button === 1) {
        GM_setValue('task', [])
      } else if (e.button === 2) {
        let task = GM_getValue('task', [])
        $('.ehBatchHover .it5>a').toArray().forEach(i => {
          if (task.includes(i.href)) task.splice(task.indexOf(i.href), 1)
        })
        GM_setValue('task', task)
      }
    },
    mouseenter: e => {
      let task = GM_getValue('task', [])
      $(e.target).attr('title', '当前任务列表: ' + task.length + '<br> ' + task.join('<br> '))
    }
  }).appendTo('.ehNavBar>div:eq(2)')
}

function calcRelativeTime (time) { // 计算相对时间
  let delta = new Date().getTime() - new Date(time).getTime()
  let info = {
    millisecond: 1,
    second: 1000,
    minute: 60,
    hour: 60,
    day: 24,
    month: 30,
    year: 12
  }
  let suf
  let t = delta
  for (let i in info) {
    let m = t / info[i] // 倍数
    let r = t % info[i] // 语数
    if (m >= 1 || info[i] - r <= 2) { // 进阶
      t = m
      suf = i
    } else {
      break
    }
  }
  t = Math.round(t)
  let text = `about ${t} ${suf}${t > 1 ? 's' : ''} ago`
  if (delta <= 1000 * 60 * 60 * 24 * 7) text = '<span class="ehHighlight">' + text + '</span>'
  return text
}

async function changeEConfig (key, value) { // 修改EH设置
  let uconfig
  if (G.config['uconfig']) {
    uconfig = G.config['uconfig']
  } else {
    uconfig = await getEConfig()
  }
  uconfig = uconfig.replace(new RegExp(key + '=.*?(&|$)'), key + '=' + value + '$1') + '&apply=Apply'
  await xhrSync('/uconfig.php', uconfig)
}

function changeFav (url) { // 修改Favicon
  if ($('[rel="shortcut icon"]').length === 0) {
    $('<link rel="shortcut icon" href="' + url + '" type="image/x-icon">').appendTo('head')
  } else {
    $('[rel="shortcut icon"]').attr('href', url)
  }
}

function changeName (e) { // 修改本子标题（移除集会名）
  $(e).toArray().forEach(i => {
    let title = i.textContent.replace(/^\(.*?\)( |)/, '').replace(/\s+/g, ' ').trim()
    if (G.config.changeRomajiName) {
      let jTitle = G.infoPage ? $('#gj').text() : G.gmetadata.filter(j => j.gid === i.href.match(/g\/(\d+)\//)[1] * 1)[0].title_jpn
      jTitle = jTitle.replace(/^\(.*?\)( |)/, '').replace(/\s+/g, ' ').trim()
      if (jTitle.match(G.digitalJpRe) && title.match(G.digitalRomajiRe)) {
        title = title.replace(G.digitalRomajiRe, (matched, p1, p2, p3, offset, string) => {
          if (G.debug) console.log({matched, p1, p2, p3, offset, string, title, i})
          return p1 + (p1.match(/[-—~～]/) ? ' ' : '') + G.digitalRomaji[p2.toLowerCase()] + (p1.match(/[-—~～]/) ? ' ' : '') + p3
        })
      }
    }
    i.textContent = title
  })
}

function checkExist () { // 检查本地是否存在
  $('table.itg tr .it5,.id1 .id2').toArray().forEach(i => {
    $('<div class="ehExistContainer"></div>').prependTo($(i).parent().find('.ehContainer'))
  })
  $('<input type="button" value="Check Exist" name="checkExist" title="只检查可见的，且之前检查无结果">').on('click', async (e) => {
    let uselessStrRE = /\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）|～|~/g
    let langRE = /\[(Chinese|English|Digital)\].*/gi

    $(e.target).val('Checking').prop('disabled', true)
    let lst = $('table.itg tr:visible:not(:has(.ehExist[name^="force"])) .it5,.id1:visible:not(:has(.ehExist[name="force"])) .id2').toArray()
    let name = {}
    lst.forEach((i, j) => {
      if (G.config['checkExistName2']) {
        name[j] = i.textContent.replace(uselessStrRE, '').replace(/\|.*/g, '').replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '').trim()
      } else {
        let arr = i.textContent.replace(/\|.*?([([{【［（]|$)/, '$1').replace(/[\\/:*?"<>|]/g, '-').replace(langRE, '').split(/[[\](){}【】［］（）～~]+/).map(i => i.trim().replace(/\.$/, '').trim()).filter(i => i)
        name[j] = arr.join()
        if (name[j] === '') name[j] = i.textContent.replace(uselessStrRE, '').replace(/\|.*/g, '').replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '').trim()
      }
    })
    try {
      let res = await xhrSync('http://127.0.0.1:3000/', 'names=' + encodeURIComponent(JSON.stringify(name)), {
        responseType: 'json',
        timeout: 120 * 1000
      })
      lst.forEach((i, j) => {
        let name = i.textContent
        let name2 = name.match(/\|.*?([([{【［（]|$)/) ? name.replace(/\|.*?([([{【［（]|$)/, '$1') : name
        name = name.replace(/[\\/:*?"<>|]/g, '-')
        name2 = name2.replace(/[\\/:*?"<>|]/g, '-')
        let name3 = name.replace(langRE, '').replace(/\.$/, '').trim()
        let name4 = name2.replace(langRE, '').replace(/\.$/, '').trim()
        name = name.replace(/\.$/, '').trim()
        name2 = name.replace(/\.$/, '').trim()
        res.response[j].forEach(k => {
          if (k.match(/\.jpg$/)) return
          let fileSize = (k.match(/^([\d,]+)/)[1].replace(/,/g, '') * 1 / 1024 / 1024).toFixed(2)
          let fileName = k.replace(/^[\d,]+\s+/, '')
          let noExt = fileName.replace(/\.(zip|cbz|rar|cbr)$/, '').trim()
          let noExtRE = new RegExp('^' + reEscape(noExt).replace(/_/g, '.') + '$')
          let noLang = noExt.replace(langRE, '').trim()
          let noLangRE = new RegExp('^' + reEscape(noLang).replace(/_/g, '.') + '$')
          let p = $(i).parent().find('.ehExistContainer')
          let _name = (noExtRE.exec(name) || noExtRE.exec(name2)) ? 'force'
            : noExt.match(/\[Incomplete\]/i) ? 'incomplete'
              : (noLangRE.exec(name3) || noLangRE.exec(name4)) ? 'force1' : ''
          let ed = _name === 'force' ? 0 : getEditDistance(noExt, name)
          if (p.find(`[copy="${noExt}"][fileSize="${fileSize}"]`).length === 0) $(`<span class="ehExist" fileSize="${fileSize}" name="${_name}" copy="${noExt}" similar="${ed}" tooltip="EditDistance: ${ed}"></span>`).appendTo(p)
          $(p).find('.ehExist').toArray().sort((a, b) => $(a).attr('similar') * 1 - $(b).attr('similar') * 1).forEach(ele => $(ele).appendTo(p))
        })
      })
    } catch (err) {
      if (err.status === 0) {
        setNotification('checkExistSever', ' is not running')
      } else {
        console.error(err)
      }
    }
    $(e.target).val('Check Exist').prop('disabled', false)
  }).appendTo('.ehNavBar>div:eq(1)')
}

function checkForNew () { // 检查有无新本子
  let searchKey
  let listStyle = $('#nb>img')[0].outerHTML
  $(listStyle).appendTo('#nb')
  $('<a href="javascript:;">Add to CheckList</a>').on({
    contextmenu: () => false,
    mousedown: e => {
      e.preventDefault()
      let keyword = $('[name="f_search"]').val()
      let list = GM_getValue('checkList', {})
      let name
      let nameInput
      if (keyword in list && list[keyword].name) name = list[keyword].name
      if (e.button === 0) {
        if (!name) name = translateText(keyword)
        nameInput = window.prompt('请输入名称\n留空: ' + name)
        if (nameInput === null) return
      }
      let time = new Date().getTime()
      time = time - new Date(G.gmetadata[0].posted * 1000).getTime() <= G.config['checkTimeDeviation'] * 60 * 60 * 1000 ? new Date(G.gmetadata[0].posted * 1000).getTime() + 1 : time
      list[keyword] = {
        time: time,
        result: $('.ip').text().match(/Showing .*? of [\d,]+/) ? $('.ip').text().match(/Showing .*? of ([\d,]+)/)[1].replace(/,/g, '') * 1 : 0
      }
      if (nameInput || name !== translateText(keyword)) list[keyword].name = nameInput || name
      GM_setValue('checkList', sortObj(list, 'time'))
    }
  }).appendTo('#nb')
  $(listStyle).appendTo('#nb')
  $('<a href="javascript:;">Show CheckList</a>').on('click', e => {
    if ($('.ehCheckTableContainer').length) {
      $('.ehCheckTableContainer').toggle()
      return
    }
    $('<div class="ehCheckTableContainer"></div>').html('<div>过滤: <input name="search" type="text"></div><div class="ehPages"></div><div class="ehCheckTable"><table><thead><tr><th>#</th><th>Keyword</th><th>Name</th><th><a class="ehCheckTableSort" href="javascript:;" name="time" title="sort by time">Time</a></th><th><a class="ehCheckTableSort" href="javascript:;" name="result" title="sort by result">Result</a></th><th><input name="selectAll" type="checkbox" title="全选"></th></tr></thead><tbody></tbody></table></div><div class="ehCheckTableBtn"></div>').appendTo('body')
    let buildBody = (filter = undefined) => {
      searchKey = filter
      let list = GM_getValue('checkList', {})
      let keys = Object.keys(list)
      if (searchKey) {
        let searchKeyRE = new RegExp(searchKey, 'gi')
        keys = keys.map(i => {
          return Object.assign({
            key: i
          }, list[i])
        }).filter(i => i.key.match(searchKeyRE) || (i.name || translateText(i.key)).match(searchKeyRE)).map(i => i.key)
      }
      let getSomeList = page => {
        $('.ehCheckTable tbody').empty()
        for (let key = (page - 1) * G.config['checkListPerPage']; key < page * G.config['checkListPerPage']; key++) {
          if (key >= keys.length) break
          let i = keys[key]
          let tr = $('<tr><td></td><td></td><td></td><td></td><td></td><td><input type="checkbox"></td></tr>')
          $('<a target="_blank"></a>').attr('href', G.config['searchArguments'].replace(/{q}/g, encodeURIComponent(i))).text(i).appendTo($(tr).find('td:eq(1)'))
          $(tr).find('td:eq(2)').text(list[i].name || translateText(i))
          let d = new Date(list[i].time)
          d = G.config['timeShow'] === 'iso' ? new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000) : d
          let timeText = d.toLocaleString(navigator.language, {
            hour12: false
          })
          $(tr).find('td:eq(3)').html(`<time title="${timeText}" datetime="${list[i].time}">${calcRelativeTime(list[i].time)}</time>`)
          $(tr).find('td:eq(4)').text(list[i].result)
          $(tr).appendTo('.ehCheckTableContainer tbody')
        }
      }
      getSomeList(1)
      let pages = Math.ceil(keys.length / G.config['checkListPerPage'])
      $('.ehPages').empty()
      if (pages > 1) {
        $('.ehPages').html([...Array(pages).keys()].map(i => `<a name="${i + 1}"></a>`)).on('click', 'a', function (e) {
          $('.ehPages>a').removeClass('ehPagesHover')
          $(e.target).addClass('ehPagesHover')
          getSomeList(e.target.name)
        })
        $('.ehPages>a[name="1"]').addClass('ehPagesHover')
      }
    }
    buildBody(searchKey)
    $('.ehCheckTableContainer input[name="search"]').on('change', e => {
      buildBody(e.target.value)
    }).val(searchKey)
    $('.ehCheckTable th>input[name="selectAll"]').on('click', e => {
      $('.ehCheckTable td>input').prop('checked', e.target.checked)
    })
    $('.ehCheckTable .ehCheckTableSort').on('click', e => {
      let list = GM_getValue('checkList', {})
      GM_setValue('checkList', sortObj(list, e.target.name))
      $('.ehCheckTableContainer').remove()
      $('#nb>a:contains("Show CheckList")').click()
    })
    $('<input type="button" value="Select Invert" title="反选">').on('click', function () {
      $('.ehCheckTable td>input').toArray().forEach(i => {
        i.checked = !i.checked
      })
    }).appendTo('.ehCheckTableBtn')
    $('<input type="button" value="Delete" title="移除">').on('click', function () {
      let list = GM_getValue('checkList', {})
      $('.ehCheckTable td>input:checked').toArray().forEach(i => {
        let keyword = $(i).parentsUntil('tbody').eq(-1).find('td>a').html()
        delete list[keyword]
      })
      GM_setValue('checkList', list)
      $('.ehCheckTableContainer').remove()
    }).appendTo('.ehCheckTableBtn')
    $('<input type="button" value="Cancel" title="取消">').on('click', function () {
      $('.ehCheckTableContainer').hide()
    }).appendTo('.ehCheckTableBtn')
  }).appendTo('#nb')
  let keyword = $('[name="f_search"]').val()
  if (!keyword) return
  let list = GM_getValue('checkList', {})
  if (!(keyword in list)) return
  let info = list[keyword]
  let tr = $('table.itg tr:gt(0),.id1').toArray()
  let i
  let time = info.time
  for (i = 0; i < G.gmetadata.length; i++) {
    let d = new Date(G.gmetadata[i].posted * 1000)
    if (time > d.getTime()) break
  }

  let d = new Date(info.time)
  d = G.config['timeShow'] === 'iso' ? new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000) : d
  let timeText = d.toLocaleString(navigator.language, {
    hour12: false
  })
  if ($('table.itg tr:gt(0)').length) {
    let ele = $(`<tr class="ehCheckContainer gtr${(i === tr.length ? i - 1 : i) % 2 ? '0' : '1'}"><td colspan="${$('table.itg tr:eq(0)>th').length}">Name: ${info.name || translateText(keyword)}<br>Last Check Time: <time title="${timeText}" datetime="${info.time}">${calcRelativeTime(info.time)}</time><br>Results: ${info.result}<br></td></tr>`)
    if (i === tr.length) {
      ele.insertAfter(tr[i - 1])
    } else {
      ele.insertBefore(tr[i])
    }
  } else {
    let ele = $(`<div class="ehCheckContainer id1" style="height:335px"><div class="id2"></div><div class="id3" style="height:280px">Name: ${info.name || translateText(keyword)}<br>Last Check Time: <time title="${timeText}" datetime="${info.time}">${calcRelativeTime(info.time)}</time><br>Results: ${info.result}<br></div><div class="id4"></div></div>`)
    if (i === tr.length) {
      ele.insertAfter(tr[i - 1])
    } else {
      ele.insertBefore(tr[i])
    }
  }
  $('<input type="button" value="Delete" title="移除该项">').click(() => {
    if (window.confirm('确认移除: \n' + keyword)) {
      let list = GM_getValue('checkList', {})
      delete list[keyword]
      GM_setValue('checkList', list)
    }
  }).appendTo('.ehCheckContainer>td,.ehCheckContainer>.id3')
  let result = $('.ip').text().match(/Showing .*? of [\d,]+/) ? $('.ip').text().match(/Showing .*? of ([\d,]+)/)[1].replace(/,/g, '') * 1 : 0
  if (result - info.result <= G.config['autoUpdateCheck'] && $('.ptds:eq(0)').text() === '1') {
    let time = new Date().getTime()
    time = time - new Date(G.gmetadata[0].posted * 1000).getTime() <= G.config['checkTimeDeviation'] * 60 * 60 * 1000 ? new Date(G.gmetadata[0].posted * 1000).getTime() + 1 : time
    list[keyword] = {
      time: time,
      result: result
    }
    if (info.name) list[keyword].name = info.name
    GM_setValue('checkList', sortObj(list, 'time'))
    setNotification((info.name || translateText(keyword)), 'CheckList updated')
  }
}

async function checkImageSize () { // 检查图片尺寸
  let ads = GM_getValue('introPic', [])
  let s = G.config['sizeS']
  let d = G.config['sizeD']
  let imageSize = await getEConfig('xr')
  let numD = 0 // 双页
  $('.gdtm>div>a>img').toArray().forEach(function (i, j) {
    let url = $(i).parent().attr('href')
    let id = url.split('/')[4]
    let name = $(i).attr('title').match(/Page \d+:\s+(.*)/)[1]
    if (ads.includes(id) || G.introPicName.some(j => name.match(j))) {
      $(i).parent().parent().addClass('ehIgnore')
      if (ads.includes(id)) {
        let introPicStat = GM_getValue('introPicStat', {})
        introPicStat[id] = id in introPicStat ? introPicStat[id] + 1 : 1
        GM_setValue('introPicStat', introPicStat)

        let introPicUrl = GM_getValue('introPicUrl', {})
        introPicUrl[id] = url
        GM_setValue('introPicUrl', introPicUrl)
      }
      return
    }
    let rate = $(i).width() / $(i).height() // 宽高比
    if (rate > G.config['rateD']) {
      numD++
      G.imageD.push(j + 1)
    } else {
      G.imageS.push(j + 1)
    }
  })
  let imageSizeNew
  if (2 * numD > G.imageD.length + G.imageS.length) { // 双页超过一半
    if (imageSize !== d) imageSizeNew = d
  } else if (imageSize !== s) {
    imageSizeNew = s
  }
  if (imageSizeNew !== undefined) {
    if (G.autoDownload && GM_getValue('downloading', []).length === 0) {
      document.title = imageSizeNew + '|' + document.title
      await changeEConfig('xr', imageSizeNew)
      changeFav(G.favicon[imageSizeNew])
    } else {
      let rawBtn = $('.g2:contains("Download Archive")')
      $('<div class="g2"></div>').html(rawBtn.html()).click(async e => {
        if (GM_getValue('downloading', []).length !== 0 && !window.confirm('下载列表不为空, 是否开始下载?')) return
        document.title = imageSizeNew + '|' + document.title
        await changeEConfig('xr', imageSizeNew)
        changeFav(G.favicon[imageSizeNew])
        rawBtn.click()
      }).insertBefore(rawBtn)
      rawBtn.hide()
      changeFav(G.favicon.p)
    }
  }
}

function combineText (arr, textOnly = undefined) {
  return arr instanceof Array ? arr.map(i => {
    if (i.type === 0) {
      return i.text
    } else if (!textOnly && i.type === 2) {
      return `"url("${i.src.replace(/http.?:/g, '')}")"`
    } else {
      return null
    }
  }).filter(i => i).join('\\A') : ''
}

function copyInfo () { // 复制信息
  if ($('#gn').text().match(/\[(.*?)\]/) && $('#gj').text().match(/\[(.*?)\]/)) { // artist
    var name = $('#gn').text().match(/\[(.*?)\]/)[1]
    var nameJpn = $('#gj').text().match(/\[(.*?)\]/)[1]
    if (name.match(/\(.*?\)/)) name = name.match(/\((.*?)\)/)[1]
    if (nameJpn.match(/\(.*?\)/)) nameJpn = nameJpn.match(/\((.*?)\)/)[1]
    $(`<input type="button" value="[${name}]${nameJpn}" copy="[${name}]${nameJpn}">`).appendTo('.ehNavBar>div:eq(0)')
  }
  if ($('.gt[id*="td_parody"]>a').length > 0) { // parody
    let info = $('.gt[id*="td_parody"]>a').attr('id').split(/ta_|:/)
    let parody = findData(info[1], info[2], true)
    if (Object.keys(parody).length) {
      parody = parody.cname
    } else {
      parody = $('#gj').text().match(/\(.*?\)/g) ? $('#gj').text().match(/\(.*?\)/g) : $('#gn').text().match(/\(.*?\)/g)
      if (parody) {
        parody = parody[parody.length - 1].match(/\((.*?)\)/)[1]
      } else {
        return
      }
    }
    let parodyKeyword = $('.gt[id*="td_parody"]>a').text().replace(/ \| .*/, '')
    $(`<input type="button" value="【${parody}】${parodyKeyword}" copy="【${parody}】${parodyKeyword}">`).appendTo('.ehNavBar>div:eq(0)')
  }
}

function defaultConfig () { // 默认设置
  let config = {
    'updateIntervalEHT': 0,
    'updateIntervalEHD': 0,
    'exportIntroPicFormat': "'{id}', ",
    'timeShow': 'local',

    // 通用设置
    'ex2eh': false,
    'eh2ex': true,
    'openUrl': '0',
    'saveLink': true,
    'bookmark': '0.Series,1.Cosplay,2.Image Set,3.Game CG,4.Doujinshi,5.Harem,6.Incest,7.Story arc,8.Anthology,9.Artist',
    'bookmarkEvent': '0,-1,10|1,-1,-1|2,1,b|2,-1|2,2,0',
    'bookmarkEventChs': '鼠标左键 + 任意按键 -> 移除<br>鼠标中键 + 任意按键 -> 自行选择<br>鼠标右键 + ctrlKey -> 加入黑名单<br>鼠标右键 + 任意按键 -> 上次选择<br>鼠标右键 + shiftKey -> 0',
    'searchArguments': '/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_imageset=1&f_cosplay=1&f_search={q}&f_sh=on',
    'notification': '3',
    'changeRomajiName': true,

    // 搜索页
    'preloadPaneImage': true,
    'languageCode': true,
    'auto2Fav': '2',
    'searchEvent': '0,-1,0,1|1,-1,-1,1|2,-1,1,1',
    'searchEventChs': '鼠标左键 + 任意按键 -> 主要名称 + chinese<br>鼠标中键 + 任意按键 -> 自行选择 + chinese<br>鼠标右键 + 任意按键 -> 作者或组织(顺位) + chinese',
    'checkExist': true,
    'checkExistAtStart': true,
    'checkExistName2': false,
    'acLength': 3,
    'acItem': 'language,artist,female,male,parody,character,group,misc',
    'batch': 3,
    'notHideUnlike': true,
    'alwaysShowLike': true,
    'lowRating': 0,
    'fewPages': 1,
    'checkTimeDeviation': 12,
    'autoUpdateCheck': 25,
    'checkListPerPage': 25,

    // 信息页
    'uconfig': '',
    'autoStartDownload': true,
    'autoClose': true,
    'enableEHD': true,
    'recordEHDUrl': true,
    'exportUrlFormat': '{url} +Proxy{cr}{lf}',
    'tagTranslateImage': false,
    'showAllThumb': true,
    'enableChangeSize': true,
    'rateD': 1,
    'sizeD': '3',
    'sizeS': '1',
    'downloadSizeChanged': true
  }
  for (let i in config) {
    if (!(i in G.config)) G.config[i] = config[i]
  }
}

function downloadAdd () {
  if (G.downloading) return
  G.downloading = true
  let downloading = GM_getValue('downloading', [])
  downloading.push(unsafeWindow.gid)
  GM_setValue('downloading', downloading)
}

function downloadRemove () {
  if (!G.downloading) return
  G.downloading = false
  let downloading = GM_getValue('downloading', [])
  if (downloading.includes(unsafeWindow.gid)) {
    downloading.splice(downloading.indexOf(unsafeWindow.gid), 1)
    GM_setValue('downloading', downloading)
  }
}

function findData (main, sub, textOnly = true) {
  let data = G.EHT.filter(i => i.name === main)
  if (data.length === 0 || data[0].tags.length === 0) return {}
  if (sub === undefined) {
    return {
      name: main,
      cname: combineText(data[0].cname, textOnly),
      info: combineText(data[0].info, textOnly)
    }
  }
  let data1 = data[0].tags.filter(i => i.name === sub.replace(/_/g, ' '))
  if (data1.length === 0) {
    if (sub.match(' \\| ')) {
      let arr = sub.split(' | ').map(i => i.replace(/_/g, ' '))
      data1 = data[0].tags.filter(i => arr.includes(i.name))
    }
  }
  return data1.length ? {
    name: main === 'misc' ? sub : main + ':' + sub,
    cname: combineText(data1[0].cname, textOnly),
    info: combineText(data1[0].info, textOnly)
  } : {}
}

async function getEConfig (key) { // 获取EH设置
  let res = await xhrSync('/uconfig.php')
  let uconfig = $('#settings_outer>form', res.response).serialize()
  return key ? uconfig.match(new RegExp(key + '=(.*?)(&|$)'))[1] : uconfig
}

function getEditDistance (a, b) { // 获取EditDistance
  // 来源: https://gist.github.com/andrei-m/982927
  /*
  Copyright (c) 2011 Andrei Mackenzie
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  var matrix = []

  // increment along the first column of each row
  var i
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }

  // increment each column in the first row
  var j
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1)) // deletion
      }
    }
  }

  return matrix[b.length][a.length]
}

async function getInfo () { // 获取信息
  if (!$('.itg').length) return
  let gidlist = $('.it5>a,.id3>a').toArray().map(i => {
    let arr = i.href.split('/')
    return [arr[4], arr[5]]
  })
  let lst = []
  while (gidlist.length) {
    lst.push(gidlist.splice(0, 25))
  }
  let gmetadata = []
  for (let i = 0; i < lst.length; i++) {
    let gdata = {
      'method': 'gdata',
      'gidlist': lst[i],
      'namespace': 1
    }
    let res = await xhrSync('/api.php', JSON.stringify(gdata), {
      responseType: 'json'
    })
    gmetadata = gmetadata.concat(res.response.gmetadata)
  }
  return gmetadata
}

function hideGalleries () { // 隐藏某些画集
  let tags = {};
  ['Unlike', 'Alert', 'Like'].forEach(i => {
    let tag = GM_getValue('tag' + i, [])
    tags[i] = tag
  })
  $('.it5>a,.id3>a').toArray().forEach(i => {
    let info = G.gmetadata.filter(j => j.gid === i.href.split('/')[4] * 1)[0]
    if (!info) return
    let container = $(i).parentsUntil('.itd,div.itg,#pp').eq(-1).find('.ehContainer')
    if (info.rating * 1 < G.config['lowRating']) $('<span class="ehTagNotice" name="Unlike" title="低评分">低评分</span>').appendTo(container)
    if (info.filecount * 1 < G.config['fewPages']) $('<span class="ehTagNotice" name="Unlike" title="页面少">页面少</span>').appendTo(container)
    for (let j in tags) {
      let check = info.tags.filter(k => tags[j].includes(k))
      if (check.length) {
        check.forEach(k => {
          let tag = k.split(':')
          let main = tag.length === 1 ? 'misc' : tag[0]
          let sub = tag[tag.length - 1]
          let data = findData(main, sub, true)
          let tagChs = k
          let tagInfo = k
          if (Object.keys(data).length) {
            tagChs = (main === 'male' ? '♂:' : main === 'female' ? '♀:' : '') + data.cname
            tagInfo += '<br>' + data.info
          }
          $(`<span class="ehTagNotice" name="${j}" title="${tagInfo}">${tagChs}</span>`).appendTo(container)
        })
      }
    }
  })
  if (!G.config['notHideUnlike']) {
    let length = $('table.itg tr,.id1').filter(':has(.ehTagNotice[name="Unlike"])').hide().length
    if (G.config['alwaysShowLike']) length -= $('table.itg tr,.id1').filter(':has(.ehTagNotice[name="Unlike"]):has(.ehTagNotice[name="Like"])').show().length
    $('.ip:eq(0)').html($('.ip').html() + ' 过滤' + length + '本 ')
    $('<input type="button" value="Show">').on('click', function (e) {
      if (G.config['alwaysShowLike']) {
        $('table.itg tr,.id1').filter(':has(.ehTagNotice[name="Unlike"]):not(:has(.ehTagNotice[name="Like"]))').toggle()
      } else {
        $('table.itg tr,.id1').filter(':has(.ehTagNotice[name="Unlike"])').toggle()
      }
      $(e.target).val($(e.target).val() === 'Show' ? 'Hide' : 'Show')
    }).appendTo('.ip:eq(0)')
  }
}

function highlightBlacklist () { // 高亮黑名单相关的画廊(通用)
  let blacklist = GM_getValue('blacklist', [])
  $('.it5>a,.id2>a,#gn,#gj').toArray().forEach(i => {
    let title = htmlEscape($(i).text())
    for (let j of blacklist) {
      let re = new RegExp(j, 'gi')
      if (title.match(re)) {
        title = title.replace(re, '<span class="ehBlacklist" copy="$&">$&</span>')
      }
    }
    $(i).html(title)
  })
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

function introPic () { // 宣传图
  let toggleIgnore = e => {
    let introPic = GM_getValue('introPic', [])
    let id = $(e.target).prev().attr('href').split('/')[4]
    if ($(e.target).attr('on') === 'true' && !introPic.includes(id)) {
      introPic.push(id)
      $(e.target).attr('on', 'false')
    } else if ($(e.target).attr('on') === 'false' && introPic.includes(id)) {
      introPic.splice(introPic.indexOf(id), 1)
      $(e.target).attr('on', 'true')
    }
    GM_setValue('introPic', introPic)
  }
  let introPic = GM_getValue('introPic', [])
  $('.gdtm>div>a:nth-child(1)').toArray().forEach(i => {
    let file = $(i).find('img:eq(0)').attr('title').replace(/^Page\s+\d+:\s+/, '')
    $(`<a type="button" name="intro" href="javascript:;" on="true" file="${file}"></a>`).on('click', toggleIgnore).appendTo(i.parentNode)
    let id = i.href.split('/')[4]
    if (introPic.includes(id)) $(i).next().attr('on', 'false')
  })
}

function jumpHost () { // 里站跳转
  let l = window.location
  let gid = l.href.split('/')[4]
  let jump = GM_getValue('jump', [])
  if (l.host === 'exhentai.org') { // 里站
    if (!jump.includes(gid)) { // 尝试跳转
      if (!['ta_female:lolicon', 'ta_male:shotacon', 'ta_male:bestiality', 'ta_female:bestiality'].some(i => document.getElementById(i))) {
        window.location = l.href.replace('//exhentai.org', '//e-hentai.org')
        return true
      }
    } else {
      jump.splice(jump.indexOf(gid), 1)
      GM_setValue('jump', jump)
    }
  } else if (l.host === 'e-hentai.org') { // 表站
    if (document.querySelector('.d')) { // 不存在则返回
      jump.push(gid)
      GM_setValue('jump', jump)
      window.location = l.href.replace('//e-hentai.org', '//exhentai.org')
      return true
    }
  }
}

function languageCode () { // 显示iso语言代码
  let value = $('[name="f_search"]').val()
  let iso = {
    'chinese': 'zh',
    'english': 'en',
    'japanese': 'ja',
    'korean': 'ko',
    'albanian': 'sq',
    'arabic': 'ar',
    'bengali': 'bn',
    'catalan': 'ca',
    'czech': 'cs',
    'danish': 'da',
    'dutch': 'nl',
    'esperanto': 'eo',
    'estonian': 'et',
    'finnish': 'fi',
    'french': 'fr',
    'german': 'de',
    'greek': 'el',
    'hebrew': 'he',
    'hindi': 'hi',
    'hungarian': 'hu',
    'indonesian': 'id',
    'italian': 'it',
    'mongolian': 'mn',
    'norwegian': 'no',
    'polish': 'pl',
    'portuguese': 'pt',
    'romanian': 'ro',
    'russian': 'ru',
    'slovak': 'sk',
    'slovenian': 'sl',
    'spanish': 'es',
    'swedish': 'sv',
    'tagalog': 'tl',
    'thai': 'th',
    'turkish': 'tr',
    'ukrainian': 'uk',
    'vietnamese': 'vi'
  }
  value = value.match(/language:("|)(.*?)(\$"|"\$|")/)
  if (value && value[2] in iso) return
  $('.it5>a,.id3>a').toArray().forEach(i => {
    let info = G.gmetadata.filter(j => j.gid === i.href.split('/')[4] * 1)[0]
    if (!info) return
    let langs = info.tags.filter(i => i.match(/^language:/))
    let container = $(i).parentsUntil('.itd,div.itg,#pp').eq(-1).find('.ehContainer')
    langs.forEach(j => {
      let lang = j.match(/^language:(.*)/)[1]
      if (lang in iso) {
        $(`<span class="ehLang" title="${lang}">${iso[lang]}</span>`).appendTo(container)
      }
    })
  })
}

function makeRange (arr) {
  arr = [...new Set(arr.sort((a, b) => a - b))]
  let arr2 = [arr[0].toString()]

  for (let i = 1; i < arr.length; i++) {
    let index = arr[i]
    let last = arr2[arr2.length - 1]
    let start = last.match(/^\d+/)[0] * 1
    let end = last.match(/\d+$/)[0] * 1
    if (index - end === 1) {
      arr2[arr2.length - 1] = `${start}-${index}`
    } else {
      arr2.push(index.toString())
    }
  }
  return arr2
}

function openUrl (url) { // 打开链接
  url = (url.match('//') ? '' : window.location.origin) + url
  if (G.config['openUrl'] === '0') {
    GM_openInTab(url, true)
  } else if (G.config['openUrl'] === '1') {
    GM_openInTab(url, false)
  } else if (G.config['openUrl'] === '2' || G.config['openUrl'] === '3') {
    if (url.match(/\/g\/\d+\/[\da-z]+\//)) {
      let popup = window.open(url, '', 'resizable,scrollbars,status')
      if (popup) {
        popup.moveTo(0, 0)
        popup.resizeTo(window.screen.width, window.screen.height)
      } else {
        setNotification('请允许该网页弹出窗口')
        GM_openInTab(url, G.config['openUrl'] === '2')
      }
    } else {
      GM_openInTab(url, G.config['openUrl'] === '2')
    }
  }
}

function quickDownload () { // 右键下载
  $('.itg,#pp').on('contextmenu', e => {
    if ($(e.target).is('.it5>a,.id3>a>img,.id2>a')) {
      e.preventDefault()
      let target = $(e.target).is('.id3>a>img') ? $(e.target).parent()[0] : e.target
      openUrl(target.href + '#2')
    }
  })
}

function rateInSearchPage () { // 在搜索页评分
  $('.it4>.ir.it4r,.ir.id43').on({
    mousemove (e) {
      let _ = $(e.target)
      if (!_.attr('rawRate')) _.attr('rawRate', _.css('background-position'))
      let star = Math.round(e.offsetX / 8)
      let x = -80 + Math.ceil(star / 2) * 16
      let y = star % 2 === 1 ? -21 : -1
      _.attr('title', star).css('background-position', x + 'px ' + y + 'px')
    },
    mouseout (e) {
      $(e.target).css('background-position', $(e.target).attr('rawRate'))
    },
    click (e) {
      let apikey = GM_getValue('apikey')
      if (!apikey) {
        window.alert('请在任意信息页获取到apikey与apiuid后再尝试')
        return
      }
      let apiuid = GM_getValue('apiuid')
      let hrefArr = $(e.target).parent().prev().find('a').attr('href').split('/')
      let star = Math.round(e.offsetX / 8)
      let parm = {
        apikey: apikey,
        apiuid: apiuid,
        gid: hrefArr[4],
        method: 'rategallery',
        rating: star,
        token: hrefArr[5]
      }
      xhr('/api.php', () => {
        let x = -80 + Math.ceil(star / 2) * 16
        let y = star % 2 === 1 ? -21 : -1
        $(e.target).attr('rawRate', x + 'px ' + y + 'px').addClass('irb')
      }, JSON.stringify(parm))
    }
  })
}

function reEscape (text) {
  return text.replace(/[$()*+.[\]?{}|]/g, '\\$&')
}

function saveAs (text, name) {
  downloadRemove()
  if (text instanceof window.Blob && text.type.match(/^application.*zip$/)) {
    if (G.downloadSizeChanged) {
      if (!G.imageEnd) {
        G.imageData = text
        autoDownload(true)
      } else {
        new Promise(async resolve => {
          let zipS = await JSZip.loadAsync(text)
          let zip = await JSZip.loadAsync(G.imageData)
          let files = Object.keys(zipS.files)
          let infoStr = ''
          for (let i = 0; i < files.length; i++) {
            let file = files[i]
            let ab = await zipS.files[file].async('arraybuffer')
            zip.file(file, ab)
            if (file.match(/\/info.txt$/)) infoStr = await zipS.files[file].async('text')
          }
          let data = await zip.generateAsync({
            type: 'arraybuffer',
            compression: G['ehD-setting']['compression-level'] ? 'DEFLATE' : 'STORE',
            compressionOptions: {
              level: G['ehD-setting']['compression-level'] > 0 ? (G['ehD-setting']['compression-level'] < 10 ? G['ehD-setting']['compression-level'] : 9) : 1
            },
            streamFiles: !!G['ehD-setting']['file-descriptor'],
            comment: G['ehD-setting']['save-info'] === 'comment' ? infoStr.replace(/\n/gi, '\r\n') : undefined
          })
          resolve(data)
        }).then(data => {
          saveAs2(data, name, text.type)
          window.onbeforeunload = null
          waitInMs(500).then(() => {
            taskRemove()
            window.close()
          })
        })
      }
    } else {
      saveAs2(text, name, text.type)
      window.onbeforeunload = null
      waitInMs(500).then(() => {
        taskRemove()
        window.close()
      })
    }
  } else {
    saveAs2(text, name)
  }
}

function saveAs2 (content, name, type = 'application/octet-stream;charset=utf-8') {
  let blob = new window.Blob([content], {
    type: type
  })
  $(`<a href="${URL.createObjectURL(blob)}" download="${name}"></a>`)[0].click()
}

function saveLink () { // 保存链接
  $('<input type="button" value="Shortcut" title="创建链接">').click(function () {
    var content = [
      '[InternetShortcut]\r\nURL={{url}}',
      '<?xml version=\'1.0\' encoding=\'UTF-8\'?><!DOCTYPE plist PUBLIC \'-//Apple//DTD PLIST 1.0//EN\' \'http://www.apple.com/DTDs/PropertyList-1.0.dtd\'><plist version=\'1.0\'><dict><key>URL</key><string>{{url}}</string></dict></plist>',
      '[Desktop Entry]\r\nType=Link\r\nURL={{url}}'
    ]
    var platform = navigator.platform
    var fileType
    if (platform.match(/^Win/)) {
      platform = 0
      fileType = '.url'
    } else if (platform.match(/^Mac/)) {
      platform = 1
      fileType = '.webloc'
    } else {
      platform = 2
      fileType = '.desktop'
    }
    let text = content[platform].replace('{{url}}', window.location.href)
    saveAs(text, document.title + fileType)
  }).prependTo('.ehNavBar>div:eq(2)')
}

function setNotification (text, title = undefined, timeout = 3 * 1000) { // 发出桌面通知
  if (G.config['notification'] === '-1') {
    // Nothing
  } else if (G.config['notification'] === '0') {
    if (window.Notification && window.Notification.permission !== 'denied') {
      window.Notification.requestPermission(function (status) {
        if (status === 'granted') {
          var n = (title) ? new window.Notification(text, {
            body: title,
            icon: window.location.origin + '/favicon.ico',
            tag: GM_info.script.name
          }) : new window.Notification(text)
          setTimeout(function () {
            if (n) n.close()
          }, timeout)
        } else {
          setNotification2(text, title, timeout)
        }
      })
    } else {
      setNotification2(text, title, timeout)
    }
  } else if (G.config['notification'] === '1') {
    GM_notification({
      text: text,
      title: title || GM_info.script.name,
      image: window.location.origin + '/favicon.ico',
      tag: GM_info.script.name,
      timeout: timeout
    })
  } else if (G.config['notification'] === '2') {
    window.alert(title ? text + '\n\n' + title : text)
  } else if (G.config['notification'] === '3') {
    setNotification2(text, title, timeout)
  }
}

function setNotification2 (text, title, timeout) {
  if ($('.ehNotification').length === 0) {
    $('<div class="ehNotification"></div>').on({
      click: e => {
        $('.ehNotification').hide()
      }
    }).appendTo('body')
  }
  title = title ? '<div>' + htmlEscape(title) + '</div><hr>' : ''
  $('.ehNotification').show().html(`<div class="ehFavicion"></div><div>${title}<div>${htmlEscape(text)}</div></div>`)
  if (G.timeout) {
    clearTimeout(G.timeout)
    G.timeout = null
  }
  G.timeout = setTimeout(() => {
    G.timeout = null
    $('.ehNotification').hide()
  }, timeout)
}

function searchInOtherSite () { // 在其他站点搜索
  let listStyle = $('#nb>img')[0].outerHTML
  $(listStyle).appendTo('#nb')
  let sites = {
    'nhentai.net': {
      url: q => 'https://nhentai.net/search/?q=' + q.replace(/\$/g, '')
    },
    'doujinshi.org': {
      url: 'https://www.doujinshi.org/search/simple/?T=objects&sn={q}'
    },
    'Google': {
      url: 'https://www.google.com/search?q={q}',
      icon: '//www.google.com/images/branding/product/ico/googleg_lodp.ico'
    },
    'hentai-comic.com': {
      url: 'https://zh.hentai-comic.com/search/keyword/{q}/page/1/'
    },
    'asmhentai.com': {
      url: 'https://asmhentai.com/search/{q}/'
    },
    'mujaki.blog.jp': {
      urlJ: 'http://mujaki.blog.jp/search?q={q}'
    },
    'cefamilie.com': {
      urlJ: 'https://cefamilie.com/?s={q}'
    },
    'wnacg.com': {
      urlJ: 'https://wnacg.com/albums-index-page-1-sname-{q}.html'
    },
    'hentai2read.com': {
      url: 'https://asmhentai.com/search/{q}/'
    }
  }
  let keyword, keywordJ
  if ($('[name="f_search"]').length) {
    keyword = $('[name="f_search"]').val()
    keywordJ = $('[name="f_search"]').val()
  } else {
    keyword = $('#gn').text()
    keywordJ = $('#gj').text()
  }
  $('<div class="ehSites"></div>').appendTo('#nb')
  for (let i in sites) {
    let url
    if ('url' in sites[i]) {
      url = sites[i].url instanceof Function ? sites[i].url(keyword) : sites[i].url.replace(/{q}/g, keyword)
    } else if ('urlJ' in sites[i]) {
      url = sites[i].urlJ instanceof Function ? sites[i].urlJ(keywordJ) : sites[i].urlJ.replace(/{q}/g, keywordJ)
    }
    $(`<a target="_blank"><img src="${sites[i].icon || '//www.google.com/s2/favicons?domain=' + i}"></img>${i}</a>`).attr('href', url).appendTo('.ehSites')
  }
}

async function showAllThumb () { // 显示所有预览页
  let pages = $('.ptt td:gt(0):lt(-1)>a').toArray()
  if (pages.length <= 1) return
  $('<input type="button" class="ehThumbBtn" value="Hide" style="width:36px;height:15px;padding:3px 2px;margin:0 2px 4px 2px;float:left;border-radius:5px;border:1px solid #989898;">').on('click', function (e) {
    $('.gdtContainer').toggle()
    $(e.target).val($(e.target).val() === 'Show' ? 'Hide' : 'Show')
  }).prependTo('#gdo2')
  $('<div class="gdtContainer"></div>').html('<div></div>'.repeat(pages.length)).insertBefore('#gdt')
  $('#gdt').appendTo(`.gdtContainer>div:nth-child(${$('.ptds:eq(0)').text()})`)
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].pathname === window.location.pathname && pages[i].search === window.location.search) continue
    let res = await xhrSync(pages[i].href)
    let doc = document.createElement('html')
    doc.innerHTML = res.response
    $('#gdt', doc).appendTo(`.gdtContainer>div:nth-child(${$('.ptds:eq(0)', doc).text()})`)
  }
}

function showConfig () { // 显示设置
  let listStyle = $('#nb>img')[0].outerHTML
  $(listStyle).appendTo('#nb')
  $('<a href="javascript:;">[EH]Enhance Config</a>').on('click', function (e) {
    if ($('.ehConfig').length) {
      $('.ehConfig').toggle()
      return
    }
    let _html = [
      GM_info.script.name + '<span class="ehHighlight">v' + GM_info.script.version + '</span> <a href="' + GM_info.script.namespace + '" target="_blank">@' + (GM_info.script.author || 'dodying') + '</a>',
      '',
      '<input type="button" name="exportValues" value="Export Values" title="导出脚本储存的信息<br>(除EHT与EHD的数据)"> <input type="file" name="selectFile" accept=".json"><input type="button" name="fakeSelectFile" value="Select File" title="选择文件"> <input type="button" name="importValues" value="Import Values" title="导入脚本储存的信息">',
      '更新 EHT: 更新频率: <input name="ehConfig_updateIntervalEHT" type="number" placeholder="0" step="1" min="0" title="0表示不自动更新，以天为单位"> <input type="button" name="updateEHT" value="Update Now" tooltip="立即更新标签数据，来自[Mapaler/EhTagTranslator]"> <input type="button" name="exportEHT" value="Export Now" title="导出EHT数据"> <input type="button" name="emptyEHT" value="Empty Now" title="重置EHT数据">',
      '更新 EHD: 更新频率: <input name="ehConfig_updateIntervalEHD" type="number" placeholder="0" step="1" min="0" title="0表示不自动更新，以天为单位"> <input type="button" name="updateEHD" value="Update Now" tooltip="立即更新内置 [E-Hentai-Downloader]"> <input type="button" name="exportEHD" value="Export Now" title="导出EHD数据"> <input type="button" name="emptyEHD" value="Empty Now" title="重置EHD数据">',
      '宣传图相关: 导出格式: <input name="ehConfig_exportIntroPicFormat" title="' + htmlEscape('以<span class="ehHighlight">{id}</span>表示宣传图id<br>以<span class="ehHighlight">{cr}</span>表示\\r<br>以<span class="ehHighlight">{lf}</span>表示\\n') + '" type="text" placeholder="\'{id}\',{cr}{lf}"> <input type="button" name="exportIntroPic" value="Copy Text" title="复制文本">',
      '',
      // 通用设置
      '<span class="ehHighlight">通用设置:</span>',
      '时间显示: <label for="ehConfig_timeShow_local"><input type="radio" name="ehConfig_timeShow" id="ehConfig_timeShow_local" value="local" checked>本地时间</label> <label for="ehConfig_timeShow_iso"><input type="radio" name="ehConfig_timeShow" id="ehConfig_timeShow_iso" value="iso">ISO时间</label>',
      '跳转相关: <label for="ehConfig_ex2eh"><input type="checkbox" id="ehConfig_ex2eh">信息页: 里站自动跳转到表站</label>; <label for="ehConfig_eh2ex"><input type="checkbox" id="ehConfig_eh2ex">搜索页: 表站自动跳转到里站</label>',
      '链接打开方式: <select name="ehConfig_openUrl"><option value="0">新标签页后台打开</option><option value="1">新标签页前台打开</option><option value="2">新标签页后台打开搜索页，弹窗打开信息页</option><option value="3">新标签页前台打开搜索页，弹窗打开信息页</option></select>',
      '<label for="ehConfig_saveLink"><input type="checkbox" id="ehConfig_saveLink">显示按钮: 保存链接</label>',
      '收藏夹提示信息: <input name="ehConfig_bookmark" type="text" title="' + htmlEscape('以<span class="ehHighlight">,</span>分割') + '" placeholder="0.Series,1.Cosplay,2.Image Set,3.Game CG,4.Doujinshi,5.Harem,6.Incest,7.Story arc,8.Anthology,9.Artist">',
      '收藏按钮事件: <input name="ehConfig_bookmarkEvent" title="' + htmlEscape('事件格式: 鼠标按键,键盘按键,收藏事件<br>多个事件以<span class="ehHighlight">|</span>分割<br>鼠标按键:<ul><li>0 -> 左键</li><li>1 -> 中键</li><li>2 -> 右键</li></ul>键盘按键:<ul><li>-1 -> 任意</li><li>0 -> altKey</li><li>1 -> ctrlKey</li><li>2 -> shiftKey</li></ul>收藏事件:<ul><li>留空 -> 上次选择</li><li>-1 -> 自行选择</li><li>0-9 -> 0-9</li><li>10 -> 移除</li><li>b -> 加入黑名单</li></ul>') + '" type="text" placeholder="0,-1,10|1,-1,-1|2,1,b|2,-1|2,2,0"><input name="ehConfig_bookmarkEventChs" type="hidden">',
      '搜索参数: <input name="ehConfig_searchArguments" title="' + htmlEscape('以<span class="ehHighlight">{q}</span>代替搜索关键词') + '" type="text" placeholder="/?f_search={q}&f_sh=on" min="1">',
      '通知显示方式: <select name="ehConfig_notification"><option value="0">Web API: Notification</option><option value="1">GM_notification</option><option value="2">window.alert</option><option value="3">页面元素</option><option value="-1">不显示</option></select>',
      '<div class="ehNew"></div><label for="ehConfig_changeRomajiName"><input type="checkbox" id="ehConfig_changeRomajiName">标题: 替换其中的罗马数字</label>',
      '',
      // 搜索页
      '<span class="ehHighlight">搜索页:</span>',
      '<label for="ehConfig_preloadPaneImage"><input type="checkbox" id="ehConfig_preloadPaneImage">自动载入预览图</label>; <label for="ehConfig_languageCode"><input type="checkbox" id="ehConfig_languageCode">显示ISO语言代码</label>',
      '收藏按钮事件: 当用<select name="ehConfig_auto2Fav"><option value="0">左键</option><option value="1">中键</option><option value="2">右键</option></select>点击Open时，自动添加到收藏',
      '搜索按钮事件: <input name="ehConfig_searchEvent" title="' + htmlEscape('事件格式: 鼠标按键,键盘按键,搜索文本,是否中文<br>多个事件以<span class="ehHighlight">|</span>分割<br>鼠标按键:<ul><li>0 -> 左键</li><li>1 -> 中键</li><li>2 -> 右键</li></ul>键盘按键:<ul><li>-1 -> 任意</li><li>0 -> altKey</li><li>1 -> ctrlKey</li><li>2 -> shiftKey</li></ul>搜索事件:<ul><li>-1 -> 自行选择</li><li>0 -> 主要名称</li><li>1 -> 作者或组织(顺位)</li></ul>是否中文:<ul><li>0 -> 否</li><li>1 -> 是</li></ul>') + '" type="text" placeholder="0,-1,0,0|2,-1,0,1"><input name="ehConfig_searchEventChs" type="hidden">',
      '<label for="ehConfig_checkExist"><input type="checkbox" id="ehConfig_checkExist">显示按钮: 检查本地是否存在 (需要后台运行<a href="https://github.com/dodying/Nodejs/blob/master/checkExistSever/index.js" target="_blank">checkExistSever</a>, <a href="https://www.voidtools.com/downloads/#downloads" target="_blank">Everything</a>, 以及下载<a href="https://www.voidtools.com/downloads/#cli" target="_blank">Everything CLI</a>)</label>',
      '检查本地是否存在: <label for="ehConfig_checkExistAtStart"><input type="checkbox" id="ehConfig_checkExistAtStart">页面载入后检查一次</label>; <label for="ehConfig_checkExistName2" title="去除集会号/作者/原作名/翻译组织/语言等"><input type="checkbox" id="ehConfig_checkExistName2">只搜索主要名称</label>',
      '搜索栏自动完成: 字符数 > <input name="ehConfig_acLength" type="number" placeholder="3" min="0"> 时，显示',
      '搜索栏自动完成-显示项目: <input name="ehConfig_acItem" type="text" placeholder="language,artist,female,male,parody,character,group,misc" title="' + htmlEscape('以<span class="ehHighlight">,</span>分割') + '">',
      '批量下载数: <input name="ehConfig_batch" type="number" placeholder="4" min="1">',
      '隐藏本子: <label for="ehConfig_notHideUnlike"><input type="checkbox" id="ehConfig_notHideUnlike">不隐藏带有厌恶标签的画廊</label>; <label for="ehConfig_alwaysShowLike"><input type="checkbox" id="ehConfig_alwaysShowLike">总是显示带有喜欢标签的画廊</label>',
      '隐藏本子: 评分 < <input name="ehConfig_lowRating" type="number" placeholder="4.0" min="0" max="5" step="0.1">; 页数 < <input name="ehConfig_fewPages" type="number" placeholder="5" min="1">',
      '检测新本子: 当检查时间与最新本子上传时间 <= <input name="ehConfig_checkTimeDeviation" type="number" placeholder="3"> 小时时，以最新本子上传时间为检查时间',
      '检测新本子-自动更新时间: 结果数目变化 <= <input name="ehConfig_autoUpdateCheck" type="number" placeholder="10" min="0">',
      '检测新本子-列表: 每页 <input name="ehConfig_checkListPerPage" type="number" placeholder="25" min="25" max="100"> 条CheckList',
      '',
      // 信息页
      '<span class="ehHighlight">信息页:</span>',
      '默认设置: <input name="ehConfig_uconfig" title="' + htmlEscape('在Settings页面使用$.serialize获取，可留空<br>留空表示每次使用当前设置') + '" type="text"> <input type="button" name="getUconfig" value="Get NOW" title="立即获取">',
      '下载相关: <label for="ehConfig_autoStartDownload"><input type="checkbox" id="ehConfig_autoStartDownload">锚部分不为空时，自动开始下载</label>; <label for="ehConfig_autoClose" title="' + htmlEscape('Firefox: 需打开about:config并设置dom.allow_scripts_to_close_windows为true<br>Chromium: 无法关闭非脚本打开的页面') + '"><input type="checkbox" id="ehConfig_autoClose">锚部分不为空时，下载完成后自动关闭标签</label>',
      '下载-EHD相关: <label for="ehConfig_enableEHD"><input type="checkbox" id="ehConfig_enableEHD">启用内置 [E-Hentai-Downloader]</label>; <label for="ehConfig_recordEHDUrl"><input type="checkbox" id="ehConfig_recordEHDUrl">记录内置EHD下载失败的链接</label>',
      '下载-EHD相关-链接相关: 导出格式: <input name="ehConfig_exportUrlFormat" title="' + htmlEscape('以<span class="ehHighlight">{url}</span>表示搜索链接<br>以<span class="ehHighlight">{cr}</span>表示\\r<br>以<span class="ehHighlight">{lf}</span>表示\\n') + '" type="text" placeholder="{url} +Proxy{cr}{lf}"> <input type="button" name="exportUrl" value="Copy URL" title="复制链接"> <input type="button" name="emptyUrl" value="Empty URL" title="清空链接">',
      '<label for="ehConfig_tagTranslateImage"><input type="checkbox" id="ehConfig_tagTranslateImage">标签翻译显示图片</label>; <label for="ehConfig_showAllThumb"><input type="checkbox" id="ehConfig_showAllThumb">显示所有预览图</label>',
      '<label for="ehConfig_enableChangeSize" title="' + htmlEscape('当大图(双页)尺寸与小图(单页)尺寸相同时，失效') + '"><input type="checkbox" id="ehConfig_enableChangeSize">启用自动调整图片尺寸</label>',
      '调整图片尺寸: 大图(双页)宽高比: <input name="ehConfig_rateD" type="number" placeholder="1.1" step="0.1">; 其他默认视为小图(单页)',
      '调整图片尺寸: 大图(双页)尺寸: <select name="ehConfig_sizeD"><option value="0">Auto</option><option value="5">2400x</option><option value="4">1600x</option><option value="3">1280x</option><option value="2">980x</option><option value="1">780x</option></select>; 小图(单页)尺寸: <select name="ehConfig_sizeS"><option value="0">Auto</option><option value="5">2400x</option><option value="4">1600x</option><option value="3">1280x</option><option value="2">980x</option><option value="1">780x</option></select>',
      '<label for="ehConfig_downloadSizeChanged" title="' + htmlEscape('需关闭: Request File System to handle large Zip file<br>需开启: 启用内置 [E-Hentai-Downloader], 显示所有预览图, 启用自动调整图片尺寸<br>注意: 避免出错，应一次下载一个画廊') + '"><input type="checkbox" id="ehConfig_downloadSizeChanged">下载调整过大小的图片压缩档</label>'
    ].map(i => i ? '<li>' + i + '</li>' : '<hr>').join('')
    $('<div class="ehConfig"></div>').html('<ul>' + _html + '</ul><div class="ehConfigBtn"><input type="button" name="reset" value="Reset" title="重置"><input type="button" name="save" value="Save" title="保存"><input type="button" name="cancel" value="Cancel" title="取消"></div>').appendTo('body').on('click', function (e) {
      if ($(e.target).is('.ehConfigBtn>input[type="button"][name="reset"]')) {
        if (window.confirm('Continue to RESET')) {
          GM_setValue('config', {})
          $('.ehConfig').remove()
          Object.keys(G.config).forEach(i => {
            delete G.config[i]
          })
          defaultConfig()
        }
      } else if ($(e.target).is('.ehConfigBtn>input[type="button"][name="save"]')) {
        let config = GM_getValue('config', {})
        $('.ehConfig input:not([type="button"]):not([type="file"]),.ehConfig select').toArray().forEach(i => {
          let name, value
          if (i.type === 'number') {
            name = i.name
            value = (i.value || i.placeholder) * 1
            if (isNaN(value)) return
          } else if (i.type === 'text' || i.type === 'hidden') {
            name = i.name
            value = i.value || i.placeholder
          } else if (i.type === 'checkbox') {
            name = i.id
            value = i.checked
          } else if (i.type === 'select-one') {
            name = i.name
            value = i.value
          } else if (i.type === 'radio') {
            if (!i.checked) return
            name = i.name
            value = i.value
          }
          config[name.replace('ehConfig_', '')] = value
        })

        let bookmarkEvent = config['bookmarkEvent'].split('|')
        let bookmarkEventChs = []
        for (let i of bookmarkEvent) {
          let arr = i.split(',').map(i => isNaN(i * 1) ? i : i * 1)
          let chs = []
          chs.push('鼠标' + '左中右'.split('')[arr[0]] + '键')
          chs.push(arr[1] === -1 ? '任意按键' : ['altKey', 'ctrlKey', 'shiftKey'][arr[1]])
          if (arr[2] === undefined) {
            chs.push('上次选择')
          } else if (arr[2] === -1) {
            chs.push('自行选择')
          } else if (arr[2] >= 0 && arr[2] <= 9) {
            chs.push(arr[2])
          } else if (arr[2] === 10) {
            chs.push('移除')
          } else if (arr[2] === 'b') {
            chs.push('加入黑名单')
          }
          bookmarkEventChs.push(chs[0] + ' + ' + chs[1] + ' -> ' + chs[2])
        }
        config.bookmarkEventChs = bookmarkEventChs.join('<br>')

        let searchEvent = config['searchEvent'].split('|')
        let searchEventChs = []
        for (let i of searchEvent) {
          let arr = i.split(',').map(i => isNaN(i * 1) ? i : i * 1)
          let chs = []
          chs.push('鼠标' + '左中右'.split('')[arr[0]] + '键')
          chs.push(arr[1] === -1 ? '任意按键' : ['altKey', 'ctrlKey', 'shiftKey'][arr[1]])
          if (arr[2] === -1) {
            chs.push('自行选择')
          } else if (arr[2] === 0) {
            chs.push('主要名称')
          } else if (arr[2] === 1) {
            chs.push('作者或组织(顺位)')
          }
          if (arr[3] === 1) chs.push(' + chinese')
          searchEventChs.push(chs[0] + ' + ' + chs[1] + ' -> ' + chs[2] + (chs[3] || ''))
        }
        config.searchEventChs = searchEventChs.join('<br>')

        Object.assign(G.config, config)
        GM_setValue('config', config)
        $('.ehConfig').remove()
      } else if ($(e.target).is('.ehConfigBtn>input[type="button"][name="cancel"]')) {
        $('.ehConfig').remove()
      } else if ($(e.target).is('.ehConfig input[name="exportValues"]')) {
        let obj = {}
        GM_listValues().forEach(key => {
          if (['EHD_code', 'EHT'].includes(key)) return
          obj[key] = GM_getValue(key)
        })
        let text = JSON.stringify(obj, null, 2)
        saveAs(text, '[EH]Enhance.json')
      } else if ($(e.target).is('.ehConfig input[name="fakeSelectFile"]')) {
        $('[name="selectFile"]').click()
      } else if ($(e.target).is('.ehConfig input[name="importValues"]')) {
        if (!$('[name="selectFile"]')[0].files || !$('[name="selectFile"]')[0].files.length || !window.confirm('Continue to IMPORT')) return
        let fr = new window.FileReader()
        fr.onload = e => {
          let json = e.target.result
          try {
            json = JSON.parse(json)
          } catch (error) {
            setNotification('Parse Json Data Error')
            return
          }
          Object.keys(json).forEach(i => {
            GM_setValue(i, json[i])
          })
          window.location = window.location.href
        }
        fr.readAsText($('[name="selectFile"]')[0].files[0])
      } else if ($(e.target).is('.ehConfig input[name="updateEHT"]')) {
        $(e.target).prop('disabled', true).val('Updating...')
        updateEHT().then(() => {
          $(e.target).prop('disabled', false).val('Update Now')
        })
      } else if ($(e.target).is('.ehConfig input[name="exportEHT"]')) {
        let text = GM_getValue('EHT', '')
        saveAs(text, 'EHT.json')
      } else if ($(e.target).is('.ehConfig input[name="emptyEHT"]')) {
        GM_deleteValue('EHT')
        GM_deleteValue('EHT_checkTime')
      } else if ($(e.target).is('.ehConfig input[name="updateEHD"]')) {
        $(e.target).prop('disabled', true).val('Updating...')
        updateEHD().then(() => {
          $(e.target).prop('disabled', false).val('Update Now')
        })
      } else if ($(e.target).is('.ehConfig input[name="exportEHD"]')) {
        let text = GM_getValue('EHD_code', '')
        saveAs(text, 'E-Hentai-Downloader.user.js')
      } else if ($(e.target).is('.ehConfig input[name="emptyEHD"]')) {
        GM_deleteValue('EHD_code')
        GM_deleteValue('EHD_checkTime')
        GM_deleteValue('EHD_version')
      } else if ($(e.target).is('.ehConfig input[name="exportIntroPic"]')) {
        let text = arrUnique(GM_getValue('introPic', [])).sort().map(i => G.config['exportIntroPicFormat'].replace(/{id}/g, i).replace(/{cr}/g, '\r').replace(/{lf}/g, '\n')).join('')
        GM_setClipboard(text)
      } else if ($(e.target).is('.ehConfig input[name="getUconfig"]')) {
        $(e.target).prop('disabled', true).val('Getting...')
        getEConfig().then(uconfig => {
          $('input[name="ehConfig_uconfig"]').val(uconfig)
          $(e.target).prop('disabled', false).val('Get NOW')
        })
      } else if ($(e.target).is('.ehConfig input[name="exportUrl"]')) {
        let text = arrUnique(GM_getValue('EHD_record', [])).sort().map(i => G.config['exportUrlFormat'].replace(/{url}/g, i).replace(/{cr}/g, '\r').replace(/{lf}/g, '\n')).join('')
        GM_setClipboard(text)
      } else if ($(e.target).is('.ehConfig input[name="emptyUrl"]')) {
        GM_setValue('EHD_record', [])
      }
    })

    $('[name="selectFile"]').on({
      change: e => {
        if (e.target.files) $('[name="fakeSelectFile"]').val('Select File: ' + e.target.files[0].name)
      }
    })
    $('[name="updateEHT"]').on({
      mouseenter: e => {
        let time = GM_getValue('EHT_checkTime', '')
        let d = new Date(time)
        d = G.config['timeShow'] === 'iso' ? new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000) : d
        let timeText = d.toLocaleString(navigator.language, {
          hour12: false
        })
        let length = G.EHT.map(i => i.tags).reduce((a, c) => [].concat(a, c)).length
        $(e.target).attr('title', `当前总数: <span class="ehHighlight">${length}</span><hr><time title="${timeText}" datetime="${time}">${calcRelativeTime(time)}</time>`)
      }
    })
    $('[name="updateEHD"]').on({
      mouseenter: e => {
        let time = GM_getValue('EHD_checkTime', '')
        let d = new Date(time)
        d = G.config['timeShow'] === 'iso' ? new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000) : d
        let timeText = d.toLocaleString(navigator.language, {
          hour12: false
        })
        let version = GM_getValue('EHD_version', '')
        $(e.target).attr('title', `当前版本: <span class="ehHighlight">${version}</span><hr><time title="${timeText}" datetime="${time}">${calcRelativeTime(time)}</time>`)
      }
    })

    let config = GM_getValue('config', {})
    $('.ehConfig input:not([type="button"]):not([type="file"]),.ehConfig select').toArray().forEach(i => {
      let name, value
      name = i.name || i.id
      name = name.replace('ehConfig_', '')
      if (!(name in config)) return
      value = config[name]
      if (i.type === 'text' || i.type === 'hidden' || i.type === 'select-one' || i.type === 'number') {
        i.value = value
      } else if (i.type === 'checkbox') {
        i.checked = value
      } else if (i.type === 'radio') {
        i.checked = (i.value === value)
      }
    })
  }).appendTo('#nb')
}

function showTooltip () { // 显示提示
  $('<div class="ehTooltip"></div>').appendTo('body')
  let preEle
  $('body').on('mousemove keydown', function (e) {
    if ((e.target === preEle || $(e.target).parents().filter(preEle).length) && e.type !== 'keydown') return
    let title = $(preEle).attr('raw-title')
    $(preEle).removeAttr('raw-title').attr('title', title)
    $('.ehTooltip').hide()
  })
  $('body').on('mouseenter', ':visible[title],:visible[raw-title],:visible[tooltip],[copy]', function (e) {
    preEle = e.target
    let title = $(preEle).attr('tooltip') ? $(preEle).attr('tooltip') + '<hr>' : ''
    let title1
    if ($(preEle).is('[copy]:not([title])')) {
      title1 = '点击复制: <span class="ehHighlight">' + $(preEle).attr('copy') + '</span>'
      $(preEle).attr('raw-title', title1)
    } else {
      title1 = $(preEle).attr('title') || $(preEle).attr('raw-title')
      if (!title1) {
        preEle = $(preEle).parents().filter('[title]').eq(-1)[0]
        title1 = $(preEle).attr('title') || $(preEle).attr('raw-title')
      }
      $(preEle).removeAttr('title').attr('raw-title', title1)
    }
    $('.ehTooltip').html(title + title1)

    let top = $(preEle).offset().top - $(window).scrollTop()
    let height = $(preEle).height() + parseInt($(preEle).css('padding-bottom')) + parseInt($(preEle).css('border-bottom-width')) + parseInt($(preEle).css('margin-bottom'))
    let _height = $('.ehTooltip').height() + parseInt($('.ehTooltip').css('padding-bottom')) + parseInt($('.ehTooltip').css('border-bottom-width')) + parseInt($('.ehTooltip').css('margin-bottom'))
    top = top + height + 5 + _height > window.innerHeight ? top - _height - 5 : top + height + 5

    let left = $(preEle).offset().left - $('body').scrollLeft()
    let width = $(preEle).width() + parseInt($(preEle).css('padding-left')) + parseInt($(preEle).css('border-left-width')) + parseInt($(preEle).css('margin-left'))
    let _width = $('.ehTooltip').width() + parseInt($('.ehTooltip').css('padding-left')) + parseInt($('.ehTooltip').css('border-left-width')) + parseInt($('.ehTooltip').css('margin-left'))
    left = left + _width > window.innerWidth ? left + width - _width : left
    if (top < 0) top = 0
    if (left < 0) left = 0
    $('.ehTooltip').show().css({
      top: top,
      left: left
    })
  })
}

function sortObj (obj, key = undefined) { // Object排序
  let objNew = {}
  Object.entries(obj).map(i => {
    return {
      key: i[0],
      value: i[1]
    }
  }).sort((o1, o2) => key ? o1.value[key] - o2.value[key] : o1.value - o2.value).forEach(i => {
    objNew[i.key] = i.value
  })
  return objNew
}

function tagEvent () { // 标签事件
  $('<div class="ehTagEvent"></div>').insertBefore('#tagmenu_act')
  let tags = {};
  ['Unlike', 'Alert', 'Like'].forEach(i => {
    tags[i] = GM_getValue('tag' + i, [])
    $('<a class="ehTagEventNotice" name="' + i + '" href="javascript:;" on="true"></a>').appendTo('.ehTagEvent').on('click', e => {
      let tag = GM_getValue('tag' + i, [])
      let keyword = $('.ehTagEvent').attr('name')
      if ($(e.target).attr('on') === 'true' && !tag.includes(keyword)) {
        tag.push(keyword)
        $('#taglist div[id="td_' + keyword.replace(/ /g, '_') + '"]').attr('name', i)
      } else if ($(e.target).attr('on') === 'false' && tag.includes(keyword)) {
        tag.splice(tag.indexOf(keyword), 1)
        $('#taglist div[id="td_' + keyword.replace(/ /g, '_') + '"]').removeAttr('name')
      }
      GM_setValue('tag' + i, tag)
    })
  })
  $('<a href="https://github.com/Mapaler/EhTagTranslator/" target="_blank">Copy for ETT</a>').appendTo('.ehTagEvent').on('click', e => {
    GM_setClipboard(`| ${$('.ehTagEvent').attr('name')} | | | |`)
    return false
  })
  $('#taglist a').on({
    contextmenu: e => { // 搜索标签+中文
      var keyword = e.target.innerText.replace(/\s+\|.*/, '')
      keyword = '"' + keyword + '"'
      if (/:/.test(e.target.id)) keyword = e.target.id.replace(/ta_(.*?):.*/, '$1') + ':' + keyword + '$'
      openUrl(G.config['searchArguments'].replace(/{q}/g, encodeURIComponent(keyword + ' language:"chinese"$')))
      return false
    },
    click: e => { // 标签
      $('.ehTagEvent').css('display', e.target.style.color ? 'block' : 'none').attr('name', e.target.id.replace('ta_', '').replace(/_/g, ' '))
      let name = $(e.target).parent().attr('name')
      $('.ehTagEvent>a[name="' + name + '"]').attr('on', 'false')
      $('.ehTagEvent>a:not([name="' + name + '"])').attr('on', 'true')
    }
  })
  $('#taglist div[id]').toArray().forEach(i => {
    let id = i.id.replace(/^td_/, '').replace(/_/g, ' ')
    for (let j in tags) {
      if (tags[j].includes(id)) {
        $(i).attr('name', j)
        break
      }
    }
  })
}

function tagPreview () { // 标签预览
  $('<div class="ehTagPreview"></div>').appendTo('body')
  $('body').on({
    mousemove (e) {
      if (!$(e.target).is('.it5>a,.id2>a,.id3>a>img')) {
        $('.ehTagPreview').hide()
        return
      }
      let target = $(e.target).is('.id3>a>img') ? $(e.target).parent()[0] : e.target
      let info = G.gmetadata.filter(i => i.gid === target.href.split('/')[4] * 1)[0]
      if (!info) return
      $('.ehTagPreview').html(`<div>${info.title_jpn}</div><div style="color:#f00;">[${Math.ceil(info.filesize / 1024 / 1024)}M] ${info.filecount}P ${info.rating}</div><div style="height:2px;background-color:#000000;"></div>`).show()
      let tagsHTML = $('<div></div>').appendTo('.ehTagPreview')
      info.tags.forEach(i => {
        let tag = i.split(':')
        let main = tag.length === 1 ? 'misc' : tag[0]
        let sub = tag[tag.length - 1]
        let chs = findData(main, sub, true)
        if ($(`.ehTagPreviewLi[name="${main}"]`, tagsHTML).length === 0) $(`<li class="ehTagPreviewLi" name="${main}"></li>`).appendTo(tagsHTML)
        $('<span></span>').text(chs.cname || sub).appendTo($(`.ehTagPreviewLi[name="${main}"]`, tagsHTML))
      })
      let _width = $('.ehTagPreview').outerWidth()
      let _height = $('.ehTagPreview').outerHeight()
      let left = _width + e.clientX + 10 < window.innerWidth ? e.clientX + 5 : e.clientX - _width - 5
      let top = _height + e.clientY + 10 < window.innerHeight ? e.clientY + 5 : e.clientY - _height - 5
      if (left < 0) left = 0
      if (top < 0) top = 0
      $('.ehTagPreview').css({
        left: left,
        top: top
      })
    }
  })
}

function task () { // 下载任务
  if (G.taskInterval) return
  let main = async () => {
    let task = GM_getValue('task', [])
    if (task.length === 0) {
      G.taskInterval = null
      return
    }

    let downloading = GM_getValue('downloading', [])
    if (downloading.length) {
      await waitInMs(2 * 1000)
      await main()
      return
    }

    let tasking = GM_getValue('tasking')
    if (tasking) {
      await waitInMs(2 * 1000)
      await main()
      return
    }

    tasking = task.splice(0, 1)[0]
    GM_setValue('tasking', tasking)
    GM_setValue('task', task)
    openUrl(tasking + '#2')
    await main()
  }
  G.taskInterval = setTimeout(main, 200)
}

function taskRemove () {
  let tasking = GM_getValue('tasking')
  if (tasking.match(unsafeWindow.gid)) GM_deleteValue('tasking')
}

function tagTranslate () { // 标签翻译
  let data = $('#taglist a').toArray().map(i => {
    let info = i.id.split(/ta_|:/)
    if (info.length === 2) info.splice(1, 0, 'misc')
    return findData(info[1], info[2], !G.config['tagTranslateImage'])
  }).filter(i => Object.keys(i).length)
  let css = [
    'div#taglist{overflow:visible;min-height:295px;height:auto}',
    'div#gmid{min-height:330px;height:auto;position:static}',
    '#taglist a{background:inherit}',
    '#taglist a::before{font-size:12px;overflow:hidden;line-height:20px;height:20px}',
    '#taglist a::after{display:block;color:#ff8e8e;font-size:14px;background:inherit;border:1px solid #000;border-radius:5px;position:absolute;float:left;z-index:999;padding:8px;box-shadow:3px 3px 10px #000;min-width:150px;max-width:500px;white-space:pre-wrap;opacity:0;transition:opacity .2s;transform:translate(-50%,20px);top:0;left:50%;pointer-events:none;padding-top:8px;font-weight:400;line-height:20px}',
    '#taglist a:hover::after,#taglist a:focus::after{opacity:1;pointer-events:auto}',
    '#taglist a:focus::before,#taglist a:hover::before{font-size:12px;position:relative;background-color:inherit;border:1px solid #000;border-width:1px 1px 0 1px;margin:-4px -5px;padding:3px 4px;color:inherit;border-radius:5px 5px 0 0}',
    'div.gt,div.gtw,div.gtl{line-height:20px;height:20px}',
    '#taglist a:hover::after{z-index:9999998}',
    '#taglist a:focus::after{z-index:9999996}',
    '#taglist a:hover::before{z-index:9999999}',
    '#taglist a:focus::before{z-index:9999997}',
    `#taglist a::after{color:#${window.window.location.host === 'exhentai.org' ? 'fff' : '000'};}`,
    ...data.map(i => `a[id="ta_${i.name}"]{font-size:0;}`),
    '#taglist a::before{text-decoration:line-through;}'
  ]
  data.forEach(i => {
    css.push(`a[id="ta_${i.name}"]::before{content:"${i.cname}"}`)
    if (i.info) css.push(`a[id="ta_${i.name}"]::after{content:"${i.info}"}`)
  })
  $('<style name="EHT"></style>').text(css.join('')).appendTo('head')
}

function toggleBlacklist (keyword) { // 加入黑名单或从黑名单中移除
  let blacklist = GM_getValue('blacklist', [])
  keyword = reEscape(keyword)
  if (!blacklist.includes(keyword)) { // 加入黑名单
    blacklist.push(keyword)
  } else if (blacklist.includes(keyword)) { // 从黑名单中移除
    blacklist.splice(blacklist.indexOf(keyword), 1)
  }
  GM_setValue('blacklist', blacklist)
}

function translateText (text) {
  if (!text) return text
  let arr = []
  let re = /(\w+):("|)(.*?)(\$"|"\$|")/
  let result
  for (let i = 0; ; i++) {
    result = re.exec(text)
    if (result) {
      text = text.replace(result[0], `{${i}}`)
      let temp
      if (findData(result[1]).cname) {
        let chs = findData(result[1], result[3], true).cname

        temp = findData(result[1]).cname + ':"'
        temp += chs || result[3]
        temp += '"'
      }
      arr.push(temp || result[0])
      result = re.exec(text)
    } else {
      break
    }
  }
  arr.forEach((i, j) => {
    text = text.replace(`{${j}}`, i)
  })
  return text
}

async function updateEHD () { // 更新EHD
  let res = await xhrSync('https://github.com/ccloli/E-Hentai-Downloader/raw/master/e-hentai-downloader.meta.js')
  let version = res.response.match(/\/\/ @version\s+([\d.]+)/)[1]
  if (version > GM_getValue('EHD_version', '0')) {
    GM_setValue('EHD_version', version)
    let res = await xhrSync('https://github.com/ccloli/E-Hentai-Downloader/raw/master/src/main.js')
    setNotification('E-Hentai-Downloader has been updated to ' + version)
    GM_setValue('EHD_code', res.response)
  }
  GM_setValue('EHD_checkTime', new Date().getTime())
}

async function updateEHT () { // 更新EHT
  let url = 'https://github.com/Mapaler/EhTagTranslator/wiki/'
  let InfoToArray = function (infoDom) {
    let arr = []
    if (infoDom.childNodes !== undefined) {
      for (let ci = 0, cilen = infoDom.childNodes.length; ci < cilen; ci++) {
        let node = infoDom.childNodes[ci]
        let InfoObj = {}
        switch (node.nodeName) {
          case '#text':
            InfoObj.type = 0
            if (node.textContent === '\n') continue
            InfoObj.text = node.textContent.replace('"', '\\"')
            break
          case 'BR':
            InfoObj.type = 1
            break
          case 'IMG':
            InfoObj.type = 2
            let osrc = node.getAttribute('data-canonical-src')
            if (osrc) {
              InfoObj.src = osrc
            } else if (node.title.length > 0) {
              InfoObj.src = node.title
            } else if (node.src.length > 0) {
              InfoObj.src = node.src
            }
            InfoObj.alt = node.alt
            break
          default:
            continue
        }
        arr.push(InfoObj)
      }
    }
    return arr
  }
  let LinksToArray = function (linksDom) {
    let arr = []
    let as = linksDom.querySelectorAll('a')
    for (let ai = 0; ai < as.length; ai++) {
      let a = as[ai]
      arr.push({
        text: a.textContent || '',
        href: a.href || '',
        title: a.title || ''
      })
    }
    return arr
  }
  let dealTags = function (response) {
    let rowTags = []
    let PageDOM = new window.DOMParser().parseFromString(response, 'text/html')
    let tBody = PageDOM.querySelector('#wiki-body div table').tBodies[0]
    for (let ri = 0, rilen = tBody.rows.length; ri < rilen; ri++) {
      let trow = tBody.rows[ri]
      let tag = {}
      if (trow.cells.length > 2) {
        tag.name = trow.cells[0].textContent.trim()
        tag.cname = InfoToArray(trow.cells[1])
        tag.info = InfoToArray(trow.cells[2])
        tag.links = LinksToArray(trow.cells[3])
        tag.type = tag.name.replace(/\s/ig, '').length < 1 ? 1 : 0
        rowTags.push(tag)
      }
    }
    return rowTags
  }

  let dataset = []
  let rows = await xhrSync(url + 'rows')
  rows = rows.response
  let rowsPageDOM = new window.DOMParser().parseFromString(rows, 'text/html')
  let table = rowsPageDOM.querySelector('#wiki-body div table').tBodies[0]
  let rowsCount = table.rows.length
  for (let ri = 0; ri < rowsCount; ri++) {
    let trow = table.rows[ri]
    let row = {
      tags: []
    }
    row.name = trow.cells[0].textContent.trim()
    row.cname = InfoToArray(trow.cells[1])
    row.info = InfoToArray(trow.cells[2])
    row.links = LinksToArray(trow.cells[3])

    let tagRows = await xhrSync(url + row.name)
    tagRows = tagRows.response
    row.tags = dealTags(tagRows)
    dataset.push(row)
  }

  GM_setValue('EHT', JSON.stringify({
    'database-structure-version': 4,
    date: new Date().getTime(),
    dataset: dataset
  }))
  setNotification('EhTagTranslator has been up-to-date')
  GM_setValue('EHT_checkTime', new Date().getTime())
}

function waitInMs (time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

function waitForElement (ele, timeout) {
  return new Promise((resolve, reject) => {
    let now = new Date().getTime()
    let id
    id = setInterval(() => {
      if (new Date().getTime() - now >= timeout) {
        clearInterval(id)
        resolve(false)
      } else if ($(ele).length) {
        resolve(true)
      }
    }, 200)
  })
}

function xhr (url, onload, parm = null, opt = {}) {
  GM_xmlhttpRequest({
    method: parm ? 'POST' : 'GET',
    url: url,
    data: parm,
    timeout: opt.timeout || 60 * 1000,
    responseType: opt.responseType || 'text',
    headers: opt.headers || {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    onload (res) {
      onload(res)
    },
    ontimeout (res) {
      if (typeof opt.ontimeout === 'function') opt.ontimeout(res)
    },
    onerror (res) {
      if (typeof opt.onerror === 'function') opt.onerror(res)
    }
  })
}

function xhrSync (url, parm = null, opt = {}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: parm ? 'POST' : 'GET',
      url: url,
      data: parm,
      timeout: opt.timeout || 60 * 1000,
      responseType: ['arraybuffer', 'blob', 'json'].includes(opt.responseType) ? opt.responseType : 'text',
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

init().then(() => {
  //
}, (err) => {
  console.error(err)
})
