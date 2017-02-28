// ==UserScript==
// @name         hvAutoAttack
// @name:zh-TW   【HV】打怪
// @name:zh-CN   【HV】打怪
// @description  HV auto attack script, for the first user, should configure before use it.
// @description:zh-CN HV自动打怪脚本，初次使用，请先设置好选项，请确认字体设置正常
// @description:zh-TW HV自動打怪腳本，初次使用，請先設置好選項，請確認字體設置正常
// @include      http*://hentaiverse.org/*
// @exclude      http*://hentaiverse.org/pages/showequip.php?*
// @author       Dodying
// @namespace    https://github.com/dodying/UserJs
// @supportURL   https://github.com/dodying/UserJs/issues
// @icon         https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @version      2.67
// @compatible   Firefox with Greasemonkey
// @compatible   Chrome with Tampermonkey
// @compatible   Android with Firefox and usi
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==
(function init() {
  if (gE('img[src*="derpy.gif"]')) {
    setTimeout(goto, 5 * 60 * 1000);
    return;
  }
  if (getValue('option')) {
    g('option', getValue('option', true));
    g('lang', g('option').lang || '0');
    addStyle(g('lang'));
    if (GM_info && g('option').version !== GM_info.script.version.substring(0, 4)) {
      gE('.hvAAButton').click();
      gE('#hvAATab-ChangeLog').style.zIndex = 1;
      _alert(0, 'hvAutoAttack版本更新，请重新设置\n强烈推荐【重置设置】后再设置。', 'hvAutoAttack版本更新，請重新設置\n強烈推薦【重置設置】後再設置。', 'hvAutoAttack version update, please reset\nIt\'s recommended to reset all configuration.');
      gE('.hvAAReset').focus();
      return;
    }
  } else {
    g('lang', prompt('请输入以下语言代码对应的数字\nPlease put in the number of your preferred language (0, 1 or 2)\n0.简体中文\n1.繁體中文\n2.English'));
    addStyle(g('lang'));
    _alert(0, '请设置hvAutoAttack', '請設置hvAutoAttack', 'Please config this script');
    gE('.hvAAButton').click();
    return;
  }
  if (gE('.f2rb') && _alert(1, '请设置字体\n使用默认字体可能使某些功能失效\n是否查看相关说明？', '請設置字體\n使用默認字體可能使某些功能失效\n是否查看相關說明？', 'Please set the font\nThe default font may make some functions fail to work\nDo you want to see instructions?')) {
    unsafeunsafeWindow.open('https://greasyfork.org/zh-CN/forum/discussion/comment/27107/#Comment_27107');
    return;
  }
  if (gE('#riddlecounter')) { //需要答题
    riddleAlert(); //答题警报
  } else if (!gE('#navbar')) { //战斗中
    g('attackStatus', g('option').attackStatus);
    g('runtime', 0);
    g('monsterAll', gE('div.btm1', 'all').length);
    g('bossAll', gE('div.btm2[style^="background"]', 'all').length);
    if (g('option').pauseButton) {
      var button = cE('button');
      button.innerHTML = '<l0>暂停</l0><l1>暫停</l1><l2>Pause</l2>';
      button.className = 'pauseChange';
      button.onclick = function () {
        pauseChange();
      }
      gE('.clb').insertBefore(button, gE('.clb>.cbl'));
    }
    if (g('option').pauseHotkey) {
      document.addEventListener('keydown', function pause(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.keyCode === g('option').pauseHotkeyCode) {
          pauseChange();
          //document.removeEventListener('keydown', pause, false);
        }
      }, false);
    }
    reloader();
    battleStart();
    main();
  } else { //非战斗
    delValue(2);
    quickSite();
    if (gE('div[style="margin:5px 0 0; color:#FA9300"]')) { //装备损坏
      if (g('option').damageFix && location.hash !== '#damageFix') {
        if (location.search !== '?s=Forge&ss=re') {
          location = '?s=Forge&ss=re';
        } else {
          post(location.href, 'repair_all=1', function () {
            goto('damageFix', true);
          });
        }
      }
      if (g('option').damageAlert) {
        setAlert('Error', 3);
        if ((g('option').damageFix && location.hash === '#damageFix') || !g('option').damageFix) _alert(0, '装备损坏，请修复', '裝備損壞，請修復', 'Damaged equipments, please repair');
      }
      return;
    }
    if (g('option').autoArena && parseInt(gE('.fd4>div').textContent.match(/\d+/) [0]) > g('option').staminaNow) {
      setTimeout(autoArena, g('option').autoArenaTime * 1000);
    }
  }
}) ();
function main() { //主程序
  if (getValue('disabled')) { //如果禁用
    document.title = _alert( - 1, 'hvAutoAttack暂停中', 'hvAutoAttack暫停中', 'hvAutoAttack Paused');
    gE('.clb>button').innerHTML = '<l0>继续</l0><l1>繼續</l1><l2>Continue</l2>';
    return;
  }
  g('end', false);
  if (parseInt(gE('.fd4>div').textContent.match(/\d+/) [0]) <= g('option').staminaNow) {
    setAlert('Error', 3);
    if (!_alert(1, '当前Stamina过低\n或Stamina损失过多\n是否继续？', '當前Stamina過低\n或Stamina損失過多\n是否繼續？', 'Continue?\nYou either have too little Stamina or have lost too much')) {
      pauseChange();
      return;
    }
  }
  g('runtime', g('runtime') + 1);
  var monsterDead = gE('img[src*="nbardead"]', 'all').length;
  g('monsterAlive', g('monsterAll') - monsterDead);
  var bossDead = gE('div.btm1[style*="opacity"] div.btm2[style*="background"]', 'all').length;
  g('bossAlive', g('bossAll') - bossDead);
  if (gE('.btcp')) continueBattle(); //回合计数及自动前进并获取敌人总HP
  if (g('end')) return;
  if (getValue('monsterStatus') && getValue('monsterStatus', true).length === g('monsterAll')) {
    g('monsterStatus', getValue('monsterStatus', true));
  } else {
    fixMonsterStatus();
  }
  var bar = gE('.cwb2', 'all');
  g('hp', bar[0].offsetWidth / 120 * 100);
  g('mp', bar[1].offsetWidth / 120 * 100);
  g('sp', bar[2].offsetWidth / 120 * 100);
  g('oc', parseInt(gE('.cwbt2').textContent));
  battleInfo(); //战斗战况
  countMonsterHP(); //统计敌人血量
  if (gE('#ikey_p')) autoUseGem(); //自动使用宝石
  if (g('end')) return;
  if (g('mp') < g('option').mp2 || g('sp') < g('option').sp2 || g('hp') <= g('option').hp2) deadSoon(); //自动回血回魔
  if (g('end')) return;
  if (g('option').scroll && g('roundNow') >= g('option').scrollRoundNow && g('option') ['scrollRoundType_' + g('roundType')]) autoUseScroll(); //自动使用卷轴
  if (g('end')) return;
  if (g('option').buffSkill && (g('roundAll') >= g('option').buffSkillAllRound || g('monsterAll') >= g('option').buffSkillMonster || g('bossAlive') >= g('option').buffSkillBoss)) autoUseBuffSkill(); //自动使用药水、施法增益技能
  if (g('end')) return;
  if (g('attackStatus') !== '0' && g('option').infusion && g('roundNow') >= g('option').infusionRoundNow && g('option') ['infusionRoundType_' + g('roundType')]) autoUseInfusions(); //自动使用魔药
  if (g('end')) return;
  if (g('option').debuffSkill && g('option').debuffSkill_All_Im && gE('div.btm6 img[src*="imperil"]', 'all').length < g('monsterAlive')) allImperiled(); //给所有敌人上Imperil
  if (g('end')) return;
  if (g('option').debuffSkill && (g('option').debuffSkillMode === '0' || (g('bossAlive') === g('monsterAlive') && g('option').debuffSkillMode === '1'))) autoUseDeSkill(); //自动施法De技能
  if (g('end')) return;
  autoAttack(); //自动打怪
  if (g('end')) return;
}
function addStyle(lang) {
  var langStyle = cE('style');
  langStyle.className = 'hvAA-LangStyle';
  langStyle.textContent = 'l' + lang + '{display:inline!important;}';
  if (lang === '0' || lang === '1') langStyle.textContent += 'l01{display:inline!important;}';
  gE('head').appendChild(langStyle);
  var globalStyle = cE('style');
  var boxWidth = gE('.stuffbox').offsetWidth;
  globalStyle.textContent = '' +
  'button{border-radius:3px;border:2px solid #808080;}' +
  'l0,l1,l01,l2{display:none;}' + //l0: 简体 l1: 繁体 l01:简繁体共用 l2: 英文
  '#riddleform>div:nth-child(3)>img{width:700px;}' +
  '.hvAALog{font-size:20px;}' +
  '.hvAAButton{top:4px;left:' + (boxWidth - 24 - 50) + 'px;position:absolute;z-index:9999;cursor:pointer;}' +
  '#hvAABox{left:calc(50% - 350px);top:50px;font-size:12pt!important;z-index:9999;width:700px;height:510px;position:absolute;text-align:justify;background-color:#E3E0D1;border:1px solid #000;border-radius:10px;}' +
  '.hvAATablist{position:relative;left:14px;}' +
  '.hvAATabmenu{position:absolute;left:-9px;}' +
  '.hvAATabmenu>span>a{display:block;padding:5px 10px;margin:0 10px 0 0;border:1px solid #91a7b4;border-radius:5px;background-color:#E3F1F8;color:#000;text-decoration:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}' +
  '.hvAATabmenu:hover{z-index:999999!important;}' +
  '.hvAATabmenu>span:hover{left:-5px;position:relative;}' +
  '.hvAATabmenu>span:hover>a{color:#0000FF;font-size:large;}' +
  '.hvAATab{position:absolute;width:605px;height:400px;left:36px;padding:15px;border:1px solid #91A7B4;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,0.1);font-size:14pt;color:#666;background-color:#EDEBDF;overflow:auto;}' +
  '.hvAATab>div:nth-child(2n){border:1px solid #EAEAEA;background-color:#FAFAFA;}' +
  '.hvAATab>div:nth-child(2n+1){border:1px solid #808080;}' +
  '.hvAATab a{margin:0 2px;}' +
  '.hvAATab b{font-family:"Times New Roman",Georgia,Serif;font-size:20px;}' +
  '.hvAATab:target{z-index:1!important;}' +
  '.hvAATab:not(:target){z-index:0!important;}' +
  '.hvAATab input{margin:0 4px;}' +
  '.hvAATab input.hvAANumber{width:24px;text-align:right;}' +
  '.hvAATab label{cursor:pointer;}' +
  '.hvAATab table{font-size:smaller;border:2px solid #000;border-collapse:collapse;margin:0 auto;}' +
  '.hvAATab table>tbody>tr:nth-child(1)>*{font-weight:bold;font-size:18px;}' +
  '.hvAATab table>tbody>tr>*{border:1px solid #000;}' +
  '.hvAACenter{text-align:center;}' +
  '.hvAATitle{font-weight:bolder;font-size:larger;}' +
  '.hvAANew{width:25px;height:25px;float:left;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAMCAYAAACX8hZLAAAAcElEQVQ4jbVRSQ4AIQjz/59mTiZIF3twmnCwFAq4FkeFXM+5vCzohYxjPMtfxS8CN6iqQ7TfE0wrODxVbzJNgoaTo4CmbBO1ZWICouQ0DHaL259MEzaU+w8pZOdSjcUgaPJDHCbO0A2kuAiuwPGQ+wBms12x8HExTwAAAABJRU5ErkJggg==) no-repeat;background-position:center;}' +
  '#hvAATab-Alarm input[type="text"]{width:512px;}' +
  '.testAlarms>div{border:2px solid #000;}' +
  '.hvAAArenaLevels{display:none;}' +
  '.hvAAConfig{width:100%;height:16px;}' +
  '.hvAAButtonBox{position:relative;top:440px;}' +
  '.hvAAButtonBox>button{margin:0 1px;}' +
  '.quickSiteBar{position:absolute;top:100px;left:' + (boxWidth + 2) + 'px;font-size:12pt;text-align:left;}' +
  '.quickSiteBar>span{display:block;}' +
  '.quickSiteBar>span>a{text-decoration:none;}' +
  '.favicon{width:16px;height:16px;margin:-3px 1px;border:1px solid #000;border-radius:3px;}' +
  '.answerBar{z-index:1000;width:710px;height:40px;position:absolute;top:50px;left:345px;display:table;border-spacing:5px;}' +
  '.answerBar>div{border:4px solid red;display:table-cell;cursor:pointer;}' +
  '.answerBar>div:hover{background:rgba(63,207,208,0.20);}';
  gE('head').appendChild(globalStyle);
  optionButton(lang);
}
function optionButton(lang) { //配置界面
  var optionButton = cE('div');
  optionButton.className = 'hvAAButton';
  optionButton.innerHTML = '<img src=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAADi0lEQVRIiZVWPYgUZxj+dvGEk7vsNdPYCMul2J15n+d991PIMkWmOEyMyRW2FoJIUojYp5ADFbZJkyISY3EqKGpgz+Ma4bqrUojICaIsKGIXSSJcsZuD3RT3zWZucquXDwYG5n2f9/d5vnFuHwfAZySfAXgN4DXJzTiOj+3H90OnkmXZAe/9FMm3JJ8AuBGepyRfle2yLDvgnKt8EDVJkq8B3DGzjve+1m63p0n2AVzJbUh2SG455yre+5qZ/aCq983sxMfATwHYJvlCVYckHwFYVdURgO8LAS6RHJJcM7N1VR0CeE5yAGBxT3AR+QrA3wA20tQOq+pFkgOS90Tk85J51Xs9qaorqjoAcC6KohmSGyQHcRx/kbdv7AHgDskXaWqH0zSddc5Voyia2SOXapqmswsLvpam6ez8/Pwn+YcoimYAvARw04XZ5N8qZtZR1aGqXnTOVSd0cRd42U5EzqvqSFWX2u32tPd+yjnnXNiCGslHJAf7ybwM7r2vAdgWkYdZls157w+NK/DeT7Xb7WkAqyTvlZHjOD5oxgtmtqrKLsmze1VJsquqKwsLO9vnnKvkJHpLsq+qo/JAd8BtneTvqvqTiPwoIu9EZKUUpGpmi2Y2UtU+yTdJkhx1JJ8FEl0pruK/TrwA4F2r1WrkgI1G4wjJP0XkdLF9WaZzZnZZVa8GMj5xgf43JvXczFZbLb1ebgnJn0nenjQbEVkG0JsUYOykyi6Aa+XoQTJuTRr8OADJzVBOh+SlckYkz5L8Q0TquXOj0fhURN6r6pkSeAXAUsDaJPnYxXF8jOQrklskh97ryZJTVURWAPwF4DqAX0TkvRl/zTKdK2aeJMnxICFbAHrNZtOKVVdIrrVa2t1jz6sicprkbQC3VPVMGTzMpQvgQY63i8lBFddVdVCk/6TZlMFzopFci+P44H+YHCR3CODc/wUvDPY7ksMg9buZrKr3ATwvyoT3vrafzPP3er1eA9Azs7tjJhcqOBHkeSOKohkROR9K7prZYqnnlSRJjofhb4vIt/V6vUbyN1Xtt1qtb1zpZqs45xyAxXAnvCQ5FJGHqrpiZiMzu5xnHlZxCOABybXw3gvgp/Zq3/gA+BLATVVdyrJsbods2lfVq7lN4crMtapjZndD5pPBixWFLTgU7uQ3AJ6KyLKILAdy9sp25bZMBC//JSRJcjQIYg9Aj+TjZrNp+/mb+Ad711sdZZ1k/QAAAABJRU5ErkJggg==></img>';
  optionButton.onclick = function () {
    if (gE('#hvAABox')) {
      gE('#hvAABox').style.display = (gE('#hvAABox').style.display === 'none') ? 'block' : 'none';
    } else {
      optionBox();
      gE('select[name="lang"]').value = lang;
    }
  }
  gE('body').appendChild(optionButton);
}
function optionBox() {
  var optionBox = cE('div');
  optionBox.id = 'hvAABox';
  optionBox.innerHTML = '' +
  '<div class="hvAACenter"><h1 style="display:inline;"><l0>hvAutoAttack设置</l0><l1>hvAutoAttack設置</l1><l2>hvAutoAttack Configuration</l2></h1> <l0>语言</l0><l1>語言</l1><l2></l2><select name="lang"><option value="0">简体中文</option><option value="1">繁體中文</option><option value="2">English</option></select></div><div class="hvAATablist">' +
  '<div class="hvAATabmenu"><span><a href="#hvAATab-Main"><l0>主要选项</l0><l1>主要選項</l1><l2>Main</l2></a></span><span><a href="#hvAATab-Self"><l0>对自身技能</l0><l1>對自身技能</l1><l2>Supportive Spells</l2></a></span><span><a href="#hvAATab-Debuff"><l01>De技能</l01><l2>Deprecating Spells</l2></a></span><span><a href="#hvAATab-Skill"><l01>其他技能</l01><l2>Other Spells</l2></a></span><span><a href="#hvAATab-Scroll"><l0>卷轴</l0><l1>捲軸</l1><l2>Scroll</l2></a></span><span><a href="#hvAATab-Infusion"><l0>魔药</l0><l1>魔藥</l1><l2>Infusion</l2></a></span><span><a href="#hvAATab-Alarm"><l0>警报</l0><l1>警報</l1><l2>Alarm</l2></a></span><span><a href="#hvAATab-Rule"><l0>攻击规则</l0><l1>攻擊規則</l1><l2>Attack Rule</l2></a></span><span class="hvAAShowAbout"><a href="#hvAATab-About"><l0>关于本脚本</l0><l1>關於本腳本</l1><l2>About This</l2></a></span><span><a href="#hvAATab-Recommend"><l0>推荐脚本</l0><l1>推薦腳本</l1><l2>Recommend</l2></a></span><span><a href="#hvAATab-ChangeLog"><l0>更新日志</l0><l1>更新日誌</l1><l2>ChangeLog</l2></a></span></div>' +
  '<div class="hvAATab" id="hvAATab-Main"><div class="hvAACenter" title="0. Draughts\n1. Gems\n2. Potions (Or Cure/Full-Cure)\n3. Elixirs"><span style="color:green;">HP: 0.<input class="hvAANumber" name="hp0" placeholder="95" type="text">% 1.<input class="hvAANumber" name="hp1" placeholder="50" type="text">% 2.<input class="hvAANumber" name="hp2" placeholder="50" type="text">% 3.<input class="hvAANumber" name="hp3" placeholder="5" type="text">%</span><br><span style="color:blue;">MP: 0.<input class="hvAANumber" name="mp0" placeholder="95" type="text">% 1.<input class="hvAANumber" name="mp1" placeholder="70" type="text">% 2.<input class="hvAANumber" name="mp2" placeholder="10" type="text">% 3.<input class="hvAANumber" name="mp3" placeholder="5" type="text">%</span><br><span style="color:red;">SP: 0.<input class="hvAANumber" name="sp0" placeholder="95" type="text">% 1.<input class="hvAANumber" name="sp1" placeholder="75" type="text">% 2.<input class="hvAANumber" name="sp2" placeholder="50" type="text">% 3.<input class="hvAANumber" name="sp3" placeholder="5" type="text">%</span><br><input id="lastElixir" type="checkbox"><label for="lastElixir"><l0>当技能与药水CD时，使用</l0><l1>當技能與藥水CD時，使用</l1><l2>If all spells and potions are still in countdown, use </l2><b>Last Elixir</b>.</label></div><div class="hvAACenter" id="attackStatus" style="color:red;"><b>*<l0>攻击模式</l0><l1>攻擊模式</l1><l2>Attack Mode</l2></b>: <select name="attackStatus"><option value="-1"></option><option value="0">物理 / Physical</option><option value="1">火 / Fire</option><option value="2">冰 / Cold</option><option value="3">雷 / Elec</option><option value="4">风 / Wind</option><option value="5">圣 / Divine</option><option value="6">暗 / Forbidden</option></select></div><div><b><l0>暂停相关</l0><l1>暫停相關</l1><l2>Pause with</l2></b>: <input id="pauseButton" type="checkbox"><label for="pauseButton"><l0>使用按钮</l0><l1>使用按鈕</l1><l2>Button</l2>; </label><input id="pauseHotkey" type="checkbox"><label for="pauseHotkey"><l0>使用热键</l0><l1>使用熱鍵</l1><l2>Hotkey</l2>: <input name="pauseHotkeyStr" placeholder=" " style="width:30px;" type="text"><input class="hvAANumber" name="pauseHotkeyCode" placeholder="32" disabled="true" type="text"></label></div><div><b><l0>警报相关</l0><l1>警報相關</l1><l2>To Warn</l2></b>: <input id="alert" type="checkbox"><label for="alert"><l0>开启</l0><l1>開啟</l1><l2>Turn on </l2><b><l0>音频警报</l0><l1>音頻警報</l1><l2>Alarms</l2></b>; </label><input id="notification" type="checkbox"><label for="notification"><l0>开启</l0><l1>開啟</l1><l2>Turn on </l2><b><l01>桌面通知</l01><l2>Notifications</l2></b></label> <button class="testNotification"><l0>预处理</l0><l1>預處理</l1><l2>Pretreat</l2></button></div><div><b><l01>内置插件</l01><l2>Built-in Plugin</l2></b>: <l0>开启</l0><l1>開啟</l1><l2>Use </l2><a href="https://forums.e-hentai.org/index.php?showtopic=65126&amp;st=2660&amp;p=4384894&amp;#entry4384894" target="_blank">Reloader</a>; <input id="riddleRadio" type="checkbox"><label for="riddleRadio"><l0>开启</l0><l1>開啟</l1><l2>Use </l2><a href="https://forums.e-hentai.org/index.php?showtopic=65126&amp;st=1020&amp;p=3000982&amp;#entry3000982" target="_blank">RiddleLimiter Plus</a>.</label></div><div><b><l0>技能施放条件</l0><l1>技能施放條件</l1><l2>Offensive Spells Conditions</l2></b>: <l0>中级: 敌人存活数</l0><l1>中級: 敌人存活數</l1><l2 title="eg: Inferno"> 2nd Tier: Enemies alive</l2> ≥ <input class="hvAANumber" name="middleSkill" placeholder="3" type="text">; <l0>高级: 敌人存活数</l0><l1>高級: 敌人存活數</l1><l2 title="eg: Flames of Loki">3rd Tier: Enemies alive</l2> ≥ <input class="hvAANumber" name="highSkill" placeholder="5" type="text"></div><div><input id="spiritStance" type="checkbox"><label for="spiritStance"><l0>当OC</l0><l1>當OC</l1><l2>If OC</l2> ≥ <input class="hvAANumber" name="spiritStance_oc" placeholder="50" type="text"><l01>且SP</l01><l2>and SP</l2> ≥ <input class="hvAANumber" name="spiritStance_sp" placeholder="80" type="text">%<l0>，开启</l0><l1>，開啟</l1><l2>, activate </l2><b>Spirit Stance</b>.</label></div><div title="防止脚本莫名暂停\nTo prevent the script from stopping due to unforeseen problems"><input id="delayAlert" type="checkbox"><label for="delayAlert"><l0>页面停留</l0><l1>頁面停留</l1><l2>If the page stays idle for </l2><input class="hvAANumber" name="delayAlertTime" placeholder="10" type="text"><l0>秒后，</l0><l1>秒後，</l1><l2>s, </l2><b><l0>警报</l0><l1>警報</l1><l2>alarm</l2></b>; </label><input id="delayReload" type="checkbox"><label for="delayReload"><l0>页面停留</l0><l1>頁面停留</l1><l2>If the page stays idle for</l2><input class="hvAANumber" name="delayReloadTime" placeholder="15" type="text"><l0>秒后，</l0><l1>秒後，</l1><l2>s, </l2><b><l0>刷新页面</l0><l1>刷新頁面</l1><l2>reload page</l2></b>.</label></div><div><l0>当</l0><l1>當</l1><l2>If </l2><b><l0>小马</l0><l1>小馬</l1><l2>riddle </l2></b><l0>答题时间</l0><l1>答題時間</l1><l2>ETR</l2> ≤ <input class="hvAANumber" name="riddleAnswerTime" placeholder="3" type="text"><l0>秒，如果输入框为空则随机生成答案并提交</l0><l1>秒，如果輸入框為空則隨機生成答案並提交</l1><l2>s and no answer has been chosen yet, a random answer will be generated and submitted</l2>.</div><div><input id="riddleAlert" type="checkbox"><label for="riddleAlert"><l0>当遇小马答题时，弹出警告框</l0><l1>當遇小馬答題時，彈出警告框</l1><l2>If RIDDLE, ALERT</l2></label> <button class="testAlert"><l0>预处理</l0><l1>預處理</l1><l2>Pretreat</l2></button><br><l0>说明: 1.Firefox: 聚焦本标签页 2.Chrome: 锁定全部标签页</l0><l1>說明: 1.Firefox: 聚焦本標籤頁 2.Chrome: 鎖定全部標籤頁</l1><l2>Description: 1.Firefox: Focus this tab 2.Chrome: Lock all tabs</l2></div><div><l0>当</l0><l1>當</l1><l2>If </l2>Stamina ≤ <input class="hvAANumber" name="staminaNow" placeholder="30" type="text"><l0>或损失</l0><l1>或損失</l1><l2> or lost </l2>Stamina ≥ <input class="hvAANumber" name="staminaLose" placeholder="5" type="text"><l0>时，脚本暂停并警报</l0><l1>時，腳本暫停並警報</l1><l2>, pause script and alarm</l2>.</div><div><div class="hvAANew"></div><input id="autoArena" type="checkbox"><label for="autoArena"><l01>在</l01><l2>Idle in </l2><b><l0>任意页面</l0><l1>任意頁面</l1><l2>any page </l2></b><l01>停留</l01><l2>for </l2><input class="hvAANumber" name="autoArenaTime" placeholder="60" type="text"><l0>秒后，开始竞技场</l0><l1>秒後，開始競技場</l1><l2>s, start Arena</l2></label> <button class="autoArenaReset"><l01>重置</l01><l2>Reset</l2></button>;<br><l0>进行的竞技场相对应等级</l0><l1>進行的競技場相對應等級</l1><l2>The levels of the Arena you want to complete</l2>:  <a class="hvAAShowLevels" href="javascript:void(0);"><l0>显示更多</l0><l1>顯示更多</l1><l2>Show more</l2></a><br><div class="hvAAArenaLevels"><input id="arLevel_1" value="1,1" type="checkbox"><label for="arLevel_1">1</label> <input id="arLevel_10" value="10,3" type="checkbox"><label for="arLevel_10">10</label> <input id="arLevel_20" value="20,5" type="checkbox"><label for="arLevel_20">20</label> <input id="arLevel_30" value="30,8" type="checkbox"><label for="arLevel_30">30</label> <input id="arLevel_40" value="40,9" type="checkbox"><label for="arLevel_40">40</label> <input id="arLevel_50" value="50,11" type="checkbox"><label for="arLevel_50">50</label> <input id="arLevel_60" value="60,12" type="checkbox"><label for="arLevel_60">60</label> <input id="arLevel_70" value="70,13" type="checkbox"><label for="arLevel_70">70</label> <input id="arLevel_80" value="80,15" type="checkbox"><label for="arLevel_80">80</label> <input id="arLevel_90" value="90,16" type="checkbox"><label for="arLevel_90">90</label> <input id="arLevel_100" value="100,17" type="checkbox"><label for="arLevel_100">100</label> <input id="arLevel_110" value="110,19" type="checkbox"><label for="arLevel_110">110</label><br><input id="arLevel_120" value="120,20" type="checkbox"><label for="arLevel_120">120</label> <input id="arLevel_130" value="130,21" type="checkbox"><label for="arLevel_130">130</label> <input id="arLevel_140" value="140,23" type="checkbox"><label for="arLevel_140">140</label> <input id="arLevel_150" value="150,24" type="checkbox"><label for="arLevel_150">150</label> <input id="arLevel_165" value="165,26" type="checkbox"><label for="arLevel_165">165</label> <input id="arLevel_180" value="180,27" type="checkbox"><label for="arLevel_180">180</label> <input id="arLevel_200" value="200,28" type="checkbox"><label for="arLevel_200">200</label> <input id="arLevel_225" value="225,29" type="checkbox"><label for="arLevel_225">225</label> <input id="arLevel_250" value="250,32" type="checkbox"><label for="arLevel_250">250</label> <input id="arLevel_300" value="300,33" type="checkbox"><label for="arLevel_300">300</label><br><input id="arLevel_RB50" value="RB50,105" type="checkbox"><label for="arLevel_RB50">RB50</label> <input id="arLevel_RB75A" value="RB75A,106" type="checkbox"><label for="arLevel_RB75A">RB75A</label> <input id="arLevel_RB75B" value="RB75B,107" type="checkbox"><label for="arLevel_RB75B">RB75B</label> <input id="arLevel_RB75C" value="RB75C,108" type="checkbox"><label for="arLevel_RB75C">RB75C</label><br><input id="arLevel_RB100" value="RB100,109" type="checkbox"><label for="arLevel_RB100">RB100</label> <input id="arLevel_RB150" value="RB150,110" type="checkbox"><label for="arLevel_RB150">RB150</label> <input id="arLevel_RB200" value="RB200,111" type="checkbox"><label for="arLevel_RB200">RB200</label> <input id="arLevel_RB250" value="RB250,112" type="checkbox"><label for="arLevel_RB250">RB250</label></div><input name="autoArenaLevels" style="width:98%;" type="text" disabled="true"><input name="autoArenaValue" style="width:98%;" type="text" disabled="true"></div><div><l0>当装备损坏时，</l0><l1>當裝備損壞時，</l1><l2>If equipments damaged, </l2><input id="damageFix" type="checkbox"><label for="damageFix"><b><l0>尝试修复</l0><l1>嘗試修復</l1><l2>try to repair</l2></b></label>; <input id="damageAlert" type="checkbox"><label for="damageAlert"><b><l0>警报</l0><l1>警報</l1><l2>alarm</l2></b></label>.</div><div><input id="etherTap" type="checkbox"><label for="etherTap">Ether Tap: <l0>对魔力合流的敌人进行物理攻击</l0><l1>對魔力合流的敵人進行物理攻擊</l1><l2>Arcane Blow enemy which has Coalesced Mana</l2></label></div></div>' +
  '<div class="hvAATab" id="hvAATab-Self"><input id="buffSkill" type="checkbox"><label for="buffSkill"><span class="hvAATitle"><l0>对自身技能</l0><l1>對自身技能</l1><l2>Supportive Spells</l2></span></label><div><l0>施放条件（有一个成立就行）</l0><l1>施放條件（有一個成立就行）</l1><l2>Conditions (cast when at least 1 in 3 is satisfied) </l2>: <br>1. <l0>总回合数</l0><l1>總回合數</l1><l2>Total number of turns</l2> ≥ <input class="hvAANumber" name="buffSkillAllRound" placeholder="12" type="text"><br>2. <l0>Boss存活数</l0><l1>Boss存活數</l1><l2>Number of bosses alive</l2> ≥ <input class="hvAANumber" name="buffSkillBoss" placeholder="1" type="text"><br>3. <l0>敌人存活数</l0><l1>敌人存活數</l1><l2>Number of enemies alive</l2> ≥ <input class="hvAANumber" name="buffSkillMonster" placeholder="6" type="text"></div><div><b><l01>增益技能</l01><l2>Spells </l2></b><l0>（Buff不存在就施放的技能，按【施放顺序】排序）</l0><l1>（Buff不存在就施放的技能，按【施放順序】排序）</l1><l2>(Cast or recast spells if the buff is not present, sorted in cast order)</l2>: <br><input id="buffSkill_HD" type="checkbox"><label for="buffSkill_HD">Health Draught</label><input id="buffSkill_MD" type="checkbox"><label for="buffSkill_MD">Mana Draught</label><input id="buffSkill_SD" type="checkbox"><label for="buffSkill_SD">Spirit Draught</label><br><input id="buffSkill_Pr" type="checkbox"><label for="buffSkill_Pr">Protection</label><input id="buffSkill_SL" type="checkbox"><label for="buffSkill_SL">Spark of Life</label><input id="buffSkill_SS" type="checkbox"><label for="buffSkill_SS">Spirit Shield</label><input id="buffSkill_Ha" type="checkbox"><label for="buffSkill_Ha">Haste</label><br><input id="buffSkill_AF" type="checkbox"><label for="buffSkill_AF">Arcane Focus</label><input id="buffSkill_He" type="checkbox"><label for="buffSkill_He">Heartseeker</label><input id="buffSkill_Re" type="checkbox"><label for="buffSkill_Re">Regen</label><input id="buffSkill_SV" type="checkbox"><label for="buffSkill_SV">Shadow Veil</label><input id="buffSkill_Ab" type="checkbox"><label for="buffSkill_Ab">Absorb</label></div><div><b><l0>获得Channel时</l0><l1>獲得Channel時</l1><l2>During Channeling effect</l2></b><l0>，此时1点MP施法与150%伤害，</l0><l1>，此時1點MP施法與150%傷害，</l1><l2>, which means 1mp spell cost and 150% spell damage,</l2><br><b><l01>先ReBuff</l01><l2> Recast if</l2></b>: <l01>buff存在</l01><l2>spell effect expires in</l2> ≤ <input class="hvAANumber" name="channelReBuff" placeholder="20" type="text"><l0>回合时，重新使用该技能</l0><l1>回合時，重新使用該技能</l1><l2> turns</l2>.<br><b><l01>再施放Channel技能</l01><l2>These skills will be casted during Channeling effect </l2></b><l0>（按【施放顺序】排序）</l0><l1>（按【施放順序】排序）</l1><l2>(sorted in cast order)</l2>: <br><input id="channelSkill_Pr" type="checkbox"><label for="channelSkill_Pr">Protection</label><input id="channelSkill_SL" type="checkbox"><label for="channelSkill_SL">Spark of Life</label><input id="channelSkill_SS" type="checkbox"><label for="channelSkill_SS">Spirit Shield</label><input id="channelSkill_Ha" type="checkbox"><label for="channelSkill_Ha">Haste</label><br><input id="channelSkill_AF" type="checkbox"><label for="channelSkill_AF">Arcane Focus</label><input id="channelSkill_He" type="checkbox"><label for="channelSkill_He">Heartseeker</label><input id="channelSkill_Re" type="checkbox"><label for="channelSkill_Re">Regen</label><input id="channelSkill_SV" type="checkbox"><label for="channelSkill_SV">Shadow Veil</label><input id="channelSkill_Ab" type="checkbox"><label for="channelSkill_Ab">Absorb</label></div></div>' +
  '<div id="hvAATab-Debuff" class="hvAATab"><input id="debuffSkill" type="checkbox"><label for="debuffSkill"><span class="hvAATitle"><l01>De技能</l01><l2>Deprecating Spells</l2></span><l0>（按【施放顺序】排序）</l0><l1>（按【施放順序】排序）</l1><l2> (sort in cast order)</l2></label><div><l01>特殊</l01><l2>Special</l2><input id="debuffSkill_All_Im" type="checkbox"><label for="debuffSkill_All_Im"><l0>给所有敌人上Imperil</l0><l1>給所有敵人上Imperil</l1><l2>Imperiled all enemies.</l2></label></div><div><l0>攻击目标</l0><l1>攻擊目標</l1><l2>Spell targets</l2>: <select name="debuffSkillMode"><option value="-1"></option><option value="0">0. 所有敌人 / All enemies</option><option value="1">1. Bosses only</option></select><br><input id="debuffSkill_Im" type="checkbox"><label for="debuffSkill_Im">Imperil</label><input id="debuffSkill_MN" type="checkbox"><label for="debuffSkill_MN">MagNet</label><input id="debuffSkill_Si" type="checkbox"><label for="debuffSkill_Si">Silence</label><input id="debuffSkill_Dr" type="checkbox"><label for="debuffSkill_Dr">Drain</label><input id="debuffSkill_We" type="checkbox"><label for="debuffSkill_We">Weaken</label><input id="debuffSkill_Co" type="checkbox"><label for="debuffSkill_Co">Confuse</label></div></div>' +
  '<div class="hvAATab" id="hvAATab-Skill"><l0>注：本标签所有输入框皆表示最小值</l0><l1>注：本標籤所有輸入框皆表示最小值</l1><l2>Note: All input fields in this label means Minimum</l2><br><l0>1. OC值 2. 敌人存活数 3. Boss存活数(1前提，2/3满足一个)</l0><l1>1. OC值 2. 怪獸存活數 3. Boss存活數(1前提，2/3滿足一個)</l1><l2>1. OC value 2. Enemies survival number 3. Boss survival number(1 precondition, 2/3 one true)</l2><br><input id="skill" type="checkbox"><label for="skill"><span class="hvAATitle"><l01>其他技能</l01><l2>Other Spells</l2></span> <l0>（按【施放顺序】排序）</l0><l1>（按【施放順序】排序）</l1><l2>(Sort by cast order)</l2></label><br><input id="skill_OFC" type="checkbox"><label for="skill_OFC"><l0>友情小马砲</l0><l1>友情小馬砲</l1><l2>OFC</l2>: </label><input class="hvAANumber" name="skillOC_OFC" type="text"><input class="hvAANumber" name="skillMonster_OFC" type="text"><input class="hvAANumber" name="skillBoss_OFC" type="text"><br><input id="skill_FRD" type="checkbox"><label for="skill_FRD"><l0>龙吼</l0><l1>龍吼</l1><l2>FRD</l2>: </label><input class="hvAANumber" name="skillOC_FRD" type="text"><input class="hvAANumber" name="skillMonster_FRD" type="text"><input class="hvAANumber" name="skillBoss_FRD" type="text"><br><l0>战斗风格</l0><l1>戰鬥風格</l1><l2>Fighting style</l2>: <select name="fightingStyle"><option value="1">二天一流 / Niten Ichiryu</option><option value="2">单手 / One-Handed</option><option value="3">双手 / 2-Handed Weapon</option><option value="4">双持 / Dual Wielding</option><option value="5">法杖 / Staff</option></select><br><input id="skill_3" type="checkbox"><label for="skill_3"><l0>3阶（如果有）</l0><l1>3階（如果有）</l1><l2>T3(if exist)</l2>: </label><input class="hvAANumber" name="skillOC_3" type="text"><input class="hvAANumber" name="skillMonster_3" type="text"><input class="hvAANumber" name="skillOCBoss_3" type="text"><br><input id="skill_2" type="checkbox"><label for="skill_2"><l0>2阶（如果有）</l0><l1>2階（如果有）</l1><l2>T2(if exist)</l2>: </label><input class="hvAANumber" name="skillOC_2" type="text"><input class="hvAANumber" name="skillMonster_2" type="text"><input class="hvAANumber" name="skillOCBoss_2" type="text"><br><input id="skill_1" type="checkbox"><label for="skill_1"><l0>1阶</l0><l1>1階</l1><l2>T1</l2>: </label><input class="hvAANumber" name="skillOC_1" type="text"><input class="hvAANumber" name="skillMonster_1" type="text"><input class="hvAANumber" name="skillOCBoss_1" type="text"></div>' +
  '<div class="hvAATab" id="hvAATab-Scroll"><input id="scroll" type="checkbox"><label for="scroll"><span class="hvAATitle"><l0>使用卷轴</l0><l1>使用捲軸</l1><l2>Use Scrolls</l2></span></label><br><l0>战役模式</l0><l1>戰役模式</l1><l2>Battle type</l2>: <input id="scrollRoundType_ar" type="checkbox"><label for="scrollRoundType_ar">The Arena</label><input id="scrollRoundType_rb" type="checkbox"><label for="scrollRoundType_rb">Ring of Blood</label><input id="scrollRoundType_gr" type="checkbox"><label for="scrollRoundType_gr">GrindFest</label><input id="scrollRoundType_iw" type="checkbox"><label for="scrollRoundType_iw">Item World</label><input id="scrollRoundType_ba" type="checkbox"><label for="scrollRoundType_ba">Random Encounter</label><br><l0>总体条件：当前回合数</l0><l1>總體條件：當前回合數</l1><l2>Conditions: Number of turns</l2> ≥ <input class="hvAANumber" name="scrollRoundNow" type="text"><br><l0>以下输入框为使用相应卷轴的最小回合数</l0><l1>以下輸入框為使用相應捲軸的最小回合數</l1><l2>The following input fields indicate the min round to use the scroll</l2>.<br><input id="scrollFirst" type="checkbox"><label for="scrollFirst"><l0>存在技能生成的Buff时，仍然使用卷轴</l0><l1>存在技能生成的Buff時，仍然使用捲軸</l1><l2>Use Scrolls even when there are effects from spells</l2>.</label><br><input id="scroll_Go" type="checkbox"><label for="scroll_Go">Scroll of the Gods <input class="hvAANumber" name="scrollRound_Go" type="text"></label><br><input id="scroll_Av" type="checkbox"><label for="scroll_Av">Scroll of the Avatar <input class="hvAANumber" name="scrollRound_Av" type="text"></label><br><input id="scroll_Pr" type="checkbox"><label for="scroll_Pr">Scroll of Protection <input class="hvAANumber" name="scrollRound_Pr" type="text"></label><br><input id="scroll_Sw" type="checkbox"><label for="scroll_Sw">Scroll of Swiftness <input class="hvAANumber" name="scrollRound_Sw" type="text"></label><br><input id="scroll_Li" type="checkbox"><label for="scroll_Li">Scroll of Life <input class="hvAANumber" name="scrollRound_Li" type="text"></label><br><input id="scroll_Sh" type="checkbox"><label for="scroll_Sh">Scroll of Shadows <input class="hvAANumber" name="scrollRound_Sh" type="text"></label><br><input id="scroll_Ab" type="checkbox"><label for="scroll_Ab">Scroll of Absorption <input class="hvAANumber" name="scrollRound_Ab" type="text"></label></div>' +
  '<div class="hvAATab" id="hvAATab-Infusion"><input id="infusion" type="checkbox"><label for="infusion"><span class="hvAATitle"><l0>使用魔药</l0><l1>使用魔藥</l1><l2>Use Infusion</l2></span><br><l0>魔药属性与</l0><l1>魔藥屬性與</l1><l2>The style of infusion is the same as Attack Mode in </l2><a href="#hvAATab-Main"><l0>主要选项</l0><l1>主要選項</l1><l2>Main</l2></a><l0>里的攻击模式相同</l0><l1>裡的攻擊模式相同</l1><l2></l2></label><br><l0>战役模式</l0><l1>戰役模式</l1><l2>Battle type</l2>: <input id="infusionRoundType_ar" type="checkbox"><label for="infusionRoundType_ar">The Arena</label><input id="infusionRoundType_rb" type="checkbox"><label for="infusionRoundType_rb">Ring of Blood</label><input id="infusionRoundType_gr" type="checkbox"><label for="infusionRoundType_gr">GrindFest</label><input id="infusionRoundType_iw" type="checkbox"><label for="infusionRoundType_iw">Item World</label><input id="infusionRoundType_ba" type="checkbox"><label for="infusionRoundType_ba">Random Encounter</label><br><l01>使用条件：当前回合数</l01><l2>Conditions: Number of turns</l2> ≥ <input class="hvAANumber" name="infusionRoundNow" type="text"></div>' +
  '<div class="hvAATab" id="hvAATab-Alarm"><span class="hvAATitle"><l0>自定义警报</l0><l1>自定義警報</l1><l2>Alarm</l2></span><br><l0>注意：留空则使用默认音频，建议每个用户使用自定义音频</l0><l1>注意：留空則使用默認音頻，建議每個用戶使用自定義音頻</l1><l2>Note: Leave the box blank to use default audio, it\'s recommended for all user to use custom audio.</l2><div><l01>通用</l01><l2>Common</l2>: <input name="audio-default" type="text"><br><l0>错误</l0><l1>錯誤</l1><l2>Error</l2>: <input name="audio-Error" type="text"><br><l0>失败</l0><l1>失敗</l1><l2>Defeat</l2>: <input name="audio-Failed" type="text"><br><l0>答题</l0><l1>答題</l1><l2>Riddle</l2>: <input name="audio-Riddle" type="text"><br><l0>胜利</l0><l1>勝利</l1><l2>Victory</l2>: <input name="audio-Win" type="text"></div><div><l0>请将将要测试的音频文件的地址填入这里</l0><l1>請將將要測試的音頻文件的地址填入這裡</l1><l2>Plz put in the audio file address you want to test</l2>:<br><input class="hvAADebug" name="audio-Text" type="text"></div></div>' +
  '<div class="hvAATab" id="hvAATab-Rule"><span class="hvAATitle"><l0>攻击规则</l0><l1>攻擊規則</l1><l2>Attack Rule</l2></span> <a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md#attack_rule" target="_blank"><l01>示例</l01><l2>Example</l2></a><div>1. <l0>每回合计算敌人当前血量，血量最低的设置初始血量为10，其他敌人为当前血量倍数*10</l0><l1>每回合計算敌人當前血量，血量最低的設置初始血量為10，其他敌人為當前血量倍數*10</l1><l2>Each enemiy is assigned a number which is used to determine the target to attack, let\'s call that number Priority Weight or PW.</l2></div><div>2. <l0>初始权重与下述各Buff权重相加</l0><l1>初始權重與下述各Buff權重相加</l1><l2>PW(X) = 10 * Max_HP(X) / Min(Max_HP(All_enemies)) + Accumulated_Weight_of_Deprecating_Spells_In_Effect(X)</l2><br>Sleep: <input class="hvAANumber" name="weight_Sle" placeholder="5" step="0.1" type="text"> Blind: <input class="hvAANumber" name="weight_Bl" placeholder="3" step="0.1" type="text"> Slow: <input class="hvAANumber" name="weight_Slo" placeholder="3" step="0.1" type="text"> Imperil: <input class="hvAANumber" name="weight_Im" placeholder="-5" step="0.1" type="text"><br>MagNet: <input class="hvAANumber" name="weight_MN" placeholder="-4" step="0.1" type="text"> Silence: <input class="hvAANumber" name="weight_Si" placeholder="-4" step="0.1" type="text"> Drain: <input class="hvAANumber" name="weight_Dr" placeholder="-4" step="0.1" type="text"> Weaken: <input class="hvAANumber" name="weight_We" placeholder="-4" step="0.1" type="text"><br>Confuse: <input class="hvAANumber" name="weight_Co" placeholder="-1" step="0.1" type="text">Coalesced Mana: <input class="hvAANumber" name="weight_CM" placeholder="-5" step="0.1" type="text"> Stunned: <input class="hvAANumber" name="weight_Stun" placeholder="-4" step="0.1" type="text"></div><div>3. <l0>如果敌人相邻两只敌人已死（或不存在），则给其权重增加</l0><l1>如果敵人相鄰兩隻敵人已死（或不存在），則給其權重增加</l1><l2>If the enemy of which adjacent two enemies dead (or does not exist), then its PW increased</l2> <input class="hvAANumber" name="weight_Wall" placeholder="0.5" step="0.1" type="text"></div><div>4. <l0>计算出最终权重，攻击权重最小的敌人</l0><l1>計算出最終權重，攻擊權重最小的敌人</l1><l2>Whichever enemy has the lowest PW will be the target.</l2></div><div>5. <l0>如果你对各Buff权重有特别见解，请务必</l0><l1>如果你對各Buff權重有特別見解，請務必</l1><l2>If you have any suggestions, please </l2><a href="#hvAATab-About"><l0>告诉我</l0><l1>告訴我</l1><l2>let me know</l2></a>.</div></div>' +
  '<div class="hvAATab hvAACenter" id="hvAATab-About"><div><span><l0>反馈</l0><l1>反饋</l1><l2>Feedback</l2>: <a href="https://github.com/dodying/UserJs/issues/" target="_blank">1. GitHub</a><a href="https://greasyfork.org/scripts/18482/feedback" target="_blank">2. GreasyFork</a><a href="http://e-hentai.org/dmspublic/karma.php?u=2565471" target="_blank">3. +K</a><a href="https://gitter.im/dodying/UserJs" target="_blank">4. Gitter</a></span></div><div><span class="hvAATitle"><l0>当前状况</l0><l1>當前狀況</l1><l2>Current status</l2>: </span><br><l0>如果脚本长期暂停且网络无问题，请点击【临时修复】</l0><l1>如果腳本長期暫停且網絡無問題，請點擊【臨時修復】</l1><l2>If the script does not work and you are sure that it\'s not because of your internet, click [Try to fix]</l2><br><l0>战役模式</l0><l1>戰役模式</l1><l2>Battle type</l2>: <select class="hvAADebug" name="roundType"><option></option><option value="ar">The Arena</option><option value="rb">Ring of Blood</option><option value="gr">GrindFest</option><option value="iw">Item World</option><option value="ba">Random Encounter</option></select><br><l0>当前回合</l0><l1>當前回合</l1><l2>Current round</l2>: <input name="roundNow" class="hvAADebug" placeholder="1" type="text"> <l0>总回合</l0><l1>總回合</l1><l2>Total rounds</l2>: <input name="roundAll" class="hvAADebug" placeholder="1" type="text"><br><button class="hvAAFix"><l0>尝试修复</l0><l1>嘗試修復</l1><l2>Try to fix</l2></button></div><div class="hvAAQuickSite"><span class="hvAATitle"><l0>快捷站点</l0><l1>快捷站點</l1><l2>Quick Site</l2></span><br><l0>留空“姓名”输入框则会表示删除，修改完成后请及时保存</l0><l1>留空“姓名”輸入框則會表示刪除，修改完成後請及時保存</l1><l2> The input box left "name" blank will be deleted, after change please save in time.</l2><table><tbody><tr><td><l0>图标</l0><l1>圖標</l1><l2>ICON</l2></td><td><l0>名称</l0><l1>名稱</l1><l2>Name</l2></td><td><l0>链接</l0><l1>鏈接</l1><l2>Link</l2></td></tr></table><button class="quickSiteAdd"><l01>新增</l01><l2>Add</l2></button></div><div><button class="hvAAExport"><l0>导出设置</l0><l1>導出設置</l1><l2>Export Confiuration</l2></button><button class="hvAAImport"><l0>导入设置</l0><l1>導入設置</l1><l2>Import Confiuration</l2></button><textarea class="hvAAConfig"></textarea></div></div>' +
  '<div class="hvAATab hvAACenter" id="hvAATab-Recommend"><span class="hvAATitle"><l0>推荐脚本</l0><l1>推薦腳本</l1><l2>Recommend</l2></span><table><tbody><tr><td><l0>名称</l0><l1>名稱</l1><l2>Name</l2></td><td><l0>应用到</l0><l1>應用到</l1><l2>Applies to</l2></td><td><l0>说明</l0><l1>說明</l1><l2>Description</l2></td><td>URL</td></tr><tr><td><l0>【HV】购物清单</l0><l1>【HV】購物清單</l1><l2>hvBazaarList</l2></td><td><a href="?s=Bazaar&ss=is" target="_blank">Bazaar</a></td><td><l0>快速生成购物清单</l0><l1>快速生成購物清單</l1><l2>Quickly generate shopping lists</l2></td><td><a href="https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvBazaarList.user.js" target="_blank">Install</a></td></tr><tr><td><l0>【HV】喂食</l0><l1>【HV】餵食</l1><l2>hvFeed</l2></td><td><a href="?s=Bazaar&ss=ml" target="_blank">Monster Lab</a></td><td><l0>自动给大于100级的怪物喂开心药丸</l0><l1>自動給大於100級的怪物餵開心藥丸</l1><l2>Automatically feed monster of which level more than 100 on happy pills</l2></td><td><a href="https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvFeed.user.js" target="_blank">Install</a></td></tr><tr><td><l0>【HV】出售装备</l0><l1>【HV】出售裝備</l1><l2>hvSellEquipment</l2></td><td><a href="?s=Character&ss=ch" target="_blank">Character</a></td><td></td><td><a href="https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvSellEquipment.user.js" target="_blank">Install</a></td></tr><tr><td><l0>【HV】掉落监测</l0><l1>【HV】掉落監測</l1><l2>hvDropMonitor</l2></td><td></td><td></td><td><a href="https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvDropMonitor.user.js" target="_blank">Install</a></td></tr><tr><td>Reloader</td><td></td><td><l01>已内置</l01><l2>Built-in</l2></td><td><a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=2660&p=4384894&#entry4384894" target="_blank">E-Hentai Forums</a></td></tr><tr><td>RiddleLimiter Plus</td><td></td><td><l01>已内置</l01><l2>Built-in</l2></td><td><a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=1020&p=3000982&#entry3000982" target="_blank">E-Hentai Forums</a></td></tr><tr><td>HV Random Encounter Notification</td><td></td><td></td><td><a href="http://forums.e-hentai.org/index.php?showtopic=65126&st=1000&p=2990345&#entry2990345" target="_blank">E-Hentai Forums</a></td></tr><tr><td>HV Equipment Comparison</td><td></td><td></td><td><a href="http://forums.e-hentai.org/index.php?s=&showtopic=65126&view=findpost&p=4492842" target="_blank">E-Hentai Forums</a></td></tr><tr><td>HentaiVerse Better Equipment Shop</td><td></td><td></td><td><a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=800&p=2750319&#entry2750319" target="_blank">E-Hentai Forums</a></td></tr></tboby></table></div>' +
  '<div class="hvAATab" id="hvAATab-ChangeLog"><span class="hvAATitle"><l0>更新日志</l0><l1>更新日誌</l1><l2>Change log</l2></span><div>v2.67<br>1. Ether Tap: <l0>对魔力合流的敌人进行物理攻击</l0><l1>對魔力合流的敵人進行物理攻擊</l1><l2>Arcane Blow enemy which has Coalesced Mana</l2></div></div>' +
  '</div><div class="hvAAButtonBox hvAACenter"><button class="hvAAReset"><l0>重置设置</l0><l1>重置設置</l1><l2>Reset</l2></button><button class="hvAAApply"><l0>应用</l0><l1>應用</l1><l2>Apply</l2></button><button class="hvAACancel"><l01>取消</l01><l2>Cancel</l2></button></div>';
  gE('select[name="lang"]', optionBox).onchange = function () {
    gE('.hvAA-LangStyle').textContent = 'l' + this.value + '{display:inline!important;}';
    if (this.value === '0' || this.value === '1') gE('.hvAA-LangStyle').textContent += 'l01{display:inline!important;}';
    g('lang', this.value);
  }
  gE('.hvAAShowAbout', optionBox).onclick = function () {
    var i;
    var inputs = gE('.hvAADebug', 'all', optionBox);
    for (i = 0; i < inputs.length; i++) {
      if (getValue(inputs[i].name)) inputs[i].value = getValue(inputs[i].name);
    }
    this.onclick = null;
  }
  gE('input[name="pauseHotkeyStr"]', optionBox).onkeyup = function (e) {
    this.value = (e.keyCode >= 65 && e.keyCode <= 90) ? e.key.toUpperCase()  : e.key;
    gE('input[name="pauseHotkeyCode"]', optionBox).value = e.keyCode;
  }
  gE('.autoArenaReset', optionBox).onclick = function () {
    if (_alert(1, '是否继续？', '是否繼續？', 'Continue?')) {
      delValue('arena');
    }
  }
  gE('.testNotification', optionBox).onclick = function () {
    _alert(0, '接下来开始预处理。\n如果询问是否允许，请选择允许', '接下來開始預處理。\n如果詢問是否允許，請選擇允許', 'Now, pretreat.\nPlease allow to receive notifications if you are asked for permission');
    setNotice('Test');
  }
  gE('.testAlert', optionBox).onclick = function () {
    _alert(0, '接下来开始预处理。\n关闭本警告框之后，请切换到其他标签页，\n并在足够长的时间后再打开本标签页', '接下來開始預處理。\n關閉本警告框之後，請切換到其他標籤頁，\n並在足夠長的時間後再打開本標籤頁', 'Now, pretreat.\nAfter dismissing this alert, focus other tab,\nfocus this tab again after long time.');
    setTimeout(function () {
      _alert(0, '请勾选“允许来自 hentaiverse.org 的对话框将您带往标签页”', '请勾选“允许来自 hentaiverse.org 的对话框带您前往分页”', 'Please check "allow dialogs from hentaiverse.org to take you to their tab"');
    }, 3000);
  }
  gE('.hvAAShowLevels', optionBox).onclick = function () {
    gE('.hvAAArenaLevels').style.display = (gE('.hvAAArenaLevels').style.display === 'block') ? 'none' : 'block';
  }
  gE('.hvAAArenaLevels', optionBox).onclick = function (e) {
    if (e.target.tagName !== 'INPUT') return;
    var valueArray = e.target.value.split(',');
    var levels = gE('input[name="autoArenaLevels"]').value;
    var value = gE('input[name="autoArenaValue"]').value;
    if (e.target.checked) {
      levels += (levels) ? ',' + valueArray[0] : valueArray[0];
      value += (value) ? ',' + valueArray[1] : valueArray[1];
    } else {
      levels = levels.replace(new RegExp('(^|,)' + valueArray[0] + '(,|$)'), '$2').replace(/^,/, '');
      value = value.replace(new RegExp('(^|,)' + valueArray[1] + '(,|$)'), '$2').replace(/^,/, '');
    }
    gE('input[name="autoArenaLevels"]').value = levels;
    gE('input[name="autoArenaValue"]').value = value;
  }
  gE('input[name="audio-Text"]', optionBox).onchange = function () {
    if (this.value === '') return;
    if (!/^http(s)?:|^ftp:/.test(this.value)) {
      _alert(0, '地址必须以"http:","https:","ftp:"开头', '地址必須以"http:","https:","ftp:"開頭', 'The address must start with "http:", "https:", and "ftp:"');
      return;
    }
    _alert(0, '接下来将测试该音频\n如果该音频无法播放或无法载入，请变更\n请测试完成后再键入另一个音频', '接下來將測試該音頻\n如果該音頻無法播放或無法載入，請變更\n請測試完成後再鍵入另一個音頻', 'The audio will be tested after you close this prompt\nIf the audio doesn\'t load or play, change the url');
    var box = cE('div');
    box.innerHTML = this.value;
    var audio = cE('audio');
    audio.controls = true;
    audio.src = this.value;
    box.appendChild(audio);
    gE('#hvAATab-Alarm').appendChild(box);
    audio.play();
  }
  gE('.hvAAFix', optionBox).onclick = function () {
    var inputs = gE('.hvAADebug[name^="round"]', 'all', optionBox);
    for (var i = 0; i < inputs.length; i++) {
      setValue(inputs[i].name, inputs[i].value || inputs[i].placeholder);
    }
  }
  gE('.quickSiteAdd', optionBox).onclick = function () {
    var tr = cE('tr');
    tr.innerHTML = '<td><input class="hvAADebug" type="text"></td><td><input class="hvAADebug" type="text"></td><td><input class="hvAADebug" type="text"></td>';
    gE('.hvAAQuickSite>table>tbody', optionBox).appendChild(tr);
  }
  gE('.hvAAConfig', optionBox).onclick = function () {
    this.style.height = 0;
    this.style.height = this.scrollHeight + 'px';
    this.select();
  }
  gE('.hvAAExport', optionBox).onclick = function () {
    gE('.hvAAConfig').value = getValue('option');
  }
  gE('.hvAAImport', optionBox).onclick = function () {
    var option = gE('.hvAAConfig').value;
    if (!option) return;
    if (_alert(1, '是否继续？', '是否繼續？', 'Continue?')) {
      setValue('option', option);
      goto();
    }
  }
  gE('.hvAAReset', optionBox).onclick = function () {
    if (_alert(1, '是否继续？', '是否繼續？', 'Continue?')) {
      delValue('option');
      goto();
    }
  }
  gE('.hvAAApply', optionBox).onclick = function () {
    function highlight(ele, time) {
      gE(ele, optionBox).style.border = '1px solid red';
      setTimeout(function () {
        gE(ele, optionBox).style.border = '';
      }, time * 1000);
    }
    if (gE('select[name="attackStatus"] option[value="-1"]:checked', optionBox)) {
      _alert(0, '请选择攻击模式', '請選擇攻擊模式', 'Please select the attack mode');
      highlight('#attackStatus', 0.5);
      return;
    }
    var _option = new Object();
    alert(1);
    _option.version = (GM_info) ? GM_info.script.version.substring(0, 4)  : 1;
    alert(2);
    var inputs = gE('input,select', 'all', optionBox);
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].className === 'hvAADebug') {
        continue;
      } else if (inputs[i].className === 'hvAANumber') {
        _option[inputs[i].name] = parseFloat(inputs[i].value || inputs[i].placeholder);
      } else if (inputs[i].type === 'text') {
        _option[inputs[i].name] = inputs[i].value || inputs[i].placeholder;
      } else if (inputs[i].type === 'checkbox') {
        _option[inputs[i].id] = inputs[i].checked;
      } else if (inputs[i].type === 'select-one') {
        _option[inputs[i].name] = inputs[i].value;
      }
    }
    inputs = gE('.hvAAQuickSite input', 'all', optionBox);
    for (i = 0; 3 * i < inputs.length; i++) {
      if (i === 0) _option.quickSite = new Array();
      if (inputs[3 * i + 1].value === '') continue;
      _option.quickSite.push({
        fav: inputs[3 * i].value,
        name: inputs[3 * i + 1].value,
        url: inputs[3 * i + 2].value
      });
    }
    setValue('option', _option);
    optionBox.style.display = 'none';
    goto();
  }
  gE('.hvAACancel', optionBox).onclick = function () {
    optionBox.style.display = 'none';
  }
  gE('body').appendChild(optionBox);
  if (g('option')) {
    var inputs = gE('input,select', 'all', optionBox);
    for (var i = 0; i < inputs.length; i++) {
      if (g('option') [inputs[i].name] || g('option') [inputs[i].id]) {
        if (inputs[i].type === 'text' || inputs[i].type === 'select-one' || inputs[i].type === 'number') {
          inputs[i].value = g('option') [inputs[i].name];
        } else if (inputs[i].type === 'checkbox') {
          inputs[i].checked = g('option') [inputs[i].id];
        }
      }
    }
    if (g('option').quickSite) {
      var quickSite = g('option').quickSite;
      var tr;
      for (i = 0; i < quickSite.length; i++) {
        tr = cE('tr');
        tr.innerHTML = '<td><input class="hvAADebug" type="text" value="' + quickSite[i].fav + '"></td><td><input class="hvAADebug" type="text" value="' + quickSite[i].name + '"></td><td><input class="hvAADebug" type="text" value="' + quickSite[i].url + '"></td>';
        gE('.hvAAQuickSite>table>tbody', optionBox).appendChild(tr);
      }
    }
  }
}
function riddleAlert() { //答题警报
  if (g('option').riddleAlert && location.hash !== '#riddleAlert') {
    goto('riddleAlert', true);
    alert('RIDDLE');
  }
  setAlert('Riddle', 'loop');
  var answers = [
    'A',
    'B',
    'C'
  ];
  document.onkeydown = function (e) {
    if (gE('.hvAAAlert')) gE('.hvAAAlert').parentNode.removeChild(gE('.hvAAAlert'));
    if (/^[abc]$/i.test(e.key)) {
      riddleSubmit(e.key.toUpperCase());
    } else if (/^[123]$/.test(e.key)) {
      riddleSubmit(answers[e.key - 1]);
    }
    this.onkeydown = null;
  }
  if (g('option').riddleRadio) {
    var bar = gE('body').appendChild(cE('div'));
    bar.className = 'answerBar';
    for (var i = 0; i < answers.length; i++) {
      var button = bar.appendChild(cE('div'));
      button.value = answers[i];
      button.onclick = function () {
        riddleSubmit(this.value);
      };
    }
  }
  for (var i = 0; i < 30; i++) {
    setTimeout(function () {
      if (typeof g('time') === 'undefined') {
        var timeDiv = gE('#riddlecounter>div>div', 'all');
        if (timeDiv.length === 0) return;
        var time = '';
        for (var j = 0; j < timeDiv.length; j++) {
          time = (timeDiv[j].style.backgroundPosition.match(/(\d+)px$/) [1] / 12).toString() + time;
        }
        g('time', parseInt(time));
      } else {
        var time = g('time');
        time--;
        g('time', time);
      }
      document.title = time;
      if (time <= g('option').riddleAnswerTime) {
        if (!gE('#riddlemaster').value) {
          gE('#riddlemaster').value = answers[parseInt(Math.random() * 3)];
        }
        gE('#riddleform').submit();
      }
    }, i * 1000);
  }
  function riddleSubmit(answer) {
    gE('#riddlemaster').value = answer;
    gE('#riddleform').submit();
  }
}
function pauseChange() { //暂停状态更改
  if (getValue('disabled')) {
    gE('.pauseChange').innerHTML = '<l0>暂停</l0><l1>暫停</l1><l2>Pause</l2>';
    delValue(0);
    main();
  } else {
    gE('.pauseChange').innerHTML = '<l0>继续</l0><l1>繼續</l1><l2>Continue</l2>';
    setValue('disabled', true);
    g('end', true);
  }
}
function quickSite() { //快捷站点
  var quickSiteBar = cE('div');
  quickSiteBar.className = 'quickSiteBar';
  quickSiteBar.innerHTML = '<span><a href="javascript:void(0);"class="quickSiteBarToggle">&lt;&lt;</a></span><span><a href="http://tieba.baidu.com/f?kw=hv网页游戏"target="_blank"><img src="https://www.baidu.com/favicon.ico" class="favicon"></img>贴吧</a></span><span><a href="https://forums.e-hentai.org/index.php?showforum=76"target="_blank"><img src="https://forums.e-hentai.org/favicon.ico" class="favicon"></img>Forums</a></span>';
  if (g('option').quickSite) {
    var quickSite = g('option').quickSite;
    for (var i = 0; i < quickSite.length; i++) {
      quickSiteBar.innerHTML += '<span><a href="' + quickSite[i].url + '"target="_blank">' + ((quickSite[i].fav) ? '<img src="' + quickSite[i].fav + '"class="favicon"></img>' : '') + quickSite[i].name + '</a></span>';
    }
  }
  gE('.quickSiteBarToggle', quickSiteBar).onclick = function () {
    var spans = gE('span', 'all', quickSiteBar);
    for (var i = 1; i < spans.length; i++) {
      spans[i].style.display = (this.textContent === '<<') ? 'none' : 'block';
    }
    this.textContent = (this.textContent === '<<') ? '>>' : '<<';
  }
  gE('body').appendChild(quickSiteBar);
}
function reloader() {
  var script = cE('script');
  script.textContent = '(' + (function () {
    document.getElementById('battleform').submit = function () {
      document.getElementById('hvAAReloader').click();
    }
  }).toString() + ')()';
  gE('head').appendChild(script);
  var a = cE('a');
  a.id = 'hvAAReloader';
  a.onclick = function () { //基本来自https://forums.e-hentai.org/index.php?showtopic=65126&st=2660&p=4384894&#entry4384894
    var inputs = gE('#battleform>input', 'all');
    var serializedForm = '';
    for (var i = 0; i < inputs.length; i++) {
      if (i !== 0) serializedForm += '&';
      serializedForm += inputs[i].id + '=' + inputs[i].value;
    }
    if (g('option').delayAlert) var delayAlert = setTimeout(setAlert, g('option').delayAlertTime * 1000);
    if (g('option').delayReload) var delayReload = setTimeout(goto, g('option').delayReloadTime * 1000);
    post(location.href, serializedForm, function (e) {
      if (g('option').delayAlert) clearTimeout(delayAlert);
      if (g('option').delayReload) clearTimeout(delayReload);
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
  gE('body').appendChild(a);
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
  arena.array = arena.array || g('option').autoArenaValue.split(',');
  post(location.href, 'recover=all', function () { //回复
    post('?s=Battle&ss=ar', 'arenaid=' + arena.array[0], function () {
      document.title = _alert( - 1, '竞技场开始', '競技場開始', 'Arena start');
      arena.array.splice(0, 1);
      if (arena.array.length === 0) arena.isOk = true;
      setValue('arena', arena);
      goto();
    });
  });
}
function setAlert(e, times) { //发出警报
  e = e || 'default';
  if (g('option').notification) setNotice(e);
  if (!g('option').alert) return;
  var fileType = (/Chrome|Safari/.test(navigator.userAgent)) ? '.mp3' : '.wav';
  //var fileType = '.mp3';
  var audio = cE('audio');
  audio.className = 'hvAAAlert';
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
    if (gE('.hvAAAlert')) gE('.hvAAAlert').parentNode.removeChild(gE('.hvAAAlert'));
    this.onmousemove = null;
  }
}
function continueBattle() { //自动前进
  if (g('monsterAlive') > 0) {
    setAlert('Failed', 3);
    delValue(2);
  } else if (g('roundNow') !== g('roundAll')) {
    delValue(1);
    goto();
  } else if (g('roundNow') === g('roundAll')) {
    setAlert('Win');
    delValue(2);
    setTimeout(goto, 3 * 1000);
  }
  g('end', true);
  return;
}
function battleStart() { //New Round
  var battleLog = gE('#togpane_log>table>tbody>tr>td:nth-child(3)', 'all');
  g('roundType', (function () {
    if (getValue('roundType') && getValue('roundType') !== '') {
      return getValue('roundType');
    } else {
      var roundType;
      var temp = battleLog[battleLog.length - 2].textContent;
      if (!temp.match(/^Initializing/)) {
        roundType = '';
      } else if (temp.match(/^Initializing arena challenge/) && parseInt(temp.match(/\d+/) [0]) <= 33) {
        roundType = 'ar';
      } else if (temp.match(/^Initializing arena challenge/) && parseInt(temp.match(/\d+/) [0]) >= 105) {
        roundType = 'rb';
      } else if (temp.match(/^Initializing random encounter/)) {
        roundType = 'ba';
      } else if (temp.match(/^Initializing Item World/)) {
        roundType = 'iw';
      } else if (temp.match(/^Initializing Grindfest/)) {
        roundType = 'gr';
      } else {
        roundType = '';
      }
      setValue('roundType', roundType);
      return roundType;
    }
  }) ());
  if (/You lose \d+ Stamina/.test(battleLog[0].textContent)) {
    var losedStamina = parseInt(battleLog[0].textContent.match(/\d+/) [0]);
    if (losedStamina >= g('option').staminaLose) {
      setAlert('Error', 3);
      if (!_alert(1, '当前Stamina过低\n或Stamina损失过多\n是否继续？', '當前Stamina過低\n或Stamina損失過多\n是否繼續？', 'Continue?\nYou either have too little Stamina or have lost too much')) {
        pauseChange();
        return;
      }
    }
  }
  if (battleLog[battleLog.length - 1].textContent === 'Battle Start!') {
    delValue(1);
  } else if (!getValue('roundNow') && !getValue('monsterStatus')) {
    setValue('roundNow', 1);
    setValue('roundAll', 1);
    fixMonsterStatus();
  }
  if (!getValue('roundNow')) {
    var monsterStatus = new Array();
    var id = 0;
    for (var i = battleLog.length - 3; i > battleLog.length - 3 - g('monsterAll'); i--) {
      var hp = parseInt(battleLog[i].textContent.match(/HP=(\d+)$/) [1]);
      if (isNaN(hp)) hp = monsterStatus[monsterStatus.length - 1].hp;
      monsterStatus[id] = {
        order: id,
        id: (id === 9) ? 0 : id + 1,
        hp: hp
      };
      id = id + 1;
    }
    setValue('monsterStatus', monsterStatus);
    g('monsterStatus', monsterStatus);
    var round = battleLog[battleLog.length - 2].textContent.match(/\(Round (\d+) \/ (\d+)\)/);
    var roundNow;
    var roundAll;
    if (g('roundType') !== 'ba' && round !== null) {
      roundNow = parseInt(round[1]);
      roundAll = parseInt(round[2]);
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
}
function battleInfo() { //战斗战况
  if (!gE('.hvAALog')) {
    var div = cE('div');
    div.className = 'hvAALog';
    gE('div.clb').insertBefore(div, gE('.cit'));
  }
  var status = [
    '<l0>物理</l0><l1>物理</l1><l2>Physical</l2>',
    '<l0>火</l0><l1>火</l1><l2>Fire</l2>',
    '<l0>冰</l0><l1>冰</l1><l2>Cold</l2>',
    '<l0>雷</l0><l1>雷</l1><l2>Elec</l2>',
    '<l0>风</l0><l1>風</l1><l2>Wind</l2>',
    '<l0>圣</l0><l1>聖</l1><l2>Divine</l2>',
    '<l0>暗</l0><l1>暗</l1><l2>Forbidden</l2>'
  ];
  gE('.hvAALog').innerHTML = '<l0>运行次数</l0><l1>運行次數</l1><l2>Turns</l2>: ' + g('runtime') + '<br><l0>回合</l0><l1>回合</l1><l2>Round</l2>: ' + g('roundNow') + '/' + g('roundAll') + '<br><l0>攻击模式</l0><l1>攻擊模式</l1><l2>Mode</l2>: ' + status[g('attackStatus')] + '<br><l0>存活Boss</l0><l1>存活Boss</l1><l2>Bosses</l2>: ' + g('bossAlive') + '<br><l0>敌人</l0><l1>敌人</l1><l2>Monsters</l2>: ' + g('monsterAlive') + '/' + g('monsterAll');
  document.title = g('runtime') + '||' + g('roundNow') + '/' + g('roundAll') + '||' + g('monsterAlive') + '/' + g('monsterAll');
}
function autoUseGem() { //自动使用宝石
  var Gem = gE('#ikey_p').textContent;
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
  if ((g('mp') < g('option').mp3 || g('sp') < g('option').sp3 || g('hp') <= g('option').hp3) && g('option').lastElixir && gE('.bti3>div[onmouseover*="Last Elixir"]')) {
    gE('.bti3>div[onmouseover*="Last Elixir"]').click();
    g('end', true);
    return;
  }
}
function autoUseScroll() { //自动使用卷轴
  var scrollLib = {
    Go: {
      name: 'Scroll of the Gods',
      mult: '3',
      img1: 'absorb',
      img2: 'shadowveil',
      img3: 'sparklife'
    },
    Av: {
      name: 'Scroll of the Avatar',
      mult: '2',
      img1: 'haste',
      img2: 'protection'
    },
    Pr: {
      name: 'Scroll of Protection',
      mult: '1',
      img1: 'protection'
    },
    Sw: {
      name: 'Scroll of Swiftness',
      mult: '1',
      img1: 'haste'
    },
    Li: {
      name: 'Scroll of Life',
      mult: '1',
      img1: 'sparklife'
    },
    Sh: {
      name: 'Scroll of Shadows',
      mult: '1',
      img1: 'shadowveil'
    },
    Ab: {
      name: 'Scroll of Absorption',
      mult: '1',
      img1: 'absorb'
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
    Pr: {
      name: 'Protection',
      id: '411',
      img: 'protection'
    },
    SL: {
      name: 'Spark of Life',
      id: '422',
      img: 'sparklife'
    },
    SS: {
      name: 'Spirit Shield',
      id: '423',
      img: 'spiritshield'
    },
    Ha: {
      name: 'Haste',
      id: '412',
      img: 'haste'
    },
    AF: {
      name: 'Arcane Focus',
      id: '432',
      img: 'arcanemeditation',
    },
    He: {
      name: 'Heartseeker',
      id: '431',
      img: 'heartseeker'
    },
    Re: {
      name: 'Regen',
      id: '312',
      img: 'regen'
    },
    SV: {
      name: 'Shadow Veil',
      id: '413',
      img: 'shadowveil'
    },
    Ab: {
      name: 'Absorb',
      id: '421',
      img: 'absorb',
    }
  };
  var name2Skill = {
    Protection: 'Pr',
    'Spark of Life': 'SL',
    'Spirit Shield': 'SS',
    Hastened: 'Ha',
    'Arcane Focus': 'AF',
    Heartseeker: 'He',
    Regen: 'Re',
    'Shadow Veil': 'SV'
  };
  if (gE('div.bte>img[src*="channeling"]')) {
    var buff = gE('div.bte>img', 'all');
    if (buff.length > 0) {
      for (var n = 0; n < buff.length; n++) {
        var spellName = buff[n].getAttribute('onmouseover').match(/'(.*?)'/) [1];
        var buffLastTime = parseInt(buff[n].getAttribute('onmouseover').match(/\(.*,.*, (.*?)\)$/) [1]);
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
  var infusionLib = [
    ,
    {
      name: 'Infusion of Flames',
      img: 'fireinfusion'
    },
    {
      name: 'Infusion of Frost',
      img: 'coldinfusion'
    },
    {
      name: 'Infusion of Lightning',
      img: 'elecinfusion'
    },
    {
      name: 'Infusion of Storms',
      img: 'windinfusion'
    },
    {
      name: 'Infusion of Divinity',
      img: 'holyinfusion'
    },
    {
      name: 'Infusion of Darkness',
      img: 'darkinfusion'
    }
  ];
  if (gE('.bti3>div[onmouseover*="' + infusionLib[g('attackStatus')].name + '"]') && !gE('div.bte>img[src*="' + infusionLib[[g('attackStatus')]].img + '"]')) {
    gE('.bti3>div[onmouseover*="' + infusionLib[g('attackStatus')].name + '"]').click();
    g('end', true);
    return;
  }
}
function countMonsterHP() { //统计敌人血量
  var monsterHp = gE('div.btm4>div.btm5:nth-child(1)', 'all');
  var monsterStatus = g('monsterStatus');
  var i;
  for (i = 0; i < monsterHp.length; i++) {
    if (gE('img[src="/y/s/nbardead.png"]', monsterHp[i])) {
      monsterStatus[i].isDead = true;
      monsterStatus[i].hpNow = Infinity;
    } else {
      monsterStatus[i].isDead = false;
      monsterStatus[i].hpNow = Math.floor(monsterStatus[i].hp * parseFloat(gE('div.chbd>img.chb2', monsterHp[i]).style.width) / 120) + 1;
    }
    monsterStatus[i].wall = (i === 0 || i === monsterHp.length - 1) ? 1 : 0;
  }
  for (i = 0; i < monsterStatus.length; i++) {
    if (monsterStatus[i].isDead) {
      if (i === 0) {
        monsterStatus[i + 1].wall++;
      } else if (i === monsterHp.length - 1) {
        monsterStatus[i - 1].wall++;
      } else {
        monsterStatus[i + 1].wall++;
        monsterStatus[i - 1].wall++;
      }
    }
  }
  setValue('monsterStatus', monsterStatus);
  monsterStatus.sort(objArrSort('hpNow'));
  var hpLowest = monsterStatus[0].hpNow;
  for (i = 0; i < monsterStatus.length; i++) {
    monsterStatus[i].initWeight = (monsterStatus[i].isDead) ? Infinity : monsterStatus[i].hpNow / hpLowest * 10;
    monsterStatus[i].finWeight = monsterStatus[i].initWeight - monsterStatus[i].wall * g('option').weight_Wall;
  }
  monsterStatus.sort(objArrSort('order'));
  var skillLib = {
    Sle: {
      name: 'Sleep',
      img: 'sleep'
    },
    Bl: {
      name: 'Blind',
      img: 'blind'
    },
    Slo: {
      name: 'Slow',
      img: 'slow'
    },
    Im: {
      name: 'Imperil',
      img: 'imperil'
    },
    MN: {
      name: 'MagNet',
      img: 'magnet'
    },
    Si: {
      name: 'Silence',
      img: 'silence'
    },
    Dr: {
      name: 'Drain',
      img: 'drainhp'
    },
    We: {
      name: 'Weaken',
      img: 'weaken'
    },
    Co: {
      name: 'Confuse',
      img: 'confuse'
    },
    CM: {
      name: 'Coalesced Mana',
      img: 'coalescemana'
    },
    Stun: {
      name: 'Stunned',
      img: 'wpn_stun'
    }
  };
  var monsterBuff = gE('div.btm6', 'all');
  for (i = 0; i < monsterBuff.length; i++) {
    for (j in skillLib) {
      monsterStatus[i].finWeight += (gE('img[src*="' + skillLib[j].img + '"]', monsterBuff[i])) ? g('option') ['weight_' + j] : 0;
    }
  }
  monsterStatus.sort(objArrSort('finWeight'));
  g('monsterStatus', monsterStatus);
}
function autoUseDeSkill() { //自动施法De技能
  var skillLib = {
    Sle: {
      name: 'Sleep',
      //id: '222',
      //turn: 39,
      img: 'sleep'
    },
    Bl: {
      name: 'Blind',
      //id: '231',
      //turn: 42,
      img: 'blind'
    },
    Slo: {
      name: 'Slow',
      //id: '221',
      //turn: 36,
      img: 'slow'
    },
    Im: {
      name: 'Imperil',
      id: '213',
      turn: 48,
      img: 'imperil'
    },
    MN: {
      name: 'MagNet',
      id: '233',
      turn: 27,
      img: 'magnet'
    },
    Si: {
      name: 'Silence',
      id: '232',
      turn: 41,
      img: 'silence'
    },
    Dr: {
      name: 'Drain',
      id: '211',
      turn: 42,
      img: 'drainhp'
    },
    We: {
      name: 'Weaken',
      id: '212',
      turn: 60,
      img: 'weaken'
    },
    Co: {
      name: 'Confuse',
      id: '223',
      turn: 21,
      img: 'confuse'
    }
  };
  var monsterBuff = gE('#mkey_' + g('monsterStatus') [0].id + '>.btm6');
  for (var i in skillLib) {
    if (g('option') ['debuffSkill_' + i] && isOn(skillLib[i].id) && !gE('img[src*="' + skillLib[i].img + '"]', monsterBuff)) {
      var imgs = gE('img', 'all', monsterBuff);
      if (imgs.length < 6 || parseInt(imgs[imgs.length - 1].getAttribute('onmouseover').match(/\(.*,.*, (.*?)\)$/) [1]) >= skillLib[i].turn) {
        gE(skillLib[i].id).click();
        gE('#mkey_' + g('monsterStatus') [0].id).click();
        g('end', true);
        return;
      } else {
        pauseChange();
        _alert(0, '无法正常施放De技能，请手动打怪一些回合', '無法正常施放De技能，請手動打怪一些回合', 'Can not cast de-skills normally, please manually attack some turns');
        g('end', true);
        return;
      }
    }
  }
}
function autoAttack() { //自动打怪
  if (g('option').spiritStance && g('oc') >= g('option').spiritStance_oc && g('sp') >= g('option').spiritStance_sp && !gE('#ckey_spirit[src*="spirit_a"]')) {
    gE('#ckey_spirit').click();
    g('end', true);
    return;
  }
  if (g('option').etherTap && gE('#mkey_' + g('monsterStatus') [0].id + '>div.btm6>img[src*="coalescemana"]') && (!gE('div.bte>img[onmouseover*="Ether Tap (x2)"]') || gE('div.bte>img[src*="wpn_et"][id*="effect_expire"]'))) { //待续
  } else if (g('attackStatus') !== 0) {
    if (g('monsterAlive') >= g('option').highSkill && isOn('1' + g('attackStatus') + '3')) {
      gE('1' + g('attackStatus') + '3').click();
    } else if (g('monsterAlive') >= g('option').middleSkill && isOn('1' + g('attackStatus') + '2')) {
      gE('1' + g('attackStatus') + '2').click();
    } else if (isOn('1' + g('attackStatus') + '1')) {
      gE('1' + g('attackStatus') + '1').click();
    }
  }
  if (g('option').skill && gE('#ckey_spirit[src*="spirit_a"]')) {
    if (g('option').skill_OFC && g('oc') >= g('option').skillOC_OFC && (g('monsterAlive') >= g('option').skillMonster_OFC || g('bossAlive') >= g('option').skillBoss_OFC) && isOn('1111')) {
      gE('1111').click();
    } else if (g('option').skill_FRD && g('oc') >= g('option').skillOC_FRD && (g('monsterAlive') >= g('option').skillMonster_FRD || g('bossAlive') >= g('option').skillBoss_FRD) && isOn('1101')) {
      gE('1101').click();
    } else if (g('option').skill_3 && g('oc') >= g('option').skillOC_3 && (g('monsterAlive') >= g('option').skillMonster_3 || g('bossAlive') >= g('option').skillBoss_3) && isOn('2' + g('option').fightingStyle + '03')) {
      gE('2' + g('option').fightingStyle + '03').click();
    } else if (g('option').skill_2 && g('oc') >= g('option').skillOC_2 && (g('monsterAlive') >= g('option').skillMonster_2 || g('bossAlive') >= g('option').skillBoss_2) && isOn('2' + g('option').fightingStyle + '02')) {
      gE('2' + g('option').fightingStyle + '02').click();
    } else if (g('option').skill_1 && g('oc') >= g('option').skillOC_1 && (g('monsterAlive') >= g('option').skillMonster_1 || g('bossAlive') >= g('option').skillBoss_1) && isOn('2' + g('option').fightingStyle + '01')) {
      gE('2' + g('option').fightingStyle + '01').click();
    }
  }
  gE('#mkey_' + g('monsterStatus') [0].id).click();
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
function goto(url, reload) {
  if (typeof url === 'undefined' && typeof reload === 'undefined') {
    location = location.search;
  } else {
    history.pushState(null, null, location.search + '#' + url);
    if (reload) location.reload();
  }
}
function g(item, key) { //全局变量
  window.hvAA = window.hvAA || new Object();
  if (item === undefined && key === undefined) {
    return window.hvAA;
  } else if (key === undefined) {
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
function setNotice(e) { //桌面通知
  if (window.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(function (status) {
      if (status === 'granted') {
        var notification = [
          {
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
            },
            Test: {
              title: '测试标题',
              text: '测试文本',
              time: 3
            }
          },
          {
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
            },
            Test: {
              title: '測試標題',
              text: '測試文本',
              time: 3
            }
          },
          {
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
            },
            Test: {
              title: 'testTitle',
              text: 'testBody',
              time: 3
            }
          }
        ][g('lang')][e];
        var n = new Notification(notification.title, {
          body: notification.text,
          icon: '/y/hentaiverse.png'
        });
        n.onclick = function () {
          if (gE('.hvAAAlert')) gE('.hvAAAlert').parentNode.removeChild(gE('.hvAAAlert'));
          n.close();
        }
        setTimeout(function () {
          n.close();
        }, 1000 * notification.time);
      }
    });
  }
}
function _alert(func, l0, l1, l2) {
  var lang = [
    l0,
    l1,
    l2
  ][g('lang')];
  if (func === - 1) {
    return lang;
  } else if (func === 0) {
    alert(lang);
  } else if (func === 1) {
    return confirm(lang);
  } else if (func === 2) {
    return prompt(lang);
  }
}
function fixMonsterStatus() { //修复monsterStatus
  document.title = _alert( - 1, 'monsterStatus错误，正在尝试修复', 'monsterStatus錯誤，正在嘗試修復', 'monsterStatus Error, trying to fix');
  var monsterStatus = new Array();
  var monsters = gE('div.btm2', 'all');
  for (var i = 0; i < monsters.length; i++) {
    monsterStatus.push({
      order: i,
      id: i + 1,
      hp: (monsters[i].style.background === '') ? 1000 : 100000
    });
  }
  setValue('monsterStatus', monsterStatus);
  goto();
}
function allImperiled() { //给所有敌人施放Imperil
  g('monsterStatus').sort(objArrSort('order'));
  var monsterBuff = gE('div.btm6', 'all');
  var j;
  for (var i = - 2; ; ) {
    if (!j && i >= monsterBuff.length) {
      j = true;
      i = 0;
    } else if (j && i >= monsterBuff.length) {
      break;
    } else if (!j) {
      i = i + 3;
    } else if (j) {
      i = i + 1;
    }
    if (i >= monsterBuff.length) continue;
    var imgs = gE('img', 'all', monsterBuff[i]);
    if (!gE('img[src*="imperil"]', monsterBuff[i]) && isOn('213') && !g('monsterStatus') [i].isDead) {
      if (imgs.length < 6 || parseInt(imgs[imgs.length - 1].getAttribute('onmouseover').match(/\(.*,.*, (.*?)\)$/) [1]) >= 50) {
        gE('213').click();
        gE('#mkey_' + g('monsterStatus') [i].id).click();
        g('end', true);
        return;
      } else {
        pauseChange();
        _alert(0, '无法正常施放De技能，请手动打怪一些回合', '無法正常施放De技能，請手動打怪一些回合', 'Can not cast de-skills normally, please manually attack some turns');
        g('end', true);
        return;
      }
    }
  }
  g('monsterStatus').sort(objArrSort('finWeight'));
}
