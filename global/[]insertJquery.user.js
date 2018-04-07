// ==UserScript==
// @name        []insertJquery
// @include     *
// @version     1.0.0
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       GM_getResourceText
// @grant       unsafeWindow
// @resource jquery https://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
// ==/UserScript==
(function() {
  'use strict';
  let W = unsafeWindow;

  if (W.$ && W.$.fn && W.$.fn.jquery) {
    console.log('Don\'t need to insert jQuery: ' + W.$.fn.jquery);
    return;
  }

  if (window.outerWidth - window.innerWidth > 20 || window.outerHeight - window.innerHeight > 100) { //https://www.zhihu.com/question/24188524/answer/116988937
    W.eval(GM_getResourceText('jquery'));
    console.log('jquery inserted');
  } else { //来源: https://www.zhihu.com/question/24188524/answer/117094116
    let insert = false;
    var re = /x/;
    console.log(re);

    re.toString = function() {
      if (!insert) {
        insert = true;
        W.eval(GM_getResourceText('jquery'));
        return 'jquery inserted';
      }
      //return '第 ' + (++i) + ' 次打开控制台';
    };
  }

})();
