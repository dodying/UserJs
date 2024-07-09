// ==UserScript==
// @name        [EH]LocalBookmark
// @name:zh-CN  [EH]本地书签
// @namespace   https://github.com/dodying/Dodying-UserJs
// @description set a local bookmark
// @description:zh-CN  储存为本地书签
// @include     http*://exhentai.org/*
// @include     http*://e-hentai.org/*
// @exclude     http*://exhentai.org/s/*
// @exclude     http*://e-hentai.org/s/*
// @version     1.06
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @icon        https://github.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// ==/UserScript==
(function () {
  addStyle();
  const intro = [
    '0.未下载',
    '1.连载-系列',
    '2.CG-COS-画集-女同',
    '3.东方-LL-舰娘-偶像大师',
    '4.同人',
    '5.大师-萝莉',
    '6.纯爱-Np-1♂',
    '7.纯爱-乱伦',
    '8.纯爱-2p-♂♀',
    '9.难定-杂志-故事',
  ];
  if (/\/g\/\d+\//.test(document.URL)) { // 信息页
    const name = jQuery('h1#gn').text();
    const gid = document.URL.split('/')[4];
    const token = document.URL.split('/')[5];
    const _info = {
      name,
      gid,
      token,
    };
    document.onkeydown = function (e) {
      if (e.shiftKey && ((e.keyCode >= 49 && e.keyCode <= 57) || e.keyCode === 65)) { // Shift+Num/Shift+A
        var whitelist = GM_getValue('whitelist', new Object());
        const status = (e.keyCode === 65) ? 10 : e.keyCode - 48;
        _info.status = status;
        whitelist[gid] = _info;
        GM_setValue('whitelist', whitelist);
        jQuery('#gd3>div>div').attr('class', () => ((status === 10) ? 'ehLBMark' : `i${gid} ehLBFav ehLBFav${status}`));
        jQuery('#gdf').html(() => ((status === 10) ? '<div class="ehLBMark"></div>已加入[#作者]' : `<div class="ehLBFav ehLBFav${status}"></div>${intro[status]}`));
      } else if (e.shiftKey && e.keyCode === 66) { // Shift+B
        const blacklist = GM_getValue('blacklist', new Array());
        const keyword = prompt('请输入关键词', name.replace(/\[.*?\]|\(.*?\)/g, '').replace(/^\s+|\s+$/g, ''));
        if (keyword === '' || keyword === null) return;
        blacklist.push(keyword);
        GM_setValue('blacklist', blacklist);
        jQuery('#gd3>div>div').attr('class', `i${gid} ehLBUnlike`);
        jQuery('#gdf').html('<div class="ehLBUnlike"></div>已加入黑名单');
      } else if (e.shiftKey && e.keyCode === 68) { // Shift+D
        var whitelist = GM_getValue('whitelist', new Object());
        delete whitelist[gid];
        GM_setValue('whitelist', whitelist);
        jQuery('#gd3>div>div').attr('class', `i${gid} ehLBAdd`);
        jQuery('#gdf').html('<div style="float:left;cursor:pointer"id="fav"></div><div style="float:left"><a id="favoritelink"href="#"onclick="return false"><img src="/img/mr.gif">Add to Favorites</a></div><div class="c"></div>');
      }
    };
    jQuery('#gd3').prepend(`<div oncontextmenu="return false;"><div class="ehLBAdd i${gid}"></div><a target="_blank" href="/?f_search=%22${encodeURIComponent(name.replace(/\[.*?\]|\(.*?\)/g, '').replace(/^\s+|\s+$/g, '').replace(/\|.*/, ''))}%22"><div class="ehLBSearch"></div></a></div>`);
    jQuery('.ehLBMark,.ehLBFav,.ehLBAdd,.ehLBUnlike').mousedown(function (e) {
      var whitelist = GM_getValue('whitelist', new Object());
      const blacklist = GM_getValue('blacklist', new Array());
      if (e.button === 0) { // 左键单击(有无Shift)
        let status = (e.shiftKey) ? prompt(`请输入类型\n${intro.join('\n')}\n10.从收藏夹移除`, GM_getValue('lastAdded', '')) : GM_getValue('lastAdded', null) || prompt(`请输入类型\n${intro.join('\n')}\n10.从收藏夹移除`, GM_getValue('lastAdded', ''));
        status = parseInt(status);
        if (isNaN(status) || status > 10 || status < 0) {
          return;
        } if (status === 10) {
          delete whitelist[gid];
          jQuery(this).attr('class', `i${gid} ehLBUnlike`);
          jQuery('#gdf').html('<div class="ehLBUnlike"></div>已加入黑名单');
        } else {
          _info.status = status;
          whitelist[gid] = _info;
          jQuery(this).attr('class', `i${gid} ehLBFav ehLBFav${status}`);
          jQuery('#gdf').html(`<div class="ehLBFav ehLBFav${status}" title="${intro[status]}"></div>${intro[status]}`);
        }
        GM_setValue('whitelist', whitelist);
        GM_setValue('lastAdded', status);
      } else if (e.button === 2 && (e.shiftKey || e.ctrlKey)) { // 右键单击+Ctrl/Shift  删除(并加入黑名单)
        var whitelist = GM_getValue('whitelist', new Object());
        delete whitelist[gid];
        GM_setValue('whitelist', whitelist);
        jQuery(this).attr('class', `i${gid} ehLBUnlike`);
        jQuery('#gdf').html('<div class="ehLBUnlike"></div>已移除');
        if (e.shiftKey) {
          const keyword = prompt('请输入关键词', name.replace(/\[.*?\]|\(.*?\)/g, '').replace(/^\s+|\s+$/g, ''));
          if (keyword === '' || keyword === null) return;
          blacklist.push(keyword);
          GM_setValue('blacklist', blacklist);
          jQuery('#gdf').html('<div class="ehLBUnlike"></div>已加入黑名单');
        }
      } else if (e.button === 2) { // 右键单击  加入0
        _info.status = 10;
        whitelist[gid] = _info;
        GM_setValue('whitelist', whitelist);
        jQuery(this).attr('class', `i${gid} ehLBMark`);
        jQuery('#gdf').html('<div class="ehLBMark"></div>已加入[#作者]');
      }
    });
    var whitelist = GM_getValue('whitelist', new Object());
    var blacklist = GM_getValue('blacklist', new Array());
    if (gid in whitelist) {
      const { status } = whitelist[gid];
      jQuery('#gd3>div>div').attr('class', () => ((status === 10) ? 'ehLBMark' : `i${gid} ehLBFav ehLBFav${status}`));
      jQuery('#gdf').html(() => ((status === 10) ? '<div class="ehLBMark"></div>已加入[#作者]' : `<div class="ehLBFav ehLBFav${status}"></div>${intro[status]}`));
    }
    for (let i = 0; i < blacklist.length; i++) {
      if (new RegExp(blacklist[i], 'gi').test(jQuery('#gn').text())) {
        jQuery('#gd3>div>div').attr('class', `i${gid} ehLBUnlike`);
        jQuery('#gdf').html('<div class="ehLBUnlike"></div>已加入黑名单');
        break;
      }
    }
  } else { // 搜索页
    var whitelist = GM_getValue('whitelist', new Object());
    var blacklist = GM_getValue('blacklist', new Array());
    jQuery('.it5>a').each(function () {
      if (!/\/g\/\d+\//.test(this.href)) return;
      const gid = this.href.split('/')[4];
      const name = this.innerText.replace(/\[.*?\]|\(.*?\)/g, '').replace(/^\s+|\s+$/g, '').replace(/\|.*/, '');
      jQuery(this).parent().parent().before(`<div oncontextmenu="return false;"><div class="ehLBAdd i${gid}"></div><a target="_blank" href="/?f_search=%22${encodeURIComponent(name)}%22"><div class="ehLBSearch"></div></a></div>`);
      if (gid in whitelist) {
        const { status } = whitelist[gid];
        jQuery(`.i${gid}`).attr({
          class() {
            return (status === 10) ? 'ehLBMark' : `ehLBFav ehLBFav${status}`;
          },
          title: intro[status],
        });
        return;
      }
      for (let i = 0; i < blacklist.length; i++) {
        if (new RegExp(blacklist[i], 'gi').test(this.innerText)) {
          this.title = blacklist[i];
          this.style.backgroundColor = 'black';
          this.style.color = 'black';
          jQuery(`.i${gid}`).attr('class', 'ehLBUnlike');
          return;
        }
      }
    });
    jQuery('.ehLBMark,.ehLBFav,.ehLBAdd,.ehLBUnlike').mousedown(function (e) {
      const parent = jQuery(this).parent().parent();
      var whitelist = GM_getValue('whitelist', new Object());
      const blacklist = GM_getValue('blacklist', new Array());
      const name = parent.find('.it5>a').text();
      const gid = parent.find('.it5>a').attr('href').split('/')[4];
      const token = parent.find('.it5>a').attr('href').split('/')[5];
      const _info = {
        name,
        gid,
        token,
      };
      if (e.button === 0) { // 左键单击(有无Shift)
        let status = (e.shiftKey) ? prompt(`请输入类型\n${intro.join('\n')}\n10.从收藏夹移除`, GM_getValue('lastAdded', '')) : GM_getValue('lastAdded', null) || prompt(`请输入类型\n${intro.join('\n')}\n10.从收藏夹移除`, GM_getValue('lastAdded', ''));
        status = parseInt(status);
        if (isNaN(status) || status > 10 || status < 0) {
          return;
        } if (status === 10) {
          delete whitelist[gid];
          jQuery(this).attr('class', `i${gid} ehLBUnlike`);
        } else {
          _info.status = status;
          whitelist[gid] = _info;
          jQuery(this).attr('class', `i${gid} ehLBFav ehLBFav${status}`);
        }
        GM_setValue('whitelist', whitelist);
        GM_setValue('lastAdded', status);
      } else if (e.button === 2 && (e.shiftKey || e.ctrlKey)) { // 右键单击+Ctrl/Shift  删除(并加入黑名单)
        var whitelist = GM_getValue('whitelist', new Object());
        delete whitelist[gid];
        GM_setValue('whitelist', whitelist);
        jQuery(this).attr('class', `i${gid} ehLBUnlike`);
        if (e.shiftKey) {
          const keyword = prompt('请输入关键词', name.replace(/\[.*?\]|\(.*?\)/g, '').replace(/^\s+|\s+$/g, ''));
          if (keyword === '' || keyword === null) return;
          blacklist.push(keyword);
          GM_setValue('blacklist', blacklist);
        }
      } else if (e.button === 2) { // 右键单击  加入0
        _info.status = 10;
        whitelist[gid] = _info;
        GM_setValue('whitelist', whitelist);
        jQuery(this).attr('class', `i${gid} ehLBMark`);
      }
    });
  }
  GM_registerMenuCommand('显示黑名单', () => {
    if (jQuery('.ehLBBox').length === 0) {
      const blacklist = GM_getValue('blacklist', new Array());
      let _html = '<div class="ehLBBox"><div class="ehLBTable"><table><tbody>';
      for (let i = 0; i < blacklist.length; i++) {
        _html = `${_html}<tr><td><a href="/?f_search=%22${encodeURIComponent(blacklist[i])}" target="_blank">${blacklist[i]}</a></td><td><input type="checkbox" name="${blacklist[i]}"></input></td></tr>`;
      }
      _html = `${_html}</tbody></table></div><button class="ehLBHideBox">X</button><button class="ehLBDedup">去重</button><button class="ehLBDelete">删除</button></div>`;
      jQuery('body').append(_html);
      jQuery('.ehLBHideBox').click(() => {
        jQuery('.ehLBBox').remove();
      });
      jQuery('.ehLBDedup').click(() => {
        blacklist.sort();
        for (let i = 1; i < blacklist.length; i++) {
          if (blacklist[i] === blacklist[i - 1]) {
            blacklist.splice(i, 1);
            i--;
          }
        }
        GM_setValue('blacklist', blacklist);
        location.reload();
      });
      jQuery('.ehLBDelete').click(() => {
        jQuery('.ehLBTable input:checked').each(function () {
          blacklist.splice(jQuery.inArray(this.name, blacklist), 1);
        });
        GM_setValue('blacklist', blacklist);
        location.reload();
      });
    } else {
      jQuery('.ehLBBox').remove();
    }
  }, 'B');
  GM_registerMenuCommand('显示收藏夹', () => {
    if (jQuery('.ehLBBox').length === 0) {
      const whitelist = GM_getValue('whitelist', new Object());
      let _html = '<div class="ehLBBox"><div class="ehLBTable"><table><tbody><th>名字</th><th></th>';
      const _htmlArr = new Array('', '', '', '', '', '', '', '', '', '', '');
      for (const i in whitelist) {
        _htmlArr[whitelist[i].status] += '<tr><td class="ehLBName">';
        _htmlArr[whitelist[i].status] += (whitelist[i].status === 10) ? '<div class="ehLBMark">' : `<div class="ehLBFav ehLBFav${whitelist[i].status}">`;
        _htmlArr[whitelist[i].status] += `</div><a href="/g/${whitelist[i].gid}/${whitelist[i].token}/" target="_blank">${whitelist[i].name}</a></td><td><input type="checkbox" name="${whitelist[i].gid}"></input></td></tr>`;
      }
      _html = `${_html}${_htmlArr.join('')}</tbody></table></div><button class="ehLBHideBox">X</button><button class="ehLBDelete">删除</button></div>`;
      jQuery('body').append(_html);
      jQuery('.ehLBHideBox').click(() => {
        jQuery('.ehLBBox').remove();
      });
      jQuery('.ehLBDelete').click(() => {
        jQuery('.ehLBTable input:checked').each(function () {
          delete whitelist[this.name];
        });
        GM_setValue('blacklist', blacklist);
        location.reload();
      });
    } else {
      jQuery('.ehLBBox').remove();
    }
  }, 'W');
}());
function addStyle() {
  const imgMark = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVQ4jY2Tv04qURDGD8magM+wxakvxc58c0LAZqcntDzKhlegIGqiUQtfxAAWt6M1S2KseQQtXLJj4brB5cJlkmnOmd/8yXzjXMMACIAHAG/M/Fn5KzPfERE142sTkXNmfhQRO+bMfB/HcWcPJqK/u4EhiIUQLIT9JET07L1vO+dazjnnmpW/wW8/1AmAW1WNHAA5FZ5MJjabzeoOkyRhB+DhFHg6nZqZWVmWNh6PLYRgAG4cgLffMx+Hl8ul9Xo9C0EMQO6Y+VNELE1TW6/XtlqtLE3Tg/DFxaAuwswfdYLhcGhFUZiZWZ7npqpH4SrBu2Pm15+HLMtsu92amdlms6nhxWKxB1frfHHMfLf7uJukLEubz+f/hKtVXjoiouZHlmVWFMX/4LLb7f75EdJ9M2A0Glm/3z8opiRJrmslxnHcIaLnU5VIRE/e+7aqRvU9eO/bAG6P3QCAEsCV9749GAw6InK2e1MtVY2SJGEANwByZv5g5nciegFwWc3cUtVIRM5UNfoCd86XpR4kWgwAAAAASUVORK5CYII=';
  const imgFav = 'data:image/png;base64,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';
  const imgAdd = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAxUlEQVQ4ja2TSwrDMAxERyNvEgg9jFdC25y9tMdpcwB3k4/j2GkoFQiMkZ9GHwPAE0D60R84CxCR1U/itkNmYmZdjLE3sw6A4GhNAN19GMd4c/cBACuPsSgsAeXj9+ylkeQBIJXMtfLo7oOq7gFm1lVkN8sjufVARFKMsc9kVzuuyilLsgfM3WYLEIImVX3VyltqaY6qMZXTPVgBIWhqjPQrgKqcCtkHdS3AlWX6/yYmAIlkUtWUzbnq+SY+lsuLvy+Lw/0DpJalxJ3rpocAAAAASUVORK5CYII=';
  const imgUnlike = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABU0lEQVQ4jY2TIU8DQRCFv7luj7sm10qQrSCI1q24bNacuPCnIEUVAYrwK5AVGASpwGMRxUECCYKAQNCkiO4d2801uUlWzby3772dBTgC7oF34LPleQPugCHAAjgBOmyXFEWhtNbdoigUIF5PARfAHOAraAKIMSbVWveMMWlDH2APeAJYBY3IWpuVpR5YazMgagDjSJ9Dgsham00mo/0A3AlURMaYVGSbQKy12Xg8PFBKPQJTz+8NcO5forXu+QrEGJOWpR7ked4HZsAaOHPgH+DYt+eyWQKsXNo9T7a4G9fAbwh2c1ITaK27jrHyXMleOZLpjmD/FXghVeBK9kypzjpJ4lnDqyzrDPyEgetKdp7n/TiOL5VSD0DCdtUETVV7dsGmDTM7Cdou0xLgO7TQEpzgVnkBnOK2rcUfAIiVUlciMgc4ZPM1X4GPludFRG6TJBn9Ad+Da04HY41AAAAAAElFTkSuQmCC';
  const imgSearch = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7ElEQVQ4jX1TvW7iQBBeJCLBPQOF66PwzuwWRjTrwjUVz8Aj2D2iRLmTsJLIut4UfgCfkIJ0D0ARUkR5AlMvLrJSvmvAR0wuI02xs/N98y9ES5hZMfMDM78S0dtJX4joTkop2/6NKKW+EdEvpRS+UiK6HwwG/SuwlPLPpaPWClpraH1NIqV89DyvJ4ToCCGEaEeezWYoigLb7RZ5nmM6nV6RMHNqjOkKZlaXH1mWwVqL/X6PzWaDqqrgnEOSJGhn6Ps+CWZ+uIxsrcVyuWwcgyBAWZao6xpRFJ3AGlprMPNKMPPrmbEoCuz3+6t0wzCEcw6LxaIBa63AzM+CiN7OrNvtFpvN5tPuV1WFNF01BKeJ1BcECnmeo6oqBEHwATyZTGCtRRzHDfhEcBRE9HI2TKdTOOdQliXCMGzAu90Oh8MB4/G4Pc4nQUR3l8YkSVDXNZxzqKoK1locDgccj0fkef4hA2a+FVJK2a43iiIsFguk6QpxHGM8HmO9XgMAsiw7g9+Hw+H38yLdt0n+dVs37yzLMJ/PoZSC7/s/m00cDAZ9KeXj/8CfrPJvz/N6xphucw+e5/WYOf3qBpj5nZl/eJ7XG41GfaXUzeVNdYwxXd/3iZlXzPxMRDURHaWUT8x8e6q5Y4zpKqVujDHdv6rJoiTHuLTjAAAAAElFTkSuQmCC';
  jQuery('head').append(`${'<style>'
  + '.ehLBMark{background-image:url("'}${imgMark}");}`
  + `.ehLBFav{background-image:url("${imgFav}");}`
  + `.ehLBAdd{background-image:url("${imgAdd}");}`
  + `.ehLBUnlike{background-image:url("${imgUnlike}");}`
  + `.ehLBSearch{background-image:url("${imgSearch}");}`
  + '.ehLBMark,.ehLBFav,.ehLBAdd,.ehLBUnlike,.ehLBSearch{cursor:pointer;margin:0 1px;float:left;width:16px;height:16px;}'
  + '.ehLBFav0{background-position:0px -2px;}'
  + '.ehLBFav1{background-position:0px -21px;}'
  + '.ehLBFav2{background-position:0px -40px;}'
  + '.ehLBFav3{background-position:0px -59px;}'
  + '.ehLBFav4{background-position:0px -78px;}'
  + '.ehLBFav5{background-position:0px -97px;}'
  + '.ehLBFav6{background-position:0px -116px;}'
  + '.ehLBFav7{background-position:0px -135px;}'
  + '.ehLBFav8{background-position:0px -154px;}'
  + '.ehLBFav9{background-position:0px -173px;}'
  + '.ehLBBox{max-width:600px;position:fixed;top:10px;left:10px;background-color:#4F535B;z-index:999999;}'
  + '.ehLBTable{max-height:400px;min-width:211px;overflow:auto;}'
  + '.ehLBName{min-width:74px;}'
  + '.ehLBName img{display:none;}'
  + '.ehLBHideBox{color:red;float:right;}'
  + '</style>');
}
