// ==UserScript==
// @name        [EH]Enhance
// @version     1.16.890
// @modified    2020-3-2 14:58:03
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
// @grant       GM_getResourceText
// @connect     *
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.js
// @resource diff https://raw.githubusercontent.com/jhchen/fast-diff/master/diff.js
// @run-at      document-end
// @compatible  firefox 52+(ES2017)
// @compatible  chrome 55+(ES2017)
// ==/UserScript==
/* global JSZip */
/* eslint-disable no-debugger */
(function () {
  /* eslint-disable no-new-func */
  let obj = {}
  let diffFunc = new Function('module', GM_getResourceText('diff'))
  diffFunc(obj)
  let diff = obj.exports
  Object.assign(window, { diff })
})()

let diff = window.diff

const SEL = {
  EH: {
    // unsafeWindow
    common: {
      navBar: '#nb',
      pageCur: '.ptds:eq(0)',
      pages: '.ptt td:gt(0):lt(-1)>a'
    },
    search: {// 搜索页
      checker: '.ido', // 检查是否为搜索页
      displayMode: '#dms select',

      mainDiv: '.ido',

      keyword: '[name="f_search"]',
      apply: '[name="f_apply"]',
      resultTotal: '.ip:eq(0)',
      resultTotalMatch: /Showing ([\d,]+) results?/,

      thumb: '.glthumb',

      favorited: '[id^="posted_"][style]',

      resultTable: 'table.itg',
      resultTbody: 'table.itg>tbody',
      resultTr: 'table.itg tr',
      resultTr0: 'table.itg tr:eq(0)',
      resultTrGt0: 'table.itg tr:gt(0)',

      nameTd: '.gl3m',
      galleryA: '[href*="hentai.org/g/"]'

    },
    info: {// 信息页
      checker: '#gdt,.d', // 检查是否为信息页
      urlMatch: /^https?:\/\/e[-x]hentai\.org\/g\/\d+\/[a-z0-9]+/,

      galleryId: unsafeWindow.gid,

      title: '#gn',
      titleJp: '#gj',

      favorite: '#gdf>#fav>.i',

      infoMid: '#gmid',

      tagContainer: '#taglist',
      tagDiv: '[id^="td_"]',
      tagDivFromName: name => `[id="td_${name}"]`,
      tag: '[id^="ta_"]',
      tagFromName: name => `[id="ta_${name}"]`,
      tagParody: '[id^="ta_parody"]',
      nameFromTag: id => id.match(/t[ad]_((.*?):(.*))/) || id.match(/t[ad]_(.*)/),
      tagBanned: ['ta_female:lolicon', 'ta_male:shotacon', 'ta_male:bestiality', 'ta_female:bestiality'],

      btnContainer: '#gdo2',
      previewContainer: '[id="gdt"]',
      previewDiv: '.gdtm',
      previewA: '.gdtm>div>a',
      previewImg: '.gdtm>div>a>img',

      deleted: '.d'
    },
    setting: {// 设置页
      // changeEConfig
      form: 'form:has(#apply)'
    }
  },
  EHD: {
    checker: '.ehD-box',
    download: 'fieldset.ehD-box .g2:contains("Download Archive")',
    abort: '.ehD-pt-item:not(.ehD-pt-succeed,.ehD-pt-failed) .ehD-pt-abort',
    pageRange: 'label:contains("Pages Range")>input'
    // download: '.ehD-box>.g2:eq(0)'
  }
}

