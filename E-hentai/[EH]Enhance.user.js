// ==UserScript==
// @name        [EH]Enhance
// @version     1.08.5
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
//              里站
// @include     https://exhentai.org/
// @include     https://exhentai.org/favorites.php*
// @include     https://exhentai.org/?*
// @include     https://exhentai.org/g/*
// @include     https://exhentai.org/tag/*
// @include     https://exhentai.org/uploader/*
//              表站
// @include     https://e-hentai.org/
// @include     https://e-hentai.org/favorites.php*
// @include     https://e-hentai.org/?*
// @include     https://e-hentai.org/g/*
// @include     https://e-hentai.org/tag/*
// @include     https://e-hentai.org/uploader/*
// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @connect     127.0.0.1
// @require     https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://cdn.bootcss.com/async/2.6.0/async.min.js
// @resource EHT https://raw.githubusercontent.com/dodying/UserJs/master/E-hentai/EHT.json?v=1518335359727
// @resource favicon_0 data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAL0lEQVR42mNgGBQgjU3wPzomJI+ihmoGEHIhTvWDxwBkCVxs2howjAKR/ilxQAEA0niUcVUdSr0AAAAASUVORK5CYII=
// @resource favicon_1 data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK0lEQVR42mNgGBQgjU3wPzrGp452BhDr0kFsALICbIppb8AwCkT6p8QBBQBmZWTxFXfR8AAAAABJRU5ErkJggg==
// @resource favicon_2 data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVR42mNgGBQgjU3wPzomJI+ihmoGkOriQWgAsgQ2NtGBSLYBRDuZVAX0M2DgUuKAAgB3d4iRNiZLcAAAAABJRU5ErkJggg==
// @resource favicon_3 data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMElEQVR42mNgGBQgjU3wPzomJI+ihmoGkOriQWgAsgQ2NtGBSLYBwygQ6Z8SBxQAAOjoiJF+j7m3AAAAAElFTkSuQmCC
// @resource favicon_4 data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANElEQVR42mNgGBQgjU3wPzrGJo+LTz0DCLlwCBiALIGNjTOcqGYAqdE+CA3AlZBob8CAAgCuIn+p3J00ugAAAABJRU5ErkJggg==
// @resource favicon_5 data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAANUlEQVR42mNgGBQgjU3wPzomJI+ihmoGEHIhA7kK6GcAskJsbKIDkWwDSI32QWjAwKXEAQUAd3eIkeLwZzcAAAAASUVORK5CYII=
// @run-at      document-end
// @compatible  firefox 52+(ES2017)
// @compatible  chrome 55+(ES2017)
// ==/UserScript==

const CONFIG = GM_getValue('config', {});
const EHT = JSON.parse(GM_getResourceText('EHT')).dataset;

function init() {
  addStyle(); //添加样式
  $('<div class="ehNavBar" style="bottom:0;"><div></div><div></div><div></div></div>').appendTo('body');
  $(window).on({
    scroll: () => {
      $('.ehNavBar').attr('style', $(window).scrollTop() >= 30 && $('.ido').length === 0 ? 'top:0;' : 'bottom:0;');
    }
  });
  if ($('.ido').length === 0) { //信息页
    if (CONFIG['ex2eh'] && jumpHost()) return; //里站跳转
    changeName('#gn'); //修改本子标题（移除集会名）
    tagTranslate(); //标签翻译
    if (!GM_getValue('apikey')) {
      GM_setValue('apikey', unsafeWindow.apikey);
      GM_setValue('apiuid', unsafeWindow.apiuid);
    }
    new Promise((resolve, reject) => {
      if (CONFIG['showAllThumb']) {
        showAllThumb(resolve, reject); //显示所有预览页
      } else {
        resolve();
      }
    }).then(() => {
      return new Promise((resolve, reject) => {
        if (CONFIG['sizeS'] && CONFIG['sizeD'] && CONFIG['rateS'] && CONFIG['rateD']) {
          checkImageSize(resolve, reject); //检查图片尺寸
        } else {
          resolve();
        }
      });
    }).then(() => {
      $('<link rel="shortcut icon" href="' + GM_getResourceURL('favicon_' + GM_getValue('imageSize', 0)) + '" type="image/x-icon">').appendTo('head');
      highlightBlacklist(); //隐藏黑名单相关的画廊(信息页)
      btnAddFav(); //按钮 -> 加入收藏(信息页)
      btnSearch(); //按钮 -> 搜索(信息页)
      tagEvent(); //标签事件
      copyInfo(); //复制信息
      if (location.hash !== '' && CONFIG['autoClose']) autoClose(); //下载完成后自动关闭
      if (location.hash !== '' && CONFIG['autoStartDownload']) autoStartDownload(); //自动开始下载
      abortPending(); //终止EHD所有下载
      introPic(); //宣传图
    });
  } else { //搜索页
    changeName('.it5>a'); //修改本子标题（移除集会名）
    highlightBlacklist2(); //隐藏黑名单相关的画廊(搜索页)
    btnAddFav2(); //按钮 -> 加入收藏(搜索页)
    btnSearch2(); //按钮 -> 搜索(搜索页)
    quickDownload(); //右键：下载
    batchDownload(); //批量下载
    if (CONFIG['checkExist']) checkExist(); //检查本地是否存在
    new Promise((resolve, reject) => {
      getInfo(resolve, reject); //获取信息
    }).then((gmetadata) => { //获取信息
      if (gmetadata) {
        tagPreview(gmetadata); //标签预览
        hideGalleries(gmetadata); //隐藏某些画集
        if (CONFIG['checkExistAtStart']) $('input:button[name="checkExist"]').click();
        if (CONFIG['preloadPaneImage']) $('.itd:visible[onmouseover]').trigger('mouseover');
      }
    });
    rateInSearchPage(); //在搜索页评分
    autoComplete(); //自动填充
    checkForNew(); //检查有无新本子
  }
  showConfig();
  if (CONFIG['saveLink']) saveLink(); //保存链接
  showTooltip(); //显示提示
  $('body').on('click', '[copy]', e => {
    GM_setClipboard($(e.target).attr('copy'));
  }).on('contextmenu', 'input[type="button"]', () => false);
}

function abortPending() { //终止EHD所有下载
  $('<input type="button" value="Force Abort" title="终止EHD所有下载">').on({
    click: () => {
      $('.ehD-pt-item:not(.ehD-pt-succeed,.ehD-pt-failed) .ehD-pt-abort').click();
    }
  }).appendTo('.ehNavBar>div:eq(1)');
}

function add2Fav(gid, token, i, target) { //添加收藏
  if (i === '10') i = 'favdel';
  xhr(`/gallerypopups.php?gid=${gid}&t=${token}&act=addfav`, () => {
    target = $(target);
    if (i === 'favdel') {
      target.attr('class', 'btnAddFav').removeAttr('id').removeAttr('style');
    } else {
      target.attr('id', 'favicon_' + gid).attr('class', 'i').css('background-position', `0px -${i * 19 + 2}px`);
    }
  }, `favcat=${i}&favnote=&submit=Apply+Changes&update=1`);;
}

