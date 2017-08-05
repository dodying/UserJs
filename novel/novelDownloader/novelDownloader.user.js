// ==UserScript==
// @name        novelDownloader
// @name:zh-CN  【小说】下载脚本
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description novelDownloaderHelper，press key "shift+d" to show up.
// @description:zh-CN 按“Shift+D”来显示面板，现支持自定义规则
// @version     1.41.4
// @require     https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @require     https://cdn.bootcss.com/jszip/3.0.0/jszip.min.js
// @require     https://greasyfork.org/scripts/21541/code/chs2cht.js?version=137286
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
//              搜索引擎
// @include     http*://www.baidu.com/s?*wd=*
// @include     http*://www.baidu.com/s?*word=*
// @include     http*://www.baidu.com/baidu?*wd=*
// @include     http*://www.baidu.com/baidu?*word=*
// @include     http*://cn.bing.com/search?*q=*
// @include     http*://www.sogou.com/web?query=*
// @include     http*://www.so.com/s?*q=*
//              文学
// @include     http*://gj.zdic.net/archive.php?aid=*
// @include     http*://www.99lib.net/book/*.htm
// @include     http*://www.kanunu8.com/book*
// @include     http*://scp-wiki-cn.wikidot.com/*
// @include     http*://www.scp-wiki.net/*
//              正版
// @include     http*://book.qidian.com/info/*
// @include     http*://read.qidian.com/chapter/*/*
// @include     http*://vipreader.qidian.com/BookReader/vip,*,*.aspx
// @include     http*://www.qdmm.com/BookReader/*.aspx
// @include     http*://chuangshi.qq.com/bk/*/*-*.html
// @include     http*://yunqi.qq.com/bk/*/*-*.html
// @include     http*://dushu.qq.com/intro.html*
// @include     http*://book.tianya.cn/html2/dir.aspx*
// @include     http*://book.tianya.cn/chapter-*-*
// @include     http*://www.hbooker.com/book/*
// @include     http*://www.hbooker.com/chapter-list/*/book_detail
// @include     http*://www.hbooker.com/chapter/book_chapter_detail*
// @include     http*://www.3gsc.com.cn/bookreader/*
// @include     http*://book.zongheng.com/showchapter/*
// @include     http*://book.zongheng.com/chapter/*/*
// @include     http*://huayu.baidu.com/showchapter/*
// @include     http*://huayu.baidu.com/chapter/*/*
// @include     http*://www.17k.com/list/*
// @include     http*://www.17k.com/chapter/*/*
// @include     http*://www.8kana.com/book/*
// @include     http*://www.8kana.com/read/*
// @include     http*://www.heiyan.com/book/*/*
// @include     http*://www.sndream.cn/book/*/*
// @include     http*://b.faloo.com/f/*
// @include     http*://b.faloo.com/p/*/*
// @include     http*://www.jjwxc.net/onebook.php*
// @include     http*://www.xxsy.net/books/*/*
// @include     http*://book.zhulang.com/*
// @include     http*://novel.hongxiu.com/a/*/*.html
// @include     http*://www.readnovel.com/book/*
// @include     http*://www.readnovel.com/novel/*.html
// @include     http*://www.xs8.cn/book/*.html
// @exclude     http*://www.xs8.cn/book/*/index.html
// @include     http*://book.hjsm.tom.com/*/c*.html
// @include     http*://www.kanshu.com/files/article/html/*
// @include     http*://book.weibo.com/weibobook/book/*
// @include     http*://book.weibo.com/book/play/*-*.html
// @include     http*://www.lcread.com/bookpage/*/*
// @include     http*://www.motie.com/book/*
// @include     http*://www.shuhai.com/read/*
// @include     http*://www.xiang5.com/booklist/*
// @include     http*://www.xiang5.com/content/*/*
// @include     http*://read.fmx.cn/files/article/html/*
// @include     http*://novel.feiku.com/*/*
// @include     http*://www.abada.com/Book/*/*
// @exclude     http*://www.abada.com/Book/*/index.html
// @include     http*://www.kujiang.com/book/*/*
// @include     http*://www.tadu.com/book/catalogue/*
// @include     http*://www.tadu.com/book/*/*/
// @include     http*://yuedu.163.com/newBookReader.do*
// @include     http*://yuedu.163.com/source/*
// @include     http*://yuedu.163.com/book_reader/*/*
// @include     http*://ebook.longmabook.com/showbook*
// @include     http*://ebook.longmabook.com/showpaperword*
// @include     http*://www.yueloo.com/read/*
// @include     http*://www.1001p.com/book/*.html
// @include     http*://www.yqsd.cn/html/*
// @include     http*://book.xxs8.com/*3
// @include     http*://www.longruo.com/chapterlist/*
// @include     http*://www.longruo.com/catalog/*_*.html
// @include     http*://www.cjzww.com/book/*
// @include     http*://www.hxtk.com/html/*
// @include     http*://www.hongshu.com/bookreader/*
// @include     http*://www.hongshu.com/content/*
// @include     http*://www.qwsy.com/mulu/*
// @include     http*://www.qwsy.com/read.aspx*
// @include     http*://www.rongshuxia.com/book/volume/*
// @include     http*://www.rongshuxia.com/chapter/*
// @include     http*://vip.shulink.com/files/article/html/*
// @include     http*://www.4yt.net/portal/directory/catalog*
// @include     http*://www.4yt.net/portal/read/freecontent*
// @include     http*://www.soudu.net/html/*
// @include     http*://lz.book.sohu.com/book-*.html
// @include     http*://lz.book.sohu.com/chapter-*.html
// @include     http*://www.fbook.net/book/*
// @include     http*://www.junshishu.com/Book*/*
// @include     http*://www.wjsw.com/html/*
// @include     http*://www.yokong.com/book/*
// @include     http*://www.chuangbie.com/book/read_list/book_id/*
// @include     http*://www.chuangbie.com/book/read/book_id/*
// @include     http*://www.nsnovel.com/book/*
// @include     http*://www.msxf.net/book/*
// @include     http*://www.popo.tw/books/*/articles*
// @include     http*://www.anyew.com/chapters/11557/
// @include     http*://www.anyew.com/book/*.html
//              轻小说
// @include     http*://www.wenku8.com/novel/*/*/*
// @include     http*://book.sfacg.com/Novel/*
// @include     http*://xs.dmzj.com/*/index.shtml
// @include     http*://xs.dmzj.com/*/*/*.shtml
// @include     http*://www.yidm.com/article/html/*/*/*
// @include     http*://book.suixw.com/modules/article/reader.php*
// @include     http*://www.iqing.in/book/*
// @include     http*://www.iqing.in/read/*
//              盗贴
// @include     http*://www.bookgew.com/Html/Book/*
// @include     http*://www.xiaoshuokan.com/haokan/*
// @include     http*://www.vv44.net/novel/*
// @include     http*://www.chuanyue8.com/files/article/html/*
// @include     http*://*kansha.cc/shuji*.aspx*
// @include     http*://www.22ff.com/xs/*
// @include     http*://www.xntk.net/html/*
// @include     http*://www.xntk.net/book_j.php*
// @include     http*://www.xiaoshuoan.com/*
// @include     http*://www.kong5.com/*/
// @include     http*://www.567zw.com/html/*
// @include     http*://www.hunhun520.com/book/*
// @include     http*://www.3zcn.org/3z/*
// @include     http*://www.tanxshu.net/*
// @include     http*://www.booksrc.net/book/*
// @include     http*://www.yushuwu.net/read/*
// @include     http*://www.blwen.com/*
// @include     http*://www.mpzw.com/html/*
// @include     http*://www.mpzw.com/modules/article/reader.php?*
// @include     http*://www.ledubar.com/book/*
// @include     http*://www.yilego.com/book/*
// @include     http*://www.00xs.cc/xiaoshuo/*/*/
// @include     http*://www.kenshu.cc/xiaoshuo/*
// @include     http*://www.bl5xs.com/read/*
// @include     http*://www.151xs.com/*/chapter/*
// @include     http*://www.quanbenba.com/yuedu/*
// @include     http*://www.pbtxt.com/*
// @include     http*://www.lread.net/read/*
// @include     http*://www.lewen8.com/lw*/*
// @include     http*://www.yfzww.com/Book/*
// @include     http*://www.yfzww.com/Read/*
// @include     http*://www.biquge.tw/*_*/*
// @include     http*://www.e8zw.com/book/*
// @include     http*://www.8shuw.net/book/*
// @include     http*://www.hjwzw.com/Book/Chapter/*
// @include     http*://www.hjwzw.com/Book/Read/*
// @include     http*://book.58xs.com/html/*
// @include     http*://www.5858xs.com/html/*
// @include     http*://www.my285.com/*
// @include     http*://wx.ty2016.net/*
// @include     http*://www.ty2016.net/*
// @include     http*://www.chinaisbn.com/*
// @include     http*://www.uuxiaoshuo.net/html/*
// @include     http*://www.5200zw.com/*
// @include     http*://www.zbzw.com/*
// @include     http*://www.5ycn.com/*
// @include     http*://www.book108.com/*
// @include     http*://www.23txt.com/files/article/html/*
// @include     http*://www.9wh.net/*
// @include     http*://www.59tto.com/files/article/xiaoshuo/*
// @include     http*://www.360118.com/html/*
// @include     http*://www.bookba.net/mulu-*-list.html
// @include     http*://www.bookba.net/read-*-chapter-*.html
// @include     http*://www.qianrenge.net/book/*
// @include     http*://www.dushuge.net/html/*
// @include     http*://www.cmxsw.com/files/article/html/*
// @include     http*://www.xiaoyanwenxue.com/xs/*
// @include     http*://www.5800.cc/5200/*
// @include     http*://www.1kanshu.cc/files/article/html/*
// @include     http*://www.biquguan.com/bqg*/*
// @include     http*://www.wenxuemm.com/book/*
// @include     http*://www.chinaliangzhu.com/*
// @include     http*://www.23us.cc/html/*
// @include     http*://www.88dushu.com/xiaoshuo/*
// @include     http*://www.630book.cc/shu/*
// @include     http*://www.podlook.com/*
// @include     http*://www.luoqiu.com/read/*/*
// @include     http*://www.7kshu.com/*/*/*
// @include     http*://www.zhuaji.org/read/*/*
// @include     http*://www.d8qu.com/html/*
// @include     http*://www.92zw.com/files/article/html/*
// @include     http*://www.tlxsw.com/files/article/html/*
// @include     http*://www.59shuku.com/book/*
// @include     http*://www.bjxiaoshuo.com/files/article/html/*
// @include     http*://www.xs222.com/html/*
// @include     http*://www.wenchangshuyuan.com/xiaoshuo/*
// @include     http*://www.yqhhy.cc/*
// @include     http*://www.shunong.com/*
// @include     http*://paitxt.com/*
// @include     http*://www.hkxs99.net/*
// @include     http*://www.kanshu.la/book/*
// @include     http*://www.doulaidu.com/xs/*
// @include     http*://www.shuotxts.com/*
// @include     http*://www.151kan.com/kan/*
// @include     http*://www.fkzww.com/Html/Book/*
// @include     http*://www.shenmabook.com/ml-*/
// @include     http*://www.ttzw.com/book/*
// @include     http*://www.xiaoshuo2016.com/*
// @include     http*://www.shuhaha.com/Html/Book/*
// @include     http*://www.79xs.com/Html/Book/*
// @include     http*://www.bookgew.com/Html/Book/*
// @include     http*://www.23wx.com/html/*
// @include     http*://www.biquge.la/book/*
// @include     http*://www.shumilou.co/*
// @include     http*://www.quledu.com/wcxs-*/
// @include     http*://www.mangg.com/id*
// @include     http*://www.23zw.com/olread/*/*/*
// @include     http*://www.31wxw.com/*/*/*
// @include     http*://www.520xs.la/*/*
// @include     http*://www.biquge.com/*_*/*
// @include     http*://www.69shu.com/*
// @include     http*://www.biquku.com/*
// @include     http*://www.5ccc.net/xiaoshuo/*
// @include     http*://www.aiquxs.com/read/*/*/*
// @include     http*://www.2kxs.com/xiaoshuo/*
// @include     http*://www.mianhuatang.la/*/*
// @include     http*://www.23wx.in/*
// @include     http*://www.suimeng.la/files/article/html/*
// @include     http*://www.00ksw.com/html/*
// @include     http*://www.wangshuge.com/books/*
// @include     http*://tt.71wx.net/xiaoshuo/*/*
// @include     http*://www.71wx.net/xiaoshuo/*/*
// @include     http*://www.kuaidu.cc/*/
// @include     http*://www.vodtw.com/Html/Book/*/*/*
// @include     http*://www.sqsxs.com/book/*
// @include     http*://www.dashubao.co/book/*/*/*
// @include     http*://www.iqingdou.net/chapter_*.html
// @include     http*://www.aszw520.com/book/*
// @include     http*://www.abcsee.net/book/*/*/*
// @include     http*://www.bxwx.cc/*/*/*
// @include     http*://www.uecg.net/html/*/*/*
// @include     http*://www.5du5.com/book/*
// @include     http*://www.klxsw.com/files/article/html/*/*/*
// @include     http*://www.3gxs.com/html/*/*/*
// @include     http*://www.baoliny.com/*/*
// @include     http*://www.dhzw.com/book/*
// @include     http*://www.bxwx8.org/b/*/*/*
// @include     http*://www.dajiadu.net/files/article/html/*/*/*
// @include     http*://www.3dllc.com/html/*
// @include     http*://www.llwx.net/*_*/*
// @include     http*://www.paoshuba.cc/Partlist/*
// @include     http*://www.qmshu.com/html/*
// @include     http*://www.gdsanlian.com/html/*
// @include     http*://www.xinsiluke.com/book/*
// @include     http*://www.zhuzhudao.com/txt/*
// @include     http*://www.fqxsw.com/book/*
// @include     http*://www.baquge.com/files/article/html/*/*/*
// @include     http*://www.bookabc.net/*
// @include     http*://www.13xs.com/xs/*/*/*
// @include     http*://www.1xiaoshuo.com/*
// @include     http*://www.daomengren.com/*_*/*
// @include     http*://www.daomengren.com/*_*/*
// @include     http*://www.xs84.me/*_*/
// @include     http*://www.zhaifans.com/novel-*-*.html
// @include     http*://www.ranwen.org/files/article/*
// @include     http*://www.773buy.com/html/*
// @include     http*://www.00sy.com/xiaoshuo/*
// @include     http*://www.qingkan520.com/book/*
// @include     http*://www.xiaoxiaoshuwu.com/read/*
// @include     http*://www.xiaoxiaoshuwu.com/shtml/*/*/*
// @include     http*://www.99shumeng.org/shu/*/*/*
// @include     http*://www.bookbao.net/views/*/*/*
// @include     http*://www.bookbao.net/book/*/*/*
// @include     http*://www.sto.cc/*-*/
// @include     http*://www.shouda8.com/*
// @include     http*://www.shumilou.net/*/*/
// @include     http*://www.64mi.com/book/*/*/
// @include     http*://www.zhuzhudao.cc/*_*/*
// @include     http*://www.wanshuba.com/Html/*
// @include     http*://www.6yzw.com/*_*/*
// @include     http*://www.muyuge.com/*_*/*
// @include     http*://www.zaiduu.com/zaidu*/*
// @include     http*://www.musemailsvr.com/*
// @include     http*://www.lewenwu.com/books/*/*/*
// @include     http*://www.50zw.co/book_*/*
// @include     http*://www.xiangcunxiaoshuo.com/html/*
// @include     http*://www.lwxs520.com/books/*
// @include     http*://www.scwzw.net/SC/*
// @include     http*://www.yunlaige.com/html/*
// @include     http*://www.cfwx.net/files/article/html/*
// @include     http*://www.qiuwu.net/html/*
// @include     http*://www.33yq.com/read/*
// @include     http*://www.xs74.com/novel/*
// @include     http*://www.fhxiaoshuo.com/read/*
// @include     http*://www.snwx.com/book/*
// @include     http*://www.yawen8.com/dushi/*
// @include     http*://www.7dsw.com/book/*
// @include     http*://www.20xs.cc/dingdian/*_*/*
// @include     http*://www.piaotian.net/html/*
// @include     http*://www.biquge.com.tw/*_*/*
// @include     http*://www.xzmao.net/read/*
// @include     http*://www.shuyaya.com/read/*
// @include     http*://www.freexs.cn/novel/*
// @include     http*://guji.artx.cn/Article/*
// @include     http*://www.zhaishu8.com/xiaoshuo/*
// @include     http*://www.yxgsk.com/files/article/html/*
// @include     http*://www.uctxt.com/book/*
// @include     http*://www.17shu.com/book/*
// @include     http*://www.xzcl.com/*
// @include     http*://www.xunread.com/article/*
// @include     http*://www.xiucaiwu.com/html/*
// @include     http*://www.xiaoshuomm.org/files/article/html/*
// @include     http*://www.xiaoshuo570.com/csxs/*
// @include     http*://www.70shu.com/xiaolei*/*
// @include     http*://www.wuxia.net.cn/book/*
// @include     http*://www.23xs.org/shu/*
// @include     http*://www.wucuoshu.com/book/*
// @include     http*://www.shulou.cc/read/*
// @include     http*://www.yssm.org/uctxt/*
// @include     http*://www.114zw.la/*
// @include     http*://www.15k.cc/*_*/*
// @include     http*://www.33xs.com/33xs/*
// @include     http*://www.360wxw.com/book/html/*
// @include     http*://www.3gtxt.com/view/*
// @include     http*://www.51kanshuu.com/kanshu/*
// @include     http*://www.57xs.com/html/*
// @include     http*://www.73wx.com/*
// @include     http*://www.d7zy.com/*
// @include     http*://www.liaoshuwang.com/txt/*
// @include     http*://www.qfxs.cc/book_*/*
// @include     http*://www.fenghuaju.cc/*_*/*
// @include     http*://www.52ea.com/chapter/*
// @include     http*://www.shuqi6.com/*
// @include     http*://www.kukukanshu.cc/*
// @include     http*://www.qbiquge.com/*_*/*
// @include     http*://www.96wei.com/zhangjie/*
// @include     http*://www.96wei.com/showcontent/*
// @include     http*://www.23us.us/files/article/html/*
// @include     http*://www.23us.so/files/article/html/*
// @include     http*://www.32xs.com/html/*
// @include     http*://www.23wx.cc/du/*
// @include     http*://www.booktxt.net/*_*/*
// @include     http*://www.xdingdian.com/read/*
// @include     http*://www.45book.com/txt/*
// @include     http*://www.81zw.org/book/*
// @include     http*://www.ddbiquge.com/chapter/*
// @include     http*://www.dingdianzw.com/chapter/*
// @include     http*://www.wucuo.cc/wcxs/*
// @include     http*://www.epzwxs.com/files/article/html/*
// @include     http*://www.ibiquge.net/*_*/*
// @include     http*://www.bxwx.us/book/*
// @include     http*://www.ldks.cc/*_*/*
// @include     http*://www.xuehong.cc/book/*
// @include     http*://www.bipuge.com/*
// @include     http*://www.4gbk.com/book/*
// @include     http*://www.927xs.com/*_*/*
// @include     http*://www.shubaowx.com/*_*/*
// @include     http*://www.biqukan.com/*_*/*
// @include     http*://www.35zw.com/kan/*
// @include     http*://www.23wxw.cc/html/*
// @include     http*://www.kwxs.com/book/*
// @include     http*://www.kan61.com/txt/*
// @include     http*://www.junzige.la/novel/*
// @include     http*://www.lwxs.la/books/*
// @include     http*://www.lwxs.com/shu/*
// @include     http*://www.nuomi9.com/book/*
// @include     http*://www.feizw.com/Html/*
// @include     http*://www.touxiang.la/xs/*
// @include     http*://www.biquga.com/*_*/*
// @include     http*://www.65xs.com/book/*
// @include     http*://www.530p.com/*/*-*/*
// @include     http*://www.89wx.com/html/book/*
// @include     http*://www.97xs.net/*
// @include     http*://www.99zw.cn/files/article/html/*
// @include     http*://www.88zw.com/b/*
// @include     http*://www.nwell.net/main/book_list.asp?*
// @include     http*://www.nwell.net/main/book_show.asp?*
// @include     http*://www.u8xs.com/html/*
// @include     http*://www.xcmfu.com/files/article/html/*
// @include     http*://www.uuxs.net/book/*
// @include     http*://www.ifxsw.com/book/*
// @include     http*://www.axxsw.org/*
// @include     http*://www.8jzw.com/Html/Book/*
// @include     http*://www.81zw.com/book/*
// @include     http*://www.100huts.com/Html/*
// @include     http*://baishuku.com/html/*
// @include     http*://www.bj-ibook.cn/html/*
// @include     http*://www.sj133.com/files/article/html/*
// @include     http*://www.d5wx.com/*_*/*
// @include     http*://www.lnwow.com/html/book/*
// @include     http*://www.23us.la/html/*
// @include     http*://www.dddbbb.net/*
// @include     http*://www.du8w.com/xiaoshuo/*
// @include     http*://www.fengwu.net/html/*
// @include     http*://www.geilwx.com/GeiLi/*
// @include     http*://www.uukanshu.com/b/*
// @include     http*://www.hxsk.net/*_*/*
// @include     http*://www.99reader.cn/files/article/html/*
// @include     http*://www.cc98.cc/jiujiu/*
// @include     http*://www.oldrain.com/*
// @include     http*://www.92txt.net/book/*
// @include     http*://www.jsnovel.com/html/*
// @include     http*://www.kehuan.net.cn/book/*
// @include     http*://www.kuwen.net/lyd*/*
// @include     http*://leduwo.com/book/*
// @include     http*://www.mingshulou.com/*_*/*
// @include     http*://www.nitxt.com/liebiao/*
// @include     http*://www.nitxt.com/neirong/*
// @include     http*://www.niheng.com/*
// @include     http*://www.pnxs.com/*
// @include     http*://www.pgyzw.com/html/*
// @include     http*://book.ceqq.com/read_book.asp?*
// @include     http*://www.xiaoshuo77.com/view/*
// @include     http*://www.qudushu.com/html/*
// @include     http*://www.7kankan.com/files/article/html/*
// @include     http*://www.ybdu.com/xiaoshuo/*
// @include     http*://www.quanbenn.com/read/*
// @include     http*://www.quanshu.net/book/*
// @include     http*://www.ranwenzw.com/*
// @include     http*://www.52ranwen.net/book/*
// @include     http*://www.3zm.net/files/article/html/*
// @include     http*://www.xcxs.net/files/article/html/*
// @include     http*://www.kanshutang.net/files/article/html/*
// @include     http*://www.zshu.net/zshu/article*
// @include     http*://www.shuanshu.com/files/article/html/*
// @include     http*://www.syzww.net/read/*
// @include     http*://www.soso33.com/txt/*
// @include     http*://90xsw.com/xs/*
// @include     http*://www.tsxsw.com/html/*
// @include     http*://www.wm263.com/*
// @include     http*://www.103v.com/html/*
// @include     http*://www.wencuige.com/chapter/*
// @include     http*://www.wenxg.com/*
// @include     http*://www.zy200.com/*
// @include     http*://www.mkxs.com/*
// @include     http*://www.shenhen.com/shu/*
// @include     http*://www.23xsw.cc/book/*
// @include     http*://www.biquge.cc/html/*
// @include     http*://www.19lou.tw/html/*
// @include     http*://www.136book.com/*
// @include     http*://www.88106.com/book/*
// @include     http*://tianyibook.com/*
// @include     http*://www.dawenxue.org/html/*
// @include     http*://www.amxs520.com/reader/*
// @include     http*://www.qiushu.cc/t/*
// @include     http*://www.txt99.cc/readbook/*
// @include     http*://www.wenxuemi.com/files/article/html/*
// @include     http*://quanxiaoshuo.com/
// @include     http*://www.akxs6.com/*
// @include     http*://www.benbenwx.com/*_*/*
// @include     http*://www.du7.com/html/*
// @include     http*://www.wuxianzuosi.com/shu/*
// @include     http*://www.wuxianzuosi.com/mianfei/*
// @include     http*://www.xuanhuanlou.com/*
// @include     http*://www.xiaoshuo777.com/*
// @include     http*://www.quanben.co/modules/article/reader.php*
// @include     http*://www.quanben5.com/n/*
// @include     http*://www.soxs.cc/*
// @include     http*://www.taotao3.com/full/*
// @include     http*://quanben-xiaoshuo.com/xiaoshuo/*
// @include     http*://quanben-xiaoshuo.com/read/*
// @include     http*://www.yanqing.cc/chapter_*.html
// @include     http*://www.bayueju.com/Book/*
// @include     http*://www.yqxs.com/data/book2/*
// @include     http*://www.zw360.com/zhangjie/*
// @include     http*://www.kanshu8.net/book/*
// @include     http*://www.45xs.com/books/*
// @include     http*://www.2018pc.com/files/article/html/*
// @include     http*://www.1778go.com/bookhtml/*
// @include     http*://www.qbyqxs.com/article/*
// @include     http*://www.zwxiaoshuo.com/book/*
// @include     http*://www.shubao22.com/xiazai/*
// @include     http*://www.55xs.com/files/article/html/*
// @include     http*://www.qingdoubook.com/files/article/html/*
// @include     http*://www.shuqiba.com/*
// @include     http*://www.xiuvi.com/*
// @include     http*://www.ryzww.com/*
// @include     http*://www.miaobige.com/read/*
//              18X
// @include     http*://www.haiax.net/files/article/html/*
// @include     http*://www.lewenxs.net/files/article/html/*
// @include     http*://www.wodexiaoshuo.com/*
// @include     http*://www.bashudu.com/book/*.html
// @include     http*://www.bashudu.com/read/*.html
// @include     http*://bbs.6park.com/bbs4/messages/*.html
// @include     http*://bbs.6park.com/bbs4/gmessages/*.html
// @include     http*://web.6park.com/classbk/md*.shtml
// @include     http*://web.6park.com/classbk/messages/*.html
// @include     http*://www.neixiong88.com/xiaoshuo/*
// @include     http*://www.chenfenggm.com/quanwen/*.html
// @include     http*://www.chenfenggm.com/txtbook/*.html
// @include     http*://www.xncwxw.com/files/article/html/*.html
// @include     http*://www.1766bbs.com/*
// @include     http*://www.bmwen.com/book*
// @include     http*://www.7788wx.com/Html/*
// @include     http*://www.beijingaishu.net/files/article/html/*
// @include     http*://www.dz88.com/book/*
// @include     http*://www.dz88.com/views/*
// @include     http*://www.kewaishu.net/yuedu/*
// @include     http*://www.luoqiu123.com/files/article/html/*
// @include     http*://www.xsy2.com/*
// @include     http*://www.baishulou.net/read/*
// @include     http*://www.ziqige3.com/book/*
// @include     http*://www.ziqige3.com/bookread/*
// @include     http*://www.lmzww.net/jlgcyy/*
// @include     http*://www.t259.com/read/*
// @include     http*://www.xt259.com/book/*
// @include     http*://www.ncwx.hk/wx/*
// @include     http*://520xs.co/*
// @include     http*://www.77xsk.com/novel/*
// @include     http*://www.wowoxs.com/files/article/html/*
// @include     http*://www.7zxs.com/ik258/*
// @include     http*://www.tushuguan.cc/*
// @include     http*://www.qingdou.info/book/*
// @include     http*://www.jipinwww.com/*
// @include     http*://www.duonie.com/files/article/html/*
// @include     http*://www.59tto.net/files/article/xiaoshuo/*
// @include     http*://www.qindouxs.net/book/*
// @include     http*://www.qindouxs.net/read/*
// @include     http*://www.shbdjs.org/files/article/html/*
// @include     http*://www.ik777.net/ik258/*
// @include     http*://www.hyperfree.com/amateur/sssbook/book/*
// @include     http*://www.woqudu.com/files/article/html/*
// include     http://18av.mm-cg.com/novel*
// include     http://18av.mm-cg.com/serch*
// ==/UserScript==

