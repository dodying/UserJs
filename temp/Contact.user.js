// ==UserScript==
// @name        Contact
// @namespace   https://github.com/dodying/Dodying-UserJs
// @include     http://*.1024sj.com/
// @include     http://*.b2b.chemm.cn/
// @include     http://www.vooec.com/b2b/contact.asp?userid=*
// @include     http://*.trustexporter.com/contact/
// @include     http://*.582582.com/contact.html
// @include     http://*.mmfj.com/contact.html
// @include     http://*.707070.cn/contact.html
// @include     http://*.tfsb.cn/contact.html
// @include     http://*.company.lookchem.cn/contact/
// @include     http://*.b2b168.com/*
// @include     http://*.gtobal.com/contactus.html
// @include     http://*.11467.com/
// @include     http://www.11467.com/*/co/*.htm
// @include     http://*.china.cn/
// @include     http://*.shop.cnlist.org/
// @include     http://*.jiaju.cc/contact.html
// @include     http://*.joouoo.com/
// @include     https://*.1688.com/page/contactinfo.htm*
// @include     http://*.1688.com/contactinfo.htm*
// @include     http://www.ctoy.com.cn/com/*/contact/
// @include     http://*.caigoucheng.com/contact/
// @include     http://*.busytrade.com/communion.php
// @include     http://*.b2b.jinanfa.cn/
// @include     https://corp.1688.com/page/index.htm?memberId=*tab=companyWeb_contact
// @include     http://*.gongchang.com/contact/*
// @include     http://www.c-c.com/*/*/
// @include     http://*.51sole.com/
// @include     http://*.tonbao.com/
// @include     http://*.71ab.com/contact.asp
// @include     http://*.makepolo.com/
// @include     http://*.ce.c-c.com/
// @version     1
// @require     http://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @grant       GM_setClipboard
// ==/UserScript==
/*
var script = document.createElement('script');
script.src = 'http://libs.baidu.com/jquery/1.9.1/jquery.min.js';
document.head.appendChild(script);
*/
var host = window.location.host;
if (host.indexOf('1024sj.com') >= 0) {
  var companyName = $('td.fonttop') [0].innerText;
  var mobilePhone = $('table.tb_1 table td:contains(手机：)') [0].innerText;
  var contact = $('table.tb_1 table td:contains(联系人：)') [0].innerText;
  var address = $('table.tb_1 table td:contains(地址：)') [0].innerText;
} else if (host.indexOf('b2b.chemm.cn') >= 0) {
  var companyName = $('h2') [0].innerText;
  var mobilePhone = $('li:contains(手):contains(机)') [0].innerText;
  var contact = $('li:contains(联):contains(系):contains(人)') [0].innerText;
  var address = $('li:contains(地):contains(址)') [0].innerText;
} else if (host.indexOf('ce.c-c.com') >= 0) {
  var companyName = $('h2') [0].innerText;
  var mobilePhone = $(':hidden li:contains(手):contains(机)') [0].innerText;
  var contact = $(':hidden li:contains(联):contains(系):contains(人)') [0].innerText;
  var address = $(':hidden li:contains(地):contains(址)') [0].innerText;
} else if (host.indexOf('www.vooec.com') >= 0) {
  var companyName = $('h1') [0].innerText;
  var mobilePhone = $('table.content td.title tr>td:nth-child(2)') [3].innerText;
  var contact = $('table.content td.title tr>td:nth-child(2)') [0].innerText;
  var address = $('table.content td.title tr>td:nth-child(2)') [5].innerText;
} else if (host.indexOf('trustexporter.com') >= 0) {
  var companyName = $('div.mainkcontent tr td:nth-child(2)') [0].innerText;
  var mobilePhone = $('div.mainkcontent tr td:nth-child(2)') [3].innerText;
  var contact = $('div.mainkcontent tr td:nth-child(2)') [7].innerText;
  var address = $('div.mainkcontent tr td:nth-child(2)') [1].innerText;
} else if (host.indexOf('m') === 0 && (host.indexOf('582582.com') >= 0 || host.indexOf('mmfj.com') >= 0 || host.indexOf('707070.cn') >= 0 || host.indexOf('tfsb.cn') >= 0)) {
  var companyName = $('h1') [0].innerText;
  var mobilePhone = $('ul.sp-contact li:contains(手机)') [0].querySelector('img').src.replace(/.*content=(.*)&tel\.jpg/, '$1');
  var contact = $('ul.sp-contact li:contains(联系人)') [0].innerText;
  var address = $('ul.sp-contact li:contains(地址)') [0].innerText;
} else if (host.indexOf('582582.com') >= 0 || host.indexOf('mmfj.com') >= 0 || host.indexOf('707070.cn') >= 0 || host.indexOf('tfsb.cn') >= 0) {
  var companyName = $('.comname') [0].innerText;
  var mobilePhone = $('div.main ul.box_con-dlist li:contains(手机)') [0].querySelector('img').src.replace(/.*content=(.*)&tel\.jpg/, '$1');
  var contact = $('div.main ul.box_con-dlist li:contains(联系人)') [0].innerText;
  var address = $('div.main ul.box_con-dlist li:contains(地址)') [0].innerText;
} else if (host.indexOf('company.lookchem.cn') >= 0) {
  var companyName = $('div.content ul li strong') [0].innerText;
  var mobilePhone = $('div.content ul li strong') [6].innerText;
  var contact = $('div.content ul li strong') [1].innerText;
  var address = $('div.content ul li strong') [2].innerText;
} else if (host.indexOf('gtobal.com') >= 0) {
  var companyName = $('#c_name h2') [0].innerText;
  var mobilePhone = $('li:contains(手机)') [0].innerText;
  var contact = $('li:contains(联系人)') [0].innerText;
  var address = $('li:contains(地址)') [0].innerText;
} else if (host.indexOf('www.11467.com') >= 0) {
  var companyName = $('h1') [0].innerText;
  var mobilePhone = $('dl#contact dt:contains(手机)+dd') [0].querySelector('img').src.replace('http://simg.11467.com/n/', '').replace(/003|002/g, '').replace(/D/g, '-').replace('.jpg', '');
  //var contact = $('dl#contact dt:contains(业务经理)+dd') [0].innerText;
  var contact = '';
  var address = $('dl#contact dt:contains(地址)+dd') [0].innerText;
} else if (host.indexOf('11467.com') >= 0) {
  console.log($('div.f_l:nth-child(1) > div:nth-child(1) > div:nth-child(2) tr'))
  var companyName = $('div.f_l:nth-child(1) > div:nth-child(1) > div:nth-child(2) tr') [0].innerText;
  var mobilePhone = $('div.f_l:nth-child(1) > div:nth-child(1) > div:nth-child(2) tr') [3].querySelector('img').src.replace('http://simg.11467.com/n/', '').replace(/003|002/g, '').replace(/D/g, '-').replace('.jpg', '');
  //var contact = $('div.f_l:nth-child(1) > div:nth-child(1) > div:nth-child(2) tr') [0].innerText;
  var contact = '';
  var address = $('div.f_l:nth-child(1) > div:nth-child(1) > div:nth-child(2) tr') [4].innerText;
} else if (host.indexOf('jiaju.cc') >= 0) {
  var companyName = $('#company-intro tr td:nth-child(2)') [0].innerText;
  var mobilePhone = $('#company-intro tr td:nth-child(2)') [5].innerText;
  var contact = $('#company-intro tr td:nth-child(2)') [1].innerText;
  var address = $('#company-intro tr td:nth-child(2)') [6].innerText;
} else if (host.indexOf('joouoo.com') >= 0) {
  var companyName = $('h2 a') [0].innerText;
  var mobilePhone = $('div.contact ul li:contains(联):contains(系):contains(人) span') [0].innerText;
  var contact = $('div.contact ul li:contains(手):contains(机) span') [0].innerText;
  var address = $('div.contact ul li:contains(公司地址) span') [0].innerText;
} else if (host.indexOf('corp.1688.com') >= 0 || host.indexOf('busytrade.com') >= 0 || host.indexOf('www.ctoy.com.cn') >= 0 || host.indexOf('caigoucheng.com') >= 0 || host.indexOf('71ab.com') >= 0) {
  var companyName = $('h1') [0].innerText;
  var mobilePhone = $('td:contains(移动电话)+td') [0].innerText;
  var contact = $('td:contains(联系人)+td') [0].innerText;
  var address = $('td:contains(地址)+td') [0].innerText;
} else if (host.indexOf('1688.com') >= 0 || host.indexOf('china.cn') >= 0 || host.indexOf('shop.cnlist.org') >= 0 || host.indexOf('gongchang.com') >= 0 || host.indexOf('www.b2b168.com') >= 0) {
  var companyName = $('h1,.com-name') [0].innerText;
  var mobilePhone = $('dt:contains(移动电话)+dd,dt:contains(手):contains(机)+dd') [0].innerText;
  var contact = $('dt:contains(联):contains(系):contains(人)+dd') [0].innerText;
  var address = $('dt:contains(地):contains(址)+dd') [0].innerText;
} else if (host.indexOf('b2b.jinanfa.cn') >= 0) {
  var companyName = $('h1') [0].innerText;
  var mobilePhone = $('.mod-contact p:contains(手机)') [0].innerText;
  var contact = $('.mod-contact p:contains(联系人)') [0].innerText;
  var address = $('.mod-contact p:contains(地址)') [0].innerText;
} else if (host.indexOf('www.c-c.com') >= 0) {
  var companyName = $('.pcd-cname') [0].innerText;
  var mobilePhone = $('.contact-info ul li:contains(手机)') [0].innerText;
  var contact = $('.contact-info ul li:contains(联系人)') [0].innerText;
  var address = $('.contact-info ul li:contains(地址)') [0].innerText;
} else if (host.indexOf('51sole.com') >= 0) {
  var companyName = $('h1') [0].innerText;
  var mobilePhone = $('#navcontact ul li:contains(手机) span') [0].innerText;
  var contact = $('#navcontact ul li:contains(联系人) span') [0].innerText;
  var address = $('#navcontact ul li:contains(地址) span') [0].innerText;
} else if (host.indexOf('tonbao.com') >= 0) {
  var companyName = $('h1') [0].innerText;
  var mobilePhone = $('.side_body ul li:contains(手机)') [0].innerText;
  var contact = $('.side_body ul li:contains(联系人)') [0].innerText;
  //var address = $('.side_body ul li:contains(地址)') [0].innerText;
  var address = '';
} else if (host.indexOf('makepolo.com') >= 0) {
  var companyName = $('h1') [0].innerText;
  var mobilePhone = $('.com_messages span:contains(手机)+span') [0].innerText;
  var contact = $('.com_messages span:contains(联系人)+span') [0].innerText;
  //var address = $('.com_messages span:contains(地址)+span') [0].innerText;
  var address = '';
}
mobilePhone = decodeURIComponent(mobilePhone).replace(/^0+/, '').replace(/\s+/, '').replace('手机号码：', '').replace('手机：', '');
contact = contact.replace(/\s+/g, '').replace('联系人：', '').replace('姓名：', '').replace(/\(.*\)/, '').replace(/（.*）/, '').replace('先生', '').replace('女士', '').replace('经理', '');
address = address.replace(/\s+/, '').replace('公司地址：', '').replace('地址：', '');
var output = companyName + '\t' + mobilePhone + '\t' + contact + '\t' + address;
output = output.replace(/[\r\n]/g, '');
//console.log(output);
//alert(mobilePhone + '\n已复制到剪贴板\n公司名称\t手机号码\t联系人\t公司地址\n' + output);
document.title = mobilePhone || '不存在';
GM_setClipboard(output);