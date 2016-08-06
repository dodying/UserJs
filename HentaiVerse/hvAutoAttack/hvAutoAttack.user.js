// ==UserScript==
// @name        hvAutoAttack
// @name:zh-CN  【HV】打怪
// @name:zh-TW  【HV】打怪
// @author      Dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @description HV auto attack script, for the first user, should configure before use it.
// @description:zh-CN HV自动打怪脚本，初次使用，请先设置好选项
// @description:zh-TW HV自動打怪腳本，初次使用，請先設置好選項
// @include     http://hentaiverse.org/*
// @exclude     http://hentaiverse.org/pages/showequip.php?*
// @version     2.521
// @grant       GM_addStyle
// @run-at      document-end
// ==/UserScript==
if (ge(0, 'form[name="ipb_login_form"]')) return;
if (ge(0, 'img[src="http://ehgt.org/g/derpy.gif"]')) window.location = window.location.href;
OptionButton();
if (localStorage.HVAA_Setting) {
  var HVAA_Setting = JSON.parse(localStorage.HVAA_Setting);
  if (HVAA_Setting.version !== GM_info.script.version.substring(0, 4)) {
    alert('HV-AutoAttack版本更新，请重新设置\r\n强烈推荐【重置设置】后再设置。');
    if (confirm('是否查看帮助页面')) window.open('https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md');
    ge(0, '#HV_AutoAttack_Option').style.display = 'block';
    ge(0, '#HVAA_Setting_Clear').focus();
    window.HVAA_End = true;
    return;
  }
} else {
  alert('请设置HV-AutoAttack');
  if (confirm('是否查看帮助页面')) window.open('https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md');
  ge(0, '#HV_AutoAttack_Option').style.display = 'block';
  return;
}
RiddleAlert(); //答题警报
if (!ge(0, '#togpane_log')) {
  removeItemInStorage(2);
  return;
}
HotKey(); //设置全局快捷键
var Attack_Status = (!localStorage.HVAA_Attack_Status) ? HVAA_Setting.Attack_Status : localStorage.HVAA_Attack_Status;
if (HVAA_Setting.Delay_Alert) {
  setTimeout(function () {
    OtherAlert();
  }, HVAA_Setting.Delay_Alert_Time * 1000);
}
if (HVAA_Setting.Delay_Reload) {
  setTimeout(function () {
    window.location = window.location.href;
  }, HVAA_Setting.Delay_Reload_Time * 1000);
}
runtime = 0;
if (HVAA_Setting.Reloader) {
  AddPause();
  if (HVAA_Setting.Reloader_Masking) AddMasking(); //Reloader防止误操作
  var mo = new MutationObserver(main);
  mo.observe(document.all.leftpane, {
    childList: true,
    subtree: true
  });
}
main();
//////////////////////////////////////////////////
function main() { //主程序
  if (localStorage.HVAA_disabled) { //如果禁用
    document.title = '[HVAA_暂停]' + document.title;
    return;
  }
  if (HVAA_Setting.Stamina && parseInt(ge(0, '.fd4>div').innerHTML.replace('Stamina: ', '')) < parseInt(HVAA_Setting.Stamina_Value)) {
    ge(2, '1001').click;
    return;
  }
  runtime++;
  window.Monster_Count_All = ge(1, 'div.btm1').length;
  window.Monster_Count_Dead = ge(1, 'img[src*="nbardead"]').length;
  window.Monster_Count_Alive = Monster_Count_All - Monster_Count_Dead;
  window.Monster_Count_Boss = ge(1, 'div.btm2[style^="background:"]').length;
  window.Monster_Count_Boss_Dead = ge(1, 'div.btm1[style*="opacity:"] div.btm2[style*="background:"]').length;
  window.Monster_Count_Boss_Alive = Monster_Count_Boss - Monster_Count_Boss_Dead;
  CountRound(); //回合计数及自动前进并获取怪物总HP
  if (window.HVAA_End) {
    window.HVAA_End = false;
    return;
  }
  if (localStorage.HVAA_Monster_Status) {
    window.Monster_Status = JSON.parse(localStorage.HVAA_Monster_Status);
  } else {
    alert('请点击临时修复');
    ge(0, '#HV_AutoAttack_Option').style.display = 'block';
    ge(0, '#HVAA_Bu_Fi').style.zIndex = 1;
    ge(0, '#HVAA_Fix').focus();
  }
  window.HP = ge(1, '.cwb2') [0].offsetWidth / 120;
  window.MP = ge(1, '.cwb2') [1].offsetWidth / 120;
  window.SP = ge(1, '.cwb2') [2].offsetWidth / 120;
  window.oc = parseInt(ge(0, '.cwbt2').innerText);
  BattleInfo(); //战斗战况
  CountMonsterHP(); //统计怪物血量
  AutoUseGem(); //自动使用宝石
  if (window.HVAA_End) {
    window.HVAA_End = false;
    return;
  }
  DeadSoon(); //自动回血回魔
  if (window.HVAA_End) {
    window.HVAA_End = false;
    return;
  }
  if (HVAA_Setting.Scroll && Round_Now >= HVAA_Setting.Scroll_Now_Round && HVAA_Setting['Scroll_Round_Type_' + Round_Type]) AutoUseScroll(); //自动使用卷轴
  if (window.HVAA_End) {
    window.HVAA_End = false;
    return;
  }
  if (HVAA_Setting.Su_Ch_Skill) AutoUsePotAndSuSkill(); //自动使用药水、施法增益技能
  if (window.HVAA_End) {
    window.HVAA_End = false;
    return;
  }
  if (HVAA_Setting.UnCrazy_Mode && HP < HVAA_Setting.UnCrazy_Mode_HP * 0.01) {
    OtherAlert();
    if (!confirm('HP小于' + HVAA_Setting.UnCrazy_Mode_HP + '%，是否继续自动打怪？\r\n可能会死亡')) {
      localStorage.HVAA_disabled = true;
      return;
    }
  }
  if (HVAA_Setting.Infusions && Round_Now >= HVAA_Setting.Infusions_Now_Round && HVAA_Setting['Infusions_Round_Type_' + Round_Type]) AutoUseInfusions(); //自动使用魔药
  if (window.HVAA_End) {
    window.HVAA_End = false;
    return;
  }
  AutoUseDeSkill(); //自动施法De技能
  if (window.HVAA_End) {
    window.HVAA_End = false;
    return;
  }
  AutoAttack(); //自动打怪
} //////////////////////////////////////////////////

function ge(number, selector) { //获取元素
  if (number === 0) {
    return document.querySelector(selector);
  } else if (number === 1) {
    return document.querySelectorAll(selector);
  } else if (number === 2) {
    return document.getElementById(selector);
  }
} //////////////////////////////////////////////////

function AddPause() {
  var button = document.createElement('button');
  button.innerHTML = '暂停';
  button.onclick = function () {
    if (localStorage.HVAA_disabled) {
      this.innerHTML = '暂停';
      removeItemInStorage(0);
      main();
    } else {
      this.innerHTML = '继续';
      localStorage.HVAA_disabled = true;
    }
  }
  ge(0, '.clb').insertBefore(button, ge(0, '.clb>.cbl'))
}
function AddMasking() { //Reloader防止误操作
  var img = document.createElement('img');
  img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';
  img.style.position = 'absolute';
  img.style.width = document.all.mainpane.offsetWidth + 'px';
  img.style.height = document.all.mainpane.offsetHeight + 'px';
  img.style.top = document.all.mainpane.offsetTop + 'px';
  img.style.left = document.all.mainpane.offsetLeft + 'px';
  img.style.zIndex = '999';
  document.body.appendChild(img)
  var button = document.createElement('button');
  button.innerHTML = '【防止误操作】开启';
  button.onclick = function () {
    if (img.style.zIndex === '999') {
      img.style.zIndex = '0';
      button.innerHTML = '【防止误操作】关闭';
    } else {
      img.style.zIndex = '999';
      button.innerHTML = '【防止误操作】开启';
    }
  }
  ge(0, '.clb').insertBefore(button, ge(0, '.clb>.cbl'))
} //////////////////////////////////////////////////

function removeItemInStorage(i) {
  localStorage.removeItem('HVAA_disabled');
  if (i > 0) {
    localStorage.removeItem('HVAA_Round_Now');
    localStorage.removeItem('HVAA_Round_All');
    localStorage.removeItem('HVAA_Monster_Status');
    if (i > 1) {
      localStorage.removeItem('HVAA_Attack_Status');
      localStorage.removeItem('HVAA_Round_Type');
    }
  }
} //////////////////////////////////////////////////

