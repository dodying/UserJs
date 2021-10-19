/* eslint-env browser */
// ==UserScript==
// @name        [dmzj]Novel
// @description 在动漫之家上看小说
// @include     http*://xs.dmzj.com/*
// @version     1.0.3
// @modified    2019-8-6 13:30:19
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://static.dmzj.com/public/js/jquery-1.8.2.min.js
// @require     https://static.dmzj.com/public/js/jquery.cookie.js
// ==/UserScript==
function addStyle() {
  const style = [
    // common
    '.flex-center,.flex-center2{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;align-items:center;}',
    '.flex-row{display:flex;flex-direction:row}',
    '.flex-column{display:flex;flex-direction:column}',
    '.flex-row-center{display:flex;flex-direction:row;align-items:center;}',
    '.flex-column-center{display:flex;flex-direction:column;align-items:center;}',
    '.loading{border:16px solid #f3f3f3;border-radius:50%;border-top:16px solid #3498db;animation:spin 2s linear infinite}',
    '@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}',
    '.cover{height:200px;width:150px;border:1px solid #dbdbdb;padding:1px;}',
    '.nav>ul{list-style:none;}',
    '.nav>ul>li,.page>a{margin:0 10px;}',
    '.nav>ul>li>a{color:#167990;background:url(//xs.dmzj.com/images/navlistbtn.png) no-repeat left top;width:79px;height:33px;line-height:33px;text-decoration:none;display:block;font-size:15px;font-weight:bold;text-align:center;}',
    // forIndex
    '.subscribe_num{height:25px;line-height:25px;margin:5px 0;text-align:center;}',
    '.subscribe_num span{color:#f30;}',
    '.cartoon_online_button{height:auto!important;}',
    '.cartoon_online_button>li{overflow:hidden;float:none!important;display:inline-block;}',
    '.part_collection_bnt[disabled]{color:#808080;}',
    // forRead
    'h1.title{clear:both;line-height:50px;font-size:39.6px;font-weight:normal;margin:25px -20px;padding:0 20px 10px;border-bottom:1px solid rgba(0,0,0,.25);font-weight:normal;text-transform:none;}',
    '.content img{margin:10px 0;}',
    '.footer>a{margin:0 15px;font-size:larger;text-decoration:none;color:#065488;}',
    // forSearch
    '.box{border:solid 1px #666;margin:10px;}',
    '.aLike{color:-webkit-link;cursor:pointer;text-decoration:underline;}',
  ];
  $('<style></style>').html(style).appendTo('head');
}

