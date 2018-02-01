// ==UserScript==
// @name        [EH]Enhance
// @version     1.05
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
//              里站
// @include     https://exhentai.org/
// @include     https://exhentai.org/favorites.php*
// @include     https://exhentai.org/?*
// @include     https://exhentai.org/g/*
//              表站
// @include     https://e-hentai.org/
// @include     https://e-hentai.org/favorites.php*
// @include     https://e-hentai.org/?*
// @include     https://e-hentai.org/g/*
// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @resource EHT https://raw.githubusercontent.com/dodying/UserJs/master/E-hentai/EHT.json?v=1517486954165
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @run-at      document-end
// ==/UserScript==
/**
 * dom.allow_scripts_to_close_windows
 */
const CONFIG = GM_getValue('config', {});
const EHT = JSON.parse(GM_getResourceText('EHT')).dataset;

function init() {
  addStyle();
  $('<div class="ehNavBar"><div></div><div></div><div></div></div>').appendTo('body');
  $(window).on({
    scroll: () => {
      $('.ehNavBar').attr('style', $(window).scrollTop() >= 30 && location.pathname.match('/g/') ? 'top:0;' : 'bottom:0;');
    }
  });
  GM_registerMenuCommand('[EH]Enhance Settings', showConfig, 'S');
  if (location.pathname.match('/g/')) { //信息页
    if (CONFIG['ex2eh'] && jumpHost()) return;
    tagTranslate();
    if (!GM_getValue('apikey')) {
      GM_setValue('apikey', unsafeWindow.apikey);
      GM_setValue('apiuid', unsafeWindow.apiuid);
    }
    checkImageSize();
    btnAddFav();
    btnSearch();
    changeName('#gn');
    if (location.hash.match('#') && CONFIG['autoDownload']) autoDownload();
    if (location.hash === '#' + CONFIG['autoClose']) autoClose();
    tagAct();
    copyInfo();
    downloadInfo();
    abortPending(); //终止EHD所有下载
  } else { //搜索页
    changeName('.it5>a');
    btnAddFav2();
    btnSearch2();
    keywordFunction();
    quickDown(); //右键：下载
    batchDown();
    rateInSearchPage();
  }
  saveLink();
  showInfo();
  //exportRule();
  $('.ehNavBar .ehCopy').on({
    click: e => {
      let _ = e.target;
      let text = _.textContent;
      GM_setClipboard(text);
      _.textContent = '已复制';
      setTimeout(() => {
        _.textContent = text;
      }, 800);
    }
  });
  $('.ehNavBar button:not(.ehCopy)').on({
    contextmenu: () => false
  });
  $('<a>1</a>').css('visibility', 'hidden').appendTo('.ehNavBar>div:empty');
}

function abortPending() {
  $('<button>Force Abort</button>').on({
    click: () => {
      $('.ehD-pt-status-text:contains("Pending...")+span').click();
    }
  }).appendTo('.ehNavBar>div:eq(1)');
}

function add2Fav(gid, token, i, target) {
  if (i === '10') i = 'favdel';
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `/gallerypopups.php?gid=${gid}&t=${token}&act=addfav`);
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = () => {
    target = $(target);
    if (i === 'favdel') {
      target.attr('class', 'btnAddFav').removeAttr('id').removeAttr('style');
    } else {
      target.attr('id', 'favicon_' + gid).attr('class', 'i').css('background-position', `0px -${i * 19 + 2}px`);
    }
  }
  xhr.send(`favcat=${i}&favnote=&submit=Apply+Changes&update=1`);
}

