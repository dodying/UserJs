// ==UserScript==
// @name        githubEnforceCommit
// @name:zh-CN  [Github]强制Commit
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description:zh-CN  养成好习惯
// @include     https://github.com/*/edit/*
// @version     1
// @grant       none
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// ==/UserScript==
document.getElementById('submit-file').onclick = function() {
  if (document.getElementById('commit-summary-input').value === '' && !confirm('commit为空，确定提交？')) return false;
};
