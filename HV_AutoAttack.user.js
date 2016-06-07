// ==UserScript==
// @name        HV_AutoAttack
// @name:zh-CN  【HV】HV自动打怪
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description press [Space] pause，press [Enter] choose mode
// @description:zh-CN 自用的HV自动脚本，按[空格]暂停，按[回车]选择模式
// @include     http://hentaiverse.org/*
// @version     2.22
// @grant       none
// @run-at      document-end
// ==/UserScript==
if (document.querySelector('form[name="ipb_login_form"]')) return;
RiddleAlert(); //答题警报
if (document.querySelector('img[src="http://ehgt.org/g/derpy.gif"]')) window.location = window.location.href;
OptionButton();
if (localStorage.HVAA_Setting) {
  var HVAA_Setting = JSON.parse(localStorage.HVAA_Setting);
  //console.log(HVAA_Setting);
  if (HVAA_Setting.version !== GM_info.script.version) {
    alert('HV-AutoAttack更新，请重新设置配置');
    document.querySelector('#HV_AutoAttack_Option').style.display = 'block';
  }
} else {
  alert('请设置HV-AutoAttack');
  document.querySelector('#HV_AutoAttack_Option').style.display = 'block';
}
if (!document.querySelector('#togpane_log')) {
  localStorage.removeItem('HVAA_Round_Now');
  localStorage.removeItem('HVAA_Round_All');
  localStorage.removeItem('HVAA_Monster_Hp');
  localStorage.removeItem('HVAA_RoundType');
  localStorage.removeItem('HVAA_Attack_Status');
  localStorage.removeItem('HVAA_disabled');
  //setTimeout(function () {
  //window.location = window.location;
  //}, 5 * 60 * 1000);
  return;
}
HotKey(); //设置全局快捷键
if (localStorage.HVAA_disabled) { //如果禁用
  return;
} else { //如果没有禁用
  if (!localStorage.HVAA_Attack_Status) {
    var Attack_Status = HVAA_Setting.Attack_Status;
  } else {
    var Attack_Status = localStorage.HVAA_Attack_Status;
  }
  var Monster_All = document.querySelectorAll('div.btm1').length;
  var Monster_Dead = document.querySelectorAll('img[src*="/s/nbardead.png"]').length;
  var Monster_Alive = Monster_All - Monster_Dead;
  var Monster_Boss = document.querySelectorAll('div.btm2[style^=\'background:\']').length;
  var Monster_Boss_Dead = document.querySelectorAll('div.btm1[style*=\'opacity:\'] div.btm2[style*=\'background:\']').length;
  var Monster_Boss_Alive = Monster_Boss - Monster_Boss_Dead;
  CountRound(); //回合计数及自动前进
  ///10秒长期不动后警报
  setTimeout(function () {
    OtherAlert();
  }, 15000);
  var HP = document.querySelectorAll('.cwb2') [0].offsetWidth / 120;
  var MP = document.querySelectorAll('.cwb2') [1].offsetWidth / 120;
  var SP = document.querySelectorAll('.cwb2') [2].offsetWidth / 120;
  var oc = document.querySelectorAll('.cwb2') [3].offsetWidth / 120;
  AutoUseGem(); //则自动使用宝石
  DeadSoon(); //则自动回血回魔
  AutoUsePotAndBuffSkill(); //则自动使用药水、Buff技能
  AutoAttack(); //自动打怪
} //////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

