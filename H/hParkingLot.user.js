// ==UserScript==
// @name        hParkingLot
// @name:zh-CN  【H】停车场
// @namespace   https://github.com/dodying/Dodying-UserJs
// @include     https://btso.pw/*
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
// @version     1
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
    btsow: {
      url: 'http://btso.pw/search/',
      img: 'https://btso.pw/app/bts/View/img/favicon.ico'
    },
    jav: {
      url: 'http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=',
      img: 'http://www.javlibrary.com/favicon.ico'
    },
    dmm: {
      url: 'http://www.dmm.co.jp/search/=/searchstr=',
      img: 'http://www.dmm.co.jp/favicon.ico'
    },
    google: {
      url: 'https://www.google.co.jp/search?q=',
      img: 'https://www.google.co.jp/images/branding/product/ico/googleg_lodp.ico'
    },
    baidu: {
      url: 'https://www.baidu.com/baidu?wd=',
      img: 'https://www.baidu.com/img/baidu.svg'
    },
    av28: {
      url: 'https://www.av28.com/cn/search/',
      img: 'https://cdn3.iconfinder.com/data/icons/block/32/letter-24.png'
    }
  };
  var imgLib = {
    add: 'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519691-199_CircledPlus-24.png',
    move: 'https://cdn4.iconfinder.com/data/icons/social-messaging-productivity-4/128/move-24.png',
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
      name: '超过1年无资源',
      img: 'https://cdn3.iconfinder.com/data/icons/transfers/100/239345-reload_time_delay-24.png',
      color: 'red'
    }
  ];
  var seleLib = {
    'btso.pw': {
      text: 'h3,.file',
      img: ''
    },
    'www.javlibrary.com': {
      text: '.text:lt(2),.id',
      img: '#video_jacket_img,.previewthumbs>img,.id+img,strong>a'
    },
    'www.dmm.co.jp': {
      text: '.txt,table.mg-b20 td',
      img: '.img img,.tdmm,.crs_full>img'
    },
    'www.google.co.jp': {
      text: 'h3.r>a,span.st',
      img: ''
    },
    'www.baidu.com': {
      text: 'h3.t>a,.c-abstract',
      img: ''
    },
    'www.av28.com': {
      text: '.item>div>a,.item>div>span,.row-fluid>h3,.info>p>span',
      img: '.img,.bigImage>img,.sample-box img'
    }
  };
  init();
  markAdded();
  function init() {
    $('<style></style>').appendTo('head').html('' +
    '.hBanner{position:fixed;background-color:white;z-index:9999;}' +
    '.left{left:0;}' +
    '.right{right:0;}' +
    '.top{top:0;}' +
    '.bottom{bottom:0;}' +
    '.hBanner>*{cursor:pointer;float:left;margin:0 5px;}' +
    '.switcher{width:32px;height:24px;background:#333;border-radius:12px;position:relative;}' +
    '.switcher>span{position:absolute;left:6px;top:2px;height:2px;color:#26CA28;font-size:16px;text-transform:Capitalize;}' +
    '.links,.addCode,.moveCode,.delCode,.importCode,.showCode{width:24px;height:24px;}' +
    '.links img,.addCode img,.moveCode img{background-color:white;}' +
    '.links>*,.addCode>*,.moveCode>*{display:none;}' +
    '.links>*:nth-child(1),.addCode>*:nth-child(1),.moveCode>*:nth-child(1){display:inline;}' +
    '.showTable{background-color:white;position:fixed;top:40px;height:400px;overflow:auto;left:10px;}');
    $('<div class="hBanner right top"></div>').dblclick(function () {
      if ($(this).is('.left.top') || $(this).is('.right.bottom')) {
        $(this).toggleClass('left').toggleClass('right');
      } else if ($(this).is('.right.top') || $(this).is('.left.bottom')) {
        $(this).toggleClass('top').toggleClass('bottom');
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
        _html += '<span onclick="window.open(\'' + linkLib[i].url + '\'+this.title)"title="' + getCode() + '"><img src="' + linkLib[i].img + '" width=24></img></a></span>';
      }
      return _html;
    }).appendTo('.hBanner');
    $('<div class="addCode"title="添加到数据库"></div>').html('<img src="' + imgLib.add + '"></img>').appendTo('.hBanner');
    $('<div class="moveCode"title="数据库中移动"></div>').html('<img src="' + imgLib.move + '"></img>').appendTo('.hBanner');
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
    $('<div class="hasCodeImg"></div>').appendTo('.hBanner');
    $('<div class="hasCodeText"></div>').appendTo('.hBanner');
    for (var i = 0; i < markLib.length; i++) {
      $('<img src="' + markLib[i].img + '"title="' + markLib[i].name + '"></img>').val(i).click(function () {
        addValue($(this).val());
      }).appendTo('.addCode');
      $('<img src="' + markLib[i].img + '"title="' + markLib[i].name + '"></img>').val(i).click(function () {
        moveValue($(this).val());
      }).appendTo('.moveCode');
    }
    $('.links,.addCode,.moveCode').on({
      mouseover: function () {
        $(this).children(':gt(0)').show();
      },
      mouseout: function () {
        $(this).children(':gt(0)').hide();
      }
    })
  }
  function markAdded() {
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    $(seleLib[location.host].img).removeAttr('onerror').attr({
      realSrc: function () {
        return $(this).attr('src');
      },
      src: function () {
        var output = '(图)：';
        var keyword;
        var keyword2;
        var _src = $(this).attr('src');
        for (var i in lib) {
          keyword = new RegExp(i, 'gi');
          keyword2 = new RegExp(i.replace('-', ''), 'gi');
          if (keyword.test(_src) || keyword2.test(_src)) {
            output += '<a href="' + linkLib.jav.url + i + '"target="_blank">' + i + '</a> ';
            _src = markLib[lib[i].mark].img;
          }
        }
        $('.hasCodeImg').html(output);
        return _src;
      }
    });
    $(seleLib[location.host].text).html(function () {
      var output = '(文)：';
      var keyword;
      var keyword2;
      var _html = $(this).text();
      for (var i in lib) {
        keyword = new RegExp(i, 'gi');
        keyword2 = new RegExp(i.replace('-', ''), 'gi');
        if (keyword.test(_html) || keyword2.test(_html)) {
          output += '<a href="' + linkLib.jav.url + i + '"target="_blank">' + i + '</a> ';
          _html = _html.replace(keyword, '<span style="background-color:' + markLib[lib[i].mark].color + ';">' + i + '</span>').replace(keyword2, '<span style="background-color:' + markLib[lib[i].mark].color + ';">' + i + '</span>');
        }
      }
      $('.hasCodeText').html(output);
      return _html;
    });
  }
  function undoMarkAdded() {
    var lib = GM_getValue('lib', null);
    if (!lib) return;
    $(seleLib[location.host].img).attr({
      src: function () {
        return $(this).attr('realSrc');
      }
    }).removeAttr('realSrc');
  }
  function addValue(mark, code) { //可选参数code
    var lib = GM_getValue('lib', null) || new Object();
    var code = code || getCode();
    if (!code) return;
    var name = getName();
    lib[code] = {
      mark: mark,
      name: name //选填
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
  function moveValue(mark, code) { //可选参数code
    var code = code || getCode();
    delValue(code);
    addValue(mark, code);
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
      lib[code] = {
        mark: mark
      };
    }
    GM_setValue('lib', lib);
  }
  function showValue() {
    var lib = GM_getValue('lib', null) || new Object();
    var _html = '<table class="tablesorter"><thead><tr><th>数字</th><th>标记</th><th>代码</th><th>标题</th></tr></thead><tbody>';
    for (var i in lib) {
      _html += '<tr><td>' + lib[i].mark + '</td><td><img src="' + markLib[lib[i].mark].img + '"></img>' + markLib[lib[i].mark].name + '</td><td><a href="' + linkLib.jav.url + i + '"target="_blank">' + i + '</a></td><td>' + (lib[i].name || '') + '</td></tr>';
    }
    _html += '</tbody></table>';
    $('<div class="showTable"></div>').html(_html).appendTo('body');
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
      case 'www.caribbeancom.com':
        return url.replace(/.*moviepages\/(.*)\/index.html/, 'Carib-$1');
        break;
      case 'www.heyzo.com':
        return url.replace(/.*moviepages\/(.*)\/index.html/, 'Heyzo-$1');
        break;
      default:
        return '';
        break;
    }
  }
  function getName() {
    switch (location.host) {
      case 'www.dmm.co.jp':
        return $('#title').text();
        break;
      case 'www.javlibrary.com':
        return $('.post-title').text().replace(/.*? /, '');
        break;
      default:
        return '';
        break;
    }
  }
}) (jQuery);
