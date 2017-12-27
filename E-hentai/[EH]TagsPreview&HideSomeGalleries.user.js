// ==UserScript==
// @name        [EH]TagsPreview&HideSomeGalleries
// @name:zh-CN  [EH]标签预览+隐藏画集
// @author      Dodying
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
// @version     1.2.2
// 使用了来自Mapaler/EhTagTranslator生成的json数据
// @resource data https://raw.githubusercontent.com/dodying/UserJs/master/E-hentai/%5BEH%5DTagsPreview%26HideSomeGalleries.json
// @grant       GM_getResourceText
// @run-at      document-idle
// ==/UserScript==
const $ = e => document.querySelector(e);
const $$ = e => document.querySelectorAll(e);
const $_ = e => document.createElement(e);
const inArray = (key, array) => {
  for (let i of array) {
    if (i === key) return true;
  }
  return false;
}
const CONFIG = {
  UNLIKE: {
    'females only': '只有女性',
    'males only': '只有男性',
    'vore': '活吞',
    'guro': '猎奇',
    'bestiality': '兽奸',
    'insect': '昆虫',
    'worm': '虫子',
    'furry': '毛皮',
    'eggs': '产卵',
    'parasite': '寄生',
    'brain fuck': '脑交',
    'amputee': '残肢',
    'futanari': '扶她',
    'dickgirl on dickgirl': '扶她上扶她',
    'male on dickgirl': '男的上扶她',
    'dickgirl on male': '扶她上男的',
    'bisexual': '双性',
    'monster': '怪物',
    'giantess': '女巨人',
    'novel': '小说',
    'snuff': '杀害',
    'necrophilia': '奸尸'
  },
  ALERT: {
    'tentacles': '触手',
    'rape': '强奸',
    'crossdressing': '异性装',
    'yaoi': '男同',
    'yuri': '女同',
    'netorare': 'NTR',
    'scat': '排泄',
    'animated': 'Gif'
  },
  CHS: (() => {
    var value = {};
    let data = GM_getResourceText('data');
    data = JSON.parse(data).dataset;
    for (let i in data) {
      let type = data[i].name;
      value[type] = {};
      for (let j in data[i].tags) {
        if (data[i].tags[j].type === 0) {
          value[type][data[i].tags[j].name] = data[i].tags[j].cname.filter(k => k.type === 0)[0].text;
        }
      }
    }
    return value;
  })()
}
var TagsPreview = {
  dataArr: [],
  checkData: function(data, i) {
    var _ = this;
    _.dataArr[i] = data;
    var dataAll = [].concat.apply([], _.dataArr);
    if (dataAll.length >= $$('.it5>a,.id3>a').length) {
      _.tagPreview(dataAll);
      _.hideGalleries(dataAll);
    }
  },
  xhr: function(gidlist, i) {
    var _ = this;
    var now = new Date().getTime();
    if (gidlist.length > 25) {
      var _gidlist = gidlist.splice(25, gidlist.length - 25);
    }
    var gdata = {
      'method': 'gdata',
      'gidlist': gidlist,
      'namespace': 1
    }
    var xhr = 'xhr_' + Math.random().toString();
    xhr = new XMLHttpRequest();
    xhr.open('POST', location.origin + '/api.php', true);
    xhr.responseType = 'json';
    var _i = i;
    xhr.onload = function() {
      _.checkData(xhr.response.gmetadata, _i);
    };
    xhr.send(JSON.stringify(gdata));
    if (_gidlist) {
      i++;
      _.xhr(_gidlist, i);
    }
  },
  init: function() {
    var _ = this;
    _.notice();
    _.addStyle();
    var gidlist = [];
    var bars = $$('.it5>a,.id3>a');
    $$('.it5>a,.id3>a').forEach(function(_bar, i) {
      if (_bar.querySelector('img')) {
        _bar.querySelector('img').className = 'TagPreview_' + i;
      } else {
        _bar.className = 'TagPreview_' + i;
      }
      var url_array = _bar.href.split('/');
      gidlist.push([url_array[4],
      url_array[5]]);
      if (i === bars.length - 1) _.xhr(gidlist, 0);
    });
  },
  tagPreview: function(data) {
    var _ = this;
    var CHS2 = {
      group: {},
      artist: {},
      parody: {}
    };
    data.forEach(function(_data, i) {
      var _title = _data.title.toLowerCase().replace(/^\(.*?\)/, '').trim();
      if (_data.title_jpn) var _titleJpn = _data.title_jpn.replace(/^\(.*?\)/, '').trim();
      let g, gc, a, ac, p, pc;
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
    var box = $_('div');
    box.id = 'TagPreview';
    $('.ido').addEventListener('mousemove', function(e) {
      if (e.target.className.indexOf('TagPreview_') >= 0) {
        var id = e.target.className.replace('TagPreview_', '');
        var tag;
        if (data[id].tag) {
          tag = data[id].tag;
        } else {
          tag = [];
          var tags = data[id].tags.slice();
          var tagsObj = new _.tagsObj();
          for (let i of tags) {
            let arr = i.split(':');
            let type = arr.length === 2 ? arr[0] : 'misc';
            let value = arr.length === 2 ? arr[1] : i;
            value = CONFIG.CHS[type][value] || (type in CHS2 && value in CHS2[type] ? CHS2[type][value] : value);
            tagsObj[type].push(value);
          }
          for (let i in tagsObj) {
            if (tagsObj[i].length > 0) tag.push(`<li class="${i}Tag"><span>${tagsObj[i].join('</span><span>')}</span></li>`);
          }
          tag = tag.join('');
          data[id].tag = tag;
        }
        var title = (data[id].title_jpn) ? data[id].title_jpn : data[id].title;
        box.style.display = 'block';
        box.style.left = (e.clientX + 5) + 'px';
        box.style.top = (e.clientY + 5) + 'px';
        box.innerHTML = '<div>' + title + '</div><div style="color:#FF0000">[' + (parseInt(data[id].filesize / 1024 / 1024)) + 'M]' + data[id].filecount + 'P</div><div style="height:2px;background-color:#000000;"></div><div>' + tag + '</div>';
        if (box.offsetHeight + e.clientY + 10 >= window.innerHeight) box.style.top = e.clientY - box.offsetHeight - 5 + 'px';
        if (box.offsetWidth + e.clientX + 10 >= window.innerWidth) box.style.left = e.clientX - box.offsetWidth - 5 + 'px';
      } else {
        box.style.display = 'none';
      }
    });
    $('body').appendChild(box);
  },
  hideGalleries: function(data) {
    var bars = $$('.it5>a,.id3>a');
    var barHide = [];
    var boxHide = [];
    data.forEach(function(_data, i) {
      _data.tags.forEach(function(_tag, k) {
        let arr = _tag.split(':');
        let value = arr.length === 2 ? arr[1] : i;
        if (value in CONFIG.UNLIKE || value in CONFIG.ALERT) {
          var div = $_('span');
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
    $('p.ip').innerHTML += '  总共屏蔽' + (barHide.length + boxHide.length) + '本本子。';
    var toggle = $_('button');
    toggle.id = 'toggleHide';
    toggle.className = 'stdbtn';
    toggle.onclick = function() {
      var isShow = this.id === 'toggleShow';
      this.id = isShow ? 'toggleHide' : 'toggleShow';
      barHide.forEach(function(i) {
        i.parentNode.parentNode.parentNode.parentNode.style.display = isShow ? '' : 'none';
      });
      barHide.forEach(function(i) {
        i.parentNode.parentNode.style.display = isShow ? '' : 'none';
      });
    }
    toggle.click();
    $('p.ip').appendChild(toggle);
  },
  notice: function() {
    let _ = CONFIG;
    let notice = '当前屏蔽的标签有：<span class="TAGS UNLIKE">';
    for (let i in _.UNLIKE) {
      notice += `<li title="${i}">${_.UNLIKE[i]}</li>`;
    }
    notice += '</span><br>当前警告的标签有：<span class="TAGS ALERT">';
    for (let i in _.ALERT) {
      notice += `<li title="${i}">${_.ALERT[i]}</li>`;
    }
    notice += '</span>';
    $('h1').innerHTML = notice;
  },
  addStyle: function() {
    var style = $_('style');
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
      '#toggleHide::before{content:"隐藏"}'
    ].join('');
    $('body').appendChild(style);
  },
  tagsObj: function() {
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
  }
}
TagsPreview.init();