function OptionButton() { //配置
  var HV_AutoAttack_Button = document.createElement('div');
  HV_AutoAttack_Button.id = 'HV_AutoAttack_Button';
  var Left = ge(0, '.stuffbox').offsetWidth - 24;
  HV_AutoAttack_Button.style = 'top:4px;left:' + Left + 'px;position:absolute;z-index:9999;';
  HV_AutoAttack_Button.innerHTML = '<a href="javascript:#"><img src="https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/Setting.png" /></a>';
  HV_AutoAttack_Button.querySelector('a').onclick = function () {
    if (ge(0, '#HV_AutoAttack_Option').style.display === 'none') {
      ge(0, '#HV_AutoAttack_Option').style.display = 'block';
    } else {
      ge(0, '#HV_AutoAttack_Option').style.display = 'none';
      window.history.pushState(null, '', window.location.href.replace(/#HVAA_[A-Za-z_]+$/, ''));
      window.history.replaceState(null, '', window.location.href);
    }
  };
  document.body.appendChild(HV_AutoAttack_Button);
  var HV_AutoAttack_Option = document.createElement('div');
  HV_AutoAttack_Option.id = 'HV_AutoAttack_Option';
  Left = document.documentElement.clientWidth / 2 - 350;
  HV_AutoAttack_Option.style = 'z-index:9999;width:700px;height:600px;display:none;position:absolute;left:' + Left + 'px;top:50px;text-align:left;background-color:white;border-color:black;border-style:solid;';
  GM_addStyle('#HV_AutoAttack_Option{font-size:12pt !important;}#HV_AutoAttack_Option .HVAA_tablist{position:relative;left:14px;}#HV_AutoAttack_Option .HVAA_tab_content{position:absolute;width:605px;height:440px;left:36px;padding:15px;border:1px solid #91a7b4;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,0.1);font-size:1.2em;line-height:1.5em;color:#666;background:#fff;overflow:hidden;}#HV_AutoAttack_Option *:target{z-index:1 !important;}#HV_AutoAttack_Option .HVAA_tabmenu{position:absolute;left: -9px;}#HV_AutoAttack_Option .HVAA_tabmenu span a{display:block;padding:5px 10px;margin:0 10px 0 0;border:1px solid #91a7b4;border-radius:5px 0 0 5px;background:#e3f1f8;color:black;text-decoration:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;}#HV_AutoAttack_Option .HVAA_tabmenu span:hover{z-index:999999 !important;left:-5px;position:relative;}#HV_AutoAttack_Option input[type="text"]{width:24px;}#HV_AutoAttack_Option .HVAA_center{text-align:center;}#HV_AutoAttack_Option .HVAA_separate{height:1px;background-color:black;}#HVAA_Setting_Button *{position:relative;top:480px;}#HV_AutoAttack_Option .HVAA_Title{font-weight:bolder;font-size:larger;text-align:center;}div.monsterHp{z-index:10;position:absolute;top:-1px;width:120px;text-align:center;font-size:8pt;font-weight:bolder;color:yellow;text-shadow:-1px -1px 0 Black,1px -1px 0 Black,-1px 1px 0 Black,1px 1px 0 Black;}button{border-style:solid;border-color:gray;}.HVAA_new{width:25px;height:25px;float:left;background:transparent url("https://raw.githubusercontent.com/dodying/UserJs/master/new.gif") no-repeat;background-position:center;}');
  HV_AutoAttack_Option.innerHTML = '<h1 class="HVAA_center">HV AutoAttack设置<button id="HVAA_Setting_Clear"onclick="localStorage.removeItem(\'HVAA_Setting\');location.reload();"title="推荐每次更新后点击一次">重置设置</button></h1><div class="HVAA_tablist"><div class="HVAA_tabmenu"><span><a href="#HVAA_Main">主要功能</a></span><span><a href="#HVAA_Sc_In">卷轴、魔药</a></span><span><a href="#HVAA_Su_Ch">增益、Channel技能</a></span><span><a href="#HVAA_De_Sp">De、特殊技能</a></span><span><a href="#HVAA_We_Al">权重规则、警报</a></span><span><a href="#HVAA_Bu_Fi">修复、Bug与建议</a></span><span><a href="#HVAA_Ba_Re">备份还原</a></span></div><div id="HVAA_Main"class="HVAA_tab_content"style="z-index:1;"><div class="HVAA_center"title="1.使用宝石回复&#10;2.使用（技能、）Potion药水回复&#10;3.使用Elixir药水回复"><span style="color:green;">HP:1.<input name="HVAA_HP1"placeholder="50"type="text">%&nbsp;2.<input name="HVAA_HP2"placeholder="50"type="text">%&nbsp;3.<input name="HVAA_HP3"placeholder="5"type="text">%&nbsp;</span><br><span style="color:blue;">MP:1.<input name="HVAA_MP1"placeholder="70"type="text">%&nbsp;2.<input name="HVAA_MP2"placeholder="10"type="text">%&nbsp;3.<input name="HVAA_MP3"placeholder="5"type="text">%&nbsp;</span><br><span style="color:red;">SP:1.<input name="HVAA_SP1"placeholder="75"type="text">%&nbsp;2.<input name="HVAA_SP2"placeholder="50"type="text">%&nbsp;3.<input name="HVAA_SP3"placeholder="5"type="text">%&nbsp;</span><br><input id="HVAA_Last_Elixir"type="checkbox"><label for="HVAA_Last_Elixir">当技能与药水CD时，使用Last Elixir。</div><div id="HVAA_Attack_Status"class="HVAA_center"style="color:red;"><b>攻击模式</b>：<input type="radio"id="HVAA_Attack_Status_0"name="HVAA_Attack_Status"value="0"><label for="HVAA_Attack_Status_0">物理</label><input type="radio"id="HVAA_Attack_Status_1"name="HVAA_Attack_Status"value="1"><label for="HVAA_Attack_Status_1">火</label><input type="radio"id="HVAA_Attack_Status_2"name="HVAA_Attack_Status"value="2"><label for="HVAA_Attack_Status_2">冰</label><input type="radio"id="HVAA_Attack_Status_3"name="HVAA_Attack_Status"value="3"><label for="HVAA_Attack_Status_3">雷</label><input type="radio"id="HVAA_Attack_Status_4"name="HVAA_Attack_Status"value="4"><label for="HVAA_Attack_Status_4">风</label><input type="radio"id="HVAA_Attack_Status_5"name="HVAA_Attack_Status"value="5"><label for="HVAA_Attack_Status_5">圣</label><input type="radio"id="HVAA_Attack_Status_6"name="HVAA_Attack_Status"value="6"><label for="HVAA_Attack_Status_6">暗</label></div><div title="默认【空格】暂停，【回车】选择模式"><b>快捷键</b>：按<input name="HVAA_Shortcut_Pause"style="width:60px;"type="text"placeholder="-"onkeyup="this.value=event.key;">暂停，按<input name="HVAA_Shortcut_Choose"style="width:60px;"type="text"placeholder="+"onkeyup="this.value=event.key;">选择模式</div><div><b>技能施放条件</b>：中级：怪物存活数≥<input name="HVAA_Mi_Skill"placeholder="3"type="text">；高级：怪物存活数≥<input name="HVAA_Hi_Skill"placeholder="5"type="text">。</div><div><input id="HVAA_Spirit_Stance"type="checkbox"><label for="HVAA_Spirit_Stance">Overcharge≥<input name="HVAA_Spirit_Stance_OC"placeholder="50"type="text">%后，开启Spirit Stance。</label></div><div><input type="checkbox"id="HVAA_UnCrazy_Mode"><label for="HVAA_UnCrazy_Mode"><b>非浴血模式</b>：当血量≤<input name="HVAA_UnCrazy_Mode_HP"placeholder="44"type="text">%时，脚本发出警告并暂停。</label></div><div title="防止脚本莫名暂停"><input id="HVAA_Delay_Alert"type="checkbox"><label for="HVAA_Delay_Alert">页面停留<input name="HVAA_Delay_Alert_Time"placeholder="10"type="text">秒后，<b>警报</b>；</label><input id="HVAA_Delay_Reload"type="checkbox"><label for="HVAA_Delay_Reload">页面停留<input name="HVAA_Delay_Reload_Time"placeholder="15"type="text">秒后，<b>刷新页面</b>。</label></div><div><input id="HVAA_Reloader"type="checkbox"><label for="HVAA_Reloader"><b>兼容<a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=2660&p=4384894&#entry4384894"target="_blank"title="感谢网友【zsp40088】提出，推荐安装版本【Vanilla Reloader 1.1.1】">Reloader</a>脚本</b></label><input id="HVAA_Reloader_Masking"type="checkbox"><label for="HVAA_Reloader_Masking"><b>防止误操作</b></label></div><div><input id="HVAA_Riddle_Answer"type="checkbox"><label for="HVAA_Riddle_Answer">当【小马】答题时间≤<input name="HVAA_Riddle_Answer_Time"placeholder="3"type="text">秒，如果输入框为空则<b>随机</b>生成答案并提交，否则直接提交。</label></div><div><div class="HVAA_new"></div><input id="HVAA_Stamina"type="checkbox"><label for="HVAA_Stamina">当【Stamina】＜<input name="HVAA_Stamina_Value"placeholder="10"type="text">时，自动逃跑。</label></div></div><div id="HVAA_Sc_In"class="HVAA_tab_content"><input type="checkbox"id="HVAA_Scroll"><label for="HVAA_Scroll"><span class="HVAA_Title">使用卷轴</span></label><br>战役模式：<input type="checkbox"id="HVAA_Scroll_Round_Type_ar"><label for="HVAA_Scroll_Round_Type_ar">竞技场</label><input type="checkbox"id="HVAA_Scroll_Round_Type_rb"><label for="HVAA_Scroll_Round_Type_rb">浴血擂台</label><input type="checkbox"id="HVAA_Scroll_Round_Type_gr"><label for="HVAA_Scroll_Round_Type_gr">压榨界</label><input type="checkbox"id="HVAA_Scroll_Round_Type_iw"><label for="HVAA_Scroll_Round_Type_iw">物品界</label><input type="checkbox"id="HVAA_Scroll_Round_Type_ba"><label for="HVAA_Scroll_Round_Type_ba">遭遇战</label><br>使用条件：当前回合数≥<input name="HVAA_Scroll_Now_Round"placeholder="100"type="text">。<br><input id="HVAA_Scroll_First"type="checkbox"><label for="HVAA_Scroll_First">存在技能生成的Buff时，仍然使用卷轴。</label><br><input type="checkbox"id="HVAA_Scroll_Go"><label for="HVAA_Scroll_Go">Scroll of the Gods</label><input type="checkbox"id="HVAA_Scroll_Av"><label for="HVAA_Scroll_Av">Scroll of the Avatar</label><input type="checkbox"id="HVAA_Scroll_Pr"><label for="HVAA_Scroll_Pr">Scroll of Protection</label><input type="checkbox"id="HVAA_Scroll_Sw"><label for="HVAA_Scroll_Sw">Scroll of Swiftness</label><input type="checkbox"id="HVAA_Scroll_Li"><label for="HVAA_Scroll_Li">Scroll of Life</label><input type="checkbox"id="HVAA_Scroll_Sh"><label for="HVAA_Scroll_Sh">Scroll of Shadows</label><input type="checkbox"id="HVAA_Scroll_Ab"><label for="HVAA_Scroll_Ab">Scroll of Absorption</label><div class="HVAA_separate"></div><input type="checkbox"id="HVAA_Infusions"><label for="HVAA_Infusions"><span class="HVAA_Title">使用魔药：</span></label><br>战役模式：<input type="checkbox"id="HVAA_Infusions_Round_Type_ar"><label for="HVAA_Infusions_Round_Type_ar">竞技场</label><input type="checkbox"id="HVAA_Infusions_Round_Type_rb"><label for="HVAA_Infusions_Round_Type_rb">浴血擂台</label><input type="checkbox"id="HVAA_Infusions_Round_Type_gr"><label for="HVAA_Infusions_Round_Type_gr">压榨界</label><input type="checkbox"id="HVAA_Infusions_Round_Type_iw"><label for="HVAA_Infusions_Round_Type_iw">物品界</label><input type="checkbox"id="HVAA_Infusions_Round_Type_ba"><label for="HVAA_Infusions_Round_Type_ba">遭遇战</label><br>使用条件：当前回合数≥<input name="HVAA_Infusions_Now_Round"placeholder="100"type="text">。<select name="HVAA_Infusions_Status"><option value="1">Infusion of Flames</option><option value="2">Infusion of Frost</option><option value="3">Infusion of Lightning</option><option value="4">Infusion of Storms</option><option value="5">Infusion of Divinity</option><option value="6">Infusion of Darkness</option></select><br></div><div id="HVAA_Su_Ch"class="HVAA_tab_content"><div title="增益技能与Channel技能"><input type="checkbox"id="HVAA_Su_Ch_Skill"><label for="HVAA_Su_Ch_Skill"><span class="HVAA_Title">【增益技能】与【Channel技能】</span></label><br>施放条件（有一个成立就行）：<br>1、总回合数≥<input name="HVAA_All_Mode_All_Round"placeholder="12"type="text">。2、存活≥<input name="HVAA_All_Mode_Boss_Count"placeholder="1"type="text">只Boss。3、遭遇战中，存在≥<input name="HVAA_All_Mode_Monster_Count"placeholder="6"type="text">只怪物。<br><b>增益技能</b>（Buff不存在就施放的技能，按【施放顺序】排序）：<br><input type="checkbox"id="HVAA_Su_Skill_HD"><label for="HVAA_Su_Skill_HD">Health Draught</label><input type="checkbox"id="HVAA_Su_Skill_MD"><label for="HVAA_Su_Skill_MD">Mana Draught</label><input type="checkbox"id="HVAA_Su_Skill_SD"><label for="HVAA_Su_Skill_SD">Spirit Draught</label><br><input type="checkbox"id="HVAA_Su_Skill_Pr"><label for="HVAA_Su_Skill_Pr">Protection</label><input type="checkbox"id="HVAA_Su_Skill_SL"><label for="HVAA_Su_Skill_SL">Spark of Life</label><input type="checkbox"id="HVAA_Su_Skill_SS"><label for="HVAA_Su_Skill_SS">Spirit Shield</label><input type="checkbox"id="HVAA_Su_Skill_Ha"><label for="HVAA_Su_Skill_Ha">Haste</label><br><input type="checkbox"id="HVAA_Su_Skill_AF"><label for="HVAA_Su_Skill_AF">Arcane Focus</label><input type="checkbox"id="HVAA_Su_Skill_He"><label for="HVAA_Su_Skill_He">Heartseeker</label><input type="checkbox"id="HVAA_Su_Skill_Re"><label for="HVAA_Su_Skill_Re">Regen</label><input type="checkbox"id="HVAA_Su_Skill_SV"><label for="HVAA_Su_Skill_SV">Shadow Veil</label><input type="checkbox"id="HVAA_Su_Skill_Ab"><label for="HVAA_Su_Skill_Ab">Absorb</label><div></div>当<b>获得Channel时</b>，即施法只需1点MP，<br><b>先ReBuff</b>：buff存在≤<input name="HVAA_Ch_ReSkill"placeholder="5"type="text">回合时，重新使用该技能。<br><b>再施放Channel技能</b>（按【施放顺序】排序）：<br><input type="checkbox"id="HVAA_Ch_Skill_Pr"><label for="HVAA_Ch_Skill_Pr">Protection</label><input type="checkbox"id="HVAA_Ch_Skill_SL"><label for="HVAA_Ch_Skill_SL">Spark of Life</label><input type="checkbox"id="HVAA_Ch_Skill_SS"><label for="HVAA_Ch_Skill_SS">Spirit Shield</label><input type="checkbox"id="HVAA_Ch_Skill_Ha"><label for="HVAA_Ch_Skill_Ha">Haste</label><br><input type="checkbox"id="HVAA_Ch_Skill_AF"><label for="HVAA_Ch_Skill_AF">Arcane Focus</label><input type="checkbox"id="HVAA_Ch_Skill_He"><label for="HVAA_Ch_Skill_He">Heartseeker</label><input type="checkbox"id="HVAA_Ch_Skill_Re"><label for="HVAA_Ch_Skill_Re">Regen</label><input type="checkbox"id="HVAA_Ch_Skill_SV"><label for="HVAA_Ch_Skill_SV">Shadow Veil</label><input type="checkbox"id="HVAA_Ch_Skill_Ab"><label for="HVAA_Ch_Skill_Ab">Absorb</label></div></div><div id="HVAA_De_Sp"class="HVAA_tab_content"><div><input type="checkbox"id="HVAA_De_Skill"><label for="HVAA_De_Skill"><span class="HVAA_Title">De技能</span>（按【施放顺序】排序，模式优先度1>2）：</label><br><input type="checkbox"id="HVAA_De_Skill_Boss"><label for="HVAA_De_Skill_Boss">模式1、<b>只对Boss施放</b>：</label><br><input type="checkbox"id="HVAA_De_Skill_Boss_Im"><label for="HVAA_De_Skill_Boss_Im">Imperil</label><input type="checkbox"id="HVAA_De_Skill_Boss_MN"><label for="HVAA_De_Skill_Boss_MN">MagNet</label><input type="checkbox"id="HVAA_De_Skill_Boss_Si"><label for="HVAA_De_Skill_Boss_Si">Silence</label><input type="checkbox"id="HVAA_De_Skill_Boss_Dr"><label for="HVAA_De_Skill_Boss_Dr">Drain</label><input type="checkbox"id="HVAA_De_Skill_Boss_We"><label for="HVAA_De_Skill_Boss_We">Weaken</label><input type="checkbox"id="HVAA_De_Skill_Boss_Co"><label for="HVAA_De_Skill_Boss_Co">Confuse</label><br>存活≥<input name="HVAA_De_Skill_Boss_Count"placeholder="5"type="text">只怪物时，施放<input type="checkbox"id="HVAA_De_Skill_Boss_Sle"><label for="HVAA_De_Skill_Boss_Sle">Sleep</label><input type="checkbox"id="HVAA_De_Skill_Boss_Bl"><label for="HVAA_De_Skill_Boss_Bl">Blind</label><input type="checkbox"id="HVAA_De_Skill_Boss_Slo"><label for="HVAA_De_Skill_Boss_Slo">Slow</label><br><input type="checkbox"id="HVAA_De_Skill_All"><label for="HVAA_De_Skill_All"><b>模式2、对所有怪施放</b>：</label><br>按血量<b>从少到多</b>对怪兽施放，优先攻击<b>有</b>以下Buff的怪兽<br><input type="checkbox"id="HVAA_De_Skill_All_Im"><label for="HVAA_De_Skill_All_Im">Imperil</label><input type="checkbox"id="HVAA_De_Skill_All_MN"><label for="HVAA_De_Skill_All_MN">MagNet</label><input type="checkbox"id="HVAA_De_Skill_All_Si"><label for="HVAA_De_Skill_All_Si">Silence</label><input type="checkbox"id="HVAA_De_Skill_All_Dr"><label for="HVAA_De_Skill_All_Dr">Drain</label><input type="checkbox"id="HVAA_De_Skill_All_We"><label for="HVAA_De_Skill_All_We">Weaken</label><input type="checkbox"id="HVAA_De_Skill_All_Co"><label for="HVAA_De_Skill_All_Co">Confuse</label></div><div class="HVAA_separate"></div><div><input id="HVAA_Sp_Skill"type="checkbox"><label for="HVAA_Sp_Skill"><span class="HVAA_Title">特殊技能-Special Skills</span>：</label><div id="HVAA_Sp_Skill_div"><input id="HVAA_Sp_Skill_OFC"type="checkbox"><label for="HVAA_Sp_Skill_OFC">Orbital Friendship Cannon：当存在≥<input name="HVAA_Sp_Skill_OFC_Monster"placeholder="8"type="text">只怪兽或存在≥<input name="HVAA_Sp_Skill_OFC_Boss"placeholder="1"type="text">Boss，使用该技能。</label><br><input id="HVAA_Sp_Skill_FUS"type="checkbox"><label for="HVAA_Sp_Skill_FUS">FUS RO DAH（未完成，仅占位，求热心人提供帮助）：当存在≥<input name="HVAA_Sp_Skill_FUS_Monster"placeholder="8"type="text">只怪兽或存在≥<input name="HVAA_Sp_Skill_FUS_Boss"placeholder="1"type="text">Boss，使用该技能。</label></div></div></div><div id="HVAA_We_Al"class="HVAA_tab_content"><div class="HVAA_center"><span class="HVAA_Title">权重规则</span>&nbsp;<a href="https://github.com/dodying/UserJs/blob/master/HentaiVerse/hvAutoAttack/README.md#权重规则"target="_blank">示例</a><div id="HVAA_Weight_Rule_div">1、每回合计算怪物当前血量，血量最低的设置初始血量为10，其他怪物为当前血量倍数*10<br>2、初始权重与下述各Buff权重相加<br>Sleep:<input name="HVAA_Weight_Sle"placeholder="+5"type="text">&nbsp;Blind:<input name="HVAA_Weight_Bl"placeholder="+3"type="text">&nbsp;Slow:<input name="HVAA_Weight_Slo"placeholder="+3"type="text">&nbsp;Imperil:<input name="HVAA_Weight_Im"placeholder="-5"type="text">&nbsp;Coalesced Mana:<input name="HVAA_Weight_CM"placeholder="-5"type="text"><br>MagNet:<input name="HVAA_Weight_MN"placeholder="-4"type="text">&nbsp;Silence:<input name="HVAA_Weight_Si"placeholder="-4"type="text">&nbsp;Drain:<input name="HVAA_Weight_Dr"placeholder="-4"type="text">&nbsp;Weaken:<input name="HVAA_Weight_We"placeholder="-4"type="text">&nbsp;Confuse:<input name="HVAA_Weight_Co"placeholder="-1"type="text"><br>3、计算出最终权重，攻击权重最小的怪物<br>4、如果你对各Buff权重有特别见解，请务必<a href="https://github.com/dodying/UserJs/issues/2"target="_blank">告诉我</a></div></div><div class="HVAA_separate"></div><div id="HVAA_Alert"class="HVAA_center"><span class="HVAA_Title">警报</span><br>【默认】：<input class="HVAA_Alert"name="HVAA_Alert_default"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio=new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a><br/>【答题】：<input class="HVAA_Alert"name="HVAA_Alert_Riddle"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio=new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a><br/>【胜利】：<input class="HVAA_Alert"name="HVAA_Alert_Win"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio=new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a><br/>【错误】：<input class="HVAA_Alert"name="HVAA_Alert_Error"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio=new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a><br/>【失败】：<input class="HVAA_Alert"name="HVAA_Alert_Failed"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio=new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a></div></div><div id="HVAA_Bu_Fi"class="HVAA_tab_content"><span><a href="https://github.com/dodying/UserJs/issues/6"target="_blank">提交Bug</a>或<a href="https://github.com/dodying/UserJs/issues/2"target="_blank">建议</a>&nbsp;&nbsp;</span><div class="HVAA_separate"></div><div class="HVAA_center"><span class="HVAA_Title">当前状况</span>：<br>如果脚本长期暂停且网络无问题，请点击【临时修复】<br>战役模式：<select class="HVAA_Debug"name="HVAA_Round_Type"><option></option><option value="ar">竞技场</option><option value="rb">浴血擂台</option><option value="gr">压榨界</option><option value="iw">物品界</option><option value="ba">遭遇战</option></select><br>当前回合：<input name="HVAA_Round_Now"class="HVAA_Debug"type="text"placeholder="1">&nbsp;总回合：<input name="HVAA_Round_All"class="HVAA_Debug"type="text"placeholder="1"><br><b>各怪物及状况</b>：<div id="HVAA_Fix_Monster"></div><button id="HVAA_Fix">临时修复</button></div></div><div id="HVAA_Ba_Re"class="HVAA_tab_content"><div class="HVAA_center"><span class="HVAA_Title">备份还原</span>：<div id="HVAA_Backup_Div"></div><button id="HVAA_Backup_Save">备份</button><button id="HVAA_Backup_Load">还原</button><button id="HVAA_Backup_Delete">删除</button></div></div></div><div id="HVAA_Setting_Button"class="HVAA_center"><button id="HVAA_Setting_Apply">确认</button>&nbsp;<button id="HVAA_Setting_Cancel">取消</button></div>';
  var Input_Alert = HV_AutoAttack_Option.querySelectorAll('.HVAA_Alert');
  var File_Type = (/Chrome|Safari/.test(window.navigator.userAgent)) ? '.mp3' : '.wav';
  for (var i = 0; i < Input_Alert.length; i++) {
    Input_Alert[i].placeholder = 'https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/' + Input_Alert[i].name.replace('HVAA_Alert_', '') + File_Type;
  }
  if (localStorage.HVAA_Setting) {
    var HVAA_Setting = JSON.parse(localStorage.HVAA_Setting);
    var input = HV_AutoAttack_Option.querySelectorAll('input,select');
    for (var i = 0; i < input.length; i++) {
      if (input[i].className === 'HVAA_Debug' && localStorage[input[i].name]) {
        input[i].value = localStorage[input[i].name];
        continue;
      }
      if (HVAA_Setting[input[i].name.replace('HVAA_', '')] || HVAA_Setting[input[i].id.replace('HVAA_', '')]) {
        if (input[i].type === 'text' || input[i].type === 'select-one') {
          input[i].value = HVAA_Setting[input[i].name.replace('HVAA_', '')];
        } else if (input[i].type === 'checkbox') {
          input[i].checked = HVAA_Setting[input[i].id.replace('HVAA_', '')];
        } else if (input[i].type === 'radio') {
          (HVAA_Setting[input[i].name.replace('HVAA_', '')] === input[i].value) ? input[i].checked = true : input[i].checked = false;
        }
      }
    }
  }
  if (ge(0, '#togpane_log')) {
    var Monster_Status_length = (localStorage.HVAA_Monster_Status) ? JSON.parse(localStorage.HVAA_Monster_Status).length : 0;
    var div = document.createElement('div');
    div.innerHTML = '当前总共有' + ge(1, 'div.btm1').length + '只怪物，本地储存' + Monster_Status_length + '只怪物。';
    div.innerHTML += (ge(1, 'div.btm1').length === Monster_Status_length) ? '数目相同' : '<br><span style="color:red;">数目不同，请点击<b>【临时修复】</b></span>';
    HV_AutoAttack_Option.querySelector('#HVAA_Fix_Monster').appendChild(div);
  }
  if (localStorage.HVAA_Monster_Status && ge(0, '#togpane_log')) {
    var HVAA_Monster_Status = JSON.parse(localStorage.HVAA_Monster_Status);
    for (var i = 0; i < HVAA_Monster_Status.length; i++) {
      var span = document.createElement('span');
      span.className = 'HVAA_Fix_Monster';
      span.innerHTML = ' id:' + HVAA_Monster_Status[i].id + ' 总HP:<input name="HVAA_Monster_Status_' + i + '_HP" class="HVAA_Debug" type="text" style="width:60px;">';
      if (i % 2 === 1) span.innerHTML += '<br>';
      span.querySelector('input').value = HVAA_Monster_Status[i].HP;
      HV_AutoAttack_Option.querySelector('#HVAA_Fix_Monster').appendChild(span);
    }
  }
  var div = document.createElement('div');
  div.innerHTML = '当前版本：' + GM_info.script.version.substring(0, 4);
  HV_AutoAttack_Option.querySelector('#HVAA_Backup_Div').appendChild(div);
  if (localStorage.HVAA_Backup) {
    var HVAA_Backup = JSON.parse(localStorage.HVAA_Backup);
    for (var i in HVAA_Backup) {
      var div = document.createElement('div');
      div.innerHTML = '名称：' + i + ' 版本：' + HVAA_Backup[i].version;
      HV_AutoAttack_Option.querySelector('#HVAA_Backup_Div').appendChild(div);
    }
  }
  HV_AutoAttack_Option.querySelector('#HVAA_Fix').onclick = function () {
    if (confirm('注意，修复只是临时作用使脚本能够运行！\n如果脚本能够继续运行请按取消！\n是否继续？')) {
      var input = HV_AutoAttack_Option.querySelectorAll('[name^="HVAA_Round_"]');
      for (var i = 0; i < input.length; i++) {
        localStorage[input[i].name] = input[i].value || input[i].placeholder;
      }
      var Monster_Status = [
      ];
      var input = HV_AutoAttack_Option.querySelectorAll('span.HVAA_Fix_Monster input.HVAA_Debug');
      var Monster_Count_All = ge(1, 'div.btm1');
      if (Monster_Count_All.length === input.length) {
        for (var i = 0; i < input.length; i++) {
          var temp = {
          };
          temp.id = i + 1;
          temp.HP = (input[i].value === 'undefined' || !input[i].value) ? '100000' : input[i].value;
          Monster_Status.push(temp);
        }
      } else {
        for (var i = 0; i < Monster_Count_All.length; i++) {
          var temp = {
          };
          temp.id = i + 1;
          temp.HP = '100000';
          Monster_Status.push(temp);
        }
      }
      localStorage.HVAA_Monster_Status = JSON.stringify(Monster_Status);
      window.location = window.location.href.replace(/#HVAA_[A-Za-z_]+$/, '');
    }
  }
  HV_AutoAttack_Option.querySelector('#HVAA_Backup_Save').onclick = function () {
    var name = prompt('请输入备份名称');
    var HVAA_Backup = (localStorage.HVAA_Backup) ? JSON.parse(localStorage.HVAA_Backup)  : new Object;
    HVAA_Backup[name] = JSON.parse(localStorage.HVAA_Setting);
    localStorage.HVAA_Backup = JSON.stringify(HVAA_Backup);
    window.location = window.location.href.replace(/#HVAA_[A-Za-z_]+$/, '');
  }
  HV_AutoAttack_Option.querySelector('#HVAA_Backup_Load').onclick = function () {
    var name = prompt('请输入要还原的备份名称');
    if (!localStorage.HVAA_Backup) return;
    var HVAA_Backup = JSON.parse(localStorage.HVAA_Backup);
    if (!HVAA_Backup[name]) return;
    localStorage.HVAA_Setting = JSON.stringify(HVAA_Backup[name]);
    window.location = window.location.href.replace(/#HVAA_[A-Za-z_]+$/, '');
  }
  HV_AutoAttack_Option.querySelector('#HVAA_Backup_Delete').onclick = function () {
    var name = prompt('请输入要删除的备份名称');
    if (!localStorage.HVAA_Backup) return;
    var HVAA_Backup = JSON.parse(localStorage.HVAA_Backup);
    if (!HVAA_Backup[name]) return;
    delete HVAA_Backup[name];
    localStorage.HVAA_Backup = JSON.stringify(HVAA_Backup);
    window.location = window.location.href.replace(/#HVAA_[A-Za-z_]+$/, '');
  }
  HV_AutoAttack_Option.querySelector('#HVAA_Setting_Apply').onclick = function () {
    var Option = this.parentNode.parentNode;
    if (!Option.querySelector('input[name="HVAA_Attack_Status"]:checked')) {
      alert('请选择攻击模式');
      Option.querySelector('#HVAA_Attack_Status').style.fontSize = 'larger';
      setTimeout(function () {
        Option.querySelector('#HVAA_Attack_Status').style.fontSize = '';
      }, 500);
      return;
    }
    var Input_Alert = Option.querySelectorAll('.HVAA_Alert');
    for (var i = 0; i < Input_Alert.length; i++) {
      if (Input_Alert[i].value !== '' && Input_Alert[i].value.substring(Input_Alert[i].value.length - 4) !== File_Type) {
        alert('请替换并试听第' + eval(i + 1) + '个音频。');
        return;
      }
    }
    var HVAA_Setting = {
    };
    HVAA_Setting.version = GM_info.script.version.substring(0, 4);
    var input = Option.querySelectorAll('input,select');
    for (var i = 0; i < input.length; i++) {
      if (input[i].className === 'HVAA_Debug') continue;
      if (input[i].type === 'text' || input[i].type === 'select-one') {
        HVAA_Setting[input[i].name.replace('HVAA_', '')] = input[i].value || input[i].placeholder;
      } else if (input[i].type === 'checkbox') {
        HVAA_Setting[input[i].id.replace('HVAA_', '')] = input[i].checked;
      } else if (input[i].type === 'radio' && input[i].checked) {
        HVAA_Setting[input[i].name.replace('HVAA_', '')] = input[i].value;
      }
    }
    localStorage.HVAA_Setting = JSON.stringify(HVAA_Setting);
    Option.style.display = 'none';
    window.location = window.location.href.replace(/#HVAA_[A-Za-z_]+$/, '');
  }
  HV_AutoAttack_Option.querySelector('#HVAA_Setting_Cancel').onclick = function () {
    this.parentNode.parentNode.style.display = 'none';
    window.history.pushState(null, '', window.location.href.replace(/#HVAA_[A-Za-z_]+$/, ''));
    window.history.replaceState(null, '', window.location.href);
  }
  document.body.appendChild(HV_AutoAttack_Option);
} //////////////////////////////////////////////////

function HotKey() { //设置全局快捷键
  document.onkeydown = function (e) {
    if (e.key === HVAA_Setting.Shortcut_Pause) {
      (!localStorage.HVAA_disabled) ? localStorage.HVAA_disabled = true : removeItemInStorage(0);
      window.location = window.location.href;
    } else if (e.key === HVAA_Setting.Shortcut_Choose) {
      var p = parseInt(prompt('请选择（默认为火）：\n0.物理\n1.火\n2.冰\n3.雷\n4.风\n5.圣\n6.暗', ''));
      if (isNaN(p)) return;
      localStorage.HVAA_Attack_Status = p;
      window.location = window.location.href;
    }
  };
} //////////////////////////////////////////////////

function RiddleAlert() { //答题警报
  if (ge(0, '#riddlecounter')) {
    document.title = '！！！紧急';
    var audio = document.createElement('audio');
    audio.src = HVAA_Setting.Alert_Riddle;
    audio.play();
    if (HVAA_Setting.Riddle_Answer) {
      for (var i = 0; i < 30; i++) {
        setTimeout(function () {
          var time_div = ge(1, '#riddlecounter>div>div');
          var time = '';
          for (var j = 0; j < time_div.length; j++) {
            var time = (parseInt(time_div[j].style.backgroundPosition.replace('0px -', '')) / 12).toString() + time;
          }
          console.log(time);
          document.title = time;
          if (parseInt(time) <= parseInt(HVAA_Setting.Riddle_Answer_Time)) {
            if (!ge(0, '#riddlemaster').value) {
              var random = Math.random();
              if (random < 1 / 3) {
                ge(0, '#riddlemaster').value = 'A';
              } else if (random < 2 / 3) {
                ge(0, '#riddlemaster').value = 'B';
              } else {
                ge(0, '#riddlemaster').value = 'C';
              }
            }
            ge(2, 'riddleform').submit();
          }
        }, i * 1000);
      }
    }
  }
} //////////////////////////////////////////////////

function OtherAlert(e) { //其他警报
  var audio = document.createElement('audio');
  switch (e) {
    default:
      audio.src = HVAA_Setting.Alert_default;
      break;
    case 'Win':
      audio.src = HVAA_Setting.Alert_Win;
      break;
    case 'Error':
      audio.src = HVAA_Setting.Alert_Error;
      break;
    case 'Failed':
      audio.src = HVAA_Setting.Alert_Failed;
      break;
  }
  audio.play();
} //////////////////////////////////////////////////

function CountRound() { //回合计数及自动前进并获取怪物总HP
  if (!localStorage.HVAA_Round_Type) {
    Round_Type = window.location.search.replace(/.*ss=([a-z]{2}).*/, '$1');
    localStorage.HVAA_Round_Type = Round_Type;
  } else {
    Round_Type = localStorage.HVAA_Round_Type;
  }
  var BattleLog = ge(1, '#togpane_log>table>tbody>tr>td.t3');
  if (BattleLog[BattleLog.length - 1].innerHTML === 'Battle Start!') removeItemInStorage(1);
  if (!localStorage.HVAA_Round_Now) {
    var Monster_Status = [
    ];
    var id = 0;
    for (var i = BattleLog.length - 3; i > BattleLog.length - 3 - Monster_Count_All; i--) {
      var temp = {
      };
      var HP_All = parseFloat(BattleLog[i].innerHTML.replace(/.*HP=/, ''));
      temp.id = (id === 9) ? 0 : id + 1;
      temp.isDead = false;
      temp.isBoss = (ge(1, 'div.btm2') [id].style.background === '') ? false : true;
      if (!isNaN(HP_All)) {
        temp.HP = HP_All;
        temp.HPNow = temp.HP;
      } else {
        temp.HP(Monster_Status[Monster_Status.length - 1].HP_All);
        temp.HPNow = temp.HP;
      }
      Monster_Status[id] = temp;
      id++;
    }
    localStorage.HVAA_Monster_Status = JSON.stringify(Monster_Status);
    var Round = BattleLog[BattleLog.length - 2].innerHTML.replace(/.*\(Round /, '').replace(/\).*/, '').replace(/\s+/g, '');
    if (Round_Type !== 'ba' || /^\d+\/\d+$/.test(Round)) {
      Round_Now = parseInt(Round.replace(/\/.*/, ''));
      localStorage.HVAA_Round_Now = Round_Now;
      Round_All = parseInt(Round.replace(/.*\//, ''));
      localStorage.HVAA_Round_All = Round_All;
    } else {
      if (Monster_Count_All >= HVAA_Setting.All_Mode_Monster_Count || Monster_Count_Boss_Alive >= HVAA_Setting.All_Mode_Boss_Count) {
        Round_Now = 1;
        localStorage.HVAA_Round_Now = Round_Now;
        Round_All = 1;
        localStorage.HVAA_Round_All = Round_All;
      } else {
        Round_Now = 2;
        localStorage.HVAA_Round_Now = Round_Now;
        Round_All = 2;
        localStorage.HVAA_Round_All = Round_All;
      }
    }
  } else {
    Round_Now = parseInt(localStorage.HVAA_Round_Now);
    Round_All = parseInt(localStorage.HVAA_Round_All);
  }
  if (Monster_Count_Alive > 0 && ge(0, '.btcp')) {
    OtherAlert('Failed');
    removeItemInStorage(2);
  } else if (Round_Now !== Round_All && ge(0, '.btcp')) {
    removeItemInStorage(1);
    window.location = window.location.href.replace(/#HVAA_[A-Za-z_]+$/, '');
  } else if (Round_Now === Round_All && ge(0, '.btcp')) {
    OtherAlert('Win');
    removeItemInStorage(2);
    setTimeout(function () {
      window.location = 'http://hentaiverse.org/';
    }, 3000);
  } else if (Round_Now === Round_All) {
    ge(2, 'infopane').style.backgroundColor = 'gray';
  }
  if (ge(0, '.btcp')) {
    window.HVAA_End = true;
    return;
  }
} //////////////////////////////////////////////////

function BattleInfo() { //战斗战况
  var Attack_Status2Chinese = {
    0: '物理',
    1: '火',
    2: '冰',
    3: '雷',
    4: '风',
    5: '圣',
    6: '暗'
  };
  var Attack_Status_title = Attack_Status2Chinese[Attack_Status];
  if (!ge(0, '#HVAA_BattleLog')) {
    var div = document.createElement('div');
    div.id = 'HVAA_BattleLog';
    div.innerHTML = '运行次数：' + runtime + '<br>回合：' + Round_Now + '/' + Round_All + '<br>攻击模式：' + Attack_Status_title + '<br>存活Boss：' + Monster_Count_Boss_Alive + '<br>怪物：' + Monster_Count_Alive + '/' + Monster_Count_All;
    div.style = 'font-size:20px;text-align:center;';
    ge(0, 'div.clb').insertBefore(div, ge(0, '.cit'));
  } else {
    ge(0, '#HVAA_BattleLog').innerHTML = '运行次数：' + runtime + '<br>回合：' + Round_Now + '/' + Round_All + '<br>攻击模式：' + Attack_Status_title + '<br>存活Boss：' + Monster_Count_Boss_Alive + '<br>怪物：' + Monster_Count_Alive + '/' + Monster_Count_All;
  }
  document.title = runtime + '||' + Round_Now + '/' + Round_All + '||' + Monster_Count_Alive + '/' + Monster_Count_All;
} //////////////////////////////////////////////////

function AutoUseGem() { //自动使用宝石
  if (ge(2, 'ikey_p')) {
    var Gem = ge(2, 'ikey_p').getAttribute('onmouseover').replace(/battle.set_infopane_item\(\'(.*?)\'.*/, '$1');
    if (Gem === 'Health Gem' && HP <= HVAA_Setting.HP1 * 0.01) {
      ge(2, 'ikey_p').click();
      window.HVAA_End = true;
      return;
    } else if (Gem === 'Mana Gem' && MP <= HVAA_Setting.MP1 * 0.01) {
      ge(2, 'ikey_p').click();
      window.HVAA_End = true;
      return;
    } else if (Gem === 'Spirit Gem' && SP <= HVAA_Setting.SP1 * 0.01) {
      ge(2, 'ikey_p').click();
      window.HVAA_End = true;
      return;
    } else if (Gem === 'Mystic Gem') {
      ge(2, 'ikey_p').click();
      window.HVAA_End = true;
      return;
    }
  }
} //////////////////////////////////////////////////

function DeadSoon() { //自动回血回魔
  if (MP < HVAA_Setting.MP2 * 0.01) { //自动回魔
    ge(2, 'quickbar').style.backgroundColor = 'blue';
    if (ge(0, '.bti3>div[onmouseover*="Mana Potion"]')) {
      ge(0, '.bti3>div[onmouseover*="Mana Potion"]').click();
      window.HVAA_End = true;
      return;
    }
  }
  if (MP <= HVAA_Setting.MP3 * 0.01 && ge(0, '.bti3>div[onmouseover*="Mana Elixir"]')) {
    ge(0, '.bti3>div[onmouseover*="Mana Elixir"]').click();
    window.HVAA_End = true;
    return;
  }
  if (SP < HVAA_Setting.SP2 * 0.01) { //自动回精
    ge(2, 'quickbar').style.backgroundColor = 'green';
    if (ge(0, '.bti3>div[onmouseover*="Spirit Potion"]')) {
      ge(0, '.bti3>div[onmouseover*="Spirit Potion"]').click();
      window.HVAA_End = true;
      return;
    }
  }
  if (SP <= HVAA_Setting.SP3 * 0.01 && ge(0, '.bti3>div[onmouseover*="Spirit Elixir"]')) {
    ge(0, '.bti3>div[onmouseover*="Spirit Elixir"]').click();
    window.HVAA_End = true;
    return;
  }
  if (HP <= HVAA_Setting.HP2 * 0.01) { //自动回血
    if (!ge(0, '.cwb2[src*="barsilver"]')) {
      ge(2, 'quickbar').style.backgroundColor = 'red';
    }
    if (ge(2, '311')) {
      if (ge(2, '311').style.opacity !== '0.5') {
        ge(2, '311').click();
        window.HVAA_End = true;
        return;
      }
    }
    if (ge(2, '313')) {
      if (ge(2, '313').style.opacity !== '0.5') {
        ge(2, '313').click();
        window.HVAA_End = true;
        return;
      }
    }
    if (ge(0, '.bti3>div[onmouseover*="Health Potion"]')) {
      ge(0, '.bti3>div[onmouseover*="Health Potion"]').click();
      window.HVAA_End = true;
      return;
    }
  }
  if (HP <= HVAA_Setting.HP3 * 0.01 && ge(0, '.bti3>div[onmouseover*="Health Elixir"]')) {
    ge(0, '.bti3>div[onmouseover*="Health Elixir"]').click();
    window.HVAA_End = true;
    return;
  }
  if (HVAA_Setting.Last_Elixir && ge(0, '.bti3>div[onmouseover*="Last Elixir"]')) {
    ge(0, '.bti3>div[onmouseover*="Last Elixir"]').click();
    window.HVAA_End = true;
    return;
  }
} //////////////////////////////////////////////////

function AutoUseScroll() {
  var Scroll_Lib = {
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
  var Scroll_First = (HVAA_Setting.Scroll_First) ? '_scroll' : '';
  for (var i in Scroll_Lib) {
    if (HVAA_Setting['Scroll_' + i] && ge(0, '.bti3>div[onmouseover*="' + Scroll_Lib[i].name + '"]')) {
      for (var j = 1; j <= Scroll_Lib[i].mult; j++) {
        if (ge(0, 'div.bte>img[src*="' + Scroll_Lib[i]['img' + j] + Scroll_First + '"]')) {
          var isUsed = true;
          break;
        }
        var isUsed = false;
      }
      if (!isUsed) {
        ge(0, '.bti3>div[onmouseover*="' + Scroll_Lib[i].name + '"]').click();
        window.HVAA_End = true;
        return;
      }
    }
  }
} //////////////////////////////////////////////////

function AutoUsePotAndSuSkill() { //自动使用药水、施法增益技能
  var Skill_Lib = {
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
  if ((Round_All >= HVAA_Setting.All_Mode_All_Round) || (Round_All === Round_Now && Round_All === 1)) {
    if (ge(0, 'div.bte>img[src*="channeling"]')) {
      var buff = ge(1, 'div.bte>img');
      if (buff.length > 0) {
        for (var n = 0; n < buff.length; n++) {
          var spell_name = buff[n].getAttribute('onmouseover').replace(/battle.set_infopane_effect\(\'(.*?)\'.*/, '$1');
          if (spell_name === 'Absorbing Ward') continue;
          var buff_lasttime = parseInt(buff[n].getAttribute('onmouseover').replace(/.*\'\,(.*?)\)/g, '$1'));
          if (buff_lasttime <= HVAA_Setting.Ch_ReSkill) {
            if (spell_name === 'Cloak of the Fallen' && !ge(0, 'div.bte>img[src*="sparklife"]') && ge(2, '422').style.opacity !== '0.5') {
              ge(2, '422').click();
              window.HVAA_End = true;
              return;
            }
            for (var i in Skill_Lib) {
              if (spell_name === Skill_Lib[i].name && ge(2, Skill_Lib[i].id)) {
                if (ge(2, Skill_Lib[i].id).style.opacity !== '0.5') {
                  ge(2, Skill_Lib[i].id).click();
                  window.HVAA_End = true;
                  return;
                }
              }
            }
          }
          break;
        }
        for (var i in Skill_Lib) {
          if (HVAA_Setting['Ch_Skill_' + i] !== undefined) {
            if (HVAA_Setting['Ch_Skill_' + i] && !ge(0, 'div.bte>img[src*="' + Skill_Lib[i].img + '"]') && ge(2, Skill_Lib[i].id)) {
              if (ge(2, Skill_Lib[i].id).style.opacity !== '0.5') {
                ge(2, Skill_Lib[i].id).click();
                window.HVAA_End = true;
                return;
              }
            }
          }
        }
      }
    }
    for (var i in Skill_Lib) {
      if (HVAA_Setting['Su_Skill_' + i] !== undefined) {
        if (HVAA_Setting['Su_Skill_' + i] && !ge(0, 'div.bte>img[src*="' + Skill_Lib[i].img + '"]') && ge(2, Skill_Lib[i].id)) {
          if (ge(2, Skill_Lib[i].id).style.opacity !== '0.5') {
            ge(2, Skill_Lib[i].id).click();
            window.HVAA_End = true;
            return;
          }
        }
      }
    }
    if (!ge(0, 'div.bte>img[src*="healthpot"]') && HP < 1 && HVAA_Setting.Su_Skill_HD && ge(0, '.bti3>div[onmouseover*="Health Draught"]')) {
      ge(0, '.bti3>div[onmouseover*="Health Draught"]').click();
      window.HVAA_End = true;
      return;
    } else if (!ge(0, 'div.bte>img[src*="manapot"]') && MP < 1 && HVAA_Setting.Su_Skill_MD && ge(0, '.bti3>div[onmouseover*="Mana Draught"]')) {
      ge(0, '.bti3>div[onmouseover*="Mana Draught"]').click();
      window.HVAA_End = true;
      return;
    } else if (!ge(0, 'div.bte>img[src*="spiritpot"]') && SP < 0.8 && HVAA_Setting.Su_Skill_SD && ge(0, '.bti3>div[onmouseover*="Spirit Draught"]')) {
      ge(0, '.bti3>div[onmouseover*="Spirit Draught"]').click();
      window.HVAA_End = true;
      return;
    }
  } else if (Round_All === Round_Now && Round_All === 2) {
    if (!ge(0, 'div.bte>img[src*="sparklife"]') && ge(2, '422').style.opacity !== '0.5') {
      ge(2, '422').click();
      window.HVAA_End = true;
      return;
    }
  }
} //////////////////////////////////////////////////

function AutoUseInfusions() {
  var Infusions_Lib = {
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
  if (ge(0, '.bti3>div[onmouseover*="' + Infusions_Lib[HVAA_Setting.Infusions_Status].name + '"]') && !ge(0, 'div.bte>img[src*="' + Infusions_Lib[[HVAA_Setting.Infusions_Status]].img + '"]')) {
    ge(0, '.bti3>div[onmouseover*="' + Infusions_Lib[HVAA_Setting.Infusions_Status].name + '"]').click();
    window.HVAA_End = true;
    return;
  }
} //////////////////////////////////////////////////

function CountMonsterHP() { //统计怪物血量
  var Monter_HP = ge(1, 'div.btm4>div.btm5:nth-child(1)');
  for (var i = 0; i < Monter_HP.length; i++) {
    if (Monter_HP[i].querySelector('img[src="/y/s/nbardead.png"]')) {
      Monster_Status[i].isDead = true;
      Monster_Status[i].HPNow = Infinity;
    } else {
      Monster_Status[i].isDead = false;
      Monster_Status[i].HPNow = Math.floor(Monster_Status[i].HP * parseFloat(Monter_HP[i].querySelector('div.chbd>img.chb2').style.width) / 120) + 1;
      var hpDiv = document.createElement('div');
      hpDiv.className = 'monsterHp';
      hpDiv.innerHTML = Monster_Status[i].HPNow + ' / ' + Monster_Status[i].HP;
      Monter_HP[i].querySelector('.chbd').appendChild(hpDiv);
    }
  }
  localStorage.HVAA_Monster_Status = JSON.stringify(Monster_Status);
  Monster_Status.sort(ArrCom('HPNow'));
  var HP_Lowest = Monster_Status[0].HPNow;
  for (var i = 0; i < Monster_Status.length; i++) {
    Monster_Status[i].Init_Weight = (Monster_Status[i].isDead) ? Infinity : Monster_Status[i].HPNow / HP_Lowest * 10;
    Monster_Status[i].Fin_Weight = Monster_Status[i].Init_Weight;
  }
} //////////////////////////////////////////////////

function AutoUseDeSkill() { //自动施法De技能
  if (HVAA_Setting.De_Skill && ((window.Monster_Count_Boss_Alive > 0 && HVAA_Setting.De_Skill_Boss && window.Monster_Count_Alive >= HVAA_Setting.De_Skill_Boss_Count) || HVAA_Setting.De_Skill_All)) {
    var Skill_Lib = {
      'Sle': {
        'name': 'Sleep',
        'id': '222',
        'img': 'sleep',
        'effect': true,
        'Weight': HVAA_Setting.Weight_Sle
      },
      'Bl': {
        'name': 'Blind',
        'id': '231',
        'img': 'blind',
        'effect': true,
        'Weight': HVAA_Setting.Weight_Bl
      },
      'Slo': {
        'name': 'Slow',
        'id': '221',
        'img': 'slow',
        'effect': true,
        'Weight': HVAA_Setting.Weight_Slo
      },
      'Im': {
        'name': 'Imperil',
        'id': '213',
        'img': 'imperil',
        'effect': false,
        'Weight': HVAA_Setting.Weight_Im
      },
      'CM': {
        'name': 'Coalesced Mana',
        'id': '',
        'img': 'coalescemana',
        'effect': false,
        'Weight': HVAA_Setting.Weight_CM
      },
      'MN': {
        'name': 'MagNet',
        'id': '233',
        'img': 'magnet',
        'effect': false,
        'Weight': HVAA_Setting.Weight_MN
      },
      'Si': {
        'name': 'Silence',
        'id': '232',
        'img': 'silence',
        'effect': false,
        'Weight': HVAA_Setting.Weight_Si
      },
      'Dr': {
        'name': 'Drain',
        'id': '211',
        'img': 'drainhp',
        'effect': false,
        'Weight': HVAA_Setting.Weight_Dr
      },
      'We': {
        'name': 'Weaken',
        'id': '212',
        'img': 'weaken',
        'effect': false,
        'Weight': HVAA_Setting.Weight_We
      },
      'Co': {
        'name': 'Confuse',
        'id': '223',
        'img': 'confuse',
        'effect': false,
        'Weight': HVAA_Setting.Weight_Co
      }
    }
    Monster_Status.sort(ArrCom('id'));
    var Monter_Buff = ge(1, 'div.btm6');
    for (var i = 0; i < Monter_Buff.length; i++) {
      for (var j in Skill_Lib) {
        Monster_Status[i].Fin_Weight += (Monter_Buff[i].querySelector('img[src*="' + Skill_Lib[j].img + '"]')) ? parseFloat(Skill_Lib[j].Weight)  : 0;
      }
    }
    Monster_Status.sort(ArrCom('Fin_Weight'));
    for (var i in Skill_Lib) {
      if (HVAA_Setting['De_Skill_Boss_' + i] && window.Monster_Count_Boss_Alive > 0 && HVAA_Setting.De_Skill_Boss && Skill_Lib[i].effect && window.Monster_Count_Alive >= HVAA_Setting.De_Skill_Boss_Count) {
        if (ge(2, Skill_Lib[i].id)) {
          if (ge(2, Skill_Lib[i].id).style.opacity !== '0.5') {
            for (var j = Monster_Status.length - 1; j >= 0; j--) {
              if (!Monster_Status[j].isDead) {
                var Monster_Find = (!ge(0, '#mkey_' + Monster_Status[j].id + '>.btm6>img[src*="' + Skill_Lib[i].img + '"]')) ? true : false;
                break;
              }
            }
            if (Monster_Find) {
              ge(2, Skill_Lib[i].id).click();
              ge(0, '#mkey_' + Monster_Status[j].id).click();
              window.HVAA_End = true;
              return;
            }
          }
        }
      } else if (((HVAA_Setting['De_Skill_Boss_' + i] && window.Monster_Count_Boss_Alive > 0 && HVAA_Setting.De_Skill_Boss) || (HVAA_Setting['De_Skill_All_' + i] && HVAA_Setting.De_Skill_All)) && !Skill_Lib[i].effect) {
        if (ge(2, Skill_Lib[i].id) && !ge(0, '#mkey_' + Monster_Status[0].id + '>.btm6>img[src*="' + Skill_Lib[i].img + '"]')) {
          if (ge(2, Skill_Lib[i].id).style.opacity !== '0.5') {
            ge(2, Skill_Lib[i].id).click();
            ge(0, '#mkey_' + Monster_Status[0].id).click();
            window.HVAA_End = true;
            return;
          }
        }
      }
    }
  }
} //////////////////////////////////////////////////

function AutoAttack() { //自动打怪
  if (window.oc >= HVAA_Setting.Spirit_Stance_OC && HVAA_Setting.Spirit_Stance && !ge(0, '#ckey_spirit[src*="spirit_a"]')) {
    ge(0, '#ckey_spirit').click();
  }
  Monster_Status.sort(ArrCom('Fin_Weight'));
  var minnum = Monster_Status[0].id;
  if (Attack_Status !== 0) {
    if (ge(2, '1' + Attack_Status + '1')) ge(2, '1' + Attack_Status + '1').click();
    if (Monster_Count_Alive >= HVAA_Setting.Mi_Skill && ge(2, '1' + Attack_Status + '2')) ge(2, '1' + Attack_Status + '2').click();
    if (Monster_Count_Alive >= HVAA_Setting.Hi_Skill && ge(2, '1' + Attack_Status + '3')) ge(2, '1' + Attack_Status + '3').click();
  }
  if (HVAA_Setting.Sp_Skill) {
    /*
    if (HVAA_Setting.Sp_Skill_FUS && (Monster_Count_Alive > HVAA_Setting.Sp_Skill_FUS_Monster || Monster_Count_Boss_Alive > HVAA_Setting.Sp_Skill_FUS_Boss) && ge(2,''))     ge(2,'').click();
    */
    if (HVAA_Setting.Sp_Skill_OFC && (Monster_Count_Alive > HVAA_Setting.Sp_Skill_OFC_Monster || Monster_Count_Boss_Alive > HVAA_Setting.Sp_Skill_OFC_Boss) && ge(2, '1111')) ge(2, '1111').click();
  }
  if (minnum === 10) minnum = 0;
  if (HVAA_Setting.Reloader) {
    setTimeout(function () {
      ge(2, 'mkey_' + minnum).click();
    }, 100);
  } else {
    ge(2, 'mkey_' + minnum).click();
  }
} //////////////////////////////////////////////////
/*外来函数*/

function ArrCom(propertyName) { //对象数组排序函数，从小到大排序，来自http://www.jb51.net/article/24536.htm
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