var debug = false;
var indexRule = new Object();
var chapterRule = new Object();
var reRule = new Object();
GM_registerMenuCommand('download novel', () => {
  init();
  jQuery('.nD-Main').toggle();
}, null);
jQuery(window).on('keydown', function(e) {
  if (e.shiftKey && e.keyCode === 68) { //Shift+D
    jQuery(window).off('keydown');
    init();
    jQuery('.nD-Main').toggle();
  }
});

function init() {
  (function() {
    //////////////////////////////////////////////////搜索引擎
    addIRuleForSearch('www.baidu.com', '.c-showurl', '#page>a', '#su', '#kw');
    addIRuleForSearch('cn.bing.com', '.b_attribution>cite', '.sb_pagF>li>a', '#sb_form_go', '#sb_form_q');
    addIRuleForSearch('www.sogou.com', '.fb>cite', '#pagebar_container>a', '#searchBtn', '#upquery');
    addIRuleForSearch('www.so.com', 'p.res-linkinfo>cite', '#page>a', '#su', '#keyword');
    //////////////////////////////////////////////////文学
    addIRule('gj.zdic.net', '汉典古籍', '#shuye>h1', '.mls>li>a');
    addCRule('gj.zdic.net', '#snr1>h1', '#snr2', 0, 1);
    addIRule('www.99lib.net', '九九藏书网', '#book_info>h2', '#dir>dd>a');
    addCRule('www.99lib.net', '#content>h2', '#content');
    addIRule('www.kanunu8.com', '努努书坊', 'h1>strong>font', 'body>div:nth-child(1)>table:nth-child(10)>tbody>tr:nth-child(4)>td>table:nth-child(2)>tbody>tr>td>a');
    addCRule('www.kanunu8.com', 'strong>font', 'p', 0, 1);
    addIRule('scp-wiki-cn.wikidot.com', 'SCP基金会', '#page-title', '.wiki-content-table td>a,#page-content td>a');
    addCRule('scp-wiki-cn.wikidot.com', '#page-title', '#page-content');
    addIRule('www.scp-wiki.net', 'SCP Foundation', '#page-title', '.wiki-content-table td>a,#page-content td>a');
    addCRule('www.scp-wiki.net', '#page-title', '#page-content');
    //////////////////////////////////////////////////正版
    addIRule('book.qidian.com', '起点主站', 'h1>em', '.volume>ul>li>a', '.volume>ul>li:has(.iconfont)>a');
    addCRule('book.qidian.com');
    addCRule('read.qidian.com', '.j_chapterName', '.read-content');
    addCRule('vipreader.qidian.com', '.j_chapterName', '.read-content');
    addIRule('www.qdmm.com', '起点女生', '.booktitle>h1', 'div.list a', '.box_title:contains(\'VIP\')+.box_cont>div.list>ul>li>a');
    chapterRule['www.qdmm.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = jQuery('.story_title>h1,.title>h3', response.response).text();
            var content = jQuery('script[src$=".txt"]', response.response);
            if (content.length > 0) {
              chapterRule['free.qidian.com'].Deal2(num, name, content);
            } else {
              content = jQuery('#content', response.response).html();
              thisDownloaded(num, name, content, 0);
            }
          }
        });
      },
      'Deal2': function(num, name, content) {
        var url = content.attr('src');
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          overrideMimeType: 'text/html; charset=gb2312',
          onload: function(response) {
            content = response.response.replace(/document\.write\(\'(.*)\'\);/, '$1');
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('chuangshi.qq.com', '创世中文网', '.title>a>b', 'div.list>ul>li>a', 'div.list:has(span.f900)>ul>li>a');
    chapterRule['chuangshi.qq.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = response.response.replace(/[\r\n]/g, '').replace(/.*\<title\>(.*)\<\/title\>.*/, '$1').replace(/.*_(.*)_.*/, '$1');
            var bid = response.response.replace(/[\r\n]/g, '').replace(/.*'bid' : '(\d+)'.*/g, '$1');
            var uuid = response.response.replace(/[\r\n]/g, '').replace(/.*'uuid' : '(\d+)'.*/g, '$1');
            var host = getHostName(url);
            chapterRule['chuangshi.qq.com'].Deal2(host, num, name, bid, uuid);
          }
        });
      },
      'Deal2': function(host, num, name, bid, uuid) {
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
        xhr.onload = function() {
          var content = JSON.parse(xhr.response).Content;
          if (host === 'chuangshi.qq.com') {
            var base = 30;
            var arrStr = new Array();
            var arrText = content.split('\\');
            for (var i = 1, len = arrText.length; i < len; i++) {
              arrStr.push(String.fromCharCode(parseInt(arrText[i], base)));
            }
            content = arrStr.join('');
          }
          content = jQuery('.bookreadercontent', content).html().replace('最新章节由云起书院首发，最新最火最快网络小说首发地！（本站提供：传统翻页、瀑布阅读两种模式，可在设置中选择）', '').replace('本作品腾讯文学发表，请登录', '').replace('dushu.qq.com', '').replace('浏览更多精彩作品。腾讯公司版权所有，未经允许不得复制', '');
          thisDownloaded(num, name, content, 0);
        }
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
          onload: function(response) {
            var info = JSON.parse(response.response);
            var name = info.data.curChapterName;
            var content = unsafeWindow.bitcake.dec(info.data.chapterContent).replace(/Hi.*|来自IP:\d+\.\d+\.\d+\.\d+/g, '');
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.hbooker.com', '欢乐书客', '.book-title>h3', '.book-chapter-list>.clearfix>li>a', '.book-chapter-list>.clearfix>li>a:has(.icon-vip)', false, 1);
    chapterRule['www.hbooker.com'] = {
      'Deal': function(num, url) {
        if (!jQuery(window).data('firstRun')) {
          jQuery(window).data('firstRun', true);
          jQuery('head').append('<script type="text/javascript" src="http://www.hbooker.com/resources/js/enjs.min.js"></script>');
        }
        var chapterId = url.replace('http://www.hbooker.com/chapter/book_chapter_detail/', '');
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://www.hbooker.com/chapter/ajax_get_session_code',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': 'http://www.hbooker.com/chapter/book_chapter_detail/' + chapterId,
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: 'chapter_id=' + chapterId,
          onload: function(response) {
            var json = JSON.parse(response.response);
            var accessKey = json.chapter_access_key;
            chapterRule['www.hbooker.com'].Deal2(num, url, accessKey)
          }
        });
      },
      'Deal2': function(num, url, accessKey) {
        var chapterId = url.replace('http://www.hbooker.com/chapter/book_chapter_detail/', '');
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://www.hbooker.com/chapter/get_book_chapter_detail_info',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': 'http://www.hbooker.com/chapter/book_chapter_detail/' + chapterId,
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: 'chapter_id=' + chapterId + '&chapter_access_key=' + accessKey,
          onload: function(response) {
            var json = JSON.parse(response.response);
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
            thisDownloaded(num, '', content, 0);
          }
        });
      }
    };
    addIRule('www.3gsc.com.cn', '3G书城', 'h1>a', '.menu-area>p>a', '.menu-area>p>a:has(span.vip)');
    addCRule('www.3gsc.com.cn', 'h1', '.menu-area');
    addIRule('book.zongheng.com', '纵横', '.txt>h1', '.chapterBean>a', '.chapterBean>em+a');
    addCRule('book.zongheng.com', 'h1>em', '#chapterContent');
    addIRule('huayu.baidu.com', '花语女生网', '.book_title>h1', '.chapname>a', '.chapname>a.normal,.chapname:has(em.vip)>a');
    addCRule('huayu.baidu.com', '.tc>h2', '.book_con');
    addRRule('huayu.baidu.com', '<span class="watermark">.*?</span>');
    addIRule('www.17k.com', '17K', 'h1.Title', 'dl.Volume>dd>a', 'dl.Volume>dd>a:has(img)');
    addCRule('www.17k.com', 'h1', '#chapterContentWapper');
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
          onload: function(response) {
            var info = JSON.parse(response.response);
            var name = info.chapter.title;
            var content = info.chapter.htmlContent;
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.sndream.cn', '少年dream', 'h1.page-title', 'div.bd>ul>li>a', 'div.bd>ul>li>a.isvip');
    chapterRule['www.sndream.cn'] = {
      'Deal': function(num, url) {
        chapterRule['www.heiyan.com'].Deal(num, url);
      }
    };
    addIRule('b.faloo.com', '飞卢', 'h1.a_24b', '.td_0>a', '.td_0>a[href^="http://b.faloo.com/vip/"]');
    addCRule('b.faloo.com', '#title>h1', '#content');
    addRRule('b.faloo.com', '\\s+||| ', '飞卢小说网.*');
    addIRule('www.jjwxc.net', '晋江文学城', 'h1>span', '#oneboolt>tbody>tr>td>span>div>a', '#oneboolt>tbody>tr>td>span>div>a[id^="vip_"]');
    addCRule('www.jjwxc.net', 'h2', '.noveltext', 0, 1);
    addRRule('www.jjwxc.net', '<font.*?>.*?font>', '\\s+||| ', '<div.*<div style="clear:both;"></div>', '<span.*class="favorite_novel">插入书签</span>');
    addIRule('www.xxsy.net', '潇湘书院', '#ct_title>h1', '#catalog_list>ul>li>a', '#catalog_list>ul>li:has(input)>a');
    addCRule('www.xxsy.net', 'h1>a', '#zjcontentdiv');
    addRRule('www.xxsy.net', '本书由潇湘书院首发，请勿转载！');
    addIRule('book.zhulang.com', '逐浪', '.crumbs>strong>a', '.chapter-list>ul>li>a', '.chapter-list>ul>li>a:has(span)');
    addCRule('book.zhulang.com', 'h2>span', '#read-content');
    addRRule('book.zhulang.com', '\\s+||| ', '<h2>.*</h2>', '<div class="textinfo">.*</div>', '<p> <cite>.*</p>');
    addIRule('novel.hongxiu.com', '红袖添香', '#htmltimu', '#htmlList>dl>dd>ul>li>strong>a', '#htmlList>dl>dd>ul>li>strong:has(.isvip)>a');
    addCRule('novel.hongxiu.com', '#htmltimu', '#htmlContent');
    addRRule('novel.hongxiu.com', '红\\|袖\\|言\\|情\\|小\\|说', 'www.hongxiu.com');
    addIRule('www.readnovel.com', '小说阅读网', '.nownav>a:nth-child(5)', '.ML_ul>li>a', '.ML_ul>li>a[id^="vip_"]');
    addCRule('www.readnovel.com', 'h1', '.zhangjie', 0, 1);
    addRRule('www.readnovel.com', '\\s+||| ', '<div class="miaoshu">.*');
    addIRule('www.xs8.cn', '言情小说吧', 'h1>a', '.mod_container>ul>li>a', '.mod_container>ul>li:has(img)>a');
    addCRule('www.xs8.cn', '.chapter_title>h2', '.chapter_content');
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
            thisDownloaded(num, '', content, 0);
          }
        });
      }
    }
    addIRule('www.kanshu.com', '看书网', '.mu_h1>h1', '.mulu_list>li>a', '.mulu_list>li:has(span)>a');
    addCRule('www.kanshu.com', 'h1', '.yd_text2', 0, 1);
    addRRule('www.kanshu.com', '\\s+||| ', '<span id="avg_link">.*');
    addIRule('book.weibo.com', '微博读书-书城', 'h1.book_name', '.chapter>span>a', '.chapter>span:has(i)>a');
    chapterRule['book.weibo.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = jQuery('.sr-play-box-scroll-t-path>span', response.response).text();
            var content = response.response.replace(/\s+/g, ' ').replace(/.*chapterContent ="(.*?)";.*/, '$1');
            content = eval('\'' + content + '\'');
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    }
    addIRule('www.lcread.com', '连城读书', '.bri>table>tbody>tr>td>h1', '#abl4>table>tbody>tr>td>a', '#abl4>table>tbody>tr>td>a[href^="http://vipbook.lc1234.com/"]');
    addCRule('www.lcread.com', 'h2', '#ccon', 0, 1);
    addRRule('www.lcread.com', '\\s+||| ', '作者闲话：.*');
    addIRule('www.motie.com', '磨铁中文网', 'h1>a', '.list>li>a:has(span.desc)', '.list>li>a:has(span.desc):has(img)');
    addCRule('www.motie.com', 'h1', '.page-content');
    addIRule('www.shuhai.com', '书海小说网', 'h3', '.box_chap>ul>li>a', '.box_chap>ul>li:has(em)>a');
    addCRule('www.shuhai.com', 'h1', '#readcon');
    addIRule('www.xiang5.com', '香网', '.lb>h2', '.lb>table>tbody>tr>td>a');
    chapterRule['www.xiang5.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            if (jQuery('.vipdy', response.response).length > 0) {
              jQuery(window).data('downloadList', new Array());
              for (var i = num; i < jQuery(window).data('dataDownload').length; i++) {
                jQuery(window).data('dataDownload')[i].content = '来源地址：' + jQuery(window).data('dataDownload')[num].url + '\r\n此章节为Vip章节';
                jQuery(window).data('dataDownload')[i].ok = true;
              }
              return
            }
            var name = jQuery('h1', response.response).text();
            var content = jQuery('.xsDetail', response.response).html().replace(/\s+/g, ' ').replace(/作者有话说.*/, '');
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('read.fmx.cn', '凤鸣轩小说网', '.art_listmain_top>h1', '.art_fnlistbox>span>a,.art_fnlistbox_vip>ul>li>span>a', '.art_fnlistbox_vip>ul>li>span>a');
    addCRule('read.fmx.cn', 'h1', '#content', 0, 1);
    addRRule('read.fmx.cn', '\\s+||| ', '<p><a.*');
    addIRule('novel.feiku.com', '飞库网', '.book_dirtit', '.book_dirbox>.clearfix>li>a', '.book_dirbox>.clearfix>li>a[href*="/vip/"]');
    addCRule('novel.feiku.com', '.art_tit', '#artWrap');
    addIRule('www.abada.com', '阿巴达', '#booktitle>h1', '.list>ul>li>a', '.list>ul>li:has(font)>a');
    addCRule('www.abada.com', 'h1', '#content', 0, 1);
    addIRule('www.kujiang.com', '酷匠网', '.kjtitle.align-center.pad-bottom>a', '.third>a');
    chapterRule['www.kujiang.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            if (response.finalUrl.indexOf('http://www.kujiang.com/login') === 0) {
              for (var i = num; i < jQuery(window).data('dataDownload').length; i++) {
                jQuery(window).data('dataDownload')[i].content = '来源地址：' + jQuery(window).data('dataDownload')[num].url + '\r\n此章节为Vip章节';
                jQuery(window).data('dataDownload')[i].ok = true;
              }
              jQuery(window).data('downloadList', new Array());
              return
            }
            var name = jQuery('.entry-title', response.response).text();
            var content = jQuery('#endText', response.response).html().replace(/.*酷.*匠.*网.*首.*发/, '').replace(/\s+/g, ' ').replace(/\<span style="color:red"\>.*/, '');
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.tadu.com', '塔读文学', '.book-detail.catalog-tip>h3', '.detail-chapters>ul>li>h5>a', '.detail-chapters>ul>li>h5>a:has(span)');
    chapterRule['www.tadu.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = jQuery('div.title_>h2', response.response).text();
            var content = unescape(response.response.replace(/\s+/g, ' ').replace(/.*unescape\("(.*?)"\).*/, '$1'));
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('yuedu.163.com', '网易云阅读', 'h2.title,h3', '.item>a', '.vip>a');
    chapterRule['yuedu.163.com'] = {
      'Deal': function(num, url) {
        urlArr = url.split('/');
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://yuedu.163.com/getArticleContent.do?sourceUuid=' + urlArr[4] + '&articleUuid=' + urlArr[5],
          onload: function(response) {
            var content = JSON.parse(response.response).content;
            content = base64.decode(content);
            content = base64.utf8to16(content);
            var name = jQuery('h1', content).text();
            var content = content;
            thisDownloaded(num, name, content, 0);
          }
        });
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
            var name = jQuery('.uk-alert>b:nth-child(3)>font', response.response).text();
            chapterRule['ebook.longmabook.com'].Deal2(num, urlNext, url, name);
          }
        });
      },
      'Deal2': function(num, url, urlReferer, nameRaw) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://ebook.longmabook.com' + url,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Referer': urlReferer,
            'X-Requested-With': 'XMLHttpRequest'
          },
          onload: function(response) {
            var name = nameRaw;
            var content = jQuery('#ebookcontent', response.response).html();
            content = content.replace(/\<font class="OutStrRnds"\>.*?\<\/font\>/g, '');
            thisDownloaded(num, name, content, 1);
          }
        });
      }
    };
    addIRule('www.yueloo.com', '阅路小说网', 'h3', '#container1>table>tbody>tr>td>a', '#container1>table>tbody>tr>td:has(span)>a');
    addCRule('www.yueloo.com', 'h2', '.reed', 0, 1);
    addIRule('www.1001p.com', '一千零一页', 'h1>a', '.dir_main>.dir_main_section>ol>li>a', '.dir_main>.vip_section~.dir_main_section>ol>li>a');
    addCRule('www.1001p.com', 'h2', '#inner');
    addIRule('www.yqsd.cn', '言情书殿', 'h1', '.list_section>.column3>ul>li>a', '.list_section>.column3>ul>li>a:has(font)');
    addCRule('www.yqsd.cn', 'h2', '#read_txt');
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
          url: 'http://www.hongshu.com/bookajax.do',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: 'method=getchptkey&bid=' + urlArr[6] + '&cid=' + urlArr[8],
          onload: function(response) {
            var key = JSON.parse(response.response).key;
            chapterRule['www.hongshu.com'].Deal2(num, url, key);
          }
        });
      },
      'Deal2': function(num, url, key) {
        var urlArr = url.split(/\/|-|\./);
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://www.hongshu.com/bookajax.do',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          data: 'method=getchpcontent&bid=' + urlArr[6] + '&jid=' + urlArr[7] + '&cid=' + urlArr[8],
          onload: function(response) {
            var json = JSON.parse(response.response);
            var name = json.chptitle;
            var content = json.content;
            content = unsafeWindow.utf8to16(unsafeWindow.hs_decrypt(unsafeWindow.base64decode(content), key));
            thisDownloaded(num, name, content, 0);
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
            var content = response.response.replace('document.write("<p>', '').replace('");', '').replace(/\<font.*?font\>/g, '');
            thisDownloaded(num, '', content, 1);
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
            var name = jQuery('strong', response.response).text();
            var content = jQuery('#new_cpt_content', response.response).html();
            if (content.length === 9) {
              for (var i = num; i < jQuery(window).data('dataDownload').length; i++) {
                jQuery(window).data('dataDownload')[i].content = '来源地址：' + jQuery(window).data('dataDownload')[num].url + '\r\n此章节为Vip章节';
                jQuery(window).data('dataDownload')[i].ok = true;
              }
              jQuery(window).data('downloadList', new Array());
              return
            }
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('vip.shulink.com', '书连', '.atitle', '.index>dd>a', '.index>dd:has(em)>a');
    addCRule('vip.shulink.com', '.atitle', '#acontent', 0, 1);
    addIRule('www.4yt.net', '四月天', 'h1>a', '.catalog-div>label>a', '.catalog-div>label>a:has(i)');
    addCRule('www.4yt.net', 'h1', '.chpater-content+p');
    addIRule('www.soudu.net', '搜读网', 'h1', '.list>li>a', '.list>li:has(span.r_red)>a');
    addCRule('www.soudu.net', 'h1', '#content');
    addRRule('www.soudu.net', '手机用户请访问.*');
    addIRule('lz.book.sohu.com', '搜狐读书', 'h2>a', '.lc_con1>ul>li>a');
    addCRule('lz.book.sohu.com', 'h2', '.book_con');
    addIRule('www.fbook.net', '天下书盟', 'h1', '.chapterTable>ul>li>a', 'span.nodeVIP+a');
    addCRule('www.fbook.net', '.lines', '#bookbody', 0, 1);
    addIRule('www.junshishu.com', '铁血读书', 'h1>a', '.list01>li>p a', '.list01>li>p>span>a');
    addCRule('www.junshishu.com', 'h1', '#contents', 0, 1);
    addIRule('www.wjsw.com', '万卷书屋', 'h1', '.list>li>a', '.list>li:has(span.r_red)>a');
    addCRule('www.wjsw.com', 'h1', '#content');
    addRRule('www.wjsw.com', '手机用户请访问.*');
    addIRule('www.yokong.com', '悠空网', '', '.chapter-list>li>span>a', '.chapter-list>li>span:has(.vip-icon)>a');
    addCRule('www.yokong.com', 'h1', '.article-con');
    addRRule('www.yokong.com', '\\s+||| ', '请记住本站：悠空网.*');
    addIRule('www.chuangbie.com', '创别书城', '.read_list', '.read_list1>li>a', '.read_list1>li>a:has(span)');
    addCRule('www.chuangbie.com', '.story_title>h1', '#chaptercontent');
    addRRule('www.chuangbie.com', '【关注微信】.*');
    addIRule('www.nsnovel.com', '女生小说网', 'h1', '.chapter>a', '.chapter:has(em)>a');
    addCRule('www.nsnovel.com', '.atitle', '#acontent', 0, 1);
    addRRule('www.nsnovel.com', '\\s+||| ', '好消息，好消息，女生小说网.*');
    addIRule('www.msxf.net', '陌上香坊言情小说网', 'h1>a', '.chaptertable>tbody>tr>td>a', '.chaptertable>tbody>tr>td:has(font.ico_vip)>a');
    addCRule('www.msxf.net', 'h3', '#article-content');
    addRRule('www.msxf.net', '\\s+||| ', '<p .*?net</p>', '<p> 看正版言情小说，来陌上香坊小说网.*?</p>', '<p .*?</p>');
    addIRule('www.popo.tw', 'POPO原創市集', '.BookName', '.aarti>a');
    addCRule('www.popo.tw', '.read-content>h1', '.read-content>dl', 1);
    addIRule('www.anyew.com', '暗夜文学', '.book_name>h4', '.chapters_list>li>a', '.chapters_list>li>a:has(.vip)');
    chapterRule['www.anyew.com'] = {
      'Deal': function(num, url) {
        if (!jQuery(window).data('firstRun')) {
          jQuery(window).data('firstRun', true);
          jQuery('head').append('<script type="text/javascript" src="http://wwwcdn.anyew.com/js/lib/trd.js?v=20170622192855"></script>');
          objectUnpack = function(a) {
            var d, e, f, b = {},
              c = ("?" === a[0] ? a.substr(1) : a).split("&");
            for (d = 0; d < c.length; d++) e = c[d].split("="), f = decodeURIComponent(e[0]), "" != f && (b[f] = decodeURIComponent(e[1] || ""));
            return b
          };
        }
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = jQuery('.ML_bookname>h1', response.response).text();
            var content;
            h = jQuery('.data-trda', response.response).val();
            b = jQuery('.data-trdk', response.response).val();
            k = objectUnpack(b).s.split('.', 2);
            l = trd.lib.CipherParams.create({
              ciphertext: trd.enc.Base64.parse(h)
            });
            m = trd.ALGON.decrypt(l, trd.enc.Hex.parse(k[0] || ''), {
              iv: trd.enc.Hex.parse(k[1] || '')
            });
            j = m.toString(trd.enc.Utf8);
            content = j;
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    }
    //////////////////////////////////////////////////轻小说
    addIRule('www.wenku8.com', '轻小说文库', '#title', '.css>tbody>tr>td>a');
    addCRule('www.wenku8.com', '#title', '#content', 0, 1);
    addIRule('book.sfacg.com', 'SF轻小说', 'h1', '.catalog-list>ul>li>a', '.catalog-list>ul>li>a:has(.icn_vip)');
    addCRule('book.sfacg.com', '.list_menu_title', '#ChapterBody');
    addIRule('xs.dmzj.com', '动漫之家', '.novel_cover_text>ol>li>a>h1', '.download_rtx>ul>li>a');
    addCRule('xs.dmzj.com', 'h1', '#novel_contents');
    addIRule('www.yidm.com', '迷糊动漫', 'title', '.chapters.clearfix>a');
    addCRule('www.yidm.com', '.bd>h4', '.bd', 0, 1);
    addIRule('book.suixw.com', '随想轻小说', '#title', '.ccss>a');
    addCRule('book.suixw.com', '#title', '#content', 0, 1);
    addIRule('www.iqing.in', '轻文轻小说', 'h1', '.chapter>a');
    chapterRule['www.iqing.in'] = {
      'lang': 0,
      'Deal': function(num, url) {
        var urlArr = url.split('/');
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://www.iqing.in/content/' + urlArr[4] + '/chapter/',
          headers: {
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          },
          onload: function(response) {
            var json = JSON.parse(response.response);
            var name = json.chapter_title;
            var content = '';
            for (var i = 0; i < json.results.length; i++) {
              content += json.results[i].value;
            }
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    //////////////////////////////////////////////////盗贴
    addIRule('www.xiaoshuokan.com', '好看小说网', 'h1', '.c1>a');
    chapterRule['www.xiaoshuokan.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var host = getHostName(url).replace('www.', '');
            var name = jQuery('center>h1', response.response).text();
            var bid = response.response.replace(/\s+/g, ' ').replace(/.*"bid":"(.*?)".*/, '$1');
            if (isNaN(parseInt(bid))) {
              var content = response.response.replace(/\s+/g, ' ').replace(/.*adboxhide.*?>/, '').replace(/\<!--content--\>.*/, '');
              thisDownloaded(num, name, content, 0);
            } else {
              var cid = response.response.replace(/\s+/g, ' ').replace(/.*"cid":"(.*?)".*/, '$1');
              chapterRule['www.xiaoshuokan.com'].Deal2(num, name, host, bid, cid);
            }
          }
        });
      },
      'Deal2': function(num, name, host, bid, cid) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://soso2.' + host + '/call/chapreadajax.ashx?bid=' + bid + '&cid=' + cid + '&c=gbk',
          onload: function(response) {
            var content = response.response;
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.vv44.net', '琦书屋', '#list>div.bt>h1', 'div.book>table>tbody>tr>td>li>a');
    chapterRule['www.vv44.net'] = {
      'lang': 0,
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = jQuery('h1', response.response).text();
            var fid = response.response.replace(/\s+/g, ' ').replace(/.*\$\.sha1\((.*?)\);.*/, '$1');
            if (/^String/.test(fid)) {
              if (!jQuery(window).data('firstRun')) {
                jQuery(window).data('firstRun', true);
                unsafeWindow.jQuery('head').append('<script type="text/javascript" src="/Public/Home/js/jquery.sha1.js"></script>');
              }
              fid = unsafeWindow.jQuery.sha1(eval(fid));
              chapterRule['www.vv44.net'].Deal2(num, name, url, fid);
            } else {
              var content = jQuery('.content', response.response).html();
              thisDownloaded(num, name, content, 0);
            }
          }
        });
      },
      'Deal2': function(num, name, url, fid) {
        var urlArr = url.split('/');
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://www.vv44.net/home/content/' + urlArr[4] + '/' + urlArr[5],
          data: 'bid=' + urlArr[4] + '&rid=' + urlArr[5] + '&fid=' + fid,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          },
          onload: function(response) {
            var content = response.response;
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.chuanyue8.com', '穿越小说吧', '.bigname', '.zjlist4>ol>li>a');
    chapterRule['www.chuanyue8.com'] = {
      'lang': 0,
      'Deal': function(num, url) {
        var urlArr = url.split(/\/|\./);
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://www.chuanyue8.com/modules/article/17mb_Content.php?aid=' + urlArr[9] + '&cid=' + urlArr[10],
          headers: {
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          },
          onload: function(response) {
            var content = response.response;
            thisDownloaded(num, '', content, 0);
          }
        });
      }
    };
    addIRule('kansha.cc', '看啥网', '.pad3.zb', '.pad5>a');
    addCRule('kansha.cc', '.pad3.zb', '.breakword');
    addIRule('k2.kansha.cc');
    addCRule('k2.kansha.cc', '.pad3.zb', '.breakword');
    addRRule('k2.kansha.cc', '<span class="par0">仧</span>', '<img src="imafont/[a-z](.*?).gif".*?>|||$1');
    addIRule('www.22ff.com', '爱书网', '.tname>a', '.main>.neirong>.clc>a');
    chapterRule['www.22ff.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          overrideMimeType: 'text/html; charset=gb2312',
          onload: function(response) {
            var name = jQuery('h1', response.response).text();
            if (jQuery('script:contains(output)', response.response).length > 0) {
              chapterRule['www.22ff.com'].Deal2(num, url, name);
            } else {
              var content = jQuery('#chapter_content', response.response).html();
              thisDownloaded(num, name, content, 0);
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
            thisDownloaded(num, name, content, 0);
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
            var name = jQuery('.max', response.response).text();
            if (jQuery('#booktext>script', response.response).length > 0) {
              chapterRule['www.xntk.net'].Deal2(num, jQuery('#booktext>script', response.response).attr('src'), name);
            } else {
              var content = jQuery('#booktext', response.response).html();
              thisDownloaded(num, name, content, 0);
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
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.xiaoshuoan.com', '笑话庵', '#title', '.c>a');
    chapterRule['www.xiaoshuoan.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: 'http://www.xiaoshuoan.com/r.php?u=' + url.replace('http://www.xiaoshuoan.com', '').replace('.html', '.txt'),
          overrideMimeType: 'text/html; charset=gb2312',
          onload: function(response) {
            var content = response.response.replace(/document\.write\(\'(.*)\'\)/, '$1');
            thisDownloaded(num, '', content, 0);
          }
        });
      }
    };
    addIRule('www.kong5.com', '悟空追书', 'h1', '.card~.card>.body>.dirlist>li>a');
    chapterRule['www.kong5.com'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = jQuery('h1>a', response.response).text();
            var data = response.response.replace(/\s+/g, '').replace(new RegExp('.*' + url.replace('http://www.kong5.com', '') + '?(.*?)\'.*'), '$1').replace(/^\?/, '');
            chapterRule['www.kong5.com'].Deal2(num, name, data, url);
          }
        });
      },
      'Deal2': function(num, name, data, url) {
        data = data.split(/&|=/);
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://www.kong5.com/novelsearch/chapter/transcode.html',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          },
          data: 'siteid=' + data[1] + '&url=' + data[5],
          onload: function(response) {
            var content = JSON.parse(response.response).info;
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.567zw.com', '567中文', 'h1', '.centent>ul>li>a');
    chapterRule['www.567zw.com'] = {
      'Deal': function(num, url) {
        chapterRule['www.xntk.net'].Deal(num, url);
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
            if (host === 'www.hunhun520.com') {
              var contentSelector = '#content';
            } else if (host === 'www.tanxshu.net') {
              var contentSelector = '#contxt';
            }
            var name = jQuery('h1', response.response).text();
            var content = jQuery(contentSelector, response.response).html();
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
            content += jQuery(contentSelector, response.response).html();
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.3zcn.org', '三藏中文网', 'h1', '.booklist>span>a');
    chapterRule['www.3zcn.org'] = {
      'Deal': function(num, url) {
        chapterRule['www.xiaoshuokan.com'].Deal(num, url);
      }
    };
    addIRule('www.tanxshu.net', '檀香书', 'h1', '.boxL>ol>li>a:gt(5)');
    chapterRule['www.tanxshu.net'] = {
      'Deal': function(num, url) {
        chapterRule['www.hunhun520.com'].Deal(num, url);
      }
    };
    addIRule('www.booksrc.net', '小说园', 'h1', '.booklist>span>a');
    chapterRule['www.booksrc.net'] = {
      'Deal': function(num, url) {
        chapterRule['www.xiaoshuokan.com'].Deal(num, url);
      }
    };
    addIRule('www.yushuwu.net', '御宅屋', '.infotitle>h1', '.chapter_list>a', false, true);
    chapterRule['www.yushuwu.net'] = {
      'Deal': function(num, url) {
        if (url.match('javascript')) {
          var para = url.match(/\d+/g);
          url = location.protocol + '//www.yushuwu.net/read/' + para[0] + '/' + para[1] + '/';
        }
        GM_xmlhttpRequest({
          method: 'GET',
          overrideMimeType: 'text/html; charset=gb2312',
          url: url,
          onload: function(response) {
            var name = jQuery('#main h1', response.response).text();
            var content = jQuery('#main>div>div:eq(1)', response.response).html();
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.blwen.com', 'bl文库', 'h2', '.jogger2>li:gt(1):lt(-1)>a');
    addCRule('www.blwen.com', 'h2', '.artz', 0, 1);
    addRRule('www.blwen.com', '\\s+||| ', '.*?<div class="arnr" id="arctext">', '<div class="ggk2">.*');
    addIRule('www.mpzw.com', '猫扑中文', 'h1', '.ccss>a');
    addCRule('www.mpzw.com', 'h1', '#clickeye_content', 0, 1);
    addIRule('www.ledubar.com', '乐读吧', '.title', '.float-list>li>a');
    addCRule('www.ledubar.com', '.bd>h1', '.page-content>p', 0, 1);
    addIRule('www.yilego.com', '乐高小说网', '.t>h2', '.list-directory>ul>li>a');
    addCRule('www.yilego.com', 'h2', '.content', 0, 1);
    addIRule('www.00xs.cc', '00小说', '.chapter-hd>h1', '.chapter-list>li>span>a');
    addCRule('www.00xs.cc', 'h1', '.article-con', 0, 1);
    addRRule('www.00xs.cc', '(以下为|)00小说网.*出版社。', '00小说网', '\\s+||| ', '<span style="color:#4876FF">.*?</script>.*?</span>');
    addIRule('www.kenshu.cc', '啃书小说网', '.chapter-hd>h1', '.chapter-list>li>span>a');
    addCRule('www.kenshu.cc', 'h1', '.article-con', 0, 1);
    addIRule('www.bl5xs.com', 'BL小说网', 'h1', '#list>dl>dd>a');
    addCRule('www.bl5xs.com', 'h1', '#content', 0, 1);
    addIRule('www.151xs.com', '151小说网', 'h3', '.listcon>dl>dd>a');
    addCRule('www.151xs.com', 'h1', '.content');
    addIRule('www.quanbenba.com', '全本吧', 'h1', '.readerListShow>dl>dd>a');
    addCRule('www.quanbenba.com', 'h1', '#content', 0, 1);
    addIRule('www.pbtxt.com', '平板电子书网', 'h1', '.list>dl>dd>a', '', true);
    addCRule('www.pbtxt.com', 'h1', '.content', 0, 1);
    addRRule('www.pbtxt.com', '\s+||| ', 'txt下载地址：.*');
    addIRule('www.lread.net', '乐阅读', 'h1', '#list>dl>dd>a');
    addCRule('www.lread.net', 'h1', '#booktext', 0, 1);
    addIRule('www.lewen8.com', '乐文小说网', 'h1', '.chapterlist>li>a');
    addCRule('www.lewen8.com', 'h1', '#content');
    addIRule('www.yfzww.com', '一凡中文网', 'h2', '#chapters>li>a');
    addCRule('www.yfzww.com', 'h3', '#content');
    addRRule('www.yfzww.com', '\s+||| ', '【一凡中文网.*');
    addIRule('www.biquge.tw', '笔趣阁', 'h1', '#list>dl>dd>a');
    addCRule('www.biquge.tw', 'h1', '#content');
    addIRule('www.e8zw.com', 'E8中文网', 'h1', '#list>dl>dd>a');
    addCRule('www.e8zw.com', 'h1', '#content');
    addIRule('www.8shuw.net', '8书网', '#info>h1', '.indexlist>tbody>tr>td>span>a');
    addCRule('www.8shuw.net', 'h2>span:nth-child(2)', '#content', 0, 1);
    addRRule('www.8shuw.net', '<p class="prevue">.*?</p>');
    addIRule('www.hjwzw.com', '黄金屋中文', 'h1', '#tbchapterlist>table>tbody>tr>td>a');
    addCRule('www.hjwzw.com', 'h1', '#AllySite+div');
    addRRule('www.hjwzw.com', '请记住本站域名.*</b>');
    addIRule('book.58xs.com', '58小说网', 'h1', 'td>a[href$=".html"]');
    addCRule('book.58xs.com', 'h1', '#content', 0, 1);
    addRRule('book.58xs.com', '本站公告', '58xs.com');
    addIRule('www.5858xs.com', '58小说网', 'h1', 'td>a[href$=".html"]');
    addCRule('www.5858xs.com', 'h1', '#content', 0, 1);
    addRRule('www.5858xs.com', '本站公告', '5858xs.com');
    addIRule('www.my285.com', ' 梦远书城(待续)', 'td[bgcolor="#FFC751"]', 'td>a:not(:has(span)):visible');
    addCRule('www.my285.com', 'td[height="30"]', 'td:has(br)', 0, 1);
    addIRule('wx.ty2016.net', '天涯书库', 'h1', '.book>dl>dd>a');
    addCRule('wx.ty2016.net', 'font', 'p', 0, 1);
    addIRule('www.ty2016.net', '天涯书库', 'h1', '.book>dl>dd>a');
    addCRule('www.ty2016.net', 'h1', 'p[align="center"]+p', 0, 1);
    addIRule('www.chinaisbn.com', 'isbn书院', 'h1', '.mulu_list>li>a');
    addCRule('www.chinaisbn.com', 'h1', '#htmlContent', 0, 1);
    addRRule('www.chinaisbn.com', '\(isbn书院.*?\)');
    addIRule('www.uuxiaoshuo.net', '悠悠书盟', 'h1', '.ccss>a');
    addCRule('www.uuxiaoshuo.net', 'h1', '#content', 0, 1);
    addRRule('www.uuxiaoshuo.net', '【为了方便您下次阅读.*?】', '“24小时不间断更新.*?”', '『悠悠书盟.*?』');
    addIRule('www.5200zw.com', '5200小说网', 'h1', '#readerlist>ul>li>a');
    addCRule('www.5200zw.com', 'h1', '#content', 0, 1);
    addIRule('www.zbzw.com', '着笔中文网', 'h1', '#chapterlist>li>a');
    addCRule('www.zbzw.com', 'h1', '#text_area', 0, 1);
    addIRule('www.5ycn.com', '五月中文', 'h1', '#list>dl>dd>a');
    addCRule('www.5ycn.com', 'h1', '#content', 0, 1);
    addIRule('www.book108.com', '108小说网', 'h1', '.chapter-list>li>span>a');
    addCRule('www.book108.com', 'h1', '.article-con', 0, 1);
    addIRule('www.23txt.com', '天籁小说', 'h1', '#list>dl>dd>a');
    addCRule('www.23txt.com', 'h1', '#content', 0, 1);
    addRRule('www.23txt.com', '\s+||| ', '阅读本书最新章节请到.*');
    addIRule('www.9wh.net', '九头鸟书院', 'h1', '.ListCon>.ListRow>li>a:lt(-2)');
    addCRule('www.9wh.net', 'h1', '#text_area', 0, 1);
    addRRule('www.9wh.net', '九头鸟书院|http://www.9wh.net');
    addIRule('www.59tto.com', '59文学', 'h1', '.xiaoshuo_list>dd>a');
    addCRule('www.59tto.com', 'h1', '.article', 0, 1);
    addRRule('www.59tto.com', '\s+||| ', '您可以在百度里搜索.*');
    addIRule('www.360118.com', '天天中文', 'h1', '.ml_main>dl>dd>a:lt(-1)');
    addCRule('www.360118.com', 'h2', '.yd_text2', 0, 1);
    addIRule('www.bookba.net', '在线书吧', 'h2', '.content>.txt-list>li>a');
    addCRule('www.bookba.net', 'h1', '.note', 0, 1);
    addRRule('www.bookba.net', '《在线书吧.*》', '在线书吧唯一官方网站.*其他均为假冒');
    addIRule('www.qianrenge.net', '钱人阁', 'h1', '#list>dl>dd>a');
    addCRule('www.qianrenge.net', 'h1', '#content');
    addIRule('www.dushuge.net', '读书阁', 'h1', '#list>dl>dd>a');
    addCRule('www.dushuge.net', 'h1', '#content', 0, 1);
    addIRule('www.cmxsw.com', '眼快看书', 'h1', '#xscontent>#left>#xsbody>ul>li>a');
    addCRule('www.cmxsw.com', 'h3', '#content', 0, 1);
    addIRule('www.xiaoyanwenxue.com', '小燕文学', 'h1', '#list>._chapter>li>a');
    addCRule('www.xiaoyanwenxue.com', 'h1', '#content', 0, 1);
    addIRule('www.5800.cc', '58小说阅读网', 'h1', '.TabCss>dl>dd>a');
    addCRule('www.5800.cc', 'h1', '#content', 0, 1);
    addRRule('www.5800.cc', '即刻参加58小说.*');
    addIRule('www.1kanshu.cc', '要看书网', 'h1', '#list>dl>dd>a');
    addCRule('www.1kanshu.cc', 'h1', '#content', 0, 1);
    addIRule('www.biquguan.com', '笔趣馆', 'h1', '#list>dl>dd>a');
    addCRule('www.biquguan.com', 'h1', '#content');
    addIRule('www.wenxuemm.com', '女生文学', 'h1', '.novel_list>ul>li>a');
    addCRule('www.wenxuemm.com', 'h1', '#content', 0, 1);
    addRRule('www.wenxuemm.com', '\(女生文学 www.wenxuemm.com\)', '如果您中途有事离开.*');
    addIRule('www.chinaliangzhu.com', '梁祝文学网', 'h1', 'ul.chapters>li>a');
    addCRule('www.chinaliangzhu.com', '.title', '#content', 0, 1);
    addIRule('www.23us.cc', '顶点小说', 'h1', '.chapterlist>dd>a');
    addCRule('www.23us.cc', 'h1', '#content');
    addIRule('www.88dushu.com', '88读书网', 'h1', '.mulu>ul>li>a');
    addCRule('www.88dushu.com', 'h1', '.yd_text2', 0, 1);
    addIRule('www.630book.cc', '恋上你看书网', '#info>h1', 'dl.zjlist>dd>a');
    addCRule('www.630book.cc', '#main>h1', '#content', 0, 1);
    addIRule('www.podlook.com', '菠萝网', '.wrapper>h1', 'ul.chapters>li>a');
    addCRule('www.podlook.com', 'div.title', '#content', 0, 1);
    addIRule('www.luoqiu.com', '落秋中文', 'h1>a', '.dccss>a');
    addCRule('www.luoqiu.com', '.bname_content', '#content', 0, 1);
    addIRule('www.7kshu.com', '去看书网', 'h1', '#chapterlist>li>a');
    addCRule('www.7kshu.com', 'h1', '#content', 0, 1);
    addIRule('www.zhuaji.org', '爪机书屋', '.mulu-left>h1', '#mulu>dd>a');
    addCRule('www.zhuaji.org', '.title', '#content', 0, 1);
    addIRule('www.d8qu.com', '第八区', '.title>h1', '.chapter>ul>li>a');
    addCRule('www.d8qu.com', '#cont>h1', '#content>#clickeye_content', 0, 1);
    addIRule('www.92zw.com', '就爱中文网', 'h1', '#at>tbody>tr>td.L>a');
    addCRule('www.92zw.com', 'h1', '#contents', 0, 1);
    addIRule('www.tlxsw.com', '天籁小说网', '.shumeng_paintro>font', '.centent>ul>li>a[href$=".html"]');
    addCRule('www.tlxsw.com', '#title', '#content', 0, 1);
    addIRule('www.59shuku.com', '59书库', '.infot>h1', '.dccss>a');
    addCRule('www.59shuku.com', 'h2', '#content>p', 0, 1);
    addIRule('www.bjxiaoshuo.com', '白金小说网', '#title', '.ccss>a');
    addCRule('www.bjxiaoshuo.com', '#title', '#content', 0, 1);
    addIRule('www.xs222.com', '顶点小说', '#info>h1', '#list>dl>dd>a');
    addCRule('www.xs222.com', 'h1', '#content', 0, 1);
    addIRule('www.wenchangshuyuan.com', '文昌书院', 'h1', '._chapter>li>a');
    addCRule('www.wenchangshuyuan.com', 'h1', '#content', 0, 1);
    addIRule('www.yqhhy.cc', '言情后花园', '#html>h1', '.list2>tbody>tr>td>a');
    addCRule('www.yqhhy.cc', 'h1', '#content', 0, 1);
    addRRule('www.yqhhy.cc', '更多<a.*?yqhhy.cc');
    addIRule('www.shunong.com', '书农小说', '.infos>h1', '.book_list>ul>li>a');
    addCRule('www.shunong.com', '.h1title>h1', '#htmlContent');
    addRRule('www.shunong.com', '\s+||| ', '书农文学.*?下次阅读。', '如果觉得<a.*欣赏.*');
    addIRule('paitxt.com', '派小说网', '.book_news_style_text2>h1', '#chapterlist>dd>a');
    addCRule('paitxt.com', '#bgdiv>dl>dt', '#booktext', 0, 1);
    addIRule('www.hkxs99.net', '无弹窗小说网', '.book>h1', '.book>dl>dd>a');
    addCRule('www.hkxs99.net', 'h1', '.book');
    addRRule('www.hkxs99.net', '上一篇：.*', '下一篇：.*');
    addIRule('www.kanshu.la', '看书啦', '#focus_book_info>h1>a', '.box1.mulu>ul>li>a');
    addCRule('www.kanshu.la', '.h1', '#contentTxt');
    addIRule('www.doulaidu.com', '都来读', '#info>h1', '#list>dl>dd>a');
    addCRule('www.doulaidu.com', 'h1', '#content');
    addIRule('www.shuotxts.com', '小说下载', '.uu_bkt', '.chaptertd>a');
    addCRule('www.shuotxts.com', '#title', '#content', 0, 1);
    addIRule('www.151kan.com', '151看书网', '.title>ul>h1', '.chapter>ul>li>a');
    addCRule('www.151kan.com', 'h1', '#readtext>p', 0, 1);
    addRRule('www.151kan.com', 'www.151kan.com', '151看书网');
    addIRule('www.fkzww.com', '无敌龙书屋', '.booktitle', '#BookText>ul>li>a');
    addCRule('www.fkzww.com', '.newstitle', '#BookTextt', 0, 1);
    addIRule('www.shenmabook.com', '神马小说网', '.bigname', '.zjlist4>ol>li>a');
    addCRule('www.shenmabook.com', '#htmltimu', '#htmlContent', 0, 1);
    addRRule('www.shenmabook.com', '更多手打全文字章节请到.*?com');
    addIRule('www.ttzw.com', '天天中文网', '#info>h1', '#list>dl>dd>a');
    addCRule('www.ttzw.com', 'h1', '#content');
    addIRule('www.xiaoshuo2016.com', '小说2016', '.introMid>h1', '.cate-List>ul>li>a', '', true);
    addCRule('www.xiaoshuo2016.com', 'h1', '.articleDiv>p', 0, 1);
    addIRule('www.shuhaha.com', '79小说网', '.wrapper_list>h1>a', '.insert_list>dl>dd>ul>li>strong>a');
    addCRule('www.shuhaha.com', '#htmltimu', '#BookText', 0, 1);
    addIRule('www.79xs.com', '79小说网', '.wrapper_list>h1>a', '.insert_list>dl>dd>ul>li>strong>a');
    addCRule('www.79xs.com', '#htmltimu', '#BookText', 0, 1);
    addIRule('www.bookgew.com', '书阁网', '.booktitle', 'html>body>table[bordercolordark="white"]>tbody>tr>td>div>a');
    addCRule('www.bookgew.com', '.newstitle', '#booktext', 0, 1);
    addIRule('www.23wx.com', '顶点小说', '.bdsub>dl:nth-child(1)>dt:nth-child(1)>a:nth-child(4)', '#at>tbody>tr>td>a:lt(-1)');
    addCRule('www.23wx.com', 'h1', '#contents', 0, 1);
    addRRule('www.23wx.com', '\s+||| ', '手机用户请到.*');
    addIRule('www.biquge.la', '笔趣阁', 'h1', '#list>dl>dd>a');
    addCRule('www.biquge.la', 'h1', '#content', 0, 1);
    addIRule('www.shumilou.co', '书迷楼', '#mybook+.list>.tit>b', 'li.zl>a');
    addCRule('www.shumilou.co', 'h2', 'p');
    addRRule('www.shumilou.co', '\s+||| ', '<script.*?</a>.*?</script>', '书迷楼最快更新，无弹窗阅读请.*');
    addIRule('www.quledu.com', '无错小说网', 'h1>.bigname', '.zjlist4>ol>li>a');
    addCRule('www.quledu.com', '#htmltimu', '#htmlContent');
    addRRule('www.quledu.com', '<img src="(.*?)">|||$1', '/sss/da.jpg|||打', '/sss/maws.jpg|||吗？', '/sss/baw.jpg|||吧？', '/sss/wuc.jpg|||无', '/sss/maosu.jpg|||：“', '/sss/cuow.jpg|||错', '/sss/ziji.jpg|||自己', '/sss/shenme.jpg|||什么', '/sss/huiqub.jpg|||回去', '/sss/sjian.jpg|||时间', '/sss/zome.jpg|||怎么', '/sss/zhido.jpg|||知道', '/sss/xiaxin.jpg|||相信', '/sss/faxian.jpg|||发现', '/sss/shhua.jpg|||说话', '/sss/dajiex.jpg|||大姐', '/sss/dongxi.jpg|||东西', '/sss/erzib.jpg|||儿子', '/sss/guolair.jpg|||过来', '/sss/xiabang.jpg|||下班', '/sss/zangfl.jpg|||丈夫', '/sss/dianhua.jpg|||电话', '/sss/huilaim.jpg|||回来', '/sss/xiawu.jpg|||下午', '/sss/guoquu.jpg|||过去', '/sss/shangba.jpg|||上班', '/sss/mingtn.jpg|||明天', '/sss/nvrenjj.jpg|||女人', '/sss/shangwo.jpg|||上午', '/sss/shji.jpg|||手机', '/sss/xiaoxinyy.jpg|||小心', '/sss/furene.jpg|||夫人', '/sss/gongzih.jpg|||公子', '/sss/xiansg.jpg|||先生', '/sss/penyouxi.jpg|||朋友', '/sss/xiaoje.jpg|||小姐', '/sss/xifup.jpg|||媳妇', '/sss/nvxudjj.jpg|||女婿', '/sss/xondi.jpg|||兄弟', '/sss/lagong.jpg|||老公', '/sss/lapo.jpg|||老婆', '/sss/meimeid.jpg|||妹妹', '/sss/jiejiev.jpg|||姐姐', '/sss/jiemeiv.jpg|||姐妹', '/sss/xianggx.jpg|||相公', '/sss/6shenumev.jpg|||什么', '/sss/cuoaw.jpg|||错', '/sss/fpefnyoturxi.jpg|||朋友', '/sss/vfsjgigarn.jpg|||时间', '/sss/zzhiedo3.jpg|||知道', '/sss/zibjib.jpg|||自己', '/sss/qdonglxi.jpg|||东西', '/sss/hxiapxint.jpg|||相信', '/sss/fezrormre.jpg|||怎么', '/sss/nvdrfenfjfj.jpg|||女人', '/sss/jhiheejeieev.jpg|||姐姐', '/sss/xdifagojge.jpg|||小姐', '/sss/gggugolgair.jpg|||过来', '/sss/maoashu.jpg|||：“', '/sss/gnxnifawhu.jpg|||下午', '/sss/rgtugoqgugu.jpg|||过去', '/sss/khjukilkaim.jpg|||回来', '/sss/gxhigfadnoxihnyy.jpg|||小心', '/sss/bkbskhhuka.jpg|||说话', '/sss/xeieavnfsg.jpg|||先生', '/sss/yuhhfuiuqub.jpg|||回去', '/sss/pdianphua.jpg|||电话', '/sss/fabxianr.jpg|||发现', '/sss/feilrpto.jpg|||老婆', '/sss/gxronfdri.jpg|||兄弟', '/sss/flfaggofng.jpg|||老公', '/sss/tymyigngtyn.jpg|||明天', '/sss/dfshfhhfjfi.jpg|||手机', '/sss/gstjhranjgwjo.jpg|||上午', '/sss/fmgeyimehid.jpg|||妹妹', '/sss/gxgihftutp.jpg|||媳妇', '/sss/cerztifb.jpg|||儿子', '/sss/gfxgigagbfadng.jpg|||下班', '/sss/gstjhranjg.jpg|||下午', '/sss/hjeirerm6eihv.jpg|||姐妹', '/sss/edajihexr.jpg|||大姐', '/sss/wesfhranrrgba.jpg|||上班', '/sss/gfognggzigh.jpg|||公子', '/sss/frurtefne.jpg|||夫人', '/sss/fzagnggfbl.jpg|||丈夫', '/sss/nvdxfudfjfj.jpg|||女婿', '/sss/xdidafnggx.jpg|||相公', '/sss/zenme.jpg|||怎么', '/sss/gongzi.jpg|||公子', '/sss/ddefr.jpg', '.*ddefr.jpg.*|无(?:错|.*cuoa?w.jpg.*)小说网不[少跳]字|w[a-z.]*om?|.*由[【无*错】].*会员手打[sS]*', '无错不跳字|无广告看着就是爽!|一秒记住.*|全文免费阅读.*|8 9 阅阅 读 网|看小说最快更新|“小#说看本书无广告更新最快”', '[ -~》]?无(?:.|&gt;)错.小说.{1,2}[Ｗw]+.*?[cＣ][oＯ][mＭ]', '<无-错>', '—无—错—小说', '&amp;无&amp;错&amp;小说', '无错小说 www.quled[Ｕu].com');
    addIRule('www.mangg.com', '追书网', 'h1', '#chapterlist>dd>a');
    addCRule('www.mangg.com', '#bgdiv>dl>dt', '#booktext');
    addRRule('www.mangg.com', '纯文字在线阅读本站域名手机同步阅读请访问M.Shumilou.Com', '最快更新，无弹窗阅读请。');
    addIRule('www.23zw.com', '傲世中文网', 'h1', '.chapter_list_chapter>a');
    addCRule('www.23zw.com', '#chapter_title>h1', '#text_area', 0, 1);
    addIRule('www.31wxw.com', '三易文学', 'h1', '#readerlist>ul>li>a');
    addCRule('www.31wxw.com', 'h1', '#content', 0, 1);
    addIRule('www.520xs.la', '520小说网', 'h1', '.list>dl>dd>a', '', true);
    addCRule('www.520xs.la', 'h1', '.con_txt', 0, 1);
    addRRule('www.520xs.la', '\s+||| ', '推荐游戏.*');
    http: //www.520xs.la/book/*.html
      addIRule('www.biquge.com', '笔趣阁', 'h1', '#list>dl>dd>a');
    addCRule('www.biquge.com', 'h1', '#content');
    addIRule('www.69shu.com', '69书吧', '.weizhi>a:nth-child(3)', '.mulu_list>li>a:gt(5):lt(-1)');
    addCRule('www.69shu.com', 'h1', '.yd_text2', 0, 1);
    addIRule('www.biquku.com', '笔趣库', 'h1', '#list>dl>dd>a');
    addCRule('www.biquku.com', 'h1', '#content', 0, 1);
    addIRule('www.5ccc.net', '我看书斋', 'h1', 'table.acss>tbody>tr>td.ccss>a');
    addCRule('www.5ccc.net', 'h1', '#content', 0, 1);
    addIRule('www.aiquxs.com', '爱去小说网', '.con_top>a:nth-child(4)', '#list>dl>dd>a');
    addCRule('www.aiquxs.com', 'h1', '#booktext', 0, 1);
    addRRule('www.aiquxs.com', '手机用户请浏览.*');
    addIRule('www.2kxs.com', '2K小说阅读网', 'h1', '.book>dd:gt(6)>a');
    addCRule('www.2kxs.com', 'h2', 'p.Text', 0, 1);
    addRRule('www.2kxs.com', '\s+||| ', '<a href=.*</strong>', '2k小说阅读网');
    addIRule('www.mianhuatang.la', '棉花糖小说网', 'h1', '.novel_list>dl>dd>a');
    addCRule('www.mianhuatang.la', 'h1', '.content', 0, 1);
    addRRule('www.mianhuatang.la', '\s+||| ', '<div class="con_l">.*', '\[看本书最新章节请到棉花糖小说网www.mianhuatang.cc\]', '<strong>.*?</strong>');
    addIRule('www.23wx.in', '随梦小说网', '.title>h2', '.list_box>ul>li>a');
    addCRule('www.23wx.in', 'h2', '.box_box', 0, 1);
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
    addCRule('www.kuaidu.cc', '.h1title>h1', '.contentbox');
    addIRule('www.vodtw.com', '品书网', 'h1', '.insert_list>dl>dd>ul>li>a');
    addCRule('www.vodtw.com', '#htmltimu', '.contentbox', 0, 1);
    addRRule('www.vodtw.com', '手机阅读', '品书网', 'www.vodtw.com', '手机用户请.*', '请分享$', '本书来自 品.*?书.*');
    addIRule('www.sqsxs.com', '手牵手小说', 'h1', '#list>dl>dd>a');
    addCRule('www.sqsxs.com', 'h1', '#content', 0, 1);
    addRRule('www.sqsxs.com', '.*更新快.*无弹窗.*纯文字.*');
    addIRule('www.dashubao.co', '大书包小说网', 'h1', '.ml_main>dl>dd>a');
    addCRule('www.dashubao.co', 'h2', '.yd_text2', 0, 1);
    addIRule('www.iqingdou.net', '青豆小说', 'h1>a', '.dirconone>ul>li>a');
    addCRule('www.iqingdou.net', 'h2>a', '#chapter_content');
    addIRule('www.aszw520.com', '爱上中文', 'h1', '#at>tbody>tr>td.L>a');
    addCRule('www.aszw520.com', 'h1', '#contents', 0, 1);
    addIRule('www.abcsee.net', '北辰文学网', 'h1', '#at>tbody>tr>td.L>a');
    addCRule('www.abcsee.net', 'h1', '#contents', 0, 1);
    addIRule('www.bxwx.cc', '新笔下文学', '.novel_name', '.novel_list>ul>li>a');
    addCRule('www.bxwx.cc', '.novel_title', '.novel_content', 0, 1);
    addRRule('www.bxwx.cc', '【.*?新.*?笔.*?下.*?文.*?学.*?】');
    addIRule('www.uecg.net', '优易小说网', '.novel_name', '.chapter>dd>a');
    addCRule('www.uecg.net', '.novel_title', '.novel_content', 0, 1);
    addRRule('www.uecg.net', '优易小说网 http://www.uecg.net 为您提供最好的免费小说在线阅读。');
    addIRule('www.5du5.com', '吾读小说网', 'h1', '#list>li>a');
    addCRule('www.5du5.com', 'h1', '#content', 0, 1);
    addIRule('www.klxsw.com', '可乐小说网', 'h1>a', 'body>center>table>tbody>tr>td>div>a');
    addCRule('www.klxsw.com', '.newstitle', '#r1c', 0, 1);
    addIRule('www.3gxs.com', '00小说', '.book_news_title>ul:nth-child(1)>li:nth-child(1)>a:nth-child(3)', '.booklist>li>span>a');
    addCRule('www.3gxs.com', '.vv', '#content', 0, 1);
    addIRule('www.baoliny.com', '风云小说阅读网', 'h1', 'table.acss>tbody>tr>td.ccss>a');
    addCRule('www.baoliny.com', 'h1', '#content', 0, 1);
    addRRule('www.baoliny.com', '【.*?baoliny.*?】');
    addIRule('www.dhzw.com', '大海中文', 'h1', '#list>dl>dd>a');
    addCRule('www.dhzw.com', 'h1', '#BookText', 0, 1);
    addIRule('www.bxwx8.org', '笔下文学', '#title', '#TabCss>dl>dd>a', '', true);
    addCRule('www.bxwx8.org', '#title', '#content', 0, 1);
    addIRule('www.dajiadu.net', '大家读书院', 'h1', '#booktext>ul>li>a');
    addCRule('www.dajiadu.net', '#title', '#content1', 0, 1);
    addRRule('www.dajiadu.net', '更多精彩小说.*');
    addIRule('www.3dllc.com', '官术网', '.v-nav>p>a:nth-child(2)', '.pox>li>a');
    addCRule('www.3dllc.com', 'h1', '.zhang-txt-nei-rong');
    addRRule('www.3dllc.com', '温馨提示：方向键左右.*');
    addIRule('www.llwx.net', '啦啦文学网', 'h1', '#list>dl>dd>a');
    addCRule('www.llwx.net', 'h1', '#content>p', 0, 1);
    addIRule('www.paoshuba.cc', '泡书吧', '#info>h1', '#list>dl>dd>a');
    addCRule('www.paoshuba.cc', '.zhangjieming>h1', '#TXT', 0, 1);
    addIRule('www.qmshu.com', '启蒙书网', '.wrapper_list>h1>a', '#htmlList>dl>dd>ul>li>strong>a');
    addCRule('www.qmshu.com', 'h1', '#htmlContent', 0, 1);
    addRRule('www.qmshu.com', '无弹窗小说网.*', '看更新最快的.*');
    addIRule('www.gdsanlian.com', '三联文学网', '.content>h1', '.dirbox>dl>dd>a');
    addCRule('www.gdsanlian.com', 'h1', '#contents', 0, 1);
    addIRule('www.xinsiluke.com', '思路客小说阅读网', '#title>h1', '#list>dl>dd>a');
    addCRule('www.xinsiluke.com', 'h1', '#content', 0, 1);
    addRRule('www.xinsiluke.com', '新思路客.*?com');
    addIRule('www.zhuzhudao.com', '猪猪岛小说网', 'h1', '.list>dd>a');
    addCRule('www.zhuzhudao.com', 'h1', '.content', 0, 1);
    addIRule('www.fqxsw.com', '番茄小说', '#info>h1', '#list>dl>dd>a');
    addCRule('www.fqxsw.com', 'h1', '#content', 0, 1);
    addRRule('www.fqxsw.com', 'fqxsw.com');
    addIRule('www.baquge.com', '新笔趣阁', 'h1', '#list>dl>dd>a');
    addCRule('www.baquge.com', 'h1', '#content', 0, 1);
    addIRule('www.bookabc.net', 'ABC小说', '.bookinfo>h1', '.chapter-list>li>a');
    addCRule('www.bookabc.net', 'h1', '#content');
    addIRule('www.13xs.com', '13小说', '.con_top>a:nth-child(3)', '#list>dl>dd>a');
    addCRule('www.13xs.com', 'h1', '#booktext', 0, 1);
    addIRule('www.1xiaoshuo.com', 'E小说', '#info>h1', '#list>dl>dd>a');
    addCRule('www.1xiaoshuo.com', 'h1', '#content', 0, 1);
    addRRule('www.1xiaoshuo.com', 'E.*?小.*?说.*?\.com');
    addIRule('www.daomengren.com', '盗梦人小说网', '#info>h1', '#list>dl>dd>a');
    addCRule('www.daomengren.com', 'h1', '#content>p', 0, 1);
    addIRule('www.xs84.me', '小说巴士', '.info>ul>li>h1', '#list>dl>dd>a');
    addCRule('www.xs84.me', 'h1', '#contentts', 0, 1);
    addIRule('www.zhaifans.com', '宅范书斋', '.headname', '.contentlist>ul>li>a');
    addCRule('www.zhaifans.com', '.headtitle', '#showcontent', 0, 1);
    addIRule('www.ranwen.org', '燃文小说', '#info>h1', '#list>dl>dd>a');
    addCRule('www.ranwen.org', 'h1', '#content', 0, 1);
    addRRule('www.ranwen.org', '燃.*?文.*?小.*?说.*?org');
    addIRule('www.773buy.com', '燃文小说', '.bname', '.dccss>a');
    addCRule('www.773buy.com', '.bname_content', '#content', 0, 1);
    addRRule('www.773buy.com', '更多精彩小说请访问.*?');
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
    addIRule('www.sto.cc', '思兔閱讀', 'h1', '#Page_select>option');
    addCRule('www.sto.cc', 'h1', '#BookContent', 1);
    addRRule('www.sto.cc', '\s+||| ', '<span.*?</span>');
    addIRule('www.shouda8.com', '手打吧', '#info>h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.shouda8.com', 'h1', '#content', 0, 1);
    addIRule('www.shumilou.net', '书迷楼', '.btitle>h1', '.chapterlist>dd>a');
    addCRule('www.shumilou.net', 'h1', '#BookText', 0, 1);
    addRRule('www.shumilou.net', 'www.shumilou.net');
    addIRule('www.64mi.com', '爱尚小说网', 'h1', '#at>tbody>tr>td.L>a');
    addCRule('www.64mi.com', 'h1', '#contents', 0, 1);
    addIRule('www.zhuzhudao.cc', '猪猪岛小说网', 'h1', '#list>dl>dd>a');
    addCRule('www.zhuzhudao.cc', 'h1', '#content', 0, 1);
    addIRule('www.wanshuba.com', '万书吧', '.ml_title>h1', '.ml_main>dl>dd>a');
    addCRule('www.wanshuba.com', 'h2', '.yd_text2', 0, 1);
    addIRule('www.6yzw.com', '六月中文网', '#info>h1', '#list>dl>dd>a');
    addCRule('www.6yzw.com', 'h1', '#content>p', 0, 1);
    addIRule('www.muyuge.com', '木鱼哥', '.xsh1>h1>a', '#xslist>ul>li>a');
    addCRule('www.muyuge.com', 'h1', '#content', 0, 1);
    addIRule('www.zaiduu.com', '再读中文', '#info>h1', '#list>dl>dd>a');
    addCRule('www.zaiduu.com', 'h1', '#TXT');
    addIRule('www.musemailsvr.com', 'MuseMail中文', '.wrapper>h1>a', '.nav>span>a');
    addCRule('www.musemailsvr.com', '.title', '#content', 0, 1);
    addIRule('www.lewenwu.com', '乐文屋', '.infot>h1', '.chapterlist>li>a');
    addCRule('www.lewenwu.com', 'h1', '#content', 0, 1);
    addIRule('www.50zw.co', '武林中文网', '#info>h1', '.chapterlist>li>a');
    addCRule('www.50zw.co', 'h1', '#htmlContent', 0, 1);
    addIRule('www.xiangcunxiaoshuo.com', '乡村小说网', '.ml_title>h1', '.ml_main>dl>dd>a');
    addCRule('www.xiangcunxiaoshuo.com', 'h2', '.yd_text2', 0, 1);
    addRRule('www.xiangcunxiaoshuo.com', '看最快章节就上（.*?）', '百度搜索（.*?）');
    addIRule('www.lwxs520.com', '乐文小说网', '.infot>h1', '.dccss>a');
    addCRule('www.lwxs520.com', 'h1', '#content>p', 0, 1);
    addIRule('www.scwzw.net', '伤城文章网', '#info>h1', '.qq');
    addCRule('www.scwzw.net', 'h1', '#content', 0, 1);
    addIRule('www.yunlaige.com', '云来阁小说', '.title>h1', '#contenttable>tbody>tr>td>a');
    addCRule('www.yunlaige.com', '.ctitle', '#content', 0, 1);
    addIRule('www.cfwx.net', '长风文学', '.bdsub>dl>dd>h1', '.L>a:lt(-1)');
    addCRule('www.cfwx.net', 'h1', '#contents', 0, 1);
    addRRule('www.cfwx.net', '长.*?风.*?文.*?学.*?w.*?.*?w.*?c.*?f.*?w.*?x.*?n.*?e.*?t');
    addIRule('www.qiuwu.net', ' 凤舞文学网', '.dir_main>h1', '.dir_main_section>ol>li>a');
    addCRule('www.qiuwu.net', 'h1', '#content', 0, 1);
    addIRule('www.33yq.com', '33言情', '#info>a>h1', '#list>dl>dd>a');
    addCRule('www.33yq.com', 'h1', '#TXT', 0, 1);
    addIRule('www.xs74.com', '小说骑士', '#info>h1', '#list>dl>dd>a');
    addCRule('www.xs74.com', 'h1', '#content', 0, 1);
    addIRule('www.fhxiaoshuo.com', '凤凰小说网', '#info>h1', '#list>dl>dd>a', '', true);
    addCRule('www.fhxiaoshuo.com', 'h1', '#TXT', 0, 1);
    addIRule('www.snwx.com', '少年文学', '.infotitle>h1', '#list>dl>dd>a');
    addCRule('www.snwx.com', 'h1', '#BookText', 0, 1);
    addIRule('www.yawen8.com', '雅文小说', '#list>dl>dd>a', '#list>dl>dd>a');
    addCRule('www.yawen8.com', 'h1', '#content', 0, 1);
    addIRule('www.7dsw.com', '7度书屋', '.infotitle>h1', '#list>dl>dd>a');
    addCRule('www.7dsw.com', 'h1', '#BookText', 0, 1);
    addIRule('www.20xs.cc', '顶点小说', 'h1', '.article_texttitleb>li>a');
    addCRule('www.20xs.cc', 'h1', '#book_text', 0, 1);
    addIRule('www.piaotian.net', '飘天文学', 'h1', '.centent>ul>li>a:gt(3)');
    addCRule('www.piaotian.net', 'h1', '#content', 0, 1);
    addRRule('www.piaotian.net', '选择背景颜色：', '选择字体大小：', '手机用户请访问http://m.piaotian.net.*');
    addIRule('www.biquge.com.tw', '笔趣阁', 'h1', '#list>dl>dd>a');
    addCRule('www.biquge.com.tw', 'h1', '#content', 0, 1);
    addIRule('www.xzmao.net', '下载猫', 'h1', '.TabCss>dl>dd>a');
    addCRule('www.xzmao.net', '#title', '#content');
    addIRule('www.shuyaya.com', '丫丫电子书', 'h1', '.dirconone>ul>li>a');
    addCRule('www.shuyaya.com', 'h1', '#content');
    addIRule('www.freexs.cn', '免费小说网', 'h1', '.readout>table>tbody>tr>td>a');
    addCRule('www.freexs.cn', '.readout>h1', '.shuneirong', 0, 1);
    addIRule('guji.artx.cn', '中国古籍全录', '.dforum_show_title>h1', '.l_mulu_table>div>ul>li>a');
    addCRule('guji.artx.cn', '.dforum_show_title>h1', '#r_zhengwen', 1);
    addRRule('guji.artx.cn', '请登录会员以观全文。');
    addIRule('www.zhaishu8.com', '摘书网', '.booktitle>em', '#BookText>ul>li>a');
    addCRule('www.zhaishu8.com', 'h1', '#texts>p', 0, 1);
    addRRule('www.zhaishu8.com', '看完记得：.*');
    addIRule('www.yxgsk.com', '云霄阁书库', 'h1', '#list>dl>dd>a');
    addCRule('www.yxgsk.com', 'h1', '#content', 0, 1);
    addIRule('www.uctxt.com', 'uc书盟', 'h1', 'dl.chapter-list>dd>a');
    addCRule('www.uctxt.com', 'h1', '#content', 0, 1);
    addIRule('www.17shu.com', '一起看书网', 'h2', '.ccss>a');
    addCRule('www.17shu.com', '.ctitle', '#ccontent', 0, 1);
    addIRule('www.xzcl.com', '言情小说网', 'h1', '#readerlist>ul>li>a');
    addCRule('www.xzcl.com', 'h1', '#content', 0, 1);
    addIRule('www.xunread.com', '迅读网', '#title_1', '#content_1>.spant>a');
    addCRule('www.xunread.com', '#title_1', '#content_1', 0, 1);
    addIRule('www.xiucaiwu.com', '秀才屋', 'h1', '.dccss>a');
    addCRule('www.xiucaiwu.com', '#read_chaptername', '#content', 0, 1);
    addRRule('www.xiucaiwu.com', '在手机看本书的网址.*');
    addIRule('www.xiaoshuomm.org', '小说MM', 'h1', '.ccss>a', '', true);
    addCRule('www.xiaoshuomm.org', 'h1', '#content', 0, 1);
    addRRule('www.xiaoshuomm.org', 'm.xiaoshuomm.org小说MM提供.*');
    addIRule('www.xiaoshuo570.com', '小说570', 'h1', '#chapterlist>ul>li>a');
    addCRule('www.xiaoshuo570.com', 'h1', '#content', 0, 1);
    addIRule('www.70shu.com', '齐林书院', 'td>span>b', 'body>table>tbody>tr>td>table>tbody>tr>td>a[href^="paper"]');
    addCRule('www.70shu.com', 'h1', 'td[valign="top"]:has(br)', 0, 1);
    addIRule('www.wuxia.net.cn', '武侠小说网', 'h1', '.book>dl>dd>a');
    addCRule('www.wuxia.net.cn', 'h1', '.text');
    addIRule('www.23xs.org', '爱上小说', 'h1', '.mod_container>dl>dd>a');
    addCRule('www.23xs.org', 'h2', '.novel_content', 0, 1);
    addRRule('www.23xs.org', '全本推荐：.*');
    addIRule('www.wucuoshu.com', '无错书网', 'h1', '.L>a');
    addCRule('www.wucuoshu.com', 'h1', '#contents', 0, 1);
    addRRule('www.wucuoshu.com', 'www.wucuoshu.com', '无错书网');
    addIRule('www.shulou.cc', '书楼小说网', 'h1', '#readerlist>ul>li>a');
    addCRule('www.shulou.cc', 'h1', '#content', 0, 1);
    addIRule('www.yssm.org', '幼狮书盟', 'h1', '.chapterlist>dd>a');
    addCRule('www.yssm.org', 'h1', '#content');
    addIRule('www.114zw.la', '114中文', 'h1', '#list>dl>dd>a');
    addCRule('www.114zw.la', 'h1', '#content', 0, 1);
    addRRule('www.114zw.la', '手机用户请浏览.*');
    addIRule('www.15k.cc', '15k小说网', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.15k.cc', 'h1', '#content', 0, 1);
    addIRule('www.33xs.com', '33小说网', 'h1', '.as>tbody>tr>td>a[href$=".html"]');
    addCRule('www.33xs.com', 'h1', '#detail', 0, 1);
    addRRule('www.33xs.com', '更快更新尽在.*');
    addIRule('www.360wxw.com', '360文学网', '#title', '.TabCss>dl>dd>a:lt(-3)');
    addCRule('www.360wxw.com', 'h1', '#text_area>div', 0, 1);
    addIRule('www.3gtxt.com', '3G小说网', '.title>h2', '.ocon>dl>dd>a');
    addCRule('www.3gtxt.com', '.nr_title>h3', '#htmlContent', 0, 1);
    addIRule('www.51kanshuu.com', '51看书网', 'h1', '#at>tbody>tr>td>a');
    addCRule('www.51kanshuu.com', 'h1', '#contents', 0, 1);
    addIRule('www.57xs.com', '57小说网', 'h1', '.L>a');
    addCRule('www.57xs.com', 'h1', '#contents', 0, 1);
    addRRule('www.57xs.com', '.*获取免费书架。</h3>');
    addIRule('www.73wx.com', '73文学网', 'h1', '#list>dl>dd>a');
    addCRule('www.73wx.com', 'h2>font', '#content>p', 0, 1);
    addIRule('www.d7zy.com', '第七中文', 'h3.book_name>a', '#content>dl>dd>a');
    addCRule('www.d7zy.com', 'h1', '.chapter_con', 0, 1);
    addRRule('www.d7zy.com', '一秒记住本站网址.*');
    addIRule('www.liaoshuwang.com', '聊书网', 'h1', '.chapterlist>dd>a');
    addCRule('www.liaoshuwang.com', 'h1', '#BookText', 0, 1);
    addIRule('www.qfxs.cc', '清风小说', 'h1', '.book_list>ul>li>a');
    addCRule('www.qfxs.cc', 'h1', '#htmlContent', 0, 1);
    addRRule('www.qfxs.cc', '温馨提示.*');
    addIRule('www.fenghuaju.cc', '风华居', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.fenghuaju.cc', 'h1', '#content', 0, 1);
    addIRule('www.52ea.com', '顶点小说', 'h1', '.L>a');
    addCRule('www.52ea.com', 'h1', '#contents');
    addRRule('www.52ea.com', '请记住我们的域名：.*?以便您下次阅读！');
    addIRule('www.shuqi6.com', '书旗小说', 'h1', '#xslist>ul>li>a');
    addCRule('www.shuqi6.com', 'h1', '#booktext', 0, 1);
    addRRule('www.shuqi6.com', '\s+||| ', '.*全文阅读</a>', '<a .*?>(.*?)</a>|||$1', '－－－－－－－－－－－－－.*');
    addIRule('www.kukukanshu.cc', '酷酷看书', 'h1', '.dirconone>ul>li>a');
    addCRule('www.kukukanshu.cc', 'h1', '#BookText', 0, 1);
    addRRule('www.kukukanshu.cc', '【最新章节阅读.*?】');
    addIRule('www.qbiquge.com', '笔趣阁', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.qbiquge.com', 'h1', '#content', 0, 1);
    addIRule('www.96wei.com', '九六味小说网', 'h1>a', '.lrlb>ul>li:not(.t_com)>a');
    addCRule('www.96wei.com', 'h1>a', '#article');
    addIRule('www.23us.us', '顶点小说网', 'h1', '.L>a');
    addCRule('www.23us.us', 'h1', '#contents', 0, 1);
    addIRule('www.23us.so', '顶点小说网', 'h1', '.L>a');
    addCRule('www.23us.so', 'h1', '#contents', 0, 1);
    addIRule('www.32xs.com', '顶点小说网', 'h1', '.chapterlist>dd>a');
    addCRule('www.32xs.com', 'h1', '#BookText', 0, 1);
    addIRule('www.23wx.cc', '顶点小说网', 'h1', '#list>dl>dd>a');
    addCRule('www.23wx.cc', 'h1', '#contents', 0, 1);
    addIRule('www.booktxt.net', '顶点小说网', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.booktxt.net', 'h1', '#content', 0, 1);
    addIRule('www.xdingdian.com', '顶点小说网', '.index_title', '.L>a');
    addCRule('www.xdingdian.com', 'h3', '#contents', 0, 1);
    addIRule('www.45book.com', '45小说网', 'h1', '#chapterlist>ul>li>a');
    addCRule('www.45book.com', 'h1', '#content', 0, 1);
    addIRule('www.81zw.org', '八一中文网', 'h1', '.book_list>ul>li>a', '', true);
    addCRule('www.81zw.org', 'h1', '#htmlContent', 0, 1);
    addRRule('www.81zw.org', '【新·八一中文网.*?】');
    addIRule('www.ddbiquge.com', '顶点笔趣阁', 'h1', '.dccss>a');
    addCRule('www.ddbiquge.com', 'h2>font', '#content', 0, 1);
    addIRule('www.dingdianzw.com', '顶点中文', 'h1', '.dccss>a');
    addCRule('www.dingdianzw.com', 'h2>font', '#content', 0, 1);
    addIRule('www.wucuo.cc', '无错小说网', 'h1', '#list>dl>dd>a:gt(11)');
    addCRule('www.wucuo.cc', 'h1', '#content', 0, 1);
    addIRule('www.epzwxs.com', 'E品中文小说', 'h1', '#list>a');
    addCRule('www.epzwxs.com', 'h1', '#content', 0, 1);
    addIRule('www.ibiquge.net', '笔趣阁', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.ibiquge.net', 'h1', '#content', 0, 1);
    addIRule('www.bxwx.us', '笔下文学', 'h1', '.zjlist>dd>a');
    addCRule('www.bxwx.us', 'h1', '#content', 0, 1);
    addIRule('www.ldks.cc', '零点看书', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.ldks.cc', 'h1', '#content', 0, 1);
    addIRule('www.xuehong.cc', '血红小说网', 'h1', '.mulu>ul>li>a');
    addCRule('www.xuehong.cc', 'h1', '.yd_text2', 0, 1);
    addIRule('www.bipuge.com', '笔铺阁', 'h3>a', '#content>dl>dd>a');
    addCRule('www.bipuge.com', 'h1', '.chapter_con', 0, 1);
    addIRule('www.4gbk.com', '江山文学网', 'h1', '.book_list>ul>li>a');
    addCRule('www.4gbk.com', 'h1', '#htmlContent', 0, 1);
    addIRule('www.927xs.com', '927小说网', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.927xs.com', 'h1', '#content', 0, 1);
    addIRule('www.shubaowx.com', '书包文学网', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.shubaowx.com', 'h1', '#content', 0, 1);
    addIRule('www.biqukan.com', '笔趣阁', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.biqukan.com', 'h1', '#content', 0, 1);
    addIRule('www.35zw.com', '35中文网', 'h1', '.book_list>ul>li>a', '', true);
    addCRule('www.35zw.com', 'h1', '#htmlContent', 0, 1);
    addIRule('www.23wxw.cc', '顶点小说网', 'h1', '.xsList>dl>dd>a');
    addCRule('www.23wxw.cc', 'h1', '#contents', 0, 1);
    addIRule('www.kwxs.com', '渴望小说', 'h1', '.dirbox>dl>dd>a');
    addCRule('www.kwxs.com', 'h1', '#table_container', 0, 1);
    addIRule('www.kan61.com', '61看书网', 'h1', '#chapterlist>ul>li>a');
    addCRule('www.kan61.com', 'h1', '#content', 0, 1);
    addIRule('www.junzige.la', '君子阁', 'h1', '#list>dl>dd>a');
    addCRule('www.junzige.la', 'h1', '#content', 0, 1);
    addIRule('www.lwxs.la', '乐文小说', 'h1', '.dccss>a');
    addCRule('www.lwxs.la', 'h1', '#content>p', 0, 1);
    addIRule('www.lwxs.com', '乐文小说网', 'h1', '#list>dl>dd>a');
    addCRule('www.lwxs.com', 'h1', '#TXT', 0, 1);
    addIRule('www.nuomi9.com', '糯米小说网', 'h1', '#list>dl>dd>a');
    addCRule('www.nuomi9.com', 'h1', '#content', 0, 1);
    addIRule('www.feizw.com', '飞速中文网', '.info>p>a', '.chapterlist>ul>li>a');
    addCRule('www.feizw.com', '.chaptertitle', '#content', 0, 1);
    addRRule('www.feizw.com', '最快更新.*');
    addIRule('www.touxiang.la', '偷香小说网', 'h1', '.book_list>ul>li>a', '', true);
    addCRule('www.touxiang.la', 'h1', '#htmlContent', 0, 1);
    addIRule('www.biquga.com', '笔趣阁', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.biquga.com', 'h1', '#content', 0, 1);
    addIRule('www.65xs.com', '65小说网', 'h1', '.book_list>ul>li>a', '', true);
    addCRule('www.65xs.com', 'h1', '#htmlContent', 0, 1);
    addIRule('www.530p.com', '无弹窗小说网', '.tna>a', '.conter>div>a');
    addCRule('www.530p.com', 'h1', '#cp_content', 0, 1);
    addRRule('www.530p.com', '无弹窗小说网', 'www.530p.com');
    addIRule('www.89wx.com', '89文学网', 'h1', '#list>dl>dd>a:gt(8)');
    addCRule('www.89wx.com', 'p.ctitle', '#content', 0, 1);
    addIRule('www.97xs.net', '97小说网', '.bigname', '.zjlist4>ol>li>a');
    addCRule('www.97xs.net', '#htmltimu', '#jsreadbox', 0, 1);
    addRRule('www.97xs.net', '\s+||| ', '.*文 /', '<div class="button_con.*');
    addIRule('www.99zw.cn', '九九中文网', 'h1>strong>span', '.book_02>tbody>tr>td>table>tbody>tr>td>a');
    addCRule('www.99zw.cn', '#title', '#content>div', 0, 1);
    addIRule('www.88zw.com', '巴巴中文', 'h1', '#list>dl>dd>a');
    addCRule('www.88zw.com', 'h1', '#content', 0, 1);
    addIRule('www.nwell.net', 'Ｎ维空间', 'td.f20black_w>div', 'td.f12>a');
    addCRule('www.nwell.net', 'td>p', '#content', 0, 1);
    addIRule('www.u8xs.com', 'U8小说', 'h1', '#list>dl>dd>a');
    addCRule('www.u8xs.com', 'h1', '#content', 0, 1);
    addIRule('www.xcmfu.com', 'X起点', '.bookName>b', '.dccss>a');
    addCRule('www.xcmfu.com', '.newstitle', '#BookText', 0, 1);
    addRRule('www.xcmfu.com', 'X起点小说网欢迎您.*');
    addIRule('www.uuxs.net', 'uu小说', 'h1', '.chapterlist>dd>a');
    addCRule('www.uuxs.net', '#BookTitle', '#BookText', 0, 1);
    addIRule('www.ifxsw.com', '爱疯小说网', 'h1', '.list>ul>li>a');
    addCRule('www.ifxsw.com', 'h1', '#booktext', 0, 1);
    addIRule('www.axxsw.org', '傲轩小说网', 'h1', '#list>dl>dd>a');
    addCRule('www.axxsw.org', 'h1', '#content>p', 0, 1);
    addRRule('www.axxsw.org', '傲轩.*?小说网', 'www.axxsw.org');
    addIRule('www.8jzw.com', '八戒中文网', 'h1', '.booklist>span>a');
    addCRule('www.8jzw.com', 'h1', '#content>p');
    addRRule('www.8jzw.com', 'www.8jzw.com', '全文免费阅读.*');
    addIRule('www.81zw.com', '八一中文网', 'h1', '#list>dl>dd>a');
    addCRule('www.81zw.com', 'h1', '#content', 0, 1);
    addIRule('www.100huts.com', '百草堂文学网', 'h1', '.TabCss>dl>dd>a');
    addCRule('www.100huts.com', '#TextTitle', '#BookText', 0, 1);
    addIRule('baishuku.com', '百书库', 'h1', '.ccss>a');
    addCRule('baishuku.com', 'h1', '#content', 0, 1);
    addIRule('www.bj-ibook.cn', '北京爱书', '.title', '.chapter>a');
    addCRule('www.bj-ibook.cn', '.title', '#content', 0, 1);
    addIRule('www.sj133.com', '穿越小说吧', '.bigname', '.zjlist4>ol>li>a');
    addCRule('www.sj133.com', '#htmltimu', '#htmlContent', 0, 1);
    addIRule('www.d5wx.com', '第五文学网', 'h1', '#list>dl>dd>a');
    addCRule('www.d5wx.com', 'h1', '#content>p', 0, 1);
    addIRule('www.lnwow.com', '东方小说阅读网', 'h1', '.insert_list>dl>dd>ul>li>a');
    addCRule('www.lnwow.com', 'h1>span', '#BookText', 0, 1);
    addRRule('www.lnwow.com', '本书来自 品.*?书.*', '本书来源 东方小说阅读网.*');
    addIRule('www.23us.la', '顶点小说', 'h1', '.chapterlist>dd>a');
    addCRule('www.23us.la', 'h1', '#content');
    addIRule('www.dddbbb.net', '豆豆小说阅读网', '.mytitle', '.opf>table>tbody>tr>td>a');
    addCRule('www.dddbbb.net', '.mytitle', '#content', 0, 1);
    addIRule('www.du8w.com', '读读吧', 'font>b', '.volumes>table>tbody>tr>td>ul>li>a:gt(5)');
    addCRule('www.du8w.com', 'font>b', '.chaptertxt', 0, 1);
    addRRule('www.du8w.com', '.*?精彩内容马上开始！!', '更新完毕！敬请期待.*');
    addIRule('www.fengwu.net', '奇幻文学', 'h1', '.art_listmain_main>div>span>a');
    addCRule('www.fengwu.net', 'h1', '#content', 0, 1);
    addIRule('www.geilwx.com', '给力文学网', 'h1', '.TabCss>dl>dd>a');
    addCRule('www.geilwx.com', 'h1', '#content', 0, 1);
    addRRule('www.geilwx.com', '\s+||| ', '.*?<!--go-->', '<!--over-->.*');
    addIRule('www.uukanshu.com', 'UU看书', 'h1>a', '#chapterList>li>a', '', true);
    addCRule('www.uukanshu.com', 'h1', '#contentbox', 0, 1);
    addIRule('www.hxsk.net', '华夏书库', 'h1', '#list>dl>dd>a');
    addCRule('www.hxsk.net', 'h1', '#content', 0, 1);
    addIRule('www.99reader.cn', '久久读书人', '#title>a', '.ccss>a:gt(3)');
    addCRule('www.99reader.cn', '#title', '#content', 0, 1);
    addIRule('www.cc98.cc', '久久小说网', 'h2', '.liebiao_bottom>dl>dd>a');
    addCRule('www.cc98.cc', 'h1', '#neirong', 0, 1);
    addIRule('www.oldrain.com', '旧雨楼', '.headfont', 'body>.basic>tbody>tr>td>a');
    addCRule('www.oldrain.com', '.content', 'pre>.text1', 0, 1);
    addIRule('www.92txt.net', '就爱网', 'h1', '.chapterlist>dd>a', '', true);
    addCRule('www.92txt.net', 'h1', '#chapter_content', 0, 1);
    addIRule('www.jsnovel.com', '军事小说网', 'td>span', 'table>tbody>tr>td>table>tbody>tr>td>a:visible');
    addCRule('www.jsnovel.com', 'b>span', '#mouseRight', 0, 1);
    addIRule('www.kehuan.net.cn', '科幻小说网', 'h1', '.book>dl>dd>a');
    addCRule('www.kehuan.net.cn', 'h1', '.text');
    addIRule('www.kuwen.net', '酷文小说网', 'h1', '#list>dl>dd>a');
    addCRule('www.kuwen.net', 'h1', '#TXT');
    addIRule('leduwo.com', '乐读窝', 'h1', '.ccss>a');
    addCRule('leduwo.com', 'h1', '#content', 0, 1);
    addIRule('www.mingshulou.com', '名书楼', 'h1', '#list>dl>dd>a');
    addCRule('www.mingshulou.com', 'h1', '#content', 0, 1);
    addIRule('www.nitxt.com', '休闲文学', 'h1', '.L>a:gt(0):lt(-1)');
    addCRule('www.nitxt.com', 'h1', '#contents', 0, 1);
    addRRule('www.nitxt.com', '.*详细阅读内容', 'NiTxt无广告小说网随时期待您的回来.*');
    addIRule('www.niheng.com', '逆横中文网', 'h1', '.chapterlist>dd>a');
    addCRule('www.niheng.com', 'h1', '#BookText', 0, 1);
    addIRule('www.pnxs.com', '平南文学', '.bookName', '.chapterlistxx>li>a');
    addCRule('www.pnxs.com', 'h2', '.txtc', 0, 1);
    addIRule('www.pgyzw.com', '蒲公英中文网', '#title+hr+div', '.ccss>a');
    addCRule('www.pgyzw.com', '#title+div', '#content', 0, 1);
    addRRule('www.pgyzw.com', '读首发,无广告,去蒲公英中文网');
    addIRule('book.ceqq.com', '千秋书库', '.max', '#table14>tbody>tr>td>table>tbody>tr>td>a[href^="view_book"]');
    addCRule('book.ceqq.com', '.max', '#content_1', 0, 1);
    addIRule('www.xiaoshuo77.com', '小说77', 'h1', '.d_contarin>div>dl>dd>a');
    addCRule('www.xiaoshuo77.com', 'h1', '#content', 0, 1);
    addIRule('www.qudushu.com', '去读书', 'h1', '.ccss>a');
    addCRule('www.qudushu.com', 'h1', '#content', 0, 1);
    addRRule('www.qudushu.com', '\s+||| ', '<h1.*?#A2C66D.*?</div>', '<div.*');
    addIRule('www.7kankan.com', '去看看小说网', 'h1', '.uclist>dl>dd>a');
    addCRule('www.7kankan.com', 'h1', '#content', 0, 1);
    addIRule('www.ybdu.com', '一本读全本小说网', 'h1', '.mulu_list>li>a');
    addCRule('www.ybdu.com', 'h1', '#htmlContent', 0, 1);
    addIRule('www.quanbenn.com', '全本小说网', 'h1', '.L>a');
    addCRule('www.quanbenn.com', 'h1', '#contents', 0, 1);
    addRRule('www.quanbenn.com', '全本小说网手机版', 'm.quanbenn.com');
    addIRule('www.quanshu.net', '全书网', 'strong', '.dirconone>li>a');
    addCRule('www.quanshu.net', 'strong', '#content', 0, 1);
    addIRule('www.ranwenzw.com', '燃文中文网', 'h2>a', '.box_box>ul>li>a');
    addCRule('www.ranwenzw.com', 'h2', '.box_box', 0, 1);
    addIRule('www.52ranwen.net', '燃文123小说网', 'h1', '.booklist>dl>dd>a:lt(-3)');
    addCRule('www.52ranwen.net', 'h3', '.read-content', 0, 1);
    addRRule('www.52ranwen.net', '小说&lt;&lt;<a.*');
    addIRule('www.3zm.net', '5200小说网', 'h1', '.ccss>a', '', true);
    addCRule('www.3zm.net', 'h1', '#content', 0, 1);
    addIRule('www.xcxs.net', '乡村小说', 'h1', '.chapterlist>dd>a');
    addCRule('www.xcxs.net', 'h1', '#BookText', 0, 1);
    addIRule('www.kanshutang.net', '看书堂', 'h1', '.dirbox>dl>dd>a');
    addCRule('www.kanshutang.net', 'h1', '#table_container', 0, 1);
    addIRule('www.zshu.net', '追书网', '.mu_h1>h1', '.mulu_list>li>a');
    addCRule('www.zshu.net', '.ydleft>h1', '.yd_text2');
    addRRule('www.zshu.net', '\s+||| ', '温馨提示：.*');
    addIRule('www.shuanshu.com', '涮书网', '.bigname', '.zjlist4>ol>li>a');
    addCRule('www.shuanshu.com', '#htmltimu', '#htmlContent', 0, 1);
    addIRule('www.syzww.net', '源中文网', 'h1>a', '.list>li>a:lt(-3)');
    addCRule('www.syzww.net', '.h1', '#txt', 0, 1);
    addRRule('www.syzww.net', '\s+||| ', '因为升级到全文字版.*');
    addIRule('www.soso33.com', 'soso33小说网', 'h1', '#list>dl>dd>a');
    addCRule('www.soso33.com', 'h1', '#content', 0, 1);
    addIRule('90xsw.com', '90小说网', 'h1', '#list>dl>dd>a');
    addCRule('90xsw.com', 'h1', '#content', 0, 1);
    addRRule('90xsw.com', '[90小说网wap站.*]', '[记住我们.*]');
    addIRule('www.tsxsw.com', '吞噬小说网', 'h1', '.L>a');
    addCRule('www.tsxsw.com', 'h1', '#contents', 0, 1);
    addIRule('www.wm263.com', '完美世界小说', 'h1', '.book_article_listtext>dd>a');
    addCRule('www.wm263.com', 'h1', '#content', 0, 1);
    addIRule('www.103v.com', '微书网', 'h1', '.chapterlist>dd>a');
    addCRule('www.103v.com', 'h1', '#BookText', 0, 1);
    addIRule('www.wencuige.com', '文萃阁', 'h3', '.catalog_list>li>a');
    addCRule('www.wencuige.com', 'h1', '#J_article_con', 0, 1);
    addIRule('www.wenxg.com', '文心阁', 'h1', '.chapterNum>ul>li>a:gt(8)');
    addCRule('www.wenxg.com', 'strong', '#content');
    addIRule('www.zy200.com', '卓越全本小说网', 'h1', '#zcontent>dl>dd>a');
    addCRule('www.zy200.com', 'h1', '#content', 0, 1);
    addRRule('www.zy200.com', '(快捷键←).*');
    addIRule('www.mkxs.com', '泊星石书院', 'h1', '.box-item>ul>li>a');
    addCRule('www.mkxs.com', 'h1', '#text_area', 0, 1);
    addRRule('www.mkxs.com', '(泊星石书院http://www.mkxs.com)');
    addIRule('www.shenhen.com', '深痕文学', 'h2>a', '.chapter>a');
    addCRule('www.shenhen.com', 'h2', '#htmlContent', 0, 1);
    addIRule('www.23xsw.cc', '爱尚小说网', 'h1', '.zp_li>a:gt(7)');
    addCRule('www.23xsw.cc', 'h1', '#contents', 0, 1);
    addRRule('www.23xsw.cc', '<p>.*?</p>');
    addIRule('www.biquge.cc', '笔趣阁', 'h1', '#list>dl>dd>a');
    addCRule('www.biquge.cc', 'h1', '#content');
    addIRule('www.19lou.tw', '19楼', '.booktitle', '#BookText>dl>dd>a');
    addCRule('www.19lou.tw', '.adtext+dt', '#booktext', 0, 1);
    addIRule('www.136book.com', '136书屋', 'h1', '.box1>ol>li>a:gt(15)');
    addCRule('www.136book.com', 'h1', '#content');
    addRRule('www.136book.com', '\s+||| ', '<center>.*?</center>');
    addIRule('www.88106.com', '88106', 'h1', '.ccss>a');
    addCRule('www.88106.com', 'h1', '#clickeye_content', 0, 1);
    addIRule('tianyibook.com', '天翼文学', 'h1', '.ccss>a');
    addCRule('tianyibook.com', 'h1', '#content', 0, 1);
    addIRule('www.dawenxue.org', '大文学', '', '.chapter>a');
    addCRule('www.dawenxue.org', 'h1', '#content', 0, 1);
    addIRule('www.amxs520.com', '阿木小说网', 'h1', '.list_Content>li>a');
    addCRule('www.amxs520.com', 'h1', '.content>span', 0, 1);
    addRRule('www.amxs520.com', '\s+||| ', '');
    addIRule('www.qiushu.cc', '求书网', 'h1', '.book_con_list>ul>li>a:gt(8)');
    addCRule('www.qiushu.cc', 'h1', '#content', 0, 1);
    addRRule('www.qiushu.cc', '\s+||| ', '<div class="con_l">.*');
    addIRule('www.txt99.cc', '久久小说下载网', '.view_t', '.read_list>a');
    addCRule('www.txt99.cc', '.view_t', '#view_content_txt');
    addRRule('www.txt99.cc', '\s+||| ', '<div class="view_page">.*');
    addIRule('www.wenxuemi.com', '文学迷', 'h1', '#list>dl>dd>a');
    addCRule('www.wenxuemi.com', 'h1', '#content', 0, 1);
    addIRule('quanxiaoshuo.com', '全小说', 'h1>a', '.chapter>a');
    addCRule('quanxiaoshuo.com', 'h1', '#content', 0, 1);
    addRRule('quanxiaoshuo.com', '\s+||| ', '<div.*</div>');
    addIRule('www.akxs6.com', '爱看小说网', 'h1', '#readerlist>ul>li>a');
    addCRule('www.akxs6.com', 'h1', '#content', 0, 1);
    addIRule('www.benbenwx.com', '笨笨文学网', 'h1', '.chapter>a');
    addCRule('www.benbenwx.com', 'h1', '#content', 0, 1);
    addIRule('www.du7.com', '读趣网', 'h1', '.uclist>dl>dd>a');
    addCRule('www.du7.com', '.title', '#fontsize', 0, 1);
    addIRule('www.wuxianzuosi.com', '旷世小说网', 'h1', '.category>ul>li>b>a');
    addCRule('www.wuxianzuosi.com', 'h1', '.txt');
    addRRule('www.wuxianzuosi.com', '本文永久分享地址.*');
    addIRule('www.xuanhuanlou.com', '玄幻楼', '.bigname', '.zjlist4>ol>li>a');
    addCRule('www.xuanhuanlou.com', 'h1', '#ntxt', 0, 1);
    addIRule('www.xiaoshuo777.com', '小说77', 'h2', '.ccss>a');
    addCRule('www.xiaoshuo777.com', '.ctitle', '#ccontent', 0, 1);
    addIRule('www.quanben.co', '全本小说网', 'h1', '.novel_list>ul>li>a');
    addCRule('www.quanben.co', 'h1', '.novel_content', 0, 1);
    addIRule('www.quanben5.com', '全本小说网', 'h3>span', '.list>li>a');
    addCRule('www.quanben5.com', 'h1', '#content');
    addIRule('www.soxs.cc', '搜小说', 'h1', '.list>dl>dd>a');
    addCRule('www.soxs.cc', 'h1', '#chaptercontent');
    addIRule('www.taotao3.com', '淘淘全本小说网', 'h1', '#book>dl>dd>a');
    addCRule('www.taotao3.com', 'h1', '.con_L', 0, 1);
    addIRule('quanben-xiaoshuo.com', '全本小说网', 'h1', '.chapter>ul>li>a');
    addCRule('quanben-xiaoshuo.com', 'h1', '#articlebody');
    addIRule('www.yanqing.cc', '言情小说', 'h1>a', '.dirconone>ul>li>a');
    addCRule('www.yanqing.cc', 'h2', '#chapter_content');
    addIRule('www.bayueju.com', '八月居小说网', '#title', '.ccss>a');
    addCRule('www.bayueju.com', 'h1', '#content>p', 0, 1);
    addIRule('www.yqxs.com', '言情小说', '#title', 'table>tbody>tr>td>a');
    addCRule('www.yqxs.com', 'h3', '#content', 0, 1);
    addIRule('www.zw360.com', '360小说网', '#htmltimu', '.chapter-list>li>a');
    addCRule('www.zw360.com', 'h2', '#htmlContent', 0, 1);
    addIRule('www.kanshu8.net', '看书吧网', 'h1', '.dccss>a');
    addCRule('www.kanshu8.net', 'h2', '#content>p', 0, 1);
    addIRule('www.45xs.com', '45小说网', 'h1', '.chapterlist>li>a');
    addCRule('www.45xs.com', 'h1', '#content', 0, 1);
    addIRule('www.2018pc.com', '2018小说网', 'h1', '.novel_list>ul>li>a');
    addCRule('www.2018pc.com', 'h1', '.novel_content', 0, 1);
    addIRule('www.1778go.com', '一起看书吧', 'h1', '#list>dl>dd>a');
    addCRule('www.1778go.com', 'h1', '#booktext', 0, 1);
    addIRule('www.qbyqxs.com', '全本言情小说', 'h1', '#readlist>ul>li>a');
    addCRule('www.qbyqxs.com', 'h1', '#content');
    addRRule('www.qbyqxs.com', '\s+||| ', '<div.*?</div>');
    addIRule('www.zwxiaoshuo.com', '滋味小说网', 'h1', '.insert_list>dl>dd>ul>li>ul>li>strong>a', '', true);
    addCRule('www.zwxiaoshuo.com', '#htmltimu', '#htmlContent', 0, 1);
    addIRule('www.shubao22.com', '书包网', 'h1', '#list>dl>dd>a');
    addCRule('www.shubao22.com', 'h1', '#booktext', 0, 1);
    addIRule('www.55xs.com', '55小说网', 'h1', '.list>tbody>tr>td>a');
    addCRule('www.55xs.com', 'h1', '#contents', 0, 1);
    addIRule('www.qingdoubook.com', '青豆小说网', 'h1', '.www>a');
    addCRule('www.qingdoubook.com', 'h1', '#content', 0, 1);
    addIRule('www.shuqiba.com', '书旗吧小说网', 'h1', '.chapterlist>dd>a:gt(11)');
    addCRule('www.shuqiba.com', 'h1', '#BookText', 0, 1);
    addIRule('www.xiuvi.com', '秀薇小说', '.title>h2', '.list_box>ul>li>a');
    addCRule('www.xiuvi.com', 'h2', '.box_box', 0, 1);
    addIRule('www.ryzww.com', '若雨中文网', 'h1', '#list>dl>dd>a');
    addCRule('www.ryzww.com', 'h1', '#content>p', 0, 1);
    addIRule('www.miaobige.com', '妙笔阁', 'h1', '#readerlist>ul>li>a');
    addCRule('www.miaobige.com', 'h1', '#content', 0, 1);
    //////////////////////////////////////////////////18X
    addIRule('www.haiax.net', '海岸线文学网', '.kui-left.kui-fs32', '.kui-item>a');
    addCRule('www.haiax.net', 'h1.kui-ac', '#kui-page-read-txt', 0, 1);
    addIRule('www.lewenxs.net', '乐文小说网', '.kui-left.kui-fs32', '.kui-item>a');
    addCRule('www.lewenxs.net', 'h1.kui-ac', '#kui-page-read-txt', 0, 1);
    addIRule('www.wodexiaoshuo.com', '我的小说网', 'h2>a', '.box_box>ul>li>a');
    addCRule('www.wodexiaoshuo.com', '.box_con>h2', '.box_box', 0, 1);
    addIRule('www.bashudu.com', '第二书包网', 'h1', '.list>ul>li>a:lt(-1)');
    addCRule('www.bashudu.com', 'h1', '.chapter', 1, 1);
    addIRule('bbs.6park.com', '禁忌书屋', 'font>b', 'body>table>tbody>tr>td>ul>li>a', '', true);
    addCRule('bbs.6park.com', 'font>b', 'td:has(center)', 1, 1);
    addIRule('web.6park.com', '留园', 'font>span', 'body>table>tbody>tr>td>li>a', '', true);
    addCRule('web.6park.com', 'font>b', 'td', 1, 1);
    addIRule('www.neixiong88.com', '内兄小说网', 'h2.bookName', '.bookUpdate>dl>dd>a');
    addCRule('www.neixiong88.com', 'h2', '#content', 1, 1);
    addIRule('www.chenfenggm.com', '辣文小说网', 'h1', '#read.chapter>.list>ul>li>a:lt(-1)');
    addCRule('www.chenfenggm.com', 'h1', '.chapter', 0, 1);
    addIRule('www.xncwxw.com', '新暖才文学网', 'h1>a', '#Table1>tbody>tr>td>a');
    addCRule('www.xncwxw.com', 'p.ctitle', '#content', 0, 1);
    addIRule('www.1766bbs.com', '屌丝小说网', 'h1', '.book_list>ul>li>a');
    addCRule('www.1766bbs.com', 'h1', '#htmlContent', 0, 1);
    addIRule('www.7788wx.com', '7788文学网', 'h1', '#list>dl>dd>a');
    addCRule('www.7788wx.com', 'h1', '#content', 0, 1);
    addIRule('www.bmwen.com', '苞米文学', 'h1', '.chapterlist>dd>a');
    addCRule('www.bmwen.com', 'h1', '#BookText', 0, 1);
    addIRule('www.beijingaishu.net', '北京爱书网', 'h1', '.ccss>a');
    addCRule('www.beijingaishu.net', 'h1', '#content', 0, 1);
    addRRule('www.beijingaishu.net', '本书由.*?提供', 'www.beijingaishu.net');
    addIRule('www.dz88.com', '读者吧', 'h1', '.entry_video_list>ul>li>a');
    addCRule('www.dz88.com', 'h1', '#view_content_txt', 0, 1);
    addIRule('www.kewaishu.net', '课外书阅读网', 'h1', '#list>dl>dd>a');
    addCRule('www.kewaishu.net', '.bookname>h1', '#content>p', 0, 1);
    addIRule('www.luoqiu123.com', '落秋中文网', 'h1', '.booklist>span>a');
    addCRule('www.luoqiu123.com', 'h1', '#content', 0, 1);
    addIRule('www.xsy2.com', '天翼中文', 'h1', '.booklist>span>a:gt(8)');
    addCRule('www.xsy2.com', 'h1', '#content', 0, 1);
    addIRule('www.baishulou.net', '百书楼', 'h1', '.dccss>a');
    addCRule('www.baishulou.net', 'h1', '#content', 0, 1);
    addRRule('www.ziqige3.com', '<font.*?</font>');
    addIRule('www.ziqige3.com', '紫气阁小说网', 'h1', '.list>ul>li>a');
    addCRule('www.ziqige3.com', 'h1', '.chapter', 0, 1);
    addIRule('www.lmzww.net', '林木中文网', 'h1', '.novel_list>ul>li>a');
    addCRule('www.lmzww.net', 'h1', '.novel_content', 0, 1);
    addIRule('www.t259.com', '紫轩小说吧', 'h1', '.L>a');
    addCRule('www.t259.com', 'h1', '#contents', 0, 1);
    addIRule('www.xt259.com', '紫轩小说吧', 'h1', '.L>a');
    addCRule('www.xt259.com', 'h1', '#contents', 0, 1);
    addIRule('www.ncwx.hk', '暖才文学网', 'h1', '.novel_list>ul>li>a');
    addCRule('www.ncwx.hk', 'h1', '.novel_content', 0, 1);
    addRRule('www.ncwx.hk', '【 暖才文学网 .*】');
    addIRule('www.77xsk.com', '腹黑书小说网', 'h1>a', '.dirconone>ul>li>a');
    addCRule('www.77xsk.com', 'h2', '#chapter_content');
    addIRule('520xs.co', '520小说', 'h1', '.dirinfo_list>dd>a');
    addCRule('520xs.co', 'h1', '#floatleft', 0, 1);
    addIRule('www.wowoxs.com', '7Z小说', '.font', '.chapter_box_ul>li>span>a');
    addCRule('www.wowoxs.com', '.font', '#a_content', 0, 1);
    addRRule('www.wowoxs.com', '(http://www.7zbook.com)', '7X24小时不间段更新最新小说');
    addIRule('www.7zxs.com', '7z小说网', '.title>h2', '.ocon>dl>dd>a');
    addCRule('www.7zxs.com', '.nr_title>h3', '#htmlContent', 0, 1);
    addRRule('www.7zxs.com', '登陆7z小说网.*');
    addIRule('www.tushuguan.cc', '小说图书馆', 'h1', '#list>dl>dd>a:gt(8)');
    chapterRule['www.tushuguan.cc'] = {
      'Deal': function(num, url) {
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          onload: function(response) {
            var name = jQuery('h1', response.response).text();
            var data = response.response.replace(/\s+/g, ' ').replace(/.*data:"(.*?)",.*/, '$1');
            chapterRule['www.tushuguan.cc'].Deal2(num, name, url, data);
          }
        });
      },
      'Deal2': function(num, name, url, data) {
        GM_xmlhttpRequest({
          method: 'POST',
          url: 'http://www.tushuguan.cc/content.xhtml',
          data: data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Referer': url,
            'X-Requested-With': 'XMLHttpRequest'
          },
          onload: function(response) {
            var content = JSON.parse(response.response).msg;
            thisDownloaded(num, name, content, 0);
          }
        });
      }
    };
    addIRule('www.qingdou.info', '青豆小说网', 'h1', '.mulu_list>li>a');
    addCRule('www.qingdou.info', 'h1', '#htmlContent', 0, 1);
    addIRule('www.jipinwww.com', '极品小说网', 'h1', '.book_list>ul>li>a');
    addCRule('www.jipinwww.com', 'h1', '.contentbox', 0, 1);
    addRRule('www.jipinwww.com', '请记住【极品小说网】.*?下载！', '\\s+||| ', '<div class="chapter_Turnpage.*');
    addIRule('www.duonie.com', '多涅小说网', 'h1', '.L>a');
    addCRule('www.duonie.com', 'h1', '#contents', 0, 1);
    addIRule('www.59tto.net', '59文学', 'h1>a', '.xiaoshuo_list>dd>a');
    addCRule('www.59tto.net', 'h1', '.article', 0, 1);
    addRRule('www.59tto.net', '您可以在百度里搜索.*');
    addIRule('www.qindouxs.net', '青豆小说网', '.kui-left.kui-fs32', '.kui-item>a');
    addCRule('www.qindouxs.net', 'h1.kui-ac', '#kui-page-read-txt', 0, 1);
    addIRule('www.shbdjs.org', '电子书屋', 'h1', '.novel_list>ul>li>a');
    addCRule('www.shbdjs.org', 'h1', '.novel_content', 0, 1);
    addIRule('www.ik777.net', '艾克小说网', '.title>h2', '.ocon>dl>dd>a');
    addCRule('www.ik777.net', '.nr_title>h3', '#htmlContent', 0, 1);
    addIRule('www.hyperfree.com', '任我淫书屋', 'font>b', 'tr>td:nth-child(1)>font>a');
    addCRule('www.hyperfree.com', '', 'body>htlm', 0, 1);
    addIRule('www.woqudu.com', '我去读文学网', '#title', '.ccss>a');
    addCRule('www.woqudu.com', '#title', '#content', 0, 1);
    addIRule('18av.mm-cg.com', '18H', '.label>div', '.novel_leftright>span>a:visible');
    addCRule('18av.mm-cg.com', '#left>h1', '#novel_content_txtsize', 1);
    //////////////////////////////////////////////////以上为站点规则
  })();
  jQuery(document.body).append('<div id="nD"><div class="nD-Main nD-BoxCenter"><button class="nD-ShowMain nD-BtnShow">X</button><button class="nD-ShowSupport">支持站点</button>&nbsp;<button class="nD-ShowSearch">搜索</button><div class="nD-Separator"></div><span class="nD-Info"></span><div class="nD-Separator"></div>下载线程：<input class="nD-Input nD-Thread"name="thread"placeholder="5"type="text">&nbsp;失败重试次数：<input class="nD-Input nD-Error"title="0表示不重试"name="error"placeholder="0"type="text"><br/>超时重试次数：<input class="nD-Input nD-Timeout"title="0表示不重试"name="timeout"placeholder="3"type="text">&nbsp;超时时间：<input class="nD-Input nD-Time"name="time"placeholder="20"type="text">秒<br/><input id="nD-Format"class="nD-Checkbox"name="format"type="checkbox"><label for="nD-Format">文本处理</label>&nbsp;<input id="nD-Section"class="nD-Checkbox"name="section"type="checkbox"><label for="nD-Section">强制分段</label>&nbsp;<input id="nD-Image"class="nD-Checkbox"name="image"type="checkbox"><label for="nD-Image">下载图片</label>&nbsp;<br/><input id="nD-Vip"class="nD-Checkbox"type="checkbox"></input><label for="nD-Vip">下载Vip章节</label>&nbsp;语言：<input id="nD-LangZhs"type="radio"name="lang"class="nD-Lang"value="0"checked="true"></input><label for="nD-LangZhs">简体</label><input id="nD-LangZht"type="radio"name="lang"class="nD-Lang"value="1"></input><label for="nD-LangZht">繁体</label><div class="nD-Separator"></div>分次下载&nbsp;<select class="nD-Split"name="type"><option value=""></option><option value="all-2">2次</option><option value="all-3">3次</option><option value="all-4">4次</option><option value="every-500">500章</option><option value="every-100">100章</option><option value="every-10">10章</option><option value="...">...</option></select>&nbsp;<button class="nD-SplitStart">开始下载</button><br/>下载范围&nbsp;<input placeholder="1开头,例1-25,35,50"class="nD-SplitInput"type="text"><div class="nD-Separator"></div><button class="nD-This">下载本章(TXT)</button>&nbsp;<button class="nD-All2Txt">下载目录页(TXT)</button><br/><button class="nD-All2Zip">下载目录页(ZIP)</button>&nbsp;<button class="nD-All2Epub">下载目录页(Epub)</button><div class="nD-Separator"></div><button class="nD-ShowCustomize">自定义站点规则</button></div><div class="nD-Support nD-BoxCenter"><button class="nD-ShowSupport nD-BtnShow">X</button><div class="nD-SupportDiv"></div></div><div class="nD-Search nD-BoxCenter"><button class="nD-ShowSearch nD-BtnShow">X</button><input class="nD-SearchInput"type="text"placeholder="利用Google自定义搜索Api，请自备梯子"><button class="nD-SearchBtnGo">Go</button><div class="nD-SearchTitle"></div><div class="nD-SearchHtml">如果你在【回车】或是按【Go按钮】后长时间看到这条，<br/>请检查梯子是否生效，尝试再次搜索。<br/>如无梯子，推荐<a href="https://laod.org/hosts/2016-google-hosts.html"target="_blank">老D的Hosts大法好</a>，简单粗暴</div><button class="nD-SearchBtnPrev">上一页</button>&nbsp;<button class="nD-SearchBtnNext">下一页</button></div><div class="nD-Customize nD-BoxCenter"><button class="nD-ShowCustomize nD-BtnShow">X</button><span>默认显示当前站点规则<br/>具体规则，详见<a href="https://github.com/dodying/UserJs/tree/master/novel/novelDownloader#自定义站点规则说明"target="_blank">自定义站点规则说明</a></span><br/><textarea class="nD-CustomizeTextarea"></textarea><br/><button class="nD-CustomizeSave">保存</button>&nbsp;<button class="nD-CustomizeDelete">删除某站点的规则</button>&nbsp;<button class="nD-CustomizeClear">清空</button><br/><button class="nD-CustomizeAll">显示所有规则</button></div><div class="nD-Url nD-BoxCenter"><button class="nD-ShowUrl nD-BtnShow">X</button><div class="nD-UrlDiv"><div class="nD-UrlDivNormal">---以下站点规则未保存---</div><div class="nD-UrlDivChange">---以下站点规则已变更---</div><div class="nD-UrlDivSaved">---以下站点规则已保存---</div></div><button class="nD-UrlAll">全选</button>&nbsp;<button class="nD-UrlInverse">反选</button>&nbsp;<button class="nD-UrlUnsaved">选择未保存</button>&nbsp;<button class="nD-UrlSave">保存</button></div><div class="nD-Log"><div class="nD-LogNow"title="点击清除已完成"><div><progress class="bookDownladerProgress"value="0"max="0"></progress><span class="bookDownladerProgressSpan"><span class="bookDownladerChapter">0</span>/<span class="bookDownladerChapterAll">0</span></span></div></div><button class="nD-ShowLog nD-BtnShow">X</button><div class="nD-LogDiv"></div></div><div class="nD-Finder nD-Hide"></div></div>');
  jQuery('head').append('<style>#nD{text-align:center;}.nD-BoxCenter,.nD-Log{display:none;z-index:999999;background-color:white;border:1px solid black;position:fixed;}.nD-Log{width:300px;height:350px;overflow:auto;right:5px;bottom:10px;}#nD input[type="text"]{width:65%;border:1px solid #000;}#nD input,#nD label,#nD select{display:inline;position:relative;top:0;opacity:1;}#nD textarea{resize:both;width:95%;height:108px;overflow:auto;}#nD button{border:#c0c0c0 1px solid;}#nD span{float:none;background:none;}.nD-Separator{border:1px solid #000;}.nD-SupportDiv{max-height:500px;overflow:auto;}.nD-SearchHtml{max-height:550px;max-width:616px;overflow:auto;text-align:justify;}.nD-SearchHtmlBox{margin-top:0;margin-bottom:23px;}.nD-SearchHtmlBox>div{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.nD-SearchHtmlBox b{color:#D00;}}.nD-SearchHtmlBox a:visited{color:gray;}.nD-SearchHtmlImage{float:left;max-height:80px;}.nD-SearchHtmlTitle{text-align:justify;}.nD-SearchHtmlTitle a{text-decoration:none;font-size:18px;}.nD-SearchHtmlCite{font-size:14px;color:#006621;line-height:16px;}.nD-SearchHtmlSnippet{color:#545454;font-size:small;}.nD-Input{width:24px !important;}.nD-BtnShow{z-index:9999;float:right;color:red;}.nD-Customize{min-width:450px;}.nD-UrlDiv{max-height:500px;overflow-x:hidden;overflow-y:auto;}.nD-UrlDiv table{border-collapse:collapse;}.nD-UrlDiv td{border:solid 1px gray;}.nD-Green{color:green;}.nD-Blue{color:blue;}.nD-Hide{display:none;}.nD-UrlShow{float:left!important;cursor:pointer;}.nD-LogDiv{height:290px;overflow:auto;}.bookDownladerProgressSpan{position:absolute;left:0;right:0;}.nD-StatusOk{color:green;}.nD-StatusError{color:red;}.nD-StatusTimeout{color:yellow;}.novelDownloaderChapter{color:black;float:none;display:inline;width:auto;}</style>');
  jQuery('.nD-Input').each(function() {
    if (GM_getValue(this.name, false) !== false) this.value = GM_getValue(this.name);
  });
  jQuery('.nD-Checkbox').each(function() {
    if (GM_getValue(this.name, false) !== false) this.checked = GM_getValue(this.name);
  });
  (GM_getValue('lang', 0) === 0) ? jQuery('#nD-LangZhs')[0].checked = true: jQuery('#nD-LangZht')[0].checked = true;
  if (GM_getValue('split', false) !== false) {
    jQuery('.nD-Split').val(GM_getValue('split'));
    if (jQuery('.nD-Split').val() === null) {
      jQuery('.nD-Split').prepend('<option value="' + GM_getValue('split') + '">' + GM_getValue('split') + '</option>');
      jQuery('.nD-Split').val(GM_getValue('split'));
    }
  }
  var SupportedUrl = new Array();
  for (var i in indexRule) {
    if (indexRule[i].cn === '' || indexRule[i].cn === undefined) continue;
    SupportedUrl.push((SupportedUrl.length + 1) + '. ' + indexRule[i].cn + ' <a href="http://' + i + '" target="_blank">' + i + '</a>')
  }
  jQuery('.nD-SupportDiv').before('脚本自带的' + SupportedUrl.length + '个站点规则。<br/>').append(SupportedUrl.join('<br/>') + '<div class="nD-Separator"></div>');
  SupportedUrl = new Array();
  if (GM_getValue('customizeRule', false)) {
    var savedValue = GM_listValues();
    var nowCustomizeRule = '';
    var allCustomizeRule = '';
    var arr;
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
        if (/^indexRule_/.test(savedValue[i])) {
          arr = GM_getValue(savedValue[i]).split('\'');
          SupportedUrl.push((SupportedUrl.length + 1) + '. ' + arr[3] + ' <a href="http://' + arr[1] + '" target="_blank">' + arr[1] + '</a>');
        }
      }
    }
    if (indexRule[location.host] && indexRule[location.host].searchEngine) {
      jQuery(indexRule[location.host].cite).each(function() {
        if (getHostName(this.innerText).replace(/^(.*?)\s+.*$/, '$1') in indexRule) {
          jQuery(this).parent().append('<a class="nD-added nD-Blue"> 已加入' + GM_info.script.name + '豪华午餐</a>')
        }
      });
      jQuery(indexRule[location.host].nextpage).click(function() {
        location.href = this.href;
      });
      jQuery(indexRule[location.host].searchBtn).click(function(e) {
        var keyword = encodeURIComponent(jQuery(indexRule[location.host].searchInput).val());
        location.search = '?' + jQuery(indexRule[location.host].searchInput).attr('name') + '=' + keyword;
      })
    }
    nowCustomizeRule = nowCustomizeRule.replace(/\s+$/, '');
    if (allCustomizeRule === '') {
      GM_setValue('customizeRule', false);
      GM_setValue('savedUrl', new Array());
    }
    jQuery('.nD-CustomizeTextarea').val(nowCustomizeRule);
    jQuery('.nD-CustomizeAll').click(function() {
      if (confirm('请确定是否已保存规则')) jQuery('.nD-CustomizeTextarea').val(allCustomizeRule);
    });
  }
  jQuery('.nD-SupportDiv').before('额外增加的' + SupportedUrl.length + '个自定义站点规则。<br/>站点排序：文学>正版>轻小说>盗贴<span style="color:white;background-color:white;"title="好孩子不要看">>18X</span>>自定义<br/><div class="nD-Separator"></div>').append(SupportedUrl.join('<br/>'));
  if (indexRule[location.host] === undefined) { //待续
    addIRule(location.host, '通用规则（测试）', 'h1', 'a');
    addCRule(location.host, 'h1', '#pagecontent,#contentbox,.contentbox,#bmsy_content,#bookpartinfo,#htmlContent,#text_area,#chapter_content,#chapterContent,#partbody,#article_content,#BookTextRead,#booktext,.booktext,#BookText,#readtext,#text_c,#txt_td,#TXT,#txt,#zjneirong,.novel_content,.readmain_inner,.noveltext,.yd_text2,#contentTxt,#oldtext,#a_content,#contents,#content2,#contentts,#content,.content,#nr,#chaptercontent,.tc_con', 0);
    if (document.querySelector('meta[content*="charset=gb"],meta[charset*="gb"]')) chapterRule[location.host].MimeType = 'text/html; charset=gb2312';
    jQuery(window).data('autoTry', true);
  }
  if (indexRule[location.host]) {
    jQuery(indexRule[location.host].chapter).each(function(i) {
      jQuery(this).prepend('<div class="novelDownloaderChapter"title="novelDownloader章节标记">' + (i + 1) + '-</div>');
    });
    jQuery(indexRule[location.host].vip).find('.novelDownloaderChapter').css('color', 'red');
  };
  jQuery('.nD-Info').html(function() {
    var nameThis = (indexRule[location.host] && indexRule[location.host].cn) ? indexRule[location.host].cn : '未命名的站点';
    return '当前网站：<a href="http://' + location.host + '/" target="_blank">' + nameThis + '</a>';
  });
  //////////////////////////////////////////////////以下为CSS设置与事件
  jQuery('.nD-BoxCenter').css({
    'left': function() {
      return ((document.documentElement.clientWidth - jQuery(this).width()) / 2) + 'px';
    },
    'top': function() {
      return ((document.documentElement.clientHeight - jQuery(this).height()) / 2) + 'px';
    }
  });
  jQuery(window).bind({
    scroll: function() {
      jQuery('.nD-BoxCenter').css({
        'left': function() {
          return ((document.documentElement.clientWidth - jQuery(this).width()) / 2) + 'px';
        },
        'top': function() {
          return ((document.documentElement.clientHeight - jQuery(this).height()) / 2) + 'px';
        }
      });
    },
    resize: function() {
      jQuery('.nD-BoxCenter').css({
        'left': function() {
          return ((document.documentElement.clientWidth - jQuery(this).width()) / 2) + 'px';
        },
        'top': function() {
          return ((document.documentElement.clientHeight - jQuery(this).height()) / 2) + 'px';
        }
      });
    },
    keydown: function(e) {
      if (e.shiftKey && e.keyCode === 68) { //Shift+D
        jQuery('.nD-Main').toggle();
      }
    },
    unload: function() {
      jQuery(window).removeData();
    },
    beforeunload: function() {
      jQuery(window).removeData();
    }
  });
  jQuery('.nD-Input').change(function() {
    GM_setValue(this.name, parseInt(this.value) || parseInt(this.placeholder));
  });
  jQuery('.nD-Lang').click(function() {
    GM_setValue(this.name, parseInt(this.value));
  });
  jQuery('.nD-Checkbox').click(function() {
    GM_setValue(this.name, this.checked);
  });
  jQuery('#nD-Vip').click(function() {
    if (this.checked && !confirm('起点测试成功，其它网站暂未测试。\n起点测试成功，其它网站暂未测试。\n起点测试成功，其它网站暂未测试。\n图片章节无能为力。\n是否下载Vip章节，如未登录或未订阅，则只会下载章节预览。\n不会帮你把未订阅的章节订阅。\n如果不放心，请勿勾选。出事作者概不负责。')) this.checked = false;
  });
  jQuery('.nD-Split').change(function() {
    if (this.value === '...') {
      var input = prompt('请输入[类型-数字]\n类型：\n1、all表示总体分割\n2、every表示每几章分割\n\n例：\n1、[all-3]表示整个下载列表分成3个文件\n2、[every-100]表示每100章，生成一个文件\n输入值将会保存并默认');
      jQuery(this).prepend('<option value="' + input + '">' + input + '</option>');
      jQuery(this).val(input);
      GM_setValue('split', input);
    } else {
      GM_setValue('split', this.value);
    }
    jQuery(window).data('split', 0);
    jQuery('.nD-SplitStart').text('开始下载');
  });
  jQuery('.nD-SplitStart').click(function() {
    var split = (jQuery(window).data('split')) ? jQuery(window).data('split') + 1 : 1;
    jQuery(window).data('split', split);
    var arr = jQuery('.nD-Split').val().split('-');
    if (arr[0] === 'all' || arr[0] === 'every') {
      jQuery(this).text('第' + split + '次下载');
      var len = jQuery(indexRule[location.host].chapter).length;
      var step = (arr[0] === 'all') ? Math.floor(len / arr[1]) + 1 : arr[1];
      var start = step * (split - 1) + 1;
      var end = step * split;
      if (end >= len) {
        end = len;
        jQuery(this).text('完成');
        jQuery(window).data('split', 0);
      }
      jQuery('.nD-SplitInput').val(start + '-' + end);
    } else {
      alert('请按照示例重新输入。');
      jQuery(window).data('split', 0);
    }
  });
  jQuery('.nD-This').click(function() {
    var host = location.host;
    if (chapterRule[host]) {
      var name = (chapterRule[host].name) ? jQuery(chapterRule[host].name).text() : jQuery('title').text();
      if (chapterRule[host].content) {
        var content = jQuery(chapterRule[host].content).html();
      } else {
        jQuery('*').remove('div:hidden:not(#nD *)');
        var content = jQuery('html').html().replace(/\s+/g, ' ');
      }
    } else {
      var name = jQuery('title').text();
      jQuery('*').remove('div:hidden:not(#nD *)');
      var content = jQuery('html').html().replace(/\s+/g, ' ');
    }
    if (jQuery('#nD-Format')[0].checked === true) content = wordFormat(content);
    if (jQuery('#nD-Section')[0].checked === true) content = wordSection(content);
    content = '来源地址：' + location.href + '\r\n' + content;
    jQuery(window).data('dataDownload', [{
      'name': jQuery.trim(name),
      'content': content
    }]);
    download2Txt(name);
  });
  jQuery('.nD-All2Txt').click(function() {
    download('txt');
  });
  jQuery('.nD-All2Zip').click(function() {
    download('zip');
  });
  jQuery('.nD-All2Epub').click(function() {
    download('epub');
  });
  jQuery('.nD-ShowMain').click(function() {
    jQuery('.nD-Main').toggle();
  });
  jQuery('.nD-ShowSupport').click(function() {
    jQuery('.nD-Support').toggle();
    jQuery('.nD-Main').toggle();
  });
  jQuery('.nD-ShowSearch').click(function() {
    jQuery('.nD-Search').toggle();
    jQuery('.nD-Main').toggle();
  });
  jQuery('.nD-ShowCustomize').click(function() {
    jQuery('.nD-Customize').toggle();
    jQuery('.nD-Main').toggle();
    jQuery('.nD-CustomizeTextarea').focus();
  });
  jQuery('.nD-ShowUrl').click(function() {
    jQuery('.nD-Url').toggle();
    jQuery('.nD-Main').toggle();
  });
  jQuery('.nD-ShowLog').click(function() {
    jQuery('.nD-Log').toggle();
  });
  jQuery('.nD-SearchInput').keydown(function(e) {
    if (e.keyCode !== 13) {
      jQuery(window).data('search', new Object());
      jQuery(window).data('search').length = 0;
    } else if (e.keyCode === 13) {
      jQuery('.nD-SearchBtnGo').click();
    }
  });
  jQuery('.nD-SearchBtnGo').click(function() {
    search(0);
  });
  jQuery('.nD-SearchBtnPrev').click(function() {
    search('prev');
  });
  jQuery('.nD-SearchBtnNext').click(function() {
    search('next');
  });
  jQuery('.nD-CustomizeSave').click(function() {
    if (jQuery('.nD-CustomizeTextarea').val() === '') {
      return;
    } else {
      GM_setValue('customizeRule', true);
    }
    var arr = jQuery('.nD-CustomizeTextarea').val().split('\n');
    var savedUrl = GM_getValue('savedUrl', new Array());
    var host;
    for (var i = 0; i < arr.length; i++) {
      host = arr[i].split('\'')[1];
      if (jQuery.inArray(host, savedUrl) === -1) savedUrl.push(host);
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
    if (debug) location.reload();
  });
  jQuery('.nD-CustomizeDelete').click(function() {
    var host = prompt('请输入要删除的域名\n不分大小写...\n如：\nread.qidian.com', location.host);
    if (host === '') return;
    var savedUrl = GM_getValue('savedUrl', new Array());
    if (jQuery.inArray(host, savedUrl) <= 0) return;
    savedUrl.splice(jQuery.inArray(host, savedUrl), 1);
    var RE = new RegExp('_' + host + '$', 'i');
    var savedValue = GM_listValues();
    for (var i = 0; i < savedValue.length; i++) {
      if (RE.test(savedValue[i])) GM_deleteValue(savedValue[i]);
    }
    if (debug) location.reload();
  });
  jQuery('.nD-CustomizeClear').click(function() {
    if (confirm('谨慎操作\n你确定要清空自定义站点规则\n你确定要清空自定义站点规则\n你确定要清空自定义站点规则')) {
      GM_setValue('customizeRule', false);
      GM_setValue('savedUrl', new Array());
      var savedValue = GM_listValues();
      var RE = new RegExp('^indexRule_|^chapterRule_|^reRule_', 'i');
      for (var i = 0; i < savedValue.length; i++) {
        if (RE.test(savedValue[i])) GM_deleteValue(savedValue[i]);
      }
      if (debug) location.reload();
    }
  });
  jQuery('.nD-UrlAll').click(function() {
    if (jQuery(window).data('check') === undefined) {
      jQuery(window).data('check', 0);
      jQuery('.nD-UrlDiv>div>div>:checkbox').each(function() {
        this.checked = true;
      });
    } else {
      jQuery(window).data('check', jQuery(window).data('check') + 1);
      jQuery('.nD-UrlDiv>div>div>:checkbox').each(function() {
        this.checked = (jQuery(window).data('check') % 2 === 1) ? false : true;
      });
    }
  });
  jQuery('.nD-UrlInverse').click(function() {
    jQuery('.nD-UrlDiv>div>div>:checkbox').each(function() {
      this.checked = (this.checked) ? false : true;
    });
  });
  jQuery('.nD-UrlUnsaved').click(function() {
    jQuery('.nD-UrlDiv>div>div>:checkbox').each(function() {
      this.checked = (this.className === 'nD-UrlSaved') ? false : true;
    });
  });
  jQuery('.nD-UrlSave').click(function() {
    if (confirm('谨慎操作\n此操作将会将勾选的站点规则保存到本地数据库\n这可能将会覆盖本地的某些站点规则\n可能会造成卡顿，请耐心等待\n可能会造成卡顿，请耐心等待\n可能会造成卡顿，请耐心等待\n卡顿...等待')) {
      GM_setValue('customizeRule', true);
      var savedUrl = GM_getValue('savedUrl', new Array());
      var include = '';
      jQuery('.nD-UrlDiv>div>div>:checked').parent().each(function() {
        var host = jQuery(this).attr('name');
        if (host === 'updateInfo' || host === '') return;
        if (jQuery.inArray(host, savedUrl) === -1) savedUrl.push(host);
        var temp = jQuery(window).data('urlRule')[host];
        for (var i in temp) {
          if (/Rule$|^change$/.test(i)) {
            GM_setValue(i + '_' + host, temp[i]);
          } else if (/^include|^match/.test(i)) {
            include += '\n// @include     ' + temp[i];
          } else if (/^exclude/.test(i)) {
            include += '\n// @exclude     ' + temp[i];
          }
        }
      });
      GM_setValue('savedUrl', savedUrl);
      GM_setClipboard('\n//开始-自定义站点规则' + include + '\n//结束-自定义站点规则');
      alert('站点规则已保存，网站已复制到剪贴板，请粘帖到脚本前部。');
    }
  });
  jQuery('.nD-LogNow').click(function() {
    jQuery('.nD-LogDiv>span').remove('.nD-StatusOk');
  });
};
//////////////////////////////////////////////////////以下为函数
function search(page) {
  var keyword = jQuery('.nD-SearchInput').val();
  if (keyword === '') return;
  if (page === 'prev' && jQuery(window).data('search').searchIndex === 0) {
    alert('这是第一页');
    return
  } else if (page === 'prev') {
    jQuery(window).data('search').searchIndex--;
  } else if (page === 'next') {
    page = jQuery(window).data('search').searchIndex++;
  } else if (page === 0) {
    jQuery(window).data('search').searchIndex = 0;
  }
  var page = jQuery(window).data('search').searchIndex;
  if (page in jQuery(window).data('search')) {
    showSearchResult(page);
    return
  }
  jQuery(window).data('search').keyword = keyword;
  var apiKey = 'AIzaSyCWOFOM-rXF4tL7Uhg-RbzNP65S2a6GwF4AIzaSyDukgtdUTmmk5OppUGvEIp2mqsRyzdWgTIAIzaSyDpcKQorOu0oUX5asC_6-M1ZUsqj44QJPgAIzaSyAdGWEblloAiYegOVRWkWbVpJNzjAa1VCMAIzaSyDkSpb0-_F9l6Srg9Z82c1sz15Rbm7-v4YAIzaSyCae4Sf4sKeJfAf_OXoNJVca-SFlwi7P8UAIzaSyAeKr5R7dZe_5zQO3SS7rNWQxUHyP2uR9oAIzaSyAf3rXFbeP8G1bTaFNMwWUhL7gRESRPCMQAIzaSyAxaqEHJO-zCN4zxv_zRdyBV0yJQ-jSCMAAIzaSyCgYz1MAAp9I9xtyq6t4MPG26DhvR6f_3A';
  apiKey = apiKey.substr(parseInt(Math.random() * 10) * 39, 39);
  var cx = '010023307804081171493:0yligcah8w0';
  var url = 'https://www.googleapis.com/customsearch/v1?key=' + apiKey + '&cx=' + cx + '&num=10&alt=json&q=' + keyword + '&start=' + (page * 10 + 1);
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    onload: function(response) {
      var data = JSON.parse(response.response);
      data.url = url;
      jQuery(window).data('search')[page] = data;
      jQuery(window).data('search').length++;
      showSearchResult(page);
    }
  });
}

function showSearchResult(page) {
  var cx = '010023307804081171493:0yligcah8w0';
  var data = jQuery(window).data('search');
  jQuery('.nD-SearchTitle').html('关键词：<font class="nD-Blue">' + data.keyword + '</font>，第<font class="nD-Blue">' + (page + 1) + '</font>页，外部链接：<a href="https://cse.google.com/cse?ie=utf8&q=' + data.keyword + '&start=0&cx=' + cx + '#gsc.tab=0&gsc.q=' + data.keyword + '&gsc.page=' + (page + 1) + '" target="_blank">Google自定义搜索</a>');
  var _html = '';
  var items = data[page].items;
  for (var i = 0; i < items.length; i++) {
    var host = getHostName(items[i].formattedUrl);
    if (indexRule[host] !== undefined) host = indexRule[host].cn + ' ';
    if (items[i].pagemap) {
      _html += '<div class="nD-SearchHtmlBox"><a href="' + items[i].link + '" target="_blank"><img class="nD-SearchHtmlImage" src="';
      if (items[i].pagemap.cse_image) {
        _html += items[i].pagemap.cse_image[0].src;
      } else if (items[i].pagemap.cse_thumbnail) {
        _html += items[i].pagemap.cse_thumbnail[0].src;
      }
      _html += '"></img></a>';
    }
    _html += '<div class="nD-SearchHtmlTitle"><a href="' + items[i].link + '" target="_blank">' + (i + 1) + '. ' + items[i].htmlTitle + '</a></div><div class="nD-SearchHtmlCite">' + host + items[i].htmlFormattedUrl + ' <a href="https://webcache.googleusercontent.com/search?q=cache:' + items[i].cacheId + ':' + items[i].formattedUrl + '" target="_blank">▼</a></div><div class="nD-SearchHtmlSnippet">' + items[i].htmlSnippet + '</div></div>';
  }
  jQuery('.nD-SearchHtml').html(_html);
}

function addIRule(host, cn, name, chapter, vip, sort, thread) { //增加站点目录规则
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

function addIRuleForSearch(host, cite, nextpage, searchBtn, searchInput) { //增加站点目录规则-搜索引擎版
  indexRule[host] = {
    searchEngine: true,
    cite: cite,
    nextpage: nextpage,
    searchBtn: searchBtn,
    searchInput: searchInput
  }
}

function addCRule(host, name, content, lang, MimeType) { //增加站点章节规则
  lang = (lang === 1) ? 1 : 0;
  MimeType = (MimeType === 1) ? 'text/html; charset=gb2312' : '';
  chapterRule[host] = {
    name: name,
    content: content,
    lang: lang,
    MimeType: MimeType
  }
}

function addRRule(host, re) { //增加站点替换规则
  var temp = new Array();
  for (var i = 1; i < arguments.length; i++) {
    temp.push(arguments[i]);
  }
  reRule[host] = temp;
}

function wordFormatSpecial(host, word) { //文本处理-特殊版
  var regexp;
  var str;
  var reStr;
  for (var i = 0; i < reRule[host].length; i++) {
    str = reRule[host][i].split('|||');
    reStr = (str.length === 1) ? '' : str[1];
    regexp = new RegExp(str[0], 'gi');
    word = word.replace(regexp, reStr);
  }
  return word;
}

function downloadTo(bookName, fileType) { //下载到...
  var name = jQuery.trim(bookName.replace(/在线|阅读|全文|最新|章节|目录|列表|无弹窗|更新/g, '')); //待续
  if (fileType === 'zip') {
    download2Zip(name);
  } else if (fileType === 'txt') {
    download2Txt(name);
  } else if (fileType === 'epub') {
    download2Epub(name);
  }
}

function download(fileType) { //下载
  var host = location.host;
  var chapter = jQuery(indexRule[host].chapter);
  var bookName = (jQuery(indexRule[host].name).length > 0) ? jQuery.trim(jQuery(indexRule[host].name)[0].innerText) : document.title;
  if (jQuery('#nD-Vip')[0].checked === false && indexRule[host].vip !== '') chapter = jQuery(chapter).not(jQuery(indexRule[host].vip));
  if (jQuery('.nD-SplitInput').val() !== '') {
    jQuery(chapter).each(function() {
      this.added = false;
    });
    var arr = jQuery('.nD-SplitInput').val().split(',');
    arr.sort();
    var chapterNew = new Array();
    for (var i = 0; i < arr.length; i++) {
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
  chapter = jQuery.makeArray(chapter);
  if (jQuery(window).data('chapter') !== undefined && chapter.toString() === jQuery(window).data('chapter').toString()) {
    downloadTo(bookName, fileType);
    return;
  }
  jQuery('.nD-Log').css('display', 'block');
  jQuery('.nD-LogDiv').html('');
  jQuery(window).data({
    'fileType': fileType,
    'chapter': chapter,
    'dataDownload': new Array(),
    'downloadList': new Array(),
    'downloadNow': new Object(),
    'number': 0,
    'numberOk': 0
  });
  jQuery(window).data('downloadNow').length = 0;
  var href;
  var name;
  var dataDownload;
  for (var i = 0; i < chapter.length; i++) {
    if (chapter[i].tagName === 'OPTION') {
      href = location.origin + chapter[i].value;
    } else {
      href = chapter[i].href || chapter[i];
    }
    name = (chapter[i].innerText) ? chapter[i].innerText.replace(/^\d+\-/, '') : '';
    dataDownload = new Object();
    dataDownload.url = href;
    dataDownload.name = name;
    dataDownload.error = 0;
    dataDownload.timeout = 0;
    dataDownload.ok = false;
    jQuery(window).data('dataDownload')[i] = dataDownload;
    jQuery(window).data('downloadList')[i] = href;
  };
  jQuery('.bookDownladerProgress').val(0).attr('max', chapter.length);
  jQuery('.bookDownladerChapter').html('0');
  jQuery('.bookDownladerChapterAll').html(chapter.length);
  var addTask = setInterval(function() {
    if (chapterRule[host].Deal instanceof Function) {
      downloadTask(chapterRule[host].Deal);
    } else {
      downloadTask(xhr);
    }
  }, 200);
  var downloadCheck = setInterval(function() {
    if (downloadedCheck(jQuery(window).data('dataDownload')) && (jQuery(window).data('fileType') !== 'epub' || !GM_getValue('image', false) || jQuery(window).data('img').ok)) {
      clearInterval(addTask);
      clearInterval(downloadCheck);
      if (jQuery('#nD-Btn').length === 0) jQuery('.nD-Log').append('<button id="nD-Btn">下载</button>');
      downloadTo(bookName, fileType);
    }
  }, 200);
}

function downloadTask(fun) { //下载列队
  var thread = (indexRule[location.host].thread) ? indexRule[location.host].thread : parseInt($('.nD-Thread').val()) || 10;
  for (var i in jQuery(window).data('downloadNow')) {
    if (!/^\d+$/.test(i)) continue;
    if (jQuery(window).data('downloadNow')[i].ok) {
      delete jQuery(window).data('downloadNow')[i];
      jQuery(window).data('downloadNow').length--;
      continue;
    }
    if (!jQuery(window).data('downloadNow')[i].downloading) {
      var href = jQuery(window).data('downloadNow')[i].href;
      jQuery(window).data('downloadNow')[i].downloading = true;
      addDownloadLogStart(parseInt(i) + 1, href, '开始');
      //if (jQuery('.nD-LogDiv>.nD-StatusOk').length >= 30) jQuery('.nD-LogNow').click();
      fun(i, href);
    }
  }
  if (jQuery(window).data('downloadNow').length < thread && jQuery(window).data('downloadList').length !== 0) {
    var temp = new Object();
    temp.href = jQuery(window).data('downloadList')[0];
    temp.ok = false;
    temp.downloading = false;
    jQuery(window).data('downloadNow')[jQuery(window).data('number')] = temp;
    jQuery(window).data('downloadList').splice(0, 1);
    jQuery(window).data('downloadNow').length++;
    jQuery(window).data('number', jQuery(window).data('number') + 1);
    downloadTask(fun);
  } else {
    return;
  }
}

function removeData() { //移除数据
  jQuery(window).removeData(['downloadNow',
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
    timeout: parseFloat(jQuery('.nD-Time').val()) * 1000,
    onload: function(response) {
      var timeout = setTimeout(function() {
        jQuery(window).data('downloadTimeout')[num]++;
        if (parseInt(jQuery('.nD-Timeout').val()) > jQuery(window).data('downloadTimeout')[num]) {
          xhr(num, url);
        } else {
          var nameTrue = jQuery(window).data('dataDownload')[num].name || num;
          thisDownloaded(num, nameTrue, '下载超时，原因：可能是代码出错。by novelDownloader', chapterRule[host].lang);
          jQuery(window).data('dataDownload')[num].ok = 'timeout';
        }
      }, parseFloat(jQuery('.nD-Time').val()) * 1000);
      if (debug) console.log(response.response);
      if (jQuery(window).data('dataDownload')[num].name !== '') {
        var name = jQuery(window).data('dataDownload')[num].name;
      } else {
        var name = jQuery(chapterRule[host].name, response.response);
        if (name.length = 0) {
          name = jQuery.trim(name.text().replace(/\s+/g, ' '));
        } else {
          name = jQuery(window).data('dataDownload')[num].url;
          var _html = response.response.replace(/\s+/g, ' ').replace(/\<!DOCTYPE.*?\>|\<html.*?\>|\<\/html\>|\<body\>|\<\/body\>|\<a.*?\>.*?\<\/a\>|\<script.*?\>.*?\<\/script\>|\<img.*?\>.*?\<\/img\>/gi, '');
          jQuery('.nD-Finder').append('<div class="findTitle' + num + '"></div>');
          jQuery('.findTitle' + num).html(_html);
          name = jQuery('.findTitle' + num + ' ' + chapterRule[host].name);
          name = (name.length > 0) ? name.text() : jQuery('.findTitle' + num + ' title').html();
          jQuery('.nD-Finder>div').remove('.findTitle' + num);
        }
      }
      var content = jQuery(chapterRule[host].content, response.response);
      if (content.length > 0) {
        var raw = content;
        content = content.html();
        if (jQuery('#nD-Image')[0].checked && jQuery(window).data('fileType') === 'epub' && raw.find('img').length > 0) {
          if (!jQuery(window).data('img')) {
            jQuery(window).data('img', {
              ing: 0,
              ok: false
            });
            var downloadImg = setInterval(function() {
              var img = jQuery(window).data('img');
              for (var i in img) {
                if (img.ing >= 10) return;
                if (i === 'ing' || i === 'ok' || img[i].data) continue;
                downloadImage(img[i].url, img[i].num, img[i].i);
                img.ing++;
                jQuery(window).data('img', img);
              }
              if (downloadedCheck(jQuery(window).data('dataDownload')) && img.ing === 0) {
                clearInterval(downloadImg);
                img.ok = true;
                jQuery(window).data('img', img);
              }
            }, 800);
          }
          raw.find('img').each(function(i) {
            threadImg(this.src, num, i);
          });
        }
      } else {
        var _html = response.response.replace(/\s+/g, ' ').replace(/\<!DOCTYPE.*?\>|\<html.*?\>|\<\/html\>|\<head\>.*?\<\/head\>|\<body\>|\<\/body\>|\<a.*?\>.*?\<\/a\>|\<script.*?\>.*?\<\/script\>|\<img.*?\>.*?\<\/img\>/gi, '');
        jQuery('.nD-Finder').append('<div class="findContent' + num + '"></div>');
        jQuery('.findContent' + num).html(_html);
        content = jQuery('.findContent' + num + ' ' + chapterRule[host].content);
        content = (content.length > 0) ? content.html() : _html;
        jQuery('.nD-Finder>div').remove('.findContent' + num);
      }
      clearTimeout(timeout);
      if (reRule[host] instanceof Array) content = wordFormatSpecial(host, content);
      thisDownloaded(num, name, content, chapterRule[host].lang);
    },
    ontimeout: function() {
      jQuery(window).data('dataDownload')[num].timeout++;
      if (parseInt(jQuery('.nD-Timeout').val()) > jQuery(window).data('dataDownload')[num].timeout) {
        xhr(num, url);
      } else {
        var nameTrue = jQuery(window).data('dataDownload')[num].name || num;
        thisDownloaded(num, nameTrue, '下载超时，原因：可能是网络问题。by novelDownloader', chapterRule[host].lang);
        jQuery(window).data('dataDownload')[num].ok = 'timeout';
      }
    },
    onerror: function() {
      jQuery(window).data('dataDownload')[num].error++;
      if (parseInt(jQuery('.nD-Error').val()) > jQuery(window).data('dataDownload')[num].error) {
        xhr(num, url);
      } else {
        var nameTrue = jQuery(window).data('dataDownload')[num].name || num;
        thisDownloaded(num, nameTrue, '下载失败，原因：可能是服务器问题。by novelDownloader', chapterRule[host].lang);
        jQuery(window).data('dataDownload')[num].ok = 'error';
      }
    }
  });
}

function thisDownloaded(num, name, content, lang) { //下载完成，包括文本处理-通用版、简繁体转换
  if (!name) name = jQuery(window).data('dataDownload')[num].name;
  if (jQuery('#nD-Format')[0].checked === true) content = wordFormat(content, jQuery(window).data('fileType') === 'epub');
  if (jQuery('#nD-Section')[0].checked === true && jQuery(window).data('fileType') !== 'epub') content = wordSection(content);
  content = '来源地址：' + jQuery(window).data('dataDownload')[num].url + '\r\n' + content;
  if (parseInt(jQuery('.nD-Lang:checked').val()) !== lang) {
    if (lang === 0) {
      name = tranStr(name, true);
      content = tranStr(content, true);
    } else {
      name = tranStr(name, false);
      content = tranStr(content, false);
    }
  }
  jQuery(window).data('dataDownload')[num].name = name;
  jQuery(window).data('dataDownload')[num].content = content;
  jQuery(window).data('dataDownload')[num].ok = true;
  jQuery(window).data('downloadNow')[num].ok = true;
  jQuery(window).data('numberOk', jQuery(window).data('numberOk') + 1);
  jQuery('.bookDownladerChapter').html(jQuery(window).data('numberOk'));
  jQuery('.bookDownladerProgress').val(jQuery(window).data('numberOk'));
}

function threadImg(url, num, i) {
  var img = jQuery(window).data('img');
  img[num + '_' + i] = {
    url: url,
    num: num,
    i: i
  };
  jQuery(window).data('img', img);
}

function downloadImage(url, num, i) {
  var name = num + '_' + i;
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    responseType: 'arraybuffer',
    timeout: 10000,
    onload: function(response) {
      var type = response.responseHeaders.match(/Content-Type: (.*?)[\r\n]/)[1];
      var img = jQuery(window).data('img');
      img[name].data = new Blob([response.response], {
        type: type
      });
      img.ing--;
      jQuery(window).data('dataDownload')[num].content = jQuery(window).data('dataDownload')[num].content.replace(img[name].url, name + '.jpg');
      jQuery(window).data('img', img);
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
        var img = jQuery(window).data('img');
        img[name].data = true;
        img.ing--;
        jQuery(window).data('img', img);
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
    '欢迎广大书友光临阅读，最新、最快、最火的连载作品尽在！',
    '手机用户请到阅读。',
    '无弹窗广告',
    '手机阅读本章.*',
    '本书最新TXT下载.*',
    '为了方便下次阅读.*',
    '<head>.*?</head>',
    '<select.*?>.*?</select>',
    '<div id="nD">.*</div>',
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
  var regexp;
  var str;
  var reStr;
  if (isEpub) word = word.replace(/<\/img>/g, '').replace(/<img(.*?)>/g, '【图片$1】');
  for (var i = 0; i < replaceLib.length; i++) {
    str = replaceLib[i].split('|||');
    reStr = (str.length === 1) ? '' : str[1];
    regexp = new RegExp(str[0], 'gi');
    //console.log(regexp,reStr,word);
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
  var lastIndex;
  var lastWord;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].length <= 30) continue;
    var arrNew = arr[i].split('');
    for (var j = 1; j < arrNew.length; j++) {
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
    for (var j = 0; j < arrNew.length; j++) {
      arr.splice(i, 0, arrNew[j]);
      i++;
    }
  }
  return arr.join('\r\n').replace(/\r\n\s+/g, '\r\n').replace(/[\r\n]+/g, '\r\n　　');
};

function addDownloadLogStart(num, url, status) { //下载进度-开始
  jQuery('.nD-LogDiv').append('<span id="nD-LogDiv_' + num + '">' + num + ' <a href="' + url + '" target="_blank">' + num + '</a> ' + status + '<br/></span>');
}

function addDownloadLogEnd(num, name, url, status, addclass) { //下载进度-结束
  jQuery('#nD-LogDiv_' + num).html(num + ' <a href="' + url + '" target="_blank">' + name + '</a> ' + status + '<br/>').addClass('nD-Status' + addclass);
  //jQuery('.nD-LogDiv') [0].scrollBy(0, 10);
}

function download2Zip(name) { //下载到1个zip
  jQuery(window).data('blob', new JSZip());
  var leng = String(jQuery(window).data('dataDownload').length).length;
  for (var i = 0; i < jQuery(window).data('dataDownload').length; i++) {
    var num = i + 1;
    jQuery(window).data('blob').file(String(preZeroFill(num, leng)) + '-' + jQuery(window).data('dataDownload')[i].name + '.txt', jQuery(window).data('dataDownload')[i].name + '\r\n' + jQuery(window).data('dataDownload')[i].content);
  }
  jQuery(window).data('blob').file('###说明文件.txt', '本压缩包由用户脚本novelDownloader制作')
  jQuery(window).data('blob').generateAsync({
    type: 'blob'
  }).then(function(content) {
    jQuery('#nD-Btn').click(function() {
      saveAs(content, name + '.zip');
    })
    saveAs(content, name + '.zip');
  });
  removeData();
}

function download2Epub(name) { //下载到1个epub
  var leng = String(jQuery(window).data('dataDownload').length).length;
  var uuid = 'nd' + new Date().getTime().toString();
  jQuery(window).data('blob', new JSZip());
  jQuery(window).data('blob').file('mimetype', 'application/epub+zip');
  var META_INF = jQuery(window).data('blob').folder('META-INF');
  META_INF.file('container.xml', '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles></container>');
  var OEBPS = jQuery(window).data('blob').folder('OEBPS');
  OEBPS.file('stylesheet.css', 'body{padding:0%;margin-top:0%;margin-bottom:0%;margin-left:1%;margin-right:1%;line-height:130%;text-align:justify}div{margin:0px;padding:0px;line-height:130%;text-align:justify}p{text-align:justify;text-indent:2em;line-height:130%}h1{line-height:130%;text-align:center;font-weight:bold;font-size:xx-large}h2{line-height:130%;text-align:center;font-weight:bold;font-size:x-large}h3{line-height:130%;text-align:center;font-weight:bold;font-size:large}');
  var lang = (parseInt(jQuery('.nD-Lang:checked').val()) === 0) ? 'zh-CN' : 'zh-TW';
  var content_opf = '<?xml version="1.0" encoding="UTF-8"?><package version="2.0" unique-identifier="' + uuid + '" xmlns="http://www.idpf.org/2007/opf"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf"><dc:title>' + name + '</dc:title><dc:creator>novelDownloader</dc:creator><dc:identifier id="' + uuid + '">urn:uuid:' + uuid + '</dc:identifier><dc:language>' + lang + '</dc:language></metadata><manifest>';
  var toc_ncx = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="urn:uuid:' + uuid + '"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>' + name + '</text></docTitle><navMap><navPoint id="navpoint-1" playOrder="1"><navLabel><text>首页</text></navLabel><content src="title.html"/></navPoint>';
  var item = '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="cover" href="title.html" media-type="application/xhtml+xml"/><item id="css" href="stylesheet.css" media-type="text/css"/>';
  var itemref = '<itemref idref="cover" linear="no"/>';
  for (var i = 0; i < jQuery(window).data('dataDownload').length; i++) {
    var _name = String(preZeroFill(i, leng));
    var playOrder = i + 2;
    toc_ncx += '<navPoint id="chapter' + _name + '" playOrder="' + playOrder + '"><navLabel><text>' + jQuery(window).data('dataDownload')[i].name + '</text></navLabel><content src="' + _name + '.html"/></navPoint>';
    item += '<item id="chapter' + _name + '" href="' + _name + '.html" media-type="application/xhtml+xml"/>';
    itemref += '<itemref idref="chapter' + _name + '"/>';
    OEBPS.file(_name + '.html', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>' + jQuery(window).data('dataDownload')[i].name + '</title><link type="text/css" rel="stylesheet" media="all" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h3>' + jQuery(window).data('dataDownload')[i].name + '</h3><div><p>' + jQuery(window).data('dataDownload')[i].content.replace(/\r\n/g, '</p><p>') + '</p></div></body></html>');
  }
  var img = jQuery(window).data('img');
  for (var i in img) {
    if (i === 'ing' || i === 'ok') continue;
    item += '<item id="img' + i + '" href="' + i + '.jpg" media-type="image/jpeg"/>';
    OEBPS.file(i + '.jpg', img[i].data);
  }
  content_opf = content_opf + item + '</manifest><spine toc="ncx">' + itemref + '</spine><guide><reference href="title.html" type="cover" title="Cover"/></guide></package>';
  toc_ncx += '</navMap></ncx>';
  OEBPS.file('content.opf', content_opf);
  OEBPS.file('toc.ncx', toc_ncx);
  OEBPS.file('title.html', '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>' + name + '</title><link type="text/css" rel="stylesheet" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h1>' + name + '</h1><h2>本电子书由用户脚本novelDownloader制作</h2></body></html>');
  jQuery(window).data('blob').generateAsync({
    type: 'blob'
  }).then(function(content) {
    jQuery('#nD-Btn').click(function() {
      saveAs(content, name + '.epub');
    })
    saveAs(content, name + '.epub');
  });
  removeData();
}

function download2Txt(name) { //下载到1个txt
  var all = '';
  for (var i = 0; i < jQuery(window).data('dataDownload').length; i++) {
    all += jQuery(window).data('dataDownload')[i].name + '\r\n' + jQuery(window).data('dataDownload')[i].content + '\r\n\r\n';
  }
  all = '阅读前说明：本书籍由用户脚本novelDownloader制作\r\n\r\n' + all;
  jQuery(window).data('blob', new Blob([all], {
    type: 'text/plain;charset=utf-8'
  }));
  jQuery('#nD-Btn').click(function() {
    saveAs(jQuery(window).data('blob'), name + '.txt');
  })
  saveAs(jQuery(window).data('blob'), name + '.txt');
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

function base64_raw() { //base64,来自http://blog.csdn.net/gumanren/article/details/5870133
  var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
  this.encode = function(str) {
    var out,
      i,
      len;
    var c1,
      c2,
      c3;
    len = str.length;
    i = 0;
    out = '';
    while (i < len) {
      c1 = str.charCodeAt(i++) & 255;
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 3) << 4);
        out += '==';
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 3) << 4) | ((c2 & 240) >> 4));
        out += base64EncodeChars.charAt((c2 & 15) << 2);
        out += '=';
        break;
      }
      c3 = str.charCodeAt(i++);
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 3) << 4) | ((c2 & 240) >> 4));
      out += base64EncodeChars.charAt(((c2 & 15) << 2) | ((c3 & 192) >> 6));
      out += base64EncodeChars.charAt(c3 & 63);
    }
    return out;
  }
  this.decode = function(str) {
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
      do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 255];
      }
      while (i < len && c1 == -1);
      if (c1 == -1)
        break;
      do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 255];
      }
      while (i < len && c2 == -1);
      if (c2 == -1)
        break;
      out += String.fromCharCode((c1 << 2) | ((c2 & 48) >> 4));
      do {
        c3 = str.charCodeAt(i++) & 255;
        if (c3 == 61)
          return out;
        c3 = base64DecodeChars[c3];
      }
      while (i < len && c3 == -1);
      if (c3 == -1)
        break;
      out += String.fromCharCode(((c2 & 15) << 4) | ((c3 & 60) >> 2));
      do {
        c4 = str.charCodeAt(i++) & 255;
        if (c4 == 61)
          return out;
        c4 = base64DecodeChars[c4];
      }
      while (i < len && c4 == -1);
      if (c4 == -1)
        break;
      out += String.fromCharCode(((c3 & 3) << 6) | c4);
    }
    return out;
  }
  this.utf8to16 = function(str) {
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
      switch (c >> 4) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          out += str.charAt(i - 1);
          break;
        case 12:
        case 13:
          char2 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 31) << 6) | (char2 & 63));
          break;
        case 14:
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 15) << 12) | ((char2 & 63) << 6) | ((char3 & 63) << 0));
          break;
      }
    }
    return out;
  }
}
var base64 = new base64_raw();

function objArrSort(propertyName) { //稍作修改，对象数组排序函数，从小到大排序，来自http://www.jb51.net/article/24536.htm
  return function(object1, object2) {
    var value1 = parseInt(object1[propertyName].replace(/.*\//, ''));
    var value2 = parseInt(object2[propertyName].replace(/.*\//, ''));
    if (value2 < value1) {
      return 1;
    } else if (value2 > value1) {
      return -1;
    } else {
      return 0;
    }
  }
}

function html2Escape(sHtml) { //来自http://blog.csdn.net/win32fanex/article/details/11948659
  return sHtml.replace(/[<>&"]/g, function(c) {
    return {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;'
    }
    [
      c
    ];
  });
}
