// ==UserScript==
// @name        NSFW_Mode
// @name:zh-CN  绅士模式
// @namespace   https://github.com/dodying/Dodying-UserJs
// @author      Dodying
// @description Fake the page when view nsfw in puc
// @description:zh-CN 在光天化日之下浏览不健康的网站时，伪装页面
// @include     http://exhentai.org/*
// @include     http://g.e-hentai.org/*
// @version     1.01
// @grant       none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @run-at      document-idle
// ==/UserScript==
var fakeAll = [
  {
    'title': '时间_百度搜索',
    'icon': 'https://www.baidu.com/img/baidu.svg'
  },
  {
    'title': '新番 - Google 搜索',
    'icon': 'https://www.google.co.jp/images/branding/product/ico/googleg_lodp.ico'
  },
  {
    'title': '杭州市 - 维基百科，自由的百科全书',
    'icon': 'https://zh.wikipedia.org/static/favicon/wikipedia.ico'
  },
  {
    'title': '艦隊Collection - 萌娘百科 萬物皆可萌的百科全書',
    'icon': 'https://zh.moegirl.org/favicon.ico'
  },
  {
    'title': '浙江_百度百科',
    'icon': 'http://baike.baidu.com/favicon.ico'
  },
  {
    'title': 'Page not found · GitHub',
    'icon': 'https://github.com/favicon.ico'
  },
  {
    'title': '我的书架_个人中心_起点中文网',
    'icon': 'http://me.qidian.com/images/favicon_qidian.ico'
  },
  {
    'title': 'Add to Search Bar :: Firefox 附加组件',
    'icon': 'https://addons.cdn.mozilla.net/static/img/favicon.ico'
  },
  {
    'title': '知乎有哪些美食专栏？ - 烹饪 - 知乎',
    'icon': 'http://static.zhihu.com/static/favicon.ico'
  },
  {
    'title': '后宫动漫吧_百度贴吧',
    'icon': 'http://static.tieba.baidu.com/tb/favicon.ico'
  },
  {
    'title': '【杭州天气】杭州天气预报,天气预报一周,天气预报15天查询',
    'icon': 'http://www.weather.com.cn/favicon.ico'
  },
  {
    'title': 'Google 翻译',
    'icon': 'https://translate.google.com.hk/favicon.ico'
  },
  {
    'title': '百度翻译',
    'icon': 'http://fanyi.baidu.com/static/translation/img/favicon/favicon.ico'
  },
  {
    'title': '哔哩哔哩弹幕视频网 - ( ゜- ゜)つロ  乾杯~  - bilibili',
    'icon': 'http://static.hdslb.com/images/favicon.ico'
  },
  {
    'title': '三江频道_起点中文小说网',
    'icon': 'http://sjg.qidian.com/favicon.ico'
  },
  {
    'title': 'Bangumi 番组计划',
    'icon': 'http://bgm.tv/img/favicon.ico'
  },
  {
    'title': '淘宝网 - 淘！我喜欢',
    'icon': 'https://www.taobao.com/favicon.ico'
  },
  {
    'title': 'V2EX',
    'icon': 'https://www.v2ex.com/static/img/icon_rayps_64.png'
  },
  {
    'title': '小众软件',
    'icon': 'http://lh3.appinn.net/wp-content/uploads/cropped-Appinn-icon-512-192x192.png'
  },
  {
    'title': '新标签页',
    'icon': ''
  },
  {
    'title': '',
    'icon': ''
  },
]
var type = parseInt(Math.random() * fakeAll.length);
var fakeNow = fakeAll[type];
var pretitle = document.title;
var icon;
(document.querySelector('link[rel="icon"]')) ? icon = document.querySelector('link[rel="icon"]').href : icon = '';
window.addEventListener('blur', function () {
  document.title = fakeNow['title'];
  if (!document.querySelector('link[rel="icon"]')) {
    var link = document.createElement('link');
    link.href = fakeNow['icon'];
    link.rel = 'icon';
    document.head.appendChild(link);
  } else {
    document.querySelector('link[rel="icon"]').href = fakeNow['icon'];
  }
});
window.addEventListener('focus', function () {
  document.title = pretitle;
  document.querySelector('link[rel="icon"]').href = icon;
});
var img = document.querySelectorAll('img,div[style*="background:transparent url"]');
for (var i = 0; i < img.length; i++) {
  img[i].style.visibility = 'hidden';
}
