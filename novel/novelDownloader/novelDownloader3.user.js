// ==UserScript==
// @name        novelDownloader3
// @description 菜单```Download Novel```或**双击页面最左侧**来显示面板
// @version     3.4.227
// @created     2020-03-16 16:59:04
// @modified    2020/11/13 16:55:55
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js

// @require     https://greasyfork.org/scripts/398502-download/code/download.js?version=821561
// require     https://raw.githubusercontent.com/dodying/UserJs/master/lib/download.js
// require     file:///E:/Desktop/_/GitHub/UserJs/lib/download.js
// require     http://127.0.0.1:8081/download.js

// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require     https://greasyfork.org/scripts/21541-chs2cht/code/chs2cht.js?version=605976
// @require     https://greasyfork.org/scripts/32483-base64/code/base64.js?version=213081
// @require     https://cdn.jsdelivr.net/npm/opentype.js@latest/dist/opentype.min.js
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @connect     *
// @noframes
// @include     *
// ==/UserScript==
/* global unsafeWindow GM_setValue GM_getValue GM_registerMenuCommand */
/* eslint-disable no-debugger  */
/* global $ xhr saveAs tranStr base64 JSZip opentype */
; (function () { // eslint-disable-line no-extra-semi
  'use strict';

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
      content: false
    },
    mode: null, // 1=index 2=chapter
    rule: null, // 当前规则
    book: {
      image: []
    },
    xhr: xhr
  };
  const Config = Object.assign({
    thread: 5,
    retry: 3,
    timeout: 60000,
    reference: true,
    format: true,
    useCommon: true,
    modeManual: true,
    templateRule: true,
    failedCount: 5,
    failedWait: 60,
    image: true,
    addChapterNext: true,
    removeEmptyLine: 'auto',
    css: 'body {\n  line-height: 130%;\n  text-align: justify;\n  font-family: \\"Microsoft YaHei\\";\n  font-size: 22px;\n  margin: 0 auto;\n  background-color: #CCE8CF;\n  color: #000;\n}\n\nh1 {\n  text-align: center;\n  font-weight: bold;\n  font-size: 28px;\n}\n\nh2 {\n  text-align: center;\n  font-weight: bold;\n  font-size: 26px;\n}\n\nh3 {\n  text-align: center;\n  font-weight: bold;\n  font-size: 24px;\n}\n\np {\n  text-indent: 2em;\n}',
    customize: '[]'
  }, GM_getValue('config', {}));
  const Rule = {
    // 如无说明，所有可以为*选择器*都可以是async (doc)=>string
    //                              章节内async function(doc,res,request)
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

      '[id*="list"] a', '[class*="list"] a'
    ].join(','),
    // vipChapter:选择器 或 async (doc)=>url[]或{url,title}[]

    // volume:
    //  选择器/async (doc)=>elem[]；原理 $(chaptes).add(volumes);
    //  async (doc,chapters)=>chapters；尽量不要生成新的对象，而是在原有对象上增加键"volume"（方便重新下载）

    // 以下在章节页面内使用
    // ?chapterTitle:选择器 省略留空时，为chapter的textContent
    chapterTitle: '.bookname>h1,h2',

    // iframe: boolean 或 async (win)=>[]
    //   使用iframe时，只能一个一个获取（慎用）

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
      '[id*="content"]:minsize(100)', '[class*="content"]:minsize(100)'
    ].join(','),

    // ?contentCheck: 检查页面是否正确，true时保留，否则content=null
    //   选择器 存在元素则为true
    //   或 async function(doc,res,request)=>boolean

    // ?elementRemove:选择器 或 async function(contentHTML)=>contentHTML
    //   如果需要下载图片，请不要移除图片元素
    elementRemove: 'script,iframe,*:emptyHuman:not(br,p,img),:hiddenHuman,a:not(:has(img))',

    // ?contentReplace:[[find,replace]]
    //   如果有图片，请不要移除图片元素

    // ?chapterPrev,chapterNext:选择器 或 async function(doc)=>url
    chapterPrev: 'a[rel="prev"],a:regexp("[上前]一?[章页话集节卷篇]+"),#prevUrl',
    chapterNext: 'a[rel="next"],a:regexp("[下后]一?[章页话集节卷篇]+"),#nextUrl'
    // ?ignoreUrl:url[] 忽略的网站（用于过滤chapterPrev,chapterNext）

    // ?getChapters 在章节页面时使用，获取全部章节
    //   async function(doc)=>url[]或{url,title}[]

    // ?charset:utf-8||gb2312||other
    //   通常来说不用设置

    // ?thread:下载线程数 通常来说不用设置

    // ?vip:{} 对于vip页面
    //  可用key: chapterTitle,iframe,deal,content,contentCheck,elementRemove,contentReplace,chapterPrev,chapterNext
  };

  /* eslint-disable comma-dangle  */
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
        [/<img id="img_\d+" style=".*?" data-original="(.*?)" src=".*?">/g, '<img src="$1">']
      ]
    },
    { // https://www.manhuabei.com/ https://www.manhuafen.com/
      siteName: '漫画堆',
      filter: () => {
        return $('.dmzj-logo').length && $('.wrap_intro_l_comic').length && $('.wrap_intro_r').length && $('.list_con_li').length
          ? 1
          : $('.foot-detail:contains("漫画")').length && $('.dm_logo').length && $('.chapter-view').length ? 2 : 0;
      },
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
        [/<img data-src/g, '<img src']
      ]
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
        let info = res.response.match(/window\["\\x65\\x76\\x61\\x6c"\](.*?)<\/script>/)[1];
        info = window.eval(info); // eslint-disable-line no-eval
        info = info.match(/^SMH.imgData(.*?).preInit\(\);/)[1];
        info = window.eval(info); // eslint-disable-line no-eval
        const a = info.files.map((item, index, arr) => `<img src="https://us.hamreus.com${info.path}${item}?e=${info.sl.e}&m=${info.sl.m}" /><p class="img_info">(${index + 1}/${arr.length})</p>`);
        return a.join('');
      },
      contentReplace: [
        [/<img id="img_\d+" style=".*?" data-original="(.*?)" src=".*?">/g, '<img src="$1">']
      ]
    },
    // 文学
    { // http://gj.zdic.net
      siteName: '汉典古籍',
      filter: () => window.location.host === 'gj.zdic.net' ? ($('#ml_1').length ? 1 : 2) : 0,
      title: '#shuye>h1',
      intro: '#jj_2',
      chapter: '.mls>li>a',
      chapterTitle: '#snr1>h1',
      content: '#snr2',
      elementRemove: '.pagenav1',
      chapterPrev: 'a:contains("上一篇")',
      chapterNext: 'a:contains("下一篇")'
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
      content: '#content>div:visible'
      // content: function (doc, res, request) {
      //   const content = [];
      //   const box = $('#content', doc).get(0);
      //   const star = 0; // ? 可能根本没用
      //   var e = base64.decode($('meta[name="client"]', doc).attr('content')).split(/[A-Z]+%/);
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
      filter: () => window.location.href.match(/kanunu8.com\/book2/) ? ($('.book').length ? 1 : 2) : 0,
      title: '.book>h1',
      writer: '.book>h2>a',
      intro: '.description>p',
      chapter: '.book>dl>dd>a',
      volume: '.book>dl>dt',
      content: '#Article>.text',
      elementRemove: 'table,a'
    },
    { // https://www.kanunu8.com
      siteName: '努努书坊',
      filter: () => window.location.host === 'www.kanunu8.com' ? ($(['body>div:nth-child(1)>table:nth-child(10)>tbody>tr:nth-child(4)>td>table:nth-child(2)>tbody>tr>td>a', 'body>div>table>tbody>tr>td>table>tbody>tr>td>table:not(:has([class^="p"])) a'].join(',')).length ? 1 : 2) : 0,
      title: 'h1>strong>font,h2>b',
      writer: 'body > div:nth-child(1) > table:nth-child(10) > tbody > tr:nth-child(2) > td,body > div:nth-child(1) > table:nth-child(10) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr:nth-child(2) > td',
      intro: '[align="left"]>[class^="p"]',
      cover: 'img[height="160"]',
      chapter: ['body>div:nth-child(1)>table:nth-child(10)>tbody>tr:nth-child(4)>td>table:nth-child(2)>tbody>tr>td>a', 'body>div>table>tbody>tr>td>table>tbody>tr>td>table:not(:has([class^="p"])) a'].join(','),
      content: 'body > div:nth-child(1) > table:nth-child(5) > tbody > tr > td:nth-child(2) > p'
    },
    { // http://www.my2852.com
      siteName: '梦远书城',
      filter: () => window.location.href.match(/my2852?.com/) ? ($('a:contains("回目录")').length ? 2 : 1) : 0,
      titleRegExp: /(.*?)[|_]/,
      title: '.book>h1',
      writer: 'b:contains("作者")',
      intro: '.zhj,body > div:nth-child(4) > table > tbody > tr > td.td6 > div > table > tbody > tr > td:nth-child(1) > div > table > tbody > tr:nth-child(1) > td',
      cover: 'img[alt="封面"]',
      chapter: () => $('a[href]').toArray().filter(i => $(i).attr('href').match(/^\d+\.htm/)).map(i => ({ url: $(i).attr('href'), title: $(i).text().trim() })),
      content: 'td:has(br)'
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
      content: '[align="center"]+p'
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
      content: '.tt2'
    },
    // 正版
    { // https://www.qidian.com https://www.hongxiu.com https://www.readnovel.com https://www.xs8.cn
      siteName: '起点中文网',
      url: /(qidian.com|hongxiu.com|readnovel.com|xs8.cn)\/(info|book)\/\d+/,
      chapterUrl: /(qidian.com|hongxiu.com|readnovel.com|xs8.cn)\/chapter/,
      title: 'h1>em',
      writer: '.writer',
      intro: '.book-intro',
      cover: '.J-getJumpUrl>img',
      chapter: '.volume>.cf>li>a',
      vipChapter: '.volume>.cf>li:has(.iconfont)>a',
      volume: () => $('.volume>h3').toArray().map(i => i.childNodes[2]),
      deal: async (chapter) => {
        const content = {};
        if (chapter.url.match(/vipreader.qidian.com/)) {
          await new Promise((resolve, reject) => {
            xhr.add({
              chapter,
              url: `https://vipreader.qidian.com/ajax/chapter/chapterInfo?_csrfToken=${document.cookie.match('_csrfToken=(.*?);')[1]}&bookId=${chapter.url.split('/')[4]}&chapterId=${chapter.url.split('/')[5]}&authorId=${$('.writer,.info>a[href*="authorIndex"]').attr('href').match(/id=(\d+)/)[1]}`,
              method: 'GET',
              onload: function (res, request) {
                try {
                  const json = JSON.parse(res.response);
                  content.title = json.data.chapterInfo.chapterName;

                  if (json.data.chapterInfo.fontsConf) {
                    const lib = [
                      {
                        unicode: '\u0000',
                        path: 'M100-120L100 880L900 880L900-120L100-120ZM500 421L818 830L182 830L500 421ZM532 380L850-29L850 789L532 380ZM182-70L818-70L500 339L182-70ZM150 789L150-29L468 380L150 789Z'
                      },
                      {
                        unicode: '一',
                        path: 'M47 430L952 430L952 349L47 349L47 430Z'
                      },
                      {
                        unicode: '三',
                        path: 'M126 740L876 740L876 665L126 665L126 740ZM189 416L794 416L794 341L189 341L189 416ZM69 72L929 72L929-4L69-4L69 72Z'
                      },
                      {
                        unicode: '上',
                        path: 'M506 45L942 45L942-29L55-29L55 45L427 45L427 821L506 821L506 515L880 515L880 440L506 440L506 45Z'
                      },
                      {
                        unicode: '下',
                        path: 'M942 688L520 688L520 512L533 527Q768 411 889 317L889 317L837 248Q729 338 520 451L520 451L520-71L441-71L441 688L59 688L59 763L942 763L942 688Z'
                      },
                      {
                        unicode: '不',
                        path: 'M927 692L610 692Q586 651 539 582L539 582L539-74L460-74L460 482Q296 295 98 191L98 191Q84 215 48 256L48 256Q351 408 515 692L515 692L73 692L73 766L927 766L927 692ZM559 477L614 525Q847 374 955 262L955 262L896 205Q776 334 559 477L559 477Z'
                      },
                      {
                        unicode: '两',
                        path: 'M588 558L588 695L407 695L407 558L588 558ZM938 695L661 695L661 558L897 558L897 18Q897-49 852-64L852-64Q815-77 668-77L668-77Q660-35 641-2L641-2Q736-7 799-4L799-4Q824-3 824 20L824 20L824 488L660 488Q656 433 650 389L650 389Q767 255 812 174L812 174L767 117Q724 196 632 308L632 308Q595 164 496 65L496 65Q472 98 443 117L443 117Q576 241 587 488L587 488L406 488Q402 431 396 386L396 386Q471 296 499 244L499 244L455 185Q429 237 377 303L377 303Q340 162 242 65L242 65Q222 95 191 117L191 117Q322 241 333 488L333 488L178 488L178-77L105-77L105 558L334 558L334 695L63 695L63 767L938 767L938 695Z'
                      },
                      {
                        unicode: '个',
                        path: 'M461-76L461 543L537 543L537-76L461-76ZM506 837L571 806Q548 767 544 762L544 762Q708 567 965 442L965 442Q930 416 911 376L911 376Q670 501 501 704L501 704Q339 496 94 377L94 377Q72 416 39 444L39 444Q351 579 506 837L506 837Z'
                      },
                      {
                        unicode: '中',
                        path: 'M536 321L823 321L823 586L536 586L536 321ZM173 321L459 321L459 586L173 586L173 321ZM536 659L899 659L899 191L823 191L823 248L536 248L536-76L459-76L459 248L173 248L173 186L100 186L100 659L459 659L459 837L536 837L536 659Z'
                      },
                      {
                        unicode: '为',
                        path: 'M337 662L269 629Q238 696 165 780L165 780L229 808Q299 731 337 662L337 662ZM483 597L898 597L897 558Q876 30 829-26L829-26Q799-61 746-65L746-65Q691-70 588-63L588-63Q584-23 562 14L562 14Q628 7 717 7L717 7Q746 7 760 22L760 22Q800 62 819 523L819 523L476 523Q429 145 116-63L116-63Q96-33 58-9L58-9Q354 184 400 523L400 523L86 523L86 597L408 597Q412 653 412 717L412 717L412 834L486 834L486 716Q486 660 483 597L483 597ZM699 211L634 175Q593 261 499 371L499 371L560 401Q657 295 699 211L699 211Z'
                      },
                      {
                        unicode: '主',
                        path: 'M539 29L944 29L944-44L60-44L60 29L460 29L460 274L152 274L152 346L460 346L460 565L106 565L106 638L545 638Q481 713 375 791L375 791L435 833Q557 745 618 672L618 672L571 638L894 638L894 565L539 565L539 346L853 346L853 274L539 274L539 29Z'
                      },
                      {
                        unicode: '么',
                        path: 'M443 825L520 797Q356 539 122 359L122 359Q94 390 65 413L65 413Q305 585 443 825L443 825ZM943-26L873-65Q849-13 816 41L816 41Q161-15 137-24L137-24Q126 14 105 52L105 52Q142 60 239 149L239 149Q448 323 661 628L661 628L737 592Q509 283 259 68L259 68L772 109Q702 212 634 297L634 297L700 330Q867 128 943-26L943-26Z'
                      },
                      {
                        unicode: '义',
                        path: 'M580 602L512 574Q489 662 414 816L414 816L478 840Q553 690 580 602L580 602ZM790 763L866 739Q752 415 557 217L557 217Q735 59 959-9L959-9Q929-35 908-76L908-76Q676 0 501 163L501 163Q329 11 81-76L81-76Q65-43 40-12L40-12Q282 68 449 215L449 215Q259 413 149 700L149 700L217 721Q319 453 504 268L504 268Q692 457 790 763L790 763Z'
                      },
                      {
                        unicode: '也',
                        path: 'M406 12L758 12Q826 12 849 46L849 46Q869 78 879 188L879 188Q906 169 948 158L948 158Q936 33 902-9L902-9Q864-56 759-56L759-56L409-56Q297-56 258-24L258-24Q217 8 217 101L217 101L217 413L54 362L34 429L217 485L217 769L289 769L289 507L496 571L496 835L569 835L569 593L801 665L822 681L874 658L870 644Q865 354 838 278L838 278Q813 211 758 203L758 203Q714 196 641 198L641 198Q636 243 622 267L622 267Q657 264 722 264L722 264Q759 264 774 311L774 311Q794 368 797 593L797 593L569 522L569 136L496 136L496 499L289 435L289 99Q289 46 311 29L311 29Q334 12 406 12L406 12Z'
                      },
                      {
                        unicode: '了',
                        path: 'M832 764L890 721Q748 564 542 453L542 453L542 21Q542-48 490-63L490-63Q449-76 285-76L285-76Q278-41 255-2L255-2Q367-6 438-3L438-3Q465-2 465 21L465 21L465 490Q612 562 743 686L743 686L100 686L100 759L814 759L832 764Z'
                      },
                      {
                        unicode: '事',
                        path: 'M774 132L774 207L534 207L534 132L774 132ZM534 336L534 266L774 266L774 336L534 336ZM245 513L460 513L460 585L245 585L245 513ZM758 585L534 585L534 513L758 513L758 585ZM951 266L951 207L848 207L848 30L774 30L774 75L534 75L534 6Q534-52 490-68L490-68Q456-80 324-80L324-80Q318-51 298-17L298-17Q328-18 435-18L435-18Q460-17 460 6L460 6L460 75L137 75L137 132L460 132L460 207L51 207L51 266L460 266L460 336L146 336L146 391L460 391L460 461L174 461L174 637L460 637L460 695L70 695L70 756L460 756L460 836L534 836L534 756L932 756L932 695L534 695L534 637L832 637L832 461L534 461L534 391L848 391L848 266L951 266Z'
                      },
                      {
                        unicode: '⼆',
                        path: 'M144 693L857 693L857 614L144 614L144 693ZM60 104L941 104L941 23L60 23L60 104Z'
                      },
                      {
                        unicode: '于',
                        path: 'M943 440L943 367L548 367L548 32Q548-41 496-58L496-58Q456-72 293-72L293-72Q284-36 261 5L261 5Q392 2 442 4L442 4Q471 5 471 32L471 32L471 367L58 367L58 440L471 440L471 692L127 692L127 765L873 765L873 692L548 692L548 440L943 440Z'
                      },
                      {
                        unicode: '些',
                        path: 'M838 333L668 333Q598 333 573 356L573 356Q549 379 549 445L549 445L549 836L623 836L623 638Q769 690 845 739L845 739L904 682Q801 626 623 572L623 572L623 445Q623 419 632 412L632 412Q642 404 676 404L676 404L832 404Q862 404 871 427L871 427Q879 450 883 534L883 534Q908 515 952 503L952 503Q944 402 922 368L922 368Q899 333 838 333L838 333ZM171 167L171 238L841 238L841 167L171 167ZM503 429L504 362Q238 326 54 304L54 304L45 376L111 383L111 727L180 727L180 391L268 402L268 836L341 836L341 665L496 665L496 597L341 597L341 411L503 429ZM60-52L60 21L941 21L941-52L60-52Z'
                      },
                      {
                        unicode: '⼈',
                        path: 'M458 833L540 833Q537 740 533 688L533 688Q600 154 961-6L961-6Q925-36 907-69L907-69Q608 71 502 481L502 481Q412 90 106-73L106-73Q87-43 46-15L46-15Q312 119 407 431L407 431Q453 584 458 833L458 833Z'
                      },
                      {
                        unicode: '什',
                        path: 'M292 833L362 811Q320 704 264 607L264 607L264-75L191-75L191 491Q136 414 82 357L82 357Q62 400 40 430L40 430Q201 588 292 833L292 833ZM951 493L951 420L682 420L682-77L607-77L607 420L328 420L328 493L607 493L607 826L682 826L682 493L951 493Z'
                      },
                      {
                        unicode: '从',
                        path: 'M511 217L455 164Q403 271 305 402L305 402Q254 91 116-75L116-75Q97-55 44-24L44-24Q236 179 264 813L264 813L344 810Q335 634 319 499L319 499Q447 347 511 217L511 217ZM645 815L725 811Q712 614 691 484L691 484Q767 129 954 2L954 2Q921-29 900-64L900-64Q744 57 662 334L662 334Q596 70 443-72L443-72Q421-50 371-20L371-20Q510 96 574 317L574 317Q627 496 645 815L645 815Z'
                      },
                      {
                        unicode: '他',
                        path: 'M269 833L337 812Q295 704 236 601L236 601L236-75L163-75L163 487Q117 422 64 366L64 366Q40 414 22 436L22 436Q180 590 269 833L269 833ZM555 4L811 4Q856 4 871 32L871 32Q884 58 891 149L891 149Q922 127 960 118L960 118Q950 11 923-24L923-24Q894-63 814-63L814-63L553-63Q464-63 432-35L432-35Q399-7 399 74L399 74L399 399L302 361L273 426L399 475L399 738L472 738L472 504L618 561L618 835L689 835L689 588L845 648L867 667L918 646L915 633Q915 323 903 267L903 267Q893 207 843 194L843 194Q808 185 742 187L742 187Q738 229 724 257L724 257Q751 255 800 255L800 255Q827 255 834 285L834 285Q843 317 845 573L845 573L689 512L689 145L618 145L618 484L472 426L472 74Q472 31 487 18L487 18Q503 4 555 4L555 4Z'
                      },
                      {
                        unicode: '以',
                        path: 'M592 511L525 472Q477 582 375 710L375 710L438 743Q544 616 592 511L592 511ZM242 166L474 274Q478 248 493 204L493 204Q178 53 144 23L144 23Q134 50 103 84L103 84Q163 118 163 174L163 174L163 759L242 759L242 166ZM962-26L898-74Q835 27 696 164L696 164Q600 7 403-83L403-83Q381-49 348-19L348-19Q575 71 665 271L665 271Q741 439 760 797L760 797L838 793Q815 412 731 230L731 230Q891 77 962-26L962-26Z'
                      },
                      {
                        unicode: '们',
                        path: 'M228 831L296 812Q268 712 220 599L220 599L220-76L148-76L148 454Q115 396 79 349L79 349Q64 391 39 424L39 424Q155 573 228 831L228 831ZM340-77L340 636L412 636L412-77L340-77ZM381 805L439 836Q523 722 558 645L558 645L497 610Q460 698 381 805L381 805ZM918 800L918 18Q918-44 878-61L878-61Q846-74 719-74L719-74Q714-40 695-3L695-3Q773-7 823-4L823-4Q845-3 845 19L845 19L845 732L575 732L575 800L918 800Z'
                      },
                      {
                        unicode: '会',
                        path: 'M93 265L93 337L914 337L914 265L478 265Q373 126 274 38L274 38L728 72Q674 135 612 192L612 192L675 226Q831 85 902-35L902-35L836-76Q812-35 781 6L781 6Q195-42 160-55L160-55Q142 4 135 22L135 22Q160 27 209 74L209 74Q280 133 377 265L377 265L93 265ZM504 836L575 805Q562 788 546 765L546 765Q717 590 960 507L960 507Q931 482 908 441L908 441Q681 533 503 715L503 715Q409 612 278 528L278 528L740 528L740 459L265 459L265 520Q184 469 100 431L100 431Q77 468 46 494L46 494Q368 632 504 836L504 836Z'
                      },
                      {
                        unicode: '但',
                        path: 'M800 500L800 695L469 695L469 500L800 500ZM800 231L800 431L469 431L469 231L800 231ZM878 765L878 161L393 161L393 765L878 765ZM280 833L352 810Q306 695 248 596L248 596L248-75L175-75L175 483Q132 422 74 361L74 361Q53 409 31 437L31 437Q191 591 280 833L280 833ZM309 33L962 33L962-37L309-37L309 33Z'
                      },
                      {
                        unicode: '作',
                        path: 'M287 833L358 810Q321 710 256 596L256 596L256-75L182-75L182 481Q138 419 83 362L83 362Q64 409 40 436L40 436Q197 588 287 833L287 833ZM958 599L650 599L650 456L935 456L935 387L650 387L650 236L949 236L949 166L650 166L650-76L575-76L575 599L506 599Q440 476 364 391L364 391Q340 417 306 441L306 441Q446 586 526 824L526 824L597 805Q576 745 542 670L542 670L958 670L958 599Z'
                      },
                      {
                        unicode: '你',
                        path: 'M267 833L337 812Q294 703 234 598L234 598L234-74L163-74L163 487Q123 429 62 363L62 363Q41 411 20 436L20 436Q175 588 267 833L267 833ZM449 411L522 397Q470 185 376 57L376 57Q358 72 312 98L312 98Q402 207 449 411L449 411ZM872 576L684 576L684 14Q684-46 649-62L649-62Q618-77 517-77L517-77Q511-43 491-2L491-2Q515-3 594-3L594-3Q611-3 611 14L611 14L611 576L459 576Q416 474 362 404L362 404Q334 430 303 451L303 451Q412 588 467 832L467 832L540 816Q517 729 487 645L487 645L892 645L904 648L955 636Q934 517 911 424L911 424L849 436Q867 542 872 576L872 576ZM757 397L822 419Q918 241 947 85L947 85L876 61Q849 215 757 397L757 397Z'
                      },
                      {
                        unicode: '候',
                        path: 'M947 606L947 542L404 542L404 606L764 606L784 725L460 725L460 788L798 788L810 792L861 786Q853 716 835 606L835 606L947 606ZM233 831L301 812Q269 703 219 592L219 592L219-78L148-78L148 455Q111 393 76 349L76 349Q60 395 36 424L36 424Q161 577 233 831L233 831ZM299 117L299 622L364 622L364 117L299 117ZM949 183L724 183Q777 37 965-10L965-10Q936-37 921-71L921-71Q752-23 681 120L681 120Q621-4 422-79L422-79Q403-47 375-24L375-24Q591 46 630 183L630 183L406 183L406 248L640 248L640 378L530 378Q499 318 456 269L456 269Q429 290 398 308L398 308Q478 390 522 536L522 536L589 520Q577 480 560 441L560 441L916 441L916 378L713 378L713 248L949 248L949 183Z'
                      },
                      {
                        unicode: '像',
                        path: 'M265 833L335 811Q292 693 233 588L233 588L233-74L162-74L162 473Q122 414 76 363L76 363Q60 399 34 436L34 436Q180 589 265 833L265 833ZM426 569L426 469L563 469Q592 512 602 569L602 569L426 569ZM666 707L486 707Q446 653 420 626L420 626L606 626Q630 651 666 707L666 707ZM826 469L826 569L663 569Q659 518 635 469L635 469L826 469ZM856 369L906 323Q861 294 795 260L795 260Q849 97 967 36L967 36Q938 14 919-20L919-20Q799 54 741 233L741 233L692 210Q717 133 709 60L709 60Q702-10 669-42L669-42Q638-76 582-76L582-76Q543-76 521-74L521-74Q519-36 503-10L503-10Q538-14 569-14L569-14Q601-14 618 5L618 5Q655 42 641 143L641 143Q509 23 323-41L323-41Q301-6 280 11L280 11Q501 78 627 204L627 204Q618 234 603 260L603 260Q487 161 331 104L331 104Q313 131 290 152L290 152Q467 205 577 302L577 302Q558 329 535 349L535 349Q453 289 331 249L331 249Q312 277 289 295L289 295Q435 342 513 412L513 412L359 412L359 566Q335 543 306 522L306 522Q289 550 258 569L258 569Q406 673 488 836L488 836L558 823Q553 813 542 794L542 794L525 765L706 765L719 769L763 737Q729 680 683 626L683 626L895 626L895 412L599 412Q592 403 576 387L576 387Q638 336 674 260L674 260Q775 312 856 369L856 369Z'
                      },
                      {
                        unicode: '⼏',
                        path: 'M758 18L853 18Q874 18 881 56L881 56Q888 91 891 207L891 207Q919 185 962 173L962 173Q956 41 937-4L937-4Q915-54 858-54L858-54L747-54Q690-54 669-29L669-29Q648-3 648 70L648 70L648 706L332 706L332 474Q332 89 104-79L104-79Q80-45 47-23L47-23Q256 130 256 475L256 475L256 779L724 779L724 69Q724 37 731 27L731 27Q737 18 758 18L758 18Z'
                      },
                      {
                        unicode: '出',
                        path: 'M812 340L892 340L892-75L812-75L812-18L108-18L108 340L188 340L188 55L458 55L458 403L152 403L152 745L229 745L229 476L458 476L458 836L538 836L538 476L773 476L773 746L853 746L853 403L538 403L538 55L812 55L812 340Z'
                      },
                      {
                        unicode: '到',
                        path: 'M366 251L366 95L574 134L579 69Q165-10 82-27L82-27L66 43L295 83L295 251L100 251L100 317L295 317L295 425L366 425L366 317L565 317L565 251L366 251ZM74 705L74 771L585 771L585 705L315 705Q260 599 200 519L200 519L455 541Q424 587 381 640L381 640L434 672Q542 543 585 458L585 458L528 421Q514 451 493 483L493 483Q147 450 122 438L122 438Q113 474 97 508L97 508Q116 512 145 552L145 552Q190 612 232 705L232 705L74 705ZM710 750L710 149L640 149L640 750L710 750ZM836 820L909 820L909 40Q909-26 868-41L868-41Q832-55 712-55L712-55Q707-21 685 18L685 18Q778 15 815 17L815 17Q836 18 836 39L836 39L836 820Z'
                      },
                      {
                        unicode: '前',
                        path: 'M190 202L411 202L411 302L190 302L190 202ZM411 458L190 458L190 360L411 360L411 458ZM483 522L483 9Q483-44 447-60L447-60Q419-72 308-72L308-72Q301-40 284-7L284-7Q364-10 392-8L392-8Q411-7 411 10L411 10L411 143L190 143L190-72L119-72L119 522L483 522ZM805 17L805 542L878 542L878 17Q878-44 838-60L838-60Q799-75 680-73L680-73Q673-39 653-2L653-2Q750-5 783-3L783-3Q805-2 805 17L805 17ZM673 512L673 106L604 106L604 512L673 512ZM711 679L945 679L945 611L57 611L57 679L302 679Q276 736 211 812L211 812L279 838Q346 766 379 698L379 698L330 679L628 679Q684 758 722 841L722 841L800 815Q765 755 711 679L711 679Z'
                      },
                      {
                        unicode: '动',
                        path: 'M477 755L477 688L93 688L93 755L477 755ZM512 88L446 67L428 132Q124 65 93 46L93 46L93 50Q92 49 92 47L92 47Q87 74 69 116L69 116Q86 120 114 184L114 184Q162 297 195 450L195 450L57 450L57 518L494 518L494 450L272 450Q232 288 170 145L170 145L407 195Q375 287 349 347L349 347L410 364Q481 202 512 88L512 88ZM722 607L942 607L941 570Q924 30 882-24L882-24Q856-56 810-62L810-62Q766-66 672-61L672-61Q668-19 649 12L649 12Q705 7 779 7L779 7Q804 6 817 22L817 22Q853 62 868 536L868 536L719 536Q694 94 517-76L517-76Q492-41 459-22L459-22Q625 130 646 536L646 536L507 536L507 607L649 607Q652 677 652 820L652 820L725 820Q725 712 722 607L722 607Z'
                      },
                      {
                        unicode: '去',
                        path: 'M948 344L464 344Q357 171 246 50L246 50L740 85Q674 179 605 259L605 259L670 289Q824 121 903-28L903-28L832-67Q811-24 783 20L783 20Q186-27 148-42L148-42Q136 7 123 31L123 31Q148 37 196 95L196 95Q278 180 371 344L371 344L56 344L56 418L461 418L461 607L134 607L134 680L461 680L461 837L538 837L538 680L874 680L874 607L538 607L538 418L948 418L948 344Z'
                      },
                      {
                        unicode: '⼜',
                        path: 'M762 692L253 692Q338 428 503 259L503 259Q685 433 762 692L762 692ZM805 769L855 746Q771 415 556 208L556 208Q729 59 964 1L964 1Q939-23 915-66L915-66Q668 1 499 155L499 155Q329 12 88-67L88-67Q70-25 41 1L41 1Q277 71 446 207L446 207Q275 390 177 692L177 692L101 692L101 765L793 765L805 769Z'
                      },
                      {
                        unicode: '发',
                        path: 'M858 681L798 640Q762 691 672 787L672 787L729 823Q820 730 858 681L858 681ZM741 361L428 361Q486 241 588 155L588 155Q689 243 741 361L741 361ZM791 437L841 412Q782 231 647 110L647 110Q779 20 961-14L961-14Q935-39 915-80L915-80Q724-38 590 63L590 63Q459-31 282-79L282-79Q268-46 243-15L243-15Q406 23 531 111L531 111Q442 194 382 306L382 306Q275 116 90 1L90 1Q69 33 35 58L35 58Q289 213 393 539L393 539L254 539Q162 539 148 522L148 522Q132 572 123 592L123 592Q142 597 159 632L159 632Q200 701 226 809L226 809L304 794Q282 711 232 611L232 611L412 611Q441 719 454 840L454 840L537 828Q520 708 497 611L497 611L928 611L927 539L477 539Q461 488 442 433L442 433L777 433L791 437Z'
                      },
                      {
                        unicode: '只',
                        path: 'M592 183L655 222Q849 77 941-32L941-32L873-77Q782 36 592 183L592 183ZM335 219L413 189Q296 33 111-80L111-80Q88-56 52-28L52-28Q241 80 335 219L335 219ZM236 691L236 383L763 383L763 691L236 691ZM161 762L841 762L841 311L161 311L161 762Z'
                      },
                      {
                        unicode: '可',
                        path: 'M494 474L233 474L233 246L494 246L494 474ZM567 175L233 175L233 95L161 95L161 546L567 546L567 175ZM944 766L944 692L821 692L821 30Q821-46 770-61L770-61Q730-75 563-75L563-75Q554-36 531 4L531 4Q638-1 716 2L716 2Q745 3 745 31L745 31L745 692L59 692L59 766L944 766Z'
                      },
                      {
                        unicode: '同',
                        path: 'M631 378L369 378L369 189L631 189L631 378ZM701 125L369 125L369 53L300 53L300 441L701 441L701 125ZM754 610L754 545L250 545L250 610L754 610ZM911 785L911 17Q911-46 870-64L870-64Q834-78 703-78L703-78Q698-41 676-5L676-5Q777-8 814-6L814-6Q838-5 838 17L838 17L838 714L163 714L163-79L91-79L91 785L911 785Z'
                      },
                      {
                        unicode: '后',
                        path: 'M800 278L387 278L387 43L800 43L800 278ZM313-78L313 348L877 348L877-76L800-76L800-26L387-26L387-78L313-78ZM229 562L951 562L951 490L229 490Q229 109 97-79L97-79Q69-44 36-28L36-28Q153 137 153 490L153 490L153 747Q610 776 819 828L819 828L881 769Q652 713 229 685L229 685L229 562Z'
                      },
                      {
                        unicode: '向',
                        path: 'M625 393L375 393L375 197L625 197L625 393ZM694 131L375 131L375 58L306 58L306 460L694 460L694 131ZM902 665L902 24Q902-46 857-63L857-63Q818-76 671-76L671-76Q664-37 643 2L643 2Q751-3 803 0L803 0Q828 1 828 25L828 25L828 592L176 592L176-75L101-75L101 665L374 665Q416 758 438 838L438 838L526 816Q478 708 457 665L457 665L902 665Z'
                      },
                      {
                        unicode: '命',
                        path: 'M364 358L199 358L199 150L364 150L364 358ZM434 424L434 84L199 84L199 0L130 0L130 424L434 424ZM875 425L875 144Q875 87 839 72L839 72Q811 59 688 59L688 59Q684 88 666 128L666 128Q694 127 784 127L784 127Q803 128 803 145L803 145L803 357L611 357L611-78L538-78L538 425L875 425ZM305 574L693 574Q581 645 503 733L503 733Q421 645 305 574L305 574ZM505 848L563 805L546 783Q699 612 963 543L963 543Q939 522 909 473L909 473Q805 505 694 574L694 574L694 506L297 506L297 569Q182 500 80 468L80 468Q62 510 38 540L38 540Q175 577 305 663L305 663Q435 748 505 848L505 848Z'
                      },
                      {
                        unicode: '和',
                        path: 'M322 723L322 543L496 543L496 474L322 474L322 448Q397 369 489 255L489 255L444 194Q415 242 322 363L322 363L322-74L249-74L249 366Q168 173 70 68L70 68Q57 99 29 136L29 136Q153 260 230 474L230 474L54 474L54 543L249 543L249 709Q172 697 84 685L84 685Q77 718 63 744L63 744Q318 779 439 827L439 827L489 769Q420 744 322 723L322 723ZM603 122L826 122L826 673L603 673L603 122ZM530 744L900 744L900-25L826-25L826 50L603 50L603-32L530-32L530 744Z'
                      },
                      {
                        unicode: '回',
                        path: 'M618 271L618 499L376 499L376 271L618 271ZM305 566L691 566L691 205L305 205L305 566ZM161 48L836 48L836 721L161 721L161 48ZM86 795L915 795L915-76L836-76L836-22L161-22L161-76L86-76L86 795Z'
                      },
                      {
                        unicode: '国',
                        path: 'M530 197L775 197L775 134L230 134L230 197L460 197L460 365L272 365L272 429L460 429L460 571L244 571L244 638L755 638L755 571L530 571L530 429L730 429L730 365L530 365L530 197ZM593 321L640 347Q709 287 741 238L741 238L690 208Q662 254 593 321L593 321ZM164 42L833 42L833 722L164 722L164 42ZM90 791L910 791L910-77L833-77L833-27L164-27L164-77L90-77L90 791Z'
                      },
                      {
                        unicode: '在',
                        path: 'M671 298L671 17L935 17L935-53L334-53L334 17L597 17L597 298L373 298L373 368L597 368L597 559L671 559L671 368L896 368L896 298L671 298ZM420 682L935 682L935 611L390 611Q334 495 269 407L269 407L269-73L196-73L196 319Q147 266 80 218L80 218Q69 249 42 285L42 285Q203 399 306 611L306 611L66 611L66 682L339 682Q370 758 392 837L392 837L468 818Q451 760 420 682L420 682Z'
                      },
                      {
                        unicode: '地',
                        path: 'M243 527L243 238Q330 276 357 286L357 286L372 220Q304 188 65 82L65 82L36 156Q91 175 173 210L173 210L173 527L45 527L45 598L173 598L173 825L243 825L243 598L360 598L360 527L243 527ZM578 13L819 13Q862 13 876 41L876 41Q889 67 894 155L894 155Q925 133 961 126L961 126Q952 20 926-15L926-15Q897-54 821-54L821-54L576-54Q490-54 460-27L460-27Q429 1 429 80L429 80L429 395L350 362L321 426L429 472L429 744L500 744L500 502L634 559L634 837L705 837L705 588L837 644L867 669L919 649L915 635Q915 309 905 261L905 261Q898 207 852 195L852 195Q824 188 758 188L758 188Q751 232 740 252L740 252Q764 251 807 251L807 251Q831 251 837 277L837 277Q844 311 844 571L844 571L705 512L705 145L634 145L634 482L500 425L500 79Q500 39 515 26L515 26Q530 13 578 13L578 13Z'
                      },
                      {
                        unicode: '声',
                        path: 'M463 386L229 386L229 317Q229 272 225 233L225 233L463 233L463 386ZM789 233L789 386L535 386L535 233L789 233ZM863 449L863 118L789 118L789 168L216 168Q183 9 89-82L89-82Q71-55 33-31L33-31Q156 87 156 317L156 317L156 449L863 449ZM926 689L536 689L536 591L883 591L883 527L133 527L133 591L461 591L461 689L74 689L74 754L461 754L461 839L536 839L536 754L926 754L926 689Z'
                      },
                      {
                        unicode: '多',
                        path: 'M745 753L793 723Q705 568 505 456L505 456Q332 359 117 314L117 314Q106 352 82 381L82 381Q262 413 417 488L417 488Q364 536 300 573L300 573L354 611Q429 568 482 521L482 521Q610 595 679 683L679 683L397 683Q297 600 165 540L165 540Q147 568 115 592L115 592Q339 686 457 838L457 838L538 821Q515 792 473 750L473 750L732 750L745 753ZM891 404L941 373Q764-1 109-79L109-79Q98-34 79-7L79-7Q364 20 556 109L556 109Q506 157 439 209L439 209L500 244Q566 196 624 143L624 143Q759 221 830 332L830 332L560 332Q427 225 249 155L249 155Q229 191 202 210L202 210Q485 312 619 492L619 492L701 474Q664 428 635 400L635 400L876 400L891 404Z'
                      },
                      {
                        unicode: '⼤',
                        path: 'M939 475L562 475Q679 108 955-5L955-5Q922-36 899-75L899-75Q629 53 501 420L501 420Q413 67 102-75L102-75Q83-40 46-14L46-14Q358 122 435 475L435 475L66 475L66 551L447 551Q460 639 462 835L462 835L542 835Q540 654 526 551L526 551L939 551L939 475Z'
                      },
                      {
                        unicode: '天',
                        path: 'M934 379L554 379Q665 78 962-7L962-7Q935-33 912-74L912-74Q624 22 501 323L501 323Q420 60 93-75L93-75Q79-44 45-13L45-13Q369 119 434 379L434 379L70 379L70 454L449 454Q455 501 455 567L455 567L455 684L105 684L105 759L891 759L891 684L532 684L532 566Q532 502 527 454L527 454L934 454L934 379Z'
                      },
                      {
                        unicode: '头',
                        path: 'M464 676L422 616Q338 684 195 738L195 738L236 792Q385 739 464 676L464 676ZM378 488L331 430Q253 498 106 557L106 557L151 609Q300 554 378 488L378 488ZM537 167L576 219Q806 112 939-6L939-6L890-62Q763 56 537 167L537 167ZM579 381L943 381L943 312L562 312Q477 21 104-73L104-73Q90-42 61-11L61-11Q401 70 485 312L485 312L61 312L61 381L504 381Q527 490 529 826L529 826L605 826Q603 503 579 381L579 381Z'
                      },
                      {
                        unicode: '她',
                        path: 'M313 562L204 562Q179 432 146 307L146 307Q217 256 244 234L244 234Q296 366 313 562L313 562ZM342 633L386 627Q370 356 302 187L302 187Q376 123 409 81L409 81L364 20Q333 59 270 117L270 117Q202-7 88-78L88-78Q70-44 43-17L43-17Q148 41 213 166L213 166Q135 233 64 279L64 279Q100 391 135 562L135 562L54 562L54 631L148 631Q170 764 177 836L177 836L248 831Q236 740 216 631L216 631L330 631L342 633ZM614 7L826 7Q863 7 876 36L876 36Q888 62 893 153L893 153Q921 133 958 124L958 124Q949 16 925-21L925-21Q899-61 828-61L828-61L611-61Q534-61 506-34L506-34Q478-7 478 70L478 70L478 419L404 392L384 458L478 493L478 745L547 745L547 518L663 561L663 831L731 831L731 586L858 633L877 648L927 627L924 614Q922 305 913 256L913 256Q903 197 861 188L861 188Q835 180 776 180L776 180Q772 227 760 253L760 253Q780 251 820 251L820 251Q840 251 846 276L846 276Q853 304 855 559L855 559L731 513L731 148L663 148L663 488L547 445L547 70Q547 31 559 19L559 19Q572 7 614 7L614 7Z'
                      },
                      {
                        unicode: '好',
                        path: 'M350 563L209 563Q182 433 149 321L149 321Q209 282 264 238L264 238Q328 377 350 563L350 563ZM382 635L427 624Q403 358 322 191L322 191Q400 125 438 75L438 75L388 14Q350 63 285 123L285 123Q204-5 77-76L77-76Q57-37 30-17L30-17Q150 43 229 171L229 171Q156 233 68 292L68 292Q100 387 138 563L138 563L46 563L46 632L151 632Q174 748 184 836L184 836L257 831Q240 716 223 632L223 632L368 632L382 635ZM956 415L956 344L736 344L736 12Q736-49 694-65L694-65Q656-79 538-77L538-77Q530-45 510-6L510-6Q605-9 639-7L639-7Q661-7 661 12L661 12L661 344L430 344L430 415L661 415L661 529Q731 587 807 694L807 694L474 694L474 763L858 763L875 767L926 730Q842 604 736 511L736 511L736 415L956 415Z'
                      },
                      {
                        unicode: '妈',
                        path: 'M309 562L204 562Q178 433 144 298L144 298Q213 241 235 220L235 220Q291 353 309 562L309 562ZM339 633L382 627Q364 332 290 168L290 168Q352 105 382 62L382 62L336 6Q313 40 258 102L258 102Q191-13 87-77L87-77Q67-41 43-17L43-17Q141 37 205 155L205 155Q135 223 64 279L64 279Q99 388 135 562L135 562L54 562L54 631L148 631Q170 759 177 836L177 836L248 831Q236 735 216 631L216 631L326 631L339 633ZM786 206L786 139L386 139L386 206L786 206ZM813 401L936 401L934 368Q905 12 854-40L854-40Q827-69 786-70L786-70Q754-74 667-70L667-70Q663-30 646-1L646-1Q694-7 757-7L757-7Q783-7 795 5L795 5Q836 44 861 337L861 337L432 337Q452 460 465 648L465 648L534 643Q524 516 510 401L510 401L744 401Q764 568 777 709L777 709L418 709L418 777L790 777L801 781L853 775Q838 582 813 401L813 401Z'
                      },
                      {
                        unicode: '⼦',
                        path: 'M950 394L950 320L542 320L542 22Q542-47 491-62L491-62Q451-76 295-76L295-76Q286-38 263 0L263 0Q372-4 439-1L439-1Q466 0 466 23L466 23L466 320L54 320L54 394L466 394L466 538Q599 599 716 696L716 696L153 696L153 769L797 769L813 773L869 731Q734 598 542 500L542 500L542 394L950 394Z'
                      },
                      {
                        unicode: '学',
                        path: 'M154 604L154 474L83 474L83 671L248 671Q221 728 162 798L162 798L224 827Q293 748 319 691L319 691L281 671L500 671Q476 744 425 820L425 820L489 844Q551 758 570 692L570 692L519 671L682 671Q743 747 783 830L783 830L858 804Q811 734 761 671L761 671L924 671L924 474L851 474L851 604L154 604ZM942 275L942 206L535 206L535 15Q535-47 487-62L487-62Q448-75 303-75L303-75Q297-51 272-3L272-3Q397-8 435-4L435-4Q461-3 461 16L461 16L461 206L63 206L63 275L461 275L461 347Q547 378 634 436L634 436L230 436L230 502L719 502L733 506L782 469Q689 384 535 315L535 315L535 275L942 275Z'
                      },
                      {
                        unicode: '它',
                        path: 'M410 21L719 21Q777 21 795 50L795 50Q811 77 819 178L819 178Q853 156 893 147L893 147Q882 28 850-11L850-11Q816-52 720-52L720-52L411-52Q305-52 267-25L267-25Q229 3 229 83L229 83L229 532L305 532L305 306Q586 383 725 461L725 461L786 403Q624 322 305 239L305 239L305 83Q305 45 325 33L325 33Q344 21 410 21L410 21ZM553 702L906 702L906 496L830 496L830 630L163 630L163 496L90 496L90 702L483 702Q464 760 426 824L426 824L498 844Q548 761 566 706L566 706L553 702Z'
                      },
                      {
                        unicode: '家',
                        path: 'M159 679L159 543L87 543L87 748L462 748Q444 789 425 821L425 821L501 843Q533 794 550 748L550 748L919 748L919 543L844 543L844 679L159 679ZM788 480L849 432Q783 377 695 319L695 319Q772 99 961 26L961 26Q932 0 913-35L913-35Q724 50 637 282L637 282Q615 267 590 254L590 254Q615 160 601 74L601 74Q587-8 545-40L545-40Q504-75 443-75L443-75Q421-75 357-73L357-73Q357-38 338-3L338-3Q398-8 428-8L428-8Q470-8 492 13L492 13Q546 52 531 185L531 185Q350 47 103-29L103-29Q90 3 64 34L64 34Q347 99 517 254L517 254Q504 298 490 324L490 324Q333 216 119 150L119 150Q100 187 81 208L81 208Q312 263 460 374L460 374Q442 403 412 433L412 433Q293 366 124 315L124 315Q110 345 83 374L83 374Q306 427 440 519L440 519L212 519L212 584L787 584L787 519L539 519Q508 492 468 466L468 466Q538 396 570 313L570 313Q695 393 788 480L788 480Z'
                      },
                      {
                        unicode: '对',
                        path: 'M392 725L440 709Q406 481 323 304L323 304Q393 200 438 114L438 114L381 59Q353 117 285 229L285 229Q203 83 88-7L88-7Q64 31 35 52L35 52Q151 135 239 301L239 301Q146 443 63 550L63 550L114 594Q213 464 274 376L274 376Q331 506 358 655L358 655L55 655L55 722L379 722L392 725ZM956 617L956 545L836 545L836 24Q836-41 794-58L794-58Q759-73 629-73L629-73Q623-35 604 2L604 2Q704-1 739 1L739 1Q763 1 763 24L763 24L763 545L478 545L478 617L763 617L763 834L836 834L836 617L956 617ZM685 202L619 169Q593 278 502 413L502 413L563 441Q655 310 685 202L685 202Z'
                      },
                      {
                        unicode: '⼩',
                        path: 'M464 821L543 821L543 27Q543-45 494-65L494-65Q452-79 303-79L303-79Q293-33 273 1L273 1Q391-2 436 0L436 0Q464 0 464 27L464 27L464 821ZM703 570L772 600Q928 349 968 160L968 160L891 125Q850 324 703 570L703 570ZM204 589L286 574Q217 273 99 131L99 131Q67 157 33 175L33 175Q153 313 204 589L204 589Z'
                      },
                      {
                        unicode: '⼭',
                        path: 'M814 631L890 631L890-73L814-73L814 1L111 1L111 630L187 630L187 76L461 76L461 825L537 825L537 76L814 76L814 631Z'
                      },
                      {
                        unicode: '⼯',
                        path: 'M538 74L947 74L947 0L55 0L55 74L457 74L457 648L107 648L107 724L897 724L897 648L538 648L538 74Z'
                      },
                      {
                        unicode: '已',
                        path: 'M354 25L734 25Q814 25 839 62L839 62Q862 96 873 219L873 219Q905 197 948 189L948 189Q933 47 895 2L895 2Q852-48 733-48L733-48L359-48Q237-48 194-19L194-19Q149 12 149 103L149 103L149 603L224 603L224 439L746 439L746 701L96 701L96 774L822 774L822 316L746 316L746 366L224 366L224 102Q224 55 249 40L249 40Q273 25 354 25L354 25Z'
                      },
                      {
                        unicode: '年',
                        path: 'M289 224L513 224L513 422L289 422L289 224ZM950 224L950 152L588 152L588-77L513-77L513 152L51 152L51 224L215 224L215 492L513 492L513 644L270 644Q202 528 118 447L118 447Q78 482 54 494L54 494Q204 625 279 839L279 839L354 821Q335 773 308 716L308 716L904 716L904 644L588 644L588 492L881 492L881 422L588 422L588 224L950 224Z'
                      },
                      {
                        unicode: '开',
                        path: 'M369 417L647 417L647 700L369 700L369 417ZM945 417L945 345L723 345L723-78L647-78L647 345L366 345Q340 59 118-81L118-81Q89-46 59-26L59-26Q265 100 290 345L290 345L56 345L56 417L293 417Q294 432 294 460L294 460L294 700L93 700L93 771L914 771L914 700L723 700L723 417L945 417Z'
                      },
                      {
                        unicode: '很',
                        path: 'M255 833L326 807Q232 667 86 569L86 569Q62 612 46 629L46 629Q187 722 255 833L255 833ZM273 615L339 588Q309 533 256 463L256 463L256-77L184-77L184 378Q131 317 72 271L72 271Q52 317 32 343L32 343Q185 457 273 615L273 615ZM473 545L473 421L796 421L796 545L473 545ZM796 727L473 727L473 607L796 607L796 727ZM871 324L921 272Q851 215 742 149L742 149Q829 41 960-6L960-6Q931-31 910-70L910-70Q664 29 571 356L571 356L473 356L473 27L649 70Q649 23 653 2L653 2Q421-61 398-77L398-77Q385-41 364-16L364-16Q401 4 401 54L401 54L401 793L868 793L868 356L636 356Q662 272 707 200L707 200Q813 268 871 324L871 324Z'
                      },
                      {
                        unicode: '得',
                        path: 'M811 669L811 749L482 749L482 669L811 669ZM811 534L811 615L482 615L482 534L811 534ZM885 805L885 477L410 477L410 805L885 805ZM253 833L324 806Q229 669 80 569L80 569Q65 602 41 629L41 629Q182 720 253 833L253 833ZM271 615L336 589Q306 535 254 466L254 466L254-76L181-76L181 382Q123 319 64 274L64 274Q49 312 25 345L25 345Q183 461 271 615L271 615ZM412 146L465 180Q550 105 592 41L592 41L535 1Q499 61 412 146L412 146ZM950 261L950 197L801 197L801 5Q801-50 763-66L763-66Q730-78 611-78L611-78Q607-50 587-10L587-10Q676-13 707-11L707-11Q727-10 727 7L727 7L727 197L326 197L326 261L727 261L727 346L349 346L349 410L932 410L932 346L801 346L801 261L950 261Z'
                      },
                      {
                        unicode: '⼼',
                        path: 'M344 753L393 802Q576 676 662 581L662 581L609 526Q517 630 344 753L344 753ZM759 484L828 511Q927 308 962 136L962 136L889 107Q855 284 759 484L759 484ZM138 485L210 471Q175 217 122 79L122 79L48 110Q111 259 138 485L138 485ZM297 560L372 560L372 67Q372 33 385 22L385 22Q398 12 441 12L441 12L632 12Q678 12 692 51L692 51Q705 87 711 219L711 219Q737 198 781 186L781 186Q773 40 746-7L746-7Q717-58 636-58L636-58L435-58Q354-58 326-32L326-32Q297-6 297 68L297 68L297 560Z'
                      },
                      {
                        unicode: '志',
                        path: 'M119-27L52 8Q114 91 152 248L152 248L218 225Q172 51 119-27L119-27ZM420 5L638 5Q678 5 690 27L690 27Q702 48 706 128L706 128Q731 110 774 100L774 100Q766 2 741-30L741-30Q715-62 643-62L643-62L417-62Q331-62 302-41L302-41Q272-21 272 40L272 40L272 258L345 258L345 41Q345 18 359 12L359 12Q373 5 420 5L420 5ZM655 195L600 145Q527 229 379 316L379 316L431 361Q587 270 655 195L655 195ZM743 233L810 258Q907 94 944-3L944-3L871-32Q832 84 743 233L743 233ZM536 693L944 693L944 622L536 622L536 453L884 453L884 383L123 383L123 453L460 453L460 622L59 622L59 693L460 693L460 837L536 837L536 693Z'
                      },
                      {
                        unicode: '想',
                        path: 'M829 630L829 723L581 723L581 630L829 630ZM829 478L829 572L581 572L581 478L829 478ZM829 326L829 421L581 421L581 326L829 326ZM900 784L900 265L512 265L512 784L900 784ZM415 235L467 273Q552 196 605 132L605 132L551 88Q509 143 415 235L415 235ZM115-24L50 9Q103 80 144 212L144 212L209 187Q160 38 115-24L115-24ZM311 255L240 255L240 518Q167 382 84 314L84 314Q62 345 36 366L36 366Q152 448 227 623L227 623L58 623L58 688L240 688L240 834L311 834L311 688L469 688L469 623L311 623L311 567Q367 532 477 447L477 447L437 387Q395 427 311 498L311 498L311 255ZM426 12L623 12Q659 12 670 32L670 32Q680 52 683 128L683 128Q709 108 751 100L751 100Q743 6 720-24L720-24Q695-55 628-55L628-55L421-55Q340-55 313-35L313-35Q285-16 285 42L285 42L285 201L358 201L358 43Q358 23 370 18L370 18Q383 12 426 12L426 12ZM765 203L829 232Q918 95 949 32L949 32L880-2Q855 54 765 203L765 203Z'
                      },
                      {
                        unicode: '成',
                        path: 'M670 787L714 832Q831 773 893 718L893 718L847 667Q783 726 670 787L670 787ZM812 517L887 498Q822 302 711 160L711 160Q770 5 845 5L845 5Q882 5 892 190L892 190Q922 160 956 150L956 150Q946 23 921-23L921-23Q896-69 839-69L839-69Q729-69 656 95L656 95Q565-4 450-71L450-71Q423-34 396-12L396-12Q530 60 626 173L626 173Q574 337 553 594L553 594L208 594L208 464L463 464L463 432Q456 129 431 98L431 98Q412 73 371 69L371 69Q331 66 252 69L252 69Q250 108 231 139L231 139Q289 134 337 134L337 134Q360 134 367 145L367 145Q385 164 390 395L390 395L208 395L208 387Q208 68 103-84L103-84Q75-52 41-34L41-34Q132 101 132 388L132 388L132 667L549 667Q545 722 543 835L543 835L620 835Q620 739 624 667L624 667L947 667L947 594L629 594Q645 385 684 247L684 247Q766 367 812 517L812 517Z'
                      },
                      {
                        unicode: '我',
                        path: 'M919 644L859 601Q806 681 702 771L702 771L759 810Q866 720 919 644L919 644ZM829 426L895 399Q828 273 721 164L721 164Q782-5 854-5L854-5Q891-5 899 174L899 174Q928 146 962 134L962 134Q952 10 927-34L927-34Q903-79 847-79L847-79Q736-79 662 108L662 108Q562 19 451-39L451-39Q431-6 400 20L400 20Q532 84 637 182L637 182Q601 307 581 472L581 472L346 472L346 312L525 351L530 284Q483 272 346 241L346 241L346 19Q346-46 303-63L303-63Q267-77 137-77L137-77Q130-42 109-2L109-2Q196-6 249-3L249-3Q273-3 273 20L273 20L273 223L164 199Q91 182 66 177L66 177L45 252Q99 261 273 297L273 297L273 472L59 472L59 543L273 543L273 702Q186 685 89 672L89 672Q82 703 65 734L65 734Q322 773 460 824L460 824L513 763Q439 737 346 717L346 717L346 543L575 543Q563 668 561 828L561 828L637 828Q637 677 649 543L649 543L943 543L943 472L657 472Q672 345 698 244L698 244Q778 330 829 426L829 426Z'
                      },
                      {
                        unicode: '战',
                        path: 'M919 653L865 619Q832 686 763 768L763 768L814 797Q885 718 919 653L919 653ZM425 66L425 320L152 320L152 66L425 66ZM308 577L308 388L494 388L494-53L425-53L425-2L152-2L152-58L85-58L85 388L237 388L237 831L308 831L308 643L515 643L515 577L308 577ZM879 468L936 437Q883 282 781 146L781 146Q819 10 872 7L872 7Q903 6 915 158L915 158Q931 139 969 119L969 119Q942-79 873-77L873-77Q781-73 728 83L728 83Q645-5 556-56L556-56Q534-25 502-3L502-3Q610 49 705 159L705 159Q674 279 655 472L655 472L518 453L508 516L649 537Q640 660 633 831L633 831L703 831Q706 688 717 547L717 547L943 580L953 516L723 483Q739 329 760 230L760 230Q838 341 879 468L879 468Z'
                      },
                      {
                        unicode: '⼿',
                        path: 'M949 322L949 249L539 249L539 27Q539-43 486-60L486-60Q441-75 280-73L280-73Q269-34 248 1L248 1Q362-3 433 0L433 0Q464 0 464 28L464 28L464 249L53 249L53 322L464 322L464 484L120 484L120 555L464 555L464 709Q329 694 138 685L138 685Q133 716 119 751L119 751Q598 773 795 835L795 835L851 776Q734 740 539 717L539 717L539 555L893 555L893 484L539 484L539 322L949 322Z'
                      },
                      {
                        unicode: '把',
                        path: 'M359 400L369 331L247 295L247 9Q247-45 213-62L213-62Q183-78 95-76L95-76Q89-39 73-8L73-8Q140-10 157-8L157-8Q174-8 174 9L174 9L174 272L59 238L39 309Q111 328 174 347L174 347L174 566L54 566L54 635L174 635L174 836L247 836L247 635L350 635L350 566L247 566L247 367L359 400ZM622 712L481 712L481 396L622 396L622 712ZM834 396L834 712L692 712L692 396L834 396ZM562 20L816 20Q860 20 875 49L875 49Q888 76 895 168L895 168Q929 145 967 138L967 138Q957 29 929-9L929-9Q899-51 818-51L818-51L559-51Q470-51 439-23L439-23Q406 6 406 90L406 90L406 785L910 785L910 260L834 260L834 325L481 325L481 89Q481 47 496 34L496 34Q511 20 562 20L562 20Z'
                      },
                      {
                        unicode: '⽅',
                        path: 'M932 591L424 591Q419 499 410 433L410 433L835 433Q834 408 832 397L832 397Q807 22 754-31L754-31Q725-62 668-66L668-66Q604-70 501-62L501-62Q497-22 475 10L475 10Q558 3 642 3L642 3Q676 3 689 14L689 14Q732 51 755 361L755 361L399 361Q342 46 104-80L104-80Q82-44 50-20L50-20Q220 65 288 248L288 248Q331 367 342 591L342 591L72 591L72 664L509 664Q486 734 441 814L441 814L512 842Q565 750 584 694L584 694L515 664L932 664L932 591Z'
                      },
                      {
                        unicode: '时',
                        path: 'M325 686L155 686L155 468L325 468L325 686ZM155 175L325 175L325 401L155 401L155 175ZM395 753L395 107L155 107L155 28L85 28L85 753L395 753ZM958 637L958 564L837 564L837 34Q837-37 787-53L787-53Q748-68 589-66L589-66Q580-22 562 8L562 8Q686 5 735 7L735 7Q763 8 763 34L763 34L763 564L440 564L440 637L763 637L763 831L837 831L837 637L958 637ZM691 246L626 208Q575 305 474 452L474 452L535 484Q654 314 691 246L691 246Z'
                      },
                      {
                        unicode: '是',
                        path: 'M756 658L756 739L239 739L239 658L756 658ZM756 523L756 604L239 604L239 523L756 523ZM830 796L830 466L166 466L166 796L830 796ZM545 155L545 19Q599 13 663 13L663 13Q907 13 958 14L958 14Q939-18 932-57L932-57L660-57Q499-57 411-24L411-24Q309 14 251 110L251 110Q193-5 95-78L95-78Q74-50 40-25L40-25Q192 73 234 300L234 300L309 290Q300 243 283 190L283 190Q336 67 472 31L472 31L472 332L62 332L62 399L940 399L940 332L545 332L545 221L875 221L875 155L545 155Z'
                      },
                      {
                        unicode: '有',
                        path: 'M747 354L747 455L330 455L330 354L747 354ZM330 185L747 185L747 289L330 289L330 185ZM937 638L399 638Q363 564 338 522L338 522L820 522L820 17Q820-46 778-62L778-62Q742-75 604-75L604-75Q600-43 580-2L580-2Q624-4 724-4L724-4Q747-3 747 17L747 17L747 121L330 121L330-76L257-76L257 406Q182 312 90 248L90 248Q72 278 43 305L43 305Q212 419 318 638L318 638L67 638L67 708L349 708Q376 777 393 837L393 837L467 819Q442 740 428 708L428 708L937 708L937 638Z'
                      },
                      {
                        unicode: '来',
                        path: 'M942 325L589 325Q741 121 963 26L963 26Q931-4 911-37L911-37Q698 69 538 286L538 286L538-76L461-76L461 284Q307 74 91-33L91-33Q69 0 39 28L39 28Q261 124 411 325L411 325L60 325L60 396L461 396L461 645L107 645L107 716L461 716L461 836L538 836L538 716L900 716L900 645L538 645L538 396L942 396L942 325ZM188 597L253 622Q326 516 348 435L348 435L278 408Q255 498 188 597L188 597ZM716 406L654 427Q713 520 755 626L755 626L831 602Q763 470 716 406L716 406Z'
                      },
                      {
                        unicode: '样',
                        path: 'M595 676L526 647Q502 721 441 808L441 808L506 832Q572 742 595 676L595 676ZM374 354L328 300Q311 340 256 442L256 442L256-76L185-76L185 382Q134 218 74 126L74 126Q59 166 35 197L35 197Q131 329 185 575L185 575L59 575L59 645L185 645L185 837L256 837L256 645L362 645L362 575L256 575L256 535Q319 448 374 354L374 354ZM944 231L944 162L697 162L697-76L624-76L624 162L362 162L362 231L624 231L624 372L431 372L431 441L624 441L624 577L399 577L399 646L726 646Q782 736 820 839L820 839L894 814Q854 727 805 646L805 646L923 646L923 577L697 577L697 441L892 441L892 372L697 372L697 231L944 231Z'
                      },
                      {
                        unicode: '正',
                        path: 'M563 40L946 40L946-33L56-33L56 40L192 40L192 508L267 508L267 40L487 40L487 691L94 691L94 763L913 763L913 691L563 691L563 425L875 425L875 352L563 352L563 40Z'
                      },
                      {
                        unicode: '⺠',
                        path: 'M231 345L514 345Q498 432 494 496L494 496L231 496L231 345ZM788 715L231 715L231 566L788 566L788 715ZM936 275L610 275Q649 155 713 82L713 82Q777 7 843 8L843 8Q882 9 889 154L889 154Q916 131 954 119L954 119Q945 12 919-28L919-28Q895-65 839-65L839-65Q741-66 657 30L657 30Q577 122 532 275L532 275L231 275L231 25L471 83Q471 45 479 15L479 15Q167-69 146-82L146-82Q133-40 111-14L111-14Q155 8 155 59L155 59L155 785L862 785L862 496L570 496Q574 423 592 345L592 345L936 345L936 275Z'
                      },
                      {
                        unicode: '⽔',
                        path: 'M360 585L408 566Q338 188 102 22L102 22Q78 56 43 78L43 78Q247 211 319 508L319 508L75 508L75 582L345 582L360 585ZM814 650L881 602Q761 464 658 377L658 377Q798 175 971 94L971 94Q939 66 916 27L916 27Q694 144 541 447L541 447L541 25Q541-43 500-61L500-61Q466-77 344-77L344-77Q339-37 316 4L316 4Q373 2 440 2L440 2Q463 3 463 25L463 25L463 834L541 834L541 594Q575 509 621 432L621 432Q734 536 814 650L814 650Z'
                      },
                      {
                        unicode: '没',
                        path: 'M518 731L518 686Q518 497 340 412L340 412Q322 441 291 466L291 466Q446 539 446 688L446 688L446 801L786 801L786 582Q786 543 806 543L806 543L892 543Q925 543 946 549L946 549L953 477Q937 471 894 471L894 471L801 471Q749 471 730 497L730 497Q713 520 713 584L713 584L713 731L518 731ZM310 715L267 655Q198 707 87 770L87 770L129 823Q247 761 310 715L310 715ZM264 454L222 393Q153 444 38 501L38 501L79 556Q203 496 264 454L264 454ZM247 305L301 259Q220 86 131-62L131-62L69-14Q155 116 247 305L247 305ZM782 328L459 328Q514 219 618 138L618 138Q726 219 782 328L782 328ZM835 401L884 379Q825 210 681 95L681 95Q804 20 961-8L961-8Q930-41 913-77L913-77Q739-37 616 49L616 49Q487-34 306-76L306-76Q291-38 268-8L268-8Q427 22 555 96L555 96Q447 187 385 321L385 321L405 328L342 328L342 398L821 398L835 401Z'
                      },
                      {
                        unicode: '点',
                        path: 'M758 286L758 464L239 464L239 286L758 286ZM833 534L833 216L168 216L168 534L455 534L455 837L529 837L529 730L907 730L907 660L529 660L529 534L833 534ZM113-76L45-43Q124 24 181 156L181 156L251 138Q193 1 113-76L113-76ZM341 129L412 135Q435 22 437-58L437-58L363-68Q363 21 341 129L341 129ZM546 128L613 143Q667 38 688-48L688-48L616-65Q598 22 546 128L546 128ZM749 137L814 162Q909 44 947-40L947-40L877-68Q840 21 749 137L749 137Z'
                      },
                      {
                        unicode: '然',
                        path: 'M925 682L868 648Q830 717 762 783L762 783L816 815Q895 736 925 682L925 682ZM112-78L44-49Q118 28 174 142L174 142L243 124Q176-4 112-78L112-78ZM471 751L516 732Q434 327 111 178L111 178Q89 213 60 235L60 235Q180 285 266 374L266 374Q212 418 146 458L146 458L188 498Q242 469 306 420L306 420Q335 455 364 507L364 507Q306 548 239 581L239 581L273 624Q332 597 391 560L391 560Q415 614 434 687L434 687L268 687Q190 535 88 444L88 444Q70 465 38 490L38 490Q193 625 259 844L259 844L330 826Q304 761 298 748L298 748L458 748L471 751ZM345 114L414 121Q436 22 438-58L438-58L366-68Q364 20 345 114L345 114ZM939 554L734 554Q796 311 956 228L956 228Q924 198 906 167L906 167Q773 246 703 436L703 436Q645 265 452 161L452 161Q435 184 399 213L399 213Q626 332 656 554L656 554L501 554L501 625L662 625L662 825L733 825L733 625L939 625L939 554ZM550 116L618 129Q667 25 682-52L682-52L610-67Q594 16 550 116L550 116ZM756 121L820 149Q914 36 955-47L955-47L886-79Q846 9 756 121L756 121Z'
                      },
                      {
                        unicode: '现',
                        path: 'M503 722L503 260L432 260L432 788L878 788L878 260L805 260L805 722L503 722ZM392 200L402 131L63 30L47 102L191 141L191 413L73 413L73 482L191 482L191 699L59 699L59 769L387 769L387 699L263 699L263 482L367 482L367 413L263 413L263 162Q288 168 392 200L392 200ZM764 6L845 6Q871 6 880 37L880 37Q887 66 891 174L891 174Q921 152 951 146L951 146Q944 23 927-11L927-11Q907-50 845-50L845-50L754-50Q702-50 681-33L681-33Q659-14 659 34L659 34L659 244Q597 33 380-79L380-79Q356-42 333-25L333-25Q502 61 568 200L568 200Q615 299 615 446L615 446L615 638L685 638L685 444Q685 351 667 276L667 276L728 276L728 41Q728 20 736 13L736 13Q743 6 764 6L764 6Z'
                      },
                      {
                        unicode: '理',
                        path: 'M353 201L366 130L56 26L39 101Q113 123 173 143L173 143L173 412L59 412L59 482L173 482L173 699L49 699L49 769L359 769L359 699L244 699L244 482L345 482L345 412L244 412L244 165L353 201ZM476 539L476 411L628 411L628 539L476 539ZM476 726L476 600L628 600L628 726L476 726ZM845 600L845 726L692 726L692 600L845 600ZM845 411L845 539L692 539L692 411L845 411ZM698 24L963 24L963-44L319-44L319 24L623 24L623 161L396 161L396 229L623 229L623 346L408 346L408 791L916 791L916 346L698 346L698 229L931 229L931 161L698 161L698 24Z'
                      },
                      {
                        unicode: '⽣',
                        path: 'M540 27L945 27L945-45L59-45L59 27L464 27L464 281L167 281L167 353L464 353L464 571L229 571Q180 474 124 408L124 408Q95 433 57 452L57 452Q176 580 242 820L242 820L317 804Q290 711 261 644L261 644L464 644L464 836L540 836L540 644L898 644L898 571L540 571L540 353L861 353L861 281L540 281L540 27Z'
                      },
                      {
                        unicode: '⽤',
                        path: 'M542 299L811 299L811 465L542 465L542 299ZM225 299L468 299L468 465L229 465L229 406Q229 348 225 299L225 299ZM468 695L229 695L229 535L468 535L468 695ZM811 535L811 695L542 695L542 535L811 535ZM884 766L884 24Q884-41 839-59L839-59Q801-73 653-71L653-71Q648-40 628 1L628 1Q675-1 784-1L784-1Q811 0 811 25L811 25L811 228L542 228L542-67L468-67L468 228L218 228Q191 27 93-82L93-82Q72-53 36-33L36-33Q156 102 156 406L156 406L156 766L884 766Z'
                      },
                      {
                        unicode: '的',
                        path: 'M368 401L368 610L158 610L158 401L368 401ZM158 95L368 95L368 335L158 335L158 95ZM242 839L322 824Q278 698 270 677L270 677L436 677L436 28L158 28L158-51L90-51L90 677L202 677Q232 774 242 839L242 839ZM925 680L925 642Q904 42 856-17L856-17Q828-52 777-57L777-57Q736-62 629-56L629-56Q625-15 604 17L604 17Q669 11 752 11L752 11Q781 11 793 26L793 26Q836 72 854 611L854 611L600 611Q554 500 506 436L506 436Q493 448 445 478L445 478Q543 607 598 841L598 841L669 824Q650 746 626 680L626 680L925 680ZM767 230L704 191Q658 284 552 422L552 422L610 456Q720 316 767 230L767 230Z'
                      },
                      {
                        unicode: '看',
                        path: 'M767 267L767 336L333 336L333 267L767 267ZM333 20L767 20L767 94L333 94L333 20ZM767 146L767 216L333 216L333 146L767 146ZM938 464L383 464Q354 412 342 395L342 395L840 395L840-79L767-79L767-40L333-40L333-79L262-79L262 292Q182 204 84 145L84 145Q65 176 38 202L38 202Q197 294 298 464L298 464L62 464L62 526L333 526Q356 571 366 599L366 599L135 599L135 659L388 659Q400 695 409 729L409 729Q279 722 136 722L136 722Q134 748 121 779L121 779Q595 783 823 829L823 829L870 775Q735 747 491 733L491 733L468 659L880 659L880 599L447 599Q430 557 414 526L414 526L938 526L938 464Z'
                      },
                      {
                        unicode: '眼',
                        path: 'M289 707L142 707L142 568L289 568L289 707ZM142 154L289 154L289 299L142 299L142 154ZM142 504L142 364L289 364L289 504L142 504ZM351 774L351 87L142 87L142 0L77 0L77 774L351 774ZM509 545L509 421L819 421L819 545L509 545ZM819 727L509 727L509 607L819 607L819 727ZM897 324L946 272Q868 209 770 153L770 153Q847 41 960-6L960-6Q930-31 909-69L909-69Q694 36 615 356L615 356L509 356L509 27L685 70Q685 23 689 2L689 2Q458-61 433-77L433-77Q424-47 400-16L400-16Q436 3 436 54L436 54L436 793L891 793L891 356L680 356Q705 267 738 206L738 206Q831 265 897 324L897 324Z'
                      },
                      {
                        unicode: '着',
                        path: 'M762 231L762 290L344 290L344 231L762 231ZM344 17L762 17L762 77L344 77L344 17ZM762 124L762 183L344 183L344 124L762 124ZM930 405L384 405Q360 365 346 347L346 347L838 347L838-74L762-74L762-40L344-40L344-77L271-77L271 249Q192 157 91 87L91 87Q55 126 34 142L34 142Q189 238 300 405L300 405L69 405L69 466L337 466Q360 507 373 535L373 535L160 535L160 593L400 593Q416 631 426 661L426 661L116 661L116 722L312 722Q285 771 248 816L248 816L318 841Q363 790 392 737L392 737L356 722L611 722Q662 793 684 839L684 839L761 815Q714 749 691 722L691 722L887 722L887 661L505 661L478 593L842 593L842 535L453 535Q439 503 419 466L419 466L930 466L930 405Z'
                      },
                      {
                        unicode: '知',
                        path: 'M328 634L328 469Q328 447 327 435L327 435L515 435L515 364L323 364Q321 340 313 297L313 297Q373 238 512 80L512 80L462 17Q409 93 296 221L296 221Q239 33 89-74L89-74Q68-40 37-19L37-19Q224 114 249 364L249 364L48 364L48 435L254 435L254 634L178 634Q138 534 97 477L97 477Q80 494 36 520L36 520Q118 628 160 837L160 837L232 823Q222 768 201 703L201 703L486 703L486 634L328 634ZM619 101L830 101L830 680L619 680L619 101ZM547 750L904 750L904-38L830-38L830 31L619 31L619-48L547-48L547 750Z'
                      },
                      {
                        unicode: '经',
                        path: 'M963 429L921 368Q827 431 663 503L663 503Q545 420 404 367L404 367Q384 403 359 428L359 428Q640 523 775 715L775 715L424 715L424 784L823 784L836 787L889 758Q834 646 721 549L721 549Q887 477 963 429L963 429ZM182 287L380 322Q377 290 379 256L379 256Q96 199 68 184L68 184Q61 217 44 254L44 254Q69 260 122 319L122 319Q159 356 229 452L229 452Q81 432 62 422L62 422Q53 459 37 494L37 494Q58 498 96 555L96 555Q182 678 237 837L237 837L308 804Q232 634 140 506L140 506L277 521Q308 567 342 628L342 628L407 587Q294 407 182 287L182 287ZM377 136L385 72L59-14L44 60Q125 77 377 136L377 136ZM703 263L703 21L958 21L958-49L372-49L372 21L630 21L630 263L433 263L433 332L911 332L911 263L703 263Z'
                      },
                      {
                        unicode: '给',
                        path: 'M178 283L377 319Q375 284 377 256L377 256Q96 199 71 184L71 184Q60 221 47 253L47 253Q69 257 122 319L122 319Q169 374 222 452L222 452Q87 433 64 422L64 422Q53 465 39 495L39 495Q60 501 95 557L95 557Q170 666 226 836L226 836L297 803Q231 640 141 507L141 507L266 520Q310 592 329 632L329 632L394 592Q288 412 178 283L178 283ZM60-18L46 56Q88 64 383 130L383 130L390 65Q106-6 60-18L60-18ZM781 263L522 263L522 41L781 41L781 263ZM450-80L450 330L855 330L855-77L781-77L781-26L522-26L522-80L450-80ZM522 511L803 511Q719 598 658 711L658 711Q606 601 522 511L522 511ZM630 835L701 816Q698 806 690 786L690 786Q790 581 953 491L953 491Q925 469 899 429L899 429Q854 460 812 502L812 502L812 443L498 443L498 487Q460 449 415 418L415 418Q393 447 362 471L362 471Q557 604 630 835L630 835Z'
                      },
                      {
                        unicode: '⽼',
                        path: 'M470 497L546 497Q632 565 696 632L696 632L470 632L470 497ZM946 427L573 427Q488 361 398 306L398 306L398 203Q629 263 758 329L758 329L821 276Q660 202 398 140L398 140L398 51Q398 23 415 15L415 15Q432 6 489 6L489 6L757 6Q806 6 821 31L821 31Q836 55 841 143L841 143Q867 125 912 115L912 115Q902 7 874-27L874-27Q844-62 760-62L760-62L487-62Q390-62 357-39L357-39Q323-16 323 51L323 51L323 262Q221 203 89 149L89 149Q65 183 36 212L36 212Q254 292 451 427L451 427L55 427L55 497L395 497L395 632L142 632L142 702L395 702L395 837L470 837L470 702L718 702L718 655Q784 728 835 798L835 798L902 764Q798 620 658 497L658 497L946 497L946 427Z'
                      },
                      {
                        unicode: '⽽',
                        path: 'M947 710L533 710Q514 643 487 565L487 565L896 565L896 17Q896-42 858-58L858-58Q826-71 706-71L706-71Q699-34 680-2L680-2Q760-5 802-2L802-2Q822-1 822 18L822 18L822 495L652 495L652-44L579-44L579 495L414 495L414-44L341-44L341 495L183 495L183-77L108-77L108 565L409 565Q430 635 444 710L444 710L57 710L57 784L947 784L947 710Z'
                      },
                      {
                        unicode: '能',
                        path: 'M841 400L669 400Q599 400 575 422L575 422Q551 443 551 504L551 504L551 834L623 834L623 667Q757 711 855 761L855 761L905 707Q810 662 623 606L623 606L623 505Q623 481 633 474L633 474Q643 467 676 467L676 467L835 467Q863 467 872 488L872 488Q881 509 885 583L885 583Q906 565 951 554L951 554Q944 463 922 432L922 432Q900 400 841 400L841 400ZM173 185L384 185L384 276L173 276L173 185ZM384 420L173 420L173 335L384 335L384 420ZM457 483L457 9Q457-46 422-61L422-61Q393-74 289-74L289-74Q282-38 265-6L265-6Q331-9 367-6L367-6Q384-6 384 10L384 10L384 127L173 127L173-76L104-76L104 483L457 483ZM313 752L374 777Q470 651 502 561L502 561L437 532Q428 557 415 585L415 585Q117 563 86 552L86 552Q73 599 62 622L62 622Q80 627 108 661L108 661Q171 739 212 839L212 839L288 815Q236 715 166 628L166 628L385 641Q355 694 313 752L313 752ZM679-2L840-2Q871-2 881 22L881 22Q890 46 894 129L894 129Q923 109 960 102L960 102Q953 0 931-34L931-34Q908-68 846-68L846-68L672-68Q600-68 576-46L576-46Q551-25 551 37L551 37L551 372L624 372L624 215Q791 269 867 319L867 319L916 264Q821 207 624 153L624 153L624 37Q624 12 634 5L634 5Q644-2 679-2L679-2Z'
                      },
                      {
                        unicode: '⾃',
                        path: 'M240 48L773 48L773 196L240 196L240 48ZM773 411L240 411L240 266L773 266L773 411ZM773 630L240 630L240 481L773 481L773 630ZM491 701L850 701L850-73L773-73L773-22L240-22L240-78L166-78L166 701L417 701Q444 781 456 838L456 838L541 827Q518 762 491 701L491 701Z'
                      },
                      {
                        unicode: '要',
                        path: 'M672 233L378 233Q345 186 311 143L311 143Q371 131 530 95L530 95Q621 147 672 233L672 233ZM193 582L193 447L343 447L343 582L193 582ZM414 727L414 643L575 643L575 727L414 727ZM812 582L646 582L646 447L812 447L812 582ZM414 447L575 447L575 582L414 582L414 447ZM943 233L753 233Q708 137 620 72L620 72Q809 23 920-19L920-19L858-77Q724-23 541 24L541 24Q390-51 93-76L93-76Q83-39 63-11L63-11Q297 3 435 52L435 52Q303 83 190 104L190 104Q237 156 292 233L292 233L57 233L57 298L336 298Q369 348 387 386L387 386L122 386L122 643L343 643L343 727L73 727L73 793L927 793L927 727L646 727L646 643L885 643L885 386L421 386L466 375Q441 329 422 298L422 298L943 298L943 233Z'
                      },
                      {
                        unicode: '⻅',
                        path: 'M181 781L816 781L816 214L738 214L738 707L257 707L257 214L181 214L181 781ZM453 614L530 614Q520 287 457 164L457 164Q369-9 93-77L93-77Q81-46 51-13L51-13Q312 46 391 201L391 201Q445 308 453 614L453 614ZM517 299L590 299L590 52Q590 30 601 23L601 23Q612 17 649 17L649 17L815 17Q851 17 861 43L861 43Q871 69 875 170L875 170Q900 151 943 140L943 140Q936 24 912-14L912-14Q888-52 821-52L821-52L643-52Q570-52 544-31L544-31Q517-10 517 51L517 51L517 299Z'
                      },
                      {
                        unicode: '说',
                        path: 'M318 661L266 608Q219 675 116 770L116 770L165 815Q279 714 318 661L318 661ZM268 127L381 207Q391 172 407 141L407 141Q197-13 179-37L179-37Q161 4 136 29L136 29Q194 68 194 121L194 121L194 452L49 452L49 524L268 524L268 127ZM457 570L457 389L795 389L795 570L457 570ZM776 7L858 7Q876 7 882 28L882 28Q888 50 889 129L889 129Q915 110 955 100L955 100Q950 3 931-30L931-30Q913-63 865-63L865-63L766-63Q712-63 693-42L693-42Q675-22 675 36L675 36L675 322L585 322Q572 163 528 79L528 79Q473-25 344-78L344-78Q325-41 299-21L299-21Q414 23 463 113L463 113Q501 185 511 322L511 322L385 322L385 637L517 637Q489 722 426 808L426 808L489 834Q557 746 583 665L583 665L519 637L687 637Q742 742 772 836L772 836L849 811Q796 692 766 637L766 637L869 637L869 322L748 322L748 37Q748 18 753 12L753 12Q758 7 776 7L776 7Z'
                      },
                      {
                        unicode: '⾛',
                        path: 'M535 219L535 24Q611 8 721 8L721 8Q806 5 959 9L959 9Q939-27 932-64L932-64L718-64Q542-64 439-24L439-24Q314 25 244 148L244 148Q188-3 94-79L94-79Q69-52 39-30L39-30Q192 88 222 384L222 384L298 374Q289 310 272 237L272 237Q331 97 460 46L460 46L460 443L66 443L66 513L460 513L460 650L152 650L152 719L460 719L460 835L535 835L535 719L859 719L859 650L535 650L535 513L933 513L933 443L535 443L535 287L867 287L867 219L535 219Z'
                      },
                      {
                        unicode: '起',
                        path: 'M817 515L817 722L532 722L532 789L889 789L889 449L614 449L614 231Q614 209 624 202L624 202Q633 196 668 196L668 196L822 196Q854 196 863 220L863 220Q872 244 875 335L875 335Q901 314 942 306L942 306Q934 199 912 164L912 164Q890 128 828 128L828 128L661 128Q592 128 567 149L567 149Q542 170 542 231L542 231L542 515L817 515ZM330 251L330 49Q407 21 554 21L554 21Q817 16 966 23L966 23Q945-11 936-51L936-51L555-51Q389-51 302-17L302-17Q205 21 152 118L152 118Q133-9 92-85L92-85Q61-64 30-49L30-49Q97 66 102 387L102 387L172 382Q170 309 166 243L166 243Q198 138 261 87L261 87L261 465L52 465L52 532L243 532L243 658L77 658L77 724L243 724L243 835L314 835L314 724L475 724L475 658L314 658L314 532L501 532L501 465L330 465L330 317L491 317L491 251L330 251Z'
                      },
                      {
                        unicode: '⾝',
                        path: 'M286 284L684 284L701 299L701 381L286 381L286 284ZM701 673L286 673L286 586L701 586L701 673ZM286 529L286 438L701 438L701 529L286 529ZM872 488L936 457Q869 360 773 272L773 272L773 29Q773-41 725-58L725-58Q682-72 523-72L523-72Q515-32 497 3L497 3Q550 1 673 1L673 1Q701 4 701 29L701 29L701 212Q462 25 91-85L91-85Q76-53 46-23L46-23Q369 61 599 219L599 219L82 219L82 284L213 284L213 739L418 739Q446 796 459 839L459 839L543 826Q512 766 496 739L496 739L773 739L773 366Q835 433 872 488L872 488Z'
                      },
                      {
                        unicode: '边',
                        path: 'M841 587L619 587Q587 225 368 87L368 87Q350 116 314 141L314 141Q514 260 543 587L543 587L343 587L343 659L548 659Q551 711 553 822L553 822L630 822Q629 739 624 659L624 659L917 659Q917 633 916 623L916 623Q897 176 855 125L855 125Q827 92 779 89L779 89Q735 85 638 90L638 90Q634 132 612 165L612 165Q671 160 749 160L749 160Q775 159 789 173L789 173Q823 209 841 587L841 587ZM299 658L238 611Q187 686 86 782L86 782L143 822Q254 719 299 658L299 658ZM250 500L250 112L282 88Q306 69 326 57L326 57Q405 7 595 7L595 7Q796 7 969 28L969 28Q947-22 946-55L946-55Q754-66 593-66L593-66Q399-66 307-10L307-10Q215 53 210 53L210 53Q176 53 84-79L84-79L29-8Q117 94 177 118L177 118L177 427L46 427L46 500L250 500Z'
                      },
                      {
                        unicode: '过',
                        path: 'M719 192L719 587L335 587L335 658L719 658L719 833L793 833L793 658L931 658L931 587L793 587L793 192Q793 124 745 109L745 109Q705 95 556 95L556 95Q551 130 530 170L530 170Q602 168 692 168L692 168Q719 169 719 192L719 192ZM382 476L441 508Q548 377 584 313L584 313L521 275Q471 368 382 476L382 476ZM291 644L230 601Q184 679 83 772L83 772L140 810Q247 712 291 644L291 644ZM264 464L264 129Q271 125 295 107L295 107Q319 90 338 78L338 78Q415 30 598 30L598 30Q777 30 961 49L961 49Q940 6 938-31L938-31Q796-41 596-41L596-41Q407-41 321 14L321 14Q228 73 225 73L225 73Q188 73 93-54L93-54L41 16Q128 110 191 134L191 134L191 394L54 394L54 464L264 464Z'
                      },
                      {
                        unicode: '还',
                        path: 'M576 68L576 476Q469 342 339 254L339 254Q320 283 283 313L283 313Q505 450 630 695L630 695L327 695L327 768L924 768L924 695L713 695Q677 623 652 585L652 585L652 68L576 68ZM676 486L728 530Q884 381 944 309L944 309L889 256Q829 333 676 486L676 486ZM299 657L238 610Q187 685 86 781L86 781L143 821Q254 718 299 657L299 657ZM250 500L250 111L282 87Q306 69 326 57L326 57Q405 7 595 7L595 7Q797 7 970 28L970 28Q948-22 947-55L947-55Q752-66 594-66L594-66Q400-66 307-10L307-10Q215 53 210 53L210 53Q176 53 84-79L84-79L29-8Q116 92 177 117L177 117L177 427L46 427L46 500L250 500Z'
                      },
                      {
                        unicode: '这',
                        path: 'M905 149L848 95Q787 156 632 284L632 284Q517 163 336 92L336 92Q315 131 292 156L292 156Q466 217 575 328L575 328Q439 434 327 512L327 512L378 555Q477 490 621 381L621 381Q697 479 738 611L738 611L297 611L297 681L592 681Q570 745 523 820L523 820L593 842Q650 755 669 700L669 700L617 681L942 681L942 611L816 611Q765 450 678 338L678 338Q836 216 905 149L905 149ZM267 641L205 596Q162 668 63 754L63 754L121 793Q219 713 267 641L267 641ZM253 463L253 104Q264 99 287 85L287 85Q315 67 331 58L331 58Q405 18 589 18L589 18Q799 18 959 37L959 37Q938-9 935-46L935-46Q779-56 586-56L586-56Q403-56 316-10L316-10Q223 40 221 40L221 40Q183 40 92-68L92-68L39 3Q119 80 181 103L181 103L181 393L53 393L53 463L253 463Z'
                      },
                      {
                        unicode: '进',
                        path: 'M554 585L554 468Q554 428 552 407L552 407L719 407L719 585L554 585ZM719 335L544 335Q517 164 403 77L403 77Q381 108 349 130L349 130Q446 203 471 335L471 335L334 335L334 407L479 407Q481 428 481 469L481 469L481 585L340 585L340 657L481 657L481 816L554 816L554 657L719 657L719 816L792 816L792 657L920 657L920 585L792 585L792 407L940 407L940 335L792 335L792 82L719 82L719 335ZM293 655L237 608Q185 685 85 776L85 776L138 816Q242 725 293 655L293 655ZM264 477L264 118Q271 114 295 96L295 96Q318 78 337 67L337 67Q413 19 598 19L598 19Q794 19 960 38L960 38Q941-10 938-39L938-39Q784-50 595-50L595-50Q408-50 320 5L320 5Q231 65 226 65L226 65Q187 65 92-62L92-62L43 5Q134 101 191 123L191 123L191 407L54 407L54 477L264 477Z'
                      },
                      {
                        unicode: '那',
                        path: 'M264 320L424 320Q426 416 426 485L426 485L281 485Q276 406 264 320L264 320ZM428 718L288 718Q286 606 283 552L283 552L427 552L428 718ZM57 787L502 787L501 745Q498 30 469-18L469-18Q446-55 403-61L403-61Q369-66 286-62L286-62Q284-21 263 16L263 16Q308 12 368 12L368 12Q391 11 401 31L401 31Q418 58 423 253L423 253L252 253Q213 46 106-76L106-76Q82-47 46-22L46-22Q139 73 179 253L179 253L62 253L62 320L191 320Q201 384 208 485L208 485L70 485L70 552L211 552Q213 608 215 718L215 718L57 718L57 787ZM894 787L946 752Q859 567 800 457L800 457Q933 339 933 218L933 218Q935 122 882 90L882 90Q852 72 813 68L813 68Q764 63 710 68L710 68Q706 109 687 138L687 138Q747 133 782 136L782 136Q810 136 832 147L832 147Q863 163 863 224L863 224Q863 332 724 447L724 447Q769 532 848 713L848 713L656 713L656-75L586-75L586 783L882 783L894 787Z'
                      },
                      {
                        unicode: '都',
                        path: 'M315 535L345 535Q398 600 432 655L432 655L315 655L315 535ZM444 214L444 311L220 311L220 214L444 214ZM220 49L444 49L444 154L220 154L220 49ZM509 801L576 782Q521 654 431 535L431 535L560 535L560 469L377 469Q325 410 282 372L282 372L515 372L515-58L444-58L444-13L220-13L220-72L151-72L151 271Q118 249 72 223L72 223Q54 253 25 284L25 284Q171 356 284 469L284 469L47 469L47 535L245 535L245 655L92 655L92 721L245 721L245 828L315 828L315 721L439 721L439 666Q473 719 509 801L509 801ZM907 783L960 748Q891 594 815 448L815 448Q947 331 947 206L947 206Q949 109 896 76L896 76Q871 58 829 53L829 53Q789 49 736 52L736 52Q734 93 714 125L714 125Q768 120 799 123L799 123Q827 125 846 135L846 135Q877 152 875 213L875 213Q875 325 739 438L739 438Q804 566 861 709L861 709L675 709L675-77L602-77L602 780L895 780L907 783Z'
                      },
                      {
                        unicode: '⾥',
                        path: 'M233 541L233 418L467 418L467 541L233 541ZM233 728L233 607L467 607L467 728L233 728ZM779 607L779 728L540 728L540 607L779 607ZM779 418L779 541L540 541L540 418L779 418ZM545 25L945 25L945-48L58-48L58 25L462 25L462 163L125 163L125 236L462 236L462 348L157 348L157 798L858 798L858 348L545 348L545 236L891 236L891 163L545 163L545 25Z'
                      },
                      {
                        unicode: '⻓',
                        path: 'M767 814L841 782Q701 618 456 499L456 499Q434 529 396 558L396 558Q634 657 767 814L767 814ZM940 374L559 374Q676 104 963 21L963 21Q935-1 911-47L911-47Q608 53 483 374L483 374L327 374L327 40L566 99Q566 59 573 29L573 29Q269-51 240-71L240-71Q229-31 210-5L210-5Q250 15 250 56L250 56L250 374L59 374L59 447L250 447L250 830L327 830L327 447L940 447L940 374Z'
                      },
                      {
                        unicode: '问',
                        path: 'M96-77L96 612L169 612L169-77L96-77ZM107 788L161 823Q272 712 310 662L310 662L255 621Q212 679 107 788L107 788ZM600 467L391 467L391 237L600 237L600 467ZM672 169L391 169L391 104L323 104L323 535L672 535L672 169ZM904 780L904 27Q904-40 862-55L862-55Q824-71 696-69L696-69Q691-33 671 4L671 4Q760 1 807 4L807 4Q831 4 831 28L831 28L831 711L356 711L356 780L904 780Z'
                      },
                      {
                        unicode: '⾯',
                        path: 'M818 45L818 505L668 505L668 45L818 45ZM179 505L179 45L321 45L321 505L179 505ZM600 395L600 505L389 505L389 395L600 395ZM389 161L389 45L600 45L600 161L389 161ZM600 222L600 334L389 334L389 222L600 222ZM941 699L531 699Q512 632 492 574L492 574L893 574L893-77L818-77L818-24L179-24L179-77L107-77L107 574L416 574Q430 623 445 699L445 699L62 699L62 770L941 770L941 699Z'
                      },
                      {
                        unicode: '⾼',
                        path: 'M637 180L352 180L352 87L637 87L637 180ZM704 236L704 31L352 31L352-18L283-18L283 236L704 236ZM902 358L902 2Q902-46 866-59L866-59Q835-70 734-68L734-68Q728-43 710-13L710-13Q732-14 811-14L811-14Q828-13 828 2L828 2L828 295L171 295L171-76L99-76L99 358L902 358ZM718 467L718 557L287 557L287 467L718 467ZM214 612L794 612L794 412L214 412L214 612ZM553 732L934 732L934 668L63 668L63 732L472 732Q462 764 441 823L441 823L513 840Q530 798 553 732L553 732Z'
                      }
                    ];
                    const font = json.data.chapterInfo.fontsConf.ttf.base64Content;
                    opentype.load(font, (err, font) => {
                      if (err) resolve();
                      const obj = {};
                      for (const i in font.glyphs.glyphs) {
                        const data = font.glyphs.glyphs[i].path.toPathData();

                        const key = lib.filter(i => i.path === data);
                        if (key) obj[font.glyphs.glyphs[i].unicode] = key[0].unicode;
                      }
                      content.content = json.data.chapterInfo.content.replace(/&#(\d+);/g, (matched, m1) => m1 in obj ? obj[m1] : matched);
                      resolve();
                    });
                  } else {
                    content.content = json.data.chapterInfo.content;
                    resolve();
                  }
                } catch (error) {
                  console.error(error);
                  resolve();
                }
              }
            }, null, 0, true);
          });
        } else {
          await new Promise((resolve, reject) => {
            xhr.add({
              chapter,
              url: chapter.url,
              method: 'GET',
              onload: function (res, request) {
                content.title = $('.j_chapterName', res.response).text();
                content.content = $('.j_readContent', res.response).html();
                resolve();
              }
            }, null, 0, true);
          });
        }
        return content;
      },
      contentReplace: [
        [/<p>\s+.<\/p>/g, '']
      ],
      chapterPrev: doc => [$('[id^="chapter-"]', doc).attr('data-purl')],
      chapterNext: doc => [$('[id^="chapter-"]', doc).attr('data-nurl')]
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
          let script = window.location.protocol + '//ciweimao.com/resources/js/enjs.min.js';
          script = await xhr.sync(script, null, { cache: true });
          unsafeWindow.eval(script.response);
        }

        const chapterId = chapter.url.split('/')[4];
        const res1 = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            method: 'POST',
            url: window.location.protocol + '//ciweimao.com/chapter/ajax_get_session_code',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            data: 'chapter_id=' + chapterId,
            responseType: 'json',
            onload: function (res) {
              resolve(res);
            }
          }, null, 0, true);
        });
        const accessKey = res1.response.chapter_access_key;

        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            method: 'POST',
            url: window.location.protocol + '//ciweimao.com/chapter/get_book_chapter_detail_info',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            data: 'chapter_id=' + chapterId + '&chapter_access_key=' + accessKey,
            // responseType: 'json',
            onload: function (res, request) {
              try {
                var json = JSON.parse(res.response);
                var i;
                /* 以下代码来自https://ciweimao.com/resources/js/myEncrytExtend-min.js */
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
                  var h = unsafeWindow.CryptoJS.format.OpenSSL.parse(f);
                  n = unsafeWindow.CryptoJS.AES.decrypt(h, unsafeWindow.CryptoJS.enc.Base64.parse(p), {
                    iv: unsafeWindow.CryptoJS.enc.Base64.parse(j),
                    format: unsafeWindow.CryptoJS.format.OpenSSL
                  });
                  if (i < k.length - 1) {
                    n = n.toString(unsafeWindow.CryptoJS.enc.Base64);
                    n = base64.decode(n);
                  }
                }
                var content = n.toString(unsafeWindow.CryptoJS.enc.Utf8);
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
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
          win.getDataUrl = async img => {
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
        elementRemove: 'i'
      }
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
            url: window.location.origin + '/index.php/Bookreader/' + $('.title a:eq(0)').attr('href').match(/\/(\d+).html/)[1] + '/' + chapter.url.match(/-(\d+).html/)[1],
            method: 'POST',
            data: 'lang=zhs',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                let content = json.Content;
                var base = 30;
                var arrStr = [];
                var arrText = content.split('\\');
                for (var i = 1, len = arrText.length; i < len; i++) {
                  arrStr.push(String.fromCharCode(parseInt(arrText[i], base)));
                }
                content = arrStr.join('');
                content = $('.bookreadercontent', content).html();
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
            url: window.location.origin + '/read/' + unsafeWindow.bid + '/' + chapter.url.match(/cid=(\d+)/)[1],
            method: 'POST',
            data: 'lang=zhs',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                let content = json.Content;
                content = $('.bookreadercontent', content).html();
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
      elementRemove: 'pirate'
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
          var urlArr = chapter.url.split('-');
          xhr.add({
            chapter,
            url: 'https://app3g.tianya.cn/webservice/web/read_chapter.jsp',
            method: 'POST',
            data: 'bookid=' + urlArr[1] + '&chapterid=' + urlArr[2],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: 'https://app3g.tianya.cn/webservice/web/proxy.html',
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                const title = json.data.curChapterName;
                const content = json.data.chapterContent;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return result;
      }
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
      content: '.menu-area'
    },
    { // http://book.zongheng.com/ http://huayu.zongheng.com/
      siteName: '纵横',
      url: /(book|huayu).zongheng.com\/showchapter\/\d+.html/,
      chapterUrl: /(book|huayu).zongheng.com\/chapter\/\d+\/\d+.html/,
      infoPage: '[class$="crumb"]>a:nth-child(3)',
      title: '.book-name',
      writer: '.au-name',
      intro: '.book-dec>p',
      cover: '.book-img>img',
      chapter: '.chapter-list a',
      vipChapter: '.chapter-list .vip>a',
      volume: () => $('.volume').toArray().map(i => i.childNodes[6]),
      chapterTitle: '.title_txtbox',
      content: '.content'
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
      elementRemove: '.copy,.qrcode'
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
      elementRemove: '[id="-2"]'
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
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                const title = json.chapter.title;
                const content = json.chapter.htmlContent;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
    },
    { // https://b.faloo.com
      siteName: '飞卢',
      url: /b.faloo.com\/f\/\d+.html/,
      chapterUrl: /b.faloo.com\/(p|vip)\/\d+\/\d+.html/,
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
          const func = $('script:contains("image_do3")', res.response).text();
          /* eslint-disable camelcase */
          if (!unsafeWindow.image_do3) {
            unsafeWindow.image_do3 = function (num, o, id, n, en, t, k, u, time, fontsize, fontcolor, chaptertype, font_family_type) {
              var type = 1;
              var domain = '//read.faloo.com/';
              if (chaptertype === 0) { domain = '//read6.faloo.com/'; }
              if (type === 2) { domain = '//read2.faloo.com/'; }
              if (typeof (font_family_type) === 'undefined' || font_family_type == null) {
                font_family_type = 0;
              }
              var url = domain + 'Page4VipImage.aspx?num=' + num + '&o=' + o + '&id=' + id + '&n=' + n + '&ct=' + chaptertype + '&en=' + en + '&t=' + t + '&font_size=' + fontsize + '&font_color=' + fontcolor + '&FontFamilyType=' + font_family_type + '&u=' + u + '&time=' + time + '&k=' + k;
              url = encodeURI(url);
              return url;
            };
          }
          /* eslint-enable camelcase */
          const image = window.eval('window.' + func); // eslint-disable-line no-eval
          const elem = $('.noveContent', res.response);
          elem.find('.con_img').replaceWith(`<img src="${image}">`);
          return elem.html();
        }
      }
    },
    { // https://www.jjwxc.net
      siteName: '晋江文学城',
      url: /www.jjwxc.net\/onebook.php\?novelid=\d+$/,
      chapterUrl: /www.jjwxc.net\/onebook.php\?novelid=\d+&chapterid=\d+/,
      title: '[itemprop="name"]',
      writer: '[itemprop="author"]',
      intro: '[itemprop="description"]',
      cover: '[itemprop="image"]',
      chapter: '[itemprop="url"][href]',
      // vipChapter: '#oneboolt>tbody>tr>td>span>div>a[id^="vip_"]',
      volume: '.volumnfont',
      chapterTitle: 'h2',
      content: '.noveltext',
      elementRemove: 'div'
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
      volume: () => $('.catalog-main>dt').toArray().map(i => i.childNodes[2]),
      chapterTitle: '.chapter-title',
      content: '.chapter-main'
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
      elementRemove: 'h2,div,style,p:has(cite)'
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
      content: '.contentBox .tempcontentBox'
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
      content: (doc, res, request) => window.eval(res.responseText.match(/var chapterContent = (".*")/)[1]) // eslint-disable-line no-eval
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
      content: '#ccon'
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
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                const title = json.data.name;
                const content = json.data.content;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
      elementRemove: 'div'
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
      elementRemove: 'p[style],p>*'
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
      elementRemove: 'div,p:last'
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
        ['.*酷.*匠.*网.*']
      ]
    },
    { // http://www.tadu.com
      siteName: '塔读文学',
      url: '://www.tadu.com/book/catalogue/\\d+',
      chapterUrl: '://www.tadu.com/book/\\d+/\\d+/',
      infoPage: () => `http://www.tadu.com/book/${window.location.href.match(/\d+/)[0]}`,
      title: '.bkNm',
      writer: '.bookNm>a:nth-child(2)',
      intro: '.datum+p',
      cover: (doc) => $('.bookImg>img', doc).attr('data-src').replace(/_a\.jpg$/, '.jpg'),
      chapter: '.chapter>a',
      vipChapter: '.chapter>a:has(.vip)',
      chapterTitle: 'h2',
      content: async (doc, res, request) => {
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter: request.raw,
            url: res.responseText.match(/id="bookPartResourceUrl" value="(.*?)"/)[1],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: request.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const content = res.responseText.match(/\{content:'(.*)'\}/)[1];
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
            url: window.location.protocol + '//yuedu.163.com/getArticleContent.do?sourceUuid=' + urlArr[4] + '&articleUuid=' + urlArr[5],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                let content = json.content;
                content = base64.decode(content);
                content = base64.utf8to16(content);
                const title = $('h1', content).text();
                resolve({ content, title });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
      deal: async (chapter) => Rule.special.find(i => i.siteName === '网易云阅读').deal(chapter)
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
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                const title = json.data.chapter_name;
                const content = json.data.chapter_content;
                Storage.book.title = json.data.book_name;
                Storage.book.writer = json.data.author_name;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
      content: '.content'
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
      content: '.article'
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
      content: '#chapter-content-str'
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
            url: window.location.protocol + '//www.hongshu.com/bookajax.do',
            method: 'POST',
            data: 'method=getchptkey&bid=' + urlArr[6] + '&cid=' + urlArr[8],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                resolve(json);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: window.location.protocol + '//www.hongshu.com/bookajax.do',
            method: 'POST',
            data: 'method=getchpcontent&bid=' + urlArr[6] + '&jid=' + urlArr[7] + '&cid=' + urlArr[8],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                const title = json.chptitle;
                let content = json.content;
                content = unsafeWindow.utf8to16(unsafeWindow.hs_decrypt(unsafeWindow.base64decode(content), res1.key));
                // const other = unsafeWindow.utf8to16(unsafeWindow.hs_decrypt(unsafeWindow.base64decode(json.other), res1.key)); // 标点符号及常用字使用js生成的stylesheet显示
                resolve({ title, content });
              } catch (error) {
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
            url: 'http://script.qwsy.com/html/js/' + chapter.url.replace('http://www.qwsy.com/read.aspx?cid=', '') + '.js',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const content = res.responseText.match(/document.write\("(.*)"\);/)[1];
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      },
      elementRemove: 'font,br'
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
        [/作者.*?提醒.*/, '']
      ]
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
      elementRemove: 'div'
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
      content: '[itemprop="acticleBody"]'
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
      content: '#mouseRight'
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
        ['微信公众号：.*']
      ]
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
        var info = chapter.url.match(/\d+/g);
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: 'https://www.chuangbie.com/book/load_chapter_content?book_id=' + info[0] + '&chapter_id=' + info[1],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = unsafeWindow.strdecode(res.response);
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
            }
          }, null, 0, true);
        });
        return content;
      }
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
      elementRemove: 'p:contains("www.msxf.cn")'
    },
    { // https://www.lajixs.com/
      siteName: '辣鸡小说',
      url: 'https://www.lajixs.com/book/\\d+',
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
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                const title = json.data.chapterInfo.bookTitle;
                const content = json.data.chapterInfo.chapterContent;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      },
      elementRemove: 'lg'
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
      deal: (chapter) => Rule.special.find(i => i.siteName === 'PO18臉紅心跳').deal(chapter),
      getChapters: (doc) => Rule.special.find(i => i.siteName === 'PO18臉紅心跳').getChapters(doc)
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
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                resolve(res.response);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
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
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        return $('<div>').html(res.response).find('a').toArray().map(i => ({
          title: $(i).text(),
          url: $(i).prop('href')
        }));
      }
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
      content: '.box-text dd'
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
      content: '.article-text'
    },
    { // https://www.gongzicp.com/
      siteName: '长佩文学网',
      url: '://www.gongzicp.com/novel-\\d+.html',
      chapterUrl: '://www.gongzicp.com/read-\\d+.html',
      title: '.cp-novel-name',
      intro: '.cp-novel-desc',
      cover: '.cp-novel-cover>img',
      chapter: '.cp-novel-menu-item>a',
      vipChapter: '.cp-novel-menu-item>a:has(.icon-vip)',
      chapterTitle: '.cp-read-name',
      content: (doc, res, request) => window.eval(res.response.match(/content: (".*"),/)[1]), // eslint-disable-line no-eval
      elementRemove: '.cp-hidden',
      thread: 1
    },
    { // https://sosad.fun/
      siteName: 'SosadFun',
      url: '://sosad.fun/threads/\\d+/(profile|chapter_index)',
      chapterUrl: '://sosad.fun/posts/\\d+',
      title: '.font-1',
      writer: '.h5 a[href*="/users/"]',
      intro: '.article-body .main-text',
      chapter: '.panel-body .table th:nth-child(1)>a[href*="/posts/"]',
      chapterTitle: 'strong.h3',
      content: '.post-body>.main-text:nth-child(1)',
      elementRemove: 'div:last-child',
    },
    { // https://www.myhtlmebook.com/
      siteName: '海棠文化线上文学城',
      url: 'myhtlmebook.com/\\?act=showinfo&bookwritercode=.*?&bookid=',
      chapterUrl: 'myhtlmebook.com/\\?act=showpaper&paperid=',
      title: '#mypages .uk-card h4',
      writer: '#writerinfos>a',
      chapter: '.uk-list>li>a[href^="/?act=showpaper&paperid="]',
      vipChapter: '.uk-list>li:not(:contains("免費"))>a[href^="/?act=showpaper&paperid="]',
      chapterTitle: '.uk-card-title',
      content: async (doc, res, request) => {
        const content = await new Promise((resolve, reject) => {
          const [, paperid, vercodechk] = res.responseText.match(/data: { paperid: '(\d+)', vercodechk: '(.*?)'},/);
          xhr.add({
            chapter: request.raw,
            url: '/showpapercolor.php',
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: request.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            data: `paperid=${paperid}&vercodechk=${vercodechk}`,
            onload: function (res, request) {
              try {
                const content = res.responseText;
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
        const token = $(res.response).toArray().find(i => i.tagName === 'META' && i.name === 'csrf-token').content; // same as XSRF-TOKEN<cookie>
        const content = await new Promise((resolve, reject) => {
          xhr.add({
            chapter,
            url: `https://www.doufu.la/novel/getChapter/${chapter.url.split('/')[4]}`,
            method: 'POST',
            headers: {
              Referer: chapter.url,
              'x-csrf-token': token
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                const content = json.content;
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      },
      elementRemove: '.hidden',
      thread: 1
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
      content: '#content'
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
      content: '#ChapterBody'
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
      content: '#chapter_content'
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
      content: '.read-content'
    },
    { // https://www.esjzone.cc/
      siteName: 'ESJ Zone',
      url: '://www.esjzone.cc/detail/\\d+.html',
      chapterUrl: '://www.esjzone.cc/forum/\\d+/\\d+.html',
      title: 'h2',
      writer: '.book-detail a[href^="/tags/"]',
      intro: '.description',
      cover: '.product-gallery img',
      chapter: '#chapterList a',
      chapterTitle: 'h2',
      content: '.forum-content'
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
      content: '.forum-content'
    },
    { // http://www.shencou.com/
      siteName: '神凑小说网',
      url: 'http://www.shencou.com/read/\\d+/\\d+/index.html',
      chapterUrl: 'http://www.shencou.com/read/\\d+/\\d+/\\d+.html',
      infoPage: '[href*="books/read_"]',
      title: 'span>a',
      writer: '#content td:contains("小说作者"):nochild',
      intro: '[width="80%"]:last',
      cover: 'img[src*="www.shencou.com/files"]',
      chapter: '.zjlist4 a',
      volume: '.ttname>h2',
      chapterTitle: '>h1',
      content: 'body',
      elementRemove: 'div,script,center'
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
        [/pic.wenku8.com/g, 'picture.wenku8.com']
      ]
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
      content: '.content'
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
        const contentRaw = $('#article-main-contents', res.response).html();
        const content = contentRaw.replace(/^(<br>)+/, '').split(/<div.*?>.*?<\/div>|(<br>\s*){3,}/).map(i => i && i.replace(/^(\s*|<br>)+/, '')).filter(i => i);
        Storage.book.chapters.splice(Storage.book.chapters.indexOf(request.raw), 1, ...content.map((item, index) => ({
          title: `${request.raw.title} - 第${String(index + 1)}部分`,
          url: request.raw.url,
          content: item,
          contentRaw: item,
          document: res.response
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
      getChapters: () => {
        return window.__NUXT__.data[0].series.articles.sort((a, b) => a.aid - b.aid).map(i => ({ title: i.title, url: `https://www.lightnovel.us/detail/${i.aid}` }));
      },
      chapterTitle: '.article-title',
      content: (doc, res, request) => Rule.special.find(i => i.siteName === '轻之国度').content(doc, res, request),
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
      content: '#novel_honbun'
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
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              resolve(res.response);
            }
          }, null, 0, true);
        });
        return content;
      }
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
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response);
                const title = json.data.chapter.name;
                const content = json.data.chapter.content;
                resolve({ title, content });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
      elementRemove: 'div'
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
        ['(请记|請記)住本站域名.*']
      ]
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
      elementRemove: 'fieldset,table,div'
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
      content: '.note'
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
      content: '.article-story'
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
      elementRemove: 'div'
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
        [/--&gt;&gt;本章未完，点击下一页继续阅读/]
      ]
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
      content: '.articleCon>p:nth-child(3)'
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
      content: '#txt'
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
        const doc1 = new window.DOMParser().parseFromString(res.response, 'text/html');
        const order = window.atob(doc1.getElementsByTagName('meta')[7].getAttribute('content')).split(/[A-Z]+%/);
        const codeurl = res.response.match(/var codeurl="(\d+)";/)[1] * 1;
        const arrRaw = $('#content', doc1).children().toArray();
        const arr = [];
        for (let i = 0; i < order.length; i++) {
          const truth = order[i] - ((i + 1) % codeurl);
          arr[truth] = arrRaw[i];
        }
        return arr.map(i => i.textContent);
      },
      chapterNext: '.chapterPages>a.curr~a,.p3>a'
    },
    // 18X
    { // http://www.6mxs.com/ http://www.baxianxs.com/ http://www.iqqxs.com/
      siteName: '流氓小说网',
      // url: [/6mxs.com\/novel.asp\?id=\d+/, '://www.baxianxs.com/xiaoshuo.asp\\?id=\\d+'],
      // chapterUrl: [/6mxs.com\/pages.asp\?id=\d+/, '://www.baxianxs.com/page.asp\\?id=\\d+'],
      filter: () => $('.viewxia').length ? ($('.content').length ? 2 : 1) : 0,
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
        ['{zuo}', '坐']
      ]
    },
    { // http://www.22lewen.com/
      siteName: '乐文小说网',
      url: '://www.\\d+lewen.com/read/\\d+(/0)?.html',
      chapterUrl: '://www.\\d+lewen.com/read/\\d+/\\d+(_\\d+)?.html',
      title: '.book-title>h1',
      chapter: '.chapterlist>dd>a',
      chapterTitle: '#BookCon>h1',
      content: '#BookText'
    },
    { // http://www.shubao202.com/index.php http://lawen24.com/
      siteName: '书包网',
      url: ['://www.shubao202.com/book/\\d+', '://lawen24.com/txtbook/\\d+.html'],
      chapterUrl: ['://www.shubao202.com/read/\\d+/\\d+', '://lawen24.com/read/\\d+/\\d+'],
      title: 'h1',
      chapter: '.mulu a',
      chapterTitle: 'h1',
      content: '.mcc'
    },
    { // https://www.cool18.com/bbs4/index.php
      siteName: '禁忌书屋',
      filter: () => ['www.cool18.com'].includes(window.location.host) ? ($('#myform').length ? 2 : 1) : 0,
      chapterUrl: '://www.cool18.com/bbs4/index.php\\?app=forum&act=threadview&tid=\\d+',
      title: 'font>b',
      chapter: 'a:not(:contains("(无内容)"))',
      chapterTitle: 'font>b',
      content: '.show_content>pre',
      chapterPrev: '.show_content>p>a',
      chapterNext: 'body>table td>p:first+ul a:not(:contains("(无内容)")),.show_content>pre a',
      elementRemove: 'font[color*="E6E6DD"],b:contains("评分完成")'
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
        ['登陆7z小说网.*']
      ]
    },
    { // http://www.qdxiaoshuo.net/
      siteName: '青豆小说网',
      url: '://www.qdxiaoshuo.net/book/\\d+.html',
      chapterUrl: '://www.qdxiaoshuo.net/read/\\d+/\\d+.html',
      title: '.kui-left.kui-fs32',
      chapter: '.kui-item>a',
      chapterTitle: 'h1.kui-ac',
      content: '#kui-page-read-txt'
    },
    { // https://www.shushuwu8.com/
      siteName: '书书屋',
      url: '://www.shushuwu8.com/novel/\\d+/$',
      chapterUrl: '://www.shushuwu8.com/novel/\\d+/\\d+.html',
      title: '.ml_title>h1',
      writer: '.ml_title>h1+span',
      chapter: '.ml_main>dl>dd>a',
      chapterTitle: 'h2',
      content: '.yd_text2'
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
      content: '#content'
    },
    { // http://www.4shubao.com/
      siteName: '4书包',
      url: '://www.4shubao.com/read/\\d+.html',
      chapterUrl: '://www.4shubao.com/read/\\d+/\\d+.html',
      title: 'h1',
      chapter: '.chapterlist a',
      chapterTitle: 'h1',
      content: '#BookText'
    },
    { // http://www.xitxt.net
      siteName: '喜书网',
      url: '://www.xitxt.net/book/\\d+.html',
      chapterUrl: '://www.xitxt.net/read/\\d+_\\d+.html',
      title: 'h1',
      chapter: '.list a',
      chapterTitle: 'h1',
      content: '.chapter',
      elementRemove: 'font'
    },
    { // http://www.shenshuw.com
      siteName: '神书网',
      url: '://www.shenshu.info/s\\d+/',
      chapterUrl: '://www.shenshu.info/s\\d+/\\d+.html',
      title: 'h1',
      chapter: '#chapterlist a',
      chapterTitle: 'h1',
      content: '#book_text'
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
      elementRemove: 'div'
    },
    { // https://www.dzwx520.com/
      siteName: '大众小说网',
      url: '://www.dzwx520.com/book_\\d+/$',
      chapterUrl: '://www.dzwx520.com/book_\\d+/\\d+.html',
      title: 'h1',
      chapter: '.book_list a',
      chapterTitle: 'h1',
      content: '#htmlContent',
      elementRemove: 'script,div'
    },
    { // http://www.mlxiaoshuo.com
      siteName: '魔龙小说网',
      url: '://www.mlxiaoshuo.com/book/.*?.html',
      chapterUrl: '://www.mlxiaoshuo.com/chapter/.*?.html',
      title: '.colorStyleTitle',
      chapter: '.zhangjieUl a',
      chapterTitle: '.colorStyleTitle',
      content: '.textP'
    },
    { // https://www.123xiaoqiang.in/
      siteName: '小强小说网',
      url: '://www.123xiaoqiang.in/\\d+/\\d+/',
      chapterUrl: '://www.123xiaoqiang.in/\\d+/\\d+/\\d+.html',
      title: 'h1',
      chapter: '.liebiao a',
      chapterTitle: 'h2',
      content: '#content'
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
      elementRemove: 'div,span,font'
    },
    { // http://www.huaisu8.com
      siteName: '怀素吧小说',
      url: '://www.huaisu8.com/\\d+/\\d+/($|#)',
      chapterUrl: '://www.huaisu8.com/\\d+/\\d+/\\d+.html',
      title: '.info>h2',
      chapter: '.index-body .newzjlist:nth-child(4) .dirlist a',
      chapterTitle: '.play-title>h1',
      content: '.txt_tcontent'
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
            url: window.location.protocol + '//xxread.net/getArticleContent.php?sourceUuid=' + info[0] + '&articleUuid=' + info[1],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const json = JSON.parse(res.response.match(/(\{.*\})/)[1]);
                let content = json.content;
                content = base64.decode(content);
                content = base64.utf8to16(content);
                const title = $('h1', content).text();
                resolve({ content, title });
              } catch (error) {
                console.error(error);
                resolve('');
              }
            },
            checkLoad: () => true
          }, null, 0, true);
        });
        return content;
      },
      elementRemove: 'h1',
      getChapters: async (doc) => {
        const info = window.location.href.match(/\d+/g);
        const res = await xhr.sync(`https://xxread.net/getBook.php?b=${info[0]}`);
        const json = JSON.parse(res.response);
        const chapters = [];
        for (let i = 1; i < json.portions.length; i++) {
          chapters.push({
            title: json.portions[i].title,
            url: `https://xxread.net/book_reader.php?b=${info[0]}&c=${json.portions[i].id}`
          });
        }
        return chapters;
      }
    },
    { // https://18h.mm-cg.com/novel/index.htm
      siteName: '18H',
      filter: () => $('meta[content*="18AV"],meta[content*="18av"]').length ? (window.location.href.match(/novel_\d+.html/) ? 2 : 1) : 0,
      title: '.label>div',
      chapter: '.novel_leftright>span>a:visible',
      chapterTitle: 'h1',
      content: '#novel_content_txtsize'
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
      content: '#story-text'
    },
    { // https://aastory.space/
      siteName: '疯情书库',
      filter: () => document.title.match('疯情书库') && ['/archive.php', '/read.php'].includes(window.location.pathname) ? (['/archive.php'].includes(window.location.pathname) ? 1 : 2) : 0,
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
            url: window.location.origin + '/_getcontent.php?id=' + request.url.match(/id=(\d+)/)[1] + '&v=' + res.responseText.match(/chapid\+"&v=(.*?)"/)[1],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: request.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const content = res.responseText;
                resolve(content);
              } catch (error) {
                console.error(error);
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      }
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
            url: window.location.origin + '/_getcontent.php?id=' + urlArr[5],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              Referer: chapter.url,
              'X-Requested-With': 'XMLHttpRequest'
            },
            onload: function (res, request) {
              try {
                const content = res.responseText;
                resolve(content);
              } catch (error) {
                resolve('');
              }
            }
          }, null, 0, true);
        });
        return content;
      },
      chapterPrev: doc => [$('[id^="chapter-"]', doc).attr('data-purl')],
      chapterNext: doc => [$('[id^="chapter-"]', doc).attr('data-nurl')]
    }
  ];
  Rule.template = [ // 模板网站
    { // http://www.xbiquge.la/54/54439/
      siteName: '模板网站-笔趣阁',
      filter: () => ['.ywtop', '.nav', '.header_logo', '#wrapper', '.header_search'].every(i => $(i).length) ? ($('#content').length ? 2 : 1) : 0,
      title: '#info>h1',
      writer: '#info>h1+p',
      intro: '#intro',
      cover: '#fmimg>img',
      chapter: '#list>dl>dd>a',
      chapterTitle: 'h1',
      content: '#content',
      elementRemove: 'a,p:empty,script'
    },
    { // https://www.biqukan.com/57_57242/
      siteName: '模板网站-笔趣阁1',
      filter: () => ['body>.ywtop', 'body>.header', 'body>.nav', 'body>.book', 'body>.listmain,body>.book.reader'].every(i => $(i).length) ? ($('#content').length ? 2 : 1) : 0,
      title: '.info>h2',
      writer: '.info>h2+div>span:nth-child(1)',
      intro: '.intro',
      cover: '.cover>img',
      chapter: '.listmain>dl>dd+dt~dd>a',
      chapterTitle: 'h1',
      content: '#content',
      elementRemove: 'a,p:empty,script'
    },
    { // https://www.x23qb.com/book/775/
      siteName: '模板网站-铅笔小说',
      filter: () => ['#header .wrap980', '.search span.searchBox', '.tabstit', '.coverecom'].every(i => $(i).length) ? 1 : 0,
      title: '.d_title>h1',
      writer: '.p_author>a',
      intro: '#bookintro>p',
      cover: '#bookimg>img',
      chapter: '#chapterList>li>a',
      chapterTitle: 'h1',
      content: '.read-content',
      elementRemove: 'dt,div'
    }
  ];
  /* eslint-enable comma-dangle  */

  if (Config.customize) {
    try {
      const ruleUser = window.eval(Config.customize); // eslint-disable-line no-eval
      Rule.special = Rule.special.concat(ruleUser);
    } catch (error) {
      console.error(error);
    }
  }

  function init () {
    if (!Storage.rule) {
      if (Config.templateRule) Rule.special = Rule.special.concat(Rule.template);
      const _href = window.location.href;
      for (const rule of Rule.special) {
        rule.url = [].concat(rule.url).filter(i => i);
        rule.chapterUrl = [].concat(rule.chapterUrl).filter(i => i);
        rule.ignoreUrl = [].concat(rule.ignoreUrl).filter(i => i);
      }
      Storage.rule = Rule.special.find(i => (i.url.some(j => _href.match(j))) || (i.chapterUrl.some(j => _href.match(j))) || (i.filter && i.filter()));
      if (Storage.rule) {
        if (Storage.rule.url.some(i => _href.match(i))) {
          Storage.mode = 1;
        } else if (Storage.rule.chapterUrl.some(i => _href.match(i))) {
          Storage.mode = 2;
        } else if (Storage.rule.filter && typeof Storage.rule.filter === 'function') {
          Storage.mode = Storage.rule.filter();
        }
      } else {
        Storage.rule = Rule;
        if (Config.modeManual) {
          Storage.mode = window.confirm('请问这是目录页面还是章节页面？\n目录页面选择“确定”，章节页面选择“取消”') ? 1 : 2;
        } else if (Storage.rule.url.some(i => _href.match(i))) {
          Storage.mode = 1;
        } else if (Storage.rule.chapterUrl.some(i => _href.match(i))) {
          Storage.mode = 2;
        } else {
          Storage.mode = $(Storage.rule.content).length ? 2 : 1;
        }
      }
    }
    if ($('.novel-downloader-v3').length) {
      $('.novel-downloader-v3').toggle();
      if ($('.novel-downloader-style-chapter[media]').length) { // https://stackoverflow.com/a/54441305
        $('.novel-downloader-style-chapter[media]').attr('media', null);
      } else {
        $('.novel-downloader-style-chapter').attr('media', 'max-width: 1px');
      }
    } else {
      showUI();
    }
  }

  async function showUI () {
    let chapters, chaptersArr;
    let vipChapters = [];
    const chaptersDownloaded = [];

    // ui
    const html = [
      '<div name="info">',
      '  当前规则: <span name="rule"></span><span name="mode"></span><sup><a href="https://github.com/dodying/UserJs/issues/new" target="_blank">反馈</a></sup><sup><a href="https://github.com/dodying/UserJs#捐赠" target="_blank">捐赠</a></sup>',
      '  <br>',
      '  书籍名称: <input type="text" name="title" value="加载中，请稍候">',
      '  <br>',
      '  书籍作者: <input type="text" name="writer">',
      '  <br>',
      '  书籍简介: <input type="text" name="intro">',
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
      '  <input type="checkbox" name="modeManual">手动确认目录或章节',
      '  <br>',
      '  <input type="checkbox" name="templateRule">使用模板规则',
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
      '  连续下载失败 <input type="number" name="failedCount" min="1"> 次时，暂停 <input type="number" name="failedWait" min="0" title="0为手动继续"> 秒后继续下载',
      '  <br>',
      '  Epub CSS: <textarea name="css" placeholder="" style="line-height:1;resize:both;"></textarea>',
      '  <br>',
      '  自定义规则: <textarea name="customize" placeholder="" style="line-height:1;resize:both;"></textarea>',
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
      '</div>'
    ].join('');
    const container = $('<div class="novel-downloader-v3"></div>').html(html).appendTo('body');
    container.find('input,select,textarea').attr('disabled', 'disabled');
    container.find('[name="config"]').find('input,select,textarea').on('change', function (e) {
      const name = e.target.name;
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
        focus: () => Storage.audio.pause()
      });
      Storage.title = document.title;

      Storage.book.chapters = Config.vip ? chapters : chapters.filter(i => !(vipChapters.includes(i.url)));
      Storage.rule.vip = Object.assign({}, Storage.rule, Storage.rule.vip || {});

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
        Storage.book.chapters = Storage.book.chapters.filter(i => {
          if (i.filtered) {
            delete i.filtered;
            return true;
          }
        });
      }
      if (container.find('[name="limit"]>[name="batch"]').val()) {
        Storage.book.chapters = container.find('[name="limit"]>[name="batch"]').val().split('\n').filter(i => i).map(i => {
          const url = new URL(i, window.location.href).href;
          return chaptersDownloaded.find(i => i.url === url) || { url };
        });
      }
      chaptersArr = Storage.book.chapters.map(i => i.url);

      const format = $(e.target).attr('format');
      const onComplete = async (force) => {
        if (!force) {
          container.find('[name="buttons"]').find('[name="force-save"]').attr('disabled', 'disabled').off('click');
          container.find('[name="buttons"]').find('[name="force-download"]').attr('disabled', 'disabled');
        }

        let chapters = Storage.book.chapters;
        if (Config.sort && chapters.length) {
          const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'case' });
          chapters.forEach(i => { i.sort = i.url; });
          // const dir = new URL('./', chapters[0].sort).href;
          // if (chapters.every(i => new URL('./', i.sort).href === dir)) {
          //   chapters.forEach(i => { i.sort = i.sort.substr(dir.length); });
          // }
          let ext = chapters[0].sort.split('.');
          if (ext.length > 1) {
            ext = '.' + ext.slice(-1);
            const extReversed = ext.split('').reverse().join('');
            if (chapters.every(i => i.sort.split('').reverse().join('').indexOf(extReversed) === 0)) {
              chapters.forEach(i => { i.sort = i.sort.substr(0, i.sort.length - ext.length); });
            }
          }
          chapters = chapters.sort((a, b) => collator.compare(a.sort, b.sort));
        }

        const volumes = [];
        for (let i = 0; i < chapters.length; i++) {
          const chapter = chapters[i];

          if (i > 0 && chapters[i - 1].volume !== chapters[i].volume) {
            const title = `【${chapters[i - 1].volume}】-分卷-结束`;
            chapters.splice(i, 0, {
              title,
              contentRaw: title,
              content: title,
              volume: chapters[i - 1].volume
            });
            i++;
          }

          if (chapter.volume && chapter.volume !== volumes.slice(-1)[0]) {
            volumes.push(chapter.volume);
            const title = `【${chapter.volume}】-分卷-开始`;
            chapters.splice(i, 0, {
              title,
              contentRaw: title,
              content: title,
              volume: chapter.volume
            });
            i++;
          }

          const rule = vipChapters.includes(chapter.url) ? Storage.rule.vip : Storage.rule;
          let content = chapter.contentRaw;
          if (!content) continue;
          if (rule.elementRemove || Config.useCommon) {
            if (Storage.debug.content) debugger;
            content = await getFromRule(content, (content) => {
              const elem = $('<div>').html(content);
              if (rule.elementRemove) {
                $(rule.elementRemove, elem).remove();
              } else if (Config.useCommon) {
                $(Rule.elementRemove, elem).remove();
              }
              return elem.html();
            }, [], '');
          }

          if (Config.format) {
            content = html2Text(content, rule.contentReplace);
            if (['text', 'zip'].includes(format)) content = $('<div>').html(content).text();
            content = content.replace(/^[\u{0009}\u{0020}\u{00A0}\u{1680}\u{2000}-\u{200A}\u{202F}\u{205F}\u{3000}]+/gmu, ''); // 移除开头空白字符
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
      const onChapterFailedEvery = async (res, request, type) => {
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
      };
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

        let chapterRelative = await getFromRule(ruleChapterRelative, { attr: 'href', allElement: true, document: res.response }, [res, request], []);
        chapterRelative = [].concat(chapterRelative).map(i => new URL(i, res.finalUrl || window.location.href).href)
          .filter(url => url && !url.match(/^(javascript:|#)/)).map(i => new URL(i, chapter.url).href)
          .filter(url => {
            if (rule !== Rule && rule.ignoreUrl.some(i => url.match(i))) return false;
            if (rule !== Rule && rule.url.some(i => url.match(i))) return false;
            if (rule !== Rule && rule.chapterUrl.length) return rule.chapterUrl.some(i => url.match(i));
            const pathurl = chapter.url.replace(/(.*\/).*/, '$1').replace(/.*?:\/\/(.*)/, '$1');
            const pathurlThis = url.replace(/(.*\/).*/, '$1');
            return pathurlThis !== url && pathurlThis.replace(/.*?:\/\/(.*)/, '$1') === pathurl;
          });
        let anchor = chapter;
        for (const url of chapterRelative) {
          if (chaptersArr.includes(url) || vipChapters.includes(url)) continue;
          const chapterNew = chaptersDownloaded.find(i => i.url === url) || { url };
          if (chapter.volume) chapterNew.volume = chapter.volume;
          const index = Storage.book.chapters.indexOf(anchor);
          anchor = chapterNew;
          Storage.book.chapters.splice(next ? index + 1 : index, 0, chapterNew);
          chaptersArr.splice(next ? index + 1 : index, 0, url);

          const rule = vipChapters.includes(url) ? Storage.rule.vip : Storage.rule;

          if (chapterNew.contentRaw && chapterNew.document) {
            await onChapterLoad({ response: chapterNew.document }, { raw: chapterNew });
          } else {
            delete chapterNew.contentRaw;
            if (rule.iframe) {
              chapterList.iframe.push(chapterNew);
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

        const doc = typeof res.response === 'string' ? new window.DOMParser().parseFromString(res.response, 'text/html') : res.response;

        if (!chaptersDownloaded.includes(chapter)) chaptersDownloaded.push(chapter);

        let chapterTitle = await getFromRule(rule.chapterTitle, { attr: 'text', document: doc }, [res, request], '');
        chapterTitle = chapterTitle || chapter.title || $('title', doc).eq(0).text();
        if (chapterTitle.indexOf(Storage.book.title) === 0) chapterTitle = chapterTitle.replace(Storage.book.title, '').trim();
        chapter.title = chapterTitle;
        request.title = chapter.title;

        let contentCheck = true;
        if (rule.contentCheck) contentCheck = await getFromRule(rule.contentCheck, (selector) => $(selector, doc).length, [res, request], true);
        if (contentCheck) {
          if (Storage.debug.content) debugger;
          let content = await getFromRule(rule.content, (selector) => {
            let elems = $(selector, doc);
            if (Storage.debug.content) debugger;
            if (rule === Rule) elems = elems.not(':emptyHuman'); // 移除空元素
            if (elems.length === 0) { // 没有找到内容
              console.error('novelDownloader: 找不到内容元素\n选择器: ' + selector);
              elems = $('body', doc);
            } else if (elems.length > 1) {
              // 当a是b的祖辈元素时，移除a
              elems = elems.filter((i, e) => !elems.not(e).toArray().find(j => $(e).find(j).length));
            }
            return elems.toArray().map(i => $(i).html());
          }, [res, request], '');
          if (content instanceof Array) content = content.join('\n');
          chapter.content = content;
          chapter.contentRaw = content;
          chapter.document = res.response;

          if (Config.addChapterPrev || Config.addChapterNext) {
            if (Config.addChapterPrev) await checkRelativeChapter(res, request, false);
            if (Config.addChapterNext) await checkRelativeChapter(res, request, true);
          }
        } else {
          chapter.contentRaw = '';
        }

        const now = Storage.book.chapters.filter(i => i.contentRaw).length;
        const max = Storage.book.chapters.length;
        container.find('[name="progress"]>progress').val(now).attr('max', max);
        document.title = `[${now}/${max}]${Storage.title}`;
      };
      const requestOption = { onload: onChapterLoad, overrideMimeType };

      const chapterList = {
        iframe: [],
        deal: [],
        download: []
      };
      for (const chapter of Storage.book.chapters) {
        const rule = vipChapters.includes(chapter.url) ? Storage.rule.vip : Storage.rule;
        if (chapter.contentRaw && chapter.document) {
          await onChapterLoad({ response: chapter.document }, { raw: chapter });
        } else {
          delete chapter.contentRaw;
          if (rule.iframe) {
            chapterList.iframe.push(chapter);
          } else if (rule.deal && typeof rule.deal === 'function') {
            chapterList.deal.push(chapter);
          } else {
            chapterList.download.push(chapter);
          }
        }
      }
      if (Storage.book.chapters.every(i => i.contentRaw && i.document)) {
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
            if ((res.status > 0 && res.status < 200) || res.status >= 300 || (res.responseText && res.responseText.match(/404/) && res.responseText.match(/Not Found|找不到文件或目录/i))) {
              return false;
            } else {
              return true;
            }
          }
        });
      }

      while (Storage.book.chapters.some(i => !('contentRaw' in i))) {
        if (chapterList.download.length && chapterList.download.find(i => !('contentRaw' in i))) {
          await new Promise((resolve, reject) => {
            xhr.storage.config.set('onComplete', async (list) => {
              resolve();
            });
            xhr.list(chapterList.download.filter(i => !('contentRaw' in i)), requestOption);
            xhr.showDialog();
            xhr.start();
          });
        }

        if (chapterList.deal.length && chapterList.deal.find(i => !('contentRaw' in i))) {
          await new Promise((resolve, reject) => {
            xhr.storage.config.set('onComplete', async (list) => {
              if (chapterList.deal.find(i => !('contentRaw' in i))) return;
              resolve();
            });
            for (const chapter of chapterList.deal.filter(i => !('contentRaw' in i))) {
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
                  const now = Storage.book.chapters.filter(i => i.contentRaw).length;
                  const max = Storage.book.chapters.length;
                  container.find('[name="progress"]>progress').val(now).attr('max', max);
                  document.title = `[${now}/${max}]${Storage.title}`;
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

        if (chapterList.iframe.length && chapterList.iframe.find(i => !('contentRaw' in i))) {
          for (const chapter of chapterList.iframe.filter(i => !('contentRaw' in i))) {
            const rule = vipChapters.includes(chapter.url) ? Storage.rule.vip : Storage.rule;
            await new Promise((resolve, reject) => {
              $('<iframe>').on('load', async (e) => { // TODO 优化
                let response;
                try {
                  if (typeof rule.iframe === 'function') await rule.iframe(e.target.contentWindow);
                  response = e.target.contentWindow.document;
                } catch (error) {
                  console.error(error);
                  response = '';
                }
                await onChapterLoad({ response }, { raw: chapter });
                $(e.target).remove();
                resolve();
              }).attr('src', chapter.url).css('visibility', 'hidden').appendTo('body');
            });
          }
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
    container.find('[name="info"]>input[type="text"]').on('change', e => (Storage.book[$(e.target).attr('name')] = e.target.value));

    // style
    const style = [
      '.novel-downloader-v3>div *,.novel-downloader-v3>div *:before,.novel-downloader-v3>div *:after{margin:1px;}',
      '.novel-downloader-v3 input{border:1px solid #000;opacity: 1;}',
      '.novel-downloader-v3 input[type="checkbox"]{position:relative;top:0;opacity:1;}',
      '.novel-downloader-v3 input[type="button"],.novel-downloader-v3 button{border:1px solid #000;cursor:pointer;padding:2px 3px;}',
      '.novel-downloader-v3 input[type=number]{width:36px;}',
      '.novel-downloader-v3 input[type=number]{width:36px;}',
      '.novel-downloader-v3 [disabled="disabled"]{color:#545454;cursor:default!important;background-color:#ebebe4;}',
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
      '[novel-downloader-chapter="vip"]:before{color:red!important;}'
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
        infoPage = new window.DOMParser().parseFromString(res.response, 'text/html');
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
    if (Storage.rule.elementRemove || Config.useCommon) {
      if (Storage.rule.elementRemove) {
        $(Storage.rule.elementRemove, intro).remove();
      } else if (Config.useCommon) {
        $(Rule.elementRemove, intro).remove();
      }
    }
    intro = intro.text();
    Storage.book.intro = intro;
    Storage.book.cover = await getFromRule(Storage.rule.cover, { attr: 'src', document: infoPage || document }, [], '');
    for (const i of ['title', 'writer', 'intro', 'cover']) {
      container.find(`[name="info"]>[name="${i}"]`).val(Storage.book[i] || '');
    }

    if (Storage.mode === 1) {
      container.find('[name="info"]>[name="mode"]').text('目录模式');
      const styleChapter = [
        '[novel-downloader-chapter]:before{display:none;}'
      ].join('');
      $('<style class="novel-downloader-style-chapter">').text(styleChapter).attr('media', 'max-width: 1px').appendTo('head');

      // rule-chapter

      let order = 1;
      chapters = await getFromRule(Storage.rule.chapter, async (selector) => {
        let elems = $(Storage.rule.chapter);
        if (Storage.rule !== Rule && Storage.rule.chapterUrl.length) elems = elems.filter((i, elem) => Storage.rule.chapterUrl.some(j => elem.href.match(j)));
        let volumes;
        if (typeof Storage.rule.volume === 'string') {
          volumes = $(Storage.rule.volume);
        } else if (typeof Storage.rule.volume === 'function' && Storage.rule.volume.length <= 1) {
          volumes = await Storage.rule.volume(document);
        }
        volumes = $(volumes).toArray();
        const all = $(elems).add(volumes);
        return elems.attr('novel-downloader-chapter', '').toArray().map(i => {
          $(i).attr('order', order++);
          const chapter = {
            title: i.textContent,
            url: i.href
          };
          if (volumes && volumes.length) {
            const volume = all.slice(0, all.index(i)).toArray().reverse().find(i => volumes.includes(i));
            if (volume) chapter.volume = html2Text(volume.textContent);
          }
          return chapter;
        });
      }, [], []);
      if (!Storage.rule.chapter && Storage.rule.chapterUrl.length) {
        let elems = Array.from(document.links).filter(i => Storage.rule.chapterUrl.some(j => i.href.match(j)));
        elems = $(elems);
        chapters = elems.attr('novel-downloader-chapter', '').toArray().map(i => {
          $(i).attr('order', order++);
          return {
            title: i.textContent,
            url: i.href
          };
        });
      }
      vipChapters = await getFromRule(Storage.rule.vipChapter, (selector) => $(Storage.rule.vipChapter).attr('novel-downloader-chapter', 'vip').toArray().map(i => i.href), [], []);
      if (typeof Storage.rule.volume === 'function' && Storage.rule.volume.length > 1) chapters = await Storage.rule.volume(document, chapters);
    } else if (Storage.mode === 2) {
      container.find('[name="info"]>[name="mode"]').text('章节模式');
      chapters = [window.location.href];
    }
    if (typeof Storage.rule.getChapters === 'function') chapters = await Storage.rule.getChapters(document);
    chapters = chapters.map(i => typeof i === 'string' ? { url: i } : i);

    container.find('input,select,textarea').attr('disabled', null);
    container.find('input,select,textarea').filter('[raw-disabled="disabled"]').attr('raw-disabled', null).attr('disabled', 'disabled');

    if (Storage.debug.book) console.log(Storage.book);
  }

  $('<div class="novel-downloader-trigger" style="position:fixed;top:0px;left:0px;width:1px;height:100%;z-index:999999;background:transparent;"></div>').on({
    dblclick: function () {
      init();
    }
  }).appendTo('body');
  GM_registerMenuCommand('Download Novel', function () {
    init();
  }, 'N');
  GM_registerMenuCommand('Show Storage', function () {
    console.log({ Storage, xhr: xhr.storage.getSelf() });
  }, 'S');

  const downloadTo = {
    debug: async (chapters) => { // TODO
      console.log(chapters);
    },
    text: async (chapters) => {
      const length = String(chapters.length).length;
      const title = Storage.book.title || Storage.book.chapters[0].title;
      const writer = Storage.book.writer || 'novelDownloader';

      var all = [
        '本书名称: ' + title,
        Storage.book.writer ? `本书作者: ${writer}` : '',
        Storage.book.intro ? `本书简介: ${Storage.book.intro}` : '',
        Config.reference ? '阅读前说明：本书籍由用户脚本novelDownloader制作' : '',
        Config.reference ? `来源地址: ${window.location.href}` : ''
      ].filter(i => i);
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
        type: 'text/plain;charset=utf-8'
      });
      download(blob, title + '.txt');
    },
    epub: async (chapters) => {
      const length = String(chapters.length).length;
      const title = Storage.book.title || Storage.book.chapters[0].title;
      const writer = Storage.book.writer || 'novelDownloader';
      const uuid = 'ndv3-' + window.location.href.match(/[a-z0-9-]+/ig).join('-') + $('.novel-downloader-v3').find('[name="limit"]>[name="range"]').val();
      const href = $('<div>').text(window.location.href).html();
      const date = new Date().toISOString();

      let cover = Storage.book.coverBlob;
      if (!Storage.book.coverBlob && Storage.book.cover) {
        try {
          const res = await xhr.sync(Storage.book.cover, null, {
            responseType: 'arraybuffer',
            timeout: Config.timeout * 10
          });
          Storage.book.coverBlob = new window.Blob([res.response], {
            type: res.responseHeaders.match(/content-type:\s*(image.*)/i) ? res.responseHeaders.match(/content-type:\s*(image.*)/i)[1] : 'image/png'
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
          '<meta name="cover" content="cover-image" /></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="cover" href="cover.html" media-type="application/xhtml+xml"/><item id="css" href="stylesheet.css" media-type="text/css"/>'
        ].join(''),
        'OEBPS/toc.ncx': `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd"><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><head><meta name="dtb:uid" content="urn:uuid:${uuid}"/><meta name="dtb:depth" content="1"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${title}</text></docTitle><navMap><navPoint id="navpoint-1" playOrder="1"><navLabel><text>首页</text></navLabel><content src="cover.html"/></navPoint>`,
        'OEBPS/cover.html': `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${title}</title><link type="text/css" rel="stylesheet" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body>` + [
          `<h1>${title}</h1>`,
          Storage.book.writer ? `<h2>${Storage.book.writer}</h2>` : '',
          Storage.book.intro ? `<h2>简介: ${Storage.book.intro}</h2>` : '',
          Config.reference ? '<h3>阅读前说明：本书籍由用户脚本novelDownloader制作</h3>' : '',
          Config.reference ? `<h3>来源地址: <a href="${href}" target="_blank">${href}</a></h3>` : ''
        ].filter(i => i).join('') + '</body></html>'
      };

      if (Config.image) {
        for (const chapter of Storage.book.chapters) {
          const contentDom = $('<div>').html(chapter.content);
          for (const url of $('img', contentDom).toArray().map(i => $(i).attr('src'))) {
            if (!Storage.book.image.find(i => i.raw === url)) {
              Storage.book.image.push({
                raw: url,
                url: new URL(url, chapter.url).href
              });
            }
          }
        }

        if (Storage.book.image.filter(i => !i.content).length) {
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
                } else {
                  return true;
                }
              }
            });
            xhr.showDialog();
            xhr.list(Storage.book.image.filter(i => !i.content), {
              responseType: 'arraybuffer',
              onload: (res, reuqest) => {
                const index = Storage.book.image.indexOf(reuqest.raw);
                Storage.book.image[index].content = res.response;
                Storage.book.image[index].type = res.responseHeaders.match(/content-type:\s*image\/(.*)/i) ? res.responseHeaders.match(/content-type:\s*image\/(.*)/i)[1] : 'image/png';
              }
            });
            xhr.start();
          });
        }

        const length = String(Storage.book.image.length).length;
        for (let i = 0; i < Storage.book.image.length; i++) {
          const imgOrder = String(i + 1).padStart(length, '0');
          const type = Storage.book.image[i].type ? Storage.book.image[i].type.split(';')[0] : 'png';
          const imgName = `img/img-${imgOrder}.${type}`;
          Storage.book.image[i].name = imgName;
          files['OEBPS/content.opf'] += `<item id="img-${imgOrder}" href="${imgName}" media-type="image/jpeg"/>`;
          files['OEBPS/' + imgName] = Storage.book.image[i].content;
        }

        for (const chapter of Storage.book.chapters) {
          const contentDom = $('<div>').html(chapter.content);
          for (const elem of $('img', contentDom).toArray()) {
            if (Storage.book.image.find(i => i.raw === $(elem).attr('src'))) {
              contentDom.find(elem).attr('src', Storage.book.image.find(i => i.raw === $(elem).attr('src')).name);
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
          }]
        ]);

        if (Config.tocIndent) {
          if (chapter.volume && chapter.volume !== volumeCurrent) {
            if (volumeCurrent) files['OEBPS/toc.ncx'] += '</navPoint>';
            volumeCurrent = chapter.volume;
            files['OEBPS/toc.ncx'] += '<navPoint id="chapter' + chapterOrder + '" playOrder="' + (i + 2) + '"><navLabel><text>' + chapterName + '</text></navLabel><content src="' + chapterOrder + '.html"/>';
          } else {
            files['OEBPS/toc.ncx'] += '<navPoint id="chapter' + chapterOrder + '" playOrder="' + (i + 2) + '"><navLabel><text>' + chapterName + '</text></navLabel><content src="' + chapterOrder + '.html"/></navPoint>';
          }
          if (chapter.volume && i === chapters.length - 1) files['OEBPS/toc.ncx'] += '</navPoint>';
        } else {
          files['OEBPS/toc.ncx'] += '<navPoint id="chapter' + chapterOrder + '" playOrder="' + (i + 2) + '"><navLabel><text>' + chapterName + '</text></navLabel><content src="' + chapterOrder + '.html"/></navPoint>';
        }

        files['OEBPS/content.opf'] += '<item id="chapter' + chapterOrder + '" href="' + chapterOrder + '.html" media-type="application/xhtml+xml"/>';
        itemref += '<itemref idref="chapter' + chapterOrder + '" linear="yes"/>';
        files[`OEBPS/${chapterOrder}.html`] = '<html xmlns="http://www.w3.org/1999/xhtml"><head><title>' + chapterName + '</title><link type="text/css" rel="stylesheet" media="all" href="stylesheet.css" /><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><h3>' + chapterName + '</h3>' + '<div><p>' + chapterContent + '</p></div></body></html>';
      }
      files['OEBPS/content.opf'] += `<item id="cover-image" href="cover.jpg" media-type="image/jpeg"/></manifest><spine toc="ncx">${itemref}</spine><guide><reference href="cover.html" type="cover" title="Cover"/></guide></package>`;
      files['OEBPS/toc.ncx'] += '</navMap></ncx>';

      const zip = new JSZip();
      for (const file in files) {
        zip.file(file, files[file]);
      }
      const file = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      });
      download(file, title + '.epub');
    },
    zip: async (chapters) => {
      const length = String(chapters.length).length;
      const title = Storage.book.title || Storage.book.chapters[0].title;

      const files = {};
      files[String(0).padStart(length, '0') + '-说明文件.txt'] = [
        '本书名称: ' + title,
        Storage.book.writer ? `本书作者: ${Storage.book.writer}` : '',
        Storage.book.intro ? `本书简介: ${Storage.book.intro}` : '',
        Config.reference ? '阅读前说明：本书籍由用户脚本novelDownloader制作' : '',
        Config.reference ? `来源地址: ${window.location.href}` : ''
      ].filter(i => i).join('\n');

      for (let i = 0; i < chapters.length; i++) {
        const { title, content } = chapters[i];
        files[String(i + 1).padStart(length, '0') + '-' + title.replace(/[\\/:*?"<>|]/g, '-') + '.txt'] = content;
      }

      const zip = new JSZip();
      for (const file in files) {
        zip.file(file, files[file]);
      }
      const file = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9
        }
      });
      download(file, title + '.zip');
    }
  };

  /** @name getFromRule
    * @param {string | function} value
    * @param {object | function} argsString 当为function时，参数为value
    * @param {array} argsFunction
  */
  async function getFromRule (value, argsString = {}, argsFunction = [], defaultValue) {
    argsFunction = [].concat(argsFunction);
    let returnValue;

    if (typeof argsString !== 'function') {
      argsString = Object.assign({
        attr: 'text',
        document,
        allElement: false
      }, argsString);
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
          return elem.toArray().map(i => args.attr === 'html' ? $(i).html() : args.attr === 'text' ? $(i).text() : $(i).attr(args.attr) || $(i).prop(args.attr));
        } else {
          return args.attr === 'html' ? elem.eq(0).html() : args.attr === 'text' ? elem.eq(0).text() : elem.eq(0).attr(args.attr) || elem.eq(0).prop(args.attr);
        }
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

  function html2Text (text = '', specialDict = []) { // TODO 需要优化
    const dict = (specialDict || []).concat([
      [/<\/p>(\s*)<p(\s+.*?)?>/gi, '\n'],
      [/<\/p>|<p(\s+.*?)?>/gi, '\n'],
      [/<br\s*\/?>/gi, '\n'],
      [/<(\w+)&nbsp;/g, '&lt;$1&nbsp;'],
      [/(\S)<(div)/g, '$1\n<$2'],
      [/<\/(div)>(\S)/g, '</$1>\n$2']
    ]).filter(i => typeof i === 'object' && i instanceof Array && i.length).map(i => {
      const arr = i;
      if (typeof arr[0] === 'string') arr[0] = new RegExp(arr[0], 'gi');
      if (typeof arr[1] === 'undefined') arr[1] = '';
      return arr;
    });
    return replaceWithDict(text, dict).trim();
  }
  function replaceWithDict (text = '', dict = []) {
    let replace = dict.find(i => text.match(i[0]));
    let replaceLast = null;
    let textLast = null;
    while (replace) {
      if (replace === replaceLast && textLast === text) {
        console.error('novelDownloader: 替换文本陷入死循环\n替换规则: ' + replace);
        dict.splice(dict.indexOf(replace), 1);
      }
      textLast = text;
      text = text.replace(replace[0], replace[1] || '');
      replaceLast = replace;
      replace = dict.find(i => text.match(i[0]));
    }
    return text;
  }
  function getCover (txt) {
    const fontSize = 20;
    const width = 180;
    const height = 240;
    const color = '#000';
    const lineHeight = 10;
    /// ////////
    const maxlen = width / fontSize - 2;
    const txtArray = txt.split(new RegExp('(.{' + maxlen + '})'));
    let i = 1;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = color;
    context.strokeRect(0, 0, width, height);
    context.font = fontSize + 'px sans-serif';
    context.textBaseline = 'top';
    let fLeft, fTop;
    for (let j = 0; j < txtArray.length; j++) {
      if (txtArray[j] === '') continue;
      fLeft = fontSize * ((maxlen - txtArray[j].length) / 2 + 1);
      fTop = fontSize / 4 + fontSize * i + lineHeight * i;
      context.fillText(txtArray[j], fLeft, fTop, canvas.width);
      context.fillText('\n', fLeft, fTop, canvas.width);
      i++;
    }
    return new Promise((resolve, reject) => {
      canvas.toBlob(function (blob) {
        resolve(blob);
      });
    });
  }
  function waitInMs (time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
  function waitFor (event, timeout) {
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
  function download (content, name, force) {
    const lastDownload = Storage.lastDownload || {};
    const time = new Date().getTime();
    if (!force && time - lastDownload.time <= 5 * 1000 &&
      lastDownload.size === content.size && lastDownload.type === content.type &&
      lastDownload.name === name) { // 5秒内重复下载
      return;
    }
    Storage.lastDownload = {
      time,
      size: content.size,
      type: content.type,
      name
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
})();
