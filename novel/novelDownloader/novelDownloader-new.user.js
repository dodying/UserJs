// ==UserScript==
// @name         novelDownloader2
// @name:zh-CN   [小说]下载脚本2
// @namespace    https://github.com/dodying/Dodying-UserJs
// @description novelDownloaderHelper，press key "shift+d" to show up.
// @description:zh-CN 按“Shift+D”来显示面板，现支持自定义规则
// @version      0.0.4
// @author       dodying
// @namespace    https://github.com/dodying/
// @supportURL   https://github.com/dodying/UserJs/issues
// @icon         https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at       document-end
// @noframes
//
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.min.js
// @require      https://greasyfork.org/scripts/21541/code/chs2cht.js?version=137286
//
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_notification
//
// @include     *
// @include     http://book.qidian.com/info/*
// @include     http://read.qidian.com/chapter/*
// @include     http://www.wenku8.com/novel/*.htm
// @include     http://www.23wx.cc/du/*
//
// @exclude     http://alt.hentaiverse.org/*
// @exclude     http*://e-hentai.org/*
// @exclude     http*://exhentai.org/*
// @exclude     http://115.com/*
// ==/UserScript==
// 删除: 支持站点 搜索
// 保留 具体搜索引擎的提示
// 新增 novelDownloader2(已/可能)支持该站点
// 快速建立规则
if (window.frames.length !== parent.frames.length) throw (new Error('in frames'))
var CONFIG = {
  name: 'novelDownloader2',
  note: '阅读前说明: 本文件由用户脚本novelDownloader2制作',
  type: null,
  exclude: GM_getValue('exclude', []),
  isChrome: !!window.chrome,
  hotkey: GM_getValue('hotkey', 'shiftKey,D'),
  thread: GM_getValue('thread', 5),
  retry: GM_getValue('retry', 3),
  timeout: GM_getValue('timeout', 20),
  section: GM_getValue('section', false),
  image: GM_getValue('image', false),
  vip: GM_getValue('vip', false),
  lang: GM_getValue('lang', '0'),
  split: GM_getValue('split', '-1'),
  range: GM_getValue('range', '')
}
var Rule = {
  siteName: '通用规则',
  title: /^(.*?)(_|\-|\(| |最新|小说|无弹窗|目录|全文|全本|txt|5200章节)/i,
  writer: '#info>p:eq(0),:contains(作):contains(者):last',
  intro: '#intro>p:eq(0)',
  lastUpdate: '#info>p:eq(2)',
  chapter: '#list a',
  content: '#pagecontent,#contentbox,#bmsy_content,#bookpartinfo,#htmlContent,#text_area,#chapter_content,#chapterContent,#partbody,#BookContent,#article_content,#BookTextRead,#booktext,#BookText,#readtext,#readcon,#text_c,#txt_td,#TXT,#txt,#zjneirong,.novel_content,.readmain_inner,.noveltext,.booktext,.yd_text2,#contentTxt,#oldtext,#a_content,#contents,#content2,#contentts,#content1,#content,.content',
  elementRemove: 'script,iframe',
  chapterTitle: '.bookname>h1',
  prev: 'a[rel="prev"],a:contains("上一页"),a:contains("上一章"),a:contains("上一节"),a:contains("上页")',
  next: 'a[rel="next"],a:contains("下一页"),a:contains("下一章"),a:contains("下一节"),a:contains("下页")'
}
Rule.special = [ // 自定义站点规则
  {
    siteName: '起点中文网',
    url: /:\/\/book.qidian.com\/info\/\d+/,
    chapterUrl: /:\/\/(read|vipreader).qidian.com\/chapter/,
    title: 'h1>em', // String/RexExp
    lastUpdate: '.detail .time', // O
    cover: '.J-getJumpUrl>img', // O
    writer: '.writer', // O
    intro: '.book-intro', // O
    chapter: '.volume>.cf>li>a',
    vipChapter: '.volume>.cf>li:has(.iconfont)>a', // O
    content: '.j_readContent',
    chapterTitle: '.j_chapterName',
    lang: '0'
    // elementRemove
    // contentRemove
    // contentReplace
  }, {
    siteName: '创世中文网',
    url: /:\/\/chuangshi.qq.com\/bk\/.*?-l\.html$/,
    chapterUrl: /:\/\/chuangshi.qq.com\/bk\/.*?-r-\d+\.html$/,
    title: '.title>a>b',
    chapter: '.block_ul>li>a',
    vipChapter: '.list:has(.f900)>.block_ul>li>a',
    content: '.bookreadercontent',
    chapterTitle: 'h1[data-node="chapterTitle"]',
    lang: '0'
  }, {
    siteName: '轻小说文库',
    url: /:\/\/www.wenku8.com\/novel\/\d+\/\d+\/index.htm/,
    chapterUrl: /:\/\/www.wenku8.com\/novel\/\d+\/\d+\/\d+.htm/,
    title: '#title',
    cover: function () {
      let arr = location.href.split('/')
      return 'http://img.wkcdn.com/image/' + arr[4] + '/' + arr[5] + '/' + arr[5] + 's.jpg'
    },
    writer: '#info',
    chapter: '.ccss>a',
    content: '#content',
    chapterTitle: '#title',
    lang: '0',
    elementRemove: 'ul#contentdp',
    contentRemove: [
      '<(\/)?div(.*?)?>',
      '<(\/)?a(.*?)?>'
    ]
  }
]
var App = {
  init: function () { // 初始化
    /**
     * site: 站点规则 -1为通用规则
     * hasRule: {Number} 0-不存在规则 1-可能试用于通用规则 2-存在规则
     */
    let site = -1
    let hasRule = 0
    let _href = location.href
    let i
    for (i = 0; i < Rule.special.length; i++) {
      if ((Rule.special[i].url && Rule.special[i].url.test(_href)) || Rule.special[i].chapterUrl.test(_href)) {
        break
      }
    }
    // site: Number > Object
    if (i === Rule.special.length) { // 尝试使用通用规则
      site = Rule
      hasRule = $(site.chapter).length > 0 ? 1 : 0
    } else {
      site = Rule.special[i]
      hasRule = 2
    }
    _('rule', site)
    hasRule = hasRule === 1 ? '可能已经' : hasRule === 2 ? '已经' : '可能不'
    App.notification([document.title, location.host, CONFIG.name + hasRule + '支持该网站'])
    GM_registerMenuCommand('Show Storage', function () {
      console.log(_())
    })
    var showUI = function () {
      if ($('.ndMain').length > 0) {
        $('.ndMain,.ndPre,.ndPreVip').toggle()
      } else {
        App.showUI()
      }
    }
    GM_registerMenuCommand('Download Novel', function () {
      showUI()
    })
    $(window).on({
      keydown: function (e) {
        if ($(e.target).is('input,textarea')) return
        let keys = CONFIG.hotkey.split(',')
        for (let i = 0; i < keys.length - 1; i++) {
          if (!e[keys[i]]) return
        }
        if (e.key === keys[keys.length - 1]) showUI()
      }
    })
  },
  showUI: function () { // 显示主要界面
    App.addStyle()
    $('<div></div>').attr('id', 'nd').html(App.UI).appendTo('body')
    $('[name=ndInfo]').text(_('rule').siteName)
    $('.ndCONFIG:not(:checkbox)').val(function () {
      return CONFIG[$(this).attr('name')]
    })
    if ($('[value=' + CONFIG.split + ']', '.ndCONFIG[name=split]').length === 0) {
      $('<option value="' + CONFIG.split + '">' + CONFIG.split.match(/\d+/)[0] + (CONFIG.split.match('all') ? '次' : '章') + '</option>').appendTo('.ndCONFIG[name=split]')
      $('.ndCONFIG[name=split]').val(CONFIG.split)
    }
    $('.ndCONFIG:checkbox').each(function () {
      this.checked = CONFIG[$(this).attr('name')]
    })
    $('.ndMain').show()
    $('.ndCONFIG:not(:checkbox):not([name="hotkey"])').on({
      change: function () {
        let name = $(this).attr('name')
        let value = $(this).val()
        if (name === 'split') $('#nd>div button[name=group]')[0].value = 0
        if (name === 'split' && value === '...') {
          value = prompt('请输入[类型-数字]\n类型：\n1、all表示总体分割\n2、every表示每几章分割\n\n例：\n1、[all-3]表示整个下载列表分成3个文件\n2、[every-100]表示每100章，生成一个文件\n输入值将会保存并默认')
          if (!/^(all|every)-\d+$/.exec(value)) {
            alert('请输入正确的信息')
            return;
          }
          if ($('[value=' + value + ']', this).length === 0) $('<option value="' + value + '">' + value.match(/\d+/)[0] + (value.match('all') ? '次' : '章') + '</option>').appendTo(this)
          this.value = value
        } else if ($(this).attr('type') === 'number') {
          value = value * 1
        }
        GM_setValue(name, value)
        CONFIG[name] = value
      }
    })
    $('.ndCONFIG:checkbox').on({
      click: function (e) {
        let name = $(this).attr('name')
        let value = this.checked
        if (name === 'vip' && value === true && !confirm('警告\r\n此举很可能会订阅您未订阅的章节\r\n如非必要，不要勾选')) {
          e.preventDefault()
        } else {
          GM_setValue(name, value)
          CONFIG[name] = value
        }
      }
    })
    $('.ndCONFIG[name="hotkey"]').on({
      keydown: function (e) {
        e.preventDefault()
        let keys = []
        for (let i in e) {
          if (/Key$/.exec(i) && e[i] === true) keys.push(i)
        }
        keys.push(e.key)
        keys = keys.join()
        this.value = keys
        GM_setValue('hotkey', keys)
        CONFIG.hotkey = keys
      }
    })
    $('#nd>div button[name=hide]').on({
      click: function () {
        $(this).parents().filter('#nd>div').hide()
      }
    })
    $('#nd>div button[name=group]').on({
      click: function () {
        let split = $('.ndCONFIG[name=split]').val()
        if (!/^(all|every)-\d+$/.exec(split)) return
        let value = this.value * 1 || 0
        let range
        let step = split.match(/\d+/)[0] * 1
        let leng = $(_('rule').chapter).length
        if (/^all-\d+$/.exec(split)) step = Math.round(leng / step)
        if ((value + 1) * step > leng) {
          range = (value * step + 1) + '-' + leng
          value = 0
        } else {
          range = (value * step + 1) + '-' + (value + 1) * step
          value++
        }
        $('#nd>div input[name=range]').val(range)
        this.value = value
        CONFIG.range = range
      }
    })
    $('.ndDownload').on({
      click: function (e) {
        App.start($(e.target).attr('name'))
      }
    })
    $(_('rule').chapter).not(_('rule').vipChapter).not(':has(.ndPre)').prepend('<div class="ndPre"></div>')
    $(_('rule').vipChapter).not(':has(.ndPreVip)').prepend('<div class="ndPreVip"></div>')
    var position = function () {
      let screen = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
      jQuery('#nd>div.ndMain,#nd>div.ndRule').css({
        'left': function () {
          return ((screen.width - $(this).width()) / 2) + 'px'
        },
        'top': function () {
          return ((screen.height - $(this).height()) / 2) + 'px'
        }
      })
    };
    position()
    $(window).on({
      resize: function () {
        position()
      }
    })
  },
  UI: function () { // 界面
    let main = [
      '<div class="ndMain">',
      '<div>',
      '当前网站: <span name="ndInfo"></span>',
      '<button name="hide">×</button>',
      '</div>',
      '<div>',
      '<span>热键: <input class="ndCONFIG" type="text" name="hotkey" placeholder="shiftKey,D"></span>',
      '<br>',
      '<span>下载线程: <input class="ndCONFIG" type="number" name="thread" placeholder="5"></span>',
      '<br>',
      '<span>超时重试次数: <input class="ndCONFIG" type="number" name="retry" placeholder="3" title="0表示不重试"></span>',
      '<br>',
      '<span>超时时间: <input class="ndCONFIG" type="number" name="timeout" placeholder="20"></span>',
      '<br>',
      // '<span><input class="ndCONFIG" type="checkbox" name="section">强制分段</span>',
      '<span><input class="ndCONFIG" type="checkbox" name="image">下载图片</span>',
      '<br>',
      '<span><input class="ndCONFIG" type="checkbox" name="vip">下载Vip章节</span>',
      '<span>语言: <select class="ndCONFIG" name="lang"><option value="0"></option><option value="1">简体</option><option value="2">繁體</option></select></span>',
      '</div>',
      '<div>',
      '分次下载: <select class="ndCONFIG" name="split"><option value="-1"></option><option value="all-2">2次</option><option value="all-3">3次</option><option value="every-500">500章</option><option value="every-100">100章</option><option value="...">...</option></select>',
      '<button name="group">开始下载</button>',
      '<br>',
      '下载范围: <input class="ndCONFIG" type="text" name="range" placeholder="1开头,例1-25,35,50">',
      '</div>',
      '<div>',
      '<button class="ndDownload" name="this">下载本章(TXT)</button>',
      '<button class="ndDownload" name="text">下载目录页(TXT)</button>',
      '<br>',
      '<button class="ndDownload" name="zip">下载目录页(ZIP)</button>',
      '<button class="ndDownload" name="epub">下载目录页(Epub)</button>',
      '</div>',
      '<div>',
      '<button name="all">编辑站点规则</button>',
      '<button name="new">新建站点规则</button>',
      '</div>',
      '</div>'
    ].join('')
    let rule = [
      '<div class="ndRule">',
      '</div>'
    ].join('')
    let log = [
      '<div class="ndLog">',
      '<div class="ndProgress">',
      '<progress></progress>',
      '<span><span name="now"></span>/<span name="total"></span></span>',
      '<button name="hide">×</button>',
      '</div>',
      '<div class="ndTask"></div>',
      '<div class="ndTaskImage"></div>',
      '<button name="download">下载</button>',
      '</div>'
    ].join('')
    return main + rule + log
  },
  addStyle: function () { // Style
    let cssContent = [
      '#nd>div{z-index:999999;position:fixed;background-color:white;border:1px solid black;display:none;    text-align:center;}',
      '#nd>div>div{padding:2px}',
      '#nd>div>div *{margin:1px}',
      '#nd>div>div:nth-child(2n+1){background-color:#DADADA;}',
      '#nd>div>div:nth-child(2n){background-color:#FAFAFA;}',
      '#nd>div input:hover,#nd>div select:hover,#nd>div button:hover{box-shadow:2px 2px 2px #888888;}',
      '#nd>div input[type=number],#nd>div input[type=text]{border:1px solid #000;opacity:1;}',
      '#nd>div input[type=number]{width:36px;}',
      '#nd>div input[type=text]{width:65%;}',
      '#nd>div input[type=checkbox]{position:relative;top:0;opacity:1;}',
      '#nd>div button{border:1px solid #000;background-color:white;color:black;cursor:pointer;}',
      '#nd>div button[name=hide]{float:right;padding:3px 8px;position:relative;left:4px;top:-4px;border-left:none;border-bottom:none;}',
      '#nd>div button[name=hide]:hover{background-color:#FF0000;color:#FFF;}',
      //
      '#nd>div.ndLog{right:0px;bottom:0px;width:300px;}',
      '.ndProgress>progress{width:calc(100% - 50px);}',
      '.ndProgress>span{position:absolute;left:0;right:0;}',
      '.ndTask,.ndTaskImage{overflow-y:auto;overflow-x:hidden;text-align:left;font-size:12px;}',
      '.ndTask{max-height:300px;width:296px;white-space:nowrap;counter-reset:downloadOrder;}',
      '.ndTask>div>a{display:inline-block;overflow:hidden;text-overflow:ellipsis;width:206px;}',
      '.ndTask>div:before{content:counter(downloadOrder) "-";counter-increment:downloadOrder;float:left;}',
      '.ndTask>div:after{float:right}',
      '.ndTask>div.ndIng:after{content:"下载中";color:#0000FF;}',
      '.ndTask>div.ndOk:after{content:"完成";color:#00FF00;}',
      '.ndTask>div.ndFailed:after{content:"超时";color:#FF0000;}',
      '.ndTask>div.ndError:after{content:"失败";color:#FF0000;}',
      '.ndTaskImage{display:none;max-height:100px;counter-reset:imageOrder;}',
      '.ndTaskImage>div>progress{float:right;width:calc(100% - 60px);}',
      '.ndTaskImage>div>a:before{content:"pic " counter(imageOrder);counter-increment:imageOrder;}',
      //
      'body{counter-reset:chapterOrder;}',
      '.ndPre,.ndPreVip{float:left;display:inline;width:auto;}',
      '.ndPre:before,.ndPreVip:before{content:counter(chapterOrder) "-";counter-increment:chapterOrder;}',
      '.ndPre{color:#000;}',
      '.ndPreVip{color:#FF0000;}'
    ].join('')
    $('<style></style>').html(cssContent).appendTo('head')
  },
  notification: function (text, call) { // 桌面通知
    call = typeof call === 'function' ? call : function () {}
    let title, body
    if (text instanceof Array) {
      title = String(text[0])
      body = String(text.splice(1, text.length - 1).join('\r\n'))
    } else {
      body = String(text)
    }
    text = String(text)
    if (CONFIG.isChrome) {
      GM_notification({
        text: body,
        title: title || null,
        timeout: 5,
        onclick: function () {
          call()
        }
      })
    } else if (Notification && Notification.permission !== 'denied') {
      Notification.requestPermission(function (status) {
        if (status === 'granted') {
          let n = new Notification(title || body, title ? { body: body } : null)
          setTimeout(function () {
            if (n) n.close()
          }, 1000 * 5)
          n.onclick = function () {
            n.close()
            call()
          };
        }
      })
    }
  },
  start: function (type) { // 下载初始化
    if (type === 'this') {
      resetStorage()
      CONFIG.type = type
      _('CONFIG', $.extend(true, {}, CONFIG))
      App.saveThis()
    } else if (JSON.stringify(CONFIG) === JSON.stringify(_('CONFIG'))) {
      App.saveAs(type)
    } else { // 尽量不要在其他地方使用 _ 建立全局变量
      resetStorage()
      CONFIG.type = type
      _('CONFIG', $.extend(true, {}, CONFIG))
      _('mode', 'downloading') //downloading|pause
      /**
       * chapter {ObjectArray}
       * url,title...status,text
       */
      _('chapter', [])
      _('inWait', []) //等待进行的队列
      /**
       *  inProgress {Object}
       *  id <== abort{Function}
       */
      _('inProgress', {})
      if (type === 'epub') {
        _('cover', null)
        let src
        let rule = _('rule')
        if (typeof rule.cover === 'string') {
          src = $(rule.cover)[0].src
        } else if (typeof rule.cover === 'function') {
          src = rule.cover()
        } else {
          src = 'http://ww1.sinaimg.cn/large/69b5a2ffgy1fio5dymr8sj205r06u0so.jpg' //暂无封面待续
        }
        App.cover(src)
      }
      if (CONFIG.image && type === 'epub') {
        _('imageOrder', 0)
        _('imageData', {})
        _('imageTask', {
          inWait: [],
          inProgress: {}
        })
      }
      App.getChapters()
    }
  },
  getChapters: function () { // 获取章节
    let rule = _('rule')
    let chapter = _('chapter')
    let inWait = _('inWait')
    let order = 0
    let out = []
    let a, b
    let range = $('#nd>div input[name=range]').val().split(',')
    range.forEach(function (i) {
      if (/^\d+$/.exec(i)) {
        out.push(i * 1)
      } else {
        [a, b] = i.split('-')
        for (let j = a * 1; j <= b * 1; j++) {
          out.push(j)
        }
      }
    })

    $(rule.chapter).each(function (i) {
      if ((rule.chapterUrl === undefined || rule.chapterUrl.exec(this.href)) && (out.length === 0 || out.indexOf(i + 1) >= 0) && (CONFIG.vip || $(this).filter(rule.vipChapter).length === 0)) {
        chapter.push({
          url: this.href,
          title: this.textContent.trim()
        })
        inWait.push(order++)
      }
    })
    $('.ndLog').show()
    $('.ndProgress>progress').attr('max', chapter.length).val(0)
    $('.ndProgress [name="total"]').text(chapter.length)
    $('.ndTask,.ndTaskImage').empty()
    $('.ndLog>button[name="download"]').hide().off()
    _('chapter', chapter)
    App.task()
  },
  task: function () { // 任务列队
    let chapter = _('chapter')
    let inWait = _('inWait')
    let inProgress = _('inProgress')
    let len = Object.keys(inProgress).length
    while (len < CONFIG.thread && inWait.length > 0) {
      chapter[inWait[0]].status = 0
      inProgress[inWait[0]] = null
      len++
      if (_('rule').iframe) {
        App.iframe(inWait.shift())
      }else {
        App.xhr(inWait.shift())
      }
    }
    _('chapter', chapter)
    _('inWait', inWait)
    _('inProgress', inProgress)
    if (inWait.length > 0) {
      setTimeout(App.task, 1000)
    } else {
      App.checkOk()
    }
  },
  checkOk: function () { // 判断是否下载完毕
    let chapter = _('chapter')
    let ok = true
    for (let i = 0; i < chapter.length; i++) {
      if (typeof chapter[i].status === 'number') {
        ok = false
        break;
      }
    }
    if (ok && _('CONFIG').type === 'epub') ok = _('cover') !== null
    if (ok && CONFIG.image && _('CONFIG').type === 'epub') ok = Object.keys(_('imageTask').inProgress).length === 0 && _('imageTask').inWait.length === 0
    if (ok) {
      App.saveAs(_('CONFIG').type)
    } else {
      setTimeout(App.checkOk, 1000)
    }
  },
  saveAs: function (type) { // 保存为...
    let blob
    let rule = _('rule')
    let chapter = _('chapter')
    let leng = String(chapter.length).length //补足数字用
    let title //rule.title
    title = rule.title instanceof RegExp ? document.title.match(rule.title)[1] : $(rule.title).text()
    let href = '来源地址: ' + location.href
    let writer = '作者: ' + ('writer' in rule ? $(rule.writer)[0].textContent.trim() : '未知')
    let lastUpdate = '上次更新时间: ' + ('lastUpdate' in rule ? $(rule.lastUpdate)[0].textContent.trim() : '未知')
    let now = '小说制作时间: ' + new Date().toLocaleString()
    let intro = '小说简介: \r\n' + ('intro' in rule ? App.format($(rule.intro).html()) : '未知')
    if (type === 'text') {
      let _text
      _text = title + '\r\n'
      _text = writer + '\r\n'
      _text += CONFIG.note + '\r\n'
      _text += lastUpdate + '\r\n'
      _text += now + '\r\n'
      _text += intro + '\r\n'
      _text += '\r\n'
      chapter.forEach(function (i) {
        _text += i.title
        _text += '\r\n'
        _text += i.text
        _text += '\r\n'
        _text += '\r\n'
      })
      if (CONFIG.lang * 1 + _('rule').lang * 1 === 3) _text = tranStr(_text, CONFIG.lang === '2')
      blob = new Blob([_text], {
        type: 'text/plain;charset=utf-8'
      })
      saveAs(blob, title + '.txt')
      App.downloadBtn(blob, title + '.txt')
    } else if (type === 'zip') {
      blob = new JSZip()
      let _text
      chapter.forEach(function (i, j) {
        _text = i.title + '\r\n' + i.text
        if (CONFIG.lang * 1 + _('rule').lang * 1 === 3) _text = tranStr(_text, CONFIG.lang === '2')
        blob.file(String(preZeroFill((j + 1), leng)) + '-' + i.title + '.txt', _text)
      })
      blob.file(CONFIG.note, '')
      blob.generateAsync({
        type: 'blob'
      }).then(function (arraybuffer) {
        saveAs(arraybuffer, title + '.zip')
        App.downloadBtn(arraybuffer, title + '.zip')
      })
    } else if (type === 'epub') {
      let uuid = 'nd' + new Date().getTime().toString()
      let lang = CONFIG.lang === 0 ? 'zh' : CONFIG.lang === 1 ? 'zh-CN' : 'zh-TW'
      blob = new JSZip()
      blob.file('mimetype', 'application/epub+zip')
      blob.folder('META-INF').file('container.xml', '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles></container>')
      let OEBPS = blob.folder('OEBPS')
      let html = OEBPS.folder('html')
      let image
      if (CONFIG.image && Object.keys(_('imageData')).length > 0) image = html.folder('image')
      OEBPS.file('stylesheet.css', 'body{padding:0%;margin-top:0%;margin-bottom:0%;margin-left:1%;margin-right:1%;line-height:130%;text-align:justify}div{margin:0px;padding:0px;line-height:130%;text-align:justify}p{text-align:justify;text-indent:2em;line-height:130%}h1{line-height:130%;text-align:center;font-weight:bold;font-size:xx-large}h2{line-height:130%;text-align:center;font-weight:bold;font-size:x-large}h3{line-height:130%;text-align:center;font-weight:bold;font-size:large}h4{line-height:130%;text-align:center;font-weight:bold;font-size:normal}')
      let toc_ncx = ''
      let item = ''
      let itemref = ''
      let _title, _text, order
      for (let i = 0; i < chapter.length; i++) {
        _title = chapter[i].title
        _text = chapter[i].text
        if (CONFIG.image && chapter[i].image) {
          let imageData = _('imageData')
          let leng = String(_('imageOrder')).length
          let name
          _text = $('<div>' + _text + '</div>')
          for (let j in chapter[i].image) {
            name = String(preZeroFill(chapter[i].image[j] + 1, leng))
            //_text = _text.replace('src="'+j, 'src="image/' + name + '.jpg');
            $('img[src="' + j + '"]', _text).removeAttr('src').attr('image-src', 'image/' + name + '.jpg')
            //item += '<item id="img' + name + '" href="html/image/' + name + '.jpg" media-type="image/jpeg"/>';
            image.file(name + '.jpg', imageData[j])
          }
          _text = _text.html().replace(/image-src/g, 'src')
        }
        if (CONFIG.lang * 1 + _('rule').lang * 1 === 3) _text = tranStr(_text, CONFIG.lang === '2')
        order = String(preZeroFill(i + 1, leng))
        toc_ncx += '<navPoint id="chapter' + order + '" playOrder="' + (i + 1) + '"><navLabel><text>' + _title + '</text></navLabel><content src="html/' + order + '.html"/></navPoint>'
        item += '<item id="chapter' + order + '" href="html/' + order + '.html" media-type="application/xhtml+xml"/>'
        itemref += '<itemref idref="chapter' + order + '" linear="yes"/>'
        html.file(order + '.html', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>' + _title + '</title><link type="text/css" rel="stylesheet" media="all" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h3>' + _title + '</h3><div><p>' + _text.replace(/\r\n/g, '</p><p>') + '</p></div></body></html>')
      }
      OEBPS.file('content.opf', '<?xml version="1.0" encoding="UTF-8"?><package version="2.0" unique-identifier="' + uuid + '" xmlns="http://www.idpf.org/2007/opf"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf"><dc:title>' + title + '</dc:title><dc:identifier id="' + uuid + '">urn:uuid:' + uuid + '</dc:identifier><dc:language>' + lang + '</dc:language><dc:creator>' + CONFIG.name + '</dc:creator><dc:publisher>' + CONFIG.name + '</dc:publisher><dc:description>' + CONFIG.note + '</dc:description><dc:source>' + href + '</dc:source><dc:date>' + now + '</dc:date><dc:builder>' + CONFIG.name + '</dc:builder><meta name="cover" content="cover-image"/></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="index" href="index.html" media-type="application/xhtml+xml"/><item id="css" href="stylesheet.css" media-type="text/css"/>' + item + '<item id="cover-image" href="cover.jpg" media-type="image/jpeg"/></manifest><spine toc="ncx"><itemref idref="index" linear="yes"/>' + itemref + '</spine><guide><reference href="index.html" type="cover" title="' + title + '"/></guide></package>')
      OEBPS.file('toc.ncx', '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="urn:uuid:' + uuid + '"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>' + title + '</text></docTitle><docAuthor><text>' + CONFIG.name + '</text></docAuthor><navMap><navPoint id="index" playOrder="0"><navLabel><text>首页</text></navLabel><content src="index.html"/></navPoint>' + toc_ncx + '</navMap></ncx>')
      OEBPS.file('cover.jpg', _('cover'))
      OEBPS.file('index.html', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>' + title + '</title><link type="text/css" rel="stylesheet" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h1>' + title + '</h1><h1><img src="cover.jpg"></img></h1><h2>' + writer + '</h2><h3>' + CONFIG.note + '</h3><h4>' + lastUpdate + '</h4><h4>' + now + '</h4><p>' + intro + '</p></body></html>')
      blob.generateAsync({
        type: 'blob'
      }).then(function (arraybuffer) {
        saveAs(arraybuffer, title + '.epub')
        App.downloadBtn(arraybuffer, title + '.epub')
      })
    }
  },
  saveThis: function () { // 保存本页
    let blob
    let rule = _('rule')
    let title = $(rule.chapterTitle).text().trim()
    let _text = CONFIG.note + '\r\n' + '来源地址: ' + location.href + '\r\n' + App.format($(rule.content).html())
    if (CONFIG.lang * 1 + _('rule').lang * 1 === 3) _text = tranStr(_text, CONFIG.lang === '2')
    blob = new Blob([_text], {
      type: 'text/plain;charset=utf-8'
    })
    saveAs(blob, title + '.txt')
    App.downloadBtn(blob, title + '.txt')
  },
  downloadBtn: function (file, name) { // 下载按钮
    $('.ndLog>button[name="download"]').show().on({
      click: function () {
        saveAs(file, name)
      }
    })
  },
  xhr: function (i) { // 下载文本
    let inProgress = _('inProgress')
    let chapter = _('chapter')[i]
    $('<div class="ndIng" name="nd-' + i + '"><a href="' + chapter.url + '" target="_blank">' + chapter.title + '</a></div>').appendTo('.ndTask')
    inProgress[i] = GM_xmlhttpRequest({
      method: 'GET',
      url: chapter.url,
      timeout: CONFIG.timeout * 1000,
      onload: function (response) {
        let chapter = _('chapter')
        let inProgress = _('inProgress')
        let content = $(_('rule').content, response.responseText)
        if (CONFIG.image && _('CONFIG').type === 'epub' && $(_('rule').content, response.responseText).find('img').length > 0) {
          chapter[i].image = {}
          let imageOrder = _('imageOrder')
          $(_('rule').content, response.responseText).find('img').each(function () {
            chapter[i].image[this.src] = imageOrder++
            App.imageTask(this.src)
          })
          _('imageOrder', imageOrder)
        }
        chapter[i].text = '来源地址: ' + chapter[i].url + '\r\n' + App.format(content.html())
        chapter[i].status = 'ok'
        delete inProgress[i]
        _('chapter', chapter)
        _('inProgress', inProgress)
        let value = $('.ndProgress>progress').val() + 1
        $('.ndProgress>progress').val(value)
        $('.ndProgress [name="now"]').text(value)
        $('.ndTask>[name="nd-' + i + '"]').removeAttr('class').addClass('ndOk')
      },
      ontimeout: function () {
        let chapter = _('chapter')
        chapter[i].status++
        if (chapter[i].status >= CONFIG.retry) {
          chapter[i].status = 'timeout'
          let inProgress = _('inProgress')
          delete inProgress[i]
          _('chapter', chapter)
          _('inProgress', inProgress)
          $('.ndTask>[name="nd-' + i + '"]').removeAttr('class').addClass('ndTimeout')
        } else {
          App.xhr(i)
        }
      },
      onerror: function () { // 待续
        console.log('error')
        $('.ndTask>[name="nd-' + i + '"]').removeAttr('class').addClass('ndError')
        App.abortAll()
      }
    }).abort
    _('inProgress', inProgress)
  },
  abortAll: function () { // 取消下载
    let inProgress = _('inProgress')
    for (let i in inProgress) {
      if (typeof inProgress[i] === 'function') inProgress[i].abort()
    }
  },
  format: function (text) { // 文本格式化
    if ('elementRemove' in _('rule')) {
      let html = $('<div>' + text + '</div>')
      $(_('rule').elementRemove, html).remove()
      text = html.html()
    }
    if (_('CONFIG').type === 'epub') {
      text = text.trim()
    } else {
      let replace = {
        '&nbsp;': ' ',
        '<(\/)?p>': '\r\n',
        '<(\/)?br>': '\r\n',
        '<(\/)?img(.*?)?>': '',
        '手机用户请浏览阅读，更优质的阅读体验。': '',
        '[\\r\\n]+\\s+': '\r\n    '
      }
      for (let i in replace) {
        text = text.replace(new RegExp(i, 'gi'), replace[i])
      }
      if ('contentRemove' in _('rule')) {
        _('rule').contentRemove.forEach(function (i) {
          text = text.replace(new RegExp(i, 'gi'), '')
        })
      }
      if ('contentReplace' in _('rule')) {
        for (let i in _('rule').contentReplace) {
          text = text.replace(new RegExp(i, 'gi'), _('rule').contentReplace[i])
        }
      }
      text = '    ' + text.trim()
    }
    return text
  },
  imageTask: function (url) { // 图片任务列队
    let imageTask = _('imageTask')
    if (url !== undefined) imageTask.inWait.push(url)
    let len = Object.keys(imageTask.inProgress).length
    while (len < 5 && imageTask.inWait.length > 0) {
      imageTask.inProgress[imageTask.inWait[0]] = 0
      len++
      App.imageXhr(imageTask.inWait.shift())
    }
    _('imageTask', imageTask)
    if (imageTask.inWait.length > 0) setTimeout(App.imageTask, 1000)
  },
  imageXhr: function (url) { // 下载图片
    $('.ndTaskImage').show().append('<div name="' + url + '"><a href="' + url + '" target="_blank"></a><progress max="1" value="0"></progress></div>')
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      onload: function (e) {
        let imageTask = _('imageTask')
        let imageData = _('imageData')
        delete imageTask.inProgress[url]
        imageData[url] = e.response
        _('imageTask', imageTask)
        _('imageData', imageData)
      },
      onprogress: function (e) {
        $('.ndTaskImage>[name="' + url + '"]>progress').val(e.loaded).attr('max', e.total)
      }
    })
  },
  cover: function (url) { // 下载封面
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer',
      onload: function (e) {
        _('cover', e.response)
      }
    })
  }
}
App.init()



function _ (item, key) { // 全局变量
  let nd = window.nd || {}
  if (item === undefined && key === undefined) {
    return nd
  } else if (key === undefined) {
    return nd[item]
  } else {
    nd[item] = key
    window.nd = nd
  }
}

function resetStorage () { // 重置全局变量
  for (let i in _()) {
    if (i === 'rule') {
      //
    } else {
      delete _()[i]
    }
  }
}

function preZeroFill (num, size) { // 用0补足指定位数，来自https://segmentfault.com/q/1010000002607221，作者：captainblue与solar
  if (num >= Math.pow(10, size)) { // 如果num本身位数不小于size位
    return num.toString()
  } else {
    let _str = Array(size + 1).join('0') + num
    return _str.slice(_str.length - size)
  }
}
