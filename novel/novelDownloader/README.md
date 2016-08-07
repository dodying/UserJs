#### 由于引用外来库的原因，可能导致安装时间过长或是无法正常安装。请耐心等待并尝试多次。

#### 此脚本引用的库，感谢他们 jQuery [FileSaver](https://github.com/eligrey/FileSaver.js) [jszip](https://github.com/Stuk/jszip) [jquery-s2t](https://github.com/hustlzp/jquery-s2t)

### 使用说明

#### 在目录页或是章节页使用。

#### 按“Shift+D”来显示下载选项。

#### 关于【特定下载某些章节】功能的一些提示：可以使用带有【Snap Links】字样的附加组件或扩展或UC脚本

#### 如果某章节长时间无法下载，请刷新重试。

### 意见、建议、Bug

#### 两个地址：[Github-issues](https://github.com/dodying/UserJs/issues)与[GF-反馈](https://greasyfork.org/zh-CN/scripts/21515-noveldownloader/feedback)

#### 想添加其他网站可以在**上面两个地方**发布讨论，或是尝试自行修改代码。

#### 同时，请务必分享你添加的代码。感激不尽。

#### 如果脚本出错，请务必发布讨论，以便帮助作者能及时发现并修正它们。

######预览

![预览1](https://raw.githubusercontent.com/dodying/UserJs/master/novel/novelDownloader/1.png)

### helpWanted 作者需要帮助

iOS：生成的Epub格式电子书在[iBook](#iBook)中只显示每章节**前两页**，在[开卷有益](#KingReader)中显示**【不支持的epub格式】**，在[Anyview](#Anyview)中可以正常阅读。

Android：未测试...

ps.果然[Anyview](#Anyview)很好很强大。

### 自定义站点规则说明

#### 利用通配符添加网址

1. ```http://www.example1.com/files/article/html/*.html```
2. ```http://www.example2.com/Book/*```

#### 目录页规则示例

##### addIRule('域名','网站名称','小说标题-选择器','章节链接-选择器','Vip或是要过滤的章节链接-选择器，可省略','布尔，是否对章节链接进行排序，可省略','数字，限制下载线程数');

1. ```addIRule('www.example1.com','示例网站1','h1','#list>dd>dl>a');```
2. ```addIRule('www.example2.com','示例网站2','h1','#list>dd>dl>a','',true);```
3. ```addIRule('www.example3.com','示例网站3','h1','#list>dd>dl>a','',false,1);```

#### 章节规则示例

##### addCRule('域名','章节标题-选择器','章节内容-选择器','数字型,0-简体,1-繁体','可省略,数字型,文档编码,unicode则留空,简体中文则填1');

1. ```addCRule('www.example1.com','h1','#content',0);```
2. ```addCRule('www.example2.com','h1','#content',0,1);```

#### 章节内容替换示例（|||三竖杆为分隔符，如果替换为空字符串，可以不写|||）

##### addRRule('域名','要匹配的正则表达式1|||替换后的文本1','要匹配的正则表达式2|||替换后的文本2',...);

1. ```addRRule('www.example1.com','一秒记住...','example1.com');```
2. ```addRRule('www.example2.com','text1|||text99','text2|||text98','text3|||text97','text4|||text96','text5|||text95');```

### 支持网站【列举前10项】

1. 起点主站 [read.qidian.com](http://read.qidian.com/)
2. 起点免费 [free.qidian.com](http://free.qidian.com/)
3. 起点女生 [www.qdmm.com](http://www.qdmm.com/)
4. 创世中文网 [chuangshi.qq.com](http://chuangshi.qq.com/)
5. 云起书院 [yunqi.qq.com](http://yunqi.qq.com/)
6. 腾讯读书(只支持当前目录页) [dushu.qq.com](http://dushu.qq.com/)
7. 天涯文学(只支持当前目录页) [book.tianya.cn](http://book.tianya.cn/)
8. 欢乐书客 [www.hbooker.com](http://www.hbooker.com/)
9. 3G书城 [www.3gsc.com.cn](http://www.3gsc.com.cn/)
10. 纵横 [book.zongheng.com](http://book.zongheng.com/)
11. ...

#### 版本命名规则

如**1.0.13**分成两段，1.0与13

13表示支持13个网站。

### 更新历史

#### Latest

##### 1.26.199

支持自定义站点规则。

##### 1.25.199

增加失败重试次数，0为不重试。

##### 1.24.199

增加站点替换规则，托此的福，我又检查了**每一个**站点。

##### 1.230.202

什么也没改进...

##### 1.23.202

下载进程优化。修复epub编码。

##### 1.22.167

修复章节排序问题。

##### 1.21.167

如果下载的章节相同，将不再次下载。

##### 1.20.159

下载进程优化。

##### 1.19.152

内置base64解码、utf8to16两个函数，增加限制下载线程的功能。

##### 1.18.112

增加下载为Epub格式的功能。

再次去除"Shift+Q"、"Shift+W"、"Shift+E"这些快捷键。原因是，面板经过上个版本修改后在所有网站**应该**都可以正确显示。

##### 1.17.112

更改了面板界面定位的方式，去除了"Shift+T"快捷键。

更改了当从response查找不到元素时的解决方案（将response主体部分添加到当前网页，在当前网页查找）。

##### 1.16.97

增加通配符模式。

##### 1.15.92

修复关于储存默认语言信息的bug。

##### 1.14.88

增加使用说明，记住默认语言。

##### 1.13.87

增加改变快捷键。

##### 1.12.73

简化了添加规则。

##### 1.11.29

修复简繁体转换功能。

##### 1.10.29

简繁体转换功能正式上线。

##### 1.1.15

还是说一下，由于无错小说网章节里有些文字图片，所以增加了一大段替换规则。纪念```小说下载阅读器```

##### 1.1.13

完善【特定下载某些章节】功能，增加【支持网站】。

##### 1.0.13

更改版本命名规则。

以后版本更新，不将**新增**的网站写入[更新历史](#更新历史)，详见[支持网站](#支持网站)。但会将修正的网站写入[更新历史](#更新历史)。

##### ...

##### 1.00

初步完成脚本。