function OptionButton() {
  var HV_AutoAttack_Button = document.createElement('div');
  HV_AutoAttack_Button.id = 'HV_AutoAttack_Button';
  HV_AutoAttack_Button.style = 'top:4px;left:' + eval(window.innerWidth - 225) + 'px;position:absolute;z-index:999;';
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
  HV_AutoAttack_Option.style = 'font-size:large;z-index:999;width:600px;display:none;background-color:white;position:absolute;left:' + eval(document.documentElement.clientWidth / 2 - 300) + 'px;top:110px;border-color:black;border-style:solid;text-align:left;';
  HV_AutoAttack_Option.innerHTML = '<h1 style="text-align:center;">HV AutoAttack设置</h1><div style="text-align:center;"><span style="color:green;">HP1:<input class="DeadSoon"name="HP1"style="width:16px;"value="50">%&nbsp;HP2:<input class="DeadSoon"name="HP2"style="width:16px;"value="44">%&nbsp;</span><span style="color:blue;">MP1:<input class="DeadSoon"name="MP1"style="width:16px;"value="70">%&nbsp;MP2:<input class="DeadSoon"name="MP2"style="width:16px;"value="10">%&nbsp;</span><span style="color:red;">SP1:<input class="DeadSoon"name="SP1"style="width:16px;"value="75">%&nbsp;SP2:<input class="DeadSoon"name="SP2"style="width:16px;"value="50">%</span></div><div><input type="checkbox"id="CrazyMode"><label for="CrazyMode">即使<span style="color:red;font-weight:bold;">血量过低</span>，仍然继续打怪。</label></div><div>延时攻击：延时<input id="Attack_Delay_Time"style="width:16px;"value="0.1">秒攻击。<br>延时攻击2：每隔<input id="Attack_Delay2_Round"style="width:16px;"value="10">回合，延迟<input id="Attack_Delay2_Time"style="width:16px;"value="10">秒攻击。</div><div>打怪模式：<input type="radio"id="Attack_Status_0"name="Attack_Status"value="0"><label for="Attack_Status_0">物理</label><input type="radio"id="Attack_Status_1"name="Attack_Status"value="1"checked><label for="Attack_Status_1">火</label><input type="radio"id="Attack_Status_2"name="Attack_Status"value="2"><label for="Attack_Status_2">冰</label><input type="radio"id="Attack_Status_3"name="Attack_Status"value="3"><label for="Attack_Status_3">雷</label><input type="radio"id="Attack_Status_4"name="Attack_Status"value="4"><label for="Attack_Status_4">风</label><input type="radio"id="Attack_Status_5"name="Attack_Status"value="5"><label for="Attack_Status_5">圣</label><input type="radio"id="Attack_Status_6"name="Attack_Status"value="6"><label for="Attack_Status_6">暗</label></div><div><h2 style="text-align:center;">警报</h2>【默认】：<input class="Alert"name="Alert_default"style="width:400px;"value="http://zjyd.sc.chinaz.com/files/downLoad/sound1/201601/6796.mp3"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a><br/>【答题】：<input class="Alert"name="Alert_Riddle"style="width:400px;"value="http://zjdx1.sc.chinaz.com/files/downLoad/sound/huang/cd9/mp3/111.mp3"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a><br/>【胜利】：<input class="Alert"name="Alert_Win"style="width:400px;"value="http://zjyd.sc.chinaz.com/files/downLoad/sound1/201602/6907.mp3"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a><br/>【错误】：<input class="Alert"name="Alert_Error"style="width:400px;"value="http://zjyd.sc.chinaz.com/files/downLoad/sound1/201602/6886.mp3"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a><br/>【失败】：<input class="Alert"name="Alert_Failed"style="width:400px;"value="http://zjyd.sc.chinaz.com/files/download/sound1/201207/1756.mp3"><a href="javascript:#"onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a></div><div style="text-align:center;"><button id="HVAA_Setting_Apply">确认</button><button onclick="document.querySelector(\'#HV_AutoAttack_Option\').style.display=\'none\';">取消</button></div>';
  HV_AutoAttack_Option.querySelector('#HVAA_Setting_Apply').onclick = function () {
    var Option = this.parentNode.parentNode;
    var HVAA_Setting = {
    };
    HVAA_Setting.version = GM_info.script.version;
    var DeadSoon = Option.querySelectorAll('.DeadSoon');
    for (var i = 0; i < DeadSoon.length; i++) {
      HVAA_Setting[DeadSoon[i].name] = parseFloat(DeadSoon[i].value);
    }
    if (Option.querySelector('#CrazyMode').checked) {
      HVAA_Setting.CrazyMode = true;
    } else {
      HVAA_Setting.CrazyMode = false;
    }
    HVAA_Setting.Attack_Delay_Time = parseFloat(Option.querySelector('#Attack_Delay_Time').value);
    HVAA_Setting.Attack_Delay2_Round = parseFloat(Option.querySelector('#Attack_Delay2_Round').value);
    HVAA_Setting.Attack_Delay2_Time = parseFloat(Option.querySelector('#Attack_Delay2_Time').value);
    HVAA_Setting.Attack_Status = parseInt(document.querySelector('input[name="Attack_Status"]:checked').value);
    var Input_Alert = Option.querySelectorAll('.Alert');
    for (i = 0; i < Input_Alert.length; i++) {
      HVAA_Setting[Input_Alert[i].name] = Input_Alert[i].value;
    }
    localStorage.HVAA_Setting = JSON.stringify(HVAA_Setting);
    Option.style.display = 'none';
  };
  document.body.appendChild(HV_AutoAttack_Option);
} //////////////////////////////////////////////////

