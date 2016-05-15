// ==UserScript==
// @name        EH_TagsPreview&HideSomeGalleries
// @name:zh-CN  【EH】标签预览+隐藏画集
// @namespace   Dodying
// @author      Dodying
// @description 移动到画廊上可预览标签，同时如果标签里有不喜欢的标签则会隐藏该画集
// @description:zh-CN 移动到画廊上可预览标签，同时如果标签里有不喜欢的标签则会隐藏该画集
// @include     http://exhentai.org/
// @include     http://exhentai.org/?*
// @include     http://exhentai.org/tag/*
// @include     http://exhentai.org/favorites.php
// @include     http://exhentai.org/favorites.php?*
// @include     http://exhentai.org/uploader/*
// @include     http://g.e-hentai.org/
// @include     http://g.e-hentai.org/?*
// @include     http://g.e-hentai.org/tag/*
// @include     http://g.e-hentai.org/favorites.php
// @include     http://g.e-hentai.org/favorites.php?*
// @include     http://g.e-hentai.org/uploader/*
// @version     1.02
// @grant       none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @run-at      document-idle
// ==/UserScript==
/*要隐藏的标签*/
var UnlikeTags = {
  'yaoi': '男同',
  'females only': '只有女性',
  'males only': '只有男性',
  'vore': '活吞',
  'tentacles': '触手',
  'guro': '猎奇',
  'scat': '排泄',
  'bestiality': '兽奸',
  'insect': '昆虫',
  'worm': '虫子',
  'furry': '毛皮',
  'amputee': '残肢',
  'futanari': '扶她',
  'dickgirl on dickgirl': '扶她上扶她',
  'male on dickgirl': '男的上扶她',
  'dickgirl on male': '扶她上男的',
  'monster': '怪物',
  //'netorare': 'NTR'
} /*要隐藏的标签*/

