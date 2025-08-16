/* eslint-env browser */
// ==UserScript==
// @name        novelDownloader3
// @description 菜单```Download Novel```或**双击页面最左侧**来显示面板
// @version     3.5.514
// @created     2020-03-16 16:59:04
// @modified    2025-07-13 09:24:07
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://github.com/dodying/UserJs/raw/master/Logo.png
// @downloadURL https://github.com/dodying/UserJs/raw/master/novel/novelDownloader/novelDownloader3.user.js#bypass=true
// @updateURL   https://github.com/dodying/UserJs/raw/master/novel/novelDownloader/novelDownloader3.user.js#bypass=true
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js

// @require     https://greasyfork.org/scripts/398502-download/code/download.js?version=977735
// require     https://github.com/dodying/UserJs/raw/master/lib/download.js
// require     http://127.0.0.1:8082/download.js

// @require     https://greasyfork.org/scripts/21541-chs2cht/code/chs2cht.js?version=605976
// require     https://greasyfork.org/scripts/32483-base64/code/base64.js?version=213081
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require     https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js
// @require     https://cdn.jsdelivr.net/npm/async@3.2.5/dist/async.min.js

// resource fontLib https://github.com/dodying/UserJs/raw/master/novel/novelDownloader/SourceHanSansCN-Regular-Often.json?v=2
// @resource fontLib https://github.com/dodying/UserJs/raw/master/novel/novelDownloader/SourceHanSansCN-Regular-Often.json?v=2
// resource fontLib file:///E:/Desktop/_/GitHub/UserJs/novel/novelDownloader/起点自定义字体/often.json?v=2

// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addValueChangeListener
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceText
// @run-at      document-end
// @connect     *
// @include     *
// @noframes
// ==/UserScript==
/* global unsafeWindow GM_info GM_setValue GM_getValue GM_deleteValue GM_addValueChangeListener GM_registerMenuCommand GM_getResourceText */
/* eslint-disable no-debugger  */
/* global $ xhr tranStr JSZip saveAs CryptoJS opentype async */
; (function () { // eslint-disable-line no-extra-semi
  let fontLib;

  /*
    * interface Chapter {
    *   title?:      string;
    *   url?:        string;
    *   volume?:     string;
    *   document?:   string;
    *   contentRaw?: string;
    *   content?:    string;
    * }
  */

  let Storage = null;
  Storage = {
    debug: {
      book: false,
      content: false,
    },
    mode: null, // 1=index 2=chapter
    rule: null, // 当前规则
    book: {
      image: [],
    },
    xhr,
  };
  const Rule = {
    // 如无说明，所有可以为*选择器*都可以是async (doc)=>string
    //                              章节内async (doc,res,request)
    // 快速查找脚本的相应位置：rule.key

    // ?siteName
    siteName: '通用规则',

    // 以下三个必须有一个
    // ?url: string[]/regexp[]
    // ?chapterUrl: string[]/regexp[]
    // ?filter: function=> 0=notmatched 1=index 2=chapter
    url: [/(index|0|list|default)\.(s?html?|php)$/i],
    chapterUrl: [/\d+\/\d+\.(s?html?|php)$/i],

    // ?infoPage: 选择器 或 async (doc)=>url
    //  如果存在infoPage，则基本信息（title,writer,intro,cover）从infoPage页面获取
    //  当infoPage与当前页相同时，直接从当前页获取（极少数情况）

    // title 书籍名称:选择器
    title: ['.h1title > .shuming > a[title]', '.chapter_nav > div:first > a:last', '#header > .readNav > span > a:last', 'div[align="center"] > .border_b > a:last', '.ydselect > .weizhi > a:last', '.bdsub > .bdsite > a:last', '#sitebar > a:last', '.con_top > a:last', '.breadCrumb > a:last'].join(','),
    // titleRegExp 从<title>获取标题，返回$1
    titleRegExp: /^(.*?)(_|-|\(| |最新|小说|无弹窗|目录|全文|全本|txt|5200章节)/i,
    // ?titleReplace:[[find,replace]]

    // ?writer:选择器
    writer: '#info>p:eq(0):maxsize(20),:contains(作):contains(者):maxsize(20):last',

    // ?intro:选择器
    intro: '#intro>p:eq(0)',

    // ?cover:选择器

    // chapter:选择器(应包含vip章节) 或 async (doc)=>url[]或{url,title}[]
    chapter: [
      '.dir a', '#BookText a', '#Chapters a', '#TabCss a',
      '#Table1 a', '#at a', '#book a', '#booktext a',
      '#catalog_list a', '#chapterList a', '#chapterlist a', '#container1 a',
      '#content_1 a', '#contenttable a', '#dir a', '#htmlList a',
      '#list a', '#oneboolt a', '#read.chapter a', '#readerlist a',
      '#readerlists a', '#readlist a', '#tbchapterlist a', '#xslist a',
      '#zcontent a', '.Chapter a', '.L a', '.TabCss>dl>dd>a',
      '.Volume a', '._chapter a', '.aarti a', '.acss a',
      '.all-catalog a', '.art_fnlistbox a', '.art_listmain_main a', '.article_texttitleb a',
      '.as a', '.bd a', '.book a', '.book-chapter-list a',
      '.bookUpdate a', '.book_02 a', '.book_article_listtext a', '.book_con_list a',
      '.book_dirbox a', '.book_list a', '.booklist a', '#booklist a',
      '.box-item a', '.box1 a', '.box_box a', '.box_chap a',
      '.catalog a', '.catalog-list a', '.catebg a', '.category a',
      '.ccss a', '.centent a', '.chapname a', '.chapter a',
      '.chapter-list a', '.chapterBean a', '.chapterNum a', '.chapterTable a',
      '.chapter_box_ul a', '.chapter_list_chapter a', '.chapterlist a', '.chapterlistxx a',
      '.chapters a', '.chapters_list a', '.chaptertable a', '.chaptertd a',
      '.columns a', '.con_05 a', '.content a', '.contentlist a',
      '.conter a', '.css a', '.d_contarin a', '.dccss a',
      '.detail-chapters a', '.dir_main_section a', '.dirbox a', '.dirconone a',
      '.dirinfo_list a', '.dit-list a', '.download_rtx a', '.entry_video_list a',
      '.float-list a', '.index a', '.indexlist a', '.info_chapterlist a',
      '.insert_list a', '.item a', '.kui-item a', '.l_mulu_table a',
      '.lb a', '.liebiao a', '.liebiao_bottom a', '.list a',
      '.list-directory a', '.list-group a', '.list01a', '.list_Content a',
      '.list_box a', '.listmain a', '.lists a', '.lrlb a',
      '.m10 a', '.main a', '.mb_content a', '.menu-area a',
      '.ml-list1 a', '.ml_main a', '.mls a', '.mod_container a',
      '.mread a', '.mulu a', '.mulu_list a', '.nav a',
      '.nolooking a', '.novel_leftright a', '.novel_list a', '.ocon a',
      '.opf a', '.qq', '.read_list a', '.readout a',
      '.td_0 a', '.td_con a', '.third a', '.uclist a',
      '.uk-table a', '.volume a', '.volumes a', '.wiki-content-table a',
      '.www a', '.xiaoshuo_list a', '.xsList a', '.zhangjieUl a',
      '.zjbox a', '.zjlist a', '.zjlist4 a', '.zl a',
      '.zp_li a', 'dd a', '.chapter-list a', '.directoryArea a',

      '[id*="list"] a', '[class*="list"] a',
      '[id*="chapter"] a', '[class*="chapter"] a',
    ].join(','),
    // vipChapter:选择器 或 async (doc)=>url[]或{url,title}[]

    // volume:
    //  选择器/async (doc)=>elem[]；原理 $(chaptes).add(volumes);
    //  async (doc,chapters)=>chapters；尽量不要生成新的对象，而是在原有对象上增加键"volume"（方便重新下载）

    // 以下在章节页面内使用
    // ?chapterTitle:选择器 省略留空时，为chapter的textContent
    chapterTitle: '.bookname>h1,h2',

    // iframe: boolean 或 async (win)=>null
    //   使用时，只能一个一个获取（慎用）

    // popup: boolean 或 async ()=>null
    //   仅当X-Frame-Options:DENY时使用，使用时，只能一个一个获取（慎用）

    // deal: async(chapter)=>content||object
    //   不请求章节相对网页，而直接获得内容（请求其他网址）
    //   可以直接给chapter赋值，也可以返回content或需要的属性如title

    // content:选择器
    content: [
      '#pagecontent', '#contentbox', '#bmsy_content', '#bookpartinfo',
      '#htmlContent', '#text_area', '#chapter_content', '#chapterContent', '#chaptercontent',
      '#partbody', '#BookContent', '#article_content', '#BookTextRead',
      '#booktext', '#BookText', '#readtext', '#readcon',
      '#text_c', '#txt_td', '#TXT', '#txt',
      '#zjneirong', '.novel_content', '.readmain_inner', '.noveltext',
      '.booktext', '.yd_text2', '#contentTxt', '#oldtext',
      '#a_content', '#contents', '#content2', '#contentts',
      '#content1', '#content', '.content', '#arctext',
      '[itemprop="acticleBody"]', '.readerCon',
      '[id*="article"]:minsize(100)', '[class*="article"]:minsize(100)',
      '[id*="content"]:minsize(100)', '[class*="content"]:minsize(100)',
    ].join(','),

    // ?contentCheck: 检查页面是否正确，true时保留，否则content=null
    //   选择器 存在元素则为true
    //   或 async (doc,res,request)=>boolean

    // ?elementRemove:选择器 或 async (contentHTML)=>contentHTML
    //   如果需要下载图片，请不要移除图片元素
    elementRemove: 'script,style,iframe,*:emptyHuman:not(br,p,img),:hiddenHuman,a:not(:has(img))',

    // ?contentReplace:[[find,replace]]
    //   如果有图片，请不要移除图片元素

    // ?chapterPrev,chapterNext:选择器 或 async (doc)=>url
    chapterPrev: 'a[rel="prev"],a:regexp("[上前]一?[章页话集节卷篇]+"),#prevUrl',
    chapterNext: 'a[rel="next"],a:regexp("[下后]一?[章页话集节卷篇]+"),#nextUrl',
    // ?ignoreUrl:url[] 忽略的网站（用于过滤chapterPrev,chapterNext）

    // ?getChapters 在章节页面时使用，获取全部章节
    //   async (doc)=>url[]或{url,title,vip,volume}[]

    // ?charset:utf-8||gb2312||other
    //   通常来说不用设置

    // ?thread:下载线程数 通常来说不用设置

    // ?vip:{} 对于vip页面
    //  可用key: chapterTitle,iframe,deal,content,contentCheck,elementRemove,contentReplace,chapterPrev,chapterNext
  };
  const Config = {
    thread: 5,
    retry: 3,
    timeout: 60000,
    reference: true,
    format: true,
    useCommon: true,
    modeManual: true,
    templateRule: true,
    volume: true,
    failedCount: 5,
    failedWait: 60,
    image: true,
    addChapterNext: true,
    removeEmptyLine: 'auto',
    css: 'body {\n  line-height: 130%;\n  text-align: justify;\n  font-family: \\"Microsoft YaHei\\", sans-serif;\n  font-size: 22px;\n  margin: 0 auto;\n  background-color: #CCE8CF;\n  color: #000;\n}\n\nh1 {\n  text-align: center;\n  font-weight: bold;\n  font-size: 28px;\n}\n\nh2 {\n  text-align: center;\n  font-weight: bold;\n  font-size: 26px;\n}\n\nh3 {\n  text-align: center;\n  font-weight: bold;\n  font-size: 24px;\n}\n\np {\n  text-indent: 2em;\n}',
    customize: '[]',

    iframeDetect: [
      '正在验证您是否是真人。这可能需要几秒钟时间。',
      '需要先检查您的连接的安全性。',
      '此过程将自动执行，您的浏览器很快会重定向至您请求的内容。',
      '为什么我必须完成人机验证',
    ].join('\n'),

    // 刷新生效
    iframe: false,
    chapterTitle: Rule.chapterTitle,
    content: Rule.content,
    elementRemove: Rule.elementRemove,

    ...GM_getValue('config', {}),
  };

  Rule.special = [
    // 漫画
    { // https://manhua.dmzj.com/
      siteName: '动漫之家',
      url: '://manhua.dmzj.com/[a-z0-9]+/',
      chapterUrl: '://manhua.dmzj.com/[a-z0-9]+/\\d+.shtml',
      title: '.anim_title_text h1',
      writer: '.anim-main_list a[href^="../tags/"]',
      intro: '.line_height_content',
      cover: '#cover_pic',
      chapter: '[class^="cartoon_online_border"]>ul>li>a',
      volume: '.h2_title2>h2',
      chapterTitle: '.display_middle',
      content: '#center_box',
      iframe: true,
      contentReplace: [
        [/<img id="img_\d+" style=".*?" data-original="(.*?)" src=".*?">/g, '<img src="$1">'],
      ],
    },
    { // https://www.manhuabei.com/ https://www.manhuafen.com/
      siteName: '漫画堆',
      filter: () => ($('.dmzj-logo').length && $('.wrap_intro_l_comic').length && $('.wrap_intro_r').length && $('.list_con_li').length
        ? 1
        : $('.foot-detail:contains("漫画")').length && $('.dm_logo').length && $('.chapter-view').length ? 2 : 0),
      title: '.comic_deCon>h1',
      writer: '.comic_deCon_liO>li>a[href^="/author/"]',
      intro: '.comic_deCon_d',
      cover: '.comic_i_img>img',
      chapter: '.list_con_li>li>a',
      volume: '.zj_list_head>h2>em',
      chapterTitle: '.head_title>h2',
      iframe: (win) => $('<div class="nd3-images">').html(win.chapterImages.map((item, index, arr) => `<img data-src="${win.SinMH.getChapterImage(index + 1)}" /><p class="img_info">(${index + 1}/${arr.length})</p>`).join('')).appendTo(win.document.body),
      content: '.nd3-images',
      contentReplace: [
        [/<img data-src/g, '<img src'],
      ],
    },
    { // https://www.manhuagui.com/
      siteName: '漫画柜',
      url: '://www.manhuagui.com/comic/\\d+/$',
      chapterUrl: '://www.manhuagui.com/comic/\\d+/\\d+.html',
      title: '.book-title>h1',
      writer: '.detail-list [href^="/author/"]',
      intro: '#intro-all',
      cover: '.book-cover>.hcover>img',
      chapter: '.chapter-list a',
      volume: 'h4>span',
      chapterTitle: '.title h2',
      content: (doc, res, request) => {
        let info = res.responseText.match(/window\["\\x65\\x76\\x61\\x6c"\](.*?)<\/script>/)[1];
        info = window.eval(info); // eslint-disable-line no-eval
        info = info.match(/^SMH.imgData(.*?).preInit\(\);/)[1];
        info = window.eval(info); // eslint-disable-line no-eval
        const a = info.files.map((item, index, arr) => `<img src="https://us.hamreus.com${info.path}${item}?e=${info.sl.e}&m=${info.sl.m}" /><p class="img_info">(${index + 1}/${arr.length})</p>`);
        return a.join('');
      },
      contentReplace: [
        [/<img id="img_\d+" style=".*?" data-original="(.*?)" src=".*?">/g, '<img src="$1">'],
      ],
    },
    // 文学
    { // http://gj.zdic.net
      siteName: '汉典古籍',
      filter: () => (window.location.host === 'gj.zdic.net' ? ($('#ml_1').length ? 1 : 2) : 0),
      title: '#shuye>h1',
      intro: '#jj_2',
      chapter: '.mls>li>a',
      chapterTitle: '#snr1>h1',
      content: '#snr2',
      elementRemove: '.pagenav1',
      chapterPrev: 'a:contains("上一篇")',
      chapterNext: 'a:contains("下一篇")',
    },
    { // https://www.99csw.com
      siteName: '九九藏书网',
      url: /99csw.com\/book\/\d+\/(index\.htm)?$/,
      chapterUrl: /99csw.com\/book\/\d+\/\d+.htm/,
      title: '#book_info>h2',
      writer: 'h4:contains("作者")>a',
      intro: '.intro',
      cover: '#book_info>img',
      chapter: '#dir a',
      volume: '#dir>dt:nochild',
      iframe: async (win) => {
        while (win.content.showNext() !== false) {
          await waitInMs(200);
        }
      },
      content: '#content>div:visible',
      // content: function (doc, res, request) {
      //   const content = [];
      //   const box = $('#content', doc).get(0);
      //   const star = 0; // ? 可能根本没用
      //   var e = CryptoJS.enc.Base64.parse($('meta[name="client"]', doc).attr('content')).toString(CryptoJS.enc.Utf8).split(/[A-Z]+%/);
      //   var j = 0;
      //   function r (a) {
      //     return a;
      //   }
      //   for (var i = 0; i < e.length; i++) {
      //     if (e[i] < 3) {
      //       content[e[i]] = r(box.childNodes[i + star]);
      //       j++;
      //     } else {
      //       content[e[i] - j] = r(box.childNodes[i + star]);
      //       j = j + 2;
      //     }
      //   }
      //   return content.map(i => i.outerHTML).join('<br>');
      // }
    },
    { // https://www.kanunu8.com/book2/11107/index.html
      siteName: '努努书坊',
      filter: () => (window.location.href.match(/kanunu8.com\/book2/) ? ($('.book').length ? 1 : 2) : 0),
      title: '.book>h1',
      writer: '.book>h2>a',
      intro: '.description>p',
      chapter: '.book>dl>dd>a',
      volume: '.book>dl>dt',
      content: '#Article>.text',
      elementRemove: 'table,a',
    },
    { // https://www.kanunu8.com
      siteName: '努努书坊',
      filter: () => (window.location.host === 'www.kanunu8.com' ? ($(['body>div:nth-child(1)>table:nth-child(10)>tbody>tr:nth-child(4)>td>table:nth-child(2)>tbody>tr>td>a', 'body>div>table>tbody>tr>td>table>tbody>tr>td>table:not(:has([class^="p"])) a'].join(',')).length ? 1 : 2) : 0),
      title: 'h1>strong>font,h2>b',
      writer: 'body > div:nth-child(1) > table:nth-child(10) > tbody > tr:nth-child(2) > td,body > div:nth-child(1) > table:nth-child(10) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(2) > td',
      intro: '[align="left"]>[class^="p"]',
      cover: 'img[height="160"]',
      chapter: ['body>div:nth-child(1)>table:nth-child(10)>tbody>tr:nth-child(4)>td>table:nth-child(2)>tbody>tr>td>a', 'body>div>table>tbody>tr>td>table>tbody>tr>td>table:not(:has([class^="p"])) a'].join(','),
      content: 'body > div:nth-child(1) > table:nth-child(5) > tbody > tr > td:nth-child(2) > p',
    },
    { // http://www.my2852.com
      siteName: '梦远书城',
      filter: () => (window.location.href.match(/my2852?.com/) ? ($('a:contains("回目录")').length ? 2 : 1) : 0),
      titleRegExp: /(.*?)[|_]/,
      title: '.book>h1',
      writer: 'b:contains("作者")',
      intro: '.zhj,body > div:nth-child(4) > table > tbody > tr > td.td6 > div > table > tbody > tr > td:nth-child(1) > div > table > tbody > tr:nth-child(1) > td',
      cover: 'img[alt="封面"]',
      chapter: () => $('a[href]').toArray().filter((i) => $(i).attr('href').match(/^\d+\.htm/)).map((i) => ({ url: $(i).attr('href'), title: $(i).text().trim() })),
      content: 'td:has(br)',
    },
    { // https://www.tianyabooks.com
      siteName: '天涯书库',
      url: /tianyabooks\.com\/.*?\/$/,
      chapterUrl: /tianyabooks\.com\/.*?\.html$/,
      title: '.book>h1',
      writer: 'h2>a[href^="/author/"]',
      intro: '.description>p',
      chapter: '.book>dl>dd>a',
      volume: '.book>dl>dt',
      chapterTitle: 'h1',
      content: '[align="center"]+p',
    },
    { // https://www.51xs.com/
      siteName: '我要小说网',
      url: '://www.51xs.com/.*?/index.html',
      chapterUrl: '://www.51xs.com/.*?/\\d+.htm',
      title: '[style="FONT-FAMILY: 宋体; FONT-SIZE:12pt"]',
      writer: '[href="../index.html"]',
      chapter: '[style="FONT-FAMILY: 宋体; FONT-SIZE:12pt"]+center a',
      volume: '[bgcolor="#D9DDE8"]',
      chapterTitle: '.tt2>center>b',
      content: '.tt2',
    },
    // 正版
    { // https://www.qidian.com https://www.hongxiu.com https://www.readnovel.com https://www.xs8.cn
      siteName: '起点中文网',
      url: /(qidian.com|hongxiu.com|readnovel.com|xs8.cn)\/book\/\d+/,
      chapterUrl: /(qidian.com|hongxiu.com|readnovel.com|xs8.cn)\/chapter/,
      title: '#bookName',
      writer: '.author',
      intro: '#book-intro-detail',
      cover: '#bookImg>img',
      chapter: '.catalog-volume li>a',
      vipChapter: '.catalog-volume:has(.vip) li>a',
      volume: () => $('.volume-name').toArray().map((i) => i.childNodes[0]),
      chapterTitle: '.title',
      content: '.content',
      elementRemove: '.review',
      vip: {
        // iframe: async (win) => {  return $('.content',win.document).length},
        popup: async () => { await waitFor(() => $('.content:visible').length, 5 * 1000); },
      },
    },
    { // https://www.ciweimao.com
      siteName: '刺猬猫',
      url: /:\/\/(www.)?ciweimao.com\/(book|chapter-list)\/\d+/,
      chapterUrl: /:\/\/(www.)?ciweimao.com\/chapter\/\d+/,
      infoPage: () => `https://www.ciweimao.com/book/${window.location.href.match(/\d+/)[0]}`,
      title: 'h3',
      writer: '.book-info [href*="reader/"]',
      intro: '.book-intro-cnt>div:nth-child(1)',
      cover: '.cover>img',
      chapter: '.book-chapter-list a',
      vipChapter: '.book-chapter-list a:has(.icon-lock),.book-chapter-list a:has(.icon-unlock)',
      volume: '.book-chapter-box>.sub-tit',
      chapterTitle: 'h3.chapter',
      deal: async (chapter) => {
        if (!unsafeWindow.CryptoJS) {
          const result = await Promise.all([
            '/resources/js/enjs.min.js',
            '/resources/js/myEncrytExtend-min.js',
            '/resources/js/jquery-plugins/jquery.base64.min.js',
          ].map((i) => `https://www.ciweimao.com${i}`).map((i) => xhr.sync(i, null, { cache: true })));
          for (const res of result) unsafeWindow.eval(res.responseText);
        }

        const chapterId = chapter.url.split('/').slice(-1)[0];
        const res1 = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            method: 'POST',
            url: `${window.location.origin}/chapter/ajax_get_session_code`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            data: `chapter_id=${chapterId}`,
            responseType: 'json',
            onload(res) {
              resolve(res);
            },
          }, null, 0, true);
        });
        const accessKey = res1.response.chapter_access_key;

        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            method: 'POST',
            url: `${window.location.origin}/chapter/get_book_chapter_detail_info`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            data: `chapter_id=${chapterId}&chapter_access_key=${accessKey}`,
            // responseType: 'json',
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const content = unsafeWindow.$.myDecrypt({
                  content: json.chapter_content,
                  keys: json.encryt_keys,
                  accessKey,
                });
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
      elementRemove: 'span',
      chapterPrev: '#J_BtnPagePrev',
      chapterNext: '#J_BtnPageNext',
      thread: 1,
      vip: {
        deal: null,
        iframe: async (win) => {
          win.getDataUrl = async (img) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            const url = canvas.toDataURL('image/jpeg', 0.5);
            img.src = url;
            // return new Promise((resolve, reject) => {
            //   canvas.toBlob(function (blob) {
            //     const url = URL.createObjectURL(blob);
            //     img.src = url;
            //     resolve();
            //   });
            // });
          };
          await waitFor(() => $('#J_BookImage', win.document).css('background-image').match(/^url\("?(.*?)"?\)/));
          let src = $('#J_BookImage', win.document).css('background-image').match(/^url\("?(.*?)"?\)/)[1];
          await new Promise((resolve, reject) => {
            $('#realBookImage', win.document).one('load', async () => {
              src = await win.getDataUrl($('#realBookImage', win.document).get(0));
              window.history.back();
              resolve();
            }).attr('src', src);
          });
        },
        content: '#J_BookImage',
        elementRemove: 'i',
      },
    },
    { // https://www.shubl.com/
      siteName: '书耽',
      url: '://www.shubl.com/book/book_detail/\\d+',
      chapterUrl: '://www.shubl.com/chapter/book_chapter_detail/\\d+',
      title: '.book-title>span',
      writer: '.right>.box>.user-info .username',
      intro: '.book-brief',
      cover: '.book-img',
      chapter: '#chapter_list .chapter_item>a',
      vipChapter: '#chapter_list .chapter_item:has(.lock)>a',
      chapterTitle: '.article-title',
      deal: async (chapter) => Rule.special.find((i) => i.siteName === '刺猬猫').deal(chapter),
      elementRemove: 'span',
      chapterPrev: '#J_BtnPagePrev',
      chapterNext: '#J_BtnPageNext',
      thread: 1,
    },
    { // http://chuangshi.qq.com http://yunqi.qq.com
      siteName: '创世中文网',
      url: /(chuangshi|yunqi).qq.com\/bk\/.*?-l.html/,
      chapterUrl: /(chuangshi|yunqi).qq.com\/bk\/.*?-r-\d+.html/,
      infoPage: '.title>a,.bookNav>a:nth-child(4)',
      title: '.title>a>b',
      writer: '.au_name a',
      intro: '.info',
      cover: '.bookcover>img',
      chapter: 'div.list>ul>li>a',
      vipChapter: 'div.list:has(span.f900)>ul>li>a',
      volume: '.juan_height',
      deal: async (chapter) => {
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `${window.location.origin}/index.php/Bookreader/${$('.title a:eq(0)').attr('href').match(/\/(\d+).html/)[1]}/${chapter.url.match(/-(\d+).html/)[1]}`,
            method: 'POST',
            data: 'lang=zhs',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                let content = json.Content;
                const base = 30;
                const arrStr = [];
                const arrText = content.split('\\');
                for (let i = 1, len = arrText.length; i < len; i++) {
                  arrStr.push(String.fromCharCode(parseInt(arrText[i], base)));
                }
                let html = arrStr.join('');
                if ($('<div>').html(html).text().match(/url\((https?:\/\/yuewen-skythunder-\d+.*?\.ttf)\)/)) {
                  if (!fontLib) fontLib = JSON.parse(GM_getResourceText('fontLib')).reverse();
                  const font = $('<div>').html(html).text().match(/url\((https?:\/\/yuewen-skythunder-\d+.*?\.ttf)\)/)[1];

                  opentype.load(font, (err, font) => {
                    if (err) resolve('');
                    const obj = {};
                    const undefinedFont = [];
                    for (const i in font.glyphs.glyphs) {
                      const data = font.glyphs.glyphs[i].path.toPathData();

                      const key = fontLib.find((i) => i.path === data);
                      if (key) obj[font.glyphs.glyphs[i].unicode] = key.unicode;
                      if (!key) undefinedFont.push(data);
                    }
                    if (undefinedFont.length) console.error('未确定字符', undefinedFont);
                    html = html.replace(/&#(\d+);/g, (matched, m1) => (m1 in obj ? obj[m1] : matched));
                    content = $('.bookreadercontent', html).html();
                    resolve(content);
                  });
                } else {
                  content = $('.bookreadercontent', html).html();
                  resolve(content);
                }
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // http://dushu.qq.com 待测试:http://book.qq.com
      siteName: 'QQ阅读',
      url: /(book|dushu).qq.com\/intro.html\?bid=\d+/,
      chapterUrl: /(book|dushu).qq.com\/read.html\?bid=\d+&cid=\d+/,
      title: 'h3>a',
      writer: '.w_au>a',
      intro: '.book_intro',
      cover: '.bookBox>a>img',
      chapter: '#chapterList>div>ol>li>a',
      vipChapter: '#chapterList>div>ol>li:not(:has(span.free))>a',
      deal: async (chapter) => {
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `${window.location.origin}/read/${unsafeWindow.bid}/${chapter.url.match(/cid=(\d+)/)[1]}`,
            method: 'POST',
            data: 'lang=zhs',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                let content = json.Content;
                content = $('.bookreadercontent', content).html();
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // https://www.webnovel.com
      siteName: '起点国际',
      url: /webnovel.com\/book\/\d+(#contents)?$/,
      chapterUrl: /webnovel.com\/book\/\d+\/\d+/,
      title: 'h2',
      writer: 'address span',
      intro: '#about .g_txt_over',
      cover: '.det-info .g_thumb',
      chapter: '.content-list a',
      volume: '.volume-item>h4',
      content: '.cha-words',
      elementRemove: 'pirate',
    },
    { // https://book.tianya.cn/
      siteName: '天涯文学',
      url: /book.tianya.cn\/html2\/dir.aspx\?bookid=\d+/,
      chapterUrl: /book.tianya.cn\/chapter-\d+-\d+/,
      infoPage: () => `https://book.tianya.cn/book/${window.location.href.split('/').slice(-1)[0].match(/\d+/)[0]}.aspx`,
      title: '.book-name>a',
      writer: '.bd>p>span',
      intro: '#brief_intro',
      cover: '.lft-pic>a>img',
      chapter: 'ul.dit-list>li>a',
      vipChapter: 'ul.dit-list>li:not(:has(.free))>a',
      deal: async (chapter) => {
        const result = await new Promise((resolve, reject) => {
          const urlArr = chapter.url.split('-');
          xhr.add({
            chapter,
            url: 'https://app3g.tianya.cn/webservice/web/read_chapter.jsp',
            method: 'POST',
            data: `bookid=${urlArr[1]}&chapterid=${urlArr[2]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: 'https://app3g.tianya.cn/webservice/web/proxy.html',
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const title = json.data.curChapterName;
                const content = json.data.chapterContent;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return result;
      },
    },
    { // http://www.3gsc.com.cn
      siteName: '3G书城',
      url: /3gsc\.com\.cn\/bookreader\/\d+/,
      chapterUrl: /3gsc.com.cn\/bookcon\//,
      infoPage: '[href^="/book/"]',
      title: 'h1.RecArticle',
      writer: '.author',
      intro: '.RecReview',
      cover: '.RecBook img[onerror]',
      chapter: '.menu-area>p>a',
      vipChapter: '.menu-area>p>a:has(span.vip)',
      volume: '.menu-area>h2',
      chapterTitle: 'h1',
      content: '.menu-area',
    },
    { // http://www.zongheng.com/
      siteName: '纵横',
      url: /www\.zongheng\.com\/detail\/\d+/,
      chapterUrl: /(read|book)\.zongheng\.com\/chapter\/\d+\/\d+\.html/,
      title: '.book-info--title>span',
      writer: '.author-info--name',
      intro: '.detail-work-info--introduction',
      cover: '.book-info--coverImage-img',
      chapter: '.chapter-list--item',
      vipChapter: '.chapter-list--item:has(.chapter-list--item-vip)',
      chapterTitle: '.title_txtbox',
      content: '.content',
      elementRemove: '',
    },
    { // http://huayu.zongheng.com/
      siteName: '纵横女生网',
      url: /huayu.zongheng.com\/showchapter\/\d+.html/,
      chapterUrl: /(read|book)\.zongheng\.com\/chapter\/\d+\/\d+\.html/,
      infoPage: '[class$="crumb"]>a:nth-child(3)',
      title: '.book-name',
      writer: '.au-name',
      intro: '.book-dec>p',
      cover: '.book-img>img',
      chapter: '.chapter-list a',
      vipChapter: '.chapter-list .vip>a',
      volume: () => $('.volume').toArray().map((i) => i.childNodes[6]),
      chapterTitle: '.title_txtbox',
      content: '.content',
      elementRemove: '',
    },
    { // http://naodong.zongheng.com/
      siteName: '纵横脑洞',
      url: /naodong\.zongheng\.com\/detail\/\d+/,
      chapterUrl: /(read|book)\.zongheng\.com\/chapter\/\d+\/\d+\.html/,
      title: '.bookname',
      writer: '.au-name',
      intro: '.intro-tip-p',
      cover: '.book_img>img',
      chapter: '.cata-item a',
      vipChapter: '.cata-item:has(.cata-item-vip) a',
      chapterTitle: '.title_txtbox',
      content: '.content',
      elementRemove: '',
    },
    { // https://www.17k.com/
      siteName: '17K',
      url: /www.17k.com\/list\/\d+.html/,
      chapterUrl: /www.17k.com\/chapter\/\d+\/\d+.html/,
      infoPage: '.infoPath a:nth-child(4)',
      title: '.Info>h1',
      writer: '.AuthorInfo .name',
      intro: '.intro>a',
      cover: '.cover img',
      chapter: 'dl.Volume>dd>a',
      vipChapter: 'dl.Volume>dd>a:has(.vip)',
      volume: '.Volume>dt>.tit',
      chapterTitle: 'h1',
      content: '.p',
      elementRemove: '.copy,.qrcode',
    },
    { // https://www.8kana.com/
      siteName: '不可能的世界',
      url: /www.8kana.com\/book\/\d+(.html)?/,
      chapterUrl: /www.8kana.com\/read\/\d+.html/,
      title: 'h2.left',
      writer: '.authorName',
      intro: '.bookIntroduction',
      cover: '.bookContainImgBox img',
      chapter: '#informList li.nolooking>a',
      vipChapter: '#informList li.nolooking>a:has(.chapter_con_VIP)',
      volume: '[flag="volumes"] span',
      chapterTitle: 'h2',
      content: '.myContent',
      elementRemove: '[id="-2"]',
    },
    { // https://www.heiyan.com https://www.ruochu.com
      siteName: '黑岩',
      url: /www.(heiyan|ruochu).com\/chapter\//,
      chapterUrl: /www.(heiyan|ruochu).com\/book\/\d+\/\d+/,
      infoPage: '.pic [href*="/book/"],.breadcrumb>a:nth-child(5)',
      title: 'h1[style]',
      writer: '.name>strong',
      intro: '.summary>.note',
      cover: '.book-cover',
      chapter: 'div.bd>ul>li>a',
      vipChapter: 'div.bd>ul>li>a.isvip',
      volume: '.chapter-list>.hd>h2',
      deal: async (chapter) => {
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `http://${window.location.host.replace('www.', 'a.')}/ajax/chapter/content/${chapter.url.replace(/.*\//, '')}`,
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const { title } = json.chapter;
                const content = json.chapter.htmlContent;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // https://b.faloo.com
      siteName: '飞卢',
      url: /b.faloo.com\/\d+.html/,
      chapterUrl: /b.faloo.com\/\d+_\d+.html/,
      title: '#novelName',
      writer: '#novelName+a',
      intro: '.T-L-T-C-Box1',
      cover: '.imgcss',
      chapter: '#mulu .DivTable .DivTd>a',
      vipChapter: '#mulu .DivVip~.DivTable .DivTd>a',
      volume: '.C-Fo-Z-ML-TitleBox>h3',
      chapterTitle: '.c_l_title',
      content: '.noveContent',
      elementRemove: 'p:has(a,b,font)',
      vip: {
        content: (doc, res, request) => {
          const doc1 = new window.DOMParser().parseFromString(res.responseText, 'text/html');
          const func = $('script:contains("image_do3")', doc1).text();
          /* eslint-disable camelcase */
          if (!unsafeWindow.image_do3) {
            unsafeWindow.image_do3 = function (num, o, id, n, en, t, k, u, time, fontsize, fontcolor, chaptertype, font_family_type) {
              const type = 1;
              let domain = '//read.faloo.com/';
              if (chaptertype === 0) { domain = '//read6.faloo.com/'; }
              if (type === 2) { domain = '//read2.faloo.com/'; }
              if (typeof (font_family_type) === 'undefined' || font_family_type == null) {
                font_family_type = 0;
              }
              let url = `${domain}Page4VipImage.aspx?num=${num}&o=${o}&id=${id}&n=${n}&ct=${chaptertype}&en=${en}&t=${t}&font_size=${fontsize}&font_color=${fontcolor}&FontFamilyType=${font_family_type}&u=${u}&time=${time}&k=${k}`;
              url = encodeURI(url);
              return url;
            };
          }
          /* eslint-enable camelcase */
          const image = window.eval(`window.${func}`); // eslint-disable-line no-eval
          const elem = $('.noveContent', doc1);
          elem.find('.con_img').replaceWith(`<img src="${image}">`);
          return elem.html();
        },
      },
    },
    { // https://www.jjwxc.net // TODO vip自定义字体
      siteName: '晋江文学城',
      filter: () => {
        if (window.location.href.match(/www.jjwxc.net\/onebook.php\?novelid=\d+$/)) {
          $('[id^="vip_"]').toArray().forEach((i) => {
            i.href = i.rel;
            i.target = '_blank';
          });
          return 1;
        } if (window.location.href.match(/www.jjwxc.net\/onebook.php\?novelid=\d+&chapterid=\d+/)) {
          return 2;
        }
        return 0;
      },
      title: '[itemprop="name"]',
      writer: '[itemprop="author"]',
      intro: '[itemprop="description"]',
      cover: '[itemprop="image"]',
      chapter: '[itemprop="url"][href]',
      vipChapter: '#oneboolt>tbody>tr>td>span>div>a[id^="vip_"]',
      volume: '.volumnfont',
      chapterTitle: 'h2',
      content: '.noveltext',
      elementRemove: 'div',
      // vip
      // http://static.jjwxc.net/tmp/fonts/jjwxcfont_00147.ttf
      // http://static.jjwxc.net/tmp/fonts/jjwxcfont_000bl.ttf
      // http://static.jjwxc.net/tmp/fonts/jjwxcfont_00bmn.ttf
    },
    { // https://www.xxsy.net
      siteName: '潇湘书院',
      url: /www.xxsy.net\/info\/\d+.html/,
      chapterUrl: /www.xxsy.net\/chapter\/\d+.html/,
      title: '.title h1',
      writer: '.title a[href^="/authorcenter/"]',
      intro: '.introcontent',
      cover: '.bookprofile>dt>img',
      chapter: '.catalog-list>li>a',
      vipChapter: '.catalog-list>li.vip>a',
      volume: () => $('.catalog-main>dt').toArray().map((i) => i.childNodes[2]),
      chapterTitle: '.chapter-title',
      content: '.chapter-main',
    },
    { // http://www.zhulang.com http://www.xxs8.com/
      siteName: '逐浪',
      url: /book.(zhulang|xxs8).com\/\d+\/$/,
      chapterUrl: /book.(zhulang|xxs8).com\/\d+\/\d+.html/,
      infoPage: 'strong>a,.textinfo>a',
      title: '.crumbs>strong',
      writer: '.cover-tit>h2>span>a',
      intro: '#book-summary',
      cover: '.cover-box-left>img',
      chapter: '.chapter-list>ul>li>a',
      vipChapter: '.chapter-list>ul>li>a:has(span)',
      volume: '.catalog-tit>h2',
      chapterTitle: 'h2>span',
      content: '#read-content',
      elementRemove: 'h2,div,style,p:has(cite)',
    },
    { // https://www.kanshu.com
      siteName: '看书网',
      url: /www.kanshu.com\/artinfo\/\d+.html/,
      chapterUrl: /www.kanshu.com\/files\/article\/html\/\d+\/\d+.html/,
      title: '.author',
      intro: '.detailInfo',
      cover: '.bookImg',
      chapter: '.list>a',
      vipChapter: '.list>a.isvip',
      chapterTitle: '.contentBox .title',
      content: '.contentBox .tempcontentBox',
    },
    { // http://vip.book.sina.com.cn
      siteName: '微博读书-书城',
      url: /vip.book.sina.com.cn\/weibobook\/book\/\d+.html/,
      chapterUrl: /vip.book.sina.com.cn\/weibobook\/vipc.php\?bid=\d+&cid=\d+/,
      title: 'h1.book_name',
      writer: '.authorName',
      intro: '.info_txt',
      cover: '.book_img>img',
      chapter: '.chapter>span>a',
      vipChapter: '.chapter>span:has(i)>a',
      chapterTitle: '.sr-play-box-scroll-t-path>span',
      content: (doc, res, request) => window.eval(res.responseText.match(/var chapterContent = (".*")/)[1]), // eslint-disable-line no-eval
    },
    { // http://www.lcread.com
      siteName: '连城读书',
      url: /www.lcread.com\/bookpage\/\d+\/index.html/,
      chapterUrl: /www.lcread.com\/bookpage\/\d+\/\d+rc.html/,
      title: '.bri>table>tbody>tr>td>h1',
      writer: '[href^="http://my.lc1001.com/book/q?u="]',
      intro: '.bri2',
      cover: '.brc>img',
      chapter: '#abl4>table>tbody>tr>td>a',
      vipChapter: '#abl4>table>tbody>tr>td>a[href^="http://my.lc1001.com/vipchapters"]',
      volume: '#cul>.dsh',
      chapterTitle: 'h2',
      content: '#ccon',
    },
    { // https://www.motie.com
      siteName: '磨铁中文网',
      url: /www.motie.com\/book\/\d+/,
      chapterUrl: /www.motie.com\/chapter\/\d+\/\d+/,
      title: '.title>.name',
      writer: '.title>.name+a',
      intro: '.brief_text',
      cover: '.pic>span>img',
      chapter: '.catebg a',
      vipChapter: '.catebg a:has([alt="vip"])',
      volume: '.cate-tit>h2',
      deal: async (chapter) => {
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `https://app2.motie.com/pc/chapter/${chapter.url.split('/')[5]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const title = json.data.name;
                const { content } = json.data;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // http://www.shuhai.com
      siteName: '书海小说网',
      url: 'www.shuhai.com/book/\\d+.htm',
      chapterUrl: 'www.shuhai.com/read/\\d+/\\d+.html',
      title: '.book-info-bookname>span',
      writer: '.book-info-bookname>span+span',
      intro: '.book-info-bookintro',
      cover: '.book-info .book-cover',
      chapter: '.chapter-item>a',
      vipChapter: '.chapter-item:has(.vip)>a',
      volume: 'span.chapter-item',
      chapterTitle: '.chapter-name',
      content: '.chapter-item:has(.chaper-info)',
      elementRemove: 'div',
    },
    { // http://www.xiang5.com
      siteName: '香网',
      url: 'www.xiang5.com/booklist/\\d+.html',
      chapterUrl: 'www.xiang5.com/content/\\d+/\\d+.html',
      infoPage: '.pos a:last',
      title: '.fr>h4',
      writer: '.colR>a[href*="author"]',
      intro: '.workSecHit+h2+p',
      cover: '.worksLList .fl >a>img',
      chapter: '.lb>table>tbody>tr>td>a',
      volume: '.lb>h2',
      chapterTitle: '.pos>h1',
      content: '.xsDetail',
      elementRemove: 'p[style],p>*',
    },
    { // https://www.fmx.cn/
      siteName: '凤鸣轩小说网',
      url: '://read.fmx.cn/files/article/html/[\\d/]+/index.html',
      chapterUrl: '://read.fmx.cn/files/article/html/[\\d/]+.html',
      infoPage: '.art_fnbox_sy>a,strong>a',
      title: 'h1>span',
      writer: 'h1>span:nth-child(2)',
      intro: '#zjp',
      cover: 'img[onerror]',
      chapter: '.art_fnlistbox>span>a:visible,.art_fnlistbox_vip>ul>li>span>a:visible',
      vipChapter: '.art_fnlistbox_vip>ul>li>span>a:visible',
      chapterTitle: 'h1',
      content: '#content',
      elementRemove: 'div,p:last',
    },
    { // https://www.kujiang.com
      siteName: '酷匠网',
      url: '://www.kujiang.com/book/\\d+/catalog',
      chapterUrl: '://www.kujiang.com/book/\\d+/\\d+',
      infoPage: 'h1.zero>a:nth-child(2),.chapter_crumb>a:nth-child(2)',
      title: '.book_title',
      writer: '.book_author>a',
      intro: '#book_intro',
      cover: '.kjbookcover img',
      chapter: '.third>a',
      volume: '.kjdt-catalog>span:nth-child(1)',
      chapterTitle: 'h1',
      content: '.content',
      elementRemove: 'span',
      contentReplace: [
        ['.*酷.*匠.*网.*'],
      ],
    },
    { // http://www.tadu.com
      siteName: '塔读文学',
      url: '://www.tadu.com(:\\d+)?/book/catalogue/\\d+',
      chapterUrl: '://www.tadu.com(:\\d+)?/book/\\d+/\\d+/',
      infoPage: () => `${window.location.origin}/book/${window.location.pathname.match(/\d+/)[0]}`,
      title: '.bkNm',
      writer: '.bookNm>a:nth-child(2)',
      intro: '.datum+p',
      cover: (doc) => $('.bookImg>img', doc).attr('data-src').replace(/_a\.jpg$/, '.jpg'),
      chapter: '.chapter>a',
      vipChapter: '.chapter>a:has(.vip)',
      chapterTitle: '.chapter h4',
      content: async (doc, res, request) => {
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter: request.raw,
            url: res.responseText.match(/id="bookPartResourceUrl" value="(.*?)"/)[1],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: request.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const content = res.responseText.match(/\{content:'(.*)'\}/)[1];
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // https://yuedu.163.com
      siteName: '网易云阅读',
      url: '://yuedu.163.com/source/.*',
      chapterUrl: '://yuedu.163.com/book_reader/.*',
      title: 'h3>em',
      writer: 'h3>span>a',
      intro: '.description',
      cover: '.cover>img',
      chapter: '.item>a,.title-1>a',
      vipChapter: '.vip>a',
      volume: '.title-1',
      deal: async (chapter) => {
        const urlArr = chapter.url.split('/');
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `${window.location.protocol}//yuedu.163.com/getArticleContent.do?sourceUuid=${urlArr[4]}&articleUuid=${urlArr[5]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const content = CryptoJS.enc.Base64.parse(json.content).toString(CryptoJS.enc.Utf8);
                const title = $('h1', content).text();
                resolve({ content, title });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // https://guofeng.yuedu.163.com/ https://caiwei.yuedu.163.com/
      siteName: '网易旗下',
      url: '://(guofeng|caiwei).yuedu.163.com/newBookReader.do\\?operation=catalog&sourceUuid=.*',
      chapterUrl: '://(guofeng|caiwei).yuedu.163.com/book_reader/.*',
      infoPage: () => `${window.location.origin}/source/${window.location.href.match(/sourceUuid=(.*?)($|&)/) ? window.location.href.match(/sourceUuid=(.*?)($|&)/)[1] : window.location.href.split('/')[4]}`,
      title: 'h3>em',
      writer: 'h3>em+span>a',
      intro: '.m-bookdetail .description',
      cover: '.m-bookdetail .cover>img',
      chapter: '.item>a',
      vipChapter: '.vip>a',
      volume: '.title-1',
      deal: async (chapter) => Rule.special.find((i) => i.siteName === '网易云阅读').deal(chapter),
    },
    { // https://www.yueduyun.com/
      siteName: '阅路小说网',
      url: '://www.yueduyun.com/catalog/\\d+',
      chapterUrl: '://www.yueduyun.com/read/\\d+/\\d+',
      infoPage: () => `https://apiuser.yueduyun.com/w/block/book?book_id=${window.location.href.match(/\d+/)[0]}`,
      title: (doc) => JSON.parse($('body', doc).html()).data.book_name,
      writer: (doc) => JSON.parse($('body', doc).html()).data.author_name,
      intro: (doc) => JSON.parse($('body', doc).html()).data.book_intro,
      cover: (doc) => JSON.parse($('body', doc).html()).data.book_cover,
      chapter: '.catalog li>a',
      vipChapter: '.catalog li:has(span)>a',
      deal: async (chapter) => {
        const urlArr = chapter.url.split('/');
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `https://apiuser.yueduyun.com/app/chapter/chapter_content?book_id=${urlArr[4]}&chapter_id=${urlArr[5]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const title = json.data.chapter_name;
                const content = json.data.chapter_content;
                Storage.book.title = json.data.book_name;
                Storage.book.writer = json.data.author_name;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // http://www.ycsd.cn
      siteName: '原创书殿',
      url: '://www.ycsd.cn/book/chapters/.*?',
      chapterUrl: '://www.ycsd.cn/book/chapter/.*?',
      infoPage: '[class$="crumbs"] a:last',
      title: '.book-name',
      writer: '.author-name',
      intro: '.book-desc',
      cover: '.book-cover>img',
      chapter: '.directory-item>a',
      vipChapter: '.directory-item>a:has(img)',
      chapterTitle: '.chapter-wrap>h1',
      content: '.content',
    },
    { // http://www.longruo.com
      siteName: '龙若中文网',
      url: '://www.longruo.com/chapterlist/\\d+.html',
      chapterUrl: '://www.longruo.com/catalog/\\d+_\\d+.html',
      infoPage: '.fc666 a:last,.position a:last',
      title: '.book_introduction h2>a',
      writer: '.fc999+a',
      intro: '.introduction_text',
      cover: '.mr20>a>img',
      chapter: '.catalog>li>a',
      vipChapter: '.catalog>li>a:has(span.mark)',
      chapterTitle: 'h1',
      content: '.article',
    },
    { // http://www.hxtk.com
      siteName: '华夏天空',
      url: '://www.hxtk.com/chapterList/\\d+',
      chapterUrl: '://www.hxtk.com/chapter/\\d+',
      infoPage: '.breadcrumb>a[href*="/bookDetail/"]',
      title: '.book-name>h1',
      writer: '.book-writer>a',
      intro: '.book-introduction>.part',
      cover: '.book-img>img',
      chapter: '.volume-item a',
      vipChapter: '.volume-item:has(i) a',
      chapterTitle: 'h2',
      content: '#chapter-content-str',
    },
    { // https://www.hongshu.com
      siteName: '红薯中文网',
      url: '://www.hongshu.com/bookreader/\\d+/',
      chapterUrl: '://www.hongshu.com/content/\\d+/\\d+-\\d+.html',
      infoPage: () => `https://www.hongshu.com/book/${window.location.href.match(/\d+/)[0]}/`,
      title: 'h1>a',
      writer: '.txinfor>.right [href*="userspace"]',
      intro: '.intro',
      cover: '.fm>img',
      chapter: '.columns>li>a',
      vipChapter: '.columns>li:has(.vip)>a',
      deal: async (chapter) => {
        const urlArr = chapter.url.split(/\/|-|\./);
        const res1 = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `${window.location.protocol}//www.hongshu.com/bookajax.do`,
            method: 'POST',
            data: `method=getchptkey&bid=${urlArr[6]}&cid=${urlArr[8]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                resolve(json);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `${window.location.protocol}//www.hongshu.com/bookajax.do`,
            method: 'POST',
            data: `method=getchpcontent&bid=${urlArr[6]}&jid=${urlArr[7]}&cid=${urlArr[8]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const title = json.chptitle;
                let { content } = json;
                content = unsafeWindow.utf8to16(unsafeWindow.hs_decrypt(unsafeWindow.base64decode(content), res1.key));
                // const other = unsafeWindow.utf8to16(unsafeWindow.hs_decrypt(unsafeWindow.base64decode(json.other), res1.key)); // 标点符号及常用字使用js生成的stylesheet显示
                resolve({ title, content });
              } catch (error) {
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // http://www.qwsy.com
      siteName: '蔷薇书院',
      url: '://www.qwsy.com/mulu/\\d+.html',
      chapterUrl: '://www.qwsy.com/read.aspx\\?cid=\\d+',
      infoPage: '.readtop_nav>.fl>a:nth-child(4)',
      title: '.title_h1',
      writer: '.aAuthorLink',
      intro: '#div_jj2>p',
      cover: '.zpdfmpic>img',
      chapter: '.td_con>a',
      vipChapter: '.td_con:has(span[style="color:#ff0000;"])>a',
      deal: async (chapter) => {
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `http://script.qwsy.com/html/js/${chapter.url.replace('http://www.qwsy.com/read.aspx?cid=', '')}.js`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const content = res.responseText.match(/document.write\("(.*)"\);/)[1];
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
      elementRemove: 'font,br',
    },
    { // http://www.shulink.com
      siteName: '书连',
      url: '://vip.shulink.com(/files/article)?/html/\\d+/\\d+/index.*?.html.*',
      chapterUrl: '://vip.shulink.com(/files/article)?/html/\\d+/\\d+/\\d+.html',
      infoPage: 'a:contains("返回书页")',
      title: 'span[style*="color:red"]',
      writer: 'div[style*="float:right"] a[href^="/author"]',
      intro: '.tabvalue>div',
      cover: '.divbox img',
      chapter: '.index>dd>a',
      vipChapter: '.index>dd:has(em)>a',
      chapterTitle: '.atitle',
      content: '#acontent',
      elementRemove: 'div',
      contentReplace: [
        [/作者.*?提醒.*/, ''],
      ],
    },
    { // http://www.soudu.net http://www.wjsw.com/
      siteName: '搜读网',
      url: '://www.(soudu.net|wjsw.com)/html/\\d+/\\d+/index.shtml',
      chapterUrl: '://www.(soudu.net|wjsw.com)/html/\\d+/\\d+/\\d+.shtml',
      infoPage: '.myPlace >a:nth-child(7)',
      title: 'h1',
      writer: '.c>a+a+span',
      intro: '#aboutBook',
      cover: 'img[onerror]',
      chapter: '.list>li>a',
      vipChapter: '.list>li:has(span.r_red)>a',
      chapterTitle: 'h1',
      content: '#content',
      elementRemove: 'div',
    },
    { // http://www.fbook.net
      siteName: '天下书盟',
      url: '://www.fbook.net/list/\\d+',
      chapterUrl: '://www.fbook.net/read/\\d+',
      infoPage: '[class$="crumb"] a[href*="/book/"]',
      title: 'h1',
      intro: 'h1+div+div',
      cover: '.c_img>img',
      chapter: '.mb_content a',
      vipChapter: '.mb_content a:has(span:contains("VIP"))',
      volume: '.mb_content>li[style]',
      chapterTitle: '[itemprop="headline"]',
      content: '[itemprop="acticleBody"]',
    },
    { // https://book.tiexue.net
      siteName: '铁血读书',
      url: '://book.tiexue.net/Book\\d+/list.html',
      chapterUrl: '://book.tiexue.net/Book\\d+/Content\\d+.html',
      infoPage: '.positions>a:nth-child(5)',
      title: '.normaltitle>span',
      writer: '[href^="/FriendCenter.aspx"]>u',
      intro: '.bookPrdt >p',
      cover: '.li_01 img',
      chapter: '.list01>li>p a',
      vipChapter: '.list01>li>p>span>a',
      volume: '.dictry>h2',
      chapterTitle: '#contents>h1',
      content: '#mouseRight',
    },
    { // https://www.yokong.com
      siteName: '悠空网',
      url: '://www.yokong.com/book/\\d+/chapter.html',
      chapterUrl: '://www.yokong.com/book/\\d+/\\d+.html',
      infoPage: '.location>a:nth-child(6)',
      title: '.name>h1',
      writer: '.authorname>a',
      intro: '.book-intro',
      cover: '.bigpic>img',
      chapter: '.chapter-list>li>span>a',
      vipChapter: '.chapter-list>li>span:has(.vip-icon)>a',
      volume: '.chapter-bd>h2',
      chapterTitle: 'h1',
      content: '.article-con',
      contentReplace: [
        ['请记住本站：.*'],
        ['微信公众号：.*'],
      ],
    },
    { // https://www.chuangbie.com
      siteName: '创别书城',
      url: '://www.chuangbie.com/book/catalog/book_id/\\d+.html',
      chapterUrl: '://www.chuangbie.com/book/read\\?book_id=\\d+&chapter_id=\\d+',
      title: '.con_02',
      writer: '.con_03>span',
      chapter: '.con_05 a',
      vipChapter: '.con_05 li:has(img)>a',
      volume: '.con_05>.bt',
      deal: async (chapter) => {
        const info = chapter.url.match(/\d+/g);
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `https://www.chuangbie.com/book/load_chapter_content?book_id=${info[0]}&chapter_id=${info[1]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = unsafeWindow.strdecode(res.responseText);
                const content = json.content.chapter_content;
                const title = json.content.chapter_name;
                if (!Storage.book.title) Storage.book.title = json.content.book_name;
                if (!Storage.book.cover) Storage.book.cover = json.content.book_cover;
                if (!Storage.book.writer) Storage.book.writer = json.content.author_name;
                if (!Storage.book.intro) Storage.book.intro = json.content.descriotion;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // https://www.msxf.cn/
      siteName: '陌上香坊',
      url: '://www.msxf.cn/book/\\d+/chapter.html',
      chapterUrl: '://www.msxf.cn/book/\\d+/\\d+.html',
      infoPage: '[href*="/book/"][href$="index.html"]',
      title: '.title>a',
      writer: '.aInfo>.name>a',
      intro: '.intro',
      cover: '.pIntroduce .pic img',
      chapter: '.chapter-list li>a',
      vipChapter: '.chapter-list li:has(.vipico)>a',
      chapterTitle: '.article-title',
      content: '#article-content-body',
      elementRemove: 'p:contains("www.msxf.cn")',
    },
    { // https://www.lajixs.com/
      siteName: '辣鸡小说',
      url: '://www.lajixs.com/book/\\d+',
      chapterUrl: '://www.lajixs.com/chapter/\\d+',
      title: '.b-title>strong',
      writer: '.b-info>p>span>a',
      intro: '.bookIntro>.text',
      cover: '.cover',
      chapter: '.b_chapter_list a',
      vipChapter: '.b_chapter_list div:has(.zdy-icon__vip)>a',
      volume: '.el-collapse-item__header',
      deal: async (chapter) => {
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: 'https://www.lajixs.com/api/book-read',
            method: 'POST',
            data: `chapterId=${chapter.url.match(/\d+/)[0]}&readType=1`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const title = json.data.chapterInfo.bookTitle;
                const content = json.data.chapterInfo.chapterContent;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
      elementRemove: 'lg',
    },
    { // https://www.popo.tw
      siteName: 'POPO原創市集',
      url: '://www.popo.tw/books/\\d+/articles(\\?page=\\d+)?$',
      chapterUrl: '://www.popo.tw/books/\\d+/articles/\\d+',
      title: '.booksdetail .title',
      writer: '.b_author>a',
      intro: '.book_intro',
      cover: '.cover-b',
      chapter: '.list-view .c2>a',
      chapterTitle: '.read-txt>h2',
      content: '.read-txt',
      getChapters: (doc) => Rule.special.find((i) => i.siteName === 'PO18臉紅心跳').getChapters(doc),
      elementRemove: 'blockquote',
    },
    { // https://www.po18.tw/
      siteName: 'PO18臉紅心跳',
      url: '://www.po18.tw/books/\\d+/articles(\\?page=\\d+)?$',
      chapterUrl: '://www.po18.tw/books/\\d+/articles/\\d+',
      title: '.book_name',
      writer: '.book_author',
      cover: '.book_cover>img',
      chapter: '.list-view .l_chaptname>a',
      deal: async (chapter) => {
        const urlArr = chapter.url.split('/');
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `${window.location.origin}/books/${urlArr[4]}/articlescontent/${urlArr[6]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                resolve(res.responseText);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
      getChapters: async (doc) => {
        const urlArr = window.location.href.split('/');
        const res = await xhr.sync(`${window.location.origin}/books/${urlArr[4]}/allarticles`, null, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            Referer: window.location.href,
            'X-Requested-With': 'XMLHttpRequest',
          },
          responseType: 'document',
        });
        return $('a', res.response).toArray().map((i) => ({
          title: $(i).text(),
          url: $(i).prop('href'),
          vip: $(i).is(':has(img)'),
        }));
      },
      elementRemove: 'blockquote',
    },
    { // https://www.qidian.com.tw/
      siteName: '起点台湾',
      url: '://www.qidian.com.tw/books/\\d+/volumes',
      chapterUrl: '://www.qidian.com.tw/books/\\d+/articles/\\d+',
      infoPage: '.breadcrumb>a:nth-child(3)',
      title: 'h1',
      writer: 'h1+.bm',
      intro: '#dot1',
      cover: '.imgbc-b>img',
      chapter: '.chapter>a',
      vipChapter: '.chapter.pay>a',
      volume: '.chapter-list-all>ul>li.TITLE',
      chapterTitle: 'h1',
      content: '.box-text dd',
    },
    { // https://www.linovel.net/
      siteName: '轻之文库',
      url: '://www.linovel.net/book/\\d+.html',
      chapterUrl: '://www.linovel.net/book/\\d+/\\d+.html',
      title: '.book-title',
      writer: '.author-frame .name>a',
      intro: '.about-text',
      cover: '.book-cover img',
      chapter: '.chapter a',
      volume: '.volume-title>a',
      chapterTitle: '.article-title',
      content: '.article-text',
    },
    { // https://www.gongzicp.com/
      siteName: '长佩文学网',
      url: '://www.gongzicp.com/novel-\\d+.html',
      chapterUrl: '://www.gongzicp.com/read-\\d+.html',
      title: '.info-right .name',
      writer: '.author-name',
      intro: '.info-text>.content',
      cover: '.cover>img',
      chapterTitle: '.title>.name',
      popup: async () => waitFor(() => $('.cp-reader .content>p:not(.watermark)').length, 5 * 1000),
      content: '.cp-reader .content',
      elementRemove: '.cp-hidden,.watermark',
      thread: 1,
      getChapters: async (doc) => {
        const info = window.location.href.match(/\/(novel|read)-(\d+)/);
        const res = await xhr.sync(`https://webapi.gongzicp.com/novel/novelGetInfo?id=${info[2]}`);
        const json = JSON.parse(res.responseText);
        const chapters = [];
        let volume = '';
        for (let i = 0; i < json.data.chapterList.length; i++) {
          if (json.data.chapterList[i].type === 'volume') {
            volume = json.data.chapterList[i].name;
          } else if (json.data.chapterList[i].type === 'item') {
            chapters.push({
              title: json.data.chapterList[i].name,
              url: `https://www.gongzicp.com/read-${json.data.chapterList[i].id}.html`,
              vip: json.data.chapterList[i].pay,
              volume,
            });
          }
        }
        return chapters;
      },
    },
    { // https://sosad.fun/
      siteName: 'SosadFun|废文',
      url: '://(sosad.fun|xn--pxtr7m.com|xn--pxtr7m5ny.com)/threads/\\d+/(profile|chapter_index)',
      chapterUrl: '://(sosad.fun|xn--pxtr7m.com|xn--pxtr7m5ny.com)/posts/\\d+',
      title: '.font-1',
      writer: '.h5 a[href*="/users/"]',
      intro: '.article-body .main-text',
      chapter: '.panel-body .table th:nth-child(1)>a[href*="/posts/"]',
      chapterTitle: 'strong.h3',
      content: '.post-body>.main-text:nth-child(1)',
      elementRemove: 'div:last-child,.hidden',
    },
    { // https://www.myhtlmebook.com/ https://www.myhtebooks.com/ https://www.haitbook.com/
      siteName: '海棠文化线上文学城',
      filter: () => {
        if ($('.title>a>img[alt="海棠文化线上文学城"]').length) {
          if (window.location.search.match('\\?act=showinfo&bookwritercode=.*?&bookid=')) {
            return 1;
          } if (window.location.search.match('\\?act=showpaper&paperid=')) {
            return 2;
          }
        }
      },
      // url: '(myhtlmebook|myhtebooks?|urhtbooks|haitbook).com/\\?act=showinfo&bookwritercode=.*?&bookid=',
      // chapterUrl: '(myhtlmebook|myhtebooks?|urhtbooks|haitbook).com/\\?act=showpaper&paperid=',
      title: '#mypages .uk-card h4',
      writer: '#writerinfos>a',
      chapter: '.uk-list>li>a[href^="/?act=showpaper&paperid="]',
      vipChapter: '.uk-list>li:not(:contains("免費"))>a[href^="/?act=showpaper&paperid="]',
      volume: '.uk-list>li:not(:has(a[href^="/?act=showpaper&paperid="])):has(b>font)',
      chapterTitle: '.uk-card-title',
      content: async (doc, res, request) => {
        const writersay = $('#colorpanelwritersay', res.responseText).html();
        let egg;
        if ($('[id^="eggsarea"]+[uk-icon="commenting"]', res.responseText).length) {
          const paperid = $('[id^="eggsarea"]', res.responseText).attr('id').match(/^eggsarea(.*)$/)[1];
          const bookwritercode = $('[uk-icon="list"]', res.responseText).attr('href').match(/bookwritercode=(.*?)($|&)/)[1];
          const bookid = $('[uk-icon="list"]', res.responseText).attr('href').match(/bookid=(.*?)($|&)/)[1];
          const msgs = ['q', '敲', '\ud83e\udd5a'];
          await new Promise((resolve, reject) => {
            xhr.add({
              method: 'POST',
              url: `${window.location.origin}/papergbookresave.php`,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Referer: request.raw.url,
                'X-Requested-With': 'XMLHttpRequest',
              },
              data: `paperid=${paperid}&bookwritercode=${bookwritercode}&bookid=${bookid}&repapergbookid=0&papergbookpage=1&repostmsgtxt=${msgs[Math.floor(Math.random() * msgs.length)]}&postmode=1&giftid=0`,
              onload(res) {
                resolve(res);
              },
            }, null, 0, true);
          });

          const res2 = await new Promise((resolve, reject) => {
            xhr.add({
              method: 'POST',
              url: `${window.location.origin}/showpapereggs.php`,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                Referer: request.raw.url,
                'X-Requested-With': 'XMLHttpRequest',
              },
              data: `paperid=${paperid}&bookwritercode=${bookwritercode}`,
              onload(res) {
                resolve(res);
              },
            }, null, 0, true);
          });
          egg = res2.responseText;
          if (egg.includes('#gopapergbook')) {
            egg = '彩蛋加载失败';
          }
        } else {
          egg = $('[id^="eggsarea"]', res.responseText).html();
        }

        const content = await new Promise((resolve, reject) => {
          const [, paperid, vercodechk] = res.responseText.match(/data: { paperid: '(\d+)', vercodechk: '(.*?)'},/);
          xhr.add({
            chapter: request.raw,
            url: '/showpapercolor.php',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: request.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            data: `paperid=${paperid}&vercodechk=${vercodechk}`,
            onload(res, request) {
              try {
                const content = res.responseText;
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content + (writersay ? `${writersay}<br>---<br>以下正文` : '') + (egg ? `<br>---<br>彩蛋內容：<br>${egg}` : '');
      },
      getChapters: async (doc) => {
        const id = window.location.href.match(/bookid=(.*?)($|&)/)[1];
        const chapters = [];
        let pages = 1;
        while (true) {
          const res = await xhr.sync(`${window.location.origin}/showbooklist.php`, `ebookid=${id}&pages=${pages}&showbooklisttype=1`, {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: window.location.href,
              'X-Requested-With': 'XMLHttpRequest',
            },
            responseType: 'document',
          });
          chapters.push(...$('.uk-list>li>a[href^="/?act=showpaper&paperid="]', res.response).toArray().map((i) => ({
            title: $(i).text(),
            url: $(i).prop('href'),
            vip: $(i).is('.uk-list>li:not(:contains("免費"))>a[href^="/?act=showpaper&paperid="]'),
            volume: $(i).parent().prevAll('.uk-list>li:not(:has(a[href^="/?act=showpaper&paperid="])):has(b>font)').eq(0)
              .text(),
          })));
          if ($('.uk-list>li:has([onclick^="showbooklistpage"])', res.response).length && $('.uk-list>li:has([onclick^="showbooklistpage"])', res.response).eq(0).find('font:has(b)').next('a').length) {
            pages++;
          } else {
            break;
          }
        }
        return chapters;
      },
    },
    { // https://www.doufu.la/
      siteName: '豆腐',
      url: '://www.doufu.la/novel-',
      chapterUrl: '://www.doufu.la/chapter/',
      title: 'h1.book_tt>a',
      writer: '.book_author',
      intro: '.book_des',
      cover: '.book_img',
      chapter: '.catelogue a',
      vipChapter: '.catelogue .list_item:has([class*="icon-lock"])>a',
      chapterTitle: '.chapter_tt',
      content: async (doc, res, request) => {
        const chapter = request.raw;
        const token = $(res.responseText).toArray().find((i) => i.tagName === 'META' && i.name === 'csrf-token').content; // same as XSRF-TOKEN<cookie>
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `https://www.doufu.la/novel/getChapter/${chapter.url.split('/')[4]}`,
            method: 'POST',
            headers: {
              Referer: chapter.url,
              'x-csrf-token': token,
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const { content } = json;
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
      elementRemove: '.hidden',
      thread: 1,
    },
    { // https://www.youdubook.com/ https://www.xrzww.com/
      siteName: '有毒小说网/息壤中文网',
      url: '://www.(youdubook|xrzww).com/bookdetail/\\d+',
      title: '.novel_name>span',
      writer: '.novel_author>span:nth-child(1)',
      intro: '.novel_text',
      cover: '.bookcover',
      getChapters: async (doc) => {
        const urlArr = window.location.href.split('/');

        const res = await xhr.sync(`${window.location.origin.replace('www', 'pre-api')}/api/directoryList?nid=${urlArr[4]}&orderBy=0`);
        const json = JSON.parse(res.responseText);
        const chapters = json.data.data;
        const volumes = json.data.volume;
        return chapters.sort((a, b) => Math.sign(volumes.find((i) => i.volume_id === a.chapter_vid).volume_order - volumes.find((i) => i.volume_id === b.chapter_vid).volume_order)).map((i) => ({
          url: `${window.location.origin.replace('www', 'pre-api')}/api/readNew?nid=${urlArr[4]}&vid=${i.chapter_vid}&chapter_id=${i.chapter_id}&chapter_order=${i.chapter_order}&showpic=false`,
          title: i.chapter_name,
          vip: i.chapter_ispay,
          volume: volumes.find((j) => j.volume_id === i.chapter_vid).volume_name,
        }));
      },
      content: (doc, res, request) => JSON.parse(res.response).data.content,
    },
    { // https://www.ireader.com/
      siteName: '掌阅书城',
      url: '://www.ireader.com/index.php\\?ca=bookdetail.index&bid=\\d+$',
      chapterUrl: ':https://www.ireader.com/index.php\\?ca=Chapter.Index&pca=bookdetail.index&bid=\\d+&cid=\\d+',
      title: '.bookname>h2>a',
      writer: '.bookInfor .author',
      intro: '.bookinf03>p',
      cover: '.bookInfor>div>a>img',
      chapterTitle: '.content h2',
      content: '.content>.article',
      getChapters: async (doc) => {
        const bid = window.location.search.match(/&bid=(\d+)(&|$)/)[1];
        const chapters = [];
        let page = 0;
        let total = 0;
        while ((page = page + 1)) {
          const res = await xhr.sync(`${window.location.origin}/index.php?ca=Chapter.List&ajax=1&bid=${bid}&page=${page}&pageSize=100`);
          const json = JSON.parse(res.responseText);
          for (const i of json.list) {
            chapters.push({
              title: i.chapterName,
              url: `https://www.ireader.com/index.php?ca=Chapter.Index&pca=Chapter.Index&bid=${bid}&cid=${i.id}`,
              vip: i.priceTag === '收费',
            });
          }
          if (json.list[chapters.length - 1].priceTag === '收费') break;
          total = total + json.list.length;
          if (total >= json.page.total) break;
        }
        return chapters;
      },
    },
    { // https://read.douban.com/
      siteName: '豆瓣阅读',
      url: '://read.douban.com/column/\\d+/',
      chapterUrl: '://read.douban.com/reader/column/\\d+/chapter/\\d+/',
      title: '.title[itemprop="name"]',
      writer: '.name[itemprop="name"]',
      intro: '.intro',
      cover: () => $('[property="og:image"]').attr('content'),
      getChapters: async (doc) => {
        const id = window.location.href.split('/')[4];
        const chapters = [];
        while (true) {
          const res = await xhr.sync(`https://read.douban.com/j/column_v2/${id}/chapters?start=0&limit=100&latestFirst=0`);
          const json = JSON.parse(res.responseText);
          for (const item of json.list) {
            chapters.push({
              title: item.title,
              url: `${window.location.origin}${item.links.reader}`,
              vip: !item.isPurchased && item.price,
            });
          }
          if (chapters.length >= json.total) break;
        }
        return chapters;
      },
      fns: {
        cookieGet(e) {
          const t = document.cookie.match(new RegExp(`(?:\\s|^)${e}\\=([^;]*)`));
          return t ? decodeURIComponent(t[1]) : null;
        },
        decrypt: async function test(t) {
          const { cookieGet } = Rule.special.find((i) => i.siteName === '豆瓣阅读').fns;
          const e = Uint8Array.from(window.atob(t), (t) => t.charCodeAt(0));
          const i = e.buffer;
          const d = e.length - 16 - 13;
          const p = new Uint8Array(i, d, 16);
          const f = new Uint8Array(i, 0, d);
          const g = {
            name: 'AES-CBC',
            iv: p,
          };
          return (function () {
            const t = unsafeWindow.Ark.user;
            const e = t.isAnonymous ? cookieGet('bid') : t.id;
            const i = (new TextEncoder()).encode(e);
            return window.crypto.subtle.digest('SHA-256', i).then((t) => window.crypto.subtle.importKey('raw', t, 'AES-CBC', !0, ['decrypt']));
          }()).then((t) => window.crypto.subtle.decrypt(g, t, f)).then((t) => JSON.parse((new TextDecoder()).decode(t)));
        },

      },
      deal: async (chapter) => {
        const aid = chapter.url.match('read.douban.com/reader/column') ? chapter.url.split('/')[7] : chapter.url.split('/')[5];
        let content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `${window.location.origin}/j/article_v2/get_reader_data`,
            method: 'POST',
            data: `aid=${aid}&reader_data_version=${window.localStorage.getItem('readerDataVersion')}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                resolve(json.data);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        if (content) {
          const json = await Rule.special.find((i) => i.siteName === '豆瓣阅读').fns.decrypt(content);
          content = {
            content: chapter.url.match('read.douban.com/reader/column') ? json.posts[0].contents.filter((i) => i.data && i.data.text).map((i) => i.data.text).flat().map((i) => i.content)
              .join('\n') : json.posts[0].contents.filter((i) => i.data && i.data.text).map((i) => (i.type === 'headline' ? '\n' : '') + i.data.text).join('\n'),
            title: json.posts[0].title,
          };
        }
        return content;
      },
    },
    { // https://read.douban.com/ebook
      siteName: '豆瓣阅读Ebook',
      url: '://read.douban.com/ebook/\\d+/',
      chapterUrl: '://read.douban.com/reader/ebook/\\d+/',
      title: '.article-title[itemprop="name"]',
      writer: '.author-item',
      intro: '[itemprop="description"]>.info',
      cover: '.cover>[itemprop="image"]',
      chapter: '.btn-read',
      deal: async (chapter) => Rule.special.find((i) => i.siteName === '豆瓣阅读').deal(chapter),
    },
    // 轻小说
    { // https://www.wenku8.net
      siteName: '轻小说文库',
      url: /wenku8.(net|com)\/novel\/.*?\/(index\.htm)?$/,
      chapterUrl: /wenku8.(net|com)\/novel\/.*?\/\d+\.htm/,
      infoPage: 'a:contains("返回书页")',
      title: 'span>b',
      writer: '#content td:contains("小说作者"):last',
      intro: 'span:contains("内容简介")+br+span',
      cover: 'img[src*="img.wenku8.com"]',
      chapter: '.css>tbody>tr>td>a',
      volume: '.vcss',
      chapterTitle: '#title',
      content: '#content',
    },
    { // https://book.sfacg.com
      siteName: 'SF轻小说',
      url: '://book.sfacg.com/Novel/\\d+/MainIndex/',
      chapterUrl: '://book.sfacg.com/Novel/\\d+/\\d+/\\d+/|://book.sfacg.com/vip/c/\\d+/',
      infoPage: '.crumbs a:nth-child(6)',
      title: 'h1.title>.text',
      writer: '.author-name',
      intro: '.introduce',
      cover: '.summary-pic>img',
      chapter: '.catalog-list>ul>li>a',
      vipChapter: '.catalog-list>ul>li>a:has(.icn_vip)',
      volume: '.catalog-title',
      chapterTitle: '.article-title',
      content: '#ChapterBody',
      vip: {
        deal: async (chapter) => `<img src="http://book.sfacg.com/ajax/ashx/common.ashx?op=getChapPic&tp=true&quick=true&cid=${chapter.url.split('/')[5]}&nid=${window.location.href.split('/')[4]}&font=16&lang=&w=728">`,
      },
    },
    { // https://www.qinxiaoshuo.com/
      siteName: '亲小说网',
      url: '://www.qinxiaoshuo.com/book/.*?',
      chapterUrl: '://www.qinxiaoshuo.com/read/\\d+/\\d+/.*?.html',
      title: 'h1',
      writer: '.info_item>div>a',
      intro: '.intro',
      cover: '.show_info>img',
      chapter: '.chapter>a',
      volume: '.volume_title>span',
      chapterTitle: '.c_title+.c_title>h3',
      content: '#chapter_content',
    },
    { // https://www.linovelib.com/
      siteName: '轻小说文库(linovelib.com)',
      url: '://www.linovelib.com/novel/\\d+/catalog',
      chapterUrl: '://www.linovelib.com/novel/\\d+/\\d+(_\\d+)?.html',
      infoPage: '.crumb>a:nth-child(3)',
      title: '.book-name',
      writer: '.au-name>a',
      intro: '.book-dec>p',
      cover: '.book-img>img',
      chapter: '.chapter-list a',
      volume: '.volume',
      chapterTitle: '#mlfy_main_text>h1',
      content: '.read-content',
    },
    { // https://www.esjzone.cc/
      siteName: 'ESJ Zone',
      url: '://(www.)?esjzone.cc/detail/\\d+.html',
      chapterUrl: '://(www.)?esjzone.cc/forum/\\d+/\\d+.html',
      title: 'h2',
      writer: '.book-detail a[href^="/tags/"]',
      intro: '.description',
      cover: '.product-gallery img',
      chapter: '#chapterList a',
      volume: '#chapterList details summary, #chapterList strong:has(br)',
      chapterTitle: 'h2',
      content: '.forum-content',
    },
    { // https://www.esjzone.cc/forum/ 论坛
      siteName: 'ESJ Zone 论坛',
      url: '://www.esjzone.cc/forum/\\d+',
      chapterUrl: '://www.esjzone.cc/forum/\\d+/\\d+.html',
      title: 'h2',
      writer: '.book-detail a[href^="/tags/"]',
      intro: '.description',
      cover: '.product-gallery img',
      chapter: '.forum-list a',
      chapterTitle: 'h2',
      content: '.forum-content',
    },
    { // http://www.shencou.com/
      siteName: '神凑小说网',
      url: '://www.shencou.com/read/\\d+/\\d+/index.html',
      chapterUrl: '://www.shencou.com/read/\\d+/\\d+/\\d+.html',
      infoPage: '[href*="books/read_"]',
      title: 'span>a',
      writer: '#content td:contains("小说作者"):nochild',
      intro: '[width="80%"]:last',
      cover: 'img[src*="www.shencou.com/files"]',
      chapter: '.zjlist4 a',
      volume: '.ttname>h2',
      chapterTitle: '>h1',
      content: 'body',
      elementRemove: 'div,script,center',
    },
    { // http://book.suixw.com
      siteName: '随想轻小说',
      url: '://book.suixw.com/modules/article/reader.php\\?aid=\\d+',
      chapterUrl: '://book.suixw.com/modules/article/reader.php\\?aid=\\d+&cid=\\d+',
      infoPage: 'a:contains("返回书页")',
      title: 'span[style]',
      writer: '#content td:contains("小说作者"):nochild',
      intro: '#content td:has(.hottext):last',
      cover: 'img[src*="book.suixw.com"]',
      chapter: '.ccss>a',
      volume: '.vcss',
      chapterTitle: '#title',
      content: '#content',
      contentReplace: [
        [/pic.wenku8.com/g, 'picture.wenku8.com'],
      ],
    },
    { // https://colorful-fantasybooks.com/
      siteName: '繽紛幻想',
      url: '://colorful-fantasybooks.com/module/novel/info.php\\?tid=\\d+&nid=\\d+',
      chapterUrl: '://colorful-fantasybooks.com/module/novel/read.php\\?tid=\\d+&nid=\\d+&cid=\\d+',
      title: '.works-intro-title>strong',
      writer: '.works-author-name',
      intro: 'works-intro-short',
      cover: '.works-cover>img',
      chapter: '.works-chapter-item>a',
      volume: '.vloume',
      chapterTitle: '#content>h2',
      content: '.content',
    },
    { // https://www.lightnovel.us/
      siteName: '轻之国度',
      url: '://www.lightnovel.us(/cn)?/search\\?kw=',
      chapterUrl: '://www.lightnovel.us(/cn)?/detail/\\d+',
      title: () => $('.search-input').val() || $('.article-title').text(),
      titleReplace: [[/^\[.*?\]([^[\]])/, '$1'], [/([^[\]])\[.*?\]$/, '$1']],
      cover: () => $('.long-item>a>div.cover').css('background-image').match(/url\("?(.*?)"?\)/)[1],
      chapter: '.long-item>.info>a',
      chapterTitle: '.article-title',
      content: (doc, res, request) => {
        const contentRaw = $('#article-main-contents', res.responseText).html();
        const content = contentRaw.replace(/^(<br>)+/, '').split(/<div.*?>.*?<\/div>|(<br>\s*){3,}/).map((i) => i && i.replace(/^(\s*|<br>)+/, '')).filter((i) => i);
        Storage.book.chapters.splice(Storage.book.chapters.indexOf(request.raw), 1, ...content.map((item, index) => ({
          title: `${request.raw.title} - 第${String(index + 1)}部分`,
          url: request.raw.url,
          content: item,
          contentRaw: item,
          document: res.responseText,
        })));
      },
    },
    { // https://www.lightnovel.us/
      siteName: '轻之国度',
      url: '://www.lightnovel.us(/cn)?/series',
      chapterUrl: '://www.lightnovel.us(/cn)?/detail/\\d+',
      title: () => unsafeWindow.__NUXT__.data[0].series.name,
      writer: () => unsafeWindow.__NUXT__.data[0].series.author,
      intro: () => unsafeWindow.__NUXT__.data[0].series.intro,
      cover: () => unsafeWindow.__NUXT__.data[0].series.cover,
      getChapters: () => window.__NUXT__.data[0].series.articles.sort((a, b) => a.aid - b.aid).map((i) => ({ title: i.title, url: `https://www.lightnovel.us/detail/${i.aid}` })),
      chapterTitle: '.article-title',
      content: (doc, res, request) => Rule.special.find((i) => i.siteName === '轻之国度').content(doc, res, request),
    },
    { // https://ncode.syosetu.com/
      siteName: '小説家になろう',
      url: '://ncode.syosetu.com/n\\d+[a-z]{2}(/#main)?',
      chapterUrl: '://ncode.syosetu.com/n\\d+[a-z]{2}/\\d+/',
      title: '.novel_title',
      writer: '.novel_writername>a',
      intro: '#novel_ex',
      chapter: '.index_box>dl>dd>a',
      chapterTitle: '.novel_subtitle',
      content: (doc, res, request) => {
        const content = $('#novel_honbun', res.responseText).html();
        const authorSays = $('#novel_a', res.responseText).html();
        return content + '-'.repeat(20) + authorSays;
      },
    },
    { // https://www.wattpad.com/
      siteName: 'Wattpad',
      url: '://www.wattpad.com/story/\\d+-',
      chapterUrl: '://www.wattpad.com/\\d+-',
      title: '.story-info__title',
      writer: '.author-info__username>a',
      intro: '.description>pre',
      cover: '.story-cover>img',
      chapter: '.story-parts__part',
      chapterTitle: '.panel-reading>h1.h2',
      content: '.part-content .page>div>pre',
      chapterPrev: (doc, res, request) => $('.table-of-contents>li.active', res.responseText).prevAll().find('a').toArray()
        .map((i) => i.href)
        .reverse(),
      chapterNext: (doc, res, request) => $('.table-of-contents>li.active', res.responseText).nextAll().find('a').toArray()
        .map((i) => i.href),
    },
    { // http://xs.kdays.net/index
      siteName: '萌文库',
      url: '://xs.kdays.net/book/\\d+/chapter',
      chapterUrl: '://xs.kdays.net/book/\\d+/read/\\d+',
      infoPage: '[href$="/detail"]',
      title: '.info-side>h2',
      writer: '.items>li>a[href^="/search/author"]',
      intro: '.info-side>blockquote',
      cover: '.book-detail>div>div>img',
      chapter: '#vols>div>div>ul>li>a',
      volume: '#vols>div>div>h2',
      chapterTitle: '.chapterName',
      content: 'article',
    },
    { // https://www.biquge1000.com/
      siteName: '吾的轻小说',
      url: '://www.biquge1000.com/book/\\d+.html',
      chapterUrl: '://www.biquge1000.com/book/\\d+/\\d+.html',
      title: '.bookTitle',
      writer: '.booktag>a[href*="?author"]',
      intro: '#bookIntro',
      cover: '.img-thumbnail',
      chapter: '#list-chapterAll>dl>dd>a',
      volume: '#list-chapterAll>dl>dt',
      chapterTitle: '.readTitle',
      content: '#htmlContent',
    },
    { // https://novel.crazyideal.com/
      siteName: '雷姆轻小说',
      url: '://novel.crazyideal.com/book/\\d+/',
      chapterUrl: '://novel.crazyideal.com/\\d+_\\d+/\\d+(_\\d+)?.html',
      title: '.novel_info_title>h1',
      writer: '.novel_info_title>i>a[href^="/author/"]',
      intro: '.intro',
      cover: '.novel_info_main>img',
      chapter: '#ul_all_chapters>li>a',
      chapterTitle: '.style_h1',
      content: '#article',
    },
    // 盗贴
    { // https://www.xiaoshuokan.com
      siteName: '好看小说网',
      url: '://www.xiaoshuokan.com/haokan/\\d+/index.html',
      chapterUrl: '://www.xiaoshuokan.com/haokan/\\d+/[\\d_]+.html',
      infoPage: () => `https://www.xiaoshuokan.com/haokan/${window.location.href.match(/\d+/)[0]}.html`,
      title: '.booktitle>h1',
      writer: '.bookinfo>span>a',
      intro: '.block-intro',
      cover: '.bookcover img',
      chapter: '.booklist a',
      deal: async (chapter) => {
        const urlArr = chapter.url.split(/[_/.]/);
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `https://www.xiaoshuokan.com/chapreadajax.php?siteno=${urlArr[7]}&bookid=${urlArr[8]}&chapid=${urlArr[9]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              resolve(res.responseText);
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // https://www.ggdtxt.com
      siteName: '格格党',
      url: '://www.ggdtxt.com/book/\\d+/',
      chapterUrl: '://www.ggdtxt.com/\\d+/read_\\d+.html',
      title: '.novelname>a',
      writer: '.pt-bookdetail-info [href^="/author/"]',
      intro: '.pt-bookdetail-intro',
      cover: '.pt-bookdetail-img',
      chapter: '.pt-chapter-cont~.pt-chapter-cont .pt-chapter-cont-detail a[href]',
      deal: async (chapter) => {
        const info = chapter.url.match(/\d+/g);
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `https://www.ggdtxt.com/api/novel/chapter/transcode.html?novelid=${info[0]}&chapterid=${info[1]}&page=1`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText);
                const title = json.data.chapter.name;
                const { content } = json.data.chapter;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // https://www.qiqint.com/
      siteName: '平板电子书网',
      url: '://www.qiqint.com/\\d+/$',
      chapterUrl: '://www.qiqint.com/\\d+/\\d+.html',
      title: 'h1',
      writer: '.author',
      intro: '.intro',
      cover: '.cover>img',
      chapter: '.list>dl>dd>a',
      chapterTitle: 'h1',
      content: '.content',
      elementRemove: 'div',
    },
    { // https://tw.hjwzw.com
      siteName: '黄金屋中文',
      url: 'hjwzw.com/Book/Chapter/\\d+',
      chapterUrl: 'hjwzw.com/Book/Read/\\d+,\\d+',
      title: 'h1',
      writer: '[title^="作者"]',
      chapter: '#tbchapterlist>table>tbody>tr>td>a',
      chapterTitle: 'h1',
      content: '#AllySite+div',
      elementRemove: 'a,b',
      contentReplace: [
        ['(请记|請記)住本站域名.*'],
      ],
    },
    { // http://www.5858xs.com
      siteName: '58小说网',
      url: '://www.5858xs.com/html/\\d+/\\d+/index.html',
      chapterUrl: '://www.5858xs.com/html/\\d+/\\d+/\\d+.html',
      infoPage: () => `http://www.5858xs.com/${window.location.href.split('/')[5]}.html`,
      title: 'h1>b',
      writer: '.info_a li>span',
      intro: '#info_content',
      cover: '#info_content>img',
      chapter: 'td>a[href$=".html"]',
      chapterTitle: 'h1',
      content: '#content',
      elementRemove: 'fieldset,table,div',
    },
    { // https://www.bookba8.com/
      siteName: '在线书吧',
      url: '://www.bookba8.com/mulu-\\d+-list.html',
      chapterUrl: '://www.bookba8.com/read-\\d+-chapter-\\d+.html',
      infoPage: '[href*="book-"][href*="-info.html"]',
      title: '.detail-title>h2',
      writer: '[href^="/author"]',
      intro: '.juqing>dd',
      cover: '.detail-pic>img',
      chapter: '.content>.txt-list>li>a',
      chapterTitle: 'h1',
      content: '.note',
    },
    { // http://www.quanbensw.cn/
      siteName: '全本书屋(quanbensw)',
      url: '://www.quanbensw.cn/index.php\\?s=/Home/Index/articlelist/id/\\d+.html',
      chapterUrl: '://www.quanbensw.cn/index.php\\?s=/Home/Index/info/id/\\d+.html',
      title: 'h4>strong',
      writer: 'h4+p>strong',
      intro: 'h4+p+h5',
      cover: '[alt="avatar"]',
      // chapter: '[href^="/index.php?s=/Home/Index/info/id"]',
      chapterTitle: '.content-header h1',
      content: '.article-story',
    },
    { // https://www.yooread.net/
      siteName: '悠读文学网',
      url: '://www.yooread.net/\\d+/\\d+/$',
      chapterUrl: '://www.yooread.net/\\d+/\\d+/\\d+.html',
      title: '.txt>h1',
      writer: '.wr>a',
      intro: '.last>p',
      cover: '.img>img',
      chapter: '#booklist .bookchapter+table a[href^="/"]',
      chapterTitle: 'h1',
      content: '#TextContent',
      elementRemove: 'div',
    },
    { // https://www.wanbentxt.com/
      siteName: '完本神站',
      url: '://www.wanbentxt.com/\\d+/$',
      chapterUrl: '://www.wanbentxt.com/\\d+/\\d+(_\\d+)?.html',
      title: '.detailTitle>h1',
      writer: '.writer>a',
      intro: '.detailTopMid>table>tbody>tr:nth-child(3)>td:nth-child(2)',
      cover: '.detailTopLeft>img',
      chapter: '.chapter>ul>li>a',
      chapterTitle: '.readerTitle>h2',
      content: '.readerCon',
      contentReplace: [
        [/^\s*(&nbsp;)+谨记我们的网址.*。/m],
        [/^\s*(&nbsp;)+一秒记住.*/m],
        [/^<br>(&nbsp;)+【提示】：.*?。/m],
        [/^<br>(&nbsp;)+看更多好文请搜.*/m],
        [/^<br>(&nbsp;)+《[完本神站]》.*/m],
        [/^<br>(&nbsp;)+喜欢神站记得收藏.*/m],
        [/^<br>(&nbsp;)+支持.*把本站分享那些需要的小伙伴.*/m], // eslint-disable-line no-control-regex
        [/--&gt;&gt;本章未完，点击下一页继续阅读/],
      ],
    },
    { // https://www.qiushubang.com/
      siteName: '求书帮',
      url: '://www.qiushubang.com/\\d+/$',
      chapterUrl: '://www.qiushubang.com/\\d+/\\d+(_\\d+)?.html',
      title: '.bookPhr>h2',
      writer: '.bookPhr>dl>dd:contains("作者")',
      intro: '.introCon>p',
      cover: '.bookImg>img',
      chapter: '.chapterCon>ul>li>a',
      chapterTitle: '.articleTitle>h2',
      content: '.articleCon>p:nth-child(3)',
    },
    { // https://www.lhjypx.net/ // TODO
      siteName: '笔下看书阁',
      url: '://www.lhjypx.net/(novel|other/chapters/id)/\\d+.html',
      chapterUrl: '://www.lhjypx.net/book/\\d+/\\w+.html',
      infoPage: '.breadcrumb>li:nth-child(3)>a',
      title: '.info2>h1',
      writer: '.info2>h3>a',
      intro: '.info2>div>p',
      cover: '.info1>img',
      chapter: '.list-charts [href*="/book/"],.panel-chapterlist [href*="/book/"]',
      chapterTitle: '#chaptername',
      content: '#txt',
    },
    { // http://m.yuzhaige.cc/
      siteName: '御书阁',
      url: '://m.yuzhaige.cc/\\d+/\\d+/$',
      chapterUrl: '://m.yuzhaige.cc/\\d+/\\d+/\\d+(_\\d+)?.html',
      infoPage: '.currency_head>h1>a',
      title: '.cataloginfo>h3',
      writer: '.infotype>p>a[href*="/author/"]',
      intro: '.intro>p',
      chapter: '.chapters a',
      chapterTitle: '#chaptertitle',
      content: (doc, res, request) => {
        const doc1 = new window.DOMParser().parseFromString(res.responseText, 'text/html');
        const order = window.atob(doc1.getElementsByTagName('meta')[7].getAttribute('content')).split(/[A-Z]+%/);
        const codeurl = res.responseText.match(/var codeurl="(\d+)";/)[1] * 1;
        const arrRaw = $('#content', doc1).children().toArray();
        const arr = [];
        for (let i = 0; i < order.length; i++) {
          const truth = order[i] - ((i + 1) % codeurl);
          arr[truth] = arrRaw[i];
        }
        return arr.map((i) => i.textContent);
      },
      chapterNext: '.chapterPages>a.curr~a,.p3>a',
    },
    { // https://www.ruth-tshirt.com/
      siteName: '老猫小说',
      filter: () => ($('[src="https://www.laomaoxs.com/static/image/qrcode.png"]').length && window.location.pathname.match(/\d+\.html$/) ? 1 : 0),
      // chapterUrl: '://www.ruth-tshirt.com/ruth1/\\d+/\\w+.html',
      title: ['.h1title > .shuming > a[title]', '.chapter_nav > div:first > a:last', '#header > .readNav > span > a:last', 'div[align="center"] > .border_b > a:last', '.ydselect > .weizhi > a:last', '.bdsub > .bdsite > a:last', '#sitebar > a:last', '.con_top > a:last', '.breadCrumb > a:last'].join(','),
      chapter: ['[id*="list"] a', '[class*="list"] a', '[id*="chapter"] a', '[class*="chapter"] a'].join(','),
      chapterTitle: '.chaptername',
      content: (doc, res, request) => {
        let content = $('.txt', res.responseText).html();
        const str = '的一是了我不人在他有这个上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开美总从无情己面最女但现前些所同日手又行意动';
        content = content.replace(/[\ue800-\ue863]/g, (matched) => str[matched.charCodeAt(0) - 0xe800]);
        return content;
      },
    },
    { // https://www.19826.net/
      siteName: '19826文学',
      url: '://www.19826.net/\\d+/$',
      chapterUrl: '://www.19826.net/\\d+/\\d+(_\\d+)?.html',
      title: '.bookTitle',
      writer: '.booktag>[href*="author="]',
      intro: '#bookIntro',
      cover: '.img-thumbnail',
      chapter: '#list-chapterAll .panel-chapterlist>dd>a',
      chapterTitle: '.readTitle',
      content: '.panel-readcontent>.panel-body>div[id]',
      chapterNext: async (doc, res, request) => (res.responseText.match(/url = "(.*?)";/) ? res.responseText.match(/url = "(.*?)";/)[1] : []),
    },
    { // https://www.lewenn.com/
      siteName: '乐文小说网',
      url: '://www.lewenn.com/lw\\d+/$',
      chapterUrl: '://www.lewenn.com/lw\\d+/\\d+.html',
      title: '#info>h1',
      writer: '#info>h1+p',
      intro: '#intro',
      cover: '#fmimg>img',
      chapter: '.list dd>a',
      chapterTitle: '.head_title>h2',
      iframe: true,
      content: '#content',
      elementRemove: 'script,div',
    },
    { // http://www.daomubiji.org/
      siteName: '盗墓笔记',
      url: '://www.daomubiji.org/([a-z\\d]+)?$',
      chapterUrl: '://www.daomubiji.org/\\d+.html',
      title: '.mulu>h1',
      chapter: '.panel>ul>li>span>a',
      volume: '.panel>h2',
      chapterTitle: '.bg>h1',
      content: '.bg>.content',
    },
    { // https://www.va-etong.com/
      siteName: '全本小说网',
      url: '://www.va-etong.com/xs/\\d+/$',
      chapterUrl: '://www.va-etong.com/xs/\\d+/\\d+.html',
      title: '.book-text>h1',
      writer: '.book-text>h1+span',
      intro: '.book-text>.intro',
      cover: '.book-img>a>img',
      chapter: '.cf+h3+.cf>li>a',
      chapterTitle: '.chaptername',
      content: async (doc, res, request) => {
        const ssid = res.response.match(/var ssid=(.*?);/)[1];
        const bookid = res.response.match(/bookid=(.*?);/)[1];
        const mybookid = res.response.match(/mybookid=(.*?);/)[1];
        const xid = Math.floor(mybookid / 1000);
        const chapterid = res.response.match(/chapterid=(.*?);/)[1];
        const hou = '.html';

        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter: request.raw,
            url: `${window.location.origin}/files/article/html${ssid}/${xid}/${bookid}/${chapterid}${hou}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: request.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const content = window.eval(res.responseText); // eslint-disable-line no-eval
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // https://www.shuquge.com/
      siteName: '书趣阁',
      url: '://www.shuquge.com/txt/\\d+/index.html',
      chapterUrl: '://www.shuquge.com/txt/\\d+/\\d+.html',
      title: '.info>h2',
      writer: '.info>.small>span:nth-child(1)',
      intro: '.intro',
      cover: '.cover>img',
      chapter: '.listmain>dl>dt~dt~dd>a',
      volume: '.listmain>dl>dt~dt',
      chapterTitle: '.content>h1',
      content: '#content',
      thread: 1,
      contentReplace: [['https://www.shuquge.com/.*'], ['请记住本书首发域名：www.shuquge.com。书趣阁_笔趣阁手机版阅读网址：m.shuquge.com']],
    },
    { // https://www.kuwx.net/
      siteName: '系统小说网',
      url: '://www.kuwx.net/ku/\\d+/\\d+/',
      chapterUrl: '://www.kuwx.net/ku/\\d+/\\d+/\\d+.html',
      title: '.book_inf h1',
      writer: '.book_inf .zz',
      intro: '.book_inf .jianjie+div',
      cover: '.book_cov>img',
      chapter: '#chapter>a',
      chapterTitle: '.article>h2',
      content: (doc, res, request) => $('#txt>dd', res.responseText).toArray().map((i) => [$(i).data('id'), $(i).html()]).filter((i) => i[0] !== 999)
        .sort((a, b) => a[0] - b[0])
        .map((i) => i[1])
        .join(''),
    },
    { // http://www.mhtxs.info
      siteName: '棉花糖小说网',
      url: '://www.mhtxs.info/\\d+/\\d+/',
      chapterUrl: '://www.mhtxs.info/\\d+/\\d+/\\d+.html',
      title: '.xiaoshuo>h1',
      writer: '.xiaoshuo>h6>a[href^="/author/"]',
      intro: '#intro',
      cover: '.book_cover>img',
      chapter: '.novel_list>dl>dd>a',
      chapterTitle: '.read_title>h1',
      content: '.content',
      elementRemove: '.contnew,.contnew~p',
    },
    { // https://www.69shuba.com
      siteName: '69书吧',
      url: '://(www.)?(69shuba|69xinshu|69shu).[^\\\\.]+/book/\\d+/',
      chapterUrl: '://(www.)?(69shuba|69xinshu|69shu).[^\\\\.]+/txt/\\d+/\\d+',
      infoPage: '.bread>a:nth-child(3)',
      title: '.booknav2>h1>a',
      writer: '.booknav2>h1+p>a[href*="author.php"]',
      intro: '.infolist+.navtxt>p',
      cover: '.bookimg2>img',
      chapter: '#catalog>ul>li>a',
      chapterTitle: '.txtnav>h1',
      content: '.txtnav',
      elementRemove: '.txtnav>h1,.txtnav>div',
      iframe: true,
      thread: 1,
    },
    // 18X
    { // http://www.6mxs.com/ http://www.baxianxs.com/ http://www.iqqxs.com/
      siteName: '流氓小说网',
      // url: [/6mxs.com\/novel.asp\?id=\d+/, '://www.baxianxs.com/xiaoshuo.asp\\?id=\\d+'],
      // chapterUrl: [/6mxs.com\/pages.asp\?id=\d+/, '://www.baxianxs.com/page.asp\\?id=\\d+'],
      filter: () => ($('.viewxia').length ? ($('.content').length ? 2 : 1) : 0),
      title: '.lookmc>strong',
      writer: '.zl',
      intro: '.js',
      chapter: '.mread:eq(0)>tbody>tr:gt(0) a',
      chapterTitle: 'font>strong',
      content: '[class^="l"],[class^="con"]',
      contentReplace: [
        ['<img src=".*?/([a-z]+\\d?).jpg">', '{$1}'],
        ['{ai}', '爱'],
        ['{ba}', '巴'],
        ['{bang}', '棒'],
        ['{bao}', '饱'],
        ['{bi}', '逼'],
        ['{bi2}', '屄'],
        ['{bo}', '勃'],
        ['{cao}', '操'],
        ['{cao2}', '肏'],
        ['{cha}', '插'],
        ['{chan}', '缠'],
        ['{chao}', '潮'],
        ['{chi}', '耻'],
        ['{chou}', '抽'],
        ['{chuan}', '喘'],
        ['{chuang}', '床'],
        ['{chun}', '春'],
        ['{chun2}', '唇'],
        ['{cu}', '粗'],
        ['{cuo}', '搓'],
        ['{dang}', '荡'],
        ['{dang2}', '党'],
        ['{diao}', '屌'],
        ['{dong}', '洞'],
        ['{dong2}', '胴'],
        ['{fei}', '肥'],
        ['{feng}', '缝'],
        ['{fu}', '腹'],
        ['{gan}', '感'],
        ['{gang}', '肛'],
        ['{gao}', '高'],
        ['{gao2}', '睾'],
        ['{gen}', '根'],
        ['{gong}', '宫'],
        ['{gu}', '股'],
        ['{gui}', '龟'],
        ['{gun}', '棍'],
        ['{huan}', '欢'],
        ['{ji}', '激'],
        ['{ji2}', '鸡'],
        ['{ji3}', '妓'],
        ['{jian}', '贱'],
        ['{jian2}', '奸'],
        ['{jiao}', '交'],
        ['{jin}', '禁'],
        ['{jing}', '精'],
        ['{ku}', '裤'],
        ['{kua}', '胯'],
        ['{lang}', '浪'],
        ['{liao}', '撩'],
        ['{liu}', '流'],
        ['{lou}', '露'],
        ['{lu}', '撸'],
        ['{luan}', '乱'],
        ['{luo}', '裸'],
        ['{man}', '满'],
        ['{mao}', '毛'],
        ['{mi}', '密'],
        ['{mi2}', '迷'],
        ['{min}', '敏'],
        ['{nai}', '奶'],
        ['{nen}', '嫩'],
        ['{niang}', '娘'],
        ['{niao}', '尿'],
        ['{nong}', '弄'],
        ['{nue}', '虐'],
        ['{nv}', '女'],
        ['{pen}', '喷'],
        ['{pi}', '屁'],
        ['{qi}', '骑'],
        ['{qi2}', '妻'],
        ['{qiang}', '枪'],
        ['{ri}', '日'],
        ['{rou}', '肉'],
        ['{rou2}', '揉'],
        ['{ru}', '乳'],
        ['{ru2}', '蠕'],
        ['{rui}', '蕊'],
        ['{sa2i}', '塞'],
        ['{sai}', '塞'],
        ['{sao}', '骚'],
        ['{se}', '色'],
        ['{she}', '射'],
        ['{shen}', '身'],
        ['{shi}', '湿'],
        ['{shu}', '熟'],
        ['{shuang}', '爽'],
        ['{shun}', '吮'],
        ['{tian}', '舔'],
        ['{ting}', '挺'],
        ['{tun}', '吞'],
        ['{tun2}', '臀'],
        ['{tuo}', '脱'],
        ['{wei}', '慰'],
        ['{xi}', '吸'],
        ['{xie}', '泄'],
        ['{xie2}', '邪'],
        ['{xing}', '性'],
        ['{xiong}', '胸'],
        ['{xue}', '穴'],
        ['{ya}', '压'],
        ['{yan}', '艳'],
        ['{yang}', '阳'],
        ['{yang2}', '痒'],
        ['{yao}', '腰'],
        ['{ye}', '液'],
        ['{yi}', '旖'],
        ['{yi2}', '衣'],
        ['{yin}', '阴'],
        ['{yin2}', '淫'],
        ['{yin3}', '吟'],
        ['{ying}', '迎'],
        ['{you}', '诱'],
        ['{yu}', '欲'],
        ['{zhang}', '胀'],
        ['{zuo}', '坐'],
      ],
    },
    { // http://www.22lewen.com/
      siteName: '乐文小说网',
      url: '://www.\\d+lewen.com/read/\\d+(/0)?.html',
      chapterUrl: '://www.\\d+lewen.com/read/\\d+/\\d+(_\\d+)?.html',
      title: '.book-title>h1',
      chapter: '.chapterlist>dd>a',
      chapterTitle: '#BookCon>h1',
      content: '#BookText',
    },
    { // http://www.shubao202.com/index.php http://lawen24.com/
      siteName: '书包网',
      url: ['://www.shubao202.com/book/\\d+', '://lawen24.com/txtbook/\\d+.html'],
      chapterUrl: ['://www.shubao202.com/read/\\d+/\\d+', '://lawen24.com/read/\\d+/\\d+'],
      title: 'h1',
      chapter: '.mulu a',
      chapterTitle: 'h1',
      content: '.mcc',
    },
    { // https://www.cool18.com/bbs4/index.php
      siteName: '禁忌书屋',
      filter: () => (['www.cool18.com'].includes(window.location.host) ? ($('#myform').length ? 2 : 1) : 0),
      chapterUrl: '://www.cool18.com/bbs4/index.php\\?app=forum&act=threadview&tid=\\d+',
      title: 'font>b',
      chapter: 'a:not(:contains("(无内容)"))',
      chapterTitle: 'font>b',
      content: '.show_content>pre',
      chapterPrev: '.show_content>p>a',
      chapterNext: 'body>table td>p:first+ul a:not(:contains("(无内容)")),.show_content>pre a',
      elementRemove: 'font[color*="E6E6DD"],b:contains("评分完成")',
    },
    { // http://www.7zxs.cc/
      siteName: '7z小说网',
      url: '://www.7zxs.cc/ik258/\\d+/\\d+/index.html',
      chapterUrl: '://www.7zxs.cc/ik258/\\d+/\\d+/\\d+.html',
      title: '.title>h2',
      writer: '.title>h2+span',
      chapter: '.ocon>dl>dd>a',
      chapterTitle: '.nr_title>h3',
      content: '#htmlContent',
      contentReplace: [
        ['登陆7z小说网.*'],
      ],
    },
    { // http://www.qdxiaoshuo.net/
      siteName: '青豆小说网',
      url: '://www.qdxiaoshuo.net/book/\\d+.html',
      chapterUrl: '://www.qdxiaoshuo.net/read/\\d+/\\d+.html',
      title: '.kui-left.kui-fs32',
      chapter: '.kui-item>a',
      chapterTitle: 'h1.kui-ac',
      content: '#kui-page-read-txt',
    },
    { // https://www.shushuwu8.com/
      siteName: '书书屋',
      url: '://www.shushuwu8.com/novel/\\d+/$',
      chapterUrl: '://www.shushuwu8.com/novel/\\d+/\\d+.html',
      title: '.ml_title>h1',
      writer: '.ml_title>h1+span',
      chapter: '.ml_main>dl>dd>a',
      chapterTitle: 'h2',
      content: '.yd_text2',
    },
    { // http://www.cuiweijux.com/
      siteName: '翠微居小说网',
      url: '://www.cuiweijux.com/files/article/html/\\d+/\\d+/index.html',
      chapterUrl: '://www.cuiweijux.com/files/article/html/\\d+/\\d+/\\d+.html',
      title: 'td[valign="top"]>div>span:eq(0)',
      writer: 'td[valign="top"]>div>span:eq(1)',
      intro: '.tabvalue>div:nth-child(3)',
      cover: 'img[onerror]',
      chapter: '.chapters:eq(1)>.chapter>a',
      chapterTitle: '.title',
      content: '#content',
    },
    { // http://www.4shubao.com/
      siteName: '4书包',
      url: '://www.4shubao.com/read/\\d+.html',
      chapterUrl: '://www.4shubao.com/read/\\d+/\\d+.html',
      title: 'h1',
      chapter: '.chapterlist a',
      chapterTitle: 'h1',
      content: '#BookText',
    },
    { // http://www.xitxt.net
      siteName: '喜书网',
      url: '://www.xitxt.net/book/\\d+.html',
      chapterUrl: '://www.xitxt.net/read/\\d+_\\d+.html',
      title: 'h1',
      chapter: '.list a',
      chapterTitle: 'h1',
      content: '.chapter',
      elementRemove: 'font',
    },
    { // http://www.shenshuw.com
      siteName: '神书网',
      url: '://www.shenshu.info/s\\d+/',
      chapterUrl: '://www.shenshu.info/s\\d+/\\d+.html',
      title: 'h1',
      chapter: '#chapterlist a',
      chapterTitle: 'h1',
      content: '#book_text',
    },
    { // https://www.quanshuwan.com/
      siteName: '全本书屋',
      url: '://www.quanshuwan.com/book/\\d+.aspx',
      chapterUrl: '://www.quanshuwan.com/article/\\d+.aspx',
      title: 'h1',
      writer: 'h1~p',
      intro: '#bookintroinner',
      cover: '.fm>img',
      chapter: '#readlist a',
      chapterTitle: 'h1',
      content: '#content',
      elementRemove: 'div',
    },
    { // https://www.dzwx520.com/
      siteName: '大众小说网',
      url: '://www.dzwx520.com/book_\\d+/$',
      chapterUrl: '://www.dzwx520.com/book_\\d+/\\d+.html',
      title: 'h1',
      chapter: '.book_list a',
      chapterTitle: 'h1',
      content: '#htmlContent',
      elementRemove: 'script,div',
    },
    { // http://www.mlxiaoshuo.com
      siteName: '魔龙小说网',
      url: '://www.mlxiaoshuo.com/book/.*?.html',
      chapterUrl: '://www.mlxiaoshuo.com/chapter/.*?.html',
      title: '.colorStyleTitle',
      chapter: '.zhangjieUl a',
      chapterTitle: '.colorStyleTitle',
      content: '.textP',
    },
    { // https://www.123xiaoqiang.in/
      siteName: '小强小说网',
      url: '://www.123xiaoqiang.in/\\d+/\\d+/',
      chapterUrl: '://www.123xiaoqiang.in/\\d+/\\d+/\\d+.html',
      title: 'h1',
      chapter: '.liebiao a',
      chapterTitle: 'h2',
      content: '#content',
    },
    { // http://www.haxxs8.com/
      siteName: '海岸线文学网',
      url: '://www.haxxs8.com/files/article/html/\\d+/\\d+/index.html',
      chapterUrl: '://www.haxxs8.com/files/article/html/\\d+/\\d+/\\d+.html',
      infoPage: 'a:contains("返回书页")',
      title: '.book-title>h1',
      writer: '.book-title>h1+em',
      intro: '.book-intro',
      cover: '.book-img>img',
      chapter: '.ccss a',
      chapterTitle: '#content h2',
      content: 'td[id^="content"]',
      elementRemove: 'div,span,font',
    },
    { // http://www.huaisu8.com
      siteName: '怀素吧小说',
      url: '://www.huaisu8.com/\\d+/\\d+/($|#)',
      chapterUrl: '://www.huaisu8.com/\\d+/\\d+/\\d+.html',
      title: '.info>h2',
      chapter: '.index-body .newzjlist:nth-child(4) .dirlist a',
      chapterTitle: '.play-title>h1',
      content: '.txt_tcontent',
    },
    { // https://xxread.net/
      siteName: '肉肉阅读', // 与网易云阅读相同模板
      url: '://xxread.net/book(-\\d+)?.php',
      chapterUrl: '://xxread.net/book_reader.php\\?b=\\d+&c=\\d+',
      title: '.m-bookdetail h3',
      intro: '.m-content .detail>.txt',
      chapter: '.item>a',
      deal: async (chapter) => {
        const info = chapter.url.match(/\d+/g);
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `${window.location.protocol}//xxread.net/getArticleContent.php?sourceUuid=${info[0]}&articleUuid=${info[1]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const json = JSON.parse(res.responseText.match(/(\{.*\})/)[1]);
                const content = CryptoJS.enc.Base64.parse(json.content).toString(CryptoJS.enc.Utf8);
                const title = $('h1', content).text();
                resolve({ content, title });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
            checkLoad: () => true,
          }, null, 0, true);
        });
        return content;
      },
      elementRemove: 'h1',
      getChapters: async (doc) => {
        const info = window.location.href.match(/\d+/g);
        const res = await xhr.sync(`https://xxread.net/getBook.php?b=${info[0]}`);
        const json = JSON.parse(res.responseText);
        const chapters = [];
        for (let i = 1; i < json.portions.length; i++) {
          chapters.push({
            title: json.portions[i].title,
            url: `https://xxread.net/book_reader.php?b=${info[0]}&c=${json.portions[i].id}`,
          });
        }
        return chapters;
      },
    },
    { // https://18h.mm-cg.com/novel/index.htm
      siteName: '18H',
      filter: () => ($('meta[content*="18AV"],meta[content*="18av"]').length ? (window.location.href.match(/novel_\d+.html/) ? 2 : 1) : 0),
      title: '.label>div',
      chapter: '.novel_leftright>span>a:visible',
      chapterTitle: 'h1',
      content: '#novel_content_txtsize',
    },
    { // https://hao.je51.com/ https://je51.com/
      siteName: 'je51',
      url: '://(hao.)?je51.com/st_l.en/st_did.l--.*?.html',
      chapterUrl: '://(hao.)?je51.com/st_l.en/st_did.d--.*?--\\d+.html',
      title: '.story-list-title',
      writer: '#module8>.story-cat-list .author>a',
      intro: '#module8>.story-cat-list .text',
      chapter: '.story-list .container>.autocol>a',
      chapterTitle: '#module8>.navlinks>.navtitle:last',
      content: '#story-text',
    },
    { // https://aastory.space/
      siteName: '疯情书库',
      filter: () => (document.title.match('疯情书库') && ['/archive.php', '/read.php'].includes(window.location.pathname) ? (['/archive.php'].includes(window.location.pathname) ? 1 : 2) : 0),
      // url: '://aastory.space/archive.php\\?id=\\d+',
      // chapterUrl: '://aastory.space/read.php\\?id=\\d+',
      title: '.index_title',
      writer: '.index_info>span',
      chapter: '.section_list>li>a',
      volume: '.section_title',
      chapterTitle: '.chapter_title',
      content: async (doc, res, request) => {
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter: request.raw,
            url: `${window.location.origin}/_getcontent.php?id=${request.url.match(/id=(\d+)/)[1]}&v=${res.responseText.match(/chapid\+"&v=(.*?)"/)[1]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: request.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const content = res.responseText;
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
    },
    { // https://aaread.club/ 仿起点样式
      siteName: '疯情阅读',
      url: '://aaread.club/book/\\d+',
      chapterUrl: '://aaread.club/chapter/\\d+/\\d+',
      title: 'h1>em',
      writer: '.writer',
      intro: '.intro',
      cover: '.J-getJumpUrl>img',
      chapter: '.volume>.cf>li>a',
      chapterTitle: '.j_chapterName',
      deal: async (chapter) => {
        const urlArr = chapter.url.split('/');
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `${window.location.origin}/_getcontent.php?id=${urlArr[5]}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest',
            },
            onload(res, request) {
              try {
                const content = res.responseText;
                resolve(content);
              } catch (error) {
                resolve('');
              }
            },
          }, null, 0, true);
        });
        return content;
      },
      chapterPrev: (doc) => [$('[id^="chapter-"]', doc).attr('data-purl')],
      chapterNext: (doc) => [$('[id^="chapter-"]', doc).attr('data-nurl')],
    },
  ];
  Rule.template = [ // 模板网站
    { // http://www.xbiquge.la/54/54439/
      siteName: '模板网站-笔趣阁',
      filter: () => (['.ywtop', '.nav', '.header_logo', '#wrapper', '.header_search'].every((i) => $(i).length) ? ($('#content').length ? 2 : 1) : 0),
      title: '#info>h1',
      writer: '#info>h1+p',
      intro: '#intro',
      cover: '#fmimg>img',
      chapter: '#list>dl>dd>a',
      chapterTitle: 'h1',
      content: '#content',
      elementRemove: 'a,p:empty,script',
    },
    { // https://www.biqukan.com/57_57242/
      siteName: '模板网站-笔趣阁1',
      filter: () => (['body>.ywtop', 'body>.header', 'body>.nav', 'body>.book', 'body>.listmain,body>.book.reader'].every((i) => $(i).length) ? ($('#content').length ? 2 : 1) : 0),
      title: '.info>h2',
      writer: '.info>h2+div>span:nth-child(1)',
      intro: '.intro',
      cover: '.cover>img',
      chapter: '.listmain>dl>dd+dt~dd>a',
      chapterTitle: 'h1',
      content: '#content',
      elementRemove: 'a,p:empty,script',
    },
    { // https://www.x23qb.com/book/775/
      siteName: '模板网站-铅笔小说',
      filter: () => (['#header .wrap980', '.search span.searchBox', '.tabstit', '.coverecom'].every((i) => $(i).length) ? 1 : 0),
      title: '.d_title>h1',
      writer: '.p_author>a',
      intro: '#bookintro>p',
      cover: '#bookimg>img',
      chapter: '#chapterList>li>a',
      chapterTitle: 'h1',
      content: '.read-content',
      elementRemove: 'dt,div',
    },
  ];

  if (Config.customize) {
    try {
      const ruleUser = window.eval(Config.customize); // eslint-disable-line no-eval
      Rule.special = Rule.special.concat(ruleUser);
    } catch (error) {
      console.error(error);
    }
  }

  if (window.opener && window.opener !== window && !window.menubar.visible && Object.keys(GM_getValue('popup-list', {})).includes(window.location.href)) {
    init();
    (async function () {
      const rule = GM_getValue('vip-chapter', []).includes(window.location.href) ? Storage.rule.vip : Storage.rule;
      if (typeof rule.popup === 'function') await rule.popup();
      const list = GM_getValue('popup-list', {});
      list[window.location.href] = window.document.documentElement.outerHTML;
      GM_setValue('popup-list', list);
    }());
  }

  function init() {
    if (!Storage.rule) {
      if (Config.templateRule) Rule.special = Rule.special.concat(Rule.template);
      const _href = window.location.href;
      for (const rule of Rule.special) {
        rule.url = [].concat(rule.url).filter((i) => i);
        rule.chapterUrl = [].concat(rule.chapterUrl).filter((i) => i);
        rule.ignoreUrl = [].concat(rule.ignoreUrl).filter((i) => i);
      }
      Storage.rule = Rule.special.find((i) => (i.url.some((j) => _href.match(j))) || (i.chapterUrl.some((j) => _href.match(j))) || (i.filter && i.filter()));
      if (Storage.rule) {
        if (Storage.rule.url.some((i) => _href.match(i))) {
          Storage.mode = 1;
        } else if (Storage.rule.chapterUrl.some((i) => _href.match(i))) {
          Storage.mode = 2;
        } else if (Storage.rule.filter && typeof Storage.rule.filter === 'function') {
          Storage.mode = Storage.rule.filter();
        }
        if (Storage.rule.vip) Storage.rule.vip = { ...Storage.rule, ...Storage.rule.vip || {} };
      } else {
        Storage.rule = {
          ...Rule,
          chapterTitle: Config.chapterTitle || Rule.chapterTitle,
          content: Config.content || Rule.content,
          elementRemove: Config.elementRemove || Rule.elementRemove,
          iframe: Config.iframe,
          _common: true,
        };
        if (Config.modeManual) {
          Storage.mode = window.confirm('请问这是目录页面还是章节页面？\n目录页面选择“确定”，章节页面选择“取消”') ? 1 : 2;
        } else if (Storage.rule.url.some((i) => _href.match(i))) {
          Storage.mode = 1;
        } else if (Storage.rule.chapterUrl.some((i) => _href.match(i))) {
          Storage.mode = 2;
        } else {
          Storage.mode = $(Storage.rule.content).length ? 2 : 1;
        }
      }
    }
  }

  async function showUI() {
    if ($('.novel-downloader-v3').length) {
      $('.novel-downloader-v3').toggle();
      if ($('.novel-downloader-style-chapter[media]').length) { // https://stackoverflow.com/a/54441305
        $('.novel-downloader-style-chapter[media]').attr('media', null);
      } else {
        $('.novel-downloader-style-chapter').attr('media', 'max-width: 1px');
      }
      return;
    }

    let chapters,
      chaptersArr;
    let vipChapters = [];
    const chaptersDownloaded = [];

    const issueBody = [
      `- 脚本: \`novelDownloader3 v${GM_info.script.version}\``,
      '- 类型: `Bug/建议`',
      `- 浏览器: \`${GM_info.platform ? GM_info.platform.browserName : '浏览器'} v${GM_info.platform ? GM_info.platform.browserVersion : '版本'}\``,
      `- 扩展: \`${GM_info.scriptHandler} v${GM_info.version}\``,
      '---',
      '<!-- 你的问题 -->',
    ];

    // ui
    const gif = [
      'data:image/gif;base64,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F4VMCAWtKc+rWIeAkEBLAogmDURRdEZCgwAEFCoYiKQBgCghFKGKpbrInAZPGUdJM/s2q191H7heeuBBU6pRt8iqvPBr1WENnYb0ole2FVQO3zC6mrA36t/PwToIXiQhTpOEJCg0VZwqbYkFHMvyu3iwVc3DcstGBs37I0ANhBCtstq7uMcOFCh0MM68ufPn0KNLn069uvXrs3xq3869u/fv4MOLH0++vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaOGFGGao4YYcduj/4YcghijiiCSWaOKJKKao4oostujiizDGKOOMNNZo44045qjjjjz26OOPQAYp5JBEFmnkkUgmqeSSTDbp5JNQRiklgUJMaeWAb12ppX9EbOllfkV8KSZ9Roxp5ntEqFbbmWyel2ZkbcZZXppNyWkneHQOseadfNKSpltludXnoKzQ2UABkW1A6KKL5Bkmo4w62iWki0pKKaXYZarpppx26umnoIYq6nSXlmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZr7LHIJqvsssw26+yz0EYr7bTUVmvttdhmq+223Hbr7bfghivuuOSWa+656Kar/+667Lbr7rvwxivvvPTWa++9+Oar77789uvvvwAHLPDABBds8MEIJ6zwwgw37PDDEPP3wcQUV2zxxRhnrPHGHHfs8ccghyzyyCSXbPLJKKes8sost+zyyzDHLPPMNNds880456zzzjz37PPPQAct9NBEF210ARUYrfTSTDcddAFIOy311EOrRjEpFQu1CAAXpKyBTZcEEMHE9kxMgQNWW/x1AhgjRbZNXBdAAtIcfVBU1mOTzTXVfPeN8gSrDKUL23YbcHXXEjhg9yKE59HAAF1TvIniWTd+dV1nf5D2xJg5kDjFmDGSAOQcQC733J+XTTEFEXzNyN5+xy67xncfXv852YZPjHXqkJvdO2YKUK578BZvrjbhqlcMWd4SNF67ambpovjpcwsQeAli22RA6V1jFvns4IfffOiLiK05Jnvz/r3VmFHQu938CG+25YvTorgE75sNuz13m3U3B9SbWwXyp7m8lW0CeQufAmO3iwRwTzSIG1vaagdB0SguepIjXQMisEGzoU1+mgsA7CqGQLI5LwBa6wMCGoCARhCAH2LTQADnhhbhsS6FJQDhAnfItLQ48Hp9MF/mCmc79UmOa5iJgNvaIr3iGWBynAOi2Aw3RNDVbWPR894M51aAEuyNAuZLIg/HyLfkVbCEOPQi4i6YvyxucHlWq+L8HJe70ln/4HdEIaDjvme2RTyxdxRAwBZDUAAELE5so/GD+cjISKMd0AEPXB3lKLg7Nq6PbWIMZAflqLnGZU4okJvAIkVziS8i749dO9sgQQA1xbGOiLBspCyHproGWgxrsawk/CLnvu518Gu546TxKla66H1Sft4r3inNsgrTIeEDUXslBRQAACbO8ppBq+UK34fBXK6xfiq0IvMoJ0z6ka0PhmseR0poRT6ezw+opNgghdCBAhTwcq/Bpj57pgEEcGWSDDmK8IriOj2mbJiY2d4ALPBLBYSSFVybYDwnRr2vcBFqBaAmQ7GXNwqMcJ8gDenPTsfKCswtgSJNqUqLJreSyq2eMyuNqUxHWtIPBMCko5ypTncqM6gl7QMVkNsF7MnToho1ZpEh6lFBOqoqZKAAALBAU6cRBAAh+QQFBQAuACzNAjsCRQEpAIUODxYTEycbGDcoHlAvIlE3JU4/J0xGJ0tgJUJih7Rlj8BmJ0JootdrrOJ0ja11Lk15vOx9NE2FO0eFyvOGkqSemZKiWDupX0WrYkmr5Pmz6fa0c061oH+98PW+hlTDklzG9vXHm2XP9/PT9/PZ/fno/v73+/f4+vT5+On79uD+6rz+9dL+++n///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/8CWcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter/gsHhMLpvP6LR6zW673/C4fE6v2+/4vH7P7/vDIQ1CLBgkRCEuiYqJA4ZXKgiLkgMZQiqCLSETHphEkJ1EHgqWkS6NKxEkqIYqo0MflaSOf7S1ToQekokJJYGWroQkhBMtKoudKwu8ni7Eh6AthIsJmpmgyRMXzi3JkhS8Kw4lrUIexJeHGZCTs7bu78Wu0YXPv4OFw/El5cuoCNuE/hXxdQRdMWjFKM3rRM5aqxLmMgUIoKDVAkWUSikIt28VvI+2CDXotkghIl2mhGnT90oQKg7L4m3YJoTgEGMoFU0gFLNcI/9LDci1IudxCMd0QAnFAsm0D6KR4oIptWZvnspzPR+i0hAhlrmIhxD8JDL14E0EHFAmWFBBVwJqlFRImIggwARN1WpmyKWLZtO/dThwGHmxZKW8DaWufHhWVdcQoyCRAPuqYjMhJBlVGEUZc6olWlNN1XRhYsoWHhRuBcxaj0Gro3M2ysf4V4mtkPYK6kw1matwR8PVNvr50DTGISpMDNAgbzVjlC7oUti6ehx05o6+cpYY3+KenLh1RZ1gPG+bEU/uKoEBQSxp0w0RHLrM3GgKdZcTgxWvqvX/bhiUCyjBVKUYVvuQ19F4kLhyHkKYOQATRPvRVFRLv7RigQu8KAX/gXPb8BeCWJIBaCIbAq4VU23dXVXMMcRVkg9qftnEDIc8pYLBUuK1k8lxPREyQAVi+ZjJe9K5AOGJTIZxiXTcRaIAZUNJmeAWNnKjDHAMIsBLkig1Ml9FPW2lDSTLZdTIRdSFMFaTcMYp55x01mnnnXjmqeeefPbp55+ABiqoGAGAMOihiBYRgAGGJuqooAG0wGhOlFZq6aWYZqrpppx26umnoIYq6qikjhqppG2VquqqrLbq6quwxiprpqdK2uijuOpZq6259nrnrrz6KmycwAY77LEAFmsCo8g2W52yJzDr7LRMKRuNtNRma4u112rrLS3FGiCuuLOWa+656KarVC66tQLAgaRprSvvvPTWa6+6pwIAAgHREHDvvwAHLPDAKEWqL68HxEvwwgw37PCqBhzcAggCTOzvwxhnrPHGlR4wgqQchyzyyASjIMADIpCs8rxBAAAh+QQFCAAtACzNAlECRQEnAIURDBAZDhIdHl0gIWspGjcuLlEzGCQ0NEk8PUQ8ZJtCQ0hDREhMTE5WZZBXUHZcTW1eZoVhRlhjRlx4aXN8vOaKaWaVa1mezeifxdCsdDezeC61xL23ei68fFq/3efHxKzN4OXSxqHTnWXU4+XX5OTatHzc5uHl59fn58/n59jn5+jo6Onw8PEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/8CWcEgsGo/IpHLJbDqfSxYLSq1ar9isdsvter9gpHQaLpvP6LR6zX5Ope24fE6v272mfP7O7/v/gGBkLXCBhoeIiX2DhIyKj5CRklaOhZOXkCuam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXWvCUUnSgGSAMe3N4eIkoUIREXJUcJIyshDe0VHh0XmuRCAxpE7Nf9uygS6vkTpS6JNk70tsH7JK+TBYGczolIYO/gJhEH5Z2DiHHbhIEgT3EzYIAfKIAQP3GwiNJaBxENPnLKIA7FhAkj3rUrkaBhQf8jFlfwvIevnk0Pmhq+22ShnU6hQUNK9VTCwMFsK1Z6ahlKqyau0ji0oJBNHcVOGaKuQNEgm4gJDbJS8HmWU0cOFIdafCjUZIcJQ7RhdRd3RcKpiDlxU+tVccCZQRuDfSY2SYLKSBKwHcHhG8wGJ+hqGtwxa4KhRARc4JaAaN21NMcObpi4Ns92M0mqnphhwIbHmxrL3TT52WaHSL9i6NRx8+0UaVOIhlqRk16mFz7jLj1addkiamsPfI72oAjVa4FrEi5ZPbRwRb5dPKKNrU0LFFhLR8qz+orSK7mV2gUfPEUYQhOkExV34oVEHmT2nNVSCCRVyE97KRm3EHG0nfP/2n/1NaBBfiJS0AEG00UH4loPeWUgYbgdhVA6DXQjxGXheRLABg0a59565knonnATEfejM/ClhtQ7PxFRnwHyYRWCAxMkF6FYLIEWkE3vjKjJi1rpRM9gweXYSQAI8NhjM+cJhJVXRaaXknAUHoQXYh140J9dIeKG3JclBTdWXxONQM87odXz4mL9VRaViqME0EKaazZTFUlnVbWbkHNGdWlJfkKD2Tqj0bfWhqW2wI5YJkGGET0YkUPRUi+u1Y02Y151Y6ihSDqpmpUGK+ywvv467LHI1lassck266w1yzL77LTULhOttNVmqy0w17JA6bbVYiKuEDYW4e0H46arae66dZRrrgLosivvvPR24W4RJihQ77789rtEuWQoILDA/hZsML82sgDABr8e7PDD7Haj8AcEtGBCxRBnrHEkBkzcAgMMg7zxyCQDogAA8VJscQElt+xyHwyQMOnLNNfchgoEPACCzSMHAQAh+QQFBgAvACzNAlgCRQEvAIVCPFJKQ1pXSmFiT2lwmc1wo9hyVWtzfKpzr+B0k8N1iLV5dJt8teCAXHKBbI+GX3mGYoOU2P6Wtcyd3P6r5f6ttba+s6G+5/zM8v7RsYLYrnjc6O/gtHji5+vn5+jn5+np/P7su33x/f70/f73yIT3/f75y4f50JH62Z/63qr75rb87b/899L+/un+/v4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG/0CXcEgsGo/IpHLJbDqf0Kh0Sq1ar9isdsvter/gsHhMLpvP6LR6zW673/C4fE6v2+/4vH7P7/vJJghFLAAvhoeGABiEiIiKHI2NCCoCFCaRLwcgLiqaLRAYGhRCkIkNiJp/qmMsEBerS5eYhoJEooMOm0WfGESfo0WUGQSkEUUcgryUwC4cxkQsCbDTT60DA6lIra9JGgxD234aGQrSQ5+ziq2anZsmB6AuspHPQiYEpYmjrb28nMQuWlTY1E5ePWoIj5wYMMHeN29GwnX7JkSiHg0vIgS6BPDcg4MVHZBAwKFcMwbx7hlx1ozYPWRCfsnLpuEULXm1VAC8lbAntP+PKyn+5FbMllCLdzDOeoFvaaZWIDQ8UuDAn0qcRVu+dESB0AGlTH09oBUoYDyfaE9ki6nhmqsQCTQsQMqT1FFXe6CK7RVTwjFjUN+B+ITAKsCyzQ6+rPWLwwKatewBsIRg3k20PdXqMkoKL92GQyCGJIqHUSNFoTEBdtBKQwRCBAxnZZk4UL4Xky2kyKbTVgPKfzFnXhuaItzRnBpcu5ZKtAukd/R65KuiQceirR4gyB5BVEpin56xbPysoBDz/GxZUlDIEDyQwldBP0kK4Gcix5HrMe2oVycSqj0HAGplqQDBWfVhFFkrLBjQFQS7AcXJWhC1IwpiocEXnyoh4IX/lWj53TdEdaBpcN00GWBwVYbP5WKEP5wA0BFGxrykiSidyGSegBoRo1RkZml4xAsb3rHQNYcN8JZ9HmY1xJHYbIYHWJgcFqB09rgXVSZSBomMKM5AQkxvOwqYUW21yEKcEoYU6eabcBZxSJx01okWInbmqecfjezp5591RALooISuIWihg36g6KKMNuroo5BGKumklFZq6aWYZqrpppx26umnoIYq6qiklmrqqaimquqqrLbq6quwxirrrLTWauutuOaq66689urrr8AGK+ywxBZrLKorLLDBonIt62gIBRxbKQAVSGvttaom6ywKC2inaAhORYvtogNWO+656G5q/xNTKzjY7gSNPqDBAQqky2gh1Nqr776QhqDsCgAwoCgKlSg6FgPQgnuAvu3ly+/D+z6g7AMCIMKAAWMttTC67eFmLsQgY5ssAMpCqm28F9jbscchtyytNwt480G7F6CwMcCRAJByuiuz7PLPwlqgLbcbaOftzCUz+sDOHOf8MdBQ83qydiEckDTOpzF9bs9EOhz117ievCi0UXPd9dNgpx1rslijkvEsG289ywdeq2333bCabUgHAODt99+qdjxCIgMOCPjhiIfa3gjU+pz445BnWgjjFRTCd+SYZy4pAJTTXYHjmofs1Oikl2766ainrvoh5RpS+Qsb6L367LTXbif77bjnrvvuvPe+egAb4Ob78MQXb/zxyCevfCSVC/D58tBHL/3qQQAAIfkEBQYAHQAsSwN0Ag8AGgCECgoLFRUfFhYgGBgeJSUlKSkqKysrMDAwOztCPD1EPj9DQEBDQ0NER0dHXFxcp6entLS2tre6uLm8v7/Cx8jK0dLU29vc4eHi6Ojp7e3u9fX1/f39/f7+AAAAAAAAAAAABXhgJ2KYaJ4nWaKsurKm+8LyjNZ2jJ9C1OEkkyARAQY7Ag7RWEoqi0bnM8qpdpY4qQh7RFY5nSpX+C2PkaLviEGxomlssLdcviAsIqlGrOgryFUAEEoPLE6CBRwXBYYagldtDYUnCo8dEgQcFQYwlBUcB50mmw4TKCEAIfkEBRsAHwAsSAN7Ag8AFwCECgoNFRUhFhYhGBghJSUmKSkqKysrMDAwOjpCPD1FPj9HP0BIQ0NIR0dKXFxcp6enrq6ws7S3tre7uru/wMHEy8zP1tfa3N3g4eLk6Ojp7Ozt8PDw8vL0+Pj5/v7+AAAABX3gJ2aZaJ4nWaKsurKmK6uC9M2zkEi4LHi7Hs0D5Al/xGBvIPJ8GJUT0cn8OJ9R0zQwNSEgl7AYebUqJpp0mtz0bM4aE3vqPsvpeIwi/iFzkgqBeyJIHAARQA9qfD+GEwUeGAWLhI5YiSgKhyKPHhYGMCcNFh4HoSafDhQoIQAh+QQFBQAgACw8A3MCGAAYAIRiYmJ9fX2Dg4OEhISFhYWYmIabm4be3tfg4Nno6Nrp6nPr69jr7HTu7tTx8Xny8nvy8s7z83vz88T09Lf09L719aT19a/29pr29p7393/395b4+JH5+Y78/In9/Yn+/oYGmkCQcAhaTC6Ox4NzoSSI0GGiEqlar5ZnVChRXr/WxXYCLlsp0K55LRYuvGuzFhOPW4r1eoKcX0s2fWtUgWYahIdfAwqIiQWLZRqAcQMfjpB8a5SVj1cSb5MfoZZXTxahp6gfBKgGCqdoRR6pqKusrh4QUgy7vLwCs44HaRnExcSaqQBjxsXIr1tug82oE7nQUhQYHBkBTRDWUEEAIfkEBQgAyAAsUwCWAN8EFgIACP8AkQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocieyEyZMoTcbARSCKyS8oTsRYdKjOipM8CBBQddMkiiG3dAodSrSo0aNIkypdyrSp06dQo0qdSrWq1acks2rdyrWr169gw4odS7as2bNo06pda/AECiCF4sqdq9PlCWF2TI7paRLGFzBBa/LNebWw4cOIEytezLgxUbaQI0ueTLmy5cuYM2vezLlrDF9E94AmalcYqZsx8r6FYvIHUVQrYvByTLu27du4czPuzLu379/AgwsfTry4cYVD93SJiWL20NKHqLglRATXqZgpT/6Apbu79+/gwy//Pk6+vPnz6NOrX8/+LCub2Vc+NymsJX0C17OjdC2+v///AIrX3oAEFmjggQgmqCBa+rk1RC/z3WXfXfm59deF2PEX4IYcdughVQuGKOKIJJZo4onFoYRCF4DsQUxRdg0hB3ZeYNeaUKzJxNKHPPboI48oBinkkEQWaeSREKXgBSCFCHWKgxDW9dJJK5rkAnPDHJKXW/X96OWXYHqH5JhklmnmmWgGZxQeJ2Up5Qke9NTDIVDMtCUKLWgX5p589plYmoAGKuighBa6kVHSueXchMNsAcOLpKWkoZ+UVmqpUoZmqummnHZqZCCghvrESfK92eVry6W0IpOXtupqpZ7G/yrrrLTWSlyDJs2J4306sbKXqinoh8OrxBbro63IJqvsssx+hWuppgrVSRUqAoXfFiouauy23PbX7LfghivuuAe1YO65L2wAaYSnEpCHW48W9V6ehHVr7726kavvvvz2a6hTq4BaC1Eg4Gvwwd76q/DCDDdMIsIQRwymwxRXbPHFxkms8cYdYuzxxyCHzBbHJJccnsgop6zyyh+Z7PLLtrEs88w012wQzDjnjJjNPPfsM8Y6By20VD8XbfTR4w6t9NJJIe3001DHyvTUVBMQ9dVYZ31m1VwPrfXXYIddYtdk5yz22WinvV7ZbLus9ttwx/1b23RzLPfdeOcdWd18R/+s99+AB+5V34QbLPjhiCeuUeGMd6v445BHjlzjlBMr+eWYP1755q1m7vnnenMuOqWgl2562qOnvufprLeOteqwe+n67LQXHfvtQNau++4s4+47h7wHL/zHvxf/3/DIJ8+w8cyfrPzz0Ivb/PTdRW/99clSr/1t2Hfvfafbh+/Y9+SXL6j46Ctm/vrsj5n++4a1L//8KMJvf1X056+/gvf3H9X+AAwge/xHwKYI8IAIPE4BF9i0BDrwgb1hoASLAsEKWvAyE8ygTi7IwQ6uRYMZ9KAIRygWEE6QhChMYVZMKEEVuvCFHDkBDZKChy6dYlhE8YQW2mWVKPBQKE+YTSr/VvBDFhoOhkhMokQkhJQa4miGQ6ECDqXyJEWxCSVT1EkQdaLDIhrRXkoMoxgVsqMmtgsPGkpUSqCllBseIog1ZEVQ3HhFXGXxi2Acox73eBS7ZAeKO4lNGXVCBS8axY1wFAYemnOKSXkCCda5Ix6PuMdKKnEpTtyJELioBddscSdb0FZLAFkURPIik+5yJCTdqMlJUtKSsHShT0QplEyycig6/AEVSPlEpJjSidJpzlBSMQT8DMsToXQlvmLJTBWuCVc3eo4wo/JLQ7rxhl1U5jKbyU0RYrJdPuSkftiYlF9m51ThPIULiKjNbXbznRb85nOEMcQVifKRgyznsD45/0+dpAKS+JlmKjbZzm3B86AQlKdQCgnEewK0LrwcShVR4AFJhTM69ZHOFG9ZUMsh9KMHlGeiSKlGlEArChF10j5puUUpdvEUgLxoRz0K0prqT6FG4ScXH1oVZPIiCndUY0pnaimbGpV+HKrjpIh6sKM6lX1MDd9Tp0q+qG6PqljFnlW1l9WuQm+r1POqWJEH1ulZkAssSKta18rWtrr1rXCNq1znSte62vWueM2rXvfK17769a+ADaxgB0vYwhr2sIhNrGIXy9jGOvaxkI2sZCdL2cpa9rKY5SsXGsDZznr2s6ANrWhHS9rRPuC0DEitalfL2ta69rVhQC0EZkvb0v/CVra3tW1uPVtb0fZWtw74bXCH29viGve4x+WtcIGb3N0yt7nQja10p0td4lr3utjFbXa1S9sIINe7E5DAd8FL3vKKdwzoPa9607ve9oaXvfB9r3znS18K2Pe++P2Afvcb3/SaIb8ADrB/BdzfAht4wGdIMILRoOADl+HBECYwgwOchgpbWA0YznCDN8zhCXtYwxf+cIg9QOISm3gNJx4xikGsYhaz4cUuTnGM2wBjGduYxjjO8Yp3zGM36LjHPq6xkIf84yLn+A1BNjKPIzxf7F7oya7tboRbTGQkW/nKWIaDlrPM5S132ctfDrOYwTzmMpP5zGZGc5rVnOQ2u1n/yUcuM5yr/OYb23nGeM7znfXc4RH/189/7rOgJXzfzT6Xu4h+7qGdvOhGL9e5kGZ0pJUb3URX99LbNW+lN01pR3va05zGdKgzTepEq3e8qNa0ph3s3la7ur6wXjCT+UvrWgf61qzGda53zesO95rQFAa0rgctaD7v2dhURrayl33iOR8byM6ms7S57Gxdl3e6UM42lE/bXgXruc5BZrO410zucZu73OdON7jRve5ov5na7p72szNMZGbP297EHra+gc1vQ39a1Ir+t8Aj/ehJG/zglu40wBdealWPeuAQ//fDG07xhJva4VJucqppjfFXe/zjsQ45v229b5KX3OQo//+1r1U+cvwK++T5xve9ZU7zmsd75vKGts7bXWcLz/rar33yBrSd8QVTmd3qTjrSl670pjtdzvB2NtR5vnOd2/zlWM96sUNccq63/OsQ9nfEAz5251Ya4WhPu9ktPvGKd7ziZY+7bdnO8La/3e0bz7vIQc5rvu8d7CkPPOB/LnhZ55vls068y7UO82TXXMRXj3zOby75qlue8h6Or3W1PfTOe37bRcf1iJke7qeT/vSmTz3Voy711bu+5zivvOMhz3jRi3jwij987ssgdrlLmuxtb+3Z1U784l/c7nrHeN0LznzfAx/5y2/4qfF+9+R3/MB+zz7it497axf++40He//mdz/l2jde9jFGv/lnP/l6qz/27Wex5jcv9M/bv/OsDf3i6c1z1fsf9QAYgK9HeTc3gPD3frQnf7oXfvvXfQ44Br0XcXQnccNnfBZ4gc0HfdSHd9HnfM/ngR24gSJ4fNanfSb4a3/3gCq4guDHgIY3fi4Yg113a+mXgArobeuXg7V3eQfofgh4Z7Dnc/ylXZzXeV5whEdof8LXbTjYbAbYf//3hK8XhVI4Z6xHgPGHhT9ogwsogyz4hQgWgZ41BEIgBGBAgRVYWmmIgWzYhgqngaPWaqUWgiD4gXU4gnhYgiXYdyfIhOQHhi0IiH/ohdw3iITodTR4g12oiFzYiDr/yIPst4WSuGFAt1r3twFJmIlKSGlMCIQF6GZUWIUCqHRxhoWiCIlaOImOuIiHKIiFmF5iyAA8MIu0yANmiIYZaFpr6IYTyIu/94ZwmIfBZ4e/SIx3GILVR4LKqIfkhYJ96IeG+IqBSHgpKI2taI3iB4O214qMyIqPGImT6IM/OGQARl6g9XmZmI6a+HmcKF+0Z4VXOIqnOIWhmIr2iIqeWG2Rt4re6Iov+I/+KIa1OJA8YIy5qIsH6YsJqZBECIzIKIwe14sGqZDHCJEWOX3M6IzPCI3RCGzV+JEgGZL++IrauIL9uI0oyY/fqJLguGQtKYlKBoMYWX9GqI42uYnV/7VeTShv8hhv8TiPP2lkQXmPWdiD4viSjNeN19iR2Lhy2BiBBEmQdeeQC6lwITB0FJmVeAJcW1mMVLlpIXCVV/kAY5mRlShdXhACmFaWpdWVZLciE+mVDzmXF4mRZoleXJAC39deL9ACfciUBCaSGklygjmSTbmUJZmNiJiSJxlz4YiUkIlsP+Z9v0WTQ2eTmMmO7RhsPNmT5NZ6QxmaRFmU+GiURxmZLNmYhgmQhheWrvmaIeCAvUeQPVCLPWAJy2UCr4mVVPkCsGkCc3dabBmXBCdbr9kFqqWbIZAur+WWbfkCxJldXACc5iJeYzmcqNYFwPlq1pWWa8mbobUBV//pnIoGl52lAirQAMqJApylnK6JnF3gmtY1nQ6gAvLZAPb5mtDpAO85W+IZlmh5nw7wn2qJW1eZlgKKAmEJnVwAm+wJAcq5nxKgnF5AW/kpob4ZAno5Wy0QlihAa3nJh+zVl7bGkYBJaIWZoiq6mod5ouXnog1IaDrImFunlKv4mJFJjpSJW5aJiZl5k0RHXEbHf6QJhZ9oiqKZpKNZmlaHoyu5kzMKoy0aeLFpa1U6jRQwm7QYDHHgAjBQCTxwAHdwB1IgXCZgaPEZgdB1pnIZW9iZlc2FnWx6geRZlZeWl70Fl0oyX2+KcXvKneL5i2/qWX3pAOQZqHNnnm66AS//gJzquZ+dhafiOXQq8KDBtSJesJ+V+lmIyqYNOlvpGQabKqqxNaqhOqqnVaiSOlzoOaByWqGtSpYVup+fCgFeYGhjSZ8fYAIMup144l8hOmAmsAG5RqIryn3HSo0imqxYOqWsKaUduZgx6oDS2pJQmpqo+aSWl5jnhW00mYldEK4/ipPTVV+QB5ToiqRKuqRFyq5Oiq2JWK3Q6qyBhnJXSmv3GohiNwS12KUu8K+YMKZjSoRz2gCT+pXt6ajMNahwWpnbqVp42qa7VacSeaeW+gCBOqFdwKd/MV7v9QX5apeICnAMm7CGCqnBNbLAqKirylmF6llj+bIH66o8+rCc/wWXXvCwBRsGLcuzF+sALTusQBuqw1WWsZqqp2pocNmtBdpdQru02gkBL2useLmh/iW0H4dWf6mszNq1G+m1zYqYzzqvL+qY3Hq2iQmOZmuj2dq22yqTDfkF6IiE4lq3QEqu+gelTLq37pquVci37uq28KqaQki2gxm2+RWy+qW41Sh2QkCLPfCvklsJAnsHBCt25qmc6cmr/lmWc9qgYUm0+RkCuDp0oFuy3NaVnMsAvJqruYoCqrufQpta8bmgqaUCpxtbL4AnoXuzm4UnFNqetgu8YWm6DzqznEW6YamzvZuhy4m0EuCaJvABBeq5tjsBHaqh+2WsGbqdu6ugCP+qoTkrXa4JndarvZw1vg1AvAfqmuy5nAuKoA+qqIp6syj7sioAqXP6sqi1u54VtQ2wqvkrW+RZwBKqvs5boSPbsmUpqQ8rXv7bXd4JoRX6AQxQvbP1wBCYAtm7sa8pAbyrvfL5AVSLfSb6tWBboih8wik8tvRKkmgrrzE8uGx7rd5Yw44Ye5RYcHNLt3X7w+K6jnILenk7b33brkg8j4D7rm1LuPyGtk3ZgoLJuIybgo5bi1wguS6QAJV7uZ6lpxW8Iroqs2yalljJuS/wsKTbANcJnrnlwEILnGyqAnPMBXAMAV9gs6u1xjFxu+zpm7j6u787llsps+s7lq26qsP/GQLbycdhvFlBW8FsSr0MQMkQsLSYOr20NrvQCcIb65sVjKjq+7zkO3SYbGgDfMiUmp4jq6EY68r8WaGK2rScRcefZbT666ize1oNCp7mKcDQiaD+JswBusasirJA2760tar8S6CW2ru0paA6G8oF6p5S1qAbG7W7GsZVqpvi9aslvMItfKzizMLjLLZO6cItWrgwKrg7SMPwbJo7HLc9fKtADMTqiLfNOGVH7LdJ/M9LLM9M7MRPDMW/BpuwKcWAScUpqqWzWAmS6wCKUAoC68WdhamwCZ1Cy5ZzDKl4WrADPJa6qbDJCc2opZaNigKMmp4DfKbpqcwp/QXNvFqF/wq1KH28AwyXXYmnDYrTtMqekoq8bKzA+Uugtruq6qux4YXBIKufTS1f43teESoBEfzKwTW+Pdu+Tj3Ul/rTNJu8kvzIl2xohgzLnSWzqaye2fzAffy/DwvMsmXL0yXXrKrGHUtcGD1cinzXxvyr59XLvbXGWHvBl+yXUvuh+xWshD0GWOvXLcAF+qWqhm3C5nzO5FzOgdnC6JzO6myI7Fy2Bq2Yy2bD2gqTb1uvPFyTPmy3d6vPOqm3Ae3PRwrQVBfbgevO8UyjMmy4L0xyDF2YDj2Lt1AJGFCbt3kHUGCmw6yWKsuhuHuxHR2p7AnS5sub3uxcK0Kdu1uh2pnFF/9cI5dKn325tJtX0/5206qV07/r1ZzVoNC500B9vItM1OlCy8EF16c1yUxt394FshtanVQdswxqqaIMnFk9dPYdwD7d3uzZyros1pnrqOJJ0ibrsqGasWm9up6V1km9y4tKXdj5utgFl7jMywTetBELXvUrtX4JtXq5y/eq2N1MrCDcyY+NXiQazn7HtZbd4z7e25s9r7s95LpdozX4zjjspKeJ2vSs2j48rq7tjrAt2+23rqUImlZO27c90KXNokB+X7+Npb33uFFJiz/QkJ9rzCZwqhcivp5Vxp67WWlctAg+dLJL4a+Vl/Gtszr9y7A7oG3tnBPOAPTJAK0Kyqn/xcfrzeCGzujw/cp23r51flotzeZAu50qq99/Uc1szgUKjMEQ3MnPW9UHO76D3gDVrZ6WXrCPPrNq7qg6DckLzqm0fLCtusA/W+Gx5anAuQGhSp++HlvA/uvb6eH3XaC3XuInrbTQuaEg+xdEy+veNceGvbtjwMEbnF7dvLEf4NgvgON+qeOVzds/rtle3tnoTu7Tuu4EbeRHntu47bY6SmA82qM/ms9BWsREOtvvluXqiuX+ruW1LdCPB+85qO69HebTCJVlPotnSH/uWev9OVtt3Vlpbru1PPGIbNK5deprnt7eW5Yef6rpebr+lqEPurvKqbSLDrQN7pqmzN75/2mfmNjGzh1cE8+fy8m/D6DpsiqcYWlowUu14VudpK6g2R1bBJq8WNmfAGy/Jn6zrvzqqRXr6+tvCiq9jP6/Hgq9LgubTe+tAuq80kX2wWX2SV2fME9bwZvfofzK0By+1Hy9Ukv3yqnJ2C7j4QW6127jnay14t61HlnuPE746X74CM+Z7F7k7X6j8f749jZnO+qtQ+zk956E+Q5enDltnhnw/+75/WzbXN6NSX7uTYnQHwyjAlnmD4+L0dmwFatapA77nGbsyShb4mX7ykeH54nMxNjcwLezFUnpvl+Xd3m44pz4e4m4yG/6X07kXwf9XQ6vBO+So7/vNlaOlVn5lv8P5UQspEPamZ0P+lZO/qG/5UsO+bMX5MqP+Mgai2AwkLfo+q9P+3F7W7NPfPc/cYUOEBAcDHwQQYJBggUVLkTYxcRBhgIjhqFYscFFjBkTYtwQYoNGkCFFYlShYuRJjVweorTY0uXLjRM9xqQ5EaFNiBJ17uTJc8xPoDkhBiUqtOjRoWWULqXQ1OlTqEejfpBK1epVplizVtXKdaoZsGHFjt3q1WxZNF/VRk3Tdq3btGTlwj1T1y7du3Hz6uXb1+9fuh4ED15TmHBgxIYPL1bT2DEbyI8lT6Zc2TJjx1t3MvjSecNn0J+9jCZNOrRnjTevBm7T2vXrN7Flu4FNe/b/bdy5beve3dv3b97A4QwnHtx47ePIgUf+rdj5c8zKX19ODL064L3Z52p/i9Y70L5EuZ8lP4YLS/Q1e25OH3I95/bwacqnX9/+ffgvUOCfz5996vcCVE/AhIwiEKb4ElRwQQYRdHBA1SDEKcIDCTSQq6TKuzDD79aaQEMPuxJxRBI73O7EvEAsDzsWURxrMhczG2/GFmu8jjrrbsRxRx57JGw6xrL6z7PTRCtttCLrUw08uKCTLjnjihNOyimrtPJKKrPU8kkusWSuuS9zdLJLH8PU8UwbZYyxOxpNDE9F785r8KQJ56zTTv/y1LO/PfuEqUJAJaRQwgfxXMhPQw9N//TPQe90NFABr1oSzg83tJRSTN3UtEROxVuzTTY3/XTU7MpEM81TUxXTTFOBbHXV6BbzrbKiNkKNSCNNSxJAEZskE0ost/RyWGCFNfZYYov9lVVmwXT1VVWjBZXUUEW19iw5F9V2JJu2RfRbcMF9tNBx12uUXG/DTRddds0VitByIW0UIQw7rfTeS/HVN8RM7ZXLX4BdvNZG7xCr9kVpfUQ14WibdfhZaGN9GFaI8arVVlyL3JVXT339FdlgQRZZ2ShHNtnkZa+cmFiJI/a45YWnpfbggTvMdl2c25VvSHV79pnPeHWGd96gczYaaKGFfnfoeJd2V196+813X6prpv+5038D1nrGFQmGyuCZGVZY7JfJXplLl2GmOGXmLHYavow1Bq2zmLrqK8xk8z55b5L51vvvvgFXWe20x75RZsTZurrmm492/Oc8FYV88p15lpdpoi9/HGkFi2a06LcxtzBQSSedut7Tq7Z6646zZh1O17vWFOywSy3cbNwLr5hw3tc+e3ey3r51eOJ30qrsLv0uOXDml1e+ecHZln5632/PnXbsa188zs27Tzpyy7+nnGOmxQc9UO8XRd980TV3n2gSOVR9fvrx5Rfr2AWWGvZ+Y87ef+sFEHkCbBnwqre73+FtcCkSHvGKh5GoMWWAgnse9CpoQQxGT4MWHJOzevf/wQGGkGza017j0tc5zo3vQCqcXPhcqLT3rQ+FLPycDNnXvvOVLlIXq1/q5NfD+eUPf9vbn+wy9b8RArBhILxeAKmHQA8m8Ilq0iHG4Da8iHRMYhl03gW5+EUwenGDUZQiEwloRiomDoleo4AJT9ieF7IwjjQUVxztiMMYukdyJ8xhHvHYtNBFbYdV/OFBUFdIIAZRiEUk4hFbt7g1JlGJIoQVJc9Yxg5CkYyYnCKzoHIu8BkSYQocYxjFeEpUprKUneRkJic2mdhcMo3coQ4Jx+LGN7LkjpDbJR3ryLk9phCGNswlt/roxz8ik5CDKqIPGbnI1R2xMPy7CzUnSSsa/8nygK/U5gc3yUpwBgebn7ycFn9EQVWmU53r7KIpV9lKTVKHDk6gQyzRSLhr+k8uXEhEP/35T4AGVKADJWhBDXpQhCZUoQtlaEMd+lCIRlSiE6VoRS16UYxmVKMb5WhHPfpRkIZUpCMlaUlNelKUplSlK2UpRPnZUpjGVKYzpWlNbXpTnOZUpzvlaU99+lOgBlWoNH3pUI16VKQmValLZWpTnfpUqEZVqlOl6j+LWlWsZlWrW+VqV736VbCGVaxjVelVyXpWtKZVrWtla1vd+la4jtWsNrVFXO16V7zmVa975Wtf/crQuirUA1TxwFz92ZhEvGADiehCFxKxgRckgv8qIg3sXy17WcxmVrOb5WxnT1rZg8YhBaNNgWH7SQFCJEINgEjEcBIBCDW8lgKCLQlpbUtag4LWs7vlbW99+1vgBnesuhUoCDxgiC9ENrGmzagKuhC/3ApXutOlbnWte93L7mEPddiDIWhKXIDCorYpWOxjmdsFOBT0AylQaAo+EFHwGpQVNqCvDhbBCh4soqdQGO0Q9EvRTiABFxp9wmh/sNNTxGDAC7XDgaFwYIV2Ygu8COkpYEDhftohGBpVhX8vWuAUQBiiAV4wdk18YhTfdQ9XYHGLuyvT+PoTsrBgQHr9eV4bD5QQ702oewPKBdsyNxExJigrdPBP/P73okb/zmgnVgBhVfiioiTO6IP7KQcl3/QJXxBxQhu8UChsmKSn4IKHE6HhgT4Bww7tcJYlauXWupmhVE5xne1857CuuMV7fvE/7VACQIu5oMPoQaENXehhPJTI4n2DPwtBm0II+aI+BmhpqdIF9hKUyANlsqPzm9FOX/TLTRZwRtXc004Moc0M7vJBw1zSU/Dg1WcWNEBP/dBVV/TWE6Uznn39a2A7lcVPeMKwi30FRAB0CrU2KA928GxoP5sHAbUDDeQM0EWr4AUgSIR4R9sCHP/ztrjtMY/FzeP1FnTTAg11tz/9B/r6wN2AsIEOCiGEevszCPTdsCx8sG/7zpe+vJBF/30numt/qmIFo91wgOvA8EQ4OQUXToTCIU5liyt4onbQeMIXnoINr7rNHYaCgjM+YP6GOOILp/hET3HgW4d54R5ucIE1/uVZgzgYEld5yoeA8Y83HAkPBzlFY62Km4s55TAfraxDnvRE+Fy/diDDCngw8idvvOP9PPmZR6txKFTdwQZ2OMSDfXa0pz2nen7CIYiNiGP3uZ8Ib/YOArqDaSe8BF4ws6YNCoIWLLYMQSYoesWdghZgpb3m9iel0+13hgo830n+g5iDwIv5yhveuTiEECh8+X4KIRcF//yGOy36ipb6n6qguIR54eRpn8K/o6546ydM4lXH2ugp8DDrKf/sepH7V+ENn7A/c84L2lP01KMuOcoPbAeK22HaON8wnP9J5Vfj3vavt3oiZH9thupe+rSOuphPvfznc2HDaoZC3sfP8QF32PUVPQXv9Zv7vGfYwTTPP+y933e1C0ABHECS0oMWazu4azE9AKgqADQcQChnO7RCw7uASgUAFKhNA7wvkCzC6zH9cACHorRzO61MG6h1C6h2S7J9oy8bCIYkSwR/Cz0KwzcWJDh5g0F5Oz37Ur4166eX86cGozISqz8x+0H9G0LbGgKLsgP/MsIz+4HgWwT8+ycQYzgirKgoLD+umz0IIzHq6zWvmzgKyz4Bc8IgLDUwfCjdczvkWz//21o/CuuwQiCCOviBVJvDBfNCKOOCllvCJkzCReC5aTs+fxJC1SNARExERawoAxy2Q3A7BRyoKuiBg3K2YLhETKRAgLJA8POnbNu2RACBDhSoD0itxqMKEVy8gHK8EsTAhkrB/AI9T9OvGOy8GeQ8f6rFGAy1+TqyN2s1M7RDNFQ9KLiwYBzC/MMoNQvGKFy15KO7qOtDiLID26K4WWuzUdPD8su1M8u7UyNDXDjGYSwxiFpD2UMzuru1JyCEIEi1HySCPBSwUWM99TM1XljDfpo/3QPHQhzHRfxHgAzIg2I7uGu7uBuoU3jAuusFhuwFZ9PE1bvAgMq2OPCnQaCK/0FgrlT0sQhIRYTyyERgRXV7RV/sJ8orSXejxRsEvSC4wX7SxRxEyc6bqOHzwWDwvYi7PX/UP5x0Pe3rQYliA/0Cvu2bPyaUwt7rw/YTqOR7qF0bv6WMuufjvyfUwicQMSvDSXDsSZ0csDR0KHyEgnqMSn+6NTv4gvXjgjF0v+mDsp9bAWZ7KKHMSV7ASa4Du0FUuv7bSYHsS78ESGMLTGRDSIUsqAg0NGhLxi3sxH7atBljgECwKlVMhDAAyYEat9Hqp3EbychjQRvIhRdcwc98wVqURRq0L5gMPRvgBRqMS4cSRB8kLaHzSnnsL/2qv4srNdxUOYnazSKUzQwbrf8vED4zw02NAzEFo0b7m6i+QzpcgIIvaLoM+4KZmzoHa7igyzi19D7eozLfjDi+LMf8q0m3+7oBo8Zpc87/+y8Qozm3DMTu603g5E4DizrhzMuyJLvw/Ev+7M+007M9YzG5Y0DXBKiHjLZna7WKk0hsk6/xKq8NYC7UUi3WEkEHsMxVxMx+AjLSErIT9E+QmjUgVFAQLVETPVHgAlAXC6hO0AJAo8RKLNAKZNB/WjfYQi7legEJTYPEWqxUDAMzoCwURSkR1b8hPVIkTdLLYoXt4i7vmigpSyhOjK6EEq0O3akPVdKKKtKq1FIv/VIwFcAsNQQ1ICxJC1M0TVM1XVP/Nt2pM21TOI1TOZ1TOqWoN61TPM1TPd1TNr1TPv1TQA1UQRVIP50pBD1URE1URV1URm1UaBtUSI1USZ1Ul7IFS71UTM1UTd1UTu1UT/3US3VUUR1VUnVUUD1VVE1VVV1VVm1VV31VWI1VWZ1VWq1VW71VXM1VXd1VXu1VX/1VYA1WYR1WYi1WYz1WZE1WY+UCAGhWZ31WaI1WaQUAb1usaIWCIHBWTWCCDHhWUVCCbm3WBXCCbN3WcM0DY3BWKDCCSdjWXAAAUWDXaW3WTWiCSHDWOygGAKjXe5UCIqCETXCCWyCFfwWAO8hWKMgChc0CX5jWPfCBZ6WDCtjXI9gF/wB42E8YAklo1oeFVgUgAot91o59Vk04gkbI2I0dWXEF2Y8N2Wb9hBhoBJGtAZmV2JfVWI6l2Y+d2JKV2Xlt1lIAV2cVAG4zAKM92qPlNmf91nd91lLIVgAY16Z9WaHFV6GFgoaFV3k1WHAd14Y1V2hl2p8dW7ItW7M9W7RNW7VdW7ZtW7d9W7iNW7mNVmSoW7u9W7zNW73dW77tW7/9W8ANXMEdXMItXMM93MMtAMVdXMZtXMUdU0rlLWadW2ptgUCI1nFNV2cd1yWYWnR9VqmN1s9tVqwl3YaN10n4WX5d2n8tBX0FACnohWaN3TuwAtu1AqgtW5XVBCSYAd+lAf+L/VjgdVaVbdZVyIFoHVmY/d1GaNmW3dfe9V2LpYMZmFiOhViRxV5vxdmLxd6O7dmyDdqmhYUnRVrzhQWgrdrNFVh1ZVh81dz3jVbUbdbR/VywDVv3pVz93V/+7V///V8ADmC3RVwCLmADPmAETmAFXmC8dVwHZlzIjVzPmty5DYABmFds9Vgn6FyDhd+oZV9oHV0AKF2v1drUndfVVddbqIN7hV3ZXQAq6IV8hdaEXdisTV7tBV/QJQIwcNnifV5o7diPhVjwXQUf+AQeaFY6QF4gBgDqndji7V755d6RpQMiNlmyDdpwBQBTbIEWMAAvBuMvHgBCWFoOdtanvVb/9xVh+vXgl93a0YWCdL1fM55aAb5jPM5jPd5jPtZfBv5jQA5kQR7kQX5gQ45gCeYsCr7jdT1hdW1YLV5fO27jR4ZXof3WLZbWgL0Fp3UDP3DW2IVXJIgEUhhltd0D5HVWK4ZWK4ZZn0Xl7d3YIIbYnb1Ymt1XIZAD613lVRhe4oXYXvbZ651iWf7eiqVYl53WPNjaZu3iLw7jMCZjb83fEb7hZ/3cSI7fsIXjOWaCd3VXp1XfPh5nci5ncz5n/iVkdV5ndm7ndjbkB0bkRNasRb7jzxWFhYVjhe1aEKbfhXXfGj7jEVZYN75m24XaTbAC2Z1d290CTjbY213osuVd/+mFXt+9AUnYA4y2ZZml6OG1WRw2Xt/1ASx24luG1xiYgRwAWY8+6T1gXile2pT2XeR9ad+13oul6WktBWZuVvI1X6BGX5LlVhPWVizY53NF6g6e5oXN1jywYXxV2GzFZHSuaqu+aqzGanV2Vr/lanf+arAO6waGZ8eV53nGrHrOarItXbglWEoAZYkuZ5SVVpAm5yhuW6IFaqQtYwy25rllY7UObMEebML+3602W2SQVrFebMYGZLIu67O2rrQubBr2a7UlBSswZbhWa+FV6XO+a7wu2vNNLT4GbMo+bdRObdX2akGm28QGgLr1aq5m7caubdtO3MeG4Miurslebf/f/u0AFgBYIATiLm6hBm7kTm7lXu6yPWzYtttmje3ofm3Ypu3bvm7s7tsHVoF43m3q6m3mDm/xHm/yLm/zFm/nvtvpnlbqzm73fu+xbtzacmCz9u6OioMz+CfIWCrwPm///m8AD3ABH/C5de71fm7Zjm7rhm8Gt23Hra2SgOyCWkGXHKha3CipSyl8bKgNZ6ndpNGG6rXxg6k24IL8Pi0uyLGj6m8Cb3EXf3EYj/HkJuRnVW8EP/Dqnu4G3/Halm8Ij3DdJqg/uMFiuK9PC6gLxygng7IozagOF6gnV6gofzMZPagpVyhuBE9yFKgsHyk2MPHDSvGkYnEZL3MzP3P/NE9zAE5v6L5xN29vHo/zxc7tIB8oWTTJIweoJBc1EnVyxYTyP5fyQKdy8ZSoLP/KTQTxj0oDMEdxFRcqMldzSZ90Sq90Smdz6ZbuHFdw9l5wOf/0BKbzxSWygsNFyRMGz+unIS9NflPN1XRKoKy4oAPPh1OwAnNPm0M5pQsG3KQ4nZu7iWODQUeoDVfO5Mw79QQxb8Qw9usvNey/4tPCpVtQarwwiyu6fDzEL8NNVZv1ae+wasewaQ8wNriwX18oRj9xyRJzo4p0tIUFx7J0eZ93eq/3wcb019b0s4VzUO/3UBf1Ati0XtQv0rxB0YtB0xy9CneoQ+S6ouw+6KOw/yfYsIjvRi3UwjU8NRKLyicYdisP9DM8T5iDMCtTxzGscoPazbbU8uNTuOdLTwAUcZhbs1Vr+ayDSvPjvgO7coNK9zB3gxXXX28bBLbN3LRN6Liud03AAsu2d6d/+jKn8dmucTj3dH+/escG+BOUhYD7tCRjshikwYGbL5Q3KLoTxwFbw1fLRgGbtVfTPZ4TQ3j0QY9P+WSEzVdTs1T7Lzk0+YsHy2Rssx+sQpBrxpjXdgfruFUj/JvsvSEoBMYHuj5Xr0Zf99gKesr1Nh8z29E1erRFetF9XdE1ArGd67Vt4rFlWicoaGgV7uI2bgE4W8Ae3aVveqi/fdwPcKzfff/ex21R/9DLe8FE+ANeIH4c7Dxc/Cd4i/WEsj4fFLGQ9768W/subPtdl34t78cF43m7L8Ti0z1VCILwjzgz63tmP/lCp0JeOL8eNPwsk/l8XAHi1C+ECz7I70ERx3aE+nJ1BwgzXNQkKmjwIMKEChcybOhwIRcAEidSrGjxIoBXKTam4CLAYh5jFUNiLGmS4p1iGPMEEbUkF4BPQySdLKmAyK6aEl1mcCJygRNfFgWAMDTAAFKkhkB8tFgqCEVNTDKMFKmTp86sWrdy7er1K9iwYseSLWv2LNq0ajEia+v2Ldy4cufSrWv3Lt68evfy7ev3798CggcTLizYVsNjiwr/CuHFisfiRKx8CFksy8ehIJgTXn64UNWKYAVPBVMFg1eiTlt4dUKCK9EpHgWhiLYzZLEd2blTh4Yt+9CTHwehCAf+23PC2AZVxXgN5TcRNqKBFyeeyLpp1LSRK1R+8NSXILOPJ1J1u/xt85ELtn5d0E7xgk94qb9Ovr765wfbfyffsM1ABglEEHcFGnggRGjBwlELhFgEhRGTSFRKFhWKRGEWVrEkkVRUgWSFFb1MVAqIVqh0EUsdxjSEGTPU0AgAN80wQwUxEjHjDTQBQMeMNOT0SQwuwrhKDje+GJMSGUAhFACaYMGkREQlNWVSTI2UJEpWAYBhhgDkUSGTUFgl/0qEW2K5Fpppqrkmm226+SaccXIFGJ112nknnnnquSdchvlJGGIMsWIDodMFYYOh03WWGaE6LCJLo+sd2MkKG/12Ckei8efddnZ8Uel5lKYQwxearnCaqCncJioMbPhXIKYbNQfFRl/8Zltkqf4G2qhcoIbpEAjCxlFzvE0HnKy44HfeEylMx1um8CGbQnHNitbsqMqeVx+2zW2aLHJxnHEQGwQKey66DkV01oIpbBDAg1DthCVJEtWr4lMmSSEiAKQgEYmXKkFRIZgXAenDjgjTUaMmR+Q00R4I75GDjbs0PGSOq/gIQMQ2+TQRLEZRSSUsKJU5EVAwIUlVvQAsuf9TmS27pLKcNdt8M84567zzznz6/DPQQQst9J9FByqsELmkuzRy0jL9dENOQz011VVbfTXWB61rFiwNWgSUlgHbq2XLL79c0r5jq33VTBz7oAkSPW7M44w+3JTT3Rr3mDHFOgElLyFHtdCCAYMXTvgADkoEhbwU5bt22UymnDJFomQBJc+Za7455517HufQoYs+OumkF/3n0QfKokPWU0vderqqoQY77bXbfjvTW5dFwAAlMT5RvS3LHETDEqLNb0pqD0ww5hPJRFPEF1OkMYwR310xkRVlXxPYEwV+OPiGJ26y8TE6QXPwWp69pTGiNI4kzZ/LPz/99dv/een567//P/96ne5n6gokBEfh7lyvK2DTnIXABTKwgbbTHZsgJKFSRMhyZNMSUE4RtoukbUtEoAQpTJSV57ktYdPLEdwUJjEfNexhEtmeSZyEuZCNjGRX8hCZykfBSVhwIutrmB2gVIoz3a+IRjwiEpM4lv4xsYlONN3/ChNAB1Kxila8Ihaz+BAIsokkQMmCEewgki8xz14vQVuJtnCLBVDBCkRIHtughzC44UgSMqqBGxAGpBn4ACcA0Bsf/9g3jzVPSjVEiuIq8rj1mQ+MYnQZwc7osjNhRYmWvCQmM1nEJ3Kyk560UxSlqMVRkrKUpjzl1LioyUsakmSBM0kOVynLWdKy/5b2+yQuc6nLuYQSUKj8JTCDKcxSqtKWRhQALAihzGWWzJjOfCY0o4mzXVKzmp7s5WCmOMxtcrOb3nxaMaUpznGSs5zmjKY106nO/WHzMDt4JzzjKc950rOe9pTnN/Opz31aLZzn/CdAAyrQgeosdBNBhkXcIhGFAmCdDmVnO21xz4lStKLxtAVGM6rRjXK0ox79KEhDKtKRkrSkJj0pSlOq0pWytKUuPak/CSrTmdK0pjatiUEXqtOFtuWgB30oUEfXzgLYIqh4uSlSNRnTpDK1qU59qiaHdhGE7vQkRr0qn4ZaVKzSBapepd9SvyrWsZK1rG7KKUV6WhG1NpSnXP99KygjCle5mLWuOAurXfOq173y9adCW2tceOrThs61sH7R6lsqUQgQLLOxjn0sZCMr2clStrKWvSxmM6vZzXK2s5QtRCX6mhW8ira0pj1tTdE6VaqyxbCu9Z9ce1oUAcAVtTVBppVsaxHSquUCUwBGWe6AsIlo4guMMFjbvHKB+bCpuMfVLXSja0mpJpSqarVuWl+rXbsgti2FKERhpVuS74pXIrwly3If5lvgjsW5KBmuRUaR3K6kt7nG/coouPDc8vK3v2tBK3YJG2DWbrfAdOkuMpgSXv9OhChiVUMLOCLhjZxEAh15kyaoAF8ASIG9YhFuVO6LXCmcQAbPJfH/CYaLYhNLBMUuwNsUTnAC4Bb3DjL2cEVG0YISH/cOcdhx33wrYxZ/pRREZjCSk+wVALOWsAn96ZPdamC4IpgQhlUyABIpzi50ASxtcFca0tCFFKShI2M+iQq47KYM45jDbVYuc0c0yPi2AGFSQBiI1+s4it2BYvXtcJN8lWE9zpe49y0FDixwBxNrwlccnqOI8etoLFO60qv9a1UF29apRlnAU35rla+sZC1LU81fecEGJlJmAJB51SYh83nBkl8XAs+FOr5xi2Wc6JIgmiL1xYh8LeAlu8VYxjP2krFzUN/0ZtjYL3Yvr419gkTneT7uhXaOd3xsZPO4ci14s6XD/41k6ma3ydW17qenHGq3KOAJL3j3L0KxKiFwwJpYJnVNSnGaN4miUvsmi6m9QmaLtDoFaBbzmqkAbrH8ekJzjm/bhNvwfjka0cu2dqSblHGnPLzaFrsvtr0ya3GTHMvpPrku192WduMiLqGgN8t3eW+u6FsXccrDv8cS8K4MvCJpAIGrSwJrDGsYZVPYsMgLDeiSBHvYXppzfhnhW4rd2UsvfnSI93uRRtPa43qWwpG7YmStl7zs/EU52q8Z2wS/JeZweTkH3J7LmZ+kFNSaEAwakIJ9LwBbPHBZ2/q9cJPkQVaPsNe/+76RQo+2y1/pSJgjH/kzvxrhb/q1b5Helf+l74TxOY44woTcbRK74A0Uu/UPmNvsaVsg5BcphbHxHHrmwv4Ewti4VqJu9t33N+2+d6LKkSF3uL+83e8GAjJK8e6ZbIIIduBCy/lHd5PY/QcTSgEP+v53KMyk3z+ouZc8fxKc2xwl/85DDA6vFS6zf3Ds33lNJix/g1c+1ppr+kQ4z/v98z+Tv/8//wSf8b0A9BEfzD1By5UC8iGDHgzDJmzBMDTR9GVFzWmfJqyA9Wlf3/3ABnKF9oHEv9kd9q3f+7nf+21Fz1lE0GHE0PWfC74gpQGgDJaOACKgWxhg3NmgHrzb8TUfJEjgqNHcaVggBsbIE/xdHgyBKKyGBx7/IQiW3+LsHRSSIFikmeRJHuUJneXBIBd2oXjNIBiGTg1GHzLgYMw14Fv4IBAmGb45xd1tyRAeYd91X2g0yRY0wN/VRL8lF/mNRM5d3+CVBPxthRuowPxtBBwcnP15ISM24lOFISQCzRjeIL3BXcyVwm24hRoy0QRiRPXhnS584AVuhPVFYSA6zwrMF62MyiOI4OIpGkfkIVcMosBxhFa0oCPmoi6aVST24p5MYlvgIAO+APLtILxtYv90YjTRYhpwhYTd4hbuojROY1MxFDXujFZ5j/+xFZK14TMN4grqxDNmRZot4jWeIzrWki+u451UGW3NlZI5mECVGf3doi1m/4UHpJmCdIEhpKM//qP8sKNAAgaCfdeCIRl5BRQ91iM+GmIiboU5YsSCeI1yfUzJDZGHAKRG8sxAdiRfIFglzFZtMRhuhRZALSRDpklEXkS7pIADmGRN1Ev3gMUmgMgHoQXjYOQf1U1adAzwGMHMnARuORYsNIVOMBLlmElGbiRT3oxHPiVeIBhCLZZnVaVVXiVWZqVWbmVVglZ/raRFaARHeARIbFDLlAUp3ORZiIlOSoRPnsVbeklLnBFQNA8AtNKULIVRZknlnIxEJGW++WVTDmZaQKVhHtjauRZhDhRYVkRLUiRFSNCEEMyFWIi9yIuKoIhNUsJOqGUIgciJkP+IFahRjLSRFbxPRYhJLLklfNHNi7SQRNDBHMUNjayIHO1Rj+REikwFhzwJReDlyOSWDwnm+izPS3zRmYgJzEhIHgjmYj5nWBymdPZJYooadJ5TY1JEu7xLvDgPvVwQh/Dm4ziFWk5EWnKmryFg392C47zPF1WIJF1EXL4QxXTMxdwEwzgMCfnkfF7ETGaEyBySITTT4qBmZm5IUmZmLLVMW16ng87JdEaoVFrng45TdoIMZKKMRUIOeC6OUDASRXRQ5ahlTYIIaUpBiJinG6HnVrzlHvTI6c3EKszREcDIjlTAfg5Xf/qnEwCO4BCO4YiP4vwn8FgF5SQob5pPLgD/ppnET4U+aWvRVXVdWoSenFa9FJZmqZZuKZd2qZd+KZiGqZjawoVGSe9gxO9waJGaJ/E4Z/7xy4iipxRAxXrmX4ruxIq+ZxbEp0X4JJDkxPbQwS70AYxIz43mKGtyz4Z+T5ACKeJoWZqGp4cc6flI6oi0z/s0KJRu6rkFlpR5qqdV6adN6EFy6jfCiWTuUA+tjfloUEncQXl2ppyqRCmQ5poSVxMAjFb4afrdRN/MqLzgZ0zEwC4ASSMcjFs+nEXIkHYG6CER6OKczHi6zBhJUmY2SRhBSXOWj6l2a6gm1qZp2k5Zp6jyUnWWqrfWUplmhRc5gSONEcFcjhk5aUWg/+iKfiaIQMVnkgEClqgV/IuXlMiJ6MSL9kiN0E0c9A3c1MhOBElt7oiL5BGH0CataWghzdYhtWG7xo/lZMj5OAnBnAwUnMkOpWu6dpW5cdpdVNVcsCw3foU1WqNVHVWmOdnMqtu5wqPJ2tK61hQJsQlwKsUr8Rpq7qzRdgXK4tS3SqlfwYXLOu2nguvSphVgiWvUtqzNott1gauV5uxIHq0s9axMAcmRuMlQNha0gq3amkXSWtXSYm2ortVgpSzVuq1J0O1ZENjcphup6uzaZpLY/q3gnmPb3u3byqxOmNvWcm3VrtbdvizNRqmmLS7OYtNW0YUqMAADEAOfoALn8v+F59ZF5m6u2JFAjgwuzwQu6q5uLq5sSfSFX+HU1k6umkTuVhAY33otXITunvDuXvguXXhuE04h696M6hYv8sKg61ot7AoYWzTt5AYYlNXty4or7uZFzdrs41ZuL11uMIqB5v5gW/juBcyB5vYCMtRBGzBAHIgBGXRA+mou52ZCHNSB5uYCKICv5oJBLswFKuwvJOTv/vIvKhxDMJKB+ArvX5ovA8Dp1xCBIyTvXUkwBT9n4b7u4ULtYHUa16JbzUKu1WrF8mYF1Oau5aZhG/ygKrzv+H5u+qJvJoxBLtQBGWRuLqRw6JZvL2SCGHBuAbdwXdCv+LqF7woxMviuAgP/QB2ISAzTK4ckQQRXsJwcrxRXcbhd8PNib/bW7aZJ73UpLQlfr+tWL+J2aoFJ5ehqLgsf8efy8ADPcC+owjEIMQOfrxHLMRDTRfny71sA7xKX7xArsBvvrxMvWhRb8ZtQMSIv8ri1LN5SbeRKrdyOK+JWsuJa7wZHaV28LjeW8KgmJh7HBe8asVsssRzTcf9qYgojQygD71zscSoDLyi0jwuzMYekcE1sAhQzcpsoMi//snRhscraRdM+8t7G7hZPMlvp7QaXMQbL7jJ/8glrogyLsgvXQS2b8hzjsAGrsgp38w+/Rf7Wclss8fh288rNgRykcgtPBDZzDwQDs5r4//JWEKlO1KQDu8lNaJ5alALAyjNAF3NidXKT9RQxu9UkI7QmpyyoGnMmA5YWf2t2QbSBTWga+/AAw7D+vq82C/Eeh+8dd/Mgp/I4f68awy8yjPT4rvH/7i8Tb3QHYMQFxHNAq0WZssH7cdlDjp+RbmhW4HNZrgRQntHP1oRP7rNJ5CQR1R1oOs4/f4UMRWrS6YhWKPVSUl9Tn0VUQ4WhVk6QlC1G2OeTSHVNTxfcbvLVlqt29a1DmTOoZsXElXVZlOkARBiD7CWr5rVZwBFIzCVMFPVJ7CiaGoOmxuTAloVU5AJZcwVgHyVhL7Vho0Vi/05XT8TCEOwcMYFiy4tyyv81EnXVlJqxWm8XW6eT/ZKzM9ed6ca0ZwMcWgSChKWty0grZW6JZcqlpX7InW6JwK4E8fCmTLTIkdARTwISwuiNjipsjVLralYEG23mrT73U99BifwLFNRBVi+rZsvkjQTSTs7A6dJBHNSNjPTIcNFN6EUHTzK3m3JIicApX9vrP1P3vwKMvx52VGy3SNwnEZzu9QwrjAircTeJfv+lT7d2/Yw2VJY2VyG48abFF2zEGHTnvLBMh+JL0YYov/gLwCTP8hRMfMVAjUyMCa1CjhhrCSUqtg6JskZ2Xm9Cru7Ev7CRiEjBB3E4l2RBhpuQ87QNidPBiaefbUJMeleAr67/uN9QQT6LjSJxdYzf6mQSTIZfDB30Dd3w5GU/D4oLdoE6+C0puEcyOFZ5ec30rAAQIAL4mk+nD5SbjV1q+Nrw9UmQ0PPI5h/lCH/C11te9mVnhb2K0Is/OYfTOIcx8ZOfRGUX7IxQzGVLz8+W94wYuR9txXkGtb2UCJ1Sga3y9o5jBB3N2X8LEseMuI7yc2S2N5lnDpiHue42eKrDidgWxUVEKpuzqvsUj74gz4l4eLy+OQllj6LnRJ4TufPwgCbQGwUCLF/LOYzrqr/KS9o0e45P+XITO0U0+nI/+qT/5bZnRaVXxU5U6niy0aaTCFRM+9YdgRucLre70E00QhzI/5GKo2mnv3rPrPpAivlV2Xsio2qZqGqXsGoGbZBFdFAp3Dig62HbyGao37kkIOu83wQhmPrrfVBNDiyzP/m0FnqTHLpJILXzCLll5yeMoHiy+lq33/Nu3+qgUwFqimi/xGpJXMwesHvD70EcnIiJP3wMmLo987vm4Hu+t/qYAz2b0DNfflEYwWsZeQmf1msarVEbvRF+M53D9o2i+4iM3IAcrJDBuuXGwHUbIUHy0DeI7HCJrKi/nibHN/tP06aOfj222yh620iPNELDe/t7B+zeo+gW1IG+lshN/vmSe/py08GRNPyfcjt4d/1gG73nCL1A6rtRQf6aIH0RGaqdZ/8OHHG4bsGQ5Zu15PvihE4BCfzAW4W+St7Ulbc4zuDrppuWxrC76itRaidvNubYLn929db+XPs+8NfV6K8jqeqyI7h68JsF5ic/82/j8EciqaYX8je/WCw/9V//ET1/L/btBVBBDhQ99oOF9Yc/+c+P9kP/uUo/+Jf/LLK/+wfU+UNi8UPx9L+/Tiw/LPCj/e+/UwIEMoEDCRY0eBBhQoULGTZ0+BBiRIkTKU4scBFjRo0XbRnclMRRRZEjDQIweRJlSpUrWbZ0+RJmTJkzada0eRNnTp07XXLhWRNWihaDfhY1enSTlV5HmTaleYcIJac/ky6dehVrVq1buXY1ShL/bFixY8mWNatwY9qMHQuOAnkW7kGvc+nWtXvXqU+vQVOkcFDppSgjk1pqYpIBZaksWYwxLWXFSrGTdyBbRapUpyYsvqAEMamAyAwau0x2LqUEMU7KmAEktRLV5oInt1BuahLJJFSpOUUtyeWkMYBVonOY1MzZ88yqKu9IBtD8pG3cLnv/Dv4pRo1GJ+mIrmAS+4wbkoSLl6TpyK7qwF8KgEUIfnxYAmbmuT64pWDCJxUzxvsfwLniGpDAAg08cCG1FGRroClI+AFBuAKckMIKLcxrrlf66osL+lKyDzz8WDIsNZRAbAo6lKSwrELDcunMJDp8AAC77aAw5rQScVoR/yVSYKtJNtqiu82o3jJgr0YAZGyNiReT2ynFFFsjkjrU2FvlhiQB2KM49HbxcsscQNuFjgrKpNHKxhZwwheVBADBkAEMmHNOQ0DwMKVSnmQyNf3yE9HE4FZas80LDT0UpQgVXZTRRh9SUC0GHT0L0UotvbRCvbriSyhCVIJisDUXW6wxUUZtzDA7svBtMkFFzaLQlR6zAgncSIGs1lZT4jE3XHG7Aw7IkpPCV5NmzXU1q0hpgwpacVugWWFXchFE9LYb7rsb/Rw0Wudm/REAXk3ycTdgpQ23WHSt2II2aH117UdzrUhu1nWFTMlIKNrcY0bQxqNWUJSC/Gy2ZPmDLP+yWxFm1zbK2GUp31iTHJPGGHxYpTgltSOiETqCyDhi4zZD6U06Tabzzg9RCxSAV0kFoD9YaTQCilVLPJHGxVZubWRMfb6LQJmQaamkRAsyKaGTJFJ6aKQJcprpSaUmCNK0JJ16rJ+13prrozTliq8NAvh0z20FdiIXzRorRUSc9WUyl5VIydU4IkuJ17mTeJXOxFqhZVFPAOaeTkVlMZNCsjs8G9zUUQE96ZMhJNnjBjO+iwnxHmFTXG8Wyc3NbyoA94zzgTPnW/B4a90EbdZpy7zmUWNFqUxNkIhD8piguEVP1Hkd/DnnpEyKdM9izmJPfGPYztpVanDDB35B8+H/iEb2EG95l9YUFJY4Tz4ZFhMfXzPuEPer7TBT28zjyRNJhFnE7bue/6qgU2oaf6SZdvpoAPDvXyFRC6D+XCIQqPHvf1hbVNU2cjUFgoV+EZTgBFHyta3AYigqkV+PAKUZnaXtMHzKTXA8+MGVSAlmCHtNufJmEl5B62EjlOFq5hW8lfxuc4lbHN0CMwQ5FOdMMEFdrxD2JHGljoUzLOLAgsQ31H3Ohk1EW7ha6JIypSdy5IHJiqDQhk38iFdREl7e+Ba4mSQJPYQYD7/4RYQKWCtGQTBPS9aUHELIqQUtMEAe96jHAXiqNMmDWdkA1Tib+WlbJzoeoOpIQUfipEAv/2ma/+5nwKzIhYAsGYgkBfhAAzFQIw70pEgeWUpTVsqCWiHAAFoCI8gBCkbke18iSRhCl6DQjB+q4hFhSJsUIY4UUwwcCjs3rhymsDI5c9z5ooOE4oDmci8Zog1VckQo/rIYwaSNnpg4GydS6ZqSCZK7VgiA2C1mdie5HmmwpMWXAIsOeiCEEa0iRhnWDTeBO54gIZc9f5FHRtiq2LVyQAQyRTMlGwTAHfvYUD7+UXznIx8H9yM/Evkpl4rkp0JP2VFNDggm/UMg/0Z6QEv6L4EpLdpJiXZABKp0lAMC5VpiGhaP3hSndUnlf0C1HyOd5EYw88372Ker0gRMVjx0Hf9zdskiFy4FOq4bHLSMx8NiItGGR5TJmZy3HZhAq4XA25Xn8NYatE2VCp7J3B3Y9bdw0S2cLZsNFM8ouenJpBRimEUpnkBPY0XlVsJ7Uhn5mZ/sbWlG2PlS9ZTUpepxLIgpOQ5Kuvc98KmsT4/7acvY9BzU+Cmo93SRZHuWU9NGcn+U1GSiSPpRl1ryaSjFpGw7qRKWynaSNS3QTDFiC9/+FrjBFe5wiVtc4x4XuclV7nKZ21znPhe60ZXudKlbXes2d6f/cdvLGheE1mFhMfjJw6hkVsLHmahY9UqcCpdCLMiwS2HlpKFViLWFOiRnNblyr70+B516sUaISBANaWT/4prIEPFwC7tFfGs4Xxeu676Cg0wcZoNMENyGwaQT52zIWc6YXG8GGYvJrXqRFMnst63NIkKKXMMwuxVWJeEhTstCM4PLDcc8FLveeDTYWZLdybJzAmSekvO2lMRubYshQ/pGhV/ytilmavKxaU8L0vsRMIECLGBqT9rl3CIktTG5bWxxq9uz8JYjZh4JldncZq+5mS7E/MnAngNjCsnZKWZcKpydUjI5mcxOeJLbeflcaJ7Yb8uJniRrJXnbMot0zItmtNG8rOYzo1mUlnaIoTnd6ZVk19NGwTNPaAguRI2aKQYGcKh54p74yAcwrJb1URDdUtq2VrVG4/KXWbqQ/zDb+qO81jRZ0FyATA/b17NWNptBvWxnPxva0Zb2o8tiWywL7dolTVoni4bSSl65gMJGdliKfexxg3na6Y5gs9Xdbne/G95cq3W2vxy1kMZ2tpXGpKOtrTR/Y/ncYyl3wB8Sb4Mjit0HV/jCGd7wpsx7JVlu7SZzXeaSvnTR+dYyoymOW24TvCIDV8gdIGQQBz1IIRd4gi4OQnKTo1whpSDBeJLtcJuzROW6aErCb95zn//c4SBHLbWXRnShS0TkCXF5WyTHkJy3vOQCuQAVgDGFqB/k6QwB+s9zvvOtfx3sYYf30cle9ogkHSEulzkwBFKKHDSo5KWg+clJwHKDkP/cCiR4O9xTzrGGiF3WH7kDCUgADBcS/geHJ4EMHKH4uo8o74VvGRUInzGZE17nrbECzwHfec9/3qNmF/3oEYJ2qI9CCywfBeEJz/hRNH0KbL/D27NekMHrYhOp53tCPhISrYPe0ElJ/Os7QPLJG54/xZm9XDOfUKonRsTMl+zmgQ98sD57OYfSTfX/Q3rve9/0d8c8Qdw+kJx/sQNPrz1BXF57qyud8ZvmPpx7f5Kps17yg69817se49xBbuY6QG8kLyU4ryjYoAsSUAHhgDoILTpsyVheJifcxap+Ig+MoDpo5P9iw6BwwnbmqMA2w5VuggKnY1aqaM6oAAVr4gL/M1BJvGNcfIM9PBAy4iWZbCKX5EpIss8DRTA5QGPAAilHnsLUpsRWwAXVgCoIhvAFZ8QkcEzEusPGKkY7oMmclnBnFO77ttDsws/2fsAK2G4gym8Mf6AU2E79Vg7qkMH9rs4j3uL35q/N6o9gmk9wUg9mxGTlpM//BBBfAnAAkc8kDPAnBqAFNkQoBO2ezEYl3keXeGKaLDAIMjCLcIJieGMDhahJRtADqeSeLoR9MpBLWiM90ORIkMom6CpcnAqv9oTOqGITk2NJkuRGmDAziISukvCocgSalmSglGRGRtFLyoSNnLAWV4ZtmMnduJAZhS78bk8gSC4pxBAZyFAg/75oDnzv/aDx7iCkDfvO92pODqmMDnMj+tzCEaauOKzuOR5PcB7EOMJwWkDCRBJP8wjxJwIBEcPnyELFCcirVE6FSVSFVT7xVdIpMdLliRDGOQxMeNKFOYJglobADESDeQRsCtHDDWDwBYMwPLRDOArKIvMjEwWGCOJANGYEYAoDYegLMsjIE6lJ815ScJjFWSSMJiePJk8QqOogJ2moAnNDIg+DYrAjsVDDyGSlWBSGh1Txd2wyV+LLOeJrWN7Ll25wWZolVzqMn1YSjgRKWxxQXFYEXnaDnGolWmhSXmAsLM/HF/mFxm6gKC2GDnZhD4bg/9oyNxxw2prRL8/tGf/rLhohZPXibu8a5DBX70HUsBvZUA3pTjCxzu/icBxNqxwnr/Ua7+R+6B0XM/MKEwAJz/D0Dx6TIjPjER9/4gv6YgzIhqJ6LG2wYG3aRlDeZrRUQqyGhHAIxpdaaJrOSWZiLAa+g0us0EtsJ7EkZxTH5CvHYzhIAy4hpiTtjwgcy6tewq10JTunSUpQiMTqTGAqLHMe0YUAq1bQaimAEyGb53mcECZys4x+xCkNB6pc0ZuEqXh08Kq+c612KBIMKQsILYsox3Ji4g56wUfoDIpOBxeRkGHOirz4Ehhj5I1uZwjYE3pwbAgIrCVssd3+EkQ1zQslYv3gokTRrTK5LzX/W+0FLIijZuZ8SmioQsgR3Qe8TIipGpFKDOxhHuNJeokmKjFy4EhJ3oixPqMDxwTHRMM5o48k3SmhOpAm6KrDWIM788ZHT+JzyIVHbyESZZJHpAM9YyKN1sg936mF/ks+TQ2HpIJLFcyMuKnCXrFNbYhzcpM6fAiIEKolmkMPouIJpuNzvukIdyOKKmwmfPGK1ONCj0CNJscJ7zI7rlNWCvJD+S1FH6ncduL+BFErZI7HIg5TM1VTJcBUTxVVU1VVV5VVW9VVJWBFeQJOVoITzSaWWieEaMk4IJAl5Mx3POMVs/QzqOBh1HMlKhFjiLR2jpTGSENJnRRjYqISB0VK/2eCShG1NmKSmLL0c+6GEqQAWL0pJj8xTG/DwIrsyTSICHjMF2ECl/hpPo1JKrwVXHUwToOgm+6lTv2rJZUpvJSxNZyJxviUJfSkDk4BBNZUKggVq2QoSABUQt9yNIRDLtcVoJLTcqKzUnVE3ULUY3VrRM2OVKsvVq+ip2KwRILqNEAIMYrqE0OrQyvQdySjFGJIXgtHJipRRqxQsYg0RoJxNMDkJKIVJqZVXTm0wFaNcyRLW1GQXD4nczKnZm/h+shzFY0wB2UCLhULr5RqivCFTZUFNqKWZuFrdWporWx2X0+MFWGCq0DyPYkAEEjhCRR28torKnkIOl4xJnwxi//uamtjYBfGpC419kMkNNo+VnE9KWTLbmSBr2SvYrv8o7u+61+fI13NC2CJ6GwRBrAggwzEs1/jqwgNa8YqBgZ9FnV9oAOXdEaI1nRPN0qRVibiaynOMhJULSpoKMGSiSrHBXQrzCGfg72uVjpUzc5MkiNlIr/yiSFxUlpQbMGKCHitIHRfh1ZOYXEmTHStsr9otnjJFCNplyWLgaqgt4Zm5cKmw70SZ8Pu5SWkMAhBLGOAcAq5aiRVIhkNbnH7d2oal+weF/QiV4BzShWLIkXw1FAO2CnobGkL+JT8V4IbBYCPDoI7j4AvWCXkVzTgVp1EA4QnlkIYmCfiy2YRhYT/UcRzDVWDHWmCXzhCKljoWjjsMpiGbxiHPw+Gd3i3MK0sLkAKZkFqchjobJiIjxiJb46HlxguZLghSsEPpC6IIaIUruAKhFgsXAihcq8EaMAPDdQek7jQjFiMy9iML7XgPo6J1xgZnJghoHgk7gCLbSpcCJYUprNPw/iMmW2P+9iPew4ibIuNB1kg3BghRsGKryCKq/iKB0ITElmIR6EPpOAKbmMg5LhBrNhcm0ARBGKKkYEUSqAC0G0KyKAESiCM79gPL6AKTtkeWdmVnyPx1m5cRPmPS4mMb1mXd5nKKFOQ/45oACjf9A3j8sfbbg3fCJkiDNkjOLkaozga5xiT/wcCkWkBGe4Amq95jscwijFZEywZlEWZlL049whMlV0o8Vj5O9hxMn6AFFaAQ0OZYHmZa3KZnu8ZnydIHIMt2SDtf0wq3JIZgH45kypJmR/FhysCjp/5kue4irNZkg8AlPtAorX5khM5iiO6FLZ5gGJPi8cld/pPGulxMk6ZfPOZfuwZpVeapS1ln0XVl7/tmGErzMiM1mDqoBMkoSlioRfaoslPkSdaoqG4oqd5FJx5ofFAEfSAA+TPo/vvnEX6By6T5LRgnltaa1Qaq7eaq/HipX+5n236n2eanylu3wR6rNU4pxOCmdvCXIM6mg0ioiMaGT75p4+aA4AYmkuBD/+yOZxHGZM8mhRI+pzDJfFyrwJYWY+l0aq1FJW7+lK0OicQUAETkAH/5HxwBju/FrI7+4YH6N7CeqCBTdImrd+CObTXGi12miIouQlMoZsT+QqsmZKt2JoR2Yqh+Q5km7YrWQ+g+ZGtmZrFObBPuQRII5SNGwdaQwtimblj2fhC2R5zz4s9+1AkGycMERFfQBGpyWw0W3s4+2wQ0rrLG/S2TWi+mtJgy5grrqaTuaAnjb1VG6F5y9zOgq4jIr+BOSvY2bwzxUL0cUP4ESV6ymX8Iw/IALzoRWdSI3Z846cIhWfI+78r/OvQW8yK7qw7brVsorQDmr7ZmrUNZL8bApH/wVn+riKUl9vCKQS7c2I1/cI1XymzUYNQfioZi2qi3mZbXrTFfxyQUTTDMbzRXOrfwO2lADrRZjrEddq+mRHI2+zFs7tFEeBskOq7g8M+9Owwpmiihml2GinKxzzohDy1tw2+Taq0aRrXBPm02Xy9m7z0Rpz0yNy0phwnZnXGzceo9IXLjyRuJmpNMoCi7W8G7RzR+ZfIg5ky2XvXZDrXzDrN41zi1FrO25jORy/RbwrPmeJkTVE7m+SnLnASgioPCjIP4oCMSmvTW71jQZvR0/jXwu21HF3XakLfLp1qMr2mgJijYd3VHanTmWJyG2O80Ck3GlyZjuFrXVDCgx3a/6VNtyxd1ymY1yHikSu5k02coiPC12X9q1rZlqP9QobdUrKW3NPd2ar90tv67n59IUrcLGaiFGaZ8dTdxT1NMRAX3/u90Nhdzi9CEAae4Aue4NNsJKRAuNmwtrEYD/TAimcBiGUb3qtRkzuZkee4thV5qHP7AIxDC/S4MOgxuRnvIxykDR77Ha/a33XC3Fse5lsY4Jtc4A3e5gUB4SlitzG6roUYiGmbovFaqBNC5bad/X5dqYcem0Fe5AuWnOmxFGiAE0J+CmjAFFhcnmPeKF5e67t+ZGc+xGv+5gs+5ytC4aXuCbYdk8/+m5t6v7O9ket6tm2Po+9AuHfe46cUnv9hxri7mBNAIvbczuuZgusH3/DnD+zpW+zHfuDLvrWFu+jjmu0tWd4PgpIXfpoFQpIb2qbfc9wFPzoAvwJA//B5ovBLH/U7L/FVe/EZ3/En4uw9WYiDu66tue1BGcVHTprnWOWaWvNRnOldArGjAw+NQ/RBX7pT3yZOX/mbH+hWf61bf+xfXyJiHxngHosn3/cb/iDg3pLxfu7x3pnxnhaCvyUgc5aNe6qPn8Wp+4ud/yWYH/7nv+EWHcSh//uk/+apX/QAAoDAgQQLGjyIEMCUHwkbOnwIMaLEiRQrWryIMaPGg1w2evwIMqTIkSRLmjyJMqXKlSxbunxJEJnMmTP/J9K8iTOnzp08e/r8CTSo0KFEixpFVqCAoKVMmzJNauuo1KlBUZIqgQOm1q1cu2rs6FUimy5ky8JpKMrIpLBs27p9Czeu3Ll0He60STWv3r18+/oNmtSp4KVQ/xomWjex4sVawS4e0CKF5BQvBBjMY0xg2rUJoWRmDDq06NGkS5sGcFdiz4jIErZGPRBn7NeoaQqUOVt27Zy5D/v+zTPwYKeFgRvnfTq58tKOFweanAKWQShqFzjJgj1L5lJBrivJAMD65+Xky5s/jz55atY8Db5+f3v2bdwxb9p9T1vnfP37j/v3LdxwTxUQ1X//pYdggjA1t9gXko0xXRAEbTZQ/ylL5AIAZgNBIaGCHn4IYogiVrQeRD7ZFVtBuu1GH0I1oWRgjHoFKKAgxcnoUylNcHBURppcQcuIQibIoGICvMCgeAVRKBB3CFHH2ZBSTklllYyV+NBq972430b41Zffl/P11x+OZhZFo4A3+jdKHwfQdMcsOOnIo0xxCuUjkBJpsiNEUlxxxSwoTVFCCRU0RKihm2hRaKG7WGlakYqBYMhBHE6oVoUdFnQppJ5+CmqoKWG5ZYn00eYemGHCV6Z7qNYmH6xjsljmmbYCleZwax7X5psz3dkTsEC1xCcHD/Wa0h1ZLfroQQsdtEkSjogKmqSmQanZd5oWpCS13n4Lbv+4B5HakJYxxQfbbr29yKVqr7Z4apixsnhrvT3lOtiuU/UqU68X/AkkMm3+uSMyd5YC5L9XFDwKoIA2oUhOUuhxBR9XuNkwoIJe8ATFgYYH8MUZAhokAAMvbKxBfN6xsCICASxok34QxLLIGVpsc8Z9ArAoQwhx/OhVPi85RAcH3eHzVSXI4Ei0hLZRQtKGituStaZpKBAU2G23adbjUQ122GKPSK5r7aFYbovouuoi21u6am/cwSlVI2EE8qWJm1LQUoofyOyNDJ+KNEyLwX7HOQrEMxX7q5w7SdGHKU2wsnN4Tyjy78zF3jFz4ikrVDLhCsVc0I+C9n1AnCDTkvH/wxygfnOGfe5dLACw95xQtI6UIgPSB5WCQxVLTyuQ7jxLazsNnGjxwxQ0mJKVyVOPfZLV1F+Pffbav1R2uqoiV26XtaZoU/izwtuu3OrvhK9g+g5V8458avLELKXM8qPDEPPbK8uKL14wOzmuXw4r3N76Vqz8tYxjLhsI50xWub1pxk0ZElTrglS7YoVMT7abmUBUZzI3gbBJDrPZQ6JlChp0wHeXKcGjlOXA6JWiUSVQnrSmUAHgba96O+yhD38IRIx0b1xnO1e6XjWu3rjoXaXCD/jotb4oto84d9sLx1Qhiz7cgRaMmwm/+mYwixUOgHUy2AAlxjc/aHBmDGQg/0EQRjKCSDCEB6ggtPrUJjcWBHZ2pOMIO1iRC1RBhQoZ2hujR4qi8UwLzdLhQHSHQ0cG8SPWm6QlL4nJsA0RbvwxIqtkRatWscaI3rMNFOVVqyjGbYpNeZ9UIKcIPABOCmfkFy3N+KMxBi6AhuPJAdW4I1raDmJ6fFnJCjJHZP3xkX164AP36EFAKmRmfxRc6ZjXEN+RYgXNEppmkAfDDEVvkc06niMiicioZbIilVynO98JTyFtUkVFdI341HXPtZmSfFzizz6h+D1V3oqVAyrQXu6wIx1FTIEYc5jfzCiwQClQZIF7WMRw8stiZawPlyum7UoYpJDtj4LLLJ5D6/+oMJTJTI6AIinpSKix4mEzIYIs1KE0o84mFYqQzHpjo34AyRxGb1GEjKdD2mnUpCp1qaWZZ0AFCtWo5oWgdjOoVBHzED0+k3rPYipHvArWsIpVMU5d11XPilZc0a1urkxrWWtmQrFdZZxjBQBS64rXvOo1JG7tq18NQ1UbVfGv5trrO+9q2MQqdrFEJKxjH0uUwLYVsoxdJ2K3twAqFKOynO2sRiAL2tDea601muxjPWvJyyZmLGUhy1kSwiSCWAdDFtmEFaxABEoMJLObzQiHLAQeAOzBBxQRxYWc8DXUKvd6om2uc2Ui2cGuj049wkgul/sp1dYFMtCpzGU+E9v/3TqBthchRW5F4hngCmS4xf0OcsPjBF9gd75Ue659QRtdq/LKTXA6o0yoK0A8WZeDGamZB+coEqUV9SAKXiEN6Upfgmi3Ls+ZjHQ4VZ3rZOczWsvChZzVW/NSohS3tUIvBiLiJt22t7Yr8RZucQc43LZrnDLGZj4RgxnomAaPWsWOGyHcOOQ4B9nKABTkyzMsIDnCTAbVfZ9M2PzGiF+N84mwfuKV2g0EwSDpaTgNQgrkXcaQTbbreRyUAghxqmuxzYOEZsvg896BxTzbWYod2NtNjFchm70DEiKh51tYJzsfPgh7NRMDIK/iBpLYQw0aoQAi3PQg3SqzpadUFbNC/3nT/5HyXqjsL4AV7mQFO1jCCMaj1rVMYhSzWENjyjGPbSxk1IxjCFGNEIDZmYIf1Z+x4EhSnPH6DkxLiCOnUGyD4BBayKvp1O6wAaxUodi4W+yEt4skBMj2vZjiDJzhbJAFPEHQ4zZZif+smfPiuXh7lkKfNyvuW0jk0ABYBZF5doRGHJrelHYCjS8N8A/VM22cLvhvPK2XvB3gl38rnOAI10vE/W+XZbwyRiM3ucq1EXJ15sADPbfl0OlJmA1BYAkhZkwUk5SasysZsYl3tB8I8gdilu0ToJbTD/ps2cwi9lWE8YRHVVux164LpSzF5kzBF0PgNkgpikGKN2u24//p1u26w0OF28oZ3uMeNHYKbRB627t4+T40HYj7M24HfO0CL6v6UmlwqCLcKPHjwPzqd7+JjvRN/Vs1GavsxQI2HIHy0x/mLkezzkUwdC41WQE/eFI6yvGYcBVZSR+CtCpUwHjXXBYjZSp0RjVqF0hLZAeC7tmikwZbJtOW1zIE9tIR4Q4nzuyJ/RyJqtMsxOr+INflHZE93NtkiRYuo9mriSOUs3RKZrvzPTRwsxW2sZw0H8Hjrsq5U+WKWdxiF/vFXzDeQYw0+b7Fb5LRYLKxo4iv0ONDPsE6Xj5xLoMdsuD/wZf2cSIzPFSYYb5bqKcQNxVOnKdzpieAnKV6pIH/NQDQYZkhCluzZ7mGbi1mBW6wI6RQYlYgIXewgb2QWSWWW3NmOcAHEZqABDr2KHvwY8K1Y5PGLfH1fDOIING3RFryRE2Eg9h3VtpHFbAkSwZUS/x1S3GSS39nJw+lE+nHAcKkUB7FZfinTPqnGTuSOfEnR6QDcg5EhS+XO8gzBUOlBeP0LD3VUy9jSKVXNKi3KBC2VwuIPU7CMxNIEvxGg3cYIkX0SU+1IjfISScifTwoRaSlJtKVFwj1OorDUAfQOg91Jw2DPyXEX/kzcTTBhBvFfg0EU3EkUoPTeM6yMHrgQfenGa4zMnFUUl5obDtlNIs0Ts5GgHS1KKyohqf3/yiClGyJBYfXY1sldmImYYd4KIwJoodrw4f2cUSxgkSnBIiCeFU+KFoQoVXRBC5fpovDiI3ZiB7F6D3HaErv0i7d+BHOuD7QGFoRAVe89i1E1YpEp43vCI+mYYONNY/u8knICErkmH2EqCuG2FzxCCm7CJADSZAmUY/0hIP6tIeqopBqg5D6KDfmCFoFOSUCSZEXiZEXcZDeGI4U8Y3rEogQWS8SSVkZKSIWaZIpqZL02IfX10lI5JANST7iSE9tA3cieRgkaSsAVhR5ckwrORcoCZRDaZLTx5L+NJOnskTzIiZuQ0o42Wn8mC/+CBxUFmA3wZPnt5EOcV0FRoUPEf+FENFgBSmURGmWBQmIN5iQ+biQ4tiRTKlpUBkjOvkXVglRweJfRvkSl+cQYcmVn2eN8ViWClJpIMFbZ4mYTZWWD2kvHCmXcymV7kOVRwFqbpJSo9YHqAZRCEMLCsMwJ3dR6NdqItM6G9MxsEZrp8h4uPY7FqVqKAdHerIyJBObKpUhueh00YNsjnAHZFAonscQP/cyC3ZpgzkXrNVar+UQWFOYFdGLvXeYvhUE6oURdACDEJEHRmBc5JWYGZlpN/mY4TkTdCkUCsdwgPNwAcM5ZkR/SHiXS4hxlPM5G6c5O/Jxi1eKIfWVHrV/BJFAH4MsUaiKMTdz0vJygnQoQbX/ZcRpacYpF9w1Gd5VEA3oewnWex+RXq53EdZJEW62nfC1ZN1JkOJJontBnjxRd3dnP5FoePwjQn4nE+ZXS4LHhApETO33QYr3OcnUeBf0MgTWn60jP5WTchOReZtnoD7DQjPkhmznoHJRYZJxYQTBeqWwYbazNR/UIZrABMG1R76IYupGYlbAYmNqBS8WYzPWGTamdD42A49GfG8KZHsgZDNAZG7agm7KaPWWA0QgpxkSBFwaXJrQfCI6oiWKqFJxokDBfVrERbwkMOF3OOTnnlo5E0zIcW2Eo70GpDwqf1+5ZRw0Qv8iKAlEpKBDEf1nMkmKhk2yAUKAh08qF2im/2ZUuinGBR4NiDWCajv/Vjp2dqEkOIfy5m4Z8meB5nUexp0DgWNARnaKdnyPlnzNwqGaoUjCV288Jlxo12/JZajamKjhiiaRSUX69YN9EEuzNIRvUoSRqEvmp4RoRHhNeDo3qomoqmyM96nLGTNb9S9BgohatmX6N6AqA4ZZ4Ts99X9dpRC42aBCciRJonYZ8hm6Oh5H5oAhOiHnlnsmE6x51m7vVoLBx63ZumPHR1yRRq2TxoI7dqfD5xDW4avfKoziarOAQa6tNJlHgYgKVVEtxYgOFWCQOFGTaFHyCkwcgImHd6+1GVIt+oml42sm1TK9xgdD+jmlaJsF63SsmP8hjZKgWhC2Sjo9ACercnF0EXJ1Fotigap03DJ1mwCsVlehWKd1ukWC8ZassTcQ/DZ2BMFeKisQ1bqtBfG3MTuxNJuNN8u4o1U3VfVk0th+W3UaLOQQ/7d2Zxsa2FIKahGB49GA1nEK3ioQtmesHXtndZu6FDuyELEKcEp2yxe4RECt3NqsBHG4uVOoivuOjeu7ObGofYWOkacclpsQhLJ8xSkqGjJoRmAHmZEH2ZEFSJYHfPtGt4WBkaCBJdaBHxiCd5u35RZ8ebpjxDW7zYJjf9qyM3AoudtvGsu72Hgiv4uowetW8RsphiWHgYa//bsSWOaY9Gtw9ptW/jsamkv/Pb14W79owA1MEgcpwCJJwGjlwNVSwRcsv/qxKgHMLqjiTxEsdzlbUALFk1h1EV2JwTyUwiv8fHp4j8zYkiQCwhEpwpBrIHZ5flnpOOAZkxOBwiIhsA8xQ1iBmAjMwkdsVGfTGjXhRIupIqI0wwI1wfvCX4CHojvMw3MRxGgBhmS2kkaMxGG8TvUUjt+pkVFsL1OsE5V5AJcZqZppap2pma+piZY4mq/2MbGGmidVM6tpm2BmiuMHtCBjigrBoDTDEIKkQr35m7bjQrc5LUOXjWAsxpU8SUqMT3GZgzNZSsYIw2h8HGqcE+aZRg23S4OjnoczC+0Zo7wELAgJOZIj/58BiDmZap86KoUj95W1gzoBi3LCpGXO047KtnlaQAZFc6CaZzs4wHmSjI2ULCokkBDSDADUbMnXrMn5oYyf/E9ERH08DMoHV8OCZa7w4zoqmneg6aKpA6MUB3haGzA1angedZ87qq925KO1KUKmqQgZdKrHKwyMZHosxEKEcp2CmVQkoNDSvNAKbRDWbM3YbMlkXMZp2U/4uCrhbCuijBON6n2Q+kWTGjCVisX9ganrx7Rv9H5FOoW/Q412xED+nLXZ9MilsMg75zNQ4AUHDY/QTB4UmmTKihDUzNADEdECcdSYB4FvG9TWK9FAqZcpMixmo4MabSAcfXHpKoQ0Yf9LcmKEI+3OSYg+l5pGGlSvKY1/yHTPl2dNXGg5tRxSOyPMsFU0M5chDOFlzPx5rtjTYwNnQJ0H8pWdk2AdIUrU1YzYRN3Qix3Rclg8XWoyTB3YGZJh8PvU3hnV4MwuSYmMGG3VkPm45NwXPauIJ9WIQytRkvgmlOgyGFXWGdhSmajSj9eJLd2aMaU6bgRHs2zIw9xCRPy1NmU7xTZDtzhtADiMPl0ahFqxZIAFWUBjFEKoS3bYiv3QiH0ZGsq6ka012i3du3vZRTnVFa3EatPNTPnZVz3OpuVYkttAlDsXxpsQgZncYTPdDnQhXMqdbiZen1Hd04zUl8HU4Pa5Dvj/Nfxduokb3hSJZf2UzT28jPXx4Omdk+u9syWJecRbF/KtMlpwyMKo3KLxoevWdNSZ4BJS3YtNEIeN3Z3yRreaKQ1o4vA1swsej0ZxRBT+XFgtUDbeGPa9u8w7gRbCnd3C4iuO5IlNM2/bdBSCNUS+baTr4zeO4zp+XzyuSlP+EiE+GsxdoXA24sWzuw193QGO1EldvcEVW04OgbF331rO4FYenlgeRXBeNX69Z0KeC8k6vYWd5IyN3YEO0S+eNSHK5nzuC35u52gp549J5zJyhJu86CXB5aFy5A5t5kvC1JOemI3u6BZezkPB2kBhl0YR6bKxTFuMeV58TTXk2wZ4/8SV7imYPujVvNCc3sCeLpdYbak7Uep+0Z9UZ6SsDmaK5J81F+u4ruyXpOtQidWAIxMp5Th4IGsppTFoRNZ/c+0GQzK/4muCLDIb5EHOPKE/wChiKNzW2orOlmxc68CyvuzxXh7NjpOiXHl+c0v/+jcYwzBVnBNblEeXcyf6LhPQ7jn/Kjv9jHJBTO40wzQIiqDkpO6tynnu3sBcUAgZr/Ebz/Ed7/EfD/IhL/IjT/Ilv/HIYPIpr/Ir//Eoz/Ik7/IvL/MmPxMzb/M3j/M5r/M7z/M97/M/n/M1r/IxD/RFb/RHj/RJ//LPPkYMFGDo2e++8rOBYkZ68AQccPUbpP9LBm+FEpTbiKfqy6mkQCVmy2YyimQ8sM7CGK/0be/2bw/3cS/3c0/3Ny8TOH/3da/3e8/3fe/3fw/4Hs/00X45T+9wUb8TfaMHpsAKfeD0rh2jQgvTYP/PYv8ySEo8Zm965sT5Ycz2gQ/6oS/6o0/6pW/6oo8Tp6/6q8/6gT/4BS8nRwj1qQapNzEK9XP7IhSv2Y4MYFQTX+8ybS1TxK5z5BTx29RNihTxu/lBj5zCn9/6rE8CGz/9Ml/9On/9H5/9IL/90e/93w/+4S/+40/+fv/6U+84s1/w234TppM5yJBSBdOJRTv57z3IDe9AYItTwq00AFGiBA4ApQQKS+L/CEDBEj8WPoQYUeJEihUtXsSYUeNGjh09fgTpkUshkiVNnkSZUuVKli1dvoQZUyZJEjVJFLJZE2ZOnipv8syJ8ibLoThp6sQZdOZSpi3RwGoaVepUqkuRVS2E7CpWrl29fgUbVuxYsmXNhi1QQNBatm3ZprWlVe5cunXt3sWbV2/eO7O0jmrCIeRgjJu07CKcWPFixo0dP9448uzksnLtBEEJJQtmnzSNfpZZtKjPoT89nxxdEihSo6NTs4RSrFDsk6myKHFVFoQXLlyeFoLT+zdl4sWNH0eeXPly5s2dw0zrVvpauHutX8eene6oK92bKIKc+E6JCuHNn0efXn1I/8mFApUkRDL+8+ZOfBW6fLJKMSicW+3vajWlVhLNpAJPQw201pLqyST7TErliNxoK0mPI1JZIrdCMNSwKxAYAGEMEOTbACoR6XuurpPuWklFk+xCMUYZZ6SxRhtbim46t6rTrkcff6xrPSGHJLJII42U7IsU2oClhRZgcSOFL26kDAvO7IgAi81M6s8kLGRTTcDQEmypNAQPVJAkZGra6qis1pSLhLlasfIkCqFAI4stSeKwQtxUkmupQSAgZAyoYDlxEC4GobJRRx+FNFJJJzUrRx3fKiAuIDfl9LojPwU1VFFHnSjJJUFwMkQpKYVpzpa+rDCL+5a4j6QuTarCP/8DVQsNKALJ3PXMowT8yUw0YT0pQ1tx63NDZUvCsFaUduuNixLRqJYLON4MFFFt5TMUDjTQYJRVc89FN1111y3O0ksF4bFTeeedi1R778U338XaG/GkftllKlqT8mvlQVt1JSnXYX1lUEwEHxaqYaXQfO21BRfmk1aUCJ4NzGebhTYLMLmCgAsIYBkUgm1PBLhll1+GOWZW3b00Xnpv5lRfnXfmuWcA2pOZKmTx48zg2RBWWFimVoupYl4hZu0z00AbbWiSnu34ag1Bdlbak4KrdtsNqi1RpRA/BAEOL0Yc9NCg34Y7brnn7opmHW1GZgoSfsC5b099BjxwwYUEmu7/meokmiSjbyXJamItLnMmm4BF82LWTMMcJcQTL4nCj7HW40+v4IBjkBIH+W2Dcg1nvXXXX5fZ7unwRmaUhPzGHa/Bd+e998QKh72lBwl+UDM9Zf1v5F1de+lxyI1VkOKnJ/cs6jRLMtjorFvJ0LbjhXC2Q0BnUrS3sgvBdlF080IJr+AlZX9F99+nf1LZpaN9k9tz579e3/8HYABLVT+zmOlpY4ocUkqzQKZRLUGpmZpK9AC+5oTIbQTEYAY1uEHj3G9HmarLBZ6gi/6VEBkCRGEKewc8Dk7lcm5aCuSIspOU+Eo0N2xhDnW4Qx62zINtoR0yLkCFHJiQfypEYhJ5/8bCHjbRiU+EYhSlSJYfYkpTcxEhCY2YOyV20YujYuIUxThGMpbRjDusInVASBf9OWKLXPxiHOVIuDPW0Y53xGMeY5ZGeK1xLm18I+7mOEhCQoYLhURkIhW5SEY2EgCBhGQkJTlJ7PCRdrZzIyXl5UhOdvJnngRlKEU5SlKeR5OnRGUqS2hJP2pFb3xTJZBKOcsuHpKWt8RlLnXJyVj20pe/zA4rrwjMTe3SmLuz5TGVuUxmNrNnxIRmNIEpTGnK0pnXJFUysfkQTWDBF9sEZzjF2RHdbaSa50Snj6iZzuyM053q0WYzF+CEXCykm98MSSmsYIViOOae/VkIHcoDkv9V5CAke/BBRPJgBFEsoZ4aIQURKFGRBVDBCkiIBEf6UwolZAAAe5hBSA26EJAiRgFECCkNEKMJJKS0EQD4RAxSWoGT3kASH00oS0Nq04nQIaWIielMSTrTgtrzCI1oaUoTqhGfzmCgiwGpSB9SUgCc9KcA0OkMavDSoIa0AiwdqUCxmlSeSqSo3EyqUz+aUptG1aUaWYVUGdPVrS4kpkuNq1StGtKVpjWhVP3EEG7aVJVOxK14fSthZ3CDrnoVGXnd6kkNytKlPiQvPvWBXIJqU3oJVC4CdetW8zqDIiJDsTfQxFG14lnr5JWzjxWpEFFaAWTsobR6yapKP7tVZOT/thG1VapWQtuIuNI2tb/t6m3nclpJ7DWze1knO//2TuoaUpnzfOhCsOuYO/SzMZpgQi4ACgCxEnSkH0GoQoPQ0OxiJKITtcgmAqNRY3DUo+llaXlOSoiEnhSoMdjFcQGwirp+dKQnHQJiEErZi4h1D2W17VQLPOCRCvikT81IhFOLGKjmFAn6JQJ/q0qE/wb4qAMucISxeoQhvFSgDLbIWY360qlW9iGrKGtGYupiGxMmsIMd6R6EIYSbnpUOOfAvTAG8EBzf9KNDSOiP6ZBjw+b0CLuIqYIhPFKtbPgvS37wSXkgiVUE4bmWtcuF6fBcL9u2s7Rd7S5kC+eCrva2/27urWpNC2e97Li2mfXzmgsa2B9b57i15awmhCAH46qWwI1AqGyfe2Gt4JgHeW5ETPmMFzybtoj5ha5a3qXGYUpXL9VFtWPiictuGuMhxnMoAPKgJ3zGxq5GmMREKrpP78q61/rcZy8Wcod9YrSqFrVCECgC3lzkwdXkjYNMlxpVnhYUpXVNbkBDOm0ftJTKNW7pSPMQBPB6dCKb2Cc/d53uYmyCnguRgnflm1F487oisREFrnEa0Cjz4MdJJq8PLEyEgap4vzzAaZMbXJ4dk/TABIfIWQeOYU1TJMl3VbQZ+CrZsS614hRJb8Bh6m/BAnzNE3e4UUUsUIXH+Lwrpv8xSXs84BzDuMojtikd4rBtFCu4rjaXyI9p3lwiNILEFLZrDIzO4TUzGcI+KHpgN3wR/B415ABXcZevLNyl+vcIcdhFHwgRZN5e9rl1Nu1W9xBt0sJWznso+5QlcZdIn5AOcqb0Y0vr59qW9tB7Xu1r64L2H0e6pqvwQWBJ/FnBs1G1fkZ8nQ994bo3ec6VzsHdj9vpvOD572jPizBtMXrSl970p0d96lW/eta33vWvh33sZT972tfe9rfHfe51v/vYr5qW93zIuKv67oVAAZ/5zrWzKRJviXRXIvOeN0RKoeyHiOJ4WdC3ROS+YYVHOK4KFviVkZ7eC3+0ruWNCNz/G1H+jDgfIu8Nfj+jj9X5+vrYvZjn8WItkaormKYkxrocEDCRMzDtIrGiQ6im86lvC6jyULECVLJMk6kKGC2tein2SzoMg4jjIjA3EDgkSKgm86+QUzINhIj++6j/24UAHMCmg8DjIjKBUsDFcrKIkLGxEiq3Oq+W67iKeDEkiAPB2j7xK6gBBLqIELqm+wSESy+Ju7Kjg8CWQyghC6wmyysOSz+hQr/yyro8k7M9ewiBEoJPiIP1Qjjz+y2zk7mT8gGriyyC07u/M63GmwuECiz/ujy907ov9Ly0cqrAmzu7sDy5+8Eg1CkoWy46lItDwzPNO6q/W7O687O8KyjE/zsugrMq5aILPCu02hEsvYiudFqIvUi1UlQM3ysl9nqI7dqu4sMn7GrFiJg/iHA/ACCFdMOoitqCW6g+K5Aojigv0PI4wbrBsyqovfKqfbOIkCPBi9An6lsI+ItGiSqFXou+dQs2jXArEAM/FjwxAjQ4EkO8BBxGSciqpWqqHFOxhiMvCqywE8PAwjgCQmir8HspAYspBqyIbRyxboRC22rBaXtHSKsAGSzHc2SylxtAmTMrfaQIgboyKRuoYFQrjci2ffsxJ9yFfxwpKRS4MRwChUuyqKqr/tvCguMyL1ytpxLDC1vCURxFNfwzgtu8hPqz1frD65jCINjI36JEv//bur7TujRkrb1oqiCUBIjEsk9UvJzELbKau0N7MT2LxOeaRDjUu5NqhKPCyjrrKj7jxE/0xEDEi1BEJzQrJ1NUy49AxVICvuGrp1g0voeoRlGARlmsP1r0roqSv/rTRV6MRl+kBOs7nuyLCLEawXIsxo5EMiisMapDRxO0iGecRvgqvluoA3qjv4xagCcATO1yAv1rr8esPpnaKZOzxxFDSQMMsEXzgXUUrJ76KhCcqndkOnecMdXciJoarNRsuMAiso1oxsa6AdREuRc8qiUErZESOrNSyG9kSBt0SMMqrCZDTIgjLzCQTIpozhFLKZU6qx2DQhf0SPIShCFoOID/S7/IvDqOjEkv+zPWJLITEroTeiSZjKsvgzSbXLPV0k7sKChAWAVhKLo8JDylEy6gJMpNa60iKqnHsqmTioMc6MS8kEPYSikBVC3KOzvO+snaEoaj6k89pDsFxbxQGzVSMzWIyIu1dNGOaEu3/JLic7U82D8AmEujsgN8kgi+bL69pAJhuwNjewgpEDZuysuFi0CFOzKkK81GACsIJM19tDIshKhfJAUiXYhScAM/2MD6u4O71EYbC7lLRIxHE7AHc7JwVDAw+ECGi03tc8AUOy81bUcnvEDszEAqVTITeykNu7IHvCs+JU0zRTEoPTE7Rc6X6gPtzC+YilMbfM6Y/1PGiKs52uTOkiOChBKrhgNI8Rurl0PCSG1OljMoNkyyR3O6NY2yIBDCU3XME6xST92y9wxKWi00SL0p9dOLpsM0T9u3qftUDks7GrPPG8sBcguCOJg79isqNrxPz6NKOJM73Nq6f9vUP0O8QqODsquLC2UtqVMtNY00UDPQTwuC5AQwErWLTutPcw09URu1IJKmiEjLF8VXi4jRUtouwjyGdzOe23goKOioikA3eyO2dBM2YHODwLjFffrFhOWnjSAsptupIhNVn6qBsfNOC6xUkBMqjZAChS1Se8MqKzjSg4VYSlg3LYXMVdRTgUIpj80qnmosFVSyKDNNfbzOCv+4WW3zKjzVzdLczo4tj5oluv4iggpDAockQQyU2bdCWiWbKQErLqqlwYmowABLKwecOR48wiwkLaCtzrr6vhGbsFGtwQesRKXq2J/zq33jTWS00qkKWWpb25SET+CiwVwVOl69C8U604vlW7VS1bNdq4E6VvqMgfKQu+EaraVK0KFcSUC8i736Qr4tIslrKTgDKQZdRD1TSdnaBagsXM/9TuIqrW79rdHSxDq8rawCXbswy3Oy17vI19ytiH3VXWySRlNcSItwwVtCv2UUVSS6V/+RiFOLSZh8pPTSioqoHaVz3ui9z2OV3sWlJL4zNe0IRUCai/F43bxABWKgC1X/YAAGIIMOuA5QWN+5QN/0PdIWXYg6ONINFIP1tUj9fQhUSF8GOAaNyIQ2gASJqAP5NVgrIAFd6N3B4d0GTqHG4jnIuEWXLcXgnYiYOt5SKt5za9oaVKLklQuKYN77tFfoxV4W9Sk5q177HGEW9R/rvd5IWuHuVSd5fRebAV9X+oE7GF+8KF8smgNIuIA5MF/rcF/2rQv3hYQStl8DbgP+dS8pBoDy7YgBLmCIqANiwIg7cAgIFpwHBuMxJuMyTg8RluHbTUvrdWE0I2HnfaTmhePFbWG0tOF0+t4kGI8Flgsfzg5UiAMxAGC6CGIkJoMDBoMmlgtVeF/6BYA6CGQG/+DiASODJN5fRC5gK+aIAZ6D9K0nS76IOwAGMt5jnirlDtAfvZGDvbkDCCCBHKACGXCEIaqJL7aDVd6bijAIEpBlhqgJBqZlMTbjYSbmYv6Ie71eEnZkNzbh5aVje43JFG5mOZbhO5au77WCIvJjrdjm6/DfXMiEMcgFuSjiXmhfMTDfLdYK/wWDcXbiRGbicM4FUHYvdH5kLmbndhZgMQhgVAhgVYiDTk7kipiCUQbjUsgxhO4AWRNAK/iBKbiBU8iBO5CBUSCBYRihKXCIIRpliO4ATMrghFjFEZI+gxJmY0bplFbpaA6S5VVma4ZpacpjNyqF2+pm6wjiInZnZP+og2PAjiRGhkL+C3F2YmHD4i2GKSq2CEvWZCYb6MIg4AHrZ3325wwmAYMG44KmxS8ehSFoo4KuaS/u6g4YIZKWNYfQ6jaaCC+OCL3Baou+gZNe6bmmazBG5ouI6byGpplGhpru4x++i5yeA3eug0Y2ZPYVaiGaA3N25CfGYkH+X32e4oVuaqyKaqguYFX45wBO6oWeCK3Oaqw+62j06oQA64n+gbEuawYe7bQW6eb74ra+6uqTa7omgYkAioe4bY7YbdzeiN7WbYgAbou47eGWCOPWiOFW7ogw7t5GbpBwbt9OjOcGgN2m7rrWmbu2CL3mbl/ia7/mZuUCBXQGYvP/1emgNuze4me8AOrEZuJ1bueWfmSjvuzOtid+rgimnuSFQAX+PeAsfr6o1uykzmTOXmvR7t07SGiemgIBNG1gCOvUFqyMdgh06+hRVmsAmIJeLggOV6jY/iTsvgjrXgjgNvHg7ojntm6eKHFiQfHqTm4YJ+4Xj/ESl24ZZ24ab3EWz4gTz3GPyInqDvIfx/HGsC8Rb4zuVnK9/m5tzglg6LL1DmzzHuzxjuwmLuL0nov2Nt98VuTHYgDGVl7Hrm9QznLPDjr9tWJEluJvXjYB5+z4VWpaRPDe1RsSYPCasKmvhnDUVm1dQLdahjcMf+0NV4hhqwlZDnReVog9rm1G/8qtul3qGJiwpiraoHMoJ3i2iijuIi/yTr9u3X4cG5duEif1G59xIR9yASmS6E514l6N487tHrdxVxfuxMhR0HyoI0fyxVjyX7fm2rWOIj7iTenpTnHfnX5hjujpxEBfAGcMtu51JNmlNJ1OS2VHQJV07uwoTR8+HlV1Vv90GA/146YIU0dxFh/yHV933+50Tvd0jHBxdufxU7d3Iqf1e2/uGgd1GXeeUN50WzRMuNSIUhj4ac9eYFd4dhJ2vUDfYv+R8fZpTjlgZV92HcPvwSjip/YnBWZt3X0DCRD5kSf5kjf5k0f5lFf5k3/0RcJH6g1bJKTei4uBj9Q4leI4Bv9rqAzI0be89XcX9SAH+poY8XPX8RUn96Rf7hG3dXqfdSHPd3gv9XvXcXmncaD3dKKfeqTP8XIvvoHPdVjLhfwrWGYbtmdbqFxD+O1e+LY/p4aP6bXfppZXpDRl2pmT+Xs8qg78wBCMUBJrxh719nSn+hN37uv2cXY3d3J/+sQ3+sPX+ls/d68PdeS2dctP8apnfFk3+qTvfK8fL25iAnMTvlYst7Mn+C0tWLmfCLd3/WiCe5hm/Wui+0Sa2o1ouNSiR0lYsBN7+WsfPurD/HC3Cc+X93rHd1J/d3Qn/nYncsuP9R4f9X9vesafd1m//hYH8lpHflN/7nkKeNQneNP/H/1bmwTkk74bnX2Wfv32V6XYt+b1b6baRyQMtsiZJwKeOrkT+02AGCJEEoCCBg8ucGLsoEESDA86BOBw4sOKDCM+xAix4EQSHj9W1GiRY8OLHjOOTCkS5ciVLFNejMnxI02XLFdqjEgxJZQgBzUxyVAwYS4ARAsCFVrQTq48vg6WUqIUJtWqVq9izap1K1etyL6CDYuMqtiyZs+iTat2Ldu2bt/CjSt3rtkCBQThzas3r11bdP8Cdtt1MOHChg8jTqx4MWMujB9DtqrpSCOGmpD4gPkpRmUAezJv3jW58p4cACbvKj1SE5anM2vSLElyp0SbG0nKFqlTIm/cuHer/2wY+3VNiLZL2qYts3fIrLprM5cNPSTI5RhPUoViZFLBUj4NQlmYZ0nR00ENljrmZGqe7ZHfw48fOa3VwPbv48+vfz9cu3v/49UXfwPGJZ+BByKYoIIKOragg1yNZhlmI202g4WmKUCEhRWchoSFN0iSYWYZmvZQQq6h5NJ10mHXkkyw3dZRcb/dZtGKL0k3nYu+1YjTcj9W9VyOvrX4YnE3MnccAHksdJRBomSRhXq5sBZlFu6x9h0Apbj3oJdfvocWVgSSWaaZZ+7nH4B7CYhmYBdIMYtgYNJZp513LtYgnns+FqFhLRaZ05AtwVZkjsBRlChxwzXHo3AwXiXkkP85Faqic8KZBGlXwOmoJHpa8hmqqIyJeZWbp45VEKqruqnmmnwV4BdgmlxxRROKtDVKHwfABaecbWF1Rwk4PFlCCTR0UNAUxnJ4QRUlcHgHsaNSW621Bel5rbZV+TmYoTP1Vp2OWx2HXUePKpncoNE5Sih142K646OXyruuVebmJu62+/LLVan10fcQq3IZNLDBBLr6qiBt/nXHr27pyutcqqp11RQ/SIuUFrssSWzGm2xcCg6kDEFysv2inHJ82arcsssvwxyzzDOTetaYaxV8MFw569yzfQm/yjBdUtACFpy1/oqHHkgfXesVD4tVSq23IiP106lK4fSuVde6q8b/P1CV8ZbTTiGDI09wTEoJP5TyAykwbMGxssjSXLfdLNudt95789233/L9WxVbPPuMM8WFIy4X0GsKHdcdTl/hBzJxIgNn0VLsOkoTHCATMVoXPIGrWA6nqioeuHp+hx9fhz3tHT84+0MSnCThSCkyvA5yCS+AbdAUdP8dvLV4C1+88ccjn3zKgZNlOABfHQT9SKXnzBD1MElfvfWmlp6494sD2DhcxpJfvvnno5+++uub3wL7JXjhxfvzo3A+G8rj7yDx+fPfv///A7ArzMOe81LVvYoYsGACE9gBVbVAB0Lweg3Unve+dxeFBShWgSHaV0AnOtJxUBOb69zW1JK1/6J9hXRPklwKoZYVsZUCWgAgRe2qQLeLGeUJbRjZEE4WwB9CZn9AHCIRi2hEvf0LLNHL3uAotr3nGTCBULweAqOowCVKkIpQFFwFEQe+/4gvLhz8CuVodbmiiZBzmuPcWkjXwlSBjo2dG6H0QNa7lIhtE7UDwBQ8BjZSrIBjr2ubyfhotiMiMitCTCQjG+nIR3qpVA2cpPMQ6MQtPu9w1lPiJZm4ySxapHthwWIXffZFNmkQMGNEBq2QRkY00jFrVytLK23Fucc5jRZLchrVcHkFXZ5GC3esiLDIx6EYHitZzmLW2IIpwyU9E5LSBMAip2mRhCwkVKPoYQ51sSBsWv8znOJsnlmi98DDBcycEbRiJiGoziVesp3vZGdKJjjFUvbslHoJIz45WUkD0dAR43RkNQc6FIXgMZuMAZ03N2EFj3hTYxGd4R61IooubQWcFMKoQTtaRElekZIVc2dI2UnF7LlTep4kKSZRylLtobOfBtMnrGQl04khaFly8+gRC+o/J0GGSVDh6GAYuiRgLAlEyhpmx6jiHYZAAUWPuSh3CiIKqfA0q/1LIko5eU/+xDRxhLvpwGiaQZuSdWdaXetgfMo/1mQzIVHSUh6itB2g2CFKTylFlLI5GShkgTxQshJ5ltIlHG4JRK/r5gw9ckg+fmSiM+SmHgX6k4ou6bH/S8Hqk7pU18Aqha+gTcgc+rol0y6ltFKSq5WyGZWpsDW2f0snAckUVsSNNa2oMuvCUqnbt8g2uFdxK/5Yg6KnDrWqp8HCQqi6FL8yd0vuESpDXjvZZE0BqYtlaGUT2wGxoe0gMCwRQqiA1ILcQbPtUe5zkXKeJ3HWKE7wSVLaWxDtTAIoRXHuQa5aHuECuG4jredX93PbnpHyt7u9IAb5qWCbBTjCDyFu8vzb3yspN6o/ea94/Xqe+lK3uuThbhGStV20IdMjIAqvUbvzWJFVJLsW6clD6ivfwtr3oP81SIg1DAAN8/fCUpUwkVH24CMjWT+8dTBZzQjhIkuYwskz/y5DoOQeH7sXtvat71WFEmL0cLZtpTjviXUBY4MYtcUxnOiZERJei6y3wwxJSGG/DFQeK1TDJ5ohUS0M5T/zK8mCHvRcluxburSSamzx3Kx+aTOHWWZzdEImUwGdMilPObob9jJGbSxn83j5O3kA1ZI6XYQ5WDZjwtIFyCSLw1XPcGOXtaxBuoteEkh2PEq5M3j2Gl9eLynPT+nyDOO7JWNbOtmjIjSzm60WQ6N1Lm6EWAkJtKRZRJoDdlqsslWG6eQd5bNSAo9d88vhJVkpC76oEoaRgoXAFoVL7OUjeR1KghyEN8V/9MgP0HYBKtDkvIjlMXm3RAKmIhe5VrWSZ/+jJJU7i1vdP3b4fwE7bmJ3O+OhcjbHO/4VaG8QhZWTZdKW9rSmubIsq+QgyVNYK5H7cnN34EPX+Ai51QWz0uIlg7GmpTsZ6rGYFXhbFXAnw2WVQL3DVBuHNF6tb4/T01dpsWJa/STMBlOyCHHCjhGDZaeD/VoeHzuzQU4XX0ZucnKy3OQyN0JGm+UOtNCVB0nH9ld+ZY2WW9KtRKiI00i61sLEo9la7SwOtdqOk2V6FXDA7e5Ma0lLj2bY+QR1cUqdKv8mwXkZs01lvvnWnT/Q1ytvej6RPfVJNvtc5uf618Pe9S94nwrOEPvbl69+5VPB6fF0+d4DP/hZTaI8Myn/StUjH02sHxoKPfjGEL692mUphR/0YApW9MH5KkdhLSV37Rz+PY0vBBt3K5pdW18Xba8DJMfa/HjhWx7+8p9/gIlPvSwmP/9kWv5cVi4nJ0OfGtGRWYzCE8hCAe6K6pjFGFHfKEGaBwHe3wmezvEY+flbFXAI+6Gfyaif29SOs0Te+6kNBdLfgfxeCaJgCv5Q4HTV/enfC/IH/8nFKtXSrwQgGaWcWNDKLMCJ5DTNCMmSrShCLUXO90HgLhVhzuGRBaaNMZ0GZnHgLiwW0u0QNDlhMAGPCiLICWphF3qh8bCgCyaYfaxTWRzYnBQYDJ6KDCaZG60RygzcF66MHNJh/x0CUBjCU26JhSbFkxm2E4QBxljpoRqmCYMpDJMp2CjwkgTui9pEnh1GBhfKDCx0gSFA4iWiIB7CVBqOUh9G0R7+YTlxIsFg0igSIn6wYbNh4g9JYszAQgq0wCBwhUb9zR4o1d9cRtP5jYh4VJwhjyaGUjqJYRqWISjihyeeIsIYYtAcWsetYgC1Isy8YgqkgANUglVQFy1yBSkQASWMxAJQgRUgQSRgRU9YV2LYIkFcxR7MAHlliIXs1FRxE2Hk4kN8RkHcI1JQhlawYzvio4XQgNxUyC1uBR3o4jcSQWZYxCfMo0EYZFZcBjx2CEByzDsG5GCYI7IthtTZmC8eD/8wlqIp2tM7RVA8vZRLudQ91VYyxuAyMk4zctwzAlA0vswrUCM1coEAPMSXBVticKM3psQmBJ5VhMc5Oggd+IBqFARSAsBmdIY8qiNj5GM+nsY+YsUqKNVDGgRWSgJqeEbBZYVWDgZDRuVSHmRV7AGHpGO3AABTOmVXFCVWyVtFCAAsEMJd4iUs6KSJcN2n1dq58YRC2c0A1dNIaREFlWRLXZE6TVAnhuIgsuTPuGT4wKSzyeT/0KTLTCMsEsJD4Fd3tNZpjduSfEfmIYUVoGYxgCNqpuYm9CUfFQNSDKUUpOZIhAdVTQYY0EAczEBm0AFAVsYq5ICG1EBlRKSF+ED/RN7iHsRBDPgjPhbnQShlhKzCDFTAJ/AAcTYCiXSIQlaZc/amWVZlI2gIQI5IeXrnHkQnWVpVD/WjLlYnclYIRU6GG0hkd45EPgqndJrGfrZlcTKnc5rGZYBGDDQdHdwiHTRneDalc0ZnfHrncfYmQ5rBDBRnfAIndD4lhfRQt1CndWqCEFRoQHIngWooeBgDf3lkQQgACBjCABhAjMaoIYDAXtaapmXZQTlcBlSJe2CcniFU3hDm9AwYSaHkOj2RP2kRE3kVPUXmgPDfsvwAs12m/2Rmy0zjBgSAZ2oJsYUYddWXwjHEHcRmf3UjngEeOaYpesUmOPYCa8FbjWEG/4L6Z0HsZ3VyzD0yJVe2pzqqZyN4pWdEp0EoJVnaohlcp4F+pVEQQWp45zU1alsi3j6y51KeZ9P96WkMhEHWqVa+5VRGKBKYxnROiEWoBne2pYWShg+ICGX8aYZMaiOIJYKqIx0Up1NS53J6556CyGb4pkKK5YnChGocp2kY6g0gqolyZYY4KqEO6kgYZYvK6LTKaI3e6JApXHiAmlV1iYZ5Go0N5pNxEW0V3yQl5h/y4WIiIyVB5pP+hQyOQu0QWpX2z5WqDCzEIl8KJnV9qbD92JChhxWAyk8+STemR61J2mqyZi9wC2Vw6qgCZH+CJa+qY6XeI7PmZ4kwpByYhv9BsufHxgBBSghFSup4NuU8YqxnPKo+kmcxrMKuYqpCgmqt7WOdwoRFxkHBrQKA+gARVMBozCwAVCdYHsRDjgaGzoCuOmRmcCV75mOwXsXObqiIbGzH/uw+RshmiKxVREV5wMKLUiu1woJV4RiavWZ92Rh/PZWY/hhRwcyQBuOAdVVKJWZjCg7hlJS7KiMGnRUtyeug0Sv/2GvKEMAA2CZdZVO/PkkQTMa8VZfAWtWZgsct1IGarukCPMEtbB1hdd14PmxoCK3EMkQ/XmSf4uN5xuPolshlYIjPsiefMuRAWAQdtC7HGC2lomykqqyJEIEgHEMcyIEuamXQUiV1Ei3/VVBlVe5CdXKIUz6tQq7CEPDASNxuI9gsoaYnyTotsJ5lVeCpPSanqDLq1VbGW8ZuWVaFURICjLZACxhA+76v+w5AZ7qbVCkc2r4XfyVEBjDFQYCrgJErSgKLSZ7UuarrS8XtSJ6h3hbaZIIRTDLUvAYu/gyu3XymvEGJQoVYQpyCYFoEwZLCOEKFG+CcbKrpHZAaVYzG53IGd9psyvbXPF6s7mYqoZLXQ0otezIlaijlQ+zpRTKlrZYvZyxth2Bq6dJBEOwCHQyB8DZd08aAzNZbza5uqabEW24liEQI7e6uVzolUy7loFZvoEqnQsLwyRLE847usz4E6EoIh+Bw/3FGCLEeQWqQFzum7phy1PrGbx/D7/z+BI5i2Z5BAWcFWR4QQpdoI80U0FgcH1m1KwPvLd+G0b/lAOBOsPJUsN0IlVwZgR2IR7q5xnh0ru8srClbQZk6FMOeBmtaQTcqrAirsMNWwH7+5m6KrnQCZEDOpz/OsNzUMOla50Re5Hy27nkeb4UMJ8dUiA9Y5S1nxnF6Z3XK7IUC8S7vwjvegBwo5HGKBhUjhRXLqaou5YeoY3wqFekiHhKss8wOc8l+KHJ6xi6rJTZvr1U5aGfUMO/S83w2nTcTM4jwIqpSM7QS1deGrdjOWV8GmWgSQlAM1lwtXJ55MCMP0En1UydJ8v+qyGAEY3ImI88mjxPBeomfgLHnNWSCkPG2JC+FEDGEPPPKIghbWsRKV4W0JnSM0u+MAewKFqkjR3LhfNJGt4oDo1K0sdLfChpIJ49IWxMpiKPlesktPydULgg7du+1tHRF/GYeh2XElrRV5uc7ZwVOi+36ihNRqzUqGvU+wWRlSTBTG49Ty3Vdv0xd4mVeXmNar3Vfv2tb11RZxKsjxLVd/w1dG3ZiK3ZQ+3Vj1wVg921YSCmVLnbfIHZlYzZTO/Zmu0UqUnZm581lg/ZoXyZnm/azQXZvIbVlknbdiHZrw7YdnvZsPzbfqnbqxfbMvHZu87YWelVv33Rq98XM/Db/cF+acSP3aNP2coOFZxd2cvPLbivPIvcNrSaI1IadAhjB6AFREMi0qGj3d1fRqbwWcwsatNlCeqv3erN3e7v3e8N3fMv3fNN3fdv3feN3fuv3fvN3f/v3fwN4gN+3dINbkMJZRf8EakrunfiXgbfl1sYHdlPvQWakllVda9CYdm8oAMjCyv4Bd19FhyOEEWz4YLCCDaC4DljAUAyBDaj4NW03Vnz4Y8z4Q9R4jRsFiUeGiBuFdxsIj18CD6x4VoT34Zb3WyTFXxy5WSS5eZeSc380dEd3IgGbYvBkRZA0g0uFg4tKsMalhSeGfmW4jh8EjxsEjmOFhpe5eHMFK+jA/5zxQIkXBponBp0bhZAXBI6r+WPsOYLseZAPeWJ8edVsR1kQRVgwSZk0eeU4gS84eeFA+VJLeb8QeL/AlY5mAV2VG17plWj6lREAlmClW9k+BElDdW1uAhFMgRVsgeYqLORKAcMKZSQo7Jm+uk+cuiyXulQAGXgq1XxmxnRSBrCHszwTM4cIp3ZapD4vaH/ucnTeptt2B2q2+paQQTjK8h0oOFBaBhM0RZMYATGgeDa3OIrbwC6cuLnbwHb2QBCgeGcU+ZqPeGW4uUG4uRIPhRLj+Z0Hur2/+UGg+SW0+7tzOIqflwIEQRyMe4+neJ4PQ4uPCJ6bOUIk/MIDwB+geP9mpLu5P+WMb/y7a7e4n3ueZ/ydu7u4I1W6v7h2l7xB8Hi6mzEPnLwNIJW7u/iKs3zJX0K5d4bN/3tB8LjNt7wspHi/u7y5K+TGy020T0IKFTpYwFVYNDm7GcNXsJuj5wEZvNt2yJVUpFAczBUyWFzYs1JrPHo+CXdlquKkT7kRUVl3kNpcultzeRZ0LcRcXnmpL/hQZK5DxSYKk+YMiXCsrymaAn4IR8Ksb0k3jr3EcWhZMqvxIkSkJi+sHsT35qOfvKrPiufUZS5UVDuZLj63i5ZEm4gRvLks/PvEX3zn7TxSqf5QGMHK4ru/D0UPaIASd/gfoLsOaHgQWMCH1/v/Q2z8eQWByI9IE3P4z9d4kcf+8J/5ugf5dkr8dzt/6o9IEJwXnfe5nqP+8nN49gPDzgtDEOhAhwM6+LN+j8cjkDex+U+8iP+Bxqu4mru5BUA/mtU+v/s7QFgAMJBgQYKyfAwMssugQWQPSynJ8FATFl8PMZYKgjGPMYzIFji5yFEiMigjNTGZiCyPxJAXU67EGNLjR5s3cebUuZNnT58/gQYVKrRAAUFHkSZFWtTWUKdPoWJsOJVqVatXsWbVupVrV69fwYYVO5YsAC5l0aZVW1DUklxssxiZRPBkwZgNOw68ezfvVVJEKOm1MnjLrU1NIgHQCOBOEACkkCSW0gvA/2HJg60UY+wYcqRSmK0A5vppiKTKSGakZkinAgDWp1PTYLhqRg6CpE0TXGXboKYjjQbuSQhA+MDXXKVYoTxwccHJXRUYAc5Kx0CEBv8AI3iJh0DuAqdSN7hQLw9DQYDJApb9T4/zhqQHEcZqONVLQ3ZFrx49f3cA3wfKbqDopttvCB3AA0BAAgG8riECARAvCBsotEE7BS88qD4Mt5MuwuomrBCY7xZCSJYKbaiOlRQNEq8gB0nc5bo/Kkzoj4Sos2DFChG8D8GCXCwvQQGzcpDGDBv6KKJc2srFppCchCiLjR4SRa6POroppoeyZMmjLZ90gsqoyCzTzDPRBKoopf/YPIqpNM1UBYwoyVzLzjvx3ErOt/Ls088/pzoL0EH9rMgXg0SJa666tlMJL2P0crStDBiD1C/RAJDCsQWeMAwxxRz7bLDlnrOslMgqVQwzypqjK4tXszi0Ktxcs00BIhj6hAdNhDCNDltx1a02AGjVjTe7fgtuODqWbc2r5Fh1zLnlmIN1yqkgdNFBgoj8z78csSWPoCCjA0GYY/6Q0YdjAOmlBw2C6GUYdpF8kDxxswMQXA7/85DcAwVaULoGN+ywQHgZwg5JCLnNMFsQExayRB+2BZJFhSK2brgYEVoRuOtOpJChIO0CGGO7/Auw3qoqPnKqjEpCxlAlx8xoSmT/rJwEy5o+ArNLKL5UKUye4Sza6KORxmnNNpV68yNQyOjgJ6ghITOTMaKUs+oyr34rkzYgAQuVYwZChRiwui5o7LAumINPscz2Ku6CtN5qlNIMKoWEGzrYqg5qB6qDAQbO1koVstUefE5Cv/o67IIEZVzytSqytFFK85Dr8kcjxVzaPKS16q/AMtWslMIsAzVTwEvPNLJSANsks9XtcuIWsGhlFgDaGLqVkGUT4p2t0jRBwtmBdmvIN+CIS8i3hHX/6g7TQx/oDky1eti66gq6cTv/vO+3PgAbLigIIBoJgoddqCOGFR6q+wOIXf4Q4sITM47QBuC85w/A8PmlPYNx/4hBPGjEfTY2hI35qzqy4F73NkQyBY2PgQBwIMosMDHuMK83/iGfhiSmrhxFJyHiGpAR8ndC4HzQWxx0YIKsY4P8VcyCBRsIl66Ekcph5CQ4ydnMOEI0igjNSzJjgpNSQieZWSRpTXTiE8u0NKYtpQBN+cjhgIJFMkFNanDiIrGiBpa//WcOrLNbGAkyRrSBjSxq5IobwVKKYw1kCjm4wxyv0ra37Y5sVNPK3BpSh8JNTjeIm4oq0EiQyBGSkWOBEmNgZTkovEoudyFIHqzli4pQci6VwUIW3DIVUoCGM4MhQ6dStxhRjeoxg3EDYhZABSsgYXqqWpUtZzcavH0iBv+1CRZxZDMQXvpyNbFx1jBn0JrkbQc1qeHbHox5m17WgINWkd1gUNUqgiQnNKTLYwX7JbIBDYFCByTnxcRXvu/B8A8IOpE5R2SEhLxzRQnDXwzLOaAQaec+FOIejSqUnwqGzAbDERj/KESMBC7wYPCqEPP6uT+E9eacBwRniPbHsXmKSEEc5Rc+KTSi7kzMoTZQqAVRNLIaoZRCBl0ZQA3qT/Dc80UJic5DX1aKHH4ESjjbqUlgNZJEveoiXdLLJzmJSaJe8lWbEglUsvKQGyKjIDchCE6mihWqAuAjU90qV6H4RClOURBOwwgq4iAGwj1EToPbGioURwyq4YwMW+v/SVsZcAycqbUXFAEbXe3KE7wibm1caZviciE4xRkSK4MlI2Kz0jbKOG53ifzj4MKYNq5ollh85codfmAFEsxxCiurytfmMLg9+jErdUgr4eyCtUYCoA5oxGsvQKFWxK5tkbP17Wwt2SdO3W4zke2U9ar3lWXOtji/VQsLH5QylTESus6tigQJVV3oeGiCkZUuWbp1lZ/08ClW6YtUwZqkJKHXq1+1SXu/ql6wsterW0HvVrtqlbAmbaxTNOtDBAcJqmkNGWYrcNSQ8beuIUOLdwVD1QwMiA4I8iF6ZDCCHQzhwsERK207G2W/qKcHA8BsHq4MG7EC4jAC8o9hHGOI/8/Yt4FIWJDIkYEj7ibjTWhBF3YTw9ngWAfGWqVtUTsc8lTbyEz8eDsoTiO1ENmB3lqXyoAKbp/ugBnsXSXLg9kyV6A5A2r+trlVJgiK0JxmNH9HzW1285vhHOc0s1nOdbbznfGcZz3vmUId9ScA+JznklZHzTxYbxPrO9Xz4je+N7yqe6tK3/fOd9L3nTRXH83ol33FvftFWn+Z9t8l99VxbmPrMSzsuAT3wsI++RtITA1rOr0aFX11dV/1SMY9YuWLR+ZjV8aox14PeVZh9DWHr0JZEp/N11xp9oDcthXZaacUfBNmEhyxFVRETbJptKzoZFtYvch2cnsqSJFlrP/rJkNiymZ297vhHW95z5ve9ba3dZ2oVa10Gr8OiW+l82tfqWT1qlXNNL81HWlPHw3UbfovFy+sib+uWtVRLjAxVEGMn1h4rjKbeIF7oeqecLyuYHyc4RBX42UbNtoDTvkgr3JkE3M2K1/MtcrfCPMTn5zXeAMtQaqdbqyMkbJtI7ZVjg04mjOubmwRA+KUret235vqVbf61bGeda1vPSz5Fi/B6evoRK9X4ZIOuKUbbaeBV2XhRms4m/6LRckuWGuOyy2CEUm0PeVEj0t+cJWitoeqZbzWGNk7Tvqu1rBxMROWWrLO6UY2uG5Y53Dl+bnd5ndIHHnySN612oDMgMn/gu0Ccuib0Ysdtm33bYx74JO5q9J6PnFR8JVhMlXkSMcM3TFxl99Oy6P2+N7cfipxyzVBVk/Go/ep6bcJI2sD14apc5361bf+9bGffe1zGtFfT+/3DT52h/h77QTfNKURjlWqpF3smIZv2+H09qZV8SNwHZyt8bo1xWqx42ydk07sTxAwzO80bq8K0P+UyCYCMLN063GEzz7U6hjUqK3QyPKqYgE7wO8kcDlgT5TUihii7bAWR/mswv4qcHAGqQOLDwW34wP1gvjw4gf+4wl6bApI4AZJoMdIbMSmgrKOTLFY0PYg78l2zu/y6veWr0/WRgRHUASXY2ymb/ukcAqp/7AKrfAKJeeJxK/9vG++vK/SHm38yi792G79+k2r4C9N5C8p/gsqXq3+MCxNVs8nwO3zvELIyCL5xGLU8vDbvAJq7BDYkvCMAlHaxMCMzMxxohALGbERHfERIbEKtdD9Dg7s0o7f2u/f4CvR2C8M9cv8uJASxTDh0rBo1pCKrOgpDsvWKEIM4vBMluwVdyL2RjAscmsQsyIWhe4r4AoRN8sVd/EOaxF3nq6NhpEXRU/ecmvEFjESnfEZoTEapdG3JpG9zi7hwg/8IM0SBy4nzu8au7ETyc4LRfH9SpFMTtFN6O8ckWYa3RELm/Ed5XEe6bEe6bEaG80asbHgyI8fv/8P4C7NDPWx/Prx0MKR/NgxioyCrNQxFRMSTuwxIqkvHumxLyTyIjEyI7luEj1R4V4mTTbx/Lgi7Ahy39LvIYciHctqHVESJDXyJemNIqfxkSzSPkQCJnEyJ3XyT1qyJ33yJ4NCJdsQKMtrJw2itoJxHlWQkGQyGivHesjgkz4nKhXFk2TFKLEyK7UyqoiyK73yJ4WSJQGvi+pP9IDiDVsRsX6iwTBiGfVqFqts6bpiGXkwT+wv5QYx6goC57CCxSIr2vBELqui+cRmCLeiKZ/RUC7JJW6yJSiFUWhiKyVzMiXzKy3zMs8xLB2Swd7yisgAazYu1sZSKAwMDskSLqn/DMa8QjDtJMpGww+Pr8PKqCv0ci1U80+6LSwQMxKbpCD6Ii9qcjvEhDKJszhhEjORMzmhSDMV8LXekmo+jidQS7UY7ADP8rU0rv94opAEx8V6Qa2eT7cKsSHocrJ0iwMXK3AGBxcNwjWRzK2WLbUebA/kgAHSyg9jb5Ds7+Tokk/EzfYUJ2xuSz2PEAiP0HAsS7EQx7F2J0C/pq0Kh0F5zbNODEKJxRj2k7bORo8MlD2pYjcjUTGtx1LqIjj/wwksxzhVdEXnUTld9EXjbyEZsg0DjPHAxuJ8Irc07tWAMLB2At2wyP4YQBatqmxET7IOCxLsbsUMkzzJzfYog4vq/yZuiM7JkE5xVGtKQy8X9GgOyGBP4iApAwlLyUATZkGzvmhu3IgPbZTnqnTx8LMEYe5N66bGkk4Xj0xLtYLGCgdPyUZOgIwYck3FxFQrQDREscBS8iKJUsUuLIJFITVSpRFGKbVSn4I5degQL6wDTG1sgGL1JOsjhGxqQNNT3xAtvTFwUi7knpS2FCdOAwlw5sZxgs1t6DIZ/WY5ju9wcpOMesFsni3ZrDTEgDCMYtPXjM9LZexWOdBDj5JamJW2KEOPmLCPwg3IphUw/3L2rpXEmJRQf00sDjUSaTKoRvTcblJS1XVdG9FS3fVdeQJTRxNYsTSvfuLVRO4hSvOu3v/yb1oNVdVvULEGxmIze7RVWpEH1YBv85y1N8hN2RTMyb6GU3PBL5HOsnytYE0O+TZ0NoWpGIN15TbrSZ8t16hGL5POZEtOK5Qt6RBWsr4ID0VWN9m1Zm32ZqkPXnV2Zx9CXjkTwFix1Qrs7xDP1CAOAZE2JwzMwl7N4oxO/ShrbUrWY5GwKnpVQ6E08R7MPXXjGBEFjdJGa2DscGj1Ceuy+CqPGBrvasEoAyGFSnFVmIzs2/hyB31v3UqvA7g28YKvVZOVSzNP8UhQdAIPEv4216KM82ALa3vvMHH2cSE3cuOtJCXX+jQT9NRNL5zMAnuQjRQXPj0v9kZv8RoQ2hj/a+AY1C/pEnFQb1bOE0BxFQNdNckadDyfLf/CtWzkKmoAk3OpgsPa6i1W9wXh0y3dhgn5BAhfD7NkzHcfRD6TF7LsTw4WNK66LWoHRwBPbw5wkQCvF2zokgHzagKZ10jv9kMrN33Vd30BhWfd11199iw7EyrmMCpGTf0sNhcPEVD08Hd9URCtyUp9S2bb6H/114Abq2GPUoHHlX0d+IEh+H0lGEbjtydu0WqAkUx6MVWRrS/jNk90kRYVmCpu8bQo9LdKWCyGNyx6cSzy1y+KkSsaGIJpuIYhd4JxODkrGF5t2DhnuIeBOIhXNIeJ2DJ3+F2FeDJ/OImZuIl3soih/5goj9hdnTgrl/j6YKELDKGKubiL0SKKwbgnp9hSvVgnr9j6YCEFWmAQwCIyN0s5BoUOrK2M3S0iKIWOJyeM9TghL5ctYJUIna9QbfGP0fbeOKw2hfV8u+KFXzPdOnjoELFuz40KSMC0rPCMqy+NUyAFHKAStKIv3Fja4NggamkqMqc3i6Ug6CA16kOOcwMvjKA3tWJ0rFaWUGUroCAI7PhWbKN4hgOaEgaZjmWVVQOZkulWrK3MmCk2ZsB5mqk1kGnMtAKajuVWVGMrTjmUrEIAYIEQvPmbYUEAcPkqT5RP7BiP83iP1Rn++riQUsxvR/iPRpht401jb9MvCPkvEf84K8RNY3OxVaGtEKdABiMRk6nvFTZ5k7lAnEk5RRt1LUoZL4IAlfFmeF45K0BHlmvuy5TnU3DZGHaZCLpjFYLApojgd4SJeIzHNeaYIPaAN24FP5rHPojAWW4lIXhpF3IHj6qCWV6aIHSHl6rJvCY6lCalIQQABAxhAAygqZvaEECAoRuaLTRHOMezIHSqk9A5Lda5qz2tncsGOzeWV+UTBfEKPnF3DgQhAg2nXkk3yWpsySQQSwnLev8GPPumPx+LdvNoDpZxnzVXPh/nP41wOYyQ2eIgtap3PSurb+KmsGeXsWfXWc/6wabTa7GlrGHLCM/23GjQGQ2a6zRZjQn/oSGgoKpLIZIU41UUVVqu7JJYiTkwQzNMOQjuAjeKhzeWC5mSmZmBA3RemyCuKTNiCTSKYRNsh45oO3Vku5uoAmh+6AjiYBf6gBBsQ1doJXd84Hka4qf/46QNTZnPraZTOjeEg1ZWwdp8+Sq8e3l2J5l0hQjE7ICIoJeRICGA21EUQyIKIqmd+r+dOqoN4rS1GgAYxcBfxS1CApQohVEbNXMKfKvHwtMkXCvA2lUFrK6QNUIZ61hHrMRSK8MFGfPeJk0/LEw9FsaSz19DfEkdW1Dn4MQV2S6AkWvBLVADh1rYNPj2N43mxHHq9GzUNOT294tg7E0NtsSZ7JEPyZB2/1xMRwHbQPsdNXkDAsC0Q+eoLbIv7kKbGuI5HgNVammSzJU8h+CmiaWXYoODUpk4jgcrInogaPlcmZu5abkxFjzBP49XPiEOJjq8K+BWcoV4jmAX0lsSaCOYiAOmcYUIGkG8t4O8d+dYdkO79eK+2Zs3cGMPbsAMKoCXWuOnBR3S2UKbI2SpARzAYaEgcrk39Bt0yrlzzvWRmIO/K3zCu+/WtwKs+dBxhlx37QLFdvUY+DBkT8vJilXG6DMF9SqgKwNraC7Zey2fwUh4qT35/pZjNddwYQ5Jufdlo61WK7ZPPdeQopVlN5fbqLYvmR3YlccKWhoSQ3vrYGGNHwRFff9TUS3HIuviwKcCzEs5zq1imDZkuW6jonfHhqziM6pnzh8DMEqBtivDo7tsMJLLPoTgVj6dBwR9ppFJmayt4xd9QHBlFXygOMJMmjUeeSg9B4S5K7ybNOTANlgju3cpBuJdlGJlxpi6BVrAAHwe6H9+AEr7RB36oZOb1i0pZ3IGq01d171iv6D+KsB62icsSskNjkIMYnGLSWPM2TGPDN7GwLa9sQn2YI+tSduTsJy1VrH+5CaQbODoa9pgcVQWEhD3weLe3XO3kYkQkUVX2+l5mywZHt+RAAagKlr9XB/aIkXBtquaKgCetsc8k6aCNMxgjgy+vPWiV7yC4eV8y6D/4BbqIDH0guIl/kRh5ek7PzdIw5j5ZtOpSai/O2G8W9B5RQ4U/ruPqaLPG+HBjDdym/fR29pIw/NnxdQJoed/PuiDnuhZvXos6ZGUXr8BwA5yIQ/I+Zynnvu8rvurAqxlroy0Nmyu1j3DdmtXNXQHE43YVpAmNnA0btvvTm87fN0VN0IxG9g1CyBUgckFoKDBghfmEFRFpgMAUA0zGQNQhxiATGJ6UbRoEGKHigAS5sIYsQ0kUGIagsSocaNBhg4PCiR4sCZMhAofNgw551jNmglbAkBlsQ4DoT+nAPvJtKnTp1CjSp1akwvVq1izat3aFIqRSQBKfRWVZWLBPGZD/zo5lbaplJaliFAiZaXY1E9DJNHJ8ZJvTbySCtLZtZWU3IdIIh0s5cbPwU1NFCOWfDdvQbx7fBTUdKQRYE1INO8NSYQwgD1+FZQ+DUYzU9UVEBKJ/SnGLsA1Qbt2itogndirani2TEcz5129m5ZSkuEgLEMGokufbghWTa9gwwY5CGViniU0NTFpXrDUMSfkAeT5yrW9+/fw48ufXxOZ/fv48+vfz5++//8ABihgTQUUIMiBCCaIYIG2HIQKAxC29CAYguw0FIQ+XSQGhAtBCAYkLolU0ExPYcThQxsycAxGPiXEkUAM7GQUGKr4RNRfKfpk4jF1tETia3N4SBMAP//+ZGKMMR0J4pEtHWnRjSxdCIYcGc5Yo4YRvgShjEKOOFCJKY5kEpEZJpShUxP6hBIDxOTE1CZJODLgnO9ZReedd6KlVhZG2OFdFoBm4ctZ4DklhRWIbnHLAlRYQcQddkkFmGo3BLaKXwfhtsoMnM4Qm1SHIipUqJFuYkWTiCJ62B2pIuUUbg8NMZtvFWhaqWqd3hZDpxWoRlhtuwE162W70vCrZY+Fxlunnl6EBKe/FsuXapqphmmmzBEIAnXUEVLJT3ou4MSQDwF63khYBMqeJlhsVx57eMYr77x48mfvvffSq+++/FJVoIIAH8jgvqhYWB++CNvnX8ExGTlmTQz/79sjfRG3FyV9oyDbL792buzxx3ReOqdhlIBsclawvifAtgNw6+1Tpbh78sw01/xUwjjna/POPGf1b8AKDjwvSQ0fnLO98xH9qsEaMi2viPEp3d6DrsZ3ARUkLNVzgB1v7bXNe3AqnIB0JfY1zymrDAshbLdt3dlwx73x0XTjJ/fdO/8M9IIFNDhz3f3hLfjghBvUdeGIJ6744ow37jhVgNf9+OT+6b23IEKbHPl+lHfuuYCHfy766KSXbvrpBm2uen6Er+7667AjbPnemYMcO+q4535Q6Lr37vvvwAcvYOxIU0788civPjvQDCbvvOTCR+8479JXb/312OP+/Pbc/3fv/fd0Lx9w8+CXj0yAJRSUvvo1rd9U+iXA775/87dvUP3Z90x9/vz37///XzOfAAdIwALmTHwAq13hLiAFP5zvP+5b3/ziR0EA1A9+6qPgBDEYP6xosIL2Yx8Ad7a/EZrwhChMIYAMyMIWurB8CAxa3+CjiStcoQmKuEsfDgCVGt4wh1Jh4CweeIEnAPE9EpQfBkVowQ7ez4JQjOITobjEqeBPik1U4hVVqK8Smg4WXTAEF8dIxjIG6IVoTKMaXRfDBClQKwykBVbu4JinxHFzm4mMfD5IxSlKMYl9vCAVq5iVK0Zwi2aUlxdLB4sUtGAQiYyke+5wmOAxKlI0o/9kyRq3xk568pP8aSPf/NaeUeixPDbU4x1kIYUbcqAUNkwlB5piylmi0oZ+KOIdrsCHKzimlTt8YCl2mMccagKHZ6FB0ZzywSpyMIv2a+b9monI93EQhE6EZkFIsQLTSJJOiyRdI1OQAgd86ymigNebxrMYc7kHMpRhCqtOdZX1iKJQexgbHSr1kBi4pjacwlTYOFUB0HTKB5QKTGaYQgdm3YoInDLOs6DVnrBhCqD8nAoUgrCc9GRlnqhy1Cbno8lSgscJZtnUDPzCLl9slCumEml5EIXJq8DzIJBCCBVqqpWNdlQwBD2LEe5JrqiU9CALeMItLnLKh1TSKT7N1mn/VtqRXWVUpdOCaGx6E1WPMkUAa2sb22AhAKpAYVAAOOtT9GQQcWVBqt/cmCgFNkOujCKWNqRFKVQ5C/VcgRZFzGFgX4XXv+51lqusoR/u0IRR+GEUtKjlA1fZVinI0bE8BMAUlAmVbA7yiU7EnwaZGEKugBC0GZRiKUrgzbiCLnivICc5uVDWmrA1ndlZp1fV0xat3BQqb6lnEIh6miHsQhNBEIJChaHcWEkCNFsdm0z4qRrjniZYNUkOAEYDXc404jQZzUpxknOc01wLKt35aXuC25GnmuyeGUBpP79bnIswIRcvLaV7c5qV356Fp+5Jb7Z6U948DLdQ7knqUv1L/zL0GuOn42XpEQjTm9rQ1weXwgtuBNwc+P5kZdBxWW2ROq5MwUutTmHrY9ipHHW6NkBzxVxd20PZkBixPL90zDFnuePK4tIgNdasHON4TEVYtsbDVJiQcdpXyxYSmp6N4mlTm0XPdnC0T46ylPv44niFc3TjdOTLuPMVtwZqImRxp3js8NYhqdjMaP0JoxC1nVDReRMl1iwm2RsWVY3UtkEQT3PoEIdirEIYnVFNI1aDm+LA5ieroC4RBMGD6/JGwt8lUg68O19nYVcqyRHZdoWzhzjsii+66WdsuoPbpsy5LgUh1UH47NRNvno7myDCFKygqIekCpPzlEtMK3kHOP/QeaaJWupP4KvWhSZUPLlQsZFaFZJG0XOb+y2Vrnm9VLrQVKeIMlspft1nWF9k271+tRVkdh1j4NZX/dSMgQXNlJgZJGbDHmmoFGXndTt112ZjCqvVGWq/0IHU1SLCDVbhA7ysJq3uhpd6CwJibklnW4/BQm/VWopAvTUDZmZPHsiQLpnRuzyAgtd6ctvlyhnocnQl5VbimEdbWnawmH0IMZ1CcxvnsJaO3bGT1TPE8xV5MY+towc/e0FAopbL7dPi0iUY9SRqueUA+rLoxrmBAPwkv9t0MULGxa6JiCU7KlYrtOvNbqZSJqf+ZW+D77AdKHg8zgcZTBzisGjPVHr/oZ+ZsIUB+qlIB8ZXRGjEQpuSHFjhhdPkVRZWkpMZanUmn414tHd/QxUp1DSnjBoVUhqsncfAOi4jVXBY3FvrsyQGz7eAvZ7TeneGFhQJcdCYHamAlODKvvVALtXpn6p6z7udFGbjL283A2u6q2c7yI+EmdtspM4Exw2fZgopgqBg/pLe+apnMKw9P30EM4XyCCWCDzrzG9Dk3qBDyD62hvQci0/nbRfBAt7tmx4U29Y7zCEuaHVyrWZg9wZXWCcfMfZGWNFjTJVDh9Vjw4RjmdUUDhhYNRQZqxR0NyZko9BXO3YBxDQKT7Bz6iEDctJZTDdNofVH7EN1B9GCi8Fa/1EBg1bmR5uhBT+QgFkHW48kZ/JlYrnFLoACHvR2cmxFhEVYVNskUzXXXpRgHrPWEvN0bFIxGKihaICXFwDVLBYmGIUnabvAcIBXLJ9iXpeBLI83UeEVFQ01A+GFfrPhXYu3eJtyXiXSVOp2bZo1epVEF5V0U/AUU9zWh8tGbHahYLJnfFeIaLehe05BeheRKoUIfP/1hIOYKooiiBoYKcrHXzdlb84XfVLBGYRQKYsHFYZBCk/QC3fQEg2meuHXVHMHYE8hhwXFfo6IGw7XLJEoKAVBCC3TAi1gAMRojMU4AC9DXP/HHXhnd+7EVknIYnngcey2HEzIg1yxgDNWGP8mCEuuFBbEVGM+hEzaZ4K71ASqsEOWNUwOmI6zxEA/VEw4hYI1OEiEZIMhxEcvKELrs1qt9RPZFEE4WD+boIPa6B9a9zkEMABQxW6tVhAvJS4jwU4ROY27pX0y5V9pdQt1EE/spXwSWXs/MRiysQsQlSuAgXnltV1heHilgVxyIH9oeBGdMSKbdpPwEWpeGAOK5xr1RSRDUGlT4V+qlxR++GeASAk3FX1SsB3FVzXfl4hK9WqHAY2Asn8FETaEYXhSIYkciW1/Bop65JRQqVScGAn89Ymlokf2Nm6isidLKGcKFxhB2UNNcAog4AdQoGyxqFQ2tmC0uCrFUH7ZuJX/frEptOGTXEkkDxUHOZA282cQwoiMlnmMymgQLbViHuV/P6UnbIViSNhb5YGACdke3ChzWhFkJNVXW6Fk4OKaWgGDWDRlpSWQ/mhbnCUVWzRBuaEFAXma7rGQvYMd2wRX3REWRshOBniJEkmaFqhHv1cejVETchdwUwFvpCEIyPIbn6Ese8BPnOeYMElhrXFpviFRuZhpmil5V0FeNzkaC1VeFnaXUHFJONV2sZaUuREZN+V8xlcKvXZUUHiJCiaJlSEJ1FKUfDh7NYGgZKkYAGoXAroovKdZiYF6dAFsbakY9kZrU1GGwfkaTzAHkfAEgAl8xncHvTadtfiemLZd/3wxKep3XQwnmaXpUfVnf9GBf/mXFvbGHUD6FWW3fGvHf8fpVSsnnPCRmlyxSyYYH1BagVkBmwbRSrL5NQe5mwAyBTTIpPFBnL2Tdu6UZkFAdunCJ2BRjYEyKEoodmdBbnHqb5M4Kpq4VFVYNa/xcKpBBpiSYZbhlW/oKQYVUfAGLOi5GRMVG5yWLDR5fswCHJzCTwPVLNDlaQz6ba9mNnamKN52bFVoF4R4GN5GBikaKnLxqf4GelVpbU4YFQOFh+hEbaM6F5S4HVV4KrXqa1ZgqksFlyAQGXP2KHaRq70QitsBl3EZRCl5hlEhBXJxB4mhqtCHKHGQovMEfYQZov+RSiSTGhhTRVUiY1DO2hGmWXH2N2ZtVWIU+aBFCHJO8FZ+oh5tmn/qsqb1enZgqjIvB3MM2DoPtK/aKKYCq32sN0apODNhCR9BOp01s7D+cZTOp0Lo2i0jxnYF6zVOyjhWmrFdRrAe62vYaUYJezIQ+06UqKcm21QCUoUHa0JgJVZjdU4hKzgbuzgdW7PfBLI627M+q7M5+7Nyc7Mbc1dy9B5BK7RjxLNK27ROi3VJ+7Q9Q7T9YkpH1B45e5DxM6JSez1M27VgG7YpFLViOzNUizeGwAViBAAdewFVsIOlgANlmz1fO7d2e7fSQ7Z4K1f9ejn/qkNS0AS7JEfg6Ev/OrdLf3URseSfNuSaRaQKP5ZMy1QQhkBOgMC2AVsecuu2ylQKP+ClyuS2sUEKJbCD6sGlezs5dZu6rNu6o6O3rjsvZ3sVsEQLDXQHesVXYXEFfZVYiTuBe8ABdIQQgcsBOadZqGsQlUtOXiAAmatZBaUFbpAXd1ACvVIFoysEB+lNmzW5sYs4q/u94ju+AEu+fAtzMdce7hgZRuRkNDe891ZHQTZ0NUS4SvcUy0tOL1AISPUEbYCCcatZcgu9Z4G95qu6KbSkB7zAwgm7DAwgs0sVuLu+HHBjtbRkQNZXPTdYOsdDrOkU+asCcPCbm4u9RUQY23sRWjAEKfjAihO+/5NzcptBjXDqwjYsSQ6cPyOgrr8TwUFkRBvYBxjoShx8Fk1mjjumB4owgRh8B/bIFMsbRlZ6wqfbAXAiJ3dQwhWwfff2pTcsNzCMOO0afLnBYlGRnF+cxiaUw9kzAinAw73jw1EhdHrlGOm4jgfggNtkQ3xwSvL4SxrcgU7cwgQiwgXRsaRbApy1WvEjt6S7gwf5KQCpxnETxoRTpJrJYmbGHES4LvdloEFIyaKcPWyMPSMAAG8cPHI8IEzcpGuLuVBxB6YLFaWQvKNMQr+zmYshM8lJgCo3EWOcVvp5y8TsO6V8PaeMynCMO6scsa0Ujv+ht0rRQ1pgy8VMM5aMN//MuK7hwU6+nB24FZESWcPXXM6kc8zWk8zK3MN9SzvdmDjobM53k814o8vlYXLezGLibAfR9ozDLM8A7Tmg5EkqaBCpnDoDvT2pmdB4FNAInMsaZxD+J4BpJVXibB7oMXbQ6dAc7TgMrUYFbdBj9tHOs9AkTTcdPT2WVGLiHBaAQgjjkWaA4i7swssbndI4Xc7qLNK608x4YrQ5LT30jDj+F9RGfdS8yRQHjTo+LR8XfKWuabXxkshPjNQnM9RWndVa3Tg7rbxLbTpNHR+t7HP/kbav/CZaEBuyvNUgg9Vs/dZwHTddjbnI8NWkE9ZNgQes0Li3ZLh+xdc+5Eo+5Lj/TwC5fl24SjcFA0wglptikKwFOHABRJDIoxsn6kGDkRzX9OHWmt3Znn0yO60fKcDU7cw874wVDBQZtXRYRKcexGRZ9dvBwQu/qW28O8TaUuC4VbDYB5G/zStnT7ALpJAEpoADW9oBtewQd1AByb1N1vvZ8MHZ0D3d1B0vIyDasjXap4PXRpK4dBwSN3djO8bE83u0sT2B7tuB+Jvd+5sbSXAHyiTL3EQYpGAZm7ABll3dYarf/N3fX3Pd9iEC9pECI5w73P2gxDRMOOefbrlDNTZ0HJxzlGXBLNsUIVzgB/HIKrwLAaweA7xas+zfXCHdIl7iJk4VAC4ChGAC9mEC/z1d2uNz2rTrGHE0xAxuvIZLWa1k3pGhxEwc3oqgWJnVvVA8W2etmZat2Orx2PQdJ8uNELt94lNB4lJe5VauPsig4qg84Bi+3TCeQDLeebF0tHf82jdkCo5xV7zbgX+sWYGcQ+moB4ltzZXb5T/ByCVMQYRRvYRRCvbotrx95T9B5YJe6P6dAloOACve4gb+5TKkmldRxHcydFAhAEfeQ/ltRwZs6IOuOydX1GTM6aLetCow4I2OvjIG6VShx2QTS/c7H/XtvTj13KO+O6QTzMsnkVq5fB5W676esYZgAlwAAqeOvn/769hD6B6DyTPcHB0XKNny7GWRo8he7Vd+4P/WrjvK3i/2fM/OaK7NoWLbnO3kzt/YXu6ns+37Mu5qQS7+J41tQRa7ju70DtfnXu+jo+770u1BKtFxBu/mepj4PvBWfbZeGuIEn+6jw+ygjsZhMRbTrpwZmfAUH9SzmzGyXvGdo+/80q4tXS4f51Z9gmamqfEmn9Kzu9YnTzoc7zGgvvIwr9mzO80x/zktX/M4H/OzayqymvMv7PNAH/Qw5uhudNpXLPQqjfRKv/RbcbYdzvSJc/NQP/W1frYqT/WEI/VYv/XXTvSjBBTBzfWDo/ViX/YiTrQHb/Z4Q/Zq3/bTfe9ubzJsH/d0b+9en751v/Z5v/cUD/d8vy9zHyD/nz7vf1/4Tuv3hq9Ii4PraUf4D1HyiR/5won4kg9OisPsSCrtH7dmWUntlf/5CZmatjD6pF/6pn/6qJ/6qr/6rN/6rv/6sB/7sj/7tF/7tn/7uJ/7ur/7sR/476R/NdHvaRVnRRqR7A76yB9XlJ/8/+H7dmV+Y+fuxG/GGQ6MzH/9kbT82C8fzg9TwH9vbed/Mhzw21/+ZKT95j+clx/Rut5umexVE5f+8j9C6D//WtH97eHxYpdmnEz9vW7/9u8/9W//WIH/8PHy9m//30S1GG+dJIDw00YCusD0HoEVN/IUN3IVPYL/9m//YEu1Tz+Jw0AFWuNqVKA1TI8KZ5KdC3OgsgYxMVQhEgEBACH5BAUUABUALFQA3wFdAxIAhJ5EfKFKdKJubKdSbKmdoKqUkqulrqyMhK2rvbG2yLN7brOAcrS93LnI7r/R9cPW+sXZ/Mfa/NDi/NPj/NPj/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAX/ICWOZGmeaKqubOu+cCzPdG3feK7vfO//wKBwSCwaj8ikcslsOp/QqHRKrVqv2Kx2y+16v+CweEwum8/oNK1CYtfcOzhKnqKr7/i8fs/v+8sVgWyCgS6Eh3MUh4QmdiVwboIiiGEGEn+YmZqbnJ1/CwwmChWhiYqnqDCQK4WnkY0ni62ubS8KDRS3JQkAABBEDgcCApYUCcPFnsrLzM3OKKURDiK4zyYB06AlAw0K0dw8sowqqyPlqbVyg4qL29MjvBG51SIFAPEi+D0OBA8G7wwKyPtnraDBgwjJFKiAIMKAAREQVBB4MECpBQYCMCThjQS2NuJUPWLxKtU5R7Mm/53cFk2ErlwZScHzNcLeLx4BGyQjyEBAy4RAgwodemRhw4f+Jlakt4DmR5c/B/ycZE5VO1NVR1LdKk5Sq3VbJzz1eFOBL3368tE8EWyYAIEG3ApIgILAXGqWEhgwMJWo37+AA7d4J42awbTzRIztuK0hO1kqu2adHOsxpZVaR0KSZGwtx2gv1yLuTE+HXQISGOylS1Cw69ewYydcXIo2y8mOWkA2BCssnZSvSqIbq/hmYrE3EY+GJ5duAbcU2f7rl+DANNWXZGvfzr27HotQi49grLh019zkYnDGTRnsrHXwr0Ur4NhlNdGebfpIkCBgBOwRFNCXdwQWaOCBUXykDXRyuQjiVGlVqaPbeabEx55vkUX4GwpPERcaBLwI0tByN/Q0THRx+YTgiiy26GIWwqHDGyvscBVJSCZppmMK9E3BT3YvBinkkEQS8Z5KM6BXx4yPILKZOUoWKeWUVFZp5ZVYZqnlllx26eWXYIYp5phkltldCAAh+QQFBQAWACxFA38CDwAUAIQLCxEYGCQpKS8tLTIwMDQ0NThCQ0xERE1MTVFiYmKzs7W1tbfBwsTIyczR0tTZ2tzh4ePp6evw8PL09Pb6+vv+/v4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFT2AljmQZNGUqBgaqkkHVvmMsu6990/qeWj2fKTUbEnErlaSYVDKDJIilRjRYDVQRYCFTpGyAxqACGQ/DO4SXZEBXxGQCTYR4VArzeMJRCgEAIfkEBQgAhQAsWAAbAGAEeAKHM4S8NYK8UX25Vn+6WG6TWn6iWn6jWoS8W4O5YH6iYYW0ZIWtZjxvZn+kZoOoZqDUaH+gaKTYa57ObafZc6DKdK3deKLHerLgfDt9fKTGgZiygpesgrrjg5eog5u2g6jFhZalhpajiJahiLziiZ+5ikOKiqvJi5agi77ijL3hjYucjZOejaO5jb3hj73hkH2fkWugkavGkb3hkledkqe/lb7hl6vJl7rel7vel7zemK3PmLfemL3fmL7hmazDma7TmbTdmbvSmbzSmbzTmbzWmb3bmb7fmb7hmr3Ym6/anq3BpK6+qq+7rKanrauurbG4r7K0sZ6ZuZiAvZVxxZFixby5xr+8x8LBx8XFycjHzc3Mz5Bd0M/P0buz0dHR0tvg09PT1dXV15Jg19jY29zc3d3d397d4N/f4Zhn4eHh4rao4uLi5OTk5eXl5ubm6Ojo6PHx6enp6+vr7J577Ozs7e3t7+/v8ObF8OnH8OrK8O/a8PDw8PHx8aaN8fPz86GG8/Pz+/v7/Pz8/f39/v7+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP8ACwkcSLCgwYJ/EipcyLChw4cQI0qcSLGixT8HM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybMnyjpA5QQdSrSo0aNIkypdyrSp06Y+o0qdSrWq1atYs2rdyrWr169gw5Z8KrSs2bNo06pdy7at27dw4w4VS7eu3bt48+rdy7ev37+ADZKNQ7iw4cOIEytezLix48eQI9OZHDSw5cuYM2vezLmz589+lb5xQ7p0m9OoU6tezbq169ewY8ueTTst6Nu4c+vezbu3799UkZpeQzyN8ePIkytfzry58+fQo0ufvvos8OvYs2vfzr27d61GVZ//MUO+jPnz6NOrX8++vfv38OPLnz+ejWrK3/Pr38+/v///oIVXXHpjhGHggQgmqOCCDDbo4IMQRijhhOjZN5pZAGao4YYcdujhhz8RZd8ZcgRCyIkopqjiiiy26OKLMMYo44w0tihHfaYBBeKOPPbo449A3ibicSbWaOSRSCap5JE3EllWkFBGKeWUVFaJ05DjFbnkllx26eWLZOCIoZVklmnmmWhCieUYX7bp5ptIFijmZGnWaeedeObp25AFwunnn4CiOMegDelp6KGIJqroV3z2EeijkHYJhpyo0bnopZhmqummIZY1Hhh/RCrqqDVyYeCcnKaq6qqsJsonGGKQ/yrrrCxqMemcdbSq66689urjq7HSKuystlJqmK/IJqvsstoBO+yzo2bhhbFPMmvttdhmC5izMsJQglAlzAAItOTSKC21Omqr7rrstmsVtzF6C664cb5QBYppvECACnucmO++/RLyL7/mEgAwIVUYrLAXJya8b5H53rviCgZLHAjFBFhcq6nmlZauuyCHLPLIKsELo7xLNrHCChLvoUIaCK8QiMswVyEzzTFr+SLOVTShohcyI+xziiqzPDHDKa6ANIzndnwsyVBHLfXUhZi8ohwlYACDvFjDsMcM3wqMARMyNiGxF0PTjPaJaqf9MopAmxg3vkGnETSKK8C8x9Armv/9s8aEeAG4i007mSvViCeuOLNWpwjIDBhEjsG3XQfCBAZcEHL5GWVLXIXFSn+Ot+CgLx240nez/XbPKa59Osam+000FPoS3ATtBxPOseGL9+7775w2DrfWM4MNLgyBnDH24/TGKLvshDSBtsXSQy/9z6mj6DIBfJ+odMMvwGx3wNEDvrKJrJ8v9IuFV3o48PDHL3+awp/IBeYncl0C8syfUQLZnWtY6UTnPdKNrnWoI9/p+gW0gNmtSKwrIIqgJ0GBvex7FlTg307lvvl58IMgBFL9Ajc2QjyOcvsz0eUgx7kArs+EL4sgzWT4NvsFrYETLJ0A4cY3DJZPRdfLYBD/x6c7Dj4thEhMohL5M0KsSW5yxzOR8jDQPOe1bHU+41kWsTijudkNZhcDIwwZhsMTyS5uOGyCz9LYvRW174hLjKMc58ibEZIQc/pDngkhB0AXBs5gd/MCIIskyIfRyGHh8xfB8FU7BZ4xaA7jWySZtrsO0vGSmMwkZuxYrk4u6Y3V0qQoR0lKsXDSk6g0Eig/VspWuvKVUTllKmcZo1W+D5a4zKUuXyJLWvpyY+i65S6HScxieqSXv0ym/W5VnFAa85nQfCYylfnLYuEqmtjM5i6HMqIwiGFc1AwniwBRyQsJU5voTGcm+TSHNYBTnPAExBqYaUl12vOecWQnF9wJ/09xyrOc5sSnQAf6QX1yIQtYuIIVPgeFhpJBRmRoqESf8LmKWvSiGM2oRjfK0Y569KMZTShA4UjQkpoUcews0EERqtCFPgEKLXTRGRqK0Zba9KY4zalOd8rTnvr0pzotVjBZedKiGlVkQ2qnSlcq0oVWwQ0yvWhTWUrVqlr1qljNqla3ytWuXpVjQz3nUcdKVmwl9VNLtRVVrVCiqzl1qqaKq1znSte62vWueM2rXvdqV0ohZ0xlDaxglTWkPwwoTAjSAlULoaJC2FSok6KQZCdL2couqEI5IupgN8tZVYnIsN0sT1pZ6gftNRWsfqWPalfL2taux0Lm1GxnZ0tbRf999kIjqg9iJ6XYLIyLnNJCrWupQ9ziGhc6saWMWGvL3ObaiSigxW1qznMgW/HBC5BF7HFrw93uerc2yl2uc8dLXisN5Q9H4IF6ccDeG7h3Bz+IrwnmS9/6xhe+782vftvL3/76978ADrCAB0zgAufgwOtNr4IXzOAGO/jBEI6whCdM4Qpb+MIYzrCGN8zhDnv4wyAOsYhHTOISm/jEKE6xilfM4ha7+MUwjrGMOSwSoKBXwkCQb33ne1/87jfBQA6ykIdM5CIb+chITvKMl8zkJjv5yVCOspSnTOUqW/nKWM6ylrfcYZLcGMc5vq+YfWxgLpv5zGhOs5rXzOY2u/n/zXCOs5zn/OGSYJjMeKaznvfM5z77+c+ADrSgB01oP9u50IhOtKIXzehGO/rRkI40mg8t6Upb+tKYzrSmN83pTk+Z0p4OtahHTepSm/rUqHYzqFPN6la7+s08rsGrZ03rWr941bbOta53rWEfFODXEajwCX59ABQwmAYIuACvl83sZuO62dCOtq2H/WsOCJvYxlYwDX5tAAnIQNrgDjepny3ucpub0RDgNrcHYG1qq/vdBWD3g6ld7AWzQN3JPre+991ocvP73wCXc7rfLW93w3vd1nYwvbOt7YEbQNkBj7jE5+zviVv84lYeuAQ8kO6Cc3sBIA+5A7A9b5L31wbp/55AmTHO8pYvueIuj7nMWdxxa9f8CNRWeRA0kPAg3NznBw+60OU986IbXcUwP7rSl37nm988576OdwrS+3OHC/3qJme61rd+4aRz/etfd7rUcQ7sIQy83lXHutrHDva2uz29Xn+73GUudo8XQOcJqDbQ612EH+w4BMSe7wa4XYEd1/fbc0/80uOu+MZLvO7tLjvOD6DsbbO9wRpPr+WJruAFQNzxoJc540NPenNDnux3P0LUQc7tB0A486rPutklX/raS3z0ts89s0+fc6oTvOeYl/zmew4ChOv++PrGPfKXP2veS37wBgC5tyGsBMJr3uTFlz3zt89s5XP/+6V2/v/dDb/jqR/b5MNHQvYvD/7229r77o+/psWvdp0vGPBs37wJHJ5v+fvf1fD3fwL4aPSHdfZ3fbRneb83gAxoagHYgBBIaKdHAxZQgRZ4gRpgffamgbG3gEVAAp8XgSJoaQ84gia4Z6cnYdVHe753efeGbyOgYPh3gCdYg4lWgjaYg21mddg2eCL3gxWwggUQgh3Qej2QXtBnhAsGezrYhIGGg04YhVvGg1KHf0E3AUL4eav3cB/YAO9Gg0A3hFI4hnsGhWR4hlJGhexmhQeHhRzocBKggDB4fuyHhnaoZmZ4h3ooYykoYOlXBOuHACMXdCGIeny3h4i4ZXmYiIyYYn3/+GAxcHaRR3go13ovGG8YqISNuIlUtoic+IkgRgIVaH4QxoYwKIeudwT31n9U+IWg+IpO5omwOIsmZnDqVgFIyIJJcH9XN320+IsuJovAOIwdtoXEhosKBgG+CIk/GHLISIzQeGLCGI3UWI3WKGfTeI3auI3ciGXZ2I3gGI7iCGPfOI7meI7oWGckkY7s2I7uGGPl+I7yOI/nGI/0eI/4eI32mI/82I+0uI/+GJACmYgAOZAGeZBSWJAIuZAMOYIK2ZAQGZHy95ASWZEWiXwUeZEauZGOl5Ec+ZEg+XUeGZIkWZIzN5ImmZIqeXvruJIu+ZK2h5IwOZM0uWwyWZM4/5mTANiSOtmTPhlzN/mTQjmUlxaURHmUSLloRpmUTNmUf7aUThmVUglnUDmVVnmVZlaVWLmVXPlpPNmVYBmW/faVYlmWZvmEZHmWarmW2JiWbPmWcDlpbhmXdFmXVaaVdpmXdomXeillPpiKxxZyMRhjfqcByzhlojiKGpaYzyhi9IV4fblpfBmZTrZ6wCeDLPhiq9eYF+Zr/YcE5BeaJkCKr6d9FcaEE0aBF1iBhbiCnEeZmDaZsLlkpniLxjiHjrl2VyhhcFgDQrh2NOhgZydrTZeZyUh5vAhvWJiJwHaBhTibYzkS0ClpSXhwFtCKplmMutmGKuiFgbedqceb2f/ZYKpZgRxHbKv5bUkImLYIbHIodME5nYomm/LZYpc4ASZQhHE4X4OYbBw3AIU3X5AJYjawmgZ6oBbImSV3d5tHAQh6ncYZfHW4oFhXbAp4iFA3g++5m/UZnSLRoYxGAka4mT1Qid0GiOMpYvdJhyeKYRtgoSk6g5i5AIDZgoeoioKZnBX6Ad75mainbD/XXlH3msQJovM5l0YKaJYHmFFnfxvAni1KYj4ocvhGpR8ncgyXmtjGAsv4pDIgoy1Yo7PHfgu3YH5XX2dXX0nooz+6gmLagUSapEcqnXKKaFPajHj6g2/qYdi5nTdKngPaXtlXb1P6nKg5pjdapqUZnh3/OKHUdgEvWHjbGZ91amhIWql9tqG6uacdlpgP+qkWGKi86KMm2qKoWKRjKqbDmZx/aqawd4lsmotDCHjspqkciqloSae4KmjIlqdVynoRamWwqnPVeYCleoiHuqozynd9qpuE+msQaqG+2p8gp6C7WoaXeq2BpqiyyqkfVpsViqoUeqKDOompWK7JmJnKKqvMCp4H96wFQAEsuIo9t4qUqq16Rp/4GooHenYOaoFM2KxrR4Tu2qoO9ocO4Iu9p3k+mqyyp6gCq3bwKq9jd6otGKz7Gmf6mrEc9pvgCZgRi3UEy6iQmKKB+ZzdGmEOS6YmG4m3SGCP+oIUu26KaQQu/4uxHNtmG5uzGWar9Zeu7vpuI6sAoAp9Bithq2ilv4an2bayiRqjuKltz/moeyezfxmYccqzqpatWqtmCyuoJutz0zq21aqjziquEPYDiNeeV9euJIuoqMqtZhulfZeBdUi1tMoBGTACt/myXUtxXPu3Z6ahahp4obmLJQamAfaCR9tgeSsC4Om2qvqw2me3xkcEmvq0Yki1feu3gkuVgfu5Uxi064a23+qeopmfYQu0wcZfl8iB/eW0cYt+g/iF53mrsqpsj7qF/2oBt3uvontmOxu8i0q63tph4Nq2pkue3AZ8mYuyssuq2Za8V1h4CppzPAps3kl7RpulxIuHof/7vcJauARneIo7YneqtM14mKWYda97pXQbpq5KuflniVQoAY3ppoOJehAab5brnbh4iSgrvlkZvgR8ZYGIf396vimWhRzGhOs3AZB7d2u6v6k6vyxbv74oiaargM9Ibf3rei8qA5oKvAecZcN7wmZbbHIrBIfqYdR7ttSXd1zIuz3Qe+vXbYMZsu/qvazbvpf3qC+qoCLquSosl7p6xFv2vy1Kb2JrpQO8YTG8do3LuChgsQsbiDtMuhNqoxZAfhU8oygbA0zsnj+mxFeWwgf8vp+5cLXZuBqWvuo7reybnOfKvQkIbEAbtEc7xepWo1TbcJt6hGjsjQZcyDNmhWL/unBsbMEq5sA9+4aN+bWqt4xnmrp/l6Ihq7kjq4Sl2sWIHGVqfMC+VsctTMguBsmRnLUpK2KnbG++SrRTq3eCrADWuqSoHMqdeMi6HGWx5mShmmICSmK/TMyj2cuAm8TIvMwfOcrM/Mx66MzQPM1kKM3UfM1NaM3YvM0nqM3c/M0Q6M3gPM7/J87kfM7tZ87ovM7Mp87s/M65587wPM+hJ8/0fM+JZ8/4vM9tp8/8/M9a588APdBGJ9AEfdAuZ9AIvdAWp9AM/dAA59AQPdHnJtEUfdHgZtEYvdHdx8sc/dHgp9EgPdKzJtIkfdKpZtIovdLj5tEs/dKNp9IwPdOZ/ybTNH3TkmbTOL3THhoSPP3T9ezSQD3UQCnURH3UF6fTSL3U+WrUTP3U+6bUUD3VbCbVVH3VwuvUWL3VNqnVU60Ex8vVrWbVUwkBlZeKyEacbHiIcEx9lArWERbDD6AERFrHC0aol3lsYS1hNwrX91eIFIC2IXDWEgpvVQxxfu2qUZxhJzDAPEd1i03OZC2VyMYBcF3Zas1wgU0DytbWr5fXHziJGvjYnC2193eAdq15Opfaqn3XPhxhdM1wCpDXZi2D8emLnr1ti13aSJioez3DUveeYvrYkH3Pk22ViX1/mu2bnf3awqm8lXywxHq7BxCGr9meceoBol26Y1qloP+NtOdKqfUW2477eSdgwifQ1rzd2rLqgakpwpatha7nszj7zcfNlGxrfGvN3EPg2Y5LqYGteodIA8Rqc+OtjEj4pqxdb95G3NIt4M5dskIHcX3KpDc626XorfmNrAsc2QsG1zzH2ZWd3P19xb89zvcdlRrwAQqA4MqtYJvd3Awb4bb910iYcBgugxDHcyv+AcpGASRA4DO+YKmd1oMd2h9eoQnn4qlpwkMQ4Jh3meRNnk6ueZ+3wSrn4Dkug0cL4vGtbTRooYDJ2uCc4kwJAbV6AH+YXstY2nyH2Sobgkzemzb+gbeLb0fuYKmN5iYwfWzYmmIonFUe3RIG5Uuoc0L/PuP0Dcq8TeJUJ8Gtmt7L6+Wlnbdm6m1+veXvbOZHGQJvzqRD6LEWKuOnCW8oy76NfePaTegkkKW2OuAUcIgOvoSG/d3PPXQokN+Ed96d5+pvmugHa4AMlt62Dtvwvd5UHt21Tc+cTpRTjNg6N+olvmGzPeuhnec3fuNvvNw6/mCtLuvOG2+ajuQaxuTz1ri83uQVhuypfrFRq4LHburdTtfLzuxevcwtjrLtLu3+HZjZNuCE3e0lvup+3ersjXMq1+4NBu4KV+txjJ/3StdBkNq4HeHAjrRECKQDMO7TTmFeXt69DuEwPs/NnpQhkPDPyXdsnW1wHteAjNaAyfBw//3GfV4DxJ3Y1p5eGOq51j7r5j5v4X2w4x3pwGfoer3uGd/tZoqhXf6dt9juRw54THri11zyzs6ow2beOjflHd/yD1bvIW+Ln4fh6Y5zFlB41gbX0wfsHYe2DO+4Dp+MwFt9xvqaaI6q5p7oVmiwFw/bupt14Mr0kw7fDbbqJ292FzDlCs/OVv+TKdfwD8Dr+Pf3byueQRfpSqjdkx+G1Zbo/Cdrfd/x5D7sl5nzr8epns4BqR/sKneh9RqCrknj9hbFOd/vvKn6i8zd8Nz4Yq1nHvzQvN/7wh+M9z78xn9qwX/8yl9iyb/8zg9izf/80r9h5VX91n/92J/92r/93P/f/d7//eAf/uI//uRf/uZ//uif/uq//uzf/u7//vAf//I///Rf//Z///if//q///wPEIUEDiRY0OBBhAkVLmTY0OFDiBElTqRY0eJFjBk1buTY0eNHkCFFjiRZ0uRJlClVrmTZ0uVLmDFlzqRZ0+ZNnDl17uTZ0+dPoEGFDiVa1OhRpEmVLmXa1OlTqFGlTqVa1epVrFm1buXa1etXsGHFjiVb1uxZtGnVrmXb1u1buHHlzqVb1+5dvHn17uXb1+9fwIEFDyZc2PBhxIkVL2bc2PFjyJElT6Zc2fJlzJk1b+bc2fNn0KFFjyZd2vRp1KlVr2bd2vVr2LFlz6Zd2/b/bdy5de/m3dv3b+DBhQ8nXtz4ceTJlS9n3tz5c+jRpU+nXt36dezZtW/n3t37d/DhxY8nX978efTp1a9n3979e/jx5c+nX9/+ffz59e/n39//fwADFHBAAgs08EAEE1RwQQYbdPBBCCOUcEIKK7TwQgwz1HBDDjv08EMQQxRxRBJLNPFEFFNUcUUWW3TxRRhjlHFGGmu08UYcc9RxRx579PFHIIMUckgiizTySCSTVHJJJpt08kkoo5RySiqrtPJKLLPUcksuu/TySzDDFHNMMss080w001RzTTbbdPNNOOOUc04667TzTjzz1HNPPvv0809AAxV0UEILNfRQRBNV/3RRRht19FFII5V0UkortfRSTDPVdFNOO/X0U1BDFXVUUks19VRUU1V1VVZbdfVVWGOVdVZaa7X1Vlxz1XVXXnv19VdggxV2WGKLNfZYZJNVdllmm3X2WWijlXZaaqu19lpss9V2W2679fZbcMMVd1xyyzX3XHTTVXdddtt1911445V3XnrrtfdefPPVd19++/X3X4ADFnhgggs2+GCEE1Z4YYYbdvhhiCOWeGKKK7b4Yowz1nhjjjv2+GOQQxZ5ZJJLNvlklFNWeWWWW3b5ZZhjlnlmmmu2+Wacc9Z5Z5579vlnoIMWemiiizb6aKSTVnppppt2+mmoo5Z6aqqrtv/6aqyz1nprrrv2+muwwxZ7bLLLNvtstNNWe22223b7bbjjlntuuuu2+26889Z7b7779vtvwAMXfHDCCzf8cMQTV3xxxht3/HHII5d8csort/xyzDPXfHPOO/f8c9BDF3100ks3/XTUU1d9ddZbd/112GOXfXbaa7f9dtxz13133nv3/Xfggxd+eOKLN/545JNXfnnmm3f+eeijl3566qu3/nrss9d+e+679/578MMXf3zyyzf/fPTTV3999tt3/33445d/fvrrt/9+/PPXf3/++/f/fwAGUIADJGABDXhABCZQgQtkYAMd+EAIRlCCE6RgBS14QQxmUIMb5GAHPfj/QRCGUIQjJGEJTXhCFKZQhStkYQtd+EIYxlCGM6RhDW14QxzmUIc75GEPffhDIAZRiEMkYhGNeEQkJlGJS2RiE534RChGUYpTpGIVrXhFLGZRi1vkYhe9+EUwhlGMYyRjGc14RjSmUY1rZGMb3fhGOMZRjnOkYx3teEc85lGPe+QjTxiQhT6GhwF/DOR3GFAIQhaSO4dEJCAVqR1GNvKR2YmkJCdpnUpa8pLTyaQmNwmdTgYikZ98DgMIcUpUEmIPoyQlczopkDewspXJeSUsa5mqQACCD7vkZS99+UtgBlOYwyRmMY15TGQmU5nLZGYznflMaEZTmtOkZjWteU1s/2ZTm9vkZjeBGUlACGSQ4/RmOc15zmAGokG5RGc73flOeMZTnvOkZz3teU985lOYplQlA55ACH/qU6D6VKeCBDFQhCZUoQtlaEMd+lCILtSUgPijKdPAgIhmNJsFRZAuNTpNLhCgDB8laUlNelKUphSiGP0jH/4IUCeoVKbFNOhMlckFRFahmXqgQhKUiYcSHKGcUQgAHGx6VIf2oQRGRWpTnXrMQV5hl1ewKEafelQFXZWYOBWICuRwTDT4lA88FSsygSpUX4Y1mGiYgRow8AU+3EEATO1lFAQSAV4Sla5pbetbzQqDvfqSp4VYajK38AKlwkEPMABAXEuAVz6oIf8AaL0DAQTS2F3atRCTrexAOLDYokYWsr3MQwkIgtfSCoQDcbXsZgM7TDW4dpeL3SxajclWt8J1q44USBbC8NVjbsG2Yy2BbhOrVeQm95cMGANAlavSrD7Xl14gCAPa8Eu19jK71txuWl9wB7/KNbDiTSYavuvXY94BsMQE6muHKdzELnauatAAamFQBciKt7Sr1asvJTtbGBBAqGoYrWBhsNqxwgC1AiZvf4sZhQj8N7OonStYzwvXOxT2l1pISByA2d07zGCveijuMfsgYumm2KRjiKqKTRpdF3O1kb/cAor50IeB+BTHhRCreXfZ3g8LxLY75vFav1tY/ZYAsxL/Zu1ljRpbJ/PBvEAGJlCFPNgcA1W3wv2xhm8skPUCU7ghVmwJnHAEJ1ShsXIlb4MjUNrh7lLCi13CAUQbzMUimLyiJe+cH0tMPz+5EByQKwxcC1rH4nXKGj5uLzmsEODyssZ75fIutyCQtw4WyejNLlvd62JQh1rU3ISxirn6AjbQ+AW8zLBRt5tdIPdh1cKsdKul7NNL57jKAiCDgpsc5R9XmJdqQPBty/rjMN/asUylsnpdrQQsFwK9pIUBGT7wAfESe7FCTfIR/hvbycoZs9sGLIHxfGBxDxsAbu5ygYEp4WwHQAWEJsBq/7ttcwsTvLrlQxgY8ltJz5rVGvYx/4l1S2W1GpyXjR51wx3+cGiWOsU4fcIvyardHpd1u1yudDAr3eljD7OzBWYyq4V9Z2TiWAnUpquz+1BWhBNk5cXMQ7UPLNdt37mzg45saHPecwB7O8J4hXJoE4xgJkt255hFJrwF0ITGRoHQFW4zAYyubwyg1SGz7Sl2xapwhS/7xyImcy/7MG2Ip13ta/elxKW7hjPQWuAg5+V272ADPNjY42ile66FvGsVMB3ovtxzzT89TJUjm9JfkELLCX7saKNd8cEmQ2tdG284kPfnc4bBEWreBHfzMs/BZiqB96xMPzc2z30ObaEPH9dpbz3gpNUw2Essdkt/obsMZ3vvff/fcLdDfNI3JnvW615WEnch5DRGax8Am+HlB1O8Di456TMb578a1dYLbwITaM9sLxuz8E/P71KTjFe9bn7cnY9sB0IPYASPvrKeP3m7Ac10qQOd3XCuvtnDP4Z/86XhuzGB4wMuQwP0orIbswEv87Tfe0AIdLHgg7iEo4JCmIEp8Ck0IAi+k7xe8rviGiwY6Dj2mitEGzzSqjAoU63g0jVL+zvHoizTAjNXc8ESZDYBQLfMmronKyraqq2dG7Scq6z3OzpWs6xwOz37C6YV5LnUSsLWUj1fO0HCC79dYohIOz7i4jfYKwQG/AI8wICBQLEwFLgTe70ITEM1hK4E8YPvNXyo/rsmZ3vDFETDZHq0g8jCX5I1OuxDPwS+NvzDgSo6O3ymDLPCN1TCaPK3ggA4QXxESATEjopESqxES7xETNQqQVgQdspET/xEUAxFUZQnjqopNxxFVExFVVxFVkynWXpFWIxFWZxFWqxFW7xFXMxFXdxFXuxFX/xFYAxGYRxGYixGYzxGZExGZdyMU1rG3EAlZ7yNVIrG2kglQqDG2bDGa8RG2NDGbeTG1vDGbwRH1RDHcSTH0zDHc0RH0lDHdWTH0HDHd4RHz5BHemxHd7zH0TBHfSwNfuzHffxHgAQNdRzIdIRGg/RHhDyTgAAAIfkEBQgAsQAsVwAbAGEETgKHEoHUFIXWF3/PG4vXKSovLD+NLH/DLS02LzmEMDBBMTVrMTZ3MTh9MXvBMkKIMzMzMzRaMzRkNjMzOHrDPkh6PnnFSHfFSKXeSU1sTlFjT3XGT6ngUa3iU1NbVnG/Vq7iWDQzWTYzWlRWW63gXlJUXnC7YjUzYqrdZm+2aKncajQzakZcbDQzbqbac6TZdWyxd6HZfDFnf2W0g2Owg5vXhmWqiW2ci3aRjHyNjZrYkMrzk5zZlxBqmKPbmMvxmXKGmc3ymhBrnSVToG6Fo3OSpM3spNbypUBGpnamp9rxqNzwqnqwqt/xrExFrIa0ro26r1w6seTys5HAt5XEuOvyuWs2udDnvezzvqbCwO/zwXotxYEtxfDyxq/ExvDyx7u/yLjCycC7ydfjyfHzyopHyrPEy4coy4k8y/D0zJFSzYkp0PHy0Zlb1Nvh1sa41vDw2aJl2fDv29/g2+/u3O/u3e/u3+Hg4e/v4uTg46xz4+bg5NGx5enf57J75+re69eu6+3t7Nms7Ovs7ejp7e3c7tut7tvb7uLj7u3t7u7c7u7t7u7u79HM79fU792w7+7F8LmF8Me48O/I8PDY8PDw8P7+8cWt8eC18e3D8fHS8fHs8fHx8uO58vDM8vLy88Se8+e98/Pz9LOI9PT09erB9fX19r2U9/f3+KyK+bCO+qiL+vr6+/v7/Pz8/f39/v77/v7+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP8AYwkcSLCgQYOqEipcyLChw4cQI0qcSLGiRVUHM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybNnykVAEQUdSrSo0aNIkypdyrSp06Y+o0qdSrWq1atYs2rdyrWr169gw5p8Sras2bNo06pdy7at27dw48qdS7eu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI0ueTLmy5cuYM2vezLmz58+gQ4seTbq06dOoU6tezbq169ewY8ueTbu27du4c+vezbu379/AgwsfTry48ePIkytfzry58+fQo0ufTr269evYs2vfzr279+/gw4v/byy2vPnz6NOrX8++vfv38N0jTUX/ov37+PPr398wvv//AAYo4IAEFmjggQAelQoj4CHo4IMQRijhhBRWaKFWCo6n4YYcdujhh66pAuKIJJZo4oko9iViiiy26OKLMJ64Yow01mjjjTgqN2OOPPbo449AlrZjkEQWaeSRSAI2ZJJMNunkk1BmGOWUVFZpJY5LXqnlllx26V2WXoYp5phkEgdmmWimqeaaqp3J5ptwxiknZG7OaeedeOZpV5169unnn4DOF+ighBYKKJ+GJqrooloiyuijkEZKpKOSVmrppS1SiummnHYqnqaehirqqNGBSuqpqKYKnKmqturqq6+x/wrrrLTW6pmstuaq666N4crrr8AGy5evwhZr7LFrEYvsssw2a5SyzkYrbbHQTmvttbVWi+223J6qbbfghnvpt+KWa26i5J6r7rp6psvuu/BGOVa89NbL5rz25quvl/ju6++/8pYE8MAEJ9lvwYU2YgUegDi1xxcQ34GwogdPHGgeD2S8QVNbZIwAF0TBEUEPFvdZcclr4qHyygwT1fEDEBTBsccgBwWHBBl78AbKd57MM5mPsJDx0DArscjLRCdd9FEvfzwUGzhnrIDMP8fpc9VhBq10BEYjrfTQXDNNM1GfhCC1DljDeXXaXGqdAA44gLD0yxCIYPfdIuDMABVAsf+sshYei+E3HnsI7YIdLDfMNplrL36l1lxD3nXGKSziyA9GAFWICg84vfnXoIcetuNiNk46lZJLfjTlZXcO8ueecx767ESPfnqXpt8OZepCh/1yCm5P8Absr8tOO+22665l7so3yfvclC8CidwJ6ED8IoRArH0YUHgMcRpS07D9+Ds3v7zA5mv5vO/RK0IGBTLf/EAD5RMVPFDyJx/ICj6kzyXz/jPS+ib3gMq1rgNm09hR3HYB/EnNaEBxmwYkFsAqAbCCQRrg6gpoOaHVDoJFCYQJ2pc/CCaie2PD4JQuqEIfafB32KuC2ToggheIYT5DQ9siShhDsGWuhQEjCRD/d9c7JajuZR4YnxJvSBTwLW2HD5QECmGmwyE+iYVWvNELj9e+oGQChQ5AgwNhFgYPUjGLUMIiGmm0RS5WbigizFgDFCe/pMVsjVdEHx4FWETViQJugAwk3Ib2xqA4kYNj/CD2hkC1PRpJjY5skQaVAglCwtGDC4iCzZIWxr5VoYuR/BEkQ4kit32wCnhLpQhgUMmMVdF9Q5tAwyTxSaLpzIseLCQpezTKXZbIlD6sJehS0MoHVLF1VEwEHBJoyUu60pc+6iU0QQTMBwrza8TMYQTNOIE8jNCOIARK65I3TRtJs5wd0uDgEsfDE4KNmXYEQhNTiE5z6rGeNZrkUBC3/zI3yI5ribimC+KYszpiIJAkiNoc8WlPITK0RokgAg5sULOjBBR0YcTY0CYIRfhZjnqh0+VDX3TOkaLoDMPs4QM4ij0rDAVwoatA/UzqopLStEQarR0NcMlSoyQiD6oUQQZIdlMY2bSoI/IbBZG6wnsy9alQXcRRo0pVK061qljF4FWzylXzbbWrYD3dV8NK1rSNtaxoRdlZ08rWgq21rXD111vjStd6zbWueGXXXfPK13Ltta+A5dZfA0vYaQ22sIhl1mETy9hiLbaxkOXVYyNL2VpNtrKYddVlM8vZU222s6D11GdDS9pLjba0qIXUaVPL2kSttrWwDdRrY0tbPf/Ntra4ndNtc8vbezm1t8Bt1W6DS9wwDbe4yD2fQ5PLXNH+trlpSUQa7NbToEDCbhnQZF/cINFbnqURdJhLROGWg6U6Zbw4KO9bGqG9mUK3Lcet7PSeOJQvylFxfMnpK58yvakBhb1KDDDEmIiU4IWXLPdryh8FiYNGAqWV5HzvWuIb2Uc0IXQ6yOnWwrmWOnIxaQZIyudyRodiulEpBi5Lgu3HAo8GxWuE/IQghyZIB0vYLBSGLBlmRwMzbvgtHv5wLCnJTApo+HgiLUqKlaJMQVKPAoF0ws52fF+gwJhyQU7pjdGSY8ZCjXLcW6n2PBiBL4APAjlo71tkzOA2t1n/vSJGYQUg7Ga4yS7JLK4yk68Zuo/VsZNWBjMKdZBlbG6Zy8899FIOOUFkVq5wlLuo6+xSR5FWGr9MCajwWuk0n9byjRa228ZwqWf8UbeikqYdAvpAveS9zHpC29shWNaHByZO0ThONK6RIj+Wtq4Fs6wCR6W7UvOyJdR4i1oCaHg3ZTP71E7hNBfYYIHySdcDbfj0Nku95EBPOihuGJ8HG7C9Q0Jgv69u5UKHAmEO75osXU7sjp8tghkG1W7LFsGo21JNIQ+t0z6VwkxVxohaCo/YMOsB4ijY7W5vEOBKHrd1W73fDRIay0LG87uPEu/EFpqLIXYLeutMcrhJ2aLd/3OxOL9ZbEV4k5BLbfi4D+xtiOd5fom8Y1Fe/UkFMOHjht44UzqO2D7cm5mpVKh418n0lS0abDBQKcxgwAeV3QHSKZR5qR8Osn77e9Iv6/H8Sny3ENQt2c+OutCXQnTMvmzdKg05XFL9Ybhb9JArdecDPPp2lQJa62N/6di87m+nvQwHCjSk2X8IRQjAwL1rR0rbCfsIiTKYzIKUXchH/HWivZLPx7M7r3EWNgt7t+/YY4PtAG/3pnXdx50He8bi5rqfsvyWjvAxCsQY+aRMPrAm9vfmjRd7YwoekaMPPFOM3j+joN4orKc51/u2TlMQvwX8XKe3L15AHx+0BmJMhP/1h9x7yeu6/In8+vCLr01PZuygJE+o8p/CBlUm8Ox4u2X0j2/zoDBiCMqmctgTBjZmcbDzZShAZSNAFP7kc+jHceeHfm/nNzDlAIIzOBTkCPe2gUHVfFJXd9KXFG6wBt72YU6zfy9GT16Edy03gDdAeoy3fRfFNURwBfM1TG3wgBC4XDpYX7WkAeNTSw4gYF/gUnP3aU2nMvIjehb1SRlQBFc2OycocaQ2f9MXFH/wA8q2dzLTCFggf0QDaNtncYuATFrWg0Txe31FeCAXgmshaUlEhGa2dUhxCR60MSzzZURDdbeGgjUHMokQBmBoSz8AT7XzAkY4hq+GTBHgZKD/hIZAoYZ8RVCxJ3ciB3q0w4RGUWv0tQhHdjYRx20zx39dd2EfBgE3AAZhQFTHhwKokEC010yw9G2QGBSSmFcApj1T9G9KZHBxEVBBNTT0Rl1u6Hz09GUQcH9y43iY5odXeEgoUEZ2ZANgIAfWlTOJeHhgg3gPgEBTpwj5U3GQeIuA5QhT5AAwZXeSJkt4UUziyBQMFEHClAJvR2V7dwVVaIkO53oPlgC710E5UwTFWEdVFHbfNEFkIDwGJYu1aIsRiH6NoIdj93bSBwq5dInsR4dDgUz9M34kNoHX5AEuxYaqVlFLNWL7tnMPlIIPQANNMFSYNosM2ZCR+JCRtwda/2hL4fV2nIA3zPSOZkF3lViMQOFEH6NhHNV3qSZrJCmFJhkUnEBm4qNEAEhPr2YUbvCCSlMC1RiTaEiOdBVkI8OScwR6YviGqLSBwriB3qVkpihLereA3hZyCOcC2xZ7/feBtNNALFlFkjAEgzg77FiLYBlXkmCK/ih9FCmRXKgX7mgWj2k5K7BTZAlHL2BtYSCHASaET4mFsIdRJnmVEYSYOXNDn7CLEaaDhRlX0/OPLlNlt7YXkUkWjLBMmYQUz8cW/GhRqsCBNlCAogkUGgWTROGFCWUBXqmaNlmLD1OEybkXfwBIMQgXzZmIbNGcX2Bsa9GcJOhFBEaTbLec4P85nkCymuR5nsNhnui5nr6hnuz5nrnhnvA5n7Qhn/R5n69hn/i5n6qhn/z5n6XhnwA6oKAhoAR6oJthoAi6oJahoAz6oJHhoBA6oYwhoRR6oYdhoRi6oYKhoRz6oX3hoSA6onghoiR6onNhoii6om6hoiz6omnhojA6o/AmnjR6o60hozi6ozs4Ejz6o/Vpo0A6pAUqpER6pAlqpEi6pA2qpEz6pBHqpFA6pRUqpVR6pRlqpVi6pR2qpVz6pSHqpWA6piUqpmR6pilqpmi6pi2qpmz6pjHqpnA6pzXKgyQKCZZIp0lqp7W1OWiDp/izUHS3bo8QA53JFHCgcYDahIL/CQn6gwJEuQiFygUR5W7slqdPMansJlJb8EqPUAMhGFBoAwd5SniaiD86tKj1xQJAWRad6lOM1EGtCls6aj6G4KhKAKgiI5CLVDOfSgdwoAOaqmIx4G6VukGWdKx5AEJDgGpVUEiFAKnz8WgoQElyN6wK1mmFymFBU5BJFq3hVQiGuhQ306rB+mJwp2lo0W5BZonHKqmsGly1GkCq6kXNGkGgGqzYmhQk6TSQgGeJukjcOD8E5Wo/1kQERDT0028ZUKxlQapWhmfiCjL16kneqhRbkJdP80oBq5cqmBR4WqnBygg3pKuZ2FvzqjtR6EODCqzCOq5PEVB49qvSA3cB/1upm7NQlqACIbcFeQquC2So0eoHsaogIQYHGqsgs4M2bCh3EOtFDutpmMqSSrNumwNxohptBiCyhMY1/1pfhlqxKCuniRVRQ5ABKqBLEeWr+fqyNYO0h+qDhZS1i5AGRrOtL4U2lToEODAEwkoDQ/C1OwR3QGsUcFsFOvCu/Tg7pccCGlcUgltgoBpCUWtdmtix5KpD0bpNKfCu4sphPkuUIctI54o/ujSpi7q5Y8untLU5XtsA7YaF1Wozbos/SQuvfum4d4l8Vqa3fPs1CPCqISStEYcAgVCtdLdflSSOQfO4RBG5CzS5q/pGT7tDfoY8lrpDqYqpzVsFTBi6Rv/LtTMYTuAKqHi7uj6aW5p2YKq6vMHnZ7ULj59ZcYX7Yr6rBPcquPe6SV9jsykAs4pbhYokv065sjm0BaAGs4FaFJjLwLTDqam5FKOrBKW7iSGGp90qr2QLWEKpNKlaOZOqrwqcqcVatH3DSIibt71qljVTuHRbFEMwrAF8MxGwAuEUwE4RNFP7UkmLwIjqvBurwvAKvHELuVtLuh5sv9KDtrPaWilrPoWqAuL4qiEcv/zlOQp8rtV7NExrqPn7RvuLuT4svPYDwCZ8fANMFgjcwM/bAMdbjEA7sbwGxLSbt65rw2VcxG2Mw1ysOeOKq5ozu7n1xMojsy8cQeMqx5L/CrNwuxQ++1Iht6jY+qoha5bHS7QQtKh8LMMCdcI3bMLN68g9i2eQ4K+ip7g0a7h0jKpCjMOTfKoQVpWE9KqielFyJ7axRcinc1GF1DE6JLMPRqiMfLt+ShSfi6zPtMhd08s0QAPLWrNA+7SfI3oyfMbuB0645LyVpEu7ikuEm7ZPUzmpdrmrrL3reGAdTIvga8F8bLea1q2qSsa4pcuLozV41jEGgMCShja5iWKfGUtuiDQhtra1BGueF7CmtFBsXM3GesZ8fBQ562lcUwV5eTOVU0e2U8HS87G89o6uPMJnsa2PjMan6sQbrKe2cWlbRs8ovZ8s3dL3+dIwPZ8y/z3T71nTNr2eF7LTPN3TPv3TQB3UQj3URF3URn3USJ3USr3UTN3UTv3UUB3VUj3VVF3VVn3VWJ3VWr3VXN3VXv3VYB3WYj3WZF3WZn3WaJ3War3WbN3Wbv3WcB3Xcj3XdF3Xdn3XeJ3Xer3XfN3Xfv3XgB3Ygj3YhF3Yhn3YiJ3Yir3YjN3Yjv3YkB3Zkj3ZlF3Zln3ZmJ3Zmr3ZnN3Znv3ZoB3aoj3apF3apn3aqJ3aqr3arN3arv3asB3bsj3btF3btn3buJ3bur3bvN3bvv3bwB3cwj3cxF3cxn3cyJ3cyr3czN3czv3c0B3d0j3d1F3d1n3d2J3d2r3d3N3d3v/93eAd3uI93uRd3uZ93uid3uq93uzd3u793vAd3/I93/Rd3/Z93/id3/q93/zd3/793wAe4AI+4ARe4AZ+4Aie4Aq+4Aze4A7+4BAe4RI+4RRe4RZ+4Rie4Rq+4Rze4R7+4SAe4iI+4iRe4iZ+4iie4iq+4ize4i7+4jAe4zI+4zRe4zZ+4zie4zq+4zze4z7+40Ae5EI+5ERe5EZ+5Eie5Eq+5Eze5E7+5FAe5VI+5VRe5VZ+5Vie5Vq+5Vze5V7+5WAe5mI+5mRe5mZ+5mie5mq+5mze5m7+5nAe53I+53Re53Z+53ie53q+53ze537+54Ae6II+6IRe6IZ+6Ij/nuiKvuiM3uiO/uiQHumSPumUXumWfumYnumavumc3ume/umgHuqiPuqkXuqmfuqonuqqvuqs3uqu/uqwHuuyPuu0Xuu2fuu4nuu6vuu83uu+/uvAHuzCPuzEXuzGfuzInuzKvuzM3uzO/uzQHu3SPu3UXu3Wfu3Ynu3avu3c3u3e/u3gHu7iPu7kXu7mfu7onu7qvu7s3u7u/u7wHu/yPu/0Xu/2fu/4nu/6vu/83u/+/u8AH/ACP/AEX/AGf/AIn/AKv/AM3/AO//AQH/ESP/EUX/EWf/EYn/Eav/Ec3/Ee//EgH/IiP/IkX/Imf/Ion/Iqv/Is3/Iu//IwH/My/z/zNF/zNn/zOJ/zOr/zPN/zPv/zQB/0Qj/0RF/0Rn/0SJ/0Sr/0TN/0Tv/0UB/1Uj/1VF/1Vn/1WJ/1Wr/1XN/1Xv/1YB/2Yj/2ZF/2Zn/2aJ/2ar/2bN/2bv/2cB/3cj/3dF/3dn/3eJ/3er/3fN/3fv/3gB/4gj/4hF/4hn/4iJ/4ir/4jN/4jv/4kB/5kj/5lF/5ln/5mJ/5mr/5nN/5nv/5oB/6oj/6pF/6pn/6qJ/6qr/6rN/6rv/6sB/7sj/7tF/7tn/7uJ/7ur/7vN/7vv/7wB/8wj/8xF/8xn/8yJ/8yr/8zN/8zv/80B/90j/91F/91n/92J/92r/93P/f/d7//eAf/uI//uRf/uZ//uif/uq//uzf/u7//vAf//I///Rf//Z///if//q///zf//7/////////////////////////////////////////////////////////////////////////////////////////////////////////////5QQQBv8v4QQAAWHw/xFOALAAAWHw/xBOALAACxAQBv//4AQAC7AACxAQBv/v4AQAC7AAC7AAAWHw/w1OALAAC7AAC7AAAWHw/wxOALAAC7AAC7AACxAQBv+/4AQAC7AAC7AAC7CwChBQBf+v4AQAC7AAC7AAC7AAC5T/QAAv8P8JDhAEYA0kOHAQhDCxFC5k2NDhQ4gRJU6kWNHiRYwZNW7k2NHjR5AhRY4kWdLkSZQpVa5k2dLlS5gxZc6kWdMmSYEFC9qBcNPnT6BBhQ4lWtToUaRJlS5l2tTp05o5C0KgShXqVaxZtW7l2tXrV7BhxY4la1EqgS+wOmAp29btW7hx5c6lW9fuXa85CSAQaOcAXsCBBQ8mXNjwYcSJVQpEGwuhWraKJU+mXNnyZcyZNYeEQICIwjB9/24mXdr0adSpVa8m2qENrASsZc+mXdv2bdyS9RAQISb3b+DBhQ8nXtz4ceTJa7MKtcn5c+jRpU+nXt36dezZtW/n/97d+3fw4cWPJ1/e/Hn06dWvZ9/e/Xv48eXPp4+elXLap+rv59/f/38AAxRwQAILNPBABBNU8Dv8WGtlQQgjlHBCCiu08EIMM9RwQ/EaVK0UDkMUcUQSSzTxRBRTVNE7D1PzZMUCJ2miBxipc0KAOPazpIAsauRwkhl08LG8JTioEEgjETSFhzGGdLK6FlF7EkAZaawODiupw6SJWJC4A8FCgrBiRuhuzLG+HXuszgkhnyMjhyWbbE8SIYp4cxMg1XyujCSfm6JN7/iELs/zGlkIgDMN0SAWRKkDEtDs/mRPUukopRTPGfRcT1DnipyPU0XP5A7J6t6MsztJgpATvP9TtVR1ShWjPA1W8GRM4j0ssSvESzBVJVNCNqEzlUn3Uk3iTkKh49RPSLdL1rlly2tkgOgU1dS8S9PL1rlQnbv0WfXAnS/ZbtMbtklTaqhDOluhy7XYV51rl9YQZTWNXlSFsFJGhXJ4Dg6F1E0V4FiK2MSUfuVFgoxYeEgizIUcrm7XLzcp5IiEMUHCjFiOuALPKhZ6YhM1rNgEkyHWmCTkLr9cWWSLMU6ZujDHIMPgSxxQCEeLdY5lg03cCEDeTHNWCGhMjyZaISEtCQCJWHicBGoenXODBp2HtoShqt8sRF3qIFHI44ORCHnmTQjmld0gksgVyB4UUkJRhuZmCID/LAzZYAlG1SRV2T4x7XHa56ZdQonnDtcg0cWlIxy6bPXmG+9NymBaXhp2kLvTnb2lYVEju432uUky33yTKZQ29FA9JV195yzgPj31nzdRlAYA4hZy9UaBVHrPJFcPXgPcddeEb0Zz9F31RSk/vnPgOV8oScuTn6762m1fCPFNvAY77e/l1XfQeOlM+GQhNofDifQF5pLYtJ0IIhZ/GV7IX/QNxldDe0vbXzs66e9g+HtOutYlPhp97YDvohONDJi2LE1sbaSrwhW2RKP1xc9iMyvZydDmnFxlsBApQ9kaynYH+52OZh4QFZ6QkIROZGoTThvUC4OGNIVBake3cgPS/2KoJjdIDQltCpazKggdSJAtV5CYIMLuNx0gUasM1Kpc4FAHKEUJaYpEs+LhoPM4vR1PCXyawtwGkCcaxOFPj6vWQogYt9plsXJUvCIX52g7OnoLb9YSnRXtuEVOLaFN23rWt2YgRSkmSZBZXMIA+CS6RE7Hi9GznQZ00MhoCWoKoUMUoaYVBzaWiXuVFNUnsxPIUVqnVQGMjikI+C55NUGAaSPWzeQVLzgwqV2pWlUsI/g/CvWPNMC8Tphu9Zwwhc+WpIuXu/b1Kl5CUFdr29LYLDgzSIxMhBw0WQlJ9sRtrkFsC5lgdi7BwqRF7VbBClYMFVKAW21taM45ZwtpGP+dH1oNaT3sVLOwo4ZYmMw52YxOB0clw8eN7lLdKpfj8ihGbmlADjTQQRl08KdNziGNmcpcI/z4RQ0oIYqYmlvjykUpT1JLUY3ylpDy1EcoIpRayLtcHQEHOUCl9HluDNXh+IQ9RmnvoaGsYkTn4FMj0a52m8QjKO8GSg2wlFt5bOi2qsOp1PlzOkt6WNvwKcsC0g+Z4ZMmPnFppbc1k3S/IuaEhLmZtlqHldBJ5rqWectegvCZTapZWa1DMeeoYWQru6YJCTrOgAa2mymDxMyWuBCTEVRYdfsrOm/kwludM4Y5uuzUjjnDoNYTOvcclAxv2CmkFbE7AI3syKBj0IH/MoSApR0cFRWKRZNKNTqTnCrpZmAFHdCgjHzaQReKALTDZa4LWhUlRK/IUJaiVKaFi2qOJPXSxo2OaLV1Lk5p693t4rG7pESqdoWauFQWlbxj5MC0eiQo7CGOqBFlKW9JySztRCurqoTfXAc629j6S4HOZJuc3oUsteKJrXGN0Fs1w+DqNNCsTYJD+KIZHQa+6l2wlGDF1OBAj3mToLANLI3UwFgvXZBkAnXOlj72HdE6AWg7dGEYUjtjeNKVhTHU4Ty/e9oYHlPG4Fmia/9VTuzo9I6Q61O3mIqpJjcOv4mjQRaWENJp9aARUUUdDZQwBUtCq2DVohxTgVRS6/ZJ/7rc9W2PrpspPmpgeEnS6Raj8+TeMrnN4rWzUZFqrekwVMqU7Cl7P0kq+545poMbdCX1NMUWVm7MN6X0dCp8QAS6aZZjrYN//cpMA9PIWCfzKunqBGG3OhgzL0I1u8BKMLE6x34CUyusC2a+WHzPfBKTzsVg5muzFfZgI0NsYn2NhZS9bAhscCBDIvtE7ojWaE87ZhCPOW0bOsGN9PRZ03yczuS5Ydvcjtq1tMSlWGDTyM8BaMuyo+TlcY9ue1xUUO3YUpC2cAqImmLeLEmqfhuKe5YbOOwSdzm62VupBavz9PBNqNTlbs7hfRzynDfvHtm3kn1TssX9fVT2SvpySv8dJKSAqoNCC2pyPTASUOXrcOwlyaq0k/nOzkTw6Ahqec6TzgO/mlmyplB/EBszh3Gd6zrAWoAE89e8Wg0hVa/66e+5cLGOqMEkXz2D4iGtf/hZooYGutFWlU/YITTfsjf6O8nCs3XMLh6yh+eu6OHw1PkXdcswx+7sqbp7YI3kK5GzYt4Rd7kD9HUEcSRUTVl8cFB3qE28ZKfUeogGDFT3vVuoFXi/jH4y/3nQh170oyf9iDiPGVd4vvSrZ33rXf962IPHFaenfe1tf3vc5173u+d9733/e+AHX/jDJ37xjX985Cdf+ctnfvOd/3zoR1/606d+9a1/fYUMBPvb537/971/G4J8X/zjJ3/5EwOLWGjf/Otnf/vdDxb0pz/+76d//e1//5/MX/3453///f//j5g/+QNAAixAAzRAARzAA1xABmxA80tABXRACZxACoQ+CAy/CsxADdxA4NMJD+RAEAxBEYw6CMy+/RtBFExBFRyOEjTBFYw+D4xBGZxBGqxBG7xBHMxBHdxBHuxBH/xBIAxCIRxCIixCIzxCJExCJVxCJmxCJxzChYi/J5xCKqxCHHxBkLBCLdxCLuxCL/xCMAxDMRxDMixDMzxDNEzDHsTCjlBDN3xDOIxDOZxDOqxDO7xDPMxDIGTDjdBDIpSDHxAEPxxEQixEQzxERExE/0XMQz7UiEXUQTmIhQ5ICx+ckR3shCawgil8AgGohEf8xDdcEk8ERVIsRVM8RRpsxIxARRmMRIXAgVXAwTzoAYKwRB3ERE3UiT4oAhnMgxm4BGjygFEsiCc4GoLgxGHUxV98FRwEhSVIRg/UgnSDxhocFk9EggCAhUywgQ8YiB0aCFLwmWwciGJUp3B0o1fARk+0hG7UiW1kiG58x1jQAVg4x3LLQXkqCKphghz0RWC8AhuUg4RYiDCQg1PIwZvRiSYASFgQRVZ8SIiMyEJURYyQSIJwRYUQgVDwwFnURVpEwl3sxRwAhWCERlIQRh2cRZJkyBt0Rmp0RyJ4yRm0xv90FMZIkLGBWAIbA0dh3EZ6REadcBqCQAIP4Ed2nMEhGspuDEcmOElPBEobfIIPEEpyXEoWksWRhKYgeMmBfIhRiMGOJAhQmAFoXEgcTBeZtEi1XEu2bEKKvIi1xEgRCAMPJAOyHAgnop+G7JeBCMtM2EqwVIhc3MvNAcsc+EtPdMptHMdIGMd6FMd1XAgegYVZREwZxMTNkcbtwUQvGAg14EVtjEmCcCIkkMk3GctKyIQZwAImeIIwyMaTdMp6REmpVE1+DErHRIIv0ABYOEoZTMrZHEV2lM3G9MRtbMcZpErVHIPenMeTpBrmVMfjpMzDBMyG5AFo7EqIOMiCsMv/ZEzIgbAfYnkf42TGsPTFtGxL9VxP9tzBt7SIuHxFSqjLHBBLwAxL6hwIy3QlGiwZcBTNkEyhgonBkwQEJFhKn7lHnkxGS6BHWQRNsXxGggjJThDN0BxFl6RMKXgFdGsYliQI1QSFHBhJ3mzQdORHxawBJijOSFAnb8xNJliCMfDNGATO4nxR2ZRK/eTGGqRKp3QaNglHeqTKF6JRAmVGWMDIiDBIgngTd7TOsDRLbYTSj5TS60zP9sxSLdXS96yI+KREhfzIvvxI/MTPhARPGfRPygTNkGxJnUHO3nRMsURJb4RTG0SYDY3QYXRJU4DQCh3FPmCIPK1B1TRQHXDK/xfqTQRlmjgdxURt1Jxc0ansxq1R0HR00BuNU3uU0xv0UQ/Yoic4VJSUzXDsxBoEhTo5QYmoRTGdUDGVUim1zHokS9QsiFPZUlzN1SztUopYy0UQRBl00jEdVmKtxx3IBAmdQTVt0wClLA88yRspiEyd01FUTSyNQTwFx2QdCDbwAlUYxj/tSwgdiA4lFneUAQz1AFBI0E78UR45SeY80RcdSiZQTT5BSgeVTUXV1x1UThsYxyEiTlM9SXSlwZXEwF5t0voEUevkUIaM1Ybt1jwYV4fUVYu9WLXk1YnQVe9sSFrVF1ctCCJwg1aNQTU1hdIEhSMYV4MVRqic1gUlx//b5MEMBQULxUssmIKCCNd6vNmWpNOTvFdtzJQU7UagfFSqlNdIwAE71UcHvdTHbEo6BVEepcGkDdXefFfajEcVTVoPrNiBUFKIYNImvcuGXNjwpMU8MFdZPdubRU+MjVu5RUWNXVVdjdJc68g8cNa1/VCdaLeO6UxpRAI4YNkZlE11hNSdRckWRccbBNzBbDfQxEX97NDSpEzI+tl0tYGnDVWBvcZ3asoEpcdEDcemHcqnPUd4Ck53rNoYrFRGfcfV3dScbMfE1QmSpMaE9Uhy/VBUpZ+FzIT0CRjjBFm8NNu5TV7lTcS6jYjlnUOYTcIMfV7WJULtbIhSoEH+pF5O7u3eiGze7fTeM6zUyVxClR2Ca7VYfh1CsY0FshVf+I3f7wVfh5Bf+71f/M1f/T1E+vXK/f1fAA5gAR7gKezf8CVgBE5gBV7gBTbghggIACH5BAUIAFQALFcAAwJXA0MAhh5n0CNgyyaC3DKQ30UnN0ec41NawlYuNlml5V5Uu2Kc4GpMtHZBrIAwoY5BOI6S2pOL2JQgkpgdi5hBP5oXhJvS95wXdpyR2J4mZZ4+RqM4VajY+KrO86uQ066Z07Hf+bae0LeexrmWubri9ruQrb3R68KSnsbo9MqWis3s89D+/tGVa9SVW9T+/tXU39v+/tzv8d6cbODT2+Hw8eXP2eeoc+jw8ej+/uuweuz+/u63he/W2fDw8fDx6vHx8fK9i/Ly8vPz8vXDk/jKl/j49Pr9/fzmvfzp2fzqw/zsx/zuyvzv0/3Zq/3gtf3kuP3+/v7fsP7+6v7+7/7+/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gFOCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmIUELlSdnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsO8BMbEyMnKy8zNzs/Q0dLT1NXW164EU8fY3d7f4OHi4+Tl5ufordrbnOnu7/Dx8vP09fb3qOvbBPj9/v8AAwocSDCePnYFEypcyLChw4cJDyKESLGixYsYM2qsJXHfxo8gQ4ocSVJeRyKbSqpcybKly5ccD/FICbOmzZs4c1o8OcUGTZ1AgwodSlQczyky+BVdyrSp06e49AURZKwq1KtYs2p9ui4IgRDbRGwdS7as2ZXavLrQlvSs27cK/4sE8UG3rt27ePPq3cu3r9+/gAMLHky4sOHDiBMr9kHAawjGYAmQWEy5suXLmDNr3sy5s+fPoEOLHlzEE5HRqFOrXs0atbHHPkKwbdy6tu3buHPr3s27d2Iqcn0LH068OOBN24wrX868ufPn0AMHj069uvXEaxPAvs69u/fv4MOL353hgnAmCWDQ1bBhdfnx8OPLn0+/vn3f7/fGML+ZvQ8kDlBBQHt0IYEBgT4wEcEJhTHBwAyI5aeXgxDeZ+GFGGao4Ya4aTBCZ/vZ9cODlfkXQwU+xBCAej6woMBdMQjg1w8Q3MUCB51RWBcTFKTA4Y9ABinkkD8moQF/PWTQSf+NdMXQyYNJULBCJzj+sGSBDLBAhQUj8OgJl02S2OKLPgixYgxk+sfEAVQsSJeWAiKYYHr/uWkXEnammKeePu4oppNt9mlloEmicOWgSK5gKBXmKekJfz9I0CeRlFZq6aWYCmckjnTReNeIFf53ZIJ/8mekeaCmiGRdkfqInno3ppjmBngyaCYMMa4nZ65lyojXBCg2mWcMYtYVYp2TJtijXe9F2eexLUIJpo528fhhpthmq+223B5mbbUWFBtrXc7idWy55UIrIpjsIUEimroK8cmK/iWJoBB2CuGrjcHixQKTdy5LVwZgNrlqktfaBe24sVILLqfdRizxxBRTuun/XTySOG6BAits6rI8+qhup5J2qoAQwcJrr7531VuvEAOyui+zcsJYrKq/gjmyh+YmymkGODpM17cVF2300UiPd+pd6RZbLowfi8zkyMSG6q4JDKYoYwwDGiiniynGvKactTI9bMzGlrxewnbF2iqzbBtcV8Mgd1ym2knnrffefA/HM6CMzv3kDE83+QkHRg5eoAZbfphq2/sCSIUA/snbyYtrUqGAfxMc/iaZxs4sL+idMunpjhYonmInJfNsrOdwFtzilSH3bfvtuOfeXOGC1XuZ1zvuCbxerl+2se7IJ688btMhz/tfnfeL2au6KkyF9KEdv/z23He/WRGCeC/+//jkl6+3aaeZr/767LfP4RNwxS//KYTMb//9+OdPTiH69+///wAchiECSMACGvCAqTgEAhfIwAb6DxEOjKAEJziWRFDwghjMIFASAScNevCDIAQJAgShgwCoYBD/CqEKV8jChQyihCfkXwtnSMMayoMRNsyhDnf4DRzy8IdADKIyXhiADwxCiEhMohJ3IQBBNCEAIxTEEqdIxSquYhBLoIIRj2jFLnqxiyTshAy/SMYyTrF+ZkyjGn+IxjW68Y1wjGNOMkHHOtrxjnjMox73yMc++vGPgAykIAdJyEIa8pCITOQlTKPIRjrykZCMpCQnSclKWvKSmMykJusInE168v+ToAylKEdJylKa8pSoTKUqV8nKVrrylbCMpSxnSUtKRqE8tSSECQBwA0I+MYa5/GQUIFCBYFaiA1HU5DCTGckhRKAFxoymNA15ywsoogbWTIQSOkeCHEzSCVzC5SB22ctB/lIRJigmCiHgTGjucQns+dcUhglMQdCAmVMAgTolcU9C0LOOO/CEAMp5BANMrpyGGOY+G6FPPTbU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a97MubPnz6BDX6WMubRpiqJTq17NurXr15AbVj5Nu7Yh2Lhz697Nu7dvl7JtC6/9u7jx48iTK48cfLhzzMujS59Ovbr1ow5nP98+97r37+DDi/8Hn527+brj06tfz7795/Ln43t1T7++/fv4y8KXzz9z/v8ABijggMA119+BPymH4IIMmkbggxD+95B2DVZ4G3IWZqghVxF26CF7E26oYXIilmgiRB+mqKJ3IZ7IIIkuxnjiijTWqOB+MvIHY448Wmjjj0Dy1mKP8e1I5JH9BankkqwNieR2Rj4pJZRMVmklZ05OKVyUWnZJ25VghtlYll6exmWZaB4m5pps9kVmmpedCeecX7Vp551svUlnYXLu6adQeAYq6Fh6/ilXn4YmGtGgjDY6GY6KdodhpJRO5OilmCJVaKX+Hcfppw5lKuqoNm0KaoKTnqoqqay22pKpqtr/5Wmsp7pq660kwUrrQ4ju6ieuwAa7ka6+MtRrsXMKq+yyAxGLbELHPosms9QG66y00UrrZbXc3gqptqFmC+6U3ZbL6rfjLnRjunua626m6LKL0LrywvnuvY3GKy+99U6L77946ssuv/1uC/DBbRpY8IXiLiwjwhCLqXDByznsb8QYMzkxiurWSrDFT2Ys8pKkORwdyAaPrHKNJS98MspariwzjYOZ/DLMUs6sc4pw4ezzz0AHLfTQRItoUVZFJ6300kw37fTTGFH49NRUV2311VhffHTWXHft9ddgh70lRmKXbfbZaKctdkZqt+3223DHTTHZctdt9914553y1nr3/+3334AH/hzbghdu+OGIJ44i3Yo37vjjkLtNeOSUV2755UxPjvnmnHfuObiafy766KSXbi/jpqeu+uqsj4h667DHLvvspYVO++2456774hft7vvvwM9ue/DEF2985cMfr/zyzPudfPPQRy/92c9Pb/312EP9evbcd+890NV/L/745CMbfvnop6/+n+ev7/778BPZfvz012//i9vfX3kYGWSwQSCU6V8HujCcMyBBBAPcCiDqcBhAuOCBJtCDUBz4wBXURRBfyCAd9Oe5+XHQcIlQQAEWEAWGCKIKBSgABAAonD+I0AAWHEoIEfAEhGAwgzjMoQ6/gIWIICIFKUwAA/+D8sMUrpAicHigEh9YQ4WEcIRW+CDnPChFwCEChSnMYhZj4EItahEBUZzLHLxIxjJm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qsmWnMPp3+/MCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzFiSkJ2IjessETDPEKWCokfJMnhspIF9LfQI/QWsAy5CAazcZEIlX8JmE/wFDAsRiJnQlPEXKHAQQks2aNVlMYxUQke+kM5TfyikDRsyeOQYB1ylZ8OpfSpC8qj57hRWmVasyEzl4qbGu3bt48+rdy7ev37+AE3LMI3GCuU4h362dh5TlsJfgzMW1qaAAqJspE9RExGtI1aszEzErcO0tyWagmY3qetJBvAKTnhqa6mut6dBvC6wuJxCdNifuQIbiSYrq7eNulYmU5XWu8MDQo0ufTr269evYGQ7Gc5dWope+N6lkS8pXpkvnY6oUxRPz+fQJdQXDqltpMuKREXElUJsbMQX56BZKUUYxwI1Rcmm121CofcWbBcC5UxVdoIWHICYKevKOLfqZlf/dhyCGKOKIJJY43XZ34AXMXI4kIwQ/6/ViQWcmddbWOULEc0ppNNKjkxClEfSTCEUNKcIjDOTiH1BFedPYK0IYUE4BByolQgHVAEWki1veZmWOoXiG45W/PGiBWEmQhYkm+Z3yIpearMUimD8aByWZ8Jmo55589unnnySiaMcFe1LoUH6YRZdfMJ/5ZZtDTLTDiqETPQropZhmqummnEIkaB0ZFNqoQnP9k6h1zIAJnaUNoVmEpHux2umstNZq660ffkqHB7j2CqirIqjp67DEFmvssSN+oOuuyDbr7LPQRivttJ0uC6oGhFKr7bbcduvtt+CaA4K15JZr7rnopqv/7rrsNhHCEO+KEMK887Zr77345qvvvvz26++/7gpBr7zxAmzwwQgnrPDCDDec8Lv0QlywwxRXbPHFGGes8cZOREzwxxyHLPLIJJds8sl3DPxxvSi37PLLMMcsc8v1TjzzzTjnrPPOPAvqcc9ABy300EQXbfTRSCet9NJMN+3001BHLfXUVFdt9dVYZ6311lx37fXXYIct9thkl2322WinrfbabLft9ttwxy333HTXbffdeOet99589+3334AHLvjghBdu+OGIJ6744ow37vjjkEcu+eSUV2755ZhnrvnmnHfu+eeghy766KSXbvrpqKeu+uqst+7667DHLvvstNdu//vtuOeu++689+7778AHL/zwxBdv/PHIJ6/88sw37/zz0Ecv/fTUV2/99dhnr/323Hfv/ffghy/++OSXb/756Kev/vrst+/++/DHL//89Ndv//3456///vz37///AAygAAdIwAIa8IAITKACF8jABjrwgRCMoAQnSMEKWvCCGMygBjfIwQ568IMgDKEIR0jCEprwhChMoQpXyMIWuvCFMIyhDGdIwxrasA4AANYNd1g4AOSQh0A0HABC8MMgGhFwQySiDo/IxLolUYlNjOLdnghFKVoxblSs4hW3uLYsapGLYCybFztQxDCaMWxjrAAADnDGNnptjCGIQBndSEerwUoxjgCoox6r5kUf+nGPgIzaEwGgACIqIJCIhFoSczhECOQxkZBc2hBzqERDRvKSR/PhAua1gCF2EpOgTBolHxnKUg7NkQLYZAiCAAAh/hVNYWRlIHdpdGggU2NyZWVuVG9HaWYAOw==',
    ].join('');
    const html = [
      '<div name="info">',
      `  当前规则: <span name="rule"></span><span name="mode"></span><sup><a href="https://github.com/dodying/UserJs/issues/new?body=${encodeURIComponent(issueBody.join('\u000a'))}" target="_blank">反馈</a></sup><sup><a href="https://github.com/dodying/UserJs#捐赠" target="_blank">捐赠</a></sup>`,
      '  <br>',
      '  书籍名称: <input type="text" name="title" value="加载中，请稍候">',
      '  <br>',
      '  书籍作者: <input type="text" name="writer">',
      '  <br>',
      '  书籍简介: <textarea name="intro" style="width:180px;height:1.2em;line-height:1;resize:both;"></textarea>',
      '  <br>',
      '  书籍封面: <input type="text" name="cover">',
      '</div>',

      '<div name="config">',
      '  <span style="color:red;">NEW!</span>',
      '  更多设置: <button name="toggle">显示</button>',
      '</div>',
      '<div class="useless" name="config">',
      '  下载线程: <input type="number" name="thread">',
      '  重试次数: <input type="number" name="retry">',
      '  <br>',
      '  超时时间: <input type="number" name="timeout">',
      '  语言: <select name="language">',
      '    <option value="">不转换</option>',
      '    <option value="sc">简体</option>',
      '    <option value="tc">繁体</option>',
      '  </select>',
      '  <br>',
      '  <input type="checkbox" name="sort">章节排序',
      '  <input type="checkbox" name="reference">显示来源地址',
      '  <br>',
      '  <input type="checkbox" name="format">文本处理',
      '  <input type="checkbox" name="useCommon"><span title="仅适用于没有设置相应key的规则\n支持的key: elementRemove,chapterPrev,chapterNext">使用通用规则</span>',
      '  <br>',
      '  <input type="checkbox" name="iframe"><span title="测试，仅网页有特殊js时使用">使用通用规则时开启iframe模式</span>',
      '  <br>',
      `  <span title="测试，仅网页有这些文本时，需手动处理">iframe检测: </span><textarea name="iframeDetect" placeholder="${Config.iframeDetect}" style="line-height:1;resize:both;"></textarea>`,
      '  <br>',
      '  <input type="checkbox" name="modeManual">手动确认目录或章节',
      '  <br>',
      '  <input type="checkbox" name="templateRule">使用模板规则',
      '  <input type="checkbox" name="volume">章节分卷',
      '  <br>',
      '  <span title="{title}代表原标题\n{order}代表第几章\neg:#{order} {title}\n留空则不重命名">TEXT相关: 重命名章节标题</span> <input type="text" name="titleRename">',
      '  <br>',
      '  <input type="checkbox" name="tocIndent">EPUB相关: 目录分卷缩进',
      '  <br><span title="关于智能的说明: 如果所有空行间只有一段文字，则移除空行，否则保留">移除空行</span>: <select name="removeEmptyLine">',
      '    <option value="auto">智能</option>',
      '    <option value="remove">移除所有空行</option>',
      '    <option value="keep">保留所有空行</option>',
      '  </select>',
      '  <br>',
      '  连续下载失败 <input type="number" name="failedCount" min="0" title="0为禁用"> 次时，暂停 <input type="number" name="failedWait" min="0" title="0为手动继续"> 秒后继续下载',
      '  <br>',
      '  Epub CSS: <textarea name="css" placeholder="" style="line-height:1;resize:both;"></textarea>',
      '  <br>',
      '  自定义规则: <textarea name="customize" placeholder="" style="line-height:1;resize:both;"></textarea>',
      '  <br>',
      '  以下覆盖通用规则',
      '  <br>',
      `  <span title="选择器，留空使用默认，默认:\n${Rule.chapterTitle}">章节标题<a name="how" href="javascript:void(0)">(如何)</a>: </span><textarea name="chapterTitle" placeholder="${Rule.chapterTitle}" style="line-height:1;resize:both;"></textarea>`,
      '  <br>',
      `  <span title="选择器，留空使用默认，默认:\n${Rule.content}">章节内容<a name="how" href="javascript:void(0)">(如何)</a>: </span><textarea name="content" placeholder="${Rule.content}" style="line-height:1;resize:both;"></textarea>`,
      '  <br>',
      `  <span title="选择器，留空使用默认，默认:\n${Rule.elementRemove}">章节内容移除<a name="how" href="javascript:void(0)">(如何)</a>: </span><textarea name="elementRemove" placeholder="${Rule.elementRemove}" style="line-height:1;resize:both;"></textarea>`,
      '</div>',

      '<div name="config">',
      '  <input type="checkbox" name="image"><span title="仅下载EPUB时生效，仅支持img元素">下载图片</span>',
      '  <input type="checkbox" name="vip" confirm="下载的vip章节需事先购买\n如开启自动购买等，该脚本造成的损失本人概不负责"><span>下载vip章节</span>',
      '  <br>',
      '  <input type="checkbox" name="addChapterPrev"><span title="用于将一章分为多页的网站\n脚本会根据网址过滤已下载章节\n对于极个别网站，可能导致重复下载\n会导致【下载范围】、{批量下载】这些功能失效">自动添加前章</span>',
      '  <input type="checkbox" name="addChapterNext"><span title="用于将一章分为多页的网站\n脚本会根据网址过滤已下载章节\n对于极个别网站，可能导致重复下载\n会导致【下载范围】、{批量下载】这些功能失效">自动添加后章</span>',
      '</div>',

      '<div name="limit" title="优先度:批量下载>下载范围>全部章节">',
      '  下载范围: <input name="range" placeholder="1开头,例1-25,35,50" type="text">',
      '  <br>',
      '  批量下载: <textarea name="batch" placeholder="所有要下载的URL地址" style="line-height:1;resize:both;"></textarea>',
      '</div>',

      '<div name="buttons">',
      '  <input type="button" name="download" format="debug" value="测试">',
      '  <input type="button" name="download" format="text" value="下载为TEXT">',
      '  <br>',
      '  <input type="button" name="download" format="epub" value="下载为EPUB">',
      '  <input type="button" name="download" format="zip" value="下载为ZIP">',
      '  <br>',
      '  <input type="button" name="toggle-opacity" value="透明">',
      '  <input type="button" name="exit" value="退出">',
      '  <input type="button" name="force-download" value="强制下载" raw-disabled="disabled">',
      '  <input type="button" name="force-save" value="强制保存" raw-disabled="disabled">',
      '</div>',

      '<div name="progress">',
      '  <span title="章节完成进度\n当右下角显示【下载完成】，如果该进度条未走完，可以尝试再次点击，脚本会自行重试之前失败的章节\n（仅对网络问题造成的失败有效，如果是脚本的问题，请反馈或自行解决）">进度</span>: ',
      '  <progress max="0" value="0"></progress>',
      '</div>',
    ].join('');
    const container = $('<div class="novel-downloader-v3"></div>').html(html).appendTo('body');
    container.find('input,select,textarea').attr('disabled', 'disabled');
    container.find('[name="config"]').find('input,select,textarea').on('change', function (e) {
      const { name } = e.target;
      let value = e.target.type === 'checkbox' ? e.target.checked : e.target.type === 'number' ? (e.target.value || this.placeholder) * 1 : (e.target.value || e.target.placeholder);
      if (e.target.type === 'checkbox' && value && e.target.getAttribute('confirm')) {
        value = window.confirm(e.target.getAttribute('confirm'));
        e.target.checked = value;
      }
      Config[name] = value;
      GM_setValue('config', Config);
      if (['retry', 'thread', 'timeout'].includes(name)) {
        xhr.storage.config.set(name, value);
      }
      if (Storage.rule._common) {
        if (['iframe'].includes(name)) Storage.rule[name] = value;
        else if (['chapterTitle', 'content', 'elementRemove'].includes(name)) Storage.rule[name] = value || Rule[name];
      }
    }).each(function (i, e) {
      if (Config[e.name] === undefined) return;
      if (e.type === 'checkbox') {
        e.checked = Config[e.name];
      } else if (e.type === 'radio') {
        e.checked = (Config[e.name] === this.value);
      } else {
        e.value = Config[e.name];
      }
    });
    container.find('[name="buttons"]').find('[name="download"]').on('click', async (e) => {
      container.find('[name="progress"]').show();
      container.find('[name="buttons"]').find('[name="download"]').attr('disabled', 'disabled');
      container.find('[name="buttons"]').find('[name="force-download"]').attr('disabled', null);
      if (!Storage.audio) {
        // 来自 E-Hentai-Downloader
        Storage.audio = new window.Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU3LjcxLjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAABVgANTU1NTU1Q0NDQ0NDUFBQUFBQXl5eXl5ea2tra2tra3l5eXl5eYaGhoaGhpSUlJSUlKGhoaGhoaGvr6+vr6+8vLy8vLzKysrKysrX19fX19fX5eXl5eXl8vLy8vLy////////AAAAAExhdmM1Ny44OQAAAAAAAAAAAAAAACQCgAAAAAAAAAVY82AhbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAALACwAAP/AADwQKVE9YWDGPkQWpT66yk4+zIiYPoTUaT3tnU487uNhOvEmQDaCm1Yz1c6DPjbs6zdZVBk0pdGpMzxF/+MYxA8L0DU0AP+0ANkwmYaAMkOKDDjmYoMtwNMyDxMzDHE/MEsLow9AtDnBlQgDhTx+Eye0GgMHoCyDC8gUswJcMVMABBGj/+MYxBoK4DVpQP8iAtVmDk7LPgi8wvDzI4/MWAwK1T7rxOQwtsItMMQBazAowc4wZMC5MF4AeQAGDpruNuMEzyfjLBJhACU+/+MYxCkJ4DVcAP8MAO9J9THVg6oxRMGNMIqCCTAEwzwwBkINOPAs/iwjgBnMepYyId0PhWo+80PXMVsBFzD/AiwwfcKGMEJB/+MYxDwKKDVkAP8eAF8wMwIxMlpU/OaDPLpNKkEw4dRoBh6qP2FC8jCJQFcweQIPMHOBtTBoAVcwOoCNMYDI0u0Dd8ANTIsy/+MYxE4KUDVsAP8eAFBVpgVVPjdGeTEWQr0wdcDtMCeBgDBkgRgwFYB7Pv/zqx0yQQMCCgKNgonHKj6RRVkxM0GwML0AhDAN/+MYxF8KCDVwAP8MAIHZMDDA3DArAQo3K+TF5WOBDQw0lgcKQUJxhT5sxRcwQQI+EIPWMA7AVBoTABgTgzfBN+ajn3c0lZMe/+MYxHEJyDV0AP7MAA4eEwsqP/PDmzC/gNcwXUGaMBVBIwMEsmB6gaxhVuGkpoqMZMQjooTBwM0+S8FTMC0BcjBTgPwwOQDm/+MYxIQKKDV4AP8WADAzAKQwI4CGPhWOEwCFAiBAYQnQMT+uwXUeGzjBWQVkwTcENMBzA2zAGgFEJfSPkPSZzPXgqFy2h0xB/+MYxJYJCDV8AP7WAE0+7kK7MQrATDAvQRIwOADKMBuA9TAYQNM3AiOSPjGxowgHMKFGcBNMQU1FMy45OS41VVU/31eYM4sK/+MYxKwJaDV8AP7SAI4y1Yq0MmOIADGwBZwwlgIJMztCM0qU5TQPG/MSkn8yEROzCdAxECVMQU1FMy45OS41VTe7Ohk+Pqcx/+MYxMEJMDWAAP6MADVLDFUx+4J6Mq7NsjN2zXo8V5fjVJCXNOhwM0vTCDAxFpMYYQU+RlVMQU1FMy45OS41VVVVVVVVVVVV/+MYxNcJADWAAP7EAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxOsJwDWEAP7SAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxPMLoDV8AP+eAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxPQL0DVcAP+0AFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
        Storage.audio.loop = true;
      }
      $(window).off('blur').off('focus').on({
        blur: () => Storage.audio.play(),
        focus: () => Storage.audio.pause(),
      });
      Storage.title = document.title;

      Storage.book.chapters = Config.vip ? chapters : chapters.filter((i) => !(vipChapters.includes(i.url)));

      // 限制下载范围
      if (container.find('[name="limit"]>[name="range"]').val()) {
        const arr = container.find('[name="limit"]>[name="range"]').val().split(',').sort();
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].match(/^(\d+)?-(\d+)?$/)) {
            let start = arr[i].match(/^(\d+)?-(\d+)?$/)[1];
            if (!start) start = 1;
            let end = arr[i].match(/^(\d+)?-(\d+)?$/)[2];
            if (!end) end = Storage.book.chapters.length;
            for (let j = start - 1; j <= end - 1; j++) {
              if (j in Storage.book.chapters) Storage.book.chapters[j].filtered = true;
            }
          } else if (/^\d+$/.test(arr[i])) {
            if ((arr[i] - 1) in Storage.book.chapters) Storage.book.chapters[arr[i] - 1].filtered = true;
          }
        }
        Storage.book.chapters = Storage.book.chapters.filter((i) => {
          if (i.filtered) {
            delete i.filtered;
            return true;
          }
        });
      }
      if (container.find('[name="limit"]>[name="batch"]').val()) {
        Storage.book.chapters = container.find('[name="limit"]>[name="batch"]').val().split(/\r*\n/).filter((i) => i)
          .map((i) => {
            const url = new URL(i, window.location.href).href;
            return chaptersDownloaded.find((i) => i.url === url) || { url };
          });
      }
      chaptersArr = Storage.book.chapters.map((i) => i.url);

      const format = $(e.target).attr('format');
      const onComplete = async (force) => {
        if (!force) {
          container.find('[name="buttons"]').find('[name="force-save"]').attr('disabled', 'disabled').off('click');
          container.find('[name="buttons"]').find('[name="force-download"]').attr('disabled', 'disabled');
        }

        let { chapters } = Storage.book;
        if (Config.sort && chapters.length) {
          const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'case' });
          for (const chapter of chapters) chapter.sort = chapter.url;
          // const dir = new URL('./', chapters[0].sort).href;
          // if (chapters.every(i => new URL('./', i.sort).href === dir)) {
          //   chapters.forEach(i => { i.sort = i.sort.substr(dir.length); });
          // }
          let ext = chapters[0].sort.split('.');
          if (ext.length > 1) {
            ext = `.${ext.slice(-1)}`;
            const extReversed = ext.split('').reverse().join('');
            if (chapters.every((i) => i.sort.split('').reverse().join('').indexOf(extReversed) === 0)) {
              for (const chapter of chapters) chapter.sort = chapter.sort.substr(0, chapter.sort.length - ext.length);
            }
          }
          chapters = chapters.sort((a, b) => collator.compare(a.sort, b.sort));
        }

        const volumes = [];
        for (let i = 0; i < chapters.length; i++) {
          const chapter = chapters[i];

          if (Config.volume) {
            // if (i > 0 && chapters[i - 1].volume !== chapter.volume) {
            //   const title = `【${chapters[i - 1].volume}】-分卷-结束`;
            //   chapters.splice(i, 0, {
            //     title,
            //     contentRaw: title,
            //     content: title,
            //     volume: chapters[i - 1].volume
            //   });
            //   i++;
            // }

            if (chapter.volume && chapter.volume !== volumes.slice(-1)[0]) {
              volumes.push(chapter.volume);
              const title = `【${chapter.volume}】`;
              chapters.splice(i, 0, {
                title,
                contentRaw: title,
                content: title,
                volume: chapter.volume,
              });
              i++;
            }
          }

          const rule = vipChapters.includes(chapter.url) ? Storage.rule.vip : Storage.rule;
          let content = chapter.contentRaw;
          if (!content) continue;

          if (Config.format) {
            content = html2Text(content, rule.contentReplace);
            if (['text', 'zip'].includes(format)) content = $('<div>').html(content).text();
            content = content.replace(/^\s+/mg, '').trim(); // 移除开头空白字符
            if (Config.removeEmptyLine === 'auto') {
              const arr = content.split(/\n{2,}/);
              let keep = false;
              for (const i of arr) {
                if (i.match(/\n/)) {
                  keep = true;
                  break;
                }
              }
              content = keep ? content.replace(/\n{3,}/g, '\n\n') : content.replace(/\n+/g, '\n');
            } else if (Config.removeEmptyLine === 'remove') {
              content = content.replace(/\n+/g, '\n');
            } else if (Config.removeEmptyLine === 'keep') {
              content = content.replace(/\n{3,}/g, '\n\n');
            }
            // https://stackoverflow.com/a/25956935
            content = content.replace(/^/gm, '\u3000\u3000'); // 每行增加空白字符作缩进
          }
          if (Config.language) content = tranStr(content, Config.language === 'tc');
          chapter.content = content;

          if (!chapter.title) continue;
          chapter.title = chapter.title.replace(/\s+/g, ' ').trim();
        }

        await downloadTo[format](chapters);
        if (!force) {
          container.find('[name="buttons"]').find('[name="download"]').attr('disabled', null);
          $(window).off('blur').off('focus');
          Storage.audio.pause();
          document.title = Storage.title;
        }
      };
      container.find('[name="buttons"]').find('[name="force-save"]').attr('disabled', null).on('click', async () => {
        await onComplete(true);
      });
      const onChapterFailed = async (res, request) => {
        let chapter = request.raw;
        if ('chapter' in chapter) chapter = chapter.chapter;
        chapter.contentRaw = '';
        chapter.content = '';
        chapter.document = '';
      };
      let failedCount = 0;
      const onChapterFailedEvery = Config.failedCount ? async (res, request, type) => {
        if (type === 'abort' || failedCount < 0) return;
        failedCount = failedCount + 1;
        if (failedCount > Config.failedCount) {
          failedCount = -1;
          xhr.pause();
          if (Config.failedWait > 0) {
            await waitInMs(30 * 1000);
            failedCount = 0;
            xhr.resume();
          } else {
            failedCount = 0;
          }
        }
      } : null;
      let overrideMimeType = `text/html; charset=${document.characterSet}`;
      if (Storage.rule.charset) overrideMimeType = `text/html; charset=${Storage.rule.charset}`;
      const checkRelativeChapter = async (res, request, next) => {
        const chapter = request.raw;
        const rule = vipChapters.includes(chapter.url) ? Storage.rule.vip : Storage.rule;

        let ruleChapterRelative;
        if (next) {
          ruleChapterRelative = Config.useCommon ? (rule.chapterNext || Rule.chapterNext) : rule.chapterNext;
        } else {
          ruleChapterRelative = Config.useCommon ? (rule.chapterPrev || Rule.chapterPrev) : rule.chapterPrev;
        }

        let chapterRelative = await getFromRule(ruleChapterRelative, { attr: 'href', allElement: true, document: new window.DOMParser().parseFromString(res.responseText, 'text/html') }, [res, request], []);
        chapterRelative = [].concat(chapterRelative).map((i) => new URL(i, res.finalUrl || window.location.href).href)
          .filter((url) => url && !url.match(/^(javascript:|#)/)).map((i) => new URL(i, chapter.url).href)
          .filter((url) => {
            if (!rule._common && rule.ignoreUrl.some((i) => url.match(i))) return false;
            if (!rule._common && rule.url.some((i) => url.match(i))) return false;
            if (!rule._common && rule.chapterUrl.length) return rule.chapterUrl.some((i) => url.match(i));
            const pathurl = chapter.url.replace(/(.*\/).*/, '$1').replace(/.*?:\/\/(.*)/, '$1');
            const pathurlThis = url.replace(/(.*\/).*/, '$1');
            return pathurlThis !== url && pathurlThis.replace(/.*?:\/\/(.*)/, '$1') === pathurl;
          });
        let anchor = chapter;
        for (const url of chapterRelative) {
          if (chaptersArr.includes(url) || vipChapters.includes(url)) continue;
          const chapterNew = chaptersDownloaded.find((i) => i.url === url) || { url };
          if (chapter.volume) chapterNew.volume = chapter.volume;
          const index = Storage.book.chapters.indexOf(anchor);
          anchor = chapterNew;
          Storage.book.chapters.splice(next ? index + 1 : index, 0, chapterNew);
          chaptersArr.splice(next ? index + 1 : index, 0, url);

          const rule = vipChapters.includes(url) ? Storage.rule.vip : Storage.rule;

          if (chapterNew.contentRaw && chapterNew.document) {
            await onChapterLoad({ response: chapterNew.document, responseText: chapterNew.document }, { raw: chapterNew });
          } else {
            delete chapterNew.contentRaw;
            if (rule.iframe) {
              chapterList.iframe.push(chapterNew);
            } else if (rule.popup) {
              chapterList.popup.push(chapterNew);
            } else if (rule.deal && typeof rule.deal === 'function') {
              chapterList.deal.push(chapterNew);
            } else {
              chapterList.download.push(chapterNew);
            }
          }
        }
      };
      const onChapterLoad = async (res, request) => {
        const chapter = request.raw;
        const rule = vipChapters.includes(chapter.url) ? Storage.rule.vip : Storage.rule;

        if (failedCount > 0) failedCount = 0;
        if (rule.deal) return;

        const doc = typeof res.response === 'object' ? res.response : new window.DOMParser().parseFromString(res.responseText, 'text/html');

        if (!chaptersDownloaded.includes(chapter)) chaptersDownloaded.push(chapter);

        if ('elementRemove' in rule) {
          if (rule.elementRemove) $(`${rule.elementRemove},script,style,iframe`, doc).remove();
        } else if (Config.useCommon) {
          $(`${Rule.elementRemove},script,style,iframe`, doc).remove();
        }

        let chapterTitle = await getFromRule(rule.chapterTitle, { attr: 'text', document: doc }, [res, request], '');
        if (chapterTitle === Storage.book.title) chapterTitle = '';
        chapterTitle = chapterTitle || chapter.title || $('title', doc).eq(0).text();
        if (chapterTitle.indexOf(Storage.book.title) === 0) chapterTitle = chapterTitle.replace(Storage.book.title, '').trim();
        chapter.title = chapterTitle;
        request.title = chapter.title;

        let contentCheck = true;
        if (rule.contentCheck) contentCheck = await getFromRule(rule.contentCheck, (selector) => $(selector, doc).length, [res, request], true);
        if (contentCheck) {
          if (Storage.debug.content) debugger;
          let content = chapter.content || await getFromRule(rule.content, (selector) => {
            let elems = $(selector, doc);
            if (Storage.debug.content) debugger;
            if (rule._common) elems = elems.not(':emptyHuman'); // 移除空元素
            if (elems.length === 0) { // 没有找到内容
              console.error(`novelDownloader: 找不到内容元素\n选择器: ${selector}`);
              elems = $('body', doc);
            } else if (elems.length > 1) {
              // 当a是b的祖辈元素时，移除a
              elems = elems.filter((i, e) => !elems.not(e).toArray().find((j) => $(e).find(j).length));
            }
            return elems.toArray().map((i) => $(i).html());
          }, [res, request], '');
          if (content instanceof Array) content = content.join('\n');
          chapter.content = content;
          chapter.contentRaw = content;
          chapter.document = res.responseText;

          if (Config.addChapterPrev || Config.addChapterNext) {
            if (Config.addChapterPrev) await checkRelativeChapter(res, request, false);
            if (Config.addChapterNext) await checkRelativeChapter(res, request, true);
          }
        } else {
          chapter.contentRaw = '';
        }

        const now = Storage.book.chapters.filter((i) => i.contentRaw).length;
        const max = Storage.book.chapters.length;
        container.find('[name="progress"]>progress').val(now).attr('max', max);
        document.title = `[${now}/${max}]${Storage.title}`;
      };
      const requestOption = { onload: onChapterLoad, overrideMimeType };

      const chapterList = {
        iframe: [],
        popup: [],
        deal: [],
        download: [],
      };
      for (const chapter of Storage.book.chapters) {
        const rule = vipChapters.includes(chapter.url) ? Storage.rule.vip : Storage.rule;
        if (chapter.contentRaw && chapter.document) {
          await onChapterLoad({ response: chapter.document, responseText: chapter.document }, { raw: chapter });
        } else {
          delete chapter.contentRaw;
          if (rule.iframe) {
            chapterList.iframe.push(chapter);
          } else if (rule.popup) {
            chapterList.popup.push(chapter);
          } else if (rule.deal && typeof rule.deal === 'function') {
            chapterList.deal.push(chapter);
          } else {
            chapterList.download.push(chapter);
          }
        }
      }
      if (Storage.book.chapters.every((i) => i.contentRaw && i.document)) {
        await onComplete();
        return;
      }

      if (chapterList.download.length || chapterList.deal.length) {
        xhr.init({
          retry: Config.retry,
          thread: Storage.rule.thread && Storage.rule.thread < Config.thread ? Storage.rule.thread : Config.thread,
          timeout: Config.timeout,
          onfailed: onChapterFailed,
          onfailedEvery: onChapterFailedEvery,
          checkLoad: async (res) => {
            if ((res.status > 0 && res.status < 200) || res.status >= 300) { // TODO
              return false;
            }
            return true;
          },
        });
      }

      while (Storage.book.chapters.some((i) => !('contentRaw' in i))) {
        if (chapterList.download.length && chapterList.download.find((i) => !('contentRaw' in i))) {
          await new Promise((resolve, reject) => {
            xhr.storage.config.set('onComplete', async (list) => {
              resolve();
            });
            xhr.list(chapterList.download.filter((i) => !('contentRaw' in i)), requestOption);
            xhr.showDialog();
            xhr.start();
          });
        }

        if (chapterList.deal.length && chapterList.deal.find((i) => !('contentRaw' in i))) {
          await new Promise((resolve, reject) => {
            xhr.storage.config.set('onComplete', async (list) => {
              if (chapterList.deal.find((i) => !('contentRaw' in i))) return;
              resolve();
            });
            for (const chapter of chapterList.deal.filter((i) => !('contentRaw' in i))) {
              try {
                const rule = vipChapters.includes(chapter.url) ? Storage.rule.vip : Storage.rule;
                rule.deal(chapter).then((result) => {
                  if (result) {
                    if (typeof result === 'string') {
                      chapter.document = result;
                      chapter.contentRaw = result;
                    } else {
                      chapter.document = result.contentRaw || result.content;
                      chapter.contentRaw = result.content;
                      for (const i in result) chapter[i] = result[i];
                    }
                  } else {
                    chapter.contentRaw = '';
                    chapter.content = '';
                    chapter.document = '';
                  }
                  const now = Storage.book.chapters.filter((i) => i.contentRaw).length;
                  const max = Storage.book.chapters.length;
                  container.find('[name="progress"]>progress').val(now).attr('max', max);
                  document.title = `[${now}/${max}]${Storage.title}`;
                  if (!chapterList.deal.find((i) => !('contentRaw' in i))) resolve();
                }, (error) => {
                  console.error(error);
                  chapter.contentRaw = '';
                  chapter.content = '';
                  chapter.document = '';
                });
              } catch (error) {
                console.error(error);
              }
            }
            xhr.showDialog();
            xhr.start();
          });
        }

        if (chapterList.iframe.length && chapterList.iframe.find((i) => !('contentRaw' in i))) {
          for (const chapter of chapterList.iframe.filter((i) => !('contentRaw' in i))) {
            const rule = vipChapters.includes(chapter.url) ? Storage.rule.vip : Storage.rule;
            await new Promise((resolve, reject) => {
              $('<iframe>').on('load', async (e) => { // TODO 优化
                let response, responseText, loadFailed;
                try {
                  e.target.contentWindow.document;
                } catch (error) {
                  if (error.message.match(/Blocked a frame with origin ".*" from accessing a cross-origin frame/)) loadFailed = true;
                }
                try {
                  if (
                    loadFailed
                    || e.target.contentWindow.performance.getEntriesByType('navigation')[0].responseStatus !== 200
                    || $('#challenge-error-text', e.target.contentWindow.document).length
                    || Config.iframeDetect.split('\n').some((i) => e.target.contentWindow.document.documentElement.outerHTML.includes(i))
                  ) {
                    $(e.target).attr('style', 'visibility:visible;position:fixed;top:0px;left:0px;width:50vw;height:100vh;z-index:999999;background:white');
                    const tobreak = await new Promise((resolve1) => {
                      window.navigation.addEventListener('navigate', () => {
                        resolve1(true);
                      });
                      if (!loadFailed) $('<button style="position:fixed;top:0px;z-index:999999;">页面已正常加载</button>').on('click', () => { resolve1(); }).appendTo(e.target.contentWindow.document.body);
                    });
                    if (tobreak) return;
                  }
                  if (typeof rule.iframe === 'function') await rule.iframe(e.target.contentWindow);
                  response = e.target.contentWindow.document;
                  responseText = e.target.contentWindow.document.documentElement.outerHTML;
                } catch (error) {
                  console.error(error);
                  response = '';
                  responseText = '';
                }
                await onChapterLoad({ response, responseText }, { raw: chapter });
                $(e.target).remove();
                resolve();
              }).attr('src', chapter.url).css('visibility', 'hidden')
                .appendTo('body');
            });
          }
        }

        if (chapterList.popup.length && chapterList.popup.find((i) => !('contentRaw' in i))) {
          GM_setValue('vip-chapter', vipChapters);
          GM_setValue('popup-list', Object.fromEntries(chapterList.popup.filter((i) => !('contentRaw' in i)).map((i) => [i.url, null])));
          let completed = [];
          GM_addValueChangeListener('popup-list', async (name, objOld, obj, remote) => {
            completed = Object.entries(obj).filter((i) => i[1] !== null).map((i) => i[0]);
          });
          await async.mapLimit(chapterList.popup.filter((i) => !('contentRaw' in i)), Storage.rule.thread && Storage.rule.thread < Config.thread ? Storage.rule.thread : Config.thread, async (chapter, callback) => {
            const popupWindow = window.open(chapter.url, '', 'resizable,scrollbars,width=300,height=350');
            await waitFor(() => completed.includes(chapter.url) || !popupWindow || popupWindow.closed, 30 * 1000);
            const html = completed.includes(chapter.url) ? GM_getValue('popup-list', {})[chapter.url] : '';
            const doc = html;
            await onChapterLoad({ response: doc, responseText: html }, { raw: chapter });
            popupWindow.close();
          });
          GM_deleteValue('vip-chapter');
          GM_deleteValue('popup-list');
        }
      }

      await onComplete();
    });
    container.find('[name="buttons"]').find('[type="button"]:not([name="download"])').on('click', async (e) => {
      const name = $(e.target).attr('name');
      if (name === 'exit') {
        $('.novel-downloader-style,.novel-downloader-style-chapter,.novel-downloader-v3').remove();
        $('[novel-downloader-chapter]').attr('order', null).attr('novel-downloader-chapter', null);
      } else if (name === 'force-download') {
        xhr.start();
      } else if (name === 'toggle-opacity') {
        container.toggleClass('opacity01');
      }
    });
    container.find('[name="config"]').find('button[name="toggle"]').on('click', (e) => {
      container.find('.useless[name="config"]').toggle();
    });
    container.find('[name="info"]>input[type="text"],[name="info"]>textarea').on('change', (e) => {
      Storage.book[$(e.target).attr('name')] = e.target.value;
    });
    container.find('[name="how"]').on('click', (e) => {
      const a = window.open('about:blank', '_blank');
      a.document.write(`<img src="${gif}" />`);
    });

    // style
    const style = [
      '.novel-downloader-v3>div *,.novel-downloader-v3>div *:before,.novel-downloader-v3>div *:after{margin:1px;}',
      '.novel-downloader-v3 input{border:1px solid #000;opacity: 1;}',
      '.novel-downloader-v3 input[type="checkbox"]{position:relative;top:0;opacity:1;appearance:checkbox;}',
      '.novel-downloader-v3 input[type="button"],.novel-downloader-v3 button{border:1px solid #000;cursor:pointer;padding:2px 3px;}',
      '.novel-downloader-v3 input[type=number]{width:36px;}',
      '.novel-downloader-v3 input[type=number]{width:36px;}',
      '.novel-downloader-v3 input:not([disabled="disabled"]),.novel-downloader-v3 button:not([disabled="disabled"]){color:#000;background-color:#fff;}',
      '.novel-downloader-v3 input[disabled="disabled"],.novel-downloader-v3 button[disabled="disabled"]{color:#fff;cursor:default!important;background-color:#545454;text-decoration:line-through double;}',
      '.novel-downloader-v3 span[title]::after{content:"(?)";text-decoration:underline;font-size:x-small;vertical-align:super;cursor:pointer;}',

      '.novel-downloader-v3{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:99999;background:white;border:1px solid black;max-height:99vh;overflow:auto;text-align:center;}',
      '.novel-downloader-v3.opacity01{opacity:0.1;}',
      '.novel-downloader-v3.opacity01:hover{opacity:0.6;}',
      '.novel-downloader-v3>div{margin:2px 0px;}',
      '.novel-downloader-v3>div:nth-child(2n){background-color:#DADADA;}',
      '.novel-downloader-v3>div:nth-child(2n+1){background-color:#FAFAFA;}',

      '.novel-downloader-v3>.useless[name="config"]{display:none;}',
      '.novel-downloader-v3>[name="config"] [name="vip"]:checked+span{color:red;}',

      '.novel-downloader-v3>[name="progress"]{display:none;}',
      '.novel-downloader-v3>[name="progress"]>progress::before{content:attr(value)" / "attr(max);}',

      '[novel-downloader-chapter]:before{content:attr(order)"-"!important;}',
      '[novel-downloader-chapter]:before{color:blue!important;}',
      '[novel-downloader-chapter="vip"]:before{color:red!important;}',
    ].join('');
    $('<style class="novel-downloader-style">').text(style).appendTo('head');

    // rule
    container.find('[name="info"]>[name="rule"]').html(`<a href="${window.location.origin}" target="_blank">${Storage.rule.siteName}</a>`);

    let infoPage = await getFromRule(Storage.rule.infoPage, { attr: 'href' }, [], null);
    if (infoPage === window.location.href) {
      infoPage = null;
    } else if (infoPage) {
      infoPage = new URL(infoPage, window.location.href).href;
      const res = await xhr.sync(infoPage, null, { cache: true });
      try {
        infoPage = new window.DOMParser().parseFromString(res.responseText, 'text/html');
      } catch (error) {
        console.error(error);
        infoPage = null;
      }
    }

    // rule-title

    let title = await getFromRule(Storage.rule.title, { document: infoPage || document }, [], '');
    if (!title && Storage.rule.titleRegExp instanceof RegExp) title = document.title.match(Storage.rule.titleRegExp) ? document.title.match(Storage.rule.titleRegExp)[1] : document.title;
    if (Storage.rule.titleReplace) title = replaceWithDict(title, Storage.rule.titleReplace);
    title = title.replace(/\s+/g, ' ').replace(/^《(.*)》$/, '$1').trim();
    Storage.book.title = title;

    // rule-writer

    let writer = await getFromRule(Storage.rule.writer, { document: infoPage || document }, [], '');
    writer = writer.replace(/\s+/g, ' ').replace(/.*作\s*者(:|：)|\s+著$/g, '').trim();
    Storage.book.writer = writer;

    // rule-intro,cover

    let intro = await getFromRule(Storage.rule.intro, { attr: 'html', document: infoPage || document }, [], '');
    intro = html2Text(intro, Storage.rule.contentReplace);
    intro = $('<div>').html(intro);
    intro = intro.text();
    Storage.book.intro = intro;
    Storage.book.cover = await getFromRule(Storage.rule.cover, { attr: 'src', document: infoPage || document }, [], '');
    for (const i of ['title', 'writer', 'intro', 'cover']) {
      container.find(`[name="info"]>[name="${i}"]`).val(Storage.book[i] || '');
    }

    if (Storage.mode === 1) {
      container.find('[name="info"]>[name="mode"]').text('目录模式');
      const styleChapter = [
        '[novel-downloader-chapter]:before{display:none;}',
      ].join('');
      $('<style class="novel-downloader-style-chapter">').text(styleChapter).attr('media', 'max-width: 1px').appendTo('head');

      // rule-chapter

      chapters = await getFromRule(Storage.rule.chapter, async (selector) => {
        let elems = $(Storage.rule.chapter);
        if (!Storage.rule._common && Storage.rule.chapterUrl.length) elems = elems.filter((i, elem) => Storage.rule.chapterUrl.some((j) => elem.href.match(j)));
        let volumes;
        if (typeof Storage.rule.volume === 'string') {
          volumes = $(Storage.rule.volume);
        } else if (typeof Storage.rule.volume === 'function' && Storage.rule.volume.length <= 1) {
          volumes = await Storage.rule.volume(document);
        }
        volumes = $(volumes).toArray();
        const all = $(elems).add(volumes);
        let order = 1;
        return elems.attr('novel-downloader-chapter', '').toArray().map((i) => {
          $(i).attr('order', order++);
          const chapter = {
            title: i.textContent,
            url: i.href,
          };
          if (volumes && volumes.length) {
            const volume = all.slice(0, all.index(i)).toArray().reverse().find((i) => volumes.includes(i));
            if (volume) chapter.volume = html2Text(volume.textContent);
          }
          return chapter;
        });
      }, [], []);
      vipChapters = await getFromRule(Storage.rule.vipChapter, (selector) => $(Storage.rule.vipChapter).attr('novel-downloader-chapter', 'vip').toArray().map((i) => i.href), [], []);
      if (typeof Storage.rule.volume === 'function' && Storage.rule.volume.length > 1) chapters = await Storage.rule.volume(document, chapters);
    } else if (Storage.mode === 2) {
      container.find('[name="info"]>[name="mode"]').text('章节模式');
      chapters = [window.location.href];
    }
    if (typeof Storage.rule.getChapters === 'function') chapters = await Storage.rule.getChapters(document);
    chapters = chapters.map((i) => (typeof i === 'string' ? { url: i } : i));
    vipChapters = vipChapters.concat(chapters.filter((i) => i.vip).map((i) => i.url));
    if (!Storage.rule.chapter && Storage.rule.chapterUrl.length) {
      let order = 1;
      const elems = Array.from(document.links).filter((i) => ((chapters.length || vipChapters.length)
        ? (chapters.map((i) => i.url).includes(i.href) || vipChapters.includes(i.href))
        : Storage.rule.chapterUrl.some((j) => i.href.match(j))));
      const temp = $(elems).toArray().map((i) => {
        $(i).attr('novel-downloader-chapter', vipChapters.includes(i.href) ? 'vip' : '').attr('order', order++);
        return {
          title: i.textContent,
          url: i.href,
        };
      });
      if (!chapters.length) chapters = temp;
    }

    container.find('input,select,textarea').attr('disabled', null);
    container.find('input,select,textarea').filter('[raw-disabled="disabled"]').attr('raw-disabled', null).attr('disabled', 'disabled');

    if (Storage.debug.book) console.log(Storage.book);
  }

  $('<div class="novel-downloader-trigger" style="position:fixed;top:0px;left:0px;width:1px;height:100%;z-index:999999;background:transparent;"></div>').on({
    dblclick() {
      init();
      showUI();
    },
  }).appendTo('body');
  GM_registerMenuCommand('Download Novel', () => {
    init();
    showUI();
  }, 'N');
  GM_registerMenuCommand('Show Storage', () => {
    console.log({ Storage, xhr: xhr.storage.getSelf() });
  }, 'S');

  const downloadTo = {
    debug: async (chapters) => { // TODO
      console.log(chapters);
    },
    text: async (chapters) => {
      const { length } = String(chapters.length);
      const title = Storage.book.title || Storage.book.chapters[0].title;
      const writer = Storage.book.writer || 'novelDownloader';

      let all = [
        `本书名称: ${title}`,
        Storage.book.writer ? `本书作者: ${writer}` : '',
        Storage.book.intro ? `本书简介: ${Storage.book.intro}` : '',
        Config.reference ? '阅读前说明：本书籍由用户脚本novelDownloader制作' : '',
        Config.reference ? `来源地址: ${window.location.href}` : '',
      ].filter((i) => i);
      all.push('');

      for (let i = 0; i < chapters.length; i++) {
        let { title, content } = chapters[i];
        if (Config.titleRename) {
          title = Config.titleRename.replace(/\{(.*?)\}/g, (all, group1) => {
            if (group1 === 'title') return title;
            if (group1 === 'order') return String(i + 1).padStart(length, '0');
            return all;
          });
        }
        all.push(`${title}\n${content || ''}\n`);
      }
      all = all.join('\n');
      const blob = new window.Blob([all], {
        type: 'text/plain;charset=utf-8',
      });
      download(blob, `${title}.txt`);
    },
    epub: async (chapters) => {
      const { length } = String(chapters.length);
      const title = Storage.book.title || Storage.book.chapters[0].title;
      const writer = Storage.book.writer || 'novelDownloader';
      const uuid = `ndv3-${window.location.href.match(/[a-z0-9-]+/ig).join('-')}${$('.novel-downloader-v3').find('[name="limit"]>[name="range"]').val()}`;
      const href = $('<div>').text(window.location.href).html();
      const date = new Date().toISOString();

      let cover = Storage.book.coverBlob;
      if (!Storage.book.coverBlob && Storage.book.cover) {
        try {
          const res = await xhr.sync(Storage.book.cover, null, {
            responseType: 'arraybuffer',
            timeout: Config.timeout * 10,
          });
          Storage.book.coverBlob = new window.Blob([res.response], {
            type: res.responseHeaders.match(/content-type:\s*(image.*)/i) ? res.responseHeaders.match(/content-type:\s*(image.*)/i)[1] : 'image/png',
          });
          cover = Storage.book.coverBlob;
        } catch (error) {
          console.error(error);
        }
      }
      if (!cover) cover = await getCover(title);

      const files = {
        mimetype: 'application/epub+zip',
        'META-INF/container.xml': '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml" /></rootfiles></container>',
        'OEBPS/stylesheet.css': Config.css,
        'OEBPS/cover.jpg': cover,
        'OEBPS/content.opf': [
          `<?xml version="1.0" encoding="UTF-8"?><package version="2.0" unique-identifier="${uuid}" xmlns="http://www.idpf.org/2007/opf"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">`,
          `<dc:title>${title}</dc:title>`,
          `<dc:creator>${writer}</dc:creator>`,
          '<dc:publisher>novelDownloader</dc:publisher>',
          `<dc:date>${date}</dc:date>`,
          `<dc:source>${href}</dc:source>`,
          `<dc:identifier id="${uuid}">urn:uuid:${uuid}</dc:identifier>`,
          `<dc:language>${$('html').attr('xml:lang') || $('html').attr('lang') || 'zh-CN'}</dc:language>`,
          '<meta name="cover" content="cover-image" /></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="cover" href="cover.html" media-type="application/xhtml+xml"/><item id="css" href="stylesheet.css" media-type="text/css"/>',
        ].join(''),
        'OEBPS/toc.ncx': `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="urn:uuid:${uuid}"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${title}</text></docTitle><navMap><navPoint id="navpoint-1" playOrder="1"><navLabel><text>首页</text></navLabel><content src="cover.html"/></navPoint>`,
        'OEBPS/cover.html': `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${title}</title><link type="text/css" rel="stylesheet" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body>${[
          `<h1>${title}</h1>`,
          Storage.book.writer ? `<h2>${Storage.book.writer}</h2>` : '',
          Storage.book.intro ? `<h2>简介: ${Storage.book.intro}</h2>` : '',
          Config.reference ? '<h3>阅读前说明：本书籍由用户脚本novelDownloader制作</h3>' : '',
          Config.reference ? `<h3>来源地址: <a href="${href}" target="_blank">${href}</a></h3>` : '',
        ].filter((i) => i).join('')}</body></html>`,
      };

      if (Config.image) {
        for (const chapter of Storage.book.chapters) {
          const contentDom = $('<div>').html(chapter.content);
          for (const url of $('img', contentDom).toArray().map((i) => $(i).attr('src'))) {
            if (!Storage.book.image.find((i) => i.raw === url)) {
              Storage.book.image.push({
                raw: url,
                url: new URL(url, chapter.url).href,
              });
            }
          }
        }

        if (Storage.book.image.filter((i) => !i.content).length) {
          await new Promise((resolve, reject) => {
            xhr.init({
              retry: Config.retry,
              thread: Storage.rule.thread && Storage.rule.thread < Config.thread ? Storage.rule.thread : Config.thread,
              timeout: Config.timeout * 10,
              onComplete: () => {
                resolve();
              },
              checkLoad: async (res) => {
                if ((res.status > 0 && res.status < 200) || res.status >= 300) {
                  return false;
                }
                return true;
              },
            });
            xhr.showDialog();
            xhr.list(Storage.book.image.filter((i) => !i.content), {
              responseType: 'arraybuffer',
              onload: (res, reuqest) => {
                const index = Storage.book.image.indexOf(reuqest.raw);
                Storage.book.image[index].content = res.response;
                Storage.book.image[index].type = res.responseHeaders.match(/content-type:\s*image\/(.*)/i) ? res.responseHeaders.match(/content-type:\s*image\/(.*)/i)[1] : 'image/png';
              },
            });
            xhr.start();
          });
        }

        const { length } = String(Storage.book.image.length);
        for (let i = 0; i < Storage.book.image.length; i++) {
          const imgOrder = String(i + 1).padStart(length, '0');
          const type = Storage.book.image[i].type ? Storage.book.image[i].type.split(';')[0] : 'png';
          const imgName = `img/img-${imgOrder}.${type}`;
          Storage.book.image[i].name = imgName;
          files['OEBPS/content.opf'] = `${files['OEBPS/content.opf']}<item id="img-${imgOrder}" href="${imgName}" media-type="image/jpeg"/>`;
          files[`OEBPS/${imgName}`] = Storage.book.image[i].content;
        }

        for (const chapter of Storage.book.chapters) {
          const contentDom = $('<div>').html(chapter.content);
          for (const elem of $('img', contentDom).toArray()) {
            if (Storage.book.image.find((i) => i.raw === $(elem).attr('src'))) {
              contentDom.find(elem).attr('src', Storage.book.image.find((i) => i.raw === $(elem).attr('src')).name);
            }
          }
          chapter.content = contentDom.html();
        }
      }

      let itemref = '<itemref idref="cover" linear="yes"/>';
      let volumeCurrent;
      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        const chapterName = chapter.title;
        const chapterOrder = String(i + 1).padStart(length, '0');
        const chapterContent = replaceWithDict(chapter.content.trim(), [
          [/\n/g, '</p><p>'], [/<p>\s+/g, '<p>'],
          [/&[a-z]+;/g, (match) => {
            const text = $('<a>').html(match).text();
            if (text.length > 1) return match;
            return `&#${text.charCodeAt(0)};`;
          }],
        ]);

        if (Config.tocIndent) {
          if (Config.volume && chapter.volume && chapter.volume !== volumeCurrent) {
            if (volumeCurrent) files['OEBPS/toc.ncx'] = `${files['OEBPS/toc.ncx']}</navPoint>`;
            volumeCurrent = chapter.volume;
            files['OEBPS/toc.ncx'] = `${files['OEBPS/toc.ncx']}<navPoint id="chapter${chapterOrder}" playOrder="${i + 2}"><navLabel><text>${chapterName}</text></navLabel><content src="${chapterOrder}.html"/>`;
          } else {
            files['OEBPS/toc.ncx'] = `${files['OEBPS/toc.ncx']}<navPoint id="chapter${chapterOrder}" playOrder="${i + 2}"><navLabel><text>${chapterName}</text></navLabel><content src="${chapterOrder}.html"/></navPoint>`;
          }
          if (Config.volume && chapter.volume && i === chapters.length - 1) files['OEBPS/toc.ncx'] = `${files['OEBPS/toc.ncx']}</navPoint>`;
        } else {
          files['OEBPS/toc.ncx'] = `${files['OEBPS/toc.ncx']}<navPoint id="chapter${chapterOrder}" playOrder="${i + 2}"><navLabel><text>${chapterName}</text></navLabel><content src="${chapterOrder}.html"/></navPoint>`;
        }

        files['OEBPS/content.opf'] = `${files['OEBPS/content.opf']}<item id="chapter${chapterOrder}" href="${chapterOrder}.html" media-type="application/xhtml+xml"/>`;
        itemref = `${itemref}<itemref idref="chapter${chapterOrder}" linear="yes"/>`;
        files[`OEBPS/${chapterOrder}.html`] = `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>${chapterName}</title><link type="text/css" rel="stylesheet" media="all" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h3>${chapterName}</h3>` + `<div><p>${chapterContent}</p></div></body></html>`;
      }
      files['OEBPS/content.opf'] = `${files['OEBPS/content.opf']}<item id="cover-image" href="cover.jpg" media-type="image/jpeg"/></manifest><spine toc="ncx">${itemref}</spine><guide><reference href="cover.html" type="cover" title="Cover"/></guide></package>`;
      files['OEBPS/toc.ncx'] = `${files['OEBPS/toc.ncx']}</navMap></ncx>`;

      const zip = new JSZip();
      for (const file in files) {
        zip.file(file, files[file]);
      }
      const file = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      });
      download(file, `${title}.epub`);
    },
    zip: async (chapters) => {
      const { length } = String(chapters.length);
      const title = Storage.book.title || Storage.book.chapters[0].title;

      const files = {};
      files[`${String(0).padStart(length, '0')}-说明文件.txt`] = [
        `本书名称: ${title}`,
        Storage.book.writer ? `本书作者: ${Storage.book.writer}` : '',
        Storage.book.intro ? `本书简介: ${Storage.book.intro}` : '',
        Config.reference ? '阅读前说明：本书籍由用户脚本novelDownloader制作' : '',
        Config.reference ? `来源地址: ${window.location.href}` : '',
      ].filter((i) => i).join('\n');

      for (let i = 0; i < chapters.length; i++) {
        const { title, content } = chapters[i];
        files[`${String(i + 1).padStart(length, '0')}-${title.replace(/[\\/:*?"<>|]/g, '-')}.txt`] = content;
      }

      const zip = new JSZip();
      for (const file in files) {
        zip.file(file, files[file]);
      }
      const file = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      });
      download(file, `${title}.zip`);
    },
  };

  /** @name getFromRule
    * @param {string | function} value
    * @param {object | function} argsString 当为function时，参数为value
    * @param {array} argsFunction
  */
  async function getFromRule(value, argsString = {}, argsFunction = [], defaultValue) {
    argsFunction = [].concat(argsFunction);
    let returnValue;

    if (typeof argsString !== 'function') {
      argsString = {
        attr: 'text',
        document,
        allElement: false,
        ...argsString,
      };
    }
    if (typeof argsString.document === 'string') {
      try {
        argsString.document = new window.DOMParser().parseFromString(argsString.document, 'text/html');
      } catch (error) {
        console.error(error);
      }
    }

    if (typeof value === 'string' && typeof argsString !== 'function') {
      const args = argsString;
      argsString = () => {
        const elem = $(value, args.document || document);
        if (args.allElement) {
          return elem.toArray().map((i) => (args.attr === 'html' ? $(i).html() : args.attr === 'text' ? $(i).text() : $(i).attr(args.attr) || $(i).prop(args.attr)));
        }
        return args.attr === 'html' ? elem.eq(0).html() : args.attr === 'text' ? elem.eq(0).text() : elem.eq(0).attr(args.attr) || elem.eq(0).prop(args.attr);
      };
    }
    if (typeof value === 'string') {
      returnValue = await argsString(value);
    } else if (typeof value === 'function') {
      try {
        returnValue = await value(argsString.document || document, ...argsFunction);
      } catch (error) {
        console.error(error);
      }
    }
    returnValue = returnValue !== null && returnValue !== undefined ? returnValue : defaultValue;
    return returnValue;
  }

  function html2Text(text = '', specialDict = []) { // TODO 需要优化
    const dict = (specialDict || []).concat([
      [/<\/p>(\s*)<p(\s+.*?)?>/gi, '\n'],
      [/<\/p>|<p(\s+.*?)?>/gi, '\n'],
      [/<br\s*\/?>/gi, '\n'],
      [/<(\w+)&nbsp;/g, '&lt;$1&nbsp;'],
      [/(\S)<(div)/g, '$1\n<$2'],
      [/<\/(div)>(\S)/g, '</$1>\n$2'],
    ]).filter((i) => typeof i === 'object' && i instanceof Array && i.length).map((i) => {
      const arr = i;
      if (typeof arr[0] === 'string') arr[0] = new RegExp(arr[0], 'gi');
      if (typeof arr[1] === 'undefined') arr[1] = '';
      return arr;
    });
    return replaceWithDict(text, dict).trim();
  }
  function replaceWithDict(text = '', dict = []) {
    let replace = dict.find((i) => text.match(i[0]));
    let replaceLast = null;
    let textLast = null;
    while (replace) {
      if (replace === replaceLast && textLast === text) {
        console.error(`novelDownloader: 替换文本陷入死循环\n替换规则: ${replace}`);
        dict.splice(dict.indexOf(replace), 1);
      }
      textLast = text;
      text = text.replace(replace[0], replace[1] || '');
      replaceLast = replace;
      replace = dict.find((i) => text.match(i[0]));
    }
    return text;
  }
  function getCover(txt) {
    const fontSize = 20;
    const width = 180;
    const height = 240;
    const color = '#000';
    const lineHeight = 10;
    /// ////////
    const maxlen = width / fontSize - 2;
    const txtArray = txt.split(new RegExp(`(.{${maxlen}})`));
    let i = 1;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.strokeRect(0, 0, width, height);
    context.font = `${fontSize}px sans-serif`;
    context.textBaseline = 'top';
    let fLeft,
      fTop;
    for (let j = 0; j < txtArray.length; j++) {
      if (txtArray[j] === '') continue;
      fLeft = fontSize * ((maxlen - txtArray[j].length) / 2 + 1);
      fTop = fontSize / 4 + fontSize * i + lineHeight * i;
      context.fillText(txtArray[j], fLeft, fTop, canvas.width);
      context.fillText('\n', fLeft, fTop, canvas.width);
      i++;
    }
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      });
    });
  }
  function waitInMs(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
  function waitFor(event, timeout) {
    return new Promise((resolve, reject) => {
      const now = new Date().getTime();
      let id;
      id = setInterval(() => {
        if (new Date().getTime() - now >= timeout) {
          if (id) clearInterval(id);
          id = null;
          resolve(false);
        } else if (event()) {
          if (id) clearInterval(id);
          id = null;
          resolve(true);
        }
      }, 200);
    });
  }
  function download(content, name, force) {
    const lastDownload = Storage.lastDownload || {};
    const time = new Date().getTime();
    if (!force && time - lastDownload.time <= 5 * 1000
      && lastDownload.size === content.size && lastDownload.type === content.type
      && lastDownload.name === name) { // 5秒内重复下载
      return;
    }
    Storage.lastDownload = {
      time,
      size: content.size,
      type: content.type,
      name,
    };
    saveAs(content, name);
  }

  $.expr[':'].emptyHuman = function (elem) {
    return $(elem).children().length === 0 && (elem.textContent || elem.innerText || $(elem).text() || '').trim() === '';
  };
  $.expr[':'].hiddenHuman = function (elem) {
    return $(elem).css('display') === 'none' || $(elem).css('visibility') === 'hidden' || $(0).css('opacity') === '0';
  };
  $.expr[':'].visibleHuman = function (elem) {
    return !$(elem).is(':hiddenHuman');
  };
  $.expr[':'].nochild = function (elem) {
    return $(elem).children().length === 0;
  };
  $.expr[':'].minsize = function (elem, index, meta, stack) {
    return (elem.textContent || elem.innerText || $(elem).text() || '').trim().length >= meta[3];
  };
  $.expr[':'].maxsize = function (elem, index, meta, stack) {
    return (elem.textContent || elem.innerText || $(elem).text() || '').trim().length <= meta[3];
  };
  $.expr[':'].regexp = function (elem, index, meta, stack) {
    return !!(elem.textContent || elem.innerText || $(elem).text() || '').match(new RegExp(meta[3], 'i'));
  };
}());
