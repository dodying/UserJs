#### 此脚本引用的库，感谢他们 jQuery [FileSaver](https://github.com/eligrey/FileSaver.js) [jszip](https://github.com/Stuk/jszip) [jquery-s2t](https://github.com/hustlzp/jquery-s2t)

### 使用说明

#### 在目录页或是章节页使用。

#### 按```Shift+D```来显示下载选项。

#### 如果某章节长时间无法下载，请刷新重试。<s>浏览器会从缓存中提取数据。</s>

#### 失败重试、超时重试只对```非特殊站点```有效

### 意见、建议、Bug

#### [Github-issues](https://github.com/dodying/UserJs/issues)与[GF-Feedback](https://greasyfork.org/zh-CN/scripts/21515-noveldownloader/feedback)

######预览

![主页面](https://raw.githubusercontent.com/dodying/UserJs/master/novel/novelDownloader/%23%23%23main.png)
![自定义站点规则](https://raw.githubusercontent.com/dodying/UserJs/master/novel/novelDownloader/%23%23%23Customize.png)
![检查项目上的规则](https://raw.githubusercontent.com/dodying/UserJs/master/novel/novelDownloader/%23%23%23Url.png)
![下载信息](https://raw.githubusercontent.com/dodying/UserJs/master/novel/novelDownloader/%23%23%23Log.png)
![搜索引擎提示](https://raw.githubusercontent.com/dodying/UserJs/master/novel/novelDownloader/%23%23%23Search.png)

### helpWanted 作者需要帮助

iOS：生成的Epub格式电子书在[iBook](https://itunes.apple.com/cn/app/ibooks/id364709193)中只显示每章节**前两页**，在[开卷有益](http://www.kingreader.com/)中显示**【不支持的epub格式】**，在[Anyview](http://www.anyview.net/)中可以正常阅读。

Android：未测试...

### 自定义站点规则说明

#### 由脚本生成的【include】规则加在```// ==/UserScript==```这一行前。

#### 一条规则写一行，尤其是【章节规则示例-自定义版】，别写成块状。

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
2. ```addRRule('www.example2.com','text1|||text99','text2|||text98','text3|||text97');```

#### 章节规则示例-自定义版

##### 此规则，是为了那些无法直接在网页原文件中获取到内容的网址准备的。

具体示例：详见[脚本代码#L376](https://github.com/dodying/UserJs/blob/master/novel/novelDownloader/novelDownloader.user.js#L376)

```
说明：
1. 特殊处理的属性名称必须是Deal，如果还要进行第二次特殊处理，可随意
2. Deal函数的参数必须是num（表示这是第几章）与url（原链接）
3. 可用函数:
  jQuery、
  thisDownloaded（必须，传递章节内容，参数为num-表示这是第几章、name-标题、content-内容、lang-该站点的默认语言0简体1繁体）
```

### ToDo

1. 强制分段
2. 站点规则模版
3. 搜索(谷歌自定义搜索Api)

### [支持站点](https://github.com/dodying/UserJs/blob/master/novel/novelDownloader/supportUrl.md)

### 更新历史

#### Latest

##### 1.34.65+242

去除【特定下载】，增加必应、搜狗、360搜索。

##### 1.33.57

细节更新，增加搜索引擎提示。

##### 1.32.53

细节更新

##### 1.31.178

增加**增加分次下载**，具体功能自行摸索。

##### 1.30.199

修复错误，增加**选择未保存**。

##### 1.29.199

增加从[Github](https://github.com/dodying/UserJs/tree/master/novel/novelDownloader)项目上获取规则的功能。

##### 1.28.199

将失败重试细分为失败(onerror)重试、超时(ontimeout)重试。

自定义站点规则默认只显示```当前站点的自定义规则```。

##### 1.27.199

修复保存自定义站点规则时特殊字符转义的问题。

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

##### ... 神隐

##### 1.00

初步完成脚本。
