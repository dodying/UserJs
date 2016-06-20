// ==UserScript==
// @name        HV_AutoAttack
// @name:zh-CN  【HV】HV自动打怪
// @name:zh-TW  【HV】HV自動打怪
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description HV auto attack script, for the first user, should configure before use it.
// @description:zh-CN HV自动打怪脚本，初次使用，请先设置好选项
// @description:zh-TW HV自動打怪腳本，初次使用，請先設置好選項
// @include     http://hentaiverse.org/*
// @version     2.43
// @grant       none
// @run-at      document-end
// ==/UserScript==
if (document.querySelector('form[name="ipb_login_form"]')) return;
if (document.querySelector('img[src="http://ehgt.org/g/derpy.gif"]')) window.location = window.location.href;
/*
if (!localStorage.HVAA_Language) {
  var language = parseInt(prompt('Choose a language, plz\r\n请选择一个语言\r\n1.Englsh\r\n2.中文简体\r\n3.中文繁体'));
  localStorage.HVAA_Language = language;
} else {
  var language = parseInt(localStorage.HVAA_Language);
}
*/
OptionButton();
if (localStorage.HVAA_Setting) {
  var HVAA_Setting = JSON.parse(localStorage.HVAA_Setting);
  if (HVAA_Setting.version !== GM_info.script.version.substring(0, 4)) {
    alert('HV-AutoAttack版本更新，请重新设置\r\n强烈推荐【重置设置】后再设置。');
    if (confirm('是否查看帮助页面')) window.open('https://github.com/dodying/UserJs/blob/master/HV_AutoAttack/README.md');
    document.querySelector('#HV_AutoAttack_Option').style.display = 'block';
    document.querySelector('#HVAA_Setting_Clear').focus();
    window.HVAA_End = true;
    return;
  }
} else {
  alert('请设置HV-AutoAttack');
  if (confirm('是否查看帮助页面')) window.open('https://github.com/dodying/UserJs/blob/master/HV_AutoAttack/README.md');
  document.querySelector('#HV_AutoAttack_Option').style.display = 'block';
  return;
}
RiddleAlert(); //答题警报
if (!document.querySelector('#togpane_log')) {
  removeItemInStorage(2);
  return;
}
HotKey(); //设置全局快捷键
if (localStorage.HVAA_disabled) { //如果禁用
  document.title = '[HVAA_暂停]' + document.title;
  return;
} else { //如果没有禁用
  if (!localStorage.HVAA_Attack_Status) {
    var Attack_Status = HVAA_Setting.Attack_Status;
  } else {
    var Attack_Status = localStorage.HVAA_Attack_Status;
  }
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
    if (HVAA_Setting.Reloader_Masking) {
      AddMasking(); //Reloader防止误操作
    }
    var mo = new MutationObserver(main);
    mo.observe(document.all.leftpane, {
      childList: true,
      subtree: true
    });
  }
  main();
} //////////////////////////////////////////////////

function main() { //主程序
  runtime++;
  window.Monster_Count_All = document.querySelectorAll('div.btm1').length;
  window.Monster_Count_Dead = document.querySelectorAll('img[src*="/s/nbardead.png"]').length;
  window.Monster_Count_Alive = Monster_Count_All - Monster_Count_Dead;
  window.Monster_Count_Boss = document.querySelectorAll('div.btm2[style^=\'background:\']').length;
  window.Monster_Count_Boss_Dead = document.querySelectorAll('div.btm1[style*=\'opacity:\'] div.btm2[style*=\'background:\']').length;
  window.Monster_Count_Boss_Alive = Monster_Count_Boss - Monster_Count_Boss_Dead;
  CountRound(); //回合计数及自动前进并获取怪物总HP
  if (localStorage.HVAA_Monster_Status) {
    window.Monster_Status = JSON.parse(localStorage.HVAA_Monster_Status);
  }
  window.HP = document.querySelectorAll('.cwb2') [0].offsetWidth / 120;
  window.MP = document.querySelectorAll('.cwb2') [1].offsetWidth / 120;
  window.SP = document.querySelectorAll('.cwb2') [2].offsetWidth / 120;
  window.oc = document.querySelectorAll('.cwb2') [3].offsetWidth / 120;
  BattleInfo(); //战斗战况
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
  if (HVAA_Setting.Su_Ch_Skill) {
    AutoUsePotAndSuSkill(); //自动使用药水、施法增益技能
  }
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
  CountMonsterHP(); //统计怪物血量
  AutoUseDeSkill(); //自动施法De技能
  if (window.HVAA_End) {
    window.HVAA_End = false;
    return;
  }
  AutoAttack(); //自动打怪
} //////////////////////////////////////////////////

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
  button.innerHTML = '【误操作模式】开启';
  button.onclick = function () {
    if (img.style.zIndex === '999') {
      img.style.zIndex = '0';
      button.innerHTML = '【误操作模式】关闭';
    } else {
      img.style.zIndex = '999';
      button.innerHTML = '【误操作模式】开启';
    }
  }
  document.querySelector('.clb').insertBefore(button, document.querySelector('.clb>.cbl'))
} //////////////////////////////////////////////////

function removeItemInStorage(i) {
  localStorage.removeItem('HVAA_disabled');
  if (i > 0) {
    localStorage.removeItem('HVAA_Round_Now');
    localStorage.removeItem('HVAA_Round_All');
    localStorage.removeItem('HVAA_Monster_Status');
    if (i > 1) {
      localStorage.removeItem('HVAA_Round_Type');
      localStorage.removeItem('HVAA_Attack_Status');
    }
  }
} //////////////////////////////////////////////////