const G = { // 全局变量
  debug: false,
  searchPage: !!$(SEL.EH.search.checker).length,
  infoPage: $(SEL.EH.info.checker).length,
  isPreferDisplayMode: ['m', 'p'].includes($(SEL.EH.search.displayMode).val()),
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
    /^ZZ\.(png|jpg)$/
    // /\.gif$/i
  ],
  uselessStrRE: /\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）|～|~/g,
  digitalRomaji: {
    0: [['rei', 'zero'], ['0', '０', '零', '〇']],
    1: [['ichi', 'i'], ['1', '１', '一', '壹', '壱']],
    2: [['ni', 'ii'], ['2', '２', '二', '贰', '貮', '弐']],
    3: [['san', 'sann', 'iii'], ['3', '３', '三', '参', '參']],
    4: [['yon', 'yonn', 'shi', 'iv'], ['4', '４', '四', '肆']],
    5: [['go', 'v'], ['5', '５', '五', '伍']],
    6: [['roku', 'vi'], ['6', '６', '六', '陆', '陸']],
    7: [['nana', 'shichi', 'vii'], ['7', '７', '七', '柒', '漆']],
    8: [['hachi', 'viii'], ['8', '８', '八', '捌']],
    9: [['kyuu', 'kyu', 'ix'], ['9', '９', '九', '玖']],
    10: [['jyuu', 'jyu', 'juu', 'ju', 'x'], ['10', '１０', '十', '拾']]
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
  emojiRegExp: /\u{2139}|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|\u{2328}|\u{23CF}|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|\u{24C2}|[\u{25AA}-\u{25AB}]|\u{25B6}|\u{25C0}|[\u{25FB}-\u{25FE}]|[\u{2600}-\u{2604}]|\u{260E}|\u{2611}|[\u{2614}-\u{2615}]|\u{2618}|\u{261D}|\u{2620}|[\u{2622}-\u{2623}]|\u{2626}|\u{262A}|[\u{262E}-\u{262F}]|[\u{2638}-\u{263A}]|[\u{2648}-\u{2653}]|\u{2660}|\u{2663}|\u{2666}|\u{2668}|\u{267B}|\u{267F}|[\u{2692}-\u{2697}]|\u{2699}|[\u{269B}-\u{269C}]|[\u{26A0}-\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26B0}-\u{26B1}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|\u{26C8}|\u{26CE}|\u{26CF}|\u{26D1}|[\u{26D3}-\u{26D4}]|[\u{26E9}-\u{26EA}]|[\u{26F0}-\u{26F5}]|[\u{26F7}-\u{26FA}]|\u{26FD}|\u{2702}|\u{2705}|[\u{2708}-\u{2709}]|[\u{270A}-\u{270B}]|[\u{270C}-\u{270D}]|\u{270F}|\u{2712}|\u{2714}|\u{2716}|\u{271D}|\u{2721}|\u{2728}|[\u{2733}-\u{2734}]|\u{2744}|\u{2747}|\u{274C}|\u{274E}|[\u{2753}-\u{2755}]|\u{2757}|\u{2763}|[\u{2795}-\u{2797}]|\u{27A1}|\u{27B0}|\u{27BF}|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|\u{2B50}|\u{2B55}|\u{3030}|\u{303D}|\u{3297}|\u{3299}|\u{1F004}|\u{1F0CF}|[\u{1F170}-\u{1F171}]|\u{1F17E}|\u{1F17F}|\u{1F18E}|[\u{1F191}-\u{1F19A}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F201}-\u{1F202}]|\u{1F21A}|\u{1F22F}|[\u{1F232}-\u{1F23A}]|[\u{1F250}-\u{1F251}]|[\u{1F300}-\u{1F320}]|\u{1F321}|[\u{1F324}-\u{1F32C}]|[\u{1F32D}-\u{1F32F}]|[\u{1F330}-\u{1F335}]|\u{1F336}|[\u{1F337}-\u{1F37C}]|\u{1F37D}|[\u{1F37E}-\u{1F37F}]|[\u{1F380}-\u{1F393}]|[\u{1F396}-\u{1F397}]|[\u{1F399}-\u{1F39B}]|[\u{1F39E}-\u{1F39F}]|[\u{1F3A0}-\u{1F3C4}]|\u{1F3C5}|[\u{1F3C6}-\u{1F3CA}]|[\u{1F3CB}-\u{1F3CE}]|[\u{1F3CF}-\u{1F3D3}]|[\u{1F3D4}-\u{1F3DF}]|[\u{1F3E0}-\u{1F3F0}]|[\u{1F3F3}-\u{1F3F5}]|\u{1F3F7}|[\u{1F3F8}-\u{1F3FF}]|[\u{1F400}-\u{1F43E}]|\u{1F43F}|\u{1F440}|\u{1F441}|[\u{1F442}-\u{1F4F7}]|\u{1F4F8}|[\u{1F4F9}-\u{1F4FC}]|\u{1F4FD}|\u{1F4FF}|[\u{1F500}-\u{1F53D}]|[\u{1F549}-\u{1F54A}]|[\u{1F54B}-\u{1F54E}]|[\u{1F550}-\u{1F567}]|[\u{1F56F}-\u{1F570}]|[\u{1F573}-\u{1F579}]|\u{1F57A}|\u{1F587}|[\u{1F58A}-\u{1F58D}]|\u{1F590}|[\u{1F595}-\u{1F596}]|\u{1F5A4}|\u{1F5A5}|\u{1F5A8}|[\u{1F5B1}-\u{1F5B2}]|\u{1F5BC}|[\u{1F5C2}-\u{1F5C4}]|[\u{1F5D1}-\u{1F5D3}]|[\u{1F5DC}-\u{1F5DE}]|\u{1F5E1}|\u{1F5E3}|\u{1F5E8}|\u{1F5EF}|\u{1F5F3}|\u{1F5FA}|[\u{1F5FB}-\u{1F5FF}]|\u{1F600}|[\u{1F601}-\u{1F610}]|\u{1F611}|[\u{1F612}-\u{1F614}]|\u{1F615}|\u{1F616}|\u{1F617}|\u{1F618}|\u{1F619}|\u{1F61A}|\u{1F61B}|[\u{1F61C}-\u{1F61E}]|\u{1F61F}|[\u{1F620}-\u{1F625}]|[\u{1F626}-\u{1F627}]|[\u{1F628}-\u{1F62B}]|\u{1F62C}|\u{1F62D}|[\u{1F62E}-\u{1F62F}]|[\u{1F630}-\u{1F633}]|\u{1F634}|[\u{1F635}-\u{1F640}]|[\u{1F641}-\u{1F642}]|[\u{1F643}-\u{1F644}]|[\u{1F645}-\u{1F64F}]|[\u{1F680}-\u{1F6C5}]|[\u{1F6CB}-\u{1F6CF}]|\u{1F6D0}|[\u{1F6D1}-\u{1F6D2}]|[\u{1F6E0}-\u{1F6E5}]|\u{1F6E9}|[\u{1F6EB}-\u{1F6EC}]|\u{1F6F0}|\u{1F6F3}|[\u{1F6F4}-\u{1F6F6}]|[\u{1F6F7}-\u{1F6F8}]|[\u{1F910}-\u{1F918}]|[\u{1F919}-\u{1F91E}]|\u{1F91F}|[\u{1F920}-\u{1F927}]|[\u{1F928}-\u{1F92F}]|\u{1F930}|[\u{1F931}-\u{1F932}]|[\u{1F933}-\u{1F93A}]|[\u{1F93C}-\u{1F93E}]|[\u{1F940}-\u{1F945}]|[\u{1F947}-\u{1F94B}]|\u{1F94C}|[\u{1F950}-\u{1F95E}]|[\u{1F95F}-\u{1F96B}]|[\u{1F980}-\u{1F984}]|[\u{1F985}-\u{1F991}]|[\u{1F992}-\u{1F997}]|\u{1F9C0}|[\u{1F9D0}-\u{1F9E6}]|❤/gu
}
G.autoDownload = window.location.hash.match(/^#[0-2]$/) && G.config['autoStartDownload']
G.downloadSizeChanged = !G['ehD-setting']['store-in-fs'] && G.config['enableEHD'] && G.config['showAllThumb'] && G.config['enableChangeSize'] && G.config['sizeS'] !== G.config['sizeD'] && G.config['downloadSizeChanged']

async function init () {
  GM_registerMenuCommand(GM_info.script.name + ': Show Global', function () {
    console.log({ SEL, G })
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
  if (GM_getValue('EHT') && JSON.parse(GM_getValue('EHT')).version === 5) {
    G.EHT = JSON.parse(GM_getValue('EHT')).data
  } else {
    try {
      await updateEHT()
      G.EHT = JSON.parse(GM_getValue('EHT')).data
    } catch (error) {
      console.log(error)
      window.alert('update EHT failed, please reload this page')
      return
    }
  }
  if (G.infoPage) { // 信息页
    if (jumpHost()) return // 里站跳转
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
        '  if (!msg || !msg.length) return',
        `  if (typeof msg[0] === 'string' && msg[0].match(/\\[EHD\\] #\\d+: Network Error/)) {`,
        '    __record = true',
        '  } else if (__record && msg.filter(i => i.toString().match(/^https?:/)).length) {',
        '    let url = msg.filter(i => i.toString().match(/^https?:/))[0]',
        '    window.console.log("Request Failed: " + url)',
        `    let record = GM_getValue('EHD_record', [])`,
        `    let host = new URL(url).hostname.replace(/\\d+$/g, '')`,
        '    if (!record.includes(host)) {',
        '      record.push(host)',
        `      GM_setValue('EHD_record', record)`,
        '    }',
        '    __record = false',
        '  }',
        '}'
      ]
      let fixEHDCounter = [
        'window.fixEHDCounterTime = 0',
        'window.fixEHDCounter = function () {',
        '  fixEHDCounterTime++',
        '  if (totalCount <= 0) return',
        '  if (totalCount === downloadedCount && failedCount > 0) { failedCount = 0; checkFailed() }',
        `  if (fetchCount < 0) { fetchCount = [...document.querySelectorAll('.ehD-pt-progress')].filter(i => { let value = i.getAttribute('value'); return value === null || (value * 1 < 1 && value * 1 > 0) }).length; updateTotalStatus(); checkFailed() }`,
        `  if (downloadedCount + failedCount >= totalCount && failedCount > 0 && fetchCount > 0) { retryAllFailed() }`,
        `  if (downloadedCount >= totalCount) { ehDownloadPauseBtn(); saveDownloaded(true); }`,
        // '  window.console.log("totalCount:\t", totalCount, "\nfetchCount:\t", fetchCount, "\ndownloadedCount:\t", downloadedCount, "\nfailedCount:\t", failedCount)',
        // '  window.console.log(JSON.stringify({"总计": totalCount, "下载中": fetchCount, "已完成": downloadedCount, "下载失败": failedCount}))',
        // '  window.console.log(totalCount, fetchCount, downloadedCount, failedCount)',
        '  let node = document.createElement("tr")',
        '  node.innerHTML = "<td colspan=\\"3\\">fixEHDCounter: " + fixEHDCounterTime + "</td>"',
        '  document.querySelector(".ehD-pt").appendChild(node)',
        '}'
      ]
      $('<input type="button" value="Fix EHD Counter" tooltip="重置EHTD计数">').on({
        click: () => {
          window.fixEHDCounter()
        }
      }).prependTo('.ehNavBar>div:nth-child(2)')
      let checkAndFix = [
        'window.EHDCounter = {}',
        'let checkAndFixEHDCounter = function () {',
        '  let timeout = 1 * 1000',
        '  if (totalCount !== 0) {',
        '    let obj = { totalCount, downloadedCount, failedCount, fetchCount }',
        '    let changed = false',
        '    for (let i in obj) {',
        '      if (window.EHDCounter[i] !== obj[i]) {',
        '        changed = true',
        '        break',
        '      }',
        '    }',
        '    if (changed) {',
        '      window.EHDCounter = obj',
        '      timeout = 2 * 1000',
        '    } else if (obj.fetchCount <= -1) {',
        '      window.fixEHDCounter()',
        '    }',
        '  }',
        '  setTimeout(checkAndFixEHDCounter, timeout)',
        '}',
        'checkAndFixEHDCounter()'
      ]
      let toEavl = [
        '(function () {',
        `var loadSetting = function () { return new Promise(resolve => { resolve(GM_getValue('ehD-setting')) }) }`,
        'let console = {}',
        'for (let i in window.console) { console[i] = new Function() }',
        'let alert = function () { }',
        'let confirm = function () { return true }',
        (G.config['recordEHDUrl'] ? recordEHDUrl.join('\n') : ''),
        '\n',
        GM_getValue('EHD_code'),
        '\n',
        fixEHDCounter.join('\n'),
        '\n',
        // (G.config['fixEHDCounter'] ? 'setInterval(window.fixEHDCounter, 300)' : ''),
        (G.config['fixEHDCounter'] ? checkAndFix.join('\n') : ''),
        '\n',
        '})()'
      ]
      /* eslint-disable no-eval */
      eval(toEavl.join('\n')) // 运行EHD
    } else {
      let loaded = await waitForElement(SEL.EHD.checker, 30 * 1000)
      if (!loaded) console.error('载入 E-Hentai-Downloader 超时')
      setNotification('载入 E-Hentai-Downloader 超时')
    }
    $(SEL.EHD.download).click(e => { // 使用EHD下载时, 添加到下载列表
      if (e.originalEvent && G.downloadSizeChanged) autoDownload()
      downloadAdd(SEL.EH.info.galleryId)
      if ($('[rel="shortcut icon"]').length === 0) changeFav(G.favicon.d)
      $('.ehNavBar').attr('style', 'top:0;')
    })
    $(window).on('unload', () => { // 关闭页面时, 从下载列表中移除
      downloadRemove(SEL.EH.info.galleryId)
    })
    if (G.config.changeName) changeName(SEL.EH.info.title) // 修改本子标题（删除集会名、替换其中的罗马数字）
    document.title = $(SEL.EH.info.title).text()
    tagTranslate() // 标签翻译
    btnSearch() // 按钮 -> 搜索(信息页)
    btnFake() // 按钮 -> 下载空文档(信息页)
    btnInfoText() // 按钮 -> 下载info.txt(信息页)
    btnTask() // 按钮 -> 添加到下载任务(信息页)
    tagEvent() // 标签事件
    copyInfo() // 复制信息
    abortPending() // 终止EHD所有下载
    $('<input type="button" class="ehThumbBtn" value="Hide" style="width:36px;height:15px;padding:3px 2px;margin:0 2px 4px 2px;float:left;border-radius:5px;border:1px solid #989898;">').on('click', function (e) { // 隐藏预览图
      $(SEL.EH.info.previewContainer).toggle()
      $(e.target).val($(e.target).val() === 'Show' ? 'Hide' : 'Show')
    }).prependTo(SEL.EH.info.btnContainer)
    if (G.config['showAllThumb']) await showAllThumb()
    introPic() // 宣传图
    if (G.config['enableChangeSize'] && G.config['sizeS'] !== G.config['sizeD']) await checkImageSize()
    await waitInMs(500)
    if (G.autoDownload) await autoDownload() // 自动开始下载
  } else { // 搜索页
    if ($(SEL.EH.search.resultTotal).length && !G.isPreferDisplayMode) {
      window.alert('Please change display mode to "Minimal" or "Minimal+"')
      return
    }
    if (jumpHost()) return // 里站跳转
    $(SEL.EH.search.apply).hide()
    $('<input type="button" value="Apply Filter" title="右键: 添加/删除 中文">').on({
      click: () => {
        $(SEL.EH.search.apply).click()
      },
      contextmenu: () => {
        let value = $(SEL.EH.search.keyword).val()
        value = value.match('language:"chinese"\\$') ? value.replace('language:"chinese"$', '').trim() : value + ' language:"chinese"$'
        $(SEL.EH.search.keyword).val(value)
        $(SEL.EH.search.apply).click()
      }
    }).insertBefore(SEL.EH.search.apply)
    if ($(SEL.EH.search.keyword).val()) document.title = translateText($(SEL.EH.search.keyword).val())
    $('<div class="ehContainer"></div>').prependTo(SEL.EH.search.nameTd)
    btnSearch2() // 按钮 -> 搜索(搜索页)
    quickDownload() // 右键：下载
    if ($(SEL.EH.search.resultTable).length) batchDownload() // Displsy: List => 批量下载
    btnFake2() // 按钮 -> 下载空文档(搜索页)
    btnTask2() // 按钮 -> 添加到下载任务(搜索页)
    if (G.config['checkExist']) checkExist() // 检查本地是否存在
    let _gmetadata = await getInfo() || []
    G.gmetadata.push(..._gmetadata)
    if (G.config.changeName) changeName(SEL.EH.search.galleryA) // 修改本子标题（删除集会名、替换其中的罗马数字）
    if (G.config['languageCode']) languageCode() // 显示iso语言代码
    if (G.config['checkExistAtStart']) $('input:button[name="checkExist"]').click()
    tagPreview() // 标签预览
    hideGalleries() // 隐藏某些画集
    if ($(SEL.EH.search.resultTable).length && G.config['preloadPaneImage']) $(SEL.EH.search.thumb).each((index, elem) => { unsafeWindow.load_pane_image(elem) })
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
  }).prependTo('.ehNavBar>div:nth-child(3)')
  $('<input type="button" value="Start Task" tooltip="' + htmlEscape('左键: 开始下载任务<br>中键: 从当前任务开始<br>右键: 重置当前下载任务') + '">').on({
    mousedown: e => {
      if (e.button === 0) {
        task()
      } else if (e.button === 1) {
        let task = [].concat(GM_getValue('tasking', []), GM_getValue('task', [])).map(i => i.replace(/#\d+$/, '')).filter((item, index, array) => array.indexOf(item) === index).filter(i => i)
        GM_deleteValue('tasking')
        GM_setValue('task', task)
        task()
      } else if (e.button === 2) {
        GM_deleteValue('tasking')
      }
    },
    mouseenter: e => {
      let task = GM_getValue('task', [])
      $(e.target).attr('title', '当前任务:<br> ' + GM_getValue('tasking', '') + '<hr>当前任务列表: ' + task.length + '<br> ' + task.join('<br> '))
    }
  }).appendTo('.ehNavBar>div:nth-child(3)')
  $('<input type="file" id="selectFileTask" name="selectFile" accept=".txt">').on({
    change: e => {
      if (!e.target.files || !e.target.files.length) {
        e.target.value = null
        return
      }
      let fr = new window.FileReader()
      fr.onload = e => {
        let text = e.target.result
        let tasking = GM_getValue('tasking', [])
        let task = [].concat(GM_getValue('task', []), text.split(/[\r\n]+/)).map(i => i.replace(/#\d+$/, '')).filter((item, index, array) => array.indexOf(item) === index).filter(i => i && i !== tasking && i.match(SEL.EH.info.urlMatch))
        GM_setValue('task', task)
        e.target.value = null
      }
      fr.readAsText(e.target.files[0])
    }
  }).appendTo('.ehNavBar>div:nth-child(3)')
  $('<input type="button" value="Export Task" tooltip="' + htmlEscape('左键: 导出下载列表（包括正在下载）<br>右键: 导入下载列表（自动清除重复项）') + '">').on({
    mousedown: e => {
      if (e.button === 0) {
        let task = [].concat(GM_getValue('tasking', []), GM_getValue('task', [])).map(i => i.replace(/#\d+$/, '')).filter((item, index, array) => array.indexOf(item) === index).filter(i => i)
        saveAs2(task.join('\n'), 'task-list.txt')
      } else if (e.button === 1) {

      } else if (e.button === 2) {
        $('#selectFileTask').click()
      }
    },
    mouseenter: e => {
      let task = GM_getValue('task', [])
      $(e.target).attr('title', '当前任务:<br> ' + GM_getValue('tasking', '') + '<hr>当前任务列表: ' + task.length + '<br> ' + task.join('<br> '))
    }
  }).appendTo('.ehNavBar>div:nth-child(3)')
  $('<input type="button" value="Toggle Blacklist" title="' + htmlEscape('左键: 加入或移除黑名单<br>右键: 显示黑名单列表') + '">').on({
    mousedown: e => {
      if (e.button === 0) {
        let value = window.prompt('keyword:')
        if (value && value.trim()) {
          toggleBlacklist(value.trim())
          highlightBlacklist()
        }
      } else if (e.button === 1) {

      } else if (e.button === 2) {
        if ($('.ehBlackListContainer').length) {
          $('.ehBlackListContainer').remove()
        } else {
          let blacklist = GM_getValue('blacklist', [])
          let html = '<ul>'
          html += blacklist.map(keyword => `<li><a href="${G.config['searchArguments'].replace(/{q}/g, encodeURIComponent(keyword))}" target="_blank">${htmlEscape(keyword)}</a> <span copy="${htmlEscape(keyword)}">复制</span></li>`).join('')
          html += '</ul>'
          $('<div class="ehBlackListContainer"></div>').html(html).appendTo('body')
        }
      }
    }
  }).appendTo('.ehNavBar>div:nth-child(3)')

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
      $(SEL.EHD.abort).click()
    }
  }).appendTo('.ehNavBar>div:nth-child(2)')
}

function addStyle () { // 添加样式
  let backgroundColor = $('body').css('background-color')
  $('<style></style>').text([
    // global
    'input[type="number"]{width:60px;border:1px solid #B5A4A4;margin:3px 1px 0;padding:1px 3px 3px;border-radius:3px;}',
    'input:disabled{cursor:progress;color:#808080;}',

    // script
    '.ehNavBar{display:flex;width:99%;background-color:' + backgroundColor + ';position:fixed;z-index:1000;padding:0 10px;}',
    '.ehNavBar>div{flex-grow:1;}',
    '.ehNavBar>div:nth-child(1){text-align:left;}',
    '.ehNavBar>div:nth-child(2){text-align:center;}',
    '.ehNavBar>div:nth-child(3){text-align:right;}',
    '.btnSearch{cursor:pointer;width:16px;height:16px;float:left;}',
    '.btnSearch::before{content:"' + '\ud83d\udd0d' + '"}',
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
    '.ehTagEvent>.ehTagEventNotice[on="true"]::after{content:attr(name);}',
    '.ehTagEvent>.ehTagEventNotice[on="false"]::after{content:"NOT " attr(name);}',
    '.ehTooltip{max-width:50%;max-height:85%;overflow:auto;display:none;position:fixed;text-align:left;z-index:99999;border:2px solid #8d8d8d;background-color:' + backgroundColor + ';font-size:110%;}',
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
    '[copy]{cursor:pointer;}',
    '.icon{margin:-3px 0!important;height:16px!important;width:16px!important;}',
    '.ehHighlight{color:#0f0;background-color:#000;margin:3px;font-size:125%;font-weight:bold;}',
    'span.ehLang{float:left;border:black 1px solid;color:#0f0;margin:1px;background:#000;}',
    '.ehNew{width:25px;height:12px;float:left;background-image:url(https://ehgt.org/g/n.gif);}',
    '[name="selectFile"]{width:0;height:0;opacity:0;overflow:hidden;}',
    '.ehNotification{display:flex;z-index:2147483647;position:fixed;bottom:1px;right:1px;border:solid 1px #000;background-color:' + backgroundColor + ';min-width:300px;cursor:pointer;}',
    '.ehNotification>div:nth-child(1){flex:1;}',
    '.ehNotification>div:nth-child(2){flex:4;}',
    '.ehNotification>div:nth-child(2)>div:nth-child(1){font-size:16px;font-weight:bold;white-space:nowrap;}',
    '.ehFavicion{background: url(favicon.ico) no-repeat center center;}',
    '.ehIgnore{filter:blur(1px) grayscale(1);}',
    '.ehIgnore:hover{filter:none;}',

    '.ehPreLike{white-space:pre-wrap;word-break:break-word;font-family:Consolas,Monaco,monospace;}',
    '.ehDiffNone{color:' + backgroundColor + ';background-color:' + backgroundColor + ';}',
    '.ehDiffDel{background:#9d0b0b;font-size:110%;}',
    '.ehDiffAdd{background:#007944;font-size:110%;}',

    '.ehBlackListContainer{position:fixed;top:23px;bottom:16px;left:0;right:0;min-width:950px;max-width:1200px;margin:10px auto;padding:5px;border:solid 1px black;z-index:2;background-color:' + backgroundColor + ';overflow:auto;text-align:justify;}',

    // html
    SEL.EH.common.navBar + '{max-width:100%;max-height:100%;}',
    SEL.EH.search.mainDiv + ',' + SEL.EH.search.resultTable + '{max-width:9999px!important;min-width:0!important;justify-content:center;}',
    SEL.EH.search.resultTr + '.ehBatchHover{background-color:#669933!important;}',
    SEL.EH.search.resultTr + ':hover{background-color:#4a86e8!important;}',
    '.ehTagNotice{margin:1px;}',
    '.ehTagNotice{float:left;}',
    '.ehTagNotice[name="Unlike"],' + SEL.EH.info.tagDiv + '[name="Unlike"]{color:#f00;background-color:#00f;}',
    '.ehTagNotice[name="Alert"],' + SEL.EH.info.tagDiv + '[name="Alert"]{color:#ff0;background-color:#080;}',
    '.ehTagNotice[name="Like"],' + SEL.EH.info.tagDiv + '[name="Like"]{color:#000;background-color:#0ff;}',
    SEL.EH.info.previewDiv + ' [name="intro"]{white-space:nowrap;}',
    SEL.EH.info.previewDiv + ' [name="intro"][on="true"]::after{content:"Block: " attr(file);}',
    SEL.EH.info.previewDiv + ' [name="intro"][on="false"]::after{content:"Unblock: " attr(file);}'

    // unknown
    // '.ih>li{margin:0 2px;cursor:pointer;list-style:none;}',
    // '.ih>li::before{content:attr(name) ": ";}',
    // '.ih>li>span{margin:1px;}'
  ].join('\n')).appendTo('head')
}

async function autoDownload (isEnd) { // 自动开始下载
  // isEnd false: 下载小图, true: 下载大图
  if (G.downloadSizeChanged) {
    if (G.imageD.length && G.imageS.length) {
      let imageSize = isEnd ? G.config['sizeD'] : G.config['sizeS']
      await changeEConfig('xr', imageSize)
      changeFav(G.favicon[imageSize])
      $(SEL.EHD.pageRange).val(makeRange(isEnd ? G.imageD : G.imageS))
      G.imageEnd = isEnd
    } else {
      G.downloadSizeChanged = false
      $(SEL.EHD.pageRange).val(makeRange(G.imageD.length ? G.imageD : G.imageS))
    }
  }
  $(SEL.EHD.download).click()
}

function autoComplete () { // 自动填充
  let main = (G.config['acItem'] || 'language,artist,female,male,parody,character,group,misc').split(',')
  main = G.EHT.filter(i => main.includes(i.namespace))
  $('<div class="ehDatalist"><ol start="0"></ol></div>').on('click', 'li', function (e) {
    let value = $(SEL.EH.search.keyword).val().split(/\s+/)
    value[value.length - 1] = e.target.textContent
    $(SEL.EH.search.keyword).val(value.filter(i => i).join(' ')).focus()
    $('.ehDatalist>ol').empty()
    $('.ehDatalist').show()
  }).appendTo($('form').has(SEL.EH.search.keyword))
  let lastValue
  $(SEL.EH.search.keyword).attr('title', `当输入大于${G.config['acLength']}个字符时，显示选单<br>使用主键盘区的数字/加减/方向键快速选择<br>点击/Enter/Insert键填充<br>使用输入法时，无法使用数字/加减选择`).on({
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
        for (let key in i.data) {
          if (key.match(value) || i.data[key].name.match(value)) {
            $(`<li cname="${i.data[key].name}">${i.namespace}:"${key}"$</li>`).appendTo('.ehDatalist>ol')
          }
        }
      })
      $('.ehDatalist').show()
    }
  })
}

