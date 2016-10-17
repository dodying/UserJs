// ==UserScript==
// @name        hParkingLot
// @name:zh-CN  【H】停车场
// @namespace   https://github.com/dodying/Dodying-UserJs
// @include     https://btso.pw/*
// @include     https://btdb.in/*
// @include     http://www.javlibrary.com/*
// @include     http://www.dmm.co.jp/*
// @include     https://www.google.co.jp/*
// @include     https://www.baidu.com/*
// @include     https://www.av28.com/*
// include     *.tokyo-hot.com/*
// include     *.caribbeancom.com/*
// include     *.1000giri.net/*
// include     *.10musume.com/*
// include     *.heyzo.com/*
// include     *.1pondo.tv/*
// @version     1.03
// @grant       GM_setValue
// @grant       GM_getValue
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://raw.githubusercontent.com/christianbach/tablesorter/master/jquery.tablesorter.js
// @run-at      document-end
// ==/UserScript==
(function ($) {
  var linkLib = {
    'btso.pw': {
      fav: 'https://btso.pw/app/bts/View/img/favicon.ico',
      search: 'http://btso.pw/search/{searchTerms}/',
      text: 'h3,.file'
    },
    'btdb.in': {
      fav: 'https://btdb.in/favicon.ico',
      search: 'https://btdb.in/q/{searchTerms}/',
      text: 'h1.torrent-name,.file-name,.item-title>a'
    },
    'www.javlibrary.com': {
      fav: 'http://www.javlibrary.com/favicon.ico',
      search: 'http://www.javlibrary.com/cn/vl_searchbyid.php?keyword={searchTerms}',
      text: '.text:lt(2),.id',
      img: '#video_jacket_img,.previewthumbs>img,.id+img,strong>a',
      name: '.post-title',
      time: '.text:eq(2)'
    },
    'www.dmm.co.jp': {
      fav: 'http://www.dmm.co.jp/favicon.ico',
      search: 'http://www.dmm.co.jp/search/=/searchstr={searchTerms}',
      text: '.txt,table.mg-b20 td',
      img: '.img img,.tdmm,.crs_full>img',
      name: '#title',
      time: ''
    },
    'www.google.co.jp': {
      fav: 'https://www.google.co.jp/images/branding/product/ico/googleg_lodp.ico',
      search: 'https://www.google.co.jp/search?q={searchTerms}',
      text: 'h3.r>a,span.st'
    },
    'www.baidu.com': {
      fav: 'https://www.baidu.com/img/baidu.svg',
      search: 'https://www.baidu.com/baidu?wd={searchTerms}',
      text: 'h3.t>a,.c-abstract'
    },
    'www.av28.com': {
      fav: 'https://cdn3.iconfinder.com/data/icons/block/32/letter-24.png',
      search: 'https://www.av28.com/cn/search/{searchTerms}',
      text: '.item>div>a,.item>div>span,.row-fluid>h3,.info>p>span',
      img: '.img,.bigImage>img,.sample-box img',
      name: '',
      time: ''
    }
  };
  var imgLib = {
    add: 'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519691-199_CircledPlus-24.png',
    del: 'https://cdn2.iconfinder.com/data/icons/social-messaging-productivity-1/128/trash-24.png',
    import: 'https://cdn1.iconfinder.com/data/icons/design-2d-cad-solid-set-2/60/079-Import-24.png',
    show: 'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519904-098_Spreadsheet-24.png'
  };
  var markLib = [
    {
      name: '等待中',
      img: 'https://cdn2.iconfinder.com/data/icons/lightly-icons/24/time-24.png',
      color: 'gray'
    },
    {
      name: '下载中',
      img: 'https://cdn4.iconfinder.com/data/icons/education-bold-line-1/49/34-24.png',
      color: 'blue'
    },
    {
      name: '已出已下-骑兵',
      img: 'https://cdn3.iconfinder.com/data/icons/chess-8/512/horse-game-role-chess-24.png',
      color: 'green'
    },
    {
      name: '已出已下-步兵',
      img: 'https://cdn3.iconfinder.com/data/icons/chess-8/154/chess-pawn-24.png',
      color: 'green'
    },
    {
      name: '已出已下已删-不喜欢的',
      img: 'https://cdn1.iconfinder.com/data/icons/lightly-icons/24/heart-broken-24.png',
      color: 'black'
    },
    {
      name: '女同',
      img: 'https://cdn2.iconfinder.com/data/icons/gender-and-feminism-solid/100/lesbian-24.png',
      color: 'pink'
    },
    {
      name: '超过1年无资源',
      img: 'https://cdn3.iconfinder.com/data/icons/transfers/100/239345-reload_time_delay-24.png',
      color: 'red'
    },
    {
      name: '首次亮相',
      img: 'https://cdn3.iconfinder.com/data/icons/social-messaging-productivity-5/128/new-label-24.png',
      color: 'yellow'
    }
  ];
  init();
  markAdded();
  function init() {
    $('<style></style>').appendTo('head').html('' +
    '.hBanner{position:fixed;background-color:white;z-index:9999;top:0;}' +
    '.left{left:0;}' +
    '.right{right:0;}' +
    '.hBanner>*{cursor:pointer;float:left;margin:0 1px0 1px;}' +
    '.switcher{width:32px;height:24px;background:#333;border-radius:12px;position:relative;}' +
    '.switcher>span{position:absolute;left:6px;top:2px;height:2px;color:#26CA28;font-size:16px;text-transform:Capitalize;}' +
    '.links,.addCode,.delCode,.importCode,.showCode{width:24px;height:24px;}' +
    '.links img,.addCode img{background-color:white;}' +
    '.links>*,.addCode>*{display:none;}' +
    '.links>*:nth-child(1),.addCode>*:nth-child(1){display:inline;}' +
    '.hasCode>a{margin:0 1px;}' +
    '.showTable{background-color:white;position:absolute;top:60px;}' +
    '.showTable>table{border-collapse:collapse;}' +
    '.showTable>table>thead>tr{position:fixed;top:40px;}' +
    '.showTable td{border:1px solid black;}' +
    '.showTable>button{float:right;color:red;position:fixed;right:10px;}' +
    '.showTable>button:nth-child(1){top:70px;}' +
    '.showTable>button:nth-child(2){top:100px;}');
    $('<div class="hBanner left"></div>').on({
      contextmenu: function (e) {
        e.preventDefault();
        $(this).toggleClass('left').toggleClass('right');
      },
      mousedown: function () {
        $('body').mouseup(function (e) {
          $('.hBanner').css('top', e.clientY + 'px');
          $(this).off('mouseup');
        });
      }
    }).appendTo('body');
    $('<div class="switcher"></div>').html('<span>on</span>').appendTo('.hBanner').click(function () {
      if ($(this).find('span').text() === 'on') {
        $(this).find('span').text('off');
        undoMarkAdded();
      } else {
        $(this).find('span').text('on');
        markAdded();
      }
    });
    $('<div class="links"></div>').html(function () {
      var _html = '';
      for (var i in linkLib) {
        _html += '<span onclick="window.open(\'' + linkLib[i].search + '\'.replace(\'{searchTerms}\',this.title))"title="' + getCode() + '"><img src="' + linkLib[i].fav + '" width=24></img></a></span>';
      }
      return _html;
    }).appendTo('.hBanner');
    $('<div class="addCode"title="添加到数据库/移动"></div>').html('<img src="' + imgLib.add + '"></img>').click(function () {
      addValue(GM_getValue('lastMark', 0));
    }).appendTo('.hBanner');
    $('<div class="delCode"title="从数据库中删除"></div>').html('<img src="' + imgLib.del + '"></img>').click(function () {
      delValue();
    }).appendTo('.hBanner');
    $('<div class="importCode"title="导入到数据库"></div>').html('<img src="' + imgLib.import + '"></img>').click(function () {
      importValue();
    }).appendTo('.hBanner');
    $('<div class="showCode"title="数据库展示"></div>').html('<img src="' + imgLib.show + '"></img>').one('click', function () {
      showValue();
      $(this).click(function () {
        $('.showTable').toggle();
      });
    }).appendTo('.hBanner');
    $('<div class="hasCode">(已标记)</div>').appendTo('.hBanner');
    for (var i = 0; i < markLib.length; i++) {
      $('<img src="' + markLib[i].img + '"title="' + markLib[i].name + '"></img>').val(i).click(function () {
        addValue($(this).val());
      }).appendTo('.addCode');
    }
    $('.links,.addCode').on({
      mouseover: function () {
        $(this).children(':gt(0)').show();
      },
      mouseout: function () {
        $(this).children(':gt(0)').hide();
      }
    })
  }
  function markAdded() {
    $('.hasCode a').remove();
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    if (linkLib[location.host].img) {
      $(linkLib[location.host].img).removeAttr('onerror').attr({
        realSrc: function () {
          return $(this).attr('src');
        },
        src: function () {
          var keyword;
          var keyword2;
          var _src = $(this).attr('src');
          for (var i in lib) {
            keyword = new RegExp(i, 'gi');
            keyword2 = new RegExp(i.replace('-', ''), 'gi');
            if (keyword.test(_src) || keyword2.test(_src)) {
              if ($('.' + i).length === 0) $('<a target="_blank"></a>').addClass(i).attr('href', linkLib['www.javlibrary.com'].search.replace('{searchTerms}', i)).html(i).appendTo('.hasCode');
              _src = markLib[lib[i].mark].img;
            }
          }
          return _src;
        }
      });
    }
    $(linkLib[location.host].text).html(function () {
      var keyword;
      var keyword2;
      var _html = $(this).text();
      for (var i in lib) {
        keyword = new RegExp(i, 'gi');
        keyword2 = new RegExp(i.replace('-', ''), 'gi');
        if (keyword.test(_html) || keyword2.test(_html)) {
          if ($('.' + i).length === 0) $('<a target="_blank"></a>').addClass(i).attr('href', linkLib['www.javlibrary.com'].search.replace('{searchTerms}', i)).html(i).appendTo('.hasCode');
          _html = _html.replace(keyword, '<span style="background-color:' + markLib[lib[i].mark].color + ';">' + i + '</span>').replace(keyword2, '<span style="background-color:' + markLib[lib[i].mark].color + ';">' + i + '</span>');
        }
      }
      return _html;
    });
  }
  function undoMarkAdded() {
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    if (linkLib[location.host].img) {
      $(linkLib[location.host].img).attr({
        src: function () {
          return $(this).attr('realSrc');
        }
      }).removeAttr('realSrc');
    }
  }
  function addValue(mark, code) { //可选参数code
    var lib = GM_getValue('lib', null) || new Object();
    var code = code || getCode();
    if (!code) return;
    GM_setValue('lastMark', mark);
    lib[code] = {
      mark: mark,
      name: $(linkLib[location.host].text).text(),
      time: $(linkLib[location.host].time).text()
    };
    GM_setValue('lib', lib);
    markAdded();
  }
  function delValue(code) { //可选参数code
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    var code = code || getCode();
    if (!code) return;
    delete lib[code];
    GM_setValue('lib', lib);
  }
  function importValue() {
    var notice = '请输入车位\n';
    for (var i = 0; i < markLib.length; i++) {
      notice += i + markLib[i].name + '\n';
    }
    var mark = prompt(notice);
    if (!mark) return;
    var codeArr = prompt('请输入车牌号，以|为分割');
    if (!codeArr) return;
    codeArr = codeArr.split('|');
    var lib = GM_getValue('lib', null) || new Object();
    var code;
    for (var i = 0; i < codeArr.length; i++) {
      code = codeArr[i];
      if (lib[code] === undefined) {
        lib[code] = {
          mark: mark
        };
      } else {
        lib[code].mark = mark;
      }
    }
    GM_setValue('lib', lib);
  }
  function showValue() {
    var lib = GM_getValue('lib', null) || new Object();
    var _html = '<table class="tablesorter"><thead><tr><th>数字</th><th>标记</th><th>代码</th><th>标题</th><th>时间</th></tr></thead><tbody>';
    for (var i in lib) {
      _html += '<tr><td>' + lib[i].mark + '</td><td><img src="' + markLib[lib[i].mark].img + '"></img>' + markLib[lib[i].mark].name + '</td><td><a href="' + linkLib['www.javlibrary.com'].search.replace('{searchTerms}', i) + '"target="_blank">' + i + '</a></td><td>' + (lib[i].name || '') + '</td><td>' + (lib[i].time || '') + '</td></tr>';
    }
    _html += '</tbody></table>';
    $('<div class="showTable"></div>').html(_html).appendTo('body');
    $('<button>↑</button>').click(function () {
      $(window) [0].scrollTo(0, 0);
    }).prependTo('.showTable');
    $('<button>x</button>').click(function () {
      $('.showTable').toggle();
    }).prependTo('.showTable');
    $('.showTable>table').tablesorter();
  }
  function getCode() {
    if ($(window).data('code')) return $(window).data('code');
    var url = location.href;
    switch (location.host) {
      case 'www.dmm.co.jp':
        var temp = (url.match(/[a-zA-Z]+(\-|)[0-9]+/)) ? url.toUpperCase().match(/[a-zA-Z]+(\-|)[0-9]+/) [0] : url;
        if (url === temp) return;
        var code = prompt('请输入车牌号', temp);
        $(window).data('code', code);
        return code;
        break;
      case 'www.javlibrary.com':
        return $('#video_id .text').text();
        break;
      case 'btso.pw':
        return url.replace(/.*search\//, '');
        break;
      default:
        return '';
        break;
    }
  }
}) (jQuery);
