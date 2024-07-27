/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
/* eslint-disable no-nested-ternary */
/* eslint-env browser */
// ==UserScript==
// @name        [EH]Enhance
// @version     1.19.453
// @modified    2024-07-18 19:11:20
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://github.com/dodying/UserJs/raw/master/Logo.png
//              里站
// @include     https://exhentai.org/
// @include     https://exhentai.org/favorites.php*
// @include     https://exhentai.org/?*
// @include     https://exhentai.org/g/*
// @include     https://exhentai.org/tag/*
// @include     https://exhentai.org/uploader/*
// @include     https://exhentai.org/uconfig.php
//              表站
// @include     https://e-hentai.org/
// @include     https://e-hentai.org/favorites.php*
// @include     https://e-hentai.org/?*
// @include     https://e-hentai.org/g/*
// @include     https://e-hentai.org/tag/*
// @include     https://e-hentai.org/uploader/*
// @include     https://e-hentai.org/uconfig.php
// @grant       window.close
// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_addValueChangeListener
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @connect     *
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.js
// @run-at      document-idle
// @compatible  firefox 52+(ES2017)
// @compatible  chrome 55+(ES2017)
// ==/UserScript==
/* global GM_info unsafeWindow GM_openInTab GM_setClipboard GM_setValue GM_getValue GM_listValues GM_deleteValue GM_addValueChangeListener GM_xmlhttpRequest GM_notification */
/* global $ jQuery JSZip */
/* eslint-disable no-debugger */

const SEL = {
  EH: {
    // unsafeWindow
    common: {
      navBar: '#nb',
    },
    search: { // 搜索页
      checker: '.ido', // 检查是否为搜索页
      displayMode: '.searchnav>div>select[onchange]', // 显示模式，Minimal,Minimal+,Compact,Extended,Thumbnail

      pagesContainerBottom: '.searchnav',
      pagePrev: '.searchnav>div>#uprev',
      pageNext: '.searchnav>div>#unext',

      mainDiv: '.ido',

      keyword: '[name="f_search"]',
      apply: '[name="f_search"]~input[type="submit"]',
      resultTotal: '.searchtext',
      resultTotalMatch: /Found about ([\d,]+) results?./,

      thumb: '.glthumb',
      thumbId: (id) => `it${id}`,
      postedTime: '[id^="posted_"]',
      // favorited: '[id^="posted_"][style]',

      resultTableContainer: '.ido>*:has(.itg)',
      resultTable: 'table.itg',
      resultTbody: 'table.itg>tbody',
      resultTr: 'table.itg>tbody>tr',
      resultHead: 'table.itg>tbody>tr:nth-child(1)',
      resultContent: 'table.itg>tbody>tr:not(:nth-child(1))',

      nameTd: '.gl3m',
      galleryA: '[href*="hentai.org/g/"]',
    },
    info: { // 信息页
      checker: '#gdt,.d', // 检查是否为信息页
      urlMatch: /^https?:\/\/e[-x]hentai\.org\/g\/\d+\/[a-z0-9]+/,

      galleryId: unsafeWindow.gid,

      title: '#gn',
      titleJp: '#gj',

      // favorite: '#gdf>#fav>.i',

      infoContainer: '#gmid',
      infoCategory: '#gdc',
      infoUploader: '#gdn',
      infoDetailTr: '#gdd tr',
      infoDetailKey: '.gdt1',
      infoDetailValue: '.gdt2',

      tagContainer: '#taglist',
      tagTr: '#taglist tr',
      tagKey: '.tc',
      tagDiv: '[id^="td_"]',
      tagDivFromName: (name) => `[id="td_${name}"]`,
      tag: '[id^="ta_"]',
      tagFromName: (name) => `[id="ta_${name}"]`,
      tagParody: '[id^="ta_parody"]',
      nameFromTag: (id) => id.match(/t[ad]_((.*?):(.*))/) || id.match(/t[ad]_(.*)/),
      tagBanned: ['ta_female:lolicon', 'ta_male:shotacon', 'ta_male:bestiality', 'ta_female:bestiality'],

      pageCur: '.ptds:eq(0)>a',
      pageMax: '.ptt td:gt(0):eq(-2)>a',
      btnContainer: '#gdo2',
      previewContainer: '[id="gdt"]',
      previewDiv: '.gdtm',
      previewA: '.gdtm>div>a',
      previewImg: '.gdtm>div>a>img',

      uploaderComment: '#comment_0',
    },
    setting: { // 设置页
      // changeEConfig
      checker: '[name="profile_set"]', // 检查是否为搜索页
      form: 'form:has(#apply)',
    },
    special: {
      deleted: '.d', // https://e-hentai.org/g/1621568/6d89c79f2e/
    },
  },
  EHD: {
    checker: '.ehD-box',
    download: 'fieldset.ehD-box .g2:contains("Download Archive")',
    abort: '.ehD-pt-item:not(.ehD-pt-succeed,.ehD-pt-failed) .ehD-pt-abort',
    pageRange: 'label:contains("Pages Range")>input',
    // download: '.ehD-box>.g2:eq(0)'
  },
};

const G = { // 全局变量
  debug: false,
  isIframe: window.self !== window.top,
  searchPage: $(SEL.EH.search.checker).length,
  infoPage: $(SEL.EH.info.checker).length,
  settingPage: $(SEL.EH.setting.checker).length,
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
    p: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAABTSURBVHjaYvj//z8DJZiBKgaksQn+R8cMSACbfBqb4H/qG8CAA6DLD2IDkBViYxMdiGQbQIwX8KYDmhuQxiaoTGlKlKXUAG7aZCZKMAAAAP//AwCS0Ls1SQllgAAAAABJRU5ErkJggg==',
  },
  introPicName: [
    // /999\.(png|jpg)$/i,
    /^i_\.(png|jpg)$/i,
    /^zCREDIT/i,
    '招募圖',
    '無邪気',
    /^Read(|_)(|\d+)\.(png|jpg)$/i,
    /^(CEwanted|zmt)\.(png|jpg)$/i,
    /^Z{2,}\d*\.(png|jpg)$/,
    /(credits)\.(png|jpg)$/i,
    // /\.gif$/i
  ],
  uselessStrRE: /\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）|～|~/g,
  infoGroup: ['[]', '()', '{}', '【】'],
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
    10: [['jyuu', 'jyu', 'juu', 'ju', 'x'], ['10', '１０', '十', '拾']],
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
    const used = ['addEventListener', 'alert', 'applicationCache', 'atob', 'blur', 'browser', 'btoa', 'caches', 'cancelAnimationFrame', 'cancelIdleCallback', 'captureEvents', 'chrome', 'clearInterval', 'clearTimeout', 'clientInformation', 'close', 'closed', 'confirm', 'createImageBitmap', 'crypto', 'customElements', 'decodeURI', 'decodeURI', 'decodeURIComponent', 'defaultStatus', 'defaultstatus', 'devicePixelRatio', 'dispatchEvent', 'document', 'encodeURI', 'encodeURIComponent', 'eval', 'external', 'fetch', 'find', 'focus', 'frameElement', 'frames', 'getComputedStyle', 'getSelection', 'history', 'indexedDB', 'innerHeight', 'innerWidth', 'isFinite', 'isNaN', 'isSecureContext', 'length', 'localStorage', 'location', 'locationbar', 'matchMedia', 'menubar', 'moveBy', 'moveTo', 'name', 'navigator', 'onabort', 'onafterprint', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'onappinstalled', 'onauxclick', 'onbeforeinstallprompt', 'onbeforeprint', 'onbeforeunload', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondevicemotion', 'ondeviceorientation', 'ondeviceorientationabsolute', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'onformdata', 'ongotpointercapture', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onlanguagechange', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onlostpointercapture', 'onmessage', 'onmessageerror', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpause', 'onplay', 'onplaying', 'onpointercancel', 'onpointerdown', 'onpointerenter', 'onpointerleave', 'onpointermove', 'onpointerout', 'onpointerover', 'onpointerrawupdate', 'onpointerup', 'onpopstate', 'onprogress', 'onratechange', 'onrejectionhandled', 'onreset', 'onresize', 'onscroll', 'onsearch', 'onseeked', 'onseeking', 'onselect', 'onselectionchange', 'onselectstart', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'ontransitionend', 'onunhandledrejection', 'onunload', 'onvolumechange', 'onwaiting', 'onwebkitanimationend', 'onwebkitanimationiteration', 'onwebkitanimationstart', 'onwebkittransitionend', 'onwheel', 'open', 'openDatabase', 'opener', 'origin', 'outerHeight', 'outerWidth', 'pageXOffset', 'pageYOffset', 'parent', 'parseFloat', 'parseInt', 'performance', 'personalbar', 'postMessage', 'print', 'prompt', 'queueMicrotask', 'releaseEvents', 'removeEventListener', 'requestAnimationFrame', 'requestIdleCallback', 'resizeBy', 'resizeTo', 'screen', 'screenLeft', 'screenTop', 'screenX', 'screenY', 'scroll', 'scrollBy', 'scrollTo', 'scrollX', 'scrollY', 'scrollbars', 'self', 'sessionStorage', 'setInterval', 'setTimeout', 'speechSynthesis', 'status', 'statusbar', 'stop', 'styleMedia', 'toolbar', 'top', 'visualViewport', 'webkitCancelAnimationFrame', 'webkitRequestAnimationFrame', 'webkitRequestFileSystem', 'webkitResolveLocalFileSystemURL', 'webkitStorageInfo'];

    const variabled = {};
    for (const i in this) {
      if (!used.includes(i)) {
        variabled[i] = this[i];
      }
    }
    return variabled;
  })(),
};
G.punctuationRegExp = /[\p{Punctuation}\p{Symbol}\p{Other}]/u;
G.punctuationWithWhiteRegExp = /[\s\p{Punctuation}\p{Symbol}\p{Other}]/u;
G.punctuationWithWhiteGroupRegExp = /([\s\p{Punctuation}\p{Symbol}\p{Other}])/u;
G.punctuationWithWhiteAllRegExp = /^[\s\p{Punctuation}\p{Symbol}\p{Other}]+$/u;

