// ==UserScript==
// @name        HV_AutoAttack
// @name:zh-CN  【HV】HV自动打怪
// @namespace   https://github.com/dodying/Dodying-UserJs
// @author      Dodying
// @description 自用的HV自动脚本，press [`~] pause，[double click] choose mode
// @description:zh-CN 自用的HV自动脚本，按[`~]暂停，[双击]选择模式
// @include     http://hentaiverse.org/*
// @version     2.11
// @grant       none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @run-at      document-end
// ==/UserScript==
if (document.querySelector('form[name="ipb_login_form"]')) return;
RiddleAlert(); //答题警报
if (document.querySelector('img[src="http://ehgt.org/g/derpy.gif"]')) {
  window.location = window.location.href;
}
OptionButton();
if (localStorage['HV_AutoAttack_Setting']) {
  var HV_AutoAttack_Setting = JSON.parse(localStorage['HV_AutoAttack_Setting']);
  //console.log(HV_AutoAttack_Setting);
} else {
  alert('请设置HV-AutoAttack');
  document.querySelector('#HV_AutoAttack_Option').style.display = 'block';
}
if (!document.querySelector('#togpane_log')) {
  localStorage.removeItem('HVAutoAttack_Round_Now');
  localStorage.removeItem('HVAutoAttack_Round_All');
  localStorage.removeItem('HVAutoAttack_Monster_Hp');
  localStorage.removeItem('HVAutoAttack_RoundType');
  localStorage.removeItem('HVAutoAttack_status');
  localStorage.removeItem('HVAutoAttack_disabled');
  //setTimeout(function () {
  //window.location = window.location;
  //}, 5 * 60 * 1000);
  return;
}
HotKey(); //设置全局快捷键
if (localStorage['HVAutoAttack_disabled'] == '1') { //如果禁用
  return;
} else { //如果没有禁用
  if (!localStorage['HVAutoAttack_status']) {
    if (HV_AutoAttack_Setting) {
      var status = HV_AutoAttack_Setting['Attack_Status'];
    } else {
      var status = '1'; //0.物理 1.火 2.冰 3.雷 4.风 5.圣 6.暗
    }
  } else {
    var status = localStorage['HVAutoAttack_status'];
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
  var HP = document.getElementsByClassName('cwb2') [0].offsetWidth / 120;
  var MP = document.getElementsByClassName('cwb2') [1].offsetWidth / 120;
  var SP = document.getElementsByClassName('cwb2') [2].offsetWidth / 120;
  var oc = document.getElementsByClassName('cwb2') [3].offsetWidth / 120;
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
    if (document.querySelector('#HV_AutoAttack_Option').style.display == 'none') {
      document.querySelector('#HV_AutoAttack_Option').style.display = 'block';
    } else {
      document.querySelector('#HV_AutoAttack_Option').style.display = 'none';
    }
  }
  document.body.appendChild(HV_AutoAttack_Button);
  var HV_AutoAttack_Option = document.createElement('div');
  HV_AutoAttack_Option.id = 'HV_AutoAttack_Option';
  HV_AutoAttack_Option.style = 'font-size:large;z-index:999;width:600px;display:none;background-color:white;position:absolute;left:' + eval(document.documentElement.clientWidth / 2 - 300) + 'px;top:200px;border-color:black;border-style:solid;';
  HV_AutoAttack_Option.innerHTML = '<h1>HV AutoAttack设置</h1><input type="checkbox" id="CrazyMode"><label for="CrazyMode">即使<span style="color:red;font-weight:bold;">血量过低</span>，仍然继续打怪。</label><div>打怪模式：<input type="radio" id="Attack_Status_0" name="Attack_Status" value="0" /><label for="Attack_Status_0">物理</label><input type="radio" id="Attack_Status_1" name="Attack_Status" value="1" checked /><label for="Attack_Status_1">火</label><input type="radio" id="Attack_Status_2" name="Attack_Status" value="2" /><label for="Attack_Status_2">冰</label><input type="radio" id="Attack_Status_3" name="Attack_Status" value="3" /><label for="Attack_Status_3">雷</label><input type="radio" id="Attack_Status_4" name="Attack_Status" value="4" /><label for="Attack_Status_4">风</label><input type="radio" id="Attack_Status_5" name="Attack_Status" value="5" /><label for="Attack_Status_5">圣</label><input type="radio" id="Attack_Status_6" name="Attack_Status" value="6" /><label for="Attack_Status_6">暗</label></div><h2>警报</h2><div>  【默认】：<input class="Alert" name="Alert_default" size="70" value="http://zjyd.sc.chinaz.com/files/downLoad/sound1/201601/6796.mp3" /><a href="javascript:#" onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a><br />  【答题】：<input class="Alert" name="Alert_Riddle" size="70" value="http://zjdx1.sc.chinaz.com/files/downLoad/sound/huang/cd9/mp3/111.mp3" /><a href="javascript:#" onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a><br />  【胜利】：<input class="Alert" name="Alert_Win" size="70" value="http://zjyd.sc.chinaz.com/files/downLoad/sound1/201602/6907.mp3" /><a href="javascript:#" onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a><br />  【错误】：<input class="Alert" name="Alert_Error" size="70" value="http://zjyd.sc.chinaz.com/files/downLoad/sound1/201602/6886.mp3" /><a href="javascript:#" onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a><br />  【失败】：<input class="Alert" name="Alert_Failed" size="70" value="http://zjyd.sc.chinaz.com/files/download/sound1/201207/1756.mp3" /><a href="javascript:#" onclick="var audio = new Audio(this.previousElementSibling.value);audio.play();">试听</a></div><button id="HV_AutoAttack_Setting_Apply">确认</button><button onclick="document.querySelector(\'#HV_AutoAttack_Option\').style.display=\'none\';">取消</button>';
  HV_AutoAttack_Option.querySelector('#HV_AutoAttack_Setting_Apply').onclick = function () {
    var Option = this.parentNode;
    var HV_AutoAttack_Setting = new Object();
    (Option.querySelector('#CrazyMode').checked) ? HV_AutoAttack_Setting['CrazyMode'] = true : HV_AutoAttack_Setting['CrazyMode'] = false;
    HV_AutoAttack_Setting['Attack_Status'] = parseInt(document.querySelector('input[name="Attack_Status"]:checked').value);
    var Input_Alert = Option.querySelectorAll('.Alert');
    for (var i = 0; i < Input_Alert.length; i++) {
      HV_AutoAttack_Setting[Input_Alert[i].name] = Input_Alert[i].value;
    }
    localStorage['HV_AutoAttack_Setting'] = JSON.stringify(HV_AutoAttack_Setting);
    document.querySelector('#HV_AutoAttack_Option').style.display = 'none';
  }
  document.body.appendChild(HV_AutoAttack_Option);
} //////////////////////////////////////////////////

