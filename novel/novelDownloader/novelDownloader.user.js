// ==UserScript==
// @name        novelDownloader
// @name:zh-CN  【小说】下载脚本
// @description novelDownloaderHelper，press key "shift+d" to show up.
// @description:zh-CN 按“Shift+D”来显示面板，现支持自定义规则
// @version     1.42.3
// @author      Dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @require     https://cdn.bootcss.com/jszip/3.0.0/jszip.min.js
// @require     https://greasyfork.org/scripts/21541/code/chs2cht.js?version=137286
// @require     https://greasyfork.org/scripts/32483-base64/code/base64.js?version=213081
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @run-at      document-end
//              文学
// @include     http://gj.zdic.net/archive.php?aid=*
// @include     http://www.99lib.net/book/*.htm
// @include     http*://www.kanunu8.com/book*
// @include     http://www.my285.com/*/*
// @include     http*://wx.ty2016.net/*/*
// @include     http*://www.ty2016.net/*/*
// @include     http://scp-wiki-cn.wikidot.com/*
// @include     http://www.scp-wiki.net/*
//              正版
// @include     http*://book.qidian.com/info/*
// @include     http*://read.qidian.com/chapter/*
// @include     http*://vipreader.qidian.com/chapter/*
// @include     http*://www.hongxiu.com/book/*
// @include     http*://www.hongxiu.com/chapter/*
// @include     http*://www.readnovel.com/book/*
// @include     http*://www.readnovel.com/chapter/*
// @include     http*://www.xs8.cn/book/*
// @include     http*://www.xs8.cn/chapter/*
// @include     http://chuangshi.qq.com/bk/*/*-*.html
// @include     http://yunqi.qq.com/bk/*/*-*.html
// @include     http://dushu.qq.com/intro.html*
// @include     http://book.tianya.cn/html2/dir.aspx?bookid=*
// @include     http://book.tianya.cn/chapter-*
// @include     http*://www.hbooker.com/book/*
// @include     http*://www.hbooker.com/chapter-list/*/book_detail
// @include     http*://www.hbooker.com/chapter/book_chapter_detail*
// @include     http://www.3gsc.com.cn/bookreader/*
// @include     http://www.3gsc.com.cn/bookcon/*
// @include     http://book.zongheng.com/showchapter/*
// @include     http://book.zongheng.com/chapter/*
// @include     http://huayu.baidu.com/showchapter/*
// @include     http://huayu.baidu.com/chapter/*
// @include     http://www.17k.com/list/*
// @include     http://www.17k.com/chapter/*
// @include     http://www.8kana.com/book/*
// @include     http://www.8kana.com/read/*
// @include     http://www.heiyan.com/book/*
// @include     http://b.faloo.com/f/*
// @include     http://b.faloo.com/p/*
// @include     http://www.jjwxc.net/onebook.php*
// @include     http://www.xxsy.net/books/*
// @include     http://www.xxsy.net/chapter/*
// @include     http://book.zhulang.com/*/*
// @include     http://book.hjsm.tom.com/*/c*.html
// @include     http*://www.kanshu.com/files/article/html/*
// @include     http://vip.book.sina.com.cn/weibobook/book/*
// @include     http://vip.book.sina.com.cn/book/play/*-*.html
// @include     http://www.lcread.com/bookpage/*
// @include     http://www.motie.com/book/*
// @include     http://www.shuhai.com/read/*
// @include     http://www.xiang5.com/booklist/*
// @include     http://www.xiang5.com/content/*
// @include     http://read.fmx.cn/files/article/html/*
// @include     http://novel.feiku.com/*/*
// @include     http*://www.kujiang.com/book/*
// @include     http://www.tadu.com/book/*
// @include     http*://yuedu.163.com/newBookReader.do*
// @include     http*://yuedu.163.com/source/*
// @include     http*://yuedu.163.com/book_reader/*
// @include     http*://guofeng.yuedu.163.com/newBookReader.do*
// @include     http*://guofeng.yuedu.163.com/source/*
// @include     http*://guofeng.yuedu.163.com/book_reader/*
// @include     http*://caiwei.yuedu.163.com/newBookReader.do*
// @include     http*://caiwei.yuedu.163.com/source/*
// @include     http*://caiwei.yuedu.163.com/book_reader/*
// @include     http*://ebook.longmabook.com/showbook*
// @include     http*://ebook.longmabook.com/showpaperword*
// @include     http://www.yueloo.com/read/*
// @include     http://www.ycsd.cn/html/*
// @include     http://book.xxs8.com/*/*
// @include     http://www.longruo.com/chapterlist/*
// @include     http://www.longruo.com/catalog/*_*.html
// @include     http://www.cjzww.com/book/*
// @include     http://www.cjzww.com/chapter/*.html
// @include     http://www.hxtk.com/books/getBookAllChapters.action*
// @include     http://www.hxtk.com/books/readBook.action*
// @include     http*://www.hongshu.com/bookreader/*
// @include     http*://www.hongshu.com/content/*
// @include     http://www.qwsy.com/mulu/*
// @include     http://www.qwsy.com/read.aspx*
// @include     http://www.rongshuxia.com/book/volume/*
// @include     http://www.rongshuxia.com/chapter/*
// @include     http://vip.shulink.com/files/article/html/*
// @include     http://www.4yt.net/directory/*
// @include     http://www.4yt.net/read/free/*
// @include     http://www.soudu.net/html/*
// @include     http://www.fbook.net/book/*
// @include     http://book.tiexue.net/Book*/*
// @include     http://www.wjsw.com/html/*
// @include     http://www.yokong.com/book/*.html
// @include     http://www.chuangbie.com/book/catalog*
// @include     http://www.chuangbie.com/book/read*
// @include     http://www.msxf.net/book/*.html
// @include     http://mm.msxf.net/book/*.html
// @include     http*://www.popo.tw/books/*/articles*
// @include     http://www.anyew.cn/chapters/*
// @include     http://www.anyew.cn/book/*.html
//              轻小说
// @include     http://www.wenku8.com/novel/*
// @include     http*://book.sfacg.com/Novel/*
// @include     http://xs.dmzj.com/*.shtml
// @include     http://www.yidm.com/article/info/*.html
// @include     http://www.yidm.com/article/html/*.html
// @include     http://book.suixw.com/modules/article/reader.php*
// @include     http*://www.iqing.in/book/*
// @include     http*://www.iqing.in/read/*
//              盗贴
// @include     http://www.chuanyue8.net/files/article/html/*
// @include     http://www.22ff.com/xs/*
// @include     http://www.xntk.net/html/*
// @include     http://www.xntk.net/book_j.php*
// @include     http://www.kong.so/*/*
// @include     http://www.hunhun520.com/book/*
// @include     http://www.blwen.com/*.html
// @include     http://www.mpzw.com/html/*
// @include     http://www.00xs.cc/xiaoshuo/*/*/
// @include     http://www.kenshu.cc/xiaoshuo/*
// @include     http://www.pbtxt.com/*/*
// @include     http://www.8shuw.net/book/*
// @include     http*://www.hjwzw.com/Book/Chapter/*
// @include     http*://www.hjwzw.com/Book/Read/*
// @include     http://www.5858xs.com/*.html
// @include     http://www.teteam.com/xiaoshuo*.shtml
// @include     http://www.teteam.com/modules/article/reader.php*
// @include     http://www.23txt.com/files/article/html/*
// @include     http://www.59zww.com/files/article/xiaoshuo/*
// @include     http://www.bookba.net/mulu-*-list.html
// @include     http://www.bookba.net/read-*-chapter-*.html
// @include     http://www.wenxuemm.com/book/*
// @include     http://www.630book.cc/shu/*
// @include     http://www.zhuaji.org/read/*
// @include     http://www.shunong.com/*/*
// @include     http://www.hkxs99.net/*/*
// @include     http://www.doulaidu.com/xs/*
// @include     http://www.shuotxts.net/*.html
// @include     http://www.fkzww.com/Html/Book/*
// @include     http://www.bookgew.com/Html/Book/*
// @include     http://www.shumil.com/*/*
// @include     http://www.520xs.la/*/*
// @include     http://www.2kxs.com/xiaoshuo/*
// @include     http://www.mianhuatang.la/*/*
// @include     http://www.baoliny.com/*.html
// @include     http://www.dajiadu.net/files/article/html/*/*
// @include     http://www.paoshuba.cc/Partlist/*
// @include     http://www.qmshu.com/html/*
// @include     http://www.xfqxsw.com/book/*
// @include     http://www.zwda.com/*/*
// @include     http*://www.sto.cc/*-*/
// @include     http://www.musemailsvr.com/*.shtml
// @include     http://www.50zw.co/book_*/*
// @include     http://www.piaotian.com/html/*
// @include     http://www.23xs.org/shu/*
//              18X
// @include     http://www.lewenxs.net/read/*.html
// @include     http://www.wodexiaoshuo.cc/*/*
// @include     http://www.shubao26.com/book/*.html
// @include     http://www.shubao26.com/read/*.html
// @include     http://www.lawen520.com/txtbook/*.html
// @include     http://www.lawen520.com/quanwen/*.html
// @include     http://bbs.6park.com/bbs4/messages/*.html
// @include     http://bbs.6park.com/bbs4/gmessages/*.html
// @include     http://web.6park.com/classbk/md*.shtml
// @include     http://web.6park.com/classbk/messages/*.html
// @include     http://www.neixiong888.com/xiaoshuo/*
// @include     http*://www.xncwxw.com/files/article/html/*.html
// @include     http://www.50655.net/*/*
// @include     http://www.bmshu.com/book*
// @include     http://www.beijingaishu.net/files/article/html/*
// @include     http://www.dz8.la/book/*
// @include     http://www.dz8.la/views/*
// @include     http://www.kewaishu.info/yuedu/*
// @include     http://www.lmzww.net/jlgcyy/*
// @include     http://www.zxxs259.com/read/*
// @include     http://www.zixuanxs.com/*
// @include     http://www.ncwx.hk/wx/*
// @include     http://x520xs.com/*/*
// @include     http://www.7zxs.com/ik258/*
// @include     http://www.ik777.net/ik258/*
// @include     http://www.jipinzw.com/*/*
// @include     http://www.qindouxs.org/files/article/html/*.html
// @include     http://www.5qudu.com/files/article/html/*
// @include     http://www.8xxsw.com/xiaoshuo.asp?id=*
// @include     http://www.8xxsw.com/page.asp?id=*
// @include     http://www.6mxs.com/novel.asp?id=*
// @include     http://www.6mxs.com/pages.asp?id=*
// @include     http://www.3mxs.com/novel.asp?id=*
// @include     http://www.3mxs.com/pages.asp?id=*
// @include     http://www.bsl8.la/read/*
// @include     http://www.fafaxs.cc/read/*
// @include     http://www.shushuwu.cc/novel/*
// @include     http://www.cuiweijuxin.com/files/article/html/*/*.html
// @include     http://www.shubao4.com/read/*.html
// @include     http://www.cuiweiju88.com/files/article/html/*.html
// @include     http://www.xitxt.net/book/*.html
// @include     http://www.xitxt.net/read/*.html
// @include     http://www.shenshuw.com/s*/*
// @include     http://www.baqishuku9.com/book/*.html
// @include     http://www.baqishuku9.com/book_read/*.html
// @include     http://www.heihei66.com/*/*
// @include     http://www.quanshuwu.com/book/*.aspx
// @include     http://www.quanshuwu.com/article/*.aspx
// @include     http://www.dzxs.cc/read/*.html
// @include     http://www.mlxiaoshuo.com/book/*.html
// @include     http://www.mlxiaoshuo.com/chapter/*.html
// @include     http://www.haianxian.net/book/*/*
// @include     http://www.xiaoqiangxs.com/*
// @include     http://18av.mm-cg.com/novel*
// @include     http://18av.mm-cg.com/serch*
// ==/UserScript==

var debug = {
  response: false,
  data: false,
  replace: false
};
var indexRule = {};
var chapterRule = {};
var reRule = {};
var showUI = function() {
  if ($('.ndMain').length === 0) {
    init();
    $('.ndMain').toggle();
  } else {
    $('.ndMain').toggle();
    $('#ndToggle').text(function() {
      return '.ndPre,.ndPreVip{display:' + $('.ndMain').css('display') + ';}';
    });
  }
};
GM_registerMenuCommand('Download Novel', function() {
  showUI();
}, 'N');
$(window).on('keydown', function(e) {
  if (e.shiftKey && e.keyCode === 68) { //Shift+D
    showUI();
  }
});
GM_registerMenuCommand('Show Storage', function() {
  console.log($(window).data());
}, 'S');

