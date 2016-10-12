// ==UserScript==
// @name         hvAutoAttack
// @name:zh-CN   【HV】打怪
// @author       Dodying
// @namespace    https://github.com/dodying/UserJs
// @supportURL   https://github.com/dodying/UserJs/issues
// @updateURL    https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js
// @installURL   https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js
// @downloadURL  https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js
// @icon         https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @description  HV auto attack script, for the first user, should configure before use it.
// @description:zh-CN HV自动打怪脚本，初次使用，请先设置好选项，请确认字体设置正常
// @include      http://*hentaiverse.org/*
// @exclude      http://*hentaiverse.org/pages/showequip.php?*
// @version      2.534
// @compatible   Firefox + Greasemonkey
// @compatible   Chrome + Tampermonkey
// @compatible   Android + Firefox + usi
// @incompatible other not tested
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==
(function () {
  if (gE('form[name="ipb_login_form"]')) return;
  if (gE('img[src="http://ehgt.org/g/derpy.gif"]')) {
    reload();
    return;
  }
  if (gE('.f2rb')) {
    alert('使用默认字体可能使某些功能失效\n请更换字体');
    return;
  }
  optionButton();
  if (getValue('hvAAOption')) {
    g('option', getValue('hvAAOption', true));
    if (GM_info && g('option').version !== GM_info.script.version.substring(0, 4)) {
      alert('hvAutoAttack版本更新，请重新设置\r\n强烈推荐【重置设置】后再设置。');
      gE('#hvAABox').style.display = 'block';
      gE('.hvAAOptionRestore').focus();
      return;
    }
  } else {
    alert('请设置hvAutoAttack');
    gE('#hvAABox').style.display = 'block';
    return;
  }
  if (gE('#riddlecounter')) { //需要答题
    riddleAlert(); //答题警报
  } else if (gE('#togpane_log')) { //战斗中
    g('attackStatus', getValue('attackStatus') || g('option').attackStatus);
    g('runtime', 0);
    pauseButton();
    statusButton();
    if (g('option').reloader) reloader();
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
    document.title = 'hvAutoAttack暂停中';
    gE('.clb>button').innerHTML = '继续';
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
    alert('请点击临时修复');
    gE('#hvAABox').style.display = 'block';
    gE('#hvAATab-Othcer').style.zIndex = 1;
    gE('#hvAAFix').focus();
  }
  var bar = gE('.cwb2', 'all');
  g('hp', bar[0].offsetWidth / 120);
  g('mp', bar[1].offsetWidth / 120);
  g('sp', bar[2].offsetWidth / 120);
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
  if (g('option').debuffSkill && ((g('bossAlive') > 0 && g('option').debuffSkillBoss) || g('option').debuffSkillAll)) autoUseDeSkill(); //自动施法De技能
  if (g('end')) return;
  autoAttack(); //自动打怪
  if (g('end')) return;
}
function addStyle() {
  var globalStyle = cE('style');
  globalStyle.innerHTML = '' +
  '.csp{height:auto!important;}' +
  '.hvAAButton{top:4px;left:' + (gE('.stuffbox').offsetWidth - 24 - 50) + 'px;position:absolute;z-index:9999;cursor:pointer;background-color:#EDEBDF;}' +
  '#hvAABox{left:' + (gE('body').offsetWidth / 2 - 350) + 'px;top:50px;font-size:12pt!important;z-index:9999;width:700px;height:560px;display:none;position:absolute;text-align:justify;background-color:white;border-color:black;border-style:solid;}' +
  '#hvAABox .hvAACenter{text-align:center;}' +
  '#hvAABox .hvAASeparate{height:1px;background-color:black;}' +
  '#hvAABox .hvAATitle{font-weight:bolder;font-size:larger;}' +
  '.hvAATablist{position:relative;left:14px;}' +
  '.hvAATabmenu{position:absolute;left:-9px;}' +
  '.hvAATabmenu>span>a{display:block;padding:5px 10px;margin:0 10px 0 0;border:1px solid #91a7b4;border-radius:5px 0 0 5px;background-color:#E3F1F8;color:black;text-decoration:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}' +
  '.hvAATabmenu>span:hover{z-index:999999!important;left:-5px;position:relative;}' +
  '.hvAATab{position:absolute;width:605px;height:400px;left:36px;padding:15px;border:1px solid #91A7B4;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,0.1);font-size:14pt;color:#666;background:#FFF;overflow:auto;}' +
  '.hvAATab:target{z-index:1!important;}' +
  '.hvAATab input[type=text]{width:24px;}' +
  '.hvAATab label{cursor:pointer;}' +
  '.hvAATab table{font-size:smaller;border:2px solid black;border-collapse:collapse;}' +
  '.hvAATab table>tbody>tr>*{border:1px solid black;}' +
  '.hvAATab table td:nth-child(1){width:100px;}' +
  '.hvAATab table td:nth-child(2){width:150px;}' +
  '.hvAATab table input{width:200px!important;}' +
  '.hvAATab table textarea{resize:vertical;width:260px;max-height:400px;overflow:hidden;}' +
  '.hvAAOptionBoxButton{position:relative;top:443px;}' +
  'div.monsterHp{z-index:10;position:absolute;top:-1px;width:120px;text-align:center;font-size:8pt;font-weight:bolder;color:yellow;text-shadow:-1px -1px 0 Black,1px -1px 0 Black,-1px 1px 0 Black,1px 1px 0 Black;}' +
  'button{border-style:solid;border-color:gray;}' +
  '.hvAANew{width:25px;height:25px;float:left;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAMCAYAAACX8hZLAAAAcElEQVQ4jbVRSQ4AIQjz/59mTiZIF3twmnCwFAq4FkeFXM+5vCzohYxjPMtfxS8CN6iqQ7TfE0wrODxVbzJNgoaTo4CmbBO1ZWICouQ0DHaL259MEzaU+w8pZOdSjcUgaPJDHCbO0A2kuAiuwPGQ+wBms12x8HExTwAAAABJRU5ErkJggg==) no-repeat;background-position:center;}' +
  '.siteBar{position:absolute;top:100px;left:' + (gE('.stuffbox').offsetWidth + 2) + 'px;font-size:12pt;text-align:left;}' +
  '.siteBar>span{display:block;}' +
  '.siteBar>span>a{text-decoration:none;}' +
  '.favicon{width:16px;height:16px;margin:-3px 1px;}';
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
  '<h1 class="hvAACenter">hvAutoAttack设置<button class="hvAAOptionRestore">重置设置</button></h1><div class="hvAATablist">' +
  '<div class="hvAATabmenu"><span><a href="#hvAATab-Main">主要选项</a></span><span><a href="#hvAATab-Self">对自身技能</a></span><span><a href="#hvAATab-Debuff">De技能</a></span><span><a href="#hvAATab-Special">特殊技能</a></span><span><a href="#hvAATab-Scroll">卷轴</a></span><span><a href="#hvAATab-Infusion">魔药</a></span><span><a href="#hvAATab-Weight">权重规则</a></span><span><a href="#hvAATab-Storage">本地储存</a></span><span><a href="#hvAATab-Other">其他</a></span></div>' +
  '<div id="hvAATab-Main"class="hvAATab"style="z-index:1;"><div class="hvAACenter"title="1.使用宝石回复\n2.使用（技能、）Potion药水回复\n3.使用Elixir药水回复"><span style="color:green;">HP:1.<input name="hp1"placeholder="50"type="text">%&nbsp;2.<input name="hp2"placeholder="50"type="text">%&nbsp;3.<input name="hp3"placeholder="5"type="text">%&nbsp;</span><br><span style="color:blue;">MP:1.<input name="mp1"placeholder="70"type="text">%&nbsp;2.<input name="mp2"placeholder="10"type="text">%&nbsp;3.<input name="mp3"placeholder="5"type="text">%&nbsp;</span><br><span style="color:red;">SP:1.<input name="sp1"placeholder="75"type="text">%&nbsp;2.<input name="sp2"placeholder="50"type="text">%&nbsp;3.<input name="sp3"placeholder="5"type="text">%&nbsp;</span><br><input id="lastElixir"type="checkbox"><label for="lastElixir">当技能与药水CD时，使用Last&nbsp;Elixir。</div><div id="attackStatus"class="hvAACenter"style="color:red;"><b>*攻击模式</b>：<input type="radio"id="aS0"name="attackStatus"value="0"><label for="aS0">物理</label><input type="radio"id="aS1"name="attackStatus"value="1"><label for="aS1">火</label><input type="radio"id="aS2"name="attackStatus"value="2"><label for="aS2">冰</label><input type="radio"id="aS3"name="attackStatus"value="3"><label for="aS3">雷</label><input type="radio"id="aS4"name="attackStatus"value="4"><label for="aS4">风</label><input type="radio"id="aS5"name="attackStatus"value="5"><label for="aS5">圣</label><input type="radio"id="aS6"name="attackStatus"value="6"><label for="aS6">暗</label></div><div><b>技能施放条件</b>：中级：怪物存活数≥<input name="middleSkill"placeholder="3"type="text">；高级：怪物存活数≥<input name="highSkill"placeholder="5"type="text">。</div><div><input id="spiritStance"type="checkbox"><label for="spiritStance">Overcharge≥<input name="spiritStance_oc"placeholder="50"type="text">后，开启Spirit Stance。</label></div><div title="防止脚本莫名暂停"><input id="delayAlert"type="checkbox"><label for="delayAlert">页面停留<input name="delayAlertTime"placeholder="10"type="text">秒后，<b>警报</b>；</label><input id="delayReload"type="checkbox"><label for="delayReload">页面停留<input name="delayReloadTime"placeholder="15"type="text">秒后，<b>刷新页面</b>。</label></div><div><input id="riddleAnswer"type="checkbox"><label for="riddleAnswer">当【小马】答题时间≤<input name="riddleAnswerTime"placeholder="3"type="text">秒，如果输入框为空则<b>随机</b>生成答案并提交，否则直接提交。</label></div><div><input id="stamina"type="checkbox"><label for="stamina">当【Stamina】＜<input name="staminaValue"placeholder="10"type="text">时，自动逃跑。</label></div><div><div class="hvAANew"></div><input id="answerCount"type="checkbox"><label for="answerCount">记录Riddle的图片地址与答案。</label></div><div><div class="hvAANew"></div><input id="autoArena"type="checkbox"><label for="autoArena">在竞技场页面停留<input name="autoArenaTime"placeholder="120"type="text"></input>秒后，自动开始竞技场。</label></div><div><div class="hvAANew"></div><input id="reloader"type="checkbox"><label for="reloader">开启内置<b><a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=2660&p=4384894&#entry4384894"target="_blank"title="感谢网友【zsp40088】提出">Reloader</a>模式</b></label></div></div>' +
  '<div id="hvAATab-Self"class="hvAATab"><input type="checkbox"id="buffSkill"><label for="buffSkill"><span class="hvAATitle">对自身技能</span></label><br>施放条件（有一个成立就行）：<br>1、总回合数≥<input name="buffSkillAllRound"placeholder="12"type="text">。2、存活≥<input name="buffSkillBoss"placeholder="1"type="text">只Boss。3、遭遇战中，存在≥<input name="buffSkillMonster"placeholder="6"type="text">只怪物。<br><b>增益技能</b>（Buff不存在就施放的技能，按【施放顺序】排序）：<br><input type="checkbox"id="buffSkill_HD"><label for="buffSkill_HD">Health Draught</label><input type="checkbox"id="buffSkill_MD"><label for="buffSkill_MD">Mana Draught</label><input type="checkbox"id="buffSkill_SD"><label for="buffSkill_SD">Spirit Draught</label><br><input type="checkbox"id="buffSkill_Pr"><label for="buffSkill_Pr">Protection</label><input type="checkbox"id="buffSkill_SL"><label for="buffSkill_SL">Spark of Life</label><input type="checkbox"id="buffSkill_SS"><label for="buffSkill_SS">Spirit Shield</label><input type="checkbox"id="buffSkill_Ha"><label for="buffSkill_Ha">Haste</label><br><input type="checkbox"id="buffSkill_AF"><label for="buffSkill_AF">Arcane Focus</label><input type="checkbox"id="buffSkill_He"><label for="buffSkill_He">Heartseeker</label><input type="checkbox"id="buffSkill_Re"><label for="buffSkill_Re">Regen</label><input type="checkbox"id="buffSkill_SV"><label for="buffSkill_SV">Shadow Veil</label><input type="checkbox"id="buffSkill_Ab"><label for="buffSkill_Ab">Absorb</label><div></div>当<b>获得Channel时</b>，即施法只需1点MP，<br><b>先ReBuff</b>：buff存在≤<input name="channelReBuff"placeholder="5"type="text">回合时，重新使用该技能。<br><b>再施放Channel技能</b>（按【施放顺序】排序）：<br><input type="checkbox"id="channelSkill_Pr"><label for="channelSkill_Pr">Protection</label><input type="checkbox"id="channelSkill_SL"><label for="channelSkill_SL">Spark of Life</label><input type="checkbox"id="channelSkill_SS"><label for="channelSkill_SS">Spirit Shield</label><input type="checkbox"id="channelSkill_Ha"><label for="channelSkill_Ha">Haste</label><br><input type="checkbox"id="channelSkill_AF"><label for="channelSkill_AF">Arcane Focus</label><input type="checkbox"id="channelSkill_He"><label for="channelSkill_He">Heartseeker</label><input type="checkbox"id="channelSkill_Re"><label for="channelSkill_Re">Regen</label><input type="checkbox"id="channelSkill_SV"><label for="channelSkill_SV">Shadow Veil</label><input type="checkbox"id="channelSkill_Ab"><label for="channelSkill_Ab">Absorb</label></div>' +
  '<div id="hvAATab-Debuff"class="hvAATab"><input type="checkbox"id="debuffSkill"><label for="debuffSkill"><span class="hvAATitle">De技能</span>（按【施放顺序】排序，模式优先度1>2）：</label><br><input type="checkbox"id="debuffSkillBoss"><label for="debuffSkillBoss">模式1、<b>只对Boss施放</b>：</label><br><input type="checkbox"id="debuffSkillBoss_Im"><label for="debuffSkillBoss_Im">Imperil</label><input type="checkbox"id="debuffSkillBoss_MN"><label for="debuffSkillBoss_MN">MagNet</label><input type="checkbox"id="debuffSkillBoss_Si"><label for="debuffSkillBoss_Si">Silence</label><input type="checkbox"id="debuffSkillBoss_Dr"><label for="debuffSkillBoss_Dr">Drain</label><input type="checkbox"id="debuffSkillBoss_We"><label for="debuffSkillBoss_We">Weaken</label><input type="checkbox"id="debuffSkillBoss_Co"><label for="debuffSkillBoss_Co">Confuse</label><br>存活≥<input name="debuffSkillBossCount"placeholder="5"type="text">只怪物时，施放<input type="checkbox"id="debuffSkillBoss_Sle"><label for="debuffSkillBoss_Sle">Sleep</label><input type="checkbox"id="debuffSkillBoss_Bl"><label for="debuffSkillBoss_Bl">Blind</label><input type="checkbox"id="debuffSkillBoss_Slo"><label for="debuffSkillBoss_Slo">Slow</label><br><input type="checkbox"id="debuffSkillAll"><label for="debuffSkillAll"><b>模式2、对所有怪施放</b>：</label><br><input type="checkbox"id="debuffSkillAll_Im"><label for="debuffSkillAll_Im">Imperil</label><input type="checkbox"id="debuffSkillAll_MN"><label for="debuffSkillAll_MN">MagNet</label><input type="checkbox"id="debuffSkillAll_Si"><label for="debuffSkillAll_Si">Silence</label><input type="checkbox"id="debuffSkillAll_Dr"><label for="debuffSkillAll_Dr">Drain</label><input type="checkbox"id="debuffSkillAll_We"><label for="debuffSkillAll_We">Weaken</label><input type="checkbox"id="debuffSkillAll_Co"><label for="debuffSkillAll_Co">Confuse</label></div>' +
  '<div id="hvAATab-Special"class="hvAATab"><input id="specialSkill"type="checkbox"><label for="specialSkill"><span class="hvAATitle">特殊技能</span>：</label><br><input id="specialSkill_OFC"type="checkbox"><label for="specialSkill_OFC">Orbital Friendship Cannon：当存在≥<input name="specialSkillMonster_OFC"placeholder="8"type="text">只怪兽或存在≥<input name="specialSkillBoss_OFC"placeholder="1"type="text">Boss，使用该技能。</label><br><input id="specialSkill_FUS"type="checkbox"><label for="specialSkill_FUS">FUS RO DAH（跪求元素ID）：当存在≥<input name="specialSkillMonster_FUS"placeholder="8"type="text">只怪兽或存在≥<input name="specialSkillBoss_FUS"placeholder="1"type="text">Boss，使用该技能。</label></div>' +
  '<div id="hvAATab-Scroll"class="hvAATab"><input type="checkbox"id="scroll"><label for="scroll"><span class="hvAATitle">使用卷轴</span></label><br>战役模式：<input type="checkbox"id="scrollRoundType_ar"><label for="scrollRoundType_ar">竞技场</label><input type="checkbox"id="scrollRoundType_rb"><label for="scrollRoundType_rb">浴血擂台</label><input type="checkbox"id="scrollRoundType_gr"><label for="scrollRoundType_gr">压榨界</label><input type="checkbox"id="scrollRoundType_iw"><label for="scrollRoundType_iw">物品界</label><input type="checkbox"id="scrollRoundType_ba"><label for="scrollRoundType_ba">遭遇战</label><br>总体条件：当前回合数≥<input name="scrollRoundNow"placeholder="100"type="text">。<br><input id="scrollFirst"type="checkbox"><label for="scrollFirst">存在技能生成的Buff时，仍然使用卷轴。</label><br><input type="checkbox"id="scroll_Go"><label for="scroll_Go">Scroll of the Gods&nbsp;当前回合数≥<input name="scrollRound_Go"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Av"><label for="scroll_Av">Scroll of the Avatar&nbsp;当前回合数≥<input name="scrollRound_Av"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Pr"><label for="scroll_Pr">Scroll of Protection&nbsp;当前回合数≥<input name="scrollRound_Pr"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Sw"><label for="scroll_Sw">Scroll of Swiftness&nbsp;当前回合数≥<input name="scrollRound_Sw"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Li"><label for="scroll_Li">Scroll of Life&nbsp;当前回合数≥<input name="scrollRound_Li"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Sh"><label for="scroll_Sh">Scroll of Shadows&nbsp;当前回合数≥<input name="scrollRound_Sh"placeholder="0"type="text"></label><br><input type="checkbox"id="scroll_Ab"><label for="scroll_Ab">Scroll of Absorption&nbsp;当前回合数≥<input name="scrollRound_Ab"placeholder="0"type="text"></label></div>' +
  '<div id="hvAATab-Infusion"class="hvAATab"><input type="checkbox"id="infusion"><label for="infusion"><span class="hvAATitle">使用魔药：</span></label><select name="infusionStatus"><option value="1">Infusion of Flames</option><option value="2">Infusion of Frost</option><option value="3">Infusion of Lightning</option><option value="4">Infusion of Storms</option><option value="5">Infusion of Divinity</option><option value="6">Infusion of Darkness</option></select><br>战役模式：<input type="checkbox"id="infusionRoundType_ar"><label for="infusionRoundType_ar">竞技场</label><input type="checkbox"id="infusionRoundType_rb"><label for="infusionRoundType_rb">浴血擂台</label><input type="checkbox"id="infusionRoundType_gr"><label for="infusionRoundType_gr">压榨界</label><input type="checkbox"id="infusionRoundType_iw"><label for="infusionRoundType_iw">物品界</label><input type="checkbox"id="infusionRoundType_ba"><label for="infusionRoundType_ba">遭遇战</label><br>使用条件：当前回合数≥<input name="infusionRoundNow"placeholder="100"type="text">。</div>' +
  '<div id="hvAATab-Weight"class="hvAATab hvAACenter"><span class="hvAATitle">权重规则</span>&nbsp;<a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md#权重规则"target="_blank">示例</a><br>1、每回合计算怪物当前血量，血量最低的设置初始血量为10，其他怪物为当前血量倍数*10<br>2、初始权重与下述各Buff权重相加<br>Sleep:<input name="weight_Sle"placeholder="+5"type="text">&nbsp;Blind:<input name="weight_Bl"placeholder="+3"type="text">&nbsp;Slow:<input name="weight_Slo"placeholder="+3"type="text">&nbsp;Imperil:<input name="weight_Im"placeholder="-5"type="text">&nbsp;Coalesced Mana:<input name="weight_CM"placeholder="-5"type="text"><br>MagNet:<input name="weight_MN"placeholder="-4"type="text">&nbsp;Silence:<input name="weight_Si"placeholder="-4"type="text">&nbsp;Drain:<input name="weight_Dr"placeholder="-4"type="text">&nbsp;Weaken:<input name="weight_We"placeholder="-4"type="text">&nbsp;Confuse:<input name="weight_Co"placeholder="-1"type="text"><br>3、计算出最终权重，攻击权重最小的怪物<br>4、如果你对各Buff权重有特别见解，请务必<a href="https://github.com/dodying/UserJs/issues/2"target="_blank">告诉我</a></div>' +
  '<div id="hvAATab-Storage"class="hvAATab"></div>' +
  '<div id="hvAATab-Other"class="hvAATab"><span>反馈：<a href="https://github.com/dodying/UserJs/issues/"target="_blank">GitHub</a>或<a href="https://greasyfork.org/scripts/18482/feedback"target="_blank">GreasyFork</a>或<a href="http://e-hentai.org/dmspublic/karma.php?u=2565471"target="_blank">+K</a>或<a href="https://gitter.im/dodying/UserJs"target="_blank">聊天室</a>或<a href="https://forums.e-hentai.org/index.php?act=Msg&CODE=4&MID=2565471"target="_blank">论坛私信</a>&nbsp;&nbsp;</span><div class="hvAASeparate"></div><div class="hvAACenter"><span class="hvAATitle">当前状况</span>：<br>如果脚本长期暂停且网络无问题，请点击【临时修复】<br>战役模式：<select class="hvAADebug"name="roundType"><option></option><option value="ar">竞技场</option><option value="rb">浴血擂台</option><option value="gr">压榨界</option><option value="iw">物品界</option><option value="ba">遭遇战</option></select><br>当前回合：<input name="roundNow"class="hvAADebug"type="text"placeholder="1">&nbsp;总回合：<input name="roundAll"class="hvAADebug"type="text"placeholder="1"><br><b>各怪物及状况</b>：<div id="hvAAFixMonster"></div><button id="hvAAFix">临时修复</button></div></div>' +
  '</div><div class="hvAAOptionBoxButton hvAACenter"><button id="optionApply">确认</button>&nbsp;<button id="optionCancel">取消</button></div>';
  gE('.hvAAOptionRestore', optionBox).onclick = function () {
    if (!confirm('是否继续，此操作无法反悔')) return;
    delValue('hvAAOption');
    reload();
  }
  if (getValue('hvAAOption')) {
    var _option = getValue('hvAAOption', true);
    var inputs = gE('input,select', 'all', optionBox);
    for (var i = 0; i < inputs.length; i = i + 1) {
      if (inputs[i].className === 'hvAADebug' && getValue(inputs[i].name)) {
        inputs[i].value = getValue(inputs[i].name);
      } else if (_option[inputs[i].name] || _option[inputs[i].id]) {
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
  if (getValue('monsterStatus')) {
    var monsterStatus = getValue('monsterStatus', true);
    for (var i = 0; i < monsterStatus.length; i = i + 1) {
      var span = cE('span');
      span.innerHTML = ' id:' + monsterStatus[i].id + ' 总HP:<input name="monsterStatus_' + i + '_HP"class="hvAADebug"type="text"style="width:60px;">';
      if (i % 2 === 1) span.innerHTML += '<br>';
      gE('input', span).value = monsterStatus[i].hp;
      gE('#hvAAFixMonster', optionBox).appendChild(span);
    }
  }
  var storageLib = {
    'hvAAOption': {
      'name': '对象<br>各种设置',
      'mutiLine': true
    },
    'arenaDate': {
      'name': '日期字符串<br>上次自动竞技场的日期',
      'mutiLine': false
    },
    'arenaidArr': {
      'name': '数组<br>今天未进行的竞技场',
      'mutiLine': true
    },
    'arenaidOk': {
      'name': '布尔<br>今天的竞技场是否完成',
      'mutiLine': false
    },
    'answerCount': {
      'name': '对象数组<br>记录的答题情况',
      'mutiLine': true
    },
    'hvAADisabled': {
      'name': '布尔<br>脚本是否暂停',
      'mutiLine': false
    },
    'monsterStatus': {
      'name': '对象数组<br>怪兽情况',
      'mutiLine': true
    },
    'roundAll': {
      'name': '数值，总回合',
      'mutiLine': false
    },
    'roundNow': {
      'name': '数值，当前回合',
      'mutiLine': false
    },
    'roundType': {
      'name': '字符串，战斗类型',
      'mutiLine': false
    },
    'quickSite': {
      'name': '对象数组<br>快捷地址栏',
      'mutiLine': true
    }
  };
  var storageTable = cE('table');
  var storageName;
  var storagehtml = '<tbody><tr><th>名称</th><th>说明</th><th>值</th><th>修改</th><th>删除</th></tr>';
  for (var i = 0; i < localStorage.length; i++) {
    storageName = localStorage.key(i);
    storagehtml += '<tr><td>' + storageName + '</td><td>';
    if (storageName in storageLib) {
      storagehtml += storageLib[storageName].name + '</td><td>';
      storagehtml += (storageLib[storageName].mutiLine) ? '<textarea>' + getValue(storageName) + '</textarea>' : '<input type="text" value="' + getValue(storageName) + '">';
    } else {
      storagehtml += '未知</td><td><input type="text" value="' + getValue(storageName) + '">'
    }
    storagehtml += '</td><td><button onclick="var name=\'' + storageName + '\';var value=prompt(\'请输入新值\',localStorage[name]);if(value)localStorage[name]=value;">修改</button></td><td><button onclick="if(confirm(\'是否继续\'))localStorage.removeItem(\'' + storageName + '\')">删除</button></td></tr>';
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
    if (confirm('注意，修复只是临时作用使脚本能够运行！\n如果脚本能够继续运行请按取消！\n是否继续？')) {
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
      alert('请选择攻击模式');
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
      if (inputs[i].className === 'hvAADebug') continue;
      if (inputs[i].type === 'text' || inputs[i].type === 'select-one') {
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
  function riddleSubmit(answer) {
    gE('#riddlemaster').value = answer;
    gE('#riddleform').submit();
  }
  if (true) {
    var options = [
      'A',
      'B',
      'C'
    ];
    var bar = gE('body').appendChild(cE('div'));
    bar.style.cssText = 'z-index:1000;width:710px;height:40px;position:absolute;top:50px;left:345px;display:table;border-spacing:5px;';
    for (var i in options) {
      var button = bar.appendChild(cE('div'));
      button.style.cssText = 'border:red solid 4px;10px; display: table-cell; cursor:pointer';
      button.value = options[i];
      button.onclick = function () {
        riddleSubmit(this.value);
      };
      button.onmouseover = function () {
        this.style.background = 'rgba(63,207,208,0.20)';
      };
      button.onmouseout = function () {
        this.style.background = '';
      };
    }
  }
  var img = cE('img');
  img.src = '/pages/ponychart.jpg';
  gE('.csp').appendChild(img);
  var audio = cE('audio');
  document.onmousemove = function () {
    audio.pause();
  }
  document.onkeydown = function (e) {
    audio.pause();
    if (e.keyCode >= 49 && e.keyCode <= 51) {
      riddleSubmit(String.fromCharCode(e.keyCode + 16));
    } else if (e.keyCode >= 65 && e.keyCode <= 67) {
      riddleSubmit(String.fromCharCode(e.keyCode));
    } else if (e.keyCode >= 97 && e.keyCode <= 99) {
      riddleSubmit(String.fromCharCode(e.keyCode - 32));
    }
  }
  audio.src = 'https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/Riddle' + ((/Chrome|Safari/.test(window.navigator.userAgent)) ? '.mp3' : '.wav');
  audio.loop = true;
  audio.play();
  if (g('option').answerCount) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', gE('#riddleform>div:nth-child(3)>img').src);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function (e) {
      if (e.target.status >= 200 && e.target.status < 400) {
        g('size', e.target.response.byteLength);
      }
      xhr = null;
    }
    xhr.send(null);
    window.onbeforeunload = function () {
      var arr = getValue('answerCount', true) || new Array();
      arr.push({
        'url': gE('#riddleform>div:nth-child(3)>img').src,
        'answer': gE('#riddlemaster').value,
        'time': new Date().toLocaleString(),
        'lastTime': document.title,
        'size': g('size')
      });
      setValue('answerCount', arr);
    }
  }
  for (var i = 0; i < 30; i = i + 1) {
    setTimeout(function () {
      var timeDiv = gE('#riddlecounter>div>div', 'all');
      var time = '';
      for (var j = 0; j < timeDiv.length; j = j + 1) {
        var time = (parseInt(timeDiv[j].style.backgroundPosition.replace('0px -', '')) / 12).toString() + time;
      }
      document.title = time;
      if (g('option').riddleAnswer) {
        if (parseInt(time) <= parseInt(g('option').riddleAnswerTime)) {
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
      }
    }, i * 1000);
  }
}
function pauseButton() { //暂停按钮
  var button = cE('button');
  button.innerHTML = '暂停';
  button.onclick = function () {
    if (getValue('hvAADisabled')) {
      this.innerHTML = '暂停';
      delValue(0);
      main();
    } else {
      this.innerHTML = '继续';
      setValue('hvAADisabled', true);
    }
  }
  gE('.clb').insertBefore(button, gE('.clb>.cbl'))
}
function statusButton() { //选择模式按钮
  var button = cE('button');
  button.innerHTML = '临时攻击模式';
  button.onclick = function () {
    var p = parseInt(prompt('请选择（默认为火）：\n0.物理\n1.火\n2.冰\n3.雷\n4.风\n5.圣\n6.暗', ''));
    if (isNaN(p) || p < 0 || p > 6) return;
    setValue('attackStatus', p);
    reload();
  }
  gE('.clb').insertBefore(button, gE('.clb>.cbl'))
}
function quickSite() { //待续
  var siteBar = cE('div');
  siteBar.className = 'siteBar';
  siteBar.innerHTML = '<span><a href="javascript:"class="siteBarToggle">&lt;&lt;</a></span><span><a href="http://tieba.baidu.com/f?kw=hv网页游戏"target="_blank"><img src="https://www.baidu.com/favicon.ico" class="favicon"></img>贴吧</a></span><span><a href="https://forums.e-hentai.org/index.php?showforum=76"target="_blank"><img src="https://forums.e-hentai.org/favicon.ico" class="favicon"></img>论坛</a></span>';
  if (getValue('quickSite')) {
    var quickSite = getValue('quickSite', true);
    console.log(quickSite);
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
    var url = prompt('请输入链接，必填');
    if (!url) return;
    var name = prompt('请输入名称，可留空');
    var fav = prompt('请输入图标，可留空');
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
  if (gE('#battleaction').value === '0') {
    reload();
    return;
  }
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
    var popup = gE('.btcp', 'all', data);
    if (popup.length !== 0) gE('.btt').insertBefore(popup[0], gE('.btt').firstChild);
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
    document.title = '回复完成';
    post('?s=Battle&ss=ar', 'arenaid=' + arenaidArr[arenaidArr.length - 1], function () {
      document.title = '竞技场开始';
      arenaidArr.splice( - 1);
      setValue('arenaidArr', arenaidArr);
      reload();
    });
  });
}
function otherAlert(e, times) { //其他警报
  var audio = cE('audio');
  audio.src = 'https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/' + e + ((/Chrome|Safari/.test(window.navigator.userAgent)) ? '.mp3' : '.wav');
  var _time = 0;
  audio.addEventListener('ended', function () {
    _time = _time + 1;
    if (_time === times) {
      audio.pause();
      return;
    }
    audio.play();
  });
  audio.play();
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
    return;
  }
}
function battleInfo() { //战斗战况
  var attackStatusCN = {
    0: '物理',
    1: '火',
    2: '冰',
    3: '雷',
    4: '风',
    5: '圣',
    6: '暗'
  };
  if (!gE('#battleLog')) {
    var div = cE('div');
    div.id = 'battleLog';
    div.innerHTML = '运行次数：' + g('runtime') + '<br>回合：' + g('roundNow') + '/' + g('roundAll') + '<br>攻击模式：' + attackStatusCN[g('attackStatus')] + '<br>存活Boss：' + g('bossAlive') + '<br>怪物：' + g('monsterAlive') + '/' + g('monsterAll');
    div.style = 'font-size:20px;';
    gE('div.clb').insertBefore(div, gE('.cit'));
  } else {
    gE('#battleLog').innerHTML = '运行次数：' + g('runtime') + '<br>回合：' + g('roundNow') + '/' + g('roundAll') + '<br>攻击模式：' + attackStatusCN[g('attackStatus')] + '<br>存活Boss：' + g('bossAlive') + '<br>怪物：' + g('monsterAlive') + '/' + g('monsterAll');
  }
  document.title = g('runtime') + '||' + g('roundNow') + '/' + g('roundAll') + '||' + g('monsterAlive') + '/' + g('monsterAll');
}
function autoUseGem() { //自动使用宝石
  var Gem = gE('#ikey_p').getAttribute('onmouseover').replace(/battle.set_infopane_item\(\'(.*?)\'.*/, '$1');
  if (Gem === 'Health Gem' && g('hp') <= g('option').hp1 * 0.01) {
    gE('#ikey_p').click();
    g('end', true);
    return;
  } else if (Gem === 'Mana Gem' && g('mp') <= g('option').mp1 * 0.01) {
    gE('#ikey_p').click();
    g('end', true);
    return;
  } else if (Gem === 'Spirit Gem' && g('sp') <= g('option').sp1 * 0.01) {
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
  if (g('mp') < g('option').mp2 * 0.01) { //自动回魔
    gE('#quickbar').style.backgroundColor = 'blue';
    if (gE('.bti3>div[onmouseover*="Mana Potion"]')) {
      gE('.bti3>div[onmouseover*="Mana Potion"]').click();
      g('end', true);
      return;
    } else if (g('mp') <= g('option').mp3 * 0.01 && gE('.bti3>div[onmouseover*="Mana Elixir"]')) {
      gE('.bti3>div[onmouseover*="Mana Elixir"]').click();
      g('end', true);
      return;
    }
  }
  if (g('sp') < g('option').sp2 * 0.01) { //自动回精
    gE('#quickbar').style.backgroundColor = 'green';
    if (gE('.bti3>div[onmouseover*="Spirit Potion"]')) {
      gE('.bti3>div[onmouseover*="Spirit Potion"]').click();
      g('end', true);
      return;
    } else if (g('sp') <= g('option').sp3 * 0.01 && gE('.bti3>div[onmouseover*="Spirit Elixir"]')) {
      gE('.bti3>div[onmouseover*="Spirit Elixir"]').click();
      g('end', true);
      return;
    }
  }
  if (g('hp') <= g('option').hp2 * 0.01) { //自动回血
    if (!gE('.cwb2[src*="barsilver"]')) gE('#quickbar').style.backgroundColor = 'red';
    if (isOn('311')) {
      gE('311', 'id').click();
      g('end', true);
      return;
    }
    if (isOn('313')) {
      gE('313', 'id').click();
      g('end', true);
      return;
    }
    if (gE('.bti3>div[onmouseover*="Health Potion"]')) {
      gE('.bti3>div[onmouseover*="Health Potion"]').click();
      g('end', true);
      return;
    } else if (g('hp') <= g('option').hp3 * 0.01 && gE('.bti3>div[onmouseover*="Health Elixir"]')) {
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
      if (g('option') ['buffSkill_' + i] !== undefined) {
        if (g('option') ['buffSkill_' + i] && !gE('div.bte>img[src*="' + skillLib[i].img + '"]') && isOn(skillLib[i].id)) {
          gE(skillLib[i].id, 'id').click();
          g('end', true);
          return;
        }
      }
    }
    if (!gE('div.bte>img[src*="healthpot"]') && g('hp') < 1 && g('option').buffSkill_HD && gE('.bti3>div[onmouseover*="Health Draught"]')) {
      gE('.bti3>div[onmouseover*="Health Draught"]').click();
      g('end', true);
      return;
    } else if (!gE('div.bte>img[src*="manapot"]') && g('mp') < 1 && g('option').buffSkill_MD && gE('.bti3>div[onmouseover*="Mana Draught"]')) {
      gE('.bti3>div[onmouseover*="Mana Draught"]').click();
      g('end', true);
      return;
    } else if (!gE('div.bte>img[src*="spiritpot"]') && g('sp') < 1 && g('option').buffSkill_SD && gE('.bti3>div[onmouseover*="Spirit Draught"]')) {
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
      var hpDiv = cE('div');
      hpDiv.className = 'monsterHp';
      hpDiv.innerHTML = monsterStatus[i].hpNow + ' / ' + monsterStatus[i].hp;
      gE('.chbd', monsterHp[i]).appendChild(hpDiv);
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
      'id': '222',
      'img': 'sleep',
      'effect': true
    },
    'Bl': {
      'name': 'Blind',
      'id': '231',
      'img': 'blind',
      'effect': true
    },
    'Slo': {
      'name': 'Slow',
      'id': '221',
      'img': 'slow',
      'effect': true
    },
    'Im': {
      'name': 'Imperil',
      'id': '213',
      'img': 'imperil',
      'effect': false
    },
    'CM': {
      'name': 'Coalesced Mana',
      'id': '',
      'img': 'coalescemana',
      'effect': false
    },
    'MN': {
      'name': 'MagNet',
      'id': '233',
      'img': 'magnet',
      'effect': false
    },
    'Si': {
      'name': 'Silence',
      'id': '232',
      'img': 'silence',
      'effect': false
    },
    'Dr': {
      'name': 'Drain',
      'id': '211',
      'img': 'drainhp',
      'effect': false
    },
    'We': {
      'name': 'Weaken',
      'id': '212',
      'img': 'weaken',
      'effect': false
    },
    'Co': {
      'name': 'Confuse',
      'id': '223',
      'img': 'confuse',
      'effect': false
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
    if (g('option') ['debuffSkillBoss_' + i] && g('bossAlive') > 0 && g('option').debuffSkillBoss && skillLib[i].effect && g('monsterAlive') >= g('option').debuffSkillBossCount) {
      if (isOn(skillLib[i].id)) {
        for (var j = monsterStatus.length - 1; j >= 0; j--) {
          if (!monsterStatus[j].isDead) {
            var monsterFind = (!gE('#mkey_' + monsterStatus[j].id + '>.btm6>img[src*="' + skillLib[i].img + '"]')) ? true : false;
            break;
          }
        }
        if (monsterFind) {
          gE(skillLib[i].id, 'id').click();
          gE('#mkey_' + monsterStatus[j].id).click();
          g('end', true);
          return;
        }
      }
    } else if (((g('option') ['debuffSkillBoss_' + i] && g('bossAlive') > 0 && g('option').debuffSkillBoss) || (g('option') ['debuffSkillAll_' + i] && g('option').debuffSkillAll)) && !skillLib[i].effect) {
      if (isOn(skillLib[i].id) && !gE('#mkey_' + monsterStatus[0].id + '>.btm6>img[src*="' + skillLib[i].img + '"]')) {
        gE(skillLib[i].id, 'id').click();
        gE('#mkey_' + monsterStatus[0].id).click();
        g('end', true);
        return;
      }
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
  if (g('option').specialSkill && g('oc') >= 210) {
    /*
    if (g('option').specialSkill_FUS && (g('monsterAlive') > g('option').specialSkillMonster_FUS || g('bossAlive') > g('option').specialSkillBoss_FUS) && isOn('')) gE('', 'id').click();
    */
    if (g('option').specialSkill_OFC && (g('monsterAlive') > g('option').specialSkillMonster_OFC || g('bossAlive') > g('option').specialSkillBoss_OFC) && isOn('1111')) gE('1111', 'id').click();
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
        localStorage.removeItem('attackStatus');
        localStorage.removeItem('roundType');
      }
    }
  }
}
function reload() {
  location = location.search.replace(/#.*/, '');
}
function g(item, key) { //全局变量
  if (key === undefined) {
    return window[item];
  } else {
    window[item] = key;
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