function addStyle() {
  $('<style></style>').text(['.ido,.itg{max-width:9999px!important;}',
      '.itg>tbody>tr.batchHover{background-color:#669933}',
      '.itg>tbody>tr:hover{background-color:#4A86E8}.itd>label{cursor:pointer;}',
      '.ehD-dialog{bottom:23px!important;}',
      '.ehD-status{bottom:334px!important;}',
      '.ehD-force-download-tips{bottom:311px!important;}',
      '.ehCenter{text-align:center;}',
      '.ehNavBar{display:flex;width:99%;background-color:#34353B;position:fixed;z-index:1000;padding:0 10px 5px 10px;}',
      '.ehNavBar>div{width:33.3%;}',
      '.ehNavBar>div:nth-child(1){text-align:left;}',
      '.ehNavBar>div:nth-child(2){text-align:center;}',
      '.ehNavBar>div:nth-child(3){text-align:right;}',
      '.ehNavBar button,.ehBtn{font-size:12px;border:2px outset black;height:21px;margin:0 10px;padding:0 4px 1px 4px;}',
      '.ehNavBar .ehCopy{color:#F0F0F0;background-color:#000;}',
      '.btnSearch{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVQ4jX1TvW7iQBBeJCLBPQOF66PwzuwWRjTrwjUVz8Aj2D2iRLmTsJLIut4UfgCfkIJ0D0ARUkR5AlMvLrJSvmvAR0wuI02xs/N98y9ES5hZMfMDM78S0dtJX4joTkop2/6NKKW+EdEvpRS+UiK6HwwG/SuwlPLPpaPWClpraH1NIqV89DyvJ4ToCCGEaEeezWYoigLb7RZ5nmM6nV6RMHNqjOkKZlaXH1mWwVqL/X6PzWaDqqrgnEOSJGhn6Ps+CWZ+uIxsrcVyuWwcgyBAWZao6xpRFJ3AGlprMPNKMPPrmbEoCuz3+6t0wzCEcw6LxaIBa63AzM+CiN7OrNvtFpvN5tPuV1WFNF01BKeJ1BcECnmeo6oqBEHwATyZTGCtRRzHDfhEcBRE9HI2TKdTOOdQliXCMGzAu90Oh8MB4/G4Pc4nQUR3l8YkSVDXNZxzqKoK1locDgccj0fkef4hA2a+FVJK2a43iiIsFguk6QpxHGM8HmO9XgMAsiw7g9+Hw+H38yLdt0n+dVs37yzLMJ/PoZSC7/s/m00cDAZ9KeXj/8CfrPJvz/N6xphucw+e5/WYOf3qBpj5nZl/eJ7XG41GfaXUzeVNdYwxXd/3iZlXzPxMRDURHaWUT8x8e6q5Y4zpKqVujDHdv6rJoiTHuLTjAAAAAElFTkSuQmCC);}',
      '.btnAddFav{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVQ4ja2TSwrDMAxERyNvEgg9jFdC25y9tMdpcwB3k4/j2GkoFQiMkZ9GHwPAE0D60R84CxCR1U/itkNmYmZdjLE3sw6A4GhNAN19GMd4c/cBACuPsSgsAeXj9+ylkeQBIJXMtfLo7oOq7gFm1lVkN8sjufVARFKMsc9kVzuuyilLsgfM3WYLEIImVX3VyltqaY6qMZXTPVgBIWhqjPQrgKqcCtkHdS3AlWX6/yYmAIlkUtWUzbnq+SY+lsuLvy+Lw/0DpJalxJ3rpocAAAAASUVORK5CYII=);}',
      '.id44>.btnAddFav,.id44>.i[id^="favicon_"],.id44>.btnSearch{float:right;margin:4px 2px 0 0;}',
      '.i[id^="favicon_"],#fav>.i{cursor:pointer;background-image:url("data:image/png;base64,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")!important;}',
      '.ehConfig{z-index:3;position:fixed;top:100px;left:calc(50% - 300px);width:600px;background-color:#34353b;}',
      '.ehConfigBtn>button{font-size:8pt;color:#f1f1f1;background:#34353b;border:2px outset #000000;height:21px;margin:4px 1px 0 1px;padding:0 4px 1px 4px;}',
      '.ehTagAct{display:none;font-weight:bold;}',
      '.ehTagAct:before{content:url("https://ehgt.org/g/mr.gif") " " attr(name) ": ";}',
      '.ehTagAct>a{cursor:pointer;}',
    ].join('')).appendTo('head');
  $('.i:has(.n),.id44>div>a:has(.tn)').hide(); //隐藏种子图标
}

