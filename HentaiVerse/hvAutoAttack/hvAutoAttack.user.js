// ==UserScript==
// @name         hvAutoAttack
// @name:zh-TW   【HV】打怪
// @name:zh-CN   【HV】打怪
// @description  HV auto attack script, for the first user, should configure before use it.
// @description:zh-CN HV自动打怪脚本，初次使用，请先设置好选项，请确认字体设置正常
// @description:zh-TW HV自動打怪腳本，初次使用，請先設置好選項，請確認字體設置正常
// @include      http://*hentaiverse.org/*
// @exclude      http://*hentaiverse.org/pages/showequip.php?*
// @author       Dodying
// @namespace    https://github.com/dodying/UserJs
// @supportURL   https://github.com/dodying/UserJs/issues
// @icon         https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @version      2.65b
// @compatible   Firefox with Greasemonkey
// @compatible   Chrome with Tampermonkey
// @compatible   Android with Firefox and usi
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==
(function init() {
  if (gE('img[src="http://ehgt.org/g/derpy.gif"]')) {
    setTimeout(function () {
      reload();
    }, 5 * 60 * 1000);
    return;
  }
  if (getValue('option')) {
    g('option', getValue('option', true));
    langPack(g('option').lang || '0');
    if (GM_info && g('option').version !== GM_info.script.version.substring(0, 4)) {
      alert(g('lang').all[4] + g('lang').new .join('\n'));
      gE('#hvAABox').style.display = 'block';
      gE('.hvAAOptionReset').focus();
      return;
    }
  } else {
    langPack(prompt('请输入以下语言代码对应的数字\nPlease put in the number of your preferred language (0, 1 or 2)\n0.简体中文\n1.繁體中文\n2.English'));
    alert(g('lang').all[0]);
    gE('#hvAABox').style.display = 'block';
    return;
  }
  if (gE('.f2rb') && confirm(g('lang').all[5])) {
    window.open('https://greasyfork.org/zh-CN/forum/discussion/comment/27107/#Comment_27107');
    return;
  }
  if (gE('#riddlecounter')) { //需要答题
    riddleAlert(); //答题警报
  } else if (!gE('#navbar')) { //战斗中
    g('attackStatus', g('option').attackStatus);
    g('runtime', 0);
    if (g('option').pauseButton) pauseButton();
    if (g('option').pauseHotkey) pauseHotkey();
    if (g('option').reloader) reloader();
    main();
  } else { //非战斗
    delValue(2);
    quickSite();
    if (g('option').damageAlert && gE('div[style="margin:5px 0 0; color:#FA9300"]')) {
      setAlert('Error', 3);
      alert(g('lang').all[22]);
      return;
    }
    if (g('option').autoArena && parseInt(gE('.fd4>div').innerHTML.match(/\d+/) [0]) > parseInt(g('option').staminaNow)) {
      setTimeout(function () {
        autoArena();
      }, g('option').autoArenaTime * 1000);
    }
  }
}) ();
function main() { //主程序
  if (getValue('disabled')) { //如果禁用
    document.title = g('lang').all[6];
    gE('.clb>button').innerHTML = g('lang').all[7];
    return;
  }
  g('end', false);
  if (g('option').stamina && parseInt(gE('.fd4>div').innerHTML.match(/\d+/) [0]) <= parseInt(g('option').staminaNow)) {
    pauseChange();
    setAlert('Error', 3);
    alert(g('lang').all[19]);
    return;
  }
  g('runtime', g('runtime') + 1);
  g('monsterAll', gE('div.btm1', 'all').length);
  var monsterDead = gE('img[src*="nbardead"]', 'all').length;
  g('monsterAlive', g('monsterAll') - monsterDead);
  g('bossAll', gE('div.btm2[style^="background"]', 'all').length);
  var bossDead = gE('div.btm1[style*="opacity"] div.btm2[style*="background"]', 'all').length;
  g('bossAlive', g('bossAll') - bossDead);
  countRound(); //回合计数及自动前进并获取怪物总HP
  if (g('end')) return;
  if (getValue('monsterStatus')) {
    g('monsterStatus', getValue('monsterStatus', true));
  } else {
    alert(g('lang').all[8]);
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
      setAlert('default', 3);
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
  if (g('option').buffSkill && (g('roundAll') >= g('option').buffSkillAllRound || g('monsterAll') >= g('option').buffSkillMonster || g('bossAlive') >= g('option').buffSkillBoss)) autoUseBuffSkill(); //自动使用药水、施法增益技能
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
        '注意，修复只是临时作用使脚本能够运行！\n如果脚本能够继续运行请按取消！\n是否继续？', //2
        '请选择攻击模式', //3
        'hvAutoAttack版本更新，请重新设置\n强烈推荐【重置设置】后再设置。\n\n以下为更新内容\n', //4
        '请设置字体\n使用默认字体可能使某些功能失效\n如无法正确获取到oc值，导致相关的Spirit Stance无法正常开启\n是否查看相关说明？', //5
        'hvAutoAttack暂停中', //6
        '继续', //7
        '请点击尝试修复', //8
        '暂停', //9
        '请输入链接，必填', //10
        '请输入名称，可留空', //11
        '请输入图标，可留空', //12
        '回复完成', //13
        '竞技场开始', //14
        '请输入配置', //15
        '如果您遭遇了Bug，请确认是否为最新版本（一些Bug可能在新版中被修复）\n如果你觉得脚本很棒，那就送作者1Hath作为感谢\n是否继续打开网页', //16
        '如果询问是否允许，请选择允许', //17
        '接下来将测试该音频\n如果该音频无法播放或无法载入，请替换\n请测试完成后再键入另一个音频', //18
        '当前Stamina过低\n或Stamina损失过多\n导致脚本暂停', //19
        '请检查高亮的输入框是否填写正确', //20
        '请检查音频文件的地址是否正确', //21
        '装备损坏，请修复' //22
      ],
      option: {
        0: { //
          0: 'hvAutoAttack设置',
          1: '语言',
          2: '主要选项',
          3: '对自身技能',
          4: 'De技能',
          5: '其他技能',
          6: '卷轴',
          7: '魔药',
          8: '警报',
          9: '权重规则',
          10: '掉落监测',
          11: '其他',
          12: '导出',
          13: '导入',
          14: '重置设置',
          15: '应用',
          16: '取消'
        },
        1: { //主要
          0: '0.使用Draught药水\n1.使用宝石回复\n2.使用（技能、）Potion药水回复\n3.使用Elixir药水回复',
          1: '当技能与药水CD时，使用<b>Last Elixir</b>',
          2: '<b>*攻击模式</b>：',
          3: '<b>暂停相关</b>：',
          4: '使用按钮；',
          5: '使用热键：',
          6: '<b>技能施放条件</b>：',
          7: '中级：怪物存活数',
          8: '；高级：怪物存活数',
          9: '当OC',
          10: '且SP',
          11: '%，开启<b>Spirit Stance</b>',
          12: '防止脚本莫名暂停',
          13: '页面停留',
          14: '秒后，<b>警报</b>；',
          15: '秒后，<b>刷新页面</b>。',
          16: '当<b>小马</b>答题时间',
          17: '秒，如果输入框为空则随机生成答案。',
          18: '当Stamina≤',
          19: '时，脚本暂停并警报。',
          20: '在<b>任意页面</b>停留',
          21: '秒后，开始竞技场',
          22: '开启',
          23: '减少页面刷新，降低内存使用，感谢网友【zsp40088】提出',
          24: '答题单选',
          25: '开启<b>掉落监测</b>，记录装备的最低品质',
          26: '开启<b>音频警报</b>；',
          27: '开启<b>桌面通知</b>',
          28: '测试',
          29: '或损失Stamina≥',
          30: '重置竞技场',
          31: '；选填，竞技场对应的等级(以,分隔)：',
          32: '当装备损坏时，警报。'
        },
        2: { //对自身技能
          0: '对自身技能',
          1: '施放条件（有一个成立就行）：',
          2: '1. 总回合数',
          3: '2. Boss存活数',
          4: '3. 遭遇战中，怪物存活数',
          5: '增益技能',
          6: '（Buff不存在就施放的技能，按【施放顺序】排序）：',
          7: '获得Channel时',
          8: '，即施法只需1点MP，',
          9: '先ReBuff',
          10: '：buff存在≤',
          11: '回合时，重新使用该技能。',
          12: '再施放Channel技能',
          13: '（按【施放顺序】排序）：'
        },
        3: { //De技能
          0: 'De技能',
          1: '（按【施放顺序】排序）',
          2: '请选择模式：',
          3: '0. 对所有怪施放',
          4: '1. 只对Boss施放'
        },
        4: { //其他技能
          0: '注：本标签所有输入框皆表示阈值<br>1. OC值 2. 怪兽存活数 3. Boss存活数',
          1: '其他技能（按【施放顺序】排序）',
          2: '友情小马炮：',
          3: '龙吼：',
          4: '请选择战斗风格：',
          5: '1阶：',
          6: '2阶（如果有）：',
          7: '3阶（如果有）：'
        },
        5: { //卷轴
          0: '使用卷轴',
          1: '总体条件：当前回合数',
          2: '存在技能生成的Buff时，仍然使用卷轴。',
          3: '当前回合数'
        },
        6: { //魔药
          0: '使用魔药：',
          1: '使用条件：当前回合数',
          2: '魔药属性与<a href="#hvAATab-Main">主要选项</a>里的攻击模式相同'
        },
        7: { //警报
          0: '自定义警报',
          1: '留空则使用默认音频\n对于国内用户，建议使用自定义音频',
          2: '默认：',
          3: '错误：',
          4: '失败：',
          5: '答题：',
          6: '胜利：',
        },
        8: { //权重规则
          0: '权重规则',
          1: '示例',
          2: '1. 每回合计算怪物当前血量，血量最低的设置初始血量为10，其他怪物为当前血量倍数*10',
          3: '2. 初始权重与下述各Buff权重相加',
          4: '3. 计算出最终权重，攻击权重最小的怪物',
          5: '4. 如果你对各Buff权重有特别见解，请务必',
          6: '告诉我'
        },
        9: { //掉落监测
          0: '掉落监测',
          1: '重置',
          2: '名称',
          3: '数目'
        },
        10: { //其他
          0: '反馈：',
          1: '当前状况：',
          2: '如果脚本长期暂停且网络无问题，请点击【临时修复】',
          3: '当前回合：',
          4: '总回合：',
          5: '各怪物及状况：',
          6: '尝试修复'
        }
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
        0: '战役模式：',
        'ar': '竞技场',
        'rb': '浴血擂台',
        'gr': '压榨界',
        'iw': '物品界',
        'ba': '遭遇战'
      },
      info: [
        '运行次数：',
        '回合：',
        '攻击模式：',
        '存活Boss：',
        '怪物：'
      ],
      notification: {
        'default': {
          title: '未知',
          text: '页面停留过长时间',
          time: 5
        },
        Error: {
          title: '错误',
          text: '某些错误发生了',
          time: 10
        },
        Failed: {
          title: '失败',
          text: '游戏失败\n玩家可自行查看战斗Log寻找失败原因',
          time: 5
        },
        Riddle: {
          title: '答题',
          text: '小马答题\n紧急！\n紧急！\n紧急！',
          time: 30
        },
        Win: {
          title: '胜利',
          text: '游戏胜利\n页面将在3秒后刷新',
          time: 3
        }
      },
      fightingStyle: {
        1: '二天一流',
        2: '单手',
        3: '双手',
        4: '双持',
        5: '法杖',
      },
      new : [
        '1. 感谢Koko191帮助翻译了英文版本',
        '2. 增加了武器技能'
      ],
    },
    { //繁體中文
      all: [
        '請設置hvAutoAttack',
        '是否繼續',
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
        '競技場開始',
        '請輸入配置',
        '如果您遭遇了Bug，請確認是否為最新版本（一些Bug可能在新版中被修復）\n如果你覺得腳本很棒，那就送作者1Hath作為感謝\n是否繼續打開網頁',
        '如果詢問是否允許，請選擇允許',
        '接下來將測試該音頻\n如果該音頻無法播放或無法載入，請替換\n請測試完成後再鍵入另一個音頻',
        '當前Stamina過低\n或Stamina損失過多\n導致腳本暫停',
        '請檢查高亮的輸入框是否填寫正確',
        '請檢查音頻文件的地址是否正確',
        '裝備損壞，請修復'
      ],
      option: {
        0: { //
          0: 'hvAutoAttack設置',
          1: '語言',
          2: '主要選項',
          3: '對自身技能',
          4: 'De技能',
          5: '其他技能',
          6: '捲軸',
          7: '魔藥',
          8: '警報',
          9: '權重規則',
          10: '掉落監測',
          11: '其他',
          12: '導出',
          13: '導入',
          14: '重置設置',
          15: '應用',
          16: '取消'
        },
        1: { //主要
          0: '0.使用Draught藥水\n1.使用寶石回复\n2.使用（技能、）Potion藥水回复\n3.使用Elixir藥水回复',
          1: '當技能與藥水CD時，使用<b>Last Elixir</b>',
          2: '<b>*攻擊模式</b>：',
          3: '<b>暫停相關</b>：',
          4: '使用按鈕；',
          5: '使用熱鍵：',
          6: '<b>技能施放條件</b>：',
          7: '中級：怪物存活數',
          8: '；高級：怪物存活數',
          9: '當OC',
          10: '且SP',
          11: '%，開啟<b>Spirit Stance</b>',
          12: '防止腳本莫名暫停',
          13: '頁面停留',
          14: '秒後，<b>警報</b>；',
          15: '秒後，<b>刷新頁面</b>。',
          16: '當<b>小馬</b>答題時間',
          17: '秒，如果輸入框為空則隨機生成答案。',
          18: '當Stamina＜',
          19: '時，腳本暫停並警報。',
          20: '在<b>任意頁面</b>停留',
          21: '秒後，開始競技場',
          22: '開啟',
          23: '減少頁面刷新，降低內存使用，感謝網友【zsp40088】提出',
          24: '答題單選',
          25: '開啟<b>掉落監測</b>，記錄裝備的最低品質',
          26: '開啟<b>音頻警報</b>；',
          27: '開啟<b>桌面通知</b>',
          28: '測試',
          29: '或損失Stamina≥',
          30: '重置競技場',
          31: '；選填，競技場對應的等級(以,分隔)：',
          32: '當裝備損壞時，警報。'
        },
        2: { //對自身技能
          0: '對自身技能',
          1: '施放條件（有一個成立就行）：',
          2: '1. 總回合數',
          3: '2. Boss存活數',
          4: '3. 遭遇戰中，怪物存活數',
          5: '增益技能',
          6: '（Buff不存在就施放的技能，按【施放順序】排序）：',
          7: '獲得Channel時',
          8: '，即施法只需1點MP，',
          9: '先ReBuff',
          10: '：buff存在≤',
          11: '回合時，重新使用該技能。',
          12: '再施放Channel技能',
          13: '（按【施放順序】排序）：'
        },
        3: { //De技能
          0: 'De技能',
          1: '（按【施放順序】排序）',
          2: '請選擇模式：',
          3: '0. 對所有怪施放',
          4: '1. 只對Boss施放'
        },
        4: { //其他技能
          0: '注：本標籤所有輸入框皆表示閾值<br>1. OC值 2. 怪獸存活數 3. Boss存活數',
          1: '其他技能（按【施放順序】排序）',
          2: '友情小馬炮：',
          3: '龍吼：',
          4: '請選擇戰鬥風格：',
          5: '1階：',
          6: '2階（如果有）：',
          7: '3階（如果有）：'
        },
        5: { //捲軸
          0: '使用捲軸',
          1: '總體條件：當前回合數',
          2: '存在技能生成的Buff時，仍然使用捲軸。',
          3: '當前回合數'
        },
        6: { //魔藥
          0: '使用魔藥：',
          1: '使用条件：当前回合数',
          2: '魔藥屬性與<a href="#hvAATab-Main">主要選項</a>裡的攻擊模式相同'
        },
        7: { //警报
          0: '自定義警報',
          1: '留空則使用默認音頻\n對於國內用戶，建議使用自定義音頻',
          2: '默認：',
          3: '錯誤：',
          4: '失敗：',
          5: '答題：',
          6: '勝利：',
        },
        8: { //權重規則
          0: '權重規則',
          1: '示例',
          2: '1. 每回合計算怪物當前血量，血量最低的設置初始血量為10，其他怪物為當前血量倍數*10',
          3: '2. 初始權重與下述各Buff權重相加',
          4: '3. 計算出最終權重，攻擊權重最小的怪物',
          5: '4. 如果你對各Buff權重有特別見解，請務必',
          6: '告訴我'
        },
        9: { //掉落監測
          0: '掉落監測',
          1: '重置',
          2: '名稱',
          3: '數目'
        },
        10: { //其他
          0: '反饋：',
          1: '當前狀況：',
          2: '如果腳本長期暫停且網絡無問題，請點擊【臨時修復】',
          3: '當前回合：',
          4: '總回合：',
          5: '各怪物及狀況：',
          6: '嘗試修復'
        }
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
        0: '戰役模式：',
        'ar': '競技場',
        'rb': '浴血擂台',
        'gr': '壓榨界',
        'iw': '物品界',
        'ba': '遭遇戰'
      },
      info: [
        '運行次數：',
        '回合：',
        '攻擊模式：',
        '存活Boss：',
        '怪物：'
      ],
      notification: {
        'default': {
          title: '未知',
          text: '頁面停留過長時間',
          time: 5
        },
        Error: {
          title: '錯誤',
          text: '某些錯誤發生了',
          time: 10
        },
        Failed: {
          title: '失敗',
          text: '遊戲失敗\n玩家可自行查看戰鬥Log尋找失敗原因',
          time: 5
        },
        Riddle: {
          title: '答題',
          text: '小馬答題\n緊急！\n緊急！\n緊急！',
          time: 30
        },
        Win: {
          title: '勝利',
          text: '遊戲勝利\n頁面將在3秒後刷新',
          time: 3
        }
      },
      fightingStyle: {
        1: '二天一流',
        2: '單手',
        3: '雙手',
        4: '雙持',
        5: '法杖',
      },
      new : [
        '1. 感謝Koko191幫助翻譯了英文版本',
        '2. 增加了武器技能'
      ],
    },
    { //English
      all: [
        'Please config this script',
        'Reset confirm?',
        'This is only a temporary workaround!\nIf the script is running properly, please press Cancel!\nContinue?',
        'Please select the attack mode',
        'hvAutoAttack version update, please reset\nIt is recommended to reset all configuration.\n\nWhat\'s new in this update\n',
        'Please set the font\nThe default font may make some functions fail to work\nIf you can not get the correct Overcharge value, Spirit Stance may not work\nDo you want to see instructions?',
        'hvAutoAttack Paused',
        'Continue',
        'Click [Try to fix]',
        'Pause',
        'Please enter a link, required',
        'Please enter a name, optional',
        'Please enter an icon, optional',
        'Reply success',
        'Arena start',
        'Please use a valid configuration',
        'If you encounter a bug, check if you have the latest version (it may have been fixed in recent updates)\nIf you think the script is great, send the author 1 Hath as a thank you\nContinue?',
        'Please allow to receive notifications if you are asked for permission',
        'The audio will be tested after you close this prompt\nIf the audio doesn\'t load or play, change the url',
        'Script paused\nYou either have too little Stamina or have lost too much',
        'Please check if the highlighted input boxes are filled in correctly',
        'Please check if the audio file address is correct',
        'Damaged equipments, please repair'
      ],
      option: {
        0: { //
          0: 'hvAutoAttack Configuration',
          1: 'Language',
          2: 'Main',
          3: 'Supportive Spells',
          4: 'Deprecating Spells',
          5: 'Other Spells',
          6: 'Scroll',
          7: 'Infusion',
          8: 'Alarm',
          9: 'Weight Rule',
          10: 'Drops Tracking',
          11: 'Others',
          12: 'Export',
          13: 'Import',
          14: 'Reset',
          15: 'Apply',
          16: 'Cancel'
        },
        1: { //main
          0: '0. Draughts\n1. Gems\n2. Potions (Or Cure/Full-Cure)\n3. Elixirs',
          1: 'Use <b>Last Elixir</b> if all spells and potions are still in countdown.',
          2: '<b>Attack Mode:</b>',
          3: '<b>Pause with: </b>',
          4: '[Pause] button;',
          5: 'Hotkey: ',
          6: '<b>Offensive Spells Conditions: </b>',
          7: '2nd Tier: Monsters alive ',
          8: '; 1st Tier: Monsters alive ',
          9: 'If OC ',
          10: ' and SP ',
          11: '%, activate <b>Spirit Stance</b>.',
          12: 'To prevent the script from stopping due to unforeseen problems',
          13: 'If the page stays idle for ',
          14: 's, <b>alarm</b>; ',
          15: 's, <b>reload page</b>.',
          16: 'If <b>riddle</b> ETR ',
          17: 's and no answer has been chosen yet, a random answer will be generated.',
          18: 'If Stamina left ≤',
          19: ', pause script and alarm.',
          20: 'Idle in <b>any page</b> for ',
          21: 's, start Arena',
          22: 'Use built-in ',
          23: 'Reduce page refresh, reduce memory usage, and significantly increase clear speed, credits to [zsp40088]',
          24: 'Visit link for more details',
          25: 'Turn on <b>Drops Tracking</b>; Minimum drop quality: ',
          26: 'Turn on <b>Alarms</b>; ',
          27: 'Turn on <b>Notifications</b>. ',
          28: 'Test',
          29: ' or Stamina lost ≥',
          30: 'Reset arena',
          31: '; Optional, input arena levels, separated by commas: ',
          32: 'Alarm when equipments are damaged.'
        },
        2: { //toSelf Skill
          0: 'Supportive Spells',
          1: 'Conditions (cast when at least 1 in 3 is satisfied)：',
          2: '1. Total number of turns ',
          3: '2. Number of bosses alive ',
          4: '3. Number of monsters alive ',
          5: 'Spells',
          6: ' (Cast or recast spells if the buff is not present, sorted in cast order):',
          7: 'During Channeling effect',
          8: ', which means 1mp spell cost and 150% spell damage, ',
          9: 'Recast if ',
          10: 'spell effect expires in ',
          11: ' turns.',
          12: 'These skills will be casted during Channeling effect',
          13: ' (sorted in cast order):'
        },
        3: { //DeSkill
          0: 'Deprecating Spells',
          1: ' (sort in cast order)',
          2: 'Spell targets: ',
          3: '0. All enemies',
          4: '1. Bosses only'
        },
        4: { //Other Spells
          0: 'Note: All input fields in this label indicate thresholds<br>1. OC value 2. Monster survival number 3. Boss survival number',
          1: 'Other Spells (Sort by cast order)',
          2: 'OFC: ',
          3: 'FUS: ',
          4: 'Please select the fighting style: ',
          5: 'T1: ',
          6: 'T2(if exist): ',
          7: 'T3(if exist): '
        },
        5: { //Scroll
          0: 'Use Scrolls',
          1: 'Conditions: Number of turns ',
          2: 'Use Scrolls even when there are effects from spells.',
          3: ': Number of turns '
        },
        6: { //Infusion
          0: 'Use Infusion:',
          1: 'Conditions: Number of turns ',
          2: ' The style of infusion is the same as Attack Mode in <a href="#hvAATab-Main">Main</a>'
        },
        7: { //Alarm
          0: 'Alarm',
          1: 'Leave the box blank to use default audio\nFor Chinese users, it\'s recommended to use custom audio',
          2: 'Default: ',
          3: 'Error: ',
          4: 'Defeat: ',
          5: 'Riddle: ',
          6: 'Victory: ',
        },
        8: { //Weight Rule
          0: 'Weight Rule',
          1: 'Example',
          2: '1. Each monster is assigned a number which is used to determine the target to attack, let\'s call that number Priority Weight or PW.',
          3: '2. PW(X) = 10 * Max_HP(X) / Min(Max_HP(All_monsters)) + Accumulated_Weight_of_Deprecating_Spells_In_Effect(X)',
          4: '3. Whichever monster has the lowest PW will be the target.',
          5: 'If you have any suggestions, please ',
          6: 'let me know.'
        },
        9: { //Drop monitoring
          0: 'Drops Tracking',
          1: 'Reset',
          2: 'name',
          3: 'number'
        },
        10: { //other
          0: 'Feedback: ',
          1: 'Current status: ',
          2: 'If the script does not work and you are sure that it\'s not because of your internet, click [Try to fix]',
          3: 'Current round: ',
          4: 'Total rounds: ',
          5: 'Current battle info: ',
          6: 'Try to fix'
        },
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
        0: 'Battle type: ',
        'ar': 'The Arena',
        'rb': 'Ring of Blood',
        'gr': 'GrindFest',
        'iw': 'Item World',
        'ba': 'Random Encounter'
      },
      info: [
        'Turns: ',
        'Round: ',
        'Mode: ',
        'Bosses: ',
        'Monsters: '
      ],
      notification: {
        'default': {
          title: 'unknown',
          text: 'The page stays idle for too long',
          time: 5
        },
        Error: {
          title: 'Error',
          text: 'Some errors have occurred',
          time: 10
        },
        Failed: {
          title: 'Defeated',
          text: 'You have been defeated.\nYou can check the battle log.',
          time: 5
        },
        Riddle: {
          title: 'Riddle',
          text: 'Riddle\nURGENT\nURGENT\nURGENT',
          time: 30
        },
        Win: {
          title: 'Victory',
          text: 'You\'re victorious.\nThis page will refresh in 3 seconds.',
          time: 3
        }
      },
      fightingStyle: {
        1: 'Niten Ichiryu',
        2: 'One-Handed',
        3: '2-Handed Weapon',
        4: 'Dual Wielding',
        5: 'Staff'
      },
      new : [
        '1. Thanks to Koko191 help to translate the English version',
        '2. add weapon skills'
      ],
    }
  ];
  g('lang', packs[lang]);
  optionBox();
  gE('select[name=lang]').value = lang;
}
function addStyle() {
  var globalStyle = cE('style');
  globalStyle.innerHTML = '' +
  '.stuffbox{height:auto!important;}' +
  '.hvAALog{font-size:20px;}' +
  '.hvAAButton{top:4px;left:' + (gE('.stuffbox').offsetWidth - 24 - 50) + 'px;position:absolute;z-index:9999;cursor:pointer;}' +
  '#hvAABox{left:' + (gE('body').offsetWidth / 2 - 350) + 'px;top:50px;font-size:12pt!important;z-index:9999;width:700px;height:510px;display:none;position:absolute;text-align:justify;background-color:white;border:4px solid black;border-radius:10px;}' +
  '#hvAABox .hvAACenter{text-align:center;}' +
  '#hvAABox .hvAASeparate{height:1px;background-color:black;}' +
  '#hvAABox .hvAATitle{font-weight:bolder;font-size:larger;}' +
  '.hvAATablist{position:relative;left:14px;}' +
  '.hvAATabmenu{position:absolute;left:-9px;}' +
  '.hvAATabmenu>span>a{display:block;padding:5px 10px;margin:0 10px 0 0;border:1px solid #91a7b4;border-radius:5px;background-color:#E3F1F8;color:black;text-decoration:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}' +
  '.hvAATabmenu>span:hover{z-index:999999!important;left:-5px;position:relative;font-size:large;}' +
  '.hvAATab{position:absolute;width:605px;height:400px;left:36px;padding:15px;border:1px solid #91A7B4;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,0.1);font-size:14pt;color:#666;background:#FFF;overflow:auto;}' +
  '.hvAATab a{margin:0 2px;}' +
  '.hvAATab b{font-family:"Times New Roman",Georgia,Serif;font-size:20px;}' +
  '.hvAATab:target{z-index:1!important;}' +
  '.hvAATab input[type=text]{width:24px;}' +
  '.hvAATab label{cursor:pointer;}' +
  '.hvAATab table{font-size:smaller;border:2px solid black;border-collapse:collapse;}' +
  '.hvAATab table>tbody>tr>*{border:1px solid black;}' +
  '.hvAAOptionBoxButton{position:relative;top:440px;}' +
  '.hvAAOptionBoxButton>button{margin:0 1px;}' +
  'button{border-radius:3px;border:2px solid gray;}' +
  '.hvAANew{width:25px;height:25px;float:left;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAMCAYAAACX8hZLAAAAcElEQVQ4jbVRSQ4AIQjz/59mTiZIF3twmnCwFAq4FkeFXM+5vCzohYxjPMtfxS8CN6iqQ7TfE0wrODxVbzJNgoaTo4CmbBO1ZWICouQ0DHaL259MEzaU+w8pZOdSjcUgaPJDHCbO0A2kuAiuwPGQ+wBms12x8HExTwAAAABJRU5ErkJggg==) no-repeat;background-position:center;}' +
  '.siteBar{position:absolute;top:100px;left:' + (gE('.stuffbox').offsetWidth + 2) + 'px;font-size:12pt;text-align:left;}' +
  '.siteBar>span{display:block;}' +
  '.siteBar>span>a{text-decoration:none;}' +
  '.favicon{width:16px;height:16px;margin:-3px 1px;border:1px solid black;border-radius:3px;}' +
  '.answerBar{z-index:1000;width:710px;height:40px;position:absolute;top:50px;left:345px;display:table;border-spacing:5px;}' +
  '.answerBar>div{border:4px solid red;display:table-cell;cursor:pointer;}' +
  '.answerBar>div:hover{background:rgba(63,207,208,0.20);}' +
  '#hvAATab-Alarm input[type=text]{width:512px;}' +
  '.testAlarms>div{border:2px solid black;}' +
  '.hvAABorder{border:1px solid gray;}';
  gE('head').appendChild(globalStyle);
}
function optionBox() { //配置界面
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
  '<div class="hvAACenter"><h1 style="display:inline;">' + g('lang').option[0][0] + '</h1><div style="float:right;">' + g('lang').option[0][1] + '<select name="lang"><option value="0">简体中文</option><option value="1">繁體中文</option><option value="2">English</option></select></div></div><div class="hvAATablist">' +
  '<div class="hvAATabmenu"><span><a href="#hvAATab-Main">' + g('lang').option[0][2] + '</a></span><span><a href="#hvAATab-Self">' + g('lang').option[0][3] + '</a></span><span><a href="#hvAATab-Debuff">' + g('lang').option[0][4] + '</a></span><span><a href="#hvAATab-Skill">' + g('lang').option[0][5] + '</a></span><span><a href="#hvAATab-Scroll">' + g('lang').option[0][6] + '</a></span><span><a href="#hvAATab-Infusion">' + g('lang').option[0][7] + '</a></span><span><a href="#hvAATab-Alarm">' + g('lang').option[0][8] + '</a></span><span><a href="#hvAATab-Rule">' + g('lang').option[0][9] + '</a></span><span class="hvAAShowDrop"><a href="#hvAATab-Drop">' + g('lang').option[0][10] + '</a></span><span class="hvAAShowOther"><a href="#hvAATab-Other">' + g('lang').option[0][11] + '</a></span></div>' +
  '<div id="hvAATab-Main"class="hvAATab"style="z-index:1;"><div class="hvAACenter hvAABorder"title="' + g('lang').option[1][0] + '"><span style="color:green;">HP: 0. <input name="hp0"placeholder="95"type="text">% 1. <input name="hp1"placeholder="50"type="text">% 2. <input name="hp2"placeholder="50"type="text">% 3. <input name="hp3"placeholder="5"type="text">% </span><br><span style="color:blue;">MP: 0. <input name="mp0"placeholder="95"type="text">% 1. <input name="mp1"placeholder="70"type="text">% 2. <input name="mp2"placeholder="10"type="text">% 3. <input name="mp3"placeholder="5"type="text">% </span><br><span style="color:red;">SP: 0. <input name="sp0"placeholder="95"type="text">% 1. <input name="sp1"placeholder="75"type="text">% 2. <input name="sp2"placeholder="50"type="text">% 3. <input name="sp3"placeholder="5"type="text">% </span><br><input id="lastElixir"type="checkbox"><label for="lastElixir">' + g('lang').option[1][1] + '</div><div id="attackStatus"class="hvAACenter"style="color:red;">' + g('lang').option[1][2] + '<input type="radio"id="aS0"name="attackStatus"value="0"><label for="aS0">' + g('lang').status[0] + '</label><input type="radio"id="aS1"name="attackStatus"value="1"><label for="aS1">' + g('lang').status[1] + '</label><input type="radio"id="aS2"name="attackStatus"value="2"><label for="aS2">' + g('lang').status[2] + '</label><input type="radio"id="aS3"name="attackStatus"value="3"><label for="aS3">' + g('lang').status[3] + '</label><input type="radio"id="aS4"name="attackStatus"value="4"><label for="aS4">' + g('lang').status[4] + '</label><input type="radio"id="aS5"name="attackStatus"value="5"><label for="aS5">' + g('lang').status[5] + '</label><input type="radio"id="aS6"name="attackStatus"value="6"><label for="aS6">' + g('lang').status[6] + '</label></div><div>' + g('lang').option[1][3] + '<input id="pauseButton"type="checkbox"><label for="pauseButton">' + g('lang').option[1][4] + '</label><input id="pauseHotkey"type="checkbox"><label for="pauseHotkey">' + g('lang').option[1][5] + '<input name="pauseHotkeyStr"placeholder="A"type="text"> <input name="pauseHotkeyCode"placeholder="65"type="text"disabled="true"></label></div><div>' + g('lang').option[1][6] + g('lang').option[1][7] + '≥<input name="middleSkill"placeholder="3"type="text">' + g('lang').option[1][8] + '≥<input name="highSkill"placeholder="5"type="text"></div><div><input id="spiritStance"type="checkbox"><label for="spiritStance">' + g('lang').option[1][9] + '≥<input name="spiritStance_oc"placeholder="50"type="text">' + g('lang').option[1][10] + '≥<input name="spiritStance_sp"placeholder="80"type="text">' + g('lang').option[1][11] + '</label></div><div title="' + g('lang').option[1][12] + '"><input id="delayAlert"type="checkbox"><label for="delayAlert">' + g('lang').option[1][13] + '<input name="delayAlertTime"placeholder="10"type="text">' + g('lang').option[1][14] + '</label><input id="delayReload"type="checkbox"><label for="delayReload">' + g('lang').option[1][13] + '<input name="delayReloadTime"placeholder="15"type="text">' + g('lang').option[1][15] + '</label></div><div><input id="riddleAnswer"type="checkbox"><label for="riddleAnswer">' + g('lang').option[1][16] + '≤<input name="riddleAnswerTime"placeholder="3"type="text">' + g('lang').option[1][17] + '</label></div><div><input id="stamina"type="checkbox"><label for="stamina">' + g('lang').option[1][18] + '<input name="staminaNow"placeholder="30"type="text">' + g('lang').option[1][29] + '<input name="staminaLose"placeholder="5"type="text">' + g('lang').option[1][19] + '</label></div><div class="hvAABorder"><input id="autoArena"type="checkbox"><label for="autoArena">' + g('lang').option[1][20] + '<input name="autoArenaTime"placeholder="60"type="text">' + g('lang').option[1][21] + '<button class="autoArenaReset">' + g('lang').option[1][30] + '</button>' + g('lang').option[1][31] + '<input name="autoArenaLevels"check="^[\\d,]+$"type="text"style="width:390px;"></label></div><div><input id="reloader"type="checkbox"><label for="reloader">' + g('lang').option[1][22] + '<a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=2660&p=4384894&#entry4384894"target="_blank"title="' + g('lang').option[1][23] + '">Reloader</a></label><input id="riddleRadio"type="checkbox"><label for="riddleRadio">' + g('lang').option[1][22] + '<a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=1020&p=3000982&#entry3000982"target="_blank"title="' + g('lang').option[1][24] + '">RiddleLimiter Plus</a></label></div><div><input id="dropMonitor"type="checkbox"><label for="dropMonitor">' + g('lang').option[1][25] + '<select name="dropQuality"><option value="0">Crude</option><option value="1">Fair</option><option value="2">Average</option><option value="3">Superior</option><option value="4">Exquisite</option><option value="5">Magnificent</option><option value="6">Legendary</option><option value="7">Peerless</option></select></label></div><div><input id="alert"type="checkbox"><label for="alert">' + g('lang').option[1][26] + '</label><input id="notification"type="checkbox"><label for="notification">' + g('lang').option[1][27] + '</label><button class="testNotification">' + g('lang').option[1][28] + '</button></div><div></div><input id="damageAlert"type="checkbox"><label for="damageAlert">' + g('lang').option[1][32] + '</label></div>' +
  '<div id="hvAATab-Self"class="hvAATab"><input type="checkbox"id="buffSkill"><label for="buffSkill"><span class="hvAATitle">' + g('lang').option[2][0] + '</span></label><br>' + g('lang').option[2][1] + '<br>' + g('lang').option[2][2] + '≥<input name="buffSkillAllRound"placeholder="12"type="text"><br>' + g('lang').option[2][3] + '≥<input name="buffSkillBoss"placeholder="1"type="text"><br>' + g('lang').option[2][4] + '≥<input name="buffSkillMonster"placeholder="6"type="text"><br><b>' + g('lang').option[2][5] + '</b>' + g('lang').option[2][6] + '<br><input type="checkbox"id="buffSkill_HD"><label for="buffSkill_HD">Health Draught</label><input type="checkbox"id="buffSkill_MD"><label for="buffSkill_MD">Mana Draught</label><input type="checkbox"id="buffSkill_SD"><label for="buffSkill_SD">Spirit Draught</label><br><input type="checkbox"id="buffSkill_Pr"><label for="buffSkill_Pr">Protection</label><input type="checkbox"id="buffSkill_SL"><label for="buffSkill_SL">Spark of Life</label><input type="checkbox"id="buffSkill_SS"><label for="buffSkill_SS">Spirit Shield</label><input type="checkbox"id="buffSkill_Ha"><label for="buffSkill_Ha">Haste</label><br><input type="checkbox"id="buffSkill_AF"><label for="buffSkill_AF">Arcane Focus</label><input type="checkbox"id="buffSkill_He"><label for="buffSkill_He">Heartseeker</label><input type="checkbox"id="buffSkill_Re"><label for="buffSkill_Re">Regen</label><input type="checkbox"id="buffSkill_SV"><label for="buffSkill_SV">Shadow Veil</label><input type="checkbox"id="buffSkill_Ab"><label for="buffSkill_Ab">Absorb</label><div></div><b>' + g('lang').option[2][7] + '</b>' + g('lang').option[2][8] + '<br><b>' + g('lang').option[2][9] + '</b>' + g('lang').option[2][10] + '<input name="channelReBuff"placeholder="20"type="text">' + g('lang').option[2][11] + '<br><b>' + g('lang').option[2][12] + '</b>' + g('lang').option[2][13] + '<br><input type="checkbox"id="channelSkill_Pr"><label for="channelSkill_Pr">Protection</label><input type="checkbox"id="channelSkill_SL"><label for="channelSkill_SL">Spark of Life</label><input type="checkbox"id="channelSkill_SS"><label for="channelSkill_SS">Spirit Shield</label><input type="checkbox"id="channelSkill_Ha"><label for="channelSkill_Ha">Haste</label><br><input type="checkbox"id="channelSkill_AF"><label for="channelSkill_AF">Arcane Focus</label><input type="checkbox"id="channelSkill_He"><label for="channelSkill_He">Heartseeker</label><input type="checkbox"id="channelSkill_Re"><label for="channelSkill_Re">Regen</label><input type="checkbox"id="channelSkill_SV"><label for="channelSkill_SV">Shadow Veil</label><input type="checkbox"id="channelSkill_Ab"><label for="channelSkill_Ab">Absorb</label></div>' +
  '<div id="hvAATab-Debuff"class="hvAATab"><input type="checkbox"id="debuffSkill"><label for="debuffSkill"><span class="hvAATitle">' + g('lang').option[3][0] + '</span>' + g('lang').option[3][1] + '</label><br>' + g('lang').option[3][2] + '<select name="debuffSkillMode"><option value="0">' + g('lang').option[3][3] + '</option><option value="1">' + g('lang').option[3][4] + '</option></select><br><input type="checkbox"id="debuffSkill_Im"><label for="debuffSkill_Im">Imperil</label><input type="checkbox"id="debuffSkill_MN"><label for="debuffSkill_MN">MagNet</label><input type="checkbox"id="debuffSkill_Si"><label for="debuffSkill_Si">Silence</label><input type="checkbox"id="debuffSkill_Dr"><label for="debuffSkill_Dr">Drain</label><input type="checkbox"id="debuffSkill_We"><label for="debuffSkill_We">Weaken</label><input type="checkbox"id="debuffSkill_Co"><label for="debuffSkill_Co">Confuse</label></div>' +
  '<div id="hvAATab-Skill"class="hvAATab"><div class="hvAANew"></div>' + g('lang').option[4][0] + '<br><input id="skill"type="checkbox"><label for="skill"><span class="hvAATitle">' + g('lang').option[4][1] + '</span></label><br><input id="skill_OFC"type="checkbox"><label for="skill_OFC">' + g('lang').option[4][2] + '</label><input name="skillOC_OFC"placeholder="210"type="text"><input name="skillMonster_OFC"placeholder="8"type="text"><input name="skillBoss_OFC"placeholder="1"type="text"><br><input id="skill_FUS"type="checkbox"><label for="skill_FUS">' + g('lang').option[4][3] + '</label><input name="skillOC_FUS"placeholder="110"type="text"><input name="skillMonster_FUS"placeholder="8"type="text"><input name="skillBoss_FUS"placeholder="1"type="text"><br>' + g('lang').option[4][4] + '<select name="fightingStyle"><option value="1">' + g('lang').fightingStyle[1] + '</option><option value="2">' + g('lang').fightingStyle[2] + '</option><option value="3">' + g('lang').fightingStyle[3] + '</option><option value="4">' + g('lang').fightingStyle[4] + '</option><option value="5">' + g('lang').fightingStyle[5] + '</option></select><br><input id="skill_3"type="checkbox"><label for="skill_3">' + g('lang').option[4][7] + '</label><input name="skillOC_3"type="text"><input name="skillMonster_3"type="text"><input name="skillOCBoss_3"type="text"><br><input id="skill_2"type="checkbox"><label for="skill_2">' + g('lang').option[4][6] + '</label><input name="skillOC_2"type="text"><input name="skillMonster_2"type="text"><input name="skillOCBoss_2"type="text"><br><input id="skill_1"type="checkbox"><label for="skill_1">' + g('lang').option[4][5] + '</label><input name="skillOC_1"type="text"><input name="skillMonster_1"type="text"><input name="skillOCBoss_1"type="text"></div>' +
  '<div id="hvAATab-Scroll"class="hvAATab"><input type="checkbox"id="scroll"><label for="scroll"><span class="hvAATitle">' + g('lang').option[5][0] + '</span></label><br>' + g('lang').roundType[0] + '<input type="checkbox"id="scrollRoundType_ar"><label for="scrollRoundType_ar">' + g('lang').roundType['ar'] + '</label><input type="checkbox"id="scrollRoundType_rb"><label for="scrollRoundType_rb">' + g('lang').roundType['rb'] + '</label><input type="checkbox"id="scrollRoundType_gr"><label for="scrollRoundType_gr">' + g('lang').roundType['gr'] + '</label><input type="checkbox"id="scrollRoundType_iw"><label for="scrollRoundType_iw">' + g('lang').roundType['iw'] + '</label><input type="checkbox"id="scrollRoundType_ba"><label for="scrollRoundType_ba">' + g('lang').roundType['ba'] + '</label><br>' + g('lang').option[5][1] + '≥<input name="scrollRoundNow"placeholder="100"type="text">。<br><input id="scrollFirst"type="checkbox"><label for="scrollFirst">' + g('lang').option[5][2] + '</label><br><input type="checkbox"id="scroll_Go"><label for="scroll_Go">Scroll of the Gods ' + g('lang').option[5][3] + '≥<input name="scrollRound_Go"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Av"><label for="scroll_Av">Scroll of the Avatar ' + g('lang').option[5][3] + '≥<input name="scrollRound_Av"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Pr"><label for="scroll_Pr">Scroll of Protection ' + g('lang').option[5][3] + '≥<input name="scrollRound_Pr"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Sw"><label for="scroll_Sw">Scroll of Swiftness ' + g('lang').option[5][3] + '≥<input name="scrollRound_Sw"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Li"><label for="scroll_Li">Scroll of Life ' + g('lang').option[5][3] + '≥<input name="scrollRound_Li"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Sh"><label for="scroll_Sh">Scroll of Shadows ' + g('lang').option[5][3] + '≥<input name="scrollRound_Sh"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Ab"><label for="scroll_Ab">Scroll of Absorption ' + g('lang').option[5][3] + '≥<input name="scrollRound_Ab"placeholder="0"type="text"></label></div>' +
  '<div id="hvAATab-Infusion"class="hvAATab"><input type="checkbox"id="infusion"><label for="infusion"><span class="hvAATitle">' + g('lang').option[6][0] + '</span>' + g('lang').option[6][2] + '</label><br>' + g('lang').roundType[0] + '<input type="checkbox"id="infusionRoundType_ar"><label for="infusionRoundType_ar">' + g('lang').roundType['ar'] + '</label><input type="checkbox"id="infusionRoundType_rb"><label for="infusionRoundType_rb">' + g('lang').roundType['rb'] + '</label><input type="checkbox"id="infusionRoundType_gr"><label for="infusionRoundType_gr">' + g('lang').roundType['gr'] + '</label><input type="checkbox"id="infusionRoundType_iw"><label for="infusionRoundType_iw">' + g('lang').roundType['iw'] + '</label><input type="checkbox"id="infusionRoundType_ba"><label for="infusionRoundType_ba">' + g('lang').roundType['ba'] + '</label><br>' + g('lang').option[6][1] + '≥<input name="infusionRoundNow"placeholder="100"type="text">。</div>' +
  '<div id="hvAATab-Alarm"class="hvAATab"title="' + g('lang').option[7][1] + '"><span class="hvAATitle">' + g('lang').option[7][0] + '</span><br>' + g('lang').option[7][2] + '<input name="audio-default"type="text"><br>' + g('lang').option[7][3] + '<input name="audio-Error"type="text"><br>' + g('lang').option[7][4] + '<input name="audio-Failed"type="text"><br>' + g('lang').option[7][5] + '<input name="audio-Riddle"type="text"><br>' + g('lang').option[7][6] + '<input name="audio-Win"type="text"><div class="testAlarms"></div></div>' +
  '<div id="hvAATab-Rule"class="hvAATab"><span class="hvAATitle">' + g('lang').option[8][0] + '</span> <a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md#权重规则"target="_blank">' + g('lang').option[8][1] + '</a><br>' + g('lang').option[8][2] + '<br>' + g('lang').option[8][3] + '<br>Sleep:<input name="weight_Sle"placeholder="+5"type="text"> Blind:<input name="weight_Bl"placeholder="+3"type="text"> Slow:<input name="weight_Slo"placeholder="+3"type="text"> Imperil:<input name="weight_Im"placeholder="-5"type="text"> Coalesced Mana:<input name="weight_CM"placeholder="-5"type="text"><br>MagNet:<input name="weight_MN"placeholder="-4"type="text"> Silence:<input name="weight_Si"placeholder="-4"type="text"> Drain:<input name="weight_Dr"placeholder="-4"type="text"> Weaken:<input name="weight_We"placeholder="-4"type="text"> Confuse:<input name="weight_Co"placeholder="-1"type="text"><br>' + g('lang').option[8][4] + '<br>' + g('lang').option[8][5] + '<a href="#hvAATab-Other">' + g('lang').option[8][6] + '</a></div>' +
  '<div id="hvAATab-Drop"class="hvAATab"><span class="hvAATitle">' + g('lang').option[9][0] + '</span><button class="reMonitor">' + g('lang').option[9][1] + '</button></div>' +
  '<div id="hvAATab-Other"class="hvAATab"><span class="hvAAFeedback">' + g('lang').option[10][0] + '<a href="https://github.com/dodying/UserJs/issues/"target="_blank">1. GitHub</a><a href="https://greasyfork.org/scripts/18482/feedback"target="_blank">2. GreasyFork</a><a href="http://e-hentai.org/dmspublic/karma.php?u=2565471"target="_blank">3. +K</a><a href="https://gitter.im/dodying/UserJs"target="_blank">4. Gitter</a></span><div class="hvAASeparate"></div><div class="hvAACenter"><span class="hvAATitle">' + g('lang').option[10][1] + '</span><br>' + g('lang').option[10][2] + '<br>' + g('lang').roundType[0] + '<select class="hvAADebug"name="roundType"><option></option><option value="ar">' + g('lang').roundType['ar'] + '</option><option value="rb">' + g('lang').roundType['rb'] + '</option><option value="gr">' + g('lang').roundType['gr'] + '</option><option value="iw">' + g('lang').roundType['iw'] + '</option><option value="ba">' + g('lang').roundType['ba'] + '</option></select><br>' + g('lang').option[10][3] + '<input name="roundNow"class="hvAADebug"type="text"placeholder="1"> ' + g('lang').option[10][4] + '<input name="roundAll"class="hvAADebug"type="text"placeholder="1"><br><b>' + g('lang').option[10][5] + '</b><div id="hvAAFixMonster"></div><button class="hvAAFix">' + g('lang').option[10][6] + '</button></div></div>' +
  '</div><div class="hvAAOptionBoxButton hvAACenter"><button class="hvAAOptionExport">' + g('lang').option[0][12] + '</button><button class="hvAAOptionImport">' + g('lang').option[0][13] + '</button><button class="hvAAOptionReset">' + g('lang').option[0][14] + '</button><button class="optionApply">' + g('lang').option[0][15] + '</button><button class="optionCancel">' + g('lang').option[0][16] + '</button></div>';
  gE('.hvAAShowDrop', optionBox).onclick = function () {
    var drop = getValue('drop', true) || new Object();
    var _html = '<tbody><tr><td>' + g('lang').option[9][2] + '</td><td>' + g('lang').option[9][3] + '</td></tr>';
    for (var i in drop) {
      _html += '<tr><td>' + i + '</td><td>' + drop[i] + '</td></tr>';
    }
    _html += '</tbody>';
    var table = cE('table');
    table.innerHTML = _html;
    gE('#hvAATab-Drop').appendChild(table);
    this.onclick = null;
  }
  gE('.hvAAShowOther', optionBox).onclick = function () {
    var inputs = gE('.hvAADebug', 'all', optionBox);
    for (var i = 0; i < inputs.length; i++) {
      if (getValue(inputs[i].name)) inputs[i].value = getValue(inputs[i].name);
    }
    if (getValue('monsterStatus')) {
      var monsterStatus = getValue('monsterStatus', true);
      for (var i = 0; i < monsterStatus.length; i++) {
        var span = cE('span');
        span.innerHTML = 'id:' + monsterStatus[i].id + ' <input name="monsterStatus_' + i + '_HP"class="hvAADebug"type="text"style="width:60px;"><br>';
        gE('input', span).value = monsterStatus[i].hp;
        gE('#hvAAFixMonster', optionBox).appendChild(span);
      }
    }
    this.onclick = null;
  }
  gE('input[name=pauseHotkeyStr]', optionBox).onkeyup = function (e) {
    this.value = (e.keyCode >= 65 && e.keyCode <= 90) ? e.key.toUpperCase()  : e.key;
    gE('input[name=pauseHotkeyCode]', optionBox).value = e.keyCode;
  }
  gE('.autoArenaReset', optionBox).onclick = function () {
    if (confirm(g('lang').all[1])) {
      delValue('arena');
    }
  }
  gE('.testNotification', optionBox).onclick = function () {
    alert(g('lang').all[17]);
    setNotice('testTitle', 'testBody', 3);
  }
  var alarms = gE('input[name^="audio"]', 'all', optionBox);
  for (var i = 0; i < alarms.length; i++) {
    alarms[i].onchange = function () {
      if (this.value === '') return;
      if (!/^http(s)?:|^ftp:/.test(this.value)) {
        alert(g('lang').all[21]);
        return;
      }
      alert(g('lang').all[18]);
      var box = cE('div');
      box.innerHTML = this.value;
      var audio = cE('audio');
      audio.controls = true;
      audio.src = this.value;
      box.appendChild(audio);
      gE('.testAlarms').appendChild(box);
      audio.play();
    }
  }
  gE('.hvAAFeedback', optionBox).onclick = function (e) {
    if (e.target.tagName !== 'A') return;
    e.preventDefault();
    if (confirm(g('lang').all[16])) window.open(e.target.href);
  }
  gE('.reMonitor', optionBox).onclick = function () {
    if (confirm(g('lang').all[1])) {
      delValue('drop');
    }
  }
  gE('.hvAAFix', optionBox).onclick = function () {
    if (confirm(g('lang').all[2])) {
      var inputs = gE('.hvAADebug[name^="round"]', 'all', optionBox);
      for (var i = 0; i < inputs.length; i++) {
        setValue(inputs[i].name, inputs[i].value || inputs[i].placeholder);
      }
      var monsterStatus = new Array();
      var inputs = gE('#hvAAFixMonster input.hvAADebug', 'all', optionBox);
      for (var i = 0; i < gE('div.btm1', 'all').length; i++) {
        monsterStatus.push({
          'id': i + 1,
          'hp': (inputs[i]) ? inputs[i].value : '100000'
        });
      }
      setValue('monsterStatus', monsterStatus);
      reload();
    }
  }
  gE('.hvAAOptionExport', optionBox).onclick = function () {
    var textarea = cE('textarea');
    textarea.style.width = '100%';
    textarea.value = getValue('option');
    textarea.onclick = function () {
      this.select();
    }
    textarea.oncopy = function () {
      setTimeout(function () {
        textarea.parentNode.removeChild(textarea);
      }, 100);
    }
    textarea.oncut = function () {
      setTimeout(function () {
        textarea.parentNode.removeChild(textarea);
      }, 100);
    }
    gE('.stuffbox').appendChild(textarea);
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  gE('.hvAAOptionImport', optionBox).onclick = function () {
    var option = prompt(g('lang').all[15]);
    if (!option) return;
    if (confirm(g('lang').all[1])) setValue('option', option);
  }
  gE('.hvAAOptionReset', optionBox).onclick = function () {
    if (confirm(g('lang').all[1])) {
      delValue('option');
      reload();
    }
  }
  gE('.optionApply', optionBox).onclick = function () {
    function highlight(ele, time) {
      gE(ele, optionBox).style.border = '1px solid red';
      setTimeout(function () {
        gE(ele, optionBox).style.border = '';
      }, time * 1000);
    }
    if (!gE('input[name=attackStatus]:checked', optionBox)) {
      alert(g('lang').all[3]);
      highlight('#attackStatus', 0.5);
      return;
    }
    var _option = new Object();
    _option.version = (GM_info) ? GM_info.script.version.substring(0, 4)  : 1;
    var inputs = gE('input,select', 'all', optionBox);
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].className === 'hvAADebug') continue;
      if (inputs[i].type === 'text') {
        if (inputs[i].outerHTML.match(/check="(.*?)"/)) {
          if (new RegExp(inputs[i].outerHTML.match(/check="(.*?)"/) [1]).test(inputs[i].value) || inputs[i].value === '') {
            _option[inputs[i].name] = inputs[i].value || inputs[i].placeholder;
          } else {
            alert(g('lang').all[20]);
            highlight(inputs[i], 10);
            return;
          }
        } else {
          _option[inputs[i].name] = inputs[i].value || inputs[i].placeholder;
        }
      } else if (inputs[i].type === 'checkbox') {
        _option[inputs[i].id] = inputs[i].checked;
      } else if ((inputs[i].type === 'radio' && inputs[i].checked) || inputs[i].type === 'select-one') {
        _option[inputs[i].name] = inputs[i].value;
      }
    }
    setValue('option', _option);
    optionBox.style.display = 'none';
    reload();
  }
  gE('.optionCancel', optionBox).onclick = function () {
    optionBox.style.display = 'none';
  }
  gE('body').appendChild(optionBox);
  if (getValue('option')) {
    var _option = getValue('option', true);
    var inputs = gE('input,select', 'all', optionBox);
    for (var i = 0; i < inputs.length; i++) {
      if (_option[inputs[i].name] || _option[inputs[i].id]) {
        if (inputs[i].type === 'text' || inputs[i].type === 'select-one') {
          inputs[i].value = _option[inputs[i].name];
        } else if (inputs[i].type === 'checkbox') {
          inputs[i].checked = _option[inputs[i].id];
        } else if (inputs[i].type === 'radio') {
          (_option[inputs[i].name] === inputs[i].value) ? inputs[i].checked = true : inputs[i].checked = false;
        }
      }
    }
  }
}
function riddleAlert() { //答题警报
  var riddleImg = gE('#riddleform>div:nth-child(3)>img');
  riddleImg.title = riddleImg.src;
  riddleImg.style.width = '700px';
  gE('#riddleform+div').onmouseover = function () {
    riddleImg.src = '/pages/ponychart.jpg';
  }
  gE('#riddleform+div').onmouseout = function () {
    riddleImg.src = riddleImg.title;
  }
  setAlert('Riddle', 'loop');
  document.onkeydown = function (e) {
    gE('#hvAAAlert').parentNode.removeChild(gE('#hvAAAlert'));
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
  button.innerHTML = g('lang').all[9];
  button.className = 'pauseChange';
  button.onclick = function () {
    pauseChange();
  }
  gE('.clb').insertBefore(button, gE('.clb>.cbl'));
}
function pauseHotkey() { //暂停热键
  document.addEventListener('keydown', function pause(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.keyCode === parseInt(g('option').pauseHotkeyCode)) {
      pauseChange();
      if (!g('option').reloader) document.removeEventListener('keydown', pause, false);
    }
  }, false);
}
function pauseChange() { //暂停状态更改
  if (getValue('disabled')) {
    gE('.pauseChange').innerHTML = g('lang').all[9];
    delValue(0);
    main();
  } else {
    gE('.pauseChange').innerHTML = g('lang').all[7];
    setValue('disabled', true);
    g('end', true);
  }
}
function quickSite() { //快捷站点
  var siteBar = cE('div');
  siteBar.className = 'siteBar';
  siteBar.innerHTML = '<span><a href="javascript:void()"class="siteBarToggle">&lt;&lt;</a></span><span><a href="http://tieba.baidu.com/f?kw=hv网页游戏"target="_blank"><img src="https://www.baidu.com/favicon.ico" class="favicon"></img>贴吧</a></span><span><a href="https://forums.e-hentai.org/index.php?showforum=76"target="_blank"><img src="https://forums.e-hentai.org/favicon.ico" class="favicon"></img>Forums</a></span>';
  if (getValue('quickSite')) {
    var quickSite = getValue('quickSite', true);
    for (var i = 0; i < quickSite.length; i++) {
      siteBar.innerHTML += '<span><a href="' + quickSite[i].url + '"target="_blank">' + ((quickSite[i].fav) ? '<img src="' + quickSite[i].fav + '"class="favicon"></img>' : '') + quickSite[i].name + '</a></span>';
    }
  }
  siteBar.innerHTML += '<span><a href="javascript:void()"class="siteBarReset">Reset</a></span><span><a href="javascript:void()"class="siteBarPlus">+++</a></span>';
  gE('.siteBarToggle', siteBar).onclick = function () {
    var spans = gE('span', 'all', siteBar);
    for (var i = 1; i < spans.length; i++) {
      spans[i].style.display = (this.innerText === '<<') ? 'none' : 'block';
    }
    this.innerText = (this.innerText === '<<') ? '>>' : '<<';
  }
  gE('.siteBarReset', siteBar).onclick = function () {
    if (confirm(g('lang').all[1])) {
      delValue('quickSite');
      reload();
    }
  }
  gE('.siteBarPlus', siteBar).onclick = function () {
    var quickSite = getValue('quickSite', true) || new Array();
    var url = prompt(g('lang').all[10]);
    if (!url) return;
    var name = prompt(g('lang').all[11]);
    var fav = prompt(g('lang').all[12]);
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
  for (var i = 0; i < inputs.length; i++) {
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
  var arena = getValue('arena', true) || new Object();
  if (arena.date !== dateNow) {
    arena.date = dateNow;
    delete arena.array;
    delete arena.isOk;
    setValue('arena', arena);
  }
  if (arena.isOk) return;
  if (arena.array) {
    arena.array = arena.array;
  } else {
    arena.array = new Array();
    var levelArr = new Array(1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 165, 180, 200, 225, 250, 300, 501);
    var arenaidArr = new Array(1, 3, 5, 8, 9, 11, 12, 13, 15, 16, 17, 19, 20, 21, 23, 24, 26, 27, 28, 29, 32, 33);
    if (!g('option').autoArenaLevels) {
      var myLevel = parseInt(gE('.clb>.cit:nth-child(12) .fd4>div').innerHTML.match(/\d+/) [0]);
      for (var i = 0; i < levelArr.length; i++) {
        if (myLevel < levelArr[i]) break;
      }
      arena.array = arenaidArr;
      var length = levelArr.indexOf(levelArr[i]);
      length = (length > arena.array.length) ? arena.array.length : length;
      arena.array.length = length;
    } else {
      var targetArr = g('option').autoArenaLevels.split(',');
      var isTarget;
      for (var i = 0; i < targetArr.length; i++) {
        isTarget = levelArr.indexOf(parseInt(targetArr[i]));
        if (isTarget >= 1) arena.array.push(arenaidArr[isTarget]);
      }
    }
  }
  post(location.href, 'recover=all', function () { //回复
    document.title = g('lang').all[13];
    post('?s=Battle&ss=ar', 'arenaid=' + arena.array[arena.array.length - 1], function () {
      document.title = g('lang').all[14];
      arena.array.splice( - 1);
      if (arena.array.length === 0) arena.isOk = true;
      setValue('arena', arena);
      reload();
    });
  });
}
function setAlert(e, times) { //发出警报
  setNotice(g('lang').notification[e].title, g('lang').notification[e].text, g('lang').notification[e].time);
  if (!g('option').alert) return;
  var fileType = (/Chrome|Safari/.test(navigator.userAgent)) ? '.mp3' : '.wav';
  //var fileType = '.mp3';
  var audio = cE('audio');
  audio.id = 'hvAAAlert';
  audio.controls = true;
  audio.src = (g('option') ['audio-' + e]) ? g('option') ['audio-' + e] : 'https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/' + e + fileType;
  if (typeof times === 'undefined') {
    audio.loop = false;
  } else if (typeof times === 'number') {
    var _time = 0;
    audio.addEventListener('ended', function () {
      _time = _time + 1;
      if (_time === times) {
        audio.parentNode.removeChild(audio);
        return;
      }
      audio.play();
    });
  } else if (times === 'loop') {
    audio.loop = true;
  }
  audio.play();
  gE('body').appendChild(audio);
  document.onmousemove = function () {
    audio.parentNode.removeChild(audio);
  }
}
function countRound() { //回合计数及自动前进并获取怪物总HP
  if (getValue('roundType')) {
    g('roundType', getValue('roundType'));
  } else {
    g('roundType', location.search.replace(/.*ss=([a-z]{2}).*/, '$1'));
    setValue('roundType', g('roundType'));
  }
  var battleLog = gE('#togpane_log>table>tbody>tr>td:nth-child(3)', 'all');
  if (g('option').stamina && /You lose \d+ Stamina/.test(battleLog[0].innerText)) {
    var losedStamina = parseInt(battleLog[0].innerText.match(/\d+/) [0]);
    if (losedStamina >= g('option').staminaLose) {
      pauseChange();
      setAlert('Error', 3);
      alert(g('lang').all[19]);
      return;
    }
  }
  if (battleLog[battleLog.length - 1].innerHTML === 'Battle Start!') delValue(1);
  if (!getValue('roundNow')) {
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
    if (g('monsterAlive') === 0 && g('option').dropMonitor) {
      var drop = getValue('drop', true) || {
        '#startTime': new Date().toLocaleString(),
        '#0_Turn': 0,
        '#1_Round': 0,
        '#2_Battle': 0,
        '#EXP': 0,
        '#Credit': 0
      };
      drop['#0_Turn'] = ('#0_Turn' in drop) ? drop['#0_Turn'] + g('runtime')  : 1;
      drop['#1_Round'] = ('#1_Round' in drop) ? drop['#1_Round'] + 1 : 1;
      if (g('roundNow') === g('roundAll')) drop['#2_Battle'] = ('#2_Battle' in drop) ? drop['#2_Battle'] + 1 : 1;
      var text;
      var item;
      for (var i = 0; ; i++) {
        text = battleLog[i].innerText;
        if (text === 'You are Victorious!') {
          break;
        } else if (/^You gain \d+ EXP!$/.test(text)) {
          drop['#EXP'] += parseInt(text.match(/\d+/) [0]);
        } else if (/dropped \[(\d+) Credits\]$/.test(text)) {
          drop['#Credit'] += parseInt(text.match(/\[(\d+) Credits\]$/) [1]);
        } else if (/dropped \[(.*?)\]$/.test(text)) {
          item = text.match(/\[(.*?)\]$/) [1];
          if (battleLog[i].children[0].style.color === 'rgb(255, 0, 0)') {
            var quality = new Array('Crude', 'Fair', 'Average', 'Superior', 'Exquisite', 'Magnificent', 'Legendary', 'Peerless');
            for (var j = g('option').dropQuality; j < quality.length; j++) {
              if (text.match(quality[j])) {
                drop[item] = (item in drop) ? drop[item] + 1 : 1;
                break;
              }
            }
          } else {
            drop[item] = (item in drop) ? drop[item] + 1 : 1;
          }
        }
      }
      drop = objSort(drop);
      setValue('drop', drop);
    }
    if (g('monsterAlive') > 0) {
      setAlert('Failed', 3);
      delValue(2);
    } else if (g('roundNow') !== g('roundAll')) {
      delValue(1);
      reload();
    } else if (g('roundNow') === g('roundAll')) {
      setAlert('Win');
      delValue(2);
      setTimeout(function () {
        reload();
      }, 3 * 1000);
    }
    g('end', true);
    return;
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
    if (isOn('311')) {
      gE('311').click();
      g('end', true);
      return;
    } else if (isOn('313')) {
      gE('313').click();
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
      'img': 'absorb',
    }
  };
  var name2Skill = {
    'Protection': 'Pr',
    'Spark of Life': 'SL',
    'Spirit Shield': 'SS',
    'Hastened': 'Ha',
    'Arcane Focus': 'AF',
    'Heartseeker': 'He',
    'Regen': 'Re',
    'Shadow Veil': 'SV'
  };
  if (gE('div.bte>img[src*="channeling"]')) {
    var buff = gE('div.bte>img', 'all');
    if (buff.length > 0) {
      for (var n = 0; n < buff.length; n++) {
        var spellName = buff[n].getAttribute('onmouseover').replace(/battle.set_infopane_effect\(\'(.*?)\'.*/, '$1');
        var buffLastTime = parseInt(buff[n].getAttribute('onmouseover').replace(/.*\'\,(.*?)\)/g, '$1'));
        if (isNaN(buffLastTime)) continue;
        if (buffLastTime <= g('option').channelReBuff) {
          if (spellName === 'Cloak of the Fallen' && g('option') ['channelSkill_' + 'SL'] && !gE('div.bte>img[src*="sparklife"]') && isOn('422')) {
            gE('422').click();
            g('end', true);
            return;
          }
          if (spellName in name2Skill && isOn(skillLib[name2Skill[spellName]].id)) {
            gE(skillLib[name2Skill[spellName]].id).click();
            g('end', true);
            return;
          }
        } else {
          break;
        }
      }
    }
    for (var i in skillLib) {
      if (g('option') ['channelSkill_' + i] && !gE('div.bte>img[src*="' + skillLib[i].img + '"]') && isOn(skillLib[i].id)) {
        gE(skillLib[i].id).click();
        g('end', true);
        return;
      }
    }
  } else {
    for (var i in skillLib) {
      if (g('option') ['buffSkill_' + i] && !gE('div.bte>img[src*="' + skillLib[i].img + '"]') && isOn(skillLib[i].id)) {
        gE(skillLib[i].id).click();
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
  if (gE('.bti3>div[onmouseover*="' + infusionLib[g('attackStatus')].name + '"]') && !gE('div.bte>img[src*="' + infusionLib[[g('attackStatus')]].img + '"]')) {
    gE('.bti3>div[onmouseover*="' + infusionLib[g('attackStatus')].name + '"]').click();
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
      gE(skillLib[i].id).click();
      gE('#mkey_' + monsterStatus[0].id).click();
      g('end', true);
      return;
    }
  }
}
function autoAttack() { //自动打怪
  if (g('option').spiritStance && g('oc') >= parseInt(g('option').spiritStance_oc) && g('sp') >= parseInt(g('option').spiritStance_sp) && !gE('#ckey_spirit[src*="spirit_a"]')) {
    gE('#ckey_spirit').click();
    g('end', true);
    return;
  }
  g('monsterStatus').sort(objArrSort('finWeight'));
  var minNum = g('monsterStatus') [0].id;
  if (g('attackStatus') !== 0) {
    if (g('monsterAlive') >= g('option').highSkill && isOn('1' + g('attackStatus') + '3')) {
      gE('1' + g('attackStatus') + '3').click();
    } else if (g('monsterAlive') >= g('option').middleSkill && isOn('1' + g('attackStatus') + '2')) {
      gE('1' + g('attackStatus') + '2').click();
    } else if (isOn('1' + g('attackStatus') + '1')) {
      gE('1' + g('attackStatus') + '1').click();
    }
  }
  if (g('option').skill) {
    if (gE('#ckey_spirit[src*="spirit_a"]') && g('option').skill_OFC && g('oc') >= g('option').skillOC_OFC && (g('monsterAlive') > g('option').skillMonster_OFC || g('bossAlive') > g('option').skillBoss_OFC) && isOn('1111')) {
      gE('1111').click();
    } else if (gE('#ckey_spirit[src*="spirit_a"]') && g('option').skill_FUS && g('oc') >= g('option').skillOC_FUS && (g('monsterAlive') > g('option').skillMonster_FUS || g('bossAlive') > g('option').skillBoss_FUS) && isOn('1101')) {
      gE('1101').click();
    } else if (g('option').skill_3 && g('oc') >= g('option').skillOC_3 && (g('monsterAlive') > g('option').skillMonster_3 || g('bossAlive') > g('option').skillBoss_3) && isOn('2' + g('option').fightingStyle + '03')) {
      gE('2' + g('option').fightingStyle + '03').click();
    } else if (g('option').skill_2 && g('oc') >= g('option').skillOC_2 && (g('monsterAlive') > g('option').skillMonster_2 || g('bossAlive') > g('option').skillBoss_2) && isOn('2' + g('option').fightingStyle + '02')) {
      gE('2' + g('option').fightingStyle + '02').click();
    } else if (g('option').skill_1 && g('oc') >= g('option').skillOC_1 && (g('monsterAlive') > g('option').skillMonster_1 || g('bossAlive') > g('option').skillBoss_1) && isOn('2' + g('option').fightingStyle + '01')) {
      gE('2' + g('option').fightingStyle + '01').click();
    }
  }
  if (minNum === 10) minNum = 0;
  gE('#mkey_' + minNum).click();
  g('end', true);
  return;
}
function gE(ele, mode, parent) { //获取元素
  if (typeof ele === 'object') {
    return ele;
  } else if (mode === undefined && parent === undefined) {
    return (isNaN(parseInt(ele))) ? document.querySelector(ele)  : document.getElementById(ele);
  } else if (mode === 'all') {
    return (parent === undefined) ? document.querySelectorAll(ele)  : parent.querySelectorAll(ele);
  } else if (typeof mode === 'object' && parent === undefined) {
    return mode.querySelector(ele);
  }
}
function cE(name) { //创建元素
  return document.createElement(name);
}
function isOn(id) {
  if (gE(id) && gE(id).style.opacity !== '0.5') {
    return true;
  } else {
    return false;
  }
}
function setValue(item, value) {
  localStorage['hvAA-' + item] = (typeof value === 'string') ? value : JSON.stringify(value);
}
function getValue(item, toJSON) {
  return (localStorage['hvAA-' + item]) ? ((toJSON) ? JSON.parse(localStorage['hvAA-' + item])  : localStorage['hvAA-' + item])  : null;
}
function delValue(item) {
  if (typeof item === 'string') {
    localStorage.removeItem('hvAA-' + item);
  } else if (typeof item === 'number') {
    localStorage.removeItem('hvAA-' + 'disabled');
    if (item > 0) {
      localStorage.removeItem('hvAA-' + 'roundNow');
      localStorage.removeItem('hvAA-' + 'roundAll');
      localStorage.removeItem('hvAA-' + 'monsterStatus');
      if (item > 1) {
        localStorage.removeItem('hvAA-' + 'roundType');
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
function objSort(obj) {
  var arr = new Array();
  for (var i in obj) {
    arr.push(i);
  }
  arr.sort();
  var objNew = new Object();
  for (var i = 0; i < arr.length; i++) {
    objNew[arr[i]] = obj[arr[i]];
  }
  return objNew;
}
function setNotice(title, text, time) { //桌面通知
  if (window.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(function (status) {
      if (!g('option').notification) return;
      if (status === 'granted') {
        var n = new Notification(title, {
          body: text
        });
        n.onclick = function () {
          if (gE('#hvAAAlert')) gE('#hvAAAlert').parentNode.removeChild(gE('#hvAAAlert'));
          n.close();
        }
        setTimeout(function () {
          n.close();
        }, 1000 * time);
      }
    });
  }
}
