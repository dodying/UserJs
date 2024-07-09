/* eslint-env browser */
// ==UserScript==
// @name        [NH]Enhance
// @version     1.0.5
// @modified    2022-03-26 20:15:52
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @include     https://nhentai.net/*
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_getResourceText
// @grant       GM_xmlhttpRequest
// @connect     *
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @resource EHT https://kgithub.com/dodying/UserJs/raw/master/E-hentai/EHT.json?v=1522933172772
// @run-at      document-end
// @compatible  firefox 52+(ES2017)
// @compatible  chrome 55+(ES2017)
// ==/UserScript==

const CONFIG = GM_getValue('config', {});
const EHT = JSON.parse(GM_getResourceText('EHT')).dataset;
const tag = {
  name: 'tag',
  cname: [{ type: 0, text: '标签' }],
  tags: [],
};
const category = EHT.filter((j) => j.name === 'reclass')[0];
category.name = 'category';
category.cname = [{ type: 0, text: '分类' }];
['female', 'male', 'misc'].forEach((i) => {
  const filtered = EHT.filter((j) => j.name === i)[0];
  tag.tags = tag.tags.concat(filtered.tags);
  EHT.splice(EHT.indexOf(filtered), 1);
});
tag.tags = tag.tags.filter((i) => i.name).sort((a, b) => (a.name > b.name ? 1 : a.name === b.name ? 0 : -1));
for (let i = 0; i < tag.tags.length - 1; i++) {
  if (tag.tags[i].name === tag.tags[i + 1].name) {
    tag.tags.splice(i, 1);
    i = i - 1;
  }
}
EHT.push(tag);

async function init() {
  addStyle(); // 添加样式
  $('<div class="nhNavBar" style="bottom:0;"><div></div><div></div><div></div></div>').appendTo('body');
  $(window).on({
    scroll: () => {
      $('.nhNavBar').attr('style', $(window).scrollTop() >= 30 && $('.ido').length === 0 ? 'top:0;' : 'bottom:0;');
    },
  });
  if ($('#cover').length) { // 信息页
    changeName('#info>h1,#info>h2'); // 修改本子标题（移除集会名）
    document.title = $('#info>h1').text();
    tagTranslate(); // 标签翻译
    btnAddFav(); // 按钮 -> 加入黑名单
    btnSearch(); // 按钮 -> 搜索(信息页)
    tagEvent(); // 标签事件
    copyInfo(); // 复制信息
  } else {
    if ($('[name="q"]').val()) document.title = translateText($('[name="q"]').val());
    changeName('.caption'); // 修改本子标题（移除集会名）
    $('<div class="nhContainer"></div>').insertAfter('.gallery>.cover');
    btnAddFav(); // 按钮 -> 加入黑名单
    btnSearch2(); // 按钮 -> 搜索(搜索页)
    if (CONFIG.checkExist) checkExist(); // 检查本地是否存在
    const gmetadata = await getInfo();
    window.gmetadata = gmetadata;
    tagPreview(gmetadata); // 标签预览
    hideGalleries(gmetadata); // 隐藏某些画集
    if (CONFIG.checkExistAtStart) $('input:button[name="checkExist"]').click();
    autoComplete(); // 自动填充
    checkForNew(gmetadata); // 检查有无新本子
  }
  highlightBlacklist(); // 高亮黑名单相关的画廊(通用)
  showConfig();
  searchInOtherSite();
  if (CONFIG.saveLink) saveLink(); // 保存链接
  showTooltip(); // 显示提示
  $('body').on('mousedown', '[copy]', (e) => {
    e.preventDefault();
    const copy = $(e.target).attr('copy');
    setNotification(copy, '已复制');
    GM_setClipboard(copy);
  }).on('contextmenu', 'input[type="button"]', () => false);
}