function HotKey() { //设置全局快捷键
  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 192) //`~ 这里设置开关快捷键 对照表http://www.cnblogs.com/furenjian/articles/2957770.html
    {
      if (!localStorage['HVAutoAttack_disabled'])
      {
        localStorage['HVAutoAttack_disabled'] = '1';
      } else {
        localStorage.removeItem('HVAutoAttack_disabled');
      }
      e.returnValue = false;
      window.location.replace(window.location.href); //刷新页面
    } /*else if (e.keyCode == 9) //Tab 状态设置
  {
    var p = prompt('请选择（默认为火）：\n0.物理\n1.火\n2.冰\n3.雷\n4.风\n5.圣\n6.暗', '');
    if (p == '' || p == null) {
      var p = 1;
    }
    localStorage['HVAutoAttack_status'] = p;
    e.returnValue = false;
    window.location.replace(window.location.href);
  }*/

    return;
  }, true);
  window.addEventListener('dblclick', function () {
    var p = prompt('请选择（默认为火）：\n0.物理\n1.火\n2.冰\n3.雷\n4.风\n5.圣\n6.暗', '');
    if (p == '' || p == null) {
      var p = 1;
    }
    localStorage['HVAutoAttack_status'] = p;
    e.returnValue = false;
    window.location.replace(window.location.href);
  }, true);
} //////////////////////////////////////////////////
//////////////////////////////////////////////////
//另一种播放方式var audio = new Audio("http://dx.sc.chinaz.com/Files/DownLoad/sound1/201601/6842.mp3");