function HotKey() { //设置全局快捷键
  window.onkeydown = function (e) {
    if (e.keyCode === 32) { //空格
      if (!localStorage.HVAA_disabled) {
        localStorage.HVAA_disabled = true;
      } else {
        localStorage.removeItem('HVAA_disabled');
      }
      window.location = window.location.href;
    } else if (e.keyCode === 13) { //回车
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

function OtherAlert(event) { //其他警报
  var audio = document.createElement('audio');
  switch (event) {
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

function CountRound() { //回合计数及自动前进并获取怪物Hp
  var RoundType;
  if (!localStorage.HVAA_RoundType) {
    RoundType = window.location.search.toString().replace('?s=Battle', '').replace('ss=', '').replace('page=2', '').replace(/filter=(.*)/, '').replace(/encounter=(.*)/, '').replace(/&/g, '');
    localStorage.HVAA_RoundType = RoundType;
  } else {
    RoundType = localStorage.HVAA_RoundType;
  }
  if (!localStorage.HVAA_Round_Now) {
    var BattleLog = document.querySelectorAll('#togpane_log>table>tbody>tr>td.t3');
    var Monster_Hp = [
    ];
    for (var i = BattleLog.length - 3; i > BattleLog.length - 3 - Monster_All; i--) {
      var hp = parseFloat(BattleLog[i].innerHTML.replace(/.*HP=/, ''));
      if (!isNaN(hp)) {
        Monster_Hp.push(hp);
      } else {
        Monster_Hp.push(Monster_Hp[Monster_Hp.length - 1]);
      }
    }
    localStorage.HVAA_Monster_Hp = Monster_Hp.join(',');
    if (RoundType === 'ba') {
      if (Monster_All > 6 || Monster_Boss_Alive > 0) {
        Round_Now = 1;
        localStorage.HVAA_Round_Now = Round_Now;
        Round_All = 1;
        localStorage.HVAA_Round_All = Round_All;
        //document.getElementById('1001').click();
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
  if (Monster_Alive > 0 && document.querySelector('.btcp')) {
    OtherAlert('Failed');
  } else if (Round_Now !== Round_All && document.querySelector('.btcp')) {
    localStorage.removeItem('HVAA_Round_Now');
    localStorage.removeItem('HVAA_Round_All');
    localStorage.removeItem('HVAA_Monster_Hp');
    document.getElementById('ckey_continue').click();
  } else if (Round_Now === Round_All && document.querySelector('.btcp')) {
    localStorage.removeItem('HVAA_Round_Now');
    localStorage.removeItem('HVAA_Round_All');
    localStorage.removeItem('HVAA_Monster_Hp');
    localStorage.removeItem('HVAA_RoundType');
    localStorage.removeItem('HVAA_Attack_Status');
    localStorage.removeItem('HVAA_disabled');
    OtherAlert('Win');
    setTimeout(function () {
      window.location = 'http://hentaiverse.org/?s=Character&ss=ch';
    }, 3000);
  } else if (Round_Now === Round_All) {
    document.getElementById('infopane').style.backgroundColor = 'gray';
  }
} //////////////////////////////////////////////////

function AutoUseGem() { //自动使用宝石
  if (document.getElementById('ikey_p')) {
    var Gem = document.getElementById('ikey_p').getAttribute('onmouseover').replace(/battle.set_infopane_item\(\'(.*?)\'.*/, '$1');
    if (Gem === 'Health Gem' && HP <= HVAA_Setting.HP1 * 0.01) {
      document.getElementById('ikey_p').click();
    } else if (Gem === 'Mana Gem' && MP <= HVAA_Setting.MP1 * 0.01) {
      document.getElementById('ikey_p').click();
    } else if (Gem === 'Spirit Gem' && SP <= HVAA_Setting.SP1 * 0.01) {
      document.getElementById('ikey_p').click();
    } else if (Gem === 'Mystic Gem') {
      document.getElementById('ikey_p').click();
    }
  }
} //////////////////////////////////////////////////

function DeadSoon() { //自动回血回魔
  if (MP < HVAA_Setting.MP2 * 0.01) { //自动回魔
    document.getElementById('quickbar').style.backgroundColor = 'blue';
    if (document.querySelector('#ikey_5')) {
      document.querySelector('.bti3>div[onmouseover*="Mana Potion"]').click();
    }
  }
  if (SP < HVAA_Setting.SP2 * 0.01) { //自动回精
    document.getElementById('quickbar').style.backgroundColor = 'green';
    if (document.querySelector('#ikey_8')) {
      document.querySelector('.bti3>div[onmouseover*="Spirit Potion"]').click();
    }
  }
  if (HP <= HVAA_Setting.HP1 * 0.01) { //自动回血
    if (!document.querySelector('.cwb2[src*="/s/barsilver.png"]')) {
      document.getElementById('quickbar').style.backgroundColor = 'red';
    }
    document.getElementById('311').click();
    if (document.getElementById('311').style.opacity === '0.5') {
      document.getElementById('313').click();
    }
    if (document.getElementById('311').style.opacity === '0.5' && document.getElementById('313').style.opacity === '0.5') {
      if (document.querySelector('.bti3>div[onmouseover*="Health Potion"]')) {
        document.querySelector('.bti3>div[onmouseover*="Health Potion"]').click(); //这里出错
      }
    }
    if (document.getElementById('311').style.opacity === '0.5' && document.getElementById('313').style.opacity === '0.5' && !document.querySelector('.bti3>div[onmouseover*="Health Potion"]')) {
      if (oc > 0) {
        document.getElementById('ckey_defend').click();
      }
    }
  }
} //////////////////////////////////////////////////

function AutoUsePotAndBuffSkill() { //自动使用药水、Buff技能
  if ((Round_All >= 12) || (Round_All === Round_Now && Round_All === 1)) {
    if (document.querySelector('div.bte>img[src*="/e/channeling.png"]')) {
      var buff = document.querySelector('div.bte').querySelectorAll('img');
      if (buff.length > 1) {
        for (var n = 0; n < buff.length; n++) {
          var spell_name = buff[n].getAttribute('onmouseover').replace(/battle.set_infopane_effect\(\'(.*?)\'.*/, '$1');
          if (spell_name === 'Absorbing Ward') continue;
          var buff_lasttime = Number(buff[n].getAttribute('onmouseover').replace(/.*\'\,(.*?)\)/g, '$1'));
          if (buff_lasttime <= 15) {
            if (spell_name === 'Cloak of the Fallen' && !document.querySelector('div.bte>img[src*="/e/sparklife.png"]')) {
              document.getElementById('422').click();
            } else if (spell_name === 'Spark of Life') {
              document.getElementById('422').click();
            } else if (spell_name === 'Spirit Shield') {
              document.getElementById('423').click();
            } else if (spell_name === 'Hastened') {
              document.getElementById('412').click();
            } else if (spell_name === 'Protection') {
              document.getElementById('411').click();
            } else if (spell_name === 'Arcane Focus') {
              document.getElementById('432').click();
            } else if (spell_name === 'Regen') {
              document.getElementById('312').click();
            }
          }
        }
      }
      if (!document.querySelector('div.bte>img[src*="/e/arcanemeditation.png"]')) {
        document.getElementById('432').click();
      } else if (!document.querySelector('div.bte>img[src*="/e/regen.png"]')) {
        document.getElementById('312').click();
      } else if (!document.querySelector('div.bte>img[src*="/e/shadowveil.png"]')) {
        document.getElementById('413').click();
      } else if (!document.querySelector('div.bte>img[src*="/e/absorb.png"]')) {
        document.getElementById('421').click();
      }
    }
    if (!document.querySelector('div.bte>img[src*="/e/healthpot.png"]') && HP < 1) {
      document.querySelector('.bti3>div[onmouseover*="Health Draught"]').click();
    } else if (!document.querySelector('div.bte>img[src*="/e/manapot.png"]') && MP < 1) {
      document.querySelector('.bti3>div[onmouseover*="Mana Draught"]').click();
    } else if (!document.querySelector('div.bte>img[src*="/e/spiritpot.png"]') && SP < 0.8) {
      document.querySelector('.bti3>div[onmouseover*="Spirit Draught"]').click();
    } else if (!document.querySelector('div.bte>img[src*="/e/protection.png"]')) {
      document.getElementById('411').click();
    } else if (!document.querySelector('div.bte>img[src*="/e/haste.png"]')) {
      document.getElementById('412').click();
    } else if (!document.querySelector('div.bte>img[src*="/e/sparklife.png"]')) {
      document.getElementById('422').click();
    } else if (!document.querySelector('div.bte>img[src*="/e/spiritshield.png"]')) {
      document.getElementById('423').click();
    }
  } else if (Round_All === Round_Now && Round_All === 2) {
    if (!document.querySelector('div.bte>img[src*="/e/sparklife.png"]')) {
      document.getElementById('422').click();
    }
  }
} //////////////////////////////////////////////////

function AutoAttack() { //自动打怪
  if (HP < HVAA_Setting.HP2 * 0.01) {
    if (!HVAA_Setting.CrazyMode) {
      if (!confirm('HP小于' + HVAA_Setting.HP2 + '%，是否继续自动打怪？\r\n可能会死亡')) {
        //OtherAlert();
        return;
      }
    }
  }
  var MonsterHPNow = localStorage.HVAA_Monster_Hp.split(',');
  var HPBar = document.querySelectorAll('div.btm4>div.btm5:nth-child(1)');
  for (var i = 0; i < HPBar.length; i++) {
    if (HPBar[i].querySelector('img[src="/y/s/nbardead.png"]')) {
      MonsterHPNow[i] = Math.pow(10, 10);
    } else {
      MonsterHPNow[i] = MonsterHPNow[i] * parseFloat(HPBar[i].querySelector('div.chbd>img.chb2').style.width) / 120;
    }
  }
  var HPMin = Math.min.apply(null, MonsterHPNow);
  var minnum;
  for (i = 0; i < MonsterHPNow.length; i++) {
    if (HPMin === MonsterHPNow[i]) {
      minnum = i + 1;
      break;
    }
  }
  var Attack_Status_title;
  if (Attack_Status === 0) {
    Attack_Status_title = '物理';
  } else if (Attack_Status === 1) {
    Attack_Status_title = '火';
  } else if (Attack_Status === 2) {
    Attack_Status_title = '冰';
  } else if (Attack_Status === 3) {
    Attack_Status_title = '雷';
  } else if (Attack_Status === 4) {
    Attack_Status_title = '风';
  } else if (Attack_Status === 5) {
    Attack_Status_title = '圣';
  } else if (Attack_Status === 6) {
    Attack_Status_title = '暗';
  }
  if (!localStorage.HVAA_disabled) {
    document.title = Round_Now + '/' + Round_All + Attack_Status_title + ' ' + Monster_Boss_Alive + ' ' + Monster_Alive + '/' + Monster_All;
  } else {
    document.title = Attack_Status_title + ' [OFF]';
  }
  if (Monster_Alive <= Monster_Boss_Alive && Monster_Alive > 0) {
    var Monster = document.querySelector('#mkey_' + minnum + '>.btm3>.fd2>div');
    var MonsterName = Monster.innerHTML;
    var Boss_Weakness = { //Boss的弱点库
      'Dalek': '弱点-雷',
      'Manbearpig': '弱点-火',
      'White Bunneh': '弱点-冰',
      'Mithra': '弱点-圣',
      'Konata': '弱点-风',
      'Mikuru Asahina': '弱点-圣|暗',
      'Yuki Nagato': '弱点-圣|暗',
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
      Monster.innerHTML = Boss_Weakness[MonsterName];
      MonsterName = Monster.innerHTML;
      if (MonsterName.indexOf('物理') >= 0) {
        Attack_Status = 0;
      } else if (MonsterName.indexOf('火') >= 0) {
        Attack_Status = 1;
      } else if (MonsterName.indexOf('冰') >= 0) {
        Attack_Status = 2;
      } else if (MonsterName.indexOf('雷') >= 0) {
        Attack_Status = 3;
      } else if (MonsterName.indexOf('风') >= 0) {
        Attack_Status = 4;
      } else if (MonsterName.indexOf('圣') >= 0) {
        Attack_Status = 5;
      } else if (MonsterName.indexOf('暗') >= 0) {
        Attack_Status = 6;
      }
    } else {
      OtherAlert('Error');
      alert('待定');
      return;
    }
  }
  if (Attack_Status === 1) {
    document.getElementById('111').click();
  } else if (Attack_Status === 2) {
    document.getElementById('121').click();
  } else if (Attack_Status === 3) {
    document.getElementById('131').click();
  } else if (Attack_Status === 4) {
    document.getElementById('141').click();
  } else if (Attack_Status === 5) {
    document.getElementById('151').click();
  } else if (Attack_Status === 6) {
    document.getElementById('161').click();
  }
  if (Attack_Status === 1 && Monster_All >= 8 && Monster_Dead <= 1) {
    document.getElementById('112').click();
    document.getElementById('113').click();
  }
  if (document.getElementById('2501').style.opacity === '0.5' && oc >= 0.2) {
    document.getElementById('2501').click();
  }
  if (minnum === 10) {
    minnum = 0;
  }
  if (Round_Now % HVAA_Setting.Attack_Delay2_Round === 0 && Monster_Alive === Monster_All && Monster_Alive > Monster_Boss_Alive && Round_Now > HVAA_Setting.Attack_Delay2_Round) {
    i = 0;
    var time = HVAA_Setting.Attack_Delay2_Time;
    var title = document.title;
    for (var j = 0; j < time; j++) {
      setTimeout(function () {
        document.title = '[' + eval(time - i) + '秒后继续运行]' + title;
        i++;
      }, 1000 * j);
    }
    setTimeout(function () {
      document.getElementById('mkey_' + minnum).click();
    }, 1000 * time);
  } else {
    setTimeout(function () {
      document.getElementById('mkey_' + minnum).click();
    }, HVAA_Setting.Attack_Delay_Time * 1000);
  }
}
