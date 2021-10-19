// ==UserScript==
// @name        EH_BatchList
// @name:zh-CN  【EH】批列表
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description:zh-CN
// @include     http*://exhentai.org/favorites.php*
// @include     http*://g.e-hentai.org/favorites.php*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @run-at      document-idle
// ==/UserScript==
const button_add = document.createElement('button');
button_add.innerHTML = '添加';
button_add.className = 'stdbtn';
button_add.onclick = function (e) {
  e.preventDefault();
  if (document.querySelector('#EH_BatchList')) {
    if (document.querySelector('#EH_BatchList').style.display === 'none') {
      document.querySelector('#EH_BatchList').style.display = '';
      this.innerHTML = '隐藏';
    } else {
      document.querySelector('#EH_BatchList').style.display = 'none';
      this.innerHTML = '显示';
    }
  } else {
    const textarea = document.createElement('div');
    textarea.id = 'EH_BatchList';
    textarea.innerHTML = '<textarea id="EH_BatchList_Text" style="width:400px;height:500px;"></textarea><br><button id="EH_BatchList_Save" class="stdbtn">保存</button><button id="EH_BatchList_Clear" class="stdbtn">清空</button><button id="EH_BatchList_Load" class="stdbtn" class="stdbtn" style="display:none;">读取</button><button id="EH_BatchList_Start" class="stdbtn" style="display:none;">开始</button>';
    textarea.style = 'border-color:black;border-style:solid;top:0px;text-align:center;position:absolute;background-color:white';
    const List = GM_getValue('List', 0);
    if (List !== 0) {
      textarea.querySelector('#EH_BatchList_Load').style.display = '';
      textarea.querySelector('#EH_BatchList_Start').style.display = '';
    }
    textarea.querySelector('#EH_BatchList_Save').onclick = function () {
      let type = parseInt(prompt('请输入本子类别', 'all'));
      if (isNaN(type)) {
        type = 'all';
      } else {
        type = String(type);
      }
      const text = textarea.querySelector('#EH_BatchList_Text').value.replace(/:|\||\-/g, ' ').replace(/[\r\n]/g, '|||').split('|||');
      for (let i = 0; i < text.length; i++) {
        text[i] = `?f_apply=1&favcat=${type}&f_search=${encodeURIComponent(`"${text[i]}"`)}`;
        GM_setValue(text[i], i);
      }
      GM_setValue('List', text);
      textarea.querySelector('#EH_BatchList_Load').style.display = '';
      textarea.querySelector('#EH_BatchList_Start').style.display = '';
    };
    textarea.querySelector('#EH_BatchList_Clear').onclick = function () {
      if (confirm('将清空数据库所有数据，是否继续')) {
        const Values = GM_listValues();
        for (let i = 0; i < Values.length; i++) {
          GM_deleteValue(Values[i]);
        }
      }
    };
    textarea.querySelector('#EH_BatchList_Load').onclick = function () {
      const List = GM_getValue('List');
      for (let i = 0; i < List.length; i++) {
        List[i] = decodeURIComponent(List[i].replace(/^\?f_apply=1&favcat=.*?&f_search=%22|%22$/g, ''));
      }
      textarea.querySelector('#EH_BatchList_Text').value = List.join('\r\n');
    };
    textarea.querySelector('#EH_BatchList_Start').onclick = function () {
      window.location.search = GM_getValue('List')[0];
    };
    document.body.appendChild(textarea);
    this.innerHTML = '隐藏';
  }
};
document.querySelector('.nosel+div>form>div:nth-child(3)').appendChild(button_add);
const button_next = document.createElement('button');
button_next.innerHTML = '下一个';
button_next.className = 'stdbtn';
button_next.onclick = function (e) {
  e.preventDefault();
  const word = window.location.search;
  if (inValue(word)) {
    const List = GM_getValue('List');
    const num = GM_getValue(word) + 1;
    GM_deleteValue(word);
    if (num === List.length) {
      alert('这是最后一个！');
      return;
    }
    const next = List[num];
    window.location.search = next;
  }
};
document.querySelector('.nosel+div>form>div:nth-child(3)').appendChild(button_next);
const button_break = document.createElement('button');
button_break.innerHTML = '断点';
button_break.className = 'stdbtn';
button_break.onclick = function (e) {
  e.preventDefault();
  const word = window.location.search;
  if (inValue(word) && confirm('是否删除本页面')) {
    GM_deleteValue(word);
  }
  const Value = GM_listValues();
  const List = [
  ];
  for (let i = 0; i < Value.length; i++) {
    if (Value[i] === 'List') {
      Value.splice(i, 1);
      i--;
    }
    List.push(Value[i]);
    GM_setValue(Value[i], i);
  }
  GM_setValue('List', List);
};
document.querySelector('.nosel+div>form>div:nth-child(3)').appendChild(button_break);
function inValue(word) {
  const Value = GM_listValues();
  for (let i = 0; i < Value.length; i++) {
    if (Value[i] === word) return true;
  }
  return false;
}