function OptionButton() { //配置
  var HV_AutoAttack_Button = document.createElement('div');
  HV_AutoAttack_Button.id = 'HV_AutoAttack_Button';
  var Left = window.innerWidth - 225;
  HV_AutoAttack_Button.style = 'top:4px;left:' + Left + 'px;position:absolute;z-index:9999;';
  HV_AutoAttack_Button.innerHTML = '<a href="javascript:void(0)"><img src="https://cdn0.iconfinder.com/data/icons/thinico/88/thinico-17-24.png" /></a>';
  HV_AutoAttack_Button.querySelector('a').onclick = function () {
    if (document.querySelector('#HV_AutoAttack_Option').style.display === 'none') {
      document.querySelector('#HV_AutoAttack_Option').style.display = 'block';
    } else {
      document.querySelector('#HV_AutoAttack_Option').style.display = 'none';
    }
  };
  document.body.appendChild(HV_AutoAttack_Button);
  var HV_AutoAttack_Option = document.createElement('div');
  HV_AutoAttack_Option.id = 'HV_AutoAttack_Option';
  Left = document.documentElement.clientWidth / 2 - 350;
  HV_AutoAttack_Option.style = 'font-size:large;z-index:9999;width:700px;display:none;background-color:white;position:absolute;left:' + Left + 'px;top:50px;border-color:black;border-style:solid;text-align:left;';
  HV_AutoAttack_Option.innerHTML = '<h1 style="text-align:center;">HV AutoAttack设置&nbsp;<button id="HVAA_Setting_Clear"onclick="localStorage.removeItem(\'HVAA_Setting\');location.reload();"title="推荐每次更新后点击一次">重置设置</button>&nbsp;<a href="https://github.com/dodying/UserJs/issues/6"target="_blank"style="font-size:small">提交Bug或建议</a></h1><div style="text-align:center;"onmouseover="this.firstElementChild.style.display=\'\';"onmouseout="this.firstElementChild.style.display=\'none\';"><div style="display:none;">1.使用宝石回复&nbsp;2.使用（技能、）Potion药水（、防御）回复&nbsp;3.使用Elixir药水回复</div><span style="color:green;">HP:1.<input name="HVAA_HP1"style="width:24px;"placeholder="50"type="text"title="使用宝石回血">%&nbsp;2.<input name="HVAA_HP2"style="width:24px;"placeholder="50"type="text"title="使用技能、药水、防御回血">%&nbsp;3.<input name="HVAA_HP3"style="width:24px;"placeholder="5"type="text"title="使用Elixir药水">%&nbsp;</span><span style="color:blue;">MP:1.<input name="HVAA_MP1"style="width:24px;"placeholder="70"type="text"title="使用宝石回魔">%&nbsp;2.<input name="HVAA_MP2"style="width:24px;"placeholder="10"type="text"title="使用药水回魔">%&nbsp;3.<input name="HVAA_MP3"style="width:24px;"placeholder="5"type="text"title="使用Elixir药水">%&nbsp;</span><span style="color:red;">SP:1.<input name="HVAA_SP1"style="width:24px;"placeholder="75"type="text"title="使用宝石回精">%&nbsp;2.<input name="HVAA_SP2"style="width:24px;"placeholder="50"type="text"title="使用药水回精">%&nbsp;3.<input name="HVAA_SP3"style="width:24px;"placeholder="5"type="text"title="使用Elixir药水">%&nbsp;</span></div><div id="HVAA_Attack_Status"style="color:red;text-align:center;"><b>攻击模式</b>：<input type="radio"id="HVAA_Attack_Status_0"name="HVAA_Attack_Status"value="0"><label for="HVAA_Attack_Status_0">物理</label><input type="radio"id="HVAA_Attack_Status_1"name="HVAA_Attack_Status"value="1"><label for="HVAA_Attack_Status_1">火</label><input type="radio"id="HVAA_Attack_Status_2"name="HVAA_Attack_Status"value="2"><label for="HVAA_Attack_Status_2">冰</label><input type="radio"id="HVAA_Attack_Status_3"name="HVAA_Attack_Status"value="3"><label for="HVAA_Attack_Status_3">雷</label><input type="radio"id="HVAA_Attack_Status_4"name="HVAA_Attack_Status"value="4"><label for="HVAA_Attack_Status_4">风</label><input type="radio"id="HVAA_Attack_Status_5"name="HVAA_Attack_Status"value="5"><label for="HVAA_Attack_Status_5">圣</label><input type="radio"id="HVAA_Attack_Status_6"name="HVAA_Attack_Status"value="6"><label for="HVAA_Attack_Status_6">暗</label></div><div title="默认【空格】暂停，【回车】选择模式"><b>快捷键</b>：按<input name="HVAA_Shortcut_Pause"style="width:60px;"type="text"placeholder=" "onkeyup="this.value=event.key;">暂停，按<input name="HVAA_Shortcut_Choose"style="width:60px;"type="text"placeholder="Enter"onkeyup="this.value=event.key;">选择模式</div><div><b>技能施放条件</b>：中级：怪物存活数≥<input name="HVAA_Mi_Skill"placeholder="4"style="width:24px;"type="text">；高级：怪物存活数≥<input name="HVAA_Hi_Skill"placeholder="6"style="width:24px;"type="text">。</div><div><input type="checkbox"id="HVAA_UnCrazy_Mode"checked="true"><label for="HVAA_UnCrazy_Mode"><b>非浴血模式</b>：当血量≤<input name="HVAA_UnCrazy_Mode_HP"style="width:24px;"placeholder="44"type="text">%时，脚本发出警告并暂停。</label></div><div title="防止脚本莫名暂停"><input id="HVAA_Delay_Alert"type="checkbox"><label for="HVAA_Delay_Alert">页面停留<input name="HVAA_Delay_Alert_Time"placeholder="10"style="width:24px;"type="text">秒后，<b>警报</b>；</label><input id="HVAA_Delay_Reload"type="checkbox"><label for="HVAA_Delay_Reload">页面停留<input name="HVAA_Delay_Reload_Time"placeholder="15"style="width:24px;"type="text">秒后，<b>刷新页面</b>。</label></div><div><input id="HVAA_Reloader"type="checkbox"><label for="HVAA_Reloader"><b>兼容<a href="https://forums.e-hentai.org/index.php?showtopic=65126&st=2660&p=4384894&#entry4384894"target="_blank"title="感谢网友【zsp40088】提出，推荐安装版本【Vanilla Reloader 1.1.1】">Reloader</a>脚本</b></label><input id="HVAA_Reloader_Masking"type="checkbox"checked="true"><label for="HVAA_Reloader_Masking"><b>防止误操作</b></label></div><div title="延时攻击，防止内存使用过高，然并卵"><b>延时攻击</b>：延时<input name="HVAA_Attack_Delay_Time"style="width:24px;"placeholder="0.1"type="text">秒攻击。</div><div style="height:1px;background-color:black;"></div><div onmouseover="if (this.firstElementChild.checked){this.lastElementChild.style.display = \'\';}"onmouseout="this.lastElementChild.style.display=\'none\';"><input type="checkbox"id="HVAA_Attack_Weakness"checked="true"><label for="HVAA_Attack_Weakness"><b>弱点打击</b>：针对Boss，如果由于出现未知的Boss导致暂停，</label><div style="display:none;">请将Boss的姓名与弱点提交到<a href="https://github.com/dodying/UserJs/issues/"target="_blank">Github issues</a>，谢谢~！<br>解决办法：1.暂停脚本或不勾选本设置<br>【推荐】2.打开脚本，搜索【Boss的弱点库】，之后按格式添加。</div></div><div style="height:1px;background-color:black;"></div><div title="增益技能与Channel技能"onmouseover="if (this.querySelector(\'#HVAA_Su_Ch_Skill\').checked){this.querySelector(\'#HVAA_Su_Ch_Skill_Div\').style.display=\'\';}"onmouseout="this.querySelector(\'#HVAA_Su_Ch_Skill_Div\').style.display=\'none\';this.querySelector(\'#HVAA_Su_Ch_Skill_Div\').style.display=\'none\';"><input type="checkbox"id="HVAA_Su_Ch_Skill"checked="true"><label for="HVAA_Su_Ch_Skill"><b>【增益技能】与【Channel技能】</b></label><div id="HVAA_Su_Ch_Skill_Div"style="display:none;">施放条件（有一个成立就行）：<br>1、总回合数≥<input name="HVAA_All_Mode_All_Round"placeholder="12"style="width:24px;"type="text">。2、存活≥<input name="HVAA_All_Mode_Boss_Count"placeholder="1"style="width:24px;"type="text">只Boss。3、遭遇战中，存在≥<input name="HVAA_All_Mode_Monster_Count"placeholder="6"style="width:24px;"type="text">只怪物。<br><b>增益技能</b>（Buff不存在就施放的技能，按【施放顺序】排序）：<div id="HVAA_Su_Skill_Div"><input type="checkbox"id="HVAA_Su_Skill_HD"checked="true"><label for="HVAA_Su_Skill_HD">Health Draught</label><input type="checkbox"id="HVAA_Su_Skill_MD"checked="true"><label for="HVAA_Su_Skill_MD">Mana Draught</label><input type="checkbox"id="HVAA_Su_Skill_SD"checked="true"><label for="HVAA_Su_Skill_SD">Spirit Draught</label><input type="checkbox"id="HVAA_Su_Skill_Pr"checked="true"><label for="HVAA_Su_Skill_Pr">Protection</label><input type="checkbox"id="HVAA_Su_Skill_Ha"checked="true"><label for="HVAA_Su_Skill_Ha">Haste</label><input type="checkbox"id="HVAA_Su_Skill_SL"checked="true"><label for="HVAA_Su_Skill_SL">Spark of Life</label><br><input type="checkbox"id="HVAA_Su_Skill_SS"checked="true"><label for="HVAA_Su_Skill_SS">Spirit Shield</label><input type="checkbox"id="HVAA_Su_Skill_AF"><label for="HVAA_Su_Skill_AF">Arcane Focus</label><input type="checkbox"id="HVAA_Su_Skill_He"><label for="HVAA_Su_Skill_He">Heartseeker</label><input type="checkbox"id="HVAA_Su_Skill_Re"><label for="HVAA_Su_Skill_Re">Regen</label><input type="checkbox"id="HVAA_Su_Skill_SV"><label for="HVAA_Su_Skill_SV">Shadow Veil</label><input type="checkbox"id="HVAA_Su_Skill_Ab"><label for="HVAA_Su_Skill_Ab">Absorb</label></div><div></div>当<b>获得Channel时</b>，即施法只需1点MP，<br><b>先ReBuff</b>：buff存在≤<input name="HVAA_Ch_ReSkill"style="width:24px;"placeholder="15"type="text">回合时，重新使用该技能。<br><b>再施放Channel技能</b>（按【施放顺序】排序）：<div id="HVAA_Ch_Skill_Div"><input type="checkbox"id="HVAA_Ch_Skill_Pr"><label for="HVAA_Ch_Skill_Pr">Protection</label><input type="checkbox"id="HVAA_Ch_Skill_Ha"><label for="HVAA_Ch_Skill_Ha">Haste</label><input type="checkbox"id="HVAA_Ch_Skill_SL"><label for="HVAA_Ch_Skill_SL">Spark of Life</label><input type="checkbox"id="HVAA_Ch_Skill_SS"><label for="HVAA_Ch_Skill_SS">Spirit Shield</label><input type="checkbox"id="HVAA_Ch_Skill_AF"checked="true"><label for="HVAA_Ch_Skill_AF">Arcane Focus</label><br><input type="checkbox"id="HVAA_Ch_Skill_He"><label for="HVAA_Ch_Skill_He">Heartseeker</label><input type="checkbox"id="HVAA_Ch_Skill_Re"checked="true"><label for="HVAA_Ch_Skill_Re">Regen</label><input type="checkbox"id="HVAA_Ch_Skill_SV"checked="true"><label for="HVAA_Ch_Skill_SV">Shadow Veil</label><input type="checkbox"id="HVAA_Ch_Skill_Ab"checked="true"><label for="HVAA_Ch_Skill_Ab">Absorb</label></div></div></div><div style="height:1px;background-color:black;"></div><div onmouseover="if (this.querySelector(\'#HVAA_De_Skill_Boss\').checked){this.querySelector(\'#HVAA_De_Skill_Boss_Div\').style.display = \'\';}if (this.querySelector(\'#HVAA_De_Skill_All\').checked){this.querySelector(\'#HVAA_De_Skill_All_Div\').style.display = \'\';}"onmouseout="this.querySelector(\'#HVAA_De_Skill_Boss_Div\').style.display=\'none\';this.querySelector(\'#HVAA_De_Skill_All_Div\').style.display=\'none\';"><input type="checkbox"id="HVAA_De_Skill"checked="true"><label for="HVAA_De_Skill"><b>De技能</b>（按【施放顺序】排序，模式优先度1>2）：</label><br><input type="checkbox"id="HVAA_De_Skill_Boss"checked="true"><label for="HVAA_De_Skill_Boss">模式1、<b>只对Boss施放</b>：</label><div id="HVAA_De_Skill_Boss_Div"style="display:none;"><input type="checkbox"id="HVAA_De_Skill_Boss_Im"checked="true"><label for="HVAA_De_Skill_Boss_Im">Imperil</label><input type="checkbox"id="HVAA_De_Skill_Boss_MN"><label for="HVAA_De_Skill_Boss_MN">MagNet</label><input type="checkbox"id="HVAA_De_Skill_Boss_Si"><label for="HVAA_De_Skill_Boss_Si">Silence</label><input type="checkbox"id="HVAA_De_Skill_Boss_Dr"><label for="HVAA_De_Skill_Boss_Dr">Drain</label><input type="checkbox"id="HVAA_De_Skill_Boss_We"><label for="HVAA_De_Skill_Boss_We">Weaken</label><br>存活≥<input name="HVAA_De_Skill_Boss_Count"style="width:24px;"placeholder="5"type="text">只怪物时，施放<input type="checkbox"id="HVAA_De_Skill_Boss_Sle"><label for="HVAA_De_Skill_Boss_Sle">Sleep</label><input type="checkbox"id="HVAA_De_Skill_Boss_Bl"><label for="HVAA_De_Skill_Boss_Bl">Blind</label><input type="checkbox"id="HVAA_De_Skill_Boss_Slo"><label for="HVAA_De_Skill_Boss_Slo">Slow</label></div><input type="checkbox"id="HVAA_De_Skill_All"><label for="HVAA_De_Skill_All"><b>模式2、对所有怪施放</b>：</label><div id="HVAA_De_Skill_All_Div"style="display:none;">按血量<b>从少到多</b>对怪兽施放，优先攻击<b>有</b>以下Buff的怪兽<br><input type="checkbox"id="HVAA_De_Skill_All_Im"checked="true"><label for="HVAA_De_Skill_All_Im">Imperil</label><input type="checkbox"id="HVAA_De_Skill_All_MN"><label for="HVAA_De_Skill_All_MN">MagNet</label><input type="checkbox"id="HVAA_De_Skill_All_Si"><label for="HVAA_De_Skill_All_Si">Silence</label><input type="checkbox"id="HVAA_De_Skill_All_Dr"><label for="HVAA_De_Skill_All_Dr">Drain</label><input type="checkbox"id="HVAA_De_Skill_All_We"><label for="HVAA_De_Skill_All_We">Weaken</label></div></div><div style="height:1px;background-color:black;"></div><div id="HVAA_Alert"style="text-align:center;"><b>警报</b><br>【默认】：<input class="HVAA_Alert"name="HVAA_Alert_default"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a><br/>【答题】：<input class="HVAA_Alert"name="HVAA_Alert_Riddle"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a><br/>【胜利】：<input class="HVAA_Alert"name="HVAA_Alert_Win"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a><br/>【错误】：<input class="HVAA_Alert"name="HVAA_Alert_Error"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a><br/>【失败】：<input class="HVAA_Alert"name="HVAA_Alert_Failed"style="width:400px;"type="text"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value||this.previousElementSibling.placeholder);audio.play();">试听</a></div><div style="text-align:center;"><button id="HVAA_Setting_Apply">确认</button><button onclick="document.querySelector(\'#HV_AutoAttack_Option\').style.display=\'none\';">取消</button></div>';
  var Input_Alert = HV_AutoAttack_Option.querySelectorAll('.HVAA_Alert');
  var File_Type = (/Chrome|Safari/.test(window.navigator.userAgent)) ? '.mp3' : '.wav';
  for (var i = 0; i < Input_Alert.length; i++) {
    Input_Alert[i].placeholder = 'https://github.com/dodying/UserJs/raw/master/HV_AutoAttack/' + Input_Alert[i].name.replace('HVAA_Alert_', '') + File_Type;
  }
  if (localStorage.HVAA_Setting) {
    var HVAA_Setting = JSON.parse(localStorage.HVAA_Setting);
    var input = HV_AutoAttack_Option.querySelectorAll('input');
    for (var i = 0; i < input.length; i++) {
      if (input[i].type === 'text') {
        input[i].value = HVAA_Setting[input[i].name.replace('HVAA_', '')];
      } else if (input[i].type === 'checkbox') {
        input[i].checked = HVAA_Setting[input[i].id.replace('HVAA_', '')];
      } else if (input[i].type === 'radio') {
        (HVAA_Setting[input[i].name.replace('HVAA_', '')] === input[i].value) ? input[i].checked = true : input[i].checked = false;
      }
    }
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
    var input = Option.querySelectorAll('input');
    for (var i = 0; i < input.length; i++) {
      if (input[i].type === 'text') {
        HVAA_Setting[input[i].name.replace('HVAA_', '')] = input[i].value || input[i].placeholder;
      } else if (input[i].type === 'checkbox') {
        HVAA_Setting[input[i].id.replace('HVAA_', '')] = input[i].checked;
      } else if (input[i].type === 'radio' && input[i].checked) {
        HVAA_Setting[input[i].name.replace('HVAA_', '')] = input[i].value;
      }
    }
    localStorage.HVAA_Setting = JSON.stringify(HVAA_Setting);
    Option.style.display = 'none';
    window.location = window.location.href;
  }
  document.body.appendChild(HV_AutoAttack_Option);
} //////////////////////////////////////////////////

