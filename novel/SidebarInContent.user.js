/* eslint-env browser */
// ==UserScript==
// @name        SidebarInContent
// @name:zh-CN  【小说】目录页侧边分卷导航栏
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description:zh-CN
// @include     http://read.qidian.com/BookReader/*.aspx*
// @include     http://b.faloo.com/f/*.html*
// @include     http://chuangshi.qq.com/bk/*/*-l.html*
// @include     http://book.zongheng.com/showchapter/*.html*
// @include     http://www.17k.com/list/*.html*
// @version     1
// @grant       none
// @run-at      document-idle
// ==/UserScript==
const Lib = {
  'read.qidian.com': {
    BookNameSele: 'div.booktitle>h1',
    BookSubSele: 'div#content>div.box_title>div.title>b',
    OtherStyle: 'background-color:#E7F4FE;color:#004e00;',
  },
  'b.faloo.com': {
    BookNameSele: 'h1.a_24b',
    BookSubSele: 'div.ni_list>table>tbody>tr:nth-child(1)>td:nth-child(1)>h1',
    OtherStyle: '',
  },
  'chuangshi.qq.com': {
    BookNameSele: 'i.grey+a>b',
    BookSubSele: 'h1.juan_height',
    OtherStyle: '',
  },
  'book.zongheng.com': {
    BookNameSele: 'h1',
    BookSubSele: 'h5.chap_li',
    OtherStyle: '',
  },
  'www.17k.com': {
    BookNameSele: 'h1',
    BookSubSele: 'span.tit',
    OtherStyle: '',
  },
};
const Host = window.location.host;
if (Host in Lib) {
  const { BookNameSele } = Lib[Host];
  const { BookSubSele } = Lib[Host];
  const { OtherStyle } = Lib[Host];
  const BookName = document.querySelector(BookNameSele).innerText;
  const TopBar = document.createElement('div');
  TopBar.style = `z-index:999999;top:0px;position:absolute;width:24px;word-break:keep-all;overflow-y:hidden;font-weight:bold;${OtherStyle}`;
  TopBar.onmouseover = function () {
    this.style.overflowY = 'visible';
  };
  TopBar.onmouseout = function () {
    this.style.overflowY = 'hidden';
  };
  const anchor = document.querySelectorAll(BookSubSele);
  // console.log(anchor)
  for (let i = 0; i < anchor.length; i++) {
    const name = anchor[i].innerText.replace(BookName, '').replace(/\s+/g, '').replace('[订阅VIP章节成为起点VIP会员]', '').replace('[分卷阅读]', '')
      .replace('[我要充值]', '');
    anchor[i].innerHTML = `<a name="${i}">${anchor[i].innerHTML}</a>`;
    TopBar.innerHTML = `${TopBar.innerHTML}<a href="#${i}">${name}</a><HR width="80%" color=black SIZE=1>`;
  }
  document.body.appendChild(TopBar);
  window.onscroll = function () {
    TopBar.style.top = `${document.documentElement.scrollTop}px`;
  };
}