function batchDownload () { // 批量下载
  $('<th><input type="checkbox" title="全选"></th>').appendTo(SEL.EH.search.resultTr0)
  $(SEL.EH.search.resultTr0).find('input').on('click', function (e) {
    $(SEL.EH.search.resultTrGt0).find('input:visible').prop('checked', e.target.checked)
    $(SEL.EH.search.resultTrGt0).filter(':visible:not(.ehCheckContainer)').toggleClass('ehBatchHover', e.target.checked)
  })
  $('<td><input type="checkbox"></td>').appendTo($(SEL.EH.search.resultTrGt0).filter(':not(.ehCheckContainer)'))
  $(SEL.EH.search.resultTrGt0).filter(':not(.ehCheckContainer)').on('click', e => {
    if ($(e.target).is('a,input') || $(e.target).parents().filter('a,input').length) return
    $(e.currentTarget).find('input[type="checkbox"]').click()
  })
  $(SEL.EH.search.resultTrGt0).find('input').on('click', function (e) {
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
      $(SEL.EH.search.resultTr).find('input:checked').click()
      let books = $(SEL.EH.search.resultTrGt0).filter(':visible:not(:has(.ehExist,.ehBlacklist),.ehCheckContainer)').toArray()
      books.splice(batch * G.config['batch'], G.config['batch']).forEach(i => {
        $(i).find('input[type="checkbox"]').click()
      })
      window.sessionStorage.setItem('batch', batch * G.config['batch'] <= books.length ? batch + 1 : 0)
    }
  }).appendTo('.ehNavBar>div:nth-child(3)')
  $('<input type="button" value="Open" title="打开">').on('mousedown', e => {
    $('.ehBatchHover:visible').find(SEL.EH.search.galleryA).toArray().forEach(i => {
      openUrl(i.href + '#' + e.button)
    })
  }).appendTo('.ehNavBar>div:nth-child(3)')
}

function btnFake () { // 按钮 -> 下载空文档(信息页)
  $('<input type="button" value="Fake" title="' + htmlEscape('下载一个 <span class="ehHighlight">名称.cbz</span> 的空文档') + '">').on('mousedown', e => {
    saveAs2('', $(SEL.EH.info.title).text().trim() + '.cbz')
  }).appendTo('.ehNavBar>div:nth-child(3)')
}

function btnFake2 () { // 按钮 -> 下载空文档(搜索页)
  $('<input type="button" value="Fake" title="' + htmlEscape('下载一个 <span class="ehHighlight">名称.cbz</span> 的空文档') + '">').on('mousedown', async e => {
    for (let i of $('.ehBatchHover:visible').find(SEL.EH.search.galleryA).toArray()) {
      saveAs2('', i.textContent.trim() + '.cbz')
      await waitInMs(200)
    }
  }).appendTo('.ehNavBar>div:nth-child(3)')
}