function RiddleAlert() { //答题警报
  if (document.getElementById('riddlemaster')) {
    document.title = '！！！紧急';
    var audio = document.createElement('audio');
    if (HV_AutoAttack_Setting) {
      audio.src = HV_AutoAttack_Setting['Alert_Riddle'];
    } else {
      audio.src = 'http://zjdx1.sc.chinaz.com/files/downLoad/sound/huang/cd9/mp3/111.mp3';
    }
    audio.play();
    var random = Math.random();
    if (random < 1 / 3) {
      document.getElementById('riddlemaster').value = 'A';
    } else if (random < 2 / 3) {
      document.getElementById('riddlemaster').value = 'B';
    } else {
      document.getElementById('riddlemaster').value = 'C';
    }
  }
} //////////////////////////////////////////////////

function OtherAlert(event) { //其他警报
  var audio = document.createElement('audio');
  if (HV_AutoAttack_Setting) {
    switch (event) {
      default:
        audio.src = HV_AutoAttack_Setting['Alert_default'];
        break;
      case 'Win':
        audio.src = HV_AutoAttack_Setting['Alert_Win'];
        break;
      case 'Error':
        audio.src = HV_AutoAttack_Setting['Alert_Error'];
        break;
      case 'Failed':
        audio.src = HV_AutoAttack_Setting['Alert_Failed'];
        break;
    }
  } else {
    switch (event) {
      default:
        audio.src = 'http://zjyd.sc.chinaz.com/files/downLoad/sound1/201601/6796.mp3';
        break;
      case 'Win':
        audio.src = 'http://zjyd.sc.chinaz.com/files/downLoad/sound1/201602/6907.mp3';
        break;
      case 'Error':
        audio.src = 'http://zjyd.sc.chinaz.com/files/downLoad/sound1/201602/6886.mp3';
        break;
      case 'Failed':
        audio.src = 'http://zjyd.sc.chinaz.com/files/download/sound1/201207/1756.mp3';
        break;
    }
  }
  audio.play();
} //////////////////////////////////////////////////

