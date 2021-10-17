// ==UserScript==
// @name        [H]ParkingLot
// @version     1.11.438
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
//
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_getResourceURL
// @grant       unsafeWindow
//
// @connect     *
//
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.29.0/js/jquery.tablesorter.min.js
//
// 工具栏
// @resource add https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519691-199_CircledPlus-128.png
// @resource del https://cdn2.iconfinder.com/data/icons/social-messaging-productivity-1/128/trash-128.png
// @resource import https://cdn1.iconfinder.com/data/icons/design-2d-cad-solid-set-2/60/079-Import-128.png
// @resource table https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519904-098_Spreadsheet-128.png
// @resource copy https://cdn3.iconfinder.com/data/icons/text-icons-1/512/BT_copy-128.png
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
//
// 种子站点
// @include     *://sukebei.nyaa.si/*
// @include     *://torrentz2.eu/*
// @include     *://btsow.com/*
// 网盘
// include     *://115.com/*
// include     *://115.com/?tab=offline&mode=wangpan
// 正规站点
// @include     *://www.dmm.co.jp/*
// @include     *://www.mgstage.com/*
// @include     *://www.tokyo-hot.com/*
// @include     *://*.caribbeancom.com/*
// @include     *://www.1pondo.tv/*
// @include     *://www.heyzo.com/*
// @include     *://cn.10musume.com/*
// @include     *://adult.contents.fc2.com/*
// JAVLibrary
// @include     *://www.javlibrary.com/*
// @include     *://www.javbus.*/*
// @include     *://javdb*.com/*
// @include     *://javfree.me/*
// @include     *://javdownloader.info/*
// @include     *://javpop.com/*

// @include     *://avmoo.com/*
// @include     *://javzoo.com/*

// @include     *://avsox.com/*
// @include     *://avme.pw/*

// @include     *://avmemo.com/*
// @include     *://avxo.club/*

