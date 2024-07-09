/* eslint-env browser */
// ==UserScript==
// @name        []mark
// @description mark
// @include     *
// @version     1.2.2
// @modified    2022-03-26 20:15:52
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// ==/UserScript==
/* global GM_setValue GM_getValue GM_openInTab */
/* global $ */
/* eslint-disable no-debugger  */
(function () {
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

  /* eslint-disable comma-dangle  */
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
         * ?elementDo
         * Array of function(elem)
         */

        /**
          * ?textReplace, textReplaceEvery
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
  /* eslint-enable comma-dangle  */

  let libName; let
    lib;
  for (const i in libs) {
    libName = i;
    lib = libs[i];
    const found = lib.some((i) => {
      const filtered = selectCalc(i.filterUrl, {
        string: (text) => window.location.href.match(text),
        RegExp: (regexp) => window.location.href.match(regexp),
        function: (func) => func(),
      }).some((i) => i);
      const excluded = i.excludeUrl ? selectCalc(i.excludeUrl, {
        string: (text) => window.location.href.match(text),
        RegExp: (regexp) => window.location.href.match(regexp),
        function: (func) => func(),
      }).some((i) => i) : false;
      return filtered && !excluded;
    });
    if (found) break;
    if (i === Object.keys(libs).slice(-1)[0]) return;
  }
  console.log({ libName, lib });

  const getValue = () => JSON.parse(GM_getValue(`database_${libName}`) || '{}');
  const setValue = (value) => (value || window.confirm('value false\ncontinue?') ? GM_setValue(`database_${libName}`, JSON.stringify(value)) : null);

  $('<style></style>').html([
    'mark-panel,mark-search-bar{all:initial;}',

    '[data-mark]:hover{background-color:unset!important;}',
    '[data-mark]{border:1px black solid;margin:-1px;}',
    //
    '.mark-show-container,.mark-edit-container{position:fixed;left:0;right:0;top:0;bottom:0;margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;}',
    '.mark-show-container,.mark-edit-container{z-index:99999;background:white;max-width:60vw;max-height:60vh;overflow:scroll;}',
    '.mark-show-nav,.mark-show-nav-select{display:inline}',
    '.mark-show-nav-select:before{content:attr(name)}',
    '.mark-show-nav-select{margin:2px;border:solid 1px black}',
    '.mark-show-nav-selected{color:red}',
    '.mark-show-pre{white-space:pre-wrap;word-break:break-word;font-family:Consolas,Monaco,monospace;}',
    '.mark-show-pre::before{content:"《"}',
    '.mark-show-pre::after{content:"》"}',
    '.mark-show-search{margin:0 10px;color:#00f;}',
    //
    '.mark-edit-textarea{width:99%;height:calc(99% - 16px);}',
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

  let panelRoot;
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
        string: (text) => window.location.href.match(text),
        RegExp: (regexp) => window.location.href.match(regexp),
        function: (func) => func(),
      }).some((i) => i);
      const excluded = i.excludeUrl ? selectCalc(i.excludeUrl, {
        string: (text) => window.location.href.match(text),
        RegExp: (regexp) => window.location.href.match(regexp),
        function: (func) => func(),
      }).some((i) => i) : false;
      if (!filtered || excluded) continue;
      if (firstRun) {
        searchLib.push(i);
        if (typeof i.do === 'function') i.do();
      }

      let elem = selectCalc(i.elems, {
        string: (text) => $(text).toArray(),
        function: (func) => func(),
      }).reduce((pre, cur) => [].concat(cur, pre));

      elem = $(elem).add('[data-mark]').filter(':visible').toArray()
        .filter((i) => i.textContent.trim());

      if (i.elementDo instanceof Array && i.elementDo.every((i) => typeof i === 'function')) {
        const elems = $([].concat(elem, temp)).filter(':not([mark-do="true"])');
        for (const elem of elems) {
          for (const func of i.elementDo) {
            func(elem);
          }
          $(elem).attr('mark-do', 'true');
        }
      }
      if (i.textReplace instanceof Array || lib.find((i) => i.textReplaceEvery instanceof Array)) {
        const elems = $([].concat(elem, temp)).filter(':not([mark-replace="true"])');
        for (const elem of elems) {
          const node = $(elem).find(':not(iframe)').addBack().contents()
            .toArray()
            .find((j) => j.nodeType === 3);
          let text = node.textContent.trim();

          const dict = [].concat(i.textReplace || [], ...lib.filter((i) => i.textReplaceEvery instanceof Array).map((i) => i.textReplaceEvery));
          let replace = dict.find((i) => text.match(i[0]));
          let replaceLast = null;
          let textLast = null;
          while (replace) {
            if (replace === replaceLast && textLast === text) {
              console.error(`mark: 替换文本陷入死循环\n替换规则: ${replace}`);
              dict.splice(dict.indexOf(replace), 1);
            }
            textLast = text;
            text = text.replace(replace[0], replace[1] || '').trim();
            replaceLast = replace;
            replace = dict.find((i) => text.match(i[0]));
          }

          node.textContent = text.trim();
          $(elem).attr('mark-replace', 'true');
        }
      }
      temp = temp.concat(elem);
    }
    if (firstRun) {
      let mouseDown = false;
      $(document).on('mousemove', '[data-mark]', () => {
        if (!mouseDown && document.defaultView.getSelection().toString().trim()) {
          $('mark-search-bar').show();
        }
      });
      $(document).on('mousedown', (e) => {
        mouseDown = true;
      });
      $(document).on('mouseup', (e) => {
        mouseDown = false;
        if ($(e.target).is('mark-search-bar')) {
          setTimeout(() => {
            $('mark-search-bar').hide();
          }, 400);
          return;
        }
        if (e.which !== 1 || !$(e.target).is('[data-mark],[data-mark] *,:has([data-mark])')) return $('mark-search-bar').hide();
        const text = document.defaultView.getSelection().toString().trim();
        if (text === '') return $('mark-search-bar').hide();
        if ($('mark-search-bar').length === 0) $('<mark-search-bar>').insertAfter('body');
        const _width = $('mark-search-bar').outerWidth();
        const _height = $('mark-search-bar').outerHeight();
        let left = _width + e.clientX + 10 < window.innerWidth ? e.clientX + 5 : e.clientX - _width - 5;
        let top = _height + e.clientY + 10 < window.innerHeight ? e.clientY + 5 : e.clientY - _height - 5;
        if (left < 0) left = 0;
        if (top < 0) top = 0;
        $('mark-search-bar').attr('css', JSON.stringify({
          left,
          top,
        })).show();
      });
    }
    firstRun = false;
    elems = temp;
  };
  const updateHighlight = () => {
    const database = getValue();
    const books = database.book || {};
    const matches = database.match || {};

    updateElems();
    elems.forEach((i) => {
      const name = i.textContent.trim();
      if (name in books) {
        $(i).attr('data-mark', String(books[name]));
      } else if (Object.keys(matches).some((i) => name.match(i))) {
        const filtered = Object.keys(matches).filter((i) => name.match(i))[0];
        $(i).attr('data-mark', matches[filtered]);
      } else {
        $(i).attr('data-mark', 'null');
      }
    });

    const colors = database.color || {};
    const style = Object.keys(colors).map((i) => `[data-mark="${i}"]{background-color:${colors[i]}!important;}`);
    const styleEle = $('style.mark-style').length ? $('style.mark-style') : $('<style class="mark-style"></style>');
    styleEle.html(style).appendTo('head');

    $('[name="info"]', panelRoot).attr('length', $('[data-mark]').length).attr('null', $('[data-mark="null"]').length);
  };
  const promptSetting = (keyName) => {
    const database = getValue();
    const obj = database[keyName] || {};
    const answer = ask(`已存在:\n- - -\n${Object.keys(obj).map((i) => `${i}:  ${obj[i]}`).join('\n')}\n- - -\n请使用:分割，值为null表示删除`);
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
  const markBatch = (elems) => {
    const database = getValue();
    const colors = database.color || {};
    const type = ask(`要标记的状态,值为null表示删除:\n- - -\n${Object.keys(colors).map((i) => `${i}:${colors[i]}`).join('\n')}\n- - -`);
    if (!type) return;
    const obj = database.book || {};

    updateElems();
    elems.forEach((i) => {
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
  function markDirect(name, type) {
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

  const observer = new window.MutationObserver((mutationsList) => {
    if (mutationsList.some((i) => i.addedNodes && [].concat(...i.addedNodes).some((j) => j.nodeType === 1))) updateHighlight();
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  $('<mark-panel>').insertAfter('body');

  class markPanel extends window.HTMLElement {
    constructor() {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      panelRoot = this.shadowRoot;
      $('<style>').text([
        'div{z-index:99999;position:fixed;top:0;left:0;}',
        '.mark-switch{background:#0F0;}',
        '.mark-switch::after{content:"on";}',
        '.mark-switch.mark-switch-disabled{background:#F00;}',
        '.mark-switch.mark-switch-disabled::after{content:"off";}',
        '[name="mark"]{background:#F00;}',
        '[name="mark"].mark-mark-on{background:#0F0;}',

        '[name="info"]::after{content:"-"attr(length)"-"attr(null)!important;}',
        '[name]::after{content:attr(name)}',

        '.mark-less.mark-less-on::after{content:">>";}',
        '.mark-less::after{content:"<<";}',
      ].join('')).appendTo(shadow);
      const container = $('<div>').appendTo(shadow);
      $('<button class="mark-close">x</button>').on({
        click: () => $(this).hide(),
      }).appendTo(container);
      $('<button name="info" disabled>').text(libName).appendTo(container);
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
        },
      }).appendTo(container);
      $('<button name="color" class="mark-color mark-less-hide"></button>').on({
        click: () => promptSetting('color'),
      }).appendTo(container);
      $('<button name="match" class="mark-less-hide"></button>').on({
        click: () => promptSetting('match'),
      }).appendTo(container);
      $('<button name="mark"></button>').on({
        click: (e) => {
          let type;
          const markEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();

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
            type = ask(`要标记的状态,值为null表示删除:\n- - -\n${Object.keys(colors).map((i) => `${i}:${colors[i]}`).join('\n')}\n- - -`);
            if (!type) {
              $(e.target).toggleClass('mark-mark-on');
              return;
            }
            $('body').on('click', '[data-mark]', markEvent);
          } else {
            $('body').off('click', '[data-mark]');
          }
        },
      }).appendTo(container);
      $('<button name="mark-one"></button>').on({
        click: (e) => {
          let type;
          const markOneEvent = (e) => {
            e.preventDefault();
            e.stopPropagation();

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
        },
      }).appendTo(container);
      $('<button name="mark-all" class="mark-less-hide"></button>').on({
        click: () => markBatch($('[data-mark]').toArray()),
      }).appendTo(container);
      $('<button name="mark-null" class="mark-less-hide"></button>').on({
        click: () => markBatch($('[data-mark="null"]').toArray()),
      }).appendTo(container);
      $('<button name="hide-marked" class="mark-less-hide"></button>').on({
        click: () => {
          const marked = $('[data-mark]:not([data-mark=""]):not([data-mark="null"])').toArray();
          for (const elem of marked) {
            $(elem).parents().filter((index, e) => $(e).find('[data-mark]').length === 1).eq(-1)
              .toggle();
          }
        },
      }).appendTo(container);
      $('<button name="show" class="mark-less-hide"></button>').on({
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
            const names = Object.keys(books).filter((i) => books[i] === type);
            for (const name of names) {
              html = `${html}<li>`;
              html = `${html}<span class="mark-show-pre">${name}</span>`;
              html = html + Array.from(new Set(searchLib.concat(lib))).map((lib) => {
                if (!lib.search) return;
                const [info, url] = lib.search.split('|');
                return `<a class="mark-show-search" href="${url.replace('%s', encodeURIComponent(name))}">${info}</a>`;
              }).join('');
              html = `${html}</li>`;
            }
            html = `${html}</ol>`;
            $(html).attr('name', type).appendTo($(elem).find('.mark-show-content'));
          }
          elem.appendTo('body');
          $('.mark-show-nav-select').on({
            click: (e) => {
              $('.mark-show-nav-select').removeClass('mark-show-nav-selected');
              $(e.target).addClass('mark-show-nav-selected');
              $('.mark-show-content>ol').hide();
              $('.mark-show-content>ol').filter((order, i) => $(i).attr('name') === $(e.target).attr('name')).show();
            },
          });
          $('.mark-show-nav-select:eq(0)').addClass('mark-show-nav-selected');
          $('.mark-show-content>ol').hide();
          $('.mark-show-content>ol:eq(0)').show();
        },
      }).appendTo(container);
      $('<button name="edit" class="mark-less-hide"></button>').on({
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
            },
          }).appendTo('.mark-edit-container');
          $('.mark-edit-textarea').text(JSON.stringify(database, null, 2));
        },
      }).appendTo(container);

      // 最后
      $('<button class="mark-less"></button>').on({
        click: (e) => {
          $(e.target).toggleClass('mark-less-on');
          $('.mark-less-hide', panelRoot).toggle();
        },
      }).appendTo(container);
      $('.mark-less', panelRoot).click();
    }
  }
  class markSearchBar extends window.HTMLElement {
    static get observedAttributes() { return ['css']; }

    constructor() {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      $('<style>').text([
        'div{background:#fcfcfc;text-align:center;position:fixed;}',
        'div>a{display:inline-block;cursor:pointer;margin:3px;}',
        'div>a>img{width:24px;height:24px;}',
        'div>a>span{display:block;}',
        // 'div>a:hover>span{display:block;}'
      ].join('')).appendTo(shadow);
      const buttons = Array.from(new Set(searchLib.concat(lib))).map((lib) => {
        if (!lib.search) return;
        const [info, url] = lib.search.split('|');
        return `<a data-url="${url}"><img src="https://favicon.yandex.net/favicon/${new URL(url).host}/" /><span>${info}</span></a>`;
      }).join('');
      if (buttons === '') {
        $(document).off('mouseup');
        return;
      }
      $('<div>').html(buttons).appendTo(shadow).on('click', (e) => {
        const elem = $(e.target).parentsUntil('div').eq(-1);
        const text = document.defaultView.getSelection().toString().trim();
        if (text === '') return $(this).hide();
        const url = $(elem).attr('data-url').replace('%s', encodeURIComponent(text));
        GM_openInTab(url);
      });
    }

    attributeChangedCallback(name, oldValue, newValue) {
      $('div', this.shadowRoot).css(JSON.parse($(this).attr('css')));
    }
  }

  window.customElements.define('mark-panel', markPanel);
  window.customElements.define('mark-search-bar', markSearchBar);

  $(window).on('focus', (e) => {
    updateHighlight();
  });
}());
