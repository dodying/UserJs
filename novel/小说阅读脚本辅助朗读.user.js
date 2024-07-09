/* eslint-env browser */
// ==UserScript==
// @name        小说阅读脚本辅助朗读
// @description 小说阅读脚本辅助朗读
// @include     *
// @version     1.0.424
// @created     2020-12-11 13:05:42
// @modified    2023-10-08 11:54:59
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @noframes
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// ==/UserScript==
/* global GM_setValue GM_getValue GM_registerMenuCommand */
/* global $ */
/* eslint-disable no-debugger  */
(async function () {
  const config = GM_getValue('config', {
    lucky: false,
    voice: window.speechSynthesis.getVoices().find((i) => i.default) ? window.speechSynthesis.getVoices().find((i) => i.default).name : null,
    volume: 1,
    rate: 1,
    pitch: 1,
  });

  const addSpeakButton = () => {
    $('<div style="position:fixed;top:10px;right:36px;z-index:1597;font-size:16px;cursor:pointer;">').html('\ud83c\udfa4').insertBefore('#preferencesBtn').on({
      click: () => {
        if (config.lucky) {
          speakMyNovelReader();
        } else {
          toogleSpeakPanel();
        }
      },
      contextmenu: (e) => {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        toogleSpeakPanel();
      },
    });
    $(window).on({
      'keydown.pause': (e) => {
        if (!e.key.match(/^(Pause)$/i)) return;
        if (config.lucky) {
          speakMyNovelReader();
        } else {
          toogleSpeakPanel();
        }
        $(window).off('keydown.pause');
      },
    });
  };
  if ($('body[name="MyNovelReader"]').length) {
    addSpeakButton();
  } else {
    $(window).on({
      [[
        'resize', 'scroll', 'visibilitychange',
        'blur', 'focus', 'focusin', 'focusout',

        'keydown', 'keyup', 'keypress',
        'compositionend', 'compositionstart', 'compositionupdate',

        'click', 'auxclick', 'contextmenu', 'dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup',
        'pointerlockchange', 'pointerlockerror', 'select', 'wheel', 'mousewheel',
        'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop',

        'touchcancel', 'touchend', 'touchenter', 'touchleave', 'touchmove', 'touchstart',

        'fullscreenchange', 'fullscreenerror',
        'copy', 'cut', 'paste',
      ].map((i) => `${i}.speak`).join(' ')]: (e) => {
        if ($('body[name="MyNovelReader"]').length && $('#preferencesBtn').length) {
          $(window).off('.speak');
          addSpeakButton();
        }
      },
    });
    setTimeout(() => {
      $(window).off('.speak');
    }, 60 * 1000);
    // const observer = new window.MutationObserver((mutationsList) => {
    //   if ($('body[name="MyNovelReader"]').length) {
    //     observer.disconnect();
    //     addSpeakButton();
    //   }
    // });
    // observer.observe(document.documentElement, { attributes: true, subtree: true, childList: true });
  }
  GM_registerMenuCommand('addSpeakButton', addSpeakButton, 'S');

  function toogleSpeakPanel() {
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

      '</div>',
    ].join('')).insertAfter('body').on({
      click: (e) => {
        if ($(e.target).is(container)) {
          container.remove();
        }
      },
    });
    container.find('.config').find('input,select,textarea').on({ // 应用并保存设置 // TODO 朗读时更改设置
      change: (e) => {
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
      },
    });

    loadVoices();
    window.speechSynthesis.onvoiceschanged = function (e) {
      loadVoices();
    };

    for (const key of Object.keys(config)) { // 读取设置
      const elem = $(`.config [name=${key}]`, container).get(0);
      if (elem.type === 'checkbox') {
        elem.checked = config[key];
      } else if (elem.type === 'select-one') {
        elem.value = [...elem.options].map((i) => i.value).includes(config[key]) ? config[key] : elem.options[0].value;
      } else if (elem.type === 'range') {
        elem.value = config[key];
        elem.setAttribute('value', config[key]);
      }
    }

    function loadVoices() {
      $('.config #speakVoice', container).empty();
      window.speechSynthesis.getVoices().forEach((voice) => {
        $('<option>').text(voice.name).val(voice.name).attr('selected', voice.default)
          .appendTo('.config #speakVoice', container);
      });
    }
  }

  const elemSelector = '#mynovelreader-content>article>:not(.chapter-footer-nav):not(.content),#mynovelreader-content>article>.content>*';
  let cancel, cancelCompleted, interval, currentElem;
  function speakMyNovelReader() {
    console.log('lucky');
    // let stack = 0;

    const readThis = function (elem) {
      if (!$(elem).is(elemSelector)) return;
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
          speakTheseElems($(elem).nextAll().addBack());
        }
      }, 20);
    };

    const btnPause = $('<div style="position:fixed;top:50px;right:10px;z-index:1597;font-size:16px;cursor:pointer;">').html('<button style="width:80px;height:80px;cursor:pointer;font-weight:700;border:2px solid #9b9b9b;background-color:#fff;font-size:xx-large;">\u23f8</button>').insertBefore('#preferencesBtn').on({ // 暂停按钮
      click: (e) => {
        if (!window.speechSynthesis.speaking) return;
        if (window.speechSynthesis.paused) { // || $(e.delegateTarget).find('button').text() === '\u23f5'
          window.speechSynthesis.resume();
          $(e.delegateTarget).find('button').text('\u23f8');
        } else {
          window.speechSynthesis.pause();
          $(e.delegateTarget).find('button').text('\u23f5');
        }
      },
    });
    $('<div style="position:fixed;top:140px;right:10px;z-index:1597;font-size:16px;cursor:pointer;">').html('<button style="width:80px;height:80px;cursor:pointer;font-weight:700;border:2px solid #9b9b9b;background-color:#fff;font-size:xx-large;">-1/5</button>').insertBefore('#preferencesBtn').on({
      mousedown: (e) => {
        const $all = $(elemSelector);
        let index = $all.index(currentElem);
        index = e.button === 0 ? index - 1 : index - 5;
        if (index < 0) index = 0;
        readThis($all.get(index));
      },
      contextmenu: () => false,
    });
    $('<div style="position:fixed;top:230px;right:10px;z-index:1597;font-size:16px;cursor:pointer;">').html('<button style="width:80px;height:80px;cursor:pointer;font-weight:700;border:2px solid #9b9b9b;background-color:#fff;font-size:xx-large;">+1/5</button>').insertBefore('#preferencesBtn').on({
      mousedown: (e) => {
        const $all = $(elemSelector);
        let index = $all.index(currentElem);
        index = e.button === 0 ? index + 1 : index + 5;
        if (index >= $all.length) index = $all.length - 1;
        readThis($all.get(index));
      },
      contextmenu: () => false,
    });
    $(window).on({
      click: (e) => {
        readThis(e.target);
      },
      keydown: (e) => {
        if (!e.key.match(/^([zZxX0.]|Insert|Delete|Home|End|Pause)$/i)) return;
        if (['Pause'].includes(e.key)) { btnPause.click(); return; }
        const $all = $(elemSelector);
        let index = $all.index(currentElem);
        if (['z', '0'].includes(e.key)) {
          index = index - 1;
        } else if (['x', '.'].includes(e.key)) {
          index = index + 1;
        } else if (['Z', 'Insert'].includes(e.key)) {
          index = index - 5;
        } else if (['X', 'Delete'].includes(e.key)) {
          index = index + 5;
        }
        if (index < 0) index = 0;
        if (index >= $all.length) index = $all.length - 1;
        if (['Home'].includes(e.key)) index = 0;
        if (['End'].includes(e.key)) index = $all.length - 1;
        readThis($all.get(index));
        e.preventDefault();
      },
      pointerdown: (e) => {
        if (![3, 4].includes(e.button)) return;
        const $all = $(elemSelector);
        let index = $all.index(currentElem);
        if (e.button === 3) {
          index = index - 5;
        } else if (e.button === 4) {
          index = index + 5;
        }
        if (index < 0) index = 0;
        if (index >= $all.length) index = $all.length - 1;
        readThis($all.get(index));
        e.preventDefault();
      },
    });

    if ($('#mynovelreader-content .reading').length) {
      readThis($('#mynovelreader-content .reading').get(-1));
    } else {
      const article = $('#chapter-list>.active>div').attr('href');
      speakTheseElems($(article).children().toArray());
    }

    async function speakTheseElems(elemsToSpeak) {
      // const stackNow = stack++;
      for (const elem of elemsToSpeak) {
        if ($(elem).is('.chapter-footer-nav')) break;
        // console.log(stackNow);

        currentElem = elem;
        elem.classList.add('reading');
        elem.style.background = 'white';
        if (elem.scrollIntoViewIfNeeded) {
          elem.scrollIntoViewIfNeeded(true);
        } else if (!isElementInViewport(elem)) {
          elem.scrollIntoView({ block: 'center' });
        }
        // eslint-disable-next-line no-loop-func
        await new Promise((resolve, reject) => {
          const text = elem.textContent.trim();// .replace(/[^-+%#A-Za-z0-9\p{Unified_Ideograph}]+/gu, '，').replace(/^，|，$/g, '');

          const utterThis = new window.SpeechSynthesisUtterance(text);
          utterThis.voice = window.speechSynthesis.getVoices().find((i) => i.name === config.voice);
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
          utterThis.addEventListener('error', (e) => {
            cancelCompleted = true;
            reject();
          });
          // for (const i of ['error', 'mark', 'pause', 'resume', 'start']) {
          //   utterThis.addEventListener(i, (...args) => {
          //     console.log(i, args);
          //   });
          // }
          window.speechSynthesis.speak(utterThis);
        });
        elem.style.background = '';
        elem.classList.remove('reading');
        if (cancel) break;
      }

      if (!cancel && $(elemsToSpeak).filter('.chapter-footer-nav').last().find('.next-page:not([style="color:#666666"])').length) {
        const $article = $(elemsToSpeak).filter('.chapter-footer-nav').last().find('.next-page:not([style="color:#666666"])')
          .parents('#mynovelreader-content>article');

        // eslint-disable-next-line no-shadow
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
}());

function isElementInViewport(el) { // https://stackoverflow.com/a/7557433
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
}
