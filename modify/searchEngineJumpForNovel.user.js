// ==UserScript==
// @name               searchEngineJumpForNovel
// @name:zh-CN         搜索引擎跳转-小说版+高亮
// @include            http*://www.baidu.com/*wd=*
// @grant              none
// @icon               https://cdn4.iconfinder.com/data/icons/education-volume-2-2/48/102-48.png
// @version            1.05
// ==/UserScript==
//最后更新时间：2015年9月12日 14:57:51

//重要代码在330、400、500//
////////////////////////////////////////////////////////////////这是高亮的代码////////////////////////////////////////////////////////////////
(function()
{//橙色背景【首发】
	void( orangeword=  'read.qidian.com|www.qidian.com|chuangshi.qq.com|www.wenku8.com|www.wenku8.cn|www.lkong.net|book.zongheng.com|www.zongheng.com|www.17k.com|www.3gsc.com.cn|b.faloo.com|book.sfacg.com|xs.dmzj.com'  );
	orangeword='('+orangeword+')';
	x=new RegExp(orangeword,'gi');
	rn=Math.floor(Math.random()*100);
	rid='z' + rn;
	b = document.body.innerHTML;
	b=b.replace(x,'<span name=' + rid + ' id=' + rid + ' style=\'color:#FFF;background-color:orange;\'>$1</span>');
	void(document.body.innerHTML=b);
})();


(function()
{//绿色背景【无墙】
	void( greenword=  '00xs.com|www.20xs.cc|www.5ccc.net|www.mianhuatang.cc|www.23wx.com|www.44pq.com|www.aszw.com|www.quledu.com|www.773buy.com|www.ybdu.com|www.piaotian.net|www.151kan.com|www.ppxsw.co|xs.178.com|xs.dmzj.com|novel.slieny.com|www.yidm.com|www.miaowenhk.com|book.sfacg.com|3g.sfacg.com|www.biquku.com|www.31wx.com|www.45zw.com|www.wenxuemm.com|www.5du5.com|www.dashubao.com|www.qingdi.com|www.xsbashi.com|www.biquge.cc'  );
	greenword='('+greenword+')';
	x=new RegExp(greenword,'gi');
	rn=Math.floor(Math.random()*100);
	rid='z' + rn;
	b = document.body.innerHTML;
	b=b.replace(x,'<span name=' + rid + ' id=' + rid + ' style=\'color:#FFF;background-color:green;\'>$1</span>');
	void(document.body.innerHTML=b);
})();


(function()
{//灰色背景【未测试】
	void( grayword=  'www.zhuzhudao.com|www.69shu.com|wuxianzuosi.com|www.1shuwu.com|www.klxsw.com|www.qqxs.cc|www.shenmaxiaoshuo.com|www.vodtw.com|www.wangshuge.com|www.xinbiqi.com|www.xiaoshuo777.com|www.quanben.co|www.qb5.com|quanxiaoshuo.com|www.5wei8.com|www.quanben5.com|www.taotao3.com|www.23zw.com|www.fresh.org.cn|www.caihongbook.com|www.77nt.com|www.bihaige.com|www.rrxs.net|www.feisuzw.com|www.bookba.net|www.banfusheng.com|www.akxs6.com|www.nsxs.org|www.zhuaji.org'  );
	grayword='('+grayword+')';
	x=new RegExp(grayword,'gi');
	rn=Math.floor(Math.random()*100);
	rid='z'+ + rn;
	b = document.body.innerHTML;
	b=b.replace(x,'<span name=' + rid + ' id=' + rid + ' style=\'color:#FFF;background-color:gray;\'>$1</span>');
	void(document.body.innerHTML=b);
})();


(function()
{//紫色背景【有图】
	void( purpleword=  'www.geiliwx.com|www.00sy.com|www.du7.com|www.kanshuwo.net|www.bxwx.org'  );
	purpleword='('+purpleword+')';
	x=new RegExp(purpleword,'gi');
	rn=Math.floor(Math.random()*100);
	rid='z' + rn;
	b = document.body.innerHTML;
	b=b.replace(x,'<span name=' + rid + ' id=' + rid + ' style=\'color:#FFF;background-color:purple;\'>$1</span>');
	void(document.body.innerHTML=b);
})();


(function()
{//粉色背景【有墙】
	void( pinkword=  'www.jdxs.net|www.chinalww.com|www.ckxsw.com|www.qmshu.com|www.lingdiankanshu.com|lknovel.lightnovel.cn|www.lightnovel.cn'  );
	pinkword='('+pinkword+')';
	x=new RegExp(pinkword,'gi');
	rn=Math.floor(Math.random()*100);
	rid='z' + rn;
	b = document.body.innerHTML;
	b=b.replace(x,'<span name=' + rid + ' id=' + rid + ' style=\'color:#FFF;background-color:pink;\'>$1</span>');
	void(document.body.innerHTML=b);
})();


(function()
{//蓝色背景【论坛、下载】
	void( blueword=  'tieba.baidu.com|www.nmtxt.com|www.soepub.com|www.cnepub.com|www.2epub.net|www.55x.cn|txt96.com|www.3uww.com|www.5xiaoshuo.cn|www.qisuu.com|www.5xiaoshuo.cn|www.80txt.com|www.77119.com|www.blbb.net|www.bookdown.com.cn|www.i7wu.cn|www.ibook8.com|www.qisuu.com|www.sjtxt.com|www.luo8.com|www.sxcnw.net|www.tusuu.com|www.txt66.com|www.txt99.cc|www.txtbook.com.cn'  );
	blueword='('+blueword+')';
	x=new RegExp(blueword,'gi');
	rn=Math.floor(Math.random()*100);
	rid='z'+ + rn;
	b = document.body.innerHTML;
	b=b.replace(x,'<span name=' + rid + ' id=' + rid + ' style=\'color:#FFF;background-color:blue;\'>$1</span>');
	void(document.body.innerHTML=b);
})();


(function()
{//黑色背景黑字【坑】
	void( blackword=  'www.biquge.la|www.binhuo.com|tianyibook.com|www.qudushu.com|www.88106.com|www.92to.com|www.anzhuowang.net|www.dengbi.com|www.nuanchen.com|www.ttshuo.com|www.woaixiaoshuo.com|www.136book.com|www.dawenxue.org|www.qingdou.net|www.tsxsw.com|www.baoliny.com'  );
	blackword='('+blackword+')';
	x=new RegExp(blackword,'gi');
	rn=Math.floor(Math.random()*100);
	rid='z' + rn;
	b = document.body.innerHTML;
	b=b.replace(x,'<span name=' + rid + ' id=' + rid + ' style=\'color:black;background-color:black;\'>$1</span>');
	void(document.body.innerHTML=b);
})();
////////////////////////////////////////////////////////////////这是高亮的代码////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////这是跳转的代码////////////////////////////////////////////////////////////////
(function(topObject, window, document) {
	//判断执行环境,opera,firefox(GM),firefox(scriptish),chrome;
	var envir = (function() {
		var envir = {
			fxgm: false,
			fxstish: false,
			opera: false,
			chrome: false,
			unknown: false,
		};
		var toString = Object.prototype.toString;
		if (window.opera && toString.call(window.opera) == '[object Opera]') {
			envir.opera = true;
		} else if (typeof XPCNativeWrapper == 'function') {
			if (topObject.GM_notification) { //scriptish的新api
				envir.fxstish = true;
			} else {
				envir.fxgm = true;
			};
		} else if (typeof window.chrome == 'object') {
			envir.chrome = true;
		} else {
			envir.unknown = true;
		};
		return envir;
	})();
	//未知环境,跳出.
	//if(envir.unknown)return;
	function init(e) {
		if (document.body.nodeName == 'FRAMESET') return;
		var prefs = { //一些设置.
			dropDownList: { //下拉列表
				showDelay: 100,
				//显示延时.
				hideDelay: 500,
				//隐藏延时.
				horizontal: false,
				//横排下拉列表
				transition: false,
				//下拉列表动画.
			},
			favicon: true,
			//加载站点图标
			margin: 5,
			//展开的引擎之间的间距.
			openInNewTab: true,
			//是否在新页面打开.
			all_frames: true,
			//所有框架上加载,否则只在顶层框架.
			debug: false,
			//输出debug信息(影响速度,并且可能对你完全没有作用,你最好关闭它..-_-!~);
		};
		if (!prefs.all_frames) { //frame
			if (window != window.parent) return;
		};
		prefs.icons = {
			dropDown: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAJCAYAAAD+WDajAAAAQElEQVR42rWKsQkAIAwEfygrG1s7  53CFbOImbhf9IqKBlB4chL9AVUN/xZTbjOSHlNqHlzsIDx+2OHC4A32wYC4oDZXgXXU8QAAAAABJ  RU5ErkJggg==',
		};
    /*全局样式.*/
    prefs.style = '\
    /*sapn display化*/\
    /*显示在前面的展开列表的类型,比如 网页,音乐,下载等.*/\
    .sej_expanded-list-type{\
      font-weight:bold;\
    }\
    /*下拉列表和展开的列表字体全局设置*/\
    .sej_container,\
    .sej_drop-down-list{\
      border: 1px solid black;\
      color:#000000;\
      font-size:13px;\
      line-height:2;\
    }\
    /*前面展开的列表*/\
    .sej_container{\
      box-shadow:0px 0px 3px #aaaaaa;\
      font-family:"Hiragino Sans GB W3","Microsoft YaHei","方正启体简体";\
      display:table;\
      position: relative;\
      z-index: auto;\
      padding: 1px 0 1px 10px;\
      line-height:1.5;\
    }\
    /*favicon设置*/\
    .sej_container img,\
    .sej_drop-down-list img{\
      display:inline-block;\
      vertical-align:text-bottom;\
      margin:0 3px 0 0;\
      border:none;\
      padding:0;\
      height:16px;\
      vertical-align: text-bottom;\
    }\
    /*展开列表*/\
    .sej_container a{\
      margin:0;\
      background:none;\
      border:none;\
    }\
    .sej-engine {\
      line-height: 2;\
      display: inline-block;\
      margin: 0;\
      border: none;\
      padding: 0 4px;\
      text-decoration: none;\
      color: #000000 !important;\
      transition: background-color 0.15s ease-in-out;\
    }\
    .sej-engine:hover {\
      background-color: #EAEAEA;\
    }\
    .sej-drop-list-trigger::after {\
      content: "";\
      display: inline-block;\
      margin: 0 0 0 3px;\
      padding: 0;\
      width: 0;\
      height: 0;\
      border-top: 6px solid #BCBCBC;\
      border-right: 5px solid transparent;\
      border-left: 5px solid transparent;\
      border-bottom: 0px solid transparent;\
      vertical-align: middle;\
      transition: -webkit-transform 0.3s ease-in-out;\
      transition: transform 0.3s ease-in-out;\
    }\
    /*下拉列表*/\
    .sej_drop-down-list{\
      line-height:2;\
      margin:0;\
      padding:0;\
      border:1px solid #BCBCBC;\
      position:absolute;\
      width:auto;\
      min-width:100px;\
      overflow:hidden;\
      background:none;\
      background-color:white;\
      '+ (prefs.dropDownList.transition ? ('\
        -webkit-transition:opacity 0.3s ease-in-out,height 0.2s ease-in-out;\
        transition:opacity 0.3s ease-in-out,height 0.2s ease-in-out;\
        ') : '') + '\
      -webkit-box-shadow:1px 1px 2px rgba(0,0,0,0.2);\
      box-shadow:1px 1px 2px rgba(0,0,0,0.2);\
    }\
    .sej_drop-down-list > .sej-engine {\
      padding-top: 4px;\
      padding-bottom: 4px;\
    }\
    .sej_drop-down-list a{\
      display:block;\
      border:none;\
      padding:0 6px;\
      margin:0;\
      text-decoration:none;\
      text-align:left;\
      background:none;\
    }\
    /*已访问的a元素*/\
    .sej_drop-down-list a:visited,\
    .sej_container a:visited{\
      color:#551A8B;\
    }\
    /*a元素悬浮*/\
    .sej_container a:hover{\
      color:red;\
      text-decoration:none;\
    }\
    /*下拉列表a元素悬浮*/\
    .sej_drop-down-list a:hover{\
      color:white;\
      background-color:#2E7CF0;\
      background-image:-webkit-gradient(linear, 0 0, 0 100%, from(rgba(255,255,255,0.6)), to(rgba(255,255,255,0.3)));\
      background-image:-webkit-linear-gradient(top,rgba(255,255,255,0.6),rgba(255,255,255,0.3));\
      background-image:linear-gradient(top,rgba(255,255,255,0.6),rgba(255,255,255,0.3));\
    }\
    ';
		//-----------------------
    if (prefs.dropDownList.horizontal) {
      prefs.style += '\
      .sej_drop-down-list{\
        min-width:0;\
      }\
      .sej_drop-down-list a{\
        float:left;\
      }\
      '
    };
		var siteInfos = [
		//网页搜索/////////////第一个可以当模板看///////////////////////////////////////////////////////////////////////////////
		{
			name: 'google网页搜索',
			//你要加载的网站的名字(方便自己查找)
			//是否启用.
			enabled: true,
			//在哪个网站上加载,正则.
			url: /^https?:\/\/www\.google(?:\.\D{1,3}){1,2}\/(webhp|search|#|$|\?)/i,
			//例子(方便了自己读,此项可以没有)
			example: 'http://www.google.com/search?client=opera&rls=ja&q=opera&sourceid=opera&ie=utf-8&oe=utf-8&channel=suggest',
			//加载哪个类型的列表: web(网页),music(音乐),video(视频),image(图片),download(下载),shopping(购物),translate(翻译),空字符串或者没有此项(不加载列表,所有的列表全部下拉.)
			engineList: 'web',
			//给引擎列表的样式
			style:"\
					padding-left:80px;\
				",
			//插入文档,相关
			//keyword 使用 xpath 或者 css选中一个form input元素,或者此项是个函数,使用返回值.
			//target 将引擎跳转工具栏插入到文档的某个元素(请使用xpath匹配,比如: '//*[@id="subform_ctrl"]'  或者 css匹配(请加上 'css;' 的前缀),比如: 'css;#subform_ctrl' );
			//where 四种:'beforeBegin'(插入到给定元素的前面) ; 'afterBegin'(作为给定元素的第一个子元素) ; 'beforeEnd' (作为给定元素的最后一个子元素) ; 'afterEnd'(插入到给定元素的后面);
			//style 可选.
			//此项可以使用数组,候选多个对象,常用来,兼容改版的中的网站.
			insertIntoDoc: {
				target: 'css;#rcnt',
				keyword: '//input[@name="q"]',
				where: 'beforeBegin',
			},
		},
		//----------------------------------------------------------------
		//---------------------------------------------------------------
		{name: 'baidu网页搜索',url: /^https?:\/\/www\.baidu\.com\/(?:s|baidu)/i,enabled: true,engineList: 'web',style:'text-align:center;padding-left:60px;',insertIntoDoc: {keyword: function() {var input = document.querySelector('input#kw') || document.querySelector('input[name="wd"]');if (input) return input.value;},target: 'id("s_tab") | html/body/table[2]',where: 'afterEnd',},},
		];
		//站点的base64图标
		var base64_icons = {
			baidu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACoklEQVQ4jZ2T6UuUURSHzz9QRhCpJJVZERUFmVmp7bZYZiUttpiEVliEtCctJtGHPgQGEm1EUbQHUlCBWSI1NbagJfheX3XG1LSmhWL0NTtPH6ZmEulLF86XcznPPb/7O0eksAYprEEK3iKHqpED1Uj+a2TvK2TXC2SHG8lzIVufILkVyKZyJLsMySpF1t1HpLCG/z2ScQ+Rgre9LqzaTj1S0K7VVR0KYKxOtY2jvQAr7iBysLpH0nGUPTvaGBVTp5kZzWobh2mTGzVljldt4/QEpJcgsr8qmPj8qRuAXXltTB7fQE5mC26Xn7hx9cyd4cHt8vcEpN1GZN9rADyNXWxY26y5Oa1668ZXcjJbKC7yAVBc5KO4yIfb5cfr6QoBFt1EZPdLAK5d+sKQgZYmxjUogG0cOjtCsm3jsGrZO1YuadLWlh8BwPxriOysBOC5y09CbANLFzZxt+QbtnHYvKGFvC2t2Mbh2NGPTBpfT0ykwe3yK4DMvYLI9mcAdHfDjatftbjIp7ZxSE326ogoo2NibNYsf6e2cViW6iVtvlcb6gOOyKxLiGx7Gmyzo+MntnFIm+dlZJTR6HDDn1ixuElt4/D44XfltzKZfhGR3Iog4E1VJymzvYwYVMffxdHhhnHDbbIymrHrQlZK4nlENpUDoAqH89t18ACjQweaXoDBA4yOHWbzqPR78Gdl6jlEssuCgKMFHzS8r6WR/SwiwywN71OrEWEWUf0tHdTf0mERhssXvoQA8WcRySoNtuRp7GJLdivJSR7SU5o4cdzHieM+Zk1tJHZ0PRvXN9P2/kdIQtxpRNY9+Hu4FKgEnvwjKntM4sRTiKy+F1iK9BJkyW0k9Say4HrA49mXkZkXkaQLSMJ5ZMo5JP5M4OXYU8iEk/wC6ZkDX3ssK20AAAAASUVORK5CYII=',
			google: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB5klEQVQ4jYWTzWsTYRCH9yLYePL/EAlisEQvtlC13irUVagHBUX0omAv3oQqHiooTeiiudTvtaiIVZGqlHoRtB+StrE9yYK0mw8ipLG7mcnjIdmYL8nA7/bOM/Obd8YwmsL3/T0iYqnqmqr6Va2KyDgQbn5fCyAkIgk6hIhYjuN0tUueBSh7HsXJh+TOD5HuP4B7KEru7Ek2n05Q9rwAMtMACSqru07ujInbG2mr/PDF+k7Ga56DytnTg7i9EdJH9lO4F8P/Po+fXKSQiJM9NYA4P5sdhQ0RsQBK83fIDOzD7evGTy60mldtN4+4oaprAPIlgvcqRPHBhU5zrGNqylBVH6D0cQel6W2UM28aHvWMFFp01f4TALx/gA+hCiA91RFw5VEjYBXg9+ddZKd38nJx9L8tX3u+Rc9IgdGprQCwYlQ3jG/LNzlsH6XbHmTOXWpJTv1S+m5UOphNSTDEMQMIA3jic/ztJfY+OUbUNrm9MMHXjSRz7jJ3kzb99y0OXs9zLlGkXK5APc/bHSySBbCxmcGsQtrJfHGL9Xw5qB6rbaLjOF0iMgPgqc/jH68Zej9M9JlJ1DY58e4yiaVJiqWtIPkTsL3hHqoQq8PXIyKxluSmwwqLSFxVU6rqVbUiImM1z3XxF/9k+3A9su/8AAAAAElFTkSuQmCC',
			haosou: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB6klEQVQ4jaXOz2oTURQG8Ltv7vEZAl1Jsm3VZO7ccdqNlK4sBFd9k0IoCD5BaRYKVtRi5l8zmZTY0o5NoVuhI9KFRbGpLaSkDYEk1s/FnTGDC6l64bf5zncPhxlhRjdDOph5dwt/wwzpwAgzOjN3eXsmJPwLc5e3mblD+B/M3CaklVq3sfPNweWwg8thB60zH4/28/i9l2D3m4TEYmsKF4NzPP34GAvNHBaaOVQ+lHExOMdiawrpboIZmwRjkyAbhL1THyuHSyg6HJqnFB2O1aiMvVMfsqG6acxoEIwGQfcJ/VEP88Ek9BqHDAgyIOg1jrl6Fv1RD7qvumlM1gmyThAex9Wwi/lgEtJXmawTpE+YC7LoDjoQHh/nMSZ9VRIux/YXGyuHS5A1lUmfIGuE1aiMt5/fQLh8nMeYrKmScAkP6zmc9b+iEpVR2sqjtJVHJSpjeD1QFzgcST/B9A2CvkEQHqFocTxws/A/reGkd4yT3jGeRU+QvKthF8JT/QTTPUJCOIRilaOwznHvdewVx/Ra5teS/qgH4Y7/MN0lpAmHoFkErcpjhMI6x/TzDK5/fEfl/TI0a9xnwlGf/kSz1ZI7LzK4+5JDs8YzJhzevumSYlVdJ+wk521WsCZmhU1Hwo4HN3dUsCZmfwKCejnLHZeJTwAAAABJRU5ErkJggg==',
			youshu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABlklEQVQ4jbWSvUscURRHz27WDwQVwdLCgIIgGEQRU9oZRPB/ENKmt3F2Bj+CRcAiZDHL3FkUi3RaWW0lghgCASEgIuo6+94uOzOVEKK+FOroum5wi/zgVu+dc++7PPivWT3qwDpsbhy0TBJPLeHpANHHSHHwkbSFbOENOX8U73zoecF6pQfR5qHUPpZJ4hZ7EfUT0dd3Z9+fF6wVqgQJT+9i5VOI2qsS59QsQZrF0GE7slkqOfTHTxDlILqCq3/h+gN4pblHnQ2iC2xEXQRppiOHm8jGRDZhmE5NxJNky+1Y+RRecQzRl1XdXfUBAGPRHDmJvTuBCW3OgmU6Y8nX8z5EVZ7s5JjPp13xnSDNVGTHU5jQZgsAqQzWwtrg+jNVOzt4T1Nks3MvCJxXf959Wf+EqMuncFLUJlY+VbP4ss3I6ULH782VSfM2s2Vqut7WERm/u+7/6cn+sJBSHViVyfgDdWEAMn4bor/VwJ4qN3kXw/+G77NqWhD9EdFXiL5B1CE59fpl8EMSuGoctziPe9LaKNxQ/gLLwCa6IPVoVgAAAABJRU5ErkJggg==',
			qd: 'data:image/ico;base64,AAACAAEAEBAAAAAAAABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIA5P0SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/wAAAAAAAAAAAAAAABIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xMB5v8WBOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/AAAAABIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/y4e6f///////////xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v/6+f7/EgDm/xIA5v//////EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v//////////////////////EgDm/xIA5v8SAOb/EgDm//////////////////r6//8SAOb/EgDm/xIA5v8SAOb//////zAg6f//////EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm//////8YBuf////////////49/7/EgDm/xIA5v///////////////////////////xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm//////8SAOb/EgDm/xIA5v8SAOb//////xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v//////EgDm/xIA5v8SAOb/EgDm//////8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm////////////////////////////EgDm/xIA5v///////////////////////////xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm//////8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm//////8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v//////EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v//////EgDm/xIA5v8SAOb/EgDm//39////////////////////////EgDm/xIA5v///////////////////////////xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm//////8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/wAAAAASAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/wAAAAAAAAAAAAAAABIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/xIA5v8SAOb/EgDm/wAAAAAAAAAAwAMmAIABJgAAACYAAAAmAAAAJgAAACYAAAAmAAAAJgAAACYAAAAmAAAAJgAAACYAAAAmAAAAJgCAASYAwAMmAA==',
			cs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACtklEQVQ4jZXN3WsUVxjH8bmdmTNnzpnZmd204I0t2F55451gc5GC/4bgnQreiBX7h7TQ1KaC1BcMgXUxaRLdJBgiZrPJdptssoFdkzHsTnbDJkzI67cXWYNSETzw4eH5nYfnMd5duXq5ceNmFN+6w+btu2z+9PPn3b5LfOsOjRs3o3dXrl426pf6otr5C7y92Mvb3h9P/ND3ae//L/ZSO3+B+qW+yJjtOcNi8DXVs+eofvs9H76Vs+eofvPdx7oz/wZfMdtzBmPKSzPrZyinMhwfH7OgA+ZVwIIO2N/fZzGVYSnVw2Iqw9HREWX/pL72Qqa8NMYLHTLthRweHlJUIUUdMq/TFHVIUZ3k//gZFrw0BwcHzKmAra0tJlXACx1ijHQvzagUBR0w74cs+Gnm/ZCCDnijUuzt7TGrUyRJwmvl02g0eKlSjOoAI+f6jLge29vbdDoddnZ2SJKEJEnY3d2l3W4zo3xmlE+n02Ha9YiiiDHlM6xSGFnX57n02NjYYEJqJj8wITXVapVp12fa9Wm320xKTb1eZ8T1yLk+RlZ65KQmiiLyUjPleqfyUrO+vn7aN5tNXjqK1dVVclKTlR7GkKPJOup0wSvXP5XvXstLTb57ZFQoKpUKWUcx5GiMp45iSCjW1tYYdxQT0qPVatFqtYjjmEqlwrijGHcUcRwzLFyWlpYYEoqnjsJ44rgMCpdarcZod3BYuOSE5JktyQnJmKMY6+bPhaRUKjEoXJ44LsZDIXlkS5aXlymVSlQqFVZWViiXyxSLRebm5vhbuERRRK1Wo1wuUygUeGRLHgqJcd9yGLAEA6bggWnzlyU+8tgSDNoOj7v9A9NmwBQMWIL7loPxmyWa9yxBv2nzu/V/f1g2f9on9X3Wb9rcswT9loiN66a49qspNvtNwZf4xRTN66a49h/JfFolJ/SDcQAAAABJRU5ErkJggg==',
			zongheng: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACgUlEQVQ4jU2T20+TURDEZ89XtYpaxNYoFVEuBlBjJDFKNBr/aaGlgmIoGK0VVIpGbiriDUW8le9yfj58lPiwL5PZObsze1TrEHMnA16ddaz1i/UhI9reZGtYbA2LH8Pi82VHtL3Jar/jdbeYP2k8OW5UDwvVC+Jl0bHcI9YHHF8uGwA/R8SvEcfv62L7qvDA+oBYPmc0io5aXswcEZrLi8YZ8aZPfLggtoYdJNC8KaLbIrwpflwXeNgYEit9xosuMV9wzLQLeQAPHoCQBI/3EN9y+Dsiuu34c81aBCCh1YMHPTthLHSJlX7xadAB4JMd4hsivCWiG+LniEjiv3hgtTdgoUs8PSGm24VqedEoiqWegPeDIvYJxAk++kPrIf42IQrBxyz1GM+L4mnLg1pH6urrbrF6XpDEfL2kvRQ2rxhfroiNIQdRzGK3MXdK1HNKU6jmjHo+YKFTvOk2IOLdoOPDBcfHi2JjSLwdEGt9GSDhRVHUC6KaM6YOCU23idljRq0gFjoFwHKvWOs1ls87VvqMpZ50QjzMF8Rsh3jYZkwdEJrMpqM8zgXU80YchzSKjsYZsdglFk8bjaKY7xRxHPO4PeU/zBqVjEOVfWLqgJhuE7NHlcbUbO5FBpDsNPHhDj6B6mFxPysmnCgFQhWJSsZxP5uqAhCFzLSL2aNGNSceHTGSOAQSJvcbE0HaPC6hVlbex7sHlYCHyayYOiQeHBST+1uH9N8RpTRUlnFXRsmMsoyypWaNZ8S9jO1VQkxFYlSOkhljEiUzNC5RNlHSbpnhvae0i5cVMK70M5UVpBwnKtpdIVVzjP0nEn77RtnEqIkxl2I737cYlajIUlyOksQ/495yz1qygQQAAAAASUVORK5CYII=',
			k17: 'data:image/ico;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAAAIAAAAAAAAAAAAAEAAAAAAAAAAdY+4ADlntADt48ABKg/IAaZf0ALPL+QCkwfgA0uD8AHii9QD///8A8PX+AAAAAAAAAAAAAAAAAAAAAAAAAAAAERERERERERERERERERERERGZkRE6mZYREZmRGJmZYRERmZFpmZgRERGZl5mZQREREZmZmaMRERERmZmaIRERERGZmZcBEREREZmVmaIRERERmZFpmiERERGZkRiZohEREZmREUmaIRERmZERFJmiEREREREREREREREREREREREAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			g3: 'data:image/ico;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABx4s0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv4c0OzqwGzamC5dQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATz60GzakGzakGzalO2sEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABW3MQHzakGzakGzakGzakGzak517oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACU6doGzakGzKcMv5QUsHwGzKcGzak20rkAAACrdvAAAAAAAAAAAAAAAAAAAAAAAAAAAABnxpYqhjg7ZAI4aQsMv5UGlq4bKsFhAeRkAOXMq/YAAAAAAAAAAAAAAAAAAADnv27RjguZeQBKZgA2WAQNPpIHBL0eAMdjAORkAOXAmPQAAAAAAAAAAAAAAADcnRXXkADUjADRiACiaAg3Hh0KAY4IAL4lAMpkAOVkAOWeYO4AAAAAAADqv1LenQDbmADYkgDVjgC6dAZmKh1lKR5aDpg1ANFFANhkAOVkAOWORuwAAADotSnipADfnwDcmQDZlADVjwDKgwJ7PBdlKR1kDpxkAOVkAOVkAOVkAOWPR+z2463lqgfipQDfnwDcmgDZlADWjwDTigDJgAGPTRFmEJtkAOVkAOVkAOVkAOW0hPIAAADuy2nipAPfngDcmQDYkwDVjgDSigDPhQDMgADUra+KP+tkAOVkAOVkAOXEnvQAAAAAAAAAAADfoQ/blwDXkgDVjQDSiQDPhADMgAAAAAAAAAAAAAB9KehlA+UAAAAAAAAAAAAAAAAAAADmulnWkALUjADRhwDOgwDMfwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADdpTvQhQLNgQDMgAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWmDLSjh8AAAAAAAAAAAAAAAAAAAAAAAD/7wAA/4cAAP8HAAD8BwAA+AUAAPwAAAD4AAAA8AAAAMAAAACAAAAAAAAAAIAAAADgOQAA8D8AAPw/AAD/PwAA',
			fl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC40lEQVQ4jX2TaUjTYRzHpW3lsf8kuywzgi47QCuywi4rV0EEHRRYOdGCDstNWydB5fb/myk2U6x5z5QKU1fY3BplWbIOLeyggrDLXiRkWGlZ7NMLr6TjxefF8/DweX6/5/l9PeKqtqG3a9HbdV04dCTa4/vv/QePmAoNXkkD8E4agLdBhrdBxqrKeQSk+fWu/0XUxUg8Yiuj8U9XstmpZm3ZMiZk+XO63sSS4tksLQxDEOWoJMUfCKIcTcXGLoHSKCMw0xejaw+Zd1I55tyLdOMoUzPG9wpGpQ5mYcFcxqQP/4ug+1Ds5UgmZQQyWPJBMA5CkPpuj7uy3e12u92HnPtQWxYTYQkntjKqv+CAI4GQ7Mk0tb7k9ptavA0yVJInSlHB8VojnT872XB+HSuK1SwtWkTM74IRooqTN1NIrI7H7XaT32BmZYma95+bya83k1t/hnOPSki9fZy7zS4OOvVoyn9rYcv5KDaVbuDeOxetHR+Znj0F6aaBbz86CDo1FkGUI4hyhiT70PL1AwUNeT0CDX6iF9bGMpZbwkmvSybUHIwgyql6fomv378QdTGS9RdWs/7CGnS2ONo729li1fRVsLJQjfVpOWpLOJ86Wtl/VYePUcazlqe43tYxJ3cmc3JmEJoTQqg5hODsyQiiovsXrNGk1kice1jK2JMBfP7ehvVZGQFpQ2n71kbO/dOoJAWzzNOYcSaI0SZfVpVGEFE0v7sCazQxpZtoaL7PyBN+PPnQSNWLSyTXJnG9yUlwdhB5D7KQbh2h5rWNa03VaG070VZv72shQBpC47uHbLVGoxI9EYyD8BW9UBoV+EoDGWcaxcKiWVgem5l4KrD7QWX9BynCvIA3ra9Iq00mJCuI8RmjCcubySGnnrON+Ry+to9hKco/R7knTD4GOaGmYFJsIgV1uVhc+WTWmNhbncCYNP9/h6kvzlribTtIdOwmwb6bBPsu9ji06B1a9A7d37Hr+AX2l1d6Ne2CQQAAAABJRU5ErkJggg==',
			qxswk: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABjUlEQVQ4ja2Tv2vTURTFHxQK3QKCwxcKQodCQMjg5OaUreDs9AUHQXATBLdOQgehIDgI4mtDiN/YklRCv6S1YKIoKhRr8Ue10qaSf+Le+3G4FKv5xqF0OLw3XM4957zzQm8onBbpuhLOnCAfCHObSm8odA6FJDOSzJhdNS49N6pd49pLLSaYbhohQoiQZD5494Ny9YWS9pVq1yi3jMll2DgqIKh9F2ZWfFvaV+5/Ui62jSu5Mb+tTC5DPhAqa1asYH5bmViCUt2orDlJkhlxTwgROofCxBIs7hZkMLeplOpu4c575fxTv99+p8ys/LFTqltxiMfej3G5Y5xrOMnNN0qI8Oirz914XRBiiLCw4xIb+34+/ibceqvkA2FhR9j6JWwcjXnGEN17khnTTUe5ZSPKZlfHWIh7wlTNuPDMuP5K/+rGVM0zuPfRgx4haP70wpzcdJIgRGgf/KeJ+UBI+x7U4q77rHZ1RH6IUG6NsdAbelD/bmkfCI194eEX4cFnofHjrD9Tuq6cFpUnxm+ZGER6oyfIhQAAAABJRU5ErkJggg==',
			read: 'data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8A////AOjy/gCey/0AvNv9AOnz/gAAAAAAAAAAAAAAAAAAAAAA1Of9AG+w/QDn8v4AAAAAAP///wD+/v8A////AP///wD7/P4Awt79AD6V/QA5k/0AkMT9AOTw/gAAAAAAsdX9ACmL/QARfP0A3ez+ANLn/gDp8v4A/v7/APb6/gDq8/4A+/3+APr8/gCv1P0AHYP9AAt7/ABYpf0AzOP+AFik/QBDmP0Agbv9AO/2/gB9uP0A5fD+AP7+/wDJ4v4AYqv9ANbp/gD9/v4A7PT+AFyn/QAEd/0ATp/9AODu/gDK4v4A3ez+AAAAAAAAAAAAMI/9AMvj/gD9/f4Ay+P+ACWI/QCHvv0A9vn+APv8/gCjzv0AHYP9AJnH/QDQ5v4AX6j9AKrR/QAAAAAAAAAAABqF/QBzs/0A7PT+AOz0/gBNnv0AO5T9ANrr/gD+/v8A1ej+AFCg/QCs0/0AYKn9AAN3/QAzkPwA1Oj+AAAAAAAyj/0ADn38AHKy/QDF4P4Ag7z9ABmB/QCkzv0A+/z+APL3/gCFvv0AUqL9ABF9/QAAd/0AA3f9AGes/QD3+v4AYqr9AAB3/AAGef0AHIX9AB2F/QADeP0AX6n9AO31/gD9/v4AsNX+ABWB/QAAeP4AAHj+AAB4/gASf/0AxuD9AK7T/QAJev0AAHj9AAB4/QAAeP4AAHj+ACWJ/QDJ4v4A/v7/AN3s/gA5lP0AAHj9AAB5/gAAeP4AAXj9AHS0/QDu9v4APZz9AAB+/QAAeP0AAHj9AAB5/gAIev0Aj8L9APn7/gDy9/4AcLL9AAF3/QAAeP4AAHj+AAB3/QA4k/0AAAAAALXY/QATn/4AAIj9AAB5/QAAd/0AAHf9AE+f/QDm8f4A/P3+AK3T/QASf/0AAHj9AAB5/gAAeP4AHoT9AAAAAAD4+/4Af839AA2y/gABmf4AAH79AAB4/QAdhf0Avdz9AP3+/wDZ6v4AM5D9AAB3/QAAef0AAHf9AB6F/QAAAAAAAAAAAO/2/gB20f4ADsf+AAGt/gAAiv0ACH39AIS9/QD4+v4A8ff+AG6x/QAAeP0AAHn9AAB3/QBDmv0AAAAAAAAAAAAAAAAA6/T+AH3T/gAaz/4AAr/+AAGa/gBMpv0A5/L+APv9/gCnz/0ADXz9AAB4/QAKev0Ancr9AAAAAAAAAAAAAAAAAAAAAAD1+f4AsN3+AEvO/gARyP4AH7n+AMDj/gD9/f8A1Oj+ACqM/QAMe/0AXqf9APH3/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADs9P4AsN3+AGbE/QCj1/4A+vv+AOXw/gBys/0Ansv9APH3/gAAAAAA4HgAAIAQAAAAAAAAAAMAAAADAAAAAQAAAAAAAAAAAAAAAAAAAAAAAIAAAACAAAAAwAAAAOAAAADwAAAA/AEAAA==',
			ccc5: 'data:image/ico;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAABILAAASCwAAAAEAAAABAAD///8Al6z/AI6l/wCIoP8Ad5L/AHGN/wBsif8AZoX/AF19/wBQc/8ATHD/AEpu/wBDaf8AP2X/AD1k/wAxWv8AADP/AP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEAAAEBAQEAAAEBAQEBAAAAAAABAAAAAAABAAAAAQAAAAAAAQAAAAAAAQAAAAEBAQEAAAEBAQEAAAEBAQEAAAAAAAAAAAAAAAAAAAAAACBAkNDw8PDw8PDw8ODAsNAgUKDw8PDw8PDw8PDgkICQAAAAAAAAAAAAAAAAAACAkDBw0PDw4ODw8PDw8AAAsNAwcMDw0NDQ8PDw8PAAAODwMHAAAAAAAAAAAAAAAADw8DBwAPDw4ODw8PDw8PDw8PAwYADw8PDw8PDw8PDw8PDwIEAAAAAAAAAAAAAAAAAAABAwQGBwcHBwcHBwcHBwcHAQECAwMDAwMDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
			mht: 'data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAD////////////////////////////////+/v7/0fX9/6/o/P/B9/7//f7+///////+///////////////////////////////+/v7/z/n8/3Xq6v+H7e3/ud/6/62Y7/+10Pj/ru39/6Xy/v/R+P7/surh/6zp3//0/f7/////////////////wvb5/1Xj2f9k5Nb/YbzY/6+D7f+wn/H/quj9/7Xs/f+37/z/wvH9/97KeP/kvVn/keLY//z+/v//////7vz+/y7c0v8G07r/DMy+/5h75v+se+z/nc75/6Tl/f+v6f3/t+z9/8Tj0f/ouDr/6LxT/9vVoP+08/n//v7+/1Di3f8B0LL/AdG2/2OL1/+jaer/mZ7y/5Hd/P+d4v3/p+f9/6/p/f/YxFz/57cz/+i7T//tzoj/oubh/9n5/v8Ez7X/AM+w/y+nw/+ZVej/mW7s/3/P+v+K2vz/lt/8/5/j/f+22b3/57MT/+i3LP/oukj/6cJo/6Xm3/+l8PT/Bsyo/xC+sf+DSOL/lEro/3Wr9f920fv/gtf7/43b/P+X3/n/2bgz/+eyDP/ntiX/6LlA/+i9V/+o5d7/mu3v/wvIpv9jSNX/ii3m/3Vz7v9eyPr/bc36/3rT+/+E2Pz/sseU/+itAP/osQb/57Ud/+i4Nv/Svl//xPT6/7bz+v9GZcL/gQjj/3k06P9GuPf/VcT5/2PK+v9xz/v/htDi/+GsEf/orQD/6K8B/+ezFP/euDT/q+DJ//7+/v/y/f7/a0Tl/3sI4f84lvP/OLr4/0vB+P9Zxvn/Zsv6/8OxT//nqAD/6KsA/+euAP+9y3P/0/Lp//7+/v///////////6/R+P8/ee3/JLH2/y229/8/vfj/T8L5/4+4nf/oowD/6KcA/+iqAP/XsBX/yfHr///////////////////////+/v7/0fb+/17P+f8ms/b/Mrj3/1m51P/foA7/6aIA/96nDP/BsjL/teHH//7+/v////////////////////////////////+Z4/z/IrD1/y+z7f+/njH/5pwA/+igAP/B4L//6fv9//7+/v//////////////////////////////////////4/n+/0bD+P+jsov/4aIg/+u4Tv/NqzL/6vr7//////////////////////////////////////////////////7+/v+t5uz/w9Cr/+/Zrf/Gumj/wOXV//7//////////////////////////////////////////////////////////v7+/9P2/P+t6er/0/b7//7+/v//////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
			suimeng: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABs0lEQVQ4jZ2SO2tUYRCGH2NCICKiNgErNZiF3XOZ+cRLt4iNWFmIqGzcnG/mswg2ImglKBZRsRJb0UIMphAtUgQ0XiCNFpaCqJCgtf4BY6MieM4SnHLmfV7mBgOiC8MpMNaF4UG6gTGdc8iEk8DQfxl4wTFXbrtw3pQD6warjF1Wcs2FWVcemrJsylwsOeolPhgWDprwyYUFV96mwLcUWEuB96688MCtRriXs8mV5648ccVd6CXlqQtLSfkYC4SmfRyHjf2MlisfXHnUbzN+boLRBCOxQJJy9sgEo7XwmQ67XblZCXtNeePKKxOuVjmT61paUm648iWWmAnRhCUPrJqw6IFFywjdpn9IgRFXHqfA2q+bUwmFCwtJ+Z6UdyaspsBrL9hTa2LKXVe+unDxd+5UxlZTZkyY98C8CfdcuAJs+MfAhcMeuB9zOjUdjlnBCRcup8BKCmypa2LIS05P52hdMRbsM2XOlR+Ws7N2jH6bcRdm+xmtv/NTBTtMeJCUz0lZbjwlQMzpmPLSS65HoRdLLrjyLAVWXLkz1WJ7I/zHpM02V/omXDJlJgX2V5NsrtP+BDhsej3RbyvHAAAAAElFTkSuQmCC',
			ddxs: 'data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAD9/v///f79///+/v////////////39/f/+//3/+vz8//n8/P///v///f3+//78/P///v/////9///+/v/9/fz/+/3+///////N0fH/cXfc/6Ci6P/9//3/2dry/zU90/9HT9z/2dv1//////////3/pKnr/zxD1f+9wO////////v7/v//////XmTY/wAD0v8EDNL/oqbp//Dx+/93fOL/DhbT/zQ+1v/+/fz/vMDv/wgRz/8/Rdj/ubrr/////v/8/v7//f79/9XV8v+7wO//HyjX/36C5v///////////8HG8f8HEc3/qqzq/4aN3v9qcd3///////39/v/9/f7//v3+//7+/P///////////ztD0v99g+X//////5GW4f+Jj+P/aW/h/z5H2P/9//3/0M/x/15l2P/h4/b///////7//v/+/v///f3///7//v83QdT/hIfo//////9zeuH/O0HZ/72+7/8XIs7/8fL7/8bK9f8IEc//2Nr0////////////////////////////OUHU/4aK5v//////g4rn/0NK2//d4Pb/ISfS/+Dh+P/Lz/X/HiXU/+Pk+f///////////////////////////ztB0/+Nk+b//////4GI5v8+Rdr/6uj7/xwm1P/N0PT/zM/2/x8p1P/r7Pr///////////////////////////87QdP/j5Tl//////+BhuX/Q0rY/+Xk9v8TGs3/urzr/9LV9v8gJtX/6+z7/////////////v//////////////OkHV/4mM5v//////h4zn/zo/3P/a3vj/pqrn/9zh9/+zsu//Jy3X/+rt+/////////////7+///+/f///////zpA1f+MkOb//////3R53v8ACND/HyXR/y422v8eJ9P/EBrS/xEa0P/Y2vL//////////v///v7///////////87Q9P/kJLn///////AxO//lJnm/5ec5f8ZI9f/dnzi/6mu6P+hpef/8vL5/////f////7/9fb7/9vd8//u7vn/NUDW/32A5v/5+fr/9ff7///////z9fv/JjLS/7q77v//////9/f7//X2+////v7//////9jb9P8XHs7/GCLU/w8Z1P8QGtP/Jy7S/1Na0/8qNNT/O0LZ/xAX1P8nMdf/MTrY/xAbzP9DR9T/8fb7///////z8/z/gYfg/32E4/+Gi+P/f4fi/42R5f+ipOn/XGHc/2523v94e97/cXfd/3B03f90et3/cHXb/+Pm9///////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
			glwx:'data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAMMOAADDDgAAAAAAAAAAAADz8PL/+/f7/////////P////3////8/v/+/P7/xr7F/9jR2P///////v79//bz9v/Oxc//9e72///9/////v//h4KG/4mBif/o4On/xbzG/+/o7///////9enz/21fa/+HfIb/+vn3//7+/v/e2N7/Sj9M/7+1wv//+v///vz9/56Zn/9YUFv/npWh/15SXv+mmaX/ZVZj/7Sjsf9jUGL/aVho/+jl5f/y8fL/xLvG/yUZJ/+nnKr///3///39/f/y7vP/r6ez/8O4x/+GeIf/vq29/1I/T/+0oLL/bFRq/3tmev/++/z//////9nR2v8vITL/sKS0///+///9/Pz/7urw/62jsP++scH/1sbX/+LP4f+ciJv/79rt/2hRZv97aHn//Pv7///////a0tz/LSAx/6+hsv///f///v38/8zEzP9VSVb/YU9h/497j/+ch5z/d2R3/8y6y/9iU2D/bWRu/+no5//18/X/xb3H/y4iMf+Th5f/+vP7//79/P/z8fP/uK26/4x5jP/VyNX/yrrL/11KXf/Kusr/rqKt/8O7w//4+Pj//f39/+HZ4/+AdIT/0cbS//38/f///v3//fr9//Xq9v+tm6z/nYqd/9nF2v+0obP/7uLu///7///99v3/+/n7//j1+P//9/////j///vy/P//+f/////+/7iwt/+NgY3/nIyd/1pFWv+Gcof/9uP2/7qpuf+tn6v/18zW/+Ha4P/g1eD/s6W1/5iImf+DdYX/t663//38/P+/t7//ZFhk/5uMnP+hkKL/SjdJ/458jv/Qwc//d2t2/6ecpv/37fj/8uvy/7mquP9NO0z/Oi07/5KKkv/y7/H//Pn8/6mfqv+Uh5X/9+f3/4l5iP9nV2b/8OTw/8vBy/9pX2n/uq+6///////Bs8D/a1to/7quuf/m4eb/+/n7///////Wz9f/TUJO/5uPnP/s6Oz/8u3y///6///9+f3/mJCX/0Q6RP+hk6H/kYKP/+DX3//////////////+///+/P7/+fb4/5CIkf86MTv/wbnC///////8+Pz//////97Z3v9YT1r/QDZB/7Wstf//////+/j7//38/v/9/f//+fj5///////c2N3/u7W8/+zn7f///f///fr9///9/v/7+fr/y8XN/8S9xf/w6+///vz9//78/f///////P7+//3+/v/8+/z///3//////////f///Pv8//79/v/9/f3//f39//////////////7///79/v/+/v3//P39//v+/v/8/v3//v7+//v7/P/8/P3//v3+//v6/P/9/P7//v79//39/f/8+/7//fr+//z6+//+/v7/+/z6//v9/P/7//7/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
			fywx: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACfklEQVQ4jc2SW0iTARzFv5lam063mVuzeUtz5mRpmrb1UF5qLZtOv5lCjorMpFk6IqvtoWEXDGufWGioCIV5YTIvZWIvYqgQfopZ0tDy7qwkhwZlPXh6KIJIn+s8/8+PP+ccgvivZDKZnAAwxsbGNn4E3B0OB+fz+07+wpvKELud3kzTtMuaRoyMuH4wJEt7L6VmvizXFIw+OFo20UC2zTSRgzMNSfNz9Yqv809P3lpYsLHXhDTm7Ve3kZLl3hAOLBp/9OSHgzZGYvimDDYqDuNVakzWkN+nrDnHl5aWeL8gjJ9vq3xYF6O473SRW1Av3YpaPzc0aaUYKj2Gtw91mLZcwFzLZYzXnIKtON4x1Zi71+GY4CzPznotLi56EtW6eH9tMOfLIb4L1GIh8gJ4OLPdA93XMtFjTAZ9nQRtVGKwcB+Gzu+Czbh7dJJSCAE42+00izCZCCddtOiegr8JMVwXHBD7ItGHjSvyIFQpQlCXKEL7YRG6yQAMaINhyxZj2hj7bMYsY/7OQC8TMbN2eHfu8XRGBI+JhFA/KAQs6IPZKI3wQq2Mj444IfqUIrxO8cNkRiDs+qjSP4LMjuULVP5sm9SNgWghB0nhgVALmLgq4aFc7otHyjA0Z8SiPecgOvRp6CrSVvzVRpaEvzNOwPoUzmJAKfZBhS4NzysMGKgvxrCVwqtmM4atdzBkKcHIY0qz5iZSxV4pcq7rSrY8FK1Fp9FVaUBf3Q3Q1tugWyn0N5vxwlLyrf8JtW3dRSYHcQvzE6SrNbmq1eoCcuX+ubT5u7lHBs0nEluKNTKqKEF61iQh3NcFpBPEBk2YtzI90CNGySNEMoJgrnv8z/UDokMviWgxy80AAAAASUVORK5CYII=',
			aszw: 'data:image/ico;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOrp+S6fmeEuAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPzPjNhoLf3dDM8zIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACZlfdEgoD441VW4v+JhuXHubTsLgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPj3/hy9u/qPdnT50XZ2/P9LTPT/MDDf/2lm2LuGgNUcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADZ1/y7d3X5/3Rz/f95ef7/SUr9/xwd8P8fHtX/ZmLPuwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD7+/+feXX5/21t/f99ff7/a2v+/0VG/v8kJfz/Dg3p/xcWvP/GwenH/v3/dgAAAAAAAAAAAAAAAAAAAAAAAAAAk4/7zWlq/f98fP7/bm7+/11e/v8/QP7/JSb9/xAP9P8BAcb/VFG8/8vF6pkAAAAAAAAAAAAAAADU0PoMy8f8pWho/P+Agf7/a2z+/19f/v9NTf7/NDT9/x8f/f8KCvP/AQDJ/xwcpf+Fg8+ZAAAAAAAAAAAAAAAAxcL6ZpOP+f9xcv3/b3D9/19g/f9QUP3/Pj79/ygo/P8TFPf/AwPl/wAAu/82NLD/qqbdmQAAAAAAAAAAAAAAAJmW92Zrafj/Y2P8/1pb/f9OTvz/Pj76/y0t9f8XF+v/Bgff/wAAxv8AAKf/ko3U7+He9GYAAAAAAAAAAAAAAADCvvlmkIz3/1FR9/9DQ/n/Nzf2/ygo7f8WFtf/QD7U/zAux/8eHLL/U1G9/+Xh9XAAAAAAAAAAAAAAAAAAAAAA6OT9LtPP+sdbWuj/JSbj/xwc2/8PEMn/NDHA/8G/6eNsaMlwQ0C3cLm14XAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD5+P4ywL7w3WRi1v9IR8v/d3bU/3t3znb+/v5EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPX1+i6Kh9c4ZWPLOLGt4zjU0O4MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD+fwAA/j8AAPgfAADwDwAA4AcAAOADAADAAwAAwAMAAMAHAADADwAAwH8AAOH/AAD//wAA//8AAA==',
			fyxs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABqElEQVQ4jXVTsQrqQBBcTxsLC9tUfkFIKalErAQbIZX/YGGrH2AnCDZ+gVhoJdYilhaCEIRUVgZBAmmS6O285t29i/EtHNyR2Z3dnQnhP8EA7vc7PM9Dv9/H8/ksYphBZoKKJEnQ6XRARLnD/A+lbmTkgf+eJElQqVRARKhWqwjDEHEc6+8m9mcHzIzVaoXlcgkiwuv1+jkiM4NUW8ysW3QcB8yMLMtQLpchpcThcECtVtPjuK6b70DFdrvF5/NBHMeYz+eo1+s4Ho94v99I01QTKTJig/3xeMC2bUynU7iuC9/3MRgMYNs2oiiCic2NwMxI0xRCCDSbTTAz2u02drsdPM/DYrHIK2DcdYFGo4HRaKQBl8sFrVYLpVIJQgicTqfCAvUOut0uhsOhloYBSCkxm81ARDifz/B9vyCj9kGWZYUWmRmO44CIIITA9Xot+EUX+PaBem82G1iWpSX9JvhZgJkhpcxZeDKZIAgCrNfroozfPlBFer0exuNxLoGIcLvd8ip8z2VuWCXu93tYlgUiQhRFmgSAYWUj0QSodxiGCIIg/zMx4w/Wkm2wrZbskwAAAABJRU5ErkJggg==',
			ldks: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAABbElEQVQ4T2P8DwQMFAAmKI0JoObeuHoVTOMEIBdgA4f27QOZAMbrV62CimICnF74+fMng4maOkN8airD9+/fGHT09BgMTEwYFJWVoSogAMOAU8ePM8yeMoXh5JGjDP+AUjr6egzXr1xlePH8GcMroKHo9mGEwYHduxk+f/rEwMTMxPDg8SOGjLx8hmdPnzK8/PGD4e2bN1BVSADkAmQQ5Obx//rVq/81paT/CzOz/NeUlvn/+OEjqCwmwBmIgW7u/8vz8v9vWL36v6GK6v/a0lKoDCrAasDUvr7/MyZO/O9ibvE/LTYWLKavoPifB+jgRXPmgvkwgGHA5nXr/+ckJf/3d3b5rygk/F+Iifl/WkwMWG7JvHn/40ND/394/wHMBwEMA/bs2AGmgQH5v7Wu7r8EB8f/P3/+gMWwAYxYcHZ3B9M8vLwM/PwCDNKy8gzMzMxgMWyAYF74BYx7NnZ2KA8T0DAzEQkoNICBAQBATI0AkVV+DAAAAABJRU5ErkJggg==',
			wcxs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACeUlEQVQ4jX3Q20vTcRzGcf8Gp0bUReBhyVihvwRN59k8TLJ5hGJIkGWallIrD2lNzVbqTG1TnAqKZaVkBqYmelEeIhIlksgi58VMp4YhgQnfd1cGxvSBBz5XL3g+TgACsNlslJeV0dbaxmfrIpt/thBCIIRgrzgJIRBAREQE/v4BmIZWMA7aqB/+zuPxORbsayzal3kyMEpelYWKtuc7ge0jMjKSoKAgTC9/0Dy0Qv2AnfI+G1mtM5y1TKO1TJGur8XYUOEYUKvVhIeH0/TKjrl/mboXVmYX1intfIemahj1/ddob9XQ2FLlYIIQxMTEEBIaQuPACnefWflq2+D93CpvZ22ElfQQoe9Dq6+hpb3232+EEDuBYJWKks5vFHV8oWdsHl3bOCE3nuKve8Tx4m7OlFZjttxzDKhUKnwliUzTJOdNkyTdGWDp5waG7nGO5FiQZ5pJLajE2FDuGPDz88PHx4ekyn7U+l4Cr3Yiz3hIUIKW2Ph4pGN+hEVG4eXl5Rjw9fVFoVAQoGvn1+9NlNlNxN3sIKW4kcDgYCRJQpIkPOWHHQNKpRK5XE77yEfGPllR5jSTbuwlVGfBTVOILFiLSpOGsX6XCd7e3nh6euKe0UDfxCwdIzN0jU7jlliMLDYH1wQdybk66kyVjgGFQoG7uzsHT1dwNMPA6voGXSMfcNUU4nLyGi6nCki9UkideRfAYDDg4eHB/lQ9+xKLcEsp5VBaMbLobGTx+ThHZ5F8+Tp15komJiaYn5/fCWxHCIF9dY3QC3pk6jycozJxjrmE7MRFNFn5VD+4zdTUFFtbW7sD/7d78A0HEvKJO5fL0vKS4wl7AXv1L2DgE+iW3ISqAAAAAElFTkSuQmCC',
			buy773: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABq0lEQVQ4jZWTPUsjURSGhxUCUbFQtrRQFCsLW9utrLZZsLO0cFewEgsttfIPCLvb2MloJKIZo1lN/EgQ80FMHCJkg5uECNHED0yMmbmPRTZDYhwlF05xed/znAP3vZKkyNTW5z8bjIVPmFJDjJweYNle47WnrmovE9EAj1qZ2pMsFvgaOPoYMBENIIQAIHSfZyWTxH+XA0AXgm9Brzmgy2U3Jk+eB+sMC3EVgNPbnDlgNOQDQH24azB0728CkHkqmgOm1BAAy+nLBkOv2wHAcf7aHDAe8QPwO5VoMMxdRAAYj/gbtE9VwJcTNwCObMYQLdtrzMTOKAsd+SpVMb+q6Vi4AujYXacsdNLFApIi06KscnZ/a6ze5bIbTW07NoZ9e8zH1crLVAVPLgvA0NEukiIzeOjEmb2irOsIIcg9l7h5LuHNX/M9GqDVaavPwY/zIABL/+J1a1qdNvo8Dvo8DqzVpreC1OmyU9A0SrpOv0d5P75mUf6Z/AuA+yZLi7LaPGDgQEH7H+fFRKx5gKTILKcvARBCMHsRaR7Q496iqGvGb/yVTNC+s24KeAFzKst7O5oAYgAAAABJRU5ErkJggg==',
			sy00: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZElEQVQ4jaXTTUsCYRAH8H+bl7CCCuraYbM3tC4qkfRiZeULlpFCJLribnQtutShIPIDdKgOdY6ISKPNj/fvMLvspq4eOgw8M795duFhBjDAfwUMsE8Ht9Lg/SL4sADu7YCK7jQpOrib8nAYYCoJmirYtOJHBQ+2nQ+kklJze852vwa+zjpox/sMOFwG/Rr41sWxkm1HO+IZsJejuu7dcLoK9nJcLnk33ETBqy5+HQVRCzuFsxhorDl5LSzh9pMWx21EElMFJ4/A0RJYD0jtLgza/m35WAls2B4BcR6TpBGQywMV8GNaahfLYC9HISHJ1xQ4UQQHNfDT+kMhIWH7eBEcanHM550hie6DwUPJTRWcyzt5UwUjOTDU4vBVweegNLwEwceQnJ9CYL8O+qpS7+SKbo1yPPN3VE1VBsge5Y10u8eyrl1QdLAcl9evB8DipiyYe5k0lx+73b2aIyV5aa/V7eS/G/qppY0G/+0AAAAASUVORK5CYII=',
			du55: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACv0lEQVQ4jV2TzUsbURTF8z/UQKG48YMWq9lJ6aaloYuKGxduBKsLxf4D3fSLLkr9oFrUhSCCNCAkIOiixhAQLagphbZQKGJooaSNM5mJmsxkMpnJzHu/LiZq7YHDhbs4977zzg1JKfE1jXo2C4D0/aDCeTUmJ/F1/VL/DCEA58sXtGgU5/NnAHzTxFMU/EIBL5dD7+nByWTwNS3oqyrCsgIBWa8DUJ6a4ujaNdxv37DicfJNTShtbSgtLRdsbUVpayMfDmMuLDQEPA/hugjb5vjhQ0pPnyIdB3trC2d/n9rODnpvL9XVVZyPH6nt7lL78AEvl7t4whkkUP/xAyuRwE6lsDc3qa6toUWjVJaWsNNpqskk9sYG3q9fgUBtZwdjepryxAReLkctkyHf3IzS3o7a2Unh1q2A3d0oHR2okQh/rlzBmJkJBMy5ObR798hfvYoVjyN9H+l5VFMpCnfvYq2t4f78ifH2LfXfvxGmSXl8nPKrV4GAcJzAxBcvsGIxAKxEImA8jt7bizk/z/HwMH6xCEB1fR1rZQUpJSHpuiAl5efPqTQEnEyG08ePKQ4NYSeTeKpKcXAQYZr8j5BwHKSUlJ49w4rFkK6LXyohymUq795hp1K42Sx6Xx/1w8MgG0dH+LqOFKKxAVB68oTq+jpuNks+HA5MjERQb95E7epCaW8/z8FRczPa/fsIwyAkGxuUX76ksryMMTODFYtRS6eDLOztURwYQLl+HTudxtndpfr+PbXtbWS9TkicJfH1a/JNTRTu3OGs5x4ccDIygtrdjd7Tw/HoKM6nT5dyE5KAqFTQHjzgeHCQytISJ48eoUYiKDducDI2hvv9O/7pKZXFRbRolGJ/P3Y63fBASqQQ58q1rS3U27cx3rzB/fr10jQaw8zZWYzp6cY3yosDlVIi/ztZ6XkBhUA0DP8XfwHX8Vvvf9gDXwAAAABJRU5ErkJggg==',
			dsb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACHklEQVQ4jYWTTW5SURiGzw/puLTswLqC0jg2nEtXcLsDtW6Aw3UD0B3IEsRx4f6cmxqjxgRMTDRKa3FiYiKBi1PTcB8HlFtI/fmSb3AG399z3lfEShBKTaRK9LXibbWKq5SJVQmA/f19hBB/z1BJIlUi3a1wNZuQAzmwyIF8wXp0u93bDYb1Qz49eMR5I2B8csKX4AnntsmoGQDg+z7GGFqtFvP5HGNMkbVaDZEDsODncMjMnfG13WIUWC6alpwrrLVYa3HOcXl5SZIkZFlGni8rxatqlUQqXGWXUTNg6hyZO2PiHABJkpAkCePxGGttsXq9XqfRaCAirTiVJV7s3eVb5ykXTcvH42MGXh0Az/Oo1WocHR2xvb19m0EkJZEWRFLza56xOgkWXD+KaLfbCCGQUt406ClJT2le7t3h/ZHP0BgGXp3BoQeAMQbP8zbglcvl9Q0Eb6oHy2H5cvosTZmlKVPnCgZxHDMej8myDN/313QgNeluhXe1+3x4+JhRM+CiGfC9+4yJc8RxjHOOTqeDtXZz+qpBTwtCJchcwo8kZeAZBp5haOoFxEajUZy0waGnNKGShEoyde5aiYu1kzbDGFMUSykRsVKs/DDpPidzKW5nh9f3Dhh4N+B839/YYOMXIrVFqASfg4BrgTF1MbM0LQACDIfDP5spVJK+LnGqNZFcmiuSmr7e+rcTVwyWQhL0tSJcs3ek/1MsBL8BMKdNYjwNFRYAAAAASUVORK5CYII=',
			ppxs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACS0lEQVQ4jU2TOW8UQRCFe/0DEClXCsgmwxawGRKByZw5ggghQETI+AcAIubIOWIkHCMhQgwESN6ei3UEXjNdvbY5DAJ3z8xHUDOLo26p+1W9eu+ViWKpfEYYJ0RJqXw2OWuXEiSlkYTaWYJ8onYpHWYwsNY0klG7nNpZ4jihkkLvYok+o/IJwQ0mhaOk7XtK7VKMfiwIkhJdTlOmVD6hdik/H93nz+uXxOEqO3eW+fPmRcskJfqCyieYjmLjLMFbamfZG75lNHOczd4U21cuM545yWbPIP05KimIYkESgqQYrZgTSqUbfcHvB/fYfXifkelRHjvCr5WnbC9dZ6M3RXADGslo/EBHqNvOjRuy51WHICl/V57wpWfYffaARjK+3b7G+OysgiXTMSTFdIpXpVaunWrw4+4yowMHVURJ2Z6/wNbVS8RxQu1yxUiBwWUEr7ZUPqGRguhyti5eYDx/Xrutv2fD9IgfX6k7Lqd26kZro53YFLxa+PXwIaQ/R1hfZWtxge9LN6llrQXm2kg6G1v/O2/Dpw+MjMFPn2Dcn+Xb0k2CGxB9mxGfEVyiNnbA/+mz7D5/zGfTIw5XqV1OdDmxZdglsR5bQplhlFauFoql8gk7t24gp6YnIzWlRrp2lkY08k3ZJbHdgeDVzr3hO9zRY5T90ypY+4ZXJprCjKZUVmY/9egL/OICO2fOIf05TZ5PJqrr34TK/98NE31G42wbjlxPb4myBk5z0S1VlHQidiUFjWSY4BXcLVDXsfJacL9wOE2g7kxOFMs/HEF9/MHMXJsAAAAASUVORK5CYII=',
			qdwx: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACUUlEQVQ4jc2SXUiTYRTHj4FrbIM09Zn5bk4tzVnYUlm5urAPhzoKLBeafTlNvBETIwL7oBt9tldbW2ymmWOvjMX6eDdseiElGq10gRdvYCgZtaQEr/OqnS5kEsmguup3eTj/38X/HID/lpCtV+eu1I7wphrHLM8n/bVgPshfowSQEkCvUe9ZnBzvnBvjs+IGPCcOBZ17M9FeQNDMiJASQGteMjqLs9GckYiUANp3p2NfSQ76m4zv14OT5itqVq+Xzgw5z0SmX928LAfpcGXpDCWAX8LT7fePZMtd5cVoUYpx/ulDNavXS31Go8xdrU1529wsAUeRaqwnRybYC+SCvZARWIVIsO7YgpQAOjQKtOWnIJUnIKsUI6vYLPTkyARbfppwJ3/rysCBAjv0a7dHKQG8W8jMPT53/N2z1vPobzIuDht0gVgHnpqjC77a8kCgpX45eMn02V1ROkcJYFcqcODco4je25eLEy5rUuT1VKtNnYp026aImRFFYgILI16xMOIIq5IsD5ZpFj5MjRsoAbydl8RBn0YZfXKhGgEAlsLhnZQAOkpU3wMtp70xga+u4qW/pc5rYUTIqqSrAACUJODAwV0ccFU6F3+x9kGs1N4sGfrOGr6uLa0JXtzqPAkAYM1Nxi4CqwAAo+2NOH694+r6Nb5xnHSkrWGUEsBH9cf8vwqmum9sEGwg2GbizWkQNWck/vj0JtQWT9CdHkcwWHVY5SzKbA52NNTFZv37c7EnS4JLoec6AAC/6dSQx6hvjPuNv/NxYqxs1tVX9seBf+EnH60B2fPjhbMAAAAASUVORK5CYII=',
			shushuw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADTUlEQVQ4jW3Sf0zUdRzH8Q+GR/dFhKb94WD9YUvDRVGrWFnL1tj6w83NlMpcc0YCuRtElCMy75oao1gsAirM0FaIJD86UhACz0Q5BPzeIcf3DgTkiCH++CJ35yl8v99nf7hRud7/vx7vvV97C+6Zq7en+H2yHs9sHyMhhfFbIwDomobb7eKLIx+SUZfMkYHdtIxVINqv9eC43kP3DSey2s23Q/tI/eMh8vo2UDGUT72/koszTlyqkwMny3j1syTa3Q1MTEygqirivsMJxNQ9yGp7LC+1RLO+zcT2zuXY5Gc5Nm5jiyOSTR0mUlslVtof4J3m7SieQaanr9DYUId412khuzeTPa4dfHlxGxlnl5J3/n6+UZKwT+zg8HA6pYNpbD1tIqE+jrePW/AqCiVfFfPMU08g/n3/lbCHT/qiKB4QVI/G41L3AqDcbCLHKVjXbOb56o243W6qDv5AbIz5v0DHVAElHsEvw4IT/kgC870AtE9mUtgv2NklSK5bzqrvXsbSso+3qrL/AXRD49ClxznkFdgVgXs6EYMwBjoO/2tUKIL8XkGZdyPVl1p48detpNSkIcJ6iDkjSFi/wfe+OGp9gj9HBGq4AAigGeO0jS6hyiewyYLaMQshbZaANsvM/Cxi8+kkcs+v4fP+VZQri6j1Cc6MCqZmTMwEJYaummnyigUg2xlDRlcyWT2v80G/FbG2OZY3HNHkOBdRPCD42SdoHYrA/ZfEwKRE55hE3aBEpU/CKkukd0aR5ohn05lUsuQ8xC0tyMydKXb1PIJVFpQpgjb/c2h6EE0Poekh5vUgc3qAO3qAo6NFrG2WeLr1SbJctrslutQONp9ajKVLYJUFLrUEA+PeLwegVHmfx5rMxDc9TL63/C7wtbKbV04u5k1HBDndErNzl/83HNZCbDiVSHxDDOb61Wzp+RhhYGC5sJM19mjWtZiwyesxDB2Aa7f9/DicS+VQLuW+XD6St5HQGEfk0WWYa5IoHatF3JwPkvBbCrHHlrKy0UyBnL6w0a2e5YUTEaQcjyTRHsWKeglTzTLEwRUsOfAoSuAywhf0k3WhkPfc+9nVv4dz188tALLqpMjzKYUeK7YBG7n9e8mUC8ns20+R9ycMDP4Gv7Dr//LNJ1oAAAAASUVORK5CYII=',
			zhuzhudao: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACIUlEQVQ4jZWQXWhSYRjHrUWNqDuDXUQfN7td2OW6CLqJWJ9wqFaEmTtRkk3N0q3odZqmS9tOfp0zzDnPUXKNDbYGyrZaFJqpk7mj9EVdxLqIbqKPi8h/FzFqTV37wXP1vP/f8/KXSGqgl8sbGKNxk0QikTAMs67W2yVcOHFks+nYoZxFpdpKUdRaRk27VyQhipPOMauxnGBsr6JdxkFfW+u3m+fpXf8VZgnZMsX1fsxPTyJ3P4wX0xOYHY7CfUmtXf4yTa+PM7bJ17nnyIR8SA5FkR4dRvHJIwy6bLdqhve1aRuVSro9xbl+FiMcMvdC+PDuLd6IBbx8GEc6Pp4AsKqqoHGv4nDfDcuPUKcG+X4PsoFe5K1mJL1OiAKLCbcjTcVidVUFOpqWjnWb3hcGvHjqc2Iu7EOh34/s3TuIu8zwX7mY8ujbd1Qvz6DRFHkWi0ZgMcf7MRN0Ixtg0G2yfpa1qndWFMTMnQ9Kwj8CnoXIs5gd8OL6WXnw4BmdUk5I/aIgRVF1Ho9nA3dZnSwJ3BJBkWdREjhErMRe8XIwGKzfc0o7Mmon3//8wI9MgIEY9qPIsyiEvfB16BXVC9QR6ZDdZExxrvlShCuXIhxEgYUo/O5h3Nn1SUlR26sKFnDo9Q0jDoshwfbMPOYD84key9dnfbfLV+nT55YN/w0hZM2B5uaNsqamFlvHtS82g2HbigQL7N5/XCo7qmohhKyutP8FO6o/KA2Vm2UAAAAASUVORK5CYII=',
			jdxs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADNElEQVQ4jW3PYUyUdQDH8YfWWm0Ub9p6UWhRqQg4ZECCTdEtVr2wbNWapsM2W8WMYmuO5jBWay625gnGEZUsbVJuLJo4Akw97zw1kQFxxx0Hd8AJ3HV3wMM9d/c8z//5f3vhemP9tt/bz34/RUrJvdVmpjDHJpGGjtcXJhRSMYSJtAykaSCFhZACKSWKlJJ7Y5z6Fv+Bd7CWkvzQNsC+N3txXI2jplQgARYgJWD9PyD2fcR04TaG3S46f7xMUfFXrFlbz4svfI/HC5IkoIPkv4CUEvVgHYF1VdxwOViOqYzdnudkew/bK7+hYH0zA5cnMDABUAzLQgeQYACWgHDdu0zlVzD51yiJC30kjrchImO4hxeorjrGlh2t+H0xTGGgGEKSAjBAA0wTFg7VMV1YxqTPw0qrncCDOYyXlGIsqgQ9MTYU2Pi0oZO5SARFl+LuAuvfDzoLh+qYKipjcsJDymYnkpVDSnmI4Pv1WBmLPXt6qdz2JX+4bqGofRcgFkcgQQCmIFp7F/D7PaRsbcSUHObvf4Tp/GKMO3N8/IWb4qeb6T7dizLz+Eb8r9WwOhMCHXQLYrV1TG0qwxPwsNLSxkJWDqH7cgnk5TMf9nGksZ+1z7Zibz+Lsrh7L+En1hO6dhHNBGFlmKmvwVtYSXgkyGLHSSays9GUh3FX7yaRjvP63p8p3/Q5HR0/oaS7zhHJXkPQdgx0SdoE7YP3mCmoYNTvJdNiI6Vkcyn3eabONDPkN1mXZ+fVXU38dv48SiJ6h8RLbxF9ajNyZAghBJEPawluLMd13YHX3sLQK29wvbuHcd8cz20/Q2F+A581fY3fP42yqmXwjjqZLNvJ7KNFLJ/qJF1zkJHNpYxfuoamJon+rfOrc5qq6u/IyzvK2wc+YaBvkIxmoCR1wUp8mfHBcyQ2bCHwQC6hrMe4VV5KdNjP6Z6bbC1p4MncRoqfOc7+/U10df9OcikNGChWxoAMxFUVt+siN482MbR1B1dKdvLnDSe2E31UFDey6+XDHDl8AqfTTVJbQmIAEkWzTKQAXUIUg8X5WRwDDhztZ3F7buN0uOhq/4X+/kHmF2YR1iqQQkoBwD/CTyt+w+g0qAAAAABJRU5ErkJggg==',
			wxzs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACWElEQVQ4jbWS20vTARzFD5ubcz+vm1u14V3UFGOwtmRe0pVpNo2MbFtmySpSQ1NW0xSHmpBILcnIEk0jK3vZi4IFIcmYSEimRIiW/gM9RfgQcnrqIphh0Hn8wud8D5wD/G8NDg7GA5D9s4HVas0FEPr7TbBLdEG2gCykQbolbLPZIk0mkw6A6MTzNEXlmN6Z4dEual0hjHDKCAPObgBqa2sLLRaLUa/XywHAbDabMkuiNLd9pZ03Z0q+NvsO8OhIChPcEVS55OsiA6o3eywzm805zoYLnoYme8/Ux4aVV5/q+HDOzvbpAuY/SGRMSxjDTgZOAtBsGr3PZ93b0++Yqa4v4NvVZr5cucS+d2VsnM5lZm8U1VcESrNEHQBEG8D6iWzjPX/Za9+qk2+Wmnju8n4OT5zh+HIVe+ePs9yrY1xLOIUyySyA1J+g/r5Gftq7x9PmK1x/tFDOseWLnFiq4ajfwarOXA7M2djuL2TJUAqTriupOi9M4ke1IRWBScmtioXSZ6l0Tuawe7aYN/wWDr23c2j+FCs6jax+bGL5qI77bmkZ2xZO4Yjk6S+DGumi2ikwvUvNvL44HhvZTccLPa9Nmen259PxxMCsxlhm34lmapeKyjrZGiQw/owvtYvHVS45d7gEaptCGNUYypSOSB4ciGfe3Thm90TT0K35luBWrCkrZR9EBrQCUG+oDUkoEqejSF4q6ZcdFg/vvBr8JcYdxsQOBZO7lNxVH/wZAg4BiAYQsNX4RACkErPEKBRLPME2qVdaIPYiCBnAX2b7B7MAAOHbBbel79WZ3q7nbEqyAAAAAElFTkSuQmCC',
			shuwu1: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYElEQVQ4jc2TsUsCcRTH/Uduc2tzCGyT4EfgEE0Hkksi1BAtClEQdENR4HDcdCD8QPiZIVwFwSEoNEikFp1RkIcNp0GXkWdZUYN9G+IEOy+Chnrwlsd7n+97X3ge/DI8/xtQub2A+Xz/c8DRzRmUegGixhArJuBNBeFNBRErJhArJiCUZVTvau4A3TIgagyixiCUZHCUgKMEvBqHqDHkGyU0u+ZwQO+9h6vONUK5RUznlsCr8X4KJRmixqDUC9AtA+3XByeg2TXBUYLR7RDGd6ID6nbatce3p+EnzORXMMKmPk8oywPDvBrH/ME6yO6suwenrUskzxWIGkO0sNr3wwasVZJovbTdAQAgVdPgKIFQlvsQ21Cpmv7a7gTUOw0ElAg4SrBVU7FxTMFRgoAScag7AJsnFGPZMLypIHwZHhN7c/Bnw/BlePizYUzuL2D5UPp+A90yoFuGQ8kt/v6ZPgC+QIxLSK9k4QAAAABJRU5ErkJggg==',
			biquge: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC10lEQVQ4jX2Rf0zUdRjH36x/qBNjwAyp8aOo6aAAXW5W6EZrI7Z+rfztkrFlKzev1sEBBwilgw3bghhEdQLBpW1uToQc/hEiKHSwQBNOYOIUqRUx+vLDO487Xv0hsNNVr3+e7fN5Xu9nz+cj/TdBoSFqCA1Rg6Sg/+n7V4Ijw9XsOi1cDvF4mFolPbJ091aCogZWK7gx4Ow+wtY/oQs3TgiGBAPiZq14dq3OS3o/U5sZVjGXlE2ETN89KEdvitHgZL2gS8x3lDJ/oRTOi+tHTRS9beUX5TCiEsb0GYmKcgXKiRnxun2nSvDjQ7iddpbxXG7guOMI3X0j3Nhqp1Nm9uh5r6Qdy3LqvkRN+T8X/pOP4nGdJRDnQTPt1VX84fXh7B+lYrcVSZXL8lP7k+WhQvh+iOHurSv3yQPmD+iMFtP7w+mwf429/kt+/8jEJzGak7Rea01q8peJOUcK3qmJe5ZvHP6sYdC8l+44MblN/PSMcLyeQX9POzer1+E1i6hgfa/UOI3VvyOKij9dXBm70MbwLvFznBhPFxcTRNOrL9N+8RJjt26TnZOz2LBdpMZqWJI2SLLl5ttmARaBUct79MaKkRdE73OicYM4fuwQXd19zM3OYissnpGUJ2nj8juszrfZ3Pj8XLd+SF+0uJIoBpLEsZQgKg+InrYaPF4fAIVFRW5JqwK/MCrvUIl7YdBJ7xrhjBZXk0X1OlG2L4hr5YKJVjz+exvaCgrdkiIDAyI/zs71MDOO640X+fVpUfGk+CZLzNUK7GJ+5BR/3/GzCFiseR5JjwUGbKuzmZme/I1zTZWU7nqJjoOCLwRHBeVi8moL4zPw1wLUHy5E0vYVOz5UzcNlyXSVJDNUlYq3JQ0aBd8K6pbqmTTutmXibc3C91USMSFqWQkIf1iO3C0yCl6RUZAhw/qaDMtOGZZ3ZViyZFj2yLC+KcOaLsOaJiN3i4wIk05I0j9LpN0x+m9OMwAAAABJRU5ErkJggg==',
			ckxsw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABrUlEQVQ4jaWRMWzaQBSGz1W3So4x7ZjIYUYqnbPAXBGpewd3jMrQrO3ijbAAU7KyRFkZmt0SdEdKO5Ag++I0gqgOsaE1IhH6OlyxgtQpnPRJ93T/fad7T0wadeSr509i0qgjLl9qrMP6ApkVyKwgyBmEFZvpSYuwYjP+8gmZFYQVm6jmENUcRrvFlfrnG0sJgpzBIo5YxBGzby7LJbOCqOYA8BBIRrtFpictAObfe0rgmxqzrssijrgqbOObGsNyCYBhuYRvagDc1RwutzPMz3rMui6+qeGbGkJaBgDxURMvI1L+nLa5O3DwMkIJDhzioyYPgURaRpoT18vX3r9jkHmWIl/n0j3A/KwHwM3HDys58evzPgDX5dLKwWMer6Trrgqu3hYBuK06nG+IlMGWwWDL4HxDfeH3aZvbqmroaM9Oc+JiU03gPpBcbBr0dUFfFyQdl/i4RV9XgrDq8L+s6OuC8J/5PpCEVYeko6bi5S3kTgGA6dc2Xt5ifNhUTT9u4eUtJVhKFnGUhuVOgb4uGB82STouScdluGen+2UtfrwQrMP6gkmj/uTLk0advz00erlNlzMOAAAAAElFTkSuQmCC',
			du7: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwElEQVQ4jZWTMWvbUBSFn4kdRIsp9mLaoiEaPHhq/0F/gBFYtYRRh8yllJJsKZTgLWQIJNDQQRgpEqgSVZxAh6bQrqVLJ2+ZMpSUeOkQijTofR0MMq7jFB+4cM/hnsOFd58QN2C40ydut4jbLYY7fT7++MlNcwsRt1vIsxLyrESkNzl9pvHh6WOSFyan4fD/YaGuIc8F8lwQt1t8e/OAfCQYf1GKreZMJ7vbhLpG3G4R6U3yVEFmq0R6k3j9Cb++3+PP74kW6tp8QKhrII/m6vpqn+ur/QnPPMg8Ir05H3C8t0XUWcM3VHxDJZcZucwIdW2GR501Tna3mTMH3Qa+ofK+8xDfUIENYAPfUPn8+tEM9w2V472taUjQbSCz1aXKM+vTgOHBJp5ZxzPrBN0GnllHXq4gL1cIug0GvRpBt8GRcX9GX/iMnlknHwnykWDQqxWDjq0U+swG/2LQqxWH5NgKrlXFtaoU+teJvjDAtaqkSZk0KeNad4s+TcqkcQnXqjI82Fwc4NgK48MK48MKjq0Qrt8p+KdXCsnb57efs2NXuOgrXPQVHHticOxpf6tZCCEmhgqOXSF593K5n7gs/gK07X685Y5nAgAAAABJRU5ErkJggg==',
			klxsw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACyElEQVQ4jW2T20tUURSHz5/Q6DlnzjljppVJGRVBBD10vxgkPphIlqSoFHRHuwdGJRSBFERBUBDUQ1nRHe2hOWc8aqaZOqOlo2ImZmUXm8xynP31MKOpteDH3rDX72OttfeWGA0hCDT5+Pb8BQiBiGh031/2lJEfP5gc0njAh9K7NGdm0X3hEv7d+3iTtx1/wUF6Ll+hbuU6Btv8Yej/AL/7+/FtzaNCdeFRjYhceJTIqrroOltCaOgXjINIAMOfP+NNz8SOnYGlGpiyjqVEJGtYsoZHj8WeOp3OE8WEhof/AkQwiL/wEHZMPJ8el+HNysGMUjFlDUvRMWUNt0Plbck5ukrOY2sx9N28/RcQ8LVQPXM2HmMafbfu0JSxGXeU8x9A56nTdBafwYxSqV+VTHBgAIRA6ig6iUcxwganC1PWJrUQhpiqgakYWIpOpSuOLx6bkcFBJDsuAVPRMaPDxgnmiExZD+fI2lheddJ8apcsRRpNaMnfgdshj5U+EaBhRjmpmjMP7+ZsTIcaOTOQPKoLt0Oh40QxFdMT/9OChuWMoSF1I01Z2fiycjBljQo9lprEuUjhyU7l5cq1NOduw+1QJwBGh9h24Ahfq2uw4xOoSpzLx/sPGezoRAoOfOfV6mQsxeDNngIaUtNwT5HHKnFHOzEVndZ9hTSmZWDJOm37DyOCwfAtAHwxLapnJWGpBr7sPPxHi2jO305jxiZe79yL/1gR9etTsKKdvFy+mqGenokvUQjBpydl1C5YhBWtYccnUJ+8gca0DOqWrcLjdGE7Y3i1PoVAy+ux/yCEQBJCIEIhRCjEu+vX8Gbn8GLhYipdcVQasTxTVepXrKVhSybffV4C7a30V1mMDP2k99EdpFAwSPvFEgIdfmq3pNJ94yrv75XSUrCLDw8eUJOylKHeXpoKtlGXm07NxjW0nj1OX/kjyhMc/AF6F7I90DQBdQAAAABJRU5ErkJggg==',
			qqxs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAnUlEQVQ4jWNgIBL8n8ev9H+eUBoBBcIucDxHKPT/HMHy//OEO/7PEz7zf57w///zhP//nyNYjsMAoTS4IsLYBZcLcGuaK7T7/xzB8v+z+Y1xe2OOYDnUJTCvwDUTDqA5guUYGGHAXezy/EpQA5BsIw27UMmAafyCKFGIHgaQaMSUn8YvSCBsiAzEIWDAPOEzlBrwnzwDkBINWQYQAwDs1SCmuYzLwwAAAABJRU5ErkJggg==',
			shenma: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABgUlEQVQ4jYWSUXKkMAxEOQa+Q/DuVcJeYGeuY37xnIiPYY8THNYE6+2HhGdItiqucknYptXdUiMIIgIiCAL2LVIs2t1/chGhQQp6LmwhsvZX9unPE6jep9azT7O+BStQaJQBGAprf2F9vZwYiBSS82whIhRjoffNgaQYwhZG1v6KiPAxzezTHRFhcR05jOzTTB5ildyIwBYiyXkW17G0nsV5UqsVF9eR2o7leTuvEhVArStGa59mFqObh0gON0SE1HryMFreVY8ajYcMYe2vrP1vRIQ8RP72F3KILM6z9lfyEHlvPUf3GszEQ4pS/sH660I2P3K4sbgXyyPvxkA94KB+rxr3aa6u5xAr7RzUvOS6xxyIiP3w00C80R/JYSS5rpq6uBczudPWYxL26W5DUnhzvva4TLOeo1VzUBOVVXkwqOOL1BbVbYOTnGcb4mm4zMTzeqv6ygkouY4txM/PvwKk1rNZv7HWPky8fQ+gw1KqpCNuYVQ53wGc9D+DmKzP6x8L2301S470UQAAAABJRU5ErkJggg==',
			sm: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACCUlEQVQ4jY2TzUtUURjG3+xrEbQTV0lFu2jRKiro649w3Qe0CGkViXeKLO9k5ZijfaCbFtUiHcaYGdCKPhBzIW0q0UyEmogpchJGps45c+beX4ur6dyZpMXDgedwfu/Lc95XaJV6HEnhiiYq/Jdc0TiSolXqBUdSdAnE/y3vwR7sWATi61b8LgFHUoIruuJBT12gVZ590YxayMH1ENwVLURXVXq4FzOdwHx8gt/f+NcvTXSiv83g39lZCYgKlYDBw9iRc5STp/A7NuMNHkJ/GUcVfqAWcqhCHjObxu/dWA3wHh1Az73CvE+ilMI+a8bMZPDbt2Km0pjpYexIC+pXkdLETehZH+qgW+CS4PXvQxXy+J2NlAeaMG/6UIvzmMkUNnMW/X0W8zYB10Id+H312NHzqMV5VD6Ld28/+tNLvPguVD6LTRzHv7UDPTcKF+uCQFcD9OcxzOQQSilKr3spjXagfn6lfP8Y6neR0vhtzIckfmx7UL0qxKhgH59EFRehrQ4/ugn7NIJ5lwgyGTqN37YBrq7xC6Xxy+jcFLQveTcE7+5ulFL4sW1UDVwYYIdPYIdbKqqUE0cCQHRL9ZSGAcQEriydy4BME6pYCPyagPAoh2Sfn0Hls+DWuHdFCxFJr7VM5YGjeH0HK8NbXqaIZARHGohIGldMzdVtF7ggQQcr62yISBpHGv4AqgfEPAL5ePAAAAAASUVORK5CYII=',
			vodtw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKElEQVQ4jZ3K3UtacRzH8fOHtbF101VYd7vpD4i6sD1ADjy7WlEEokgRSLID4haxHrZpHGp1qpUPSSyzTbM0Pa7UJM3QfFjvXejOOqOrLl7w/X1+byGx+P08H0zxELHZUETI7aa4rf9+kF/+BEI2cMptvfkgGd8xwrk/wW2tqYnIIYKz6/eKyCFdm9mOI5xtn/D7pqGx9b5hw+El8H695UPLpsOLrVfUtenNI4TMZpxmpa6x9YgU1Qvd1qzUKaoX2HpE3ZZa/4mQ/hqlUb6hUa7RKN9gNYgk/VFysYxOMhDFahDvtDWSK4cIp/IhtcsKtWKF2mUFq8GM1G/FbZzSkfqtWA3mVtduj71hhJPP+1Rz11RzZbKRNGf7p5qrVIGrVEG3ZSNpqvky1VyZo097CLGPIa7VItfqJaNPnuMatOMasDPRNcyuW2HXrTDRNYxrwI5r0M7o46F2X+THXADh0L1D6ThPKZ5nrPMlpXieUjzHoijhl1bxS6ssilJ7zzPW+ard5wi7viHsOzcoHGQoHGQYe/pCu+dNTnYcMjsOmXmTk0L4TtO+92bWEEJTK2SDSbLBJKOPhlgwOVkwObF1m9ma9LA16cHWbdb2kQ6j1genZASfxYOqRFGVGCMdRnzTMr5pmZm+cRTLEopliZm+cW0f6TCiKjFUJca25QvCxsg8CW+4ZfmAxHL4H29Y//67ta29nUN490xUPa8l/ue9Z9P9mSQcveLeHxFcXUxSnBZyAAAAAElFTkSuQmCC',
			wangshuge: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACd0lEQVQ4ja3TOWgUcRTH8Wm0FcHGQrQJWCm4KIKaFQsxUYuA2AjaDR54H4ggKYQgkiIq2AreQYMgwUaRYLzwym6y2ejmMBgze81eszP/neP//38tEpJArNQHDx48+Lzm9wxA/0sbs8Nf1/8DlO8jnvaiwwitFFovdrWU+M9foqq1PwCehx1vIXz7Een7qChahATjE2RXrSXK5ud2c0Bk5bDjrVg9Lzi+6zpKKdoP3caMd6KU5tSem1j9A1grm/AnJtFKzQNy8ifenUfY8Vbqr94SM0zyU2VihknMMKmWXDYtOUw9ncFa2YRIpgi+JgCNQRhq8bQX98kz7Hgrou8NJ3bf4ObFHjYvPULzshM86HrBubZbRBM/ZoD0d2rXutBaY+i6q50rnYgviTngTe8gMcOk48g9rh69T8ww+dz3jWh8BvCSKarnL6OUwlDZvK4eO0Pj1zTF7btxbt/HzlYx453YuRq5qTJmvJNKwSEYHsFasQZv/AelgyYyDDHk91FdatmHqFQonb3E9PLViMQQQRAQhiFKSoQQ1McmsHe2Udy7n0apjL2tBSkERvD6nS6s20L1cgeNkQz14RHKpy8S5gtIKdFaoaTEvdON++ET9dQI7t1u8k0xVLWG4b//pHPNLVjrt5LbuIOyeZLaw8cErjufA60R/e+pXmjHbjtAdkMz1vqtKKeOIYu2dgdTOANJnMQgbiqN+DlFGAQLgqSJCjYiM4qbSuMkh3ASg6gowtCuqxufBxDJIYLpLKHnERaKSN9n4ePJmkPkegSFIn5mjMbHLyg/wCCKtMzm0UqhAh9p5ZDlyuz1+Vauh8zmUJ5Aa0WUy6Ol5DeL1IM+xBxQeAAAAABJRU5ErkJggg==',
			xinbiqi: 'data:image/ico;base64,AAABAAEAEBAAAAAAAABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAQAMAAAAAAAAAAAAAAAAAAAAAAAAETf4FVP4FVP4FVP4FVP4FVP4FVP4FVP4FVP4FVP4FVP4FVP4FVP4FVP4FVP4ETP8ETf8RiPg+nvkgj/gRiPgRiPgRiPgRiPg+nvlNpvpNpvpNpvpNpvogj/gRiPgETv8ETf8RiPjx+P/i8f5rtfsRiPgRiPhcrfr////////////////////x+P8gj/gETv8ETf9Npvr////////////x+P+IxPyXy/z////////E4v3T6f7///////9rtfsETv8ETf8RiPji8f7////i8f7////////E4v3////E4v0RiPgRiPji8f7///+IxPwETv8ETf8RiPjE4v3///9Npvo+nvmm0/y12v3////E4v0RiPgRiPhcrfo+nvkRiPgETv8ETf8RiPjE4v3///9NpvoRiPgRiPiIxPz////E4v0RiPgRiPgRiPgRiPgRiPgETv8ETf8RiPjE4v3///9NpvoRiPgRiPiIxPz////x+P9NpvoRiPgRiPgRiPgRiPgETv8ETf8RiPjE4v3///+m0/yIxPyIxPym0/z///////////9rtfsRiPgRiPgRiPgETv8ETf8RiPjE4v3////////////////E4v3///////////////+m0/wRiPgRiPgETv8ETf8RiPjE4v3///+m0/yIxPyIxPym0/z////E4v2m0/z////////E4v0RiPgETv8ETf8RiPjE4v3///9NpvoRiPgRiPiIxPz////E4v0RiPjT6f7x+P9NpvoRiPgETv8ET/4RiPjE4v3///9rtfsRiPgRiPiIxPz////E4v0RiPg+nvkmkvkRiPgRiPgETv8FUf4RiPjE4v3///+Xy/wRiPgRiPiIxPz////i8f4RiPgRiPgRiPgRiPgRiPgET/8GV/4RiPg+nvlNpvovl/kRiPgRiPhNpvqIxPyIxPwRiPgRiPgRiPgRiPgRiPgFUv4DTP8FVP4FU/4ET/4ETf8ETP8ETP8ETP8ETP8ETP8ETP8ETP8ETP8ETP8ETP8ETP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			quanben: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC1klEQVQ4jW3STWwUdRjH8f/LzM7sdGkpWwSuHjwaE4hwMjGpMRIuXnzBNKkcjAdNIy8hRMOJFw0pR0yNiYZ48iCtjTcjL5JAoC9Iu4G2VHa302VZd7e72+3O686XQ2MM2MPv+nmew1dEUhMrga8MfCWJlKC5ZxerQ8NMZTNsaE0sTDxDkIj/1hWCrhSISEo8Q9AVJoESBEqysvd1qLXg3l1q6RSJlETK2BoIlSCSkkCabBiCvJNm4Zvz0Fnj5/c/otBj0zZsYv088O+ErwWe1vjKoJk2cU8fI/Hr0GxCrQn3p7mzZweBNujKzavPAaES+EoTak15m8PSmXMkhQKl4WFKIyOUJiYpj4+Ty/ZvDcRSEEpN09DM798LuWWWvzrLQraftYNvcO3APsjnqVyZYL53Oy0jRWAoQqHoSo0IlElXCRqWRfnyT/D3ArcG36R1+UeSagVcl1/fOQStNaLbNykPD7HSbxMYm18LT1mESjKT3QH1Bu5vk7jjv8B6G/wuVGtc372btdGzEHSg1aBx6SK57DaqaQMRC0knZVM/8zXkixSPH4P5hyT+OkkYMn/yFB1hU3BMyj98D+02eAn8U6E0NoaItMXsa69C7SnFofd44qSYy+5kZvQ8Scdj6sQXPLUMIm2w6lgUj46QzM1C7j7M3kM82rcfHuR4+MnHrGR6WTxyBArLEHjgdaHVZGpnP5HUhKZJw7Co2RlK6RRuj0asfvYp9S9PUrEdVl55meKVCUrffod79Q8IPXj8iHxvHxv6/yXGUiCe9KSp2IrEzFB3UriH3mJu5HNK1/4kCXwmP3iXxb4Mnmlt5vsCInyVYkNLPGFRTWum3z6Ie+M2tEOS2CNZr8PSItXDHxKqzasvpKyo2ZpYSR47mtrYGLRbsPSAudFzLFwYJfr9Os3Tp7YGQmHTSJmESrCetvhrcJCZ40eZfmmAkmNS7Bsg3zeAmzGJt0j5GYr1gDjxbbToAAAAAElFTkSuQmCC',
			aszw: 'data:image/bmp;base64,Qk02AwAAAAAAADYAAAAoAAAAEAAAABAAAAABABgAAAAAAAAAAADEDgAAxA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAArwBXnQBOnQBOnQBOnQBOpgBTTgAXAEiLAJj/AJD/AJD/AJD/AJD/AKD/AAAAAAAApgBDlAA6lABClABKlABKnQBOSgAVADx7AIj/AIj/AIj/AIP/AH//AI//AAAAAAAATki2RkSqRiBjJgAAJgADKgAFAAAAM1h2OHy/ABhXACtvAGN/AIp/AJaPAAAAAAAAAJj/AJD/ACRj////////////////////////////mIeIADIAAJUAAJ4AAAAAAAAAAJD/AIj/ADBwj4d/f39/f39/d3d319fXd3d3h4eHQDdAAD4AAJQAAJ0AAAAAAAAAAJL/AIr/ADqQAAAAAAAAAAAAAAAASEhIAAAAAAAAAAAAAEoAAKEAAKoAAAAAAAAA/3gA9GoA9HIA9HoA9HoA/4EAej4AAAAA/y/7/yri/yri/yLi/xni/xvugBNlAAAA/4EA5nMA5nMA5m8A5msA9HEAczoAAAAA/y3u/yjV/yjV/yjN/yjF/yrSeBFeAAAAWh0ATBYAXCIAbFkAbIAAc4gANhIAAAAAbwBRXwBEbwNMfxOkfxPrhxT6OAgc////////////ioiYADMAAJYAAJ8AAAAAmJiY////////iJV7AABrAAD/AAD/AAAAz8/Pd3dnh4d3QDcwAEIAAJ0AAKYAAAAAOTxAeYCHeYCHMjkwAACAAAD/AAD/AAAAQEAwAAB3AABvAAB3ACN/AEp/AE6HAABALhMAYykAXCYAZC4AbDZAbDaHej2PAAAAAAAAAAD/AAD/AAD/AAD/AAD/AAD/AACIczoA9HoA5nMA5nMA5nMA5nMA/4EAAAAAAAAAAAD/AAD/AAD/AAD/AAD/AAD/AACQej4A/4EA9HoA9HoA9HoA9HoA/4gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			nmtxt: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACcUlEQVQ4jZ3SX0hTcRQH8F+EL75EL1OTXE3FSs2MyoQgggixFwOhKIIS5kNBFBEG5YsVQQT9QYpBYBBCSd6FijlzDf+yP/fOce+uW/duu7vTXed1m1c3NxnGtydfKvfgeTyH83k430NI/tqVSE23Bpc6RkPqrcxC8jFi2ltHIv3lTS63cIwQQkg2q+gXtZef19bplr+3Q8s9nVahEjOhajByA3yLLYiudCGVHUMy3ZNbzUzcJdH4q56Y1gVRNeaS6amrW8srWUU/xFdkRnz7YRUMmAxUwSHVwB2pR2i5Hesb04ivmTTik69E5fhNKNpzsNHLqWxWKSOEEFHpvWfmdBjkS2Dx6/FTKMdU8DCc4Vp45k/CK7elYglLG2FD5+CNnoJLroM93Aivcr+fEEKY4LPXZq4IZq4IQ/w+jPoPYMxXuekSjA5ZGTYmk8k9hBBCGLEB7MIJOMNHMRGowqi/fDOR5i5sARSnwzeuGOP+S87lFfbsP2emhTPwzB+HPVQDm1iJEV8ZmMgdipdMD82cDhSrw0zAaFUUpfC/OTFiE9yRekwHj8AqGDA8V4oBzpDxR3o7KVaH73xDWNO0vdsG7RaveVxyHSaDh/Dj10EM8iWgOB08ctf7fnfphhAzPcr7Kbz0wOyQajEeqILFr8eAtxgUp4NNvOgdYhrD8TR7Pi/gl7tf2KUa2HynU7OBpx+54Id3Y+7r1q+e4t9WtnU+keKr8wKLqquZFtsZTVsybPVomi6wzz35ZGGboa46m/IC25WiKIU27oYgqVTHjgBCCJGWLC2+iKl3xwBN0wWc1D3Q19e3e8eImmRur26oFdvN/wDeCIuZkicJpgAAAABJRU5ErkJggg==',
			wxxs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAUElEQVQ4jWOY2cX1nxLMMLOL6///p2xkYeobUJLMShCT5AJ0DSR7gb4GEON/9HDA6wKYQnyuoJ0ByJqobgDBMMCnAa8B2FIartihfl6gBAMAZXKQhz9bojMAAAAASUVORK5CYII=',
			wdxsw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACcklEQVQ4jY2SS0iUYRSGx02piwhxoIUtyihcCKKgYk7qmOUlhawITWwhJmhUEERpuDCLIsTaBi5aBCFkYiOKGpY6zqQ2V53xjo6O0fj/cxVNYr6nhdpNBzxwdud9zjm8r4IQJYQgYLezbrOFGgFAEUrsMpuQmx/je9mA32pBCLE/gABksxnPi4cEGssIPCrF11yL1zC2J0Txv9xtNLJadxf//asEnpxj7Wk2/voivLXVbOh1WxtCAYwOF/V37mFJjMOddwRPeTTeymg8xUpmk0/wrOIKDtfoP5codn42OGVuGl3kdVopzczHHKdEyopGyoliKkFJdcJRWjoLMKzU8N339TdEEVj/gc4hccvqIccSIMPsR62Z4OKZ84zERGGJUVIVH8MrjRrdipphZzbGlRqcsh4hBIo39m/U2Xzkjq9x2hogxewjxeQnsdXE2WQVJSejaWqNQ7ucgdaZhtaZxrAzk1FHNUvSIIqRZZlKk4fYMQ8Hv3gJH/ESPiAR+dpK+uVLXCuOpel9FJq5SD7MbrVm5jC9k+ksunpRCCHQOySKRmWUA6uEDcqEvbWRVVbCYl8h0lAhVddP0dQRQfvUAdonI+meTGJBakOI4LYLQqBflkjtWSKixURWWQkL3TlgvQDWQlY/F3Cj9DjP2w7RZU/E4WlHbPv5x0Yh6Jl3c7uhlvmOHLAWwEQ52CoQ48W4PubS+CCTeVfnbhv/hrjn+9jQ5cNQHIykgkEFw/H81KkILGh2pXF3lAXIs92sD6rgUyz0H2OzPwnv9Lv9RHkHIlid7mJ9SM2mVoV3qo1gMLjX6N4AABEUuOd6kWc6ESHEAL8AOpNYzRwo3zEAAAAASUVORK5CYII=',
			kmsb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaklEQVQ4jd3SOwqAQBAD0IduIVYe2fN4CY9iZ+sRtBKWxc+gVgbShGSSYigwkmbaUp9pR1KpH2JlhYF6oM61MPJAGZ5oTkMRhlrzg1eevy14jGjz50sOP/N165UpfODRgp4KFro77t5PsAFNDaPSbnyEqAAAAABJRU5ErkJggg==',
			bltxt: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdUlEQVQ4jWOYwcHxfz4////5/Pz/5/LywtmLBAXhbBiexcWFIcaATZAUzDCbm5syAyjRTD0D0MH59vb/////hyvCBs63t2O6AFnTdm9vuGJcavAagGwzWQacb2////zwYfINgLFhXiHKgCGcDoaOAXN4eDDEAEHO+jnZfDkoAAAAAElFTkSuQmCC',
			qq119: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACuElEQVQ4jWWTXWjVdRjH/3cOCstMa6gxiYVthNvIpS4wEIpq5UXuQucSzU4kdmGgFGaSG6xXb6yRSISBoOXcTtY8kiKrbUxIYWDmUCqXKJqnM2E75//7PS+fLk520Xngc/V9+D48b0lwQdUQC0SdBqOMA+aIC67g4ogZGPi/4JCYRAhQCgEPIK4ognhEPMVVEC1imuLBUL+jlUlQI7US/b8cYbxwEXPHXMuYYAEu5Mc5cvYbJv025oaaISaIKom5M3p1mPaTz9PxbSuvHm8nk2tn4/dtrOt7gWs3J9h9ehvrT6/i9YG1ZHIdbBpYx8v9bWRyHSSppbyV3UpD34M0fzWfJ/vreTpbR/0nM1myt4arhRss3V9H46Fqlh2cz8psE8sP11DTeRevHFtLol7ifOEcXYM76B7cxcZj65n9ThXVm2czfG2YEIocONfDh4OddP60i6X7FzHzzYSW95r4beoyiUuEVPEAf0xOsGJfHfe8NoOe0T2opIgENCikMHplhNqu+2jcXs/45K94cBJXwUxItUjmuzU8/EUVXafepWgRUSFoRKNxKX+Jp3of57HPHmDk+lB5YxpI1CIhRj4Y6mZJXzWrv36GUijiakQLRBMKU3lae1t49MAsPh3+mJQSBFCUxINxfGKA1qPNNOxbwIXbYxBBPGJmRIl8NLSblbkGNhx6iRJF1AQ3x3GSaSnyXO8KWg4vZOuJDCaGRyd4ipsx9Pspns0+wcK99/LjlZMQyxdorjhGMvLnKLVf3s3cN6rozu3E1HD1/6rs+GELj3w+i/u3zGDs1lnUFTPD3MqXOJb/mdq359H8/mIGzmf5f/Sc2cND2+bQ1vMi+em/KvREo/J3KU9qJSRKRUKwlILfosgUHr3SIGoAAQ+OeqWBq+NWbimQVhqYlT9MEVQrDe7MxM0xswr9H3FBZecAKpxlAAAAAElFTkSuQmCC',
			blbb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAv0lEQVQ4jdWRPwrCMBTGf5Mu4uSoF/AgXkUQnMTJ1V7AM3gATyFuIrh4BaWDS01e0tYh1ja0lkpx8INAePn+vPcCv4PVYJM2BqqtQQwmbGOQgExBLu7eqJu0B/HKzQ8g+9zsEdQIw36eIifQOz/x613YBKLhq6uB20djqJkvkDnYqMxLuzXpRZgz6HWZZ45VYgNq4dfkALKpDgpHxYIFtSwT9diR1QTSjhPZrauZa9bO/cM82XuQ/9L73Oo1f4MnCFhmBclKSHUAAAAASUVORK5CYII=',
			bookdown: 'data:image/ico;base64,AAABAAEAEBAAAAAAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAD////////////////////9/v3N2M6lx7Knx7PU3NT+/v7////////////////////+/v7+/v7+/v7+/v650cEzsXYN0IUN1YsN140NzIE9sXrH2Mz+/v7+/v7+/v7+/v7////////+/v6XwqcQw3UM3ZMK15R51rNg0acK2pYN25EUvXCry7b+/v7////////+/v7+/v7A1MUStWQN0oUK2JRRz6OQ0reb1r44y5gK2ZQO0IIXr2DT3tX+/v7+/v7////+/v47nmAQvGgMyn8pwomg1r/g8enO6d2i2MIZwYMNyHwRumRSpG/+/v7////+/v7M180Rm0QQrVoUrGWh1LzA4NH+/v7+/v6u2MSZ07gOrGIRrFcSkj7j6OP+/v7///+Tt5oRkjsPkkKOxKWjyrT+/v7////////+/v6axax5upQPk0IRkTqpwq3////+/v55p4IPgi5NnmaYuqLu+PPj9e3d8+rd8+rj9e7n8+2bvaUzkU8PgS6Qs5b+/v7///99pYMNciQhdTW62cbD5NLD5NLD5NLD5NLD5NLD5NKtz7kWcCsNciOVs5n////+/v6guKILZBs4h0psrH6Ovp2mzbOmzbOmzbOmzbOHuZZsrH4tfz8LYxq4x7j+/v7////j6eMKVBQvgj82iUdln3GEs4+Es4+Es4+Es49bmWg2iUcqfToSWBvz9fP////+/v7+/v5bg14ndDIygj5QjVlkmWxkmWxkmWxkmWxKilMygj4jby1zlHX+/v7+/v7////////l6uUmYCowfDY8gEFJhU5JhU5JhU5JhU05fj4vezUwZTPw8/D////////+/v7+/v7+/v7Q2dAvZTAtdS4udzAudzAudzAudzAscy03aTjd5N3+/v7+/v7+/v7////////////////u8e5+m341azUeXx4eXh46bzqIooj09vT////////////////+/v7+/v7+/v7+/v7+/v7+/v7+/v709vT19/X+/v7+/v7+/v7+/v7+/v7+/v7+/v4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			aqdzs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHklEQVQ4jZWTMWvDMBCF/WMjocWS1nQL5DcYeWgjkzWLdnsMGTx5MiibPSYUAvZgKHkdUrt2LLnp8EBwx+Pdd7qAkBiMKqyYAiHxQzR66Ok96fmpBZJr3O9f/1bTdpBcI+ByalBVnzAm9+p6uQ19XDoMSltDiASERmBU/Y5AIwiRoLT10Os0aJsO1lawtkJpa5S2RpoVIDTCdnOYJH1b7+cGvlkl10P8XpLrvyEak0OIBGlWuCEuGVwvNwiRwNUzGAiReA3SrAAhMU7H86z2EoN+dl+dS40glO/e+IRGMCb3wnWucQyPUYXT8Yy26V7/ib22mwMYVbPVjRlwuQBx95FhCfDA4BmSK+449myEFVOTk5VcO0+5v4XxfYThDt+XkmjSJe+92gAAAABJRU5ErkJggg==',
			shumilou: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABaklEQVQ4jaWTMWtUURBGz32IKCqiRmLem7mIICsIWiwEf4C1WAYCFmkVRFCJzfoQG7EQFJFUQZds3nxbBVIFQuoQCUI6azvtLdciqAT3YcIOnOLCcBjuN0OhPJoECuURQ5tHuXskhjb/V6Dc5ail3B0v+DR96kDj0rmz9MvO4QRR3ka2y/Kly0T1iJXpK6i8k+TbbHEMWY+B3WgXjEjI3hH+mqieIdulqe4l+TZDe0rYF2Tn2wWrpbNiV+lPzdBUtwh7S9jzJN9D/pLwuwzydWqK8YLGHqbwPRpbRNZD1kvyHyn82+834fcRx1s/MSmvE77AMicIe5XCv6fIP5FtIpv9bwpJeR3ZE2RD5FtEuZDkOzQ+l+RfkT1oF7y/eDrJdwh/g2wR2ck/KQB8vFC1p1BTIG+QrxH+mbABUb0g/APyDcLqffwxa1Nnxk8wKK9RU1BT0C87NNXNf+iXnf242zbxsHVAMOkxTcIvIbIMiD2dcqcAAAAASUVORK5CYII=',
			epub2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC+UlEQVQ4jW1TXUhTcRy99ZRvQdBDIRYFZuGQisii0oc+oB5sNKynGgRWFBVYJkZMM+jDqCj7MgkjiyxmbSvn19aoXWvOKcu5O6dt+9/r7rz3f++dsy+FTj1YI2kHfg/nd87vPJ0fw2SCyTT3iCuaV87yu895SGnZ22jhAWdkXkbvLPz6Nef0B2Ks/yRxLSPqzxdhBc/DCl6MqLgfkNWLfeKVktb++RlvC1v4rDOehPkOp+HWkJpx7gQ1XPLLozttw3n/BRzqEZ+Z/Bqq/Bqq/CoaQkm0jibRFNLQSVJ4EJrRzvo1VPoo2dY+sjB9vNsR1R/zqSjzKijzKmiNpvAyMoEjf3jdkAZrNJXWD3tVHGTFpnTAPnfCbWApDCxFPTcBT+Ir9v7hBpbiqFfB1UE1zQ0sxYEeeXogMXmeWWEOLtjpGp8ucoxjl0tCJDmFU16KIsc4ih3jMLyTUOWjuD6o4tqQhrpBFdX9FLU+GY5YsptZYw2v3tAlIt8eR4VPAUe/Y31HHFsdIm74KY5+lLDDKaLEJWJscgoVPgqdPY6C9jiKu/hqRmcNr85vG0OOlcfdYBKdsRSWWnm0Ryew1i4gx8ojx8rjZK+ESPIHCtpmdstsAgrtsWpmsTm4QNdGprMtBA1cEpbPKSyxELiESZzyysi2EGRbCJqHk3gZnUzz5TYeBa9C+xmGYZj19pg710ZQM0DhFr5A94Zg1euZWWfnoX87Bl/iG8q9EnJtBLk2gnV2Mp37lFvEMAzDbLSN6rd3CyhxCnCPfcWFPglbOgh2OQQ0BhRc7pfQl/gGvVPApg6Cok4e2zpjTbOKtMcRe2Z0x1HRm8CTYQ2POQUPAhS1XhG3B2XcDVBUekRUfBRhfCcQnfmfIs1Umc06zvLmxhDFfY7iZkDG47CCe0GK+iEZ94IUDRxFTX9idHOmKv99pnI3MV4ZiHPNIRnNIRkPgxIehWTc8IuqySPUlTgjmZ9pFkymucau8MoT76P6qh5Sauwe2WBoYbMyWX8DBfZZGliSDtYAAAAASUVORK5CYII=',
			epub: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsUlEQVQ4jbWSsRGFIBBEtyRKoARCwwsNCQ0JDQl/aAmUQAmUQCf7gxv/KKI/UG9mkx3uDewCPDH+U7nV6kmslFgoc6ELhS5kukn1DuCfBwAuZLpwB3D3BnbKtGcAiZUyF14CfKL1ae9LLBrWBrB6B8CYaMcWMJff4pUHAEYSjTQArWh/uOcpYKGRpQUcq+nWBcAMC83QAjrVdOs6BTS/zPpM6zUsfbMubfUsoDfdtN+YL3XcG5IL38ngAAAAAElFTkSuQmCC',
			sxcnw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAYElEQVQ4jWNgwAH+MzD8/8/A8B+XPEGAywCCBsMUYMMPFhxA4ROlEV0e2RAMA/A5FZlPVPjgM4AogM1GogzAF4gkByAuG1HkCIU6QQOICYPBZQDRMUJ2XiBZIT4DiFEHABm7t82nFs5YAAAAAElFTkSuQmCC',
			tusuu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB9UlEQVQ4jZ3Tv2sTYRjA8fwN+h846eSgri6Kk1sKKjR0UjKJgg7WoWqHIhoXaxTEhtoUaSQWa+kPQTukg1JsDW1Fq6WNae56ySWXXM/mcrl7vg7R03CkoA880/u8Hx4enieknB1GjSTRoql/SrVnlEJ4iJAaSSIiAIiIn53Cs5s4G2VEBDWSJKRFU60Hy0bvf03h9GOUM8MYgxncyo8AUP+4hX5jBgAtmmoBIsL2+TG+7eslfzJO9ck7jPg8SleCnYnlto7sbIHSlZdBYPPgAPnj9/EaTb9YPKESm8NMZ32k/j5H+fYbRKQd2Dr1iOIv+e8QEfSbMziFKgDm2CLW1CrGg8wfAMB8kSV37B6e4wYQ17QxBjOICKXeSewvWhAQEUrXJileGkdcL9CF+XwJcT30vmmMh/O4ZSsIOIUqas8oSniIxrrePrxlBWv2MzuvVjDT2fYhersO2xfGWN9/nY0D/eSOxMgdjVG8PI419Qm3Vsfbdag9+4CZWvJhH9BvzbJ5aID6Yj64VJ6H12jimnUaX4ttXfmAEk6gXUx33MBO2+kDtZEFcofv4JYtfteJtD7aqyr2mrY3ICLURhbIn4hTujpBJTaH3jdN+e5b7BW1Y2daNEVI7W4/Jue7QWOtiFd39jwqEUHtThJSzj3973NWuhL8BMU1geHNrcKzAAAAAElFTkSuQmCC',
			txt8: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADD0lEQVQ4jVXS2W+UdRTG8ff/INZhOhstRqJBSBA0USqYEKvRCDHimkiCxgvRkmqLC9hQmkozqRKrqCFRCRESFy5ImrgQq9W6AQ4DLUw7bd931pfpzDDz/pbz9WKaJl6c2895Tp7jWAnQorBaobwUxZOHSL+4jV8eXcfUjtv5Z/sm/n1kB9cGD1JO/YkYjcJitAYBxxqDCm6w9NuXZAe2kt0TZe6pTorvPE3xufvx74tQXB+i2Blj+q6NFL87i1IGZS0i4GjlU5s6jndoA/n+KLNvbyP39RCqXkL/cJragxEqm6NU1yXw14T5PRKncOYbxBgEcGqz3zM7fCfu0fVkz+yD8nVsM48OfNJDe3Efu4X5rSHcDW34d4RYjK9iKtpBcDWFiMXJnn6e3LevItXrGFVB1E3++CpJ6vO3mPmsl7lP+kmP7Scz2svMgT6uvfEy2bYIP3fdgwQNHHQO0TcQUQiCiMWKRaSJkgAdqFZcMVgVQLPEwq7tZNauQbJpHDEGsYJAC0AhotCAmIDJ431cOvICFw4+i9u/k/mXuincGye7sZ3sqWM4ViwWVgBEo63FiEGwoGqILiFLC+Ref4hCdxvew3HKm1YzM/AajqBaWzHLQOsMLHhXJrhw7iMunhtj8VQPc3tieLvC5LtX4T/QzsXDPThiDWItIgYRWUZaAM0yUrsK3iS5D57AeyWM+2Qb/jPtlHaupTT+KY5ICzBiMNJExGKMQUudanqc6pWzlP8+QfH9Lsp9IQp7wxR2h5jefRu4szhiFZoGIgpsE2sNRjQ06sz/eoLcxBhucjOVoTjVgTBeT4jcvtVcPvw4opo40pij7o6jyhPQSCO1v6CZAZXB1C5j3Um8Y10sHbmV6mAblTcjZHoT4GfACo4xVaqpk8yM3s3iaMfKeMkExaMR8iMx/OEo9aEI9cEQC+92EGTPY6WJYHGssRhdxL/0BYsfb/k/MJJgIZnAH45SeS/O/IdbCLyfEBugTas1R5ZrE9tAGmkK4/tXgPxIjPxIDDfZSfnHA8jNacSq1n+IRYD/AIaeR0j7JSG9AAAAAElFTkSuQmCC',
			llzy: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACPUlEQVQ4jaXLSUgUABiG4U8vFV06162NNAisrpkVRVkQ1CTZaGobjWkQBpUtopJa7iIq0Zh2cEOoRJNS0lFqkhYsxExSU3BLnVKmGR1H3w6ahxy9dHgv//P9wiL+Jy06NggaBRYvz0//uHgjFmoUfPSFwXzc1jXMNIvZ18u7eCmoE1QLWgNwOvsZsMYzVunN+BMxVevZbfMurghMgrxdzE5P8b08mfZg0WoU3WeEPUpwcbF/CplzESG4ug5G+nC0veJ9oKgJEHWHxNcgYQ9dwgNFR5AQFwQfygD4nBlGS3IoddE7aTws+kOF69wyflqIuI3ADE1NzSSZDDSU5DI96WCoMpFho3Dd2gDMevZwb8RDA2P2KXKiDaT4ibit4u2DWAD6EvyxpR9kbMJJdtTxBW+Z928J+xDlJvp/2CgI8iHeTyRtF1URWwDoLImnI9NIT18/uYbNC1591heny03t/UvInXcC9wxURu0m0Vc83iE6s0JwuKHixilexBzA4Zik1ORPwrx35YTRN/yTtPD9yJm8DYBeaw3FR9fSnnIMxgcpK6sgee8qzMHrmXa56bU+p+ivTwxRWFjM3T2r0e8qL7reZTMw6sQ+YWNoZJR8cymXQ33IMYn088JSncqwbbHnRgq5LOJLyQoeZQRx+2YMRmMwJ49s4p7JmxSTMF8XT1NWYk7z7JppECPPxKsMkR4pYkPEnbC5sqJFfYZoKxL1aSLDgwuLcNaJnvK5sfmayIwSBTGiNlV0l4lfNUv7H+I3q7QtmGtaAAAAAElFTkSuQmCC',
			jjxs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVUlEQVQ4jc2SMQ4AIAgD+yf//zbdkbY0LpKwED1KARtrvySuYo0IUD8NILCPDeQngPJgDOi2wIICFLBRqgGkaw5go1ETu64E7D0wa50BhKpcgb2DMA87/qd1MwiflwAAAABJRU5ErkJggg==',
			dmzj: 'data:image/ico;base64,AAABAAEAEBAAAAAAAABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAQAMAAAAAAAAAAAAAAAAAAAAAAAAAAADzjkH1kEL1kEL1kEL1kEL1kUP1kUP1kUP1kUP1kUP1kUP1kUP1kUP0kEIAAADzj0H1kEL1kEL1kEL1kEL1kUP1kUP1kUP1kUP1kUP1kUP1kUP1kUP1kUP1kUPzj0L1kEL1kEL////1kUP1kUP////////////1kUP1kkP1kkT////////////1kkT1kkT1kEL1kEL////////1kUP1kUP1kkP1kkT////////////2lEb2lEb2lEb2lEb2lEb1kUP1kUP////////1kUP1kkT1k0X////////////////////2lkj2lkj2lkj2lkj1kUP1kUP1kUP////1k0X2lEb////////2lkj2l0n2mEr////////2mkv2mUr2mUr1kUP1kUP1kkT////2lEb////////////////////////////////////2nk/2nU71kUP1kkT2k0X2lEb2lkf////////2m03////2n1D////3olP////////3o1T3olP1kkP1k0X2lEb2lkf2mEn////////2n0/////3pFT////4qFj////////4qVn4qVj1k0T2lEb2lUf////2mkv////////////////////////////////////5sWD5sF/2k0X2lUb////////2nE33n1D////////5q1v5sF/5s2L////////6uWf6uGf5t2b2lEb2lkf2mEn2m0z2nk/3olL////////////////////////////7wG77v277vmv2lEb2lkj2mEr////////3pFT////////5tWT6uWj7vm3////////7xnP7xXP7w3H2lEb2lkj////////3oVH4plb////////////////////////////8ynf8ynf7x3X0kkX2l0j2mUr2nU73olL4plb5rFz5smL6uWf7vm37xHL7yHX8y3j8zHn8zHn6yHUAAAD0lEf2mUr2nU73olL4plb5rFz5smL6uWf7vm37xHL7yHX8y3j8zHn6yncAAACAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAA',
			yidm: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEElEQVQ4jZ2QS0wTURSGz8KliSQuTdTEhUsXrkxcuScxNnGhG+NKMQQUTMEAmbGkGfpIC/RhH0OZaloY0tra0LQVLHQUghasSh+Mta2PhbYNEsHOENMeV5Ba9Zr4L7/8/5d7LsB/ZPbRrHn6vkdBLAkJQe+bmulu5QaKaquUK+WNTHaRKMiL4rAs1VBYWDQ382goelmWZSwVSjWigOf5I1tfNxERMZVcG9vjC48FVpJkzItvt4kCAAC388Gl9Jtc/ftODZcTy9cAAGLh+fD2tx3Mrqef7xeVN/oHmH6t9k8So9F40mV3P8ys53bj8fjxkD/Mlb9UMRaJdO2XWL1HMaHzVMdVdu63U9z80VTypSBJElYrFSmVfPVZzObf8zx/8JeigTK0OUa4FYeGmzOpucMAABRFHRBzYhGb0qg3MLWa8v/1bpuGu2NVs0/d4/w5AIBPHz5uNe3riIjFd8VnxM/zOX3HRmnzhlFlmfc4vZu7ktz8CFx7kdQTBQAAExZX0a5zId3FoJ8LNDKraSxkCxjiA08YhjlEHHdc6bxgGXFgNBhDjymAM5ZIw22Y/nGxXXGeOFTd1pywabilsbu2pYHuIXUkGMGVRBKnrEFktd4ScWxmbGdZvVfWDZnm9tiwkuljTZN1q86BdI/qJlEwStsmDfS9162853rf6cHewTPEMQBAb4eyvfPqrVP/LLbkJ/hnOwbKQP7nAAAAAElFTkSuQmCC',
			sfacg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAa0lEQVQ4jc2RIQ7AIBAE7/8/4E9oJHrVatxWlUCvTclhIJmEjJgjnKVs2sFSNkVPD5RSQhwUqLWGcIHnD694S9kEQAD0tpE/7wIjK34KAJh2vPwCkiLpJknq/r6PuABJN2n0n4HWWoiDAjtcWmhOH2a6TEoAAAAASUVORK5CYII=',
			slieny: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC0klEQVQ4jZWRW0iTYRjH35tVkDdFR4kOQoHdRUkniOhCiCgyowuDiMB1I12IRNRndrKlppVTM3UrZ22mrdJlMUxGzs1N93WwNJbTDqJh3/e9xw0bMp4u5kwNol743fyeh/f9P8+LzH7m2VWtQVrFbPaaMTj6qMnopl933v6zftiCY94Qz0OewXBusYu8N7pp5LaHQ5WHw44qDXSSAofqcazns7hR0kE6zD7KTN1U1Hn5xOJLCugkBU49IQQ1yawly0Zgs1GDFYUK5LVR7XgTieokBfbUYLAE6Fe9ncD66yosuaxAgZNNrryqgk5SQG8ngMLhcFZwNPym9Z2YbP0gooFhcSvnKWY6SYH0OgyMhe8Gv0eGHsg89rhPxFQSsa8til9w8hGJoiZZdGyr0mBNkQqpZSpUd/N+YxftXZCvQIGTjdd66eDGMhVWX1NhnwnHQj94YXazNrGuWAWzj7UhSml66SsWPWojkPWPHGsk0NBD2U9KU1CNlz7USfGl5D/HEassRq2yGM1swNGEP9FEonP9/HwFer/Qs8jQTlyJxpRidfqbll6JO52kQLLht182w7d9YKXoZidzJITJR0loTARDYyKY3UymE5x7QScSXj/DB0JCQqFxcjC7WZs4cp/AvKnC8kIFDtTjWSReTrqgQIYFw4V2OsQ534C6BumZyi7qvOPj/QsL4k1pFRqYuqk8k81GbXqcOj9/X/6KtXQNsxxU283fZdkIZDbgvyZI7CSpQIH99zBkWDCYe5gHeYPsYr2fOWwBIScSbK/SwBrgbluvcNl6hcsa4O6tlfEEqwwqNMpCtgWE0/+Znka5Djq5qVyD1DL1v9hi1OC8Ews08C0itfbxjzUeSnIdFPKeUXAPcbcgZPdMXg6EZb2dgN5O4GYniVhfi5G3IywHXXvJxlcZVFh0KT77nhoMrk9CQnOOf5jl7DfjWPJUb0qJCmYf7/gFsdvTLVYusF4AAAAASUVORK5CYII=',
			lknovel: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACYklEQVQ4jbWQzVLaUBiGzyU47soMOpQuqjIdHYv8JCEhISh1sDqSBgIIUUDAmghqYJACrRprHO3COtPpzy20dyBXoBcg+y6bVbPJTL6udErVRTvTd3nO9zznPR9C/yND+Bj+z7ArTvEeaRE80uLBw6gHDzSXLjElYXorHHjlGEwWop9uQTbPGI5tJ7qBV5mvwfbyT6KRtshmWg3spE1MEYDqiAat5nuYIgBeT/64JfDIi11sKwGBnSWg2iKQzQxgigDB1yuqr8pzCCEU0opdop4CvJb8eGf1MY7CqY5ohY9fGnNf6r2Z43Xp+u7Z+w2VUQsQOiiaDyZGhu8UsFrpilbz1uxpxZg9q+jX54xW5oO7K1booGjSat6iOqLl305864MHRhzDZCsLc59rl9EPm/rsacWInMk8tZfjiUbaIltZwxl2293l5372sNTzyjGYWps3bwSDTpsdUwRgtbLJHpUsZi8PwTc5E68lLaKRMtmjkspqZZnZz8u+Kr8xGiO50QVS6mvh34pLkdONi5BWtGZO1g1PlfdSbVHHFAECO0tAtrJAtrJA1FMwWYj2w78n8k7SWa1sht6u6s6w2x4+LErMYVHCFAGY/cKVfysuDTpt9j7o0bT7BdkWe2Qra9G7OaDVvDV9sv7dQU/cbJyop4DqLJ/f+aqDneR8Vc6k2mKXVgsGoxb0P2eIRhqY3Vx3YMQx7OIZ+d4vkM2MTrYyOkIIYduCjteShn8zDkQ9BZgigFeOwdPVObhX4K3ELn1V/gIhhNxr892p8sL5eDay/yQzI7kERrK5H/uHyHHuXsHf5hdZl/SJ2oF9xQAAAABJRU5ErkJggg==',
			xsbs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADMklEQVQ4jY2Tf0zUdRjHnzsOhxk6ySFjE00PBXOFhoJrpU5qaw7NWmK1dNUfbsxN6w+bDu/zvVPuvB9w3/sqcJceKifQMTdFGWOxAkXAUZvRRvFH2YytVUx3oHx/fH49/dHusl9br7+eZ3vez/N+nu0BAIAfBwZyrIqoi25rjfPV6rC1s+3N+1fHlimKYgcAQES7vq+rxtwcO2huajmYah5aeb/39kIAAJiO38o1dyUCMkuhfI3Wh0CEyPPdM/a2H7Oq4gotazrECgJjek3HYZmlWGKJ7ydjT8dR4+1kHQAAsNLIcVrWNIhAkJdo1yS4JAJBke8ftza2nJdZCkMgyJ3hPu4MX0MbEaIweMfYfcmlv3q+Eqyq1ou0IvrZH0XqDfGUbwqBIAJB+tLZkJznmUEgKMElrarWOpnt1mWOZ8Z88WyLub1VBZHv/4Y9o/UgEBS5Jx9wZziZbiAXeafoc2ei6Vws9Y/TpxsSEgiyNWqvsaezHtjK8G1rc6wrXWS90R5MxwgEza3xkMzxzKVz48CVo6IgMMHWaqPGu8k6YKsj/fr+ZIgXBu8iEKQbmhplzonZzNQ83w98rRbPrFWihlixOiTthKVO36iBR299+p5R3eaTDsWS4JJiqf9bWhpJ/OnCJY2dCY+0KxyBICsIfMeLI/0IBGdP33wNHh3qfpY71QG2omGYLQ9NSpvCjeo2NzrcZroJW9HYywtDwwgE0aZw7gy3SSA4p42sBwAAWhmL6PsvfygdbguBoFxy6uu/HDPbbRrbzrmljQgJBHmx2s7z/aNTXSPzAQDg5+tfPWHuSpwSi73fZ473yoVGsdD7q3S4qcz2mNaWT1ysVBuR4JLmjovBBx9fL4LHebg3sdX44PL7GRcOt66/HP+IrdPGWFFoglbEOtmq8E3xZP1v092TufB3FEWxz6hDFbS8+YxccDLFlocmWXm0x6y9WivyvL+gTWG0Mtpg7O7Y8g9xmomuiXnGgSvb9XeSR9iy4JfW8809It9/hxaHB8Vi73gq8Pmq/xQ/hm02/MULD6Ojr7OSyLDM9qTo+qZzc0e6C/+POIOp9DnNms7YjDZQmX7rf+N3f7n/O6ObEhcAAAAASUVORK5CYII=',
			fresh: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB30lEQVQ4jZVSPWsUURQ9eaxCRESCgoWgQmaUDSmMEEKKMK7oDMl+zbv3bkAXEYt0YoQUq2HJzoDkF1jYKmm0SWEjCFFSi0TZIixBLIJICClksdDstTADq9nNxtO9d985557DA7qAmWdFZJSISkRU6vauG3mFmV8SUVlEjjLz6wMJIrINwACA53kpa+1Y+9xaO1ssFk+2XRkuF56ISD0RyAzNH98SkQEAIKLKPwaL7Wf/h/mefza83u5wNrgz8XWoemwncRCRmyLylIgmAZjci/RG+PDqSm7ZqYf3b3z4K0LuVvD+0sKRn05k1JbCd3s9rObz+UERyQCAr1BfoXYmu7qvg3S1f8eNjTo103Rqfbue56WY2SZzz/NSfgtKd3NrHUsMObztxkYzM1fqTmTUqfU1iWiysDjemPp4ajNQaFi5tt6RnGCqfP1Tutq/7UZGs68GN4K9lX2FZt+c/3IgGQDG71387ERGxx5caPgKTQSCFnZ7kkVkwI2NOpHR3LK76bf+CAQKZebnPQXsdGHJjY26kdHs23Pqt6B+Cxr8QrMnGQCY7SM3NurGRrOPR9cSd5q2S4cSAGBG5s5sObHRy5XTjUNn3xfF2pHh+RPfAoVyKZz7b4Fkm3BhovOH6YDfHmW66afqXSMAAAAASUVORK5CYII=',
			caihong: 'data:image/ico;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAQAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ALT/nAAA3U4A//YAlv9gAP9gAP9gAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ALT/nAAA3U4A//YAlv9gAP9gAP9gAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ALT/nAAA3U4A//YAlv9gAP9gAP9gAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ALT/nAAA3U4A//YAlv8Alv9gAP9gAP9cAv8AAAAAAAAAAAAAAAAAAAAAAAAAAAD/ALT/nAAA3U4A//YA//YAlv9gAP9gAP9cAv9cAv8AAAAAAAAAAAAAAAAAAAAAAAD/ALT/nAAA3U4A3U4A//YAlv8Alv9gAP9gAP9cAv9cAv9cAv9cAv9gAP8AAAAAAAD/ALT/nAD/nAAA3U4A//YA//YAlv8Alv9gAP9eAf9dAf9cAf9cAv9gAP8AAAAAAAAAAAD/ALT/nAAA3U4A3U4A//YA//YAlv8Alv8Alv9gAP9gAP9gAP8Alv8AAAAAAAAAAAD/ALT/nAD/nAAA3U4A3U4A//YA//YA//YAlv8Alv8Alv8Alv8A//YAAAAAAAAAAAAAAAD/ALT/nAD/nAAA3U4A3U4A3U4A//YA//YA//YA//YA//YA3U4AAAAAAAAAAAAAAAAAAAD/ALT/nAD/nAD/nAAA3U4A3U4A3U4A3U4A3U4A3U7/nAAAAAAAAAAAAAAAAAAAAAAAAAD/ALT/ALT/nAD/nAD/nAD/nAD/nAD/nAD/nAD/ALQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ALT/ALT/ALT/ALT/ALT/ALT/ALQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAIB/AACAfwAAgH8AAIA/AACAHwAAgAEAAIABAADAAQAAwAEAAOABAADwAQAA+AEAAP4DAAD//wAA',
			d8qu: 'data:image/ico;base64,AAABAAEAEBAAAAAAAABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAQAMAAAAAAAAAAAAAAAAAAAAAAACnd9ilhtqYe+6KZvCefe2TcdaWeuORf9uPeuyMb/ePfOKNcOOeeu6gg9CjgdaihMyth/CyofDBxPibletWNclpRNhiR85eQeJjTdJcOd9iPtxrT8q/qf/79//17v+hd/GQdeBXOc94dt3P5f+Xle9ZOOZOMeRTSdlTOdpeRdtRJt2Sfe/y9v/n6/+yqt6Wa/OVf99cNuk5G9uAjNbd9f+Ie/RBJNxXVM9ZSOdaR9VxXdXj6P/P2f9wX9xQM7ySdOmUdt5qUc5XOedBK8m4tv/e4/91adhJMdpVTN9EJ9K4vuTd8vFlWNs4GtVeQtmTduuic/9fQcBiTNpTMOlfQtXm7P/M1vxbQuE7Mc9xX+nq7P+Ef8s/KtBLPNtoVOKPdeKNZPVrSuRWQdtWQORUO9Gqpfi0uf1WTs49N8q7v/+/qf9UK9daTN1VUt1UO9qWf9+Yge1YS71WSeNQP+RYTs5bTM1XQ+Y8MNRteNnZ4/9tSNJlNfBVSNdCNN9bQeKWfOWVb+hcStROSN5WSd1WQdxQPOVIN9xaR9zQ3f9+gdtRQcxkRuJbSN1LQtBeSsigduKmfe5cR9FMQdtdSOJYP9RXS9GBgerLzf+jqfpkY+BGNtlXPedTQudMReNaSteYce6jdutcQ9BLO91aQuVaOtxdSONzaemZkfVbUMxGOdNMNedaPu1WQ+hOROVaRNmbb/GbbPddR91KQ9xSRdlVPdhWQupNO+NCLchZPtFSOd9eQvFgQOJWP9hKP9NaQ8ugcuqTa/hYSd5HSdtWVNtWS9RMRtlPStxYUNRcRuRPPeZWQupXQNlVSdlNSNpfTtSed+uYduJfUtVFQddRRN5VPeBKOOFOQt9bT9VQQeBFO+JKQOFMQdRNSNpAQtlYUNqMcOOsgOKAZuFdTNteQtlmP+VjPu9fP+lfPdRjTNRdTdpgTdliTNFhT9lVSt19Z+yofuqzbuyecvaOdvGZfeaffeORdOeSdeqffemfdeGbd+qYdOeec+Occ+2Lae2oe/G6etUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			qqxs2: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACpElEQVQ4jXWS60vWZxzGr6LVFgwGk22sMSKoN4OgGDZi0uPa5iroTxh73zqYRIjQz5wv1E6aZs1Nbctlmfp4yjKPz6mIQvH0OMl6fs/x93OtPZMoQRqfvbgL56obrlf3fX2+fK/r1jafw1cBl6+DRl8GXLYHHL7wL1W23+HzIYfN/UnW9yR4ryvGG14bZfkcPH6jLJ/D1qEUnw2m2PI/ZQ6k2Bl0l5ovTqLMAXP56UCKHUGX7+4+5Ns7i6qcmaM1+YTE02fMLfzDNp/DilYbNUygmltoY1+ST3oTbOhJsCvk8rozPrdA4M95yu/NGfOPIVTegzb0JFh3Pc6a7hgZnTF2hWb5JuSSE3S5EH0MQE7Q5a02m2UtEfTbJPrpFqq4gUq8aN31OB91x8nojPF2e5RVXpsVrTbLWyMUhtMAZPsdY740jc4Po2ofOt6FipvQ2mtxPrwaY/fNWYqn0hwNpykMp7HCaQb/mAeg3n6MNfkX1vhDrOEk1u0IKutAP1xeBJRO//3a/V91XgJs6k+SE3TZ7nfJfl5rvW0yODD6CI8vhac/iqd7Go935GXAu51RVreZ/Ze1RFBLBOt5Bh6/g5ofoMYpVHcXVQ0uAj6+FueDqzHe6Yjy5oukmx+gKzNYk48MYCiJmmZMAz/fRpX9qLQdFTWi97uMeaXXRs33zZSGCdQwgTU6awC9EXRhzEyv9qET3aj4CrIa0Oo2G7VE0MUwqh82HZ8LorMBrDtRA2gfM8bTfehYp6nvyK8ovxap6R76ZcSYKnpNv2UdqLQdT2MIK/g7a8/1mk/zYmp+LTp0Fh2qRktCKbpkyAX1qKBuqfJr0eEalHcGHShH+0+h3NNIVYOopM2QD9egvCqUW2Ee/Vf7T6F9J9H3x9CeMrT3BDpYyb9/A7/EBfygdgAAAABJRU5ErkJggg==',
			bihaige: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABI0lEQVQ4jZXTuyvFYRzH8VdukRApt5QkWRgsLqUsNjJQLBQlm8Xkn5CTS4kySJkII5uS8Si3UJSkECmsDM/vSHJyzmd5+j7P8333vRKUhVyUoB61aJKGhhHHHE6xgIl0AAOYwRL2MY3edADFqMIRPvCAXbSm4tyFA5zhLgJcoQ0FqQCK0Ik6XOMdG8hIPYGgmiiSV5xg5Nd7XvSnEOV/AbpxiGO0oxTZ6BdaPC6kd4GtZFF0YO+HXYY1NAh12caoUPQ/1YjYDzs7OvMxKczLKuaTATKFqUxoDFPR3TqeoxRvMIjqZKCEKrCIFaG4T3iJAMto+Q+Qix1cCtMZxzk2kfOfMwxFEVziDY/4xC36UgE0oweVQodiuBe2NW1VYlZY9299Af+mOqpaL5w9AAAAAElFTkSuQmCC',
			rrxs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA/ElEQVQ4jZ2RsU7DMBCGbbW8CW/QuXsvL4FYmfoc7CVxFyYkXuA8s5AhG0NWJNZsHQrFqe9nCEmckjQlv/TLZ+vu091ZMTNEZJKzLINyzkFRAk0m8PbkXr9tgzhBmqYVQEcxdGQ6vqJNlRwN+BxAxKPWJAAgLWCoi3OAxd0TAOA1/5jQARmICLz4nsJkHLDbfwFAB7BcP6M8lvguXTvSEEB+528AFCOUpuRygCKDU/0LoCOD23tuiq9vHsd3UANEBPuDw+fBwfvj36WOAUKJCF7e3i8DzOgB8443UOH39QKoJ2HEs1VcAfI8BzNXtvVp25gZ1togxzZvRVHgB6+hqqjXZhyzAAAAAElFTkSuQmCC',
			feisuzw: 'data:image/ico;base64,AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA7cqnAOrBmQDclVAA5bB8AN+eXwDWhDMA0HIWAOi5iwDip24A2Y1CANN7JQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALoAA3AAt3kAp1ADcAt0pwALcANwR4CgAAh4A3Cnp7AAAHMDcHdzAAAAugNwdreAAIhnhnhziyAAd3d3d3d3cwAANwNwB7BmADhnA3Ang7AAd3e7cJd3kAAABJOgN3oAABiIiIhnh6AAN3d3d3cIAAAAAAAAAAAAD//wAAnOEAAIzBAADMiwAAxIMAAOSHAADkgwAAgAMAAIABAADkyQAAhIMAAICDAADwhwAAgAMAAIAXAAD//wAA',
			tofu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACSElEQVQ4jY3SPUvrYBjG8T7P0yalSRRrQQvdpIKC4Oji6CwKbi4ufgFx95s4CxUcquDk0PpSBd+CNBhbjYlIA/UNXazm72Q5PVbOGe7hvocfF9xXTAiBEAKlFJqmYVkWPT097enr6yOdTmOaJgMDAwwNDZFMJhFCsLW1RewbEEIgpcQwDCzLwjAMTNPENM32zbIsxsbGGBwcRAhBFEU/AV3XSSaTaJqGruvouk4mkyGbzZLP55mZmWF+fp5EIvETiMViSCnRNA2lFEop4vE46XSa2dlZisUim5ubLC0tMTo6+hP4TiGlbO+JRIJcLsf29jYbGxsUCgXW1tb4/Pz8Hfhz7+/vp1QqcXl5SaVSoVKp8PHxQRRF3YG/sfHxcarVKvf395TLZVzX5e3t7f8AwzDI5/O4rkuj0eDp6Qnf93l8fPw3kMvlUEoxNTXVATSbTZrNJq1W63dASsnk5CSpVIqFhQVc18X3fcIwxHEcbm9vCcOwew+UUgwPDzM3N8fIyAjr6+vUajWCIKDRaPDw8NCO3wHE43Gy2SyZTIZisYht26yurlKv17m5uSEIAsIw5OXlpfsXUqkUvb29rKyscHR0xOnpKdVqlevrazzP4+7uDs/zeH5+7p5geXmZxcVFCoUCpVKJ4+NjHMehVqvh+z5BEFCv19sFagNSSqanp9nZ2aFcLrO/v8/e3h67u7vYtt0GPM/D87yODkRRRGxiYoKDgwPOzs44OTnh8PCQ8/NzWq0W7+/vXF1d4TgOtm1zcXHB6+trB/AFqe1Q2IH+mTgAAAAASUVORK5CYII=',
			banfusheng: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACgklEQVQ4jYWTT4jVdRTF70hqZKEmEhFBC8HFqI28+Z1LtGnRRqyF0ET4D7EYqBh873vuQpKYBwkJg6PU2PSc9ztXghJyMEQGInBhlNgitAINUaxQdBYtggizSBfDhA5pZ38+957DvWZ3aFv7qQcHO43FRdgV8qtM/BOJP5l+nvJOs8Yzdi819/UtCVUjlL9E4fOQf1vq6m3W1U7WfiDk55j+bkkMDGnt8rvMr3+wemlJdCncZNe3UP5F1Nh714BO4/Hmwaov0r+K9Mk3x7DMzMwG2r0LKIwy8RvT/7gXwMzsjQO9D4dwKtJvlcSwmfVYEV6g/HoR9kTiYqmx9f8ATJ+mcCnUcIv0yUic4YQ3Qn4harx6PwDlp0P4MBJnIv2gReIahdHW+NNPROIihdfmAHqsbfPMrGd7vfIRpn9TEsPRxfpSV9uMwk3KT1M4EomfWfevC/lUyC9Q+ITphyN9MoSjJX07ha8j/TsKE0yMG9P/pnCWic8o/6ml6nkKx5l+OYSjMxF9ksKR6Pa/wsRbIXxM4QcKN4zp01Fjb1H1JIVL7PqWkE9Rvt/MzNo2bzaCmdlgpzE/RtYsYmKc6VeM8mMhnOKEN5h+uajaHPKpIrw/t8Tn2vZASQwXYQ+Fs5H41Fo1NkTi2swV4pf7AQY7jYeYOEn5r5Rfjy7W29B7KxYyqzEmfqdwg3W1aaaDauy/ACF8Gem3KIwOtHsXmJnZkNYuZ/rhkP8VdfVyq8aGVmLjneYdE6sea2VjNYUTTHz07ynPqtXtfZTydyKrF0PYTfl+ZrWjyINZjVH+fQi7Wfeva+7rWzJ3u9kV58fImkVF2MX06dl3DuFHCoea3f5n53puA9PiWosPHN5VAAAAAElFTkSuQmCC',
			akxs6: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC6ElEQVQ4jZWTbUhTcRTGz/7X1ZzbTDEFS/fSyMqKLGs2Z41cd72pDV2SFYiGoQWpmVhNuQ3SoqJmL6wZipYv939N08JSwRlW2HbvDHO5qZVZl8gvQQh9rC8FNYjs+Xx+zzk85xyA+UvQ6oJUmkXVDU4Q/QcHUNsDC7GbyMcc4mkWNVIUIKeTCpoX3NQLIZhFNZhDcwxHfO/whFz2f7AeHv9A6f8J4+cQzLDoIsMRboZFNpqDuX5vQpvvo5V/zVOGuPJ0KQAF6K8GLCpkWNSCX4CS5oh9NAdzQxNGPMFbeWv3kaLVlcZOkDvMJvXdA7JAuIWFFQyLrC0sRAAA0G5Ugjn44nqzv93HW9+Rtoxn8nLtO5BeJqsljt0d0vo91YubMnctxeZgAADshvRmN6h+GdIsukRzAn5kuvDh6PRZ38Ya45jiRPIwSPXLI8RVKbslV0lHmD3tkaIuO8PpBQkehlW/DSSgOdTKcEKfd6bsiWuy0rOSSn2rKNbeBwBAoqtkPnFr+/RC+46p6FrTyQtdcVKMYcEvusEJIoYlnPc8Ypf/o8XTP1YxpLZs4ZXHk2wQVrJ5DbpumBQ4DN/E18h8ySFtZGCwrS6IoVmBv2skvG+Sp/ytw6W9ilO6WdXRpFJYVKbTC24aPgsdxvfK5hx5YJjNz0COOWhr54RTg+O6xrefrPyVvqJueYVuVlm42QyLchLkRO22AaLO+DWqKVMT2JlhCdw7tvzpq5mjj0ffU88HvKefZt0y98aWa3lVnkYHACAMrtpqQjcNvLQ+zR6PqQUAAHeHQdY1EnLhiZ/se+Ap6z+J8wb1F/c44y3bBlXluiFVifZObM6an1uKjhaLLSl7RTfInqjbmXl6Sh/U8zIq+x5r6ihuzutMtJB2xbHkkpgCDak8mBi3zLQ2MnynWgZ6+OMfCFHuOkVEReqBnEbjJltPxpm957Iql+RqksI1ahkACP52sYEKKjhvDk0qNq6HDWGh/yr+Aa0+HQoS3wFCAAAAAElFTkSuQmCC',
			nsxs: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACy0lEQVQ4jW1TX0hTURz+kDnGGLNEVGTKcGNuJlMknMhFp7vqHF537+49B4SCoB5CRCjEBkn44oNIiYT0KBFGBeFD9GQkSSBiGiKCPgySsAXhH7Jc+We/Hu69KtKBD35wzvnO932/3wH0ZQFgPQeLjhK709meX1R0vfDKlUfeWGyzT5LSD7zeAZdxDgBg5ZwoGk31MEYniURmweHwFCYSeyOcE3GeJcaypNc6GDvZB+AEkAOX62Y+Y0SqmtlUlJ8rOtn6IACXLO+8keW9hXh8e76r6/uMKC6Nud03wgDcAC4ByEFpaW8J50SxWGoKQJBzonh854MoLidVNZMC4FeU/SVNyx4BqFSUX2ua9verQWBBefm9MpPAar0c5JwokfidikZXRzknammZ6/X57guqmklVVz/sZIwoEpm/C6AAgAU+31C5YSGtKHsrnBPJ8u5nr/dOW0vLx6QofhqMxVIT8fiPt5p2uM05kaoebHo8/VUAbKivf1FrhsRY9oRzIklKz2pa9kgPUA/yfIicE7W2Lt8GYIcgzIY5J+roWJ9yubqjup0v0wCqAGuwuXlumHMiAA0ArgKo1fdQBsABQZgJc56l9va1J4HAYEzvwsak/jIRY2dtvFgDcEIQZsKMZUkUl0ZrasZkQ9643z/UGYksjjBG1NT0fjwUepVsaJgeCIWe91RUJKOGAqehgEgUVyYaG2f6GctSJLI4AsCv52AqOYMkbb0EUAzAdpqBGRRjRJp2uN3RsfFYt7P2zOEINObmFteZecjy3sJpG805aGtbGff7hzrz8uprAfhNQlU93DVbp8/IwRaAylMCAPZgcLgKQAmAQgAFqvpnlXOiQGBQrqt7euuiBUXZXxOEd1EANgDIMX6WzWC0qWpmVpLSkx5PX4N++Xjf7b4WLivrFiTp22vd5vEuAAf+sywA7Mas57tczHtOXb4h3azt/wDCiIeg5C91xwAAAABJRU5ErkJggg==',
			amxs520: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABfklEQVQ4jbWSsWrCUBiFzxuYNzC+gM3uoI+QsZuBvoCrk/cNqrtQ9w7N5mgWkZoLEVssgpDYQqilkKtDQUg5XXrTJK2UDr3wD5dzv8N///MD/3X24/H582AQPjQa/gQw/gT7QOeuVtuT5OtoRAmEc8D6FZwBpg9MJEAJkCRjIfh5T+aAcxKWgC2BRMMSYKoUYyG4siyGjsNYCN7X69cFcAIYErjR0NI0ubFt7vp9pkpRn2MUMXFdrlst+kCQzUUCVxpOXJcHz+PB8zIwcV3mu8pVMgNMSKBdFtetVmaQKsWVZf1oMgWqkEClLBw8j8coyipVikvTLLzxgUk+tkALsRAkmXURC8GD5/FtsSibtPMGPQkwdBySZOg4hRgDw2CqVPk7lczgFjjb2HYBLu+B1knyZTgMSH5tJ0nnuN2+b2w7g1eWVV4k7vp9HqNI+yxImtrAyseZT+Kx0/kW36lNLMQZGEY2zNL0L08ZVOZAM19P3e7FHGj6QE/XFKjmuQ8tf6Z13FT+QgAAAABJRU5ErkJggg==',
			zhuaji: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACf0lEQVQ4jZXQXUhTYRgH8EfUIAVvEkYqRDYNOTuf73nPl9vZccdtls1Sm9RVRh8XdVU3QjeNVVcDA0toqRuubc5vRStQ57SCVmqBWpoZCBVIQlF4lcS6LWiy/tfP83se/gAZ5CJArhsgO5NZ8ADkdHFkczdPXfOjojw/Ki8MIup+kCWvZoQ8QBX7oyLzLiaxmxFMlvZLjBaTuJ9RgX3io6h8N0C2ByAnLdAnl+wdNuOpMU3YfKiwB8ZV3DCuCalhC/aGRWNBN6La/Qx521NUlJcWmdBlb8KhfInblEMzTuVswqF8ndIxHlS45pjM7QQQOeSjDPlpgVmHoiaPqovJY2rZnMt65eUxy8yULpQ/0oRXQ2b+cTdNF+/aQ/KIWLB4XGt536RfXm2s7l2ur2qddogobpf7RjXOGMJ0QydL3mijjCX/BBbqtJqVRv37xmlnauOUM/W2QV+bd2nnExoqHLVwF2Iy96OLIz+104QZ2gnC2MmZfCGBdgJAFgDA6zqr/U29beFDk31pvcnxcelE1c6LWnV72i57Ry38SK/EtAYQxXkAcuAOcbiugzFtRwRma0BCZ/wI5cZtcvFcrbl0pV7ft+pWD867rJee1pi3JnT584iKlb/e9RkM+fcowhXi6bZehbs1rgotk9XS2qxTWZh1mm/GbXIxAMCkTbo+puJfgwp/Ml13WW6A7CEzf3fMKqQmdPH5tL3SG7eLDgCAERUrA5Xctx6RTQsAAECPwPJ9Clrvr0TJqMxao6i8MCwaCyICdS6M6eUgU1G2KwAAEMYEDotsLCLQy2FMPwthKh5EZCLAUrtf/zMegtgTIMnSAGNSOjhK6jCZDBkv/09+AyK52QT84mTdAAAAAElFTkSuQmCC',
			quanben_xiaoshuo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACuUlEQVQ4jWWTTUjUCRiHn2YqaCr7sC8YyEN1CG/lNaFbl4joEHSMLh06RDXWISgTqTAjx5IgnJHYOgwEi1ixjGtou+qCsltiM66tp3LDVNaP3Jlx/s8enKTcH/wuL7/34YX3fWGFLsORG9BxE+bvbdjgvUjEmzB/Azouw5GV+WVdgG3X4Xnz2rX+dPSo75NJP3V1+Xc6bfb+fTuqq42HQl6H5xdg23fN52FrPQwlIxEHz51z9M4d38ViZq9e9c3p0767dMn3d+/ae+qUreGw9TB0HrYuA2rhWSvYc/iwg8eP++vevY4nEqp+GR31l7Iy+yor/f3kSX8+cMBWsBaeAXAFDjWD7ZGI/VVV9peXO7hxo4szM6oWJib8s7ragXDY33btsr+qyh/DYZvBK3CIOkg+AbvWr3egvNyhUMjpeFzVuVu3nKurU3WqsdGRykoHdu60c80an4B1kKQRxtrB3lDI4dWrnbx4UdVcfb2z4JcTJwwKBb8qPz5u/7p1toONMEYcCmnwTSjkbCrlYl+fi69eGWSzqgYLCwaZjMXOToNczqlYzD/ANBiHPC2w0A2OrFrl1MGDzoEFsFhWtgTIZi1GIi6ePev89u1+ArNgN9gCCzyAtz3gX+AkWIjHLT56ZFDagp8/6+vXS+M3NDhZyvaAD+AtTdCQBsfAaTC3ZYvF3bt1//4lwMiIVlRYrKgwt2mT06VsGmyCBm7DnhTkM+DU5s3+G41ajEZ1374lQDar0ajFY8cMJiedPXPGDJiC/G3YA8BDqO0Gp2Ix84mExUTCIJEwaGszSCYNEgmLyaT5tjb/aWqyG3wItcuXeA1Cj+FpL/gRnAPz4GLJ+VLtI9gLPoan1yD03T+UIDWdMDMMfgAnSv4ADoOdMPMD1Pyv+Vu1wI4U1LyAl2nIpCHzAl6moKYFdqzM/weh8OlI5ui8cAAAAABJRU5ErkJggg==',
			qdmm: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC1UlEQVQ4jTXSS4iVBQDF8W+ViyjoQbsyCAZaBG1qGUWrHthLxRSjSCsQcZNZmIFJUtYQ4qKHYoxpSFlWzgxSYyWRjSOEmqOjMU4z4zy8zr137r3f/e73/rUYW5/D4cD/H1AnS6k3ZTIVhQ505uVfbTKyrotOVZogTnVyEiHJpDInKMIOGTpEeSyDTsJQv79X3SVaGZifmVBEV4SfrzKxeaWrax9SbLhH9dAbghbyhCInlesoiCrmtj5nfuki47u38sdh4+8vUdv9hPDoduXBbpV3VogObhVMQ06OUmhak3TUmaW3yl64ib5vTe/ayOwpNbRKJEhjbXWBdI7mhMnqWdLzCLXPHXf1+dtkOx+V9H7I2CB//az8/ktG/5VHkVCooSoIz+83se4xw5tWae1aTzHn0thxc0tvYedrGhd6Xfl4idlX7zP9TJfxF+9VDu2TdGJaBM0dyzRWLKb3dT5ZyW99nB/UfOpmrcG97H1LsaWLyQHNsCHZ8oDKs4uot8URwdTupzUev8HIS3ey8X4XD3RTjquuvl3l9/0me3ZKju6jJFEztf1BoytuZKhXLhOk1VHnutcbe3utZPJHE9s3kFfY8YipPZvVv3uTiz9x4oCZNXebfTJwek0XjcvCMBIoxylbmKM2Sd8ehnrUTw8IX3lY65e9ZgaPSPu/cHL1YuMv38HhbYqopopAOUtCLV/AMzc1bOaD5UhNvbdM1v+Rf3p2Ec8xfJzRX0nGyagh6EB7wYUsL11D5dgejb5tXP3TlW3LuTSgNXxBfL0qKzWRxplgCqF0IWjniiwXKV37bDXHDnLqkNmebtHMabImMg2ZIio0/n+Q56k4rhGRF5cXxsJJza/fXSAw0ic58YMwrKgryTPtoklOIEuJECKlKZSjUyAfUz15RKP/U52RAWUc6yBMY+IWeSSQxaZd9xvtktA1QuaRlpg+w6lvtEdO0KyTRhSFds5/1Jl9ePU4SooAAAAASUVORK5CYII=',
			chuangbie: 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAQABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9SPjP+0HdN4juvCvh+G4M0LeVdXtu580MOWWIocoF53Oc4w3ycc6nwk8d2Gv3reHl8beHtQvLVUkf+zr1biSUngIJ/Nyz8HK+UOhPtXhrfAeb4rNqeh32u6XoIsb921CK+1A2U1+/IjVQ0b74wQ7EMOWZCMbTu5vVv2cdU/Z68e+Cdej0PWbixbxHptxJcW1w99b2kUd0oaSc/ZoRbgqWAyzghhyASD+G+GGXcScUZ1DM8bKMoVnL3PaxjKjTTklH2acXJqVlLmfM9fddrv8AQONsy4fyHJqtGDn7amo2/dScZyfLq6lmleN2rLlWicui/9k=',
			yanqing: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACDUlEQVQ4jXWSMWtUURCFz50JIpLCUkTyG0SCBAlhC6tUIkTEapHdO1NaWEkKJYU/w8rGTlJYiDxw75upJKSwCFtIEAkhhCCLhEWWsXhvsxvMXrjc5sy5Z74Z4IojNbbVaKhGI6npXI2O1fljp8LSVfpZoXEWoxCnEOf/XnWObPRiQTHtqVOoUYils35NO1JjIxesi9FLrdMvcYpGw7uXirPTK3WK5nceLExY8FitMZGCVQBAp8KSOoc08d7PEiGL009x+qNO+/0BHrZ8NsQ41NKoETq9U+dQp5glSgfSmk6vOkffaacxoW01jl7BGsToSJ1DjD8BQL/wEzEKqdOoN0CnW+GWGL0Ro4kYRS5YwWtQAzR9gxidq1Pkr7gHAOo0EefoVrg+33/f8ECMQmt2AFCjoTidIFsaq3P0KtxpWuIQp/EcuNWtD7jWTirUOFpdlS2dQo1G6hT9mp82zmmiliZz4w21NGx5TcQaVmr8RY2OIUY/Woi/Z5QpcsH6NFFu+ahzaGsgTgfi9B1SsKnWjrFgpe3vrV5sIB11KixtVVgWo8hGp1OIariPC+dmkc4WLpHzQJ1Da+7mgvVs6YITegVrMjVxGmfDo26Fm1sVlqVgVY2GzajTYZvwb7/G3Us/9Ao2xdp1NgqdWyBxilynvan2ecHtK2PmXdxQ48/Z04k4jbWmkRgd5sLPFrX2D2ONTHuBmEHdAAAAAElFTkSuQmCC',
			yq123: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACm0lEQVQ4jS3TS29UZRwG8D+000oNC9aaMvfWIjFx50ZTQQhoonGHUqwLP4PGSIwRE40YNwoE1O8ghRgI92lLNVFj3OrCGBa6IZZpZ+ac874/F9PlkzyL5xpaQWuG2V2quVB0grmgvUtqTtluTzAftGv6C0F7ksYuVXeSRk08mg/yIxmFioqkMIRcUpGVDFFSIqPUl1vTQmeCUWn7wZ/cvc29+3LvNqur8vFneHaffOEsG3dZ60l3bnL/pmLzAd0QxVyQKc+9x1yo6lNjqd0pumG7G3SDRtCeUjWDQwdJw7EFrWn6yRZGuSDBf5QV5VjuECntgJQN7PDqu4VWGCGtrsgLIc8G9T20d6vmQ1kP9gdzNbkddEI+fYo8VNRrQnOPLYWyX7J6m7UbNn+5YrTxA2vXVfevSj+tG633PPzxBmt39P/+QwmtGZGaYWQo3bssN6ZphDQX1Gtyq0ZrgnrQDGkheGKSpZfxUGqE0NyrKIZsPmT1mrx6TfXzCr3r9O7Su8rqFdZW5LVbrN8xfPAXA7RDbLVCZZvff+PEEfnUYU4eZfmo4dIxll41WF5keVFefkl64zk+P62SDNshdEKpb3BrRfVUcKShuvihfOEjzn2mvPQlX31i9N1Z3n2H7m5bb76gyiNaU0IzKAo21ujMcOI1Q8U4JIWsQOERcu97uiEtHSKRGtMiz82Mi16/Jc2G4lBL+vYMF7/m/MdcOssXZ7h4XvnBSYODNT59X66oDoTI9VAq+XWD5WO8tcjSIide5+Rxll5k+XmjpcO8/Yri8jdUxkNqhRg9vY/Bv5RUuTRQGhhKCmXaVFaZVMoG5L6cgOQfZTeE2VAceFyqT4xv3NnpvBXy/JTRQtCYllqP8eSkqr13fPnODPtr/geQA/wUmKmlAgAAAABJRU5ErkJggg==',
			jjwxc: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACY0lEQVQ4jY2TTUhUURTHf0FRUNF83GcwaIXz5r4SKtAsIg0p0BCxj7Ei9d3n2Djv3jtvfFSbXBYSEkUtWkSrWrTsg2hRi1pFm6BV0SbIRURESBK0yGLaiDqm0R/O7pzf/5w/HFhGOSV6pBLPZOB8kcq5t+VIIrFc719y/VSXFzjVhSUHnfa5hg5W1k60sEqq9G7pi5GccuKcL7SnxOQcQImpjT5rAdwg1SlV2s7NOsdZJ5V4WOOoxIwMnM9z7oF4J/102VPOE6nErxoAgDsommscF68fiN/zcOe7Oyg6RK9YD4AMxBWpnPv/AtSW+CmVmPaUmJSBc4NcIE5J5byXgfj2f4CaU+8ilSh6SkxtLTjVrcN1VTk0v24uSFezKlnNqmS10U/+yKrkx6yf+Jr1EzNukKpmVfIN3rAz0XS67mpjX7Knvje5wx1INclhpy2rEsH2ofqJjtO7xvcWdnYdVG3y6Ei37Czsb2hXzTv2FLzDuwvbxueTXMMW4MDCcH3t10U2tpGO8tZW+ip29Glk4zORjrqstcestkMA64DrwAvgEtAKrAYolUobjDFj1tqT1tpOY8wdY8y1MAy7jSlfMMZcBkgBLcB54DnwAzgMUC6XpdY6r7XuKRaL9caYwFrbEIbhoTAM+7TWowBdwFngIvAWqAIvgbqBgYHWOI77K5XKqSiK+rXW57TWI1rrE1rrvDGmBLAZGANeAb+Ax8A+4GYmk/Fc1y1mMpnhfD7fGMexp5RKl0olMXteEiAEbgOXgU/ALaAHWAFsAh4Ar5f8ukWKgA+zkGngDHB0NuBHwIalhv4AZonz4biR6zcAAAAASUVORK5CYII=',
			xxsy: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC+UlEQVQ4jWWS21MbZRjG94+0FhIjSJ1pdaZe1Iu2ox2nM870onZGx2aXiFgdlApLm2xOMhRailQSyNgQmxZigYZIJ4c9AEkk++23+/MioV704r17n997eB7F8gIsz8fyJJYIsE9cjoWkLnxMz6clfGzp0+97uxTLCzAHZXmS3J7JV0sbnBuPc3Fqgdx+HdOTfYF4G6RYwscWAS3hYsuAsGYQ0gzCWpyQZvDhRJZfChWqThdbSBx/IBb9oQOAT9npUG4eEVZPAQahWJKxiXluLZco1kzqruAwCDAH5/UBMiBR3GMkqrNY2Sd8KtYMzmgJogs5bD/AdCVVu0ts+SmJzR2KB0c0ej7KkR9wJ19hWEvzyZ3MQJzoA6I6ux0X2/fZNU+4MDXfP03N8K42x+pBHcXxfFb3XnNNf8xns8uE1eSbLSLqr9gi4KXT4fJ0llHtPiE1QUQzuLf+N+2eQLF9mCtscemnDF8//JOQZpCvNflmscQ/rs/rriD97BWWDPgykyOkJrkeX8V2Jabno7R6ksq/kivTC3zwXZLp/HNeHnexeoKWkOjrZUrNDjeM3zmrzvHRhEFT+tiu17exLQOmC9uci6UYvh3ni8QKV2aXaAnJjtPm7tpTJldKjEykuKovUTaPcEQ/YJYXoDQ8yeczi1yaechQNM715B8MxwwK1SaHQuJ4HkvbNS7PPGDnuIvl9W08TbCycWASid7jPS1FJJZmJJbi/I/zXNUfUTnqsVZt8OlUlgdbVWzhvkngKUSZ3ShzLbHCqBonrM4xqt7nwmSSM7dTDI/HGZuc59snL2jIgOdmF9vzafXc/wF3N7Z5RzMY0rJ8/MNv3FpYxzrxeWF3OP99motTWTJ/VRmLJTg7nuRm+gmHnoclBk/U81sMaynC4ymG1DTFukXD7dF0BYeeZH67Rjiq874aJxLLEoomKNQdrJN+nJVH5Rrx9RKPt6vouSL7TpuK2eaVc8xuwyKe30TPP0PPl/h5bZO5XInF0g5Vp03VafMfysVb98uGFT4AAAAASUVORK5CYII=',
			nsnovel: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAf0lEQVQ4jWP4z8DwnxLMgFPy/////w8coMCADx8ghiCLYTEQtwEbNmAaAANEGdDQ8B8DwAzGawAMPHiA0ITFZuJdADMgIIBMA7B5RUAAiwG4ADYvJiSQ6AV0A0gOAzxpgzgDFBQQXnJwINMFDg7//1+4QEIsFBRQmBeIxBQbAAC711/XZryTkwAAAABJRU5ErkJggg==',
			readnovel: 'data:image/ico;base64,AAABAAEAEBAAAAEAGABoAwAAFgAAACgAAAAQAAAAIAAAAAEAGAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAACNoNKNoNKNoNKNoNKNoNKsuN3+/v////////+pq9klJ5wtMKAtMKAtMKAtMKAtMKCNoNKNoNKNoNKNoNKNoNLl5/P////////z9PpKTa4sLZ8tMKAtMKAtMKAtMKAtMKCNoNKNoNKNoNKNoNK9xOT///////////+doNMkJpstMKAtMKAtMKAtMKAtMKAtMKCNoNKNoNKNoNKVpNTx8vj////////u7vdCRaotMKAtMKAtMKAtMKAtMKAtMKAtMKCNoNKNoNKNoNLN0+v///////////+AgsUmKJwtMKAtMKAtMKAtMKAtMKAtMKAtMKCPodKJnM+2vuH9/P7///////+xstwtMKAtMKAtMKAtMKAtMKAtMKAtMKAtMKAtMKDX3e/f4vL9/P7////////HyeYzNaMkJpwtMKAtMKAtMKAtMKAtMKAtMKAtMKAtMKD//////////////v/////z9PnMzulna7spLJ4tMKAtMKAtMKAtMKAtMKAtMKAtMKD////////////////////////////5+v1qbbwpK54tMKAtMKAtMKAtMKAtMKAtMKCh4f+S3f+T3f+R3P+s5f/t+f/////////b3e80NqMxM6ItMKAtMKAtMKAtMKAtMKBx0v9x0v9x0v9x0v9x0v+U3f/+/v/////6+vxSVrIqLJ4tMKAtMKAtMKAtMKAtMKBx0v9x0v9x0v9x0v9x0v9z0//q+P////////9qbr0oKp4tMKAtMKAtMKAtMKAtMKB61f9x0v9x0v9x0v9x0v+A1//1/P////////9labopK54tMKAtMKAtMKAtMKAtMKCi4f+Y3v+Z3v+Y3v+X3v/c9P/////////09/tKTq4tL6AtMKAtMKA0NqMtMKAtMKD////////////////////////+/v/////BxOQqLJ4tMKAtMKAtMKAtMKAtMKAtMKD//v///v///v///v///v/+/v/////p6vZaXbU1N6MtMKAtMKAtMKAtMKAtMKAtMKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
			hwen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAolBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEREBEREBEREAAAAAAAAAEBANEREBEREBEREAcHBpEREBEREBEREAfHx0AAAAAAAAEBAQDAwMBAQEAAAAAAAAEBAQEBAMAAAAAAAACAgELCwoNDQwEBAMAAAAFBQUYGBYAAAAAAAADAwIDAwMVFRQAAAAAAAADAwMAAAAAAAAEBAMEBAQAAAACAgK4o5znAAAAMHRSTlMAirgPqqfAFAEEBezoFQkKASAPDQIi6MDpwpeM9+nDV0hJUVPz7BYd6Fd2dw5rdG0B2QKwAAAAoklEQVQY032O1xLCIBBF11gCRAkJMcWW2LvCRv//12SZsTx5X3bumQtzAKATBF2g9IK+vwNjQsYFZ5EZvsFIxlIBAeaBTVKdAQHFCVgcU3cgl8LdAtuEOkS2jN2CVS1OppQZzqX7gy/QGorFtlRuKKpPx5xe8sKYummWq/XGeg9GYpDpVG+/YiH17Md0R/2P6eO5l8qbHrzp8XS+0BKut7vgL6cwE7GLeitlAAAAAElFTkSuQmCC',
			fushuw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADBElEQVQ4ja2T30tTcRjGv1oS9AsqpIuu82+IfkAFXQVBBpEVBFGkVJiERmC0olLxR2bSpuk0ExZGK1tTN21Oz3I729nxbOo8bu54zHOmTt3cnNtRyqeLMvKuoOfufZ/3fa4+DyH/UyqVKr1bbzjc8e7jAc/MzLb1PYB0ahG7/pjTfj/NeGa2fTYac2wm04l+i/lQiKZX+N4epb+jI3P92POl8YzkqNCODtSdH2KaT4r20nqO1txUAenEae65OO2kEaIZ8Hbbd4lzQrRZYP2gKwCQxjDM1snBmliMKYM0WA7RVYbYcDnCw7VrlLE2iwxRfZpxgwGzLhYpWcLqlIyUFILMcXGWDWQ6Ao6dc1zValzUICk3YVluQlJQY4mvxYC55DTxUlTxAudFKhLBiiRDkWUo8hSiYz64+7tuee2vL8RlA5bnzViSmpGQXyEptSAht2CcqtEQa33V6UR4Fkp4DivSFKJjPBRJwvSQG2/UtQbG9OiSEvMhLjZgaaIOS0E1khONSISaINjLKontne5UKroAJRxGxOfFaJ8RTNd76J8/xHutKuJsf5JtfPsC96+fBN15H+a2u8i7cBzG1tsQqLIKom3TZs4FBSW5GEHNnTzkHM3CqLkBcd6E+cDw2qf2umOtFde+dzXcAG96BFpfjLZnuWipvIxAX3kpIYQQwensXp6eRTTgR1z0IiXyWLCbMGj5oLVadUcW/eq1RKAeovEKJs0FSPrrkRC18NmevSSEEOLo7T0cGhzh4uM+LI7wEE0meNpbdGPzU/t43rZjzK3umB3WINiZh6+WfMz561ICW0U7nW8P/gYq6AvuH+nsXmWzc8GeLcIkw9yx8fyOnzD1bmbZ1pJgXxGEgWJwruoqAOkbMNbnPy70lKrBXSyAK+82BKP5+p8+69KVipwGE1wJ3MwDbxurzdwQIAxY70X9bsVGq7859M2pIYO1EEDGOs4ORlM96nkaoRyFdkvPVco13nNuQwCALbFYbDeAPQB2AsgAsOmXm5ZAYi8Q3v5P7fwb/QCtoT8AGR0q8wAAAABJRU5ErkJggg==',
			ineixiong: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEElEQVQ4jYWTP0tbYRTGz2ACwcHBVcE4RnAxiKKD4HAnv4B+AkuLUqKNpk2itjiFWloF0XRJ65J2KUgJRvEOKUEnKYJ/cpP031StZkib1nh+HbwB2+ba4Szve97fOe9zniMREerFTEMDjxobmXW5CDvkRESQeocTIrweGeFHqUQ6GGTif4CwCMFrcUeEV8PDqCqboRC3/7oP2m8iIkhYhDm3m5XubuJ9fSQMg1XD4F0shqqyl0iwYhgkDIMXhkG8v5+Vnh4eejyERZBpERa8XlSVi0qFgmlimSZfDw7Qy0vOCgUs06RomuRNk5/lMqrKUkcHUzXA47Y2VJVP2SyTItwS4eXQEKrK2/FxRkWYFuGuCLlUClVl0ef7F/BlZ4eACNGmJvYSCVSVXCrFfGsrk/bfrY0NZ0A+nea+x8N+Msn3kxM2YjFODw8pbm8z39LCuAj5dLo+4PLigpOjI96vrVE5P+e5YTAqwjO/nzPLorC1RbS5mf1ksj6gWqmgqvwql4kPDhIQYUaEgAhP/X7Oi0U+ZzKc5nIOHVSrfLMs4gMDVzrYc47axlru6uLN2Binx8fOGnzMZAhcM0nkGqRmsKP19RumsLtLqA4gIsIDuxPLScSbAPdE2AyF+JDNUimV/gSERZh1uVj0+Vjweh2rP2lvZ7W3l6XOThZ9Pubc7isr15Zpynab09aF7Jxa1Ar9BnTGL1W31z1DAAAAAElFTkSuQmCC',
			lysw: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB4klEQVQ4jY3SS29UZRgH8LNh4coETarUSbUQRlKMbpDv4kJanGYGsSU0gW+M0WDbufSc9z3v7efizB5Wz+K5/J//pdNQPrhBQ7PWQ0UZWR2TyZKgUirj1E+KriE1jAwQi4wSqiJqq6+o5LYT6jihxEFGL+s2cDrjr0POv+Zyxm8/sjgQ337P2zm/z7g81K6es5qJ7094ecLpY53MUImyG71Qs7UkyISgvnpIQot2LdKS3I8ilH90/G0NhWlyKvVmopquvrS1ZY1ySx0YuLOj0UmB1AsmHYKBnMjJoHH2E2k69tFgqD2VDYKky/vFfP6L8vq+8OYZfxyznKuv7nH1rfHFiXw5Z3nC4qnh4ojzIyJdrHvL2kejOn2St2INcpv4tEZpVYZ6406lRX2hS4LYMBSjjY0oh0mTvI9Cca2pk4WZpO2z0HTZQAq8fKRcPGPxgMUjXv/AiwMujjmdSxeHLGcsH7M60qtaoTPkyYF339huEzVPSAhobmkVGxJF5c8DtfaCqLuTjPhv+bMm28rE6X1hqq1RFVJTJMPqu3026OQyQV194a6SykjJlJ3e8BkHxonBeH5IIiLU7F9rUvs0hV7EtZpx9oCzOcsnLB6y/PUzRGykvE9xvnWNXQmKHfInbfwfWniXEgqbHyAAAAAASUVORK5CYII=',
			hongxiu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABP0lEQVQ4jaWSPY7CMBCFiTw0HIIj0FJRmstwFloa90h0uQBKS5UDUPEjdleLiOWIkA1O5m3B2iQKWtDuSE+ybL/PM57pHIXAf9Q5CoF6cFWBrQUz41k8BBRSogwClEEA2+v9CmoBbJKgJEIiBMogwLXbfT0DZvavJ0Lc1sY0yytLlGkKqzWY+Q4oDoeG2RChkBJWa1RZhs/ZDIaoqeXyDnBGZzZE2PyokBKn+bxhZqVQ7Ha1DKRsXHBGVgp6MAAz47RY+HOrdfMP+Hr1dTrAdjKBIcLXZnOrXykYIrwNh74zrS7UM3CpnlcrZHHsW+v2dRi2AToM/Uvbft+v63/idB6P24Aqz/3lNIrASuF9NMLHdIo0ilBlGao8R3W5gJlhiJqALI494JVRbgHy9fo2A/v9U/NDgJu2V8MD/ipDhG+NduvsMN//BQAAAABJRU5ErkJggg==',
			saowen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZklEQVQ4jaWTS0sCYRSGP2gR2E9o0S8oKtrkok2/wiBo180sZ4z2BS0ku0BB+4qILibtWxTh6DeLwrls0qLINGgmJCdz/HxbpNU4o5QtnsXZPJz35RxCAiL+xc+hdU5E+/wVCE+bE/SuyDiWdRCOfkpm4s5w1CpoCYhwzYroW1UQkXW4eIqOhUswwEaxXMbI/o1V4Nm5xqvJ8GKW8PRuIl9iGFiSQMaFGqJQ03l4dlM1EfxxEG8MnUEJhwkNZFKwrlmFp1AfDQdBhZ5qB/5KTl/MhppuIOhelhFRdBxJGgaDCWiGiWejZCFbMO2CNo5ieC+FIisj+2Zi8TQNMhUDGY3aUB8cOnCvKzhL5TB9coewpDvnb9gBT0H88e8O/iyoLZGj6F9TMLSdtLKVRFIvOAkoyFgUXSHpS+AL3+JA1mzc54sOAq8AgzHkGMPmRab+L/AUofMM3BuqQwSvADJR54B++0zN8AFgHpHnqO436wAAAABJRU5ErkJggg==',
			woqiushu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACLElEQVQ4jY3Rv0sycQDH8dSh0bH/QOnPaDahSRAcWlsqQnJrMDsHwyiwnwQqGIKICQ42NIUinAdCKtbYSW6Fh3DnnXfvZ7rj8VHh+e6f1/fz/XzXACzLotVqsbW1hdfrxeVyEQwGiUQi+Hw+XC4Xbrcbv99Pv9/n6+sLy7KwLIs1G8jlcgQCATY3N52Ax+NhfX0dt9vN9vY2giCgKAqDwWARmEwmXF5esrGxQTQa5fX1lff3d4rFIvV6HZ/PhyzLTtA+DqCqKvv7+5yfn1OtVvn8/GQ2m/H8/MzHxwf39/dcX19jmuZyYDabkUgk6HQ6iKJIs9lEURR6vR6yLCPLMoIgzIXnANM0yefzdLtdDMNA0zQsy0LTNFRVZTKZEI/H0XV9dYObmxtSqRSxWAxRFDFNk5+fH05PT8lkMgiCgGEYywHTNBkOh+Tzeb6/v5lOp6iqiq7raJpGt9tFluXVG9iIDXU6HQ4PD0kkEkiShKqqTngB+BuxocfHR/b29tjd3aXVajn40hH/RX5/f9nZ2SEUChEOhzk5OWE6nS6EFwD7FkVRuL295eDggGg0ytXVFbqu/18DwzBoNBokk0lisRjHx8ccHR1xdnbGaDRavYHdYDgckkwmubi4IJvNcnd3RzqdJpVKIYqi8xQbmQMMw6Ber/Py8sLT0xOlUolyuUyhUKBUKlGpVJyvXNlgPB4jSRJvb280Gg3a7TYPDw/0ej0kSaJWqzEej50GfwDwoWlPRty5hAAAAABJRU5ErkJggg==',
			mmzh: 'data:image/bmp;base64,Qk02AwAAAAAAADYAAAAoAAAAEAAAABAAAAABABgAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAA/////////v7//v78/vv9+vv4///74+n6VE/m///7//79/v77/Pz8/f79/////////////////v7+//3////8///89fv8TDvoVUfki4Tx///5///z///7/P////////////////7//v7+///4r6nwenjkzsn1hYDpwr74eG/z8PH51975ppvw/////////////P39/P/69vP7oZnt+v7/Y1LxoaHvn57sxsb0q6fshIPtLBzXwMH4/P33//7+/P76+/3++v78///7VErnRjbcnKPzurPyloj7s7LqlZHxUEPuSDrk6O/6Hgre9vz6/v37//z////4////0dX2RTrjQjfl0M311Nby0M35fnTnT0ffr63vdmvj1tj6//////7+///3////amTlraz5ran2X1bj0ND3///////9///////7sa70jIfvb2bjmJH2///4g3jkXlHue3Xrl4vrkYjwtrjw/f/4////////////0837zMv5+fr4///1U07udWjs4+b0NyPgtbnxyM70u730u7Xz////////////////x8r2hoTnfnnzZF7uYlrhkI7v///96uz/lIfslY71hoPtsLfw4eX9//z+///6///9cWzpWFPolI3y1db3npbz+f37/f/6////5/L5OCbelZPuXVPnWEfmqKnwzcb/ubfxsqr4RTvhOyvlmZX1///6///3//z////39PX98PHsq6v4RzzkfXPsf3fsxcfyycr6UEbkt7fymJXnV0zi/fv7//n//v79/f38/f/7////WkvjTzvpwcfzeGzp4ub3j4Pvz9DyQCzq///3///7+Pn//f74////////////8fT8k5Dx///9uLP2ZFnxzNTycGnt//////////7+///+///////////////////////6///////0sLLyTkHhPijp29n4///9/////f77///+/////////////////////v76/Pz6/Pv7///8k4zy3dv2///9/v7+/f39/v7+////////////',
			yunqi: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC1klEQVQ4jWWTP2xbVRSHT4UoYsqLiRiYQjKAGFAWZIsBvJCgCsQAogtsKAMLC2oWBKq6JUgoVECohB6kIAExMiVSKWoUtwqQf6RW0xrs2Knbun6xndjP9nv+++67H0NTt2l+0ifd4Z5P91ydI/JQvP8krJMS1emA3c08z8LV13jr/Gh8KBI0B+dC4Yfv92LHxdBJiem0gb/3OdXSEnvlMq9fOM4Hi+M888uLDEdCDEeC0UFzxDhcnJK4Tgl+9XvsapW641B3HH5NR/gx8Q0v/za6LwgxNBeMH5DopMR0SqDwPm41QbPVotPp4HkeJWeXfwpxpjfPEJw/1pMMzwVj93tOCToleJWztFotlFKsZG1st8PMwhbmpQzZ6m2W8iucWPukJxmcC4VFJyWqU4K+MUS7vopSiptul2d/SGJMXkZOLSAfXcBcvoVSiiuFTT5cO3m3lUjQFJ0SW6cEnRuj0yqhtWY2Uabv9Doy+WeP8Jl1tNZ0PY/k7hav/nGcoUjQlnvP16UJOs4GWmtmVneQ6Y0DDH61QcVpo5Rip1pkdusnhiMh9gVHwHoTr5Wh7LR54/fbyNeJg8xcx7xaQilFo9kkuZveFyQlSyYA5Sm6tYvccbpMxHI8fnYb+fY+4/PbrBabeJ6H22hwbSdB8NxoVlqZMVNn+vHvvEuj9i++7zO9WeHpn3P0mTd4cjbLc/NFxpeKeJ5H7e81arUal7cX735i6dgLI4XvTMqVCo7r0ul08H0frfUBGsk07cR1utcuUXrnbb688gW90bYeG4iVpk5RvnkL13Vpt9t4nodSimahSH0xhvPZFHvvjbE3/gql8AiTK5+avUnMimFYfU/FqxMnqC//RfX8RerL69Si56h/fJLdl8JYRwJYjzyB9egA+aMD8UPLlBXDsKQ/ZkkASwJYRwfonR8gL/3RrBjGIcG95MQI5yVg5qXffqDIzkvAzIlxaJ3/B/yfeC+MhAUTAAAAAElFTkSuQmCC',
			hongshu: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACq0lEQVQ4jZ2Se0hTcRzFfyJOna98TKcuzVJJ6GFImWYPDYxIQUQifCEWCv4RFiVEWUMKexBFfxQUBb0wRj4KJMWgWPiioeJrk3s3b97t3nmXd3M+9ub0RwSF/bE68P3vnA+Hw5cQPwSOk4KQAH+8G8MqVeB6l3J0vefOe7Bs6H9BVp8oe80pW+Cx0oWgqOB/BiwvL8eY66sN/LkKwdZSZfAs0vl+h7GyInN2P7u/WFCwzg68ahevtfQ6JgZrNhjtdnvs2polkRBCMDMj8Viow463Dx6LdUdEfkcs+K1yLI19Os3zvEyv16eoVKrAPwCuj92t7tnRWpd2qNJ+o2rGdiHJt/wwA+q6PFjqZPhWmQW+usTkEtmdf63qHv/cZL/aoBXPKnzO/l3wTubCOZCOtc7tMN9TYLopE9wxBSxFhwT3d/3eDQCXuvuStVnm8wxnwEcfhHdyH9xfsrDelQK6LQGiMhZCZSS4jAiI5SWMw2FNdQ323Pw51NJSpLXx6OLK02g4+8Ox+iIEtvZQLF0MhqVRAnOtBGxlMBbKw2DKDwMXtwkryuZp54c3twkhhHjsTL6QlwDxMoH1OoGlIQDmUgn4IilMeRGYz4mALicMU9khmFZIYYiKhOlk6YIgCOHES41VODoevV7cnAbuQLKPL5L7uOx4cNtiYUyNwXyKDNpkOcbk8RiSRUMdJMU4Ccd87n6b0WhUEPfsSI3XOHXCvWbao9NpCintSDE9qS6jhvvO0J3P2/S3lB1Uzanp2czdzmFJEvpIKIZJKJjjxSZBmJcTQgihKCqY4zipKIpRv45l2Rie52UMwyTqdLq0uTlNAf3uZau2vvqrLjrZa2isnRBYOt3vj9RoNEGCIIQzDJNIj6vLDOeb1La7V0b9BvwulUoVyHFcnNFoVPwAxwKMjYVD0QoAAAAASUVORK5CYII=',
			msxf: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABHElEQVQ4jZWSXU6DQBSF7wpcijZliGCiC3QHGoUKiKZ78UmxlqaaNtUGb5EnpyQwOT5gGoryd5OTyfx9OefOUHw2BmseWHfBwsNG7yYeOOATH8SajyxMoFj2Ujb9QnQ0ArF5D5Wk6FsqSRHpDujT9KE2EgDwcHC+U3Ve3VMssdYdUGTe7QHKY7mqawXABa2NdsB/QMUSH8IBvRs+8kqE8sW6CDlLrMQNaNUCqIuSs8RSjEBL43YP0LUXOUsshA1aGF4joCnCq7BBby2AJgdzYYPmFUCfHsyEBZodu38clA/XRchYIiwADvLfr9zl/XcOki1ehAWaDC2kYYyMv3tpO40RHF6AJqcenoYWAnGNQLtCIFqkFXocXOLZtPEDEqROLYZ4pVoAAAAASUVORK5CYII=',
			hxtk: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACoElEQVQ4jaWTXUhTARiGd91FUNAP6U1ZVkghWSJFSaV0VZASWQYpQVKBUJQXFqUGiWFYgQpp5k+l1hR1ZjVzlkutjpr78WdzW+6cHZ0y9Uwx3W6eLiZpSRB18Vx8fPDyXLyvyu+V+B9USw+fIuKbEpkVB1EGuplx9uOflv8uYHqkF+8XPR27YmhYsRFd3EnsVTW41I1YcgtxVrxgVhzC73UtD5iwv2fGZaIr/DAtq7bhKC3FrmniVUg0TUFR6PbFow2LpXFDJI6S5z+tfIqEam7CjmyqwV30mLaVWxi6noW9tYX6tRF0Jl/BJrRjrnxJV0ExXU+fo9l8AGuVetHAY2vF4/jAYMJ59GvCmLab0SVc4F3saWSbkRGHCe2eo9Ru2I294TWtpy4iXM3Ep4iBANlQgyIJmA7F0xV5BK/bTk3ofrrzH+H3SnjHbOhOplC5Ppzq4N28PXgCsbtz0UDuVTPpbMd87AxfImKZlK1UhkRhq6tDGbZgLS6nKnQv5et28jnzLiMOE/NTIn4lgMpj0yH1PMN5J5fW1VsZNwlo4pJoz8hmwjWA0yzwJvECZcHhjA724lMkvk8MM+v5FjCYc1voa85ixvEVfUgkxtQ0LNrXPNkUwZixB58i8Sr5EkVBO5D6vmIsLKbhaCJCzn3G+w2o5mULo5/UWDseMtmho3lrFP338rCoaykNj6Y9M5vq2OMUBIdRERlD4frtNCaco7dWjWuwB5VfEfGUlODSP8Xa8QDFIWDKzkFIv4EhPx9NUgqasyk0pV5De+s2Zm0T7mHTr0Waky1I6RnIFUV8+xhA6qxE7KzCUl/CaE8bc1POQNUXCrSsyr7JYdwVZRgvp9GXfhND5m0MeXmMCW2LO1nCn8e05Pn7b37B4o9r/Bd+AMDnR1laSoQVAAAAAElFTkSuQmCC',
			yqxs8: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABqElEQVQ4jaXTv0sjURDA8dkoIUWaoBZ2FoLpYrHYSPAvsAmIiJ3gmt5/QiwthLeu0XByF3+wnNeoqOCmsUiRgHjecf4AixQigmIgl7vd7xVy77KXbOXAdMPnvTfzRkQJ70pRQno7jeVZOnNHORJOIlSY2c0w783rmvR2+h9geRZ/w7lySK4nMZSB6Zpk97PE1+KIEqZPpmn5LQAsz+oEDu4P9Ik7NzsarTxUNLJysRINTB5OIkqIr8Vp/m7SHtn9LKKEubO5aMB0TX2DqeMp7l7uAHhqPpHaTCFKKHwrRAML5YVQ42J2jIkvE4y5Y4gS8uU8fuBHA/VGnaGPQ13HlXASFL8X9ZO6AgDurUtMxSLnbn+1o4HSdYkeuwdDGThXDquXq4zujYaAwQ+DBEHQCby2XkltvDVq5mRG3ygIArZ+bGEoQyPPP587gepjVRcs15b5P0ZKI4gS+ov9+IHfCTR+NRgoDiBKGP88HvoHtccavXYvooSl6lJ0D7y6R99mH6KE4U/D5Mt5Zk9nSRbevvbi+WL3MbYvU+4op09rT9M1QwsXWqb35B/2S12SjKotewAAAABJRU5ErkJggg==',
			zhaoxiaoshuo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABtklEQVQ4jWNgoBYQ8OlaKODb/V/At/s/r1ebGgMDAwO/T9crIf/23wzyO14zMDAwnPvP8H/FK4b/8x4yxGMYwO/T3QUzACYm6Nf1n9Vx+n8ur85rF/8zfFvzieE+AwMDw9w7DP8nXWZQRmj27mzh9+l6DjOA36frGMSAjt8MZkv/mxRGTL7/nwFu8ISLDP/bjjKEIJwP1YiMoa76IeDb/Z9BY+uLmbcYzE//Z/i/8gXDp97LDP9PfrBTxGsADAv6df3ncpv8n0F70+nMlQzxyUsYNm6+6e+18Q/D/7f/dyyDG8Ln25mF0Ng1Cd0QHq/+/wy6m/8zqG/6z6Bw48n0cyr7d39j+A0NwK4VAj7dHzG84Nv9Esbn9msVF/Lv/C8a2HGYwag7HTUKcYSBgG/XBnjA+nb9FfDt/i/kj4glnAbw+3SdxWm4T/cm7AnJt6sQPR0I+HYfRDHYt/scVHwBloTUNRfJuW+weYvPt7Of37f7D7IlMM2/UW3quoMvaqExtRhuAK9Xtz+2RIRwctdTtDD6zuDQwILmiu7rAr5dRzh9WqSxhpFP9yIB3+6rAt6dxVgDkVwAAIsxJ9sy6U93AAAAAElFTkSuQmCC',
			};
		var icons = {
			baidu: base64_icons.baidu,
			google: base64_icons.google,
			haosou: base64_icons.haosou,
			youshu: base64_icons.youshu,
			qd: base64_icons.qd,
			cs: base64_icons.cs,
			zongheng: base64_icons.zongheng,
			k17: base64_icons.k17,
			g3: base64_icons.g3,
			fl: base64_icons.fl,
			qxswk: base64_icons.qxswk,
			read: base64_icons.read,
			ccc5: base64_icons.ccc5,
			mht: base64_icons.mht,
			suimeng: base64_icons.suimeng,
			ddxs: base64_icons.ddxs,
			glwx: base64_icons.glwx,
			fywx: base64_icons.fywx,
			aszw: base64_icons.aszw,
			fyxs: base64_icons.fyxs,
			ldks: base64_icons.ldks,
			wcxs: base64_icons.wcxs,
			buy773: base64_icons.buy773,
			sy00: base64_icons.sy00,
			du55: base64_icons.du55,
			dsb: base64_icons.dsb,
			ppxs: base64_icons.ppxs,
			qdwx: base64_icons.qdwx,
			shushuw: base64_icons.shushuw,
			zhuzhudao: base64_icons.zhuzhudao,
			jdxs: base64_icons.jdxs,
			wxzs: base64_icons.wxzs,
			shuwu1: base64_icons.shuwu1,
			biquge: base64_icons.biquge,
			ckxsw: base64_icons.ckxsw,
			du7: base64_icons.du7,
			klxsw: base64_icons.klxsw,
			qqxs: base64_icons.qqxs,
			shenma: base64_icons.shenma,
			sm: base64_icons.sm,
			vodtw: base64_icons.vodtw,
			wangshuge: base64_icons.wangshuge,
			xinbiqi: base64_icons.xinbiqi,
			quanben: base64_icons.quanben,
			aszw: base64_icons.aszw,
			nmtxt: base64_icons.nmtxt,
			wxxs: base64_icons.wxxs,
			wdxsw: base64_icons.wdxsw,
			kmsb: base64_icons.kmsb,
			bltxt: base64_icons.bltxt,
			qq119: base64_icons.qq119,
			blbb: base64_icons.blbb,
			bookdown: base64_icons.bookdown,
			aqdzs: base64_icons.aqdzs,
			shumilou: base64_icons.shumilou,
			epub2: base64_icons.epub2,
			epub: base64_icons.epub,
			sxcnw: base64_icons.sxcnw,
			tusuu: base64_icons.tusuu,
			txt8: base64_icons.txt8,
			llzy: base64_icons.llzy,
			jjxs: base64_icons.jjxs,
			dmzj: base64_icons.dmzj,
			yidm: base64_icons.yidm,
			sfacg: base64_icons.sfacg,
			slieny: base64_icons.slieny,
			lknovel: base64_icons.lknovel,
			xsbs: base64_icons.xsbs,
			fresh: base64_icons.fresh,
			caihong: base64_icons.caihong,
			d8qu: base64_icons.d8qu,
			qqxs2: base64_icons.qqxs2,
			bihaige: base64_icons.bihaige,
			rrxs: base64_icons.rrxs,
			feisuzw: base64_icons.feisuzw,
			tofu: base64_icons.tofu,
			banfusheng: base64_icons.banfusheng,
			akxs6: base64_icons.akxs6,
			nsxs: base64_icons.nsxs,
			amxs520: base64_icons.amxs520,
			zhuaji: base64_icons.zhuaji,
			quanben_xiaoshuo: base64_icons.quanben_xiaoshuo,
			qdmm: base64_icons.qdmm,
			chuangbie: base64_icons.chuangbie,
			yanqing: base64_icons.yanqing,
			yq123: base64_icons.yq123,
			jjwxc: base64_icons.jjwxc,
			xxsy: base64_icons.xxsy,
			nsnovel: base64_icons.nsnovel,
			readnovel: base64_icons.readnovel,
			hwen: base64_icons.hwen,
			fushuw: base64_icons.fushuw,
			ineixiong: base64_icons.ineixiong,
			lysw: base64_icons.lysw,
			hongxiu: base64_icons.hongxiu,
			saowen: base64_icons.saowen,
			woqiushu: base64_icons.woqiushu,
			mmzh: base64_icons.mmzh,
			yunqi: base64_icons.yunqi,
			hongshu: base64_icons.hongshu,
			msxf: base64_icons.msxf,
			hxtk: base64_icons.hxtk,
			yqxs8: base64_icons.yqxs8,
			zhaoxiaoshuo: base64_icons.zhaoxiaoshuo,
		};
		var list = {}; //列表对象啊..
		//如何添加搜索引擎:
		//比如:
		//list.web[0]=['Google','http://www.google.com/search?q=%s&sourceid=opera&ie=utf-8&oe=utf-8','http://www.google.cn/favicon.ico','gbk']
		//list.web[排序(从小到大排列,小于0不显示相应引擎)]['显示在网页上的名字','关键字变量用%s代替','站点的图标(可以没有)',是否不接受UTF-8编码(不接受的话..填相应的编码..目前支持gbk或gb2312)]
		list.web = [];
		list.web[0] = ['', 'https://www.baidu.com/s?wd=%s', icons.baidu]
		list.web[1] = ['', 'https://www.google.com/search?hl=zh-TW&q=%s&safe=off', icons.google]
		list.web[2] = ['', 'https://www.haosou.com/s?q=%s', icons.haosou]
		list.web[3] = ['[无墙]', 'http://www.google.com/cse?cx=010023307804081171493:j3mspv1aine&ie=UTF-8&q=%s', icons.google]
		list.web[5] = ['优书网', 'http://www.yousuu.com/search/%s', icons.youshu]
		list.web[6] = ['UC', 'http://m.sm.cn/novel/index.php?uc_param_str=dnntnwvepffrgibijbprsv#s/%s', icons.sm]
		//
		list.web[200] = ['20xs', 'http://zhannei.baidu.com/cse/search?s=12716794992379341146&entry=1&ie=gbk&q=%s', icons.ddxs, 'gbk']
		list.web[201] = ['00', 'http://00xs.com/modules/article/search.php?searchkey=%s&searchtype=articlename&submit=%s', icons.read, 'gbk']
		list.web[202] = ['我看书斋', 'http://www.5ccc.net/modules/article/search.php?searchkey=%s&searchtype=articlename', icons.ccc5, 'gbk']
		list.web[203] = ['棉花糖','http://zhannei.baidu.com/cse/search?s=14801304392427009966&entry=1&ie=gbk&q=%s', icons.mht, 'gbk']
		list.web[204] = ['随梦', 'http://zhannei.baidu.com/cse/search?s=9424353631105939790&entry=1&ie=gbk&q=%s', icons.suimeng, 'gbk']
		list.web[205] = ['顶点', 'http://zhannei.baidu.com/cse/search?s=15772447660171623812&entry=1&q=%s', icons.ddxs, 'gbk']
		list.web[206] = ['无错', 'http://zhannei.baidu.com/cse/search?s=14724046118796340648&entry=1&q=%s', icons.wcxs]
		list.web[207] = ['三易', 'http://zhannei.baidu.com/cse/search?s=11465159304319747469&entry=1&ie=gbk&q=%s', icons.read, 'gbk']
		//
		list.qxs = [];
		list.qxs[1] = ['轻小说', 'http://www.wenku8.com/modules/article/search.php?searchtype=articlename&searchkey=%s', icons.qxswk, 'gbk']
		list.qxs[2] = ['动漫之家', 'http://xs.dmzj.com/tags/search.shtml?s=%s', icons.dmzj]
		list.qxs[3] = ['游书网', 'http://www.miaowenhk.com/modules/article/search.php?searchkey=%s&searchtype=articlename&submit=%s', icons.qxswk, 'gbk']
		list.qxs[4] = ['迷糊动漫', 'http://www.yidm.com/modules/article/search.php?searchkey=%s&searchtype=articlename&submit=%s', icons.yidm, 'gbk']
		list.qxs[5] = ['SF轻小说', 'http://s.sfacg.com/?Key=%s&S=1&SS=0', icons.sfacg]
		list.qxs[6] = ['【WAP】', 'http://m.sfacg.com/search.html?keyword=%s', icons.sfacg]
		list.qxs[7] = ['零创世', 'http://www.0acg.com/modules/article/search.php?searchkey=%s', icons.qxswk, 'gbk']
		list.qxs[8] = ['翼凤轻小说', 'http://zhannei.baidu.com/cse/search?q=%s&nsid=3&s=7581468868441052147&ie=gbk', icons.slieny, 'gbk']
		list.qxs[9] = ['轻之国度', 'http://lknovel.lightnovel.cn/Lists/search/keyword/%s/', icons.lknovel]
		list.qxs[10] = ['BBS', 'http://www.lightnovel.cn/search.php?mod=forum&searchid=2851&orderby=lastpost&ascdesc=desc&searchsubmit=yes&kw=%s', icons.lknovel]
		//
		list.ol = [];
		list.ol[0] = ['【在线】', 'http://www.google.com/cse?cx=010023307804081171493:i5fc0ovot-8&ie=UTF-8&q=%s', icons.google]
		list.ol[1] = ['小说巴士', 'http://zhannei.baidu.com/cse/search?q=%s&s=9212913067001738298', icons.xsbs, 'gbk']
		list.ol[2] = ['笔下文学', '/s?wd=site%3Abxwx.org+%s', icons.du7]
		list.ol[3] = ['顶点小说', 'http://zhannei.baidu.com/cse/search?s=15772447660171623812&entry=1&q=%s', icons.ddxs, 'gbk']
		list.ol[4] = ['猪猪岛小说网', 'http://zhannei.baidu.com/cse/search?s=10098718268113957097&entry=1&q=%s', icons.zhuzhudao, 'gbk']
		list.ol[101] = ['无错小说网', 'http://zhannei.baidu.com/cse/search?s=14724046118796340648&entry=1&q=%s', icons.wcxs]
		list.ol[202] = ['随梦小说网', 'http://zhannei.baidu.com/cse/search?s=9424353631105939790&entry=1&ie=gbk&q=%s', icons.suimeng, 'gbk']
		list.ol[501] = ['书迷楼', 'http://zhannei.baidu.com/cse/search?q=%s&s=8368117840945533437&nsid=0&isNeedCheckDomain=1&jump=1', icons.shumilou, 'gbk']
		list.ol[502] = ['文学迷', 'http://www.wenxuemi.com/modules/article/search.php?searchkey=%s&searchtype=articlename&submit=%s', icons.read, 'gbk']
		//
		list.vip = [];
		list.vip[21] = ['【备用】', '/s?wd=site%3Aqidian.com+%s', icons.qd]
		list.vip[22] = ['起点', 'http://sosu.qidian.com/searchresult.aspx?&keyword=%s&internalsiteid=1', icons.qd]
		list.vip[23] = ['【HTML5】', 'http://h5.qidian.com/searchresult.html?ky=%s', icons.qd]
		list.vip[24] = ['【M站】', 'http://m.qidian.com/search.aspx?searchkey=%s', icons.qd]
		list.vip[25] = ['【ID】', 'http://read.qidian.com/BookReader/%s.aspx', icons.qd]
		list.vip[26] = ['创世', 'http://chuangshi.qq.com/search/searchindex?type=all&wd=%s', icons.cs]
		list.vip[27] = ['【备用】', 's?wd=site%3Azongheng.com+%s', icons.zongheng]
		list.vip[28] = ['纵横', 'http://search.zongheng.com/search/all/%s/1.html', icons.zongheng]
		list.vip[29] = ['17K', 'http://search.17k.com/search.xhtml?c.st=0&c.q=%s', icons.k17]
		list.vip[30] = ['3G', 'http://www.3gsc.com.cn/search/index/show/pic?keytype=0&q=%s&ver=new', icons.g3]
		list.vip[31] = ['飞卢', 'http://b.faloo.com/l/0/1.html?t=1&k=%s', icons.fl, 'gbk']
		list.vip[32] = ['找小说网', 'http://www.zhaoxiaoshuo.com/search_book.php?c=utf-8&kw=%s', icons.zhaoxiaoshuo]
		//
		list.top = [];
		list.top[151] = ['分类排行', 'http://h5.qidian.com/recommend.html', icons.qd]
		list.top[152] = ['三江', 'http://sjg.qidian.com/default.aspx', icons.qd]
		list.top[153] = ['新书榜', 'http://top.qidian.com/Book/TopDetail.aspx?TopType=6', icons.qd]
		list.top[154] = ['榜单', 'http://wwwploy.qidian.com/rss.aspx?', icons.qd]
		list.top[171] = ['最近更新', 'http://www.wenku8.com/modules/article/toplist.php?sort=lastupdate', icons.qxswk]
		list.top[172] = ['最新入库', 'http://www.wenku8.com/modules/article/toplist.php?sort=postdate', icons.qxswk]
		//
		list.per = [];
		list.per[209] = ['风雨', 'http://zhannei.baidu.com/cse/search?s=7020990342265439118&nsid=0&q=%s', icons.fywx, 'gbk']
		list.per[210] = ['爱上', 'http://www.aszw.com/modules/article/search.php?searchkey=%s&searchtype=complex', icons.aszw, 'gbk']
		list.per[211] = ['燃文', 'http://www.773buy.com/modules/article/search.php?searchkey=%s&searchtype=articlename&submit=%s', icons.buy773, 'gbk']
		list.per[212] = ['飘天', 'http://www.piaotian.net/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.read, 'gbk']
		list.per[213] = ['皮皮', 'http://www.ppxsw.co/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.ppxs, 'gbk']
		list.per[214] = ['151看', 'http://www.151kan.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.read, 'gbk']
		list.per[215] = ['笔趣库', 'http://zhannei.baidu.com/cse/search?q=%s&click=1&s=1813377024894429270&nsid=', icons.biquge, 'gbk']
		list.per[216] = ['笔趣阁', 'http://zhannei.baidu.com/cse/search?s=14041278195252845489&entry=1&q=%s', icons.biquge, 'gbk']
		list.per[217] = ['女生文学', 'http://zhannei.baidu.com/cse/search?s=15974929948538009431&entry=1&ie=gbk&q=%s', icons.read, 'gbk', 'gbk']
		list.per[218] = ['吾读小说网', 'http://zhannei.baidu.com/cse/search?s=2259711189597882409&ie=gbk&q=%s', icons.du55, 'gbk']
		list.per[219] = ['大书包小说网', 'http://zhannei.baidu.com/cse/search?s=17461687640719491697&entry=1&ie=gbk&q=%s', icons.dsb, 'gbk']
		list.per[220] = ['青帝文学网', 'http://www.qingdi.com/modules/article/search.php?searchtype=articlename&searchkey=%s', icons.qdwx, 'gbk']
		list.per[221] = ['小说巴士', 'http://zhannei.baidu.com/cse/search?q=%s&s=9212913067001738298', icons.xsbs, 'gbk']
		list.per[222] = ['Tofu', 'https://www.google.com.hk/search?hl=zh-CN&q=site%3Afiction.so+%s', icons.tofu]
		//
		list.end = [];
		list.end[451] = ['一本读', 'http://zhannei.baidu.com/cse/search?s=6637491585052650179&entry=1&q=%s', icons.quanben, 'gbk']
		list.end[452] = ['全本.co', 'http://www.quanben.co/modules/article/search.php?searchtype=articlename&searchkey=%s&action=login&button=%CB%D1+%CB%F7', icons.quanben, 'gbk']
		list.end[453] = ['qb5', 'http://www.qb5.com/modules/article/search.php?searchkey=%s', icons.quanben, 'gbk']
		list.end[454] = ['全小说', 'http://quanxiaoshuo.com/s_%s', icons.quanben]
		list.end[455] = ['全本5', 'http://www.quanben5.com/index.php?c=book&a=search&keywords=%s', icons.quanben]
		list.end[456] = ['淘淘', 'http://zhannei.baidu.com/cse/search?s=3123400089501277446&entry=1&ie=gbk&q=%s', icons.quanben, 'gbk']
		list.end[457] = ['qb5200', 'http://www.qb5200.com/modules/article/search.php?searchtype=articlename&searchkey=%s&action=login&button=%CB%D1+%CB%F7', icons.quanben, 'gbk']
		list.end[458] = ['全本小说网', 'http://quanben-xiaoshuo.com/index.php?c=book&a=search&keyword=%s', icons.quanben_xiaoshuo]
		//
		list.new = [];
		list.new[222] = ['书书小说网', 'http://zhannei.baidu.com/cse/search?q=%s&s=1763539373745923254&isNeedCheckDomain=1&jump=1', icons.shushuw, 'gbk']
		list.new[223] = ['猪猪岛小说网', 'http://zhannei.baidu.com/cse/search?s=10098718268113957097&entry=1&q=%s', icons.zhuzhudao, 'gbk']
		list.new[224] = ['69书吧', 'http://zhannei.baidu.com/cse/search?s=1056581952673445448&q=%s&t_btnsearch=%CB%D1%CB%F7', icons.read, 'gbk']
		list.new[225] = ['旷世小说网', 'http://zhannei.baidu.com/cse/search?s=413989568095163370&entry=1&q=%s', icons.wxzs, 'gbk']
		list.new[226] = ['壹书屋', 'http://www.1shuwu.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.shuwu1, 'gbk']
		list.new[228] = ['可乐小说网', 'http://www.klxsw.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.klxsw, 'gbk']
		list.new[229] = ['千千小说', 'http://zhannei.baidu.com/cse/search?s=14385258656228148903&q=%s', icons.qqxs, 'gbk']
		list.new[230] = ['神马小说网', 'http://zhannei.baidu.com/cse/search?s=1112742193063402114&entry=1&q=%s', icons.shenma, 'gbk']
		list.new[231] = ['品书网', 'http://zhannei.baidu.com/cse/search?q=%s&click=1&entry=1&s=1101330821780029220&nsid=', icons.vodtw, 'gbk']
		list.new[232] = ['望书阁', 'http://www.wangshuge.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.wangshuge, 'gbk']
		list.new[233] = ['新比奇中文网', 'http://zhannei.baidu.com/cse/search?s=2250330193510148485&entry=1&ie=gbk&q=%s', icons.xinbiqi, 'gbk']
		list.new[234] = ['亲亲小说网', 'http://www.xiaoshuo777.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.read, 'gbk']
		list.new[235] = ['傲世中文网', 'http://www.23zw.com/SearchNovel/?t=articlename&k=%s', icons.aszw, 'gbk']
		list.new[236] = ['新鲜小说', 'http://www.fresh.org.cn/search.jsp?searchsubmit=true&module=name&formhash=720327162&srchtype=title&srhfid=&srhlocality=forum%3A%3Aindex&srchtxt=%s&searchsubmit=true', icons.fresh]
		list.new[237] = ['彩虹文学网', 'http://zhannei.baidu.com/cse/search?s=10468783897977255221&entry=1&ie=gbk&q=%s', icons.caihong, 'gbk']
		list.new[238] = ['千千小说', 'http://zhannei.baidu.com/cse/search?s=14152597554956756889&entry=1&ie=gbk&q=%s', icons.qqxs2, 'gbk']
		list.new[239] = ['笔海阁', 'http://zhannei.baidu.com/cse/search?s=7765004634086012341&entry=1&ie=gbk&q=%s', icons.bihaige, 'gbk']
		list.new[240] = ['人人小说', 'http://zhannei.baidu.com/cse/search?s=534417025288039329&entry=1&ie=gbk&q=%s', icons.rrxs, 'gbk']
		list.new[241] = ['飞速中文网', 'http://zhannei.baidu.com/cse/search?s=4534462189485548481&entry=1&ie=gbk&q=%s', icons.feisuzw, 'gbk']
		list.new[242] = ['在线书吧', 'http://zhannei.baidu.com/cse/search?s=9051375811420446060&entry=1&ie=gbk&q=%s', icons.du7, 'gbk']
		list.new[243] = ['半浮生', 'http://www.banfusheng.com/search/?s=%s', icons.banfusheng, 'gbk']
		list.new[244] = ['爱看小说', 'http://www.akxs6.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.akxs6, 'gbk']
		list.new[245] = ['暖色小说', 'http://www.nsxs.org/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.nsxs, 'gbk']
		list.new[246] = ['爪机书屋', 'http://zhannei.baidu.com/sousuo?s=11210173359015444563&entry=1&ie=gbk&q=%s', icons.zhuaji, 'gbk']
		//
		list.pic = [];
		list.pic[502] = ['给力文学网', 'http://zhannei.baidu.com/cse/search?s=825194276128250527&entry=1&ie=gbk&q=%s', icons.glwx, 'gbk']
		list.pic[517] = ['零点书院', 'http://www.00sy.com/Book/Search.aspx?SearchKey=%s&SearchClass=1', icons.sy00, 'gbk']
		list.pic[518] = ['笔下文学', '/s?wd=site%3Abxwx.org+%s', icons.du7]
		list.pic[527] = ['读趣网', 'http://www.du7.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.du7, 'gbk']
		list.pic[528] = ['看书窝', 'http://www.kanshuwo.net/SearchBook.aspx?keyword=%s&t=1', icons.read]
		//
		list.wall = [];
		list.wall[901] = ['经典小说', 'http://zhannei.baidu.com/cse/search?s=6701541839513498430&entry=1&ie=gbk&q=%s', icons.jdxs, 'gbk']
		list.wall[902] = ['侠客中文网', 'http://www.chinalww.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.read, 'gbk']
		list.wall[903] = ['创客小说网', 'http://zhannei.baidu.com/cse/search?s=4740424778134670433&entry=1&ie=gbk&q=%s', icons.ckxsw, 'gbk']
		list.wall[904] = ['启蒙书网', 'http://www.qmshu.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.read, 'gbk']
		list.wall[905] = ['零点看书', 'http://zhannei.baidu.com/cse/search?s=16693824263461694681&entry=1&ie=gbk&q=%s', icons.ldks, 'gbk']
		list.wall[906] = ['第八区小说网', 'http://www.d8qu.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.d8qu, 'gbk']
		list.wall[907] = ['阿木小说网', 'http://www.amxs520.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.amxs520, 'gbk']
		//
		list.down = [];
		list.down[0] = ['掌上书苑_SO', 'https://www.soepub.com/search/index?q=%s', icons.epub]
		list.down[1] = ['掌上书苑_CN', 'https://www.cnepub.com/search/index?q=%s', icons.epub]
		list.down[2] = ['EPUB电子书', 's?wd=site%3A2epub.net %s', icons.epub2]
		list.down[101] = ['无限小说网', 'http://www.55x.cn/plus/search.php?keyword=%s', icons.wxxs, 'gbk']
		list.down[102] = ['吾读小说网', 'http://txt96.com/js.php?mod=bbscms&name=searchsubmit&srchperpage=10&keywords=%s', icons.wdxsw, 'gbk']
		list.down[103] = ['炫书网', 'http://zhannei.baidu.com/cse/search?s=7901221294801558283&entry=1&ie=gbk&q=%s', icons.bltxt, 'gbk']
		list.down[104] = ['枯木书吧', 'http://www.5xiaoshuo.cn/search.asp?m=0&s=0&word=%s', icons.kmsb, 'gbk']
		list.down[105] = ['八零电子书', 'http://zhannei.baidu.com/cse/search?s=18140131260432570322&ie=gbk&q=%s', icons.bltxt, 'gbk']
		list.down[106] = ['77119.com', 'http://www.77119.com/plus/search.php?kwtype=0&q=%s&searchtype=title', icons.qq119, 'gbk']
		list.down[107] = ['九书网', 'http://www.blbb.net/search.asp?field=%2Fsoft%2Fsearch.asp%3Fact%3DTopic%26keyword%3D&word=%s&m=0&s=0&x=0&y=0', icons.blbb, 'gbk']
		list.down[108] = ['TXT图书下载网', 'http://www.bookdown.com.cn/so.asp?word=%s&Submit=%CB%D1%CB%F7', icons.bookdown, 'gbk']
		list.down[109] = ['爱奇电子书', 'http://zhannei.baidu.com/cse/search?s=10451211623672151543&entry=1&q=%s', icons.aqdzs, 'gbk']
		list.down[110] = ['爱电子书吧', 'http://zhannei.baidu.com/cse/search?s=3884114368004044966&entry=1&ie=gbk&q=%s', icons.bltxt, 'gbk']
		list.down[111] = ['奇书网', 'http://zhannei.baidu.com/cse/search?s=2672242722776283010&q=%s', icons.bltxt, 'gbk']
		list.down[112] = ['TXT小说下载网', 'http://www.sjtxt.com/soft/search.asp?keyword=%s&searchbutton.x=0&searchbutton.y=0', icons.bltxt, 'gbk']
		list.down[113] = ['【未完成】落吧书屋', 'http://www.luo8.com/e/search/index.php?keyboard=%s&tbname=download&tempid=1&show=title&Submit=%CB%D1+%CB%F7', icons.bltxt, 'gbk']
		list.down[114] = ['书香电子书', 'http://www.sxcnw.net/Search.asp?keyword=%s&Field=SoftName&Submit=+%CB%D1%CB%F7+', icons.sxcnw, 'gbk']
		list.down[115] = ['半亩方塘', 'http://www.tusuu.com/search.asp?m=0&s=0&word=%s&button=%CB%D1+%CB%F7', icons.tusuu, 'gbk']
		list.down[116] = ['txt小说下载吧', 'http://zhannei.baidu.com/cse/search?s=5150643138343245245&entry=1&ie=gbk&q=%s', icons.txt8, 'gbk']
		list.down[117] = ['66TXT', 'http://www.txt66.com/search.html?type=0&keyword=%s', icons.llzy, 'gbk']
		list.down[118] = ['久久小说', 'http://www.txt99.cc/modules/article/search.php?searchtype=complex&searchkey=%s', icons.jjxs, 'gbk']
		list.down[119] = ['TXT小说下载', 'http://www.txtbook.com.cn/search.aspx?keyword=%s', icons.bltxt]
		list.down[120] = ['奇书电子书', 'http://www.qisbook.com/search.asp?word=%s', icons.bltxt, 'gbk']
		//
		list.hwen = [];
		list.hwen[0] = ['辣文小说网', 'http://www.lawen2.org/search.php?keyword=%s', icons.hwen, 'gbk']
		list.hwen[101] = ['腐书网', 'http://www.fushuw.com/modules/article/search.php?searchtype=complex&searchkey=%s', icons.fushuw, 'gbk']
		list.hwen[102] = ['内兄小说网', 'http://www.ineixiong.com/modules/article/search.php?searchtype=complex&searchkey=%s', icons.ineixiong, 'gbk']
		list.hwen[103] = ['林木中文网', 'http://www.lysw.net/modules/article/search.php?searchtype=complex&searchkey=%s', icons.lysw, 'gbk']
		//
		list.bbs = [];
		list.bbs[1] = ['百度贴吧', 'http://tieba.baidu.com/f?kw=%s', icons.baidu]
		list.bbs[2] = ['糯米TXT论坛', 'http://www.nmtxt.com/search1.php?formhash=183c9f90&s=14329375113185656330&ie=gbk&q=&ascdesc=DESC&orderby=lastpost&srchfrom=0&srchfilter=all&st=on&srchtxt=%s&srchtype=title&searchsubmit=true&st=on&srchfilter=all&srchfrom=0&before=&orderby=&ascdesc=desc&srchfid%5B%5D=all', icons.nmtxt, 'gbk']
		
		//
		list.girl = [];
		list.girl[0] = ['扫文小院', 'http://saowen.net/novels/search?q=%s', icons.saowen]
		list.girl[1] = ['起点女生网', 'http://sosu.qidian.com/searchresult.aspx?keyword=%s&internalsiteid=0&siteDiv=qdmm', icons.qdmm]
		list.girl[2] = ['【未完成】创别书城', 'http://www.chuangbie.com/index/search.html?search=%s', icons.chuangbie]
		list.girl[3] = ['晋江文学城', 'http://www.jjwxc.net/search.php?kw=%C4%E3%BA%C3&t=1&submit=%s', icons.jjwxc]
		list.girl[4] = ['潇湘书院', 'http://www.xxsy.net/search.html?s_wd=%s', icons.xxsy]
		list.girl[5] = ['女生小说网', 'http://zhannei.baidu.com/cse/search?s=10566322098603426769&entry=1&ie=gbk&q=%s', icons.nsnovel, 'gbk']
		list.girl[6] = ['小说阅读网', 'http://s.readnovel.com/web/search.php?keywords=%s&no_sieve=1&pvidfrom=R.SmKiAyt1.VwjDLBdyAXA&pd=1&fl=&c=&tag=', icons.readnovel, 'gbk']
		list.girl[7] = ['红袖添香', 'http://s.hongxiu.com/searchresult.aspx?iftitle=1&query=%s', icons.hongxiu, 'gbk']
		list.girl[8] = ['17K女生网', 'http://search.17k.com/search.xhtml?c.st=0&c.q=%s', icons.k17]
		list.girl[9] = ['花语女生网', 'http://search.zongheng.com/search/all/%s/1.html', icons.mmzh]
		list.girl[10] = ['云起书院', 'http://yunqi.qq.com/search/searchindex/type/all/wd/%s.html', icons.yunqi]
		list.girl[11] = ['红薯小说网', 'http://www.hongshu.com/search_new.php?q=%s&p=&sx=nv', icons.hongshu]
		list.girl[12] = ['陌上香坊小说网', 'http://so.msxf.net/book/search/?t=all&q=%s', icons.msxf]
		list.girl[13] = ['华夏天空小说网', 'http://www.hxtk.com/book/search.aspx?schtype=0&searchtxts=%s', icons.hxtk]
		list.girl[14] = ['言情小说吧', 'http://zhannei.baidu.com/cse/search?s=13602090313724893225&entry=1&q=%s', icons.yqxs8, 'gbk']
		list.girl[101] = ['女主玄幻小说', 'http://www.xuanhuanlou.com/modules/article/search.php?searchtype=articlename&searchkey=%s&Submit=+%CB%D1+%CB%F7+', icons.du7, 'gbk']
		list.girl[102] = ['言情小说网', 'http://www.yanqing.cc/search.php?q=%s', icons.yanqing]
		list.girl[103] = ['123言情', 'http://zhannei.baidu.com/cse/search?s=15821326931043620863+&q=%s', icons.yq123, 'gbk']
		list.girl[104] = ['求书网', 'http://www.woqiushu.com/?cat=c_list&smode=search&searchkey=%s', icons.woqiushu, 'gbk']
		//
		list.temp = [];
		//
		list.bad = [];
		list.bad[210] = ['风云', 'http://www.baoliny.com/modules/article/search.php?searchkey=%s&searchtype=complex', icons.fyxs, 'gbk']
		list.bad[222] = ['吞噬小说网', 'http://zhannei.baidu.com/cse/search?s=1650848712949868763&q=%s', icons.read, 'gbk']
		//控制列表的体细节
		//list.details[排序(从小到大,小于0不显示相应列表)]=['显示在网页上的名字',列表名称(别改这个),列表数组(也别改)]
		list.details = [];
		list.details[0] = ['★小说', 'web', list.web];
		list.details[1] = ['★轻小说', 'qxs', list.qxs];
		list.details[2] = ['★在线', 'ol', list.ol];
		list.details[3] = ['★首发', 'vip', list.vip];
		list.details[4] = ['★榜单', 'top', list.top];
		list.details[5] = ['★完美', 'per', list.per];
		list.details[6] = ['★全本', 'end', list.end];
		list.details[7] = ['★未测试', 'new', list.new]
		list.details[-8] = ['★有图', 'pic', list.pic];
		list.details[-9] = ['★有墙', 'wall', list.wall];
		list.details[-10] = ['★下载', 'down', list.down];
		list.details[11] = ['★H文', 'hwen', list.hwen];
		list.details[-12] = ['★论坛', 'bbs', list.bbs];
		list.details[13] = ['★女生', 'girl', list.girl];
		list.details[14] = ['★暂时', 'temp', list.temp];
		list.details[-15] = ['★坑', 'bad', list.bad];
		//-----------------
		//utf8转 常用汉字(gbk)
		function toGBK(str) {
			var map = { //编码对照 unicode(10进制) : gb2312(16进制) 
				12288: 'A1A1',12289: 'A1A2',12290: 'A1A3',183: 'A1A4',713: 'A1A5',711: 'A1A6',168: 'A1A7',12291: 'A1A8',12293: 'A1A9',8212: 'A1AA',65374: 'A1AB',8214: 'A1AC',8230: 'A1AD',8216: 'A1AE',8217: 'A1AF',8220: 'A1B0',8221: 'A1B1',12308: 'A1B2',12309: 'A1B3',12296: 'A1B4',12297: 'A1B5',12298: 'A1B6',12299: 'A1B7',12300: 'A1B8',12301: 'A1B9',12302: 'A1BA',12303: 'A1BB',12310: 'A1BC',12311: 'A1BD',12304: 'A1BE',12305: 'A1BF',177: 'A1C0',215: 'A1C1',247: 'A1C2',8758: 'A1C3',8743: 'A1C4',8744: 'A1C5',8721: 'A1C6',8719: 'A1C7',8746: 'A1C8',8745: 'A1C9',8712: 'A1CA',8759: 'A1CB',8730: 'A1CC',8869: 'A1CD',8741: 'A1CE',8736: 'A1CF',8978: 'A1D0',8857: 'A1D1',8747: 'A1D2',8750: 'A1D3',8801: 'A1D4',8780: 'A1D5',8776: 'A1D6',8765: 'A1D7',8733: 'A1D8',8800: 'A1D9',8814: 'A1DA',8815: 'A1DB',8804: 'A1DC',8805: 'A1DD',8734: 'A1DE',8757: 'A1DF',8756: 'A1E0',9794: 'A1E1',9792: 'A1E2',176: 'A1E3',8242: 'A1E4',8243: 'A1E5',8451: 'A1E6',65284: 'A1E7',164: 'A1E8',65504: 'A1E9',65505: 'A1EA',8240: 'A1EB',167: 'A1EC',8470: 'A1ED',9734: 'A1EE',9733: 'A1EF',9675: 'A1F0',9679: 'A1F1',9678: 'A1F2',9671: 'A1F3',9670: 'A1F4',9633: 'A1F5',9632: 'A1F6',9651: 'A1F7',9650: 'A1F8',8251: 'A1F9',8594: 'A1FA',8592: 'A1FB',8593: 'A1FC',8595: 'A1FD',12307: 'A1FE',8560: 'A2A1',8561: 'A2A2',8562: 'A2A3',8563: 'A2A4',8564: 'A2A5',8565: 'A2A6',8566: 'A2A7',8567: 'A2A8',8568: 'A2A9',8569: 'A2AA',9352: 'A2B1',9353: 'A2B2',9354: 'A2B3',9355: 'A2B4',9356: 'A2B5',9357: 'A2B6',9358: 'A2B7',9359: 'A2B8',9360: 'A2B9',9361: 'A2BA',9362: 'A2BB',9363: 'A2BC',9364: 'A2BD',9365: 'A2BE',9366: 'A2BF',9367: 'A2C0',9368: 'A2C1',9369: 'A2C2',9370: 'A2C3',9371: 'A2C4',9332: 'A2C5',9333: 'A2C6',9334: 'A2C7',9335: 'A2C8',9336: 'A2C9',9337: 'A2CA',9338: 'A2CB',9339: 'A2CC',9340: 'A2CD',9341: 'A2CE',9342: 'A2CF',9343: 'A2D0',9344: 'A2D1',9345: 'A2D2',9346: 'A2D3',9347: 'A2D4',9348: 'A2D5',9349: 'A2D6',9350: 'A2D7',9351: 'A2D8',9312: 'A2D9',9313: 'A2DA',9314: 'A2DB',9315: 'A2DC',9316: 'A2DD',9317: 'A2DE',9318: 'A2DF',9319: 'A2E0',9320: 'A2E1',9321: 'A2E2',12832: 'A2E5',12833: 'A2E6',12834: 'A2E7',12835: 'A2E8',12836: 'A2E9',12837: 'A2EA',12838: 'A2EB',12839: 'A2EC',12840: 'A2ED',12841: 'A2EE',8544: 'A2F1',8545: 'A2F2',8546: 'A2F3',8547: 'A2F4',8548: 'A2F5',8549: 'A2F6',8550: 'A2F7',8551: 'A2F8',8552: 'A2F9',8553: 'A2FA',8554: 'A2FB',8555: 'A2FC',65281: 'A3A1',65282: 'A3A2',65283: 'A3A3',65509: 'A3A4',65285: 'A3A5',65286: 'A3A6',65287: 'A3A7',65288: 'A3A8',65289: 'A3A9',65290: 'A3AA',65291: 'A3AB',65292: 'A3AC',65293: 'A3AD',65294: 'A3AE',65295: 'A3AF',65296: 'A3B0',65297: 'A3B1',65298: 'A3B2',65299: 'A3B3',65300: 'A3B4',65301: 'A3B5',65302: 'A3B6',65303: 'A3B7',65304: 'A3B8',65305: 'A3B9',65306: 'A3BA',65307: 'A3BB',65308: 'A3BC',65309: 'A3BD',65310: 'A3BE',65311: 'A3BF',65312: 'A3C0',65313: 'A3C1',65314: 'A3C2',65315: 'A3C3',65316: 'A3C4',65317: 'A3C5',65318: 'A3C6',65319: 'A3C7',65320: 'A3C8',65321: 'A3C9',65322: 'A3CA',65323: 'A3CB',65324: 'A3CC',65325: 'A3CD',65326: 'A3CE',65327: 'A3CF',65328: 'A3D0',65329: 'A3D1',65330: 'A3D2',65331: 'A3D3',65332: 'A3D4',65333: 'A3D5',65334: 'A3D6',65335: 'A3D7',65336: 'A3D8',65337: 'A3D9',65338: 'A3DA',65339: 'A3DB',65340: 'A3DC',65341: 'A3DD',65342: 'A3DE',65343: 'A3DF',65344: 'A3E0',65345: 'A3E1',65346: 'A3E2',65347: 'A3E3',65348: 'A3E4',65349: 'A3E5',65350: 'A3E6',65351: 'A3E7',65352: 'A3E8',65353: 'A3E9',65354: 'A3EA',65355: 'A3EB',65356: 'A3EC',65357: 'A3ED',65358: 'A3EE',65359: 'A3EF',65360: 'A3F0',65361: 'A3F1',65362: 'A3F2',65363: 'A3F3',65364: 'A3F4',65365: 'A3F5',65366: 'A3F6',65367: 'A3F7',65368: 'A3F8',65369: 'A3F9',65370: 'A3FA',65371: 'A3FB',65372: 'A3FC',65373: 'A3FD',65507: 'A3FE',12353: 'A4A1',12354: 'A4A2',12355: 'A4A3',12356: 'A4A4',12357: 'A4A5',12358: 'A4A6',12359: 'A4A7',12360: 'A4A8',12361: 'A4A9',12362: 'A4AA',12363: 'A4AB',12364: 'A4AC',12365: 'A4AD',12366: 'A4AE',12367: 'A4AF',12368: 'A4B0',12369: 'A4B1',12370: 'A4B2',12371: 'A4B3',12372: 'A4B4',12373: 'A4B5',12374: 'A4B6',12375: 'A4B7',12376: 'A4B8',12377: 'A4B9',12378: 'A4BA',12379: 'A4BB',12380: 'A4BC',12381: 'A4BD',12382: 'A4BE',12383: 'A4BF',12384: 'A4C0',12385: 'A4C1',12386: 'A4C2',12387: 'A4C3',12388: 'A4C4',12389: 'A4C5',12390: 'A4C6',12391: 'A4C7',12392: 'A4C8',12393: 'A4C9',12394: 'A4CA',12395: 'A4CB',12396: 'A4CC',12397: 'A4CD',12398: 'A4CE',12399: 'A4CF',12400: 'A4D0',12401: 'A4D1',12402: 'A4D2',12403: 'A4D3',12404: 'A4D4',12405: 'A4D5',12406: 'A4D6',12407: 'A4D7',12408: 'A4D8',12409: 'A4D9',12410: 'A4DA',12411: 'A4DB',12412: 'A4DC',12413: 'A4DD',12414: 'A4DE',12415: 'A4DF',12416: 'A4E0',12417: 'A4E1',12418: 'A4E2',12419: 'A4E3',12420: 'A4E4',12421: 'A4E5',12422: 'A4E6',12423: 'A4E7',12424: 'A4E8',12425: 'A4E9',12426: 'A4EA',12427: 'A4EB',12428: 'A4EC',12429: 'A4ED',12430: 'A4EE',12431: 'A4EF',12432: 'A4F0',12433: 'A4F1',12434: 'A4F2',12435: 'A4F3',12449: 'A5A1',12450: 'A5A2',12451: 'A5A3',12452: 'A5A4',12453: 'A5A5',12454: 'A5A6',12455: 'A5A7',12456: 'A5A8',12457: 'A5A9',12458: 'A5AA',12459: 'A5AB',12460: 'A5AC',12461: 'A5AD',12462: 'A5AE',12463: 'A5AF',12464: 'A5B0',12465: 'A5B1',12466: 'A5B2',12467: 'A5B3',12468: 'A5B4',12469: 'A5B5',12470: 'A5B6',12471: 'A5B7',12472: 'A5B8',12473: 'A5B9',12474: 'A5BA',12475: 'A5BB',12476: 'A5BC',12477: 'A5BD',12478: 'A5BE',12479: 'A5BF',12480: 'A5C0',12481: 'A5C1',12482: 'A5C2',12483: 'A5C3',12484: 'A5C4',12485: 'A5C5',12486: 'A5C6',12487: 'A5C7',12488: 'A5C8',12489: 'A5C9',12490: 'A5CA',12491: 'A5CB',12492: 'A5CC',12493: 'A5CD',12494: 'A5CE',12495: 'A5CF',12496: 'A5D0',12497: 'A5D1',12498: 'A5D2',12499: 'A5D3',12500: 'A5D4',12501: 'A5D5',12502: 'A5D6',12503: 'A5D7',12504: 'A5D8',12505: 'A5D9',12506: 'A5DA',12507: 'A5DB',12508: 'A5DC',12509: 'A5DD',12510: 'A5DE',12511: 'A5DF',12512: 'A5E0',12513: 'A5E1',12514: 'A5E2',12515: 'A5E3',12516: 'A5E4',12517: 'A5E5',12518: 'A5E6',12519: 'A5E7',12520: 'A5E8',12521: 'A5E9',12522: 'A5EA',12523: 'A5EB',12524: 'A5EC',12525: 'A5ED',12526: 'A5EE',12527: 'A5EF',12528: 'A5F0',12529: 'A5F1',12530: 'A5F2',12531: 'A5F3',12532: 'A5F4',12533: 'A5F5',12534: 'A5F6',913: 'A6A1',914: 'A6A2',915: 'A6A3',916: 'A6A4',917: 'A6A5',918: 'A6A6',919: 'A6A7',920: 'A6A8',921: 'A6A9',922: 'A6AA',923: 'A6AB',924: 'A6AC',925: 'A6AD',926: 'A6AE',927: 'A6AF',928: 'A6B0',929: 'A6B1',931: 'A6B2',932: 'A6B3',933: 'A6B4',934: 'A6B5',935: 'A6B6',936: 'A6B7',937: 'A6B8',945: 'A6C1',946: 'A6C2',947: 'A6C3',948: 'A6C4',949: 'A6C5',950: 'A6C6',951: 'A6C7',952: 'A6C8',953: 'A6C9',954: 'A6CA',955: 'A6CB',956: 'A6CC',957: 'A6CD',958: 'A6CE',959: 'A6CF',960: 'A6D0',961: 'A6D1',963: 'A6D2',964: 'A6D3',965: 'A6D4',966: 'A6D5',967: 'A6D6',968: 'A6D7',969: 'A6D8',65077: 'A6E0',65078: 'A6E1',65081: 'A6E2',65082: 'A6E3',65087: 'A6E4',65088: 'A6E5',65085: 'A6E6',65086: 'A6E7',65089: 'A6E8',65090: 'A6E9',65091: 'A6EA',65092: 'A6EB',65083: 'A6EE',65084: 'A6EF',65079: 'A6F0',65080: 'A6F1',65073: 'A6F2',65075: 'A6F4',65076: 'A6F5',1040: 'A7A1',1041: 'A7A2',1042: 'A7A3',1043: 'A7A4',1044: 'A7A5',1045: 'A7A6',1025: 'A7A7',1046: 'A7A8',1047: 'A7A9',1048: 'A7AA',1049: 'A7AB',1050: 'A7AC',1051: 'A7AD',1052: 'A7AE',1053: 'A7AF',1054: 'A7B0',1055: 'A7B1',1056: 'A7B2',1057: 'A7B3',1058: 'A7B4',1059: 'A7B5',1060: 'A7B6',1061: 'A7B7',1062: 'A7B8',1063: 'A7B9',1064: 'A7BA',1065: 'A7BB',1066: 'A7BC',1067: 'A7BD',1068: 'A7BE',1069: 'A7BF',1070: 'A7C0',1071: 'A7C1',1072: 'A7D1',1073: 'A7D2',1074: 'A7D3',1075: 'A7D4',1076: 'A7D5',1077: 'A7D6',1105: 'A7D7',1078: 'A7D8',1079: 'A7D9',1080: 'A7DA',1081: 'A7DB',1082: 'A7DC',1083: 'A7DD',1084: 'A7DE',1085: 'A7DF',1086: 'A7E0',1087: 'A7E1',1088: 'A7E2',1089: 'A7E3',1090: 'A7E4',1091: 'A7E5',1092: 'A7E6',1093: 'A7E7',1094: 'A7E8',1095: 'A7E9',1096: 'A7EA',1097: 'A7EB',1098: 'A7EC',1099: 'A7ED',1100: 'A7EE',1101: 'A7EF',1102: 'A7F0',1103: 'A7F1',257: 'A8A1',225: 'A8A2',462: 'A8A3',224: 'A8A4',275: 'A8A5',233: 'A8A6',283: 'A8A7',232: 'A8A8',299: 'A8A9',237: 'A8AA',464: 'A8AB',236: 'A8AC',333: 'A8AD',243: 'A8AE',466: 'A8AF',242: 'A8B0',363: 'A8B1',250: 'A8B2',468: 'A8B3',249: 'A8B4',470: 'A8B5',472: 'A8B6',474: 'A8B7',476: 'A8B8',252: 'A8B9',234: 'A8BA',593: 'A8BB',324: 'A8BD',328: 'A8BE',609: 'A8C0',12549: 'A8C5',12550: 'A8C6',12551: 'A8C7',12552: 'A8C8',12553: 'A8C9',12554: 'A8CA',12555: 'A8CB',12556: 'A8CC',12557: 'A8CD',12558: 'A8CE',12559: 'A8CF',12560: 'A8D0',12561: 'A8D1',12562: 'A8D2',12563: 'A8D3',12564: 'A8D4',12565: 'A8D5',12566: 'A8D6',12567: 'A8D7',12568: 'A8D8',12569: 'A8D9',12570: 'A8DA',12571: 'A8DB',12572: 'A8DC',12573: 'A8DD',12574: 'A8DE',12575: 'A8DF',12576: 'A8E0',12577: 'A8E1',12578: 'A8E2',12579: 'A8E3',12580: 'A8E4',12581: 'A8E5',12582: 'A8E6',12583: 'A8E7',12584: 'A8E8',12585: 'A8E9',9472: 'A9A4',9473: 'A9A5',9474: 'A9A6',9475: 'A9A7',9476: 'A9A8',9477: 'A9A9',9478: 'A9AA',9479: 'A9AB',9480: 'A9AC',9481: 'A9AD',9482: 'A9AE',9483: 'A9AF',9484: 'A9B0',9485: 'A9B1',9486: 'A9B2',9487: 'A9B3',9488: 'A9B4',9489: 'A9B5',9490: 'A9B6',9491: 'A9B7',9492: 'A9B8',9493: 'A9B9',9494: 'A9BA',9495: 'A9BB',9496: 'A9BC',9497: 'A9BD',9498: 'A9BE',9499: 'A9BF',9500: 'A9C0',9501: 'A9C1',9502: 'A9C2',9503: 'A9C3',9504: 'A9C4',9505: 'A9C5',9506: 'A9C6',9507: 'A9C7',9508: 'A9C8',9509: 'A9C9',9510: 'A9CA',9511: 'A9CB',9512: 'A9CC',9513: 'A9CD',9514: 'A9CE',9515: 'A9CF',9516: 'A9D0',9517: 'A9D1',9518: 'A9D2',9519: 'A9D3',9520: 'A9D4',9521: 'A9D5',9522: 'A9D6',9523: 'A9D7',9524: 'A9D8',9525: 'A9D9',9526: 'A9DA',9527: 'A9DB',9528: 'A9DC',9529: 'A9DD',9530: 'A9DE',9531: 'A9DF',9532: 'A9E0',9533: 'A9E1',9534: 'A9E2',9535: 'A9E3',9536: 'A9E4',9537: 'A9E5',9538: 'A9E6',9539: 'A9E7',9540: 'A9E8',9541: 'A9E9',9542: 'A9EA',9543: 'A9EB',9544: 'A9EC',9545: 'A9ED',9546: 'A9EE',9547: 'A9EF',30403: 'B0A0',21834: 'B0A1',38463: 'B0A2',22467: 'B0A3',25384: 'B0A4',21710: 'B0A5',21769: 'B0A6',21696: 'B0A7',30353: 'B0A8',30284: 'B0A9',34108: 'B0AA',30702: 'B0AB',33406: 'B0AC',30861: 'B0AD',29233: 'B0AE',38552: 'B0AF',38797: 'B0B0',27688: 'B0B1',23433: 'B0B2',20474: 'B0B3',25353: 'B0B4',26263: 'B0B5',23736: 'B0B6',33018: 'B0B7',26696: 'B0B8',32942: 'B0B9',26114: 'B0BA',30414: 'B0BB',20985: 'B0BC',25942: 'B0BD',29100: 'B0BE',32753: 'B0BF',34948: 'B0C0',20658: 'B0C1',22885: 'B0C2',25034: 'B0C3',28595: 'B0C4',33453: 'B0C5',25420: 'B0C6',25170: 'B0C7',21485: 'B0C8',21543: 'B0C9',31494: 'B0CA',20843: 'B0CB',30116: 'B0CC',24052: 'B0CD',25300: 'B0CE',36299: 'B0CF',38774: 'B0D0',25226: 'B0D1',32793: 'B0D2',22365: 'B0D3',38712: 'B0D4',32610: 'B0D5',29240: 'B0D6',30333: 'B0D7',26575: 'B0D8',30334: 'B0D9',25670: 'B0DA',20336: 'B0DB',36133: 'B0DC',25308: 'B0DD',31255: 'B0DE',26001: 'B0DF',29677: 'B0E0',25644: 'B0E1',25203: 'B0E2',33324: 'B0E3',39041: 'B0E4',26495: 'B0E5',29256: 'B0E6',25198: 'B0E7',25292: 'B0E8',20276: 'B0E9',29923: 'B0EA',21322: 'B0EB',21150: 'B0EC',32458: 'B0ED',37030: 'B0EE',24110: 'B0EF',26758: 'B0F0',27036: 'B0F1',33152: 'B0F2',32465: 'B0F3',26834: 'B0F4',30917: 'B0F5',34444: 'B0F6',38225: 'B0F7',20621: 'B0F8',35876: 'B0F9',33502: 'B0FA',32990: 'B0FB',21253: 'B0FC',35090: 'B0FD',21093: 'B0FE',34180: 'B1A1',38649: 'B1A2',20445: 'B1A3',22561: 'B1A4',39281: 'B1A5',23453: 'B1A6',25265: 'B1A7',25253: 'B1A8',26292: 'B1A9',35961: 'B1AA',40077: 'B1AB',29190: 'B1AC',26479: 'B1AD',30865: 'B1AE',24754: 'B1AF',21329: 'B1B0',21271: 'B1B1',36744: 'B1B2',32972: 'B1B3',36125: 'B1B4',38049: 'B1B5',20493: 'B1B6',29384: 'B1B7',22791: 'B1B8',24811: 'B1B9',28953: 'B1BA',34987: 'B1BB',22868: 'B1BC',33519: 'B1BD',26412: 'B1BE',31528: 'B1BF',23849: 'B1C0',32503: 'B1C1',29997: 'B1C2',27893: 'B1C3',36454: 'B1C4',36856: 'B1C5',36924: 'B1C6',40763: 'B1C7',27604: 'B1C8',37145: 'B1C9',31508: 'B1CA',24444: 'B1CB',30887: 'B1CC',34006: 'B1CD',34109: 'B1CE',27605: 'B1CF',27609: 'B1D0',27606: 'B1D1',24065: 'B1D2',24199: 'B1D3',30201: 'B1D4',38381: 'B1D5',25949: 'B1D6',24330: 'B1D7',24517: 'B1D8',36767: 'B1D9',22721: 'B1DA',33218: 'B1DB',36991: 'B1DC',38491: 'B1DD',38829: 'B1DE',36793: 'B1DF',32534: 'B1E0',36140: 'B1E1',25153: 'B1E2',20415: 'B1E3',21464: 'B1E4',21342: 'B1E5',36776: 'B1E6',36777: 'B1E7',36779: 'B1E8',36941: 'B1E9',26631: 'B1EA',24426: 'B1EB',33176: 'B1EC',34920: 'B1ED',40150: 'B1EE',24971: 'B1EF',21035: 'B1F0',30250: 'B1F1',24428: 'B1F2',25996: 'B1F3',28626: 'B1F4',28392: 'B1F5',23486: 'B1F6',25672: 'B1F7',20853: 'B1F8',20912: 'B1F9',26564: 'B1FA',19993: 'B1FB',31177: 'B1FC',39292: 'B1FD',28851: 'B1FE',30149: 'B2A1',24182: 'B2A2',29627: 'B2A3',33760: 'B2A4',25773: 'B2A5',25320: 'B2A6',38069: 'B2A7',27874: 'B2A8',21338: 'B2A9',21187: 'B2AA',25615: 'B2AB',38082: 'B2AC',31636: 'B2AD',20271: 'B2AE',24091: 'B2AF',33334: 'B2B0',33046: 'B2B1',33162: 'B2B2',28196: 'B2B3',27850: 'B2B4',39539: 'B2B5',25429: 'B2B6',21340: 'B2B7',21754: 'B2B8',34917: 'B2B9',22496: 'B2BA',19981: 'B2BB',24067: 'B2BC',27493: 'B2BD',31807: 'B2BE',37096: 'B2BF',24598: 'B2C0',25830: 'B2C1',29468: 'B2C2',35009: 'B2C3',26448: 'B2C4',25165: 'B2C5',36130: 'B2C6',30572: 'B2C7',36393: 'B2C8',37319: 'B2C9',24425: 'B2CA',33756: 'B2CB',34081: 'B2CC',39184: 'B2CD',21442: 'B2CE',34453: 'B2CF',27531: 'B2D0',24813: 'B2D1',24808: 'B2D2',28799: 'B2D3',33485: 'B2D4',33329: 'B2D5',20179: 'B2D6',27815: 'B2D7',34255: 'B2D8',25805: 'B2D9',31961: 'B2DA',27133: 'B2DB',26361: 'B2DC',33609: 'B2DD',21397: 'B2DE',31574: 'B2DF',20391: 'B2E0',20876: 'B2E1',27979: 'B2E2',23618: 'B2E3',36461: 'B2E4',25554: 'B2E5',21449: 'B2E6',33580: 'B2E7',33590: 'B2E8',26597: 'B2E9',30900: 'B2EA',25661: 'B2EB',23519: 'B2EC',23700: 'B2ED',24046: 'B2EE',35815: 'B2EF',25286: 'B2F0',26612: 'B2F1',35962: 'B2F2',25600: 'B2F3',25530: 'B2F4',34633: 'B2F5',39307: 'B2F6',35863: 'B2F7',32544: 'B2F8',38130: 'B2F9',20135: 'B2FA',38416: 'B2FB',39076: 'B2FC',26124: 'B2FD',29462: 'B2FE',22330: 'B3A1',23581: 'B3A2',24120: 'B3A3',38271: 'B3A4',20607: 'B3A5',32928: 'B3A6',21378: 'B3A7',25950: 'B3A8',30021: 'B3A9',21809: 'B3AA',20513: 'B3AB',36229: 'B3AC',25220: 'B3AD',38046: 'B3AE',26397: 'B3AF',22066: 'B3B0',28526: 'B3B1',24034: 'B3B2',21557: 'B3B3',28818: 'B3B4',36710: 'B3B5',25199: 'B3B6',25764: 'B3B7',25507: 'B3B8',24443: 'B3B9',28552: 'B3BA',37108: 'B3BB',33251: 'B3BC',36784: 'B3BD',23576: 'B3BE',26216: 'B3BF',24561: 'B3C0',27785: 'B3C1',38472: 'B3C2',36225: 'B3C3',34924: 'B3C4',25745: 'B3C5',31216: 'B3C6',22478: 'B3C7',27225: 'B3C8',25104: 'B3C9',21576: 'B3CA',20056: 'B3CB',31243: 'B3CC',24809: 'B3CD',28548: 'B3CE',35802: 'B3CF',25215: 'B3D0',36894: 'B3D1',39563: 'B3D2',31204: 'B3D3',21507: 'B3D4',30196: 'B3D5',25345: 'B3D6',21273: 'B3D7',27744: 'B3D8',36831: 'B3D9',24347: 'B3DA',39536: 'B3DB',32827: 'B3DC',40831: 'B3DD',20360: 'B3DE',23610: 'B3DF',36196: 'B3E0',32709: 'B3E1',26021: 'B3E2',28861: 'B3E3',20805: 'B3E4',20914: 'B3E5',34411: 'B3E6',23815: 'B3E7',23456: 'B3E8',25277: 'B3E9',37228: 'B3EA',30068: 'B3EB',36364: 'B3EC',31264: 'B3ED',24833: 'B3EE',31609: 'B3EF',20167: 'B3F0',32504: 'B3F1',30597: 'B3F2',19985: 'B3F3',33261: 'B3F4',21021: 'B3F5',20986: 'B3F6',27249: 'B3F7',21416: 'B3F8',36487: 'B3F9',38148: 'B3FA',38607: 'B3FB',28353: 'B3FC',38500: 'B3FD',26970: 'B3FE',30784: 'B4A1',20648: 'B4A2',30679: 'B4A3',25616: 'B4A4',35302: 'B4A5',22788: 'B4A6',25571: 'B4A7',24029: 'B4A8',31359: 'B4A9',26941: 'B4AA',20256: 'B4AB',33337: 'B4AC',21912: 'B4AD',20018: 'B4AE',30126: 'B4AF',31383: 'B4B0',24162: 'B4B1',24202: 'B4B2',38383: 'B4B3',21019: 'B4B4',21561: 'B4B5',28810: 'B4B6',25462: 'B4B7',38180: 'B4B8',22402: 'B4B9',26149: 'B4BA',26943: 'B4BB',37255: 'B4BC',21767: 'B4BD',28147: 'B4BE',32431: 'B4BF',34850: 'B4C0',25139: 'B4C1',32496: 'B4C2',30133: 'B4C3',33576: 'B4C4',30913: 'B4C5',38604: 'B4C6',36766: 'B4C7',24904: 'B4C8',29943: 'B4C9',35789: 'B4CA',27492: 'B4CB',21050: 'B4CC',36176: 'B4CD',27425: 'B4CE',32874: 'B4CF',33905: 'B4D0',22257: 'B4D1',21254: 'B4D2',20174: 'B4D3',19995: 'B4D4',20945: 'B4D5',31895: 'B4D6',37259: 'B4D7',31751: 'B4D8',20419: 'B4D9',36479: 'B4DA',31713: 'B4DB',31388: 'B4DC',25703: 'B4DD',23828: 'B4DE',20652: 'B4DF',33030: 'B4E0',30209: 'B4E1',31929: 'B4E2',28140: 'B4E3',32736: 'B4E4',26449: 'B4E5',23384: 'B4E6',23544: 'B4E7',30923: 'B4E8',25774: 'B4E9',25619: 'B4EA',25514: 'B4EB',25387: 'B4EC',38169: 'B4ED',25645: 'B4EE',36798: 'B4EF',31572: 'B4F0',30249: 'B4F1',25171: 'B4F2',22823: 'B4F3',21574: 'B4F4',27513: 'B4F5',20643: 'B4F6',25140: 'B4F7',24102: 'B4F8',27526: 'B4F9',20195: 'B4FA',36151: 'B4FB',34955: 'B4FC',24453: 'B4FD',36910: 'B4FE',24608: 'B5A1',32829: 'B5A2',25285: 'B5A3',20025: 'B5A4',21333: 'B5A5',37112: 'B5A6',25528: 'B5A7',32966: 'B5A8',26086: 'B5A9',27694: 'B5AA',20294: 'B5AB',24814: 'B5AC',28129: 'B5AD',35806: 'B5AE',24377: 'B5AF',34507: 'B5B0',24403: 'B5B1',25377: 'B5B2',20826: 'B5B3',33633: 'B5B4',26723: 'B5B5',20992: 'B5B6',25443: 'B5B7',36424: 'B5B8',20498: 'B5B9',23707: 'B5BA',31095: 'B5BB',23548: 'B5BC',21040: 'B5BD',31291: 'B5BE',24764: 'B5BF',36947: 'B5C0',30423: 'B5C1',24503: 'B5C2',24471: 'B5C3',30340: 'B5C4',36460: 'B5C5',28783: 'B5C6',30331: 'B5C7',31561: 'B5C8',30634: 'B5C9',20979: 'B5CA',37011: 'B5CB',22564: 'B5CC',20302: 'B5CD',28404: 'B5CE',36842: 'B5CF',25932: 'B5D0',31515: 'B5D1',29380: 'B5D2',28068: 'B5D3',32735: 'B5D4',23265: 'B5D5',25269: 'B5D6',24213: 'B5D7',22320: 'B5D8',33922: 'B5D9',31532: 'B5DA',24093: 'B5DB',24351: 'B5DC',36882: 'B5DD',32532: 'B5DE',39072: 'B5DF',25474: 'B5E0',28359: 'B5E1',30872: 'B5E2',28857: 'B5E3',20856: 'B5E4',38747: 'B5E5',22443: 'B5E6',30005: 'B5E7',20291: 'B5E8',30008: 'B5E9',24215: 'B5EA',24806: 'B5EB',22880: 'B5EC',28096: 'B5ED',27583: 'B5EE',30857: 'B5EF',21500: 'B5F0',38613: 'B5F1',20939: 'B5F2',20993: 'B5F3',25481: 'B5F4',21514: 'B5F5',38035: 'B5F6',35843: 'B5F7',36300: 'B5F8',29241: 'B5F9',30879: 'B5FA',34678: 'B5FB',36845: 'B5FC',35853: 'B5FD',21472: 'B5FE',19969: 'B6A1',30447: 'B6A2',21486: 'B6A3',38025: 'B6A4',39030: 'B6A5',40718: 'B6A6',38189: 'B6A7',23450: 'B6A8',35746: 'B6A9',20002: 'B6AA',19996: 'B6AB',20908: 'B6AC',33891: 'B6AD',25026: 'B6AE',21160: 'B6AF',26635: 'B6B0',20375: 'B6B1',24683: 'B6B2',20923: 'B6B3',27934: 'B6B4',20828: 'B6B5',25238: 'B6B6',26007: 'B6B7',38497: 'B6B8',35910: 'B6B9',36887: 'B6BA',30168: 'B6BB',37117: 'B6BC',30563: 'B6BD',27602: 'B6BE',29322: 'B6BF',29420: 'B6C0',35835: 'B6C1',22581: 'B6C2',30585: 'B6C3',36172: 'B6C4',26460: 'B6C5',38208: 'B6C6',32922: 'B6C7',24230: 'B6C8',28193: 'B6C9',22930: 'B6CA',31471: 'B6CB',30701: 'B6CC',38203: 'B6CD',27573: 'B6CE',26029: 'B6CF',32526: 'B6D0',22534: 'B6D1',20817: 'B6D2',38431: 'B6D3',23545: 'B6D4',22697: 'B6D5',21544: 'B6D6',36466: 'B6D7',25958: 'B6D8',39039: 'B6D9',22244: 'B6DA',38045: 'B6DB',30462: 'B6DC',36929: 'B6DD',25479: 'B6DE',21702: 'B6DF',22810: 'B6E0',22842: 'B6E1',22427: 'B6E2',36530: 'B6E3',26421: 'B6E4',36346: 'B6E5',33333: 'B6E6',21057: 'B6E7',24816: 'B6E8',22549: 'B6E9',34558: 'B6EA',23784: 'B6EB',40517: 'B6EC',20420: 'B6ED',39069: 'B6EE',35769: 'B6EF',23077: 'B6F0',24694: 'B6F1',21380: 'B6F2',25212: 'B6F3',36943: 'B6F4',37122: 'B6F5',39295: 'B6F6',24681: 'B6F7',32780: 'B6F8',20799: 'B6F9',32819: 'B6FA',23572: 'B6FB',39285: 'B6FC',27953: 'B6FD',20108: 'B6FE',36144: 'B7A1',21457: 'B7A2',32602: 'B7A3',31567: 'B7A4',20240: 'B7A5',20047: 'B7A6',38400: 'B7A7',27861: 'B7A8',29648: 'B7A9',34281: 'B7AA',24070: 'B7AB',30058: 'B7AC',32763: 'B7AD',27146: 'B7AE',30718: 'B7AF',38034: 'B7B0',32321: 'B7B1',20961: 'B7B2',28902: 'B7B3',21453: 'B7B4',36820: 'B7B5',33539: 'B7B6',36137: 'B7B7',29359: 'B7B8',39277: 'B7B9',27867: 'B7BA',22346: 'B7BB',33459: 'B7BC',26041: 'B7BD',32938: 'B7BE',25151: 'B7BF',38450: 'B7C0',22952: 'B7C1',20223: 'B7C2',35775: 'B7C3',32442: 'B7C4',25918: 'B7C5',33778: 'B7C6',38750: 'B7C7',21857: 'B7C8',39134: 'B7C9',32933: 'B7CA',21290: 'B7CB',35837: 'B7CC',21536: 'B7CD',32954: 'B7CE',24223: 'B7CF',27832: 'B7D0',36153: 'B7D1',33452: 'B7D2',37210: 'B7D3',21545: 'B7D4',27675: 'B7D5',20998: 'B7D6',32439: 'B7D7',22367: 'B7D8',28954: 'B7D9',27774: 'B7DA',31881: 'B7DB',22859: 'B7DC',20221: 'B7DD',24575: 'B7DE',24868: 'B7DF',31914: 'B7E0',20016: 'B7E1',23553: 'B7E2',26539: 'B7E3',34562: 'B7E4',23792: 'B7E5',38155: 'B7E6',39118: 'B7E7',30127: 'B7E8',28925: 'B7E9',36898: 'B7EA',20911: 'B7EB',32541: 'B7EC',35773: 'B7ED',22857: 'B7EE',20964: 'B7EF',20315: 'B7F0',21542: 'B7F1',22827: 'B7F2',25975: 'B7F3',32932: 'B7F4',23413: 'B7F5',25206: 'B7F6',25282: 'B7F7',36752: 'B7F8',24133: 'B7F9',27679: 'B7FA',31526: 'B7FB',20239: 'B7FC',20440: 'B7FD',26381: 'B7FE',28014: 'B8A1',28074: 'B8A2',31119: 'B8A3',34993: 'B8A4',24343: 'B8A5',29995: 'B8A6',25242: 'B8A7',36741: 'B8A8',20463: 'B8A9',37340: 'B8AA',26023: 'B8AB',33071: 'B8AC',33105: 'B8AD',24220: 'B8AE',33104: 'B8AF',36212: 'B8B0',21103: 'B8B1',35206: 'B8B2',36171: 'B8B3',22797: 'B8B4',20613: 'B8B5',20184: 'B8B6',38428: 'B8B7',29238: 'B8B8',33145: 'B8B9',36127: 'B8BA',23500: 'B8BB',35747: 'B8BC',38468: 'B8BD',22919: 'B8BE',32538: 'B8BF',21648: 'B8C0',22134: 'B8C1',22030: 'B8C2',35813: 'B8C3',25913: 'B8C4',27010: 'B8C5',38041: 'B8C6',30422: 'B8C7',28297: 'B8C8',24178: 'B8C9',29976: 'B8CA',26438: 'B8CB',26577: 'B8CC',31487: 'B8CD',32925: 'B8CE',36214: 'B8CF',24863: 'B8D0',31174: 'B8D1',25954: 'B8D2',36195: 'B8D3',20872: 'B8D4',21018: 'B8D5',38050: 'B8D6',32568: 'B8D7',32923: 'B8D8',32434: 'B8D9',23703: 'B8DA',28207: 'B8DB',26464: 'B8DC',31705: 'B8DD',30347: 'B8DE',39640: 'B8DF',33167: 'B8E0',32660: 'B8E1',31957: 'B8E2',25630: 'B8E3',38224: 'B8E4',31295: 'B8E5',21578: 'B8E6',21733: 'B8E7',27468: 'B8E8',25601: 'B8E9',25096: 'B8EA',40509: 'B8EB',33011: 'B8EC',30105: 'B8ED',21106: 'B8EE',38761: 'B8EF',33883: 'B8F0',26684: 'B8F1',34532: 'B8F2',38401: 'B8F3',38548: 'B8F4',38124: 'B8F5',20010: 'B8F6',21508: 'B8F7',32473: 'B8F8',26681: 'B8F9',36319: 'B8FA',32789: 'B8FB',26356: 'B8FC',24218: 'B8FD',32697: 'B8FE',22466: 'B9A1',32831: 'B9A2',26775: 'B9A3',24037: 'B9A4',25915: 'B9A5',21151: 'B9A6',24685: 'B9A7',40858: 'B9A8',20379: 'B9A9',36524: 'B9AA',20844: 'B9AB',23467: 'B9AC',24339: 'B9AD',24041: 'B9AE',27742: 'B9AF',25329: 'B9B0',36129: 'B9B1',20849: 'B9B2',38057: 'B9B3',21246: 'B9B4',27807: 'B9B5',33503: 'B9B6',29399: 'B9B7',22434: 'B9B8',26500: 'B9B9',36141: 'B9BA',22815: 'B9BB',36764: 'B9BC',33735: 'B9BD',21653: 'B9BE',31629: 'B9BF',20272: 'B9C0',27837: 'B9C1',23396: 'B9C2',22993: 'B9C3',40723: 'B9C4',21476: 'B9C5',34506: 'B9C6',39592: 'B9C7',35895: 'B9C8',32929: 'B9C9',25925: 'B9CA',39038: 'B9CB',22266: 'B9CC',38599: 'B9CD',21038: 'B9CE',29916: 'B9CF',21072: 'B9D0',23521: 'B9D1',25346: 'B9D2',35074: 'B9D3',20054: 'B9D4',25296: 'B9D5',24618: 'B9D6',26874: 'B9D7',20851: 'B9D8',23448: 'B9D9',20896: 'B9DA',35266: 'B9DB',31649: 'B9DC',39302: 'B9DD',32592: 'B9DE',24815: 'B9DF',28748: 'B9E0',36143: 'B9E1',20809: 'B9E2',24191: 'B9E3',36891: 'B9E4',29808: 'B9E5',35268: 'B9E6',22317: 'B9E7',30789: 'B9E8',24402: 'B9E9',40863: 'B9EA',38394: 'B9EB',36712: 'B9EC',39740: 'B9ED',35809: 'B9EE',30328: 'B9EF',26690: 'B9F0',26588: 'B9F1',36330: 'B9F2',36149: 'B9F3',21053: 'B9F4',36746: 'B9F5',28378: 'B9F6',26829: 'B9F7',38149: 'B9F8',37101: 'B9F9',22269: 'B9FA',26524: 'B9FB',35065: 'B9FC',36807: 'B9FD',21704: 'B9FE',39608: 'BAA1',23401: 'BAA2',28023: 'BAA3',27686: 'BAA4',20133: 'BAA5',23475: 'BAA6',39559: 'BAA7',37219: 'BAA8',25000: 'BAA9',37039: 'BAAA',38889: 'BAAB',21547: 'BAAC',28085: 'BAAD',23506: 'BAAE',20989: 'BAAF',21898: 'BAB0',32597: 'BAB1',32752: 'BAB2',25788: 'BAB3',25421: 'BAB4',26097: 'BAB5',25022: 'BAB6',24717: 'BAB7',28938: 'BAB8',27735: 'BAB9',27721: 'BABA',22831: 'BABB',26477: 'BABC',33322: 'BABD',22741: 'BABE',22158: 'BABF',35946: 'BAC0',27627: 'BAC1',37085: 'BAC2',22909: 'BAC3',32791: 'BAC4',21495: 'BAC5',28009: 'BAC6',21621: 'BAC7',21917: 'BAC8',33655: 'BAC9',33743: 'BACA',26680: 'BACB',31166: 'BACC',21644: 'BACD',20309: 'BACE',21512: 'BACF',30418: 'BAD0',35977: 'BAD1',38402: 'BAD2',27827: 'BAD3',28088: 'BAD4',36203: 'BAD5',35088: 'BAD6',40548: 'BAD7',36154: 'BAD8',22079: 'BAD9',40657: 'BADA',30165: 'BADB',24456: 'BADC',29408: 'BADD',24680: 'BADE',21756: 'BADF',20136: 'BAE0',27178: 'BAE1',34913: 'BAE2',24658: 'BAE3',36720: 'BAE4',21700: 'BAE5',28888: 'BAE6',34425: 'BAE7',40511: 'BAE8',27946: 'BAE9',23439: 'BAEA',24344: 'BAEB',32418: 'BAEC',21897: 'BAED',20399: 'BAEE',29492: 'BAEF',21564: 'BAF0',21402: 'BAF1',20505: 'BAF2',21518: 'BAF3',21628: 'BAF4',20046: 'BAF5',24573: 'BAF6',29786: 'BAF7',22774: 'BAF8',33899: 'BAF9',32993: 'BAFA',34676: 'BAFB',29392: 'BAFC',31946: 'BAFD',28246: 'BAFE',24359: 'BBA1',34382: 'BBA2',21804: 'BBA3',25252: 'BBA4',20114: 'BBA5',27818: 'BBA6',25143: 'BBA7',33457: 'BBA8',21719: 'BBA9',21326: 'BBAA',29502: 'BBAB',28369: 'BBAC',30011: 'BBAD',21010: 'BBAE',21270: 'BBAF',35805: 'BBB0',27088: 'BBB1',24458: 'BBB2',24576: 'BBB3',28142: 'BBB4',22351: 'BBB5',27426: 'BBB6',29615: 'BBB7',26707: 'BBB8',36824: 'BBB9',32531: 'BBBA',25442: 'BBBB',24739: 'BBBC',21796: 'BBBD',30186: 'BBBE',35938: 'BBBF',28949: 'BBC0',28067: 'BBC1',23462: 'BBC2',24187: 'BBC3',33618: 'BBC4',24908: 'BBC5',40644: 'BBC6',30970: 'BBC7',34647: 'BBC8',31783: 'BBC9',30343: 'BBCA',20976: 'BBCB',24822: 'BBCC',29004: 'BBCD',26179: 'BBCE',24140: 'BBCF',24653: 'BBD0',35854: 'BBD1',28784: 'BBD2',25381: 'BBD3',36745: 'BBD4',24509: 'BBD5',24674: 'BBD6',34516: 'BBD7',22238: 'BBD8',27585: 'BBD9',24724: 'BBDA',24935: 'BBDB',21321: 'BBDC',24800: 'BBDD',26214: 'BBDE',36159: 'BBDF',31229: 'BBE0',20250: 'BBE1',28905: 'BBE2',27719: 'BBE3',35763: 'BBE4',35826: 'BBE5',32472: 'BBE6',33636: 'BBE7',26127: 'BBE8',23130: 'BBE9',39746: 'BBEA',27985: 'BBEB',28151: 'BBEC',35905: 'BBED',27963: 'BBEE',20249: 'BBEF',28779: 'BBF0',33719: 'BBF1',25110: 'BBF2',24785: 'BBF3',38669: 'BBF4',36135: 'BBF5',31096: 'BBF6',20987: 'BBF7',22334: 'BBF8',22522: 'BBF9',26426: 'BBFA',30072: 'BBFB',31293: 'BBFC',31215: 'BBFD',31637: 'BBFE',32908: 'BCA1',39269: 'BCA2',36857: 'BCA3',28608: 'BCA4',35749: 'BCA5',40481: 'BCA6',23020: 'BCA7',32489: 'BCA8',32521: 'BCA9',21513: 'BCAA',26497: 'BCAB',26840: 'BCAC',36753: 'BCAD',31821: 'BCAE',38598: 'BCAF',21450: 'BCB0',24613: 'BCB1',30142: 'BCB2',27762: 'BCB3',21363: 'BCB4',23241: 'BCB5',32423: 'BCB6',25380: 'BCB7',20960: 'BCB8',33034: 'BCB9',24049: 'BCBA',34015: 'BCBB',25216: 'BCBC',20864: 'BCBD',23395: 'BCBE',20238: 'BCBF',31085: 'BCC0',21058: 'BCC1',24760: 'BCC2',27982: 'BCC3',23492: 'BCC4',23490: 'BCC5',35745: 'BCC6',35760: 'BCC7',26082: 'BCC8',24524: 'BCC9',38469: 'BCCA',22931: 'BCCB',32487: 'BCCC',32426: 'BCCD',22025: 'BCCE',26551: 'BCCF',22841: 'BCD0',20339: 'BCD1',23478: 'BCD2',21152: 'BCD3',33626: 'BCD4',39050: 'BCD5',36158: 'BCD6',30002: 'BCD7',38078: 'BCD8',20551: 'BCD9',31292: 'BCDA',20215: 'BCDB',26550: 'BCDC',39550: 'BCDD',23233: 'BCDE',27516: 'BCDF',30417: 'BCE0',22362: 'BCE1',23574: 'BCE2',31546: 'BCE3',38388: 'BCE4',29006: 'BCE5',20860: 'BCE6',32937: 'BCE7',33392: 'BCE8',22904: 'BCE9',32516: 'BCEA',33575: 'BCEB',26816: 'BCEC',26604: 'BCED',30897: 'BCEE',30839: 'BCEF',25315: 'BCF0',25441: 'BCF1',31616: 'BCF2',20461: 'BCF3',21098: 'BCF4',20943: 'BCF5',33616: 'BCF6',27099: 'BCF7',37492: 'BCF8',36341: 'BCF9',36145: 'BCFA',35265: 'BCFB',38190: 'BCFC',31661: 'BCFD',20214: 'BCFE',20581: 'BDA1',33328: 'BDA2',21073: 'BDA3',39279: 'BDA4',28176: 'BDA5',28293: 'BDA6',28071: 'BDA7',24314: 'BDA8',20725: 'BDA9',23004: 'BDAA',23558: 'BDAB',27974: 'BDAC',27743: 'BDAD',30086: 'BDAE',33931: 'BDAF',26728: 'BDB0',22870: 'BDB1',35762: 'BDB2',21280: 'BDB3',37233: 'BDB4',38477: 'BDB5',34121: 'BDB6',26898: 'BDB7',30977: 'BDB8',28966: 'BDB9',33014: 'BDBA',20132: 'BDBB',37066: 'BDBC',27975: 'BDBD',39556: 'BDBE',23047: 'BDBF',22204: 'BDC0',25605: 'BDC1',38128: 'BDC2',30699: 'BDC3',20389: 'BDC4',33050: 'BDC5',29409: 'BDC6',35282: 'BDC7',39290: 'BDC8',32564: 'BDC9',32478: 'BDCA',21119: 'BDCB',25945: 'BDCC',37237: 'BDCD',36735: 'BDCE',36739: 'BDCF',21483: 'BDD0',31382: 'BDD1',25581: 'BDD2',25509: 'BDD3',30342: 'BDD4',31224: 'BDD5',34903: 'BDD6',38454: 'BDD7',25130: 'BDD8',21163: 'BDD9',33410: 'BDDA',26708: 'BDDB',26480: 'BDDC',25463: 'BDDD',30571: 'BDDE',31469: 'BDDF',27905: 'BDE0',32467: 'BDE1',35299: 'BDE2',22992: 'BDE3',25106: 'BDE4',34249: 'BDE5',33445: 'BDE6',30028: 'BDE7',20511: 'BDE8',20171: 'BDE9',30117: 'BDEA',35819: 'BDEB',23626: 'BDEC',24062: 'BDED',31563: 'BDEE',26020: 'BDEF',37329: 'BDF0',20170: 'BDF1',27941: 'BDF2',35167: 'BDF3',32039: 'BDF4',38182: 'BDF5',20165: 'BDF6',35880: 'BDF7',36827: 'BDF8',38771: 'BDF9',26187: 'BDFA',31105: 'BDFB',36817: 'BDFC',28908: 'BDFD',28024: 'BDFE',23613: 'BEA1',21170: 'BEA2',33606: 'BEA3',20834: 'BEA4',33550: 'BEA5',30555: 'BEA6',26230: 'BEA7',40120: 'BEA8',20140: 'BEA9',24778: 'BEAA',31934: 'BEAB',31923: 'BEAC',32463: 'BEAD',20117: 'BEAE',35686: 'BEAF',26223: 'BEB0',39048: 'BEB1',38745: 'BEB2',22659: 'BEB3',25964: 'BEB4',38236: 'BEB5',24452: 'BEB6',30153: 'BEB7',38742: 'BEB8',31455: 'BEB9',31454: 'BEBA',20928: 'BEBB',28847: 'BEBC',31384: 'BEBD',25578: 'BEBE',31350: 'BEBF',32416: 'BEC0',29590: 'BEC1',38893: 'BEC2',20037: 'BEC3',28792: 'BEC4',20061: 'BEC5',37202: 'BEC6',21417: 'BEC7',25937: 'BEC8',26087: 'BEC9',33276: 'BECA',33285: 'BECB',21646: 'BECC',23601: 'BECD',30106: 'BECE',38816: 'BECF',25304: 'BED0',29401: 'BED1',30141: 'BED2',23621: 'BED3',39545: 'BED4',33738: 'BED5',23616: 'BED6',21632: 'BED7',30697: 'BED8',20030: 'BED9',27822: 'BEDA',32858: 'BEDB',25298: 'BEDC',25454: 'BEDD',24040: 'BEDE',20855: 'BEDF',36317: 'BEE0',36382: 'BEE1',38191: 'BEE2',20465: 'BEE3',21477: 'BEE4',24807: 'BEE5',28844: 'BEE6',21095: 'BEE7',25424: 'BEE8',40515: 'BEE9',23071: 'BEEA',20518: 'BEEB',30519: 'BEEC',21367: 'BEED',32482: 'BEEE',25733: 'BEEF',25899: 'BEF0',25225: 'BEF1',25496: 'BEF2',20500: 'BEF3',29237: 'BEF4',35273: 'BEF5',20915: 'BEF6',35776: 'BEF7',32477: 'BEF8',22343: 'BEF9',33740: 'BEFA',38055: 'BEFB',20891: 'BEFC',21531: 'BEFD',23803: 'BEFE',20426: 'BFA1',31459: 'BFA2',27994: 'BFA3',37089: 'BFA4',39567: 'BFA5',21888: 'BFA6',21654: 'BFA7',21345: 'BFA8',21679: 'BFA9',24320: 'BFAA',25577: 'BFAB',26999: 'BFAC',20975: 'BFAD',24936: 'BFAE',21002: 'BFAF',22570: 'BFB0',21208: 'BFB1',22350: 'BFB2',30733: 'BFB3',30475: 'BFB4',24247: 'BFB5',24951: 'BFB6',31968: 'BFB7',25179: 'BFB8',25239: 'BFB9',20130: 'BFBA',28821: 'BFBB',32771: 'BFBC',25335: 'BFBD',28900: 'BFBE',38752: 'BFBF',22391: 'BFC0',33499: 'BFC1',26607: 'BFC2',26869: 'BFC3',30933: 'BFC4',39063: 'BFC5',31185: 'BFC6',22771: 'BFC7',21683: 'BFC8',21487: 'BFC9',28212: 'BFCA',20811: 'BFCB',21051: 'BFCC',23458: 'BFCD',35838: 'BFCE',32943: 'BFCF',21827: 'BFD0',22438: 'BFD1',24691: 'BFD2',22353: 'BFD3',21549: 'BFD4',31354: 'BFD5',24656: 'BFD6',23380: 'BFD7',25511: 'BFD8',25248: 'BFD9',21475: 'BFDA',25187: 'BFDB',23495: 'BFDC',26543: 'BFDD',21741: 'BFDE',31391: 'BFDF',33510: 'BFE0',37239: 'BFE1',24211: 'BFE2',35044: 'BFE3',22840: 'BFE4',22446: 'BFE5',25358: 'BFE6',36328: 'BFE7',33007: 'BFE8',22359: 'BFE9',31607: 'BFEA',20393: 'BFEB',24555: 'BFEC',23485: 'BFED',27454: 'BFEE',21281: 'BFEF',31568: 'BFF0',29378: 'BFF1',26694: 'BFF2',30719: 'BFF3',30518: 'BFF4',26103: 'BFF5',20917: 'BFF6',20111: 'BFF7',30420: 'BFF8',23743: 'BFF9',31397: 'BFFA',33909: 'BFFB',22862: 'BFFC',39745: 'BFFD',20608: 'BFFE',39304: 'C0A1',24871: 'C0A2',28291: 'C0A3',22372: 'C0A4',26118: 'C0A5',25414: 'C0A6',22256: 'C0A7',25324: 'C0A8',25193: 'C0A9',24275: 'C0AA',38420: 'C0AB',22403: 'C0AC',25289: 'C0AD',21895: 'C0AE',34593: 'C0AF',33098: 'C0B0',36771: 'C0B1',21862: 'C0B2',33713: 'C0B3',26469: 'C0B4',36182: 'C0B5',34013: 'C0B6',23146: 'C0B7',26639: 'C0B8',25318: 'C0B9',31726: 'C0BA',38417: 'C0BB',20848: 'C0BC',28572: 'C0BD',35888: 'C0BE',25597: 'C0BF',35272: 'C0C0',25042: 'C0C1',32518: 'C0C2',28866: 'C0C3',28389: 'C0C4',29701: 'C0C5',27028: 'C0C6',29436: 'C0C7',24266: 'C0C8',37070: 'C0C9',26391: 'C0CA',28010: 'C0CB',25438: 'C0CC',21171: 'C0CD',29282: 'C0CE',32769: 'C0CF',20332: 'C0D0',23013: 'C0D1',37226: 'C0D2',28889: 'C0D3',28061: 'C0D4',21202: 'C0D5',20048: 'C0D6',38647: 'C0D7',38253: 'C0D8',34174: 'C0D9',30922: 'C0DA',32047: 'C0DB',20769: 'C0DC',22418: 'C0DD',25794: 'C0DE',32907: 'C0DF',31867: 'C0E0',27882: 'C0E1',26865: 'C0E2',26974: 'C0E3',20919: 'C0E4',21400: 'C0E5',26792: 'C0E6',29313: 'C0E7',40654: 'C0E8',31729: 'C0E9',29432: 'C0EA',31163: 'C0EB',28435: 'C0EC',29702: 'C0ED',26446: 'C0EE',37324: 'C0EF',40100: 'C0F0',31036: 'C0F1',33673: 'C0F2',33620: 'C0F3',21519: 'C0F4',26647: 'C0F5',20029: 'C0F6',21385: 'C0F7',21169: 'C0F8',30782: 'C0F9',21382: 'C0FA',21033: 'C0FB',20616: 'C0FC',20363: 'C0FD',20432: 'C0FE',30178: 'C1A1',31435: 'C1A2',31890: 'C1A3',27813: 'C1A4',38582: 'C1A5',21147: 'C1A6',29827: 'C1A7',21737: 'C1A8',20457: 'C1A9',32852: 'C1AA',33714: 'C1AB',36830: 'C1AC',38256: 'C1AD',24265: 'C1AE',24604: 'C1AF',28063: 'C1B0',24088: 'C1B1',25947: 'C1B2',33080: 'C1B3',38142: 'C1B4',24651: 'C1B5',28860: 'C1B6',32451: 'C1B7',31918: 'C1B8',20937: 'C1B9',26753: 'C1BA',31921: 'C1BB',33391: 'C1BC',20004: 'C1BD',36742: 'C1BE',37327: 'C1BF',26238: 'C1C0',20142: 'C1C1',35845: 'C1C2',25769: 'C1C3',32842: 'C1C4',20698: 'C1C5',30103: 'C1C6',29134: 'C1C7',23525: 'C1C8',36797: 'C1C9',28518: 'C1CA',20102: 'C1CB',25730: 'C1CC',38243: 'C1CD',24278: 'C1CE',26009: 'C1CF',21015: 'C1D0',35010: 'C1D1',28872: 'C1D2',21155: 'C1D3',29454: 'C1D4',29747: 'C1D5',26519: 'C1D6',30967: 'C1D7',38678: 'C1D8',20020: 'C1D9',37051: 'C1DA',40158: 'C1DB',28107: 'C1DC',20955: 'C1DD',36161: 'C1DE',21533: 'C1DF',25294: 'C1E0',29618: 'C1E1',33777: 'C1E2',38646: 'C1E3',40836: 'C1E4',38083: 'C1E5',20278: 'C1E6',32666: 'C1E7',20940: 'C1E8',28789: 'C1E9',38517: 'C1EA',23725: 'C1EB',39046: 'C1EC',21478: 'C1ED',20196: 'C1EE',28316: 'C1EF',29705: 'C1F0',27060: 'C1F1',30827: 'C1F2',39311: 'C1F3',30041: 'C1F4',21016: 'C1F5',30244: 'C1F6',27969: 'C1F7',26611: 'C1F8',20845: 'C1F9',40857: 'C1FA',32843: 'C1FB',21657: 'C1FC',31548: 'C1FD',31423: 'C1FE',38534: 'C2A1',22404: 'C2A2',25314: 'C2A3',38471: 'C2A4',27004: 'C2A5',23044: 'C2A6',25602: 'C2A7',31699: 'C2A8',28431: 'C2A9',38475: 'C2AA',33446: 'C2AB',21346: 'C2AC',39045: 'C2AD',24208: 'C2AE',28809: 'C2AF',25523: 'C2B0',21348: 'C2B1',34383: 'C2B2',40065: 'C2B3',40595: 'C2B4',30860: 'C2B5',38706: 'C2B6',36335: 'C2B7',36162: 'C2B8',40575: 'C2B9',28510: 'C2BA',31108: 'C2BB',24405: 'C2BC',38470: 'C2BD',25134: 'C2BE',39540: 'C2BF',21525: 'C2C0',38109: 'C2C1',20387: 'C2C2',26053: 'C2C3',23653: 'C2C4',23649: 'C2C5',32533: 'C2C6',34385: 'C2C7',27695: 'C2C8',24459: 'C2C9',29575: 'C2CA',28388: 'C2CB',32511: 'C2CC',23782: 'C2CD',25371: 'C2CE',23402: 'C2CF',28390: 'C2D0',21365: 'C2D1',20081: 'C2D2',25504: 'C2D3',30053: 'C2D4',25249: 'C2D5',36718: 'C2D6',20262: 'C2D7',20177: 'C2D8',27814: 'C2D9',32438: 'C2DA',35770: 'C2DB',33821: 'C2DC',34746: 'C2DD',32599: 'C2DE',36923: 'C2DF',38179: 'C2E0',31657: 'C2E1',39585: 'C2E2',35064: 'C2E3',33853: 'C2E4',27931: 'C2E5',39558: 'C2E6',32476: 'C2E7',22920: 'C2E8',40635: 'C2E9',29595: 'C2EA',30721: 'C2EB',34434: 'C2EC',39532: 'C2ED',39554: 'C2EE',22043: 'C2EF',21527: 'C2F0',22475: 'C2F1',20080: 'C2F2',40614: 'C2F3',21334: 'C2F4',36808: 'C2F5',33033: 'C2F6',30610: 'C2F7',39314: 'C2F8',34542: 'C2F9',28385: 'C2FA',34067: 'C2FB',26364: 'C2FC',24930: 'C2FD',28459: 'C2FE',35881: 'C3A1',33426: 'C3A2',33579: 'C3A3',30450: 'C3A4',27667: 'C3A5',24537: 'C3A6',33725: 'C3A7',29483: 'C3A8',33541: 'C3A9',38170: 'C3AA',27611: 'C3AB',30683: 'C3AC',38086: 'C3AD',21359: 'C3AE',33538: 'C3AF',20882: 'C3B0',24125: 'C3B1',35980: 'C3B2',36152: 'C3B3',20040: 'C3B4',29611: 'C3B5',26522: 'C3B6',26757: 'C3B7',37238: 'C3B8',38665: 'C3B9',29028: 'C3BA',27809: 'C3BB',30473: 'C3BC',23186: 'C3BD',38209: 'C3BE',27599: 'C3BF',32654: 'C3C0',26151: 'C3C1',23504: 'C3C2',22969: 'C3C3',23194: 'C3C4',38376: 'C3C5',38391: 'C3C6',20204: 'C3C7',33804: 'C3C8',33945: 'C3C9',27308: 'C3CA',30431: 'C3CB',38192: 'C3CC',29467: 'C3CD',26790: 'C3CE',23391: 'C3CF',30511: 'C3D0',37274: 'C3D1',38753: 'C3D2',31964: 'C3D3',36855: 'C3D4',35868: 'C3D5',24357: 'C3D6',31859: 'C3D7',31192: 'C3D8',35269: 'C3D9',27852: 'C3DA',34588: 'C3DB',23494: 'C3DC',24130: 'C3DD',26825: 'C3DE',30496: 'C3DF',32501: 'C3E0',20885: 'C3E1',20813: 'C3E2',21193: 'C3E3',23081: 'C3E4',32517: 'C3E5',38754: 'C3E6',33495: 'C3E7',25551: 'C3E8',30596: 'C3E9',34256: 'C3EA',31186: 'C3EB',28218: 'C3EC',24217: 'C3ED',22937: 'C3EE',34065: 'C3EF',28781: 'C3F0',27665: 'C3F1',25279: 'C3F2',30399: 'C3F3',25935: 'C3F4',24751: 'C3F5',38397: 'C3F6',26126: 'C3F7',34719: 'C3F8',40483: 'C3F9',38125: 'C3FA',21517: 'C3FB',21629: 'C3FC',35884: 'C3FD',25720: 'C3FE',25721: 'C4A1',34321: 'C4A2',27169: 'C4A3',33180: 'C4A4',30952: 'C4A5',25705: 'C4A6',39764: 'C4A7',25273: 'C4A8',26411: 'C4A9',33707: 'C4AA',22696: 'C4AB',40664: 'C4AC',27819: 'C4AD',28448: 'C4AE',23518: 'C4AF',38476: 'C4B0',35851: 'C4B1',29279: 'C4B2',26576: 'C4B3',25287: 'C4B4',29281: 'C4B5',20137: 'C4B6',22982: 'C4B7',27597: 'C4B8',22675: 'C4B9',26286: 'C4BA',24149: 'C4BB',21215: 'C4BC',24917: 'C4BD',26408: 'C4BE',30446: 'C4BF',30566: 'C4C0',29287: 'C4C1',31302: 'C4C2',25343: 'C4C3',21738: 'C4C4',21584: 'C4C5',38048: 'C4C6',37027: 'C4C7',23068: 'C4C8',32435: 'C4C9',27670: 'C4CA',20035: 'C4CB',22902: 'C4CC',32784: 'C4CD',22856: 'C4CE',21335: 'C4CF',30007: 'C4D0',38590: 'C4D1',22218: 'C4D2',25376: 'C4D3',33041: 'C4D4',24700: 'C4D5',38393: 'C4D6',28118: 'C4D7',21602: 'C4D8',39297: 'C4D9',20869: 'C4DA',23273: 'C4DB',33021: 'C4DC',22958: 'C4DD',38675: 'C4DE',20522: 'C4DF',27877: 'C4E0',23612: 'C4E1',25311: 'C4E2',20320: 'C4E3',21311: 'C4E4',33147: 'C4E5',36870: 'C4E6',28346: 'C4E7',34091: 'C4E8',25288: 'C4E9',24180: 'C4EA',30910: 'C4EB',25781: 'C4EC',25467: 'C4ED',24565: 'C4EE',23064: 'C4EF',37247: 'C4F0',40479: 'C4F1',23615: 'C4F2',25423: 'C4F3',32834: 'C4F4',23421: 'C4F5',21870: 'C4F6',38218: 'C4F7',38221: 'C4F8',28037: 'C4F9',24744: 'C4FA',26592: 'C4FB',29406: 'C4FC',20957: 'C4FD',23425: 'C4FE',25319: 'C5A1',27870: 'C5A2',29275: 'C5A3',25197: 'C5A4',38062: 'C5A5',32445: 'C5A6',33043: 'C5A7',27987: 'C5A8',20892: 'C5A9',24324: 'C5AA',22900: 'C5AB',21162: 'C5AC',24594: 'C5AD',22899: 'C5AE',26262: 'C5AF',34384: 'C5B0',30111: 'C5B1',25386: 'C5B2',25062: 'C5B3',31983: 'C5B4',35834: 'C5B5',21734: 'C5B6',27431: 'C5B7',40485: 'C5B8',27572: 'C5B9',34261: 'C5BA',21589: 'C5BB',20598: 'C5BC',27812: 'C5BD',21866: 'C5BE',36276: 'C5BF',29228: 'C5C0',24085: 'C5C1',24597: 'C5C2',29750: 'C5C3',25293: 'C5C4',25490: 'C5C5',29260: 'C5C6',24472: 'C5C7',28227: 'C5C8',27966: 'C5C9',25856: 'C5CA',28504: 'C5CB',30424: 'C5CC',30928: 'C5CD',30460: 'C5CE',30036: 'C5CF',21028: 'C5D0',21467: 'C5D1',20051: 'C5D2',24222: 'C5D3',26049: 'C5D4',32810: 'C5D5',32982: 'C5D6',25243: 'C5D7',21638: 'C5D8',21032: 'C5D9',28846: 'C5DA',34957: 'C5DB',36305: 'C5DC',27873: 'C5DD',21624: 'C5DE',32986: 'C5DF',22521: 'C5E0',35060: 'C5E1',36180: 'C5E2',38506: 'C5E3',37197: 'C5E4',20329: 'C5E5',27803: 'C5E6',21943: 'C5E7',30406: 'C5E8',30768: 'C5E9',25256: 'C5EA',28921: 'C5EB',28558: 'C5EC',24429: 'C5ED',34028: 'C5EE',26842: 'C5EF',30844: 'C5F0',31735: 'C5F1',33192: 'C5F2',26379: 'C5F3',40527: 'C5F4',25447: 'C5F5',30896: 'C5F6',22383: 'C5F7',30738: 'C5F8',38713: 'C5F9',25209: 'C5FA',25259: 'C5FB',21128: 'C5FC',29749: 'C5FD',27607: 'C5FE',21860: 'C6A1',33086: 'C6A2',30130: 'C6A3',30382: 'C6A4',21305: 'C6A5',30174: 'C6A6',20731: 'C6A7',23617: 'C6A8',35692: 'C6A9',31687: 'C6AA',20559: 'C6AB',29255: 'C6AC',39575: 'C6AD',39128: 'C6AE',28418: 'C6AF',29922: 'C6B0',31080: 'C6B1',25735: 'C6B2',30629: 'C6B3',25340: 'C6B4',39057: 'C6B5',36139: 'C6B6',21697: 'C6B7',32856: 'C6B8',20050: 'C6B9',22378: 'C6BA',33529: 'C6BB',33805: 'C6BC',24179: 'C6BD',20973: 'C6BE',29942: 'C6BF',35780: 'C6C0',23631: 'C6C1',22369: 'C6C2',27900: 'C6C3',39047: 'C6C4',23110: 'C6C5',30772: 'C6C6',39748: 'C6C7',36843: 'C6C8',31893: 'C6C9',21078: 'C6CA',25169: 'C6CB',38138: 'C6CC',20166: 'C6CD',33670: 'C6CE',33889: 'C6CF',33769: 'C6D0',33970: 'C6D1',22484: 'C6D2',26420: 'C6D3',22275: 'C6D4',26222: 'C6D5',28006: 'C6D6',35889: 'C6D7',26333: 'C6D8',28689: 'C6D9',26399: 'C6DA',27450: 'C6DB',26646: 'C6DC',25114: 'C6DD',22971: 'C6DE',19971: 'C6DF',20932: 'C6E0',28422: 'C6E1',26578: 'C6E2',27791: 'C6E3',20854: 'C6E4',26827: 'C6E5',22855: 'C6E6',27495: 'C6E7',30054: 'C6E8',23822: 'C6E9',33040: 'C6EA',40784: 'C6EB',26071: 'C6EC',31048: 'C6ED',31041: 'C6EE',39569: 'C6EF',36215: 'C6F0',23682: 'C6F1',20062: 'C6F2',20225: 'C6F3',21551: 'C6F4',22865: 'C6F5',30732: 'C6F6',22120: 'C6F7',27668: 'C6F8',36804: 'C6F9',24323: 'C6FA',27773: 'C6FB',27875: 'C6FC',35755: 'C6FD',25488: 'C6FE',24688: 'C7A1',27965: 'C7A2',29301: 'C7A3',25190: 'C7A4',38030: 'C7A5',38085: 'C7A6',21315: 'C7A7',36801: 'C7A8',31614: 'C7A9',20191: 'C7AA',35878: 'C7AB',20094: 'C7AC',40660: 'C7AD',38065: 'C7AE',38067: 'C7AF',21069: 'C7B0',28508: 'C7B1',36963: 'C7B2',27973: 'C7B3',35892: 'C7B4',22545: 'C7B5',23884: 'C7B6',27424: 'C7B7',27465: 'C7B8',26538: 'C7B9',21595: 'C7BA',33108: 'C7BB',32652: 'C7BC',22681: 'C7BD',34103: 'C7BE',24378: 'C7BF',25250: 'C7C0',27207: 'C7C1',38201: 'C7C2',25970: 'C7C3',24708: 'C7C4',26725: 'C7C5',30631: 'C7C6',20052: 'C7C7',20392: 'C7C8',24039: 'C7C9',38808: 'C7CA',25772: 'C7CB',32728: 'C7CC',23789: 'C7CD',20431: 'C7CE',31373: 'C7CF',20999: 'C7D0',33540: 'C7D1',19988: 'C7D2',24623: 'C7D3',31363: 'C7D4',38054: 'C7D5',20405: 'C7D6',20146: 'C7D7',31206: 'C7D8',29748: 'C7D9',21220: 'C7DA',33465: 'C7DB',25810: 'C7DC',31165: 'C7DD',23517: 'C7DE',27777: 'C7DF',38738: 'C7E0',36731: 'C7E1',27682: 'C7E2',20542: 'C7E3',21375: 'C7E4',28165: 'C7E5',25806: 'C7E6',26228: 'C7E7',27696: 'C7E8',24773: 'C7E9',39031: 'C7EA',35831: 'C7EB',24198: 'C7EC',29756: 'C7ED',31351: 'C7EE',31179: 'C7EF',19992: 'C7F0',37041: 'C7F1',29699: 'C7F2',27714: 'C7F3',22234: 'C7F4',37195: 'C7F5',27845: 'C7F6',36235: 'C7F7',21306: 'C7F8',34502: 'C7F9',26354: 'C7FA',36527: 'C7FB',23624: 'C7FC',39537: 'C7FD',28192: 'C7FE',21462: 'C8A1',23094: 'C8A2',40843: 'C8A3',36259: 'C8A4',21435: 'C8A5',22280: 'C8A6',39079: 'C8A7',26435: 'C8A8',37275: 'C8A9',27849: 'C8AA',20840: 'C8AB',30154: 'C8AC',25331: 'C8AD',29356: 'C8AE',21048: 'C8AF',21149: 'C8B0',32570: 'C8B1',28820: 'C8B2',30264: 'C8B3',21364: 'C8B4',40522: 'C8B5',27063: 'C8B6',30830: 'C8B7',38592: 'C8B8',35033: 'C8B9',32676: 'C8BA',28982: 'C8BB',29123: 'C8BC',20873: 'C8BD',26579: 'C8BE',29924: 'C8BF',22756: 'C8C0',25880: 'C8C1',22199: 'C8C2',35753: 'C8C3',39286: 'C8C4',25200: 'C8C5',32469: 'C8C6',24825: 'C8C7',28909: 'C8C8',22764: 'C8C9',20161: 'C8CA',20154: 'C8CB',24525: 'C8CC',38887: 'C8CD',20219: 'C8CE',35748: 'C8CF',20995: 'C8D0',22922: 'C8D1',32427: 'C8D2',25172: 'C8D3',20173: 'C8D4',26085: 'C8D5',25102: 'C8D6',33592: 'C8D7',33993: 'C8D8',33635: 'C8D9',34701: 'C8DA',29076: 'C8DB',28342: 'C8DC',23481: 'C8DD',32466: 'C8DE',20887: 'C8DF',25545: 'C8E0',26580: 'C8E1',32905: 'C8E2',33593: 'C8E3',34837: 'C8E4',20754: 'C8E5',23418: 'C8E6',22914: 'C8E7',36785: 'C8E8',20083: 'C8E9',27741: 'C8EA',20837: 'C8EB',35109: 'C8EC',36719: 'C8ED',38446: 'C8EE',34122: 'C8EF',29790: 'C8F0',38160: 'C8F1',38384: 'C8F2',28070: 'C8F3',33509: 'C8F4',24369: 'C8F5',25746: 'C8F6',27922: 'C8F7',33832: 'C8F8',33134: 'C8F9',40131: 'C8FA',22622: 'C8FB',36187: 'C8FC',19977: 'C8FD',21441: 'C8FE',20254: 'C9A1',25955: 'C9A2',26705: 'C9A3',21971: 'C9A4',20007: 'C9A5',25620: 'C9A6',39578: 'C9A7',25195: 'C9A8',23234: 'C9A9',29791: 'C9AA',33394: 'C9AB',28073: 'C9AC',26862: 'C9AD',20711: 'C9AE',33678: 'C9AF',30722: 'C9B0',26432: 'C9B1',21049: 'C9B2',27801: 'C9B3',32433: 'C9B4',20667: 'C9B5',21861: 'C9B6',29022: 'C9B7',31579: 'C9B8',26194: 'C9B9',29642: 'C9BA',33515: 'C9BB',26441: 'C9BC',23665: 'C9BD',21024: 'C9BE',29053: 'C9BF',34923: 'C9C0',38378: 'C9C1',38485: 'C9C2',25797: 'C9C3',36193: 'C9C4',33203: 'C9C5',21892: 'C9C6',27733: 'C9C7',25159: 'C9C8',32558: 'C9C9',22674: 'C9CA',20260: 'C9CB',21830: 'C9CC',36175: 'C9CD',26188: 'C9CE',19978: 'C9CF',23578: 'C9D0',35059: 'C9D1',26786: 'C9D2',25422: 'C9D3',31245: 'C9D4',28903: 'C9D5',33421: 'C9D6',21242: 'C9D7',38902: 'C9D8',23569: 'C9D9',21736: 'C9DA',37045: 'C9DB',32461: 'C9DC',22882: 'C9DD',36170: 'C9DE',34503: 'C9DF',33292: 'C9E0',33293: 'C9E1',36198: 'C9E2',25668: 'C9E3',23556: 'C9E4',24913: 'C9E5',28041: 'C9E6',31038: 'C9E7',35774: 'C9E8',30775: 'C9E9',30003: 'C9EA',21627: 'C9EB',20280: 'C9EC',36523: 'C9ED',28145: 'C9EE',23072: 'C9EF',32453: 'C9F0',31070: 'C9F1',27784: 'C9F2',23457: 'C9F3',23158: 'C9F4',29978: 'C9F5',32958: 'C9F6',24910: 'C9F7',28183: 'C9F8',22768: 'C9F9',29983: 'C9FA',29989: 'C9FB',29298: 'C9FC',21319: 'C9FD',32499: 'C9FE',30465: 'CAA1',30427: 'CAA2',21097: 'CAA3',32988: 'CAA4',22307: 'CAA5',24072: 'CAA6',22833: 'CAA7',29422: 'CAA8',26045: 'CAA9',28287: 'CAAA',35799: 'CAAB',23608: 'CAAC',34417: 'CAAD',21313: 'CAAE',30707: 'CAAF',25342: 'CAB0',26102: 'CAB1',20160: 'CAB2',39135: 'CAB3',34432: 'CAB4',23454: 'CAB5',35782: 'CAB6',21490: 'CAB7',30690: 'CAB8',20351: 'CAB9',23630: 'CABA',39542: 'CABB',22987: 'CABC',24335: 'CABD',31034: 'CABE',22763: 'CABF',19990: 'CAC0',26623: 'CAC1',20107: 'CAC2',25325: 'CAC3',35475: 'CAC4',36893: 'CAC5',21183: 'CAC6',26159: 'CAC7',21980: 'CAC8',22124: 'CAC9',36866: 'CACA',20181: 'CACB',20365: 'CACC',37322: 'CACD',39280: 'CACE',27663: 'CACF',24066: 'CAD0',24643: 'CAD1',23460: 'CAD2',35270: 'CAD3',35797: 'CAD4',25910: 'CAD5',25163: 'CAD6',39318: 'CAD7',23432: 'CAD8',23551: 'CAD9',25480: 'CADA',21806: 'CADB',21463: 'CADC',30246: 'CADD',20861: 'CADE',34092: 'CADF',26530: 'CAE0',26803: 'CAE1',27530: 'CAE2',25234: 'CAE3',36755: 'CAE4',21460: 'CAE5',33298: 'CAE6',28113: 'CAE7',30095: 'CAE8',20070: 'CAE9',36174: 'CAEA',23408: 'CAEB',29087: 'CAEC',34223: 'CAED',26257: 'CAEE',26329: 'CAEF',32626: 'CAF0',34560: 'CAF1',40653: 'CAF2',40736: 'CAF3',23646: 'CAF4',26415: 'CAF5',36848: 'CAF6',26641: 'CAF7',26463: 'CAF8',25101: 'CAF9',31446: 'CAFA',22661: 'CAFB',24246: 'CAFC',25968: 'CAFD',28465: 'CAFE',24661: 'CBA1',21047: 'CBA2',32781: 'CBA3',25684: 'CBA4',34928: 'CBA5',29993: 'CBA6',24069: 'CBA7',26643: 'CBA8',25332: 'CBA9',38684: 'CBAA',21452: 'CBAB',29245: 'CBAC',35841: 'CBAD',27700: 'CBAE',30561: 'CBAF',31246: 'CBB0',21550: 'CBB1',30636: 'CBB2',39034: 'CBB3',33308: 'CBB4',35828: 'CBB5',30805: 'CBB6',26388: 'CBB7',28865: 'CBB8',26031: 'CBB9',25749: 'CBBA',22070: 'CBBB',24605: 'CBBC',31169: 'CBBD',21496: 'CBBE',19997: 'CBBF',27515: 'CBC0',32902: 'CBC1',23546: 'CBC2',21987: 'CBC3',22235: 'CBC4',20282: 'CBC5',20284: 'CBC6',39282: 'CBC7',24051: 'CBC8',26494: 'CBC9',32824: 'CBCA',24578: 'CBCB',39042: 'CBCC',36865: 'CBCD',23435: 'CBCE',35772: 'CBCF',35829: 'CBD0',25628: 'CBD1',33368: 'CBD2',25822: 'CBD3',22013: 'CBD4',33487: 'CBD5',37221: 'CBD6',20439: 'CBD7',32032: 'CBD8',36895: 'CBD9',31903: 'CBDA',20723: 'CBDB',22609: 'CBDC',28335: 'CBDD',23487: 'CBDE',35785: 'CBDF',32899: 'CBE0',37240: 'CBE1',33948: 'CBE2',31639: 'CBE3',34429: 'CBE4',38539: 'CBE5',38543: 'CBE6',32485: 'CBE7',39635: 'CBE8',30862: 'CBE9',23681: 'CBEA',31319: 'CBEB',36930: 'CBEC',38567: 'CBED',31071: 'CBEE',23385: 'CBEF',25439: 'CBF0',31499: 'CBF1',34001: 'CBF2',26797: 'CBF3',21766: 'CBF4',32553: 'CBF5',29712: 'CBF6',32034: 'CBF7',38145: 'CBF8',25152: 'CBF9',22604: 'CBFA',20182: 'CBFB',23427: 'CBFC',22905: 'CBFD',22612: 'CBFE',29549: 'CCA1',25374: 'CCA2',36427: 'CCA3',36367: 'CCA4',32974: 'CCA5',33492: 'CCA6',25260: 'CCA7',21488: 'CCA8',27888: 'CCA9',37214: 'CCAA',22826: 'CCAB',24577: 'CCAC',27760: 'CCAD',22349: 'CCAE',25674: 'CCAF',36138: 'CCB0',30251: 'CCB1',28393: 'CCB2',22363: 'CCB3',27264: 'CCB4',30192: 'CCB5',28525: 'CCB6',35885: 'CCB7',35848: 'CCB8',22374: 'CCB9',27631: 'CCBA',34962: 'CCBB',30899: 'CCBC',25506: 'CCBD',21497: 'CCBE',28845: 'CCBF',27748: 'CCC0',22616: 'CCC1',25642: 'CCC2',22530: 'CCC3',26848: 'CCC4',33179: 'CCC5',21776: 'CCC6',31958: 'CCC7',20504: 'CCC8',36538: 'CCC9',28108: 'CCCA',36255: 'CCCB',28907: 'CCCC',25487: 'CCCD',28059: 'CCCE',28372: 'CCCF',32486: 'CCD0',33796: 'CCD1',26691: 'CCD2',36867: 'CCD3',28120: 'CCD4',38518: 'CCD5',35752: 'CCD6',22871: 'CCD7',29305: 'CCD8',34276: 'CCD9',33150: 'CCDA',30140: 'CCDB',35466: 'CCDC',26799: 'CCDD',21076: 'CCDE',36386: 'CCDF',38161: 'CCE0',25552: 'CCE1',39064: 'CCE2',36420: 'CCE3',21884: 'CCE4',20307: 'CCE5',26367: 'CCE6',22159: 'CCE7',24789: 'CCE8',28053: 'CCE9',21059: 'CCEA',23625: 'CCEB',22825: 'CCEC',28155: 'CCED',22635: 'CCEE',30000: 'CCEF',29980: 'CCF0',24684: 'CCF1',33300: 'CCF2',33094: 'CCF3',25361: 'CCF4',26465: 'CCF5',36834: 'CCF6',30522: 'CCF7',36339: 'CCF8',36148: 'CCF9',38081: 'CCFA',24086: 'CCFB',21381: 'CCFC',21548: 'CCFD',28867: 'CCFE',27712: 'CDA1',24311: 'CDA2',20572: 'CDA3',20141: 'CDA4',24237: 'CDA5',25402: 'CDA6',33351: 'CDA7',36890: 'CDA8',26704: 'CDA9',37230: 'CDAA',30643: 'CDAB',21516: 'CDAC',38108: 'CDAD',24420: 'CDAE',31461: 'CDAF',26742: 'CDB0',25413: 'CDB1',31570: 'CDB2',32479: 'CDB3',30171: 'CDB4',20599: 'CDB5',25237: 'CDB6',22836: 'CDB7',36879: 'CDB8',20984: 'CDB9',31171: 'CDBA',31361: 'CDBB',22270: 'CDBC',24466: 'CDBD',36884: 'CDBE',28034: 'CDBF',23648: 'CDC0',22303: 'CDC1',21520: 'CDC2',20820: 'CDC3',28237: 'CDC4',22242: 'CDC5',25512: 'CDC6',39059: 'CDC7',33151: 'CDC8',34581: 'CDC9',35114: 'CDCA',36864: 'CDCB',21534: 'CDCC',23663: 'CDCD',33216: 'CDCE',25302: 'CDCF',25176: 'CDD0',33073: 'CDD1',40501: 'CDD2',38464: 'CDD3',39534: 'CDD4',39548: 'CDD5',26925: 'CDD6',22949: 'CDD7',25299: 'CDD8',21822: 'CDD9',25366: 'CDDA',21703: 'CDDB',34521: 'CDDC',27964: 'CDDD',23043: 'CDDE',29926: 'CDDF',34972: 'CDE0',27498: 'CDE1',22806: 'CDE2',35916: 'CDE3',24367: 'CDE4',28286: 'CDE5',29609: 'CDE6',39037: 'CDE7',20024: 'CDE8',28919: 'CDE9',23436: 'CDEA',30871: 'CDEB',25405: 'CDEC',26202: 'CDED',30358: 'CDEE',24779: 'CDEF',23451: 'CDF0',23113: 'CDF1',19975: 'CDF2',33109: 'CDF3',27754: 'CDF4',29579: 'CDF5',20129: 'CDF6',26505: 'CDF7',32593: 'CDF8',24448: 'CDF9',26106: 'CDFA',26395: 'CDFB',24536: 'CDFC',22916: 'CDFD',23041: 'CDFE',24013: 'CEA1',24494: 'CEA2',21361: 'CEA3',38886: 'CEA4',36829: 'CEA5',26693: 'CEA6',22260: 'CEA7',21807: 'CEA8',24799: 'CEA9',20026: 'CEAA',28493: 'CEAB',32500: 'CEAC',33479: 'CEAD',33806: 'CEAE',22996: 'CEAF',20255: 'CEB0',20266: 'CEB1',23614: 'CEB2',32428: 'CEB3',26410: 'CEB4',34074: 'CEB5',21619: 'CEB6',30031: 'CEB7',32963: 'CEB8',21890: 'CEB9',39759: 'CEBA',20301: 'CEBB',28205: 'CEBC',35859: 'CEBD',23561: 'CEBE',24944: 'CEBF',21355: 'CEC0',30239: 'CEC1',28201: 'CEC2',34442: 'CEC3',25991: 'CEC4',38395: 'CEC5',32441: 'CEC6',21563: 'CEC7',31283: 'CEC8',32010: 'CEC9',38382: 'CECA',21985: 'CECB',32705: 'CECC',29934: 'CECD',25373: 'CECE',34583: 'CECF',28065: 'CED0',31389: 'CED1',25105: 'CED2',26017: 'CED3',21351: 'CED4',25569: 'CED5',27779: 'CED6',24043: 'CED7',21596: 'CED8',38056: 'CED9',20044: 'CEDA',27745: 'CEDB',35820: 'CEDC',23627: 'CEDD',26080: 'CEDE',33436: 'CEDF',26791: 'CEE0',21566: 'CEE1',21556: 'CEE2',27595: 'CEE3',27494: 'CEE4',20116: 'CEE5',25410: 'CEE6',21320: 'CEE7',33310: 'CEE8',20237: 'CEE9',20398: 'CEEA',22366: 'CEEB',25098: 'CEEC',38654: 'CEED',26212: 'CEEE',29289: 'CEEF',21247: 'CEF0',21153: 'CEF1',24735: 'CEF2',35823: 'CEF3',26132: 'CEF4',29081: 'CEF5',26512: 'CEF6',35199: 'CEF7',30802: 'CEF8',30717: 'CEF9',26224: 'CEFA',22075: 'CEFB',21560: 'CEFC',38177: 'CEFD',29306: 'CEFE',31232: 'CFA1',24687: 'CFA2',24076: 'CFA3',24713: 'CFA4',33181: 'CFA5',22805: 'CFA6',24796: 'CFA7',29060: 'CFA8',28911: 'CFA9',28330: 'CFAA',27728: 'CFAB',29312: 'CFAC',27268: 'CFAD',34989: 'CFAE',24109: 'CFAF',20064: 'CFB0',23219: 'CFB1',21916: 'CFB2',38115: 'CFB3',27927: 'CFB4',31995: 'CFB5',38553: 'CFB6',25103: 'CFB7',32454: 'CFB8',30606: 'CFB9',34430: 'CFBA',21283: 'CFBB',38686: 'CFBC',36758: 'CFBD',26247: 'CFBE',23777: 'CFBF',20384: 'CFC0',29421: 'CFC1',19979: 'CFC2',21414: 'CFC3',22799: 'CFC4',21523: 'CFC5',25472: 'CFC6',38184: 'CFC7',20808: 'CFC8',20185: 'CFC9',40092: 'CFCA',32420: 'CFCB',21688: 'CFCC',36132: 'CFCD',34900: 'CFCE',33335: 'CFCF',38386: 'CFD0',28046: 'CFD1',24358: 'CFD2',23244: 'CFD3',26174: 'CFD4',38505: 'CFD5',29616: 'CFD6',29486: 'CFD7',21439: 'CFD8',33146: 'CFD9',39301: 'CFDA',32673: 'CFDB',23466: 'CFDC',38519: 'CFDD',38480: 'CFDE',32447: 'CFDF',30456: 'CFE0',21410: 'CFE1',38262: 'CFE2',39321: 'CFE3',31665: 'CFE4',35140: 'CFE5',28248: 'CFE6',20065: 'CFE7',32724: 'CFE8',31077: 'CFE9',35814: 'CFEA',24819: 'CFEB',21709: 'CFEC',20139: 'CFED',39033: 'CFEE',24055: 'CFEF',27233: 'CFF0',20687: 'CFF1',21521: 'CFF2',35937: 'CFF3',33831: 'CFF4',30813: 'CFF5',38660: 'CFF6',21066: 'CFF7',21742: 'CFF8',22179: 'CFF9',38144: 'CFFA',28040: 'CFFB',23477: 'CFFC',28102: 'CFFD',26195: 'CFFE',23567: 'D0A1',23389: 'D0A2',26657: 'D0A3',32918: 'D0A4',21880: 'D0A5',31505: 'D0A6',25928: 'D0A7',26964: 'D0A8',20123: 'D0A9',27463: 'D0AA',34638: 'D0AB',38795: 'D0AC',21327: 'D0AD',25375: 'D0AE',25658: 'D0AF',37034: 'D0B0',26012: 'D0B1',32961: 'D0B2',35856: 'D0B3',20889: 'D0B4',26800: 'D0B5',21368: 'D0B6',34809: 'D0B7',25032: 'D0B8',27844: 'D0B9',27899: 'D0BA',35874: 'D0BB',23633: 'D0BC',34218: 'D0BD',33455: 'D0BE',38156: 'D0BF',27427: 'D0C0',36763: 'D0C1',26032: 'D0C2',24571: 'D0C3',24515: 'D0C4',20449: 'D0C5',34885: 'D0C6',26143: 'D0C7',33125: 'D0C8',29481: 'D0C9',24826: 'D0CA',20852: 'D0CB',21009: 'D0CC',22411: 'D0CD',24418: 'D0CE',37026: 'D0CF',34892: 'D0D0',37266: 'D0D1',24184: 'D0D2',26447: 'D0D3',24615: 'D0D4',22995: 'D0D5',20804: 'D0D6',20982: 'D0D7',33016: 'D0D8',21256: 'D0D9',27769: 'D0DA',38596: 'D0DB',29066: 'D0DC',20241: 'D0DD',20462: 'D0DE',32670: 'D0DF',26429: 'D0E0',21957: 'D0E1',38152: 'D0E2',31168: 'D0E3',34966: 'D0E4',32483: 'D0E5',22687: 'D0E6',25100: 'D0E7',38656: 'D0E8',34394: 'D0E9',22040: 'D0EA',39035: 'D0EB',24464: 'D0EC',35768: 'D0ED',33988: 'D0EE',37207: 'D0EF',21465: 'D0F0',26093: 'D0F1',24207: 'D0F2',30044: 'D0F3',24676: 'D0F4',32110: 'D0F5',23167: 'D0F6',32490: 'D0F7',32493: 'D0F8',36713: 'D0F9',21927: 'D0FA',23459: 'D0FB',24748: 'D0FC',26059: 'D0FD',29572: 'D0FE',36873: 'D1A1',30307: 'D1A2',30505: 'D1A3',32474: 'D1A4',38772: 'D1A5',34203: 'D1A6',23398: 'D1A7',31348: 'D1A8',38634: 'D1A9',34880: 'D1AA',21195: 'D1AB',29071: 'D1AC',24490: 'D1AD',26092: 'D1AE',35810: 'D1AF',23547: 'D1B0',39535: 'D1B1',24033: 'D1B2',27529: 'D1B3',27739: 'D1B4',35757: 'D1B5',35759: 'D1B6',36874: 'D1B7',36805: 'D1B8',21387: 'D1B9',25276: 'D1BA',40486: 'D1BB',40493: 'D1BC',21568: 'D1BD',20011: 'D1BE',33469: 'D1BF',29273: 'D1C0',34460: 'D1C1',23830: 'D1C2',34905: 'D1C3',28079: 'D1C4',38597: 'D1C5',21713: 'D1C6',20122: 'D1C7',35766: 'D1C8',28937: 'D1C9',21693: 'D1CA',38409: 'D1CB',28895: 'D1CC',28153: 'D1CD',30416: 'D1CE',20005: 'D1CF',30740: 'D1D0',34578: 'D1D1',23721: 'D1D2',24310: 'D1D3',35328: 'D1D4',39068: 'D1D5',38414: 'D1D6',28814: 'D1D7',27839: 'D1D8',22852: 'D1D9',25513: 'D1DA',30524: 'D1DB',34893: 'D1DC',28436: 'D1DD',33395: 'D1DE',22576: 'D1DF',29141: 'D1E0',21388: 'D1E1',30746: 'D1E2',38593: 'D1E3',21761: 'D1E4',24422: 'D1E5',28976: 'D1E6',23476: 'D1E7',35866: 'D1E8',39564: 'D1E9',27523: 'D1EA',22830: 'D1EB',40495: 'D1EC',31207: 'D1ED',26472: 'D1EE',25196: 'D1EF',20335: 'D1F0',30113: 'D1F1',32650: 'D1F2',27915: 'D1F3',38451: 'D1F4',27687: 'D1F5',20208: 'D1F6',30162: 'D1F7',20859: 'D1F8',26679: 'D1F9',28478: 'D1FA',36992: 'D1FB',33136: 'D1FC',22934: 'D1FD',29814: 'D1FE',25671: 'D2A1',23591: 'D2A2',36965: 'D2A3',31377: 'D2A4',35875: 'D2A5',23002: 'D2A6',21676: 'D2A7',33280: 'D2A8',33647: 'D2A9',35201: 'D2AA',32768: 'D2AB',26928: 'D2AC',22094: 'D2AD',32822: 'D2AE',29239: 'D2AF',37326: 'D2B0',20918: 'D2B1',20063: 'D2B2',39029: 'D2B3',25494: 'D2B4',19994: 'D2B5',21494: 'D2B6',26355: 'D2B7',33099: 'D2B8',22812: 'D2B9',28082: 'D2BA',19968: 'D2BB',22777: 'D2BC',21307: 'D2BD',25558: 'D2BE',38129: 'D2BF',20381: 'D2C0',20234: 'D2C1',34915: 'D2C2',39056: 'D2C3',22839: 'D2C4',36951: 'D2C5',31227: 'D2C6',20202: 'D2C7',33008: 'D2C8',30097: 'D2C9',27778: 'D2CA',23452: 'D2CB',23016: 'D2CC',24413: 'D2CD',26885: 'D2CE',34433: 'D2CF',20506: 'D2D0',24050: 'D2D1',20057: 'D2D2',30691: 'D2D3',20197: 'D2D4',33402: 'D2D5',25233: 'D2D6',26131: 'D2D7',37009: 'D2D8',23673: 'D2D9',20159: 'D2DA',24441: 'D2DB',33222: 'D2DC',36920: 'D2DD',32900: 'D2DE',30123: 'D2DF',20134: 'D2E0',35028: 'D2E1',24847: 'D2E2',27589: 'D2E3',24518: 'D2E4',20041: 'D2E5',30410: 'D2E6',28322: 'D2E7',35811: 'D2E8',35758: 'D2E9',35850: 'D2EA',35793: 'D2EB',24322: 'D2EC',32764: 'D2ED',32716: 'D2EE',32462: 'D2EF',33589: 'D2F0',33643: 'D2F1',22240: 'D2F2',27575: 'D2F3',38899: 'D2F4',38452: 'D2F5',23035: 'D2F6',21535: 'D2F7',38134: 'D2F8',28139: 'D2F9',23493: 'D2FA',39278: 'D2FB',23609: 'D2FC',24341: 'D2FD',38544: 'D2FE',21360: 'D3A1',33521: 'D3A2',27185: 'D3A3',23156: 'D3A4',40560: 'D3A5',24212: 'D3A6',32552: 'D3A7',33721: 'D3A8',33828: 'D3A9',33829: 'D3AA',33639: 'D3AB',34631: 'D3AC',36814: 'D3AD',36194: 'D3AE',30408: 'D3AF',24433: 'D3B0',39062: 'D3B1',30828: 'D3B2',26144: 'D3B3',21727: 'D3B4',25317: 'D3B5',20323: 'D3B6',33219: 'D3B7',30152: 'D3B8',24248: 'D3B9',38605: 'D3BA',36362: 'D3BB',34553: 'D3BC',21647: 'D3BD',27891: 'D3BE',28044: 'D3BF',27704: 'D3C0',24703: 'D3C1',21191: 'D3C2',29992: 'D3C3',24189: 'D3C4',20248: 'D3C5',24736: 'D3C6',24551: 'D3C7',23588: 'D3C8',30001: 'D3C9',37038: 'D3CA',38080: 'D3CB',29369: 'D3CC',27833: 'D3CD',28216: 'D3CE',37193: 'D3CF',26377: 'D3D0',21451: 'D3D1',21491: 'D3D2',20305: 'D3D3',37321: 'D3D4',35825: 'D3D5',21448: 'D3D6',24188: 'D3D7',36802: 'D3D8',28132: 'D3D9',20110: 'D3DA',30402: 'D3DB',27014: 'D3DC',34398: 'D3DD',24858: 'D3DE',33286: 'D3DF',20313: 'D3E0',20446: 'D3E1',36926: 'D3E2',40060: 'D3E3',24841: 'D3E4',28189: 'D3E5',28180: 'D3E6',38533: 'D3E7',20104: 'D3E8',23089: 'D3E9',38632: 'D3EA',19982: 'D3EB',23679: 'D3EC',31161: 'D3ED',23431: 'D3EE',35821: 'D3EF',32701: 'D3F0',29577: 'D3F1',22495: 'D3F2',33419: 'D3F3',37057: 'D3F4',21505: 'D3F5',36935: 'D3F6',21947: 'D3F7',23786: 'D3F8',24481: 'D3F9',24840: 'D3FA',27442: 'D3FB',29425: 'D3FC',32946: 'D3FD',35465: 'D3FE',28020: 'D4A1',23507: 'D4A2',35029: 'D4A3',39044: 'D4A4',35947: 'D4A5',39533: 'D4A6',40499: 'D4A7',28170: 'D4A8',20900: 'D4A9',20803: 'D4AA',22435: 'D4AB',34945: 'D4AC',21407: 'D4AD',25588: 'D4AE',36757: 'D4AF',22253: 'D4B0',21592: 'D4B1',22278: 'D4B2',29503: 'D4B3',28304: 'D4B4',32536: 'D4B5',36828: 'D4B6',33489: 'D4B7',24895: 'D4B8',24616: 'D4B9',38498: 'D4BA',26352: 'D4BB',32422: 'D4BC',36234: 'D4BD',36291: 'D4BE',38053: 'D4BF',23731: 'D4C0',31908: 'D4C1',26376: 'D4C2',24742: 'D4C3',38405: 'D4C4',32792: 'D4C5',20113: 'D4C6',37095: 'D4C7',21248: 'D4C8',38504: 'D4C9',20801: 'D4CA',36816: 'D4CB',34164: 'D4CC',37213: 'D4CD',26197: 'D4CE',38901: 'D4CF',23381: 'D4D0',21277: 'D4D1',30776: 'D4D2',26434: 'D4D3',26685: 'D4D4',21705: 'D4D5',28798: 'D4D6',23472: 'D4D7',36733: 'D4D8',20877: 'D4D9',22312: 'D4DA',21681: 'D4DB',25874: 'D4DC',26242: 'D4DD',36190: 'D4DE',36163: 'D4DF',33039: 'D4E0',33900: 'D4E1',36973: 'D4E2',31967: 'D4E3',20991: 'D4E4',34299: 'D4E5',26531: 'D4E6',26089: 'D4E7',28577: 'D4E8',34468: 'D4E9',36481: 'D4EA',22122: 'D4EB',36896: 'D4EC',30338: 'D4ED',28790: 'D4EE',29157: 'D4EF',36131: 'D4F0',25321: 'D4F1',21017: 'D4F2',27901: 'D4F3',36156: 'D4F4',24590: 'D4F5',22686: 'D4F6',24974: 'D4F7',26366: 'D4F8',36192: 'D4F9',25166: 'D4FA',21939: 'D4FB',28195: 'D4FC',26413: 'D4FD',36711: 'D4FE',38113: 'D5A1',38392: 'D5A2',30504: 'D5A3',26629: 'D5A4',27048: 'D5A5',21643: 'D5A6',20045: 'D5A7',28856: 'D5A8',35784: 'D5A9',25688: 'D5AA',25995: 'D5AB',23429: 'D5AC',31364: 'D5AD',20538: 'D5AE',23528: 'D5AF',30651: 'D5B0',27617: 'D5B1',35449: 'D5B2',31896: 'D5B3',27838: 'D5B4',30415: 'D5B5',26025: 'D5B6',36759: 'D5B7',23853: 'D5B8',23637: 'D5B9',34360: 'D5BA',26632: 'D5BB',21344: 'D5BC',25112: 'D5BD',31449: 'D5BE',28251: 'D5BF',32509: 'D5C0',27167: 'D5C1',31456: 'D5C2',24432: 'D5C3',28467: 'D5C4',24352: 'D5C5',25484: 'D5C6',28072: 'D5C7',26454: 'D5C8',19976: 'D5C9',24080: 'D5CA',36134: 'D5CB',20183: 'D5CC',32960: 'D5CD',30260: 'D5CE',38556: 'D5CF',25307: 'D5D0',26157: 'D5D1',25214: 'D5D2',27836: 'D5D3',36213: 'D5D4',29031: 'D5D5',32617: 'D5D6',20806: 'D5D7',32903: 'D5D8',21484: 'D5D9',36974: 'D5DA',25240: 'D5DB',21746: 'D5DC',34544: 'D5DD',36761: 'D5DE',32773: 'D5DF',38167: 'D5E0',34071: 'D5E1',36825: 'D5E2',27993: 'D5E3',29645: 'D5E4',26015: 'D5E5',30495: 'D5E6',29956: 'D5E7',30759: 'D5E8',33275: 'D5E9',36126: 'D5EA',38024: 'D5EB',20390: 'D5EC',26517: 'D5ED',30137: 'D5EE',35786: 'D5EF',38663: 'D5F0',25391: 'D5F1',38215: 'D5F2',38453: 'D5F3',33976: 'D5F4',25379: 'D5F5',30529: 'D5F6',24449: 'D5F7',29424: 'D5F8',20105: 'D5F9',24596: 'D5FA',25972: 'D5FB',25327: 'D5FC',27491: 'D5FD',25919: 'D5FE',24103: 'D6A1',30151: 'D6A2',37073: 'D6A3',35777: 'D6A4',33437: 'D6A5',26525: 'D6A6',25903: 'D6A7',21553: 'D6A8',34584: 'D6A9',30693: 'D6AA',32930: 'D6AB',33026: 'D6AC',27713: 'D6AD',20043: 'D6AE',32455: 'D6AF',32844: 'D6B0',30452: 'D6B1',26893: 'D6B2',27542: 'D6B3',25191: 'D6B4',20540: 'D6B5',20356: 'D6B6',22336: 'D6B7',25351: 'D6B8',27490: 'D6B9',36286: 'D6BA',21482: 'D6BB',26088: 'D6BC',32440: 'D6BD',24535: 'D6BE',25370: 'D6BF',25527: 'D6C0',33267: 'D6C1',33268: 'D6C2',32622: 'D6C3',24092: 'D6C4',23769: 'D6C5',21046: 'D6C6',26234: 'D6C7',31209: 'D6C8',31258: 'D6C9',36136: 'D6CA',28825: 'D6CB',30164: 'D6CC',28382: 'D6CD',27835: 'D6CE',31378: 'D6CF',20013: 'D6D0',30405: 'D6D1',24544: 'D6D2',38047: 'D6D3',34935: 'D6D4',32456: 'D6D5',31181: 'D6D6',32959: 'D6D7',37325: 'D6D8',20210: 'D6D9',20247: 'D6DA',33311: 'D6DB',21608: 'D6DC',24030: 'D6DD',27954: 'D6DE',35788: 'D6DF',31909: 'D6E0',36724: 'D6E1',32920: 'D6E2',24090: 'D6E3',21650: 'D6E4',30385: 'D6E5',23449: 'D6E6',26172: 'D6E7',39588: 'D6E8',29664: 'D6E9',26666: 'D6EA',34523: 'D6EB',26417: 'D6EC',29482: 'D6ED',35832: 'D6EE',35803: 'D6EF',36880: 'D6F0',31481: 'D6F1',28891: 'D6F2',29038: 'D6F3',25284: 'D6F4',30633: 'D6F5',22065: 'D6F6',20027: 'D6F7',33879: 'D6F8',26609: 'D6F9',21161: 'D6FA',34496: 'D6FB',36142: 'D6FC',38136: 'D6FD',31569: 'D6FE',20303: 'D7A1',27880: 'D7A2',31069: 'D7A3',39547: 'D7A4',25235: 'D7A5',29226: 'D7A6',25341: 'D7A7',19987: 'D7A8',30742: 'D7A9',36716: 'D7AA',25776: 'D7AB',36186: 'D7AC',31686: 'D7AD',26729: 'D7AE',24196: 'D7AF',35013: 'D7B0',22918: 'D7B1',25758: 'D7B2',22766: 'D7B3',29366: 'D7B4',26894: 'D7B5',38181: 'D7B6',36861: 'D7B7',36184: 'D7B8',22368: 'D7B9',32512: 'D7BA',35846: 'D7BB',20934: 'D7BC',25417: 'D7BD',25305: 'D7BE',21331: 'D7BF',26700: 'D7C0',29730: 'D7C1',33537: 'D7C2',37196: 'D7C3',21828: 'D7C4',30528: 'D7C5',28796: 'D7C6',27978: 'D7C7',20857: 'D7C8',21672: 'D7C9',36164: 'D7CA',23039: 'D7CB',28363: 'D7CC',28100: 'D7CD',23388: 'D7CE',32043: 'D7CF',20180: 'D7D0',31869: 'D7D1',28371: 'D7D2',23376: 'D7D3',33258: 'D7D4',28173: 'D7D5',23383: 'D7D6',39683: 'D7D7',26837: 'D7D8',36394: 'D7D9',23447: 'D7DA',32508: 'D7DB',24635: 'D7DC',32437: 'D7DD',37049: 'D7DE',36208: 'D7DF',22863: 'D7E0',25549: 'D7E1',31199: 'D7E2',36275: 'D7E3',21330: 'D7E4',26063: 'D7E5',31062: 'D7E6',35781: 'D7E7',38459: 'D7E8',32452: 'D7E9',38075: 'D7EA',32386: 'D7EB',22068: 'D7EC',37257: 'D7ED',26368: 'D7EE',32618: 'D7EF',23562: 'D7F0',36981: 'D7F1',26152: 'D7F2',24038: 'D7F3',20304: 'D7F4',26590: 'D7F5',20570: 'D7F6',20316: 'D7F7',22352: 'D7F8',24231: 'D7F9',20109: 'D8A1',19980: 'D8A2',20800: 'D8A3',19984: 'D8A4',24319: 'D8A5',21317: 'D8A6',19989: 'D8A7',20120: 'D8A8',19998: 'D8A9',39730: 'D8AA',23404: 'D8AB',22121: 'D8AC',20008: 'D8AD',31162: 'D8AE',20031: 'D8AF',21269: 'D8B0',20039: 'D8B1',22829: 'D8B2',29243: 'D8B3',21358: 'D8B4',27664: 'D8B5',22239: 'D8B6',32996: 'D8B7',39319: 'D8B8',27603: 'D8B9',30590: 'D8BA',40727: 'D8BB',20022: 'D8BC',20127: 'D8BD',40720: 'D8BE',20060: 'D8BF',20073: 'D8C0',20115: 'D8C1',33416: 'D8C2',23387: 'D8C3',21868: 'D8C4',22031: 'D8C5',20164: 'D8C6',21389: 'D8C7',21405: 'D8C8',21411: 'D8C9',21413: 'D8CA',21422: 'D8CB',38757: 'D8CC',36189: 'D8CD',21274: 'D8CE',21493: 'D8CF',21286: 'D8D0',21294: 'D8D1',21310: 'D8D2',36188: 'D8D3',21350: 'D8D4',21347: 'D8D5',20994: 'D8D6',21000: 'D8D7',21006: 'D8D8',21037: 'D8D9',21043: 'D8DA',21055: 'D8DB',21056: 'D8DC',21068: 'D8DD',21086: 'D8DE',21089: 'D8DF',21084: 'D8E0',33967: 'D8E1',21117: 'D8E2',21122: 'D8E3',21121: 'D8E4',21136: 'D8E5',21139: 'D8E6',20866: 'D8E7',32596: 'D8E8',20155: 'D8E9',20163: 'D8EA',20169: 'D8EB',20162: 'D8EC',20200: 'D8ED',20193: 'D8EE',20203: 'D8EF',20190: 'D8F0',20251: 'D8F1',20211: 'D8F2',20258: 'D8F3',20324: 'D8F4',20213: 'D8F5',20261: 'D8F6',20263: 'D8F7',20233: 'D8F8',20267: 'D8F9',20318: 'D8FA',20327: 'D8FB',25912: 'D8FC',20314: 'D8FD',20317: 'D8FE',20319: 'D9A1',20311: 'D9A2',20274: 'D9A3',20285: 'D9A4',20342: 'D9A5',20340: 'D9A6',20369: 'D9A7',20361: 'D9A8',20355: 'D9A9',20367: 'D9AA',20350: 'D9AB',20347: 'D9AC',20394: 'D9AD',20348: 'D9AE',20396: 'D9AF',20372: 'D9B0',20454: 'D9B1',20456: 'D9B2',20458: 'D9B3',20421: 'D9B4',20442: 'D9B5',20451: 'D9B6',20444: 'D9B7',20433: 'D9B8',20447: 'D9B9',20472: 'D9BA',20521: 'D9BB',20556: 'D9BC',20467: 'D9BD',20524: 'D9BE',20495: 'D9BF',20526: 'D9C0',20525: 'D9C1',20478: 'D9C2',20508: 'D9C3',20492: 'D9C4',20517: 'D9C5',20520: 'D9C6',20606: 'D9C7',20547: 'D9C8',20565: 'D9C9',20552: 'D9CA',20558: 'D9CB',20588: 'D9CC',20603: 'D9CD',20645: 'D9CE',20647: 'D9CF',20649: 'D9D0',20666: 'D9D1',20694: 'D9D2',20742: 'D9D3',20717: 'D9D4',20716: 'D9D5',20710: 'D9D6',20718: 'D9D7',20743: 'D9D8',20747: 'D9D9',20189: 'D9DA',27709: 'D9DB',20312: 'D9DC',20325: 'D9DD',20430: 'D9DE',40864: 'D9DF',27718: 'D9E0',31860: 'D9E1',20846: 'D9E2',24061: 'D9E3',40649: 'D9E4',39320: 'D9E5',20865: 'D9E6',22804: 'D9E7',21241: 'D9E8',21261: 'D9E9',35335: 'D9EA',21264: 'D9EB',20971: 'D9EC',22809: 'D9ED',20821: 'D9EE',20128: 'D9EF',20822: 'D9F0',20147: 'D9F1',34926: 'D9F2',34980: 'D9F3',20149: 'D9F4',33044: 'D9F5',35026: 'D9F6',31104: 'D9F7',23348: 'D9F8',34819: 'D9F9',32696: 'D9FA',20907: 'D9FB',20913: 'D9FC',20925: 'D9FD',20924: 'D9FE',20935: 'DAA1',20886: 'DAA2',20898: 'DAA3',20901: 'DAA4',35744: 'DAA5',35750: 'DAA6',35751: 'DAA7',35754: 'DAA8',35764: 'DAA9',35765: 'DAAA',35767: 'DAAB',35778: 'DAAC',35779: 'DAAD',35787: 'DAAE',35791: 'DAAF',35790: 'DAB0',35794: 'DAB1',35795: 'DAB2',35796: 'DAB3',35798: 'DAB4',35800: 'DAB5',35801: 'DAB6',35804: 'DAB7',35807: 'DAB8',35808: 'DAB9',35812: 'DABA',35816: 'DABB',35817: 'DABC',35822: 'DABD',35824: 'DABE',35827: 'DABF',35830: 'DAC0',35833: 'DAC1',35836: 'DAC2',35839: 'DAC3',35840: 'DAC4',35842: 'DAC5',35844: 'DAC6',35847: 'DAC7',35852: 'DAC8',35855: 'DAC9',35857: 'DACA',35858: 'DACB',35860: 'DACC',35861: 'DACD',35862: 'DACE',35865: 'DACF',35867: 'DAD0',35864: 'DAD1',35869: 'DAD2',35871: 'DAD3',35872: 'DAD4',35873: 'DAD5',35877: 'DAD6',35879: 'DAD7',35882: 'DAD8',35883: 'DAD9',35886: 'DADA',35887: 'DADB',35890: 'DADC',35891: 'DADD',35893: 'DADE',35894: 'DADF',21353: 'DAE0',21370: 'DAE1',38429: 'DAE2',38434: 'DAE3',38433: 'DAE4',38449: 'DAE5',38442: 'DAE6',38461: 'DAE7',38460: 'DAE8',38466: 'DAE9',38473: 'DAEA',38484: 'DAEB',38495: 'DAEC',38503: 'DAED',38508: 'DAEE',38514: 'DAEF',38516: 'DAF0',38536: 'DAF1',38541: 'DAF2',38551: 'DAF3',38576: 'DAF4',37015: 'DAF5',37019: 'DAF6',37021: 'DAF7',37017: 'DAF8',37036: 'DAF9',37025: 'DAFA',37044: 'DAFB',37043: 'DAFC',37046: 'DAFD',37050: 'DAFE',37048: 'DBA1',37040: 'DBA2',37071: 'DBA3',37061: 'DBA4',37054: 'DBA5',37072: 'DBA6',37060: 'DBA7',37063: 'DBA8',37075: 'DBA9',37094: 'DBAA',37090: 'DBAB',37084: 'DBAC',37079: 'DBAD',37083: 'DBAE',37099: 'DBAF',37103: 'DBB0',37118: 'DBB1',37124: 'DBB2',37154: 'DBB3',37150: 'DBB4',37155: 'DBB5',37169: 'DBB6',37167: 'DBB7',37177: 'DBB8',37187: 'DBB9',37190: 'DBBA',21005: 'DBBB',22850: 'DBBC',21154: 'DBBD',21164: 'DBBE',21165: 'DBBF',21182: 'DBC0',21759: 'DBC1',21200: 'DBC2',21206: 'DBC3',21232: 'DBC4',21471: 'DBC5',29166: 'DBC6',30669: 'DBC7',24308: 'DBC8',20981: 'DBC9',20988: 'DBCA',39727: 'DBCB',21430: 'DBCC',24321: 'DBCD',30042: 'DBCE',24047: 'DBCF',22348: 'DBD0',22441: 'DBD1',22433: 'DBD2',22654: 'DBD3',22716: 'DBD4',22725: 'DBD5',22737: 'DBD6',22313: 'DBD7',22316: 'DBD8',22314: 'DBD9',22323: 'DBDA',22329: 'DBDB',22318: 'DBDC',22319: 'DBDD',22364: 'DBDE',22331: 'DBDF',22338: 'DBE0',22377: 'DBE1',22405: 'DBE2',22379: 'DBE3',22406: 'DBE4',22396: 'DBE5',22395: 'DBE6',22376: 'DBE7',22381: 'DBE8',22390: 'DBE9',22387: 'DBEA',22445: 'DBEB',22436: 'DBEC',22412: 'DBED',22450: 'DBEE',22479: 'DBEF',22439: 'DBF0',22452: 'DBF1',22419: 'DBF2',22432: 'DBF3',22485: 'DBF4',22488: 'DBF5',22490: 'DBF6',22489: 'DBF7',22482: 'DBF8',22456: 'DBF9',22516: 'DBFA',22511: 'DBFB',22520: 'DBFC',22500: 'DBFD',22493: 'DBFE',22539: 'DCA1',22541: 'DCA2',22525: 'DCA3',22509: 'DCA4',22528: 'DCA5',22558: 'DCA6',22553: 'DCA7',22596: 'DCA8',22560: 'DCA9',22629: 'DCAA',22636: 'DCAB',22657: 'DCAC',22665: 'DCAD',22682: 'DCAE',22656: 'DCAF',39336: 'DCB0',40729: 'DCB1',25087: 'DCB2',33401: 'DCB3',33405: 'DCB4',33407: 'DCB5',33423: 'DCB6',33418: 'DCB7',33448: 'DCB8',33412: 'DCB9',33422: 'DCBA',33425: 'DCBB',33431: 'DCBC',33433: 'DCBD',33451: 'DCBE',33464: 'DCBF',33470: 'DCC0',33456: 'DCC1',33480: 'DCC2',33482: 'DCC3',33507: 'DCC4',33432: 'DCC5',33463: 'DCC6',33454: 'DCC7',33483: 'DCC8',33484: 'DCC9',33473: 'DCCA',33449: 'DCCB',33460: 'DCCC',33441: 'DCCD',33450: 'DCCE',33439: 'DCCF',33476: 'DCD0',33486: 'DCD1',33444: 'DCD2',33505: 'DCD3',33545: 'DCD4',33527: 'DCD5',33508: 'DCD6',33551: 'DCD7',33543: 'DCD8',33500: 'DCD9',33524: 'DCDA',33490: 'DCDB',33496: 'DCDC',33548: 'DCDD',33531: 'DCDE',33491: 'DCDF',33553: 'DCE0',33562: 'DCE1',33542: 'DCE2',33556: 'DCE3',33557: 'DCE4',33504: 'DCE5',33493: 'DCE6',33564: 'DCE7',33617: 'DCE8',33627: 'DCE9',33628: 'DCEA',33544: 'DCEB',33682: 'DCEC',33596: 'DCED',33588: 'DCEE',33585: 'DCEF',33691: 'DCF0',33630: 'DCF1',33583: 'DCF2',33615: 'DCF3',33607: 'DCF4',33603: 'DCF5',33631: 'DCF6',33600: 'DCF7',33559: 'DCF8',33632: 'DCF9',33581: 'DCFA',33594: 'DCFB',33587: 'DCFC',33638: 'DCFD',33637: 'DCFE',33640: 'DDA1',33563: 'DDA2',33641: 'DDA3',33644: 'DDA4',33642: 'DDA5',33645: 'DDA6',33646: 'DDA7',33712: 'DDA8',33656: 'DDA9',33715: 'DDAA',33716: 'DDAB',33696: 'DDAC',33706: 'DDAD',33683: 'DDAE',33692: 'DDAF',33669: 'DDB0',33660: 'DDB1',33718: 'DDB2',33705: 'DDB3',33661: 'DDB4',33720: 'DDB5',33659: 'DDB6',33688: 'DDB7',33694: 'DDB8',33704: 'DDB9',33722: 'DDBA',33724: 'DDBB',33729: 'DDBC',33793: 'DDBD',33765: 'DDBE',33752: 'DDBF',22535: 'DDC0',33816: 'DDC1',33803: 'DDC2',33757: 'DDC3',33789: 'DDC4',33750: 'DDC5',33820: 'DDC6',33848: 'DDC7',33809: 'DDC8',33798: 'DDC9',33748: 'DDCA',33759: 'DDCB',33807: 'DDCC',33795: 'DDCD',33784: 'DDCE',33785: 'DDCF',33770: 'DDD0',33733: 'DDD1',33728: 'DDD2',33830: 'DDD3',33776: 'DDD4',33761: 'DDD5',33884: 'DDD6',33873: 'DDD7',33882: 'DDD8',33881: 'DDD9',33907: 'DDDA',33927: 'DDDB',33928: 'DDDC',33914: 'DDDD',33929: 'DDDE',33912: 'DDDF',33852: 'DDE0',33862: 'DDE1',33897: 'DDE2',33910: 'DDE3',33932: 'DDE4',33934: 'DDE5',33841: 'DDE6',33901: 'DDE7',33985: 'DDE8',33997: 'DDE9',34000: 'DDEA',34022: 'DDEB',33981: 'DDEC',34003: 'DDED',33994: 'DDEE',33983: 'DDEF',33978: 'DDF0',34016: 'DDF1',33953: 'DDF2',33977: 'DDF3',33972: 'DDF4',33943: 'DDF5',34021: 'DDF6',34019: 'DDF7',34060: 'DDF8',29965: 'DDF9',34104: 'DDFA',34032: 'DDFB',34105: 'DDFC',34079: 'DDFD',34106: 'DDFE',34134: 'DEA1',34107: 'DEA2',34047: 'DEA3',34044: 'DEA4',34137: 'DEA5',34120: 'DEA6',34152: 'DEA7',34148: 'DEA8',34142: 'DEA9',34170: 'DEAA',30626: 'DEAB',34115: 'DEAC',34162: 'DEAD',34171: 'DEAE',34212: 'DEAF',34216: 'DEB0',34183: 'DEB1',34191: 'DEB2',34169: 'DEB3',34222: 'DEB4',34204: 'DEB5',34181: 'DEB6',34233: 'DEB7',34231: 'DEB8',34224: 'DEB9',34259: 'DEBA',34241: 'DEBB',34268: 'DEBC',34303: 'DEBD',34343: 'DEBE',34309: 'DEBF',34345: 'DEC0',34326: 'DEC1',34364: 'DEC2',24318: 'DEC3',24328: 'DEC4',22844: 'DEC5',22849: 'DEC6',32823: 'DEC7',22869: 'DEC8',22874: 'DEC9',22872: 'DECA',21263: 'DECB',23586: 'DECC',23589: 'DECD',23596: 'DECE',23604: 'DECF',25164: 'DED0',25194: 'DED1',25247: 'DED2',25275: 'DED3',25290: 'DED4',25306: 'DED5',25303: 'DED6',25326: 'DED7',25378: 'DED8',25334: 'DED9',25401: 'DEDA',25419: 'DEDB',25411: 'DEDC',25517: 'DEDD',25590: 'DEDE',25457: 'DEDF',25466: 'DEE0',25486: 'DEE1',25524: 'DEE2',25453: 'DEE3',25516: 'DEE4',25482: 'DEE5',25449: 'DEE6',25518: 'DEE7',25532: 'DEE8',25586: 'DEE9',25592: 'DEEA',25568: 'DEEB',25599: 'DEEC',25540: 'DEED',25566: 'DEEE',25550: 'DEEF',25682: 'DEF0',25542: 'DEF1',25534: 'DEF2',25669: 'DEF3',25665: 'DEF4',25611: 'DEF5',25627: 'DEF6',25632: 'DEF7',25612: 'DEF8',25638: 'DEF9',25633: 'DEFA',25694: 'DEFB',25732: 'DEFC',25709: 'DEFD',25750: 'DEFE',25722: 'DFA1',25783: 'DFA2',25784: 'DFA3',25753: 'DFA4',25786: 'DFA5',25792: 'DFA6',25808: 'DFA7',25815: 'DFA8',25828: 'DFA9',25826: 'DFAA',25865: 'DFAB',25893: 'DFAC',25902: 'DFAD',24331: 'DFAE',24530: 'DFAF',29977: 'DFB0',24337: 'DFB1',21343: 'DFB2',21489: 'DFB3',21501: 'DFB4',21481: 'DFB5',21480: 'DFB6',21499: 'DFB7',21522: 'DFB8',21526: 'DFB9',21510: 'DFBA',21579: 'DFBB',21586: 'DFBC',21587: 'DFBD',21588: 'DFBE',21590: 'DFBF',21571: 'DFC0',21537: 'DFC1',21591: 'DFC2',21593: 'DFC3',21539: 'DFC4',21554: 'DFC5',21634: 'DFC6',21652: 'DFC7',21623: 'DFC8',21617: 'DFC9',21604: 'DFCA',21658: 'DFCB',21659: 'DFCC',21636: 'DFCD',21622: 'DFCE',21606: 'DFCF',21661: 'DFD0',21712: 'DFD1',21677: 'DFD2',21698: 'DFD3',21684: 'DFD4',21714: 'DFD5',21671: 'DFD6',21670: 'DFD7',21715: 'DFD8',21716: 'DFD9',21618: 'DFDA',21667: 'DFDB',21717: 'DFDC',21691: 'DFDD',21695: 'DFDE',21708: 'DFDF',21721: 'DFE0',21722: 'DFE1',21724: 'DFE2',21673: 'DFE3',21674: 'DFE4',21668: 'DFE5',21725: 'DFE6',21711: 'DFE7',21726: 'DFE8',21787: 'DFE9',21735: 'DFEA',21792: 'DFEB',21757: 'DFEC',21780: 'DFED',21747: 'DFEE',21794: 'DFEF',21795: 'DFF0',21775: 'DFF1',21777: 'DFF2',21799: 'DFF3',21802: 'DFF4',21863: 'DFF5',21903: 'DFF6',21941: 'DFF7',21833: 'DFF8',21869: 'DFF9',21825: 'DFFA',21845: 'DFFB',21823: 'DFFC',21840: 'DFFD',21820: 'DFFE',21815: 'E0A1',21846: 'E0A2',21877: 'E0A3',21878: 'E0A4',21879: 'E0A5',21811: 'E0A6',21808: 'E0A7',21852: 'E0A8',21899: 'E0A9',21970: 'E0AA',21891: 'E0AB',21937: 'E0AC',21945: 'E0AD',21896: 'E0AE',21889: 'E0AF',21919: 'E0B0',21886: 'E0B1',21974: 'E0B2',21905: 'E0B3',21883: 'E0B4',21983: 'E0B5',21949: 'E0B6',21950: 'E0B7',21908: 'E0B8',21913: 'E0B9',21994: 'E0BA',22007: 'E0BB',21961: 'E0BC',22047: 'E0BD',21969: 'E0BE',21995: 'E0BF',21996: 'E0C0',21972: 'E0C1',21990: 'E0C2',21981: 'E0C3',21956: 'E0C4',21999: 'E0C5',21989: 'E0C6',22002: 'E0C7',22003: 'E0C8',21964: 'E0C9',21965: 'E0CA',21992: 'E0CB',22005: 'E0CC',21988: 'E0CD',36756: 'E0CE',22046: 'E0CF',22024: 'E0D0',22028: 'E0D1',22017: 'E0D2',22052: 'E0D3',22051: 'E0D4',22014: 'E0D5',22016: 'E0D6',22055: 'E0D7',22061: 'E0D8',22104: 'E0D9',22073: 'E0DA',22103: 'E0DB',22060: 'E0DC',22093: 'E0DD',22114: 'E0DE',22105: 'E0DF',22108: 'E0E0',22092: 'E0E1',22100: 'E0E2',22150: 'E0E3',22116: 'E0E4',22129: 'E0E5',22123: 'E0E6',22139: 'E0E7',22140: 'E0E8',22149: 'E0E9',22163: 'E0EA',22191: 'E0EB',22228: 'E0EC',22231: 'E0ED',22237: 'E0EE',22241: 'E0EF',22261: 'E0F0',22251: 'E0F1',22265: 'E0F2',22271: 'E0F3',22276: 'E0F4',22282: 'E0F5',22281: 'E0F6',22300: 'E0F7',24079: 'E0F8',24089: 'E0F9',24084: 'E0FA',24081: 'E0FB',24113: 'E0FC',24123: 'E0FD',24124: 'E0FE',24119: 'E1A1',24132: 'E1A2',24148: 'E1A3',24155: 'E1A4',24158: 'E1A5',24161: 'E1A6',23692: 'E1A7',23674: 'E1A8',23693: 'E1A9',23696: 'E1AA',23702: 'E1AB',23688: 'E1AC',23704: 'E1AD',23705: 'E1AE',23697: 'E1AF',23706: 'E1B0',23708: 'E1B1',23733: 'E1B2',23714: 'E1B3',23741: 'E1B4',23724: 'E1B5',23723: 'E1B6',23729: 'E1B7',23715: 'E1B8',23745: 'E1B9',23735: 'E1BA',23748: 'E1BB',23762: 'E1BC',23780: 'E1BD',23755: 'E1BE',23781: 'E1BF',23810: 'E1C0',23811: 'E1C1',23847: 'E1C2',23846: 'E1C3',23854: 'E1C4',23844: 'E1C5',23838: 'E1C6',23814: 'E1C7',23835: 'E1C8',23896: 'E1C9',23870: 'E1CA',23860: 'E1CB',23869: 'E1CC',23916: 'E1CD',23899: 'E1CE',23919: 'E1CF',23901: 'E1D0',23915: 'E1D1',23883: 'E1D2',23882: 'E1D3',23913: 'E1D4',23924: 'E1D5',23938: 'E1D6',23961: 'E1D7',23965: 'E1D8',35955: 'E1D9',23991: 'E1DA',24005: 'E1DB',24435: 'E1DC',24439: 'E1DD',24450: 'E1DE',24455: 'E1DF',24457: 'E1E0',24460: 'E1E1',24469: 'E1E2',24473: 'E1E3',24476: 'E1E4',24488: 'E1E5',24493: 'E1E6',24501: 'E1E7',24508: 'E1E8',34914: 'E1E9',24417: 'E1EA',29357: 'E1EB',29360: 'E1EC',29364: 'E1ED',29367: 'E1EE',29368: 'E1EF',29379: 'E1F0',29377: 'E1F1',29390: 'E1F2',29389: 'E1F3',29394: 'E1F4',29416: 'E1F5',29423: 'E1F6',29417: 'E1F7',29426: 'E1F8',29428: 'E1F9',29431: 'E1FA',29441: 'E1FB',29427: 'E1FC',29443: 'E1FD',29434: 'E1FE',29435: 'E2A1',29463: 'E2A2',29459: 'E2A3',29473: 'E2A4',29450: 'E2A5',29470: 'E2A6',29469: 'E2A7',29461: 'E2A8',29474: 'E2A9',29497: 'E2AA',29477: 'E2AB',29484: 'E2AC',29496: 'E2AD',29489: 'E2AE',29520: 'E2AF',29517: 'E2B0',29527: 'E2B1',29536: 'E2B2',29548: 'E2B3',29551: 'E2B4',29566: 'E2B5',33307: 'E2B6',22821: 'E2B7',39143: 'E2B8',22820: 'E2B9',22786: 'E2BA',39267: 'E2BB',39271: 'E2BC',39272: 'E2BD',39273: 'E2BE',39274: 'E2BF',39275: 'E2C0',39276: 'E2C1',39284: 'E2C2',39287: 'E2C3',39293: 'E2C4',39296: 'E2C5',39300: 'E2C6',39303: 'E2C7',39306: 'E2C8',39309: 'E2C9',39312: 'E2CA',39313: 'E2CB',39315: 'E2CC',39316: 'E2CD',39317: 'E2CE',24192: 'E2CF',24209: 'E2D0',24203: 'E2D1',24214: 'E2D2',24229: 'E2D3',24224: 'E2D4',24249: 'E2D5',24245: 'E2D6',24254: 'E2D7',24243: 'E2D8',36179: 'E2D9',24274: 'E2DA',24273: 'E2DB',24283: 'E2DC',24296: 'E2DD',24298: 'E2DE',33210: 'E2DF',24516: 'E2E0',24521: 'E2E1',24534: 'E2E2',24527: 'E2E3',24579: 'E2E4',24558: 'E2E5',24580: 'E2E6',24545: 'E2E7',24548: 'E2E8',24574: 'E2E9',24581: 'E2EA',24582: 'E2EB',24554: 'E2EC',24557: 'E2ED',24568: 'E2EE',24601: 'E2EF',24629: 'E2F0',24614: 'E2F1',24603: 'E2F2',24591: 'E2F3',24589: 'E2F4',24617: 'E2F5',24619: 'E2F6',24586: 'E2F7',24639: 'E2F8',24609: 'E2F9',24696: 'E2FA',24697: 'E2FB',24699: 'E2FC',24698: 'E2FD',24642: 'E2FE',24682: 'E3A1',24701: 'E3A2',24726: 'E3A3',24730: 'E3A4',24749: 'E3A5',24733: 'E3A6',24707: 'E3A7',24722: 'E3A8',24716: 'E3A9',24731: 'E3AA',24812: 'E3AB',24763: 'E3AC',24753: 'E3AD',24797: 'E3AE',24792: 'E3AF',24774: 'E3B0',24794: 'E3B1',24756: 'E3B2',24864: 'E3B3',24870: 'E3B4',24853: 'E3B5',24867: 'E3B6',24820: 'E3B7',24832: 'E3B8',24846: 'E3B9',24875: 'E3BA',24906: 'E3BB',24949: 'E3BC',25004: 'E3BD',24980: 'E3BE',24999: 'E3BF',25015: 'E3C0',25044: 'E3C1',25077: 'E3C2',24541: 'E3C3',38579: 'E3C4',38377: 'E3C5',38379: 'E3C6',38385: 'E3C7',38387: 'E3C8',38389: 'E3C9',38390: 'E3CA',38396: 'E3CB',38398: 'E3CC',38403: 'E3CD',38404: 'E3CE',38406: 'E3CF',38408: 'E3D0',38410: 'E3D1',38411: 'E3D2',38412: 'E3D3',38413: 'E3D4',38415: 'E3D5',38418: 'E3D6',38421: 'E3D7',38422: 'E3D8',38423: 'E3D9',38425: 'E3DA',38426: 'E3DB',20012: 'E3DC',29247: 'E3DD',25109: 'E3DE',27701: 'E3DF',27732: 'E3E0',27740: 'E3E1',27722: 'E3E2',27811: 'E3E3',27781: 'E3E4',27792: 'E3E5',27796: 'E3E6',27788: 'E3E7',27752: 'E3E8',27753: 'E3E9',27764: 'E3EA',27766: 'E3EB',27782: 'E3EC',27817: 'E3ED',27856: 'E3EE',27860: 'E3EF',27821: 'E3F0',27895: 'E3F1',27896: 'E3F2',27889: 'E3F3',27863: 'E3F4',27826: 'E3F5',27872: 'E3F6',27862: 'E3F7',27898: 'E3F8',27883: 'E3F9',27886: 'E3FA',27825: 'E3FB',27859: 'E3FC',27887: 'E3FD',27902: 'E3FE',27961: 'E4A1',27943: 'E4A2',27916: 'E4A3',27971: 'E4A4',27976: 'E4A5',27911: 'E4A6',27908: 'E4A7',27929: 'E4A8',27918: 'E4A9',27947: 'E4AA',27981: 'E4AB',27950: 'E4AC',27957: 'E4AD',27930: 'E4AE',27983: 'E4AF',27986: 'E4B0',27988: 'E4B1',27955: 'E4B2',28049: 'E4B3',28015: 'E4B4',28062: 'E4B5',28064: 'E4B6',27998: 'E4B7',28051: 'E4B8',28052: 'E4B9',27996: 'E4BA',28000: 'E4BB',28028: 'E4BC',28003: 'E4BD',28186: 'E4BE',28103: 'E4BF',28101: 'E4C0',28126: 'E4C1',28174: 'E4C2',28095: 'E4C3',28128: 'E4C4',28177: 'E4C5',28134: 'E4C6',28125: 'E4C7',28121: 'E4C8',28182: 'E4C9',28075: 'E4CA',28172: 'E4CB',28078: 'E4CC',28203: 'E4CD',28270: 'E4CE',28238: 'E4CF',28267: 'E4D0',28338: 'E4D1',28255: 'E4D2',28294: 'E4D3',28243: 'E4D4',28244: 'E4D5',28210: 'E4D6',28197: 'E4D7',28228: 'E4D8',28383: 'E4D9',28337: 'E4DA',28312: 'E4DB',28384: 'E4DC',28461: 'E4DD',28386: 'E4DE',28325: 'E4DF',28327: 'E4E0',28349: 'E4E1',28347: 'E4E2',28343: 'E4E3',28375: 'E4E4',28340: 'E4E5',28367: 'E4E6',28303: 'E4E7',28354: 'E4E8',28319: 'E4E9',28514: 'E4EA',28486: 'E4EB',28487: 'E4EC',28452: 'E4ED',28437: 'E4EE',28409: 'E4EF',28463: 'E4F0',28470: 'E4F1',28491: 'E4F2',28532: 'E4F3',28458: 'E4F4',28425: 'E4F5',28457: 'E4F6',28553: 'E4F7',28557: 'E4F8',28556: 'E4F9',28536: 'E4FA',28530: 'E4FB',28540: 'E4FC',28538: 'E4FD',28625: 'E4FE',28617: 'E5A1',28583: 'E5A2',28601: 'E5A3',28598: 'E5A4',28610: 'E5A5',28641: 'E5A6',28654: 'E5A7',28638: 'E5A8',28640: 'E5A9',28655: 'E5AA',28698: 'E5AB',28707: 'E5AC',28699: 'E5AD',28729: 'E5AE',28725: 'E5AF',28751: 'E5B0',28766: 'E5B1',23424: 'E5B2',23428: 'E5B3',23445: 'E5B4',23443: 'E5B5',23461: 'E5B6',23480: 'E5B7',29999: 'E5B8',39582: 'E5B9',25652: 'E5BA',23524: 'E5BB',23534: 'E5BC',35120: 'E5BD',23536: 'E5BE',36423: 'E5BF',35591: 'E5C0',36790: 'E5C1',36819: 'E5C2',36821: 'E5C3',36837: 'E5C4',36846: 'E5C5',36836: 'E5C6',36841: 'E5C7',36838: 'E5C8',36851: 'E5C9',36840: 'E5CA',36869: 'E5CB',36868: 'E5CC',36875: 'E5CD',36902: 'E5CE',36881: 'E5CF',36877: 'E5D0',36886: 'E5D1',36897: 'E5D2',36917: 'E5D3',36918: 'E5D4',36909: 'E5D5',36911: 'E5D6',36932: 'E5D7',36945: 'E5D8',36946: 'E5D9',36944: 'E5DA',36968: 'E5DB',36952: 'E5DC',36962: 'E5DD',36955: 'E5DE',26297: 'E5DF',36980: 'E5E0',36989: 'E5E1',36994: 'E5E2',37000: 'E5E3',36995: 'E5E4',37003: 'E5E5',24400: 'E5E6',24407: 'E5E7',24406: 'E5E8',24408: 'E5E9',23611: 'E5EA',21675: 'E5EB',23632: 'E5EC',23641: 'E5ED',23409: 'E5EE',23651: 'E5EF',23654: 'E5F0',32700: 'E5F1',24362: 'E5F2',24361: 'E5F3',24365: 'E5F4',33396: 'E5F5',24380: 'E5F6',39739: 'E5F7',23662: 'E5F8',22913: 'E5F9',22915: 'E5FA',22925: 'E5FB',22953: 'E5FC',22954: 'E5FD',22947: 'E5FE',22935: 'E6A1',22986: 'E6A2',22955: 'E6A3',22942: 'E6A4',22948: 'E6A5',22994: 'E6A6',22962: 'E6A7',22959: 'E6A8',22999: 'E6A9',22974: 'E6AA',23045: 'E6AB',23046: 'E6AC',23005: 'E6AD',23048: 'E6AE',23011: 'E6AF',23000: 'E6B0',23033: 'E6B1',23052: 'E6B2',23049: 'E6B3',23090: 'E6B4',23092: 'E6B5',23057: 'E6B6',23075: 'E6B7',23059: 'E6B8',23104: 'E6B9',23143: 'E6BA',23114: 'E6BB',23125: 'E6BC',23100: 'E6BD',23138: 'E6BE',23157: 'E6BF',33004: 'E6C0',23210: 'E6C1',23195: 'E6C2',23159: 'E6C3',23162: 'E6C4',23230: 'E6C5',23275: 'E6C6',23218: 'E6C7',23250: 'E6C8',23252: 'E6C9',23224: 'E6CA',23264: 'E6CB',23267: 'E6CC',23281: 'E6CD',23254: 'E6CE',23270: 'E6CF',23256: 'E6D0',23260: 'E6D1',23305: 'E6D2',23319: 'E6D3',23318: 'E6D4',23346: 'E6D5',23351: 'E6D6',23360: 'E6D7',23573: 'E6D8',23580: 'E6D9',23386: 'E6DA',23397: 'E6DB',23411: 'E6DC',23377: 'E6DD',23379: 'E6DE',23394: 'E6DF',39541: 'E6E0',39543: 'E6E1',39544: 'E6E2',39546: 'E6E3',39551: 'E6E4',39549: 'E6E5',39552: 'E6E6',39553: 'E6E7',39557: 'E6E8',39560: 'E6E9',39562: 'E6EA',39568: 'E6EB',39570: 'E6EC',39571: 'E6ED',39574: 'E6EE',39576: 'E6EF',39579: 'E6F0',39580: 'E6F1',39581: 'E6F2',39583: 'E6F3',39584: 'E6F4',39586: 'E6F5',39587: 'E6F6',39589: 'E6F7',39591: 'E6F8',32415: 'E6F9',32417: 'E6FA',32419: 'E6FB',32421: 'E6FC',32424: 'E6FD',32425: 'E6FE',32429: 'E7A1',32432: 'E7A2',32446: 'E7A3',32448: 'E7A4',32449: 'E7A5',32450: 'E7A6',32457: 'E7A7',32459: 'E7A8',32460: 'E7A9',32464: 'E7AA',32468: 'E7AB',32471: 'E7AC',32475: 'E7AD',32480: 'E7AE',32481: 'E7AF',32488: 'E7B0',32491: 'E7B1',32494: 'E7B2',32495: 'E7B3',32497: 'E7B4',32498: 'E7B5',32525: 'E7B6',32502: 'E7B7',32506: 'E7B8',32507: 'E7B9',32510: 'E7BA',32513: 'E7BB',32514: 'E7BC',32515: 'E7BD',32519: 'E7BE',32520: 'E7BF',32523: 'E7C0',32524: 'E7C1',32527: 'E7C2',32529: 'E7C3',32530: 'E7C4',32535: 'E7C5',32537: 'E7C6',32540: 'E7C7',32539: 'E7C8',32543: 'E7C9',32545: 'E7CA',32546: 'E7CB',32547: 'E7CC',32548: 'E7CD',32549: 'E7CE',32550: 'E7CF',32551: 'E7D0',32554: 'E7D1',32555: 'E7D2',32556: 'E7D3',32557: 'E7D4',32559: 'E7D5',32560: 'E7D6',32561: 'E7D7',32562: 'E7D8',32563: 'E7D9',32565: 'E7DA',24186: 'E7DB',30079: 'E7DC',24027: 'E7DD',30014: 'E7DE',37013: 'E7DF',29582: 'E7E0',29585: 'E7E1',29614: 'E7E2',29602: 'E7E3',29599: 'E7E4',29647: 'E7E5',29634: 'E7E6',29649: 'E7E7',29623: 'E7E8',29619: 'E7E9',29632: 'E7EA',29641: 'E7EB',29640: 'E7EC',29669: 'E7ED',29657: 'E7EE',39036: 'E7EF',29706: 'E7F0',29673: 'E7F1',29671: 'E7F2',29662: 'E7F3',29626: 'E7F4',29682: 'E7F5',29711: 'E7F6',29738: 'E7F7',29787: 'E7F8',29734: 'E7F9',29733: 'E7FA',29736: 'E7FB',29744: 'E7FC',29742: 'E7FD',29740: 'E7FE',29723: 'E8A1',29722: 'E8A2',29761: 'E8A3',29788: 'E8A4',29783: 'E8A5',29781: 'E8A6',29785: 'E8A7',29815: 'E8A8',29805: 'E8A9',29822: 'E8AA',29852: 'E8AB',29838: 'E8AC',29824: 'E8AD',29825: 'E8AE',29831: 'E8AF',29835: 'E8B0',29854: 'E8B1',29864: 'E8B2',29865: 'E8B3',29840: 'E8B4',29863: 'E8B5',29906: 'E8B6',29882: 'E8B7',38890: 'E8B8',38891: 'E8B9',38892: 'E8BA',26444: 'E8BB',26451: 'E8BC',26462: 'E8BD',26440: 'E8BE',26473: 'E8BF',26533: 'E8C0',26503: 'E8C1',26474: 'E8C2',26483: 'E8C3',26520: 'E8C4',26535: 'E8C5',26485: 'E8C6',26536: 'E8C7',26526: 'E8C8',26541: 'E8C9',26507: 'E8CA',26487: 'E8CB',26492: 'E8CC',26608: 'E8CD',26633: 'E8CE',26584: 'E8CF',26634: 'E8D0',26601: 'E8D1',26544: 'E8D2',26636: 'E8D3',26585: 'E8D4',26549: 'E8D5',26586: 'E8D6',26547: 'E8D7',26589: 'E8D8',26624: 'E8D9',26563: 'E8DA',26552: 'E8DB',26594: 'E8DC',26638: 'E8DD',26561: 'E8DE',26621: 'E8DF',26674: 'E8E0',26675: 'E8E1',26720: 'E8E2',26721: 'E8E3',26702: 'E8E4',26722: 'E8E5',26692: 'E8E6',26724: 'E8E7',26755: 'E8E8',26653: 'E8E9',26709: 'E8EA',26726: 'E8EB',26689: 'E8EC',26727: 'E8ED',26688: 'E8EE',26686: 'E8EF',26698: 'E8F0',26697: 'E8F1',26665: 'E8F2',26805: 'E8F3',26767: 'E8F4',26740: 'E8F5',26743: 'E8F6',26771: 'E8F7',26731: 'E8F8',26818: 'E8F9',26990: 'E8FA',26876: 'E8FB',26911: 'E8FC',26912: 'E8FD',26873: 'E8FE',26916: 'E9A1',26864: 'E9A2',26891: 'E9A3',26881: 'E9A4',26967: 'E9A5',26851: 'E9A6',26896: 'E9A7',26993: 'E9A8',26937: 'E9A9',26976: 'E9AA',26946: 'E9AB',26973: 'E9AC',27012: 'E9AD',26987: 'E9AE',27008: 'E9AF',27032: 'E9B0',27000: 'E9B1',26932: 'E9B2',27084: 'E9B3',27015: 'E9B4',27016: 'E9B5',27086: 'E9B6',27017: 'E9B7',26982: 'E9B8',26979: 'E9B9',27001: 'E9BA',27035: 'E9BB',27047: 'E9BC',27067: 'E9BD',27051: 'E9BE',27053: 'E9BF',27092: 'E9C0',27057: 'E9C1',27073: 'E9C2',27082: 'E9C3',27103: 'E9C4',27029: 'E9C5',27104: 'E9C6',27021: 'E9C7',27135: 'E9C8',27183: 'E9C9',27117: 'E9CA',27159: 'E9CB',27160: 'E9CC',27237: 'E9CD',27122: 'E9CE',27204: 'E9CF',27198: 'E9D0',27296: 'E9D1',27216: 'E9D2',27227: 'E9D3',27189: 'E9D4',27278: 'E9D5',27257: 'E9D6',27197: 'E9D7',27176: 'E9D8',27224: 'E9D9',27260: 'E9DA',27281: 'E9DB',27280: 'E9DC',27305: 'E9DD',27287: 'E9DE',27307: 'E9DF',29495: 'E9E0',29522: 'E9E1',27521: 'E9E2',27522: 'E9E3',27527: 'E9E4',27524: 'E9E5',27538: 'E9E6',27539: 'E9E7',27533: 'E9E8',27546: 'E9E9',27547: 'E9EA',27553: 'E9EB',27562: 'E9EC',36715: 'E9ED',36717: 'E9EE',36721: 'E9EF',36722: 'E9F0',36723: 'E9F1',36725: 'E9F2',36726: 'E9F3',36728: 'E9F4',36727: 'E9F5',36729: 'E9F6',36730: 'E9F7',36732: 'E9F8',36734: 'E9F9',36737: 'E9FA',36738: 'E9FB',36740: 'E9FC',36743: 'E9FD',36747: 'E9FE',36749: 'EAA1',36750: 'EAA2',36751: 'EAA3',36760: 'EAA4',36762: 'EAA5',36558: 'EAA6',25099: 'EAA7',25111: 'EAA8',25115: 'EAA9',25119: 'EAAA',25122: 'EAAB',25121: 'EAAC',25125: 'EAAD',25124: 'EAAE',25132: 'EAAF',33255: 'EAB0',29935: 'EAB1',29940: 'EAB2',29951: 'EAB3',29967: 'EAB4',29969: 'EAB5',29971: 'EAB6',25908: 'EAB7',26094: 'EAB8',26095: 'EAB9',26096: 'EABA',26122: 'EABB',26137: 'EABC',26482: 'EABD',26115: 'EABE',26133: 'EABF',26112: 'EAC0',28805: 'EAC1',26359: 'EAC2',26141: 'EAC3',26164: 'EAC4',26161: 'EAC5',26166: 'EAC6',26165: 'EAC7',32774: 'EAC8',26207: 'EAC9',26196: 'EACA',26177: 'EACB',26191: 'EACC',26198: 'EACD',26209: 'EACE',26199: 'EACF',26231: 'EAD0',26244: 'EAD1',26252: 'EAD2',26279: 'EAD3',26269: 'EAD4',26302: 'EAD5',26331: 'EAD6',26332: 'EAD7',26342: 'EAD8',26345: 'EAD9',36146: 'EADA',36147: 'EADB',36150: 'EADC',36155: 'EADD',36157: 'EADE',36160: 'EADF',36165: 'EAE0',36166: 'EAE1',36168: 'EAE2',36169: 'EAE3',36167: 'EAE4',36173: 'EAE5',36181: 'EAE6',36185: 'EAE7',35271: 'EAE8',35274: 'EAE9',35275: 'EAEA',35276: 'EAEB',35278: 'EAEC',35279: 'EAED',35280: 'EAEE',35281: 'EAEF',29294: 'EAF0',29343: 'EAF1',29277: 'EAF2',29286: 'EAF3',29295: 'EAF4',29310: 'EAF5',29311: 'EAF6',29316: 'EAF7',29323: 'EAF8',29325: 'EAF9',29327: 'EAFA',29330: 'EAFB',25352: 'EAFC',25394: 'EAFD',25520: 'EAFE',25663: 'EBA1',25816: 'EBA2',32772: 'EBA3',27626: 'EBA4',27635: 'EBA5',27645: 'EBA6',27637: 'EBA7',27641: 'EBA8',27653: 'EBA9',27655: 'EBAA',27654: 'EBAB',27661: 'EBAC',27669: 'EBAD',27672: 'EBAE',27673: 'EBAF',27674: 'EBB0',27681: 'EBB1',27689: 'EBB2',27684: 'EBB3',27690: 'EBB4',27698: 'EBB5',25909: 'EBB6',25941: 'EBB7',25963: 'EBB8',29261: 'EBB9',29266: 'EBBA',29270: 'EBBB',29232: 'EBBC',34402: 'EBBD',21014: 'EBBE',32927: 'EBBF',32924: 'EBC0',32915: 'EBC1',32956: 'EBC2',26378: 'EBC3',32957: 'EBC4',32945: 'EBC5',32939: 'EBC6',32941: 'EBC7',32948: 'EBC8',32951: 'EBC9',32999: 'EBCA',33000: 'EBCB',33001: 'EBCC',33002: 'EBCD',32987: 'EBCE',32962: 'EBCF',32964: 'EBD0',32985: 'EBD1',32973: 'EBD2',32983: 'EBD3',26384: 'EBD4',32989: 'EBD5',33003: 'EBD6',33009: 'EBD7',33012: 'EBD8',33005: 'EBD9',33037: 'EBDA',33038: 'EBDB',33010: 'EBDC',33020: 'EBDD',26389: 'EBDE',33042: 'EBDF',35930: 'EBE0',33078: 'EBE1',33054: 'EBE2',33068: 'EBE3',33048: 'EBE4',33074: 'EBE5',33096: 'EBE6',33100: 'EBE7',33107: 'EBE8',33140: 'EBE9',33113: 'EBEA',33114: 'EBEB',33137: 'EBEC',33120: 'EBED',33129: 'EBEE',33148: 'EBEF',33149: 'EBF0',33133: 'EBF1',33127: 'EBF2',22605: 'EBF3',23221: 'EBF4',33160: 'EBF5',33154: 'EBF6',33169: 'EBF7',28373: 'EBF8',33187: 'EBF9',33194: 'EBFA',33228: 'EBFB',26406: 'EBFC',33226: 'EBFD',33211: 'EBFE',33217: 'ECA1',33190: 'ECA2',27428: 'ECA3',27447: 'ECA4',27449: 'ECA5',27459: 'ECA6',27462: 'ECA7',27481: 'ECA8',39121: 'ECA9',39122: 'ECAA',39123: 'ECAB',39125: 'ECAC',39129: 'ECAD',39130: 'ECAE',27571: 'ECAF',24384: 'ECB0',27586: 'ECB1',35315: 'ECB2',26000: 'ECB3',40785: 'ECB4',26003: 'ECB5',26044: 'ECB6',26054: 'ECB7',26052: 'ECB8',26051: 'ECB9',26060: 'ECBA',26062: 'ECBB',26066: 'ECBC',26070: 'ECBD',28800: 'ECBE',28828: 'ECBF',28822: 'ECC0',28829: 'ECC1',28859: 'ECC2',28864: 'ECC3',28855: 'ECC4',28843: 'ECC5',28849: 'ECC6',28904: 'ECC7',28874: 'ECC8',28944: 'ECC9',28947: 'ECCA',28950: 'ECCB',28975: 'ECCC',28977: 'ECCD',29043: 'ECCE',29020: 'ECCF',29032: 'ECD0',28997: 'ECD1',29042: 'ECD2',29002: 'ECD3',29048: 'ECD4',29050: 'ECD5',29080: 'ECD6',29107: 'ECD7',29109: 'ECD8',29096: 'ECD9',29088: 'ECDA',29152: 'ECDB',29140: 'ECDC',29159: 'ECDD',29177: 'ECDE',29213: 'ECDF',29224: 'ECE0',28780: 'ECE1',28952: 'ECE2',29030: 'ECE3',29113: 'ECE4',25150: 'ECE5',25149: 'ECE6',25155: 'ECE7',25160: 'ECE8',25161: 'ECE9',31035: 'ECEA',31040: 'ECEB',31046: 'ECEC',31049: 'ECED',31067: 'ECEE',31068: 'ECEF',31059: 'ECF0',31066: 'ECF1',31074: 'ECF2',31063: 'ECF3',31072: 'ECF4',31087: 'ECF5',31079: 'ECF6',31098: 'ECF7',31109: 'ECF8',31114: 'ECF9',31130: 'ECFA',31143: 'ECFB',31155: 'ECFC',24529: 'ECFD',24528: 'ECFE',24636: 'EDA1',24669: 'EDA2',24666: 'EDA3',24679: 'EDA4',24641: 'EDA5',24665: 'EDA6',24675: 'EDA7',24747: 'EDA8',24838: 'EDA9',24845: 'EDAA',24925: 'EDAB',25001: 'EDAC',24989: 'EDAD',25035: 'EDAE',25041: 'EDAF',25094: 'EDB0',32896: 'EDB1',32895: 'EDB2',27795: 'EDB3',27894: 'EDB4',28156: 'EDB5',30710: 'EDB6',30712: 'EDB7',30720: 'EDB8',30729: 'EDB9',30743: 'EDBA',30744: 'EDBB',30737: 'EDBC',26027: 'EDBD',30765: 'EDBE',30748: 'EDBF',30749: 'EDC0',30777: 'EDC1',30778: 'EDC2',30779: 'EDC3',30751: 'EDC4',30780: 'EDC5',30757: 'EDC6',30764: 'EDC7',30755: 'EDC8',30761: 'EDC9',30798: 'EDCA',30829: 'EDCB',30806: 'EDCC',30807: 'EDCD',30758: 'EDCE',30800: 'EDCF',30791: 'EDD0',30796: 'EDD1',30826: 'EDD2',30875: 'EDD3',30867: 'EDD4',30874: 'EDD5',30855: 'EDD6',30876: 'EDD7',30881: 'EDD8',30883: 'EDD9',30898: 'EDDA',30905: 'EDDB',30885: 'EDDC',30932: 'EDDD',30937: 'EDDE',30921: 'EDDF',30956: 'EDE0',30962: 'EDE1',30981: 'EDE2',30964: 'EDE3',30995: 'EDE4',31012: 'EDE5',31006: 'EDE6',31028: 'EDE7',40859: 'EDE8',40697: 'EDE9',40699: 'EDEA',40700: 'EDEB',30449: 'EDEC',30468: 'EDED',30477: 'EDEE',30457: 'EDEF',30471: 'EDF0',30472: 'EDF1',30490: 'EDF2',30498: 'EDF3',30489: 'EDF4',30509: 'EDF5',30502: 'EDF6',30517: 'EDF7',30520: 'EDF8',30544: 'EDF9',30545: 'EDFA',30535: 'EDFB',30531: 'EDFC',30554: 'EDFD',30568: 'EDFE',30562: 'EEA1',30565: 'EEA2',30591: 'EEA3',30605: 'EEA4',30589: 'EEA5',30592: 'EEA6',30604: 'EEA7',30609: 'EEA8',30623: 'EEA9',30624: 'EEAA',30640: 'EEAB',30645: 'EEAC',30653: 'EEAD',30010: 'EEAE',30016: 'EEAF',30030: 'EEB0',30027: 'EEB1',30024: 'EEB2',30043: 'EEB3',30066: 'EEB4',30073: 'EEB5',30083: 'EEB6',32600: 'EEB7',32609: 'EEB8',32607: 'EEB9',35400: 'EEBA',32616: 'EEBB',32628: 'EEBC',32625: 'EEBD',32633: 'EEBE',32641: 'EEBF',32638: 'EEC0',30413: 'EEC1',30437: 'EEC2',34866: 'EEC3',38021: 'EEC4',38022: 'EEC5',38023: 'EEC6',38027: 'EEC7',38026: 'EEC8',38028: 'EEC9',38029: 'EECA',38031: 'EECB',38032: 'EECC',38036: 'EECD',38039: 'EECE',38037: 'EECF',38042: 'EED0',38043: 'EED1',38044: 'EED2',38051: 'EED3',38052: 'EED4',38059: 'EED5',38058: 'EED6',38061: 'EED7',38060: 'EED8',38063: 'EED9',38064: 'EEDA',38066: 'EEDB',38068: 'EEDC',38070: 'EEDD',38071: 'EEDE',38072: 'EEDF',38073: 'EEE0',38074: 'EEE1',38076: 'EEE2',38077: 'EEE3',38079: 'EEE4',38084: 'EEE5',38088: 'EEE6',38089: 'EEE7',38090: 'EEE8',38091: 'EEE9',38092: 'EEEA',38093: 'EEEB',38094: 'EEEC',38096: 'EEED',38097: 'EEEE',38098: 'EEEF',38101: 'EEF0',38102: 'EEF1',38103: 'EEF2',38105: 'EEF3',38104: 'EEF4',38107: 'EEF5',38110: 'EEF6',38111: 'EEF7',38112: 'EEF8',38114: 'EEF9',38116: 'EEFA',38117: 'EEFB',38119: 'EEFC',38120: 'EEFD',38122: 'EEFE',38121: 'EFA1',38123: 'EFA2',38126: 'EFA3',38127: 'EFA4',38131: 'EFA5',38132: 'EFA6',38133: 'EFA7',38135: 'EFA8',38137: 'EFA9',38140: 'EFAA',38141: 'EFAB',38143: 'EFAC',38147: 'EFAD',38146: 'EFAE',38150: 'EFAF',38151: 'EFB0',38153: 'EFB1',38154: 'EFB2',38157: 'EFB3',38158: 'EFB4',38159: 'EFB5',38162: 'EFB6',38163: 'EFB7',38164: 'EFB8',38165: 'EFB9',38166: 'EFBA',38168: 'EFBB',38171: 'EFBC',38173: 'EFBD',38174: 'EFBE',38175: 'EFBF',38178: 'EFC0',38186: 'EFC1',38187: 'EFC2',38185: 'EFC3',38188: 'EFC4',38193: 'EFC5',38194: 'EFC6',38196: 'EFC7',38198: 'EFC8',38199: 'EFC9',38200: 'EFCA',38204: 'EFCB',38206: 'EFCC',38207: 'EFCD',38210: 'EFCE',38197: 'EFCF',38212: 'EFD0',38213: 'EFD1',38214: 'EFD2',38217: 'EFD3',38220: 'EFD4',38222: 'EFD5',38223: 'EFD6',38226: 'EFD7',38227: 'EFD8',38228: 'EFD9',38230: 'EFDA',38231: 'EFDB',38232: 'EFDC',38233: 'EFDD',38235: 'EFDE',38238: 'EFDF',38239: 'EFE0',38237: 'EFE1',38241: 'EFE2',38242: 'EFE3',38244: 'EFE4',38245: 'EFE5',38246: 'EFE6',38247: 'EFE7',38248: 'EFE8',38249: 'EFE9',38250: 'EFEA',38251: 'EFEB',38252: 'EFEC',38255: 'EFED',38257: 'EFEE',38258: 'EFEF',38259: 'EFF0',38202: 'EFF1',30695: 'EFF2',30700: 'EFF3',38601: 'EFF4',31189: 'EFF5',31213: 'EFF6',31203: 'EFF7',31211: 'EFF8',31238: 'EFF9',23879: 'EFFA',31235: 'EFFB',31234: 'EFFC',31262: 'EFFD',31252: 'EFFE',31289: 'F0A1',31287: 'F0A2',31313: 'F0A3',40655: 'F0A4',39333: 'F0A5',31344: 'F0A6',30344: 'F0A7',30350: 'F0A8',30355: 'F0A9',30361: 'F0AA',30372: 'F0AB',29918: 'F0AC',29920: 'F0AD',29996: 'F0AE',40480: 'F0AF',40482: 'F0B0',40488: 'F0B1',40489: 'F0B2',40490: 'F0B3',40491: 'F0B4',40492: 'F0B5',40498: 'F0B6',40497: 'F0B7',40502: 'F0B8',40504: 'F0B9',40503: 'F0BA',40505: 'F0BB',40506: 'F0BC',40510: 'F0BD',40513: 'F0BE',40514: 'F0BF',40516: 'F0C0',40518: 'F0C1',40519: 'F0C2',40520: 'F0C3',40521: 'F0C4',40523: 'F0C5',40524: 'F0C6',40526: 'F0C7',40529: 'F0C8',40533: 'F0C9',40535: 'F0CA',40538: 'F0CB',40539: 'F0CC',40540: 'F0CD',40542: 'F0CE',40547: 'F0CF',40550: 'F0D0',40551: 'F0D1',40552: 'F0D2',40553: 'F0D3',40554: 'F0D4',40555: 'F0D5',40556: 'F0D6',40561: 'F0D7',40557: 'F0D8',40563: 'F0D9',30098: 'F0DA',30100: 'F0DB',30102: 'F0DC',30112: 'F0DD',30109: 'F0DE',30124: 'F0DF',30115: 'F0E0',30131: 'F0E1',30132: 'F0E2',30136: 'F0E3',30148: 'F0E4',30129: 'F0E5',30128: 'F0E6',30147: 'F0E7',30146: 'F0E8',30166: 'F0E9',30157: 'F0EA',30179: 'F0EB',30184: 'F0EC',30182: 'F0ED',30180: 'F0EE',30187: 'F0EF',30183: 'F0F0',30211: 'F0F1',30193: 'F0F2',30204: 'F0F3',30207: 'F0F4',30224: 'F0F5',30208: 'F0F6',30213: 'F0F7',30220: 'F0F8',30231: 'F0F9',30218: 'F0FA',30245: 'F0FB',30232: 'F0FC',30229: 'F0FD',30233: 'F0FE',30235: 'F1A1',30268: 'F1A2',30242: 'F1A3',30240: 'F1A4',30272: 'F1A5',30253: 'F1A6',30256: 'F1A7',30271: 'F1A8',30261: 'F1A9',30275: 'F1AA',30270: 'F1AB',30259: 'F1AC',30285: 'F1AD',30302: 'F1AE',30292: 'F1AF',30300: 'F1B0',30294: 'F1B1',30315: 'F1B2',30319: 'F1B3',32714: 'F1B4',31462: 'F1B5',31352: 'F1B6',31353: 'F1B7',31360: 'F1B8',31366: 'F1B9',31368: 'F1BA',31381: 'F1BB',31398: 'F1BC',31392: 'F1BD',31404: 'F1BE',31400: 'F1BF',31405: 'F1C0',31411: 'F1C1',34916: 'F1C2',34921: 'F1C3',34930: 'F1C4',34941: 'F1C5',34943: 'F1C6',34946: 'F1C7',34978: 'F1C8',35014: 'F1C9',34999: 'F1CA',35004: 'F1CB',35017: 'F1CC',35042: 'F1CD',35022: 'F1CE',35043: 'F1CF',35045: 'F1D0',35057: 'F1D1',35098: 'F1D2',35068: 'F1D3',35048: 'F1D4',35070: 'F1D5',35056: 'F1D6',35105: 'F1D7',35097: 'F1D8',35091: 'F1D9',35099: 'F1DA',35082: 'F1DB',35124: 'F1DC',35115: 'F1DD',35126: 'F1DE',35137: 'F1DF',35174: 'F1E0',35195: 'F1E1',30091: 'F1E2',32997: 'F1E3',30386: 'F1E4',30388: 'F1E5',30684: 'F1E6',32786: 'F1E7',32788: 'F1E8',32790: 'F1E9',32796: 'F1EA',32800: 'F1EB',32802: 'F1EC',32805: 'F1ED',32806: 'F1EE',32807: 'F1EF',32809: 'F1F0',32808: 'F1F1',32817: 'F1F2',32779: 'F1F3',32821: 'F1F4',32835: 'F1F5',32838: 'F1F6',32845: 'F1F7',32850: 'F1F8',32873: 'F1F9',32881: 'F1FA',35203: 'F1FB',39032: 'F1FC',39040: 'F1FD',39043: 'F1FE',39049: 'F2A1',39052: 'F2A2',39053: 'F2A3',39055: 'F2A4',39060: 'F2A5',39066: 'F2A6',39067: 'F2A7',39070: 'F2A8',39071: 'F2A9',39073: 'F2AA',39074: 'F2AB',39077: 'F2AC',39078: 'F2AD',34381: 'F2AE',34388: 'F2AF',34412: 'F2B0',34414: 'F2B1',34431: 'F2B2',34426: 'F2B3',34428: 'F2B4',34427: 'F2B5',34472: 'F2B6',34445: 'F2B7',34443: 'F2B8',34476: 'F2B9',34461: 'F2BA',34471: 'F2BB',34467: 'F2BC',34474: 'F2BD',34451: 'F2BE',34473: 'F2BF',34486: 'F2C0',34500: 'F2C1',34485: 'F2C2',34510: 'F2C3',34480: 'F2C4',34490: 'F2C5',34481: 'F2C6',34479: 'F2C7',34505: 'F2C8',34511: 'F2C9',34484: 'F2CA',34537: 'F2CB',34545: 'F2CC',34546: 'F2CD',34541: 'F2CE',34547: 'F2CF',34512: 'F2D0',34579: 'F2D1',34526: 'F2D2',34548: 'F2D3',34527: 'F2D4',34520: 'F2D5',34513: 'F2D6',34563: 'F2D7',34567: 'F2D8',34552: 'F2D9',34568: 'F2DA',34570: 'F2DB',34573: 'F2DC',34569: 'F2DD',34595: 'F2DE',34619: 'F2DF',34590: 'F2E0',34597: 'F2E1',34606: 'F2E2',34586: 'F2E3',34622: 'F2E4',34632: 'F2E5',34612: 'F2E6',34609: 'F2E7',34601: 'F2E8',34615: 'F2E9',34623: 'F2EA',34690: 'F2EB',34594: 'F2EC',34685: 'F2ED',34686: 'F2EE',34683: 'F2EF',34656: 'F2F0',34672: 'F2F1',34636: 'F2F2',34670: 'F2F3',34699: 'F2F4',34643: 'F2F5',34659: 'F2F6',34684: 'F2F7',34660: 'F2F8',34649: 'F2F9',34661: 'F2FA',34707: 'F2FB',34735: 'F2FC',34728: 'F2FD',34770: 'F2FE',34758: 'F3A1',34696: 'F3A2',34693: 'F3A3',34733: 'F3A4',34711: 'F3A5',34691: 'F3A6',34731: 'F3A7',34789: 'F3A8',34732: 'F3A9',34741: 'F3AA',34739: 'F3AB',34763: 'F3AC',34771: 'F3AD',34749: 'F3AE',34769: 'F3AF',34752: 'F3B0',34762: 'F3B1',34779: 'F3B2',34794: 'F3B3',34784: 'F3B4',34798: 'F3B5',34838: 'F3B6',34835: 'F3B7',34814: 'F3B8',34826: 'F3B9',34843: 'F3BA',34849: 'F3BB',34873: 'F3BC',34876: 'F3BD',32566: 'F3BE',32578: 'F3BF',32580: 'F3C0',32581: 'F3C1',33296: 'F3C2',31482: 'F3C3',31485: 'F3C4',31496: 'F3C5',31491: 'F3C6',31492: 'F3C7',31509: 'F3C8',31498: 'F3C9',31531: 'F3CA',31503: 'F3CB',31559: 'F3CC',31544: 'F3CD',31530: 'F3CE',31513: 'F3CF',31534: 'F3D0',31537: 'F3D1',31520: 'F3D2',31525: 'F3D3',31524: 'F3D4',31539: 'F3D5',31550: 'F3D6',31518: 'F3D7',31576: 'F3D8',31578: 'F3D9',31557: 'F3DA',31605: 'F3DB',31564: 'F3DC',31581: 'F3DD',31584: 'F3DE',31598: 'F3DF',31611: 'F3E0',31586: 'F3E1',31602: 'F3E2',31601: 'F3E3',31632: 'F3E4',31654: 'F3E5',31655: 'F3E6',31672: 'F3E7',31660: 'F3E8',31645: 'F3E9',31656: 'F3EA',31621: 'F3EB',31658: 'F3EC',31644: 'F3ED',31650: 'F3EE',31659: 'F3EF',31668: 'F3F0',31697: 'F3F1',31681: 'F3F2',31692: 'F3F3',31709: 'F3F4',31706: 'F3F5',31717: 'F3F6',31718: 'F3F7',31722: 'F3F8',31756: 'F3F9',31742: 'F3FA',31740: 'F3FB',31759: 'F3FC',31766: 'F3FD',31755: 'F3FE',31775: 'F4A1',31786: 'F4A2',31782: 'F4A3',31800: 'F4A4',31809: 'F4A5',31808: 'F4A6',33278: 'F4A7',33281: 'F4A8',33282: 'F4A9',33284: 'F4AA',33260: 'F4AB',34884: 'F4AC',33313: 'F4AD',33314: 'F4AE',33315: 'F4AF',33325: 'F4B0',33327: 'F4B1',33320: 'F4B2',33323: 'F4B3',33336: 'F4B4',33339: 'F4B5',33331: 'F4B6',33332: 'F4B7',33342: 'F4B8',33348: 'F4B9',33353: 'F4BA',33355: 'F4BB',33359: 'F4BC',33370: 'F4BD',33375: 'F4BE',33384: 'F4BF',34942: 'F4C0',34949: 'F4C1',34952: 'F4C2',35032: 'F4C3',35039: 'F4C4',35166: 'F4C5',32669: 'F4C6',32671: 'F4C7',32679: 'F4C8',32687: 'F4C9',32688: 'F4CA',32690: 'F4CB',31868: 'F4CC',25929: 'F4CD',31889: 'F4CE',31901: 'F4CF',31900: 'F4D0',31902: 'F4D1',31906: 'F4D2',31922: 'F4D3',31932: 'F4D4',31933: 'F4D5',31937: 'F4D6',31943: 'F4D7',31948: 'F4D8',31949: 'F4D9',31944: 'F4DA',31941: 'F4DB',31959: 'F4DC',31976: 'F4DD',33390: 'F4DE',26280: 'F4DF',32703: 'F4E0',32718: 'F4E1',32725: 'F4E2',32741: 'F4E3',32737: 'F4E4',32742: 'F4E5',32745: 'F4E6',32750: 'F4E7',32755: 'F4E8',31992: 'F4E9',32119: 'F4EA',32166: 'F4EB',32174: 'F4EC',32327: 'F4ED',32411: 'F4EE',40632: 'F4EF',40628: 'F4F0',36211: 'F4F1',36228: 'F4F2',36244: 'F4F3',36241: 'F4F4',36273: 'F4F5',36199: 'F4F6',36205: 'F4F7',35911: 'F4F8',35913: 'F4F9',37194: 'F4FA',37200: 'F4FB',37198: 'F4FC',37199: 'F4FD',37220: 'F4FE',37218: 'F5A1',37217: 'F5A2',37232: 'F5A3',37225: 'F5A4',37231: 'F5A5',37245: 'F5A6',37246: 'F5A7',37234: 'F5A8',37236: 'F5A9',37241: 'F5AA',37260: 'F5AB',37253: 'F5AC',37264: 'F5AD',37261: 'F5AE',37265: 'F5AF',37282: 'F5B0',37283: 'F5B1',37290: 'F5B2',37293: 'F5B3',37294: 'F5B4',37295: 'F5B5',37301: 'F5B6',37300: 'F5B7',37306: 'F5B8',35925: 'F5B9',40574: 'F5BA',36280: 'F5BB',36331: 'F5BC',36357: 'F5BD',36441: 'F5BE',36457: 'F5BF',36277: 'F5C0',36287: 'F5C1',36284: 'F5C2',36282: 'F5C3',36292: 'F5C4',36310: 'F5C5',36311: 'F5C6',36314: 'F5C7',36318: 'F5C8',36302: 'F5C9',36303: 'F5CA',36315: 'F5CB',36294: 'F5CC',36332: 'F5CD',36343: 'F5CE',36344: 'F5CF',36323: 'F5D0',36345: 'F5D1',36347: 'F5D2',36324: 'F5D3',36361: 'F5D4',36349: 'F5D5',36372: 'F5D6',36381: 'F5D7',36383: 'F5D8',36396: 'F5D9',36398: 'F5DA',36387: 'F5DB',36399: 'F5DC',36410: 'F5DD',36416: 'F5DE',36409: 'F5DF',36405: 'F5E0',36413: 'F5E1',36401: 'F5E2',36425: 'F5E3',36417: 'F5E4',36418: 'F5E5',36433: 'F5E6',36434: 'F5E7',36426: 'F5E8',36464: 'F5E9',36470: 'F5EA',36476: 'F5EB',36463: 'F5EC',36468: 'F5ED',36485: 'F5EE',36495: 'F5EF',36500: 'F5F0',36496: 'F5F1',36508: 'F5F2',36510: 'F5F3',35960: 'F5F4',35970: 'F5F5',35978: 'F5F6',35973: 'F5F7',35992: 'F5F8',35988: 'F5F9',26011: 'F5FA',35286: 'F5FB',35294: 'F5FC',35290: 'F5FD',35292: 'F5FE',35301: 'F6A1',35307: 'F6A2',35311: 'F6A3',35390: 'F6A4',35622: 'F6A5',38739: 'F6A6',38633: 'F6A7',38643: 'F6A8',38639: 'F6A9',38662: 'F6AA',38657: 'F6AB',38664: 'F6AC',38671: 'F6AD',38670: 'F6AE',38698: 'F6AF',38701: 'F6B0',38704: 'F6B1',38718: 'F6B2',40832: 'F6B3',40835: 'F6B4',40837: 'F6B5',40838: 'F6B6',40839: 'F6B7',40840: 'F6B8',40841: 'F6B9',40842: 'F6BA',40844: 'F6BB',40702: 'F6BC',40715: 'F6BD',40717: 'F6BE',38585: 'F6BF',38588: 'F6C0',38589: 'F6C1',38606: 'F6C2',38610: 'F6C3',30655: 'F6C4',38624: 'F6C5',37518: 'F6C6',37550: 'F6C7',37576: 'F6C8',37694: 'F6C9',37738: 'F6CA',37834: 'F6CB',37775: 'F6CC',37950: 'F6CD',37995: 'F6CE',40063: 'F6CF',40066: 'F6D0',40069: 'F6D1',40070: 'F6D2',40071: 'F6D3',40072: 'F6D4',31267: 'F6D5',40075: 'F6D6',40078: 'F6D7',40080: 'F6D8',40081: 'F6D9',40082: 'F6DA',40084: 'F6DB',40085: 'F6DC',40090: 'F6DD',40091: 'F6DE',40094: 'F6DF',40095: 'F6E0',40096: 'F6E1',40097: 'F6E2',40098: 'F6E3',40099: 'F6E4',40101: 'F6E5',40102: 'F6E6',40103: 'F6E7',40104: 'F6E8',40105: 'F6E9',40107: 'F6EA',40109: 'F6EB',40110: 'F6EC',40112: 'F6ED',40113: 'F6EE',40114: 'F6EF',40115: 'F6F0',40116: 'F6F1',40117: 'F6F2',40118: 'F6F3',40119: 'F6F4',40122: 'F6F5',40123: 'F6F6',40124: 'F6F7',40125: 'F6F8',40132: 'F6F9',40133: 'F6FA',40134: 'F6FB',40135: 'F6FC',40138: 'F6FD',40139: 'F6FE',40140: 'F7A1',40141: 'F7A2',40142: 'F7A3',40143: 'F7A4',40144: 'F7A5',40147: 'F7A6',40148: 'F7A7',40149: 'F7A8',40151: 'F7A9',40152: 'F7AA',40153: 'F7AB',40156: 'F7AC',40157: 'F7AD',40159: 'F7AE',40162: 'F7AF',38780: 'F7B0',38789: 'F7B1',38801: 'F7B2',38802: 'F7B3',38804: 'F7B4',38831: 'F7B5',38827: 'F7B6',38819: 'F7B7',38834: 'F7B8',38836: 'F7B9',39601: 'F7BA',39600: 'F7BB',39607: 'F7BC',40536: 'F7BD',39606: 'F7BE',39610: 'F7BF',39612: 'F7C0',39617: 'F7C1',39616: 'F7C2',39621: 'F7C3',39618: 'F7C4',39627: 'F7C5',39628: 'F7C6',39633: 'F7C7',39749: 'F7C8',39747: 'F7C9',39751: 'F7CA',39753: 'F7CB',39752: 'F7CC',39757: 'F7CD',39761: 'F7CE',39144: 'F7CF',39181: 'F7D0',39214: 'F7D1',39253: 'F7D2',39252: 'F7D3',39647: 'F7D4',39649: 'F7D5',39654: 'F7D6',39663: 'F7D7',39659: 'F7D8',39675: 'F7D9',39661: 'F7DA',39673: 'F7DB',39688: 'F7DC',39695: 'F7DD',39699: 'F7DE',39711: 'F7DF',39715: 'F7E0',40637: 'F7E1',40638: 'F7E2',32315: 'F7E3',40578: 'F7E4',40583: 'F7E5',40584: 'F7E6',40587: 'F7E7',40594: 'F7E8',37846: 'F7E9',40605: 'F7EA',40607: 'F7EB',40667: 'F7EC',40668: 'F7ED',40669: 'F7EE',40672: 'F7EF',40671: 'F7F0',40674: 'F7F1',40681: 'F7F2',40679: 'F7F3',40677: 'F7F4',40682: 'F7F5',40687: 'F7F6',40738: 'F7F7',40748: 'F7F8',40751: 'F7F9',40761: 'F7FA',40759: 'F7FB',40765: 'F7FC',40766: 'F7FD',40772: 'F7FE'};
			var length = str.length;
			var ret = [];
			var character;
			var charCode;
			var gCode;
			var neReg = /[\dA-z]/;
			for (var i = 0; i < length; i++) {
				charCode = str.charCodeAt(i);
				if (charCode <= 128) {
					character = str.charAt(i);
					if (neReg.test(character)) { //ascii的数字字母不编码
						ret.push(character);
					} else {
						ret.push('%' + charCode.toString(16));
					};
				} else {
					gCode = map.hasOwnProperty(charCode) && map[charCode];
					if (gCode) {
						while (gCode.length < 4) {
							gCode = '0' + gCode;
						};
						ret.push('%' + gCode.slice(0, 2) + '%' + gCode.slice(2, 4));
					} else {
						//字库里面没有.
					};
				};
			};
			return ret.join('');
		};
		//--------------------
		var nullFn = function() {};
		var C = {
			log: nullFn,
			err: nullFn,
		};
		if (prefs.debug) {
			if (envir.opera && window.opera.version() < 10.5) {
				C.log = C.err = function() {
					opera.postError.apply(opera, arguments);
				};
			} else {
				var G_window = topObject.unsafeWindow || window;
				var _console = G_window.console;
				if (_console) {
					C.log = function() {
						_console.log.apply(_console, arguments);
					};
					C.err = _console.error ?
					function() {
						_console.error.apply(_console, arguments);;
					} : C.log;
				};
			};
		};
		var docCharSet = document.characterSet || '';

		function encode(value, encoding) {
			if (encoding && /^gb/i.test(encoding)) {
				if (docCharSet.search(/gb/i) != -1) return value;
				if (typeof toGBK == 'function') {
					return toGBK(value);
				};
			} else {
				return encodeURIComponent(value);
			};
		};
		var url = location.href;
		var matchedRule;
		for (var i = 0, ii = siteInfos.length, siteInfos_i; i < ii; i++) {
			siteInfos_i = siteInfos[i];
			if (siteInfos_i.url.test(url)) {
				matchedRule = siteInfos_i;
				break;
			};
		};
		if (!matchedRule) {
			C.err('没有找到匹配的规则,退出.')
			return;
		};
		if (!matchedRule.enabled) {
			C.err('规则被禁用了', matchedRule);
			return;
		};
		C.log('找到规则:', matchedRule);
		//获取滚动的距离.
		function getWindowScrollXY() {
			var ret;
			if (support.winScrollXY) {
				ret = {
					x: window.scrollX,
					y: window.scrollY,
				};
			} else {
				ret = {
					x: window.pageXOffset,
					y: window.pageYOffset,
				};
			};
			return ret;
		};

		function getElement(selsector) {
			var ret;
			if (selsector.search(/css;/i) == 0) {
				ret = document.querySelector(selsector.slice(4));
			} else {
				ret = document.evaluate(selsector, document, null, 9, null).singleNodeValue;
			};
			return ret
		};

		function isArray(obj) {
			var ret;
			if (typeof Array.isArray == 'function') {
				ret = Array.isArray(obj);
			} else {
				ret = Object.prototype.toString.call(obj) == '[object Array]';
			};
		};

		function makeArray(obj) {
			if (isArray(obj)) {
				return obj;
			};
			return [obj];
		};
		if (!matchedRule.insertIntoDoc) {
			C.err('没有找到 insertIntoDoc 项.');
			return;
		};
		var insertIntoDoc = makeArray(matchedRule.insertIntoDoc);
		var matchedInsertIntoDoc;
		var iniKeyword;
		var iniPosition;
		var getKeyword;
		for (var i = 0, ii = insertIntoDoc.length, insertIntoDoc_i; i < ii; i++) {
			insertIntoDoc_i = insertIntoDoc[i];
			iniPosition = getElement(insertIntoDoc_i.target);
			if (iniPosition) {
				iniKeyword = null;
				switch (typeof insertIntoDoc_i.keyword) {
				case 'string':
					{
						getKeyword = getElement(insertIntoDoc_i.keyword);
						if (getKeyword) {
							iniKeyword = getKeyword.value;
						};
					}
					break;
				case 'function':
					{
						getKeyword = insertIntoDoc_i.keyword;
						try {
							iniKeyword = getKeyword();
						} catch (e) {};
					}
					break;
				};
				if (iniPosition && typeof iniKeyword === 'string') {
					matchedInsertIntoDoc = insertIntoDoc_i;
					break;
				};
			};
		};
		if (!matchedInsertIntoDoc) {
			C.err('insertIntoDoc不匹配', matchedRule.insertIntoDoc);
			return;
		};
		var matchedStyle = matchedInsertIntoDoc.style || matchedRule.style;
		if (typeof matchedStyle !== 'string') {
			matchedStyle = '';
		};
		C.log('匹配的insertIntoDoc', matchedInsertIntoDoc, '找到的位置:', iniPosition, '搜索关键字:', iniKeyword, '样式:', matchedStyle);
		//容器.
		var container = document.createElement('span');
		container.style.cssText = matchedStyle;
		container.className = 'sej_container sej_display-block';
		var style = document.createElement('style');
		style.type = 'text/css';
		style.textContent = prefs.style;
		document.body.appendChild(style);

		function getEngineListInnerHTML(array, expand) {
			var tempArray = [];
			for (var i = 0, ii = array.length, array_i; i < ii; i++) {
				if (i in array) {
					array_i = array[i];
					if (expand && matchedRule.url.test(array_i[1])) {
						continue;
					};
					var encoding = array_i[3] ? (' encoding="' + array_i[3] + '" ') : '';
					var href = ' href="' + array_i[1].replace('%s', encode(iniKeyword, encoding)) + '" ';
					var address = ' address="' + array_i[1] + '" ';
					var target = prefs.openInNewTab ? ' target="_blank" ' : '';
					var img = prefs.favicon ? (array_i[2] ? ('<img src="' + array_i[2] + '"/>') : '') : '';
					tempArray.push('<a' + href + address + target + encoding + '>' + img + array_i[0] + '</a>');
				};
			};
			return tempArray.join('');
		};
		var dropDownList = [];
		var engineListInnerHTML;
		for (var i = 0, ii = list.details.length, details_i; i < ii; i++) {
			if (i in list.details) {
				details_i = list.details[i];
				if (details_i[1] == matchedRule.engineList) {
					engineListInnerHTML = getEngineListInnerHTML(details_i[2], true);
					container.innerHTML = engineListInnerHTML ? ('<span class="sej_expanded-list-type">' + details_i[0] + ':</span>' + engineListInnerHTML) : '';
				} else {
					engineListInnerHTML = getEngineListInnerHTML(details_i[2]);
					if (engineListInnerHTML) {
						dropDownList.push([details_i[0], engineListInnerHTML])
					};
				};
			};
		};
		//事件支持检测.
		function eventSupported(eventName, el) {
			el = el || document.createElement('div');
			eventName = 'on' + eventName;
			var isSupported = (eventName in el);
			if (el.setAttribute && !isSupported) {
				el.setAttribute(eventName, 'return;');
				isSupported = typeof el[eventName] === 'function';
			};
			el = null;
			return isSupported;
		};
		var support = {
			mouseenter: eventSupported('mouseenter'),
			mouseleave: eventSupported('mouseleave'),
			winScrollXY: window.scrollX !== undefined,
		};
		var addCustomEvent = {
			_contains: function(parent, child) {
				if (parent && child) return !!(parent.compareDocumentPosition(child) & 16);
			},
			mouseenter: function(ele, fn) {
				var self = this;
				ele.addEventListener('mouseover', function(e) {
					//如果来自的元素是外面的.
					var relatedTarget = e.relatedTarget;
					if (relatedTarget != this && !self._contains(this, relatedTarget)) {
						fn.call(this, e);
					};
				}, false);
			},
			mouseleave: function(ele, fn) {
				var self = this;
				ele.addEventListener('mouseout', function(e) {
					//如果去往的元素,不是自己的子元素,或者自己本身.
					var relatedTarget = e.relatedTarget;
					if (relatedTarget != this && !self._contains(this, relatedTarget)) {
						fn.call(this, e);
					};
				}, false);
			},
		};

		function changeKeyword(e) {
			var target = e.target;
			if (target.nodeName !== 'A') return;
			var address = target.getAttribute('address');
			if (!address) return;
			var _getKeyword = getKeyword;
			var value = typeof _getKeyword == 'function' ? _getKeyword() : _getKeyword.value;
			var encoding = target.getAttribute('encoding');
			value = encode(value, encoding);
			target.href = address.replace('%s', value);
		};
		container.addEventListener('mouseover', changeKeyword, false);
		//那啥..
		function DropDownListObj(data) {
			this.data = data;
			this.init();
		};
		DropDownListObj.zIndex = 9999;
		DropDownListObj.prototype = {
			hide: function() {
				if (this.hiding) return;
				this.hiding = true;
				var ddStyle = this.dropDown.style;
				ddStyle.height = 0;
				ddStyle.opacity = 0;
				this.a.style.removeProperty('color');
				var self = this;

				function _hide() {
					self.hiding = false;
					ddStyle.visibility = 'hidden';
				};
				if (prefs.dropDownList.transition) {
					this.styleHiddenTimer = setTimeout(_hide, 333);
				} else {
					_hide();
				};
			},
			forceHide: function() {
				clearTimeout(this.hideTimer);
				this.hide();
			},
			hideDelay: function() {
				clearTimeout(this.hideTimer);
				var self = this;
				this.hideTimer = setTimeout(function() {
					self.hide();
				}, prefs.dropDownList.hideDelay);
			},
			getWindowSize: function() {
				var de = document.documentElement;
				//windo.innerHeight;window.innerWidth;
				return {
					//h:document.compatMode=='BackCompat'? document.body.clientHeight : de.clientHeight,
					w: de.clientWidth,
				};
			},
			setStyle: function() {
				var ddStyle = this.dropDown.style;
				ddStyle.height = this.ddHeight;
				ddStyle.opacity = 0.96;
				this.a.style.color = 'red';
				if (DropDownListObj.preShowObj && DropDownListObj.preShowObj != this) {
					DropDownListObj.preShowObj.forceHide();
				};
				DropDownListObj.zIndex += 1;
				this.dropDown.style.zIndex = DropDownListObj.zIndex;
				DropDownListObj.preShowObj = this;
			},
			show: function() {
				var aRect = this.a.getBoundingClientRect();
				var ddStyle = this.dropDown.style;
				var windowScrollXY = getWindowScrollXY();
				ddStyle.top = aRect.bottom + windowScrollXY.y + 'px';
				var halfListWidth = this.ddWidth / 2;
				var aRectL = aRect.left + 1 / 2 * this.a.offsetWidth;
				if (prefs.dropDownList.horizontal) {
					var aRightSSW = this.getWindowSize().w - aRectL; //a右边的屏幕宽度.
					var distanceFormRight = halfListWidth - aRightSSW;
					if (distanceFormRight <= -20) {
						distanceFormRight = 0;
					} else {
						distanceFormRight += 20;
					};
					ddStyle.left = Math.max(aRectL - halfListWidth - distanceFormRight, 10) + windowScrollXY.x + 'px';
				} else {
					ddStyle.left = aRectL - halfListWidth + windowScrollXY.x + 'px';
				};
				ddStyle.visibility = 'visible';
				this.setStyle();
			},
			showDelay: function() {
				clearTimeout(this.showTimer);
				var self = this;
				this.showTimer = setTimeout(function() {
					self.show();
				}, prefs.dropDownList.showDelay);
			},
			getDropDownSize: function() {
				var cStyle = getComputedStyle(this.dropDown, '');
				var height = cStyle.height;
				var width = cStyle.width;
				if (parseInt(height) == 0) {
					if (this.retryTime < 11) { //最多重试10次,耗时大概 1 秒.
						this.retryTime += 1;
						var self = this;
						setTimeout(function() {
							self.getDropDownSize();
						}, 100);
					} else {
						this.dropDown.style.visibility = 'hidden';
						this.dropDown.style.height = 0;
					};
				} else {
					this.ddHeight = height;
					this.ddWidth = parseInt(width);
					//if(prefs.dropDownList.horizontal)this.dropDown.style.width=this.ddWidth + 1 + 'px';//+1 解决放大后的问题.实际长度,比得到值小 1
					this.dropDown.style.visibility = 'hidden';
					this.dropDown.style.height = 0;
				};
			},
			init: function() {
				var dropDown = document.createElement('span');
				this.dropDown = dropDown;
				dropDown.style.cssText = 'top:-9999px;left:-9999px;opacity:0;visibility:visible;\t\t\t\t';
				dropDown.style.zIndex = DropDownListObj.zIndex;
				dropDown.className = 'sej_drop-down-list sej_display-block'
				dropDown.innerHTML = this.data[1];
				var a = dropDown.firstChild;
				while (a.nodeName !== 'A') {
					a = a.nextSibling;
				};
				a = a.cloneNode(false);
				a.textContent = this.data[0];
				var img = document.createElement('img');
				img.className = 'sej_dropdown-icon';
				img.src = prefs.icons.dropDown;
				a.appendChild(img);
				container.appendChild(a);
				this.a = a;
				var self = this;
				var mEnterHandler = function(e) {
						//C.log('enter',e.target);
						if (dropDown.style.visibility == 'hidden') {
							self.showDelay();
						} else {
							clearTimeout(self.styleHiddenTimer);
							clearTimeout(self.hideTimer);
							self.hiding = false;
							self.setStyle();
						};
					};
				if (support.mouseenter) {
					a.addEventListener('mouseenter', mEnterHandler, false);
					dropDown.addEventListener('mouseenter', mEnterHandler, false);
				} else {
					addCustomEvent.mouseenter(a, mEnterHandler);
					addCustomEvent.mouseenter(dropDown, mEnterHandler);
				};
				var mLeaveHandler = function(e) {
						//C.log('leave',e.target);
						if (dropDown.style.visibility == 'hidden') {
							clearTimeout(self.showTimer);
						} else {
							self.hideDelay();
						};
					};
				if (support.mouseleave) {
					a.addEventListener('mouseleave', mLeaveHandler, false);
					dropDown.addEventListener('mouseleave', mLeaveHandler, false);
				} else {
					addCustomEvent.mouseleave(a, mLeaveHandler);
					addCustomEvent.mouseleave(dropDown, mLeaveHandler);
				};
				dropDown.addEventListener('mouseover', changeKeyword, false);
				document.documentElement.appendChild(dropDown);
				this.ddHeight = 'auto';
				this.ddWidth = 0;
				this.retryTime = 0;
				this.getDropDownSize(); //css transition 动画,必须明确指定高度,所以获取.
			},
		};

		function insertIntoDocument(ele, target, where) {
			if (!where) {
				C.err('InsertIntoDoc的 where 项,不存在', matchedInsertIntoDoc);
				return;
			};
			switch (where.toLowerCase()) {
			case 'beforebegin':
				{
					target.parentNode.insertBefore(ele, target);
				}
				break;
			case 'beforeend':
				{
					target.appendChild(ele);
				}
				break;
			case 'afterbegin':
				{
					var tFirstChild = target.firstChild;
					if (tFirstChild) {
						target.insertBefore(ele, tFirstChild);
					} else {
						target.appendChild(ele);
					};
				}
				break;
			case 'afterend':
				{
					var tNextsibling = target.nextSibling;
					if (tNextsibling) {
						target.parentNode.insertBefore(ele, tNextsibling);
					} else {
						target.parentNode.appendChild(ele);
					};
				}
				break;
			};
		};
		for (var i = 0, ii = dropDownList.length; i < ii; i++) { //创建下拉列表对象.
			new DropDownListObj(dropDownList[i]);
		};
		insertIntoDocument(container, iniPosition, matchedInsertIntoDoc.where); //插入文档.
	};
	if (envir.opera) {
		document.addEventListener('DOMContentLoaded', init, false);
	} else {
		init();
	};
})(this, window, window.document);
////////////////////////////////////////////////////////////////这是跳转的代码////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////这是排序的代码////////////////////////////////////////////////////////////////
(function(){
		var macthList=[
			{
				hostname:'www.baidu.com',
				rule:'#content_left>div[srcid] *[class~=t],[class~=op_best_answer_question]'
			}
		];
	function getRule(){
		for(var i=0;i<macthList.length;i++){
			if(location.host==macthList[i].hostname){
				return document.querySelectorAll(macthList[i].rule);
			};
		};
	};
	function addEvent(obj, event, fn) {
		return obj.addEventListener ? obj.addEventListener(event, fn, false) : obj.attachEventListener('on' + event, fn);
	};
	var cssText="display:inline-block;background:#434849;color:#D7D7D7;font-family:'微软雅黑';font-size:16px;text-align:center;width:20px;line-height:20px;border-radius:50%;float:left;"
	var div = document.createElement('div');
	function show(){
		var list=getRule();
		for(var i=0;i<list.length;i++){
			if(list[i].getAttribute('sortIndex')){
				continue;
			}else{
				list[i].setAttribute('sortIndex',i);
				list[i].inner=list[i].innerHTML;
				div.innerHTML='<div style=' + cssText + '>' + (i+1) + '</div>';
				list[i].innerHTML=div.innerHTML+list[i].inner;
			};
		};
		var check=document.querySelector('#content_left input[type=checkbox]');
		check && check.removeAttribute('checked');
	};
	function delayed(){
		clearTimeout(document.sortTimer)
		document.sortTimer=setTimeout(show,500)
	}
	addEvent(document,'DOMContentLoaded',function(){
		show();
		addEvent(document,'scroll',delayed);
		addEvent(document,'keyup',delayed);
		addEvent(document,'click',delayed);
	});
})()
////////////////////////////////////////////////////////////////这是排序的代码////////////////////////////////////////////////////////////////
