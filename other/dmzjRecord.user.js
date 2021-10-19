// ==UserScript==
// @name        [dmzj]record
// @description 自动更新浏览记录，获取书签
// @include     https://manhua.dmzj.com/*
// @include     https://i.dmzj.com/subscribe
// @version     1.0.102
// @modified    2019-8-27 15:27:09
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @require     https://static.dmzj.com/public/js/jquery-1.8.2.min.js
// @require     https://static.dmzj.com/public/js/jquery.cookie.js
// ==/UserScript==
/* eslint-disable camelcase  */

const getReadingPage = () => {
  const top = $(window).scrollTop();
  const imgTop = $('.ml-images>img,.inner_img img').toArray().map((i) => i.offsetTop);
  const page = imgTop.map((i) => i > top).indexOf(true);
  const { length } = imgTop;
  return page === -1 ? length : page || page + 1;
};

const getReadingPage2 = () => $('#page_select>option:selected').index() + 1;

const historyLog = async (historyJson) => {
  if ($.cookie('my') !== null) {
    const userId = $.cookie('my').split('|')[0];
    await xhrSync(`//interface.dmzj.com/api/record/getRe?callback=callback&uid=${userId}&type=1&st=comic&json=${encodeURIComponent(historyJson)}`);
    unsafeWindow.$.cookie('history_CookieR', '[]', { path: '/', expiress: 7, sucue: true });
  }
};

