/* eslint-env browser */
// ==UserScript==
// @name        []highlight
// @include     *
// @version     1.0.4
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://github.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// @grant       none
// ==/UserScript==
(function () {
  /**
   * id from https://chrome.google.com/webstore/detail/highlight-this-finds-and/fgmbnmjmbjenlhbefngfibmjkpbcljaj
   * but sometimes doesn't work
  */

  const STYLE = 'color:#000;padding:1px;margin:1px;box-shadow:#e5e5e5 1px 1px;border-radius:3px;font-style:inherit;';
  /**
   * {
   *  include*: {string} or {array}, url to match
   *  exclude : {string} or {array}, url to not match
   *  match  *: {object array} => match: [{ text: "str" }]
   *            {string}       => match: "str"
   *            {string array} => match: ["str1", "str2"]
   *            {object}       => match: { text: "str" }
   *  element : {string}, css selector to filter effect element
   *  style   : {string}, css
   *  priority: {number}, default 0
   *
   * NOTE: mark with star symbol (*) MUST be given
   *       you can set {element, style, priority} in each {match} object
   * }
   */
  const CONFIG = [{
    include: 'bgm.tv',
    match: [{
      text: '\\d+年\\d+月',
      style: 'background-color:#ff6;',
    }, {
      text: ['TV', 'OVA', '里番', '剧场版', '特摄', 'OV', '续作'],
      style: 'background-color:#a0ffff;',
    }, {
      text: ['原创', '漫改', '轻改', '游改'],
      style: 'background-color:#0DD5FC;',
    }],
    element: '.tip',
  }];

  // const $ = e => document.querySelector(e)
  const $$ = (e) => document.querySelectorAll(e);
  const $_ = (e) => document.createElement(e);
  const $t = (e) => document.createTextNode(e);

  const IgnoreTags = 'form,input,textarea,select,optgroup,option,isindex,datalist,keygen,frame,frameset,noframes,iframe,img,area,canvas,audio,source,track,video,link,menu,menuitem,thead,tbody,tfoot,col,colgroup,style,head,meta,base,basefont,script,noscript,applet,embed,object,param'.split(',').map((i) => i.toUpperCase());

  const style = [];
  const styleGlobal = [];
  CONFIG.forEach((i) => {
    // filter url
    if (!([].concat(i.include).some((j) => window.location.href.match(j))) || [].concat(i.exclude).filter((j) => j).some((j) => window.location.href.match(j))) return;

    let rule = i.match;
    // foramt match
    if (typeof rule === 'string' || (Array.isArray(rule) && rule.every((j) => typeof j === 'string'))) {
      // match: "str"
      // or
      // match: ["str1", "str2"]
      rule = [{
        text: rule,
      }];
    } else if (Object.prototype.toString.call(rule) === '[object Object]' && 'text' in rule) {
      // match: { text: "str" }
      rule = [rule];
    }

    // Check foramt of match
    const checkFormat = Array.isArray(rule) && rule.every((j) => Object.prototype.toString.call(j) === '[object Object]' && 'text' in j);
    if (!checkFormat) {
      console.error('unknown config: ', rule);
      return;
    }

    // generate a random className
    const className = `highlight_${Math.random().toString().substr(2)}`;
    if (i.style) style.push(`.${className}{${i.style}}`);
    styleGlobal.push(`.${className}`);

    // set default priority;
    let priority = i.priority || 0;

    // main function
    rule.forEach((j) => {
      if ('priority' in j) priority = j.priority;
      const text = [].concat(j.text);

      text.forEach((k) => {
        let iElement;
        if (i.element) iElement = [...$$(i.element)];
        let element = [...$$('*')].filter((i) => !(IgnoreTags.includes(i.tagName)) && [...i.childNodes].some((j) => j.nodeName === '#text' && j.textContent.trim()));
        if (i.element) element = element.filter((node) => iElement.includes(node));
        if (j.element) {
          const jElement = [...$$(j.element)];
          element = element.filter((node) => jElement.includes(node));
        }
        element = element.map((i) => Array.apply(null, i.childNodes).filter((j) => j.nodeName === '#text' && j.textContent.trim()));
        element = [].concat.apply([], element);
        element.forEach((l) => {
          if (l.textContent.match(k) && (!('priority' in l) || priority >= l.priority)) {
            const regexp = l.textContent.match(k);
            const preWord = l.textContent.substr(0, regexp.index);
            const sufWord = l.textContent.substr(regexp.index + regexp[0].length);
            const ele = $_('em');
            ele.className = className;
            if (j.style) ele.style = j.style;
            const textNode = $t(regexp[0]);
            textNode.priority = priority;
            ele.appendChild(textNode);
            const { parentNode } = l;
            if (preWord) parentNode.insertBefore($t(preWord), l);
            if (sufWord) {
              if (l.nextSibling) {
                parentNode.insertBefore($t(sufWord), l.nextSibling);
              } else {
                parentNode.appendChild($t(sufWord));
              }
            }
            parentNode.replaceChild(ele, l);
          }
        });
      });
    });
  });
  const styleEle = $_('style');
  styleEle.textContent = `${styleGlobal.join(',\r\n')}{${STYLE}}` + `\r\n${
    styleGlobal.map((i) => `${i}::before,${i}::after`).join(',\r\n')}{content:"\\0020";}` + `\r\n${
    style.join('\r\n')}`;
  document.head.appendChild(styleEle);
}());
