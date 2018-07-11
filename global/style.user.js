// ==UserScript==
// @name        []Style
// @version     1.00.2
// @grant       none
// @author      dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @include     *
// ==/UserScript==
(function () {
  let id = 'style_' + Math.random()
  let init = function () {
    if (!document.getElementById(id)) {
      let rule = [
        {
          url: '.*',
          style: [
            'a:visited{color:rgb(35,173,173);}',
            '::-webkit-scrollbar{width:9px;height:9px}::-webkit-scrollbar-track-piece{background-color:transparent}body::-webkit-scrollbar-track-piece{background-color:white}::-webkit-scrollbar-thumb{background-color:#7d7d7d;border-radius:3px}::-webkit-scrollbar-thumb:hover{background-color:#999}::-webkit-scrollbar-thumb:active{background-color:#666}'
          ]
        },
        {
          url: 'https://e[-x]hentai\\.org/*',
          style: '[title*="female:netorare"],[raw-title*="female:netorare"],[title*="male:tentacles"],[raw-title*="male:tentacles"],[id="td_female:netorare"],[id="ta_female:netorare"]{color:#F00!important;background-color:#000!important;}'
        },
        {
          url: '^file:',
          style: [
            'body{margin:0 100px;color:black;background:url(http://qidian.gtimg.com/qd/images/read.qidian.com/theme/body_theme1_bg_2x.0.3.png);counter-reset:chapterOrder;}',
            'font,span{font-size:20px!important;font-family:????!important;font-weight:bold!important;}',
            'p.MsoNormal:hover{color:#fff;background:#000;}',
            'p.MsoNormal font::before{content:counter(chapterOrder) ". ";counter-increment:chapterOrder;}',
            '::selection{color:#F00;background:#000;}'
          ]
        },
        {
          url: 'bilibili\\.com/video/av',
          style: [
            '#bilibiliPlayer.mode-webfullscreen .bilibili-player-video-wrap {height:100% !important;width:100% !important}',
            '#bilibiliPlayer.mode-webfullscreen .bilibili-player-video-control {display:block;opacity:0 !important;transition:.2s;position:absolute;bottom:0}',
            '#bilibiliPlayer.mode-webfullscreen .bilibili-player-video-control:hover {opacity:.7 !important}',
            '#bilibiliPlayer.mode-webfullscreen .bilibili-player-video-sendbar {display:block;opacity:0 !important;transition:.2s;position:absolute;top:0}',
            '#bilibiliPlayer.mode-webfullscreen .bilibili-player-video-sendbar:hover {opacity:.8 !important}',
            '#bilibiliPlayer.mode-webfullscreen .bilibili-player-video-sendbar .bilibili-player-mode-selection-container {height:120px;border-radius:5px;top:100%}',
            '#bilibiliPlayer.mode-webfullscreen .bilibili-player-video-sendbar .bilibili-player-color-picker-container {height:208px;border-radius:5px;top:100%}',
            '#bilibiliPlayer.mode-webfullscreen .bilibili-player-video-info-container {top:40px}',
            '#bilibiliPlayer.mode-webfullscreen .bilibili-player-video-float-lastplay {bottom:30px}'
          ]
        }
      ]
      let style = rule.filter(i => window.location.href.match(i.url)).map(i => [].concat(i.style).join('\n'))
      let ele = document.createElement('style')
      ele.id = id
      ele.textContent = style.join('\n')
      document.head.appendChild(ele)
    }
  }

  init()
  var observer = new window.MutationObserver(init)
  observer.observe(document.head, {
    childList: true,
    subtree: true
  })
})()
