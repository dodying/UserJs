// ==UserScript==
// @name        [H]ParkingLot
// @name:zh-CN  [H]停车场
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description
// @version     1.09.2
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_getResourceURL
// @grant       unsafeWindow
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// 工具栏
// @resource add https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519691-199_CircledPlus-128.png
// @resource del https://cdn2.iconfinder.com/data/icons/social-messaging-productivity-1/128/trash-128.png
// @resource import https://cdn1.iconfinder.com/data/icons/design-2d-cad-solid-set-2/60/079-Import-128.png
// @resource table https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519904-098_Spreadsheet-128.png
// @resource restart https://cdn2.iconfinder.com/data/icons/social-messaging-productivity-1/128/power-128.png
// 标记
// @resource mark0 https://cdn2.iconfinder.com/data/icons/lightly-icons/24/time-96.png
// @resource mark1 https://cdn3.iconfinder.com/data/icons/math-physics/512/null-128.png
// @resource mark2 https://cdn4.iconfinder.com/data/icons/education-bold-line-1/49/34-128.png
// @resource mark3 https://cdn3.iconfinder.com/data/icons/chess-8/512/horse-game-role-chess-128.png
// @resource mark4 https://cdn3.iconfinder.com/data/icons/chess-8/154/chess-pawn-128.png
// @resource mark5 https://cdn1.iconfinder.com/data/icons/lightly-icons/30/heart-broken-120.png
// @resource play https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/youtube-128.png
// 下载状况
// @resource success https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Checkmark-128.png
// @resource warn https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/warning_alert_attention_search-128.png
// @resource error https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/error_warning_alert_attention-128.png
// @resource downloading https://cdn4.iconfinder.com/data/icons/miu/24/circle-arrow_down-download-glyph-128.png
// @run-at      document-end
// 种子站点
// @include     https://btso.pw/*
// @include     https://btdb.to/*
// @include     https://torrentz2.eu/*
// 网盘
// include     http://115.com/*
// @include     http://115.com/?tab=offline&mode=wangpan
// @include     http://pan.baidu.com/*
// 正规站点
// @include     http://www.dmm.co.jp/*
// @include     http://www.tokyo-hot.com/*
// @include     http://www.caribbeancom.com/*
// @include     http://www.1pondo.tv/*
// @include     http://www.heyzo.com/*
// @include     http://cn.10musume.com/*
// 搜索引擎
// @include     https://www.google.co.jp/*q=*
// @include     https://www.baidu.com/*wd=*
// JAVLibrary
// @include     http://www.javlibrary.com/*
// @include     https://www.javbus.com/*
// @include     http://javpop.com/*
// @include     http://www.jav007.com/*
// @include     https://avso.pw/*
// @include     https://avmo.pw/*
// 在线观看
// @include     http://avpapa.co/*
// @include     http://av99.us/*
// @include     http://www.doojav69.com/*
// @include     http://bejav.me/*
// @include     http://hpjav.com/*
// @include     http://www.av539.com/*
// ==/UserScript==
(function($) {
  var linkLib = { //待续-插入位置
    /*
    'example.com': {
      on: 布尔，是否开启,
      online: 布尔，是否在线播放,
      name: 标识,
      search: 网站，搜索地址，搜索字样用{searchTerms}代替,
      text: 选择器-要标记的文本,
      img: 选择器-要标记的图片,
      time: 选择器-发布日期,
      code: 选择器-番号/函数-返回值为番号,
      codeManual: 布尔，是否手动获取番号,
      append: 选择器，搜索结果要插入的位置,
      manual: 布尔，是否要按键后在启用脚本
    },
    */
    // 种子站点
    'btdb.to': {
      on: true,
      name: 'BTDB',
      search: 'https://btdb.to/q/{searchTerms}/?sort=size',
      text: 'h1.torrent-name,.file-name,.item-title>a',
      code: '#search-input'
    },
    'torrentz2.eu': {
      on: true,
      name: 'Torrentz2',
      search: 'https://torrentz2.eu/search?f={searchTerms}',
      text: '.results>dl>dt>a,.files .t>ul>li',
      code: '#thesearchbox'
    },
    'btso.pw': {
      on: false,
      name: 'BTSOW',
      search: 'http://btso.pw/search/{searchTerms}/',
      text: 'h3,.file',
      code: '.form-control:visible'
    },
    // 网盘
    '115.com': {
      on: false,
      name: '115网盘',
      search: 'http://115.com/?url=%2F%3Faid%3D-1%26search_value%3D{searchTerms}%26ct%3Dfile%26ac%3Dsearch%26is_wl_tpl%3D1&mode=wangpan',
      text: '.file-name>em>a',
      code: function() {
        return prompt('请输入番号', $('.file-path>a:eq(-1)').text());
      },
      codeManual: true,
      manual: true
    },
    'pan.baidu.com': {
      on: false,
      name: '百度网盘',
      search: 'http://pan.baidu.com/disk/home?adapt=pc&fr=ftw#search/key={searchTerms}&vmode=list',
      text: '.filename',
      manual: true
    },
    // 正规站点
    'www.dmm.co.jp': {
      on: true,
      name: 'DMM',
      search: 'http://www.dmm.co.jp/search/=/searchstr={searchTerms}',
      text: '.txt,table.mg-b20 td:not(:has(a))',
      img: '.img img,.tdmm,.crs_full>img',
      time: '.nw:contains(発売日)+td',
      code: function() {
        var code = $('.nw:contains(品番)+td').text();
        code = code.match(/[^h_0-9].*/)[0];
        code = code.replace(/^tk|tk$/g, '').replace(/00([0-9]{3})/, '$1').replace(/([a-z]+)([0-9]+)/, '$1-$2');
        code = code.toUpperCase();
        return prompt('请输入番号', code);
      },
      codeManual: true
    },
    'www.tokyo-hot.com': {
      on: false,
      name: 'Tokyo-Hot',
      search: 'http://www.tokyo-hot.com/product/?q={searchTerms}',
      text: '.actor,.info:eq(1)>dd:eq(0)',
      img: '.rm>img,.popular img,.free img,.ranking img',
      time: '.info:eq(1)>dd:eq(0)',
      code: '.info:eq(1)>dd:eq(2)'
    },
    'www.caribbeancom.com': {
      on: false,
      name: '加勒比',
      search: 'http://www.caribbeancom.com/moviepages/{searchTerms}/index.html',
      img: 'img[itemprop=thumbnail]',
      time: 'dd[itemprop=uploadDate]',
      code: function() {
        return location.pathname.match(/[\d\-]+/)[0];
      }
    },
    'www.1pondo.tv': {
      on: false,
      name: '一本道',
      search: 'http://www.1pondo.tv/movies/{searchTerms}/',
      img: '.figure>img,.ng-scope>a>img,img.ng-scope',
      time: 'dd.ng-binding:eq(1)',
      code: function() {
        return location.pathname.match(/[\d\_]+/)[0];
      },
      manual: true
    },
    'www.heyzo.com': {
      on: false,
      name: 'HEYZO',
      search: 'http://www.heyzo.com/search/{searchTerms}/1.html?sort=pop',
      //img: '.soundplay>img,.sample-images img,.relateive-movie img,.ranking-img>img,.withInfo>img,.new-movies>img,.actor>img',
      time: '.dataInfo:eq(0)',
      code: function() {
        return 'HEYZO-' + location.pathname.match(/\d+/)[0];
      }
    },
    'cn.10musume.com': {
      on: false,
      name: '10musume.com',
      search: 'http://cn.10musume.com/cn/moviepages/{searchTerms}/index.html',
      img: 'img',
      time: '#movie-table1:eq(5)',
      code: function() {
        return location.pathname.match(/[\d\_]+/)[0];
      }
    },
    // 搜索引擎
    'www.google.co.jp': {
      on: false,
      name: 'Google',
      search: 'https://www.google.co.jp/search?q={searchTerms}',
      text: 'h3.r>a,span.st',
      code: '#lst-ib',
      manual: true
    },
    'www.baidu.com': {
      on: false,
      name: 'Baidu',
      search: 'https://www.baidu.com/baidu?wd={searchTerms}',
      text: 'h3.t>a,.c-abstract',
      code: '#kw',
      manual: true
    },
    // JAVLibrary
    'www.javlibrary.com': {
      on: true,
      name: 'JAVLibrary',
      search: 'http://www.javlibrary.com/cn/vl_searchbyid.php?keyword={searchTerms}',
      text: '.post-title>a,.text:eq(1),.id,.title>a,.video>a:not(:has(img)),.cast>.star>a,.title:not(:has(a))',
      img: '#video_jacket_img,.previewthumbs>img,.id+img,strong>a',
      time: '.text:eq(2)',
      code: '#video_id .text',
      append: '#video_favorite_edit'
    },
    'www.javbus.com': {
      on: true,
      name: 'JavBus',
      search: 'https://www.javbus.com/{searchTerms}',
      text: 'h3,.info>p>span:eq(1),#magnet-table>tr>td:nth-child(1)>a,date',
      time: '.info>p:eq(1)',
      code: '.info>p>span:eq(1)'
    },
    'javpop.com': {
      on: false,
      name: 'JavPOP',
      search: 'http://javpop.com/index.php?s={searchTerms}',
      text: '.thumb_post a:nth-child(2),h1',
      img: '.thumb_post img,.box-b img',
      code: function() {
        return $('h1').text().match(/\[(.*?)\]/)[1];
      }
    },
    'www.jav007.com': {
      on: false,
      name: 'Jav007',
      search: 'http://www.jav007.com/searchpage.php?a=1&code={searchTerms}',
      text: '.viewimfor>li:eq(8),.view-code',
      img: '.photo,.cell>a>img',
      time: '.viewimfor>li:eq(1)',
      code: '.viewimfor>li:eq(8)'
    },
    'avso.pw': {
      on: false,
      name: 'AVSOX',
      search: 'https://avso.pw/cn/search/{searchTerms}',
      text: 'date,h3',
      img: '.photo-frame>img,.bigImage>img',
      time: '.info>p:eq(1)',
      code: '.info>p>span:eq(1)'
    },
    'avmo.pw': {
      on: false,
      name: 'AVMOO',
      search: 'https://avmo.pw/cn/search/{searchTerms}',
      text: 'date,h3',
      img: '.photo-frame>img,.bigImage>img',
      time: '.info>p:eq(1)',
      code: '.info>p>span:eq(1)'
    },
    // 在线观看
    'avpapa.co': {
      on: false,
      online: true,
      name: 'Avpapa',
      search: 'http://avpapa.co/search?q={searchTerms}',
      text: '.tit,h4',
      img: '.thumbs>a>img,#click_to_show>img',
      code: function() {
        return $('h4').text().match(/^\[(.*?)\]/)[1];
      }
    },
    'av99.us': {
      on: false,
      online: true,
      name: 'AV99免費A片',
      search: 'http://tw.search.yahoo.com/search?p={searchTerms}&vs=av99.us',
      text: 'h1,.list>li>a,.dd>a,.fl>a>span',
      img: '.pic>a>img',
      time: '.viewimfor>li:eq(1)',
      code: function() {
        return $('h1').text().replace(/^\[中文字幕\]\s+/, '').match(/(.*?) (.*?)/)[1];
      }
    },
    'www.doojav69.com': {
      on: false,
      online: true,
      name: 'Doojav69',
      search: 'http://www.doojav69.com/?s={searchTerms}',
      text: 'h2.entry-title>a,h1.entry-title',
      code: function() {
        return $('h1.entry-title').text().match(/(.*?) (.*?)/)[1];
      }
    },
    'bejav.me': {
      on: false,
      online: true,
      name: 'BeJav.Me',
      search: 'http://bejav.me/search/{searchTerms}/',
      text: '.name>a,.breadcrumb_last,.body>ul>li>a',
      img: '.img-responsive,.thumbnail>img,.body>ul>li>img',
      code: function() {
        return prompt('请输入番号', $('.breadcrumb_last').text());
      },
      codeManual: true
    },
    'hpjav.com': {
      on: false,
      online: true,
      name: 'HPJAV',
      search: 'http://hpjav.com/tw/?s={searchTerms}',
      text: '.entry-title a,h1,.current',
      code: function() {
        return prompt('请输入番号', $('.current').text().match(/(.*?) (.*?)/)[1]);
      },
      codeManual: true
    },
  };
  var magnetLib = {
    contains: [
      'btdb.to',
      'torrentz2.eu',
      'btso.pw'
    ],
    'btdb.to': {
      searchPage: 'https://btdb.to/q/{q}',
      searchPre: 'https://btdb.to/q/{q}/',
      title: 'h2.item-title>a',
      magnet: '.magnet',
      size: '.item-meta-info span:nth-child(2)',
      time: '.item-meta-info span:nth-child(4)',
      page: '.pagination',
      origin: 'https://btdb.to'
    },
    'torrentz2.eu': {
      searchPage: 'https://torrentz2.eu/search?f={q}',
      searchPre: 'https://torrentz2.eu',
      title: '.results>dl>dt>a',
      magnet: function(data) {
        return $('.results>dl>dt>a', data).toArray().map(function(i) {
          return 'magnet:?xt=urn:btih:' + i.getAttribute('href').match(/\/(.*)/)[1].toUpperCase();
        });
      },
      size: '.results>dl>dd>span:nth-child(3)',
      time: '.results>dl>dd>span:nth-child(2)',
      page: '.results>p>span',
      origin: 'https://torrentz2.eu'
    },
    'btso.pw': {
      searchPage: 'https://btso.pw/search/{q}',
      searchPre: 'https://btso.pw/search',
      title: '.data-list>.row>a',
      magnet: function(data) {
        return $('.data-list>.row>a', data).toArray().map(function(i) {
          return 'magnet:?xt=urn:btih:' + i.href.match(/hash\/(.*)/)[1].toUpperCase();
        });
      },
      size: '.size',
      time: '.date',
      page: '.pagination',
      origin: 'https://btso.pw'
    }
  };
  var markLib = [{ //0
      name: '等待中',
      color: 'gray'
    },
    { //1
      name: '有种子无配额',
      color: 'gray'
    },
    { //2
      name: '下载中',
      color: 'blue'
    },
    { //3
      name: '已下-骑兵',
      color: 'green'
    },
    { //4
      name: '已下-步兵',
      color: 'green'
    },
    { //5
      name: '已删-不喜欢的',
      color: 'black'
    },
  ];
  if (linkLib[location.host].manual) {
    $(window).on('keydown', function(e) {
      if (e.keyCode === 65 && e.shiftKey) { //Shift+A
        _init();
        $(window).off('keydown');
      }
    });
  } else {
    _init();
  }
  if (location.href === 'http://115.com/?tab=offline&mode=wangpan') downloadIn115();

  function _init() {
    init();
    getCode(true);
    markAdded();
    $('a[href^="magnet:"]:not(.hBanner a):not(.hSearch a)').on({
      click: function(e) {
        e.preventDefault();
        GM_setValue('link', this.href);
        GM_setValue('name', this.href.match(/dn=(.*?)(&|$)/) ? decodeURIComponent(this.href.match(/dn=(.*?)(&|$)/)[1]) : '');
      }
    });
  }

  function init() {
    $('<style></style>').appendTo('head').html([
      '.hBanner{position:fixed;background-color:#F2F2F2;z-index:999999;}',
      '.hBanner{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;}',
      '.hBanner>*{cursor:pointer;float:left;margin:0 1px 0 1px;}',
      '.hBanner *{line-height:9px;text-shadow:none;}',
      '.hBanner img{width:24px;height:24px;}',
      '.switcher{width:32px;height:24px;background:#333;border-radius:12px;position:relative;}',
      '.switcher>span{position:absolute;left:6px;top:7px;height:2px;color:#26CA28;font-size:16px;text-transform:Capitalize;}',
      '.hBanner>:not(.switcher):not(.hasCode){width:24px;height:24px;}',
      '.links>*,.addCode>*{background-color:#F2F2F2;display:none;width:24px;height:24px;}',
      '.links>:nth-child(1),.addCode>:nth-child(1){display:inline;}',
      '.links:hover>*,.addCode:hover>*{display:inline;}',
      '.links>.avOnline{border:solid 1px black;}',
      '.hasCode>a{margin:0 1px;display:none;}',
      '.hasCode,.hasCode>*{line-height:normal;}',
      '.showTable{background-color:#F2F2F2;position:absolute;top:80px;z-index:999998;}',
      '.showTable>table,.hSearch{border-collapse:collapse;margin:0 auto;color:#666666;font-size:13px;text-align:center;background-color:#FFF;}',
      '.showTable tr:nth-child(2n),.hSearch tr:nth-child(2n){background-color:#F2F2F2;}',
      '.showTable td,.showTable th,.hSearch th,.hSearch td{border:1px solid black;padding:8px 16px;}',
      '.hSearchPage>td *{padding:0 1px;}',
      '.hSearchPage>td>*{display:inline;}',
      '.hSearchPage>td>*.active{font-weight:bolder;}',
      '.hSearchPage>td>*.active *{color:gray;}',
      //
      '.fa-file-video-o{background-color:yellow;color:yellow;}'
    ].join(''));
    $('<div class="hBanner"></div>').on({
      mousedown: function(e1) {
        if (e1.target !== $('.hasCode')[0]) return;
        $(this).off('mouseout');
        $('body').mouseup(function(e2) {
          var width = 152;
          var topBorder = $(window).height() - $('.hBanner').height();
          var leftBorder = $(window).width() - $('.hBanner').width();
          var top = (e2.clientY - e1.offsetY > 0) ? e2.clientY - e1.offsetY : 0;
          top = (top > topBorder) ? topBorder : top;
          var left = (e2.clientX - e1.offsetX > width) ? e2.clientX - e1.offsetX - width : 0;
          left = (left > leftBorder) ? leftBorder : left;
          $('.hBanner').css({
            top: top + 'px',
            left: left + 'px'
          });
          GM_setValue('top', top);
          GM_setValue('left', left);
          $(this).off('mouseup');
          $('.hBanner').on({
            mouseout: function() {
              $('.hasCode>a').hide();
            }
          });
        });
      },
      mouseover: function() {
        $('.hasCode>a').show();
      },
      mouseout: function() {
        $('.hasCode>a').hide();
      }
    }).css({
      'top': function() {
        return GM_getValue('top', 0);
      },
      'left': function() {
        return GM_getValue('left', 0);
      }
    }).appendTo('body');
    $('<div class="switcher"></div>').html('<span>on</span>').appendTo('.hBanner').on({
      click: function() {
        if ($(this).find('span').text() === 'on') {
          $(this).find('span').text('off');
          $(this).find('span').css('color', 'red');
          undoMarkAdded();
        } else {
          $(this).find('span').text('on');
          $(this).find('span').css('color', 'green');
          markAdded();
        }
      },
      contextmenu: function(e) {
        e.preventDefault();
        $(this).find('span').text('on');
        undoMarkAdded();
        markAdded();
      }
    });
    $('<div class="links"></div>').html(function() {
      var _html = '';
      for (var i in linkLib) {
        if (!linkLib[i].on) continue;
        if (i === location.host) continue;
        _html += '<img ';
        if (linkLib[i].online) _html += 'class="avOnline"';
        _html += 'src="https://www.google.com/s2/favicons?domain=' + i + '"url="' + linkLib[i].search + '"title="' + linkLib[i].name + '"></img>';
      }
      return _html;
    }).on({
      click: function(e) {
        var code = getCode();
        GM_openInTab($(e.target).attr('url').replace('{searchTerms}', code));
      },
      contextmenu: function(e) {
        e.preventDefault();
        var code = getCode().match(/[a-z0-9]+/gi).join(' ');
        GM_openInTab($(e.target).attr('url').replace('{searchTerms}', code));
      },
    }).appendTo('.hBanner');
    $('.links>.avOnline').on({
      mouseover: function() {
        $(this).attr({
          rawSrc: this.src,
          src: GM_getResourceURL('play')
        });
      },
      mouseout: function() {
        $(this).attr('src', $(this).attr('rawSrc'));
      }
    });
    $('<div class="addCode"title="添加到数据库/移动"></div>').html('<img src="' + GM_getResourceURL('add') + '"></img>').click(function() {
      addValue(GM_getValue('lastMark', 0));
    }).appendTo('.hBanner');
    $('<div class="delCode"title="从数据库中删除"></div>').html('<img src="' + GM_getResourceURL('del') + '"></img>').click(function() {
      delValue();
    }).appendTo('.hBanner');
    $('<div class="importCode"title="导入到数据库"></div>').html('<img src="' + GM_getResourceURL('import') + '"></img>').click(function() {
      importValue();
    }).appendTo('.hBanner');
    $('<div title="左键:数据库展示\n右键:下载数据库(网页格式)"></div>').html('<img src="' + GM_getResourceURL('table') + '"></img>').on({
      click: function() {
        showValue(0);
        $(this).off('click').on('click', function() {
          $('.showTable').toggle();
        });
      },
      contextmenu: function(e) {
        e.preventDefault();
        showValue(1);
      }
    }).appendTo('.hBanner');
    $('<div title="重启"></div>').html('<img src="' + GM_getResourceURL('restart') + '"></img>').click(function() {
      $('.hBanner').remove();
      undoMarkAdded();
      $(window).removeData('code');
      init();
      markAdded();
    }).appendTo('.hBanner');
    $('<div class="hasCode">(已标记)</div>').appendTo('.hBanner');
    for (var i = 0; i < markLib.length; i++) {
      $('<img src="' + GM_getResourceURL('mark' + i) + '"title="' + i + '|' + markLib[i].name + '"></img>').val(i).click(function() {
        addValue($(this).val());
      }).appendTo('.addCode');
    }
    $(window).keydown(function(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105)) { //0-9
        var code = (e.shiftKey) ? prompt('请输入番号', getCode()) : getCode();
        if (!code) return;
        addValue(String.fromCharCode(e.keyCode), code);
      } else if (e.keyCode === 66 && e.shiftKey) { //Shift+B
        addValue(GM_getValue('lastMark', 0));
      }
    });
  }

  function markAdded() {
    $('.hasCode a').remove();
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    if (linkLib[location.host].img) {
      $(linkLib[location.host].img).removeAttr('onerror').attr({
        rawSrc: function() {
          return $(this).attr('src');
        },
        src: function() {
          var keyword;
          var _src = $(this).attr('src');
          for (var i in lib) {
            keyword = new RegExp(i + '|' + i.replace('-', ''), 'gi');
            if (keyword.test(_src)) {
              if ($('.' + i).length === 0) $('<a target="_blank"></a>').addClass(i).attr('href', linkLib['www.javlibrary.com'].search.replace('{searchTerms}', i)).html(i).appendTo('.hasCode');
              _src = GM_getResourceURL('mark' + lib[i].mark);
              break;
            }
          }
          return _src;
        }
      });
    }
    if (linkLib[location.host].text) {
      $(linkLib[location.host].text).each(function() {
        var keyword;
        var _html = $(this).text();
        $(this).empty();
        for (var i in lib) {
          keyword = new RegExp(i + '|' + i.replace('-', ''), 'gi');
          if (keyword.test(_html)) {
            if ($('.' + i).length === 0) $('<a target="_blank"></a>').addClass(i).attr('href', linkLib['www.javlibrary.com'].search.replace('{searchTerms}', i)).html(i).appendTo('.hasCode');
            _html = _html.replace(keyword, '<span style="background-color:' + markLib[lib[i].mark].color + ';color:white;"title="' + markLib[lib[i].mark].name + '">' + i + '</span>');
          }
        }
        $('<span>' + _html + '</span>').appendTo(this);
      });
    }
  }

  function undoMarkAdded() {
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    if (linkLib[location.host].img) {
      $(linkLib[location.host].img).attr({
        src: function() {
          return $(this).attr('rawSrc');
        }
      }).removeAttr('rawSrc');
    }
    $(linkLib[location.host].text).html(function() {
      return $(this).text();
    });
  }

  function addValue(mark, code = undefined) { //可选参数code
    mark = parseInt(mark);
    if (mark >= markLib.length) {
      alert('请输入正确的标记，范围：0-' + (markLib.length - 1));
      return;
    }
    var lib = GM_getValue('lib', null) || {};
    code = code || getCode();
    if (!code) return;
    GM_setValue('lastMark', mark);
    lib[code] = {
      mark: mark
    };
    if (mark === 0 || mark === 6) lib[code].time = $(linkLib[location.host].time).text();
    GM_setValue('lib', lib);
    undoMarkAdded();
    markAdded();
  }

  function delValue(code = undefined) { //可选参数code
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    code = code || getCode();
    if (!code) return;
    delete lib[code];
    GM_setValue('lib', lib);
    undoMarkAdded();
    markAdded();
  }

  function importValue() {
    var notice = '请输入车位\n-1. 删除\n';
    var i;
    for (i = 0; i < markLib.length; i++) {
      notice += i + '. ' + markLib[i].name + '\n';
    }
    var mark = parseInt(prompt(notice));
    if (isNaN(mark) || mark >= markLib.length || mark < -1) {
      alert('请输入正确的标记，范围：0-' + (markLib.length - 1));
      return;
    }
    mark = parseInt(mark);
    var codeArr = prompt('请输入车牌号，以|为分割');
    if (!codeArr) return;
    codeArr = codeArr.split('|');
    var lib = GM_getValue('lib', null) || {};
    for (i = 0; i < codeArr.length; i++) {
      if (mark === -1 && codeArr[i] in lib) {
        delete lib[codeArr[i]];
      } else if (mark >= 0) {
        lib[codeArr[i]] = {
          mark: mark
        };
      }
    }
    GM_setValue('lib', lib);
    undoMarkAdded();
    markAdded();
  }

  function showValue(type) {
    var lib = GM_getValue('lib', null) || {};
    var _html = '<table class="tablesorter"><tbody><tr><th>序号</th><th>数字</th><th>标记</th><th>代码</th><th>时间</th></tr>';
    var num = 0;
    for (var i in lib) {
      num++;
      _html += '<tr><td>' + num + '</td><td>' + lib[i].mark + '</td><td><img src="' + GM_getResourceURL('mark' + lib[i].mark) + '"></img>' + markLib[lib[i].mark].name + '</td><td><a href="' + linkLib['www.javlibrary.com'].search.replace('{searchTerms}', i) + '"target="_blank">' + i + '</a></td><td>' + (lib[i].time || '') + '</td></tr>';
    }
    _html += '</tbody></table>';
    if (type === 0) {
      $('<div class="showTable"></div>').html(_html).appendTo('body');
    } else if (type === 1) {
      _html = '<html><head><script src="http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script><script src="http://cdn.bootcss.com/jquery.tablesorter/2.28.5/js/jquery.tablesorter.js"></script><style>.showTable{background-color:white;}.showTable>table{border-collapse:collapse;}.showTable tr{background-color:white;}.showTable th,.showTable td{border:1px solid black;}</style></head><body><div class="showTable">' + _html + '</div><script>$(".showTable>table").tablesorter();</script></body></html>';
      var blob = new Blob([_html], {
        type: 'text/html;charset=utf-8'
      });
      saveAs(blob, '1.html');
    }
  }

  function getCode(first) {
    if ($(window).data('code')) return $(window).data('code');
    var code;
    var lib = linkLib[location.host];
    if (typeof lib.code === 'string') {
      var temp = $(lib.code);
      if (temp.length > 0) {
        code = (temp[0].tagName === 'INPUT') ? temp.val() : temp.text();
      } else {
        code = '';
      }
    } else if (typeof lib.code === 'function') {
      if (!first || !lib.codeManual) code = lib.code();
    } else {
      code = '';
    }
    code = code.toUpperCase();
    $(window).data('code', code);
    if (code) getMagnet(code);
    return code;
  }

  function getMagnet(code, page = undefined, searchUrl = magnetLib.contains[0]) {
    var lib = magnetLib[searchUrl];
    var url = page === undefined ? lib.searchPage.replace('{q}', code) : lib.searchPre.replace('{q}', code) + page;
    var codeArr = code.split('-');
    var expArr = [];
    for (var i = 0; i < codeArr.length; i++) {
      expArr.push(new RegExp(codeArr[i], 'gi'));
    }
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var data = response.response;
        var title = $(lib.title, data);
        var magnet;
        if (typeof lib.magnet === 'string') {
          magnet = $(lib.magnet, data).toArray().map(function(i) {
            return i.href;
          });
        } else {
          magnet = lib.magnet(data);
        }
        var size = $(lib.size, data);
        var time = $(lib.time, data);
        $('.hSearch').remove();
        $('<table class="hSearch"></table>').html('<tbody><tr><th><select><option>' + magnetLib.contains.join('</option><option>') + '</option></select></th><th><a href="' + url + '" target="_blank">大小</a></th><th>时间</th><th>复制</th></tr></tbody>').insertAfter(linkLib[location.host].append || 'body>:eq(-1)');
        var name;
        for (var i = 0; i < title.length; i++) {
          name = title[i].title || title[i].textContent;
          for (var j = 0; j < codeArr.length; j++) {
            name = name.replace(expArr[j], '<b>' + codeArr[j] + '</b>');
          }
          $('<tr></tr>').appendTo('.hSearch>tbody').html('<td><a class="hMagent" href="' + magnet[i] + '">' + name + '</a></td><td><a href="' + lib.origin + title[i].pathname + '" target="_blank">' + size[i].textContent + '</a></td><td>' + time[i].textContent + '</td><td><button class="hSearchCopy">复制</button></td>');
        }
        $('.hMagent').on('click', function(e) {
          e.preventDefault();
          var target = (e.target.tagName === 'B') ? e.target.parentNode : e.target;
          GM_setValue('link', target.href);
          GM_setValue('name', target.innerText);
          addValue(2);
        });
        $('.hSearchCopy').on('click', function(e) {
          console.log(this);
          $(e.target).text('已复制');
          setTimeout(function() {
            $(e.target).text('复制');
          }, 3000);
          GM_setClipboard($(e.target).parents('tr').find('td>a:eq(0)').attr('href'));
        });
        if (title.length === 0) $('<tr></tr>').appendTo('.hSearch>tbody').html('<td colspan="4">No search result</td>');
        if ($(lib.page, data).html() !== undefined) {
          $('<tr class="hSearchPage"></tr>').appendTo('.hSearch>tbody').html('<td colspan="4">' + $(lib.page, data).html() + '</td>');
          $('.hSearchPage a').click(function(e) {
            e.preventDefault();
            getMagnet(getCode(), e.target.getAttribute('href'), searchUrl);
          });
        }
        $('.hSearch th select').on({
          change: function() {
            getMagnet(getCode(), undefined, this.value);
          }
        }).find(':contains(' + searchUrl + ')')[0].selected = true;
      }
    });
  }

  function downloadIn115() {
    if (document.readyState !== 'complete') {
      setTimeout(downloadIn115, 200);
    } else {
      $('<a href="javascript:;" class="opmenu-clean">清空所有任务</a>').prependTo(unsafeWindow.frames.wangpan.document.querySelector('.operate-menu')).on({
        click: function() {
          unsafeWindow.Core.OFFL5Plug.GetDataCtl().list(function(e) {
            var tasks = e.tasks;
            tasks.forEach(function(task) {
              unsafeWindow.Core.OFFL5Plug.Delete(task, null);
            });
          });
        }
      });
      setInterval(function() {
        if (GM_getValue('link')) {
          var link = GM_getValue('link');
          GM_setValue('task', link.match(/^magnet:\?xt=urn:btih:(.*?)(&|$)/)[1].toLowerCase());
          //console.log(GM_getValue('task'));
          unsafeWindow.Core.OFFL5Plug.OpenLink();
          setTimeout(function() {
            if ($('#js_offline_new_add')) {
              $('#js_offline_new_add').val(link);
              GM_deleteValue('link');
              unsafeWindow.$('.con>.button').click();
              var checkResult = setInterval(function() {
                if ($('iframe[src^="//captchaapi.115.com"]').length > 0) { //验证
                  clearInterval(checkResult);
                  setNotice('请重新验证你的帐号', null, GM_getResourceURL('warn'));
                } else if ($('.exph-suc').length > 0) { //成功
                  //clearInterval(checkResult);
                  //setNotice($('.exph-suc').text(), null, GM_getResourceURL('downloading'));
                } else if ($('.exph-war').length > 0) { //错误
                  clearInterval(checkResult);
                  setNotice($('.exph-war').text(), null, GM_getResourceURL('error'));
                  unsafeWindow.$('.btn-link').click();
                }
              }, 200);
            }
          }, 300);
        } else {
          unsafeWindow.Core.OFFL5Plug.Reload(); //刷新任务
          if (GM_getValue('task') && $('iframe[src^="//captchaapi.115.com"]').length === 0) { //检查下载情况
            unsafeWindow.Core.OFFL5Plug.GetDataCtl().list(function(e) {
              var tasks = e.tasks;
              for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].info_hash === GM_getValue('task')) break;
              }
              //console.log(tasks[i]);
              if (i === tasks.length) {
                GM_deleteValue('task');
                return;
              }
              var p = Math.round(tasks[i].percentDone * 100) / 100;
              var now = Math.floor(p / 4);
              //setNotice(tasks[i].name, '┏━━━━━━━━━━━━━━━━━━━━━━━━━┓\n┃' + new Array(now + 1).join('▉') + new Array(25 - now + 1).join('▁') + '┃ ' + p + '%\n┗━━━━━━━━━━━━━━━━━━━━━━━━━┛', tasks[i].status === 2 ? GM_getResourceURL('success') : getProcess(p, 128));
              setNotice(tasks[i].name, new Array(now + 1).join('▉') + new Array(25 - now + 1).join('▁') + ' ' + p + '%', tasks[i].status === 2 ? GM_getResourceURL('success') : getProcess(p, 128));
              if (tasks[i].status === 2) GM_deleteValue('task'); //1:下载中 2:下载完成
            });
          }
        }
      }, 2000);
    }
  }

  function setNotice(title, body = undefined, icon = undefined) {
    if (window.Notification && Notification.permission !== 'denied') {
      Notification.requestPermission(function(status) {
        if (status === 'granted') {
          var option = {
            tag: 'hParkingLot'
          };
          if (body) option.body = body;
          if (icon) option.icon = icon;
          var n = new Notification(cutByte(title, 28), option);
          n.onclick = function() {
            n.close();
          };
          setTimeout(function() {
            if (n) n.close();
          }, 3000);
        }
      });
    }
  }

  function getProcess(process, radius) { //https://imys.net/20150722/canvas-annulus-process.html
    var c = document.createElement('canvas');
    radius = radius || 100;
    c.width = 2 * radius;
    c.height = 2 * radius;
    var ctx = c.getContext('2d');

    // 画灰色的圆
    ctx.beginPath();
    ctx.arc(radius, radius, 0.8 * radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#F6F6F6';
    ctx.fill();

    // 画进度环
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, 0.8 * radius, Math.PI * 1.5, Math.PI * (1.5 + 2 * process / 100));
    ctx.closePath();
    ctx.fillStyle = '#00CD00';
    ctx.fill();

    // 画内填充圆
    ctx.beginPath();
    ctx.arc(radius, radius, 0.6 * radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();

    // 填充文字
    ctx.font = 'bold ' + 0.2 * radius + 'pt Microsoft YaHei';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.moveTo(radius, radius);
    ctx.fillText(process + '%', radius, radius);
    return c.toDataURL();
  }

  function cutByte(str, len, endstr = '...') { //http://www.cnblogs.com/whyoop/p/3680228.html
    function n2(a) { //用于二分法查找
      var n = a / 2 | 0;
      return (n > 0 ? n : 1);
    }

    function getBlength(str) {
      for (var i = str.length, n = 0; i--;) {
        n += str.charCodeAt(i) > 255 ? 2 : 1;
      }
      return n;
    }
    if (str.length <= len) return str;
    if (!(str + '').length || !len || len <= 0) return '';
    if (getBlength(str) <= len) { return str; } //整个函数中最耗时的一个判断,欢迎优化
    var lenS = len,
      _lenS = 0,
      _strl = 0;
    while (_strl <= lenS) {
      var _lenS1 = n2(lenS - _strl);
      _strl += getBlength(str.substr(_lenS, _lenS1));
      _lenS += _lenS1;
    }
    return str.substr(0, _lenS - 1) + endstr;
  }
})(jQuery);