function CountRound() { //回合计数及自动前进并获取怪物Hp
  if (!localStorage['HVAutoAttack_RoundType']) {
    var RoundType = window.location.toString().replace('http://hentaiverse.org/?', '').replace('s=Battle', '').replace('ss=', '').replace('page=2', '').replace(/filter=(.*)/, '').replace(/encounter=(.*)/, '').replace(/&/g, '');
    localStorage['HVAutoAttack_RoundType'] = RoundType;
  } else {
    var RoundType = localStorage['HVAutoAttack_RoundType'];
  }
  if (!localStorage['HVAutoAttack_Round_Now']) {
    var BattleLog = document.querySelectorAll('#togpane_log>table>tbody>tr>td.t3');
    var Monster_Hp = new Array();
    for (var i = BattleLog.length - 3; i > BattleLog.length - 3 - Monster_All; i--) {
      var hp = parseInt(BattleLog[i].innerHTML.replace(/.*HP=/, ''));
      if (!isNaN(hp)) {
        Monster_Hp.push(hp);
      } else {
        return;
      }
    }
    localStorage['HVAutoAttack_Monster_Hp'] = Monster_Hp.join(',');
    if (RoundType == 'ba') {
      if (Monster_All > 6 || Monster_Boss_Alive > 0) {
        Round_Now = '1';
        localStorage['HVAutoAttack_Round_Now'] = Round_Now;
        Round_All = '1';
        localStorage['HVAutoAttack_Round_All'] = Round_All;
        //document.getElementById('1001').click();
      } else {
        Round_Now = '2';
        localStorage['HVAutoAttack_Round_Now'] = Round_Now;
        Round_All = '2';
        localStorage['HVAutoAttack_Round_All'] = Round_All;
      }
    } else {
      var Round = BattleLog[BattleLog.length - 2].innerHTML.replace(/.*\(Round /, '').replace(/\).*/, '').replace(/\s+/g, '');
      Round_Now = Round.replace(/\/.*/, '');
      localStorage['HVAutoAttack_Round_Now'] = Round_Now;
      Round_All = Round.replace(/.*\//, '');
      localStorage['HVAutoAttack_Round_All'] = Round_All;
    }
  } else {
    Round_Now = localStorage['HVAutoAttack_Round_Now'];
    Round_All = localStorage['HVAutoAttack_Round_All'];
  }
  if (Monster_Alive > 0 && document.querySelector('.btcp')) {
    OtherAlert('Failed');
  } else if (Round_Now != Round_All && document.querySelector('.btcp')) {
    localStorage.removeItem('HVAutoAttack_Round_Now');
    localStorage.removeItem('HVAutoAttack_Round_All');
    localStorage.removeItem('HVAutoAttack_Monster_Hp');
    document.getElementById('ckey_continue').click();
  } else if (Round_Now == Round_All && document.querySelector('.btcp')) {
    localStorage.removeItem('HVAutoAttack_Round_Now');
    localStorage.removeItem('HVAutoAttack_Round_All');
    localStorage.removeItem('HVAutoAttack_Monster_Hp');
    localStorage.removeItem('HVAutoAttack_RoundType');
    localStorage.removeItem('HVAutoAttack_status');
    localStorage.removeItem('HVAutoAttack_disabled');
    OtherAlert('Win');
    setTimeout(function () {
      window.location = 'http://hentaiverse.org/?s=Character&ss=ch';
    }, 3000);
  } else if (Round_Now == Round_All) {
    //alert('最后一回合');
    document.getElementById('infopane').style.backgroundColor = 'gray';
  }
} //////////////////////////////////////////////////

function AutoUseGem() { //自动使用宝石
  if (document.getElementById('ikey_p')) {
    var Gem = document.getElementById('ikey_p').getAttribute('onmouseover').replace(/battle.set_infopane_item\(\'(.*?)\'.*/, '$1');
    if (Gem == 'Health Gem' && HP <= 0.5) {
      document.getElementById('ikey_p').click();
    } else if (Gem == 'Mana Gem' && MP <= 0.7) {
      document.getElementById('ikey_p').click();
    } else if (Gem == 'Spirit Gem' && SP <= 0.75) {
      document.getElementById('ikey_p').click();
    } else if (Gem == 'Mystic Gem') {
      document.getElementById('ikey_p').click();
    }
  }
} //////////////////////////////////////////////////

function DeadSoon() { //自动回血回魔
  if (MP < 0.1) { //自动回魔
    document.getElementById('quickbar').style.backgroundColor = 'blue';
    if (document.querySelector('#ikey_5')) {
      document.querySelector('.bti3>div[onmouseover*="Mana Potion"]').click();
    }
  }
  if (SP < 0.5) { //自动回精
    document.getElementById('quickbar').style.backgroundColor = 'green';
    if (document.querySelector('#ikey_8')) {
      document.querySelector('.bti3>div[onmouseover*="Spirit Potion"]').click();
    }
  }
  if (HP <= 0.5) { //自动回血
    if (!document.querySelector('.cwb2[src*="/s/barsilver.png"]')) {
      document.getElementById('quickbar').style.backgroundColor = 'red';
    }
    document.getElementById('311').click();
    if (document.getElementById('311').getAttribute('style') == 'opacity:0.5') {
      document.getElementById('313').click();
    }
    if (document.getElementById('311').getAttribute('style') == 'opacity:0.5' && document.getElementById('313').getAttribute('style') == 'opacity:0.5') {
      if (document.querySelector('.bti3>div[onmouseover*="Health Potion"]')) {
        document.querySelector('.bti3>div[onmouseover*="Health Potion"]').click(); //这里出错
      }
    }
    if (document.getElementById('311').getAttribute('style') == 'opacity:0.5' && document.getElementById('313').getAttribute('style') == 'opacity:0.5' && !document.querySelector('.bti3>div[onmouseover*="Health Potion"]')) {
      if (oc > 0) {
        document.getElementById('ckey_defend').click();
      }
    }
  }
} //////////////////////////////////////////////////

function AutoUsePotAndBuffSkill() { //自动使用药水、Buff技能
  if ((Round_All >= 12) || (Round_All == Round_Now && Round_All == 1)) {
    if (document.querySelector('div.bte>img[src*="/e/channeling.png"]')) {
      var buff = document.querySelector('div.bte').querySelectorAll('img');
      if (buff.length > 1) {
        for (var n = 0; n < buff.length; n++) {
          var spell_name = buff[n].getAttribute('onmouseover').replace(/battle.set_infopane_effect\(\'(.*?)\'.*/, '$1');
          if (spell_name == 'Absorbing Ward') continue;
          var buff_lasttime = buff[n].getAttribute('onmouseover').replace(/.*\'\,(.*?)\)/g, '$1');
          if (buff_lasttime <= 15) {
            if (spell_name == 'Cloak of the Fallen' && !document.querySelector('div.bte>img[src*="/e/sparklife.png"]')) {
              document.getElementById('422').click();
            } else if (spell_name == 'Spark of Life') {
              document.getElementById('422').click();
            } else if (spell_name == 'Spirit Shield') {
              document.getElementById('423').click();
            } else if (spell_name == 'Hastened') {
              document.getElementById('412').click();
            } else if (spell_name == 'Protection') {
              document.getElementById('411').click();
            } else if (spell_name == 'Arcane Focus') {
              document.getElementById('432').click();
            } else if (spell_name == 'Regen') {
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
  } else if (Round_All == Round_Now && Round_All == 2) {
    if (!document.querySelector('div.bte>img[src*="/e/sparklife.png"]')) {
      document.getElementById('422').click();
    }
  }
} //////////////////////////////////////////////////

function AutoAttack() { //自动打怪
  if (HP < 0.44) {
    if (HV_AutoAttack_Setting) {
      if (!HV_AutoAttack_Setting['CrazyMode']) {
        if (!confirm('HP小于44%，是否继续自动打怪？\r\n可能会死亡')) {
          //OtherAlert();
          return;
        }
      }
    } else {
      if (!confirm('HP小于44%，是否继续自动打怪？\r\n可能会死亡')) {
        //OtherAlert();
        return;
      }
    }
  }
  var MonsterHPNow = localStorage['HVAutoAttack_Monster_Hp'].split(',');
  var HPBar = document.querySelectorAll('div.btm4>div.btm5:nth-child(1)');
  for (var i = 0; i < HPBar.length; i++) {
    if (HPBar[i].querySelector('img[src="/y/s/nbardead.png"]')) {
      MonsterHPNow[i] = Math.pow(10, 10);
    } else {
      MonsterHPNow[i] = MonsterHPNow[i] * parseInt(HPBar[i].querySelector('div.chbd>img.chb2').style.width) / 120;
    }
  }
  var HPMin = Math.min.apply(null, MonsterHPNow);
  for (var i = 0; i < MonsterHPNow.length; i++) {
    if (HPMin == MonsterHPNow[i]) {
      var minnum = i + 1;
      var minnum2 = i;
      break;
    }
  }
  if (status == '0') {
    var status_title = '物理';
  } else if (status == '1') {
    var status_title = '火';
  } else if (status == '2') {
    var status_title = '冰';
  } else if (status == '3') {
    var status_title = '雷';
  } else if (status == '4') {
    var status_title = '风';
  } else if (status == '5') {
    var status_title = '圣';
  } else if (status == '6') {
    var status_title = '暗';
  }
  if (!localStorage['HVAutoAttack_disabled']) {
    document.title = Round_Now + '/' + Round_All + status_title + + ' ' + Monster_Boss_Alive + ' ' + Monster_Alive + '/' + Monster_All;
  } else {
    document.title = status_title + ' [OFF]';
  }
  if (Monster_Alive <= Monster_Boss_Alive && Monster_Alive > 0) {
    var AllMonsterName = document.getElementsByClassName('btm3');
    var MonsterName = AllMonsterName[minnum2].innerHTML.replace(/.*px">/, '').replace(/.*clear: none;">/, '').replace(/<\/div>.*/, '');
    if (MonsterName.indexOf('弱点') >= 0) {
      if (MonsterName.indexOf('物理') >= 0) {
        status = '0';
      } else if (MonsterName.indexOf('火') >= 0) {
        status = '1';
      } else if (MonsterName.indexOf('冰') >= 0) {
        status = '2';
      } else if (MonsterName.indexOf('雷') >= 0) {
        status = '3';
      } else if (MonsterName.indexOf('风') >= 0) {
        status = '4';
      } else if (MonsterName.indexOf('圣') >= 0) {
        status = '5';
      } else if (MonsterName.indexOf('暗') >= 0) {
        status = '6';
      }
    } else {
      OtherAlert('Error');
      alert('待定');
      return;
    }
  }
  if (status == '0') {
  } else if (status == '1') {
    document.getElementById('111').click();
  } else if (status == '2') {
    document.getElementById('121').click();
  } else if (status == '3') {
    document.getElementById('131').click();
  } else if (status == '4') {
    document.getElementById('141').click();
  } else if (status == '5') {
    document.getElementById('151').click();
  } else if (status == '6') {
    document.getElementById('161').click();
  }
  if (status == '1' && Monster_All >= 8 && Monster_Dead <= 1) {
    document.getElementById('112').click();
    document.getElementById('113').click();
  }
  if (document.getElementById('2501').getAttribute('style') == 'opacity:0.5' && oc >= 0.2) {
    document.getElementById('2501').click();
  }
  if (minnum == '10') {
    var minnum = '0';
  }
  if (Round_Now % 10 == 0 && Monster_Alive == Monster_All && Monster_Alive - Monster_Boss_Alive > 0 && Round_Now > 10) {
    var title = document.title;
    document.title = '[10秒后继续运行]' + title;
    setTimeout(function () {
      //document.querySelector('link[rel="icon"]').setAttribute('href', 'https://cdn4.iconfinder.com/data/icons/number-icon/512/number36-16.png');
      document.title = '[9秒后继续运行]' + title;
    }, 1000);
    setTimeout(function () {
      //document.querySelector('link[rel="icon"]').setAttribute('href', 'https://cdn4.iconfinder.com/data/icons/number-icon/512/number32-16.png');
      document.title = '[8秒后继续运行]' + title;
    }, 2000);
    setTimeout(function () {
      //document.querySelector('link[rel="icon"]').setAttribute('href', 'https://cdn4.iconfinder.com/data/icons/number-icon/512/number34-16.png');
      document.title = '[7秒后继续运行]' + title;
    }, 3000);
    setTimeout(function () {
      //document.querySelector('link[rel="icon"]').setAttribute('href', 'https://cdn4.iconfinder.com/data/icons/number-icon/512/number35-16.png');
      document.title = '[6秒后继续运行]' + title;
    }, 4000);
    setTimeout(function () {
      //document.querySelector('link[rel="icon"]').setAttribute('href', 'https://cdn4.iconfinder.com/data/icons/number-icon/512/number39-16.png');
      document.title = '[5秒后继续运行]' + title;
    }, 5000);
    setTimeout(function () {
      //document.querySelector('link[rel="icon"]').setAttribute('href', 'https://cdn4.iconfinder.com/data/icons/number-icon/512/number38-16.png');
      document.title = '[4秒后继续运行]' + title;
    }, 6000);
    setTimeout(function () {
      //document.querySelector('link[rel="icon"]').setAttribute('href', 'https://cdn4.iconfinder.com/data/icons/number-icon/512/number37-16.png');
      document.title = '[3秒后继续运行]' + title;
    }, 7000);
    setTimeout(function () {
      //document.querySelector('link[rel="icon"]').setAttribute('href', 'https://cdn4.iconfinder.com/data/icons/number-icon/512/number40-16.png');
      document.title = '[2秒后继续运行]' + title;
    }, 8000);
    setTimeout(function () {
      //document.querySelector('link[rel="icon"]').setAttribute('href', 'https://cdn4.iconfinder.com/data/icons/number-icon/512/number41-16.png');
      document.title = '[1秒后继续运行]' + title;
    }, 9000);
    setTimeout(function () {
      document.getElementById('mkey_' + minnum).click();
    }, 10000);
  } else {
    setTimeout(function () {
      document.getElementById('mkey_' + minnum).click();
    }, 1000);
  }
}