async function forIndex() {
  const id = window.location.href.split('/')[3];
  let info = await xhrSync(`//v3api.dmzj.com/novel/${id}.json`);

  const bookmark = GM_getValue('bookmark', {});
  let record = '';
  if (id in bookmark) {
    const i = bookmark[id];
    record = `<div id="last_read_history" class="cartoon_online_history margin_top_10px" style="">上次看到： <a href="/${id}/${i.volumeId}/${i.chapterId}.shtml" target="_blank">${i.volumeName}  ${i.chapterName}</a></div>`;
  }

  info = JSON.parse(info.response);
  const html = [
    // 右侧
    '<div class="middleright">',
    '  <div class="middleright_mr">',
    '    <div class="odd_anim_title">',
    '      <div class="odd_anim_title_l"></div>',
    '      <div class="odd_anim_title_m">',
    `        <span class="anim_title_text"><a href="" target="_blank"><h1>${info.name}</h1></a></span>${info.status}&nbsp;(&nbsp;最新收录：<a href="/${info.id}/${info.last_update_volume_id}/${info.last_update_chapter_id}.shtml" target="_blank" id="newest_chapter" target="_blank">${info.last_update_volume_name} - ${info.last_update_chapter_name}</a>)`,
    '      </div>',
    '      <div class="odd_anim_title_r"></div>',
    '    </div>',
    '    <div class="photo_part">',
    `      <div class="h2_title2"><span class="h2_icon h2_icon22"></span><h2>${info.name} 在线小说全集</h2></div>`,
    '    </div>',
    `    ${record}`,
    // 插入目录
    '    <ul class="cartoon_online_button margin_top_10px"></ul>',
    '    <div class="flex-center"><div class="loading" style="width:60px;height:60px;"></div></div>',
    // 插入目录
    '  </div>',
    '  <div class="clearfix"></div>',
    '  <div class="middleright_mr margin_top_10px">',
    '    <div class="photo_part">',
    `      <div class="h2_title2"><span class="h2_icon h2_icon10"></span><h2>${info.name} 详细介绍</h2></div></div>`,
    `      <div class="line_height_content">${info.introduction.replace(/\n/g, '<br>')}</div>`,
    '  </div>',
    '</div>',
    // 左侧
    '<div class="left" style="overflow:hidden;">',
    '  <div class="left_mr">',
    '    <div class="anim_intro">',
    '      <div class="intro_top"></div>',
    '      <div class="week_mend">',
    '        <div class="week_mend_back">',
    '          <div class="anim_intro_ptext">',
    `            <a href target="_blank"><img alt="${info.name}" src="${info.cover}" id="cover_pic"></a>`,
    '          </div>',
    '          <div class="part_collection">',
    `            <p class="subscribe_num"><span id="subscribe_num">${info.subscribe_num}</span>人订阅</p>`,
    '            <input class="part_collection_bnt subscribe_action" type="button" name="add" value="添加订阅">',
    '            <input class="part_collection_bnt subscribe_action" type="button" name="del" value="取消订阅">',
    '          </div>',
    '          <div class="part_collection">',
    '          </div>',
    '          <div class="anim-main_list">',
    '            <table><tbody>',
    `              <tr><th>作者：</th><td>${info.authors}</td></tr>`,
    `              <tr><th>地域：</th><td>${info.zone}</td></tr>`,
    `              <tr><th>状态：</th><td>${info.status}</td></tr>`,
    `              <tr><th>人气：</th><td id="hot_hits">${info.hot_hits}℃</td></tr>`,
    `              <tr><th>题材：</th><td>${info.types}</td></tr>`,
    `              <tr><th>最新收录：</th><td><a href="/${info.id}/${info.last_update_volume_id}/${info.last_update_chapter_id}.shtml" target="_blank" id="newest_chapter" target="_blank">${info.last_update_volume_name} - ${info.last_update_chapter_name}</a><br><span class="update2">${new Date(info.last_update_time * 1000).toLocaleString(navigator.language, { hour12: false })}</span></td></tr>`,
    '            </tbody></table>',
    '          </div>',
    '        </div>',
    '      </div>',
    '      <div class="week_foot"></div>',
    '    </div>',
    '  </div>',
    '</div>',
  ].join('');

  document.title = info.name;
  $('head').append('<link rel="stylesheet" type="text/css" href="//manhua.dmzj.com/css/base.css"><link rel="stylesheet" type="text/css" href="//manhua.dmzj.com/css/style2011.css?t=20131210">');
  $('body').html(`<div class="wrap">${html}</div>`);

  $('.subscribe_action').on({
    click: async (e) => {
      $(e.target).attr('disabled', 'disabled');
      const cookie = document.cookie.split(/;\s{0,}/).map((i) => i.split('='));
      const my = cookie.filter((i) => i[0] === 'my');
      if (my.length) {
        const userId = decodeURI(my[0][1]).split('|')[0];
        const action = e.target.name;
        let res = await xhrSync(`https://interface.dmzj.com/api/subscribe/${action}?callback=callback&sub_id=${id}&uid=${userId}&sub_type=2&_=${Date.parse(new Date()) / 1000}`);
        res = res.response.match(/^\s+callback\((.*)\)$/)[1];
        res = JSON.parse(res);
        window.alert(res.msg);
      } else {
        window.alert('请先登陆');
      }
      $(e.target).removeAttr('disabled');
    },
  });

  let volumes = await xhrSync(`//v3api.dmzj.com/novel/chapter/${id}.json`);
  volumes = JSON.parse(volumes.response);
  for (const volume of volumes) {
    $(`<li class="b2 t1" style="cursor: pointer;" name="${volume.volume_id}" title="${volume.volume_name}">${volume.volume_name}</li>`).appendTo('.cartoon_online_button');
    $(`<div class="cartoon_online_border" name="${volume.volume_id}"><ul>${volume.chapters.map((chapter) => `<li><a title="${volume.volume_name} - ${chapter.chapter_name}" href="/${id}/${volume.volume_id}/${chapter.chapter_id}.shtml" target="_blank">${chapter.chapter_name}</a></li>`).join('')}</ul><div class="clearfix"></div></div>`).appendTo('.middleright>.middleright_mr:nth-child(1)');
  }
  $('.cartoon_online_border').hide().eq(-1).show();
  $('.cartoon_online_button>li').on({
    click: (e) => {
      $('.cartoon_online_button>li').removeClass('b1').addClass('b2');
      $(e.target).removeClass('b2').addClass('b1');
      $('.cartoon_online_border').hide().filter(`[name="${$(e.target).attr('name')}"]`).show();
    },
  }).eq(-1).removeClass('b2')
    .addClass('b1');

  $('.cartoon_online_button+.flex-center').remove();
}

