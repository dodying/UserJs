// ==UserScript==
// @name        hbookerCustomize
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【小说】污客自定义
// @description:zh-CN  
// @include     http://www.hbooker.com/chapter/book_chapter_detail?chapter_id=*
// @version     1
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
init();
function init() {
  jQ = unsafeWindow.jQuery;
  jQ('head').append('<style>p.reading{color:white;background-color:#002B36;}.chapter-comment-list>ul{padding:0px;}.clearfix::after{display:none;visibility:visible;}.bd{height:auto!important;}.bd>p{color:gray;position:relative;left:10px;width:460px;}.state{right:10px!important;}.state>a{margin-left:0!important;}.block{display:block;z-index:999999;position:fixed;}.avatarShow{background-repeat:no-repeat;width:140px;height:140px;}.quickComment{background-color:white;border:1px solid black;text-align:center;}.quickComment>ul>li{list-style:square inside url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAM0lEQVQYlWNgYGBgmMDN+Z+BGDCBm/M/UYphCgkqRlaIVzG6QpyKyVZIPc/gVQRTSEgNAOvrMRtNbYwdAAAAAElFTkSuQmCC")}</style>'); //样式设置
  jQ('#J_BarrageWrap').toggle(); //隐藏底部弹幕条
  var checkChapter = setInterval(function () {
    if (jQ('p.chapter').length > 0) { //普通章节
      clearInterval(checkChapter);
      //jQ('p.chapter>i:empty').toggle(); //隐藏吐槽数为0的圆点
      /*
      jQ('p.chapter>i').click(function () { //跳转
        jQ(document).scrollTop(jQ(this).parent().offset().top);
      });
      */
      jQ('p.chapter').click(function (e) { //正在阅读
        jQ(this).addClass('reading');
        jQ('p.chapter').not(this).removeClass('reading');
        if (!jQ(this).next().hasClass('chapter-comment-wrap')) jQ('.chapter-comment-wrap').hide();
      });
      var mo = new MutationObserver(checkReview);
      mo.observe(document.all.J_BookRead, {
        childList: true
      });
    } else if (jQ('#J_BookImage').length > 0) { //Vip章节
      jQ('.J_Num').click(function () {
        checkReview();
      });
    }
  }, 200);
}
function checkReview() {
  setTimeout(function () {
    jQ('.img').off().on({ //查看头像
      mousemove: function (e) {
        if (jQ('.avatarShow').length > 0) {
          jQ('.avatarShow').show();
          jQ('.avatarShow').css({
            'left': function () {
              return (e.screenX + 10) + 'px';
            },
            'top': function () {
              return (e.screenY - 60) + 'px';
            },
            'background-image': 'url(' + jQ(this).find('img').attr('src') + ')'
          });
        } else {
          jQ('body').append('<div class="avatarShow block"></div>');
          jQ('.avatarShow').css({
            'left': function () {
              return (e.screenX + 10) + 'px';
            },
            'top': function () {
              return (e.screenY - 60) + 'px';
            },
            'background-image': 'url(' + jQ(this).find('img').attr('src') + ')'
          });
        }
      },
      mouseout: function () {
        jQ('.avatarShow').hide();
      }
    });
    jQ('.chapter-comment-page>a').off().mouseover(function () { //处理翻页按钮
      //var parent = jQ(this).parentsUntil('#J_BookRead');
      //parent = jQ(parent[parent.length - 1]).prev();
      this.click();
      //jQ(document).scrollTop(parent.offset().top);
      checkReview();
    });
    jQ('.date').html(function () { //处理吐槽时间
      var text = (isNaN(parseInt(this.innerText))) ? this.title : this.innerText;
      var reTime = (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(text)) ? toRelativeTime(text)  : text;
      return '<span title="' + text + '">' + reTime + '</span>';
    });
    jQ('.chapter-comment-form>input').off().keydown(function (e) { //处理输入框
      if (jQ('.chapter-comment-form>input').val() !== '') return;
      if (e.keyCode === 13) { //Enter
        if (jQ('.quickComment').length > 0) {
          jQ('.quickComment').show();
        } else {
          jQ('body').append('<div class="quickComment block"><ul>'
          + '<h3>请选择</h3>'
          + '<li><a>签到</a></li>'
          + '<li><a>呸</a></li>'
          + '<li><a>呵呵</a></li>'
          + '<li><a>我从未见过如此厚颜无耻之人</a></li>'
          + '<li><a>喂 妖妖灵 没错 就是上次那个人</a></li>'
          + '<li><a>吐槽好少，让我添砖加瓦</a></li>'
          + '</ul></div>');
          jQ('.quickComment').css({
            'left': function () {
              return ((document.documentElement.clientWidth - jQ(this).width()) / 2) + 'px';
            },
            'top': function () {
              return ((document.documentElement.clientHeight - jQ(this).height()) / 2) + 'px';
            }
          });
          jQ('.quickComment>ul>li>a').click(function () {
            jQ('.chapter-comment-form>input').val(this.innerHTML);
            jQ('.quickComment').hide();
            jQ('.chapter-comment-submit').click();
          });
        }
      } else if (e.keyCode === 8 || e.keyCode === 27) { //Esc/Backspace
        jQ('.quickComment').hide();
      }
    });
  }, 200);
}
function toRelativeTime(date) {
  var now = new Date().getTime();
  var before = new Date(date).getTime();
  var _ = now - before;
  var i;
  var j;
  var CONVERSIONS = {
    秒: 1000,
    分钟: 60,
    小时: 60,
    天: 24,
    个月: 30,
    年: 12
  };
  for (i in CONVERSIONS) {
    if (CONVERSIONS[i] > _) {
      break;
    }
    _ = _ / CONVERSIONS[i];
    j = i;
  } //return (j === '年') ? '坟' : Math.floor(_) + j + '前';

  return Math.floor(_) + j + '前';
}
