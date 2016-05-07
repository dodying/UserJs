// ==UserScript==
// @name        EHD_CombineArchive2One
// @name:zh-CN  【EH】EHD_合并压缩卷
// @namespace   Dodying
// @author      Dodying
// @description Combine the Archive from EHD A too One Archive
// @description:zh-CN 合并下载自EHD的压缩包
// @include     http://g.e-hentai.org/g/*
// @include     http://exhentai.org/g/*
// @version     1
// @grant       none
// @icon        http://cdn4.iconfinder.com/data/icons/mood-smiles/80/mood-29-48.png
// @run-at      document-idle
// ==/UserScript==
var div = document.createElement('div');
var left = document.querySelector('.ehD-box').offsetLeft + 150;
var top = document.querySelector('.ehD-box').offsetTop - 20;
div.style = 'color:red;position: absolute;left: ' + left + 'px;top: ' + top + 'px;z-index: 999;';
div.innerHTML = '请选择分页数目<select><option></option><option value ="2">2</option><option value ="3">3</option><option value ="4">4</option><option value ="5">5</option><option value ="6">6</option><option value ="7">7</option><option value ="8">8</option><option value ="9">9</option><option value ="10">10</option></select><button style="display:none;">第1次下载</button><button style="display:none;">下载BAT文件</button>';
div.querySelector('select').onchange = function () {
  var amount = this.value;
  var pages = document.querySelector('#gdd > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)').innerHTML.replace(' pages', '');
  var page_avg = parseInt(pages / amount);
  var page = new Array;
  var temp = 1;
  for (var i = 0; i < amount; i++) {
    page[i] = temp + '-' + eval(temp + page_avg);
    temp += page_avg + 1;
  }
  page[amount - 1] = page[amount - 1].replace(/\-.*/, '-' + pages);
  //console.log(page);
  div.querySelectorAll('button') [0].style.display = '';
  div.querySelectorAll('button') [1].style.display = '';
  localStorage['EHD_DPR_page'] = page;
  localStorage['EHD_DPR_time'] = 1;
}
div.querySelectorAll('button') [0].onclick = function () {
  var time = parseInt(localStorage['EHD_DPR_time']);
  var page = localStorage['EHD_DPR_page'].split(',');
  if (time == page.length) {
    this.innerHTML = '已完成';
  } else if (time > page.length) {
    return;
  } else {
    this.innerHTML = '第' + eval(time + 1) + '次下载';
  }
  //document.querySelector('div.g2:nth-child(5) > a:nth-child(2) > label:nth-child(1) > input:nth-child(1)').focus();
  //document.querySelector('div.g2:nth-child(3)').click();

  document.querySelector('div.g2:nth-child(5) > a:nth-child(2) > label:nth-child(1) > input:nth-child(1)').value = page[time - 1];
  localStorage['EHD_DPR_time']++;
}
div.querySelectorAll('button') [1].onclick = function () {
  var amount = div.querySelector('select').value;
  var name = document.querySelector('#gn').innerHTML.replace(/\|/g, '-');
  download(name, amount);
}
document.body.appendChild(div);
//var size = document.querySelector('#gdd > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)').innerHTML;
//download('[Kuroneko Smith] Kaa-san no Ana Tsukawasete ~Kouhen~ [Chinese] [翻譯機腦補漢化]', '3');
///////////////////////////////////////////////////////////////////////////////////
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
//The following js code is from https://github.com/eligrey/FileSaver.js
//And it is formatted by firefox
//一下JS代码来自https://github.com/eligrey/FileSaver.js
//同时它已经用Firefox格式化
///////////////////////////////////////////////////////////////////////////////////
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.1.20160328
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */
/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function (view) {
  'use strict';
  // IE <10 is explicitly unsupported
  if (typeof navigator !== 'undefined' && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return;
  }
  var
  doc = view.document
  // only get URL when necessary in case Blob.js hasn't overridden it yet
  ,
  get_URL = function () {
    return view.URL || view.webkitURL || view;
  },
  save_link = doc.createElementNS('http://www.w3.org/1999/xhtml', 'a'),
  can_use_save_link = 'download' in save_link,
  click = function (node) {
    var event = new MouseEvent('click');
    node.dispatchEvent(event);
  },
  is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
  webkit_req_fs = view.webkitRequestFileSystem,
  req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
  throw_outside = function (ex) {
    (view.setImmediate || view.setTimeout) (function () {
      throw ex;
    }, 0);
  },
  force_saveable_type = 'application/octet-stream',
  fs_min_size = 0
  // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
  ,
  arbitrary_revoke_timeout = 1000 * 40 // in ms
  ,
  revoke = function (file) {
    var revoker = function () {
      if (typeof file === 'string') { // file is an object URL
        get_URL().revokeObjectURL(file);
      } else { // file is a File
        file.remove();
      }
    };
    /* // Take note W3C:
			var
			  uri = typeof file === "string" ? file : file.toURL()
			, revoker = function(evt) {
				// idealy DownloadFinishedEvent.data would be the URL requested
				if (evt.data === uri) {
					if (typeof file === "string") { // file is an object URL
						get_URL().revokeObjectURL(file);
					} else { // file is a File
						file.remove();
					}
				}
			}
			;
			view.addEventListener("downloadfinished", revoker);
			*/
    setTimeout(revoker, arbitrary_revoke_timeout);
  },
  dispatch = function (filesaver, event_types, event) {
    event_types = [
    ].concat(event_types);
    var i = event_types.length;
    while (i--) {
      var listener = filesaver['on' + event_types[i]];
      if (typeof listener === 'function') {
        try {
          listener.call(filesaver, event || filesaver);
        } catch (ex) {
          throw_outside(ex);
        }
      }
    }
  },
  auto_bom = function (blob) {
    // prepend BOM for UTF-8 XML and text/* types (including HTML)
    if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob(['﻿',
      blob], {
        type: blob.type
      });
    }
    return blob;
  },
  FileSaver = function (blob, name, no_auto_bom) {
    if (!no_auto_bom) {
      blob = auto_bom(blob);
    }
    // First try a.download, then web filesystem, then object URLs

    var
    filesaver = this,
    type = blob.type,
    blob_changed = false,
    object_url,
    target_view,
    dispatch_all = function () {
      dispatch(filesaver, 'writestart progress write writeend'.split(' '));
    }
    // on any filesys errors revert to saving with object URLs
    ,
    fs_error = function () {
      if (target_view && is_safari && typeof FileReader !== 'undefined') {
        // Safari doesn't allow downloading of blob urls
        var reader = new FileReader();
        reader.onloadend = function () {
          var base64Data = reader.result;
          target_view.location.href = 'data:attachment/file' + base64Data.slice(base64Data.search(/[,;]/));
          filesaver.readyState = filesaver.DONE;
          dispatch_all();
        };
        reader.readAsDataURL(blob);
        filesaver.readyState = filesaver.INIT;
        return;
      }
      // don't create more object URLs than needed

      if (blob_changed || !object_url) {
        object_url = get_URL().createObjectURL(blob);
      }
      if (target_view) {
        target_view.location.href = object_url;
      } else {
        var new_tab = view.open(object_url, '_blank');
        if (new_tab === undefined && is_safari) {
          //Apple do not allow window.open, see http://bit.ly/1kZffRI
          view.location.href = object_url
        }
      }
      filesaver.readyState = filesaver.DONE;
      dispatch_all();
      revoke(object_url);
    },
    abortable = function (func) {
      return function () {
        if (filesaver.readyState !== filesaver.DONE) {
          return func.apply(this, arguments);
        }
      };
    },
    create_if_not_found = {
      create: true,
      exclusive: false
    },
    slice
    ;
    filesaver.readyState = filesaver.INIT;
    if (!name) {
      name = 'download';
    }
    if (can_use_save_link) {
      object_url = get_URL().createObjectURL(blob);
      setTimeout(function () {
        save_link.href = object_url;
        save_link.download = name;
        click(save_link);
        dispatch_all();
        revoke(object_url);
        filesaver.readyState = filesaver.DONE;
      });
      return;
    }
    // Object and web filesystem URLs have a problem saving in Google Chrome when
    // viewed in a tab, so I force save with application/octet-stream
    // http://code.google.com/p/chromium/issues/detail?id=91158
    // Update: Google errantly closed 91158, I submitted it again:
    // https://code.google.com/p/chromium/issues/detail?id=389642

    if (view.chrome && type && type !== force_saveable_type) {
      slice = blob.slice || blob.webkitSlice;
      blob = slice.call(blob, 0, blob.size, force_saveable_type);
      blob_changed = true;
    }
    // Since I can't be sure that the guessed media type will trigger a download
    // in WebKit, I append .download to the filename.
    // https://bugs.webkit.org/show_bug.cgi?id=65440

    if (webkit_req_fs && name !== 'download') {
      name += '.download';
    }
    if (type === force_saveable_type || webkit_req_fs) {
      target_view = view;
    }
    if (!req_fs) {
      fs_error();
      return;
    }
    fs_min_size += blob.size;
    req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
      fs.root.getDirectory('saved', create_if_not_found, abortable(function (dir) {
        var save = function () {
          dir.getFile(name, create_if_not_found, abortable(function (file) {
            file.createWriter(abortable(function (writer) {
              writer.onwriteend = function (event) {
                target_view.location.href = file.toURL();
                filesaver.readyState = filesaver.DONE;
                dispatch(filesaver, 'writeend', event);
                revoke(file);
              };
              writer.onerror = function () {
                var error = writer.error;
                if (error.code !== error.ABORT_ERR) {
                  fs_error();
                }
              };
              'writestart progress write abort'.split(' ').forEach(function (event) {
                writer['on' + event] = filesaver['on' + event];
              });
              writer.write(blob);
              filesaver.abort = function () {
                writer.abort();
                filesaver.readyState = filesaver.DONE;
              };
              filesaver.readyState = filesaver.WRITING;
            }), fs_error);
          }), fs_error);
        };
        dir.getFile(name, {
          create: false
        }, abortable(function (file) {
          // delete file if it already exists
          file.remove();
          save();
        }), abortable(function (ex) {
          if (ex.code === ex.NOT_FOUND_ERR) {
            save();
          } else {
            fs_error();
          }
        }));
      }), fs_error);
    }), fs_error);
  },
  FS_proto = FileSaver.prototype,
  saveAs = function (blob, name, no_auto_bom) {
    return new FileSaver(blob, name, no_auto_bom);
  }
  ;
  // IE 10+ (native saveAs)
  if (typeof navigator !== 'undefined' && navigator.msSaveOrOpenBlob) {
    return function (blob, name, no_auto_bom) {
      if (!no_auto_bom) {
        blob = auto_bom(blob);
      }
      return navigator.msSaveOrOpenBlob(blob, name || 'download');
    };
  }
  FS_proto.abort = function () {
    var filesaver = this;
    filesaver.readyState = filesaver.DONE;
    dispatch(filesaver, 'abort');
  };
  FS_proto.readyState = FS_proto.INIT = 0;
  FS_proto.WRITING = 1;
  FS_proto.DONE = 2;
  FS_proto.error =
  FS_proto.onwritestart =
  FS_proto.onprogress =
  FS_proto.onwrite =
  FS_proto.onabort =
  FS_proto.onerror =
  FS_proto.onwriteend =
  null;
  return saveAs;
}(typeof self !== 'undefined' && self
|| typeof window !== 'undefined' && window
|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
if (typeof module !== 'undefined' && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== 'undefined' && define !== null) && (define.amd !== null)) {
  define([], function () {
    return saveAs;
  });
}