function addStyle() { //添加样式
  let backgroundColor = $('body').css('background-color');
  $('<style></style>').text([
      'input[type="number"]{width:60px;border:1px solid #B5A4A4;margin:3px 1px 0;padding:1px 3px 3px;border-radius:3px;}',
      '.ido,.itg{max-width:9999px!important;}',
      '.it5{max-width:9999px!important;}',
      '.ehNavBar{display:flex;width:99%;background-color:' + backgroundColor + ';position:fixed;z-index:1000;padding:0 10px;}',
      '.ehNavBar>div{width:33.3%;}',
      '.ehNavBar>div:nth-child(1){text-align:left;}',
      '.ehNavBar>div:nth-child(2){text-align:center;}',
      '.ehNavBar>div:nth-child(3){text-align:right;}',
      '.btnSearch{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVQ4jX1TvW7iQBBeJCLBPQOF66PwzuwWRjTrwjUVz8Aj2D2iRLmTsJLIut4UfgCfkIJ0D0ARUkR5AlMvLrJSvmvAR0wuI02xs/N98y9ES5hZMfMDM78S0dtJX4joTkop2/6NKKW+EdEvpRS+UiK6HwwG/SuwlPLPpaPWClpraH1NIqV89DyvJ4ToCCGEaEeezWYoigLb7RZ5nmM6nV6RMHNqjOkKZlaXH1mWwVqL/X6PzWaDqqrgnEOSJGhn6Ps+CWZ+uIxsrcVyuWwcgyBAWZao6xpRFJ3AGlprMPNKMPPrmbEoCuz3+6t0wzCEcw6LxaIBa63AzM+CiN7OrNvtFpvN5tPuV1WFNF01BKeJ1BcECnmeo6oqBEHwATyZTGCtRRzHDfhEcBRE9HI2TKdTOOdQliXCMGzAu90Oh8MB4/G4Pc4nQUR3l8YkSVDXNZxzqKoK1locDgccj0fkef4hA2a+FVJK2a43iiIsFguk6QpxHGM8HmO9XgMAsiw7g9+Hw+H38yLdt0n+dVs37yzLMJ/PoZSC7/s/m00cDAZ9KeXj/8CfrPJvz/N6xphucw+e5/WYOf3qBpj5nZl/eJ7XG41GfaXUzeVNdYwxXd/3iZlXzPxMRDURHaWUT8x8e6q5Y4zpKqVujDHdv6rJoiTHuLTjAAAAAElFTkSuQmCC);}',
      '.btnAddFav{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVQ4ja2TSwrDMAxERyNvEgg9jFdC25y9tMdpcwB3k4/j2GkoFQiMkZ9GHwPAE0D60R84CxCR1U/itkNmYmZdjLE3sw6A4GhNAN19GMd4c/cBACuPsSgsAeXj9+ylkeQBIJXMtfLo7oOq7gFm1lVkN8sjufVARFKMsc9kVzuuyilLsgfM3WYLEIImVX3VyltqaY6qMZXTPVgBIWhqjPQrgKqcCtkHdS3AlWX6/yYmAIlkUtWUzbnq+SY+lsuLvy+Lw/0DpJalxJ3rpocAAAAASUVORK5CYII=);}',
      '.id44>.btnAddFav,.id44>.i[id^="favicon_"],.id44>.btnSearch{float:right;margin:4px 2px 0 0;}',
      '.i[id^="favicon_"],#fav>.i{cursor:pointer;background-image:url("data:image/png;base64,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")!important;}',
      '.ehConfig{z-index:3;position:absolute;top:100px;left:calc(50% - 300px);width:600px;background-color:' + backgroundColor + ';}',
      '.ehTagEvent{display:none;font-weight:bold;}',
      '.ehTagEvent:before{margin-left:10px;content:url("https://ehgt.org/g/mr.gif") " " attr(name);}',
      '.ehTagEvent>a{cursor:pointer;text-decoration:none;}',
      '.ehTagEvent>a:before{margin-left:10px;margin-right:2px;content:url("https://ehgt.org/g/mr.gif");}',
      '.ehDatalist{display:none;overflow-y:auto;max-height:300px;}',
      '.ehDatalist>ol{list-style:decimal;text-align:left;}',
      '.ehDatalist>ol>li{cursor:pointer;}',
      '.ehDatalist>ol>li:after{content:"  "attr(cname);font-size:9pt;font-weight:bold;}',
      '.ehDatalistHover{color:#F00;font-weight:bold;font-size:large;}',
      '.ehExist{color:green;padding:0 1px;border:black 1px solid;cursor:pointer;}',
      '.ehExist[name="force"]{color:red;}',
      '.ehTagPreview{position:fixed;padding:5px;display:none;z-index:99999;font-size:larger;width:250px;border-color:#000;border-style:solid;color:#fff;background-color:#34353b;}',
      '.ehTagPreviewLi{color:#C9BA67;}',
      '.ehTagPreviewLi[name="language"]::before{content:"语言: ";}',
      '.ehTagPreviewLi[name="reclass"]::before{content:"重新分类: ";}',
      '.ehTagPreviewLi[name="artist"]{font-size:larger;color:#008000;}',
      '.ehTagPreviewLi[name="artist"]::before{content:"漫画家: ";}',
      '.ehTagPreviewLi[name="group"]{font-size:larger;color:#00FFF5;}',
      '.ehTagPreviewLi[name="group"]::before{content:"组织: "}',
      '.ehTagPreviewLi[name="parody"]{font-size:larger;color:#FFFF00;}',
      '.ehTagPreviewLi[name="parody"]::before{content:"同人: ";}',
      '.ehTagPreviewLi[name="character"]::before{content:"角色: ";}',
      '.ehTagPreviewLi[name="female"]::before{content:"女: ";}',
      '.ehTagPreviewLi[name="male"]::before{content:"男: ";}',
      '.ehTagPreviewLi[name="misc"]::before{content:"杂项: ";}',
      '.ehTagPreviewLi[name="other"]::before{content:"未分类: ";}',
      '.ehTagPreviewLi>span{display:inline;margin:0 2px;border:1px #456F78 solid;}',
      '.ih>li{margin:0 2px;cursor:pointer;list-style:none;}',
      '.ih>li::before{content:attr(name) ": ";}',
      '.ih>li>span,.ehTagNotice{margin:0 1px;}',
      '.ehTagNotice{float:left;}',
      '.ehTagNotice[name="Unlike"],#taglist div[id][name="Unlike"]{color:#F00;background-color:#00F;}',
      '.ehTagNotice[name="Alert"],#taglist div[id][name="Alert"]{color:#FF0;background-color:#080;}',
      '.ehTagNotice[name="Like"],#taglist div[id][name="Like"]{color:#000;background-color:#0FF;}',
      '.ehTagEvent>.ehTagEventNotice[on="true"]::after{content:attr(name) " this";}',
      '.ehTagEvent>.ehTagEventNotice[on="false"]::after{content:"NOT " attr(name) " this";}',
      '.ehTooltip{display:none;white-space:nowrap;position:fixed;text-align:left;z-index:99999;border:2px solid #8d8d8d;background-color:' + backgroundColor + ';}',
      '.ehTooltip>ul{margin:0;}',
      '.ehCheckTable{top:60px;left:0;position:fixed;width:98%;z-index:2;background-color:' + backgroundColor + ';}',
      '.ehCheckTable>table{margin:0 auto;border-collapse:collapse;}',
      '.ehCheckTable>table th,.ehCheckTable>table td{border:2px ridge #000;}',
      '.ehCheckTable>table a{text-decoration:none;}',
      '.ehBlacklist{color:#000;background-color:#000;}',
      '.ehCheckTr{text-align:center;}',
      '.ehCheckTr>td{padding:3px 4px;border-right:1px solid #40454b;}',
      '.itg>tbody>tr.ehBatchHover{background-color:#669933;}',
      '.itg>tbody>tr:hover{background-color:#4A86E8}',
      '.itg>tbody>tr>th:nth-child(5),.itg>tbody>tr>td:nth-child(5){cursor:pointer;}',
      '.gdtm [name="intro"][on="true"]::after{content:"Block this";}',
      '.gdtm [name="intro"][on="false"]::after{content:"Unblock this";}',
    ].concat(GM_getResourceText('jquery_ui')).join('')).appendTo('head');
  $('.i:has(.n),.id44>div>a:has(.tn)').hide(); //隐藏种子图标
}

function autoClose() { //下载完成后自动关闭
  setTimeout(() => {
    if ($('.ehD-dialog>.ehD-pt-gen-filename+button').text() === 'Not download? Click here to download' || $('.ehD-dialog span:contains("Not download or file is broken? "):has(a[href^="filesystem:https://"])').length > 0) {
      setTimeout(() => {
        self.close();
      }, 3000);
    } else {
      autoClose();
    }
  }, 3000);
}