function btnInfoText () { // 按钮 -> 下载info.txt(信息页)
  $('<input type="button" value="info.txt" title="' + htmlEscape('下载一个 <span class="ehHighlight">info.txt</span>') + '">').on('mousedown', () => {
    let infoStr = ''
    infoStr += $('#gn').text() + '\n'
    infoStr += $('#gj').text() + '\n'
    infoStr += window.location.href + '\n\n'

    infoStr += 'Category: ' + $('#gdc .cs').eq(0).text().trim() + '\n'
    infoStr += 'Uploader: ' + $('#gdn a').eq(0).text() + '\n'

    $('#gdd tr').toArray().forEach(i => {
      var c1 = $('.gdt1', i).eq(0).text()
      var c2 = $('.gdt2', i).eq(0).text()
      infoStr += c1 + ' ' + c2 + '\n'
    })

    infoStr += 'Rating: ' + unsafeWindow.average_rating + '\n\n'

    infoStr += 'Tags:\n'
    $('#taglist tr').toArray().forEach(i => {
      let tds = $('td', i)
      infoStr += '> ' + tds.eq(0).text() + ' '
      infoStr += $('a', tds.eq(1)).toArray().map(i => i.textContent).join(', ') + '\n'
    })
    infoStr += '\n'

    if ($('#comment_0')) infoStr += 'Uploader Comment:\n' + $('#comment_0').html().replace(/<br>|<br \/>/gi, '\n') + '\n\n'

    $('.gdtm img').toArray().forEach(i => {
      infoStr += '\n\nPage ' + i.alt + ': ' + $(i).parent().attr('href') + '\n'
      let title = $(i).attr('title') || $(i).attr('raw-title')
      infoStr += 'Image ' + i.alt + ': ' + title.match(/^Page \d+: (.*)$/)[1]
    })

    infoStr += '\n\nDownloaded at ' + new Date() + '\n\nGenerated by E-Hentai Downloader. https://github.com/ccloli/E-Hentai-Downloader'

    saveAs2(htmlUnescape(infoStr.replace(/\n/g, '\r\n')), 'info.txt')
  }).appendTo('.ehNavBar>div:nth-child(3)')
}

