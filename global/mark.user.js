// ==UserScript==
// @name        []mark
// @description mark
// @include     *
// @version     1.3.0
// @modified    2020/12/13 13:19:17
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @grant       GM_addValueChangeListener
// @grant       GM_getResourceText
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.js
// @resource jquery-confirm-style https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.4/jquery-confirm.min.css
// ==/UserScript==
/* global GM_setValue GM_getValue GM_openInTab GM_xmlhttpRequest GM_addValueChangeListener GM_getResourceText */
/* global $ */
/* eslint-disable no-debugger  */
(async function () {
  'use strict';
  var prompt = async (message, defaultValue, autocompleteList = [], timeout) => {
    const root = $('<mark-confirm>').insertAfter('body');
    return new Promise((resolve, reject) => {
      $.confirm({
        theme: 'banner',
        boxWidth: '50%',
        useBootstrap: false,
        title: '',
        content: [
          '<div class="container">',
          ` <div>${message}</div>`,
          ' <input type="text" list="promptList" style="height:40px;width:400px;font-size:20px;" ondblclick="this.value=&quot;&quot;"/>',
          ' <datalist id="promptList">',
          ...autocompleteList.map(i => `<option value="${i}"></option>`),
          ' </datalist>',
          '</div>'
        ].join(''),
        autoClose: timeout ? `cancel|${timeout}` : null,
        backgroundDismiss: 'cancel',
        buttons: {
          formSubmit: {
            text: '确定',
            btnClass: 'btn-blue'
          },
          cancel: {
            text: '取消',
            btnClass: 'btn-default',
            keys: ['esc']
          }
        },
        onContentReady: function () {
          var jc = this;
          this.$content.find('input').on('keyup', (e) => {
            e.preventDefault();
            if (e.key === 'Enter') {
              jc.$$formSubmit.trigger('click');
            }
          }).val(defaultValue);
        },
        onClose: function () {
          resolve(null);
        },
        onAction: function (btn) {
          resolve(btn === 'cancel' ? null : this.$content.find('input').val());
          root.remove();
        },
        container: root.get(0).shadowRoot
      });
    });
  };
  // prompt('测试message', '默认数值', ['可选数值a', '可选数值b'], 5000).then(e => { console.log(e); });

  await new Promise((resolve, reject) => { // 仅在页面活动时开始运行
    if (!document.hidden) {
      resolve();
      return;
    }
    $(window).on('visibilitychange focus mousemove mousedown keydown touchstart mousewheel'.split(' ').map(i => i + '.mark-start').join(' '), () => {
      if (!document.hidden) {
        $(window).off('.mark-start');
        resolve();
      }
    });
  });

  $.extend({
    markFunction: { markDirect, xhrSync, waitFor, waitIn }
  });
  const server = $.markConfig && $.markConfig.libs ? $.markConfig.server : 'http://localhost:5556';
  const maxRetry = $.markConfig && $.markConfig.libs ? $.markConfig.maxRetry : 3;
  const libs = $.markConfig && $.markConfig.libs ? $.markConfig.libs : {
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
         * Array of async function(elem)
         */

        /**
         * ?textReplace, textReplaceEvery
         * Array of [match, replace]
         * 替换元素下的首个textNode
         * like elementDo: [function (elem) { elem.textContent = elem.textContent.replace(match, replace); }]
         * 循环替换
         */
        textReplaceEvery: [[/^\s*作\s*者\s*[:：]/], [/\|/g, '']]

        /**
         * ?remakeHTML, remakeHTMLEvery
         * Array of [match, replace]
         * match匹配html(), replace替换outerHTML
         * replace中特殊字符串: $tag tagName, $attr 除data-mark开头外的attributes
         * 每个元素只替换1次
         * 如果改变了CSS路径，需手动添加data-mark
         * 慎用
         */

        /**
          * ?search
          * string '名称|网址|图标' 包含%s
          * Function 无参，返回[名称，网址，?图标]
          * 注：名称为唯一值
          */
        // search: '书架|https://my.qidian.com/bookcase/search?kw=%s'

        /**
         * ?do 仅在匹配页面生效
         * ?doEvery 即使不匹配，只要是这个lib都生效
         * ?doEveryArgs （作为doEvery的参数）当doEveryArgs为function时，返回值作参数，否则本值作参数
         * Async Function
         */

        // 顺序： doEveryArgs/doEvery => do => elementDo => textReplace/textReplaceEvery => remakeHTML/remakeHTMLEvery
      }
    ],
    manga: [
      {
        filterUrl: /i.dmzj.com\/(record|subscribe)/,
        elems: ['.dy_content_li h3>a', '.history_des>h3>a']
      }
    ]
  };

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

  let libName, lib, database;
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
  const setValue = (value) => value || window.confirm('数据库错误，请仔细检查\n是否强制保存') ? GM_setValue(`database_${libName}`, JSON.stringify(value)) || true : false;
  database = getValue();
  GM_addValueChangeListener(`database_${libName}`, (name, valueOld, value, remote) => {
    if (!remote) return;
    try {
      database = JSON.parse(value || '{}');
      updateHighlight();
    } catch (error) {
      console.error(error);
    }
  });
  const queryMark = async (list = []) => {
    list = [...new Set(list)];
    const result = {};

    // 先从本地获取
    const books = database.book || {};
    list = list.filter(i => {
      if (i in books) {
        result[i] = books[i];
        return false;
      }
      return true;
    });

    // 再从远程获取
    if (server && list.length) {
      const search = new URLSearchParams();
      search.append('category', libName);
      for (const i of list) {
        search.append('names', i);
      }
      let res;
      let retry = 0;
      while (!res || res.status !== 200 || !res.response) {
        try {
          res = await xhrSync(`${server}/query`, search.toString(), {
            responseType: 'json',
            timeout: 120 * 1000
          });
        } catch (error) {
          console.error(error);
          if (retry++ >= maxRetry) break;
          await waitIn(5000);
        }
      }
      if (res && res.status === 200 && res.response) {
        for (let i = 0; i < list.length; i++) {
          const books = database.book || {};
          result[list[i]] = books[list[i]] || res.response[i];
        }
        updateMark(result);
      }
    }

    return result;
  };
  const updateMark = (obj = { name: 'mark' }) => {
    // 先储存到本地
    database.book = Object.assign(database.book || {}, obj);
    setValue(database);
    updateHighlight();
  };
  const updateMarkRemote = async function (force) {
    if (!server) return;
    // 每天第一次时同步
    let date = new Date();
    date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (date === database.date && !force) return;
    if (database.updating && !force) return;
    if (Object.keys(database.book || {}).length === 0) return;
    database.updating = true;
    setValue(database);

    // 储存到远程
    const search = new URLSearchParams();
    search.append('category', libName);
    for (const arr of Object.entries(database.book)) {
      search.append('items', arr.join('|'));
    }
    let res;
    try {
      res = await xhrSync(`${server}/update`, search.toString(), {
        responseType: 'json',
        timeout: 120 * 1000
      });
    } catch (error) {
      console.error(error);
    }

    if (res && res.status === 200 && res.response) {
      database.book = {};
      database.date = date;
    }
    database.updating = false;
    setValue(database);
  };
  await updateMarkRemote();

  $('<style></style>').html([
    'mark-panel,mark-search-bar,mark-confirm{all:initial;}',

    '[data-mark]:hover{background-color:unset!important;}',
    '[data-mark][data-mark-after]:hover::after{content:"["attr(data-mark)"]"}',
    '[data-mark]{border:1px black solid;margin:-1px;}',
    '[data-mark=""]{border:1px black dashed;cursor:help;}',
    //
    '.mark-container{position:fixed;left:0;right:0;top:0;bottom:0;margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;}',
    '.mark-container{z-index:99999;background:white;max-width:60vw;max-height:60vh;overflow:scroll;}',
    '.mark-show-nav,.mark-show-nav-select{display:inline}',
    '.mark-show-nav-select:before{content:attr(name)}',
    '.mark-show-nav-select{margin:2px;border:solid 1px black}',
    '.mark-show-nav-selected{color:red}',
    '.mark-show-pre{white-space:pre-wrap;word-break:break-word;font-family:Consolas,Monaco,monospace;}',
    '.mark-show-pre::before{content:"《"}',
    '.mark-show-pre::after{content:"》"}',
    //
    '.mark-edit-textarea{width:99%;height:calc(99% - 16px);}',
    '.mark-container[name="search"] [data-mark]{margin:0 2px;line-height:2;}'
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
  const searchLib = lib.filter(i => i.search);
  let firstRun = true;
  const ask = async (question, answer, list) => {
    answer = await prompt(question, answer || database.answer || '', list);
    if (answer) {
      database.answer = answer;
      setValue(database);
    }
    return answer;
  };
  let elems;
  let updatingElems = false;
  const updateElems = async () => {
    await waitFor(() => !updatingElems);
    updatingElems = true;
    let temp = [];
    for (const i of lib) {
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
        const args = typeof i.doEveryArgs === 'function' ? await i.doEveryArgs() : i.doEveryArgs;
        for (const i of lib) {
          if (typeof i.doEvery === 'function') await i.doEvery(args);
        }
        if (typeof i.do === 'function') await i.do();
      }

      let elem = selectCalc(i.elems, {
        string: text => $(text).toArray(),
        function: func => func()
      }).filter(i => i).map(i => i instanceof $().constructor ? i.toArray() : i).reduce((pre, cur) => [].concat(cur, pre));

      elem = $(elem).add('[data-mark]').not('[data-mark-disabled]').toArray(); // .filter(i => i.textContent && i.textContent.trim());

      if (i.elementDo instanceof Array && i.elementDo.every(i => typeof i === 'function')) {
        const elems = $([].concat(elem, temp)).filter(':not([data-mark-do="true"])');
        for (const elem of elems) {
          for (const func of i.elementDo) {
            await func(elem);
          }
          $(elem).attr('data-mark-do', 'true');
        }
      }
      if (i.textReplace instanceof Array || lib.find(i => i.textReplaceEvery instanceof Array)) {
        const elems = $([].concat(elem, temp)).filter(':not([data-mark-text="true"])').toArray();
        for (const elem of elems) {
          const node = $(elem).find(':not(iframe)').addBack().contents().toArray().find(j => j.nodeType === 3);
          let text = node.textContent.trim();

          const dict = [].concat(i.textReplace || [], ...lib.filter(i => i.textReplaceEvery instanceof Array).map(i => i.textReplaceEvery));
          let replace = dict.find(i => text.match(i[0]));
          let replaceLast = null;
          let textLast = null;
          while (replace) {
            if (replace === replaceLast && textLast === text) {
              console.error('mark: 替换文本陷入死循环\n替换规则: ' + replace);
              dict.splice(dict.indexOf(replace), 1);
            }
            textLast = text;
            text = text.replace(replace[0], replace[1] || '').trim();
            replaceLast = replace;
            replace = dict.find(i => text.match(i[0]));
          }

          node.textContent = text.trim();
          $(elem).attr('data-mark-text', 'true');
        }
      }
      if (i.remakeHTML instanceof Array || lib.find(i => i.remakeHTMLEvery instanceof Array)) {
        const elems = $([].concat(elem, temp)).filter(':not([data-mark-html="true"])').toArray();
        for (const elem of elems) {
          let html = $(elem).html();
          const dict = [].concat(i.remakeHTML || [], ...lib.filter(i => i.remakeHTMLEvery instanceof Array).map(i => i.remakeHTMLEvery));
          const replace = dict.find(i => html.match(i[0]));
          if (replace) {
            elems.splice(elems.indexOf(elem), 1);

            html = html.replace(replace[0], replace[1] || '');
            html = html.replace(/\$tag/g, elem.tagName.toLowerCase());
            const temp = $('<div>').html(html);
            if (temp.find('[\\$attr]').length) {
              temp.find('[\\$attr]').toArray().forEach(e => {
                $(e).attr('$attr', null).attr(Object.fromEntries([...elem.attributes].filter(i => !i.nodeName.match(/^data-mark(-|$)/i)).map(i => [i.nodeName, i.nodeValue])));
              });
            }
            html = temp.html();
            $(elem).replaceWith($(html).attr('data-mark-html', 'true'));
          }
        }
      }
      temp = [].concat(temp, elem);
    }
    if (firstRun) {
      let mouseDown = false;
      $(document).on('mousemove.mark-search', '[data-mark]', (e) => {
        if (!mouseDown && document.defaultView.getSelection().toString().trim()) {
          $('mark-search-bar').show();
        }
      });
      $(document).on('mousedown.mark-search', (e) => {
        mouseDown = true;
      });
      $(document).on('mouseup.mark-search', function (e) {
        // console.log(e.target);
        mouseDown = false;
        if ($(e.target).is('mark-search-bar')) {
          setTimeout(() => {
            $('mark-search-bar').hide();
          }, 400);
          return;
        }
        if (e.which !== 1 || (!$(e.target).is('[data-mark],[data-mark] *,:has([data-mark])') && !e.altKey)) return $('mark-search-bar').hide();
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
          left: left,
          top: top
        })).show().attr('more', e.shiftKey * 1);
      });
    }
    firstRun = false;
    elems = temp;
    $(elems).toArray().forEach(i => (i.textContent = i.textContent.trim()));
    $(elems).not('[data-mark]').attr('data-mark', 'null');
    updatingElems = false;
  };
  const updateHighlight = async () => {
    const matches = database.match || {};

    const list = elems.map(i => i.textContent.trim());
    const books = await queryMark(list);

    elems.forEach(i => {
      const name = i.textContent.trim();

      if (name in books) {
        if (books[name] && books[name] !== 'null') {
          $(i).attr('data-mark', String(books[name]));
        } else if (Object.keys(matches).some(i => name.match(i))) {
          const filtered = Object.keys(matches).filter(i => name.match(i))[0];
          $(i).attr('data-mark', matches[filtered]);
        } else {
          $(i).attr('data-mark', String(books[name]));
        }
      } else {
        $(i).attr('data-mark', '');
      }
    });

    const colors = database.color || {};
    const style = Object.keys(colors).map(i => `[data-mark="${i}"]{background-color:${colors[i]}!important;}`);
    const styleEle = $('style.mark-style').length ? $('style.mark-style') : $('<style class="mark-style"></style>');
    styleEle.html(style).appendTo('head');

    $('[name="info"]', panelRoot).attr('length', $('[data-mark]').length).attr('null', $('[data-mark="null"]').length);
  };
  const promptSetting = async keyName => {
    const obj = database[keyName] || {};
    const answer = await ask(`<h3>已存在:</h3>请使用 <span style="font-weight:bold;">:</span> 分割，值为 <span style="font-weight:bold;">null</span> 表示删除<hr><ol style="text-align:justify;overflow:auto;max-height:calc(60vh - 160px);">${Object.keys(obj).map(i => `<li><span style="font-weight:bold;">${i}</span>: ${obj[i]}</li>`).join('')}</ol><hr>`, null, Object.keys(obj).map(i => `${i}:  ${obj[i]}`));
    if (!answer) return;
    const arr = answer.split(/:|：/);
    if (arr.length > 1) {
      if (arr[0] === 'null') return;
      if (arr[1] === 'null') {
        delete obj[arr[0]];
      } else {
        obj[arr[0]] = arr.slice(1).join(':').trim();
      }
      database[keyName] = obj;
      setValue(database);
      updateHighlight();
    }
  };
  const markBatch = async elems => {
    const colors = database.color || {};
    const type = await ask(`<h3>要标记的状态,值为null表示删除:</h3>请使用 <span style="font-weight:bold;">:</span> 分割，值为 <span style="font-weight:bold;">null</span> 表示删除<hr><ol style="text-align:justify;overflow:auto;max-height:calc(60vh - 160px);">${Object.keys(colors).map(i => `<li><span style="background:${colors[i]}">测试文本</span> <span style="font-weight:bold;">${i}</span>: ${colors[i]}</li>`).join('')}</ol><hr>`, null, Object.keys(colors));
    if (!type) return;

    const list = elems.map(i => i.textContent.trim());
    updateMark(Object.fromEntries(list.map(i => ([i, type]))));
  };
  function markDirect (name, type) {
    if (name && (name = name.trim())) updateMark(Object.fromEntries([[name, type]]));
  }

  var observer = new window.MutationObserver(async (mutationsList) => {
    if (mutationsList.some(i => i.addedNodes && [].concat(...i.addedNodes).some(j => j.nodeType === 1))) {
      await updateElems();
      updateHighlight();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  class markPanel extends window.HTMLElement {
    constructor () {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      panelRoot = this.shadowRoot;
      $('<style>').text([
        'div{z-index:99999;position:fixed;top:0;left:0;z-index:2147483647;}',
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
        'button:disabled{background-color:#000;color:#fff;}'
      ].join('')).appendTo(shadow);
      const container = $('<div>').appendTo(shadow);
      $('<button class="mark-close">x</button>').on({
        click: () => $(this).hide()
      }).appendTo(container);
      $('<button name="info" disabled length="x" null="x">').text(libName).appendTo(container);
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
      }).appendTo(container);
      $('<button name="color" class="mark-color mark-less-hide"></button>').on({
        click: () => promptSetting('color')
      }).appendTo(container);
      $('<button name="match" class="mark-less-hide"></button>').on({
        click: () => promptSetting('match')
      }).appendTo(container);
      $('<button name="mark"></button>').on({
        click: async (e) => {
          $('body').off('click.markone');

          $(e.target).toggleClass('mark-mark-on');
          if ($(e.target).is('.mark-mark-on')) {
            const colors = database.color || {};
            const type = await ask(`<h3>要标记的状态,值为null表示删除:</h3>请使用 <span style="font-weight:bold;">:</span> 分割，值为 <span style="font-weight:bold;">null</span> 表示删除<hr><ol style="text-align:justify;overflow:auto;max-height:calc(60vh - 160px);">${Object.keys(colors).map(i => `<li><span style="background:${colors[i]}">测试文本</span> <span style="font-weight:bold;">${i}</span>: ${colors[i]}</li>`).join('')}</ol><hr>`, null, Object.keys(colors));
            if (!type) {
              $(e.target).toggleClass('mark-mark-on');
              return;
            }
            $('body').on('click.mark', (e) => {
              if (!$(e.target).is('[data-mark],[data-mark] *')) return;
              e.preventDefault();
              e.stopPropagation();

              const name = $(e.target).is('[data-mark]') ? $(e.target).text().trim() : $(e.target).parents('[data-mark]').text().trim();
              updateMark(Object.fromEntries([[name, type]]));
            });
          } else {
            $('body').off('click.mark');
          }
        }
      }).appendTo(container);
      $('<button name="mark-one" title="标记1次"></button>').on({
        click: (e) => {
          const type = database.answer;
          $('body').on('click.markone', (e) => {
            if (!$(e.target).is('[data-mark],[data-mark] *')) return;
            e.preventDefault();
            e.stopPropagation();

            const name = $(e.target).is('[data-mark]') ? $(e.target).text().trim() : $(e.target).parents('[data-mark]').text().trim();
            updateMark(Object.fromEntries([[name, type]]));
            $('body').off('click.markone');
          });
        }
      }).appendTo(container);
      $('<button name="mark-all" title="标记本页所有可标记的" class="mark-less-hide"></button>').on({
        click: () => markBatch($('[data-mark]').toArray())
      }).appendTo(container);
      $('<button name="mark-null" title="标记本页所有未标记的"></button>').on({
        click: () => markBatch($('[data-mark="null"]').toArray())
      }).appendTo(container);
      $('<button name="hide-marked" class="mark-less-hide"></button>').on({
        click: () => {
          if ($('[data-mark-hide]').length) {
            $('[data-mark-hide]').attr('data-mark-hide', null).show();
          } else {
            const marked = $('[data-mark]:not([data-mark=""]):not([data-mark="null"])').toArray();
            for (const elem of marked) {
              $(elem).parents().filter((index, e) => $(e).find('[data-mark]').length === 1).eq(-1).attr('data-mark-hide', 'true').hide();
            }
          }
        }
      }).appendTo(container);
      $('<button name="show" class="mark-less-hide"></button>').on({
        click: async () => {
          if ($('.mark-container[name="show"]').length) {
            $('.mark-container[name="show"]').remove();
            return;
          }

          const list = elems.map(i => i.textContent.trim());
          const books = await queryMark(list);
          const types = Object.values(books).sort().filter((item, index, array) => array.indexOf(item) === index);

          const elem = $('<div class="mark-container" name="show"><ul class="mark-show-nav"></ul><div class="mark-show-content"></div></div>');
          for (const type of types) {
            $('<li class="mark-show-nav-select"></li>').attr('name', type).appendTo($(elem).find('.mark-show-nav'));
            let html = '<ol>';
            const names = Object.keys(books).filter(i => books[i] === type);
            for (const name of names) {
              html += `<li><span class="mark-show-pre" data-mark data-mark-do="true" data-mark-html="true" data-mark-text="true">${name}</span></li>`;
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
      }).appendTo(container);
      $('<button name="edit" class="mark-less-hide"></button>').on({
        click: () => {
          if ($('.mark-container[name="edit"]').length) {
            $('.mark-container[name="edit"]').remove();
            return;
          }

          $('<div class="mark-container" name="edit"><textarea class="mark-edit-textarea"></textarea></div>').appendTo('body');
          $('<button class="mark-edit-save">Save</button>').on({
            click: () => {
              try {
                const obj = JSON.parse($('.mark-edit-textarea').val());
                if (setValue(obj)) database = obj;
              } catch (error) {
                console.log(error);
                window.alert('Save Failed');
              }
            }
          }).appendTo('.mark-container[name="edit"]');
          $('.mark-edit-textarea').text(JSON.stringify(database, null, 2));
        }
      }).appendTo(container);
      $('<button name="search" class="mark-less-hide"></button>').on({
        click: async () => {
          if ($('.mark-container[name="search"]').length) {
            $('.mark-container[name="search"]').remove();
            return;
          }
          $('<div class="mark-container" name="search"></div>').html('<div style="text-align:center;margin:5px;"><input name="search" type="text" style="font-size:large;"></div><hr><div name="result"></div>').appendTo('body');
          let typing = false;
          $('.mark-container[name="search"] input[name="search"]').on({
            compositionstart: e => {
              typing = true;
            },
            compositionend: e => {
              typing = false;
              $(e.target).trigger('input');
            },
            input: async e => {
              if (typing || !e.target.value) return;
              let filter = Object.keys(database.book).filter(i => i.match(e.target.value));
              const res = await xhrSync(`${server}/search`, `category=${libName}&name=${encodeURIComponent(e.target.value)}`, {
                responseType: 'json',
                timeout: 120 * 1000
              });
              if (res && res.status === 200 && res.response) filter = filter.concat(res.response);
              $('.mark-container[name="search"] [name="result"]').html([...new Set(filter)].map(i => `<span data-mark data-mark-do="true" data-mark-html="true" data-mark-text="true">${i}</span>`).join(''));
            }
          });
        }
      }).appendTo(container);
      $('<button name="sync" class="mark-less-hide"></button>').on({
        click: async (e) => {
          $(e.target).prop('disabled', 'disabled');
          await updateMarkRemote(true);
          $(e.target).prop('disabled', null);
        }
      }).appendTo(container);
      let lastElem = null;
      const scrollElement = window.innerHeight === document.documentElement.clientHeight ? document.documentElement : document.body;
      const compareElement = scrollElement === document.documentElement ? $('*').toArray().map(i => [i, i.clientHeight]).sort((a, b) => b[1] - a[1])[0][0] : document.documentElement;
      $('<button name="jump-next" class="mark-less-hide"></button>').on({
        click: async (e) => {
          const all = $('[data-mark]').toArray().filter((elem, index, arr) => index <= arr.length - 2 && $(arr[index]).offset().top !== $(arr[index + 1]).offset().top);
          if (!all.length) return;
          let elem = all.find(i => $(i).offset().top >= scrollElement.scrollTop);
          if (!elem) {
            elem = all[0];
          } else if (elem === lastElem) {
            elem = all[(all.indexOf(elem) + 1) % all.length];
          }
          scrollElement.scrollTop = Math.abs(scrollElement.scrollTop + window.innerHeight - compareElement.clientHeight) <= 1 ? 0 : $(elem).offset().top - $(container).height();
          lastElem = elem;
        }
      }).appendTo(container);
      $('<button name="show-mark" class="mark-less-hide"></button>').on({
        click: async (e) => {
          if ($('[data-mark-after]').length) {
            $('[data-mark-after]').attr('data-mark-after', null);
          } else {
            $('[data-mark]').attr('data-mark-after', '1');
          }
        }
      }).appendTo(container);

      // 最后
      $('<button class="mark-less"></button>').on({
        click: (e) => {
          $(e.target).toggleClass('mark-less-on');
          $('.mark-less-hide', panelRoot).toggle();
        }
      }).appendTo(container);
      $('.mark-less', panelRoot).click();
    }
  }
  class markSearchBar extends window.HTMLElement {
    static get observedAttributes () { return ['css', 'more']; }

    constructor () {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      $('<style>').text([
        '.container{background:#fcfcfc;text-align:center;position:fixed;z-index:2147483647;user-select:none;}',
        '[data-url]{display:inline-block;cursor:pointer;margin:3px;}',
        '[data-url]>img{width:24px;height:24px;}',
        '[data-url]>span{display:block;}'
        // 'div>a:hover>span{display:block;}'
      ].join('')).appendTo(shadow);
      const searchDict = {};
      let buttons = searchLib.map((lib, index) => {
        let info, url, favicon;
        if (typeof lib.search === 'string') {
          [info, url, favicon] = lib.search.split('|');
        } else if (typeof lib.search === 'function') {
          [info, url, favicon] = lib.search('');
          searchDict[info] = lib.search;
        }
        favicon = favicon || `https://favicon.yandex.net/favicon/${new URL(url).host}/`;
        if (GM_getValue(`favicon_${favicon}`)) {
          favicon = GM_getValue(`favicon_${favicon}`);
        } else {
          xhrSync(favicon, null, { responseType: 'arraybuffer' }).then(res => {
            const arrayBuffer = res.response;
            const base64 = window.btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
            const type = res.responseHeaders.match(/^Content-Type: (.*)$/im) ? res.responseHeaders.match(/^Content-Type: (.*)$/im)[1] : 'image/png';
            GM_setValue(`favicon_${favicon}`, `data:${type};base64,${base64}`);
          });
        }
        return `<a data-url="${typeof lib.search === 'function' ? info : url}"><img src="${favicon}" /><span>${info}</span></a>${(index + 1) % 6 === 0 ? '<br>' : ''}`;
      });
      buttons = buttons.concat([
        '<a data-url name="more"><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDkwLjY4OCA0OTAuNjg4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0OTAuNjg4IDQ5MC42ODg7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM2MDdEOEI7IiBkPSJNNDcyLjMyOCwyMTYuNTI5TDI0NS4yMTMsNDQzLjY2NUwxOC4wOTgsMjE2LjUyOWMtNC4yMzctNC4wOTMtMTAuOTktMy45NzUtMTUuMDgzLDAuMjYyDQoJCWMtMy45OTIsNC4xMzQtMy45OTIsMTAuNjg3LDAsMTQuODJsMjM0LjY2NywyMzQuNjY3YzQuMTY1LDQuMTY0LDEwLjkxNyw0LjE2NCwxNS4wODMsMGwyMzQuNjY3LTIzNC42NjcNCgkJYzQuMDkzLTQuMjM3LDMuOTc1LTEwLjk5LTAuMjYyLTE1LjA4M2MtNC4xMzQtMy45OTMtMTAuNjg3LTMuOTkzLTE0LjgyMSwwTDQ3Mi4zMjgsMjE2LjUyOXoiLz4NCgk8cGF0aCBzdHlsZT0iZmlsbDojNjA3RDhCOyIgZD0iTTQ3Mi4zMjgsMjQuNTI5TDI0NS4yMTMsMjUxLjY2NUwxOC4wOTgsMjQuNTI5Yy00LjIzNy00LjA5My0xMC45OS0zLjk3NS0xNS4wODMsMC4yNjINCgkJYy0zLjk5Miw0LjEzNC0zLjk5MiwxMC42ODcsMCwxNC44MjFsMjM0LjY2NywyMzQuNjY3YzQuMTY1LDQuMTY0LDEwLjkxNyw0LjE2NCwxNS4wODMsMEw0ODcuNDMyLDM5LjYxMg0KCQljNC4yMzctNC4wOTMsNC4zNTQtMTAuODQ1LDAuMjYyLTE1LjA4M2MtNC4wOTMtNC4yMzctMTAuODQ1LTQuMzU0LTE1LjA4My0wLjI2MmMtMC4wODksMC4wODYtMC4xNzYsMC4xNzMtMC4yNjIsMC4yNjINCgkJTDQ3Mi4zMjgsMjQuNTI5eiIvPg0KPC9nPg0KPHBhdGggZD0iTTI0NS4yMTMsNDY5LjQxNWMtMi44MzEsMC4wMDUtNS41NDgtMS4xMTUtNy41NTItMy4xMTVMMi45OTQsMjMxLjYzM2MtNC4wOTMtNC4yMzctMy45NzUtMTAuOTksMC4yNjItMTUuMDgzDQoJYzQuMTM0LTMuOTkyLDEwLjY4Ny0zLjk5MiwxNC44MiwwbDIyNy4xMzYsMjI3LjExNWwyMjcuMTE1LTIyNy4xMzZjNC4yMzctNC4wOTMsMTAuOTktMy45NzUsMTUuMDgzLDAuMjYyDQoJYzMuOTkzLDQuMTM0LDMuOTkzLDEwLjY4NywwLDE0LjgyMUwyNTIuNzQ0LDQ2Ni4yNzlDMjUwLjc0OCw0NjguMjgsMjQ4LjA0LDQ2OS40MDgsMjQ1LjIxMyw0NjkuNDE1eiIvPg0KPHBhdGggZD0iTTI0NS4yMTMsMjc3LjQxNWMtMi44MzEsMC4wMDUtNS41NDgtMS4xMTUtNy41NTItMy4xMTVMMi45OTQsMzkuNjMzYy00LjA5My00LjIzNy0zLjk3NS0xMC45OSwwLjI2Mi0xNS4wODMNCgljNC4xMzQtMy45OTIsMTAuNjg3LTMuOTkyLDE0LjgyMSwwbDIyNy4xMzYsMjI3LjExNUw0NzIuMzI4LDI0LjUyOWM0LjA5My00LjIzNywxMC44NDUtNC4zNTQsMTUuMDgzLTAuMjYyDQoJczQuMzU0LDEwLjg0NSwwLjI2MiwxNS4wODNjLTAuMDg2LDAuMDg5LTAuMTczLDAuMTc2LTAuMjYyLDAuMjYyTDI1Mi43NDQsMjc0LjI3OUMyNTAuNzQ4LDI3Ni4yOCwyNDguMDQsMjc3LjQwOCwyNDUuMjEzLDI3Ny40MTV6Ig0KCS8+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg=="><span>更多</span></a>',
        '<div class="more" style="display:none;">',
        '<hr>',
        '<a data-url="https://www.google.com/search?q=%s"><img src="https://www.google.com/favicon.ico" /><span>Google搜索</span></a>',
        '<a data-url="https://www.baidu.com/s?wd=%s"><img src="https://www.baidu.com/favicon.ico" /><span>百度搜索</span></a>',
        '<a data-url="https://www.so.com/s?q=%s"><img src="https://www.so.com/favicon.ico" /><span>360搜索</span></a>',
        '<a data-url name="close"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIuMDAxIDUxMi4wMDEiPjxwYXRoIGQ9Ik0yODQuMjg2IDI1Ni4wMDJMNTA2LjE0MyAzNC4xNDRjNy44MTEtNy44MTEgNy44MTEtMjAuNDc1IDAtMjguMjg1LTcuODExLTcuODEtMjAuNDc1LTcuODExLTI4LjI4NSAwTDI1NiAyMjcuNzE3IDM0LjE0MyA1Ljg1OWMtNy44MTEtNy44MTEtMjAuNDc1LTcuODExLTI4LjI4NSAwLTcuODEgNy44MTEtNy44MTEgMjAuNDc1IDAgMjguMjg1bDIyMS44NTcgMjIxLjg1N0w1Ljg1OCA0NzcuODU5Yy03LjgxMSA3LjgxMS03LjgxMSAyMC40NzUgMCAyOC4yODVhMTkuOTM4IDE5LjkzOCAwIDAgMCAxNC4xNDMgNS44NTcgMTkuOTQgMTkuOTQgMCAwIDAgMTQuMTQzLTUuODU3TDI1NiAyODQuMjg3bDIyMS44NTcgMjIxLjg1N2MzLjkwNSAzLjkwNSA5LjAyNCA1Ljg1NyAxNC4xNDMgNS44NTdzMTAuMjM3LTEuOTUyIDE0LjE0My01Ljg1N2M3LjgxMS03LjgxMSA3LjgxMS0yMC40NzUgMC0yOC4yODVMMjg0LjI4NiAyNTYuMDAyeiIvPjwvc3ZnPg=="><span>禁止弹出</span></a>',
        '</div>'
      ]);
      $('<div class="container">').html(buttons.join('')).appendTo(shadow).on('click', (e) => {
        const elem = $(e.target).is('[data-url]') ? $(e.target) : $(e.target).parents('[data-url]').eq(-1);
        if (elem.is('[name="close"]')) {
          $(document).off('.mark-search');
          $('mark-search-bar').remove();
          return;
        } else if (elem.is('[name="more"]')) {
          $('.container>.more', this.shadowRoot).show();
          return;
        }
        const text = document.defaultView.getSelection().toString().trim();
        if (text === '') return $(this).hide();
        let url = $(elem).attr('data-url');
        url = url in searchDict ? searchDict[url](text)[1] : url.replace('%s', encodeURIComponent(text));
        if (url) GM_openInTab(url);
      });
      $('.container>[name="more"]', shadow).on('mouseenter', () => {
        $('.container>.more', shadow).show();
      });
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'css') {
        $('.container', this.shadowRoot).css(JSON.parse($(this).attr('css')));
      } else if (name === 'more') {
        if (newValue * 1) {
          $('.container>.more', this.shadowRoot).show();
        } else {
          $('.container>.more', this.shadowRoot).hide();
        }
      }
    }
  }
  class markConfirm extends window.HTMLElement {
    constructor () {
      super();

      const shadow = this.attachShadow({ mode: 'open' });
      $('<style>').text(GM_getResourceText('jquery-confirm-style')).appendTo(shadow);
      /* const container =  */$('<div>').appendTo(shadow);
    }
  }

  window.customElements.define('mark-panel', markPanel);
  window.customElements.define('mark-search-bar', markSearchBar);
  window.customElements.define('mark-confirm', markConfirm);

  $('<mark-panel>').insertAfter('body');
  await updateElems();
  updateHighlight();

  $(window).on('focus', (e) => {
    updateHighlight();
  });

  // 通用函数
  function xhrSync (url, parm = null, opt = {}) {
    return new Promise((resolve, reject) => {
      const dealWithError = async (msg, res) => {
        // console.error(res);
        msg = `请求${msg}\n链接:\t${new URL(url, window.location.href).href}\n是否重试?`;

        reject(res);
      };
      GM_xmlhttpRequest({
        method: opt.method || parm ? 'POST' : 'GET',
        url: url || opt.url,
        data: parm || opt.data,
        timeout: opt.timeout || 60 * 1000,
        responseType: ['text', 'json', 'blob', 'arraybuffer', 'document'].includes(opt.responseType) ? opt.responseType : 'text',
        headers: opt.headers || {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        onload (res) {
          resolve(res);
        },
        ontimeout: async (res) => {
          dealWithError('超时', res);
        },
        onerror: async (res) => {
          dealWithError('错误', res);
        }
      });
    });
  }
  function waitFor (check, timeout) {
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
  function waitIn (time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
})();