function autoClose() {
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

function autoDownload() {
  setTimeout(() => {
    if ($('.ehD-box>.g2').length > 0) {
      setTimeout(() => {
        $('.ehD-box>.g2:eq(0)').click();
      }, 2000);
    } else {
      autoDownload();
    }
  }, 800);
}

function batchDown() { //待续
  sessionStorage.batchTime = 0;
  var tr = $('.itg>tbody>tr');
  if (tr.length > 0) {
    var notFavoritesPage = $('.itg>tbody>tr>td>input').length === 0;
    tr.each(function(i) {
      var _this = this;
      if (notFavoritesPage) {
        var div = $((i === 0) ? '<th></th>' : '<td></td>').css('text-align', 'center').html('<input id="EH_FavHelper_' + i + '" type="checkbox">').appendTo(this);
      } else {
        $(_this).find('td:eq(-1)>input').attr('id', 'EH_FavHelper_' + i);
      }
      if ($(_this).find('.itd').length > 0) {
        var _ = $(_this).find('.itd:eq(0)');
        _.html('<label for="EH_FavHelper_' + i + '">' + _.html() + '</label>');
      }
    });
    tr.find('th>input').on('click', function() { //全选
      var _this = this;
      $('tr.gtr0 input,tr.gtr1 input').each(function() {
        this.checked = (_this.checked === true) ? true : false;
      });
    });
    tr.find('td:eq(-1)>input').on('change', function(e) { //高亮选中
      $(e.target).parents(1).toggleClass('batchHover');
    });
  }
  $('<button>Batch</button>').appendTo('.ehNavBar>div:eq(2)').on({
    contextmenu: function() {
      sessionStorage.batchTime = 0;
      return false;
    },
    click: function() {
      var input = [];
      $('tr.gtr0:visible,tr.gtr1:visible').each(function() {
        var i = $(this);
        if ((i.find('.i[id^="favicon_"]').length === 0 || i.find('.i[id^="favicon_"]').css('background-position-y') === '-2px') && i.find('.ehLBAdd').length > 0) {
          input.push(i.find('td>input'));
        } else {
          i.find('td>input')[0].checked = false;
          i.removeClass('batchHover');
        }
      });
      if (sessionStorage.batchTime > input.length + 3) sessionStorage.batchTime = 0;
      input.forEach(function(_input, i) {
        if (i <= sessionStorage.batchTime + 3 && i >= sessionStorage.batchTime) {
          _input[0].checked = true;
          _input.parents().eq(1).addClass('batchHover');
        } else {
          _input[0].checked = false;
          _input.parents().eq(1).removeClass('batchHover');
        }
      });
      sessionStorage.batchTime += 4;
    }
  });
  $('<button>Open</button>').appendTo('.ehNavBar>div:eq(2)').on({
    contextmenu: () => false,
    mousedown: function(e) {
      $('.showInfo').click();
      $('.itg>tbody>tr:visible>td>input:checked').each(function(i) {
        var href = $(this).parents().eq(1).find('.itd>div>.it5>a').attr('href');
        var target = $(this).parents().eq(1).find('.it3').find('.btnAddFav,.i[id^="favicon_"]')[0];
        openUrl(href + '#' + e.button);
        if (e.button === 0) { //待续
          var arr = href.split('/');
          add2Fav(arr[4], arr[5], GM_getValue('lastFavcat', 0), target);
          sessionStorage.batchTime--;
        }
      });
    }
  });
  $('<button>Delete</button>').appendTo('.ehNavBar>div:eq(2)').on({
    click: function() {
      $('.itg>tbody>tr:visible>td>input:checked').each(function(i) {
        var href = $(this).parents().eq(1).find('.itd>div>.it5>a').attr('href');
        var target = $(this).parents().eq(1).find('.it3').find('.btnAddFav,.i[id^="favicon_"]')[0];
        var arr = href.split('/');
        add2Fav(arr[4], arr[5], '10', target);
      });
    }
  });
}

function btnAddFav0(e, url) {
  let event = CONFIG['bookmarkEvent'].split('|').filter(i => i.match(new RegExp(`^${e.button},`)));
  for (let i = 0; i < event.length; i++) {
    let arr = event[i].split(',');
    let keydown = arr[1] === '-1' ? true : e[['altKey', 'ctrlKey', 'shiftKey'][arr[1]]];
    if (keydown) {
      let favcat = arr[2] || GM_getValue('lastFavcat', 0);
      if (favcat === '-1') {
        favcat = prompt(`请选择：\n${CONFIG['bookmark'].replace(/\\n/g,'\n')}\n10.从收藏中移除`);
        if (!favcat) return;
        GM_setValue('lastFavcat', favcat);
      }
      add2Fav(url[4], url[5], favcat, e.target);
      break;
    }
  }
}

function btnAddFav() {
  let fav = -1;
  if ($('#gdf>#fav>.i').length > 0) fav = 0 - (parseInt($('#gdf>#fav>.i').css('background-position-y')) + 2) / 19;
  let url = location.href.split('/');
  $('#gdf').empty().removeAttr('onclick').on({
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

function btnAddFav2() {
  $('<div class="btnAddFav"></div>').appendTo('.it3:not(:has(.i[id^="favicon_"])),.id44:not(:has(.i[id^="favicon_"]))');
  $('.btnAddFav,.i[id^="favicon_"]').removeAttr('onclick').on({
    contextmenu: () => false,
    mousedown: e => {
      let href = $(e.target).parentsUntil('.itd,#pp').eq(-1).find('.it5>a,.id2>a').attr('href');
      btnAddFav0(e, href.split('/'));
    }
  });
}

function btnSearch() {
  let text = $('#gn').text() || $('#gj').text();
  if (text === '') return;
  $('<div class="ehSearch"></div>').appendTo('#gd2');
  text = text.split(/[\[\]\(\)\{\}【】\|\-\d]+/);
  for (let i = 0; i < text.length; i++) {
    text[i] = text[i].trim();
    if (text[i]) $('<span></span>').html(`<input id="ehSearch_${i}" type="checkbox"><label for="ehSearch_${i}">${text[i]}</label>`).appendTo('.ehSearch');
  }
  $('<button class="ehBtn">Search</button>').appendTo('.ehSearch').click(() => {
    let keyword = [];
    $('.ehSearch input:checked+label').each(function() {
      keyword.push(this.textContent);
    })
    if (keyword.length > 0) openUrl('/?f_search=%22' + encodeURIComponent(keyword.join('" "')) + '%22');
  });
}

function btnSearch2() {
  $('<div class="btnSearch"></div>').appendTo('.it3,.id44').on({
    contextmenu: () => false,
    mousedown: e => {
      let name = $(this).parentsUntil('.itd,#pp').eq(-1).find('.it5>a,.id2>a').text();
      name = name.replace(/\[.*?\]|\(.*?\)|\{.*?\}|【.*?】|\d+|\-|!/g, '').replace(/\|.*/, '').trim();
      name = '"' + name + '"';
      if (e.button === 2) name += ' language:chinese$';
      openUrl('/?f_search=' + encodeURIComponent(name));
    }
  });
}

function changeConfig(key, value) {
  let uconfig = (document.cookie.match('uconfig')) ? document.cookie.match(/uconfig=(.*?)(; |$)/)[1] : CONFIG['uconfig'];
  let u = {};
  uconfig.split('-').forEach(function(i) {
    let _ = i.split('_');
    u[_[0]] = _[1];
  });
  u[key] = value;
  uconfig = [];
  for (let i in u) {
    uconfig.push(i + '_' + u[i]);
  }
  uconfig = uconfig.join('-');
  document.cookie = 'uconfig=' + uconfig + '; max-age=31536000; domain=.' + location.host + '; path=/';
}

function changeName(e) {
  $(e).each(function() {
    this.textContent = this.textContent.replace(/^\(.*?\)( |)/, '').replace(' Ni ', ' 2 ').replace(' San ', ' 3 ').replace(' Yon ', ' 4 ').replace(' Go ', ' 5 ').replace(' Roku ', ' 6 ').replace(' Nana ', ' 7 ').replace(' Hachi ', ' 8 ').replace(' Ku ', ' 9 ').replace(/\s+/g, ' ').trim(); //.replace(/[\\/:\*\?"<>\|]+/g, '-')
  });
}

function checkImageSize() {
  let s = CONFIG['sizeS'];
  let d = CONFIG['sizeD'];
  if (!GM_getValue('imageSize', false)) {
    changeConfig('xr', s);
    GM_setValue('imageSize', s);
  }
  let imageSize = GM_getValue('imageSize');
  let numS = 0; //单页
  let numD = 0; //双页
  $('.gdtm>div>a>img').each(function() {
    let rate = $(this).width() / $(this).height(); //宽高比
    if (rate > CONFIG['rateD']) {
      numD++;
    } else if (rate < CONFIG['rateS']) {
      numS++;
    }
  });
  if (2 * numD > $('.gdtm>div>a>img').length) { //双页超过一半
    if (imageSize !== d) {
      document.title = d + '|' + document.title;
      changeConfig('xr', d);
      GM_setValue('imageSize', d);
    }
  } else if (imageSize !== s) {
    document.title = s + '|' + document.title;
    changeConfig('xr', s);
    GM_setValue('imageSize', s);
  }
}

function combineText(arr) {
  return arr instanceof Array ? arr.map(i => {
    if (i.type === 0) {
      return i.text;
    } else if (i.type === 2) {
      return `"url("${i.src.replace('http:','')}")"`;
    } else {
      return null;
    }
  }).filter(i => i).join('\\A') : '';
}

function copyInfo() {
  if ($('#gn').text().match(/\[(.*?)\]/) && $('#gj').text().match(/\[(.*?)\]/)) { //artist
    var name = $('#gn').text().match(/\[(.*?)\]/)[1];
    var nameJpn = $('#gj').text().match(/\[(.*?)\]/)[1];
    if (name.match(/\(.*?\)/)) name = name.match(/\((.*?)\)/)[1];
    if (nameJpn.match(/\(.*?\)/)) nameJpn = nameJpn.match(/\((.*?)\)/)[1];
    $('<button class="ehCopy"></button>').text(`[${name}]${nameJpn}`).appendTo('.ehNavBar>div:eq(0)');
  }
  if ($('.gt[id*="td_parody"]>a').length > 0) { //parody
    let info = $('.gt[id*="td_parody"]>a').attr('id').split(/ta_|:/);
    let parody = findData(info[1], info[2]);
    if (parody) {
      parody = parody.cname;
    } else {
      parody = ($('#gj').text().match(/\(.*?\)/g)) ? $('#gj').text().match(/\(.*?\)/g) : $('#gn').text().match(/\(.*?\)/g);
      parody = parody[parody.length - 1].match(/\((.*?)\)/)[1];
    }
    let parodyKeyword = $('.gt[id*="td_parody"]>a').text().replace(/ \| .*/, '');
    $('<button class="ehCopy"></button>').text(`【${parody}】${parodyKeyword}`).appendTo('.ehNavBar>div:eq(0)');
  }
}

function downloadInfo() {
  if ($('.ehD-box>.g2:eq(0)>a').length === 0) {
    setTimeout(() => {
      downloadInfo();
    }, 200);
  }
  let name = location.href.split('/')[4];
  setInterval(() => {
    if (!$('.ehD-status').length || !$('.ehD-status').text().match(/\d+/g)) return;
    let info = $('.ehD-status').text().match(/\d+/g);
    let download = GM_getValue('downloadInfo', {});
    download[name] = [info[2], info[0]];
    if (info[0] === info[2]) delete download[name];
    GM_setValue('downloadInfo', download);
  }, 800);
}

function exportRule() {
  $('<button>Export Rule</button>').appendTo('.ehNavBar>div:eq(1)').click(function() {
    let record = (localStorage.record) ? JSON.parse(localStorage.record) : [];
    let exportRule = GM_getValue('exportRule', []);
    exportRule = exportRule.concat(record).sort();
    for (let i = 1; i < exportRule.length; i++) {
      if (exportRule[i - 1] === exportRule[i]) {
        exportRule.splice(i, 1);
        i--;
      }
    }
    localStorage.record = '[]';
    GM_setValue('exportRule', exportRule);
    saveAs(new Blob(['[AutoProxy 0.2.9]\r\n' + exportRule.join('\r\n')], {
      type: 'text/plain;charset=utf-8'
    }), 'e-hentai.txt');
  });
  $('<button>Clear Rule</button>').appendTo('.ehNavBar>div:eq(1)').click(function() {
    localStorage.record = '[]';
  });
}

function findData(main, sub) {
  let data = EHT.filter(i => i.name === main);
  if (data.length === 0 || data[0].tags.length === 0) return false;
  data = data[0].tags.filter(i => i.name === sub.replace(/_/g, ' '));
  if (data.length === 0) return false;
  return {
    name: main + ':' + sub,
    cname: combineText(data[0].cname),
    info: combineText(data[0].info)
  };
}

function keywordFunction() {
  if ($('input.stdinput,form>input[name="favcat"]+div>input').val()) {
    let value = $('input.stdinput,form>input[name="favcat"]+div>input').val();
    if (value.match(/\w+:"?([\w \-\.]+)\$?"?\$? language:chinese\$$/))
      value = value.match(/\w+:"?([\w \-\.]+)\$?"?\$? language:chinese\$$/)[1];
    $('<button class="ehCopy"></button>').text(value).appendTo('.ehNavBar>div:eq(0)');
    document.title = value;
    $('<button>Find Parody</button>').appendTo('.ehNavBar>div:eq(1)').on({
      click: function() {
        let p = '/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=0&f_non-h=0&f_imageset=0&f_cosplay=0&f_asianporn=0&f_misc=0&f_search=parody%3A';
        let t = prompt('请输入系列').replace(/[\(\)\[\]!?]/g, '').trim().toLowerCase();
        p += (t.match(/ /)) ? '"' + t + '"%24' : t;
        p += '+language%3Achinese%24&f_apply=Apply+Filter';
        location = p;
      }
    });
  }
}

function jumpHost() {
  let gid = location.href.split('/')[4];
  let jump = GM_getValue('jump', []);
  if (location.host === 'exhentai.org') { //里站
    if (!jump.includes(gid)) { //尝试跳转
      if (!['ta_female:lolicon', 'ta_male:shotacon'].some(i => document.getElementById(i))) {
        location = '//e-hentai.org' + location.pathname;
        return true;
      }
    } else {
      jump.splice(jump.indexOf(gid), 1);
      GM_setValue('jump', jump);
    }
  } else if (location.host === 'e-hentai.org') { //表站
    if (document.querySelector('.d')) { //不存在则返回
      jump.push(gid);
      GM_setValue('jump', jump);
      location = '//exhentai.org' + location.pathname;
      return true;
    }
  }
}

function openUrl(url) {
  url = (url.match('//') ? '' : location.origin) + url;
  if (!CONFIG['openInTab']) {
    window.open(url, '', 'resizable,scrollbars,status');
  } else {
    GM_openInTab(url, true);
  }
}

function quickDown() {
  $('.itg').on('contextmenu', e => {
    e.preventDefault();
    if ($(e.target).filter('.it5>a,.id3>a')) openUrl(e.target.href + '#' + CONFIG['autoClose']);
  });
}

function rateInSearchPage() {
  $('.it4>.ir.it4r').on({
    mousemove: function(e) {
      var _ = $(this);
      if (!_.attr('rawRate')) _.attr('rawRate', _.css('background-position'));
      var star = Math.round(e.offsetX / 8);
      _.attr('title', star);
      var x = -80 + Math.ceil(star / 2) * 16;
      var y = star % 2 == 1 ? -21 : -1;
      _.css('background-position', x + 'px ' + y + 'px');
    },
    mouseout: function() {
      $(this).css('background-position', $(this).attr('rawRate'));
    },
    click: function(e) {
      var apikey = GM_getValue('apikey');
      if (!apikey) {
        alert('请在任意信息页获取到apikey与apiuid后再尝试');
        return;
      }
      var apiuid = GM_getValue('apiuid');
      var _ = $(this);
      var href = _.parent().prev().find('a').attr('href').split('/');
      var star = Math.round(e.offsetX / 8);
      var xhr = 'xhr_' + Math.random().toString();
      xhr = new XMLHttpRequest();
      xhr.open('POST', location.origin + '/api.php', true);
      xhr.onload = function() {
        var x = -80 + Math.ceil(star / 2) * 16;
        var y = star % 2 == 1 ? -21 : -1;
        _.attr('rawRate', x + 'px ' + y + 'px');
        _.addClass('irb');
      }
      var parm = {
        apikey: apikey,
        apiuid: apiuid,
        gid: href[4],
        method: 'rategallery',
        rating: star,
        token: href[5]
      };
      xhr.send(JSON.stringify(parm));
    }
  });
}

function showInfo() {
  $('<button class="showInfo">Show Info</button>').appendTo('.ehNavBar>div:eq(1)').click(function() {
    $(this).remove();
    var showInfoInterval = setInterval(function() {
      var download = GM_getValue('downloadInfo', {});
      if (Object.keys(download).length === 0) return;
      var body = [];
      for (var i in download) {
        body.push(i + ': ' + download[i][0] + '/' + download[i][1]);
      }
      setNotification('下载进度', body.join('\n'));
    }, 3000);
  });
  $(window).unload(function() {
    GM_setValue('downloadInfo', {});
  });
}

function showConfig() {
  let config = GM_getValue('config', {});
  $('<div class="ehConfig"></div>')
    .html(`
      <div><label for="ehConfig_ex2eh"><input type="checkbox" id="ehConfig_ex2eh">里站自动跳转到表站</label></div>
      <div><label for="ehConfig_openInTab"><input type="checkbox" id="ehConfig_openInTab">在新标签页中打开，而不是弹窗</label></div>
      <div><label for="ehConfig_autoDownload"><input type="checkbox" id="ehConfig_autoDownload">点击Open时，自动开始下载</label></div>
      <div>当用<select name="ehConfig_autoClose"><option value="0">左键</option><option value="1">中键</option><option value="2">右键</option></select>点击Open时，下载完成后自动关闭</div>
      <div>收藏夹: <input name="ehConfig_bookmark" type="text" placeholder="0.未下载\\n1.连载-系列\\n2.CG-COS-画集-女同\\n3.东方-LL-舰娘-偶像大师\\n4.同人\\n5.大师-萝莉\\n6.纯爱-Np-1♂\\n7.纯爱-乱伦\\n8.纯爱-2p-♂♀\\n9.难定-杂志"></div>
      <div>收藏按钮事件: <input name="ehConfig_bookmarkEvent" type="text" placeholder="0,-1,10|1,-1,-1|2,2,0|2,-1"></div>
      <div>大图宽高比: <input name="ehConfig_rateD" type="number" placeholder="1.1">; 小图宽高比: <input name="ehConfig_rateS" type="number" placeholder="0.9"></div>
      <div>大图尺寸: <input name="ehConfig_sizeD" type="text" placeholder="1280">; 小图尺寸: <input name="ehConfig_sizeS" type="text" placeholder="780"></div>
      <div>默认设置Cookie: <input name="ehConfig_uconfig" type="text" placeholder="sa_5e844a-tf_e78085-cats_126-xl_20x1044x2068x30x1054x2078x40x1064x2088x50x1074x2098x60x1084x2108x70x1094x2118x80x1104x2128x90x1114x2138x100x1124x2148x110x1134x2158x120x1144x2168x130x1154x2178x254x1278x2302x255x1279x2303-fs_f-xr_780"></div>
      <div class="ehConfigBtn"><button name="save">保存</button><button name="cancel">取消</button></div>
    `)
    .on({
      click(e) {
        if ($(e.target).is('.ehConfigBtn>button')) {
          if (e.target.name === 'save') {
            $('.ehConfig input,.ehConfig select').toArray().forEach(i => {
              let name, value;
              if (i.type === 'number') {
                name = i.name;
                value = (i.value || i.placeholder) * 1;
                if (isNaN(value)) return;
              } else if (i.type === 'text' || i.type === 'hidden') {
                name = i.name;
                value = i.value || i.placeholder;
                if (value === '') return;
              } else if (i.type === 'checkbox') {
                name = i.id;
                value = i.checked;
                if (value === false) return;
              } else if (i.type === 'select-one') {
                name = i.name;
                value = i.value;
              }
              config[name.replace('ehConfig_', '')] = value;
            });
            GM_setValue('config', config);
          }
          $('.ehConfig').remove();
        }
      }
    })
    .appendTo('body');
  $('.ehConfig input,.ehConfig select').toArray().forEach(i => {
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

function tagAct() {
  $('<div class="ehTagAct"></div>').insertBefore('#tagmenu_act');
  $('<a href="https://github.com/Mapaler/EhTagTranslator/" target="_blank">Copy for ETT</a>').appendTo('.ehTagAct').on('click', e => {
    GM_setClipboard(`| ${$('.ehTagAct').attr('name')} | | | |`);
    return false;
  });
  $('#taglist a').on({
    contextmenu: e => {
      var keyword = e.target.innerText.replace(/\s+\|.*/, '');
      if (/\s+/.test(keyword)) keyword = '"' + keyword + '"';
      if (/:/.test(e.target.id)) keyword = e.target.id.replace(/ta_(.*?):.*/, '$1') + ':' + keyword + '$';
      openUrl('/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=0&f_non-h=0&f_imageset=0&f_cosplay=0&f_asianporn=0&f_misc=0&f_search=' + encodeURIComponent(keyword) + '+language%3Achinese%24&f_apply=Apply+Filter');
      return false;
    },
    click: e => { //标签
      $('.ehTagAct').css('display', e.target.style.color ? 'block' : 'none').attr('name', e.target.id.replace('ta_', ''));
    }
  });
}

function tagTranslate() {
  let data = $('#taglist a').toArray().map(i => {
    let info = i.id.split(/ta_|:/);
    return findData(info[1], info[2]);
  }).filter(i => i);
  let css = ['div#taglist{overflow:visible;min-height:295px;height:auto}div#gmid{min-height:330px;height:auto;position:static}#taglist a{background:inherit}#taglist a::before{font-size:12px;overflow:hidden;line-height:20px;height:20px}#taglist a::after{display:block;color:#ff8e8e;font-size:14px;background:inherit;border:1px solid #000;border-radius:5px;position:absolute;float:left;z-index:999;padding:8px;box-shadow:3px 3px 10px #000;min-width:150px;max-width:500px;white-space:pre-wrap;opacity:0;transition:opacity .2s;transform:translate(-50%,20px);top:0;left:50%;pointer-events:none;padding-top:8px;font-weight:400;line-height:20px}#taglist a:hover::after,#taglist a:focus::after{opacity:1;pointer-events:auto}#taglist a:focus::before,#taglist a:hover::before{font-size:12px;position:relative;background-color:inherit;border:1px solid #000;border-width:1px 1px 0 1px;margin:-4px -5px;padding:3px 4px;color:inherit;border-radius:5px 5px 0 0}div.gt,div.gtw,div.gtl{line-height:20px;height:20px}#taglist a:hover::after{z-index:9999998}#taglist a:focus::after{z-index:9999996}#taglist a:hover::before{z-index:9999999}#taglist a:focus::before{z-index:9999997}', `#taglist a::after{color:#${location.host === 'exhentai.org' ? 'fff' : '000'};}`, ...data.map(i => `a[id="ta_${i.name}"]{font-size:0;}`)];
  data.forEach(i => {
    css.push(`a[id="ta_${i.name}"]::before{content:"${i.cname}"}`);
    if (i.info) css.push(`a[id="ta_${i.name}"]::after{content:"${i.info}"}`);
  });
  $('<style name="EHT"></style>').text(css.join('')).appendTo('head');
}

function saveLink() {
  $('<button>Shortcut</button>').click(function() {
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
    saveAs(new Blob([content[platform].replace('{{url}}', location.href)], {
      type: 'application/octet-stream'
    }), document.title + fileType);
  }).prependTo('.ehNavBar>div:eq(2)');
}

init();