const xhrSync = (url, parm = null, opt = {}) => new Promise((resolve, reject) => {
  GM_xmlhttpRequest({
    method: parm ? 'POST' : 'GET',
    url,
    data: parm instanceof Object ? Object.keys(parm).map((i) => `${i}=${parm[i]}`).join('&') : parm,
    timeout: opt.timeout || 60 * 1000,
    responseType: ['arraybuffer', 'blob', 'json'].includes(opt.responseType) ? opt.responseType : null,
    headers: opt.headers || {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    onload(res) {
      resolve(res);
    },
    ontimeout(res) {
      reject(res);
    },
    onerror(res) {
      reject(res);
    },
  });
});

const updateBookmark = async () => {
  const now = new Date().getTime();
  const last = GM_getValue('update', 0);
  if (now - last < 60 * 60 * 1000) return;
  const userId = $.cookie('my').split('|')[0];
  if (!userId) return;
  const res = await xhrSync(`//interface.dmzj.com/api/getReInfo/comic/${userId}/0`);
  try {
    const bookmark = JSON.parse(res.response);
    const bookmarkLocal = GM_getValue('bookmark', {});
    for (const i of bookmark) {
      if (!(i.comic_id in bookmarkLocal) || i.viewing_time > bookmarkLocal[i.comic_id][2]) { // 保留网上的记录
        bookmarkLocal[i.comic_id] = [i.chapter_id, i.record, i.viewing_time];
      }
    }
    GM_setValue('bookmark', bookmarkLocal);
    GM_setValue('update', now);
    window.location.reload();
  } catch (error) {}
};

const forIndex = async () => {
  const bookmark = GM_getValue('bookmark', {});
  const getChapter = () => {
    const comicId = unsafeWindow.g_comic_id;
    if (comicId in bookmark) { // 存在记录
      const info = bookmark[comicId];
      const chapters = $('.cartoon_online_border>ul>li>a');
      let chapter = chapters.toArray().filter((i) => i.href.split(/\/|\./)[6] * 1 === info[0] * 1);
      if (chapter.length === 1) {
        chapter = chapter[0];
        $('#last_read_history').html('上次看到：').append($(chapter).clone().removeAttr('class')).append(` <a href="${chapter.href}#page=${info[1]}" target="_blank">第${info[1]}页</a>`)
          .show();
      } else {
        const href = `${window.location.href}/${info[0]}.shtml?cid=${comicId}`;
        $('#last_read_history').html(`上次看到： <a href="${href}" target="_blank">未知话</a> <a href="${href}#page=${info[1]}" target="_blank">第${info[1]}页</a>`).show();
      }
    } else {
      $('#last_read_history').html('没有阅读记录，请开始阅读：').append($('.cartoon_online_border>ul>li>a').eq(0).clone()).show();
    }

    $('<a href="javascript:void(0);">[删除记录]</a>').css('margin', '8px').on({
      click: async () => {
        const userId = $.cookie('my').split('|')[0];
        let parm = `tid=1&uid=${userId}&id=${comicId}`;
        parm = `${parm}&signature=${md5(parm)}`;
        await xhrSync('https://i.dmzj.com/record/delOne', parm);
        await xhrSync('https://interface.dmzj.com/api/record/delRecords', parm);

        let cookie = $.cookie('history_CookieR');
        if (cookie) {
          try {
            cookie = JSON.parse(cookie);
            if (cookie[0].comicId === comicId) unsafeWindow.$.cookie('history_CookieR', '[]', { path: '/', expiress: 7, sucue: true });
          } catch (error) {}
        }

        delete bookmark[comicId];
        GM_setValue('bookmark', bookmark);

        window.location.reload();
      },
    }).appendTo('#last_read_history');
  };
  if ($('.cartoon_online_border>ul>li>a').length) {
    getChapter();
  } else { // 被屏蔽的漫画
    // 监视DOM
    let observer;
    observer = new window.MutationObserver((mutationsList) => {
      for (const i of mutationsList) {
        if (i.addedNodes.length && [...i.addedNodes].filter((j) => j.classList && [...j.classList].includes('cartoon_online_button')).length) {
          observer.disconnect();
          $('.dmzjRecord').remove();
          getChapter();
          return;
        }
      }
    });
    observer.observe($('.middleright_mr')[0], {
      childList: true,
      subtree: true,
    });

    $('<a class="dmzjRecord">显示记录</a>').on({
      click: async () => {
        let chapters = await xhrSync(`https://v3api.dmzj.com/comic/comic_${unsafeWindow.g_comic_id}.json`, null, { responseType: 'json' });
        chapters = chapters.response.chapters;

        // 来自动漫之家助手
        // https://greasyfork.org/scripts/33087
        const pagenum = 160;

        const part = [];
        for (let x = 0; x < chapters.length; x++) {
          const list = chapters[x].data.reverse(); const ary = []; var chapter; var prefix;
          for (let i = 0; i < list.length; i++) {
            chapter = list[i];
            prefix = ((x === 0 && (/^\d/).test(chapter.chapter_title)) ? '第' : '');
            ary.push(`<li><a title="${unsafeWindow.g_comic_name}-${prefix}${chapter.chapter_title}" href="/${unsafeWindow.g_comic_url}${chapter.chapter_id}.shtml?cid=${unsafeWindow.g_comic_id}"${(i === list.length - 1) ? ' class="color_red"' : ''}>${prefix}${chapter.chapter_title}</a></li>`);
          }

          const border = [];
          if (x === 0) {
            const h2 = $('div.middleright div.middleright_mr:eq(0) div.photo_part:eq(0) h2:eq(0)');
            h2.text(`${h2.text()}全集`);

            const maxpage = Math.ceil(list.length / pagenum); const button = [];
            for (let i = 1; i <= maxpage; i++) {
              button.push(`<li class="t1 ${(i === maxpage) ? 'b1' : 'b2'}" style="cursor: pointer;">第${i}页</li>`);
              border.push(`<div class="cartoon_online_border"${(i === maxpage) ? '' : ' style="display:none"'}><ul>${ary.splice(0, pagenum).join('')}</ul><div class="clearfix"></div></div>`);
            }

            const $button = $(`<ul class="cartoon_online_button margin_top_10px">${button.join('')}</ul>`);
            $button.children('li').each(function (i) {
              $(this).click(function () {
                $('.t1').addClass('b2');
                $(this).removeClass('b2');
                $(this).addClass('b1');
                $('.cartoon_online_border').hide();
                $('.cartoon_online_border').eq(i).show();
              });
            });

            part.unshift($button);
          } else {
            const photo_part = `<div class="photo_part" style="margin-top: 20px;"><div class="h2_title2"><span class="h2_icon h2_icon22"></span><h2>${unsafeWindow.g_comic_name} 漫画其它版本：${chapters[x].title}</h2></div></div>`;
            border.push(`<div class="cartoon_online_border_other" style="border-top: 1px dashed #0187c5;"><ul>${ary.join('')}</ul><div class="clearfix"></div></div>`);
            part.unshift(photo_part);
          }

          part.unshift(border.join(''));
        }

        for (let x = 0; x < part.length; x++) {
          $('#last_read_history').after(part[x]);
        }
      },
    }).appendTo('.odd_anim_title_m');
  }
};

const forRead = () => {
  setInterval(() => {
    if ($.cookie('history_CookieR')) historyLog($.cookie('history_CookieR'));
  }, 10 * 1000);
  $(window).on({
    scroll: () => {
      if (!$.cookie('my')) return;
      const item_obj = {};
      if ('comic_id' in unsafeWindow && 'chapter_id' in unsafeWindow) {
        item_obj[unsafeWindow.comic_id] = unsafeWindow.chapter_id;
        item_obj.comicId = unsafeWindow.comic_id;
        item_obj.chapterId = unsafeWindow.chapter_id;
      } else {
        const arr = $('img[ori-src]').attr('ori-src').split('/');
        const comic_id = arr[4];
        const chapter_id = arr[5];
        item_obj[comic_id] = chapter_id;
        item_obj.comicId = comic_id;
        item_obj.chapterId = chapter_id;
      }
      item_obj.page = $('.ml-images>img,.inner_img img').length ? getReadingPage() : getReadingPage2();
      item_obj.time = Date.parse(new Date()) / 1000; // 观看时间
      $.cookie('history_CookieR', JSON.stringify([item_obj]), { path: '/', expires: 99999 });

      const bookmark = GM_getValue('bookmark', {});
      bookmark[item_obj.comicId] = [item_obj.chapterId, item_obj.page, item_obj.time];
      GM_setValue('bookmark', bookmark);
    },
    click: () => {
      if ($.cookie('history_CookieR')) historyLog($.cookie('history_CookieR'));
    },
    unload: () => {
      if ($.cookie('history_CookieR')) historyLog($.cookie('history_CookieR'));
    },
  });
  if (window.location.hash.match(/^#@page=\d+/)) window.location.hash = window.location.hash.replace('#@page=', '#page=');
};

const forSubscribe = () => {
  const observer = new window.MutationObserver((mutationsList) => {
    const bookmark = GM_getValue('bookmark', {});
    const contents = $('.dy_content_li').toArray();
    for (const i of contents) {
      const comicId = $(i).find('.qx').attr('value');
      if (comicId in bookmark) {
        let href = $(i).find('.begin').attr('href');
        href = `${href.trim()}/${bookmark[comicId][0]}.shtml#page=${bookmark[comicId][1]}`;
        $(i).find('.begin').attr('href', href).text('继续阅读');
        if (bookmark[comicId][0] === $(i).find('.c_space>a').attr('href').split(/[/.]/)[6] * 1) $(i).find('.begin').text('已阅读完');
      }
    }
  });
  observer.observe($('.dy_content')[0], {
    childList: true,
  });
};

(async function () {
  await updateBookmark();
  if (window.location.href.match(/dmzj.com\/.*?\/\d+.shtml/)) {
    forRead();
  } else if ($('.path_lv3').length) {
    forIndex();
  } else if (window.location.href === 'https://i.dmzj.com/subscribe' && $('#sf-resetcontent').length === 0) {
    forSubscribe();
  }
}());

function md5(string) {
  function md5_RotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }
  function md5_AddUnsigned(lX, lY) {
    let lX4; let lY4; let lX8; let lY8; let
      lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      }
      return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
    }
    return (lResult ^ lX8 ^ lY8);
  }
  function md5_F(x, y, z) {
    return (x & y) | ((~x) & z);
  }
  function md5_G(x, y, z) {
    return (x & z) | (y & (~z));
  }
  function md5_H(x, y, z) {
    return (x ^ y ^ z);
  }
  function md5_I(x, y, z) {
    return (y ^ (x | (~z)));
  }
  function md5_FF(a, b, c, d, x, s, ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }
  function md5_GG(a, b, c, d, x, s, ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }
  function md5_HH(a, b, c, d, x, s, ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }
  function md5_II(a, b, c, d, x, s, ac) {
    a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
    return md5_AddUnsigned(md5_RotateLeft(a, s), b);
  }
  function md5_ConvertToWordArray(string) {
    let lWordCount;
    const lMessageLength = string.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function md5_WordToHex(lValue) {
    let WordToHexValue = ''; let WordToHexValue_temp = ''; let lByte; let lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      WordToHexValue_temp = `0${lByte.toString(16)}`;
      WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
    }
    return WordToHexValue;
  }
  function md5_Utf8Encode(string) {
    string = string.replace(/\r\n/g, '\n');
    let utftext = '';
    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n);
      if (c < 128) {
        utftext = utftext + String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext = utftext + String.fromCharCode((c >> 6) | 192);
        utftext = utftext + String.fromCharCode((c & 63) | 128);
      } else {
        utftext = utftext + String.fromCharCode((c >> 12) | 224);
        utftext = utftext + String.fromCharCode(((c >> 6) & 63) | 128);
        utftext = utftext + String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  let x = [];
  let k; let AA; let BB; let CC; let DD; let a; let b; let c; let
    d;
  const S11 = 7; const S12 = 12; const S13 = 17; const S14 = 22;
  const S21 = 5; const S22 = 9; const S23 = 14; const S24 = 20;
  const S31 = 4; const S32 = 11; const S33 = 16; const S34 = 23;
  const S41 = 6; const S42 = 10; const S43 = 15; const S44 = 21;
  string = md5_Utf8Encode(string);
  x = md5_ConvertToWordArray(string);
  a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
  for (k = 0; k < x.length; k = k + 16) {
    AA = a; BB = b; CC = c; DD = d;
    a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = md5_AddUnsigned(a, AA);
    b = md5_AddUnsigned(b, BB);
    c = md5_AddUnsigned(c, CC);
    d = md5_AddUnsigned(d, DD);
  }
  return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
}