// @include     *://www.inoreader.com/*
// 在线观看
// @include     *://avpapa.co/*
// @include     *://av99.us/*
// @include     *://bejav.net/*
// @include     *://hpjav.tv/*
// @include     *://www.av539.com/*
// @run-at      document-end
// ==/UserScript==
/* global GM_xmlhttpRequest GM_setValue GM_getValue GM_deleteValue GM_openInTab GM_setClipboard GM_getResourceURL unsafeWindow */
/* global jQuery */
(async function ($) {
  const $$ = {};
  $$.siteLib = [
    /*
    { //名称, 随意
      filter: string or func
      on: 布尔，是否开启
      online: 布尔，是否在线播放
      check: 选择器-验证是否该网站
      name: 标识
      search: 网站，搜索地址，搜索字样用{searchTerms}代替
      text: 选择器-要标记的文本
      img: 选择器-要标记的图片
      time: 选择器-发布日期
      code: 选择器-番号/函数-返回值为番号
      codeManual: 布尔，是否手动获取番号
      after: 选择器，搜索结果要插入的位置
      manual: 布尔，是否要按键后在启用脚本
      extra: func, init时执行
      info: object of selector or func, 要复制的信息
    },
    */
    // 种子站点
    { // Nyaa Sukebei
      name: 'Sukebei',
      on: true,
      filter: 'sukebei.nyaa.si',
      check: '[property="og:site_name"][content="Sukebei"]',
      search: 'https://sukebei.nyaa.si/?q={searchTerms}',
      text: 'td[colspan="2"]>a',
      code: '.search-bar'
    },
    { // Torrentz2
      name: 'Torrentz2',
      on: false,
      filter: 'torrentz2.eu',
      check: '[title="Torrents Search"]',
      search: 'https://torrentz2.eu/search?f={searchTerms}',
      text: '.results>dl>dt>a,.files .t>ul>li',
      code: '#thesearchbox'
    },
    { // BTSOW
      name: 'BTSOW',
      on: false,
      filter: 'btsow.com',
      check: '[name="author"][content="BTSOW"]',
      search: 'http://btsow.com/search/{searchTerms}/',
      text: 'h3,.file',
      code: '.form-control:visible'
    },

    // 网盘
    { // 115
      name: '115网盘',
      on: false,
      filter: '115.com',
      check: '[itemprop="name"][content="115，一生相伴"]',
      search: 'http://115.com/?url=%2F%3Faid%3D-1%26search_value%3D{searchTerms}%26ct%3Dfile%26ac%3Dsearch%26is_wl_tpl%3D1&mode=wangpan',
      text: '.file-name>em>a',
      code: () => window.prompt('请输入番号', $('.file-path>a:eq(-1)').text()),
      codeManual: true,
      manual: true
    },

    // 正规站点
    { // DMM
      name: 'DMM',
      on: false,
      filter: 'www.dmm.co.jp',
      check: '[name="application-name"][content="DMM.R18"]',
      search: 'http://www.dmm.co.jp/search/=/searchstr={searchTerms}',
      text: '.txt,table.mg-b20 td:not(:has(a))',
      img: '.img img,.tdmm,.crs_full>img',
      time: '.nw:contains(発売日)+td',
      code () {
        let code = $('.nw:contains(品番)+td').text();
        code = code.match(/[^h_0-9].*/)[0];
        code = code.replace(/^tk|tk$/g, '').replace(/00([0-9]{3})/, '$1').replace(/([a-z]+)([0-9]+)/, '$1-$2');
        code = code.toUpperCase();
        return window.prompt('请输入番号', code);
      },
      codeManual: true,
      extra () {
        if (!$('#sample-image-block>a>img').length) return;
        const previewSrc = $$.siteLib.filter(i => i.name === 'DMM')[0].previewSrc;
        $(document).on({
          click () {
            $('#sample-image-block>a>img').each((i, _) => {
              _.src = previewSrc(_.src);
            });
            $(document).off('click');
          }
        });
      },
      previewSrc (src) {
        if (src.match(/(p[a-z]\.)jpg/)) {
          return src.replace(RegExp.$1, 'pl.');
        } else if (src.match(/consumer_game/)) {
          return src.replace('js-', '-');
        } else if (src.match(/js-([0-9]+)\.jpg$/)) {
          return src.replace('js-', 'jp-');
        } else if (src.match(/ts-([0-9]+)\.jpg$/)) {
          return src.replace('ts-', 'tl-');
        } else if (src.match(/(-[0-9]+\.)jpg$/)) {
          return src.replace(RegExp.$1, 'jp' + RegExp.$1);
        } else {
          return src.replace('-', 'jp-');
        }
      }
    },
    { // mgstage
      name: 'mgstage',
      on: false,
      filter: 'www.mgstage.com',
      check: '[href="https://www.mgstage.com/"][rel="canonical"]',
      search: 'https://www.google.com/search?q=site%3Amgstage.com+{searchTerms}',
      text: '.detail_data tr:contains("品番")>td,.detail_txt>li:contains("品番")',
      img: '.detail_data img,.sample_image img,.push_title_list img',
      time: '.detail_data tr:contains("配信開始日")>td',
      code () {
        const arr = window.location.href.split('/');
        return arr[arr.length - 2];
      },
      extra () {
        if (!$('.sample_image').length) return;
        $('<style></style>').text('#sample-photo li{float:none!important;}').appendTo('head');
        $('.sample_image').each((i, _) => {
          $(_).html(`<img src="${$(_).attr('href')}">`).removeAttr('href').off('click');
        });
      }
    },
    { // Tokyo-Hot
      name: 'Tokyo-Hot',
      on: false,
      filter: 'www.tokyo-hot.com',
      search: 'http://www.tokyo-hot.com/product/?q={searchTerms}',
      text: '.actor,.info:eq(1)>dd:eq(0)',
      img: '.rm>img,.popular img,.free img,.ranking img',
      time: '.info:eq(1)>dd:eq(0)',
      code: '.info:eq(1)>dd:eq(2)'
    },
    { // caribbeancom.com
      name: '加勒比',
      on: false,
      filter: 'caribbeancom.com',
      search: 'http://www.caribbeancom.com/moviepages/{searchTerms}/index.html',
      img: 'img[itemprop=thumbnail]',
      time: 'dd[itemprop=uploadDate]',
      code: () => window.location.pathname.match(/[\d-]+/)[0],
      extra: () => {
        if (window.location.hostname !== 'www.caribbeancom.com') window.location.href = `https://www.caribbeancom.com/moviepages/${getCode()}/index.html`;
      },
      info: [
        '.heading>h1',
        '.spec-title:contains("出演")+span>a',
        '.spec-title:contains("タグ")+span>a',
        function () {
          var time = $('.spec-title:contains("再生時間")+span').text().trim();
          time = new Date('1970-01-01 ' + time + ' GMT+000').getTime();
          return Math.round(time / 1000 / 60);
        }
      ]
    },
    { // caribbeancompr.com ?
      name: '加勒比-会员',
      on: false,
      filter: 'caribbeancompr.com',
      search: 'http://www.caribbeancompr.com/moviepages/{searchTerms}/index.html',
      img: 'img[itemprop=thumbnail]',
      time: 'dd[itemprop=uploadDate]',
      code: () => window.location.pathname.match(/[\d-]+/)[0],
      info: [
        '.video-detail>h1',
        '.movie-info>dl:contains("出演") a,.movie-info>dl:contains("演员") a',
        '.movie-info-cat>dd>a',
        function () {
          var time = $('.movie-info>dl:contains("再生時間")>dd,.movie-info>dl:contains("片长")>dd').text();
          time = new Date('1970-01-01 ' + time + ' GMT+000').getTime();
          return Math.round(time / 1000 / 60);
        }
      ]
    },
    { // 1pondo.tv
      filter: 'www.1pondo.tv',
      on: false,
      name: '一本道',
      search: 'http://www.1pondo.tv/movies/{searchTerms}/',
      img: '.figure>img,.ng-scope>a>img,img.ng-scope',
      time: 'dd.ng-binding:eq(1)',
      code: () => window.location.pathname.match(/[\d_]+/)[0],
      manual: true
    },
    { // heyzo.com
      filter: 'www.heyzo.com',
      on: false,
      name: 'HEYZO',
      search: 'http://www.heyzo.com/search/{searchTerms}/1.html?sort=pop',
      // img: '.soundplay>img,.sample-images img,.relateive-movie img,.ranking-img>img,.withInfo>img,.new-movies>img,.actor>img',
      time: '.dataInfo:eq(0)',
      code: () => 'HEYZO-' + window.location.pathname.match(/\d+/)[0]
    },
    { // 10musume.com
      filter: 'cn.10musume.com',
      on: false,
      name: '10musume.com',
      search: 'http://cn.10musume.com/cn/moviepages/{searchTerms}/index.html',
      img: 'img',
      time: '#movie-table1:eq(5)',
      code: () => window.location.pathname.match(/[\d_]+/)[0]
    },
    { // adult.contents.fc2.com
      filter: 'adult.contents.fc2.com',
      on: false,
      name: 'adult.contents.fc2.com',
      search: 'https://adult.contents.fc2.com/search/?q={searchTerms}',
      code: () => window.location.href.split('/')[4],
      after: '[data-menu-name="main-header"]'
    },

    // 第三方
    { // JavBus
      filter: () => $('.footer>.container-fluid:contains("Copyright © 2013 JavBus. All Rights Reserved")').length,
      on: true,
      name: 'JavBus',
      search: 'https://www.javbus.com/{searchTerms}',
      text: 'h3,.info>p>span:eq(1),#magnet-table>tr>td:nth-child(1)>a,date',
      time: '.info>p:eq(1)',
      code: '.info>p>span:eq(1)',
      after: '.row.movie',
      extra () {
        // if ($('#sample-waterfall').length) $('#sample-waterfall').html($('.sample-box').toArray().map(i => `<img src="${i.href}" style="margin:2px 0;">`))
      },
      info: [
        'h3',
        '.star-show~p:eq(0)>.genre>a',
        '.header:contains(類別)~p:eq(0)>.genre>a',
        '',
        '.info>p:eq(2)'
      ]
    },
    { // JAVLibrary
      filter: 'javlibrary.com',
      on: true,
      name: 'JAVLibrary',
      search: 'http://www.javlibrary.com/cn/vl_searchbyid.php?keyword={searchTerms}',
      text: '.post-title>a,.text:eq(1),.id,.title>a,.video>a:not(:has(img)),.cast>.star>a,.title:not(:has(a)),.info+td>strong>a',
      img: '#video_jacket_img,.previewthumbs>img,.id+img,strong>a,.info+td>a>img',
      time: '.text:eq(2)',
      code: '#video_id .text',
      after: '#video_favorite_edit',
      extra () {
        const previewSrc = $$.siteLib.filter(i => i.name === 'DMM')[0].previewSrc;
        if (!$('#video_jacket_img').length) return;
        if ($('.previewthumbs').length) {
          $('.previewthumbs>img').each((i, _) => {
            if ($(_).attr('src').match('//pics.dmm.co.jp')) $(_).attr('src', previewSrc($(_).attr('src'))).removeAttr('width').removeAttr('height').attr('style', 'margin:2px 0;');
          });
        }
        const code = $('#video_jacket_img').attr('src').match(/http:\/\/pics.dmm.co.jp\/mono\/movie\/adult\/(.*?)\/(.*?)pl\.jpg/);
        if (!code) return;
        const url = `http://www.dmm.co.jp/mono/dvd/-/detail/=/cid=${code[1]}/`;
        $('#video_jacket_img').wrap(() => `<a target="_blank" href="${url}"></a>`);
        if (!$('.previewthumbs').length) {
          $('#video_jacket').one('click', e => {
            e.preventDefault();
            /*
              GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 30 * 1000,
                onload(res) {
                  let data = res.response;
                  if ($('#sample-image-block>a>img', data).length) {
                    let img = $('#sample-image-block>a>img', data).toArray().map(i => `<img src="${previewSrc(i.src)}" style="margin:2px 0;">`).join('');
                    $(`<div class="previewthumbs">${img}</div>`).insertAfter('#rightcolumn>.socialmedia');
                  }
                }
              });
              */
            GM_xmlhttpRequest({
              method: 'GET',
              url: 'https://www.javbus.com/' + $('#video_id .text').text(),
              timeout: 30 * 1000,
              onload (res) {
                const data = res.response;
                if ($('#sample-waterfall', data).length) {
                  const img = $('.sample-box', data).toArray().map(i => `<img src="${i.href}" style="margin:2px 0;">`).join('');
                  $(`<div class="previewthumbs">${img}</div>`).insertAfter('#rightcolumn>.socialmedia');
                }
              }
            });
          });
        }
      },
      info: [
        '.post-title',
        'span.star>a',
        '.genre>a',
        'span.score',
        '#video_length .text'
      ]
    },
    { // javdb.com
      filter: () => $('title').text().match('JavDB'),
      on: true,
      name: 'JavDB',
      search: 'https://javdb.com/search?q={searchTerms}',
      text: '.box .uid,.box .video-title,.title,.tile-item',
      img: '.box .item-image>img,.video-cover,.tile-item>img',
      code: '.item-title+.value:eq(0)',
      after: '#search-bar-container'
    },
    { // javfree.me
      filter: 'javfree.me',
      on: false,
      name: 'Free JAV Share',
      search: 'https://javfree.me/?s={searchTerms}',
      text: 'h1.entry-title,h2.entry-title>a,.entry-wrap>a',
      img: '.entry-content img,.thumbnail-wrap>img',
      time: '.post-author',
      code: () => {
        const matched = $('[id^="post"] .entry-title').eq(0).text().replace(/^\[HD\]/, '').match(/^\[(.*?)\]/);
        return (matched ? matched[1] : window.location.href.split('/')[4]).replace('heyzo-', 'heyzo ').replace(/(carib|caribpr|1pondo|1000giri|10musume|pacopacomama|tokyo-hot)-/, '');
      },
      after: '#start'
    },
    { // javdownloader.info
      filter: 'javdownloader.info',
      on: false,
      name: 'JavDownloader',
      search: 'https://javdownloader.info/?s={searchTerms}',
      text: '.title,.wp_rp_title,#nav-below a,.widget_recent_entries a',
      img: '.entry img',
      code: () => $('.title').text().replace('[HD]', '').match(/\[(.*?)\]/)[1],
      after: '.post-info-bottom'
    },
    { // javpop.com
      filter: 'javpop.com',
      on: false,
      name: 'JavPOP',
      search: 'http://javpop.com/index.php?s={searchTerms}',
      text: '.thumb_post a:nth-child(2),h1',
      img: '.thumb_post img,.box-b img',
      code: () => $('h1').text().match(/\[(.*?)\]/)[1].replace('FC2_PPV-', ''),
      after: '#header'
    },
    { // AVMOO
      filter: () => document.title.match('AVMOO'),
      on: false,
      name: 'AVMOO',
      search: 'https://avmoo.com/cn/search/{searchTerms}',
      text: 'date,h3',
      img: '.photo-frame>img,.bigImage>img',
      time: '.info>p:eq(1)',
      code: '.info>p>span:eq(1)',
      after: '.row.movie'
    },
    { // AVSOX
      filter: () => document.title.match('AVSOX'),
      on: false,
      name: 'AVSOX',
      search: 'https://avsox.com/cn/search/{searchTerms}',
      text: 'date,h3',
      img: '.photo-frame>img,.bigImage>img',
      time: '.info>p:eq(1)',
      code: '.info>p>span:eq(1)',
      after: '.row.movie'
    },
    { // AVMEMO
      filter: () => document.title.match('AVMEMO'),
      on: false,
      name: 'AVMEMO',
      search: 'https://avmemo.com/search/{searchTerms}',
      text: 'date,h3',
      img: '.photo-frame>img,.bigImage>img',
      time: '.info>p:eq(1)',
      code: '.info>p>span:eq(1)',
      after: '.row.movie'
    },
    { // inoreader
      filter: 'www.inoreader.com',
      on: false,
      name: 'Inoreader',
      search: 'https://www.inoreader.com/search/{searchTerms}',
      text: '.article_title_link,.article_header_title'
    },

    // 在线观看
    { // Avpapa
      filter: 'avpapa.co',
      on: false,
      online: true,
      name: 'Avpapa',
      search: 'https://avpapa.co/search?q={searchTerms}',
      text: '.tit,h4',
      img: '.thumbs>a>img,#click_to_show>img',
      code: () => $('h4').text().match(/^\[(.*?)\]/)[1]
    },
    { // av99.us
      filter: 'av99.us',
      on: false,
      online: true,
      name: 'AV99免費A片',
      search: 'http://tw.search.yahoo.com/search?p={searchTerms}&vs=av99.us',
      text: 'h1,.list>li>a,.dd>a,.fl>a>span',
      img: '.pic>a>img',
      time: '.viewimfor>li:eq(1)',
      code: () => $('h1').text().replace(/^\[中文字幕\]\s+/, '').match(/(.*?) (.*?)/)[1]
    },
    { // BeJav.Com
      filter: () => $('meta[name=description]').attr('content').match('BEJAV'),
      on: false,
      online: true,
      name: 'BeJav.Com',
      search: 'https://bejav.com/search/{searchTerms}/',
      text: '.name>a,.breadcrumb_last,.body>ul>li>a',
      img: '.img-responsive,.thumbnail>img,.body>ul>li>img',
      code: () => window.prompt('请输入番号', $('.breadcrumb_last').text()),
      codeManual: true
    },
    { // HPJAV
      filter: () => document.title.match('HPJAV'),
      on: false,
      online: true,
      name: 'HPJAV',
      search: 'https://hpjav.tv/tw/?s={searchTerms}',
      text: '.entry-title a,h1,.current',
      code: () => window.prompt('请输入番号', $('.current').text().match(/(.*?) (.*?)/)[1]),
      codeManual: true
    }
  ];
  $$._siteFavorite = $$.siteLib.filter(i => i.name === 'JAVLibrary')[0];

  // https://cdn.jsdelivr.net/gh/xiandanin/magnetW@master/rule.json
  var magnetLib = {
    'nyaa.si Sukebei': {
      searchPage: 'https://sukebei.nyaa.si/?q={q}',
      title: '.torrent-list tr>td:nth-child(2)>a',
      magnet: '.torrent-list tr>td:nth-child(3)>a[href^="magnet"]',
      size: '.torrent-list tr>td:nth-child(4)',
      time: '.torrent-list tr>td:nth-child(5)',
      page: '.pagination',
      sort: data => $('.table-responsive thead>tr>th>a', data).toArray().map(i => i.outerHTML.replace('</a>', $(i).attr('href').match(/s=(.*?)&/)[1] + '</a>')).join(' / '),
      more: {
        Torrent: (data, lib) => $('.torrent-list tr>td:nth-child(3)>a:nth-child(1)', data).toArray().map(i => `<a href="${new URL($(i).attr('href'), lib.searchPage).href}" target="blank">Torrent</a>`),
        S: '.torrent-list tr>td:nth-child(6)',
        L: '.torrent-list tr>td:nth-child(7)',
        D: '.torrent-list tr>td:nth-child(8)'
      }
    },
    BTDB: {
      searchPage: 'https://btdb.eu/search/{q}/',
      title: '.media>.media-body .item-title>a',
      magnet: '.media>.media-right>a:nth-child(1)',
      size: '.media>.media-body .item-meta-info>small:nth-child(1)>strong',
      time: '.media>.media-body .item-meta-info>small:nth-child(5)>strong',
      page: '.pagination',
      sort: '.card-title+div',
      more: {
        Torrent: '.media>.media-right>a:nth-child(2)',
        Files: '.media>.media-body .item-meta-info>small:nth-child(2)>strong',
        Seeders: '.media>.media-body .item-meta-info>small:nth-child(3)>strong',
        Leechers: '.media>.media-body .item-meta-info>small:nth-child(4)>strong'
      }
    },
    '7torrents': {
      searchPage: 'https://www.7torrents.cc/search?query={q}',
      title: '.media>.media-body h5>a',
      magnet: '.media>.media-right>a:nth-child(1)',
      size: '.media>.media-body small:nth-child(2)>strong',
      time: '.media>.media-body small:nth-child(6)>strong',
      page: '.pagination',
      sort: '.card .nav-dot-separated',
      more: {
        Torrent: '.media>.media-right>a:nth-child(2)',
        Files: '.media>.media-body small:nth-child(3)>strong',
        Seeders: '.media>.media-body small:nth-child(4)>strong',
        Leechers: '.media>.media-body small:nth-child(5)>strong'
      }
    },
    LimeTorrents: {
      searchPage: 'https://www.limetorrents.info/search/all/{q}/',
      title: '.table2 tr:gt(0) .tt-name>a:nth-child(2)',
      magnet: data => $('.table2 tr:gt(0) .tt-name>a:nth-child(1)', data).toArray().map(i => 'magnet:?xt=urn:btih:' + i.href.match(/torrent\/(.*?).torrent/)[1]),
      size: '.table2 tr:gt(0)>td:nth-child(3)',
      time: '.table2 tr:gt(0)>td:nth-child(2)',
      page: '.search_stat',
      more: {
        Torrent: '.table2 tr:gt(0) .tt-name>a:nth-child(1)',
        Seeders: '.table2 tr:gt(0)>td:nth-child(4)',
        Leechers: '.table2 tr:gt(0)>td:nth-child(5)'
      }
    },
    YourBittorrent: {
      searchPage: 'https://yourbittorrent.com/?q={q}',
      title: '.table-default>td:nth-child(2)>a',
      size: '.table-default>td:nth-child(3)',
      time: '.table-default>td:nth-child(4)',
      page: '.pagination',
      more: {
        Torrent: (data, lib) => $('.table-default>td:nth-child(2)>a', data).toArray().map(i => `<a href="https://yourbittorrent.com/down/${i.href.split('/')[4]}.torrent" target="blank">Torrent</a>`),
        SD: '.table-default>td:nth-child(5)',
        PR: '.table-default>td:nth-child(6)'
      }
    },
    'SaveBt (Down)': {
      searchPage: 'http://savebts.org/q/{q}/0/0/1.html',
      title: '.item>dt>a',
      magnet: '.item>.attr>span:nth-child(6)>a',
      size: '.item>.attr>span:nth-child(2)>b',
      time: '.item>.attr>span:nth-child(1)>b',
      sort: '.sortby,.category',
      page: '.pages',
      more: {
        Files: '.item>.attr>span:nth-child(3)>b',
        Speed: '.item>.attr>span:nth-child(4)>b',
        Hot: '.item>.attr>span:nth-child(5)>b'
      }
    },
    'The Pirate Bay': { // TODO FIX XHR
      searchPage: 'https://thepiratebay.org/search/{q}/0/1/0',
      title: '.vertTh+td>a',
      magnet: 'nobr>a:nth-child(1)',
      size: '.vertTh+td+td+td+td',
      time: '.vertTh+td+td',
      sort: data => $('.header a', data).toArray().filter(i => i.href.match('/search/')).map(i => i.outerHTML).join(' / '),
      page: '#content>[align="center"]',
      more: {
        Type: '.vertTh>a',
        SE: '.vertTh+td+td+td+td+td',
        LE: '.vertTh+td+td+td+td+td+td'
      }
    },
    'Sukebei Pantsu': { // TODO CHECK
      searchPage: 'https://sukebei.pantsu.cat/search?q={q}',
      title: '.torrent-info>.tr-name>a',
      magnet: '.tr-links>a:nth-child(1)',
      size: '.torrent-info>.tr-size',
      time: '.torrent-info>.tr-date',
      page: '#sort-list-order+.pagination',
      sort: data => $('#sort-list-order td>*', data).toArray().map(i => i.outerHTML).join(' / '),
      more: {
        File: (data, lib) => $('.tr-links>a:nth-child(2)', data).toArray().map(i => `<a href="${new URL($(i).attr('href'), lib.searchPage).href}" target="blank">File</a>`),
        S: '.torrent-info>.tr-se',
        L: '.torrent-info>.tr-le',
        D: '.torrent-info>.tr-dl'
      }
    },
    'Torrentz2 (Down)': {
      searchPage: 'https://torrentz2.eu/search?f={q}',
      title: '.results>dl>dt>a',
      magnet: data => $('.results>dl>dt>a', data).toArray().map(i => 'magnet:?xt=urn:btih:' + i.getAttribute('href').match(/\/(.*)/)[1].toUpperCase()),
      size: '.results>dl>dd>span:nth-child(3)',
      time: '.results>dl>dd>span:nth-child(2)',
      page: '.results>p>span',
      sort: '.results>div',
      more: {
        seeder: '.results>dl>dd>span:nth-child(4)',
        rating: '.results>dl>dd>span:nth-child(5)'
      }
    },
    BTSOW: {
      searchPage: 'https://btsow.com/search/{q}/',
      title: '.data-list>.row>a',
      magnet: data => $('.data-list>.row>a', data).toArray().map(i => 'magnet:?xt=urn:btih:' + i.href.match(/hash\/(.*)/)[1].toUpperCase()),
      size: '.size',
      time: '.date',
      page: '.pagination'
    },
    'Tokyo Toshokan': {
      searchPage: 'https://www.tokyotosho.info/search.php?terms={q}',
      title: 'a[type="application/x-bittorrent"]',
      magnet: '.desc-top>a[href^="magnet"]',
      size: data => $('.desc-bot', data).toArray().map(i => i.textContent.match(/Size: (.*?) /)[1]),
      time: data => $('.desc-bot', data).toArray().map(i => i.textContent.match(/Date: (.*? UTC)/)[1]),
      page: '.listing+p+p',
      more: {
        Website: data => $('.category_0>.web', data).toArray().map(i => $(i).find('a:contains("Website")').length ? $(i).find('a:contains("Website")')[0].outerHTML : ''),
        Details: '.web>a:contains("Details")',
        S: '.stats>span:nth-child(1)',
        L: '.stats>span:nth-child(2)',
        C: '.stats>span:nth-child(3)'
      }
    },
    'BTKu (Down)': {
      searchPage: 'https://btku.org/q/{q}/',
      title: '.results>h2>a',
      magnet: '.downLink>a[href^="magnet"]',
      size: '.resultsIntroduction>label:nth-child(4)',
      time: '.resultsIntroduction>label:nth-child(8)',
      page: '#nextPage',
      sort: '#bar-sort',
      more: {
        Hot: '.resultsIntroduction>label:nth-child(6)',
        Files: '.resultsIntroduction>label:nth-child(2)'
      }
    },
    BTDigg: { // TODO FIX
      searchPage: code => `http://btdig.com/search/${window.btoa(encodeURIComponent(code).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1))).replace(/[=]+$/g, '')}/1/0/0.html`,
      title: '.list>dl>dt>a',
      magnet: '.list>dl>dd.attr>span>a',
      size: '.list>dl>dd.attr>span:nth-child(2)>b',
      time: '.list>dl>dd.attr>span:nth-child(1)>b',
      page: '.page-split',
      sort: data => $('.category>a,.sorted-by>a', data).toArray().map(i => i.outerHTML).join(' / '),
      more: {
        Files: '.list>dl>dd.attr>span:nth-child(3)>b',
        Speed: '.list>dl>dd.attr>span:nth-child(4)>b',
        Hot: '.list>dl>dd.attr>span:nth-child(5)>b'
      }
    },
    'Seedpeer (Down)': {
      searchPage: 'https://www.seedpeer.eu/search/{q}',
      title: '.table a[href]',
      magnet: data => JSON.parse($(data)[19].textContent.replace('window.initialData=', '')).data.list.map(i => 'magnet:?xt=urn:btih:' + i.hash),
      size: data => JSON.parse($(data)[19].textContent.replace('window.initialData=', '')).data.list.map(i => parseInt(i.size / 1024 / 1024) + 'Mb'),
      time: data => JSON.parse($(data)[19].textContent.replace('window.initialData=', '')).data.list.map(i => i.createdAt),
      page: data => new Array(JSON.parse($(data)[19].textContent.replace('window.initialData=', '')).data.pages).fill(1).map((_, i) => `<a href="?page=${i + 1}">${i + 1}</a>`).join(''),
      more: {
        Seeds: data => JSON.parse($(data)[19].textContent.replace('window.initialData=', '')).data.list.map(i => i.seeds),
        Peers: data => JSON.parse($(data)[19].textContent.replace('window.initialData=', '')).data.list.map(i => i.peers),
        Health: data => JSON.parse($(data)[19].textContent.replace('window.initialData=', '')).data.list.map(i => i.ratio)
      }
    },
    BitCQ: {
      searchPage: 'https://bitcq.com/search?q={q}',
      title: '.table-hover tr>td:nth-child(2)>a',
      magnet: '.table-hover tr>td:nth-child(1)>a[href^="magnet"]',
      size: '.table-hover tr>td:nth-child(4)',
      time: '',
      page: '.pagination',
      more: {
        Type: '.table-hover tr>td:nth-child(3)>.label',
        Peers: '.table-hover tr>td:nth-child(5)'
      }
    },
    'Digbt (Down)': {
      searchPage: 'https://www.digbt.org/search/{q}',
      title: '.x-item>div:nth-child(1)>a.title',
      magnet: '.tail>a.title',
      size: data => $('.tail', data).toArray().map(i => i.textContent.match(/Size:\s+([\d.]+\s+\w+)/)[1]),
      time: data => $('.tail', data).toArray().map(i => i.textContent.match(/Updated:\s+(.*?)\s{2}/)[1]),
      sort: '.btn-group',
      page: '.pagination',
      more: {
        Files: data => $('.tail', data).toArray().map(i => i.textContent.match(/Files:\s+(\d+)/)[1]),
        Downloads: data => $('.tail', data).toArray().map(i => i.textContent.match(/Downloads:\s+(\d+)/)[1])
      }
    },
    KickassTorrents: { // TODO FIX
      searchPage: 'https://kickasstorrents.to/usearch/{q}/',
      title: '.cellMainLink',
      magnet: data => $('.iaconbox>div', data).toArray().map(i => JSON.parse($(i).attr('data-sc-params').replace(/'/g, '"')).magnet),
      size: '[id^="torrent_"]>td:nth-child(2)',
      time: '[id^="torrent_"]>td:nth-child(4)',
      sort: '.tabNavigation:gt(0)',
      page: data => $('.pages', data).html().replace(/[\r\n]+/g, '').replace(/<script.*/, ''),
      more: {
        Files: '[id^="torrent_"]>td:nth-child(3)',
        Speed: '[id^="torrent_"]>td:nth-child(5)',
        Leech: '[id^="torrent_"]>td:nth-child(6)'
      }
    },
    iDope: {
      searchPage: 'https://idope.se/torrent-list/{q}/',
      title: '.resultdivtop>a',
      magnet: data => $('[id^="hideinfohash"]', data).toArray().map(i => 'magnet:?xt=urn:btih:' + i.textContent.toUpperCase()),
      size: '.resultdivbottonlength',
      time: '.resultdivbottontime',
      page: '#div3',
      more: {
        Seed: '.resultdivbottonseed',
        Files: '.resultdivbottonfiles'
      }
    },
    Extratorrent: {
      searchPage: 'https://extratorrent.cd/search/?search={q}',
      title: '.tli>a',
      magnet: 'a[title="Magnet link"]',
      size: '.tl tr>td:nth-child(5)',
      time: '.tl tr>td:nth-child(4)',
      sort: '.tl tr>th:gt(0):lt(-1)',
      page: 'td[style="padding: 5px;"]:has(.pager_link)',
      more: {
        S: '.tl tr>td:nth-child(6)',
        L: '.tl tr>td:nth-child(7)'
      }
    },
    'KAT - Kickass Torrents': { // TODO FIX
      searchPage: 'https://kickasstorrents.to/katsearch/page/1/{q}',
      title: '.tli>a',
      magnet: 'a[title="Magnet link"]',
      size: '.tl tr>td:nth-child(5)',
      time: '.tl tr>td:nth-child(4)',
      sort: '.tl tr>th:gt(0):lt(-1)',
      page: 'td[style="padding: 5px;"]:has(.pager_link):gt(0)',
      more: {
        S: '.tl tr>td:nth-child(6)',
        L: '.tl tr>td:nth-child(7)'
      }
    },
    'BTAnt (Down)': {
      searchPage: 'http://www.btunt.com/search/{q}-hot-desc-1',
      title: '.search-item>.item-title>a',
      magnet: '.search-item>.item-bar>a[href^="magnet"]',
      size: '.search-item>.item-bar>span:nth-child(4)>b',
      time: '.search-item>.item-bar>span:nth-child(1)>b',
      sort: '.order',
      page: '.bottom-pager',
      more: {
        Hot: '.search-item>.item-bar>span:nth-child(2)>b',
        LastActived: '.search-item>.item-bar>span:nth-child(3)>b'
      }
    },
    BTGG: {
      searchPage: 'https://www.btgg.cc/search?q={q}',
      title: '.item>.name>a',
      magnet: '.item>.meta>a',
      size: '.item>.meta>span:nth-child(2)',
      time: '.item>.meta>span:nth-child(4)',
      page: data => {
        const q = data.match(/<title>(.*?) - BTGG<\/title>/)[1];
        return $('.el-pager>.number', data).toArray().map((item, index) => `<a href="/search?q=${q}&p=${item.textContent}">${item.textContent}</a>`).join('');
      },
      more: {
        Requests: '.item>.meta>span:nth-child(3)',
        Files: '.item>.meta>span:nth-child(5)'
      }
    },
    BTHub: {
      searchPage: 'https://bthub.monster/cn/search/kw-{q}-1.html',
      title: '.search-item>.item-title a',
      magnet: data => $('.search-item>.item-title a', data).toArray().map(i => 'magnet:?xt=urn:btih:' + i.href.match(/hash\/(.*?).html/)[1]),
      size: '.search-item>.item-bar>span:nth-child(1)>b',
      time: '.search-item>.item-bar>span:nth-child(2)>b',
      sort: '#sort-bar>a',
      page: '.bottom-pager',
      more: {
        Hot: '.search-item>.item-bar>span:nth-child(3)>b'
      }
    }
  };
  var m2tLib = [
    'http://btcache.me/torrent/{hash}',
    // 'http://storetorrents.me/hash/{hash}',
    'https://itorrents.org/torrent/{hash}.torrent?title={name}',
    'https://torrage.info/torrent.php?h={hash}',
    // (hash, name) => `https://www.seedpeer.eu/torrent/${hash.toLowerCase()},
    // (hash, name) => `http://www.torrent.org.cn/home/convert/magnet2torrent.html?hash==${hash.toLowerCase()}`,
    (hash, name) => `http://v2.uploadbt.com/?r=down&hash=${hash.toLowerCase()}&name=${name}`,
    (hash, name) => `https://btdb.eu/dl/${hash.toLowerCase().substr(0, 2)}/${hash.toLowerCase()}.torrent`,
    (hash, name) => `https://watercache.nanobytes.org/get/${hash.toLowerCase()}/${name}`
  ];
  var markLib = [
    { // 0
      name: '等待中',
      color: 'gray'
    }, { // 1
      name: '有种子无配额',
      color: 'gray'
    }, { // 2
      name: '下载中',
      color: 'blue'
    }, { // 3
      name: '已下-骑兵',
      color: 'green'
    }, { // 4
      name: '已下-步兵',
      color: 'green'
    }, { // 5
      name: '已删-不喜欢的',
      color: 'black'
    }
  ];

  for (const _site of $$.siteLib) {
    const filtered = typeof _site.filter === 'function' ? (await _site.filter()) : window.location.href.match(_site.filter);
    if (filtered) {
      $$._site = _site;
      break;
    }
  }
  if (!$$._site) return;

  if ($$._site.manual) {
    $(window).on('keydown', function (e) {
      if (e.keyCode === 65 && e.shiftKey) { // Shift+A
        _init();
        $(window).off('keydown');
      }
    });
  } else {
    _init();
  }

  console.log($$);

  // if (location.href === 'http://115.com/?tab=offline&mode=wangpan') downloadIn115();

  function _init () {
    init();
    getCode(true);
    if ($$._site.extra && typeof $$._site.extra === 'function') $$._site.extra();
    markAdded();
  }

  function init () {
    $('<style></style>').appendTo('head').text(() => {
      const mark = markLib.map((_, i) => '.hMark_' + i + '{background-color:' + _.color + ';color:#FFF;}');
      const markImg = markLib.map((_, i) => '.hMarkImg_' + i + '{background-image:url(' + GM_getResourceURL('mark' + i) + ');background-size:24px;width:24px;height:24px;}');
      const style = [
        '.hBanner{position:fixed;background-color:#F2F2F2;z-index:999999;}',
        '.hBanner{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;}',
        '.hBanner>*{cursor:pointer;float:left;margin:0 1px 0 1px;}',
        '.hBanner *{line-height:9px;text-shadow:none;}',
        '.hBanner img,.showTable img{width:24px;height:24px;}',
        '.switcher{width:32px;height:24px;background:#333;border-radius:12px;position:relative;}',
        '.switcher>span{position:absolute;left:6px;top:7px;height:2px;color:#26CA28;font-size:16px;text-transform:Capitalize;}',
        '.hBanner>:not(.switcher):not(.hasCode){width:24px;height:24px;}',
        '.links>*,.addCode>*{background-color:#F2F2F2;display:none;width:24px;height:24px;}',
        '.links>:nth-child(1),.addCode>:nth-child(1){display:inline;}',
        '.links:hover>*,.addCode:hover>*{display:inline;}',
        '.links>.avOnline{border:solid 1px black;}',
        '.hasCode>a{margin:1px;padding:0 1px;display:none;}',
        '.hasCode,.hasCode>*{line-height:normal;}',
        '.showTable{background-color:#F2F2F2;position:absolute;top:80px;z-index:999998;}',
        '.showTable>table,.hSearch{border-collapse:collapse;margin:0 auto;color:#666666;font-size:13px;text-align:center;background-color:#FFF;text-transform:capitalize;}',
        '.showTable tr:nth-child(2n),.hSearch tr:nth-child(2n){background-color:#F2F2F2;}',
        '.showTable td,.showTable th,.hSearch th,.hSearch td{border:1px solid black;max-width:400px;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
        '.hSearch td>*{margin:0 1px;height:auto;line-height:normal;display:inline;}',
        '.hSearch img{width:16px;position:relative;top:2px;}',
        '.hSearch button{cursor:pointer;}',
        '.hSearchPage>td *{padding:0 1px;}',
        '.hSearchPage>td>*{display:inline;}',
        '.hSearchPage>td>*.active{font-weight:bolder;}',
        '.hSearchPage>td>*.active *{color:gray;}',
        //
        '.fa-file-video-o{background-color:yellow;color:yellow;}',
        '.tablesorter-header{background-image:url(data:image/gif;base64,R0lGODlhFQAJAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAkAAAIXjI+AywnaYnhUMoqt3gZXPmVg94yJVQAAOw==);background-repeat:no-repeat;background-position:center right;padding:0 18px 0 4px!important;cursor:pointer;}',
        '.tablesorter-headerAsc{background-image:url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);}',
        '.tablesorter-headerDesc{background-image:url(data:image/gif;base64,R0lGODlhFQAEAIAAACMtMP///yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);}',
        '.sorter-false{background:none;cursor:default;}',
        '.hHighlight{font-weight:bold;font-size:110%;color:#F00;}'
      ];
      return style.concat(mark, markImg).join('');
    });
    $('<div class="hBanner"></div>').on({
      mousedown: function (e1) {
        if (e1.target !== $('.hasCode')[0]) return;
        $(this).off('mouseout');
        $('body').mouseup(function (e2) {
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
            mouseout: function () {
              $('.hasCode>a').hide();
            }
          });
        });
      },
      mouseover: function () {
        $('.hasCode>a').show();
      },
      mouseout: function () {
        $('.hasCode>a').hide();
      }
    }).css({
      top: GM_getValue('top', 0),
      left: GM_getValue('left', 0)
    }).appendTo('body');
    $('<div class="switcher"></div>').html('<span>on</span>').appendTo('.hBanner').on({
      click: function () {
        if ($(this).text() === 'on') {
          $(this).find('span').text('off').css('color', 'red');
          undoMarkAdded();
        } else {
          $(this).find('span').text('on').css('color', 'green');
          markAdded();
        }
      },
      contextmenu: function (e) {
        e.preventDefault();
        $(this).find('span').text('on').css('color', 'green');
        undoMarkAdded();
        markAdded();
      }
    });
    $('<div class="links"></div>').html(function () {
      var _html = '';
      for (const site of $$.siteLib) {
        if (!site.on || site === $$._site) continue;
        const hostname = new URL(site.search).hostname;
        _html += `<img${site.online ? ' class="avOnline"' : ''} src="//${hostname}/favicon.ico" url="${site.search}" title="${site.name}" onerror="this.src='//www.google.com/s2/favicons?domain=${hostname}';this.onerror=null;">`;
      }
      return _html;
    }).on({
      click: function (e) {
        var code = getCode();
        GM_openInTab($(e.target).attr('url').replace('{searchTerms}', code));
      },
      contextmenu: function (e) {
        e.preventDefault();
        var code = getCode().match(/[a-z0-9]+/gi).join(' ');
        GM_openInTab($(e.target).attr('url').replace('{searchTerms}', code));
      }
    }).appendTo('.hBanner');
    $('.links>.avOnline').on({
      mouseover: function () {
        $(this).attr({
          rawSrc: this.src,
          src: GM_getResourceURL('play')
        });
      },
      mouseout: function () {
        $(this).attr('src', $(this).attr('rawSrc'));
      }
    });
    $('<div class="addCode"title="添加到数据库/移动"></div>').html('<img src="' + GM_getResourceURL('add') + '">').click(function () {
      addValue(GM_getValue('lastMark', 0));
    }).appendTo('.hBanner');
    $('<div class="delCode"title="从数据库中删除"></div>').html('<img src="' + GM_getResourceURL('del') + '">').click(function () {
      delValue();
    }).appendTo('.hBanner');
    $('<div class="importCode"title="导入到数据库"></div>').html('<img src="' + GM_getResourceURL('import') + '">').click(function () {
      importValue();
    }).appendTo('.hBanner');
    $('<div title="左键:数据库展示\n右键:下载数据库(网页格式)"></div>').html('<img src="' + GM_getResourceURL('table') + '">').on({
      click: function () {
        showValue(0);
        $(this).off('click').on('click', function () {
          $('.showTable').toggle();
        });
      },
      contextmenu: function (e) {
        e.preventDefault();
        showValue(1);
      }
    }).appendTo('.hBanner');
    $('<div title="复制信息"></div>').html('<img src="' + GM_getResourceURL('copy') + '">').on({
      click: async () => {
        if (!$$._site.info) return;
        const code = getCode();
        const info = [code];
        for (let i = 0; i < $$._site.info.length; i++) {
          const value = $$._site.info[i];
          let result;
          if (typeof value === 'string') {
            result = $(value).toArray().map(i => i.textContent.trim()).sort().join(', ');
          } else if (typeof value === 'function') {
            result = await value();
          } else {
            result = '';
          }
          result = result.toString();
          if ([0].includes(i)) result = result.replace(code, '');
          if ([3, 4].includes(i)) result = result.match(/[\d.]+/) ? result.match(/[\d.]+/)[0] : result;
          info.push(result.replace(code, '').trim());
        }
        GM_setClipboard(info.join('\t'));
      }
    }).appendTo('.hBanner');
    $('<div title="重启"></div>').html('<img src="' + GM_getResourceURL('restart') + '">').click(function () {
      $('.hBanner').remove();
      undoMarkAdded();
      $(window).removeData('code');
      init();
      markAdded();
    }).appendTo('.hBanner');
    $('<div class="hasCode">Marked: </div>').appendTo('.hBanner');
    for (var i = 0; i < markLib.length; i++) {
      $('<img src="' + GM_getResourceURL('mark' + i) + '"title="' + i + '|' + markLib[i].name + '">').val(i).click(function () {
        addValue($(this).val());
      }).appendTo('.addCode');
    }
  }

  function markAdded () {
    $('.hasCode a').remove();
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    if ($$._site.img) {
      $($$._site.img).removeAttr('onerror').attr({
        rawSrc: function () {
          return $(this).attr('src');
        },
        src: function () {
          var keyword;
          var _src = $(this).attr('src');
          for (var i in lib) {
            keyword = new RegExp(i + '|' + i.replace('-', ''), 'gi');
            if (keyword.test(_src)) {
              if ($('.hasCode a[name="' + i + '"]').length === 0) $('<a target="_blank"></a>').addClass('hMark_' + lib[i].mark).attr('name', i).attr('href', $$._siteFavorite.search.replace('{searchTerms}', i)).html(i).appendTo('.hasCode');
              _src = GM_getResourceURL('mark' + lib[i].mark);
              break;
            }
          }
          return _src;
        }
      });
    }
    if ($$._site.text) {
      $($$._site.text).each(function () {
        var keyword;
        var _html = $(this).html();
        $(this).empty();
        for (var i in lib) {
          keyword = new RegExp(`${i}|${i.replace(/-/g, '')}|${i.replace(/-/g, ' ')}|${i.replace(/ /g, '-')}|${i.replace(/ /g, '')}`, 'gi');
          if (keyword.test(_html)) {
            if ($('.hasCode a[name="' + i + '"]').length === 0) $('<a target="_blank"></a>').addClass('hMark_' + lib[i].mark).attr('name', i).attr('href', $$._siteFavorite.search.replace('{searchTerms}', i)).html(i).appendTo('.hasCode');
            _html = _html.replace(keyword, '<span class="hMark_' + lib[i].mark + '" title="' + markLib[lib[i].mark].name + '">' + i + '</span>');
          }
        }
        $('<span>' + _html + '</span>').appendTo(this);
      });
    }
  }

  function undoMarkAdded () {
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    if ($$._site.img) {
      $($$._site.img).attr({
        src: function () {
          return $(this).attr('rawSrc');
        }
      }).removeAttr('rawSrc');
    }
    $($$._site.text).html(function () {
      return $(this).text();
    });
  }

  function addValue (mark, code = undefined) {
    mark = parseInt(mark);
    if (mark >= markLib.length) {
      window.alert('请输入正确的标记，范围: 0-' + (markLib.length - 1));
      return;
    }
    var lib = GM_getValue('lib', null) || {};
    code = code || getCode();
    if (!code) return;
    GM_setValue('lastMark', mark);
    lib[code] = {
      mark: mark
    };
    if (mark === 0 || mark === 6) lib[code].time = $($$._site.time).text();
    GM_setValue('lib', lib);
    undoMarkAdded();
    markAdded();
  }

  function delValue (code = undefined) {
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    code = code || getCode();
    if (!code) return;
    delete lib[code];
    GM_setValue('lib', lib);
    undoMarkAdded();
    markAdded();
  }

  function importValue () {
    const mark = window.prompt('请输入车位\n-1. 删除\n' + markLib.map((_, i) => `${i}. ${_.name}\n`).join('')) * 1;
    if (isNaN(mark) || mark >= markLib.length || mark < -1) {
      window.alert(`请输入正确的标记，范围: -1 ==> ${markLib.length - 1}`);
      return;
    }
    let codeArr = window.prompt('请输入车牌号，以|为分割');
    if (!codeArr) return;
    codeArr = codeArr.split('|');
    const lib = GM_getValue('lib', {});
    for (let i = 0; i < codeArr.length; i++) {
      if (mark === -1 && codeArr[i] in lib) {
        delete lib[codeArr[i]];
      } else {
        lib[codeArr[i]] = {
          mark: mark
        };
      }
    }
    GM_setValue('lib', lib);
    undoMarkAdded();
    markAdded();
  }

  function showValue (type) {
    const lib = GM_getValue('lib', {});
    let _html = '<table class="tablesorter"><thead><tr><th>序号</th><th>数字</th><th>标记</th><th>代码</th><th>时间</th></tr></thead><tbody>';
    let num = 1;
    for (const i in lib) {
      _html += `<tr><td>${num++}</td><td>${lib[i].mark}</td><td><img class="hMarkImg_${lib[i].mark}">${markLib[lib[i].mark].name}</td><td><a href="${$$._siteFavorite.search.replace('{searchTerms}', i)}"target="_blank">${i}</a></td><td>${lib[i].time || ''}</td></tr>`;
    }
    _html += '</tbody></table>';
    if (type === 0) {
      $('<div class="showTable"></div>').html(_html).appendTo('body');
    } else if (type === 1) {
      const markImg = markLib.map((_, i) => '.hMarkImg_' + i + '{background-image:url(' + GM_getResourceURL('mark' + i) + ');background-size:24px;width:24px;height:24px;}').join('');
      _html = '<html><head><script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.29.0/js/jquery.tablesorter.min.js"></script><style>.showTable{background-color:white;}.showTable>table{border-collapse:collapse;}.showTable tr{background-color:white;}.showTable th,.showTable td{border:1px solid black;}</style><style>' + markImg + '</style></head><body><div class="showTable">' + _html + '</div><script>$(".showTable>table").tablesorter();</script></body></html>';
      const blob = new window.Blob([_html], {
        type: 'text/html;charset=utf-8'
      });
      $(`<a href="${URL.createObjectURL(blob)}" download="1.html"></a>`)[0].click();
    }
  }

  function getCode (first = undefined) {
    if ($(window).data('code')) return $(window).data('code');
    let code = '';
    const lib = $$._site;
    if (typeof lib.code === 'string') {
      const temp = $(lib.code);
      if (temp.length > 0) code = (temp[0].tagName === 'INPUT') ? temp.val() : temp.text();
    } else if (typeof lib.code === 'function' && (!first || !lib.codeManual)) {
      code = lib.code();
    }
    code = code.toUpperCase();
    $(window).data('code', code);
    if (code) getMagnet(code, undefined, GM_getValue('lastSearch', undefined));
    return code;
  }

  function getMagnet (code, page = undefined, searchUrl = undefined) {
    searchUrl = searchUrl in magnetLib ? searchUrl : Object.keys(magnetLib)[0];
    var lib = magnetLib[searchUrl];
    var searchPage = typeof lib.searchPage === 'string' ? lib.searchPage.replace('{q}', encodeURIComponent(code)) : lib.searchPage(code);
    var url = page ? new URL(page, searchPage).href : searchPage;
    if ($('.hSearch').length === 0) {
      $('<table class="hSearch"></table>').html(`<caption>站点: <img class="hSearchSiteImg" src="//www.google.com/s2/favicons?domain=${new URL(searchPage).host}"><select class="hSearchSite">${Object.keys(magnetLib).map(i => `<option>${i}</option>`).join('')}</select></caption><thead><tr></tr></thead><tbody></tbody><tfoot></tfoot>`).insertAfter($$._site.after || 'body>:eq(-1)');
      $('.hSearchSite').val(searchUrl);
      // 重载
      $('.hSearch').on('click', '.hSearchReload', e => {
        e.preventDefault();
        $('.hSearch').trigger('destroy');
        const target = e.target;
        getMagnet(getCode(), $(target).attr('href'), $('.hSearchSite').val());
      });
      // 排序翻页事件
      $('.hSearch').on('click', '.hSearchSort a,.hSearchPage a', e => {
        e.preventDefault();
        $('.hSearch').trigger('destroy');
        let target = e.target;
        if (!$(target).is('a')) target = $(target).parents().filter('a')[0];
        getMagnet(getCode(), $(target).attr('href'), $('.hSearchSite').val());
      });
      // 选择其他站点
      $('.hSearch').on('change', '.hSearchSite', () => {
        GM_setValue('lastSearch', $('.hSearchSite').val());
        if (typeof $('.hSearch').data('abort') === 'function') {
          try {
            $('.hSearch').data('abort')();
          } catch (error) {}
        }
        $('.hSearchSiteImg').attr('src', '//www.google.com/s2/favicons?domain=' + magnetLib[$('.hSearchSite').val()].searchPage);
        $('.hSearch').trigger('destroy');
        getMagnet(getCode(), undefined, $('.hSearchSite').val());
      });
      // 按钮
      $('.hSearch').on('click', '.hSearchCopy', e => {
        const target = $(e.target).parents('tr').find('td>a')[0];
        setNotice(target.innerText, target.href);
        GM_setClipboard(target.href);
      });
      $('.hSearch').on('click', '.hMagnet_115', e => {
        const target = $(e.target).parents('tr').find('td>a')[0];
        GM_setValue('link', target.href);
        GM_setValue('name', target.innerText);
        addValue(2);
      });
    }
    $('.hSearch>thead>tr:nth-child(1)').html(`<th>#</th><th><a class="hSearchReload" href="${url}" title="重载">名称</a></th><th><a href="${url}" target="_blank" title="新标签打开">大小</a></th><th>时间</th>${lib.more && Object.keys(lib.more).length ? '<th>' + Object.keys(lib.more).join('</th><th>') + '</th>' : ''}<th data-sorter="false">下载种子</th><th data-sorter="false">操作</th>`);
    $('.hSearchSort,.hSearch>tbody>tr,.hSearchPage').remove();
    var codeArr = code.split('-');
    var expArr = [];
    for (var i = 0; i < codeArr.length; i++) {
      expArr.push(new RegExp(reEscape(codeArr[i]), 'gi'));
    }
    var abort = GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      timeout: 30 * 1000,
      onload (res) {
        const data = res.response;
        const info = {};
        for (const i in lib) { // 获取信息
          if (['searchPage', 'more'].includes(i)) continue;
          if (typeof lib[i] === 'string') {
            info[i] = $(lib[i], data).toArray().map(j => {
              if (i === 'title') {
                return j;
              } else if (['sort', 'page'].includes(i)) {
                return j.innerHTML.replace(/<(|\/)(td|th)>/g, '<$1span>');
              } else if (i === 'magnet') {
                return j.href;
              } else {
                return j.textContent;
              }
            });
          } else {
            info[i] = lib[i](data);
          }
        }
        let hash;
        if (info.magnet) {
          hash = info.magnet.map(i => i.match(/^magnet:\?xt=urn:btih:(.*?)(&|$)/)[1].toUpperCase());
        } else {
          hash = info.magnet = new Array(info.title.length).fill('');
        }
        if (lib.more && Object.keys(lib.more).length) {
          info.more = {};
          for (const i in lib.more) {
            info.more[i] = typeof lib.more[i] === 'string' ? $(lib.more[i], data).toArray().map(i => i.outerHTML.replace(/<(|\/)(td|th)( |>)/g, '<$1span$3')) : lib.more[i](data, lib);
          }
        }
        console.log('load: ', url, '\ndata: ', [data], '\ninfo: ', info);
        for (let i = 0; i < info.title.length; i++) {
          let name = info.title[i].title || info.title[i].textContent;
          const downloadHTML = m2tLib.map(j => {
            const url = typeof j === 'function' ? j(hash[i], name) : j.replace('{hash}', hash[i]).replace('{name}', name);
            return `<a href="${url}" target="_blank"><img src="//www.google.com/s2/favicons?domain=${new URL(url).host}"></a>`;
          }).join('');
          for (let j = 0; j < codeArr.length; j++) {
            name = name.replace(expArr[j], '<span class="hHighlight">' + codeArr[j] + '</span>');
          }
          $('<tr></tr>').appendTo('.hSearch>tbody').html(`
            <td>${i + 1}</td>
            <td><a href="${info.magnet[i]}">${name}</a></td>
            <td><a href="${new URL(info.title[i].pathname, searchPage).href}" target="_blank">${info.size[i]}</a></td>
            <td>${info.time[i]}</td>
            ${lib.more && Object.keys(lib.more).length ? '<td>' + Object.keys(lib.more).map(j => info.more[j][i]).join('</td><td>') + '</td>' : ''}
            <td>${downloadHTML}</td>
            <td>
              <button class="hSearchCopy">复制</button>
              <a href class="hMagnet_115"><img src="//115.com/favicon.ico"></a>
              <a href="https://d.miwifi.com/d2r/?url=${window.btoa(info.magnet[i])}" target="_blank"><img src="//d.miwifi.com/favicon.ico"></a>
              <a href="https://m.zbigz.com/startcache?url=${encodeURIComponent(info.magnet[i])}" target="_blank"><img src="//zbigz.com/img/favicon.ico"></a>
              </td>
            `);
        }
        $('.hSearch').tablesorter();
        const colspan = lib.more ? Object.keys(lib.more).length + 6 : 6;
        if (info.title.length === 0) { // 无搜索结果
          $('<tr></tr>').appendTo('.hSearch>tbody').html(`<td colspan="${colspan}">No search result</td>`);
        } else {
          if (info.sort) $('<tr class="hSearchSort"></tr>').appendTo('.hSearch>thead').html(`<td colspan="${colspan}">${info.sort}</td>`).show(); // 排序
          if (info.page) $('<tr class="hSearchPage"></tr>').appendTo('.hSearch>tfoot').html(`<td colspan="${colspan}">${info.page}</td>`); // 翻页
        }
      },
      onerror () {
        $('<tr></tr>').appendTo('.hSearch>tbody').html(`<td colspan="${$('.hSearch>thead>tr>th').length}">Load<a href="${url}" target="_blank">${url}</a> Error</td>`);
      },
      ontimeout () {
        $('<tr></tr>').appendTo('.hSearch>tbody').html(`<td colspan="${$('.hSearch>thead>tr>th').length}">Load <a href="${url}" target="_blank">${url}</a> Timeout</td>`);
      }
    }).abort;
    $('.hSearch').data('abort', abort);
  }

  function downloadIn115 () {
    if (document.readyState !== 'complete') {
      setTimeout(downloadIn115, 200);
    } else {
      $('<a href="javascript:;" class="opmenu-clean">清空所有任务</a>').prependTo(unsafeWindow.frames.wangpan.document.querySelector('.operate-menu')).on({
        click: function () {
          unsafeWindow.Core.OFFL5Plug.GetDataCtl().list(function (e) {
            var tasks = e.tasks;
            tasks.forEach(function (task) {
              unsafeWindow.Core.OFFL5Plug.Delete(task, null);
            });
          });
        }
      });
      setInterval(function () {
        if (GM_getValue('link')) {
          var link = GM_getValue('link');
          GM_setValue('task', link.match(/^magnet:\?xt=urn:btih:(.*?)(&|$)/)[1].toLowerCase());
          unsafeWindow.Core.OFFL5Plug.OpenLink();
          setTimeout(function () {
            if ($('#js_offline_new_add')) {
              $('#js_offline_new_add').val(link);
              GM_deleteValue('link');
              unsafeWindow.$('.con>.button').click();
              var checkResult = setInterval(function () {
                if ($('iframe[src^="//captchaapi.115.com"]').length > 0) { // 验证
                  clearInterval(checkResult);
                  setNotice('请重新验证你的帐号', null, GM_getResourceURL('warn'));
                } else if ($('.exph-suc').length > 0) { // 成功
                  // clearInterval(checkResult);
                  // setNotice($('.exph-suc').text(), null, GM_getResourceURL('downloading'));
                } else if ($('.exph-war').length > 0) { // 错误
                  clearInterval(checkResult);
                  setNotice($('.exph-war').text(), null, GM_getResourceURL('error'));
                  unsafeWindow.$('.btn-link').click();
                }
              }, 200);
            }
          }, 300);
        } else {
          unsafeWindow.Core.OFFL5Plug.Reload(); // 刷新任务
          if (GM_getValue('task') && $('iframe[src^="//captchaapi.115.com"]').length === 0) { // 检查下载情况
            unsafeWindow.Core.OFFL5Plug.GetDataCtl().list(function (e) {
              var tasks = e.tasks;
              for (var i = 0; i < tasks.length; i++) {
                if (tasks[i].info_hash === GM_getValue('task')) break;
              }
              if (i === tasks.length) {
                GM_deleteValue('task');
                return;
              }
              var p = Math.round(tasks[i].percentDone * 100) / 100;
              var now = Math.floor(p / 4);
              setNotice(tasks[i].name, '▉'.repeat(now) + '▁'.repeat(25 - now) + ' ' + p + '%', tasks[i].status === 2 ? GM_getResourceURL('success') : getProcess(p, 128));
              if (tasks[i].status === 2) GM_deleteValue('task'); // 1:下载中 2:下载完成
            });
          }
        }
      }, 2000);
    }
  }

  function setNotice (title, body = undefined, icon = undefined) {
    if (window.Notification && window.Notification.permission !== 'denied') {
      window.Notification.requestPermission(function (status) {
        if (status === 'granted') {
          var option = {
            tag: 'hParkingLot',
            icon: icon || GM_getResourceURL('success')
          };
          if (body) option.body = body;
          var n = new window.Notification(cutByte(title, 28), option);
          n.onclick = function () {
            n.close();
          };
          setTimeout(function () {
            if (n) n.close();
          }, 3000);
        }
      });
    }
  }

  function getProcess (process, radius) { // https://imys.net/20150722/canvas-annulus-process.html
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

  function cutByte (str, len, endstr = '...') { // http://www.cnblogs.com/whyoop/p/3680228.html
    function n2 (a) { // 用于二分法查找
      var n = a / 2 | 0;
      return (n > 0 ? n : 1);
    }

    function getBlength (str) {
      for (var i = str.length, n = 0; i--;) {
        n += str.charCodeAt(i) > 255 ? 2 : 1;
      }
      return n;
    }
    if (str.length <= len) return str;
    if (!(str + '').length || !len || len <= 0) return '';
    if (getBlength(str) <= len) {
      return str;
    } // 整个函数中最耗时的一个判断,欢迎优化
    var lenS = len;
    var _lenS = 0;
    var _strl = 0;
    while (_strl <= lenS) {
      var _lenS1 = n2(lenS - _strl);
      _strl += getBlength(str.substr(_lenS, _lenS1));
      _lenS += _lenS1;
    }
    return str.substr(0, _lenS - 1) + endstr;
  }

  function reEscape (s) {
    return s.replace(/[$()*+.[\]?^{}|]+/g, '\\$&');
  }
})(jQuery);
