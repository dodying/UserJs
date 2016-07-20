// ==UserScript==
// @name        novelDownloader
// @name:zh-CN  小说下载
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description novelDownloaderHelper
// @description:zh-CN 帮助下载小说
// @include     http://read.qidian.com/BookReader/*.aspx
// @include     http://b.faloo.com/f/*.html
// @include     http://b.faloo.com/p/*/*.html
// @include     http://www.wenku8.com/novel/*/*/*.htm
// @include     http://book.zongheng.com/showchapter/*.html
// @include     http://book.zongheng.com/chapter/*/*.html
// @include     http://www.17k.com/list/*.html
// @include     http://www.17k.com/chapter/*/*.html
// @include     http://chuangshi.qq.com/bk/*/*-*.html
// @include     http://free.qidian.com/Free/ChapterList.aspx?bookId=*
// @include     http://free.qidian.com/Free/ReadChapter.aspx?bookId=*&chapterId=*
// @include     http://www.heiyan.com/book/*/chapter
// @include     http://www.heiyan.com/book/*/*
// @include     http://www.23wx.com/html/*
// @include     http://book.sfacg.com/Novel/*
// @include     http://www.biquge.la/book/*
// @include     http://www.shumilou.co/*/
// include     http://18av.mm-cg.com/*
// @version     1.02
// @require     http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// @require     https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=127839
// @require     http://cdn.bootcss.com/jszip/3.0.0/jszip.min.js
// require     https://github.com/hustlzp/jquery-s2t/raw/master/jquery.s2t.js
// @grant       GM_xmlhttpRequest
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// ==/UserScript==
/*
var script = document.createElement('script');
script.src = 'http://libs.baidu.com/jquery/1.9.1/jquery.min.js';
document.head.appendChild(script);
*/
var indexRule = {
  /*
  域名: {
    'name': '必填，书籍标题选择器',String
    'chapter': '必填，章节链接选择器' String
    'vip': '选填，选择器，Vip章节页面的标志，无Vip章节则留空',String
  }
  */
  'read.qidian.com': {
    'name': '.booktitle>h1',
    'chapter': '.box_cont>div.list>ul>li>a',
    'vip': '.box_cont>div.list>ul>li>a[href^="http://vipreader.qidian.com/"]'
  },
  'chuangshi.qq.com': {
    'name': '.title>a>b',
    'chapter': 'div.list>ul>li>a',
    'vip': 'div.list:has(span.f900)>ul>li>a',
  },
  'b.faloo.com': {
    'name': 'h1.a_24b',
    'chapter': '.ni_list>table>tbody>tr>td>a'
  },
  'www.wenku8.com': {
    'name': '#title',
    'chapter': '.css>tbody>tr>td>a'
  },
  'book.zongheng.com': {
    'name': '.txt>h1',
    'chapter': '.chapterBean>a',
    'vip': '.chapterBean>em+a'
  },
  'www.17k.com': {
    'name': 'h1.Title',
    'chapter': 'dl.Volume>dd>a',
    'vip': 'dl.Volume>dd>a:has(img)'
  },
  'free.qidian.com': {
    'name': '.book_title>h2>strong',
    'chapter': '#book_box>div>div>ul>li>a'
  },
  'www.heiyan.com': {
    'name': 'h1.page-title',
    'chapter': 'div.bd>ul>li>a',
    'vip': 'div.bd>ul>li>a.isvip'
  },
  'www.23wx.com': {
    'name': '.bdsub>dl:nth-child(1)>dt:nth-child(1)>a:nth-child(4)',
    'chapter': '#at>tbody>tr>td>a'
  },
  'book.sfacg.com': {
    'name': 'h1',
    'chapter': '.list_Content>volumeitem>li>a'
  },
  'www.biquge.la': {
    'name': 'h1',
    'chapter': '#list>dl>dd>a'
  },
  'www.shumilou.co': {
    'name': '#mybook+.list>.tit>b',
    'chapter': 'li.zl>a'
  },
  '18av.mm-cg.com': {
    'name': '.label>div',
    'chapter': '.novel_left>a'
  }
};
var chapterRule = {
  /*
  域名: {
    'name': '必填-章节标题选择器',String
    'content': '必填-章节内容选择器',String
    'lang': '必填-内容语言',String,zhc-简体,zht-繁体
    'MimeType': '选填',String gbk-'text/html; charset=gb2312'
    'Deal': '选填-网址防盗贴时进行的处理，参数为num、url',Function
    还有特殊处理时可不填name与content,
    最后要得到【章节名称】与【内容】，
    之后调用函数 thisDownloaded(num, name, content);
    详情请看【起点>Dead2】
  }
  一般来说，只用填上必填的就行。
  */
  'vipreader.qidian.com': {
    'name': '.story_title>h1',
    'content': '#chaptercontent',
    'lang': 'zhc'
  },
  'read.qidian.com': {
    'lang': 'zhc',
    'Deal': function (num, url) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
          var name = jQuery('.story_title>h1,.title>h3', response.response).text();
          var content = jQuery('script[src$=".txt"]', response.response);
          chapterRule['read.qidian.com'].Deal2(num, name, content);
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
          content = name + '\r\n来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n\r\n' + content;
          if (jQuery('.bookDownloaderLang:checked') [0].value !== 'zhc') {
            //name = jQuery.s2t(name);
            //content = jQuery.s2t(content);
          }
          thisDownloaded(num, name, content);
        }
      });
    }
  },
  'chuangshi.qq.com': {
    'lang': 'zhc',
    'Deal': function (num, url) {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
          var name = response.response.replace(/[\r\n]/g, '').replace(/.*\<title\>(.*)\<\/title\>.*/, '$1').replace(/.*_(.*)_.*/, '$1');
          var bid = response.response.replace(/[\r\n]/g, '').replace(/.*'bid' : '(\d+)'.*/g, '$1');
          var uuid = response.response.replace(/[\r\n]/g, '').replace(/.*'uuid' : '(\d+)'.*/g, '$1');
          chapterRule['chuangshi.qq.com'].Deal2(num, name, bid, uuid);
        }
      });
    },
    'Deal2': function (num, name, bid, uuid) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://chuangshi.qq.com/index.php/Bookreader/' + bid + '/' + uuid);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
      xhr.onload = function () {
        content = JSON.parse(xhr.response).Content;
        var base = 30;
        var arrStr = new Array();
        var arrText = content.split('\\');
        for (var i = 1, len = arrText.length; i < len; i++) {
          arrStr.push(String.fromCharCode(parseInt(arrText[i], base)));
        }
        content = arrStr.join('');
        temp = wordFormat(jQuery('.bookreadercontent', content).html());
        content = temp;
        content = name + '\r\n来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n\r\n' + content;
        if (jQuery('.bookDownloaderLang:checked') [0].value !== 'zhc') {
          //name = jQuery.s2t(name);
          //content = jQuery.s2t(content);
        }
        thisDownloaded(num, name, content);
      }
      xhr.send('lang=zhs');
    }
  },
  'b.faloo.com': {
    'name': '#title>h1',
    'content': '#content',
    'lang': 'zhc'
  },
  'www.wenku8.com': {
    'name': '#title',
    'content': '#content',
    'lang': 'zhc',
    'MimeType': 'text/html; charset=gb2312'
  },
  'book.zongheng.com': {
    'name': 'h1>em',
    'content': '#chapterContent',
    'lang': 'zhc'
  },
  'www.17k.com': {
    'name': 'h1',
    'content': '#chapterContentWapper',
    'lang': 'zhc'
  },
  'free.qidian.com': {
    'lang': 'zhc',
    'Deal': function (num, url) {
      chapterRule['read.qidian.com'].Deal(num, url);
    }
  },
  'www.heiyan.com': {
    'lang': 'zhc',
    'Deal': function (num, url) {
      urlTrue = 'http://a.heiyan.com/ajax/chapter/content/' + url.replace(/.*\//, '');
      GM_xmlhttpRequest({
        method: 'GET',
        url: urlTrue,
        onload: function (response) {
          var info = JSON.parse(response.response);
          var name = info.chapter.title;
          var content = wordFormat(info.chapter.htmlContent);
          content = name + '\r\n来源地址：' + jQuery(window).data('dataDownload') [num].url + '\r\n\r\n' + content;
          if (jQuery('.bookDownloaderLang:checked') [0].value !== 'zhc') {
            //name = jQuery.s2t(name);
            //content = jQuery.s2t(content);
          }
          thisDownloaded(num, name, content);
        }
      });
    }
  },
  'www.23wx.com': {
    'name': 'h1',
    'content': '#contents',
    'lang': 'zhc',
    'MimeType': 'text/html; charset=gb2312'
  },
  'book.sfacg.com': {
    'name': '.list_menu_title',
    'content': '#ChapterBody',
    'lang': 'zhc'
  },
  'www.biquge.la': {
    'name': 'h1',
    'content': '#content',
    'lang': 'zhc',
    'MimeType': 'text/html; charset=gb2312'
  },
  'www.shumilou.co': {
    'name': 'h2',
    'content': '#content',
    'lang': 'zhc',
  },
  '18av.mm-cg.com': {
    'name': '#left>h1',
    'content': '#novel_content_txtsize',
    'lang': 'zht'
  }
};
jQuery(document.body).append('<div id="bookDownloader">下载线程：<input id="bookDownloaderThread" placeholder="10" type="text"><br><input id="boodDownloaderVip" type="checkbox"></input><label for="boodDownloaderVip">下载Vip章节[测试中，起点成功]</label><br>语言：<input id="bookDownloaderLangZhc" type="radio" name="bookDownloaderLang" class="bookDownloaderLang" value="zhc" checked="true"></input><label for="bookDownloaderLangZhc">简体</label><input id="bookDownloaderLangZht" type="radio" name="bookDownloaderLang" class="bookDownloaderLang" value="zht"></input><label for="bookDownloaderLangZht">繁体</label><br><button id="bookDownloaderThis">下载本章(TXT)</button><br><button id="bookDownloaderAll2Txt">下载整个目录页(TXT)</button><br><button id="bookDownloaderAll2Zip">每个章节生成1个txt(ZIP)</button><br><button id="bookDownloaderSome2Zip">特定下载某些章节(ZIP)</button></div><div id="bookDownloaderLog"></div>');
jQuery('#bookDownloader').css({
  'display': 'none',
  'z-index': '999',
  'background-color': 'white',
  'border-color': 'black',
  'border-style': 'solid',
  'text-align': 'center',
  'position': 'absolute',
  'left': function () {
    return String(jQuery(window).scrollLeft() + (jQuery(window).width() - jQuery('#bookDownloader').width()) / 2) + 'px';
  },
  'top': function () {
    return String(jQuery(window).scrollTop() + (jQuery(window).height() - jQuery('#bookDownloader').height()) / 2) + 'px';
  }
});
jQuery('#bookDownloaderLog').css({
  'display': 'none',
  'z-index': '999',
  'width': '300px',
  'height': '350px',
  'overflow': 'auto',
  'background-color': 'white',
  'border-color': 'black',
  'border-style': 'solid',
  'text-align': 'center',
  'position': 'absolute',
  'left': function () {
    return String(jQuery(window).scrollLeft() + jQuery(window).width() - jQuery('#bookDownloaderLog').width() - 5) + 'px';
  },
  'top': function () {
    return String(jQuery(window).scrollTop() + jQuery(window).height() - jQuery('#bookDownloaderLog').height() - 5) + 'px';
  }
});
jQuery(window).scroll(function () {
  jQuery('#bookDownloader').css({
    'left': function () {
      return String(jQuery(window).scrollLeft() + (jQuery(window).width() - jQuery('#bookDownloader').width()) / 2) + 'px';
    },
    'top': function () {
      return String(jQuery(window).scrollTop() + (jQuery(window).height() - jQuery('#bookDownloader').height()) / 2) + 'px';
    }
  });
  jQuery('#bookDownloaderLog').css({
    'left': function () {
      return String(jQuery(window).scrollLeft() + jQuery(window).width() - jQuery('#bookDownloaderLog').width() - 5) + 'px';
    },
    'top': function () {
      return String(jQuery(window).scrollTop() + jQuery(window).height() - jQuery('#bookDownloaderLog').height() - 5) + 'px';
    }
  });
}).keydown(function (event) {
  if (event.keyCode === 68) jQuery('#bookDownloader').toggle();
});
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
jQuery('#bookDownloaderSome2Zip').click(function () {
  var arr = prompt('1').split('|');
  console.log(arr);
  download(arr, 'zip');
});
//////////////////////////////////////////////////////
function download(chapterArray, fileType) { //下载
  jQuery('#bookDownloaderLog').html('');
  jQuery('#bookDownloaderLog').css('display', 'block');
  jQuery(window).data('errorUrl', new Object());
  if (chapterArray === 'index') {
    var chapter = jQuery(indexRule[location.host].chapter);
  } else {
    var chapter = chapterArray;
  }
  console.log(chapter);
  var href = chapter[0].href || chapter[0];
  console.log(jQuery(indexRule[getHostName(href)].name).length);
  var bookName = (jQuery(indexRule[getHostName(href)].name).length === 0) ? '' : jQuery(indexRule[getHostName(href)].name) [0].innerText.replace(/^\s+|\s+$/g, '');
  if (jQuery('#boodDownloaderVip') [0].checked === false) {
    var chapterVip = jQuery(indexRule[location.host].vip);
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
  jQuery(window).data('dataDownload', new Array());
  jQuery(window).data('downloadList', new Array());
  jQuery(window).data('downloadNow', new Object());
  jQuery(window).data('number', 0);
  jQuery(window).data('downloadNow').length = 0;
  for (var i = 0; i < chapter.length; i++) {
    href = chapter[i].href || chapter[i];
    var host = getHostName(href);
    var dataDownload = new Object();
    dataDownload.url = href;
    dataDownload.ok = false;
    jQuery(window).data('dataDownload') [i] = dataDownload;
    jQuery(window).data('downloadList') [i] = href;
  };
  var addTask = setInterval(function () {
    if (Boolean(chapterRule[host].Deal)) {
      downloadTask(chapterRule[host].Deal);
    } else {
      downloadTask(xhr);
    }
  }, 200);
  var downloadCheck = setInterval(function () {
    console.log('dataDownload', jQuery(window).data('dataDownload'));
    if (downloadedCheck(jQuery(window).data('dataDownload'))) {
      if (fileType === 'zip') {
        download2Zip(bookName);
      } else if (fileType === 'txt') {
        download2Txt(bookName);
      }
      clearInterval(addTask);
      clearInterval(downloadCheck);
    }
  }, 200);
}
function downloadTask(fun) {
  var thread = parseInt($('#bookDownloaderThread').val()) || 10;
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
      addDownloadLogStart(i, i, href, '开始');
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
    console.log(jQuery(window).data('number'))
    downloadTask(fun);
  } else {
    return;
  }
}
function xhr(num, url) {
  var host = getHostName(url);
  console.log(host);
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    overrideMimeType: chapterRule[host].MimeType,
    onload: function (response) {
      console.log('下载中', url);
      console.log(response.response);
      var name = jQuery(chapterRule[host].name, response.response).text().replace(/^\s+|\s+$/g, '');
      //console.log('name', name);
      var content = jQuery(chapterRule[host].content, response.response);
      //console.log('content', content);
      if (content.length > 0) {
        content = wordFormat(content.html());
      } else {
        jQuery(window).data('errorUrl') [0] = url;
        alert(url + '失败');
        return;
      }
      content = name + '\r\n来源地址：' + url + '\r\n\r\n' + content;
      if (jQuery('.bookDownloaderLang:checked') [0].value !== chapterRule[host].lang) {
        if (jQuery('.bookDownloaderLang:checked') [0].value === 'zhc') {
          //name = jQuery.t2s(name);
          //content = jQuery.t2s(content);
        } else {
          //name = jQuery.s2t(name);
          //content = jQuery.s2t(content);
        }
      }
      thisDownloaded(num, name, content);
    },
    onerror: function (response) {
      console.log(response);
      alert(response)
    }
  });
}
function thisDownloaded(num, name, content) {
  jQuery(window).data('dataDownload') [num].name = name;
  jQuery(window).data('dataDownload') [num].content = content;
  jQuery(window).data('dataDownload') [num].ok = true;
  jQuery(window).data('downloadNow') [num].ok = true;
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
    '“(.*?)“|||“$1”',
    '\\s+|||',
    '<!--.*-->|||换行',
    '<br>|||换行',
    '<p.*?>|||换行',
    '</p>|||换行',
    '<a.*?>.*?</a>|||',
    '<div.*?>.*?</div>|||换行',
    '<center.*?>.*?</center>|||换行',
    '<style.*?>.*?</style>|||换行',
    '<script.*?>.*?</script>|||换行',
    '<ul.*?>.*?</ul>|||',
    '<b.*?>.*?</b>|||换行',
    '<font.*?>.*?</font>|||换行',
    '换行|||\r\n',
    '\\s+|||\r\n　　'
  ];
  var regexp = new RegExp();
  var temp;
  for (var i = 0; i < replaceLib.length; i++) {
    temp = replaceLib[i].split('|||');
    regexp = new RegExp(temp[0], 'gi');
    word = word.replace(regexp, temp[1]);
  }
  return word;
}
function addDownloadLogStart(num, name, url, status) {
  jQuery('<span id="bookDownloaderLog_' + num + '">' + num + ' <a href="' + url + '" target="_blank">' + name + '</a> ' + status + '</span><br>').appendTo(jQuery('#bookDownloaderLog'));
}
function addDownloadLogEnd(num, name, url, status) {
  jQuery('#bookDownloaderLog_' + num).html(num + ' <a href="' + url + '" target="_blank">' + name + '</a> ' + status);
}
function download2Zip(bookName) { //下载到1个zip
  var name = (bookName === '') ? jQuery(window).data('dataDownload') [0].name : bookName;
  var zip = new JSZip();
  var len = String(jQuery(window).data('dataDownload').length).length;
  for (var i = 0; i < jQuery(window).data('dataDownload').length; i++) {
    zip.file(String(preZeroFill(i, len)) + '-' + jQuery(window).data('dataDownload') [i].name + '.txt', jQuery(window).data('dataDownload') [i].content);
  }
  zip.generateAsync({
    type: 'blob'
  }).then(function (content) {
    saveAs(content, name + '.zip');
  });
  delete zip;
}
function download2Txt(bookName) { //下载到1个txt
  var name = (bookName === '') ? jQuery(window).data('dataDownload') [0].name : bookName;
  var all = '';
  for (var i = 0; i < jQuery(window).data('dataDownload').length; i++) {
    all += jQuery(window).data('dataDownload') [i].content + '\r\n\r\n';
  }
  var blob = new Blob([all], {
    type: 'text/plain;charset=utf-8'
  });
  saveAs(blob, name + '.txt');
  delete blob;
}
function downloadedCheck(arr) { //检查下载是否完成
  var undownload = 0;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].ok) {
      addDownloadLogEnd(i, arr[i].name, arr[i].url, '成功');
    } else {
      undownload++;
    }
  }
  return (undownload === 0) ? true : false;
}
function getHostName(url) { //获取网址域名
  return (/^http(s|):\/\//.test(url)) ? url.split('/') [2] : url.split('/') [0];
}
function preZeroFill(num, size) { //补足0
  if (num >= Math.pow(10, size)) { //如果num本身位数不小于size位
    return num.toString();
  } else {
    var _str = Array(size + 1).join('0') + num;
    return _str.slice(_str.length - size);
  }
}
