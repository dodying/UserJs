// ==UserScript==
// @name        []mark
// @description mark
// @include     *
// @version     1.1.0
// @modified    2020/5/24 19:11:19
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// ==/UserScript==
/* eslint-disable no-debugger  */
(function () {
  'use strict';

  const selectCalc = (any, position) => {
    any = [].concat(any);
    const out = [];
    for (let i = 0; i < any.length; i++) {
      const anyI = any[i];
      if (typeof anyI === 'string') {
        out[i] = position.string(anyI);
      } else if (typeof anyI === 'number') {
        out[i] = position.number(anyI);
      } else if (typeof anyI === 'function') {
        out[i] = position.function(anyI);
      } else if (typeof anyI === 'boolean') {
        out[i] = position.boolean(anyI);
      } else if (anyI instanceof RegExp) {
        out[i] = position.RegExp(anyI);
      } else {
        out[i] = position.default(anyI);
      }
    }
    return out;
  };

  const libs = {
    novel: [
      // 示例
      {
        /**
         * filterUrl <= Array
         * string / RegExp 检测链接
         * Function 无参，返回true
         *
         * 特定网站生效
         */
        filterUrl: 'my.qidian.com/bookcase',

        /**
         * ?excludeUrl
         * 类型同filterUrl，匹配时不生效
         */

        /**
         * elems <= Array
         * string 选择器
         * Function 无参，返回元素
         *
         * 元素
         */
        elems: ['.shelf-table-name [data-bid]'],

        /**
         * ?dealWithElems
         * Function 参数(elemNow, elemBefore)，返回elemNew[]
         * 尽量使用elementDo
         */

        /**
         * ?elementDo
         * Array of function(elem)
         */

        /**
          * ?textReplace
          * Array of [match, replace]
          * 替换元素下的首个textNode
          * like elementDo: [ function (elem){elem.textContent=elem.textContent.replace(match, replace)} ]
          */

        /**
          * ?search
          * string '名称|网址' 包含%s
          */
        search: '书架搜索|https://my.qidian.com/bookcase/search?kw=%s'

        /**
         * ?do 仅在匹配页面生效
         * ?doEvery 即使不匹配，只要是这个lib都生效
         * Function
         */
      }
    ],
    manga: [
      {
        filterUrl: /i.dmzj.com\/(record|subscribe)/,
        elems: [
          '.dy_content_li h3>a',
          '.history_des>h3>a'
        ]
      }
    ]
  };

  let libName, lib;
  for (const i in libs) {
    libName = i;
    lib = libs[i];
    const found = lib.some(i => {
      const filtered = selectCalc(i.filterUrl, {
        string: text => window.location.href.match(text),
        RegExp: regexp => window.location.href.match(regexp),
        function: func => func()
      }).some(i => i);
      const excluded = i.excludeUrl ? selectCalc(i.excludeUrl, {
        string: text => window.location.href.match(text),
        RegExp: regexp => window.location.href.match(regexp),
        function: func => func()
      }).some(i => i) : false;
      return filtered && !excluded;
    });
    if (found) break;
    if (i === Object.keys(libs).slice(-1)[0]) return;
  }
  console.log({ libName, lib });

  const getValue = () => JSON.parse(GM_getValue(`database_${libName}`) || '{}');
  const setValue = (value) => value || window.confirm('value false\ncontinue?') ? GM_setValue(`database_${libName}`, JSON.stringify(value)) : null;

  $('<style></style>').html([
    '.mark-panel{z-index:99999;position:fixed;top:0;left:0;}',
    '.mark-switch{background:#0F0;}',
    '.mark-switch::after{content:"on";}',
    '.mark-switch.mark-switch-disabled{background:#F00;}',
    '.mark-switch.mark-switch-disabled::after{content:"off";}',
    '.mark-mark{background:#F00;}',
    '.mark-mark.mark-mark-on{background:#0F0;}',
    '[data-mark]:hover{background-color:unset!important;}',
    '[data-mark]{border:1px black solid;margin: -1px;}',

    '.mark-info::after{content:"-"attr(length)"-"attr(null)}',

    '.mark-less.mark-less-on::after{content:">>";}',
    '.mark-less::after{content:"<<";}',
    //
    '.mark-show-container,.mark-edit-container{position:fixed;left:0;right:0;top:0;bottom:0;margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;}',
    '.mark-show-container,.mark-edit-container{z-index:99999;background:white;max-width:800px;max-height:600px;overflow:scroll;}',
    '.mark-show-nav,.mark-show-nav-select{display:inline}',
    '.mark-show-nav-select:before{content:attr(name)}',
    '.mark-show-nav-select{margin:2px;border:solid 1px black}',
    '.mark-show-nav-selected{color:red}',
    '.mark-show-pre{white-space:pre-wrap;word-break:break-word;font-family:Consolas,Monaco,monospace;}',
    '.mark-show-pre::before{content:"《"}',
    '.mark-show-pre::after{content:"》"}',
    '.mark-show-search{margin:0 10px;color:#00f;}',
    //
    '.mark-edit-textarea{width:99%;height:calc(99% - 16px);}'
  ].join('\n')).appendTo('head');

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

  const searchLib = [];
  let firstRun = true;
  const ask = (q, a) => {
    const database = getValue();
    const answer = window.prompt(q, a || database.answer || '');
    if (answer) {
      database.answer = answer;
      setValue(database);
    }
    return answer;
  };
  let elems;
  const updateElems = () => {
    let temp = [];
    for (const i of lib) {
      if (firstRun) {
        if (typeof i.doEvery === 'function') i.doEvery();
      }
      const filtered = selectCalc(i.filterUrl, {
        string: text => window.location.href.match(text),
        RegExp: regexp => window.location.href.match(regexp),
        function: func => func()
      }).some(i => i);
      const excluded = i.excludeUrl ? selectCalc(i.excludeUrl, {
        string: text => window.location.href.match(text),
        RegExp: regexp => window.location.href.match(regexp),
        function: func => func()
      }).some(i => i) : false;
      if (!filtered || excluded) continue;
      if (firstRun) {
        searchLib.push(i);
        if (typeof i.do === 'function') i.do();
      }

      let elem = selectCalc(i.elems, {
        string: text => $(text).toArray(),
        function: func => func()
      }).reduce((pre, cur) => [].concat(cur, pre));

      elem = $(elem).filter(':visible').toArray().filter(i => i.textContent.trim());

      if (typeof i.dealWithElems === 'function') elem = i.dealWithElems(elem, temp);
      if (i.elementDo instanceof Array && i.elementDo.every(i => typeof i === 'function')) {
        const elems = $([].concat(elem, temp)).filter(':not([mark-do="true"])');
        for (const elem of elems) {
          for (const func of i.elementDo) {
            func(elem);
          }
          $(elem).attr('mark-do', 'true');
        }
      }
      if (i.textReplace instanceof Array) {
        const elems = $([].concat(elem, temp)).filter(':not([mark-replace="true"])');
        for (const elem of elems) {
          const node = $(elem).find(':not(iframe)').addBack().contents().toArray().find(j => j.nodeType === 3);
          let text = node.textContent.trim();
          for (const reGroup of i.textReplace) {
            text = text.replace(reGroup[0], reGroup[1] || '');
          }
          node.textContent = text.trim();
          $(elem).attr('mark-replace', 'true');
        }
      }
      temp = temp.concat(elem);
    }
    firstRun = false;
    elems = temp;
  };
  const updateHighlight = () => {
    const database = getValue();
    const books = database.book || {};
    const matches = database.match || {};

    updateElems();
    elems.forEach(i => {
      const name = i.textContent.trim();
      if (name in books) {
        $(i).attr('data-mark', books[name]);
      } else if (Object.keys(matches).some(i => name.match(i))) {
        const filtered = Object.keys(matches).filter(i => name.match(i))[0];
        $(i).attr('data-mark', matches[filtered]);
      } else {
        $(i).attr('data-mark', 'null');
      }
    });

    const colors = database.color || {};
    const style = Object.keys(colors).map(i => `[data-mark="${i}"]{background-color:${colors[i]}!important;}`);
    const styleEle = $('style.mark-style').length ? $('style.mark-style') : $('<style class="mark-style"></style>');
    styleEle.html(style).appendTo('head');

    $('.mark-info').attr('length', $('[data-mark]').length).attr('null', $('[data-mark="null"]').length);
  };
  const promptSetting = keyName => {
    const database = getValue();
    const obj = database[keyName] || {};
    const answer = ask(`已存在:\n- - -\n${Object.keys(obj).map(i => `${i}:  ${obj[i]}`).join('\n')}\n- - -\n请使用:分割，值为null表示删除`);
    if (!answer) return;
    const arr = answer.split(/:|：/);
    if (arr.length > 1) {
      if (arr[0] === 'null') return;
      if (arr[1] === 'null') {
        delete obj[arr[0]];
      } else {
        obj[arr[0]] = arr.slice(1).join(':');
      }
      database[keyName] = obj;
      setValue(database);
      updateHighlight();
    }
  };
  const markBatch = elems => {
    const database = getValue();
    const colors = database.color || {};
    const type = ask(`要标记的状态,值为null表示删除:\n- - -\n${Object.keys(colors).map(i => `${i}:${colors[i]}`).join('\n')}\n- - -`);
    if (!type) return;
    const obj = database.book || {};

    updateElems();
    elems.forEach(i => {
      const name = i.textContent.trim();

      if (type === 'null') {
        delete obj[name];
      } else {
        obj[name] = type;
      }
    });

    database.book = obj;
    setValue(database);
    updateHighlight();
  };
  function markDirect (name, type) {
    const database = getValue();
    const obj = database.book || {};
    if (type === 'null') {
      delete obj[name];
    } else {
      obj[name] = type;
    }
    database.book = obj;
    setValue(database);
    updateHighlight();
  }
  updateHighlight();

  var observer = new window.MutationObserver((mutationsList) => {
    if (mutationsList.some(i => i.addedNodes && [].concat(...i.addedNodes).some(j => j.nodeType === 1))) updateHighlight();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  $('<div class="mark-panel"></div>').appendTo('body');
  $('<button class="mark-close">x</button>').on({
    click: () => $('.mark-panel').hide()
  }).appendTo('.mark-panel');
  $('<button class="mark-info" disabled>').text(libName).appendTo('.mark-panel');
  $('<button class="mark-switch"></button>').on({
    click: (e) => {
      $(e.target).toggleClass('mark-switch-disabled');
      if ($(e.target).is('.mark-switch-disabled')) {
        $('style.mark-style').remove();
      } else {
        updateHighlight();
      }
    },
    contextmenu: (e) => {
      updateHighlight();
      return false;
    }
  }).appendTo('.mark-panel');
  $('<button class="mark-color mark-less-hide">color</button>').on({
    click: () => promptSetting('color')
  }).appendTo('.mark-panel');
  $('<button class="mark-match mark-less-hide">match</button>').on({
    click: () => promptSetting('match')
  }).appendTo('.mark-panel');
  $('<button class="mark-mark">mark</button>').on({
    click: (e) => {
      let type;
      const markEvent = (e) => {
        e.preventDefault();

        const database = getValue();
        const obj = database.book || {};
        const name = e.target.textContent.trim();

        if (type === 'null') {
          delete obj[name];
        } else {
          obj[name] = type;
        }

        database.book = obj;
        setValue(database);
        updateHighlight();
      };

      $(e.target).toggleClass('mark-mark-on');
      if ($(e.target).is('.mark-mark-on')) {
        const database = getValue();
        const colors = database.color || {};
        type = ask(`要标记的状态,值为null表示删除:\n- - -\n${Object.keys(colors).map(i => `${i}:${colors[i]}`).join('\n')}\n- - -`);
        if (!type) {
          $(e.target).toggleClass('mark-mark-on');
          return;
        }
        $('body').on('click', '[data-mark]', markEvent);
      } else {
        $('body').off('click', '[data-mark]');
      }
    }
  }).appendTo('.mark-panel');
  $('<button class="mark-one">mark-one</button>').on({
    click: (e) => {
      let type;
      const markOneEvent = (e) => {
        e.preventDefault();

        const database = getValue();
        const obj = database.book || {};
        const name = e.target.textContent.trim();

        if (type === 'null') {
          delete obj[name];
        } else {
          obj[name] = type;
        }
        type = null;

        database.book = obj;
        setValue(database);
        updateHighlight();
        $('body').off('click', '[data-mark]', markOneEvent);
      };

      const database = getValue();
      type = database.answer;
      $('body').on('click', '[data-mark]', markOneEvent);
    }
  }).appendTo('.mark-panel');
  $('<button class="mark-mark-all mark-less-hide">mark-all</button>').on({
    click: () => markBatch($('[data-mark]').toArray())
  }).appendTo('.mark-panel');
  $('<button class="mark-mark-null mark-less-hide">mark-null</button>').on({
    click: () => markBatch($('[data-mark="null"]').toArray())
  }).appendTo('.mark-panel');
  $('<button class="mark-show mark-less-hide">show</button>').on({
    click: () => {
      if ($('.mark-show-container').length) {
        $('.mark-show-container').remove();
        return;
      }

      const database = getValue();
      const books = database.book || {};
      const types = Object.values(books).sort().filter((item, index, array) => array.indexOf(item) === index);

      const elem = $('<div class="mark-show-container"><ul class="mark-show-nav"></ul><div class="mark-show-content"></div></div>');
      for (const type of types) {
        $('<li class="mark-show-nav-select"></li>').attr('name', type).appendTo($(elem).find('.mark-show-nav'));
        let html = '<ol>';
        const names = Object.keys(books).filter(i => books[i] === type);
        for (const name of names) {
          html += '<li>';
          html += `<span class="mark-show-pre">${name}</span>`;
          html += Array.from(new Set(searchLib.concat(lib))).map(lib => {
            if (!lib.search) return;
            const [info, url] = lib.search.split('|');
            return `<a class="mark-show-search" href="${url.replace('%s', encodeURIComponent(name))}">${info}</a>`;
          }).join('');
          html += '</li>';
        }
        html += '</ol>';
        $(html).attr('name', type).appendTo($(elem).find('.mark-show-content'));
      }
      elem.appendTo('body');
      $('.mark-show-nav-select').on({
        click: e => {
          $('.mark-show-nav-select').removeClass('mark-show-nav-selected');
          $(e.target).addClass('mark-show-nav-selected');
          $('.mark-show-content>ol').hide();
          $('.mark-show-content>ol').filter((order, i) => $(i).attr('name') === $(e.target).attr('name')).show();
        }
      });
      $('.mark-show-nav-select:eq(0)').addClass('mark-show-nav-selected');
      $('.mark-show-content>ol').hide();
      $('.mark-show-content>ol:eq(0)').show();
    }
  }).appendTo('.mark-panel');
  $('<button class="mark-edit mark-less-hide">edit</button>').on({
    click: () => {
      if ($('.mark-edit-container').length) {
        $('.mark-edit-container').remove();
        return;
      }

      const database = getValue();

      $('<div class="mark-edit-container"><textarea class="mark-edit-textarea"></textarea></div>').appendTo('body');
      $('<button class="mark-edit-save">Save</button>').on({
        click: () => {
          try {
            const obj = JSON.parse($('.mark-edit-textarea').val());
            setValue(obj);
          } catch (error) {
            console.log(error);
            window.alert('Save Failed');
          }
        }
      }).appendTo('.mark-edit-container');
      $('.mark-edit-textarea').text(JSON.stringify(database, null, 2));
    }
  }).appendTo('.mark-panel');

  // 最后
  $('<button class="mark-less"></button>').on({
    click: (e) => {
      $(e.target).toggleClass('mark-less-on');
      $('.mark-less-hide').toggle();
    }
  }).appendTo('.mark-panel');
  $('.mark-less').click();

  $(window).on('focus', (e) => {
    updateHighlight();
  });
})();
