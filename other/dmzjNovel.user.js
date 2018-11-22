// ==UserScript==
// @name        [dmzj]Novel
// @description 在动漫之家上看小说
// @include     http*://xs.dmzj.com/*
// @version     1.0.0.1542891920935
// @Date        2018-11-22 21:05:20
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://static.dmzj.com/public/js/jquery-1.8.2.min.js
// @require     https://static.dmzj.com/public/js/jquery.cookie.js
// ==/UserScript==
function addStyle () {
  let style = [
    // common
    '.flex-center{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:center;align-items:center;}',
    '.flex-column-center{display:flex;flex-direction:column;align-items:center;}',
    '.loading{border:16px solid #f3f3f3;border-radius:50%;border-top:16px solid #3498db;animation:spin 2s linear infinite}',
    '@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}',
    // forIndex
    '.subscribe_num{height:25px;line-height:25px;margin:5px 0;text-align:center;}',
    '.subscribe_num span{color:#f30;}',
    '.cartoon_online_button{height:auto!important;}',
    '.cartoon_online_button>li{overflow:hidden;float:none!important;display:inline-block;}',
    // forRead
    '.content img{margin:10px 0;}',
    '.footer>a{margin:0 15px;font-size:larger;text-decoration:none;color:#065488;}'
  ]
  $('<style></style>').html(style).appendTo('head')
}

