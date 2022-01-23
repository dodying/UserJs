/* eslint-env browser */
// ==UserScript==
// @name        小说阅读脚本增强
// @description 移除鼠标双击事件，增加翻页按钮
// @include     *
// @version     1.0.326
// @created     2020-07-20 08:45:13
// @modified    2021-12-08 20:01:18
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// @grant       unsafeWindow
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// ==/UserScript==
/* global GM_setValue GM_getValue GM_registerMenuCommand */
/* global $ */
/* eslint-disable no-debugger  */
(function () {
  let scrollElement = window.innerHeight === document.documentElement.clientHeight ? document.documentElement : document.body;
  let compareElement = scrollElement === document.documentElement ? $('*').toArray().map((i) => [i, i.clientHeight]).sort((a, b) => b[1] - a[1])[0][0] : document.documentElement;

  const blacklist = GM_getValue('blacklist', []);
  const { host } = window.location;
  if (blacklist.includes(host)) {
    GM_registerMenuCommand(`newTab: Effect ${host}`, () => {
      const blacklist = GM_getValue('blacklist', []);
      if (blacklist.includes(host)) {
        blacklist.splice(blacklist.indexOf(host), 1);
        GM_setValue('blacklist', blacklist);
        window.location.reload();
      }
    }, 'N');
  } else {
    // let compareElement = scrollElement === document.documentElement ? document.body : document.documentElement;
    init();
  }

  async function init() {
    window.cancelAnimationFrame = () => { };
    $('html').on('dblclick', (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    });

    if (compareElement.clientHeight > scrollElement.clientHeight) {
      addScrollButton();
    } else {
      const eventType = 'mousemove mousedown keydown scroll resize blur focus';
      let observer;
      const checkScrollBar = () => {
        scrollElement = window.innerHeight === document.documentElement.clientHeight ? document.documentElement : document.body;
        compareElement = scrollElement === document.documentElement ? $('*').toArray().map((i) => [i, i.clientHeight]).sort((a, b) => b[1] - a[1])[0][0] : document.documentElement;
        if (compareElement.clientHeight > scrollElement.clientHeight) {
          if (observer) {
            observer.disconnect();
            observer = null;
          }
          addScrollButton();
          $(window).off(eventType, checkScrollBar);
        }
      };

      observer = new window.MutationObserver(checkScrollBar);
      observer.observe(scrollElement, {
        childList: true,
        subtree: true,
      });
      $(window).on(eventType, checkScrollBar);
    }
  }

  function addScrollButton() {
    $('<scroll-button>').css({ all: 'initial' }).insertAfter('body');
  }

  // Create a class for the element
  class scrollButton extends window.HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();

      const shadow = this.attachShadow({ mode: 'open' });

      const style = document.createElement('style');
      style.textContent = [
        '.container{position:fixed;top:50%;right:10%;display:flex;flex-direction:column;transform:translateY(-50%);z-index:2147483647;width:60px;user-select:none;}',
        '.button{width:60px;height:60px;cursor:pointer;font-weight:700;border:2px solid #9b9b9b;background-color:#fff;font-size:xx-large;}',
        '[name="up"]:before{content:"▲";}',
        '[name="down"]:before{content:"▼";}',
        '.line{position:fixed;background:#000;width:5px;display:none;}',
      ].join('\n');

      const container = document.createElement('div');
      container.setAttribute('class', 'container');
      let offset = {};
      container.addEventListener('mousedown', (e) => {
        if (e.ctrlKey) container.setAttribute('draggable', true);
        offset = {
          x: e.offsetX,
          y: e.offsetY,
        };
      });
      container.addEventListener('dragend', (e) => {
        const containerPosition = GM_getValue('position', {});
        const position = {
          left: e.clientX - offset.x,
          top: e.clientY - offset.y,
        };
        $(container).css({
          ...position,
          right: 'unset',
          transform: 'unset',
        });
        containerPosition[window.location.host] = position;
        GM_setValue('position', containerPosition);
      });
      const containerPosition = GM_getValue('position', {});
      if (containerPosition[window.location.host]) {
        $(container).css({
          ...containerPosition[window.location.host],
          right: 'unset',
          transform: 'unset',
        });
      }

      let step = scrollElement.clientHeight - 30;

      const upBtn = document.createElement('button');
      upBtn.setAttribute('class', 'button');
      upBtn.setAttribute('name', 'up');
      upBtn.addEventListener('click', () => {
        $(scrollElement).finish().animate({ scrollTop: scrollElement.scrollTop - step }, 500, 'swing', () => { });
      });

      const lineTop = document.createElement('div');
      lineTop.setAttribute('class', 'line');
      lineTop.style = `top:0;left:45vw;height:${step}px;`;
      const lineBottom = document.createElement('div');
      lineBottom.setAttribute('class', 'line');
      lineBottom.style = `bottom:0;right:45vw;height:${step}px;`;

      const stepInput = document.createElement('input');
      stepInput.setAttribute('name', 'step-input');
      stepInput.setAttribute('type', 'number');
      stepInput.setAttribute('min', 10);
      stepInput.setAttribute('step', 30);
      stepInput.setAttribute('value', step);
      stepInput.addEventListener('change', (e) => {
        step = e.target.value * 1;
        lineTop.style.height = `${step}px`;
        lineBottom.style.height = `${step}px`;
      });
      stepInput.addEventListener('focus', (e) => {
        lineTop.style.display = 'block';
        lineBottom.style.display = 'block';
      });
      stepInput.addEventListener('blur', (e) => {
        lineTop.style.display = 'none';
        lineBottom.style.display = 'none';
      });

      const downBtn = document.createElement('button');
      downBtn.setAttribute('class', 'button');
      downBtn.setAttribute('name', 'down');
      downBtn.addEventListener('click', () => {
        $(scrollElement).finish().animate({ scrollTop: scrollElement.scrollTop + step }, 500, 'swing', () => { });
      });

      shadow.appendChild(style);
      shadow.appendChild(container);
      shadow.appendChild(lineTop);
      shadow.appendChild(lineBottom);
      container.appendChild(upBtn);
      container.appendChild(stepInput);
      container.appendChild(downBtn);

      GM_registerMenuCommand('重置位置', () => {
        const containerPosition = GM_getValue('position', {});
        delete containerPosition[window.location.host];
        GM_setValue('position', containerPosition);

        $(container).css({
          top: '50%',
          left: 'unset',
          right: '10%',
          transform: 'translateY(-50%)',
        });
      });
    }
  }

  // Define the new element
  window.customElements.define('scroll-button', scrollButton);
}());