function addStyle() { // 添加样式
  // backgroundColor = #0d0d0d;
  $('<style></style>').text([
    '.menu>li>a{padding:0 5px!important;}',
    'input[type="number"]{width:60px;border:1px solid #B5A4A4;margin:3px 1px 0;padding:1px 3px 3px;border-radius:3px;}',
    '[copy]{cursor:pointer;}',
    '.nhHighlight{color:#0f0;background-color:#000;}',
    '.nhTooltip{display:none;white-space:nowrap;position:fixed;text-align:left;z-index:99999;border:2px solid #8d8d8d;background-color:#0d0d0d;}',
    '.nhTooltip>ul{margin:0;}',
    '.nhNavBar{display:flex;width:99%;background-color:#0d0d0d;position:fixed;z-index:1000;padding:0 10px;}',
    '.nhNavBar>div{flex-grow:1;}',
    '.nhNavBar>div:nth-child(1){text-align:left;}',
    '.nhNavBar>div:nth-child(2){text-align:center;}',
    '.nhNavBar>div:nth-child(3){text-align:right;}',
    '.ehSites{display:inline-block;}',
    '.ehSites>a{display:none!important;}',
    '.ehSites>a:nth-child(1),.ehSites:hover>a{display:list-item!important;list-style:none;}',
    '.ehSites>a>img{margin:-3px 0!important;height:16px!important;width:16px!important;}',
    '.nhConfig{position:fixed;top:50px;left:0;width:calc(100% - 2px);max-height:calc(100% - 61px);border:solid 1px black;z-index:11;overflow:auto;background-color:#0d0d0d;}',
    '.nhConfig>ul{text-align:left;}',
    '.nhBlacklist{color:#000;background-color:#000;}',
    '.nhBlacklist:hover{color:inherit;background-color:inherit;}',
    '.nhSearch label{display:inline;margin:0 4px;}',
    '.nhTagNotice{float:left;margin:1px;}',
    '.nhTagNotice[name="Unlike"],.tag[name="Unlike"]{color:#f00!important;background-color:#00f!important;}',
    '.nhTagNotice[name="Alert"],.tag[name="Alert"]{color:#ff0!important;background-color:#080!important;}',
    '.nhTagNotice[name="Like"],.tag[name="Like"]{color:#000!important;background-color:#0ff!important;}',
    '.nhTagEvent{display:none;font-weight:bold;margin:0 -10px;}',
    '.nhTagEvent::before{margin-left:10px;content:attr(name);}',
    '.nhTagEvent>a{cursor:pointer;text-decoration:none;margin:0 6px;}',
    '.nhTagEvent>a::before{margin-left:10px;margin-right:2px;}',
    '.nhTagEvent>.nhTagEventNotice[on="true"]::after{content:attr(name);}',
    '.nhTagEvent>.nhTagEventNotice[on="false"]::after{content:"NOT " attr(name);}',
    '.btnAddFav{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVQ4ja2TSwrDMAxERyNvEgg9jFdC25y9tMdpcwB3k4/j2GkoFQiMkZ9GHwPAE0D60R84CxCR1U/itkNmYmZdjLE3sw6A4GhNAN19GMd4c/cBACuPsSgsAeXj9+ylkeQBIJXMtfLo7oOq7gFm1lVkN8sjufVARFKMsc9kVzuuyilLsgfM3WYLEIImVX3VyltqaY6qMZXTPVgBIWhqjPQrgKqcCtkHdS3AlWX6/yYmAIlkUtWUzbnq+SY+lsuLvy+Lw/0DpJalxJ3rpocAAAAASUVORK5CYII=);}',
    '.btnSearch{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVQ4jX1TvW7iQBBeJCLBPQOF66PwzuwWRjTrwjUVz8Aj2D2iRLmTsJLIut4UfgCfkIJ0D0ARUkR5AlMvLrJSvmvAR0wuI02xs/N98y9ES5hZMfMDM78S0dtJX4joTkop2/6NKKW+EdEvpRS+UiK6HwwG/SuwlPLPpaPWClpraH1NIqV89DyvJ4ToCCGEaEeezWYoigLb7RZ5nmM6nV6RMHNqjOkKZlaXH1mWwVqL/X6PzWaDqqrgnEOSJGhn6Ps+CWZ+uIxsrcVyuWwcgyBAWZao6xpRFJ3AGlprMPNKMPPrmbEoCuz3+6t0wzCEcw6LxaIBa63AzM+CiN7OrNvtFpvN5tPuV1WFNF01BKeJ1BcECnmeo6oqBEHwATyZTGCtRRzHDfhEcBRE9HI2TKdTOOdQliXCMGzAu90Oh8MB4/G4Pc4nQUR3l8YkSVDXNZxzqKoK1locDgccj0fkef4hA2a+FVJK2a43iiIsFguk6QpxHGM8HmO9XgMAsiw7g9+Hw+H38yLdt0n+dVs37yzLMJ/PoZSC7/s/m00cDAZ9KeXj/8CfrPJvz/N6xphucw+e5/WYOf3qBpj5nZl/eJ7XG41GfaXUzeVNdYwxXd/3iZlXzPxMRDURHaWUT8x8e6q5Y4zpKqVujDHdv6rJoiTHuLTjAAAAAElFTkSuQmCC);}',
    '.nhTagPreview{position:fixed;padding:5px;display:none;z-index:999999;font-size:larger;width:250px;border-color:#000;border-style:solid;color:#fff;background-color:#34353b;}',
    '.nhTagPreviewLi{color:#c9ba67;}',
    '.nhTagPreviewLi[name="language"]::before{content:"语言: ";}',
    '.nhTagPreviewLi[name="category"]::before{content:"分类: ";}',
    '.nhTagPreviewLi[name="artist"]{font-size:larger;color:#008000;}',
    '.nhTagPreviewLi[name="artist"]::before{content:"漫画家: ";}',
    '.nhTagPreviewLi[name="group"]{font-size:larger;color:#00fff5;}',
    '.nhTagPreviewLi[name="group"]::before{content:"组织: "}',
    '.nhTagPreviewLi[name="parody"]{font-size:larger;color:#ff0;}',
    '.nhTagPreviewLi[name="parody"]::before{content:"同人: ";}',
    '.nhTagPreviewLi[name="character"]::before{content:"角色: ";}',
    '.nhTagPreviewLi[name="tag"]::before{content:"属性: ";}',
    '.nhTagPreviewLi>span{display:inline;margin:0 2px;border:1px #456F78 solid;}',
    '.nhDatalist{display:none;overflow-y:auto;max-height:300px;}',
    '.nhDatalist>ol{list-style:decimal;text-align:left;}',
    '.nhDatalist>ol>li{cursor:pointer;}',
    '.nhDatalist>ol>li::after{content:"  "attr(cname);font-size:9pt;font-weight:bold;}',
    '.nhDatalistHover{color:#f00;font-weight:bold;font-size:large;}',
    '.nhContainer{width:220px;min-height:5px;margin:auto;}',
    '.nhExistContainer{float:left;max-width:240px;max-height:20px;overflow:auto;}',
    '.nhExistContainer::-webkit-scrollbar{height:2px;width:2px;}',
    '.nhExistContainer::-webkit-scrollbar-track{background:#ddd;}',
    '.nhExistContainer::-webkit-scrollbar-thumb{background:#666;}',
    '.nhExist{display:inline-block;color:#fff;background:#000;border:black 1px solid;cursor:pointer;margin:1px;}',
    '.nhExist::before{content:attr(fileSize) "M";}',
    '.nhExist[name="force"]{color:#0f0;}',
    '.nhExist[name="force1"]{color:#00f;}',
    '.nhExist[name="incomplete"]{color:#f00;background:#00f;}',
    '.nhCheckTableContainer{position:fixed;top:33px;left:0;width:calc(100% - 2px);height:calc(100% - 61px);border:solid 1px black;z-index:10;background-color:#0d0d0d;}',
    '.nhCheckTableContainer>div{overflow:auto;}',
    '.nhCheckTable{counter-reset:checkOrder;height:calc(100% - 42px);}',
    '.nhCheckTable>table{margin:0 auto;border-collapse:collapse;}',
    '.nhCheckTable th,.nhCheckTable td{border:2px ridge #000;}',
    '.nhCheckTable tr>td:nth-child(1)::before{counter-increment:checkOrder;content:counter(checkOrder);}',
    '.nhCheckTable a{text-decoration:none;}',
    '.nhPages>a{display:inline;margin:0 1px;cursor:pointer;}',
    '.nhPages>a::before{content:attr(name)}',
    '.nhPagesHover{color:red;font-weight:bold;}',
  ].join('\n')).appendTo('head');
}