var UnlikeTags_Alarm = '当前屏蔽的标签有：<span style="font-size:larger">';
for (var i in UnlikeTags) {
  UnlikeTags_Alarm += UnlikeTags[i] + '&nbsp;';
}
UnlikeTags_Alarm += '</span>'
var UnlikeTags_Div = document.querySelector('#toppane>h1');
UnlikeTags_Div.innerHTML = UnlikeTags_Alarm;
//setTimeout(function(){
//a.style.display="none";
//},5000)
/*要翻译的标签*/
var TagsChs = {
  //艺术家
  'oouso': '大嘘',
  'korie riko': '捆枝りこ',
  'peko': 'ぺこ',
  'akaza': 'あかざ',
  'ishikei': '石惠',
  'happoubi jin': '八宝备仁(はっぽうび じん)',
  'kizuki aruchu': '鬼月あるちゅ',
  'harumi chihiro': '晴见千寻（ハルミチヒロ）',
  //团队
  'usotsukiya': '嘘つき屋',
  'softstar': '大宇资讯',
  //语言和色彩类
  'chinese': '<span style="color:red;">中文</span>',
  'translated': '翻译本',
  'english': '英文',
  'portuguese': '葡萄牙文',
  'french': '法文',
  'full color': '全彩色',
  'korean': '韩文',
  'spanish': '西班牙语',
  'russian': '俄罗斯语',
  'thai': '泰文',
  'italian': '意大利文',
  //同人题材类
  'touhou project': '东方Project',
  'moetan': '萌单',
  'ore no imouto ga konna ni kawaii wake ga nai': '我的妹妹不可能那么可爱',
  'toaru kagaku no railgun': '某科学的超电磁炮',
  'kantai collection': '舰队collection',
  'pokemon': '精灵宝可梦',
  'higurashi no naku koro ni': '寒蝉鸣泣之时',
  'saki': '天才麻将少女',
  'puella magi madoka magica': '魔法少女小圆',
  'lotte no omocha': '露蒂的玩具',
  'sword art online': '刀剑神域',
  'to love-ru': 'To LOVEる',
  'ro-kyu-bu': '萝球社',
  'tantei opera milky holmes': '侦探歌剧 少女福尔摩斯',
  'hyperdimension neptunia': '超次元游戏：海王星',
  'love live': 'Love Live!',
  'sora no otoshimono': '天降之物',
  'boku wa tomodachi ga sukunai': '我的朋友很少',
  'vocaloid': 'V家',
  'date a live': '约会大作战',
  'gochuumon wa usagi desu ka': '今天你也要来点兔子吗？',
  //角色
  'reimu hakurei': '博丽灵梦',
  'marisa kirisame': '雾雨魔理沙',
  'rumia': '露米娅',
  'cirno': '琪露诺',
  'daiyousei': '大妖精',
  'hong meiling': '红美铃',
  'patchouli knowledge': '帕秋莉·诺蕾姬',
  'koakuma': '小恶魔',
  'sakuya izayoi': '十六夜咲夜',
  'remilia scarlet': '蕾米莉亚·斯卡雷特',
  'flandre scarlet': '芙兰朵露·斯卡雷特',
  'letty whiterock': '蕾迪·霍瓦特罗克',
  'chen': '橙',
  'ink nijihara': '虹原茵可',
  'pastel ink': '闪亮茵可',
  //外观类
  'small breasts': '小胸部',
  'big breasts': '大胸部',
  'huge breasts': '超级大胸部',
  'pantyhose': '连裤袜',
  'stockings': '长筒袜',
  'bloomers': '灯笼裤',
  'glasses': '戴眼镜的',
  'exhibitionism': '暴露狂',
  'breast expansion': '乳房膨胀',
  'swimsuit': '泳装',
  'leotard': '紧身衣',
  'lingerie': '女用贴身内衣裤',
  'mind break': '精神受创',
  'ahegao': '高潮颜',
  'drunk': '喝醉了的',
  'kimono': '和服',
  'yukata': '浴衣',
  'school swimsuit': '死库水',
  'bikini': '比基尼',
  'apron': '围裙',
  'big ass': '大屁股',
  'collar': '项圈',
  'oppai loli': '巨乳萝莉',
  'tiara': '头饰',
  'crown': '皇冠',
  'fisting': '拳交',
  'garter belt': '吊带袜',
  'dark skin': '黑皮肤',
  'dougi': '各种武术类的服装',
  'butler': '带领结的燕尾服',
  'hotpants': '紧身短裤',
  'tracksuit': '运动服',
  'corset': '紧身胸衣',
  'latex': '橡胶衣物（紧身）',
  'big balls': '异常大的睾丸',
  'bandages': '绷带',
  'bbm': '胖男人',
  'lab coat': '实验室外套',
  'bike shorts': '自行车短裤',
  'thigh high boots': '长筒靴',
  'metal armor': '金属盔甲',
  'inverted nipples': '乳头凹陷',
  'human pet': '把人当成宠物来对待',
  'bunny girl': '兔女、兔女郎',
  'dog girl': '狗娘',
  'shimapan': '条纹胖次',
  'mecha girl': '机甲少女',
  'gothic lolita': '哥特萝莉',
  'business suit': '西装',
  'muscle': '肌肉',
  'monster girl': '怪物女孩',
  'eyemask': '眼罩',
  'living clothes': '家居服',
  'scrotal lingerie': '阴囊穿内衣',
  'sundress': '太阳裙(夏装)',
  'gymshorts': '拳击短裤',
  'sunglasses': '太阳镜',
  'fox girl': '狐娘',
  'chinese dress': '中国衣着（旗袍）',
  'minigirl': '迷你女孩',
  'invisible': '隐形人',
  'gyaru': '日式太妹（原宿风）',
  'schoolgirl uniform': '学校女生制服',
  'schoolboy uniform': '学校男生制服',
  'albino': '白化病',
  'bodysuit': '全包紧身衣',
  'tall man': '高男人',
  'anorexic': '厌食症',
  'masked face': '面具',
  'oil': '油覆盖皮肤',
  'chastity belt': '贞操带',
  'vaginal sticker': '阴部贴纸',
  'scar': '刀疤',
  //年龄、职业或身份类
  'sister': '姐姐或妹妹',
  'mother': '母亲',
  'father': '父亲',
  'brother': '哥哥或弟弟',
  'aunt': '阿姨',
  'uncle': '叔叔',
  'daughter': '女儿',
  'lolicon': '萝莉',
  'shotacon': '正太',
  'mature': '成熟的(通常指年纪较大的人)',
  'schoolgirl': '女学生',
  'schoolboy': '男学生',
  'maid': '女仆',
  'nurse': '护士',
  'teacher': '教师',
  'bride': '新娘',
  'princess': '公主',
  'nun': '修女',
  'vampire': '吸血鬼',
  'catgirl': '猫女',
  'catboy': '猫男',
  'dog': '狗',
  'interracial': '不同人种间的',
  'futanari': '扶她',
  'futanari on futanari': '扶她上扶她',
  'male on futanari': '男的上扶她',
  'futanari on male': '扶她上男的',
  'shemale': '人妖(后天的)',
  'gender bender': '跟异性的举动、打扮一样的人(伪娘或伪男)',
  'crossdressing': '穿异性服装(女装或男装)',
  'age regression': '返老还童',
  'virginity': '处女',
  'school boy': '男学生',
  'demon': '恶魔',
  'angel': '天使',
  'policewoman': '女警察',
  'miko': '巫女',
  'military': '军服',
  'milf': '熟女（30-50）',
  'harem': '后宫',
  'fairy': '仙女',
  'dilf': '大叔（30-50）',
  'magical girl': '马猴烧酒（魔法少女)',
  'elf': '精灵',
  'kunoichi': '女忍者',
  'witch': '女巫',
  'demon girl': '女妖',
  'twins': '双胞胎',
  'chikan': '痴汉',
  'old man': '老男人',
  'cousin': '堂[表]兄弟姊妹',
  'cheerleader': '拉拉队长',
  'tomboy': '女同假阳具',
  'valkyrie': '女武神',
  'stewardess': '女乘务员',
  'coach': '训练、教练',
  'voyeurism': '窥阴癖者',
  'yandere': '病娇',
  'unusual pupils': '不寻常的瞳孔',
  'snake girl': '蛇女',
  'tutor': '校外导师',
  'wolf girl': '狼女',
  //动作类
  'defloration': '上了处女',
  'bondage': '绑缚',
  'group': '群P',
  'discipline': '调教',
  'x-ray': '透视',
  'paizuri': '乳交',
  'multiple paizuri': '多人乳交',
  'blowjob': '口交',
  'footjob': '足交',
  'anal': '肛交',
  'enema': '灌肠',
  'rape': '强奸',
  'scat': '排泄',
  'pregnant': '怀孕中性行为',
  'birth': '分娩',
  'double penetration': '双洞插入',
  'lactation': '乳汁',
  'sex toys': '性玩具',
  'urination': '排尿',
  'armpit sex': '腋下性爱',
  'blindfold': '蒙住眼睛',
  'shibari': '绳缚',
  'masturbation': '自慰',
  'handjob': '手淫',
  'fingering': '用手指拨弄',
  'prostate massage': '前列腺按摩',
  'cum bath': '精液浴',
  'fisting': '拳交',
  'large insertions': '大的插入',
  'urethra insertion': '尿道插入',
  'necrophilia': '恋尸癖',
  'bukkake': '颜射',
  'gag': '塞口器',
  'piss drinking': '喝尿',
  'nakadashi': '中出',
  'deepthroat': '深喉',
  'swinging': '交换性伴侣',
  'blackmail': '性勒索',
  'tanlines': '晒黑的',
  'squirting': '潮吹',
  'chloroform': '迷药',
  'drugs': '药物（媚药）',
  'sleeping': '睡觉',
  'spanking': '被打屁股',
  'cunnilingus': '阴舔',
  'time stop': '时间停止',
  'dick growth': '阴茎生长',
  'selfcest': '自己X自己',
  'electric shocks': '电击',
  'body painting': '人体彩绘',
  'body writing': '人体写作',
  'ryona': '虐待',
  'piercing': '穿刺',
  'filming': '拍摄',
  'tribadism': '交叉体位（女同）',
  'hairjob': '发丝交',
  'sumata': '股间性交',
  'underwater': '水下',
  'leg lock': '夹腿',
  'rimjob': '舔肛',
  'kissing': '接吻',
  'double blowjob': '双人口交',
  'pegging': '女插男',
  'frottage': '摩擦淫',
  'pantyjob': '内裤交',
  'assjob': '屁股交',
  'triple penetration': '三人互插',
  'facesitting': '坐脸',
  'grandmother': '老奶奶',
  'table masturbation': '桌角自慰',
  'milking': '挤奶',
  'armpit licking': '腋下舔 ',
  'prolapse': '子宫脱垂',
  'orgasm denial': '拒绝高潮',
  'phone sex': '打电话性交',
  'whip': '鞭打',
  'big clit': '大阴蒂',
  'gaping': '张口的',
  'pillory': '枷刑',
  'tickling': '挠痒',
  'nose hook': '钩鼻子',
  'gokkun': '饮精',
  'foot licking': '舔足',
  'cum swap': '左右交换口交',
  'solo action': '独自愉悦',
  'emotionless sex': '性冷淡',
  'tailjob': '尾巴性交',
  'body modification': '身体改造',
  'brain fuck': '入脑性交',
  'dickgirl on dickgirl': '扶她上扶她',
  'male on dickgirl': '男的上扶她',
  'dickgirl on male': '扶她上男的',
  'ball sucking': '嘴吸蛋蛋',
  'sweating': '出汗',
  'smell': '嗅气味',
  'cbt': '鸡/蛋酷刑',
  //类型类
  'incest': '乱伦',
  'netorare': 'NTR',
  'guro': '猎奇',
  'yuri': '女同(GL)',
  'yaoi': '男同(BL)',
  'femdom': '女性支配',
  'original': '原创',
  'mind control': '精神控制',
  'body swap': '身体交换',
  'tentacles': '触手',
  'bestiality': '兽奸',
  'cheating': '出轨',
  'monster': '怪物',
  'wore': '丸吞',
  'inflation': '胃区膨胀',
  'unbirth': '从B钻出来',
  'skinsuit': '画皮（换皮）',
  'absorb': '融合（皮类常用标签）',
  'psssession': '占据（皮类常用标签）',
  'birth': '出产',
  'eggs': '生蛋',
  'furry': '毛皮',
  'worm': '虫子',
  'amputee': '残肢',
  'bbw': '丰满',
  'wings': '翅膀',
  'christmas': '圣诞服装',
  'waiter': '服务员',
  'waitress': '女服务员',
  'mmf threesome': '二男一女（3P）',
  'ffm threesome': '二女一男（3P）',
  'condom': '避孕套',
  'eyepatch': '眼罩',
  'multiple penises': '多个阴茎',
  'impregnation': '性行为后怀孕',
  'stomach deformation': '胃部突起',
  'tankoubon': '单行本',
  'machine': '性机器',
  'big penis': '大阴茎',
  'strap-on': '可连接的假阳具',
  'anthology': '选集（多个作者）',
  'full censorship': '全面体检',
  'leg locks': '脚锁',
  'art book': '画集',
  'full body tattoo': '纹身',
  'uncensored': '无码',
  'vomit': '呕吐物',
  'torture': '酷刑',
  'bdsm': 'SM',
  'tube': '管子',
  'wooden horse': '木马',
  'public use': '公众使用',
  'speculum': '窥器',
  'smegma': '包皮垢',
  'insect': '昆虫',
  'slime': '粘液',
  'huge penis': '巨大的阴茎',
  'zombie': '丧尸',
  'diaper': '尿布',
  'octopus': '章鱼',
  'onahole': '自慰器',
  'girls only': '只有女的',
  'guys only': '只有男的',
  'corruption': '腐朽（堕落？）',
  'blood': '血',
  'snuff': '死去',
  'animated': 'GIF动画的',
  'double vaginal': '双阴道的',
  'triple vaginal': '三阴道的',
  'slave': '奴隶',
  'doll': '玩偶',
  'gamecg': '游戏CG',
  'snake': '蛇',
  'incomplete': '不完整的',
  'all the way through': '一直走到底',
  'petrification': '石化',
  'transformation': '转化',
  'giantess': '女巨人',
  'ghost': '鬼魂',
  'asphyxiation': '窒息',
  'gasmask': '防毒面罩',
  'infantilism': '幼稚型',
  'parasite': '寄生虫',
  'horse': '马',
  'age progression': '年龄进展',
  'plant girl': '植物（怪物娘）',
  'slime girl': '史莱姆（怪物娘）',
  'themeless': '无主题的',
  'cervix penetration': '子宫颈透视',
  'prostitution': '卖淫 / 援交',
  'hairy': '多毛的',
  'robot': '机器人',
  'sole male': '男角唯一',
  'sole female': '女角唯一',
  'oni': '鬼（日本神话）',
  'females only': '只有女性',
  'low lolicon': '未通过萝莉控',
  'non-nude': '不色情',
  //重新分类
  'doujinshi': '同人本',
  'manga': '漫画杂志',
} /*要翻译的标签*/