G.isPreferDisplayMode = !G.infoPage && ['m', 'p'].includes($(SEL.EH.search.displayMode).val());
G.autoDownload = window.location.hash.match(/^#[0-2]$/) && G.config.autoStartDownload;
G.downloadSizeChanged = !G['ehD-setting']['store-in-fs'] && G.config.enableEHD && G.config.showAllThumb && G.config.enableChangeSize && G.config.sizeS !== G.config.sizeD && G.config.downloadSizeChanged;
G.noscript = window.location.hash.match(/^#noscript$/);

async function init() {
  if (G.isIframe) {
    $('<button class="ehIframeClose">Close</button>').appendTo('body').on('click', windowClose);
  }
  if (G.noscript) return;
  if ($(SEL.EH.special.deleted).length && window.location.href === `${GM_getValue('tasking')}#2`) {
    const taskFailed = GM_getValue('taskFailed', []);
    taskFailed.push(GM_getValue('tasking'));
    GM_setValue('taskFailed', taskFailed);
    GM_deleteValue('tasking');
    windowClose();
    return;
  }

  // GM_registerMenuCommand(GM_info.script.name + ': Show Global', function () {
  //   console.log({ SEL, G });
  // }, 'S');
  defaultConfig(); // 默认设置
  addStyle(); // 添加样式
  $('<div class="ehNavBar" style="bottom:0;"><div></div><div></div><div></div></div>').appendTo('body');
  $(window).on({
    scroll: () => {
      $('.ehNavBar').attr('style', $(window).scrollTop() >= 30 && G.infoPage ? 'top:0;' : 'bottom:0;');
    },
  });

  const now = new Date().getTime();
  const lastTime = GM_getValue('EHT_checkTime', 0);
  if (G.config.updateIntervalEHT !== 0 && now - lastTime >= G.config.updateIntervalEHT * 24 * 60 * 60 * 1000) {
    try {
      await updateEHT();
    } catch (err) { }
  }
  if (GM_getValue('EHT', {}).version === 6) {
    G.EHT = GM_getValue('EHT').data;
  } else {
    try {
      await updateEHT();
      G.EHT = GM_getValue('EHT').data;
    } catch (error) {
      console.log(error);
      window.alert('update EHT failed, please reload this page');
      return;
    }
  }

  showConfig();

  $('<button title="无人坚守模式" name="passive mode">Passive Mode</button>').on({
    click: (e, remote) => {
      [window.alertRaw, window.alert] = [window.alert, window.alertRaw || function () { }];
      [window.confirmRaw, window.confirm] = [window.confirm, window.confirmRaw || function () { return true; }];
      [window.promptRaw, window.prompt] = [window.prompt, window.promptRaw || function (message, value) { return value; }];
      const status = $(e.target).attr('status');
      $(e.target).attr('status', status ? null : 'on');
      if (!remote) GM_setValue('passiveMode', !status);
    },
  }).appendTo('.ehNavBar>div:nth-child(1)');
  GM_addValueChangeListener('passiveMode', (name, valueOld, value, remote) => {
    if (!remote) return;
    $(`.ehNavBar>div:nth-child(1)>[name="passive mode"]${value ? ':not([status])' : '[status]'}`).trigger('click', true);
  });
  if (GM_getValue('passiveMode', false)) {
    $('.ehNavBar>div:nth-child(1)>[name="passive mode"]:not([status])').trigger('click', true);
  }

  if (G.infoPage) { // 信息页
    if (jumpHost()) return; // 里站跳转
    if (G.config.enableEHD) {
      const now = new Date().getTime();
      const lastTime = GM_getValue('EHD_checkTime', 0);
      if (!GM_getValue('EHD_code') || (G.config.updateIntervalEHD !== 0 && now - lastTime >= G.config.updateIntervalEHD * 24 * 60 * 60 * 1000)) {
        try {
          await updateEHD();
        } catch (err) { }
      }
      const fixEHDCounter = [
        'window.fixEHDCounterTime = 0',
        'window.fixEHDCounter = function fixEHDCounter () {',
        '  $(\'.ehD-pt-failed\').remove();',
        '  $(\'.ehD-pt:empty\').remove();',
        '  fixEHDCounterTime++;',
        '  if (totalCount <= 0) return;',
        '  if (totalCount === downloadedCount && failedCount > 0) {',
        '    failedCount = 0; checkFailed();',
        '  }',
        '  if (fetchCount < 0) {',
        '    // fetchCount = [...document.querySelectorAll(\'.ehD-pt-progress\')].filter(i => { const value = i.getAttribute(\'value\'); return value === null || (value * 1 < 1 && value * 1 > 0); }).length;',
        '    fetchCount = $(\'.ehD-pt-item:not(.ehD-pt-succeed,.ehD-pt-failed) .ehD-pt-status[data-inited-abort] .ehD-pt-abort\').length;',
        '    updateTotalStatus();',
        '    checkFailed();',
        '  }',
        '  if (downloadedCount + failedCount >= totalCount && failedCount > 0 && fetchCount > 0) {',
        '    retryAllFailed();',
        '  }',
        '  if (downloadedCount >= totalCount) {',
        '    ehDownloadPauseBtn();',
        '    saveDownloaded(true);',
        '  }',
        '  $(\'<tr>\').html(\'<td colspan="3">fixEHDCounter: \' + fixEHDCounterTime + \'</td>\').appendTo(\'.ehD-pt:last\');',
        '};',
      ];
      $('<button title="重置EHD计数">Fix EHD Counter</button>').on({
        click: () => {
          window.fixEHDCounter();
        },
      }).prependTo('.ehNavBar>div:nth-child(2)');
      const checkAndFix = [
        'window.EHDCounter = {}',
        'let startLoop',
        'let checkAndFixEHDCounter = function (loop) {',
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
        '  if (loop) setTimeout(checkAndFixEHDCounter, timeout)',
        '};',
        'let checkAndFixEHDCounterStart = function () {',
        '  if (startLoop) return;',
        '  startLoop = true;',
        '  checkAndFixEHDCounter(true);',
        '};',
      ];
      const monitorDialog = [
        'const pushDialogRaw = pushDialog;',
        'var pushDialog = function (str) {',
        '  isDownloading = true;',
        '  checkAndFixEHDCounterStart();',
        '  if (["Failed!\\nFetch Pages\' URL failed, Please try again later."].includes(str)) {',
        '    unsafeWindow.onbeforeunload = null;',
        '    ehDownloadAction.click();',
        '  }',
        '  pushDialogRaw(str);',
        '};',
      ];
      $('<button tooltip="更改EHD设置" name="ehdSetting">EHD Setting: 0</button>').on({
        click: () => {
          window.changeEHDSetting();
        },
      }).prependTo('.ehNavBar>div:nth-child(2)');
      const monitorProgress = [
        'const settingRaw = JSON.parse(GM_getValue(\'ehD-setting\'));',
        'const settingLoop = [settingRaw, JSON.parse(G.config.ehdFailed1Config), JSON.parse(G.config.ehdFailed2Config)];',
        'let settingIndex = 0;',
        'window.changeEHDSetting = (obj, name) => {',
        '  if (!obj) obj = settingIndex + 1;',
        '  if (typeof obj === \'number\') {',
        '    obj = obj % settingLoop.length;',
        '    settingIndex = obj;',
        '    name = obj;',
        '    obj = settingLoop[obj];',
        '  }',
        '  Object.assign(setting, obj);',
        '  const title = \'<pre>\' + JSON.stringify(obj, null, 2) + \'</pre>\';',
        '  $(\'[name="ehdSetting"]\').text(\'EHD Setting: \' + name).attr(\'title\', title).attr(\'raw-title\', title);',
        '};',
        'const updateProgressRaw = updateProgress;',
        'var ehFailedCount = 0;',
        'var updateProgress = function (nodeList, data) {',
        '  if (data.class === \'ehD-pt-succeed\') {',
        '    ehFailedCount = 0;',
        '  } else if ([\'ehD-pt-warning\', \'ehD-pt-failed\'].includes(data.class)) {',
        '    ehFailedCount++;',
        '  }',
        '  if (ehFailedCount >= G.config.ehdFailed3) {',
        '    if (ehDownloadPauseBtn.textContent.match(/^Pause/i)) ehDownloadPauseBtn.click();',
        '    window.changeEHDSetting(0);',
        '    ehFailedCount = 0;',
        '    if (GM_getValue(\'passiveMode\') && G.config.ehdFailed3Time) {',
        '      setTimeout(() => {',
        '        if (ehDownloadPauseBtn.textContent.match(/^Resume/i)) ehDownloadPauseBtn.click();',
        '      }, G.config.ehdFailed3Time * 1000);',
        '    } else {',
        '      window.alert(\'下载已暂停，设置已还原\');',
        '    }',
        '  } else if (ehFailedCount >= G.config.ehdFailed2) {',
        '    window.changeEHDSetting(2);',
        '  } else if (ehFailedCount >= G.config.ehdFailed1) {',
        '    window.changeEHDSetting(1);',
        '  }',
        '  updateProgressRaw(nodeList, data);',
        '};',
      ];
      const toEavl = [
        'try {',
        ';(function () {',
        'var loadSetting = function () { return new Promise(resolve => { resolve(GM_getValue(\'ehD-setting\')) }) }',
        'let console = {}',
        'for (let i in window.console) { console[i] = new Function() }',
        'let alert = function () { }',
        'let confirm = function () { return true }',
        'let prompt = function (message, value) { return value }',
        ';',
        GM_getValue('EHD_code'),
        ';',
        fixEHDCounter.join('\n'),
        ';',
        monitorDialog.join('\n'),
        ';',
        monitorProgress.join('\n'),
        ';',
        (G.config.fixEHDCounter ? checkAndFix.join('\n') : ''),
        ';',
        '})();',
        '} catch (error) {',
        '  console.error(err);',
        '}',
      ];
      eval(toEavl.join('\n')); // eslint-disable-line no-eval
    } else {
      const loaded = await waitFor(() => $(SEL.EHD.checker).length, 30 * 1000);
      if (!loaded) console.error('载入 E-Hentai-Downloader 超时');
      setNotification('载入 E-Hentai-Downloader 超时');
    }
    $(SEL.EHD.download).click((e) => { // 使用EHD下载时, 添加到下载列表
      if (e.originalEvent && G.downloadSizeChanged) autoDownload();
      downloadAdd(SEL.EH.info.galleryId);
      if ($('[rel="shortcut icon"]').length === 0) changeFav(G.favicon.d);
      $('.ehNavBar').attr('style', 'top:0;');
    });
    $(window).on('unload', () => { // 关闭页面时, 从下载列表中移除
      for (const i in G) delete G[i];
      downloadRemove(SEL.EH.info.galleryId);
    });
    if (G.config.changeName) changeName(SEL.EH.info.title); // 修改本子标题（删除集会名、替换其中的罗马数字）
    document.title = $(SEL.EH.info.title).text();
    tagTranslate(); // 标签翻译
    btnSearch(); // 按钮 -> 搜索(信息页)
    if (G.config.btnFake) btnFake(); // 按钮 -> 下载空文档(信息页)
    btnInfoText(); // 按钮 -> 下载info.txt(信息页)
    btnTask(); // 按钮 -> 添加到下载任务(信息页)
    tagEvent(); // 标签事件
    abortPending(); // 终止EHD所有下载
    $('<button class="ehThumbBtn">Hide</button>').on('click', (e) => { // 隐藏预览图
      $(SEL.EH.info.previewContainer).toggle();
      $(e.target).text($(e.target).text() === 'Show' ? 'Hide' : 'Show');
    }).prependTo(SEL.EH.info.btnContainer);
    if (G.config.showAllThumb) await showAllThumb();
    introPic(); // 宣传图
    if (G.config.enableChangeSize && G.config.sizeS !== G.config.sizeD) await checkImageSize();
    await waitFor(() => false, 500);
    if (G.autoDownload) await autoDownload(); // 自动开始下载
  } else if (G.searchPage) { // 搜索页
    if ($(SEL.EH.search.resultTotal).length && !G.isPreferDisplayMode) {
      window.alert('Please change display mode to "Minimal" or "Minimal+"');
      return;
    }
    if (jumpHost()) return; // 里站跳转
    $(SEL.EH.search.apply).attr('title', '右键: 添加/删除 中文').on({
      contextmenu: () => {
        let value = $(SEL.EH.search.keyword).val();
        value = value.match(/language:"?\w+\$?"?/) ? value.replace(/language:"?\w+\$?"?/, '').trim() : `${value} language:chinese$`;
        $(SEL.EH.search.keyword).val(value);
      },
    });
    if ($(SEL.EH.search.keyword).val()) document.title = translateText($(SEL.EH.search.keyword).val());
    if (G.config.preloadResult && $(SEL.EH.search.pageNext).length) await preloadResult(G.config.preloadResult);
    $('<div class="ehContainer"></div>').prependTo(SEL.EH.search.nameTd);
    btnSearch2(); // 按钮 -> 搜索(搜索页)
    quickDownload(); // 右键：下载
    if ($(SEL.EH.search.resultTable).length) batchDownload(); // Displsy: List => 批量下载
    if (G.config.btnFake) btnFake2(); // 按钮 -> 下载空文档(搜索页)
    btnTask2(); // 按钮 -> 添加到下载任务(搜索页)
    const _gmetadata = await getInfo() || [];
    G.gmetadata.push(..._gmetadata);
    if (G.config.pageCount) pageCount(); // 显示本子页数
    if (G.config.languageCode) languageCode(); // 显示iso语言代码
    if (G.config.checkExist) checkExist(); // 检查本地是否存在
    if (G.config.changeName) changeName(SEL.EH.search.galleryA); // 修改本子标题（删除集会名、替换其中的罗马数字）
    if (G.config.sortByName) sortByName(); // 本子按名称排序
    if (G.config.tagPreview) tagPreview(); // 标签预览
    if (G.config.checkExistAtStart) $('[name="checkExist"]').click();
    hideGalleries(); // 隐藏某些画集
    waitFor(() => $('[name="checkExist"]:not([disabled])').length).then(() => {
      if ($(SEL.EH.search.resultTable).length && G.config.preloadPaneImage) $(SEL.EH.search.thumb).filter(':visible').each((index, elem) => { unsafeWindow.load_pane_image(elem); });
      changeFav(G.favicon.d);
      if (window.location.hash === '#autoPage') {
        if ($(SEL.EH.search.resultContent).filter(':not(.ehCheckContainer):visible').length === 0) {
          if ($(SEL.EH.search.pageNext).length) window.location.href = `${$(SEL.EH.search.pageNext).attr('href')}#autoPage`;
        } else {
          setNotification(`Result ${$(SEL.EH.search.resultContent).filter(':not(.ehCheckContainer):visible').length}`, '');
        }
      }
    });
    if (G.config.acLength >= 0) autoComplete(); // 自动填充
    checkForNew(); // 检查有无新本子
    btnSearch2Highlight();
  } else if (G.settingPage) { // 设置页
    return;
  }
  highlightBlacklist(); // 高亮黑名单相关的画廊(通用)
  if (G.config.searchInOtherSites) searchInOtherSites(); // 在其他站点搜索
  if (G.config.saveLink) saveLink(); // 保存链接
  $('<button tooltip="重置下载列表">Clear Downloading</button>').on({
    click: () => {
      GM_setValue('downloading', []);
    },
    mouseenter: (e) => {
      $(e.target).attr('title', `当前下载列表:<br> ${GM_getValue('downloading', []).join('<br> ')}`);
    },
  }).prependTo('.ehNavBar>div:nth-child(3)');
  $(`<button name="taskControl" key-code="X" key-event="mousedown" tooltip="${htmlEscape('左键: 开始/暂停下载任务<br>中键: 取消当前下载<br>右键: 从当前任务开始')}">Start Task</button>`).on({
    mousedown: (e) => {
      if (e.button === 0) {
        if (G.taskInterval) {
          G.taskStop = true;
          G.taskInterval = null;
          $(e.target).text('Start Task');
        } else {
          task();
          $(e.target).text('Stop Task');
        }
      } else if (e.button === 1) {
        GM_deleteValue('tasking');
      } else if (e.button === 2) {
        const taskAll = [].concat(GM_getValue('tasking', []), GM_getValue('task', [])).map((i) => i.replace(/#\d+$/, '')).filter((i) => i).filter((item, index, array) => array.indexOf(item) === index);
        GM_deleteValue('tasking');
        GM_setValue('task', taskAll);
        task();
        $(e.target).text('Stop Task');
      }
    },
    mouseenter: (e) => {
      const task = GM_getValue('task', []);
      const taskFailed = GM_getValue('taskFailed', []);
      $(e.target).attr('title', `当前任务:<br> ${GM_getValue('tasking', '')}<hr>当前任务列表: ${task.length}<br> ${task.join('<br> ')}<hr>当前任务列表-失败: ${taskFailed.length}<br> ${taskFailed.join('<br> ')}`);
    },
  }).appendTo('.ehNavBar>div:nth-child(3)');
  $('<input type="file" id="selectFileTask" name="selectFile" accept=".txt">').on({
    change: (e) => {
      if (!e.target.files || !e.target.files.length) {
        e.target.value = null;
        return;
      }
      const fr = new window.FileReader();
      fr.onload = (e) => {
        const text = e.target.result;
        const tasking = GM_getValue('tasking', []);
        const task = [].concat(GM_getValue('task', []), text.split(/[\r\n]+/)).map((i) => i.replace(/#\d+$/, '')).filter((i) => i && i !== tasking && i.match(SEL.EH.info.urlMatch)).filter((item, index, array) => array.indexOf(item) === index);
        GM_setValue('task', task);
        e.target.value = null;
      };
      fr.readAsText(e.target.files[0]);
    },
  }).appendTo('.ehNavBar>div:nth-child(3)');
  $(`<button tooltip="${htmlEscape('左键: 导出下载列表（包括正在下载）<br>中键: 重置下载列表（包括正在下载）<br>右键: 导入下载列表（自动清除重复项）')}">Export Task</button>`).on({
    mousedown: (e) => {
      if (e.button === 0) {
        const task = [].concat(GM_getValue('tasking', []), GM_getValue('task', [])).map((i) => i.replace(/#\d+$/, '')).filter((i) => i).filter((item, index, array) => array.indexOf(item) === index);
        saveAs2(task.join('\n'), 'task-list.txt');
      } else if (e.button === 1) {
        GM_setValue('task', []);
        GM_deleteValue('tasking');
      } else if (e.button === 2) {
        $('#selectFileTask').click();
      }
    },
    mouseenter: (e) => {
      const task = GM_getValue('task', []);
      const taskFailed = GM_getValue('taskFailed', []);
      $(e.target).attr('title', `当前任务:<br> ${GM_getValue('tasking', '')}<hr>当前任务列表: ${task.length}<br> ${task.join('<br> ')}<hr>当前任务列表-失败: ${taskFailed.length}<br> ${taskFailed.join('<br> ')}`);
    },
  }).appendTo('.ehNavBar>div:nth-child(3)');
  $(`<button title="${htmlEscape('左键: 加入或移除黑名单<br>右键: 显示黑名单列表')}">Toggle Blacklist</button>`).on({
    mousedown: (e) => {
      if (e.button === 0) {
        const value = window.prompt('如需输入正则表达式，请按"/pattern/flags"的格式输入\n其他格式视为纯文本');
        if (value && value.trim()) {
          toggleBlacklist(value.trim());
          highlightBlacklist();
        }
      } else if (e.button === 1) {

      } else if (e.button === 2) {
        if ($('.ehBlackListContainer').length) {
          $('.ehBlackListContainer').remove();
        } else {
          const blacklist = GM_getValue('blacklist', []);
          let html = '<ul>';
          html = html + blacklist.map((keyword) => `<li><a href="${G.config.searchArguments.replace(/{q}/g, encodeURIComponent(keyword))}" target="_blank">${htmlEscape(keyword)}</a> <span copy="${htmlEscape(keyword)}">复制</span></li>`).join('');
          html = `${html}</ul>`;
          $('<div class="ehBlackListContainer"></div>').html(html).appendTo('body');
        }
      }
    },
  }).appendTo('.ehNavBar>div:nth-child(1)');

  showTooltip(); // 显示提示
  $('body').on('mousedown', 'a,button,input[type="button"],div:empty', (e) => {
    $(e.target).addClass('clicked fadeOutIn');
    setTimeout(() => {
      $(e.target).removeClass('fadeOutIn');
    }, 800);
  });
  $('body').on('mousedown', '[copy]', (e) => {
    e.preventDefault();
    const copy = $(e.target).attr('copy');
    setNotification(copy, '已复制');
    GM_setClipboard(copy);
  }).on('contextmenu', () => false);
  $('.ehNavBar').attr('oncontextmenu', 'return false');
  $('body').on('click', 'a[href][target="_blank"]:not([href^="#"])', (e) => {
    if (e.isDefaultPrevented()) return;
    let url = $(e.target).is('a') ? e.target.href : $(e.target).parents('a').attr('href');
    url = new URL(url, window.location.href);
    if (!(['http:', 'https:'].includes(url.protocol))) return;
    e.preventDefault();
    openUrl(url.href);
  });

  $('body').on('keydown', (e) => {
    if (['text', 'number', 'textarea', 'password'].includes(e.target.type)) return;
    if (!e.originalEvent.code.match(/^(Key|Digit|Numpad)(.*)$/)) return;

    const key = e.originalEvent.code.match(/^(Key|Digit|Numpad)(.*)$/)[2];
    if ($(`[key-code="${key}"]`).length) {
      const keyEvent = $(`[key-code=${key}]`).attr('key-event');
      const event = jQuery.Event(keyEvent);
      if (keyEvent === 'mousedown') event.button = e.shiftKey ? 2 : 0;
      $(`[key-code=${key}]`).trigger(event).addClass('clicked');
      e.preventDefault();
    }
  });
}

function abortPending() { // 终止EHD所有下载
  $('<button title="终止EHD所有下载">Force Abort</button>').on({
    click: () => {
      $(SEL.EHD.abort).click();
    },
  }).appendTo('.ehNavBar>div:nth-child(2)');
}

function addStyle() { // 添加样式
  const backgroundColor = $('body').css('background-color');
  $('<style></style>').text([
    // global
    'input[type="number"]{width:60px;border:1px solid #B5A4A4;margin:3px 1px 0;padding:1px 3px 3px;border-radius:3px;}',
    'input:disabled,button:disabled{cursor:progress;color:#808080;opacity:0.7;text-decoration:line-through;}',
    '.clicked{border:#f00 solid 1px;}',
    '.fadeOutIn{animation:fadeOutIn ease 1s;}',
    '@keyframes fadeOutIn{0% {opacity:1;} 50% {opacity:0.5;} 100% {opacity:1;}}',
    'button{min-height:26px;line-height:20px;padding:1px 5px 2px;margin:0 2px;border-radius:3px;font-size:9pt;}',
    'button:enabled:hover{outline:0;}',
    (
      window.location.host === 'e-hentai.org'
        ? 'button{border:2px solid #b5a4a4;color:#5c0d12;background-color:#edeada;}'
        + 'button:enabled:hover{background-color:#f3f0e0!important;border-color:#977273!important;}'
        : 'button{border:2px solid #8d8d8d;color:#f1f1f1;background-color:#34353b;}'
        + 'button:enabled:hover{background-color:#43464e!important;border-color:#aeaeae!important;}'
    ),

    // script
    `.ehNavBar{display:flex;width:99%;background-color:${backgroundColor};position:fixed;z-index:1000;padding:0 10px;}`,
    '.ehNavBar>div{flex-grow:1;}',
    '.ehNavBar>div:nth-child(1){text-align:left;}',
    '.ehNavBar>div:nth-child(2){text-align:center;}',
    '.ehNavBar>div:nth-child(3){text-align:right;}',
    '.ehNavBar>div>[name="container"]{max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.btnSearch{cursor:pointer;width:16px;height:16px;float:left;}',
    '.ehNavBar>div:nth-child(1)>[name="passive mode"][status="on"]{color:#f00;background:#fff;}',
    '.ehNavBar>div:nth-child(1)>[name="passive mode"][status="on"]::after{content:" ON"}',
    '.btnSearch::before{content:"\ud83d\udd0d"}',
    `.ehConfig{position:fixed;top:30px;bottom:23px;left:0;right:0;min-width:720px;max-width:1200px;margin:3px auto;padding:3px 5px;;border:solid 1px black;z-index:3;overflow:auto;background-color:${backgroundColor};}`,
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
    '.ehContainer>*{margin:1px;float:left;}',
    '.ehExistContainer{float:left;max-width:240px;max-height:20px;overflow:auto;}',
    '.ehExistContainer:hover{max-width:100%;}',
    '.ehExistContainer::-webkit-scrollbar{height:2px;width:2px;}',
    '.ehExistContainer::-webkit-scrollbar-track{background:#ddd;}',
    '.ehExistContainer::-webkit-scrollbar-thumb{background:#666;}',
    '.ehExist{display:inline-block;color:#fff;background:#000;border:black 1px solid;cursor:pointer;margin:1px;}',
    '.ehExist::before{content:attr(fileSize) "M";}',
    '.ehExist[filesize="0.00"]::before{content:"X";color:#f00;}',
    '.ehExist[name="force"]{color:#0f0;float:left;}',
    '.ehExist[name="force-nolang"]{color:#00f;}',
    '.ehExist[name="force-notchinese"]{background-image:-webkit-linear-gradient(top left,#00f 50%,#b5810d 50%);color:#fff;}',
    '.ehExist[name="incomplete"]{color:#f00;background:#00f;}',
    '.ehExist[name="notchinese"]{color:#000;background:#f8b400;}',
    '.ehLang{border:black 1px solid;color:#0f0;background:#111d5e;}',
    '.ehPageCount{border:black 1px solid;color:#f00;background:#111d5e;}',
    '.ehTagPreview{position:fixed;padding:5px;display:none;z-index:999999;font-size:larger;width:250px;border-color:#000;border-style:solid;color:#fff;background-color:#34353b;}',
    '.ehTagPreviewLi{color:#ffffff;}',
    '.ehTagPreviewLi[name="language"]>span{background-color:#ff0000;}',
    '.ehTagPreviewLi[name="language"]::before{content:"语言: ";}',
    '.ehTagPreviewLi[name="artist"]>span{font-size:larger;background-color:#0000ff;}',
    '.ehTagPreviewLi[name="artist"]::before{content:"作者: ";}',
    '.ehTagPreviewLi[name="group"]>span{font-size:larger;background-color:#00ff00;}',
    '.ehTagPreviewLi[name="group"]::before{content:"团队: "}',
    '.ehTagPreviewLi[name="parody"]>span{font-size:larger;background-color:#3d7878;}',
    '.ehTagPreviewLi[name="parody"]::before{content:"原作: ";}',
    '.ehTagPreviewLi[name="character"]>span{background-color:#9f0050;}',
    '.ehTagPreviewLi[name="character"]::before{content:"角色: ";}',
    '.ehTagPreviewLi[name="cosplayer"]>span{background-color:#9f0050;}',
    '.ehTagPreviewLi[name="cosplayer"]::before{content:"Coser: ";}',
    '.ehTagPreviewLi[name="female"]>span{background-color:#00008b;}',
    '.ehTagPreviewLi[name="female"]::before{content:"女: ";}',
    '.ehTagPreviewLi[name="male"]>span{background-color:#800080;}',
    '.ehTagPreviewLi[name="male"]::before{content:"男: ";}',
    '.ehTagPreviewLi[name="mixed"]>span{background-color:#808080;}',
    '.ehTagPreviewLi[name="mixed"]::before{content:"混合: ";}',
    '.ehTagPreviewLi[name="other"]>span{background-color:#808080;}',
    '.ehTagPreviewLi[name="other"]::before{content:"其他: ";}',
    '.ehTagPreviewLi[name="reclass"]>span{background-color:#808080;}',
    '.ehTagPreviewLi[name="reclass"]::before{content:"重新分类: ";}',
    '.ehTagPreviewLi[name="temp"]>span{background-color:#808080;}',
    '.ehTagPreviewLi[name="temp"]::before{content:"临时: ";}',
    '.ehTagPreviewLi>span{display:inline;margin:0 2px;border:1px #456F78 solid;}',
    '.ehTagEvent>.ehTagEventNotice[on="true"]::after{content:attr(name);}',
    '.ehTagEvent>.ehTagEventNotice[on="false"]::after{content:"NOT " attr(name);}',
    `.ehTooltip{max-width:50%;max-height:85%;overflow:auto;display:none;position:fixed;text-align:left;z-index:99999;border:2px solid #8d8d8d;background-color:${backgroundColor};font-size:110%;}`,
    '.ehTooltip>ul{margin:0;}',
    `.ehCheckTableContainer{position:fixed;top:23px;bottom:16px;left:0;right:0;min-width:950px;max-width:1200px;margin:10px auto;padding:5px;border:solid 1px black;z-index:2;background-color:${backgroundColor};}`,
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
    '.ehBlacklist{color:#f00!important;background-color:#00f;}',
    '.ehBlacklist:hover{color:inherit!important;background-color:inherit;}',
    '[copy]{cursor:pointer;}',
    '[key-code]::before{content:"(&"attr(key-code)")";text-decoration:underline;}',
    '[content-after]::after{content:attr(content-after);padding-left:5px;}',
    '[content-before]::before{content:attr(content-before);padding-right:5px;}',
    '.icon{margin:-3px 0!important;height:16px!important;width:16px!important;}',
    '.ehHighlight{color:#0f0;background-color:#000;margin:3px;font-size:125%;font-weight:bold;}',
    '.ehNew{width:25px;height:12px;float:left;background-image:url(https://ehgt.org/g/n.gif);}',
    '[name="selectFile"]{width:0;height:0;opacity:0;overflow:hidden;}',
    `.ehNotification{display:flex;z-index:2147483647;position:fixed;bottom:1px;right:1px;border:solid 1px #000;background-color:${backgroundColor};min-width:300px;cursor:pointer;}`,
    '.ehNotification>div:nth-child(1){flex:1;}',
    '.ehNotification>div:nth-child(2){flex:4;}',
    '.ehNotification>div:nth-child(2)>div:nth-child(1){font-size:16px;font-weight:bold;white-space:nowrap;}',
    '.ehFavicion{background: url(favicon.ico) no-repeat center center;}',
    '.ehIgnore{filter:blur(1px) grayscale(1);}',
    '.ehIgnore:hover{filter:none;}',
    '.ehIframeContainer{margin-bottom:40px;padding:2px;border:solid;}',
    '.ehIframeContainer>[name="src"]{width:50%;}',
    `.ehIframe{width:95%;height:${document.documentElement.clientHeight * 0.7}px;resize:vertical;}`,
    '.ehIframeClose{position:fixed;top:0;right:0;z-index:99999;color:#f00;}',
    '.ehThumbBtn{width:36px;height:15px;padding:3px 2px;margin:0 2px 4px 2px;float:left;border-radius:5px;border:1px solid #989898;}',

    '.ehPreLike{white-space:pre-wrap;word-break:break-word;font-family:Consolas,Monaco,monospace;}',
    `.ehDiffNone{color:${backgroundColor};background-color:${backgroundColor};}`,
    '.ehDiffDel{background:#9d0b0b;font-size:110%;}',
    '.ehDiffAdd{background:#007944;font-size:110%;}',

    `.ehBlackListContainer{position:fixed;top:23px;bottom:16px;left:0;right:0;min-width:950px;max-width:1200px;margin:10px auto;padding:5px;border:solid 1px black;z-index:2;background-color:${backgroundColor};overflow:auto;text-align:justify;}`,

    // html
    `${SEL.EH.common.navBar}{max-width:100%;max-height:100%;}`,
    `${SEL.EH.search.mainDiv},${SEL.EH.search.resultTable}{max-width:9999px!important;min-width:0!important;justify-content:center;}`,
    `${SEL.EH.search.resultTr}.ehBatchActive{background-color:#669933!important;}`,
    `${SEL.EH.search.resultTr}:hover{background-color:#4a86e8!important;}`,
    `${SEL.EH.search.resultTr}.ehHover{background-color:#4a86e8!important;}`,
    `${SEL.EH.search.thumb}{position:fixed;left:0px!important;top:50%!important;visibility:hidden;transform:translateY(-50%);}`,
    `.ehTagNotice[name="Perma-ban"],${SEL.EH.info.tagDiv}[name="Perma-ban"]{color:#00f;background-color:#f00;}`,
    `.ehTagNotice[name="Unlike"],${SEL.EH.info.tagDiv}[name="Unlike"]{color:#f00;background-color:#00f;}`,
    `.ehTagNotice[name="Alert"],${SEL.EH.info.tagDiv}[name="Alert"]{color:#ff0;background-color:#080;}`,
    `.ehTagNotice[name="Like"],${SEL.EH.info.tagDiv}[name="Like"]{color:#000;background-color:#0ff;}`,
    `${SEL.EH.info.previewDiv} [name="intro"]{white-space:nowrap;}`,
    `${SEL.EH.info.previewDiv} [name="intro"][on="true"]::after{content:"Block: " attr(file);}`,
    `${SEL.EH.info.previewDiv} [name="intro"][on="false"]::after{content:"Unblock: " attr(file);}`,

    // unknown
    // '.ih>li{margin:0 2px;cursor:pointer;list-style:none;}',
    // '.ih>li::before{content:attr(name) ": ";}',
    // '.ih>li>span{margin:1px;}'
  ].join('\n')).appendTo('head');
}

async function autoDownload(isEnd) { // 自动开始下载
  // isEnd false: 下载小图, true: 下载大图
  if (G.downloadSizeChanged) {
    if (G.imageD.length && G.imageS.length) {
      const imageSize = isEnd ? G.config.sizeD : G.config.sizeS;
      await changeEConfig('xr', imageSize);
      changeFav(G.favicon[imageSize]);
      $(SEL.EHD.pageRange).val(makeRange(isEnd ? G.imageD : G.imageS));
      G.imageEnd = isEnd;
    } else {
      G.downloadSizeChanged = false;
      $(SEL.EHD.pageRange).val(makeRange(G.imageD.length ? G.imageD : G.imageS));
    }
  }
  $(SEL.EHD.download).last().click();
}

function autoComplete() { // 自动填充
  let main = (G.config.acItem || 'language,artist,group,parody,character,cosplayer,female,male,mixed,other,reclass,temp').split(',');
  main = G.EHT.filter((i) => main.includes(i.namespace));
  $('<div class="ehDatalist"><ol start="0"></ol></div>').on('click', 'li', (e) => {
    const value = $(SEL.EH.search.keyword).val().split(/\s+/);
    value[value.length - 1] = e.target.textContent;
    $(SEL.EH.search.keyword).val(value.filter((i) => i).join(' ')).focus();
    $('.ehDatalist>ol').empty();
    $('.ehDatalist').show();
  }).appendTo($('form').has(SEL.EH.search.keyword));
  let lastValue;
  $(SEL.EH.search.keyword).attr('title', `当输入大于${G.config.acLength}个字符时，显示选单<br>使用主键盘区的数字/加减/方向键快速选择<br>点击/Enter/Insert键填充<br>使用输入法时，无法使用数字/加减选择`).attr('autocomplete', 'off').on({
    focusin() {
      $('.ehDatalist').show();
    },
    focusout() {
      setTimeout(() => {
        $('.ehDatalist').hide();
      }, 100);
    },
    keydown(e) {
      const hasItem = $('.ehDatalist li').length;
      let onItem = $('.ehDatalistHover').index();
      if (hasItem && e.keyCode <= 57 && e.keyCode >= 48) { // 选择选项: 0-9
        e.preventDefault();
        $('.ehDatalist li').eq(e.keyCode - 48).click();
      } else if (hasItem && [187, 189, 37, 38, 39, 40].includes(e.keyCode)) { // 选择选项: 加减/方向键
        e.preventDefault();
        if ([187, 40].includes(e.keyCode)) { // 选择选项: +下
          onItem = onItem + 1;
        } else if ([189, 38].includes(e.keyCode)) { // 选择选项: -上
          onItem = onItem - 1;
        } else if (e.keyCode === 39) { // 选择选项: 右
          onItem = onItem + 10;
        } else if (e.keyCode === 37) { // 选择选项: 左
          onItem = onItem - 10;
        }
        if (onItem < 0) {
          onItem = 0;
        } else if (onItem > hasItem - 1) {
          onItem = hasItem - 1;
        }
        $('.ehDatalist li').removeClass('ehDatalistHover');
        $('.ehDatalist li').eq(onItem).addClass('ehDatalistHover');
        $('.ehDatalist').scrollTop($('.ehDatalistHover').position().top - $('.ehDatalist>ol').position().top - 150 + $('.ehDatalistHover').height() / 2);
      } else if (onItem >= 0 && [13, 45].includes(e.keyCode)) { // 选择选项: Insert
        e.preventDefault();
        $('.ehDatalistHover').click();
      }
    },
    keyup(e) {
      let value = e.target.value.split(/\s+/);
      value = value[value.length - 1];
      if (value === lastValue) return;
      $('.ehDatalist>ol').empty();
      if (!value || (value.length <= G.config.acLength && !value.match(/[\u4e00-\u9fa5]/))) return;
      lastValue = value;
      value = new RegExp(reEscape(value), 'i');
      main.forEach((i) => {
        for (const key in i.data) {
          if (key.match(value) || i.data[key].name.match(value)) {
            $(`<li cname="${i.data[key].name}">${i.namespace}:"${key}$"</li>`).appendTo('.ehDatalist>ol');
          }
        }
      });
      $('.ehDatalist').show();
    },
  });
}

function batchDownload() { // 批量下载
  $(`<th><input type="checkbox" tooltip="${htmlEscape('左键/Ctrl+A: 全选（当前表）<br>右键/Ctrl+D: 反选（当前表）<br>Shift+左键/Shift+A: 全选（所有表）<br>Shift+右键/Shift+D: 反选（所有表）')}"></th>`).appendTo(SEL.EH.search.resultHead);
  $(SEL.EH.search.resultHead).find('th:last-child>input[type="checkbox"]').on('mousedown', (e) => {
    const root = e.shiftKey ? document : $(e.target).parents().filter(SEL.EH.search.resultTable);
    if (e.button === 0) {
      const { checked } = e.target;
      $(root).find('tr').filter(SEL.EH.search.resultContent).find('td:last-child>input[type="checkbox"]:visible')
        .prop('checked', !checked);
      $(root).find('tr').filter(SEL.EH.search.resultContent).filter(':visible:not(.ehCheckContainer)')
        .toggleClass('ehBatchActive', !checked);
    } else if (e.button === 2) {
      $(root).find('tr').filter(SEL.EH.search.resultContent).find('td:last-child>input[type="checkbox"]:visible')
        .toArray()
        .forEach((i) => {
          const { checked } = i;
          i.checked = !checked;
          $(i).parents().filter(SEL.EH.search.resultContent).toggleClass('ehBatchActive', !checked);
        });
      e.target.checked = !e.target.checked;
    }
    e.preventDefault();
  });
  $('body').on('keydown', (e) => {
    if (['text', 'number', 'textarea', 'password'].includes(e.target.type)) return;
    if (!e.originalEvent.code.match(/^(Key|Digit|Numpad|Arrow)(.*)$/)) return;

    const key = e.originalEvent.code.match(/^(Key|Digit|Numpad|Arrow)(.*)$/)[2];
    if (e.ctrlKey && key === 'A') {
      const checkboxs = $(SEL.EH.search.resultHead).find('th:last-child>input[type="checkbox"]');

      if (checkboxs.not(':checked').length) {
        const event = jQuery.Event('mousedown');
        event.button = 0;
        checkboxs.not(':checked').eq(0).trigger(event).trigger('click');
      }
    } else if (e.ctrlKey && key === 'D') {
      const checkboxs = $(SEL.EH.search.resultHead).find('th:last-child>input[type="checkbox"]');

      if (checkboxs.filter(':checked').length) {
        const event = jQuery.Event('mousedown');
        event.button = 2;
        checkboxs.filter(':checked').eq(0).trigger(event);
      }
    } else if (e.shiftKey && key === 'A') {
      const event = jQuery.Event('mousedown');
      event.button = 0;
      event.shiftKey = true;
      $(SEL.EH.search.resultHead).find('th:last-child>input[type="checkbox"]').eq(0).trigger(event)
        .trigger('click');
    } else if (e.shiftKey && key === 'D') {
      const event = jQuery.Event('mousedown');
      event.button = 2;
      event.shiftKey = true;
      $(SEL.EH.search.resultHead).find('th:last-child>input[type="checkbox"]').eq(0).trigger(event);
    } else if (['Up', 'Down'].includes(key)) {
      const arr = $(SEL.EH.search.resultContent).filter(`:has(${SEL.EH.search.nameTd})`).filter(':visible');
      const elem = arr.filter('.ehHover');
      let index = elem.length ? arr.index(elem) : window.hoverLast === undefined ? -1 : window.hoverLast;
      index = ['Up'].includes(key) ? index - 1 : index + 1;
      window.hoverLast = index;
      while (index > arr.length) index = index - arr.length;
      while (index < -1) index = index + 1 + arr.length;
      elem.removeClass('ehHover').find(SEL.EH.search.nameTd).trigger('mouseout');
      if (index >= 0 && arr.eq(index).length) {
        arr.eq(index).addClass('ehHover').find(SEL.EH.search.nameTd).trigger('mouseover');
        arr.eq(index).get(0).scrollIntoView();

        // tagPreview
        const event = jQuery.Event('mousemove');
        event.target = arr.eq(index).find(SEL.EH.search.galleryA).get(0);
        event.clientX = $(event.target).offset().left - document.documentElement.scrollLeft + $(event.target).width() / 2;
        event.clientY = $(event.target).offset().top - document.documentElement.scrollTop + $(event.target).height();
        $('body').trigger(event);
      } else {
        $('.ehTagPreview').hide();
      }
    } else if ($('.ehHover').length && ['Right', 'Add'].includes(key)) {
      $('.ehHover').find('td:last-child>input[type="checkbox"]:visible').prop('checked', false).trigger('click');
    } else if ($('.ehHover').length && ['Left', 'Subtract'].includes(key)) {
      $('.ehHover').find('td:last-child>input[type="checkbox"]:visible').prop('checked', true).trigger('click');
    } else {
      return;
    }
    e.preventDefault();
  });
  $(window).on('blur mousedown', (e) => {
    if ($('.ehHover').length === 0) return;
    $('.ehHover').removeClass('ehHover').find(SEL.EH.search.nameTd).trigger('mouseout');
    $('.ehTagPreview').hide();
  });
  $(`<td title="${htmlEscape('上下键:切换行<br>左右/+-键:切换勾选状态<br>注: 因鼠标问题，预览图可能并非显示正确<br>点击/失去焦点时，隐藏')}"><input type="checkbox"></td>`).appendTo($(SEL.EH.search.resultContent).filter(':not(.ehCheckContainer)'));
  $(SEL.EH.search.resultContent).filter(':not(.ehCheckContainer)').on('click', (e) => {
    if ($(e.target).is('a,input') || $(e.target).parents().filter('a,input').length) return;
    $(e.currentTarget).find('td:last-child>input[type="checkbox"]').click();
  });
  $(SEL.EH.search.resultContent).find('td:last-child>input[type="checkbox"]').on('click', (e) => {
    $(e.target).parentsUntil('tbody').eq(-1).toggleClass('ehBatchActive', e.target.checked);
  });
}

const generateInfo = () => {
  let infoStr = '';
  infoStr = `${infoStr}${$(SEL.EH.info.title).text()}\n`;
  infoStr = `${infoStr}${$(SEL.EH.info.titleJp).text()}\n`;
  infoStr = `${infoStr}${window.location.href}\n\n`;

  infoStr = `${infoStr}Category: ${$(SEL.EH.info.infoCategory).eq(0).text().trim()}\n`;
  infoStr = `${infoStr}Uploader: ${$(SEL.EH.info.infoUploader).eq(0).text()}\n`;

  $(SEL.EH.info.infoDetailTr).toArray().forEach((i) => {
    const c1 = $(SEL.EH.info.infoDetailKey, i).eq(0).text();
    const c2 = $(SEL.EH.info.infoDetailValue, i).eq(0).text();
    infoStr = `${infoStr}${c1} ${c2}\n`;
  });

  infoStr = `${infoStr}Rating: ${unsafeWindow.average_rating}\n\n`;

  infoStr = `${infoStr}Tags:\n`;
  $(SEL.EH.info.tagTr).toArray().forEach((i) => {
    infoStr = `${infoStr}> ${$(SEL.EH.info.tagKey, i).text()} `;
    infoStr = `${infoStr}${$(SEL.EH.info.tagDiv, i).toArray().map((i) => i.textContent).join(', ')}\n`;
  });
  infoStr = `${infoStr}\n`;

  if ($(SEL.EH.info.uploaderComment).length) infoStr = `${infoStr}Uploader Comment:\n${$(SEL.EH.info.uploaderComment).html().replace(/<br>|<br \/>/gi, '\n')}\n\n`;

  $(SEL.EH.info.previewImg).toArray().forEach((i) => {
    infoStr = `${infoStr}\n\nPage ${i.alt}: ${$(i).parent().attr('href')}\n`;
    const title = $(i).attr('title') || $(i).attr('raw-title');
    infoStr = `${infoStr}Image ${i.alt}: ${title.match(/^Page \d+: (.*)$/)[1]}`;
  });

  infoStr = `${infoStr}\n\nDownloaded at ${new Date()}\n\nGenerated by E-Hentai Downloader. https://github.com/ccloli/E-Hentai-Downloader`;

  infoStr = infoStr.replace(/\n/g, '\r\n');
  return htmlUnescape(infoStr);
};

function btnFake() { // 按钮 -> 下载空文档(信息页)
  $(`<button title="${htmlEscape('下载一个 <span class="ehHighlight">名称.cbz</span> 的空文档')}">Fake</button>`).on('mousedown', async (e) => {
    const zip = new JSZip();
    zip.file('info.txt', generateInfo());
    const file = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    });
    saveAs2(file, `${$(SEL.EH.info.title).text()}.cbz`);
  }).appendTo('.ehNavBar>div:nth-child(1)');
}

function btnFake2() { // 按钮 -> 下载空文档(搜索页)
  $(`<button title="${htmlEscape('下载一个 <span class="ehHighlight">名称.cbz</span> 的空文档')}">Fake</button>`).on('mousedown', async (e) => {
    for (const i of $('.ehBatchActive:visible').toArray()) {
      const gid = $(i).find(SEL.EH.search.thumb).attr('id').match(/\d+/)[0] * 1;
      const meta = G.gmetadata.find((i) => i.gid === gid);
      let language = meta.tags.find((i) => i.match(/^language:(.*)/) && i !== 'language:translated');
      language = language ? language.match(/^language:(.*)/)[1] : 'japanese';
      language = language.substr(0, 1).toUpperCase() + language.substr(1);
      let tags = {};
      for (const tag of meta.tags) {
        const [, main, , sub] = tag.match(/(language|artist|group|parody|character|cosplayer|female|male|mixed|other|reclass|temp)?(:)?(.*)/);
        if (!(main in tags)) tags[main] = [];
        tags[main].push(sub);
      }
      tags = Object.keys(tags).map((i) => `> ${i}: ${tags[i].join(', ')}`);
      const info = [
        $(i).find(SEL.EH.search.galleryA).text(),
        meta.title_jpn,
        `${window.location.origin}/g/${meta.gid}/${meta.token}/`,
        '',
        `Category: ${meta.category}`,
        `Uploader: ${meta.uploader}`,
        `Posted: ${$(i).find(SEL.EH.search.postedTime).text()}`,
        'Parent: None',
        `Visible: ${meta.expunged ? 'No' : 'Yes'}`,
        `Language: ${language} ${meta.tags.includes('language:translated') ? 'TR' : ''}`,
        `File Size: ${Math.ceil(meta.filesize / 1024 / 1024)} MB`,
        `Length: ${meta.filecount} pages`,
        'Favorited: 0 times',
        `Rating: ${meta.rating}`,
        '',
        'Tags:',
        ...tags,
        '',
        `Downloaded at ${new Date().toString()}`,
        '',
        'Generated by E-Hentai Downloader. https://github.com/ccloli/E-Hentai-Downloader',
      ].join('\r\n');
      const zip = new JSZip();
      zip.file('info.txt', info);
      const file = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      });
      saveAs2(file, `${$(i).find(SEL.EH.search.galleryA).text()}.cbz`);
      await waitFor(() => false, 100);
    }
  }).appendTo('.ehNavBar>div:nth-child(1)');
}

function btnInfoText() { // 按钮 -> 下载info.txt(信息页)
  $(`<button title="${htmlEscape('下载一个 <span class="ehHighlight">info.txt</span>')}">info.txt</button>`).on('mousedown', () => {
    saveAs2(generateInfo(), 'info.txt');
  }).appendTo('.ehNavBar>div:nth-child(1)');
}

function btnSearch() { // 按钮 -> 搜索(信息页)
  let text = $(SEL.EH.info.title).text() || $(SEL.EH.info.titleJp).text();
  if (text === '') return;
  $('<div class="ehSearch"></div>').insertAfter(SEL.EH.info.titleJp);
  text = text.split(/[[\](){}【】|\-\d]+/);
  for (let i = 0; i < text.length; i++) {
    text[i] = text[i].trim();
    if (text[i]) $('<span></span>').html(`<input id="ehSearch_${i}" type="checkbox"><label for="ehSearch_${i}">${text[i]}</label>`).appendTo('.ehSearch');
  }
  $('<button title="搜索">Search</button>').appendTo('.ehSearch').click(() => {
    const keyword = $('.ehSearch input:checked+label').toArray().map((i) => `"${i.textContent}"`).join(' ');
    if (keyword.length > 0) openUrl(G.config.searchArguments.replace(/{q}/g, encodeURIComponent(keyword)));
  });
}

function btnSearch2() { // 按钮 -> 搜索(搜索页)
  $('<div class="btnSearch"></div>').attr('title', G.config.searchEventChs).prependTo(SEL.EH.search.nameTd).on({
    contextmenu: () => false,
    mousedown: (e) => {
      const event = G.config.searchEvent.split('|').filter((i) => i.match(new RegExp(`^${e.button},`)));
      for (let i = 0; i < event.length; i++) {
        const arr = event[i].split(',');
        const keydown = arr[1] === '-1' ? true : e[['altKey', 'ctrlKey', 'shiftKey'][arr[1]]];
        if (keydown) {
          let name;
          const gid = $(e.target).parentsUntil(SEL.EH.search.resultTbody).eq(-1).find(SEL.EH.search.galleryA)
            .attr('href')
            .match(/\/g\/(\d+)/)[1] * 1;
          const tags = G.gmetadata.filter((i) => i.gid === gid)[0].tags.map((i) => `${i.replace(/^(\w+:)/, '$1"')}$"`);
          if (arr[2] === '-1') {
            const order = window.prompt(tags.map((i, j) => `${j}: ${translateText(i)}`).join('\n'));
            if (order) {
              name = tags[order];
            } else {
              return;
            }
          } else if (arr[2] === '0') {
            name = $(e.target).parentsUntil(SEL.EH.search.resultTbody).eq(-1).find(SEL.EH.search.galleryA)
              .text();
            name = name.replace(/\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）|-|!/g, '').replace(/\|.*/, '').trim();
            name = `"${name}"`;
          } else if (arr[2] === '1' && tags.filter((i) => i.match(/^(artist|group):/)).length) {
            name = tags.filter((i) => i.match(/^artist:/)).length ? tags.filter((i) => i.match(/^artist:/))[0] : tags.filter((i) => i.match(/^group:/))[0];
          } else {
            return;
          }
          if (arr[3] === '1') name = `${name} language:chinese$`;
          openUrl(G.config.searchArguments.replace(/{q}/g, encodeURIComponent(name)));
          break;
        }
      }
    },
  });
}

function btnSearch2Highlight() {
  const check = () => {
    const list = GM_getValue('checkList', {});
    const listKeys = Object.keys(list);
    const now = new Date().getTime();
    const filtered = G.gmetadata;
    for (const info of filtered) {
      const artist = info.tags.filter((tag) => tag.match(/^artist:/));
      const group = info.tags.filter((tag) => tag.match(/^group:/));
      let regexp;
      if (artist.length === 1) {
        regexp = new RegExp(`artist:("?)${artist[0].match(/^artist:(.*)$/)[1]}\\$?\\1`, 'gi');
        // } else if (group.length === 1) {
        //   regexp = new RegExp(`group:("?)${group[0].match(/^group:(.*)$/)[1]}\\$?\\1`, 'gi');
      } else if (artist.length === 0 && group.length === 0) {
        $(SEL.EH.search.resultContent).filter(`:has([href*="/${info.gid}/${info.token}/"])`).find('.btnSearch').css('background-color', 'green');
        continue;
      } else {
        const arr = artist.length ? artist : group;
        const filtered = arr.filter((text) => {
          const main = text.match(/^artist:(.*)$/) ? 'artist' : 'group';
          const regexp = new RegExp(`${main}:("?)${text.match(/^\w+:(.*)$/)[1]}\\$?\\1`, 'gi');
          const find = listKeys.find((i) => i.match(regexp));
          if (find && now - list[find].time <= 30 * 24 * 60 * 60 * 1000) return true;
        });
        if (arr.length === filtered.length) {
          $(SEL.EH.search.resultContent).filter(`:has([href*="/${info.gid}/${info.token}/"])`).find('.btnSearch').css('background-color', 'green');
        } else {
          $(SEL.EH.search.resultContent).filter(`:has([href*="/${info.gid}/${info.token}/"])`).find('.btnSearch').css('background-color', 'orange');
          filtered.forEach((i) => {
            info.tags.splice(info.tags.indexOf(i), 1);
          });
        }
        continue;
      }
      const find = listKeys.find((i) => i.match(regexp));
      if (find && now - list[find].time <= 30 * 24 * 60 * 60 * 1000) {
        $(SEL.EH.search.resultContent).filter(`:has([href*="/${info.gid}/${info.token}/"])`).find('.btnSearch').css('background-color', 'green');
      }
    }
  };
  $('<button>Check Search</button>').on('click', () => {
    check();
    $(SEL.EH.search.resultContent).filter(':has(.ehExist[name^="force"])').filter(':has(.btnSearch[style="background-color: green;"])').hide();
  }).appendTo('.ehNavBar>div:nth-child(2)');

  check();
}

function btnTask() { // 按钮 -> 添加到下载列表(信息页)
  $(`<button key-code="Z" key-event="mousedown" tooltip="${htmlEscape('左键: 添加到下载列表<br>中键: 重试失败列表<br>右键: 从下载列表删除')}">Add Task</button>`).on({
    mousedown: (e) => {
      if (e.button === 0) {
        const task = GM_getValue('task', []);
        const tasking = GM_getValue('tasking');
        const url = window.location.href.replace(/#\d+$/, '');
        if (!(task.includes(url)) && tasking === url) {
          task.push(url);
          GM_setValue('task', task);
          $(e.target).attr('content-after', '[+1]');
        }
      } else if (e.button === 1) {
        const task = [].concat(GM_getValue('task', []), GM_getValue('taskFailed', [])).filter((item, index, array) => array.indexOf(item) === index);
        GM_setValue('task', task);
        GM_deleteValue('taskFailed');
      } else if (e.button === 2) {
        const task = GM_getValue('task', []);
        const url = window.location.href.replace(/#\d+$/, '');
        if (task.includes(url)) {
          task.splice(task.indexOf(url), 1);
          GM_setValue('task', task);
          $(e.target).attr('content-after', '[-1]');
        }
      }
      setTimeout(() => {
        $(e.target).attr('content-after', null);
      }, 800);
    },
    mouseenter: (e) => {
      const task = GM_getValue('task', []);
      const taskFailed = GM_getValue('taskFailed', []);
      $(e.target).attr('title', `当前任务:<br> ${GM_getValue('tasking', '')}<hr>当前任务列表: ${task.length}<br> ${task.join('<br> ')}<hr>当前任务列表-失败: ${taskFailed.length}<br> ${taskFailed.join('<br> ')}`);
    },
  }).appendTo('.ehNavBar>div:nth-child(3)');
}

function btnTask2() { // 按钮 -> 添加到下载列表(搜索页)
  $(`<button key-code="Z" key-event="mousedown" tooltip="${htmlEscape('左键: 添加到下载列表<br>中键: 重试失败列表<br>右键: 从下载列表删除')}">Add Task</button>`).on({
    mousedown: (e) => {
      if (e.button === 0) {
        const task = GM_getValue('task', []);
        const tasking = GM_getValue('tasking');
        let count = 0;
        $('.ehBatchActive:visible').find(SEL.EH.search.galleryA).toArray().forEach((i) => {
          if (!(task.includes(i.href)) && i.href !== tasking) {
            task.push(i.href);
            count = count + 1;
          }
        });
        GM_setValue('task', task);
        $(e.target).attr('content-after', `[+${count}]`);
      } else if (e.button === 1) {
        const task = [].concat(GM_getValue('task', []), GM_getValue('taskFailed', [])).filter((item, index, array) => array.indexOf(item) === index);
        GM_setValue('task', task);
        GM_deleteValue('taskFailed');
      } else if (e.button === 2) {
        const task = GM_getValue('task', []);
        let count = 0;
        $('.ehBatchActive:visible').find(SEL.EH.search.galleryA).toArray().forEach((i) => {
          if (task.includes(i.href)) {
            task.splice(task.indexOf(i.href), 1);
            count++;
          }
        });
        GM_setValue('task', task);
        $(e.target).attr('content-after', `[-${count}]`);
      }
      setTimeout(() => {
        $(e.target).attr('content-after', null);
      }, 800);
    },
    mouseenter: (e) => {
      const task = GM_getValue('task', []);
      const taskFailed = GM_getValue('taskFailed', []);
      $(e.target).attr('title', `当前任务:<br> ${GM_getValue('tasking', '')}<hr>当前任务列表: ${task.length}<br> ${task.join('<br> ')}<hr>当前任务列表-失败: ${taskFailed.length}<br> ${taskFailed.join('<br> ')}`);
    },
  }).appendTo('.ehNavBar>div:nth-child(3)');
}

function calcRelativeTime(time) { // 计算相对时间
  const delta = new Date().getTime() - new Date(time).getTime();
  const info = {
    millisecond: 1,
    second: 1000,
    minute: 60,
    hour: 60,
    day: 24,
    month: 30,
    year: 12,
  };
  let suf;
  let t = delta;
  for (const i in info) {
    const m = t / info[i]; // 倍数
    const r = t % info[i]; // 语数
    if (m >= 1 || info[i] - r <= 2) { // 进阶
      t = m;
      suf = i;
    } else {
      break;
    }
  }
  t = Math.round(t);
  let text = `about ${t} ${suf}${t > 1 ? 's' : ''} ago`;
  if (delta <= 1000 * 60 * 60 * 24 * 30) text = `<span class="ehHighlight">${text}</span>`;
  return text;
}

async function changeEConfig(key, value) { // 修改EH设置
  let uconfig;
  if (G.config.uconfig) {
    uconfig = G.config.uconfig;
  } else {
    uconfig = await getEConfig();
  }
  uconfig = `${uconfig.replace(new RegExp(`${key}=.*?(&|$)`), `${key}=${value}$1`)}&apply=Apply`;
  await xhrSync('/uconfig.php', uconfig);
}

function changeFav(url) { // 修改Favicon
  if ($('[rel="shortcut icon"]').length === 0) {
    $(`<link rel="shortcut icon" href="${url}" type="image/x-icon">`).appendTo('head');
  } else {
    $('[rel="shortcut icon"]').attr('href', url);
  }
}

function changeName(e) { // 修改本子标题（删除集会名、替换其中的罗马数字）
  // test https://exhentai.org/?f_search=%22Fugudoku%22+%22Katou+Fuguo%22+%22Surudake%22&f_sh=on

  $(e).toArray().forEach((i) => {
    let title = fullWidth2Half(i.textContent).replace(/^\(.*?\)\s*/, '').replace(/\p{Extended_Pictographic}/gu, '').trim()
      .replace(/\s+/g, ' ');
    title = title.replace(/[\000-\037\177]+/g, ''); // https://en.wikipedia.org/wiki/ASCII#End_of_File/Stream
    // if (G.config.checkExist === 'everything')
    title = title.replace(/[\\/:*?"<>|\n]/g, '-'); // 修改路径不支持的字符
    i.textContent = title.trim();

    // 去除标题中首尾的信息，如作者，组织，原作，语言，翻译组
    const titleJp = G.infoPage ? $(SEL.EH.info.titleJp).text() : G.gmetadata.filter((j) => j.gid === i.href.match(/g\/(\d+)\//)[1] * 1)[0].title_jpn;
    let mainTitleJp = removeOtherInfo(titleJp);
    mainTitleJp = removeOtherInfo(mainTitleJp, true);

    let digitalRomajiJpRe = Object.values(G.digitalRomaji).map((i) => i[1].join('|')).join('|');
    digitalRomajiJpRe = new RegExp(`(${digitalRomajiJpRe})(\\W+|$)`);

    if (!mainTitleJp.match(digitalRomajiJpRe)) return;

    let mainTitle = removeOtherInfo(title);
    mainTitle = removeOtherInfo(mainTitle, true);
    mainTitle = mainTitle.replace(/[|~].*/, '').replace(/\s+/g, ' ').trim();

    const index = title.indexOf(mainTitle);
    const prefix = title.substr(0, index);
    const suffix = title.substr(index + mainTitle.length);

    const mianTitleArr = mainTitle.split(/\s+/).reverse();
    for (let i = 0; i < mianTitleArr.length; i++) {
      const text = mianTitleArr[i];

      let re = G.digitalRomaji[10][0].join('|');
      re = new RegExp(`(${re})`, 'i');
      if (text.match(re)) {
        const arr = text.split(re).filter((i) => i);
        if (arr.length > 1) {
          let digitalRomajiRe = Object.values(G.digitalRomaji).map((i) => i[0].join('|')).join('|');
          digitalRomajiRe = new RegExp(`(\\W+|^)(${digitalRomajiRe})(\\W+|$)`, 'i');
          if (arr.every((j) => j.match(digitalRomajiRe))) {
            mianTitleArr.splice(i, 1, ...arr.reverse());
            i--;
            continue;
          }
        }
      }

      let matched = false;
      for (const j in G.digitalRomaji) {
        let re = G.digitalRomaji[j][0].join('|');
        re = new RegExp(`^(${re})(\\W+|$)`, 'i');
        if (!text.match(re)) continue;
        matched = true;
        mianTitleArr[i] = text.replace(re, `${G.digitalRomaji[j][1][0]}$2`);

        if (i > 0 && mianTitleArr[i].match(/^\d+$/) && mianTitleArr[i - 1].match(/^(\d+)(\W+)$/)) {
          const number1 = mianTitleArr[i] * 1;
          const re0 = mianTitleArr[i - 1].match(/^(\d+)(\W+)$/);
          const number0 = re0[1] * 1;
          mianTitleArr[i - 1] = number1 < 10 && number0 < 10 ? number1.toString() + number0.toString() : (number1 + number0).toString();
          mianTitleArr[i - 1] += re0[2];
          mianTitleArr.splice(i, 1);
          i--;
        }
        break;
      }
      if (!matched) break;
    }
    mainTitle = mianTitleArr.reverse().join(' ');

    i.textContent = `${prefix} ${mainTitle} ${suffix}`.replace(/\s+/g, ' ').trim();
  });
}

function checkExist() { // 检查本地是否存在
  if (G.config.hideExist) {
    $('<button class="ehHideExist" status="Hide">Hide Exist: 0</button>').on({
      click: (e) => {
        const status = $(e.target).attr('status');
        const ele = $(SEL.EH.search.resultTr).filter(':has(.ehExist[name^="force"])');
        ele.toggle(status === 'Hide');
        const now = status === 'Hide' ? 'Show' : 'Hide';
        $(e.target).attr('status', now).text(`${now} Exist: ${ele.length}`);
      },
      dblclick: (e) => {
        const status = $(e.target).attr('status');
        const ele = $(SEL.EH.search.resultTr).filter(':has(.ehExist[name^="force"])');
        ele.toggle($(e.target).attr('status') !== 'Hide');
        $(e.target).text(`${status} Exist: ${ele.length}`);
      },
    }).appendTo(SEL.EH.search.resultTotal);
  }
  $('<div class="ehExistContainer"></div>').appendTo('.ehContainer');
  $('<button name="checkExist" title="只检查可见的，且之前检查无结果">Check Exist</button>').on('click', async (e) => {
    const langRE = /\[(Chinese|English|Digital)\].*/gi;
    const uncensoredRe = /\[(Decensored|無修正?|无修|Colorized)\]/i;

    $(e.target).text('Checking').prop('disabled', true);
    const lst = $(SEL.EH.search.resultTr).filter(':visible').not(':has(.ehExist[name^="force"])').find(SEL.EH.search.galleryA)
      .toArray();
    const name = {};
    lst.forEach((i, j) => {
      if (!i.gid) {
        i.gid = i.href.split('/')[4] * 1;
        const info = G.gmetadata.find((j) => j.gid === i.gid);
        i.title_jpn_main = info.title_jpn.replace(langRE, '');
        i.title_jpn_main = removeOtherInfo(removeOtherInfo(i.title_jpn_main), true);
        i.translated = info.tags.includes('language:translated');
        i.title_jpn_main_nohyphen = i.translated && i.title_jpn_main && !i.title_jpn_main.match('-');
        i.pages = info.filecount * 1;
      }
      if (G.config.checkExistName2) {
        name[j] = i.textContent.replace(G.uselessStrRE, '').replace(/\|.*/g, '').replace(/\|/g, '-').replace(/\.$/, '')
          .trim();
      } else {
        let text = i.textContent.replace(/\s+/g, ' ');
        text = removeOtherInfo(text.replace(langRE, ''), true, ['[]', '{}', '【】']); // 移除其他信息，如：图源、语言、汉化组等
        text = text.replace(/\|.*?([([{【［（]|$)/g, '$1'); // 移除译名
        if (i.title_jpn_main_nohyphen) text = text.replace(/\s-\s.*?([([{【［（]|$)/g, ' $1'); // 移除译名
        if (G.config.checkExist === 'everything') text = text.replace(/\|/g, '-'); // 移除文件名中不允许的字符
        const arr = text.split(G.punctuationRegExp).map((i) => i.trim().replace(/\.$/, '').trim()).filter((i) => i);
        name[j] = Array.from(new Set(arr)).join();
        if (name[j] === '') name[j] = i.textContent.replace(/\s+/g, ' ');
      }
    });
    try {
      const res = await xhrSync(G.config.checkExistSever, `names=${encodeURIComponent(JSON.stringify(name))}`, {
        responseType: 'json',
        timeout: 60 * 60 * 1000,
      });
      lst.forEach((i, j) => {
        if (res.response[j].length === 0) return;
        let name = i.textContent.replace(/\s+/g, ' ');
        let name2 = name.replace(/\|.*?([([{【［（]|$)/g, '$1');
        if (i.title_jpn_main_nohyphen) name2 = name2.replace(/\s-\s.*?([([{【［（]|$)/g, ' $1');
        if (G.config.checkExist === 'everything') name = name.replace(/\|/g, '-');
        if (G.config.checkExist === 'everything') name2 = name2.replace(/\|/g, '-');
        const name3 = removeOtherInfo(name.replace(langRE, ''), true, ['[]', '{}', '【】']).replace(/\.$/, '').trim();
        const name4 = removeOtherInfo(name2.replace(langRE, ''), true, ['[]', '{}', '【】']).replace(/\.$/, '').trim();
        name = name.replace(/\.$/, '').trim();
        name2 = name2.replace(/\.$/, '').trim();
        res.response[j].forEach((k) => {
          let fileSize, fileName, filePages,
            gid;
          if (G.config.checkExist === 'everything') {
            fileSize = k.size;
            fileName = k.name;
            filePages = 0;
            gid = 0;
          } else if (G.config.checkExist === 'mysql') {
            fileSize = (k.size / 1024 / 1024).toFixed(2);
            fileName = k.title;
            filePages = k.pages;
            gid = k.web.split('/')[4] * 1;
          }
          const noExt = fileName.replace(/\.(zip|cbz|rar|cbr)$/, '').replace(/\s+/g, ' ').trim();
          const noExtRE = new RegExp(`^${reEscape(noExt).replace(/_/g, '.')}$`, 'i');
          let noExt2 = noExt.replace(/\|.*?([([{【［（]|$)/g, '$1');
          if (i.title_jpn_main_nohyphen || (noExt.match(/(chinese|漢化|汉化|中文|中国翻訳|中国語|中国语)/i) && noExt.match(/\s-\s*[^[\](){}]*\p{Unified_Ideograph}/u))) noExt2 = noExt2.replace(/\s-\s.*?([([{【［（]|$)/g, ' $1');
          // const noExt2RE = new RegExp('^' + reEscape(noExt2).replace(/_/g, '.') + '$', 'i');
          const noLang = removeOtherInfo(noExt2, true, ['[]', '{}', '【】']);
          const noLangRE = new RegExp(`^${reEscape(noLang).replace(/_/g, '.')}$`, 'i');
          const p = $(i).parent().find('.ehExistContainer');
          let _name;
          if (gid === i.gid || noExtRE.exec(name) || noExtRE.exec(name2)) {
            _name = 'force';
          } else if ((!noExt.match(/(chinese|漢化|汉化|中文|中国翻訳|中国語|中国语)/i) || noExt.match(/(机翻)/i)) && (name.match(/(chinese|漢化|汉化|中文|中国翻訳|中国語|中国语)/i))) {
            _name = 'notchinese';
          } else if (noLangRE.exec(name3) || noLangRE.exec(name4)) {
            if (!noExt.match(/(chinese|漢化|汉化|中文|中国翻訳|中国語|中国语)/i) || noExt.match(/(机翻)/i)) {
              _name = 'force-notchinese';
            } else if (noExt.match(/\[(Incomplete|Sample|Ongoing)\]/i) || (name.match(uncensoredRe) && !noExt.match(uncensoredRe))) {
              _name = 'incomplete';
            } else {
              _name = 'force-nolang';
            }
          } else {
            _name = '';
          }
          const diffThis = diff(name, noExt);
          if (!diffThis.filter((i) => i[0] && !i[1].match(G.punctuationWithWhiteAllRegExp)).length) _name = 'force';

          if (G.config.checkExistPages && ['force', 'force-nolang'].includes(_name) && filePages && i.pages && k.size > 1024 * filePages) {
            if (i.pages - filePages > Math.max(100, filePages) * (['force'].includes(_name) ? 0.05 : 0.1)) _name = 'incomplete';
          }

          const similar = diffThis.reduce((total, now) => total + (now[0] === 0 ? 0 : now[1].length), 0);

          let diffFlag = 0;
          let diffHTML = [['Remote: '], ['Exists: ']];

          for (let i = 0; i < diffThis.length; i++) {
            const arr = diffThis[i];
            if (arr[0] === 0) {
              if (diffFlag) diffHTML[diffFlag > 0 ? 1 : 0].push(`<span class="ehDiffNone">${' '.repeat(Math.abs(diffFlag))}</span>`);
              diffFlag = 0;
              diffHTML[0].push(arr[1]);
              diffHTML[1].push(arr[1]);
            } else if (arr[0] === -1) {
              diffHTML[0].push(`<span class="ehDiffDel">${arr[1]}</span>`);
              diffFlag = diffFlag + getStringSize(arr[1]);
            } else if (arr[0] === 1) {
              diffHTML[1].push(`<span class="ehDiffAdd">${arr[1]}</span>`);
              diffFlag = diffFlag - getStringSize(arr[1]);
            }
          }
          diffHTML = `<br><span class="ehPreLike">${diffHTML.map((i) => i.join('')).join('<hr>')}</span>`;
          if (noExt === name) diffHTML = '';

          if (p.find(`[copy="${htmlEscape(noExt)}"][fileSize="${fileSize}"]`).length === 0) {
            const elem = $(`<span class="ehExist" fileSize="${fileSize}" name="${_name}" copy="${htmlEscape(noExt)}" similar="${similar}" tooltip="EditDistance: ${similar}${htmlEscape(diffHTML)}" title="缺少${i.pages - filePages}P"></span>`);
            if (_name === 'force' || (_name.match(/^force/i) && p.find('[name^="force"]').length === 0)) {
              elem.prependTo(p);
            } else if (_name.match(/^force/i) && p.find('[name^="force"]').length) {
              elem.insertAfter(p.find('[name^="force"]').last());
            } else {
              elem.appendTo(p);
            }
          }
        });
      });
    } catch (err) {
      if (err.status === 0) {
        setNotification('checkExistSever', ' is not running');
      } else {
        console.error(err);
      }
    }
    $(e.target).text('Check Exist').prop('disabled', false);

    if (G.config.hideExist) {
      $('.ehHideExist').dblclick();
    }
  }).appendTo('.ehNavBar>div:nth-child(2)');
  $('<button title="隐藏force">Hide Force</button>').on('click', async (e) => {
    $(SEL.EH.search.resultContent).filter(':has(.ehExist[name="force"])').hide();
  }).appendTo('.ehNavBar>div:nth-child(2)');
}

function checkForNew() { // 检查有无新本子
  let searchKey;
  $('<div><a key-code="2" key-event="mousedown" href="javascript:;">Add to CheckList</a></div>').on({
    contextmenu: () => false,
    mousedown: (e) => {
      e.preventDefault();
      const keyword = $(SEL.EH.search.keyword).val();
      const list = GM_getValue('checkList', {});
      let name,
        nameInput;
      if (keyword in list && list[keyword].name) name = list[keyword].name;
      if (e.button === 0) {
        if (!name) name = translateText(keyword);
        nameInput = window.prompt(`请输入名称\n留空: ${name}`, name);
        if (nameInput === null) return;
      }
      let time = new Date().getTime();
      time = time - new Date(G.gmetadata[0].posted * 1000).getTime() <= 12 * 60 * 60 * 1000 ? new Date(G.gmetadata[0].posted * 1000).getTime() + 1 : time;
      list[keyword] = {
        time,
        result: $(SEL.EH.search.resultTotal).text().match(SEL.EH.search.resultTotalMatch) ? $(SEL.EH.search.resultTotal).text().match(SEL.EH.search.resultTotalMatch)[1].replace(/,/g, '') * 1 : 0,
      };
      if (nameInput || name !== translateText(keyword)) list[keyword].name = nameInput || name;
      GM_setValue('checkList', sortObj(list, 'time'));
    },
  }).appendTo(SEL.EH.common.navBar);
  $('<div><a key-code="3" key-event="click" href="javascript:;">Show CheckList</a></div>').on('click', (e) => {
    if ($('.ehCheckTableContainer').length) {
      $('.ehCheckTableContainer').toggle();
      return;
    }
    $('<div class="ehCheckTableContainer"></div>').html('<div>过滤: <input name="search" type="text"></div><div class="ehPages"></div><div class="ehCheckTable"><table><thead><tr><th>#</th><th>Keyword</th><th>Name</th><th><a class="ehCheckTableSort" href="javascript:;" name="time" title="sort by time">Time</a></th><th><a class="ehCheckTableSort" href="javascript:;" name="result" title="sort by result">Result</a></th><th><input name="selectAll" type="checkbox" title="全选"></th></tr></thead><tbody></tbody></table></div><div class="ehCheckTableBtn"></div>').appendTo('body');
    const buildBody = (filter = undefined) => {
      searchKey = filter;
      const list = GM_getValue('checkList', {});
      let keys = Object.keys(list);
      if (searchKey) {
        const searchKeyRE = new RegExp(searchKey, 'gi');
        keys = keys.map((i) => ({ key: i, ...list[i] })).filter((i) => i.key.match(searchKeyRE) || (i.name || translateText(i.key)).match(searchKeyRE)).map((i) => i.key);
      }
      const getSomeList = (page) => {
        $('.ehCheckTable tbody').empty();
        for (let key = (page - 1) * G.config.checkListPerPage; key < page * G.config.checkListPerPage; key++) {
          if (key >= keys.length) break;
          const i = keys[key];
          const tr = $('<tr><td></td><td></td><td></td><td></td><td></td><td><input type="checkbox"></td></tr>');
          $('<a target="_blank"></a>').attr('href', G.config.searchArguments.replace(/{q}/g, encodeURIComponent(i))).text(i).appendTo($(tr).find('td:eq(1)'));
          $(tr).find('td:eq(2)').text(list[i].name || translateText(i));
          let d = new Date(list[i].time);
          d = G.config.timeShow === 'iso' ? new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000) : d;
          const timeText = d.toLocaleString(navigator.language, { hour12: false });
          $(tr).find('td:eq(3)').html(`<time title="${timeText}" datetime="${list[i].time}">${calcRelativeTime(list[i].time)}</time>`);
          $(tr).find('td:eq(4)').text(list[i].result);
          $(tr).appendTo('.ehCheckTableContainer tbody');
        }
      };
      getSomeList(1);
      const pages = Math.ceil(keys.length / G.config.checkListPerPage);
      $('.ehPages').empty();
      if (pages > 1) {
        $('.ehPages').html([...Array(pages).keys()].map((i) => `<a name="${i + 1}"></a>`)).on('click', 'a', (e) => {
          $('.ehPages>a').removeClass('ehPagesHover');
          $(e.target).addClass('ehPagesHover');
          getSomeList(e.target.name);
        });
        $('.ehPages>a[name="1"]').addClass('ehPagesHover');
      }
    };
    buildBody(searchKey);
    $('.ehCheckTableContainer input[name="search"]').on('change', (e) => {
      buildBody(e.target.value);
    }).val(searchKey);
    $('.ehCheckTable th>input[name="selectAll"]').on('click', (e) => {
      $('.ehCheckTable td>input').prop('checked', e.target.checked);
    });
    $('.ehCheckTable .ehCheckTableSort').on('click', (e) => {
      const list = GM_getValue('checkList', {});
      GM_setValue('checkList', sortObj(list, e.target.name));
      $('.ehCheckTableContainer').remove();
      $(SEL.EH.common.navBar).find('a:contains("Show CheckList")').click();
    });
    $('<button title="反选">Select Invert</button>').on('click', () => {
      $('.ehCheckTable td>input').toArray().forEach((i) => {
        i.checked = !i.checked;
      });
    }).appendTo('.ehCheckTableBtn');
    $('<button title="移除">Delete</button>').on('click', () => {
      const list = GM_getValue('checkList', {});
      $('.ehCheckTable td>input:checked').toArray().forEach((i) => {
        const keyword = $(i).parentsUntil('tbody').eq(-1).find('td>a')
          .html();
        delete list[keyword];
      });
      GM_setValue('checkList', list);
      $('.ehCheckTableContainer').remove();
    }).appendTo('.ehCheckTableBtn');
    $('<button title="取消">Cancel</button>').on('click', () => {
      $('.ehCheckTableContainer').hide();
    }).appendTo('.ehCheckTableBtn');
  }).appendTo(SEL.EH.common.navBar);
  const keyword = $(SEL.EH.search.keyword).val();
  if (!keyword) return;
  const list = GM_getValue('checkList', {});
  if (!(keyword in list)) return;
  const info = list[keyword];
  const tr = $(SEL.EH.search.resultContent).toArray();
  let i;
  const { time } = info;
  for (i = 0; i < G.gmetadata.length; i++) {
    const d = new Date(G.gmetadata[i].posted * 1000);
    if (time > d.getTime()) break;
  }

  let d = new Date(info.time);
  d = G.config.timeShow === 'iso' ? new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000) : d;
  const timeText = d.toLocaleString(navigator.language, { hour12: false });

  const ele = $(`<tr class="ehCheckContainer gtr${(i === tr.length ? i - 1 : i) % 2 ? '0' : '1'}"><td colspan="${$(SEL.EH.search.resultHead).find('th').length}">Name: ${info.name || translateText(keyword)}<br>Last Check Time: <time title="${timeText}" datetime="${info.time}">${calcRelativeTime(info.time)}</time><br>Results: ${info.result}<br></td></tr>`);
  if (i === tr.length) {
    ele.insertAfter(tr[i - 1]);
  } else {
    ele.insertBefore(tr[i]);
  }

  $('<button title="移除该项">Delete</button>').click(() => {
    if (window.confirm(`确认移除: \n${keyword}`)) {
      const list = GM_getValue('checkList', {});
      delete list[keyword];
      GM_setValue('checkList', list);
    }
  }).appendTo('.ehCheckContainer>td');
  const result = $(SEL.EH.search.resultTotal).text().match(SEL.EH.search.resultTotalMatch) ? $(SEL.EH.search.resultTotal).text().match(SEL.EH.search.resultTotalMatch)[1].replace(/,/g, '') * 1 : 0;
  if (result - info.result <= G.config.autoUpdateCheck && !$(SEL.EH.search.pagePrev).length) {
    const updateCheck = () => {
      const list = GM_getValue('checkList', {});
      let time = new Date().getTime();
      time = time - new Date(G.gmetadata[0].posted * 1000).getTime() <= 12 * 60 * 60 * 1000 ? new Date(G.gmetadata[0].posted * 1000).getTime() + 1 : time;
      list[keyword] = {
        time,
        result,
      };
      if (info.name) list[keyword].name = info.name;
      GM_setValue('checkList', sortObj(list, 'time'));
      setNotification((info.name || translateText(keyword)), 'CheckList updated');
    };
    updateCheck();
    $(window).one('focus', updateCheck);
  }
}

async function checkImageSize() { // 检查图片尺寸
  const s = G.config.sizeS;
  const d = G.config.sizeD;
  const imageSize = await getEConfig('xr');
  let numD = 0; // 双页
  $(SEL.EH.info.previewImg).toArray().forEach((i, j) => {
    if ($(i).is($('.ehIgnore img'))) return;
    const rate = $(i).width() / $(i).height(); // 宽高比
    if (rate > G.config.rateD) {
      numD++;
      G.imageD.push(j + 1);
    } else {
      G.imageS.push(j + 1);
    }
  });
  let imageSizeNew;
  if (2 * numD > G.imageD.length + G.imageS.length) { // 双页超过一半
    if (imageSize !== d) imageSizeNew = d;
  } else if (imageSize !== s) {
    imageSizeNew = s;
  }
  if (imageSizeNew !== undefined) {
    if (G.autoDownload && GM_getValue('downloading', []).length === 0) {
      document.title = `${imageSizeNew}|${document.title}`;
      await changeEConfig('xr', imageSizeNew);
      changeFav(G.favicon[imageSizeNew]);
    } else {
      const rawBtn = $(SEL.EHD.download);
      rawBtn.clone(false).click(async (e) => {
        if (GM_getValue('downloading', []).length !== 0 && !window.confirm('下载列表不为空, 是否开始下载?')) return;
        document.title = `${imageSizeNew}|${document.title}`;
        await changeEConfig('xr', imageSizeNew);
        changeFav(G.favicon[imageSizeNew]);
        rawBtn.click();
      }).insertBefore(rawBtn);
      rawBtn.hide();
      changeFav(G.favicon.p);
    }
  }
}

function defaultConfig() { // 默认设置
  /* eslint-disable object-property-newline */
  const config = {
    updateIntervalEHT: 0,
    updateIntervalEHD: 0,
    exportIntroPicFormat: "'{id}', ",

    // 通用设置
    timeShow: 'local',
    ex2ehInfo: false, eh2exSearch: true,
    openUrlInfo: '0', openUrlOther: '0',
    saveLink: false, searchInOtherSites: false, btnFake: false, changeName: true, autoRetry: true,
    searchArguments: '/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_imageset=1&f_cosplay=1&f_search={q}&f_storr=on&f_sdt1=on&f_sh=on',
    notification: '3',

    // 搜索页
    preloadPaneImage: true, languageCode: true, pageCount: true, sortByName: false, tagPreview: true, preloadResult: 0,
    searchEvent: '0,-1,0,1|1,-1,-1,1|2,-1,1,1', searchEventChs: '鼠标左键 + 任意按键 -> 主要名称 + chinese<br>鼠标中键 + 任意按键 -> 自行选择 + chinese<br>鼠标右键 + 任意按键 -> 作者或组织(顺位) + chinese',
    checkExist: 'everything',
    checkExistAtStart: true, checkExistName2: false, hideExist: true, checkExistSever: 'http://127.0.0.1:3000/', checkExistPages: false,
    acLength: 3, acItem: 'language,artist,group,parody,character,cosplayer,female,male,mixed,other,reclass,temp',
    notHideUnlike: true, alwaysShowLike: true, lowRating: 0, fewPages: 1,
    autoUpdateCheck: 25, checkListPerPage: 25,

    // 信息页
    uconfig: '',
    autoStartDownload: true, autoClose: true,
    enableEHD: true, fixEHDCounter: true,
    ehdFailed1: 20, ehdFailed1Config: '{"thread-count":1,"timeout":300,"speed-detect":true,"speed-expired":180}',
    ehdFailed2: 30, ehdFailed2Config: '{"thread-count":1,"timeout":0,"speed-detect":false,"speed-expired":0}',
    ehdFailed3: 50, ehdFailed3Time: 600,
    tagTranslateImage: false, showAllThumb: true, enableChangeSize: true,
    rateD: 1, sizeD: '3', sizeS: '1',
    downloadSizeChanged: true,
  };
  /* eslint-enable object-property-newline */
  for (const i in config) {
    if (!(i in G.config)) G.config[i] = config[i];
  }
}

function downloadAdd(id) {
  if (G.downloading) return;
  G.downloading = true;
  const downloading = GM_getValue('downloading', []);
  downloading.push(id);
  GM_setValue('downloading', downloading);
}

function downloadRemove(id) {
  if (!G.downloading) return;
  G.downloading = false;
  const downloading = GM_getValue('downloading', []);
  if (downloading.includes(id)) {
    downloading.splice(downloading.indexOf(id), 1);
    GM_setValue('downloading', downloading);
  }
}

function findData(main, sub, textOnly = true) {
  const data = G.EHT.filter((i) => i.namespace === main);
  if (data.length === 0) return {};
  if (sub === undefined) {
    return {
      name: main,
      cname: data[0].frontMatters.name,
      info: data[0].frontMatters.description,
    };
  }
  let data1 = data[0].data[sub.replace(/_/g, ' ')];
  if (!data1) {
    if (sub.match(' \\| ')) {
      const arr = sub.split(' | ').map((i) => i.replace(/_/g, ' '));
      data1 = data[0].data[arr[0]];
    }
  }
  if (data1) {
    let info = data1.intro;
    let cname = data1.name;
    if (textOnly) {
      info = info.replace(/!\[(.*?)\]\((.*?)\)/g, '').replace(/\p{Extended_Pictographic}/gu, '');
      cname = cname.replace(/!\[(.*?)\]\((.*?)\)/g, '').replace(/\p{Extended_Pictographic}/gu, '');
    }
    return {
      name: `${main}:${sub}`,
      cname,
      info,
    };
  }
  return {};
}

async function getEConfig(key) { // 获取EH设置
  const res = await xhrSync('/uconfig.php');
  const uconfig = $(SEL.EH.setting.form, res.response).serialize();
  return key ? uconfig.match(new RegExp(`${key}=(.*?)(&|$)`))[1] : uconfig;
}

async function getInfo() { // 获取信息
  if (!$(SEL.EH.search.resultTable).length) return;
  const gidlist = $(SEL.EH.search.galleryA).toArray().map((i) => {
    const arr = i.href.split('/');
    return [arr[4], arr[5]];
  });
  const lst = [];
  while (gidlist.length) {
    lst.push(gidlist.splice(0, 25));
  }
  let gmetadata = [];
  for (let i = 0; i < lst.length; i++) {
    const gdata = {
      method: 'gdata',
      gidlist: lst[i],
      namespace: 1,
    };
    const res = await xhrSync('/api.php', JSON.stringify(gdata), {
      responseType: 'json',
    });
    gmetadata = gmetadata.concat(res.response.gmetadata);
  }
  return gmetadata;
}

function hideGalleries() { // 隐藏某些画集
  const tags = GM_getValue('tagAction', {});
  $(SEL.EH.search.galleryA).toArray().forEach((i) => {
    const info = G.gmetadata.filter((j) => j.gid === i.href.split('/')[4] * 1)[0];
    if (!info) return;
    const container = $(i).parentsUntil(SEL.EH.search.resultTbody).eq(-1).find('.ehContainer');
    if (info.rating * 1 < G.config.lowRating) $('<span class="ehTagNotice" name="Unlike" title="低评分">低评分</span>').appendTo(container);
    if (info.filecount * 1 < G.config.fewPages) $('<span class="ehTagNotice" name="Unlike" title="页面少">页面少</span>').appendTo(container);

    info.tags.filter((j) => j in tags).forEach((j) => {
      const tagArr = j.split(':');
      const main = tagArr[0];
      const sub = tagArr[tagArr.length - 1];
      const data = findData(main, sub, true);
      let tagChs = j;
      let tagInfo = j;
      if (Object.keys(data).length) {
        tagChs = `${main === 'male' ? '♂' : main === 'female' ? '♀' : main[0]}:${data.cname}`;
        tagInfo = `${tagInfo}<br>${data.info}`;
      }
      $(`<span class="ehTagNotice" name="${tags[j]}" title="${tagInfo}" tag="${main}:${sub}" tooltip="${htmlEscape('左键: 隐藏含当前标签的本子<br>中键: 显示所有本子<br>右键: 隐藏<b>不</b>含当前标签的本子')}">${tagChs}</span>`).appendTo(container);
    });
  });

  let elem = [];
  if (!G.config.notHideUnlike) $(SEL.EH.search.resultTr).filter(':has(.ehTagNotice[name="Unlike"])').toArray();
  if (G.config.alwaysShowLike) elem = $(elem).not(':has(.ehTagNotice[name="Like"])').toArray();
  elem = elem.concat($(SEL.EH.search.resultTr).filter(':has(.ehTagNotice[name="Perma-ban"])').not(elem).toArray());
  elem = $(elem);
  elem.hide();
  const { length } = elem;
  $(`<button status="Hide">Hide Tag: ${length}</button>`).on('click', (e) => {
    const status = $(e.target).attr('status');
    elem.toggle(status === 'Hide');
    const now = status === 'Hide' ? 'Show' : 'Hide';
    $(e.target).attr('status', now).text(`${now} Tag: ${length}`);
  }).appendTo(SEL.EH.search.resultTotal);

  $('body').on('mouseup', '.ehTagNotice[tag]', (e) => {
    if (e.button === 1) {
      $(SEL.EH.search.resultTr).show();
    } else {
      const tag = $(e.target).attr('tag');

      const filter = e.button === 0 ? 'filter' : 'not';
      $(SEL.EH.search.resultTr)[filter](`:has(.ehTagNotice[tag="${window.CSS.escape(tag)}"])`).hide();
      if ($(SEL.EH.search.resultTr).filter(':visible').length === 0) {
        window.alert('无结果');
        $(SEL.EH.search.resultTr).show();
      }
    }
  });
}

function highlightBlacklist() { // 高亮黑名单相关的画廊(通用)
  const blacklist = GM_getValue('blacklist', []);
  const galleryList = G.infoPage ? [].concat($(SEL.EH.info.title).toArray(), $(SEL.EH.info.titleJp).toArray()) : $(SEL.EH.search.galleryA).toArray();
  galleryList.forEach((i) => {
    let title = htmlEscape($(i).text());
    for (const j of blacklist) {
      let keyword = j;
      let flag = 'gi';
      if (keyword.match(/^\/(.*?)\/([igmsuy]*)$/)) {
        [, keyword, flag] = keyword.match(/^\/(.*?)\/([igmsuy]*)$/);
      } else {
        keyword = reEscape(j);
      }
      const re = new RegExp(keyword, flag);
      if (title.match(re)) {
        title = title.replace(re, '<span class="ehBlacklist" copy="$&">$&</span>');
      }
    }
    $(i).html(title);
  });
}

function introPic() { // 宣传图
  const toggleIgnore = (e) => {
    let introPic = GM_getValue('introPic', []);
    introPic = arrUnique(introPic);
    const id = $(e.target).prev().attr('href').split('/')[4];
    if ($(e.target).attr('on') === 'true') {
      introPic.push(id);
    } else {
      introPic.splice(introPic.indexOf(id), 1);
    }
    $(e.target).parent().toggleClass('ehIgnore');
    $(e.target).attr('on', !introPic.includes(id));
    GM_setValue('introPic', introPic);
  };
  const introPic = GM_getValue('introPic', []);
  $(SEL.EH.info.previewA).toArray().forEach((i) => {
    const url = i.href;
    const id = url.split('/')[4];
    const name = $(i).find('img:eq(0)').attr('title').match(/Page \d+:\s+(.*)/)[1];
    const isIntroPic = introPic.includes(id);
    const btnBlock = $(`<a name="intro" href="javascript:;" on="true" file="${name}"></a>`).on('click', toggleIgnore).appendTo(i.parentNode);

    if (isIntroPic || G.introPicName.some((j) => name.match(j))) {
      $(btnBlock).attr('on', 'false');
      $(i).parent().addClass('ehIgnore');
      if (isIntroPic) { // 收集数据
        const introPicStat = GM_getValue('introPicStat', {});
        introPicStat[id] = id in introPicStat ? introPicStat[id] + 1 : 1;
        GM_setValue('introPicStat', introPicStat);

        const introPicUrl = GM_getValue('introPicUrl', {});
        introPicUrl[id] = url;
        GM_setValue('introPicUrl', introPicUrl);
      }
    }
  });
}

function jumpHost() { // 里站跳转
  const l = window.location;
  if (G.infoPage) {
    if (G.config.ex2ehInfo) {
      const gid = l.href.split('/')[4];
      let jump = GM_getValue('jump', []);
      jump = arrUnique(jump);
      if (l.host === 'exhentai.org') { // 里站
        if (!jump.includes(gid)) { // 尝试跳转
          if (!SEL.EH.info.tagBanned.some((i) => document.getElementById(i))) {
            l.assign(l.href.replace('//exhentai.org', '//e-hentai.org'));
            return true;
          }
        } else {
          jump.splice(jump.indexOf(gid), 1);
          GM_setValue('jump', jump);
        }
      } else if (l.host === 'e-hentai.org') { // 表站
        if (document.querySelector(SEL.EH.special.deleted)) { // 不存在则返回
          jump.push(gid);
          GM_setValue('jump', jump);
          return true;
        }
      }
    }
  } else {
    if (G.config.ex2ehInfo && l.href === 'https://e-hentai.org/' && document.referrer && document.referrer.match(SEL.EH.info.urlMatch) && GM_getValue('jump', []).includes(document.referrer.split('/')[4])) {
      l.assign(document.referrer.replace('//e-hentai.org', '//exhentai.org'));
      return true;
    } if (G.config.eh2exSearch && l.host === 'e-hentai.org' && $(SEL.EH.search.keyword).val()) {
      l.assign(l.href.replace('//e-hentai.org', '//exhentai.org'));
      return true;
    }
  }
  return false;
}

function languageCode() { // 显示iso语言代码
  let value = $(SEL.EH.search.keyword).val();
  const iso = {
    chinese: 'zh',
    english: 'en',
    japanese: 'ja',
    korean: 'ko',
    albanian: 'sq',
    arabic: 'ar',
    bengali: 'bn',
    catalan: 'ca',
    czech: 'cs',
    danish: 'da',
    dutch: 'nl',
    esperanto: 'eo',
    estonian: 'et',
    finnish: 'fi',
    french: 'fr',
    german: 'de',
    greek: 'el',
    hebrew: 'he',
    hindi: 'hi',
    hungarian: 'hu',
    indonesian: 'id',
    italian: 'it',
    mongolian: 'mn',
    norwegian: 'no',
    polish: 'pl',
    portuguese: 'pt',
    romanian: 'ro',
    russian: 'ru',
    slovak: 'sk',
    slovenian: 'sl',
    spanish: 'es',
    swedish: 'sv',
    tagalog: 'tl',
    thai: 'th',
    turkish: 'tr',
    ukrainian: 'uk',
    vietnamese: 'vi',
  };
  value = value.match(/language:"?(\w+)\$?"?/);
  if (value && value[1] in iso) return;
  $(SEL.EH.search.galleryA).toArray().forEach((i) => {
    const info = G.gmetadata.filter((j) => j.gid === i.href.split('/')[4] * 1)[0];
    if (!info) return;
    const langs = info.tags.filter((i) => i.match(/^language:/));
    const container = $(i).parentsUntil(SEL.EH.search.resultTbody).eq(-1).find('.ehContainer');
    langs.forEach((j) => {
      const lang = j.match(/^language:(.*)/)[1];
      if (lang in iso) {
        $(`<span class="ehLang" title="${lang}">${iso[lang]}</span>`).appendTo(container);
      }
    });
  });
}

function pageCount() { // 显示本子页数
  $(SEL.EH.search.galleryA).toArray().forEach((i) => {
    const info = G.gmetadata.filter((j) => j.gid === i.href.split('/')[4] * 1)[0];
    if (!info) return;
    const container = $(i).parentsUntil(SEL.EH.search.resultTbody).eq(-1).find('.ehContainer');
    $(`<span class="ehPageCount" tooltip="${htmlEscape('左键: 隐藏名称相似的本子<br>中键: 显示所有本子<br>右键: 隐藏名称<b>不</b>相似的本子<br>Ctrl+左/右键: 输入关键字过滤')}">${info.filecount}P</span>`).appendTo(container);
  });

  $('body').on('mouseup', '.ehPageCount', (e) => {
    if (e.button === 1) {
      $(SEL.EH.search.resultTr).show();
    } else {
      let keyword = $(e.target).parents(SEL.EH.search.resultTr).find(SEL.EH.search.galleryA).text();
      keyword = removeOtherInfo(keyword);
      keyword = removeOtherInfo(keyword, true);
      keyword = keyword.trim();

      let flag = 'gi';
      if (e.ctrlKey) {
        keyword = window.prompt('如需输入正则表达式，请按"/pattern/flags"的格式输入\n其他格式视为纯文本', keyword);
        if (!keyword || !keyword.trim()) return;
        keyword = keyword.trim();
      }
      if (keyword.match(/^\/(.*?)\/([igmsuy]*)$/)) {
        [, keyword, flag] = keyword.match(/^\/(.*?)\/([igmsuy]*)$/);
      } else {
        keyword = reEscape(keyword);
      }
      const re = new RegExp(keyword, flag);

      const filter = e.button === 0 ? 'filter' : 'not';
      $(SEL.EH.search.resultTr)[filter]((index, elem) => $(elem).find(SEL.EH.search.galleryA).text().match(re)).hide();
      if ($(SEL.EH.search.resultTr).filter(':visible').length === 0) {
        window.alert('无结果');
        $(SEL.EH.search.resultTr).show();
      }
    }
  });
}

function makeRange(arr) {
  if (arr.length === 0) return '';
  arr = [...new Set(arr.sort((a, b) => a - b))];
  const arr2 = [arr[0].toString()];

  for (let i = 1; i < arr.length; i++) {
    const index = arr[i];
    const last = arr2[arr2.length - 1];
    const start = last.match(/^\d+/)[0] * 1;
    const end = last.match(/\d+$/)[0] * 1;
    if (index - end === 1) {
      arr2[arr2.length - 1] = `${start}-${index}`;
    } else {
      arr2.push(index.toString());
    }
  }
  return arr2;
}

function openUrl(url, config) { // 打开链接
  url = new URL(url, window.location.href).href;
  const mode = url.match(/e[x-]hentai.org\/g\//) ? 'Info' : 'Other';
  config = config || G.config[`openUrl${mode}`];
  if (config === '0') {
    return GM_openInTab(url, true);
  } if (config === '1') {
    return GM_openInTab(url, false);
  } if (config === '2') {
    const popup = window.open(url, '', 'resizable,scrollbars,status');
    if (popup) {
      popup.moveTo(0, 0);
      popup.resizeTo(window.screen.width, window.screen.height);
    } else {
      setNotification('请允许该网页弹出窗口');
      GM_openInTab(url, false);
    }
    return popup;
  } if (config === '3') {
    if (new URL(url).host !== window.location.host) {
      return GM_openInTab(url, true);
    }
    if (!$('.ehNavBar>div>[name="iframe"]', window.top.document).length) {
      let order = 0;
      $(`<button name="iframe" tooltip="${htmlEscape('左键: 滚动到顶部<br>中键: 关闭所有iframe<br>右键: 滚动到下一个iframe')}">iframe</button>`).on('mousedown', (e) => {
        if (e.button === 0) {
          window.top.document.documentElement.scrollTop = 0;
          order = 0;
        } else if (e.button === 1) {
          $('.ehIframeContainer>[name="close"]').click();
        } else if (e.button === 2) {
          $(`.ehIframeContainer[order=${order}]`).get(0).scrollIntoView();
          order = order + 1;
          if ($('.ehIframeContainer').length <= order) order = 0;
        }
      }).appendTo($('.ehNavBar>div:nth-child(1)', window.top.document));
    }
    if ($('.ehIframe[status="idle"]', window.top.document).length === 0) {
      let container, button, timeout, timeoutError;// eslint-disable-line prefer-const
      let failedCount = 0;

      const close = function () {
        if (timeout) clearTimeout(timeout);
        const iframe = $(container).find('.ehIframe');
        $(iframe).contents().find('*').addBack()
          .unbind()
          .off();
        $(iframe).attr('src', 'about:blank');
        try {
          $(iframe).contents().get(0).write('');
          $(iframe).contents().get(0).clear();
        } catch (error) { /* noop */ }
        $(iframe).attr('src', null).attr('status', 'idle');
        const toRemove = $('.ehIframeContainer:has(.ehIframe[status="idle"]):gt(0)', window.top.document);
        toRemove.add(...toRemove.toArray().map((i) => i.button)).remove();
        $(container).add(button).hide();
      };

      button = $(`<button name="container" tooltip="${htmlEscape('左键: 跳转到该iframe<br>中键: 滚动到顶部<br>右键: 关闭该iframe')}"></button>`).on({
        mousedown: (e) => {
          if (e.button === 0) {
            container.get(0).scrollIntoView();
          } else if (e.button === 1) {
            window.top.document.documentElement.scrollTop = 0;
          } else if (e.button === 2) {
            close(container);
          }
        },
        mouseenter: (e) => {
          $(e.target).attr('title', `<span class="ehHighlight">${$(e.target).text()}</span>`);
        },
      }).appendTo($('.ehNavBar>div:nth-child(1)', window.top.document));
      container = $('<div class="ehIframeContainer">').html('<input type="text" name="src"><button name="close">Close</button>').appendTo($('body', window.top.document)).prop('button', button);
      container.find('input[name="src"]').on({
        keyup: (e) => {
          if (['Enter', 'NumpadEnter'].includes(e.originalEvent.code)) {
            if (timeout) clearTimeout(timeout);
            if (timeoutError) clearTimeout(timeoutError);
            close();
            openUrl(e.target.value);
          }
        },
      });
      container.find('button[name="close"]').on('click', close);

      const checkLoad = (elem) => {
        try {
          button.text(elem.contentWindow.document.title);
          failedCount = 0;
          console.log('加载完成', elem.src);
          console.groupEnd();
          return true;
        } catch (error) { // 加载错误
          failedCount = failedCount + 1;
          const url = elem.src;
          close();
          const wait = Math.min(failedCount * 800, 5 * 60 * 1000);
          console.log('加载错误，等待%f秒后重试', wait / 1000, url);
          timeoutError = setTimeout(() => {
            console.log('尝试重新加载', url);
            openUrl(url);
          }, wait);
          return false;
        }
      };
      const iframe = $('<iframe class="ehIframe" status="idle">').appendTo(container).on({
        load: (e) => {
          if (e.target.src !== 'about:blank' && timeout) clearTimeout(timeout);
          if (!checkLoad(e.target)) return;

          $(e.target).css({
            height: Math.min(document.documentElement.clientHeight * 0.7, parseInt($(e.target).contents().find('body').css('height'), 10)),
          });
          if ($('title', $(e.target).contents()).length) {
            const observerIframe = new window.MutationObserver((mutationsList) => {
              button.text(mutationsList[0].addedNodes[0].textContent);
            });
            observerIframe.observe($('title', $(e.target).contents()).get(0), { childList: true });
          }
        },
      });
      const observer = new window.MutationObserver((mutationsList) => {
        const record = mutationsList.find((i) => i.attributeName === 'src');
        if (!record) return;
        const { src } = record.target;
        container.find('input[name="src"]').val(src);
        button.text(src);
        if (src && src !== 'about:blank') {
          console.groupEnd();
          console.group(src);
          console.log('开始加载，超时限制：%f秒', 5 * 60, src);
          timeout = setTimeout(() => { // 加载超时
            console.log('加载超时', src);
            close();
            openUrl(url);
          }, 5 * 60 * 1000);
        }
      });
      observer.observe(iframe.get(0), { attributes: true });
    }
    const container = $('.ehIframeContainer:has(.ehIframe[status="idle"])', window.top.document).first();
    const iframe = container.find('.ehIframe[status="idle"]');
    iframe.attr('status', 'busy').attr('src', url);
    container.add(container.prop('button')).show();
    return iframe;
  }
  return null;
}

function quickDownload() { // 右键下载
  $(SEL.EH.search.resultTable).on('contextmenu', (e) => {
    if ($(e.target).is(SEL.EH.search.galleryA)) {
      e.preventDefault();
      const { target } = e;
      openUrl(`${target.href}#2`);
    }
  });
}

async function preloadResult(number) { // 自动预载
  let count = number;
  let doc = document;
  let url = $(SEL.EH.search.pageNext, doc).attr('href');
  while (count > 0 && url) {
    count = count - 1;

    const iframe = openUrl(`${url}#noscript`, '3');
    // const find = await waitForElement(SEL.EH.search.pageNext, Infinity, doc);
    const find = await waitFor(() => $(SEL.EH.search.pageNext, $(iframe).contents()).length, 30 * 1000);
    if (!find) return;

    doc = $(iframe).contents();
    url = $(SEL.EH.search.pageNext, doc).attr('href');

    // const res = await xhrSync(url, null, { responseType: 'document' });
    // doc = res.response;

    $('<hr size="10" style="background: #40454b;">').appendTo(SEL.EH.search.resultTableContainer);
    $([SEL.EH.search.resultTable, SEL.EH.search.pagesContainerBottom].join(','), doc).appendTo(SEL.EH.search.resultTableContainer);

    $(iframe).prev('[name="close"]').click();
  }
}

async function saveAs(text, name) { // eslint-disable-line no-unused-vars
  downloadRemove(SEL.EH.info.galleryId);
  if (text instanceof window.Blob && text.type.match(/^application.*zip$/)) {
    if (G.downloadSizeChanged) {
      if (!G.imageEnd) {
        G.imageData = text;
        autoDownload(true);
      } else {
        const zipS = await JSZip.loadAsync(text);
        const zip = await JSZip.loadAsync(G.imageData);
        G.imageData = null;
        const files = Object.keys(zipS.files);

        // 合并info
        const infoFile = Object.keys(zip.files).find((i) => i.match(/\/info.txt$/));
        const info = await zip.files[infoFile].async('text');
        const infoS = await zipS.files[infoFile].async('text');
        const infoSArr = infoS.split(/\r?\n/);
        const start = infoSArr.findIndex((i) => i.match(/^Page\s*\d+:\s*https:\/\/e[x-]hentai.org\/s\/\w+\/\d+-\d+/));
        const end = infoSArr.findIndex((i) => i.match(/^Downloaded at/));
        const infoArr = info.split(/\r?\n/);
        const insertPosition = infoArr.findIndex((i) => i.match(/^Downloaded at/));
        infoArr.splice(insertPosition, 0, ...infoSArr.slice(start, end));
        const infoStr = infoArr.join('\r\n');
        zip.file(infoFile, infoStr);

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.match(/\/info.txt$/)) continue;
          const ab = await zipS.files[file].async('arraybuffer');
          zip.file(file, ab);
        }
        const data = await zip.generateAsync({
          type: 'arraybuffer',
          compression: G['ehD-setting']['compression-level'] ? 'DEFLATE' : 'STORE',
          compressionOptions: {
            level: G['ehD-setting']['compression-level'] > 0 ? (G['ehD-setting']['compression-level'] < 10 ? G['ehD-setting']['compression-level'] : 9) : 1,
          },
          streamFiles: !!G['ehD-setting']['file-descriptor'],
          comment: G['ehD-setting']['save-info'] === 'comment' ? infoStr : undefined,
        });
        saveAs2(data, name, text.type);
        await waitFor(() => false, 500);
        taskRemove(SEL.EH.info.galleryId);
        await waitFor(() => false, 200);
        windowClose();
      }
    } else {
      saveAs2(text, name, text.type);
      await waitFor(() => false, 500);
      taskRemove(SEL.EH.info.galleryId);
      await waitFor(() => false, 200);
      windowClose();
    }
  } else {
    saveAs2(text, name);
  }
}

function saveAs2(content, name, type = 'application/octet-stream;charset=utf-8') {
  name = name.replace(/[\\/:*?"<>|]/g, '-').replace(/\u{2139}|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|\u{2328}|\u{23CF}|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|\u{24C2}|[\u{25AA}-\u{25AB}]|\u{25B6}|\u{25C0}|[\u{25FB}-\u{25FE}]|[\u{2600}-\u{2604}]|\u{260E}|\u{2611}|[\u{2614}-\u{2615}]|\u{2618}|\u{261D}|\u{2620}|[\u{2622}-\u{2623}]|\u{2626}|\u{262A}|[\u{262E}-\u{262F}]|[\u{2638}-\u{263A}]|[\u{2648}-\u{2653}]|\u{2660}|\u{2663}|\u{2666}|\u{2668}|\u{267B}|\u{267F}|[\u{2692}-\u{2697}]|\u{2699}|[\u{269B}-\u{269C}]|[\u{26A0}-\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26B0}-\u{26B1}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|\u{26C8}|\u{26CE}|\u{26CF}|\u{26D1}|[\u{26D3}-\u{26D4}]|[\u{26E9}-\u{26EA}]|[\u{26F0}-\u{26F5}]|[\u{26F7}-\u{26FA}]|\u{26FD}|\u{2702}|\u{2705}|[\u{2708}-\u{2709}]|[\u{270A}-\u{270B}]|[\u{270C}-\u{270D}]|\u{270F}|\u{2712}|\u{2714}|\u{2716}|\u{271D}|\u{2721}|\u{2728}|[\u{2733}-\u{2734}]|\u{2744}|\u{2747}|\u{274C}|\u{274E}|[\u{2753}-\u{2755}]|\u{2757}|\u{2763}|[\u{2795}-\u{2797}]|\u{27A1}|\u{27B0}|\u{27BF}|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|\u{2B50}|\u{2B55}|\u{3030}|\u{303D}|\u{3297}|\u{3299}|\u{1F004}|\u{1F0CF}|[\u{1F170}-\u{1F171}]|\u{1F17E}|\u{1F17F}|\u{1F18E}|[\u{1F191}-\u{1F19A}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F201}-\u{1F202}]|\u{1F21A}|\u{1F22F}|[\u{1F232}-\u{1F23A}]|[\u{1F250}-\u{1F251}]|[\u{1F300}-\u{1F320}]|\u{1F321}|[\u{1F324}-\u{1F32C}]|[\u{1F32D}-\u{1F32F}]|[\u{1F330}-\u{1F335}]|\u{1F336}|[\u{1F337}-\u{1F37C}]|\u{1F37D}|[\u{1F37E}-\u{1F37F}]|[\u{1F380}-\u{1F393}]|[\u{1F396}-\u{1F397}]|[\u{1F399}-\u{1F39B}]|[\u{1F39E}-\u{1F39F}]|[\u{1F3A0}-\u{1F3C4}]|\u{1F3C5}|[\u{1F3C6}-\u{1F3CA}]|[\u{1F3CB}-\u{1F3CE}]|[\u{1F3CF}-\u{1F3D3}]|[\u{1F3D4}-\u{1F3DF}]|[\u{1F3E0}-\u{1F3F0}]|[\u{1F3F3}-\u{1F3F5}]|\u{1F3F7}|[\u{1F3F8}-\u{1F3FF}]|[\u{1F400}-\u{1F43E}]|\u{1F43F}|\u{1F440}|\u{1F441}|[\u{1F442}-\u{1F4F7}]|\u{1F4F8}|[\u{1F4F9}-\u{1F4FC}]|\u{1F4FD}|\u{1F4FF}|[\u{1F500}-\u{1F53D}]|[\u{1F549}-\u{1F54A}]|[\u{1F54B}-\u{1F54E}]|[\u{1F550}-\u{1F567}]|[\u{1F56F}-\u{1F570}]|[\u{1F573}-\u{1F579}]|\u{1F57A}|\u{1F587}|[\u{1F58A}-\u{1F58D}]|\u{1F590}|[\u{1F595}-\u{1F596}]|\u{1F5A4}|\u{1F5A5}|\u{1F5A8}|[\u{1F5B1}-\u{1F5B2}]|\u{1F5BC}|[\u{1F5C2}-\u{1F5C4}]|[\u{1F5D1}-\u{1F5D3}]|[\u{1F5DC}-\u{1F5DE}]|\u{1F5E1}|\u{1F5E3}|\u{1F5E8}|\u{1F5EF}|\u{1F5F3}|\u{1F5FA}|[\u{1F5FB}-\u{1F5FF}]|\u{1F600}|[\u{1F601}-\u{1F610}]|\u{1F611}|[\u{1F612}-\u{1F614}]|\u{1F615}|\u{1F616}|\u{1F617}|\u{1F618}|\u{1F619}|\u{1F61A}|\u{1F61B}|[\u{1F61C}-\u{1F61E}]|\u{1F61F}|[\u{1F620}-\u{1F625}]|[\u{1F626}-\u{1F627}]|[\u{1F628}-\u{1F62B}]|\u{1F62C}|\u{1F62D}|[\u{1F62E}-\u{1F62F}]|[\u{1F630}-\u{1F633}]|\u{1F634}|[\u{1F635}-\u{1F640}]|[\u{1F641}-\u{1F642}]|[\u{1F643}-\u{1F644}]|[\u{1F645}-\u{1F64F}]|[\u{1F680}-\u{1F6C5}]|[\u{1F6CB}-\u{1F6CF}]|\u{1F6D0}|[\u{1F6D1}-\u{1F6D2}]|[\u{1F6E0}-\u{1F6E5}]|\u{1F6E9}|[\u{1F6EB}-\u{1F6EC}]|\u{1F6F0}|\u{1F6F3}|[\u{1F6F4}-\u{1F6F6}]|[\u{1F6F7}-\u{1F6F8}]|[\u{1F910}-\u{1F918}]|[\u{1F919}-\u{1F91E}]|\u{1F91F}|[\u{1F920}-\u{1F927}]|[\u{1F928}-\u{1F92F}]|\u{1F930}|[\u{1F931}-\u{1F932}]|[\u{1F933}-\u{1F93A}]|[\u{1F93C}-\u{1F93E}]|[\u{1F940}-\u{1F945}]|[\u{1F947}-\u{1F94B}]|\u{1F94C}|[\u{1F950}-\u{1F95E}]|[\u{1F95F}-\u{1F96B}]|[\u{1F980}-\u{1F984}]|[\u{1F985}-\u{1F991}]|[\u{1F992}-\u{1F997}]|\u{1F9C0}|[\u{1F9D0}-\u{1F9E6}]|❤/gu, '');
  const blob = new window.Blob([content], {
    type,
  });
  $(`<a href="${URL.createObjectURL(blob)}" download="${name}"></a>`).appendTo('body').hide()[0].click();
}

function saveLink() { // 保存链接
  $('<button title="创建链接">Shortcut</button>').click(() => {
    const content = [
      '[InternetShortcut]\r\nURL={{url}}',
      '<?xml version=\'1.0\' encoding=\'UTF-8\'?><!DOCTYPE plist PUBLIC \'-//Apple//DTD PLIST 1.0//EN\' \'http://www.apple.com/DTDs/PropertyList-1.0.dtd\'><plist version=\'1.0\'><dict><key>URL</key><string>{{url}}</string></dict></plist>',
      '[Desktop Entry]\r\nType=Link\r\nURL={{url}}',
    ];
    let { platform } = navigator;
    let fileType;
    if (platform.match(/^Win/)) {
      platform = 0;
      fileType = '.url';
    } else if (platform.match(/^Mac/)) {
      platform = 1;
      fileType = '.webloc';
    } else {
      platform = 2;
      fileType = '.desktop';
    }
    const text = content[platform].replace('{{url}}', window.location.href);
    saveAs2(text, document.title + fileType);
  }).prependTo('.ehNavBar>div:nth-child(1)');
}

function setNotification(text, title = undefined, timeout = 3 * 1000) { // 发出桌面通知
  if (G.config.notification === '-1') {
    // Nothing
  } else if (G.config.notification === '0') {
    if (window.Notification && window.Notification.permission !== 'denied') {
      window.Notification.requestPermission((status) => {
        if (status === 'granted') {
          const n = (title) ? new window.Notification(text, {
            body: title,
            icon: `${window.location.origin}/favicon.ico`,
            tag: GM_info.script.name,
          }) : new window.Notification(text);
          setTimeout(() => {
            if (n) n.close();
          }, timeout);
        } else {
          setNotification2(text, title, timeout);
        }
      });
    } else {
      setNotification2(text, title, timeout);
    }
  } else if (G.config.notification === '1') {
    GM_notification({
      text,
      title: title || GM_info.script.name,
      image: `${window.location.origin}/favicon.ico`,
      tag: GM_info.script.name,
      timeout,
    });
  } else if (G.config.notification === '2') {
    window.alert(title ? `${text}\n\n${title}` : text);
  } else if (G.config.notification === '3') {
    setNotification2(text, title, timeout);
  }
}

function setNotification2(text, title, timeout) {
  if ($('.ehNotification').length === 0) {
    $('<div class="ehNotification"></div>').on({
      click: (e) => {
        $('.ehNotification').hide();
      },
    }).appendTo('body');
  }
  title = title ? `<div>${htmlEscape(title)}</div><hr>` : '';
  $('.ehNotification').show().html(`<div class="ehFavicion"></div><div>${title}<div>${htmlEscape(text)}</div></div>`);
  if (G.timeout) {
    clearTimeout(G.timeout);
    G.timeout = null;
  }
  G.timeout = setTimeout(() => {
    G.timeout = null;
    $('.ehNotification').hide();
  }, timeout);
}

function searchInOtherSites() { // 在其他站点搜索
  const navBar = $(SEL.EH.common.navBar).clone().empty().insertAfter(SEL.EH.common.navBar);
  const sites = {
    'nhentai.net': {
      url: (q) => `https://nhentai.net/search/?q=${q.replace(/\$/g, '')}`,
    },
    'doujinshi.org': {
      url: 'https://www.doujinshi.org/search/simple/?T=objects&sn={q}',
    },
    Google: {
      url: 'https://www.google.com/search?q={q}',
      icon: '//www.google.com/images/branding/product/ico/googleg_lodp.ico',
    },
    'hentai-comic.com': {
      url: 'https://zh.hentai-comic.com/search/keyword/{q}/page/1/',
    },
    'asmhentai.com': {
      url: 'https://asmhentai.com/search/{q}/',
    },
    'mujaki.blog.jp': {
      urlJ: 'http://mujaki.blog.jp/search?q={q}',
    },
    'cefamilie.com': {
      urlJ: 'https://cefamilie.com/?s={q}',
    },
    'wnacg.com': {
      urlJ: 'https://wnacg.com/albums-index-page-1-sname-{q}.html',
    },
    'hentai2read.com': {
      url: 'https://asmhentai.com/search/{q}/',
    },
  };
  let keyword,
    keywordJ;
  if (G.infoPage) {
    keyword = $(SEL.EH.info.title).text();
    keywordJ = $(SEL.EH.info.titleJp).text();
  } else {
    keyword = $(SEL.EH.search.keyword).val();
    keywordJ = $(SEL.EH.search.keyword).val();
  }
  for (const i in sites) {
    let url;
    if ('url' in sites[i]) {
      url = sites[i].url instanceof Function ? sites[i].url(keyword) : sites[i].url.replace(/{q}/g, keyword);
    } else if ('urlJ' in sites[i]) {
      url = sites[i].urlJ instanceof Function ? sites[i].urlJ(keywordJ) : sites[i].urlJ.replace(/{q}/g, keywordJ);
    }
    $('<div></div>').append($(`<a target="_blank"><img class="icon" src="${sites[i].icon || `https://icons.duckduckgo.com/ip2/${i}`}.ico"></img>${i}</a>`).attr('href', url)).appendTo(navBar);
  }
}

async function showAllThumb() { // 显示所有预览页
  const pageCur = parseInt($(SEL.EH.info.pageCur).text(), 10);
  const pageMax = parseInt($(SEL.EH.info.pageMax).text(), 10);
  let pageCurUrl = $(SEL.EH.info.pageCur).prop('href');
  if (!pageCurUrl.match(/\?p=\d+/)) pageCurUrl = pageCurUrl.match(/\?/) ? pageCurUrl.replace(/\?/, '?p=0&') : `${pageCurUrl}?p=0`;
  const urls = Array.from({ length: pageMax - pageCur }, (_, index) => pageCurUrl.replace(/\?p=\d+/, `?p=${pageCur + index}`));

  $('<div class="gdtContainer"></div>').html('<div></div>'.repeat(pageMax - pageCur + 1)).insertBefore(SEL.EH.info.previewContainer);
  $(SEL.EH.info.previewContainer).appendTo(`.gdtContainer>div:nth-child(${$(SEL.EH.info.pageCur).text()})`);
  const results = await Promise.all(urls.map((i) => xhrSync(i, null, { responseType: 'document' })));
  for (const res of results) {
    const index = $(SEL.EH.info.pageCur, res.response).text();
    $(SEL.EH.info.previewContainer, res.response).find('img').attr('loading', 'lazy');
    $(SEL.EH.info.previewContainer, res.response).appendTo(`.gdtContainer>div:nth-child(${index})`);
  }
}

function showConfig() { // 显示设置
  $('<div><a key-code="1" key-event="click" href="javascript:;">[EH]Enhance Config</a></div>').on('click', (e) => {
    if ($('.ehConfig').length) {
      $('.ehConfig').toggle();
      return;
    }
    const _html = [
      `${GM_info.script.name}<span class="ehHighlight">v${GM_info.script.version}</span> <a href="${GM_info.script.namespace}" target="_blank">@${GM_info.script.author || 'dodying'}</a>`,
      '',
      '<input type="button" name="exportValues" value="Export Values" title="导出脚本储存的信息<br>(除EHT与EHD的数据)"> <input type="file" id="selectFileConfig" name="selectFile" accept=".json"><input type="button" name="importValues" value="Select File and Inmport Values" title="选择文件，并导入脚本储存的信息"><input type="button" name="testSelectors" value="Test Selectors" title="测试选择器">',
      '更新 EHT: 更新频率: <input name="ehConfig_updateIntervalEHT" type="number" placeholder="0" step="1" min="0" title="0表示不自动更新，以天为单位"> <input type="button" name="updateEHT" value="Update Now" tooltip="立即更新标签数据，来自[Mapaler/EhTagTranslator]"> <input type="button" name="exportEHT" value="Export Now" title="导出EHT数据"> <input type="button" name="emptyEHT" value="Empty Now" title="重置EHT数据">',
      '更新 EHD: 更新频率: <input name="ehConfig_updateIntervalEHD" type="number" placeholder="0" step="1" min="0" title="0表示不自动更新，以天为单位"> <input type="button" name="updateEHD" value="Update Now" tooltip="立即更新内置 [E-Hentai-Downloader]"> <input type="button" name="exportEHD" value="Export Now" title="导出EHD数据"> <input type="button" name="emptyEHD" value="Empty Now" title="重置EHD数据">',
      `宣传图相关: 导出格式: <input name="ehConfig_exportIntroPicFormat" title="${htmlEscape('以<span class="ehHighlight">{id}</span>表示宣传图id<br>以<span class="ehHighlight">{cr}</span>表示\\r<br>以<span class="ehHighlight">{lf}</span>表示\\n')}" type="text" placeholder="'{id}',{cr}{lf}"> <input type="button" name="exportIntroPic" value="Copy Text" title="复制文本">`,
      '',
      // 通用设置
      '<span class="ehHighlight">通用设置:</span>',
      '时间显示: <label for="ehConfig_timeShow_local"><input type="radio" name="ehConfig_timeShow" id="ehConfig_timeShow_local" value="local" checked>本地时间</label> <label for="ehConfig_timeShow_iso"><input type="radio" name="ehConfig_timeShow" id="ehConfig_timeShow_iso" value="iso">ISO时间</label>',
      '跳转相关: <label for="ehConfig_ex2ehInfo"><input type="checkbox" id="ehConfig_ex2ehInfo">信息页: 里站自动跳转到表站</label>; <label for="ehConfig_eh2exSearch"><input type="checkbox" id="ehConfig_eh2exSearch">搜索页: 表站自动跳转到里站</label>',
      '链接打开方式: 信息页：<select name="ehConfig_openUrlInfo"><option value="0">新标签页后台打开</option><option value="1">新标签页前台打开</option><option value="2">弹窗打开</option><option value="3">iframe中打开</option></select>; 其他页面: <select name="ehConfig_openUrlOther"><option value="0">新标签页后台打开</option><option value="1">新标签页前台打开</option><option value="2">弹窗打开</option><option value="3">iframe中打开</option></select>; 测试 <input name="openUrlTest" type="text">',
      '启动功能: <label for="ehConfig_saveLink"><input type="checkbox" id="ehConfig_saveLink">保存链接</label>; <label for="ehConfig_searchInOtherSites"><input type="checkbox" id="ehConfig_searchInOtherSites">在其他站点搜索</label>; <label for="ehConfig_btnFake"><input type="checkbox" id="ehConfig_btnFake">Fake</label>; <label for="ehConfig_changeName"><input type="checkbox" id="ehConfig_changeName">标题: 删除集会名、替换其中的罗马数字</label>; <label for="ehConfig_autoRetry"><input type="checkbox" id="ehConfig_autoRetry">网络：请求错误时，自动重试</label>',
      `搜索参数: <input name="ehConfig_searchArguments" title="${htmlEscape('以<span class="ehHighlight">{q}</span>代替搜索关键词')}" type="text" placeholder="/?f_search={q}" min="1">`,
      '通知显示方式: <select name="ehConfig_notification"><option value="0">Web API: Notification</option><option value="1">GM_notification</option><option value="2">window.alert</option><option value="3">页面元素</option><option value="-1">不显示</option></select>',
      '',
      // 搜索页
      '<span class="ehHighlight">搜索页:</span>',
      '<div class="ehNew"></div>启动功能: <label for="ehConfig_preloadPaneImage"><input type="checkbox" id="ehConfig_preloadPaneImage">自动载入预览图</label>; <label for="ehConfig_languageCode"><input type="checkbox" id="ehConfig_languageCode">显示ISO语言代码</label>; <label for="ehConfig_pageCount"><input type="checkbox" id="ehConfig_pageCount">显示本子页数</label>; <label for="ehConfig_sortByName"><input type="checkbox" id="ehConfig_sortByName">本子按名称排序</label>; <label for="ehConfig_tagPreview"><input type="checkbox" id="ehConfig_tagPreview">标签预览</label>; 预载: 自动预载接下来 <input name="ehConfig_preloadResult" type="number" placeholder="1" min="0"> 页',
      `搜索按钮事件: <input name="ehConfig_searchEvent" title="${htmlEscape('事件格式: 鼠标按键,键盘按键,搜索文本,是否中文<br>多个事件以<span class="ehHighlight">|</span>分割<br>鼠标按键:<ul><li>0 -> 左键</li><li>1 -> 中键</li><li>2 -> 右键</li></ul>键盘按键:<ul><li>-1 -> 任意</li><li>0 -> altKey</li><li>1 -> ctrlKey</li><li>2 -> shiftKey</li></ul>搜索事件:<ul><li>-1 -> 自行选择</li><li>0 -> 主要名称</li><li>1 -> 作者或组织(顺位)</li></ul>是否中文:<ul><li>0 -> 否</li><li>1 -> 是</li></ul>')}" type="text" placeholder="0,-1,0,0|2,-1,0,1"><input name="ehConfig_searchEventChs" type="hidden">`,
      '<div class="ehNew"></div>检查本地是否存在: <label for="ehConfig_checkExist_disable"><input type="radio" name="ehConfig_checkExist" id="ehConfig_checkExist_disable" value="" checked>关闭</label><label for="ehConfig_checkExist_everything"><input type="radio" name="ehConfig_checkExist" id="ehConfig_checkExist_everything" value="everything">Everything (需要后台运行<a href="https://github.com/dodying/Nodejs/blob/master/comicSort/tools/check.js" target="_blank">comicSort/tools/check</a>, <a href="https://www.voidtools.com/downloads/#downloads" target="_blank">Everything</a>, 以及<a href="https://www.voidtools.com/downloads/#cli" target="_blank">Everything CLI</a>)</label><label for="ehConfig_checkExist_mysql"><input type="radio" name="ehConfig_checkExist" id="ehConfig_checkExist_mysql" value="mysql">MySQL (需要后台运行<a href="https://github.com/dodying/Nodejs/blob/master/comicBrowser/check.js" target="_blank">comicBrowser/check</a>, 以及<a href="https://www.mysql.com/" target="_blank">MySQL</a>)</label>',
      '<div class="ehNew"></div>检查本地是否存在: <label for="ehConfig_checkExistAtStart"><input type="checkbox" id="ehConfig_checkExistAtStart">页面载入后检查一次</label>; <label for="ehConfig_checkExistName2" title="去除集会号/作者/原作名/翻译组织/语言等"><input type="checkbox" id="ehConfig_checkExistName2">只搜索主要名称</label>; <label for="ehConfig_hideExist" title="只有完全匹配的本子才会被隐藏 (汉化组不同也视为完全相同)"><input type="checkbox" id="ehConfig_hideExist">隐藏已存在的本子</label>; 本地服务器: <input name="ehConfig_checkExistSever" type="text" placeholder="http://127.0.0.1:3000/" min="0">; <label for="ehConfig_checkExistPages"><input type="checkbox" id="ehConfig_checkExistPages">检查图片数</label>',
      `搜索栏自动完成: 字符数 > <input name="ehConfig_acLength" type="number" placeholder="3" min="-1" title="等于-1时，禁用自动填充"> 时，显示; 显示项目: <input name="ehConfig_acItem" type="text" placeholder="language,artist,group,parody,character,cosplayer,female,male,mixed,other,reclass,temp" title="${htmlEscape('以<span class="ehHighlight">,</span>分割')}">`,
      '隐藏本子: <label for="ehConfig_notHideUnlike"><input type="checkbox" id="ehConfig_notHideUnlike">不隐藏带有厌恶标签的画廊</label>; <label for="ehConfig_alwaysShowLike"><input type="checkbox" id="ehConfig_alwaysShowLike">总是显示带有喜欢标签的画廊</label>; 评分 < <input name="ehConfig_lowRating" type="number" placeholder="4.0" min="0" max="5" step="0.1">; 页数 < <input name="ehConfig_fewPages" type="number" placeholder="5" min="1">',
      '检测新本子: 结果数目变化 <= <input name="ehConfig_autoUpdateCheck" type="number" placeholder="10" min="0">，自动更新; 每页 <input name="ehConfig_checkListPerPage" type="number" placeholder="25" min="25"> 条CheckList',
      '',
      // 信息页
      '<span class="ehHighlight">信息页:</span>',
      `默认设置: <input name="ehConfig_uconfig" title="${htmlEscape('在Settings页面使用$.serialize获取，可留空<br>留空表示每次使用当前设置')}" type="text"> <input type="button" name="getUconfig" value="Get NOW" title="立即获取">`,
      `下载相关: <label for="ehConfig_autoStartDownload"><input type="checkbox" id="ehConfig_autoStartDownload">锚部分不为空时，自动开始下载</label>; <label for="ehConfig_autoClose" title="${htmlEscape('Firefox: 需打开about:config并设置dom.allow_scripts_to_close_windows为true<br>Chromium: 无法关闭非脚本打开的页面')}"><input type="checkbox" id="ehConfig_autoClose">锚部分不为空时，下载完成后自动关闭标签</label>`,
      '下载-EHD相关: <label for="ehConfig_enableEHD"><input type="checkbox" id="ehConfig_enableEHD">启用内置 [E-Hentai-Downloader]</label>; <label for="ehConfig_fixEHDCounter"><input type="checkbox" id="ehConfig_fixEHDCounter">尝试修复EHD下载时计数错误</label>',
      `<div class="ehNew"></div>下载-EHD相关-下载连续失败: 失败 <input name="ehConfig_ehdFailed1" type="number" placeholder="20" min="1" title="仅当成功下载时，才会重新计数，否则累加直至设定值"> 次时, 设置 <input name="ehConfig_ehdFailed1Config" title="JSON格式，仅影响本次下载" type="text" value="${htmlEscape('{"thread-count":1,"timeout":300,"speed-detect":true,"speed-expired":180}')}">`,
      `<div class="ehNew"></div>下载-EHD相关-下载连续失败: 失败 <input name="ehConfig_ehdFailed2" type="number" placeholder="30" min="1" title="仅当成功下载时，才会重新计数，否则累加直至设定值"> 次时, 设置 <input name="ehConfig_ehdFailed2Config" title="JSON格式，仅影响本次下载" type="text" value="${htmlEscape('{"thread-count":1,"timeout":0,"speed-detect":false,"speed-expired":0}')}">`,
      '<div class="ehNew"></div>下载-EHD相关-下载连续失败: 失败 <input name="ehConfig_ehdFailed3" type="number" placeholder="50" min="1" title="此时重新计数"> 次时，暂停; 当无人坚守模式时，暂停 <input name="ehConfig_ehdFailed3Time" type="number" placeholder="600" min="0" title="当0时，不会继续下载""> 秒后，继续下载',
      `<label for="ehConfig_tagTranslateImage"><input type="checkbox" id="ehConfig_tagTranslateImage">标签翻译显示图片</label>; <label for="ehConfig_showAllThumb"><input type="checkbox" id="ehConfig_showAllThumb">显示所有预览图</label>; <label for="ehConfig_enableChangeSize" title="${htmlEscape('当大图(双页)尺寸与小图(单页)尺寸相同时，失效')}"><input type="checkbox" id="ehConfig_enableChangeSize">启用自动调整图片尺寸</label>`,
      '调整图片尺寸: 大图(双页)宽高比: <input name="ehConfig_rateD" type="number" placeholder="1.1" step="0.1">; 其他默认视为小图(单页); 大图(双页)尺寸: <select name="ehConfig_sizeD"><option value="0">Auto</option><option value="5">2400x</option><option value="4">1600x</option><option value="3">1280x</option><option value="2">980x</option><option value="1">780x</option></select>; 小图(单页)尺寸: <select name="ehConfig_sizeS"><option value="0">Auto</option><option value="5">2400x</option><option value="4">1600x</option><option value="3">1280x</option><option value="2">980x</option><option value="1">780x</option></select>',
      `<label for="ehConfig_downloadSizeChanged" title="${htmlEscape('需开启: <ul><li>启用内置 [E-Hentai-Downloader] (并设置关闭Request File System to handle large Zip file)</li><li>显示所有预览图</li><li>启用自动调整图片尺寸</li><li>大图(双页) 与 小图(单页)尺寸 不同</li></ul><hr>注意: 避免出错，应一次下载一个画廊')}"><input type="checkbox" id="ehConfig_downloadSizeChanged">下载调整过大小的图片压缩档</label>`,
    ].map((i) => (i ? `<li>${i}</li>` : '<hr>')).join('');
    $('<div class="ehConfig"></div>').html(`<ul>${_html}</ul><div class="ehConfigBtn"><input type="button" name="reset" value="Reset" title="重置"><input type="button" name="save" value="Save" title="保存"><input type="button" name="cancel" value="Cancel" title="取消"></div>`).appendTo('body').on('click', (e) => {
      if ($(e.target).is('.ehConfigBtn>input[type="button"][name="reset"]')) {
        if (window.confirm('Continue to RESET')) {
          GM_setValue('config', {});
          $('.ehConfig').remove();
          Object.keys(G.config).forEach((i) => {
            delete G.config[i];
          });
          defaultConfig();
        }
      } else if ($(e.target).is('.ehConfigBtn>input[type="button"][name="save"]')) {
        const config = GM_getValue('config', {});
        $('.ehConfig input:not([type="button"]):not([type="file"]),.ehConfig select').toArray().forEach((i) => {
          let name,
            value;
          if (i.type === 'number') {
            name = i.name;
            value = (i.value || i.placeholder) * 1;
            if (isNaN(value)) return;
          } else if (i.type === 'text' || i.type === 'hidden') {
            name = i.name;
            value = i.value || i.placeholder;
          } else if (i.type === 'checkbox') {
            name = i.id;
            value = i.checked;
          } else if (i.type === 'select-one') {
            name = i.name;
            value = i.value;
          } else if (i.type === 'radio') {
            if (!i.checked) return;
            name = i.name;
            value = i.value;
          }
          if (name.match(/^ehConfig_/)) config[name.replace('ehConfig_', '')] = value;
        });

        const searchEvent = config.searchEvent.split('|');
        const searchEventChs = [];
        for (const i of searchEvent) {
          const arr = i.split(',').map((i) => (isNaN(i * 1) ? i : i * 1));
          const chs = [];
          chs.push(`鼠标${'左中右'.split('')[arr[0]]}键`);
          chs.push(arr[1] === -1 ? '任意按键' : ['altKey', 'ctrlKey', 'shiftKey'][arr[1]]);
          if (arr[2] === -1) {
            chs.push('自行选择');
          } else if (arr[2] === 0) {
            chs.push('主要名称');
          } else if (arr[2] === 1) {
            chs.push('作者或组织(顺位)');
          }
          if (arr[3] === 1) chs.push(' + chinese');
          searchEventChs.push(`${chs[0]} + ${chs[1]} -> ${chs[2]}${chs[3] || ''}`);
        }
        config.searchEventChs = searchEventChs.join('<br>');

        Object.assign(G.config, config);
        GM_setValue('config', config);
        $('.ehConfig').remove();
      } else if ($(e.target).is('.ehConfigBtn>input[type="button"][name="cancel"]')) {
        $('.ehConfig').remove();
      } else if ($(e.target).is('.ehConfig input[name="exportValues"]')) {
        const obj = {};
        GM_listValues().forEach((key) => {
          if (['EHD_code', 'EHT'].includes(key)) return;
          obj[key] = GM_getValue(key);
        });
        const text = JSON.stringify(obj, null, 2);
        saveAs2(text, '[EH]Enhance.json');
      } else if ($(e.target).is('.ehConfig input[name="importValues"]')) {
        $('#selectFileConfig').click();
      } else if ($(e.target).is('.ehConfig input[name="testSelectors"]')) {
        const arr = [];
        const check = (name, selector) => {
          if (typeof selector === 'string' && $(selector).length === 0) arr.push({ name, selector });
        };
        if (G.infoPage) {
          for (const i of ['common', 'info']) {
            for (const j in SEL.EH[i]) check(`${i}:${j}`, SEL.EH[i][j]);
          }
          for (const i in SEL.EHD) check(`EHD:${i}`, SEL.EHD[i]);
        } else if (G.searchPage) {
          for (const i of ['common', 'search']) {
            for (const j in SEL.EH[i]) check(`${i}:${j}`, SEL.EH[i][j]);
          }
        } else if (G.settingPage) {
          const i = 'setting';
          for (const j in SEL.EH.setting) check(`${i}:${j}`, SEL.EH[i][j]);
        }
        if (arr.length) {
          console.error('test selector:', arr);
          window.alert(`${arr.length} selectors maybe changed!`);
        }
      } else if ($(e.target).is('.ehConfig input[name="updateEHT"]')) {
        $(e.target).prop('disabled', true).val('Updating...');
        updateEHT().then(() => {
          $(e.target).prop('disabled', false).val('Update Now');
          G.EHT = GM_getValue('EHT').data;
        });
      } else if ($(e.target).is('.ehConfig input[name="exportEHT"]')) {
        const text = JSON.stringify(GM_getValue('EHT', {}));
        saveAs2(text, 'EHT.json');
      } else if ($(e.target).is('.ehConfig input[name="emptyEHT"]')) {
        GM_deleteValue('EHT');
        GM_deleteValue('EHT_checkTime');
      } else if ($(e.target).is('.ehConfig input[name="updateEHD"]')) {
        $(e.target).prop('disabled', true).val('Updating...');
        updateEHD().then(() => {
          $(e.target).prop('disabled', false).val('Update Now');
        });
      } else if ($(e.target).is('.ehConfig input[name="exportEHD"]')) {
        const text = GM_getValue('EHD_code', '');
        saveAs2(text, 'E-Hentai-Downloader.user.js');
      } else if ($(e.target).is('.ehConfig input[name="emptyEHD"]')) {
        GM_deleteValue('EHD_code');
        GM_deleteValue('EHD_checkTime');
        GM_deleteValue('EHD_version');
      } else if ($(e.target).is('.ehConfig input[name="exportIntroPic"]')) {
        const text = arrUnique(GM_getValue('introPic', [])).sort().map((i) => G.config.exportIntroPicFormat.replace(/{id}/g, i).replace(/{cr}/g, '\r').replace(/{lf}/g, '\n')).join('');
        GM_setClipboard(text);
      } else if ($(e.target).is('.ehConfig input[name="getUconfig"]')) {
        $(e.target).prop('disabled', true).val('Getting...');
        getEConfig().then((uconfig) => {
          $('input[name="ehConfig_uconfig"]').val(uconfig);
          $(e.target).prop('disabled', false).val('Get NOW');
        });
      }
    });

    $('#selectFileConfig').on({
      change: (e) => {
        if (!e.target.files || !e.target.files.length || !window.confirm('Continue to IMPORT')) {
          e.target.value = null;
          return;
        }
        const fr = new window.FileReader();
        fr.onload = (e) => {
          let json = e.target.result;
          try {
            json = JSON.parse(json);
          } catch (error) {
            setNotification('Parse Json Data Error');
            return;
          }
          Object.keys(json).forEach((i) => {
            GM_setValue(i, json[i]);
          });
          window.location.assign(window.location.href);
        };
        fr.readAsText(e.target.files[0]);
      },
    });
    $('[name="updateEHT"]').on({
      mouseenter: (e) => {
        const time = GM_getValue('EHT_checkTime', '');
        let d = new Date(time);
        d = G.config.timeShow === 'iso' ? new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000) : d;
        const timeText = d.toLocaleString(navigator.language, { hour12: false });
        const length = G.EHT.map((i) => i.count).reduce((a, c) => a + c);
        $(e.target).attr('title', `当前总数: <span class="ehHighlight">${length}</span><hr><time title="${timeText}" datetime="${time}">${calcRelativeTime(time)}</time>`);
      },
    });
    $('[name="updateEHD"]').on({
      mouseenter: (e) => {
        const time = GM_getValue('EHD_checkTime', '');
        let d = new Date(time);
        d = G.config.timeShow === 'iso' ? new Date(d.getTime() + d.getTimezoneOffset() * 60 * 1000) : d;
        const timeText = d.toLocaleString(navigator.language, { hour12: false });
        const version = GM_getValue('EHD_version', '');
        $(e.target).attr('title', `当前版本: <span class="ehHighlight">${version}</span><hr><time title="${timeText}" datetime="${time}">${calcRelativeTime(time)}</time>`);
      },
    });
    $('[name="openUrlTest"]').on('change', (e) => {
      if (e.target.value) openUrl(e.target.value);
    });

    const config = GM_getValue('config', {});
    $('.ehConfig input:not([type="button"]):not([type="file"]),.ehConfig select').toArray().forEach((i) => {
      let name = i.name || i.id;
      name = name.replace('ehConfig_', '');
      if (!(name in config)) return;
      const value = config[name];
      if (i.type === 'text' || i.type === 'hidden' || i.type === 'select-one' || i.type === 'number') {
        i.value = value;
      } else if (i.type === 'checkbox') {
        i.checked = value;
      } else if (i.type === 'radio') {
        i.checked = (i.value === value);
      }
    });
  }).appendTo(SEL.EH.common.navBar);
}

function showTooltip() { // 显示提示
  $('<div class="ehTooltip"></div>').appendTo('body');
  let preEle,
    animateTimeout;

  $('body').on('mousemove keydown', (e) => {
    if ((e.target === preEle || $(e.target).parents().filter(preEle).length) && e.type !== 'keydown') return;
    const title = $(preEle).attr('raw-title');
    $(preEle).removeAttr('raw-title').attr('title', title);
    $('.ehTooltip').hide().scrollTop(0);
    if (animateTimeout) clearTimeout(animateTimeout);
  });

  const target = ':visible[title],:visible[raw-title],:visible[tooltip],[copy],[key-code][key-event]';
  $('body').on('mouseenter', target, (e) => {
    preEle = e.target;
    const title = [$(preEle).attr('tooltip')];
    if ($(preEle).is('[title],[raw-title]')) {
      let title1 = $(preEle).attr('title') || $(preEle).attr('raw-title') || '';
      if (!title1) {
        const preEleTrue = $(preEle).parents().filter('[title]').eq(-1)[0];
        if (preEleTrue) {
          preEle = preEleTrue;
          title1 = $(preEle).attr('title') || $(preEle).attr('raw-title');
        }
      }
      $(preEle).removeAttr('title').attr('raw-title', title1);
      title.push(title1);
    }
    if ($(preEle).is('[copy]')) {
      title.push(`点击复制: <span class="ehHighlight">${$(preEle).attr('copy')}</span>`);
    }
    if ($(preEle).is('[key-code][key-event]')) {
      const code = $(preEle).attr('key-code');
      const event = $(preEle).attr('key-event');
      title.push(`${code}: ${event}<br>Shift+${code}: ${event}-2`);
    }
    $('.ehTooltip').html(title.filter((i) => i).join('<hr>'));

    let top = $(preEle).offset().top - $(window).scrollTop();
    const height = $(preEle).height() + parseInt($(preEle).css('padding-bottom')) + parseInt($(preEle).css('border-bottom-width')) + parseInt($(preEle).css('margin-bottom'));
    const _height = $('.ehTooltip').height() + parseInt($('.ehTooltip').css('padding-bottom')) + parseInt($('.ehTooltip').css('border-bottom-width')) + parseInt($('.ehTooltip').css('margin-bottom'));
    top = top + height + 5 + _height > window.innerHeight ? top - _height - 5 : top + height + 5;

    let left = $(preEle).offset().left - $('body').scrollLeft();
    const width = $(preEle).width() + parseInt($(preEle).css('padding-left')) + parseInt($(preEle).css('border-left-width')) + parseInt($(preEle).css('margin-left'));
    const _width = $('.ehTooltip').width() + parseInt($('.ehTooltip').css('padding-left')) + parseInt($('.ehTooltip').css('border-left-width')) + parseInt($('.ehTooltip').css('margin-left'));
    left = left + _width > window.innerWidth ? left + width - _width : left;
    if (top < 0) top = 0;
    if (left < 0) left = 0;
    $('.ehTooltip').show().css({
      top,
      left,
    });
  });

  $('body').on('wheel', target, (e) => {
    $('.ehTooltip').get(0).scrollTop += 60 * Math.sign(e.originalEvent.deltaY);
  });
}

function tagEvent() { // 标签事件
  $('<div class="ehTagEvent"></div>').insertAfter(SEL.EH.info.tagContainer);
  ['Perma-ban', 'Unlike', 'Alert', 'Like'].forEach((i) => {
    $(`<a class="ehTagEventNotice" name="${i}" href="javascript:;" on="true"></a>`).appendTo('.ehTagEvent').on('click', (e) => {
      const tags = GM_getValue('tagAction', {});
      const keyword = $('.ehTagEvent').attr('name');
      if ($(e.target).attr('on') === 'true') { // 添加行为
        tags[keyword] = i;
        $(SEL.EH.info.tagDivFromName(keyword.replace(/ /g, '_'))).attr('name', i);
      } else { // 移除行为
        delete tags[keyword];
        $(SEL.EH.info.tagDivFromName(keyword.replace(/ /g, '_'))).removeAttr('name');
      }
      $(e.target).attr('on', $(e.target).attr('on') !== 'true');
      $('.ehTagEventNotice').not(e.target).attr('on', 'true');
      GM_setValue('tagAction', tags);
    });
  });
  $('<a href="https://github.com/Mapaler/EhTagTranslator/" target="_blank">Copy for ETT</a>').appendTo('.ehTagEvent').on('click', (e) => {
    GM_setClipboard(`| ${$('.ehTagEvent').attr('name')} | | | |`);
    return false;
  });
  $(SEL.EH.info.tag).on({
    contextmenu: (e) => { // 搜索标签+中文
      let keyword = e.target.innerText.replace(/\s+\|.*/, '');
      keyword = `"${keyword}"`;
      if (SEL.EH.info.nameFromTag(e.target.id).length > 2) keyword = `${SEL.EH.info.nameFromTag(e.target.id)[2]}:${keyword.replace(/"$/, '$"')}`;
      openUrl(G.config.searchArguments.replace(/{q}/g, encodeURIComponent(`${keyword} language:chinese$`)));
      return false;
    },
    click: (e) => { // 标签
      $('.ehTagEvent').css('display', e.target.style.color ? 'block' : 'none').attr('name', SEL.EH.info.nameFromTag(e.target.id)[1].replace(/_/g, ' '));
      const name = $(e.target).parent().attr('name');
      $(`.ehTagEvent>a[name="${name}"]`).attr('on', 'false');
      $(`.ehTagEvent>a:not([name="${name}"])`).attr('on', 'true');
    },
  });
  $(SEL.EH.info.tagDiv).toArray().forEach((i) => {
    const id = SEL.EH.info.nameFromTag(i.id)[1].replace(/_/g, ' ');
    const tags = GM_getValue('tagAction', {});
    if (id in tags) $(i).attr('name', tags[id]);
  });
}

function tagPreview() { // 标签预览
  $('<div class="ehTagPreview"></div>').appendTo('body');
  $('body').on({
    mousemove(e) {
      if (!$(e.target).is(SEL.EH.search.galleryA)) {
        $('.ehTagPreview').hide();
        return;
      }
      const { target } = e;
      const info = G.gmetadata.filter((i) => i.gid === target.href.split('/')[4] * 1)[0];
      if (!info) return;
      $('.ehTagPreview').html(`<div>${info.title_jpn}</div><div style="color:#f00;">[${Math.ceil(info.filesize / 1024 / 1024)}M] ${info.filecount}P ${info.rating}</div><div style="height:2px;background-color:#000000;"></div>`).show();
      const tagsHTML = $('<div></div>').appendTo('.ehTagPreview');
      info.tags.forEach((i) => {
        const tag = i.split(':');
        const main = tag[0];
        const sub = tag[tag.length - 1];
        const chs = findData(main, sub, true);
        if ($(`.ehTagPreviewLi[name="${main}"]`, tagsHTML).length === 0) $(`<li class="ehTagPreviewLi" name="${main}"></li>`).appendTo(tagsHTML);
        $('<span></span>').text(chs.cname || sub).appendTo($(`.ehTagPreviewLi[name="${main}"]`, tagsHTML));
      });
      const _width = $('.ehTagPreview').outerWidth();
      const _height = $('.ehTagPreview').outerHeight();
      let left = _width + e.clientX + 10 < window.innerWidth ? e.clientX + 5 : e.clientX - _width - 5;
      let top = _height + e.clientY + 10 < window.innerHeight ? e.clientY + 5 : e.clientY - _height - 5;
      if (left < 0) left = 0;
      if (top < 0) top = 0;
      $('.ehTagPreview').css({
        left,
        top,
      });
    },
  });
}

function task() { // 下载任务
  if (G.taskInterval) return;
  G.taskStop = false;
  const { title } = document;
  const main = async () => {
    const task = GM_getValue('task', []);
    if ((task.length === 0 && !GM_getValue('tasking')) || G.taskStop) {
      G.taskInterval = null;
      changeFav('/favicon.ico');
      document.title = title;
      $('[name="taskControl"]').text('Start Task');
      return;
    }

    const downloading = GM_getValue('downloading', []);
    if (downloading.length) {
      await waitFor(() => false, 2 * 1000);
      main();
      return;
    }

    let tasking = GM_getValue('tasking');
    if (tasking) {
      await waitFor(() => false, 2 * 1000);
      main();
      return;
    }

    tasking = task.splice(0, 1)[0];
    GM_setValue('tasking', tasking);
    GM_setValue('task', task);
    await waitFor(() => false, 2 * 1000);
    openUrl(`${tasking}#2`);

    getRemainImg(task.length + 1).then((data) => changeFav(data));
    document.title = `[${task.length + 1}]${title}`;

    main();
  };
  G.taskInterval = setTimeout(main, 200);
}

function taskRemove(id) {
  const tasking = GM_getValue('tasking', '');
  if (tasking.match(id)) GM_deleteValue('tasking');
}

function tagTranslate() { // 标签翻译
  const data = $(SEL.EH.info.tag).toArray().map((i) => {
    const info = i.id.replace(/^ta_/, '').split(/:/);
    return findData(info[0], info[1], !G.config.tagTranslateImage);
  }).filter((i) => Object.keys(i).length);
  const css = [
    `${SEL.EH.info.tagContainer}{overflow:visible;min-height:295px;height:auto}`,
    `${SEL.EH.info.infoContainer}{min-height:330px;height:auto;position:static}`,
    `${SEL.EH.info.tag}{background:inherit}`,
    `${SEL.EH.info.tag}::before{font-size:12px;overflow:hidden;line-height:20px;height:20px;text-transform:capitalize;}`,
    `${SEL.EH.info.tag}::after{display:block;color:#ff8e8e;font-size:14px;background:inherit;border:1px solid #000;border-radius:5px;position:absolute;float:left;z-index:999;padding:8px;box-shadow:3px 3px 10px #000;min-width:150px;max-width:500px;white-space:pre-wrap;opacity:0;transition:opacity .2s;transform:translate(-50%,20px);top:0;left:50%;pointer-events:none;padding-top:8px;font-weight:400;line-height:20px}`,
    `${SEL.EH.info.tag}:hover::after{opacity:1;pointer-events:auto}`,
    `${SEL.EH.info.tag}:focus::after{opacity:1;pointer-events:auto}`,
    `${SEL.EH.info.tag}:focus::before{font-size:12px;position:relative;background-color:inherit;border:1px solid #000;border-width:1px 1px 0 1px;padding:3px 4px;color:inherit;border-radius:5px 5px 0 0}`,
    `${SEL.EH.info.tag}:hover::before{font-size:12px;position:relative;background-color:inherit;border:1px solid #000;border-width:1px 1px 0 1px;padding:3px 4px;color:inherit;border-radius:5px 5px 0 0}`,
    'div.gt,div.gtw,div.gtl{line-height:20px;height:20px}',
    `${SEL.EH.info.tag}:hover::after{z-index:9999998}`,
    `${SEL.EH.info.tag}:focus::after{z-index:9999996}`,
    `${SEL.EH.info.tag}:hover::before{z-index:9999999}`,
    `${SEL.EH.info.tag}:focus::before{z-index:9999997}`,
    `${SEL.EH.info.tag}::after{color:#${window.window.location.host === 'exhentai.org' ? 'fff' : '000'}}`,
    ...data.map((i) => `${SEL.EH.info.tagFromName(i.name)}{font-size:0;}`),
  ];
  const dealWithContent = (text) => {
    const arr = text.split(/(!\[.*?\]\(.*?\))/);
    const output = [];
    for (const i of arr) {
      if (i.match(/!\[(.*?)\]\((.*?)\)/)) {
        const match = i.match(/!\[(.*?)\]\((.*?)\)/);
        output.push(`url(${match[2].replace(/^# "(.*)"$/, '$1')})`);
      } else {
        output.push(`"${window.CSS.escape(i)}"`);
      }
    }
    return output.join('');
  };
  data.forEach((i) => {
    css.push(`${SEL.EH.info.tagFromName(i.name)}::before{content:${dealWithContent(i.cname)}}`);
    if (i.info) css.push(`${SEL.EH.info.tagFromName(i.name)}::after{content:${dealWithContent(i.info)}}`);
  });

  $('<style></style>').text(css.join('\n')).appendTo('head');
}

function toggleBlacklist(keyword) { // 加入黑名单或从黑名单中移除
  const blacklist = GM_getValue('blacklist', []);
  if (!blacklist.includes(keyword)) { // 加入黑名单
    blacklist.push(keyword);
  } else if (blacklist.includes(keyword)) { // 从黑名单中移除
    blacklist.splice(blacklist.indexOf(keyword), 1);
  }
  GM_setValue('blacklist', blacklist);
}

function translateText(text) {
  if (!text) return text;
  const arr = [];
  const re = /(\w+):("|)(.*?)([$"]+)/;
  let result;
  for (let i = 0; ; i++) {
    result = re.exec(text);
    if (result) {
      text = text.replace(result[0], `{${i}}`);
      let temp;
      if (findData(result[1]).cname) {
        const chs = findData(result[1], result[3], true).cname;

        temp = `${findData(result[1]).cname}:"`;
        temp = temp + (chs || result[3]);
        temp = `${temp}"`;
      }
      arr.push(temp || result[0]);
      result = re.exec(text);
    } else {
      break;
    }
  }
  arr.forEach((i, j) => {
    text = text.replace(`{${j}}`, i);
  });
  return text;
}

async function updateEHD() { // 更新EHD
  const res = await xhrSync('https://cdn.jsdelivr.net/gh/ccloli/E-Hentai-Downloader@master/e-hentai-downloader.meta.js');
  const version = res.response.match(/\/\/ @version\s+([\d.]+)/)[1];
  if (new Intl.Collator(undefined, { numeric: true }).compare(version, GM_getValue('EHD_version', '0')) === 1) {
    GM_setValue('EHD_version', version);
    const res = await xhrSync('https://cdn.jsdelivr.net/gh/ccloli/E-Hentai-Downloader@master/src/main.js');
    setNotification(`E-Hentai-Downloader has been updated to ${version}`);
    GM_setValue('EHD_code', res.response);
  }
  GM_setValue('EHD_checkTime', new Date().getTime());
}

async function updateEHT() {
  const name = 'db.raw.json';
  const url = 'https://api.github.com/repos/EhTagTranslation/Database/releases';
  const res = await xhrSync(url, null, { responseType: 'json' });
  const url1 = res.response.filter((i) => i.assets.filter((i) => i.name === name).length)[0].assets.filter((i) => i.name === name)[0].browser_download_url;
  const res1 = await xhrSync(url1);

  GM_setValue('EHT', JSON.parse(res1.response));
  setNotification('EhTagTranslator has been up-to-date');
  GM_setValue('EHT_checkTime', new Date().getTime());
}

function sortByName() {
  let all = $(SEL.EH.search.resultContent).toArray();
  for (const i of all) {
    i.sortData = $(i).find(SEL.EH.search.galleryA).text();
  }
  const collator = new Intl.Collator(undefined, { numeric: true });
  all = all.sort((a, b) => collator.compare(a.sortData, b.sortData));
  $(all).appendTo($(SEL.EH.search.resultTbody).eq(0));

  if (G.config.preloadResult) {
    $(SEL.EH.search.resultTable).slice(1).remove();
    $(SEL.EH.search.pagesContainerBottom).slice(1, -1).remove();
    $(SEL.EH.search.resultTableContainer).find('hr').remove();
  }
}

/* 通用函数 */

function arrUnique(arr) { // 数组去重
  return [...(new Set(arr))];
}

async function getRemainImg(number) {
  if (!document.fonts.check('12px fff-forward')) {
    const font = 'data:application/octet-stream;base64,AAEAAAAPAIAAAwBwRkZUTXAoyLgAAAh0AAAAHE9TLzKD8VMrAAABeAAAAFZjbWFwEHAe6gAAAfwAAAFKY3Z0IJ9SpYsAAAOkAAAASGZwZ22DM8JPAAADSAAAABRnYXNw//8AAwAACGwAAAAIZ2x5ZpSuDBEAAAQMAAACJGhlYWT3fx36AAAA/AAAADZoaGVhBtEB/AAAATQAAAAkaG10eAvp//cAAAHQAAAAKmxvY2EDxANWAAAD7AAAAB5tYXhwAKsAfAAAAVgAAAAgbmFtZUGveT4AAAYwAAAB+3Bvc3QABwCJAAAILAAAAD5wcmVwyQ/SEwAAA1wAAABIAAEAAAABAAATOCWqXw889QALA+gAAAAAuy28qwAAAADayBuI//n//AJxBOYAAAAIAAIAAAAAAAAAAQAABGX/BgAAAu7/+QAAAnEAAQAAAAAAAAAAAAAAAAAAAAcAAQAAAA4ADAADAAAAAAACAAgAQAAKAAAAhwAuAAAAAAABArUBkAAFAAECvAKKAAAAjwK8AooAAAHFADIBAwAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBbHRzAEAAIAA5BGX/BgAABdwA+gAAAAEAAAAAAAABbAAhAAAAAAFNAAABdwAAAu7/+QH0//kC7v/5//n/+f/5//n/+f/5//kAAAAAAAMAAAADAAAAHAABAAAAAABEAAMAAQAAABwABAAoAAAABgAEAAEAAgAgADn//wAAACAAMP///+P/1AABAAAAAAAAAAABBgAAAQAAAAAAAAABAgAAAAIAAAAAAAAAAAAAAAAAAAABAAADAAAAAAAAAAAAAAAAAAAABAUGBwgJCgsMDQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAEALHZFILADJUUjYWgYI2hgRC1AEQsLCgoJCQgIAwMCAgEBAAABjbgB/4VFaERFaERFaERFaERFaERFaERFaERFaESzBQRGACuzBwZGACuxBARFaESxBgZFaET+hf/8A28E5gD8AIIAgQD8AX0B9AF3AfRcElwSXBJcElwSXBJcElwSXBJcElwSXBJcElwSXBJcElwSXBJcElwSABQAFgAhAnkAAAAqACoAKgAqAD4ATgBoAIAAmACyAMwA3gD4ARIAAAACACEAAAEqApoAAwAHAC6xAQAvPLIHBCLtMrEGBdw8sgMCIu0yALEDAC88sgUEIu0ysgcGI/w8sgECIu0yMxEhESczESMhAQnox8cCmv1mIQJYAAAC//n//AJxBOYAAwAHAAA3MxEjAREhEfp2dv7/Anj+Auf8FwTq+xYAAf/5//wBdwTmAAUAAAUhESMRIQF3/v99AX4EA+kBAQAB//n//AJxBOYACwAABSERITUhESERIRUhAnH9iAF3/okCeP6JAXcEAvbzAQH9C/MAAAAAAf/5//wCcQTmAAsAAAcRITUhESE1IREhEQcBd/6JAXf+iQJ4BAEC8wEB8wEB+xYAAf/5//wCcQTmAAkAAAEhESERMxEhESEBcP6JAQF2AQH+/wHxAvX+DAH0+xYAAAAAAf/5//wCcQTmAAsAAAUhESE1IREhESEVIQJx/YgBd/6JAnj+iQF3BAEC8wL1/v/zAAAAAAL/+f/8AnEE5gADAAsAADczNSMBESERIRUhEfp2dv7/Anj+iQF3/vP+CwTq/v/z/QoAAAAB//n//AJxBOYABQAABSERIREhAnH+//6JAngEA+kBAQAAAAAD//n//AJxBOYAAwAHAAsAAAcRIREBIxUzAzM1IwcCeP7/dnZ2dnYEBOr7FgH49gHw9wAAAv/5//wCcQTmAAMACwAAEzM1IwERITUhESER+nZ2/v8Bd/6JAngC8vP8FwEC8wL1+xYAAAAADgCuAAEAAAAAAAAANQBsAAEAAAAAAAEACwC6AAEAAAAAAAIABwDWAAEAAAAAAAMACwD2AAEAAAAAAAQACwEaAAEAAAAAAAUAAQEqAAEAAAAAAAYACgFCAAMAAQQJAAAAagAAAAMAAQQJAAEAFgCiAAMAAQQJAAIADgDGAAMAAQQJAAMAFgDeAAMAAQQJAAQAFgECAAMAAQQJAAUAAgEmAAMAAQQJAAYAFAEsAKkAMgAwADAAMwAgAC0AIABGAEYARgAgAEYAbwBuAHQAcwAgAEYAbwByACAARgBsAGEAcwBoACAAIAAtACAAIAB3AHcAdwAuAGYAbwBuAHQAcwBmAG8AcgBmAGwAYQBzAGgALgBjAG8AbQAAqTIwMDMgLSBGRkYgRm9udHMgRm9yIEZsYXNoICAtICB3d3cuZm9udHNmb3JmbGFzaC5jb20AAEYARgBGACAARgBvAHIAdwBhAHIAZAAARkZGIEZvcndhcmQAAFIAZQBnAHUAbABhAHIAAFJlZ3VsYXIAAEYARgBGACAARgBvAHIAdwBhAHIAZAAARkZGIEZvcndhcmQAAEYARgBGACAARgBvAHIAdwBhAHIAZAAARkZGIEZvcndhcmQAADEAADEAAEYARgBGAEYAbwByAHcAYQByAGQAAEZGRkZvcndhcmQAAAACAAAAAAAA/3sAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAABAAIAAwATABQAFQAWABcAGAAZABoAGwAcAAAAAAAB//8AAgAAAAEAAAAA2jLwhAAAAAC7LbyrAAAAANrIG4g=';

    const f = new window.FontFace('fff-forward', `url(${font})`);
    const fontLoad = await f.load();
    document.fonts.add(fontLoad);
  }
  const canvas = document.createElement('canvas');
  const fontSize = 220;
  const width = 320;
  const height = 320;
  const color = '#000';
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  context.fillStyle = color;
  context.strokeRect(0, 0, width, height);

  context.font = `bold ${fontSize}px fff-forward`;
  context.textBaseline = 'bottom';

  context.textAlign = 'center';
  context.fillText(String(number).substr(-2), width / 2, height);
  return canvas.toDataURL();
}

function htmlEscape(text) {
  // refer https://github.com/lodash/lodash/blob/master/escape.js
  return text.replace(/[&<>"']/g, (match) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[match]));
}

function htmlUnescape(text) {
  // refer https://github.com/lodash/lodash/blob/master/unescape.js
  return text.replace(/&(?:amp|lt|gt|quot|#39);/g, (match) => ({
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  }[match]));
}

function reEscape(text) {
  // refer https://github.com/lodash/lodash/blob/master/escapeRegExp.js
  return text.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

function sortObj(obj, key = undefined) { // Object排序
  const objNew = {};
  Object.entries(obj).map((i) => ({
    key: i[0],
    value: i[1],
  })).sort((o1, o2) => (key ? o1.value[key] - o2.value[key] : o1.value - o2.value)).forEach((i) => {
    objNew[i.key] = i.value;
  });
  return objNew;
}

function fullWidth2Half(str) { // 全角字符转半角
  // info: https://en.wikipedia.org/wiki/Halfwidth_and_fullwidth_forms
  // refer: https://www.cnblogs.com/html55/p/10298569.html
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 12288) {
      result = result + String.fromCharCode(str.charCodeAt(i) - 12256);
      continue;
    }
    if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) result = result + String.fromCharCode(str.charCodeAt(i) - 65248);
    else result = result + String.fromCharCode(str.charCodeAt(i));
  }
  return result;
}

function waitFor(check, timeout) {
  return new Promise((resolve, reject) => {
    const start = new Date().getTime();
    let id;
    id = setInterval(async () => {
      if (new Date().getTime() - start >= timeout) {
        if (id) clearInterval(id);
        id = null;
        resolve(false);
        return;
      }
      let checked = false;
      try {
        checked = await check();
      } catch (error) { }
      if (checked) {
        if (id) clearInterval(id);
        id = null;
        resolve(true);
      }
    }, 200);
  });
}

function xhr(url, onload, parm = null, opt = {}) { // eslint-disable-line no-unused-vars
  if (G.debug) console.log({ url, parm });
  GM_xmlhttpRequest({
    method: parm ? 'POST' : 'GET',
    url,
    data: parm,
    timeout: opt.timeout || 60 * 1000,
    responseType: ['arraybuffer', 'blob', 'json'].includes(opt.responseType) ? opt.responseType : null,
    headers: opt.headers || {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    onload(res) {
      onload(res);
    },
    ontimeout(res) {
      if (typeof opt.ontimeout === 'function') opt.ontimeout(res);
    },
    onerror(res) {
      if (typeof opt.onerror === 'function') opt.onerror(res);
    },
  });
}

function xhrSync(url, parm = null, opt = {}) {
  // custom option:
  //  notry
  if (G.debug) console.log({ url, parm });
  return new Promise((resolve, reject) => {
    const dealWithError = async (msg, res) => {
      console.error(res);
      msg = `请求${msg}\n链接:\t${new URL(url, window.location.href).href}\n是否重试?`;

      if (opt.notry) { // 不重试
      } else if (url.match(/https?:\/\/(127\.0\.0\.1|localhost)/)) { // 本地路径
      } else if (navigator.onLine) { // 在线
        try {
          const online = await xhrSync(window.location.href, null, { method: 'HEAD', notry: true });
          if (online.status === 200 && (G.config.autoRetry || window.confirm(msg))) {
            await waitFor(() => false, 2000);
            xhrSync(url, parm, opt).then((res) => resolve(res), (res) => reject(res));
            return;
          }
        } catch (error) { // 离线
          if (window.confirm(`${msg}\n注意:您可能离线，请确认是否能打开该网站`)) {
            await waitFor(() => false, 2000);
            xhrSync(url, parm, opt).then((res) => resolve(res), (res) => reject(res));
            return;
          }
        }
      } else { // 离线
        if (window.confirm(`${msg}\n注意:您可能离线，请确认是否能打开该网站`)) {
          await waitFor(() => false, 2000);
          xhrSync(url, parm, opt).then((res) => resolve(res), (res) => reject(res));
          return;
        }
      }
      reject(res);
    };
    GM_xmlhttpRequest({
      method: opt.method || parm ? 'POST' : 'GET',
      url: url || opt.url,
      data: parm || opt.data,
      timeout: opt.timeout || 60 * 1000,
      responseType: ['text', 'json', 'blob', 'arraybuffer', 'document'].includes(opt.responseType) ? opt.responseType : 'text',
      headers: opt.headers || {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      onload(res) {
        resolve(res);
      },
      ontimeout: async (res) => {
        dealWithError('超时', res);
      },
      onerror: async (res) => {
        dealWithError('错误', res);
      },
    });
  });
}

function getStringSize(_string) {
  // from: https://stackoverflow.com/a/29955838

  let codePoint;
  let accum = 0;

  for (let stringIndex = 0, endOfString = _string.length; stringIndex < endOfString; stringIndex++) {
    codePoint = _string.charCodeAt(stringIndex);

    if (codePoint < 0x100) {
      accum = accum + 1;
      continue;
    }

    if (codePoint < 0x10000) {
      accum = accum + 2;
      continue;
    }

    if (codePoint < 0x1000000) {
      accum = accum + 3;
    } else {
      accum = accum + 4;
    }
  }

  return accum;
}

function diff(t1, t2) { // ignore case
  t1 = t1.replace(/\s+/g, ' ');
  t2 = t2.replace(/\s+/g, ' ');
  const arr1 = t1.split(G.punctuationWithWhiteGroupRegExp).filter((i) => i); // 不变
  const arr2 = t2.split(G.punctuationWithWhiteGroupRegExp).filter((i) => i); // 变
  const arr1Up = t1.toUpperCase().split(G.punctuationWithWhiteGroupRegExp).filter((i) => i);
  const arr2Up = t2.toUpperCase().split(G.punctuationWithWhiteGroupRegExp).filter((i) => i);
  const result = [];
  // const ignoreCharacters = [].concat(' '.split(''));
  for (let i = 0; i < arr1Up.length; i++) {
    if (arr2Up.includes(arr1Up[i])) {
      const index = arr2Up.indexOf(arr1Up[i]);
      if (index > 0 && arr1Up[i].match(G.punctuationWithWhiteRegExp)) {
        result.push([-1, arr1[i]]);
        continue;
      } else if (index > 0) { // added
        arr2Up.splice(0, index);
        const added = arr2.splice(0, index);
        result.push([1, added.join('')]);
      }
      result.push([0, arr1[i]]);
      arr2Up.splice(0, 1);
      arr2.splice(0, 1);
    } else { // removed
      result.push([-1, arr1[i]]);
    }
  }
  if (arr2.length) result.push([1, arr2.join('')]);

  return result;
}

function removeOtherInfo(text, reverse = false, infoGroup = G.infoGroup) {
  if (reverse) text = text.split('').reverse().join('');
  let group = reverse ? infoGroup.map((i) => i.split('').reverse().join('')) : infoGroup;
  group = group.map((i) => i.split('').map((j) => reEscape(j)));
  let re = group.map((i) => `${i[0]}.*?${i[1]}`).join('|');
  re = new RegExp(`^(${re})`);
  let matched = text.match(re);
  while (matched) {
    text = text.replace(re, '').trim();
    matched = text.match(re);
  }
  if (reverse) text = text.split('').reverse().join('');
  return text;
}

function windowClose() {
  if (G.isIframe) {
    window.alert = window.confirm = window.prompt = function () { };
    $(window).trigger('beforeunload');
    $(window).trigger('unload');
    window.onbeforeunload = null;

    const container = $('.ehIframeContainer', window.parent.document).filter((j, i) => $(i).find('iframe').get(0).contentWindow === unsafeWindow);
    if (container.length) container.find('[name="close"]').click();
  } else {
    window.close();
  }
}

// window.closeSafe = windowClose;

init().then(() => {
  //
}, (err) => {
  console.error(err);
});
