### 目录

* 1.[截图](#截图)
* 2.[关于字体的说明](#关于字体的说明)
* __2.1[字体方案(仅供参考)](#字体方案仅供参考)
* 3.必看: [自定义判断条件](#自定义判断条件)
* __3.1[比较值](#比较值)
* __3.2[示例](#示例)
* __3.3[技能/物品id表](#技能物品id表)
* __3.4[buff图片表](#buff图片表)
* 4.[攻击规则-示例](#攻击规则-示例)
* 5.[更新历史](#更新历史)
* __5.1[最新](#最新)

***

### 截图

![自定义设置](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_Setting.png)

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

* 注意：如果这些区域留空（一个条件也没设置），那么就相当于真。

当鼠标在这些区域内移动时，右上角会显示一个盒子（当鼠标不在这些区域内，盒子消失）

盒子内可见四个下拉列表和一个按钮

* 下拉列表1: 这个条件插入的位置（具体作用请看示例）

* 下拉列表2/4: 比较值A/比较值B

#### 比较值

1. `hp`/`mp`/`sp`: hp/mp/sp的*百分比 (percent)*
2. `oc`: Overcharge, 250==>250%
3. `monsterAll`/`monsterAlive`/`bossAll`/`bossAlive`: 怪兽/Boss的总数目/存活数目
4. `roundNow`/`roundAll`/`roundLeft`: 当前回合数/总回合数/剩余回合数
5. `roundType`: 战役模式 (`ar`: The Arena, `rb`: Ring of Blood, `gr`: GrindFest, `iw`: Item World, `ba`: Random Encounter)

  **注意**: 由于是字符串之间的比较，所以请加上引号，如"ar"/'ar'
6. `attackStatus`: 攻击模式 (`0`: Physical, `1`: Fire, `2`: Cold, `3`: Elec, `4`: Wind, `5`: Divine, `6`: Forbidden)
7. `isCd`: 技能/物品是否cd，格式`_isCd_id`

  **示例1**: Protection的id为411，则`_isCd_411,5,0`表示不可施放，`_isCd_411,5,1`表示可以施放

  **示例2**: ManaElixir的id为11295，则`_isCd_11295,5,0`表示不可使用，`_isCd_11295,5,1`表示可以使用
8. `buffTurn`: 人物Buff剩余时间，格式`_buffTurn_img`

  **示例**: Protection的img为protection，则`_buffTurn_protection,5,0`表示不存在Protection的buff，`_buffTurn_protection,3,10`表示Protection的buff至少剩余10回合
9. 空白(blank): 自己输入 (the value you want to put in)

* 下拉列表3: 只支持比较运算符（`1`:大于, `2`:小于, `3`: 大于等于, `4`: 小于等于, `5`:等于, `6`:不等于）

* ADD按钮: 生成一个值为`比较值A,比较值,比较值B`的输入框

#### 示例

![示例](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_CustomizeCondition.png)

图中，我设置了三个大条件（2中有两个小条件）


1. Condition 1: 总回合数大于12

2. Condition 2: Boss数大于1、hp大于hp

3. Condition 3: 怪物数大于6

只要任一大条件下所有小条件判断为真，总体就为真

以下为电路图示意图


![电路图示例](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_CustomizeConditionCircuit.png)

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
| - | Regen / regen | - |
| Protection / protection | Haste / haste | Shadow Veil / shadowveil |
| Absorb / absorb | Spark of Life / sparklife | Spirit Shield / spiritshield |
| Arcane Focus / arcanemeditation | Heartseeker / heartseeker | Cloak of the Fallen / 423 |
| Health Draught / healthpot | Mana Draught / manapot | Spirit Draught / spiritpot |
| Infusion of Flames / fireinfusion | Infusion of Frost / coldinfusion | Infusion of Lightning / elecinfusion |
| Infusion of Storms / windinfusion | Infusion of Divinity / holyinfusion | Infusion of Darkness / darkinfusion |
| Scroll of Swiftness / haste_scroll | - | - |
| Flower Vase / flowers | Bubble-Gum / gum | - |

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

### 更新历史

##### 最新
1. 详见 [History for hvAutoAttack - github](https://github.com/dodying/UserJs/commits/master/HentaiVerse/hvAutoAttack/hvAutoAttack.user.js)

##### ...

##### 2.58
1. 版本2.57a中，移除了临时攻击模式
2. 为两个特殊技能增加oc阈值

##### 2.57
1. 感谢网友maoboshi，现在支持特殊技能龙吼

##### 2.56
1. 增加了选项来控制使用Draught级别药水的使用
2. 修改了De技能

##### 2.55
1. 增加了脚本语言选项
2. 修复了Riddle无法警报的问题（主要原因没有找到...通过调整了一下位置，暂时解决）

##### 2.54
1. 修复了卷轴的问题，因为涉及配置的变更，所以推进一个版本号
2. 内置了[RiddleLimiter Plus](https://forums.e-hentai.org/index.php?showtopic=65126&st=1020&p=3000982&#entry3000982)，同时绑定了keydown事件，当按下ABC/123时自动答题并提交
3. 上个版本后增加了【本地储存】页面，方便导出，编辑
4. 接下来可能将内置[HV Random Encounter Notification](http://forums.e-hentai.org/index.php?showtopic=65126&st=1000&p=2990345&#entry2990345)

##### 2.53
0. 2.51-2.52的版本说明忘了、忘了、忘了
1. 脚本的变量基本重新命名（看了命名法后，强迫症...），所以以前的设置没用了，没用了，没用了
2. 按钮取代快捷键
3. 警报：可自定义==>默认
4. 增加功能：记录Riddle的图片地址与答案
5. 增加功能：在竞技场页面停留【？】秒后，自动开始竞技场
6. 增加功能：将Reloader脚本内置，自行选择是否开启该功能
7. 卷轴使用条件详细化
8. 一些优化（骗人的）

##### 2.50
1. 增加【自定义】当【小马】答题时间≤【？】秒，如果输入框为空则随机生成答案并提交，否则直接提交
2. 删除【自定义】弱点打击
3. 当Stamina小于10，则自动逃跑

##### 2.491
1. 修正一个书写错误

##### 2.49
1. 增加【自定义】使用卷轴、魔药
2. 去除【本地储存】战斗类型（注：可能还会加回来）

##### 2.481
1. 更改检查Buff的一些细节

##### 2.48
1. 增加【自定义】使用Last Elixir

##### 2.473
1. 增加功能【临时修复】

##### 2.471
1. 更改【自定义】默认快捷键
2. Reloader下延时攻击，非Reloader不延时

##### 2.47
1. 修改【自定义】Spirit Stance的开启界限为自定义

##### 2.461
1. 修改【设置】界面

##### 2.46
1. 增加【自定义】开启Spirit Stance，特殊技能OFC

##### 2.45
1. 增加【自定义】权重设置
2. 更改某些设置显示方式

##### 2.44
1. 增加【自定义】De技能-Confuse
2. 修复一个书写错误

##### 2.43
1. 优化怪物的储存信息
2. 更改自动打怪算法
3. 变【浴血模式】为【非浴血模式】，同时增加【非浴血模式】的警告HP
4. HP/MP/SP 1/2/3含义改为相同
5. 优化【设置】显示方式，有些设置需要前置设置勾选后后才出现
6. 变更De技能的施放模式：1、只对Boss施放 2、对所有怪施放

##### 2.42
1. 增加几个De技能

##### 2.414
1. 变更细节

##### 2.412
1. 增加一个网页，提交Bug与建议

##### 2.41
1. 增加【自定义】：HP/MP/SP3

##### 2.40
1. 增加【自定义】：1、Reloader防误操作模式 2、增益技能与Channel技能条件
2. 添加一些【自定义】De技能

##### 2.39
1. 修复一个设置上的Bug

##### 2.38
1. 增加【自定义】：De技能
2. 修改统计血量的方式

##### 2.37
1. 增加【自定义】：技能释放条件
2. 去除【自定义】：延时攻击2
3. 准备加入：优先攻击【魔力合流】的怪兽（后删除）

##### 2.36
1. 增加【自定义】：弱点打击
2. 更改战斗信息提示方式

##### 2.35
1. 更改支持Reloader的方式：从【定时器】到【MutationObserver】
2. 正式支持【自定义】：增益技能与Channel技能

##### 2.346
1. 变检查脚本版本的方式从【所有字符】到【前4个字符】
2. X.AB到X.ABX的版本更新，不在提示重新设置自定义

##### 2.345
1. 测试功能：更改选择【自动使用De技能】对象从随机到按id顺序

##### 2.34
1. 增加【重置设置】的按钮
2. 更改保存【自定义】设置的方式

##### 2.33
1. 通过【定时器】来支持Reloader
2. 增加【自定义】：开启Reloader
3. 更改记录怪物血量的方式

##### 2.32
1. 准备加入【自定义】：De技能
2. 增加检查【自定义】打怪模式是否选择，音频格式是否正确

##### 2.30
1. 优化移除【本地储存】的方式
2. 增加【自定义】：快捷键
3. 准备加入【自定义】：增益技能与Channel技能

##### 2.22
1. 增加功能【服务器错误则刷新页面】
2. 增加功能【检查脚本版本】
3. 再次修改默认快捷键

##### 2.201
1. 修复【延时攻击2】失效的Bug

##### 2.20
1. 增加【自定义】：延时攻击、HP/MP/SP条
2. 修改默认快捷键
3. 修改本地储存【localStorage】的前缀【HV_AutoAttack】为【HVAA】

##### 2.11
1. 修复【浴血模式】的Bug

##### 2.10
1. 正式加入【自定义】功能
2. 增加【自定义】：浴血模式

##### 2.0
上个版本连1.1都不到，就进入了2.0
是因为，我不小心看到了战斗记录里的HP显示，正式脱离HVSTAT
脚本自身获取并计算怪物生命值，同时回合计数（以前都是依赖HVSTAT实现的）

##### 1.045
1. 准备加入【自定义】功能
2. 支持【自定义】的有：1、答题暂停 2、默认打怪模式选择 3、警告声自定义

##### 1.04
1. 加入HVSTAT检查功能（当初脚本依赖HVSTAT）

##### 1.03
1. 增加了【血量过低则提醒】的功能
2. 加入打怪的延时时间——1s

##### 1.02
1. HV的图片路径变更，脚本也就更新
2. 更改了查找【药水】元素的方式

##### 1
灵感来自hoverplay，刚开始接触js，初步完成代码
功能有：答题警报、其他警报、快捷键、自动前进、自动使用宝石、自动回复、自动使用增益技能、自动打怪
很可惜，玩游戏不走心，一直搞不懂HVSTAT是怎么知道每个怪的血量的，直到[版本2.0](#20)
