// ==UserScript==
// @name        [EH]TagsPreview&HideSomeGalleries
// @name:zh-CN  [EH]标签预览+隐藏画集
// @author      dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description Show tags when move to a title or thumb, while hiding the gallery which tagged you unlike
// @description:zh-CN 移动到画廊上可预览标签，同时如果标签里有不喜欢的标签则会隐藏该画集
// @include     http*://exhentai.org/*
// @include     http*://e-hentai.org/*
// @exclude     http*://exhentai.org/g/*
// @exclude     http*://e-hentai.org/g/*
// @exclude     http*://exhentai.org/s/*
// @exclude     http*://e-hentai.org/s/*
// @version     1.2.3
// 使用了来自Mapaler/EhTagTranslator生成的json数据
// @resource EHT https://gitee.com/dodying/userJs/raw/master/E-hentai/EHT.json
// @grant       GM_getResourceText
// @run-at      document-idle
// ==/UserScript==
const $ = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);
const $_ = (e) => document.createElement(e);
const inArray = (key, array) => {
  for (const i of array) {
    if (i === key) return true;
  }
  return false;
};
const CONFIG = {
  UNLIKE: {
    'females only': '只有女性',
    'males only': '只有男性',
    vore: '活吞',
    guro: '猎奇',
    bestiality: '兽奸',
    insect: '昆虫',
    worm: '虫子',
    furry: '毛皮',
    eggs: '产卵',
    parasite: '寄生',
    'brain fuck': '脑交',
    amputee: '残肢',
    futanari: '扶她',
    'dickgirl on dickgirl': '扶她上扶她',
    'male on dickgirl': '男的上扶她',
    'dickgirl on male': '扶她上男的',
    bisexual: '双性',
    monster: '怪物',
    giantess: '女巨人',
    novel: '小说',
    snuff: '杀害',
    necrophilia: '奸尸',
  },
  ALERT: {
    tentacles: '触手',
    rape: '强奸',
    crossdressing: '异性装',
    yaoi: '男同',
    yuri: '女同',
    netorare: 'NTR',
    scat: '排泄',
    animated: 'Gif',
  },
  CHS: (() => {
    const value = {};
    let data = GM_getResourceText('EHT');
    data = JSON.parse(data).dataset;
    for (const i in data) {
      const type = data[i].name;
      value[type] = {};
      for (const j in data[i].tags) {
        if (data[i].tags[j].type === 0) {
          value[type][data[i].tags[j].name] = data[i].tags[j].cname.filter((k) => k.type === 0)[0].text;
        }
      }
    }
    return value;
  })(),
};
const TagsPreview = {
  dataArr: [],
  checkData(data, i) {
    const _ = this;
    _.dataArr[i] = data;
    const dataAll = [].concat.apply([], _.dataArr);
    if (dataAll.length >= $$('.it5>a,.id3>a').length) {
      _.tagPreview(dataAll);
      _.hideGalleries(dataAll);
    }
  },
  xhr(gidlist, i) {
    const _ = this;
    const now = new Date().getTime();
    if (gidlist.length > 25) {
      var _gidlist = gidlist.splice(25, gidlist.length - 25);
    }
    const gdata = {
      method: 'gdata',
      gidlist,
      namespace: 1,
    };
    let xhr = `xhr_${Math.random().toString()}`;
    xhr = new XMLHttpRequest();
    xhr.open('POST', `${location.origin}/api.php`, true);
    xhr.responseType = 'json';
    const _i = i;
    xhr.onload = function () {
      _.checkData(xhr.response.gmetadata, _i);
    };
    xhr.send(JSON.stringify(gdata));
    if (_gidlist) {
      i++;
      _.xhr(_gidlist, i);
    }
  },
  init() {
    const _ = this;
    _.notice();
    _.addStyle();
    const gidlist = [];
    const bars = $$('.it5>a,.id3>a');
    $$('.it5>a,.id3>a').forEach((_bar, i) => {
      if (_bar.querySelector('img')) {
        _bar.querySelector('img').className = `TagPreview_${i}`;
      } else {
        _bar.className = `TagPreview_${i}`;
      }
      const url_array = _bar.href.split('/');
      gidlist.push([url_array[4],
        url_array[5]]);
      if (i === bars.length - 1) _.xhr(gidlist, 0);
    });
  },
  tagPreview(data) {
    const _ = this;
    const CHS2 = {
      group: {},
      artist: {},
      parody: {},
    };
    data.forEach((_data, i) => {
      let _title = _data.title.toLowerCase().replace(/^\(.*?\)/, '').trim();
      if (_data.title_jpn) var _titleJpn = _data.title_jpn.replace(/^\(.*?\)/, '').trim();
      let g; let gc; let a; let ac; let p; let
        pc;
      if (_title.match(/^\[.*?\]/)) {
        g = _title.match(/^\[(.*?)\]/)[1].trim();
        if (_titleJpn && _titleJpn.match(/^\[.*?\]/)) gc = _titleJpn.match(/^\[(.*?)\]/)[1].trim();
        if (g.match(/\(.*?\)/)) {
          a = g.match(/\((.*?)\)/)[1].trim();
          g = g.match(/(.*?)\(.*?\)/)[1].trim();
          if (gc && gc.match(/\(.*?\)/)) {
            ac = gc.match(/\((.*?)\)/)[1].trim();
            gc = gc.match(/(.*?)\(.*?\)/)[1].trim();
          }
        }
      }
      if (_data.category === 'parody') {
        _title = _title.replace(/\[.*?\]/g, '').trim();
        if (_data.title_jpn) _titleJpn = _titleJpn.replace(/\[.*?\]/g, '').trim();
        if (_title.match(/\(.*?\)/)) {
          p = _title.match(/\((.*?)\)/)[1].replace(/[!?\.\/]/g, ' ').trim();
          if (_titleJpn && _titleJpn.match(/\(.*?\)/)) pc = _titleJpn.match(/\((.*?)\)/)[1];
        }
      }
      CHS2.artist[a] = ac;
      CHS2.artist[g] = gc;
      CHS2.group[a] = ac;
      CHS2.group[g] = gc;
      CHS2.parody[p] = pc;
    });
    const box = $_('div');
    box.id = 'TagPreview';
    $('.ido').addEventListener('mousemove', (e) => {
      if (e.target.className.indexOf('TagPreview_') >= 0) {
        const id = e.target.className.replace('TagPreview_', '');
        let tag;
        if (data[id].tag) {
          tag = data[id].tag;
        } else {
          tag = [];
          const tags = data[id].tags.slice();
          const tagsObj = new _.tagsObj();
          for (const i of tags) {
            const arr = i.split(':');
            const type = arr.length === 2 ? arr[0] : 'misc';
            let value = arr.length === 2 ? arr[1] : i;
            value = CONFIG.CHS[type][value] || (type in CHS2 && value in CHS2[type] ? CHS2[type][value] : value);
            tagsObj[type].push(value);
          }
          for (const i in tagsObj) {
            if (tagsObj[i].length > 0) tag.push(`<li class="${i}Tag"><span>${tagsObj[i].join('</span><span>')}</span></li>`);
          }
          tag = tag.join('');
          data[id].tag = tag;
        }
        const title = (data[id].title_jpn) ? data[id].title_jpn : data[id].title;
        box.style.display = 'block';
        box.style.left = `${e.clientX + 5}px`;
        box.style.top = `${e.clientY + 5}px`;
        box.innerHTML = `<div>${title}</div><div style="color:#FF0000">[${parseInt(data[id].filesize / 1024 / 1024)}M]${data[id].filecount}P</div><div style="height:2px;background-color:#000000;"></div><div>${tag}</div>`;
        if (box.offsetHeight + e.clientY + 10 >= window.innerHeight) box.style.top = `${e.clientY - box.offsetHeight - 5}px`;
        if (box.offsetWidth + e.clientX + 10 >= window.innerWidth) box.style.left = `${e.clientX - box.offsetWidth - 5}px`;
      } else {
        box.style.display = 'none';
      }
    });
    $('body').appendChild(box);
  },
  hideGalleries(data) {
    const bars = $$('.it5>a,.id3>a');
    const barHide = [];
    const boxHide = [];
    data.forEach((_data, i) => {
      _data.tags.forEach((_tag, k) => {
        const arr = _tag.split(':');
        const value = arr.length === 2 ? arr[1] : i;
        if (value in CONFIG.UNLIKE || value in CONFIG.ALERT) {
          const div = $_('span');
          div.title = value;
          bars[i].parentNode.parentNode.insertBefore(div, bars[i].parentNode);
          if (value in CONFIG.UNLIKE) {
            div.className = 'unlikeTag';
            div.innerHTML = CONFIG.UNLIKE[value];
            if (bars[i].parentNode.className === 'it5' && !inArray(bars[i], barHide)) {
              barHide.push(bars[i]);
            } else if (bars[i].parentNode.className === 'id3' && !inArray(bars[i], boxHide)) {
              boxHide.push(bars[i]);
            }
          } else {
            div.className = 'alertTag';
            div.innerHTML = CONFIG.ALERT[value];
          }
        }
      });
    });
    $('p.ip').innerHTML += `  总共屏蔽${barHide.length + boxHide.length}本本子。`;
    const toggle = $_('button');
    toggle.id = 'toggleHide';
    toggle.className = 'stdbtn';
    toggle.onclick = function () {
      const isShow = this.id === 'toggleShow';
      this.id = isShow ? 'toggleHide' : 'toggleShow';
      barHide.forEach((i) => {
        i.parentNode.parentNode.parentNode.parentNode.style.display = isShow ? '' : 'none';
      });
      barHide.forEach((i) => {
        i.parentNode.parentNode.style.display = isShow ? '' : 'none';
      });
    };
    toggle.click();
    $('p.ip').appendChild(toggle);
  },
  notice() {
    const _ = CONFIG;
    let notice = '当前屏蔽的标签有：<span class="TAGS UNLIKE">';
    for (const i in _.UNLIKE) {
      notice = `${notice}<li title="${i}">${_.UNLIKE[i]}</li>`;
    }
    notice = `${notice}</span><br>当前警告的标签有：<span class="TAGS ALERT">`;
    for (const i in _.ALERT) {
      notice = `${notice}<li title="${i}">${_.ALERT[i]}</li>`;
    }
    notice = `${notice}</span>`;
    $('h1').innerHTML = notice;
  },
  addStyle() {
    const style = $_('style');
    style.textContent = [
      '.TAGS{font-size:10pt;}',
      '.TAGS>li{display:inline;margin:0 2px;cursor:pointer;}',
      '.UNLIKE>li{color:#FF0000;}',
      '.ALERT>li{color:#FFFF00;}',
      '#TagPreview{position:fixed;padding:5px;display:none;z-index:999;font-size:larger;width:250px;border-color:#000000;border-style:solid;color:#FFFFFF;background-color:#34353B;}',
      '#TagPreview li.languageTag::before{content:"语言: "}',
      '#TagPreview li.reclassTag::before{content:"重新分类: "}',
      '#TagPreview li.artistTag{font-size:larger;color:#008000;}',
      '#TagPreview li.artistTag::before{content:"漫画家: "}',
      '#TagPreview li.groupTag{font-size:larger;color:#00FFF5;}',
      '#TagPreview li.groupTag::before{content:"组织: "}',
      '#TagPreview li.parodyTag{font-size:larger;color:#FFFF00;}',
      '#TagPreview li.parodyTag::before{content:"同人: "}',
      '#TagPreview li.characterTag::before{content:"角色: "}',
      '#TagPreview li.femaleTag::before{content:"女: "}',
      '#TagPreview li.maleTag::before{content:"男: "}',
      '#TagPreview li.miscTag::before{content:"杂项: "}',
      '#TagPreview li.otherTag::before{content:"未分类: "}',
      '#TagPreview li{color:#C9BA67}',
      '#TagPreview li>span{display:inline;margin:0 2px;border:1px #456F78 solid;}',
      '.unlikeTag{float:left;color:#FF0000;background-color:#0000FF;margin:0 1px;}',
      '.alertTag{float:left;color:#FFFF00;background-color:#008000;margin:0 1px;}',
      '#toggleShow::before{content:"显示"}',
      '#toggleHide::before{content:"隐藏"}',
    ].join('');
    $('body').appendChild(style);
  },
  tagsObj() {
    this.language = [];
    this.reclass = [];
    this.artist = [];
    this.group = [];
    this.parody = [];
    this.character = [];
    this.female = [];
    this.male = [];
    this.misc = [];
    this.other = [];
  },
};
TagsPreview.init();