async function forRead() {
  const [, id, volumeId, chapterId] = window.location.href.match(/xs.dmzj.com\/(\d+)\/(\d+)\/(\d+).shtml/);
  const content = await xhrSync(`//v3api.dmzj.com/novel/download/${id}_${volumeId}_${chapterId}.txt`);

  const html = [
    '<div class="header">',
    '  背景与字体颜色: ',
    '  <select name="color">',
    '    <option value="0" color="#000" background="#fff" style="color:#000;background:#fff;">白色背景</option>',
    '    <option value="1" color="#24272C" background="#FEF0E1" style="color:#24272C;background:#FEF0E1;">橙色背景</option>',
    '    <option value="2" color="#000" background="#D8E2C8" style="color:#000;background:#D8E2C8;">绿色</option>',
    '    <option value="3" color="#000" background="#CCE8CF" style="color:#000;background:#CCE8CF;">绿色2</option>',
    '    <option value="4" color="#000" background="#E7F4FE" style="color:#000;background:#E7F4FE;">蓝色</option>',
    '    <option value="5" color="#000" background="#C2A886" style="color:#000;background:#C2A886;">棕黄</option>',
    '    <option value="6" color="#000" background="#EAEAEE" style="color:#000;background:#EAEAEE;">经典</option>',
    '    <option value="7" color="#000" background="url(\'//qidian.gtimg.com/qd/images/read.qidian.com/theme/body_theme1_bg_2x.0.3.png\')">起点牛皮纸（深色）</option>',
    '    <option value="8" color="#000" background="url(\'//qidian.gtimg.com/qd/images/read.qidian.com/theme/theme_1_bg_2x.0.3.png\')">起点牛皮纸（浅色）</option>',
    '    <option value="9" color="#666" background="#111 url(\'//qidian.gtimg.com/qd/images/read.qidian.com/theme/theme_6_bg.45ad3.png\') repeat">起点黑色</option>',
    '    <option value="10" color="#BBD7BC" background="#122C14">绿色亮字</option>',
    '  </select>',
    '  字体: ',
    '  <input class="style" type="text" name="font-family" placeholder="微软雅黑,宋体,黑体,楷体">',
    '  字体大小: ',
    '  <input class="style" type="text" name="font-size" placeholder="18px">',
    '  行高: ',
    '  <input class="style" type="text" name="line-height" placeholder="2em">',
    '  行宽: ',
    '  <input class="style" type="text" name="width" placeholder="800px">',
    '</div>',
    '<h1 class="title"></h1>',
    '<div class="content">',
    content.response.replace(/<br ?\/>/g, '').split(/[\r\n]/).filter((i) => i).map((i) => `<p>\u3000\u3000${i}</p>`)
      .join(''),
    '</div>',
    '<div class="footer"></div>',
  ].join('');

  $('body').html(html);
  $('.content').css({
    'font-size': '18px',
    'font-family': '微软雅黑,宋体,黑体,楷体',
    'line-height': '2em',
    width: '800px',
  });
  $('.header>select[name="color"]').on({
    change: (e) => {
      const target = e.target.options[e.target.selectedIndex];
      $('body').css('color', $(target).attr('color')).css('background', $(target).attr('background'));

      const settings = GM_getValue('settings', {});
      settings.color = e.target.selectedIndex;
      GM_setValue('settings', settings);
    },
  });
  $('.header>.style').on({
    change: (e) => {
      const { name } = e.target;
      const value = e.target.value || e.target.placeholder;
      $('.content').css(name, value);
      const settings = GM_getValue('settings', {});
      settings[name] = value;
      GM_setValue('settings', settings);
    },
  });

  const settings = GM_getValue('settings', {});
  for (const i in settings) {
    $(`.header>[name=${i}]`).val(settings[i]).trigger('change');
  }

  let volumes = await xhrSync(`//v3api.dmzj.com/novel/chapter/${id}.json`);
  volumes = JSON.parse(volumes.response);
  volumes = volumes.map((i) => i.chapters.map((j) => [i.volume_id, i.volume_name, j.chapter_id, j.chapter_name]));
  volumes = [].concat.apply([], volumes);
  let current; let index; let prev; let
    next;
  current = volumes.filter((i) => i[0] === volumeId * 1 && i[2] === chapterId * 1)[0];

  const title = `${current[1]}  ${current[3]}`;
  $('h1.title').text(title);
  document.title = title;

  index = volumes.indexOf(current);
  prev = index > 0 ? volumes[index - 1] : null;
  prev = prev ? `<a href="/${id}/${prev[0]}/${prev[2]}.shtml" title="${prev[1]} - ${prev[3]}">上一章</a>` : '<a href="#">此为第一章</a>';
  next = index < volumes.length - 1 ? volumes[index + 1] : null;
  next = next ? `<a href="/${id}/${next[0]}/${next[2]}.shtml" title="${next[1]} - ${next[3]}">下一章</a>` : '<a href="#">此为最后一章</a>';
  $('.footer').html(`${prev} | <a href="/${id}/index.shtml" target="_blank">目录</a> | ${next}`);

  $(window).one('scroll', (e) => {
    const cookie = document.cookie.split(/;\s{0,}/).map((i) => i.split('='));
    const my = cookie.filter((i) => i[0] === 'my');
    if (my.length) {
      const userId = decodeURI(my[0][1]).split('|')[0];
      const json = JSON.stringify([{
        volume_id: volumeId,
        chapter_id: chapterId,
        time: Date.parse(new Date()) / 1000,
        total_num: 0,
        lnovel_id: id,
        page: 0,
      }]);
      json[id] = chapterId;
      xhrSync(`//interface.dmzj.com/api/record/getRe?callback=callback&uid=${userId}&type=3&st=novel&json=${encodeURIComponent(json)}`);
    }

    const bookmark = GM_getValue('bookmark', {});
    console.log(current);
    bookmark[id] = {
      time: Date.parse(new Date()) / 1000,
      name: bookmark[id].name,
      volumeId: current[0],
      volumeName: current[1],
      chapterId: current[2],
      chapterName: current[3],
    };
    GM_setValue('bookmark', bookmark);
  });
}

