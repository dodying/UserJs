### Index

* 0.[Another Way to Use-Bookmarklet](#another-way-to-use-bookmarklet)
* 1.[Screenshots](#screenshots)
* 2.[About Font](#about-font)
* __2.1[Font Preference (for reference only)](#font-preference-for-reference-)
* 3.IMPORTANT: [Customize Condition](#customize-condition)
* __3.1[Comparison Value](#comparison-value)
* __3.2[Example](#example)
* __3.3[Skill/Item ID Table](#skillitem-id-table)
* __3.4[Buff Image Table](#buff-image-table)
* 4.[Attack Rule Example](#attack-rule-example)

***

### Another Way to Use-Bookmarklet

Please add the following snippet add to bookmark, and use in hentaiver page.

`javascript:(function()%7B(function()%20%7Bvar%20a%20%3D%20document.body.appendChild(document.createElement('iframe'))%3Bdocument.querySelectorAll('body%3E*').forEach(function(i)%20%7Bi.style.display%20%3D%20'none'%3B%7D)%3Ba.style.cssText%20%3D%20'position%3Aabsolute%3Btop%3A-2px%3Bleft%3A-2px%3Bwidth%3A100%25%3Bheight%3A708px%3Bz-index%3A99999%3B'%3Ba.onload%20%3D%20function()%20%7Bvar%20b%20%3D%20a.contentWindow.document.body.appendChild(document.createElement('script'))%3Bb.src%20%3D%20'https%3A%2F%2Fgithub.com%2Fdodying%2FUserJs%2Fraw%2Fmaster%2FHentaiVerse%2FhvAutoAttack%2FhvAutoAttack.user.js'%3B%7D%3Ba.src%20%3D%20location.href%3B%7D)()%7D)()`

***

### Screenshots

![hvAutoAttack_Setting](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_Setting.png)

***

### About Font

Scripts get information through text, and if you have not yet modified the font, some information may not be available, causing some errors to occur.

#### Font Preference (for reference only)

1. font-family: Times New Roman
2. font-size: 12
3. font-weight (normal, bold, bolder, lighter): normal
4. font-style (normal, italic, oblique): normal
5. vertical adjust: -5

***

### Customize Condition


Each area with a red dotted border can be set to a customize condition.

* If these areas are left blank (a condition is not set), then it's equivalent to true.

When the mouse moves in these areas, a box is displayed in the upper right corner. (When the mouse out, the box disappears)

Four drop down lists and one button are visible in the box

* Drop-down List 1: the location of this condition inserted (see the example for specific effects)

* Drop-down List 2/4: comparison value A / comparison value B

* Drop-down List 3: only support comparison operator (`1`: >, `2`: <, `3`: ≥, `4`: ≤, `5`: =, `6`: ≠)

* Button ADD: Generates an input box with a value of `A,Comparison-Operator,B`

#### Comparison Value

1. `hp`/`mp`/`sp`: **percent** of hp/mp/sp, 0-100
2. `oc`: Overcharge, 0-250
3. `monsterAll`/`monsterAlive`/`bossAll`/`bossAlive`: amount of all monster/boss (alive)
4. `roundNow`/`roundAll`/`roundLeft`
5. `roundType`: Battle Type (`ar`: The Arena, `rb`: Ring of Blood, `gr`: GrindFest, `iw`: Item World, `ba`: Random Encounter)

  (**Note**: Because comparison between strings, please add quotation, such as `"ar"`/`'ar'`)

6. `attackStatus`: Attack Mode (`0`: Physical, `1`: Fire, `2`: Cold, `3`: Elec, `4`: Wind, `5`: Divine, `6`: Forbidden)
7. `isCd`: whether the skill/item is cooldowning, format: `_isCd_id`

  **example 1**: the id of Protection is 411 , `_isCd_411,5,0` means Protection can't be casted or `_isCd_411,5,1` means Protection can be casted

  **example 2**: the id of ManaElixir is 11295, `_isCd_11295,5,0` means ManaElixir can't be used or `_isCd_11295,5,1` means ManaElixir can be used

8. `buffTurn`: time the buff last in person, format`_buffTurn_img`

  **example**: the image of Protection is protection, `_buffTurn_protection,5,0` means you don't have the buff of Protection or `_buffTurn_protection,3,10` means the the buff of Protection on you last at least 10 turns

9. blank: the value you want to put in

#### Example

![example](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_CustomizeCondition.png)

In the picture, I set three big conditions (2 contains two small conditions)

1. Condition 1: total rounds more than 12

2. Condition 2: bosses more than 1 and hp more than hp

3. Condition 3: monsters more than 6

It's TRUE, when any big condition is true (To judge big condition is true, all small condition must true)

The following is a schematic diagram of the circuit diagram

![schematic diagram](https://raw.githubusercontent.com/dodying/UserJs/master/HentaiVerse/hvAutoAttack/hvAutoAttack_CustomizeConditionCircuit.png)

#### Skill/Item ID Table

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

#### Buff Image Table

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

### Attack Rule Example

| Enemy id | now hp | init PW | Imperiled (-2) | Drained (-1) | Confused (+2) | PW |
| - | - | - | - | - | - | - |
| 1 | 20K | 10 | √ | | √ | 10 |
| 2 | 30K | 15 | | √ | | 14 |
| 3 | 40K | 20 | √ | | | 18 |

**NOTE**: The script will attack enemy who has the least PW first.

In this example, the script will attack enemy 1 next.
