// ==UserScript==
// @name        novelDownloader
// @name:zh-CN  小说下载
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description novelDownloaderHelper，press key "shift+d" to show up.
// @description:zh-CN 小说下载器，按“Shift+D”来显示面板
// @version     1.230.202
// @connect     files.qidian.com
// @connect     a.heiyan.com
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @require     http://cdn.bootcss.com/jszip/3.0.0/jszip.min.js
// @require     https://greasyfork.org/scripts/21541-chs2sht/code/chs2sht.js?version=137286
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
//              正版
// @include     http://read.qidian.com/BookReader/*.aspx
// @include     http://vipreader.qidian.com/BookReader/vip,*,*.aspx
// @include     http://free.qidian.com/Free/ChapterList.aspx?bookId=*
// @include     http://www.qdmm.com/BookReader/*.aspx
// @include     http://chuangshi.qq.com/bk/*/*-*.html
// @include     http://yunqi.qq.com/bk/*/*-*.html
// @include     http://dushu.qq.com/intro.html?bid=*
// @include     http://book.tianya.cn/html2/dir.aspx?bookid=*
// @include     http://book.tianya.cn/chapter-*-*
// @include     http://www.hbooker.com/book/book_detail?book_id=*
// @include     http://www.hbooker.com/chapter/get_chapter_list?book_id=*
// @include     http://www.hbooker.com/chapter/book_chapter_detail?chapter_id=*
// @include     http://www.3gsc.com.cn/bookreader/*
// @include     http://book.zongheng.com/showchapter/*
// @include     http://book.zongheng.com/chapter/*/*
// @include     http://huayu.baidu.com/showchapter/*
// @include     http://huayu.baidu.com/chapter/*/*
// @include     http://www.17k.com/list/*
// @include     http://www.17k.com/chapter/*/*
// @include     http://www.8kana.com/book/*
// @include     http://www.8kana.com/read/*
// @include     http://www.heiyan.com/book/*/*
// @include     http://b.faloo.com/f/*
// @include     http://b.faloo.com/p/*/*
// @include     http://www.jjwxc.net/onebook.php?novelid=*
// @include     http://www.xxsy.net/books/*/*
// @include     http://book.zhulang.com/*
// @include     http://novel.hongxiu.com/a/*/*
// @include     http://www.readnovel.com/book/*
// @include     http://www.xs8.cn/book/*/*
// @include     http://book.hjsm.tom.com/*/c*.html
// @include     http://www.kanshu.com/files/article/html/*
// @include     http://book.weibo.com/weibobook/book/*
// @include     http://book.weibo.com/book/play/*-*.html
// @include     http://www.lcread.com/bookpage/*/*
// @include     http://www.motie.com/book/*
// @include     http://www.shuhai.com/read/*
// @include     http://www.xiang5.com/booklist/*
// @include     http://www.xiang5.com/content/*/*
// @include     http://read.fmx.cn/files/article/html/*
// @include     http://novel.feiku.com/*/*
// @include     http://www.abada.com/Book/*/*
// @include     http://www.kujiang.com/book/*/*
// @include     http://www.tadu.com/book/catalogue/*
// @include     http://www.tadu.com/book/*/*/
// @include     http://yuedu.163.com/newBookReader.do?operation=catalog&sourceUuid=*
// @include     http://yuedu.163.com/book_reader/*/*
//              轻小说
// @include     http://www.wenku8.com/novel/*/*/*
// @include     http://book.sfacg.com/Novel/*
// @include     http://xs.dmzj.com/*/*/*
// @include     http://www.yidm.com/article/html/*/*/*
//              盗贴
// @include     http://www.23wx.com/html/*
// @include     http://www.biquge.la/book/*
// @include     http://www.shumilou.co/*/
// @include     http://www.quledu.com/wcxs-*/
// @include     http://www.mangg.com/id*
// @include     http://www.23zw.com/olread/*/*/*
// @include     http://www.31wxw.com/*/*/*
// @include     http://www.520xs.la/*/*
// @include     http://www.biquge.com/*_*/*
// @include     http://www.69shu.com/*
// @include     http://www.biquku.com/*
// @include     http://www.5ccc.net/xiaoshuo/*
// @include     http://www.aiquxs.com/read/*/*/*
// @include     http://www.2kxs.com/xiaoshuo/*
// @include     http://www.mianhuatang.la/*/*
// @include     http://www.suimengxiaoshuo.com/*
// @include     http://www.suimeng.la/files/article/html/*
// @include     http://www.00ksw.com/html/*
// @include     http://www.wangshuge.com/books/*
// @include     http://tt.71wx.net/xiaoshuo/*/*
// @include     http://www.71wx.net/xiaoshuo/*/*
// @include     http://www.kuaidu.cc/*/
// @include     http://www.vodtw.com/Html/Book/*/*/*
// @include     http://www.sqsxs.com/book/*
// @include     http://www.dashubao.co/book/*/*/*
// @include     http://www.qingdou.cc/chapter_*.html
// @include     http://www.aszw520.com/book/*
// @include     http://www.abcsee.net/book/*/*/*
// @include     http://www.bxwx.cc/*/*/*
// @include     http://www.uecg.net/html/*/*/*
// @include     http://www.5du5.com/book/*
// @include     http://www.klxsw.com/files/article/html/*/*/*
// @include     http://www.3gxs.com/html/*/*/*
// @include     http://www.baoliny.com/*/*
// @include     http://www.dhzw.com/book/*
// @include     http://www.bxwx8.org/b/*/*/*
// @include     http://www.dajiadu.net/files/article/html/*/*/*
// @include     http://www.3dllc.com/html/*
// @include     http://www.llwx.net/*_*/*
// @include     http://www.paoshuba.cc/Partlist/*
// @include     http://www.qmshu.com/html/*
// @include     http://www.gdsanlian.com/html/*
// @include     http://www.xinsiluke.com/book/*
// @include     http://www.zhuzhudao.com/txt/*
// @include     http://www.fqxsw.com/book/*
// @include     http://www.baquge.com/files/article/html/*/*/*
// @include     http://www.bookabc.net/*
// @include     http://www.13xs.com/xs/*/*/*
// @include     http://www.1xiaoshuo.com/*
// @include     http://www.daomengren.com/*_*/*
// @include     http://www.xs84.me/*_*/
// @include     http://www.15cy.com/*/*/*
// @include     http://www.zhaifans.com/novel-*-*.html
// @include     http://www.ranwen.org/files/article/*
// @include     http://www.773buy.com/html/*
// @include     http://www.00sy.com/xiaoshuo/*
// @include     http://www.qingkan520.com/book/*
// @include     http://www.xiaoxiaoshuwu.com/read/*
// @include     http://www.xiaoxiaoshuwu.com/shtml/*/*/*
// @include     http://www.99shumeng.org/shu/*/*/*
// @include     http://www.bookbao.net/views/*/*/*
// @include     http://www.bookbao.net/book/*/*/*
// @include     http://www.sto.cc/*-*/
// @include     http://www.shouda8.com/*
// @include     http://www.shumilou.net/*/*/
// @include     http://www.64mi.com/book/*/*/
// @include     http://www.zhuzhudao.cc/*_*/*
// @include     http://www.wanshuba.com/Html/*
// @include     http://www.bqxs.com/book/*
// @include     http://www.6yzw.com/*_*/*
// @include     http://www.daomengren.com/*_*/*
// @include     http://www.muyuge.net/*_*/*
// @include     http://www.zaiduu.com/zaidu*/*
// @include     http://www.00xs.cc/xiaoshuo/*/*/
// @include     http://www.musemailsvr.com/*
// @include     http://www.lewenwu.com/books/*/*/*
// @include     http://www.50zw.co/book_*/*
// @include     http://www.xiangcunxiaoshuo.com/html/*
// @include     http://www.lwxs520.com/books/*
// @include     http://www.scwzw.net/SC/*
// @include     http://www.yunlaige.com/html/*
// @include     http://www.cfwx.net/files/article/html/*
// @include     http://www.qiuwu.net/html/*
// @include     http://www.33yq.com/read/*
// @include     http://www.du00.cc/read/*
// @include     http://www.xs74.com/novel/*
// @include     http://www.fhxs.com/read/*
// @include     http://www.snwx.com/book/*
// @include     http://www.yawen8.com/dushi/*
// @include     http://www.7dsw.com/book/*
// @include     http://www.bookgew.com/Html/Book/*
// @include     http://www.79xs.com/Html/Book/*
// @include     http://www.shuhaha.com/Html/Book/*
// @include     http://www.xiaoshuo2016.com/*
// @include     http://www.ttzw.com/book/*
// @include     http://www.shenmabook.com/ml-*/
// @include     http://www.fkzww.com/Html/Book/*
// @include     http://www.151kan.com/kan/*
// @include     http://www.shuotxts.com/*
// @include     http://www.doulaidu.com/xs/*
// @include     http://www.kanshu.la/book/*
// @include     http://www.kanunu8.com/files/*
// @include     http://www.hkxs99.net/*
// @include     http://paitxt.com/*
// @include     http://www.shunong.com/*
// @include     http://www.yqhhy.cc/*
// @include     http://www.wenchangshuyuan.com/xiaoshuo/*
// @include     http://xiaoshuokan.com/haokan/*
// @include     http://www.xs222.com/html/*
// @include     http://www.bjxiaoshuo.com/files/article/html/*
// @include     http://www.59shuku.com/book/*
// @include     http://www.tlxsw.com/files/article/html/*
// @include     http://www.92zw.com/files/article/html/*
// @include     http://www.d8qu.com/html/*
// @include     http://www.zhuaji.org/read/*/*
// @include     http://www.7kshu.com/*/*/*
// @include     http://www.luoqiu.com/read/*/*
// @include     http://www.podlook.com/*.shtml
// @include     http://www.630book.cc/shu/*.html
// @include     http://www.vv44.net/novel/*
// @include     http://www.88dushu.com/xiaoshuo/*
// @include     http://www.23us.cc/html/*
// @include     http://www.chinaliangzhu.com/*.shtml
// @include     http://www.wenxuemm.com/book/*
// @include     http://www.chuanyue8.com/files/article/html/*
// @include     http://www.biquguan.com/bqg*/*
// @include     http://www.1kanshu.cc/files/article/html/*
// @include     http://www.5800.cc/5200/*
// @include     http://www.xiaoyanwenxue.com/xs/*
// @include     http://www.cmxsw.com/files/article/html/*
// @include     http://www.dushuge.net/html/*
// @include     http://www.qianrenge.net/book/*
// @include     http://www.bookba.net/mulu-*-list.html
// @include     http://www.bookba.net/read-*-chapter-*.html
// @include     http://www.360118.com/html/*
// @include     http://www.59tto.com/files/article/xiaoshuo/*
// @include     http://www.9wh.net/*
// @include     http://www.23txt.com/files/article/html/*
// @include     http://www.book108.com/*
// @include     http://www.5ycn.com/*
// @include     http://www.zbzw.com/*
// @include     http://www.5200zw.com/*
// @include     http://www.uuxiaoshuo.net/html/*
// @include     http://www.chinaisbn.com/*
// @include     http://www.ty2016.net/*
// @include     http://wx.ty2016.net/*
// @include     http://www.my285.com/*
// @include     http://www.5858xs.com/html/*
// @include     http://book.58xs.com/html/*
// @include     http://www.hjwzw.com/Book/Chapter/*
// @include     http://www.hjwzw.com/Book/Read/*
// @include     http://www.8shuw.net/book/*
// @include     http://www.e8zw.com/book/*
// @include     http://www.biquge.tw/*_*/*
// @include     http://www.8535.org/*
// @include     http://www.yfzww.com/Book/*
// @include     http://www.yfzww.com/Read/*
// @include     http://www.lewen8.com/lw*/*
// @include     http://www.lread.net/read/*
// @include     http://www.pbtxt.com/*
// @include     http://www.quanbenba.com/yuedu/*
// @include     http://www.qududu.net/book/*
// @include     http://www.151xs.com/*/chapter/*
//              脚本于Firefox47编写并测试
// @include     http://www.lewenxs.net/files/article/html/*
// @include     http://www.wodexiaoshuo.com/*
// @include     http://www.bashudu.com/book/*.html
// @include     http://www.bashudu.com/read/*.html
// @include     http://bbs.6park.com/bbs4/messages/*.html
// @include     http://bbs.6park.com/bbs4/gmessages/*.html
// @include     http://web.6park.com/classbk/md*.shtml
// @include     http://web.6park.com/classbk/messages/*.html
// @include     http://www.neixiong88.com/xiaoshuo/*/index.html
// include     http://18av.mm-cg.com/novel*
// include     http://18av.mm-cg.com/serch*
// ==/UserScript==
/*
var script = document.createElement('script');
script.src = 'http://libs.baidu.com/jquery/1.9.1/jquery.min.js';
document.head.appendChild(script);
*/
if (GM_getValue('firstRun', true)) {
  alert('使用说明，第一次使用时弹出\n在目录页或是章节页使用。\n按“Shift+D”来显示下载选项。');
  GM_setValue('firstRun', false);
}
var indexRule = new Object();
var chapterRule = new Object();
/*
目录页规则示例
addIRule('域名','网站名称','选择器-小说标题','选择器-章节链接','可省略,选择器-Vip或是要过滤的章节链接','可省略,布尔，是否对章节链接进行排序，限制下载线程数');
章节规则示例
addCRule('域名','选择器-章节标题','选择器-章节内容','数字型,0-简体,1-繁体','可省略,数字型,文档编码,unicode则留空,简体中文则填1');
*/
addIRule('read.qidian.com', '起点主站', '.booktitle>h1', '.box_cont>div.list>ul>li>a', '.box_title:contains(\'VIP\')+.box_cont>div.list>ul>li>a');
chapterRule['read.qidian.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        var name = jQuery('.story_title>h1,.title>h3', response.response).text();
        var content = jQuery('script[src$=".txt"]', response.response);
        if (content.length > 0) {
          chapterRule['read.qidian.com'].Deal2(num, name, content);
        } else {
          content = wordFormat(jQuery('#content', response.response).html());
          content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
          if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
            name = tranStr(name, true);
            content = tranStr(content, true);
          }
          thisDownloaded(num, name, content);
        }
      }
    });
  },
  'Deal2': function (num, name, content) {
    var url = content.attr('src');
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      overrideMimeType: 'text/html; charset=gb2312',
      onload: function (response) {
        content = wordFormat(response.response.replace(/document\.write\(\'(.*)\'\);/, '$1'));
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
};
addIRule('vipreader.qidian.com', '', '.booktitle>h1', '.box_cont>div.list>ul>li>a', '.box_title:contains(\'VIP\')+.box_cont>div.list>ul>li>a');
addCRule('vipreader.qidian.com', '.story_title>h1', '#chaptercontent', 0);
addIRule('free.qidian.com', '起点免费', '.book_title>h2>strong', '#book_box>div>div>ul>li>a');
chapterRule['free.qidian.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    chapterRule['read.qidian.com'].Deal(num, url)
  }
};
addIRule('www.qdmm.com', '起点女生', '.booktitle>h1', 'div.list a', '.box_title:contains(\'VIP\')+.box_cont>div.list>ul>li>a');
chapterRule['www.qdmm.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    chapterRule['read.qidian.com'].Deal(num, url)
  }
};
addIRule('chuangshi.qq.com', '创世中文网', '.title>a>b', 'div.list>ul>li>a', 'div.list:has(span.f900)>ul>li>a');
chapterRule['chuangshi.qq.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        var name = response.response.replace(/[\r\n]/g, '').replace(/.*\<title\>(.*)\<\/title\>.*/, '$1').replace(/.*_(.*)_.*/, '$1');
        var bid = response.response.replace(/[\r\n]/g, '').replace(/.*'bid' : '(\d+)'.*/g, '$1');
        var uuid = response.response.replace(/[\r\n]/g, '').replace(/.*'uuid' : '(\d+)'.*/g, '$1');
        var host = getHostName(url);
        chapterRule['chuangshi.qq.com'].Deal2(host, num, name, bid, uuid);
      }
    });
  },
  'Deal2': function (host, num, name, bid, uuid) {
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
    xhr.onload = function () {
      console.log(xhr)
      content = JSON.parse(xhr.response).Content;
      if (host === 'chuangshi.qq.com') {
        var base = 30;
        var arrStr = new Array();
        var arrText = content.split('\\');
        for (var i = 1, len = arrText.length; i < len; i++) {
          arrStr.push(String.fromCharCode(parseInt(arrText[i], base)));
        }
        content = arrStr.join('');
      }
      temp = wordFormat(jQuery('.bookreadercontent', content).html());
      content = temp;
      content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
      if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
        name = tranStr(name, true);
        content = tranStr(content, true);
      }
      thisDownloaded(num, name, content);
    }
    xhr.send('lang=zhs');
  }
};
addIRule('yunqi.qq.com', '云起书院', '.title>a>b', 'div.list>ul>li>a', 'div.list:has(span.f900)>ul>li>a');
chapterRule['yunqi.qq.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    chapterRule['chuangshi.qq.com'].Deal(num, url);
  }
};
addIRule('dushu.qq.com', '腾讯读书(只支持当前目录页)', 'h3>a', '#chapterList>div>ol>li>a', '#chapterList>div>ol>li:not(:has(span.free))>a');
chapterRule['dushu.qq.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    chapterRule['chuangshi.qq.com'].Deal(num, url);
  }
};
addIRule('book.tianya.cn', '天涯文学(只支持当前目录页)', 'h1>a', 'ul.dit-list>li>a', 'ul.dit-list>li:not(:has(.free))>a');
chapterRule['book.tianya.cn'] = {
  'lang': 0,
  'Deal': function (num, url) {
    if (!jQuery(window).data('firstRun')) {
      jQuery(window).data('firstRun', true);
      unsafeWindow.jQuery('head').append('<script type="text/javascript" src="http://static.tianyaui.com/global/ebook/web/static/js/dropdown_f10ac7c.js"></script>');
    }
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
      onload: function (response) {
        var info = JSON.parse(response.response);
        var name = info.data.curChapterName;
        var content = wordFormat(unsafeWindow.bitcake.dec(info.data.chapterContent));
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
};
addIRule('www.hbooker.com', '欢乐书客', '.hd>h3', '.book-chapter-list>.clearfix>li>a', '.book-chapter-list>.clearfix>li>a:has(.icon-vip)', false, 1);
chapterRule['www.hbooker.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    if (!jQuery(window).data('firstRun')) {
      jQuery(window).data('firstRun', true);
      unsafeWindow.jQuery('head').append('<script type="text/javascript" src="http://www.hbooker.com/resources/js/jquery-plugins/jquery.base64.min.js"></script>');
      jQuery('head').append('<script type="text/javascript" src="http://www.hbooker.com/resources/js/enjs.min.js"></script>');
    }
    var chapterId = url.replace('http://www.hbooker.com/chapter/book_chapter_detail?chapter_id=', '');
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://www.hbooker.com/chapter/ajax_get_session_code',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'http://www.hbooker.com/chapter/book_chapter_detail?chapter_id=' + chapterId,
        'X-Requested-With': 'XMLHttpRequest'
      },
      data: 'chapter_id=' + chapterId,
      onload: function (response) {
        var json = JSON.parse(response.response);
        var accessKey = json.chapter_access_key;
        chapterRule['www.hbooker.com'].Deal2(num, url, accessKey)
      }
    });
  },
  'Deal2': function (num, url, accessKey) {
    var chapterId = url.replace('http://www.hbooker.com/chapter/book_chapter_detail?chapter_id=', '');
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'http://www.hbooker.com/chapter/get_book_chapter_detail_info',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Referer': 'http://www.hbooker.com/chapter/book_chapter_detail?chapter_id=' + chapterId,
        'X-Requested-With': 'XMLHttpRequest'
      },
      data: 'chapter_id=' + chapterId + '&chapter_access_key=' + accessKey,
      onload: function (response) {
        var json = JSON.parse(response.response);
        console.log(json);
        /*以下代码来自http://www.hbooker.com/resources/js/myEncrytExtend-min.js*/
        var s = {
          content: json.chapter_content,
          keys: json.encryt_keys,
          accessKey: accessKey
        }
        var n = s.content;
        var r = s.keys;
        var t = s.keys.length;
        var q = s.accessKey;
        var o = q.split('');
        var m = o.length;
        var k = new Array();
        k.push(r[(o[m - 1].charCodeAt(0)) % t]);
        k.push(r[(o[0].charCodeAt(0)) % t]);
        for (i = 0; i < k.length; i++) {
          n = unsafeWindow.jQuery.base64.decode(n);
          var p = k[i];
          var j = unsafeWindow.jQuery.base64.encode(n.substr(0, 16));
          var f = unsafeWindow.jQuery.base64.encode(n.substr(16));
          var h = CryptoJS.format.OpenSSL.parse(f);
          n = CryptoJS.AES.decrypt(h, CryptoJS.enc.Base64.parse(p), {
            iv: CryptoJS.enc.Base64.parse(j),
            format: CryptoJS.format.OpenSSL
          });
          if (i < k.length - 1) {
            n = n.toString(CryptoJS.enc.Base64);
            n = unsafeWindow.jQuery.base64.decode(n)
          }
        }
        var content = n.toString(CryptoJS.enc.Utf8);
        var name = jQuery(window).data('dataDownload') [num].name;
        content = wordFormat(content);
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
};
addIRule('www.3gsc.com.cn', '3G书城', 'h1>a', '.menu-area>p>a', '.menu-area>p>a:has(span.vip)');
addCRule('www.3gsc.com.cn', 'h1', '.menu-area', 0);
addIRule('book.zongheng.com', '纵横', '.txt>h1', '.chapterBean>a', '.chapterBean>em+a');
addCRule('book.zongheng.com', 'h1>em', '#chapterContent', 0);
addIRule('huayu.baidu.com', '花语女生网', '.book_title>h1', '.chapname>a', '.chapname>a.normal,.chapname:has(em.vip)>a');
addCRule('huayu.baidu.com', '.tc>h2', '.book_con', 0);
addIRule('www.17k.com', '17K', 'h1.Title', 'dl.Volume>dd>a', 'dl.Volume>dd>a:has(img)');
addCRule('www.17k.com', 'h1', '#chapterContentWapper', 0);
addIRule('www.8kana.com', '不可能的世界', 'h2.left', 'li.nolooking>a', 'li.nolooking>a:has(.chapter_con_VIP)');
addCRule('www.8kana.com', 'h2', '.myContent', 0);
addIRule('www.heiyan.com', '黑岩', 'h1.page-title', 'div.bd>ul>li>a', 'div.bd>ul>li>a.isvip');
chapterRule['www.heiyan.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    var urlTrue = 'http://a.heiyan.com/ajax/chapter/content/' + url.replace(/.*\//, '');
    GM_xmlhttpRequest({
      method: 'GET',
      url: urlTrue,
      onload: function (response) {
        var info = JSON.parse(response.response);
        var name = info.chapter.title;
        var content = wordFormat(info.chapter.htmlContent);
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
};
addIRule('b.faloo.com', '飞卢', 'h1.a_24b', '.td_0>a', '.td_0>a[href^="http://b.faloo.com/vip/"]');
addCRule('b.faloo.com', '#title>h1', '#content', 0);
addIRule('www.jjwxc.net', '晋江文学城', 'h1>span', '#oneboolt>tbody>tr>td>span>div>a', '#oneboolt>tbody>tr>td>span>div>a[id^="vip_"]');
addCRule('www.jjwxc.net', 'h2', '.noveltext', 0, 1);
addIRule('www.xxsy.net', '潇湘书院', '#ct_title>h1', '#catalog_list>ul>li>a', '#catalog_list>ul>li:has(input)>a');
addCRule('www.xxsy.net', 'h1>a', '#zjcontentdiv', 0);
addIRule('book.zhulang.com', '逐浪', '.crumbs>strong>a', '.chapter-list>ul>li>a', '.chapter-list>ul>li>a:has(span)');
addCRule('book.zhulang.com', 'h2>span', '#read-content', 0);
addIRule('novel.hongxiu.com', '红袖添香', '#htmltimu', '#htmlList>dl>dd>ul>li>strong>a', '#htmlList>dl>dd>ul>li>strong:has(.isvip)>a');
addCRule('novel.hongxiu.com', '#htmltimu', '#htmlContent>label:nth-child(2)', 0);
addIRule('www.readnovel.com', '小说阅读网', '.nownav>a:nth-child(5)', '.ML_ul>li>a', '.ML_ul>li>a[id^="vip_"]');
addCRule('www.readnovel.com', 'h1', '.zhangjie', 0, 1);
addIRule('www.xs8.cn', '言情小说吧', 'h1>a', '.mod_container>ul>li>a', '.mod_container>ul>li:has(img)>a');
addCRule('www.xs8.cn', '.chapter_title>h2', '.chapter_content', 0);
addIRule('book.hjsm.tom.com', '幻剑书盟', '.title>h2', '.ocon>ul>li>a', '.ocon>ul>li:has(img)>a');
chapterRule['book.hjsm.tom.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    var urlArr = url.split(/\/|\./);
    urlTrue = 'http://book.hjsm.tom.com/' + urlArr[6].substring(0, 2) + '/' + urlArr[6] + '/' + urlArr[7] + '.js';
    GM_xmlhttpRequest({
      method: 'GET',
      url: urlTrue,
      onload: function (response) {
        var name = jQuery(window).data('dataDownload') [num].name;
        var content = response.response.replace('document.write("<p>', '').replace('");', '')
        content = wordFormat(eval('\'' + content + '\''));
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
}
addIRule('www.kanshu.com', '看书网', '.mu_h1>h1', '.mulu_list>li>a', '.mulu_list>li:has(span)>a');
addCRule('www.kanshu.com', 'h1', '.yd_text2', 0, 1);
addIRule('book.weibo.com', '微博读书', 'h1.book_name', '.chapter>span>a', '.chapter>span:has(i)>a');
chapterRule['book.weibo.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        var name = jQuery('.sr-play-box-scroll-t-path>span', response.response).text();
        var content = response.response.replace(/\s+/g, ' ').replace(/.*chapterContent ="(.*?)";.*/, '$1');
        content = wordFormat(eval('\'' + content + '\''));
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
}
addIRule('www.lcread.com', '连城读书', '.bri>table>tbody>tr>td>h1', '#abl4>table>tbody>tr>td>a', '#abl4>table>tbody>tr>td>a[href^="http://vipbook.lc1234.com/"]');
addCRule('www.lcread.com', 'h2', '#ccon', 0, 1);
addIRule('www.motie.com', '磨铁中文网', 'h1>a', '.list>li>a:has(span.desc)', '.list>li>a:has(span.desc):has(img)');
addCRule('www.motie.com', 'h1', '.page-content', 0);
addIRule('www.shuhai.com', '书海小说网', 'h3', '.box_chap>ul>li>a', '.box_chap>ul>li:has(em)>a');
addCRule('www.shuhai.com', 'h1', '#readcon', 0);
addIRule('www.xiang5.com', '香网', '.lb>h2', '.lb>table>tbody>tr>td>a', 'jQuery(".lb>table>tbody>tr>td:has(img)").prev().find("a")');
addCRule('www.xiang5.com', 'h1', '.xsDetail', 0);
addIRule('read.fmx.cn', '凤鸣轩小说网', '.art_listmain_top>h1', '.art_fnlistbox>span>a,.art_fnlistbox_vip>ul>li>span>a', '.art_fnlistbox_vip>ul>li>span>a');
addCRule('read.fmx.cn', 'h1', '#content', 0, 1);
addIRule('novel.feiku.com', '飞库网', '.book_dirtit', '.book_dirbox>.clearfix>li>a', '.book_dirbox>.clearfix>li>a[href*="/vip/"]');
addCRule('novel.feiku.com', '.art_tit', '#artWrap', 0);
addIRule('www.abada.com', '阿巴达', '#booktitle>h1', '.list>ul>li>a', '.list>ul>li:has(font)>a');
addCRule('www.abada.com', 'h1', '#content', 0, 1);
addIRule('www.kujiang.com', '酷匠网', '.kjtitle.align-center.pad-bottom>a', '.third>a');
chapterRule['www.kujiang.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        if (response.finalUrl.indexOf('http://www.kujiang.com/login') === 0) {
          for (var i = num; i < jQuery(window).data('dataDownload').length; i++) {
            jQuery(window).data('dataDownload') [i].content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n';
            jQuery(window).data('dataDownload') [i].ok = true;
          }
          jQuery(window).data('downloadList', new Array());
          return
        }
        var name = jQuery('.entry-title', response.response).text();
        var content = jQuery('#endText', response.response).html();
        content = wordFormat(content);
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
};
addIRule('www.tadu.com', '塔读文学', '.book-detail.catalog-tip>h3', '.detail-chapters>ul>li>h5>a', '.detail-chapters>ul>li>h5>a:has(span)');
chapterRule['www.tadu.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        var name = jQuery('div.title_>h2', response.response).text();
        var content = unescape(response.response.replace(/\s+/g, ' ').replace(/.*unescape\("(.*?)"\).*/, '$1'));
        content = wordFormat(content);
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
};
addIRule('yuedu.163.com', '网易云阅读', 'h2.title', '.item>a', '.vip>a', false);
chapterRule['yuedu.163.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    urlArr = url.split('/');
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://yuedu.163.com/getArticleContent.do?sourceUuid=' + urlArr[4] + '&articleUuid=' + urlArr[5],
      onload: function (response) {
        var content = JSON.parse(response.response).content;
        content = base64decode(content);
        content = utf8to16(content);
        var name = content.replace(/\s+/g, ' ').replace(/.*<h1><span>(.*?)<\/span><\/h1>.*/, '$1');
        var content = content;
        content = wordFormat(content);
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
};
//////////////////////////////////////////////////
addIRule('www.wenku8.com', '轻小说文库', '#title', '.css>tbody>tr>td>a');
addCRule('www.wenku8.com', '#title', '#content', 0, 1);
addIRule('book.sfacg.com', 'SF轻小说', 'h1', '.list_Content>volumeitem>li>a');
addCRule('book.sfacg.com', '.list_menu_title', '#ChapterBody', 0);
addIRule('xs.dmzj.com', '动漫之家', '.novel_cover_text>ol>li>a>h1', '.download_rtx>ul>li>a');
addCRule('xs.dmzj.com', 'h1', '#novel_contents', 0);
addIRule('www.yidm.com', '迷糊动漫', 'title', '.chapters.clearfix>a');
addCRule('www.yidm.com', '.bd>h4', '.bd', 0, 1);
//////////////////////////////////////////////////
addIRule('www.23wx.com', '顶点小说', '.bdsub>dl:nth-child(1)>dt:nth-child(1)>a:nth-child(4)', '#at>tbody>tr>td>a');
addCRule('www.23wx.com', 'h1', '#contents', 0, 1);
addIRule('www.biquge.la', '笔趣阁', 'h1', '#list>dl>dd>a');
addCRule('www.biquge.la', 'h1', '#content', 0, 1);
addIRule('www.shumilou.co', '书迷楼', '#mybook+.list>.tit>b', 'li.zl>a');
addCRule('www.shumilou.co', 'h2', '#content', 0);
addIRule('www.quledu.com', '无错小说网', 'h1>.bigname', '.zjlist4>ol>li>a');
addCRule('www.quledu.com', '#htmltimu', '#htmlContent', 0);
addIRule('www.mangg.com', '追书网', 'h1', '#chapterlist>dd>a');
addCRule('www.mangg.com', '#bgdiv>dl>dt', '#booktext', 0);
addIRule('www.23zw.com', '傲世中文网', 'h1', '.chapter_list_chapter>a');
addCRule('www.23zw.com', '#chapter_title>h1', '#text_area', 0, 1);
addIRule('www.31wxw.com', '三易文学', 'h1', '#readerlist>ul>li>a');
addCRule('www.31wxw.com', 'h1', '#content', 0, 1);
addIRule('www.520xs.la', '520小说网', 'h1', '.list>dl>dd>a', '', true);
addCRule('www.520xs.la', 'h1', '.con_txt', 0, 1);
addIRule('www.biquge.com', '笔趣阁', 'h1', '#list>dl>dd>a');
addCRule('www.biquge.com', 'h1', '#content', 0);
addIRule('www.69shu.com', '69书吧', '.weizhi>a:nth-child(3)', '.mulu_list>li>a', '.mu_contain:has(.mu_beizhu)>.mulu_list>li>a');
addCRule('www.69shu.com', 'h1', '.yd_text2', 0, 1);
addIRule('www.biquku.com', '笔趣库', 'h1', '#list>dl>dd>a');
addCRule('www.biquku.com', 'h1', '#content', 0, 1);
addIRule('www.5ccc.net', '我看书斋', 'h1', 'table.acss>tbody>tr>td.ccss>a');
addCRule('www.5ccc.net', 'h1', '#content', 0, 1);
addIRule('www.aiquxs.com', '爱去小说网', '.con_top>a:nth-child(4)', '#list>dl>dd>a');
addCRule('www.aiquxs.com', 'h1', '#booktext', 0, 1);
addIRule('www.2kxs.com', '2K小说阅读网', 'h1', '.book>dd>a', '.book>dd:contains(【)>a,.book>dd:has(font)>a');
addCRule('www.2kxs.com', 'h2', 'p.Text', 0, 1);
addIRule('www.mianhuatang.la', '棉花糖小说网', 'h1', '.novel_list>dl>dd>a');
addCRule('www.mianhuatang.la', 'h1', '.content', 0, 1);
addIRule('www.suimengxiaoshuo.com', '随梦小说网', '.title>h2', '.list_box>ul>li>a');
addCRule('www.suimengxiaoshuo.com', 'h2', '.box_box', 0, 1);
addIRule('www.suimeng.la', '随梦小说网', 'h2', 'table.acss>tbody>tr>td.ccss>a');
addCRule('www.suimeng.la', '.ctitle', '#ccontent', 0, 1);
addIRule('www.00ksw.com', '零点看书', 'h1', '#list>dl>dd>a');
addCRule('www.00ksw.com', 'h1', '#content', 0, 1);
addIRule('www.wangshuge.com', '望书阁', 'h1', '#at>tbody>tr>td.L>a');
addCRule('www.wangshuge.com', 'h1', '#contents', 0, 1);
addIRule('tt.71wx.net', '天天中文', 'h1', '.ml_main>dl>dd>a');
addCRule('tt.71wx.net', 'h2', '.yd_text2', 0, 1);
addIRule('www.71wx.net', '清逸文学网', 'h1', '.ml_main>dl>dd>a');
addCRule('www.71wx.net', 'h2', '.yd_text2', 0, 1);
addIRule('www.kuaidu.cc', '快读', '.xsname>a', '.mulu>ul>li>a');
addCRule('www.kuaidu.cc', '.h1title>h1', '.contentbox', 0);
addIRule('www.vodtw.com', '品书网', 'h1', '.insert_list>dl>dd>ul>li>a');
addCRule('www.vodtw.com', '#htmltimu', '.contentbox', 0, 1);
addIRule('www.sqsxs.com', '手牵手小说', 'h1', '#list>dl>dd>a');
addCRule('www.sqsxs.com', 'h1', '#content', 0, 1);
addIRule('www.dashubao.co', '大书包小说网', 'h1', '.ml_main>dl>dd>a');
addCRule('www.dashubao.co', 'h2', '.yd_text2', 0, 1);
addIRule('www.qingdou.cc', '青豆小说', 'h1>a', '.dirconone>ul>li>a');
addCRule('www.qingdou.cc', 'h2>a', '#chapter_content', 0);
addIRule('www.aszw520.com', '爱上中文', 'h1', '#at>tbody>tr>td.L>a');
addCRule('www.aszw520.com', 'h1', '#contents', 0, 1);
addIRule('www.abcsee.net', '北辰文学网', 'h1', '#at>tbody>tr>td.L>a');
addCRule('www.abcsee.net', 'h1', '#contents', 0, 1);
addIRule('www.bxwx.cc', '新笔下文学', '.novel_name', '.novel_list>ul>li>a');
addCRule('www.bxwx.cc', '.novel_title', '.novel_content', 0, 1);
addIRule('www.uecg.net', '优易小说网', '.novel_name', '.chapter>dd>a');
addCRule('www.uecg.net', '.novel_title', '.novel_content', 0, 1);
addIRule('www.5du5.com', '吾读小说网', 'h1', '#list>li>a');
addCRule('www.5du5.com', 'h1', '#content', 0, 1);
addIRule('www.klxsw.com', '可乐小说网', 'h1>a', 'body>center>table>tbody>tr>td>div>a');
addCRule('www.klxsw.com', '.newstitle', '#r1c', 0, 1);
addIRule('www.3gxs.com', '00小说', '.book_news_title>ul:nth-child(1)>li:nth-child(1)>a:nth-child(3)', '.booklist>li>span>a');
addCRule('www.3gxs.com', '.vv', '#content', 0, 1);
addIRule('www.baoliny.com', '风云小说阅读网', 'h1', 'table.acss>tbody>tr>td.ccss>a');
addCRule('www.baoliny.com', 'h1', '#content', 0, 1);
addIRule('www.dhzw.com', '大海中文', 'h1', '#list>dl>dd>a');
addCRule('www.dhzw.com', 'h1', '#BookText', 0, 1);
addIRule('www.bxwx8.org', '笔下文学', '#title', '#TabCss>dl>dd>a', '', true);
addCRule('www.bxwx8.org', '#title', '#content', 0, 1);
addIRule('www.dajiadu.net', '大家读书院', 'h1', '#booktext>ul>li>a');
addCRule('www.dajiadu.net', '#title', '#content1', 0, 1);
addIRule('www.3dllc.com', '官术网', '.v-nav>p>a:nth-child(2)', '.pox>li>a');
addCRule('www.3dllc.com', 'h1', '.zhang-txt-nei-rong', 0);
addIRule('www.llwx.net', '啦啦文学网', 'h1', '#list>dl>dd>a');
addCRule('www.llwx.net', 'h1', '#content>p', 0, 1);
addIRule('www.paoshuba.cc', '泡书吧', '#info>h1', '#list>dl>dd>a');
addCRule('www.paoshuba.cc', '.zhangjieming>h1', '#TXT', 0, 1);
addIRule('www.qmshu.com', '启蒙书网', '.wrapper_list>h1>a', '#htmlList>dl>dd>ul>li>strong>a');
addCRule('www.qmshu.com', 'h1', '#htmlContent', 0, 1);
addIRule('www.gdsanlian.com', '三联文学网', '.content>h1', '.dirbox>dl>dd>a');
addCRule('www.gdsanlian.com', 'h1', '#contents', 0, 1);
addIRule('www.xinsiluke.com', '思路客小说阅读网', '#title>h1', '#list>dl>dd>a');
addCRule('www.xinsiluke.com', 'h1', '#content', 0, 1);
addIRule('www.zhuzhudao.com', '猪猪岛小说网', 'h1', '.list>dd>a');
addCRule('www.zhuzhudao.com', 'h1', '.content', 0, 1);
addIRule('www.fqxsw.com', '番茄小说', '#info>h1', '#list>dl>dd>a');
addCRule('www.fqxsw.com', 'h1', '#content', 0, 1);
addIRule('www.baquge.com', '新笔趣阁', '.novel_name', '.novel_list>ul>li>a');
addCRule('www.baquge.com', '.novel_title', '.novel_content', 0, 1);
addIRule('www.bookabc.net', 'ABC小说', '.bookinfo>h1', '.chapter-list>li>a');
addCRule('www.bookabc.net', 'h1', '#content', 0);
addIRule('www.13xs.com', '13小说', '.con_top>a:nth-child(3)', '#list>dl>dd>a');
addCRule('www.13xs.com', 'h1', '#booktext', 0, 1);
addIRule('www.1xiaoshuo.com', 'E小说', '#info>h1', '#list>dl>dd>a');
addCRule('www.1xiaoshuo.com', 'h1', '#content', 0, 1);
addIRule('www.daomengren.com', '盗梦人小说网', '#info>h1', '#list>dl>dd>a');
addCRule('www.daomengren.com', 'h1', '#content>p', 0, 1);
addIRule('www.xs84.me', '小说巴士', '.info>ul>li>h1', '#list>dl>dd>a');
addCRule('www.xs84.me', 'h1', '#contentts', 0, 1);
addIRule('www.15cy.com', '尘缘文学网', '.dir_main>h1>a', '.dir_main_section>ol>li>a');
addCRule('www.15cy.com', 'h2', '#inner', 0, 1);
addIRule('www.zhaifans.com', '宅范书斋', '.headname', '.contentlist>ul>li>a');
addCRule('www.zhaifans.com', '.headtitle', '#showcontent', 0, 1);
addIRule('www.ranwen.org', '燃文小说', '#info>h1', '#list>dl>dd>a');
addCRule('www.ranwen.org', 'h1', '#content', 0, 1);
addIRule('www.773buy.com', '燃文小说', '.bname', '.dccss>a');
addCRule('www.773buy.com', '.bname_content', '#content', 0, 1);
addIRule('www.00sy.com', '零点书院', 'h1', '.TabCss>dl>dd>a');
addCRule('www.00sy.com', 'h1', '#content', 0, 1);
addIRule('www.qingkan520.com', '请看小说网', '.bigname>h1', '.zjbox>ul>li>a');
addCRule('www.qingkan520.com', 'h1', '#content', 0, 1);
addIRule('www.xiaoxiaoshuwu.com', '小小书屋', '.title>h3>a', '.td_con>a');
addCRule('www.xiaoxiaoshuwu.com', '.content>h3', '#chapterContent', 0, 1);
addIRule('www.99shumeng.org', '九九书盟', '.readerListHeader>h1', '.ccss>a');
addCRule('www.99shumeng.org', '#h1', '#content', 0, 1);
addIRule('www.bookbao.net', '书包网', '#info>h1,dd>h1', '#chapterlist>ul>li>a,.info_chapterlist>ul>li>a');
addCRule('www.bookbao.net', 'h1', '#contents', 0, 1);
addIRule('www.sto.cc', '思兔閱讀(请使用通配符模式)', 'h1', '');
addCRule('www.sto.cc', 'h1', '#BookContent', 1);
addIRule('www.shouda8.com', '手打吧', '#info>h1', '#list>dl>dd>a');
addCRule('www.shouda8.com', 'h1', '#content', 0, 1);
addIRule('www.shumilou.net', '书迷楼', '.btitle>h1', '.chapterlist>dd>a');
addCRule('www.shumilou.net', 'h1', '#BookText', 0, 1);
addIRule('www.64mi.com', '爱尚小说网', 'h1', '#at>tbody>tr>td.L>a');
addCRule('www.64mi.com', 'h1', '#contents', 0, 1);
addIRule('www.zhuzhudao.cc', '猪猪岛小说网', 'h1', '#list>dl>dd>a');
addCRule('www.zhuzhudao.cc', 'h1', '#content', 0, 1);
addIRule('www.wanshuba.com', '万书吧', '.ml_title>h1', '.ml_main>dl>dd>a');
addCRule('www.wanshuba.com', 'h2', '.yd_text2', 0, 1);
addIRule('www.bqxs.com', '比奇小说网', '#smallcons>h1', '#readerlist>ul>li>a');
addCRule('www.bqxs.com', 'h1', '#content', 0, 1);
addIRule('www.6yzw.com', '六月中文网', '#info>h1', '#list>dl>dd>a');
addCRule('www.6yzw.com', 'h1', '#content>p', 0, 1);
addIRule('www.daomengren.com', '盗梦人小说网', '#info>h1', '#list>dl>dd>a');
addCRule('www.daomengren.com', 'h1', '#content>p', 0, 1);
addIRule('www.muyuge.net', '木鱼哥', '.xsh1>h1>a', '#xslist>ul>li>a');
addCRule('www.muyuge.net', 'h1', '#content', 0, 1);
addIRule('www.zaiduu.com', '再读中文', '#info>h1', '#list>dl>dd>a');
addCRule('www.zaiduu.com', 'h1', '#TXT', 0);
addIRule('www.00xs.cc', '00小说', '.chapter-hd>h1', '.chapter-list>li>span>a');
addCRule('www.00xs.cc', 'h1', '.article-con', 0, 1);
addIRule('www.musemailsvr.com', 'MuseMail中文', '.wrapper>h1>a', '.nav>span>a');
addCRule('www.musemailsvr.com', '.title', '#content', 0, 1);
addIRule('www.lewenwu.com', '乐文屋', '.infot>h1', '.chapterlist>li>a');
addCRule('www.lewenwu.com', 'h1', '#content', 0, 1);
addIRule('www.biquge.tw', '笔趣阁', '#info>h1', '#list>dl>dd>a');
addCRule('www.biquge.tw', 'h1', '#content', 0, 1);
addIRule('www.50zw.co', '武林中文网', '#info>h1', '.chapterlist>li>a');
addCRule('www.50zw.co', 'h1', '#htmlContent', 0, 1);
addIRule('www.xiangcunxiaoshuo.com', '乡村小说网', '.ml_title>h1', '.ml_main>dl>dd>a');
addCRule('www.xiangcunxiaoshuo.com', 'h2', '.yd_text2', 0, 1);
addIRule('www.lwxs520.com', '乐文小说网', '.infot>h1', '.dccss>a');
addCRule('www.lwxs520.com', 'h1', '#content>p', 0, 1);
addIRule('www.scwzw.net', '伤城文章网', '#info>h1', '.qq');
addCRule('www.scwzw.net', 'h1', '#content', 0, 1);
addIRule('www.yunlaige.com', '云来阁小说', '.title>h1', '#contenttable>tbody>tr>td>a');
addCRule('www.yunlaige.com', '.ctitle', '#content', 0, 1);
addIRule('www.cfwx.net', '长风文学', '.bdsub>dl>dd>h1', '.L>a');
addCRule('www.cfwx.net', 'h1', '#contents', 0, 1);
addIRule('www.qiuwu.net', ' 凤舞文学网', '.dir_main>h1', '.dir_main_section>ol>li>a');
addCRule('www.qiuwu.net', 'h1', '#content', 0, 1);
addIRule('www.33yq.com', '33言情', '#info>a>h1', '#list>dl>dd>a');
addCRule('www.33yq.com', 'h1', '#TXT', 0, 1);
addIRule('www.du00.cc', '读零零小说网', '#info>h1', '#list>dl>dd>a');
addCRule('www.du00.cc', 'h1', '#pagecontent', 0, 1);
addIRule('www.xs74.com', '小说骑士', '#info>h1', '#list>dl>dd>a');
addCRule('www.xs74.com', 'h1', '#content', 0, 1);
addIRule('www.fhxs.com', '凤凰小说网', '#info>h1', '#list>dl>dd>a');
addCRule('www.fhxs.com', 'h1', '#TXT', 0, 1);
addIRule('www.snwx.com', '少年文学', '.infotitle>h1', '#list>dl>dd>a');
addCRule('www.snwx.com', 'h1', '#BookText', 0, 1);
addIRule('www.yawen8.com', '雅文小说', '#list>dl>dd>a', '#list>dl>dd>a');
addCRule('www.yawen8.com', 'h1', '#content', 0, 1);
addIRule('www.7dsw.com', '7度书屋', '.infotitle>h1', '#list>dl>dd>a');
addCRule('www.7dsw.com', 'h1', '#BookText', 0, 1);
addIRule('www.bookgew.com', '书阁网', '.booktitle', 'html>body>table[bordercolordark="white"]>tbody>tr>td>div>a');
addCRule('www.bookgew.com', '.newstitle', '#booktext', 0, 1);
addIRule('www.79xs.com', '79小说网', '.wrapper_list>h1>a', '.insert_list>dl>dd>ul>li>strong>a');
addCRule('www.79xs.com', '#htmltimu', '#BookText', 0, 1);
addIRule('www.shuhaha.com', '79小说网', '.wrapper_list>h1>a', '.insert_list>dl>dd>ul>li>strong>a');
addCRule('www.shuhaha.com', '#htmltimu', '#BookText', 0, 1);
addIRule('www.xiaoshuo2016.com', '小说2016', '.introMid>h1', '.cate-List>ul>li>a', '', true);
addCRule('www.xiaoshuo2016.com', 'h1', '.articleDiv>p', 0, 1);
addIRule('www.ttzw.com', '天天中文网', '#info>h1', '#list>dl>dd>a');
addCRule('www.ttzw.com', 'h1', '#content', 0);
addIRule('www.shenmabook.com', '神马小说网', '.bigname', '.zjlist4>ol>li>a');
addCRule('www.shenmabook.com', '#htmltimu', '#htmlContent', 0, 1);
addIRule('www.fkzww.com', '无敌龙书屋', '.booktitle', '#BookText>ul>li>a');
addCRule('www.fkzww.com', '.newstitle', '#BookTextt', 0, 1);
addIRule('www.151kan.com', '151看书网', '.title>ul>h1', '.chapter>ul>li>a');
addCRule('www.151kan.com', 'h1', '#readtext>p', 0, 1);
addIRule('www.shuotxts.com', '小说下载', '.uu_bkt', '.chaptertd>a');
addCRule('www.shuotxts.com', '#title', '#content', 0, 1);
addIRule('www.doulaidu.com', '都来读', '#info>h1', '#list>dl>dd>a');
addCRule('www.doulaidu.com', 'h1', '#content', 0);
addIRule('www.kanshu.la', '看书啦', '#focus_book_info>h1>a', '.box1.mulu>ul>li>a');
addCRule('www.kanshu.la', '.h1', '#contentTxt', 0);
addIRule('www.kanunu8.com', '努努书坊', '.l15', 'html>body>div>table>tbody>tr>td>table>tbody>tr>td>table[bgcolor="#d4d0c8"]>tbody>tr>td>a');
addCRule('www.kanunu8.com', 'font', 'p', 0, 1);
addIRule('www.hkxs99.net', '无弹窗小说网', '.book>h1', '.book>dl>dd>a');
addCRule('www.hkxs99.net', 'h1', '.book>p', 0, 1);
addIRule('paitxt.com', '派小说网', '.book_news_style_text2>h1', '#chapterlist>dd>a');
addCRule('paitxt.com', '#bgdiv>dl>dt', '#booktext', 0, 1);
addIRule('www.shunong.com', '书农小说', '.infos>h1', '.book_list>ul>li>a');
addCRule('www.shunong.com', '.h1title>h1', '#htmlContent', 0);
addIRule('www.yqhhy.cc', '言情后花园', '#html>h1', '.list2>tbody>tr>td>a');
addCRule('www.yqhhy.cc', 'h1', '#content', 0, 1);
addIRule('www.wenchangshuyuan.com', '文昌书院', 'h1', '._chapter>li>a');
addCRule('www.wenchangshuyuan.com', 'h1', '#content', 0, 1);
addIRule('xiaoshuokan.com', '好看小说网', 'h1', '.c1>a');
chapterRule['xiaoshuokan.com'] = {
  'lang': 0,
  'Deal': function (num, url) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        var name = jQuery('center>h1', response.response).text();
        var bid = response.response.replace(/\s+/g, ' ').replace(/.*"bid":"(.*?)".*/, '$1');
        var cid = response.response.replace(/\s+/g, ' ').replace(/.*"cid":"(.*?)".*/, '$1');
        chapterRule['xiaoshuokan.com'].Deal2(num, name, bid, cid);
      }
    });
  },
  'Deal2': function (num, name, bid, cid) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://soso2.xiaoshuokan.com/call/chapreadajax.ashx?bid=' + bid + '&cid=' + cid + '&c=gbk',
      onload: function (response) {
        var content = wordFormat(response.response);
        content = '来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n' + content;
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== 0) {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
        thisDownloaded(num, name, content);
      }
    });
  }
};
addIRule('www.xs222.com', '顶点小说', '#info>h1', '#list>dl>dd>a');
addCRule('www.xs222.com', 'h1', '#content', 0, 1);
addIRule('www.bjxiaoshuo.com', '白金小说网', '#title', '.ccss>a');
addCRule('www.bjxiaoshuo.com', '#title', '#content', 0, 1);
addIRule('www.59shuku.com', '59书库', '.infot>h1', '.dccss>a');
addCRule('www.59shuku.com', 'h2', '#content>p', 0, 1);
addIRule('www.tlxsw.com', '天籁小说网', '.shumeng_paintro>font', '.centent>ul>li>a[href$=".html"]');
addCRule('www.tlxsw.com', '#title', '#content', 0, 1);
addIRule('www.92zw.com', '就爱中文网', 'h1', '#at>tbody>tr>td.L>a');
addCRule('www.92zw.com', 'h1', '#contents', 0, 1);
addIRule('www.d8qu.com', '第八区', '.title>h1', '.chapter>ul>li>a');
addCRule('www.d8qu.com', '#cont>h1', '#content>#clickeye_content', 0, 1);
addIRule('www.zhuaji.org', '爪机书屋', '.mulu-left>h1', '#mulu>dd>a');
addCRule('www.zhuaji.org', '.title', '#content', 0, 1);
addIRule('www.7kshu.com', '去看书网', 'h1', '#chapterlist>li>a');
addCRule('www.7kshu.com', 'h1', '#content', 0, 1);
addIRule('www.luoqiu.com', '落秋中文', 'h1>a', '.dccss>a');
addCRule('www.luoqiu.com', '.bname_content', '#content', 0, 1);
addIRule('www.podlook.com', '菠萝网', '.wrapper>h1', 'ul.chapters>li>a');
addCRule('www.podlook.com', 'div.title', '#content', 0, 1);
addIRule('www.630book.cc', '恋上你看书网', '#info>h1', 'dl.zjlist>dd>a');
addCRule('www.630book.cc', '#main>h1', '#content', 0, 1);
addIRule('www.vv44.net', '琦书屋', '#list>div.bt>h1', 'div.book>table>tbody>tr>td>li>a');
addCRule('www.vv44.net', '#content>div>h1', '#content', 0);
addIRule('www.88dushu.com', '88读书网', 'h1', '.mulu>ul>li>a');
addCRule('www.88dushu.com', 'h1', '.yd_text2', 0, 1);
addIRule('www.23us.cc', '顶点小说', 'h1', '.chapterlist>dd>a');
addCRule('www.23us.cc', 'h1', '#content', 0, 1);
addIRule('www.chinaliangzhu.com', '梁祝文学网', 'h1', 'ul.chapters>li>a');
addCRule('www.chinaliangzhu.com', '.title', '#content', 0, 1);
addIRule('www.wenxuemm.com', '女生文学', 'h1', '.novel_list>ul>li>a');
addCRule('www.wenxuemm.com', 'h1', '#content', 0, 1);
addIRule('www.chuanyue8.com', '穿越小说吧', '.bigname', '.zjlist4>ol>li>a');
addCRule('www.chuanyue8.com', '#htmltimu', '#_17mb_content', 0, 1);
addIRule('www.biquguan.com', '笔趣馆', 'h1', '#list>dl>dd>a');
addCRule('www.biquguan.com', 'h1', '#content', 0);
addIRule('www.1kanshu.cc', '要看书网', 'h1', '#list>dl>dd>a');
addCRule('www.1kanshu.cc', 'h1', '#content', 0, 1);
addIRule('www.5800.cc', '58小说阅读网', 'h1', '.TabCss>dl>dd>a');
addCRule('www.5800.cc', 'h1', '#content', 0, 1);
addIRule('www.xiaoyanwenxue.com', '小燕文学', 'h1', '#list>._chapter>li>a');
addCRule('www.xiaoyanwenxue.com', 'h1', '#content', 0, 1);
addIRule('www.cmxsw.com', '眼快看书', 'h1', '#xscontent>#left>#xsbody>ul>li>a');
addCRule('www.cmxsw.com', 'h3', '#content', 0, 1);
addIRule('www.dushuge.net', '读书阁', 'h1', '#list>dl>dd>a');
addCRule('www.dushuge.net', 'h1', '#content', 0, 1);
addIRule('www.qianrenge.net', '钱人阁', 'h1', '#list>dl>dd>a');
addCRule('www.qianrenge.net', 'h1', '#content', 0);
addIRule('www.bookba.net', '在线书吧', 'h2', '.content>.txt-list>li>a');
addCRule('www.bookba.net', 'h1', '.note', 0, 1);
addIRule('www.360118.com', '天天中文', 'h1', '.ml_main>dl>dd>a');
addCRule('www.360118.com', 'h2', '.yd_text2', 0, 1);
addIRule('www.59tto.com', '59文学', 'h1', '.xiaoshuo_list>dd>a');
addCRule('www.59tto.com', 'h1', '.article', 0, 1);
addIRule('www.9wh.net', '九头鸟书院', 'h1', '.ListCon>.ListRow>li>a');
addCRule('www.9wh.net', 'h1', '#text_area', 0, 1);
addIRule('www.23txt.com', '天籁小说', 'h1', '#list>dl>dd>a');
addCRule('www.23txt.com', 'h1', '#content', 0, 1);
addIRule('www.book108.com', '108小说网', 'h1', '.chapter-list>li>span>a');
addCRule('www.book108.com', 'h1', '.article-con', 0, 1);
addIRule('www.5ycn.com', '五月中文', 'h1', '#list>dl>dd>a');
addCRule('www.5ycn.com', 'h1', '#content', 0, 1);
addIRule('www.zbzw.com', '着笔中文网', 'h1', '#chapterlist>li>a');
addCRule('www.zbzw.com', 'h1', '#text_area', 0, 1);
addIRule('www.5200zw.com', '5200小说网', 'h1', '#readerlist>ul>li>a');
addCRule('www.5200zw.com', 'h1', '#content', 0, 1);
addIRule('www.uuxiaoshuo.net', '悠悠书盟', 'h1', '.ccss>a');
addCRule('www.uuxiaoshuo.net', 'h1', '#content', 0, 1);
addIRule('www.chinaisbn.com', 'isbn书院', 'h1', '.mulu_list>li>a');
addCRule('www.chinaisbn.com', 'h1', '#htmlContent', 0, 1);
addIRule('www.ty2016.net', '天涯书库', 'h1', '.book>dl>dd>a');
addCRule('www.ty2016.net', 'h1', 'p[align="center"]+p', 0, 1);
addIRule('wx.ty2016.net', '天涯书库', 'h1', '.book>dl>dd>a');
addCRule('wx.ty2016.net', 'font', 'p', 0, 1);
addIRule('www.my285.com', ' 梦远书城(待完善)', 'td[bgcolor="#FFC751"]', 'td>a:not(:has(span)):visible');
addCRule('www.my285.com', 'td[height="30"]', 'td:has(br)', 0, 1);
addIRule('www.5858xs.com', '58小说网', 'h1', 'td>a[href$=".html"]');
addCRule('www.5858xs.com', 'h1', '#content', 0, 1);
addIRule('book.58xs.com', '58小说网', 'h1', 'td>a[href$=".html"]');
addCRule('book.58xs.com', 'h1', '#content', 0, 1);
addIRule('www.hjwzw.com', '黄金屋中文', 'h1', '#tbchapterlist>table>tbody>tr>td>a');
addCRule('www.hjwzw.com', 'h1', '#AllySite+div', 0);
addIRule('www.8shuw.net', '8书网', '#info>h1', '.indexlist>tbody>tr>td>span>a');
addCRule('www.8shuw.net', 'h2>span:nth-child(2)', '#content', 0, 1);
addIRule('www.e8zw.com', 'E8中文网', 'h1', '#list>dl>dd>a');
addCRule('www.e8zw.com', 'h1', '#content', 0);
addIRule('www.biquge.tw', '笔趣阁', 'h1', '#list>dl>dd>a');
addCRule('www.biquge.tw', 'h1', '#content', 0);
addIRule('www.8535.org', '阿甘小说网', '.c2>h1', '.booklist>span>a');
addCRule('www.8535.org', 'h1', '.txtc', 0, 1);
addIRule('www.yfzww.com', '一凡中文网', 'h2', '#chapters>li>a');
addCRule('www.yfzww.com', 'h3', '#content', 0);
addIRule('www.lewen8.com', '乐文小说网', '.infot>h1', '.chapterlist>li>a');
addCRule('www.lewen8.com', 'h1', '#content', 0);
addIRule('www.lread.net', '乐阅读', 'h1', '#list>dl>dd>a');
addCRule('www.lread.net', 'h1', '#booktext', 0, 1);
addIRule('www.pbtxt.com', '平板电子书网', 'h1', '.list>dl>dd>a', '', true);
addCRule('www.pbtxt.com', 'h1', '.content', 0, 1);
addIRule('www.quanbenba.com', '全本吧', 'h1', '.readerListShow>dl>dd>a');
addCRule('www.quanbenba.com', 'h1', '#content', 0, 1);
addIRule('www.qududu.net', '去读读', '.kui-left.kui-fs32', '#kui-book-list>#kui-book-show>.kui-body>.kui-item>a');
addCRule('www.qududu.net', 'h1.kui-ac', '#kui-page-read-txt', 0, 1);
addIRule('www.151xs.com', '151小说网', 'h3', '.listcon>dl>dd>a');
addCRule('www.151xs.com', 'h1', '.content', 0);
/*
addIRule('','','','');
addCRule('','','',0,1);
*/
addIRule('www.lewenxs.net', '青豆小说网', '.kui-left.kui-fs32', '.kui-item>a');
addCRule('www.lewenxs.net', 'h1.kui-ac', '#kui-page-read-txt', 0, 1);
addIRule('www.wodexiaoshuo.com', '我的小说网', 'h2>a', '.box_box>ul>li>a');
addCRule('www.wodexiaoshuo.com', '.box_con>h2', '.box_box', 0, 1);
addIRule('www.bashudu.com', '第二书包网', 'h1', '.list>ul>li>a', '.list>ul>li>a[href^="/reviewlist.php?"]');
addCRule('www.bashudu.com', 'h1', '.chapter', 1, 1);
addIRule('bbs.6park.com', '禁忌书屋', 'font>b', 'body>table>tbody>tr>td>ul>li>a', '', true);
addCRule('bbs.6park.com', 'font>b', 'td:has(center)', 1, 1);
addIRule('web.6park.com', '留园', 'font>span', 'body>table>tbody>tr>td>li>a', '', true);
addCRule('web.6park.com', 'font>b', 'td', 1, 1);
addIRule('www.neixiong88.com', '内兄小说网', 'h2.bookName', '.bookUpdate>dl>dd>a');
addCRule('www.neixiong88.com', 'h2', '#content', 1, 1);
addIRule('18av.mm-cg.com', '18H', '.label>div', '.novel_leftright>span>a:visible');
addCRule('18av.mm-cg.com', '#left>h1', '#novel_content_txtsize', 1);
jQuery(document.body).append('<div id="bookDownloaderDiv"class="bookDownloaderBoxCenter"><button class="bookDownloaderShowSupport">支持网站</button><div class="bookDownloaderSeparatorBlack"></div><span id="bookDownloaderInfo"></span><div class="bookDownloaderSeparatorBlack"></div>下载线程：<input id="bookDownloaderThread"placeholder="10"type="text"><div class="bookDownloaderSeparatorWhite"></div><input id="boodDownloaderVip"type="checkbox"></input><label for="boodDownloaderVip">下载Vip章节[测试中，起点成功]</label><div class="bookDownloaderSeparatorWhite"></div>语言：<input id="bookDownloaderLangZhs"type="radio"name="bookDownloaderLang"class="bookDownloaderLang"value="0"checked="true"></input><label for="bookDownloaderLangZhs">简体</label><input id="bookDownloaderLangZht"type="radio"name="bookDownloaderLang"class="bookDownloaderLang"value="1"></input><label for="bookDownloaderLangZht">繁体</label><div class="bookDownloaderSeparatorWhite"></div><button id="bookDownloaderThis">下载本章(TXT)</button><div class="bookDownloaderSeparatorWhite"></div><button id="bookDownloaderAll2Txt">下载整个目录页(TXT)</button><div class="bookDownloaderSeparatorWhite"></div><button id="bookDownloaderAll2Zip">每个章节生成1个txt(ZIP)</button><div class="bookDownloaderSeparatorWhite"></div><button id="bookDownloaderAll2Epub">下载整个目录页(Epub)</button><div class="bookDownloaderSeparatorBlack"></div><button class="bookDownloaderShowBatch">特定下载某些章节</button></div><div id="bookDownloaderBatch"class="bookDownloaderBoxCenter"><button class="bookDownloaderShowBatch">隐藏</button><div class="bookDownloaderSeparatorWhite"></div><button id="bookDownloaderBatchWildHelp">?</button>通配符模式：<input id="bookDownloaderBatchWild"placeholder="http://www.example.com/*"></input><div class="bookDownloaderSeparatorWhite"></div><textarea id="bookDownloaderBatchTextarea"></textarea><div class="bookDownloaderSeparatorWhite"></div><button id="bookDownloaderBatch2Txt">开始下载特定章节(TXT)</button><button id="bookDownloaderBatch2Zip">开始下载特定章节(ZIP)</button><button id="bookDownloaderBatch2Epub">开始下载特定章节(Epub)</button></div><div id="bookDownloaderSupport"class="bookDownloaderBoxCenter"><button class="bookDownloaderShowSupport">隐藏</button><div class="bookDownloaderSeparatorWhite"></div></div><div id="bookDownloaderLog"><div id="bookDownloaderLogNow"><button id="bookDownloaderClearOk">移除已完成</button></div><div id="bookDownloaderLogDiv"></div></div>');
if (GM_getValue('lang', 0) === 0) {
  jQuery('#bookDownloaderLangZhs') [0].checked = true;
} else {
  jQuery('#bookDownloaderLangZht') [0].checked = true;
}
SupportUrl = '';
var num = 0;
for (var i in indexRule) {
  if (indexRule[i].cn === '') continue;
  num++;
  SupportUrl += num + '. ' + indexRule[i].cn + ' <a href="http://' + i + '" target="_blank">' + i + '</a><div class="bookDownloaderSeparatorWhite"></div>';
}
SupportUrl = '总共支持网站' + num + '个。<div class="bookDownloaderSeparatorWhite"></div>网站基本排序：正版>轻小说>盗贴<span style="color:white">>18X</span><div class="bookDownloaderSeparator"></div>' + SupportUrl;
jQuery('#bookDownloaderSupport').append(SupportUrl).css({
  'height': '500px',
  'overflow': 'auto',
});
jQuery('#bookDownloaderInfo').html('当前网站：<div class="bookDownloaderSeparatorWhite"></div><a href="http://' + location.host + '/" target="_blank">' + indexRule[location.host].cn) + '</a>';
jQuery('#bookDownloaderThread').css('width', '24px');
jQuery('.bookDownloaderBoxCenter').css({
  'display': 'none',
  'z-index': '999999',
  'background-color': 'white',
  'border': '1px solid black',
  'text-align': 'center',
  'position': 'absolute',
  'left': function () {
    return String(jQuery(window).scrollLeft() + (window.screen.availWidth - jQuery(this).width()) / 2) + 'px';
  },
  'top': function () {
    return String(jQuery(window).scrollTop() + (window.screen.availHeight - jQuery(this).height()) / 2) + 'px';
  }
});
jQuery('#bookDownloaderLog').css({
  'display': 'none',
  'z-index': '999999',
  'background-color': 'white',
  'border': '1px solid black',
  'text-align': 'center',
  'position': 'absolute',
  'width': '300px',
  'height': '350px',
  'overflow': 'auto',
  'left': function () {
    return String(jQuery(window).scrollLeft() + window.screen.availWidth - jQuery(this).width() - 20) + 'px';
  },
  'top': function () {
    return String(jQuery(window).scrollTop() + window.screen.availHeight - jQuery(this).height() - 90) + 'px';
  }
});
jQuery('#bookDownloaderLogDiv').css({
  'height': '290px',
  'overflow': 'auto'
});
jQuery('.bookDownloaderSeparatorBlack').css('border', '1px solid black');
jQuery('.bookDownloaderSeparatorWhite').css('border', '1px none');
jQuery('#bookDownloaderBatchWild').css('width', '330px');
var textareaPlaceholder = '可拉伸大小，双击清空内容\n示例:\nhttp://http://www.example.com/1\nhttp://http://www.example.com/2\nhttp://http://www.example.com/3\n...';
jQuery('#bookDownloaderBatchTextarea').css({
  'resize': 'both',
  'width': '95%',
  'height': '100px',
  'overflow': 'hidden'
}).val(textareaPlaceholder).focus(function () {
  if (jQuery(this).val() == textareaPlaceholder) {
    jQuery(this).val('');
  }
}).blur(function () {
  if (jQuery(this).val() == '') {
    jQuery(this).val(textareaPlaceholder);
  }
}).dblclick(function () {
  jQuery(this).val('');
});
jQuery(window).scroll(function (event) {
  jQuery('.bookDownloaderBoxCenter').css({
    'left': function () {
      return String(jQuery(window).scrollLeft() + (window.screen.availWidth - jQuery(this).width()) / 2) + 'px';
    },
    'top': function () {
      return String(jQuery(window).scrollTop() + (window.screen.availHeight - jQuery(this).height()) / 2) + 'px';
    }
  });
  jQuery('#bookDownloaderLog').css({
    'left': function () {
      return String(jQuery(window).scrollLeft() + window.screen.availWidth - jQuery(this).width() - 20) + 'px';
    },
    'top': function () {
      return String(jQuery(window).scrollTop() + window.screen.availHeight - jQuery(this).height() - 90) + 'px';
    }
  });
}).keydown(function (e) {
  if (e.shiftKey && e.keyCode === 68) { //D
    jQuery('#bookDownloaderDiv').toggle();
  }
}).unload(function () {
  jQuery(window).removeData('blob');
  jQuery(window).removeData('chapter');
  jQuery(window).removeData('dataDownload');
});
jQuery('#bookDownloaderBatchWildHelp').click(function () {
  alert('示例：\n我要下载如下章节\nhttp://www.example.com/1\nhttp://www.example.com/2\nhttp://www.example.com/3\nhttp://www.example.com/...\nhttp://www.example.com/100\n...\n请在输入框输入（不包括括号）\n[http://www.example.com/*]\n然后分别在消息框里输入\n开头[1]、结尾[100]、间隔[1]、是否补足开头0[取消]');
})
jQuery('#boodDownloaderVip').click(function () {
  if (this.checked && !confirm('是否下载Vip章节，如未登录或未订阅，则只会下载章节预览。\r\n不会帮你把未订阅的章节订阅。\r\n如果不放心，请勿勾选。出事作者概不负责。')) this.checked = false;
});
jQuery('#bookDownloaderThis').click(function () {
  download([location.href], 'txt');
});
jQuery('#bookDownloaderAll2Txt').click(function () {
  download('index', 'txt');
});
jQuery('#bookDownloaderAll2Zip').click(function () {
  download('index', 'zip');
});
jQuery('#bookDownloaderAll2Epub').click(function () {
  download('index', 'epub');
});
jQuery('#bookDownloaderBatch2Txt').click(function () {
  downloadBatch('txt')
});
jQuery('#bookDownloaderBatch2Zip').click(function () {
  downloadBatch('zip')
});
jQuery('#bookDownloaderBatch2Epub').click(function () {
  downloadBatch('epub')
});
jQuery('.bookDownloaderShowBatch').click(function () {
  jQuery('#bookDownloaderBatch').toggle();
});
jQuery('.bookDownloaderShowSupport').click(function () {
  jQuery('#bookDownloaderSupport').toggle();
});
jQuery('#bookDownloaderClearOk').click(function () {
  jQuery('#bookDownloaderLogDiv>span').remove('.bookDownloaderOk');
}) //////////////////////////////////////////////////////
function downloadBatch(fileType) {
  var arr = new Array();
  var temp;
  if (jQuery('#bookDownloaderBatchWild').val() !== '') {
    var wild = jQuery('#bookDownloaderBatchWild').val();
    var start = parseInt(prompt('请输入开头'));
    var end = prompt('请输入结尾');
    var step = parseInt(prompt('请输入间隔'));
    var zero = confirm('是否补足开头0');
    if (zero) var len = end.length;
    end = parseInt(end);
    for (var i = start; i <= end; i = i + step) {
      temp = (zero) ? preZeroFill(i, len)  : i;
      temp = wild.replace('*', temp)
      arr.push(temp);
    }
  }
  if (jQuery('#bookDownloaderBatchTextarea').val() !== '' && jQuery('#bookDownloaderBatchTextarea').val() !== textareaPlaceholder) temp = jQuery('#bookDownloaderBatchTextarea').val().split('\n');
  arr = arr.concat(temp);
  console.log(arr);
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].indexOf('http') !== 0) arr[i] = 'http://' + arr[i]
  }
  download(arr, fileType);
}
function addCRule(host, name, content, lang, MimeType) { //增加章节规则
  MimeType = (MimeType === 1) ? 'text/html; charset=gb2312' : '';
  chapterRule[host] = {
    name: name,
    content: content,
    lang: lang,
    MimeType: MimeType
  }
}
function addIRule(host, cn, name, chapter, vip, sort, thread) { //增加目录规则
  var cnT = cn || '';
  var vipT = vip || '';
  var sortT = sort || false;
  var threadT = thread | false;
  indexRule[host] = {
    cn: cnT,
    name: name,
    chapter: chapter,
    vip: vipT,
    sort: sortT,
    thread: threadT
  }
}
function downloadTo(bookName, fileType) {
  if (fileType === 'zip') {
    download2Zip(bookName);
  } else if (fileType === 'txt') {
    download2Txt(bookName);
  } else if (fileType === 'epub') {
    download2Epub(bookName);
  }
}
function download(chapterArray, fileType) { //下载
  GM_setValue('lang', parseInt(jQuery('.bookDownloaderLang:checked') [0].value));
  if (chapterArray === 'index') {
    var chapter = (indexRule[location.host].chapter.indexOf('jQuery') >= 0) ? eval(indexRule[location.host].chapter)  : jQuery(indexRule[location.host].chapter);
  } else {
    var chapter = chapterArray;
  }
  console.log(chapter);
  var href = chapter[0].href || chapter[0];
  console.log(jQuery(indexRule[getHostName(href)].name).length);
  var bookName = (jQuery(indexRule[getHostName(href)].name).length === 0) ? '' : jQuery(indexRule[getHostName(href)].name) [0].innerText.replace(/^\s+|\s+$/g, '');
  if (jQuery('#boodDownloaderVip') [0].checked === false && indexRule[location.host].vip !== '') {
    var chapterVip = (indexRule[location.host].vip.indexOf('jQuery') >= 0) ? eval(indexRule[location.host].vip)  : jQuery(indexRule[location.host].vip);
    for (var i in chapterVip) {
      for (var j in chapter) {
        if (chapter[j] === chapterVip[i]) {
          delete chapter[j];
        }
      }
    };
    var chapterNew = new Object();
    var num = 0;
    for (var i in chapter) {
      if (!/^\d+$/.test(i)) continue;
      chapterNew[num] = chapter[i];
      num++;
      chapterNew.length = num;
    };
    chapter = chapterNew;
  };
  if (Boolean(jQuery(window).data('chapter'))) {
    if (chapter instanceof Array && jQuery(window).data('chapter') instanceof Array && chapter.toString() === jQuery(window).data('chapter').toString) {
      downloadTo(bookName, fileType);
      return;
    } else if (chapter instanceof Object && jQuery(window).data('chapter') instanceof Object && objComp(chapter, jQuery(window).data('chapter'))) {
      downloadTo(bookName, fileType);
      return;
    }
  }
  jQuery('#bookDownloaderLog').css('display', 'block');
  jQuery('#bookDownloaderLogDiv').html('');
  jQuery(window).data('chapter', chapter);
  jQuery(window).data('dataDownload', new Array());
  jQuery(window).data('downloadList', new Array());
  jQuery(window).data('downloadNow', new Object());
  jQuery(window).data('number', 0);
  jQuery(window).data('numberOk', 0);
  jQuery(window).data('downloadNow').length = 0;
  for (var i = 0; i < chapter.length; i++) {
    href = chapter[i].href || chapter[i];
    var name = chapter[i].innerHTML || '';
    var host = getHostName(href);
    var dataDownload = new Object();
    dataDownload.url = href;
    dataDownload.name = name;
    dataDownload.ok = false;
    jQuery(window).data('dataDownload') [i] = dataDownload;
    jQuery(window).data('downloadList') [i] = href;
  };
  if (jQuery('#bookDownladerChapter').length === 0) {
    jQuery('#bookDownloaderLogNow').append('<span id="bookDownladerChapter">0</span> / <span id="bookDownladerChapterAll">' + chapter.length + '</span>');
  } else {
    jQuery('#bookDownladerChapter').html('0');
    jQuery('#bookDownladerChapterAll').html(chapter.length);
  }
  if (indexRule[location.host].sort) {
    jQuery(window).data('downloadList').sort();
    jQuery(window).data('dataDownload').sort(arrSort('url'));
  }
  var addTask = setInterval(function () {
    if (Boolean(chapterRule[host].Deal)) {
      downloadTask(chapterRule[host].Deal);
    } else {
      downloadTask(xhr);
    }
  }, 200);
  var downloadCheck = setInterval(function () {
    //console.log('dataDownload', jQuery(window).data('dataDownload'));
    if (downloadedCheck(jQuery(window).data('dataDownload'))) {
      clearInterval(addTask);
      clearInterval(downloadCheck);
      if (jQuery('#bookDownloader').length === 0) {
        jQuery('#bookDownloaderLog').append('<button id="bookDownloader">下载</button>');
      }
      downloadTo(bookName, fileType);
    }
  }, 200);
}
function downloadTask(fun) { //下载列队
  var thread = (indexRule[location.host].thread) ? indexRule[location.host].thread : parseInt($('#bookDownloaderThread').val()) || 10;
  for (var i in jQuery(window).data('downloadNow')) {
    if (!/^\d+$/.test(i)) continue;
    if (jQuery(window).data('downloadNow') [i].ok) {
      delete jQuery(window).data('downloadNow') [i];
      jQuery(window).data('downloadNow').length--;
      continue;
    }
    if (!jQuery(window).data('downloadNow') [i].downloading) {
      var href = jQuery(window).data('downloadNow') [i].href;
      console.log('开始下载', href);
      jQuery(window).data('downloadNow') [i].downloading = true;
      addDownloadLogStart(parseInt(i) + 1, href, '开始');
      fun(i, href);
    }
  }
  if (jQuery(window).data('downloadNow').length < thread && jQuery(window).data('downloadList').length !== 0) {
    var temp = new Object();
    temp.href = jQuery(window).data('downloadList') [0];
    temp.ok = false;
    temp.downloading = false;
    jQuery(window).data('downloadNow') [jQuery(window).data('number')] = temp;
    jQuery(window).data('downloadList').splice(0, 1);
    jQuery(window).data('downloadNow').length++;
    jQuery(window).data('number', jQuery(window).data('number') + 1);
    //console.log(jQuery(window).data('number'));
    downloadTask(fun);
  } else {
    return;
  }
}
function removeData() { //移除数据
  jQuery(window).removeData('downloadNow');
  jQuery(window).removeData('downloadList');
  jQuery(window).removeData('number');
}
function xhr(num, url) { //xhr
  var host = getHostName(url);
  console.log(host);
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    overrideMimeType: chapterRule[host].MimeType,
    timeout: 10000,
    onload: function (response) {
      console.log('下载中', url);
      console.log(response.response);
      if (jQuery(window).data('dataDownload') [num].name !== '') {
        var name = jQuery(window).data('dataDownload') [num].name;
      } else {
        var name = jQuery(chapterRule[host].name, response.response);
        if (name.length > 0) {
          name = name.text().replace(/^\s+|\s+$/g, '');
        } else {
          name = jQuery(window).data('dataDownload') [num].url;
          var _html = response.response.replace(/\s+/g, ' ').replace(/<!DOCTYPE.*?>|<html.*?>|<\/html>|<head>.*?<\/head>|<body>|<\/body>|<a.*?>.*?<\/a>|<script.*?>.*?<\/script>|<img.*?>.*?<\/img>/g, '');
          jQuery('body').append('<div id="findTitle' + num + '">' + _html + '</div>');
          name = jQuery('#findTitle' + num + ' ' + chapterRule[host].name).text();
          jQuery('#findTitle' + num).remove();
        }
      }
      var content = jQuery(chapterRule[host].content, response.response);
      if (content.length > 0) {
        content = content.html();
      } else {
        var _html = response.response.replace(/\s+/g, ' ').replace(/<!DOCTYPE.*?>|<html.*?>|<\/html>|<head>.*?<\/head>|<body>|<\/body>|<a.*?>.*?<\/a>|<script.*?>.*?<\/script>|<img.*?>.*?<\/img>/g, '');
        jQuery('body').append('<div id="findContent' + num + '">' + _html + '</div>');
        content = jQuery('#findContent' + num + ' ' + chapterRule[host].content).html();
        jQuery('#findContent' + num).remove();
      }
      content = wordFormat(content);
      content = '来源地址：' + url + '\r\n' + content;
      if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) !== chapterRule[host].lang) {
        if (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) === 0) {
          name = tranStr(name, false);
          content = tranStr(content, false);
        } else {
          name = tranStr(name, true);
          content = tranStr(content, true);
        }
      }
      thisDownloaded(num, name, content);
    },
    ontimeout: function () {
      xhr(num, url);
    },
    onerror: function () {
      xhr(num, url);
    }
  });
}
function thisDownloaded(num, name, content) {
  jQuery(window).data('dataDownload') [num].name = name;
  jQuery(window).data('dataDownload') [num].content = content;
  jQuery(window).data('dataDownload') [num].ok = true;
  jQuery(window).data('downloadNow') [num].ok = true;
  jQuery(window).data('numberOk', jQuery(window).data('numberOk') + 1);
  jQuery('#bookDownladerChapter').html(jQuery(window).data('numberOk'));
}
function wordFormat(word) {
  var replaceLib = [
    /*替换前的文本|||替换后的文本*/
    /*换行符请先用【换行】二字代替，最后同一替代*/
    /*请在最前方插入*/
    '&nbsp;||| ',
    '&amp;|||&',
    '&lt;|||<',
    '&gt;|||>',
    '&hellip;|||...',
    '&mdash;|||—',
    '&quot;|||"',
    '&qpos;|||\'',
    '&ldquo;|||“',
    '&rdquo;|||”',
    /*
    无错小说网图片替换规则，来自小说下载阅读器论坛
    '<img src="/sss/\*sh\*ui\*yin\*.jpg"></img>|||水印',
    '<img src="/sss/s\?\?.jpg"></img>|||水印',
    */
    '<img src="/sss/maosu.jpg">|||“',
    '<img src="/sss/maoashu.jpg">|||“',
    '<img src="/sss/baw.jpg">|||吧？',
    '<img src="/sss/cuow.jpg">|||错',
    '<img src="/sss/cuoaw.jpg">|||错',
    '<img src="/sss/da.jpg">|||打',
    '<img src="/sss/dajiex.jpg">|||大姐',
    '<img src="/sss/edajihexr.jpg">|||大姐',
    '<img src="/sss/dianhua.jpg">|||电话',
    '<img src="/sss/pdianphua.jpg">|||电话',
    '<img src="/sss/dongxi.jpg">|||东西',
    '<img src="/sss/qdonglxi.jpg">|||东西',
    '<img src="/sss/erzib.jpg">|||儿子',
    '<img src="/sss/cerztifb.jpg">|||儿子',
    '<img src="/sss/faxian.jpg">|||发现',
    '<img src="/sss/fabxianr.jpg">|||发现',
    '<img src="/sss/furene.jpg">|||夫人',
    '<img src="/sss/frurtefne.jpg">|||夫人',
    '<img src="/sss/gongzih.jpg">|||公子',
    '<img src="/sss/gfognggzigh.jpg">|||公子',
    '<img src="/sss/gongzi.jpg">|||公子',
    '<img src="/sss/guolair.jpg">|||过来',
    '<img src="/sss/gggugolgair.jpg">|||过来',
    '<img src="/sss/guoquu.jpg">|||过去',
    '<img src="/sss/rgtugoqgugu.jpg">|||过去',
    '<img src="/sss/huilaim.jpg">|||回来',
    '<img src="/sss/khjukilkaim.jpg">|||回来',
    '<img src="/sss/huiqub.jpg">|||回去',
    '<img src="/sss/yuhhfuiuqub.jpg">|||回去',
    '<img src="/sss/jiejiev.jpg">|||姐姐',
    '<img src="/sss/jhiheejeieev.jpg">|||姐姐',
    '<img src="/sss/jiemeiv.jpg">|||姐妹',
    '<img src="/sss/hjeirerm6eihv.jpg">|||姐妹',
    '<img src="/sss/lagong.jpg">|||老公',
    '<img src="/sss/flfaggofng.jpg">|||老公',
    '<img src="/sss/lapo.jpg">|||老婆',
    '<img src="/sss/feilrpto.jpg">|||老婆',
    '<img src="/sss/maws.jpg">|||吗',
    '<img src="/sss/meimeid.jpg">|||妹妹',
    '<img src="/sss/fmgeyimehid.jpg">|||妹妹',
    '<img src="/sss/mingtn.jpg">|||明天',
    '<img src="/sss/tymyigngtyn.jpg">|||明天',
    '<img src="/sss/nvrenjj.jpg">|||女人',
    '<img src="/sss/nvdrfenfjfj.jpg">|||女人',
    '<img src="/sss/nvxudjj.jpg">|||女婿',
    '<img src="/sss/nvdxfudfjfj.jpg">|||女婿',
    '<img src="/sss/penyouxi.jpg">|||朋友',
    '<img src="/sss/fpefnyoturxi.jpg">|||朋友',
    '<img src="/sss/shangba.jpg">|||上班',
    '<img src="/sss/wesfhranrrgba.jpg">|||上班',
    '<img src="/sss/shangwo.jpg">|||上午',
    '<img src="/sss/gstjhranjgwjo.jpg">|||上午',
    '<img src="/sss/shenme.jpg">|||什么',
    '<img src="/sss/6shenumev.jpg">|||什么',
    '<img src="/sss/sjian.jpg">|||时间',
    '<img src="/sss/vfsjgigarn.jpg">|||时间',
    '<img src="/sss/shji.jpg">|||手机',
    '<img src="/sss/dfshfhhfjfi.jpg">|||手机',
    '<img src="/sss/shhua.jpg">|||说话',
    '<img src="/sss/bkbskhhuka.jpg">|||说话',
    '<img src="/sss/wuc.jpg">|||无',
    '<img src="/sss/xifup.jpg">|||媳妇',
    '<img src="/sss/gxgihftutp.jpg">|||媳妇',
    '<img src="/sss/xiabang.jpg">|||下班',
    '<img src="/sss/gfxgigagbfadng.jpg">|||下班',
    '<img src="/sss/xiawu.jpg">|||下午',
    '<img src="/sss/gnxnifawhu.jpg">|||下午',
    '<img src="/sss/xiansg.jpg">|||先生',
    '<img src="/sss/xeieavnfsg.jpg">|||先生',
    '<img src="/sss/xianggx.jpg">|||相公',
    '<img src="/sss/xdidafnggx.jpg">|||相公',
    '<img src="/sss/xiaxin.jpg">|||相信',
    '<img src="/sss/hxiapxint.jpg">|||相信',
    '<img src="/sss/xiaoje.jpg">|||小姐',
    '<img src="/sss/xdifagojge.jpg">|||小姐',
    '<img src="/sss/xiaoxinyy.jpg">|||小心',
    '<img src="/sss/gxhigfadnoxihnyy.jpg">|||小心',
    '<img src="/sss/xondi.jpg">|||兄弟',
    '<img src="/sss/gxronfdri.jpg">|||兄弟',
    '<img src="/sss/zome.jpg">|||怎么',
    '<img src="/sss/fezrormre.jpg">|||怎么',
    '<img src="/sss/zenme.jpg">|||怎么',
    '<img src="/sss/zangfl.jpg">|||丈夫',
    '<img src="/sss/fzagnggfbl.jpg">|||丈夫',
    '<img src="/sss/zhido.jpg">|||知道',
    '<img src="/sss/zzhiedo3.jpg">|||知道',
    '<img src="/sss/ziji.jpg">|||自己',
    '<img src="/sss/zibjib.jpg">|||自己',
    '<img src="/sss/ddefr.jpg">|||',
    '“(.*?)“|||“$1”',
    '\\s+|||',
    '<spanclass="watermark">.*?</span>|||',
    '<HEAD>.*?</HEAD>|||',
    '<br.*?>|||换行',
    '<br/>|||换行',
    '<p.*?>|||换行',
    '</p>|||换行',
    '<spanstyle="display:none">.*?</span>|||',
    '<strong.*?>.*?</strong>|||',
    '<a.*?>.*?</a>|||',
    '<center.*?>.*?</center>|||换行',
    '<style.*?>.*?</style>|||换行',
    '<script.*?>.*?</script>|||换行',
    '<ul.*?>.*?</ul>|||',
    '<b.*?>.*?</b>|||换行',
    '</\\w+>|||',
    '<\\w+>|||换行',
    '换行|||\r\n',
    '\\s+|||\r\n　　',
    '\r\n　　$|||',
  ];
  var regexp = new RegExp();
  var temp;
  for (var i = 0; i < replaceLib.length; i++) {
    temp = replaceLib[i].split('|||');
    regexp = new RegExp(temp[0], 'gi');
    word = word.replace(regexp, temp[1]);
  }
  word = '　　' + word;
  return word;
}
function addDownloadLogStart(num, url, status) {
  jQuery('<span id="bookDownloaderLogDiv_' + num + '">' + num + ' <a href="' + url + '" target="_blank">' + num + '</a> ' + status + '<br/></span>').appendTo(jQuery('#bookDownloaderLogDiv'));
  jQuery('#bookDownloaderLogDiv') [0].scrollBy(0, 10);
}
function addDownloadLogEnd(num, name, url, status) {
  jQuery('#bookDownloaderLogDiv_' + num).html(num + ' <a href="' + url + '" target="_blank">' + name + '</a> ' + status + '<br/>').addClass('bookDownloaderOk');
  jQuery('#bookDownloaderLogDiv') [0].scrollBy(0, 10);
}
function download2Zip(bookName) { //下载到1个zip
  var name = (bookName === '') ? jQuery(window).data('dataDownload') [0].name : bookName;
  jQuery(window).data('blob', new JSZip());
  var leng = String(jQuery(window).data('dataDownload').length).length;
  for (var i = 0; i < jQuery(window).data('dataDownload').length; i++) {
    jQuery(window).data('blob').file(String(preZeroFill(i, leng)) + '-' + jQuery(window).data('dataDownload') [i].name + '.txt', jQuery(window).data('dataDownload') [i].name + '\r\n' + jQuery(window).data('dataDownload') [i].content);
  }
  jQuery(window).data('blob').file('###说明文件.txt', '本压缩包由用户脚本novelDownloader制作，安装地址：https://greasyfork.org/zh-CN/scripts/21515')
  jQuery(window).data('blob').generateAsync({
    type: 'blob'
  }).then(function (content) {
    jQuery('#bookDownloader').click(function () {
      saveAs(content, name + '.zip');
    })
    saveAs(content, name + '.zip');
  });
  removeData();
}
function download2Epub(bookName) {
  var name = (bookName === '') ? jQuery(window).data('dataDownload') [0].name : bookName;
  var leng = String(jQuery(window).data('dataDownload').length).length;
  jQuery(window).data('blob', new JSZip());
  jQuery(window).data('blob').file('mimetype', 'application/epub+zip');
  var META_INF = jQuery(window).data('blob').folder('META-INF');
  META_INF.file('container.xml', '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles></container>');
  var OEBPS = jQuery(window).data('blob').folder('OEBPS');
  OEBPS.file('stylesheet.css', 'body{padding:0%;margin-top:0%;margin-bottom:0%;margin-left:1%;margin-right:1%;line-height:130%;text-align:justify}div{margin:0px;padding:0px;line-height:130%;text-align:justify}p{text-align:justify;text-indent:2em;line-height:130%}h1{line-height:130%;text-align:center;font-weight:bold;font-size:xx-large}h2{line-height:130%;text-align:center;font-weight:bold;font-size:x-large}h3{line-height:130%;text-align:center;font-weight:bold;font-size:large}');
  var lang = (parseInt(jQuery('.bookDownloaderLang:checked') [0].value) === 0) ? 'zh-CN' : 'zh-TW';
  var content_opf = '<?xml version="1.0" encoding="UTF-8"?><package version="2.0" unique-identifier="' + location.href + '" xmlns="http://www.idpf.org/2007/opf"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf"><dc:title>' + bookName + '</dc:title><dc:creator>novelDownloader</dc:creator><dc:identifier id="bookid">urn:uuid:' + location.href + '</dc:identifier><dc:language>' + lang + '</dc:language></metadata><manifest>';
  var toc_ncx = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="urn:uuid:' + location.href + '"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>' + bookName + '</text></docTitle><navMap><navPoint id="navpoint-1" playOrder="1"><navLabel><text>首页</text></navLabel><content src="title.html"/></navPoint>';
  var item = '<item id="ncx" href="toc.ncx" media-type="text/xml"/><item id="cover" href="title.html" media-type="application/xhtml+xml"/><item id="css" href="stylesheet.css" media-type="text/css"/>';
  var itemref = '<itemref idref="cover" linear="no"/>';
  for (var i = 0; i < jQuery(window).data('dataDownload').length; i++) {
    var _name = String(preZeroFill(i, leng));
    var playOrder = i + 2;
    toc_ncx += '<navPoint id="chapter' + _name + '" playOrder="' + playOrder + '"><navLabel><text>' + jQuery(window).data('dataDownload') [i].name + '</text></navLabel><content src="' + _name + '.html"/></navPoint>';
    item += '<item id="chapter' + _name + '" href="' + _name + '.html" media-type="application/xhtml+xml"/>';
    itemref += '<itemref idref="chapter' + _name + '"/>';
    OEBPS.file(_name + '.html', '<html xmlns="http://www.w3.org/1999/xhtml"><head><title>' + jQuery(window).data('dataDownload') [i].name + '</title><link type="text/css" rel="stylesheet" media="all" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h3>' + jQuery(window).data('dataDownload') [i].name + '</h3><div><p>' + jQuery(window).data('dataDownload') [i].content.replace(/\r\n/g, '<p></p>') + '</p></div></body></html>');
  }
  content_opf = content_opf + item + '</manifest><spine toc="ncx">' + itemref + '</spine><guide><reference href="title.html" type="cover" title="Cover"/></guide></package>';
  toc_ncx += '</navMap></ncx>';
  OEBPS.file('content.opf', content_opf);
  OEBPS.file('toc.ncx', toc_ncx);
  OEBPS.file('title.html', '<html xmlns="http://www.w3.org/1999/xhtml"><head><title>' + bookName + '</title><link type="text/css" rel="stylesheet" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h1>' + bookName + '</h1><h2>本电子书由用户脚本novelDownloader制作，安装地址：https://greasyfork.org/zh-CN/scripts/21515</h2></body></html>');
  jQuery(window).data('blob').generateAsync({
    type: 'blob'
  }).then(function (content) {
    jQuery('#bookDownloader').click(function () {
      saveAs(content, name + '.epub');
    })
    saveAs(content, name + '.epub');
  });
  removeData();
}
function download2Txt(bookName) { //下载到1个txt
  var name = (bookName === '') ? jQuery(window).data('dataDownload') [0].name : bookName;
  var all = '';
  for (var i = 0; i < jQuery(window).data('dataDownload').length; i++) {
    all += jQuery(window).data('dataDownload') [i].name + '\r\n' + jQuery(window).data('dataDownload') [i].content + '\r\n\r\n';
  }
  all = '阅读前说明：\n本书籍由用户脚本novelDownloader制作，安装地址：https://greasyfork.org/zh-CN/scripts/21515\n\n' + all;
  jQuery(window).data('blob', new Blob([all], {
    type: 'text/plain;charset=utf-8'
  }));
  jQuery('#bookDownloader').click(function () {
    saveAs(jQuery(window).data('blob'), name + '.txt');
  })
  saveAs(jQuery(window).data('blob'), name + '.txt');
  removeData();
}
function downloadedCheck(arr) { //检查下载是否完成
  var undownload = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].ok) {
      addDownloadLogEnd(parseInt(i) + 1, arr[i].name, arr[i].url, '成功');
    } else {
      undownload++;
    }
  }
  return (undownload === 0) ? true : false;
}
function getHostName(url) { //获取网址域名
  return (/^http(s|):\/\//.test(url)) ? url.split('/') [2] : url.split('/') [0];
}
function preZeroFill(num, size) { //用0补足指定位数，来自https://segmentfault.com/q/1010000002607221，作者：captainblue与solar
  if (num >= Math.pow(10, size)) { //如果num本身位数不小于size位
    return num.toString();
  } else {
    var _str = Array(size + 1).join('0') + num;
    return _str.slice(_str.length - size);
  }
}
function utf8to16(str) { //来自http://www1.tc711.com/tool/js/Base64.js
  var out,
  i,
  len,
  c;
  var char2,
  char3;
  out = '';
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4)
      {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 31) << 6) | (char2 & 63));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 15) << 12) | ((char2 & 63) << 6) | ((char3 & 63) << 0));
        break;
    }
  }
  return out;
}
function base64decode(str) { //来自http://www1.tc711.com/tool/js/Base64.js
  var base64DecodeChars = new Array( - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, 62, - 1, - 1, - 1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, - 1, - 1, - 1, - 1, - 1, - 1, - 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, - 1, - 1, - 1, - 1, - 1, - 1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, - 1, - 1, - 1, - 1, - 1);
  var c1,
  c2,
  c3,
  c4;
  var i,
  len,
  out;
  len = str.length;
  i = 0;
  out = '';
  while (i < len) {
    /* c1 */
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 255];
    } while (i < len && c1 == - 1);
    if (c1 == - 1)
    break;
    /* c2 */
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 255];
    } while (i < len && c2 == - 1);
    if (c2 == - 1)
    break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 48) >> 4));
    /* c3 */
    do {
      c3 = str.charCodeAt(i++) & 255;
      if (c3 == 61)
      return out;
      c3 = base64DecodeChars[c3];
    } while (i < len && c3 == - 1);
    if (c3 == - 1)
    break;
    out += String.fromCharCode(((c2 & 15) << 4) | ((c3 & 60) >> 2));
    /* c4 */
    do {
      c4 = str.charCodeAt(i++) & 255;
      if (c4 == 61)
      return out;
      c4 = base64DecodeChars[c4];
    } while (i < len && c4 == - 1);
    if (c4 == - 1)
    break;
    out += String.fromCharCode(((c3 & 3) << 6) | c4);
  }
  return out;
}
function objComp(obj1, obj2) { //js对象的比较，来自http://www.jb51.net/article/26372.htm
  if (obj1 == obj2)
  return true;
  if (typeof (obj2) == 'undefined' || obj2 == null || typeof (obj2) != 'object')
  return false;
  var length = 0;
  var length1 = 0;
  for (var ele in obj1) {
    length++;
  }
  for (var ele in obj2) {
    length1++;
  }
  if (length != length1)
  return false;
  if (obj2.constructor == obj1.constructor) {
    for (var ele in obj1) {
      if (typeof (obj1[ele]) == 'object') {
        if (!objComp(obj1[ele], obj2[ele]))
        return false;
      } else if (typeof (obj1[ele]) == 'function') {
        if (!objComp(obj1[ele].toString(), obj2[ele].toString()))
        return false;
      } else if (obj1[ele] != obj2[ele])
      return false;
    }
    return true;
  }
  return false;
};
function arrSort(propertyName) { //对象数组排序函数，从小到大排序，来自http://www.jb51.net/article/24536.htm
  return function (object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value2 < value1) {
      return 1;
    } else if (value2 > value1) {
      return - 1;
    } else {
      return 0;
    }
  }
}