async function forRecommend() {
  let result = await xhrSync('//v3api.dmzj.com/novel/recommend.json');
  result = JSON.parse(result.response);
  console.log(result);
  let html = '';
  for (const item of result) {
    html = `${html}<div class="flex-row-center" style="flex-wrap:wrap;">`;
    html = `${html}<div><div class="box">${item.title}</div></div>`;
    for (const i of item.data) {
      html = `${html}<div class="flex-row-center box">`;
      // 左侧
      html = `${html}<div class="flex-column-center">`;
      html = `${html}<img class="cover" src="${i.cover}">`;
      html = `${html}<a href="/${i.obj_id}/index.shtml" target="_blank"><span>${i.title}</span></a>`;
      html = `${html}</div>`;
      // 右侧
      html = `${html}<div class="flex-column">`;
      if (i.sub_title) html = `${html}<span>${i.sub_title}</span>`;
      html = `${html}<span>状态: ${i.status}</span>`;
      html = `${html}</div>`;

      html = `${html}</div>`;
    }
    html = `${html}</div>`;
  }
  document.title = '推荐';
  $('body').html(html);
}

async function forUpdate() {
  document.title = '最近更新';
  $('body').html('<div class="result flex-row" style="flex-wrap:wrap;"></div><div class="page"></div>');
  const { page } = formatSearch(window.location.search);
  await updateResult(page);

  async function updateResult(page = 0) {
    window.history.pushState(null, null, `?page=${page}`);
    let result = await xhrSync(`//v3api.dmzj.com/novel/recentUpdate/${page}.json`);
    result = JSON.parse(result.response);
    let html = '';
    for (const i of result) {
      html = `${html}<div class="flex-row-center box">`;
      // 左侧
      html = `${html}<div class="flex-column-center">`;
      html = `${html}<img class="cover" src="${i.cover}">`;
      html = `${html}<a href="/${i.id}/index.shtml" target="_blank"><span>${i.name}</span></a>`;
      html = `${html}</div>`;
      // 右侧
      html = `${html}<div class="flex-column">`;
      html = `${html}<span>作者: ${i.authors}</span>`;
      html = `${html}<span>最近更新: <a href="/${i.id}/${i.last_update_volume_id}/${i.last_update_chapter_id}.shtml" target="_blank">${i.last_update_volume_name} - ${i.last_update_chapter_name}</a></span>`;
      html = `${html}<span>更新时间: ${new Date(i.last_update_time * 1000).toLocaleString(navigator.language, { hour12: false })}</span>`;
      html = `${html}<span>状态: ${i.status}</span>`;
      html = `${html}<span>标签: ${i.types.join('/')}</span>`;
      html = `${html}</div>`;

      html = `${html}</div>`;
    }
    $('.result').html(html);

    let htmlPage = '';
    if (page > 0) htmlPage = `${htmlPage}<a class="aLike prev">上一页</a>`;
    htmlPage = `${htmlPage}<a class="aLike next">下一页</a>`;
    $('.page').html(htmlPage);
    $('.prev').on({
      click: () => updateResult(page * 1 - 1),
    });
    $('.next').on({
      click: () => updateResult(page * 1 + 1),
    });
  }
}