function HotKey() { //设置全局快捷键
  window.onkeydown = function (e) {
    if (e.key === HVAA_Setting.Shortcut_Pause) {
      if (!localStorage.HVAA_disabled) {
        localStorage.HVAA_disabled = true;
      } else {
        removeItemInStorage(0);
      }
      window.location = window.location.href;
    } else if (e.key === HVAA_Setting.Shortcut_Choose) {
      var p = parseInt(prompt('请选择（默认为火）：\n0.物理\n1.火\n2.冰\n3.雷\n4.风\n5.圣\n6.暗', ''));
      if (isNaN(p)) {
        return;
      }
      localStorage.HVAA_Attack_Status = p;
      window.location = window.location.href;
    }
  };
} //////////////////////////////////////////////////

function RiddleAlert() { //答题警报
  if (document.querySelector('#riddlemaster')) {
    document.title = '！！！紧急';
    var audio = document.createElement('audio');
    audio.src = HVAA_Setting.Alert_Riddle;
    audio.play();
    var random = Math.random();
    if (random < 1 / 3) {
      document.querySelector('#riddlemaster').value = 'A';
    } else if (random < 2 / 3) {
      document.querySelector('#riddlemaster').value = 'B';
    } else {
      document.querySelector('#riddlemaster').value = 'C';
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
  var RoundType;
  if (!localStorage.HVAA_Round_Type) {
    RoundType = window.location.search.toString().replace('?', '').replace('s=Battle', '').replace('ss=', '').replace('page=2', '').replace(/filter=(.*)/, '').replace(/encounter=(.*)/, 'encounter').replace(/&/g, '').replace('ba', '');
    localStorage.HVAA_Round_Type = RoundType;
  } else {
    RoundType = localStorage.HVAA_Round_Type;
  }
  var BattleLog = document.querySelectorAll('#togpane_log>table>tbody>tr>td.t3');
  if (BattleLog[BattleLog.length - 1].innerHTML === 'Battle Start!') {
    removeItemInStorage(1);
  }
  if (!localStorage.HVAA_Round_Now) {
    var Monster_Status = [
    ];
    var id = 0;
    for (var i = BattleLog.length - 3; i > BattleLog.length - 3 - Monster_Count_All; i--) {
      var temp = {
      };
      var HP_All = parseFloat(BattleLog[i].innerHTML.replace(/.*HP=/, ''));
      temp.id = (id === 9) ? 0 : id+1;
      temp.isDead = false;
      temp.isBoss = (document.querySelectorAll('div.btm2') [id].style.background === '') ? false : true;
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
    if (RoundType === 'encounter') {
      if (Monster_Count_All >= HVAA_Setting.All_Mode_HVAA_Setting.All_Mode_Boss_Count_Count || Monster_Count_Boss_Alive >= HVAA_Setting.All_Mode_Boss_Count) {
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
    } else {
      var Round = BattleLog[BattleLog.length - 2].innerHTML.replace(/.*\(Round /, '').replace(/\).*/, '').replace(/\s+/g, '');
      Round_Now = Number(Round.replace(/\/.*/, ''));
      localStorage.HVAA_Round_Now = Round_Now;
      Round_All = Number(Round.replace(/.*\//, ''));
      localStorage.HVAA_Round_All = Round_All;
    }
  } else {
    Round_Now = Number(localStorage.HVAA_Round_Now);
    Round_All = Number(localStorage.HVAA_Round_All);
  }
  if (Monster_Count_Alive > 0 && document.querySelector('.btcp')) {
    OtherAlert('Failed');
    removeItemInStorage(2);
  } else if (Round_Now !== Round_All && document.querySelector('.btcp')) {
    removeItemInStorage(1);
    document.getElementById('ckey_continue').click();
  } else if (Round_Now === Round_All && document.querySelector('.btcp')) {
    OtherAlert('Win');
    removeItemInStorage(2);
    setTimeout(function () {
      window.location = 'http://hentaiverse.org/';
    }, 3000);
  } else if (Round_Now === Round_All) {
    document.getElementById('infopane').style.backgroundColor = 'gray';
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
  if (!document.querySelector('#HVAA_BattleLog')) {
    var div = document.createElement('div');
    div.id = 'HVAA_BattleLog';
    div.innerHTML = '运行次数：' + runtime + '<br>回合：' + Round_Now + '/' + Round_All + '<br>攻击模式：' + Attack_Status_title + '<br>存活Boss：' + Monster_Count_Boss_Alive + '<br>怪物：' + Monster_Count_Alive + '/' + Monster_Count_All;
    div.style = 'font-size:20px;text-align:center;';
    document.querySelector('div.clb').insertBefore(div, document.querySelector('.cit'));
  } else {
    document.querySelector('#HVAA_BattleLog').innerHTML = '运行次数：' + runtime + '<br>回合：' + Round_Now + '/' + Round_All + '<br>攻击模式：' + Attack_Status_title + '<br>存活Boss：' + Monster_Count_Boss_Alive + '<br>怪物：' + Monster_Count_Alive + '/' + Monster_Count_All;
  }
  document.title = runtime + '||' + Round_Now + '/' + Round_All + '||' + Monster_Count_Alive + '/' + Monster_Count_All;
} //////////////////////////////////////////////////

function AutoUseGem() { //自动使用宝石
  if (document.getElementById('ikey_p')) {
    var Gem = document.getElementById('ikey_p').getAttribute('onmouseover').replace(/battle.set_infopane_item\(\'(.*?)\'.*/, '$1');
    if (Gem === 'Health Gem' && HP <= HVAA_Setting.HP1 * 0.01) {
      document.getElementById('ikey_p').click();
      window.HVAA_End = true;
      return;
    } else if (Gem === 'Mana Gem' && MP <= HVAA_Setting.MP1 * 0.01) {
      document.getElementById('ikey_p').click();
      window.HVAA_End = true;
      return;
    } else if (Gem === 'Spirit Gem' && SP <= HVAA_Setting.SP1 * 0.01) {
      document.getElementById('ikey_p').click();
      window.HVAA_End = true;
      return;
    } else if (Gem === 'Mystic Gem') {
      document.getElementById('ikey_p').click();
      window.HVAA_End = true;
      return;
    }
  }
} //////////////////////////////////////////////////

function DeadSoon() { //自动回血回魔
  if (MP < HVAA_Setting.MP2 * 0.01) { //自动回魔
    document.getElementById('quickbar').style.backgroundColor = 'blue';
    if (document.querySelector('.bti3>div[onmouseover*="Mana Potion"]')) {
      document.querySelector('.bti3>div[onmouseover*="Mana Potion"]').click();
      window.HVAA_End = true;
      return;
    }
  }
  if (MP <= HVAA_Setting.MP3 * 0.01 && document.querySelector('.bti3>div[onmouseover*="Mana Elixir"]')) {
    document.querySelector('.bti3>div[onmouseover*="Mana Elixir"]').click();
    window.HVAA_End = true;
    return;
  }
  if (SP < HVAA_Setting.SP2 * 0.01) { //自动回精
    document.getElementById('quickbar').style.backgroundColor = 'green';
    if (document.querySelector('.bti3>div[onmouseover*="Spirit Potion"]')) {
      document.querySelector('.bti3>div[onmouseover*="Spirit Potion"]').click();
      window.HVAA_End = true;
      return;
    }
  }
  if (SP <= HVAA_Setting.SP3 * 0.01 && document.querySelector('.bti3>div[onmouseover*="Spirit Elixir"]')) {
    document.querySelector('.bti3>div[onmouseover*="Spirit Elixir"]').click();
    window.HVAA_End = true;
    return;
  }
  if (HP <= HVAA_Setting.HP2 * 0.01) { //自动回血
    if (!document.querySelector('.cwb2[src*="/s/barsilver.png"]')) {
      document.getElementById('quickbar').style.backgroundColor = 'red';
    }
    if (document.getElementById('311')) {
      if (document.getElementById('311').style.opacity !== '0.5') {
        document.getElementById('311').click();
        window.HVAA_End = true;
        return;
      }
    }
    if (document.getElementById('313')) {
      if (document.getElementById('313').style.opacity !== '0.5') {
        document.getElementById('313').click();
        window.HVAA_End = true;
        return;
      }
    }
    if (document.querySelector('.bti3>div[onmouseover*="Health Potion"]')) {
      document.querySelector('.bti3>div[onmouseover*="Health Potion"]').click();
      window.HVAA_End = true;
      return;
    }
    if (oc > 0.05) {
      document.getElementById('ckey_defend').click();
      window.HVAA_End = true;
      return;
    }
  }
  if (HP <= HVAA_Setting.HP3 * 0.01 && document.querySelector('.bti3>div[onmouseover*="Health Elixir"]')) {
    document.querySelector('.bti3>div[onmouseover*="Health Elixir"]').click();
    window.HVAA_End = true;
    return;
  }
} //////////////////////////////////////////////////

function AutoUsePotAndSuSkill() { //自动使用药水、施法增益技能
  var Skill_Lib = {
    'Pr': {
      'name': 'Protection',
      'id': '411',
      'img': 'protection'
    },
    'Ha': {
      'name': 'Haste',
      'id': '412',
      'img': 'haste'
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
    if (document.querySelector('div.bte>img[src*="/e/channeling.png"]')) {
      var buff = document.querySelectorAll('div.bte>img');
      if (buff.length > 0) {
        for (var n = 0; n < buff.length; n++) {
          var spell_name = buff[n].getAttribute('onmouseover').replace(/battle.set_infopane_effect\(\'(.*?)\'.*/, '$1');
          if (spell_name === 'Absorbing Ward') continue;
          var buff_lasttime = Number(buff[n].getAttribute('onmouseover').replace(/.*\'\,(.*?)\)/g, '$1'));
          if (buff_lasttime <= HVAA_Setting.Ch_ReSkill) {
            if (spell_name === 'Cloak of the Fallen' && !document.querySelector('div.bte>img[src*="/e/sparklife.png"]') && document.getElementById('422').style.opacity !== '0.5') {
              document.getElementById('422').click();
              window.HVAA_End = true;
              return;
            }
            for (var i in Skill_Lib) {
              if (spell_name === Skill_Lib[i].name && document.getElementById(Skill_Lib[i].id)) {
                if (document.getElementById(Skill_Lib[i].id).style.opacity !== '0.5') {
                  document.getElementById(Skill_Lib[i].id).click();
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
            if (HVAA_Setting['Ch_Skill_' + i] && !document.querySelector('div.bte>img[src*="/e/' + Skill_Lib[i].img + '.png"]') && document.getElementById(Skill_Lib[i].id)) {
              if (document.getElementById(Skill_Lib[i].id).style.opacity !== '0.5') {
                document.getElementById(Skill_Lib[i].id).click();
                window.HVAA_End = true;
                return;
              }
            }
          }
        }
      }
    }
    if (!document.querySelector('div.bte>img[src*="/e/healthpot.png"]') && HP <= 1 && HVAA_Setting.Su_Skill_HD && document.querySelector('.bti3>div[onmouseover*="Health Draught"]')) {
      document.querySelector('.bti3>div[onmouseover*="Health Draught"]').click();
      window.HVAA_End = true;
      return;
    } else if (!document.querySelector('div.bte>img[src*="/e/manapot.png"]') && MP <= 1 && HVAA_Setting.Su_Skill_MD && document.querySelector('.bti3>div[onmouseover*="Mana Draught"]')) {
      document.querySelector('.bti3>div[onmouseover*="Mana Draught"]').click();
      window.HVAA_End = true;
      return;
    } else if (!document.querySelector('div.bte>img[src*="/e/spiritpot.png"]') && SP <= 0.8 && HVAA_Setting.Su_Skill_SD && document.querySelector('.bti3>div[onmouseover*="Spirit Draught"]')) {
      document.querySelector('.bti3>div[onmouseover*="Spirit Draught"]').click();
      window.HVAA_End = true;
      return;
    }
    for (var i in Skill_Lib) {
      if (HVAA_Setting['Su_Skill_' + i] !== undefined) {
        if (HVAA_Setting['Su_Skill_' + i] && !document.querySelector('div.bte>img[src*="/e/' + Skill_Lib[i].img + '.png"]') && document.getElementById(Skill_Lib[i].id)) {
          if (document.getElementById(Skill_Lib[i].id).style.opacity !== '0.5') {
            document.getElementById(Skill_Lib[i].id).click();
            window.HVAA_End = true;
            return;
          }
        }
      }
    }
  } else if (Round_All === Round_Now && Round_All === 2) {
    if (!document.querySelector('div.bte>img[src*="/e/sparklife.png"]') && document.getElementById('422').style.opacity !== '0.5') {
      document.getElementById('422').click();
      window.HVAA_End = true;
      return;
    }
  }
} //////////////////////////////////////////////////

function CountMonsterHP() { //统计怪物血量
  var Monter_HP = document.querySelectorAll('div.btm4>div.btm5:nth-child(1)');
  for (var i = 0; i < Monter_HP.length; i++) {
    if (Monter_HP[i].querySelector('img[src="/y/s/nbardead.png"]')) {
      Monster_Status[i].isDead = true;
      Monster_Status[i].HPNow = Infinity;
    } else {
      Monster_Status[i].isDead = false;
      Monster_Status[i].HPNow = Math.floor(Monster_Status[i].HP * parseFloat(Monter_HP[i].querySelector('div.chbd>img.chb2').style.width) / 120) + 1;
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
        'Weight': + 5
      },
      'Bl': {
        'name': 'Blind',
        'id': '231',
        'img': 'blind',
        'effect': true,
        'Weight': + 3
      },
      'Slo': {
        'name': 'Slow',
        'id': '221',
        'img': 'slow',
        'effect': true,
        'Weight': + 3
      },
      'Im': {
        'name': 'Imperil',
        'id': '213',
        'img': 'imperil',
        'effect': false,
        'Weight': - 5
      },
      'CM': {
        'name': 'Coalesced Mana',
        'id': '',
        'img': 'coalescemana',
        'effect': false,
        'Weight': - 5
      },
      'MN': {
        'name': 'MagNet',
        'id': '233',
        'img': 'magnet',
        'effect': false,
        'Weight': - 4
      },
      'Si': {
        'name': 'Silence',
        'id': '232',
        'img': 'silence',
        'effect': false,
        'Weight': - 4
      },
      'Dr': {
        'name': 'Drain',
        'id': '211',
        'img': 'drainhp',
        'effect': false,
        'Weight': - 4
      },
      'We': {
        'name': 'Weaken',
        'id': '212',
        'img': 'weaken',
        'effect': false,
        'Weight': - 4
      }
    }
    Monster_Status.sort(ArrCom('id'));
    var Monter_Buff = document.querySelectorAll('div.btm6');
    for (var i = 0; i < Monter_Buff.length; i++) {
      for (var j in Skill_Lib) {
        Monster_Status[i].Fin_Weight += (Monter_Buff[i].querySelector('img[src*="/e/' + Skill_Lib[j].img + '.png"]')) ? Skill_Lib[j].Weight : 0;
      }
    }
    Monster_Status.sort(ArrCom('Fin_Weight'));
    for (var i in Skill_Lib) {
      if (HVAA_Setting['De_Skill_Boss_' + i] && window.Monster_Count_Boss_Alive > 0 && HVAA_Setting.De_Skill_Boss && Skill_Lib[i].effect && window.Monster_Count_Alive >= HVAA_Setting.De_Skill_Boss_Count) {
        if (document.getElementById(Skill_Lib[i].id)) {
          if (document.getElementById(Skill_Lib[i].id).style.opacity !== '0.5') {
            for (var j = Monster_Status.length - 1; j >= 0; j--) {
              if (!Monster_Status[j].isDead) {
                var Monster_Find=(!document.querySelector('#mkey_' + Monster_Status[j].id + '>.btm6>img[src*="/e/' + Skill_Lib[i].img + '.png"]'))? true : false ;
                  break;
              }
            }
            if (Monster_Find){
            document.getElementById(Skill_Lib[i].id).click();
            alert(Monster_Status[j].id)
            document.querySelector('#mkey_' + Monster_Status[j].id).click();
            window.HVAA_End = true;
            return;}
          }
        }
      } else if (((HVAA_Setting['De_Skill_Boss_' + i] && window.Monster_Count_Boss_Alive > 0 && HVAA_Setting.De_Skill_Boss) || (HVAA_Setting['De_Skill_All_' + i] && HVAA_Setting.De_Skill_All)) && !Skill_Lib[i].effect) {
        if (document.getElementById(Skill_Lib[i].id) && !document.querySelector('#mkey_' + Monster_Status[0].id + '>.btm6>img[src*="/e/' + Skill_Lib[i].img + '.png"]')) {
          if (document.getElementById(Skill_Lib[i].id).style.opacity !== '0.5') {
            document.getElementById(Skill_Lib[i].id).click();
            document.querySelector('#mkey_' + Monster_Status[0].id).click();
            window.HVAA_End = true;
            return;
          }
        }
      }
    }
  }
} //////////////////////////////////////////////////

function AutoAttack() { //自动打怪
  Monster_Status.sort(ArrCom('Fin_Weight'));
  var minnum = Monster_Status[0].id;
  var Chinese2Attack_Status = {
    '物理': 0,
    '火': 1,
    '冰': 2,
    '雷': 3,
    '风': 4,
    '圣': 5,
    '暗': 6
  };
  if (Monster_Count_Alive <= Monster_Count_Boss_Alive && Monster_Count_Alive > 0 && HVAA_Setting.Attack_Weakness) {
    var MonsterDiv = document.querySelector('#mkey_' + minnum + '>.btm3>.fd2>div');
    var MonsterName = MonsterDiv.innerHTML;
    var Boss_Weakness = { //Boss的弱点库
      //格式   '【姓名】':'弱点-【弱点】',
      //请加入到第一行
      'Dalek': '弱点-雷',
      'Manbearpig': '弱点-火',
      'White Bunneh': '弱点-冰',
      'Mithra': '弱点-圣',
      'Konata': '弱点-风',
      'Mikuru Asahina': '弱点-暗|圣',
      'Yuki Nagato': '弱点-暗|圣',
      'Real Life': '弱点-物理',
      'Ryouko Asakura': '弱点-圣|暗',
      'Invisible Pink Unicorn': '弱点-暗',
      'Yggdrasil': '弱点-火',
      'Urd': '弱点-冰',
      'Verdandi': '弱点-风',
      'Skuld': '弱点-雷',
      'Flying Spaghetti Monster': '弱点-圣'
    };
    if (MonsterName in Boss_Weakness) {
      MonsterDiv.innerHTML = Boss_Weakness[MonsterName];
      MonsterName = MonsterDiv.innerHTML;
      MonsterName = MonsterName.replace('弱点-', '').replace(/\|.*/, '');
      if (MonsterName in Chinese2Attack_Status) {
        Attack_Status = Chinese2Attack_Status[MonsterName];
      }
    } else {
      OtherAlert('Error');
      alert('请提交Boss的姓名与弱点给【https://github.com/dodying/UserJs/issues/】，谢谢~！');
      return;
    }
  }
  if (Attack_Status !== 0) {
    if (document.getElementById('1' + Attack_Status + '1')) {
      document.getElementById('1' + Attack_Status + '1').click();
    }
    if (Monster_Count_Alive >= HVAA_Setting.Mi_Skill && document.getElementById('1' + Attack_Status + '2')) {
      document.getElementById('1' + Attack_Status + '2').click();
    }
    if (Monster_Count_Alive >= HVAA_Setting.Hi_Skill && document.getElementById('1' + Attack_Status + '3')) {
      document.getElementById('1' + Attack_Status + '3').click();
    }
  }
  if (document.getElementById('2501').style.opacity !== '0.5' && oc >= 0.2) {
    document.getElementById('2501').click();
  }
  if (minnum === 10) {
    minnum = 0;
  }
  setTimeout(function () {
    document.getElementById('mkey_' + minnum).click();
  }, HVAA_Setting.Attack_Delay_Time * 1000);
} //////////////////////////////////////////////////

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
