/* eslint-env browser */
// ==UserScript==
// @name         [HV]AutoAttack
// @name:zh-TW   [HV]AutoAttack
// @name:zh-CN   [HV]AutoAttack
// @description  HV auto attack script, for the first user, should configure before use it.
// @description:zh-CN HV自动打怪脚本，初次使用，请先设置好选项，请确认字体设置正常
// @description:zh-TW HV自動打怪腳本，初次使用，請先設置好選項，請確認字體設置正常
// @version      2.90.19c.fix1
// @author       dodying
// @namespace    https://github.com/dodying/
// @supportURL   https://github.com/dodying/UserJs/issues
// @icon         https://github.com/dodying/UserJs/raw/master/Logo.png
// @include      http*://hentaiverse.org/*
// @include      http*://alt.hentaiverse.org/*
// @include      http*://e-hentai.org/*
// @connect        hentaiverse.org
// @connect        e-hentai.org
// @compatible   Firefox + Greasemonkey
// @compatible   Chrome/Chromium + Tampermonkey
// @compatible   Android + Firefox + Usi/Tampermonkey
// @compatible   Other + Bookmarklet
// @grant        GM_deleteValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==
/* eslint-disable camelcase */
try {
  if (window.self !== window.top) {
    if (!window.top.location.href.match(`/equip/`) && (gE('#riddlecounter') || !gE('#navbar'))) {
      setValue('lastHref', window.top.location.href);
      window.top.location.href = window.self.location.href;
    }
    return;
  }

  const Debug = {
    Stack: class extends Error {
      constructor(description, ...params) {
        super(...params);
        this.name = 'Debug.Stack';
      }
    },
    realtime: false,
    logList: [],
    maxLogCache: 100,
    switchRealtimeLog: function () {
      Debug.enableRealtimeLog(Debug.realtime);
    },
    enableRealtimeLog: function (enabled) {
      Debug.realtime = enabled;
      if (enabled) {
        Debug.shiftLog();
      }
    },
    log: function () {
      if (Debug.realtime) {
        console.log(...arguments, `\n`, (new Debug.Stack()).stack);
        return;
      }
      Debug.logList.push({
        args: arguments,
        stack: (new Debug.Stack()).stack
      });
      if (Debug.logList.length > Debug.maxLogCache) {
        Debug.logList.shift();
      }
    },
    shiftLog: function () {
      while (Debug.logList.length) {
        const log = Debug.logList.shift();
        console.log(...log.args, `\n`, log.stack);
      }
    }
  }

  const standalone = ['option', 'arena', 'drop', 'stats', 'staminaLostLog', 'battleCode', 'disabled', 'stamina', 'staminaTime', 'lastHref', 'battle', 'monsterDB', 'monsterMID', 'ability'];
  const sharable = ['option'];
  const excludeStandalone = { 'option': ['optionStandalone', 'version', 'lang'] };
  const href = window.location.href;
  const isIsekai = href.indexOf('isekai') !== -1;
  const current = isIsekai ? 'isekai' : 'persistent';
  const other = isIsekai ? 'persistent' : 'isekai';
  let GM_cache;

  const _1s = 1000;
  const _1m = 60 * _1s;
  const _1h = 60 * _1m;
  const _1d = 24 * _1h;

  const asyncList = [];
  function consoleAsyncTasks(name, state) {
    if (!state) {
      asyncList.splice(asyncList.indexOf(name), 1);
    } else {
      asyncList.push(name);
    }
    console.log(`${state ? 'Start' : 'End'} ${name}\n`, JSON.parse(JSON.stringify(asyncList)));
  }
  function logSwitchAsyncTask(args) {
    const argsStr = Array.from(args).join(',');
    const name = `${args.callee.name}${argsStr === '' ? argsStr : `(${argsStr})`}`;
    consoleAsyncTasks(name, asyncList.indexOf(name) === -1);
  }

  //ajax
  function $doc(h) {
    const d = document.implementation.createHTMLDocument(''); d.documentElement.innerHTML = h; return d;
  }
  var $ajax = {

    interval: 300, // DO NOT DECREASE THIS NUMBER, OR IT MAY TRIGGER THE SERVER'S LIMITER AND YOU WILL GET BANNED
    max: 4,
    tid: null,
    conn: 0,
    index: 0,
    queue: [],

    fetch: function (url, data, method, context = {}, headers = {}) {
      return new Promise((resolve, reject) => {
        $ajax.add(method, url, data, resolve, reject, context, headers);
      });
    },
    repeat: function (count, func, ...args) {
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push(func(...args));
      }
      return list;
    },
    add: function (method, url, data, onload, onerror, context = {}, headers = {}) {
      if (!data) {
        method = 'GET';
      } else if (!method) {
        method = 'POST';
      }
      if (method === 'POST') {
        headers['Content-Type'] ??= 'application/x-www-form-urlencoded';
        if (data && typeof data === 'object') {
          data = Object.entries(data).map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&');
        }
      } else if (method === 'JSON') {
        method = 'POST';
        headers['Content-Type'] ??= 'application/json';
        if (data && typeof data === 'object') {
          data = JSON.stringify(data);
        }
      }
      context.onload = onload;
      context.onerror = onerror;
      $ajax.queue.push({ method, url, data, headers, context, onload: $ajax.onload, onerror: $ajax.onerror });
      $ajax.next();
    },
    next: function () {
      if (!$ajax.queue[$ajax.index] || $ajax.error) {
        return;
      }
      if ($ajax.tid) {
        if (!$ajax.conn) {
          clearTimeout($ajax.tid);
          $ajax.timer();
          $ajax.send();
        }
      } else {
        if ($ajax.conn < $ajax.max) {
          $ajax.timer();
          $ajax.send();
        }
      }
    },
    timer: function () {
      var _ns = isIsekai ? 'hvuti' : 'hvut';
      function getValue(k, d, p = _ns + '_') { const v = localStorage.getItem(p + k); return v === null ? d : JSON.parse(v); }
      function setValue(k, v, p = _ns + '_', r) { localStorage.setItem(p + k, JSON.stringify(v, r)); }
      function ontimer() {
        const now = new Date().getTime();
        const last = getValue('last_post');
        if (last && last - now < $ajax.interval) {
          $ajax.next();
          return;
        }
        setValue('last_post', now);
        $ajax.tid = null;
        $ajax.next();
      };
      $ajax.tid = setTimeout(ontimer, $ajax.interval);
    },
    send: function () {
      GM_xmlhttpRequest($ajax.queue[$ajax.index]);
      $ajax.index++;
      $ajax.conn++;
    },
    onload: function (r) {
      $ajax.conn--;
      const text = r.responseText;
      if (r.status !== 200) {
        $ajax.error = `${r.status} ${r.statusText}: ${r.finalUrl}`;
        r.context.onerror?.();
      } else if (text === 'state lock limiter in effect') {
        if ($ajax.error !== text) {
          // popup(`<p style="color: #f00; font-weight: bold;">${text}</p><p>Your connection speed is so fast that <br>you have reached the maximum connection limit.</p><p>Try again later.</p>`);
          console.error(`${text}\nYour connection speed is so fast that you have reached the maximum connection limit. Try again later.`)
        }
        $ajax.error = text;
        r.context.onerror?.();
      } else {
        r.context.onload?.(text);
        $ajax.next();
      }
    },
    onerror: function (r) {
      $ajax.conn--;
      $ajax.error = `${r.status} ${r.statusText}: ${r.finalUrl}`;
      r.context.onerror?.();
      $ajax.next();
    },
  };

  window.addEventListener('unhandledrejection', (e) => { console.log($ajax.error, e); });

  (function init() {
    if (!checkIsHV()) {
      return;
    }

    if (!gE('#navbar,#riddlecounter,#textlog')) {
      setTimeout(goto, 5 * _1m);
      return;
    }

    g('version', GM_info ? GM_info.script.version.substr(0, 4) : '2.89');
    if (!getValue('option')) {
      g('lang', window.prompt('请输入以下语言代码对应的数字\nPlease put in the number of your preferred language (0, 1 or 2)\n0.简体中文\n1.繁體中文\n2.English', 0) || 2);
      addStyle(g('lang'));
      _alert(0, '请设置hvAutoAttack', '請設置hvAutoAttack', 'Please config this script');
      gE('.hvAAButton').click();
      return;
    }
    loadOption();
    g('lang', g('option').lang || '0');
    addStyle(g('lang'));
    if (g('option').version !== g('version')) {
      gE('.hvAAButton').click();
      if (_alert(1, 'hvAutoAttack版本更新，请重新设置\n强烈推荐【重置设置】后再设置。\n是否查看更新说明？', 'hvAutoAttack版本更新，請重新設置\n強烈推薦【重置設置】後再設置。\n是否查看更新說明？', 'hvAutoAttack version update, please reset\nIt\'s recommended to reset all configuration.\nDo you want to read the changelog?')) {
        openUrl('https://github.com/dodying/UserJs/commits/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js', true);
      }
      gE('.hvAAReset').focus();
      return;
    }

    if (gE('[class^="c5"],[class^="c4"]') && _alert(1, '请设置字体\n使用默认字体可能使某些功能失效\n是否查看相关说明？', '請設置字體\n使用默認字體可能使某些功能失效\n是否查看相關說明？', 'Please set the font\nThe default font may make some functions fail to work\nDo you want to see instructions?')) {
      openUrl(`https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README${g('lang') === '2' ? '_en.md#about-font' : '.md#关于字体的说明'}`, true);
      return;
    }

    unsafeWindow = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

    if (gE('#riddlecounter')) { // 需要答题
      if (!g('option').riddlePopup || window.opener) {
        riddleAlert(); // 答题警报
        return;
      }
      window.open(window.location.href, 'riddleWindow', 'resizable,scrollbars,width=1241,height=707');
      return;
    }

    if (!gE('#navbar')) { // 战斗中
      const box2 = gE('#battle_main').appendChild(cE('div'));
      box2.id = 'hvAABox2';
      setPauseUI(box2);
      reloader();
      g('attackStatus', g('option').attackStatus);
      g('timeNow', time(0));
      g('runSpeed', 1);
      Debug.log('______________newRound', false);
      newRound(false);
      if (g('option').recordEach && !getValue('battleCode')) {
        setValue('battleCode', `${time(1)}: ${g('battle')?.roundType?.toUpperCase()}-${g('battle')?.roundAll}`);
      }
      onBattle();
      updateEncounter(false, true);
      return;
    }

    // 战斗外
    if (window.location.href.indexOf(`?s=Battle&ss=ba`) === -1) { // 不缓存encounter
      setValue('lastHref', window.location.href); // 缓存进入战斗前的页面地址
    } else {
      // 补充记录（因写入冲突、网络卡顿等）未被记录的encounter链接
      const encounterURL = window.location.href?.href.split('/')[3];
      const encounter = getEncounter();
      if (!encounter.filter(e => e.href === encounterURL).length) {
        encounter.unshift({ href: encounterURL, time: time(0), encountered: time(0) });
      }
      setEncounter(encounter);
    }
    delValue(1);
    if (g('option').showQuickSite && g('option').quickSite) {
      quickSite();
    }
    const hvAAPauseUI = document.body.appendChild(cE('div'));
    hvAAPauseUI.classList.add('hvAAPauseUI');
    setPauseUI(hvAAPauseUI);
    asyncOnIdle();
  }());

  function loadOption() {
    let option = getValue('option', true);
    const aliasDict = {
      'debuffSkillImAll': 'debuffSkillAllIm',
      'debuffSkillWeAll': 'debuffSkillAllWk',
      'debuffSkillAllImCondition': 'debuffSkillImpCondition',
      'debuffSkillAllWeCondition': 'debuffSkillWkCondition',
    }
    for (let key in aliasDict) {
      option[key] ??= option[aliasDict[key]];
      option[aliasDict[key]] = undefined;
    }
    g('option', setValue('option', option));
  }

  async function asyncOnIdle() {
    let notBattleReady = false;
    const idleStart = time(0);
    await Promise.all([
      (async () => {
        await asyncGetItems();
        const checked = await asyncCheckSupply();
        notBattleReady ||= !checked;
      })(),
      asyncSetStamina(),
      asyncSetEnergyDrinkHathperk(),
      asyncSetAbilityData(),
      updateArena(),
      updateEncounter(g('option').encounter),
      (async () => {
        const checked = await asyncCheckRepair();
        notBattleReady ||= !checked;
      })(),
    ]);
    if (notBattleReady) {
      return;
    }
    if (g('option').idleArena && g('option').idleArenaValue) {
      startUpdateArena(idleStart);
    }
    setTimeout(autoSwitchIsekai, (g('option').isekaiTime * (Math.random() * 20 + 90) / 100) * _1s - (time(0) - idleStart));
  }

  // 通用//
  function setPauseUI(parent) {
    setPauseButton(parent);
    setPauseHotkey();
  }

  function setPauseButton(parent) {
    if (!g('option').pauseButton) {
      return;
    }
    const button = parent.appendChild(cE('button'));
    button.innerHTML = '<l0>暂停</l0><l1>暫停</l1><l2>Pause</l2>';
    if (getValue('disabled')) { // 如果禁用
      document.title = _alert(-1, 'hvAutoAttack暂停中', 'hvAutoAttack暫停中', 'hvAutoAttack Paused');
      button.innerHTML = '<l0>继续</l0><l1>繼續</l1><l2>Continue</l2>';
    }
    button.className = 'pauseChange';
    button.onclick = pauseChange;
  }
  function setPauseHotkey() {
    if (!g('option').pauseHotkey) {
      return;
    }
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      if (e.keyCode === g('option').pauseHotkeyCode) {
        pauseChange();
        // document.removeEventListener('keydown', pause, false);
      }
    }, false);
  }

  function formatTime(t, size = 2) {
    t = [t / _1h, (t / _1m) % 60, (t / _1s) % 60, (t % _1s) / 10].map(cdi => Math.floor(cdi));
    while (t.length > size) { // remove zero front
      const front = t.shift();
      if (!front) {
        continue;
      }
      t.unshift(front);
      break;
    }
    return t;
  }

  function getKeys(objArr, prop) {
    let out = [];
    objArr.forEach((_objArr) => {
      out = prop ? out.concat(Object.keys(_objArr[prop])) : out.concat(Object.keys(_objArr));
    });
    out = out.sort();
    for (let i = 1; i < out.length; i++) {
      if (out[i - 1] === out[i]) {
        out.splice(i, 1);
        i--;
      }
    }
    return out;
  }

  function time(e, stamp) {
    const date = stamp ? new Date(stamp) : new Date();
    if (e === 0) {
      return date.getTime();
    } if (e === 1) {
      return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
    } if (e === 2) {
      // date.toLocaleDateString(lang,option);
      return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
    } if (e === 3) {
      return date.toLocaleString(navigator.language, {
        hour12: false,
      });
    }
  }

  function gE(ele, mode, parent) { // 获取元素
    if (typeof ele === 'object') {
      return ele;
    } if (mode === undefined && parent === undefined) {
      return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele);
    } if (mode === 'all') {
      return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele);
    } if (typeof mode === 'object' && parent === undefined) {
      return mode.querySelector(ele);
    }
  }

  function cE(name) { // 创建元素
    return document.createElement(name);
  }

  function isOn(id) { // 是否可以施放技能/使用物品
    if (id * 1 > 10000) { // 使用物品
      return gE(`.bti3>div[onmouseover*="${id}"]`);
    } // 施放技能
    return (gE(id) && gE(id).style.opacity !== '0.5') ? gE(id) : false;
  }

  function setLocal(item, value) {
    if (typeof GM_setValue === 'undefined') {
      window.localStorage[`hvAA-${item}`] = (typeof value === 'string') ? value : JSON.stringify(value);
    } else {
      GM_setValue(item, value);
    }
  }

  function setValue(item, value) { // 储存数据
    if (!standalone.includes(item)) {
      setLocal(item, value);
      return value;
    }
    setLocal(`${current}_${item}`, value);
    if (sharable.includes(item) && !getValue('option').optionStandalone) {
      setLocal(`${other}_${item}`, value);
    }
    return value;
  }

  function getLocal(item, toJSON) {
    if (typeof GM_getValue === 'undefined' || !GM_getValue(item, null)) {
      item = `hvAA-${item}`;
      return (item in window.localStorage) ? ((toJSON) ? JSON.parse(window.localStorage[item]) : window.localStorage[item]) : null;
    }
    return GM_getValue(item, null);
  }

  function getValue(key, toJSON) { // 读取数据
    if (!standalone.includes(key)) {
      return getLocal(key, toJSON);
    }
    let otherWorldItem = getLocal(`${other}_${key}`);
    // 将旧的数据迁移到新的数据
    if (!getLocal(`${current}_${key}`)) {
      let itemExisted = getLocal(key);
      if (!itemExisted && sharable.includes(key)) {
        itemExisted = otherWorldItem;
      }
      if (!itemExisted) {
        return null; // 若都没有该数据
      }
      itemExisted = JSON.parse(JSON.stringify(itemExisted));
      setLocal(`${current}_${key}`, itemExisted);
      delLocal(key);
    }
    if (Object.keys(excludeStandalone).includes(key)) {
      otherWorldItem ??= getLocal(`${current}_${key}`) ?? {};
      for (let i of excludeStandalone[key]) {
        otherWorldItem[i] = getLocal(`${current}_${key}`)[i];
      }
    }
    setLocal(`${other}_${key}`, otherWorldItem);
    return getLocal(`${current}_${key}`);
  }

  function delLocal(key) {
    if (typeof GM_deleteValue === 'undefined') {
      window.localStorage.removeItem(`hvAA-${key}`);
      return;
    }
    GM_deleteValue(key);
  }

  function delValue(key) { // 删除数据
    if (standalone.includes(key)) {
      key = `${current}_${key}`;
    }
    if (typeof key === 'string') {
      delLocal(key);
      return;
    }
    if (typeof key !== 'number') {
      return;
    }
    const itemMap = {
      0: ['disabled'],
      1: ['battle', 'battleCode', 0],
    }
    for (let item of itemMap[key]) {
      delValue(item);
    }
  }

  function goto() { // 前进
    window.location.href = window.location;
    setTimeout(goto, 5000);
  }
  function g(key, value) { // 全局变量
    const hvAA = window.hvAA || {};
    if (key === undefined && value === undefined) {
      return hvAA;
    } if (value === undefined) {
      return hvAA[key];
    }
    hvAA[key] = value;
    window.hvAA = hvAA;
    return window.hvAA[key];
  }

  // function post(href, func, parm, type) { // post
  //   let xhr = new window.XMLHttpRequest();
  //   xhr.open(parm ? 'POST' : 'GET', href);
  //   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  //   xhr.responseType = type || 'document';
  //   xhr.onerror = function () {
  //     xhr = null;
  //     post(href, func, parm, type);
  //   };
  //   xhr.onload = function (e) {
  //     if (e.target.status >= 200 && e.target.status < 400 && typeof func === 'function') {
  //       const data = e.target.response;
  //       if (xhr.responseType === 'document' && gE('#messagebox', data)) {
  //         if (gE('#messagebox')) {
  //           gE('#csp').replaceChild(gE('#messagebox', data), gE('#messagebox'));
  //         } else {
  //           gE('#csp').appendChild(gE('#messagebox', data));
  //         }
  //       }
  //       func(data, e);
  //     }
  //     xhr = null;
  //   };
  //   xhr.send(parm);
  // }

  function objArrSort(key) { // 对象数组排序函数，从小到大排序
    return function (obj1, obj2) {
      return (obj2[key] < obj1[key]) ? 1 : (obj2[key] > obj1[key]) ? -1 : 0;
    };
  }

  function objSort(obj) { // 对象排序
    const objNew = {};
    const arr = Object.keys(obj).sort();
    arr.forEach((key) => {
      objNew[key] = obj[key];
    });
    return objNew;
  }

  function _alert(func, l0, l1, l2, answer) {
    const lang = [l0, l1, l2][g('lang')];
    if (func === -1) {
      return lang;
    } if (func === 0) {
      window.alert(lang);
    } else if (func === 1) {
      return window.confirm(lang);
    } else if (func === 2) {
      return window.prompt(lang, answer);
    }
  }

  function openUrl(url, newTab) {
    const a = gE('body').appendChild(cE('a'));
    a.href = url;
    a.target = newTab ? '_blank' : '_self';
    a.click();
  }

  function addStyle(lang) { // CSS
    const langStyle = gE('head').appendChild(cE('style'));
    langStyle.className = 'hvAA-LangStyle';
    langStyle.textContent = `l${lang}{display:inline!important;}`;
    if (/^[01]$/.test(lang)) {
      langStyle.textContent = `${langStyle.textContent}l01{display:inline!important;}`;
    }
    const globalStyle = gE('head').appendChild(cE('style'));
    const cssContent = [
      // hvAA
      'l0,l1,l01,l2{display:none;}', // l0: 简体 l1: 繁体 l01:简繁体共用 l2: 英文
      '#hvAABox2{position:absolute;left:1075px;padding-top: 6px;}',
      '.hvAALog{font-size:20px;}',
      '.hvAAPauseUI{top:30px;left:1246px;position:absolute;z-index:9999}',
      '.hvAAButton{top:5px;left:1255px;position:absolute;z-index:9999;cursor:pointer;width:48px;height:48px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADi0lEQVRIiZVWPYgUZxj+dvGEk7vsNdPYCMul2J15n+d991PIMkWmOEyMyRW2FoJIUojYp5ADFbZJkyISY3EqKGpgz+Ma4bqrUojICaIsKGIXSSJcsZuD3RT3zWZucquXDwYG5n2f9/d5vnFuHwfAZySfAXgN4DXJzTiOj+3H90OnkmXZAe/9FMm3JJ8AuBGepyRfle2yLDvgnKt8EDVJkq8B3DGzjve+1m63p0n2AVzJbUh2SG455yre+5qZ/aCq983sxMfATwHYJvlCVYckHwFYVdURgO8LAS6RHJJcM7N1VR0CeE5yAGBxT3AR+QrA3wA20tQOq+pFkgOS90Tk85J51Xs9qaorqjoAcC6KohmSGyQHcRx/kbdv7AHgDskXaWqH0zSddc5Voyia2SOXapqmswsLvpam6ez8/Pwn+YcoimYAvARw04XZ5N8qZtZR1aGqXnTOVSd0cRd42U5EzqvqSFWX2u32tPd+yjnnXNiCGslHJAf7ybwM7r2vAdgWkYdZls157w+NK/DeT7Xb7WkAqyTvlZHjOD5oxgtmtqrKLsmze1VJsquqKwsLO9vnnKvkJHpLsq+qo/JAd8BtneTvqvqTiPwoIu9EZKUUpGpmi2Y2UtU+yTdJkhx1JJ8FEl0pruK/TrwA4F2r1WrkgI1G4wjJP0XkdLF9WaZzZnZZVa8GMj5xgf43JvXczFZbLb1ebgnJn0nenjQbEVkG0JsUYOykyi6Aa+XoQTJuTRr8OADJzVBOh+SlckYkz5L8Q0TquXOj0fhURN6r6pkSeAXAUsDaJPnYxXF8jOQrklskh97ryZJTVURWAPwF4DqAX0TkvRl/zTKdK2aeJMnxICFbAHrNZtOKVVdIrrVa2t1jz6sicprkbQC3VPVMGTzMpQvgQY63i8lBFddVdVCk/6TZlMFzopFci+P44H+YHCR3CODc/wUvDPY7ksMg9buZrKr3ATwvyoT3vrafzPP3er1eA9Azs7tjJhcqOBHkeSOKohkROR9K7prZYqnnlSRJjofhb4vIt/V6vUbyN1Xtt1qtb1zpZqs45xyAxXAnvCQ5FJGHqrpiZiMzu5xnHlZxCOABybXw3gvgp/Zq3/gA+BLATVVdyrJsbods2lfVq7lN4crMtapjZndD5pPBixWFLTgU7uQ3AJ6KyLKILAdy9sp25bZMBC//JSRJcjQIYg9Aj+TjZrNp+/mb+Ad711sdZZ1k/QAAAABJRU5ErkJggg==) center no-repeat transparent;}',
      '#hvAABox{left:calc(50% - 350px);top:50px;font-size:16px!important;z-index:4;width:700px;height:538px;position:absolute;text-align:left;background-color:#E3E0D1;border:1px solid #000;border-radius:10px;font-family:"Microsoft Yahei";}',
      '.hvAATablist{position:relative;left:14px;}',
      '.hvAATabmenu{position:absolute;left:-9px;}',
      '.hvAATabmenu>span{display:block;padding:5px 10px;margin:0 10px 0 0;border:1px solid #91a7b4;border-radius:5px;background-color:#E3F1F8;color:#000;text-decoration:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;cursor:pointer;}',
      '.hvAATabmenu>span:hover{left:-5px;position:relative;color:#0000FF;z-index:2!important;}',
      '.hvAATabmenu>span>input{margin:0 0 0 -8px;}',
      '.hvAATab{position:absolute;width:605px;height:430px;left:36px;padding:15px;border:1px solid #91A7B4;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,0.1);color:#666;background-color:#EDEBDF;overflow:auto;}',
      '.hvAATab>div:nth-child(2n){border:1px solid #EAEAEA;background-color:#FAFAFA;}',
      '.hvAATab>div:nth-child(2n+1){border:1px solid #808080;background-color:#DADADA;}',
      '.hvAATab a{margin:0 2px;}',
      '.hvAATab b{font-family:Georgia,Serif;font-size:larger;}',
      '.hvAATab input.hvAANumber{width:24px;text-align:right;}',
      '.hvAATab ul,.hvAATab ol{margin:0;}',
      '.hvAATab label{cursor:pointer;}',
      '.hvAATab table{border:2px solid #000;border-collapse:collapse;margin:0 auto;}',
      '.hvAATh>*{font-weight:bold;font-size:larger;}',
      '.hvAATab table>tbody>tr>*{border:1px solid #000;}',
      '#hvAATab-Drop tr>td:nth-child(1),#hvAATab-Usage tr>td:nth-child(1){text-align:left;}',
      '#hvAATab-Drop td,#hvAATab-Usage td{text-align:right;white-space:nowrap;}',
      // '#hvAATab-Drop td:empty:before,#hvAATab-Usage td:empty:before{content:"";}',
      '.selectTable{cursor:pointer;}',
      `.selectTable:before{content:"${String.fromCharCode(0x22A0.toString(10))}";}`,
      '.hvAACenter{text-align:center;}',
      '.hvAATitle{font-weight:bolder;}',
      '.hvAAGoto{cursor:pointer;text-decoration:underline;}',
      '.hvAANew{width:25px;height:25px;float:left;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAMCAYAAACX8hZLAAAAcElEQVQ4jbVRSQ4AIQjz/59mTiZIF3twmnCwFAq4FkeFXM+5vCzohYxjPMtfxS8CN6iqQ7TfE0wrODxVbzJNgoaTo4CmbBO1ZWICouQ0DHaL259MEzaU+w8pZOdSjcUgaPJDHCbO0A2kuAiuwPGQ+wBms12x8HExTwAAAABJRU5ErkJggg==) center no-repeat transparent;}',
      '#hvAATab-Alarm input[type="text"]{width:512px;}',
      '.testAlarms>div{border:2px solid #000;}',
      '.hvAAArenaLevels{display:none;}',
      '.hvAAcheckItems{display:grid; grid-template-columns:repeat(3, 1fr 0.1fr 0.3fr)}',
      '.hvAAcheckItems>input.hvAANumber{width:32px}',
      '.hvAAConfig{width:100%;height:16px;}',
      '.hvAAButtonBox{position:relative;top:468px;}',
      '.encounterUI{font-weight:bold;font-size:10pt;position:absolute;top:58px;left:1240px;text-decoration:none;}',
      '.quickSiteBar{position:absolute;top:0px;left:1290px;font-size:18px;text-align:left;width:165px;height:calc(100% - 10px);display:flex;flex-direction:column;flex-wrap:wrap;}',
      '.quickSiteBar>span{display:block;max-height:24px;overflow:hidden;text-overflow:ellipsis;}',
      '.quickSiteBar>span>a{text-decoration:none;}',
      '.customize{border: 2px dashed red!important;min-height:21px;}',
      '.customize>.customizeGroup{display:block;background-color:#FFF;}',
      '.customize>.customizeGroup:nth-child(2n){background-color:#C9DAF8;}',
      '.customizeBox{position:absolute;z-index:-1;border:1px solid #000;background-color:#EDEBDF;}',
      '.customizeBox>span{display:inline-block;font-size:16px;margin:0 1px;padding:0 5px;font-weight:bold;border:1px solid #5C0D11;border-radius:10px;}',
      '.customizeBox>span.hvAAInspect{padding:0 3px;cursor:pointer;}',
      '.customizeBox>span.hvAAInspect[title="on"]{background-color:red;}',
      '.customizeBox>span a{text-decoration:none;}',
      '.customizeBox>select{max-width:60px;}',
      '.favicon{width:16px;height:16px;margin:-3px 1px;border:1px solid #000;border-radius:3px;}',
      '.answerBar{z-index:1000;width:710px;height:40px;position:absolute;top:55px;left:282px;display:table;border-spacing:5px;}',
      '.answerBar>div{border:4px solid red;display:table-cell;cursor:pointer;}',
      '.answerBar>div:hover{background:rgba(63,207,208,0.20);}',
      '#hvAAInspectBox{background-color:#EDEBDF;position:absolute;z-index:9;border: 2px solid #5C0D11;font-size:16px;font-weight:bold;padding:3px;display:none;}',
      // 全局
      'button{border-radius:3px;border:2px solid #808080;cursor:pointer;margin:0 1px;}',
      // hv
      '#riddleform>div:nth-child(3)>img{width:700px;}',
      '#battle_right{overflow:visible;}',
      '#pane_log{height:403px;}',
      // '#pane_monster{counter-reset:order;}',
      // '.btm2>div:nth-child(1):before{font-size:30px;font-weight:bold;text-shadow:1px 1px 2px;content:counter(order);counter-increment:order;}',
      // '.btm2>div:nth-child(1)>img{display:none;}'
      '.tlbQRA{text-align:left;font-weight:bold;}', // 标记已检测的日志行
      '.tlbWARN{text-align:left;font-weight:bold;color:red;font-size:20pt;}', // 标记检测出异常的日志行
    ].join('');
    globalStyle.textContent = cssContent;
    optionButton(lang);
  }

  function optionButton(lang) { // 配置按钮
    const optionButton = gE('body').appendChild(cE('div'));
    optionButton.className = 'hvAAButton';
    optionButton.onclick = function () {
      if (gE('#hvAABox')) {
        gE('#hvAABox').style.display = (gE('#hvAABox').style.display === 'none') ? 'block' : 'none';
      } else {
        optionBox();
        gE('#hvAATab-Main').style.zIndex = 1;
        gE('select[name="lang"]').value = lang;
      }
    };
  }

  function optionBox() { // 配置界面
    const optionBox = gE('body').appendChild(cE('div'));
    optionBox.id = 'hvAABox';
    optionBox.innerHTML = [
      '<div class="hvAACenter">',
      '  <h1 style="display:inline;">hvAutoAttack</h1>',
      '  <a href="https://github.com/dodying/UserJs/commits/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js" target="_blank"><l0>更新历史</l0><l1>更新歷史</l1><l2>ChangeLog</l2></a>',
      '  <l01><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md" target="_blank">使用说明</a></l01><l2><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README_en.md" target="_blank">README</a></l2>',
      '  <select name="lang"><option value="0">简体中文</option><option value="1">繁體中文</option><option value="2">English</option></select>',
      '  <l2><span style="font-size:small;"><a target="_blank" href="https://greasyfork.org/forum/profile/18194/Koko191" style="color:#E3E0D1;background-color:#E3E0D1;" title="Thanks to Koko191 who give help in the translation">by Koko191</a></span></l2></div>',
      '<div class="hvAATablist">',
      '<div class="hvAATabmenu">',
      '  <span name="Main"><l0>主要选项</l0><l1>主要選項</l1><l2>Main</l2></span>',
      '  <span name="Recovery"><l0>恢复技能</l0><l1>恢復技能</l1><l2>Recovery</l2></span>',
      '  <span name="Channel"><input id="channelSkillSwitch" type="checkbox"><l0>引导技能</l0><l1>引導技能</l1><l2>Channel Spells</l2></span>',
      '  <span name="Buff"><input id="buffSkillSwitch" type="checkbox">BUFF<l01>技能</l01><l2> Spells</l2></span>',
      '  <span name="Debuff"><input id="debuffSkillSwitch" type="checkbox">DEBUFF<l01>技能</l01><l2> Spells</l2></span>',
      '  <span name="Skill"><input id="skillSwitch" type="checkbox"><l01>其他技能</l01><l2>Skills</l2></span>',
      '  <span name="Scroll"><input id="scrollSwitch" type="checkbox"><l0>卷轴</l0><l1>捲軸</l1><l2>Scroll</l2></span>',
      '  <span name="Infusion"><input id="infusionSwitch" type="checkbox"><l0>魔药</l0><l1>魔藥</l1><l2>Infusion</l2></span>',
      '  <span name="Alarm"><l0>警报</l0><l1>警報</l1><l2>Alarm</l2></span>',
      '  <span name="Rule"><l0>攻击规则</l0><l1>攻擊規則</l1><l2>Attack Rule</l2></span>',
      '  <span name="Drop"><input id="dropMonitor" type="checkbox"><l0>掉落监测</l0><l1>掉落監測</l1><l2>Drops Tracking</l2></span>',
      '  <span name="Usage"><input id="recordUsage" type="checkbox"><l0>数据记录</l0><l1>數據記錄</l1><l2>Usage Tracking</l2></span>',
      '  <span name="About"><l0>关于本脚本</l0><l1>關於本腳本</l1><l2>About This</l2></span>',
      '  <span name="Feedback"><l01>反馈</l01><l2>Feedback</l2></span></div>',
      '<div class="hvAATab" id="hvAATab-Main">',
      '  <div><b><l0>异世界相关</l0><l1>異世界相關</l1><l2>Isekai</l2></b>: ',
      '    <input id="isekai" type="checkbox"><label for="isekai"><l0>自动切换恒定世界和异世界;</l0><l1>自動切換恆定世界和異世界;</l1><l2>Auto switch between Isekai and Persistent;</l2></label>',
      '<input id="optionStandalone" type="checkbox"><label for="optionStandalone"><l0>两个世界使用不同的配置</l0><l1>兩個世界使用不同的配置</l1><l2>Use standalone options.</l2></label>; ',
      '    <l0><br>在任意页面停留</l0><l1><br>在任意頁面停留</l1><l2><br>Idle in any page for </l2><input class="hvAANumber" name="isekaiTime" type="text"><l0>秒后，进行跳转</l0><l1>秒後，進行跳轉</l1><l2>s, start switch check</l2></label></div>',
      '  <div class="hvAACenter" id="attackStatus" style="color:red;"><b>*<l0>攻击模式</l0><l1>攻擊模式</l1><l2>Attack Mode</l2></b>:',
      '    <select class="hvAANumber" name="attackStatus"><option value="-1"></option><option value="0">物理 / Physical</option><option value="1">火 / Fire</option><option value="2">冰 / Cold</option><option value="3">雷 / Elec</option><option value="4">风 / Wind</option><option value="5">圣 / Divine</option><option value="6">暗 / Forbidden</option></select></div>',
      '  <div><b><l0>暂停相关</l0><l1>暫停相關</l1><l2>Pause with</l2></b>: ',
      '    <input id="pauseButton" type="checkbox"><label for="pauseButton"><l0>使用按钮</l0><l1>使用按鈕</l1><l2>Button</l2></label>; ',
      '    <input id="pauseHotkey" type="checkbox"><label for="pauseHotkey"><l0>使用热键</l0><l1>使用熱鍵</l1><l2>Hotkey</l2>: <input name="pauseHotkeyStr" style="width:30px;" type="text"><input class="hvAANumber" name="pauseHotkeyCode" type="hidden" disabled="true"></label></div>',
      '  <div><b><l0>警告相关</l0><l1>警告相關</l1><l2>To Warn</l2></b>: ',
      '    <input id="alert" type="checkbox"><label for="alert"><l0>音频警报</l0><l1>音頻警報</l1><l2>Audio Alarms</l2></label>; ',
      '    <input id="notification" type="checkbox"><label for="notification"><l0>桌面通知</l0><l1>桌面通知</l1><l2>Notifications</l2></label> ',
      '    <button class="testNotification"><l0>预处理</l0><l1>預處理</l1><l2>Pretreat</l2></button></div>',
      '  <div><b><l01>内置插件</l01><l2>Built-in Plugin</l2></b>: ',
      '    <input id="riddleRadio" type="checkbox"><label for="riddleRadio">RiddleLimiter Plus</label>; ',
      '    <input id="encounter" type="checkbox"><label for="encounter"><l0>自动遭遇战</l0><l1>自動遭遇戰</l1><l2>Auto Encounter</l2></label><input id="encounterQuickCheck" type="checkbox"><label for="encounterQuickCheck"><l0>精准倒计时(影响性能)</l0><l1>精準(影響性能)</l1><l2>Precise encounter cd(might reduced performsance)</l2></label></div>',
      '  <div><b><l01>魔法技能</l01><l2>Offensive Magic</l2></b>: <br>',
      '    <l0>中阶技能使用条件</l0><l1>中階技能使用條件</l1><l2>Conditions for 2nd Tier</l2>: {{middleSkillCondition}}',
      '    <l0>高阶技能使用条件</l0><l1>高階技能使用條件</l1><l2>Conditions for 3rd Tier</l2>: {{highSkillCondition}}</div>',
      '  <div><input id="turnOnSS" type="checkbox"><label for="turnOnSS"><b><l0>开启灵动架式</l0><l1>開啟靈動架勢</l1><l2>Turn on Spirit Stance</l2></b></label>: {{turnOnSSCondition}}</div>',
      '  <div><input id="turnOffSS" type="checkbox"><label for="turnOffSS"><b><l0>关闭灵动架式</l0><l1>關閉靈動架勢</l1><l2>Turn off Spirit Stance</l2></b></label>: {{turnOffSSCondition}}</div>',
      '  <div><input id="defend" type="checkbox"><label for="defend"><b>Defend</b></label>: {{defendCondition}}</div>',
      '  <div><input id="focus" type="checkbox"><label for="focus"><b>Focus</b></label>: {{focusCondition}}</div>',
      '  <div><l2>If the page </l2><b><l0>战斗页面停留</l0><l1>戰鬥頁面停留</l1><l2>Stays idle in battle</l2></b><l2> for </l2>: ',
      '    <input id="delayAlert" type="checkbox"><label for="delayAlert"><input class="hvAANumber" name="delayAlertTime" type="text"><l0>秒，警报</l0><l1>秒，警報</l1><l2>s, alarm</l2></label>; ',
      '    <input id="delayReload" type="checkbox"><label for="delayReload"><input class="hvAANumber" name="delayReloadTime" type="text"><l0>秒，刷新页面</l0><l1>秒，刷新頁面</l1><l2>s, reload page</l2></label></div>',
      '  <div><l0>当<b>小马答题</b>时间</l0><l1>當<b>小馬答題</b>時間</l1><l2>If <b>RIDDLE</b> ETR</l2><l0></l0><l1></l1><l2></l2> ≤ <input class="hvAANumber" name="riddleAnswerTime" placeholder="3" type="text"><l0>秒，如果输入框为空则随机生成答案并提交</l0><l1>秒，如果輸入框為空則隨機生成答案並提交</l1><l2>s and no answer has been chosen yet, a random answer will be generated and submitted</l2></div>',
      '  <div><l0>当<b>小马答题</b>时</l0><l1>當<b>小馬答題</b>時</l1><l2>If <b>RIDDLE</b></l2>: ',
      '    <input id="riddlePopup" type="checkbox"><label for="riddlePopup"><l0>弹窗答题</l0><l1>弹窗答题</l1><l2>POPUP a window to answer</l2></label>; <button class="testPopup"><l0>预处理</l0><l1>預處理</l1><l2>Pretreat</l2></button></div>',
      '  <div><b><l0>精力</l0><l1>精力</l1><l2>Stamina</l2>: </b>',
      '    <div style="display: flex; flex-flow: wrap;">',
      '      <div><l0>当损失精力</l0><l1>當損失精力</l1><l2>If it lost Stamina</l2> ≥ <input class="hvAANumber" name="staminaLose" placeholder="5" type="text">: ',
      '      <input id="staminaPause" type="checkbox"><label for="staminaPause"><l0>脚本暂停</l0><l1>腳本暫停</l1><l2>pause script</l2></label>;',
      '      <input id="staminaWarn" type="checkbox"><label for="staminaWarn"><l01>警告</l01><l2>warn</l2></label>; ',
      '      <input id="staminaFlee" type="checkbox"><label for="staminaFlee"><l01>逃跑</l01><l2>flee</l2></label></div>;',
      '      <button class="staminaLostLog"><l0>精力损失日志</l0><l1>精力損失日誌</l1><l2>staminaLostLog</l2></button>',
      '      <div><l0>精力阈值</l0><l1>精力閾值</l1><l2><b></b>Stamina threshold</l2>: Min(85, <input class="hvAANumber" name="staminaLow" placeholder="60" type="text">); </div>',
      '      <div><l0>含本日自然恢复的阈值<l1>含本日自然恢復的閾值</l1><l2><b></b>Stamina threshold with naturally recovers today.</l2>: <input class="hvAANumber" name="staminaLowWithReNat" placeholder="0" type="text">; </div>',
      '      <div><input id="restoreStamina" type="checkbox"><label for="restoreStamina"><l0>战前恢复</l0><l1>戰前恢復</l1><l2>Restore stamina</l2>; </div>',
      '      <div><l0>进入遭遇战的最低精力<l1>進入遭遇戰的最低精力</l1><l2><b></b>Minimum stamina to engage encounter</l2>: <input class="hvAANumber" name="staminaEncounter" placeholder="60" type="text"></div>',
      '    </div>',
      '  </div>',
      '  <div><input id="idleArena" type="checkbox"><label for="idleArena"><b><l0>闲置竞技场</l0><l1>閒置競技場</l1><l2>Idle Arena</l2>: </b>',
      '    <l0>在任意页面停留</l0><l1>在任意頁面停留</l1><l2>Idle in any page for </l2><input class="hvAANumber" name="idleArenaTime" type="text"><l0>秒后，开始竞技场</l0><l1>秒後，開始競技場</l1><l2>s, start Arena</l2></label> <button class="idleArenaReset"><l01>重置</l01><l2>Reset</l2></button>;<br>',
      '    <l0>进行的竞技场相对应等级</l0><l1>進行的競技場相對應等級</l1><l2>The levels of the Arena you want to complete</l2>:  ',
      '      <button class="hvAAShowLevels"><l0>显示更多</l0><l1>顯示更多</l1><l2>Show more</l2></button><button class="hvAALevelsClear"><l01>清空</l01><l2>Clear</l2></button><br>',
      '      <input name="idleArenaLevels" style="width:98%;" type="text" disabled="true"><input name="idleArenaValue" style="width:98%;" type="hidden" disabled="true">',
      '      <div class="hvAAArenaLevels">',
      '        <input id="arLevel_1" value="1,1" type="checkbox"><label for="arLevel_1">1</label> <input id="arLevel_10" value="10,3" type="checkbox"><label for="arLevel_10">10</label> <input id="arLevel_20" value="20,5" type="checkbox"><label for="arLevel_20">20</label> <input id="arLevel_30" value="30,8" type="checkbox"><label for="arLevel_30">30</label> <input id="arLevel_40" value="40,9" type="checkbox"><label for="arLevel_40">40</label> <input id="arLevel_50" value="50,11" type="checkbox"><label for="arLevel_50">50</label> <input id="arLevel_60" value="60,12" type="checkbox"><label for="arLevel_60">60</label> <input id="arLevel_70" value="70,13" type="checkbox"><label for="arLevel_70">70</label> <input id="arLevel_80" value="80,15" type="checkbox"><label for="arLevel_80">80</label> <input id="arLevel_90" value="90,16" type="checkbox"><label for="arLevel_90">90</label> <input id="arLevel_100" value="100,17" type="checkbox"><label for="arLevel_100">100</label> <input id="arLevel_110" value="110,19" type="checkbox"><label for="arLevel_110">110</label><br>',
      '        <input id="arLevel_120" value="120,20" type="checkbox"><label for="arLevel_120">120</label> <input id="arLevel_130" value="130,21" type="checkbox"><label for="arLevel_130">130</label> <input id="arLevel_140" value="140,23" type="checkbox"><label for="arLevel_140">140</label> <input id="arLevel_150" value="150,24" type="checkbox"><label for="arLevel_150">150</label> <input id="arLevel_165" value="165,26" type="checkbox"><label for="arLevel_165">165</label> <input id="arLevel_180" value="180,27" type="checkbox"><label for="arLevel_180">180</label> <input id="arLevel_200" value="200,28" type="checkbox"><label for="arLevel_200">200</label> <input id="arLevel_225" value="225,29" type="checkbox"><label for="arLevel_225">225</label> <input id="arLevel_250" value="250,32" type="checkbox"><label for="arLevel_250">250</label> <input id="arLevel_300" value="300,33" type="checkbox"><label for="arLevel_300">300</label> <input id="arLevel_400" value="400,34" type="checkbox"><label for="arLevel_400">400</label> <input id="arLevel_500" value="500,35" type="checkbox"><label for="arLevel_500">500</label><br>',
      '        <input id="arLevel_RB50" value="RB50,105" type="checkbox"><label for="arLevel_RB50">RB50</label> <input id="arLevel_RB75A" value="RB75A,106" type="checkbox"><label for="arLevel_RB75A">RB75A</label> <input id="arLevel_RB75B" value="RB75B,107" type="checkbox"><label for="arLevel_RB75B">RB75B</label> <input id="arLevel_RB75C" value="RB75C,108" type="checkbox"><label for="arLevel_RB75C">RB75C</label><br>',
      '        <input id="arLevel_RB100" value="RB100,109" type="checkbox"><label for="arLevel_RB100">RB100</label> <input id="arLevel_RB150" value="RB150,110" type="checkbox"><label for="arLevel_RB150">RB150</label> <input id="arLevel_RB200" value="RB200,111" type="checkbox"><label for="arLevel_RB200">RB200</label> <input id="arLevel_RB250" value="RB250,112" type="checkbox"><label for="arLevel_RB250">RB250</label> <input id="arLevel_GF" value="GF,gr" type="checkbox"><label for="arLevel_GF">GrindFest <input class="hvAANumber" name="idleArenaGrTime" placeholder="1" type="text"></label></div></div>',

      '  <div class="hvAACenter"><input id="checkSupply" type="checkbox"><l0>检查物品库存</l0><l1>檢查物品庫存</l1><l2>Check is item needs supply</l2>: ',
      '  <div class="hvAAcheckItems">',
      '  <l0>体力药水</l0><l1>體力藥水</l1><l2>Health Potion</l2><input id="isCheck_11191" type="checkbox"><input class="hvAANumber" name="checkItem_11191" placeholder="0" type="text">',
      '  <l0>体力长效药</l0><l1>體力長效藥</l1><l2>Health Draught</l2><input id="isCheck_11195" type="checkbox"><input class="hvAANumber" name="checkItem_11195" placeholder="0" type="text">',
      '  <l0>体力秘药</l0><l1>體力秘藥</l1><l2>Health Elixir</l2><input id="isCheck_11199" type="checkbox"><input class="hvAANumber" name="checkItem_11199" placeholder="0" type="text">',
      '  <l0>魔力药水</l0><l1>魔力藥水</l1><l2>Mana Potion</l2><input id="isCheck_11291" type="checkbox"><input class="hvAANumber" name="checkItem_11291" placeholder="0" type="text">',
      '  <l0>魔力长效药</l0><l1>魔力長效藥</l1><l2>Mana Draught</l2><input id="isCheck_11295" type="checkbox"><input class="hvAANumber" name="checkItem_11295" placeholder="0" type="text">',
      '  <l0>魔力秘药</l0><l1>魔力秘藥</l1><l2>Mana Elixir</l2><input id="isCheck_11299" type="checkbox"><input class="hvAANumber" name="checkItem_11299" placeholder="0" type="text">',
      '  <l0>灵力药水</l0><l1>靈力藥水</l1><l2>Spirit Potion</l2><input id="isCheck_11391" type="checkbox"><input class="hvAANumber" name="checkItem_11391" placeholder="0" type="text">',
      '  <l0>灵力长效药</l0><l1>靈力長效藥</l1><l2>Spirit Draught</l2><input id="isCheck_11395" type="checkbox"><input class="hvAANumber" name="checkItem_11395" placeholder="0" type="text">',
      '  <l0>灵力秘药</l0><l1>靈力秘藥</l1><l2>Spirit Elixir</l2><input id="isCheck_11399" type="checkbox"><input class="hvAANumber" name="checkItem_11399" placeholder="0" type="text">',
      '  <l0>终极秘药</l0><l1>終極秘藥</l1><l2>Last Elixir</l2><input id="isCheck_11501" type="checkbox"><input class="hvAANumber" name="checkItem_11501" placeholder="0" type="text">',
      '  <l0>花瓶</l0><l1>花瓶</l1><l2>Flower Vase</l2><input id="isCheck_19111" type="checkbox"><input class="hvAANumber" name="checkItem_19111" placeholder="0" type="text">',
      '  <l0>泡泡糖</l0><l1>泡泡糖</l1><l2>Bubble-Gum</l2><input id="isCheck_19131" type="checkbox"><input class="hvAANumber" name="checkItem_19131" placeholder="0" type="text">',
      '  <l0>能量饮料</l0><l1>能量飲料</l1><l2>Energy Drink</l2><input id="isCheck_11401" type="checkbox"><input class="hvAANumber" name="checkItem_11401" placeholder="0" type="text">',
      '  <l0>咖啡因糖果</l0><l1>咖啡因糖果</l1><l2>Caffeinated Candy</l2><input id="isCheck_11402" type="checkbox"><input class="hvAANumber" name="checkItem_11402" placeholder="0" type="text">',
      '  <l0>火焰魔药</l0><l1>火焰魔藥</l1><l2>Infusion of Flames</l2><input id="isCheck_12101" type="checkbox"><input class="hvAANumber" name="checkItem_12101" placeholder="0" type="text">',
      '  <l0>冰冷魔药</l0><l1>冰冷魔藥</l1><l2>Infusion of Frost</l2><input id="isCheck_12201" type="checkbox"><input class="hvAANumber" name="checkItem_12201" placeholder="0" type="text">',
      '  <l0>闪电魔药</l0><l1>閃電魔藥</l1><l2>Infusion of Lightning</l2><input id="isCheck_12301" type="checkbox"><input class="hvAANumber" name="checkItem_12301" placeholder="0" type="text">',
      '  <l0>风暴魔药</l0><l1>風暴魔藥</l1><l2>Infusion of Storms</l2><input id="isCheck_12401" type="checkbox"><input class="hvAANumber" name="checkItem_12401" placeholder="0" type="text">',
      '  <l0>神圣魔药</l0><l1>神聖魔藥</l1><l2>Infusion of Divinity</l2><input id="isCheck_12501" type="checkbox"><input class="hvAANumber" name="checkItem_12501" placeholder="0" type="text">',
      '  <l0>黑暗魔药</l0><l1>黑暗魔藥</l1><l2>Infusion of Darkness</l2><input id="isCheck_12601" type="checkbox"><input class="hvAANumber" name="checkItem_12601" placeholder="0" type="text">',
      '  <l0>加速卷轴</l0><l1>加速捲軸</l1><l2>Scroll of Swiftness</l2><input id="isCheck_13101" type="checkbox"><input class="hvAANumber" name="checkItem_13101" placeholder="0" type="text">',
      '  <l0>守护卷轴</l0><l1>守護捲軸</l1><l2>Scroll of Protection</l2><input id="isCheck_13111" type="checkbox"><input class="hvAANumber" name="checkItem_13111" placeholder="0" type="text">',
      '  <l0>化身卷轴</l0><l1>化身捲軸</l1><l2>Scroll of the Avatar</l2><input id="isCheck_13199" type="checkbox"><input class="hvAANumber" name="checkItem_13199" placeholder="0" type="text">',
      '  <l0>吸收卷轴</l0><l1>吸收捲軸</l1><l2>Scroll of Absorption</l2><input id="isCheck_13201" type="checkbox"><input class="hvAANumber" name="checkItem_13201" placeholder="0" type="text">',
      '  <l0>幻影卷轴</l0><l1>幻影捲軸</l1><l2>Scroll of Shadows</l2><input id="isCheck_13211" type="checkbox"><input class="hvAANumber" name="checkItem_13211" placeholder="0" type="text">',
      '  <l0>生命卷轴</l0><l1>生命捲軸</l1><l2>Scroll of Life</l2><input id="isCheck_13221" type="checkbox"><input class="hvAANumber" name="checkItem_13221" placeholder="0" type="text">',
      '  <l0>众神卷轴</l0><l1>眾神捲軸</l1><l2>Scroll of the Gods</l2><input id="isCheck_13299" type="checkbox"><input class="hvAANumber" name="checkItem_13299" placeholder="0" type="text">',
      '</div></div>',
      '  <div><input id="repair" type="checkbox"><label for="repair"><b><l0>修复装备</l0><l1>修復裝備</l1><l2>Repair Equipment</l2></b></label>: ',
      '    <l0>耐久度</l0><l1>耐久度</l1><l2>Durability</l2> ≤ <input class="hvAANumber" name="repairValue" type="text">%</div>',
      '  <div><input id="etherTap" type="checkbox"><label for="etherTap"><b><l0>以太水龙头</l0><l1>以太水龍頭</l1><l2>Ether Tap</l2></b></label>: {{etherTapCondition}}</div>',
      '  <div><input id="autoFlee" type="checkbox"><label for="autoFlee"><b><l0>自动逃跑</l0><l1>自動逃跑</l1><l2>Flee</l2></b></label>: {{fleeCondition}}</div>',
      '  <div><div class="hvAANew"></div><input id="autoPause" type="checkbox"><label for="autoPause"><b><l0>自动暂停</l0><l1>自動暫停</l1><l2>Pause</l2></b></label>: {{pauseCondition}}</div>',

      '  <div><input id="recordEach" type="checkbox"><label for="recordEach"><b><l0>单独记录每场战役</l0><l1>單獨記錄每場戰役</l1><l2>Record each battle separately</l2></b></label></div>',
      '  <div><b><l0>延迟</l0><l1>延遲</l1><l2>Delay</l2></b>: 1. <l0>其他/Buff/Debuff技能</l0><l1>其他/Buff/Debuff技能</l1><l2>Skills&BUFF/DEBUFF Spells</l2>: <input class="hvAANumber" name="delay" placeholder="200" type="text">ms 2. <l01>其他</l01><l2>Other</l2>: <input class="hvAANumber" name="delay2" placeholder="30" type="text">ms<br>',
      '    <l0>说明: 单位毫秒，且在设定值基础上取其的50%-150%进行延迟，0表示不延迟</l0><l1>說明: 單位毫秒，且在設定值基礎上取其的50%-150%進行延遲，0表示不延遲</l1><l2>Note: unit milliseconds, and based on the set value multiply 50% -150% to delay, 0 means no delay</l2>',
      '    </div>',
      '  </div>',
      '<div class="hvAATab" id="hvAATab-Recovery">',
      '  <div class="itemOrder"><l0>施放顺序</l0><l1>施放順序</l1><l2>Cast Order</l2>: <input name="itemOrderName" style="width:80%;" type="text" disabled="true"><input name="itemOrderValue" style="width:80%;" type="hidden" disabled="true"><br>',
      '    <input id="itemOrder_Cure" value="Cure,311" type="checkbox"><label for="itemOrder_Cure"><l0>治疗(Cure)</l0><l1>治療(Cure)</l1><l2>Cure</l2></label>',
      '    <input id="itemOrder_FC" value="FC,313" type="checkbox"><label for="itemOrder_FC"><l0>完全治愈(FC)</l0><l1>完全治愈(FC)</l1><l2>Full-Cure</l2></label><br>',
      '    <input id="itemOrder_HG" value="HG,10005" type="checkbox"><label for="itemOrder_HG"><l0>生命宝石(HG)</l0><l1>生命寶石(HG)</l1><l2>Health Gem</l2></label>',
      '    <input id="itemOrder_MG" value="MG,10006" type="checkbox"><label for="itemOrder_MG"><l0>魔力宝石(MG)</l0><l1>魔力寶石(MG)</l1><l2>Mana Gem</l2></label>',
      '    <input id="itemOrder_SG" value="SG,10007" type="checkbox"><label for="itemOrder_SG"><l0>灵力宝石(SG)</l0><l1>靈力寶石(SG)</l1><l2>Spirit Gem</l2></label>',
      '    <input id="itemOrder_Mystic" value="Mystic,10008" type="checkbox"><label for="itemOrder_Mystic"><l0>神秘宝石(Mystic)</l0><l1>神秘寶石(Mystic)</l1><l2>Mystic Gem</l2></label><br>',
      '    <input id="itemOrder_HP" value="HP,11195" type="checkbox"><label for="itemOrder_HP"><l0>生命药水(HP)</l0><l1>生命藥水(HP)</l1><l2>Health Potion</l2></label>',
      '    <input id="itemOrder_HE" value="HE,11199" type="checkbox"><label for="itemOrder_HE"><l0>生命秘药(HE)</l0><l1>生命秘藥(HE)</l1><l2>Health Elixir</l2></label>',
      '    <input id="itemOrder_MP" value="MP,11295" type="checkbox"><label for="itemOrder_MP"><l0>魔力药水(MP)</l0><l1>魔力藥水(MP)</l1><l2>Mana Potion</l2></label><br>',
      '    <input id="itemOrder_ME" value="ME,11299" type="checkbox"><label for="itemOrder_ME"><l0>魔力秘药(ME)</l0><l1>魔力秘藥(ME)</l1><l2>Mana Elixir</l2></label>',
      '    <input id="itemOrder_SP" value="SP,11395" type="checkbox"><label for="itemOrder_SP"><l0>灵力药水(SP)</l0><l1>靈力藥水(SP)</l1><l2>Spirit Potion</l2></label>',
      '    <input id="itemOrder_SE" value="SE,11399" type="checkbox"><label for="itemOrder_SE"><l0>灵力秘药(SE)</l0><l1>靈力秘藥(SE)</l1><l2>Spirit Elixir</l2></label><br>',
      '    <input id="itemOrder_LE" value="LE,11501" type="checkbox"><label for="itemOrder_LE"><l0>最终秘药(LE)</l0><l1>最終秘藥(LE)</l1><l2>Last Elixir</l2></label>',
      '    <input id="itemOrder_ED" value="ED,11401" type="checkbox"><label for="itemOrder_ED"><l0>能量饮料(ED)</l0><l1>能量飲料(ED)</l1><l2>Energy Drink</l2></label>',
      '    <input id="itemOrder_CC" value="CC,11402" type="checkbox"><label for="itemOrder_CC"><l0>咖啡因糖果(CC)</l0><l1>咖啡因糖果(CC)</l1><l2>Caffeinated Candy</l2></label></div>',
      '  <div><input id="item_HG" type="checkbox"><label for="item_HG"><b><l0>生命宝石(HG)</l0><l1>生命寶石(HG)</l1><l2>Health Gem</l2></b></label>: {{itemHGCondition}}</div>',
      '  <div><input id="item_MG" type="checkbox"><label for="item_MG"><b><l0>魔力宝石(MG)</l0><l1>魔力寶石(MG)</l1><l2>Mana Gem</l2></b></label>: {{itemMGCondition}}</div>',
      '  <div><input id="item_SG" type="checkbox"><label for="item_SG"><b><l0>灵力宝石(SG)</l0><l1>靈力寶石(SG)</l1><l2>Spirit Gem</l2></b></label>: {{itemSGCondition}}</div>',
      '  <div><input id="item_Mystic" type="checkbox"><label for="item_Mystic"><b><l0>神秘宝石(Mystic)</l0><l1>神秘寶石(Mystic)</l1><l2>Mystic Gem</l2></b></label>: {{itemMysticCondition}}</div>',
      '  <div><input id="item_Cure" type="checkbox"><label for="item_Cure"><b><l0>治疗(Cure)</l0><l1>治療(Cure)</l1><l2>Cure</l2></b></label>: {{itemCureCondition}}</div>',
      '  <div><input id="item_FC" type="checkbox"><label for="item_FC"><b><l0>完全治愈(FC)</l0><l1>完全治愈(FC)</l1><l2>Full-Cure</l2></b></label>: {{itemFCCondition}}</div>',
      '  <div><input id="item_HP" type="checkbox"><label for="item_HP"><b><l0>生命药水(HP)</l0><l1>生命藥水(HP)</l1><l2>Health Potion</l2></b></label>: {{itemHPCondition}}</div>',
      '  <div><input id="item_HE" type="checkbox"><label for="item_HE"><b><l0>生命秘药(HE)</l0><l1>生命秘藥(HE)</l1><l2>Health Elixir</l2></b></label>: {{itemHECondition}}</div>',
      '  <div><input id="item_MP" type="checkbox"><label for="item_MP"><b><l0>魔力药水(MP)</l0><l1>魔力藥水(MP)</l1><l2>Mana Potion</l2></b></label>: {{itemMPCondition}}</div>',
      '  <div><input id="item_ME" type="checkbox"><label for="item_ME"><b><l0>魔力秘药(ME)</l0><l1>魔力秘藥(ME)</l1><l2>Mana Elixir</l2></b></label>: {{itemMECondition}}</div>',
      '  <div><input id="item_SP" type="checkbox"><label for="item_SP"><b><l0>灵力药水(SP)</l0><l1>靈力藥水(SP)</l1><l2>Spirit Potion</l2></b></label>: {{itemSPCondition}}</div>',
      '  <div><input id="item_SE" type="checkbox"><label for="item_SE"><b><l0>灵力秘药(SE)</l0><l1>靈力秘藥(SE)</l1><l2>Spirit Elixir</l2></b></label>: {{itemSECondition}}</div>',
      '  <div><input id="item_LE" type="checkbox"><label for="item_LE"><b><l0>最终秘药(LE)</l0><l1>最終秘藥(LE)</l1><l2>Last Elixir</l2></b></label>: {{itemLECondition}}</div>',
      '  <div><input id="item_ED" type="checkbox"><label for="item_ED"><b><l0>能量饮料(ED)</l0><l1>能量飲料(ED)</l1><l2>Energy Drink</l2></b></label>: {{itemEDCondition}}</div>',
      '  <div><input id="item_CC" type="checkbox"><label for="item_CC"><b><l0>咖啡因糖果(CC)</l0><l1>咖啡因糖果(CC)</l1><l2>Caffeinated Candy</l2></b></label>: {{itemCCCondition}}</div></div>',
      '<div class="hvAATab" id="hvAATab-Channel">',
      '  <l0><b>获得引导时</b>（此时1点MP施法与150%伤害）</l0><l1><b>獲得引導時</b>（此時1點MP施法與150%傷害）</l1><l2><b>During Channeling effect</b> (1 mp spell cost and 150% spell damage)</l2>:',
      '  <div><b><l0>先施放引导技能</l0><l1>先施放引導技能</l1><l2>First cast</l2></b>: <br>',
      '    <l0>注意: 此处的施放顺序与</l0><l1>注意: 此處的施放順序与</l1><l2>Note: The cast order here is the same as in</l2><a class="hvAAGoto" name="hvAATab-Buff">BUFF<l01>技能</l01><l2> Spells</l2></a><l0>里的相同</l0><l1>裡的相同</l1><br>',
      '    <input id="channelSkill_Pr" type="checkbox"><label for="channelSkill_Pr"><l0>守护(Pr)</l0><l1>守護(Pr)</l1><l2>Protection</l2></label>',
      '    <input id="channelSkill_SL" type="checkbox"><label for="channelSkill_SL"><l0>生命火花(SL)</l0><l1>生命火花(SL)</l1><l2>Spark of Life</l2></label>',
      '    <input id="channelSkill_SS" type="checkbox"><label for="channelSkill_SS"><l0>灵力盾(SS)</l0><l1>靈力盾(SS)</l1><l2>Spirit Shield</l2></label>',
      '    <input id="channelSkill_Ha" type="checkbox"><label for="channelSkill_Ha"><l0>疾速(Ha)</l0><l1>疾速(Ha)</l1><l2>Haste</l2></label><br>',
      '    <input id="channelSkill_AF" type="checkbox"><label for="channelSkill_AF"><l0>奥术集中(AF)</l0><l1>奧術集中(AF)</l1><l2>Arcane Focus</l2></label>',
      '    <input id="channelSkill_He" type="checkbox"><label for="channelSkill_He"><l0>穿心(He)</l0><l1>穿心(He)</l1><l2>Heartseeker</l2></label>',
      '    <input id="channelSkill_Re" type="checkbox"><label for="channelSkill_Re"><l0>细胞活化(Re)</l0><l1>細胞活化(Re)</l1><l2>Regen</l2></label>',
      '    <input id="channelSkill_SV" type="checkbox"><label for="channelSkill_SV"><l0>影纱(SV)</l0><l1>影紗(SV)</l1><l2>Shadow Veil</l2></label>',
      '    <input id="channelSkill_Ab" type="checkbox"><label for="channelSkill_Ab"><l0>吸收(Ab)</l0><l1>吸收(Ab)</l1><l2>Absorb</l2></label></div>',
      '  <div><input id="channelSkill2" type="checkbox"><label for="channelSkill2"><l0><b>再使用技能</b></label>: ',
      '    <div class="channelSkill2Order"><l0>施放顺序</l0><l1>施放順序</l1><l2>Cast Order</l2>: <input name="channelSkill2OrderName" style="width:80%;" type="text" disabled="true"><input name="channelSkill2OrderValue" style="width:80%;" type="hidden" disabled="true"><br>',
      '    <input id="channelSkill2Order_Cu" value="Cu,311" type="checkbox"><label for="channelSkill2Order_Cu"><l0>治疗(Cure)</l0><l1>治療(Cure)</l1><l2>Cure</l2></label>',
      '    <input id="channelSkill2Order_FC" value="FC,313" type="checkbox"><label for="channelSkill2Order_FC"><l0>完全治愈(FC)</l0><l1>完全治愈(FC)</l1><l2>Full-Cure</l2></label>',
      '    <input id="channelSkill2Order_Pr" value="Pr,411" type="checkbox"><label for="channelSkill2Order_Pr"><l0>守护(Pr)</l0><l1>守護(Pr)</l1><l2>Protection</l2></label>',
      '    <input id="channelSkill2Order_SL" value="SL,422" type="checkbox"><label for="channelSkill2Order_SL"><l0>生命火花(SL)</l0><l1>生命火花(SL)</l1><l2>Spark of Life</l2></label>',
      '    <input id="channelSkill2Order_SS" value="SS,423" type="checkbox"><label for="channelSkill2Order_SS"><l0>灵力盾(SS)</l0><l1>靈力盾(SS)</l1><l2>Spirit Shield</l2></label>',
      '    <input id="channelSkill2Order_Ha" value="Ha,412" type="checkbox"><label for="channelSkill2Order_Ha"><l0>疾速(Ha)</l0><l1>疾速(Ha)</l1><l2>Haste</l2></label><br>',
      '    <input id="channelSkill2Order_AF" value="AF,432" type="checkbox"><label for="channelSkill2Order_AF"><l0>奥术集中(AF)</l0><l1>奧術集中(AF)</l1><l2>Arcane Focus</l2></label>',
      '    <input id="channelSkill2Order_He" value="He,431" type="checkbox"><label for="channelSkill2Order_He"><l0>穿心(He)</l0><l1>穿心(He)</l1><l2>Heartseeker</l2></label>',
      '    <input id="channelSkill2Order_Re" value="Re,312" type="checkbox"><label for="channelSkill2Order_Re"><l0>细胞活化(Re)</l0><l1>細胞活化(Re)</l1><l2>Regen</l2></label>',
      '    <input id="channelSkill2Order_SV" value="SV,413" type="checkbox"><label for="channelSkill2Order_SV"><l0>影纱(SV)</l0><l1>影紗(SV)</l1><l2>Shadow Veil</l2></label>',
      '    <input id="channelSkill2Order_Ab" value="Ab,421" type="checkbox"><label for="channelSkill2Order_Ab"><l0>吸收(Ab)</l0><l1>吸收(Ab)</l1><l2>Absorb</l2></label></div></div>',
      '  <div><l0><b>最后ReBuff</b>: 重新施放最先消失的Buff</l0><l1><b>最後ReBuff</b>: 重新施放最先消失的Buff</l1><l2><b>At last, re-cast the spells which will expire first</b></l2>.</div></div>',
      '<div class="hvAATab" id="hvAATab-Buff">{{buffSkillCondition}}',
      '  <div class="buffSkillOrder"><l0>施放顺序</l0><l1>施放順序</l1><l2>Cast Order</l2>: ',
      '    <input name="buffSkillOrderValue" style="width:80%;" type="text" disabled="true"><br>',
      '    <input id="buffSkillOrder_Pr" type="checkbox"><label for="buffSkillOrder_Pr"><l0>守护(Pr)</l0><l1>守護(Pr)</l1><l2>Protection</l2></label>',
      '    <input id="buffSkillOrder_SL" type="checkbox"><label for="buffSkillOrder_SL"><l0>生命火花(SL)</l0><l1>生命火花(SL)</l1><l2>Spark of Life</l2></label>',
      '    <input id="buffSkillOrder_SS" type="checkbox"><label for="buffSkillOrder_SS"><l0>灵力盾(SS)</l0><l1>靈力盾(SS)</l1><l2>Spirit Shield</l2></label>',
      '    <input id="buffSkillOrder_Ha" type="checkbox"><label for="buffSkillOrder_Ha"><l0>疾速(Ha)</l0><l1>疾速(Ha)</l1><l2>Haste</l2></label><br>',
      '    <input id="buffSkillOrder_AF" type="checkbox"><label for="buffSkillOrder_AF"><l0>奥术集中(AF)</l0><l1>奧術集中(AF)</l1><l2>Arcane Focus</l2></label>',
      '    <input id="buffSkillOrder_He" type="checkbox"><label for="buffSkillOrder_He"><l0>穿心(He)</l0><l1>穿心(He)</l1><l2>Heartseeker</l2></label>',
      '    <input id="buffSkillOrder_Re" type="checkbox"><label for="buffSkillOrder_Re"><l0>细胞活化(Re)</l0><l1>細胞活化(Re)</l1><l2>Regen</l2></label>',
      '    <input id="buffSkillOrder_SV" type="checkbox"><label for="buffSkillOrder_SV"><l0>影纱(SV)</l0><l1>影紗(SV)</l1><l2>Shadow Veil</l2></label>',
      '    <input id="buffSkillOrder_Ab" type="checkbox"><label for="buffSkillOrder_Ab"><l0>吸收(Ab)</l0><l1>吸收(Ab)</l1><l2>Absorb</l2></label>',
      '  </div>',
      '  <div><l0>Buff不存在就施放的技能</l0><l1>Buff不存在就施放的技能</l1><l2>Cast spells if the buff is not present</l2>: ',
      '    <div><input id="buffSkill_HD" type="checkbox"><label for="buffSkill_HD"><l0>生命长效药(HD)</l0><l1>生命長效藥(HD)</l1><l2>Health Draught</l2></label>{{buffSkillHDCondition}}</div>',
      '    <div><input id="buffSkill_MD" type="checkbox"><label for="buffSkill_MD"><l0>魔力长效药(MD)</l0><l1>魔力長效藥(MD)</l1><l2>Mana Draught</l2></label>{{buffSkillMDCondition}}</div>',
      '    <div><input id="buffSkill_SD" type="checkbox"><label for="buffSkill_SD"><l0>灵力长效药(MD)</l0><l1>靈力長效藥(MD)</l1><l2>Spirit Draught</l2></label>{{buffSkillSDCondition}}</div>',
      '    <div><input id="buffSkill_FV" type="checkbox"><label for="buffSkill_FV"><l0>花瓶(FV)</l0><l1>花瓶(FV)</l1><l2>Flower Vase</l2></label>{{buffSkillFVCondition}}</div>',
      '    <div><input id="buffSkill_BG" type="checkbox"><label for="buffSkill_BG"><l0>泡泡糖(BG)</l0><l1>泡泡糖(BG)</l1><l2>Bubble-Gum</l2></label>{{buffSkillBGCondition}}</div>',
      '    <div><input id="buffSkill_Pr" type="checkbox"><label for="buffSkill_Pr"><l0>守护(Pr)</l0><l1>守護(Pr)</l1><l2>Protection</l2></label>{{buffSkillPrCondition}}</div>',
      '    <div><input id="buffSkill_SL" type="checkbox"><label for="buffSkill_SL"><l0>生命火花(SL)</l0><l1>生命火花(SL)</l1><l2>Spark of Life</l2></label>{{buffSkillSLCondition}}</div>',
      '    <div><input id="buffSkill_SS" type="checkbox"><label for="buffSkill_SS"><l0>灵力盾(SS)</l0><l1>靈力盾(SS)</l1><l2>Spirit Shield</l2></label>{{buffSkillSSCondition}}</div>',
      '    <div><input id="buffSkill_Ha" type="checkbox"><label for="buffSkill_Ha"><l0>疾速(Ha)</l0><l1>疾速(Ha)</l1><l2>Haste</l2></label>{{buffSkillHaCondition}}</div>',
      '    <div><input id="buffSkill_AF" type="checkbox"><label for="buffSkill_AF"><l0>奥术集中(AF)</l0><l1>奧術集中(AF)</l1><l2>Arcane Focus</l2></label>{{buffSkillAFCondition}}</div>',
      '    <div><input id="buffSkill_He" type="checkbox"><label for="buffSkill_He"><l0>穿心(He)</l0><l1>穿心(He)</l1><l2>Heartseeker</l2></label>{{buffSkillHeCondition}}</div>',
      '    <div><input id="buffSkill_Re" type="checkbox"><label for="buffSkill_Re"><l0>细胞活化(Re)</l0><l1>細胞活化(Re)</l1><l2>Regen</l2></label>{{buffSkillReCondition}}</div>',
      '    <div><input id="buffSkill_SV" type="checkbox"><label for="buffSkill_SV"><l0>影纱(SV)</l0><l1>影紗(SV)</l1><l2>Shadow Veil</l2></label>{{buffSkillSVCondition}}</div>',
      '    <div><input id="buffSkill_Ab" type="checkbox"><label for="buffSkill_Ab"><l0>吸收(Ab)</l0><l1>吸收(Ab)</l1><l2>Absorb</l2></label>{{buffSkillAbCondition}}</div>',
      '  </div>',
      '</div>',
      '<div class="hvAATab" id="hvAATab-Debuff">',
      '  <div class="debuffSkillOrder"><l0>施放顺序</l0><l1>施放順序</l1><l2>Cast Order</l2>:',
      '    <input name="debuffSkillOrderValue" style="width:80%;" type="text" disabled="true"><br>',
      '    <input id="debuffSkillOrder_Sle" type="checkbox"><label for="debuffSkillOrder_Sle"><l0>沉眠(Sl)</l0><l1>沉眠(Sl)</l1><l2>Sleep</l2></label>',
      '    <input id="debuffSkillOrder_Bl" type="checkbox"><label for="debuffSkillOrder_Bl"><l0>致盲(Bl)</l0><l1>致盲(Bl)</l1><l2>Blind</l2></label>',
      '    <input id="debuffSkillOrder_Slo" type="checkbox"><label for="debuffSkillOrder_Slo"><l0>缓慢(Slo)</l0><l1>緩慢(Slo)</l1><l2>Slow</l2></label>',
      '    <input id="debuffSkillOrder_Im" type="checkbox"><label for="debuffSkillOrder_Im"><l0>陷危(Im)</l0><l1>陷危(Im)</l1><l2>Imperil</l2></label>',
      '    <input id="debuffSkillOrder_MN" type="checkbox"><label for="debuffSkillOrder_MN"><l0>魔磁网(MN)</l0><l1>魔磁網(MN)</l1><l2>MagNet</l2></label>',
      '    <input id="debuffSkillOrder_Si" type="checkbox"><label for="debuffSkillOrder_Si"><l0>沉默(Si)</l0><l1>沉默(Si)</l1><l2>Silence</l2></label>',
      '    <input id="debuffSkillOrder_Dr" type="checkbox"><label for="debuffSkillOrder_Dr"><l0>枯竭(Dr)</l0><l1>枯竭(Dr)</l1><l2>Drain</l2></label>',
      '    <input id="debuffSkillOrder_We" type="checkbox"><label for="debuffSkillOrder_We"><l0>虚弱(We)</l0><l1>虛弱(We)</l1><l2>Weaken</l2></label>',
      '    <input id="debuffSkillOrder_Co" type="checkbox"><label for="debuffSkillOrder_Co"><l0>混乱(Co)</l0><l1>混亂(Co)</l1><l2>Confuse</l2></label></div>',
      '  <div><l01>特殊</l01><l2>Special</l2><input id="debuffSkillWeAll" type="checkbox"><label for="debuffSkillWeAll"><l0>先给所有敌人上虚弱(We)</l0><l1>先給所有敵人上虛弱(We)</l1><l2>Weakened all enemies first.</l2></label></div>{{debuffSkillWeAllCondition}}',
      '  <div><l01>特殊</l01><l2>Special</l2><input id="debuffSkillImAll" type="checkbox"><label for="debuffSkillImAll"><l0>先给所有敌人上陷危(Im)</l0><l1>先給所有敵人上陷危(Im)</l1><l2>Imperiled all enemies first.</l2></label></div>{{debuffSkillImAllCondition}}',
      '    <div><input id="debuffSkill_Sle" type="checkbox"><label for="debuffSkill_Sle"><l0>沉眠(Sl)</l0><l1>沉眠(Sl)</l1><l2>Sleep</l2></label>{{debuffSkillSleCondition}}</div>',
      '    <div><input id="debuffSkill_Bl" type="checkbox"><label for="debuffSkill_Bl"><l0>致盲(Bl)</l0><l1>致盲(Bl)</l1><l2>Blind</l2></label>{{debuffSkillBlCondition}}</div>',
      '    <div><input id="debuffSkill_Slo" type="checkbox"><label for="debuffSkill_Slo"><l0>缓慢(Slo)</l0><l1>緩慢(Slo)</l1><l2>Slow</l2></label>{{debuffSkillSloCondition}}</div>',
      '    <div><input id="debuffSkill_Im" type="checkbox"><label for="debuffSkill_Im"><l0>陷危(Im)</l0><l1>陷危(Im)</l1><l2>Imperil</l2></label>{{debuffSkillImCondition}}</div>',
      '    <div><input id="debuffSkill_MN" type="checkbox"><label for="debuffSkill_MN"><l0>魔磁网(MN)</l0><l1>魔磁網(MN)</l1><l2>MagNet</l2></label>{{debuffSkillMNCondition}}</div>',
      '    <div><input id="debuffSkill_Si" type="checkbox"><label for="debuffSkill_Si"><l0>沉默(Si)</l0><l1>沉默(Si)</l1><l2>Silence</l2></label>{{debuffSkillSiCondition}}</div>',
      '    <div><input id="debuffSkill_Dr" type="checkbox"><label for="debuffSkill_Dr"><l0>枯竭(Dr)</l0><l1>枯竭(Dr)</l1><l2>Drain</l2></label>{{debuffSkillDrCondition}}</div>',
      '    <div><input id="debuffSkill_We" type="checkbox"><label for="debuffSkill_We"><l0>虚弱(We)</l0><l1>虛弱(We)</l1><l2>Weaken</l2></label>{{debuffSkillWeCondition}}</div>',
      '    <div><input id="debuffSkill_Co" type="checkbox"><label for="debuffSkill_Co"><l0>混乱(Co)</l0><l1>混亂(Co)</l1><l2>Confuse</l2></label></label>{{debuffSkillCoCondition}}</div>',
      '  <div><l0>持续</l0><l1>持續</l1><l2>Expire</l2> Turns: <input id="debuffSkillTurnAlert" type="checkbox"><label for="debuffSkillTurnAlert"><l0>无法正常施放DEBUFF技能时，警报</l0><l1>無法正常施放DEBUFF技能時，警報</l1><l2>If it can not cast de-skills normally, alert.</l2></label><br>',
      '    <l0>沉眠(Sl)</l0><l1>沉眠(Sl)</l1><l2>Sleep</l2>: <input class="hvAANumber" name="debuffSkillTurn_Sle" type="text">',
      '    <l0>致盲(Bl)</l0><l1>致盲(Bl)</l1><l2>Blind</l2>: <input class="hvAANumber" name="debuffSkillTurn_Bl" type="text">',
      '    <l0>缓慢(Slo)</l0><l1>緩慢(Slo)</l1><l2>Slow</l2>: <input class="hvAANumber" name="debuffSkillTurn_Slo" type="text"><br>',
      '    <l0>陷危(Im)</l0><l1>陷危(Im)</l1><l2>Imperil</l2>: <input class="hvAANumber" name="debuffSkillTurn_Im" type="text">',
      '    <l0>魔磁网(MN)</l0><l1>魔磁網(MN)</l1><l2>MagNet</l2>: <input class="hvAANumber" name="debuffSkillTurn_MN" type="text">',
      '    <l0>沉默(Si)</l0><l1>沉默(Si)</l1><l2>Silence</l2>: <input class="hvAANumber" name="debuffSkillTurn_Si" type="text"><br>',
      '    <l0>枯竭(Dr)</l0><l1>枯竭(Dr)</l1><l2>Drain</l2>: <input class="hvAANumber" name="debuffSkillTurn_Dr" type="text">',
      '    <l0>虚弱(We)</l0><l1>虛弱(We)</l1><l2>Weaken</l2>: <input class="hvAANumber" name="debuffSkillTurn_We" type="text">',
      '    <l0>混乱(Co)</l0><l1>混亂(Co)</l1><l2>Confuse</l2>: <input class="hvAANumber" name="debuffSkillTurn_Co" type="text"> </div></div>',
      '<div class="hvAATab" id="hvAATab-Skill">',
      '  <div><span><l0>注意: 默认在灵动架式状态下使用，请在<a class="hvAAGoto" name="hvAATab-Main">主要选项</a>勾选并设置<b>开启/关闭灵动架式</b></l0><l1>注意: 默認在靈動架式狀態下使用，請在<a class="hvAAGoto" name="hvAATab-Main">主要選項</a>勾選並設置<b>開啟/關閉靈動架式</b></l1><l2>Note: use under Spirit by default, please check and set the <b>Turn on/off Spirit Stance</b> in <a class="hvAAGoto" name="hvAATab-Main">Main</a></l2></span></div>',
      '  <div class="skillOrder"><l0>施放顺序</l0><l1>施放順序</l1><l2>Cast Order</l2>: ',
      '  <input name="skillOrderValue" style="width:80%;" type="text" disabled="true"><br>',
      '  <input id="skillOrder_OFC" type="checkbox"><label for="skillOrder_OFC"><l0>友情小马砲</l0><l1>友情小馬砲</l1><l2>OFC</l2></label><input id="skillOrder_FRD" type="checkbox"><label for="skillOrder_FRD"><l0>龙吼</l0><l1>龍吼</l1><l2>FRD</l2></label><input id="skillOrder_T3" type="checkbox"><label for="skillOrder_T3">T3</label><input id="skillOrder_T2" type="checkbox"><label for="skillOrder_T2">T2</label><input id="skillOrder_T1" type="checkbox"><label for="skillOrder_T1">T1</label></div>',
      '  <div><input id="skill_OFC" type="checkbox"><label for="skill_OFC"><l0>友情小马砲</l0><l1>友情小馬砲</l1><l2>OFC</l2></label>: <input id="skillOTOS_OFC" type="checkbox"><label for="skillOTOS_OFC"><l01>一回合只使用一次</l01><l2>One round only spell one time</l2></label>{{skillOFCCondition}}</div>',
      '  <div><input id="skill_FRD" type="checkbox"><label for="skill_FRD"><l0>龙吼</l0><l1>龍吼</l1><l2>FRD</l2></label>: <input id="skillOTOS_FRD" type="checkbox"><label for="skillOTOS_FRD"><l01>一回合只使用一次</l01><l2>One round only spell one time</l2></label>{{skillFRDCondition}}</div>',
      '  <div><l0>战斗风格</l0><l1>戰鬥風格</l1><l2>Fighting style</l2>: <select name="fightingStyle"><option value="1">二天一流 / Niten Ichiryu</option><option value="2">单手 / One-Handed</option><option value="3">双手 / 2-Handed Weapon</option><option value="4">双持 / Dual Wielding</option><option value="5">法杖 / Staff</option></select></div>',
      '  <div><input id="skill_T3" type="checkbox"><label for="skill_T3"><l0>3阶（如果有）</l0><l1>3階（如果有）</l1><l2>T3(if exist)</l2></label>: <input id="skillOTOS_T3" type="checkbox"><label for="skillOTOS_T3"><l01>一回合只使用一次</l01><l2>One round only spell one time</l2></label><br><input id="mercifulBlow" type="checkbox"><label for="mercifulBlow"><l0>最后的慈悲(MB)：优先攻击满足条件的敌人 (25% HP, 流血)</l0><l1>最後的慈悲(MB)：優先攻擊滿足條件的敵人 (25% HP, 流血)</l1><l2>Merciful Blow: Attack the enemy which has 25% HP and is bleeding first</l2></label>{{skillT3Condition}}</div>',
      '  <div><input id="skill_T2" type="checkbox"><label for="skill_T2"><l0>2阶（如果有）</l0><l1>2階（如果有）</l1><l2>T2(if exist)</l2></label>: <input id="skillOTOS_T2" type="checkbox"><label for="skillOTOS_T2"><l01>一回合只使用一次</l01><l2>One round only spell one time</l2></label>{{skillT2Condition}}</div>',
      '  <div><input id="skill_T1" type="checkbox"><label for="skill_T1"><l0>1阶</l0><l1>1階</l1><l2>T1</l2></label>: <input id="skillOTOS_T1" type="checkbox"><label for="skillOTOS_T1"><l01>一回合只使用一次</l01><l2>One round only spell one time</l2></label>{{skillT1Condition}}</div></div>',
      '<div class="hvAATab" id="hvAATab-Scroll">',
      '  <l0>战役模式</l0><l1>戰役模式</l1><l2>Battle type</l2>: ',
      '  <input id="scrollRoundType_ar" type="checkbox"><label for="scrollRoundType_ar"><l0>竞技场(AR)</l0><l1>競技場(AR)</l1><l2>The Arena</l2></label><input id="scrollRoundType_rb" type="checkbox"><label for="scrollRoundType_rb"><l0>浴血擂台(RB)</l0><l1>浴血擂台(RB)</l1><l2>Ring of Blood</l2></label><input id="scrollRoundType_gr" type="checkbox"><label for="scrollRoundType_gr"><l0>压榨届(GF)</l0><l1>壓榨界(GF)</l1><l2>GrindFest</l2></label><input id="scrollRoundType_iw" type="checkbox"><label for="scrollRoundType_iw"><l0>道具届(IW)</l0><l1>道具界(IW)</l1><l2>Item World</l2></label><input id="scrollRoundType_ba" type="checkbox"><label for="scrollRoundType_ba"><l0>随机遭遇(ba)</l0><l1>隨機遭遇(ba)</l1><l2>Encounter</l2></label><input id="scrollRoundType_tw" type="checkbox"><label for="scrollRoundType_tw"><l0>塔楼(Tw)</l0><l1>塔樓(Tw)</l1><l2>The Tower</l2></label>{{scrollCondition}}',
      '  <input id="scrollFirst" type="checkbox"><label for="scrollFirst"><l0>存在技能生成的Buff时，仍然使用卷轴</l0><l1>存在技能生成的Buff時，仍然使用捲軸</l1><l2>Use Scrolls even when there are effects from spells</l2>.</label>',
      '  <div><input id="scroll_Sw" type="checkbox"><label for="scroll_Sw"><l0>加速卷轴(Sw)</l0><l1>加速捲軸(Sw)</l1><l2>Scroll of Swiftness</l2></label>{{scrollSwCondition}}</div>',
      '  <div><input id="scroll_Pr" type="checkbox"><label for="scroll_Pr"><l0>守护卷轴(Pr)</l0><l1>守護捲軸(Pr)</l1><l2>Scroll of Protection</l2></label>{{scrollPrCondition}}</div>',
      '  <div><input id="scroll_Av" type="checkbox"><label for="scroll_Av"><l0>化身卷轴(Av)</l0><l1>化身捲軸(Av)</l1><l2>Scroll of the Avatar</l2></label>{{scrollAvCondition}}</div>',
      '  <div><input id="scroll_Ab" type="checkbox"><label for="scroll_Ab"><l0>吸收卷轴(Ab)</l0><l1>吸收捲軸(Ab)</l1><l2>Scroll of Absorption</l2></label>{{scrollAbCondition}}</div>',
      '  <div><input id="scroll_Sh" type="checkbox"><label for="scroll_Sh"><l0>幻影卷轴(Sh)</l0><l1>幻影捲軸(Sh)</l1><l2>Scroll of Shadows</l2></label>{{scrollShCondition}}</div>',
      '  <div><input id="scroll_Li" type="checkbox"><label for="scroll_Li"><l0>生命卷轴(Li)</l0><l1>生命捲軸(Li)</l1><l2>Scroll of Life</l2></label>{{scrollLiCondition}}</div>',
      '  <div><input id="scroll_Go" type="checkbox"><label for="scroll_Go"><l0>众神卷轴(Go)</l0><l1>眾神捲軸(Go)</l1><l2>Scroll of the Gods</l2></label>{{scrollGoCondition}}</div></div>',
      '<div class="hvAATab" id="hvAATab-Infusion">',
      '  <l0>注意：魔药属性与</l0><l1>注意：魔藥屬性與</l1><l2>Note: The style of infusion is the same as Attack Mode in </l2><a class="hvAAGoto" name="hvAATab-Main"><l0>主要选项</l0><l1>主要選項</l1><l2>Main</l2></a><l0>里的攻击模式相同</l0><l1>裡的攻擊模式相同</l1><l2></l2><br>{{infusionCondition}}</div>',
      '<div class="hvAATab" id="hvAATab-Alarm">',
      '  <span class="hvAATitle"><l0>自定义警报</l0><l1>自定義警報</l1><l2>Alarm</l2></span><br>',
      '  <l0>注意：留空则使用默认音频，建议每个用户使用自定义音频</l0><l1>注意：留空則使用默認音頻，建議每個用戶使用自定義音頻</l1><l2>Note: Leave the box blank to use default audio, it\'s recommended for all user to use custom audio.</l2>',
      '  <div><input id="audioEnable_Common" type="checkbox"><label for="audioEnable_Common"><l01>通用</l01><l2>Common</l2>: <input name="audio_Common" type="text"></label><br><input id="audioEnable_Error" type="checkbox"><label for="audioEnable_Error"><l0>错误</l0><l1>錯誤</l1><l2>Error</l2>: <input name="audio_Error" type="text"></label><br><input id="audioEnable_Defeat" type="checkbox"><label for="audioEnable_Defeat"><l0>失败</l0><l1>失敗</l1><l2>Defeat</l2>: <input name="audio_Defeat" type="text"></label><br><input id="audioEnable_Riddle" type="checkbox"><label for="audioEnable_Riddle"><l0>答题</l0><l1>答題</l1><l2>Riddle</l2>: <input name="audio_Riddle" type="text"></label><br><input id="audioEnable_Victory" type="checkbox"><label for="audioEnable_Victory"><l0>胜利</l0><l1>勝利</l1><l2>Victory</l2>: <input name="audio_Victory" type="text"></label></div>',
      '  <div><l0>请将将要测试的音频文件的地址填入这里</l0><l1>請將將要測試的音頻文件的地址填入這裡</l1><l2>Plz put in the audio file address you want to test</l2>: <br><input class="hvAADebug" name="audio_Text" type="text"></div></div>',
      '<div class="hvAATab" id="hvAATab-Rule">',
      '  <span class="hvAATitle"><l0>攻击规则</l0><l1>攻擊規則</l1><l2>Attack Rule</l2></span> <l01><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md#攻击规则-示例" target="_blank">示例</a></l01><l2><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README_en.md#attack-rule-example" target="_blank">Example</a></l2>',
      '  <div>1. <l0>初始血量权重=Log10(目标血量/场上最低血量)<l1>初始血量權重=Log10(目標血量/場上最低血量)</l1><l2>BaseHpWeight = BaseHpRatio*Log10(TargetHP/MaxHPOnField)</l2><br><l0>初始权重系数(>0:低血量优先;<0:高血量优先)</l0><l1>初始權重係數(>0:低血量優先;<0:高血量優先)</l1><l2>BaseHpRatio(>0:low hp first;<0:high hp first)</l2><input class="hvAANumber" name="baseHpRatio" placeholder="1" type="text" style="width:40px"><br><l0>不可命中目标的权重</l0><l1>不可名中目標的權重</l1><l2>Unreachable Target Weight</l2><input class="hvAANumber" name="unreachableWeight" placeholder="1000" type="text" style="width:40px"></div>',
      '  <div>2. <l0>初始权重与下述各Buff权重相加</l0><l1>初始權重與下述各Buff權重相加</l1><l2>PW(X) = BaseHpWeight + Accumulated_Weight_of_Deprecating_Spells_In_Effect(X)</l2><br>',
      '    <l0>虚弱(We)</l0><l1>虛弱(We)</l1><l2>Weaken</l2>: <input class="hvAANumber" name="weight_We" placeholder="12" type="text">',
      '    <l0>致盲(Bl)</l0><l1>致盲(Bl)</l1><l2>Blind</l2>: <input class="hvAANumber" name="weight_Bl" placeholder="10" type="text">',
      '    <l0>缓慢(Slo)</l0><l1>緩慢(Slo)</l1><l2>Slow</l2>: <input class="hvAANumber" name="weight_Slo" placeholder="15" type="text">',
      '    <l0>沉默(Si)</l0><l1>沉默(Si)</l1><l2>Silence</l2>: <input class="hvAANumber" name="weight_Si" placeholder="10" type="text">',
      '    <l0>沉眠(Sl)</l0><l1>沉眠(Sl)</l1><l2>Sleep</l2>: <input class="hvAANumber" name="weight_Sle" placeholder="100" type="text"><br>',
      '    <l0>陷危(Im)</l0><l1>陷危(Im)</l1><l2>Imperil</l2>: <input class="hvAANumber" name="weight_Im" placeholder="-15" type="text">',
      '    <l0>破甲(PA)</l0><l1>破甲(PA)</l1><l2>Penetrated Armor</l2>: <input class="hvAANumber" name="weight_PA" placeholder="-12" type="text">',
      '    <l0>流血(Bl)</l0><l1>流血(Bl)</l1><l2>Bleeding Wound</l2>: <input class="hvAANumber" name="weight_BW" placeholder="-10" type="text"><br>',
      '    <l0>混乱(Co)</l0><l1>混亂(Co)</l1><l2>Confuse</l2>: <input class="hvAANumber" name="weight_Co" placeholder="-109" type="text">',
      '    <l0>枯竭(Dr)</l0><l1>枯竭(Dr)</l1><l2>Drain</l2>: <input class="hvAANumber" name="weight_Dr" placeholder="2" type="text">',
      '    <l0>魔磁网(MN)</l0><l1>魔磁網(MN)</l1><l2>MagNet</l2>: <input class="hvAANumber" name="weight_MN" placeholder="7" type="text">',
      '    <l0>眩晕(St)</l0><l1>眩暈(St)</l1><l2>Stunned</l2>: <input class="hvAANumber" name="weight_Stun" placeholder="290" type="text"><br>',
      '    <l0>魔力合流(CM)</l0><l1>魔力合流(CM)</l1><l2>Coalesced Mana</l2>: <input class="hvAANumber" name="weight_CM" placeholder="-20" type="text"><br>',
      '  </div>',
      '  <div>3. PW(X) += Log10(1 + <l0>武器攻击中央目标伤害倍率(副手及冲击技能)</l0><l1>乘以武器攻擊中央目標傷害倍率(副手及衝擊技能)</l1><l2>Weapon Attack Central Target Damage Ratio (Offhand & Strike)</l2>)<br><l0>额外伤害比例：</l0><l1>額外傷害比例：</l1><l2>Extra DMG Ratio: </l2><input class="hvAANumber" name="centralExtraRatio" placeholder="0" type="text">%</div>',
      '  <div>4. <l0>优先选择权重最低的目标</l0><l1>優先選擇權重最低的目標</l1><l2>Choose target with lowest rank first</l2><br><l0>BOSS:Yggdrasil额外权重</l0><l1>BOSS:Yggdrasil額外權重</l1><l2>BOSS:Yggdrasil Extra Weight</l2><input class="hvAANumber" name="YggdrasilExtraWeight" placeholder="-1000" type="text" style="width:40px"></div>',
      '  <div>PS. <l0>如果你对各Buff权重有特别见解，请务必</l0><l1>如果你對各Buff權重有特別見解，請務必</l1><l2>If you have any suggestions, please </l2><a class="hvAAGoto" name="hvAATab-Feedback"><l0>告诉我</l0><l1>告訴我</l1><l2>let me know</l2></a>.<br><l0>参考公式为：</l0><l1>參考公式為：</l1><l2>Basic Weight Calculation as: </l2>PW(X) = Log10(<br>  (HP/MaxHPOnField/(1+CentralAttackDamageExtraRatio)<br>  *[HPActualEffectivenessRate:∏(1-debuff),debuff=Im|PA|Bl|Co|Dr|MN|St]<br>  /[DMGActualEffectivenessRate:∏(1-debuff),debuff=We|Bl|Slo|Si|Sl|Co|Dr|MN|St])<br>)</div>',
      '  <div><l0>显示权重及顺序</l0><l1>顯示權重及順序</l1><l2>DIsplay Weight and order</l2><input id="displayWeight" type="checkbox">',
      '  <l0>显示优先级背景色</l0><l1>顯示優先級背景色</l1><l2>DIsplay Priority Background Color</l2><input id="displayWeightBackground" type="checkbox"></div>',
      '  <l0>CSS格式或可eval执行的公式（可用&lt;rank&gt;, &lt;all&gt;指代优先级和总优先级数量, &lt;style_x&gt;指代第x个的相同配置值），例如：</l0><l1>CSS格式或可eval執行的公式（可用&lt;rank&gt;, &lt;all&gt;指代優先級和總優先級數量, &lt;style_x&gt;指代第x個的相同配置值）：例如</l1><l2>CSS or eval executable formula(use &lt;rank&gt; and &lt;all&gt; to refer to priority rank and total rank count, &lt;style_x&gt; to refer to the same option value of option No.x)Such as: </l2><br>`hsl(${Math.round(240*&lt;rank&gt;/Math.max(1,&lt;all&gt;-1))}deg 50% 50%)`<br>',
      '   1. <input class="customizeInput" name="weightBackground_1" type="text"><br>',
      '   2. <input class="customizeInput" name="weightBackground_2" type="text">',
      '   3. <input class="customizeInput" name="weightBackground_3" type="text">',
      '   4. <input class="customizeInput" name="weightBackground_4" type="text"><br>',
      '   5. <input class="customizeInput" name="weightBackground_5" type="text">',
      '   6. <input class="customizeInput" name="weightBackground_6" type="text">',
      '   7. <input class="customizeInput" name="weightBackground_7" type="text"><br>',
      '   8. <input class="customizeInput" name="weightBackground_8" type="text">',
      '   9. <input class="customizeInput" name="weightBackground_9" type="text">',
      '  10. <input class="customizeInput" name="weightBackground_0" type="text">',
      '</div>',
      '<div class="hvAATab hvAACenter" id="hvAATab-Drop">',
      '  <span class="hvAATitle"><l0>掉落监测</l0><l1>掉落監測</l1><l2>Drops Tracking</l2></span><button class="reDropMonitor"><l01>重置</l01><l2>Reset</l2></button>',
      '  <div><l0>记录装备的最低品质</l0><l1>記錄裝備的最低品質</l1><l2>Minimum drop quality</l2>: <select name="dropQuality"><option value="0">Crude</option><option value="1">Fair</option><option value="2">Average</option><option value="3">Superior</option><option value="4">Exquisite</option><option value="5">Magnificent</option><option value="6">Legendary</option><option value="7">Peerless</option></select></div>',
      '  <table></table></div>',
      '<div class="hvAATab hvAACenter" id="hvAATab-Usage">',
      '  <span class="hvAATitle"><l0>数据记录</l0><l1>數據記錄</l1><l2>Usage Tracking</l2></span><button class="reRecordUsage"><l01>重置</l01><l2>Reset</l2></button>',
      '  <table></table></div>',
      '<div class="hvAATab hvAACenter" id="hvAATab-About">',
      '  <div><span class="hvAATitle"><l0>当前状况</l0><l1>當前狀況</l1><l2>Current status</l2></span>: ',
      '    <l0>如果脚本长期暂停且网络无问题，请点击</l0><l1>如果腳本長期暫停且網絡無問題，請點擊</l1><l2>If the script does not work and you are sure that it\'s not because of your internet, click</l2><button class="hvAAFix"><l0>尝试修复</l0><l1>嘗試修復</l1><l2>Try to fix</l2></button><br>',
      '    <l0>战役模式</l0><l1>戰役模式</l1><l2>Battle type</l2>: <select class="hvAADebug" name="roundType"><option></option><option value="ar">The Arena</option><option value="rb">Ring of Blood</option><option value="gr">GrindFest</option><option value="iw">Item World</option><option value="ba">Encounter</option><option value="tw">The Tower</option></select> <l0>当前回合</l0><l1>當前回合</l1><l2>Current round</l2>: <input name="roundNow" class="hvAADebug hvAANumber" placeholder="1" type="text"> <l0>总回合</l0><l1>總回合</l1><l2>Total rounds</l2>: <input name="roundAll" class="hvAADebug hvAANumber" placeholder="1" type="text"></div>',
      '  <div class="hvAAQuickSite"><input id="showQuickSite" type="checkbox"><span class="hvAATitle"><l0>快捷站点</l0><l1>快捷站點</l1><l2>Quick Site</l2></span><button class="quickSiteAdd"><l01>新增</l01><l2>Add</l2></button><br>',
      '    <l0>注意: 留空“姓名”一栏则表示删除该行，修改后请保存</l0><l1>注意: 留空“姓名”一欄則表示刪除該行，修改後請保存</l1><l2>Note: The "name" input box left blank will be deleted, after change please save in time.</l2>',
      '    <table><tbody><tr class="hvAATh"><td><l0>图标</l0><l1>圖標</l1><l2>ICON</l2></td><td><l0>名称</l0><l1>名稱</l1><l2>Name</l2></td><td><l0>链接</l0><l1>鏈接</l1><l2>Link</l2></td></tr></tbody></table></div>',
      '  <div><span class="hvAATitle"><l0>备份与还原</l0><l1>備份與還原</l1><l2>Backup and Restore</l2></span><button class="hvAABackup"><l0>备份设置</l0><l1>備份設置</l1><l2>Backup Confiuration</l2></button><button class="hvAARestore"><l0>还原设置</l0><l1>還原設置</l1><l2>Restore Confiuration</l2></button><button class="hvAADelete"><l0>删除设置</l0><l1>刪除設置</l1><l2>Delete Confiuration</l2></button><ul class="hvAABackupList"></ul></div>',
      '  <div><span class="hvAATitle"><l0>导入与导出</l0><l1>導入與導出</l1><l2>Import and Export</l2></span><button class="hvAAExport"><l0>导出设置</l0><l1>導出設置</l1><l2>Export Confiuration</l2></button><button class="hvAAImport"><l0>导入设置</l0><l1>導入設置</l1><l2>Import Confiuration</l2></button><textarea class="hvAAConfig"></textarea></div></div>',
      '<div class="hvAATab" id="hvAATab-Feedback">',
      '  <span class="hvAATitle"><l01>反馈</l01><l2>Feedback</l2></span>',
      '  <div><l0>链接</l0><l1>鏈接</l1><l2>Links</l2>: <a href="https://github.com/dodying/UserJs/issues/new" target="_blank">1. GitHub</a><a href="https://greasyfork.org/forum/post/discussion?script=18482" target="_blank">2. GreasyFork</a></div>',
      '  <div><span class="hvAATitle"><l0>反馈说明</l0><l1>反饋說明</l1><l2>Feedback Note</l2></span>: <br>',
      '    <l0>如果你遇见了Bug，想帮助作者修复它<br>你应当提供以下多种资料: <br>1. 场景描述<br>2. 你的配置<br>3. 控制台日志 (按Ctrl+Shift+i打开开发者助手，再选择Console(控制台)面板)<br>4. 战斗日志  (如果是在战斗中)<br>如果是无法容忍甚至使脚本失效的Bug，请尝试安装旧版本<hr>如果你有一些建议使这个脚本更加有用，那么: <br>1. 请尽量简述你的想法<br>2. 如果可以，请提供一些场景 (方便作者更好理解)</l0>',
      '    <l1>如果你遇見了Bug，想幫助作者修復它<br>你應當提供以下多種資料: <br>1. 場景描述<br>2. 你的配置<br>3. 控制台日誌 (按Ctrl+Shift+i打開開發者助手，再選擇Console(控制台)面板)<br>4. 戰鬥日誌 (如果是在戰鬥中)<br>如果是無法容忍甚至使腳本失效的Bug，請嘗試安裝舊版本<hr>如果你有一些建議使這個腳本更加有用，那麼: <br>1. 請盡量簡述你的想法<br>2.如果可以，請提供一些場景 (方便作者更好理解)</l1>',
      '    <l2>If you encounter a bug and would like to help the author fix it<br>You should provide the following information: <br>1. the Situation<br>2. Your Configuration<br>3. Console Log (press Ctrl + Shift + i to open the Developer Assistant, And then select the Console panel)<br>4. Battle Log (if in combat)<br>If you are unable to tolerate this bug or even the bug made the script fail, try installing the old version<hr>If you have some suggestions to make this script more useful, then: <br>1. Please briefly describe your thoughts<br>2. If you can, please provide some scenes (to facilitate the author to better understand)<br>PS. For English user, please express in basic English (Oh my poor English, thanks for Google Translate)</l2></div></div>',
      '</div>',
      '<div class="hvAAButtonBox hvAACenter">',
      '  <button class="hvAAReset"><l0>重置设置</l0><l1>重置設置</l1><l2>Reset</l2></button><button class="hvAAApply"><l0>应用</l0><l1>應用</l1><l2>Apply</l2></button><button class="hvAACancel"><l01>取消</l01><l2>Cancel</l2></button></div>',
    ].join('').replace(/{{(.*?)}}/g, '<div class="customize" name="$1"></div>');
    // 绑定事件
    gE('select[name="lang"]', optionBox).onchange = function () { // 选择语言
      gE('.hvAA-LangStyle').textContent = `l${this.value}{display:inline!important;}`;
      if (/^[01]$/.test(this.value)) {
        gE('.hvAA-LangStyle').textContent += 'l01{display:inline!important;}';
      }
      g('lang', this.value);
    };
    gE('.hvAATabmenu', optionBox).onclick = function (e) { // 标签页事件
      if (e.target.tagName === 'INPUT') {
        return;
      }
      const target = (e.target.tagName === 'SPAN') ? e.target : e.target.parentNode;
      const name = target.getAttribute('name');
      let i; let
        _html;
      if (name === 'Drop') { // 掉落监测
        let drop = getValue('drop', true) || {};
        const dropOld = getValue('dropOld', true) || [];
        drop = objSort(drop);
        _html = '<tbody>';
        if (dropOld.length === 0 || (dropOld.length === 1 && !getValue('drop', true))) {
          if (dropOld.length === 1) {
            drop = dropOld[0];
          }
          _html = `${_html}<tr class="hvAATh"><td></td><td><l0>数量</l0><l1>數量</l1><l2>Amount</l2></td></tr>`;
          for (i in drop) {
            _html = `${_html}<tr><td>${i}</td><td>${drop[i]}</td></tr>`;
          }
        } else {
          if (getValue('drop')) {
            drop.__name = getValue('battleCode');
            dropOld.push(drop);
          }
          dropOld.reverse();
          _html = `${_html}<tr class="hvAATh"><td class="selectTable"></td>`;
          dropOld.forEach((_dropOld) => {
            _html = `${_html}<td>${_dropOld.__name}</td>`;
          });
          _html = `${_html}</tr>`;
          getKeys(dropOld).forEach((key) => {
            if (key === '__name') {
              return;
            }
            _html = `${_html}<tr><td>${key}</td>`;
            dropOld.forEach((_dropOld) => {
              if (key in _dropOld) {
                _html = `${_html}<td>${_dropOld[key]}</td>`;
              } else {
                _html = `${_html}<td></td>`;
              }
            });
            _html = `${_html}</tr>`;
          });
        }
        _html = `${_html}</tbody>`;
        gE('#hvAATab-Drop>table').innerHTML = _html;
      } else if (name === 'Usage') { // 数据记录
        let stats = getValue('stats', true) || {};
        const statsOld = getValue('statsOld', true) || [];
        const translation = {
          self: '<l0>自身 (次数)</l0><l1>自身 (次數)</l1><l2>Self (Frequency)</l2>',
          restore: '<l0>回复 (总量)</l0><l1>回复 (總量)</l1><l2>Restore (Amount)</l2>',
          items: '<l0>物品 (次数)</l0><l1>物品 (次數)</l1><l2>Items (Frequency)</l2>',
          magic: '<l0>技能 (次数)</l0><l1>技能 (次數)</l1><l2>Magic (Frequency)</l2>',
          damage: '<l0>伤害 (总量)</l0><l1>傷害 (總量)</l1><l2>Damage (Amount)</l2>',
          hurt: '<l0>受伤 (总量)</l0><l1>受傷 (總量)</l1><l2>Loss (Amount)</l2>',
          proficiency: '<l0>熟练度 (总量)</l0><l1>熟練度 (總量)</l1><l2>Proficiency (Amount)</l2>',
        };
        _html = '<tbody>';
        if (statsOld.length === 0 || (statsOld.length === 1 && !getValue('stats', true))) {
          if (statsOld.length === 1) {
            stats = statsOld[0];
          }
          for (i in stats) {
            _html = `${_html}<tr class="hvAATh"><td>${translation[i]}</td><td><l01>值</l01><l2>Value</l2></td></tr>`;
            stats[i] = objSort(stats[i]);
            for (const j in stats[i]) {
              _html = `${_html}<tr><td>${j}</td><td>${stats[i][j]}</td></tr>`;
            }
          }
        } else {
          if (getValue('stats')) {
            stats.__name = getValue('battleCode');
            statsOld.push(stats);
          }
          statsOld.reverse();
          _html = `${_html}<tr class="hvAATh"><td class="selectTable"></td>`;
          statsOld.forEach((_dropOld) => {
            _html = `${_html}<td>${_dropOld.__name}</td>`;
          });
          _html = `${_html}</tr>`;
          Object.keys(translation).forEach((i) => {
            if (i === '__name') {
              return;
            }
            _html = `${_html}<tr class="hvAATh"><td colspan="${statsOld.length + 1}">${translation[i]}</td></tr>`;
            getKeys(statsOld, i).forEach((key) => {
              _html = `${_html}<tr><td>${key}</td>`;
              statsOld.forEach((_statsOld) => {
                if (key in _statsOld[i]) {
                  _html = `${_html}<td>${_statsOld[i][key]}</td>`;
                } else {
                  _html = `${_html}<td></td>`;
                }
              });
            });
          });
        }
        _html = `${_html}</tbody>`;
        gE('#hvAATab-Usage>table').innerHTML = _html;
      } else if (name === 'About') { // 关于本脚本
        gE('.hvAADebug', 'all', optionBox).forEach((input) => {
          if (getValue(input.name)) {
            input.value = getValue(input.name);
          }
        });
      }
      if (name === 'Drop' || name === 'Usage') {
        gE('.selectTable', 'all', optionBox).forEach((i) => {
          i.onclick = null;
          i.onclick = function (e) {
            const select = window.getSelection();
            select.removeAllRanges();
            const range = document.createRange();
            range.selectNodeContents(e.target.parentNode.parentNode.parentNode);
            select.addRange(range);
          };
        });
      }
      gE('.hvAATab', 'all', optionBox).forEach((i) => {
        i.style.display = (i.id === `hvAATab-${name}`) ? 'block' : 'none';
      });
    };
    gE('.hvAAGoto', 'all', optionBox).forEach((i) => {
      i.onclick = function () {
        gE(`.hvAATabmenu>span[name="${this.name.replace('hvAATab-', '')}"]`).click();
      };
    });

    function updateGroup() {
      const group = gE('.customizeGroup', 'all', g('customizeTarget'));
      const customizeBox = gE('.customizeBox');
      if (group.length + 1 === gE('select[name="groupChoose"]>option', 'all', customizeBox).length) {
        return;
      }
      gE('select[name="groupChoose"]', customizeBox).textContent = '';
      for (let i = 0; i <= group.length; i++) {
        const option = gE('select[name="groupChoose"]', customizeBox).appendChild(cE('option'));
        if (i === group.length) {
          option.value = 'new';
          option.textContent = 'new';
        } else {
          option.value = i + 1;
          option.textContent = i + 1;
        }
      }
    }
    optionBox.onmousemove = function (e) { // 自定义条件相关事件
      const target = (e.target.className === 'customize') ? e.target : (e.target.parentNode.className === 'customize') ? e.target.parentNode : e.target.parentNode.parentNode;
      if (!gE('.customizeBox')) {
        customizeBox();
      }
      updateGroup();
      if (target.className !== 'customize' && target.parentNode.className !== 'customize') {
        if (!target.className.match('customize')) {
          gE('.customizeBox').style.zIndex = -1;
        }
        return;
      }
      g('customizeTarget', target);
      const position = target.getBoundingClientRect();
      gE('.customizeBox').style.zIndex = 5;
      gE('.customizeBox').style.top = `${position.bottom + window.scrollY}px`;
      gE('.customizeBox').style.left = `${position.left + window.scrollX}px`;
    };
    // 标签页-主要选项
    gE('input[name="pauseHotkeyStr"]', optionBox).onkeyup = function (e) {
      this.value = (/^[a-z]$/.test(e.key)) ? e.key.toUpperCase() : e.key;
      gE('input[name="pauseHotkeyCode"]', optionBox).value = e.keyCode;
    };
    gE('.testNotification', optionBox).onclick = function () {
      _alert(0, '接下来开始预处理。\n如果询问是否允许，请选择允许', '接下來開始預處理。\n如果詢問是否允許，請選擇允許', 'Now, pretreat.\nPlease allow to receive notifications if you are asked for permission');
      setNotification('Test');
    };
    gE('.testPopup', optionBox).onclick = function () {
      _alert(0, '接下来开始预处理。\n关闭本警告框之后，请切换到其他标签页，\n并在足够长的时间后再打开本标签页', '接下來開始預處理。\n關閉本警告框之後，請切換到其他標籤頁，\n並在足夠長的時間後再打開本標籤頁', 'Now, pretreat.\nAfter dismissing this alert, focus other tab,\nfocus this tab again after long time.');
      setTimeout(() => {
        const riddleWindow = window.open(window.location.href, 'riddleWindow', 'resizable,scrollbars,width=1241,height=707');
        if (riddleWindow) {
          setTimeout(() => {
            riddleWindow.close();
          }, 200);
        }
      }, 3000);
    };
    gE('.staminaLostLog', optionBox).onclick = function () {
      const out = [];
      const staminaLostLog = getValue('staminaLostLog', true);
      for (const i in staminaLostLog) {
        out.push(`${i}: ${staminaLostLog[i]}`);
      }
      if (window.confirm(`总共${out.length}条记录 (There are ${out.length} logs): \n${out.reverse().join('\n')}\n是否重置 (Whether to reset)?`)) {
        setValue('staminaLostLog', {});
      }
    };
    gE('.idleArenaReset', optionBox).onclick = function () {
      if (_alert(1, '是否重置', '是否重置', 'Whether to reset')) {
        delValue('arena');
      }
    };
    gE('.hvAAShowLevels', optionBox).onclick = function () {
      gE('.hvAAArenaLevels').style.display = (gE('.hvAAArenaLevels').style.display === 'block') ? 'none' : 'block';
    };
    gE('.hvAALevelsClear', optionBox).onclick = function () {
      gE('[name="idleArenaLevels"]', optionBox).value = '';
      gE('[name="idleArenaValue"]', optionBox).value = '';
      gE('.hvAAArenaLevels>input', 'all', optionBox).forEach((input) => {
        input.checked = false;
      });
    };
    gE('.hvAAArenaLevels', optionBox).onclick = function (e) {
      if (e.target.tagName !== 'INPUT' && e.target.type !== 'checkbox') {
        return;
      }
      const valueArray = e.target.value.split(',');
      let levels = gE('input[name="idleArenaLevels"]').value;
      let { value } = gE('input[name="idleArenaValue"]');
      if (e.target.checked) {
        levels = levels + ((levels) ? `,${valueArray[0]}` : valueArray[0]);
        value = value + ((value) ? `,${valueArray[1]}` : valueArray[1]);
      } else {
        levels = levels.replace(new RegExp(`(^|,)${valueArray[0]}(,|$)`), '$2').replace(/^,/, '');
        value = value.replace(new RegExp(`(^|,)${valueArray[1]}(,|$)`), '$2').replace(/^,/, '');
      }
      gE('input[name="idleArenaLevels"]').value = levels;
      gE('input[name="idleArenaValue"]').value = value;
    };
    // 标签页-物品
    gE('.itemOrder', optionBox).onclick = function (e) {
      if (e.target.tagName !== 'INPUT' && e.target.type !== 'checkbox') {
        return;
      }
      const valueArray = e.target.value.split(',');
      let name = gE('input[name="itemOrderName"]').value;
      let { value } = gE('input[name="itemOrderValue"]');
      if (e.target.checked) {
        name = name + ((name) ? `,${valueArray[0]}` : valueArray[0]);
        value = value + ((value) ? `,${valueArray[1]}` : valueArray[1]);
      } else {
        name = name.replace(new RegExp(`(^|,)${valueArray[0]}(,|$)`), '$2').replace(/^,/, '');
        value = value.replace(new RegExp(`(^|,)${valueArray[1]}(,|$)`), '$2').replace(/^,/, '');
      }
      gE('input[name="itemOrderName"]').value = name;
      gE('input[name="itemOrderValue"]').value = value;
    };
    // 标签页-Channel技能
    gE('.channelSkill2Order', optionBox).onclick = function (e) {
      if (e.target.tagName !== 'INPUT' && e.target.type !== 'checkbox') {
        return;
      }
      const valueArray = e.target.value.split(',');
      let name = gE('input[name="channelSkill2OrderName"]').value;
      let { value } = gE('input[name="channelSkill2OrderValue"]');
      if (e.target.checked) {
        name = name + ((name) ? `,${valueArray[0]}` : valueArray[0]);
        value = value + ((value) ? `,${valueArray[1]}` : valueArray[1]);
      } else {
        name = name.replace(new RegExp(`(^|,)${valueArray[0]}(,|$)`), '$2').replace(/^,/, '');
        value = value.replace(new RegExp(`(^|,)${valueArray[1]}(,|$)`), '$2').replace(/^,/, '');
      }
      gE('input[name="channelSkill2OrderName"]').value = name;
      gE('input[name="channelSkill2OrderValue"]').value = value;
    };
    // 标签页-BUFF技能
    gE('.buffSkillOrder', optionBox).onclick = function (e) {
      if (e.target.tagName !== 'INPUT' && e.target.type !== 'checkbox') {
        return;
      }
      const name = e.target.id.match(/_(.*)/)[1];
      let { value } = gE('input[name="buffSkillOrderValue"]');
      if (e.target.checked) {
        value = value + ((value) ? `,${name}` : name);
      } else {
        value = value.replace(new RegExp(`(^|,)${name}(,|$)`), '$2').replace(/^,/, '');
      }
      gE('input[name="buffSkillOrderValue"]').value = value;
    };
    // 标签页-DEBUFF技能
    gE('.debuffSkillOrder', optionBox).onclick = function (e) {
      if (e.target.tagName !== 'INPUT' && e.target.type !== 'checkbox') {
        return;
      }
      const name = e.target.id.match(/_(.*)/)[1];
      let { value } = gE('input[name="debuffSkillOrderValue"]');
      if (e.target.checked) {
        value = value + ((value) ? `,${name}` : name);
      } else {
        value = value.replace(new RegExp(`(^|,)${name}(,|$)`), '$2').replace(/^,/, '');
      }
      gE('input[name="debuffSkillOrderValue"]').value = value;
    };
    // 标签页-其他技能
    gE('.skillOrder', optionBox).onclick = function (e) {
      if (e.target.tagName !== 'INPUT' && e.target.type !== 'checkbox') {
        return;
      }
      const name = e.target.id.match(/_(.*)/)[1];
      let { value } = gE('input[name="skillOrderValue"]');
      if (e.target.checked) {
        value = value + ((value) ? `,${name}` : name);
      } else {
        value = value.replace(new RegExp(`(^|,)${name}(,|$)`), '$2').replace(/^,/, '');
      }
      gE('input[name="skillOrderValue"]').value = value;
    };
    // 标签页-警报
    gE('input[name="audio_Text"]', optionBox).onchange = function () {
      if (this.value === '') {
        return;
      }
      if (!/^http(s)?:|^ftp:|^data:audio/.test(this.value)) {
        _alert(0, '地址必须以"http:","https:","ftp:","data:audio"开头', '地址必須以"http:","https:","ftp:","data:audio"開頭', 'The address must start with "http:", "https:", "ftp:", and "data:audio"');
        return;
      }
      _alert(0, '接下来将测试该音频\n如果该音频无法播放或无法载入，请变更\n请测试完成后再键入另一个音频', '接下來將測試該音頻\n如果該音頻無法播放或無法載入，請變更\n請測試完成後再鍵入另一個音頻', 'The audio will be tested after you close this prompt\nIf the audio doesn\'t load or play, change the url');
      const box = gE('#hvAATab-Alarm').appendChild(cE('div'));
      box.innerHTML = this.value;
      const audio = box.appendChild(cE('audio'));
      audio.controls = true;
      audio.src = this.value;
      audio.play();
    };
    // 标签页-掉落监测
    gE('.reDropMonitor', optionBox).onclick = function () {
      if (_alert(1, '是否重置', '是否重置', 'Whether to reset')) {
        delValue('drop');
        delValue('dropOld');
      }
    };
    // 标签页-数据记录
    gE('.reRecordUsage', optionBox).onclick = function () {
      if (_alert(1, '是否重置', '是否重置', 'Whether to reset')) {
        delValue('stats');
        delValue('statsOld');
      }
    };
    // 标签页-关于本脚本
    gE('.hvAAFix', optionBox).onclick = function () {
      gE('.hvAADebug[name^="round"]', 'all', optionBox).forEach((input) => {
        setValue(input.name, input.value || input.placeholder);
      });
    };
    gE('.quickSiteAdd', optionBox).onclick = function () {
      const tr = gE('.hvAAQuickSite>table>tbody', optionBox).appendChild(cE('tr'));
      tr.innerHTML = '<td><input class="hvAADebug" type="text"></td><td><input class="hvAADebug" type="text"></td><td><input class="hvAADebug" type="text"></td>';
    };
    gE('.hvAAConfig', optionBox).onclick = function () {
      this.style.height = 0;
      this.style.height = `${this.scrollHeight}px`;
      this.select();
    };
    function rmListItem(code) { // 同步删除界面显示对应的项
      const configs = gE('#hvAATab-About > * > ul[class="hvAABackupList"] > li', 'all');
      for (const config of configs) {
        if (config.textContent == code) {
          config.remove();
        }
      }
    }
    gE('.hvAABackup', optionBox).onclick = function () {
      const code = _alert(2, '请输入当前配置代号', '請輸入當前配置代號', 'Please put in a name for the current configuration') || time(3);
      const backups = getValue('backup', true) || {};
      if (code in backups) { // 覆写同名配置
        if (_alert(1, '是否覆盖已有的同名配置？', '是否覆蓋已有的同名配置？', 'Do you want to overwrite the configuration with the same name?')) {
          delete backups[code];
          rmListItem(code);
        } else return;
      }
      backups[code] = getValue('option');
      setValue('backup', backups);
      const li = gE('.hvAABackupList', optionBox).appendChild(cE('li'));
      li.textContent = code;
    };
    gE('.hvAARestore', optionBox).onclick = function () {
      const code = _alert(2, '请输入配置代号', '請輸入配置代號', 'Please put in a name for a configuration');
      const backups = getValue('backup', true) || {};
      if (!(code in backups) || !code) {
        return;
      }
      setValue('option', backups[code]);
      goto();
    };
    gE('.hvAADelete', optionBox).onclick = function () {
      const code = _alert(2, '请输入配置代号', '請輸入配置代號', 'Please put in a name for a configuration');
      const backups = getValue('backup', true) || {};
      if (!(code in backups) || !code) {
        return;
      }
      delete backups[code];
      setValue('backup', backups);
      // goto();
      rmListItem(code);
    };
    gE('.hvAAExport', optionBox).onclick = function () {
      const t = getValue('option');
      gE('.hvAAConfig').value = typeof t === 'string' ? t : JSON.stringify(t);
    };
    gE('.hvAAImport', optionBox).onclick = function () {
      const option = JSON.parse(gE('.hvAAConfig').value);
      if (!option) {
        return;
      }
      if (_alert(1, '是否重置', '是否重置', 'Whether to reset')) {
        setValue('option', option);
        goto();
      }
    };
    //
    gE('.hvAAReset', optionBox).onclick = function () {
      if (_alert(1, '是否重置', '是否重置', 'Whether to reset')) {
        delValue('option');
      }
    };
    gE('.hvAAApply', optionBox).onclick = function () {
      if (gE('select[name="attackStatus"] option[value="-1"]:checked', optionBox)) {
        _alert(0, '请选择攻击模式', '請選擇攻擊模式', 'Please select the attack mode');
        gE('.hvAATabmenu>span[name="Main"]').click();
        gE('#attackStatus', optionBox).style.border = '1px solid red';
        setTimeout(() => {
          gE('#attackStatus', optionBox).style.border = '';
        }, 0.5 * _1s);
        return;
      }
      const _option = {
        version: g('version'),
      };
      let inputs = gE('input,select', 'all', optionBox);
      let itemName; let itemArray; let itemValue; let
        i;
      for (i = 0; i < inputs.length; i++) {
        if (inputs[i].className === 'hvAADebug') {
          continue;
        } else if (inputs[i].className === 'hvAANumber') {
          itemName = inputs[i].name;
          itemValue = (inputs[i].value || inputs[i].placeholder) * 1;
          if (isNaN(itemValue)) {
            continue;
          }
        } else if (inputs[i].type === 'text' || inputs[i].type === 'hidden') {
          itemName = inputs[i].name;
          itemValue = inputs[i].value || inputs[i].placeholder;
          if (itemValue === '') {
            continue;
          }
        } else if (inputs[i].type === 'checkbox') {
          itemName = inputs[i].id;
          itemValue = inputs[i].checked;
          if (itemValue === false) {
            continue;
          }
        } else if (inputs[i].type === 'select-one') {
          itemName = inputs[i].name;
          itemValue = inputs[i].value;
        }
        itemArray = itemName.split('_');
        if (itemArray.length === 1) {
          _option[itemName] = itemValue;
        } else {
          if (!(itemArray[0] in _option)) {
            _option[itemArray[0]] = {};
          }
          if (inputs[i].className === 'customizeInput') {
            if (typeof _option[itemArray[0]][itemArray[1]] === 'undefined') {
              _option[itemArray[0]][itemArray[1]] = [];
            }
            _option[itemArray[0]][itemArray[1]].push(itemValue);
          } else {
            _option[itemArray[0]][itemArray[1]] = itemValue;
          }
        }
      }
      inputs = gE('.hvAAQuickSite input[type="text"]', 'all', optionBox);
      for (i = 0; 3 * i < inputs.length; i++) {
        if (i === 0 && inputs.length !== 0) {
          _option.quickSite = [];
        }
        if (inputs[3 * i + 1].value === '') {
          continue;
        }
        _option.quickSite.push({
          fav: inputs[3 * i].value,
          name: inputs[3 * i + 1].value,
          url: inputs[3 * i + 2].value,
        });
      }
      setValue('option', _option);
      optionBox.style.display = 'none';
      goto();
    };
    gE('.hvAACancel', optionBox).onclick = function () {
      optionBox.style.display = 'none';
    };
    if (g('option')) {
      let i; let j; let
        k;
      const _option = g('option');
      const inputs = gE('input,select', 'all', optionBox);
      let itemName; let itemArray; let itemValue; let
        _html;
      for (i = 0; i < inputs.length; i++) {
        if (inputs[i].className === 'hvAADebug') {
          continue;
        }
        itemName = inputs[i].name || inputs[i].id;
        if (typeof _option[itemName] !== 'undefined') {
          itemValue = _option[itemName];
        } else {
          itemArray = itemName.split('_');
          itemValue = '';
          if (itemArray.length === 2 && typeof _option[itemArray[0]] === 'object' && inputs[i].className !== 'hvAACustomize' && typeof _option[itemArray[0]][itemArray[1]] !== 'undefined') {
            itemValue = _option[itemArray[0]][itemArray[1]];
          }
        }
        if (inputs[i].type === 'text' || inputs[i].type === 'hidden' || inputs[i].type === 'select-one' || inputs[i].type === 'number') {
          inputs[i].value = itemValue;
        } else if (inputs[i].type === 'checkbox') {
          inputs[i].checked = itemValue;
        }
      }
      const customize = gE('.customize', 'all', optionBox);
      for (i = 0; i < customize.length; i++) {
        itemName = customize[i].getAttribute('name');
        if (itemName in _option) {
          for (j in _option[itemName]) {
            const group = customize[i].appendChild(cE('div'));
            group.className = 'customizeGroup';
            group.innerHTML = `${j * 1 + 1}. `;
            for (k = 0; k < _option[itemName][j].length; k++) {
              const input = group.appendChild(cE('input'));
              input.type = 'text';
              input.className = 'customizeInput';
              input.name = `${itemName}_${j}`;
              input.value = _option[itemName][j][k];
            }
          }
        }
      }
      if (_option.quickSite) {
        _html = '<tr class="hvAATh"><td><l0>图标</l0><l1>圖標</l1><l2>ICON</l2></td><td><l0>名称</l0><l1>名稱</l1><l2>Name</l2></td><td><l0>链接</l0><l1>鏈接</l1><l2>Link</l2></td></tr>';
        _option.quickSite.forEach((i) => {
          _html = `${_html}<tr><td><input class="hvAADebug" type="text" value="${i.fav}"></td><td><input class="hvAADebug" type="text" value="${i.name}"></td><td><input class="hvAADebug" type="text" value="${i.url}"></td></tr>`;
        });
        gE('.hvAAQuickSite>table>tbody', optionBox).innerHTML = _html;
      }
      if (getValue('backup')) {
        const backups = getValue('backup', true);
        _html = '';
        for (i in backups) {
          _html = `${_html}<li>${i}</li>`;
        }
        gE('.hvAABackupList', optionBox).innerHTML = _html;
      }
    }
  }

  function customizeBox() { // 自定义条件界面
    const customizeBox = gE('body').appendChild(cE('div'));
    customizeBox.className = 'customizeBox';
    const statusOption = [
      '<option value="hp">hp</option>',
      '<option value="mp">mp</option>',
      '<option value="sp">sp</option>',
      '<option value="oc">oc</option>',
      '<option value="">- - - -</option>',
      '<option value="monsterAll">monsterAll</option>',
      '<option value="monsterAlive">monsterAlive</option>',
      '<option value="bossAll">bossAll</option>',
      '<option value="bossAlive">bossAlive</option>',
      '<option value="">- - - -</option>',
      '<option value="roundNow">roundNow</option>',
      '<option value="roundAll">roundAll</option>',
      '<option value="roundLeft">roundLeft</option>',
      '<option value="roundType">roundType</option>',
      '<option value="attackStatus">attackStatus</option>',
      '<option value="turn">turn</option>',
      '<option value="">- - - -</option>',
      '<option value="_isCd_">isCd</option>',
      '<option value="_buffTurn_">buffTurn</option>',
      '<option value=""></option>',
    ].join('');
    customizeBox.innerHTML = [
      '<span><l01><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md#自定义判断条件" target="_blank">?</a></l01><l2><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README_en.md#customize-condition" target="_blank">?</a></l2></span>',
      `<span class="hvAAInspect" title="off">${String.fromCharCode(0x21F1.toString(10))}</span>`,
      '<select name="groupChoose"></select>',
      `<select name="statusA">${statusOption}</select>`,
      '<select name="compareAB"><option value="1">＞</option><option value="2">＜</option><option value="3">≥</option><option value="4">≤</option><option value="5">＝</option><option value="6">≠</option></select>',
      `<select name="statusB">${statusOption}</select>`,
      '<button class="groupAdd">ADD</button>',
    ].join(' ');
    const funcSelect = function (e) {
      let box;
      if (gE('#hvAAInspectBox')) {
        box = gE('#hvAAInspectBox');
      } else {
        box = gE('body').appendChild(cE('div'));
        box.id = 'hvAAInspectBox';
      }
      let { target } = e;
      let find = attr(target);
      while (!find) {
        target = target.parentNode;
        if (target.id === 'csp' || target.tagName === 'BODY') {
          box.style.display = 'none';
          return;
        }
        find = attr(target);
      }
      box.textContent = find;
      box.style.display = 'block';
      box.style.left = `${e.pageX - e.offsetX + target.offsetWidth}px`;
      box.style.top = `${e.pageY - e.offsetY + target.offsetHeight}px`;
    };
    gE('.hvAAInspect', customizeBox).onclick = function () {
      if (this.title === 'on') {
        this.title = 'off';
        gE('#csp').removeEventListener('mousemove', funcSelect);
      } else {
        this.title = 'on';
        gE('#csp').addEventListener('mousemove', funcSelect);
      }
    };
    gE('.groupAdd', customizeBox).onclick = function () {
      const target = g('customizeTarget');
      const selects = gE('select', 'all', customizeBox);
      let groupChoose = selects[0].value;
      let group;
      if (groupChoose === 'new') {
        groupChoose = gE('option', 'all', selects[0]).length;
        group = target.appendChild(cE('div'));
        group.className = 'customizeGroup';
        group.innerHTML = `${groupChoose}. `;
        selects[0].click();
      } else {
        group = gE('.customizeGroup', 'all', target)[groupChoose - 1];
      }
      const input = group.appendChild(cE('input'));
      input.type = 'text';
      input.className = 'customizeInput';
      input.name = `${target.getAttribute('name')}_${groupChoose - 1}`;
      input.value = `${selects[1].value},${selects[2].value},${selects[3].value}`;
    };

    function attr(target) {
      const onmouseover = target.getAttribute('onmouseover');
      if (target.className === 'btsd') {
        return `Skill Id: ${target.id}`;
      } if (onmouseover && onmouseover.match('common.show_itemc_box')) {
        return `Item Id: ${onmouseover.match(/(\d+)\)/)[1]}`;
      } if (onmouseover && onmouseover.match('equips.set')) {
        return `Equip Id: ${onmouseover.match(/(\d+)/)[1]}`;
      } if (onmouseover && onmouseover.match('battle.set_infopane_effect')) {
        return `Buff Img: ${target.src.match(/\/e\/(.*?).png/)[1]}`;
      }
    }
  }

  function setAlarm(e) { // 发出警报
    e = e || 'Common';
    if (g('option').notification) {
      setNotification(e);
    }
    if (g('option').alert && g('option').audioEnable && g('option').audioEnable[e]) {
      setAudioAlarm(e);
    }
  }

  function setAudioAlarm(e) { // 发出音频警报
    let audio;
    if (gE(`#hvAAAlert-${e}`)) {
      audio = gE(`#hvAAAlert-${e}`);
    } else {
      audio = gE('body').appendChild(cE('audio'));
      audio.id = `hvAAAlert-${e}`;
      const fileType = '.ogg'; // var fileType = (/Chrome|Safari/.test(navigator.userAgent)) ? '.mp3' : '.wav';
      audio.src = (g('option').audio && g('option').audio[e]) ? g('option').audio[e] : `https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/${e}${fileType}`;
      audio.controls = true;
      audio.loop = (e === 'Riddle');
    }
    audio.play();

    function pauseAudio(e) {
      audio.pause();
      document.removeEventListener(e.type, pauseAudio, true);
    }
    document.addEventListener('mousemove', pauseAudio, true);
  }

  function setNotification(e) { // 发出桌面通知
    const notification = [
      {
        Common: {
          text: '未知',
          time: 5,
        },
        Error: {
          text: '某些错误发生了',
          time: 10,
        },
        Defeat: {
          text: '游戏失败\n玩家可自行查看战斗Log寻找失败原因',
          time: 5,
        },
        Riddle: {
          text: '小马答题\n紧急！\n紧急！\n紧急！',
          time: 30,
        },
        Victory: {
          text: '游戏胜利\n页面将在3秒后刷新',
          time: 3,
        },
        Test: {
          text: '测试文本',
          time: 3,
        },
      }, {
        Common: {
          text: '未知',
          time: 5,
        },
        Error: {
          text: '某些錯誤發生了',
          time: 10,
        },
        Defeat: {
          text: '遊戲失敗\n玩家可自行查看戰鬥Log尋找失敗原因',
          time: 5,
        },
        Riddle: {
          text: '小馬答題\n緊急！\n緊急！\n緊急！',
          time: 30,
        },
        Victory: {
          text: '遊戲勝利\n頁面將在3秒後刷新',
          time: 3,
        },
        Test: {
          text: '測試文本',
          time: 3,
        },
      }, {
        Common: {
          text: 'unknown',
          time: 5,
        },
        Error: {
          text: 'Some errors have occurred',
          time: 10,
        },
        Defeat: {
          text: 'You have been defeated.\nYou can check the battle log.',
          time: 5,
        },
        Riddle: {
          text: 'Riddle\nURGENT\nURGENT\nURGENT',
          time: 30,
        },
        Victory: {
          text: 'You\'re victorious.\nThis page will refresh in 3 seconds.',
          time: 3,
        },
        Test: {
          text: 'testText',
          time: 3,
        },
      },
    ][g('lang')][e];
    if (typeof GM_notification !== 'undefined') {
      GM_notification({
        text: notification.text,
        image: `${window.location.origin}/y/hentaiverse.png`,
        highlight: true,
        timeout: 1000 * notification.time,
      });
    }
    if (window.Notification && window.Notification.permission !== 'denied') {
      window.Notification.requestPermission((status) => {
        if (status === 'granted') {
          const n = new window.Notification(notification.text, {
            icon: '/y/hentaiverse.png',
          });
          setTimeout(() => {
            if (n) {
              n.close();
            }
          }, 1000 * notification.time);

          var nClose = function (e) {
            if (n) {
              n.close();
            }
            document.removeEventListener(e.type, nClose, true);
          };
          document.addEventListener('mousemove', nClose, true);
          // document.addEventListener('click', nClose, true);
        }
      });
    }
  }

  function checkCondition(parms) {
    if (typeof parms === 'undefined') {
      return true;
    }
    let i; let j; let
      k;
    const result = [];
    const returnValue = function (str) {
      if (str.match(/^_/)) {
        const arr = str.split('_');
        return func[arr[1]](...[...arr].splice(2));
      } if (str.match(/^'.*?'$|^".*?"$/)) {
        return str.substr(1, str.length - 2);
      } if (isNaN(str * 1)) {
        const paramList = str.split('.');
        let result;
        for (let key of paramList) {
          if (!result) {
            result = g(key) ?? getValue(key) ?? (g('battle') ?? getValue('battle', true))[key];
            continue;
          }
          result = result[key]
        }
        return result;
      }
      return str * 1;
    };
    var func = {
      isCd(id) {
        return isOn(id) ? 0 : 1;
      },
      buffTurn(img) {
        let buff = gE(`#pane_effects>img[src*="${img}"]`);
        if (!buff) {
          return 0;
        }
        buff = buff.getAttribute('onmouseover').match(/\(.*,.*, (.*?)\)$/)[1] * 1;
        return isNaN(buff) ? Infinity : buff;
      },
    };

    for (i in parms) {
      for (j = 0; j < parms[i].length; j++) {
        if (!Array.isArray(parms[i])) {
          continue;
        }
        k = parms[i][j].split(',');
        const kk = k.toString();
        k[0] = returnValue(k[0]);
        k[2] = returnValue(k[2]);

        if (k[0] === undefined || k[0] === null || (typeof k[0] !== "string" && isNaN(k[0]))) {
          Debug.log(kk[0], k[0]);
        }
        if (k[2] === undefined || k[2] === null || (typeof k[2] !== "string" && isNaN(k[2]))) {
          Debug.log(kk[2], k[2]);
        }

        switch (k[1]) {
          case '1':
            result[i] = k[0] > k[2];
            break;
          case '2':
            result[i] = k[0] < k[2];
            break;
          case '3':
            result[i] = k[0] >= k[2];
            break;
          case '4':
            result[i] = k[0] <= k[2];
            break;
          case '5':
            result[i] = k[0] === k[2];
            break;
          case '6':
            result[i] = k[0] !== k[2];
            break;
        }
        if (result[i] === false) {
          j = parms[i].length;
        }
      }
      if (result[i] === true) {
        return true;
      }
    }
    return false;
  }

  // 答题//
  function riddleAlert() { // 答题警报
    if (window.opener) {
      gE('#riddleanswer+img').onclick = function () {
        riddleSubmit(gE('#riddleanswer').value);
      };
    }
    setAlarm('Riddle');
    const answers = ['A', 'B', 'C'];
    document.onkeydown = function (e) {
      gE('#hvAAAlert-Riddle')?.pause();
      if (/^[abc]$/i.test(e.key)) {
        riddleSubmit(e.key.toUpperCase());
        this.onkeydown = null;
      } else if (/^[123]$/.test(e.key)) {
        riddleSubmit(answers[e.key - 1]);
        this.onkeydown = null;
      }
    };
    if (g('option').riddleRadio) {
      const bar = gE('body').appendChild(cE('div'));
      bar.className = 'answerBar';
      answers.forEach((answer) => {
        const button = bar.appendChild(cE('div'));
        button.value = answer;
        button.onclick = function () {
          riddleSubmit(this.value);
        };
      });
    }
    const checkTime = function () {
      let time;
      if (typeof g('time') === 'undefined') {
        const timeDiv = gE('#riddlecounter>div>div', 'all');
        if (timeDiv.length === 0) {
          return;
        }
        time = '';
        for (let j = 0; j < timeDiv.length; j++) {
          time = (timeDiv[j].style.backgroundPosition.match(/(\d+)px$/)[1] / 12).toString() + time;
        }
        g('time', time * 1);
      } else {
        time = g('time');
        time--;
        g('time', time);
      }
      document.title = time;
      if (time <= g('option').riddleAnswerTime) {
        riddleSubmit(gE('#riddleanswer').value || answers[parseInt(Math.random() * 3)]);
      }
    };
    for (let i = 0; i < 30; i++) {
      setTimeout(checkTime, i * _1s);
    }

    function riddleSubmit(answer) {
      if (!window.opener) {
        gE('#riddleanswer').value = answer;
        gE('#riddleanswer+img').click();
      } else {
        $ajax.fetch(window.location.href, `riddleanswer=${answer}`).then(() => { // 待续
          window.opener.document.location.href = window.location.href;
          window.close();
        });
        // post(window.location.href, () => { // 待续
        //   window.opener.document.location.href = window.location.href;
        //   window.close();
        // }, `riddleanswer=${answer}`);
      }
    }
  }

  // 战斗外//
  function checkIsHV() {
    if (window.location.host !== 'e-hentai.org') { // is in HV
      setValue('url', window.location.origin);
      return true;
    }
    setValue('lastEH', time(0));
    const isEngage = window.location.href === 'https://e-hentai.org/news.php?encounter';
    const encounter = getEncounter();
    let href = getValue('url') ?? (document.referrer.match('hentaiverse.org') ? new URL(document.referrer).origin : 'https://hentaiverse.org');
    const eventpane = gE('#eventpane');
    const now = time(0);
    let url;
    if (eventpane) { // 新一天或遭遇战
      url = gE('#eventpane>div>a')?.href.split('/')[3];
      encounter.unshift({ href: url, time: now });
      setEncounter(encounter);
    } else {
      if (encounter.length) {
        if (now - encounter[0]?.time > 0.5 * _1h) { // 延长最新一次的time, 避免因漏记录导致连续来回跳转
          encounter[0].time = now;
          setEncounter(encounter);
        }
        for (let e of encounter) {
          if (e.encountered) {
            continue;
          }
          url = e.href;
          break;
        }
      }
    }

    if (!url) {
      if (isEngage && !getValue('battle')) {
        // 自动跳转，同时先刷新遭遇时间，延长下一次遭遇
        openUrl(getValue('lastHref'));
      }
      return;
    }

    // 减少因在恒定世界处于战斗中时打开eh触发了遭遇而导致的错失
    // 缓存当前链接，等战斗结束时再自动打开，下次打开链接时：
    // 1. 若新的遭遇未出现，进入已缓存的战斗链接
    // 2. 若新的遭遇已出现，则前一次已超时失效错过，重新获取新的一次
    if (!isEngage) { // 战斗外，非自动跳转
      eventpane.style.cssText += 'color:red;' // 链接标红提醒
    } else if (getValue('battle')) { //战斗中
      eventpane.style.cssText += 'color:gray;' // 链接置灰提醒
    } else { // 战斗外，自动跳转
      openUrl(`${href}/${url}`);
    }
  }

  function setEncounter(encounter) {
    return g('encounter', setValue('encounter', encounter));
  }

  function getEncounter() {
    const getToday = (encounter) => encounter.filter(e => time(2, e.time) === time(2));
    const current = g('encounter') ?? [];
    let encounter = getValue('encounter', true) ?? [];
    if (JSON.stringify(current) === JSON.stringify(encounter)) {
      return getToday(encounter);
    }
    let dict = {};
    for (let e of current) {
      dict[e.href ?? `newDawn`] = e;
    }
    for (let e of encounter) {
      const key = e.href ?? `newDawn`;
      dict[key] ??= e;
      dict[key].time = Math.max(dict[key].time, e.time);
      dict[key].encountered = (e.encountered || dict[key].encountered) ? Math.max(dict[key].encountered ?? 0, e.encountered ?? 0) : undefined;
    }
    return getToday(Object.values(dict)).sort((x, y) => x.time < y.time ? 1 : x.time > y.time ? -1 : 0);
  }

  function quickSite() { // 快捷站点
    const quickSiteBar = gE('body').appendChild(cE('div'));
    quickSiteBar.className = 'quickSiteBar';
    quickSiteBar.innerHTML = '<span><a href="javascript:void(0);"class="quickSiteBarToggle">&lt;&lt;</a></span><span><a href="https://tieba.baidu.com/f?kw=hv网页游戏"target="_blank"><img src="https://www.baidu.com/favicon.ico" class="favicon"></img>贴吧</a></span><span><a href="https://forums.e-hentai.org/index.php?showforum=76"target="_blank"><img src="https://forums.e-hentai.org/favicon.ico" class="favicon"></img>Forums</a></span>';
    if (g('option').quickSite) {
      g('option').quickSite.forEach((site) => {
        quickSiteBar.innerHTML = `${quickSiteBar.innerHTML}<span title="${site.name}"><a href="${site.url}"target="_self">${(site.fav) ? `<img src="${site.fav}"class="favicon"></img>` : ''}${site.name}</a></span>`;
      });
    }
    gE('.quickSiteBarToggle', quickSiteBar).onclick = function () {
      const spans = gE('span', 'all', quickSiteBar);
      for (let i = 1; i < spans.length; i++) {
        spans[i].style.display = (this.textContent === '<<') ? 'none' : 'block';
      }
      this.textContent = (this.textContent === '<<') ? '>>' : '<<';
    };
  }

  function autoSwitchIsekai() {
    if (!g('option').isekai) {
      // 若不启用自动跳转
      return;
    }
    window.location.href = `${href.slice(0, href.indexOf('.org') + 4)}/${isIsekai ? '' : 'isekai/'}`;
  }

  async function asyncSetAbilityData() {
    logSwitchAsyncTask(arguments);
    const html = await $ajax.fetch('?s=Character&ss=ab');
    const doc = $doc(html);
    let ability = {};
    await Promise.all(Array.from(gE('#ability_treelist>div>img', 'all', doc)).map(async img => {
      const _ = img.getAttribute('onclick')?.match(/(\?s=(.*)tree=(.*))'/);
      const [href, type] = _ ? [_[1], _[3]] : ['?s=Character&ss=ab&tree=general', 'general'];
      const html = await $ajax.fetch(href);
      const doc = $doc(html);
      const slots = Array.from(gE('.ability_slotbox>div>div', 'all', doc)).forEach(slot => {
        const id = slot.id.match(/_(\d*)/)[1];
        const parent = slot.parentNode.parentNode.parentNode;
        ability[id] = {
          name: gE('.fc2', parent).innerText,
          type: type,
          level: Array.from(gE('.aw1,.aw2,.aw3,.aw4,.aw5,.aw6,.aw7,.aw8,.aw9,.aw10', parent).children).map(div => div.style.cssText.indexOf('f.png') === -1 ? 0 : 1).reduce((x, y) => x + y),
        }
      });
    }));
    setValue('ability', ability);
    logSwitchAsyncTask(arguments);
  }

  async function asyncSetEnergyDrinkHathperk() {
    logSwitchAsyncTask(arguments);
    const html = await $ajax.fetch('https://e-hentai.org/hathperks.php');
    const doc = $doc(html);
    const perks = gE('.stuffbox>table>tbody>tr', 'all', doc);
    if (!perks) {
      return;
    }
    setValue('staminaHathperk', perks[25].innerHTML.includes('Obtained'));
    logSwitchAsyncTask(arguments);
  }

  async function asyncSetStamina() {
    logSwitchAsyncTask(arguments);
    const html = await $ajax.fetch(window.location.href);
    setValue('staminaTime', Math.floor(time(0) / 1000 / 60 / 60));
    setValue('stamina', gE('#stamina_readout .fc4.far>div', $doc(html)).textContent.match(/\d+/)[0] * 1);
    logSwitchAsyncTask(arguments);
  }

  async function asyncGetItems() {
    logSwitchAsyncTask(arguments);
    const html = await $ajax.fetch('?s=Character&ss=it');
    const items = {};
    for (let each of gE('.nosel.itemlist>tbody', $doc(html)).children) {
      const name = each.children[0].children[0].innerText;
      const id = each.children[0].children[0].getAttribute('id').split('_')[1];
      const count = each.children[1].innerText;
      items[id] = [name, count];
    }
    g('items', items);
    logSwitchAsyncTask(arguments);
  }

  async function asyncCheckSupply() {
    if (!g('option').checkSupply) {
      return true;
    }
    logSwitchAsyncTask(arguments);
    const items = g('items');
    const thresholdList = g('option').checkItem;
    const checkList = g('option').isCheck;
    const needs = [];
    for (let id in checkList) {
      const item = items[id];
      if (!item) {
        continue;
      }
      const [name, count] = item;
      const threshold = thresholdList[id] ?? 0;
      if ((count ?? 0) >= threshold) {
        continue;
      }
      needs.push(`\n${name}(${count}<${threshold})`);
    }
    if (needs.length) {
      console.log(`Needs supply:${needs}`);
    }
    logSwitchAsyncTask(arguments);
    return !needs.length;
  }

  async function asyncCheckRepair() {
    if (!g('option').repair) {
      return true;
    }
    logSwitchAsyncTask(arguments);
    const doc = $doc(await $ajax.fetch('?s=Forge&ss=re'));
    const json = JSON.parse((await $ajax.fetch(gE('#mainpane>script[src]', doc).src)).match(/{.*}/)[0]);
    const eqps = (await Promise.all(Array.from(gE('.eqp>[id]', 'all', doc)).map(async eqp => {
      const id = eqp.id.match(/\d+/)[0];
      const condition = 1 * json[id].d.match(/Condition: \d+ \/ \d+ \((\d+)%\)/)[1];
      if (condition > g('option').repairValue) {
        return;
      }
      return gE('.messagebox_error', $doc(await $ajax.fetch(`?s=Forge&ss=re`, `select_item=${id}`)))?.innerText ? undefined : id;
    }))).filter(e => e);
    if (eqps.length) {
      console.log('eqps need repair: ', eqps);
    }
    logSwitchAsyncTask(arguments);
    return !eqps.length;
  }

  function checkStamina(low, cost) {
    let stamina = getValue('stamina');
    const lastTime = getValue('staminaTime');
    let timeNow = Math.floor(time(0) / _1h);
    stamina += lastTime ? timeNow - lastTime : 0;
    const stmNR = stamina + 24 - (timeNow % 24);
    cost ??= 0;
    const stmNRChecked = !cost || stmNR - cost >= g('option').staminaLowWithReNat;
    console.log('stamina with nature recover:', stmNR, '\nnext arena stamina cost: ', cost.toString());
    if (stamina - cost >= (low ?? g('option').staminaLow) && stmNRChecked) {
      return 1;
    }
    let checked = 0;
    if (!stmNRChecked) {
      checked = -1;
    }
    if (isIsekai || !g('option').restoreStamina) {
      return checked;
    }
    const items = g('items');
    if (!items) {
      return checked;
    }
    const recover = items[11402] ? 5 : items[11401] ? getValue('staminaHathperk') ? 20 : 10 : 0;
    if (recover && stamina <= (100 - recover)) {
      $ajax.fetch(window.location.href, 'recover=stamina').then(goto);
      // post(window.location.href, goto, 'recover=stamina');
      return checked;
    }
  }

  async function updateEncounter(engage, isInBattle) {
    const encounter = getEncounter();
    const encountered = encounter.filter(e => e.encountered && e.href);
    const count = encounter.filter(e => e.href).length;

    const now = time(0);
    const last = encounter[0]?.time ?? getValue('lastEH', true) ?? 0; // 上次遭遇 或 上次打开EH 或 0
    let cd;
    if (encountered.length >= 24) {
      cd = Math.floor(encounter[0].time / _1d + 1) * _1d - now;
    } else if (!last) {
      cd = 0;
    } else {
      cd = _1h / 2 + last - now;
    }
    cd = Math.max(0, cd);
    const ui = gE('.encounterUI') ?? (() => {
      const ui = gE('body').appendChild(cE('a'));
      ui.className = 'encounterUI';
      ui.title = `${time(3, last)}\nEncounter Time: ${count}`;
      if (!isInBattle) {
        ui.href = 'https://e-hentai.org/news.php?encounter';
      }
      return ui;
    })();

    const missed = count - encountered.length;
    if (count === 24) {
      ui.style.cssText += 'color:orange!important;';
    } else if (!cd) {
      ui.style.cssText += 'color:red!important;';
    } else {
      ui.style.cssText += 'color:unset!important;';
    }
    ui.innerHTML = `${formatTime(cd).slice(0, 2).map(cdi => cdi.toString().padStart(2, '0')).join(`:`)}[${encounter.length ? (count >= 24 ? `☯` : count) : `✪`}${missed ? `-${missed}` : ``}]`;
    if (!cd && engage) {
      onEncounter();
      return true;
    }
    let interval = cd > _1h ? _1m : (!g('option').encounterQuickCheck || cd > _1m) ? _1s : 100;
    interval = (g('option').encounterQuickCheck && cd > _1m) ? (interval - cd % interval) / 4 : interval; // 让倒计时显示更平滑
    setTimeout(() => updateEncounter(engage), interval);
  }

  function onEncounter() {
    if (getValue('disabled') || getValue('battle') || !checkBattleReady(onEncounter, { staminaLow: g('option').staminaEncounter })) {
      return;
    }
    setEncounter(getEncounter()); // 离开页面前保存
    setValue('lastHref', window.location.href);
    openUrl('https://e-hentai.org/news.php?encounter');
  }

  async function startUpdateArena(idleStart) {
    const now = time(0);
    console.log('startUpdateArena now', now, idleStart);
    if (!idleStart) {
      await updateArena();
    }
    let timeout = g('option').idleArenaTime * _1s;
    console.log('startUpdateArena timeout', timeout);
    if (idleStart) {
      timeout -= time(0) - idleStart;
    }
    setTimeout(idleArena, timeout);
    const last = getValue('arena', true)?.date ?? now;
    setTimeout(startUpdateArena, Math.max(0, Math.floor(last / _1d + 1) * _1d - now));
  }

  async function updateArena(forceUpdateToken = false) {
    let arena = getValue('arena', true) ?? {};
    if (!forceUpdateToken && arena && arena.date && time(2, arena.date) === time(2)) {
      return setValue('arena', arena);
    }
    arena.token = {};
    arena.sites ??= [
      '?s=Battle&ss=gr',
      '?s=Battle&ss=ar',
      '?s=Battle&ss=ar&page=2',
      '?s=Battle&ss=rb'
    ]
    await Promise.all(arena.sites.map(async site => {
      const doc = $doc(await $ajax.fetch(site));
      if (site === '?s=Battle&ss=gr') {
        arena.token.gr = gE('img[src*="startgrindfest.png"]', doc).getAttribute('onclick').match(/init_battle\(1, '(.*?)'\)/)[1];
        return;
      }
      gE('img[src*="startchallenge.png"]', 'all', doc).forEach((_) => {
        const temp = _.getAttribute('onclick').match(/init_battle\((\d+),\d+,'(.*?)'\)/);
        arena.token[temp[1]] = temp[2];
      });
    }));
    if (forceUpdateToken) {
      return setValue('arena', arena);
    }
    arena.date = time(0);
    arena.gr = g('option').idleArenaGrTime;
    arena.array = g('option').idleArenaValue.split(',') ?? [];
    arena.array.reverse();
    return setValue('arena', arena);
  }

  function checkBattleReady(method, condition = {}) {
    if (getValue('disabled')) {
      setTimeout(method, 1000);
      return;
    }
    if (condition.checkEncounter && getEncounter()[0]?.href && !getEncounter()[0]?.encountered) {
      Debug.log(getEncounter());
      return;
    }
    const staminaChecked = checkStamina(condition.staminaLow, condition.staminaCost);
    if (staminaChecked) { // 1: succeed, -1: failed with nature recover
      return staminaChecked === 1;
    }
    setTimeout(method, Math.floor(time(0) / _1h + 1) * _1h - time(0));
  }

  async function idleArena() { // 闲置竞技场
    let arena = getValue('arena', true);
    console.log('arena:', getValue('arena', true));
    if (arena.array.length === 0) {
      setTimeout(autoSwitchIsekai, (g('option').isekaiTime * (Math.random() * 20 + 90) / 100) * _1s);
      return;
    }
    logSwitchAsyncTask(arguments);
    let id;
    const RBundone = [];
    while (arena.array.length > 0) {
      id = arena.array.pop() * 1;
      id = isNaN(id) ? 'gr' : id;
      if (id in arena.token) {
        break;
      }
      if (id >= 105) {
        arena.token = (await updateArena(true)).token;
        if (id in arena.token) {
          break;
        }
        RBundone.unshift(id);
      }
      id = undefined;
    }
    arena.array = arena.array.concat(RBundone);
    if (!id) {
      setValue('arena', arena);
      logSwitchAsyncTask(arguments);
      return;
    }

    let staminaCost = {
      1: 2, 3: 4, 5: 6, 8: 8, 9: 10,
      11: 12, 12: 15, 13: 20, 15: 25, 16: 30,
      17: 35, 19: 40, 20: 45, 21: 50, 23: 55,
      24: 60, 26: 65, 27: 70, 28: 75, 29: 80,
      32: 85, 33: 90, 34: 95, 35: 100,
      105: 1, 106: 1, 107: 1, 108: 1, 109: 1, 110: 1, 111: 1, 112: 1,
      gr: arena.gr
    }
    let stamina = getValue('stamina');
    const lastTime = getValue('staminaTime');
    let timeNow = Math.floor(time(0) / 1000 / 60 / 60);
    stamina += lastTime ? timeNow - lastTime : 0;
    for (let key in staminaCost) {
      staminaCost[key] *= (isIsekai ? 2 : 1) * (stamina >= 60 ? 0.03 : 0.02)
    }
    staminaCost.gr += 1

    let href, cost;
    if (id === 'gr') {
      if (arena.gr <= 0) {
        setValue('arena', arena);
        idleArena();
        return;
      }
      arena.gr--;
      href = 'gr';
      id = 1;
      cost = staminaCost.gr;
    } else if (id >= 105) {
      href = 'rb';
    } else if (id >= 19) {
      href = 'ar&page=2';
    } else {
      href = 'ar';
    }
    cost ??= staminaCost[id];
    if (!checkBattleReady(idleArena, { staminaCost: cost, checkEncounter: true })) {
      logSwitchAsyncTask(arguments);
      return;
    }
    document.title = _alert(-1, '闲置竞技场开始', '閒置競技場開始', 'Idle Arena start');
    setValue('arena', arena);
    $ajax.fetch(`?s=Battle&ss=${href}`, `initid=${String(id)}&inittoken=${arena.token[id]}`).then(goto);

    // post(`?s=Battle&ss=${href}`, goto, `initid=${String(id)}&inittoken=${arena.token[id]}`);
    logSwitchAsyncTask(arguments);
  }

  // 战斗中//
  function onBattle() { // 主程序
    let battle = getValue('battle', true);
    if (!battle || !battle.roundAll) { // 修复因多个页面/世界同时读写造成缓存数据异常的情况
      battle = JSON.parse(JSON.stringify(g('battle')));
      battle.monsterStatus = battle.monsterStatus.map(ms => {
        return {
          order: ms.order,
          hp: ms.hp
        }
      })
      battle.monsterStatus.sort(objArrSort('order'));
    };
    Debug.log('onBattle', `\n`, JSON.stringify(battle, null, 4));

    //人物状态
    if (gE('#vbh')) {
      g('hp', gE('#vbh>div>img').offsetWidth / 500 * 100);
      g('mp', gE('#vbm>div>img').offsetWidth / 210 * 100);
      g('sp', gE('#vbs>div>img').offsetWidth / 210 * 100);
      g('oc', gE('#vcp>div>div') ? (gE('#vcp>div>div', 'all').length - gE('#vcp>div>div#vcr', 'all').length) * 25 : 0);
    } else {
      g('hp', gE('#dvbh>div>img').offsetWidth / 418 * 100);
      g('mp', gE('#dvbm>div>img').offsetWidth / 418 * 100);
      g('sp', gE('#dvbs>div>img').offsetWidth / 418 * 100);
      g('oc', gE('#dvrc').childNodes[0].textContent * 1);
    }

    // 战斗战况
    if (!gE('.hvAALog')) {
      const div = gE('#hvAABox2').appendChild(cE('div'));
      div.className = 'hvAALog';
    }
    const status = [
      '<l0>物理</l0><l1>物理</l1><l2>Physical</l2>',
      '<l0>火</l0><l1>火</l1><l2>Fire</l2>',
      '<l0>冰</l0><l1>冰</l1><l2>Cold</l2>',
      '<l0>雷</l0><l1>雷</l1><l2>Elec</l2>',
      '<l0>风</l0><l1>風</l1><l2>Wind</l2>',
      '<l0>圣</l0><l1>聖</l1><l2>Divine</l2>',
      '<l0>暗</l0><l1>暗</l1><l2>Forbidden</l2>',
    ];
    function getBattleTypeDisplay(isTitle) {
      const battleInfoList = {
        'gr': {
          name: ['压榨', '壓榨', 'Grindfest'],
          title: 'GF',
        },
        'iw': {
          name: ['道具', '道具', 'Item World'],
          title: 'IW',
        },
        'ar': {
          name: ['竞技', '競技', 'Arena'],
          title: 'AR',
          list: [
            ['第一滴血', '第一滴血', 'First Blood', 1, 2],
            ['经验曲线', '經驗曲綫', 'Learning Curves', 10, 4],
            ['毕业典礼', '畢業典禮', 'Graduation', 20, 6],
            ['荒凉之路', '荒涼之路', 'Road Less Traveled', 30, 8],
            ['浪迹天涯', '浪跡天涯', 'A Rolling Stone', 40, 10],
            ['鲜肉一族', '鮮肉一族', 'Fresh Meat', 50, 12],
            ['乌云密布', '烏雲密佈', 'Dark Skies', 60, 15],
            ['风暴成形', '風暴成形', 'Growing Storm', 70, 20],
            ['力量流失', '力量流失', 'Power Flux', 80, 25],
            ['杀戮地带', '殺戮地帶', 'Killzone', 90, 30],
            ['最终阶段', '最終階段', 'Endgame', 100, 35],
            ['无尽旅程', '無盡旅程', 'Longest Journey', 110, 40],
            ['梦陨之时', '夢隕之時', 'Dreamfall', 120, 45],
            ['流亡之途', '流亡之途', 'Exile', 130, 50],
            ['封印之力', '封印之力', 'Sealed Power', 140, 55],
            ['崭新之翼', '嶄新之翼', 'New Wings', 150, 60],
            ['弑神之路', '弑神之路', 'To Kill a God', 165, 65],
            ['死亡前夜', '死亡前夜', 'Eve of Death', 180, 70],
            ['命运三女神与树', '命運三女神與樹', 'The Trio and the Tree', 200, 75],
            ['世界末日', '世界末日', 'End of Days', 225, 80],
            ['永恒黑暗', '永恆黑暗', 'Eternal Darkness', 250, 85],
            ['与龙共舞', '與龍之舞', 'A Dance with Dragons', 300, 90],
            ['额外游戏内容', '額外游戲内容', 'Post Game Content', 400, 95],
            ['神秘小马领域', '神秘小馬領域', 'Secret Pony Level', 500, 100],
          ],
          condition: (bt) => bt[4] === battle.roundAll,
          content: (bt) => bt[3],
        },
        'rb': {
          name: ['浴血', '浴血', 'Ring of Blood'],
          title: 'RB',
          list: [
            ['九死一树', '九死一樹', 'Triple Trio and the Tree', 250, 'Yggdrasil'],
            ['飞天意面怪', '飛行義大利麵怪物', 'Flying Spaghetti Monster', 200],
            ['隐形粉红独角兽', '隱形粉紅獨角獸', 'Invisible Pink Unicorn', 150],
            ['现实生活', '現實生活', 'Real Life', 100],
            ['长门有希', '長門有希', 'Yuki Nagato', 75],
            ['朝仓凉子', '朝倉涼子', 'Ryouko Asakura', 75],
            ['朝比奈实玖瑠', '朝比奈實玖瑠', 'Mikuru Asahina', 75],
            ['泉此方', '泉此方', 'Konata', 75],
          ],
          condition: (bt) => monsterNames.indexOf(bt[4] ?? bt[2]) !== -1,
          content: (bt) => bt[3],
        },
        'ba': {
          name: ['遭遇', '遭遇', 'Random Encounter'],
          title: 'BA',
          content: (_) => getEncounter().filter(e => e.encountered).length,
        },
        'tw': {
          name: ['塔楼', '塔樓', 'The Tower'],
          title: 'TW',
          list: [
            ['PFUDOR×20', 'PFUDOR×20', 'PFUDOR×20', 40],
            ['IWBTH×15', 'IWBTH×15', 'IWBTH×15', 34],
            ['任天堂×10', '任天堂×10', 'Nintendo×10', 27],
            ['地狱×7', '地獄×7', 'Hell×7', 20],
            ['噩梦×4', '噩夢×4', 'Nightmare×4', 14],
            ['困难×2', '困難×2', 'Hard×2', 7],
            ['普通×1', '普通×1', 'Normal×1', 1],
          ],
          condition: (bt) => bt[3] && bt[3] <= battle.tower,
          content: (_) => battle.tower,
          end: battle.tower > 40 ? `+${(battle.tower - 40) * 5}%DMG&HP` : '',
        }
      }
      const type = battle.roundType;
      let subtype, title;
      const monsterNames = Array.from(gE('div.btm3>div>div', 'all')).map(monster => monster.innerHTML);
      const lang = g('lang') * 1;
      const info = battleInfoList[type];
      switch (type) {
        case 'ar':
        case 'rb':
        case 'tw':
        case 'ba':
          for (let sub of (info.list ?? [[]])) {
            if (info.condition && !info.condition(sub)) {
              continue;
            }
            title = `${info.title}${info.content(sub)}`;
            if (!sub[lang]) {
              break;
            }
            subtype = `${sub[lang] ? `<br>${sub[lang]}` : ``}${info.end ? `<br>${info.end}` : ``}`;
            break;
          }
          break;
        case 'iw':
        case 'gr':
          title = `${info.title}`;
          break;
        default:
          break;
      }
      return isTitle ? title : `${(info?.name ?? ['未知', '未知', 'Unknown'])[lang]}:[${title}]${subtype ?? ''}`;
    }

    const currentTurn = (battle.turn ?? 0) + 1;

    gE('.hvAALog').innerHTML = [
      `<l0>攻击模式</l0><l1>攻擊模式</l1><l2>Attack Mode</l2>: ${status[g('attackStatus')]}`,
      `${isIsekai ? '<l0>异世界</l0><l1>異世界</l1><l2>Isekai</l2>' : '<l0>恒定世界</l0><l1>恆定世界</l1><l2>Persistent</l2>'}`, // 战役模式显示
      `${getBattleTypeDisplay()}`, // 战役模式显示
      `R${battle.roundNow}/${battle.roundAll}:T${currentTurn}`,
      `TPS: ${g('runSpeed')}`,
      `<l0>敌人</l0><l1>敌人</l1><l2>Monsters</l2>: ${g('monsterAlive')}/${g('monsterAll')}`,
    ].join(`<br>`);
    if (!battle.roundAll) {
      pauseChange();
      Debug.shiftLog();
    }
    document.title = `${getBattleTypeDisplay(true)}:R${battle.roundNow}/${battle.roundAll}:T${currentTurn}@${g('runSpeed')}tps,${g('monsterAlive')}/${g('monsterAll')}`;
    setValue('battle', battle);
    if (!battle.monsterStatus || battle.monsterStatus.length !== g('monsterAll')) {
      fixMonsterStatus();
    }
    countMonsterHP();
    displayMonsterWeight();
    displayPlayStatePercentage();

    if (getValue('disabled')) { // 如果禁用
      document.title = _alert(-1, 'hvAutoAttack暂停中', 'hvAutoAttack暫停中', 'hvAutoAttack Paused');
      gE('#hvAABox2>button').innerHTML = '<l0>继续</l0><l1>繼續</l1><l2>Continue</l2>';
      return;
    }
    battle = getValue('battle', true);
    g('battle').turn = currentTurn;
    battle.turn = currentTurn;
    setValue('battle', battle);

    killBug(); // 解决 HentaiVerse 可能出现的 bug
    if (g('option').autoFlee && checkCondition(g('option').fleeCondition)) {
      gE('1001').click();
      setTimeout(() => {
        window.location.href = getValue('lastHref');
      }, 3 * _1s);
      return;
    }
    var taskList = [autoRecover, autoPause, autoSS, autoDefend, useScroll, useChannelSkill, useBuffSkill, useInfusions, useDeSkill, autoFocus, autoSkill, attack];
    for (let i in taskList) {
      if (taskList[i]()) {
        return;
      }
    }
  }

  function getMonsterID(s) {
    if (s.order !== undefined) {
      return (s.order + 1) % 10;
    } // case is monsterStatus
    return (s + 1) % 10; // case is order
  }

  /**
       * 按照技能范围，获取包含原目标且范围内最终权重(finweight)之和最低的范围的中心目标
       * @param {int} id id from g('battle').monsterStatus.sort(objArrSort('finWeight'));
       * @param {int} range radius, 0 for single-target and all-targets, 1 for treble-targets, ..., n for (2n+1) targets
       * @param {(target) => bool} excludeCondition target with id
       * @returns
       */
  function getRangeCenterID(target, range = undefined, isWeaponAttack = false, excludeCondition = undefined) {
    if (!range) {
      return getMonsterID(target);
    }
    const centralExtraWeight = -1 * Math.log10(1 + (isWeaponAttack ? (g('option').centralExtraRatio / 100) ?? 0 : 0));
    let order = target.order;
    let newOrder = order;
    // sort by order to fix id
    let msTemp = JSON.parse(JSON.stringify(g('battle').monsterStatus));
    msTemp.sort(objArrSort('order'));
    let unreachableWeight = g('option').unreachableWeight;
    // TODO 未命中的权重优化
    let minRank;
    for (let i = order - range; i <= order + range; i++) {
      if (i < 0 || i >= msTemp.length || msTemp[i].isDead) {
        continue; // 无法选中
      }
      let rank = 0;
      for (let j = i - range; j <= (i + range); j++) {
        let cew = j === i ? centralExtraWeight : 0; // cew <= 0, 增加未命中权重，降低命中权重
        let mon = msTemp[j];
        if (j < 0 || j >= msTemp.length // 超出范围
          || mon.isDead // 死亡目标
          || (excludeCondition && excludeCondition(mon))) { // 特殊排除判定
          rank += unreachableWeight - cew;
          continue;
        }
        rank += mon.finWeight + cew; // 中心目标会受到副手及冲击攻击时，相当于有效生命值降低
      }
      if (rank < minRank) {
        newOrder = i;
      }
    }
    return getMonsterID(newOrder);
  }

  function autoPause() {
    if (g('option').autoPause && checkCondition(g('option').pauseCondition)) {
      pauseChange();
      return true;
    }
    return false;
  }

  function autoDefend() {
    if (g('option').defend && checkCondition(g('option').defendCondition)) {
      gE('#ckey_defend').click();
      return true;
    }
    return false;
  }

  function pauseChange() { // 暂停状态更改
    if (getValue('disabled')) {
      if (gE('.pauseChange')) {
        gE('.pauseChange').innerHTML = '<l0>暂停</l0><l1>暫停</l1><l2>Pause</l2>';
      }
      delValue(0);
      if (!gE('#navbar')) { // in battle
        onBattle();
      }
    } else {
      if (gE('.pauseChange')) {
        gE('.pauseChange').innerHTML = '<l0>继续</l0><l1>繼續</l1><l2>Continue</l2>';
      }
      setValue('disabled', true);
      document.title = _alert(-1, 'hvAutoAttack暂停中', 'hvAutoAttack暫停中', 'hvAutoAttack Paused');
    }
  }

  function reloader() {
    let delayAlert; let delayReload; let obj; let a; let
      cost;
    const eventStart = cE('a');
    eventStart.id = 'eventStart';
    eventStart.onclick = function () {
      a = unsafeWindow.info;
      if (g('option').delayAlert) {
        delayAlert = setTimeout(setAlarm, g('option').delayAlertTime * _1s);
      }
      if (g('option').delayReload) {
        delayReload = setTimeout(goto, g('option').delayReloadTime * _1s);
      }
      if (g('option').recordUsage) {
        obj = {
          mode: a.mode,
        };
        if (a.mode === 'items') {
          obj.item = gE(`#pane_item div[id^="ikey"][onclick*="skill('${a.skill}')"]`).textContent;
        } else if (a.mode === 'magic') {
          obj.magic = gE(a.skill).textContent;
          cost = gE(a.skill).getAttribute('onmouseover').match(/\('.*', '.*', '.*', (\d+), (\d+), \d+\)/);
          obj.mp = cost[1] * 1;
          obj.oc = cost[2] * 1;
        }
      }
    };
    gE('body').appendChild(eventStart);
    const eventEnd = cE('a');
    eventEnd.id = 'eventEnd';
    eventEnd.onclick = function () {
      const timeNow = time(0);
      g('runSpeed', (1000 / (timeNow - g('timeNow'))).toFixed(2));
      g('timeNow', timeNow);
      if (g('option').delayAlert) {
        clearTimeout(delayAlert);
      }
      if (g('option').delayReload) {
        clearTimeout(delayReload);
      }
      const monsterDead = gE('img[src*="nbardead"]', 'all').length;
      g('monsterAlive', g('monsterAll') - monsterDead);
      const bossDead = gE('div.btm1[style*="opacity"] div.btm2[style*="background"]', 'all').length;
      g('bossAlive', g('bossAll') - bossDead);
      const battleLog = gE('#textlog>tbody>tr>td', 'all');
      if (g('option').recordUsage) {
        obj.log = battleLog;
        recordUsage(obj);
      }
      if (gE('#btcp') || g('monsterAlive')===0) {
        if (g('option').dropMonitor) {
          dropMonitor(battleLog);
        }
        if (g('option').recordUsage) {
          recordUsage2();
        }
        if (g('monsterAlive') > 0) { // Defeat
          setAlarm('Defeat');
          delValue(1);
        } else  if (g('battle').roundNow === g('battle').roundAll) { // Victory
          setAlarm('Victory');
          delValue(1);
          setTimeout(() => {
            window.location.href = getValue('lastHref');
          }, 3 * _1s);
        } else if (g('battle').roundNow !== g('battle').roundAll) { // Next Round
          gE('#pane_completion').removeChild(gE('#btcp'));
          $ajax.fetch(window.location.href).then((html) => {
            const doc = $doc(html)
            if (gE('#riddlecounter', doc)) {
              if (g('option').riddlePopup && !window.opener) {
                window.open(window.location.href, 'riddleWindow', 'resizable,scrollbars,width=1241,height=707');
                return;
              }
              goto();
              return;
            }
            // if(gE('#battle_right', doc)) {
              gE('#battle_main').replaceChild(gE('#battle_right', doc), gE('#battle_right'));
            // }
            // if(gE('#battle_left', doc)) {
              gE('#battle_main').replaceChild(gE('#battle_left', doc), gE('#battle_left'));
            // }
            unsafeWindow.battle = new unsafeWindow.Battle();
            unsafeWindow.battle.clear_infopane();
            Debug.log('______________newRound', true);
            newRound(true);
            onBattle();
          });
        }
      } else {
        onBattle();
      }
    };
    gE('body').appendChild(eventEnd);
    window.sessionStorage.delay = g('option').delay;
    window.sessionStorage.delay2 = g('option').delay2;
    const fakeApiCall = cE('script');
    fakeApiCall.textContent = `api_call = ${function (b, a, d) {
      const delay = window.sessionStorage.delay * 1;
      const delay2 = window.sessionStorage.delay2 * 1;
      window.info = a;
      if(window.location.href.startsWith('https://')) {
        b.open('POST', `${MAIN_URL.replace(/^http:\/\//, 'https://')}json`);
      }
      else {
        b.open('POST', `${MAIN_URL}json`);
      }
      b.setRequestHeader('Content-Type', 'application/json');
      b.withCredentials = true;
      b.onreadystatechange = d;
      b.onload = function () {
        document.getElementById('eventEnd').click();
      };
      document.getElementById('eventStart').click();
      if (a.mode === 'magic' && a.skill >= 200) {
        if (delay <= 0) {
          b.send(JSON.stringify(a));
        } else {
          setTimeout(() => {
            b.send(JSON.stringify(a));
          }, delay * (Math.random() * 50 + 50) / 100);
        }
      } else if (delay2 <= 0) {
        b.send(JSON.stringify(a));
      } else {
        setTimeout(() => {
          b.send(JSON.stringify(a));
        }, delay2 * (Math.random() * 50 + 50) / 100);
      }
    }.toString()}`;
    gE('head').appendChild(fakeApiCall);
    const fakeApiResponse = cE('script');
    fakeApiResponse.textContent = `api_response = ${function (b) {
      if (b.readyState === 4) {
        if (b.status === 200) {
          const a = JSON.parse(b.responseText);
          if (a.login !== undefined) {
            top.window.location.href = login_url;
          } else {
            if (a.error || a.reload) {
              window.location.href = window.location.search;
            }
            return a;
          }
        } else {
          window.location.href = window.location.search;
        }
      }
      return false;
    }.toString()}`;
    gE('head').appendChild(fakeApiResponse);
  }

  function newRound(isNew) { // New Round
    let battle = isNew ? {} : getValue('battle', true);
    if (!battle) {
      battle = JSON.parse(JSON.stringify(g('battle') ?? {}));
      battle.monsterStatus?.sort(objArrSort('order'));
    };
    setValue('battle', battle);
    if (window.location.hash !== '') {
      goto();
    }
    g('monsterAll', gE('div.btm1', 'all').length);
    const monsterDead = gE('img[src*="nbardead"]', 'all').length;
    g('monsterAlive', g('monsterAll') - monsterDead);
    g('bossAll', gE('div.btm2[style^="background"]', 'all').length);
    const bossDead = gE('div.btm1[style*="opacity"] div.btm2[style*="background"]', 'all').length;
    g('bossAlive', g('bossAll') - bossDead);
    const battleLog = gE('#textlog>tbody>tr>td', 'all');
    if (!battle.roundType) {
      const temp = battleLog[battleLog.length - 1].textContent;
      const types = {
        'ar': {
          reg: /^Initializing arena challenge/,
          extra: (i) => i <= 35,
        },
        'rb': {
          reg: /^Initializing arena challenge/,
          extra: (i) => i >= 105,
        },
        'iw': { reg: /^Initializing Item World/ },
        'gr': { reg: /^Initializing Grindfest/ },
        'tw': { reg: /^Initializing The Tower/ },
        'ba': {
          reg: /^Initializing random encounter/,
          extra: (_) => {
            const encounter = getEncounter();
            if (encounter[0].time >= time(0) - 0.5 * _1h) {
              encounter[0].encountered = time(0);
              setEncounter(encounter);
            }
            return true;
          }
        },
      }
      battle.tower = (temp.match(/\(Floor (\d+)\)/) ?? [null])[1] * 1;
      const id = (temp.match(/\d+/) ?? [null])[0] * 1;
      battle.roundType = undefined;
      for (let name in types) {
        const type = types[name];
        if (!temp.match(type.reg)) {
          continue;
        }
        if (type.extra && !type.extra(id)) {
          continue;
        }
        battle.roundType = name;
        break;
      }
    }
    if (/You lose \d+ Stamina/.test(battleLog[0].textContent)) {
      const staminaLostLog = getValue('staminaLostLog', true) || {};
      staminaLostLog[time(3)] = battleLog[0].textContent.match(/You lose (\d+) Stamina/)[1] * 1;
      setValue('staminaLostLog', staminaLostLog);
      const losedStamina = battleLog[0].textContent.match(/\d+/)[0] * 1;
      if (losedStamina >= g('option').staminaLose) {
        setAlarm('Error');
        if (!_alert(1, '当前Stamina过低\n或Stamina损失过多\n是否继续？', '當前Stamina過低\n或Stamina損失過多\n是否繼續？', 'Continue?\nYou either have too little Stamina or have lost too much')) {
          pauseChange();
          return;
        }
      }
    }

    const roundPrev = battle.roundNow;

    if (battleLog[battleLog.length - 1].textContent.match('Initializing')) {
      const monsterStatus = [];
      let order = 0;
      const monsterNames = Array.from(gE('div.btm3>div>div', 'all')).map(monster => monster.innerText);
      const monsterLvs = Array.from(gE('div.btm2>div>div', 'all')).map(monster => monster.innerText);
      const monsterDB = getValue('monsterDB', true) ?? {};
      const monsterMID = getValue('monsterMID', true) ?? {};
      const oldDB = JSON.stringify(monsterDB);
      const oldMID = JSON.stringify(monsterMID);
      for (let i = battleLog.length - 2; i > battleLog.length - 2 - g('monsterAll'); i--) {
        let mid = battleLog[i].textContent.match(/MID=(\d+)/)[1] * 1;
        let name = battleLog[i].textContent.match(/MID=(\d+) \((.*)\) LV/)[2];
        let lv = battleLog[i].textContent.match(/LV=(\d+)/)[1] * 1;
        let hp = battleLog[i].textContent.match(/HP=(\d+)$/)[1] * 1;
        if (isNaN(hp)) {
          hp = getHPFromMonsterDB(monsterDB, monsterNames[order], monsterLvs[order]) ?? monsterStatus[monsterStatus.length - 1].hp;
        }
        if (name && lv && mid) {
          monsterDB[name] ??= {};
          if (monsterDB[name].mid && monsterDB[name].mid !== mid) { // 名称被其他mid被占用
            monsterMID[monsterDB[name].mid] = JSON.parse(JSON.stringify(monsterDB[name])); // 将之前mid的数据进行另外备份
            monsterDB[name] = {}; // 重置该名称的数据
          }
          if (monsterMID[mid]) {
            monsterDB[name] = JSON.parse(JSON.stringify(monsterMID[mid])); // 将之前备份的mid的数据进行恢复
            delete monsterMID[mid];
          }
          monsterDB[name].mid = mid;
          monsterDB[name][lv] = hp;
        }
        monsterStatus[order] = {
          order: order,
          hp,
        };
        order++;
      }
      if (oldDB !== JSON.stringify(monsterDB)) {
        setValue('monsterDB', monsterDB);
      }
      if (oldMID !== JSON.stringify(monsterMID)) {
        setValue('monsterMID', monsterMID);
      }
      battle.monsterStatus = monsterStatus;

      const round = battleLog[battleLog.length - 1].textContent.match(/\(Round (\d+) \/ (\d+)\)/);
      if (round && battle.roundType !== 'ba') {
        battle.roundNow = round[1] * 1;
        battle.roundAll = round[2] * 1;
      } else {
        battle.roundNow = 1;
        battle.roundAll = 1;
      }
    } else if (!battle.monsterStatus || battle.monsterStatus.length !== gE('div.btm2', 'all').length) {
      battle.roundNow = 1;
      battle.roundAll = 1;
    }

    if(roundPrev !== battle.roundNow) {
      battle.turn = 0;
    }
    setValue('battle', battle);

    g('roundLeft', battle.roundAll - battle.roundNow);
    g('skillOTOS', {
      OFC: 0,
      FRD: 0,
      T3: 0,
      T2: 0,
      T1: 0,
    });
  }

  function killBug() { // 在 HentaiVerse 发生导致 turn 损失的 bug 时发出警告并移除问题元素: https://ehwiki.org/wiki/HentaiVerse_Bugs_%26_Errors#Combat
    const bugLog = gE('#textlog > tbody > tr > td[class="tlb"]', 'all');
    const isBug = /(Slot is currently not usable)|(Item does not exist)|(Inventory slot is empty)|(You do not have a powerup gem)/;
    for (let i = 0; i < bugLog.length; i++) {
      if (bugLog[i].textContent.match(isBug)) {
        bugLog[i].className = 'tlbWARN';
        setTimeout(() => { // 间隔时间以避免持续刷新
          window.location.href = window.location;// 刷新移除问题元素
        }, 700);
      } else {
        bugLog[i].className = 'tlbQRA';
      }
    }
  }

  function countMonsterHP() { // 统计敌人血量
    let i, j;
    const monsterHp = gE('div.btm4>div.btm5:nth-child(1)', 'all');
    let battle = getValue('battle', true);
    const monsterStatus = battle.monsterStatus;
    const hpArray = [];
    for (i = 0; i < monsterHp.length; i++) {
      if (gE('img[src*="nbardead.png"]', monsterHp[i])) {
        monsterStatus[i].isDead = true;
        monsterStatus[i].hpNow = Infinity;
      } else {
        monsterStatus[i].isDead = false;
        monsterStatus[i].hpNow = Math.floor(monsterStatus[i].hp * parseFloat(gE('img', monsterHp[i]).style.width) / 120 + 1);
        hpArray.push(monsterStatus[i].hpNow);
      }
    }
    battle.monsterStatus = monsterStatus;

    const skillLib = {
      Sle: {
        name: 'Sleep',
        img: 'sleep',
      },
      Bl: {
        name: 'Blind',
        img: 'blind',
      },
      Slo: {
        name: 'Slow',
        img: 'slow',
      },
      Im: {
        name: 'Imperil',
        img: 'imperil',
      },
      MN: {
        name: 'MagNet',
        img: 'magnet',
      },
      Si: {
        name: 'Silence',
        img: 'silence',
      },
      Dr: {
        name: 'Drain',
        img: 'drainhp',
      },
      We: {
        name: 'Weaken',
        img: 'weaken',
      },
      Co: {
        name: 'Confuse',
        img: 'confuse',
      },
      CM: {
        name: 'Coalesced Mana',
        img: 'coalescemana',
      },
      Stun: {
        name: 'Stunned',
        img: 'wpn_stun',
      },
      PA: {
        name: 'Penetrated Armor',
        img: 'wpn_ap',
      },
      BW: {
        name: 'Bleeding Wound',
        img: 'wpn_bleed',
      },
    };
    const monsterBuff = gE('div.btm6', 'all');
    const hpMin = Math.min.apply(null, hpArray);
    const yggdrasilExtraWeight = g('option').YggdrasilExtraWeight;
    const unreachableWeight = g('option').unreachableWeight;
    const baseHpRatio = g('option').baseHpRatio ?? 1;
    // 权重越小，优先级越高
    for (i = 0; i < monsterStatus.length; i++) { // 死亡的排在最后（优先级最低）
      if (monsterStatus[i].isDead) {
        monsterStatus[i].finWeight = unreachableWeight;
        continue;
      }
      let weight = baseHpRatio * Math.log10(monsterStatus[i].hpNow / hpMin); // > 0 生命越低权重越低优先级越高
      monsterStatus[i].hpWeight = weight;
      if (yggdrasilExtraWeight && ('Yggdrasil' === gE('div.btm3>div>div', monsterBuff[i].parentNode).innerText || '世界树 Yggdrasil' === gE('div.btm3>div>div', monsterBuff[i].parentNode).innerText)) { // 默认设置下，任何情况都优先击杀群体大量回血的boss"Yggdrasil"
        weight += yggdrasilExtraWeight; // defalut -1000
      }
      for (j in skillLib) {
        if (gE(`img[src*="${skillLib[j].img}"]`, monsterBuff[i])) {
          weight += g('option').weight[j];
        }
      }
      monsterStatus[i].finWeight = weight;
    }
    monsterStatus.sort(objArrSort('finWeight'));
    battle.monsterStatus = monsterStatus;
    g('battle', battle);
  }

  function autoRecover() { // 自动回血回魔
    if (!g('option').item) {
      return false;
    }
    if (!g('option').itemOrderValue) {
      return false;
    }
    const name = g('option').itemOrderName.split(',');
    const order = g('option').itemOrderValue.split(',');
    for (let i = 0; i < name.length; i++) {
      if (g('option').item[name[i]] && checkCondition(g('option')[`item${name[i]}Condition`]) && isOn(order[i])) {
        isOn(order[i]).click();
        return true;
      }
    }
    return false;
  }

  function useScroll() { // 自动使用卷轴
    if (!g('option').scrollSwitch) {
      return false;
    }
    if (!g('option').scroll) {
      return false;
    }
    if (!checkCondition(g('option').scrollCondition)) {
      return false;
    }
    if (!g('option').scrollRoundType) {
      return false;
    }
    if (!g('option').scrollRoundType[g('battle').roundType]) {
      return false;
    }
    const scrollLib = {
      Go: {
        name: 'Scroll of the Gods',
        id: 13299,
        mult: '3',
        img1: 'absorb',
        img2: 'shadowveil',
        img3: 'sparklife',
      },
      Av: {
        name: 'Scroll of the Avatar',
        id: 13199,
        mult: '2',
        img1: 'haste',
        img2: 'protection',
      },
      Pr: {
        name: 'Scroll of Protection',
        id: 13111,
        mult: '1',
        img1: 'protection',
      },
      Sw: {
        name: 'Scroll of Swiftness',
        id: 13101,
        mult: '1',
        img1: 'haste',
      },
      Li: {
        name: 'Scroll of Life',
        id: 13221,
        mult: '1',
        img1: 'sparklife',
      },
      Sh: {
        name: 'Scroll of Shadows',
        id: 13211,
        mult: '1',
        img1: 'shadowveil',
      },
      Ab: {
        name: 'Scroll of Absorption',
        id: 13201,
        mult: '1',
        img1: 'absorb',
      },
    };
    const scrollFirst = (g('option').scrollFirst) ? '_scroll' : '';
    let isUsed;
    for (const i in scrollLib) {
      if (g('option').scroll[i] && gE(`.bti3>div[onmouseover*="${scrollLib[i].id}"]`) && checkCondition(g('option')[`scroll${i}Condition`])) {
        for (let j = 1; j <= scrollLib[i].mult; j++) {
          if (gE(`#pane_effects>img[src*="${scrollLib[i][`img${j}`]}${scrollFirst}"]`)) {
            isUsed = true;
            break;
          }
          isUsed = false;
        }
        if (!isUsed) {
          gE(`.bti3>div[onmouseover*="${scrollLib[i].id}"]`).click();
          return true;
        }
      }
    }
    return false;
  }

  function useChannelSkill() { // 自动施法Channel技能
    if (!g('option').channelSkillSwitch) {
      return false;
    }
    if (!g('option').channelSkill) {
      return false;
    }
    if (!gE('#pane_effects>img[src*="channeling"]')) {
      return false;
    }
    const skillLib = {
      Pr: {
        name: 'Protection',
        id: '411',
        img: 'protection',
      },
      SL: {
        name: 'Spark of Life',
        id: '422',
        img: 'sparklife',
      },
      SS: {
        name: 'Spirit Shield',
        id: '423',
        img: 'spiritshield',
      },
      Ha: {
        name: 'Haste',
        id: '412',
        img: 'haste',
      },
      AF: {
        name: 'Arcane Focus',
        id: '432',
        img: 'arcanemeditation',
      },
      He: {
        name: 'Heartseeker',
        id: '431',
        img: 'heartseeker',
      },
      Re: {
        name: 'Regen',
        id: '312',
        img: 'regen',
      },
      SV: {
        name: 'Shadow Veil',
        id: '413',
        img: 'shadowveil',
      },
      Ab: {
        name: 'Absorb',
        id: '421',
        img: 'absorb',
      },
    };
    let i; let
      j;
    const skillPack = g('option').buffSkillOrderValue.split(',');
    if (g('option').channelSkill) {
      for (i = 0; i < skillPack.length; i++) {
        j = skillPack[i];
        if (g('option').channelSkill[j] && !gE(`#pane_effects>img[src*="${skillLib[j].img}"]`) && isOn(skillLib[j].id)) {
          gE(skillLib[j].id).click();
          return true;
        }
      }
    }
    if (g('option').channelSkill2 && g('option').channelSkill2OrderValue) {
      const order = g('option').channelSkill2OrderValue.split(',');
      for (i = 0; i < order.length; i++) {
        if (isOn(order[i])) {
          gE(order[i]).click();
          return true;
        }
      }
    }
    const buff = gE('#pane_effects>img', 'all');
    if (buff.length > 0) {
      const name2Skill = {
        'Protection': 'Pr',
        'Spark of Life': 'SL',
        'Spirit Shield': 'SS',
        'Hastened': 'Ha',
        'Arcane Focus': 'AF',
        'Heartseeker': 'He',
        'Regen': 'Re',
        'Shadow Veil': 'SV',
      };
      for (i = 0; i < buff.length; i++) {
        const spellName = buff[i].getAttribute('onmouseover').match(/'(.*?)'/)[1];
        const buffLastTime = buff[i].getAttribute('onmouseover').match(/\(.*,.*, (.*?)\)$/)[1] * 1;
        if (isNaN(buffLastTime) || buff[i].src.match(/_scroll.png$/)) {
          continue;
        } else {
          if (spellName === 'Cloak of the Fallen' && !gE('#pane_effects>img[src*="sparklife"]') && isOn('422')) {
            gE('422').click();
            return true;
          } if (spellName in name2Skill && isOn(skillLib[name2Skill[spellName]].id)) {
            gE(skillLib[name2Skill[spellName]].id).click();
            return true;
          }
        }
      }
    }
    return false;
  }

  function useBuffSkill() { // 自动施法BUFF技能
    const skillLib = {
      Pr: {
        name: 'Protection',
        id: '411',
        img: 'protection',
      },
      SL: {
        name: 'Spark of Life',
        id: '422',
        img: 'sparklife',
      },
      SS: {
        name: 'Spirit Shield',
        id: '423',
        img: 'spiritshield',
      },
      Ha: {
        name: 'Haste',
        id: '412',
        img: 'haste',
      },
      AF: {
        name: 'Arcane Focus',
        id: '432',
        img: 'arcanemeditation',
      },
      He: {
        name: 'Heartseeker',
        id: '431',
        img: 'heartseeker',
      },
      Re: {
        name: 'Regen',
        id: '312',
        img: 'regen',
      },
      SV: {
        name: 'Shadow Veil',
        id: '413',
        img: 'shadowveil',
      },
      Ab: {
        name: 'Absorb',
        id: '421',
        img: 'absorb',
      },
    };
    if (!g('option').buffSkillSwitch) {
      return false;
    }
    if (!g('option').buffSkill) {
      return false;
    }
    if (!checkCondition(g('option').buffSkillCondition)) {
      return false;
    }
    let i;
    const skillPack = g('option').buffSkillOrderValue.split(',');
    for (i = 0; i < skillPack.length; i++) {
      let buff = skillPack[i];
      if (g('option').buffSkill[buff] && checkCondition(g('option')[`buffSkill${buff}Condition`]) && !gE(`#pane_effects>img[src*="${skillLib[buff].img}"]`) && isOn(skillLib[buff].id)) {
        gE(skillLib[buff].id).click();
        return true;
      }
    }
    const draughtPack = {
      HD: {
        id: 11191,
        img: 'healthpot',
      },
      MD: {
        id: 11291,
        img: 'manapot',
      },
      SD: {
        id: 11391,
        img: 'spiritpot',
      },
      FV: {
        id: 19111,
        img: 'flowers',
      },
      BG: {
        id: 19131,
        img: 'gum',
      },
    };
    for (i in draughtPack) {
      if (!gE(`#pane_effects>img[src*="${draughtPack[i].img}"]`) && g('option').buffSkill && g('option').buffSkill[i] && checkCondition(g('option')[`buffSkill${i}Condition`]) && gE(`.bti3>div[onmouseover*="${draughtPack[i].id}"]`)) {
        gE(`.bti3>div[onmouseover*="${draughtPack[i].id}"]`).click();
        return true;
      }
    }
    return false;
  }

  function useInfusions() { // 自动使用魔药
    if (g('attackStatus') === 0) {
      return false;
    }
    if (!g('option').infusionSwitch) {
      return false;
    }
    if (!checkCondition(g('option').infusionCondition)) {
      return false;
    }

    const infusionLib = [null, {
      id: 12101,
      img: 'fireinfusion',
    }, {
        id: 12201,
        img: 'coldinfusion',
      }, {
        id: 12301,
        img: 'elecinfusion',
      }, {
        id: 12401,
        img: 'windinfusion',
      }, {
        id: 12501,
        img: 'holyinfusion',
      }, {
        id: 12601,
        img: 'darkinfusion',
      }];
    if (gE(`.bti3>div[onmouseover*="${infusionLib[g('attackStatus')].id}"]`) && !gE(`#pane_effects>img[src*="${infusionLib[[g('attackStatus')]].img}"]`)) {
      gE(`.bti3>div[onmouseover*="${infusionLib[g('attackStatus')].id}"]`).click();
      return true;
    }
    return false;
  }

  function autoFocus() {
    if (g('option').focus && checkCondition(g('option').focusCondition)) {
      gE('#ckey_focus').click();
      return true;
    }
    return false;
  }

  function autoSS() {
    if ((g('option').turnOnSS && checkCondition(g('option').turnOnSSCondition) && !gE('#ckey_spirit[src*="spirit_a"]')) || (g('option').turnOffSS && checkCondition(g('option').turnOffSSCondition) && gE('#ckey_spirit[src*="spirit_a"]'))) {
      gE('#ckey_spirit').click();
      return true;
    }
    return false;
  }

  /**
       * INNAT / WEAPON SKILLS
       *
       * 优先释放先天和武器技能
       */
  function autoSkill() {
    if (!g('option').skillSwitch) {
      return false;
    }
    if (!gE('#ckey_spirit[src*="spirit_a"]')) {
      return false;
    }

    const skillOrder = (g('option').skillOrderValue || 'OFC,FRD,T3,T2,T1').split(',');
    const skillLib = {
      OFC: {
        id: '1111',
        oc: 8,
      },
      FRD: {
        id: '1101',
        oc: 4,
      },
      T3: {
        id: `2${g('option').fightingStyle}03`,
        oc: 2,
      },
      T2: {
        id: `2${g('option').fightingStyle}02`,
        oc: 2,
      },
      T1: {
        id: `2${g('option').fightingStyle}01`,
        oc: 2,
      },
    };
    const rangeSkills = {
      2101: 2,
      2403: 2,
      1111: 4,
    }
    const monsterStatus = g('battle').monsterStatus;
    for (let i in skillOrder) {
      let skill = skillOrder[i];
      let range = 0;
      if (!checkCondition(g('option')[`skill${skill}Condition`])) {
        continue;
      }
      if (!isOn(skillLib[skill].id)) {
        continue;
      }
      if (g('oc') < skillLib[skill].oc) {
        continue;
      }
      if (g('option').skillOTOS && g('option').skillOTOS[skill] && g('skillOTOS')[skill] >= 1) {
        continue;
      }
      g('skillOTOS')[skill]++;
      gE(skillLib[skill].id).click();
      if (skillLib[skill].id in rangeSkills) {
        range = rangeSkills[skillLib[skill].id];
      }
      if (!g('option').mercifulBlow || g('option').fightingStyle !== '2' || skill !== 'T3') {
        continue;
      }
      // Merciful Blow
      for (let j = 0; j < monsterStatus.length; j++) {
        if (monsterStatus[j].hpNow / monsterStatus[j].hp < 0.25 && gE(`#mkey_${getMonsterID(monsterStatus[j])} img[src*="wpn_bleed"]`)) {
          gE(`#mkey_${getRangeCenterID(monsterStatus[j])}`).click();
          return true;
        }
      }
    }
    gE(`#mkey_${getRangeCenterID(monsterStatus[0])}`).click();
    return true;
  }

  function useDeSkill() { // 自动施法DEBUFF技能
    if (!g('option').debuffSkillSwitch) { // 总开关是否开启
      return false;
    }
    // 先处理特殊的 “先给全体上buff”
    let skillPack = ['We', 'Im'];
    for (let i = 0; i < skillPack.length; i++) {
      if (g('option')[`debuffSkill${skillPack[i]}All`]) { // 是否启用
        continue;
      }
      if (!checkCondition(g('option')[`debuffSkill${skillPack[i]}AllCondition`])) { // 检查条件
        continue;
      }
      skillPack.splice(i, 1);
      i--;
    }
    skillPack.sort((x, y) => g('option').debuffSkillOrderValue.indexOf(x) - g('option').debuffSkillOrderValue.indexOf(y))
    let toAllCount = skillPack.length;
    if (g('option').debuffSkill) { // 是否有启用的buff(不算两个特殊的)
      skillPack = skillPack.concat(g('option').debuffSkillOrderValue.split(','));
    }
    for (let i in skillPack) {
      let buff = skillPack[i];
      if (i >= toAllCount && !skillPack[i]) { // 检查buff是否启用
        continue;
      }
      if (!checkCondition(g('option')[`debuffSkill${buff}Condition`])) { // 检查条件
        continue;
      }
      let succeed = useDebuffSkill(skillPack[i], i < toAllCount);
      // 前 toAllCount 个都是先给全体上的
      if (succeed) {
        return true;
      }
    }
    return false;
  }

  function useDebuffSkill(buff, isAll = false) {
    const skillLib = {
      Sle: {
        name: 'Sleep',
        id: '222',
        img: 'sleep',
      },
      Bl: {
        name: 'Blind',
        id: '231',
        img: 'blind',
      },
      Slo: {
        name: 'Slow',
        id: '221',
        img: 'slow',
      },
      Im: {
        name: 'Imperil',
        id: '213',
        img: 'imperil',
        range: { 4204: [0, 0, 0, 1] },
      },
      MN: {
        name: 'MagNet',
        id: '233',
        img: 'magnet',
      },
      Si: {
        name: 'Silence',
        id: '232',
        img: 'silence',
      },
      Dr: {
        name: 'Drain',
        id: '211',
        img: 'drainhp',
      },
      We: {
        name: 'Weaken',
        id: '212',
        img: 'weaken',
        range: { 4202: [0, 0, 0, 1] },
      },
      Co: {
        name: 'Confuse',
        id: '223',
        img: 'confuse',
      },
    };

    if (!isOn(skillLib[buff].id)) { // 技能不可用
      return false;
    }
    const monsterStatus = g('battle').monsterStatus;
    let isDebuffed = (target) => gE(`img[src*="${skillLib[buff].img}"]`, gE(`#mkey_${getMonsterID(target)}>.btm6`));
    let primaryTarget;
    let max = isAll ? monsterStatus.length : 1;
    for (let i = 0; i < max; i++) {
      let target = buff === 'Dr' ? monsterStatus[max - i - 1] : monsterStatus[i];
      if (monsterStatus[i].isDead) {
        continue;
      }
      if (isDebuffed(target)) { // 检查是否已有该buff
        continue;
      }
      primaryTarget = target;
      break;
    }
    if (primaryTarget === undefined) {
      return false;
    }

    let range = 0;
    let ab;
    for (ab in skillLib[buff].range) {
      const ranges = skillLib[buff].range[ab][skillLib[buff].skill * 1];
      if (!ranges) {
        continue;
      }
      range = ranges[getValue('ability', true)[ab].level];
      break;
    }
    let id = getRangeCenterID(primaryTarget, range, isDebuffed);
    const imgs = gE('img', 'all', gE(`#mkey_${id}>.btm6`));
    if (imgs.length < 6 || !g('option').debuffSkillTurnAlert || (g('option').debuffSkillTurn && imgs[imgs.length - 1].getAttribute('onmouseover').match(/\(.*,.*, (.*?)\)$/)[1] * 1 >= g('option').debuffSkillTurn[buff])) {
      gE(skillLib[buff].id).click();
      gE(`#mkey_${id}`).click();
      return true;
    }

    // 已有buff小于6个
    // 未开启debuff失败警告
    // buff剩余持续时间大于等于警报时间
    _alert(0, '无法正常施放DEBUFF技能，请尝试手动打怪', '無法正常施放DEBUFF技能，請嘗試手動打怪', 'Can not cast de-skills normally, continue the script?\nPlease try attack manually.');
    pauseChange();
    return true;
  }

  function attack() { // 自动打怪
    // 如果
    // 1. 开启了自动以太水龙头
    // 2. 目标怪在魔力合流状态中
    // 3. 未获得以太水龙头*2 或 *1
    // 4. 满足条件
    // 使用物理普通攻击，跳过Offensive Magic
    // 否则按照属性攻击模式释放Spell > Offensive Magic

    const updateAbility = {
      4301: { //火
        111: [0, 1, 1, 2, 2, 2, 2, 2],
        112: [0, 0, 2, 2, 2, 2, 3, 3],
        113: [0, 0, 0, 0, 3, 4, 4, 4]
      },
      4302: { //冰
        121: [0, 1, 1, 2, 2, 2, 2, 2],
        122: [0, 0, 2, 2, 2, 2, 3, 3],
        123: [0, 0, 0, 0, 3, 4, 4, 4]
      },
      4303: { //雷
        131: [0, 1, 1, 2, 2, 2, 2, 2],
        132: [0, 0, 2, 2, 2, 2, 3, 3],
        133: [0, 0, 0, 0, 3, 4, 4, 4]
      },
      4304: { //雷
        141: [0, 1, 1, 2, 2, 2, 2, 2],
        142: [0, 0, 2, 2, 2, 2, 3, 3],
        143: [0, 0, 0, 0, 3, 4, 4, 4]
      },
      //暗
      4401: { 161: [0, 1, 2] },
      4402: { 162: [0, 2, 3] },
      4403: { 163: [0, 3, 4, 4] },
      //圣
      4501: { 151: [0, 1, 2] },
      4502: { 152: [0, 2, 3] },
      4503: { 153: [0, 3, 4, 4] },
    }

    let range = 0;
    // Spell > Offensive Magic
    const attackStatus = g('attackStatus');
    const monsterStatus = g('battle').monsterStatus;
    if (attackStatus === 0) {
      if (g('option').fightingStyle === '1') { // 二天一流
        range = 1;
      }
    } else {
      if (g('option').etherTap && gE(`#mkey_${getMonsterID(monsterStatus[0])}>div.btm6>img[src*="coalescemana"]`) && (!gE('#pane_effects>img[onmouseover*="Ether Tap (x2)"]') || gE('#pane_effects>img[src*="wpn_et"][id*="effect_expire"]')) && checkCondition(g('option').etherTapCondition)) {
        `pass`
      }
      else {
        const skill = 1 * (() => {
          let lv = 3;
          for (let condition of [g('option').highSkillCondition, g('option').middleSkillCondition, undefined]) {
            let id = `1${attackStatus}${lv--}`;
            if (checkCondition(condition) && isOn(id)) return id;
          }
        })();
        gE(skill)?.click();
        for (let ab in updateAbility) {
          const ranges = updateAbility[ab][skill];
          if (!ranges) {
            continue;
          }
          range = ranges[getValue('ability', true)[ab]?.level ?? 0];
          break;
        }
      }
    }
    gE(`#mkey_${getRangeCenterID(monsterStatus[0], range, !attackStatus)}`).click();
    return true;
  }

  function getHPFromMonsterDB(mdb, name, lv) {
    /////////////////// TODO: 根据lv模糊推测
    return mdb ? mdb[name] ? mdb[name][lv] : undefined : undefined;
  }

  function fixMonsterStatus() { // 修复monsterStatus
    // document.title = _alert(-1, 'monsterStatus错误，正在尝试修复', 'monsterStatus錯誤，正在嘗試修復', 'monsterStatus Error, trying to fix');
    const monsterStatus = [];
    const monsterNames = Array.from(gE('div.btm3>div>div', 'all')).map(monster => monster.innerText);
    const monsterLvs = Array.from(gE('div.btm2>div>div', 'all')).map(monster => monster.innerText);
    const monsterDB = getValue('monsterDB', true);
    gE('div.btm2', 'all').forEach((monster, order) => {
      monsterStatus.push({
        order: order,
        hp: getHPFromMonsterDB(monsterDB, monsterNames[order], monsterLvs[order]) ?? ((monster.style.background === '') ? 1000 : 100000),
      });
    });
    const battle = getValue('battle', true);
    battle.monsterStatus = monsterStatus;
    setValue('battle', battle);
  }

  function displayMonsterWeight() {

    const status = g('battle').monsterStatus.filter(m => !m.isDead);
    let rank = 0;

    const weights = [];
    status.forEach(s => {
      if (weights.indexOf(s.finWeight) !== -1) {
        return;
      }
      weights.push(s.finWeight);
    })
    const sec = Math.max(1, weights.length - 1);
    const max = 360 * 2 / 3;
    const colorTextList = [];
    if (g('option').weightBackground) {
      status.forEach(s => {
        const rank = weights.indexOf(s.finWeight);
        let colorText = (g('option').weightBackground[rank + 1] ?? [])[0];
        colorTextList[rank] = colorText;
      });
    }
    status.forEach(s => {
      const rank = weights.indexOf(s.finWeight);
      const id = getMonsterID(s);
      if (!gE(`#mkey_${id}`) || !gE(`#mkey_${id}>.btm3`)) {
        return;
      }
      if (g('option').displayWeightBackground) {
        if (g('option').weightBackground) {
          let colorText = colorTextList[rank];
          let remainAttemp = 10; // 避免无穷递归
          while(remainAttemp > 0 && colorText && colorText.indexOf(`<style_`) !== -1){
            for(let i = 0; i<colorTextList.length; i++) {
              colorText = colorText.replace(`<style_${i+1}>`, colorTextList[i]);
            }
            remainAttemp--;
          }
          try {
            colorText = eval(colorText.replace('<rank>', rank).replace('<all>', weights.length));
          }
          catch {
          }
          gE(`#mkey_${id}`).style.cssText += `background: ${colorText};`;
        }
        // gE(`#mkey_${id}`).style.cssText += `background: hsl(${Math.round(max * rank / sec)}deg 50% 50%);`;
      }
      gE(`#mkey_${id}>.btm3`).style.cssText += 'display: flex; flex-direction: row;'
      if (g('option').displayWeight) {
        gE(`#mkey_${id}>.btm3`).innerHTML += `<div style='font-weight: bolder; right:0px; position: absolute;'>[${rank}|-${-rank + weights.length - 1}|${s.finWeight.toPrecision(s.finWeight >= 1 ? 5 : 4)}]</div>`;
      }
    });
  }

  function displayPlayStatePercentage() {
    // const ocPoints = gE('#vcp');
    const barHP = gE('#vbh') ?? gE('#dvbh');
    const barMP = gE('#vbm') ?? gE('#dvbm');
    const barSP = gE('#vbs') ?? gE('#dvbs');
    const barOC = gE('#dvbc');
    const textHP = gE('#vrhd') ?? gE('#dvrhd');
    const textMP = gE('#vrm') ?? gE('#dvrm');
    const textSP = gE('#vrs') ?? gE('#dvrs');
    const textOC = gE('#dvrc');

    const percentages = [barHP, barMP, barSP, barOC].filter(bar => bar).map(bar => Math.floor((gE('div>img', bar).offsetWidth / bar.offsetWidth) * 100));
    [textHP, textMP, textSP, textOC].filter(bar => bar).forEach((text, i) => {
      const value = text.innerHTML * 1;
      const percentage = value ? percentages[i] : 0;
      const inner = `[${percentage.toString()}%]`;
      const percentageDiv = gE('div', text);
      if (percentageDiv) {
        percentageDiv.innerHTML = inner;
        return;
      }
      text.innerHTML += `<div style="
        position: relative;
        top: ${textOC ? -15 : text === textHP ? -16.67 : -16}px;
        right: ${textOC ? -70 : text === textMP ? -60 : text === textSP ? 40 : -100}px;
        filter: brightness(0.2);
        text-align: left;
        ">${inner}</div>`
    });
  }

  function dropMonitor(battleLog) { // 掉落监测
    const drop = getValue('drop', true) || {
      '#startTime': time(3),
      '#EXP': 0,
      '#Credit': 0,
    };
    let item; let name; let amount; let
      regexp;
    for (let i = 0; i < battleLog.length; i++) {
      if (/^You gain \d+ (EXP|Credit)/.test(battleLog[i].textContent)) {
        regexp = battleLog[i].textContent.match(/^You gain (\d+) (EXP|Credit)/);
        if (regexp) {
          drop[`#${regexp[2]}`] += regexp[1] * 1;
        }
      } else if (gE('span', battleLog[i])) {
        item = gE('span', battleLog[i]);
        name = item.textContent.match(/^\[(.*?)\]$/)[1];
        if (item.style.color === 'rgb(255, 0, 0)') {
          const quality = ['Crude', 'Fair', 'Average', 'Superior', 'Exquisite', 'Magnificent', 'Legendary', 'Peerless'];
          for (let j = g('option').dropQuality; j < quality.length; j++) {
            if (name.match(quality[j])) {
              name = `Equipment of ${name.match(/^\w+/)[0]}`;
              drop[name] = (name in drop) ? drop[name] + 1 : 1;
              break;
            }
          }
        } else if (item.style.color === 'rgb(186, 5, 180)') {
          regexp = name.match(/^(\d+)x (Crystal of \w+)$/);
          if (regexp) {
            name = regexp[2];
            amount = regexp[1] * 1;
          } else {
            name = name.match(/^(Crystal of \w+)$/)[1];
            amount = 1;
          }
          drop[name] = (name in drop) ? drop[name] + amount : amount;
        } else if (item.style.color === 'rgb(168, 144, 0)') {
          drop['#Credit'] = drop['#Credit'] + name.match(/\d+/)[0] * 1;
        } else {
          drop[name] = (name in drop) ? drop[name] + 1 : 1;
        }
      } else if (battleLog[i].textContent === 'You are Victorious!') {
        break;
      }
    }
    const battle = g('battle');
    if (g('option').recordEach && battle.roundNow === battle.roundAll) {
      const old = getValue('dropOld', true) || [];
      drop.__name = getValue('battleCode');
      drop['#endTime'] = time(3);
      old.push(drop);
      setValue('dropOld', old);
      delValue('drop');
    } else {
      setValue('drop', drop);
    }
  }

  function recordUsage(parm) {
    const stats = getValue('stats', true) || {
      self: {
        _startTime: time(3),
        _turn: 0,
        _round: 0,
        _battle: 0,
        _monster: 0,
        _boss: 0,
        evade: 0,
        miss: 0,
        focus: 0,
      },
      restore: { // 回复量
      },
      items: { // 物品使用次数
      },
      magic: { // 技能使用次数
      },
      damage: { // 技能攻击造成的伤害
      },
      hurt: { // 受到攻击造成的伤害
        mp: 0,
        oc: 0,
        _avg: 0,
        _count: 0,
        _total: 0,
        _mavg: 0,
        _mcount: 0,
        _mtotal: 0,
        _pavg: 0,
        _pcount: 0,
        _ptotal: 0,
      },
      proficiency: { // 熟练度
      },
    };
    let text; let magic; let point; let
      reg;
    const battle = g('battle');
    if (g('monsterAlive') === 0) {
      stats.self._turn += battle.turn;
      stats.self._round += 1;
      if (battle.roundNow === battle.roundAll) {
        stats.self._battle += 1;
      }
    }
    if (parm.mode === 'magic') {
      magic = parm.magic;
      stats.magic[magic] = (magic in stats.magic) ? stats.magic[magic] + 1 : 1;
      stats.hurt.mp += parm.mp;
      stats.hurt.oc += parm.oc;
    } else if (parm.mode === 'items') {
      stats.items[parm.item] = (parm.item in stats.items) ? stats.items[parm.item] + 1 : 1;
    } else {
      stats.self[parm.mode] = (parm.mode in stats.self) ? stats.self[parm.mode] + 1 : 1;
    }
    const debug = false;
    let log = false;
    for (let i = 0; i < parm.log.length; i++) {
      if (parm.log[i].className === 'tls') {
        break;
      }
      text = parm.log[i].textContent;
      if (debug) {
        console.log(text);
      }
      if (text.match(/you for \d+ \w+ damage/)) {
        reg = text.match(/you for (\d+) (\w+) damage/);
        magic = reg[2].replace('ing', '');
        point = reg[1] * 1;
        stats.hurt[magic] = (magic in stats.hurt) ? stats.hurt[magic] + point : point;
        stats.hurt._count++;
        stats.hurt._total += point;
        stats.hurt._avg = Math.round(stats.hurt._total / stats.hurt._count);
        if (magic.match(/pierc|crush|slash/)) {
          stats.hurt._pcount++;
          stats.hurt._ptotal += point;
          stats.hurt._pavg = Math.round(stats.hurt._ptotal / stats.hurt._pcount);
        } else {
          stats.hurt._mcount++;
          stats.hurt._mtotal += point;
          stats.hurt._mavg = Math.round(stats.hurt._mtotal / stats.hurt._mcount);
        }
      } else if (text.match(/^[\w ]+ [a-z]+s [\w+ -]+ for \d+( .*)? damage/) || text.match(/^You .* for \d+ .* damage/)) {
        // text.match(/for \d+ .* damage/);
        reg = text.match(/for (\d+)( .*)? damage/);
        magic = text.match(/^[\w ]+ [a-z]+s [\w+ -]+ for/) ? text.match(/^([\w ]+) [a-z]+s [\w+ -]+ for/)[1].replace(/^Your /, '') : text.match(/^You (\w+)/)[1];
        point = reg[1] * 1;
        stats.damage[magic] = (magic in stats.damage) ? stats.damage[magic] + point : point;
      } else if (text.match(/Vital Theft hits .*? for \d+ damage/)) {
        magic = 'Vital Theft';
        point = text.match(/Vital Theft hits .*? for (\d+) damage/)[1] * 1;
        stats.damage[magic] = (magic in stats.damage) ? stats.damage[magic] + point : point;
      } else if (text.match(/You (evade|parry|block) the attack|misses the attack against you|(casts|uses) .* misses the attack/)) {
        stats.self.evade++;
      } else if (text.match(/(resists your spell|Your spell is absorbed|(evades|parries) your (attack|spell))|Your attack misses its mark|Your spell fails to connect/)) {
        stats.self.miss++;
      } else if (text.match(/You gain the effect Focusing/)) {
        stats.self.focus++;
      } else if (text.match(/^Recovered \d+ points of/) || text.match(/You are healed for \d+ Health Points/) || text.match(/You drain \d+ HP from/)) {
        magic = (parm.mode === 'defend') ? 'defend' : text.match(/You drain \d+ HP from/) ? 'drain' : parm.magic || parm.item;
        point = text.match(/\d+/)[0] * 1;
        stats.restore[magic] = (magic in stats.restore) ? stats.restore[magic] + point : point;
      } else if (text.match(/(restores|drain) \d+ points of/)) {
        reg = text.match(/^(.*) restores (\d+) points of (\w+)/) || text.match(/^You (drain) (\d+) points of (\w+)/);
        magic = reg[1];
        point = reg[2] * 1;
        stats.restore[magic] = (magic in stats.restore) ? stats.restore[magic] + point : point;
      } else if (text.match(/absorbs \d+ points of damage from the attack into \d+ points of \w+ damage/)) {
        reg = text.match(/(.*) absorbs (\d+) points of damage from the attack into (\d+) points of (\w+) damage/);
        point = reg[2] * 1;
        magic = parm.log[i - 1].textContent.match(/you for (\d+) (\w+) damage/)[2].replace('ing', '');
        stats.hurt[magic] = (magic in stats.hurt) ? stats.hurt[magic] + point : point;
        point = reg[3] * 1;
        magic = `${reg[1].replace('Your ', '')}_${reg[4]}`;
        stats.hurt[magic] = (magic in stats.hurt) ? stats.hurt[magic] + point : point;
      } else if (text.match(/You gain .* proficiency/)) {
        reg = text.match(/You gain ([\d.]+) points of (.*?) proficiency/);
        magic = reg[2];
        point = reg[1] * 1;
        stats.proficiency[magic] = (magic in stats.proficiency) ? stats.proficiency[magic] + point : point;
        stats.proficiency[magic] = stats.proficiency[magic].toFixed(3) * 1;
      } else if (text.trim() === '' || text.match(/You (gain |cast |use |are Victorious|have reached Level|have obtained the title|do not have enough MP)/) || text.match(/Cooldown|has expired|Spirit Stance|gains the effect|insufficient Spirit|Stop beating dead ponies| defeat |Clear Bonus|brink of defeat|Stop \w+ing|Spawned Monster| drop(ped|s) |defeated/)) {
        // nothing;
      } else if (debug) {
        log = true;
        setAudioAlarm('Error');
        console.log(text);
      }
    }
    if (debug && log) {
      console.table(stats);
      pauseChange();
    }
    setValue('stats', stats);
  }

  function recordUsage2() {
    const stats = getValue('stats', true);
    stats.self._monster += g('monsterAll');
    stats.self._boss += g('bossAll');
    const battle = g('battle');
    if (g('option').recordEach && battle.roundNow === battle.roundAll) {
      const old = getValue('statsOld', true) || [];
      stats.__name = getValue('battleCode');
      stats.self._endTime = time(3);
      old.push(stats);
      setValue('statsOld', old);
      delValue('stats');
    } else {
      setValue('stats', stats);
    }
  }
} catch (e) {
  console.log(e);
  document.title = e;
}
