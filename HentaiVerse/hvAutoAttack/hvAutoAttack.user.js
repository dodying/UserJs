/* eslint-env browser */
// ==UserScript==
// @name         [HV]AutoAttack
// @name:zh-TW   [HV]AutoAttack
// @name:zh-CN   [HV]AutoAttack
// @description  HV auto attack script, for the first user, should configure before use it.
// @description:zh-CN HV自动打怪脚本，初次使用，请先设置好选项，请确认字体设置正常
// @description:zh-TW HV自動打怪腳本，初次使用，請先設置好選項，請確認字體設置正常
// @version      2.91.242
// @author       dodying
// @namespace    https://github.com/dodying/
// @supportURL   https://github.com/dodying/UserJs/issues
// @icon         https://github.com/dodying/UserJs/raw/master/Logo.png
// @include      http*://hentaiverse.org/*
// @include      http*://alt.hentaiverse.org/*
// @include      http*://e-hentai.org/g/*
// @include      http*://e-hentai.org/news.php*
// @exclude     http*://*hentaiverse.org/*/y/*
// @exclude     http*://*hentaiverse.org/*/z/*
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

(function () { try {
  'use strict';
  // window and host
  const isFrame = window.self !== window.top;
  const eh = 'e-hentai.org';
  const hv = 'hentaiverse.org';
  const alt = 'alt.' + hv;
  let host = (() => { switch (window.location.host) {
    case eh: return { eh: { eh } }
    case hv: return { hv: { hv } }
    case alt: return { hv: { alt } }
  } })();
  if (!host) return;

  // statics and datas
  const dataFlags = { sharable: ['option'] };
  dataFlags.portable = ['drop', 'stats', 'dropOld', 'statsOld', 'monsterDB', 'monsterMID'];
  dataFlags.battleDatas = [...dataFlags.portable, 'battle', 'battleCode', 'disabled', 'stepIn', 'skillOTOS', 'onriddle', 'rec'];
  dataFlags.local = [...dataFlags.battleDatas, 'stamina', 'logCache', 'statsStatic', 'proficiency'];
  dataFlags.standalone = [...dataFlags.sharable, ...dataFlags.local, 'arena', 'lastUrl', 'ability', 'lastSwitch', 'itemWorldDatas', 'lastPersona', 'lastEquipSet'];
  dataFlags.excludeStandalone = { 'option': ['optionStandalone', 'version', 'lang'] };
  const _1s = 1000;
  const _1m = 60 * _1s;
  const _1h = 60 * _1m;
  const _1d = 24 * _1h;
  const monsterStateKeys = { obj: `div.btm1`, lv: `div.btm2`, name: `div.btm3`, bars: `div.btm4>div.btm5`, buffs: `div.btm6` };
  const setMonsterBuffSkillLib = ability => { return {
    // debuff skill ------------
    We: {
      proficiency: ['Deprecating', 0, 345], // ???
      buff: 'Weakened',
      name: 'Weaken',
      img: 'weaken',
      id: '212',
      range: { 4202: [1, 1, 2, 3] },
      duration: { 4201: [10, 11, 12, 13, 14, 15] },
      channeling: true,
      description: "'The target has been weakened, making it deal less damage, and preventing it from scoring critical hits.'"
    },
    Im: {
      proficiency: ['Deprecating', 30, 495], // ???
      buff: 'Imperiled',
      name: 'Imperil',
      img: 'imperil',
      id: '213',
      range: { 4204: [1, 1, 2, 3] },
      duration: { 4203: [10, 11, 12, 13, 14, 15] },
      channeling: true,
      description: "'The target has been imperiled, reducing physical and magical mitigation as well as elemental mitigation.'"
    },
    Bl: {
      proficiency: ['Deprecating', 30, 610], // ???
      buff: 'Blinded',
      name: 'Blind',
      img: 'blind',
      id: '231',
      range: { 4206: [1, 1, 2, 3] },
      duration: { 4205: [10, 11, 12, 13, 14, 15] },
      channeling: true,
      description: "'The target has been blinded, reducing the chance of landing attacks and hitting with magic spells.'"
    },
    Sle: {
      proficiency: ['Deprecating', 0, 410], // ???
      buff: 'Asleep',
      name: 'Sleep',
      img: 'sleep',
      id: '222',
      range: { 4207: [1, 1, 2, 3] },
      duration: { 4207: [5, 6, 6, 7] },
      channeling: true,
      description: "'The target has been lulled to sleep, preventing it from taking any actions. Any attacks against this target are guaranteed to hit, but can also wake it up.'"
    },
    Co: {
      proficiency: ['Deprecating', 45, 620], // ???
      buff: 'Confused',
      name: 'Confuse',
      img: 'confuse',
      id: '223',
      range: { 4207: [1, 1, 2, 3] },
      duration: { 4207: [10, 11, 12, 12] },
      channeling: true,
      description: "'The target has been confused, making it lunge out wildly and strike friends and foes alike.'"
    },
    Si: {
      proficiency: ['Deprecating', 40, 600], // ???
      buff: 'Silenced',
      name: 'Silence',
      img: 'silence',
      id: '232',
      range: { 4211: [1, 1, 2, 3] },
      duration: { 4211: [10, 11, 12, 13] },
      channeling: true,
      description: "'The target has been silenced, preventing it from using special attacks and magic.'"
    },
    MN: {
      proficiency: ['Deprecating', 100, 700], // ???
      buff: 'Immobilized',
      name: 'Immobilize',
      img: 'magnet',
      id: '233',
      range: { 4212: [1, 1, 1, 2, 2, 3] },
      duration: { 4212: [10, 11, 12, 13, 14, 15] },
      channeling: true,
      description: "'The target has been immobilized, eliminating its chance to evade and reducing its magic resistance.'"
    },
    Slo: {
      proficiency: ['Deprecating', 0, 300], // ???
      buff: 'Slowed',
      name: 'Slow',
      img: 'slow',
      id: '221',
      range: { 4213: [1, 1, 2, 2, 2, 3] },
      duration: { 4213: [10, 11, 12, 13, 14, 15] },
      channeling: true,
      description: `'The target has been slowed by ${[30, 40, 40, 45, 50, 50][ability[4213] ?? 0]}%, making it attack less frequently.'`
    },
    // debuff skills not checked ------------ ??
    Dr: {
      proficiency: ['Deprecating', 0, 300], // ???
      buff: 'Vital Theft',
      name: 'Drain',
      img: 'drainhp',
      id: '211',
      duration: 10,
      channeling: true,
      description: "'Siphons off the target\\'s life essence over time, and gives it to the player.'"
    },
    ET: {
      proficiency: ['Deprecating', 0, 300], // ???
      name: 'Ether Theft',
      img: 'drainmp',
      duration: 10, // ??
      description: "'Siphons off the target\\'s mana over time, and gives it to the player.'"
    },
    ST: {
      proficiency: ['Deprecating', 0, 300], // ???
      name: 'Spirit Theft',
      img: 'drainsp',
      duration: 10, // ??
      description: "'Siphons off the target\\'s spirit over time, and gives it to the player.'"
    },
    // elem attack debuff ------------ ??
    SS: {
      proficiency: ['Elemental', 0, 800], // ???
      name: 'Searing Skin',
      img: 'firedot',
      elem: 2,
      duration: 3,
      channeling: true,
      description: "'The skin of the target has been scorched, inhibiting its attack damage. Cold resistance is lowered.'"
    },
    FL: {
      proficiency: ['Elemental', 0, 800], // ???
      name: 'Freezing Limbs',
      img: 'coldslow',
      elem: 1,
      duration: 3,
      channeling: true,
      description: "'The limbs of the target have been frozen, causing slower movement. Wind resistance is lowered.'"
    },
    TA: {
      proficiency: ['Elemental', 0, 800], // ???
      name: 'Turbulent Air',
      img: 'windmiss',
      elem: 4,
      duration: 3,
      channeling: true,
      description: "'The air around the target has been upset, blowing up dust and increasing its miss chance. Elec resistance is lowered.'"
    },
    DB: {
      proficiency: ['Elemental', 0, 800], // ???
      name: 'Deep Burns',
      img: 'elecweak',
      elem: 3,
      duration: 3,
      channeling: true,
      description: "'Internal damage causes slower reactions and lowers evade and resist chance. Fire resistance is lowered.'"
    },
    BD: {
      proficiency: ['Forbidden', 0, 800], // ???
      name: 'Breached Defense',
      img: 'holybreach',
      elem: 6,
      duration: 3,
      channeling: true,
      description: "'The holy attack has penetrated the target defenses, making it take more damage. Dark resistance is lowered.'"
    },
    BA: {
      proficiency: ['Divine', 0, 800], // ???
      name: 'Blunted Attack',
      img: 'darknerf',
      elem: 5,
      duration: 3,
      channeling: true,
      description: "'The decaying effects of the spell has blunted the target offenses, making it deal less damage. Holy resistance is lowered.'"
    },
    BS: {
      proficiency: ['Divine', 0, 800], // ???
      name: 'Burning Soul',
      img: 'soulfire',
      duration: 7,
      channeling: true,
      description: "'The life essence of the target has been set ablaze, damaging its physical form over time.'"
    },
    RS: {
      proficiency: ['Forbidden', 0, 800], // ???
      name: 'Ripened Soul',
      img: 'ripesoul',
      duration: 7,
      channeling: true,
      description: "'The life essence of the target has been corrupted beyond repair, damaging its physical form over time.'"
    },
    // weapon debuff ------------ ??
    PA: {
      name: 'Penetrated Armor',
      img: 'wpn_ap',
      duration: 7,
      description: "'The armor of this target has been breached, reducing its physical defenses.'"
    },
    BW: {
      name: 'Bleeding Wound',
      img: 'wpn_bleed',
      stack: 80,
      duration: 7,
      description: "'Gashing wounds are making this target take damage over time.'"
    },
    Stun: {
      name: 'Stunned',
      img: 'wpn_stun',
      duration: 4,
      description: "'A powerful blow has temporarily stunned this target.'"
    },
    // else from player ------------ ??
    Po: {
      name: 'Spreading Poison',
      img: 'poison',
      duration: 15,
      description: "'Poison courses through the target\'s veins. This causes a damage-over-time effect, and eliminates its evade chance.'"
    },
    CM: {
      name: 'Coalesced Mana',
      img: 'coalescemana',
      duration: 5,
      description: "'Mystical energies have converged on this target. Striking it with any magic spell will consume only half the normal mana.'"
    },
    AW: {
      name: 'Absorbing Ward',
      img: 'absorb',
      duration: 'permanent',
      description: "'The next magical attack against the target has a chance to be absorbed and partially converted to MP.'"
    },
    FoS: {
      name: 'Fury of the Sisters',
      img: 'trio_furyofthesisters',
      duration: 'permanent',
      description: "'The destruction of the world tree has infuriated its defenders, increasing their accuracy.'"
    },
    LoF: {
      name: 'Lamentations of the Future',
      img: 'trio_skuld',
      duration: 'permanent',
      description: "'The destruction of the future has increased the attack power of her allies.'"
    },
    SoP: {
      name: 'Screams of the Past',
      img: 'trio_urd',
      duration: 'permanent',
      description: "'The destruction of the past has increased the defensive power of her allies.'"
    },
    WoP: {
      buff: 'Wails of the Present',
      name: 'Wailings of the Present',
      img: 'trio_verdandi',
      duration: 'permanent',
      description: "'The destruction the present has increased the attack speed of her allies.'"
    },
  } };
  const playerBuffSkillLib = {
    SS: {
      name: 'Spirit Shield',
      id: '423',
      img: 'spiritshield',
    },
    SL: {
      name: 'Spark of Life',
      id: '422',
      img: 'sparklife',
    },
    Pr: {
      name: 'Protection',
      id: '411',
      img: 'protection',
    },
    Ab: {
      name: 'Absorb',
      id: '421',
      img: 'absorb',
    },
    SV: {
      name: 'Shadow Veil',
      id: '413',
      img: 'shadowveil',
    },
    Re: {
      name: 'Regen',
      id: '312',
      img: 'regen',
    },
    Ha: {
      name: 'Haste',
      id: '412',
      img: 'haste',
    },
    He: {
      name: 'Heartseeker',
      id: '431',
      img: 'heartseeker',
    },
    AF: {
      name: 'Arcane Focus',
      id: '432',
      img: 'arcanemeditation',
    },

    CF: {
      name: 'Cloak of the Fallen',
      id: 422,
      img: 'fallenshield',
    }
  };
  const itemMap = {
    ...{ // Consumables
      11191: ['体力长效药', '體力長效藥', 'Health Draught'],
      11195: ['体力药水', '體力藥水', 'Health Potion'],
      11199: ['体力秘药', '體力秘藥', 'Health Elixir'],
      11291: ['魔力长效药', '魔力長效藥', 'Mana Draught'],
      11295: ['魔力药水', '魔力藥水', 'Mana Potion'],
      11299: ['魔力秘药', '魔力秘藥', 'Mana Elixir'],
      11391: ['灵力长效药', '靈力長效藥', 'Spirit Draught'],
      11395: ['灵力药水', '靈力藥水', 'Spirit Potion'],
      11399: ['灵力秘药', '靈力秘藥', 'Spirit Elixir'],
      12101: ['火焰魔药', '火焰魔藥', 'Infusion of Flames'],
      12201: ['冰冷魔药', '冰冷魔藥', 'Infusion of Frost'],
      12301: ['闪电魔药', '閃電魔藥', 'Infusion of Lightning'],
      12401: ['风暴魔药', '風暴魔藥', 'Infusion of Storms'],
      12501: ['神圣魔药', '神聖魔藥', 'Infusion of Divinity'],
      12601: ['黑暗魔药', '黑暗魔藥', 'Infusion of Darkness'],
      13299: ['众神卷轴', '眾神捲軸', 'Scroll of the Gods'],
      13221: ['生命卷轴', '生命捲軸', 'Scroll of Life'],
      13211: ['幻影卷轴', '幻影捲軸', 'Scroll of Shadows'],
      13201: ['吸收卷轴', '吸收捲軸', 'Scroll of Absorption'],
      13199: ['化身卷轴', '化身捲軸', 'Scroll of the Avatar'],
      13111: ['守护卷轴', '守護捲軸', 'Scroll of Protection'],
      13101: ['加速卷轴', '加速捲軸', 'Scroll of Swiftness'],
      19111: ['花瓶', '花瓶', 'Flower Vase'],
      19131: ['泡泡糖', '泡泡糖', 'Bubble-Gum'],
      11501: ['终极秘药', '終極秘藥', 'Last Elixir'],
      11401: ['能量饮料', '能量飲料', 'Energy Drink'],
      11402: ['咖啡因糖果', '咖啡因糖果', 'Caffeinated Candy'],
    } // Consumables
  };

  // runtime
  let lang, engaged, encounterAsyncOnIdle;
  const script = unsafeWindow.HVAA ??= {};
  script.scriptVersion = Version(GM_info ? GM_info.script.version : '2.91');

  const UI = {
    langs: 3,
    byLang: function (...args) {
      if (Array.isArray(args[0])) args = args[0];
      return args ? args[lang] : '';
    },
    cutLang: function (str) {
      return str?.replaceAll(/<l(\d+)>(.*?)<\/l(\d+)>/g, (matched, lang1, inner, lang2) => {
        switch (true) {
          case lang1 !== lang2: return inner;
          case lang1 !== lang: return '';
          default: return inner;
        }
      }) ?? str;
    },
    alert: (...args) => window.alert(UI.byLang(args)),
    confirm: (...args) => window.confirm(UI.byLang(args)),
    prompt: (...args) => window.prompt(UI.byLang(args.slice(0, UI.langs)), args[UI.langs]),
    l: function (...args) {
      if (!args.length) return '';
      if (typeof args[0] !== 'string') args = args[0];
      let extra = args?.[UI.langs];
      extra = extra ? ' ' + extra : '';
      return range(UI.langs).map(i => `<l${i}${extra}>${args?.[i] ?? ''}</l${i}>`).join('');
    },
    button: {
      class: function (className, ...inner) {
        return `<button class="${className}">${inner?.join('') ?? ''}</button>`
      },
      details: isDisplay => `${UI.l('详情', '詳情', 'Details')}${isDisplay ? `▲` : `▼`}`,
      pause: function (option) {
        return `${UI.l('暂停', '暫停', 'Pause')}${(option.pauseHotkey && option.pauseHotkeyStr) ? `(${option.pauseHotkeyStr})` : ''}`;
      },
      stepIn: function (option) {
        return `${UI.l('步进', '步進', 'StepIn')}${(option.stepInHotkey && option.stepInHotkeyStr) ? `(${option.stepInHotkeyStr})` : ''}`;
      },
      continue: function (option) {
        return `${UI.l('继续', '繼續', 'Continue', 'style="color:red;"')}<span style="color:red;">${(option.pauseHotkey && option.pauseHotkeyStr) ? `(${option.pauseHotkeyStr})` : ''}</span>`;
      },
    },
    expendData: function (datas, method) {
      const mapped = datas.map(args => method(args.id, UI.l(args.names), ...(args.values ?? [])));
      if (Array.isArray(mapped[0])) return mapped.reduce((acc, cur) => (acc ?? []).concat(cur ?? []), [])?.join('');
      return mapped.reduce((acc, cur) => (acc ?? '') + (cur ?? ''), '');
    },
    hidden: function (...inner) {
      return `<span hidden>${inner.join('')}</span>`
    },
    for: function (id, ...inner) {
      return `<span for="${id}">${inner.join('')}</span>`
    },
    label: function (ids, inner, ...extra) {
      const forTarget = Array.isArray(ids) ? [...ids, ''].join(',') : ids;
      return `<label for="${forTarget}" ${extra?.join('') ?? ''}>${inner ?? ''}</label>`
    },
    labeled: function (id, names, ...extra) {
      return `<input id="${id}" type="checkbox" ${extra?.join(' ') ?? ''}>${UI.label(id, names)}`;
    },
    orderValue: function (id, hidden) {
      return UI.text(id, 'style="width:80%;" disabled="true"', hidden ? 'type="hidden"' : '') + (hidden ? '' : '<br>');
    },
    text: function (id, ...extra) {
      return `<input name="${id}" ${extra.find(e => e.match('type="hidden"')) ? '' : 'type="text"'} ${extra.join(' ')}></input>`;
    },
    number: function (id, placeholder = 0, type = 'number', classExtra, ...extra) {
      return `<input class="hvAANumber ${classExtra ? classExtra : ''}" name="${id}" ${placeholder !== undefined ? `placeholder=${placeholder}` : ''} type="${type}" ${extra?.join(' ') ?? ''}>`;
    },
    b: function (...inner) {
      return `<b>${inner.join('')}</b>`;
    },
    repeat: function (n, size = '1fr') {
      return `repeat(${n}, ${size})`
    },
    hvAATab: function (id, ...inner) {
      return UI.div({
        args: {
          class: 'hvAATab', id: `hvAATab-${id}`,
          style: id === 'Main' ? 'display: block' : '',
        },
        inner: inner
      });
    },
    hvAATable: function (style, className, ...inner) {
      return UI.div({
        args: `class="hvAATable ${className}" style="grid-template-columns: ${style};"`,
        inner: inner
      });
    },
    checkSupplyInnerExtra: function (key, names) {
      return UI.div({
        args: { class: 'checkSupplyInner' },
        inner: [
          UI.labeled(`checkSupply${key}`, UI.b(UI.l(['[name]使用额外的库存检查', '[name]使用額外的庫存檢查', 'Extra supply check for [name]'].map(t => t.replace('[name]', names))), ';')),
          ...UI.getCheckSupplyOptionTable(key),
        ]
      });
    },
    div: function (...datas) {
      if (datas.length === 0) return `<div></div>`;
      if (datas.length > 1) {
        return [`<div>`, ...datas, `</div>`].join('');
      }
      datas = datas[0];
      if (typeof datas === 'string') {
        return [`<div>`, datas, `</div>`].join('');
      }
      if (datas.args || datas.inner) {
        let args = '';
        if (typeof datas.args === 'string') {
          args = datas.args;
        } else {
          for (const key in datas.args) {
            args += ` ${key}="${datas.args[key]}"`;
          }
        }
        return [`<div ${args}>`, ...(typeof datas.inner === 'string' ? [datas.inner] : datas.inner ?? ''), `</div>`].join('');
      }
      return [`<div>`, ...datas, `</div>`].join('');
    },
    getCheckSupplyOptionTable: function(suffix = '', checkBoxOnly) {
      const items = [
        11191, 11291, 11391, 12101, 12201,
        11195, 11295, 11395, 12301, 12401,
        11199, 11299, 11399, 12501, 12601,
        13299, 13221, 13211, 13201,        0,
        13199, 13111, 13101,        0, 11401,
        19111, 19131, 11501,        0, 11402];
      return [
        checkBoxOnly ? '' : `    <span class="checkSupply${suffix}Inner">${UI.l('库存', '庫存', 'Warn if supply')}&lt;max(100%,${UI.number(`checkSupplyWarn${suffix}`, 100)}%)${UI.hidden(UI.for(`checkSupplyWarn${suffix}`, `${UI.l('提示库存', '提示庫存', 'Supply warn')} ${suffix} %`))}${UI.l('时提示', '時提示')}${suffix ? '' : `[c!]`};</span><br>`,
        UI.hvAATable(undefined, `hvAAcheckItems checkSupply${suffix}Inner`, ...items.map(item => {
          if (!item) return UI.div();
          const names = itemMap[item].map((...args) => `<l${args[1]}>${args[0]}</l${args[1]}>`).join('');
          return UI.div(
            UI.labeled(
              `isCheck${suffix}_${item}`,
              `${!checkBoxOnly ? UI.number(`checkItem${suffix}_${item}`) : ''}${UI.hidden(UI.l('库存', '庫存', 'Supply') + ' ' + suffix)}${names}`
            ),
            UI.hidden(UI.for(`checkItem${suffix}_${item}`, UI.l('库存', '庫存', 'Supply') + ' ' + suffix + names)),
          )
        }))
      ];
    }
  }
  UI.attackStatusType = [
    UI.l('物理', '物理', 'Physical'),
    UI.l('火', '火', 'Fire'),
    UI.l('冰', '冰', 'Cold'),
    UI.l('雷', '雷', 'Elec'),
    UI.l('风', '風', 'Wind'),
    UI.l('圣', '聖', 'Divine'),
    UI.l('暗', '暗', 'Forbidden'),
  ];
  UI.button = {
    ...UI.button,
    update: UI.l('更新', '更新', 'Update'),
    updating: UI.l('更新中...', '更新中...', 'Updating...'),
    clear: UI.l('清空', '清空', 'Clear'),
    reset: UI.l('重置', '重置', 'Reset'),
  }

  const descriptor = Object.getOwnPropertyDescriptor(Array.prototype, 'sortBy');
  if (!descriptor || descriptor.configurable) {
    Object.defineProperty(Array.prototype, 'sortBy', {
      value: function sortBy(by) {
        return this.sort((x, y) => by(x) < by(y) ? -1 : by(x) > by(y) ? 1 : 0)
      },
      enumerable: false,
      configurable: true,
      writable: true
    });
  }

  // processing

  const [$RPN, $async, $debug] = [initRPN(), initAsync(), initDebug()];
  HVAA();

  // process steps
  function initRPN() {
    script.$RPN ??= {
      operators: {
        '>=': { precedence : 0, func: (a, b) => a >= b ? 1 : 0 },
        '<=': { precedence : 0, func: (a, b) => a <= b ? 1 : 0 },
        '==': { precedence : 0, func: (a, b) => a === b ? 1 : 0 },
        '!=': { precedence : 0, func: (a, b) => a !== b ? 1 : 0 },
        '&&': { precedence : -1, func: (a, b) => a && b ? 1 : 0 },
        '||': { precedence : -1, func: (a, b) => a || b ? 1 : 0 },
        '^': { precedence : -1, func: (a, b) => ((!a) ^ (!b)) ? 1 : 0 },
        '**': { precedence:3, func: (a, b) => Math.pow(a, b)},
        '-neg': { precedence: -2, func: (a) => -a },
        '~': { precedence : -2, func: (a) => Math.log10(a) },
        '!': { precedence : -2, func: (a) => a ? 0 : 1 },
        '+': { precedence : 1, func: (a, b) => a + b },
        '-': { precedence : 1, func: (a, b) => a - b },
        '*': { precedence : 2, func: (a, b) => a * b },
        '/': { precedence : 2, func: (a, b) => a / b },
        '%': { precedence : 2, func: (a, b) => a % b },
        '>': { precedence : 0, func: (a, b) => a > b ? 1 : 0 },
        '<': { precedence : 0, func: (a, b) => a < b ? 1 : 0 },
      },

      multiCharOperators: ['>=', '<=', '==', '!=', '&&', '||', '**'],

      test: {
        isNumber: str => /[0-9]/.test(str),
        number: str => /[.0-9]/.test(str),
        isParam: str => /[a-zA-Z_'",{}#]/.test(str),
        param: str => /[.a-zA-Z_'",{}#^~0-9]/.test(str),
      },

      isOperator: function (token) {
        return token in $RPN.operators;
      },

      hasHigherPrecedence: function (op1, op2) {
        return $RPN.operators[op1].precedence >= $RPN.operators[op2].precedence;
      },

      tokenize: function (expression) {
        const tokens = [];
        let i = 0;
        let lastTokenWasOperatorOrLeftParen = true;

        while (i < expression.length) {
          const ch = expression[i];

          if (ch === ' ') {
            i++;
            continue;
          }

          if (ch === '(' || ch === ')') {
            tokens.push(ch);
            i++;
            lastTokenWasOperatorOrLeftParen = (ch === '(');
            continue;
          }

          if (ch === "'" || ch === '"') {
            const quote = ch;
            let j = i;
            while (j < expression.length) {
              const current = expression[j];
              j++;
              if (current === '\\' && expression[j] === quote) {
                j++;
                continue;
              }
              if (i !== j - 1 && current === quote) break; // 字符串结束
            }
            if (j > expression.length) {
              throw new Error(`Unclosed ${quote} string`);
            }
            tokens.push(expression.slice(i, j));
            i = j;
            lastTokenWasOperatorOrLeftParen = false;
            continue;
          }

          let isMultiChar = false;
          for (const op of $RPN.multiCharOperators) {
            if (expression.startsWith(op, i)) {
              tokens.push(op);
              i += op.length;
              lastTokenWasOperatorOrLeftParen = true;
              isMultiChar = true;
              break;
            }
          }
          if (isMultiChar) continue;

          if ($RPN.isOperator(ch)) {
            if (ch === '-' && lastTokenWasOperatorOrLeftParen) {
              tokens.push('-neg');
            } else {
              tokens.push(ch);
            }
            i++;
            lastTokenWasOperatorOrLeftParen = true;
            continue;
          }

          if ($RPN.test.isNumber(ch)) {
            let num = '';
            while (i < expression.length && $RPN.test.number(expression[i])) {
              num += expression[i];
              i++;
            }
            tokens.push(parseFloat(num));
            lastTokenWasOperatorOrLeftParen = false;
            continue;
          }

          if ($RPN.test.isParam(ch)) {
            let varName = '';
            while (i < expression.length && $RPN.test.param(expression[i])) {
              varName += expression[i];
              i++;
            }
            tokens.push(varName);
            lastTokenWasOperatorOrLeftParen = false;
            continue;
          }

          throw new Error(`Unknown character: ${ch} from ${expression}`);
        }

        return tokens;
      },

      infixToPostfix: function (infixTokens) {
        const output = [];
        const stack = [];
        for (const token of infixTokens) {
          switch(true) {
            case typeof token === 'number' || $RPN.test.isParam(token[0]):
              output.push(token);
              break;
            case token === '(':
              stack.push(token);
              break;
            case token === ')':
              while (stack.length && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
              }
              stack.pop();
              break;
            case $RPN.isOperator(token):
              while (
                stack.length &&
                stack[stack.length - 1] !== '(' &&
                $RPN.hasHigherPrecedence(stack[stack.length - 1], token) &&
                $RPN.operators[token].func.length !== 1
              ) {
                output.push(stack.pop());
              }
              stack.push(token);
              break;
            default:
              break;
          }
          if (!$RPN.isOperator(token) && stack.length && $RPN.isOperator(stack[stack.length - 1]) && $RPN.operators[stack[stack.length - 1]].func.length === 1) {
            output.push(stack.pop());
          }
        }

        while (stack.length) {
          output.push(stack.pop());
        }

        return output;
      },

      evaluatePostfix: function (postfixTokens, resolver) {
        const stack = [];
        for (const token of postfixTokens) {
          if (typeof token === 'number') {
            stack.push(token);
            continue;
          }
          if (typeof token === 'string' && $RPN.test.isParam(token[0])) {
            let value = resolver ? resolver(token) : token;
            if (typeof value === 'string') {
              if (value[0] !== `"` && value[0] != `'`) value = `'${value}'`;
              else if (value[0] === `"` && value[value.length-1] === `"`) {
                value = `'${value.slice(1, value.length - 1)}'`;
              }
            }
            stack.push(value);
            continue;
          }
          let a, b;
          if ($RPN.operators[token].func.length === 1) {
            a = stack.pop();
            b = undefined;
          }
          else if (stack.length < 2) {
            if (token === '-') {
              b = stack.pop();
              a = 0;
            } else {
              throw new Error('Wrong Expression.');
            }
          } else {
            b = stack.pop();
            a = stack.pop();
          }

          let result;
          if (token in $RPN.operators) {
            result = $RPN.operators[token].func(a, b);
          } else {
            throw new Error(`Unknow operator: ${token}`);
          }
          stack.push(result);
        }

        if (stack.length !== 1) {
          throw new Error('Wrong Expression.');
        }

        return stack[0];
      },

      evaluate: function (expression, variableHandler = null) {
        const tokens = $RPN.tokenize(expression);
        const postfix = $RPN.infixToPostfix(tokens);
        return $RPN.evaluatePostfix(postfix, variableHandler);
      }
    };
    return script.$RPN;
  }

  function initDebug() {
    script.$debug ??= {
      Stack: class extends Error {
        constructor(...params) {
          super(...params);
          this.name = '$debug.Stack';
        }
      },
      realtime: false,
      logList: [],
      maxLogCache: 50,
      switchRealtimeLog: function () {
        $debug.enableRealtimeLog($debug.realtime);
      },
      enableRealtimeLog: function (enabled) {
        $debug.realtime = enabled;
        if (enabled) {
          $debug.shiftLog();
        }
      },
      log: function () {
        if ($debug.realtime) {
          console.trace(...arguments);
          return;
        }
        $debug.logList.push({
          args: [...arguments],
          stack: (new $debug.Stack()).stack
        });
        if ($debug.logList.length > $debug.maxLogCache) {
          $debug.logList.shift();
        }
      },
      shiftLog: function (stack) {
        while ($debug.logList.length) {
          const log = $debug.logList.shift();
          console.log(...log.args, stack ? `\n`+log.stack : '');
        }
      }
    }
    return script.$debug;
  }

  function initAsync() {
    script.$async ??= {
      list: [],
      logSwitchStrict: function (name, state) { try {
        if (!state) {
          $async.list.splice($async.list.indexOf(name), 1);
        } else {
          $async.list.push(name);
        }
        $debug.log(`${state ? 'Start' : 'End'} ${name}\n`, copy($async.list));
      } catch (err) { /* console.log(err) */ } },
      logSwitch: function (args) { try {
        const argsStr = Array.from(args).join(',');
        const name = `${args.callee.name}${argsStr === '' ? argsStr : `(${argsStr})`}`;
        const state = $async.list.indexOf(name) === -1;
        $async.logSwitchStrict(name, state);
      } catch (err) { /* console.log(err) */ } }
    }
    return script.$async;
  }

  function HVAA(forIsekaiEncounter) {
    const g = forIsekaiEncounter ? script.runtime.encounterHVAA ??= {} : script;
    const runtime = g.runtime ??= {};
    const flags = runtime.flags ??= {};
    const times = runtime.times ??= { encounter: {} };
    const realtime = g.realtime ??= {};
    let $ajax, monsterBuffSkillLib, ability;
    function $id(id, d) { return (d || runtime.document).getElementById(id); }
    function $qs(q, d) { return (d || runtime.document).querySelector(q); }
    function $qsa(q, d) { return Array.from((d || runtime.document).querySelectorAll(q)); }
    function $doc(h) { const d = new DOMParser().parseFromString(h, 'text/html'); return d; }
    function gE(query, mode, parent) { // 获取元素
      switch (mode) {
        case undefined:
          return (isNaN(+query)) ? $qs(query, parent) : $id(query, parent);
        case 'all':
          return $qsa(query, parent);
        default:
          return $qs(query, mode);
      }
    }
    function cE(name) { return runtime.document.createElement(name); }
    const _servername = (!forIsekaiEncounter && location.pathname.includes('/isekai/')) ? 'isekai' : 'persistent';
    const addition = {
      other: _servername === 'isekai' ? 'persistent' : 'isekai',
      utils: _servername === 'isekai' ? 'hvuti' : 'hvut',
    };
    const _server = {
      name: _servername,
      season: forIsekaiEncounter ? '1' : $id('world_text', document)?.textContent.match(/\d+ Season \d+/)?.[0] || '1',
      [_servername]: true, // _server.persistent || _server.isekai
      ...addition,
    };
    const _query = Object.fromEntries(location.search.slice(1).split('&').map((q) => { const [k, v = ''] = q.split('=', 2); return [decodeURIComponent(k.replace(/\+/g, ' ')), decodeURIComponent(v.replace(/\+/g, ' '))]; }));

    const $ajaxInit = window.top.$ajaxInit ??= unsafeWindow.top.$ajaxInit ??= initAjax;
    if (forIsekaiEncounter) {
      $ajax = window.top.$ajaxEncounter ??= unsafeWindow.top.$ajaxEncounter ??= $ajaxInit(_server, popup, $debug);
      $ajax._server ??= _server;
      $ajax.popup ??= popup;
      $ajax.$debug ??= $debug;
      (async () => {
        runtime.document = $doc(await $ajax.insert(window.location.href.replace('/isekai/', '/')));
        mainProcess();
      })();
    } else {
      $ajax = window.top.$ajax ??= unsafeWindow.top.$ajax ??= $ajaxInit(_server, popup, $debug);
      $ajax._server ??= _server;
      $ajax.popup ??= popup;
      $ajax.$debug ??= $debug;
      runtime.document = document;
      mainProcess();
    }

    function mainProcess() {
      if (window.location.href.includes('/equip/')) flags.equip = true;
      if (!gE('#csp') && !flags.equip) flags.maintain = true;
      times.responsive = new Date().getTime();
      ability = getValue('ability', true) ?? {};
      switch (true) {
        case !!host.eh: return onHandleEHNewsAndGallery();
        case !host.hv: return;
        case !checkOption(): return;
        case !onHandleHV(): return;
        case cacheIWorTW(): return;
        case !checkIsWindowTop(): return;
        case onIdle(): return;
        case forIsekaiEncounter: return;
        case onRiddle(): return;
        case onBattle(): return;
        default: setTimeout(goto, 5 * _1m);
      }
    }

    // ----------Process Steps----------

    function popup(text) {
      if (!g.option.popup) return;
      const popupWindow = cE('div');
      popupWindow.style.cssText += 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:#0006;z-index:1001;cursor:pointer;display:flex;justify-content:center;align-items:center;'
      popupWindow.addEventListener('click', r);
      document.body.appendChild(popupWindow);
      const display = cE('div');
      display.innerText = text;
      display.style.cssText += 'min-width:400px;min-height:100px;max-width:100%;max-height:100%;padding:10px;background-color:#fff;border:1px solid;display:flex;flex-direction:column;justify-content:center;font-size:10pt;color:#333;';
      popupWindow.appendChild(display);
      document.addEventListener('keydown', r);
      return display;

      function r(e) {
        switch(true) {
          case e.key?.length >= 2 && e.key?.includes('F'): return;
          case e.ctrlKey: return;
          default: break;
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        if (e.button !== 0 && !['Enter', ' ', 'Escape'].includes(e.key)) {
          return;
        }
        popupWindow.remove();
        document.removeEventListener('keydown', r);
      }
    }

    function onHandleEHNewsAndGallery() {
      setValue('lastEH', time(0));
      let url, encounter = getEncounter();
      const eventpane = gE('#eventpane');
      const now = time(0);
      if (eventpane) { // 新一天或遭遇战
        if ((url = gE('#eventpane>div>a')?.href.split('/')[3]) === undefined) encounter = []; // 新一天
        encounter.unshift({ url: url, time: now });
        setEncounter(encounter);
      } else if (encounter.length) {
        if (now - encounter[0]?.time > 0.5 * _1h) { // 延长最新一次的time, 避免因漏记录导致连续来回跳转
          encounter[0].time = now;
          setEncounter(encounter);
        }
        for (let e of encounter) {
          if (e.encountered || time(0) - e.time >= 30 * _1m) continue;
          url = e.url;
          break;
        }
      }

      const isEngage = window.location.href === 'https://e-hentai.org/news.php?encounter';
      if (!url) {
        if (isEngage && !getLocal('persistent_battle')) backFromBattle(); // 自动跳转，同时先刷新遭遇时间，延长下一次遭遇
        return;
      }
      // 减少因在恒定世界处于战斗中时打开eh触发了遭遇而导致的错失
      // 缓存当前链接，等战斗结束时再自动打开，下次打开链接时：
      // 1. 若新的遭遇未出现，进入已缓存的战斗链接
      // 2. 若新的遭遇已出现，则前一次已超时失效错过，重新获取新的一次
      if (!isEngage) { // 战斗外，非自动跳转
        if (eventpane) eventpane.style.cssText += 'color:red;'; // 链接标红提醒
      } else if (getLocal('persistent_battle')) { //战斗中
        if (eventpane) eventpane.style.cssText += 'color:gray;'; // 链接置灰提醒
      } else { // 战斗外，自动跳转
        let location = getLocal('url') ?? (document.referrer.match('hentaiverse.org') ? new URL(document.referrer).origin : 'https://hentaiverse.org');
        $ajax.openNoFetch(`${location.includes('https') ? 'https://' : 'http://'}${(location.includes('alt') || checkOption(true)?.altBattleFirst) ? 'alt.' : ''}hentaiverse.org/${url}`);
      }
    }

    async function onMaintain() { try {
      const body = document.body;
      const blockTip = /Blocking requests for (\d+) seconds due to excessive request rate/;
      let blocked = body.innerText?.match(blockTip)?.[1] * _1s;
      const duration = isNaN(blocked) ? _1h : blocked; // 非封禁，维护中? 过一个小时再刷新
      const start = time(0);
      let remain;
      await until(() => {
        remain = duration - time(0) + start + _1s; // add _1s to avoid time inaccuracies
        runtime.document.title = `[M]${timeStr(remain)}`;
        try { if (!isNaN(blocked)) {
          body.innerText = body.innerText.replace(blockTip, (...args) => args[0].replace(args[1], timeStr(remain)));
        } } catch (err) { console.log(err) };
        return remain <= 0;
      });
      goto();
    } catch (err) { console.error(err) } };

    function onHandleHV() {
      if (flags.maintain) {
        onMaintain();
        return forIsekaiEncounter ? (engaged = false) : true;
      }

      g.hvVersion = Version(...gE('script[src*="hvc.js"]')?.src.match(/z\/(\d+)(.*?)\/hvc.js/)?.slice(1, 3));

      try { if (window.location.href.startsWith('https://')) {
        unsafeWindow.MAIN_URL = unsafeWindow.MAIN_URL.replace(/^http:/, `https:`);
      } else {
        unsafeWindow.MAIN_URL = unsafeWindow.MAIN_URL.replace(/^https:/, `http:`);
      } } catch (err) { /* console.log(err) */ }

      if (forIsekaiEncounter) return true;
      setValue('url', window.location.origin);
      if (window.location.href.indexOf(`?s=Battle&ss=ba`) === -1) return true;
      // 补充记录（因写入冲突、网络卡顿等）未被记录的encounter链接
      const encounterURL = window.location.href?.split('/')[3];
      const encounter = getEncounter();
      const filtered = encounter.filter(e => e.url === encounterURL);
      if (!filtered.length) {
        encounter.unshift({ url: encounterURL, time: time(0), encountered: time(0) });
      } else {
        filtered[0].encountered ??= time(0);
      }
      setEncounter(encounter);
      if (!isInBattle()) backFromBattle();
      return true;
    }

    function getItemWorldDetail(doc) {
      doc ??= document;
      const matched = doc.body.innerHTML.match(/const info_itemworld = (\{.+\})/);
      if (!matched) return;
      const name = doc.body.innerHTML.match(/confirm_info.eqname = "(.*)";/)[1];
      const [_, level, world, max] = gE('#equpgrade', doc).innerHTML.match(/(\d+) \/ (\d+) \/ (\d+)/).map(x => x * 1);
      return { ...JSON.parse(matched[1]), name, level, world, max };
    }

    function cacheIWorTW() {
      if (forIsekaiEncounter || isInBattle()) return;
      switch (_query.s) {
          case 'Bazaar': {
            if (_query.ss !== 'am') return;
            if (_query.screen !== 'modify') return;
            const id = _query['eqids[]'];
            if (!id) return;
            const detail = getItemWorldDetail();
            if (!detail) return;
            let equip = { ...detail, filter: _query.filter, id };
            const arena = getWithStringfied('arena', true, {});
            arena.data.cached ??= {};
            arena.data.cached.iw ??= [];
            const index = arena.data.cached.iw.findIndex(d => d.id === id);
            if (index !== -1) arena.data.cached.iw.splice(index, 1);
            arena.data.cached.iw.unshift( { id, equip } );
            arena.data.cached.iw = arena.data.cached.iw.slice(0, 10);
            setIfChanged('arena', arena);
            return;
          }
          case 'Battle': {
            if (_query.ss !== 'tw') return;
            const arena = getWithStringfied('arena', true, {});
            const attempts = gE('#towerstart').innerText.match(/.*: (\d+) \/ \d+(?:\n|.)*: \d+ \/ \d+/)[1] * 1;
            if ((arena.data.cached?.tw?.data??0) <= attempts) {
              arena.data.cached ??= {};
              arena.data.cached.tw = { data: attempts };
            }
            setIfChanged('arena', arena);
            return;
          }
      }
    }

    function checkIsWindowTop() {
      if (forIsekaiEncounter) return true;
      const currentUrl = window.self.location.href;
      if (!isFrame) {
        if (g.option.keepAliveByAudio) createKeepAliveAudio();
        if (!g.option.riddlePopup || gE('#riddlecounter')) { // 未开启使用弹窗或仍处于答题
          return true;
        }
        if (!window.opener || window.opener === window.self || window.opener.closed) { // 没有仍存在的opener
          return true;
        }
        try {
          if (!isInBattle(window.opener.document)) { // opener不处于战斗或答题中
            return true;
          }
        } catch (err) {
          console.error(err);
          return true;
        }
        try {
          window.opener.location.href = currentUrl;
        } catch (err) {
          console.error(err);
          console.error(`current: ${currentUrl}`);
          console.error(`opener: ${window.opener}`);
          console.error(`opener.location: ${window.opener.location}`);
          console.error(`opener.location.href: ${window.opener.location.href}`);
          window.opener.location.href = window.opener.location.href;
        }
        const isFirefox = typeof InstallTrigger !== 'undefined';
        tryClose(3, isFirefox ? 500 : 300);
        return false;
      }

      if (isInBattle()) {
        if (!window.top.location.href.endsWith(`?s=Battle`)) {
          setValue('lastUrl', window.top.location.href);
        }
        window.top.location.href = currentUrl;
        return false;
      }
      if (currentUrl.match(/\?s=Battle&ss=(ar|rb)/)) {
        setArenaDisplay();
      }
      return false;
    }

    function createKeepAliveAudio() {
      let audioContext;
      try {
        audioContext = new AudioContext();
      } catch (err) {
        console.error('[hvAA keepAlive] AudioContext 创建失败:', err);
        return;
      }
      console.log('[hvAA keepAlive] 脚本已初始化, 当前状态:', audioContext.state); // 启动即报状态
      audioContext.onstatechange = () => console.log('[hvAA keepAlive] 状态变更:', audioContext.state);
      const gain = audioContext.createGain();
      gain.gain.value = 0; // 平时静音
      const osc = audioContext.createOscillator();
      osc.frequency.value = 50; // 实测可行的频率
      osc.connect(gain).connect(audioContext.destination);
      osc.start();
      // 每5秒发一个50m的微脉冲(音量0.001)，持续维持“正在播放”判定
      setInterval(() => {
        gain.gain.setValueAtTime(0.001, audioContext.currentTime);
        gain.gain.setValueAtTime(0, audioContext.currentTime + 0.05);
      }, 5000);
      const resume = () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            console.log('[hvAA keepAlive] 音频已激活, 状态:', audioContext.state);
          }).catch(err => console.error('[hvAA keepAlive] 激活失败:', err));
        }
      };
      resume();
      // chrome自动播放策略要求首次激活需一次手势
      document.addEventListener('click', resume);
      document.addEventListener('keydown', resume);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') resume();
      });
    }

    // 答题//
    async function riddleAlert() { try {
      setAlarm('Riddle');
      const option = g.option;
      const answerTime = option.riddleAnswerTime;
      let time;
      const timeDiv = gE('#riddlecounter>div>div', 'all');
      while (time === undefined || time > answerTime) {
        if (timeDiv.length === 0) {
          await sleep(_1s);
          continue;
        }
        time = undefined;
        for (let t of timeDiv) {
          time = (t.style.backgroundPosition.match(/(\d+)px$/)[1] / 12).toString() + (time ?? '');
        }
        time *= 1;
        document.title = time;
        await sleep(_1s);
      }
      for (let ans of gE('#riddler1>*', 'all').children) {
        if (!ans.children[0].children[0].checked) continue;
        gE('#riddlesubmit').click();
        return;
      }
      if (!option.riddleAnswerChoose) return;
      // if no answer selected
      const answers = ['aj', 'fs', 'pp', 'ra', 'rd', 'ts'].sort(Math.random);
      const answer = `riddlesubmit=Submit+Answer` + answers.slice(0, Math.max(0, Math.min(6, option.riddleAnswerChoose))).map(ans => `&riddleanswer[]=${ans}`).join('');
      const battle = gE('#battle_main', $doc(await $ajax.fetch(window.location.href, answer)));
      if (!battle) console.error('ERROR: Failed fetch submit.');
      goto();
    } catch (err) { console.error(err); }}

    async function safeClose(delay) {
      try { window.close() } catch (err) { /* console.log(err) */ }
      await sleep(delay);
      return !window || window.closed;
    }

    async function tryClose(attempts, delay) { try {
      await sleep(delay);
      window.opener = null;
      window.open('', '_self');
      if (await safeClose(delay)) return;
      window.location.href = 'about:blank';
      if (await safeClose(delay)) return;
      attempts--;
      if (attempts <= 0) {
        document.body.innerHTML = '<div style="padding:20px;">Auto close popup failed. Please manually close window.</div>';
        return;
      }
      await tryClose(attempts, delay);
    } catch (err) { console.error('Opener reload or popup close failed:', err) } }

    function checkOption(isRaw) {
      let option = getValue('option', true);
      if (isRaw) return option;
      g.version = script.scriptVersion;
      if (!forIsekaiEncounter && !option) {
        if (isFrame) return false;
        lang = window.prompt('请输入以下语言代码对应的数字\nPlease put in the number of your preferred language (0, 1 or 2)\n0.简体中文\n1.繁體中文\n2.English', 0) || 2;
        option = g.option = { lang };
        addStyle();
        UI.alert('请设置hvAutoAttack', '請設置hvAutoAttack', 'Please config this script');
        gE('.hvAAButton').click();
        return false;
      }

      option = loadOption(option);
      g.option = isFrame ? option : setValue('option', option);
      if (!forIsekaiEncounter) {
        writePortables();
        lang = g.option.lang || '0';
      }
      addStyle();
      if (forIsekaiEncounter) return true;

      // README等合并到主分支后再取消掉注释
      // if (option.version.substr(0, 4) !== scriptVersion.ver.substr(0, 4)) {
      //   gE('.hvAAButton').click();
      //   if (UI.confirm('hvAutoAttack版本更新，请重新设置\n强烈推荐【重置设置】后再设置。\n是否查看更新说明？', 'hvAutoAttack版本更新，請重新設置\n強烈推薦【重置設置】後再設置。\n是否查看更新說明？', 'hvAutoAttack version update, please reset\nIt\'s recommended to reset all configuration.\nDo you want to read the changelog?')) {
      //     $ajax.openNoFetch('https://github.com/dodying/UserJs/commits/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js', true);
      //   }
      //   gE('.hvAAReset').focus();
      //   return false;
      // }

      if (host.hv && gE('[class^="c5"], [class^="c4"]') && UI.confirm('请设置字体\n使用默认字体可能使某些功能失效\n是否查看相关说明？', '請設置字體\n使用默認字體可能使某些功能失效\n是否查看相關說明？', 'Please set the font\nThe default font may make some functions fail to work\nDo you want to see instructions?')) {
        $ajax.openNoFetch(`https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README${UI.l('.md#关于字体的说明', '.md#关于字体的说明', '_en.md#about-font')}`, true);
        return false;
      }
      return true;
    }

    function writePortables() {
      const option = g.option;
      if (!option.portable) return;
      for (const key of dataFlags.portable) {
        if (!(Object.keys(option.portable).includes(key))) continue;
        setIfChanged(key, getWithStringfied(key), true);
      }
    }

    function backFromBattle() {
      const beforeEncounter = getValue('beforeEncounter');
      if (beforeEncounter) {
        setValue('lastUrl', beforeEncounter);
        setValue('beforeEncounter', 0);
      }
      $ajax.openNoFetch(getValue('lastUrl'));
    }

    function onRiddle() {
      if (!gE('#riddlecounter')) return false;
      setValue('onriddle', true);
      if (!g.option.riddlePopup || window.opener) {
        riddleAlert();
        return true;
      }
      window.open(window.location.href, 'riddleWindow', 'resizable, scrollbars, width=1241, height=707');
      return true;
    }

    function onIdle() {
      if (!gE('#navbar')) return (engaged = false);
      if (forIsekaiEncounter) return (encounterAsyncOnIdle = asyncOnIdle);

      // 战斗结束跳转回原链接
      if (window.top.location.href.endsWith(`?s=Battle`)) {
        backFromBattle();
        return true;
      }
      const arena = getWithStringfied('arena', true, {});
      delete arena.data?.equip;
      arena.data.postoken = gE('input[name="postoken"]')?.value ?? arena.data.postoken;
      setIfChanged('arena', arena);

      if (window.location.href.indexOf(`?s=Battle&ss=ba`) === -1) { // 不缓存encounter
        setValue('lastUrl', window.top.location.href); // 缓存进入战斗前的页面地址
        setArenaDisplay();
      }
      delValue(1);
      const option = g.option;
      if (option.showQuickSite && option.quickSite) {
        quickSite();
      }
      const hvAAPauseUI = runtime.document.body.appendChild(cE('div'));
      hvAAPauseUI.classList.add('hvAAPauseUI');
      setPauseUI(hvAAPauseUI);
      asyncOnIdle();
      return true;
    }

    function onBattleBox() {
      let box = gE('#hvAABox2');
      if (box) return box;
      box = gE('#battle_main').appendChild(cE('div'));
      box.id = 'hvAABox2';
      setPauseUI(box);
      return box;
    }

    async function onBattle() {
      if (!gE('#textlog')) return false;
      monsterBuffSkillLib = setMonsterBuffSkillLib(ability);

      checkResponsive();

      if (getValue('onriddle')) {
        window.history.replaceState(null, '', window.location.href);
        setValue('onriddle', 0);
      }
      onBattleBox();
      reloader();
      const option = g.option;
      realtime.attackStatus = option.attackStatus;
      // 1二天 2单手 3双手 4双持 5法杖
      range(5).map(s => s + 1).filter(s => gE(`2${s}01`)).forEach(s => { realtime.fightingStyle = s.toString() });
      times.now = time(0);
      runtime.runSpeed = 1;
      newRound(false);
      onPrevBattleLog(false);
      await onBattleRound(true);
      const battle = g.battle;
      if (option.recordEach) {
        let code = getWithStringfied('battleCode', true);
        const tokens = { token: runtime.document.body.innerHTML.match(`var battle_token = \"(.*)\";`)[1], postoken: battle?.postoken };
        const same = Object.keys(tokens).map(k => tokens[k] === code.data?.[k]).every(s => s);
        if (!same || !code.data?.roundAll || !code.data?.roundNow) {
          const now = same ? code.data?.time ?? time(1) : time(1);
          const roundType = battle?.roundType?.toUpperCase();
          const [roundAll, roundNow] = [battle?.roundAll, battle?.roundNow];
          code.data = {
            ...tokens,
            time: now,
            roundType, roundAll, roundNow,
            name: `${now}: ${roundType}-${roundAll}`,
          };
          setIfChanged('battleCode', code);
        }
      }
      updateEncounter(_server.isekai && option.encounter);
      return true;
    }

    // ----------methods----------
    // 通用//
    function unique(arr) {
      const newArr = [];
      for (const i of range(arr)) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    }

    function object2Order(orderValue, ...args) {
      switch (typeof orderValue) {
        case 'string':
          return orderValue?.split(',') ?? [];
        case 'number':
        case 'boolean':
          return [orderValue];
        case 'function':
          return object2Order(orderValue(...args));
        case 'object':
        case 'undefined':
          if (!orderValue) return []; // null or undefined
          if (Array.isArray(orderValue)) return orderValue;
          break;
        default:
          break;
      }
      throw new Error('Unsupported typeof orderValue:', orderValue, typeof orderValue);
    }

    function getDefaultOrder(idMatch, map) {
      const defaultOrder = runtime.defaultOrder ??= {};
      const key = idMatch + (map?.toString() ?? '');
      return (defaultOrder[key] ??= [...gE(`[id^="${idMatch}_"]`, 'all')].map(map ?? (ord => ord.id.match(/_(.*)/)[1])));
    }

    function splitOrders(orderValue, defaultOrder, ...args) {
      return unique(object2Order(orderValue, ...args).concat(defaultOrder ?? []).map(v => isNaN(v * 1) ? v : v * 1));
    }

    function gotoAlt(isAltOnly) {
      const current = window.location.href;
      let next = current;
      if (!host.hv.alt) {
        next = current.replace(`://${hv}`, `://${alt}`);
      } else {
        next = isAltOnly ? current : current.replace(`://${alt}`, `://${hv}`);
      }
      $ajax.openNoFetch(next);
      return true;
    }

    function getPause() {
      if (g.disabled !== undefined) return g.disabled;
      return (g.disabled = getValue('disabled') || false);
    }

    function setPause(value = '', temporary) {
      if (g.disabled !== value) g.disabled = temporary ? value : setValue('disabled', value);
    }

    async function waitPause(isForBattle, ms) { try {
      return await until(() => !getPause(), ms ?? (0.25 * _1s), isForBattle);
    } catch (err) { console.error(err); }}

    function setArenaDisplay() {
      const option = g.option;
      if (!option.obscureNotIdleArena) {
        return;
      }
      if (window.location.href.indexOf(`?s=Battle&ss=ar`) === -1 && window.location.href.indexOf(`?s=Battle&ss=rb`) === -1) {
        return;
      }
      const ar = splitOrders(option.idleArenaValue).map(String);
      if (ar.length === 0) {
        return;
      }
      getStartBattleButtons().forEach(btn => {
        if (ar.includes(btn.id) && btn.cleared && !option.arLevelDisable?.[btn.id]) {
          return;
        }
        gE('div', 'all', btn.closest('#arena_list tr')).forEach(div => { div.style.cssText += `color:${btn.cleared?'grey':'red'}!important;` });
      });
    }

    function getStartBattleButtons(doc = undefined, site = undefined) {
      const idMap = {
        ar: { 1: 1, 10: 3, 20: 5, 30: 8, 40: 9, 50: 11, 60: 12, 70: 13, 80: 15, 90: 16, 100: 17, 110: 19, 120: 20, 130: 21, 140: 23, 150: 24, 165: 26, 180: 27, 200: 28, 225: 29, 250: 32, 300: 33, 400: 34, 500: 35 },
        rb: [105, 106, 107, 108, 109, 110, 111, 112],
      }
      const option = g.option;
      doc ??= runtime.document;
      site ??= doc.location.href.match(/\?s=Battle\&ss=(.*)/)[1];
      const buttons = gE(`img[src*="startchallenge.png"], img[src*="startgrindfest.png"], img[src*="startchallenge_d.png"]`, 'all', doc);
      buttons.forEach(btn => {
        const tr = btn.closest('#arena_list tr');
        if (btn.enabled = 'challenge_d' !== btn.getAttribute('src').match(`${unsafeWindow.IMG_URL}(.*)/start(.*).png`)[2]) {
          const onclick = btn.getAttribute('onclick');
          const match = onclick.match(/init_battle\((\d+)(,\d+)*\)/);
          btn.id = site === 'gr' ? 'gr' : match[1] * 1;
        } else {
          const key = site === 'ar' ? gE('td:nth-child(3)>div>div', tr).innerText.match(`Lv. (.*)`)[1]*1 : (Array.from(tr.parentNode.children).indexOf(tr)-1);
          btn.id = idMap[site][key];
        }
        btn.cleared = site === 'gr' || gE('td:nth-child(2)>div>div', tr).innerText;
        if (option.skipUnclearedArena && site !== 'gr') {
          btn.cleared = btn.cleared !== '-';
        }
      });
      return buttons;
    }

    function loadOption(option) {
      const version = Version(option.version);

      if (!version.upto(script.scriptVersion)) { // 脚本升级时备份
        const backups = getValue('backup', true) || {};
        const autos = Object.values(backups).filter(b => b.auto && b.server === _server.name).sort((a, b) => -Version.compare(a.version, b.version));
        if (!Version(autos[0]?.version).upto(version)) backup();
      }

      // 迁移2.91.9及之前的权重背景配置
      if (option.weightBackground && Object.values(option.weightBackground).some(Array.isArray)) {
        option.weightBackground = Object.fromEntries(Object.entries(option.weightBackground).map(([k, w]) => [(k * 1 + 9) % 10, w[0]]));
      }

      // 迁移2.90.162及之前的targetHp等到targetHpDecimal等
      if (!version.upto(2, 90, 162)) {
        option = JSON.parse(JSON.stringify(option).replace('targetHp', 'targetHpDecimal').replace('targetMp', 'targetMpDecimal').replace('targetSp', 'targetSpDecimal').replace('DecimalDecimal', 'Decimal'));
        option.version = script.scriptVersion.ver;
        g.version = option.version;
      }
      option = JSON.parse(JSON.stringify(option).replace('DecimalDecimal', 'Decimal'));

      // 迁移2.90.168及之前的channelSkill2Order_Cure的Name错误
      option.channelSkill2Order_Cure = option.channelSkill2Order_Cu;
      delete option.channelSkill2Order_Cu;
      option.channelSkill2OrderName = option.channelSkill2OrderName?.replace('Cu', 'Cure').replace('Curere', 'Cure');
      // 迁移2.90.178及之前的debuff警报设置
      if (option.debuffSkillTurnAlert === true) {
        option.debuffSkillTurnAlert = 1;
      }

      const legacies = { // current <= legacy
        'debuffSkillImAll': 'debuffSkillAllIm',
        'debuffSkillWeAll': 'debuffSkillAllWk',
        'debuffSkillAllImCondition': 'debuffSkillImpCondition',
        'debuffSkillAllWeCondition': 'debuffSkillWkCondition',
        'debuffSkillImAllCondition': 'debuffSkillAllImCondition',
        'debuffSkillWeAllCondition': 'debuffSkillAllWeCondition',
        'battleUnresponsive_Alert': 'delayAlert',
        'battleUnresponsive_Reload': 'delayReload',
        'battleUnresponsive_Alt': 'delayAlt',
        'battleUnresponsiveTime_Alert': 'delayAlertTime',
        'battleUnresponsiveTime_Reload': 'delayReloadTime',
        'battleUnresponsiveTime_Alt': 'delayAltTime',
      }
      for (let key in legacies) {
        const array = key.split('_');
        const legacy = legacies[key];
        const data = option[legacy];
        if (!data) continue;
        if (array.length === 1) {
          option[key] ??= data;
        } else {
          (option[array[0]] ??= {})[array[1]] ??= data;
        }
        delete option[legacy];
      }
      // 迁移旧版本最后的慈悲条件为可配置条件
      const mercifulBlowCondition = option.skillT3Condition ?? { "0": [] };
      const size = Object.keys(mercifulBlowCondition).length;
      if (option.mercifulBlowStrict) {
        option.mercifulBlow = false;
        option.mercifulBlowStrict = false;
        for (let id in mercifulBlowCondition) {
          const condition = mercifulBlowCondition[id];
          condition.push("fightingStyle,5,2");
          condition.push("targetHp,2,0.25");
          condition.push("_targetBuffTurn_bleed,1,0");
        }
      } else if (option.mercifulBlow) {
        option.mercifulBlow = false;
        const newCondition = {};
        for (let id in mercifulBlowCondition) {
          const condition = mercifulBlowCondition[id];
          newCondition[id] = condition;
          newCondition[(id * 1 + size).toString()] = [...condition];
          newCondition[(id * 1 + size).toString()].push("fightingStyle,6,2");
          condition.push("fightingStyle,5,2");
          condition.push("_targetHp,2,0.25");
          condition.push("_targetBuffTurn_bleed,1,0");
        }
        option.skillT3Condition = newCondition;
      }
      return option;
    }

    function setPauseUI(parent) {
      setPauseButton(parent);
      setPauseHotkey();
      setStepInButton(parent);
      setStepInHotkey();
      setAltButton(parent);
      setAltHotkey();
    }

    function setPauseButton(parent) {
      const option = g.option;
      if (!option.pauseButton) {
        return;
      }
      const button = parent.appendChild(cE('button'));
      button.innerHTML = UI.button.pause(option);
      if (getPause()) { // 如果禁用
        runtime.document.title = titlePause();
        button.innerHTML = UI.button.continue(option);
      }
      button.className = 'pauseChange';
      button.onclick = pauseChange;
    }

    function setPauseHotkey() {
      const option = g.option;
      if (!option.pauseHotkey) {
        return;
      }
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName.toUpperCase() === 'INPUT' || e.target.tagName.toUpperCase() === 'TEXTAREA') {
          return;
        }
        if (e.keyCode === option.pauseHotkeyCode) {
          pauseChange();
        }
      }, false);
    }

    function setStepInButton(parent) {
      const option = g.option;
      if (!option.stepInButton) {
        return;
      }
      const button = parent.appendChild(cE('button'));
      button.innerHTML = UI.button.stepIn(option);
      button.className = 'stepIn';
      button.onclick = stepIn;
    }

    function setStepInHotkey() {
      const option = g.option;
      if (!option.stepInHotkey) {
        return;
      }
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName.toUpperCase() === 'INPUT' || e.target.tagName.toUpperCase() === 'TEXTAREA') {
          return;
        }
        if (e.keyCode === option.stepInHotkeyCode) {
          stepIn();
        }
      }, false);
    }

    function setAltButton(parent) {
      const option = g.option;
      if (!option.altButton) {
        return;
      }
      const button = parent.appendChild(cE('button'));
      button.innerHTML = (window.location.host.includes('alt') ? `<span>ExitAlt</span>` : `<span>ToAlt</span>`) + `${(option.altHotkey && option.altHotkeyStr) ? `(${option.altHotkeyStr})` : '' }`;
      button.className = 'gotoAlt';
      button.onclick = () => gotoAlt();
    }

    function setAltHotkey() {
      const option = g.option;
      if (!option.altHotkey) {
        return;
      }
      document.addEventListener('keydown', (e) => {
        if (e.target.tagName.toUpperCase() === 'INPUT' || e.target.tagName.toUpperCase() === 'TEXTAREA') {
          return;
        }
        if (e.keyCode === option.altHotkeyCode) {
          gotoAlt();
        }
      }, false);
    }

    function getKeys(objArr, prop) {
      let out = [];
      objArr.forEach((_objArr) => {
        out = !_objArr ? out :(prop && _objArr[prop]) ? out.concat(Object.keys(_objArr[prop])) : out.concat(Object.keys(_objArr));
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
        return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
      } if (e === 3) {
        return date.toLocaleString(navigator.language, {
          hour12: false,
        });
      }
    }

    function setLocal(key, value, isLocalStroage) {
      let storedStr;
      if (isLocalStroage) {
        storedStr = window.localStorage[`hvAA-${key}`];
      } else {
        storedStr = JSON.stringify(getLocal(key, isLocalStroage)); // GM 自动读取为object，对比时需要重新stringify
      }
      const newStr = (typeof value === 'string') ? value : JSON.stringify(value);
      if (storedStr === newStr) return;
      if (typeof GM_setValue === 'undefined' || isLocalStroage) {
        window.localStorage[`hvAA-${key}`] = newStr;
      } else {
        GM_setValue(key, value); // GM 写入前会自动stringify
      }
    }

    function setValue(key, value, portable) { // 储存数据
      const isLocalStorage = dataFlags.local.includes(key) && !portable;
      if (!dataFlags.standalone.includes(key)) {
        setLocal(key, value, isLocalStorage);
        return value;
      }
      setLocal(`${_server.name}_${key}`, value, isLocalStorage);
      if (dataFlags.sharable.includes(key) && !getValue('option').optionStandalone) {
        setLocal(`${_server.other}_${key}`, value, isLocalStorage);
      }
      return value;
    }

    // 读取 GM 存储，并规范化到当前 realm。
    // 脚本中所有 GM_getValue 调用都应经过此函数。
    function getRealmNormalizedGMValue(key) {
      const v = GM_getValue(key);
      if (v === null || typeof v !== 'object' || v instanceof Object) return v;
      try { return JSON.parse(JSON.stringify(v)); }
      catch { return v; }
    }

    function getLocal(key, isLocalStorage) {
      let value, gmValue;
      isLocalStorage ||= typeof GM_getValue === 'undefined';
      if (isLocalStorage || ((gmValue = getRealmNormalizedGMValue(key)) === undefined)) {
        key = `hvAA-${key}`;
        return window.localStorage[key];
      }
      if (!isLocalStorage) return gmValue;
      key = `hvAA-${key}`;
      if ((value = window.localStorage[key]) === undefined) return getRealmNormalizedGMValue(key);
      return value;
    }

    function JSONParse(object) {
      if (typeof object !== 'string' || object === '') {
        return object;
      }
      return JSON.parse(object)
    }

    function getValue(key, toJSON) { // 读取数据
      const isLocalStorage = dataFlags.local.includes(key);
      let standalone, otherWorldItem, otherLoaded;
      if (!dataFlags.standalone.includes(key)) {
        standalone = getLocal(key, isLocalStorage);
        return toJSON ? JSONParse(standalone) : standalone;
      }
      let thisWorldItem = getLocal(`${_server.name}_${key}`, isLocalStorage);
      if (!thisWorldItem) {
        standalone = getLocal(key, isLocalStorage);
        if (!standalone && dataFlags.sharable.includes(key)) {
          otherWorldItem = getLocal(`${_server.other}_${key}`, isLocalStorage);
          otherLoaded = true;
          standalone = otherWorldItem !== undefined ? copy(otherWorldItem) : undefined;
        }
        if (!standalone) return null; // 若都没有该数据
        setLocal(`${_server.name}_${key}`, thisWorldItem = standalone);
        delLocal(key, isLocalStorage);
      }
      if (Object.keys(dataFlags.excludeStandalone).includes(key)) {
        if (!otherWorldItem) {
          if (!otherLoaded) otherWorldItem = getLocal(`${_server.other}_${key}`, isLocalStorage);
          otherWorldItem ??= thisWorldItem ?? {};
        }
        for (let i of dataFlags.excludeStandalone[key]) {
          otherWorldItem[i] = thisWorldItem[i];
        }
        setLocal(`${_server.other}_${key}`, otherWorldItem);
      }
      return toJSON ? JSONParse(thisWorldItem) : thisWorldItem;
    }

    function delLocal(key, isLocalStorage) {
      if (typeof GM_deleteValue === 'undefined') {
        window.localStorage.removeItem(`hvAA-${key}`);
        return;
      }
      if (isLocalStorage) {
        window.localStorage.removeItem(`hvAA-${key}`);
      }
      GM_deleteValue(key);
    }

    function delValue(key, portable) { // 删除数据
      const isLocalStorage = portable ? false : dataFlags.local.includes(key);
      if (dataFlags.standalone.includes(key)) {
        key = `${_server.name}_${key}`;
      }
      if (typeof key === 'string') {
        delLocal(key, isLocalStorage);
        return;
      }
      if (typeof key !== 'number') {
        return;
      }
      const itemMap = {
        1: ['battle', 'battleCode'],
      }
      for (let item of itemMap[key]) {
        delValue(item, portable);
      }
    }

    function objSort(obj) { // 对象排序
      const objNew = {};
      const arr = Object.keys(obj).sort();
      arr.forEach((key) => {
        objNew[key] = obj[key];
      });
      return objNew;
    }

    function addStyle() { // CSS
      if (!gE('.hvAA-LangStyle')) {
        const langStyle = gE('head').appendChild(cE('style'));
        langStyle.className = 'hvAA-LangStyle';
        langStyle.textContent = `l${lang}{display:inline!important;}`;
        if (/^[01]$/.test(lang)) {
          langStyle.textContent = `${langStyle.textContent}l01{display:inline!important;}`;
        }
      }
      const globalStyle = gE('head').appendChild(cE('style'));
      const cssContent = [
        // hvAA
        'l0, l1, l01, l2 {display:none;}', // l0: 简体 l1: 繁体 l01:简繁体共用 l2: 英文
        '#hvAABox2{position:absolute;left:1075px;padding-top: 6px;}',
        '.hvAALog{font-size:20px;}',
        '.hvAAPauseUI{top:30px;left:1246px;position:absolute;z-index:9999; width:80px}',
        '.hvAAButton{top:5px;left:' + ((flags.maintain || flags.equip)?'0':'1255') + 'px;position:absolute;z-index:9999;cursor:pointer;width:40px;height:24px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADi0lEQVRIiZVWPYgUZxj+dvGEk7vsNdPYCMul2J15n+d991PIMkWmOEyMyRW2FoJIUojYp5ADFbZJkyISY3EqKGpgz+Ma4bqrUojICaIsKGIXSSJcsZuD3RT3zWZucquXDwYG5n2f9/d5vnFuHwfAZySfAXgN4DXJzTiOj+3H90OnkmXZAe/9FMm3JJ8AuBGepyRfle2yLDvgnKt8EDVJkq8B3DGzjve+1m63p0n2AVzJbUh2SG455yre+5qZ/aCq983sxMfATwHYJvlCVYckHwFYVdURgO8LAS6RHJJcM7N1VR0CeE5yAGBxT3AR+QrA3wA20tQOq+pFkgOS90Tk85J51Xs9qaorqjoAcC6KohmSGyQHcRx/kbdv7AHgDskXaWqH0zSddc5Voyia2SOXapqmswsLvpam6ez8/Pwn+YcoimYAvARw04XZ5N8qZtZR1aGqXnTOVSd0cRd42U5EzqvqSFWX2u32tPd+yjnnXNiCGslHJAf7ybwM7r2vAdgWkYdZls157w+NK/DeT7Xb7WkAqyTvlZHjOD5oxgtmtqrKLsmze1VJsquqKwsLO9vnnKvkJHpLsq+qo/JAd8BtneTvqvqTiPwoIu9EZKUUpGpmi2Y2UtU+yTdJkhx1JJ8FEl0pruK/TrwA4F2r1WrkgI1G4wjJP0XkdLF9WaZzZnZZVa8GMj5xgf43JvXczFZbLb1ebgnJn0nenjQbEVkG0JsUYOykyi6Aa+XoQTJuTRr8OADJzVBOh+SlckYkz5L8Q0TquXOj0fhURN6r6pkSeAXAUsDaJPnYxXF8jOQrklskh97ryZJTVURWAPwF4DqAX0TkvRl/zTKdK2aeJMnxICFbAHrNZtOKVVdIrrVa2t1jz6sicprkbQC3VPVMGTzMpQvgQY63i8lBFddVdVCk/6TZlMFzopFci+P44H+YHCR3CODc/wUvDPY7ksMg9buZrKr3ATwvyoT3vrafzPP3er1eA9Azs7tjJhcqOBHkeSOKohkROR9K7prZYqnnlSRJjofhb4vIt/V6vUbyN1Xtt1qtb1zpZqs45xyAxXAnvCQ5FJGHqrpiZiMzu5xnHlZxCOABybXw3gvgp/Zq3/gA+BLATVVdyrJsbods2lfVq7lN4crMtapjZndD5pPBixWFLTgU7uQ3AJ6KyLKILAdy9sp25bZMBC//JSRJcjQIYg9Aj+TjZrNp+/mb+Ad711sdZZ1k/QAAAABJRU5ErkJggg==) center no-repeat transparent;}',
        '#hvAABox{left:0;top:50px;font-size:16px!important;z-index:4;width:1238px;height:650px;position:absolute;text-align:left;background-color:#E3E0D1;border:1px solid #000;border-radius:10px;font-family:"Microsoft Yahei";}',
        '#hvAABox a {display: unset!important;}',
        '.hvAATab {display: none;}',
        '.hvAATablist{position:relative;left:14px;width:calc(100% - 55px);height:calc(100% - 85px);}',
        '.hvAATabmenu{position:absolute;left:-9px;}',
        '.hvAATabmenu>span{display:block;padding:5px 10px;margin:0 10px 0 0;border:1px solid #91a7b4;border-radius:5px;background-color:#E3F1F8;color:#000;text-decoration:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;cursor:pointer;}',
        '.hvAATabmenu>span:hover{left:-5px;position:relative;color:#0000FF;z-index:2!important;}',
        '.hvAATabmenu>span>input{margin:0 0 0 -8px;}',
        '.hvAATab{position:absolute;width:calc(100% - 10px);height:calc(100% - 30px);left:36px;padding:5px;border:1px solid #91A7B4;border-radius:3px;box-shadow:0 2px 3px rgba(0, 0, 0, 0.1);color:#666;background-color:#EDEBDF;overflow:auto;}',
        '.hvAATab>div:nth-child(2n){border:1px solid #EAEAEA;background-color:#FAFAFA;}',
        '.hvAATab>div:nth-child(2n+1){border:1px solid #808080;background-color:#DADADA;}',
        '.hvAATab a{margin:0 2px;}',
        '.hvAATab b{font-family:Georgia,Serif;font-size:larger;}',
        '.hvAATab input.hvAANumber{text-align:center;}',
        'input[type=\'checkbox\'] { width: 16px; height: 16px; margin: 0 2px; position: relative; top: 0; vertical-align: middle; }',
        '.hvAATab ul,.hvAATab ol{margin:0;}',
        '.hvAATab label{cursor:pointer;}',
        '.hvAATab table{border:2px solid #000;border-collapse:collapse;}',
        '.hvAATh>*{font-weight:bold;font-size:larger;}',
        '.hvAATab table>tbody>tr>*{border:1px solid #000;}',
        '#hvAATab-Drop tr>td:nth-child(1),#hvAATab-Usage tr>td:nth-child(1){text-align:left;}',
        '#hvAATab-Drop td,#hvAATab-Usage td{text-align:right;white-space:nowrap;}',
        '.selectTable{cursor:pointer;}',
        `.selectTable:before{content:"${String.fromCharCode(0x22A0.toString(10))}";}`,
        '.hvAACenter{text-align:center;}',
        '.hvAATitle{font-weight:bolder;}',
        '.hvAAGoto{cursor:pointer;text-decoration:underline;}',
        'input[type="text"], input[type="number"]{min-width:2ch;max-width:calc( 100% - 10px);text-overflow:ellipsis; width: 2ch;}',
        '.customizeInput{min-width:6ch;}',
        '.customizeInput:not(.optionDefault){border: 2px solid!important}',
        '.optionUnsaved{color:red;}',
        '.optionEdited{color:#5C0D11;}',
        '.optionDefault{color:unset!important;}',
        '.hvAATable {display: grid;width: fit-content;}',
        '.hvAATable>* {border: 1px solid;}',
        '.hvAANew{width:25px;height:25px;float:left;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAMCAYAAACX8hZLAAAAcElEQVQ4jbVRSQ4AIQjz/59mTiZIF3twmnCwFAq4FkeFXM+5vCzohYxjPMtfxS8CN6iqQ7TfE0wrODxVbzJNgoaTo4CmbBO1ZWICouQ0DHaL259MEzaU+w8pZOdSjcUgaPJDHCbO0A2kuAiuwPGQ+wBms12x8HExTwAAAABJRU5ErkJggg==) center no-repeat transparent;}',
        '#hvAATab-Alarm input[type="text"]{width:512px;}',
        '.testAlarms>div{border:2px solid #000;}',
        '.hvAAcheckItems{display:grid; grid-template-columns:repeat(5, 1fr)}',
        '.hvAAcheckItems>input.hvAANumber{width:32px}',
        '.hvAAConfig{width:100%;height:16px;}',
        '.hvAAButtonBox{position:relative;top:0px;}',
        '.hvAAPauseUI>.encounterUI{font-weight:bold;position:unset;font-size:10pt;text-decoration:none;}',
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
        '.answerBar{000;width:710px;height:40px;position:absolute;top:55px;left:282px;display:table;border-spacing:5px;}',
        '.answerBar>div{border:4px solid red;display:table-cell;cursor:pointer;}',
        '.answerBar>div:hover{background:rgba(63,207,208,0.20);}',
        '#hvAAInspectBox{background-color:#EDEBDF;position:absolute;z-index:9;border: 2px solid #5C0D11;font-size:16px;font-weight:bold;padding:3px;display:none;}',
        // 全局
        'button{border-radius:3px;border:2px solid #808080;cursor:pointer;margin:0 1px;}',
        // hv
        '#riddleform>div:nth-child(3)>img{width:700px;}',
        '#battle_right{overflow:visible;}',
        '#pane_log{height:403px;}',
        '.tlbQRA{text-align:left;font-weight:bold;}', // 标记已检测的日志行
        '.tlbWARN{text-align:left;font-weight:bold;color:red;font-size:20pt;}', // 标记检测出异常的日志行
      ].join('');
      globalStyle.textContent = cssContent;
      optionBox();
      optionButton();
    }

    function optionButton() { // 配置按钮
      if (gE('.hvAAButton')) return;
      const optionButton = gE('body').appendChild(cE('div'));
      optionButton.className = 'hvAAButton';
      optionButton.onclick = function () {
        gE('#hvAABox').style.display = (gE('#hvAABox').style.display === 'none') ? 'block' : 'none';
      };
    }

    function rmListItem(code) { // 同步删除界面显示对应的项
      const configs = gE('#hvAATab-Tools > * > ul[class="hvAABackupList"] > li', 'all');
      for (const config of configs) {
        if (config.textContent === code) config.remove();
      }
    }

    function backup(code, alert) {
      const currentOption = getValue('option');
      const auto = code ? undefined : `[auto backup for ${_server.name}@${currentOption.version}] ${time(3)}`;
      const backups = getWithStringfied('backup', true, {});
      code ??= auto;
      if (code in backups.data) { // 覆写同名配置
        if (!alert || UI.confirm(alert)) {
          delete backups.data[code];
          rmListItem(code);
        } else return;
      }
      backups.data[code] = currentOption;
      backups.data[code].auto = auto ? time(0) : undefined;
      backups.data[code].server = _server.name;
      const autos = Object.keys(backups.data).filter(c => backups.data[c].auto);
      autos.sortBy(a => -backups.data[a].auto);
      let i = 0, max = 5;
      for (const a of autos) {
        if (backups.data[a].server !== _server.name) continue;
        i++;
        if (i <= max) continue;
        delete backups.data[a];
      }
      setIfChanged('backup', backups);
      if (!gE('#hvAABox')) return;
      const li = gE('.hvAABackupList', gE('#hvAABox')).appendChild(cE('li'));
      li.textContent = code;
    }

    function appendInput(container, value, innerHTML) {
      const item = cE('div');
      item.innerHTML = innerHTML;
      container.appendChild(item);
      const input = gE('input', item);
      switch(input.type) {
        case 'number':
          input.value = value;
          customizeInputAutoFit(input);
          break;
        case 'checkbox':
          input.checked = value;
          displayCheckBoxNotDefault(input);
          input.addEventListener('change', () => displayCheckBoxNotDefault(input));
          break;
        default:
          break;
      }
    }

    function appendSelection(container, name, value, list, map, inheritBy) {
      const autoSwitchOptionText = {
        inherit: UI.byLang('继承', '繼承', 'Inherit'),
        keep: UI.byLang('不自动切换', '不自動切換', 'Disable auto switch')
      }
      const defaultNote = UI.byLang('(默认)', '(默認)', '(Default)');
      const currentOptionText = UI.byLang('(当前)', '(當前)', '(current)');
      const selection = cE('div');
      let innerHTML = [];

      innerHTML.push(`<div><select name="${name}">`);
      if (inheritBy !== undefined) {
        innerHTML.push(`<option value="undefined">${autoSwitchOptionText.inherit} ${inheritBy}${defaultNote}</option>`);
        innerHTML.push(`<option value="-1">${autoSwitchOptionText.keep}</option>`);
      } else {
        innerHTML.push(`<option value="undefined">${autoSwitchOptionText.keep}${defaultNote}</option>`);
      }
      for (const id in list) {
        const mapped = map(id, list);
        innerHTML.push(`<option value="${id}">${mapped.name}${mapped.selected ? currentOptionText : ''}</option>`);
      }
      innerHTML.push(`</select></div>`);
      selection.innerHTML = innerHTML;
      container.appendChild(selection);
      const select = gE('select', selection);
      select.value = value;
      selectFit(select);
      return select;
    }

    function setEquipSetName(personaSelect, equipSetSelection, personas, equipSets) {
      if ([personas, equipSets].includes(undefined)) {
        const { e, p, s } = getValue('itemWorldDatas', true) ?? {};
        personas ??= p;
        equipSets ??= s;
      }
      let current = { persona: Object.keys(personas).find(p => personas[p].selected), equipSet: Object.keys(equipSets).find(s => equipSets[s]) };
      let setNames = JSON.parse(window.localStorage.getItem(_server.utils + '_persona') ?? '[]');
      const currentOptionText = UI.byLang('(当前)', '(當前)', '(current)');
      const names = setNames?.[current.persona];
      [...gE('option', 'all', equipSetSelection)].forEach(option => {
        const id = option.value;
        option.innerText = ['-1', 'undefined'].includes(id) ? option.innerText : `Set ${id}${(personaSelect.value === current.persona && names?.[id]?.name) ? ` (${names?.[id]?.name})` : ''}${(personaSelect.value === current.persona && current.equipSet === id) ? currentOptionText : ''}`;
      });
    }

    function bindPersonaEquipSetSelection(persona, equipSet, personas, equipSets) {
      setEquipSetName(persona, equipSet, personas, equipSets);
      equipSet.onchange = () => selectFit(equipSet);
      persona.onchange = () => {
        selectFit(persona);
        setEquipSetName(persona, equipSet, personas, equipSets);
      }
    }

    function updateEquipSetUI() {
      const container = gE('.equipSetList');
      if (!container) return;
      let innerHTML = [
        ['战斗', '戰鬥', 'Battle'],
        ['挑战人物', '挑戰人物', 'Battle Persona'],
        ['挑战套装', '挑戰套裝', 'Battle Equip Set']
      ].map(s => UI.b(UI.l(s)));
      const option = g.option;
      const { equips, personas, equipSets } = getValue('itemWorldDatas', true) ?? {};
      if (!personas || !equipSets) {
        return;
      }
      container.innerHTML = innerHTML.join('');
      const ordered = ['default', 'ba', 'gr', 'tw', 'rb', '105', '106', '107', '108', '109', '110', '111', '112', 'ar', '1', '3', '5', '8', '9', '11', '12', '13', '15', '16', '17', '19', '20', '21', '23', '24', '26', '27', '28', '29', '32', '33', '34', '35'];
      const battles = {
        'default': 'Default',
        'ba': 'BA',
        'gr': 'GF',
        'tw': 'TW',
        'rb': 'RB',
        'ar': 'AR',
        '1': 'AR1',
        '3': 'AR10',
        '5': 'AR20',
        '8': 'AR30',
        '9': 'AR40',
        '11': 'AR50',
        '12': 'AR60',
        '13': 'AR70',
        '15': 'AR80',
        '16': 'AR90',
        '17': 'AR100',
        '19': 'AR110',
        '20': 'AR120',
        '21': 'AR130',
        '23': 'AR140',
        '24': 'AR150',
        '26': 'AR165',
        '27': 'AR180',
        '28': 'AR200',
        '29': 'AR225',
        '32': 'AR250',
        '33': 'AR300',
        '34': 'AR400',
        '35': 'AR500',
        '105': 'RB50',
        '106': 'RB75A',
        '107': 'RB75B',
        '108': 'RB75C',
        '109': 'RB100',
        '110': 'RB150',
        '111': 'RB200',
        '112': 'RB250',
      };
      for (const battle of ordered) {
        const inherit = battle === 'default' ? undefined : isNaN(+battle) ? 'Default' : battle * 1 >= 105 ? 'RB' : 'AR';
        appendInput(container, option.enableEquipSet?.[battle], UI.labeled(`enableEquipSet_${battle}`, battles[battle]));
        const persona = appendSelection(container, `switchPersona_${battle}`, option.switchPersona?.[battle], personas, (id, list) => list[id], inherit);
        const equipSet = appendSelection(container, `switchEquipSet_${battle}`, option.switchEquipSet?.[battle], equipSets, (id, list) => { return { name: `Set ${id}`, selected: list[id] }; }, inherit);
        bindPersonaEquipSetSelection(persona, equipSet, personas, equipSets);
      }
    }

    function updateItemWorldListUI() {
      const container = gE('.autoItemWorldList');
      if (!container) return;
      let innerHTML = [
        ['挑战顺序', '挑戰順序', 'Order'],
        ['装备', '裝備', 'Equip'],
        ['停止等级', '停止等級', 'Stop Level'],
        ['挑战人物', '挑戰人物', 'Battle Persona'],
        ['挑战套装', '挑戰套裝', 'Battle Equip Set']
      ].map(s => UI.b(UI.l(s)));
      const option = g.option;
      const { equips, personas, equipSets } = getValue('itemWorldDatas', true) ?? {};
      if (!equips || !personas || !equipSets) {
        gE('.itemWorldCounts').innerHTML = `${equips?.filter(eqp => option.enableItemWorld?.[eqp.id]).length ?? 0}/${equips?.length ?? 0}`;
        return;
      }
      gE('.itemWorldCounts').innerHTML = `${equips.filter(eqp => option.enableItemWorld?.[eqp.id]).length}/${equips.length}`;
      container.innerHTML = innerHTML.join('');

      for (const equip of equips) {
        const eid = equip.id;
        if (equip.world >= equip.max) continue;
        appendInput(container, option.ItemWorldOrder?.[eid], UI.hidden(UI.for(`ItemWorldOrder_${eid}`, UI.l('道具界优先级 ', '道具界優先級 ', 'Item World Order ')+eid))+UI.number(`ItemWorldOrder_${eid}`));
        appendInput(container, option.enableItemWorld?.[eid], UI.labeled(`enableItemWorld_${equip.id}`, `[${eid}]${equip.name} (${equip.level}/${equip.world}/${equip.max})`));
        appendInput(container, option.levelItemWorld?.[eid], UI.hidden(UI.for(`levelItemWorld_${eid}`, UI.l('道具界等级 ', '道具界等級 ', 'Item World Level ')+eid))+UI.number(`levelItemWorld_${eid}`));
        const persona = appendSelection(container, `itemWorldPersona_${eid}`, option.itemWorldPersona?.[eid], personas, (id, list) => list[id]);
        const equipSet = appendSelection(container, `itemWorldEquipSet_${eid}`, option.itemWorldEquipSet?.[eid], equipSets, (id, list) => { return { name: '', selected: list[id] }; });
        bindPersonaEquipSetSelection(persona, equipSet, personas, equipSets);
      }
    }

    function displayCheckBoxNotDefault(input) {
      const id = input.id;
      if (!gE(`label[for="${id}"]`) || input.placeholder === undefined) {
        return;
      }
      if (!!input.checked !== !!input.placeholder) {
        gE(`label[for="${id}"]`).classList.add('optionEdited');
      } else {
        gE(`label[for="${id}"]`).classList.remove('optionEdited');
      }
    }

    async function updateItemWorldList(skipEquips, doc) {
      let local;
      const equips = !skipEquips ? await asyncUpdateEquipModifyList() : (local = getWithStringfied('itemWorldDatas', true)).data?.equips;
      const personas = await asyncUpdatePersona(doc);
      const equipSets = await asyncUpdateEquipSet(doc);
      if ((!skipEquips && !equips?.length) || !personas || !equipSets) return;
      setIfChanged('itemWorldDatas', { data: { equips, personas, equipSets }, old: local?.old });
    }

    function optionBox() { // 配置界面
      const UIDatas = {
        checkSupplyInnerExtra: [
          { id: 'IW', names: ['道具界', '道具界', 'Item World'] },
          { id: 'GF', names: ['压榨界', '壓榨界', 'Grind Fest'] },
          { id: 'TW', names: ['塔楼', '塔樓', 'The Tower'] },
        ],
        tablist: [
          { id: 'Main', names: ['主要选项', '主要選項', 'Main'] },
          { id: 'BattleStarter', names: ['战斗开启', '戰鬥開啟', 'BattleStarter'] },
          { id: 'Recovery', names: ['恢复技能', '恢復技能', 'Recovery'] },
          { id: 'Channel', names: ['引导技能', '引導技能', 'Channel Spells'], values: ['channelSkillSwitch'] },
          { id: 'Buff', names: ['BUFF 技能', 'BUFF 技能', 'BUFF Spells'], values: ['buffSkillSwitch'] },
          { id: 'Debuff', names: ['DEBUFF 技能', 'DEBUFF 技能', 'DEBUFF Spells'], values: ['debuffSkillSwitch'] },
          { id: 'Skill', names: ['其他技能', '其他技能', 'Skills'], values: ['skillSwitch'] },
          { id: 'Infusion', names: ['魔药', '魔藥', 'Infusion'], values: ['infusionSwitch'] },
          { id: 'Scroll', names: ['卷轴', '捲軸', 'Scroll'], values: ['scrollSwitch'] },
          { id: 'Alarm', names: ['警报', '警報', 'Alarm'] },
          { id: 'Rule', names: ['攻击规则', '攻擊規則', 'Attack Rule'] },
          { id: 'Drop', names: ['掉落监测', '掉落監測', 'Drops Tracking'], values: ['dropMonitor'] },
          { id: 'Usage', names: ['数据记录', '數據記錄', 'Usage Tracking'], values: ['recordUsage'] },
          { id: 'Tools', names: ['工具', '工具', 'Tools'] },
          { id: 'Feedback', names: ['反馈', '反馈', 'Feedback'] },
        ],
        repair: [
          { id: '', names: [''] },
          { id: 'GF', names: ['或 压榨界', '或 壓榨界', 'OR Grind Fest'] },
          { id: 'TW', names: ['或 塔楼', '或 塔樓', 'OR Tower'] },
          { id: 'IW', names: ['或 道具界/压榨界', '或 道具界', 'OR Item World'] },
        ],
        repairCharm: [
          { id: '', names: ['自动战斗(含压榨界/道具界)', '自動戰鬥(含壓榨界/道具界)', 'Idle Battles(including Grind Fest & Item World)'] },
          { id: 'GF', names: ['压榨界', '壓榨界', 'Grind Fest'] },
          { id: 'IW', names: ['道具界', '道具界', 'Item World'] },
          { id: 'TW', names: ['塔楼', '塔樓', 'Tower'] },
        ],
        staminaCheck: [
          { names: ['遭遇战', '遭遇戰', 'Random Encounter'], id: 'Encounter', values: [60] },
          { names: ['竞技场/浴血擂台', '競技場/浴血擂台', 'The Arena or Ring Of Blood'], id: 'Low', values: [60] },
          { names: ['道具界', '道具界', 'Item World'], id: 'ItemWorld', values: [60] },
          { names: ['压榨界', '壓榨界', 'GrindFest'], id: 'GrindFest', values: [100] },
          { names: ['塔楼', '塔樓', 'Tower'], id: 'Tower', values: [60] },
          { names: ['竞技场/浴血擂台/压榨界/道具界/塔楼(含本日自然恢复)', '競技場/浴血擂台/壓榨界/道具界/塔樓(含本日自然恢復)', 'Threshold with naturally recovers today for The Arena, Ring Of Bloog, GrindFest,  Item World and Tower'], id: 'LowWithReNat', values: [0] },
        ],
        battleUnresponsive: [
          { id: 'Alert', names: ['警报', '警報', 'alarm'] },
          { id: 'Reload', names: ['刷新页面', '刷新頁面', 'reload page'] },
          { id: 'Alt', names: ['切换主服务器与alt服务器', '切換主服務器與alt服務器', 'switch between alt.hentaiverse'] },
        ],
        battleDelay: [
          { id: 'BeforeRound', names: ['Round前延时', 'Round前延時', 'Before round'], values: [0] },
          { id: 'NewRound', names: ['继续新Round', '繼續新Round', 'New round'], values: [0] },
          { id: 'ExitBattle', names: ['战斗结束退出', '戰鬥結束退出', 'Exit battle'], values: [3] },
        ],
        battleOrder: [
          { id: 'autoCure', names: ['使用治疗', '使用治療', 'Cure'], values: ['Cure'] },
          { id: 'autoPause', names: ['自动暂停', '自動暫停', 'Auto Pause'], values: ['Pause'] },
          { id: 'autoSSDisable', names: ['关闭灵动架式', '關閉靈動架式', 'Disable Sprite'], values: ['SSDisable'] },
          { id: 'autoRecover', names: ['恢复(含治疗)', '恢復(含治療)', 'Recover(& cure)'], values: ['Rec'] },
          { id: 'useScroll', names: ['使用卷轴', '使用捲軸', 'Use Scroll</l2>'], values: ['Scroll'] },
          { id: 'useInfusions', names: ['使用魔药', '使用魔藥', 'Infusions'], values: ['Infus'] },
          { id: 'autoDefend', names: ['自动防御', '自動防禦', 'Auto Defence'], values: ['Def'] },
          { id: 'useChannelSkill', names: ['引导技能', '引導技能', 'Channel Skill'], values: ['Channel'] },
          { id: 'useBuffSkill', names: ['Buff技能', 'Buff技能', 'Buff Skills'], values: ['Buff'] },
          { id: 'useDeSkill', names: ['Debuff技能', 'Debuff技能', 'Debuff Skills</l2>'], values: ['Debuff'] },
          { id: 'autoFocus', names: ['自动集中', '自動集中', 'Focus'], values: ['Focus'] },
          { id: 'autoSS', names: ['灵动架式(开&关)', '靈動架式(開&關)', 'On & Off Sprite'], values: ['SS'] },
          { id: 'autoSkill', names: ['释放技能', '釋放技能', 'Auto Skill'], values: ['Skill'] },
          { id: 'attack', names: ['自动攻击', '自動攻擊', 'Attack'], values: ['Atk'] },
        ],
        hotkeys: [
          { id: 'pause', names: ['暂停', '暫停', 'Pause']},
          { id: 'stepIn', names: ['步进', '步進', 'Step In']},
          { id: 'alt', names: ['Alt切换', 'Alt切換', 'Alt Switch']},
        ],
        attackStatus: [
          { id: 0, names: ['物理', '物理', 'Physical'], values: ['Phys'] },
          { id: 5, names: ['圣', '聖', 'Divine'], values: ['Divi'] },
          { id: 6, names: ['暗', '暗', 'Forbidden'], values: ['Forb'] },
          { id: 1, names: ['火', '火', 'Fire'], values: ['Fire'] },
          { id: 2, names: ['冰', '冰', 'Cold'], values: ['Cold'] },
          { id: 4, names: ['风', '風', 'Wind'], values: ['Wind'] },
          { id: 3, names: ['雷', '雷', 'Elec'], values: ['Elec'] },
        ],
        battleCommons: [
          { id: 'lowSkill', names: ['低阶魔法技能', '低階魔法技能', '1st Tier Offensive Magic'], values: ['true'] },
          { id: 'middleSkill', names: ['中阶魔法技能', '中階魔法技能', '2nd Tier Offensive Magic'], values: ['true'] },
          { id: 'highSkill', names: ['高阶魔法技能', '高階魔法技能', '3rd Tier Offensive Magic'], values: ['true'] },
          { id: 'etherTap', names: ['以太之触', '以太之觸', 'Ether Tap'] },
          { id: 'turnOnSS', names: ['开启灵动架式', '開啟靈動架勢', 'Turn on Spirit Stance'] },
          { id: 'turnOffSS', names: ['关闭灵动架式', '關閉靈動架勢', 'Turn off Spirit Stance'] },
          { id: 'defend', names: ['Defend'] },
          { id: 'focus', names: ['Focus'] },
        ],
        battleBreaks: [
          { id: 'autoPause', names: ['自动暂停', '自動暫停', 'Pause'], values: ['pause'] },
          { id: 'autoFlee', names: ['自动逃跑', '自動逃跑', 'Flee'], values: ['flee'] },
          { id: 'autoSkipDefeated', names: ['战败自动退出战斗', '戰敗自動退出戰鬥', 'Exit battle when defeated.'], values: ['exit'] },
        ],
        arena: [
          { id: 1, values: [1] },
          { id: 10, values: [3] },
          { id: 20, values: [5] },
          { id: 30, values: [8] },
          { id: 40, values: [9] },
          { id: 50, values: [11] },
          { id: 60, values: [12] },
          { id: 70, values: [13] },
          { id: 80, values: [15] },
          { id: 90, values: [16] },
          { id: 100, values: [17] },
          { id: 110, values: [19] },
          { id: 120, values: [20] },
          { id: 130, values: [21] },
          { id: 140, values: [23] },
          { id: 150, values: [24] },
          { id: 165, values: [26] },
          { id: 180, values: [27] },
          { id: 200, values: [28] },
          { id: 225, values: [29] },
          { id: 250, values: [32] },
          { id: 300, values: [33] },
          { id: 400, values: [34] },
          { id: 500, values: [35] },
          { id: 'RB50', values: [105] },
          { id: 'RB75A', values: [106] },
          { id: 'RB75B', values: [107] },
          { id: 'RB75C', values: [108] },
          { id: 'RB100', values: [109] },
          { id: 'RB150', values: [110] },
          { id: 'RB200', values: [111] },
          { id: 'RB250', values: [112] },
          { id: 'IW', name: 'ItemWorld', values: ['iw'] },
          { id: 'GF', name: 'GrindFest', values: ['gr'] },
          { id: 'TW', name: 'Tower', values: ['tw'] },
        ],
        equipSlot: [
          { id: '1', names: ['主手', '主手', 'Main Hand'] },
          { id: '2', names: ['副手', '副手', 'Off Hand'] },
          { id: '13', names: ['头盔', '頭盔', 'Helmet'] },
          { id: '11', names: ['身体', '身體', 'Body'] },
          { id: '14', names: ['手部', '手部', 'Hands'] },
          { id: '12', names: ['腿部', '腿部', 'Legs'] },
          { id: '15', names: ['脚部', '腳部', 'Feet'] },
        ],
        roundType: [
          { id: 'ar', names: ['竞技场(AR)', '競技場(AR)', 'The Arena'] },
          { id: 'rb', names: ['浴血擂台(RB)', '浴血擂台(RB)', 'Ring of Blood'] },
          { id: 'gr', names: ['压榨界(GF)', '壓榨界(GF)', 'GrindFest'] },
          { id: 'iw', names: ['道具届(IW)', '道具界(IW)', 'Item World'] },
          { id: 'ba', names: ['随机遭遇(ba)', '隨機遭遇(ba)', 'Encounter'] },
          { id: 'tw', names: ['塔楼(Tw)', '塔樓(Tw)', 'The Tower'] },
        ],
        cure: [
          { id:'FC', names: ['完全治愈(FC)', '完全治愈(FC)', 'Full-Cure'], values: [313] },
          { id:'HE', names: ['生命秘药(HE)', '生命秘藥(HE)', 'Health Elixir'], values: [11199] },
          { id:'LE', names: ['最终秘药(LE)', '最終秘藥(LE)', 'Last Elixir'], values: [11501] },
          { id:'HG', names: ['生命宝石(HG)', '生命寶石(HG)', 'Health Gem'], values: [10005] },
          { id:'HP', names: ['生命药水(HP)', '生命藥水(HP)', 'Health Potion'], values: [11195] },
          { id:'Cure', names: ['治疗(Cure)', '治療(Cure)', 'Cure'], values: [311] },
          { id:'MG', names: ['魔力宝石(MG)', '魔力寶石(MG)', 'Mana Gem'], values: [10006] },
          { id:'MP', names: ['魔力药水(MP)', '魔力藥水(MP)', 'Mana Potion'], values: [11295] },
          { id:'ME', names: ['魔力秘药(ME)', '魔力秘藥(ME)', 'Mana Elixir'], values: [11299] },
          { id:'SG', names: ['灵力宝石(SG)', '靈力寶石(SG)', 'Spirit Gem'], values: [10007] },
          { id:'SP', names: ['灵力药水(SP)', '靈力藥水(SP)', 'Spirit Potion'], values: [11395] },
          { id:'SE', names: ['灵力秘药(SE)', '靈力秘藥(SE)', 'Spirit Elixir'], values: [11399] },
          { id:'Mystic', names: ['神秘宝石(Mystic)', '神秘寶石(Mystic)', 'Mystic Gem'], values: [10008] },
          { id:'CC', names: ['咖啡因糖果(CC)', '咖啡因糖果(CC)', 'Caffeinated Candy'], values: [11402] },
          { id:'ED', names: ['能量饮料(ED)', '能量飲料(ED)', 'Energy Drink'], values: [11401] },
        ],
        buff: [
          { id: 'HD', names: ['生命长效药(HD)', '生命長效藥(HD)', 'Health Draught'], values: [true] },
          { id: 'MD', names: ['魔力长效药(MD)', '魔力長效藥(MD)', 'Mana Draught'], values: [true] },
          { id: 'SD', names: ['灵力长效药(MD)', '靈力長效藥(MD)', 'Spirit Draught'], values: [true] },
          { id: 'FV', names: ['花瓶(FV)', '花瓶(FV)', 'Flower Vase'], values: [true] },
          { id: 'BG', names: ['泡泡糖(BG)', '泡泡糖(BG)', 'Bubble-Gum'], values: [true] },
          { id: 'SS', names: ['灵力盾(SS)', '靈力盾(SS)', 'Spirit Shield'], values: [false] },
          { id: 'SL', names: ['生命火花(SL)', '生命火花(SL)', 'Spark of Life'], values: [false] },
          { id: 'Pr', names: ['守护(Pr)', '守護(Pr)', 'Protection'], values: [false] },
          { id: 'Ab', names: ['吸收(Ab)', '吸收(Ab)', 'Absorb'], values: [false] },
          { id: 'SV', names: ['影纱(SV)', '影紗(SV)', 'Shadow Veil'], values: [false] },
          { id: 'Re', names: ['细胞活化(Re)', '細胞活化(Re)', 'Regen'], values: [false] },
          { id: 'Ha', names: ['疾速(Ha)', '疾速(Ha)', 'Haste'], values: [false] },
          { id: 'He', names: ['穿心(He)', '穿心(He)', 'Heartseeker'], values: [false] },
          { id: 'AF', names: ['奥术集中(AF)', '奧術集中(AF)', 'Arcane Focus'], values: [false] },
        ],
        debuff: [
          { id:'Sle', names: ['沉眠(Sl)', '沉眠(Sl)', 'Sleep'] },
          { id:'Bl', names: ['致盲(Bl)', '致盲(Bl)', 'Blind'] },
          { id:'Slo', names: ['缓慢(Slo)', '緩慢(Slo)', 'Slow'] },
          { id:'We', names: ['虚弱(We)', '虛弱(We)', 'Weaken'] },
          { id:'Si', names: ['沉默(Si)', '沉默(Si)', 'Silence'] },
          { id:'Dr', names: ['枯竭(Dr)', '枯竭(Dr)', 'Drain'] },
          { id:'Im', names: ['陷危(Im)', '陷危(Im)', 'Imperil'] },
          { id:'MN', names: ['固定(MN)', '固定(MN)', 'Immobilize(MagNet)'] },
          { id:'Co', names: ['混乱(Co)', '混亂(Co)', 'Confuse'] },
        ],
        channel: [
          { id: 'FC', names: ['完全治愈(FC)', '完全治愈(FC)', 'Full-Cure'], values: [313] },
          { id: 'Cure', names: ['治疗(Cure)', '治療(Cure)', 'Cure'], values: [311] },
          { id: 'SS', names: ['灵力盾(SS)', '靈力盾(SS)', 'Spirit Shield'], values: [423] },
          { id: 'SL', names: ['生命火花(SL)', '生命火花(SL)', 'Spark of Life'], values: [422] },
          { id: 'Pr', names: ['守护(Pr)', '守護(Pr)', 'Protection'], values: [411] },
          { id: 'Ab', names: ['吸收(Ab)', '吸收(Ab)', 'Absorb'], values: [421] },
          { id: 'SV', names: ['影纱(SV)', '影紗(SV)', 'Shadow Veil'], values: [413] },
          { id: 'Re', names: ['细胞活化(Re)', '細胞活化(Re)', 'Regen'], values: [312] },
          { id: 'Ha', names: ['疾速(Ha)', '疾速(Ha)', 'Haste'], values: [412] },
          { id: 'He', names: ['穿心(He)', '穿心(He)', 'Heartseeker'], values: [431] },
          { id: 'AF', names: ['奥术集中(AF)', '奧術集中(AF)', 'Arcane Focus'], values: [432] },
        ],
        infusion: [
          { id:'Divinity', names: ['神圣(Divinity)', '神聖(Divinity)', 'Divinity'] },
          { id:'Darkness', names: ['黑暗(Darkness)', '黑暗(Darkness)', 'Darkness'] },
          { id:'Flames', names: ['火焰(Flames)', '火焰(Flames)', 'Flames'] },
          { id:'Frost', names: ['冰冷(Frost)', '冰冷(Frost)', 'Frost'] },
          { id:'Lightning', names: ['闪电(Lightning)', '閃電(Lightning)', 'Lightning'] },
          { id:'Storms', names: ['风暴(Storms)', '風暴(Storms)', 'Storms'] },
        ],
        scroll: [
          { id:'Sw', names: ['加速卷轴(Sw)', '加速捲軸(Sw)', 'Scroll of Swiftness'] },
          { id:'Pr', names: ['守护卷轴(Pr)', '守護捲軸(Pr)', 'Scroll of Protection'] },
          { id:'Av', names: ['化身卷轴(Av)', '化身捲軸(Av)', 'Scroll of the Avatar'] },
          { id:'Ab', names: ['吸收卷轴(Ab)', '吸收捲軸(Ab)', 'Scroll of Absorption'] },
          { id:'Sh', names: ['幻影卷轴(Sh)', '幻影捲軸(Sh)', 'Scroll of Shadows'] },
          { id:'Li', names: ['生命卷轴(Li)', '生命捲軸(Li)', 'Scroll of Life'] },
          { id:'Go', names: ['众神卷轴(Go)', '眾神捲軸(Go)', 'Scroll of the Gods'] },
        ],
        weightGroup1: [
          { id:'We', names:['虚弱(We)', '虛弱(We)', 'Weaken'], values: [12] },
          { id:'Bl', names:['致盲(Bl)', '致盲(Bl)', 'Blind'], values: [10] },
          { id:'Slo', names:['缓慢(Slo)', '緩慢(Slo)', 'Slow'], values: [15] },
          { id:'Si', names:['沉默(Si)', '沉默(Si)', 'Silence'], values: [10] },
          { id:'Sle', names:['沉眠(Sl)', '沉眠(Sl)', 'Sleep'], values: [100] },
          { id:'Im', names:['陷危(Im)', '陷危(Im)', 'Imperil'], values: [-15] },
          { id:'PA', names:['破甲(PA)', '破甲(PA)', 'Penetrated Armor'], values: [-12] },
          { id:'BW', names:['流血(Bl)', '流血(Bl)', 'Bleeding Wound'], values: [-10] },
          { id:'Co', names:['混乱(Co)', '混亂(Co)', 'Confuse'], values: [300] },
          { id:'Dr', names:['枯竭(Dr)', '枯竭(Dr)', 'Drain'], values: [2] },
          { id:'ET', names:['以太窃取(ET)', '以太竊取(ET)', 'Ether Theft'], values: [2] },
          { id:'ST', names:['灵力窃取(ST)', '靈力竊取(ST)', 'Spirit Theft'], values: [2] },
          { id:'MN', names:['固定(MN)', '固定(MN)', 'Immobilize(MagNet)'], values: [7] },
          { id:'Po', names:['流动毒性(Po)', '流动毒性(Po)', 'Spreading Poison'], values: [-10] },
          { id:'Stun', names:['眩晕(St)', '眩暈(St)', 'Stunned'], values: [290] },
          { id:'CM', names:['魔力合流(CM)', '魔力合流(CM)', 'Coalesced Mana'], values: [-20] },
          { id:'BS', names:['焚燒的靈魂(BS)', '焚燒的靈魂(BS)', 'Burning Soul'], values: [0] },
          { id:'RS', names:['鮮美的靈魂(RS)', '鮮美的靈魂(RS)', 'Ripened Soul'], values: [0] },
        ],
        weightGroup2: [
          { id: 'SS', names: ['灼烧的皮肤(SS)', '燒灼的皮膚(SS)', 'Searing Skin'], values: [-14, 5] },
          { id: 'FL', names: ['冰封的肢体(FL)', '冰封的肢體(FL)', 'Freezing Limbs'], values: [-14, 5] },
          { id: 'TA', names: ['湍流的空气(TA)', '湍流的空氣(TA)', 'Turbulent Air'], values: [-14, 5] },
          { id: 'DB', names: ['深层的烧伤(DB)', '深層的燒傷(DB)', 'Deep Burns'], values: [-19, -4] },
          { id: 'BD', names: ['崩溃的防御(BD)', '崩潰的防禦(BD)', 'Breached Defense'], values: [-19, -4] },
          { id: 'BA', names: ['钝化的攻击(BA)', '鈍化的攻擊(BA)', 'Blunted Attack'], values: [-14, 5] },
        ],
        weightGroup3: [
          { id: 'Fos', names: ['姊妹们的盛怒(FoS)', '姊妹們的盛怒(FoS)', 'Fury of the Sisters'], values: [0] },
          { id: 'Lof', names: ['未来的悲叹(LoF)', '未來的悲歎(LoF)', 'Lamentations of the Future'], values: [0] },
          { id: 'SoP', names: ['昔日的凄叫(SoP)', '昔日的淒叫(SoP)', 'Screams of the Past'], values: [0] },
          { id: 'WoP', names: ['此刻的恸哭(WoP)', '此刻的慟哭(WoP)', 'Wailings of the Present'], values: [0] },
          { id: 'AW', names: ['吸收结界(AW)', '吸收結界(AW)', 'Absorbing Ward'], values: [0] },
        ],
        skill: [
          { id: 'OFC', names: ['友情小马炮（OFC）', '友情小馬砲（OFC）', 'OFC'] },
          { id: 'FRD', names: ['龙吼（FRD）', '龍吼（FRD）', 'FRD'] },
          { id: 'T3', names: ['3阶（如果有）', '3階（如果有）', 'T3(if exist)'] },
          { id: 'T2', names: ['2阶（如果有）', '2階（如果有）', 'T2(if exist)'] },
          { id: 'T1', names: ['1阶', '1階', 'T1'] },
        ],
        record1: [
          { id: 'turn', names: ['Turns'] },
          { id: 'round', names: ['Rounds'] },
          { id: 'battle', names: ['Battle'] },
          { id: 'monster', names: ['Monster'] },
          { id: 'boss', names: ['Boss'] },
          { id: 'evade', names: ['闪避', '閃避', 'Evade'] },
          { id: 'miss', names: ['未命中', '未命中', 'Miss'] },
          { id: 'focus', names: ['集中', '集中', 'Focus'] },
          { id: 'attack', names: ['攻击', '攻擊', 'Attack'] },
          { id: 'spirit', names: ['灵动架势', '靈動架勢', 'Spirit'] },
          { id: 'mp', names: ['MP 总消耗', 'MP 總消耗', 'MP Cost'] },
          { id: 'oc', names: ['OC 总消耗', 'OC 總消耗', 'OC Cost'] },
        ],
        record2: [
          { id: 'restore', names: ['回复 (总量)', '回复 (總量)', 'Restore (Amount)'] },
          { id: 'items', names: ['物品 (次数)', '物品 (次數)', 'Items (Count)'] },
          { id: 'magic', names: ['技能 (次数)', '技能 (次數)', 'Magic (Count)'] },
          { id: 'damage', names: ['伤害 (总量)', '傷害 (總量)', 'Damage (Amount)'] },
          { id: 'proficiency', names: ['熟练度 (总量)', '熟練度 (總量)', 'Proficiency (Amount)'] },
        ],
        record3: [
          { id: 'hurtavg', names: ['平均', '平均', 'Avg'] },
          { id: 'hurtcount', names: ['次数', '次數', 'Count'] },
          { id: 'hurttotal', names: ['总量', '總量', 'Total'] },
          { id: 'hurtmavg', names: ['法术平均', '法術平均', 'Magic Avg'] },
          { id: 'hurtmcount', names: ['法术次数', '法術次數', 'Magic Count'] },
          { id: 'hurtmtotal', names: ['法术总量', '法術總量', 'Magic Total'] },
          { id: 'hurtpavg', names: ['物理平均', '物理平均', 'Physical Avg'] },
          { id: 'hurtpcount', names: ['物理次数', '物理次數', 'Physical Count'] },
          { id: 'hurtptotal', names: ['物理总量', '物理總量', 'Physical Total'] },
        ],
        audio: [
          { id: 'Common', names: ['通用', '通用', 'Common']},
          { id: 'Pause', names: ['暂停', '暫停', 'Pause'], values: ['Common'] },
          { id: 'Flee', names: ['逃跑', '逃跑', 'Flee'], values: ['Common'] },
          { id: 'Error', names: ['错误', '錯誤', 'Error'] },
          { id: 'Defeat', names: ['失败', '失敗', 'Defeat'] },
          { id: 'Exit', names: ['失败自动退出', '失敗自動退出', 'Defeat Auto Exit'] },
          { id: 'Riddle', names: ['答题', '答題', 'Riddle'] },
          { id: 'Victory', names: ['胜利', '勝利', 'Victory'] },
        ],
      };

      let option = g.option;
      let optionBox = gE('#hvAABox');
      if (!optionBox) {
        optionBox = gE('body').appendChild(cE('div'));
        optionBox.id = 'hvAABox';
        optionBox.innerHTML = [
          UI.div({
            args: { class: 'hvAACenter' },
            inner: [
              `<a href="https://github.com/dodying/UserJs/commits/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js" target="_blank">${UI.l('更新历史', '更新歷史', 'ChangeLog')}</a>`,
              '<l01><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md" target="_blank">使用说明</a></l01><l2><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README_en.md" target="_blank">README</a></l2>',
              '<span style="font-size:small;"><a target="_blank" href="https://greasyfork.org/forum/profile/18194/Koko191" title="Thanks to Koko191 who give help in the translation">by Koko191</a></span>',
              '<h1 style="display:inline;">hvAutoAttack</h1>',
              '<select name="lang"><option value="0">简体中文</option><option value="1">繁體中文</option><option value="2">English</option></select>',
              (option.optionStandalone ? _server.isekai ? UI.l('当前为异世界单独配置', '當前為異世界單獨配置', 'Using Isekai standalone option') : UI.l('当前为恒定世界单独配置', '當前為恆定世界單獨配置', 'Using Persistent standalone option') : ''),
              UI.l('配置版本', '配置版本', 'Option Version'),
              UI.text('version', 'disabled="true"')
            ]
          }),
          UI.div({
            args: { class: 'hvAATablist' },
            inner: [
              UI.div({
                args: { class: 'hvAATabmenu' },
                inner: UI.expendData(UIDatas.tablist, (id, names, v) => `<span name="${id}">${v ? `<input id="${v}" type="checkbox">${UI.hidden(UI.for(v, names))}` : ''}${names}</span>`),
              }),
              UI.hvAATab(
                'Main',
                UI.div(
                  UI.b(UI.l('异世界相关', '異世界相關', 'Isekai')),
                  ': ',
                  `${UI.labeled(`optionStandalone`, UI.l('两个世界使用不同的配置', '兩個世界使用不同的配置', 'Use standalone options.'))}`,
                  '<br>',
                  `${UI.labeled(`isekai`, `${UI.l('自动切换恒定世界和异世界', '自動切換恆定世界和異世界', 'auto switch between Isekai and Persistent')}`)}`,
                  '<br>',
                  UI.div({
                    args: { class: 'isekaiInner' },
                    inner: [
                      `${UI.l('闲置达到', '閒置達到', 'While idled for ')}${UI.number('isekaiTime')}${UI.l('秒后切换', '秒後切換', ' (s), switch between isekai and persistent')}${UI.hidden(UI.for('isekaiTime', UI.l('异世界切换时间', '異世界切換時間', 'Isekai Switch Wait')))}`,
                      `<span class="isekaiSwitchRemain"></span>`,
                      '<br>',
                      '<a class="hvAAGoto" name="hvAATab-BattleStarter">',
                      UI.l('距离开始计算闲置 ', '距離開始計算閒置', 'Time before recording idle '),
                      ' <span class="onIdleRemain"></span></a>',
                      '<br>',
                      `${UI.for('isekaiCD', UI.l('自动切换冷却时间', '自動切換冷卻時間', 'Cool down for auto switch'))}: ${UI.number('isekaiCD')}${UI.l('秒. 两个世界分别计算冷却', '秒. 兩個世界分別計算冷卻', ' (s). Isekai and Persistent cooldown separately')}. <span class="isekaiCDRemain"></span>`
                    ],
                  }),
                ),
                UI.div(
                  UI.b(UI.l('小马答题', '小馬答題', 'RIDDLE')),
                  ': ',
                  UI.labeled(`riddlePopup`, `${UI.l('弹窗答题', '弹窗答题', 'POPUP a window to answer')}`),
                  `${UI.l('(Firefox中可能导致报错)', '(Firefox中可能導致報錯)', '(Might cause in Firefox)')}; `,
                  UI.button.class('testPopup', UI.l('预处理', '預處理', 'Pretreat')),
                  UI.hidden(UI.for(`riddleAnswerTime`, UI.l('随机答题时间', '隨機答題時間', 'Random Riddle Time'))),
                  UI.hidden(UI.for(`riddleAnswerChoose`, UI.l('随机答题数量', '隨機答題數量', 'Random Riddle Count'))),
                  UI.div(
                    `${UI.l('时间', '時間', 'If ETR')} ≤ ${UI.number('riddleAnswerTime', 3)}${UI.l('秒，提交当前选中答案 或 为空时随机选中', '秒，提交當前選中答案 或 為空時隨機選中', 's submit chosen answers or random ')} ${UI.number('riddleAnswerChoose')}${UI.l(
                      '个答案并提交<br><a target="_blank" style="color:red;" href="https://ehwiki.org/wiki/RiddleMaster/Chinese#.E6.AD.A3.E7.A2.BA.E6.88.96.E9.8C.AF.E8.AA.A4">注意：错选小马比漏选小马的错误计数更多 - 所以有疑问时，最好不要猜测，留空就好</a>',
                      '个答案並提交<br><a target="_blank" style="color:red;" href="https://ehwiki.org/wiki/RiddleMaster/Chinese#.E6.AD.A3.E7.A2.BA.E6.88.96.E9.8C.AF.E8.AA.A4">注意：錯選小馬比漏選小馬的錯誤計數更多 - 所以有疑問時，最好不要猜測，留空就好</a>',
                      'answers if none is chosen.<br><a target="_blank" style="color:red;" href="https://ehwiki.org/wiki/RiddleMaster#Correct_or_Incorrect">Notice: Selecting a pony that is not in the picture will count more severe towards a penalty than missing one pony - so when in doubt, best not to guess but leave one blank</a>'
                    )}`
                  ),
                ),
                UI.div(
                  UI.b(UI.l('脚本行为', '腳本行為', 'Script Activity')),
                  '<br>',
                  UI.labeled('waitHVMonsterDB', UI.l('等待HVMonsterDB加载', '等待HVMonsterDB加載', 'Wait until HV Monster DB loaded')), `. ${UI.for('waitHVMonsterDBTime', UI.hidden(UI.l('等待HVMonsterDB加载', '等待HVMonsterDB加載', 'Wait until HV Monster DB loaded')) + UI.l('最多', '最多', 'Max'))}: ${UI.text('waitHVMonsterDBTime')}ms`,
                  UI.expendData(UIDatas.hotkeys, (id, names, v) => UI.div(
                    `${UI.labeled(`${id}Button`, `${names}${UI.l('按钮', '按鈕', ' Button')}`)}; ${UI.labeled(`${id}Hotkey`, `${names}${UI.l('热键', '熱鍵', ' Hotkey')}${UI.text(`${id}HotkeyStr`)}`)}${UI.hidden(UI.for(`${id}HotkeyStr`, `${names}${UI.l('热键', '熱鍵', ' Hotkey')}`))}: `,
                    `${UI.number(`${id}HotkeyCode`, 'undefined', 'hidden', '', 'disabled="true"')}`)),
                  UI.div(
                    `${UI.l('警告相关', '警告相關', ' To Warn')}`,
                    ': ',
                    `${UI.labeled(`alert`, UI.l('音频警报', '音頻警報', 'Audio Alarms'))}; `,
                    `${UI.labeled(`notification`, UI.l('桌面通知', '桌面通知', 'Notifications'))}; `,
                    UI.button.class('testNotification', UI.l('预处理', '預處理', 'Pretreat')),
                    `${UI.labeled(`focusNotification`, UI.l('桌面通知时聚焦页面（需要GM_notification）', '桌面通知時聚焦頁面（需要GM_notification）', 'Focus while Notifications (Requires GM_notification)'), 'placeholder="true"')}; `,
                  ),
                  UI.div(
                    UI.l('掉落及数据记录', '掉落及數據記錄', 'Drops and Usage Tracking'),
                    ': ',
                    `${UI.labeled(`recordEach`, UI.l(
                      '单独记录每场战役（建议使用便携数据模式以避免超出浏览器的localStorage配额限制，但请注意便携数据模式可能会显著增加硬盘读写量）',
                      '單獨記錄每場戰役（建議使用便攜數據模式以避免超出瀏覽器localStorage配額限制，但請注意便攜數據模式可能會顯著增加硬盤讀寫）',
                      'Record each battle separately (It is recommended to use portable mode to prevent exceeding the localStorage quota, but note that this may significantly increase disk read/write activity.)'
                    ))}`),
                  UI.div(
                    `${UI.l('延迟', '延遲', 'Delay')}: 1. ${UI.for('delay', UI.hidden(UI.l('延迟: ', '延遲: ', 'Delay: ')) + UI.l('Buff/Debuff/其他技能', 'Buff/Debuff/其他技能', 'Skills&BUFF/DEBUFF Spells'))}: ${UI.number('delay', 200)}ms 2. ${UI.for('delay2', UI.hidden(UI.l('延迟: ', '延遲: ', 'Delay: ')) + UI.l('其他', '其他', 'Other'))}: ${UI.number('delay2', 30)}ms (`,
                    UI.l('说明: 单位毫秒，且在设定值基础上取其的50%-150%进行延迟，0表示不延迟', '說明: 單位毫秒，且在設定值基礎上取其的50%-150%進行延遲，0表示不延遲', 'Note: unit milliseconds, and based on the set value multiply 50% -150% to delay, 0 means no delay'),
                  ),
                  UI.div(UI.l('频率指示符号', '頻率指示符號', 'Frequency Signal'), ': ', UI.text('frequencySign1'), ' & ', UI.text('frequencySign2')),
                  UI.hidden(UI.for('frequencySign1', UI.l('频率指示符号 1', '頻率指示符號 1', 'Frequency Signal 1'))),
                  UI.hidden(UI.for('frequencySign2', UI.l('频率指示符号 2', '頻率指示符號 2', 'Frequency Signal 2'))),
                ),
                UI.div({
                  args: { style: 'color:red;' },
                  inner: [
                    UI.b(UI.for('attackStatus', UI.l('*默认攻击模式', '*默認攻擊模式', '*Default Attack Mode'))),
                    ': ',
                    '<select class="hvAANumber" name="attackStatus"><option value="-1"></option><option value="0">物理 / Physical</option><option value="1">火 / Fire</option><option value="2">冰 / Cold</option><option value="3">雷 / Elec</option><option value="4">风 / 風 / Wind</option><option value="5">圣 / 聖 / Divine</option><option value="6">暗 / Forbidden</option></select>']
                }),
                UI.div(
                  UI.b(UI.l('战斗执行顺序(未配置的按照下面的顺序)', '戰鬥執行順序(未配置的按照下面的順序)', 'Battal Order(Using order below as default if not configed)')),
                  ': ',
                  UI.for(`battleOrderName`, UI.l('战斗执行顺序', '戰鬥執行順序', 'Battal Order')),
                  UI.labeled('battleOrderDefaultOnly', UI.l('只使用默认顺序', '只使用默認順序', 'Default order only'), 'class="battleOrderNameInner"'),
                  UI.div({
                    args: { class: 'battleOrder battleOrderDefaultOnlyInnerReverted' },
                    inner: [
                      UI.orderValue('battleOrderName'),
                      UI.hvAATable(UI.repeat(7), '', UI.expendData(UIDatas.battleOrder, (id, names, v) => UI.div(`${UI.labeled(`battleOrder_${id}`, names, `value="${v}"`, 'class="battleOrderNameInner"')}`)))
                    ]
                  }),
                ),
                UI.div(
                  UI.b(
                    UI.for('attackStatusOrderName', UI.l('次要攻击模式顺序', '次要攻擊模式順序', 'Attack Mode Order')),
                    ...range(0, 7).map(s => UI.hidden(UI.for(`attackStatusOrder_${s}`, UI.l('次要攻击模式顺序', '次要攻擊模式順序', 'Attack Mode Order')))),
                    UI.l('(未配置的按照下面的顺序)', '(未配置的按照下面的順序)', '(Using order below as default if not configed)')
                  ),
                  ':',
                  `${UI.labeled(`attackStatusSwitchByTier`, UI.l('先尝试完所有模式的高阶魔法技能再继续中阶和低阶', '先嘗試完所有模式的高階魔法技能再繼續中階和低階', 'Try all 3rd Tier Magic for all Attack Mode then 2nd Tier and 1st Tier'))}`,
                  UI.div({
                    args: { class: 'attackStatusOrder' },
                    inner: [
                      UI.orderValue('attackStatusOrderName'),
                      UI.orderValue('attackStatusOrderValue', true),
                      UI.hvAATable(UI.repeat(7), '', UI.expendData(UIDatas.attackStatus, (id, names, v) => UI.div(`${UI.labeled(`attackStatusOrder_${id}`, names, `value="${v},${id}"`)}`))),
                    ]
                  }),
                ),
                UI.expendData(UIDatas.attackStatus.map(x => x).sortBy(x => x.id), (id, names) => UI.div(`${UI.labeled(`attackStatusSwitch_${id}`, UI.b(`${UI.l('攻击模式', '攻擊模式', 'Attack Mode')}: ${names}`))}: {{attackStatusSwitchCondition${id}}}`)),
                UI.expendData(UIDatas.battleCommons, (id, names, v) => UI.div(`${UI.labeled(id, `<b>${names}</b>`, v !== undefined ? `placeholder="${v}"` : '')}: {{${id}Condition}}`)),
                UI.expendData(UIDatas.battleBreaks, (id, names, v) => UI.div(`${UI.labeled(id, `<b>${names}</b>`)}${UI.labeled(`${v}Alarm`, UI.l('警报', '警報', 'Alert'))}: {{${v}Condition}}`)),
                UI.div(`${UI.labeled(`nativeNewRound`, UI.b(UI.l('使用原生方式进入新回合', '使用原生方式進入新回合', 'Native new round')))}`),
                UI.div(
                  UI.for('checkURLBeforeNewRound', UI.l('新回合前检查链接：', '新回合前檢查連接：', 'Check url before new round: ')),
                  UI.text('checkURLBeforeNewRound'),
                  UI.number('checkURLBeforeNewRoundRetry', 5),
                  UI.for('checkURLBeforeNewRoundRetry', UI.hidden(UI.l('新回合前检查链接：', '新回合前檢查連接：', 'Check url before new round: ')) + UI.l('秒后重试', '秒後重試', '(s) to retry'))
                ),
                UI.div(UI.hvAATable(
                  UI.repeat(4), '',
                  UI.div(UI.b(UI.l('延时', '延時', 'Wait time for'))),
                  UI.expendData(UIDatas.battleDelay, (id, names, v) => UI.div(
                    UI.for(`${id}WaitTime`, names),
                    ': ',
                    UI.number(`${id}WaitTime`, v),
                    UI.l('(秒)', '(秒)', '(s)'),
                    ' ±  0 ~',
                    UI.number(`${id}WaitTimeRandom`),
                    ' %',
                  )),
                )),
                UI.div(UI.hvAATable(
                  '1fr 1fr 1.5fr 2fr', '',
                  UI.div(UI.b(UI.l('战斗页面停留 ', '戰鬥頁面停留 ', 'If not active for '))),
                  UI.expendData(UIDatas.battleUnresponsive, (id, names, v) => UI.div(
                    UI.labeled(`battleUnresponsive_${id}`, `${UI.l('战斗页面停留 ', '戰鬥頁面停留 ', 'If not active for ')}` + UI.number(`battleUnresponsiveTime_${id}`, 1) + UI.l('秒，', '秒，', '(s), ') + names),
                    UI.hidden(UI.for(`battleUnresponsiveTime_${id}`, `${UI.l('战斗页面停留 ', '戰鬥頁面停留 ', 'If not active for ')}` + UI.l('秒，', '秒，', '(s), ') + names))
                  ))
                ))
              ),
              UI.hvAATab(
                'BattleStarter',
                UI.div(`${UI.labeled(`popup`, UI.l('进入失败时窗口内弹窗提示', '進入失敗時窗口內彈窗提示', 'In-window popup while failed start'))}`),
                UI.div(`${UI.labeled(`altBattleFirst`, UI.b(UI.l('优先使用alt进入', '優先使用alt進入', 'Use alt.hentaiverse as default while auto start.')))}`),
                UI.div(
                  UI.b(UI.l('随机遭遇战', '隨機遭遇戰', 'Random Encounter')),
                  '<br>',
                  `${UI.labeled(`encounter`, UI.l('自动遭遇', '自動遭遇', 'Auto Engage'))}`,
                  '<span class="encounterInner">',
                  UI.hidden(UI.for(`encounterWaitCD`, UI.l('自动遭遇优先等待', '自動遭遇優先等待', 'Encounter Engage Wait First'))) ,
                  `${UI.l('倒计时', '倒計時', 'Wait first while count down')} ≤ ${UI.number('encounterWaitCD')}s ${UI.l('时优先等待', '時優先等待', '.')}; `,
                  '<br>',
                  UI.hidden(UI.for(`encounterDelay`, UI.l('自动遭遇额外等待', '自動遭遇額外等待', 'Encounter Engage Extra Delay'))) ,
                  UI.l('进入前额外等待', '進入前額外等待', 'Extra delay '),UI.number('encounterDelay', 5),UI.l(' 秒，避免时间偏差导致需要等多一轮', ' 秒，避免時間偏差導致需要等多一輪', ' (s) before engage to fit potential time bias which might cause extra waiting round.'),
                  '; <span class="encounterDelayRemain"></span>',
                  '</span>',
                  '<br>',
                  UI.l('倒计时显示: ', '倒計時顯示: ', 'Count down display: '),
                  UI.labeled(`encounterQuickCheck`, UI.l('精准(影响性能); ', '精準(影響性能); ', 'Precise(might reduced performsance); ')),
                  UI.labeled(`encounterDisplay`, UI.l('不自动遭遇时显示', '不自動遭遇時顯', 'Display CountDown While Not Auto Engage')),
                ),
                UI.div(
                  UI.div(UI.labeled(`idleArena`, UI.b(UI.l('闲置竞技场: ', '閒置競技場: ', 'Idle Arena: ')))),
                  UI.hidden(UI.for(`idleArenaLevels`, `${UI.l('闲置竞技场', '閒置競技場', 'Idle Arena')}`)),
                  '<span class="idleArenaInner">',
                  '<a class="hvAAGoto" name="hvAATab-BattleStarter">',
                  UI.hidden(UI.for(`onIdleDelay`, UI.l('闲置前等待', '閒置前等待', 'Time before Idle'))),
                  UI.l('等待', '等待', 'Wait '),UI.number('onIdleDelay', 5),UI.l(' 秒后计算闲置时间', ' 秒後計算閒置時間', ' (s) before start recording idled duration.'),
                  '; <span class="onIdleRemain"></span><br>',
                  '</a> ',
                  UI.for(`idleArenaTime`, UI.l('在任意页面闲置: ', '在任意頁面閒置: ', 'Idle in any page for ')),
                  UI.number('idleArenaTime'),
                  UI.l('秒后，开始竞技场', '秒後，開始競技場', ' (s), start Arena'),
                  UI.button.class('idleArenaReset', UI.button.reset),
                  '; <span class="arenaRemain"></span><br>',
                  UI.l('进行的竞技场相对应等级', '進行的競技場相對應等級', 'The levels of the Arena you want to complete'),
                  ':  ',
                  UI.button.class('hvAAShowLevels', UI.button.details()),
                  UI.button.class('hvAALevelsClear', UI.button.clear),
                  '<br>',
                  UI.text('idleArenaLevels', 'style="width:calc(100% - 20px);" disabled="true"'),
                  UI.text('idleArenaValue', 'style="width:98%;" type="hidden" disabled="true"'),
                  UI.hidden(UI.for(`idleArenaGrTime`, `${UI.l('GF次数', 'GF次數', 'Gr Time')}`)),
                  UI.hidden(UI.for(`idleArenaTwTime`, `${UI.l('TW次数', 'TW次數', 'Tw Time')}`)),
                  UI.hidden(UI.for(`idleArenaTwMax`, `${UI.l('TW层数', 'TW層數', 'Tw Floor')}`)),
                  UI.hvAATable(UI.repeat(5)+';display:none;', 'hvAAArenaLevels', UI.expendData(UIDatas.arena, (id, names, v) => UI.hvAATable(
                    '1fr 80px;width: 100%', '',
                    UI.div({ args: 'style="border: unset"', inner: [
                      UI.labeled(`arLevel_${id}`, UIDatas.arena.find(ar => ar.id === id).name ?? id, `value="${id},${v}"`),
                      id === 'GF' ? UI.number('idleArenaGrTime', 1, 'number', `arLevel_GFInner`) : '',
                      id === 'TW' ? UI.number('idleArenaTwTime', 0, 'number', `arLevel_TWInner`)+'<br>& Floor ≤ '+UI.number('idleArenaTwMax', 0, 'number', `arLevel_TWInner`) : '',
                      UI.hidden(UI.for(`arLevel_${id}`, `${UI.l(' 竞技场顺序', ' 閒置競順序', ' Arena Order')}`)),
                    ]}),
                    UI.div({ args: 'style="border: unset"', inner: [
                      UI.labeled(`arLevelDisable_${v}`, UI.l('禁用', '禁用', 'Disable'), `class="arLevel_${id}Inner"`),
                    ]})
                  ))),
                  UI.div(`${UI.labeled(`skipUnclearedArena`, UI.l('跳过未通关过的', '跳過未通關過的', 'Skip not cleared Arena/RingOfBlood'), `placeholder="true"`)}`),
                  UI.div(`${UI.labeled(`obscureNotIdleArena`, UI.l('页面中置灰未设置且未完成的', '頁面中置灰未設置且未完成的', 'obscure not setted and not battled in Battle&gt;Arena/RingOfBlood'))}`),
                  UI.div(
                    `${UI.labeled(`idleItemWorld`, UI.b(`${UI.l('道具界列表', '道具界列表', 'Item World List')}[<span class="itemWorldCounts">0/0</span>]`), `placeholder="true"`)}`,
                    UI.button.class('updateItemWorld', UI.button.update),
                    UI.button.class('hvAAShowItemWorld', UI.button.details()),
                    UI.button.class('hvAAClearItemWorld', UI.button.clear),
                    '<br>',
                    UI.hvAATable('0.2fr 3fr 0.2fr 1fr 1fr;display:none', 'autoItemWorldList'),
                  ),
                  '</span>',
                ),
                UI.div(
                  UI.b('[S!]', UI.l('精力: 进入战斗的最低精力', '精力: 戰鬥的最低精力', 'Stamina: Minimum stamina to auto start battles')),
                  ': <br>',
                  UI.expendData(UIDatas.staminaCheck, (id, names, v) => `${UI.hidden(UI.for(`stamina${id}`, UI.l('精力: ', '精力: ', 'Stamina: ')+names))}${id === 'LowWithReNat' ? UI.b('<br>[S!!]') : ''}${names}: ${id === 'Low' ? 'Min(85, ' : ''}${UI.number(`stamina${id}`, v)}${id === 'Low' ? ')' : ''};`),
                  '<br>',
                  `${UI.labeled(`restoreStamina`, UI.l('战前恢复', '戰前恢復', 'Restore stamina'))};`,
                  `${UI.labeled(`staminaRatio`, UI.l('检查惩罚倍率', '檢查懲罰倍率', 'Check Punishment Ratio'))};`,
                  `${UI.for(`staminaCostFloorThreshold`, UI.l('精力消耗向下取整阈值', '精力消耗向下取整閾值', 'Stamina Cost Floor Threshold'))}${UI.number('staminaCostFloorThreshold', _server.isekai ? 0.06 : 0.03)}`,
                ),
                UI.div(
                  UI.labeled('repair', UI.b('[R!]', UI.l('修复装备', '修復裝備', 'Repair Equipment'))),
                  '<span class="repairInner">: ',
                  UI.expendData(UIDatas.repair, (id, names) => `${UI.for(`repairValue${id}`, `${names}${UI.l('耐久度', '耐久度', ' Durability')}`)} ≤ ${UI.number(`repairValue${id}`)}% `),
                  UI.expendData(UIDatas.repairCharm, (id, names) => `<br>${UI.labeled(`repairCharm${id}`, `${UI.l('', '', 'Repair charm before ')}${names}${UI.l('前修复护石', '前修復護石')}`)};`),
                  '<br>',
                  UI.labeled('encounterRepair', UI.l('遭遇战前检查', '遭遇戰前檢查', 'Check before encounter'), 'class="repairInner"'),
                  UI.div(UI.l('检查非空装备槽位时忽略: ', '檢查非空裝備槽位時忽略: ', 'Skip when checking unslotted equipments: ')),
                  UI.hvAATable(
                    UI.repeat(7), 'hvAAcheckItems',
                    UI.expendData(UIDatas.equipSlot, (id, names) => UI.div(UI.labeled(`equipCheckSkip_${id}`, UI.hidden(UI.l('检查非空装备槽位时忽略: ', '檢查非空裝備槽位時忽略: ', 'Skip when checking unslotted equipments: '))+names)))
                  ),
                  '</span>',
                ),
                UI.div(
                  UI.labeled(`equStorage`, UI.b('[E!]', UI.l('装备库存', '裝備庫存', 'Equipment Storage'))),
                  ' ≤ ',
                  UI.hidden(UI.for('equStorageValue', UI.l('装备库存', '裝備庫存', 'Equipment Storage'))),
                  UI.number('equStorageValue', 150, 'number', '', 'style="width: 32px;"'),
                  `; <span class="equStorageInner">${UI.labeled(`encounterEquStorage`, UI.l('遭遇战前检查', '遭遇戰前檢查', 'Check before encounter'), 'class="equStorageInner"')}</span>`),
                UI.div(
                  UI.labeled(`changeEquipSet`, UI.b(UI.l('切换套装', '切換套裝', 'Switch Equip Set'))),
                  `<span class="changeEquipSetInner">`,
                  UI.button.class('updateEquipSet', UI.button.update),
                  UI.button.class('hvAAShowEquipSet', UI.button.details()),
                  '<br>',
                  UI.hvAATable(UI.repeat(3) + ';display:none', 'equipSetList changeEquipSetInner'),
                ),
                UI.div(
                  UI.b('[C!]', UI.l('检查物品', '檢查物品', 'Check item'), ':'),
                  '<hr style="border: none; height: 2px; background: grey; width: 95%;">',
                  UI.div(
                    UI.labeled(`checkSupplySlotted`, UI.b(UI.l('检查物品是否装备', '檢查物品是否裝備', 'Check is item slotted'), ';')),
                    ...UI.getCheckSupplyOptionTable('Slotted', true),
                  ),
                  '<hr style="border: none; height: 2px; background: grey; width: 95%;">',
                  UI.div(
                    UI.labeled(`checkSupply`, UI.b(UI.l('检查物品库存', '檢查物品庫存', 'Check is item needs supply'), ';')),
                    '<span class="checkSupplyInner">',
                    UI.labeled(`encounterSupply`, UI.l('遭遇战前检查', '遭遇戰前檢查', 'Check before encounter')),
                    '<br></span>',
                    ...UI.getCheckSupplyOptionTable(),
                  ),
                  UI.expendData(UIDatas.checkSupplyInnerExtra, (id, names, v) => '<hr style="border: none; height: 1px; background: grey; width: 95%;">'+UI.checkSupplyInnerExtra(id, names)),
                ),
              ),
              UI.hvAATab(
                'Recovery',
                UI.div({
                  args: { class: 'itemOrder' },
                  inner: [
                    UI.b(UI.l('施放顺序(未配置的按照下面的顺序)', '施放順序(未配置的按照下面的順序)', 'Cast Order(Using order below as default if not configed)')),
                    ': ',
                    UI.hidden(UI.for(`itemOrderName`, UI.l('恢复技能/道具施放顺序', '恢復技能/道具施放順序', 'Cure Skill / Item Cast Order'))),
                    UI.text('itemOrderName', 'style="width:80%;"', 'disabled="true"'),
                    '<input name="itemOrderValue" style="width:80%;" type="hidden" disabled="true"><br>',
                    UI.hvAATable(UI.repeat(5), '', UI.expendData(UIDatas.cure, (id, names, v) => UI.div(UI.labeled(`itemOrder_${id}`, names, `value="${id},${v}"`, 'class="itemOrderNameInner"')))),
                  ]
                }),
                UI.expendData(UIDatas.cure, (id, names, v) => UI.div(`${UI.labeled(`item_${id}`, names)}: {{item${id}Condition}}`)),
              ),
              UI.hvAATab(
                'Channel',
                UI.div(
                  UI.l('<b>获得引导时</b>（此时1点MP施法与150%伤害）', '<b>獲得引導時</b>（此時1點MP施法與150%傷害）', '<b>During Channeling effect</b> (1 mp spell cost and 150% spell damage)</l2>'), ':'
                ),
                UI.div(
                  UI.b(
                    UI.l('超过时不释放', '超過時不釋放', 'Not cast if remain turns above'),
                    ' (',
                    UI.l('阈值 &lt; 0 则不限制', '閾值 &lt; 0 則不限制', ' Threshold &lt; 0 as unlimited'),
                  ),
                  ') : ',
                  UI.hvAATable(
                    UI.repeat(5), '',
                    UI.expendData(UIDatas.buff, (id, names, v) => v ? '' : UI.div(UI.for(`channelThreshold_${id}`, `${UI.hidden(UI.l('引导', '引導', 'Channeling'))}${names} >= `, UI.number(`channelThreshold_${id}`))))
                  ),
                ),
                UI.div(
                  UI.b(UI.l('先施放引导技能', '先施放引導技能', 'First cast')),
                  ': <br>',
                  UI.l('注意: 此处的施放顺序与', '注意: 此處的施放順序与', 'Note: The cast order here is the same as in'),
                  '<a class="hvAAGoto" name="hvAATab-Buff">',
                  UI.l('BUFF 技能', 'BUFF 技能', 'BUFF Spells'),
                  '</a>',
                  UI.l('里的相同', '裡的相同'),
                  '<br>',
                  UI.hvAATable(UI.repeat(9), '', UI.expendData(UIDatas.buff, (id, names, v) => v ? '' : UI.div(UI.labeled(`channelSkill_${id}`, UI.hidden(UI.l('先施放引导技能', '先施放引導技能', 'First cast'), ' ')+names)))),
                ),
                UI.div(
                  UI.labeled('channelSkill2', UI.b(UI.l('再使用技能', '再使用技能', 'Then use Skill'))),
                  UI.div({
                    args: { class: 'channelSkill2Order channelSkill2Inner', style:'grid-template-columns:repeat(5, 1fr);'},
                    inner: [
                      UI.for('channelSkill2OrderName', UI.hidden(UI.l('再使用技能', '再使用技能', 'Then use Skill'), ' ')+UI.l('施放顺序', '施放順序', 'Cast Order')),
                      ': ',
                      UI.text('channelSkill2OrderName', 'style="width:80%;"', 'disabled="true"'),
                      UI.hidden(UI.text('channelSkill2OrderValue', 'style="width:80%;"', 'disabled="true"')),
                      '<br>',
                      UI.div({
                        args: { class: 'hvAATable', style: 'grid-template-columns: repeat(6, 1fr);' },
                        inner: UI.expendData(UIDatas.channel, (id, names, v) => UI.div(UI.labeled(`channelSkill2Order_${id}`, UI.hidden(UI.l('再使用技能', '再使用技能', 'Then use Skill'), ' ')+names, `value="${id},${v}"`))),
                      }),
                    ]
                  }),
                ),
                UI.div(UI.labeled('channelRebuff', UI.l('<b>最后ReBuff</b>: 重新施放最先将要消失的Buff', '<b>最後ReBuff</b>: 重新施放最先將要消失的Buff', '<b>At last, re-cast the spells which will expire first</b>'))),
              ),
              UI.hvAATab(
                'Buff',
                UI.div({
                  args: { class: 'buffSkillOrder '},
                  inner: [
                    UI.l('施放顺序(未配置的按照下面的顺序)', '施放順序(未配置的按照下面的順序)', 'Cast Order(Using order below as default if not configed)</l2>'),
                    ': ',
                    UI.hidden(UI.for('buffSkillOrderValue', UI.l('Buff 施放顺序', 'Buff 施放順序', 'Buff Cast Order'))),
                    UI.text('buffSkillOrderValue', 'style="width:80%;" disabled="true"'),
                    '<br>',
                    UI.expendData(UIDatas.buff, (id, names, v) => v ? '' : UI.labeled(`buffSkillOrder_${id}`, names, 'class="buffSkillOrderValueInner"')),
                  ],
                }),
                UI.div(UI.for('buffSkillCondition', UI.l('Buff释放条件', 'Buff釋放條件', 'Cast buff spells Condition')), '{{buffSkillCondition}}'),
                UI.expendData(UIDatas.buff, (id, names, v) => UI.div(
                  UI.hidden(UI.for(`buffSkillThreshold_${id}`, `${names}${UI.l('阈值', '閾值', ' Threshold')}`)),
                  `${UI.labeled(`buffSkill_${id}`, `${names} <= ${UI.number(`buffSkillThreshold_${id}`)} (${UI.l('阈值 &lt; 0 则不限制', '閾值 &lt; 0 則不限制', ' Threshold &lt; 0 as unlimited')})`)}{{buffSkill${id}Condition}}`)),
              ),
              UI.hvAATab(
                'Debuff',
                UI.div(UI.for('debuffSkillCondition', UI.l('Debuff释放条件', 'Debuff釋放條件', 'Cast debuff spells Condition')), '{{debuffSkillCondition}}'),
                UI.div(
                  `${UI.labeled('debuffAutoFill', UI.l('补全因超过默认显示上限未显示的怪物buff', '補全因超過默認顯示上限未顯示的怪物buff', 'Auto fill hidden monster buffs due to display limitation'))}`,
                ),
                UI.div(
                  UI.for('debuffSkillTurnAlert', UI.l('超出6个debuff的默认显示上限时（例如同时使用jpx时可忽略上限）：', '超出6個debuff的默認顯示上限時（例如同時使用jpx時可忽略上限）：', 'When debuff count overflows 6 as the default maximum display count (such as ignore limitation while using jpx): ')),
                  '<select class="hvAANumber" name="debuffSkillTurnAlert"><option value="0" selected>跳过 / Skip</option><option value="1">警报 / Alert</option><option value="2">忽略 / Ignore</option></select><br>',
                  UI.l('剩余Turns低于阈值时警报', '剩餘Turns低於閾值時警報', 'Alert when remain expire turns less than threshold'),
                  '<br>',
                  UI.hvAATable(UI.repeat(9), '', UI.expendData(UIDatas.debuff, (id, names) => UI.div(
                    UI.hidden(UI.for(`debuffSkillTurn_${id}`, `${names}${UI.l('警报', '警報', 'Alert')}`)),
                    names, UI.number(`debuffSkillTurn_${id}`)
                  ))),
                ),
                UI.div({
                  args: { class: 'debuffSkillOrderAll' },
                  inner: [
                    '1. ',
                    UI.for('debuffSkillOrderAllValue', UI.l('特殊先给全体施放的顺序(未配置的按照下面的顺序)', '特殊先給全體施放的順序(未配置的按照下面的順序)', 'Cast Order for Special Debuff all enemies first(Using order below as default if not configed)')),
                    ':',
                    UI.text('debuffSkillOrderAllValue', 'style="width:80%;" disabled="true"'),
                    '<br>',
                    UI.hvAATable(UI.repeat(7) + ' 1.5fr 1fr;', '', UI.expendData(UIDatas.debuff, (id, names) => UI.div(UI.labeled(`debuffSkillOrderAll_${id}`, names, 'class="debuffSkillOrderAllValueInner"')))),
                  ]
                }),
                UI.div(
                  '1.a. <l0>特殊先给全体施放时，视作覆盖的互斥Debuff</l0><l1>特殊特殊先給全體施放時，視作覆蓋的互斥Debuff</l1><l2>Exclusive debuffs during \'Cast Order for Special Debuff all enemies first\'</l2>:',
                  UI.hvAATable(UI.repeat(7) + ' 1.5fr 1fr;', '', UI.expendData(UIDatas.debuff, (id, names) => UI.div(UI.labeled(`debuffAllExclusive_${id}`, names+UI.hidden(UI.for(`debuffAllExclusive_${id}`, UI.l('互斥', '互斥', 'Exclusive'))))))),
                ),

                '<div class="debuffSkillOrder">2. ',
                UI.for(`debuffSkillOrderValue`, UI.l('单体Debuff施放顺序(未配置的按照下面的顺序)', '單體Debuff技能施放順序(未配置的按照下面的順序)', 'Debuff for each Cast Order(Using order below as default if not configed)')),
                UI.text('debuffSkillOrderValue', 'style="width:80%;" disabled="true"'),
                '<br>',
                UI.hvAATable(UI.repeat(7) + ' 1.5fr 1fr;', '', UI.expendData(UIDatas.debuff, (id, names) => UI.div(UI.labeled(`debuffSkillOrder_${id}`, names, 'class="debuffSkillOrderValueInner"')))),
                '</div>',

                UI.div(
                  '<b><l0>特殊先给全体施放和单体施放使用共享的阈值、重复命中权重和各自独立的条件</l0><l1>特殊先給全體施放和單體施放使用共享的閾值、重複命中權重和各自獨立的條件</l1><l2>Using sharing threshold/duplicateCastWeight and standalone conditions between special cast for debuff all enemies first and cast for debuff each enemy</l2></b><br>',
                  '<l0>Buff持续时间 &lt;= 释放阈值时可释放，阈值 &lt; 0 则不限制</l0><l1>Buff持續時間 &lt;= 釋放閾值時可釋放，閾值 &lt; 0 則不限制</l1><l2>Cast available while buff remain duration &lt;= threshold, threshold &lt; 0 as unlimited</l2><br>',
                  'EWF: <l0>重复释放权重公式</l0><l1>重複釋放的權重公式</l1><l2>Excluded Weight Formula for duplicate debuff targets</l2>',
                ),
                UI.hvAATable(
                  UI.repeat(2) + ';width: 100%', '',
                  UI.expendData(UIDatas.debuff, (id, names) => [
                    UI.div(
                      UI.labeled(`debuffSkill_${id}`, names),
                      UI.hidden(UI.for(`debuffSkillThreshold_${id}`, `${names}${UI.l('阈值', '閾值', ' Threshold')}`)),
                      UI.number(`debuffSkillThreshold_${id}`),
                      '; ',
                      UI.for(`excludedWeightFormula_${id}`, `${names} EWF`),
                      ': ',
                      UI.number(`excludedWeightFormula_${id}`, 900),
                      `{{debuffSkill${id}Condition}}`
                    ),
                    UI.div(
                      UI.l('特殊 ', '特殊 ', ' Special '),
                      UI.labeled(`debuffSkill${id}All`, `${UI.l('先给全体上', '先給全體上')}${names}${UI.l('', '', ' all enemies first.')}`),
                      `<span class="debuffSkill${id}AllInner">`,
                      `${UI.labeled(`debuffSkill${id}AllByIndex`, UI.l('按照顺序而非权重', '按照順序而非權重', 'By index instead of weight'), `class="debuffSkill${id}AllInner"`)}`,
                      `</span>{{debuffSkill${id}AllCondition}}`)
                  ]),
                ),
              ),
              UI.hvAATab(
                'Skill',
                UI.div(
                  UI.labeled('skillSSOnly', UI.l('只在灵动架式状态下使用', '只在靈動架式狀態下使用', 'Only use skills under Spirit by default')+UI.hidden('其他技能', '其他技能', 'Skills'), 'placeholder="true"'),
                  '<br><span><l0>(请在<a class="hvAAGoto" name="hvAATab-Main">主要选项</a>勾选并设置<b>开启/关闭灵动架式</b>)</l0><l1>(請在<a class="hvAAGoto" name="hvAATab-Main">主要選項</a>勾選並設置<b>開啟/關閉靈動架式</b>)</l1><l2>(please check and set the <b>Turn on/off Spirit Stance</b> in <a class="hvAAGoto" name="hvAATab-Main">Main</a>)</l2></span>'
                ),

                '<div class="skillOrder"><l0>施放顺序(未配置的按照下面的顺序)</l0><l1>施放順序(未配置的按照下面的順序)</l1><l2>Cast Order(Using order below as default if not configed)</l2>: ',
                UI.hidden(UI.for(`skillOrderValue`, UI.l('技能施放顺序', '技能施放順序', 'Skill Cast Order'))),
                UI.text('skillOrderValue', 'style="width:80%;" disabled="true"'),
                '<br>',
                UI.expendData(UIDatas.skill, (id, names) => UI.labeled(`skillOrder_${id}`, UI.hidden(UI.l('技能施放顺序', '技能施放順序', 'Skill Cast Order'), ':')+names)),
                '</div>',
                UI.expendData(UIDatas.skill, (id, names) => UI.div(`${UI.labeled(`skill_${id}`, names)}: <span class="skill_${id}Inner">${UI.hidden(UI.for(`skillOTOS_${id}`, names))}${UI.labeled(`skillOTOS_${id}`, UI.l('一回合只使用一次', '一回合只使用一次', 'One round only spell one time'))}</span>{{skill${id}Condition}}`)),
              ),
              UI.hvAATab(
                'Infusion',
                UI.l('战役模式', '戰役模式', 'Battle type'), ': ',
                UI.expendData(UIDatas.roundType, (id, names) => UI.labeled(`infusionRoundType_${id}`, UI.hidden(UI.l('魔药战役模式', '魔藥戰役模式', 'Infusion Battle Type'),':')+names, 'placeholder="true"')),
                UI.div(UI.for('infusionCondition', UI.l('魔药使用条件', '魔藥使用條件', 'Infusion Use Condition')),'{{infusionCondition}}'),
                UI.div(UI.labeled('infusionDefaultOnly', '<b><l0>只使用与默认攻击模式相同的魔药</l0><l1>只使用與默認攻擊模式相同的魔藥</l1><l2>Use Infusion as same as default attack mode only.</l2></b>', 'placeholder="true"')),
                '<div class="infusionOrder"><b>',
                '<l0>施放顺序(未配置的按照下面的顺序)</l0><l1>施放順序(未配置的按照下面的順序)</l1><l2>Cast Order(Using order below as default if not configed)</l2></b>: ',
                UI.for(`infusionOrderName`, UI.l('魔药施放顺序', '魔藥技能施放順序', 'Infusion Cast Order')),
                UI.text('infusionOrderName', 'style="width:80%;" disabled="true"'),
                '<br>',
                UI.hvAATable(
                  UI.repeat(6), '',
                  UI.expendData(UIDatas.infusion, (id, names) => UI.div(UI.labeled(`infusionOrder_${id}`, UI.hidden(UI.l('魔药施放顺序', '魔藥技能施放順序', 'Infusion Cast Order'),':')+names))),
                ),
                '</div>',
                UI.expendData(UIDatas.infusion, (id, names) => UI.div(UI.labeled(`infusion_${id}`, UI.hidden(UI.l('魔药', '魔藥', 'Infusion'),':')+names), `{{infusion${id}Condition}}`)),
              ),
              UI.hvAATab(
                'Scroll',
                UI.l('战役模式', '戰役模式', 'Battle type'), ': ',
                UI.expendData(UIDatas.roundType, (id, names) => UI.labeled(`scrollRoundType_${id}`, UI.hidden(UI.l('卷轴战役模式', '捲軸戰役模式', 'Scroll Battle Type'),':')+names)),
                UI.div(UI.for('scrollCondition', UI.l('卷轴使用条件', '捲軸使用條件', 'Scroll Use Condition')),'{{scrollCondition}}'),
                UI.labeled(`scrollFirst`, UI.l('存在技能生成的Buff时，仍然使用卷轴', '存在技能生成的Buff時，仍然使用捲軸', 'Use Scrolls even when there are effects from spells')),
                UI.expendData(UIDatas.scroll, (id, names) => UI.div(UI.labeled(`scroll_${id}`, names), `{{scroll${id}Condition}}`)),
              ),
              UI.hvAATab(
                'Alarm',
                '<span class="hvAATitle">',
                UI.l('自定义警报', '自定義警報', 'Alarm'),
                '</span><br>',
                UI.l('注意：留空则使用默认音频，建议每个用户使用自定义音频', '注意：留空則使用默認音頻，建議每個用戶使用自定義音頻', 'Note: Leave the box blank to use default audio, it\'s recommended for all user to use custom audio.'),
                UI.div(UI.expendData(UIDatas.audio, (id, names, v) => UI.div(
                  UI.labeled(`audioEnable_${id}`, names+UI.hidden(UI.l('音频', '音頻', 'Audio'))),
                  ': ',
                  UI.hidden(UI.for(`audio_${id}`, names+UI.l('音频', '音頻', 'Audio'))),
                  UI.text(`audio_${id}`, `placeholder="https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/${v ?? id}.ogg"`),
                  UI.button.class('testAlarm', UI.l('测试', '測試', 'Test'))
                ))),
                UI.div(
                  UI.l('请将将要测试的音频文件的地址填入这里', '請將將要測試的音頻文件的地址填入這裡', 'Plz put in the audio file address you want to test'),
                  ': <br>',
                  '<input class="hvAADebug" name="audio_Text" type="text">'
                ),
              ),
              UI.hvAATab(
                'Rule',
                '<span class="hvAATitle">',
                UI.l('攻击规则', '攻擊規則', 'Attack Rule'),
                '</span> <l01><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md#攻击规则-示例" target="_blank">示例</a></l01><l2><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README_en.md#attack-rule-example" target="_blank">Example</a></l2>',
                UI.div(
                  '<b>1. ',
                  '<l0>初始血量权重=Log10(目标血量/场上最低血量)</l0><l1>初始血量權重=Log10(目標血量/場上最低血量)</l1><l2>BaseHpWeight = BaseHpRatio*Log10(TargetHP/MaxHPOnField)</l2></b><br>',
                  UI.for('baseHpRatio', UI.l('初始权重系数(>0:低血量优先;<0:高血量优先)', '初始權重係數(>0:低血量優先;<0:高血量優先)', 'BaseHpRatio(>0:low hp first;<0:high hp first)')),
                  UI.number('baseHpRatio'),
                  '<br>',
                  UI.for('unreachableWeight', UI.l('不可命中目标的权重公式', '不可命中目標的權重公式', 'Unreachable Target Weight Formula')),
                  '<l0>不可命中目标的权重公式</l0><l1>不可命中目標的權重公式</l1><l2>Unreachable Target Weight Formula</l2>: ',
                  UI.text('unreachableWeight', 'placeholder="1000"'),
                  '<br>',
                  UI.for('YggdrasilExtraWeight', UI.l('BOSS:Yggdrasil额外权重', 'BOSS:Yggdrasil额外权重', 'BOSS:Yggdrasil Extra Weight')),
                  '<l0>BOSS:Yggdrasil额外权重</l0><l1>BOSS:Yggdrasil额外权重</l1><l2>BOSS:Yggdrasil Extra Weight</l2></b>',
                  UI.number('YggdrasilExtraWeight', -1000),
                  '<br>',
                  UI.labeled('cacheMonsterHP', UI.l('启用HP缓存', '啟用HP緩存', 'Use HP Cache')),
                  UI.button.class('clearMonsterHPCache', UI.l('清空缓存', '清空緩存', 'Clear HP Cache')),
                  '<span class="cacheMonsterHPInner">',
                  UI.labeled('portable_monsterDB', UI.hidden(UI.l('HP缓存 ', 'HP緩存 ', 'HP Cache '))+'<l0>使用便携数据模式（导出脚本数据时将包含）</l0><l1>使用便攜數據模式（導出腳本數據時將包含）</l1><l2>Portable Mode (will be included while exporting script datas)</l2><l0>注意：便携数据模式可能会显著增加硬盘读写</l0><l1>注意：便攜數據模式可能會顯著增加硬盤讀寫</l1><l2>Notice：portable mode may significantly increase hard disk I/O</l2>'),
                  '<input id="portable_monsterMID" type="checkbox" hidden>'
                ),
                '</span>',
                UI.div(
                  UI.b(
                    '2.',
                    UI.l('初始权重与下述各Buff权重相加', '初始權重與下述各Buff權重相加', 'PW(X) = BaseHpWeight + Accumulated_Weight_of_Deprecating_Spells_In_Effect(X)')
                  ),
                  '<br>',
                  UI.hvAATable(UI.repeat(6), '', UI.expendData(UIDatas.weightGroup1, (id, names, v) => UI.div(
                    UI.hidden(UI.for(`weight_${id}`, `${names} ${UI.l('权重', '權重', ' Weight')}`)),
                    UI.number(`weight_${id}`, v),
                    names
                  ))),
                  UI.b(
                    UI.l('降抗性和攻击模式属性', '降抗性和攻擊模式屬性', 'While elements between Resistance-lower-debuff and Attack-Mode matches'),
                    `  [${UI.attackStatusType[option.attackStatus ?? 0]}] `,
                    UI.l('相同时', '相同時')
                  ),
                  ': <br>',
                  UI.hvAATable(UI.repeat(4) + ' repeat(2, 1.25fr);', '', UI.expendData(UIDatas.weightGroup2, (id, names, v) => UI.div(
                    UI.hidden(UI.for(`weight_${id}`, `${names} ${UI.l('权重 (攻击模式属性相同时)', '權重 (攻擊模式屬性相同時)', ' Weight (Attack-Mode matches)')}`)),
                    UI.number(`weight_${id}`, v),
                    names
                  ))),
                  UI.b(
                    UI.l('降抗性和攻击模式属性', '降抗性和攻擊模式屬性', 'While elements between Resistance-lower-debuff and Attack-Mode NOT matches'),
                    `  [${UI.attackStatusType[option.attackStatus ?? 0]}] `,
                    UI.l('不相同时', '不相同時'),
                  ),
                  ': <br>',
                  UI.hvAATable(UI.repeat(4) + ' repeat(2, 1.25fr);', '', UI.expendData(UIDatas.weightGroup2, (id, names, v, v2) => UI.div(
                    UI.hidden(UI.for(`weight_${id}1`, `${names} ${UI.l('权重 (攻击模式属性不相同时)', '權重 (攻擊模式屬性不相同時)', ' Weight (Attack-Mode NOT matches)')}`)),
                    UI.number(`weight_${id}1`, v2),
                    names
                  ))),
                  UI.b(UI.l('敌方增益，暂不清楚具体效果，默认按0权重计算', '敵方增益，暫不清楚具體效果，默認按0權重計算', 'Enemy Procs, Evvecf value unknown, weight default as 0 for now.')),
                  ': <br>',
                  UI.hvAATable('1fr 1.25fr 1fr 1fr 1fr', '', UI.expendData(UIDatas.weightGroup3, (id, names, v) => UI.div(
                    UI.hidden(UI.for(`weight_${id}`, `${names} ${UI.l('权重', '權重', ' Weight')}`)),
                    UI.number(`weight_${id}`, v),
                    names
                  ))),
                ),
                UI.div(
                  '<b>3. PW(X) -= Log10(1 + <l0>武器攻击中央目标伤害倍率(副手及冲击技能)</l0><l1>乘以武器攻擊中央目標傷害倍率(副手及衝擊技能)</l1><l2>Weapon Attack Central Target Damage Ratio (Offhand & Strike)</l2>)</b><br>',
                  UI.for(`centralExtraRatio`, UI.l('额外伤害比例：', '額外傷害比例：', ' Extra DMG Ratio: ')),
                  UI.number('centralExtraRatio'),
                  '%'),
                UI.div(UI.b('4. ', UI.for('extraWeightFormula', UI.l('额外权重公式', '額外權重公式', 'Extra weight formula')), ': '), UI.text('extraWeightFormula')),
                UI.div(
                  UI.b('5. ', UI.for('skillExtraWeight', UI.l('技能额外权重公式', '技能額外權重公式', 'Extra weight formula for each skill')), ': '), UI.text('skillExtraWeight'),
                  '<br>',
                  UI.l('公式中可用的技能参数（包括条件判定）', '公式中可用的技能參數（包括條件判定）', 'Skill params available in formulas (for conditions as well)'),
                  UI.button.class('hvAASkillFormulaParams', UI.button.details()),
                  UI.hvAATable(
                    '1fr 1fr 2fr 2fr;display:none','hvAASkillFormulaParamsTable',

                    UI.div(UI.b(UI.l('公式', '公式', 'Formula'))), UI.div(UI.b(UI.l('取值.', '取值.', 'Values.')), UI.l('默认undefined (公式中为 _undefined)', '默認undefined (公式中为 _undefined)', 'default: undefined (as _undefined in formula)')),
                    UI.div(UI.b(UI.l('参数', '參數', 'Param'))), UI.div(UI.b(UI.l('说明', '說明', 'Notes'))),

                    UI.div('skill.[skill_id]<br>skill.111 == 1'), UI.div('1'),
                    UI.div(UI.l('技能id [skill_id]<br>普通攻击(0)、武器技能、攻击/Buff/单体Debuff法术、FRD(1101)、OFC(1111)、逃跑(1001)', '技能id [skill_id]<br>普通攻擊(id=0)、武器技能、攻擊/Buff/單體Debuff法術、FRD(1101)、OFC(1111)、逃跑(1001)', '[skill_id]<br>attack(id=0), weapon skills, offensive/Buff/(single target)Debuff spells, FRD(1101), OFC(1111), Flee(1001)')),
                    UI.div(UI.l('用于带id技能判定', '用於帶id技能判定', 'For formulas before skills with id')),

                    UI.div('skill.skill<br>skill.skill == T2'),
                    UI.div('OFC, FRD, flee, T1, T2, T3'),
                    UI.div(),
                    UI.div(UI.l('武器/非法术技能名称', '武器/非法術技能名稱', 'weapon/not-spell skill name')),

                    UI.div('skill.[debuff/debuffAll]<br>skill.debuffAll == Sle'),
                    UI.div('debuff main switch : 1<br>debuff/debuffAll: Sl, Bl, Slo, We, Si, Dr, Im, MN, Co'),
                    UI.div('debuff main switch: debuff<br>debuff(singal): debuff<br>debuff(all): debuff, debuffAll'),
                    UI.div(UI.l('Debuff技能简称', 'Debuff技能簡稱', 'Debuff spell short name')),

                    UI.div('skill.attackTier<br>skill.attackTier == 3'),
                    UI.div('Weapon attack: 0, Offensive spells: 1, 2, 3'),
                    UI.div(),
                    UI.div(UI.l('攻击阶数', '攻擊階數', 'Attack tiers')),

                    UI.div('skill.all<br>skill.all == 212'), UI.div('debuff skill ids'),
                    UI.div(),
                    UI.div(UI.l('用于全体debuff的判定', '用於全體debuff的判定', 'For formulas before debuff all')),

                    UI.div('skill.tier<br>skill.tier == 1'), UI.div('1, 2, 3'),
                    UI.div(),
                    UI.div(UI.l('用于以太之触或切换攻击模式时判断攻击法术阶数', '用於以太之触或切換攻擊模式時判斷攻擊法術階數', 'For offensive magic spell tiers before checks for attack status switch or ether tap')),

                    UI.div('skill.id<br>skill.id == 111'),
                    UI.div('[skill/item id], scroll, infusion, buff, debuff, defend, draught, focus, spiriton, spiritoff, OFC, FRD, T1, T2, T3, switch, etherTap'),
                    UI.div(),
                    UI.div('id'),

                    UI.div('skill.[battleSteps]<br>skill.defend === 1'),
                    UI.div('1'),
                    UI.div('[battleSteps]<br>flee, defend, focus, scroll, buff, debuff, infusion'),
                    UI.div(UI.l('用于战斗步骤（逃跑、防御、集中、卷轴/BUFF/DEBUFF/魔药总开关）', '用於戰鬥步驟（逃跑、防禦、集中、捲軸/BUFF/DEBUFF/魔藥總開關）', 'For battle step checks (Flee, Defend, Focus, MAIN SWITCH for Scroll/Buff/Debuff/Infusion)')),
                    UI.div('skill.etherTap<br>skill.etherTap === 1'),
                    UI.div('1'),
                    UI.div(),
                    UI.div(UI.l('用于以太之触', '用於以太之觸', 'For ether tap check')),
                    UI.div('skill.spirit<br>skill.spirit === off'),
                    UI.div('on, off'),
                    UI.div(),
                    UI.div(UI.l('用于灵动架势', '用於靈動架勢', 'For spirit check')),
                  ),
                ),
                UI.div(
                  '<b>6. <l0>优先选择权重最低的目标</l0><l1>優先選擇權重最低的目標</l1><l2>Choose target with lowest rank first</l2></b><br>',
                  UI.labeled('displayWeight', UI.l('显示权重及顺序', '顯示權重及順序', 'Display Weight and order')),
                  UI.labeled('displayWeightBackground', UI.l('显示优先级背景色', '顯示優先級背景色', 'Display Priority Background Color')),
                  '<br>',
                  '<div class="displayWeightBackgroundInner">',
                  '<l0>CSS格式或可eval执行的公式（可用&lt;rank&gt;, &lt;all&gt;指代优先级和总优先级数量, &lt;style_x&gt;指代第x个的相同配置值），例如：</l0><l1>CSS格式或可eval執行的公式（可用&lt;rank&gt;, &lt;all&gt;指代優先級和總優先級數量, &lt;style_x&gt;指代第x個的相同配置值）：例如</l1><l2>CSS or eval executable formula(use &lt;rank&gt; and &lt;all&gt; to refer to priority rank and total rank count, &lt;style_x&gt; to refer to the same option value of option No.x)Such as: </l2><br>`hsl(${Math.round(240*&lt;rank&gt;/Math.max(1,&lt;all&gt;-1))}deg 50% 50%)`<br>',
                  UI.hvAATable(
                    '0.05fr 1fr;width:100%', '',
                    ...range(0, 10).map(i => `${UI.div(UI.for(`weightBackground_${i}`, UI.hidden(UI.l('显示优先级背景色', '顯示優先級背景色', 'Display Priority Background Color'))+`${i === 9 ? '' : `&nbsp;&nbsp;`}${i + 1}.`))}${UI.div(UI.text(`weightBackground_${i}`))}`),
                  ),
                  '</div>',
                ),
                UI.div(
                  'PS. <l0>如果你对各Buff权重有特别见解，请务必</l0><l1>如果你對各Buff權重有特別見解，請務必</l1><l2>If you have any suggestions, please </l2><a class="hvAAGoto" name="hvAATab-Feedback"><l0>告诉我</l0><l1>告訴我</l1><l2>let me know</l2></a>.<br>',
                  '<l0>参考公式为：</l0><l1>參考公式為：</l1><l2>Basic Weight Calculation as: </l2>PW(X) = Log10(<br>HP/MaxHPOnField/(1+CentralAttackDamageExtraRatio)<br>  *[HPActualEffectivenessRate:∏(1-debuff),debuff=Im|PA|Bl|Co|Dr|MN|St]<br>  /[DMGActualEffectivenessRate:∏(1-debuff),debuff=We|Bl|Slo|Si|Sl|Co|Dr|MN|St])'
                ),
              ),
              UI.hvAATab(
                'Drop',
                UI.div(
                  UI.div(UI.b(`<span style="color:red;">`,UI.l('本功能将不再及时更新，可能过时', '本功能將不再及時更新，可能過時', 'This function is no longer being updated in time and might be out of date.'),`</span>`)),
                  UI.button.class('reDropMonitor', UI.l('重置掉落监测', '重置掉落監測', 'Reset Drops Tracking')),
                  UI.labeled('portable_drop', UI.hidden(UI.l('掉落监测', '掉落監測', 'Drops Tracking'),' ')+'<l0>使用便携数据模式（导出脚本数据时将包含）</l0><l1>使用便攜數據模式（導出腳本數據時將包含）</l1><l2>Portable Mode (will be included while exporting script datas)</l2><l0>注意：便携数据模式可能会显著增加硬盘读写</l0><l1>注意：便攜數據模式可能會顯著增加硬盤讀寫</l1><l2>Notice：portable mode may significantly increase hard disk I/O</l2>'),
                  '<input id="portable_dropOld" type="checkbox" hidden>',
                ),
                '<div class="hvAACenter">',
                UI.for('dropQuality', UI.l('记录装备的最低品质', '記錄裝備的最低品質', 'Minimum drop quality')),
                ': <select name="dropQuality"><option value="0">Crude</option><option value="1">Fair</option><option value="2">Average</option><option value="3">Superior</option><option value="4">Exquisite</option><option value="5">Magnificent</option><option value="6">Legendary</option><option value="7">Peerless</option></select></div>',
                '<table class="hvAACenter"></table>',
              ),
              UI.hvAATab(
                'Usage',
                UI.div(
                  UI.div(UI.b(`<span style="color:red;">`,UI.l('本功能将不再及时更新，可能过时', '本功能將不再及時更新，可能過時', 'This function is no longer being updated in time and might be out of date.'),`</span>`)),
                  UI.button.class('reRecordUsage', UI.l('重置数据记录', '重置數據記錄', 'Reset Usage Tracking')),
                  UI.labeled('portable_stats', UI.hidden(UI.l('数据记录', '數據記錄', 'Usage Tracking'),' ')+UI.l('使用便携数据模式（导出脚本数据时将包含）注意：便携数据模式可能会显著增加硬盘读写', '使用便攜數據模式（導出腳本數據時將包含）注意：便攜數據模式可能會顯著增加硬盤讀寫', 'Portable Mode (will be included while exporting script datas) Notice：portable mode may significantly increase hard disk I/O')),
                  '<input id="portable_statsOld" type="checkbox" hidden>'
                ),
                UI.div(
                  UI.b(UI.l('自身', '自身', 'Self')),
                  UI.hvAATable(
                    UI.repeat(10), '',
                    UI.expendData(UIDatas.record1, (id, names, v) => UI.div(UI.labeled(`record_${id}`, UI.hidden(UI.l('数据记录', '數據記錄', 'Usage Tracking'), ':') + names))),
                  ),
                ),
                UI.div(
                  UI.b(UI.l('操作', '操作', 'Actions')),
                  UI.hvAATable(
                    UI.repeat(5), '',
                    UI.expendData(UIDatas.record2, (id, names, v) => UI.div(UI.labeled(`record_${id}`, UI.hidden(UI.l('数据记录', '數據記錄', 'Usage Tracking'),':')+names))),
                  ),
                ),
                UI.div(
                  UI.labeled('record_hurt', UI.hidden(UI.l('数据记录', '數據記錄', 'Usage Tracking'),':')+UI.b(UI.l('受伤 (总量)', '受傷 (總量)', 'Hurt (Amount)'))),
                  UI.hvAATable(
                    `${UI.repeat(3)} ${UI.repeat(6, '2fr')}`, '',
                    UI.expendData(UIDatas.record3, (id, names, v) => UI.div(UI.labeled(`record_${id}`, UI.hidden(UI.l('数据记录', '數據記錄', 'Usage Tracking'),':')+names))),
                  ),
                ),
                '<table></table>',
              ),
              UI.hvAATab(
                'Tools',
                UI.div(
                  '<span class="hvAATitle"><l0>当前状况</l0><l1>當前狀況</l1><l2>Current status</l2></span>: ',
                  '<l0>如果脚本长期暂停且网络无问题，请点击</l0><l1>如果腳本長期暫停且網絡無問題，請點擊</l1><l2>If the script does not work and you are sure that it\'s not because of your internet, click</l2>',
                  UI.button.class('hvAAFix', UI.l('尝试修复', '嘗試修復', 'Try to fix')),
                  '<br>',
                  '<l0>战役模式</l0><l1>戰役模式</l1><l2>Battle type</l2>: <select class="hvAADebug" name="roundType"><option></option><option value="ar">The Arena</option><option value="rb">Ring of Blood</option><option value="gr">GrindFest</option><option value="iw">Item World</option><option value="ba">Encounter</option><option value="tw">The Tower</option></select> <l0>当前回合</l0><l1>當前回合</l1><l2>Current round</l2>: ',
                  UI.number('roundNow', undefined, 'number', 'hvAADebug'),
                  ' <l0>总回合</l0><l1>總回合</l1><l2>Total rounds</l2>: ',
                  UI.number('roundAll', undefined, 'number', 'hvAADebug'),
                ),
                UI.div(UI.labeled('keepAliveByAudio', UI.l('[实验性!!]使用静音音频脉冲避免浏览器节流', '[實驗性!!]使用靜音音頻脈衝避免瀏覽器節流', '[Experimental!!]Keep alive by slience audio pulse to avoid browser throttle'))),
                '<div class="hvAAQuickSite">',
                UI.labeled('showQuickSite', `<span class="hvAATitle">${UI.l('快捷站点', '快捷站點', 'Quick Site')}</span>`),
                '<span class="showQuickSiteInner">',
                UI.button.class('quickSiteAdd', UI.l('新增', '新增', 'Add')),
                '<br>',
                UI.l('注意: 留空“名称”一栏则表示删除该行，修改后请保存', '注意: 留空“名稱”一欄則表示刪除該行，修改後請保存', 'Note: The "name" input box left blank will be deleted, after change please save in time.'),
                '<table><tbody><tr class="hvAATh"><td><l0>图标</l0><l1>圖標</l1><l2>ICON</l2></td><td><l0>名称</l0><l1>名稱</l1><l2>Name</l2></td><td><l0>链接</l0><l1>鏈接</l1><l2>Link</l2></td></tr></tbody></table></span></div>',
                UI.div(
                  '<span class="hvAATitle"><l0>备份与还原</l0><l1>備份與還原</l1><l2>Backup and Restore</l2></span><br>',
                  UI.button.class('hvAABackup', UI.l('备份设置', '備份設置', 'Backup Confiuration')),
                  UI.button.class('hvAARestore', UI.l('还原设置', '還原設置', 'Restore Confiuration')),
                  UI.button.class('hvAADelete', UI.l('删除设置', '刪除設置', 'Delete Confiuration')),
                  '<ul class="hvAABackupList"></ul>'),
                UI.div(
                  '<span class="hvAATitle">',
                  '<l0>导入与导出</l0><l1>導入與導出</l1><l2>Import and Export</l2>',
                  '</span><br>',
                  UI.button.class('hvAAExport', UI.l('导出设置', '導出設置', 'Export Confiuration')),
                  UI.button.class('hvAAImport', UI.l('导入设置', '導入設置', 'Import Confiuration')),
                  '<textarea class="hvAAConfig"></textarea>'),
              ),
              UI.hvAATab(
                'Feedback',
                '<span class="hvAATitle">',
                UI.l('反馈', '反馈', 'Feedback'),
                '</span>',
                UI.div(
                  UI.l('链接', '鏈接', 'Links'),
                  ': <a href="https://github.com/dodying/UserJs/issues/new" target="_blank">1. GitHub</a><a href="https://greasyfork.org/forum/post/discussion?script=18482" target="_blank">2. GreasyFork</a>'),
                UI.div(
                  '<span class="hvAATitle">',
                  UI.l('反馈说明', '反饋說明', 'Feedback Note'),
                  '</span>: <br>',
                  UI.l(
                    '如果你遇见了Bug，想帮助作者修复它<br>你应当提供以下多种资料: <br>1. 场景描述<br>2. 你的配置<br>3. 控制台日志 (按Ctrl+Shift+i打开开发者助手，再选择Console(控制台)面板)<br>4. 战斗日志  (如果是在战斗中)<br>如果是无法容忍甚至使脚本失效的Bug，请尝试安装旧版本<hr>如果你有一些建议使这个脚本更加有用，那么: <br>1. 请尽量简述你的想法<br>2. 如果可以，请提供一些场景 (方便作者更好理解)',
                    '如果你遇見了Bug，想幫助作者修復它<br>你應當提供以下多種資料: <br>1. 場景描述<br>2. 你的配置<br>3. 控制台日誌 (按Ctrl+Shift+i打開開發者助手，再選擇Console(控制台)面板)<br>4. 戰鬥日誌 (如果是在戰鬥中)<br>如果是無法容忍甚至使腳本失效的Bug，請嘗試安裝舊版本<hr>如果你有一些建議使這個腳本更加有用，那麼: <br>1. 請盡量簡述你的想法<br>2.如果可以，請提供一些場景 (方便作者更好理解)',
                    'If you encounter a bug and would like to help the author fix it<br>You should provide the following information: <br>1. the Situation<br>2. Your Configuration<br>3. Console Log (press Ctrl + Shift + i to open the Developer Assistant, And then select the Console panel)<br>4. Battle Log (if in combat)<br>If you are unable to tolerate this bug or even the bug made the script fail, try installing the old version<hr>If you have some suggestions to make this script more useful, then: <br>1. Please briefly describe your thoughts<br>2. If you can, please provide some scenes (to facilitate the author to better understand)<br>PS. For English user, please express in basic English (Oh my poor English, thanks for Google Translate)'
                  ),
                ),
                UI.div(UI.labeled('debugCheckCondition', 'debugCheckCondition:<br>prefix@/# to log result in console, @for formula, #for param: '), '{{debugCondition}}'),
                '<div id="hvAADebugConsoleDisplay"></div>'
              ),
            ]
          }),
          UI.div({
            args: { class: 'hvAAButtonBox hvAACenter', style:'display:grid; grid-template-columns: repeat(8, 1fr)' },
            inner: [
              UI.div(), UI.div(),
              UI.button.class('hvAAApply', UI.l('应用', '應用', 'Apply')),
              UI.button.class('hvAACancel', UI.l('关闭', '關閉', 'Close')),
              UI.button.class('hvAAReset', UI.l('撤销', '撤銷', 'Revert')),
              UI.button.class('hvAADefault', UI.l('默认', '默認', 'Default')),
              UI.div(), UI.div(),
            ]}),
        ].join('').replace(/{{(.*?)}}/g, '<div class="customize" name="$1"></div>');

        [...gE('.customize', 'all', optionBox)].map(customize => {
          const name = customize.getAttribute('name');
          let replaced = name.replace('Condition', '');
          let input = gE(`#${name.replace('Condition', '_')}`, optionBox) ?? gE(`#${replaced}`, optionBox) ?? gE(`#${replaced.replace(/(Skill|skill|item|infusion|scroll|pause|flee|debug)/, (...args) => {
            switch(args[0]) {
              case 'pause':
                return 'autoPause';
              case 'flee':
                return 'autoFlee';
              case 'debug':
                return 'debugCheckCondition';
              default: // case 'skill': case 'Skill': case 'item': case 'infusion': case 'scroll':
                return `${args[0]}_`;
            }
          })}`, optionBox);
          if (!input) return;
          customize.classList.add(`${input.id}Inner`);
        });

        gE('.hvAATab', 'all', optionBox).forEach(tab => { tab.style.zIndex = 1; });
        optionBox.style.display = 'none';
        gE('select[name="lang"]', optionBox).value = lang;
        bindEvents();
      }
      updateItemWorldList(true, runtime.document);
      updateEquipSetUI();
      updateItemWorldListUI();
      changeSelectOptionText();
      loadOptionUIData();
      flags.option = true;
      (async () => { gE('input, select', 'all', optionBox).forEach(setInputTitle); })();

      [...gE('select:not([name="lang"])', 'all', optionBox)].forEach(s => { s.onchange ??= () => selectFit(s); });
      unique([...gE('[class$="Inner"]', 'all', optionBox)].map(inner => [...inner.classList].find(className => className.includes('Inner')))).forEach(innerName => {
        const onchange = gE(`#${innerName.replace(/Inner$/, '')}`, optionBox)?.onchange;
        if (onchange) onchange();
      });

      function changeSelectOptionText() {
        const attackStatus = {
          0: UI.byLang('物理', '物理', 'Physical'),
          1: UI.byLang('火', '火', 'Fire'),
          2: UI.byLang('冰', '冰', 'Cold'),
          3: UI.byLang('雷', '雷', 'Elec'),
          4: UI.byLang('风', '風', 'Wind'),
          5: UI.byLang('圣', '聖', 'Divine'),
          6: UI.byLang('暗', '暗', 'Forbidden'),
        };
        [...gE('select[name="attackStatus"] > option', 'all', optionBox)].forEach(option => {
          option.innerText = attackStatus[option.value.toString()] ?? option.innerText;
        });
        const autoSwitchOptionText = [
          ['继承', '繼承', 'Inherit'],
          ['不自动切换', '不自動切換', 'Disable auto switch'],
          ['(默认)', '(默認)', '(Default)'],
          ['(当前)', '(當前)', '(current)']
        ];
        [...gE('.equipSetList option, .autoItemWorldList option', 'all', optionBox)].forEach(option => {
          for (const texts of autoSwitchOptionText) {
            for (const text of texts) {
              if (!option.innerText.includes(text)) continue;
              option.innerText = option.innerText.replace(text, UI.byLang(texts));
              break;
            }
          }
        });
      }

      function bindEvents() {
        gE('select[name="lang"]', optionBox).onchange = function () { // 选择语言
          gE('.hvAA-LangStyle').textContent = `l${this.value}{display:inline!important;}`;
          if (/^[01]$/.test(this.value)) {
            gE('.hvAA-LangStyle').textContent += 'l01{display:inline!important;}';
          }
          lang = this.value;
          changeSelectOptionText();
        };
        gE('.hvAATabmenu', optionBox).onclick = function (e) { // 标签页事件
          if (e.target.tagName.toUpperCase() === 'INPUT') {
            return;
          }
          const target = (e.target.tagName.toUpperCase() === 'SPAN') ? e.target : e.target.parentNode;
          const name = target.getAttribute('name');
          let i, _html;
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
                drop.__name = getValue('battleCode', true)?.name;
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
            let statsStatic = getValue('statsStatic', true) || {};
            const statsOld = getValue('statsOld', true) || [];
            const translation = {
              self: UI.l('自身', '自身', 'Self'),
              restore: UI.l('回复 (总量)', '回复 (總量)', 'Restore (Amount)'),
              items: UI.l('物品 (次数)', '物品 (次數)', 'Items (Frequency)'),
              magic: UI.l('技能 (次数)', '技能 (次數)', 'Magic (Frequency)'),
              damage: UI.l('伤害 (总量)', '傷害 (總量)', 'Damage (Amount)'),
              proficiency: UI.l('熟练度 (总量)', '熟練度 (總量)', 'Proficiency (Amount)'),
              hurt: UI.l('受伤 (总量)', '受傷 (總量)', 'Loss (Amount)'),
            };
            _html = '<tbody>';
            if (statsOld.length === 0 || (statsOld.length === 1 && !getValue('stats', true))) {
              if (statsOld.length === 1) {
                stats = statsOld[0];
              }
              for (i in stats) {
                _html = `${_html}<tr class="hvAATh"><td>${translation[i]??i}</td><td>${UI.l('值', '值', 'Value')}</td></tr>`;
                stats[i] = objSort(stats[i]);
                let names = statsStatic[`${i}Names`];
                if (!names && ['restore', 'damage'].includes(i)) names = { ...statsStatic.magicNames, ...statsStatic.itemsNames };
                for (const j in stats[i]) {
                  _html = `${_html}<tr><td>${j} ${names?.[j] ?? ''}</td><td>${stats[i][j]}</td></tr>`;
                }
              }
            } else {
              if (getValue('stats')) {
                stats.__name = getValue('battleCode', true)?.name;
                statsOld.push(stats);
              }
              statsOld.reverse();
              _html = `${_html}<tr class="hvAATh"><td class="selectTable"></td>`;
              statsOld.forEach((_dropOld) => {
                _html = `${_html}<td>${_dropOld.__name}</td>`;
              });
              _html = `${_html}</tr>`;
              Object.keys(translation).forEach((i) => {
                if (i === '__name') return;
                _html = `${_html}<tr class="hvAATh"><td colspan="${statsOld.length + 1}">${translation[i]??i}</td></tr>`;
                getKeys(statsOld, i).forEach((key) => {
                  let names = statsStatic[`${i}Names`];
                  if (!names && i === 'restore') names = { ...statsStatic.magicNames, ...statsStatic.itemsNames };
                  _html = `${_html}<tr><td>${key} ${names?.[key] ?? ''}</td>`;
                  statsOld.forEach((_statsOld) => {
                    if (_statsOld[i] && (key in _statsOld[i])) {
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
          } else if (name === 'Tools') { // 关于本脚本
            gE('.hvAADebug', 'all', optionBox).forEach((input) => {
              let value = getValue('battle')?.[input.name] ?? getValue(input.name);
              if (value) input.value = value;
            });
          }
          if (name === 'Drop' || name === 'Usage') {
            gE('.selectTable', 'all', optionBox).forEach((i) => {
              i.onclick = null;
              i.onclick = function (e) {
                const select = window.getSelection();
                select.removeAllRanges();
                const selectRange = runtime.document.createRange();
                selectRange.selectNodeContents(e.target.parentNode.parentNode.parentNode);
                select.addRange(selectRange);
              };
            });
          }
          gE('.hvAATab', 'all', optionBox).forEach((i) => {
            i.style.display = (i.id === `hvAATab-${name}`) ? 'block' : '';
          });
        };
        gE('.hvAAGoto', 'all', optionBox).forEach((i) => {
          i.onclick = function () {
            gE(`.hvAATabmenu>span[name="${this.name.replace('hvAATab-', '')}"]`).click();
          };
        });

        optionBox.onmousemove = function (e) { // 自定义条件相关事件
          const target = e.target.closest('.customize');
          if (!target) {
            if (gE('.customizeBox')) gE('.customizeBox').style.display = 'none'
            return;
          }
          creatCustomizeBox();
          runtime.customizeTarget = target;
          updateGroup();
        };
        // 标签页-主要选项
        gE('input[name="pauseHotkeyStr"]', optionBox).onkeyup = function (e) {
          this.value = (/^[a-z]$/.test(e.key)) ? e.key.toUpperCase() : e.key;
          gE('input[name="pauseHotkeyCode"]', optionBox).value = e.keyCode;
        };
        gE('input[name="stepInHotkeyStr"]', optionBox).onkeyup = function (e) {
          this.value = (/^[a-z]$/.test(e.key)) ? e.key.toUpperCase() : e.key;
          gE('input[name="stepInHotkeyCode"]', optionBox).value = e.keyCode;
        };
        gE('input[name="altHotkeyStr"]', optionBox).onkeyup = function (e) {
          this.value = (/^[a-z]$/.test(e.key)) ? e.key.toUpperCase() : e.key;
          gE('input[name="altHotkeyCode"]', optionBox).value = e.keyCode;
        };
        gE('.testAlarm', 'all', optionBox).forEach(button => {
          button.onclick = function () {
            const srcInput = gE('input[type="text"]', button.parentNode);
            const e = srcInput.name.split('_')[1];
            const src = srcInput.value ?? srcInput.placeholder;
            console.log('test alarm', e, src);
            setAlarm(e, src);
          }
        });
        gE('.testNotification', optionBox).onclick = function () {
          UI.alert('接下来开始预处理。\n如果询问是否允许，请选择允许', '接下來開始預處理。\n如果詢問是否允許，請選擇允許', 'Now, pretreat.\nPlease allow to receive notifications if you are asked for permission');
          setNotification('Test');
        };
        gE('.testPopup', optionBox).onclick = function () {
          UI.alert('接下来开始预处理。\n关闭本警告框之后，请切换到其他标签页，\n并在足够长的时间后再打开本标签页', '接下來開始預處理。\n關閉本警告框之後，請切換到其他標籤頁，\n並在足夠長的時間後再打開本標籤頁', 'Now, pretreat.\nAfter dismissing this alert, focus other tab,\nfocus this tab again after long time.');
          setTimeout(() => {
            const riddleWindow = window.open(window.location.href, 'riddleWindow', 'resizable, scrollbars, width=1241, height=707');
            if (riddleWindow) {
              setTimeout(() => {
                riddleWindow.close();
              }, 200);
            }
          }, 3 * _1s);
        };

        let inners = unique([...gE('[class$="Inner"]', 'all', optionBox)].map(inner => [...inner.classList].find(className => className.includes('Inner'))));
        inners.forEach(innerName => {
          const outter = gE(`#${innerName.replace(/Inner$/, '')}`, optionBox);
          if (!outter) return;
          outter.onchange = function () {
            [...gE(`.${innerName}`, 'all', optionBox)].forEach(inner => { inner.style.filter = outter.checked ? 'opacity(1)' : 'opacity(0.3)'; });
          };
        });
        inners = unique([...gE('[class$="InnerReverted"]', 'all', optionBox)].map(inner => [...inner.classList].find(className => className.includes('InnerReverted'))));
        inners.forEach(innerName => {
          const outter = gE(`#${innerName.replace(/InnerReverted$/, '')}`, optionBox);
          outter.onchange = function () {
            [...gE(`.${innerName}`, 'all', optionBox)].forEach(inner => { inner.style.filter = !outter.checked ? 'opacity(1)' : 'opacity(0.3)'; });
          };
        });
        gE('.idleArenaReset', optionBox).onclick = function () {
          if (UI.confirm('是否重置', '是否重置', 'Whether to reset')) {
            delValue('arena');
          }
        };
        gE('.hvAASkillFormulaParams', optionBox).onclick = function () {
          const isDisplay = gE('.hvAASkillFormulaParamsTable', optionBox).style.display !== 'grid';
          this.innerHTML = UI.button.details(isDisplay);
          gE('.hvAASkillFormulaParamsTable', optionBox).style.display = isDisplay ? 'grid' : 'none';
        };
        gE('.hvAAShowLevels', optionBox).onclick = function () {
          const isDisplay = gE('.hvAAArenaLevels', optionBox).style.display !== 'grid';
          this.innerHTML = UI.button.details(isDisplay);
          gE('.hvAAArenaLevels', optionBox).style.display = isDisplay ? 'grid' : 'none';
        };
        gE('.hvAALevelsClear', optionBox).onclick = function () {
          gE('[name="idleArenaLevels"]', optionBox).value = '';
          gE('[name="idleArenaValue"]', optionBox).value = '';
          gE('.hvAAArenaLevels input[id^="arLevel_"]', 'all', optionBox).forEach((input) => {
            input.checked = false;
            displayCheckBoxNotDefault(input);
          });
        };

        gE('.updateEquipSet', optionBox).onclick = async function() { try {
          this.innerHTML = UI.button.updating;
          await updateItemWorldList(true);
          updateEquipSetUI();
          this.innerHTML = UI.button.update;
        } catch (err) { console.error(err); }};
        gE('.hvAAShowEquipSet', optionBox).onclick = function () {
          const isDisplay = gE('.equipSetList', optionBox).style.display !== 'grid';
          this.innerHTML = UI.button.details(isDisplay);
          gE('.equipSetList', optionBox).style.display = isDisplay ? 'grid' : 'none';
        };

        gE('.updateItemWorld', optionBox).onclick = async function() { try {
          this.innerHTML = UI.button.updating;
          await updateItemWorldList();
          updateItemWorldListUI();
          this.innerHTML = UI.button.update;
        } catch (err) { console.error(err); }};
        gE('.hvAAShowItemWorld', optionBox).onclick = function () {
          const isDisplay = gE('.autoItemWorldList', optionBox).style.display !== 'grid';
          this.innerHTML = UI.button.details(isDisplay);
          gE('.autoItemWorldList', optionBox).style.display = isDisplay ? 'grid' : 'none';
        };
        gE('.hvAAClearItemWorld', optionBox).onclick = function () {
          const current = getValue('itemWorldDatas');
          delete current.equips;
          setValue('itemWorldDatas', current);
          gE('.autoItemWorldList', optionBox).innerHTML = '';
          updateItemWorldListUI();
        };

        const optionBox2Order = (ids, valueFrom = undefined, index = 0) => function (e) {
          if (Array.isArray(ids)) {
            for (const i in ids) {
              optionBox2Order(ids[i], valueFrom, i)(e);
            }
            return;
          }
          if (e.target.id.match(/^arLevelDisable_/)) return;
          if (e.target.tagName.toUpperCase() !== 'INPUT' && e.target.type !== 'checkbox') {
            return;
          }
          valueFrom ??= e => e.target.value.split(',');
          const valueArray = valueFrom(e);
          const latest = Array.isArray(valueArray) ? valueArray[index] : valueArray;

          const orderObject = gE(`input[${ids}]`);
          let value = orderObject.value;
          const regExp = new RegExp(`(^|,)${latest}(,|$)`, 'g');
          while (value.match(regExp)) {
            value = value.replace(regExp, '$2').replace(/^,/, '');
          }
          if (e.target.checked) {
            value = value + ((value) ? `,${latest}` : latest);
          }
          orderObject.value = value;
        }
        const getOrderFromId = e => e.target.id.match(/_(.*)/)[1];
        const orderValues = {
          '.attackStatusOrder': ['name="attackStatusOrderName"', 'name="attackStatusOrderValue"'],
          '.battleOrder': 'name="battleOrderName"',
          // 标签页-战斗开启
          '.hvAAArenaLevels': ['name="idleArenaLevels"', 'name="idleArenaValue"'],
          // 标签页-恢复技能
          '.itemOrder': ['name="itemOrderName"', 'name="itemOrderValue"'],

          // 标签页-引导技能
          '.channelSkill2Order': ['name="channelSkill2OrderName"', 'name="channelSkill2OrderValue"'],
          // 标签页-BUFF技能
          '.buffSkillOrder': 'name="buffSkillOrderValue"',
          // 标签页-DEBUFF技能
          '.debuffSkillOrder': 'name="debuffSkillOrderValue"',
          '.debuffSkillOrderAll': 'name="debuffSkillOrderAllValue"',
          // 标签页-其他技能
          '.skillOrder': 'name="skillOrderValue"',
          // 标签页-,
          '.infusionOrder': 'name="infusionOrderName"',
        }
        const isGetOrderFromId = ['.buffSkillOrder', '.debuffSkillOrder', '.debuffSkillOrderAll', '.skillOrder', '.infusionOrder'];
        for (let ui in orderValues) {
          gE(ui, optionBox).onclick = optionBox2Order(orderValues[ui], isGetOrderFromId.includes(ui) ? getOrderFromId : undefined);
        };

        // 标签页-警报
        gE('input[name="audio_Text"]', optionBox).onchange = function () {
          if (this.value === '') return;
          if (!/^http(s)?:|^ftp:|^data:audio/.test(this.value)) {
            UI.alert('地址必须以"http:", "https:", "ftp:", "data:audio"开头', '地址必須以"http:", "https:", "ftp:", "data:audio"開頭', 'The address must start with "http:", "https:", "ftp:", and "data:audio"');
            return;
          }
          UI.alert('接下来将测试该音频\n如果该音频无法播放或无法载入，请变更\n请测试完成后再键入另一个音频', '接下來將測試該音頻\n如果該音頻無法播放或無法載入，請變更\n請測試完成後再鍵入另一個音頻', 'The audio will be tested after you close this prompt\nIf the audio doesn\'t load or play, change the url');
          const box = gE('#hvAATab-Alarm').appendChild(cE('div'));
          box.innerHTML = this.value;
          const audio = box.appendChild(cE('audio'));
          audio.controls = true;
          audio.src = this.value;
          playAudio(audio);
        };
        // 标签页-攻击规则
        gE('.clearMonsterHPCache', optionBox).onclick = function () {
          delValue('monsterDB', true);
          delValue('monsterDB', false);
          delValue('monsterMID', true);
          delValue('monsterMID', false);
        };
        gE('#portable_monsterDB', optionBox).onclick = function () {
          gE('#portable_monsterMID', optionBox).checked = this.checked;
        }
        // 标签页-掉落监测
        gE('.reDropMonitor', optionBox).onclick = function () {
          if (UI.confirm('是否重置', '是否重置', 'Whether to reset')) {
            delValue('drop', true);
            delValue('drop', false);
            delValue('dropOld', true);
            delValue('dropOld', false);
          }
        };
        gE('#portable_drop', optionBox).onclick = function () {
          gE('#portable_dropOld', optionBox).checked = this.checked;
        }
        // 标签页-数据记录
        gE('.reRecordUsage', optionBox).onclick = function () {
          if (UI.confirm('是否重置', '是否重置', 'Whether to reset')) {
            delValue('stats', true);
            delValue('stats', false);
            delValue('statsOld', true);
            delValue('statsOld', false);
          }
        };
        gE('#portable_stats', optionBox).onclick = function () {
          gE('#portable_statsOld', optionBox).checked = this.checked;
        }
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
        gE('.hvAABackup', optionBox).onclick = function () {
          const code = UI.prompt('请输入当前配置代号（或默认使用当前时间）', '請輸入當前配置代號（或默認使用當前時間）', 'Please put in a name for the current configuration (or use current time as default)');
          backup(code, '是否覆盖已有的同名配置？', '是否覆蓋已有的同名配置？', 'Do you want to overwrite the configuration with the same name?')
        };
        gE('.hvAARestore', optionBox).onclick = function () {
          const code = UI.prompt('请输入配置代号', '請輸入配置代號', 'Please put in a name for a configuration');
          const backups = getValue('backup', true) || {};
          if (!(code in backups) || !code) {
            return;
          }
          setValue('option', backups[code]);
          goto();
        };
        gE('.hvAADelete', optionBox).onclick = function () {
          const code = UI.prompt('请输入配置代号', '請輸入配置代號', 'Please put in a name for a configuration');
          const backups = getValue('backup', true) || {};
          if (!(code in backups) || !code) {
            return;
          }
          delete backups[code];
          setValue('backup', backups);
          rmListItem(code);
        };
        gE('.hvAAExport', optionBox).onclick = function () {
          const t = getValue('option');
          gE('.hvAAConfig').value = typeof t === 'string' ? t : JSON.stringify(t);
        };
        gE('.hvAAImport', optionBox).onclick = function () {
          const optionImport = JSON.parse(gE('.hvAAConfig').value);
          if (!optionImport) {
            return;
          }
          if (UI.confirm('是否重置', '是否重置', 'Whether to reset')) {
            setValue('option', optionImport);
            goto();
          }
        };
        function alertDiffs(...lang) {
          const diffs = getOptionDiff(option);
          if (!diffs) return true;
          const log = UI.byLang(lang.map(str => str + diffs));
          console.log(log);
          return UI.confirm(...lang.map(str => str + diffs));
        }
        gE('.hvAADefault', optionBox).onclick = function () {
          if (getOptionDiff() && !alertDiffs('有未保存的选项，是否仍要设置为默认值? 更改数：', '有未保存的選項，是否仍要設置為默認值?更改數：', 'Unsaved changes detected, continue to set options as default? Changes: ')) {
            return;
          }
          loadOptionUIData({});
        };
        gE('.hvAAReset', optionBox).onclick = function () {
          if (!alertDiffs('是否撤销未保存的更改? 更改数：', '是否撤銷未保存的更改?更改數：', 'Confirm to revert unsaved changes? Changes: ')) {
            return;
          }
          loadOptionUIData(option);
        };
        gE('.hvAAApply', optionBox).onclick = function () {
          if (gE('select[name="attackStatus"] option[value="-1"]:checked', optionBox) ||
              !gE('select[name="attackStatus"] option:checked', optionBox)) {
            UI.alert('请选择攻击模式', '請選擇攻擊模式', 'Please select the attack mode');
            gE('.hvAATabmenu>span[name="Main"]').click();
            gE('#attackStatus', optionBox).style.border = '1px solid red';
            setTimeout(() => { gE('#attackStatus', optionBox).style.border = ''; }, 0.5 * _1s);
            return;
          }

          const arenaPrev = g.option.idleArenaValue;

          const _option = getCurrentUIOption();
          _option.version = script.scriptVersion.ver;
          setValue('option', _option);

          optionBox.style.display = 'none';
          // 清除不再需要的portable数据
          for (const key of dataFlags.portable) {
            if (_option.portable && Object.keys(_option.portable).includes(key)) continue;
            delValue(key, true);
          }
          // 更改设置后实时刷新竞技场数据
          const arenaNew = _option.idleArenaValue;
          if (arenaNew === arenaPrev) {
            goto();
            return;
          }
          if (_option.idleArena && _option.idleArenaValue) {
            const arena = getValue('arena', true)??{};
            arena.isOptionUpdated = undefined;
            setValue('arena', arena);
            goto();
          }
        };
        gE('.hvAACancel', optionBox).onclick = function () {
          optionBox.style.display = 'none';
        };
      };

      function getOptionDiff(...options) {
        options[0] ??= formatOption({}, true); // default
        options[1] ??= formatOption(loadOption(getCurrentUIOption()), true); // from UI
        diffData.prototype.excludes = 'version';
        const diffs = diffData(options);
        if (!diffs) return;
        let i = 1;
        return Object.keys(diffs).length + '\n' + Object.entries(diffs).map(([key, data]) => {
          const input = getOptionInput(key, optionBox);
          if ((input?.type === 'hidden') || input?.hidden || input?.classList.contains('hvAADebug')) return;
          let defaultStr = UI.byLang('默认', '默認', 'Default');
          const tab = UI.cutLang(gE(`.hvAATabmenu [name="${input.closest('.hvAATab').id.match(/-(.*)/)[1]}"]`).innerHTML);
          return `[${i++}]${tab} ${input.title}: ${data.map(d => d ? String(d) : `${defaultStr}(${input?.placeholder||'undefined'})`)?.join(' -> ')}`;
        }).filter(d => !!d).join('\n');

        function diffData(datas, parents) {
          let json = datas.map(JSON.stringify);
          if (unique(json).length === 1) return undefined;
          if (datas.some(d=> !['object', 'undefined'].includes(typeof d))) {
            const diff = {};
            diff[parents] = datas;
            return diff;
          }
          const keys = datas.map(data => data ? Object.keys(data) : undefined);
          let differents;
          unique(keys.reduce((acc, cur) => (acc ?? []).concat(cur ?? []), [])).forEach(key => {
            if ([diffData.prototype.excludes, ...diffData.prototype.excludes].includes(key)) return;
            let datasSub = datas.map(data => data?.[key]);
            key = parents ? `${parents}_${key}` : key;
            const diff = diffData(datasSub, key);
            if (!diff) return;
            differents = { ...(differents ??= {}), ...diff };
          });
          return differents;
        }
      }

      function getCurrentUIOption() {
        const _option = {};
        let name, array, value, type;
        for (const input of gE('input, select', 'all', optionBox)) {
          [name, type, value] = [input.name, input.type, input.value];
          switch(input.className) {
            case 'hvAADebug': continue;
            case 'hvAANumber': type = 'number';
          }
          switch (type) {
            case 'number':
              value = (value || (value === 0)) ? value * 1 : '';
              if (isNaN(value)) continue;
              break;
            case 'text': case 'hidden':
              value = value || '';
              if (['', 'undefined'].includes(value)) continue;
              break;
            case 'checkbox':
              [name, value] = [input.id, input.checked];
              if (value === false) {
                if (!input.placeholder) continue;
                value = 0;
              }
              break;
            case 'select-one':
              break;
          }
          if (['', 'undefined', input.placeholder, input.placeholder * 1, !!input.placeholder].includes(value))
          {
            continue;
          }

          if ((array = name.split('_')).length === 1) {
            _option[name] = value;
            continue;
          }
          if (input.className === 'customizeInput') {
            ((_option[array[0]] ??= {})[array[1]] ??= []).push(value);
          } else {
            (_option[array[0]] ??= {})[array[1]] = value;
          }
        }

        const inputs = gE('.hvAAQuickSite input[type="text"], .hvAAQuickSite input[type="number"]', 'all', optionBox);
        if (inputs.length) _option.quickSite = [];
        for (let i = 0; i < inputs.length; i += 3) {
          const [fav, name, url] = Array.from(inputs).slice(i, i + 3).map(input => input.value);
          if (name === '') continue;
          _option.quickSite.push({ fav, name, url });
        }
        return _option;
      }

      function formatOption(option, skipUI) {
        for (const obj in option) {
          if (['auto', 'server'].includes(obj)) continue;
          if (getOptionInput(obj, optionBox)) continue;
          if (option[obj] instanceof Object) {
            let found = false;
            for (const key in option[obj]) {
              if (found ||= getOptionInput(`${obj}_${key}`, optionBox)) continue;
              if (!['enableItemWorld', 'levelItemWorld', 'enableItemWorld', 'itemWorldPersona', 'itemWorldEquipSet'].includes(obj)) console.log(`Legacy option deleted: ${obj}_${key}`);
              delete option[obj][key];
            }
            if (!found) delete option[obj];
            continue;
          }
          console.log(`Legacy option deleted: ${obj}`);
          delete option[obj];
        }

        const inputs = gE('input, select', 'all', optionBox);

        let name, array, value, type, placeholder, num;
        function formatValue(value, placeholder) {
          if (['', undefined].includes(value) && placeholder) {
            value = placeholder;
          }
          switch (type) {
            case 'text':
            case 'hidden':
            case 'select-one':
            case 'number':
              num = value * 1;
              return (!isNaN(num)) ? num : value;
            case 'checkbox':
              return value ? true : undefined;
            default:
              return value;
          }
        }

        for (const input of inputs) {
          [name, type, placeholder] = [input.name || input.id, input.type, input.placeholder];
          switch(input.className) {
            case 'hvAADebug': continue;
            case 'hvAANumber': type = 'number';
          }
          [array, value] = [name.split('_'), undefined];
          if (array.length === 1) {
            value = formatValue(option[name], placeholder);
            if (value || value === 0) option[name] = value;
          } else if (!input.classList.contains('customizeInput')) {
            value = formatValue(option[array[0]]?.[array[1]], placeholder);
            if (value || value === 0) (option[array[0]] ??= {})[array[1]] = value;
          }
          if (type !== 'checkbox' && ![placeholder * 1, placeholder].includes(value)) {
            value = value === undefined ? '' : value;
          }

          if (skipUI || forIsekaiEncounter) continue;
          switch (type) {
            case 'select-one' :
            case 'text':
            case 'hidden':
            case 'number':
              input.value = value;
              customizeInputAutoFit(input);
              break;
            case 'checkbox':
              input.checked = !!value;
              displayCheckBoxNotDefault(input);
              input.addEventListener('change', () => displayCheckBoxNotDefault(input));
          }
        }
        return option;
      }

      function loadOptionUIData(uiOption) {
        let isCache = !uiOption;
        uiOption ??= option;
        if (!uiOption) return;
        uiOption = formatOption(uiOption);
        if (forIsekaiEncounter) return;
        const customizes = gE('.customize', 'all', optionBox);
        customizes.forEach(n => { while(n.firstChild) { n.removeChild(n.firstChild); }});
        for (let customize of customizes) {
          const name = customize.getAttribute('name');
          if (!(name in uiOption)) {
            const group = customize.appendChild(cE('div'));
            group.className = 'customizeGroup';
            group.innerHTML = `1. `;
            setCustomizeInput(group.appendChild(cE('input')), `${name}_0`, undefined, true);
            continue;
          }

          for (const groupIndex in uiOption[name]) {
            const group = customize.appendChild(cE('div'));
            group.className = 'customizeGroup';
            group.innerHTML = `${groupIndex * 1 + 1}. `;
            for (const index of range(uiOption[name][groupIndex])) {
              setCustomizeInput(group.appendChild(cE('input')), `${name}_${groupIndex}`, uiOption[name][groupIndex][index], index === uiOption[name][groupIndex].length-1);
            }
          }
        }

        if (!isCache) return;
        g.option = uiOption;
        let _html;
        if (option.quickSite) {
          _html = `<tr class="hvAATh"><td>${UI.l('图标', '圖標', 'ICON')}</td><td>${UI.l('名称', '名稱', 'Name')}</td><td>${UI.l('链接', '鏈接', 'Link')}</td></tr>`;
          option.quickSite.forEach((i) => {
            _html = `${_html}<tr><td><input class="hvAADebug" type="text" value="${i.fav}"></td><td><input class="hvAADebug" type="text" value="${i.name}"></td><td><input class="hvAADebug" type="text" value="${i.url}"></td></tr>`;
          });
          gE('.hvAAQuickSite>table>tbody', optionBox).innerHTML = _html;
        }

        const backups = getValue('backup', true);
        if (!backups) return;
        _html = '';
        for (const i in backups) {
          _html = `${_html}<li>${i}</li>`;
        }
        gE('.hvAABackupList', optionBox).innerHTML = _html;
      };
    }

    function getOptionInput(id, optionBox) {
      optionBox ??= gE('#hvAABox');
      const getter = id => gE(`[name="${id}"], [id="${id}"]`, optionBox);
      return getter(id) ?? getter(id.replace(/_(\d+)$/, ''));
    }

    function getLabelsFor(id, optionBox) {
      return gE(`[for="${id}"]`, 'all', optionBox ?? gE('#hvAABox'));
    }

    function getInputFriendlyName(input, optionBox) {
      const id = input.id || input.name;
      let labels = getLabelsFor(id);
      let inGroup, conditionDetail = '';
      if (!labels.length) {
        const regExp = /_(\d+)$/;
        inGroup = [...input.parentNode.childNodes].indexOf(input);
        const group = (id.match(regExp)?.[1] ?? 0)*1;
        const conditionGroup = id.replace(regExp, '');
        labels = getLabelsFor(conditionGroup, optionBox ?? gE('#hvAABox'));
        conditionDetail = ` ${UI.byLang('条件', '條件', 'Condition')} ${group+1}. ${inGroup}`;
      }
      const customize = input.closest('.customize');
      if (customize) {
        const outter = getLabelsFor(customize.className.match(/([^\s]*)Inner/)?.[1]);
        labels = [...outter, ...labels];
      }
      const outter = getLabelsFor(input.className.match(/([^\s]*)Inner/)?.[1]);
      labels = [...outter, ...labels];
      return UI.cutLang(`${Array.from(labels).map(x => x ? `${x.innerHTML}${conditionDetail} [${id}${conditionDetail ? `_${inGroup-1}` : ''}]` : x).reduce((acc, cur) => (acc ?? '') + (cur ?? ''), '') || id}`).replaceAll(new RegExp(`\\[${id}\\]((.|\s)+)\\[${id}\\]$`, 'g'), (match, inner) => inner.replaceAll(`[${id}]`,'')+`[${id}]`).replaceAll(/<.*?>/g,'').replaceAll(/&lt;/g, '<').replaceAll(/&gt;/g, '>');
    }

    async function setInputTitle(input) { try {
      const id = input.id || input.name;
      input.title ||= `Loading Name ... [${id}]`;
      runtime.titleQueue ??= [];
      if (runtime.titleQueue.includes(input)) return;
      runtime.titleQueue.push(input);
      await sleep(100);
      applyLabelTitle(input);
      if (flags.title) return;
      flags.title = true;
      processTitleQueue();
    } catch (err) { console.error(err); }}

    function applyLabelTitle(input) {
      getLabelsFor(input.id || input.name).forEach(label => {
        if (!label.getAttribute('for')) return;
        label.title = input.title;
      });
      const tab = input.closest('.hvAATabmenu>span');
      if (tab) tab.title = input.title;
    }

    async function processTitleQueue(max = 10) { try {
      const box = gE('#hvAABox');
      await until(() => max-- <= (box.style.display !== 'none' ? 9 : 0), _1s);
      await until(() => {
        let input = runtime.titleQueue.shift();
        if (!input) return;
        input.title = getInputFriendlyName(input);
        applyLabelTitle(input);
        return !runtime.titleQueue.length;
      }, 0);
      delete flags.title;
    } catch (err) { console.error(err); }}

    function setCustomizeInput(input, name, value, isLastCustomizeInput) {
      input.type = 'text';
      input.className = 'customizeInput';
      input.name = name;
      input.value = value ?? input.value;
      customizeInputAutoFit(input, isLastCustomizeInput);
      if(flags.option) setInputTitle(input);
    }

    function customizeInputAutoFit(input, isLastCustomizeInput) {
      const id = input.id || input.name;
      if (input.type === 'select-one' || input.disabled && id !== 'version') return;

      customizerInpuFit(input, isLastCustomizeInput);
      input.addEventListener('input', _ => customizerInpuFit(input, true));
      input.addEventListener('keydown', function(event) {
        if (event.key !== 'Enter') return;
        event.preventDefault();
        const currentGroup = input.parentNode;
        let nextGroup = event.shiftKey ? currentGroup.previousElementSibling : currentGroup.nextElementSibling;
        if (!nextGroup && !event.shiftKey) {
          const nextGroupIndex = input.name.match(/_(\d+)$/)[1] * 1 + 1;
          nextGroup = input.closest('.customize').appendChild(cE('div'));
          nextGroup.className = 'customizeGroup';
          nextGroup.innerHTML = `${nextGroupIndex + 1}. `
          setCustomizeInput(nextGroup.appendChild(cE('input')), input.name.replace(/_(\d+)$/, _ => `_${nextGroupIndex}`), undefined, true);

          const select = gE('.customizeBox select[name="groupChoose"]');
          if (select) {
            const selectOptions = gE('option', 'all', select);
            const prevSelected = select.value;
            const optionUI = select.appendChild(cE('option'));
            selectOptions[selectOptions.length - 1].value = nextGroupIndex + 1;
            selectOptions[selectOptions.length - 1].textContent = nextGroupIndex + 1;
            optionUI.value = 'new';
            optionUI.textContent = 'new';
            select.value = prevSelected;
          }
        }
        ((nextGroup ? gE(event.shiftKey ? '.customizeInput:last-child' : '.customizeInput:first-child', nextGroup) : undefined) ?? gE('.customizeInput:first-child', currentGroup)).focus()
      });
    }

    function selectFit(select) {
      if (select.value === 'undefined') {
        select.classList.add('optionDefault');
      } else {
        select.classList.remove('optionDefault');
      }
    }

    function customizerInpuFit(input, dynamic) {
      if (input.value === input.placeholder) {
        input.classList.add('optionDefault');
      } else {
        input.classList.remove('optionDefault');
      }
      autoResizeInput(input);
      if (!input.classList.contains('customizeInput') || !dynamic) return;
      if (input.nextElementSibling || !input.value) return;
      setCustomizeInput(input.parentNode.appendChild(cE('input')), input.getAttribute('name'));
    }

    function autoResizeInput(input) {
      const measure = cE('span');
      const styles = window.getComputedStyle(input);
      measure.style.cssText = `
      visibility: hidden;
      white-space: pre;
      font-family: ${styles.fontFamily};
      font-size: ${styles.fontSize};
      font-weight: ${styles.fontWeight};
      letter-spacing: ${styles.letterSpacing};
      padding: ${styles.padding};
      border: ${styles.border};
      box-sizing: ${styles.boxSizing};
      position: absolute;
      top: -9999px;
      left: -9999px;
  `;
      measure.textContent = input.value;
      runtime.document.body.appendChild(measure);
      input.style.width = measure.offsetWidth + 'px';
      runtime.document.body.removeChild(measure);
    }

    function creatCustomizeBox() { // 自定义条件界面
      let customizeBox = gE('.customizeBox');
      if (customizeBox) return customizeBox;
      customizeBox = gE('body').appendChild(cE('div'));
      customizeBox.className = 'customizeBox';
      const statusOption = creatCustomizeBox.prototype.statusOption ??= [
        '<option value="hp">hp</option>',
        '<option value="mp">mp</option>',
        '<option value="sp">sp</option>',
        '<option value="oc">oc</option>',
        '<option value="_hpDecimal">hpDecimal</option>',
        '<option value="_mpDecimal">mpDecimal</option>',
        '<option value="_spDecimal">spDecimal</option>',
        '<option value="_ocDecimal">ocDecimal</option>',
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
        '<option value="turn">turn</option>',
        '<option value="_isRoundType_">isRoundType</option>',
        '<option value="_ba">ba</option>',
        '<option value="_gr">gr</option>',
        '<option value="_iw">iw</option>',
        '<option value="_ar">ar</option>',
        '<option value="_rb">rb</option>',
        '<option value="_tw">tw</option>',
        '<option value="">- - - -</option>',
        '<option value="attackStatus">attackStatus</option>',
        '<option value="_phys">phys</option>',
        '<option value="_fire">fire</option>',
        '<option value="_cold">cold</option>',
        '<option value="_elec">elec</option>',
        '<option value="_wind">wind</option>',
        '<option value="_divi">divi</option>',
        '<option value="_forb">forb</option>',
        '<option value="_attackStatusCur">attackStatusCur</option>',
        '<option value="_physCur">physCur</option>',
        '<option value="_fireCur">fireCur</option>',
        '<option value="_coldCur">coldCur</option>',
        '<option value="_elecCur">elecCur</option>',
        '<option value="_windCur">windCur</option>',
        '<option value="_diviCur">diviCur</option>',
        '<option value="_forbCur">forbCur</option>',
        '<option value="fightingStyle">fightingStyle</option>',
        '<option value="_nt">nt</option>',
        '<option value="_1h">1h</option>',
        '<option value="_2h">2h</option>',
        '<option value="_dw">dw</option>',
        '<option value="_staff">staff</option>',
        '<option value="">- - - -</option>',
        '<option value="skillOTOS">skillOTOS</option>',
        '<option value="_isCd_">isCd</option>',
        '<option value="_spirit">spirit</option>',
        '<option value="_buffTurn_">buffTurn</option>',
        '<option value="_buffStack_">buffStack</option>',
        '<option value="">- - - -</option>',
        '<option value="_targetBuffStack_">targetBuffStack</option>',
        '<option value="_targetBuffTurn_">targetBuffTurn</option>',
        '<option value="_targetIsAlive">targetIsAlive</option>',
        '<option value="_targetHp">targetHp</option>',
        '<option value="_targetMp">targetMp</option>',
        '<option value="_targetSp">targetSp</option>',
        '<option value="_targetHpDecimal">targetHpDecimal</option>',
        '<option value="_targetMpDecimal">targetMpDecimal</option>',
        '<option value="_targetSpDecimal">targetSpDecimal</option>',
        '<option value="_targetOrder">targetOrder</option>',
        '<option value="_targetWeight">targetWeight</option>',
        '<option value="_targetRank">targetRank</option>',
        '<option value="_targetName">targetName</option>',
        '<option value="_targetBossType">targetBossType</option>',
        '<option value=""></option>',
      ].join('');
      customizeBox.style.cssText += 'display: none;';
      customizeBox.innerHTML = [
        '<span><l01><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md#自定义判断条件" target="_blank">?</a></l01><l2><a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README_en.md#customize-condition" target="_blank">?</a></l2></span>',
        `<span class="hvAAInspect" title="off">${String.fromCharCode(0x21F1.toString(10))}</span>`,
        '<select name="groupChoose"></select>',
        `<select name="statusA">${statusOption}</select>`,
        '<select name="compareAB"><option value="&gt;">&gt;</option><option value="&lt;">&lt;</option><option value="&gt;=">≥(&gt;=)</option><option value="&lt;=">≤(&lt;=)</option><option value="=">＝</option><option value="!=">≠(!=,<>,~=)</option></select>',
        `<select name="statusB">${statusOption}</select>`,
        UI.button.class('groupAdd', 'ADD')
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
          if (target.id === 'csp' || target.tagName.toUpperCase() === 'BODY') {
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
        const target = runtime.customizeTarget;
        const selects = gE('select', 'all', customizeBox);
        let groupChoose = selects[0].value;
        let group;
        if (groupChoose === 'new') {
          const select = gE('select[name="groupChoose"]', customizeBox);
          const selectOptions = gE('option', 'all', select);
          groupChoose = selectOptions.length;
          group = target.appendChild(cE('div'));
          group.className = 'customizeGroup';
          group.innerHTML = `${groupChoose}. `;
          selects[0].click();
          const prevSelected = select.value;
          const optionUI = select.appendChild(cE('option'));
          selectOptions[selectOptions.length-1].value = groupChoose;
          selectOptions[selectOptions.length-1].textContent = groupChoose;
          optionUI.value = 'new';
          optionUI.textContent = 'new';
          select.value = prevSelected;
        } else {
          group = gE('.customizeGroup', 'all', target)[groupChoose - 1];
        }
        const items = gE('*', 'all', group);
        let input;
        for (let i of range(items, 0, -1)) {
          if (items[i-1].value) break;
          input = items[i-1];
        }
        setCustomizeInput(input ??= group.appendChild(cE('input')), `${target.getAttribute('name')}_${groupChoose - 1}`, `${selects[1].value} ${selects[2].value} ${selects[3].value}`, true);
        updateGroup(true);
      };
      return customizeBox;

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

    function updateGroup(keepPosition) {
      const target = runtime.customizeTarget;
      const group = gE('.customizeGroup', 'all', target);
      const customizeBox = gE('.customizeBox');
      if (group.length + 1 === gE('select[name="groupChoose"]>option', 'all', customizeBox).length) {
        updateGroupUI();
        return;
      }
      const select = gE('select[name="groupChoose"]', customizeBox);
      select.textContent = '';
      for (const i of range(group.length + 1)) {
        const optionUI = select.appendChild(cE('option'));
        optionUI.textContent = optionUI.value = i === group.length ? 'new' : i + 1;
      }
      updateGroupUI();

      function updateGroupUI() {
        const position = target.getBoundingClientRect();
        const bodyPosition = runtime.document.body.getBoundingClientRect();
        customizeBox.style.cssText += `z-index: 20;display: block; height: ${gE('.customizeGroup', 'all', target).length * 30 + 60}px;`
        if (!keepPosition) {
          customizeBox.style.top = `${position.bottom - bodyPosition.top}px`;
          customizeBox.style.left = `${position.left - bodyPosition.left}px`;
        }
      }
    }

    function setAlarm(e, testSrc) { // 发出警报
      const option = g.option;
      e = e || 'Common';
      if (option.notification || testSrc) {
        setNotification(e);
      }
      if (option.alert && option.audioEnable?.[e] || testSrc) {
        setAudioAlarm(e, testSrc);
      }
    }

    function playAudio(audio) {
      audio.onPlay ??= () => {
        audio.removeEventListener('canplaythrough', audio.onPlay);
        audio.play();
      };
      audio.removeEventListener('canplaythrough', audio.onPlay);
      audio.addEventListener('canplaythrough', audio.onPlay);
      // 如果音频已缓存，canplaythrough 可能不会再次触发，此时可直接播放
      if (audio.readyState >= 3) { // HAVE_FUTURE_DATA 或更高
        audio.play();
      }
      if (audio.loop) {
        const battleNow = unsafeWindow.battle;
        (async ()=> {
          let focused;
          await until(()=> {
            if (!focused && document.hasFocus()) {
              focused = true;
              document.addEventListener('mousemove', () => {
                audio.pause();
                audio.loop = false;
              }, true);
            }
            return !audio.loop || (unsafeWindow.battle !== battleNow);
          });
          audio.pause();
        })();
      }
    }

    function setAudioAlarm(e, testSrc) { // 发出音频警报
      const option = g.option;
      let audio = gE(`#hvAAAlert-${e}`);
      const fileType = '.ogg'; // var fileType = (/Chrome|Safari/.test(navigator.userAgent)) ? '.mp3' : '.wav';
      if (!audio) {
        audio = gE('body').appendChild(cE('audio'));
        audio.id = `hvAAAlert-${e}`;
        audio.controls = true;
      }
      if (!audio.src || audio.readyState <= 2 || (testSrc && audio.src !== testSrc)) {
        audio.src = testSrc ?? option.audio?.[e] ?? `https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/${e}${fileType}`;
      }
      audio.loop = (e === 'Riddle') && !testSrc;
      playAudio(audio);
    }

    function setNotification(e) { // 发出桌面通知
      const notification = setNotification.prototype.notification ??= {
        Common: {
          text: UI.byLang('未知', '未知', 'unknown'),
          time: 5,
        },
        Error: {
          text: UI.byLang('某些错误发生了', '某些錯誤發生了', 'Some errors have occurred'),
          time: 10,
        },
        Defeat: {
          text: UI.byLang('游戏失败\n玩家可自行查看战斗Log寻找失败原因', '遊戲失敗\n玩家可自行查看戰鬥Log尋找失敗原因', 'You have been defeated.\nYou can check the battle log.'),
          time: 5,
        },
        Exit: {
          text: UI.byLang('游戏失败自动退出', '遊戲失敗自動退出', 'You have been defeated. Battle auto exited.'),
          time: 5,
        },
        Riddle: {
          text: UI.byLang('小马答题\n紧急！\n紧急！\n紧急！', '小馬答題\n緊急！\n緊急！\n緊急！', 'Riddle\nURGENT\nURGENT\nURGENT'),
          time: 30,
        },
        Victory: {
          text: UI.byLang('游戏胜利\n页面将在3秒后刷新', '遊戲勝利\n頁面將在3秒後刷新', 'You\'re victorious.\nThis page will refresh in 3 seconds.'),
          time: 3,
        },
        Pause: {
          text: UI.byLang('触发自动暂停', '觸發自動暫停', 'Auto paused'),
          time: 3,
        },
        Flee: {
          text: UI.byLang('触发自动逃跑', '觸發自動逃跑', 'Auto fleed'),
          time: 3,
        },
        BattleUnresponsive: {
          text: UI.byLang('战斗无响应', '戰鬥無響應', 'Battle unresponsive'),
          time: 3,
        },
        Test: {
          text: UI.byLang('测试文本', '測試文本', 'testText'),
          time: 3,
        },
      }[e];
      if (typeof GM_notification !== 'undefined') {
        GM_notification({
          text: notification.text,
          image: `${window.location.origin}${unsafeWindow.IMG_URL}hentaiverse.png`,
          highlight: g.option.focusNotification,
          timeout: notification.time * _1s,
        });
      }
      if (!window.Notification || window.Notification.permission === 'denied') return;
      window.Notification.requestPermission(status => {
        if (status !== 'granted') return;
        const n = new window.Notification(notification.text, { icon: `${unsafeWindow.IMG_URL}hentaiverse.png` });
        setTimeout(() => n?.close(), notification.time * _1s);
        const nClose = function (e) {
          n?.close();
          document.removeEventListener(e.type, nClose, true);
        };
        document.addEventListener('mousemove', nClose, true);
      });
    }

    function imgArray2img(...img) {
      return img.join('_').replace('_png', 'png');
    }

    function resetFormulaCache() {
      returnValueGetter.prototype.cache = {
        source: [
          { get: () => realtime },
          { get: () => g.battle ?? {} },
          { get: () => 'func' },
          { get: () => runtime },
          { get: () => g.option },
          { get: () => script },
          { get: () => getValue('battle', true) ?? {} },
        ],
        static: {}
      }
    }

    function returnValueGetter(paramResultsGetter, targetGetter) {
      const paramForSort = returnValueGetter.prototype.paramForSort ??= ['rank', 'tier', 'maxtier', 'sumtier', 'counttier', ...range(10).map(n => `counttier${n}`)];
      const modes = returnValueGetter.prototype.modes ??= ['min', 'max', 'count', 'sum', ...paramForSort];
      const minmaxModes = returnValueGetter.prototype.minmaxModes ??= (() => {
        const prefixs = ['', 'a', 'ag', 'g'];
        return prefixs.reduce((result, f) => result.concat(modes.map(m => f + m)), []);
      })();
      returnValueGetter.prototype.func ??= {
        ar() {
          return g.battle.roundType === 'ar' ? 1 : 0;
        },
        gr() {
          return g.battle.roundType === 'gr' ? 1 : 0;
        },
        tw() {
          return g.battle.roundType === 'tw' ? 1 : 0;
        },
        rb() {
          return g.battle.roundType === 'rb' ? 1 : 0;
        },
        iw() {
          return g.battle.roundType === 'iw' ? 1 : 0;
        },
        ba() {
          return g.battle.roundType === 'ba' ? 1 : 0;
        },
        isRoundType(t) {
          return g.battle.roundType === t ? 1 : 0;
        },
        phys() {
          return realtime.attackStatus * 1 === 0 ? 1 : 0;
        },
        fire() {
          return realtime.attackStatus * 1 === 1 ? 1 : 0;
        },
        cold() {
          return realtime.attackStatus * 1 === 2 ? 1 : 0;
        },
        elec() {
          return realtime.attackStatus * 1 === 3 ? 1 : 0;
        },
        wind() {
          return realtime.attackStatus * 1 === 4 ? 1 : 0;
        },
        divi() {
          return realtime.attackStatus * 1 === 5 ? 1 : 0;
        },
        forb() {
          return realtime.attackStatus * 1 === 6 ? 1 : 0;
        },
        attackStatusCur() {
          return getCurrentAttackStatus() * 1;
        },
        physCur() {
          return getCurrentAttackStatus() * 1 === 0 ? 1 : 0;
        },
        fireCur() {
          return getCurrentAttackStatus() * 1 === 1 ? 1 : 0;
        },
        coldCur() {
          return getCurrentAttackStatus() * 1 === 2 ? 1 : 0;
        },
        elecCur() {
          return getCurrentAttackStatus() * 1 === 3 ? 1 : 0;
        },
        windCur() {
          return getCurrentAttackStatus() * 1 === 4 ? 1 : 0;
        },
        diviCur() {
          return getCurrentAttackStatus() * 1 === 5 ? 1 : 0;
        },
        forbCur() {
          return getCurrentAttackStatus() * 1 === 6 ? 1 : 0;
        },

        nt() {
          return realtime.fightingStyle * 1 === 1 ? 1 : 0;
        },
        onehanded() {
          return realtime.fightingStyle * 1 === 2 ? 1 : 0;
        },
        twohanded() {
          return realtime.fightingStyle * 1 === 3 ? 1 : 0;
        },
        dw() {
          return realtime.fightingStyle * 1 === 4 ? 1 : 0;
        },
        staff() {
          return realtime.fightingStyle * 1 === 5 ? 1 : 0;
        },
        isCd(id) { // is cool down done
          return isOn(id) ? 1 : 0;
        },
        spirit() {
          return gE('#ckey_spirit[src*="spirit_a"]') ? 1 : 0;
        },
        buffTurn(...img) {
          return getBuffTurnFromImg(getBuff(imgArray2img(...img)));
        },
        buffStack(...img) {
          return getBuffStackFromImg(getBuff(imgArray2img(...img)));
        },
        hpDecimal() {
          return realtime.hp / 100;
        },
        mpDecimal() {
          return realtime.mp / 100;
        },
        spDecimal() {
          return realtime.sp / 100;
        },
        ocDecimal() {
          return realtime.oc / 100;
        },
      };
      let currentGroup = null;
      const func = {
        ...returnValueGetter.prototype.func,
        targetDB(...params) {
          let param = minmaxModes.includes(params[0]) ? params.shift() : undefined;
          const key = params.shift();
          return switchMinMax(param, t => unsafeWindow.HVMonsterDB?.getCurrentMonstersInformation()[`mkey_${getMonsterID(t)}`]?.[key] ?? 0 );
        },
        weighted(...params) {
          const funcName = params.shift();
          const battle = g.battle;
          let result;
          if (!flags.weight) {
            const origin = copy(g.battle.monsterStatus);
            battle.monsterStatus.forEach(t => { t.finWeight += resolveSkillExtraWeight(t); });
            battle.monsterStatus = battle.monsterStatus.sortBy(x => x.finWeight);
            result = func[funcName](...params);
            battle.monsterStatus = origin;
          } else {
            result = func[funcName](...params);
          }
          return result;
        },
        targetBuffStack(...img) {
          const getter = (t, i) => getBuffStackFromImg(getBuff(imgArray2img(i), getMonsterID(t)));
          let param = minmaxModes.includes(img[0]) ? img.shift() : undefined;
          return switchMinMax(param, t => getter(t, img));
        },
        targetBuffTurn(...img) {
          const getter = (t, i) => getBuffTurnFromImg(getBuff(imgArray2img(i), getMonsterID(t)));
          let param = minmaxModes.includes(img[0]) ? img.shift() : undefined;
          return switchMinMax(param, t => getter(t, img));
        },
        targetOrder(param) {
          return switchMinMax(param, t => t.order);
        },
        targetWeight(param) {
          return switchMinMax(param, t => t.finWeight);
        },
        targetRank(param) {
          return switchMinMax(param, t => Object.entries(g.battle.monsterStatus).find(([k, v]) => v.order === t.order)[0] * 1);
        },
        targetName(param) {
          param ??= targetGetter();
          const mon = getMonster(getMonsterID(param));
          return gE(`.btm3>div>div`, mon).innerText.replace(' ', '_');
        },
        targetBossType(param) {
          return switchMinMax(param, t => {
            const name = func.targetName(t);
            switch(name.replace('_', ' ')) {
              case 'Manbearpig':
              case 'White Bunneh':
              case 'Mithra':
              case 'Dalek':
                return 1; // BOSS
              case 'Konata':
              case 'Mikuru Asahina':
              case 'Ryouko Asakura':
              case 'Yuki Nagato':
                return 2; // Legendaries
              case 'Real Life':
              case 'Invisible Pink Unicorn':
              case 'Flying Spaghetti Monster':
                return 3; // Gods
              case 'Rhaegal':
              case 'Viserion':
              case 'Drogon':
                return 4; // A Dance with Dragons
              case 'Skuld':
              case 'Urd':
              case 'Verdandi':
              case 'Yggdrasil':
                return 5; // Trio and the Tree
              case 'Recycled Boss Rush':
              case 'Bottomless Dungeon':
              case 'New Game +':
              case 'Achievement Grind':
              case 'Time Trial Mode':
              case 'Hardcore Mode':
                return 6; // Post Game Content
              case 'Fluttershy':
              case 'Gummy':
              case 'Rainbow Dash':
              case 'Twilight Sparkle':
              case 'Rarity':
              case 'Applejack':
              case 'Pinkie Pie':
              case 'Angel Bunny':
              case 'Spike':
                return 7; // Ponies
              default:
                return 0;
            }});
        },
        targetIsAlive(param) {
          return switchMinMax(param, t => t.isDead ? 0 : 1);
        },
        targetHPRaw(param) {
          return switchMinMax(param, t => t.hpNow);
        },
        targetHPFull(param) {
          return switchMinMax(param, t => t.hp);
        },
        targetHp(param) {
          return switchMinMax(param, t => Math.floor(func.targetHpDecimal() * 100));
        },
        targetMp(param) {
          return switchMinMax(param, t => Math.floor(func.targetMpDecimal() * 100));
        },
        targetSp(param) {
          return switchMinMax(param, t => Math.floor(func.targetSpDecimal() * 100));
        },
        targetHpDecimal(param) {
          return switchMinMax(param, t => t.hpNow / t.hp);
        },
        targetMpDecimal(param) {
          return switchMinMax(param, t => t.mpNow);
        },
        targetSpDecimal(param) {
          return switchMinMax(param, t => t.spNow);
        },
        targetGroup(...args) {
          const groupMode = args.shift();
          const numArgs = args.map(arg => arg === '' ? -1 : parseInt(arg));
          if (numArgs.some(isNaN)) throw new Error(`Error args for targetGroup, args: ${args}.`);
          const currentTarget = targetGetter();
          const targets = g.battle.monsterStatus;
          switch(groupMode) {
            case 'a': // all targets (as default if currentGroup is undefined)
              currentGroup = targets;
              break;
            case 's': // 等数量自动分组
              {
                const groupSize = numArgs[0];
                if (groupSize <= 0) throw new Error(`Using zero/subzero or error groupSize in targetGroup, args: ${args}.`);
                const getGroupIndex = t => Math.floor(t.order / groupSize);
                const groupIndex = getGroupIndex(currentTarget);
                currentGroup = targets.filter(t => getGroupIndex(t) === groupIndex);
              }
              break;
            case 'r': // 按照和current的距离
              {
                let [rangeUp, rangeDown] = [numArgs[0], numArgs[1]];
                if (rangeUp === undefined) throw new Error(`1 args at least is required for targetGroup as mode 'r'.`);
                // 对称范围. 只有单参数的 `targetGroup_r_[r1]` 时会是该情况，双参数的`targetGroup_r_[r1]_`时range2在param split后赋值为 ''，然后在numArgs中赋值为-1
                rangeDown ??= rangeUp;
                // >= 10 的，视作反方向。即 10 <=> -1 <=> ''(省略但有_分割)
                [rangeUp, rangeDown] = [rangeUp, rangeDown].map(r => r >= 10 ? 9 - r : r );
                const center = currentTarget.order;
                const [startOrder, endOrder] = [center - rangeUp, center + rangeDown];
                currentGroup = targets.filter(t => t.order >= startOrder && t.order <= endOrder);
              }
              break;
            case 'oa': // 按照指定order，忽略current是否在内
            case 'o': // 按照指定order
              {
                const [startOrder, endOrder] = numArgs;
                startOrder ??= -1;
                if ([undefined, -1].includes(endOrder))
                {
                  endOrder = 10;
                }
                // 检查当前评估的怪物是否在区间内
                if (groupMode !== 'oa' && (currentTarget.order < startOrder || currentTarget.order > endOrder)) {
                  currentGroup = null;
                } else {
                  // 检查该区间内是否有活怪带有此 Buff
                  currentGroup = targets.filter(t => t.order >= startOrder && t.order <= endOrder);
                }
              }
              break;
            default:
              throw new Error(`Unsupported targetGroup mode: ${groupMode}.`);
          }
          return currentGroup ? Object.keys(currentGroup).length : 0;
        },
        undefined: () => undefined,
          null: () => null
    };

    function switchMinMax(param, defaultResult, skipAliveCheck = false, targets = undefined) {
      if ([ ...modes.map(n => `ga${n}`), ...modes.map(n => `g${n}`)].includes(param)) {
        return switchMinMax(param.replace(/^g/, ''), defaultResult, skipAliveCheck, currentGroup);
      }
      if ([ ...modes.map(n => `a${n}`), ...modes.map(n => `ag${n}`)].includes(param)) {
        return switchMinMax(param.replace(/^a/, ''), defaultResult, true, targets);
      }
      if (targets === undefined) targets = g.battle.monsterStatus; // 只处理 undefined，null 是空 group
      if (!targets) return 0;
      if (!skipAliveCheck) targets = targets.filter(t => !t.isDead);

      let results, target, counter;
      if (paramForSort.includes(param)) {
        results = targets.map(t => { return { target: t, value: defaultResult(t) }; }).sortBy(r => r.value);
        target = targetGetter();
        if (param.includes('tier')) {
          let last, tier = -1;
          for (const result of results) {
            if (result.value !== last) {
              last = result.value;
              tier++;
            }
            result.tier = tier;
          }
          counter = param.match(/counttier(.*)/)?.[1] * 1;
          if (!isNaN(counter)) param = 'counttier';
        }
      }

      switch (param) {
        case 'counttier':
          {
            const targetTier = !isNaN(counter) ? counter : results.find(r => r.target.order === target.order).tier;
            return results.filter(r => r.tier === targetTier).length;
          }
        case 'sumtier':
          return Math.max(...results.map(r => r.tier));
        case 'maxtier':
          return Math.max(...results.map(r => r.tier));
        case 'tier':
          return results.find(r => r.target.order === target.order).tier;
        case 'rank':
          return results.findIndex(r => r.target.order === target.order);
        case 'count':
          return targets.map(defaultResult).reduce((acc, cur) => acc + Math.sign(cur), 0);
        case 'sum':
          return targets.map(defaultResult).reduce((acc, cur) => acc + cur, 0);
        case 'max':
          return Math.max(...targets.map(defaultResult));
        case 'min':
          return Math.min(...targets.map(defaultResult));
        default:
          if (param !== undefined) console.warn(`Unknown param`, param, `for switchMinMax, fallback to default.`);
          return defaultResult(targetGetter());
      }
    }

    const getter = function (str, isDebug) {
      const debug = str.match(/^#/);
      if (debug) str = str.replace(/^#/, '');

      const onResult = (r) => {
        if (debug || isDebug) paramResultsGetter()[str] = r;
        if (debug) console.log([str], r);
        return r;
      }
      // 旧版本/强制使用func
      if (str.match(/^_/) && !str.match(/\./)) {
        let arr = str.split('_');
        return onResult(func[arr[1]](...[...arr].splice(2)));
      }
      if (!isNaN(str * 1)) { // 数字直接返回
        return onResult(str * 1);
      }
      // 将不是数字小数点的 . 转为 _ 以便进行参数分割
      const nou = r => r === undefined || r === null; // nullOrUndefined
      const paramList = str.replace(/[^\d](\.)/g, match => match.replace('.', '_')).split('_');

      let result, isInData;
      while (paramList.length) {
        const key = paramList.shift();
        if (!isInData && nou(result)) {
          for (const source of returnValueGetter.prototype.cache.source) {
            let cached = source.cached ??= source.get();
            if (cached === 'func') cached = func;
            result = cached[key];
            if (typeof result === 'function') result = result(...paramList);
            if (!nou(result)) break;
          }
          if (nou(result)) result = returnValueGetter.prototype.cache.static[key] ??= getValue(key);
          if (nou(result)) break;
          isInData = true; // 存在顶层数据
          continue;
        }
        if (typeof result === 'string') { try {
          result = JSON.parse(result);
        } catch (err) {}}
        if (['number', 'string'].includes(typeof result)) continue;
        result = result[key];
        if (nou(result)) break;
      }

      result ??= isInData ? 0 : result; // 存在顶层数据时默认为0
      if (!isNaN(+result)) return onResult(result * 1);
      if (result !== undefined) return onResult(result);
      const matchInner = str.match(/^"(.*)"$|^'(.*)'$/);
      let inner;
      if (inner = matchInner?.[1]) return onResult(inner.replaceAll('\\"', '"'));
      if (inner = matchInner?.[2]) return onResult(inner.replaceAll("\\'", "'"));
      return onResult(str);
    }
    getter.paramResultsGetter = paramResultsGetter;
    return getter;
  }

  function handleRPNFormula(formula, returnValue) {
    let k, isDebug, result;
    if (!formula) return 0;
    if (!isNaN(formula * 1)) return formula * 1; // 纯数字直接处理
    k = formula.replace(/,\s*(.*)\s*,/, (match, p1) => {
      switch (p1) {
        case '>':
        case '1':
          return '>';
        case '<':
        case '2':
          return '<';
        case '≥':
        case '>=':
        case '3':
          return '>=';
        case '≤':
        case '<=':
        case '4':
          return '<=';
        case '=':
        case '==':
        case '===':
        case '5':
          return '==';
        case '≠':
        case '~=':
        case '<>':
        case '!=':
        case '6':
          return '!=';
      }
    }).replace(/===/g, '==').replace(/!==/g, '!=').replace(/(?<![=<>!~])=(?!=)/g, '==')
      .replace(/≥|≤|≠|~=|<>/g, (match) => {
      switch (match) {
        case '≥':
          return '>=';
        case '≤':
          return '<=';
        case '≠':
        case '~=':
        case '<>':
          return '!=';
      }
    }).replace('_1h', '_onehanded').replace('_2h', '_twohanded');
    isDebug = k.match(/^@/);
    result = $RPN.evaluate(k.replace(/^@/, ''), str => returnValue(str, isDebug));
    if (isDebug) console.log([k], result, returnValue.paramResultsGetter());
    return result;
  }

  function resolveRPNFormula(formula, target) {
    let paramResults = {};
    const returnValue = returnValueGetter(() => paramResults, () => target);
    return handleRPNFormula(formula, returnValue);
  }

  function checkCondition(params, targets = undefined) {
    let i, j, target, paramResults = {};
    targets ??= [g.battle.monsterStatus[0]];
    if (!params || !Object.keys(params).length) {
      return targets[0];
    }
    const returnValue = returnValueGetter(() => paramResults, () => target);
    for (i in params) { for (target of targets.filter(t => !t.isDead)) {
      paramResults = {};
      let paramResult = true;
      for (j of range(params[i])) {
        let result = true;
        if (!Array.isArray(params[i])) continue;
        const formula = params[i][j];
        result = handleRPNFormula(formula, returnValue);
        if (result) continue;
        paramResult = false;
        break;
      }
      if (paramResult) return target;
    }} return undefined;
  }

  function pauseChange(temporaryPause) { // 暂停状态更改
    const option = g.option;
    const disabled = getPause();
    const button = gE('.pauseChange');
    temporaryPause = typeof temporaryPause === 'object' ? temporaryPause?.temporaryPause : temporaryPause;
    if (!disabled) {
      if (button) button.innerHTML = UI.button.continue(option);
      runtime.document.title = titlePause();
      setPause(runtime.document.title, temporaryPause);
      return;
    }
    if (button) button.innerHTML = UI.button.pause(option);
    runtime.document.title = gE('#navbar') ? 'The Hentaiverse' : disabled;
    setPause('', temporaryPause);
    if (gE('#navbar') || gE('#btcp')) return; // not in battle
    onBattleRound();
  }

  function stepIn() {
    flags.stepIn = true;
    if (!getPause()) return;
    times.now = time(0);
    pauseChange(true);
  }

  function onStepInDone() {
    if (!flags.stepIn) return;
    delete flags.stepIn;
    pauseChange(true);
  }

  function getCurrentUser() {
    const cookie = runtime.document.cookie.split("; ");
    for (const cookieObj of cookie) {
      const match = cookieObj.match(/ipb_member_id=(\d+)/);
      if (match) {
        return match[1] * 1;
      }
    }
  }

  // 战斗外//
  function quickSite() { // 快捷站点
    const quickSiteBar = gE('body').appendChild(cE('div'));
    quickSiteBar.className = 'quickSiteBar';
    quickSiteBar.innerHTML = '<span><a href="javascript:void(0);"class="quickSiteBarToggle">&lt;&lt;</a></span><span><a href="https://tieba.baidu.com/f?kw=hv网页游戏"target="_blank"><img src="https://www.baidu.com/favicon.ico" class="favicon"></img>贴吧</a></span><span><a href="https://forums.e-hentai.org/index.php?showforum=76"target="_blank"><img src="https://forums.e-hentai.org/favicon.ico" class="favicon"></img>Forums</a></span>';
    g.option.quickSite?.forEach((site) => {
      quickSiteBar.innerHTML = `${quickSiteBar.innerHTML}<span title="${site.name}"><a href="${site.url}"target="_self">${(site.fav) ? `<img src="${site.fav}"class="favicon"></img>` : ''}${site.name}</a></span>`;
    });
    gE('.quickSiteBarToggle', quickSiteBar).onclick = function () {
      const spans = gE('span', 'all', quickSiteBar);
      for (const i of range(spans)) {
        spans[i].style.display = (this.textContent === '<<') ? 'none' : 'block';
      }
      this.textContent = (this.textContent === '<<') ? '>>' : '<<';
    };
  }

  async function autoSwitchIsekai() {
    const option = g.option;
    await sleep(option.isekaiTime * _1s - (time(0) - times.idle));
    await waitPause();
    $async.logSwitch(arguments);
    if (!option.isekai) return; // 若不启用自动跳转
    const now = time(0);
    times.switch = getValue('lastSwitch') ?? 0;
    const remain = times.switch * 1 + (option.isekaiCD ?? 0) * _1s - now;
    await sleep(remain);
    await waitPause();
    times.switch = setValue('lastSwitch', now);
    $ajax.openNoFetch(`${window.location.href.slice(0, window.location.href.indexOf('.org') + 4)}/${_server.isekai ? '' : 'isekai/'}`);
    $async.logSwitch(arguments);
  }

  function isInBattle(doc) {
    return gE('#riddlecounter, #battle_main', doc);
  }

  async function restorePersonaAndEquipSet() {
    const persona = getValue('lastPersona');
    let changed;
    if (persona) {
      await $ajax.fetch(queryToPersistent(`?s=Character&ss=ch`), `persona_set=${persona}`);
      delValue('lastPersona');
      changed = true;
    }
    const equipSet = getValue('lastequipSet');
    if (equipSet) {
      await $ajax.fetch(queryToPersistent(`?s=Character&ss=eq`), `equip_set=${equipSet}`);
      delValue('lastEquipSet');
      changed = true;
    }
    return changed;
  }

  function remainTime2Str(r, short) {
    const digits = Math.max(2, r >= _1h ? 3 : 2);
    const detail = timeStr(r, digits);
    if (short) return detail;
    return ` ${UI.l('剩余', '剩餘', 'Remain')} ${Math.floor(r / _1s)} (${detail})`;
  }

  function appendEncounterUITitle(key, inner) {
    const ui = gE('.encounterUI');
    if (!ui) return;
    const regExp = new RegExp(`\\n\\[${key}\\](.|\\n)*\\[${key}\\]`);
    if (!ui.title.match(regExp)) ui.title += `\n[${key}][${key}]`;
    ui.title = UI.cutLang(ui.title.replace(regExp, `\n[${key}]\n${inner}\n[${key}]`));
  }

  async function displayCDRemain() { try {
    const option = g.option;
    await until(() => {
      const optionBox = gE('#hvAABox');
      const ui = gE('.encounterUI');
      if (optionBox.style.display === 'none' && !ui) return;
      const idleStart = times.idle;
      const now = time(0);
      const conditions = {};
      conditions.encounter = option.encounter;
      conditions.arena = option.idleArena && option.idleArenaValue;
      conditions.switch = option.isekai;
      conditions.switchCD = conditions.switch;
      conditions.onIdle = conditions.encounter || conditions.switch || conditions.arena;
      const durations = {
        onIdle: { name: UI.l('闲置延时', '閒置延時', 'Idle Delay'), selector: '.onIdleRemain', start: times.idle, wait: option.onIdleDelay },
        encounter: { name: UI.l('遭遇延时', '遭遇延時', 'Encounter Delay'), selector: '.encounterDelayRemain', start: times.encounter.start ?? now, wait: option.encounterDelay },
        arena: { name: UI.l('闲置竞技场', '閒置競技場', 'Idle Arena'), selector: '.arenaRemain', start: idleStart ?? now, wait: option.idleArenaTime },
        switch: { name: UI.l('闲置异世界', '閒置異世界', 'Idle Isekai'), selector: '.isekaiSwitchRemain', start: idleStart ?? now, wait: option.isekaiTime },
        switchCD: { name: UI.l('异世界CD', '異世界CD', 'Isekai CD'), selector: '.isekaiCDRemain', start: times.switch ??= getValue('lastSwitch'), wait: option.isekaiCD },
      }
      let idleStarted;
      const remain = Object.fromEntries(Object.entries(durations).map(([k, data]) => {
        const r = Math.floor(Math.max(0, data.start + (data.wait ?? 0) * _1s - now) / _1s) * _1s;
        if (k === 'onIdle') idleStarted = r <= 0;
        return [k, { ...data, time: r, str: remainTime2Str(r), condition: conditions[k] }];
      }));
      if (optionBox.style.display !== 'none') Object.values(remain).forEach(r => gE(r.selector, 'all').forEach(ui => { ui.innerHTML = r.str }));
      if (ui) appendEncounterUITitle('i', Object.values(remain).filter(data => data.condition && data.wait).map(r => `${r.name}: ${r.str}`).join('\n'))
      return idleStarted && Object.values(remain).every(r => !r.time);
    }, _1s);
  } catch (err) { console.error(err); }}

  async function asyncOnIdle() { try {
    let option = g.option;
    const beforeIdle = times.idle = time(0);
    displayCDRemain();
    $async.logSwitch(arguments);
    await updateEncounter(false);
    if (!forIsekaiEncounter && option.onIdleDelay) {
      const delay = option.onIdleDelay * _1s;
      until(async () => {
        const remain = beforeIdle + delay - time(0);
        if (remain <= 0) return true;
        await waitPause();
        displayProcess(`[-${remainTime2Str(remain, true)}]${UI.byLang('等待进入闲置', '等待進入閒置', 'Wait for enter idle')}`);
      }, 250);
      await sleep(option.onIdleDelay * _1s);
    }
    const idleStart = times.idle = time(0);
    await waitPause();
    displayUntil(() => `[TIMER]${UI.byLang('人物套装检查', '人物套裝檢查', 'Persona/EquipSet check')}`);
    if (forIsekaiEncounter) {
      const persistent = await $ajax.fetch(window.location.href.replace('/isekai', ''));
      if (!persistent || isInBattle($doc(persistent))) {
        $async.logSwitch(arguments);
        displayProcess();
        return;
      }
    } else {
      await restorePersonaAndEquipSet();
    }
    displayProcess();

    const steps = [
      [{ step: 'proficiency', method: asyncSetProficiency, condition: true }],
      [{ step: 'ability', method: asyncSetAbilityData, condition: true }],
      [{ step: 'stamina', method: asyncSetStamina, condition: true }],
      [{ step: 'item', method: asyncGetItems, condition: option.restoreStamina },
       { step: 'supply', method: checkSupply, condition: option.encounterSupply, check: true }],
      [{ step: 'repair', method: asyncCheckRepair, condition: option.encounterRepair, check: true }],
      [{ step: 'storage', method: asyncCheckEquStorage, condition: option.encounterEquStorage, check: true }],
    ];

    const ready = { isChecked: () => ready.encounter && !steps.find(group => group.find(step => step.check && !ready[step.step]))};
    let battleStarted;
    if (_server.isekai) {
      displayUntil(() => `[TIMER]${UI.byLang('异世界遭遇', '異世界遭遇', 'Isekai encounter')}`);
      await setReady('encounter');
      if (!ready.encounter) {
        $async.logSwitch(arguments);
        displayProcess();
        return;
      }
    }
    let done = 0;
    displayUntil(() => `[${done}/${steps.length}][TIMER]${UI.byLang('检查闲置', '檢查閒置', 'Idle check')}`, () => done >= steps.length);
    await Promise.all([...steps.map(group => (async () => { try {
      for (const step of group) {
        await setReady(step.step, await step.method() || !step.check);
      }
      done++;
    } catch (err) { console.error(err); }})()), forIsekaiEncounter ? undefined : updateArena()]);
    if (!forIsekaiEncounter) {
      if (ready.isChecked() && option.idleArena && option.idleArenaValue) {
        displayUntil(() => `[TIMER]${UI.byLang('竞技场更新', '競技場更新', 'Arena update')}`);
        battleStarted = await startUpdateArena(idleStart);
      }
      if (!battleStarted) {
        displayUntil(() => `[TIMER]${UI.byLang('切换世界', '切換世界', 'World Switching')}`);
        autoSwitchIsekai();
      }
    }
    displayProcess();
    $async.logSwitch(arguments);
    return ready.encounter;

    async function setReady(step, value) { try {
      ready[step] = value;
      if (ready.encounterUpdated) return;
      $async.logSwitch(arguments);
      const onEncounter = option.encounter || forIsekaiEncounter;
      if (_server.persistent) {
        if (onEncounter && steps.find(group => group.find(step => step.condition && !ready[step.step]))) return;
        ready.encounterUpdated = true;
      }
      const encounterStarted = await updateEncounter(onEncounter);
      battleStarted ||= encounterStarted;
      ready.encounter ||= !encounterStarted;
      ready.encounterUpdated ||= ready.encounter;
      $async.logSwitch(arguments);
    } catch (err) { console.error(err); }}
  } catch (err) { console.error(err); }}

  function displayUntil(info, condition) {
    const start = displayUntil.prototype.start = time(0);
    until(async () => {
      if (condition && condition()) return true;
      if (displayUntil.prototype.start !== start) return true;
      const formated = ['undefined', 'string'].includes(typeof info) ? info : info?.();
      displayProcess(formated.replace('[TIMER]', `[+${remainTime2Str(time(0) - start, true)}]`));
    });
  }

  function displayProcess(info) {
    const cleaned = runtime.document.title.replace(/\[AR\].*\[AR\]/, '');
    if (!info) {
      runtime.document.title = cleaned;
      displayUntil.prototype.start = undefined;
      return;
    }
    const updated = `[AR]${info}[AR]` + cleaned;
    if (updated === runtime.document.title) return;
    runtime.document.title = updated;
  }

  function getTodayEncounter(encounter) { return encounter?.filter(e => time(2, e.time) === time(2)).sortBy(x => -x.time) ?? []; }

  function getLocalEncounter(encounter = []) {
    let gm = getValue('encounter', true) ?? [];
    let local = getLocal('encounter', true) ?? [];
    encounter = [ ... gm, ... local, ...encounter ];
    const uniqued = [];
    while (encounter.length) {
      const item = encounter.pop();
      const existed = uniqued.find(x => x.time === item.time || x.url === item.url);
      if (existed) {
        if (existed.encountered !== item.encountered) {
          existed.encountered ||= item.encountered;
        }
        continue;
      }
      uniqued.unshift(item);
    }
    return { data: getTodayEncounter(uniqued), gm: JSON.stringify(gm), local: JSON.stringify(local) };
  }

  function setEncounter(encounter) {
    const got = getLocalEncounter(encounter);
    g.encounter = got.encounter;
    setIfChanged('encounter', { ...got, old: got.local }, undefined, true);
    setIfChanged('encounter', { ...got, old: got.gm });
    return g.encounter;
  }

  function getEncounter() {
    const current = g.encounter ??= [];
    let last = 0;
    current.forEach(e=> {
      if (e.encountered > last) last = e.encountered;
      if (e.time > last) last = e.time;
    });
    const now = time(0);
    const read = (now - (times.encounter.update ?? 0)) >= _1s;
    const count = current.filter(e => e.url).length;
    if (read) times.encounter.update = now;

    let encounter = (((now - last) >= (_1h * 0.5)) && read && (count < 24 || !current[0].encountered)) ? JSON.parse(getLocal('encounter', true)??'null') : current;
    if (!encounter || !last) {
      encounter = getValue('encounter', true) ?? [];
      setEncounter(encounter);
    }
    g.encounter = encounter;
    if (JSON.stringify(current) === JSON.stringify(encounter)) {
      return (g.encounter = getTodayEncounter(encounter));
    }
    let dict = {};
    for (let e of current) {
      dict[e.url ?? `newDawn`] = e;
    }
    // if is not latest version data (old versions)
    if (!Array.isArray(encounter)) {
      const last = encounter.lastTime;
      encounter = [];
      for (const i of range(encounter.time + 1)) {
        encounter.unshift({ url: i === 0 ? undefined : i, time: last, encountered: i === 0 ? undefined : time(0) });
      }
      setEncounter(encounter);
    }
    for (let e of encounter) {
      const key = e.url ?? `newDawn`;
      dict[key] ??= e;
      dict[key].time = Math.max(dict[key].time, e.time);
      dict[key].encountered = (e.encountered || dict[key].encountered) ? Math.max(dict[key].encountered ?? 0, e.encountered ?? 0) : undefined;
    }
    return (g.encounter = getTodayEncounter(Object.values(dict)));
  }

  function queryToPersistent(query) {
    return forIsekaiEncounter ? `${window.location.href.includes('https') ? 'https://' : 'http://'}${window.location.href.includes('alt') ? 'alt.' : ''}hentaiverse.org/${query}` : query;
  }

  async function asyncSetProficiency() { try {
    await waitPause();
    $async.logSwitch(arguments);
    const doc = $doc(await $ajax.insert(queryToPersistent('?s=Character')));
    const current = {};
    gE('#stats_scrollable table:last-child tr', 'all', doc).forEach((tr) => {
      const exec = tr.innerHTML.match(/<td>(.*)<\/td>.*<td>(.*)<\/td>/);
      current[exec[2]] = exec[1] * 1;
    });
    const proficiency = getWithStringfied('proficiency', true);
    current.season = _server.season;
    if (proficiency.season && (proficiency.season != _server.season)) {
      setIfChanged('proficiency', current);
      $async.logSwitch(arguments);
      return
    }
    for (const key in current) {
      const [p, c] = [proficiency.data[key] , current[key]];
      if ((key === 'season') || !p || (c > p)) proficiency.data[key] = c;
    }
    setIfChanged('proficiency', proficiency);
    $async.logSwitch(arguments);
  } catch (err) { console.error(err); }}

  async function asyncSetAbilityData() { try {
    await waitPause();
    $async.logSwitch(arguments);
    const html = await $ajax.insert(queryToPersistent('?s=Character&ss=ab'));
    const doc = $doc(html);
    const abd = {
      'HP Tank': { id: 1101, unlock: [0, 25, 50, 75, 100, 120, 150, 200, 250, 300], level: 0 },
      'MP Tank': { id: 1102, unlock: [0, 30, 60, 90, 120, 160, 210, 260, 310, 350], level: 0 },
      'SP Tank': { id: 1103, unlock: [0, 40, 80, 120, 170, 220, 270, 330, 390, 450], level: 0 },
      'Better Health Pots': { id: 1104, unlock: [0, 100, 200, 300, 400], level: 0 },
      'Better Mana Pots': { id: 1105, unlock: [0, 80, 140, 220, 380], level: 0 },
      'Better Spirit Pots': { id: 1106, unlock: [0, 90, 160, 240, 400], level: 0 },
      '1H Damage': { id: 2101, unlock: [0, 100, 200], level: 0 },
      '1H Accuracy': { id: 2102, unlock: [50, 150], level: 0 },
      '1H Block': { id: 2103, unlock: [250], level: 0 },
      '2H Damage': { id: 2201, unlock: [0, 100, 200], level: 0 },
      '2H Accuracy': { id: 2202, unlock: [50, 150], level: 0 },
      '2H Parry': { id: 2203, unlock: [250], level: 0 },
      'DW Damage': { id: 2301, unlock: [0, 100, 200], level: 0 },
      'DW Accuracy': { id: 2302, unlock: [50, 150], level: 0 },
      'DW Crit': { id: 2303, unlock: [250], level: 0 },
      'Staff Spell Damage': { id: 2501, unlock: [0, 100, 200], level: 0 },
      'Staff Accuracy': { id: 2502, unlock: [50, 150], level: 0 },
      'Staff Damage': { id: 2503, unlock: [0], level: 0 },
      'Cloth Spellacc': { id: 3101, unlock: [120], level: 0 },
      'Cloth Spellcrit': { id: 3102, unlock: [0, 40, 90, 130, 190], level: 0 },
      'Cloth Castspeed': { id: 3103, unlock: [150, 250], level: 0 },
      'Cloth MP': { id: 3104, unlock: [0, 60, 110, 170, 230, 290, 350], level: 0 },
      'Light Acc': { id: 3201, unlock: [0], level: 0 },
      'Light Crit': { id: 3202, unlock: [0, 40, 90, 130, 190], level: 0 },
      'Light Speed': { id: 3203, unlock: [150, 250], level: 0 },
      'Light HP/MP': { id: 3204, unlock: [0, 60, 110, 170, 230, 290, 350], level: 0 },
      'Heavy Crush': { id: 3301, unlock: [0, 75, 150], level: 0 },
      'Heavy Prcg': { id: 3302, unlock: [0, 75, 150], level: 0 },
      'Heavy Slsh': { id: 3303, unlock: [0, 75, 150], level: 0 },
      'Heavy HP': { id: 3304, unlock: [0, 60, 110, 170, 230, 290, 350], level: 0 },
      'Better Weaken': { id: 4201, unlock: [70, 100, 130, 190, 250], level: 0 },
      'Faster Weaken': { id: 4202, unlock: [80, 165, 250], level: 0 },
      'Better Imperil': { id: 4203, unlock: [130, 175, 230, 285, 330], level: 0 },
      'Faster Imperil': { id: 4204, unlock: [140, 225, 310], level: 0 },
      'Better Blind': { id: 4205, unlock: [110, 130, 160, 190, 220], level: 0 },
      'Faster Blind': { id: 4206, unlock: [120, 215, 275], level: 0 },
      'Mind Control': { id: 4207, unlock: [80, 130, 170], level: 0 },
      'Better Silence': { id: 4211, unlock: [120, 170, 215], level: 0 },
      'Better Immobilize': { id: 4212, unlock: [250, 295, 340, 370, 400], level: 0 },
      'Better Slow': { id: 4213, unlock: [30, 50, 75, 105, 135], level: 0 },
      'Better Drain': { id: 4216, unlock: [20, 50, 90], level: 0 },
      'Faster Drain': { id: 4217, unlock: [30, 70, 110, 150, 200], level: 0 },
      'Ether Theft': { id: 4218, unlock: [150], level: 0 },
      'Spirit Theft': { id: 4219, unlock: [150], level: 0 },
      'Better Haste': { id: 4102, unlock: [60, 75, 90, 110, 130], level: 0 },
      'Better Shadow Veil': { id: 4103, unlock: [90, 105, 120, 135, 155], level: 0 },
      'Better Absorb': { id: 4104, unlock: [40, 60, 80], level: 0 },
      'Stronger Spirit': { id: 4105, unlock: [200, 220, 240, 265, 285], level: 0 },
      'Better Heartseeker': { id: 4106, unlock: [140, 185, 225, 265, 305, 345, 385], level: 0 },
      'Better Arcane Focus': { id: 4107, unlock: [175, 205, 245, 285, 325, 365, 405], level: 0 },
      'Better Regen': { id: 4108, unlock: [50, 70, 95, 145, 195, 245, 295, 375, 445, 500], level: 0 },
      'Better Cure': { id: 4109, unlock: [0, 35, 65], level: 0 },
      'Better Spark': { id: 4110, unlock: [100, 125, 150], level: 0 },
      'Better Protection': { id: 4101, unlock: [40, 55, 75, 95, 120], level: 0 },
      'Flame Spike Shield': { id: 4111, unlock: [10, 65, 140, 220, 300], level: 0 },
      'Frost Spike Shield': { id: 4112, unlock: [10, 65, 140, 220, 300], level: 0 },
      'Shock Spike Shield': { id: 4113, unlock: [10, 65, 140, 220, 300], level: 0 },
      'Storm Spike Shield': { id: 4114, unlock: [10, 65, 140, 220, 300], level: 0 },
      'Conflagration': { id: 4301, unlock: [50, 100, 150, 200, 250, 300, 400], level: 0 },
      'Cryomancy': { id: 4302, unlock: [50, 100, 150, 200, 250, 300, 400], level: 0 },
      'Havoc': { id: 4303, unlock: [50, 100, 150, 200, 250, 300, 400], level: 0 },
      'Tempest': { id: 4304, unlock: [50, 100, 150, 200, 250, 300, 400], level: 0 },
      'Sorcery': { id: 4305, unlock: [70, 140, 210, 280, 350], level: 0 },
      'Elementalism': { id: 4306, unlock: [85, 170, 255, 340, 425], level: 0 },
      'Archmage': { id: 4307, unlock: [90, 180, 270, 360, 450], level: 0 },
      'Better Corruption': { id: 4401, unlock: [75, 150], level: 0 },
      'Better Disintegrate': { id: 4402, unlock: [175, 250], level: 0 },
      'Better Ragnarok': { id: 4403, unlock: [250, 325, 400], level: 0 },
      'Ripened Soul': { id: 4404, unlock: [150, 300, 450], level: 0 },
      'Dark Imperil': { id: 4405, unlock: [175, 225, 275, 325, 375], level: 0 },
      'Better Smite': { id: 4501, unlock: [75, 150], level: 0 },
      'Better Banish': { id: 4502, unlock: [175, 250], level: 0 },
      'Better Paradise': { id: 4503, unlock: [250, 325, 400], level: 0 },
      'Soul Fire': { id: 4504, unlock: [150, 300, 450], level: 0 },
      'Holy Imperil': { id: 4505, unlock: [175, 225, 275, 325, 375], level: 0 },
    }

    const newAbility = {};
    gE('#ability_top div[onmouseover*="overability"]', 'all', doc).forEach((div) => {
      const exec = div.getAttribute('onmouseover').match(/overability\(\d+, '([^']+)','.+?','(?:(Not Acquired|At Maximum)|Requires <strong>Level (\d+).+?)','(Not Acquired|At Maximum|Requires <strong>Level (\d+).+?)'/);
      const name = exec[1];
      const ab = abd[name];
      if (!ab) return;
      newAbility[ab.id] = exec[2] ? 0 : ab.unlock.indexOf(1 * exec[3]) + 1;
    });
    setValue('ability', newAbility);
    ability = Object.keys(newAbility).length ? newAbility : ability;
    $async.logSwitch(arguments);
  } catch (err) { console.error(err); }}

  async function asyncSetStamina() { try {
    await waitPause();
    $async.logSwitch(arguments);
    let stamina = getWithStringfied('stamina', true);
    let notExisit;
    if (!stamina.data) {
      notExisit = true;
      stamina.data = { ratio: 1 };
    }
    let [last, lastTime] = [stamina.data.current, stamina.data.time];
    [stamina.data.current, stamina.data.punish, stamina.data.perk] = await Promise.all([
      ... (await getCurrentStamina()),
      (await (async () => { try {
        let perk = stamina.data.perk;
        if (perk && !Array.isArray(perk)) {
          perk = Object.keys(perk).map(id => id * 1);
        }
        if (!perk?.length) {
          perk = undefined;
        }
        if (_server.isekai || !g.option.restoreStamina) {
          return perk;
        }
        let currentID, html;
        if (perk && perk[currentID = getCurrentUser() * 1]) {
          return perk;
        }
        if (!(html = await $ajax.insert('https://e-hentai.org/hathperks.php'))) {
          return perk;
        }
        const doc = $doc(html);
        const perks = gE('.stuffbox>table>tbody>tr', 'all', doc);
        if (perks && perks[25]?.innerHTML.includes('Obtained') && !(perk ??= []).includes(currentID)) {
          perk.push(currentID);
        }
        return perk;
      } catch (err) { console.error(err); }})())?.filter(p=>p)
    ]);
    if (!stamina.data.current) {
      if (notExisit) {
        setIfChanged('stamina', stamina);
      }
      $async.logSwitch(arguments);
      return;
    }
    stamina.data.time = time(0);
    if (!stamina.data.punish) {
      [stamina.data.lastRatio, stamina.data.lastRatioRaw] = [stamina.data.ratio, stamina.data.ratioRaw];
      delete stamina.data.ratio;
      delete stamina.data.ratioRaw;
    }
    if (stamina.data.ratio === 1 && (stamina.data.lastRatio === 1 || !stamina.data.lastRatio)) {
      delete stamina.data.ratio;
      delete stamina.data.lastRatio;
      delete stamina.data.lastRatioRaw;
      delete stamina.data.ratioRaw;
    }
    const lastCost = stamina.data.lastCost;
    delete stamina.data.lastCost;
    if (!lastCost || lastCost <= 0.06 ) {
      setIfChanged('stamina', stamina);
      $async.logSwitch(arguments);
      return;
    }
    last += Math.floor(stamina.data.time / _1h) - Math.floor(lastTime / _1h);
    const delta = last - stamina.data.current;
    if (!delta) {
      setIfChanged('stamina', stamina);
      $async.logSwitch(arguments);
      return;
    }
    const ratio = stamina.data.punish ? Math.max(1, Math.round(delta / lastCost / 0.25) * 0.25) : 1;
    if (stamina.data.ratio === ratio) {
      setIfChanged('stamina', stamina);
      $async.logSwitch(arguments);
      return;
    }
    [stamina.data.lastRatio, stamina.data.lastRatioRaw] = [stamina.data.ratio ?? 1, stamina.data.ratioRaw];
    [stamina.data.ratio, stamina.data.ratioRaw] = [ratio, `${delta} / ${Math.round(lastCost * 100) / 100} = ${delta / lastCost}`]
    setIfChanged('stamina', stamina);
    console.log('stamina', stamina.data, '\n', last, '->', stamina.data.current, '=', lastCost, '*', ratio);
    $async.logSwitch(arguments);
  } catch (err) { console.error(err); }}

  async function asyncGetItems() { try {
    const option = g.option;
    if (!option.checkSupply && (_server.isekai || !option.restoreStamina)) {
      return;
    }
    await waitPause();
    $async.logSwitch(arguments);
    const html = await $ajax.insert(queryToPersistent('?s=Character&ss=it'));
    const items = {};
    const doc = $doc(html);
    if (isInBattle(doc)) {
      $async.logSwitch(arguments);
      g.items = null;
      return;
    }
    for (let each of gE('.nosel.itemlist>tbody', doc).children) {
      const name = each.children[0].children[0].innerText;
      const id = each.children[0].children[0].getAttribute('id').split('_')[1];
      const count = each.children[1].innerText;
      items[id] = [name, count];
    }
    g.items = items;
    g.slotItems = Array.from(gE('[id*="item_"]', 'all', gE('#item_slots', doc))).map(slot => slot.id.match(/item_(\d+)/)[1]);
    $async.logSwitch(arguments);
  } catch (err) { console.error(err); }}

  function popupFailedCheck(title, popupText, ...log) {
    if (title) document.title = `[${title}!${forIsekaiEncounter?'p':''}]` + document.title;
    if (popupText) popup(`${forIsekaiEncounter ? UI.byLang('主世界', '主世界', '[Persistent]') ?? '[Persistent]' : ''}${UI.byLang(popupText) ?? popupText[2]}`);
    if (log?.length) console.log(`${forIsekaiEncounter ? '[Persistent]' : ''}`, ...log);
  }

  function checkSupply(extra) {
    const option = g.option;
    const key = extra;
    if (extra && !option[`checkSupply${extra}`]) return true;
    extra = {
      GF: {
        name: { 0: '压榨界', 1: '壓榨界', 2: 'Grindfest' },
        thresholdList: option.checkItemGF,
        checkList: option.isCheckGF,
        percentage: option.checkSupplyWarnGF
      },
      IW:{
        name: { 0: '道具界', 1: '道具界', 2: 'Itemworld' },
        thresholdList: option.checkItemIW,
        checkList: option.isCheckIW,
        percentage: option.checkSupplyWarnIW
      },
    }[extra];
    if (!option.checkSupply) return true;
    const items = g.items;
    if (!items) return false;
    const slotItems = g.slotItems;
    const slotedCheckList = option.checkSupplySlotted ? option.isCheckSlotted : undefined;
    const thresholdList = extra?.checkItem ?? option.checkItem;
    const checkList = extra?.isCheck ?? option.isCheck;
    const percentage = extra?.checkSupplyWarn ?? option.checkSupplyWarn;
    const unslotted = [], needs = [], warns = [];
    for (let id in slotedCheckList) {
      let [name, count] = items[id] ?? [];
      if (!slotItems.includes(id)) unslotted.push(`\n${UI.byLang(itemMap[id]) ?? name}`);
    }
    for (let id in checkList) {
      let [name, count] = items[id] ?? [];
      name = UI.byLang(itemMap[id]) ?? name;
      count ??= 0;
      const threshold = thresholdList[id] ?? 0;
      if (count < threshold) {
        needs.push(`\n${name}(${count}<${threshold})`);
        continue;
      }
      const warnThreshold = threshold * percentage / 100;
      if (count < warnThreshold) {
        warns.push(`\n${name}(${count}<${warnThreshold}(${threshold}*${percentage}%))`);
      }
    }
    extra = (UI.byLang(extra?.name) ?? '');
    extra = extra ? extra + ' ' : '';
    if (unslotted.length) {
      popupFailedCheck(`C:Slot`, [
        `消耗品未装备:\n${unslotted}`,
        `消耗品未裝備:\n${unslotted}`,
        `Consumables not slotted:\n${unslotted}`,
      ], `Unslotted items:${unslotted}`);
    } else if (needs.length) {
      popupFailedCheck(`C${key ? ':'+key : ''}`, [
        `消耗品${extra ? `(${extra}额外配置)` : ''}不足:\n${needs}`,
        `消耗品${extra ? `(${extra}額外配置)` : ''}不足:\n${needs}`,
        `Failed supply check${extra ? ` for ${extra}extra` : ''}:\n${needs}`,
      ], `${extra}Needs supply:${needs}`);
    } else if (warns.length) {
      popupFailedCheck(`c${key ? ':'+key : ''}`, [
        `消耗品${extra ? `(${extra}额外配置)` : ''} < ${percentage}%:\n${warns}`,
        `消耗品${extra ? `(${extra}額外配置)`: ''} < ${percentage}%:\n${warns}`,
        `Supplys ${extra ? ` for ${extra}extra` : ''} < ${percentage}%:\n${warns}`,
      ], `${extra}Warn supply:${warns}`);
    }
    return !needs.length && !unslotted.length;
  }

  async function asyncCheckRepair(extra) { try {
    const option = g.option;
    if (extra && !option[`repairValue${extra}`]) return true;
    if (!option.repair) {
      return true;
    }
    await waitPause();
    $async.logSwitch(arguments);
    let eqps;
    const key = extra;
    extra = {
      GF: {
        name: { 0: '压榨界', 1: '壓榨界', 2: 'Grindfest' },
        threshold: option.repairValueGF,
        repairCharm: option.repairCharmGF,
      },
      IW:{
        name: { 0: '道具界', 1: '道具界', 2: 'Itemworld' },
        threshold: option.repairValueIW,
        repairCharm: option.repairCharmIW,
      },
    }[extra];

    const threshold = extra?.repairValue ?? option.repairValue;
    const repairCharm = extra?.repairCharm || option.repairCharm;
    if (threshold === undefined || threshold < 0) { // skip because default repair has been checked before idleArena>GF
      $async.logSwitch(arguments);
      return true;
    }
    const url = queryToPersistent(`?s=Bazaar&ss=am&screen=repair&filter=equipped`);
    let [doc, equiped] = Array.from(await Promise.all([$ajax.insert(url), $ajax.insert(queryToPersistent(`?s=Character&ss=eq`))])).map($doc);
    if (isInBattle(doc)) {
      $async.logSwitch(arguments);
      return undefined;
    }
    const slotMap = {
      1: ['主手', '主手', 'Main Hand'],
      2: ['副手', '副手', 'Off Hand'],
      13: ['头盔', '頭盔', 'Helmet'],
      11: ['身体', '身體', 'Body'],
      14: ['手部', '手部', 'Hands'],
      12: ['腿部', '腿部', 'Legs'],
      15: ['脚部', '腳部', 'Feet']
    }
    let emptySlot = Array.from(gE('.eqb:not(.eqdisabled)', 'all', equiped)).map(slot => { return { id: slot.getAttribute('onclick').match(/equip_slot=(\d+)/)[1], empty: gE('.eqempty', slot) }; });
    emptySlot = emptySlot.filter(slot => slot.empty && !option.equipCheckSkip?.[slot.id]).map(slot => UI.byLang(slotMap[slot.id * 1]));
    const token = gE('#equipform>input[name="postoken"]', doc).value;
    const getCondition = eqp => 1 * gE('td:last-child', eqp).textContent.replace('%', '');
    let [material, materialNames] = doc.body.innerHTML.match(/const eqitems=(\{.*\});/)[1].split(/; const itemdata=/).map(JSON.parse);
    equiped = Array.from(gE('[onmouseover*="equips.set("]', 'all', equiped)).map(eq => eq.getAttribute('onmouseover').match(/equips.set\((\d+),/)[1]);
    const selector = '#equiplist>table>tbody>tr:not(.eqselall):not(.eqtplabel)';
    eqps = await Promise.all(Array.from(gE(selector, 'all', doc)).map(async eqp => { try {
      const id = gE('input', eqp).value;
      if (!equiped.includes(id)) return;
      let condition = getCondition(eqp);
      const needRepairCharm = repairCharm && Object.keys(material[id].m).some(m => materialNames[m].n.includes('Charm'));
      if (condition > threshold && !needRepairCharm) return;
      let after = $doc(await $ajax.insert(url, `&eqids[]=${id}&postoken=${token}&replace_charms=on`));
      let input = gE(`#e${id}`, after);
      if (input && !needRepairCharm) {
        condition = getCondition(input.closest(selector));
        if (condition > threshold) return;
        after = $doc(await $ajax.insert(url, `&eqids[]=${id}&postoken=${token}&replace_charms=off`));
      }
      return gE(`#e${id}`, after) ? gE('.lc', eqp).textContent : undefined;
    } catch (err) { console.error(err); }}));
    eqps = eqps.filter(e => e);
    if (emptySlot.length) {
      popupFailedCheck(`R`, [
        `缺少装备:\n${emptySlot.join('\n ')}`,
        `缺少裝備:\n${emptySlot.join('\n ')}`,
        `Empty equip slots:\n${emptySlot.join('\n ')}`,
      ], `Empty equip slots:\n`, emptySlot.join('\n '));
    }
    extra = UI.byLang(extra?.name??'');
    if (eqps.length) {
      popupFailedCheck(`R${key ? ':'+key : ''}`, [
        `${extra}装备需要修理:\n${eqps.join('\n ')}`,
        `${extra}裝備需要修理:\n${eqps.join('\n ')}`,
        `${extra}Equips need repair:\n${eqps.join('\n ')}`,
      ], `${extra}Equips need repair:\n`, eqps.join('\n '));
    }
    $async.logSwitch(arguments);
    return !eqps.length;
  } catch (err) { console.error(err); }; return false; }

  async function asyncUpdateEquipModifyList() { try {
    $async.logSwitch(arguments);
    const filters = ['weapon_1handed', 'weapon_2handed', 'weapon_staff', 'shield', 'armor_cloth', 'armor_light', 'armor_heavy'];
    const equips = [];
    const hvv = g.hvVersion.upto(Version('091.e'))
    for (const filter of filters) {
      const url = queryToPersistent(`?s=Bazaar&ss=am&screen=modify&filter=${filter}`);
      const doc = $doc(await $ajax.insert(url));
      if (isInBattle(doc)) return;
      await Promise.all(Array.from(gE('#equiplist>table>tbody>tr:not(.eqselall):not(.eqtplabel)', 'all', doc)).map(async eqp => { try {
        const id = gE('input', eqp).value;
        const levels = gE('td:last-child', eqp).innerHTML;
        if (!levels) return;
        const [level, world, max] = levels.split(' / ').map(x => x * 1);
        const name = gE('td:first-child', eqp).innerText;
        const quality = name.match(/Fair|Average|Superior|Exquisite|Magnificent|Legendary|Peerless/)[0];
        const rounds = hvv ? range(5, 35) :
        (()=> { switch (quality) {
          case 'Fair': case 'Average': case 'Superior': case 'Exquisite':
            return [...range(5, 10), ...repeat(10, 5)];
          case 'Magnificent': case 'Legendary': case 'Peerless':
            return [...range(5, 20), ...repeat(20, 5), ...repeat(25, 5), ...repeat(30, 5)];
          default:
            return;
        }})();
        if (!rounds) return;
        equips.push({name, id, filter, level, world, max, rounds: rounds[world]});
      } catch (err) { console.error(err); }}));
    }
    $async.logSwitch(arguments);
    return equips;
  } catch (err) { console.error(err); }}

  async function asyncUpdatePersona(doc) { try {
    $async.logSwitch(arguments);
    doc ??= $doc(await $ajax.insert('?s=Character&ss=ch'));
    if (isInBattle(doc)) return;
    const raws = gE('[name="persona_set"]>option', 'all', doc);
    if (!raws?.length) return;
    const personas = Object.fromEntries([...raws].map(option => [option.value, { name: option.innerHTML, selected: option.selected }]));
    $async.logSwitch(arguments);
    return personas;
  } catch (err) { console.error(err); }}

  async function asyncUpdateEquipSet(doc) { try {
    $async.logSwitch(arguments);
    doc ??= $doc(await $ajax.insert('?s=Character&ss=eq'));
    if (isInBattle(doc)) return;
    const raws = gE('#eqsl img', 'all', doc);
    if (!raws?.length) return;
    const equipSets = Object.fromEntries([...raws].map(img => {
      const [match, id, on] = img.src.match(/set(\d)_(on|off)/);
      return [ id, on==='on' ];
    }));
    $async.logSwitch(arguments);
    return equipSets;
  } catch (err) { console.error(err); }}

  async function asyncCheckEquStorage() { try {
    const option = g.option;
    if (!option.equStorage) {
      return true;
    }
    await waitPause();
    $async.logSwitch(arguments);
    const url = queryToPersistent(`?s=Bazaar&ss=am`);
    const doc = $doc(await $ajax.insert(url));
    if (isInBattle(doc)) {
      $async.logSwitch(arguments);
      return false;
    }
    const exec = /<td>Inventory Capacity:<\/td><td>(\d+)(?: \+ (\d+))?<\/td><td>\/<\/td><td>(\d+)<\/td>/.exec(doc.body.innerHTML);
    const count = parseInt(exec[1]); + parseInt(exec[2] || 0);
    const checked = count <= option.equStorageValue;
    if (!checked) {
      popupFailedCheck(`E`, [
        `装备库存过多: ${count} / ${option.equStorageValue}`,
        `裝備庫存過多: ${count} / ${option.equStorageValue}`,
        `Equips storage upto threshold: ${count} / ${option.equStorageValue}`,
      ], `Equips storage upto threshold: ${count} / ${option.equStorageValue}`);
    }
    $async.logSwitch(arguments);
    return checked;
  } catch (err) { console.error(err); }; return false; }

  async function checkBattleReady(method, condition = {}) {
    await waitPause();
    if (condition.checkEncounter) {
      const encounter = getEncounter();
      if (encounter[0]?.url && !encounter[0]?.encountered) {
        console.log(getEncounter());
        return;
      }
    }
    const option = g.option;
    const stamina = getValue('stamina', true);
    const [low, lowNR, cost, ratio] = [condition.staminaLow ?? option.staminaLow, option.staminaLowWithReNat ?? 0, Math.round((condition.staminaCost ?? 0) * 100) / 100, stamina.punish ? stamina.ratio ?? 1 : 1]
    const { checked, stmNR, floored } = await checkStamina(low, cost);
    const [neat, neatNR] = [stamina.current-low, stmNR-lowNR];
    console.log(
      `${forIsekaiEncounter ? '[Persistent]' : ''}stamina check succeed:`, checked === 1, ...checked === -1 ? ['with nature recover', lowNR, 'stmNR:', stmNR, '(', ...neatNR >= 0 ? ['+', neatNR] : ['-', -neatNR], ')'] : [],
      '\nlow:', low, ...cost ? ['cost:', cost, ...stamina.punish ? ['*', ratio, '=', Math.round(cost * ratio * 10000) / 10000] : [], '=> floored:', floored, 'current:', stamina.current, '(', neat >= 0 ? '+' : '-', neat, ')'] : [],
      '\nstamina:', stamina,
    );
    if (checked === 1) { // succeed
      document.title = document.title.replace(`[S!${forIsekaiEncounter?'p':''}]`, '');
      return true;
    }
    if (checked === 0) { // failed currently
      const now = time(0);
      setTimeout(method, Math.floor(now / _1h + 1) * _1h - now);
      if (!document.title.includes(`[S!${forIsekaiEncounter?'p':''}]`)) {
        document.title = `[S!${forIsekaiEncounter?'p':''}]` + document.title;
      }
    } else { // case -1: // failed with nature recover
      popupFailedCheck(`S!`, [
        `当日精力不足(含自然恢复)`,
        `當日精力不足(含自然恢復)`,
        `Failed stamina check with nature recover.`,
      ]);
    }
  }

  async function getCurrentStamina() { try {
    $async.logSwitch(arguments);
    const doc = $doc(await $ajax.insert(forIsekaiEncounter ? window.location.href.replace(/\/isekai/, '') : window.location.href));
    if (isInBattle(doc)) {
      $async.logSwitch(arguments);
      return [ undefined, undefined ];
    }
    const current = gE('#stamina_readout .fc4.far>div', doc).textContent.match(/\d+/)[0] * 1;
    const punish = !!gE('#stamina_readout .fc4.far', doc).parentNode.title;
    $async.logSwitch(arguments);
    return [current, punish ? punish : undefined];
  } catch (err) { console.error(err); }}

  async function checkStamina(low, cost) {
    $async.logSwitch(arguments);
    const stamina = getValue('stamina', true);
    const option = g.option;
    let now = time(0);
    let hours = Math.floor(now / _1h);
    let [current, punish] = await until(getCurrentStamina, _1m);
    const stmNR = current + 24 - (hours % 24);
    cost ??= 0;
    if (punish && option.staminaRatio) {
      cost *= stamina.ratio
    }
    let floored = cost;
    if (option.staminaCostFloorThreshold) {
      const mod = cost % 1;
      floored = Math.floor(cost) + (mod <= option.staminaCostFloorThreshold ? 0 : mod);
    }
    const stmNRChecked = !floored || stmNR - floored >= option.staminaLowWithReNat;
    const result = { checked: stmNRChecked ? (current - floored >= (low ?? option.staminaLow)) ? 1 : 0 : -1, stmNR: stmNR, floored };
    $async.logSwitch(arguments);
    if (result.checked === 1 || _server.isekai || !option.restoreStamina) return result;
    const items = g.items;
    $async.logSwitch(arguments);
    if (!items) return result;
    const recoverItems = { 11401: true, 11402: false }
    const isPerk = stamina.perk?.includes(getCurrentUser());
    for (let id in recoverItems) {
      if (!items[id]) continue;
      const recover = recoverItems[id] ? isPerk ? 20 : 10 : 5;
      if (current + recover >= 100) continue; // check if overflow by (20 or 10) -> (5)
      gE('#stamina_readout .fc4.far>div', $doc(await $ajax.insert(window.location.href, 'recover=stamina'))).textContent.match(/\d+/)[0] * 1;
      goto();
      break;
    }
    $async.logSwitch(arguments);
    return result;
  }

  async function updateEncounter(engage) { try {
    const MAX = 24;
    const option = g.option;
    if (!option.encounter && !option.encounterDisplay) return false;
    $async.logSwitch(arguments);
    const encounter = getEncounter();
    const count = encounter.filter(e => e.url).length;
    const last = encounter[0]?.time ?? getValue('lastEH', true) ?? 0; // 上次遭遇 或 上次打开EH 或 0
    let now = time(0);
    let cd = getCD();
    function setUITitle() {
      appendEncounterUITitle('e', `${time(3, last)}\n${UI.l('遭遇次数', '遭遇次數','Encounter Time')}: ${count}`);
    }
    const ui = gE('.encounterUI') ?? (() => {
      const ui = (gE('.hvAAPauseUI') ?? gE('body')).appendChild(cE('a'));
      ui.className = 'encounterUI';
      setUITitle(ui);
      if (!gE('#battle_main')) {
        ui.href = 'https://e-hentai.org/news.php?encounter';
      }
      return ui;
    })();
    const waitCD = option.encounterWaitCD * _1s;
    const missed = count - encounter.filter(e => e.encountered && e.url).length;
    if (count === MAX) {
      ui.style.cssText += 'color:orange!important;';
    } else if (cd <= waitCD) {
      ui.style.cssText += 'color:red!important;';
    } else {
      ui.style.cssText += 'color:unset!important;';
    }
    let uiTime = timeStr(cd, 2, option.encounterQuickCheck);
    if (option.encounterQuickCheck && cd >= _1h && (Math.floor(cd / _1s) % 2)) {
      uiTime = uiTime.replace(':', '.');
    }
    const newHTML = `${uiTime}[${encounter.length ? (count >= MAX ? `☯` : count) : `✪`}${missed ? `-${missed}` : ``}]`;;
    if (newHTML !== ui.innerHTML) {
      ui.innerHTML = newHTML;
    }
    setUITitle(ui);
    if (runtime.document.title.includes(titlePause())) {
      runtime.document.title = ui.innerHTML + titlePause();
    }
    let subzerocd = cd <= 0;
    let unencountered = cd < 30 * _1m && encounter[0]?.url && !encounter[0].encountered;

    if (engage && (subzerocd || unencountered) && !getPause()) {
      if (subzerocd) {
        $async.logSwitch(arguments);
        return await onEncounter();
      }
      if (unencountered) {
        $ajax.openNoFetch(encounter[0].url);
        $async.logSwitch(arguments);
        return true;
      }
    }
    let interval = (!option.encounterQuickCheck && cd > _1h) ? _1m : (!option.encounterQuickCheck || cd > _1m) ? _1s : 80;
    interval = (option.encounterQuickCheck && cd > _1m) ? (interval - cd % interval) / 4 : interval; // 让倒计时显示更平滑
    if (runtime.encounterTimeout) {
      clearTimeout(runtime.encounterTimeout);
      runtime.encounterTimeout = undefined
    }
    setTimeout(() => updateEncounter(engage), interval);
    $async.logSwitch(arguments);
    return engage && (cd <= (_server.isekai ? 0 : waitCD));

    function getCD() {
      now = time(0);
      let cd = 0;
      if (encounter.filter(e => e.url && (e.encountered || (time(0) - e.time >= 30 * _1m))).length >= MAX) {
        cd = Math.floor(encounter[0].time / _1d + 1) * _1d - now;
      } else if (last) {
        cd = _1h / 2 + last - now;
      }
      return Math.max(0, cd);
    }
  } catch (err) { console.error(err); }}

  async function onChangeEquipSet(lastKey, target, list, toFetchParam, reload) { try {
    let last = getWithStringfied(lastKey);
    let current = list ? Object.keys(list).find(p => list[p].selected) * 1 : undefined;
    target ??= last.data;
    if ([undefined, current].includes(target)) return;
    if (!last.data) setIfChanged(lastKey, { ...last, data: current });
    await $ajax.fetch(...toFetchParam(target));
    if (reload) await updateItemWorldList(true);
    return true;
  } catch (err) { console.error(err); }}

  async function switchEquipSet(persona, equipSet, personas, equipSets) { try {
    $async.logSwitch(arguments);
    if (personas !== undefined) g.personas = personas;
    personas = g.personas;
    if (equipSets !== undefined) g.equipSets = equipSets;
    equipSets = g.equipSets;
    if ([personas, equipSets].includes(undefined)) {
      const { e, p, s } = getValue('itemWorldDatas', true) ?? {};
      g.personas = personas ??= p;
      g.equipSets = equipSets ??= s;
    }

    let changed = await onChangeEquipSet('lastPersona', persona, personas, id => [`?s=Character&ss=ch`, `persona_set=${id}`], true);
    changed = await onChangeEquipSet('lastEquipSet', equipSet, equipSets, id => [`?s=Character&ss=eq`, `equip_set=${id}`], true) || changed;
    $async.logSwitch(arguments);
    return changed;
  } catch (err) { console.error(err); }}

  function getArenaEquipSet(id) {
    const option = g.option;
    if (!option.changeEquipSet) return;

    const onGetArenaEquipSet = function (id) {
      if (!option.enableEquipSet?.[id]) return;
      const persona = option.switchPersona?.[id];
      const equipSet = option.switchEquipSet?.[id];
      return { persona, equipSet };
    }

    let target = onGetArenaEquipSet(id);
    let parent = !isNaN(+id) ? onGetArenaEquipSet(id >= 105 ? 'rb' : 'ar') : undefined;
    let defaultSet = onGetArenaEquipSet('default');
    let persona = target?.persona !== undefined ? target?.persona : parent?.persona !== undefined ? parent?.persona : defaultSet?.persona !== undefined ? defaultSet?.persona : undefined;
    let equipSet = target?.equipSet !== undefined ? target?.equipSet : parent?.equipSet !== undefined ? parent?.equipSet : defaultSet?.equipSet !== undefined ? defaultSet?.equipSet : undefined;
    persona = persona === -1 ? undefined : persona;
    equipSet = equipSet === -1 ? undefined : equipSet;
    if (persona !== undefined || equipSet !== undefined) return { persona, equipSet };
  }

  function isSwitchEquipSet(target) {
    const last = { persona: getValue('lastPersona'), equipSet: getValue('lastEquipSet') };
    const { persona, equipSet } = target ?? {};
    return {
      persona: persona !== undefined && (last.persona !== persona) ? persona : undefined,
      equipSet: equipSet !== undefined && (last.equipSet !== equipSet) ? equipSet : undefined
    }
  }

  async function changeArenaEquipSet(id) { try {
    const target = getArenaEquipSet(id);
    const { persona, equipSet} = isSwitchEquipSet(target);
    console.log(`changeArenaEquipSet for arena [${id}]:`, target, '=>', { ... persona ? { persona } : {}, ... equipSet ? { equipSet } : {} });
    return await ([persona, equipSet].every(c => c === undefined) ? restorePersonaAndEquipSet() : switchEquipSet(persona, equipSet));
  } catch (err) { console.error(err); }}

  async function onEncounter() { try {
    const option = g.option;
    if (getPause()) return;
    if (_server.isekai) {
      [engaged, encounterAsyncOnIdle] = [];
      HVAA(true); // reload
      await until(async () => {
        if (engaged === false) return true; // engage === false if failed before asyncOnIdle
        if (encounterAsyncOnIdle === undefined) return;
        engaged = await encounterAsyncOnIdle();
      });
      return engaged;
    }
    if (await changeArenaEquipSet('ba') && !(await asyncCheckRepair())) {
      await restorePersonaAndEquipSet();
      return;
    }
    $async.logSwitchStrict('updateEncounter', true);
    // persistent in battle
    if (isInBattle($doc(await $ajax.insert(window.location.href.replace(/\/isekai/, ''))))) {
      $async.logSwitchStrict('updateEncounter', false);
      return;
    }

    await checkURLBeforeNewRound(window.location.href);
    await checkURLBeforeNewRound();

    // stamina
    if (!await checkBattleReady(onEncounter, { staminaLow: option.staminaEncounter })) {
      $async.logSwitchStrict('updateEncounter', false);
      return;
    }
    times.encounter.start = time(0);
    await sleep(option.encounterDelay * _1s);
    setEncounter(getEncounter()); // 离开页面前保存
    if (!window.top.location.href.endsWith(`?s=Battle`)) {
      setValue('beforeEncounter', setValue('lastUrl', window.top.location.href));
    }
    $ajax.openNoFetch('https://e-hentai.org/news.php?encounter');
    $async.logSwitchStrict('updateEncounter', false);
    return true;
  } catch (err) { console.error(err); }}

  async function startUpdateArena(idleStart) { try {
    $async.logSwitchStrict('startUpdateArena', true);
    const now = time(0);
    if (!idleStart) await updateArena(); // new day
    let timeout = g.option.idleArenaTime * _1s;
    if (idleStart) timeout -= time(0) - idleStart;
    if (timeout > 0) await sleep(timeout);
    const started = await idleArena();
    const last = getValue('arena', true)?.date ?? now;
    const nextDay = Math.max(0, Math.floor(last / _1d + 1) * _1d - now);
    if (nextDay > 0) {
      setTimeout(startUpdateArena, nextDay); // next day
    } else {
      started ||= await startUpdateArena();
    }
    $async.logSwitchStrict('startUpdateArena', false);
    return started;
  } catch (err) { console.error(err); }}

  async function updateArena(forceUpdateToken = false) { try {
    await waitPause();
    $async.logSwitch(arguments);
    let arena = getWithStringfied('arena', true, {});
    const isToday = arena.data.date && time(2, arena.data.date) === time(2);
    if (forceUpdateToken || !isToday || !arena.data.isOptionUpdated) {
      arena.data.enabled = [];
      await Promise.all(['gr', 'ar', 'rb'].map(s => (async site => { try {
        const doc = $doc(await $ajax.insert(`?s=Battle&ss=${site}`));
        getStartBattleButtons(doc, site).forEach(btn => {
          if (!btn.enabled) return;
          if (btn.cleared) {
            arena.data.enabled.push(btn.id);
            return;
          }
          const index = arena.data.enabled.indexOf(btn.id);
          if (index !== -1) arena.data.enabled.splice(index, 1);
        });
      } catch (err) { console.error(err); }})(s)));
    }

    const option = g.option;
    if (!isToday) {
      arena.data.date = time(0);
      arena.data.gr = option.idleArenaGrTime;
      arena.data.arrayDone = [];
    }
    arena.data.arrayDone = arena.data.arrayDone.filter(id => id && (id === 'gr' || !arena.data.enabled?.includes(id.toString())));
    delete arena.data.equip;
    if (_server.isekai) delete arena.data.tw;
    $async.logSwitch(arguments);
    return setIfChanged('arena', arena);
  } catch (err) { console.error(err); }}

  function titlePause() {
    return UI.byLang('HVAA暂停中', 'HVAA', 'HVAA Paused');
  }

  async function idleArena() { try { // 闲置竞技场
    let id;
    let arena = getWithStringfied('arena', true, {});
    const option = g.option;
    const array = splitOrders(option.idleArenaValue).map(String);
    if (array.length === 0) {
      autoSwitchIsekai();
      return false;
    }
    $async.logSwitch(arguments);
    if (!arena.data.enabled?.length) {
      arena.data.enabled = (await updateArena(true)).data.enabled;
      setIfChanged('arena', arena);
    }
    while (array.length > 0) {
      id = array.shift();
      if (arena.data.arrayDone?.includes(id) || option.arLevelDisable?.[id]) {
        id = undefined;
        continue;
      }

      if (id === 'tw') {
        id = undefined;
        if (_server.persistent) continue;
        const doc = $doc(await $ajax.insert('?s=Battle&ss=tw'));
        let [_, floor, rounds, attempts, maxAttempts, clears, max] = gE('#towerstart', doc).innerText.match(/Current Floor: (\d+) \((\d+) Rounds\)\n\t.*\n\tDaily Attempts: (\d+) \/ (\d+)\n\tDaily Clears: (\d+) \/ (\d+)/).map(x => x * 1);
        arena.data.tw = { data: attempts };
        setIfChanged('arena', arena);
        if (clears >= max || attempts >= maxAttempts) {
          arena.data.arrayDone.push('tw');
          setIfChanged('arena', arena);
          continue;
        }
        if (attempts >= option.idleArenaTwTime) continue;
        if (floor >= option.idleArenaTwMax) continue;
        if (await gotoBattle('tw', rounds)) {
          $async.logSwitch(arguments);
          return true;
        }
      }
      if (id === 'iw') {
        id = undefined;
        const iw = await idleItemWorld();
        if (!iw) continue;
        $async.logSwitch(arguments);
        return true;
      }
      if (arena.data.enabled.includes(id)) break;
      if (id >= 105) {
        arena.data.enabled = (await updateArena(true)).data.enabled;
        setIfChanged('arena', arena);
        if (arena.data.enabled.includes(id)) break;
      }
      id = undefined;
    }
    if (!id) {
      console.log('No Arena Id Available', arena.data);
      await restorePersonaAndEquipSet();
      $async.logSwitch(arguments);
      return false;
    }
    const done = await gotoBattle(id);
    $async.logSwitch(arguments);
    return done;
  } catch (err) { console.error(err); }}

  async function idleItemWorld() { try {
    const option = g.option;
    if (!option.idleItemWorld) return;
    $async.logSwitch(arguments);
    await updateItemWorldList();
    const { equips, personas, equipSets } = getValue('itemWorldDatas', true) ?? {};
    if (!equips || !personas || !equipSets) {
      $async.logSwitch(arguments);
      return;
    }
    const list = option.enableItemWorld ? Object.keys(option.enableItemWorld).filter(id => option.enableItemWorld[id]) : undefined;
    if (!list?.length) {
      $async.logSwitch(arguments);
      return;
    }
    list.sortBy(id => option.ItemWorldOrder?.[id] ?? 0);

    let doc, errorMsg;
    for (const eid of list) {
      let equip = equips.find(eqp => eqp.id === eid);
      if (equip.world >= equip.max || equip.world >= option.levelItemWorld?.[eid]) continue;
      doc = $doc(await $ajax.insert(`?s=Bazaar&ss=am&screen=modify&eqids[]=${eid}`));
      if (errorMsg = gE('.messagebox_error', doc)) {
        console.log(equip, errorMsg.innerText);
        continue;
      }
      let title = gE('#equpgrade button', 'all', doc)[1].getAttribute('title');
      if (title?.match(/You need \d+ more World Seeds to spawn this Item World./)) continue;

      if (switchEquipSet(option.itemWorldPersona?.[eid], option.itemWorldEquipSet?.[eid], personas, equipSets)) {
        doc = $doc(await $ajax.insert(`?s=Bazaar&ss=am&screen=modify&eqids[]=${eid}`));
        equip = { ...equip, ...getItemWorldDetail(doc) }
        if (errorMsg = gE('.messagebox_error', doc)) {
          console.log(equip, errorMsg.innerText);
          continue;
        }
        title = gE('#equpgrade button', 'all', doc)[1].getAttribute('title');
      }

      if (title?.match(/You cannot enter the item world of a currently equipped item./)) {
        console.log('Idle Item World: Skip currently equiped', eid, equip);
        continue;
      }

      if (await gotoBattle('iw', equip.rounds, equip)) {
        $async.logSwitch(arguments);
        return true;
      }
    }
    $async.logSwitch(arguments);
  } catch (err) { console.error(err); }}

  async function gotoBattle(id, rounds, equip) { try {
    $async.logSwitch(arguments);
    const option = g.option;
    if (await changeArenaEquipSet(id) && !(await asyncCheckRepair())) {
      await restorePersonaAndEquipSet();
      $async.logSwitch(arguments);
      return false;
    }
    let stamina = getWithStringfied('stamina', true);
    let staminaCost = {
      1: 2, 3: 4, 5: 6, 8: 8, 9: 10,
      11: 12, 12: 15, 13: 20, 15: 25, 16: 30,
      17: 35, 19: 40, 20: 45, 21: 50, 23: 55,
      24: 60, 26: 65, 27: 70, 28: 75, 29: 80,
      32: 85, 33: 90, 34: 95, 35: 100,
      105: 1, 106: 1, 107: 1, 108: 1, 109: 1, 110: 1, 111: 1, 112: 1,
      gr: 0
    };
    [stamina.data.current, stamina.data.punish] = await getCurrentStamina();
    stamina.data.time = time(0);
    rounds ??= staminaCost[id];
    const cost = rounds * (_server.isekai ? 2 : 1) * (stamina.data.current >= 60 ? 0.03 : 0.02);

    const arena = getWithStringfied('arena', true, {});
    let query = id;
    if (!['gr', 'iw', 'tw'].includes(id)) {
      query = id >= 105 ? 'rb' : 'ar';
    } else if (id === 'gr') {
      if (arena.data.gr <= 0) {
        arena.data.arrayDone.push('gr');
        setIfChanged('arena', arena);
        $async.logSwitch(arguments);
        return await idleArena();
      }
    } else if (id === 'iw') {
      query = `iw&filter=${equip.filter}`;
    }
    query = `?s=Battle&ss=${query}`;

    let extra = { gr: 'GF', iw: 'IW', tw: 'TW' }[id];
    if (extra && ((!checkSupply(extra)) || !await asyncCheckRepair(extra))) {
      console.log('Check Extra Battle Ready Failed in supply/repair', 'id:', id, `eid:${equip?.id}`, equip, arena.data);
      $async.logSwitch(arguments);
      return false;
    }
    extra = { gr: 'GrindFest', iw: 'ItemWorld', tw: 'Tower' }[id];
    if (!await checkBattleReady(idleArena, { staminaCost: cost, checkEncounter: option.encounter, staminaLow: extra ? option[`stamina${extra}`] : undefined })) {
      console.log('Check Battle Ready Failed', 'id:', id, `eid:${equip?.id}`, equip, arena.data);
      $async.logSwitch(arguments);
      return false;
    }
    await waitPause();

    await checkURLBeforeNewRound(undefined, 'Failed arena wating url check before new round, retrying...\n');

    console.log('Arena Start', equip ? `e${equip.id} (${equip.world} => ${equip.world + 1}) / ${equip.max}\n${JSON.stringify(equip)}` : id);
    let result, debug = true;
    const onTryFailed = (type, err) => debug ? console.log('Fetch', type, 'failed, retrying...', err||'', JSON.stringify(result)) : undefined;
    await until(async () => { try {
      result = { query, retryCD: option.checkURLBeforeNewRoundRetry, tried: (result?.tried ?? -1)+1 };
      if (!(result.queryFetch = await $ajax.insert(query))) return onTryFailed('postoken');
      if (!(result.queryDoc = $doc(result.queryFetch))) return onTryFailed('postoken doc');
      delete result.queryFetch;
      if (isInBattle(result.queryDoc)) return true; // early return caused by battle direct enter;
      if (!(result.postoken = gE('input[name="postoken"]', result.queryDoc)?.value)) return onTryFailed('postoken value');
      result.data = `${equip ? `eqids%5B%5D=${equip.id}` : `initid=${['gr', 'tw'].includes(id) ? 1 : id}`}&postoken=${result.postoken}`;
      delete result.queryDoc;
      delete result.postoken;
      if (!(result.fetchResult = await $ajax.insert(query, result.data))) return onTryFailed('battle');
      if (!(result.fetchDoc = $doc(result.fetchResult))) return onTryFailed('battle doc');
      if (!(result.inBattle = !!isInBattle(result.fetchDoc))) return onTryFailed('in Battle');
      return true;
    } catch (err) { onTryFailed('result erroring', err); }}, option.checkURLBeforeNewRoundRetry);

    if (id === 'gr') arena.data.gr--;
    else if (!['tw', 'iw'].includes(id)) arena.data.arrayDone.push(id);
    else if (equip) arena.data.equip = { data: equip };
    setIfChanged('arena', arena);
    stamina.data.lastCost = id === 'gr' ? undefined : cost;
    setIfChanged('stamina', stamina);
    const alt = option.altBattleFirst && await $ajax.insert(window.location.href.replace('://hentaiverse.org', '://alt.hentaiverse.org'));
    console.log('Arena Fetch Done.', 'altBattleFirst:', option.altBattleFirst, 'Arena goto', alt ? 'alt' : '', arena.data);
    alt ? gotoAlt(true) : goto();
    $async.logSwitch(arguments);
    return true;
  } catch (err) { console.error(err); }}

  function setBattleSkillParam(id, params) {
    g.battle.skill = { id, [id]: 1, ...params };
  }

  // 战斗中//
  async function onBattleRound(init) { // 主程序
    if (!gE('#battle_main') || flags.battle) return;
    flags.battle = true;
    times.responsive = time(0);
    const option = g.option;
    let battle = getWithStringfied('battle', true);

    if (battle.data && battle.data.prevLog !== battle.data.turnLog) {
      battle.data.prevLog = battle.data.turnLog;
      const zeroturn = battle.data.turnLog.match(/>You use\s*(\w* (?:Gem|Draught|Potion|Elixir|Drink|Candy|Infusion|Scroll|Vase|Bubble)).*?</);
      if (!zeroturn) {
        battle.data.turn = (battle.data.turn??0) + 1;
      }
      battle.data.actions = (battle.data.actions??0) + 1;
    }

    if (!battle.data || !battle.data.roundAll) { // 修复因多个页面/世界同时读写造成缓存数据异常的情况
      battle.data = copy(g.battle);
      battle.data.monsterStatus = battle.data.monsterStatus.map(ms => {
        return {
          order: ms.order,
          hp: ms.hp
        }
      });
      battle.data.monsterStatus.sortBy(x => x.order);
    };
    $debug.log('onBattle', `\n`, battle.data);
    //人物状态
    if (gE('#vbh')) {
      realtime.hp = gE('#vbh>div>img').offsetWidth / 496 * 100;
      realtime.mp = gE('#vbm>div>img').offsetWidth / 207 * 100;
      realtime.sp = gE('#vbs>div>img').offsetWidth / 207 * 100;
      realtime.oc = gE('#vcp>div>div') ? (gE('#vcp>div>div', 'all').length - gE('#vcp>div>div#vcr', 'all').length) * 25 : 0;
    } else {
      realtime.hp = gE('#dvbh>div>img').offsetWidth / 418 * 100;
      realtime.mp = gE('#dvbm>div>img').offsetWidth / 418 * 100;
      realtime.sp = gE('#dvbs>div>img').offsetWidth / 418 * 100;
      realtime.oc = gE('#dvrc').childNodes[0].textContent * 1;
    }

    // 战斗战况
    if (!gE('.hvAALog')) {
      const div = onBattleBox().appendChild(cE('div'));
      div.className = 'hvAALog';
    }

    function getBattleTypeDisplay() {
      const difficulty = [
        ['普通×1', '普通×1', 'Normal×1', 1],
        ['困难×2', '困難×2', 'Hard×2', 7],
        ['噩梦×4', '噩夢×4', 'Nightmare×4', 14],
        ['地狱×7', '地獄×7', 'Hell×7', 20],
        ['任天堂×10', '任天堂×10', 'Nintendo×10', 27],
        ['IWBTH×15', 'IWBTH×15', 'IWBTH×15', 34],
        ['PFUDOR×20', 'PFUDOR×20', 'PFUDOR×20', 40],
      ];
      const battleInfoList = getBattleTypeDisplay.prototype.battleInfoList ??= {
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
          condition: sub => sub[4] === battle.data.roundAll,
          content: sub => sub[3],
        },
        'rb': {
          name: ['浴血', '浴血', 'Ring of Blood'],
          title: 'RB',
          list: [
            ['九死一树', '九死一樹', 'Triple Trio and the Tree', 250, 'Yggdrasil'],
            ['飞天意面怪', '飛天義麵怪', 'Flying Spaghetti Monster', 200],
            ['隐形粉红独角兽', '隱形粉紅獨角獸', 'Invisible Pink Unicorn', 150],
            ['现实生活', '現實生活', 'Real Life', 100],
            ['长门有希', '長門有希', 'Yuki Nagato', 75],
            ['朝仓凉子', '朝倉涼子', 'Ryouko Asakura', 75],
            ['朝比奈实玖瑠', '朝比奈實玖瑠', 'Mikuru Asahina', 75],
            ['泉此方', '泉此方', 'Konata', 75],
          ],
          condition: sub => monsterNames.indexOf(sub[4] ?? sub[2]) !== -1,
          content: sub => sub[3],
        },
        'ba': {
          name: ['遭遇', '遭遇', 'Random Encounter'],
          title: 'BA',
          content: _ => getEncounter().filter(e => e.encountered).length,
        },
        'tw': {
          name: ['塔楼', '塔樓', 'The Tower'],
          title: 'TW',
          list: difficulty,
          condition: sub => sub[3] && sub[3] <= battle.data.tower,
          content: _ => battle.data.tower,
          format: formatted => `<div style="font-size: 9pt!important">${formatted}<br>${battle.data.tower > 40 ? `+${(battle.data.tower - 40) * 5}%DMG&HP` : ''}</div>`,
        }
      }
      const type = battle.data.roundType;
      const monsterNames = Array.from(gE(`${monsterStateKeys.name}>div>div`, 'all')).map(monster => monster.innerHTML);
      const info = battleInfoList[type];
      const arena = realtime.arena ??= getWithStringfied('arena', true, {});
      battle.data.postoken ??= arena.data.postoken;

      [{ t: 'iw', k: 'equip'}, { t: 'tw', k: 'tw' }].forEach(({t, k}) => {
        if (!arena.data?.[k] || type === t) return;
        delete arena.data[k];
        setIfChanged('arena', arena);
      });

      let subtype = '', title = `${info?.title??''}`;

      const setNormalSub = function () {
        for (let sub of (info.list ?? [[]])) {
          if (info.condition && !info.condition(sub)) continue;
          title += info.content(sub);
          let formatted = UI.byLang(sub);
          if (info.format) formatted = info.format(formatted);
          subtype = formatted ? `<br>${formatted}` : '';
          return;
        }
      }

      const setDataSub = function (dataName, titleGetter, subtypeGetter) {
        const obj = arena.data[dataName];
        if (!obj) return;
        if (Object.keys(obj.tokens ?? {}).map(k => obj.tokens[k] === battle.data[k]).some(s => !s)) {
          // 有旧token，移除
          delete arena.data[dataName];
          setIfChanged('arena', arena);
          return;
        }
        // 没有token或是当前token，正常显示
        obj.tokens = { token: battle.data.token, postoken: battle.data.postoken };
        const data = obj.data;
        title += titleGetter(data);
        subtype += subtypeGetter(data);
        setIfChanged('arena', arena);
      }

      switch (type) {
        case 'ar': case 'rb': case 'ba':
          setNormalSub();
          break;
        case 'tw':
          setNormalSub();
          if (!arena.data.tw) {
            const cache = arena.data.cached?.tw
            if (cache) arena.data.tw = cache;
          }
          setDataSub('tw', d => `[${d}]`, d => `<div style="font-size: 9pt!important">Attempt ${d}</div>`);
          break;
        case 'iw':
          if (!arena.data.equip) {
            const equip = arena.data.cached?.iw?.find(d => d.id === _query['eqids[]'])?.equip;
            if (equip) arena.data.equip = { data: equip };
          }
          setDataSub('equip', d => `${d.world + 1}/${d.max}`, d => `<div style="font-size: 9pt!important">${UI.byLang(difficulty[d.diffbase-1])}${d.diffboost ? `+${d.diffboost}%DMG&HP<br>`: ''}[${d.id}]${d.name}</div>`);
      }
      return { title, full: `${UI.byLang(info?.name ?? ['未知', '未知', 'Unknown'])}:[${title}]${subtype}` };
    }

    let currentTurn = (battle.data.turn ?? 0);
    const currentActions = (battle.data.actions ?? currentTurn);
    const display = getBattleTypeDisplay();
    gE('.hvAALog').innerHTML = [
      `${UI.l('攻击模式', '攻擊模式', 'Attack Mode')}: ${UI.attackStatusType[realtime.attackStatus]}`,
      `${(_server.isekai) ? UI.l('异世界', '異世界', 'Isekai') : UI.l('恒定世界', '恆定世界', 'Persistent')}`, // 战役模式显示
      `${display.full}`, // 战役模式显示
      `R${battle.data.roundNow}/${battle.data.roundAll}:T${currentTurn}<span style="font-size: 9pt!important">(+${currentActions-currentTurn}*0tic)</span>`,
      `<div style="font-size: 9pt!important">TPS: ${runtime.runSpeed}<br>${runtime.runTimeGap??''}</div>`,
      `${UI.l('敌人', '敵人', 'Monsters')}: ${realtime.monsterAlive}/${realtime.monsterAll}`,
    ].join(`<br>`).replaceAll(`</div><br>`, `</div>`);
    if (!battle.data.roundAll) {
      pauseChange();
      $debug.shiftLog();
    }
    document.title = `${currentActions % 2 ? option.frequencySign1 ?? '' : option.frequencySign2 ?? ''}${display.title}:R${battle.data.roundNow}/${battle.data.roundAll}:T${currentTurn}@${runtime.runSpeed}tps,${realtime.monsterAlive}/${realtime.monsterAll}`;

    if (!battle.data.monsterStatus || battle.data.monsterStatus.length !== realtime.monsterAll) {
      fixMonsterStatus(battle);
    }
    setIfChanged('battle', battle);

    // 完成基础战斗数据更新，开始涉及公式部分及流程执行
    resetFormulaCache();
    countMonsterHP(copy(battle.data)); // 复制一份给 g
    displayMonsterWeight();
    displayPlayStatePercentage();
    if (getPause()) { // 如果禁用
      document.title = titlePause();
      const pauseChange = gE('#hvAABox2>button.pauseChange');
      pauseChange ? pauseChange.innerHTML = UI.button.continue(option) : undefined;
      delete flags.battle;
      return;
    }
    killBug(); // 解决 HentaiVerse 可能出现的 bug

    const taskList = {
      'Flee': () => {
        setBattleSkillParam(1001, { flee: 1, skill: 'flee' });
        if (option.autoFlee && checkCondition(option.fleeCondition)) {
          if (option.fleeAlarm) setAlarm('Flee');
          gE('1001').click();
          setExitBattleTimeout('Flee');
          return true;
        }
      },
      'Cure': () => autoRecover(true),
      'Pause': () => autoPause(battle),
      'SSDisable': () => autoSS(true),
      'Rec': () => autoRecover(false),
      'Scroll': useScroll,
      'Infus': useInfusions,
      'Def': autoDefend,
      'Channel': useChannelSkill,
      'Buff': useBuffSkill,
      'Debuff': useDeSkill,
      'Focus': autoFocus,
      'SS': () => autoSS(false),
      'Skill': autoSkill,
      'Atk': attack,
    };
    const order = ['Flee', ...option.battleOrderDefaultOnly ? [] : splitOrders(option.battleOrderName)];

    if (init || currentActions === 0) await waitBattleDelay('BeforeRound');

    onTasks();
    async function onTasks() {
      if (option.debugCheckCondition) checkCondition(option.debugCondition);

      const prevActionTime = battle.data.prevActionTime ?? 0;
      const remainDelay = prevActionTime + option.delay - time(0);
      if (remainDelay > 0) await sleep(remainDelay, true);

      const onTask = name => {
        if (!taskList[name]()) return;
        setIfChanged('battle', battle);
        onStepInDone();
        delete flags.battle;
        return true;
      }
      for (const name of range(order).map(i => order[i])) {
        if (onTask(name)) return;
        delete taskList[name];
      }
      for (let name in taskList) {
        if (onTask(name)) return;
      }
      delete flags.battle;
    }
  }

  function matchBuffImg(buff) {
    return buff?.getAttribute('onmouseover').match(/\(\s*'(?:[^']*?\(x(\d+)\)[^']*?|[^']*?)'\s*,\s*'.*'\s*,\s*(\d+|'.*?')\s*\)/);
  }

  function getBuffStackFromImg(buff) {
    return (matchBuffImg(buff)?.[1] ?? 1) * 1;
  }

  function getBuffTurnFromImg(buff) {
    let duration = matchBuffImg(buff)?.[2];
    switch (true) {
      case !duration:
        return 0;
      case ['autocast', 'permanent', '-'].includes(duration.replaceAll(/'/g, '')):
        return Infinity;
      case duration.replaceAll(/'/g, '') === 'decaying':
        {
          duration = 0;
          const decay = 1 - unsafeWindow.battle.set_infopane_effect.toString().match(/Decays by (\d+)% per turn/)[1]/100;
          let stacks = getBuffStackFromImg(buff);
          while((stacks = Math.floor(stacks * decay)) > 0) {
            duration++;
          }
          return duration;
        }
      default:
        duration = duration * 1;
        if (isNaN(duration)) console.warn('NaN duration:', buff, duration);
        return duration;
    }
  }

  function getMonsterID(s) {
    if (s.order !== undefined) {
      return (s.order + 1) % 10;
    } // case is monsterStatus
    return (s + 1) % 10; // case is order
  }

  function getMonster(id) {
    return gE(`#mkey_${id % 10}`);
  }

  function getBuff(buff, id) {
    if (buff?.match(`^{.*}$`)) {
      for (const b of buff.replace(/[\{\}\s]/g, '').split(',')) {
        const found = getBuff(b, id);
        if (found) return found;
      }
      return undefined;
    }
    if (id === undefined) {
      return gE(`#pane_effects>img[src*="/${buff}"]`) ?? gE(`#pane_effects>img[src*="_${buff}"]`);
    }
    return gE(`${monsterStateKeys.buffs}>img[src*="/${buff}"]`, getMonster(id)) ?? gE(`${monsterStateKeys.buffs}>img[src*="_${buff}"]`, getMonster(id));
  }

  function isOn(id) { // 是否可以施放技能/使用物品
    if (id * 1 > 10000) { // 使用物品
      return gE(`.bti3>div[onmouseover*="(${id})"]`);
    } // 施放技能
    return gE(id) && (gE(id).style.opacity * 1 !== 0.5);
  }

  /**
* 按照技能范围，获取包含原目标且范围内最终权重(finweight)之和最低的范围的中心目标
* @param {int} id id from g().battle.monsterStatus.sortBy(x => x.finWeight);
* @param {int} rangeSize radius, 0 for single-target and all-targets, 1 for treble-targets, ..., n for (2n+1) targets
* @param {(target) => number} excludeWeightRatio target with id
* @returns
*/
  function getRangeCenter(target, rangeSize, isWeaponAttack, excludeWeight, forceUseIndex) {
    let msTemp = copy(g.battle.monsterStatus);
    msTemp.sortBy(x => x.order);
    let minWeight = Number.MAX_SAFE_INTEGER;
    // 0. 范围大于等于全体时，直接释放全体
    if (!rangeSize || rangeSize >= msTemp.length) {
      return { id: getMonsterID(target), weight: minWeight };
    }
    const option = g.option;
    const centralExtraWeight = -1 * Math.log10(1 + (isWeaponAttack ? option.centralExtraRatio / 100 : 0));
    let order = target.order;
    let newOrder = order;
    let unreachableWeight = resolveRPNFormula(option.unreachableWeight, target);
    // sort by order to fix id
    // 1. 以选中目标为中心，优先向上
    // 2. 超过顶部则向下找
    // 3. 死亡、超过底下的将被溢出抛弃
    const up = Math.floor(rangeSize / 2);
    const down = rangeSize - up - 1;
    const top = order < rangeSize ? 0 : Math.max(order - down, 0);
    const bottom = Math.min(order + up, msTemp.length - 1);
    for (const center of range(top, bottom + 1)) {
      if (msTemp[center].isDead) continue;
      let weight = 0;
      let overflowed = center + Math.max(up - center, 0);
      for (const inRange of range(overflowed - up, overflowed + down + 1)) {
        let cew = inRange === center ? centralExtraWeight : 0; // cew <= 0, 增加未命中权重，降低命中权重
        let mon = msTemp[inRange];
        if (inRange < 0 || inRange >= msTemp.length || mon.isDead) { // 超出范围 或 死亡目标
          weight += unreachableWeight;
          continue;
        }
        weight += resolveSkillExtraWeight(target);
        if (excludeWeight) {
          weight += excludeWeight(mon);
        }
        weight += cew; // 中心目标会受到副手及冲击攻击时，相当于有效生命值降低
        weight += forceUseIndex ? -1 : mon.finWeight; // 强制使用顺序而非权重时，全部使用统一的权重而非怪物状态
      }
      if (weight < minWeight) {
        newOrder = center;
        minWeight = weight;
        break;
      }
    }
    return { id: getMonsterID(newOrder), weight: minWeight };
  }

  function autoPause(battle) {
    const temp = copy(battle.data);
    const option = g.option;
    let paused = battle.data.paused;
    if (
      paused?.round !== battle.data.roundNow
      || paused?.token !== battle.data.token
      || paused?.postoken !== battle.data.postoken
    ) {
      paused = battle.data.paused = {
        count: 0,
        round: battle.data.roundNow,
        token: battle.data.token,
        postoken: battle.data.postoken ??= (getValue('arena', true) ?? {}).postoken
      };
    }
    if (option.autoPause && checkCondition(option.pauseCondition)) {
      if (!flags.stepIn) {
        battle.data = temp;
        battle.data.paused ??= paused ?? {
          count: 0,
          round: battle.data.roundNow,
          token: battle.data.token,
          postoken: battle.data.postoken ??= (getValue('arena', true) ?? {}).postoken
        };
        battle.data.paused.turn = battle.data.turn;
        battle.data.paused.count++;
      }
      pauseChange();
      if (option.pauseAlarm) setAlarm('Pause');
      return true;
    }
    setIfChanged('battle', battle);
    return false;
  }

  function autoDefend() {
    const option = g.option;
    setBattleSkillParam('defend');
    if (option.defend && checkCondition(option.defendCondition)) {
      updateSkillOTOS('defend');
      gE('#ckey_defend').click();
      return true;
    }
    return false;
  }

  function setExitBattleTimeout(alarm) {
    times.responsive = Infinity;
    flags.exit = true;
    setAlarm(alarm);
    const option = g.option;
    if (alarm === 'Defeat' && (!option.autoSkipDefeated || !checkCondition(option.exitCondition))) {
      return;
    }
    if (option.exitAlarm) setAlarm('Exit');
    delValue(1);
    (async () => {
      const waitTime = await waitBattleDelay('ExitBattle');
      const maxWaited = time(0) + 10 * waitTime; // 等jpx最多等10倍时间
      if (gE('#ctrl-widget')) await until(() => (time(0) >= maxWaited) || (gE('#time-records-div') && gE('#revenue-records-table'))); // wait jpx
      backFromBattle();
    })();
  }

  async function checkResponsive() {
    const option = g.option;
    const battleUnresponsive = {
      'Alert': { method: () => (setAlarm('BattleUnresponsive') || true) },
      'Reload': { method: goto },
      'Alt': { method: gotoAlt }
    }
    let min = Infinity;
    for (let t in battleUnresponsive) {
      if (!option.battleUnresponsive?.[t] || !battleUnresponsive[t]) {
        delete battleUnresponsive[t];
        continue;
      }
      battleUnresponsive[t].time = Math.max(1, option.battleUnresponsiveTime?.[t] ?? 1) * _1s;
      min = Math.min(min, battleUnresponsive[t].time);
    }
    if (!Object.keys(battleUnresponsive).length) return;
    let isBreak;
    while (true) {
      await waitPause(true);
      const waited = new Date() - times.responsive;
      for (let t in battleUnresponsive) {
        if (battleUnresponsive[t].time > waited) continue;
        isBreak ||= battleUnresponsive[t].method();
      }
      if (flags.exit || isBreak) break;
      await sleep(min - waited);
    }
  }

  async function checkURLBeforeNewRound(url, logInfo) { try {
    const option = g.option;
    url ??= option.checkURLBeforeNewRound;
    if (!url) return;
    let attempts = 0;
    displayUntil(() => `[TIMER]${UI.byLang('等待URL检查', '等待URL檢查', 'Wait URL Check')}${attempts}`);
    times.responsive = Infinity;
    await until(async () => { try {
      attempts++;
      await waitPause(true);
      if (await $ajax.insert(url, undefined, undefined, {}, {}, true)) return true;
      console.log(logInfo);
    } catch (err) { console.error('Connect failed:', url) }}, option.checkURLBeforeNewRoundRetry * _1s, true);
    times.responsive = time(0);
    displayProcess();
  } catch(err) { console.error(err); }}

  async function waitBattleDelay(name) {
    const option = g.option;
    let delay = option[`${name}WaitTime`];
    if (!delay) return;
    const random = (option[`${name}WaitTimeRandom`] ?? 0) / 100;
    delay *= 1 + (2 * Math.random() - 1) * random; // ± 0 ~ random %
    const toDisplay = delay.toFixed(2);
    delay *= _1s;
    const start = time(0);
    until(async () => {
      const remain = start + delay - time(0);
      if (remain <= 0) return true;
      await waitPause();
      displayProcess(`[-${remainTime2Str(remain, true)}/${toDisplay}]${UI.byLang('等待延时', '等待延時', 'Waiting Delay')}`);
    }, 250);
    await sleep(delay, true);
    displayProcess();
    await waitPause(true);
    return delay;
  }

  function reloader() {
    let obj;
    unsafeWindow.api_call = function (b, a, d) {
      const option = g.option;
      let delay = option.delay * 1;
      const delay2 = option.delay2 * 1;
      unsafeWindow.info = a;
      unsafeWindow.send = new Date();
      b.open('POST', `${unsafeWindow.MAIN_URL}json`);
      b.setRequestHeader('Content-Type', 'application/json');
      b.withCredentials = true;
      b.onreadystatechange = d;
      b.onload = function () {
        unsafeWindow.response = new Date() - unsafeWindow.send;
        onPrevBattleLog();
        onEventEnd();
      };
      onEventStart();
      if (a.mode !== 'magic' || a.skill < 200) {
        delay = delay2;
      }
      if (delay <= 0) {
        b.send(JSON.stringify(a));
      } else {
        (async () => {
          await sleep(delay * (Math.random() * 50 + 50) / 100, true);
          b.send(JSON.stringify(a));
        })();
      }
    };
    unsafeWindow.api_response = function (b) {
      if (b.readyState !== 4) return false;
      if (b.status !== 200) {
        window.location.href = window.location.search;
        return false;
      }
      try {
        const a = JSON.parse(b.responseText);
        if (a.login !== undefined) {
          top.location.href = unsafeWindow.login_url;
          return false;
        }
        if (a.error || a.reload) window.location.href = window.location.search;
        return a;
      } catch (err) {
        console.error(b.responseText)
      }
    };

    function onEventStart () {
      const option = g.option;
      if (!option.recordUsage) return;
      const [mode, skill] = [unsafeWindow.info.mode, unsafeWindow.info.skill];
      obj = { mode };
      if (mode === 'items') {
        obj.itemName = gE(`#pane_item div[id^="ikey"][onclick*="skill('${skill}')"]`).textContent;
        obj.item = gE(`#pane_item div[id^="ikey"][onclick*="skill('${skill}')"]`).getAttribute('onmouseover').match(/(\d+)/)[1];
      } else if (mode === 'magic') {
        obj.magic = skill;
        obj.magicName = gE(skill).textContent;
        const cost = gE(skill).getAttribute('onmouseover').match(/\('.*', '.*', '.*', (\d+), (\d+), \d+\)/);
        obj.mp = cost[1] * 1;
        obj.oc = cost[2] * 1;
      }
    };

    function onEventEnd () {
      const option = g.option;
      const now = time(0);
      const delta = now - times.now;
      const delay = Math.max(0, option.delay - unsafeWindow.response);
      runtime.runSpeed = (_1s / delta).toFixed(2);
      runtime.runTimeGap = `(${Math.max(0,delta-unsafeWindow.response-delay)}+network:${unsafeWindow.response}${delay ? `+delay:${delay}`: ''}ms)`;
      times.now = now;
      const monsterDead = gE('img[src*="nbardead"]', 'all').length;
      realtime.monsterAlive = realtime.monsterAll - monsterDead;
      const bossDead = gE(`${monsterStateKeys.obj}[style*="opacity"] ${monsterStateKeys.lv}[style*="background"]`, 'all').length;
      realtime.bossAlive = realtime.bossAll - bossDead;
      const battleLog = gE('#textlog>tbody>tr>td', 'all');

      let stats = getWithStringfied('stats', true, {});
      const battle = g.battle;
      if (Object.keys(stats.data.tokens ?? {}).map(k => battle[k] === stats.data.tokens?.[k]).some(s => !s)) {
        if (option.recordUsage) recordUsage2(true, stats);
        if (option.dropMonitor) dropMonitor(battleLog, true);
      }
      if (option.recordUsage) {
        obj.log = battleLog;
        recordUsage(obj, stats);
      }
      setIfChanged('stats', stats);

      if (realtime.monsterAlive && !gE('#btcp')) {
        onBattleRound();
        return;
      }
      if (option.dropMonitor) {
        dropMonitor(battleLog);
      }
      if (option.recordUsage) {
        recordUsage2();
      }
      onRoundEnd();
      async function onRoundEnd() { try {
        await waitPause(true);
        $async.logSwitch(arguments);
        switch (true) {
          case gE('#btcp')?.innerHTML.includes("You have run away!"): return setExitBattleTimeout('Flee');
          case realtime.monsterAlive > 0: return setExitBattleTimeout('Defeat');
          case g.battle.roundNow === g.battle.roundAll: return setExitBattleTimeout('Victory');
        }
        await waitBattleDelay('NewRound');
        if (gE('#btcp')?.innerHTML.includes("finishbattle.png")) return console.error(`gE('#btcp')?.innerHTML.includes("finishbattle.png")`);
        await checkURLBeforeNewRound();
        const doc = $doc(await $ajax.insert(window.location.href, undefined, undefined, {}, {}, true));
        if (gE('#riddlecounter', doc)) {
          times.responsive = Infinity;
          if (option.riddlePopup && !window.opener) {
            window.open(window.location.href, 'riddleWindow', 'resizable, scrollbars, width=1241, height=707');
            $async.logSwitch(arguments);
            return;
          }
          console.log(window.location.href);
          goto();
          $async.logSwitch(arguments);
          return;
        }
        if (gE('#btcp')) { // 在没有btcp时跳过，例如被Monsterbation、jpx等其他脚本移除时
          if (option.nativeNewRound) {
            newRound(true, doc);
            onStepInDone();
            gE('#btcp').click();
            $async.logSwitch(arguments);
            return;
          }
          gE('#pane_completion').removeChild(gE('#btcp'));
        }
        ['#battle_right', '#battle_left'].forEach(selector => { gE('#battle_main').replaceChild(gE(selector, doc), gE(selector)); });
        document.dispatchEvent(new Event('DOMContentLoaded'));
        unsafeWindow.battle = undefined;
        if (!await loadUnsafeWindowBattle()) {
          setExitBattleTimeout('Defeat');
          return;
        }
        newRound(true);
        onStepInDone();
        await onBattleRound();
        $async.logSwitch(arguments);
      } catch (err) { console.error(err); }}
    };
  }

  function onPrevBattleLog(isNewTurn = true) {
    let regExp = onPrevBattleLog.prototype.regExp ??= {
      locationQueries: /\w+=\w+/g,
      playerInfo: /(\w+) Lv\.(\d+)/,
      staminaInfo: /Stamina:\s(\d+)/,
      spellInfo: /\('([\w\s-]+)'.*, '(\w+)', (\d+), (\d+), (\d+)\)/, //Name, iconID, MP, OC, CD
      itemInfo: /set_infopane_item\((\d+)/,
      battleTypeLog: /Initializing (.*) \.\.\./,
      floor: /Floor (\d+)/,
      round: /Round (\d+) \/ (\d+)/,
      monster: /MID=(\d+) \(([^<>]+)\) \LV=(\d+) HP=(\d+)/g,
      effectGain: /([\w\s-]+) gains the effect ([\w\s-]+)\./g,
      effectExpired: /The effect ([\w\s-]+) on ([\w\s-]+) has expired\./g,
      effectWear: /The effect ([\w\s-]+) on ([\w\s-]+) has worn off\./g,
      effectWearAsleep: /([^<>]+) has been roused from its sleep\./g,
      effectWearConfused: /([^<>]+) got knocked out of confuse\./g,
      oc: /div/g,
      ocHalf: /vcr/g,
      spellMatch: /\('(?<name>[\w\s-]+)(?:\s\(x(?<stack>\d+)\))?',\s?(?<description>.*),\s?'?(?<turns>[\w\s-]+)'?\)/,
      //battleRecorder
      turnLog: /([^]+?)<tr><td class="tls">/,
      //timeRecorder
      action: />([^<>]+)<\/td><\/tr>(<tr><td class="tlb">Spirit Stance Exhausted<\/td><\/tr>)*<tr><td class="tls"/,
      action2: />([^<>]+)<\/td><\/tr><tr><td class="tlb?">[^<>]+<\/td><\/tr>(<tr><td class="tlb">Spirit Stance Exhausted<\/td><\/tr>)*<tr><td class="tls"/,
      zeroturn: /You use\s*(\w* (?:Gem|Draught|Potion|Elixir|Drink|Candy|Infusion|Scroll|Vase|Bubble))/,
      use: /You (cast|use) ([\w\s-]+)/,
      //combatRecorder
      damage: /[^<>]+damage/g,
      damageTaken1: /(?<v>glances|hits|crits) you.*?(?<n>\d+).*?(?<t>\w+) damage/,
      damageTaken2: /which (?<v>glances|hits|crits).*?(?<n>\d+).*?(?<t>\w+) damage/,
      spiritShield: /absorbs (\d+)/,
      damageDealt1: /(?:You|Your offhand attack|Arcane Blow) (?:(?<s>\d)x-)*(?<v>glance|hit|crit).*?(?<n>\d+).*?(?<t>\w+) damage/,
      damageDealt2: /(?:(?<s>\d)x-)*(?<v>glanced|hit|crit|eviscerated) for (?<n>\d+) (?<t>\w+) damage/,
      strike: /(Fire|Cold|Wind|Elec|Holy|Dark|Void) Strike hits.*?(\d+).*?(\w+) damage/,
      explode: /explodes for (\d+) (\w+) damage/,
      damagePlus: /for (\d+) damage/,
      damagePhysicalPlus: /(Bleeding Wound|Spreading Poison)/,
      damagePoints: /for (\d+) points of (\w+) damage/,
      debuffLog: /(?:<tr><td class="tlb?">[^<>]+(?: gains the effect | partially resists the effects of your spell\.| shrugs off the effects of your spell\.)+[^<>]*<\/td><\/tr>)+<tr><td class="tl">You cast [a-zA-Z]+\.<\/td><\/tr>/,
      debuffResist0: / gains the effect (?!Coalesced Mana)/g,
      debuffResist1: / partially resists the effects of your spell\./g,
      debuffResist3: / shrugs off the effects of your spell\./g,
      counter: />You counter/g,
      //    dealt magical
      magicalDealtMiss: / to connect\./g,
      magicalDealtEvade: / evades your spell\./g,
      magicalDealtResistPartially: / resists, and was/g,
      magicalDealtResist: / resists your spell\./g,
      //    dealt physical
      physicalDealtMiss: / its mark\./g,
      physicalDealtEvade: / dodges your attack\./g,
      physicalDealtParryPartially: / parries[^<>]+?(\d+)[^<>]+?(\w+) damage/g,
      physicalDealtParry: / parries your attack\./g,
      //    taken magical
      magicalTakenMiss: /(?:casts[^<>]+, but misses the attack\.|casts[^<>]+, missing you completely\.)/g,
      magicalTakenEvade: />You evade the attack\./g,
      magicalTakenResistPartially: / resist the attack/g,
      magicalTakenBlockPartially: /casts[^<>]+partially block (?:and|resist| )*the attack/g,
      magicalTakenBlock: /(?<!partially )block (?:and|resist| )*the attack\./g,
      //    taken physical
      physicalTakenMiss: /(?:uses[^<>]+, but misses the attack\.|(?:vigorously whiffs at a shadow|uses[^<>]+), missing you completely\.)/g,
      physicalTakenEvade: />You evade the attack from/g,
      physicalTakenParryPartially: /partially parry the attack/g,
      physicalTakenParry: /(?<!partially )parry the attack/g,
      physicalTakenBlockPartially: /(?:(?:uses[^<>]+|>)You|you) partially block (?:and|partially|parry| )*the attack/g,
      physicalTakenBlock: /(?<!partially )block (?:and|partially|parry| )*the attack/g,
      //revenueRecorder
      gainExp: /gain (\d+) EXP/,
      gainCredit: /gain (\d+) Credit/,
      proficiencies: /\d+\.\d+ points of [^<>]+ proficiency/g,
      proficiency: /(\d+\.\d+) points of ([^<>]+) proficiency/,
      dropsLogs: /\S+ <span style="color:.{7}">\[[^<>]+\](<\/span><\/td><\/tr><tr><td class="tlb">A traveling)*/g,
      drop: /(\S+) \<.*#(.{6}).*\[(.*)\](.)*/,
      quality: /(Crude|Fair|Average|Superior|Exquisite|Magnificent|Legendary|Peerless)/,
      credit: /(\d+) Credit/,
      crystal: /(?:(\d+)x )?(Crystal of \w+)/,
    };

    let battle = getWithStringfied('battle', true);
    const turnLog = gE('#textlog').innerHTML.match(/([^]+?)((<tr><td class="tls">)|(<\/tbody>))/)?.[0];

    // cache last turn channeling
    const channeling = battle.data.channeling || 1;
    battle.data.channeling = getBuff('channeling') ? 1.5 : 1;

    if (!turnLog) return;

    if (isNewTurn &&= turnLog !== battle.data.turnLog) {
      battle.data.turnLog = turnLog;
      battle.data.time = new Date().getTime();
    }
    setIfChanged('battle', battle);

    if (turnLog.match(regExp.battleTypeLog)) return; // skip if is new round since no new proficiency or monster effect

    // update proficiency
    const proficiency = battle.data.proficiency ?? {};
    const ptypes = {
      'cloth armor': 'Cloth Armor',
      'deprecating magic' : 'Deprecating',
      'divine': 'Divine',
      'dual wielding' : 'Dual-wielding',
      'elemental': 'Elemental',
      'forbidden': 'Forbidden',
      'heavy armor': 'Heavy Armor',
      'light armor': 'Light Armor',
      'one-handed weapon': 'One-handed',
      'staff': 'Staff',
      'supportive magic' : 'Supportive',
      'two-handed weapon': 'Two-handed',
    }
    if (isNewTurn) {
      for (const prof of turnLog.match(regExp.proficiencies) ?? []) {
        const [_, points, type] = prof.match(regExp.proficiency);
        proficiency[ptypes[type]] += points * 1;
        proficiency[ptypes[type]] = proficiency[ptypes[type]].toFixed(3) * 1;
      }
      setValue('proficiency', proficiency);
    }

    if (!(g.option.debuffAutoFill)) return;
    // update monster effects
    if (!battle.data?.monsterStatus) return;
    if (battle.data.monsterStatus.map(m => getMonster(getMonsterID(m))).filter(mon => mon === null).length) {
      fixMonsterStatus(battle);
    }

    let effectChanges = getEffectChanges(turnLog);

    // 消除对每次操作影响turns程度最大的加速buff（技能或卷轴）
    let turnDelta = (isNewTurn && !turnLog.match(regExp.zeroturn)) ? 1 : 0;
    turnDelta *= 100 / ((getBuff('haste')?.getAttribute('onmouseover').match(/increasing its action speed by (.*)%\./)[1] ?? 0) * 1 + 100);

    const getBuffSkill = (buff) => Object.values(monsterBuffSkillLib).find(skill => [skill.name, skill.buff].includes(buff)) ?? console.log('Unknown debuff skill', buff);
    for (const activeMonster of battle.data.monsterStatus) {
      const monster = getMonster(getMonsterID(activeMonster));
      if (gE('img[src*="nbardead.png"]', monster)) continue; // continue if dead

      let name = gE(monsterStateKeys.name, monster).innerText;
      let effectObj = {};
      let jpxObj = {};
      let monster_btm6 = gE('.btm6', monster);
      const abs = ability;
      monster_btm6.querySelectorAll('img').forEach(effect => {
        let tooltip = effect.getAttribute('onmouseover');
        if (!tooltip) return;

        let matches = tooltip.match(regExp.spellMatch);
        if (!matches?.groups) return;

        let { name, stack, description, turns } = matches.groups;
        if (!name) return console.log('Undefined debuff name:', name);
        const jpx = turns === '-' || description.includes('jpx Hidden Effects');
        if (jpx) { // 可能为jpx补全的buff，在hvAA中重新计算确认数据
          jpxObj[name] = effect;
          return;
        }
        let dc = getBuffSkill(name)?.description;
        if (dc !== description) {
          // TODO 测试确保 ability[4213] Better Slow 效果描述正常，目前是描述均是30%
          if (dc !== `'The target has been slowed by ${[30, 40, 40, 45, 50, 50][abs[4213] ?? 0]}%, making it attack less frequently.'` && description !== `'The target has been slowed by 30%, making it attack less frequently.'`) {
            console.log('Unmatched debuff description:', description, '\n from', name, dc);
          }
        }
        effectObj[name] = { turns, stack: stack ?? 1 };
      });
      let effects = Object.keys(effectObj);

      // DEBUG LEGACY ---------------------
      localStorage.removeItem(`hvAA-${_server.name}_rec`);
      // DEBUG LEGACY---------------------

      let savedEffects = activeMonster.effectObj ??= {};
      if (effects.length <= 5) for (const effect in savedEffects) delete savedEffects[effect];
      if (effects.length >= 5) for (const effect of effects) savedEffects[effect] = { ...effectObj[effect] }; // updated directly
      if (effects.length !== 6) continue; // <= 5 && undetermined situation

      if (effectChanges[name]) {
        for (const effect of effectChanges[name].add) {
          const skill = getBuffSkill(effect);
          if (!skill) continue;
          // TODO 确认熟练度倍率公式，已知最大为4。推测：计算方式为 (p-pmin)/(pmax-pmin) * 4. pmin/pmax 见 https://ehwiki.org/wiki/Spells#Deprecating_Magic 和 https://ehwiki.org/wiki/Spells#Offensive_Magic ; 减益技能(deprecating) 统一按照减益的熟练度; 元素攻击（应该包括Burning Soul/Ripened Soul?）带来的按各自的熟练度（推测是按T3的pmin/pmax）; 至于取整方式则暂时无法确定
          let [duration, base, profRatio, prof, channelingRatio] = getDuration(skill, channeling);
          if (savedEffects[name]) savedEffects[name][effect].channeling ??= channelingRatio;
          if (effects.includes(effect)) continue; // updated directly above
          if (!duration) { console.log('duration undefined saved effect:', effect, savedEffects[effect]) }
          if (savedEffects[effect]) {
            const turn = (savedEffects[effect].turns ?? 0) * 1;
            if (isNewTurn && !isNaN(turn)) duration = turn + (duration ?? 0);
          }
          savedEffects[effect] = { turns: duration ?? '-', stack: '-' , channeling: channelingRatio};
        }
        for (const effect of effectChanges[name].remove) (!effects.includes(effect) && (effect in savedEffects)) && delete savedEffects[effect];
      }

      applyHiddenDelta(savedEffects, effectObj, turnDelta);

      monster_btm6.style.width = 'max-content';
      activeMonster.effectObj = savedEffects;
      for (const effect in savedEffects) {
        if (effect in effectObj) continue;
        let { turns, stack } = savedEffects[effect];
        effectObj[effect] = { turns, stack };
        if (isNaN(+turns)) turns = `'${String(turns).replace(/'/g, "\\'")}'`;
        let img = jpxObj[effect] ?? document.createElement('img');
        img.src = (`${_server.isekai ? '/isekai' : ''}/y/e/${ getBuffSkill(effect)?.img || 'channeling'}.png`);
        let description = getBuffSkill(effect)?.description;
        img.setAttribute('onmouseover', `battle.set_infopane_effect('${effect} (x${stack})', ${description}, ${isNaN(+turns) ? turns : Math.floor(turns)})`);
        img.setAttribute('onmouseout', 'battle.clear_infopane()');

        monster_btm6.appendChild(img);
      }
    }

    if (isNewTurn) setIfChanged('battle', battle); // update monsterEffects

    function getDuration(skill, channeling) {
      let [base, profRatio, prof] = [skill.duration, 1, 0];
      if (typeof base === 'number') {
        base = base * 1;
      } else if (base !== 'permanent') { for (const ab in base) {
        base = base[ab][ability[ab] ?? 0];
        break;
      } }
      if (skill.proficiency) {
        const [ptype, plow, phigh] = skill.proficiency;
        prof = proficiency[ptype];
        profRatio = Math.max(1, Math.min(4, (prof - plow) / (phigh - plow) * 4).toFixed(6) * 1);
      }
      const channelingRatio = skill.channling ? channeling : 1;
      const duration = typeof base === 'number' ? Math.round(base * channelingRatio * profRatio) : base;
      return [duration, base, profRatio, prof, channelingRatio];
    }

    function getEffectChanges(turnLog) {
      let effectsAdded = turnLog.matchAll(regExp.effectGain);
      let effectsRemoved = [...turnLog.matchAll(regExp.effectExpired), ...turnLog.matchAll(regExp.effectWear)];
      let asleepRemoved = turnLog.matchAll(regExp.effectWearAsleep);
      let confusedRemoved = turnLog.matchAll(regExp.effectWearConfused);
      let effectChanges = {};

      for (const match of effectsAdded) (effectChanges[match[1]] ??= { add: [], remove: [] }).add.push(match[2]);
      for (const match of effectsRemoved) (effectChanges[match[2]] ??= { add: [], remove: [] }).remove.push(match[1]);
      for (const match of asleepRemoved) (effectChanges[match[1]] ??= { add: [], remove: [] }).remove.push('Asleep');
      for (const match of confusedRemoved) (effectChanges[match[1]] ??= { add: [], remove: [] }).remove.push('Confused');

      return effectChanges;
    }

    function applyHiddenDelta(savedEffects, effectObj, delta) {
      if (!savedEffects) return;

      let elementEffects = ['Searing Skin', 'Freezing Limbs', 'Turbulent Air', 'Deep Burns', 'Breached Defense', 'Blunted Attack'];
      let effects = Object.keys(effectObj);
      let elementCount = effects.filter(effect => elementEffects.includes(effect)).length;

      for (const savedEffect in savedEffects) {
        if (effects.includes(savedEffect)) continue;

        if (
          (elementCount < 3 && elementEffects.includes(savedEffect)) ||
          savedEffect === 'Coalesced Mana'
        ) {
          delete savedEffects[savedEffect];
          continue;
        }

        if (!delta || delta <= 0) continue;
        let savedTurns = +savedEffects[savedEffect]?.turns;
        if (isNaN(savedTurns)) continue;

        if (savedTurns - delta < 0 && elementEffects.includes(savedEffect)) {
          delete savedEffects[savedEffect];
          continue;
        }
        savedEffects[savedEffect].turns = Math.max(0, savedTurns - delta);
      }
    }
  }

  async function loadUnsafeWindowBattle() { try {
    unsafeWindow.battle = await until(() => {
      if (gE('#vbd')) return true;
      const battle = new unsafeWindow.Battle();
      return battle;
    }, 300, true);
    if (!unsafeWindow.battle && gE('#vbd')) {
      console.log('Initialization of unsafeWindow.battle stoped due to defeated.');
      return false;
    }
    unsafeWindow.battle.clear_infopane();
    return true;
  } catch (err) { console.error(err); }}

  function newRound(isNew, doc) { // New Round
    $debug.log('______________newRound', isNew);
    const option = g.option;
    doc ??= document;
    const token = document.documentElement.outerHTML.match(/var battle_token = "(.*)";/)[1];
    let battle = getWithStringfied('battle', true);
    const arena = getValue('arena', true) ?? {};
    const same = battle.data?.token === token && arena?.postoken === battle.data?.postoken;
    const prof = getValue('proficiency', true);
    if (isNew) {
      battle.data = { proficiency: same ? battle.data?.proficiency ?? prof : prof };
    }
    if (!battle.data) {
      battle.data = copy(g.battle ?? {});
      battle.data.monsterStatus?.sortBy(x => x.order);
    };
    [battle.data.token, battle.data.postoken] = [token, arena.postoken];
    battle.data.proficiency = same ? battle.data?.proficiency ?? prof : prof;
    setIfChanged('battle', battle);
    if (window.location.hash !== '') {
      goto();
    }
    realtime.monsterAll = gE(monsterStateKeys.obj, 'all', doc).length;
    const monsterDead = gE('img[src*="nbardead"]', 'all', doc).length;
    realtime.monsterAlive = realtime.monsterAll - monsterDead;
    realtime.bossAll = gE(`${monsterStateKeys.lv}[style^="background"]`, 'all', doc).length;
    const bossDead = gE(`${monsterStateKeys.obj}[style*="opacity"] ${monsterStateKeys.lv}[style*="background"]`, 'all', doc).length;
    realtime.bossAlive = realtime.bossAll - bossDead;
    const types = {
      ar: {
        reg: /^Initializing arena challenge/,
        extra: id => id <= 35,
      },
      rb: {
        reg: /^Initializing arena challenge/,
        extra: id => id >= 105,
      },
      iw: { reg: /^Initializing Item World/ },
      gr: { reg: /^Initializing Grindfest/ },
      tw: { reg: /^Initializing The Tower/ },
      ba: { reg: /^Initializing random encounter/ },
    }
    const battleLog = gE('#textlog>tbody>tr>td', 'all', doc);
    const firstLog = battleLog[battleLog.length - 1]?.textContent;

    if (firstLog && (!battle.data.roundType || firstLog.match(/^Initializing/))) {
      battle.data.tower = (firstLog.match(/\(Floor (\d+)\)/) ?? [null])[1] * 1;
      const id = (firstLog.match(/\d+/) ?? [null])[0] * 1;
      battle.data.roundType = undefined;
      for (let name in types) {
        const type = types[name];
        if (!firstLog.match(type.reg)) continue;
        if (type.extra && !type.extra(id)) continue;
        battle.data.roundType = name;
        break;
      }
      if (!battle.data.roundType) console.warn('Unable to get battle type from log:', _server, firstLog);
    }
    if (battle.data.roundType === 'ba' || document.body.innerHTML.match(/Initializing random encounter/)) {
      const encounter = getEncounter();
      if (encounter[0]) {
        encounter[0].encountered = time(0);
        setEncounter(encounter);
      }
    }

    const roundPrev = battle.data.roundNow;

    if (firstLog?.match('Initializing')) {
      const monsterStatus = [];
      let order = 0;
      const monsterNames = Array.from(gE(`${monsterStateKeys.name}>div>div`, 'all', doc)).map(monster => monster.innerText);
      const monsterLvs = Array.from(gE(`${monsterStateKeys.lv}>div>div`, 'all', doc)).map(monster => monster.innerText);
      const monsterDB = getWithStringfied('monsterDB', true, {});
      const monsterMID = getWithStringfied('monsterMID', true, {});
      for (let i = battleLog.length - 2; i > battleLog.length - 2 - realtime.monsterAll; i--) {
        let hp = battleLog[i].textContent.match(/HP=(\d+)$/)[1] * 1;
        if (isNaN(hp)) {
          hp = getHPFromMonsterDB(monsterDB.data, monsterNames[order], monsterLvs[order]) ?? monsterStatus[monsterStatus.length - 1].hp;
        }
        monsterStatus[order] = { order, hp };
        order++;

        if (!option.cacheMonsterHP) continue;
        let lv = battleLog[i].textContent.match(/LV=(\d+)/)[1] * 1;
        let [_, mid, name] = battleLog[i].textContent.match(/MID=(\d+) \((.*)\) LV/);
        mid*=1;
        if (!name || isNaN(lv) || isNaN(mid)) continue;
        monsterDB.data[name] ??= {};
        if (monsterDB.data[name].mid && monsterDB.data[name].mid !== mid) { // 名称被其他mid被占用
          monsterMID.data[monsterDB.data[name].mid] = copy(monsterDB.data[name]); // 将之前mid的数据进行另外备份
          monsterDB.data[name] = {}; // 重置该名称的数据
        }
        if (monsterMID.data[mid]) {
          monsterDB.data[name] = copy(monsterMID.data[mid]); // 将之前备份的mid的数据进行恢复
          delete monsterMID.data[mid];
        }
        monsterDB.data[name].mid = mid;
        monsterDB.data[name][lv] = hp;
      }
      if (option.cacheMonsterHP) {
        setIfChanged('monsterDB', monsterDB);
        setIfChanged('monsterMID', monsterMID);
      }
      battle.data.monsterStatus = monsterStatus;

      const round = battleLog[battleLog.length - 1].textContent.match(/\(Round (\d+) \/ (\d+)\)/);
      if (round && battle.data.roundType !== 'ba') {
        battle.data.roundNow = round[1] * 1;
        battle.data.roundAll = round[2] * 1;
      } else {
        battle.data.roundNow = 1;
        battle.data.roundAll = 1;
      }
    } else if (!battle.data.monsterStatus || battle.data.monsterStatus.length !== gE(monsterStateKeys.lv, 'all', doc).length) {
      battle.data.roundNow = 1;
      battle.data.roundAll = 1;
    }

    if (roundPrev !== battle.data.roundNow) {
      battle.data.turn = 0;
      setValue('skillOTOS', {});
    }
    battle.data.roundLeft = battle.data.roundAll - battle.data.roundNow;
    setIfChanged('battle', battle);
  }

  function killBug() { // 在 HentaiVerse 发生导致 turn 损失的 bug 时发出警告并移除问题元素: https://ehwiki.org/wiki/HentaiVerse_Bugs_%26_Errors#Combat
    const bugLog = gE('#textlog > tbody > tr > td[class="tlb"]', 'all');
    const isBug = /(Slot is currently not usable)|(Item does not exist)|(Inventory slot is empty)|(You do not have a powerup gem)/;
    for (const i of range(bugLog)) {
      if (bugLog[i].textContent.match(isBug)) {
        bugLog[i].className = 'tlbWARN';
        setTimeout(() => { // 刷新移除问题元素，间隔时间以避免持续刷新
          window.location.href = window.location.search ? window.location.pathname + window.location.search : window.location.href;
        }, 700);
      } else {
        bugLog[i].className = 'tlbQRA';
      }
    }
  }

  function countMonsterHP(battle) { // 统计敌人血量
    let i, j;
    const monsterHp = gE(`${monsterStateKeys.bars}:nth-child(1)`, 'all');
    const monsterMp = gE(`${monsterStateKeys.bars}:nth-child(2)`, 'all');
    const monsterSp = gE(`${monsterStateKeys.bars}:nth-child(3)`, 'all');
    const monsterStatus = battle.monsterStatus;
    const hpArray = [];
    for (i of range(monsterHp)) {
      monsterStatus[i] ??= {};
      if (gE('img[src*="nbardead.png"]', monsterHp[i])) {
        monsterStatus[i].isDead = true;
        monsterStatus[i].hpNow = Infinity;
      } else {
        monsterStatus[i].isDead = false;
        monsterStatus[i].hpNow = Math.floor(monsterStatus[i].hp * parseFloat(gE('img:first-child', monsterHp[i]).style.width) / 120 + 1);
        monsterStatus[i].mpNow = parseFloat(gE('img:first-child', monsterMp[i]).style.width) / 120;
        monsterStatus[i].spNow = parseFloat(gE('img:first-child', monsterSp[i]).style.width) / 120;
        hpArray.push(monsterStatus[i].hpNow);
      }
    }
    battle.monsterStatus = monsterStatus;

    const monsterBuff = gE(monsterStateKeys.buffs, 'all');
    const hpMin = Math.min.apply(null, hpArray);
    const option = g.option;
    const yggdrasilExtraWeight = option.YggdrasilExtraWeight;
    const baseHpRatio = option.baseHpRatio;
    // 权重越小，优先级越高
    for (i of range(monsterStatus)) { // 死亡的排在最后（优先级最低）
      const target = monsterStatus[i];
      if (target.isDead) {
        target.finWeight = resolveRPNFormula(option.unreachableWeight, target);
        continue;
      }
      let weight = baseHpRatio * Math.log10(target.hpNow / hpMin); // > 0 生命越低权重越低优先级越高
      const name = gE(`${monsterStateKeys.name}>div>div`, monsterBuff[i].parentNode).innerText;
      if (yggdrasilExtraWeight && (['Yggdrasil', '世界树 Yggdrasil'].includes(name))) { // 默认设置下，任何情况都优先击杀群体大量回血的boss"Yggdrasil"
        weight += yggdrasilExtraWeight; // yggdrasilExtraWeight.defalut -1000
      }
      const known = {};
      for (j in monsterBuffSkillLib) {
        const skill = monsterBuffSkillLib[j];
        if (!getBuff(skill.img, getMonsterID(target))) {
          continue;
        }
        known[skill.img] = skill;
        if (skill.elem && skill.elem !== realtime.attackStatus) {
          weight += option.weight?.[`${j}1`] ?? 0;
          continue;
        }
        weight += option.weight?.[j] ?? 0;
      }

      let unknown = gE(`img`, 'all', monsterBuff[i]);
      if (unknown?.length) {
        unknown = Array.from(unknown).filter(buff => {
          const img = buff.src.match(/\/y\/e\/(.*)\.png/)[1];
          return !(Object.keys(known).includes(img));
        }).map(buff => `${buff.getAttribute('onmouseover').match(/^battle.set_infopane_effect\('(.+)', *'.*',.+\)/)[1]}: ${buff.src.match(/\/y\/e\/(.*)\.png/)[1]}`);
        if (unknown.length) {
          console.log('unsupported buff weight:', unknown);
        }
      }
      monsterStatus[i].finWeight = weight;
    }

    // 先存一次，用于下面的额外权重公式
    battle.monsterStatus = monsterStatus.sortBy(x => x.finWeight);
    g.battle = battle;
    const extraWeightFormula = option.extraWeightFormula;
    // 额外权重公式
    monsterStatus.forEach(t => {
      const extra = resolveRPNFormula(extraWeightFormula, t);
      t.finWeight += isNaN(+extra) ? 0 : extra;
    });
    battle.monsterStatus = monsterStatus.sortBy(x => x.finWeight);
    g.battle = battle;
  }

  function resolveSkillExtraWeight(target) {
    if (flags.weight) return 0;
    flags.weight = true;
    const result = resolveRPNFormula(g.option.skillExtraWeight, target);
    delete flags.weight;
    return result;
  }

  function autoRecover(isCureOnly) { // 自动回血回魔
    const option = g.option;
    if (!option.item) return false;
    const name = splitOrders(option.itemOrderName, getDefaultOrder('itemOrder'));
    const order = splitOrders(option.itemOrderValue, getDefaultOrder('itemOrder', ord => ord.value.match(/,(.*)/)[1] * 1));
    const cures = [313, 11199, 11501, 10005, 11195, 311];
    for (const i of range(name)) {
      let id = order[i];
      if (isCureOnly && !cures.includes(id)) continue;
      setBattleSkillParam(id);
      if (option.item[name[i]] && checkCondition(option[`item${name[i]}Condition`]) && isOn(id)) {
        updateSkillOTOS(id);
        (gE(`.bti3>div[onmouseover*="(${id})"]`) ?? gE(id)).click();
        return true
      }
    }
    return false;
  }

  function useScroll() { // 自动使用卷轴
    const option = g.option;
    if (!option.scrollSwitch) {
      return false;
    }
    if (!option.scroll) {
      return false;
    }
    if (!option.scrollRoundType) {
      return false;
    }
    if (!option.scrollRoundType[g.battle.roundType]) {
      return false;
    }
    setBattleSkillParam('scroll');
    if (!checkCondition(option.scrollCondition)) {
      return false;
    }
    const scrollLib = useScroll.prototype.scrollLib ??= {
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
    const scrollFirst = (option.scrollFirst) ? '_scroll' : '';
    for (const i in scrollLib) {
      if (!option.scroll[i]) {
        continue;
      }
      const id = scrollLib[i].id;
      if (!gE(`.bti3>div[onmouseover*="(${id})"]`)) {
        continue;
      }
      setBattleSkillParam(id, { scroll: 1} );
      if (!checkCondition(option[`scroll${i}Condition`])) {
        continue;
      }
      for (const j of range(scrollLib[i].mult)) {
        if (getBuff(scrollLib[i][`img${j+1}`] + scrollFirst)) {
          continue;
        }
        updateSkillOTOS(id);
        gE(`.bti3>div[onmouseover*="(${id})"]`).click();
        return true;
      }
    }
    return false;
  }

  function checkBuffThreshold(buff, threshold) {
    const id = playerBuffSkillLib[buff].id;
    const buffObj = getBuff(playerBuffSkillLib[buff].img);
    threshold = threshold?.[buff] ?? 0;
    const current = getBuffTurnFromImg(buffObj);
    const checked = !isOn(id) || (current === Infinity || threshold >= 0 && current > threshold);
    return { id, buffObj, threshold, current, checked };
  }

  function onClickBuff(id) {
    updateSkillOTOS(id);
    gE(id).click();
  }

  function useChannelSkill() { // 自动施法Channel技能
    const option = g.option;
    if (!option.channelSkillSwitch) {
      return false;
    }
    if (!getBuff('channeling')) {
      return false;
    }

    playerBuffSkillLib.CF.id = getBuff('sparklife') ? undefined : 422;
    if (option.channelSkill) {
      const skillPack = splitOrders(option.buffSkillOrderValue, getDefaultOrder('buffSkillOrder'));
      for (const buff of skillPack) {
        if (!option.channelSkill[buff]) continue;

        const { id, buffObj, current, threshold, checked } = checkBuffThreshold(buff, option.channelThreshold);
        if (checked) continue;

        if (buffObj) continue;
        onClickBuff(id);
        return true;
      }
    }
    if (option.channelSkill2) {
      const order = splitOrders(option.channelSkill2OrderValue);
      const buffs = order.map(id => Object.keys(playerBuffSkillLib).find(s => playerBuffSkillLib[s].id * 1 === 1 * id)).filter(buff => buff);
      for (const buff of buffs) {
        const { id, buffObj, current, threshold, checked } = checkBuffThreshold(buff, option.channelThreshold);
        if (checked) continue;
        onClickBuff(id);
        return true;
      }
    }
    if (option.channelRebuff) {
      let minBuff, minTime;
      for (const buff in playerBuffSkillLib) {
        const { id, buffObj, current, threshold, checked } = checkBuffThreshold(buff, option.channelThreshold);
        if (checked) continue;

        if (buffObj?.src.match(/_scroll.png$/) || (minTime && current >= minTime)) continue;
        if (!current && (!option.buffSkillSwitch || !option.buffSkill[buff])) continue;

        minBuff = id;
        minTime = current;
      }
      if (minBuff && gE(minBuff)) {
        onClickBuff(minBuff);
        return true;
      }
    }
    return false;
  }

  function useBuffSkill() { // 自动施法BUFF技能
    const option = g.option;
    if (!option.buffSkillSwitch) {
      return false;
    }
    if (!option.buffSkill) {
      return false;
    }
    setBattleSkillParam('buff');
    if (!checkCondition(option.buffSkillCondition)) {
      return false;
    }
    const skillPack = splitOrders(option.buffSkillOrderValue, getDefaultOrder('buffSkillOrder'));
    for (const buff of skillPack) {
      if (!option.buffSkill[buff]) continue;

      const { id, buffObj, current, threshold, checked } = checkBuffThreshold(buff, option.buffSkillThreshold);
      if (checked) continue;
      setBattleSkillParam(id, { buff: 1});
      if (checkCondition(option[`buffSkill${buff}Condition`])) {
        onClickBuff(id);
        return true;
      }
    }

    const draughtPack = useBuffSkill.prototype.draughtPack ??= {
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
    for (const i in draughtPack) {
      const id = draughtPack[i].id;
      setBattleSkillParam(id, { draught: 1});
      if (!getBuff(draughtPack[i].img) && option.buffSkill && option.buffSkill[i] && checkCondition(option[`buffSkill${i}Condition`]) && gE(`.bti3>div[onmouseover*="(${id})"]`)) {
        updateSkillOTOS(id);
        gE(`.bti3>div[onmouseover*="(${id})"]`).click();
        return true;
      }
    }
    return false;
  }

  function useInfusions() { // 自动使用魔药
    const option = g.option;
    if (!option.infusionSwitch) return false;
    setBattleSkillParam('infusion');
    if (!checkCondition(option.infusionCondition)) {
      return false;
    }

    const onUse = function(status) {
      if (getBuff(infusionLib[status].img)) return false;
      const itemBtn = gE(`.bti3>div[onmouseover*="(${infusionLib[status].id})"]`);
      if (!itemBtn) return false;
      updateSkillOTOS(infusionLib[status].id);
      itemBtn.click();
      return true;
    }
    const infusionLib = useInfusions.prototype.infusionLib ??= [
      null, {
        id: 12101,
        img: 'fireinfusion',
        name: 'Flames',
      }, {
        id: 12201,
        img: 'coldinfusion',
        name: 'Frost',
      }, {
        id: 12301,
        img: 'elecinfusion',
        name: 'Lightning',
      }, {
        id: 12401,
        img: 'windinfusion',
        name: 'Storms',
      }, {
        id: 12501,
        img: 'holyinfusion',
        name: 'Divinity',
      }, {
        id: 12601,
        img: 'darkinfusion',
        name: 'Darkness',
      }
    ];

    if (option.infusionDefaultOnly) {
      const attackStatus = realtime.attackStatus;
      if (attackStatus === 0) return false;
      return onUse(attackStatus);
    }
    if (!option.infusion) return false;
    const order = splitOrders(option.infusionOrderName, getDefaultOrder('infusionOrder'));
    for (const name of order) {
      const condition = option[`infusion${name}Condition`];
      const status = infusionLib.findIndex(i => i?.name === name);
      const id = infusionLib[status].id;
      setBattleSkillParam(id, { infusion: 1});
      if (!checkCondition(condition)) continue;
      if (onUse(status)) return true;
    }
    return false;
  }

  function autoFocus() {
    const option = g.option;
    setBattleSkillParam('focus');
    if (option.focus && checkCondition(option.focusCondition)) {
      updateSkillOTOS('focus');
      gE('#ckey_focus').click();
      return true;
    }
    return false;
  }

  function autoSS(isDisableOnly) {
    const textSP = gE('#vrs') ?? gE('#dvrs');
    const spValue = textSP.childNodes[0].textContent * 1;
    if (spValue <= 1) {
      return false;
    }
    const option = g.option;
    const enabled = gE('#ckey_spirit[src*="spirit_a"]');
    setBattleSkillParam(enabled ? 'spiritoff' : 'spiriton', { spirit: enabled ? 'off' : 'on' });
    if (
      (!isDisableOnly && !enabled && option.turnOnSS && checkCondition(option.turnOnSSCondition))
      || (enabled && option.turnOffSS && checkCondition(option.turnOffSSCondition))
    ) {
      updateSkillOTOS(enabled ? 'spiritoff' : 'spiriton');
      gE('#ckey_spirit').click();
      return true;
    }
    return false;
  }

  async function clickMonster(id) {
    if (!unsafeWindow.battle) {
      console.log('loadUnsafeWindowBattle before click monster');
      if (!await loadUnsafeWindowBattle()) {
        return;
      }
    }
    getMonster(id).click();
  }

  /**
* INNAT / WEAPON SKILLS
*
* 优先释放先天和武器技能
*/
  function autoSkill() {
    const option = g.option;
    if (!option.skillSwitch) return false;
    if (!option.skill) return false;
    if (option.skillSSOnly && !gE('#ckey_spirit[src*="spirit_a"]')) {
      return false;
    }
    const skillOrder = splitOrders(option.skillOrderValue, getDefaultOrder('skillOrder'));
    const fightStyle = realtime.fightingStyle; // 1二天 2单手 3双手 4双持 5法杖
    const skillLib = {
      OFC: 1111,
      FRD: 1101,
      T3: fightStyle ? `2${fightStyle}03` * 1 : undefined,
      T2: fightStyle ? `2${fightStyle}02` * 1 : undefined,
      T1: fightStyle ? `2${fightStyle}01` * 1 : undefined,
    };
    const skillInfos = autoSkill.prototype.skillInfos ??= {
      1101: { oc: 4, range: 10 },
      1111: { oc: 8, range: 10 },
      2101: { oc: 4, range: 5 },
      2201: { oc: 1, },
      2203: { oc: 4, },
      2302: { range: 5 },
      2303: { range: 5 },
      2403: { oc: 3, range: 5 },
    }
    const monsterStatus = g.battle.monsterStatus;
    for (let i in skillOrder) {
      let skill = skillOrder[i];
      if (!skill || !option.skill[skill]) {
        continue;
      }
      let id = skillLib[skill];
      if (!isOn(id)) {
        continue;
      }
      if (realtime.oc < (skillInfos[id]?.oc ?? 2)) {
        continue;
      }
      const skillOTOS = getValue('skillOTOS', true) ?? {};
      skillOTOS[skill] ??= 0;
      if (option.skillOTOS && option.skillOTOS[skill] && skillOTOS[skill] >= 1) {
        continue;
      }
      const skillRange = skillInfos[id]?.range ?? 1;
      setBattleSkillParam(id, { skill: skill, range: skillRange });
      let target = checkCondition(option[`skill${skill}Condition`], monsterStatus);
      if (!target) continue;
      updateSkillOTOS(i, skillOTOS);
      updateSkillOTOS(skill, skillOTOS);
      gE(id).click();
      clickMonster(getRangeCenter(target, skillRange).id);
      return true;
    }
    return false;
  }

  function useDeSkill() { // 自动施法DEBUFF技能
    const option = g.option;
    const monsterStatus = g.battle.monsterStatus;
    setBattleSkillParam('debuff');
    if (!option.debuffSkillSwitch || !checkCondition(option.debuffSkillCondition, monsterStatus)) { // 总开关是否开启
      return false;
    }

    // 先处理特殊的 “先给全体上buff”
    let skillPack = splitOrders(option.debuffSkillOrderAllValue, getDefaultOrder('debuffSkillOrderAll'));
    for (let i = 0; i < skillPack.length; i++) {
      let buff = skillPack[i];
      if (option[`debuffSkill${buff}All`]) { // 是否启用
        const skill = monsterBuffSkillLib[buff];
        const id = skill.id*1;
        setBattleSkillParam(id, { all: id, debuff: buff, debuffAll: buff });
        if (checkCondition(option[`debuffSkill${buff}AllCondition`], monsterStatus)) { // 检查条件
          continue;
        }
      }
      skillPack.splice(i, 1);
      i--;
    }
    const toAllCount = skillPack.length;

    if (option.debuffSkill) { // 是否有启用的buff(不算两个特殊的)
      skillPack = skillPack.concat(splitOrders(option.debuffSkillOrderValue, getDefaultOrder('debuffSkillOrder')));
    }
    for (let i in skillPack) {
      let buff = skillPack[i];
      const isToAll = i < toAllCount;
      if (!isToAll) { // 非先全体
        const skill = monsterBuffSkillLib[skillPack[i]];
        const id = skill.id*1;
        setBattleSkillParam(id, { debuff: buff });
        if (!buff || !option.debuffSkill[buff] || !checkCondition(option[`debuffSkill${buff}Condition`], monsterStatus)) { // 检查条件
          continue;
        }
      }
      let succeed = useDebuffSkill(buff, isToAll);
      // 前 toAllCount 个都是先给全体上的
      if (succeed) {
        return true;
      }
    }
    return false;
  }

  function useDebuffSkill(buff, isAll = false) {
    const skill = monsterBuffSkillLib[buff];
    if (!isOn(skill.id)) { // 技能不可用
      return false;
    }
    // 获取范围
    let skillRange = 1;
    let ab;
    for (ab in skill.range) {
      const ranges = skill.range[ab];
      if (!ranges) {
        continue;
      }
      skillRange = ranges[ability ? ability[ab] ?? 0 : 0];
      break;
    }
    // 获取目标
    const option = g.option;
    const excludedWeight = target => resolveRPNFormula(option.excludedWeightFormula[buff], target);
    let exclusiveBuffs;
    if (isAll && option.debuffAllExclusive) {
      exclusiveBuffs = Object.keys(option.debuffAllExclusive);
      exclusiveBuffs = exclusiveBuffs?.includes(buff) ? exclusiveBuffs : undefined
    }
    let isDebuffed = (target, b) => {
      if (b || !exclusiveBuffs) {
        const current = getBuffTurnFromImg(getBuff(monsterBuffSkillLib[b ?? buff].img, getMonsterID(target)));
        const threshold = option.debuffSkillThreshold ? option.debuffSkillThreshold[b ?? buff] : 0;
        return threshold >= 0 && current > threshold;
      }
      for (const exclusive of exclusiveBuffs) {
        if (isDebuffed(target, exclusive)) return excludedWeight(target);
      }
      return 0;
    };
    let debuffByIndex = isAll && option[`debuffSkill${buff}AllByIndex`];
    let monsterStatus = g.battle.monsterStatus;
    if (debuffByIndex) {
      monsterStatus = copy(monsterStatus).sortBy(x => x.order);
    }
    let max = isAll ? monsterStatus.length : 1;
    let id;
    let minWeight = Number.MAX_SAFE_INTEGER;
    const condition = option[`debuffSkill${buff}${isAll ? 'All' : ''}Condition`];
    setBattleSkillParam(skill.id, { debuff: buff, ...isAll ? { all: skill.id, debuffAll: buff, range: skillRange }: { }});
    const excludeCondition = target => checkCondition(condition, [target]) ? isDebuffed(target) : excludedWeight(target);
    for (const i of range(max)) {
      let target = buff === 'Dr' ? monsterStatus[max - i - 1] : monsterStatus[i];
      target = checkCondition(condition, [target]);
      if (!target || target.isDead || isDebuffed(target)) continue;
      const center = getRangeCenter(target, skillRange, false, excludeCondition, debuffByIndex);
      if (!id || center.weight < minWeight) {
        minWeight = center.weight;
        id = center.id;
        if (!isAll) break; // 只有覆盖全体才需要遍历全部
      }
    }
    if (id === undefined) {
      return false;
    }
    const imgs = gE('img', 'all', gE(monsterStateKeys.buffs, getMonster(id)));
    const buffs = Object.fromEntries(Array.from(imgs).map(img => [img.src.match(/\/y\/e\/(.*)\.png/)[1], img]));
    // 已有buff小于6个
    // 未开启debuff失败警告
    // buff剩余持续时间大于等于警报时间
    if (imgs.length >= 6) {
      switch (option.debuffSkillTurnAlert * 1) {
        case 1:
          if ((option.debuffSkillTurn && (getBuffTurnFromImg(buffs[skill.img]) ?? 0) >= option.debuffSkillTurn[buff])) {
            return false;
          }
          UI.alert('无法正常施放DEBUFF技能，请尝试手动打怪', '無法正常施放DEBUFF技能，請嘗試手動打怪', 'Can not cast de-skills normally, continue the script?\nPlease try attack manually.');
          pauseChange();
          return true;
        case 2:
          break;
        default: // case 0, "" or undefined
          return false;
      }
    }
    updateSkillOTOS(skill.id);
    gE(skill.id).click();
    clickMonster(id);
    return true;
  }

  function getCurrentAttackStatus() {
    let current = realtime.attackStatusCurrent;
    if (current === undefined) { // first stack of condition
      attack(true);
      current = realtime.attackStatusCurrent
      realtime.attackStatusCurrent = undefined;
    }
    return current;
  }

  function attack(selectStatusOnly = false) { // 自动打怪
    const option = g.option;
    const monsters = g.battle.monsterStatus;
    if (option.attackStatusSwitch) {
      let tier = option.attackStatusSwitchByTier ? 3 : undefined;
      const order = splitOrders(option.attackStatusOrderValue, getDefaultOrder('attackStatusOrder'));
      while (tier === undefined || tier-- !== 0) {
        for (const status of order) {
          if (!status && tier) continue;
          if (!option.attackStatusSwitch[status]) continue;
          realtime.attackStatusCurrent = status;
          setBattleSkillParam('switch', { tier });
          if (!checkCondition(option[`attackStatusSwitchCondition${status}`], monsters)) continue;
          if (onAttack(status, selectStatusOnly, tier)) return true;
        }
        if (tier === undefined) break;
      }
    }
    realtime.attackStatusCurrent = realtime.attackStatus;
    return onAttack(realtime.attackStatus, selectStatusOnly);
  }

  function onAttack(attackStatus, selectStatusOnly = false, tier = undefined) {
    const updateAbility = onAttack.prototype.updateAbility ??= {
      4301: { //火
        111: [3, 4, 4, 5, 5, 5, 5, 5],
        112: [4, 4, 6, 6, 6, 6, 7, 7],
        113: [7, 7, 7, 7, 8, 9, 9, 10]
      },
      4302: { //冰
        121: [3, 4, 4, 5, 5, 5, 5, 5],
        122: [4, 4, 6, 6, 6, 6, 7, 7],
        123: [7, 7, 7, 7, 8, 9, 9, 10]
      },
      4303: { //雷
        131: [3, 4, 4, 5, 5, 5, 5, 5],
        132: [4, 4, 6, 6, 6, 6, 7, 7],
        133: [7, 7, 7, 7, 8, 9, 9, 10]
      },
      4304: { //雷
        141: [3, 4, 4, 5, 5, 5, 5, 5],
        142: [4, 4, 6, 6, 6, 6, 7, 7],
        143: [7, 7, 7, 7, 8, 9, 9, 10]
      },
      //暗
      4401: { 161: [3, 4, 5] },
      4402: { 162: [5, 6, 7] },
      4403: { 163: [7, 8, 9, 10] },
      //圣
      4501: { 151: [3, 4, 5] },
      4502: { 152: [5, 6, 7] },
      4503: { 153: [7, 8, 9, 10] },
    }

    const option = g.option;
    const battle = g.battle;
    const monsters = battle.monsterStatus;
    let target = monsters[0];

    // 如果
    // 1. 开启了自动以太之触
    // 2. 目标怪在魔力合流状态中
    // 3. 满足条件
    // 使用物理普通攻击，跳过Offensive Magic
    // 否则按照属性攻击模式释放Spell > Offensive Magic
    let skillRange = 1, skill = 0, attackTier = 0;
    const fightingStyle = realtime.fightingStyle * 1;
    // 1. physical
    if (attackStatus === 0) {
      skillRange = fightingStyle === 1 ? 3 : 1;
      setBattleSkillParam('attack', { range: skillRange });
      return tryAttack();
    }
    // 2. etherTap
    if (option.etherTap && getBuff('coalescemana', getMonsterID(target))) {
      const expiring = [getBuffStackFromImg, getBuffTurnFromImg].map(getter => getter(getBuff('wpn_et')) <= 1).reduce((acc, cur) => acc || cur);
      setBattleSkillParam('etherTap', { tier });
      if (expiring && checkCondition(option.etherTapCondition)) {
        return tryAttack();
      }
    }
    // 3.0 try check skill condition
    skill = 1 * (() => {
      const conditions = [option.lowSkillCondition, option.middleSkillCondition, option.highSkillCondition];
      for (const lv of range(tier ?? 2, -1, -1)) {
        let id = `1${attackStatus}${lv + 1}` * 1;
        attackTier = lv+1;
        setBattleSkillParam(id, { attackTier });
        if (isOn(id) && (target = checkCondition(conditions[lv], monsters))) return id;
        if (tier) return 0;
      }
    })();
    // 3.a no skill available
    if (!skill) {
      attackTier = 0;
      if (tier) return false;
      return tryAttack();
    }
    // 3.b cast skill
    for (let ab in updateAbility) {
      const ranges = updateAbility[ab][skill];
      if (!ranges) continue;
      const ability = getValue('ability', true);
      skillRange = ranges[ability ? ability[ab] ?? 0 : 0];
      break;
    }
    return tryAttack(skill);

    function tryAttack (skill=0) {
      if (!target || target.isDead) {
        return false;
      }
      if (selectStatusOnly) {
        return true;
      }
      if (skill && gE(skill)) {
        updateSkillOTOS(skill);
        updateSkillOTOS(`attackStatus${attackStatus}`);
        updateSkillOTOS(`attackTier${attackTier}`);
        gE(skill).click();
      }
      setBattleSkillParam(skill, { attackTier, range: skillRange });
      clickMonster(getRangeCenter(target, skillRange, !attackStatus).id);
      return true;
    };
  }

  function updateSkillOTOS(id, skillOTOS) {
    let local;
    skillOTOS ??= (local = getWithStringfied('skillOTOS', true, {})).data;
    skillOTOS[id] ??= 0;
    skillOTOS[id]++;
    return setIfChanged('skillOTOS', { data:skillOTOS, old: local?.old });
  }

  // TODO TBD 根据lv模糊推测（一般数据都是等级逐渐提升的，可能可以直接用缓存而不需要推测，异世界新赛季时可以自动刷新缓存?）
  function getHPFromMonsterDB(mdb, name, lv) {
    return mdb?.[name]?.[lv];
  }

  function fixMonsterStatus(battle) { // 修复monsterStatus
    // document.title = UI.byLang('monsterStatus错误，正在尝试修复', 'monsterStatus錯誤，正在嘗試修復', 'monsterStatus Error, trying to fix');
    const monsterStatus = [];
    const monsterNames = Array.from(gE(`${monsterStateKeys.name}>div>div`, 'all')).map(monster => monster.innerText);
    const monsterLvs = Array.from(gE(`${monsterStateKeys.lv}>div>div`, 'all')).map(monster => monster.innerText);
    const monsterDB = getValue('monsterDB', true);
    gE(monsterStateKeys.lv, 'all').forEach((monster, order) => {
      monsterStatus.push({
        order: order,
        hp: getHPFromMonsterDB(monsterDB, monsterNames[order], monsterLvs[order]) ?? ((monster.style.background === '') ? 1000 : 100000),
      });
    });
    battle.data.monsterStatus = monsterStatus;
    setIfChanged('battle', battle);
  }

  function displayMonsterWeight() {

    const status = g.battle.monsterStatus.filter(m => !m.isDead);

    const weights = [];
    status.forEach(s => {
      if (weights.indexOf(s.finWeight) !== -1) {
        return;
      }
      weights.push(s.finWeight);
    });
    const colorTextList = [];
    const option = g.option;
    const weightBG = option.weightBackground;
    if (weightBG) {
      for (const i of range(weights)) {
        colorTextList[i] = weightBG[i];
      }
    }
    status.forEach(s => {
      const rank = weights.indexOf(s.finWeight);
      const id = getMonsterID(s);
      if (!getMonster(id) || !gE(monsterStateKeys.name, getMonster(id))) {
        return;
      }
      if (option.displayWeightBackground && weightBG) {
        let colorText = colorTextList[rank];
        let remainAttemp = 10; // 避免无穷递归
        while (remainAttemp > 0 && colorText && colorText.indexOf(`<style_`) !== -1) {
          for (const i of range(colorTextList)) {
            colorText = colorText.replace(`<style_${i + 1}>`, colorTextList[i]);
          }
          remainAttemp--;
        }
        try {
          colorText = eval(colorText.replace('<rank>', rank).replace('<all>', weights.length));
        }
        catch { }
        getMonster(id).style.cssText += `background: ${colorText};`;
      }
      gE(monsterStateKeys.name, getMonster(id)).style.cssText += 'display: flex; flex-direction: row;'
      if (option.displayWeight) {
        getMonster(id).innerHTML += `<div style='font-weight: bolder; right:0px; position: absolute;'>[${rank}|-${-rank + weights.length - 1}|${s.finWeight.toPrecision(s.finWeight >= 1 ? 5 : 4)}]</div>`;
      }
    });
  }

  function displayPlayStatePercentage() {
    const barHP = gE('#vbh') ?? gE('#dvbh');
    const barMP = gE('#vbm') ?? gE('#dvbm');
    const barSP = gE('#vbs') ?? gE('#dvbs');
    const barOC = gE('#dvbc');
    const textHP = gE('#vrhd') ?? gE('#dvrhd') ?? gE('#dvrhb');
    const textMP = gE('#vrm') ?? gE('#dvrm');
    const textSP = gE('#vrs') ?? gE('#dvrs');
    const textOC = gE('#dvrc');
    const barWidth = gE('#dvbc') ? [418, 418, 418, 418] : [496, 207, 207, undefined]
    const percentages = [barHP, barMP, barSP, barOC].filter(bar => bar).map((bar, i) => Math.floor((gE('div>img', bar).offsetWidth / barWidth[i]) * 100));
    [textHP, textMP, textSP, textOC].filter(bar => bar).forEach((text, i) => {
      text.style.cssText += textOC ? `
display: grid;
grid-template-columns: 1fr 1fr;
width: 120px;
`: "";
      const percentageDiv = gE('div', text);
      const style = `
position: relative;
top: ${textOC ? 0 : text === textHP ? -16.67 : -16}px;
right: ${textOC ? -10 : text === textMP ? -60 : text === textSP ? 40 : -100}px;
filter: brightness(0.2);
text-align: left;
`
      const inner = `[${percentages[i].toString()}%]`;
      if (percentageDiv) {
        percentageDiv.innerHTML = inner;
        percentageDiv.style.cssText = style;
        return;
      }
      text.innerHTML += `<div style="${style}">${inner}</div>`
    });
  }

  function dropMonitor(battleLog, different) { // 掉落监测
    let drop = getWithStringfied('drop', true, {});
    drop.data ??= {
      '#startTime': time(3),
      '#EXP': 0,
      '#Credit': 0,
    };
    const option = g.option;
    let item, name, amount, regexp;
    for (const i of range(battleLog)) {
      if (/^You gain \d+ (EXP|Credit)/.test(battleLog[i].textContent)) {
        regexp = battleLog[i].textContent.match(/^You gain (\d+) (EXP|Credit)/);
        if (regexp) {
          drop.data[`#${regexp[2]}`] += regexp[1] * 1;
        }
      } else if (gE('span', battleLog[i])) {
        item = gE('span', battleLog[i]);
        name = item.textContent.match(/^\[(.*?)\]$/)[1];
        if (item.style.color === 'rgb(255, 0, 0)') {
          const quality = ['Crude', 'Fair', 'Average', 'Superior', 'Exquisite', 'Magnificent', 'Legendary', 'Peerless'];
          for (const j of range(option.dropQuality, quality)) {
            if (name.match(quality[j])) {
              name = `Equipment of ${name.match(/^\w+/)[0]}`;
              drop.data[name] = (name in drop.data) ? drop.data[name] + 1 : 1;
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
          drop.data[name] = (name in drop.data) ? drop.data[name] + amount : amount;
        } else if (item.style.color === 'rgb(168, 144, 0)') {
          drop.data['#Credit'] = drop.data['#Credit'] + name.match(/\d+/)[0] * 1;
        } else {
          drop.data[name] = (name in drop.data) ? drop.data[name] + 1 : 1;
        }
      } else if (battleLog[i].textContent === 'You are Victorious!') {
        break;
      }
    }
    const battle = g.battle;
    if (option.recordEach && (different || battle.roundNow === battle.roundAll)) {
      const old = getWithStringfied('dropOld', true, []);
      drop.data.__name = getValue('battleCode', true).name;
      drop.data['#endTime'] = time(3);
      old.data.push(drop.data);
      setIfChanged('dropOld', old);
      delValue('drop');
    } else {
      setIfChanged('drop', drop);
    }
    if (getComputedStyle(gE('#hvAATab-Drop')).display === 'block') {
      gE(`.hvAATabmenu>span[name="Drop"]`).click();
    }
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function formatMonsterNames(t) {
    const monsterNames = g.battle.monsterStatus.map(m => gE(`.btm3>div>div`, getMonster(getMonsterID(m))).innerText);
    [...monsterNames].sortBy(x => x.length).reverse().forEach(name => {
      t = t.replaceAll(new RegExp(escapeRegExp(name), 'g'), match => `MONSTER_${((monsterNames.findIndex(x => x === match)*1+1)||1)-1}`);
    });
    return t;
  }

  function getWithStringfied(key, toJSON, defaultValue, local) {
    const data = (local ? getLocal(key, true) : getValue(key, toJSON)) || defaultValue;
    return { data: data, old: JSON.stringify(data) };
  }

  function setIfChanged(key, value, portable, local) {
    if (value.old !== JSON.stringify(value.data)) {
      if (local) setLocal(key, value.data, true);
      else setValue(key, value.data, portable);
    }
    return value;
  }

  function recordUsage(param, stats) {
    const filter = g.option.record;
    if (!filter) return;
    let statsStatic = getWithStringfied('statsStatic', true, {});
    let logCache = getWithStringfied('logCache', true, []);
    const battle = g.battle;
    const init = (filterKey, defaultValue, keys) => {
      let key, data = stats.data;
      keys ??= filterKey;
      keys = keys.split('.');
      while (true) {
        key = keys.shift();
        if (!keys.length) break;
        data = data[key];
      }
      data[key] ??= filter[filterKey] ? defaultValue : undefined;
    };
    const initSelf = key => init(key.replace(/_/, ''), 0, `self.${key}`);
    const initObject = key => init(key, {});
    const initHurt = key => init(`hurt${key}`, 0, `hurt._${key}`);
    (() => {
      stats.data.self ??= { _startTime: time(3) };
      stats.data.tokens ??= { token: battle.token, postoken: battle.postoken };
      ['_turn', '_prevBattleTurn', '_actions', '_prevBattleActions', '_round', '_battle', '_monster', '_boss', 'evade', 'miss', 'focus', 'mp', 'oc'].forEach(initSelf);
      // 回复量, 物品使用次数, 技能使用次数, 技能攻击造成的伤害, 熟练度, 受到攻击造成的伤害,
      ['restore', 'items', 'magic', 'damage', 'proficiency', 'hurt'].forEach(initObject);
    })();
    if (filter.hurt) {
      ['avg', 'count', 'total', 'mavg', 'mcount', 'mtotal', 'pavg', 'pcount', 'ptotal'].forEach(initHurt);
    }
    if (filter.turn) {
      const currentLog = gE('#textlog').innerHTML.match(/([^]+?)((<tr><td class="tls">)|(<\/tbody>))/)[0];
      const zeroturn = currentLog.match(/>You use\s*(?:\w* (?:Gem|Draught|Potion|Elixir|Drink|Candy|Infusion|Scroll|Vase|Bubble)).*?</);
      const initturn = currentLog.match(/^Initializing .* \.\.\./);
      battle.turn ??= (zeroturn || initturn) ? 0 : 1;
      battle.actions ??= battle.turn ?? (initturn ? 0 : 1);
      stats.data.self._turn += battle.turn + ((battle.turn >= stats.data.self._prevBattleTurn) ? - stats.data.self._prevBattleTurn : 1);
      stats.data.self._actions += battle.actions + ((battle.actions >= stats.data.self._prevBattleActions) ? - stats.data.self._prevBattleActions : 1);
      [stats.data.self._prevBattleTurn, stats.data.self._prevBattleActions] = [battle.turn, battle.actions];
    }
    if (realtime.monsterAlive === 0) {
      if (filter.round) stats.data.self._round++;
      if (filter.battle && (battle.roundNow === battle.roundAll)) stats.data.self._battle++;
    }
    if (param.mode === 'magic') {
      const [magic, magicName] = [param.magic, param.magicName];
      if (filter.magic) {
        let prev = stats.data.magic[magic] ?? 0;
        if (magicName in stats.data.magic) {
          prev += stats.data.magic[magicName];
          delete stats.data.magic[magicName];
        }
        stats.data.magic[magic] = prev + 1;
        (statsStatic.data.magicNames ??= {})[magic] = magicName;
      }
      if (filter.mp) stats.data.self.mp += param.mp;
      if (filter.oc) stats.data.self.oc += param.oc;
    }
    else if (param.mode === 'items') {
      if (filter.items) {
        const[item, itemName] = [param.item, param.itemName];
        let prev = stats.data.items[item] ?? 0;
        if (itemName in stats.data.items) {
          prev += stats.data.items[itemName];
          delete stats.data.items[itemName];
        }
        stats.data.items[item] = prev + 1;
        (statsStatic.data.itemsNames ??= {})[item] = itemName;
      }
    }
    else {
      if (filter[param.mode]) {
        stats.data.self[param.mode] = (param.mode in stats.data.self) ? stats.data.self[param.mode] + 1 : 1;
      }
    }

    try { logCache.data = logCache.data.filter(r => {
      if (!r.handled) return; // remove legacy record
      return !recordLog(r.text, stats.data, filter, r.prev, r.handled, r.mode);
    })}
    catch (err) { console.error(err); };
    let logRange = [...param.log].findIndex(log => log.className === 'tls');
    if (logRange >= 0) param.log = [...param.log].slice(0, logRange);
    param.log = [...param.log].map(log => formatMonsterNames(log.textContent).trim()).filter(t => t);
    let text, prev, handled = [];
    const mode = param.magic ?? param.item ?? param.mode;
    // reverse track
    while (prev || param.log.length) {
      if (text) handled.push(text);
      text = prev;
      prev = param.log.shift() ?? undefined;
      if (!text) continue;
      try {
        if (!recordLog(text, stats.data, filter, prev, handled, mode)) {
          logWarn('unknown log type', text, prev, handled, mode);
        }
      } catch (err) {
        logWarn('error log type'+err, text, prev, handled, mode);
      }
    }

    logCache.data = logCache.data.slice(0, Math.min(logCache.data.length, 50));
    setIfChanged('logCache', logCache);
    setIfChanged('statsStatic', statsStatic);
    if (getComputedStyle(gE('#hvAATab-Usage')).display === 'block') {
      gE(`.hvAATabmenu>span[name="Usage"]`).click();
    }

    function logWarn(info, text, prev, handled, mode) {
      const toWarn = t => t?.replaceAll(/MONSTER_\d/g, 'MONSTER_0').replaceAll(/ [\d.]+/g, ' 0').replaceAll(/_\d+/g, '_0');
      const warn = {
        prev: toWarn(prev),
        text: toWarn(text),
        handled: handled.map(toWarn),
        mode
      }
      if (!logCache.data.some(w => JSON.stringify(w.text) === JSON.stringify(warn.text))) {
        console.warn(info, ':', warn.text);
        logCache.data.unshift(warn);
      }
    }

    function recordLog(text, stats, filter, prev, handled, mode, match) {
      function matchDamage(fromText) {
        const regExp = matchDamage.prototype.regExp ??= /^(MONSTER_\d|[yY]ou|[^\,\.]+)?(?:(?:(?:uses|casts) .*, which)*(?:was|resists, and was)* ((?:\d+x-)*crit|hit|glance|counter|explode)?(?:d|s|!)*) (MONSTER_\d|[yY]ou)*(?:(?:; MONSTER_\d |; [yY]ou |, which )*((?: |partially|block|blocks|parry|parries|evade|resist|evades|and)+)+(?: the attack, and)?)?(?:, causing| ?for| ?takes*)+( \d+)?(?: additional)*(?: points of)*( [^0-9]+)? damage\.?\s*$/
        const matched = fromText.match(regExp);
        let [_0, source, hit, target, block, damage, type] = (matched??[]).map(t => t?.trim());
        block = block?.replaceAll('partially ', 'p-').replace('parries', 'parry').replace('blocks', 'block').replace('and', '&');
        const infos = { source, hit, target, block, damage, type };
        Object.keys(infos).forEach(k => { if (infos[k] === undefined) delete infos[k]; });
        return matched ? infos : undefined;
      }

      for (const type of initTypes()) {
        if (match = type.match()) return type.recorder() || true;
      }

      function onhandle(type, sub, point) { try {
        stats[type][sub] = (stats[type][sub]??0) + point * 1;
      } catch (err) {
        console.error(type, sub, err);
        throw err;
      } }

      function handleDamage(type, damage) { if (filter.damage) onhandle('damage', type.toLowerCase(), damage); }
      function handleRestore(magic, point) { if (filter.restore) onhandle('restore', magic, point); }

      function handleHurt(type, damage) {
        type = type.toLowerCase();
        onhandle('hurt', type, damage);
        type = type.match(/pierc|crush|slash/) ? 'p' : 'm';
        // if (type === 'm' && !['void', 'elec', 'dark', 'holy', 'wind', 'cold', 'fire'].includes(magic)) console.warn('Not-basic element magic hurts:', text);
        hurtSum();
        hurtSum(type);

        function hurtSum(t) {
          t ??= '';
          if (filter[`hurt${t}count`] || filter[`hurt${t}avg`]) stats.hurt[`_${t}count`]++;
          if (filter[`hurt${t}total`] || filter[`hurt${t}avg`]) stats.hurt[`_${t}total`] += damage * 1;
          if (filter[`hurt${t}avg`]) stats.hurt[`_${t}avg`] = Math.round(stats.hurt[`_${t}total`] / stats.hurt[`_${t}count`]);
        }
      }

      function initTypes() {
        return [
          {
            match: () => (text.match('damage') && !text.match('absorbs')) ? matchDamage(text) : undefined,
            recorder: () => {
              let { source, hit, target, block, damage, type } = match;
              type ??= source;
              if (!target?.match(`[yY]ou`)) return handleDamage(type, damage);
              if (filter.evade && text.match(/You ((partially )*(evade|parry|block)( and )*)+ the attack/)) stats.self.evade++;
              if (!filter.hurt) return;
              handleHurt(type, damage);
            }
          },
          {
            match: () => text.match(/^Your (spirit shield) absorbs (\d+) points of damage from the attack into (\d+) points of (spirit) damage/),
            recorder: () => {
              if (!filter.hurt) return;
              let nextmatched;
              for (const next of handled) {
                if (!(nextmatched = matchDamage(next))) continue;
                const { source, hit, target, block, damage, type } = nextmatched;
                handleHurt(type ?? source, match[2]);
                handleHurt(match[4], match[3]);
                return;
              }
              logWarn('unkown spirit shield origin damage type:', text, prev, handled, mode);
            }
          },
          {
            match: () => text.match(/^MONSTER_\d is eviscerated for (\d+) Slashing damage, putting it out of its misery/),
            recorder: () => handleDamage('Bleeding Wound', match[1])
          },
          {
            match: () => text.match(/^MONSTER_\d is eviscerated for (\d+) Void damage, putting it out of its misery/),
            recorder: () => handleDamage('211', match[1])
          },
          {
            match: () => text.match(/^(Refreshment|Replenishment|Regeneration|Regen) restores (\d+) points of (health|magic|spirit)\.$/)
            || text.match(/^You are (healed) for (\d+) (Health) Points\.$/),
            recorder: () => {
              const ids = {
                Cure: 311,
                ['Full-Cure']: 313,
                Regen: 312,
                Regeneration: 11191,
                Replenishment: 11291,
                Refreshment: 11391,
              }
              handleRestore(ids[match[1]] ?? ids[prev?.match(/^You cast (.+)\./)?.[1]], match[2]);
            }
          },
          {
            match: () => text.match(/^You drain (\d+) points of (health|magic|spirit) from MONSTER_\d\.$/),
            recorder: () => {
              let [type, damage] = [`drain_${match[2]}`, match[1]];
              handleRestore(type, damage);
              if (match[2] === 'health') handleDamage('211', damage);
            }
          },
          {
            match: () => text.match(/^You gain ([\d.]+) points of (.*?) proficiency.$/),
            recorder: () => {
              if (!filter.proficiency) return;
              let [elem, point] = [match[2],match[1]];
              stats.proficiency[elem] = ((stats.proficiency[elem] ?? 0) * 1 + point * 1).toFixed(3);
            }
          },
          {
            match: () => text.match(/^MONSTER_\d casts .*, but it is absorbed. You gain (\d+) points of (mana)\.$/),
            recorder: () => handleRestore(`absorbed_to_${match[2]}`, match[1])
          },
          {
            match: () => text.match(/^Recovered (\d+) points of (health|magic|spirit)\.$/),
            recorder: () => handleRestore(mode ?? `Recovered_${match[2]}`, match[1])
          },
          {
            match: () => text.match(/^You (?:(?: |parry|and|block|resist|evade|partially)+)+ the attack( from MONSTER_\d)?\.$/),
            recorder: () => filter.evade && stats.self.evade++
          },
          {
            match: () => text.match(/^MONSTER_\d (partially )*(?:resists|shrugs off) the effects of your spell\.$/)
            || text.match(/^MONSTER_\d (?:(?: |deftly|parries|and|blocks|block|evades|evade|dodges|partially)+)+ your (offhand attack|attack|spell)\.$/),
            recorder: () => filter.miss && stats.self.miss++
          },
          {
            match: () =>
            0
            || text.match(/^The effect .* (on MONSTER_\d)? has worn off\.$/)
            || text.match(/^The effect .* was dispelled\.$/)
            || text.match(/^MONSTER_\d gains the effect .*\.$/)
            || text.match(/^MONSTER_\d has been roused from its sleep\.$/)
            || text.match(/^MONSTER_\d got knocked out of confuse\.$/)
            || text.match(/^MONSTER_\d (( |parries|blocks|evades|block|evade)+)+ the attack from MONSTER_\d\.$/)
            || text.match(/^MONSTER_\d (vigorously whiffs at|(uses|casts) .* in the general direction of)? a shadow, missing you completely\.$/)
            || text.match(/^MONSTER_\d gets hit, but the spell is absorbed\.$/)
            || text.match(/^MONSTER_\d casts Healing Roots, healing MONSTER_\d for \d+ points of health\.$/)
            || text.match(/^MONSTER_\d (uses|casts)+ .*, but misses the attack\.$/)
            || text.match(/^Scanning MONSTER_\d\.\.\./)
            || text.match(/^You do not have a .+ gem\.$/)
            || text.match(/^You gain the effect .*\.$/)
            || text.match(/^Used: .*$/)
            || text.match(/^You use ((Health|Mana|Spirit) (Elixir|Potion|Draught|Gem)|Last Elixir|Mystic Gem|Scroll of (Life|the Avatar|the Gods|Swiftness|Protection|Absorption|Shadows)|Infusion of (Flames|Frost|Lightning|Storms|Divinity|Darkness)|Flower Vase|Bubble-Gum|Energy Drink|Caffeinated Candy|Vital Strike|Shield Bash|Merciful Blow|Skyward Sword|Frenzied Blows|Concussive Strike|Iris Strike|Backstab|Shatter Strike|Rending Blow|Great Cleave|FUS RO DAH|Orbital Friendship Cannon)\.$/)
            || text.match(/^You cast (Regen|Heartseeker|Fiery Blast|Inferno|Flames of Loki|Freeze|Blizzard|Fimbulvetr|Shockblast|Chained Lightning|Wrath of Thor|Gale|Downburst|Storms of Njord|Smite|Banishment|Paradise Lost|Corruption|Disintegrate|Ragnarok|Drain|Slow|Weaken|Silence|Sleep|Confuse|Imperil|Blind|MagNet|Immobilize|Cure|Regen|Full-Cure|Haste|Protection|Shadow Veil|Absorb|Spark of Life|Arcane Focus|Heartseeker|Spirit Shield)\.$/)
            || text.match(/^Cooldown expired for .*$/)
            || text.match(/^Spirit Stance (Disabled|Engaged|Exhausted)$/)
            || text.match(/^Spark of Life saves you from the brink of defeat!$/)
            || text.match(/^Insufficient overcharge (to use .*|or spirit for Spirit Stance\.$)/)
            || text.match(/^Slot is currently not usable\.$/)
            || text.match(/^Cooldown is still pending for .*\.$/)
            || text.match(/^The potential of your equipment has grown!$/)
            || text.match(/^Stop (beating dead ponies|kicking the dead horse)\.$/)
            || text.match(/fails due to insufficient Spirit!$/)
            || text.match(/^With the light of a new dawn, your experience in all things increases\.$/)
            || text.match(/^You have been defeated\.$/)
            || text.match(/^You have escaped from the battle\.$/)
            || text.match(/^You are Victorious!$/)
            || text.match(/^You gain \d+ (Credits|EXP)!$/)
            || text.match(/^You (have reached Level|have obtained the title|do not have enough MP)/)
            || text.match(/^MONSTER_\d has been defeated\.$/)
            || text.match(/^MONSTER_\d dropped \[.*\]$/)
            || text.match(/^MONSTER_\d drops a (Health|Mana|Spirit|Mystic) Gem powerup!$/)
            || text.match(/^You obtained \d+x \[.*\]$/)
            || text.match(/^Arena Extra Bonus! You obtained \dx \[.*\]$/)
            || text.match(/^Arena Token Bonus! \[.*\]$/)
            || text.match(/^Battle Clear Bonus! \[.*\]$/)
            || 0,
            recorder: () => { }
          },
        ];
      }
    }
  }

  function recordUsage2(different, stats) {
    const option = g.option;
    const filter = option.record;
    if (!filter) return;
    stats ??= getWithStringfied('stats', true);
    if (!different) {
      if (filter.monster) stats.data.self._monster += realtime.monsterAll;
      if (filter.boss) stats.data.self._boss += realtime.bossAll;
    }
    const battle = g.battle;
    if (option.recordEach && (different || battle.roundNow === battle.roundAll)) {
      const old = getWithStringfied('statsOld', true, []);
      stats.data.__name = getValue('battleCode', true)?.name ?? stats.data.__name;
      stats.data.self._endTime = time(3);
      old.data.push(stats.data);
      setIfChanged('statsOld', old);
      delValue('stats');
      return;
    }
    setIfChanged('stats', stats);
    if (getComputedStyle(gE('#hvAATab-Usage')).display === 'block') {
      gE(`.hvAATabmenu>span[name="Usage"]`).click();
    }
  }
  }

  // utils
  function initAjax(_server, popup, $debug) {
    const $ajax = {
      debug: false,
      interval: 300, // DO NOT DECREASE THIS NUMBER, OR IT MAY TRIGGER THE SERVER'S LIMITER AND YOU WILL GET BANNED
      max: 4,
      tid: null,
      error: null,
      conn: 0,
      queue: [],
      popup,
      $debug,

      insert: function (url, data, method, context = {}, headers = {}, isForBattle) {
        return $ajax.fetch(url, data, method, context, headers, true, isForBattle);
      },
      fetch: function (url, data, method, context = {}, headers = {}, isInsert = false, isForBattle) {
        return new Promise((resolve, reject) => {
          $ajax.add(method, url, data, resolve, reject, context, headers, isInsert, isForBattle);
        });
      },
      open: function (url, data, method, context = {}, headers = {}, isForBattle) {
        $ajax.fetch(url, data, method, context, headers, false, isForBattle).then(goto).catch( err => { console.error(err); });
      },
      openNoFetch: function (url, newTab) {
        const newWindow = window.open(url, newTab ? '_blank' : '_self');
        if (!newTab && (!newWindow || newWindow.closed)) {
          goto(url);
        }
      },
      repeat: function (count, func, ...args) {
        const list = [];
        range(count).forEach(_ => list.push(func(...args)));
        return list;
      },
      add: function (method, url, data, onload, onerror, context = {}, headers = {}, isInsert = false, isForBattle) {
        method = !data ? 'GET' : method ?? 'POST';
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
        if (isInsert) {
          $ajax.queue.unshift({ method, url, data, headers, context, onload: $ajax.onload, onerror: $ajax.onerror, isForBattle });
        } else {
          $ajax.queue.push({ method, url, data, headers, context, onload: $ajax.onload, onerror: $ajax.onerror, isForBattle });
        }
        $ajax.next();
      },
      next: async function () {
        let last, now = new Date().getTime();
        await until(() => {
          if (!$ajax.queue.length || $ajax.conn >= $ajax.max) return true;
          now = new Date().getTime();
          last = $ajax.getLast();
          if (!last) return true;
          return now - last >= $ajax.interval;
        }, 0, $ajax.queue[0]?.isForBattle);

        if (!$ajax.queue.length || $ajax.conn >= $ajax.max) return;
        $ajax.setLast(now);
        $ajax.send();
      },
      getLast: function () {
        const v = window.localStorage.getItem(_server.utils + '_last_post');
        return !v ? undefined : JSON.parse(v);
      },
      setLast: function (last) {
        window.localStorage.setItem(_server.utils + '_last_post', JSON.stringify(last));
      },
      simplify: function (r) {
        const info = {};
        info.url = r.url;
        if (r.data) info.data = r.data;
        if (r.method) info.method = r.method;
        if (r.context && JSON.stringify(r.context) !== JSON.stringify({})) info.context = r.context;
        if (r.headers && JSON.stringify(r.headers) !== JSON.stringify({})) info.headers = r.headers;
        return info;
      },
      send: function () {
        const current = $ajax.queue.shift();
        delete current.isForBattle;
        GM_xmlhttpRequest(current);
        $ajax.conn++;
        if (!$ajax.debug) return;
        const remain = $ajax.queue.map($ajax.simplify);
        $ajax.$debug?.log('$ajax.send:', $ajax.simplify(current), ... remain?.length ? ['remain:', remain] : []);
      },
      onload: function (r) {
        $ajax.conn--;
        const text = r.responseText;
        if (r.status !== 200) {
          $ajax.error = `${r.status} ${r.statusText}: ${r.finalUrl}`;
          r.context.onerror?.(new Error($ajax.error));
        } else if (text === 'state lock limiter in effect') {
          if ($ajax.error !== text) {
            $ajax.popup ? $ajax.popup(`<p style="color: #f00; font-weight: bold;">${text}</p><p>Your connection speed is so fast that <br>you have reached the maximum connection limit.</p><p>Try again later.</p>`) : undefined;
            console.error(`${text}\nYour connection speed is so fast that you have reached the maximum connection limit. Try again later.`);
          }
          $ajax.error = text;
          r.context.onerror?.(new Error($ajax.error));
        } else {
          r.context.onload?.(text);
          $ajax.next();
        }
      },
      onerror: function (r) {
        $ajax.conn--;
        $ajax.error = `${r.status} ${r.statusText}: ${r.finalUrl}`;
        r.context.onerror?.(new Error($ajax.error));
        $ajax.next();
      },
    };
    window.addEventListener('unhandledrejection', (e) => { console.error($ajax.error, e); });
    return $ajax;
  }

  function goto(url) { // 前进
    window.location.href = url ?? (window.location.search ? window.location.pathname + window.location.search : window.location.href);
    setTimeout(goto, 5 * _1s);
    setTimeout(() => { window.location.href = window.location.href }, 10 * _1s);
    return true;
  }

  function Version(...verArgs) {
    if (!(this instanceof Version)) {
      return new Version(...verArgs);
    }
    this.ver = verArgs.join('.');

    Version.prototype.upto ??= function(...args) {
      return this.compareWith(...args) >= 0;
    }
    Version.prototype.eq ??= function(...args) {
      return this.compareWith(...args) === 0;
    };
    Version.prototype.compareWith ??= function(...args) {
      return Version.compare(this, Version.asString(...args));
    }
    Version.asString ??= function(...args) {
      return args[0] instanceof Version ? args[0].ver : args.join('.');
    }
    Version.compare ??= function(...args) {
      const seg = args.slice(0, 2).map(arg => {
        if (typeof arg === 'number') arg = String(arg);
        if (arg instanceof Version) arg = arg.ver;
        return arg.split('.');
      });
      const maxLen = Math.max(...seg.map(s => s.length));

      for (const i of range(maxLen)) {
        const si = seg.map(s => s[i]);

        const isEmpty = si.map(s => [undefined, ''].includes(s));

        if (!isEmpty.some(x => !x)) continue;
        if (isEmpty[0]) return -1;
        if (isEmpty[1]) return 1;

        const isNum = si.map(s => /^\d+$/.test(s));
        if (isNum.some(x => !x)) {
          if (!isNum[0] && isNum[1]) return -1;
          if (isNum[0] && !isNum[1]) return 1;

          if (si[0] < si[1]) return -1;
          if (si[0] > si[1]) return 1;
          continue;
        }
        const trim = si.map(s => s.replace(/^0+/, '') || '0');
        const length = trim.map(t => t.length);
        if (length[0] !== length[1]) return length[0] > length[1] ? 1 : -1;
        for (const j of range(length[0])) {
          if (trim[0][j] !== trim[1][j]) return trim[0][j] > trim[1][j] ? 1 : -1;
        }
      }
      return 0;
    }
  }

  function repeat(value, amount) {
    return range(amount).map(_ => value);
  }

  function range(start, stop, step = 1) {
    start = start?.length ?? start;
    stop = stop?.length ?? stop;
    if (stop === undefined) [start, stop] = [0, start];
    const result = [];
    switch (true) {
      case step === 0:
      case step > 0:
        while (start < stop) {
          result.push(start);
          start += step;
        }
        break;
      case step < 0:
        while (start > stop) {
          result.push(start);
          start += step;
        }
        break;
      default: throw new Error('range() arg 3 must not be zero');
    }
    return result;
  }

  function copy(d) { return d ? JSON.parse(JSON.stringify(d)) : undefined; }

  function timeStr(time, size = 2, quick) {
    let formated = formatTime(time, size, quick);
    if (size) formated = formated.slice(0, size);
    return formated.map(t => pad(t)).join(`:`);
  }

  function formatTime(t, size = 2, quick) {
    t = [t / _1h, (t / _1m) % 60, (t / _1s) % 60, (t % _1s) / 10].map(cdi => Math.floor(cdi));
    while (t.length > Math.max(size, quick ? 2 : 3)) { // remove zero front
      const front = t.shift();
      if (!front) continue;
      t.unshift(front);
      break;
    }
    return t;
  }

  function pad(num, pad = '0', total = 2) {
    return num.toString().padStart(total, pad);
  }

  // async time utils
  function sleep(ms, isForBattle) {
    if (!ms || ms <= 0) return;
    if (!isForBattle || ms >= _1s) return new Promise(resolve => setTimeout(resolve, ms));
    ms = Math.max(ms, 50);
    sleep.prototype.timerWorker ??= creatWorker();
    return sleep.prototype.timerWorker(ms);

    // 在blob worker内部进行setTimeout以避免浏览器限制
    function creatWorker() {
      const code = `
      let timerMap = {};
      self.onmessage = (e) => {
        const { id, ms } = e.data;
        timerMap[id] = setTimeout(() => {
          self.postMessage({ id });
          delete timerMap[id];
        }, ms);
      };
      `

      const blob = new Blob([code], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);

      const callbacks = new Map();
      let idCounter = 0;

      worker.onmessage = (e) => {
        const { id } = e.data;
        const resolve = callbacks.get(id);
        if (!resolve) return;
        resolve();
        callbacks.delete(id);
      };

      return (ms) => {
        return new Promise((resolve) => {
          const id = idCounter++;
          callbacks.set(id, resolve);
          worker.postMessage({ id, ms });
        });
      };
    }
  }

  async function until(condition, delay, isForBattle){ try {
    let result;
    delay = delay !== 0 ? Math.max(50, delay??50) : 0;
    while (!(result = await condition())) await sleep(delay, isForBattle);
    return result;
  } catch (err) { console.error(err); }}

} catch (err) {
  console.error(err);
  document.title = err;
  const errorDisplay = document.getElementById('hvAADebugConsoleDisplay');
  if (errorDisplay) errorDisplay.innerHTML = err;
}})();
