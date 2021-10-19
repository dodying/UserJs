/* eslint-env browser */
// ==UserScript==
// @name          hvTranslator
// @name:zh-CN    【HV】翻译
// @include        http://*hentaiverse.org/*
// @exclude        http://hentaiverse.org/?s=Character&ss=eq
// @exclude        http://hentaiverse.org/pages/showequip.php?*
// @rawJs          http://userscripts-mirror.org/scripts/show/41369
// @author         Dodying
// @copyright      JoeSimmons
// @version        1.0
// @license        http://creativecommons.org/licenses/by-nc-nd/3.0/us/
// @grant none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// ==/UserScript==
if (document.getElementById('togpane_log')) return;
(function () {
    'use strict';


    /*
        NOTE: 
            You can use \\* to match actual asterisks instead of using it as a wildcard!
            The examples below show a wildcard in use and a regular asterisk replacement.
    */

    var words = {

    ///////////////////////////////////////////////////////菜单
        'Character' : '人物',
        'Equipment' : '装备',
        'Abilities' : '能力',
        'Training' : '训练',
        'Battle Items' : '战斗物品',
        'Inventory' : '库存',
        'Settings' : '设置',
        'Auto-Cast Slots' : '自动施放',
        'Slots' : '插槽',
        'Shop' : '商店',
        'Bot' : '机器人',
        'Monster' : '怪物',
        'Lab' : '实验室',
        'The Shrine' : '祭坛',
        'MoogleMail' : '莫古利邮件',
        'Weapon' : '武器',
        'Lottery' : '彩票',
        'Repair' : '修复',
        'Upgrade' : '改造',
        'Enchant' : '优化(1H)',
        'Salvage' : '拆解',
        'Reforge' : '重铸',
        'Soulfuse' : '灵魂同步连结',
        '' : '',
        '' : '',
    ///////////////////////////////////////////////////////菜单


    ///////////////////////////////////////////////////////人物状态
        'Health' : '健康',
        'health' : '健康',
        'Magic' : '魔力',
        'magic' : '魔力',
        'Spirit' : '精神',
        'spirit' : '精神',
        ' points' : '点数',
        'Stamina:' : '耐力：',
        'Difficulty' : '难度',
        'To next level' : '升级所需经验',
        'Damage' : '损坏',
        'Primary ' : '主要',
        'attributes' : '属性',
        ' proficiency' : '熟练度',
        'Strength' : '5力量Str',
        'Dexterity' : '6灵巧Dex',
        'Agility' : '4敏捷Agi',
        'Endurance' : '3体质End',
        'Intelligence' : '1智力Int',
        'Wisdom' : '2感知Wis',
        'One-handed' : '单手',
        'Two-handed' : '双手',
        'Dual wielding' : '双持',
        'Staff' : '法杖',
        'armor' : '甲',
        'Elemental' : '元素',
        'Divine' : '神圣',
        'Forbidden' : '禁断',
        'Deprecating' : 'DeBuff',
        'Supportive' : 'Buff',
        'Base ' : '基础',
        'vitals' : '命脉',
        ' regen' : '回复',
        'Fighting Style' : '战斗方式',
        'base' : '基础',
        'attack' : '攻击',
        'chance' : '几率',
        'speed bonus' : '速度加成',
        'cost modifier' : '消耗减少',
        'Boost' : '增加',
        'Physical' : '物理',
        '魔力al' : '魔法',
        'Vitals' : '命脉',
        'Defense' : '防御',
        'physical' : '物理',
        'Attack' : '攻击',
        'mitigation' : '缓伤',
        'Mitigation' : '缓伤',
        'parry' : '闪避',
        'resist' : '抵抗',
        'interference' : '干预',
        'burden' : '负重',
        'Specific' : '特性',
        'Fire' : '火',
        'Cold' : '冰',
        'Wind' : '风',
        'Elec' : '雷',
        'Holy' : '圣',
        'Dark' : '暗',
        'Crushing' : '敲击',
        'Slashing' : '砍击',
        'Piercing' : '刺击',
        'Void' : '虚空',
        'Effective' : '有效',
        'Stats' : '数据',
        'Proficiency' : '熟练度',
        'Bonus' : '加成',
        'block' : '阻止',
        '(crushing)' : '(敲击)',
        '(slashing)' : '(砍击)',
        '(piercing)' : '(刺击)',
        'Statistics' : '数据',
        'Overwhelming Strikes Chance' : '压倒性的攻击发动率',
        'Counter-Attack Chance' : '反击率',
        'Domino Strike on hit' : '连锁攻击发动率',
        'Offhand Strike Chance' : '副手攻击发动率',
        'Proc Chance' : '特效发动率',
        'Proc Duration' : '特效回合数',
        'Arcane Blow Damage' : '奥术猛击伤害',
        'Coalesced Mana Chance' : '魔力合流机率',
        'mana' : '魔力',
        'casts' : '施法',
        'cast' : '施法',
        'Compromise' : '妥协',
        'Spellacc' : '施法精准',
        'Spellcrit' : '施法暴击',
        'Castspeed' : '施法速度',
        'Fiery Blast' : '火（小）',
        'Inferno' : '火（中）',
        'Flames of Loki' : '火（大）',
        'Freeze' : '冰（小）',
        'Blizzard' : '冰（中）',
        'Fimbulvetr' : '冰（大）',
        'Shockblast' : '雷（小）',
        'Chained Lightning' : '雷（中）',
        'Wrath of Thor' : '雷（大）',
        'Gale' : '风（小）',
        'Downburst' : '风（中）',
        'Storms of Njord' : '风（大）',
        'Smite' : '圣（小）',
        'Banishment' : '圣（中）',
        'Paradise Lost' : '圣（大）',
        'Corruption' : '暗',
        'Disintegrate' : '暗（中）',
        'Ragnarok' : '暗（大）',
        'Spell' : '施法',
        'Flame' : '火',
        'Frost' : '冰',
        'Shock' : '震动',
        'Storm' : '风',
        'Spike' : '抗性',
        'Tank' : '容量',
        'Drain' : '枯竭',
        'Slow' : '缓慢',
        'Silence' : '沉默',
        'Theft' : '偷窃',
        'Ether' : '魔力',
        'Battle' : '战斗',
        'Acc' : '精准',
        'Speed' : '速度',
        'Mind Control' : '心灵操控',
        'Blind' : '致盲',
        'Weaken' : '虚弱',
        'Imperil' : '陷危',
        'Shadow Veil' : '阴影面纱',
        'Haste' : '急速',
        'Absorb' : '吸收',
        'Heartseeker' : '穿心(物功+暴+)',
        'Regen' : '回血',
        'Cure' : '治愈',
        'Spark of Life' : '生命火花',
        'Sleep' : '沉眠',
        'Confuse' : '混乱',
        'MagNet' : '魔磁网',
        'Cloak of the Fallen' : '陨落的披风',
        'Arcane Focus' : '奥术集成(法功+暴+)',
        'Spirit Shield' : '灵力盾',
        '' : '',
        '' : '',
    ///////////////////////////////////////////////////////人物状态


    ///////////////////////////////////////////////////////武器
        'Store' : '商店',
        'Main Hand' : '主手',
        'Off Hand' : '副手',
        'Helmet' : '头盔(轻重)',
        'Body' : '身',
        'Hands' : '手',
        'Legs' : '腿',
        'Feet' : '脚',
        'Empty' : '空的',
        'One-Handed' : '单手',
        'Axe' : '斧',
        'Club' : '棍棒',
        'Rapier' : '西洋剑',
        'Shortsword' : '短剑',
        'Wakizashi' : '胁差',
        'Two-Handed' : '双手',
        'Estoc' : '刺剑',
        'Longsword' : '长剑',
        'Mace' : '矛锤',
        'Katana' : '日本刀',
        '法杖s' : '法杖',
        'Oak' : '橡木',
        'Redwood' : '红衫木',
        'Willow' : '柳木',
        'Katalox' : '库本斯沃铁豆木',
        //'Cloth' : '布',
        'Light' : '轻',
        'Heavy' : '重',
        'Shield' : '盾牌',
        'Armor' : '甲',
        'Cap' : '帽(布)',
        'Robe' : '长袍(布)',
        'Breastplate' : '护胸(轻)',
        'Cuirass' : '胸甲(重)',
        'Gloves' : '手套(布)',
        'Gauntlets' : '手甲(轻重)',
        'Pants' : '裤(布)',
        'Leggings' : '护腿(轻重)',
        'Greaves' : '护胫(重)',
        'Shoes' : '鞋(布)',
        'Boots' : '靴子(轻重)',
        'Sabatons' : '铁靴(重)',
        'Buckler' : '小圆盾',
        'Kite ' : '鸢',
        'Force ' : '原力',
        'Cotton' : '棉制(布)',
        'Phase' : '相态(布)',
        //'Leather' : '皮革(轻)',
        'Shade' : '暗影(轻)',
        'Plate' : '板甲(重)',
        'Power ' : '动力(重)', 
        'Ruby' : '红宝石(火抗性)',
        'Cobalt' : '钴(冰抗性)',
        'Amber' : '琥珀(雷抗性)',
        'Jade' : '翡翠(风抗性)',
        'Zircon' : '锆石(圣抗性)',
        'Onyx' : '缟玛瑙(暗抗性)',
        'Crude' : '1粗糙的',
        'Fair' : '2尚可的',
        'Average' : '3普通的',
        'Superior' : '4优秀的',
        'Exquisite' : '5精致的',
        'Magnificent' : '6华丽的',
        'Legendary' : '7传奇的',
        'Peerless' : '8无双的',
        'Fiery' : '红莲(火)',
        'Arctic' : '北极(冰)',
        'Shocking' : '雷鸣(雷)',
        'Tempestuous' : '风暴(风)',
        'Hallowed' : '圣光(圣)',
        'Demonic' : '魔性(暗)',
        'Agile' : '敏捷(攻速)',
        'Burden' : '负重',
        'Interference' : '干预',
        'Crit' : '暴击',
        'Chance' : '几率',
        'Attributes' : '加成',
        'Condition' : '耐久',
        'Slaughter' : '伤害',
        'Balance' : '精准+暴击',
        'the Battlecaster' : '魔-准保',
        'the Nimble' : '招架',
        'the Vampire' : '吸血',
        'the Illithid' : '吸魔',
        'the Banshee' : '吸精',
        'Swiftness' : '攻速',
        'Destruction' : '魔伤',
        'Surtr' : '火+',
        'Niflheim' : '冰+',
        'Mjolnir' : '雷+',
        'Freyr' : '风+',
        'Heimdall' : '圣+',
        'Fenrir' : '暗+',
        'Focus' : '魔-准暴保',
        'the Elementalist' : '元素+熟练',
        'the Heaven-sent' : '神圣+熟练',
        'the Demon-fiend' : '禁断+熟练',
        'the Earth-walker' : 'Buff+熟练',
        'the Curse-weaver' : 'DeBuff+熟练',
        'the Barrier ' : '格挡',
        'Protection' : '物防',
        'Warding' : '魔防',
        'Dampening' : '敲击缓伤',
        'Stoneskin' : '砍击缓伤',
        'Deflection' : '刺击缓伤',
        'the Shadowdancer' : '暴回+灵巧敏捷',
        'the Arcanist' : '魔-准+智力感知',
        'the Fleet' : '回避',
        'Negation' : '抵抗',
        'Tradeable' : '可交易',
        'Untradeable' : '不可交易',
        'Evade' : '回避',
        'Block' : '格挡',
        'Resist' : '抵抗',
        'Tier' : '品质',
        'Accuracy' : '精准',
        'Parry' : '招架',
        'Siphon' : '吸收',
        'Potency' : '潜能',
        'Penetrated' : '破',
        'Archmage' : '魔伤+',
        'Annihilator' : '魔爆+',
        'Economizer' : '魔耗-',
        'Spellweaver' : '施法速+',
        'Swift Strike' : '攻速+',
        '' : '',
        '' : '',
    ///////////////////////////////////////////////////////武器
        

    ///////////////////////////////////////////////////////物品
        ' Draught' : '药水',
        ' Potion' : '药剂',
        ' Elixir' : '万能药',
        'Scrolls' : '卷轴',
        'Scroll' : '卷轴',
        'Protection' : '防护',
        'Shadows' : '幻影',
        'Absorption' : '吸收',
        'Life' : '生命',
        'the Gods' : '神',
        'Crystals' : '水晶',
        'Crystal' : '水晶',
        'Restoratives' : '回复品',
        'Infusions' : '魔药',
        'Infusion' : '魔药',
        'All' : '所有',
        'Materials' : '材料',
        'Special' : '特殊',
        'Vigor' : '力量',
        'Finesse' : '灵巧',
        'Swiftness' : '敏捷',
        'Fortitude' : '体质',
        'Cunning' : '智力',
        'Knowledge' : '感知',
        'Flames' : '火',
        '轻ning' : '雷',
        'Storms' : '风',
        'Tempest' : '风',
        'Divinity' : '圣',
        'Devotion' : '圣',
        'Corruption' : '暗',
        'Mana' : '魔力',
        'Last' : '终极',
        'Chow' : '口粮',
        'Edibles' : '食品',
        'Cuisine' : '料理',
        'Happy Pills' : '快乐药丸',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
    ///////////////////////////////////////////////////////物品
        
        // Syntax: 'Search word' : 'Replace word',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',
        '' : '',


    ///////////////////////////////////////////////////////
    '':''};











    //////////////////////////////////////////////////////////////////////////////
    // This is where the real code is
    // Don't edit below this
    //////////////////////////////////////////////////////////////////////////////

    var regexs = [], replacements = [],
        tagsWhitelist = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'],
        rIsRegexp = /^\/(.+)\/([gim]+)?$/,
        word, text, texts, i, userRegexp;

    // prepareRegex by JoeSimmons
    // used to take a string and ready it for use in new RegExp()
    function prepareRegex(string) {
        return string.replace(/([\[\]\^\&\$\.\(\)\?\/\\\+\{\}\|])/g, '\\$1');
    }

    // function to decide whether a parent tag will have its text replaced or not
    function isTagOk(tag) {
        return tagsWhitelist.indexOf(tag) === -1;
    }

    delete words['']; // so the user can add each entry ending with a comma,
                      // I put an extra empty key/value pair in the object.
                      // so we need to remove it before continuing

    // convert the 'words' JSON object to an Array
    for (word in words) {
        if ( typeof word === 'string' && words.hasOwnProperty(word) ) {
            userRegexp = word.match(rIsRegexp);

            // add the search/needle/query
            if (userRegexp) {
                regexs.push(
                    new RegExp(userRegexp[1], 'g')
                );
            } else {
                regexs.push(
                    new RegExp(prepareRegex(word).replace(/\\?\*/g, function (fullMatch) {
                        return fullMatch === '\\*' ? '*' : '[^ ]*';
                    }), 'g')
                );
            }

            // add the replacement
            replacements.push( words[word] );
        }
    }

    // do the replacement
    texts = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);
    for (i = 0; text = texts.snapshotItem(i); i += 1) {
        if ( isTagOk(text.parentNode.tagName) ) {
            regexs.forEach(function (value, index) {
                text.data = text.data.replace( value, replacements[index] );
            });
        }
    }

}());