async function forSearch() {
  document.title = '搜索';
  $('body').html('<div class="flex-column-center"><div class="flex-row"><input class="search" type="keyword" placeholder="输入关键词搜索" style="margin: 0 10px;"><input class="apply" type="button" value="搜索"></div><div><div class="fuzzy"></div></div></div><div class="result flex-row" style="flex-wrap:wrap;"></div><div class="page"></div>');
  $('.search').on({
    keyup: (e) => {
      if (e.keyCode === 13) {
        updateResult($('.search').val());
      } else if ($('.search').val()) updateFuzzy($('.search').val());
    },
  });
  $('.apply').on({
    click: () => updateResult($('.search').val()),
  });

  const { s: keyword, page } = formatSearch(window.location.search);
  if (keyword) updateResult(keyword, page);

  async function updateResult(keyword, page = 0) {
    window.history.pushState(null, null, `?s=${encodeURIComponent(keyword)}&page=${page}`);
    let result = await xhrSync(`//v3api.dmzj.com/search/show/1/${keyword}/${page}.json`);
    result = JSON.parse(result.response);
    let html = '';
    for (const i of result) {
      html = `${html}<div class="flex-row-center box">`;
      // 左侧
      html = `${html}<div class="flex-column-center">`;
      html = `${html}<img class="cover" src="${i.cover}">`;
      html = `${html}<a href="/${i.id}/index.shtml" target="_blank"><span>${i.title}</span></a>`;
      html = `${html}</div>`;
      // 右侧
      html = `${html}<div class="flex-column">`;
      html = `${html}<span>作者: ${i.authors}</span>`;
      html = `${html}<span>人气: ${i.hot_hits}</span>`;
      html = `${html}<span>最近更新: ${i.last_name}</span>`;
      html = `${html}<span>状态: ${i.status}</span>`;
      html = `${html}<span>标签: ${i.types}</span>`;
      html = `${html}</div>`;

      html = `${html}</div>`;
    }
    if (result.length === 0) html = '未找到相关小说';
    $('.result').html(html);

    let htmlPage = '';
    if (page > 0) htmlPage = `${htmlPage}<a class="aLike prev">上一页</a>`;
    if (result.length === 10) htmlPage = `${htmlPage}<a class="aLike next">下一页</a>`;
    $('.page').html(htmlPage);
    $('.prev').on({
      click: () => updateResult($('.search').val(), page * 1 - 1),
    });
    $('.next').on({
      click: () => updateResult($('.search').val(), page * 1 + 1),
    });
  }

  async function updateFuzzy(keyword) {
    let result = await xhrSync(`//v3api.dmzj.com/search/fuzzy/1/${keyword}.json`);
    result = JSON.parse(result.response);
    let html = '<ul>';
    for (const i of result) {
      html = `${html}<ol>`;
      html = `${html}<a href="/${i.id}/index.shtml" target="_blank"><span>${i.title}</span></a>`;
      html = `${html}<a class="aLike putin" name="${i.title}">\u25e2</a>`;
      html = `${html}</ol>`;
    }
    html = `${html}</ul>`;
    if (result.length === 0) html = '未找到相关小说';
    $('.fuzzy').html(html).show();
    $('.putin').on({
      click: (e) => {
        $('.search').val($(e.target).attr('name'));
        $('.fuzzy').hide();
      },
    });
  }
}

