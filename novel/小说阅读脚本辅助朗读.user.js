// ==UserScript==
// @name        小说阅读脚本辅助朗读
// @description 小说阅读脚本辅助朗读
// @include     *
// @version     1.0.287
// @created     2020-12-11 13:05:42
// @modified    2021/1/9 20:57:53
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// ==/UserScript==
/* global GM_setValue GM_getValue */
/* global $ */
/* eslint-disable no-debugger  */
(function () {
  'use strict';
  const config = GM_getValue('config', {
    lucky: false,
    voice: window.speechSynthesis.getVoices().find(i => i.default) ? window.speechSynthesis.getVoices().find(i => i.default).name : null,
    volume: 1,
    rate: 1,
    pitch: 1
  });

  const addSpeakButton = () => {
    $('<div style="position:fixed;top:10px;right:72px;z-index:1597;font-size:16px;cursor:pointer;">').html('\u23f8').insertBefore('#preferencesBtn').on({ // 暂停按钮
      click: (e) => {
        if (!window.speechSynthesis.speaking) return;
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
          $(e.target).html('\u23f8');
        } else {
          window.speechSynthesis.pause();
          $(e.target).html('\u23f5');
        }
      }
    });
    $('<div style="position:fixed;top:10px;right:36px;z-index:1597;font-size:16px;cursor:pointer;">').html('\ud83c\udfa4').insertBefore('#preferencesBtn').on({
      click: () => config.lucky ? speakMyNovelReader() : toogleSpeakPanel(),
      contextmenu: (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        toogleSpeakPanel();
      }
    });
  };
  if ($('body[name="MyNovelReader"]').length) {
    addSpeakButton();
  } else {
    const observer = new window.MutationObserver(mutationsList => {
      if ($('body[name="MyNovelReader"]').length) {
        observer.disconnect();
        addSpeakButton();
      }
    });
    observer.observe(document.body, { attributes: true });
  }

  function toogleSpeakPanel () {
    const container = $('<div id="speakPanel">').html([
      '<style>',
      '#speakPanel{position:fixed;top:0;left:0;z-index:1597;width:100vw;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:center;}',
      '#speakPanel>div{background:#fff;}',
      '#speakPanel div.config>div>:nth-child(1){display:inline-block;width:150px;}',
      '#speakPanel div.config>div>input[type="range"]::after{content:attr(value)}',
      '</style>',

      '<div>',

      ' <div class="config">',
      '   <div><input type="checkbox" name="lucky" id="speakLucky"><label for="speakLucky">点击按钮，直接开始朗读</label></div>',
      '   <div><label for="speakVoice">Voice</label><select name="voice" id="speakVoice"></select></div>',
      '   <div><label for="speakVolume">音量</label><input type="range" min="0" max="1" step="0.05" name="volume" id="speakVolume"></div>',
      '   <div><label for="speakRate">语速</label><input type="range" min="0.1" max="10" step="0.1" name="rate" id="speakRate"></div>',
      '   <div><label for="speakPitch">声调</label><input type="range" min="0" max="2" step="0.1" name="pitch" id="speakPitch"></div>',
      ' </div>',

      ' <hr>',
      ' <div>',
      '  <div><button name="selectText">选择文本</button></div>', // TODO
      '  <div><button name="startSpeak">开始朗读</button></div>', // TODO
      ' </div>',

      '</div>'
    ].join('')).insertAfter('body').on({
      click: e => {
        if ($(e.target).is(container)) {
          container.remove();
        }
      }
    });
    container.find('.config').find('input,select,textarea').on({ // 应用并保存设置 // TODO 朗读时更改设置
      change: e => {
        const elem = e.target;
        const key = elem.name;
        if (elem.type === 'checkbox') {
          config[key] = elem.checked;
        } else if (elem.type === 'select-one') {
          config[key] = elem.value;
        } else if (elem.type === 'range') {
          config[key] = elem.value;
          elem.setAttribute('value', config[key]);
        }
        GM_setValue('config', config);
      }
    });

    loadVoices();
    window.speechSynthesis.onvoiceschanged = function (e) {
      loadVoices();
    };

    for (const key in config) { // 读取设置
      const elem = $(`.config [name=${key}]`, container).get(0);
      if (elem.type === 'checkbox') {
        elem.checked = config[key];
      } else if (elem.type === 'select-one') {
        elem.value = [...elem.options].map(i => i.value).includes(config[key]) ? config[key] : elem.options[0].value;
      } else if (elem.type === 'range') {
        elem.value = config[key];
        elem.setAttribute('value', config[key]);
      }
    }

    function loadVoices () {
      $('.config #speakVoice', container).empty();
      window.speechSynthesis.getVoices().forEach(voice => {
        $('<option>').text(voice.name).val(voice.name).attr('selected', voice.default).appendTo('.config #speakVoice', container);
      });
    }
  }

  function speakMyNovelReader () {
    console.log('lucky');
    let stack = 0;

    let cancel, cancelCompleted, interval;
    $(window).on({
      click: (e) => {
        if (!$(e.target).is('#mynovelreader-content>article>*:not(.chapter-footer-nav)')) return;
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
        cancel = true;
        window.speechSynthesis.cancel();
        interval = setInterval(() => {
          if (cancelCompleted && !window.speechSynthesis.paused && !window.speechSynthesis.pending && !window.speechSynthesis.speaking) {
            clearInterval(interval);
            interval = null;
            cancelCompleted = false;
            cancel = false;
            speakTheseElems($(e.target).nextAll().addBack());
          }
        }, 20);
      }
    });
    speakTheseElems($($('#chapter-list>.active>div').attr('href')).children().toArray());

    async function speakTheseElems (elemsToSpeak) {
      const stackNow = stack++;
      for (const elem of elemsToSpeak) {
        if ($(elem).is('.chapter-footer-nav')) break;
        console.log(stackNow);

        elem.style.background = 'white';
        elem.scrollIntoViewIfNeeded ? elem.scrollIntoViewIfNeeded() : elem.scrollIntoView();
        await new Promise((resolve, reject) => {
          const text = elem.textContent.trim();

          var utterThis = new window.SpeechSynthesisUtterance(text);
          utterThis.voice = window.speechSynthesis.getVoices().find(i => i.name === config.voice);
          utterThis.volume = config.volume;
          utterThis.rate = config.rate;
          utterThis.pitch = config.pitch;
          // Object.assign(utterThis, config);
          // utterThis.addEventListener('boundary', (e) => { // 当前朗读字词
          //   console.log(text.substr(e.charIndex, e.charLength));
          // });
          utterThis.addEventListener('end', () => {
            resolve();
          });
          // for (const i of ['error', 'mark', 'pause', 'resume', 'start']) {
          //   utterThis.addEventListener(i, (...args) => {
          //     console.log(i, args);
          //   });
          // }
          window.speechSynthesis.speak(utterThis);
        });
        elem.style.background = '';
        if (cancel) break;
      }

      if (!cancel && $(elemsToSpeak).filter('.chapter-footer-nav').last().find('.next-page:not([style="color:#666666"])').length) {
        const $article = $(elemsToSpeak).filter('.chapter-footer-nav').last().find('.next-page:not([style="color:#666666"])').parents('#mynovelreader-content>article');

        let interval;
        interval = setInterval(() => {
          if ($article.next().length) {
            clearInterval(interval);
            speakTheseElems($article.next().children().toArray());
            interval = null;
          }
        }, 200);
      }
      cancelCompleted = true;
    }
  }
})();