async function forIndex () {
  let id = window.location.href.split('/')[3]
  let info = await xhrSync(`https://v3api.dmzj.com/novel/${id}.json`)
  document.title = info.name

  info = JSON.parse(info.response)
  let html = [
    // 右侧
    `<div class="middleright">`,
    `  <div class="middleright_mr">`,
    `    <div class="odd_anim_title">`,
    `      <div class="odd_anim_title_l"></div>`,
    `      <div class="odd_anim_title_m">`,
    `        <span class="anim_title_text"><a href="" target="_blank"><h1>${info.name}</h1></a></span>${info.status}&nbsp;(&nbsp;最新收录：<a id="newest_volume" target="_blank">${info.last_update_volume_name}</a>&nbsp;<a id="newest_chapter" target="_blank">${info.last_update_chapter_name}</a>)`,
    `      </div>`,
    `      <div class="odd_anim_title_r"></div>`,
    `    </div>`,
    `    <div class="photo_part">`,
    `      <div class="h2_title2"><span class="h2_icon h2_icon22"></span><h2>${info.name} 在线小说全集</h2></div>`,
    `    </div>`,
    // 插入目录
    `    <ul class="cartoon_online_button margin_top_10px"></ul>`,
    `    <div class="flex-center"><div class="loading" style="width:60px;height:60px;"></div></div>`,
    // 插入目录
    `  </div>`,
    `  <div class="clearfix"></div>`,
    `  <div class="middleright_mr margin_top_10px">`,
    `    <div class="photo_part">`,
    `      <div class="h2_title2"><span class="h2_icon h2_icon10"></span><h2>${info.name} 详细介绍</h2></div></div>`,
    `      <div class="line_height_content">${info.introduction.replace(/\n/g, '<br>')}</div>`,
    `  </div>`,
    `</div>`,
    // 左侧
    `<div class="left" style="overflow:hidden;">`,
    `  <div class="left_mr">`,
    `    <div class="anim_intro">`,
    `      <div class="intro_top"></div>`,
    `      <div class="week_mend">`,
    `        <div class="week_mend_back">`,
    `          <div class="anim_intro_ptext">`,
    `            <a href target="_blank"><img alt="${info.name}" src="${info.cover}" id="cover_pic"></a>`,
    `          </div>`,
    `          <div class="part_collection">`,
    `            <p class="subscribe_num"><span id="subscribe_num">${info.subscribe_num}</span>人订阅</p>`,
    `          </div>`,
    `          <div class="part_collection">`,
    `          </div>`,
    `          <div class="anim-main_list">`,
    `            <table><tbody>`,
    `              <tr><th>作者：</th><td>${info.authors}</td></tr>`,
    `              <tr><th>地域：</th><td>${info.zone}</td></tr>`,
    `              <tr><th>状态：</th><td>${info.status}</td></tr>`,
    `              <tr><th>人气：</th><td id="hot_hits">${info.hot_hits}℃</td></tr>`,
    `              <tr><th>题材：</th><td>${info.types}</td></tr>`,
    `              <tr><th>最新收录：</th><td><a id="newest_volume" target="_blank">${info.last_update_volume_name}</a>&nbsp;<a id="newest_chapter" target="_blank">${info.last_update_chapter_name}</a><br><span class="update2">${new Date(info.last_update_time * 1000).toLocaleString(navigator.language, { hour12: false })}</span></td></tr>`,
    `            </tbody></table>`,
    `          </div>`,
    `        </div>`,
    `      </div>`,
    `      <div class="week_foot"></div>`,
    `    </div>`,
    `  </div>`,
    `</div>`
  ].join('')
  $('head').append(`<link rel="stylesheet" type="text/css" href="https://manhua.dmzj.com/css/base.css"><link rel="stylesheet" type="text/css" href="https://manhua.dmzj.com/css/style2011.css?t=20131210">`)
  $('body').html('<div class="wrap">' + html + '</div>')

  let volumes = await xhrSync(`https://v3api.dmzj.com/novel/chapter/${id}.json`)
  volumes = JSON.parse(volumes.response)
  for (let volume of volumes) {
    $(`<li class="b2 t1" style="cursor: pointer;" name="${volume.volume_id}" title="${volume.volume_name}">${volume.volume_name}</li>`).appendTo('.cartoon_online_button')
    $(`<div class="cartoon_online_border" name="${volume.volume_id}"><ul>${volume.chapters.map(chapter => `<li><a title="${volume.volume_name} - ${chapter.chapter_name}" href="https://xs.dmzj.com/${id}/${volume.volume_id}/${chapter.chapter_id}.shtml" target="_blank">${chapter.chapter_name}</a></li>`).join('')}</ul><div class="clearfix"></div></div>`).appendTo('.middleright>.middleright_mr:nth-child(1)')
  }
  $('.cartoon_online_border').hide().eq(-1).show()
  $('.cartoon_online_button>li').on({
    click: e => {
      $('.cartoon_online_button>li').removeClass('b1').addClass('b2')
      $(e.target).removeClass('b2').addClass('b1')
      $('.cartoon_online_border').hide().filter(`[name="${$(e.target).attr('name')}"]`).show()
    }
  }).eq(-1).removeClass('b2').addClass('b1')

  $('.cartoon_online_button+.flex-center').remove()
}