function xhrSync(url, parm = null, opt = {}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: parm ? 'POST' : 'GET',
      url,
      data: parm instanceof Object ? Object.keys(parm).map((i) => `${i}=${parm[i]}`).join('&') : parm,
      timeout: opt.timeout || 60 * 1000,
      responseType: ['arraybuffer', 'blob', 'json'].includes(opt.responseType) ? opt.responseType : null,
      headers: opt.headers || {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      onload(res) {
        resolve(res);
      },
      ontimeout(res) {
        reject(res);
      },
      onerror(res) {
        reject(res);
      },
    });
  });
}

function formatSearch(text) {
  const arr = text.replace(/^\?/, '').split('&');
  const obj = {};
  for (const i of arr) {
    const t = i.split('=');
    obj[t[0]] = decodeURIComponent(t[1]);
  }
  return obj;
}

async function updateBookmark() {
  const now = new Date().getTime();
  const last = GM_getValue('update', 0);
  if (now - last < 60 * 60 * 1000) return;
  const userId = $.cookie('my').split('|')[0];
  if (!userId) return;
  const res = await xhrSync(`//interface.dmzj.com/api/getReInfo/novel/${userId}/0`);
  try {
    const bookmark = JSON.parse(res.response);
    console.log(bookmark);
    const bookmarkLocal = GM_getValue('bookmark', {});
    for (const i of bookmark) {
      if (!(i.lnovel_id in bookmarkLocal) || i.viewing_time > bookmarkLocal[i.lnovel_id].time) { // 保留网上的记录
        bookmarkLocal[i.lnovel_id] = {
          time: i.viewing_time,
          name: i.novel_name,
          volumeId: i.volume_id,
          volumeName: i.volume_name,
          chapterId: i.chapter_id,
          chapterName: i.chapter_name,
        };
      }
    }
    GM_setValue('bookmark', bookmarkLocal);
    GM_setValue('update', now);
    window.location.reload();
  } catch (error) {}
}

(async function () {
  const html = $('body').html();
  $('body').html('<div class="loading" style="width:120px;height:120px;"></div>').addClass('flex-column-center');
  addStyle();

  await updateBookmark();
  if (window.location.href.match(/xs.dmzj.com\/\d+\/index.shtml/)) {
    await forIndex();
  } else if (window.location.href.match(/xs.dmzj.com\/\d+\/\d+\/\d+.shtml/)) {
    await forRead();
  } else if (window.location.href.match(/xs.dmzj.com\/recommend.shtml/)) {
    await forRecommend();
  } else if (window.location.href.match(/xs.dmzj.com\/update.shtml/)) {
    await forUpdate();
  } else if (window.location.href.match(/xs.dmzj.com\/tags\/search.shtml/)) {
    await forSearch();
  } else {
    $('body').html(html);
  }

  const htmlNav = [
    '<div class="nav"><ul class="flex-row">',
    '<li><a href="/recommend.shtml" target="_blank">推荐</a></li>',
    '<li><a href="/update.shtml" target="_blank">最近更新</a></li>',
    '<li><a href="/tags/search.shtml" target="_blank">搜索</a></li>',
    '</ul></div>',
  ].join('');
  $('body').prepend(htmlNav);
}());
