// ==UserScript==
// @name        hbookerEnhance
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  【小说】污客增强
// @description:zh-CN  阅读高亮，吐槽楼层提醒、跳转，快速吐槽，查看头像
// @include     http://www.hbooker.com/chapter/book_chapter_detail?chapter_id=*
// @version     1.01
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
  jQ('head').append('<style>'
  + 'p.reading{color:white;background-color:#002B36;}'
  + '.chapter-comment-list>ul{padding:0px;}'
  + '.clearfix::after{display:none;visibility:visible;}'
  + '.bd{height:auto!important;}'
  + '.bd>p{position:relative;left:10px;width:460px;}'
  + '.bd>p:hover{background-color:#CDCDCD;}'
  + '.state{right:10px!important;}'
  + '.state>a{margin-left:0!important;}'
  + '.avatarShow{background-repeat:no-repeat;width:140px;height:140px;display:block;z-index:999999;position:fixed;}'
  + '.chapter-comment-page>select{border:solid 1px #000;appearance:none;-moz-appearance:none;-webkit-appearance:none;}'
  + '.quickComment{cursor:pointer;float:left;}'
  + '.selectComment{display:none;position:absolute;z-index:999999;border:solid 1px #000;background-color:white;width:410px;}'
  + '.selectComment li{list-style:square inside url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAM0lEQVQYlWNgYGBgmMDN+Z+BGDCBm/M/UYphCgkqRlaIVzG6QpyKyVZIPc/gVQRTSEgNAOvrMRtNbYwdAAAAAElFTkSuQmCC");cursor:pointer;}'
  + '.selectComment li:hover{background:#7b6959;color:#FFF;}'
  + '</style>'); //样式设置
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
    jQ('.selectComment').hide(); //隐藏快速吐槽
    jQ('.name>a:has(i)').addClass(function () { //Vip高亮
      return jQ(this).children().attr('class');
    }).attr('title', function () {
      return jQ(this).children().text().replace('• ', '');
    });
    jQ('.name>a>i').remove(); ////Vip隐藏
    var commentCount = jQ('.chapter-comment-page>span').text().match(/\d+/) [0]; //吐槽总数
    var pageNow = (jQ('.chapter-comment-page>a').length === 2) ? jQ('.chapter-comment-page') [0].childNodes[4].data.replace(/\s+/g, '').match(/\d+/) [0] - 1 : 0; //当前页面
    jQ('.chapter-comment-page>span').remove();
    jQ('.img').after(function (i) { //楼层提醒
      return 'L' + (commentCount - i - pageNow * 10);
    });
    jQ('.chapter-comment-page').append(function () { //跳转选项
      var _html = '上车<select>';
      var temp;
      for (var i = 0; i * 10 < commentCount; i++) {
        temp = commentCount - i * 10;
        _html += '<option value="' + i + '">' + ((temp - 9 > 0) ? temp - 9 : 1) + '-' + (temp) + '</option>';
      }
      _html += '</select>';
      return _html;
    });
    jQ('.chapter-comment-page>select').val(pageNow).change(function () { //跳转事件
      if (jQuery('.next').hasClass('nonext')) {
        jQ('.prev').attr('data-no', this.value).click();
      } else {
        jQ('.next').attr('data-no', this.value).click();
      }
    });
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
          jQ('body').append('<div class="avatarShow"></div>');
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
    jQ('.chapter-comment-page>a:not(.noprev,.nonext)').off().click(function () { //处理翻页按钮
      ///*
      var parent = jQ(this).parentsUntil('#J_BookRead');
      parent = jQ(parent[parent.length - 1]); //.prev()
      checkReview();
      jQ(document).scrollTop(parent.offset().top);
      //*/
    });
    jQ('.date').html(function () { //处理吐槽时间
      var text = (isNaN(parseInt(this.innerText))) ? this.title : this.innerText;
      var reTime = (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(text)) ? toRelativeTime(text)  : text;
      return '<span title="' + text + '">' + reTime + '</span>';
    });
    if (jQ('.quickComment').length === 0) { //快速吐槽
      jQ('.chapter-comment-form>input').keydown(function (e) {
        if (e.keyCode === 13) {
          jQ('.chapter-comment-submit').click();
        }
      });
      jQ('.chapter-comment-form').append('<span class="quickComment"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAAIElEQVQYlWNgoDnQ13f7TwiTpIkkm0hyHkl+IloxTQAAXH8o7GbEclEAAAAASUVORK5CYII="></img></span>')
      if (jQ('.selectComment').length === 0) {
        jQ('body').append('<div class="selectComment"><ul>'
        + '<li>签到</li>'
        + '<li>呸</li>'
        + '<li>呵呵</li>'
        + '<li>我从未见过如此厚颜无耻之人</li>'
        + '<li>喂 妖妖灵 没错 就是上次那个人</li>'
        + '<li>盖楼</li>'
        + '</ul></div>');
      }
      jQ('.quickComment').click(function () {
        jQ('.selectComment').css({
          'left': jQ('.chapter-comment-form>input').offset().left + 'px',
          'top': jQ('.chapter-comment-form>input').offset().top + 28 + 'px'
        }).toggle();
      });
      jQ('.selectComment li').click(function () {
        jQ('.chapter-comment-form>input').val(this.innerText);
        jQ('.selectComment').hide();
      });
    }
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
