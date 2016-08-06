// ==UserScript==
// @name         贴吧去登录提示
// @namespace    none
// @version      0.1
// @description  免登录贴吧查看楼中楼.翻页
// @match        http://tieba.baidu.com/*
// @include      http://tieba.baidu.com/*
// ==/UserScript==

var islogin = document.createElement('script');
islogin.innerHTML = "PageData.user.is_login = true;";
document.head.appendChild(islogin);
