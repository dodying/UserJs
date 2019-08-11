// ==UserScript==
// @name        mark
// @description mark
// @include     *
// @version     1.0.498
// @modified    2019-8-8 09:03:30
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js
// ==/UserScript==
/* eslint-disable no-debugger  */
(function () {
  'use strict'

  let selectCalc = (any, position) => {
    any = [].concat(any)
    let out = []
    for (let i = 0; i < any.length; i++) {
      let anyI = any[i]
      if (typeof anyI === 'string') {
        out[i] = position['string'](anyI)
      } else if (typeof anyI === 'number') {
        out[i] = position['number'](anyI)
      } else if (typeof anyI === 'function') {
        out[i] = position['function'](anyI)
      } else if (typeof anyI === 'boolean') {
        out[i] = position['boolean'](anyI)
      } else if (anyI instanceof RegExp) {
        out[i] = position['RegExp'](anyI)
      } else {
        out[i] = position['default'](anyI)
      }
    }
    return out
  }

  let libs = {
    novel: [{
      /**
       * filter <= Array
       * string / RegExp 检测链接
       * Function 无参，返回true
       *
       * 特定网站生效
       */
      filter: 'my.qidian.com/bookcase',

      /**
       * elems <= Array
       * string 选择器
       * Function 无参，返回元素
       *
       * 元素
       */

      /**
        * dealWithElems
        * Function 参数(elemNow, elemBefore)，返回elemNew[]
        */

      elems: ['.shelf-table-name [data-bid]']
    }, {
      filter: 'qidian.com',
      elems: '.book-mid-info>h4>a,.book-info>h4>a'
    }],
    manga: [{
      filter: /i.dmzj.com\/(record|subscribe)/,
      elems: [
        '.dy_content_li h3>a',
        '.history_des>h3>a'
      ]
    }, {
      filter: 'manhua.dmzj.com/rank',
      elems: [
        '.middlerighter1 .title>a',
        '.support+[class^="guide"]+a'
      ]
    }, {
      filter: () => window.location.pathname === '/' && window.location.host === 'manhua.dmzj.com',
      elems: [
        '.icn-02_index>a:nth-child(2)',
        '.tt_comic',
        '[class^="tcaricature_see"][class*="a2"] ul>li:nth-child(1)>a', '[class^="tcaricature_see"][class*="a3"] ul>li>a',
        '[class^="today_recommended_bigpic2_a2"] ul>li:nth-child(1)>a', '[class^="today_recommended_bigpic2_b"] ul>li>a',
        '.caricature_nav p>a'
      ]
    }, {
      filter: 'manhua.dmzj.com',
      elems: [
        '.tcaricature_block>ul>li>a',
        '.hotblood1 ul>li>a+a',
        '.linehidden',
        '.anim_title_text>a>h1'
      ],
      dealWithElems: (elemNow, elemBefore) => {
        [].concat(elemNow, elemBefore).forEach(i => {
          if (i.textContent.match(/^\+/) && !$(i).is('.mark-deal-ignore')) {
            $(i).addClass('mark-deal-ignore')
            $(i).contents().toArray().filter(j => j.nodeType === 3)[0].textContent = i.textContent.replace(/^\+/, '')
            // i.innerHTML = i.innerHTML.replace(/^\+/, '')
          }
        })
        return elemNow
      }
    }]
  }

  let libName, lib
  for (let i in libs) {
    libName = i
    lib = libs[i]
    let found = lib.some(i => {
      let filtered = selectCalc(i.filter, {
        string: text => window.location.href.match(text),
        RegExp: regexp => window.location.href.match(regexp),
        function: func => func()
      })
      return filtered.some(i => i)
    })
    if (found) break
    if (i === Object.keys(libs).slice(-1)[0]) return
  }
  console.log({ libName, lib })

  let getValue = () => JSON.parse(GM_getValue(`dababase_${libName}`) || '{}')
  let setValue = (value) => value || window.confirm(`value false\ncontinue?`) ? GM_setValue(`dababase_${libName}`, JSON.stringify(value)) : null

  $('<style></style>').html([
    '.mark-panel{z-index:99999;position:fixed;top:0;left:0;}',
    '.mark-switch{background:#0F0;}',
    '.mark-switch::after{content:"on";}',
    '.mark-switch.mark-switch-disabled{background:#F00;}',
    '.mark-switch.mark-switch-disabled::after{content:"off";}',
    '.mark-mark{background:#F00;}',
    '.mark-mark.mark-mark-on{background:#0F0;}',
    '[data-mark]:hover{background-color:white!important;}',
    '[data-mark]{border:1px black solid;}'
  ].join('\n')).appendTo('head')

  /**
   * database:
   *
   * - book:
   * -- name -> type
   * - match:
   * -- match -> type
   * - color:
   * -- type -> color
   */

  let ask = (q, a) => {
    let database = getValue()
    let answer = window.prompt(q, a || database.answer || '')
    if (answer) {
      database.answer = answer
      setValue(database)
    }
    return answer
  }
  let elems
  let updateElems = () => {
    let temp = []
    for (let i of lib) {
      let actived = selectCalc(i.filter, {
        string: text => window.location.href.match(text),
        RegExp: regexp => window.location.href.match(regexp),
        function: func => func()
      })
      if (!actived.some(i => i)) continue

      let elem = selectCalc(i.elems, {
        string: text => $(text).toArray(),
        function: func => func()
      }).reduce((pre, cur) => [].concat(cur, pre))

      if (typeof i.dealWithElems === 'function') elem = i.dealWithElems(elem, temp)
      temp = temp.concat(elem)
    }
    elems = temp
  }
  let updateHighlight = () => {
    let database = getValue()
    let books = database['book'] || {}
    let matches = database['match'] || {}

    updateElems()
    elems.forEach(i => {
      let name = i.textContent.trim()
      if (name in books) {
        $(i).attr('data-mark', books[name])
      } else if (Object.keys(matches).some(i => name.match(i))) {
        let filtered = Object.keys(matches).filter(i => name.match(i))[0]
        $(i).attr('data-mark', matches[filtered])
      } else {
        $(i).attr('data-mark', 'null')
      }
    })

    let colors = database['color'] || {}
    let style = Object.keys(colors).map(i => `[data-mark="${i}"]{background-color:${colors[i]}!important;}`)
    let styleEle = $('style.mark-style').length ? $('style.mark-style') : $('<style class="mark-style"></style>')
    styleEle.html(style).appendTo('head')
  }
  let promptSetting = keyName => {
    let database = getValue()
    let obj = database[keyName] || {}
    let answer = ask(`已存在:\n- - -\n${Object.keys(obj).map(i => `${i}:${obj[i]}`).join('\n')}\n- - -\n请使用:分割，值为null表示删除`)
    if (!answer) return
    let arr = answer.split(/:|：/)
    if (arr.length === 2) {
      if (arr[0] === 'null') return
      if (arr[1] === 'null') {
        delete obj[arr[0]]
      } else {
        obj[arr[0]] = arr[1]
      }
      database[keyName] = obj
      setValue(database)
      updateHighlight()
    }
  }
  let markBatch = elems => {
    let database = getValue()
    let colors = database['color'] || {}
    let type = ask(`要标记的状态,值为null表示删除:\n- - -\n${Object.keys(colors).map(i => `${i}:${colors[i]}`).join('\n')}\n- - -`)
    if (!type) return
    let obj = database['book'] || {}

    updateElems()
    elems.forEach(i => {
      let name = i.textContent.trim()

      if (type === 'null') {
        delete obj[name]
      } else {
        obj[name] = type
      }
    })

    database['book'] = obj
    setValue(database)
    updateHighlight()
  }
  updateHighlight()

  var observer = new window.MutationObserver((mutationsList) => {
    if (mutationsList.some(i => i.addedNodes && [].concat(...i.addedNodes).some(j => j.nodeType === 1))) updateHighlight()
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })

  $('<div class="mark-panel"></div>').appendTo('body')
  $('<button class="mark-close">x</button>').on({
    click: () => $('.mark-panel').hide()
  }).appendTo('.mark-panel')
  $('<button class="mark-switch"></button>').on({
    click: (e) => {
      $(e.target).toggleClass('mark-switch-disabled')
      if ($(e.target).is('.mark-switch-disabled')) {
        $('style.mark-style').remove()
      } else {
        updateHighlight()
      }
    }
  }).appendTo('.mark-panel')
  $('<button class="mark-color">color</button>').on({
    click: () => promptSetting('color')
  }).appendTo('.mark-panel')
  $('<button class="mark-match">match</button>').on({
    click: () => promptSetting('match')
  }).appendTo('.mark-panel')
  $('<button class="mark-mark">mark</button>').on({
    click: (e) => {
      let type
      let func = (e) => {
        e.preventDefault()

        let database = getValue()
        let obj = database['book'] || {}
        let name = e.target.textContent.trim()

        if (type === 'null') {
          delete obj[name]
        } else {
          obj[name] = type
        }

        database['book'] = obj
        setValue(database)
        updateHighlight()
      }

      $(e.target).toggleClass('mark-mark-on')
      if ($(e.target).is('.mark-mark-on')) {
        let database = getValue()
        let colors = database['color'] || {}
        type = ask(`要标记的状态,值为null表示删除:\n- - -\n${Object.keys(colors).map(i => `${i}:${colors[i]}`).join('\n')}\n- - -`)
        if (!type) {
          $(e.target).toggleClass('mark-mark-on')
          return
        }
        $('body').on('click', '[data-mark]', func)
      } else {
        $('body').off('click', '[data-mark]')
      }
    }
  }).appendTo('.mark-panel')
  $('<button class="mark-mark-all">mark-all</button>').on({
    click: () => markBatch($('[data-mark]').toArray())
  }).appendTo('.mark-panel')
  $('<button class="mark-mark-null">mark-null</button>').on({
    click: () => markBatch($('[data-mark="null"]').toArray())
  }).appendTo('.mark-panel')
})()
