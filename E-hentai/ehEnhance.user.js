// ==UserScript==
// @name        ehEnhance
// @name:zh-CN  【EH】Enhance
// @description 
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN  
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
// @version     1.00
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @run-at      document-end
// ==/UserScript==
(function () {
  jQuery('<div class="ehNavBar"><div></div><div></div><div></div></div>').appendTo('body');
  addStyle();
  if (!localStorage.downloadInffo) localStorage.downloadInfo = '{}';
  if (location.href.match('/g/')) { //信息页
    checkImageSize();
    btnAddFav();
    btnSearch();
    changeName('#gn');
    if (location.hash.match('#')) autoDownload();
    if (location.hash === '#0') autoClose(); //待续
    tagSearch();
    copyAuthor();
    downloadInfo();
    abortPending();
  } else { //搜索页
    changeName('.it5>a');
    btnAddFav2();
    btnSearch2();
    keywordFunction();
    batchDown();
  }
  showInfo();
  exportRule();
  jQuery('.ehNavBar .ehCopy').on({
    click: function () {
      var _ = this;
      var text = _.textContent;
      GM_setClipboard(text);
      _.textContent = '已复制';
      setTimeout(function () {
        _.textContent = text;
      }, 800);
    }
  });
  jQuery('.ehNavBar button:not(.ehCopy)').on({
    contextmenu: function () {
      return false;
    },
    mousedown: function (e) {
      setNotification(e.button + ': ' + this.textContent);
    }
  });
  jQuery('<a>1</a>').css('visibility', 'hidden').appendTo('.ehNavBar>div:empty');
}) ();
function abortPending() {
  jQuery('<button>Force Abort</button>').on({
    click: function () {
      jQuery('.ehD-pt-status-text:contains("Pending...")+span').click();
    }
  }).appendTo('.ehNavBar>div:eq(1)');
}
function add2Fav(gid, token, i, target) {
  if (i === '10') i = 'favdel';
  var xhr = 'xhr_' + Math.random();
  xhr = new XMLHttpRequest();
  xhr.open('POST', '/gallerypopups.php?gid=' + gid + '&t=' + token + '&act=addfav');
  xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function () {
    target = jQuery(target);
    console.log(target);
    if (i === 'favdel') {
      target.attr('class', 'btnAddFav').removeAttr('id').removeAttr('style');
    } else {
      target.attr('id', 'favicon_' + gid).attr('class', 'i').css('background-position', '0px -' + (i * 19 + 2) + 'px');
    }
  }
  xhr.send('favcat=' + i + '&favnote=&submit=Apply+Changes&update=1');
}
function addStyle() {
  jQuery('<style></style>').html(function () {
    return ['.ido,.itg{max-width:9999px!important;}',
    '.itg>tbody>tr.batchHover{background-color:#669933}',
    '.itg>tbody>tr:hover{background-color:#4A86E8}.itd>label{cursor:pointer;}',
    '.ehD-dialog{bottom:23px!important;}',
    '.ehD-status{bottom:334px!important;}',
    '.ehD-force-download-tips{bottom:311px!important;}',
    '.ehCenter{text-align:center;}',
    '.ehNavBar{display:flex;width:99%;background-color:#34353B;position:fixed;bottom:0px;z-index:1000;padding:0 10px 5px 10px;}',
    '.ehNavBar>div{width:33.3%;}',
    '.ehNavBar>div:nth-child(1){text-align:left;}',
    '.ehNavBar>div:nth-child(2){text-align:center;}',
    '.ehNavBar>div:nth-child(3){text-align:right;}',
    '.ehNavBar button,.ehBtn{font-size:12px;border:2px outset black;height:21px;margin:0px 10px;padding:0px 4px 1px 4px;}',
    '.ehNavBar .ehCopy{color:#F0F0F0;background-color:#000;}',
    '.btnSearch{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVQ4jX1TvW7iQBBeJCLBPQOF66PwzuwWRjTrwjUVz8Aj2D2iRLmTsJLIut4UfgCfkIJ0D0ARUkR5AlMvLrJSvmvAR0wuI02xs/N98y9ES5hZMfMDM78S0dtJX4joTkop2/6NKKW+EdEvpRS+UiK6HwwG/SuwlPLPpaPWClpraH1NIqV89DyvJ4ToCCGEaEeezWYoigLb7RZ5nmM6nV6RMHNqjOkKZlaXH1mWwVqL/X6PzWaDqqrgnEOSJGhn6Ps+CWZ+uIxsrcVyuWwcgyBAWZao6xpRFJ3AGlprMPNKMPPrmbEoCuz3+6t0wzCEcw6LxaIBa63AzM+CiN7OrNvtFpvN5tPuV1WFNF01BKeJ1BcECnmeo6oqBEHwATyZTGCtRRzHDfhEcBRE9HI2TKdTOOdQliXCMGzAu90Oh8MB4/G4Pc4nQUR3l8YkSVDXNZxzqKoK1locDgccj0fkef4hA2a+FVJK2a43iiIsFguk6QpxHGM8HmO9XgMAsiw7g9+Hw+H38yLdt0n+dVs37yzLMJ/PoZSC7/s/m00cDAZ9KeXj/8CfrPJvz/N6xphucw+e5/WYOf3qBpj5nZl/eJ7XG41GfaXUzeVNdYwxXd/3iZlXzPxMRDURHaWUT8x8e6q5Y4zpKqVujDHdv6rJoiTHuLTjAAAAAElFTkSuQmCC);}',
    '.btnAddFav{cursor:pointer;width:16px;height:16px;float:left;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVQ4ja2TSwrDMAxERyNvEgg9jFdC25y9tMdpcwB3k4/j2GkoFQiMkZ9GHwPAE0D60R84CxCR1U/itkNmYmZdjLE3sw6A4GhNAN19GMd4c/cBACuPsSgsAeXj9+ylkeQBIJXMtfLo7oOq7gFm1lVkN8sjufVARFKMsc9kVzuuyilLsgfM3WYLEIImVX3VyltqaY6qMZXTPVgBIWhqjPQrgKqcCtkHdS3AlWX6/yYmAIlkUtWUzbnq+SY+lsuLvy+Lw/0DpJalxJ3rpocAAAAASUVORK5CYII=);}',
    '.id44>.btnAddFav,.id44>.i[id^="favicon_"],.id44>.btnSearch{float:right;margin:4px 2px 0 0;}',
    '.i[id^="favicon_"],#fav>.i{cursor:pointer;background-image:url("data:image/png;base64,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")!important;}'].join('');
  }).appendTo('head');
  jQuery('.i:has(.n),.id44>div>a:has(.tn)').hide(); //隐藏种子图标
}
function autoClose() {
  setTimeout(function () {
    if (jQuery('.ehD-dialog>.ehD-pt-gen-filename+button').text() === 'Not download? Click here to download') {
      setTimeout(function () {
        self.close();
      }, 3000);
    } else {
      autoClose();
    }
  }, 3000);
}
function autoDownload() {
  setTimeout(function () {
    if (jQuery('.ehD-box>.g2').length > 0) {
      setTimeout(function () {
        jQuery('.ehD-box>.g2:eq(0)').click();
      }, 1500);
    } else {
      autoDownload();
    }
  }, 800);
}
function batchDown() {
  window.batchTime = 0;
  jQuery('.itg').on('contextmenu', function (e) { //右键：下载
    e.preventDefault();
    if (e.target.className.indexOf('TagPreview_') >= 0) {
      GM_openInTab(e.target.href + '#0', true); //待续
    } else if (window.batchTime > 0 && jQuery(e.target).hasClass('EH_QuickAddToFav') || jQuery(e.target).hasClass('ehLBAdd')) {
      window.batchTime--;
    }
  });
  var tr = jQuery('.itg>tbody>tr');
  if (tr.length > 0) {
    var notFavoritesPage = jQuery('.itg>tbody>tr>td>input').length === 0;
    tr.each(function (i) {
      var _this = this;
      if (notFavoritesPage) {
        var div = jQuery((i === 0) ? '<th></th>' : '<td></td>').css('text-align', 'center').html('<input id="EH_FavHelper_' + i + '" type="checkbox">').appendTo(this);
      } else {
        jQuery(_this).find('td:eq(-1)>input').attr('id', 'EH_FavHelper_' + i);
      }
      if (jQuery(_this).find('.itd').length > 0) {
        var _ = jQuery(_this).find('.itd:eq(0)');
        _.html('<label for="EH_FavHelper_' + i + '">' + _.html() + '</label>');
      }
    });
    tr.find('th>input').on('click', function () { //全选
      var _this = this;
      jQuery('tr.gtr0 input,tr.gtr1 input').each(function () {
        this.checked = (_this.checked === true) ? true : false;
      });
    });
    tr.find('td:eq(-1)>input').on('change', function (e) { //高亮选中
      jQuery(e.target).parents(1).toggleClass('batchHover');
    });
  }
  jQuery('<button>Batch</button>').appendTo('.ehNavBar>div:eq(2)').on({
    contextmenu: function () {
      window.batchTime = 0;
      return false;
    },
    click: function () {
      var input = [
      ];
      jQuery('tr.gtr0:visible,tr.gtr1:visible').each(function () {
        var i = jQuery(this);
        if ((i.find('.i[id^="favicon_"]').length === 0 || i.find('.i[id^="favicon_"]').css('background-position-y') === '-2px') && i.find('.ehLBAdd').length > 0) {
          input.push(i.find('td>input'));
        } else {
          i.find('td>input') [0].checked = false;
          i.removeClass('batchHover');
        }
      });
      if (window.batchTime > input.length + 3) window.batchTime = 0;
      input.forEach(function (_input, i) {
        if (i <= window.batchTime + 3 && i >= window.batchTime) {
          _input[0].checked = true;
          _input.parents().eq(1).addClass('batchHover');
        } else {
          _input[0].checked = false;
          _input.parents().eq(1).removeClass('batchHover');
        }
      });
      window.batchTime += 4;
    }
  });
  jQuery('<button>Open</button>').appendTo('.ehNavBar>div:eq(2)').on({
    contextmenu: function () {
      return false;
    },
    mousedown: function (e) {
      jQuery('.showInfo').click();
      jQuery('.itg>tbody>tr:visible>td>input:checked').each(function (i) {
        var href = jQuery(this).parents().eq(1).find('.itd>div>.it5>a').attr('href');
        var target = jQuery(this).parents().eq(1).find('.it3').find('.btnAddFav,.i[id^="favicon_"]') [0];
        GM_openInTab(href + '#' + e.button, true);
        if (e.button === 0) { //待续
          var arr = href.split('/');
          add2Fav(arr[4], arr[5], localStorage.lastFavcat, target);
          window.batchTime--;
        }
      });
    }
  });
  jQuery('<button>Delete</button>').appendTo('.ehNavBar>div:eq(2)').on({
    click: function () {
      jQuery('.itg>tbody>tr:visible>td>input:checked').each(function (i) {
        var href = jQuery(this).parents().eq(1).find('.itd>div>.it5>a').attr('href');
        var target = jQuery(this).parents().eq(1).find('.it3').find('.btnAddFav,.i[id^="favicon_"]') [0];
        var arr = href.split('/');
        add2Fav(arr[4], arr[5], '10', target);
      });
    }
  });
}
function btnAddFav() {
  var fav = - 1;
  if (jQuery('#gdf>#fav>.i').length > 0) fav = 0 - (parseInt(jQuery('#gdf>#fav>.i').css('background-position-y')) + 2) / 19;
  jQuery('#gdf').empty().removeAttr('onclick').on({
    contextmenu: function () {
      return false;
    },
    mousedown: function (e) {
      var arr = location.href.split('/');
      var target = e.target;
      if (e.button === 0) {
        add2Fav(arr[4], arr[5], '0', target);
      } else if (e.button === 1) {
        var favcat = prompt('请选择：\n0.未下载\n1.连载-系列\n2.CG-COS-画集-女同\n3.东方-LL-舰娘-偶像大师\n4.同人\n5.大师-萝莉\n6.纯爱-Np-1♂\n7.纯爱-乱伦\n8.纯爱-2p-♂♀\n9.难定-杂志\n10.从收藏中移除');
        if (!favcat) return;
        localStorage.lastFavcat = favcat;
        add2Fav(arr[4], arr[5], favcat, target);
      } else if (e.button === 2 && e.shiftKey) {
        add2Fav(arr[4], arr[5], '10', target);
      } else if (e.button === 2) {
        add2Fav(arr[4], arr[5], localStorage.lastFavcat, target);
      }
    }
  });
  if (fav === - 1) {
    jQuery('#gdf').attr('class', 'btnAddFav').removeAttr('id').removeAttr('style');
  } else {
    jQuery('#gdf').attr('class', 'i').attr('id', 'favicon_' + location.href.split('/') [4]).css('background-position', '0px -' + (fav * 19 + 2) + 'px');
  }
}
function btnAddFav2() {
  jQuery('<div class="btnAddFav"></div>').appendTo('.it3:not(:has(.i[id^="favicon_"])),.id44:not(:has(.i[id^="favicon_"]))');
  jQuery('.btnAddFav,.i[id^="favicon_"]').removeAttr('onclick').on({
    contextmenu: function () {
      return false;
    },
    mousedown: function (e) {
      var href = jQuery(this).parentsUntil('.itd,#pp').eq( - 1).find('.it5>a,.id2>a').attr('href');
      var arr = href.split('/');
      var target = e.target;
      if (e.button === 0) {
        add2Fav(arr[4], arr[5], '0', target);
      } else if (e.button === 1) {
        var favcat = prompt('请选择：\n0.未下载\n1.连载-系列\n2.CG-COS-画集-女同\n3.东方-LL-舰娘-偶像大师\n4.同人\n5.大师-萝莉\n6.纯爱-Np-1♂\n7.纯爱-乱伦\n8.纯爱-2p-♂♀\n9.难定-杂志\n10.从收藏中移除');
        if (!favcat) return;
        localStorage.lastFavcat = favcat;
        add2Fav(arr[4], arr[5], favcat, target);
      } else if (e.button === 2 && e.shiftKey) {
        add2Fav(arr[4], arr[5], '10', target);
      } else if (e.button === 2) {
        add2Fav(arr[4], arr[5], localStorage.lastFavcat, target);
      }
    }
  });
}
function btnSearch() {
  var text = jQuery('#gn').text() || jQuery('#gj').text();
  if (text === '') return;
  jQuery('<div class="ehSearch"></div>').appendTo('#gd2');
  text = text.split(/[\[\]\(\)\{\}【】\|]+/);
  for (var i = 0; i < text.length; i++) {
    text[i] = text[i].trim();
    if (text[i] !== '') {
      jQuery('<span><input id="ehSearch_' + i + '" type="checkbox"><label for="ehSearch_' + i + '">' + text[i] + '</label></span>').appendTo('.ehSearch');
    }
  }
  jQuery('<button class="ehBtn">Search</button>').appendTo('.ehSearch').click(function () {
    var keyword = [
    ];
    jQuery('.ehSearch input:checked+label').each(function () {
      keyword.push(this.textContent);
    })
    GM_openInTab('/?f_search=%22' + encodeURIComponent(keyword.join('" "')) + '%22', true);
  });
}
function btnSearch2() {
  jQuery('<div class="btnSearch"></div>').appendTo('.it3,.id44').on({
    contextmenu: function () {
      return false;
    },
    mousedown: function (e) {
      var name = jQuery(this).parentsUntil('.itd,#pp').eq( - 1).find('.it5>a,.id2>a').text();
      name = name.replace(/\[.*?\]|\(.*?\)|\{.*?\}|【.*?】/g, '').replace(/!/g, '').replace(/\|.*/, '').trim();
      name = '"' + name + '"';
      if (e.button === 2) name += ' language:chinese$';
      GM_openInTab('/?f_search=' + encodeURIComponent(name), true);
    }
  });
}
function changeConfig(key, value) {
  var uconfig = (document.cookie.match('uconfig')) ? document.cookie.match(/uconfig=(.*?)(; |$)/) [1] : 'sa_5e844a-tf_e78085-cats_254-xl_20x1044x2068x30x1054x2078x40x1064x2088x50x1074x2098x60x1084x2108x70x1094x2118x80x1104x2128x90x1114x2138x100x1124x2148x110x1134x2158x120x1144x2168x130x1154x2178x254x1278x2302x255x1279x2303-xr_780';
  var u = {
  };
  uconfig.split('-').forEach(function (i) {
    var _ = i.split('_');
    u[_[0]] = _[1];
  });
  u[key] = value;
  uconfig = [
  ];
  for (var i in u) {
    uconfig.push(i + '_' + u[i]);
  }
  uconfig = uconfig.join('-');
  document.cookie = 'uconfig=' + uconfig + '; max-age=31536000; domain=.exhentai.org; path=/';
}
function changeName(e) {
  jQuery(e).each(function () {
    this.textContent = this.textContent.replace(/^\(.*?\)( |)/, '').replace(' Ni ', ' 2 ').replace(' San ', ' 3 ').replace(' Yon ', ' 4 ').replace(' Go ', ' 5 ').replace(' Roku ', ' 6 ').replace(' Nana ', ' 7 ').replace(' Hachi ', ' 8 ').replace(' Ku ', ' 9 ').replace(/\s+/g, ' ').trim(); //.replace(/[\\/:\*\?"<>\|]+/g, '-')
  });
}
function checkImageSize() {
  if (!localStorage.imageSize) {
    changeConfig('xr', '780');
    localStorage.imageSize = '780';
  }
  var imageSize = localStorage.imageSize;
  var rate;
  var num0 = 0; //单页
  var num1 = 0; //双页
  jQuery('.gdtm>div>a>img').each(function () {
    rate = jQuery(this).height() / jQuery(this).width(); //长宽比
    if (rate > 1.1) {
      num0++;
    } else if (rate < 0.9) {
      num1++;
    }
  });
  if (2 * num1 > jQuery('.gdtm>div>a>img').length) {
    if (imageSize !== '1280') {
      document.title = '1280|' + document.title;
      changeConfig('xr', '1280');
      localStorage.imageSize = '1280';
      return true;
    }
  } else if (imageSize !== '780') {
    document.title = '780|' + document.title;
    changeConfig('xr', '780');
    localStorage.imageSize = '780';
    return true;
  }
}
function copyAuthor() {
  if (jQuery('#gn').text().match(/\[(.*?)\]/) && jQuery('#gj').text().match(/\[(.*?)\]/)) {
    var name = jQuery('#gn').text().match(/\[(.*?)\]/) [1];
    var nameJpn = jQuery('#gj').text().match(/\[(.*?)\]/) [1];
    if (name.match(/\(.*?\)/)) name = name.match(/\((.*?)\)/) [1];
    if (nameJpn.match(/\(.*?\)/)) nameJpn = nameJpn.match(/\((.*?)\)/) [1];
    jQuery('<button class="ehCopy"></button>').text('[' + name + ']' + nameJpn).appendTo('.ehNavBar>div:eq(0)');
  }
  if (jQuery('#gdc>a>img[alt="doujinshi"]').length > 0 && jQuery('.gt[id*="td_parody"]>a').length > 0) {
    var parody = window.getComputedStyle(jQuery('.gt[id*="td_parody"]>a') [0], ':before').content;
    if (parody !== 'none' && parody !== '') {
      parody = parody.match(/"(.*?)"/) [1];
    } else {
      parody = (jQuery('#gj').text().match(/\(.*?\)/g)) ? jQuery('#gj').text().match(/\(.*?\)/g)  : jQuery('#gn').text().match(/\(.*?\)/g);
      parody = parody[parody.length - 1].match(/\((.*?)\)/) [1];
    }
    var parodyKeyword = jQuery('.gt[id*="td_parody"]>a').text().replace(/ \| .*/, '');
    jQuery('<button class="ehCopy"></button>').text('【' + parody + '】' + parodyKeyword).appendTo('.ehNavBar>div:eq(0)');
  }
}
function downloadInfo() {
  jQuery('.ehD-box>.g2:eq(0)').on({
    click: function () {
      var name = location.href.split('/') [4];
      setInterval(function () {
        var info = jQuery('.ehD-status').text().match(/\d+/g);
        var download = JSON.parse(localStorage.downloadInfo);
        download[name] = [
          info[2],
          info[0]
        ];
        if (info[0] === info[2]) delete download[name];
        localStorage.downloadInfo = JSON.stringify(download);
      }, 800);
    }
  });
}
function exportRule() {
  jQuery('<button>Export Rule</button>').appendTo('.ehNavBar>div:eq(1)').click(function () {
    var record = (localStorage.record) ? JSON.parse(localStorage.record)  : [
    ];
    var exportRule = (localStorage.exportRule) ? JSON.parse(localStorage.exportRule)  : [
    ];
    exportRule = exportRule.concat(record).sort();
    for (var i = 1; i < exportRule.length; i++) {
      if (exportRule[i - 1] === exportRule[i]) {
        exportRule.splice(i, 1);
        i--;
      }
    }
    localStorage.record = '[]';
    localStorage.exportRule = JSON.stringify(exportRule);
    saveAs(new Blob(['[AutoProxy 0.2.9]\r\n' + exportRule.join('\r\n')], {
      type: 'text/plain;charset=utf-8'
    }), 'e-hentai.txt');
  });
  jQuery('<button>Clear Rule</button>').appendTo('.ehNavBar>div:eq(1)').click(function () {
    localStorage.record = '[]';
  });
}
function keywordFunction() {
  if (jQuery('input.stdinput,form>input[name="favcat"]+div>input').val()) {
    var value = jQuery('input.stdinput,form>input[name="favcat"]+div>input').val();
    if (value.match(/\w+:"?([\w \-\.]+)\$?"?\$? language:chinese\$$/))
    value = value.match(/\w+:"?([\w \-\.]+)\$?"?\$? language:chinese\$$/) [1];
    jQuery('<button class="ehCopy"></button>').text(value).appendTo('.ehNavBar>div:eq(0)');
    document.title = value;
    jQuery('<button>Find Parody</button>').appendTo('.ehNavBar>div:eq(1)').on({
      click: function () {
        var p = '/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=0&f_non-h=0&f_imageset=0&f_cosplay=0&f_asianporn=0&f_misc=0&f_search=parody%3A';
        var t = prompt('请输入系列').replace(/[\(\)\[\]!?]/g, '').trim().toLowerCase();
        p += (t.match(/ /)) ? '"' + t + '"%24' : t;
        p += '+language%3Achinese%24&f_apply=Apply+Filter';
        location = p;
      }
    });
  }
}
function showInfo() {
  jQuery('<button class="showInfo">Show Info</button>').appendTo('.ehNavBar>div:eq(1)').click(function () {
    jQuery(this).remove();
    var showInfoInterval = setInterval(function () {
      var download = JSON.parse(localStorage.downloadInfo);
      if (Object.keys(download).length === 0) return;
      var body = [
      ];
      for (var i in download) {
        body.push(i + ': ' + download[i][0] + '/' + download[i][1]);
      }
      setNotification('下载进度', body.join('\n'));
    }, 3000);
  });
}
function setNotification(title, body) { //发出桌面通知
  if (Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(function (status) {
      if (status === 'granted') {
        var n = (body) ? new Notification(title, {
          body: body
        })  : new Notification(title);
        setTimeout(function () {
          if (n) n.close();
        }, 3000);
      }
    });
  }
}
function tagSearch() {
  jQuery('#taglist a').on({
    contextmenu: function () {
      GM_openInTab(this.href, true);
      return false;
    },
    click: function () { //标签
      var keyword = this.innerText.replace(/\s+\|.*/, '');
      if (/\s+/.test(keyword)) keyword = '"' + keyword + '"';
      if (/:/.test(this.id)) keyword = this.id.replace(/ta_(.*?):.*/, '$1') + ':' + keyword + '$';
      GM_openInTab('/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=0&f_non-h=0&f_imageset=0&f_cosplay=0&f_asianporn=0&f_misc=0&f_search=' + encodeURIComponent(keyword) + '+language%3Achinese%24&f_apply=Apply+Filter', true);
    }
  });
}
