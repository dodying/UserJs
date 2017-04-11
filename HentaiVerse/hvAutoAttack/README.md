### TODO
---------------------
##### Low-priority TODO
1. Boss判断(2选1)：a.一次攻击对怪的血量减少百分比  b.怪hp接近于Bosshp的百分之几(自定，默认值未确定)
2. De技能：这一功能**可能**将退回到以前版本
3. 攻击规则: 1.攻击血量减少最大的怪兽，判断条件：Boss数≥2

### 兼容性

##### Compatible
1. Firefox + Greasemonkey
2. Chrome/Chromium + Tampermonkey
3. Android + Firefox + Usi
4. iPhone/iPad (Jailbroken) + UserscriptLoader (Compatible with iOS 5, 6, 7, 8, 9, 10)

### 截图

##### Screenshots

###### 自定义设置

![自定义设置](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_Setting.png)

### 攻击规则-示例

##### Attack Rule Example

<table><tbody>
<tr><td>Enemy id</td><td>now hp</td><td>init PW</td><td>Imperil Effective<br>(-2)</td><td>Drain Effective<br>(-1)</td><td>Confuse Effective<br>(+2)</td><td>PW</td></tr>
<tr><td>1</td><td>20K</td><td>10</td><td>√</td><td></td><td>√</td><td>10</td></tr>
<tr><td>2</td><td>30K</td><td>15</td><td></td><td>√</td><td></td><td>14</td></tr>
<tr><td>3</td><td>40K</td><td>20</td><td>√</td><td></td><td></td><td>18</td></tr>
</tbody></table>

**注意**: 脚本优先攻击最小PW值的敌人。

**NOTE**: The script will attack enemy who has the least PW first.

在这个例子中，脚本接下来先攻击敌人1。

In this example, the script will attack enemy 1 next.

### 关于字体的说明

##### About Font

脚本通过文字获取信息，如果尚未修改字体，可能使某些信息无法获取，使一些错误发生。

Scripts get information through text, and if you have not yet modified the font, some information may not be available, causing some errors to occur.

#### 字体方案（仅供参考）

###### Font Preference (for reference only)

![字体方案（仅供参考）](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_Font.gif)

1. font-family(字形体系): Times New Roman
2. font-size(字体大小，数字，范围5~20): 12
3. font-weight(字体加粗，normal, bold, bolder, lighter): normal
4. font-style(字形，normal, italic, oblique): normal
5. vertical adjust(竖行间距，数字，范围-8~8): -5

### 自定义判断条件

##### Customize Condition

每一个拥有红色虚线边框的区域，都可以设置自定义判断条件。

Each area with a red dotted border can be set to a customize condition.

###### 注意：如果这些区域留空（一个条件也没设置），那么就相当于真。

###### If these areas are left blank (a condition is not set), then it's equivalent to true.

当鼠标在这些区域内移动时，右上角会显示一个盒子（当鼠标不在这些区域内，盒子消失）

When the mouse moves in these areas, a box is displayed in the upper right corner. (When the mouse out, the box disappears)

盒子内可见四个下拉列表和一个按钮

Four drop down lists and one button are visible in the box

##### 下拉列表1: 这个条件插入的位置（具体作用请看示例）

##### Drop-down List 1: the location of this condition inserted (see the example for specific effects)

##### 下拉列表2/4: 比较值A/比较值B

##### Drop-down List 2/4: comparison value A / comparison value B

###### 比较值

###### Comparison Value

1. `hp`/`mp`/`sp`: hp/mp/sp的**百分比 (percent)**
2. `oc`: Overcharge, 250==>250%
3. `monsterAll`/`monsterAlive`/`bossAll`/`bossAlive`: 怪兽/Boss的总数目/存活数目
4. `roundNow`/`roundAll`: 当前回合数/总回合数
5. `roundType`: 战役模式 (`ar`: The Arena, `rb`: Ring of Blood, `gr`: GrindFest, `iw`: Item World, `ba`: Random Encounter)，由于是字符串之间的比较，所以请加上引号，如"ar"/'ar' (Because comparison between strings, please add quotation, such as `"ar"`/`'ar'`)
6. `attackStatus`: 攻击模式 (`0`: Physical, `1`: Fire, `2`: Cold, `3`: Elec, `4`: Wind, `5`: Divine, `6`: Forbidden)
7. `turn`: Turns
8. 空白(blank): 自己输入 (the value you want to put in)

