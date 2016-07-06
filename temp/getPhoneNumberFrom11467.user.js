// ==UserScript==
// @name        getPhoneNumberFrom11467
// @namespace   https://github.com/dodying/Dodying-UserJs
// @include     http://www.11467.com/*
// @version     1
// @grant       none
// ==/UserScript==
var phone = document.querySelectorAll('#contact>dd>img[src^="http://simg.11467.com/"]');
console.log(phone)
for (var i = 0; i < phone.length; i++) {
  phone[i].parentNode.innerHTML += phone[i].src.replace('http://simg.11467.com/n/', '').replace(/003/g, '').replace('.jpg', '');
}