function autoComplete() { // 自动填充
  let main = (CONFIG.acItem || 'language,artist,parody,character,group,tag').split(',');
  main = EHT.filter((i) => main.includes(i.name));
  $('<div class="nhDatalist"><ol start="0"></ol></div>').on('click', 'li', (e) => {
    const value = $('[name="q"]').val().split(/\s+/);
    value[value.length - 1] = e.target.textContent;
    $('[name="q"]').val(value.filter((i) => i).join(' ')).focus();
    $('.nhDatalist>ol').empty();
    $('.nhDatalist').show();
  }).appendTo('form:has([name="q"])');
  let lastValue;
  $('[name="q"]').attr('title', `当输入大于${CONFIG.acLength || 0}个字符时，显示选单<br>使用主键盘区的数字/加减/方向键快速选择<br>点击/Enter/Insert键填充<br>使用输入法时，无法使用数字/加减选择`).on({
    focusin() {
      $('.nhDatalist').show();
    },
    focusout() {
      setTimeout(() => {
        $('.nhDatalist').hide();
      }, 100);
    },
    keydown(e) {
      const hasItem = $('.nhDatalist li').length;
      let onItem = $('.nhDatalistHover').index();
      if (hasItem && e.keyCode <= 57 && e.keyCode >= 48) { // 选择选项: 0-9
        e.preventDefault();
        $('.nhDatalist li').eq(e.keyCode - 48).click();
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
        $('.nhDatalist li').removeClass('nhDatalistHover');
        $('.nhDatalist li').eq(onItem).addClass('nhDatalistHover');
        $('.nhDatalist').scrollTop($('.nhDatalistHover').position().top - $('.nhDatalist>ol').position().top - 150 + $('.nhDatalistHover').height() / 2);
      } else if (onItem >= 0 && [13, 45].includes(e.keyCode)) { // 选择选项: Insert
        e.preventDefault();
        $('.nhDatalistHover').click();
      }
    },
    keyup(e) {
      let value = e.target.value.split(/\s+/);
      value = value[value.length - 1];
      if (value === lastValue) return;
      $('.nhDatalist>ol').empty();
      if (!value || (value.length <= (CONFIG.acLength || 0) && !value.match(/[\u4e00-\u9fa5]/))) return;
      lastValue = value;
      value = new RegExp(value, 'i');
      main.forEach((i) => {
        i.tags.filter((j) => j.name && (j.name.match(value) || combineText(j.cname, true).match(value))).forEach((j) => {
          $(`<li cname="${combineText(j.cname, true)}">${i.name}:"${j.name}"</li>`).appendTo('.nhDatalist>ol');
        });
      });
      $('.nhDatalist').show();
    },
  });
}

function btnAddFav() { // 按钮 -> 加入黑名单
  $('<div class="btnAddFav" title="加入黑名单/从黑名单中移除"></div>').on({
    contextmenu: () => false,
    mousedown: (e) => {
      let keyword = $('#info>h1').length ? $('#info>h1').text() : $(e.target).parentsUntil('.index-container').find('.caption').text();
      keyword = window.prompt('请输入加入黑名单或从黑名单中移除的关键词', keyword);
      if (keyword) toggleBlacklist(keyword.trim());
      highlightBlacklist();
    },
  }).appendTo('.nhContainer,.buttons');
}

function btnSearch() { // 按钮 -> 搜索(信息页)
  let text = $('#info>h1').text() || $('#info>h2').text();
  if (text === '') return;
  $('<div class="nhSearch"></div>').insertBefore('#tags');
  text = text.split(/[[\](){}【】|\-\d]+/);
  for (let i = 0; i < text.length; i++) {
    text[i] = text[i].trim();
    if (text[i]) $('<span></span>').html(`<input id="nhSearch_${i}" type="checkbox"><label for="nhSearch_${i}">${text[i]}</label>`).appendTo('.nhSearch');
  }
  $('<input class="btn btn-primary" type="button" value="Search" title="搜索">').appendTo('.nhSearch').click(() => {
    const keyword = $('.nhSearch input:checked+label').toArray().map((i) => `"${i.textContent}"`).join(' ');
    if (keyword.length > 0) openUrl(`/search/?q=${encodeURIComponent(keyword)}`);
  });
}

function btnSearch2() { // 按钮 -> 搜索(搜索页)
  $('<div class="btnSearch"></div>').attr('title', CONFIG.searchEventChs).appendTo('.nhContainer').on({
    contextmenu: () => false,
    mousedown: (e) => {
      const event = CONFIG.searchEvent.split('|').filter((i) => i.match(new RegExp(`^${e.button},`)));
      for (let i = 0; i < event.length; i++) {
        const arr = event[i].split(',');
        const keydown = arr[1] === '-1' ? true : e[['altKey', 'ctrlKey', 'shiftKey'][arr[1]]];
        if (keydown) {
          let name;
          const id = $(e.target).parentsUntil('.index-container').eq(-1).find('.cover')
            .attr('href')
            .match(/\d+/)[0] * 1;
          const tags = window.gmetadata.filter((i) => i.id * 1 === id)[0].tags.map((i) => `${i.type}:"${i.name}"`);
          if (arr[2] === '-1') {
            const order = window.prompt(tags.map((i, j) => `${j}: ${translateText(i)}`).join('\n'));
            if (order) {
              name = tags[order];
            } else {
              return;
            }
          } else if (arr[2] === '0') {
            name = $(e.target).parentsUntil('.index-container').eq(-1).find('.caption')
              .text();
            name = name.replace(/\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）|-|!/g, '').replace(/\|.*/, '').trim();
            name = `"${name}"`;
          } else if (arr[2] === '1' && tags.filter((i) => i.match(/^(artist|group):/)).length) {
            name = tags.filter((i) => i.match(/^artist:/)).length ? tags.filter((i) => i.match(/^artist:/))[0] : tags.filter((i) => i.match(/^group:/))[0];
          } else {
            return;
          }
          if (arr[3] === '1') name = `${name} language:"chinese"`;
          openUrl(`/search/?q=${encodeURIComponent(name)}`);
          if ($(e.target).attr('style')) {
            $(e.target).css('border-width', `${parseInt($(e.target).css('border-width')) + 1}px`);
          } else {
            $(e.target).css('border-color', 'red').css('border-style', 'solid').css('border-width', '1px');
          }
          break;
        }
      }
    },
  });
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
  if (delta <= 1000 * 60 * 60 * 24 * 7) text = `<span class="nhHighlight">${text}</span>`;
  return text;
}

function changeName(e) { // 修改本子标题（移除集会名）
  $(e).toArray().forEach((i) => {
    i.textContent = htmlUnescape(i.textContent).replace(/^\(.*?\)( |)/, '').replace(/\s+/g, ' ').trim();
  });
}

