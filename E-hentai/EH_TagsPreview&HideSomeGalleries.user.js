// ==UserScript==
// @name        EH_TagsPreview&HideSomeGalleries
// @name:zh-CN  【EH】标签预览+隐藏画集
// @author      Dodying
// @namespace   https://github.com/dodying/Dodying-UserJs
// @supportURL  https://github.com/dodying/Dodying-UserJs/issues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @description 移动到画廊上可预览标签，同时如果标签里有不喜欢的标签则会隐藏该画集
// @description:zh-CN 移动到画廊上可预览标签，同时如果标签里有不喜欢的标签则会隐藏该画集
// @include     http*://exhentai.org/*
// @include     http*://e-hentai.org/*
// @exclude     http*://exhentai.org/g/*
// @exclude     http*://e-hentai.org/g/*
// @exclude     http*://exhentai.org/s/*
// @exclude     http*://e-hentai.org/s/*
// @version     1.1.0
// @grant       none
// @run-at      document-idle
// ==/UserScript==
var $ = function (e) {
  return document.querySelector(e);
}
var $$ = function (e) {
  return document.querySelectorAll(e);
}
var $_ = function (e) {
  return document.createElement(e);
}
var inArray = function (key, array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] === key) return true;
  }
  return false;
}
var CONFIG = {
  UNLIKE: {
    'females only': '只有女性',
    'males only': '只有男性',
    'vore': '活吞',
    'guro': '猎奇',
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
    'giantess': '女巨人',
    'novel': '小说'
  },
  ALERT: {
    'tentacles': '触手',
    'crossdressing': '异性装',
    'yaoi': '男同',
    'yuri': '女同',
    'netorare': 'NTR',
    'scat': '排泄',
    'animated': 'Gif'
  },
  CHS: (function () {
    return JSON.parse('{"language":{"albanian":"阿尔巴尼亚语","arabic":"阿拉伯语","bengali":"孟加拉语","catalan":"加泰罗尼亚语","chinese":"中国语","czech":"捷克语","danish":"丹麦语","dutch":"荷兰语","english":"英语","esperanto":"世界语","estonian":"爱沙尼亚语","finnish":"芬兰语","french":"法语","german":"德语","greek":"希腊语","hebrew":"希伯来语","hindi":"印地语","hungarian":"匈牙利语","indonesian":"印度尼西亚语","italian":"意大利语","japanese":"日语","korean":"朝鲜语","mongolian":"蒙古语","norwegian":"挪威语","polish":"波兰语","portuguese":"葡萄牙语","romanian":"罗马尼亚语","russian":"俄语","slovak":"斯洛伐克语","slovenian":"斯洛文尼亚语","spanish":"西班牙语","swedish":"瑞典语","tagalog":"菲律宾语","thai":"泰语","turkish":"土耳其语","ukrainian":"乌克兰语","vietnamese":"越南语","speechless":"无言的","text cleaned":"文字清除","translated":"翻译版","rewrite":"已重写"},"reclass":{"gamecg":"游戏CG集","artistcg":"画师图集","asianporn":"亚洲色情","cosplay":"Cosplay","parody":"同人志","imageset":"图片集","manga":"漫画","misc":"杂项","non-h":"无H","western":"西方的","private":"私人的"},"artist":{"pop":"POP","oouso":"大嘘","peko":"ぺこ","akaza":"あかざ","ishikei":"石惠","endou hiroto":"遠藤弘土","happoubi jin":"八宝備仁","fujisaki hikari":"藤崎ひかり","ichiri":"イチリ","satou kibi":"さとうきび","nanpuu":"なんぷぅ","yukiu con":"雪雨こん","land sale":"蘭戸せる","emily":"emily","chiri":"ちり","kantoku":"监督","sayori":"Sayori","ideolo":"ideolo","miyahara ayumu":"宮原歩","nishikawa kou":"西川康","narusawa kei":"なるさわ景","akatsuki myuuto":"赤月みゅうと","kisaragi gunma":"如月群真","ohtomo takuji":"大友卓二","yamada no seikatu ga daiichi":"山田の性活が第一","asamura hiori":"朝叢志描","matsukawa":"松河","mmm":"えむ","facominn":"Facominn","great mosu":"ぐれーともす","ringo sui":"りんご水","kanzaki muyu":"神崎むゆ","mizuyan":"みずやん","ranyues":"仴","horonamin":"ホロナミン","chiyami":"ちやみ","hanahanamaki":"花花捲","sousouman":"草草饅","muk":"MUK","ore p 1-gou":"俺P1号","menyoujan":"めんようじゃん","hodumi kaoru":"八月朔日珈瑠","watsuki rumi":"わつきるみ","soramoti":"そらモチ","blastbeat":"BLASTBEAT","takashina at masato":"高階@聖人","shibayuki":"しばゆき","newmen":"NeWMeN","miyasaka miyu":"宮坂みゆ","shimahara":"40原","hayakawa akari":"早川あかり","masaharu":"まさはる","ail":"あいる","saigado":"彩画堂","nanase meruchi":"ななせめるち","marushin":"丸新","amamiya mizuki":"雨宮ミズキ","mibu natsuki":"みぶなつき"},"group":{"electromagneticwave":"ElectromagneticWave","usotsukiya":"嘘つき屋","archetype":"ARCHETYPE","afterschool of the 5th year":"5年目の放課後","tsf no f":"TSF的F","number2":"Number2","softhouse-seal":"softhouse-seal","devil-seal":"Devil-seal","softhouse-seal grandee":"softhouse-seal GRANDEE","reverse":"Re:verse","moonstone":"MOONSTONE","moonstone cherry":"MOONSTONE Cherry","yuzu soft":"Yuzu-Soft","leaf":"Leaf","key":"Key","alcot":"ALcot","alcot honey comb":"ALcot Honey Comb","softstar":"大宇资讯","dmm.com":"DMM.com"},"parody":{"touhou project":"东方Project","moetan":"萌单","clannad":"CLANNAD","angel beats":"Angel Beats!","charlotte":"Charlotte","ore no imouto ga konna ni kawaii wake ga nai":"我的妹妹不可能那么可爱","toaru majutsu no index":"魔法禁书目录","toaru kagaku no railgun":"某科学的超电磁炮","kantai collection":"舰队Collection","pokemon":"精灵宝可梦","higurashi no naku koro ni":"寒蝉鸣泣之时","saki":"天才麻将少女","puella magi madoka magica":"魔法少女小圆","toradora":"龙与虎","lotte no omocha":"露蒂的玩具","sword art online":"刀剑神域","to love-ru":"出包王女","ro-kyu-bu":"萝球社","tantei opera milky holmes":"侦探歌剧 少女福尔摩斯","hyperdimension neptunia":"超次元游戏：海王星","love live":"LoveLive!","love live sunshine":"Love Live! Sunshine!!","sora no otoshimono":"天降之物","boku wa tomodachi ga sukunai":"我的朋友很少","vocaloid":"VOCALOID","date a live":"约会大作战","the idolmaster":"偶像大师","my little pony friendship is magic":"小马宝莉：友谊就是魔法","himouto umaru-chan":"干物妹！小埋","bakemonogatari":"化物语","yahari ore no seishun love come wa machigatteiru":"我的青春恋爱物语果然有问题","tengen toppa gurren lagann":"天元突破","cardcaptor sakura":"魔卡少女樱","mayoi neko overrun":"迷途猫","outbreak company":"萌萌侵略者","kyoukai no kanata":"境界的彼方","hataraku maou-sama":"打工吧！魔王大人","haiyore nyaruko-san":"潜行吧！奈亚子","hentai ouji to warawanai neko":"变态王子与不笑猫","nagi no asukara":"来自风平浪静的明天","sekai seifuku bouryaku no zvezda":"世界征服～谋略之星～","no game no life":"游戏人生","barakamon":"元气囝仔","divine gate":"神圣之门","sayonara zetsubou sensei":"再见！绝望先生","highschool of the dead":"学园默示录","gakkou gurashi":"学园孤岛","a channel":"A频道","granblue fantasy":"宏蓝幻想","gundam":"高达","gundam age":"机动战士高达AGE","gundam 00":"机动战士高达00","gundam 0080":"机动战士高达0080 口袋里的战争","gundam 0083":"机动战士高达0083 星尘回忆录","gundam unicorn":"机动战士高达UC","gundam f91":"机动战士高达F91","gundam seed":"机动战士高达SEED","gundam seed destiny":"机动战士高达SEED DESTINY","gundam zz":"机动战士高达ZZ","mobile suit gundam":"机动战士高达","mobile suit gundam lost war chronicles":"机动战士高达战记 Lost War Chronicles","mobile suit gundam tekketsu no orphans":"机动战士高达 铁血的孤儿","gundam wing":"新机动战记高达W","crossbone gundam":"机动战士海盗高达","gundam build fighters":"高达创战者","gundam build fighters try":"高达创战者TRY","gundam g no reconguista":"高达G之复国运动","gundam x":"机动新世纪高达X","victory gundam":"机动战士V高达","zeta gundam":"机动战士Z高达","g gundam":"机动武斗传G高达","turn a gundam":"?高达","kiniro mosaic":"黄金拼图","gochuumon wa usagi desu ka":"请问您今天要来点兔子吗？","non non biyori":"悠哉日常大王","oda nobuna no yabou":"织田信奈的野望","tamako market":"玉子市场","yama no susume":"前进吧！登山少女","pripara":"美妙天堂","sora no method":"天体的秩序","accel world":"加速世界","dungeon ni deai o motomeru no wa machigatteiru darou ka":"在地下城寻求邂逅是否搞错了什么","c cube":"C3-魔方少女","shingeki no kyojin":"进击的巨人","onidere":"鬼骄","infinite stratos":"无限斯特拉托斯","disgaea":"魔界战记","chuunibyou demo koi ga shitai":"中二病也要谈恋爱！","ano hi mita hana no namae wo bokutachi wa mada shiranai":"我们仍未知道那天所看见的花的名字。","amagi brilliant park":"甘城光辉游乐园","hidan no aria":"绯弹的亚莉亚","steinsgate":"命运石之门","lucky star":"幸运星","zero no tsukaima":"零之使魔","shakugan no shana":"灼眼的夏娜","the melancholy of haruhi suzumiya":"凉宫春日的忧郁","kannagi":"神薙","kashimashi":"女生爱女生","toheart2":"ToHeart2","k-on":"轻音少女","he is my master":"我的主人","code geass":"叛逆的鲁鲁修","naruto":"火影忍者","school rumble":"校园迷糊大王","mahou sensei negima":"魔法老师","neon genesis evangelion":"新世纪福音战士","hidamari sketch":"向阳素描","mahou shoujo lyrical nanoha":"魔法少女奈叶","rosario vampire":"十字架与吸血鬼","pretty cure":"光之美少女","pretty cure splash star":"光之美少女Splash Star","yes precure 5":"Yes! 光之美少女5","fresh precure":"Fresh 光之美少女!","heartcatch precure":"Heartcatch 光之美少女!","suite precure":"Suite 光之美少女?","smile precure":"Smile 光之美少女!","dokidoki precure":"心跳！光之美少女","happinesscharge precure":"Happiness Charge 光之美少女!","go princess precure":"Go! Princess 光之美少女","maho girls precure":"魔法使 光之美少女!","kirakira precure a la mode":"KiraKira☆光之美少女A La Mode","jojos bizarre adventure":"JOJO的奇妙冒险","pangya":"魔法飞球","shokugeki no soma":"食戟之灵","working":"迷糊餐厅","kono subarashii sekai ni syukufuku o":"为美好的世界献上祝福！","ore no kanojo to osananajimi ga shuraba sugiru":"我女友与青梅竹马的惨烈修罗场","ore no nounai sentakushi ga gakuen love comedy wo zenryoku de jama shiteiru":"我的脑内恋碍选项","overwatch":"守望先锋","halo":"光环","mass effect":"质量效应","half-life":"半衰期","portal":"传送门","the witcher":"巫师","the elder scrolls":"上古卷轴","defense of the ancients":"刀塔","re zero kara hajimeru isekai seikatsu":"Re：从零开始的异世界生活","saenai heroine no sodatekata":"路人女主的养成方法","koihime musou":"恋姬?无双","senran kagura":"闪乱神乐","kobayashi-san-chi no maid dragon":"小林家的龙女仆","new game":"NEW GAME!","shirobako":"白箱","girlish number":"少女编号","rewrite":"Rewrite","gabriel dropout":"珈百璃的堕落","chobits":"人形电脑天使心","dead or alive":"死或生","eromanga sensei":"埃罗芒阿老师","dorei to no seikatsu":"与奴隶的生活 -Teaching Feeling-","girls und panzer":"少女与战车","seto no hanayome":"濑户的花嫁","brave witches":"无畏魔女","strike witches":"强袭魔女","kemono friends":"兽娘动物园","league of legends":"英雄联盟","kill la kill":"斩服少女","dagashi kashi":"粗点心战争","street fighter":"街头霸王","fate grand order":"Fate/Grand Order","fate stay night":"Fate/stay night","fate apocrypha":"Fate/Apocrypha","fate zero":"Fate/Zero","fate hollow ataraxia":"Fate/hollow ataraxia","fate extra":"Fate/EXTRA","fate kaleid liner prisma illya":"Fate/kaleid liner 魔法少女☆伊莉雅","kimi no na wa.":"你的名字。","mashiro iro symphony":"纯白交响曲","dragon quest":"勇者斗恶龙","dragon quest i":"勇者斗恶龙I","dragon quest ii":"勇者斗恶龙II 恶灵的众神","dragon quest iii":"勇者斗恶龙III 传说的开始","dragon quest iv":"勇者斗恶龙IV 被引导的人们","dragon quest v":"勇者斗恶龙V 天空的新娘","dragon quest vi":"勇者斗恶龙VI 幻之大地","dragon quest vii":"勇者斗恶龙VII 伊甸的战士们","dragon quest viii":"勇者斗恶龙VIII 天空、碧海、大地与被诅咒的公主","dragon quest ix":"勇者斗恶龙IX 星空的守护者","dragon quest x":"勇者斗恶龙X 觉醒的五种族 Online","dragon quest dai no daibouken":"勇者斗恶龙 达尔大冒险","dragon quest monsters":"勇者斗恶龙怪兽篇","left 4 dead":"求生之路","bloodrayne":"吸血莱恩","star wars":"星球大战","persona":"女神异闻录","persona 2":"女神异闻录2","persona 3":"女神异闻录3","persona 4":"女神异闻录4","persona 5":"女神异闻录5","monsters inc.":"怪兽电力公司","hai to gensou no grimgar":"灰与幻想的格林姆迦尔","pretty rhythm":"美妙旋律","mamono musume zukan":"魔物娘图鉴","getsuyoubi no tawawa":"星期一的丰满","phantasy star":"梦幻之星","phantasy star 2":"梦幻之星II 不归的终点","phantasy star online":"梦幻之星Online","phantasy star online 2":"梦幻之星Online 2","phantasy star portable 2":"梦幻之星：携带版2","phantasy star universe":"梦幻之星 宇宙","phantasy star zero":"梦幻之星ZERO","arms":"ARMS","astro boy":"铁臂阿童木","detective conan":"名侦探柯南","ore twintail ni narimasu.":"我，要成为双马尾","kiss x sis":"亲吻姐姐","kimikiss":"君吻","super sonico":"超级索尼子","final fantasy":"最终幻想","final fantasy ii":"最终幻想II","final fantasy iii":"最终幻想III","final fantasy iv":"最终幻想IV","final fantasy v":"最终幻想V","final fantasy vi":"最终幻想VI","final fantasy vii":"最终幻想VII","final fantasy viii":"最终幻想VIII","final fantasy ix":"最终幻想IX","final fantasy x":"最终幻想X","final fantasy x-2":"最终幻想X-2","final fantasy xi":"最终幻想XI","final fantasy xii":"最终幻想XII","final fantasy xiii":"最终幻想XIII","final fantasy xiv":"最终幻想XIV","final fantasy xv":"最终幻想XV","final fantasy crystal chronicles":"最终幻想水晶编年史","final fantasy tactics":"最终幻想战略版","final fantasy tactics advance":"最终幻想战略版Advance","dissidia final fantasy":"最终幻想大乱斗","final fantasy unlimited":"最终幻想：无限","final fantasy type-0":"最终幻想 零式","kill me baby":"爱杀宝贝","shinryaku ika musume":"侵略！乌贼娘","one piece":"海贼王","dragon ball":"龙珠","dragon ball z":"龙珠Z","dragon ball gt":"龙珠GT","dragon ball super":"龙珠超","sakurasou no pet na kanojo":"樱花庄的宠物女孩","myriad colors phantom world":"无彩限的怪灵世界","soul eater":"噬魂师","urara meirochou":"Urara迷路帖","ranma 12":"乱马?","yosuga no sora":"缘之空","little busters":"Little Busters!","fire emblem if":"火焰之纹章if","fire emblem":"火焰之纹章","gintama":"银魂","panty and stocking with garterbelt":"吊带袜天使","kamen rider":"假面骑士","kamen rider decade":"假面骑士Decade","kamen rider amazon":"假面骑士亚马逊","kamen rider wizard":"假面骑士Wizard","kamen rider w":"假面骑士W","kamen rider double":"假面骑士W","kamen rider hibiki":"假面骑士响鬼","kamen rider kabuto":"假面骑士Kabuto","kamen rider den-o":"假面骑士电王","kamen rider fourze":"假面骑士Fourze","kamen rider ooo":"假面骑士OOO","kamen rider 555":"假面骑士555","kamen rider shin":"真·假面骑士","kaiji":"赌博默示录","my hero academia":"我的英雄学院","shinmai maou no testament":"新妹魔王的契约者","youjo senki":"幼女战记","touken ranbu":"刀剑乱舞","teen titans":"少年泰坦","undertale":"传说之下","five nights at freddys":"在弗雷迪的五个夜晚","one punch man":"一拳超人","black rock shooter":"黑岩射手","dragons crown":"龙之皇冠","noir":"黑街二人组","guilty crown":"罪恶王冠","nana":"娜娜","nier":"尼尔","psycho-pass":"心理测量者","ben 10":"少年骇客","hey arnold":"嘿，阿诺德！","bungou stray dogs":"文豪Stray Dogs","gugure kokkuri-san":"银仙","zootopia":"疯狂动物城","umineko no naku koro ni":"海猫鸣泣之时","ah my goddess":"我的女神","denpa onna to seishun otoko":"电波女与青春男","mirai nikki":"未来日记","oshiete galko-chan":"告诉我！辣妹子酱","eureka 7":"交响诗篇","darkstalkers":"恶魔战士","x-men":"X战警","ichigo 100":"草莓100%","tonari no kaibutsu-kun":"邻座的怪同学","danganronpa":"弹丸论破","koutetsujou no kabaneri":"甲铁城的卡巴内利","yu-gi-oh":"游戏王","kimi ni todoke":"好想告诉你","akatsuki no yona":"晨曦公主","onii-chan dakedo ai sae areba kankeinai yo ne":"就算是哥哥，有爱就没问题了，对吧","oniichan no koto nanka zenzen suki janain dakara ne":"腹黑妹妹控兄记!!","sora no woto":"空之音","occult academy":"世纪末超自然学院","gatchaman crowds":"科学小飞侠Crowds","saya no uta":"沙耶之歌","vividred operation":"绯色战姬","kodomo no jikan":"萝莉的时间","shuffle":"Shuffle!","power rangers":"超能战士","rune soldier":"魔法战士李维","kirby":"星之卡比","sakura quest":"樱花任务","aldnoah.zero":"ALDNOAH.ZERO","maoyuu maou yuusha":"魔王勇者","splatoon":"喷射美少女","prunus girl":"樱桃少女","king of fighters":"拳皇","love plus":"爱相随","love hina":"纯情房东俏房客","akagami no shirayukihime":"赤发的白雪姬","minami-ke":"南家三姐妹","queens blade":"女王之刃","sekirei":"鹦鹉女神","yuuki yuuna wa yuusha de aru":"结城友奈是勇者","blazblue":"苍翼默示录","frame arms girl":"机甲少女","busou shinki":"武装神姬","bayonetta":"猎天使魔女","devil may cry":"鬼泣","tekken":"铁拳","super mario brothers":"超级马里奥兄弟","spider-man":"蜘蛛侠","gunsmith cats":"猫眼女枪手","puzzle and dragons":"智龙迷城","senki zesshou symphogear":"战姬绝唱Symphogear","shaman king":"通灵王","gegege no kitarou":"怪怪怪的鬼太郎","marmalade boy":"橘子酱男孩","esper mami":"超能力魔美","fushigi no umi no nadia":"蓝宝石之谜","martian successor nadesico":"机动战舰抚子","kino no tabi":"奇诺之旅","infinite ryvius":"无限的未知","machine robo":"天威勇士","rage of bahamut":"巴哈姆特之怒","kono naka ni hitori imouto ga iru":"其中1个是妹妹","sailor moon":"美少女战士","dog days":"犬勇者物语","onegai teacher":"拜托了☆老师","rinne no lagrange":"轮回的拉格朗日","monster musume no iru nichijou":"魔物娘的相伴日常","black lagoon":"黑礁","steven universe":"史帝芬宇宙","the legend of zelda":"塞尔达传说","totally spies":"少女特工组","the legend of korra":"科拉传奇","kangoku senkan":"监狱战舰","prison school":"监狱学园","macross":"超时空要塞","the super dimension fortress macross":"超时空要塞Macross","macross frontier":"超时空要塞F","macross 7":"超时空要塞7","macross delta":"超时空要塞Δ","macross zero":"超时空要塞Zero","little red riding hood":"小红帽","tales of vesperia":"薄暮传说","gekkan shoujo nozaki-kun":"月刊少女野崎君","girl friend beta":"临时女友","bakuman":"食梦者","gate - jietai kano chi nite kaku tatakaeri":"GATE奇幻自卫队","nisekoi":"伪恋","blade and soul":"剑灵","inu x boku ss":"妖狐×仆SS","guilty gear":"罪恶装备","nanatsu no taizai":"七大罪","starcraft":"星际争霸","alice in wonderland":"爱丽丝梦游仙境","ikkitousen":"一骑当千","g.i. joe":"特种部队","metroid":"银河战士","metal gear solid":"合金装备","tomb raider":"古墓丽影","xena warrior princess":"战士公主西娜","the fifth element":"第五元素","terminator":"终结者","yurikuma arashi":"百合熊风暴","adventure time":"探险时光","strike the blood":"噬血狂袭"},"character":{"chitose":"千岁","murakumo":"丛 | 丛云","nachi":"那智","kagura":"神乐","ink nijihara":"虹原茵可","pastel ink":"闪亮茵可","flandre scarlet":"芙兰朵露·斯卡雷特","alice margatroid":"爱丽丝·玛格特洛依德","reimu hakurei":"博丽灵梦","marisa kirisame":"雾雨魔理沙","rumia":"露米娅","cirno":"琪露诺","daiyousei":"大妖精","hong meiling":"红美铃","patchouli knowledge":"帕秋莉·诺蕾姬","koakuma":"小恶魔","sakuya izayoi":"十六夜咲夜","remilia scarlet":"蕾米莉亚·斯卡雷特","letty whiterock":"蕾迪·霍瓦特罗克","chen":"橙","eirin yagokoro":"八意永琳","kanako yasaka":"八坂神奈子","reisen udongein inaba":"铃仙·优昙华院·因幡","rin kaenbyou":"火焰猫燐","satori komeiji":"古明地觉","suwako moriya":"洩矢诹访子","youmu konpaku":"魂魄妖梦","yuyuko saigyouji":"西行寺幽幽子","nitori kawashiro":"河城荷取","byakuren hijiri":"圣白莲","aya shameimaru":"射命丸文","tenshi hinanai":"比那名居天子","wriggle nightbug":"莉格露·奈特巴格","yuuka kazami":"风见幽香","nue houjuu":"封兽鵺","komachi onozuka":"小野塚小町","shikieiki yamaxanadu":"四季映姬·亚玛萨那度","keine kamishirasawa":"上白泽慧音","yukari yakumo":"八云紫","ran yakumo":"八云蓝","fujiwara no mokou":"藤原妹红","kaguya houraisan":"蓬莱山辉夜","mystia lorelei":"米斯蒂娅·萝蕾拉","sanae kochiya":"东风谷早苗","hina kagiyama":"键山雏","shanghai":"上海(人形)","hourai":"蓬莱(人形)","medicine melancholy":"梅蒂欣·梅兰可莉","shinki":"神绮","yumemi okazaki":"冈崎梦美","mima":"魅魔","hata no kokoro":"秦心","junko":"纯狐","kyouko kasodani":"幽谷响子","koishi komeiji":"古明地恋","seija kijin":"鬼人正邪","clownpiece":"克劳恩皮丝","benben tsukumo":"九十九弁弁","yatsuhashi tsukumo":"九十九八桥","kagerou imaizumi":"今泉影狼","raiko horikawa":"堀川雷鼓","sekibanki":"赤蛮奇","shinmyoumaru sukuna":"少名针妙丸","wakasagihime":"若鹭姬","luna child":"露娜切露德","star sapphire":"斯塔萨菲雅","sunny milk":"桑尼米尔克","nazrin":"纳兹琳","hieda no akyuu":"稗田阿求","kosuzu motoori":"本居小铃","momiji inubashiri":"犬走椛","mamizou futatsuiwa":"二岩猯藏","toyosatomimi no miko":"丰聪耳神子","tewi inaba":"因幡帝","parsee mizuhashi":"水桥帕露西","renko usami":"宇佐见莲子","utsuho reiuji":"灵乌路空","honoka kousaka":"高坂穗乃果","yukiho kousaka":"高坂雪穗","eri ayase":"绚濑绘里","arisa ayase":"绚濑亚里沙","kotori minami":"南小鸟","umi sonoda":"园田海未","rin hoshizora":"星空凛","maki nishikino":"西木野真姬","nozomi toujou":"东条希","hanayo koizumi":"小泉花阳","nico yazawa":"矢泽妮可","tsubasa kira":"绮罗翼","erena toudou":"统堂英玲奈","anju yuuki":"优木杏树","chika takami":"高海千歌","riko sakurauchi":"樱内梨子","kanan matsuura":"松浦果南","dia kurosawa":"黑泽黛雅","you watanabe":"渡边曜","yoshiko tsushima":"津岛善子","hanamaru kunikida":"国木田花丸","mari ohara":"小原鞠莉","ruby kurosawa":"黑泽露比","teitoku":"提督","nagato":"长门","mutsu":"陆奥","yukikaze":"雪风","akagi":"赤城","kaga":"加贺","souryuu":"苍龙","hiryuu":"飞龙","shimakaze":"岛风","fubuki":"吹雪","shirayuki":"白雪","ooi":"大井","kitakami":"北上","kongou":"金刚","hiei":"比睿","haruna":"榛名","kirishima":"雾岛","houshou":"凤翔","tenryuu":"天龙","tatsuta":"龙田","ryuujou":"龙骧","chiyoda":"千代田","myoukou":"妙高","ashigara":"足柄","haguro":"羽黑","takao":"高雄","atago":"爱宕","maya":"摩耶","tone":"利根","chikuma":"筑摩","junyou":"隼鹰","akebono":"曙","akatsuki":"晓","hibiki":"响","ikazuchi":"雷","inazuma":"电","hatsuharu":"初春","nenohi":"子日","shigure":"时雨","yuudachi":"夕立","samidare":"五月雨","asashio":"朝潮","shiranui":"不知火","shoukaku":"翔鹤","zuikaku":"瑞鹤","yuubari":"夕张","zuihou":"瑞凤","hatsukaze":"初风","i-19":"伊19","suzuya":"铃谷","kumano":"熊野","i-168":"伊168","i-58":"伊58","i-8":"伊8","yamato":"大和","agano":"阿贺野","noshiro":"能代","yahagi":"矢矧","musashi":"武藏","verniy":"Верный(响改二)","taihou":"大凤","katori":"香取","i-401":"伊401","maruyu":"まるゆ","isokaze":"矶风","urakaze":"浦风","hamakaze":"滨风","bismarck":"俾斯麦","z1":"Z1","z3":"Z3","prinz eugen":"欧根亲王","amatsukaze":"天津风","akashi":"明石","ooyodo":"大淀","tokitsukaze":"时津风","harusame":"春雨","graf zeppelin":"齐柏林伯爵","ro-500":"吕500","kashima":"鹿岛","hoppou seiki":"北方栖姬","wo-class":"ヲ级(wo酱)","producer":"制作人","haruka amami":"天海春香","chihaya kisaragi":"如月千早","yukiho hagiwara":"萩原雪步","yayoi takatsuki":"高槻弥生","kasumi takatsuki":"高槻霞","ritsuko akizuki":"秋月律子","azusa miura":"三浦梓","iori minase":"水濑伊织","makoto kikuchi":"菊地真","ami futami":"双海亚美","mami futami":"双海真美","miki hoshii":"星井美希","hibiki ganaha":"我那霸响","takane shijou":"四条贵音","kotori otonashi":"音无小鸟","ai hidaka":"日高爱","mai hidaka":"日高舞","eri mizutani":"水谷绘理","ryo akizuki":"秋月凉","uzuki shimamura":"岛村卯月","yukari mizumoto":"水本紫","kanako mimura":"三村加奈子","miho kohinata":"小日向美穗","chieri ogata":"绪方智绘里","kyoko igarashi":"五十岚响子","momoka sakurai":"樱井桃华","miku maekawa":"前川未来","frederica miyamoto":"宫本芙蕾德莉卡","anzu futaba":"双叶杏","sachiko koshimizu":"舆水幸子","nana abe":"安部菜菜","akiha ikebukuro":"池袋晶叶","mayu sakuma":"佐久间麻由","rina fujimoto":"藤本里奈","hotaru shiragiku":"白菊萤","kozue yusa":"游佐梢","kurumi ohnuma":"大沼胡桃","shiki ichinose":"一之濑志希","yuuki otokura":"乙仓悠贵","rin shibuya":"涩谷凛","mizuki kawashima":"川岛瑞树","nao kamiya":"神谷奈绪","riina tada":"多田李衣菜","chie sasaki":"佐佐木千枝","miyu mifune":"三船美优","manami kiba":"木场真奈美","helen":"海伦","kaede takagaki":"高垣枫","ranko kanzaki":"神崎兰子","karen hojo":"北条加莲","kako takafuji":"鹰富士茄子","koume shirasaka":"白坂小梅","syuko shiomi":"盐见周子","minami nitta":"新田美波","kanade hayami":"速水奏","arisu tachibana":"橘爱丽丝","nono morikubo":"森久保乃乃","anastasia":"安娜斯塔西娅","fumika sagisawa":"鹭泽文香","layla":"莱拉","asuka ninomiya":"二宫飞鸟","nanami asari":"浅利七海","mio honda":"本田未央","aiko takamori":"高森蓝子","kaoru ryuzaki":"龙崎薰","miria akagi":"赤城米莉亚","yui ootsuki":"大槻唯","shizuku oikawa":"及川雫","yumi aiba":"相叶夕美","mika jougasaki":"城崎美嘉","rika jougasaki":"城崎莉嘉","akane hino":"日野茜","kirari moroboshi":"诸星琪拉莉","airi totoki":"十时爱梨","natalia":"娜塔莉亚","takumi mukai":"向井拓海","nina ichihara":"市原仁奈","syoko hoshi":"星辉子","ako tsuchiya":"土屋亚子","sanae katagiri":"片桐早苗","risa matoba":"的场梨沙","tokiko zaizen":"财前时子","yoshino yorita":"依田芳乃","chihiro senkawa":"千川千寻","konomi baba":"马场木实","mishiro":"美城常务","touma amagase":"天濑冬马","teru tendo":"天道辉","minori watanabe":"渡边实","shiki iseya":"伊濑谷四季","hayato akiyama":"秋山隼人","saki mizushima":"水岛咲","shiro tachibana":"橘志狼","hokuto ijuuin":"伊集院北斗","kaoru sakuraba":"樱庭薫","rei kagura":"神乐丽","kyoji takajo":"鹰城恭二","kyosuke aoi":"苍井享介","jun fuyumi":"冬美旬","natsuki sakaki":"榊夏来","nao okamura":"冈村直央","shouta mitarai":"御手洗翔太","tsubasa kashiwagi":"柏木翼","kei tsuzuki":"都筑圭","pierre":"皮埃尔","yusuke aoi":"苍井悠介","haruna wakazato":"若里春名","makio uzuki":"卯月卷绪","kanon himeno":"姬野花音","apple bloom":"小萍花","big macintosh":"大麦哥","applejack":"苹果杰克","fluttershy":"小蝶","pinkie pie":"萍琪·派","rainbow dash":"云宝黛茜","rarity":"瑞瑞","twilight sparkle":"暮光闪闪","asuna yuuki":"结城明日奈","bell cranel":"贝尔·克朗尼","hestia":"赫斯缇雅","aqua":"阿库娅","megumin":"惠惠","kazuma satou":"佐藤和真","darkness":"达克妮丝","yunyun":"悠悠","wiz":"维兹","chris":"克莉丝","kokoa hoto":"保登心爱","chino kafuu":"香风智乃","rize tedeza":"天天座理世","chiya ujimatsu":"宇治松千夜","sharo kirima":"桐间纱路","maya jouga":"条河麻耶","megumi natsu":"奈津惠","mocha hoto":"保登摩卡","chocolat":"裘可拉","ayame reikadou":"丽华堂绚女","oka yuoji":"游王子讴歌","furano yukihira":"雪平富良野","chiwa harusaki":"春咲千和","eita kidou":"季堂锐太","masuzu natsukawa":"夏川真凉","himeka akishino":"秋篠姬香","ai fuyuumi":"冬海爱衣","kyousuke kousaka":"高坂京介","kirino kousaka":"高坂桐乃","ruri gokou":"五更琉璃（黑猫）","ayase aragaki":"新垣绫濑","saori makishima":"槙岛沙织（沙织·巴吉纳）","kanako kurusu":"来栖加奈子","bridget evans":"布莉姬·伊凡斯","sena akagi":"赤城濑菜","kouhei akagi":"赤城浩平","manami tamura":"田村麻奈实","daisuke kousaka":"高坂大介","tamaki gokou":"五更珠希","hinata gokou":"五更日向","azusa nakano":"中野梓","jun suzuki":"铃木纯","mio akiyama":"秋山澪","ritsu tainaka":"田井中律","sawako yamanaka":"山中佐和子","tsumugi kotobuki":"琴吹?","ui hirasawa":"平泽忧","yui hirasawa":"平泽唯","nodoka manabe":"真锅和","satoshi tainaka":"田井中聪","sumire saitou":"齐藤堇","megumi sokabe":"曾我部惠","yui yuigahama":"由比滨结衣","hachiman hikigaya":"比企谷八幡","yukino yukinoshita":"雪之下雪乃","iroha isshiki":"一色彩羽","hayato hayama":"叶山隼人","saika totsuka":"户冢彩加","haruno yukinoshita":"雪之下阳乃","shizuka hiratsuka":"平冢静","yuuta togashi":"富?勇太","rikka takanashi":"小鸟游六花","kumin tsuyuri":"五月七日茴香","shinka nibutani":"丹生谷森夏","sanae dekomori":"凸守早苗","satone shichimiya":"七宫智音","touka takanashi":"小鸟游十花","mercy":"天使","tracer":"猎空","widowmaker":"黑百合","mei":"美","d.va":"D.VA","zarya":"查莉娅","genjii":"源氏","junkrat":"狂鼠","roadhog":"路霸","pharah":"法老之鹰","soldier 76":"士兵：76","symmetra":"秩序之光","winston":"温斯顿","cortana":"科塔娜","gordon freeman":"戈登·弗里曼","alyx vance":"爱丽克斯·凡斯","chell":"雪儿","emilia":"爱蜜莉雅","ram":"拉姆","rem":"雷姆","subaru natsuki":"菜月昴","beatrice":"碧翠丝","felix argyle":"菲利克斯·阿盖尔","felt":"菲鲁特","roswaal l. mathers":"罗兹瓦尔·L·梅札斯","otto suewen":"奥托·苏文","julius euclius":"由里乌斯·尤克历乌斯","elsa granhilte":"艾尔莎·葛兰西尔特","megumi kato":"加藤惠","utaha kasumigaoka":"霞之丘诗羽","michiru hyodo":"冰堂美智留","eriri spencer sawamura":"泽村·斯宾塞·英梨梨","izumi hashima":"波岛出海","kobato hasegawa":"羽濑川小鸠","kodaka hasegawa":"羽濑川小鹰","rika shiguma":"志熊理科","sena kashiwazaki":"柏崎星奈","yozora mikazuki":"三日月夜空","yukimura kusunoki":"楠幸村","maria takayama":"高山玛利亚","ageha":"扬羽","aimu":"蓝梦","aria":"亚璃亚","ashiya":"芦屋","asuka":"飞鸟","ayame":"菖蒲","bashou":"芭蕉","chihaya":"千早","chiyo":"千代","daidouji":"大道寺前辈","fuga":"风雅","fuma":"风魔","ginrei":"银岭","haruka":"春花","hibari":"云雀","hijikata":"土方","hikage":"日影","hisui":"飞彗","homura":"焰","ibuki":"伊吹","ikaruga":"斑鸠","imu":"忌梦","josui":"如水","kaede":"枫","kagari":"篝","kanon":"花音","kanzaki":"神咲","kasumi":"霞","katsuragi":"葛城","kochou":"胡蝶","kumi":"九魅","kuroudo":"藏人","leo":"丽王","mai":"舞","meimei":"美莓","minori":"美野里","mirai":"未来","misato":"深里","miyabi":"雅绯","motochika":"元亲","muramasa":"村正","murasaki":"紫","naraku":"奈乐","rin":"凛（铃音）","ryoubi":"两备","ryouna":"两奈","sakyou":"左京","seimei":"清明","siki":"四季","shiki":"四季","souji":"总司","suzune":"凛（铃音）","syuri":"朱璃","ukyou":"右京","ushimaru":"牛丸","yagyuu":"柳生","yomi":"咏","yoshimitsu":"吉光","yozakura":"夜樱","yugiri":"夕雾","yumi":"雪泉","yuyaki":"夕烧","tohru":"托尔","kanna kamui":"康娜卡姆依","quetzalcoatl":"魁札尔科亚特尔（露科亚）","kobayashi-san":"小林","shouta magatsuchi":"真土翔太","riko saikawa":"才川莉子","aoba suzukaze":"凉风青叶","hifumi takimoto":"泷本日富美","kou yagami":"八神光","rin tooyama":"远山伦","hajime shinoda":"篠田初","yun iijima":"饭岛结音","shizuku hazuki":"叶月雫","aoi miyamori":"宫森葵","ema yasuhara":"安原绘麻","midori imai":"今井绿","shizuka sakaki":"坂木静香","misa toudou":"藤堂美沙","misato segawa":"濑川美里","erika yano":"矢野艾莉卡","rinko ogasawara":"小笠原纶子","yuka okitsu":"兴津由佳","shun watanabe":"渡边隼","ai kunogi":"久乃木爱","yumi iguchi":"井口祐未","chitose karasuma":"乌丸千岁","momoka sono":"苑生百花","yae kugayama":"久我山八重","gabriel tenma white":"天真·珈百璃·怀特","vignette tsukinose april":"月乃濑·薇奈特·艾普利尔","satanichia kurumizawa mcdowell":"胡桃泽·萨塔妮娅·麦克道威尔","raphiel shiraha ainsworth":"白羽·菈菲尔·恩兹沃斯","chii":"小叽（爱露达）","yumi omura":"大村裕美","sumomo":"丝茉茉","chitose hibiya":"日比谷千岁","hideki motosuwa":"本须和秀树","yuzuki":"柚姬","minoru kokubunji":"国分寺稔","takako shimizu":"清水多香子","sylvie":"希尔薇","rito yuuki":"结城梨斗","ryouko mikado":"御门凉子","lala satalin deviluke":"菈菈·萨塔琳·戴比路克","haruna sairenji":"西连寺春菜","golden darkness":"金色暗影","yui kotegawa":"古手川唯","mikan yuuki":"结城美柑","nemesis":"涅墨西斯","saki tenjouin":"天条院沙姬","ayako fujisaki":"藤崎绫","rin kujou":"九条凛","mea kurosaki":"黑咲芽亚","nana asta deviluke":"娜娜·阿斯塔·戴比路克","momo velia deviluke":"梦梦·贝莉雅·戴比路克","riko yuusaki":"夕崎梨子","sephie michaela deviluke":"赛菲·米卡埃拉·戴比路克","tearju lunatique":"提亚悠·鲁娜提克","run elsie jewelria":"伦·艾尔西·裘利亚","risa momioka":"籾冈里纱","mio sawada":"泽田未央","oshizu murasame":"村雨静","kyouko kirisaki":"雾崎恭子","erina nakiri":"薙切绘理奈","sagiri izumi":"和泉纱雾","elf yamada":"山田伊尔芙","masamune izumi":"和泉正宗","megumi jinno":"神野惠","super sonico":"超级索尼子","super pochaco":"超级帕恰子","super taruco":"超级桶桶子","ako suminoe":"住之江亚香","riko suminoe":"住之江理香","keita suminoe":"住之江圭太","miharu mikuni":"三国美春","agiri goshiki":"吴织亚切","sonya":"索妮娅","yasuna oribe":"折部安奈","ika musume":"乌贼娘","ayumi tokita":"常田鲇美","chizuru aizawa":"相泽千鹤","cindy campbell":"辛迪·坎贝尔","eiko aizawa":"相泽荣子","sanae nagatsuki":"长月早苗","takeru aizawa":"相泽武","kiyomi sakura":"纱仓清美","nagisa saitou":"齐藤渚","miku hatsune":"初音未来","luka megurine":"巡音流歌","len kagamine":"镜音连","rin kagamine":"镜音铃","haku yowane":"弱音白","yukari yuzuki":"结月缘","maki tsurumaki":"弦卷真纪","sorata kanda":"神田空太","mashiro shiina":"椎名真白","nanami aoyama":"青山七海","misaki kamiigusa":"上井草美咲","chihiro sengoku":"千石千寻","akito himenokouji":"姬小路秋人","akiko himenokouji":"姬小路秋子","anastasia nasuhara":"那须原安娜史塔希亚","ginbei haruomi sawatari":"猿渡银兵卫春臣","arashi nikaidou":"二阶堂岚","arisa takanomiya":"鹰乃宫亚里沙","origami tobiichi":"鸢一折纸","kurumi tokisaki":"时崎狂三","yoshino":"四糸乃","kotori itsuka":"五河琴里","kaguya yamai":"八舞耶俱矢","yuzuru yamai":"八舞夕弦","miku izayoi":"诱宵美九","tohka yatogami":"夜刀神十香","shido itsuka":"五河士道","reine murasame":"村雨令音","mayuka kondou":"近藤茧佳","nao takanashi":"高梨奈绪","iroha tsuchiura":"土浦彩叶","mumei":"无名","Ayane":"绫音"},"male":{"age progression":"年龄增长","age regression":"返老还童","dilf":"熟男","infantilism":"幼稚型","low shotacon":"未通过正太","old man":"老人","shotacon":"正太","toddlercon":"幼女","amputee":"截肢","body modification":"身体改造","conjoined":"连体","doll joints":"关节娃娃","gijinka":"拟人化","inflation":"腹部膨胀","invisible":"透明","multiple arms":"多臂","muscle":"肌肉","muscle growth":"肌肉成长","stretching":"拉伸","tailjob":"尾巴性交","wings":"翅膀","absorption":"吸收","petrification":"石化","transformation":"变身","alien":"外星人","angel":"天使","bunny boy":"兔子男孩","catboy":"猫男","centaur":"半人马","cowman":"牛男","demon":"恶魔","dog boy":"狗男孩","draenei":"德莱尼","fairy":"仙女","fox boy":"狐男","furry":"毛茸茸","ghost":"幽灵","goblin":"地精","harpy":"鸟人","horse boy":"马男孩","human on furry":"人毛","insect boy":"昆虫男孩","kappa":"河童","lizard guy":"蜥蜴男孩","merman":"人鱼","minotaur":"牛头人","monster":"怪物","mouse boy":"鼠男孩","necrophilia":"奸尸","oni":"鬼","orc":"兽人","pig man":"猪男","plant boy":"植物男孩","robot":"机器人","shark boy":"鲨男孩","sheep boy":"羊男孩","slime":"史莱姆","slime boy":"史莱姆男孩","snake boy":"蛇男","squid boy":"乌贼男","tentacles":"触手","vampire":"吸血鬼","wolf boy":"狼男孩","zombie":"僵尸","animal on animal":"兽兽","animal on furry":"兽毛","bear":"熊","bestiality":"兽交","bull":"牛","camel":"骆驼","cat":"猫","crab":"螃蟹","dinosaur":"恐龙","dog":"狗","dolphin":"海豚","donkey":"驴","dragon":"龙","eel":"鳗鱼","elephant":"象","fish":"鱼","fox":"狐狸","frog":"青蛙","goat":"山羊","gorilla":"猩猩","horse":"马","insect":"昆虫","kangaroo":"袋鼠","lion":"狮","low bestiality":"未通过兽交","maggot":"蛆","monkey":"猴","mouse":"鼠","octopus":"章鱼","ostrich":"鸵鸟","panther":"豹","pig":"猪","rabbit":"兔","reptile":"爬虫","rhinoceros":"犀牛","sheep":"绵羊","shark":"鲨","slug":"蛞蝓","snake":"蛇","spider":"蜘蛛","tiger":"虎","turtle":"龟","unicorn":"独角兽","whale":"鲸","wolf":"狼","worm":"蠕虫","zebra":"斑马","giant":"巨人","growth":"巨大化","midget":"侏儒","miniguy":"迷你男孩","shrinking":"缩小","tall man":"高个男","albino":"白化","body writing":"身体写作","body painting":"身体绘画","dark skin":"肤色黝黑","freckles":"雀斑","full body tattoo":"全身纹身","gyaru-oh":"非主流","scar":"瘢痕","skinsuit":"皮物","tanlines":"晒痕","bbm":"胖男人","ssbbm":"超级胖男人","weight gain":"体重增加","ahegao":"阿黑颜","brain fuck":"脑交","crown":"王冠","elf":"精灵","facesitting":"坐脸","gasmask":"防毒面具","hairjob":"发丝交","masked face":"假面","body swap":"换身","chloroform":"迷药","corruption":"堕落","drugs":"药物","drunk":"醉酒","emotionless sex":"性冷淡","mind break":"洗脑","mind control":"精神控制","moral degeneration":"道德退化","parasite":"寄生","possession":"凭依","shared senses":"感官共享","sleeping":"睡觉","blindfold":"遮眼布","dark sclera":"深色巩膜","eye penetration":"插入眼睛","eyemask":"眼部面具","eyepatch":"眼罩","glasses":"眼镜","heterochromia":"异色瞳","monoeye":"独眼","sunglasses":"太阳镜","unusual pupils":"异瞳","nose hook":"鼻吊钩","smell":"气味","blowjob":"口交","blowjob face":"口交颜","burping":"打嗝","coprophagia":"食粪","deepthroat":"深喉","double blowjob":"双重口交","foot licking":"舔足","gag":"口塞","gokkun":"饮精","kissing":"接吻","long tongue":"长舌","piss drinking":"饮尿","rimjob":"舔肛","saliva":"唾液","smoking":"吸烟","tooth brushing":"刷牙","unusual teeth":"异齿","vomit":"呕吐","vore":"吞食","asphyxiation":"窒息","collar":"项圈","armpit licking":"腋下舔","armpit sex":"腋交","fisting":"拳交","handjob":"打手枪","hairy armpits":"腋毛","big areolae":"大乳晕","big breasts":"巨乳","breast expansion":"乳房膨胀","breast feeding":"哺乳","breast reduction":"乳房缩小","lactation":"母乳","milking":"挤奶","paizuri":"乳交","big nipples":"大乳头","dark nipples":"暗色乳头","dicknipples":"阴茎乳头","inverted nipples":"乳头内陷","multiple nipples":"多乳头","nipple birth":"乳头出产","navel fuck":"肚脐奸","pregnant":"怀孕","stomach deformation":"腹部变形","chastity belt":"贞操带","crotch tattoo":"裆部纹身","hairy":"多毛","pantyjob":"内裤交","pubic stubble":"阴毛茬","urethra insertion":"尿道插入","balls expansion":"睾丸生长","ball sucking":"吸球","balljob":"球交","big balls":"大睾丸","big penis":"大根","dick growth":"阴茎生长","frottage":"阴茎摩擦","horse cock":"马根","huge penis":"巨根","multiple penises":"鸡鸡复鸡鸡","penis birth":"阴茎出产","phimosis":"包茎","prostate massage":"前列腺按摩","smegma":"阴垢","birth":"出产","anal":"肛交","anal birth":"肛门出产","ass expansion":"臀部膨胀","assjob":"尻交","big ass":"大屁股","enema":"灌肠","farting":"放屁","pegging":"爆菊","spanking":"打屁股","eggs":"产卵","gaping":"敞口","large insertions":"大玩具","nakadashi":"中出","prolapse":"脱垂","unbirth":"入阴","kneepit sex":"膝里性交","leg lock":"钩腿","legjob":"腿交","sumata":"股间性交","foot insertion":"足插入","footjob":"足交","sockjob":"袜交","apron":"围裙","bandages":"绷带","bandaid":"创可贴","bike shorts":"自行车短裤","bikini":"比基尼","bloomers":"布鲁马","bodystocking":"连身袜","bodysuit":"连体紧身衣","bride":"婚纱","business suit":"西装","butler":"管家","cashier":"收银员","cheerleader":"啦啦队员","chinese dress":"唐装","christmas":"圣诞装","clown":"小丑","condom":"避孕套","corset":"紧身内衣","cosplaying":"Cosplay","crossdressing":"异性装","diaper":"尿布","dougi":"练功服","fundoshi":"六尺褌","garter belt":"吊袜带","gothic lolita":"哥特萝莉装","gymshorts":"运动短裤","haigure":"高叉装","hijab":"头巾","hotpants":"热裤","kigurumi":"全身套装","kimono":"和服","kindergarten uniform":"幼儿园制服","kunoichi":"女忍装","lab coat":"白大褂","latex":"乳胶紧身衣","leotard":"紧身衣","lingerie":"情趣内衣","living clothes":"生物衣","magical girl":"魔法少女","maid":"女仆装","mecha boy":"机男","metal armor":"金属盔甲","miko":"巫女装","military":"军装","nazi":"纳粹军装","ninja":"忍者装","nun":"修女服","nurse":"护士装","pantyhose":"连裤袜","pasties":"乳贴","piercing":"穿孔","pirate":"海盗服","policeman":"警服","randoseru":"书包","schoolboy uniform":"男生制服","schoolgirl uniform":"女生制服","scrotal lingerie":"阴囊袋","shimapan":"条纹胖次","stewardess":"空姐服","steward":"男空乘服","stockings":"长筒袜","swimsuit":"泳装","school swimsuit":"死库水","sundress":"夏装","thigh high boots":"高筒靴","tiara":"宝冠","tights":"紧身服","tracksuit":"运动服","waiter":"男侍者装","waitress":"女侍者装","wet clothes":"湿身","witch":"女巫装","double anal":"双插肛门","group":"乱交","harem":"后宫","layer cake":"夹心蛋糕","oyakodon":"母娘丼","triple anal":"三插肛门","twins":"双胞胎","all the way through":"全身插入","double penetration":"双重插入","triple penetration":"三重插入","glory hole":"寻欢洞","machine":"机械奸","onahole":"飞机杯","pillory":"枷具","pole dancing":"钢管舞","sex toys":"性玩具","speculum":"扩张器","syringe":"注射器","tail plug":"尾塞","tube":"插管","vacbed":"真空床","whip":"鞭打","wooden horse":"木马","wormhole":"虫洞","oil":"油","underwater":"水下","blood":"流血","bukkake":"精液覆盖","cum bath":"精液浴","public use":"肉便器","scat":"排便","sweating":"出汗","urination":"排尿","chikan":"痴汉","rape":"强奸","bdsm":"调教","forniphilia":"人体家具","human pet":"人宠","josou seme":"女装攻","orgasm denial":"高潮禁止","slave":"奴隶","tickling":"挠痒","bondage":"束缚","shibari":"捆绑","stuck in wall":"卡在墙上","abortion":"堕胎","cannibalism":"食人","cbt":"CBT","guro":"肢解","electric shocks":"电击","ryona":"哀嚎","snuff":"杀害","torture":"拷打","trampling":"践踏","wrestling":"摔角","autofellatio":"自吹","masturbation":"自慰","phone sex":"电话性爱","selfcest":"自交","solo action":"自摸","table masturbation":"桌角自慰","blind":"失明","handicapped":"残疾","mute":"哑巴","cuntboy":"人妖","feminization":"女性化","gender bender":"性转换","bisexual":"双性","dickgirl on male":"扶上男","first person perspective":"第一人称视角","x-ray":"透视","blackmail":"勒索","coach":"教练","males only":"纯男性","impregnation":"受孕","prostitution":"援交","sole male":"单男主","teacher":"教师","tomboy":"假小子","tomgirl":"伪娘","tutor":"家庭教师","virginity":"丧失童贞","widower":"鳏夫","yandere":"病娇","yaoi":"男同","cheating":"出轨","netorare":"NTR","swinging":"换妻","brother":"兄弟","cousin":"表姐妹","father":"父亲","grandfather":"祖父","incest":"乱伦","inseki":"姻亲","uncle":"叔叔","exhibitionism":"露阴癖","filming":"摄像","humiliation":"屈辱","voyeurism":"偷窥","lolicon":"萝莉","low lolicon":"未通过萝莉","milf":"熟女","old lady":"老女人","multiple breasts":"多对乳房","alien girl":"外星女","bee girl":"蜂女","bunny girl":"兔女郎","catgirl":"猫女","cowgirl":"牛女孩","demon girl":"恶魔女孩","dog girl":"狗女孩","fox girl":"狐女","horse girl":"马女孩","insect girl":"昆虫女孩","lizard girl":"蜥蜴女孩","mermaid":"美人鱼","monster girl":"怪物女孩","mouse girl":"鼠女孩","pig girl":"猪女","plant girl":"植物女孩","raccoon girl":"浣熊女孩","shark girl":"鲨女孩","sheep girl":"羊女孩","slime girl":"史莱姆女孩","snake girl":"蛇女","spider girl":"蜘蛛女","squid girl":"乌贼女","wolf girl":"狼女孩","cow":"牛","lioness":"狮","giantess":"女巨人","minigirl":"迷你女孩","tall girl":"高个女","gyaru":"辣妹","anorexic":"瘦骨嶙峋","bbw":"胖女人","ssbbw":"超级胖女人","cockslapping":"屌掴","ear fuck":"耳交","prehensile hair":"抓握发","cum in eye":"眼射","nose fuck":"鼻交","big lips":"大嘴唇","braces":"牙套","fingering":"指法","gigantic breasts":"极乳","huge breasts":"超乳","multiple paizuri":"多重乳交","oppai loli":"巨乳萝莉","small breasts":"贫乳","nipple expansion":"乳头膨胀","nipple fuck":"乳穴性交","big clit":"大阴蒂","big vagina":"大阴道","cervix penetration":"宫颈穿透","clit growth":"阴蒂生长","cunnilingus":"舔阴","defloration":"破处","multiple vaginas":"多阴道","tribadism":"贝合","mecha girl":"机娘","policewoman":"警服","ponygirl":"小马女","race queen":"赛车女郎","vaginal sticker":"阴贴","double vaginal":"双插阴道","fft threesome":"女女扶","triple vaginal":"三插阴道","ttf threesome":"扶扶女","real doll":"充气娃娃","strap-on":"穿戴式阳具","squirting":"潮吹","cum swap":"交换精液","menstruation":"经血","femdom":"女性支配","human cattle":"人类饲养","catfight":"猫斗","autopaizuri":"自乳交","futanari":"扶她","shemale":"女雄","dickgirl on dickgirl":"扶上扶","male on dickgirl":"男上扶","dickgirls only":"纯扶她","females only":"纯女性","sole dickgirl":"单扶她","sole female":"单女主","widow":"寡妇","yuri":"百合","aunt":"阿姨","daughter":"女儿","granddaughter":"孙女","grandmother":"祖母","mother":"母亲","niece":"侄女","sister":"姐妹"},"misc":{"yukkuri":"油库里","animal on animal":"兽兽","body swap":"换身","frottage":"阴茎摩擦","ffm threesome":"嫐","group":"乱交","mmf threesome":"嬲","mmt threesome":"男男扶","mtf threesome":"男扶女","oyakodon":"母娘丼","ttm threesome":"扶扶男","twins":"双胞胎","dakimakura":"抱枕","time stop":"时间停止","3d":"3D","anaglyph":"红蓝3D","animated":"动图","anthology":"选集","artbook":"画师册","figure":"手办","full color":"全彩色","game sprite":"像素画","how to":"教程","multi-work series":"系列作品","novel":"小说","paperchild":"纸片人","redraw":"重绘","screenshots":"截图","stereoscopic":"立体图","story arc":"故事线","tankoubon":"单行本","themeless":"无主题","webtoon":"Webtoon","uncensored":"无修正","mosaic censorship":"马赛克修正","full censorship":"完全修正","hardcore":"硬核","non-nude":"无裸体","already uploaded":"已上传","compilation":"重复","forbidden content":"禁止内容","realporn":"真人色情","replaced":"已替换","watermarked":"水印","incomplete":"缺页","missing cover":"缺封面","out of order":"顺序错乱","sample":"样本","scanmark":"水印","caption":"说明文字","poor grammar":"渣翻","incest":"乱伦","inseki":"姻亲","c92":"C92","samoyed smile":"SAMOYED SMILE","moonstone honey":"MOONSTONE Honey"}}');
  }) (),
  lastKey: function () {
    var a = Object.keys(this.CHS);
    var last = a[a.length - 1];
    this.lastKey = function () {
      return last;
    };
    return last;
  },
  notice: function () {
    var _ = this;
    var notice = '当前屏蔽的标签有：<span class="TAGS">';
    for (var i in _.UNLIKE) {
      notice += '<li title="' + i + '">' + _.UNLIKE[i] + '</li>';
    }
    notice += '</span><br>当前警告的标签有：<span class="TAGS">';
    for (var i in _.ALERT) {
      notice += '<li title="' + i + '">' + _.ALERT[i] + '</li>';
    }
    notice += '</span>';
    $('h1').innerHTML = notice;
  },
  addStyle: function () {
    var style = $_('style');
    style.textContent = '.TAGS{font-size:larger;}.TAGS>li{display:inline;margin:1px;cursor:pointer;}';
    $('body').appendChild(style);
  }
}
var TagsPreview = {
  dataArr: [
  ],
  checkData: function (data, i) {
    var _ = this;
    _.dataArr[i] = data;
    var dataAll = [
    ].concat.apply([], _.dataArr);
    if (dataAll.length >= $$('.it5>a,.id3>a').length) {
      _.tagPreview(dataAll);
      _.hideGalleries(dataAll);
    }
  },
  xhr: function (gidlist, i) {
    var _ = this;
    var now = new Date().getTime();
    if (gidlist.length > 25) {
      var _gidlist = gidlist.splice(25, gidlist.length - 25);
    }
    var gdata = {
      'method': 'gdata',
      'gidlist': gidlist
    }
    var xhr = 'xhr_' + Math.random().toString();
    xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://e-hentai.org/api.php', true);
    xhr.responseType = 'json';
    var _i = i;
    xhr.onload = function () {
      _.checkData(xhr.response.gmetadata, _i);
    };
    xhr.send(JSON.stringify(gdata));
    if (_gidlist) {
      i++;
      _.xhr(_gidlist, i);
    }
  },
  getMousePos: function (event) {
    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    return {
      'x': x,
      'y': y
    };
  },
  init: function () {
    var _ = this;
    CONFIG.notice();
    CONFIG.addStyle();
    _.addStyle();
    var gidlist = [
    ];
    var bars = $$('.it5>a,.id3>a');
    $$('.it5>a,.id3>a').forEach(function (_bar, i) {
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
  tagPreview: function (data) {
    var _ = this;
    var group = [
    ];
    var groupChs = [
    ];
    var artist = [
    ];
    var artistChs = [
    ];
    var parody = [
    ];
    var parodyChs = [
    ];
    data.forEach(function (_data, i) {
      var _title = _data.title.toLowerCase().replace(/^\(.*?\)/, '').trim();
      if (_data.title_jpn) var _titleJpn = _data.title_jpn.replace(/^\(.*?\)/, '').trim();
      if (_title.match(/^\[.*?\]/)) {
        group[i] = _title.match(/^\[(.*?)\]/) [1].trim();
        if (_titleJpn && _titleJpn.match(/^\[.*?\]/)) groupChs[i] = _titleJpn.match(/^\[(.*?)\]/) [1].trim();
        if (group[i].match(/\(.*?\)/)) {
          artist[i] = group[i].match(/\((.*?)\)/) [1].trim();
          group[i] = group[i].match(/(.*?)\(.*?\)/) [1].trim();
          if (groupChs[i] && groupChs[i].match(/\(.*?\)/)) {
            artistChs[i] = groupChs[i].match(/\((.*?)\)/) [1].trim();
            groupChs[i] = groupChs[i].match(/(.*?)\(.*?\)/) [1].trim();
          }
        }
      }
      if (_data.category === 'parody') {
        _title = _title.replace(/\[.*?\]/g, '').trim();
        if (_data.title_jpn) _titleJpn = _titleJpn.replace(/\[.*?\]/g, '').trim();
        if (_title.match(/\(.*?\)/)) {
          parody[i] = _title.match(/\((.*?)\)/) [1].replace(/[!?\.\/]/g, ' ').trim();
          if (_titleJpn && _titleJpn.match(/\(.*?\)/)) parodyChs[i] = _titleJpn.match(/\((.*?)\)/) [1];
        }
      }
    });
    var box = $_('div');
    box.id = 'TagPreview';
    $('.ido').addEventListener('mousemove', function (e) {
      if (e.target.className.indexOf('TagPreview_') >= 0) {
        var id = e.target.className.replace('TagPreview_', '');
        var tag;
        if (data[id].tag) {
          tag = data[id].tag;
        } else {
          tag = [
          ];
          var tags = data[id].tags.slice();
          var tagsObj = new _.tagsObj();
          for (var i = 0; i < tags.length; i++) {
            if (tags[i] == parody[id]) {
              tagsObj.parody.push(parodyChs[id] || tags[i]);
            } else if (tags[i] == group[id]) {
              tagsObj.group.push(groupChs[id] || tags[i]);
            } else if (tags[i] == artist[id]) {
              tagsObj.artist.push(artistChs[id] || tags[i]);
            } else {
              var find = false;
              for (var j in CONFIG.CHS) {
                if (tags[i] in CONFIG.CHS[j]) {
                  tagsObj[j].push(CONFIG.CHS[j][tags[i]]);
                  find = true;
                } else if (j === CONFIG.lastKey() && !find) {
                  tagsObj.other.push(tags[i]);
                }
              }
            }
          }
          for (var i in tagsObj) {
            if (tagsObj[i].length > 0) {
              tag.push('<li class="' + i + 'Tag"><span>' + tagsObj[i].join('</span><span>') + '</span></li>');
            }
          }
          data[id].tag = tag.join('');
        }
        var title = (data[id].title_jpn) ? data[id].title_jpn : data[id].title;
        var MousePos = _.getMousePos(e);
        box.style.display = 'block';
        box.style.left = (MousePos.x + 5) + 'px';
        box.style.top = (MousePos.y + 5) + 'px';
        box.innerHTML = '<div>' + title + '</div><div style="color:red">[' + (parseInt(data[id].filesize / 1024 / 1024)) + 'M]' + data[id].filecount + 'P</div><div style="height:2px;background-color:black;"></div><div>' + tag + '</div>';
        if (box.offsetHeight + MousePos.y + 5 >= $('body').offsetHeight) {
          $('body').style.height = box.offsetHeight + MousePos.y + 10 + 'px';
        }
      } else {
        box.style.display = 'none';
      }
    });
    $('body').appendChild(box);
  },
  hideGalleries: function (data) {
    var bars = $$('.it5>a,.id3>a');
    var barHide = [
    ];
    var boxHide = [
    ];
    data.forEach(function (_data, i) {
      _data.tags.forEach(function (_tag, k) {
        if (_tag in CONFIG.UNLIKE || _tag in CONFIG.ALERT) {
          var div = $_('span');
          div.title = _tag;
          bars[i].parentNode.parentNode.insertBefore(div, bars[i].parentNode);
          if (_tag in CONFIG.UNLIKE) {
            div.className = 'unlikeTag';
            div.innerHTML = CONFIG.UNLIKE[_tag];
            if (bars[i].parentNode.className === 'it5' && !inArray(bars[i], barHide)) {
              barHide.push(bars[i]);
            } else if (bars[i].parentNode.className === 'id3' && !inArray(bars[i], boxHide)) {
              boxHide.push(bars[i]);
            }
          } else {
            div.className = 'alertTag';
            div.innerHTML = CONFIG.ALERT[_tag];
          }
        }
      });
    });
    $('p.ip').innerHTML += '  总共屏蔽' + (barHide.length + boxHide.length) + '本本子。';
    var toggle = $_('button');
    toggle.id = 'toggleHide';
    toggle.className = 'stdbtn';
    toggle.onclick = function () {
      var isShow = this.id === 'toggleShow';
      this.id = isShow ? 'toggleHide' : 'toggleShow';
      barHide.forEach(function (i) {
        i.parentNode.parentNode.parentNode.parentNode.style.display = isShow ? '' : 'none';
      });
      barHide.forEach(function (i) {
        i.parentNode.parentNode.style.display = isShow ? '' : 'none';
      });
    }
    toggle.click();
    $('p.ip').appendChild(toggle);
  },
  addStyle: function () {
    var style = $_('style');
    style.textContent = [
      '#TagPreview{position:absolute;padding:5px;display:none;z-index:999;font-size:larger;width:250px;border-color:black;border-style:solid;color:white;background-color:#34353B;}',
      '#TagPreview li.languageTag::before{content:"语言: "}',
      '#TagPreview li.reclassTag::before{content:"重新分类: "}',
      '#TagPreview li.artistTag{font-size:larger;color:green;}',
      '#TagPreview li.artistTag::before{content:"漫画家: "}',
      '#TagPreview li.groupTag{font-size:larger;color:#00FFF5;}',
      '#TagPreview li.groupTag::before{content:"组织: "}',
      '#TagPreview li.parodyTag{font-size:larger;color:yellow;}',
      '#TagPreview li.parodyTag::before{content:"同人: "}',
      '#TagPreview li.characterTag::before{content:"角色: "}',
      '#TagPreview li.maleTag::before{content:"属性: "}',
      '#TagPreview li.miscTag::before{content:"杂项: "}',
      '#TagPreview li.otherTag::before{content:"未分类: "}',
      '#TagPreview li{color:#C9BA67}',
      '#TagPreview li>span{display:inline;margin:0 2px;border:1px #456F78 solid;}',
      '.unlikeTag{float:left;color:red;background-color:blue;margin:0 1px;}',
      '.alertTag{float:left;color:yellow;background-color:green;margin:0 1px;}',
      '#toggleShow::before{content:"显示"}',
      '#toggleHide::before{content:"隐藏"}'
    ].join('');
    $('body').appendChild(style);
  },
  tagsObj: function () {
    this.language = [
    ];
    this.reclass = [
    ];
    this.artist = [
    ];
    this.group = [
    ];
    this.parody = [
    ];
    this.character = [
    ];
    this.male = [
    ];
    this.misc = [
    ];
    this.other = [
    ];
  }
}
TagsPreview.init();