var Div = document.querySelectorAll('.it5>a');
var Group_Artist_Array = new Array();
var Group_Array = new Array();
var Artist_Array = new Array();
var Doujinshi_Array = new Array();
var gidlist = new Array();
var gmetadata_all = new Array();
for (var i = 0; i < Div.length; i++) {
  if (Div[i].innerHTML.match(/\[.*?\]/)) {
    Group_Artist_Array[i] = Div[i].innerHTML.match(/\[.*?\]/) [0].replace('[', '').replace(']', '').toLowerCase();
    if (Group_Artist_Array[i].match(/\(.*?\)/)) {
      Group_Array[i] = Group_Artist_Array[i].replace(/ \(.*\)/, '');
      Artist_Array[i] = Group_Artist_Array[i].replace(Group_Array[i], '').replace(/ \((.*)\)/, '$1');
    } else {
      Group_Array[i] = Group_Artist_Array[i];
      Artist_Array[i] = '';
    }
  } else {
    Group_Array[i] = '';
    Artist_Array[i] = '';
  }
  if (Div[i].innerHTML.match(/\(.*?\)/)) {
    Doujinshi_Array[i] = Div[i].innerHTML.match(/\(.*?\)/g) [Div[i].innerHTML.match(/\(.*?\)/g).length - 1].replace('(', '').replace(')', '').toLowerCase().replace(/((?=[\x21-\x7e]+)[^A-Za-z0-9])/, ' ').replace(/ $/, '');
  } else {
    Doujinshi_Array[i] = '';
  }
  var url_array = Div[i].href.split('/');
  gidlist.push([url_array[4],
  url_array[5]])
  if (i == Div.length - 1) {
    xhr(gidlist);
    break;
  }
  if (i % 25 == 24) {
    xhr(gidlist);
    var gidlist = new Array();
  }
} /**/
//console.log(Group_Artist_Array);
//console.log(Group_Array);
//console.log(Artist_Array);
//console.log(Doujinshi_Array);