function checkExist() { // 检查本地是否存在
  $('.gallery').toArray().forEach((i) => {
    $('<div class="nhExistContainer"></div>').insertAfter($(i).find('.nhContainer>.btnSearch'));
  });
  $('<input class="btn btn-primary" type="button" name="checkExist" value="Check Exist" title="只检查可见的，且之前检查无结果">').on('click', async (e) => {
    const uselessStrRE = /\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）|～|~/g;
    const langRE = /\[(Chinese|English|Digital)\].*/gi;

    $(e.target).val('Checking').prop('disabled', true);
    const lst = $('.gallery:visible:not(:has(.nhExist[name="force"])) .caption').toArray();
    const name = {};
    lst.forEach((i, j) => {
      if (CONFIG.checkExistName2) {
        name[j] = i.textContent.replace(uselessStrRE, '').replace(/\|.*/g, '').replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '')
          .trim();
      } else {
        const arr = i.textContent.replace(/\|.*?([([{【［（]|$)/, '$1').replace(/[\\/:*?"<>|]/g, '-').replace(langRE, '').split(/[[\](){}【】［］（）～~]+/)
          .map((i) => i.trim().replace(/\.$/, '').trim())
          .filter((i) => i);
        name[j] = arr.join();
        if (name[j] === '') {
          name[j] = i.textContent.replace(uselessStrRE, '').replace(/\|.*/g, '').replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '')
            .trim();
        }
      }
    });
    const res = await xhrSync('http://127.0.0.1:3000/', `names=${encodeURIComponent(JSON.stringify(name))}`, {
      responseType: 'json',
      timeout: 120 * 1000,
    });
    lst.forEach((i, j) => {
      let name = i.textContent;
      let name2 = name.match(/\|.*?([([{【［（]|$)/) ? name.replace(/\|.*?([([{【［（]|$)/, '$1') : name;
      name = name.replace(/[\\/:*?"<>|]/g, '-');
      name2 = name2.replace(/[\\/:*?"<>|]/g, '-');
      const name3 = name.replace(langRE, '').replace(/\.$/, '').trim();
      const name4 = name2.replace(langRE, '').replace(/\.$/, '').trim();
      name = name.replace(/\.$/, '').trim();
      name2 = name.replace(/\.$/, '').trim();
      res.response[j].forEach((k) => {
        if (k.match(/\.jpg$/)) return;
        const fileSize = (k.match(/^([\d,]+)/)[1].replace(/,/g, '') * 1 / 1024 / 1024).toFixed(2);
        const fileName = k.replace(/^[\d,]+\s+/, '');
        const noExt = fileName.replace(/\.(zip|cbz|rar|cbr)$/, '').trim();
        const noExtRE = new RegExp(`^${reEscape(noExt).replace(/_/g, '.')}$`);
        const noLang = noExt.replace(langRE, '').trim();
        const noLangRE = new RegExp(`^${reEscape(noLang).replace(/_/g, '.')}$`);
        const p = $(i).parentsUntil('.index-container').eq(-1).find('.nhExistContainer');
        const _name = (noExtRE.exec(name) || noExtRE.exec(name2)) ? 'force'
          : noExt.match(/\[Incomplete\]/i) ? 'incomplete'
            : (noLangRE.exec(name3) || noLangRE.exec(name4)) ? 'force1' : '';
        const ed = _name === 'force' ? 0 : getEditDistance(noExt, name);
        if (p.find(`[copy="${fileName}"][fileSize="${fileSize}"]`).length === 0) $(`<span class="nhExist" fileSize="${fileSize}" name="${_name}" copy="${fileName}" similar="${ed}" tooltip="EditDistance: ${ed}"></span>`).appendTo(p);
        $(p).find('.nhExist').toArray().sort((a, b) => $(a).attr('similar') * 1 - $(b).attr('similar') * 1)
          .forEach((ele) => $(ele).appendTo(p));
      });
    });
    $(e.target).val('Check Exist').prop('disabled', false);
  }).appendTo('.nhNavBar>div:eq(1)');
}

function checkForNew(gmetadata) { // 检查有无新本子
  $('<li class="desktop"><a href="javascript:;">Add List</a></li>').on({
    contextmenu: () => false,
    mousedown: (e) => {
      e.preventDefault();
      const keyword = $('[name="q"]').val();
      const list = GM_getValue('checkList', {});
      let name;
      let nameInput;
      if (keyword in list && list[keyword].name) name = list[keyword].name;
      if (e.button === 0) {
        if (!name) name = translateText(keyword);
        nameInput = window.prompt(`请输入名称\n留空: ${name}`);
        if (nameInput === null) return;
      }
      $(e.target).remove();
      list[keyword] = {
        time: new Date().getTime(),
        result: $('h1,h2').text().match(/[\d,]+/) ? $('h1,h2').text().match(/[\d,]+/)[0].replace(/,/g, '') * 1 : 0,
      };
      if (nameInput || name !== translateText(keyword)) list[keyword].name = nameInput || name;
      GM_setValue('checkList', sortObj(list, 'time'));
    },
  }).appendTo('.menu.left');

  $('<li class="desktop"><a href="javascript:;">Show List</a></li>').on('click', (e) => {
    if ($('.nhCheckTableContainer').length) {
      $('.nhCheckTableContainer').toggle();
      return;
    }
    $('<div class="nhCheckTableContainer"></div>').html('<div class="nhPages"></div><div class="nhCheckTable"><table><thead><tr><th>#</th><th>Keyword</th><th>Name</th><th><a class="nhCheckTableSort" href="javascript:;" name="time" title="sort by time">Time</a></th><th><a class="nhCheckTableSort" href="javascript:;" name="result" title="sort by result">Result</a></th><th><input name="selectAll" type="checkbox" title="全选"></th></tr></thead><tbody></tbody></table></div><div class="nhCheckTableBtn"></div>').appendTo('body');
    const list = GM_getValue('checkList', {});
    const keys = Object.keys(list);
    const pages = Math.ceil(keys.length / CONFIG.checkListPerPage);
    const getSomeList = (page) => {
      $('.nhCheckTable tbody').empty();
      for (let key = (page - 1) * CONFIG.checkListPerPage; key < page * CONFIG.checkListPerPage; key++) {
        if (key >= keys.length) break;
        const i = keys[key];
        const tr = $('<tr><td></td><td></td><td></td><td></td><td></td><td><input type="checkbox"></td></tr>');
        $('<a target="_blank"></a>').attr('href', `/search/?q=${encodeURIComponent(i)}`).text(i).appendTo($(tr).find('td:eq(1)'));
        $(tr).find('td:eq(2)').text(list[i].name || translateText(i));
        $(tr).find('td:eq(3)').html(`<time title="${new Date(list[i].time).toLocaleString()}" datetime="${list[i].time}">${calcRelativeTime(list[i].time)}</time>`);
        $(tr).find('td:eq(4)').text(list[i].result);
        $(tr).appendTo('.nhCheckTableContainer tbody');
      }
    };
    getSomeList(1);
    if (pages > 1) {
      $('.nhPages').html([...Array(pages).keys()].map((i) => `<a name="${i + 1}"></a>`)).on('click', 'a', (e) => {
        $('.nhPages>a').removeClass('nhPagesHover');
        $(e.target).addClass('nhPagesHover');
        getSomeList(e.target.name);
      });
      $('.nhPages>a[name="1"]').addClass('nhPagesHover');
    }
    $('.nhCheckTable th>input[name="selectAll"]').on('click', (e) => {
      $('.nhCheckTable td>input').prop('checked', e.target.checked);
    });
    $('.nhCheckTable .nhCheckTableSort').on('click', (e) => {
      const list = GM_getValue('checkList', {});
      GM_setValue('checkList', sortObj(list, e.target.name));
      $('.nhCheckTableContainer').remove();
      $('.menu.left>.desktop:contains("Show List")').click();
    });
    $('<input class="btn btn-primary" type="button" value="Select Invert" title="反选">').on('click', () => {
      $('.nhCheckTable td>input').toArray().forEach((i) => {
        i.checked = !i.checked;
      });
    }).appendTo('.nhCheckTableBtn');
    $('<input class="btn btn-primary" type="button" value="Delete" title="移除">').on('click', () => {
      const list = GM_getValue('checkList', {});
      $('.nhCheckTable td>input:checked').toArray().forEach((i) => {
        const keyword = $(i).parentsUntil('tbody').eq(-1).find('td>a')
          .html();
        delete list[keyword];
      });
      GM_setValue('checkList', list);
      $('.nhCheckTableContainer').remove();
    }).appendTo('.nhCheckTableBtn');
    $('<input class="btn btn-primary" type="button" value="Cancel" title="取消">').on('click', () => {
      $('.nhCheckTableContainer').hide();
    }).appendTo('.nhCheckTableBtn');
  }).appendTo('.menu.left');

  const keyword = $('[name="q"]').val();
  if (!keyword) return;
  const list = GM_getValue('checkList', {});
  if (!(keyword in list)) return;
  const info = list[keyword];
  const tr = $('.gallery').toArray();
  let i;
  const { time } = info;
  for (i = 0; i < gmetadata.length; i++) {
    const d = new Date(gmetadata[i].upload_date * 1000);
    if (time > d.getTime()) break;
  }
  const ele = $(`<div class="gallery">Last Check Time: <time title="${new Date(info.time).toLocaleString()}" datetime="${info.time}">${calcRelativeTime(info.time)}</time><br>Results: ${info.result}<div class="caption">Name: ${info.name || translateText(keyword)}</div></div>`);
  if (i === tr.length) {
    ele.insertAfter(tr[i - 1]);
  } else {
    ele.insertBefore(tr[i]);
  }
  const result = $('h1,h2').text().match(/[\d,]+/) ? $('h1,h2').text().match(/[\d,]+/)[0].replace(/,/g, '') * 1 : 0;
  if (result - info.result <= CONFIG.autoUpdateCheck && $('.page.current').text() === '1') {
    list[keyword] = {
      time: new Date().getTime(),
      result,
    };
    if (info.name) list[keyword].name = info.name;
    GM_setValue('checkList', sortObj(list, 'time'));
    setNotification((info.name || translateText(keyword)), 'CheckList updated');
  }
}

function combineText(arr, textOnly = undefined) {
  return arr instanceof Array ? arr.map((i) => {
    if (i.type === 0) {
      return i.text;
    } if (!textOnly && i.type === 2) {
      return `"url("${i.src.replace(/http.?:/g, '')}")"`;
    }
    return null;
  }).filter((i) => i).join('\\A') : '';
}

function copyInfo() { // 复制信息
  if ($('#info>h1').text().match(/\[(.*?)\]/) && $('#info>h2').text().match(/\[(.*?)\]/)) { // artist
    let name = $('#info>h1').text().match(/\[(.*?)\]/)[1];
    let nameJpn = $('#info>h2').text().match(/\[(.*?)\]/)[1];
    if (name.match(/\(.*?\)/)) name = name.match(/\((.*?)\)/)[1];
    if (nameJpn.match(/\(.*?\)/)) nameJpn = nameJpn.match(/\((.*?)\)/)[1];
    $(`<input class="btn btn-primary" type="button" value="[${name}]${nameJpn}" copy="[${name}]${nameJpn}">`).appendTo('.nhNavBar>div:eq(0)');
  }
  if ($('.tag-container:contains("Parodies") a.tag').length > 0) { // parody
    const sub = $('.tag-container:contains("Parodies") a.tag')[0].childNodes[0].textContent.trim();
    let parody = findData('parody', sub, true);
    if (Object.keys(parody).length) {
      parody = parody.cname;
    } else {
      parody = $('#info>h2').text().match(/\(.*?\)/g) ? $('#info>h2').text().match(/\(.*?\)/g) : $('#info>h1').text().match(/\(.*?\)/g);
      if (parody) {
        parody = parody[parody.length - 1].match(/\((.*?)\)/)[1];
      } else {
        return;
      }
    }
    const parodyKeyword = $('.tag-container:contains("Parodies") a.tag')[0].childNodes[0].textContent.trim().replace(/ \| .*/, '');
    $(`<input class="btn btn-primary" type="button" value="【${parody}】${parodyKeyword}" copy="【${parody}】${parodyKeyword}">`).appendTo('.nhNavBar>div:eq(0)');
  }
}

function findData(main, sub, textOnly = true) {
  const data = EHT.filter((i) => i.name === main);
  if (data.length === 0 || data[0].tags.length === 0) return {};
  if (sub === undefined) {
    return {
      name: main,
      cname: combineText(data[0].cname, textOnly),
      info: combineText(data[0].info, textOnly),
    };
  }
  let data1 = data[0].tags.filter((i) => i.name === sub.replace(/_/g, ' '));
  if (data1.length === 0) {
    if (sub.match(' \\| ')) {
      const arr = sub.split(' | ').map((i) => i.replace(/_/g, ' '));
      data1 = data[0].tags.filter((i) => arr.includes(i.name));
    }
  }
  return data1.length ? {
    name: main === 'misc' ? sub : `${main}:${sub}`,
    cname: combineText(data1[0].cname, textOnly),
    info: combineText(data1[0].info, textOnly),
  } : {};
}

function getEditDistance(a, b) { // 获取EditDistance
  // 来源: https://gist.github.com/andrei-m/982927
  /*
  Copyright (c) 2011 Andrei Mackenzie
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}

async function getInfo() { // 获取信息
  const keyword = $('[name="q"]').val() || ($('h1').text() ? `${$('h1>span')[0].textContent}:"${$('h1>span')[1].textContent}"` : null);
  const res = await xhrSync(keyword ? `/api/galleries/search?query=${encodeURIComponent(keyword)}` : 'api/galleries/all', null, {
    responseType: 'json',
  });
  return res.response.result;
}

function hideGalleries(gmetadata) { // 隐藏某些画集
  const tags = {};
  ['Unlike', 'Alert', 'Like'].forEach((i) => {
    const tag = GM_getValue(`tag${i}`, []);
    tags[i] = tag;
  });
  $('.cover').toArray().forEach((i) => {
    const info = gmetadata.filter((j) => j.id * 1 === i.href.split('/')[4] * 1)[0];
    if (!info) return;
    const container = $(i).parentsUntil('.index-container').eq(-1).find('.nhContainer');
    if (info.num_pages * 1 < CONFIG.fewPages) $('<span class="nhTagNotice" name="Unlike" title="页面少">页面少</span>').appendTo(container);
    for (const j in tags) {
      const check = info.tags.filter((k) => tags[j].includes(`${k.type}:${k.name}`));
      if (check.length) {
        check.forEach((k) => {
          const main = k.type;
          const sub = k.name;
          let tagChs = findData(main, sub, true).cname;
          tagChs = tagChs || k;
          $(`<span class="nhTagNotice" name="${j}" title="${k}">${tagChs}</span>`).appendTo(container);
        });
      }
    }
  });
  if (!CONFIG.notHideUnlike) {
    let { length } = $('.gallery').filter(':has(.nhTagNotice[name="Unlike"])').hide();
    if (CONFIG.alwaysShowLike) length = length - $('.gallery').filter(':has(.nhTagNotice[name="Unlike"]):has(.nhTagNotice[name="Like"])').show().length;
    $('#content>h2').html(`${$('#content>h2').html()} 过滤${length}本 `);
    $('<input class="btn btn-primary" type="button" value="Show">').on('click', (e) => {
      if (CONFIG.alwaysShowLike) {
        $('.gallery').filter(':has(.nhTagNotice[name="Unlike"]):not(:has(.nhTagNotice[name="Like"]))').toggle();
      } else {
        $('.gallery').filter(':has(.nhTagNotice[name="Unlike"])').toggle();
      }
      $(e.target).val($(e.target).val() === 'Show' ? 'Hide' : 'Show');
    }).appendTo('#content>h2');
  }
}

function highlightBlacklist() { // 高亮黑名单相关的画廊(通用)
  const blacklist = GM_getValue('blacklist', []);
  $('.caption,#info>h1,#info>h2').toArray().forEach((i) => {
    let title = htmlEscape($(i).text());
    for (const j of blacklist) {
      const re = new RegExp(j, 'gi');
      if (title.match(re)) {
        title = title.replace(re, '<span class="nhBlacklist" copy="$&">$&</span>');
      }
    }
    $(i).html(title);
  });
}

function htmlEscape(text) {
  return text.replace(/["&<>]/g, (match) => ({
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  }[match]));
}

function htmlUnescape(text) {
  return text.replace(/(&.*?;)/g, (match) => ({
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#34;': '"',
    '&#39;': '\'',
    '&#034;': '"',
    '&#039;': '\'',
  }[match]));
}

function openUrl(url) { // 打开链接
  url = (url.match('//') ? '' : window.location.origin) + url;
  if (!CONFIG.openInTab) {
    const popup = window.open(url, '', 'resizable,scrollbars,status');
    if (popup) {
      popup.moveTo(0, 0);
      popup.resizeTo(window.screen.width, window.screen.height);
    }
  } else {
    GM_openInTab(url, true);
  }
}

function reEscape(text) {
  return text.replace(/[$()*+.[\]?^{}|]/g, '\\$&');
}

function saveLink() { // 保存链接
  $('<input class="btn btn-primary" type="button" title="创建链接" value="Shortcut">').click(() => {
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
    const blob = new window.Blob([content[platform].replace('{{url}}', window.location.href)], {
      type: 'application/octet-stream',
    });
    $(`<a href="${URL.createObjectURL(blob)}"></a>`).attr('download', document.title + fileType)[0].click();
  }).prependTo('.nhNavBar>div:eq(2)');
}

function setNotification(title, body) { // 发出桌面通知
  if (window.Notification && window.Notification.permission !== 'denied') {
    window.Notification.requestPermission((status) => {
      if (status === 'granted') {
        const n = (body) ? new window.Notification(title, {
          body,
          tag: GM_info.script.name,
        }) : new window.Notification(title);
        setTimeout(() => {
          if (n) n.close();
        }, 3000);
      }
    });
  }
}

function searchInOtherSite() { // 在其他站点搜索
  const sites = {
    'exhentai.net': {
      url: 'https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_imageset=1&f_cosplay=1&f_sh=on&q={q}',
      icon: '//e-hentai.org/favicon.ico',
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
  let keyword; let
    keywordJ;
  if ($('#info>h1').length) {
    keyword = $('#info>h1').text();
    keywordJ = $('#info>h1').text();
  } else {
    keyword = $('[name="q"]').val();
    keywordJ = $('[name="q"]').val();
  }
  $('<li class="desktop ehSites"></li>').appendTo('.menu.left');
  for (const i in sites) {
    let url;
    if ('url' in sites[i]) {
      url = sites[i].url instanceof Function ? sites[i].url(keyword) : sites[i].url.replace('{q}', keyword);
    } else if ('urlJ' in sites[i]) {
      url = sites[i].urlJ instanceof Function ? sites[i].urlJ(keywordJ) : sites[i].urlJ.replace('{q}', keywordJ);
    }
    $(`<a target="_blank" title="${i}"><img src="${sites[i].icon || `//www.google.com/s2/favicons?domain=${i}`}"></img></a>`).attr('href', url).appendTo('.ehSites');
  }
}

function showConfig() { // 显示设置
  $('<li class="desktop"><a href="javascript:;">[NH]Config</a></li>').on('click', (e) => {
    if ($('.nhConfig').length) {
      $('.nhConfig').toggle();
      return;
    }
    const config = GM_getValue('config', {});
    const _html = [
      '<label for="nhConfig_openInTab"><input type="checkbox" id="nhConfig_openInTab">在新标签页中打开，而不是弹窗</label>',
      '<label for="nhConfig_checkExist"><input type="checkbox" id="nhConfig_checkExist">显示按钮: 检查本地是否存在 (需要后台运行<a href="https://github.com/dodying/Nodejs/blob/master/checkExistSever/index.js" target="_blank">checkExistSever</a>, <a href="https://www.voidtools.com/downloads/#downloads" target="_blank">Everything</a>, 以及下载<a href="https://www.voidtools.com/downloads/#cli" target="_blank">Everything CLI</a>)</label>',
      '<label for="nhConfig_checkExistAtStart"><input type="checkbox" id="nhConfig_checkExistAtStart">检查本地是否存在: 页面载入后检查一次</label>',
      '<label for="nhConfig_checkExistName2"><input type="checkbox" id="nhConfig_checkExistName2">检查本地是否存在: 只搜索主要名称(去除集会号/作者/原作名/翻译组织/语言等)</label>',
      '<label for="nhConfig_saveLink"><input type="checkbox" id="nhConfig_saveLink">显示按钮: 保存链接</label>',
      '<label for="nhConfig_tagTranslateImage"><input type="checkbox" id="nhConfig_tagTranslateImage">标签翻译显示图片</label>',
      '<label for="nhConfig_notHideUnlike"><input type="checkbox" id="nhConfig_notHideUnlike">不隐藏带有厌恶标签的画廊</label>',
      '<label for="nhConfig_alwaysShowLike"><input type="checkbox" id="nhConfig_alwaysShowLike">总是显示带有喜欢标签的画廊</label>',
      '',
      '搜索页搜索按钮事件: <input name="nhConfig_searchEvent" title="事件格式: 鼠标按键,键盘按键,搜索文本,是否中文<br>多个事件以|分割<br>鼠标按键:<ul><li>0 -> 左键</li><li>1 -> 中键</li><li>2 -> 右键</li></ul>键盘按键:<ul><li>-1 -> 任意</li><li>0 -> altKey</li><li>1 -> ctrlKey</li><li>2 -> shiftKey</li></ul>搜索事件:<ul><li>-1 -> 自行选择</li><li>0 -> 主要名称</li><li>1 -> 作者或组织(顺位)</li></ul>是否中文:<ul><li>0 -> 否</li><li>1 -> 是</li></ul>" type="text" placeholder="0,-1,0,0|2,-1,0,1"><input name="nhConfig_searchEventChs" type="hidden">',
      '搜索栏自动完成: 字符数 > <input name="nhConfig_acLength" type="number" placeholder="3" min="0"> 时，显示',
      '搜索栏自动完成显示项目: <input name="nhConfig_acItem" type="text" placeholder="language,artist,parody,character,group,tag" title="以,分割">',
      '隐藏页数 < <input name="nhConfig_fewPages" type="number" placeholder="5" min="1"> 的本子',
      '当结果数目变化 <= <input name="nhConfig_autoUpdateCheck" type="number" placeholder="10" min="0">时, 自动更新Check',
      '每页 <input name="nhConfig_checkListPerPage" type="number" placeholder="25" min="25" max="100"> 条CheckList',
    ].map((i) => (i ? `<li>${i}</li>` : '<hr>')).join('');
    $('<div class="nhConfig"></div>').html(`<ul>${_html}</ul><div class="nhConfigBtn"><input class="btn btn-primary" type="button" name="save" value="Save" title="保存"><input class="btn btn-primary" type="button" name="cancel" value="Cancel" title="取消"></div>`).appendTo('body').on('click', (e) => {
      if ($(e.target).is('.nhConfigBtn>input[type="button"]')) {
        if (e.target.name === 'save') {
          $('.nhConfig input:not([type="button"]),.nhConfig select').toArray().forEach((i) => {
            let name; let
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
            }
            config[name.replace('nhConfig_', '')] = value;
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

          Object.assign(CONFIG, config);
          GM_setValue('config', config);
        }
        $('.nhConfig').remove();
      }
    });
    $('.nhConfig input:not([type="button"]),.nhConfig select').toArray().forEach((i) => {
      let name; let
        value;
      name = i.name || i.id;
      name = name.replace('nhConfig_', '');
      if (!(name in config)) return;
      value = config[name];
      if (i.type === 'text' || i.type === 'hidden' || i.type === 'select-one' || i.type === 'number') {
        i.value = value;
      } else if (i.type === 'checkbox') {
        i.checked = value;
      }
    });
  }).appendTo('.menu.left');
}

function showTooltip() { // 显示提示
  $('<div class="nhTooltip"></div>').appendTo('body');
  let preEle;
  $('body').on('mousemove keydown', (e) => {
    if ((e.target === preEle || $(e.target).parents().filter(preEle).length) && e.type !== 'keydown') return;
    const title = $(preEle).attr('raw-title');
    $(preEle).removeAttr('raw-title').attr('title', title);
    $('.nhTooltip').hide();
  });
  $('body').on('mouseenter', ':visible[title],:visible[raw-title],[copy]', (e) => {
    preEle = e.target;
    let title;
    if ($(preEle).is('[copy]:not([title])')) {
      title = `${$(preEle).attr('tooltip') ? `${$(preEle).attr('tooltip')}<br><br>` : ''}点击复制: <span class="nhHighlight">${$(preEle).attr('copy')}</span>`;
      $(preEle).attr('raw-title', title);
    } else {
      title = $(preEle).attr('title') || $(preEle).attr('raw-title');
      if (!title) {
        preEle = $(preEle).parents().filter('[title]').eq(-1)[0];
        title = $(preEle).attr('title') || $(preEle).attr('raw-title');
      }
      $(preEle).removeAttr('title').attr('raw-title', title);
    }
    $('.nhTooltip').html(title);

    let top = $(preEle).offset().top - $(window).scrollTop();
    const height = $(preEle).height() + parseInt($(preEle).css('padding-bottom')) + parseInt($(preEle).css('border-bottom-width')) + parseInt($(preEle).css('margin-bottom'));
    const _height = $('.nhTooltip').height() + parseInt($('.nhTooltip').css('padding-bottom')) + parseInt($('.nhTooltip').css('border-bottom-width')) + parseInt($('.nhTooltip').css('margin-bottom'));
    top = top + height + 5 + _height > window.innerHeight ? top - _height - 5 : top + height + 5;

    let left = $(preEle).offset().left - $('body').scrollLeft();
    const width = $(preEle).width() + parseInt($(preEle).css('padding-left')) + parseInt($(preEle).css('border-left-width')) + parseInt($(preEle).css('margin-left'));
    const _width = $('.nhTooltip').width() + parseInt($('.nhTooltip').css('padding-left')) + parseInt($('.nhTooltip').css('border-left-width')) + parseInt($('.nhTooltip').css('margin-left'));
    left = left + _width > window.innerWidth ? left + width - _width : left;
    $('.nhTooltip').show().css({
      top,
      left,
    });
  });
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

function tagEvent() { // 标签事件
  $('<div class="nhTagEvent"></div>').insertAfter('#tags');
  const tags = {};
  ['Unlike', 'Alert', 'Like'].forEach((i) => {
    tags[i] = GM_getValue(`tag${i}`, []);
    $(`<a class="nhTagEventNotice" name="${i}" href="javascript:;" on="true"></a>`).appendTo('.nhTagEvent').on('click', (e) => {
      const tag = GM_getValue(`tag${i}`, []);
      const keyword = $('.nhTagEvent').attr('name');
      const target = $(`.tag-${$('.nhTagEvent').attr('target')}`);
      if ($(e.target).attr('on') === 'true' && !tag.includes(keyword)) {
        tag.push(keyword);
        target.attr('name', i);
      } else if ($(e.target).attr('on') === 'false' && tag.includes(keyword)) {
        tag.splice(tag.indexOf(keyword), 1);
        target.removeAttr('name');
      }
      GM_setValue(`tag${i}`, tag);
    });
  });
  $('a.tag').on({
    contextmenu: (e) => { // 搜索标签+中文
      const target = e.target.href ? e.target : e.target.parentNode;
      let keyword = target.childNodes[0].textContent.trim();
      keyword = `"${keyword}"`;
      openUrl(`/search/?q=${encodeURIComponent(`${keyword} language:"chinese"`)}`);
      return false;
    },
    click: (e) => { // 标签
      e.preventDefault();
      const target = e.target.href ? e.target : e.target.parentNode;
      $('a.tag').not(target).css('color', '');
      target.style.color = target.style.color ? '' : 'blue';
      const main = target.href.split('/')[3];
      const sub = target.childNodes[0].textContent.trim();
      $('.nhTagEvent').css('display', target.style.color ? 'block' : 'none').attr('name', `${main}:${sub}`).attr('target', target.className.match(/\d+/)[0]);
      const name = $(target).attr('name');
      $(`.nhTagEvent>a[name="${name}"]`).attr('on', 'false');
      $(`.nhTagEvent>a:not([name="${name}"])`).attr('on', 'true');
    },
  });
  $('.tag').toArray().forEach((i) => {
    const main = i.href.split('/')[3];
    const sub = i.childNodes[0].textContent.trim();
    for (const j in tags) {
      if (tags[j].includes(`${main}:${sub}`)) {
        $(i).attr('name', j);
        break;
      }
    }
  });
}

function tagPreview(gmetadata) { // 标签预览
  $('<div class="nhTagPreview"></div>').appendTo('body');
  $('body').on({
    mousemove(e) {
      if (!$('.gallery:has(.cover)').has(e.target).length) {
        $('.nhTagPreview').hide();
        return;
      }
      const target = $(e.target).parentsUntil('.index-container').find('.cover')[0];
      const info = gmetadata.filter((i) => i.id * 1 === target.href.split('/')[4] * 1)[0];
      if (!info) return;
      $('.nhTagPreview').html(`<div>${info.title.japanese}</div><div style="color:#f00;">${info.num_pages}P Fav: ${info.num_favorites}</div><div style="height:2px;background-color:#000000;"></div>`).show();
      const tagsHTML = $('<div></div>').appendTo('.nhTagPreview');
      info.tags.forEach((i) => {
        const main = i.type;
        const sub = i.name;
        const chs = findData(main, sub, true);
        if ($(`.nhTagPreviewLi[name="${main}"]`, tagsHTML).length === 0) $(`<li class="nhTagPreviewLi" name="${main}"></li>`).appendTo(tagsHTML);
        $('<span></span>').text(chs.cname || sub).appendTo($(`.nhTagPreviewLi[name="${main}"]`, tagsHTML));
      });
      const _width = $('.nhTagPreview').outerWidth();
      const _height = $('.nhTagPreview').outerHeight();
      $('.nhTagPreview').css({
        left: _width + e.clientX + 10 < window.innerWidth ? e.clientX + 5 : e.clientX - _width - 5,
        top: _height + e.clientY + 10 < window.innerHeight ? e.clientY + 5 : e.clientY - _height - 5,
      });
    },
  });
}

function tagTranslate() { // 标签翻译
  const data = $('a.tag').toArray().map((i) => {
    const main = i.href.split('/')[3];
    const sub = i.childNodes[0].textContent.trim();
    return { id: i.className.match(/\d+/)[0], ...findData(main, sub, !CONFIG.tagTranslateImage) };
  }).filter((i) => Object.keys(i).length > 1);
  const css = [
    'a.tag::before{font-size:12px;overflow:hidden;line-height:20px;height:20px}',
    'a.tag>.count{position:relative;font-size:12px;top:0;left:0;}',
    'a.tag>.count::after{display:block;color:#ff8e8e;font-size:14px;background:#1f1f1f;border:1px solid #000;border-radius:5px;position:absolute;float:left;z-index:999;padding:8px;box-shadow:3px 3px 10px #000;min-width:150px;max-width:500px;white-space:pre-wrap;opacity:0;transition:opacity .2s;transform:translate(-50%,20px);top:0;left:50%;pointer-events:none;padding-top:8px;font-weight:400;line-height:20px}',
    'a.tag:hover>.count::after,a.tag:focus>.count::after{opacity:1;pointer-events:auto}',
    'a.tag:hover>.count::after{z-index:9999998}',
    'a.tag:focus>.count::after{z-index:9999996}',
    'a.tag:hover::before{z-index:9999999}',
    'a.tag:focus::before{z-index:9999997}',
    'a.tag>.count::after{color:#fff;}',
    ...data.map((i) => `a.tag-${i.id}{font-size:0;}`),
    'a.tag::before{text-decoration:line-through;}',
  ];
  data.forEach((i) => {
    css.push(`a.tag-${i.id}::before{content:"${i.cname}"}`);
    if (i.info) css.push(`a.tag-${i.id}>.count::after{content:"${i.info}"}`);
  });
  $('<style name="EHT"></style>').text(css.join('\n')).appendTo('head');
}

function toggleBlacklist(keyword) { // 加入黑名单或从黑名单中移除
  const blacklist = GM_getValue('blacklist', []);
  keyword = reEscape(keyword);
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
  const re = /(\w+):("|)(.*?)(\$"|"\$|")/;
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

function xhrSync(url, parm = null, opt = {}) {
  return new Promise((resolve, reject) => {
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

init().then(() => {
  //
}, (err) => {
  console.log(err);
});
