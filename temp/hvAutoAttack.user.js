// ==UserScript==
// @name         hvAutoAttack
// @name:zh-TW   【HV】打怪
// @name:zh-CN   【HV】打怪
// @author       Dodying
// @namespace    https://github.com/dodying/UserJs
// @supportURL   https://github.com/dodying/UserJs/issues
// @updateURL    https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js
// @installURL   https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js
// @downloadURL  https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js
// @resource default.mp3 https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/default.mp3
// resource default.wav https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/default.wav
// @resource Failed.mp3 https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/Failed.mp3
// resource Failed.wav https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/Failed.wav
// @resource Riddle.mp3 https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/Riddle.mp3
// resource Riddle.wav https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/Riddle.wav
// @resource Win.mp3 https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/Win.mp3
// resource Win.wav https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/Win.wav
// @icon         https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @description  HV auto attack script, for the first user, should configure before use it.
// @description:zh-CN HV自动打怪脚本，初次使用，请先设置好选项，请确认字体设置正常
// @description:zh-TW HV自動打怪腳本，初次使用，請先設置好選項，請確認字體設置正常
// @include      http://*hentaiverse.org/*
// @exclude      http://*hentaiverse.org/pages/showequip.php?*
// @version      2.58a
// @compatible   Firefox with Greasemonkey
// @compatible   Chrome with Tampermonkey
// @compatible   Android with Firefox and usi
// @incompatible other not tested
// @grant        unsafeWindow
// @grant        GM_getResourceURL
// @run-at       document-end
// ==/UserScript==
(function init() {
  if (gE('img[src="http://ehgt.org/g/derpy.gif"]')) {
    setTimeout(function () {
      reload();
    }, 5 * 60 * 1000);
    return;
  }
  if (getValue('hvAAOption')) {
    g('option', getValue('hvAAOption', true));
    langPack(g('option').lang || '0');
    if (GM_info && g('option').version !== GM_info.script.version.substring(0, 4)) {
      alert(g('lang').all[11] + g('lang').new .join('\n'));
      gE('#hvAABox').style.display = 'block';
      gE('.hvAAOptionRestore').focus();
      return;
    }
  } else {
    langPack(prompt('请输入以下语言代码对应的数字\nPlease put in the number matched the language code\n0.简体中文\n1.繁體中文\n2.English'));
    alert(g('lang').all[0]);
    gE('#hvAABox').style.display = 'block';
    return;
  }
  if (gE('.f2rb') && confirm(g('lang').all[12])) {
    window.open('https://greasyfork.org/zh-CN/forum/discussion/comment/27107/#Comment_27107');
    return;
  }
  if (gE('#riddlecounter')) { //需要答题
    riddleAlert(); //答题警报
  } else if (gE('#togpane_log')) { //战斗中
    g('attackStatus', g('option').attackStatus);
    if (g('option').reloader) reloader();
    g('runtime', 0);
    pauseButton();
    main();
  } else { //非战斗
    delValue(2);
    quickSite();
    if (/^\?s=Battle&ss=ar/.test(location.search) && g('option').autoArena && (!g('option').stamina || parseInt(gE('.fd4>div').innerHTML.match(/\d+/) [0]) > parseInt(g('option').staminaValue))) {
      setTimeout(function () {
        autoArena();
      }, g('option').autoArenaTime * 1000);
    }
  }
}) ();
function main() { //主程序
  if (getValue('hvAADisabled')) { //如果禁用
    document.title = g('lang').all[13];
    gE('.clb>button').innerHTML = g('lang').all[14];
    return;
  }
  g('end', false);
  if (g('option').stamina && parseInt(gE('.fd4>div').innerHTML.match(/\d+/) [0]) < parseInt(g('option').staminaValue)) {
    gE('1001', 'id').click;
    return;
  }
  g('runtime', g('runtime') + 1);
  g('monsterAll', gE('div.btm1', 'all').length);
  var monsterDead = gE('img[src*="nbardead"]', 'all').length;
  g('monsterAlive', g('monsterAll') - monsterDead);
  g('bossAll', gE('div.btm2[style^="background:"]', 'all').length);
  var bossDead = gE('div.btm1[style*="opacity:"] div.btm2[style*="background:"]', 'all').length;
  g('bossAlive', g('bossAll') - bossDead);
  countRound(); //回合计数及自动前进并获取怪物总HP
  if (g('end')) return;
  if (getValue('monsterStatus')) {
    g('monsterStatus', getValue('monsterStatus', true));
  } else {
    alert(g('lang').all[15]);
    gE('#hvAABox').style.display = 'block';
    gE('#hvAATab-Othcer').style.zIndex = 1;
    gE('#hvAAFix').focus();
  }
  var bar = gE('.cwb2', 'all');
  g('hp', bar[0].offsetWidth / 120 * 100);
  g('mp', bar[1].offsetWidth / 120 * 100);
  g('sp', bar[2].offsetWidth / 120 * 100);
  g('oc', parseInt(gE('.cwbt2').innerText));
  battleInfo(); //战斗战况
  countMonsterHP(); //统计怪物血量
  if (g('option').delayAlert) {
    g('delayAlert', setTimeout(function () {
      otherAlert('default', 3);
    }, g('option').delayAlertTime * 1000));
  }
  if (g('option').delayReload) {
    g('delayReload', setTimeout(function () {
      reload();
    }, g('option').delayReloadTime * 1000));
  }
  if (gE('#ikey_p')) autoUseGem(); //自动使用宝石
  if (g('end')) return;
  deadSoon(); //自动回血回魔
  if (g('end')) return;
  if (g('option').scroll && g('roundNow') >= g('option').scrollRoundNow && g('option') ['scrollRoundType_' + g('roundType')]) autoUseScroll(); //自动使用卷轴
  if (g('end')) return;
  if (g('option').buffSkill) autoUseBuffSkill(); //自动使用药水、施法增益技能
  if (g('end')) return;
  if (g('option').infusion && g('roundNow') >= g('option').infusionRoundNow && g('option') ['infusionRoundType_' + g('roundType')]) autoUseInfusions(); //自动使用魔药
  if (g('end')) return;
  if (g('option').debuffSkill && (g('option').debuffSkillMode === '0' || (g('bossAlive') === g('monsterAlive') && g('option').debuffSkillMode === '1'))) autoUseDeSkill(); //自动施法De技能
  if (g('end')) return;
  autoAttack(); //自动打怪
  if (g('end')) return;
}
function langPack(lang) { //语言包
  var packs = [
    { //简体中文
      all: [
        '请设置hvAutoAttack', //0
        '是否继续', //1
        '名称', //2
        '说明', //3
        '值', //4
        '修改', //5
        '删除', //6
        '未知', //7
        '请输入新值', //8
        '注意，修复只是临时作用使脚本能够运行！\n如果脚本能够继续运行请按取消！\n是否继续？', //9
        '请选择攻击模式', //10
        'hvAutoAttack版本更新，请重新设置\n强烈推荐【重置设置】后再设置。\n\n以下为更新内容\n', //11
        '请设置字体\n使用默认字体可能使某些功能失效\n如无法正确获取到oc值，导致相关的Spirit Stance无法正常开启\n是否查看相关说明？', //12
        'hvAutoAttack暂停中', //13
        '继续', //14
        '请点击尝试修复', //15
        '暂停', //16
        '请输入链接，必填', //17
        '请输入名称，可留空', //18
        '请输入图标，可留空', //19
        '回复完成', //20
        '竞技场开始' //21
      ],
      option: {
        '000': 'hvAutoAttack设置',
        '001': '语言',
        '002': '主要选项',
        '003': '对自身技能',
        '004': 'De技能',
        '005': '特殊技能',
        '006': '卷轴',
        '007': '魔药',
        '008': '权重规则',
        '009': '本地储存',
        '010': '其他',
        '011': '重置设置',
        '012': '应用',
        '013': '取消',
        '101': '0.使用Draught药水\n1.使用宝石回复\n2.使用（技能、）Potion药水回复\n3.使用Elixir药水回复',
        '102': '当技能与药水CD时，使用Last Elixir。',
        '103': '攻击模式：',
        '104': '技能施放条件：',
        '105': '中级：怪物存活数',
        '106': '；高级：怪物存活数',
        '107': '当Overcharge',
        '108': '，开启Spirit Stance。',
        '109': '防止脚本莫名暂停',
        '110': '页面停留',
        '111': '秒后，警报；',
        '112': '秒后，刷新页面。',
        '113': '当【小马】答题时间',
        '114': '秒，如果输入框为空则随机生成答案并提交，否则直接提交。',
        '115': '当【Stamina】＜',
        '116': '时，自动逃跑。',
        '117': '在竞技场页面停留',
        '118': '秒后，自动开始竞技场。',
        '119': '开启内置',
        '120': '减少页面刷新，降低内存使用，感谢网友【zsp40088】提出',
        '121': '答题单选',
        '201': '对自身技能',
        '202': '施放条件（有一个成立就行）：',
        '203': '1. 总回合数',
        '204': '2. Boss存活数',
        '205': '3. 遭遇战中，怪物存活数',
        '206': '增益技能',
        '207': '（Buff不存在就施放的技能，按【施放顺序】排序）：',
        '208': '获得Channel时',
        '209': '，即施法只需1点MP，',
        '210': '先ReBuff',
        '211': '：buff存在≤',
        '212': '回合时，重新使用该技能。',
        '213': '再施放Channel技能',
        '214': '（按【施放顺序】排序）：',
        '301': 'De技能',
        '302': '（按【施放顺序】排序）',
        '303': '请选择模式：',
        '304': '0. 对所有怪施放',
        '305': '1. 只对Boss施放',
        '401': '特殊技能（按【施放顺序】排序）',
        '402': '友情小马炮：',
        '403': '龙吼：',
        '404': '1. 怪兽存活数',
        '405': '2. Boss存活数',
        '406': ' 当oc',
        '501': '使用卷轴',
        '502': '总体条件：当前回合数',
        '503': '存在技能生成的Buff时，仍然使用卷轴。',
        '504': '当前回合数',
        '601': '使用魔药：',
        '602': '使用条件：当前回合数',
        '701': '权重规则',
        '702': '示例',
        '703': '1. 每回合计算怪物当前血量，血量最低的设置初始血量为10，其他怪物为当前血量倍数*10',
        '704': '2. 初始权重与下述各Buff权重相加',
        '705': '3. 计算出最终权重，攻击权重最小的怪物',
        '706': '4. 如果你对各Buff权重有特别见解，请务必',
        '707': '告诉我',
        '901': '反馈：',
        '902': '当前状况：',
        '903': '如果脚本长期暂停且网络无问题，请点击【临时修复】',
        '904': '当前回合：',
        '905': '总回合：',
        '906': '各怪物及状况：',
        '907': '尝试修复'
      },
      status: [
        '物理',
        '火',
        '冰',
        '雷',
        '风',
        '圣',
        '暗'
      ],
      roundType: {
        '0': '战役模式：',
        'ar': '竞技场',
        'rb': '浴血擂台',
        'gr': '压榨界',
        'iw': '物品界',
        'ba': '遭遇战'
      },
      storage: [
        '对象<br>各种设置',
        '日期字符串<br>上次自动竞技场的日期',
        '数组<br>今天未进行的竞技场',
        '布尔<br>今天的竞技场是否完成',
        '布尔<br>脚本是否暂停',
        '对象数组<br>怪兽情况',
        '数值，总回合',
        '数值，当前回合',
        '字符串，战斗类型',
        '对象数组<br>快捷地址栏',
      ],
      info: [
        '运行次数：',
        '回合：',
        '攻击模式：',
        '存活Boss：',
        '怪物：'
      ],
      new : [
        '1. 版本2.57a中，移除了临时攻击模式',
        '2. 为两个特殊技能增加oc阈值'
      ],
    },
    { //繁體中文
      all: [
        '請設置hvAutoAttack',
        '是否繼續',
        '名稱',
        '說明',
        '值',
        '修改',
        '刪除',
        '未知',
        '請輸入新值',
        '注意，修復只是臨時作用使腳本能夠運行！\n如果腳本能夠繼續運行請按取消！ \n是否繼續？',
        '請選擇攻擊模式',
        'hvAutoAttack版本更新，請重新設置\n強烈推薦【重置設置】後再設置。\n\n以下為更新內容\n',
        '請設置字體\n使用默認字體可能使某些功能失效\n如無法正確獲取到oc值，導致相關的Spirit Stance無法正常開啟\n是否查看相關說明？',
        'hvAutoAttack暫停中',
        '繼續',
        '請點擊嘗試修復',
        '暫停',
        '請輸入鏈接，必填',
        '請輸入名稱，可留空',
        '請輸入圖標，可留空',
        '回复完成',
        '競技場開始'
      ],
      option: {
        '000': 'hvAutoAttack設置',
        '001': '語言',
        '002': '主要選項',
        '003': '對自身技能',
        '004': 'De技能',
        '005': '特殊技能',
        '006': '卷軸',
        '007': '魔藥',
        '008': '權重規則',
        '009': '本地儲存',
        '010': '其他',
        '011': '重置設置',
        '012': '應用',
        '013': '取消',
        '101': '0.使用Draught藥水\n1.使用寶石回复\n2.使用(技能、)Potion藥水恢復\n3.使用Elixir藥水回复',
        '102': '當技能與藥水CD時，使用Last Elixir。',
        '103': '攻擊模式：',
        '104': '技能釋放條件：',
        '105': '中級：怪物存活數',
        '106': '；高級：怪物存活數',
        '107': '當Overcharge',
        '108': '，開啟Spirit Stance。',
        '109': '防止腳本莫名暫停',
        '110': '頁面停留',
        '111': '秒後，警報；',
        '112': '秒後，刷新頁面。',
        '113': '當【小馬】答題時間',
        '114': '秒，如果輸入框為空則隨機生成答案並提交，否則直接提交。',
        '115': '當【Stamina】＜',
        '116': '時，自動逃跑。',
        '117': '在競技場頁面停留',
        '118': '秒後，自動開始競技場。',
        '119': '開啟內置',
        '120': '減少頁面刷新，降低內存使用，感謝網友【zsp40088】提出',
        '121': '答題單選',
        '201': '對自身技能',
        '202': '施放條件（有一個成立就行）：',
        '203': '1. 總回合數',
        '204': '2. Boss存活數',
        '205': '3. 遭遇戰中，怪物存活數',
        '206': '增益技能',
        '207': '（Buff不存在就施放的技能，按【施放順序】排序）：',
        '208': '獲得Channel時',
        '209': '，即施法只需1點MP，',
        '210': '先ReBuff',
        '211': '：buff存在≤',
        '212': '回合時，重新使用該技能。',
        '213': '再施放Channel技能',
        '214': '（按【施放順序】排序）：',
        '301': 'De技能',
        '302': '（按【施放順序】排序）',
        '303': '請選擇模式：',
        '304': '0. 對所有怪施放',
        '305': '1. 只對Boss施放',
        '401': '特殊技能（按【施放順序】排序）',
        '402': '友情小馬砲：',
        '403': '龍吼：',
        '404': '1. 怪獸存活數',
        '405': '2. Boss存活數',
        '406': ' 當oc',
        '501': '使用捲軸',
        '502': '總體條件：當前回合數',
        '503': '存在技能生成的Buff時，仍然使用捲軸。',
        '504': '當前回合數',
        '601': '使用魔藥：',
        '602': '使用條件：當前回合數',
        '701': '權重規則',
        '702': '示例',
        '703': '1. 每回合計算怪物當前血量，血量最低的設置初始血量為10，其他怪物為當前血量倍數*10',
        '704': '2. 初始權重與下述各Buff權重相加',
        '705': '3. 計算出最終權重，攻擊權重最小的怪物',
        '706': 'ps. 如果你對各Buff權重有特別見解，請務必',
        '707': '告訴我',
        '901': '反饋：',
        '902': '當前狀況：',
        '903': '如果腳本長期暫停且網絡無問題，請點擊【臨時修復】',
        '904': '當前回合：',
        '905': '總回合：',
        '906': '各怪物及狀況：',
        '907': '尝试修復'
      },
      status: [
        '物理',
        '火',
        '冰',
        '雷',
        '風',
        '聖',
        '暗'
      ],
      roundType: {
        '0': '戰役模式：',
        'ar': '競技場',
        'rb': '浴血擂台',
        'gr': '壓榨界',
        'iw': '物品界',
        'ba': '遭遇戰'
      },
      storage: [
        '對象<br>各種設置',
        '日期字符串<br>上次自動競技場的日期',
        '數組<br>今天未進行的競技場',
        '布爾<br>今天的競技場是否完成',
        '布爾<br>腳本是否暫停',
        '對像數組<br>怪獸情況',
        '數值，總回合',
        '數值，當前回合',
        '字符串，戰鬥類型',
        '对象数组<br>快捷地址栏',
      ],
      info: [
        '運行次數：',
        '回合：',
        '攻擊模式：',
        '存活Boss：',
        '怪物：'
      ],
      new : [
        '1. 版本2.57a中，移除了臨時攻擊模式',
        '2. 為兩個特殊技能增加oc閾值'
      ],
    },
    { //English
      all: [
        'Configure this script plz',
        'Whether to continue',
        'Name',
        'Description',
        'Value',
        'Change',
        'Delete',
        'Unknown',
        'Please put in a new value',
        'Note that the repair is only temporary role to enable the script to run!\nIf the script can continue to run please press Cancel!\nWhether to continue?',
        'Select the attack mode',
        'hvAutoAttack version update, please reset\nrecommend click the button [Reset].\n\nWhat\'s update\n',
        'Please set the font\nUsing the default font may invalidate some features\nIf you can not get the correct oc value, resulting in the Spirit Stance can not be properly opened\nDo you want to see instructions?',
        'hvAutoAttack Paused',
        'Continue',
        'Click [Try Fix]',
        'Paused',
        'Please enter a link, required',
        'Please enter a name, which can be left blank',
        'Please enter an icon that can be left blank',
        'Recovery',
        'arena start'
      ],
      option: {
        '000': 'Option for hvAutoAttack',
        '001': 'Language',
        '002': 'Main',
        '003': 'toSelf Skill',
        '004': 'DeSkill',
        '005': 'Special Skill',
        '006': 'Scroll',
        '007': 'Infusion',
        '008': 'Weight Rule',
        '009': 'localStorage',
        '010': 'Other',
        '011': 'Reset',
        '012': 'Apply',
        '013': 'Cancel',
        '101': '0.use draught\n1.use Gem\n2.use potion( and skill)\n3.use Elixir',
        '102': 'When skills and drug countdown, use Last Elixir.',
        '103': 'Attack Status:',
        '104': 'to Spell:',
        '105': ' middle: monster alive ',
        '106': '; high: monster alive ',
        '107': 'When Overcharge ',
        '108': ', turn on Spirit Stance.',
        '109': 'To prevent the script inexplicable suspension',
        '110': 'The page stays ',
        '111': 's, alert;',
        '112': 's, page reload.',
        '113': 'When riddle last time ',
        '114': 's, if the input box is empty, the answer is generated and submitted, or submitted.',
        '115': 'When Stamina <',
        '116': ', flee.',
        '117': 'Stay in the Arena page ',
        '118': 's, start Arena.',
        '119': 'turn on ',
        '120': 'Reduce page refresh, reduce memory usage, thanks to friends [zsp40088] proposed',
        '121': 'Answer to radio',
        '201': 'toSelf Skill',
        '202': 'toCast(one true)：',
        '203': '1. total number of turns ',
        '204': '2. Boss alive ',
        '205': '3. encounter battle, monster alive ',
        '206': 'support skill',
        '207': ' (If the buff does not exist, it\'ll the cast the skills, sort by cast order):',
        '208': 'When gain Channeling',
        '209': ', what means cast cost 1mp,',
        '210': 'ReBuff first',
        '211': ':buff expires in ',
        '212': ' turns, Re-use the skills.',
        '213': 'And then cast Following skills',
        '214': ' (Sort by cast order):',
        '301': 'DeSkill',
        '302': ' (Sort by cast order)',
        '303': 'please select a mode: ',
        '304': '0. cast to all',
        '305': '1. only cast to Boss',
        '401': 'Special Skill (Sort by cast order):',
        '402': 'Orbital Friendship Cannon:',
        '403': 'FUS RO DAH:',
        '404': '1. monster alive ',
        '405': '2. Boss alive ',
        '406': ' when oc ',
        '501': 'Use Scroll',
        '502': 'Preconditions: The current number of turns ',
        '503': 'Although there is a skill-generated Buff, use Scroll.',
        '504': 'The current number of turns ',
        '601': 'Use Infusion:',
        '602': 'Conditions: The current number of turns ',
        '701': 'Weight Rule',
        '702': 'Example',
        '703': '1. Each round to calculate the current monster blood, set the minimum blood volume of the initial 10, other monsters for the current blood multiple * 10',
        '704': '2. The initial weights are added to the following Buff weights',
        '705': '3. Calculate the final weight, attack the smallest weight of the monster',
        '706': 'ps. If you have a special opinion on the weight of the Buff, please ',
        '707': 'let me know',
        '901': 'Feedback: ',
        '902': 'Current status: ',
        '903': 'If the script is paused for a long time and there is no problem with the network, click the button [Try repairing]',
        '904': 'Current turn:',
        '905': 'Total turns:',
        '906': 'The monster and the situation:',
        '907': 'Try repairing'
      },
      status: [
        'Physical',
        'Fire',
        'Cold',
        'Elec',
        'Wind',
        'Divine',
        'Forbidden'
      ],
      roundType: {
        '0': 'round type: ',
        'ar': 'The Arena',
        'rb': 'Ring of Blood',
        'gr': 'GrindFest',
        'iw': 'Item World',
        'ba': 'Encounter'
      },
      storage: [
        'Objects<br>Various settings',
        'The date string<br>The date of the last automatic arena',
        'Array<br>The arena is not being played today',
        'Boolean<br>Today\'s arena is complete',
        'Boolean<br>Whether the script is paused',
        'An array of objects<br>Monster status',
        'Array，Total Round',
        'Array，Current turn',
        'String, round type',
        'An array of objects<br>Shortcut bar',
      ],
      info: [
        'run time:',
        'round:',
        'attack status:',
        'Boss alive:',
        'monster:'
      ],
      new : [
        '1. In version 2.57a, the Temporary Attack mode was removed',
        '2. Increase the oc threshold for two special skills'
      ],
    }
  ];
  g('lang', packs[lang]);
  optionButton();
  gE('select[name=lang]').value = lang;
}
function addStyle() {
  var globalStyle = cE('style');
  globalStyle.innerHTML = '' +
  '.hvAALog{font-size:20px;}' +
  '.csp{height:auto!important;}' +
  '.hvAAButton{top:4px;left:' + (gE('.stuffbox').offsetWidth - 24 - 50) + 'px;position:absolute;z-index:9999;cursor:pointer;background-color:#EDEBDF;}' +
  '#hvAABox{left:' + (gE('body').offsetWidth / 2 - 350) + 'px;top:50px;font-size:12pt!important;z-index:9999;width:700px;height:510px;display:none;position:absolute;text-align:justify;background-color:white;border-color:black;border-style:solid;border-radius:10px;}' +
  '#hvAABox .hvAACenter{text-align:center;}' +
  '#hvAABox .hvAASeparate{height:1px;background-color:black;}' +
  '#hvAABox .hvAATitle{font-weight:bolder;font-size:larger;}' +
  '.hvAATablist{position:relative;left:14px;}' +
  '.hvAATabmenu{position:absolute;left:-9px;}' +
  '.hvAATabmenu>span>a{display:block;padding:5px 10px;margin:0 10px 0 0;border:1px solid #91a7b4;border-radius:5px;background-color:#E3F1F8;color:black;text-decoration:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}' +
  '.hvAATabmenu>span:hover{z-index:999999!important;left:-5px;position:relative;font-size:large;}' +
  '.hvAATab{position:absolute;width:605px;height:400px;left:36px;padding:15px;border:1px solid #91A7B4;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,0.1);font-size:14pt;color:#666;background:#FFF;overflow:auto;}' +
  '.hvAATab a{margin:0 2px;}' +
  '.hvAATab:target{z-index:1!important;}' +
  '.hvAATab input[type=text]{width:24px;}' +
  '.hvAATab label{cursor:pointer;}' +
  '.hvAATab table{font-size:smaller;border:2px solid black;border-collapse:collapse;}' +
  '.hvAATab table>tbody>tr>*{border:1px solid black;}' +
  '.hvAATab table td:nth-child(1){width:100px;}' +
  '.hvAATab table td:nth-child(2){width:150px;}' +
  '.hvAATab table input{width:200px!important;}' +
  '.hvAATab table textarea{resize:vertical;width:260px;max-height:400px;overflow:hidden;}' +
  '.hvAAOptionBoxButton{position:relative;top:440px;}' +
  '.hvAAOptionBoxButton>button{margin:0 1px;}' +
  'button{border-radius:3px;border-style:solid;border-color:gray;}' +
  '.hvAANew{width:25px;height:25px;float:left;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAMCAYAAACX8hZLAAAAcElEQVQ4jbVRSQ4AIQjz/59mTiZIF3twmnCwFAq4FkeFXM+5vCzohYxjPMtfxS8CN6iqQ7TfE0wrODxVbzJNgoaTo4CmbBO1ZWICouQ0DHaL259MEzaU+w8pZOdSjcUgaPJDHCbO0A2kuAiuwPGQ+wBms12x8HExTwAAAABJRU5ErkJggg==) no-repeat;background-position:center;}' +
  '.siteBar{position:absolute;top:100px;left:' + (gE('.stuffbox').offsetWidth + 2) + 'px;font-size:12pt;text-align:left;}' +
  '.siteBar>span{display:block;}' +
  '.siteBar>span>a{text-decoration:none;}' +
  '.favicon{width:16px;height:16px;margin:-3px 1px;}' +
  '.answerBar{z-index:1000;width:710px;height:40px;position:absolute;top:50px;left:345px;display:table;border-spacing:5px;}' +
  '.answerBar>div{border:4px solid red;display:table-cell;cursor:pointer;}' +
  '.answerBar>div:hover{background:rgba(63,207,208,0.20);}';
  gE('head').appendChild(globalStyle);
}
function optionButton() { //配置
  addStyle();
  var optionButton = cE('div');
  optionButton.className = 'hvAAButton';
  optionButton.innerHTML = '<img src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADi0lEQVRIiZVWPYgUZxj+dvGEk7vsNdPYCMul2J15n+d991PIMkWmOEyMyRW2FoJIUojYp5ADFbZJkyISY3EqKGpgz+Ma4bqrUojICaIsKGIXSSJcsZuD3RT3zWZucquXDwYG5n2f9/d5vnFuHwfAZySfAXgN4DXJzTiOj+3H90OnkmXZAe/9FMm3JJ8AuBGepyRfle2yLDvgnKt8EDVJkq8B3DGzjve+1m63p0n2AVzJbUh2SG455yre+5qZ/aCq983sxMfATwHYJvlCVYckHwFYVdURgO8LAS6RHJJcM7N1VR0CeE5yAGBxT3AR+QrA3wA20tQOq+pFkgOS90Tk85J51Xs9qaorqjoAcC6KohmSGyQHcRx/kbdv7AHgDskXaWqH0zSddc5Voyia2SOXapqmswsLvpam6ez8/Pwn+YcoimYAvARw04XZ5N8qZtZR1aGqXnTOVSd0cRd42U5EzqvqSFWX2u32tPd+yjnnXNiCGslHJAf7ybwM7r2vAdgWkYdZls157w+NK/DeT7Xb7WkAqyTvlZHjOD5oxgtmtqrKLsmze1VJsquqKwsLO9vnnKvkJHpLsq+qo/JAd8BtneTvqvqTiPwoIu9EZKUUpGpmi2Y2UtU+yTdJkhx1JJ8FEl0pruK/TrwA4F2r1WrkgI1G4wjJP0XkdLF9WaZzZnZZVa8GMj5xgf43JvXczFZbLb1ebgnJn0nenjQbEVkG0JsUYOykyi6Aa+XoQTJuTRr8OADJzVBOh+SlckYkz5L8Q0TquXOj0fhURN6r6pkSeAXAUsDaJPnYxXF8jOQrklskh97ryZJTVURWAPwF4DqAX0TkvRl/zTKdK2aeJMnxICFbAHrNZtOKVVdIrrVa2t1jz6sicprkbQC3VPVMGTzMpQvgQY63i8lBFddVdVCk/6TZlMFzopFci+P44H+YHCR3CODc/wUvDPY7ksMg9buZrKr3ATwvyoT3vrafzPP3er1eA9Azs7tjJhcqOBHkeSOKohkROR9K7prZYqnnlSRJjofhb4vIt/V6vUbyN1Xtt1qtb1zpZqs45xyAxXAnvCQ5FJGHqrpiZiMzu5xnHlZxCOABybXw3gvgp/Zq3/gA+BLATVVdyrJsbods2lfVq7lN4crMtapjZndD5pPBixWFLTgU7uQ3AJ6KyLKILAdy9sp25bZMBC//JSRJcjQIYg9Aj+TjZrNp+/mb+Ad711sdZZ1k/QAAAABJRU5ErkJggg==></img>';
  optionButton.onclick = function () {
    gE('#hvAABox').style.display = (gE('#hvAABox').style.display === 'block') ? 'none' : 'block';
  }
  gE('body').appendChild(optionButton);
  var optionBox = cE('div');
  optionBox.id = 'hvAABox';
  optionBox.innerHTML = '' +
  '<div class="hvAACenter"><h1 style="display:inline;">' + g('lang').option['000'] + '</h1><div style="float:right;">' + g('lang').option['001'] + '<select name="lang"><option value="0">简体中文</option><option value="1">繁體中文</option><option value="2">English</option></select></div></div><div class="hvAATablist">' +
  '<div class="hvAATabmenu"><span><a href="#hvAATab-Main">' + g('lang').option['002'] + '</a></span><span><a href="#hvAATab-Self">' + g('lang').option['003'] + '</a></span><span><a href="#hvAATab-Debuff">' + g('lang').option['004'] + '</a></span><span><a href="#hvAATab-Special">' + g('lang').option['005'] + '</a></span><span><a href="#hvAATab-Scroll">' + g('lang').option['006'] + '</a></span><span><a href="#hvAATab-Infusion">' + g('lang').option['007'] + '</a></span><span><a href="#hvAATab-Weight">' + g('lang').option['008'] + '</a></span><span><a href="#hvAATab-Storage">' + g('lang').option['009'] + '</a></span><span><a href="#hvAATab-Other">' + g('lang').option['010'] + '</a></span></div>' +
  '<div id="hvAATab-Main"class="hvAATab"style="z-index:1;"><div class="hvAACenter"title="' + g('lang').option['101'] + '"><span style="color:green;">HP:0.<input name="hp0"placeholder="95"type="text">%&nbsp;1.<input name="hp1"placeholder="50"type="text">%&nbsp;2.<input name="hp2"placeholder="50"type="text">%&nbsp;3.<input name="hp3"placeholder="5"type="text">%&nbsp;</span><br><span style="color:blue;">MP:0.<input name="mp0"placeholder="95"type="text">%&nbsp;1.<input name="mp1"placeholder="70"type="text">%&nbsp;2.<input name="mp2"placeholder="10"type="text">%&nbsp;3.<input name="mp3"placeholder="5"type="text">%&nbsp;</span><br><span style="color:red;">SP:0.<input name="sp0"placeholder="95"type="text">%&nbsp;1.<input name="sp1"placeholder="75"type="text">%&nbsp;2.<input name="sp2"placeholder="50"type="text">%&nbsp;3.<input name="sp3"placeholder="5"type="text">%&nbsp;</span><br><input id="lastElixir"type="checkbox"><label for="lastElixir">' + g('lang').option['102'] + '</div><div id="attackStatus"class="hvAACenter"style="color:red;"><b>*' + g('lang').option['103'] + '</b><input type="radio"id="aS0"name="attackStatus"value="0"><label for="aS0">' + g('lang').status[0] + '</label><input type="radio"id="aS1"name="attackStatus"value="1"><label for="aS1">' + g('lang').status[1] + '</label><input type="radio"id="aS2"name="attackStatus"value="2"><label for="aS2">' + g('lang').status[2] + '</label><input type="radio"id="aS3"name="attackStatus"value="3"><label for="aS3">' + g('lang').status[3] + '</label><input type="radio"id="aS4"name="attackStatus"value="4"><label for="aS4">' + g('lang').status[4] + '</label><input type="radio"id="aS5"name="attackStatus"value="5"><label for="aS5">' + g('lang').status[5] + '</label><input type="radio"id="aS6"name="attackStatus"value="6"><label for="aS6">' + g('lang').status[6] + '</label></div><div><b>' + g('lang').option['104'] + '</b>' + g('lang').option['105'] + '≥<input name="middleSkill"placeholder="3"type="text">' + g('lang').option['106'] + '≥<input name="highSkill"placeholder="5"type="text"></div><div><input id="spiritStance"type="checkbox"><label for="spiritStance">' + g('lang').option['107'] + '≥<input name="spiritStance_oc"placeholder="50"type="text">' + g('lang').option['108'] + '</label></div><div title="' + g('lang').option['109'] + '"><input id="delayAlert"type="checkbox"><label for="delayAlert">' + g('lang').option['110'] + '<input name="delayAlertTime"placeholder="10"type="text">' + g('lang').option['111'] + '</label><input id="delayReload"type="checkbox"><label for="delayReload">' + g('lang').option['110'] + '<input name="delayReloadTime"placeholder="15"type="text">' + g('lang').option['112'] + '</label></div><div><input id="riddleAnswer"type="checkbox"><label for="riddleAnswer">' + g('lang').option['113'] + '≤<input name="riddleAnswerTime"placeholder="3"type="text">' + g('lang').option['114'] + '</label></div><div><input id="stamina"type="checkbox"><label for="stamina">' + g('lang').option['115'] + '<input name="staminaValue"placeholder="10"type="text">' + g('lang').option['116'] + '</label></div><div><input id="autoArena"type="checkbox"><label for="autoArena">' + g('lang').option['117'] + '<input name="autoArenaTime"placeholder="120"type="text"></input>' + g('lang').option['118'] + '</label></div><div><input id="reloader"type="checkbox"><label for="reloader">' + g('lang').option['119'] + '<b><a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=2660&p=4384894&#entry4384894"target="_blank"title="' + g('lang').option['120'] + '">Reloader</a></b></label></div><div><input id="riddleRadio"type="checkbox"><label for="riddleRadio">' + g('lang').option['119'] + '<b><a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=1020&p=3000982&#entry3000982"target="_blank"title="' + g('lang').option['121'] + '">RiddleLimiter Plus</a></b></label></div></div>' +
  '<div id="hvAATab-Self"class="hvAATab"><input type="checkbox"id="buffSkill"><label for="buffSkill"><span class="hvAATitle">' + g('lang').option['201'] + '</span></label><br>' + g('lang').option['202'] + '<br>' + g('lang').option['203'] + '≥<input name="buffSkillAllRound"placeholder="12"type="text"><br>' + g('lang').option['204'] + '≥<input name="buffSkillBoss"placeholder="1"type="text"><br>' + g('lang').option['205'] + '≥<input name="buffSkillMonster"placeholder="6"type="text"><br><b>' + g('lang').option['206'] + '</b>' + g('lang').option['207'] + '<br><input type="checkbox"id="buffSkill_HD"><label for="buffSkill_HD">Health Draught</label><input type="checkbox"id="buffSkill_MD"><label for="buffSkill_MD">Mana Draught</label><input type="checkbox"id="buffSkill_SD"><label for="buffSkill_SD">Spirit Draught</label><br><input type="checkbox"id="buffSkill_Pr"><label for="buffSkill_Pr">Protection</label><input type="checkbox"id="buffSkill_SL"><label for="buffSkill_SL">Spark of Life</label><input type="checkbox"id="buffSkill_SS"><label for="buffSkill_SS">Spirit Shield</label><input type="checkbox"id="buffSkill_Ha"><label for="buffSkill_Ha">Haste</label><br><input type="checkbox"id="buffSkill_AF"><label for="buffSkill_AF">Arcane Focus</label><input type="checkbox"id="buffSkill_He"><label for="buffSkill_He">Heartseeker</label><input type="checkbox"id="buffSkill_Re"><label for="buffSkill_Re">Regen</label><input type="checkbox"id="buffSkill_SV"><label for="buffSkill_SV">Shadow Veil</label><input type="checkbox"id="buffSkill_Ab"><label for="buffSkill_Ab">Absorb</label><div></div><b>' + g('lang').option['208'] + '</b>' + g('lang').option['209'] + '<br><b>' + g('lang').option['210'] + '</b>' + g('lang').option['211'] + '<input name="channelReBuff"placeholder="5"type="text">' + g('lang').option['212'] + '<br><b>' + g('lang').option['213'] + '</b>' + g('lang').option['214'] + '<br><input type="checkbox"id="channelSkill_Pr"><label for="channelSkill_Pr">Protection</label><input type="checkbox"id="channelSkill_SL"><label for="channelSkill_SL">Spark of Life</label><input type="checkbox"id="channelSkill_SS"><label for="channelSkill_SS">Spirit Shield</label><input type="checkbox"id="channelSkill_Ha"><label for="channelSkill_Ha">Haste</label><br><input type="checkbox"id="channelSkill_AF"><label for="channelSkill_AF">Arcane Focus</label><input type="checkbox"id="channelSkill_He"><label for="channelSkill_He">Heartseeker</label><input type="checkbox"id="channelSkill_Re"><label for="channelSkill_Re">Regen</label><input type="checkbox"id="channelSkill_SV"><label for="channelSkill_SV">Shadow Veil</label><input type="checkbox"id="channelSkill_Ab"><label for="channelSkill_Ab">Absorb</label></div>' +
  '<div id="hvAATab-Debuff"class="hvAATab"><input type="checkbox"id="debuffSkill"><label for="debuffSkill"><span class="hvAATitle">' + g('lang').option['301'] + '</span>' + g('lang').option['302'] + '</label><br>' + g('lang').option['303'] + '<select name="debuffSkillMode"><option value="0">' + g('lang').option['304'] + '</option><option value="1">' + g('lang').option['305'] + '</option></select><br><input type="checkbox"id="debuffSkill_Im"><label for="debuffSkill_Im">Imperil</label><input type="checkbox"id="debuffSkill_MN"><label for="debuffSkill_MN">MagNet</label><input type="checkbox"id="debuffSkill_Si"><label for="debuffSkill_Si">Silence</label><input type="checkbox"id="debuffSkill_Dr"><label for="debuffSkill_Dr">Drain</label><input type="checkbox"id="debuffSkill_We"><label for="debuffSkill_We">Weaken</label><input type="checkbox"id="debuffSkill_Co"><label for="debuffSkill_Co">Confuse</label></div>' +
  '<div id="hvAATab-Special"class="hvAATab"><input id="specialSkill"type="checkbox"><label for="specialSkill"><span class="hvAATitle">' + g('lang').option['401'] + '</span></label><br><input id="specialSkill_OFC"type="checkbox"><label for="specialSkill_OFC">' + g('lang').option['402'] + '</label>' + g('lang').option['406'] + '≥<input name="specialSkillOC_OFC"placeholder="210"type="text"><br>' + g('lang').option['404'] + '≥<input name="specialSkillMonster_OFC"placeholder="8"type="text"><br>' + g('lang').option['405'] + '≥<input name="specialSkillBoss_OFC"placeholder="1"type="text"><br><input id="specialSkill_FUS"type="checkbox"><label for="specialSkill_FUS">' + g('lang').option['403'] + '</label>' + g('lang').option['406'] + '≥<input name="specialSkillOC_FUS"placeholder="110"type="text"><br>' + g('lang').option['404'] + '≥<input name="specialSkillMonster_FUS"placeholder="8"type="text"><br>' + g('lang').option['405'] + '≥<input name="specialSkillBoss_FUS"placeholder="1"type="text"></div>' +
  '<div id="hvAATab-Scroll"class="hvAATab"><input type="checkbox"id="scroll"><label for="scroll"><span class="hvAATitle">' + g('lang').option['501'] + '</span></label><br>' + g('lang').roundType['0'] + '<input type="checkbox"id="scrollRoundType_ar"><label for="scrollRoundType_ar">' + g('lang').roundType['ar'] + '</label><input type="checkbox"id="scrollRoundType_rb"><label for="scrollRoundType_rb">' + g('lang').roundType['rb'] + '</label><input type="checkbox"id="scrollRoundType_gr"><label for="scrollRoundType_gr">' + g('lang').roundType['gr'] + '</label><input type="checkbox"id="scrollRoundType_iw"><label for="scrollRoundType_iw">' + g('lang').roundType['iw'] + '</label><input type="checkbox"id="scrollRoundType_ba"><label for="scrollRoundType_ba">' + g('lang').roundType['ba'] + '</label><br>' + g('lang').option['502'] + '≥<input name="scrollRoundNow"placeholder="100"type="text">。<br><input id="scrollFirst"type="checkbox"><label for="scrollFirst">' + g('lang').option['503'] + '</label><br><input type="checkbox"id="scroll_Go"><label for="scroll_Go">Scroll of the Gods&nbsp;' + g('lang').option['504'] + '≥<input name="scrollRound_Go"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Av"><label for="scroll_Av">Scroll of the Avatar&nbsp;' + g('lang').option['504'] + '≥<input name="scrollRound_Av"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Pr"><label for="scroll_Pr">Scroll of Protection&nbsp;' + g('lang').option['504'] + '≥<input name="scrollRound_Pr"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Sw"><label for="scroll_Sw">Scroll of Swiftness&nbsp;' + g('lang').option['504'] + '≥<input name="scrollRound_Sw"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Li"><label for="scroll_Li">Scroll of Life&nbsp;' + g('lang').option['504'] + '≥<input name="scrollRound_Li"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Sh"><label for="scroll_Sh">Scroll of Shadows&nbsp;' + g('lang').option['504'] + '≥<input name="scrollRound_Sh"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Ab"><label for="scroll_Ab">Scroll of Absorption&nbsp;' + g('lang').option['504'] + '≥<input name="scrollRound_Ab"placeholder="0"type="text"></label></div>' +
  '<div id="hvAATab-Infusion"class="hvAATab"><input type="checkbox"id="infusion"><label for="infusion"><span class="hvAATitle">' + g('lang').option['601'] + '</span></label><select name="infusionStatus"><option value="1">Infusion of Flames</option><option value="2">Infusion of Frost</option><option value="3">Infusion of Lightning</option><option value="4">Infusion of Storms</option><option value="5">Infusion of Divinity</option><option value="6">Infusion of Darkness</option></select><br>' + g('lang').roundType['0'] + '<input type="checkbox"id="infusionRoundType_ar"><label for="infusionRoundType_ar">' + g('lang').roundType['ar'] + '</label><input type="checkbox"id="infusionRoundType_rb"><label for="infusionRoundType_rb">' + g('lang').roundType['rb'] + '</label><input type="checkbox"id="infusionRoundType_gr"><label for="infusionRoundType_gr">' + g('lang').roundType['gr'] + '</label><input type="checkbox"id="infusionRoundType_iw"><label for="infusionRoundType_iw">' + g('lang').roundType['iw'] + '</label><input type="checkbox"id="infusionRoundType_ba"><label for="infusionRoundType_ba">' + g('lang').roundType['ba'] + '</label><br>' + g('lang').option['602'] + '≥<input name="infusionRoundNow"placeholder="100"type="text">。</div>' +
  '<div id="hvAATab-Weight"class="hvAATab hvAACenter"><span class="hvAATitle">' + g('lang').option['701'] + '</span>&nbsp;<a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md#权重规则"target="_blank">' + g('lang').option['702'] + '</a><br>' + g('lang').option['703'] + '<br>' + g('lang').option['704'] + '<br>Sleep:<input name="weight_Sle"placeholder="+5"type="text">&nbsp;Blind:<input name="weight_Bl"placeholder="+3"type="text">&nbsp;Slow:<input name="weight_Slo"placeholder="+3"type="text">&nbsp;Imperil:<input name="weight_Im"placeholder="-5"type="text">&nbsp;Coalesced Mana:<input name="weight_CM"placeholder="-5"type="text"><br>MagNet:<input name="weight_MN"placeholder="-4"type="text">&nbsp;Silence:<input name="weight_Si"placeholder="-4"type="text">&nbsp;Drain:<input name="weight_Dr"placeholder="-4"type="text">&nbsp;Weaken:<input name="weight_We"placeholder="-4"type="text">&nbsp;Confuse:<input name="weight_Co"placeholder="-1"type="text"><br>' + g('lang').option['705'] + '<br>' + g('lang').option['706'] + '<a href="https://github.com/dodying/UserJs/issues/2"target="_blank">' + g('lang').option['707'] + '</a></div>' +
  '<div id="hvAATab-Storage"class="hvAATab"></div>' +
  '<div id="hvAATab-Other"class="hvAATab"><span>' + g('lang').option['901'] + '<a href="https://github.com/dodying/UserJs/issues/"target="_blank">1. GitHub</a><a href="https://greasyfork.org/scripts/18482/feedback"target="_blank">2. GreasyFork</a><a href="http://e-hentai.org/dmspublic/karma.php?u=2565471"target="_blank">3. +K</a><a href="https://gitter.im/dodying/UserJs"target="_blank">4. Gitter</a></span><div class="hvAASeparate"></div><div class="hvAACenter"><span class="hvAATitle">' + g('lang').option['902'] + '</span><br>' + g('lang').option['903'] + '<br>' + g('lang').roundType['0'] + '<select class="hvAADebug"name="roundType"><option></option><option value="ar">' + g('lang').roundType['ar'] + '</option><option value="rb">' + g('lang').roundType['rb'] + '</option><option value="gr">' + g('lang').roundType['gr'] + '</option><option value="iw">' + g('lang').roundType['iw'] + '</option><option value="ba">' + g('lang').roundType['ba'] + '</option></select><br>' + g('lang').option['904'] + '<input name="roundNow"class="hvAADebug"type="text"placeholder="1">&nbsp;' + g('lang').option['905'] + '<input name="roundAll"class="hvAADebug"type="text"placeholder="1"><br><b>' + g('lang').option['906'] + '</b><div id="hvAAFixMonster"></div><button id="hvAAFix">' + g('lang').option['907'] + '</button></div></div>' +
  '</div><div class="hvAAOptionBoxButton hvAACenter"><button class="hvAAOptionRestore">' + g('lang').option['011'] + '</button><button id="optionApply">' + g('lang').option['012'] + '</button><button id="optionCancel">' + g('lang').option['013'] + '</button></div>';
  gE('.hvAAOptionRestore', optionBox).onclick = function () {
    if (!confirm(g('lang').all[1])) return;
    delValue('hvAAOption');
    reload();
  }
  if (getValue('hvAAOption')) {
    var _option = getValue('hvAAOption', true);
    var inputs = gE('input,select', 'all', optionBox);
    for (var i = 0; i < inputs.length; i = i + 1) {
      if (inputs[i].className === 'hvAADebug' && getValue(inputs[i].name)) {
        inputs[i].value = getValue(inputs[i].name);
      } else if (_option[inputs[i].name] !== undefined) {
        if (inputs[i].type === 'text' || inputs[i].type === 'select-one') {
          inputs[i].value = _option[inputs[i].name];
        } else if (inputs[i].type === 'radio') {
          (_option[inputs[i].name] === inputs[i].value) ? inputs[i].checked = true : inputs[i].checked = false;
        }
      } else if (_option[inputs[i].id] !== undefined) {
        if (inputs[i].type === 'checkbox') {
          inputs[i].checked = _option[inputs[i].id];
        }
      }
    }
  }
  if (getValue('monsterStatus')) {
    var monsterStatus = getValue('monsterStatus', true);
    for (var i = 0; i < monsterStatus.length; i = i + 1) {
      var span = cE('span');
      span.innerHTML = ' id:' + monsterStatus[i].id + ' HPAll:<input name="monsterStatus_' + i + '_HP"class="hvAADebug"type="text"style="width:60px;">';
      if (i % 2 === 1) span.innerHTML += '<br>';
      gE('input', span).value = monsterStatus[i].hp;
      gE('#hvAAFixMonster', optionBox).appendChild(span);
    }
  }
  var storageLib = {
    'hvAAOption': {
      'name': g('lang').storage[0],
      'mutiLine': true
    },
    'arenaDate': {
      'name': g('lang').storage[1],
      'mutiLine': false
    },
    'arenaidArr': {
      'name': g('lang').storage[2],
      'mutiLine': true
    },
    'arenaidOk': {
      'name': g('lang').storage[3],
      'mutiLine': false
    },
    'hvAADisabled': {
      'name': g('lang').storage[4],
      'mutiLine': false
    },
    'monsterStatus': {
      'name': g('lang').storage[5],
      'mutiLine': true
    },
    'roundAll': {
      'name': g('lang').storage[6],
      'mutiLine': false
    },
    'roundNow': {
      'name': g('lang').storage[7],
      'mutiLine': false
    },
    'roundType': {
      'name': g('lang').storage[8],
      'mutiLine': false
    },
    'quickSite': {
      'name': g('lang').storage[9],
      'mutiLine': true
    }
  };
  var storageTable = cE('table');
  var storageName;
  var storagehtml = '<tbody><tr><th>' + g('lang').all[2] + '</th><th>' + g('lang').all[3] + '</th><th>' + g('lang').all[4] + '</th><th>' + g('lang').all[5] + '</th><th>' + g('lang').all[6] + '</th></tr>';
  for (var i = 0; i < localStorage.length; i++) {
    storageName = localStorage.key(i);
    storagehtml += '<tr><td>' + storageName + '</td><td>';
    if (storageName in storageLib) {
      storagehtml += storageLib[storageName].name + '</td><td>';
      storagehtml += (storageLib[storageName].mutiLine) ? '<textarea>' + getValue(storageName) + '</textarea>' : '<input type="text" value="' + getValue(storageName) + '">';
    } else {
      storagehtml += g('lang').all[7] + '</td><td><input type="text" value="' + getValue(storageName) + '">'
    }
    storagehtml += '</td><td><button onclick="var name=\'' + storageName + '\';var value=prompt(\'' + g('lang').all[8] + '\',localStorage[name]);if(value)localStorage[name]=value;">' + g('lang').all[5] + '</button></td><td><button onclick=if (confirm(\'' + g('lang').all[1] + '\'))"localStorage.removeItem(\'' + storageName + '\')">' + g('lang').all[6] + '</button></td></tr>';
  }
  storagehtml += '</tbody>';
  storageTable.innerHTML = storagehtml;
  storageTable.onclick = function () {
    var storageText = gE('textarea', 'all', storageTable);
    for (var i = 0; i < storageText.length; i++) {
      storageText[i].style.height = storageText[i].scrollHeight + 'px';
    }
    this.onclick = null;
  }
  gE('#hvAATab-Storage', optionBox).appendChild(storageTable);
  gE('#hvAAFix', optionBox).onclick = function () {
    if (confirm(g('lang').all[9])) {
      var inputs = gE('.hvAADebug[name^="round"]', 'all', optionBox);
      for (var i = 0; i < inputs.length; i = i + 1) {
        setValue(inputs[i].name, inputs[i].value || inputs[i].placeholder);
      }
      var monsterStatus = new Array();
      var inputs = gE('#hvAAFixMonster input.hvAADebug', 'all', optionBox);
      for (var i = 0; i < gE('div.btm1', 'all').length; i = i + 1) {
        monsterStatus.push({
          'id': i + 1,
          'hp': (inputs[i]) ? inputs[i].value : '100000'
        });
      }
      setValue('monsterStatus', monsterStatus);
      reload();
    }
  }
  gE('#optionApply', optionBox).onclick = function () {
    if (!gE('input[name=attackStatus]:checked', optionBox)) {
      alert(g('lang').all[10]);
      gE('#attackStatus', optionBox).style.border = '1px solid';
      setTimeout(function () {
        gE('#attackStatus', optionBox).style.border = '';
      }, 0.5 * 1000);
      return;
    }
    var _option = new Object();
    _option.version = (GM_info) ? GM_info.script.version.substring(0, 4)  : 1;
    var inputs = gE('input,select', 'all', optionBox);
    for (var i = 0; i < inputs.length; i = i + 1) {
      if (inputs[i].name === '' && inputs[i].id === '') {
        continue;
      } else if (inputs[i].type === 'text' || inputs[i].type === 'select-one') {
        _option[inputs[i].name] = inputs[i].value || inputs[i].placeholder;
      } else if (inputs[i].type === 'checkbox') {
        _option[inputs[i].id] = inputs[i].checked;
      } else if (inputs[i].type === 'radio' && inputs[i].checked) {
        _option[inputs[i].name] = inputs[i].value;
      }
    }
    setValue('hvAAOption', _option);
    optionBox.style.display = 'none';
    reload();
  }
  gE('#optionCancel', optionBox).onclick = function () {
    optionBox.style.display = 'none';
  }
  gE('body').appendChild(optionBox);
}
function riddleAlert() { //答题警报
  var img = cE('img');
  img.src = '/pages/ponychart.jpg';
  gE('.csp').appendChild(img);
  otherAlert('Riddle', 'loop');
  document.onmousemove = function () {
    gE('#hvAAAlert').pause();
  }
  document.onkeydown = function (e) {
    gE('#hvAAAlert').pause();
    if (e.keyCode >= 49 && e.keyCode <= 51) {
      riddleSubmit(String.fromCharCode(e.keyCode + 16));
    } else if (e.keyCode >= 65 && e.keyCode <= 67) {
      riddleSubmit(String.fromCharCode(e.keyCode));
    } else if (e.keyCode >= 97 && e.keyCode <= 99) {
      riddleSubmit(String.fromCharCode(e.keyCode - 32));
    }
  }
  for (var i = 0; i < 30; i++) {
    setTimeout(function () {
      var timeDiv = gE('#riddlecounter>div>div', 'all');
      var time = '';
      for (var j = 0; j < timeDiv.length; j = j + 1) {
        time = (parseInt(timeDiv[j].style.backgroundPosition.replace('0px -', '')) / 12).toString() + time;
      }
      document.title = time;
      if (g('option').riddleAnswer && parseInt(time) <= parseInt(g('option').riddleAnswerTime)) {
        if (!gE('#riddlemaster').value) {
          var random = Math.random();
          if (random < 1 / 3) {
            gE('#riddlemaster').value = 'A';
          } else if (random < 2 / 3) {
            gE('#riddlemaster').value = 'B';
          } else {
            gE('#riddlemaster').value = 'C';
          }
        }
        gE('#riddleform').submit();
      }
    }, i * 1000);
  }
  if (g('option').riddleRadio) {
    var options = [
      'A',
      'B',
      'C'
    ];
    var bar = gE('body').appendChild(cE('div'));
    bar.className = 'answerBar';
    for (var i = 0; i < options.length; i++) {
      var button = bar.appendChild(cE('div'));
      button.value = options[i];
      button.onclick = function () {
        riddleSubmit(this.value);
      };
    }
  }
  function riddleSubmit(answer) {
    gE('#riddlemaster').value = answer;
    gE('#riddleform').submit();
  }
}
function pauseButton() { //暂停按钮
  var button = cE('button');
  button.innerHTML = g('lang').all[16];
  button.onclick = function () {
    if (getValue('hvAADisabled')) {
      this.innerHTML = g('lang').all[16];
      delValue(0);
      main();
    } else {
      this.innerHTML = g('lang').all[14];
      setValue('hvAADisabled', true);
    }
  }
  gE('.clb').insertBefore(button, gE('.clb>.cbl'))
}
function quickSite() { //待续
  var siteBar = cE('div');
  siteBar.className = 'siteBar';
  siteBar.innerHTML = '<span><a href="javascript:"class="siteBarToggle">&lt;&lt;</a></span><span><a href="http://tieba.baidu.com/f?kw=hv网页游戏"target="_blank"><img src="https://www.baidu.com/favicon.ico" class="favicon"></img>贴吧</a></span><span><a href="https://forums.e-hentai.org/index.php?showforum=76"target="_blank"><img src="https://forums.e-hentai.org/favicon.ico" class="favicon"></img>Forums</a></span>';
  if (getValue('quickSite')) {
    var quickSite = getValue('quickSite', true);
    for (var i = 0; i < quickSite.length; i++) {
      siteBar.innerHTML += '<span><a href="' + quickSite[i].url + '"target="_blank">' + ((quickSite[i].fav) ? '<img src="' + quickSite[i].fav + '"class="favicon"></img>' : '') + quickSite[i].name + '</a></span>';
    }
  }
  siteBar.innerHTML += '<span><a href="javascript:"class="siteBarPlus">+++</a></span>';
  gE('.siteBarToggle', siteBar).onclick = function () {
    var spans = gE('span', 'all', siteBar);
    for (var i = 1; i < spans.length; i++) {
      spans[i].style.display = (this.innerText === '<<') ? 'none' : 'block';
    }
    this.innerText = (this.innerText === '<<') ? '>>' : '<<';
  }
  gE('.siteBarPlus', siteBar).onclick = function () {
    var quickSite = getValue('quickSite', true) || new Array();
    var url = prompt(g('lang').all[17]);
    if (!url) return;
    var name = prompt(g('lang').all[18]);
    var fav = prompt(g('lang').all[19]);
    quickSite.push({
      'url': url,
      'name': name,
      'fav': fav
    });
    setValue('quickSite', quickSite);
  }
  gE('body').appendChild(siteBar);
}
function reloader() {
  var script = cE('script');
  script.innerHTML = '(' + (function () {
    document.getElementById('battleform').submit = function () {
      document.getElementById('hvAAReloader').click();
    }
  }).toString() + ')()';
  gE('head').appendChild(script);
  var a = cE('a');
  a.id = 'hvAAReloader';
  a.onclick = function () {
    formSubmit();
  }
  gE('body').appendChild(a);
}
function formSubmit() { //基本来自https://forums.e-hentai.org/index.php?showtopic=65126&st=2660&p=4384894&#entry4384894
  var inputs = gE('#battleform>input', 'all');
  var serializedForm = '';
  for (var i = 0; i < inputs.length; i = i + 1) {
    if (i !== 0) serializedForm += '&';
    serializedForm += inputs[i].id + '=' + inputs[i].value;
  }
  post(location.href, serializedForm, function (e) {
    clearTimeout(g('delayAlert'));
    clearTimeout(g('delayReload'));
    var data = e.target.response;
    var replacements = '.cwbdv, .bte, #ckey_spirit, #ckey_defend, #togpane_magico, #togpane_magict, #togpane_item, #quickbar, #togpane_log';
    var monsterReplacements = '#mkey_0, #mkey_1, #mkey_2, #mkey_3, #mkey_4, #mkey_5, #mkey_6, #mkey_7, #mkey_8, #mkey_9';
    var existing = gE(replacements, 'all');
    var newStuff = gE(replacements, 'all', data);
    var i = existing.length;
    while (i--) {
      existing[i].parentNode.replaceChild(newStuff[i], existing[i]);
    }
    var existing = gE(monsterReplacements, 'all');
    var newStuff = gE(monsterReplacements, 'all', data);
    var i = existing.length;
    while (i--) {
      if (existing[i].hasAttribute('onclick') || newStuff[i].hasAttribute('onclick')) {
        existing[i].parentNode.replaceChild(newStuff[i], existing[i]);
      }
    }
    if (gE('.btcp', data)) gE('.btt').insertBefore(gE('.btcp', data), gE('.btt').firstChild);
    unsafeWindow.battle = new unsafeWindow.Battle;
    unsafeWindow.battle.clear_infopane();
    main();
  });
}
function autoArena() { //自动刷竞技场
  var dateNow = new Date();
  dateNow = dateNow.getUTCFullYear() + '/' + (dateNow.getUTCMonth() + 1) + '/' + dateNow.getUTCDate();
  var date = localStorage.arenaDate;
  if (date !== dateNow) {
    setValue('arenaDate', dateNow);
    delValue('arenaidArr');
    delValue('arenaidOk');
  }
  if (getValue('arenaidOk')) return;
  var myLevel = parseInt(gE('.clb>.cit:nth-child(12) .fd4>div').innerHTML.match(/\d+/) [0]);
  var levelArr = new Array(1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 165, 180, 200, 225, 250, 500);
  for (var i = 0; i < levelArr.length; i = i + 1) {
    if (myLevel <= levelArr[i]) break;
  }
  var arenaidArr = getValue('arenaidArr', true) || new Array(1, 3, 5, 8, 9, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 24, 26, 27, 28, 29, 32);
  var length = levelArr.indexOf(levelArr[i]);
  length = (length > arenaidArr.length) ? arenaidArr.length : length;
  if (length === 1) setValue('arenaidOk', true);
  arenaidArr.length = length;
  post(location.href, 'recover=all', function () { //回复
    document.title = g('lang').all[20];
    post('?s=Battle&ss=ar', 'arenaid=' + arenaidArr[arenaidArr.length - 1], function () {
      document.title = g('lang').all[21];
      arenaidArr.splice( - 1);
      setValue('arenaidArr', arenaidArr);
      reload();
    });
  });
}
function otherAlert(e, times) { //其他警报
  //var fileType = (/Chrome|Safari/.test(navigator.userAgent)) ? '.mp3' : '.wav';
  var fileType = '.mp3';
  var audio = cE('audio');
  audio.id = 'hvAAAlert';
  audio.controls = true;
  audio.src = (GM_getResourceURL !== undefined) ? GM_getResourceURL(e + fileType)  : 'https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/' + e + fileType;
  if (typeof times === 'number') {
    var _time = 0;
    audio.addEventListener('ended', function () {
      _time = _time + 1;
      if (_time === times) {
        audio.pause();
        return;
      }
      audio.play();
    });
  } else if (times === 'loop') {
    audio.loop = true;
  }
  audio.play();
  gE('body').appendChild(audio);
}
function countRound() { //回合计数及自动前进并获取怪物总HP
  if (getValue('roundType')) {
    g('roundType', getValue('roundType'));
  } else {
    g('roundType', location.search.replace(/.*ss=([a-z]{2}).*/, '$1'));
    setValue('roundType', g('roundType'));
  }
  var battleLog = gE('#togpane_log>table>tbody>tr>td.t3', 'all');
  if (battleLog[battleLog.length - 1].innerHTML === 'Battle Start!') delValue(1);
  if (!localStorage.roundNow) {
    var monsterStatus = new Array();
    var id = 0;
    for (var i = battleLog.length - 3; i > battleLog.length - 3 - g('monsterAll'); i--) {
      var hp = parseFloat(battleLog[i].innerHTML.replace(/.*HP=/, ''));
      if (isNaN(hp)) hp = monsterStatus[monsterStatus.length - 1].hp;
      monsterStatus[id] = {
        'id': (id === 9) ? 0 : id + 1,
        'isDead': false,
        'hp': hp
      };
      id = id + 1;
    }
    setValue('monsterStatus', monsterStatus);
    g('monsterStatus', monsterStatus);
    var round = battleLog[battleLog.length - 2].innerHTML.replace(/.*\(Round /, '').replace(/\).*/, '').replace(/\s+/g, '');
    var roundNow;
    var roundAll;
    if (g('roundType') !== 'ba' || /^\d+\/\d+$/.test(round)) {
      roundNow = parseInt(round.replace(/\/.*/, ''));
      roundAll = parseInt(round.replace(/.*\//, ''));
    } else {
      roundNow = 1;
      roundAll = 1;
    }
    setValue('roundNow', roundNow);
    setValue('roundAll', roundAll);
    g('roundNow', roundNow);
    g('roundAll', roundAll);
  } else {
    g('roundNow', parseInt(getValue('roundNow')));
    g('roundAll', parseInt(getValue('roundAll')));
  }
  if (gE('.btcp')) {
    if (g('monsterAlive') > 0) {
      otherAlert('Failed', 1);
      delValue(2);
    } else if (g('roundNow') !== g('roundAll')) {
      delValue(1);
      reload();
    } else if (g('roundNow') === g('roundAll')) {
      otherAlert('Win', 1);
      delValue(2);
      setTimeout(function () {
        reload();
      }, 3 * 1000);
    }
    g('end', true);
  }
}
function battleInfo() { //战斗战况
  if (!gE('.hvAALog')) {
    var div = cE('div');
    div.className = 'hvAALog';
    gE('div.clb').insertBefore(div, gE('.cit'));
  }
  gE('.hvAALog').innerHTML = g('lang').info[0] + g('runtime') + '<br>' + g('lang').info[1] + g('roundNow') + '/' + g('roundAll') + '<br>' + g('lang').info[2] + g('lang').status[g('attackStatus')] + '<br>' + g('lang').info[3] + g('bossAlive') + '<br>' + g('lang').info[4] + g('monsterAlive') + '/' + g('monsterAll');
  document.title = g('runtime') + '||' + g('roundNow') + '/' + g('roundAll') + '||' + g('monsterAlive') + '/' + g('monsterAll');
}
function autoUseGem() { //自动使用宝石
  var Gem = gE('#ikey_p').getAttribute('onmouseover').replace(/battle.set_infopane_item\(\'(.*?)\'.*/, '$1');
  if (Gem === 'Health Gem' && g('hp') <= g('option').hp1) {
    gE('#ikey_p').click();
    g('end', true);
    return;
  } else if (Gem === 'Mana Gem' && g('mp') <= g('option').mp1) {
    gE('#ikey_p').click();
    g('end', true);
    return;
  } else if (Gem === 'Spirit Gem' && g('sp') <= g('option').sp1) {
    gE('#ikey_p').click();
    g('end', true);
    return;
  } else if (Gem === 'Mystic Gem') {
    gE('#ikey_p').click();
    g('end', true);
    return;
  }
}
function deadSoon() { //自动回血回魔
  if (g('mp') < g('option').mp2) { //自动回魔
    gE('#quickbar').style.backgroundColor = 'blue';
    if (gE('.bti3>div[onmouseover*="Mana Potion"]')) {
      gE('.bti3>div[onmouseover*="Mana Potion"]').click();
      g('end', true);
      return;
    } else if (g('mp') <= g('option').mp3 && gE('.bti3>div[onmouseover*="Mana Elixir"]')) {
      gE('.bti3>div[onmouseover*="Mana Elixir"]').click();
      g('end', true);
      return;
    }
  }
  if (g('sp') < g('option').sp2) { //自动回精
    gE('#quickbar').style.backgroundColor = 'green';
    if (gE('.bti3>div[onmouseover*="Spirit Potion"]')) {
      gE('.bti3>div[onmouseover*="Spirit Potion"]').click();
      g('end', true);
      return;
    } else if (g('sp') <= g('option').sp3 && gE('.bti3>div[onmouseover*="Spirit Elixir"]')) {
      gE('.bti3>div[onmouseover*="Spirit Elixir"]').click();
      g('end', true);
      return;
    }
  }
  if (g('hp') <= g('option').hp2) { //自动回血
    if (!gE('.cwb2[src*="barsilver"]')) gE('#quickbar').style.backgroundColor = 'red';
    if (isOn('311')) {
      gE('311', 'id').click();
      g('end', true);
      return;
    } else if (isOn('313')) {
      gE('313', 'id').click();
      g('end', true);
      return;
    } else if (gE('.bti3>div[onmouseover*="Health Potion"]')) {
      gE('.bti3>div[onmouseover*="Health Potion"]').click();
      g('end', true);
      return;
    } else if (g('hp') <= g('option').hp3 && gE('.bti3>div[onmouseover*="Health Elixir"]')) {
      gE('.bti3>div[onmouseover*="Health Elixir"]').click();
      g('end', true);
      return;
    }
  }
  if (g('option').lastElixir && gE('.bti3>div[onmouseover*="Last Elixir"]')) {
    gE('.bti3>div[onmouseover*="Last Elixir"]').click();
    g('end', true);
    return;
  }
}
function autoUseScroll() { //自动使用卷轴
  var scrollLib = {
    'Go': {
      'name': 'Scroll of the Gods',
      'mult': '3',
      'img1': 'absorb',
      'img2': 'shadowveil',
      'img3': 'sparklife'
    },
    'Av': {
      'name': 'Scroll of the Avatar',
      'mult': '2',
      'img1': 'haste',
      'img2': 'protection'
    },
    'Pr': {
      'name': 'Scroll of Protection',
      'mult': '1',
      'img1': 'protection'
    },
    'Sw': {
      'name': 'Scroll of Swiftness',
      'mult': '1',
      'img1': 'haste'
    },
    'Li': {
      'name': 'Scroll of Life',
      'mult': '1',
      'img1': 'sparklife'
    },
    'Sh': {
      'name': 'Scroll of Shadows',
      'mult': '1',
      'img1': 'shadowveil'
    },
    'Ab': {
      'name': 'Scroll of Absorption',
      'mult': '1',
      'img1': 'absorb'
    }
  };
  var scrollFirst = (g('option').scrollFirst) ? '_scroll' : '';
  for (var i in scrollLib) {
    if (g('option') ['scroll_' + i] && gE('.bti3>div[onmouseover*="' + scrollLib[i].name + '"]') && g('roundNow') >= g('option') ['scrollRound_' + i]) {
      for (var j = 1; j <= scrollLib[i].mult; j++) {
        if (gE('div.bte>img[src*="' + scrollLib[i]['img' + j] + scrollFirst + '"]')) {
          var isUsed = true;
          break;
        }
        var isUsed = false;
      }
      if (!isUsed) {
        gE('.bti3>div[onmouseover*="' + scrollLib[i].name + '"]').click();
        g('end', true);
        return;
      }
    }
  }
}
function autoUseBuffSkill() { //自动使用药水、施法增益技能
  if (g('roundAll') >= g('option').buffSkillAllRound || g('monsterAll') >= g('option').buffSkillMonster || g('bossAlive') >= g('option').buffSkillBoss) {
    var skillLib = {
      'Pr': {
        'name': 'Protection',
        'id': '411',
        'img': 'protection'
      },
      'SL': {
        'name': 'Spark of Life',
        'id': '422',
        'img': 'sparklife'
      },
      'SS': {
        'name': 'Spirit Shield',
        'id': '423',
        'img': 'spiritshield'
      },
      'Ha': {
        'name': 'Haste',
        'id': '412',
        'img': 'haste'
      },
      'AF': {
        'name': 'Arcane Focus',
        'id': '432',
        'img': 'arcanemeditation',
      },
      'He': {
        'name': 'Heartseeker',
        'id': '431',
        'img': 'heartseeker'
      },
      'Re': {
        'name': 'Regen',
        'id': '312',
        'img': 'regen'
      },
      'SV': {
        'name': 'Shadow Veil',
        'id': '413',
        'img': 'shadowveil'
      },
      'Ab': {
        'name': 'Absorb',
        'id': '421',
        'img': 'absorb'
      }
    };
    if (gE('div.bte>img[src*="channeling"]')) {
      var buff = gE('div.bte>img', 'all');
      if (buff.length > 0) {
        for (var n = 0; n < buff.length; n++) {
          var spellName = buff[n].getAttribute('onmouseover').replace(/battle.set_infopane_effect\(\'(.*?)\'.*/, '$1');
          if (spellName === 'Absorbing Ward') continue;
          var buffLastTime = parseInt(buff[n].getAttribute('onmouseover').replace(/.*\'\,(.*?)\)/g, '$1'));
          if (buffLastTime <= g('option').channelReBuff) {
            if (spellName === 'Cloak of the Fallen' && !gE('div.bte>img[src*="sparklife"]') && isOn('422')) {
              gE('422', 'id').click();
              g('end', true);
              return;
            }
            for (var i in skillLib) {
              if (spellName === skillLib[i].name && isOn(skillLib[i].id)) {
                gE(skillLib[i].id, 'id').click();
                g('end', true);
                return;
              }
            }
          }
          break;
        }
        for (var i in skillLib) {
          if (g('option') ['channelSkill_' + i] !== undefined) {
            if (g('option') ['channelSkill_' + i] && !gE('div.bte>img[src*="' + skillLib[i].img + '"]') && isOn(skillLib[i].id)) {
              gE(skillLib[i].id, 'id').click();
              g('end', true);
              return;
            }
          }
        }
      }
    }
    for (var i in skillLib) {
      if (g('option') ['buffSkill_' + i] && !gE('div.bte>img[src*="' + skillLib[i].img + '"]') && isOn(skillLib[i].id)) {
        gE(skillLib[i].id, 'id').click();
        g('end', true);
        return;
      }
    }
    if (!gE('div.bte>img[src*="healthpot"]') && g('hp') <= g('option').hp0 && g('option').buffSkill_HD && gE('.bti3>div[onmouseover*="Health Draught"]')) {
      gE('.bti3>div[onmouseover*="Health Draught"]').click();
      g('end', true);
      return;
    } else if (!gE('div.bte>img[src*="manapot"]') && g('mp') <= g('option').mp0 && g('option').buffSkill_MD && gE('.bti3>div[onmouseover*="Mana Draught"]')) {
      gE('.bti3>div[onmouseover*="Mana Draught"]').click();
      g('end', true);
      return;
    } else if (!gE('div.bte>img[src*="spiritpot"]') && g('sp') <= g('option').sp0 && g('option').buffSkill_SD && gE('.bti3>div[onmouseover*="Spirit Draught"]')) {
      gE('.bti3>div[onmouseover*="Spirit Draught"]').click();
      g('end', true);
      return;
    }
  } else if (g('roundType') === 'ba') {
    if (!gE('div.bte>img[src*="sparklife"]') && isOn('422')) {
      gE('422', 'id').click();
      g('end', true);
      return;
    }
  }
}
function autoUseInfusions() { //自动使用魔药
  var infusionLib = {
    '1': {
      'name': 'Infusion of Flames',
      'img': 'fireinfusion'
    },
    '2': {
      'name': 'Infusion of Frost',
      'img': 'coldinfusion'
    },
    '3': {
      'name': 'Infusion of Lightning',
      'img': 'elecinfusion'
    },
    '4': {
      'name': 'Infusion of Storms',
      'img': 'windinfusion'
    },
    '5': {
      'name': 'Infusion of Divinity',
      'img': 'holyinfusion'
    },
    '6': {
      'name': 'Infusion of Darkness',
      'img': 'darkinfusion'
    }
  };
  if (gE('.bti3>div[onmouseover*="' + infusionLib[g('option').infusionStatus].name + '"]') && !gE('div.bte>img[src*="' + infusionLib[[g('option').infusionStatus]].img + '"]')) {
    gE('.bti3>div[onmouseover*="' + infusionLib[g('option').infusionStatus].name + '"]').click();
    g('end', true);
    return;
  }
}
function countMonsterHP() { //统计怪物血量
  var monsterHp = gE('div.btm4>div.btm5:nth-child(1)', 'all');
  var monsterStatus = g('monsterStatus');
  for (var i = 0; i < monsterHp.length; i++) {
    if (gE('img[src="/y/s/nbardead.png"]', monsterHp[i])) {
      monsterStatus[i].isDead = true;
      monsterStatus[i].hpNow = Infinity;
    } else {
      monsterStatus[i].isDead = false;
      monsterStatus[i].hpNow = Math.floor(monsterStatus[i].hp * parseFloat(gE('div.chbd>img.chb2', monsterHp[i]).style.width) / 120) + 1;
    }
  }
  setValue('monsterStatus', monsterStatus);
  monsterStatus.sort(objArrSort('hpNow'));
  var hpLowest = monsterStatus[0].hpNow;
  for (var i = 0; i < monsterStatus.length; i++) {
    monsterStatus[i].initWeight = (monsterStatus[i].isDead) ? Infinity : monsterStatus[i].hpNow / hpLowest * 10;
    monsterStatus[i].finWeight = monsterStatus[i].initWeight;
  }
  g('monsterStatus', monsterStatus);
}
function autoUseDeSkill() { //自动施法De技能
  var skillLib = {
    'Sle': {
      'name': 'Sleep',
      'img': 'sleep'
    },
    'Bl': {
      'name': 'Blind',
      'img': 'blind'
    },
    'Slo': {
      'name': 'Slow',
      'img': 'slow'
    },
    'Im': {
      'name': 'Imperil',
      'id': '213',
      'img': 'imperil'
    },
    'CM': {
      'name': 'Coalesced Mana',
      'img': 'coalescemana'
    },
    'MN': {
      'name': 'MagNet',
      'id': '233',
      'img': 'magnet'
    },
    'Si': {
      'name': 'Silence',
      'id': '232',
      'img': 'silence'
    },
    'Dr': {
      'name': 'Drain',
      'id': '211',
      'img': 'drainhp'
    },
    'We': {
      'name': 'Weaken',
      'id': '212',
      'img': 'weaken'
    },
    'Co': {
      'name': 'Confuse',
      'id': '223',
      'img': 'confuse'
    }
  };
  var monsterStatus = g('monsterStatus');
  monsterStatus.sort(objArrSort('id'));
  var monsterBuff = gE('div.btm6', 'all');
  for (var i = 0; i < monsterBuff.length; i++) {
    for (var j in skillLib) {
      monsterStatus[i].finWeight += (gE('img[src*="' + skillLib[j].img + '"]', monsterBuff[i])) ? parseFloat(g('option') ['weight_' + j])  : 0;
    }
  }
  g('monsterStatus', monsterStatus);
  monsterStatus.sort(objArrSort('finWeight'));
  for (var i in skillLib) {
    if (g('option') ['debuffSkill_' + i] && isOn(skillLib[i].id) && !gE('#mkey_' + monsterStatus[0].id + '>.btm6>img[src*="' + skillLib[i].img + '"]')) {
      gE(skillLib[i].id, 'id').click();
      gE('#mkey_' + monsterStatus[0].id).click();
      g('end', true);
      return;
    }
  }
}
function autoAttack() { //自动打怪
  if (g('option').spiritStance && g('oc') >= parseInt(g('option').spiritStance_oc) && !gE('#ckey_spirit[src*="spirit_a"]')) {
    gE('#ckey_spirit').click();
  }
  g('monsterStatus').sort(objArrSort('finWeight'));
  var minNum = g('monsterStatus') [0].id;
  if (g('attackStatus') !== 0) {
    if (g('monsterAlive') >= g('option').highSkill && isOn('1' + g('attackStatus') + '3')) {
      gE('1' + g('attackStatus') + '3', 'id').click();
    } else if (g('monsterAlive') >= g('option').middleSkill && isOn('1' + g('attackStatus') + '2')) {
      gE('1' + g('attackStatus') + '2', 'id').click();
    } else if (isOn('1' + g('attackStatus') + '1')) {
      gE('1' + g('attackStatus') + '1', 'id').click();
    }
  }
  if (g('option').specialSkill && gE('#ckey_spirit[src*="spirit_a"]')) {
    if (g('oc') >= g('option').specialSkillOC_FUS && g('option').specialSkill_FUS && (g('monsterAlive') > g('option').specialSkillMonster_FUS || g('bossAlive') > g('option').specialSkillBoss_FUS) && isOn('1101')) {
      gE('1101', 'id').click();
    } else if (g('oc') >= g('option').specialSkillOC_OFC && g('option').specialSkill_OFC && (g('monsterAlive') > g('option').specialSkillMonster_OFC || g('bossAlive') > g('option').specialSkillBoss_OFC) && isOn('1111')) {
      gE('1111', 'id').click();
    }
  }
  if (minNum === 10) minNum = 0;
  gE('#mkey_' + minNum).click();
  g('end', true);
  return;
}
function gE(ele, mode, parent) { //获取元素
  if (mode === undefined) {
    return document.querySelector(ele);
  } else if (mode === 'all') {
    return (parent === undefined) ? document.querySelectorAll(ele)  : parent.querySelectorAll(ele);
  } else if (mode === 'id') {
    return document.getElementById(ele);
  } else if (typeof mode === 'object') {
    return mode.querySelector(ele);
  }
}
function cE(name) { //创建元素
  return document.createElement(name);
}
function isOn(id) {
  if (gE(id, 'id') && gE(id, 'id').style.opacity !== '0.5') {
    return true;
  } else {
    return false;
  }
}
function setValue(item, value) {
  localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
}
function getValue(item, toJSON) {
  return (localStorage[item]) ? ((toJSON) ? JSON.parse(localStorage[item])  : localStorage[item])  : null;
}
function delValue(item) {
  if (typeof item === 'string') {
    localStorage.removeItem(item);
  } else if (typeof item === 'number') {
    localStorage.removeItem('hvAADisabled');
    if (item > 0) {
      localStorage.removeItem('roundNow');
      localStorage.removeItem('roundAll');
      localStorage.removeItem('monsterStatus');
      if (item > 1) {
        localStorage.removeItem('roundType');
      }
    }
  }
}
function reload() {
  location = location.search.replace(/#.*/, '');
}
function g(item, key) { //全局变量
  window.hvAA = window.hvAA || new Object();
  if (key === undefined) {
    return window.hvAA[item];
  } else {
    window.hvAA[item] = key;
  }
}
function post(href, parm, func) { //post
  var xhr = new XMLHttpRequest();
  xhr.open('POST', href);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  xhr.responseType = 'document';
  xhr.onload = function (e) {
    if (e.target.status >= 200 && e.target.status < 400) func(e);
    xhr = null;
  }
  xhr.send(parm);
}
function objArrSort(propertyName) { //对象数组排序函数，从小到大排序，来自http://www.jb51.net/article/24536.htm
  return function (object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value2 < value1) {
      return 1;
    } else if (value2 > value1) {
      return - 1;
    } else {
      return 0;
    }
  }
}
