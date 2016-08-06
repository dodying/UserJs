// ==UserScript==
// @name         nHentai Downloader modify by Dodying
// @name:zh-CN  【nH】下载器-修改自Doying
// @description  Download manga on nHentai.net
// @description:zh-CN  相对于原脚本，添加了输入框，可以下载某张图片
// @version      1.2.0
// @icon         http://i.imgur.com/FAsQ4vZ.png
// @namespace    https://github.com/dodying/Dodying-UserJs
// @author       Dodying
// @author       Zzbaivong
// @license      MIT
// @match        http://nhentai.net/g/*
// @match        https://nhentai.net/g/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @require      https://greasyfork.org/scripts/19855-jszip/code/jszip.js?version=126859
// @require      https://greasyfork.org/scripts/18532-filesaver/code/FileSaver.js?version=128198
// @noframes
// @connect      nhentai.net
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// ==/UserScript==

jQuery(function($) {
    'use strict';
    $('.buttons').before('<div id="nHentaiDownloaderPlus">请选择分页数目<select><option></option><option value ="2">2</option><option value ="3">3</option><option value ="4">4</option><option value ="5">5</option><option value ="6">6</option><option value ="7">7</option><option value ="8">8</option><option value ="9">9</option><option value ="10">10</option></select><button style="display:none;">第1次下载</button><button style="display:none;">下载BAT文件</button><br><input type="text" id="nHD_input" style="width:150px;height:24px;" placeholder="eg 1-10,12" /></div>');
    $('#nHentaiDownloaderPlus').css('z-index', '999');
    $('#nHentaiDownloaderPlus>select').change(function () {
        var amount = this.value;
        var pages = document.querySelector('#info>div>time').parentNode.previousElementSibling.innerHTML.replace(' pages', '');
        var page_avg = parseInt(pages / amount);
        var page = new Array;
        var temp = 1;
        for (var i = 0; i < amount; i++) {
            page[i] = temp + '-' + eval(temp + page_avg);
            temp += page_avg + 1;
        }
        page[amount - 1] = page[amount - 1].replace(/\-.*/, '-' + pages);
        console.log(page);
        document.querySelectorAll('#nHentaiDownloaderPlus>button') [0].style.display = '';
        document.querySelectorAll('#nHentaiDownloaderPlus>button') [1].style.display = '';
        window.nHD_DPR_page = page;
        window.nHD_DPR_time = 1;
    });
    $('#nHentaiDownloaderPlus>button:eq(0)').click(function () {
        var time = window.nHD_DPR_time;
        var page = window.nHD_DPR_page;
        if (time == page.length) {
            this.innerHTML = '已完成';
        } else if (time > page.length) {
            return;
        } else {
            this.innerHTML = '第' + eval(time + 1) + '次下载';
        }
        this.parentNode.querySelector('input').value = page[time - 1];
        window.nHD_DPR_time++;
    })
    $('#nHentaiDownloaderPlus>button:eq(1)').click(function () {
        var amount = document.querySelector('#nHentaiDownloaderPlus>select').value;
        var name = document.querySelector('#info>h1').innerHTML;
        download(name, amount);
    })

    function download(name, amount) {
        if (!localStorage.Directory_7z) { //localStorage.removeItem('Directory_7z');
            localStorage.Directory_7z = prompt('请输入7Z命令符的绝对位置:\n可以有英文，Bat文件中加入了将CMD临时转换为UTF-8格式的语句', 'D:\\Program Files\\7z\\7z.exe');
        }
        var Directory_7z = localStorage.Directory_7z;
        var content = '\r\n';
        content += 'chcp 65001\r\n';
        content += '@echo off\r\n';
        content += '"' + Directory_7z + '"' + ' x -r "' + name + '.zip" -o"%cd%\\' + name + '\\"\r\n';
        for (var i = 1; i < amount; i++) {
            content += '"' + Directory_7z + '"' + ' x -r -x!info.txt "' + name + '(' + i + ').zip" -o"%cd%\\' + name + '\\"\r\n';
        }
        content += '"C:\\Program Files\\WinRAR\\RAR.exe" a -r -m0 "' + name + '.rar" "' + name + '\\"\r\n';
        content += 'rd /s /q "' + name + '\\"\r\n';
        content += 'for /f "tokens=* delims=" %%a in (\'dir /s /b "' + name + '.zip"\') do (set /a PreSize=%%~za/1024/1024)\r\n';
        for (var i = 1; i < amount; i++) {
            content += 'for /f "tokens=* delims=" %%a in (\'dir /s /b "' + name + '(' + i + ').zip"\') do (set /a PreSize=%%~za+%PreSize%)\r\n';
        }
        content += 'for /f "tokens=* delims=" %%a in (\'dir /s /b "' + name + '.rar"\') do (set /a Size=%%~za)\r\n';
        content += 'set /a Check=%Size%/50\r\n';
        content += 'set /a Differ=%PreSize%-%Size%\r\n';
        content += 'if %Differ% lss %Check% (del "' + name + '*.zip")\r\n';
        content += 'del "' + name + '.bat"';
        console.log(content);
        var blob = new Blob([content], {
            type: 'text/plain;charset=utf-8'
        });
        //saveAs(blob, name + '.bat');
        saveAs(blob, name + '.txt');
    }

    function deferredAddZip(i, filename) {
        var deferred = $.Deferred();

        GM_xmlhttpRequest({
            method: 'GET',
            url: images[i],
            responseType: 'arraybuffer',
            onload: function(response) {
                zip.file(filename, response.response);
                $download.html('<i class="fa fa-cog fa-spin"></i> ' + (++current) + '/' + total);
                deferred.resolve(response);
            },
            onerror: function(err) {
                console.error(err);
                deferred.reject(err);
            }
        });

        return deferred;
    }

    /*
    var zip = new JSZip(),
        prevZip = false,
        deferreds = [],
        current = 0,
        total = 0,
        images = [],
        $download = $('#download'),
        //doc = document,
        //tit = document.title;
    */
    var $download = $('#download'),
        downloading = false;

    window.URL = window.URL || window.webkitURL;

    $download.on('click', function (e) {
        e.preventDefault();
        if (downloading){
            alert('Downloading now!\nPlease wait!');
            return;
        }
        window.deferreds = [];
        window.zip = new JSZip();
        window.current = 0;
        window.total = 0;
        window.images = [];
        downloading = true;
        
        $download.attr('href', '#download');

        $(window).on('beforeunload', function() {
            return 'Progress is running...';
        });

        $download.html('<i class="fa fa-cog fa-spin"></i> Waiting...').css('backgroundColor', 'orange');

        var time=-1;
        var pages=new Array();
        var pagesRange=$('#nHD_input').val();
        if (pagesRange!==''){
            pagesRange=pagesRange.split(',');
            for (var j=0;j<pagesRange.length;j++){
                if (/\-/.test(pagesRange[j])){
                    var pagesRange2=pagesRange[j].split('-');
                    for (var k=parseInt(pagesRange2[0]);k<=parseInt(pagesRange2[1]);k++){
                        pages.push(k-1);
                    }
                } else {
                    pages.push(parseInt(pagesRange[j])-1);
                }
            }
        }
        $('.lazyload').each(function(i, v) {
            time++;
            if (pages.length!==0){
                if (jQuery.inArray(i,pages)==-1){
                    time--;
                    return;
                }
            }
            images[time] = location.protocol + $(v).attr('data-src').replace('t.n', 'i.n').replace(/\/(\d+)t\./, '/$1.');
        });

        total = images.length;

        $.each(images, function(i, v) {
            var filename = v.replace(/.*\//g, '');

            deferreds.push(deferredAddZip(i, filename));
        });

        $.when.apply($, deferreds).done(function() {
            zip.generateAsync({
                type: 'blob'
            }).then(function(blob) {
                var zipName = document.querySelector('#info>h1').innerHTML + '.zip';

                /*
                if (prevZip) {
                    window.URL.revokeObjectURL(prevZip);
                }
                prevZip = blob;

                $download.html('<i class="fa fa-check"></i> Complete').css('backgroundColor', 'green').attr({
                    href: window.URL.createObjectURL(prevZip),
                    download: zipName
                });
                */

                saveAs(blob, zipName);
                downloading=false;
                $download.html('<i class="fa fa-download"></i>Download');

                //document.title = '[⇓] ' + tit;
            }, function(reason) {
                 console.error(reason);
            });
        }).fail(function(err) {
            $download.html('<i class="fa fa-exclamation"></i> Fail').css('backgroundColor', 'red');
            console.error(err);
        }).always(function() {
            $(window).off('beforeunload');
        });

    });

});