function init() {
  (function() {
    //////////////////////////////////////////////////文学
    addIRule('gj.zdic.net', '汉典古籍', '#shuye>h1', '.mls>li>a');
    addCRule('gj.zdic.net', '#snr1>h1', '#snr2', 1);
    addIRule('www.99lib.net', '九九藏书网', '#book_info>h2', '#dir>dd>a');
    chapterRule['www.99lib.net'] = {
      'Deal': function(num, url) {
        var check = function(i) {
          if (i.contentWindow.content.showNext() !== false) {
            setTimeout(function() {
              check(i);
            }, 200);
          } else {
            var name = $('h2', i.contentWindow.document).text();
            var content = [];
            var temp;
            $('#content>div:visible', i.contentWindow.document).each(function() {
              temp = $(this.outerHTML);
              temp.find('acronym,bdo,big,cite,code,dfn,kbd,q,s,samp,strike,tt,u,var').remove();
              content.push(temp.text());
            });
            thisDownloaded(num, name, content.join('\r\n'));
            $(i).remove();
          }
        };
        $('<iframe class="ndFinder" name="' + num + '" src="' + url + '"></iframe>').on({
          load: function() {
            check(this);
          }
        }).appendTo('.ndFinderArea');
      }
    };
    addIRule('www.kanunu8.com', '努努书坊', 'h1>strong>font', 'body>div:nth-child(1)>table:nth-child(10)>tbody>tr:nth-child(4)>td>table:nth-child(2)>tbody>tr>td>a');
    addCRule('www.kanunu8.com', 'strong>font', 'p', 1);
    addIRule('www.my285.com', ' 梦远书城', 'td[bgcolor="#FFC751"]', 'td>a:not(:has(span)):visible');
    addCRule('www.my285.com', 'td[height="30"]', 'td:has(br)', 1);
    addIRule('wx.ty2016.net', '天涯书库', 'h1', '.book>dl>dd>a');
    addCRule('wx.ty2016.net', 'font', 'p', 1);
    addIRule('www.ty2016.net', '天涯书库', 'h1', '.book>dl>dd>a');
    addCRule('www.ty2016.net', 'h1', 'p[align="center"]+p', 1);
    addIRule('scp-wiki-cn.wikidot.com', 'SCP基金会', '#page-title', '.wiki-content-table td>a,#page-content td>a');
    addCRule('scp-wiki-cn.wikidot.com', '#page-title', '#page-content');
    addIRule('www.scp-wiki.net', 'SCP Foundation', '#page-title', '.wiki-content-table td>a,#page-content td>a');
    addCRule('www.scp-wiki.net', '#page-title', '#page-content');
    //////////////////////////////////////////////////正版
    addIRule('book.qidian.com', '起点中文网', 'h1>em', '.volume>ul>li>a', '.volume>ul>li:has(.iconfont)>a');
    addCRule('book.qidian.com');
    addIRule('read.qidian.com');
    addCRule('read.qidian.com', '.j_chapterName', '.read-content');
    addCRule('vipreader.qidian.com', '.j_chapterName', '.read-content');
    addIRule('www.hongxiu.com', '红袖添香', 'h1>em', '.volume>ul>li>a', '.volume>ul>li:has(.iconfont)>a');
    addCRule('www.hongxiu.com', '.j_chapterName', '.read-content');
    addIRule('www.readnovel.com', '小说阅读网', 'h1>em', '.volume>ul>li>a', '.volume>ul>li:has(.iconfont)>a');
    addCRule('www.readnovel.com', '.j_chapterName', '.read-content');
    addIRule('www.xs8.cn', '言情小说吧', 'h1>em', '.volume>ul>li>a', '.volume>ul>li:has(.iconfont)>a');
    addCRule('www.xs8.cn', '.j_chapterName', '.read-content');
    addIRule('chuangshi.qq.com', '创世中文网', '.title>a>b', 'div.list>ul>li>a', 'div.list:has(span.f900)>ul>li>a');
    chapterRule['chuangshi.qq.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = response.response.replace(/[\r\n]/g, '').replace(/.*<title>(.*)<\/title>.*/, '$1').replace(/.*_(.*)_.*/, '$1');
            var bid = response.response.replace(/[\r\n]/g, '').replace(/.*'bid' : '(\d+)'.*/g, '$1');
            var uuid = response.response.replace(/[\r\n]/g, '').replace(/.*'uuid' : '(\d+)'.*/g, '$1');
            var host = getHostName(url);
            chapterRule['chuangshi.qq.com'].Deal2(host, num, name, bid, uuid);
          }
        });
      },
      'Deal2': function(host, num, name, bid, uuid) {
        var url;
        if (host === 'dushu.qq.com') {
          url = 'http://' + host + '/read/' + bid + '/' + uuid;
        } else {
          url = 'http://' + host + '/index.php/Bookreader/' + bid + '/' + uuid;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
        xhr.responseType = 'json';
        xhr.onload = function() {
          var content = xhr.response.Content;
          if (host === 'chuangshi.qq.com') {
            var base = 30;
            var arrStr = [];
            var arrText = content.split('\\');
            for (var i = 1, len = arrText.length; i < len; i++) {
              arrStr.push(String.fromCharCode(parseInt(arrText[i], base)));
            }
            content = arrStr.join('');
          }
          content = $('.bookreadercontent', content).html().replace('最新章节由云起书院首发，最新最火最快网络小说首发地！（本站提供：传统翻页、瀑布阅读两种模式，可在设置中选择）', '').replace('本作品腾讯文学发表，请登录', '').replace('dushu.qq.com', '').replace('浏览更多精彩作品。腾讯公司版权所有，未经允许不得复制', '');
          thisDownloaded(num, name, content);
        };
        xhr.send('lang=zhs');
      }
    };
    addIRule('yunqi.qq.com', '云起书院', '.title>a>b', 'div.list>ul>li>a', 'div.list:has(span.f900)>ul>li>a');
    chapterRule['yunqi.qq.com'] = {
      'Deal': function(num, url) {
        chapterRule['chuangshi.qq.com'].Deal(num, url);
      }
    };
    addIRule('dushu.qq.com', '腾讯读书(只支持当前目录页)', 'h3>a', '#chapterList>div>ol>li>a', '#chapterList>div>ol>li:not(:has(span.free))>a');
    chapterRule['dushu.qq.com'] = {
      'Deal': function(num, url) {
        chapterRule['chuangshi.qq.com'].Deal(num, url);
      }
    };
    addIRule('book.tianya.cn', '天涯文学(只支持当前目录页)', 'h1>a', 'ul.dit-list>li>a', 'ul.dit-list>li:not(:has(.free))>a');
    chapterRule['book.tianya.cn'] = {
      'Deal': function(num, url) {
        var urlArr = url.split('-');
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://app.3g.tianya.cn/webservice/web/read_chapter.jsp',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'http://app.3g.tianya.cn/webservice/web/proxy.html',
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: 'bookid=' + urlArr[1] + '&chapterid=' + urlArr[2],
          responseType: 'json',
          onload: function(response) {
            var info = response.response;
            var name = info.data.curChapterName;
            var content = info.data.chapterContent.replace(/<br>/g, '\r\n');
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('www.hbooker.com', '欢乐书客', '.book-title>h3', '.book-chapter-list>.clearfix>li>a', '.book-chapter-list>.clearfix>li>a:has(.icon-vip)', false, 1);
    chapterRule['www.hbooker.com'] = {
      'Deal': function(num, url) {
        if (!$(window).data('firstRun')) {
          $(window).data('firstRun', true);
          $('head').append('<script type="text/javascript" src="' + location.protocol + 'www.hbooker.com/resources/js/enjs.min.js"></script>');
        }
        var chapterId = url.replace(location.protocol + 'www.hbooker.com/chapter/book_chapter_detail/', '');
        GM_xmlhttpRequest({
          method: 'POST',
          url: location.protocol + 'www.hbooker.com/chapter/ajax_get_session_code',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': location.protocol + 'www.hbooker.com/chapter/book_chapter_detail/' + chapterId,
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: 'chapter_id=' + chapterId,
          responseType: 'json',
          onload: function(response) {
            var json = response.response;
            var accessKey = json.chapter_access_key;
            chapterRule['www.hbooker.com'].Deal2(num, url, accessKey);
          }
        });
      },
      'Deal2': function(num, url, accessKey) {
        var chapterId = url.replace(location.protocol + 'www.hbooker.com/chapter/book_chapter_detail/', '');
        GM_xmlhttpRequest({
          method: 'POST',
          url: location.protocol + 'www.hbooker.com/chapter/get_book_chapter_detail_info',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': location.protocol + 'www.hbooker.com/chapter/book_chapter_detail/' + chapterId,
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: 'chapter_id=' + chapterId + '&chapter_access_key=' + accessKey,
          responseType: 'json',
          onload: function(response) {
            var json = response.response;
            /*以下代码来自https://www.hbooker.com/resources/js/myEncrytExtend-min.js*/
            var s = {
              content: json.chapter_content,
              keys: json.encryt_keys,
              accessKey: accessKey
            };
            var n = s.content;
            var r = s.keys;
            var t = s.keys.length;
            var q = s.accessKey;
            var o = q.split('');
            var m = o.length;
            var k = [];
            k.push(r[(o[m - 1].charCodeAt(0)) % t]);
            k.push(r[(o[0].charCodeAt(0)) % t]);
            for (i = 0; i < k.length; i++) {
              n = base64.decode(n);
              var p = k[i];
              var j = base64.encode(n.substr(0, 16));
              var f = base64.encode(n.substr(16));
              var h = CryptoJS.format.OpenSSL.parse(f);
              n = CryptoJS.AES.decrypt(h, CryptoJS.enc.Base64.parse(p), {
                iv: CryptoJS.enc.Base64.parse(j),
                format: CryptoJS.format.OpenSSL
              });
              if (i < k.length - 1) {
                n = n.toString(CryptoJS.enc.Base64);
                n = base64.decode(n);
              }
            }
            var content = n.toString(CryptoJS.enc.Utf8);
            thisDownloaded(num, '', content);
          }
        });
      }
    };
    addIRule('www.3gsc.com.cn', '3G书城', 'h1>a', '.menu-area>p>a', '.menu-area>p>a:has(span.vip)');
    addCRule('www.3gsc.com.cn', 'h1', '.menu-area');
    addIRule('book.zongheng.com', '纵横', '.txt>h1', '.chapterBean>a', '.chapterBean>em+a');
    addCRule('book.zongheng.com', 'h1>em', '#readerFs');
    addIRule('huayu.baidu.com', '花语女生网', '.book_title>h1', '.chapname>a', '.chapname>a.normal,.chapname:has(em.vip)>a');
    addCRule('huayu.baidu.com', '.tc>h2', '.book_con');
    addRRule('huayu.baidu.com', '<span class="watermark">.*?</span>', '<span class="unfold".*', '本书花语女生网首发，欢迎读者登录huayu.baidu.com查看更多优秀作品。');
    addIRule('www.17k.com', '17K', 'h1.Title', 'dl.Volume>dd>a', 'dl.Volume>dd>a:has(img)');
    addCRule('www.17k.com', 'h1', '.p');
    addRRule('www.17k.com', '\\s+||| ', '本书首发来自17K小说网，第一时间看正版内容！.*');
    addIRule('www.8kana.com', '不可能的世界', 'h2.left', 'li.nolooking>a', 'li.nolooking>a:has(.chapter_con_VIP)');
    addCRule('www.8kana.com', 'h2', '.myContent');
    addRRule('www.8kana.com', '本书连载自免费原创小说网站.*');
    addIRule('www.heiyan.com', '黑岩', 'h1.page-title', 'div.bd>ul>li>a', 'div.bd>ul>li>a.isvip');
    chapterRule['www.heiyan.com'] = {
      'Deal': function(num, url) {
        var urlTrue = 'http://a.heiyan.com/ajax/chapter/content/' + url.replace(/.*\//, '');
        GM_xmlhttpRequest({
          method: 'GET',
          url: urlTrue,
          responseType: 'json',
          onload: function(response) {
            var info = response.response;
            var name = info.chapter.title;
            var content = info.chapter.htmlContent;
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('b.faloo.com', '飞卢', 'h1.a_24b', '.td_0>a', '.td_0>a[href^="http://b.faloo.com/vip/"]');
    addCRule('b.faloo.com', '#title>h1', '#content');
    addRRule('b.faloo.com', '\\s+||| ', '飞卢小说网.*');
    addIRule('www.jjwxc.net', '晋江文学城', 'h1>span', '#oneboolt>tbody>tr>td>span>div>a', '#oneboolt>tbody>tr>td>span>div>a[id^="vip_"]');
    addCRule('www.jjwxc.net', 'h2', '.noveltext', 1);
    addRRule('www.jjwxc.net', '<font.*?>.*?font>', '\\s+||| ', '<div.*<div style="clear:both;"></div>', '<span.*class="favorite_novel">插入书签</span>');
    addIRule('www.xxsy.net', '潇湘书院', '#ct_title>h1', '#catalog_list>ul>li>a', '#catalog_list>ul>li:has(input)>a');
    addCRule('www.xxsy.net', 'h1>a', '#zjcontentdiv');
    addRRule('www.xxsy.net', '本书由潇湘书院首发，请勿转载！');
    addIRule('book.zhulang.com', '逐浪', '.crumbs>strong>a', '.chapter-list>ul>li>a', '.chapter-list>ul>li>a:has(span)');
    addCRule('book.zhulang.com', 'h2>span', '#read-content');
    addRRule('book.zhulang.com', '\\s+||| ', '<div class="textinfo">.*</div>', '<p> <cite>.*</p>');
    addIRule('book.hjsm.tom.com', '幻剑书盟', '.title>h2', '.ocon>ul>li>a', '.ocon>ul>li:has(img)>a');
    chapterRule['book.hjsm.tom.com'] = {
      'Deal': function(num, url) {
        var urlArr = url.split(/\/|\./);
        urlTrue = 'http://book.hjsm.tom.com/' + urlArr[6].substring(0, 2) + '/' + urlArr[6] + '/' + urlArr[7] + '.js';
        GM_xmlhttpRequest({
          method: 'GET',
          url: urlTrue,
          onload: function(response) {
            var content = response.response.replace('document.write("<p>', '').replace('");', '');
            content = eval('\'' + content + '\'');
            thisDownloaded(num, '', content);
          }
        });
      }
    };
    addIRule('www.kanshu.com', '看书网', '.mu_h1>h1', '.mulu_list>li>a', '.mulu_list>li:has(span)>a');
    addCRule('www.kanshu.com', 'h1', '.yd_text2', 1);
    addRRule('www.kanshu.com', '\\s+||| ', '<span id="avg_link">.*');
    addIRule('vip.book.sina.com.cn', '微博读书-书城', 'h1.book_name', '.chapter>span>a', '.chapter>span:has(i)>a');
    chapterRule['vip.book.sina.com.cn'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = $('.sr-play-box-scroll-t-path>span', response.response).text();
            var content = response.response.replace(/\s+/g, ' ').replace(/.*chapterContent ="(.*?)";.*/, '$1');
            content = eval('\'' + content + '\'');
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('www.lcread.com', '连城读书', '.bri>table>tbody>tr>td>h1', '#abl4>table>tbody>tr>td>a', '#abl4>table>tbody>tr>td>a[href^="http://vipbook.lc1234.com/"]');
    addCRule('www.lcread.com', 'h2', '#ccon', 1);
    addIRule('www.motie.com', '磨铁中文网', '.title>.name', '.catebg a', '.catebg a:has([alt="vip"])');
    chapterRule['www.motie.com'] = {
      'Deal': function(num, url) {
        var info = url.match(/\d+/g);
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://www.motie.com/ajax/chapter/' + info[0] + '/' + info[1],
          onload: function(response) {
            var name = $('.chaptername', response.response).text();
            var show = $('style', response.response).text().trim().replace(/{\s+/g, '{').replace(/\s+}/g, '}').replace(/ {/g, '{').split(' ');
            for (var i = 0; i < show.length; i++) {
              if (show[i].match(/none/gi)) {
                show.splice(i, 1);
                i--;
              } else {
                show[i] = show[i].replace(/{.*?}/, '');
              }
            }
            show = '.note' + show.join(',.note');
            var content = $(show, response.response).text();
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('www.shuhai.com', '书海小说网', 'h3', '.box_chap>ul>li>a', '.box_chap>ul>li:has(em)>a');
    addCRule('www.shuhai.com', 'h1', '#readcon');
    addIRule('www.xiang5.com', '香网', '.lb>h2', '.lb>table>tbody>tr>td>a');
    chapterRule['www.xiang5.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            if ($('.vipdy', response.response).length > 0) {
              $(window).data('downloadList', []);
              for (var i = num; i < $(window).data('dataDownload').length; i++) {
                $(window).data('dataDownload')[i].content = '来源地址：' + $(window).data('dataDownload')[num].url + '\r\n此章节为Vip章节';
                $(window).data('dataDownload')[i].ok = true;
              }
              return;
            }
            var name = $('h1', response.response).text();
            var content = $('.xsDetail', response.response).html().replace(/\s+/g, ' ');
            content = content.replace(/<font>.*?<\/font>/g, '').replace(/<i>.*?<\/i>/g, '').replace(/<abbr>.*?<\/abbr>/g, '').replace(/<dfn>.*?<\/dfn>/g, '').replace(/<u>.*?<\/u>/g, '').replace(/<ins>.*?<\/ins>/g, '').replace(/<kbd>.*?<\/kbd>/g, '').replace(/<tt>.*?<\/tt>/g, '').replace(/微信搜“香网小说”.*/, '');
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('read.fmx.cn', '凤鸣轩小说网', '.art_listmain_top>h1', '.art_fnlistbox>span>a,.art_fnlistbox_vip>ul>li>span>a', '.art_fnlistbox_vip>ul>li>span>a');
    addCRule('read.fmx.cn', 'h1', '#content', 1);
    addRRule('read.fmx.cn', '\\s+||| ', '<p><a.*');
    addIRule('novel.feiku.com', '飞库网', '.book_dirtit', '.book_dirbox>.clearfix>li>a', '.book_dirbox>.clearfix>li>a[href*="/vip/"]');
    addCRule('novel.feiku.com', '.art_tit', '#artWrap');
    addIRule('www.kujiang.com', '酷匠网', '.kjtitle', '.third>a', '.third>a.vip');
    addCRule('www.kujiang.com', 'h1', '.content');
    addRRule('www.kujiang.com', '.*酷.*匠.*网.*', '微信搜.*');
    addIRule('www.tadu.com', '塔读文学', '.book-detail.catalog-tip>h3', '.detail-chapters>ul>li>h5>a', '.detail-chapters>ul>li>h5>a:has(span)');
    addCRule('www.tadu.com', 'h2', '#partContent');
    addIRule('yuedu.163.com', '网易云阅读', 'h2.title,h3', '.item>a', '.vip>a');
    chapterRule['yuedu.163.com'] = {
      'Deal': function(num, url) {
        var urlArr = url.split('/');
        GM_xmlhttpRequest({
          method: 'GET',
          url: location.protocol + 'yuedu.163.com/getArticleContent.do?sourceUuid=' + urlArr[4] + '&articleUuid=' + urlArr[5],
          responseType: 'json',
          onload: function(response) {
            var content = response.response.content;
            content = base64.decode(content);
            content = base64.utf8to16(content);
            var name = $('h1', content).text();
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('guofeng.yuedu.163.com', '国风中文网', 'h2.title,h3', '.item>a', '.vip>a');
    chapterRule['guofeng.yuedu.163.com'] = {
      'Deal': function(num, url) {
        chapterRule['yuedu.163.com'].Deal(num, url);
      }
    };
    addIRule('caiwei.yuedu.163.com', '采薇书院', 'h2.title,h3', '.item>a', '.vip>a');
    chapterRule['caiwei.yuedu.163.com'] = {
      'Deal': function(num, url) {
        chapterRule['yuedu.163.com'].Deal(num, url);
      }
    };
    addIRule('ebook.longmabook.com', '龍馬文化線上文學城', '.css_td>b>a', '.uk-table>tbody>tr>td>a:nth-child(2)');
    chapterRule['ebook.longmabook.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var urlNext = response.response.replace(/\s+/g, ' ').replace(/.*iframe\.src="(.*?)";.*/, '$1');
            var name = $('.uk-alert>b:nth-child(3)>font', response.response).text();
            chapterRule['ebook.longmabook.com'].Deal2(num, urlNext, url, name);
          }
        });
      },
      'Deal2': function(num, url, urlReferer, nameRaw) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: location.protocol + 'ebook.longmabook.com' + url,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Referer': urlReferer,
            'X-Requested-With': 'XMLHttpRequest'
          },
          onload: function(response) {
            var name = nameRaw;
            var content = $('#ebookcontent', response.response).html();
            content = content.replace(/<font class="OutStrRnds">.*?<\/font>/g, '');
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('www.yueloo.com', '阅路小说网', 'h3', '#container1>table>tbody>tr>td>a', '#container1>table>tbody>tr>td:has(span)>a');
    addCRule('www.yueloo.com', 'h2', '.reed', 1);
    addRRule('www.yueloo.com', '\\s+||| ', '<div class="read_dwn">.*');
    addIRule('www.ycsd.cn', '原创书殿', 'h2', '.list-directory a', '.list-directory li:has(i.ico-vip)>a');
    addCRule('www.ycsd.cn', 'h2', '.content');
    addIRule('book.xxs8.com', '新小说吧', 'strong>a', '.chapter-list>ul>li>a', '.chapter-list>ul>li>a:has(span)');
    addCRule('book.xxs8.com', '#read-content>h2', '.textinfo+p');
    addIRule('www.longruo.com', '龙若中文网', '.fs22', '.catalog>li>a', '.catalog>li>a:has(span.mark)');
    addCRule('www.longruo.com', 'h1', '.article');
    addIRule('www.cjzww.com', '长江中文网', 'h3>a', '.mb_content>li>a', '.mb_content>li:has(b.red1)>a');
    addCRule('www.cjzww.com', '.read_content>h3', '#zoom');
    addIRule('www.hxtk.com', '华夏天空', '.book-name>a', '.ml-list1>ul>li>a', '.ml-list1>ul>li>a:has(font)');
    addCRule('www.hxtk.com', 'h2', '#read_txt');
    addIRule('www.hongshu.com', '红薯中文网', 'h1>a', '.columns>li>a', '.columns>li:has(span.vip)>a');
    chapterRule['www.hongshu.com'] = {
      'Deal': function(num, url) {
        var urlArr = url.split(/\/|-|\./);
        GM_xmlhttpRequest({
          method: 'POST',
          url: location.protocol + 'www.hongshu.com/bookajax.do',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: 'method=getchptkey&bid=' + urlArr[6] + '&cid=' + urlArr[8],
          responseType: 'json',
          onload: function(response) {
            var key = response.response.key;
            chapterRule['www.hongshu.com'].Deal2(num, url, key);
          }
        });
      },
      'Deal2': function(num, url, key) {
        var urlArr = url.split(/\/|-|\./);
        GM_xmlhttpRequest({
          method: 'POST',
          url: location.protocol + 'www.hongshu.com/bookajax.do',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: 'method=getchpcontent&bid=' + urlArr[6] + '&jid=' + urlArr[7] + '&cid=' + urlArr[8],
          responseType: 'json',
          onload: function(response) {
            var json = response.response;
            var name = json.chptitle;
            var content = json.content;
            content = unsafeWindow.utf8to16(unsafeWindow.hs_decrypt(unsafeWindow.base64decode(content), key));
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('www.qwsy.com', '蔷薇书院', 'h1', '.td_con>a', '.td_con:has(span[style="color:#ff0000;"])>a');
    chapterRule['www.qwsy.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://script.qwsy.com/html/js/' + url.replace('http://www.qwsy.com/read.aspx?cid=', '') + '.js',
          onload: function(response) {
            var content = response.response.replace('document.write("<p>', '').replace('");', '').replace(/<font.*?font>/g, '');
            thisDownloaded(num, '', content);
          }
        });
      }
    };
    addIRule('www.rongshuxia.com', '榕树下', 'strong>a', '.lists>ul>li>a');
    chapterRule['www.rongshuxia.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = $('strong', response.response).text();
            var content = $('#new_cpt_content', response.response).html();
            if (content.length === 9) {
              for (var i = num; i < $(window).data('dataDownload').length; i++) {
                $(window).data('dataDownload')[i].content = '来源地址：' + $(window).data('dataDownload')[num].url + '\r\n此章节为Vip章节';
                $(window).data('dataDownload')[i].ok = true;
              }
              $(window).data('downloadList', []);
              return;
            }
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('vip.shulink.com', '书连', '.atitle', '.index>dd>a', '.index>dd:has(em)>a');
    addCRule('vip.shulink.com', '.atitle', '#acontent', 1);
    addRRule('vip.shulink.com', '\\s+||| ', '\\(欢迎专注书连微信.*');
    addIRule('www.4yt.net', '四月天', 'h1.tc', '.all-catalog a', '.all-catalog a:has(i)');
    addCRule('www.4yt.net', 'h1.tc', '.chpater-content');
    addIRule('www.soudu.net', '搜读网', 'h1', '.list>li>a', '.list>li:has(span.r_red)>a');
    addCRule('www.soudu.net', 'h1', '#content');
    addRRule('www.soudu.net', '手机用户请访问.*');
    addIRule('www.fbook.net', '天下书盟', 'h1', '.chapterTable>ul>li>a', 'span.nodeVIP+a');
    addCRule('www.fbook.net', '.lines', '#bookbody', 1);
    addRRule('www.fbook.net', '\\s+||| ', '<input type="button".*');
    addIRule('book.tiexue.net', '铁血读书', 'h1>a', '.list01>li>p a', '.list01>li>p>span>a');
    addCRule('book.tiexue.net', '#contents>h1', '#mouseRight', 1);
    addIRule('www.wjsw.com', '万卷书屋', 'h1', '.list>li>a', '.list>li:has(span.r_red)>a');
    addCRule('www.wjsw.com', 'h1', '#content');
    addRRule('www.wjsw.com', '阅读更方便.*');
    addIRule('www.yokong.com', '悠空网', '', '.chapter-list>li>span>a', '.chapter-list>li>span:has(.vip-icon)>a');
    addCRule('www.yokong.com', 'h1', '.article-con');
    addRRule('www.yokong.com', '\\s+||| ', '请记住本站：悠空网.*');
    addIRule('www.chuangbie.com', '创别书城', '.con_02', '.con_05 a', '.con_05 li:has(img)>a');
    chapterRule['www.chuangbie.com'] = {
      'Deal': function(num, url) {
        var info = url.match(/\d+/g);
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://www.chuangbie.com/book/load_chapter_content?book_id=' + info[0] + '&chapter_id=' + info[1],
          responseType: 'json',
          onload: function(response) {
            var data = response.response;
            thisDownloaded(num, data.content.chapter_name, data.content.chapter_content);
          }
        });
      }
    };
    addIRule('mm.msxf.net', '陌上香坊', 'h1>a', '.chaptertable>tbody>tr>td>a', '.chaptertable>tbody>tr>td:has(font.ico_vip)>a');
    addCRule('mm.msxf.net');
    addCRule('www.msxf.net', 'h3', '#article-content');
    addRRule('www.msxf.net', '\\s+||| ', '<p .*?class=.*?</p>', '<p> 看正版言情小说，来陌上香坊小说网.*?</p>');
    addIRule('www.popo.tw', 'POPO原創市集', '.BookName', '.aarti>a');
    addCRule('www.popo.tw', '.read-content>h1', '.read-content>dl');
    addIRule('www.anyew.cn', '暗夜文学', '.book_name>h4', '.chapters_list>li>a', '.chapters_list>li>a:has(.vip)');
    chapterRule['www.anyew.cn'] = {
      'Deal': function(num, url) {
        if (!$(window).data('firstRun')) {
          $(window).data('firstRun', true);
          $('head').append('<script type="text/javascript" src="http://wwwcdn.anyew.com/js/lib/trd.js?v=20170622192855"></script>');
          objectUnpack = function(a) {
            var c, b = {};
            c = ('?' === a[0] ? a.substr(1) : a).split('&');
            eval('var d, e, f;for (d = 0; d < c.length; d++) e = c[d].split("="), f = decodeURIComponent(e[0]), "" != f && (b[f] = decodeURIComponent(e[1] || ""));');
            return b;
          };
        }
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = $('.ML_bookname>h1', response.response).html().replace(/\s+/g, ' ').replace(/<br>.*/, '').trim();
            var content;
            h = $('.data-trda', response.response).val();
            b = $('.data-trdk', response.response).val();
            k = objectUnpack(b).s.split('.', 2);
            l = trd.lib.CipherParams.create({
              ciphertext: trd.enc.Base64.parse(h)
            });
            m = trd.ALGON.decrypt(l, trd.enc.Hex.parse(k[0] || ''), {
              iv: trd.enc.Hex.parse(k[1] || '')
            });
            j = m.toString(trd.enc.Utf8);
            content = j;
            content = content.replace(/【重磅推荐】.*/, '');
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    //////////////////////////////////////////////////轻小说
    addIRule('www.wenku8.com', '轻小说文库', '#title', '.css>tbody>tr>td>a');
    addCRule('www.wenku8.com', '#title', '#content', 1);
    addIRule('book.sfacg.com', 'SF轻小说', 'h1', '.catalog-list>ul>li>a', '.catalog-list>ul>li>a:has(.icn_vip)');
    addCRule('book.sfacg.com', '.list_menu_title', '#ChapterBody');
    addIRule('xs.dmzj.com', '动漫之家', '.novel_cover_text>ol>li>a>h1', '.download_rtx>ul>li>a');
    addCRule('xs.dmzj.com', 'h1', '#novel_contents');
    addIRule('www.yidm.com', '迷糊动漫', 'title', '.chapters.clearfix>a');
    addCRule('www.yidm.com', '.bd>h4', '.bd', 1);
    addIRule('book.suixw.com', '随想轻小说', '#title', '.ccss>a');
    addCRule('book.suixw.com', '#title', '#content', 1);
    addIRule('www.iqing.in', '轻文轻小说', 'h1', '.chapter>a');
    chapterRule['www.iqing.in'] = {
      'Deal': function(num, url) {
        var urlArr = url.split('/');
        GM_xmlhttpRequest({
          method: 'GET',
          url: location.protocol + '//poi.iqing.in/content/' + urlArr[4] + '/chapter/',
          headers: {
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          },
          responseType: 'json',
          onload: function(response) {
            var json = response.response;
            var name = json.chapter_title;
            var content = '';
            for (var i = 0; i < json.results.length; i++) {
              content += json.results[i].value;
            }
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    //////////////////////////////////////////////////盗贴
    addIRule('www.chuanyue8.net', '穿越小说吧', '.bigname', '.zjlist4>ol>li>a');
    chapterRule['www.chuanyue8.net'] = {
      'Deal': function(num, url) {
        var urlArr = url.split(/\/|\./);
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://www.chuanyue8.net/modules/article/17mb_Content.php?aid=' + urlArr[9] + '&cid=' + urlArr[10],
          headers: {
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          },
          onload: function(response) {
            var content = response.response;
            thisDownloaded(num, '', content);
          }
        });
      }
    };
    addIRule('www.22ff.com', '爱书网', '.tname>a', '.main>.neirong>.clc>a');
    chapterRule['www.22ff.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          overrideMimeType: 'text/html; charset=gb2312',
          onload: function(response) {
            var name = $('h1', response.response).text();
            if ($('script:contains(output)', response.response).length > 0) {
              chapterRule['www.22ff.com'].Deal2(num, url, name);
            } else {
              var content = $('#chapter_content', response.response).html();
              thisDownloaded(num, name, content);
            }
          }
        });
      },
      'Deal2': function(num, url, name) {
        var urlArr = url.split('/');
        var aid = urlArr[4];
        var files = urlArr[5];
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://121.40.22.93/novel/' + (Math.floor(aid / 1000) + 1) + '/' + (aid - Math.floor(aid / 1000) * 1000) + '/' + files + '.txt',
          overrideMimeType: 'text/html; charset=gb2312',
          onload: function(response) {
            var content = response.response.replace(/document\.writeln\(\'(.*)\'\);/, '$1');
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('www.xntk.net', '567中文', 'h1', '.centent>ul>li>a');
    chapterRule['www.xntk.net'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          overrideMimeType: 'text/html; charset=gb2312',
          onload: function(response) {
            var name = $('.max', response.response).text();
            if ($('#booktext>script', response.response).length > 0) {
              chapterRule['www.xntk.net'].Deal2(num, $('#booktext>script', response.response).attr('src'), name);
            } else {
              var content = $('#booktext', response.response).html();
              thisDownloaded(num, name, content);
            }
          }
        });
      },
      'Deal2': function(num, url, name) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          overrideMimeType: 'text/html; charset=gb2312',
          onload: function(response) {
            var content = response.response.replace(/document\.write\(\'(.*)\'\);/, '$1');
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('www.kong.so', '悟空追书', 'h1', '.card~.card>.body>.dirlist>li>a');
    chapterRule['www.kong.so'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = $('h1>a', response.response).text();
            var data = response.response.match(/json\',{siteid:\'(.*?)\',url:\'(.*?)\'}/);
            chapterRule['www.kong.so'].Deal2(num, name, data, url);
          }
        });
      },
      'Deal2': function(num, name, data, url) {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://www.kong.so/novelsearch/chapter/transcode.json',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: 'siteid=' + data[1] + '&url=' + data[2],
          responseType: 'json',
          onload: function(response) {
            var content = response.response.data;
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('www.hunhun520.com', '混混小说网', 'h1', '#list>dl>dd>a,#Chapters>ul>li>a');
    chapterRule['www.hunhun520.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          overrideMimeType: 'text/html; charset=gb2312',
          url: url,
          onload: function(response) {
            var host = getHostName(url);
            var contentSelector;
            if (host === 'www.hunhun520.com') {
              contentSelector = '#content';
            } else if (host === 'www.tanxshu.net') {
              contentSelector = '#contxt';
            }
            var name = $('h1', response.response).text();
            var content = $(contentSelector, response.response).html();
            chapterRule['www.hunhun520.com'].Deal2(num, name, content, url, contentSelector);
          }
        });
      },
      'Deal2': function(num, name, content, url, contentSelector) {
        GM_xmlhttpRequest({
          method: 'GET',
          overrideMimeType: 'text/html; charset=gb2312',
          url: url.replace('.html', '_2.html'),
          onload: function(response) {
            content += $(contentSelector, response.response).html();
            thisDownloaded(num, name, content);
          }
        });
      }
    };
    addIRule('www.blwen.com', 'bl文库', 'h2', '.jogger2>li:gt(1):lt(-1)>a');
    addCRule('www.blwen.com', 'h2', '.artz', 1);
    addRRule('www.blwen.com', '\\s+||| ', '.*?<div class="arnr" id="arctext">', '<div class="ggk2">.*');
    addIRule('www.mpzw.com', '猫扑中文', 'h1', '.ccss>a');
    addCRule('www.mpzw.com', 'h1', '#clickeye_content', 1);
    addRRule('www.mpzw.com', '猫扑中文', 'www.mpzw.com', '全文阅读', '\\((\\s+|)\\)');
    addIRule('www.00xs.cc', '00小说', '.chapter-hd>h1', '.chapter-list>li>span>a');
    addCRule('www.00xs.cc', 'h1', '.article-con', 1);
    addRRule('www.00xs.cc', '(以下为|)00小说网.*出版社。', '00小说网', '\\s+||| ', '<span style="color:#4876FF">.*?</script>.*?</span>');
    addIRule('www.kenshu.cc', '啃书小说网', '.chapter-hd>h1', '.chapter-list>li>span>a');
    addCRule('www.kenshu.cc', 'h1', '.article-con', 1);
    addRRule('www.kenshu.cc', '(以下为|)00小说网.*出版社。', '00小说网', '\\s+||| ', '<span style="color:#4876FF">.*?</script>.*?</span>');
    addIRule('www.pbtxt.com', '平板电子书网', 'h1', '.list>dl>dd>a', '', true);
    addCRule('www.pbtxt.com', 'h1', '.content');
    addRRule('www.pbtxt.com', 'txt下载地址：.*');
    addIRule('www.8shuw.net', '8书网', '#info>h1', '.indexlist>tbody>tr>td>span>a');
    addCRule('www.8shuw.net', 'h2>span:nth-child(2)', '[itemprop="content"]', 1);
    addRRule('www.8shuw.net', '\\s+||| ', '<script>.*?</script>');
    addIRule('www.hjwzw.com', '黄金屋中文', 'h1', '#tbchapterlist>table>tbody>tr>td>a');
    addCRule('www.hjwzw.com', 'h1', '#AllySite+div');
    addRRule('www.hjwzw.com', '请记住本站域名.*</b>');
    addIRule('www.5858xs.com', '58小说网', 'h1', 'td>a[href$=".html"]');
    addCRule('www.5858xs.com', 'h1', '#content', 1);
    addRRule('www.5858xs.com', '\\s+||| ', '<fieldset.*?</fieldset>', '<table.*?</table>');
    addIRule('www.teteam.com', 'TET文学', 'h1', '.mulu_list>li>a');
    addCRule('www.teteam.com', 'h1', '#htmlContent', 1);
    addRRule('www.teteam.com', '\(TET文学.*\)');
    addRRule('www.zbzw.com', '浏览阅读地址：.*');
    addIRule('www.23txt.com', '天籁小说', 'h1', '#list>dl>dd>a');
    addCRule('www.23txt.com', 'h1', '#content', 1);
    addRRule('www.23txt.com', '\\s+||| ', '阅读本书最新章节请到.*');
    addIRule('www.59zww.com', '59文学', 'h1', '.xiaoshuo_list>dd>a');
    addCRule('www.59zww.com', 'h1', '.article', 1);
    addRRule('www.59zww.com', '\\s+||| ', '您可以在百度里搜索.*');
    addIRule('www.bookba.net', '在线书吧', 'h2', '.content>.txt-list>li>a');
    addCRule('www.bookba.net', 'h1', '.note', 1);
    addRRule('www.bookba.net', '《在线书吧.*》', '在线书吧唯一官方网站.*其他均为假冒');
    addIRule('www.wenxuemm.com', '女生文学', 'h1', '.novel_list>ul>li>a');
    addCRule('www.wenxuemm.com', 'h1', '#content', 1);
    addRRule('www.wenxuemm.com', '\(女生文学 www.wenxuemm.com\)', '如果您中途有事离开.*');
    addIRule('www.630book.cc', '恋上你看书网', '#info>h1', 'dl.zjlist>dd>a');
    addCRule('www.630book.cc', '#main>h1', '#content', 1);
    addRRule('www.630book.cc', '一秒记住.*?免费读！');
    addIRule('www.zhuaji.org', '爪机书屋', '.title>h1', '.mulu>dl>dd>a');
    addCRule('www.zhuaji.org', '.title', '#content', 1);
    addRRule('www.zhuaji.org', '<a.*?</a>');
    addIRule('www.shunong.com', '书农小说', '.infos>h1', '.book_list>ul>li>a');
    addCRule('www.shunong.com', '.h1title>h1', '#htmlContent');
    addRRule('www.shunong.com', '\\s+||| ', '书农小说.*?下次阅读。', '如果觉得<a.*欣赏.*');
    addIRule('www.hkxs99.net', '无弹窗小说网', '.book>h1', '.book>dl>dd>a');
    addCRule('www.hkxs99.net', 'h1', '.book');
    addRRule('www.hkxs99.net', '\\s+||| ', '<table.*');
    addIRule('www.doulaidu.com', '都来读', 'h2', '.listmain a:gt(5)');
    addCRule('www.doulaidu.com', 'h1', '#content', 1);
    addRRule('www.doulaidu.com', '\\s+||| ', 'http://www.doulaidu.com/xs/.*');
    addIRule('www.shuotxts.net', '小说下载', '.uu_bkt', '.chaptertd>a');
    addCRule('www.shuotxts.net', '#title', '#content1', 1);
    addRRule('www.shuotxts.net', '<span class="copy">.*');
    addIRule('www.fkzww.com', '无敌龙书屋', '.booktitle', '#BookText>ul>li>a');
    addCRule('www.fkzww.com', '.newstitle', '#BookTextt', 1);
    addRRule('www.fkzww.com', '无敌龙中文网欢迎您来.*');
    addIRule('www.bookgew.com', '书阁网', '.booktitle', '#BookText a[href*="htm"]');
    addCRule('www.bookgew.com', '#TextTitle', '#Booex123', 1);
    addRRule('www.bookgew.com', '<div style="display:none">.*?</div>');
    addIRule('www.shumil.com', '书迷楼', '#mybook+.list>.tit>b', 'li.zl>a');
    addCRule('www.shumil.com', 'h2', 'p');
    addRRule('www.shumil.com', '\\s+||| ', '<script.*?</a>.*?</script>', '书迷楼最快更新，无弹窗阅读请.*');
    addIRule('www.520xs.la', '520小说网', 'h1', '.list>dl>dd>a', '', true);
    addCRule('www.520xs.la', 'h1', '.con_txt', 1);
    addRRule('www.520xs.la', '\\s+||| ', '推荐游戏.*');
    addIRule('www.2kxs.com', '2K小说阅读网', 'h1', '.book>dd:gt(6)>a');
    addCRule('www.2kxs.com', 'h2', 'p.Text', 1);
    addRRule('www.2kxs.com', '\\s+||| ', '<a href=.*</strong>', '2k小说阅读网');
    addIRule('www.mianhuatang.la', '棉花糖小说网', 'h1', '.novel_list>dl>dd>a');
    addCRule('www.mianhuatang.la', 'h1', '.content');
    addRRule('www.mianhuatang.la', '\\s+||| ', '<div class="con_l">.*', '\[看本书最新章节请到棉花糖小说网www.mianhuatang.cc\]', '<strong>.*?</strong>');
    addIRule('www.baoliny.com', '风云小说阅读网', 'h1', 'table.acss>tbody>tr>td.ccss>a');
    addCRule('www.baoliny.com', 'h1', '#content', 1);
    addRRule('www.baoliny.com', '【.*?baoliny.*?】');
    addIRule('www.dajiadu.net', '大家读书院', 'h1', '#booktext>ul>li>a');
    addCRule('www.dajiadu.net', '#title', '#content1', 1);
    addRRule('www.dajiadu.net', '<span class="copy".*');
    addIRule('www.paoshuba.cc', '泡书吧', '#info>h1', '#list>dl>dd>a');
    addCRule('www.paoshuba.cc', '.zhangjieming>h1', '#TXT', 1);
    addRRule('www.paoshuba.cc', '\\s+||| ', '<div class="bottem">.*');
    addIRule('www.qmshu.com', '启蒙书网', '.wrapper_list>h1>a', '#htmlList>dl>dd>ul>li>strong>a');
    addCRule('www.qmshu.com', 'h1', '#htmlContent', 1);
    addRRule('www.qmshu.com', '无弹窗小说网.*', '看更新最快的.*');
    addIRule('www.xfqxsw.com', '番茄小说', '#info>h1', '#list>dl>dd>a');
    addCRule('www.xfqxsw.com', 'h1', '#content', 1);
    addRRule('www.xfqxsw.com', '番.*?茄.*?小.*?说.*?网.*?ｃｏｍ');
    addIRule('www.zwda.com', 'E小说', '#info>h1', '#list>dl>dd>a');
    addCRule('www.zwda.com', 'h1', '#content', 1);
    addRRule('www.zwda.com', 'E.*?小.*?说.*?ＣＯＭ');
    addIRule('www.sto.cc', '思兔閱讀', 'h1', '#Page_select>option');
    addCRule('www.sto.cc', 'h1', '#BookContent');
    addRRule('www.sto.cc', '\\s+||| ', '<span.*?</span>');
    addIRule('www.musemailsvr.com', 'MuseMail中文', '.wrapper>h1>a', '.nav>span>a');
    addCRule('www.musemailsvr.com', '.title', '#content', 1);
    addIRule('www.50zw.co', '武林中文网', '#info>h1', '.chapterlist>li>a');
    addCRule('www.50zw.co', 'h1', '#htmlContent', 1);
    addIRule('www.piaotian.com', '飘天文学', 'h1', '.centent>ul>li>a:gt(3)');
    addCRule('www.piaotian.com', 'h1', '#content', 1);
    addRRule('www.piaotian.com', '\\s+||| ', '.*返回书页</a></div>', '<!-- 翻页上AD开始 -->.*');
    addIRule('www.23xs.org', '爱上小说', 'h1', '.mod_container>dl>dd>a');
    addCRule('www.23xs.org', 'h2', '.novel_content', 1);
    //////////////////////////////////////////////////18X
    addIRule('www.lewenxs.net', '乐文小说网', 'h1', '.chapterlist a');
    addCRule('www.lewenxs.net', 'h1', '#BookText', 1);
    addIRule('www.wodexiaoshuo.cc', '我的小说网', 'h1', '.liebiao a');
    addCRule('www.wodexiaoshuo.cc', 'h2', '#content', 1);
    addRRule('www.wodexiaoshuo.cc', '本站永久地址.*');
    addIRule('www.shubao26.com', '第二书包网', 'h1', '.mulu a');
    addCRule('www.shubao26.com', 'h1', '.mcc', 1);
    addIRule('www.lawen520.com', '辣文小说网', 'h1', '.mulu a');
    addCRule('www.lawen520.com', 'h1', '.mcc', 1);
    addIRule('bbs.6park.com', '禁忌书屋', 'font>b', 'body>table>tbody>tr>td>ul>li>a', '', true);
    addCRule('bbs.6park.com', 'font>b', 'td:has(center)', 1);
    addIRule('web.6park.com', '留园', 'font>span', 'body>table>tbody>tr>td>li>a', '', true);
    addCRule('web.6park.com', 'font>b', 'td', 1);
    addIRule('www.neixiong888.com', '内兄小说网', '.bookName', '.bookUpdate a');
    addCRule('www.neixiong888.com', 'h2', '#content', 1);
    addRRule('www.neixiong888.com', '\\s+||| ', '<span id="endtips">.*');
    addIRule('www.xncwxw.com', '新暖才文学网', 'h1', '#list a');
    addCRule('www.xncwxw.com', 'h1', '#content', 1);
    addIRule('www.50655.net', '屌丝小说网', 'h1', '.book_list a');
    addCRule('www.50655.net', 'h1', '#htmlContent', 1);
    addIRule('www.bmshu.com', '苞米文学', 'h1', '.chapterlist a');
    addCRule('www.bmshu.com', 'h1', '#BookText', 1);
    addIRule('www.beijingaishu.net', '北京爱书网', 'h1', '.ccss>a');
    addCRule('www.beijingaishu.net', 'h1', '#content', 1);
    addRRule('www.beijingaishu.net', '最新章节请百度搜索【北京爱书】.*?net\\)', '本书由.*');
    addIRule('www.dz8.la', '读者吧', 'h1', '.entry_video_list>ul>li>a');
    addCRule('www.dz8.la', 'h1', '#view_content_txt', 1);
    addIRule('www.kewaishu.info', '课外书阅读网', 'h1', '#list>dl>dd>a');
    addCRule('www.kewaishu.info', '.bookname>h1', '#content>p', 1);
    addIRule('www.lmzww.net', '林木中文网', 'h1', '.novel_list>ul>li>a');
    addCRule('www.lmzww.net', 'h1', '.novel_content', 1);
    addIRule('www.zxxs259.com', '紫轩小说吧', 'h1', '.L>a');
    addCRule('www.zxxs259.com', 'h1', '#contents', 1);
    addIRule('www.zixuanxs.com', '紫轩小说吧', 'h1', '.L>a');
    addCRule('www.zixuanxs.com', 'h1', '#contents', 1);
    addIRule('www.ncwx.hk', '暖才文学网', 'h1', '.novel_list>ul>li>a');
    addCRule('www.ncwx.hk', 'h1', '.novel_content', 1);
    addRRule('www.ncwx.hk', '【 暖才文学网 .*】');
    addIRule('x520xs.com', '520小说', 'h1', '.dirinfo_list>dd>a');
    addCRule('x520xs.com', 'h1', '#floatleft', 1);
    addIRule('www.7zxs.com', '7z小说网', '.title>h2', '.ocon>dl>dd>a');
    addCRule('www.7zxs.com', '.nr_title>h3', '#htmlContent', 1);
    addRRule('www.7zxs.com', '登陆7z小说网.*');
    addIRule('www.ik777.net', '艾克小说网', '.title>h2', '.ocon>dl>dd>a');
    addCRule('www.ik777.net', '.nr_title>h3', '#htmlContent', 1);
    addRRule('www.ik777.net', '《.*?》最新章节.*?net】');
    addIRule('www.jipinzw.com', '极品小说网', 'h1', '.book_list>ul>li>a');
    addCRule('www.jipinzw.com', 'h1', '.contentbox', 1);
    addRRule('www.jipinzw.com', '请记住【极品小说网】.*?下载！', '\\s+||| ', '<div class="chapter_Turnpage.*');
    addIRule('www.qindouxs.org', '青豆小说网', '.kui-left.kui-fs32', '.kui-item>a');
    addCRule('www.qindouxs.org', 'h1.kui-ac', '#kui-page-read-txt', 1);
    addIRule('www.5qudu.com', '我去读文学网', '#title', '.ccss>a');
    addCRule('www.5qudu.com', '#title', '#content', 1);
    addIRule('www.8xxsw.com', '八仙小说网', '.m66>a:eq(2)', '.m10:eq(2) a');
    addCRule('www.8xxsw.com', 'strong', '.content', 1);
    addRRule('www.8xxsw.com', '<img src="(\\w+)/(\\w+).jpg">|||{$2}', '{ai}|||爱', '{ba}|||巴', '{bang}|||棒', '{bao}|||饱', '{bi}|||逼', '{bi2}|||屄', '{bo}|||勃', '{cao}|||操', '{cha}|||插', '{chan}|||缠', '{chao}|||潮', '{chi}|||耻', '{chou}|||抽', '{chuan}|||喘', '{chuang}|||床', '{chun}|||春', '{chun2}|||唇', '{cu}|||粗', '{cuo}|||搓', '{diao}|||屌', '{dong}|||洞', '{dong2}|||胴', '{fei}|||肥', '{feng}|||缝', '{fu}|||腹', '{gan}|||感', '{gang}|||肛', '{gao}|||高', '{gao2}|||睾', '{gen}|||根', '{gong}|||宫', '{gu}|||股', '{gui}|||龟', '{gun}|||棍', '{huan}|||欢', '{ji}|||激', '{ji2}|||鸡', '{jian}|||贱', '{jian2}|||奸', '{jiao}|||交', '{jing}|||精', '{ku}|||裤', '{kua}|||胯', '{lang}|||浪', '{liao}|||撩', '{liu}|||流', '{lou}|||露', '{lu}|||撸', '{luan}|||乱', '{luo}|||裸', '{man}|||满', '{mao}|||毛', '{mi}|||密', '{mi2}|||迷', '{min}|||敏', '{nai}|||奶', '{nen}|||嫩', '{niang}|||娘', '{niao}|||尿', '{nong}|||弄', '{nue}|||虐', '{nv}|||女', '{pen}|||喷', '{pi}|||屁', '{qi}|||骑', '{ri}|||日', '{rou}|||肉', '{rou2}|||揉', '{ru}|||乳', '{ru2}|||蠕', '{rui}|||蕊', '{sa2i}|||塞', '{sao}|||骚', '{se}|||色', '{she}|||射', '{shen}|||身', '{shi}|||湿', '{shu}|||熟', '{shuang}|||爽', '{shun}|||吮', '{tian}|||舔', '{ting}|||挺', '{tun}|||吞', '{tun2}|||臀', '{tuo}|||脱', '{xi}|||吸', '{xie}|||泄', '{xing}|||性', '{xiong}|||胸', '{xue}|||穴', '{ya}|||压', '{yang}|||阳', '{yang2}|||痒', '{yao}|||腰', '{ye}|||液', '{yi}|||旖', '{yi2}|||衣', '{yin}|||阴', '{yin2}|||淫', '{ying}|||迎', '{you}|||诱', '{yu}|||欲', '{zhang}|||胀', '{zuo}|||坐');
    addIRule('www.6mxs.com', '流氓小说网', '.lookmc>strong', '.mread:eq(0) a', '', true);
    addCRule('www.6mxs.com', 'strong', '.ll', 1);
    addRRule('www.6mxs.com', '<img src="(\\w+)/(\\w+).jpg">|||{$2}', '{ai}|||爱', '{ba}|||巴', '{bang}|||棒', '{bao}|||饱', '{bi}|||逼', '{bi2}|||屄', '{bo}|||勃', '{cao}|||操', '{cha}|||插', '{chan}|||缠', '{chao}|||潮', '{chi}|||耻', '{chou}|||抽', '{chuan}|||喘', '{chuang}|||床', '{chun}|||春', '{chun2}|||唇', '{cu}|||粗', '{cuo}|||搓', '{diao}|||屌', '{dong}|||洞', '{dong2}|||胴', '{fei}|||肥', '{feng}|||缝', '{fu}|||腹', '{gan}|||感', '{gang}|||肛', '{gao}|||高', '{gao2}|||睾', '{gen}|||根', '{gong}|||宫', '{gu}|||股', '{gui}|||龟', '{gun}|||棍', '{huan}|||欢', '{ji}|||激', '{ji2}|||鸡', '{jian}|||贱', '{jian2}|||奸', '{jiao}|||交', '{jing}|||精', '{ku}|||裤', '{kua}|||胯', '{lang}|||浪', '{liao}|||撩', '{liu}|||流', '{lou}|||露', '{lu}|||撸', '{luan}|||乱', '{luo}|||裸', '{man}|||满', '{mao}|||毛', '{mi}|||密', '{mi2}|||迷', '{min}|||敏', '{nai}|||奶', '{nen}|||嫩', '{niang}|||娘', '{niao}|||尿', '{nong}|||弄', '{nue}|||虐', '{nv}|||女', '{pen}|||喷', '{pi}|||屁', '{qi}|||骑', '{ri}|||日', '{rou}|||肉', '{rou2}|||揉', '{ru}|||乳', '{ru2}|||蠕', '{rui}|||蕊', '{sa2i}|||塞', '{sao}|||骚', '{se}|||色', '{she}|||射', '{shen}|||身', '{shi}|||湿', '{shu}|||熟', '{shuang}|||爽', '{shun}|||吮', '{tian}|||舔', '{ting}|||挺', '{tun}|||吞', '{tun2}|||臀', '{tuo}|||脱', '{xi}|||吸', '{xie}|||泄', '{xing}|||性', '{xiong}|||胸', '{xue}|||穴', '{ya}|||压', '{yang}|||阳', '{yang2}|||痒', '{yao}|||腰', '{ye}|||液', '{yi}|||旖', '{yi2}|||衣', '{yin}|||阴', '{yin2}|||淫', '{ying}|||迎', '{you}|||诱', '{yu}|||欲', '{zhang}|||胀', '{zuo}|||坐');
    addIRule('www.3mxs.com', '三毛小说网', '.lookmc>strong', '.mread:eq(0) a', '', true);
    addCRule('www.3mxs.com', 'strong', '.ll', 1);
    addRRule('www.3mxs.com', '<img src="(\\w+)/(\\w+).jpg">|||{$2}', '{ai}|||爱', '{ba}|||巴', '{bang}|||棒', '{bao}|||饱', '{bi}|||逼', '{bi2}|||屄', '{bo}|||勃', '{cao}|||操', '{cha}|||插', '{chan}|||缠', '{chao}|||潮', '{chi}|||耻', '{chou}|||抽', '{chuan}|||喘', '{chuang}|||床', '{chun}|||春', '{chun2}|||唇', '{cu}|||粗', '{cuo}|||搓', '{diao}|||屌', '{dong}|||洞', '{dong2}|||胴', '{fei}|||肥', '{feng}|||缝', '{fu}|||腹', '{gan}|||感', '{gang}|||肛', '{gao}|||高', '{gao2}|||睾', '{gen}|||根', '{gong}|||宫', '{gu}|||股', '{gui}|||龟', '{gun}|||棍', '{huan}|||欢', '{ji}|||激', '{ji2}|||鸡', '{jian}|||贱', '{jian2}|||奸', '{jiao}|||交', '{jing}|||精', '{ku}|||裤', '{kua}|||胯', '{lang}|||浪', '{liao}|||撩', '{liu}|||流', '{lou}|||露', '{lu}|||撸', '{luan}|||乱', '{luo}|||裸', '{man}|||满', '{mao}|||毛', '{mi}|||密', '{mi2}|||迷', '{min}|||敏', '{nai}|||奶', '{nen}|||嫩', '{niang}|||娘', '{niao}|||尿', '{nong}|||弄', '{nue}|||虐', '{nv}|||女', '{pen}|||喷', '{pi}|||屁', '{qi}|||骑', '{ri}|||日', '{rou}|||肉', '{rou2}|||揉', '{ru}|||乳', '{ru2}|||蠕', '{rui}|||蕊', '{sa2i}|||塞', '{sao}|||骚', '{se}|||色', '{she}|||射', '{shen}|||身', '{shi}|||湿', '{shu}|||熟', '{shuang}|||爽', '{shun}|||吮', '{tian}|||舔', '{ting}|||挺', '{tun}|||吞', '{tun2}|||臀', '{tuo}|||脱', '{xi}|||吸', '{xie}|||泄', '{xing}|||性', '{xiong}|||胸', '{xue}|||穴', '{ya}|||压', '{yang}|||阳', '{yang2}|||痒', '{yao}|||腰', '{ye}|||液', '{yi}|||旖', '{yi2}|||衣', '{yin}|||阴', '{yin2}|||淫', '{ying}|||迎', '{you}|||诱', '{yu}|||欲', '{zhang}|||胀', '{zuo}|||坐');
    addIRule('www.bsl8.la', '百书楼', '.bname', '.dccss>a');
    addCRule('www.bsl8.la', '.bname_content', '#content', 1);
    addIRule('www.fafaxs.cc', '发发小说网', '.btitle>h1', '.L>a');
    addCRule('www.fafaxs.cc', 'h2', '#content>p', 1);
    addIRule('www.shushuwu.cc', '书书屋', 'h1', '.ml_main>dl>dd>a');
    addCRule('www.shushuwu.cc', 'h2', '.yd_text2', 1);
    addIRule('www.cuiweijuxin.com', '翠微居小说网', 'td[valign="top"]>div>span:eq(0)', '.chapters:eq(1)>.chapter>a');
    addCRule('www.cuiweijuxin.com', '.title', '#content', 1);
    addIRule('www.shubao4.com', '第二书包网', 'h1', '.chapterlist a');
    addCRule('www.shubao4.com', 'h1', '#BookText', 1);
    addIRule('www.cuiweiju88.com', '翠微居', 'h1', '#at>tbody>tr>td.L>a');
    addCRule('www.cuiweiju88.com', 'h1', '#contents', 1);
    addIRule('www.xitxt.net', '喜书网', 'h1', '.list a:lt(-1)');
    addCRule('www.xitxt.net', 'h1', '.chapter', 1);
    addIRule('www.shenshuw.com', '神书网', 'h1', '#chapterlist a');
    addCRule('www.shenshuw.com', 'h1', '#book_text');
    addIRule('www.baqishuku9.com', '霸气书库', 'h1', '.list a:lt(-1)');
    addCRule('www.baqishuku9.com', 'h1', '.chapter', 1);
    addIRule('www.heihei66.com', '有意思书院', 'h1', '#contenttable a');
    addCRule('www.heihei66.com', '.ctitle', '#content', 1);
    addIRule('www.quanshuwu.com', '全本书屋', 'h1', '#readlist a');
    addCRule('www.quanshuwu.com', 'h1', '#content');
    addRRule('www.quanshuwu.com', '\\s+||| ', '<div class="csmenu">.*?<div class="avip3">', '<div class="prenext">.*');
    addIRule('www.dzxs.cc', '大众小说网', 'h1', '.chapterlist a');
    addCRule('www.dzxs.cc', 'h1', '#BookText', 1);
    addIRule('www.mlxiaoshuo.com', '魔龙小说网', '.colorStyleTitle', '.zhangjieUl a');
    addCRule('www.mlxiaoshuo.com', '.navTextA+span', '.textP');
    addIRule('www.haianxian.net', '海岸线文学网', 'h1', '.mulu_list a');
    addCRule('www.haianxian.net', 'h1', '#htmlContent', 1);
    addIRule('www.xiaoqiangxs.com', '小强小说网', 'h1', '.liebiao a');
    addCRule('www.xiaoqiangxs.com', 'h2', '#content', 1);
    addIRule('18av.mm-cg.com', '18H', '.label>div', '.novel_leftright>span>a:visible');
    addCRule('18av.mm-cg.com', '#left>h1', '#novel_content_txtsize');
    //////////////////////////////////////////////////以上为站点规则
  })();
  $('<div id="nd"></div>').html(function() {
    return [
      '<div class="ndMain ndBoxCenter"><button class="ndHide">×</button><span class="ndInfo"></span><div class="ndSeparator"></div>下载线程：<input class="ndInput ndThread" name="thread" placeholder="5" type="text">&nbsp;失败重试次数：<input class="ndInput ndError" title="0表示不重试" name="error" placeholder="0" type="text"><br/>超时重试次数：<input class="ndInput ndTimeout" title="0表示不重试" name="timeout" placeholder="3" type="text">&nbsp;超时时间：<input class="ndInput ndTime" name="time" placeholder="20" type="text">秒<br/><input id="ndFormat" class="ndCheckbox" name="format" type="checkbox"><label for="ndFormat">文本处理</label>&nbsp;<input id="ndSection" class="ndCheckbox" name="section" type="checkbox"><label for="ndSection">强制分段</label>&nbsp;<input id="ndImage" class="ndCheckbox" name="image" type="checkbox"><label for="ndImage">下载图片</label>&nbsp;<br/><input id="ndVip" type="checkbox"><label for="ndVip">下载Vip章节</label>&nbsp;语言：<input id="ndLangZhs" type="radio" name="lang" class="ndLang" value="0" checked="true"><label for="ndLangZhs">简体</label><input id="ndLangZht" type="radio" name="lang" class="ndLang" value="1"><label for="ndLangZht">繁体</label><br><input id="ndSort" class="ndCheckbox" name="sort" type="checkbox"><label for="ndSort">章节排序(以站点规则优先)</label><div class="ndSeparator"></div>分次下载&nbsp;<select class="ndSplit" name="type"><option value=""></option><option value="all-2">2次</option><option value="all-3">3次</option><option value="all-4">4次</option><option value="every-500">500章</option><option value="every-100">100章</option><option value="every-10">10章</option><option value="...">...</option></select>&nbsp;<button class="ndSplitStart">开始下载</button><br/>下载范围&nbsp;<input placeholder="1开头,例1-25,35,50" class="ndSplitInput" type="text"><div class="ndSeparator"></div><button class="ndDownload" name="test">测试(随机章节)</button><br><button class="ndDownload" name="this">下载本章(TXT)</button>&nbsp;<button class="ndDownload" name="txt">下载目录页(TXT)</button><br/><button class="ndDownload" name="zip">下载目录页(ZIP)</button>&nbsp;<button class="ndDownload" name="epub">下载目录页(Epub)</button><div class="ndSeparator"></div><button class="ndShow" name="Customize">自定义站点规则</button></div>',
      '<div class="ndCustomize ndBoxCenter"><button class="ndHide">×</button><span>默认显示当前站点规则<br/>具体规则，详见<a href="https://github.com/dodying/UserJs/tree/master/novel/novelDownloader#自定义站点规则说明"target="_blank">自定义站点规则说明</a></span><br/><textarea class="ndCustomizeTextarea"></textarea><br/><button class="ndCustomizeSave">保存</button>&nbsp;<button class="ndCustomizeDelete">删除某站点的规则</button>&nbsp;<button class="ndCustomizeClear">清空</button><br/><button class="ndCustomizeAll">显示所有规则</button></div>',
      '<div class="ndLog"><div class="ndLogNow" title="点击清除已完成"><div><progress class="bookDownladerProgress" value="0" max="0"></progress><span class="bookDownladerProgressSpan"><span class="bookDownladerChapter">0</span>/<span class="bookDownladerChapterAll">0</span></span></div></div><button class="ndHide">×</button><div class="ndLogDiv"></div></div>',
      '<div class="ndFinderArea"></div>',
      '<div class="ndTestArea"><button class="ndHide">×</button><textarea></textarea></div>'
    ].join('');
  }).appendTo('body');
  $('<style></style>').text(function() {
    return [
      '#nd{text-align:center;}',
      '#nd>div{display:none;}',
      '.ndBoxCenter,.ndLog{z-index:999999;text-align:center;;background-color:white;border:1px solid black;position:fixed;}',
      '.ndLog{width:300px;height:350px;overflow:auto;right:5px;bottom:10px;}',
      '#nd input[type="text"]{width:65%;border:1px solid #000;}',
      '#nd input,#nd label,#nd select{display:inline;position:relative;top:0;opacity:1;}',
      '#nd textarea{resize:both;width:95%;height:108px;overflow:auto;}',
      '#nd button{border:#c0c0c0 1px solid;}',
      '#nd span{float:none;background:none;}',
      '.ndSeparator{border:1px solid #000;}',
      '.ndInput{width:24px !important;}',
      '.ndHide{z-index:9999;float:right;color:red;}',
      '.ndCustomize{min-width:450px;}',
      '.ndBlue{color:blue;}',
      '.ndLogDiv{height:290px;overflow:auto;}',
      '.bookDownladerProgressSpan{position:absolute;left:0;right:0;}',
      '.ndStatusOk{color:green;}',
      '.ndStatusError{color:red;}',
      '.ndStatusTimeout{color:yellow;}',
      'body{counter-reset:chapterOrder;}',
      '.ndPre,.ndPreVip{float:left;width:auto;}',
      '.ndPre:before,.ndPreVip:before{content:counter(chapterOrder) "-";counter-increment:chapterOrder;}',
      '.ndPre{color:#000;}',
      '.ndPreVip{color:#FF0000;}',
      '.ndTestArea>*{position:fixed;top:0;right:0;z-index:1;}',
      '.ndTestArea>.ndHide{z-index:1000001;}',
      '.ndTestArea>textarea{width:calc(100% - 20px)!important;height:calc(100% - 20px)!important;background-color:#FFF;margin:10px;z-index:1000000;}'
    ].join('');
  }).appendTo('head');
  $('<style id="ndToggle"></style>').text('.ndPre,.ndPreVip{display:block;}').appendTo('head');
  $('.ndInput').each(function() {
    if (GM_getValue(this.name, false) !== false) this.value = GM_getValue(this.name);
  });
  $('.ndCheckbox').each(function() {
    if (GM_getValue(this.name, false) !== false) this.checked = GM_getValue(this.name);
  });
  if (GM_getValue('lang', 0) === 0) {
    $('#ndLangZhs')[0].checked = true;
  } else {
    $('#ndLangZht')[0].checked = true;
  }
  if (GM_getValue('split', false) !== false) {
    $('.ndSplit').val(GM_getValue('split'));
    if ($('.ndSplit').val() === null) {
      $('.ndSplit').prepend('<option value="' + GM_getValue('split') + '">' + GM_getValue('split') + '</option>');
      $('.ndSplit').val(GM_getValue('split'));
    }
  }
  var i;
  var savedValue = GM_listValues();
  var nowCustomizeRule = '';
  var allCustomizeRule = '';
  for (i = 0; i < savedValue.length; i++) {
    if (/^indexRule_|^chapterRule_|^reRule_/i.test(savedValue[i])) {
      allCustomizeRule += GM_getValue(savedValue[i]) + '\n';
      if (savedValue[i].indexOf(location.host) > 0) {
        nowCustomizeRule += GM_getValue(savedValue[i]) + '\n';
        try {
          eval(GM_getValue(savedValue[i]));
        } catch (err) {
          alert('站点规则出错\n名称：' + savedValue[i] + '\n值：' + GM_getValue(savedValue[i]) + '\n错误信息：\n' + err);
        }
      }
      if (indexRule[location.host] && indexRule[location.host].searchEngine && /^indexRule_/i.test(savedValue[i])) {
        try {
          eval(GM_getValue(savedValue[i]));
        } catch (err) {
          alert('站点规则出错\n名称：' + savedValue[i] + '\n值：' + GM_getValue(savedValue[i]) + '\n错误信息：\n' + err);
        }
      }
    }
  }
  if (indexRule[location.host] && indexRule[location.host].searchEngine) {
    $(indexRule[location.host].cite).each(function() {
      if (getHostName(this.innerText).replace(/^(.*?)\s+.*$/, '$1') in indexRule) {
        $(this).parent().append('<a class="ndadded ndBlue"> 已加入' + GM_info.script.name + '豪华午餐</a>');
      }
    });
    $(indexRule[location.host].nextpage).click(function() {
      location.href = this.href;
    });
    $(indexRule[location.host].searchBtn).click(function() {
      var keyword = encodeURIComponent($(indexRule[location.host].searchInput).val());
      location.search = '?' + $(indexRule[location.host].searchInput).attr('name') + '=' + keyword;
    });
  }
  nowCustomizeRule = nowCustomizeRule.replace(/\s+$/, '');
  if (allCustomizeRule === '') GM_setValue('savedUrl', []);
  $('.ndCustomizeTextarea').val(nowCustomizeRule);
  $('.ndCustomizeAll').click(function() {
    if (confirm('请确定是否已保存规则')) $('.ndCustomizeTextarea').val(allCustomizeRule);
  });
  if (indexRule[location.host] === undefined) { //待续
    var testChapter = ['#BookText a', '#Chapters a', '#TabCss a', '#Table1 a', '#at a', '#book a', '#booktext a', '#catalog_list a', '#chapterList a', '#chapterlist a', '#container1 a', '#content_1 a', '#contenttable a', '#dir a', '#htmlList a', '#list a', '#oneboolt a', '#read.chapter a', '#readerlist a', '#readerlists a', '#readlist a', '#tbchapterlist a', '#xslist a', '#zcontent a', '.Chapter a', '.L a', '.TabCss>dl>dd>a', '.Volume a', '._chapter a', '.aarti a', '.acss a', '.all-catalog a', '.art_fnlistbox a', '.art_listmain_main a', '.article_texttitleb a', '.as a', '.bd a', '.book a', '.book-chapter-list a', '.bookUpdate a', '.book_02 a', '.book_article_listtext a', '.book_con_list a', '.book_dirbox a', '.book_list a', '.booklist a', '.box-item a', '.box1 a', '.box_box a', '.box_chap a', '.catalog a', '.catalog-list a', '.catebg a', '.category a', '.ccss a', '.centent a', '.chapname a', '.chapter a', '.chapter-list a', '.chapterBean a', '.chapterNum a', '.chapterTable a', '.chapter_box_ul a', '.chapter_list_chapter a', '.chapterlist a', '.chapterlistxx a', '.chapters a', '.chapters_list a', '.chaptertable a', '.chaptertd a', '.columns a', '.con_05 a', '.content a', '.contentlist a', '.conter a', '.css a', '.d_contarin a', '.dccss a', '.detail-chapters a', '.dir_main_section a', '.dirbox a', '.dirconone a', '.dirinfo_list a', '.dit-list a', '.download_rtx a', '.entry_video_list a', '.float-list a', '.index a', '.indexlist a', '.info_chapterlist a', '.insert_list a', '.item a', '.kui-item a', '.l_mulu_table a', '.lb a', '.liebiao a', '.liebiao_bottom a', '.list a', '.list-directory a', '.list-group a', '.list01a', '.list_Content a', '.list_box a', '.listmain a', '.lists a', '.lrlb a', '.m10 a', '.main a', '.mb_content a', '.menu-area a', '.ml-list1 a', '.ml_main a', '.mls a', '.mod_container a', '.mread a', '.mulu a', '.mulu_list a', '.nav a', '.nolooking a', '.novel_leftright a', '.novel_list a', '.ocon a', '.opf a', '.qq', '.read_list a', '.readout a', '.td_0 a', '.td_con a', '.third a', '.uclist a', '.uk-table a', '.volume a', '.volumes a', '.wiki-content-table a', '.www a', '.xiaoshuo_list a', '.xsList a', '.zhangjieUl a', '.zjbox a', '.zjlist a', '.zjlist4 a', '.zl a', '.zp_li a'];
    for (i = 0; i < testChapter.length; i++) {
      if ($(testChapter[i]).length > 0) break;
    }
    testChapter = i === testChapter.length ? 'a' : testChapter[i];
    console.log('通用规则-chapter: ', testChapter);
    addIRule(location.host, '通用规则（测试）', 'h1,h2', testChapter);
    var _chapter = GM_getValue('_chapter', {});
    _chapter[testChapter] = testChapter in _chapter ? _chapter[testChapter]++ : 1;
    GM_setValue('_chapter', _chapter);
    addCRule(location.host, 'h1,h2', '#Booex123,#BookContent,#BookText,#BookTextt,#ChapterBody,#Content,#J_article_con,#TXT,#a_content,#acontent,#artWrap,#article,#article-content,#articlebody,#book_text,#bookbody,#booktext,#ccon,#ccontent,#chapterContent,#chapter_content,#chaptercontent,#clickeye_content,#content,#content1,#content_1,#contentbox,#contents,#cp_content,#detail,#floatleft,#fontsize,#htmlContent,#jsreadbox,#kui-page-read-txt,#mouseRight,#neirong,#novel_content_txtsize,#novel_contents,#ntxt,#page-content,#partContent,#r_zhengwen,#read-content,#read_txt,#readcon,#readerFs,#showcontent,#snr2,#table_container,#text_area,#texts,#txt,#view_content_txt,#zjcontentdiv,#zoom,.Text,.article,.article-con,.bd,.book,.book_con,.box_box,.chapter,.chapter_con,.chaptertxt,.chpater-content,.con_L,.con_txt,.content,.contentbox,.menu-area,.myContent,.note,.novel_content,.noveltext,.p,.page-content,.panel-body,.read-content,.reed,.shuneirong,.text,.text1,.textP,.textinfo+p,.txt,.txtc,.yd_text2', 0);
    if ($('meta[content*="charset=gb"],meta[charset*="gb"],script[charset*="gb"]').length) chapterRule[location.host].MimeType = 'text/html; charset=gb2312';
    chapterRule[location.host].sort = $('#ndSort')[0].checked;
    $(window).data('autoTry', true);
    $(window).data('autoTryResult', false);
  }
  if (indexRule[location.host]) {
    $(indexRule[location.host].chapter).not(indexRule[location.host].vip).prepend('<span class="ndPre"></span>');
    $(indexRule[location.host].vip).prepend('<span class="ndPreVip"></span>');
  }
  $('.ndInfo').html(function() {
    var nameThis = (indexRule[location.host] && indexRule[location.host].cn) ? indexRule[location.host].cn : '未命名的站点';
    return '当前网站：<a href="http://' + location.host + '/" target="_blank">' + nameThis + '</a>';
  });
  //////////////////////////////////////////////////以下为CSS设置与事件
  var resetPositon = function() {
    var _screen = {
      width: Math.min(document.documentElement.clientWidth, window.screen.availWidth),
      height: Math.min(document.documentElement.clientHeight, window.screen.availHeight)
    };
    $('.ndBoxCenter').css({
      left: function() {
        return ((_screen.width - $(this).width()) / 2) + 'px';
      },
      top: function() {
        return ((_screen.height - $(this).height()) / 2) + 'px';
      }
    });
  };
  resetPositon();
  $(window).bind({
    resize: function() {
      resetPositon();
    }
    /*,
    click:function (){
      resetPositon();
    }*/
  });
  $('.ndInput').change(function() {
    GM_setValue(this.name, parseInt(this.value) || parseInt(this.placeholder));
  });
  $('.ndLang').click(function() {
    GM_setValue(this.name, parseInt(this.value));
  });
  $('.ndCheckbox').click(function() {
    GM_setValue(this.name, this.checked);
  });
  $('#ndVip').click(function() {
    if (this.checked && !confirm('只在起点有效。\n如未登录，则只会下载章节预览。\n如已登录，可能会订阅Vip章节。\n如果不放心，请勿勾选。出事作者概不负责。')) this.checked = false;
  });
  $('.ndSplit').change(function() {
    if (this.value === '...') {
      var input = prompt('请输入[类型-数字]\n类型：\n1、all表示总体分割\n2、every表示每几章分割\n\n例：\n1、[all-3]表示整个下载列表分成3个文件\n2、[every-100]表示每100章，生成一个文件\n输入值将会保存并默认');
      $(this).prepend('<option value="' + input + '">' + input + '</option>');
      $(this).val(input);
      GM_setValue('split', input);
    } else {
      GM_setValue('split', this.value);
    }
    $(window).data('split', 0);
    $('.ndSplitStart').text('开始下载');
  });
  $('.ndSplitStart').click(function() {
    var split = ($(window).data('split')) ? $(window).data('split') + 1 : 1;
    $(window).data('split', split);
    var arr = $('.ndSplit').val().split('-');
    if (arr[0] === 'all' || arr[0] === 'every') {
      $(this).text('第' + split + '次下载');
      var len = $(indexRule[location.host].chapter).length;
      var step = (arr[0] === 'all') ? Math.floor(len / arr[1]) + 1 : arr[1];
      var start = step * (split - 1) + 1;
      var end = step * split;
      if (end >= len) {
        end = len;
        $(this).text('完成');
        $(window).data('split', 0);
      }
      $('.ndSplitInput').val(start + '-' + end);
    } else {
      alert('请按照示例重新输入。');
      $(window).data('split', 0);
    }
  });
  $('.ndDownload').on({
    click: function() {
      var host = location.host;
      if (this.name === 'test') {
        if ($(indexRule[host].chapter).not(indexRule[host].vip).length > 0) {
          var max = $(indexRule[host].chapter).not(indexRule[host].vip).length;
          $('.ndSplitInput').val(Math.ceil(Math.random() * max));
          download('test');
        } else {
          this.textContent = '不支持';
        }
      } else if (this.name === 'this') {
        if ($(chapterRule[host].content).length > 0) {
          var name = $(chapterRule[host].name).eq(0).text() || document.title;
          var content = $(chapterRule[host].content).html();
          if ($('#ndFormat')[0].checked === true) content = wordFormat(content);
          if ($('#ndSection')[0].checked === true) content = wordSection(content);
          content = '来源地址：' + location.href + '\r\n' + content;
          name = tranStr(name, $('.ndLang:checked').val() * 1);
          content = tranStr(content, $('.ndLang:checked').val() * 1);
          $(window).data('dataDownload', [{
            'name': name.trim(),
            'content': content
          }]);
          download2Txt(name);
        } else {
          this.textContent = '不支持';
        }
      } else {
        download(this.name);
      }
    }
  });
  $('.ndShow').on({
    click: function() {
      $('.nd' + this.name).show();
    }
  });
  $('.ndHide').on({
    click: function() {
      $(this).parents().filter('#nd>div').hide();
    }
  });
  $('.ndCustomizeSave').click(function() {
    if ($('.ndCustomizeTextarea').val() === '') return;
    var arr = $('.ndCustomizeTextarea').val().split('\n');
    var savedUrl = GM_getValue('savedUrl', []);
    var host;
    for (var i = 0; i < arr.length; i++) {
      host = arr[i].split('\'')[1];
      if ($.inArray(host, savedUrl) === -1) savedUrl.push(host);
      GM_setValue('savedUrl', savedUrl);
      if (/^\s+$/.test(arr[i]) || arr[i] === '') {
        continue;
      } else if (/^addIRule/.test(arr[i])) {
        GM_setValue('indexRule_' + host, arr[i]);
      } else if (/^addCRule/.test(arr[i])) {
        GM_setValue('chapterRule_' + host, arr[i]);
      } else if (/^chapterRule/.test(arr[i])) {
        GM_setValue('chapterRule_' + host, arr[i]);
      } else if (/^addRRule/.test(arr[i])) {
        GM_setValue('reRule_' + host, arr[i]);
      } else {
        var lineNow = i + 1;
        if (confirm('第' + lineNow + '行增加未知规则。\n此前的规则已经保存，后续操作已停止\n是否打开规则说明网址')) window.open('https://github.com/dodying/UserJs/tree/master/novel/novelDownloader#自定义站点规则说明');
        return;
      }
    }
  });
  $('.ndCustomizeDelete').click(function() {
    var host = prompt('请输入要删除的域名\n不分大小写...\n如：\nread.qidian.com', location.host);
    if (host === '') return;
    var savedUrl = GM_getValue('savedUrl', []);
    if ($.inArray(host, savedUrl) <= 0) return;
    savedUrl.splice($.inArray(host, savedUrl), 1);
    var RE = new RegExp('_' + host + '$', 'i');
    var savedValue = GM_listValues();
    for (var i = 0; i < savedValue.length; i++) {
      if (RE.test(savedValue[i])) GM_deleteValue(savedValue[i]);
    }
  });
  $('.ndCustomizeClear').click(function() {
    if (confirm('谨慎操作\n你确定要清空自定义站点规则\n你确定要清空自定义站点规则\n你确定要清空自定义站点规则')) {
      GM_setValue('savedUrl', []);
      var savedValue = GM_listValues();
      var RE = new RegExp('^indexRule_|^chapterRule_|^reRule_', 'i');
      for (var i = 0; i < savedValue.length; i++) {
        if (RE.test(savedValue[i])) GM_deleteValue(savedValue[i]);
      }
    }
  });
}
//////////////////////////////////////////////////////以下为函数

function addIRule(host, cn, name, chapter, vip, sort, thread) { //增加站点目录规则
  var cnT = cn || '';
  var vipT = vip || '';
  var sortT = sort || false;
  var threadT = thread || false;
  indexRule[host] = {
    cn: cnT,
    name: name,
    chapter: chapter,
    vip: vipT,
    sort: sortT,
    thread: threadT
  };
}

function addCRule(host, name, content, MimeType) { //增加站点章节规则
  MimeType = (MimeType === 1) ? 'text/html; charset=gb2312' : '';
  chapterRule[host] = {
    name: name,
    content: content,
    MimeType: MimeType
  };
}

function addRRule(host, ...args) { //增加站点替换规则
  reRule[host] = args;
}

function wordFormatSpecial(host, word) { //文本处理-特殊版
  var regexp, str, reStr;
  for (var i = 0; i < reRule[host].length; i++) {
    str = reRule[host][i].split('|||');
    reStr = (str.length === 1) ? '' : str[1];
    regexp = new RegExp(str[0], 'gi');
    word = word.replace(regexp, reStr);
  }
  return word;
}

function downloadTo(bookName, fileType) { //下载到...
  if (fileType === 'zip') {
    download2Zip(bookName);
  } else if (fileType === 'txt') {
    download2Txt(bookName);
  } else if (fileType === 'epub') {
    download2Epub(bookName);
  } else if (fileType === 'test') {
    var all = bookName + '\n\n';
    for (var i = 0; i < $(window).data('dataDownload').length; i++) {
      all += $(window).data('dataDownload')[i].name + '\r\n' + $(window).data('dataDownload')[i].content + '\r\n\r\n';
    }
    $('.ndTestArea>textarea').text(all);
    $('.ndTestArea').show();
    removeData();
    $('.ndTestArea>textarea').focus();
  }
}

function download(fileType) { //下载
  var host = location.host;
  var chapter = $(indexRule[host].chapter);
  var bookName = $(indexRule[host].name).eq(0).text().trim() || document.title;
  bookName = bookName.replace(/在线|阅读|全文|最新|章节|目录|列表|无弹窗|更新|全集|下载/g, '').trim();
  if (fileType === 'epub') getCover(bookName);
  var i;
  if ($('#ndVip')[0].checked === false && indexRule[host].vip !== '') chapter = $(chapter).not($(indexRule[host].vip));
  if ($('.ndSplitInput').val() !== '') {
    $(chapter).each(function() {
      this.added = false;
    });
    var arr = $('.ndSplitInput').val().split(',');
    arr.sort();
    var chapterNew = [];
    for (i = 0; i < arr.length; i++) {
      if (/^\d+\-\d+$/.test(arr[i])) {
        var start = arr[i].replace(/^(\d+)\-\d+$/, '$1') - 1;
        var end = arr[i].replace(/^\d+\-(\d+)$/, '$1') - 1;
        for (var j = start; j <= end; j++) {
          if (!chapter[j].added) {
            chapter[j].added = true;
            chapterNew.push(chapter[j]);
          }
        }
      } else if (/^\d+$/.test(arr[i])) {
        if (!chapter[arr[i] - 1].added) {
          chapter[arr[i] - 1].added = true;
          chapterNew.push(chapter[arr[i] - 1]);
        }
      }
    }
    chapter = chapterNew;
  }
  if (indexRule[host].sort) chapter.sort(objArrSort('href'));
  chapter = $.makeArray(chapter);
  if ($(window).data('chapter') !== undefined && chapter.toString() === $(window).data('chapter').toString()) {
    downloadTo(bookName, fileType);
    return;
  }
  $('.ndLog').css('display', 'block');
  $('.ndLogDiv').html('');
  $(window).data({
    'fileType': fileType,
    'chapter': chapter,
    'dataDownload': [],
    'downloadList': [],
    'downloadNow': {},
    'number': 0,
    'numberOk': 0
  });
  $(window).data('downloadNow').length = 0;
  var href, name, dataDownload;
  for (i = 0; i < chapter.length; i++) {
    if (chapter[i].tagName === 'OPTION') {
      href = location.origin + chapter[i].value;
    } else {
      href = chapter[i].href || chapter[i];
    }
    name = (chapter[i].innerText) ? chapter[i].innerText.replace(/^\d+\-/, '') : '';
    dataDownload = {};
    dataDownload.url = href;
    dataDownload.name = name;
    dataDownload.error = 0;
    dataDownload.timeout = 0;
    dataDownload.ok = false;
    $(window).data('dataDownload')[i] = dataDownload;
    $(window).data('downloadList')[i] = href;
  }
  $('.bookDownladerProgress').val(0).attr('max', chapter.length);
  $('.bookDownladerChapter').html('0');
  $('.bookDownladerChapterAll').html(chapter.length);
  var addTask = setInterval(function() {
    if (chapterRule[host].Deal instanceof Function) {
      downloadTask(chapterRule[host].Deal);
    } else {
      downloadTask(xhr);
    }
  }, 200);
  var downloadCheck = setInterval(function() {
    if (downloadedCheck($(window).data('dataDownload')) && ($(window).data('fileType') !== 'epub' || !GM_getValue('image', false) || typeof $(window).data('img') === 'undefined' || $(window).data('img').ok)) {
      clearInterval(addTask);
      clearInterval(downloadCheck);
      if ($('#ndBtn').length === 0) $('.ndLog').append('<button id="ndBtn">下载</button>');
      downloadTo(bookName, fileType);
    }
  }, 200);
}

function downloadTask(fun) { //下载列队
  var thread = (indexRule[location.host].thread) ? indexRule[location.host].thread : parseInt($('.ndThread').val()) || 10;
  for (var i in $(window).data('downloadNow')) {
    if (!/^\d+$/.test(i)) continue;
    if ($(window).data('downloadNow')[i].ok) {
      delete $(window).data('downloadNow')[i];
      $(window).data('downloadNow').length--;
      continue;
    }
    if (!$(window).data('downloadNow')[i].downloading) {
      var href = $(window).data('downloadNow')[i].href;
      $(window).data('downloadNow')[i].downloading = true;
      addDownloadLogStart(parseInt(i) + 1, href, '开始');
      //if ($('.ndLogDiv>.ndStatusOk').length >= 30) $('.ndLogNow').click();
      fun(i, href);
    }
  }
  if ($(window).data('downloadNow').length < thread && $(window).data('downloadList').length !== 0) {
    var temp = {};
    temp.href = $(window).data('downloadList')[0];
    temp.ok = false;
    temp.downloading = false;
    $(window).data('downloadNow')[$(window).data('number')] = temp;
    $(window).data('downloadList').splice(0, 1);
    $(window).data('downloadNow').length++;
    $(window).data('number', $(window).data('number') + 1);
    downloadTask(fun);
  } else {
    return;
  }
}

function removeData() { //移除数据
  $(window).removeData(['downloadNow',
    'downloadList',
    'number',
    'check',
    'urlRule',
    'numberOk',
    'img'
  ]);
}

function xhr(num, url) { //xhr
  var host = getHostName(url);
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    overrideMimeType: chapterRule[host].MimeType,
    timeout: parseFloat($('.ndTime').val()) * 1000,
    onload: function(response) {
      if (debug.response) console.log(response.response);
      var data = $($.parseHTML(response.response));
      if (debug.data) console.log(data);
      var name, content;
      if ($(window).data('autoTry') && !$(window).data('autoTryResult')) {
        var i;
        var testContent = chapterRule[host].content.split(',');
        for (i = 0; i < testContent.length; i++) {
          if ($(testContent[i], data).length > 0) break;
        }
        testContent = i === testContent.length ? chapterRule[host].content : testContent[i];
        console.log('通用规则-content: ', testContent);
        var _content = GM_getValue('_content', {});
        _content[testContent] = testContent in _content ? _content[testContent]++ : 1;
        GM_setValue('_content', _content);
        chapterRule[host].content = testContent;
        $(window).data('autoTryResult', true);
      }
      name = $(window).data('dataDownload')[num].name ||
        $(chapterRule[host].name, data).eq(0).text() ||
        data.filter(function(i) {
          return i.tagName === 'TITLE';
        })[0].textContent;
      content = $(chapterRule[host].content, data);
      if (content.length === 0) {
        content = $('<div class="ndFinder" name="' + num + '"></div>').append(data).appendTo('.ndFinderArea');
        content = content.find(chapterRule[host].content);
        $('.ndFinder[name="' + num + '"]').remove();
      }
      if (content.length > 0) {
        var raw = content;
        content = content.html();
        if ($('#ndImage')[0].checked && $(window).data('fileType') === 'epub' && raw.find('img').length > 0) {
          if (!$(window).data('img')) {
            $(window).data('img', {
              ing: 0,
              ok: false
            });
            var downloadImg = setInterval(function() {
              var img = $(window).data('img');
              for (var i in img) {
                if (img.ing >= 10) return;
                if (i === 'ing' || i === 'ok' || img[i].data) continue;
                downloadImage(img[i].url, img[i].num, img[i].i);
                img.ing++;
                $(window).data('img', img);
              }
              if (downloadedCheck($(window).data('dataDownload')) && img.ing === 0) {
                clearInterval(downloadImg);
                img.ok = true;
                $(window).data('img', img);
              }
            }, 800);
          }
          raw.find('img').each(function(i) {
            threadImg(this.src, num, i);
          });
        }
      } else {
        content = response.response;
      }
      if (reRule[host] instanceof Array) content = wordFormatSpecial(host, content);
      thisDownloaded(num, name, content);
    },
    ontimeout: function() {
      $(window).data('dataDownload')[num].timeout++;
      if (parseInt($('.ndTimeout').val()) > $(window).data('dataDownload')[num].timeout) {
        xhr(num, url);
      } else {
        var nameTrue = $(window).data('dataDownload')[num].name || num;
        thisDownloaded(num, nameTrue, '下载超时，原因：可能是网络问题。by novelDownloader');
        $(window).data('dataDownload')[num].ok = 'timeout';
      }
    },
    onerror: function() {
      $(window).data('dataDownload')[num].error++;
      if (parseInt($('.ndError').val()) > $(window).data('dataDownload')[num].error) {
        xhr(num, url);
      } else {
        var nameTrue = $(window).data('dataDownload')[num].name || num;
        thisDownloaded(num, nameTrue, '下载失败，原因：可能是服务器问题。by novelDownloader');
        $(window).data('dataDownload')[num].ok = 'error';
      }
    }
  });
}

function thisDownloaded(num, name, content) { //下载完成，包括文本处理-通用版、简繁体转换
  if (!name) name = $(window).data('dataDownload')[num].name;
  if ($('#ndFormat')[0].checked === true) content = wordFormat(content, $(window).data('fileType') === 'epub');
  if ($('#ndSection')[0].checked === true && $(window).data('fileType') !== 'epub') content = wordSection(content);
  content = '来源地址：' + $(window).data('dataDownload')[num].url + '\r\n' + content;
  name = tranStr(name, $('.ndLang:checked').val() * 1);
  content = tranStr(content, $('.ndLang:checked').val() * 1);
  $(window).data('dataDownload')[num].name = name.trim();
  $(window).data('dataDownload')[num].content = content;
  $(window).data('dataDownload')[num].ok = true;
  $(window).data('downloadNow')[num].ok = true;
  $(window).data('numberOk', $(window).data('numberOk') + 1);
  $('.bookDownladerChapter').html($(window).data('numberOk'));
  $('.bookDownladerProgress').val($(window).data('numberOk'));
}

function threadImg(url, num, i) {
  var img = $(window).data('img');
  img[num + '_' + i] = {
    url: url,
    num: num,
    i: i
  };
  $(window).data('img', img);
}

function downloadImage(url, num, i) {
  var name = num + '_' + i;
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer',
    timeout: 10000,
    onload: function(response) {
      var type = response.responseHeaders.match(/Content-Type: (.*?)[\r\n]/gi)[1];
      var img = $(window).data('img');
      img[name].data = new Blob([response.response], {
        type: type
      });
      img.ing--;
      $(window).data('dataDownload')[num].content = $(window).data('dataDownload')[num].content.replace(img[name].url, name + '.jpg');
      $(window).data('img', img);
    },
    ontimeout: function() {
      downloadImage(url, num, i);
    },
    onerror: function() {
      if (confirm('一张图片下载错误，请检查\n网络是否正常，或是否网站地址错误\n图片地址: ' + url + '\n是否重试下载\n是则在5秒后重新发送下载请求')) {
        setTimeout(function() {
          downloadImage(url, num, i);
        }, 5000);
      } else {
        var img = $(window).data('img');
        img[name].data = true;
        img.ing--;
        $(window).data('img', img);
      }
    }
  });
}

function wordFormat(word, isEpub) { //文本处理-通用版
  var replaceLib = [
    /*替换前的文本|||替换后的文本*/
    /*换行符请先用【换行】二字代替，最后同一替代*/
    /*请在最前方插入*/
    '&lt;|||<',
    '&gt;|||>',
    '&nbsp;||| ',
    '&amp;|||&',
    '&quot;|||"',
    '&quot;|||"',
    '&.*?;||| ',
    '上一页',
    '返回目录',
    '下一页',
    '无弹窗广告',
    '手机阅读本章.*',
    '本书最新TXT下载.*',
    '为了方便下次阅读.*',
    '<h\\d+>',
    '</h\\d+>',
    '<table.*?>',
    '<head>.*?</head>',
    '<select.*?>.*?</select>',
    '<div id="nd">.*</div>',
    '<br.*?>|||换行',
    '<p.*?>|||换行',
    '</p>|||换行',
    '<!--.*?-->',
    '<code>.*?</code>',
    '<span style="display:none">.*?</span>',
    '<a.*?>',
    '</a>',
    '<div.*?>',
    '</div>',
    '<center.*?>.*?</center>|||换行',
    '<style.*?>.*?</style>|||换行',
    '<script.*?>.*?</script>|||换行',
    '<ul.*?>.*?</ul>',
    //'[a-z]+=".*?"',
    '</?[a-z]+(\\s+)?>|||换行',
    '《》',
    '换行|||\r\n',
    '[\r\n]+|||\r\n　　',
    '[\r\n]+\\s+[\r\n]+|||\r\n',
    '[\r\n]+\\s+|||\r\n　　',
    '[\r\n]+\\s+。|||。',
    '^\\s+',
    '\\s+$'
  ];
  var regexp, str, reStr;
  if (isEpub) word = word.replace(/<\/img>/g, '').replace(/<img(.*?)>/g, '【图片$1】');
  for (var i = 0; i < replaceLib.length; i++) {
    str = replaceLib[i].split('|||');
    reStr = (str.length === 1) ? '' : str[1];
    regexp = new RegExp(str[0], 'gi');
    if (debug.replace) console.log(regexp, reStr, word);
    word = word.replace(regexp, reStr);
  }
  if (isEpub) word = word.replace(/【图片(.*?)】/g, '<img$1></img>');
  word = '　　' + word;
  return word;
}

function wordSection(word) { //文本强制分段-测试功能
  var symbol = {
    'lineEnd': '。？！”」』', //句子结尾
    'lineStart': '“「『', //句子开头
    'unbreak': '…，、—（）()·《 》〈 〉．_；： 　', //不包括作为句子开头的标点 //作用是找到【需要断句的标点】后，不断判断之后的字符是否为标点，是则继续找，不是则断句
  };
  var reLineEnd = new RegExp('[' + symbol.lineEnd + ']');
  var reLineStart = new RegExp('[' + symbol.lineStart + ']');
  var reUnbreak = new RegExp('[' + symbol.unbreak + ']');
  var arr = word.split(/[\r\n]/);
  var lastIndex, lastWord, i, j;
  for (i = 0; i < arr.length; i++) {
    if (arr[i].length <= 30) continue;
    var arrNew = arr[i].split('');
    for (j = 1; j < arrNew.length; j++) {
      lastIndex = -1;
      lastWord = arrNew[j - 1].substr(lastIndex, 1); //查找上一个元素的最后一个字符
      while ((lastWord === ' ' || lastWord === '　') && lastIndex >= 0) { //最后一个字符如果是空格，继续往前查找，直到找到真正的字符
        lastIndex--;
        lastWord = arrNew[j - 1].substr(lastIndex, 1);
      }
      if (reUnbreak.test(arrNew[j]) || reLineEnd.test(arrNew[j]) || (!reLineEnd.test(lastWord) && !reLineStart.test(arrNew[j]))) {
        arrNew[j - 1] += arrNew[j];
        arrNew.splice(j, 1);
        j--;
      }
    }
    arr.splice(i, 1);
    for (j = 0; j < arrNew.length; j++) {
      arr.splice(i, 0, arrNew[j]);
      i++;
    }
  }
  return arr.join('\r\n').replace(/\r\n\s+/g, '\r\n').replace(/[\r\n]+/g, '\r\n　　');
}

function addDownloadLogStart(num, url, status) { //下载进度-开始
  $('.ndLogDiv').append('<span id="ndLogDiv_' + num + '">' + num + ' <a href="' + url + '" target="_blank">' + num + '</a> ' + status + '<br/></span>');
}

function addDownloadLogEnd(num, name, url, status, addclass) { //下载进度-结束
  $('#ndLogDiv_' + num).html(num + ' <a href="' + url + '" target="_blank">' + name + '</a> ' + status + '<br/>').addClass('ndStatus' + addclass);
}

function download2Zip(name) { //下载到1个zip
  $(window).data('blob', new JSZip());
  var leng = String($(window).data('dataDownload').length).length;
  for (var i = 0; i < $(window).data('dataDownload').length; i++) {
    var num = i + 1;
    $(window).data('blob').file(String(preZeroFill(num, leng)) + '-' + $(window).data('dataDownload')[i].name + '.txt', $(window).data('dataDownload')[i].name + '\r\n' + $(window).data('dataDownload')[i].content);
  }
  $(window).data('blob').file('###说明文件.txt', '本压缩包由用户脚本novelDownloader制作');
  $(window).data('blob').generateAsync({
    type: 'blob'
  }).then(function(content) {
    $('#ndBtn').click(function() {
      saveAs(content, name + '.zip');
    });
    saveAs(content, name + '.zip');
  });
  removeData();
}

function download2Epub(name) { //下载到1个epub
  var leng = String($(window).data('dataDownload').length).length;
  var uuid = 'nd' + new Date().getTime().toString();
  $(window).data('blob', new JSZip());
  $(window).data('blob').file('mimetype', 'application/epub+zip');
  var META_INF = $(window).data('blob').folder('META-INF');
  META_INF.file('container.xml', '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles></container>');
  var OEBPS = $(window).data('blob').folder('OEBPS');
  OEBPS.file('stylesheet.css', '' +
    'body{padding:0%;margin-top:0%;margin-bottom:0%;margin-left:1%;margin-right:1%;line-height:130%;text-align:justify}' +
    'div{margin:0px;padding:0px;line-height:130%;text-align:justify}' +
    'p{text-align:justify;text-indent:2em;line-height:130%}' +
    'h1{line-height:130%;text-align:center;font-weight:bold;font-size:xx-large}' +
    'h2{line-height:130%;text-align:center;font-weight:bold;font-size:x-large}' +
    'h3{line-height:130%;text-align:center;font-weight:bold;font-size:large}');
  var lang = (parseInt($('.ndLang:checked').val()) === 0) ? 'zh-CN' : 'zh-TW';
  var content_opf = '<?xml version="1.0" encoding="UTF-8"?><package version="2.0" unique-identifier="' + uuid + '" xmlns="http://www.idpf.org/2007/opf"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf"><dc:title>' + name + '</dc:title><dc:creator>novelDownloader</dc:creator><dc:identifier id="' + uuid + '">urn:uuid:' + uuid + '</dc:identifier><dc:language>' + lang + '</dc:language><meta name="cover" content="cover-image" /></metadata><manifest>';
  var toc_ncx = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="urn:uuid:' + uuid + '"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>' + name + '</text></docTitle><navMap><navPoint id="navpoint-1" playOrder="1"><navLabel><text>首页</text></navLabel><content src="title.html"/></navPoint>';
  var item = '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="cover" href="title.html" media-type="application/xhtml+xml"/><item id="css" href="stylesheet.css" media-type="text/css"/>';
  var itemref = '<itemref idref="cover" linear="yes"/>';
  var i;
  for (i = 0; i < $(window).data('dataDownload').length; i++) {
    var _name = String(preZeroFill(i + 1, leng));
    var playOrder = i + 2;
    toc_ncx += '<navPoint id="chapter' + _name + '" playOrder="' + playOrder + '"><navLabel><text>' + $(window).data('dataDownload')[i].name + '</text></navLabel><content src="' + _name + '.html"/></navPoint>';
    item += '<item id="chapter' + _name + '" href="' + _name + '.html" media-type="application/xhtml+xml"/>';
    itemref += '<itemref idref="chapter' + _name + '" linear="yes"/>';
    OEBPS.file(_name + '.html', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>' + $(window).data('dataDownload')[i].name + '</title><link type="text/css" rel="stylesheet" media="all" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h3>' + $(window).data('dataDownload')[i].name + '</h3><div><p>' + $(window).data('dataDownload')[i].content.replace(/\r\n/g, '</p><p>') + '</p></div></body></html>');
  }
  var img = $(window).data('img');
  for (i in img) {
    if (i === 'ing' || i === 'ok') continue;
    item += '<item id="img' + i + '" href="' + i + '.jpg" media-type="image/jpeg"/>';
    OEBPS.file(i + '.jpg', img[i].data);
  }
  content_opf = content_opf + item + '<item id="cover-image" href="cover.jpg" media-type="image/jpeg"/></manifest><spine toc="ncx">' + itemref + '</spine><guide><reference href="title.html" type="cover" title="Cover"/></guide></package>';
  toc_ncx += '</navMap></ncx>';
  OEBPS.file('content.opf', content_opf);
  OEBPS.file('toc.ncx', toc_ncx);
  OEBPS.file('title.html', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>' + name + '</title><link type="text/css" rel="stylesheet" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h1>' + name + '</h1><h2>本电子书由用户脚本novelDownloader制作</h2></body></html>');
  OEBPS.file('cover.jpg', $(window).data('cover'));
  $(window).data('blob').generateAsync({
    type: 'blob'
  }).then(function(content) {
    $('#ndBtn').click(function() {
      saveAs(content, name + '.epub');
    });
    saveAs(content, name + '.epub');
  });
  removeData();
}

function download2Txt(name) { //下载到1个txt
  var all = '';
  for (var i = 0; i < $(window).data('dataDownload').length; i++) {
    all += $(window).data('dataDownload')[i].name + '\r\n' + $(window).data('dataDownload')[i].content + '\r\n\r\n';
  }
  all = '阅读前说明：本书籍由用户脚本novelDownloader制作\r\n\r\n' + all;
  $(window).data('blob', new Blob([all], {
    type: 'text/plain;charset=utf-8'
  }));
  $('#ndBtn').click(function() {
    saveAs($(window).data('blob'), name + '.txt');
  });
  saveAs($(window).data('blob'), name + '.txt');
  removeData();
}

function downloadedCheck(arr) { //检查下载是否完成
  var undownload = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].ok === true) {
      addDownloadLogEnd(parseInt(i) + 1, arr[i].name, arr[i].url, '成功', 'Ok');
    } else if (arr[i].ok === 'error') {
      addDownloadLogEnd(parseInt(i) + 1, arr[i].name, arr[i].url, '失败', 'Error');
    } else if (arr[i].ok === 'timeout') {
      addDownloadLogEnd(parseInt(i) + 1, arr[i].name, arr[i].url, '超时', 'Timeout');
    } else {
      undownload++;
    }
  }
  return (undownload === 0) ? true : false;
}

function getHostName(url) { //获取网址域名
  return (/^http(s|):\/\//.test(url)) ? url.split('/')[2] : url.split('/')[0];
}

function preZeroFill(num, size) { //用0补足指定位数，来自https://segmentfault.com/q/1010000002607221，作者：captainblue与solar
  if (num >= Math.pow(10, size)) { //如果num本身位数不小于size位
    return num.toString();
  } else {
    var _str = Array(size + 1).join('0') + num;
    return _str.slice(_str.length - size);
  }
}

function objArrSort(key) {
  return function(obj1, obj2) {
    var value1 = obj1[key].match(/\d+/g);
    var value2 = obj2[key].match(/\d+/g);
    if (value1 === null || value2 === null) return 0;
    value1 = value1[value1.length - 1] * 1;
    value2 = value2[value2.length - 1] * 1;
    if (value2 < value1) {
      return 1;
    } else if (value2 > value1) {
      return -1;
    } else {
      return 0;
    }
  };
}

function getCover(txt) {
  var fontSize = 20;
  var width = 180;
  var height = 240;
  var color = '#000';
  var lineHeight = 10;
  ///////////
  var maxlen = width / fontSize - 2;
  var txtArray = txt.split(new RegExp('(.{' + maxlen + '})'));
  var i = 1;
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  var context = canvas.getContext('2d');
  context.fillStyle = color;
  context.strokeRect(0, 0, width, height);
  context.font = fontSize + 'px sans-serif';
  context.textBaseline = 'top';
  var fLeft, fTop;
  for (var j = 0; j < txtArray.length; j++) {
    if (txtArray[j] === '') continue;
    fLeft = fontSize * ((maxlen - txtArray[j].length) / 2 + 1);
    fTop = fontSize / 4 + fontSize * i + lineHeight * i;
    context.fillText(txtArray[j], fLeft, fTop, canvas.width);
    context.fillText('\n', fLeft, fTop, canvas.width);
    i++;
  }
  canvas.toBlob(function(blob) {
    $(window).data('cover', blob);
  });
}