async function forRead () {
  let { 1: id, 2: volumeId, 3: chapterId } = window.location.href.match(/xs.dmzj.com\/(\d+)\/(\d+)\/(\d+).shtml/)
  let content = await xhrSync(`http://v3api.dmzj.com/novel/download/${id}_${volumeId}_${chapterId}.txt`)
  console.log(content)
  let html = [
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
    '    <option value="7" color="#000" background="url(\'http://qidian.gtimg.com/qd/images/read.qidian.com/theme/body_theme1_bg_2x.0.3.png\')">起点牛皮纸（深色）</option>',
    '    <option value="8" color="#000" background="url(\'http://qidian.gtimg.com/qd/images/read.qidian.com/theme/theme_1_bg_2x.0.3.png\')">起点牛皮纸（浅色）</option>',
    '    <option value="9" color="#666" background="#111 url(\'https://qidian.gtimg.com/qd/images/read.qidian.com/theme/theme_6_bg.45ad3.png\') repeat">起点黑色</option>',
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
    '<div class="content">',
    content.response.replace(/<br ?\/>/g, '').split(/[\r\n]/).filter(i => i).map(i => `<p>\u3000\u3000${i}</p>`).join(''),
    '</div>',
    '<div class="footer"></div>'
  ].join('')
  $('body').addClass('flex-column-center').html(html)
  $('.content').css({
    'font-size': '18px',
    'font-family': '微软雅黑,宋体,黑体,楷体',
    'line-height': '2em',
    width: '800px'
  })
  $('.header>select[name="color"]').on({
    change: e => {
      let target = e.target.options[e.target.selectedIndex]
      $('body').css('color', $(target).attr('color')).css('background', $(target).attr('background'))

      let settings = GM_getValue('settings', {})
      settings['color'] = e.target.selectedIndex
      GM_setValue('settings', settings)
    }
  })
  $('.header>.style').on({
    change: e => {
      let name = e.target.name
      let value = e.target.value || e.target.placeholder
      $('.content').css(name, value)
      let settings = GM_getValue('settings', {})
      settings[name] = value
      GM_setValue('settings', settings)
    }
  })

  let settings = GM_getValue('settings', {})
  for (let i in settings) {
    $(`.header>[name=${i}]`).val(settings[i]).trigger('change')
  }

  let volumes = await xhrSync(`https://v3api.dmzj.com/novel/chapter/${id}.json`)
  volumes = JSON.parse(volumes.response)
  volumes = volumes.map(i => i.chapters.map(j => [i.volume_id, i.volume_name, j.chapter_id, j.chapter_name]))
  volumes = [].concat.apply([], volumes)
  let current, index, prev, next
  current = volumes.filter(i => i[0] === volumeId * 1 && i[2] === chapterId * 1)[0]
  index = volumes.indexOf(current)
  prev = index > 0 ? volumes[index - 1] : null
  prev = prev ? `<a href="/${id}/${prev[0]}/${prev[2]}.shtml" title="${prev[1]} - ${prev[3]}">上一章</a>` : '<a href="#">此为第一章</a>'
  next = index < volumes.length - 1 ? volumes[index + 1] : null
  next = next ? `<a href="/${id}/${next[0]}/${next[2]}.shtml" title="${next[1]} - ${next[3]}">下一章</a>` : '<a href="#">此为最后一章</a>'
  $('.footer').html(`${prev} | <a href="/${id}/index.shtml" target="_blank">目录</a> | ${next}`)

  $(window).one('scroll', e => {
    let cookie = document.cookie.split(/;\s{0,}/).map(i => i.split('='))
    let my = cookie.filter(i => i[0] === 'my')
    console.log(cookie, my)
    if (my.length) {
      let userId = decodeURI(my[0][1]).split('|')[0]
      let json = JSON.stringify([{
        'volume_id': volumeId,
        'chapter_id': chapterId,
        'time': Date.parse(new Date()) / 1000,
        'total_num': 0,
        'lnovel_id': id,
        'page': 0
      }])
      json[id] = chapterId
      xhrSync(`//interface.dmzj.com/api/record/getRe?callback=callback&uid=${userId}&type=3&st=novel&json=${encodeURIComponent(json)}`)
    }
  })
}

function xhrSync (url, parm = null, opt = {}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: parm ? 'POST' : 'GET',
      url: url,
      data: parm instanceof Object ? Object.keys(parm).map(i => i + '=' + parm[i]).join('&') : parm,
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

(async function () {
  let html = $('body').html()
  $('body').html('<div class="loading" style="width:120px;height:120px;"></div>').addClass('flex-center')
  addStyle()
  if (window.location.href.match(/xs.dmzj.com\/\d+\/index.shtml/)) {
    await forIndex()
  } else if (window.location.href.match(/xs.dmzj.com\/\d+\/\d+\/\d+.shtml/)) {
    await forRead()
  } else {
    $('body').html(html)
  }
  $('body').removeClass('flex-center')
})()