function xhr(gidlist) {
  var gdata = {
    'method': 'gdata',
    'gidlist': gidlist
  }
  var xhr = 'xhr_' + Math.random().toString();
  xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://g.e-hentai.org/api.php', true);
  xhr.onload = function () {
    var apirsp = JSON.parse(xhr.responseText);
    //console.log(apirsp['gmetadata']);
    TagPreview(apirsp['gmetadata']);
    HideGalleries();
  };
  xhr.send(JSON.stringify(gdata));
}
function TagPreview(gmetadata) {
  gmetadata_all = gmetadata_all.concat(gmetadata);
  //console.log(gmetadata_all)
  var Box = document.createElement('div');
  Box.id = 'TagPreview';
  var bgcolor;
  (window.location.host == 'g.e-hentai.org') ? bgcolor = '#E3E0D1' : bgcolor = '#34353B';
  Box.style = 'position:absolute;padding:5px;display:none;z-index:999;background-color:' + bgcolor + ';font-size:larger;width:250px;border-color:black;border-style:solid;';
  for (var i = 0; i < Div.length; i++) {
    Div[i].className = 'TagPreview_' + i;
    Div[i].onmousemove = function (event) {
      //console.log(gmetadata_all)
      var id = this.className.replace('TagPreview_', '');
      //console.log(gmetadata_all[id]);
      var tags = gmetadata_all[id].tags;
      for (var i = 0; i < tags.length; i++) {
        if (tags[i] in TagsChs) {
          tags[i] = TagsChs[tags[i]];
        }        //console.log(Doujinshi_Array[id]);

        if (tags[i] == Doujinshi_Array[id]) {
          tags[i] = '<span style="font-size:larger;color:yellow;">同人：' + tags[i] + '</span>';
          //console.log(tags[i]);
        }        //console.log(Group_Array[id]);

        if (tags[i] == Group_Array[id]) {
          tags[i] = '<span style="font-size:larger;color:blue;">组织：' + tags[i] + '</span>';
          //console.log(tags[i]);
        }        //console.log(Artist_Array[id]);

        if (tags[i] == Artist_Array[id]) {
          tags[i] = '<span style="font-size:larger;color:green;">漫画家：' + tags[i] + '</span>';
          //console.log(tags[i]);
        }
      }
      var tag = tags.join('_');
      var MousePos = getMousePos(event);
      //console.log(MousePos);
      Box.style.display = 'block';
      Box.style.left = eval(MousePos['x'] + 5) + 'px';
      Box.style.top = eval(MousePos['y'] + 5) + 'px';
      Box.innerHTML = '<div>' + gmetadata_all[id].title_jpn + '</div><div style="color:red">[' + eval(parseInt(gmetadata_all[id].filesize / 1024 / 1024)) + 'M]' + gmetadata_all[id].filecount + 'P</div>' + tag;
    }
    Div[i].onmouseout = function (event) {
      //Box.innerHTML = '';
      this.parentNode.parentNode.querySelector('.it2').style.visibility = 'hidden';
      if (event.buttons != 0) {
        setTimeout(function () {
          Box.style.display = 'none';
        }, 5000);
      } else {
        Box.style.display = 'none';
      }
    }
  }
  document.body.appendChild(Box);
}
function HideGalleries() {
  for (var i = 0; i < Div.length; i++) {
    var tags = gmetadata_all[i].tags;
    for (var n = 0; n < tags.length; n++) {
      if (tags[n] in UnlikeTags) {
        Div[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
      }
    }
  }
}
function getMousePos(event) {
  var e = event || window.event;
  var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
  var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
  var x = e.pageX || e.clientX + scrollX;
  var y = e.pageY || e.clientY + scrollY;
  //alert('x: ' + x + '\ny: ' + y);
  return {
    'x': x,
    'y': y
  };
}