function btnSearch () { // 按钮 -> 搜索(信息页)
  let text = $(SEL.EH.info.title).text() || $(SEL.EH.info.titleJp).text()
  if (text === '') return
  $('<div class="ehSearch"></div>').insertAfter(SEL.EH.info.titleJp)
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
  $('<div class="btnSearch"></div>').attr('title', G.config['searchEventChs']).prependTo(SEL.EH.search.nameTd).on({
    contextmenu: () => false,
    mousedown: e => {
      let event = G.config['searchEvent'].split('|').filter(i => i.match(new RegExp(`^${e.button},`)))
      for (let i = 0; i < event.length; i++) {
        let arr = event[i].split(',')
        let keydown = arr[1] === '-1' ? true : e[['altKey', 'ctrlKey', 'shiftKey'][arr[1]]]
        if (keydown) {
          let name
          let gid = $(e.target).parentsUntil(SEL.EH.search.resultTbody).eq(-1).find(SEL.EH.search.galleryA).attr('href').match(/\/g\/(\d+)/)[1] * 1
          let tags = G.gmetadata.filter(i => i.gid === gid)[0].tags.map(i => i.match(/^\w+:/) ? i.replace(/^(\w+:)/, '$1"') + '"$' : `misc:"${i}"$`)
          if (arr[2] === '-1') {
            let order = window.prompt(tags.map((i, j) => `${j}: ${translateText(i)}`).join('\n'))
            if (order) {
              name = tags[order]
            } else {
              return
            }
          } else if (arr[2] === '0') {
            name = $(e.target).parentsUntil(SEL.EH.search.resultTbody).eq(-1).find(SEL.EH.search.galleryA).text()
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
  }).appendTo('.ehNavBar>div:nth-child(3)')
}

function btnTask2 () { // 按钮 -> 添加到下载任务(搜索页)
  $('<input type="button" value="Add Task" tooltip="' + htmlEscape('左键: 添加到下载任务<br>中键: 重置下载任务<br>右键: 从任务列表中删除') + '">').on({
    mousedown: e => {
      if (e.button === 0) {
        let task = GM_getValue('task', [])
        $('.ehBatchHover:visible').find(SEL.EH.search.galleryA).toArray().forEach(i => {
          if (!(task.includes(i.href))) task.push(i.href)
        })
        GM_setValue('task', task)
      } else if (e.button === 1) {
        GM_setValue('task', [])
      } else if (e.button === 2) {
        let task = GM_getValue('task', [])
        $('.ehBatchHover:visible').find(SEL.EH.search.galleryA).toArray().forEach(i => {
          if (task.includes(i.href)) task.splice(task.indexOf(i.href), 1)
        })
        GM_setValue('task', task)
      }
    },
    mouseenter: e => {
      let task = GM_getValue('task', [])
      $(e.target).attr('title', '当前任务列表: ' + task.length + '<br> ' + task.join('<br> '))
    }
  }).appendTo('.ehNavBar>div:nth-child(3)')
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
  if (delta <= 1000 * 60 * 60 * 24 * 7 * 2) text = '<span class="ehHighlight">' + text + '</span>'
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

function changeName (e) { // 修改本子标题（删除集会名、替换其中的罗马数字）
  // test https://exhentai.org/?page=1&f_search=%22Fugudoku%22+%22Katou+Fuguo%22+%22Surudake%22&f_sh=on
  let infoGroup = ['[]', '()', '{}', '【】']
  let removeOtherInfo = (text, reverse = false) => {
    if (reverse) text = text.split('').reverse().join('')
    let group = reverse ? infoGroup.map(i => i.split('').reverse().join('')) : infoGroup
    group = group.map(i => i.split('').map(j => reEscape(j)))
    let re = group.map(i => `${i[0]}.*?${i[1]}`).join('|')
    re = new RegExp(`^(${re})`)
    let matched = text.match(re)
    while (matched) {
      text = text.replace(re, '').trim()
      matched = text.match(re)
    }
    if (reverse) text = text.split('').reverse().join('')
    return text
  }

  $(e).toArray().forEach(i => {
    let title = fullWidth2Half(i.textContent).replace(/^\(.*?\)( |)/, '').replace(/[\\/:*?"<>|]/g, '-').replace(/\s+/, ' ').replace(G.emojiRegExp, '').trim()
    i.textContent = title

    // 去除标题中首尾的信息，如作者，组织，原作，语言，翻译组
    let titleJp = G.infoPage ? $(SEL.EH.info.titleJp).text() : G.gmetadata.filter(j => j.gid === i.href.match(/g\/(\d+)\//)[1] * 1)[0].title_jpn
    let mainTitleJp = removeOtherInfo(titleJp)
    mainTitleJp = removeOtherInfo(mainTitleJp, true)

    let digitalRomajiJpRe = Object.values(G.digitalRomaji).map(i => i[1].join('|')).join('|')
    digitalRomajiJpRe = new RegExp(`(${digitalRomajiJpRe})(\\W+|$)`)

    if (!mainTitleJp.match(digitalRomajiJpRe)) return

    let mainTitle = removeOtherInfo(title)
    mainTitle = removeOtherInfo(mainTitle, true)
    mainTitle = mainTitle.replace(/[|~].*/, '').replace(/\s+/, ' ').trim()

    let index = title.indexOf(mainTitle)
    let prefix = title.substr(0, index).trim()
    let suffix = title.substr(index + mainTitle.length).trim()

    let mianTitleArr = mainTitle.split(/\s+/).reverse()
    for (let i = 0; i < mianTitleArr.length; i++) {
      let text = mianTitleArr[i]

      let re = G.digitalRomaji[10][0].join('|')
      re = new RegExp(`(${re})`, 'i')
      if (text.match(re)) {
        let arr = text.split(re).filter(i => i)
        if (arr.length > 1) {
          let digitalRomajiRe = Object.values(G.digitalRomaji).map(i => i[0].join('|')).join('|')
          digitalRomajiRe = new RegExp(`(\\W+|^)(${digitalRomajiRe})(\\W+|$)`, 'i')
          if (arr.every(j => j.match(digitalRomajiRe))) {
            mianTitleArr.splice(i, 1, ...arr.reverse())
            i--
            continue
          }
        }
      }

      let matched = false
      for (let j in G.digitalRomaji) {
        let re = G.digitalRomaji[j][0].join('|')
        re = new RegExp(`^(${re})(\\W+|$)`, 'i')
        if (!text.match(re)) continue
        matched = true
        mianTitleArr[i] = text.replace(re, G.digitalRomaji[j][1][0] + '$2')

        if (i > 0 && mianTitleArr[i].match(/^\d+$/) && mianTitleArr[i - 1].match(/^(\d+)(\W+)$/)) {
          let number1 = mianTitleArr[i] * 1
          let re0 = mianTitleArr[i - 1].match(/^(\d+)(\W+)$/)
          let number0 = re0[1] * 1
          mianTitleArr[i - 1] = number1 < 10 && number0 < 10 ? number1.toString() + number0.toString() : (number1 + number0).toString()
          mianTitleArr[i - 1] += re0[2]
          mianTitleArr.splice(i, 1)
          i--
        }
        break
      }
      if (!matched) break
    }
    mainTitle = mianTitleArr.reverse().join(' ')

    i.textContent = `${prefix} ${mainTitle} ${suffix}`
  })
}

function checkExist () { // 检查本地是否存在
  if (G.config['hideExist']) {
    $(`<input class="ehHideExist" type="button" status="Hide" value="Hide Exist: 0">`).on({
      click: e => {
        let status = $(e.target).attr('status')
        let ele = $(SEL.EH.search.resultTr).filter(':has(.ehExist[name="force"],.ehExist[name="force1"])')
        ele.toggle(status === 'Hide')
        let now = status === 'Hide' ? 'Show' : 'Hide'
        $(e.target).attr('status', now)
        $(e.target).val(`${now} Exist: ${ele.length}`)
      },
      dblclick: e => {
        let status = $(e.target).attr('status')
        let ele = $(SEL.EH.search.resultTr).filter(':has(.ehExist[name="force"],.ehExist[name="force1"])')
        ele.toggle($(e.target).attr('status') !== 'Hide')
        $(e.target).val(`${status} Exist: ${ele.length}`)
      }
    }).appendTo(SEL.EH.search.resultTotal)
  }
  $('<div class="ehExistContainer"></div>').prependTo('.ehContainer')
  $('<input type="button" value="Check Exist" name="checkExist" title="只检查可见的，且之前检查无结果">').on('click', async (e) => {
    let langRE = /\[(Chinese|English|Digital)\].*/gi

    $(e.target).val('Checking').prop('disabled', true)
    let lst = $(SEL.EH.search.resultTr).filter(':visible').not(':has(.ehExist[name^="force"])').find(SEL.EH.search.galleryA).toArray()
    let name = {}
    lst.forEach((i, j) => {
      if (G.config['checkExistName2']) {
        name[j] = i.textContent.replace(G.uselessStrRE, '').replace(/\|.*/g, '').replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '').trim()
      } else {
        let arr = i.textContent.replace(/\|.*?([([{【［（]|$)/, '$1').replace(/[\\/:*?"<>|]/g, '-').replace(langRE, '').split(/[[\](){}【】［］（）～~]+/).map(i => i.trim().replace(/\.$/, '').trim()).filter(i => i)
        name[j] = arr.join()
        if (name[j] === '') name[j] = i.textContent.replace(G.uselessStrRE, '').replace(/\|.*/g, '').replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '').trim()
      }
    })
    try {
      let res = await xhrSync(G.config['checkExistSever'], 'names=' + encodeURIComponent(JSON.stringify(name)), {
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
          let fileSize = k.size
          let fileName = k.name
          let noExt = fileName.replace(/\.(zip|cbz|rar|cbr)$/, '').trim()
          let noExtRE = new RegExp('^' + reEscape(noExt).replace(/_/g, '.') + '$')
          let noLang = noExt.replace(langRE, '').trim()
          let noLangRE = new RegExp('^' + reEscape(noLang).replace(/_/g, '.') + '$')
          let p = $(i).parent().find('.ehExistContainer')
          let _name = (noExtRE.exec(name) || noExtRE.exec(name2)) ? 'force'
            : noExt.match(/\[Incomplete\]/i) ? 'incomplete'
              : (noLangRE.exec(name3) || noLangRE.exec(name4)) ? 'force1' : ''

          let diffThis = diff(name, noExt)
          let similar = _name === 'force' ? 0 : diffThis.reduce((total, now) => total + (now[0] === 0 ? 0 : now[1].length), 0)

          let diffFlag = 0
          let diffHTML = [['Remote: '], [' Local: ']]

          for (let i = 0; i < diffThis.length; i++) {
            let arr = diffThis[i]
            if (arr[0] === 0) {
              if (diffFlag) diffHTML[diffFlag > 0 ? 1 : 0].push(`<span class="ehDiffNone">${' '.repeat(Math.abs(diffFlag))}</span>`)
              diffFlag = 0
              diffHTML[0].push(arr[1])
              diffHTML[1].push(arr[1])
            } else if (arr[0] === -1) {
              diffHTML[0].push(`<span class="ehDiffDel">${arr[1]}</span>`)
              diffFlag += getStringSize(arr[1])
            } else if (arr[0] === 1) {
              diffHTML[1].push(`<span class="ehDiffAdd">${arr[1]}</span>`)
              diffFlag -= getStringSize(arr[1])
            }
          }
          diffHTML = '<br><span class="ehPreLike">' + diffHTML.map(i => i.join('')).join('<br>') + '</span>'
          if (noExt === name) diffHTML = ''

          if (p.find(`[copy="${noExt}"][fileSize="${fileSize}"]`).length === 0) $(`<span class="ehExist" fileSize="${fileSize}" name="${_name}" copy="${noExt}" similar="${similar}" tooltip="EditDistance: ${similar}${htmlEscape(diffHTML)}"></span>`).appendTo(p)
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

    if (G.config['hideExist']) {
      $('.ehHideExist').dblclick()
    }
  }).appendTo('.ehNavBar>div:nth-child(2)')
}

function checkForNew () { // 检查有无新本子
  let searchKey
  $('<div><a href="javascript:;">Add to CheckList</a></div>').on({
    contextmenu: () => false,
    mousedown: e => {
      e.preventDefault()
      let keyword = $(SEL.EH.search.keyword).val()
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
        result: $(SEL.EH.search.resultTotal).text().match(SEL.EH.search.resultTotalMatch) ? $(SEL.EH.search.resultTotal).text().match(SEL.EH.search.resultTotalMatch)[1].replace(/,/g, '') * 1 : 0
      }
      if (nameInput || name !== translateText(keyword)) list[keyword].name = nameInput || name
      GM_setValue('checkList', sortObj(list, 'time'))
    }
  }).appendTo(SEL.EH.common.navBar)
  $('<div><a href="javascript:;">Show CheckList</a></div>').on('click', e => {
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
      $(SEL.EH.common.navBar).find('a:contains("Show CheckList")').click()
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
  }).appendTo(SEL.EH.common.navBar)
  let keyword = $(SEL.EH.search.keyword).val()
  if (!keyword) return
  let list = GM_getValue('checkList', {})
  if (!(keyword in list)) return
  let info = list[keyword]
  let tr = $(SEL.EH.search.resultTrGt0).toArray()
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

  let ele = $(`<tr class="ehCheckContainer gtr${(i === tr.length ? i - 1 : i) % 2 ? '0' : '1'}"><td colspan="${$(SEL.EH.search.resultTr0).find('th').length}">Name: ${info.name || translateText(keyword)}<br>Last Check Time: <time title="${timeText}" datetime="${info.time}">${calcRelativeTime(info.time)}</time><br>Results: ${info.result}<br></td></tr>`)
  if (i === tr.length) {
    ele.insertAfter(tr[i - 1])
  } else {
    ele.insertBefore(tr[i])
  }

  $('<input type="button" value="Delete" title="移除该项">').click(() => {
    if (window.confirm('确认移除: \n' + keyword)) {
      let list = GM_getValue('checkList', {})
      delete list[keyword]
      GM_setValue('checkList', list)
    }
  }).appendTo('.ehCheckContainer>td')
  let result = $(SEL.EH.search.resultTotal).text().match(SEL.EH.search.resultTotalMatch) ? $(SEL.EH.search.resultTotal).text().match(SEL.EH.search.resultTotalMatch)[1].replace(/,/g, '') * 1 : 0
  if (result - info.result <= G.config['autoUpdateCheck'] && $(SEL.EH.common.pageCur).text() === '1') {
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
  let s = G.config['sizeS']
  let d = G.config['sizeD']
  let imageSize = await getEConfig('xr')
  let numD = 0 // 双页
  $(SEL.EH.info.previewImg).toArray().forEach(function (i, j) {
    if ($(i).is($('.ehIgnore img'))) return
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
      let rawBtn = $(SEL.EHD.download)
      rawBtn.clone(false).click(async e => {
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

function copyInfo () { // 复制信息
  if ($(SEL.EH.info.title).text().match(/\[(.*?)\]/) && $(SEL.EH.info.titleJp).text().match(/\[(.*?)\]/)) { // artist
    var name = $(SEL.EH.info.title).text().match(/\[(.*?)\]/)[1]
    var nameJpn = $(SEL.EH.info.titleJp).text().match(/\[(.*?)\]/)[1]
    if (name.match(/\(.*?\)/)) name = name.match(/\((.*?)\)/)[1]
    if (nameJpn.match(/\(.*?\)/)) nameJpn = nameJpn.match(/\((.*?)\)/)[1]
    $(`<input type="button" value="[${name}]${nameJpn}" copy="[${name}]${nameJpn}">`).appendTo('.ehNavBar>div:nth-child(1)')
  }
  if ($(SEL.EH.info.tagParody).length > 0) { // parody
    let info = $(SEL.EH.info.tagParody).attr('id').split(/ta_|:/)
    let parody = findData(info[1], info[2], true)
    if (Object.keys(parody).length) {
      parody = parody.cname
    } else {
      parody = $(SEL.EH.info.titleJp).text().match(/\(.*?\)/g) ? $(SEL.EH.info.titleJp).text().match(/\(.*?\)/g) : $(SEL.EH.info.title).text().match(/\(.*?\)/g)
      if (parody) {
        parody = parody[parody.length - 1].match(/\((.*?)\)/)[1]
      } else {
        return
      }
    }
    let parodyKeyword = $(SEL.EH.info.tagParody).text().replace(/ \| .*/, '')
    $(`<input type="button" value="【${parody}】${parodyKeyword}" copy="【${parody}】${parodyKeyword}">`).appendTo('.ehNavBar>div:nth-child(1)')
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
    'searchArguments': '/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_imageset=1&f_cosplay=1&f_search={q}&f_sh=on',
    'notification': '3',
    'changeName': true,

    // 搜索页
    'preloadPaneImage': true,
    'languageCode': true,
    'searchEvent': '0,-1,0,1|1,-1,-1,1|2,-1,1,1',
    'searchEventChs': '鼠标左键 + 任意按键 -> 主要名称 + chinese<br>鼠标中键 + 任意按键 -> 自行选择 + chinese<br>鼠标右键 + 任意按键 -> 作者或组织(顺位) + chinese',
    'checkExist': true,
    'checkExistAtStart': true,
    'checkExistName2': false,
    'checkExistSever': 'http://127.0.0.1:3000/',
    'hideExist': true,
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
    'fixEHDCounter': true,
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

function downloadAdd (id) {
  if (G.downloading) return
  G.downloading = true
  let downloading = GM_getValue('downloading', [])
  downloading.push(id)
  GM_setValue('downloading', downloading)
}

function downloadRemove (id) {
  if (!G.downloading) return
  G.downloading = false
  let downloading = GM_getValue('downloading', [])
  if (downloading.includes(id)) {
    downloading.splice(downloading.indexOf(id), 1)
    GM_setValue('downloading', downloading)
  }
}

function findData (main, sub, textOnly = true) {
  let data = G.EHT.filter(i => i.namespace === main)
  if (data.length === 0) return {}
  if (sub === undefined) {
    return {
      name: main,
      cname: data[0].frontMatters.name,
      info: data[0].frontMatters.description
    }
  }
  let data1 = data[0].data[sub.replace(/_/g, ' ')]
  if (!data1) {
    if (sub.match(' \\| ')) {
      let arr = sub.split(' | ').map(i => i.replace(/_/g, ' '))
      data1 = data[0].data[arr[0]]
    }
  }
  if (data1) {
    let info = data1.intro
    let cname = data1.name
    if (textOnly) {
      info = info.replace(/!\[(.*?)\]\((.*?)\)/g, '').replace(G.emojiRegExp, '')
      cname = cname.replace(/!\[(.*?)\]\((.*?)\)/g, '').replace(G.emojiRegExp, '')
    }
    return {
      name: main === 'misc' ? sub : main + ':' + sub,
      cname: cname,
      info: info
    }
  } else {
    return {}
  }
}

async function getEConfig (key) { // 获取EH设置
  let res = await xhrSync('/uconfig.php')
  let uconfig = $(SEL.EH.setting.form, res.response).serialize()
  return key ? uconfig.match(new RegExp(key + '=(.*?)(&|$)'))[1] : uconfig
}

async function getInfo () { // 获取信息
  if (!$(SEL.EH.search.resultTable).length) return
  let gidlist = $(SEL.EH.search.galleryA).toArray().map(i => {
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
  let tags = GM_getValue('tagAction', {})
  $(SEL.EH.search.galleryA).toArray().forEach(i => {
    let info = G.gmetadata.filter(j => j.gid === i.href.split('/')[4] * 1)[0]
    if (!info) return
    let container = $(i).parentsUntil(SEL.EH.search.resultTbody).eq(-1).find('.ehContainer')
    if (info.rating * 1 < G.config['lowRating']) $('<span class="ehTagNotice" name="Unlike" title="低评分">低评分</span>').appendTo(container)
    if (info.filecount * 1 < G.config['fewPages']) $('<span class="ehTagNotice" name="Unlike" title="页面少">页面少</span>').appendTo(container)

    info.tags.filter(j => j in tags).forEach(j => {
      let tagArr = j.split(':')
      let main = tagArr.length === 1 ? 'misc' : tagArr[0]
      let sub = tagArr[tagArr.length - 1]
      let data = findData(main, sub, true)
      let tagChs = j
      let tagInfo = j
      if (Object.keys(data).length) {
        tagChs = (main === 'male' ? '♂' : main === 'female' ? '♀' : main[0]) + ':' + data.cname
        tagInfo += '<br>' + data.info
      }
      $(`<span class="ehTagNotice" name="${tags[j]}" title="${tagInfo}">${tagChs}</span>`).appendTo(container)
    })
  })
  if (!G.config['notHideUnlike']) {
    let ele = $(SEL.EH.search.resultTr).filter(':has(.ehTagNotice[name="Unlike"])')
    if (G.config['alwaysShowLike']) ele = ele.not(':has(.ehTagNotice[name="Unlike"]):has(.ehTagNotice[name="Like"])')
    let length = ele.length
    ele.hide()
    $(`<input type="button" status="Hide" value="Hide Tag: ${length}">`).on('click', function (e) {
      let status = $(e.target).attr('status')
      ele.toggle(status === 'Hide')
      let now = status === 'Hide' ? 'Show' : 'Hide'
      $(e.target).attr('status', now)
      $(e.target).val(`${now} Tag: ${length}`)
    }).appendTo(SEL.EH.search.resultTotal)
  }
}

function highlightBlacklist () { // 高亮黑名单相关的画廊(通用)
  let blacklist = GM_getValue('blacklist', [])
  $(SEL.EH.search.galleryA).toArray().concat($(SEL.EH.info.title).toArray(), $(SEL.EH.info.titleJp).toArray()).forEach(i => {
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

function introPic () { // 宣传图
  let toggleIgnore = e => {
    let introPic = GM_getValue('introPic', [])
    introPic = arrUnique(introPic)
    let id = $(e.target).prev().attr('href').split('/')[4]
    if ($(e.target).attr('on') === 'true') {
      introPic.push(id)
    } else {
      introPic.splice(introPic.indexOf(id), 1)
    }
    $(e.target).parent().toggleClass('ehIgnore')
    $(e.target).attr('on', !introPic.includes(id))
    GM_setValue('introPic', introPic)
  }
  let introPic = GM_getValue('introPic', [])
  $(SEL.EH.info.previewA).toArray().forEach(i => {
    let url = i.href
    let id = url.split('/')[4]
    let name = $(i).find('img:eq(0)').attr('title').match(/Page \d+:\s+(.*)/)[1]
    let isIntroPic = introPic.includes(id)
    let btnBlock = $(`<a type="button" name="intro" href="javascript:;" on="true" file="${name}"></a>`).on('click', toggleIgnore).appendTo(i.parentNode)

    if (isIntroPic || G.introPicName.some(j => name.match(j))) {
      $(btnBlock).attr('on', 'false')
      $(i).parent().addClass('ehIgnore')
      if (isIntroPic) { // 收集数据
        let introPicStat = GM_getValue('introPicStat', {})
        introPicStat[id] = id in introPicStat ? introPicStat[id] + 1 : 1
        GM_setValue('introPicStat', introPicStat)

        let introPicUrl = GM_getValue('introPicUrl', {})
        introPicUrl[id] = url
        GM_setValue('introPicUrl', introPicUrl)
      }
    }
  })
}

function jumpHost () { // 里站跳转
  let l = window.location
  if (G.infoPage) {
    if (G.config['ex2eh']) {
      let gid = l.href.split('/')[4]
      let jump = GM_getValue('jump', [])
      jump = arrUnique(jump)
      if (l.host === 'exhentai.org') { // 里站
        if (!jump.includes(gid)) { // 尝试跳转
          if (!SEL.EH.info.tagBanned.some(i => document.getElementById(i))) {
            l.assign(l.href.replace('//exhentai.org', '//e-hentai.org'))
            return true
          }
        } else {
          jump.splice(jump.indexOf(gid), 1)
          GM_setValue('jump', jump)
        }
      } else if (l.host === 'e-hentai.org') { // 表站
        if (document.querySelector(SEL.EH.info.deleted)) { // 不存在则返回
          jump.push(gid)
          GM_setValue('jump', jump)
          return true
        }
      }
    }
  } else {
    if (G.config['ex2eh'] && l.href === 'https://e-hentai.org/' && document.referrer && document.referrer.match(SEL.EH.info.urlMatch) && GM_getValue('jump', []).includes(document.referrer.split('/')[4])) {
      l.assign(document.referrer.replace('//e-hentai.org', '//exhentai.org'))
      return true
    } else if (G.config['eh2ex'] && l.host === 'e-hentai.org' && $(SEL.EH.search.keyword).val()) {
      l.assign(l.href.replace('//e-hentai.org', '//exhentai.org'))
      return true
    }
  }
}

function languageCode () { // 显示iso语言代码
  let value = $(SEL.EH.search.keyword).val()
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
  $(SEL.EH.search.galleryA).toArray().forEach(i => {
    let info = G.gmetadata.filter(j => j.gid === i.href.split('/')[4] * 1)[0]
    if (!info) return
    let langs = info.tags.filter(i => i.match(/^language:/))
    let container = $(i).parentsUntil(SEL.EH.search.resultTbody).eq(-1).find('.ehContainer')
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
  $(SEL.EH.search.resultTable).on('contextmenu', e => {
    if ($(e.target).is(SEL.EH.search.galleryA)) {
      e.preventDefault()
      let target = e.target
      openUrl(target.href + '#2')
    }
  })
}

async function saveAs (text, name) {
  downloadRemove(SEL.EH.info.galleryId)
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
        }).then(async data => {
          saveAs2(data, name, text.type)
          window.onbeforeunload = null
          await waitInMs(500)
          taskRemove(SEL.EH.info.galleryId)
          await waitInMs(200)
          window.close()
        })
      }
    } else {
      saveAs2(text, name, text.type)
      window.onbeforeunload = null
      await waitInMs(500)
      taskRemove(SEL.EH.info.galleryId)
      await waitInMs(200)
      window.close()
    }
  } else {
    saveAs2(text, name)
  }
}

function saveAs2 (content, name, type = 'application/octet-stream;charset=utf-8') {
  name = name.replace(/[\\/:*?"<>|]/g, '-').replace(/\u{2139}|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|\u{2328}|\u{23CF}|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|\u{24C2}|[\u{25AA}-\u{25AB}]|\u{25B6}|\u{25C0}|[\u{25FB}-\u{25FE}]|[\u{2600}-\u{2604}]|\u{260E}|\u{2611}|[\u{2614}-\u{2615}]|\u{2618}|\u{261D}|\u{2620}|[\u{2622}-\u{2623}]|\u{2626}|\u{262A}|[\u{262E}-\u{262F}]|[\u{2638}-\u{263A}]|[\u{2648}-\u{2653}]|\u{2660}|\u{2663}|\u{2666}|\u{2668}|\u{267B}|\u{267F}|[\u{2692}-\u{2697}]|\u{2699}|[\u{269B}-\u{269C}]|[\u{26A0}-\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26B0}-\u{26B1}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|\u{26C8}|\u{26CE}|\u{26CF}|\u{26D1}|[\u{26D3}-\u{26D4}]|[\u{26E9}-\u{26EA}]|[\u{26F0}-\u{26F5}]|[\u{26F7}-\u{26FA}]|\u{26FD}|\u{2702}|\u{2705}|[\u{2708}-\u{2709}]|[\u{270A}-\u{270B}]|[\u{270C}-\u{270D}]|\u{270F}|\u{2712}|\u{2714}|\u{2716}|\u{271D}|\u{2721}|\u{2728}|[\u{2733}-\u{2734}]|\u{2744}|\u{2747}|\u{274C}|\u{274E}|[\u{2753}-\u{2755}]|\u{2757}|\u{2763}|[\u{2795}-\u{2797}]|\u{27A1}|\u{27B0}|\u{27BF}|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|\u{2B50}|\u{2B55}|\u{3030}|\u{303D}|\u{3297}|\u{3299}|\u{1F004}|\u{1F0CF}|[\u{1F170}-\u{1F171}]|\u{1F17E}|\u{1F17F}|\u{1F18E}|[\u{1F191}-\u{1F19A}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F201}-\u{1F202}]|\u{1F21A}|\u{1F22F}|[\u{1F232}-\u{1F23A}]|[\u{1F250}-\u{1F251}]|[\u{1F300}-\u{1F320}]|\u{1F321}|[\u{1F324}-\u{1F32C}]|[\u{1F32D}-\u{1F32F}]|[\u{1F330}-\u{1F335}]|\u{1F336}|[\u{1F337}-\u{1F37C}]|\u{1F37D}|[\u{1F37E}-\u{1F37F}]|[\u{1F380}-\u{1F393}]|[\u{1F396}-\u{1F397}]|[\u{1F399}-\u{1F39B}]|[\u{1F39E}-\u{1F39F}]|[\u{1F3A0}-\u{1F3C4}]|\u{1F3C5}|[\u{1F3C6}-\u{1F3CA}]|[\u{1F3CB}-\u{1F3CE}]|[\u{1F3CF}-\u{1F3D3}]|[\u{1F3D4}-\u{1F3DF}]|[\u{1F3E0}-\u{1F3F0}]|[\u{1F3F3}-\u{1F3F5}]|\u{1F3F7}|[\u{1F3F8}-\u{1F3FF}]|[\u{1F400}-\u{1F43E}]|\u{1F43F}|\u{1F440}|\u{1F441}|[\u{1F442}-\u{1F4F7}]|\u{1F4F8}|[\u{1F4F9}-\u{1F4FC}]|\u{1F4FD}|\u{1F4FF}|[\u{1F500}-\u{1F53D}]|[\u{1F549}-\u{1F54A}]|[\u{1F54B}-\u{1F54E}]|[\u{1F550}-\u{1F567}]|[\u{1F56F}-\u{1F570}]|[\u{1F573}-\u{1F579}]|\u{1F57A}|\u{1F587}|[\u{1F58A}-\u{1F58D}]|\u{1F590}|[\u{1F595}-\u{1F596}]|\u{1F5A4}|\u{1F5A5}|\u{1F5A8}|[\u{1F5B1}-\u{1F5B2}]|\u{1F5BC}|[\u{1F5C2}-\u{1F5C4}]|[\u{1F5D1}-\u{1F5D3}]|[\u{1F5DC}-\u{1F5DE}]|\u{1F5E1}|\u{1F5E3}|\u{1F5E8}|\u{1F5EF}|\u{1F5F3}|\u{1F5FA}|[\u{1F5FB}-\u{1F5FF}]|\u{1F600}|[\u{1F601}-\u{1F610}]|\u{1F611}|[\u{1F612}-\u{1F614}]|\u{1F615}|\u{1F616}|\u{1F617}|\u{1F618}|\u{1F619}|\u{1F61A}|\u{1F61B}|[\u{1F61C}-\u{1F61E}]|\u{1F61F}|[\u{1F620}-\u{1F625}]|[\u{1F626}-\u{1F627}]|[\u{1F628}-\u{1F62B}]|\u{1F62C}|\u{1F62D}|[\u{1F62E}-\u{1F62F}]|[\u{1F630}-\u{1F633}]|\u{1F634}|[\u{1F635}-\u{1F640}]|[\u{1F641}-\u{1F642}]|[\u{1F643}-\u{1F644}]|[\u{1F645}-\u{1F64F}]|[\u{1F680}-\u{1F6C5}]|[\u{1F6CB}-\u{1F6CF}]|\u{1F6D0}|[\u{1F6D1}-\u{1F6D2}]|[\u{1F6E0}-\u{1F6E5}]|\u{1F6E9}|[\u{1F6EB}-\u{1F6EC}]|\u{1F6F0}|\u{1F6F3}|[\u{1F6F4}-\u{1F6F6}]|[\u{1F6F7}-\u{1F6F8}]|[\u{1F910}-\u{1F918}]|[\u{1F919}-\u{1F91E}]|\u{1F91F}|[\u{1F920}-\u{1F927}]|[\u{1F928}-\u{1F92F}]|\u{1F930}|[\u{1F931}-\u{1F932}]|[\u{1F933}-\u{1F93A}]|[\u{1F93C}-\u{1F93E}]|[\u{1F940}-\u{1F945}]|[\u{1F947}-\u{1F94B}]|\u{1F94C}|[\u{1F950}-\u{1F95E}]|[\u{1F95F}-\u{1F96B}]|[\u{1F980}-\u{1F984}]|[\u{1F985}-\u{1F991}]|[\u{1F992}-\u{1F997}]|\u{1F9C0}|[\u{1F9D0}-\u{1F9E6}]|❤/gu, '')
  let blob = new window.Blob([content], {
    type: type
  })
  $(`<a href="${URL.createObjectURL(blob)}" download="${name}"></a>`).appendTo('body').hide()[0].click()
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
    saveAs2(text, document.title + fileType)
  }).prependTo('.ehNavBar>div:nth-child(3)')
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
  let navBar = $(SEL.EH.common.navBar).clone().empty().insertAfter(SEL.EH.common.navBar)
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
  if ($(SEL.EH.search.keyword).length) {
    keyword = $(SEL.EH.search.keyword).val()
    keywordJ = $(SEL.EH.search.keyword).val()
  } else {
    keyword = $(SEL.EH.info.title).text()
    keywordJ = $(SEL.EH.info.titleJp).text()
  }
  for (let i in sites) {
    let url
    if ('url' in sites[i]) {
      url = sites[i].url instanceof Function ? sites[i].url(keyword) : sites[i].url.replace(/{q}/g, keyword)
    } else if ('urlJ' in sites[i]) {
      url = sites[i].urlJ instanceof Function ? sites[i].urlJ(keywordJ) : sites[i].urlJ.replace(/{q}/g, keywordJ)
    }
    $('<div></div>').append($(`<a target="_blank"><img class="icon" src="${sites[i].icon || 'https://icons.duckduckgo.com/ip2/' + i}.ico"></img>${i}</a>`).attr('href', url)).appendTo(navBar)
  }
}

async function showAllThumb () { // 显示所有预览页
  let pages = $(SEL.EH.common.pages).toArray()
  if (pages.length <= 1) return
  $('<div class="gdtContainer"></div>').html('<div></div>'.repeat(pages.length)).insertBefore(SEL.EH.info.previewContainer)
  $(SEL.EH.info.previewContainer).appendTo(`.gdtContainer>div:nth-child(${$(SEL.EH.common.pageCur).text()})`)
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].pathname === window.location.pathname && pages[i].search === window.location.search) continue
    let res = await xhrSync(pages[i].href)
    let doc = document.createElement('html')
    doc.innerHTML = res.response
    $(SEL.EH.info.previewContainer, doc).appendTo(`.gdtContainer>div:nth-child(${$(SEL.EH.common.pageCur, doc).text()})`)
  }
}

function showConfig () { // 显示设置
  $('<div><a href="javascript:;">[EH]Enhance Config</a></div>').on('click', function (e) {
    if ($('.ehConfig').length) {
      $('.ehConfig').toggle()
      return
    }
    let _html = [
      GM_info.script.name + '<span class="ehHighlight">v' + GM_info.script.version + '</span> <a href="' + GM_info.script.namespace + '" target="_blank">@' + (GM_info.script.author || 'dodying') + '</a>',
      '',
      '<input type="button" name="exportValues" value="Export Values" title="导出脚本储存的信息<br>(除EHT与EHD的数据)"> <input type="file" id="selectFileConfig" name="selectFile" accept=".json"><input type="button" name="importValues" value="Select File and Inmport Values" title="选择文件，并导入脚本储存的信息">',
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
      '搜索参数: <input name="ehConfig_searchArguments" title="' + htmlEscape('以<span class="ehHighlight">{q}</span>代替搜索关键词') + '" type="text" placeholder="/?f_search={q}&f_sh=on" min="1">',
      '通知显示方式: <select name="ehConfig_notification"><option value="0">Web API: Notification</option><option value="1">GM_notification</option><option value="2">window.alert</option><option value="3">页面元素</option><option value="-1">不显示</option></select>',
      '<div class="ehNew"></div><label for="ehConfig_changeName"><input type="checkbox" id="ehConfig_changeName">标题: 删除集会名、替换其中的罗马数字</label>',
      '',
      // 搜索页
      '<span class="ehHighlight">搜索页:</span>',
      '<label for="ehConfig_preloadPaneImage"><input type="checkbox" id="ehConfig_preloadPaneImage">自动载入预览图</label>; <label for="ehConfig_languageCode"><input type="checkbox" id="ehConfig_languageCode">显示ISO语言代码</label>',
      '搜索按钮事件: <input name="ehConfig_searchEvent" title="' + htmlEscape('事件格式: 鼠标按键,键盘按键,搜索文本,是否中文<br>多个事件以<span class="ehHighlight">|</span>分割<br>鼠标按键:<ul><li>0 -> 左键</li><li>1 -> 中键</li><li>2 -> 右键</li></ul>键盘按键:<ul><li>-1 -> 任意</li><li>0 -> altKey</li><li>1 -> ctrlKey</li><li>2 -> shiftKey</li></ul>搜索事件:<ul><li>-1 -> 自行选择</li><li>0 -> 主要名称</li><li>1 -> 作者或组织(顺位)</li></ul>是否中文:<ul><li>0 -> 否</li><li>1 -> 是</li></ul>') + '" type="text" placeholder="0,-1,0,0|2,-1,0,1"><input name="ehConfig_searchEventChs" type="hidden">',
      '<label for="ehConfig_checkExist"><input type="checkbox" id="ehConfig_checkExist">显示按钮: 检查本地是否存在 (需要后台运行<a href="https://github.com/dodying/Nodejs/blob/master/checkExistSever/index.js" target="_blank">checkExistSever</a>, <a href="https://www.voidtools.com/downloads/#downloads" target="_blank">Everything</a>, 以及下载<a href="https://www.voidtools.com/downloads/#cli" target="_blank">Everything CLI</a>)</label>',
      '检查本地是否存在: <label for="ehConfig_checkExistAtStart"><input type="checkbox" id="ehConfig_checkExistAtStart">页面载入后检查一次</label>; <label for="ehConfig_checkExistName2" title="去除集会号/作者/原作名/翻译组织/语言等"><input type="checkbox" id="ehConfig_checkExistName2">只搜索主要名称</label>; <label for="ehConfig_hideExist" title="只有完全匹配的本子才会被隐藏 (汉化组不同也视为完全相同)"><input type="checkbox" id="ehConfig_hideExist">隐藏已存在的本子</label>; 本地服务器: <input name="ehConfig_checkExistSever" type="text" placeholder="http://127.0.0.1:3000/" min="0">',
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
      '下载-EHD相关: <label for="ehConfig_enableEHD"><input type="checkbox" id="ehConfig_enableEHD">启用内置 [E-Hentai-Downloader]</label>; <label for="ehConfig_recordEHDUrl"><input type="checkbox" id="ehConfig_recordEHDUrl">记录内置EHD下载失败的链接</label>; <label for="ehConfig_fixEHDCounter"><input type="checkbox" id="ehConfig_fixEHDCounter">尝试修复EHD下载时计数错误</label>',
      '下载-EHD相关-链接相关: 导出格式: <input name="ehConfig_exportUrlFormat" title="' + htmlEscape('以<span class="ehHighlight">{url}</span>表示搜索链接<br>以<span class="ehHighlight">{cr}</span>表示\\r<br>以<span class="ehHighlight">{lf}</span>表示\\n') + '" type="text" placeholder="{url} +Proxy{cr}{lf}"> <input type="button" name="exportUrl" value="Copy URL" title="复制链接"> <input type="button" name="emptyUrl" value="Empty URL" title="清空链接">',
      '<label for="ehConfig_tagTranslateImage"><input type="checkbox" id="ehConfig_tagTranslateImage">标签翻译显示图片</label>; <label for="ehConfig_showAllThumb"><input type="checkbox" id="ehConfig_showAllThumb">显示所有预览图</label>',
      '<label for="ehConfig_enableChangeSize" title="' + htmlEscape('当大图(双页)尺寸与小图(单页)尺寸相同时，失效') + '"><input type="checkbox" id="ehConfig_enableChangeSize">启用自动调整图片尺寸</label>',
      '调整图片尺寸: 大图(双页)宽高比: <input name="ehConfig_rateD" type="number" placeholder="1.1" step="0.1">; 其他默认视为小图(单页)',
      '调整图片尺寸: 大图(双页)尺寸: <select name="ehConfig_sizeD"><option value="0">Auto</option><option value="5">2400x</option><option value="4">1600x</option><option value="3">1280x</option><option value="2">980x</option><option value="1">780x</option></select>; 小图(单页)尺寸: <select name="ehConfig_sizeS"><option value="0">Auto</option><option value="5">2400x</option><option value="4">1600x</option><option value="3">1280x</option><option value="2">980x</option><option value="1">780x</option></select>',
      '<label for="ehConfig_downloadSizeChanged" title="' + htmlEscape('需开启: <ul><li>启用内置 [E-Hentai-Downloader] (并设置关闭Request File System to handle large Zip file)</li><li>显示所有预览图</li><li>启用自动调整图片尺寸</li><li>大图(双页) 与 小图(单页)尺寸 不同</li></ul><hr>注意: 避免出错，应一次下载一个画廊') + '"><input type="checkbox" id="ehConfig_downloadSizeChanged">下载调整过大小的图片压缩档</label>'
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
        saveAs2(text, '[EH]Enhance.json')
      } else if ($(e.target).is('.ehConfig input[name="importValues"]')) {
        $('#selectFileConfig').click()
      } else if ($(e.target).is('.ehConfig input[name="updateEHT"]')) {
        $(e.target).prop('disabled', true).val('Updating...')
        updateEHT().then(() => {
          $(e.target).prop('disabled', false).val('Update Now')
        })
      } else if ($(e.target).is('.ehConfig input[name="exportEHT"]')) {
        let text = GM_getValue('EHT', '')
        saveAs2(text, 'EHT.json')
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
        saveAs2(text, 'E-Hentai-Downloader.user.js')
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

    $('#selectFileConfig').on({
      change: e => {
        if (!e.target.files || !e.target.files.length || !window.confirm('Continue to IMPORT')) {
          e.target.value = null
          return
        }
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
          window.location.assign(window.location.href)
        }
        fr.readAsText(e.target.files[0])
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
        let length = G.EHT.map(i => i.count).reduce((a, c) => a + c)
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
  }).appendTo(SEL.EH.common.navBar)
}

function showTooltip () { // 显示提示
  $('<div class="ehTooltip"></div>').appendTo('body')
  let preEle
  let animateTimeout

  let animate = () => {
    let height = $('.ehTooltip')[0].scrollHeight
    if (height === $('.ehTooltip').height()) return
    if (animateTimeout) clearTimeout(animateTimeout)
    animateTimeout = setTimeout(() => {
      let top = $('.ehTooltip').scrollTop()
      $('.ehTooltip').scrollTop(top > height ? 0 : top + 30)
      animate()
    }, 1000)
  }

  $('body').on('mousemove keydown', function (e) {
    if ((e.target === preEle || $(e.target).parents().filter(preEle).length) && e.type !== 'keydown') return
    let title = $(preEle).attr('raw-title')
    $(preEle).removeAttr('raw-title').attr('title', title)
    $('.ehTooltip').hide().scrollTop(0)
    if (animateTimeout) clearTimeout(animateTimeout)
  })

  $('body').on('mouseenter', ':visible[title],:visible[raw-title],:visible[tooltip],[copy]', function (e) {
    preEle = e.target
    let title = $(preEle).attr('tooltip') ? $(preEle).attr('tooltip') + '<hr>' : ''
    let title1
    if ($(preEle).is('[copy]:not([title])')) {
      title1 = '点击复制: <span class="ehHighlight">' + $(preEle).attr('copy') + '</span>'
      $(preEle).attr('raw-title', title1)
    } else {
      title1 = $(preEle).attr('title') || $(preEle).attr('raw-title') || ''
      if (!title1) {
        let preEleTrue = $(preEle).parents().filter('[title]').eq(-1)[0]
        if (preEleTrue) {
          preEle = preEleTrue
          title1 = $(preEle).attr('title') || $(preEle).attr('raw-title')
        }
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

    animate()
  })
}

function tagEvent () { // 标签事件
  $('<div class="ehTagEvent"></div>').insertAfter(SEL.EH.info.tagContainer)
  ;[ 'Unlike', 'Alert', 'Like' ].forEach(i => {
    $('<a class="ehTagEventNotice" name="' + i + '" href="javascript:;" on="true"></a>').appendTo('.ehTagEvent').on('click', e => {
      let tags = GM_getValue('tagAction', {})
      let keyword = $('.ehTagEvent').attr('name')
      if ($(e.target).attr('on') === 'true') { // 添加行为
        tags[keyword] = i
        $(SEL.EH.info.tagDivFromName(keyword.replace(/ /g, '_'))).attr('name', i)
      } else { // 移除行为
        delete tags[keyword]
        $(SEL.EH.info.tagDivFromName(keyword.replace(/ /g, '_'))).removeAttr('name')
      }
      $(e.target).attr('on', $(e.target).attr('on') !== 'true')
      $('.ehTagEventNotice').not(e.target).attr('on', 'true')
      GM_setValue('tagAction', tags)
    })
  })
  $('<a href="https://github.com/Mapaler/EhTagTranslator/" target="_blank">Copy for ETT</a>').appendTo('.ehTagEvent').on('click', e => {
    GM_setClipboard(`| ${$('.ehTagEvent').attr('name')} | | | |`)
    return false
  })
  $(SEL.EH.info.tag).on({
    contextmenu: e => { // 搜索标签+中文
      var keyword = e.target.innerText.replace(/\s+\|.*/, '')
      keyword = '"' + keyword + '"'
      if (SEL.EH.info.nameFromTag(e.target.id).length > 2) keyword = SEL.EH.info.nameFromTag(e.target.id)[2] + ':' + keyword + '$'
      openUrl(G.config['searchArguments'].replace(/{q}/g, encodeURIComponent(keyword + ' language:"chinese"$')))
      return false
    },
    click: e => { // 标签
      $('.ehTagEvent').css('display', e.target.style.color ? 'block' : 'none').attr('name', SEL.EH.info.nameFromTag(e.target.id)[1].replace(/_/g, ' '))
      let name = $(e.target).parent().attr('name')
      $('.ehTagEvent>a[name="' + name + '"]').attr('on', 'false')
      $('.ehTagEvent>a:not([name="' + name + '"])').attr('on', 'true')
    }
  })
  $(SEL.EH.info.tagDiv).toArray().forEach(i => {
    let id = SEL.EH.info.nameFromTag(i.id)[1].replace(/_/g, ' ')
    let tags = GM_getValue('tagAction', {})
    if (id in tags) $(i).attr('name', tags[id])
  })
}

function tagPreview () { // 标签预览
  $('<div class="ehTagPreview"></div>').appendTo('body')
  $('body').on({
    mousemove (e) {
      if (!$(e.target).is(SEL.EH.search.galleryA)) {
        $('.ehTagPreview').hide()
        return
      }
      let target = e.target
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
  let max = GM_getValue('task', []).length
  let main = async () => {
    let task = GM_getValue('task', [])
    if (task.length === 0 && !GM_getValue('tasking')) {
      G.taskInterval = null
      changeFav('/favicon.ico')
      return
    }

    let done = max - task.length
    changeFav(getProcessImg((done - 1) / max * 100, 128))

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
    await waitInMs(2 * 1000)
    openUrl(tasking + '#2')
    await main()
  }
  G.taskInterval = setTimeout(main, 200)
}

function taskRemove (id) {
  let tasking = GM_getValue('tasking', '')
  if (tasking.match(id)) GM_deleteValue('tasking')
}

function tagTranslate () { // 标签翻译
  let data = $(SEL.EH.info.tag).toArray().map(i => {
    let info = i.id.split(/ta_|:/)
    if (info.length === 2) info.splice(1, 0, 'misc')
    return findData(info[1], info[2], !G.config['tagTranslateImage'])
  }).filter(i => Object.keys(i).length)
  let css = [
    SEL.EH.info.tagContainer + '{overflow:visible;min-height:295px;height:auto}',
    SEL.EH.info.infoMid + '{min-height:330px;height:auto;position:static}',
    SEL.EH.info.tag + '{background:inherit}',
    SEL.EH.info.tag + '::before{font-size:12px;overflow:hidden;line-height:20px;height:20px}',
    SEL.EH.info.tag + '::after{display:block;color:#ff8e8e;font-size:14px;background:inherit;border:1px solid #000;border-radius:5px;position:absolute;float:left;z-index:999;padding:8px;box-shadow:3px 3px 10px #000;min-width:150px;max-width:500px;white-space:pre-wrap;opacity:0;transition:opacity .2s;transform:translate(-50%,20px);top:0;left:50%;pointer-events:none;padding-top:8px;font-weight:400;line-height:20px}',
    SEL.EH.info.tag + ':hover::after{opacity:1;pointer-events:auto}',
    SEL.EH.info.tag + ':focus::after{opacity:1;pointer-events:auto}',
    SEL.EH.info.tag + ':focus::before{font-size:12px;position:relative;background-color:inherit;border:1px solid #000;border-width:1px 1px 0 1px;padding:3px 4px;color:inherit;border-radius:5px 5px 0 0}',
    SEL.EH.info.tag + ':hover::before{font-size:12px;position:relative;background-color:inherit;border:1px solid #000;border-width:1px 1px 0 1px;padding:3px 4px;color:inherit;border-radius:5px 5px 0 0}',
    'div.gt,div.gtw,div.gtl{line-height:20px;height:20px}',
    SEL.EH.info.tag + ':hover::after{z-index:9999998}',
    SEL.EH.info.tag + ':focus::after{z-index:9999996}',
    SEL.EH.info.tag + ':hover::before{z-index:9999999}',
    SEL.EH.info.tag + ':focus::before{z-index:9999997}',
    SEL.EH.info.tag + '::after{color:#' + (window.window.location.host === 'exhentai.org' ? 'fff' : '000') + '}',
    ...data.map(i => SEL.EH.info.tagFromName(i.name) + '{font-size:0;}'),
    SEL.EH.info.tag + '::before{text-decoration:line-through;}'
  ]
  let dealWithContent = (text) => {
    let arr = text.split(/(!\[.*?\]\(.*?\))/)
    console.log(arr)
    let output = []
    for (let i of arr) {
      if (i.match(/!\[(.*?)\]\((.*?)\)/)) {
        let match = i.match(/!\[(.*?)\]\((.*?)\)/)
        output.push(`url(${match[2].replace(/^# "(.*)"$/, '$1')})`)
      } else {
        output.push(`"${window.CSS.escape(i)}"`)
      }
    }
    return output.join('')
  }
  data.forEach(i => {
    css.push(SEL.EH.info.tagFromName(i.name) + `::before{content:${dealWithContent(i.cname)}}`)
    if (i.info) css.push(SEL.EH.info.tagFromName(i.name) + `::after{content:${dealWithContent(i.info)}}`)
  })

  $('<style></style>').text(css.join('\n')).appendTo('head')
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

async function updateEHT () {
  let name = 'db.raw.json'
  let url = 'https://api.github.com/repos/EhTagTranslation/Database/releases'
  let res = await xhrSync(url, null, { responseType: 'json' })
  let url1 = res.response.filter(i => i.assets.filter(i => i.name === name).length)[0].assets.filter(i => i.name === name)[0].browser_download_url
  let res1 = await xhrSync(url1)

  GM_setValue('EHT', res1.response)
  setNotification('EhTagTranslator has been up-to-date')
  GM_setValue('EHT_checkTime', new Date().getTime())
}

/* 通用函数 */

function arrUnique (arr) { // 数组去重
  return [...(new Set(arr))]
}

function getProcessImg (process, radius = 16) { // 创建环形进度条
  while (process < 0 || process > 100) {
    process = process < 0 ? process + 100 : process - 100
  }
  // https://imys.net/20150722/canvas-annulus-process.html
  var c = document.createElement('canvas')
  c.width = 2 * radius
  c.height = 2 * radius
  var ctx = c.getContext('2d')
  // 画灰色的圆
  ctx.beginPath()
  ctx.arc(radius, radius, 0.8 * radius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = '#F6F6F6'
  ctx.fill()
  // 画进度环
  ctx.beginPath()
  ctx.moveTo(radius, radius)
  ctx.arc(radius, radius, 0.8 * radius, Math.PI * 1.5, Math.PI * (1.5 + 2 * process / 100))
  ctx.closePath()
  ctx.fillStyle = '#00CD00'
  ctx.fill()
  // 画内填充圆
  ctx.beginPath()
  ctx.arc(radius, radius, 0, 0, Math.PI * 2)
  ctx.closePath()
  ctx.fillStyle = '#fff'
  ctx.fill()
  // 填充文字
  ctx.font = 'bold ' + 0.2 * radius + 'pt Microsoft YaHei'
  ctx.fillStyle = '#333'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.moveTo(radius, radius)
  ctx.fillText(process.toFixed(2).replace(/\.0+$/, '') + '%', radius, radius)
  return c.toDataURL()
}

function htmlEscape (text) {
  // refer https://github.com/lodash/lodash/blob/master/escape.js
  return text.replace(/[&<>"']/g, function (match) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[match]
  })
}

function htmlUnescape (text) {
  // refer https://github.com/lodash/lodash/blob/master/unescape.js
  return text.replace(/&(?:amp|lt|gt|quot|#39);/g, function (match) {
    return {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'"
    }[match]
  })
}

function reEscape (text) {
  // refer https://github.com/lodash/lodash/blob/master/escapeRegExp.js
  return text.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
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

function fullWidth2Half (str) { // 全角字符转半角
  // info: https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms
  // refer: https://www.cnblogs.com/html55/p/10298569.html
  let result = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 12288) {
      result += String.fromCharCode(str.charCodeAt(i) - 12256)
      continue
    }
    if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) result += String.fromCharCode(str.charCodeAt(i) - 65248)
    else result += String.fromCharCode(str.charCodeAt(i))
  }
  return result
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
  console.log({ url, parm })
  GM_xmlhttpRequest({
    method: parm ? 'POST' : 'GET',
    url: url,
    data: parm,
    timeout: opt.timeout || 60 * 1000,
    responseType: ['arraybuffer', 'blob', 'json'].includes(opt.responseType) ? opt.responseType : null,
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
  console.log({ url, parm })
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: parm ? 'POST' : 'GET',
      url: url,
      data: parm,
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

function getStringSize (_string) {
  // from: https://stackoverflow.com/a/29955838
  'use strict'

  var codePoint
  var accum = 0

  for (var stringIndex = 0, endOfString = _string.length; stringIndex < endOfString; stringIndex++) {
    codePoint = _string.charCodeAt(stringIndex)

    if (codePoint < 0x100) {
      accum += 1
      continue
    }

    if (codePoint < 0x10000) {
      accum += 2
      continue
    }

    if (codePoint < 0x1000000) {
      accum += 3
    } else {
      accum += 4
    }
  }

  return accum
}

init().then(() => {
  //
}, (err) => {
  console.error(err)
})
