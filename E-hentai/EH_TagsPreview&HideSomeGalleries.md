# 可能由于脚本编写过程中产生的Bug<del>网络问题</del>导致脚本失效，失效请反馈

#### 推荐一下别人家的标签预览脚本——[ExHentai &amp; g.E-Hentai Tags Preview](https://greasyfork.org/zh-CN/scripts/4066)

#### 以前我都是用这个的，前不久看见了EH的Api，感觉用Api实现的话，可以节省流量，不用老是xhr，缺点就是获取到的标签超级乱啊

##### [EHWiki里的Api条目](https://ehwiki.org/wiki/API)里有对于标签的类别(如parody、group)，然而返回的数据里我并没有找到...

### 写脚本的时候先是完成了标签预览的功能，所以准备实现隐藏功能的时候懵逼了

### 现在，将自动隐藏某些画廊

<s>

###### 图方便，就决定采用【移动到网址上→有不喜欢的标签→隐藏】的方式了（这样写，超级简单。摔）
</s>

* * *

更改了一些细节，并增加了翻译标签的功能【翻译预览的标签...】
翻译是抄自[Etag](https://greasyfork.org/zh-CN/scripts/17966)（这作者最近又写了一个翻译标签的脚本，优点是统一了数据库，在这里安利一下[E绅士标签构建者](https://greasyfork.org/zh-CN/scripts/19619)）
效果见图
![效果图](https://greasyfork.org/system/screenshots/screenshots/000/004/192/original/1.png?1463291126)