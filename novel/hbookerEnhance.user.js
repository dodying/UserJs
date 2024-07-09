/* eslint-env browser */
// ==UserScript==
// @name        hbookerEnhance
// @namespace   https://github.com/dodying/Dodying-UserJs
// @name:zh-CN  [小说]污客增强
// @description 阅读高亮，吐槽楼层提醒、跳转，快速吐槽V2，查看头像
// @description:zh-CN  阅读高亮，吐槽楼层提醒、跳转，快速吐槽V2，查看头像
// @include     http*://www.hbooker.com/chapter/book_chapter_detail/*
// @version     1.040a
// @grant       unsafeWindow
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
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
  + '.avatarShow{background-repeat:no-repeat;width:600px;height:600px;display:none;z-index:999999;position:fixed;}'
  + '.chapter-comment-page>select{border:solid 1px #000;appearance:none;-moz-appearance:none;-webkit-appearance:none;}'
  + '.quickComment{cursor:pointer;float:left;}'
  + '.selectComment{display:none;position:absolute;z-index:999999;border:solid 1px #000;background-color:white;width:410px;}'
  + '.selectComment li{list-style:square inside url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAM0lEQVQYlWNgYGBgmMDN+Z+BGDCBm/M/UYphCgkqRlaIVzG6QpyKyVZIPc/gVQRTSEgNAOvrMRtNbYwdAAAAAElFTkSuQmCC");cursor:pointer;}'
  + '.selectComment li:hover{background:#7b6959;color:#FFF;}'
  + '</style>'); // 样式设置
  jQ('#J_BarrageWrap').toggle(); // 隐藏底部弹幕条
  var checkChapter = setInterval(() => {
    if (jQ('p.chapter').length > 0) { // 普通章节
      clearInterval(checkChapter);
      addElement();
      // jQ('p.chapter>i:empty').toggle(); //隐藏吐槽数为0的圆点
      /*
      jQ('p.chapter>i').click(function () { //跳转
        jQ(document).scrollTop(jQ(this).parent().offset().top);
      });
      */
      jQ('p.chapter').click(function (e) { // 正在阅读
        jQ(this).addClass('reading');
        jQ('p.chapter').not(this).removeClass('reading');
        if (!jQ(this).next().hasClass('chapter-comment-wrap')) jQ('.chapter-comment-wrap').hide();
      });
      const mo = new MutationObserver(() => {
        setTimeout(() => {
          checkReview();
        }, 200);
      });
      mo.observe(document.all.J_BookRead, {
        childList: true,
      });
    } else if (jQ('#J_BookImage').length > 0) { // Vip章节
      clearInterval(checkChapter);
      addElement();
      jQ('.J_Num').click(() => {
        setTimeout(() => {
          checkReview();
        }, 200);
      });
    }
  }, 200);
}
function addElement() {
  jQ('body').append('<div class="avatarShow"></div>');
  jQ('body').append(() => {
    let _html = '<div class="selectComment" title="左键：填充\n右键：删除，刷新后生效"><ul>';
    if (localStorage.hbookerEnhance) {
      const set = JSON.parse(localStorage.hbookerEnhance);
      if (set.del.length > 0) {
        for (var i = 0; i < set.del.length; i++) {
          set.comment.splice(set.del[i], 1);
          set.del.splice(i, 1);
          i--;
        }
      }
      set.comment.sort((a, b) => {
        const val1 = a.count;
        const val2 = b.count;
        if (val2 < val1) {
          return -1;
        } if (val2 > val1) {
          return 1;
        }
        return 0;
      });
      localStorage.hbookerEnhance = JSON.stringify(set);
      for (var i = 0; i < set.comment.length; i++) {
        _html = `${_html}<li name="${i}">${set.comment[i].text}</li>`;
      }
    }
    _html = `${_html}<li class="addComment">(添加吐槽，可保存)</li>`;
    _html = `${_html}<li>前方高能</li>`;
    _html = `${_html}<li>怪我咯</li>`;
    _html = `${_html}<li>这个时候我该用什么表情好</li>`;
    _html = `${_html}<li>虽然看不明白，但是好像很厉害的样子</li>`;
    _html = `${_html}<li>人与人之间最基础的信任呢？</li>`;
    _html = `${_html}<li>好书，上交国家</li>`;
    _html = `${_html}<li>洪荒之力用完了</li>`;
    _html = `${_html}<li>你们城里人真会玩</li>`;
    _html = `${_html}<li>来啊，互相伤害啊</li>`;
    _html = `${_html}<li>我已经用了洪荒之力</li>`;
    _html = `${_html}</ul></div>`;
    return _html;
  });
  jQ('.addComment').click(() => {
    const word = prompt('请输入吐槽');
    if (!word) return;
    let set;
    if (localStorage.hbookerEnhance) {
      set = JSON.parse(localStorage.hbookerEnhance);
    } else {
      set = new Object();
      set.comment = new Array();
      set.del = new Array();
    }
    const temp = new Object();
    temp.text = word;
    temp.count = 0;
    set.comment.push(temp);
    localStorage.hbookerEnhance = JSON.stringify(set);
    jQ('.chapter-comment-form>input').val(word);
    jQ('.selectComment').hide();
  });
}
function checkReview() {
  jQ('.selectComment').hide(); // 隐藏快速吐槽
  jQ('.name>a:has(i)').addClass(function () { // Vip高亮
    return jQ(this).children().attr('class');
  }).attr('title', function () {
    return jQ(this).children().text().replace('• ', '');
  });
  jQ('.name>a>i').remove(); /// /Vip隐藏
  const commentCount = jQ('.chapter-comment-page>span').text().match(/\d+/)[0]; // 吐槽总数
  const pageNow = (jQ('.chapter-comment-page>a').length === 2) ? jQ('.chapter-comment-page')[0].childNodes[4].data.replace(/\s+/g, '').match(/\d+/)[0] - 1 : 0; // 当前页面
  jQ('.chapter-comment-page>span').remove();
  jQ('.img').after((i) => // 楼层提醒
    `L${commentCount - i - pageNow * 10}`);
  jQ('.J_TsukkomiOpt i').each(function () { // 热评
    if (parseInt(this.textContent) > 20) $(this).addClass('hot');
  });
  jQ('.bd:has(.J_TsukkomiOpt>.J_Zan>.hot)').css('color', 'red');
  jQ('.bd:has(.J_TsukkomiOpt>.J_Hei>.hot)').css('color', 'blue');
  jQ('.bd:has(.J_TsukkomiOpt>.J_Zan>.hot):has(.J_TsukkomiOpt>.J_Hei>.hot)').css('color', 'green');
  jQ('.chapter-comment-page').append(() => { // 跳转选项
    let _html = '上车<select>';
    let temp;
    for (let i = 0; i * 10 < commentCount; i++) {
      temp = commentCount - i * 10;
      _html = `${_html}<option value="${i}">${(temp - 9 > 0) ? temp - 9 : 1}-${temp}</option>`;
    }
    _html = `${_html}</select>`;
    return _html;
  });
  jQ('.chapter-comment-page>select').val(pageNow).change(function () { // 跳转事件
    if (jQuery('.next').hasClass('nonext')) {
      jQ('.prev').attr('data-no', this.value).click();
    } else {
      jQ('.next').attr('data-no', this.value).click();
    }
  });
  jQ('.img').off().on({ // 查看头像
    mousemove(e) {
      jQ('.avatarShow').show();
      jQ('.avatarShow').css({
        left() {
          return `${e.screenX + 10}px`;
        },
        top() {
          return `${e.screenY - 60}px`;
        },
        'background-image': `url(${jQ(this).find('img').attr('src').replace('thumb_', '')})`,
      });
    },
    mouseout() {
      jQ('.avatarShow').hide();
    },
  });
  jQ('.chapter-comment-page>a:not(.noprev,.nonext)').off().click(function () { // 处理翻页按钮
    /// *
    let parent = jQ(this).parentsUntil('.chapter-comment-wrap');
    parent = jQ(parent[parent.length - 1]).parent();
    setTimeout(() => {
      checkReview();
    }, 200);
    jQ(document).scrollTop(parent.prev().offset().top - 30);
    //* /
  });
  jQ('.date').html(function () { // 处理吐槽时间
    const text = (isNaN(parseInt(this.innerText))) ? this.title : this.innerText;
    const reTime = (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(text)) ? toRelativeTime(text) : text;
    return `<span title="${text}">${reTime}</span>`;
  });
  if (jQ('.quickComment').length === 0) { // 快速吐槽
    jQ('.chapter-comment-submit').click(() => {
      jQ('.selectComment').hide();
    });
    jQ('.chapter-comment-form>input').keydown((e) => {
      if (e.keyCode === 13) {
        jQ('.chapter-comment-submit').click();
      }
    });
    jQ('.chapter-comment-form').append('<span class="quickComment"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAJCAYAAAAGuM1UAAAAIElEQVQYlWNgoDnQ13f7TwiTpIkkm0hyHkl+IloxTQAAXH8o7GbEclEAAAAASUVORK5CYII="></img></span>');
    jQ('.quickComment').click(() => {
      jQ('.selectComment').css({
        left: `${jQ('.chapter-comment-form>input').offset().left}px`,
        top: `${jQ('.chapter-comment-form>input').offset().top + 28}px`,
      }).toggle();
    });
    jQ('.selectComment li').click(function () {
      if (this.className === 'addComment') return;
      jQ('.chapter-comment-form>input').val(this.innerText);
      if (jQ(this).attr('name') !== undefined) {
        const set = JSON.parse(localStorage.hbookerEnhance);
        set.comment[jQ(this).attr('name')].count++;
        localStorage.hbookerEnhance = JSON.stringify(set);
      }
      jQ('.selectComment').hide();
    }).contextmenu(function () {
      if (jQ(this).attr('name') !== undefined) {
        const set = JSON.parse(localStorage.hbookerEnhance);
        set.del.push(jQ(this).attr('name'));
        localStorage.hbookerEnhance = JSON.stringify(set);
      }
    });
  }
}
function toRelativeTime(date) {
  const now = new Date().getTime();
  const before = new Date(date).getTime();
  let _ = now - before;
  let i;
  let j;
  const CONVERSIONS = {
    刚刚: 1,
    秒: 1000,
    分钟: 60,
    小时: 60,
    天: 24,
    个月: 30,
    年: 12,
  };
  for (i in CONVERSIONS) {
    if (CONVERSIONS[i] > _) {
      break;
    }
    _ = _ / CONVERSIONS[i];
    j = i;
  } // return (j === '年') ? '坟' : Math.floor(_) + j + '前';

  return `${Math.floor(_) + j}前`;
}
