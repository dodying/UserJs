/* eslint-env browser */
来自http://blog.csdn.net/win32fanex/article/details/11948659
 //去掉html标签
function removeHtmlTab(tab) {
 return tab.replace(/<[^<>]+?>/g,'');//删除所有HTML标签
}
//普通字符转换成转意符
function html2Escape(sHtml) {
 return sHtml.replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
}
// &nbsp;转成空格
function nbsp2Space(str) {
 var arrEntities = {'nbsp' : ' '};
 return str.replace(/&(nbsp);/ig, function(all, t){return arrEntities[t]})
}
function space2Nbsp(str) {
 return str.replace(/\s/ig, '&nbsp;');
}
//转意符换成普通字符
function escape2Html(str) {
 var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
 return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
}

//回车转为br标签
function return2Br(str) {
 return str.replace(/\r?\n/g,"<br />");
}

//去除开头结尾换行,并将连续3次以上换行转换成2次换行
function trimBr(str) {
 str=str.replace(/((\s|&nbsp;)*\r?\n){3,}/g,"\r\n\r\n");//限制最多2次换行
 str=str.replace(/^((\s|&nbsp;)*\r?\n)+/g,'');//清除开头换行
 str=str.replace(/((\s|&nbsp;)*\r?\n)+$/g,'');//清除结尾换行
 return str;
}

// 将多个连续空格合并成一个空格
function mergeSpace(str) {
 str=str.replace(/(\s|&nbsp;)+/g,' ');
 return str;
}