function autoComplete() { //自动填充
  let main = (CONFIG['acItem'] || 'language,artist,female,male,parody,character,group,misc').split(',');
  main = EHT.filter(i => main.includes(i.name));
  $('<div class="ehDatalist"><ol start="0"></ol></div>').on('click', 'li', function(e) {
    let value = $('[name="f_search"]').val().split(/\s+/);
    value[value.length - 1] = e.target.textContent;
    $('[name="f_search"]').val(value.filter(i => i).join(' ')).focus();
    $('.ehDatalist>ol').empty();
    $('.ehDatalist').show();
  }).appendTo('form:has([name="f_search"])');
  let lastValue;
  $('[name="f_search"]').attr('title', `当输入大于${CONFIG['acLength'] || 0}个字符时，显示选单<br>使用主键盘区的数字/加减/方向键快速选择<br>点击/Enter/Insert键填充`).on({
    focusin: function() {
      $('.ehDatalist').show();
    },
    focusout: function() {
      setTimeout(() => {
        $('.ehDatalist').hide();
      }, 100);
    },
    keydown: function(e) {
      let hasItem = $('.ehDatalist li').length;
      let onItem = $('.ehDatalistHover').index();
      if (hasItem && e.keyCode <= 57 && e.keyCode >= 48) { //选择选项: 0-9
        e.preventDefault();
        $('.ehDatalist li').eq(e.keyCode - 48).click();
      } else if (hasItem && [187, 189, 37, 38, 39, 40].includes(e.keyCode)) { //选择选项: 加减/方向键
        e.preventDefault();
        if ([187, 40].includes(e.keyCode)) { //选择选项: +下
          onItem = onItem + 1;
        } else if ([189, 38].includes(e.keyCode)) { //选择选项: -上
          onItem = onItem - 1;
        } else if (e.keyCode === 39) { //选择选项: 右
          onItem = onItem + 10;
        } else if (e.keyCode === 37) { //选择选项: 左
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
      } else if (onItem >= 0 && [13, 45].includes(e.keyCode)) { //选择选项: Insert
        e.preventDefault();
        $('.ehDatalistHover').click();
      }
    },
    keyup: function(e) {
      let value = e.target.value.split(/\s+/);
      value = value[value.length - 1];
      if (value === lastValue) return;
      $('.ehDatalist>ol').empty();
      if (!value || value.length <= (CONFIG['acLength'] || 0)) return;
      lastValue = value;
      value = new RegExp(value, 'i');
      main.forEach(i => {
        i.tags.filter(j => j.name && (j.name.match(value) || combineText(j.cname, true).match(value))).forEach(j => {
          $(`<li cname="${combineText(j.cname, true)}">${i.name}:"${j.name}"$</li>`).appendTo('.ehDatalist>ol');
        });
      });
    }
  });
}

function autoStartDownload() { //自动开始下载
  setTimeout(() => {
    if ($('.ehD-box>.g2').length > 0) {
      setTimeout(() => {
        $('.ehD-box>.g2:eq(0)').click();
      }, 2000);
    } else {
      autoStartDownload();
    }
  }, 800);
}

function batchDownload() { //批量下载
  $('<th><input type="checkbox" title="全选"></th>').appendTo('.itg tr:eq(0)');
  $('.itg tr:eq(0) input').on('click', function(e) {
    $('.itg tr:gt(0) input').prop('checked', e.target.checked);
    if (e.target.checked) {
      $('.itg tr:gt(0):not(.ehCheckTr)').addClass('ehBatchHover');
    } else {
      $('.itg tr:gt(0):not(.ehCheckTr)').removeClass('ehBatchHover');
    }
  });
  $('<td><input type="checkbox"></td>').appendTo('.itg tr:gt(0):not(.ehCheckTr)');
  $('.itg tr:gt(0) input').on('click', function(e) {
    if (e.target.checked) {
      $(e.target).parentsUntil('tbody').eq(-1).addClass('ehBatchHover');
    } else {
      $(e.target).parentsUntil('tbody').eq(-1).removeClass('ehBatchHover');
    }
  });
  $('.itg tr>th:has(input),.itg tr>td:has(input)').on('click', function(e) {
    if ($(e.target).find('input').length) $(e.target).find('input').click();
  });
  sessionStorage.setItem('batch', 0)
  $('<input type="button" value="Batch" title="左键: Batch<br>右键: 重置Batch">').on('mousedown', e => {
    if (e.button === 2) {
      sessionStorage.setItem('batch', 0);
    } else {
      let batch = sessionStorage.getItem('batch') * 1;
      $('.itg tr input:checked').click();
      let books = $('.itg tr:gt(0):visible:not(:has(.i[id^="favicon_"],.ehExist,.ehBlacklist),.ehCheckTr)').toArray();
      books.splice(batch * CONFIG['batch'], CONFIG['batch']).forEach(i => {
        $(i).find('input[type="checkbox"]').click();
      });
      sessionStorage.setItem('batch', batch * CONFIG['batch'] <= books.length ? batch + 1 : 0);
    }
  }).appendTo('.ehNavBar>div:eq(2)');
  $('<input type="button" value="Open" title="' + '左中右'.split('')[CONFIG['auto2Fav']] + '键: Open + Add to Favorites (上次选择)<br>其他: Open">').on('mousedown', e => {
    let url = $('.ehBatchHover .it5>a').toArray().forEach(i => {
      openUrl(i.href + '#' + e.button);
    });
    if (e.button === CONFIG['auto2Fav'] * 1) {
      $('.ehBatchHover').toArray().forEach(i => {
        let arr = $(i).find('.it5>a').attr('href').split('/');
        add2Fav(arr[4], arr[5], GM_getValue('lastFavcat', '0'), $(i).find('.i[id^="favicon"],.btnAddFav')[0]);
      });
    }
  }).appendTo('.ehNavBar>div:eq(2)');
  $('<input type="button" value="Add Favorites" title="左键: Add to Favorites (上次选择)<br>中键: Add to Favorites (自行选择)<br>右键: Remove from Favorites">').on('mousedown', function(e) {
    let favcat = e.button === 0 ? GM_getValue('lastFavcat', '0') : e.button === 1 ? prompt(`请选择：\n${'bookmark' in CONFIG ? CONFIG['bookmark'].replace(/\\n/g,'\n') : ''}\n10.从收藏中移除`, GM_getValue('lastFavcat', '0')) : '10';
    if (!favcat) return;
    $('.ehBatchHover').toArray().forEach(i => {
      let arr = $(i).find('.it5>a').attr('href').split('/');
      add2Fav(arr[4], arr[5], favcat, $(i).find('.i[id^="favicon"],.btnAddFav')[0]);
    });
  }).appendTo('.ehNavBar>div:eq(2)');
}

function btnAddFav0(e, url) { //按钮 -> 加入收藏(通用事件)
  let event = CONFIG['bookmarkEvent'].split('|').filter(i => i.match(new RegExp(`^${e.button},`)));
  for (let i = 0; i < event.length; i++) {
    let arr = event[i].split(',');
    let keydown = arr[1] === '-1' ? true : e[['altKey', 'ctrlKey', 'shiftKey'][arr[1]]];
    if (keydown) {
      if (arr[2] === 'b') {
        let keyword = $('.ido').length ? $(e.target).parentsUntil('tr').eq(-1).find('.it5').text() : $('#gn').text();
        keyword = prompt('请输入加入黑名单或从黑名单中移除的关键词', keyword);
        if (keyword) toggleBlacklist(keyword.trim());
        if ($('.ido').length) {
          highlightBlacklist2();
        } else {
          highlightBlacklist();
        }
      } else {
        let favcat = arr[2] === undefined ? GM_getValue('lastFavcat', '0') : arr[2];
        if (favcat === '-1') {
          favcat = prompt(`请选择：\n${'bookmark' in CONFIG ? CONFIG['bookmark'].replace(/\\n/g,'\n') : ''}\n10.从收藏中移除`, GM_getValue('lastFavcat', '0'));
          if (!favcat) return;
          GM_setValue('lastFavcat', favcat);
        }
        add2Fav(url[4], url[5], favcat, e.target);
      }
      break;
    }
  }
}

function btnAddFav() { //按钮 -> 加入收藏(信息页)
  let fav = -1;
  if ($('#gdf>#fav>.i').length > 0) fav = 0 - (parseInt($('#gdf>#fav>.i').css('background-position-y')) + 2) / 19;
  let url = location.href.split('/');
  $('#gdf').attr('title', CONFIG['bookmarkEventChs']).empty().removeAttr('onclick').on({
    contextmenu: () => false,
    mousedown: e => {
      btnAddFav0(e, url);
    }
  });
  if (fav === -1) {
    $('#gdf').attr('class', 'btnAddFav').removeAttr('id').removeAttr('style');
  } else {
    $('#gdf').attr('class', 'i').attr('id', 'favicon_' + url[4]).css('background-position', '0px -' + (fav * 19 + 2) + 'px');
  }
}

function btnAddFav2() { //按钮 -> 加入收藏(搜索页)
  $('<div class="btnAddFav"></div>').appendTo('.it3:not(:has(.i[id^="favicon_"])),.id44:not(:has(.i[id^="favicon_"]))');
  $('.btnAddFav,.i[id^="favicon_"]').attr('title', CONFIG['bookmarkEventChs']).removeAttr('onclick').on({
    contextmenu: () => false,
    mousedown: e => {
      let href = $(e.target).parentsUntil('.itd,#pp').eq(-1).find('.it5>a,.id2>a').attr('href');
      btnAddFav0(e, href.split('/'));
    }
  });
}

function btnSearch() { //按钮 -> 搜索(信息页)
  let text = $('#gn').text() || $('#gj').text();
  if (text === '') return;
  $('<div class="ehSearch"></div>').appendTo('#gd2');
  text = text.split(/[\[\]\(\)\{\}【】\|\-\d]+/);
  for (let i = 0; i < text.length; i++) {
    text[i] = text[i].trim();
    if (text[i]) $('<span></span>').html(`<input id="ehSearch_${i}" type="checkbox"><label for="ehSearch_${i}">${text[i]}</label>`).appendTo('.ehSearch');
  }
  $('<input type="button" value="Search" title="搜索">').appendTo('.ehSearch').click(() => {
    let keyword = $('.ehSearch input:checked+label').toArray().map(i => '"' + i.textContent + '"').join(' ');
    if (keyword.length > 0) openUrl('/?f_search=' + encodeURIComponent(keyword));
  });
}

function btnSearch2() { //按钮 -> 搜索(搜索页)
  $('<div class="btnSearch" title="左键: 搜索<br>右键: 搜索 + 中文"></div>').appendTo('.it3,.id44').on({
    mousedown: e => {
      let name = $(e.target).parentsUntil('.itd,#pp').eq(-1).find('.it5>a,.id2>a').text();
      name = name.replace(/\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）|\d+|\-|!/g, '').replace(/\|.*/, '').trim();
      name = '"' + name + '"';
      if (e.button === 2) name += ' language:"chinese"$';
      openUrl('/?f_search=' + encodeURIComponent(name));
    }
  });
}

async function changeEConfig(key, value) { //修改EH设置
  let uconfig;
  if (CONFIG['uconfig']) {
    uconfig = CONFIG['uconfig'];
  } else {
    let res = await xhrSync('/uconfig.php');
    uconfig = $('#settings_outer>form', res.response).serialize();
  }
  uconfig = uconfig.replace(new RegExp(key + '=.*?(&|$)'), key + '=' + value + '$1') + '&apply=Apply';
  await xhrSync('/uconfig.php', uconfig);
}

function changeName(e) { //修改本子标题（移除集会名）
  $(e).toArray().forEach(i => {
    i.textContent = i.textContent.replace(/^\(.*?\)( |)/, '').replace(/\s+/g, ' ').trim();
  });
}

function checkExist() { //检查本地是否存在
  $('<input type="button" name="checkExist" value="Check Exist" title="只检查可见的，且之前检查无结果">').on('click', async (e) => {
    $(e.target).val('Checking').prop('disabled', true);
    let lst = $('.itg tr:visible:not(:has(.ehExist)) .it5,.id1:visible:not(:has(.ehExist)) .id2').toArray();
    if (CONFIG['checkExistOld']) {
      async.mapLimit(lst, CONFIG['checkExistLimit'] || 1, async i => {
        let name = i.textContent.replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '').trim();
        let name2 = i.textContent.replace(/\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）/g, '').replace(/\|.*/g, '').replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '').trim();
        let res = await xhrSync('http://127.0.0.1:3000/', 'name=' + encodeURIComponent(name2), {
          responseType: 'json'
        });
        res.response.forEach((j, k) => {
          $(`<span class="ehExist" ${name === j.replace(/\.(zip|cbz|rar|cbr)$/, '')? 'name="force" ' : ''}copy="${j}">${k}</span>`).appendTo($(i).parent().find('.it3,.id44'));
        });
      }, (err, results) => {
        $(e.target).val('Check Exist').prop('disabled', false);
      });
    } else {
      let name = {};
      lst.forEach((i, j) => {
        if (CONFIG['checkExistName2']) {
          name[j] = i.textContent.replace(/\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|［.*?］|（.*?）/g, '').replace(/\|.*/g, '').replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '').trim();
        } else {
          let arr = i.textContent.replace(/\|.*?([\(\[\{【（]|$)/, '$1').replace(/[\\/:*?"<>|]/g, '-').split(/[\[\]\(\)\{\}【】（）]+/).map(i => i.trim().replace(/\.$/, '').trim()).filter(i => i);
          if (arr.includes('Chinese')) arr.splice(arr.indexOf('Chinese'));
          name[j] = arr.join();
        }
      });
      let res = await xhrSync('http://127.0.0.1:3000/', 'names=' + encodeURIComponent(JSON.stringify(name)), {
        responseType: 'json',
        timeout: 120 * 1000
      });
      lst.forEach((i, j) => {
        let name = i.textContent.replace(/[\\/:*?"<>|]/g, '-').replace(/\.$/, '').trim();
        res.response[j].forEach((k, l) => {
          $(`<span class="ehExist" ${name === k.replace(/\.(zip|cbz|rar|cbr)$/, '')? 'name="force" ' : ''}copy="${k}">${l}</span>`).appendTo($(i).parent().find('.it3,.id44'));
        });
      });
      $(e.target).val('Check Exist').prop('disabled', false);
    }
  }).appendTo('.ehNavBar>div:eq(1)');
}

function checkForNew() { //检查有无新本子
  let listStyle = $('#nb>img')[0].outerHTML;
  $(listStyle).appendTo('#nb');
  $('<a href="javascript:;">Add to Check</a>').on('click', function(e) {
    let keywordRaw = $('[name="f_search"]').val();
    if (!keywordRaw) return;
    let keyword = keywordRaw;
    let keywordNew = [];
    let re = /(\w+):"(.*?)"\$/;
    result = re.exec(keyword);
    while (result) {
      let chs = findData(result[1], result[2], true).cname;
      keyword = keyword.replace(result[0], '').trim();
      keywordNew.push(chs ? findData(result[1]).cname + ':"' + chs + '"' : result[0]);
      result = re.exec(keyword);
    }
    if (keyword) keywordNew = keywordNew.concat(keyword.split(/\s+/));
    keywordNew = prompt('请输入名称', keywordNew.join(' '));
    if (!keywordNew) return;
    let list = GM_getValue('checkList', {});
    list[keywordRaw] = {
      name: keywordNew,
      url: location.search,
      time: new Date().getTime(),
      result: $('.ip').text().match(/Showing .*? of [\d,]+/) ? $('.ip').text().match(/Showing .*? of ([\d,]+)/)[1] : 0
    }
    GM_setValue('checkList', list);
  }).appendTo('#nb');
  $(listStyle).appendTo('#nb');
  $('<a href="javascript:;">Show Check List</a>').on('click', function(e) {
    if ($('.ehCheckTable').length) {
      $('.ehCheckTable').toggle();
      return;
    }
    $('<div class="ehCheckTable"></div>').html('<table><thead><tr><th>Keyword</th><th>Name</th><th>Time</th><th>Result</th><th><input class="ehCheckTableSelectAll" type="checkbox" title="全选"></th></tr></thead><tbody></tbody></table>').appendTo('body');
    let list = GM_getValue('checkList', {});
    for (let i in list) {
      let tr = $('<tr><td></td><td></td><td></td><td></td><td><input type="checkbox"></td></tr>');
      $('<a target="_blank"></a>').attr('href', '/' + list[i].url).text(i).appendTo($(tr).find('td:eq(0)'));
      $(tr).find('td:eq(1)').text(list[i].name);
      $(tr).find('td:eq(2)').text(new Date(list[i].time).toLocaleString(navigator.language, {
        hour12: false
      }));
      $(tr).find('td:eq(3)').text(list[i].result);
      $(tr).appendTo('.ehCheckTable tbody');
    }
    $('.ehCheckTableSelectAll').on('click', (e) => {
      $('.ehCheckTable td>input').prop('checked', e.target.checked);
    });
    $('<input type="button" value="Select Invert" title="反选">').on('click', function() {
      $('.ehCheckTable td>input').toArray().forEach(i => {
        i.checked = !i.checked;
      });
    }).appendTo('.ehCheckTable');
    $('<input type="button" value="Delete" title="移除">').on('click', function() {
      let list = GM_getValue('checkList', {});
      $('.ehCheckTable td>input:checked').toArray().forEach(i => {
        let keyword = $(i).parentsUntil('tbody').eq(-1).find('td>a').html();
        delete list[keyword];
      });
      GM_setValue('checkList', list);
      $('.ehCheckTable').remove();
    }).appendTo('.ehCheckTable');
    $('<input type="button" value="Cancel" title="取消">').on('click', function() {
      $('.ehCheckTable').hide();
    }).appendTo('.ehCheckTable');
  }).appendTo('#nb');
  let keyword = $('[name="f_search"]').val();
  if (!keyword) return;
  let list = GM_getValue('checkList', {});
  if (!(keyword in list)) return;
  let info = list[keyword];
  let tr = $('.itg tr:gt(0)').toArray();
  let i;
  for (i = 0; i < tr.length; i++) {
    let _time = new Date($(tr[i]).find('td').eq(1).text()).getTime();
    if (info.time > _time) break;
  }
  $(`<tr class="ehCheckTr ${tr[i].className === 'gtr0' ? 'gtr1' : 'gtr0'}"><td colspan="${$('.itg tr:eq(0)>th').length}">Name: ${info.name}<br>Last Check Time: ${new Date(info.time).toLocaleString(navigator.language, {hour12: false})}</td></tr>`).insertBefore(tr[i]);
}

function checkImageSize(resolve, reject) { //检查图片尺寸
  let ads = GM_getValue('introPic', []);
  let s = CONFIG['sizeS'];
  let d = CONFIG['sizeD'];
  if (!GM_getValue('imageSize', false)) {
    GM_setValue('imageSize', s);
    changeEConfig('xr', s).then(() => {
      location = location.href;
    });
    return reject();
  }
  let imageSize = GM_getValue('imageSize');
  let numS = 0; //单页
  let numD = 0; //双页
  let pics = $('.gdtm>div>a>img').toArray().filter(i => !ads.includes($(i).parent().attr('href').split('/')[4]));
  console.log(pics);
  pics.forEach(function(i) {
    let rate = $(i).width() / $(i).height(); //宽高比
    if (rate > CONFIG['rateD']) {
      numD++;
    } else if (rate < CONFIG['rateS']) {
      numS++;
    }
  });
  if (2 * numD > pics.length) { //双页超过一半
    if (imageSize !== d) {
      document.title = d + '|' + document.title;
      GM_setValue('imageSize', d);
      changeEConfig('xr', d).then(() => {
        resolve();
      });
      return;
    }
  } else if (imageSize !== s) {
    document.title = s + '|' + document.title;
    GM_setValue('imageSize', s);
    changeEConfig('xr', s).then(() => {
      resolve();
    });
    return;
  }
  resolve();
}

function combineText(arr, textOnly = undefined) {
  return arr instanceof Array ? arr.map(i => {
    if (i.type === 0) {
      return i.text;
    } else if (!textOnly && i.type === 2) {
      return `"url("${i.src.replace(/http.?:/g,'')}")"`;
    } else {
      return null;
    }
  }).filter(i => i).join('\\A') : '';
}

function copyInfo() { //复制信息
  if ($('#gn').text().match(/\[(.*?)\]/) && $('#gj').text().match(/\[(.*?)\]/)) { //artist
    var name = $('#gn').text().match(/\[(.*?)\]/)[1];
    var nameJpn = $('#gj').text().match(/\[(.*?)\]/)[1];
    if (name.match(/\(.*?\)/)) name = name.match(/\((.*?)\)/)[1];
    if (nameJpn.match(/\(.*?\)/)) nameJpn = nameJpn.match(/\((.*?)\)/)[1];
    $(`<input type="button" value="[${name}]${nameJpn}" copy="[${name}]${nameJpn}">`).appendTo('.ehNavBar>div:eq(0)');
  }
  if ($('.gt[id*="td_parody"]>a').length > 0) { //parody
    let info = $('.gt[id*="td_parody"]>a').attr('id').split(/ta_|:/);
    let parody = findData(info[1], info[2], true);
    if (Object.keys(parody).length) {
      parody = parody.cname;
    } else {
      parody = ($('#gj').text().match(/\(.*?\)/g)) ? $('#gj').text().match(/\(.*?\)/g) : $('#gn').text().match(/\(.*?\)/g);
      parody = parody[parody.length - 1].match(/\((.*?)\)/)[1];
    }
    let parodyKeyword = $('.gt[id*="td_parody"]>a').text().replace(/ \| .*/, '');
    $(`<input type="button" value="【${parody}】${parodyKeyword}" copy="【${parody}】${parodyKeyword}">`).appendTo('.ehNavBar>div:eq(0)');
  }
}

function findData(main, sub = undefined, textOnly = false) {
  let data = EHT.filter(i => i.name === main);
  if (data.length === 0 || data[0].tags.length === 0) return {};
  if (sub === undefined) return {
    name: main,
    cname: combineText(data[0].cname, textOnly),
    info: combineText(data[0].info, textOnly)
  };
  data = data[0].tags.filter(i => i.name === sub.replace(/_/g, ' '));
  if (data.length === 0) return {};
  return {
    name: main === 'misc' ? sub : main + ':' + sub,
    cname: combineText(data[0].cname, textOnly),
    info: combineText(data[0].info, textOnly)
  };
}

function getInfo(resolve, reject) { //获取信息
  if (!$('.itg').length) return resolve();
  let gidlist = $('.it5>a').toArray().map(i => {
    let arr = i.href.split('/');
    return [arr[4], arr[5]];
  });
  let lst = [];
  while (gidlist.length) {
    lst.push(gidlist.splice(0, 25));
  }
  let gmetadata = [];
  async.mapSeries(lst, async i => {
    let gdata = {
      'method': 'gdata',
      'gidlist': i,
      'namespace': 1
    }
    let res = await xhrSync('/api.php', JSON.stringify(gdata), {
      responseType: 'json'
    });
    gmetadata = gmetadata.concat(res.response.gmetadata);
  }, (err, results) => {
    resolve(gmetadata);
  });
}

function hideGalleries(gmetadata) { //隐藏某些画集
  let tags = {};
  ['Unlike', 'Alert', 'Like'].forEach(i => {
    let tag = GM_getValue('tag' + i, []);
    tags[i] = tag;
  });
  $('.it5>a').toArray().forEach(i => {
    let info = gmetadata.filter(j => j.gid === i.href.split('/')[4] * 1)[0];
    if (!info) return;
    if (info.rating * 1 < CONFIG['lowRating']) $('<span class="ehTagNotice" name="Unlike" title="低评分">低评分</span>').insertBefore($(i).parent());
    if (info.filecount * 1 < CONFIG['fewPages']) $('<span class="ehTagNotice" name="Unlike" title="页面少">页面少</span>').insertBefore($(i).parent());
    for (let j in tags) {
      let check = info.tags.filter(k => tags[j].includes(k));
      if (check.length) {
        check.forEach(k => {
          let tag = k.split(':');
          let main = tag.length === 1 ? 'misc' : tag[0];
          let sub = tag[tag.length - 1];
          let tagChs = findData(main, sub, true).cname;
          if (tagChs) tagChs = (main === 'male' ? '♂:' : (main === 'female' ? '♀:' : '')) + tagChs;
          $(`<span class="ehTagNotice" name="${j}" title="${k}">${tagChs || k}</span>`).insertBefore($(i).parent());
        });
      }
    }
  });
  let length = $('.itg tr:has(.ehTagNotice[name="Unlike"])').hide().length;
  $('.ip:eq(0)').html($('.ip').html() + ' 过滤' + length + '本 ');
  $('<input type="button" value="Show">').on('click', function(e) {
    $('.itg tr:has(.ehTagNotice[name="Unlike"])').toggle();
    $(e.target).val($(e.target).val() === 'Show' ? 'Hide' : 'Show');
  }).appendTo('.ip:eq(0)');
}

function highlightBlacklist() { //隐藏黑名单相关的画廊(信息页)
  let blacklist = GM_getValue('blacklist', []);
  let title = $('#gn').text();
  for (let i of blacklist) {
    if (title.match(new RegExp(i, 'i'))) {
      i = i.replace(/\\(.?)/g, '$1');
      $('#gn').attr('copy', i).addClass('ehBlacklist').on('click', function(e) {
        GM_setClipboard($(e.target).attr('copy'));
      });
      return;
    }
  }
  $('#gn').removeAttr('copy').removeClass('ehBlacklist').off('click');
}

function highlightBlacklist2() { //隐藏黑名单相关的画廊(搜索页)
  let blacklist = GM_getValue('blacklist', []);
  $('.it5').toArray().forEach(i => {
    let title = $(i).text();
    for (let j of blacklist) {
      if (title.match(new RegExp(j, 'i'))) {
        j = j.replace(/\\(.?)/g, '$1');
        $(i).parentsUntil('tr').eq(-1).attr('copy', j).addClass('ehBlacklist').on('click', function(e) {
          GM_setClipboard($(e.target).attr('copy') || $(e.target).parentsUntil('tr').eq(-1).attr('copy'));
        });
        return;
      }
    }
    $(i).parentsUntil('tr').eq(-1).removeAttr('copy').removeClass('ehBlacklist').off('click');
  });
}

function introPic() { //宣传图
  $('<a type="button" name="intro" href="javascript:;" on="true"></a>').on('click', function(e) {
    let introPic = GM_getValue('introPic', []);
    let id = $(e.target).prev().attr('href').split('/')[4];
    if ($(e.target).attr('on') === 'true' && !introPic.includes(id)) {
      introPic.push(id);
      $(e.target).attr('on', 'false');
    } else if ($(e.target).attr('on') === 'false' && introPic.includes(id)) {
      introPic.splice(introPic.indexOf(id), 1);
      $(e.target).attr('on', 'true');
    }
    GM_setValue('introPic', introPic);
  }).appendTo('.gdtm>div');
  let introPic = GM_getValue('introPic', []);
  $('.gdtm>div>a:nth-child(1)').toArray().forEach(i => {
    let id = i.href.split('/')[4];
    if (introPic.includes(id)) $(i).next().attr('on', 'false');
  });
}

function jumpHost() { //里站跳转
  let l = location;
  let gid = l.href.split('/')[4];
  let jump = GM_getValue('jump', []);
  if (l.host === 'exhentai.org') { //里站
    if (!jump.includes(gid)) { //尝试跳转
      if (!['ta_female:lolicon', 'ta_male:shotacon', 'ta_male:bestiality', 'ta_female:bestiality'].some(i => document.getElementById(i))) {
        location = '//e-hentai.org' + l.pathname + l.search + l.hash;
        return true;
      }
    } else {
      jump.splice(jump.indexOf(gid), 1);
      GM_setValue('jump', jump);
    }
  } else if (l.host === 'e-hentai.org') { //表站
    if (document.querySelector('.d')) { //不存在则返回
      jump.push(gid);
      GM_setValue('jump', jump);
      location = '//exhentai.org' + l.pathname + l.search + l.hash;
      return true;
    }
  }
}

function openUrl(url) { //打开链接
  url = (url.match('//') ? '' : location.origin) + url;
  if (!CONFIG['openInTab']) {
    window.open(url, '', 'resizable,scrollbars,status');
  } else {
    GM_openInTab(url, true);
  }
}

function quickDownload() { //右键下载
  $('.itg').on('contextmenu', e => {
    e.preventDefault();
    if ($(e.target).is('.it5>a,.id3>a')) openUrl(e.target.href + '#2');
  });
}

function rateInSearchPage() { //在搜索页评分
  $('.it4>.ir.it4r').on({
    mousemove(e) {
      let _ = $(e.target);
      if (!_.attr('rawRate')) _.attr('rawRate', _.css('background-position'));
      let star = Math.round(e.offsetX / 8);
      let x = -80 + Math.ceil(star / 2) * 16;
      let y = star % 2 == 1 ? -21 : -1;
      _.attr('title', star).css('background-position', x + 'px ' + y + 'px');
    },
    mouseout(e) {
      $(e.target).css('background-position', $(e.target).attr('rawRate'));
    },
    click(e) {
      let apikey = GM_getValue('apikey');
      if (!apikey) {
        alert('请在任意信息页获取到apikey与apiuid后再尝试');
        return;
      }
      let apiuid = GM_getValue('apiuid');
      let hrefArr = $(e.target).parent().prev().find('a').attr('href').split('/');
      let star = Math.round(e.offsetX / 8);
      let parm = {
        apikey: apikey,
        apiuid: apiuid,
        gid: hrefArr[4],
        method: 'rategallery',
        rating: star,
        token: hrefArr[5]
      };
      xhr('/api.php', () => {
        let x = -80 + Math.ceil(star / 2) * 16;
        let y = star % 2 == 1 ? -21 : -1;
        $(e.target).attr('rawRate', x + 'px ' + y + 'px').addClass('irb');
      }, JSON.stringify(parm));
    }
  });
}

function setNotification(title, body) { //发出桌面通知
  if (Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(function(status) {
      if (status === 'granted') {
        var n = (body) ? new Notification(title, {
          body: body,
          tag: GM_info.script.name
        }) : new Notification(title);
        setTimeout(function() {
          if (n) n.close();
        }, 3000);
      }
    });
  }
}

function showAllThumb(resolve, reject) { //显示所有预览页
  let pages = $('.ptt td:gt(0):lt(-1)>a').toArray();
  if (pages.length <= 1) return resolve();
  $('<input type="button" class="ehThumbBtn" value="Hide" style="width:36px;height:15px;padding:3px 2px;margin:0 2px 4px 2px;float:left;border-radius:5px;border:1px solid #989898;">').on('click', function(e) {
    $('.gdtContainer').toggle();
    $(e.target).val($(e.target).val() === 'Show' ? 'Hide' : 'Show');
  }).prependTo('#gdo2');
  $('<div class="gdtContainer"></div>').html('<div></div>'.repeat(pages.length)).insertBefore('#gdt');
  $('#gdt').appendTo(`.gdtContainer>div:nth-child(${$('.ptds:eq(0)').text()})`);
  pages.forEach(i => {
    if (i.pathname === location.pathname && i.search === location.search) return;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', i.href, true);
    xhr.responseType = 'document';
    xhr.onload = function(e) {
      $('#gdt', e.target.response).appendTo(`.gdtContainer>div:nth-child(${$('.ptds:eq(0)', e.target.response).text()})`);
    }
    xhr.send(null);
  });
  let interval = setInterval(() => {
    if ($('.gdtContainer>div:empty').length === 0) {
      clearInterval(interval);
      resolve();
    }
  }, 200);
}

function showConfig() { //显示设置
  let listStyle = $('#nb>img')[0].outerHTML;
  $(listStyle).appendTo('#nb');
  $('<a href="javascript:;">[EH]Enhance Config</a>').on('click', function(e) {
    if ($('.ehConfig').length) {
      $('.ehConfig').toggle();
      return;
    }
    let config = GM_getValue('config', {});
    let _html = [
      '<div><label for="ehConfig_ex2eh"><input type="checkbox" id="ehConfig_ex2eh">里站自动跳转到表站</label></div>',
      '<div><label for="ehConfig_preloadPaneImage"><input type="checkbox" id="ehConfig_preloadPaneImage">页面载入后自动载入预览图</label></div>',
      '<div><label for="ehConfig_openInTab"><input type="checkbox" id="ehConfig_openInTab">在新标签页中打开，而不是弹窗</label></div>',
      '<div><label for="ehConfig_autoStartDownload"><input type="checkbox" id="ehConfig_autoStartDownload">Location Hash不为空时，自动开始下载</label></div>',
      '<div><label for="ehConfig_autoClose" title="Firefox: 需打开about:config并设置dom.allow_scripts_to_close_windows为true"><input type="checkbox" id="ehConfig_autoClose">Location Hash不为空时，下载完成后自动关闭标签</label></div>',
      '<div><label for="ehConfig_showAllThumb"><input type="checkbox" id="ehConfig_showAllThumb">信息页显示所有预览图</label></div>',
      '<div><label for="ehConfig_checkExist"><input type="checkbox" id="ehConfig_checkExist">显示按钮: 检查本地是否存在 (需要后台运行<a href="https://github.com/dodying/Nodejs/blob/master/checkExistSever/index.js" target="_blank">checkExistSever</a>, <a href="https://www.voidtools.com/downloads/#downloads" target="_blank">Everything</a>, 以及下载<a href="https://www.voidtools.com/downloads/#cli" target="_blank">Everything CLI</a>)</label></div>',
      '<div><label for="ehConfig_checkExistAtStart"><input type="checkbox" id="ehConfig_checkExistAtStart">检查本地是否存在: 页面载入后检查一次</label></div>',
      '<div><label for="ehConfig_checkExistName2"><input type="checkbox" id="ehConfig_checkExistName2">检查本地是否存在: 只搜索主要名称(去除集会号/作者/原作名/翻译组织/语言等)</label></div>',
      '<div><label for="ehConfig_checkExistOld"><input type="checkbox" id="ehConfig_checkExistOld">检查本地是否存在: 使用旧式方法</label>; 一次检查 <input name="ehConfig_checkExistLimit" type="number" placeholder="3"> 本</div>',
      '<div><label for="ehConfig_saveLink"><input type="checkbox" id="ehConfig_saveLink">显示按钮: 保存链接</label></div>',
      '<div><label for="ehConfig_tagTranslateImage"><input type="checkbox" id="ehConfig_tagTranslateImage">标签翻译显示图片</label></div>',
      '<div>当用<select name="ehConfig_auto2Fav"><option value="0">左键</option><option value="1">中键</option><option value="2">右键</option></select>点击Open时，自动添加到收藏</div>',
      '<div>收藏夹: <input name="ehConfig_bookmark" type="text" placeholder="0.Series\\n1.Cosplay\\n2.Image Set\\n3.Game CG\\n4.Doujinshi\\n5.Harem\\n6.Incest\\n7.Story arc\\n8.Anthology\\n9.Artist"></div>',
      '<div>收藏按钮事件: <input name="ehConfig_bookmarkEvent" title="事件格式: 鼠标按键,键盘按键,收藏事件<br>多个事件以|分割<br>鼠标按键:<ul><li>0 -> 左键</li><li>1 -> 中键</li><li>2 -> 右键</li></ul>键盘按键:<ul><li>-1 -> 任意</li><li>0 -> altKey</li><li>1 -> ctrlKey</li><li>2 -> shiftKey</li></ul>收藏事件:<ul><li>留空 -> 上次选择</li><li>-1 -> 自行选择</li><li>0-9 -> 0-9</li><li>10 -> 移除</li><li>b -> 加入黑名单</li></ul>" type="text" placeholder="0,-1,10|1,-1,-1|2,1,b|2,-1|2,2,0"><input name="ehConfig_bookmarkEventChs" type="hidden"></div>',
      '<div>大图(双页)宽高比: <input name="ehConfig_rateD" type="number" placeholder="1.1">; 小图(单页)宽高比: <input name="ehConfig_rateS" type="number" placeholder="0.9"></div>',
      '<div>大图(双页)尺寸: <select name="ehConfig_sizeD"><option value="0">Auto</option><option value="5">2400x</option><option value="4">1600x</option><option value="3">1280x</option><option value="2">980x</option><option value="1">780x</option></select>; 小图(单页)尺寸: <select name="ehConfig_sizeS"><option value="0">Auto</option><option value="5">2400x</option><option value="4">1600x</option><option value="3">1280x</option><option value="2">980x</option><option value="1">780x</option></select></div>',
      '<div>默认设置: <input name="ehConfig_uconfig" title="在Settings页面使用$.serialize获取，可留空<br>留空表示每次使用当前设置" type="text"></div>',
      '<div>搜索栏自动完成: 字符数 > <input name="ehConfig_acLength" type="number" placeholder="3"> 时，显示</div>',
      '<div>搜索栏自动完成显示项目: <input name="ehConfig_acItem" type="text" placeholder="language,artist,female,male,parody,character,group,misc" title="以,分割"></div>',
      '<div>批量下载数: <input name="ehConfig_batch" type="number" placeholder="4"></div>',
      '<div>隐藏评分 < <input name="ehConfig_lowRating" type="number" placeholder="4.0"> 的本子; 隐藏页数 < <input name="ehConfig_fewPages" type="number" placeholder="5"> 的本子</div>',
      '<div class="ehConfigBtn"><input type="button" name="save" value="Save" title="保存"><input type="button" name="cancel" value="Cancel" title="取消"></div>'].join('');
    $('<div class="ehConfig"></div>').html(_html).appendTo('body').on('click', function(e) {
      if ($(e.target).is('.ehConfigBtn>input[type="button"]')) {
        if (e.target.name === 'save') {
          $('.ehConfig input:not([type="button"]),.ehConfig select').toArray().forEach(i => {
            let name, value;
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
            config[name.replace('ehConfig_', '')] = value;
          });
          let bookmarkEvent = config['bookmarkEvent'].split('|');
          let bookmarkEventChs = [];
          for (let i of bookmarkEvent) {
            let arr = i.split(',').map(i => isNaN(i * 1) ? i : i * 1);
            let chs = [];
            chs.push('鼠标' + '左中右'.split('')[arr[0]] + '键');
            chs.push(arr[1] === -1 ? '任意按键' : ['altKey', 'ctrlKey', 'shiftKey'][arr[1]]);
            if (arr[2] === undefined) {
              chs.push('上次选择');
            } else if (arr[2] === -1) {
              chs.push('自行选择');
            } else if (arr[2] >= 0 && arr[2] <= 9) {
              chs.push(arr[2]);
            } else if (arr[2] === 10) {
              chs.push('移除');
            } else if (arr[2] === 'b') {
              chs.push('加入黑名单');
            }
            bookmarkEventChs.push(chs[0] + ' + ' + chs[1] + ' -> ' + chs[2]);
          }
          config.bookmarkEventChs = bookmarkEventChs.join('<br>');
          Object.assign(CONFIG, config);
          GM_setValue('config', config);
        }
        $('.ehConfig').remove();
      }
    });
    $('.ehConfig input:not([type="button"]),.ehConfig select').toArray().forEach(i => {
      let name, value;
      name = i.name || i.id;
      name = name.replace('ehConfig_', '');
      if (!(name in config)) return;
      value = config[name];
      if (i.type === 'text' || i.type === 'hidden' || i.type === 'select-one' || i.type === 'number') {
        i.value = value;
      } else if (i.type === 'checkbox') {
        i.checked = value;
      }
    });
  }).appendTo('#nb');
}

function showTooltip() { //显示提示
  $('<div class="ehTooltip"></div>').appendTo('body');
  let preEle;
  $('body').on('mousemove keydown', function(e) {
    if (e.target === preEle && e.type !== 'keydown') return;
    let title = $(preEle).attr('raw-title');
    $(preEle).removeAttr('raw-title').attr('title', title);
    $('.ehTooltip').hide();
  });
  $('body').on('mouseenter', ':visible[title],:visible[raw-title],[copy]', function(e) {
    preEle = e.target;
    let title;
    if ($(preEle).is('[copy]:not([title])')) {
      title = '点击复制<br>' + $(preEle).attr('copy');
      $(preEle).attr('raw-title', title);
    } else {
      title = $(preEle).attr('title') || $(preEle).attr('raw-title');
      $(preEle).removeAttr('title').attr('raw-title', title);
    }
    $('.ehTooltip').html(title);

    let top = $(preEle).offset().top - $('body').scrollTop();
    let height = $(preEle).height() + parseInt($(preEle).css('padding-bottom')) + parseInt($(preEle).css('border-bottom-width')) + parseInt($(preEle).css('margin-bottom'));
    let _height = $('.ehTooltip').height() + parseInt($('.ehTooltip').css('padding-bottom')) + parseInt($('.ehTooltip').css('border-bottom-width')) + parseInt($('.ehTooltip').css('margin-bottom'));
    top = top + height + 5 + _height > window.innerHeight ? top - _height - 5 : top + height + 5;

    let left = $(preEle).offset().left - $('body').scrollLeft();
    let width = $(preEle).width() + parseInt($(preEle).css('padding-left')) + parseInt($(preEle).css('border-left-width')) + parseInt($(preEle).css('margin-left'));
    let _width = $('.ehTooltip').width() + parseInt($('.ehTooltip').css('padding-left')) + parseInt($('.ehTooltip').css('border-left-width')) + parseInt($('.ehTooltip').css('margin-left'));
    left = left + _width > window.innerWidth ? left + width - _width : left;
    $('.ehTooltip').show().offset({
      top: top,
      left: left
    });
  });
}

function tagEvent() { //标签事件
  $('<div class="ehTagEvent"></div>').insertBefore('#tagmenu_act');
  let tags = {};
  ['Unlike', 'Alert', 'Like'].forEach(i => {
    tags[i] = GM_getValue('tag' + i, []);
    $('<a class="ehTagEventNotice" name="' + i + '" href="javascript:;" on="true"></a>').appendTo('.ehTagEvent').on('click', e => {
      let tag = GM_getValue('tag' + i, []);
      let keyword = $('.ehTagEvent').attr('name');
      if ($(e.target).attr('on') === 'true' && !tag.includes(keyword)) {
        tag.push(keyword);
        $('#taglist div[id="td_' + keyword.replace(/ /g, '_') + '"]').attr('name', i);
      } else if ($(e.target).attr('on') === 'false' && tag.includes(keyword)) {
        tag.splice(tag.indexOf(keyword), 1);
        $('#taglist div[id="td_' + keyword.replace(/ /g, '_') + '"]').removeAttr('name');
      }
      GM_setValue('tag' + i, tag);
    });
  });
  $('<a href="https://github.com/Mapaler/EhTagTranslator/" target="_blank">Copy for ETT</a>').appendTo('.ehTagEvent').on('click', e => {
    GM_setClipboard(`| ${$('.ehTagEvent').attr('name')} | | | |`);
    return false;
  });
  $('#taglist a').on({
    contextmenu: e => { //搜索标签+中文
      var keyword = e.target.innerText.replace(/\s+\|.*/, '');
      keyword = '"' + keyword + '"';
      if (/:/.test(e.target.id)) keyword = e.target.id.replace(/ta_(.*?):.*/, '$1') + ':' + keyword + '$';
      openUrl('/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=0&f_non-h=0&f_imageset=0&f_cosplay=0&f_asianporn=0&f_misc=0&f_search=' + encodeURIComponent(keyword + ' language:"chinese"$') + '&f_apply=Apply+Filter');
      return false;
    },
    click: e => { //标签
      $('.ehTagEvent').css('display', e.target.style.color ? 'block' : 'none').attr('name', e.target.id.replace('ta_', '').replace(/_/g, ' '));
      let name = $(e.target).parent().attr('name');
      $('.ehTagEvent>a[name="' + name + '"]').attr('on', 'false');
      $('.ehTagEvent>a:not([name="' + name + '"])').attr('on', 'true');
    }
  });
  $('#taglist div[id]').toArray().forEach(i => {
    let id = i.id.replace(/^td_/, '').replace(/_/g, ' ');
    for (let j in tags) {
      if (tags[j].includes(id)) {
        $(i).attr('name', j);
        break;
      }
    }
  });
}

function tagPreview(gmetadata) { //标签预览
  $('<div class="ehTagPreview"></div>').appendTo('body');
  $('body').on({
    mousemove(e) {
      if (!$(e.target).is('.it5>a')) {
        $('.ehTagPreview').hide();
        return;
      }
      let info = gmetadata.filter(i => i.gid === e.target.href.split('/')[4] * 1)[0];
      if (!info) return;
      $('.ehTagPreview').html(`<div>${info.title_jpn}</div><div style="color:#F00;">[${Math.ceil(info.filesize/1024/1024)}M] ${info.filecount}P ${info.rating}</div><div style="height:2px;background-color:#000000;"></div>`).show();
      let tagsHTML = $('<div></div>').appendTo('.ehTagPreview');
      info.tags.forEach(i => {
        let tag = i.split(':');
        let main = tag.length === 1 ? 'misc' : tag[0];
        let sub = tag[tag.length - 1];
        let chs = findData(main, sub, true);
        if ($(`.ehTagPreviewLi[name="${main}"]`, tagsHTML).length === 0) $(`<li class="ehTagPreviewLi" name="${main}"></li>`).appendTo(tagsHTML);
        $('<span></span>').text(chs.cname || sub).appendTo($(`.ehTagPreviewLi[name="${main}"]`, tagsHTML));
      });
      let _width = $('.ehTagPreview').outerWidth();
      let _height = $('.ehTagPreview').outerHeight();
      $('.ehTagPreview').css({
        left: _width + e.clientX + 10 < window.innerWidth ? e.clientX + 5 : e.clientX - _width - 5,
        top: _height + e.clientY + 10 < window.innerHeight ? e.clientY + 5 : e.clientY - _height - 5
      });
    }
  });
}

function tagTranslate() { //标签翻译
  let data = $('#taglist a').toArray().map(i => {
    let info = i.id.split(/ta_|:/);
    if (info.length === 2) info.splice(1, 0, 'misc');
    return findData(info[1], info[2], !CONFIG['tagTranslateImage']);
  }).filter(i => Object.keys(i).length);
  let css = [
    'div#taglist{overflow:visible;min-height:295px;height:auto}',
    'div#gmid{min-height:330px;height:auto;position:static}',
    '#taglist a{background:inherit}',
    '#taglist a::before{font-size:12px;overflow:hidden;line-height:20px;height:20px}',
    '#taglist a::after{display:block;color:#ff8e8e;font-size:14px;background:inherit;border:1px solid #000;border-radius:5px;position:absolute;float:left;z-index:999;padding:8px;box-shadow:3px 3px 10px #000;min-width:150px;max-width:500px;white-space:pre-wrap;opacity:0;transition:opacity .2s;transform:translate(-50%,20px);top:0;left:50%;pointer-events:none;padding-top:8px;font-weight:400;line-height:20px}',
    '#taglist a:hover::after,#taglist a:focus::after{opacity:1;pointer-events:auto}',
    '#taglist a:focus::before,#taglist a:hover::before{font-size:12px;position:relative;background-color:inherit;border:1px solid #000;border-width:1px 1px 0 1px;margin:-4px -5px;padding:3px 4px;color:inherit;border-radius:5px 5px 0 0}',
    'div.gt,div.gtw,div.gtl{line-height:20px;height:20px}',
    '#taglist a:hover::after{z-index:9999998}',
    '#taglist a:focus::after{z-index:9999996}',
    '#taglist a:hover::before{z-index:9999999}',
    '#taglist a:focus::before{z-index:9999997}',
    `#taglist a::after{color:#${location.host === 'exhentai.org' ? 'fff' : '000'};}`,
    ...data.map(i => `a[id="ta_${i.name}"]{font-size:0;}`),
    '#taglist a::before{text-decoration:line-through;}'
  ];
  data.forEach(i => {
    css.push(`a[id="ta_${i.name}"]::before{content:"${i.cname}"}`);
    if (i.info) css.push(`a[id="ta_${i.name}"]::after{content:"${i.info}"}`);
  });
  $('<style name="EHT"></style>').text(css.join('')).appendTo('head');
}

function toggleBlacklist(keyword) { //加入黑名单或从黑名单中移除
  let blacklist = GM_getValue('blacklist', []);
  keyword = keyword.replace(/[\$\(\)\*\+\.\[\]\?\^\{\}\|]+/g, '\\$&');
  if (!blacklist.includes(keyword)) { //加入黑名单
    blacklist.push(keyword);
  } else if (blacklist.includes(keyword)) { //从黑名单中移除
    blacklist.splice(blacklist.indexOf(keyword), 1);
  }
  GM_setValue('blacklist', blacklist);
}

function saveLink() { //保存链接
  $('<input type="button" title="创建链接" value="Shortcut">').click(function() {
    var content = [
      '[InternetShortcut]\r\nURL={{url}}',
      '<?xml version=\'1.0\' encoding=\'UTF-8\'?><!DOCTYPE plist PUBLIC \'-//Apple//DTD PLIST 1.0//EN\' \'http://www.apple.com/DTDs/PropertyList-1.0.dtd\'><plist version=\'1.0\'><dict><key>URL</key><string>{{url}}</string></dict></plist>',
      '[Desktop Entry]\r\nType=Link\r\nURL={{url}}'
    ];
    var platform = navigator.platform;
    var fileType;
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
    let blob = new Blob([content[platform].replace('{{url}}', location.href)], {
      type: 'application/octet-stream'
    });
    $(`<a href="${URL.createObjectURL(blob)}" download="${document.title + fileType}"></a>`)[0].click();
  }).prependTo('.ehNavBar>div:eq(2)');
}

function xhr(url, onload, parm = null, opt = {}) {
  GM_xmlhttpRequest({
    method: parm ? 'POST' : 'GET',
    url: url,
    data: parm,
    timeout: opt.timeout || 60 * 1000,
    responseType: opt.responseType || 'text',
    headers: opt.headers || {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    onload(res) {
      onload(res);
    },
    ontimeout(res) {
      if (typeof opt.ontimeout === 'function') opt.ontimeout(res);
    },
    onerror(res) {
      if (typeof opt.onerror === 'function') opt.onerror(res);
    }
  });
}

function xhrSync(url, parm = null, opt = {}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: parm ? 'POST' : 'GET',
      url: url,
      data: parm,
      timeout: opt.timeout || 60 * 1000,
      responseType: opt.responseType || 'text',
      headers: opt.headers || {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      onload(res) {
        resolve(res);
      },
      ontimeout(res) {
        reject(res);
      },
      onerror(res) {
        reject(res);
      }
    });
  });
}

init();
