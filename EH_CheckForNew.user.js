// ==UserScript==
// @name        EH_CheckForNew
// @name:zh-CN  【EH】检查新本子
// @namespace   Dodying
// @author      Dodying
// @description A monitor for EH
// @description:zh-CN 详见帮助
// @include     http://g.e-hentai.org/
// @include     http://g.e-hentai.org/?*
// @include     http://g.e-hentai.org/tag/*
// @include     http://g.e-hentai.org/g/*
// @include     http://g.e-hentai.org/uploader/*
// @include     http://g.e-hentai.org/favorites.php*
// @include     http://exhentai.org/
// @include     http://exhentai.org/?*
// @include     http://exhentai.org/tag/*
// @include     http://exhentai.org/g/*
// @include     http://exhentai.org/uploader/*
// @include     http://exhentai.org/favorites.php*
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @run-at      document-idle
// ==/UserScript==
var div = document.createElement('div');
div.innerHTML = '<button id="EH_CheckForNew_Add">保存</button><br /><button id="EH_CheckForNew_All">列表</button>';
div.style = 'position:absolute;left:' + eval(document.documentElement.clientWidth - 100) + 'px;top:0px;z-index:999;';
div.querySelector('#EH_CheckForNew_Add').onclick = function () {
	var Url = window.location.href;
	var Id = GM_getValue('length', 0) + 1;
	if (!GM_getValue('FavUrl')) {
		var FavUrl = new Object;
		FavUrl[Url] = 1;
		var FavSort = [
			1
		];
	} else {
		var FavUrl = GM_getValue('FavUrl');
		var FavSort = GM_getValue('FavSort');
		//console.log(FavUrl)
		//console.log(Url in FavUrl)
		if (Url in FavUrl) {
			alert('已经收藏！');
			return;
		} else {
			FavUrl[Url] = Id;
			FavSort.unshift(Id);
		}
	}
	if (document.querySelector('h1#gn')) {
		var BookName = document.querySelector('h1#gn').innerHTML;
	} else {
		var BookName = '';
	}
	var Title = prompt('请输入名称', BookName);
	if (Title == null || Title == '') return false;
	GM_setValue('FavUrl', FavUrl);
	var Today = new Date();
	var BookmarkInfo = {
		'Id' : Id,
		'Title' : Title,
		'LastTime' : Today,
		'Url' : Url
	};
	GM_setValue(Id, BookmarkInfo);
	GM_setValue('FavSort', FavSort);
	GM_setValue('length', Id);
	window.location = window.location;
}
div.querySelector('#EH_CheckForNew_All').onclick = function () {
	if (!document.querySelector('#EH_CheckForNew_Table')) {
		var FavSort = GM_getValue('FavSort');
		//console.log(FavSort);
		var bgcolor;
		(window.location.host == 'g.e-hentai.org') ? bgcolor = '#E3E0D1' : bgcolor = '#34353B';
		var table = document.createElement('table');
		table.id = 'EH_CheckForNew_Table';
		table.style = 'z-index:999;width:800px;background-color:' + bgcolor + ';position:absolute;left:' + eval(document.documentElement.clientWidth / 2 - 400) + 'px;top:240px;border-color:black;border-style:solid;text-align:center;z-index:999;';
		table.innerHTML = '<tr><th>ID</th><th>Title</th><th>LastTime</th><th>Url</th><td>更改</td></tr>';
		for (var i = FavSort.length - 1; i >= 0; i--) {
			//for (var i = 0; i < FavSort.length; i++) {
			var temp = GM_getValue(FavSort[i]);
			var tr = document.createElement('tr');
			tr.innerHTML = '<td>' + temp['Id'] + '</td><td>' + temp['Title'] + '</td><td>' + temp['LastTime'] + '</td><td><a href="' + temp['Url'] + '">' + temp['Title'] + '</a></td><td><button class="EH_CheckForNew_Class_Update">更新</button><button class="EH_CheckForNew_Class_Delete">删除</button><td>';
			tr.querySelector('.EH_CheckForNew_Class_Update').onmousedown = function (event) {
				var Id = this.parentNode.parentNode.firstChild.innerHTML;
				UpdateBookmark(Id, event.button, this);
			}
			tr.querySelector('.EH_CheckForNew_Class_Delete').onclick = function () {
				var Id = this.parentNode.parentNode.firstChild.innerHTML;
				DeleteBookmark(Id)
			}
			table.appendChild(tr);
		}
		document.body.appendChild(table);
	}
}
document.body.appendChild(div);
/**/
var FavUrl = GM_getValue('FavUrl');
if (FavUrl) {
	var Url = window.location.href;
	if (Url in FavUrl) {
		var Id = FavUrl[Url];
		var FavInfo = GM_getValue(Id);
		//console.log(FavInfo);
		var Title = FavInfo['Title'];
		var Today_Local = new Date().toLocaleDateString();
		document.title = '[' + Today_Local + ']' + Title;
		var time = document.querySelectorAll('table.itg>tbody>tr>td:nth-child(2)');
		for (var i = 0; i < time.length; i++) {
			var PostTime = Date.parse(time[i].innerHTML.replace(/ /, 'T'));
			if (PostTime < Date.parse(FavInfo['LastTime']))
				break;
		}
		var tr = document.createElement('tr');
		tr.style = 'text-align:center;';
		tr.innerHTML = '<td colspan="4">上次检查时间为' + FavInfo['LastTime'] + '<button id="EH_CheckForNew_Update">更新</button><button id="EH_CheckForNew_Delete">删除</button><input onclick="this.select();" value="[' + Today_Local + ']' + Title + '" /></td>';
		tr.querySelector('#EH_CheckForNew_Update').onmousedown = function (event) {
			UpdateBookmark(Id, event.button, this);
		}
		tr.querySelector('#EH_CheckForNew_Delete').onclick = function () {
			DeleteBookmark(Id);
		}
		document.querySelector('table.itg>tbody').insertBefore(tr, document.querySelector('table.itg>tbody>tr:nth-child(' + eval(i + 2) + ')'));
	}
}
/**/

function DeleteBookmark(Id) {
	var Url = GM_getValue(Id).Url;
	GM_deleteValue(Id);
	var FavUrl = GM_getValue('FavUrl');
	delete FavUrl[Url];
	GM_setValue('FavUrl', FavUrl);
	var FavSort = GM_getValue('FavSort');
	for (var i = 0; i < FavSort.length; i++) {
		if (FavSort[i] == Id) {
			FavSort.splice(i, 1);
			break;
		}
	}
	GM_setValue('FavSort', FavSort);
	window.location = window.location;
}
function UpdateBookmark(Id, status, ele) {
	var FavInfo = GM_getValue(Id);
	switch (status) {
	case 0:
		var Title = FavInfo['Title'];
		break;
	case 2:
		var Title = prompt('请输入名称', FavInfo['Title']);
		break;
	}
	var Url = FavInfo['Url'];
	if (ele.parentNode.querySelector('input'))
		ele.parentNode.querySelector('input').value = '[' + Today_Local + ']' + Title;
	var Today = new Date();
	var BookmarkInfo = {
		'Id' : Id,
		'Title' : Title,
		'LastTime' : Today,
		'Url' : Url
	};
	//console.log(BookmarkInfo);
	GM_setValue(Id, BookmarkInfo);
	var FavSort = GM_getValue('FavSort');
	for (var i = 0; i < FavSort.length; i++) {
		if (FavSort[i] == Id) {
			FavSort.splice(i, 1);
			break;
		}
	}
	FavSort.unshift(Id);
	GM_setValue('FavSort', FavSort);
	window.location = window.location;
}
