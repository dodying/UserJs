### 说明

* 本人已AFK，不再维护

* 最新版本为2.90.0，更新时间为2018-06-15

* 欢迎任何修改及Pull Request

### 目录

<!-- TOC -->

- [说明](#说明)
- [目录](#目录)
- [截图](#截图)
- [关于字体的说明](#关于字体的说明)
  - [字体方案(仅供参考)](#字体方案仅供参考)
- [自定义判断条件](#自定义判断条件)
  - [比较值](#比较值)
  - [示例](#示例)
  - [技能/物品id表](#技能物品id表)
  - [buff图片表](#buff图片表)
- [攻击规则-示例](#攻击规则-示例)
- [一些问题](#一些问题)
- [捐赠](#捐赠)
- [更新历史](#更新历史)

<!-- /TOC -->

***

### 截图

![自定义设置](https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/hvAutoAttack_Setting.png)

***

### 关于字体的说明

脚本通过文字获取信息，如果尚未修改字体，可能使某些信息无法获取，使一些错误发生。

#### 字体方案(仅供参考)

1. font-family(字形体系): Times New Roman
2. font-size(字体大小，数字，范围5~20): 12
3. font-weight(字体加粗，normal, bold, bolder, lighter): normal
4. font-style(字形，normal, italic, oblique): normal
5. vertical adjust(竖行间距，数字，范围-8~8): -5

***

### 自定义判断条件
每一个拥有红色虚线边框的区域，都可以设置自定义判断条件。

现已支持自定义的条件公式，例如`hp > mp` 或 `2 * ( hp + mp ) > sp`，支持运算符: `+` `-` `*` `/` `%` `**`(幂) `^`(异或) `~`(Log10) `&&` `||` `!` `>` `<` `>=`(`≥`) `<=`(`≤`) `==`(`=`,`===`) `!=`(`≠`,`~=`,`<>`)，逻辑运算符返回`0`或`1` （表示false或true）

* 注意：如果这些区域留空（一个条件也没设置），那么就相当于真。

当鼠标在这些区域内移动时，右上角会显示一个盒子（当鼠标不在这些区域内，盒子消失）

盒子内可见四个下拉列表和一个按钮

* 下拉列表1: 这个条件插入的位置（具体作用请看示例）

* 下拉列表2/4: 比较值A/比较值B

* 下拉列表3: 运算符

* ADD按钮: 生成一个值为 `比较值A 运算符 比较值B` 的输入框

* 仍兼容旧版本 `比较值A,比较运算符,比较值B` 的条件，其中比较运算符:（`1`:大于, `2`:小于, `3`: 大于等于, `4`: 小于等于, `5`:等于, `6`:不等于）

#### 比较值

1. `hp`/`mp`/`sp`: hp/mp/sp的*百分比的整数形式 (percent)*；`_hpDecimal`/`_mpDecimal`/`_spDecimal`: hp/mp/sp的*百分比的小数形式 (percent decimal)*
2. `oc`: Overcharge, 250==>250% *百分比的整数形式 (percent)*；`_ocDecimal`: oc的*百分比的小数形式 (percent decimal)*
3. `monsterAll`/`monsterAlive`/`bossAll`/`bossAlive`: 怪兽/Boss的总数目/存活数目，boss只按照有序号背景色的。包含`龙、大树、额外游戏内容、小马`的存活boss数可改为使用`_targetBossType_count`（见后11.3和12.）
4. `roundNow`/`roundAll`/`roundLeft`: 当前回合数/总回合数/剩余回合数
5. `isRoundType`、`ar`、`ba`、`iw`、`tw`、`gr`、`rb`: 当前是否是某战役模式，例如`_isRoundType_ar`或`_ar`均返回 `当前是否是The Arena`
6. `roundType`: 战役模式 (`ar`: The Arena, `rb`: Ring of Blood, `gr`: GrindFest, `iw`: Item World, `ba`: Random Encounter, `tw`: The Tower)

  **注意**: 字符串之间的比较会自动去除最外层的引号，如`"ar"`/`'ar'`均和`ar`一致

7. `attackStatus`: 攻击模式 (`0`: Physical, `1`: Fire, `2`: Cold, `3`: Elec, `4`: Wind, `5`: Divine, `6`: Forbidden)。 或使用 `_phys`, `_fire`, `_cold`, `_elec`, `_wind`, `_divi`, `_forb` 表示 `当前 attack mode 是否为 ...`，例如 `_phys` 等价于 `attackStatus == 0`。
   - 获取到的是默认攻击模式，可加后缀`Cur`来表示判断次要模式后的攻击模式（直接获取当前`attackStatus`需要加`_`前缀），即：`_attackStatusCur`,`_physCur`, `_fireCur`, `_coldCur`, `_elecCur`, `_windCur`, `_diviCur`, `_forbCur`
     - 具体流程：
       - 尝试次要模式攻击的流程中，会直接用尝试中的模式
         - 如果在`次要模式`的条件中配置了这些条件，都会按照`条件所在模式`来获取值，例如：切换火属性的条件中配置了`_fireCur`，会直接判定为`true`，配置了`_windCur`则是会判定为`false`
       - 其他地方则会模拟一遍攻击，然后判断能放出来的时候 给`临时变量`赋值`模拟尝试成功的模式`，然后返回临时变量
8. `fightingStyle`: 战斗风格 (`1`: 二天, `2`: 单手, `3`: 双手, `4`: 双持, `5`: 法杖)。 或使用 `_nt`, `_1h`, `_2h`, `_dw`, `_staff` 表示 `当前 fighting style 是否为 ...`，例如 `_nt` 等价于 `fightStyle == 1`
9. `isCd`: 技能/物品是否cd，格式`_isCd_id`

  **示例1**: Protection的id为411，则`!_isCd_411`表示不可施放，`_isCd_411`表示可以施放

  **示例2**: ManaElixir的id为11295，则`!_isCd_11295`表示不可使用，`_isCd_11295`表示可以使用

10. `buffStack`、`buffTurn`: 人物Buff层数/剩余时间，格式`_buffTurn_img`。可使用`_scroll`限定为卷轴buff`_buffTurn_sparklife_scroll`、使用`_png`限定为非卷轴buff`_buffTurn_sparklife_png`. 可用 `{buffA,buffB,...}` 表示获取 buffA **或** buffB （**或** 括号 `{ }` 中的任意其他buff，将返回匹配成功的第一个buff），注意内部不要包含空格，例如`_buffTurn_{stun,sleep}`.

  **示例**: Protection的img为protection，则`_buffTurn_protection == 0`表示不存在Protection的buff，`_buffTurn_protection >= 10`表示Protection的buff至少剩余10回合

11. `_targetHp`、`_targetMp`、`_targetSp`、`_targetHpDecimal`、`_targetMpDecimal`、`_targetSpDecimal`、`_targetBuffStack`、`_targetBuffTurn`、`_targetRank`、`_targetOrder`、`_targetWeight`、`_targetIsAlive`: 目标怪物的HP%、SP%、MP%、HP%（小数形式）、SP%（小数形式）、MP%（小数形式）、buff剩余时间、优先级、位置、当前权重、是否存活
    1. `_targetBuffStack`、`_targetBuffTurn_`后缀参照10.`buffStack`、`buffTurn`（如：`_targetBuffTurn_bleed != 0`表示目标bleed的buff剩余回合不等于0）。target的目标怪物遵循以下规则
       1. 默认情况的target均为权重优先级最高的目标
       2. 武器技能（马炮、T1~T3等）、法术技能（中阶、高阶）：按照 逐条条件判断>按权重逐个目标>满足任意一条条件内的所有子条目，则对该目标释放。例如下图最后的慈悲的条件：仅释放hp小于25%、拥有流血buff
        ![示例](https://github.com/user-attachments/assets/b4d0c57d-fdb1-464b-88d6-107643809339)

    2. `_targetRank`和攻击规则给出的顺序值相同（0~9，数字越小，优先级越高）
    3. `targetBossType(见12.)`和除了`targetName`的其他 目标参数可使用`max/min/sum/count`后缀来表示所有**存活**怪物中的最大/最小值/总和/sign和(`sum(sign(value))`)，如：`_targetBuffTurn_max_bleed`.
       1. `max/min/sum/count`可加前缀`a`/`ag`or`ga`/`g`表示按照`包含死亡目标（仍是全体目标）`/`分组内统计且包含死亡目标`/`分组内统计（仍忽略死亡目标）`. 分组相关见(13. `targetGroup`)
12. `targetName`、`targetBossType`: 目标怪物的名称、Boss类型。
    1. `_targetName`返回目标的名称字符串（**注意**: 字符串之间的比较会自动去除最外层的引号，且请使用下划线`_`代替空格` `，如`Yugi_Nagato`/`'Yugi_Nagato'`/`"Yugi_Nagato"`）
    2. 其中类Boss型`_targetBossType`根据 名称进行判断:
        1. `Manbearpig`、`White Bunneh`、`Mithra`、`Dalek`: 1 (BOSS)
        2. `Konata`、`Mikuru Asahina`、`Ryouko Asakura`、`Yuki Nagato`: 2 (Legendaries)
        3. `Real Life`、`Invisible Pink Unicorn`、`Flying Spaghetti Monster`: 3 (Gods)
        4. `Rhaegal`、`Viserion`、`Drogon`: 4 (A Dance with Dragons)
        5. `Skuld`、`Urd`、`Verdandi`、`Yggdrasil`: 5 (Trio and the Tree)
        6. `Recycled Boss Rush`、`Bottomless Dungeon`、`New Game +`、`Achievement Grind`、`Time Trial Mode`、`Hardcore Mode`：6 (Post Game Content)
        7. `Fluttershy`、`Gummy`、`Rainbow Dash`、`Twilight Sparkle`、`Rarity`、`Applejack`、`Pinkie Pie`、`Angel Bunny`、`Spike`：7 (Ponies)
        8. 其他: 0 (非boss)
13. `targetGroup`: 获取分组内的目标个数（包含死亡），并更改当前公式内的`目标分组`(见11.3.1). 每次公式计算的初始目标分组为`null`的空分组. 可选模式如下：
    1. `a`: 选择全体. `targetGroup_a`
    2. `s`: 按照给定数量从上往下划分，然后选取包含当前目标的一组 `targetGroup_s_2` 相当于每2个1组
    3. `r`: 按照给定的距离，以当前目标为起点划分
        1. 只有一个参数时，为对称范围. `targetGroup_r_1` 相当于`当前目标 ± 1`（共3格）
        2. 两个参数时，分别为 `targetGroup_r_向上_向下`. `targetGroup_r_1_2` 相当于当前 \[`目标 - 1`, `目标 + 2`\]（共4格）
        3. `距离 >= 10`时，溢出为 `9 - 距离`，例如：`targetGroup_r_4_10` 相当于 \[`目标 - 4`, `目标 - 1`\] （共4格）
        4. 参数缺省=`-1`/`10`: `targetGroup_r_` 相当于 `targetGroup_r_10`;`targetGroup_r_1_` 相当于 `targetGroup_r_1_10`; `targetGroup_r__1` 相当于 `targetGroup_r_10_1`. 仅在有2个`_`划分参数时会补充第2个参数
    5. `o`/`oa`: 按照给定的order(0~9)划定区域. `o`需要当前目标在区域内，否则返回0和`null`的空分组；`oa`不需要当前目标在区域内. `targetGroup_o_1_3` 相当于 `order=[1,2,3]` 即第2,3,4格
        1. 两个参数分别为上下界，缺省分别为`-1`/`10`
14. `skillOTOS`: 获取对应技能/法术/道具/防御/集中/灵动架势开/关 的**自动使用次数**（不包含手动释放的次数）, `skillOTOS_[类型]` 如 `skillOTOS_FRD`(马炮) /`skillOTOS_T1`(武器T1技能) /`skillOTOS_defend`(防御) 
    - 技能: `OFC`/`FRD`/`T3`/`T2`/`T1`
    - 法术/道具: 按 `id`
    - 防御/集中/SS开关: `defend`/`focus`/`spiriton`/`spiritoff`
15.  空白(blank): 自己输入 (the value you want to put in)

PS: 对于需要带下划线`_`开头的func式变量，可以省略`_`开头（省略时，获取值会先尝试按照dict式获取，失败时再按照func式获取）

#### 示例

![示例](https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/hvAutoAttack_CustomizeCondition.png)

图中，我设置了三个大条件（2中有两个小条件）


1. Condition 1: 总回合数大于12

2. Condition 2: Boss数大于1、hp大于hp

3. Condition 3: 怪物数大于6

只要任一大条件下所有小条件判断为真，总体就为真

以下为电路图示意图


![电路图示例](https://github.com/dodying/UserJs/raw/master/HentaiVerse/hvAutoAttack/hvAutoAttack_CustomizeConditionCircuit.png)

#### 技能/物品id表

| 1 | 2 | 3 |
| - | - | - |
| Flee / 1001 | - | - |
| Scan / 1011 | - | - |
| FUS RO DAH / 1101 | - | - |
| Orbital Friendship Cannon / 1111 | - | - |
| Skyward Sword / 2101 | - | - |
| Shield Bash / 2201 | Vital Strike / 2202 | Merciful Blow / 2203 |
| Great Cleave / 2301 | Rending Blow / 2302 | Shatter Strike / 2303 |
| Iris Strike / 2401 | Backstab / 2402 | Frenzied Blows / 2403 |
| Concussive Strike / 2501 | - | - |
| Fiery Blast / 111 | Inferno / 112 | Flames of Loki / 113 |
| Freeze / 121 | Blizzard / 122 | Fimbulvetr / 123 |
| Shockblast / 131 | Chained Lightning / 132 | Wrath of Thor / 133 |
| Gale / 141 | Downburst / 142 | Storms of Njord / 143 |
| Smite / 151 | Banishment / 152 | Paradise Lost / 153 |
| Corruption / 161 | Disintegrate / 162 | Ragnaro / 163 |
| Drain / 211 | Weaken / 212 | Imperil / 213 |
| Slow / 221 | Sleep / 222 | Confuse / 223 |
| Blind / 231 | Silence / 232 | MagNet / 233 |
| Cure / 311 | Regen / 312 | Full-Cure / 313 |
| Protection / 411 | Haste / 412 | Shadow Veil / 413 |
| Absorb / 421 | Spark of Life / 422 | Spirit Shield / 423 |
| Arcane Focus / 431 | Heartseeker / 432 |  |
| - | - | - |
| Health Draught / 11191 | Health Potion / 11195 | Health Elixir / 11199 |
| Mana Draught / 11291 | Mana Potion / 11295 | Mana Elixir / 11299 |
| Spirit Draught / 11391 | Spirit Potion / 11395 | Spirit Elixir / 11399 |
| Energy Drink / 11401 | - | - |
| Last Elixir / 11501 | - | - |
| Infusion of Flames / 12101 | Infusion of Frost / 12201 | Infusion of Lightning / 12301 |
| Infusion of Storms / 12401 | Infusion of Divinity / 12501 | Infusion of Darkness / 12601 |
| Scroll of Swiftness / 13101 | Scroll of Protection / 13111 | Scroll of the Avatar / 13199 |
| Scroll of Absorption / 13201 | Scroll of Shadows / 13211 | Scroll of Life / 13221 |
| Scroll of the Gods / 13299 | - | - |
| Flower Vase / 19111 | Bubble-Gum / 19131 | - |

#### buff图片表

| 1 | 2 | 3 |
| - | - | - |
| Channeling / channeling | Regen / regen | Focus / focus |
| Protection / protection | Haste / haste | Shadow Veil / shadowveil |
| Absorb / absorb | Spark of Life / sparklife | Spirit Shield / spiritshield |
| Arcane Focus / arcanemeditation | Heartseeker / heartseeker | Cloak of the Fallen / fallenshield |
| Health Draught / healthpot | Mana Draught / manapot | Spirit Draught / spiritpot |
| Infusion of Flames / fireinfusion | Infusion of Frost / coldinfusion | Infusion of Lightning / elecinfusion |
| Infusion of Storms / windinfusion | Infusion of Divinity / holyinfusion | Infusion of Darkness / darkinfusion |
| Scroll of Swiftness / haste_scroll | - | - |
| Flower Vase / flowers | Bubble-Gum / gum | Blessing of the RiddleMaster / riddlemaster |
| Sleep / sleep | Blind / blind | Slow / slow |
| Imperil / imperil | MagNet / magnet | Silence / silence |
| Drain / drainhp | Weaken / weaken | Confuse / confuse |
| Coalesced Mana / coalescemana | Stunned / stun / wpn_stun | Penetrated Armor / ap / wpn_ap |
| Bleeding Wound / bleed / wpn_bleed | Absorbing Ward / absorb | Fury of the Sisters / trio_furyofthesisters |
| Lamentations of the Future / trio_skuld | Screams of the Past / trio_urd | Wailings of the Present / trio_verdandi | Searing Skin / firedot | Freezing Limbs / coldslow |
| Freezing Limbs / coldslow | Turbulent Air / windmiss | Deep Burns / elecweak |
| Searing Skin / firedot | - | Breached Defense / holybreach |
Blunted Attack / darknerf | Burning Soul / soulfire | Ripened Soul / ripesoul |
| Ether Tap / wpn_et | - | - |

***

### 攻击规则-示例

| 敌人 id | 现在 hp | 初始 PW | Imperiled (-2) | Drained (-1) | Confused (+2) | 最终 PW |
| - | - | - | - | - | - | - |
| 1 | 20K | 10 | √ | | √ | 10 |
| 2 | 30K | 15 | | √ | | 14 |
| 3 | 40K | 20 | √ | | | 18 |

*注意*: 脚本优先攻击最小PW值的敌人。


在这个例子中，脚本接下来先攻击敌人1。

***

### 一些问题

* Q: [使用Chrome浏览器时,音频无法自动播放](https://github.com/dodying/UserJs/issues/31)

  A: 打开网页 `chrome://flags/#autoplay-policy`, 并选择 `No user gesture is required`

***

***

### 更新历史

* 最新
1. 详见 [History for hvAutoAttack - github](https://github.com/dodying/UserJs/commits/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js)

* 2.58
1. 版本2.57a中，移除了临时攻击模式
2. 为两个特殊技能增加oc阈值

* 2.57
1. 感谢网友maoboshi，现在支持特殊技能龙吼

* 2.56
1. 增加了选项来控制使用Draught级别药水的使用
2. 修改了De技能

* 2.55
1. 增加了脚本语言选项
2. 修复了Riddle无法警报的问题（主要原因没有找到...通过调整了一下位置，暂时解决）

* 2.54
1. 修复了卷轴的问题，因为涉及配置的变更，所以推进一个版本号
2. 内置了[RiddleLimiter Plus](https://forums.e-hentai.org/index.php?showtopic=65126&st=1020&p=3000982&#entry3000982)，同时绑定了keydown事件，当按下ABC/123时自动答题并提交
3. 上个版本后增加了【本地储存】页面，方便导出，编辑
4. 接下来可能将内置[HV Random Encounter Notification](http://forums.e-hentai.org/index.php?showtopic=65126&st=1000&p=2990345&#entry2990345)

* 2.53
0. 2.51-2.52的版本说明忘了、忘了、忘了
1. 脚本的变量基本重新命名（看了命名法后，强迫症...），所以以前的设置没用了，没用了，没用了
2. 按钮取代快捷键
3. 警报：可自定义==>默认
4. 增加功能：记录Riddle的图片地址与答案
5. 增加功能：在竞技场页面停留【？】秒后，自动开始竞技场
6. 增加功能：将Reloader脚本内置，自行选择是否开启该功能
7. 卷轴使用条件详细化
8. 一些优化（骗人的）

* 2.50
1. 增加【自定义】当【小马】答题时间≤【？】秒，如果输入框为空则随机生成答案并提交，否则直接提交
2. 删除【自定义】弱点打击
3. 当Stamina小于10，则自动逃跑

* 2.491
1. 修正一个书写错误

* 2.49
1. 增加【自定义】使用卷轴、魔药
2. 去除【本地储存】战斗类型（注：可能还会加回来）

* 2.481
1. 更改检查Buff的一些细节

* 2.48
1. 增加【自定义】使用Last Elixir

* 2.473
1. 增加功能【临时修复】

* 2.471
1. 更改【自定义】默认快捷键
2. Reloader下延时攻击，非Reloader不延时

* 2.47
1. 修改【自定义】Spirit Stance的开启界限为自定义

* 2.461
1. 修改【设置】界面

* 2.46
1. 增加【自定义】开启Spirit Stance，特殊技能OFC

* 2.45
1. 增加【自定义】权重设置
2. 更改某些设置显示方式

* 2.44
1. 增加【自定义】De技能-Confuse
2. 修复一个书写错误

* 2.43
1. 优化怪物的储存信息
2. 更改自动打怪算法
3. 变【浴血模式】为【非浴血模式】，同时增加【非浴血模式】的警告HP
4. HP/MP/SP 1/2/3含义改为相同
5. 优化【设置】显示方式，有些设置需要前置设置勾选后后才出现
6. 变更De技能的施放模式：1、只对Boss施放 2、对所有怪施放

* 2.42
1. 增加几个De技能

* 2.414
1. 变更细节

* 2.412
1. 增加一个网页，提交Bug与建议

* 2.41
1. 增加【自定义】：HP/MP/SP3

* 2.40
1. 增加【自定义】：1、Reloader防误操作模式 2、增益技能与Channel技能条件
2. 添加一些【自定义】De技能

* 2.39
1. 修复一个设置上的Bug

* 2.38
1. 增加【自定义】：De技能
2. 修改统计血量的方式

* 2.37
1. 增加【自定义】：技能释放条件
2. 去除【自定义】：延时攻击2
3. 准备加入：优先攻击【魔力合流】的怪兽（后删除）

* 2.36
1. 增加【自定义】：弱点打击
2. 更改战斗信息提示方式

* 2.35
1. 更改支持Reloader的方式：从【定时器】到【MutationObserver】
2. 正式支持【自定义】：增益技能与Channel技能

* 2.346
1. 变检查脚本版本的方式从【所有字符】到【前4个字符】
2. X.AB到X.ABX的版本更新，不在提示重新设置自定义

* 2.345
1. 测试功能：更改选择【自动使用De技能】对象从随机到按id顺序

* 2.34
1. 增加【重置设置】的按钮
2. 更改保存【自定义】设置的方式

* 2.33
1. 通过【定时器】来支持Reloader
2. 增加【自定义】：开启Reloader
3. 更改记录怪物血量的方式

* 2.32
1. 准备加入【自定义】：De技能
2. 增加检查【自定义】打怪模式是否选择，音频格式是否正确

* 2.30
1. 优化移除【本地储存】的方式
2. 增加【自定义】：快捷键
3. 准备加入【自定义】：增益技能与Channel技能

* 2.22
1. 增加功能【服务器错误则刷新页面】
2. 增加功能【检查脚本版本】
3. 再次修改默认快捷键

* 2.201
1. 修复【延时攻击2】失效的Bug

* 2.20
1. 增加【自定义】：延时攻击、HP/MP/SP条
2. 修改默认快捷键
3. 修改本地储存【localStorage】的前缀【HV_AutoAttack】为【HVAA】

* 2.11
1. 修复【浴血模式】的Bug

* 2.10
1. 正式加入【自定义】功能
2. 增加【自定义】：浴血模式

* 2.0
上个版本连1.1都不到，就进入了2.0
是因为，我不小心看到了战斗记录里的HP显示，正式脱离HVSTAT
脚本自身获取并计算怪物生命值，同时回合计数（以前都是依赖HVSTAT实现的）

* 1.045
1. 准备加入【自定义】功能
2. 支持【自定义】的有：1、答题暂停 2、默认打怪模式选择 3、警告声自定义

* 1.04
1. 加入HVSTAT检查功能（当初脚本依赖HVSTAT）

* 1.03
1. 增加了【血量过低则提醒】的功能
2. 加入打怪的延时时间——1s

* 1.02
1. HV的图片路径变更，脚本也就更新
2. 更改了查找【药水】元素的方式

* 1
灵感来自hoverplay，刚开始接触js，初步完成代码
功能有：答题警报、其他警报、快捷键、自动前进、自动使用宝石、自动回复、自动使用增益技能、自动打怪
很可惜，玩游戏不走心，一直搞不懂HVSTAT是怎么知道每个怪的血量的，直到[版本2.0](#20)

