##### 下拉列表3: 暂时只支持比较运算符（`1`:大于, `2`:小于, `3`: 大于等于, `4`: 小于等于, `5`:等于, `6`:不等于）

##### Drop-down List 3: temporarily only support comparison operator (`1`: >, `2`: <, `3`: ≥, `4`: ≤, `5`: =, `6`: ≠)

##### ADD按钮: 生成一个值为`比较值A,比较值,比较值B`的输入框

##### Button ADD: Generates an input box with a value of `A,Comparison-Operator,B`

#### 示例

#### example

![示例](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_CustomizeCondition.png)

图中，我设置了三个大条件（2中有两个小条件）

In the picture, I set three big conditions (2 contains two small conditions)

1. Condition 1: 总回合数大于12 (total rounds more than 12)

2. Condition 2: Boss数大于1、hp大于hp (bosses more than 1 and hp more than hp)

3. Condition 3: 怪物数大于6 (monsters more than 6)

只要任一大条件下所有小条件判断为真，总体就为真

It's TRUE, when any big condition is true (To judge big condition is true, all small condition must true)

以下为电路图示意图

The following is a schematic diagram of the circuit diagram

![电路图示例](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_CustomizeConditionCircuit.png)

### 更新历史

##### ChangeLog

##### 最新版

###### Latest

##### 2.73
1. 更多自定义判断条件
2. 内置Random Encounter Notification(并不，其实是自己写的简陋的版本)
3. 其他一些变更

###### 2.73 (English)
1. Customize conditions
2. New Built-in Plugin: Random Encounter Notification
3. Some other changes

##### 2.72
1. 自定义判断条件
2. 其他一些变更

##### 2.71
1. 选项变更: 闲置竞技场
2. 选项新增: Turn自动刷新，自动逃跑，持续Turns

##### 2.70
1. 选项新增: 自定义施放顺序
2. 大部分的选项名称变更，所以原先的设置大部分失效，推荐先导出设置，然后在对照一一设置，抱歉

##### 2.69
1. 功能回归: 掉落监测(WoC，因为函数Reloader变更，原先的独立脚本失效了...)
2. 移动端优化

##### 2.68
1. 功能移除: 掉落监测（已独立为一个脚本，可通过`推荐脚本`添加）
2. 选项变更: 闲置竞技场

##### 2.67
1. 选项新增: Ether Tap

##### 2.66
1. 选项去除: 相当于默认勾选，如Reloader
2. 选项变更: 装备损坏、闲置竞技场
3. 选项新增: 小马弹警框、所有敌人Imperil
4. 自动修复: 当敌人状况缺失或数量不对，自行修复
5. 快捷链接: 可在"关于本脚本"中进行相关设置
6. 攻击规则: 如果敌人相邻两只敌人已死（或不存在），则给其权重增加0.5（相当于不优先攻击这些敌人）

##### 2.65
1. 感谢[Koko191](https://greasyfork.org/forum/profile/18194/Koko191)帮助翻译了英文版本
2. 增加了武器技能

##### 2.64
1. 增加Stamina减少检测
2. 自定义要进行的竞技场
3. 自定义当装备损坏时，是否提醒

##### 2.63
1. 增加暂停热键
2. 增加自定义警报

##### 2.62
1. 可选择是否开启音频通知（推荐开启）
2. 增加桌面通知，可在设置中开启（推荐开启）

##### 2.61
1. 针对Spirit Stance，增加对于SP的判断

##### 2.60
1. 掉落监测强化

##### 2.59
1. 移除本地储存选项卡
2. 增加掉落检测功能与对应选项卡

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
