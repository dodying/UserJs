// ==UserScript==
// @name        QQ阅读-列表
// @description 自净网行动后，狗比起点/阅文不再在网页上显示所有书籍了
// @include     http://ebook.qq.com/classify/index.html*
// @version     1.0.533
// @created     2020-07-15 12:22:22
// @modified    2020/9/28 18:04:07
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @noframes
// require     file:///E:/Desktop/_/GitHub/UserJs/lib/download.js
// @require     https://cdn.jsdelivr.net/gh/dodying/UserJs@master/lib/download.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// ==/UserScript==
/* eslint-disable no-debugger  */
/* global GM_setValue GM_getValue unsafeWindow */
/* global $ xhr */
(async function () {
  unsafeWindow.getPage = getPage;

  const lib = {
    'c2|作品类别：': $('.tabList>dl:nth-child(1)>dd>a').toArray().map((i) => `${i.href.match(/[?&]catv32=([-\d]+)/)[1]}|${i.textContent}`),
    'c3|次要类别：': ['|不限'],
    'tag|作品标签：': ['|不限'],
    'free|作品价格：': ['-1|不限', '1|免费', '2|VIP'],
    'end|作品进度：': ['-1|不限', '0|完结', '1|连载'],
    'order|排序方式：': ['0|畅销', '1|收藏', '2|更新'],
    'textSize|作品字数：': ['0|不限', '1|20万字以下', '2|20-30万字', '3|30-50万字', '4|50-100万字', '5|100-200万字', '6|200万字以上'],
  };

  let filter = [
    { name: 'c2', value: '20059' },
    { name: 'c3', value: '' },
    { name: 'tag', value: '' },
    { name: 'free', value: '-1' },
    { name: 'end', value: '1' },
    { name: 'order', value: '0' },
    { name: 'textSize', value: '0' },
  ];
  let lastBook;

  getCatetag(filter.find((i) => i.name === 'c2').value);

  $('#bookList').on('click', '[name="page"]', async (e) => {
    lastBook = $('.showInfo').last().attr('bid') * 1;
    $('body').css('cursor', 'wait');
    await getPage($(e.target).attr('value') * 1);
    $('body').css('cursor', '');
  });
  $('#bookList').on('click', '[name="hideBook"]', (e) => {
    const hideId = GM_getValue('hideId', []);
    const bid = $(e.target).attr('value') * 1;
    if (!hideId.includes(bid)) {
      hideId.push(bid);
      GM_setValue('hideId', hideId);
    }
    $('#bookList').find(`.hideInfo[bid="${bid}"]`).show();
    $('#bookList').find(`.showInfo[bid="${bid}"]`).hide();
  });
  $('#bookList').on('click', '[name="showBook"]', (e) => {
    const hideId = GM_getValue('hideId', []);
    const bid = $(e.target).attr('value') * 1;
    if (hideId.includes(bid)) {
      hideId.splice(hideId.indexOf(bid, 1));
      GM_setValue('hideId', hideId);
    }
    $('#bookList').find(`.showInfo[bid="${bid}"]`).show();
    $('#bookList').find(`.hideInfo[bid="${bid}"]`).hide();
  });
  $('#bookList').on('click', '[name="hideBookAll"]', (e) => {
    const hideId = GM_getValue('hideId', []);
    const bids = $('.showInfo:visible').toArray().map((i) => $(i).attr('bid') * 1);
    hideId.push(...bids);
    GM_setValue('hideId', hideId);

    $('#bookList').find('.hideInfo').show();
    $('#bookList').find('.showInfo').hide();
  });
  $('#bookList').on('click', '[name="toggleKeyword"]', (e) => {
    const hideKeyword = GM_getValue('hideKeyword', []);
    const keyword = window.prompt(`已存在: \n${hideKeyword.join(', ')}`);
    if (!keyword) return;
    if (hideKeyword.includes(keyword)) {
      hideKeyword.splice(hideKeyword.indexOf(keyword, 1));
    } else {
      hideKeyword.push(keyword);
    }
    GM_setValue('hideKeyword', hideKeyword);
  });

  async function getPage(page = 1, pageSize = 30) {
    const search = new URLSearchParams('');
    for (const obj of filter) {
      const { name, value } = obj;
      search.set(name, value);
    }
    search.set('pageNo', page);
    search.set('pageSize', pageSize);

    const res = await xhr.sync(`https://wxmini.reader.qq.com/fox/search/subcategory?${search.toString()}`);
    if (res.status === 200 && res.response) {
      let json;
      try {
        json = JSON.parse(res.response);
        if (json.code !== 0 || json.msg !== 'ok') throw new Error();
      } catch (error) {
        console.log(res.response);
        return false;
      }
      const hideId = GM_getValue('hideId', []);
      const hideKeyword = GM_getValue('hideKeyword', []);
      const html = [
        ...json.data.dataList.filter((i) => {
          let continued = true;
          if (i.updatetime.match(/^\d+-\d+ \d+:\d+$/) || i.updatetime.match(/^\d+-\d+-\d+/)) {
            const time = i.updatetime.match(/^\d+-\d+ \d+:\d+$/) ? `${new Date().getFullYear()}-${i.updatetime}` : i.updatetime;
            if (new Date().getTime() - new Date(time).getTime() > 30 * 24 * 60 * 60 * 1000) continued = false;
          }

          return i.totalWords / 10000 > 3 && i.lastChapterNo < 2000 && ['', '起点中文网'].includes(i.brand) && continued;
        }).map((i) => { // 过滤
          console.log(`%c ${i.brand}`, 'background: #222; color: #bada55', i.title, i);
          const hide = hideId.includes(i.bid) || hideKeyword.some((j) => i.title.match(j));
          return [
            `<dl class="hideInfo" bid="${i.bid}" style="text-align:center;background:#808080;padding:0;${hide ? '' : 'display:none;'}"><a name="showBook" href="javascript:void 0;" value="${i.bid}" style="background:#fff;font-size:medium;font-weight:bold;">${i.title}</a></dl>`,
            `<dl class="showInfo" bid="${i.bid}" style="${hide ? 'display:none;' : ''}">`,
            '<dt>',
            `<a href="http://ebook.qq.com/intro.html?bid=${i.bid}" target="_blank"><img src="${i.cover}" width="80" height="100"></a>`,
            '</dt>',

            '<dd>',
            '<ul>',
            `  <h3><a href="http://ebook.qq.com/intro.html?bid=${i.bid}" target="_blank">${i.title}</a><em
            class="org">最近更新: <a href="http://ebook.qq.com/hvread.html?bid=${i.bid}&cid=${i.lastChapterId}" target="_blank" ${i.free === 0 ? 'style="color:red;"' : ''}>${i.lastChapterName}</a> ${i.updatetime}</em></h3>`,
            '  <li class="t_5">',
            `    <span>作者：<a href="http://ebook.qq.com/search/index/keyWord/${i.author}" target="_blank">${i.author}</a></span>`,
            `    <span>类别：<a href="/classify/index.html?catv32=${i.c2id}&catv33=20061&sex=1" target="_blank">${i.category}</a></span>`,
            `    <span> 状态： ${i.finished === 1 ? '完结' : '连载'}</span>`,
            `    <span> 字数： ${(i.totalWords / 10000).toFixed(2)}万</span>`,
            '  </li>',
            `  <li style="white-space: pre-wrap;">${i.intro}</li>`,
            `  <li class="btn"><a target="_blank" href="/hvread.html?bid=${i.bid}">立即阅读</a><a href="http://ebook.qq.com/intro.html?bid=${i.bid}?tab=2" target="_blank">作品目录</a><a actiontype="addToBookshelf" bid="${i.bid}" href="javascript:">收藏本书</a><a href="https://www.qidian.com/search?kw=${i.title}" target="_blank">起点搜索</a>${['', '起点中文网'].includes(i.brand) && String(i.bid).length === 8 ? `<a href="https://book.qidian.com/info/10${String(i.bid).substr(0, 1) * 1 - 1}${String(i.bid).substr(1)}" target="_blank">起点阅读</a>` : ''}<a name="hideBook" href="javascript:void 0;" value="${i.bid}">隐藏该书</a></li>`,
            '</ul>',
            '</dd>',
            '</dl>',
          ].join('');
        }),
        '<div class="page_ye">',
        `${page === 1 ? '<span>已到达开头</span>' : `<a name="page" href="javascript:void 0;" value="${page - 1}">&lt;上一页</a>`}`,
        `${page === 1 ? '<span>1</span>' : '<a name="page" href="javascript:void 0;" value="1">1</a>'}`,
        `<span class="current" onclick="(window.page = prompt('请输入页数', ${page})) && getPage(window.page * 1)">${page}</span>`,
        `${!json.data.nextPage ? `<span>${json.data.totalPage}</span>` : `<a name="page" href="javascript:void 0;" value="${json.data.totalPage}">${json.data.totalPage}</a>`}`,
        `${!json.data.nextPage ? '<span>已到达末尾</span>' : `<a name="page" href="javascript:void 0;" value="${page + 1}">下一页&gt;</a>`}`,
        `<span>总共: ${json.data.totalPage}页</span>`,
        '<a name="hideBookAll" href="javascript:void 0;">隐藏所有</a>',
        '<a name="toggleKeyword" href="javascript:void 0;">切换关键词</a>',
        '</div>',
      ].join('\n');
      $('#bookList').html(html);
      if (lastBook && $(`.showInfo[bid="${lastBook}"]`).length) {
        $(`.showInfo[bid="${lastBook}"]`).last().get(0).scrollIntoView();
      } else {
        $('.tabList').get(0).scrollIntoView();
      }
      return true;
    }
  }
  function updateFilterList() {
    const html = [
      '<form id="yueduList">',
    ];
    for (const i in lib) {
      const [key, name] = i.split('|');
      html.push([
        '<dl>',
        `<dt>${name}</dt>`,
        '<dd>',
        `<input type="hidden" name="${key}">`,
        ...lib[i].map((j) => {
          const [value, name] = j.split('|');
          return `<a href="javascript:void 0;" class="yueduListOption" key="${key}" value="${value}">${name}</a>`;
        }),
        '</dd>',
        '</dl>',
      ].join(''));
    }
    html.push('</form>');
    $('.tabList').html(html.join(''));
    $('.tabList').on('click', '.yueduListOption', (e) => {
      const name = $(e.target).attr('key');
      const value = $(e.target).attr('value');
      $('#yueduList').find(`input[name="${name}"]`).val(value);
      filter = $('#yueduList').serializeArray();
      $(e.target).siblings().removeClass('normal');
      $(e.target).addClass('normal');
      if (name === 'c2') {
        getCatetag(value);
      } else {
        getPage();
      }
    });

    for (const obj of filter) {
      const { name, value } = obj;
      $('#yueduList').find(`input[name="${name}"]`).val(value);
      $('#yueduList').find(`a[key="${name}"][value="${value}"]`).addClass('normal');
    }

    lastBook = null;
    getPage();
  }
  async function getCatetag(c2) {
    try {
      const res = await xhr.sync(`https://wxmini.reader.qq.com/fox/query/catetag/list?cid=${c2}&platform=android`);
      if (res.status !== 200 || !res.response) throw new Error();

      const json = JSON.parse(res.response);
      if (json.code !== 0 || json.msg !== 'ok') throw new Error();

      lib['c3|次要类别：'] = ['|不限'].concat(json.data.cateList.map((i) => `${i.id}|${i.name}`));
      lib['tag|作品标签：'] = ['|不限'].concat(json.data.tagList.map((i) => `${i.id}|${i.name}`));
      updateFilterList();
    } catch (error) {
      if (window.confirm('是否重试')) return getCatetag(c2);
    }
  }
}());
