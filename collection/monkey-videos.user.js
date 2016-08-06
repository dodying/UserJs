// ==UserScript==
// @name         【FireFlash】monkey-videos
// @description  播放网页里的视频, 不再需要Adobe Flash Player
// @version      1.0.8
// @license      GPLv3
// @author       LiuLang
// @email        gsushzhsosgsu@gmail.com
// @include      http://www.56.com/u*
// @include      http://www.56.com/w*
// @include      http://www.acfun.tv/v/ac*
// @include      http://www.bilibili.com/video/av*
// @include      http://tv.cntv.cn/video/*
// @include      http://search.cctv.com/playVideo.php*
// @include      http://www.fun.tv/vplay/*
// @include      http://fun.tv/vplay/*
// @include      http://phtv.ifeng.com/program/*
// @include      http://v.ifeng.com/*
// @include      http://www.iqiyi.com/v_*
// @include      http://www.iqiyi.com/jilupian/*
// @include      http://www.letv.com/ptv/vplay/*
// @include      http://www.justing.com.cn/page/*
// @include      http://v.ku6.com/*
// @include      http://v.163.com/*
// @include      http://open.163.com/*
// @include      http://v.pps.tv/play_*
// @include      http://ipd.pps.tv/play_*
// @include      http://video.sina.com.cn/*
// @include      http://open.sina.com.cn/course/*
// @include      http://tv.sohu.com/*
// @include      http://www.tucao.cc/play/*
// @include      http://www.tudou.com/albumplay/*
// @include      http://www.tudou.com/listplay/*
// @include      http://www.tudou.com/programs/view/*
// @include      http://www.wasu.cn/Play/show/id/*
// @include      http://www.wasu.cn/play/show/id/*
// @include      http://www.wasu.cn/wap/Play/show/id/*
// @include      http://www.wasu.cn/wap/play/show/id/*
// @include      http://www.weiqitv.com/index/live_back?videoId=*
// @include      http://www.weiqitv.com/index/video_play?videoId=*
// @include      http://v.youku.com/v_show/id_*
// @include      http://v.youku.com/v_playlist/*
// @include      http://www.youtube.com/watch?v=*
// @include      https://www.youtube.com/watch?v=*
// @include      http://www.youtube.com/embed/*
// @include      https://www.youtube.com/embed/*
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @updateURL    https://raw.githubusercontent.com/LiuLang/monkey-videos/master/monkey-videos.user.js
// ==/UserScript==

(function() {

////////////////////////////////////////////////////////////////////////
////  Router
////////////////////////////////////////////////////////////////////////
  var monkey = {
    pathnames: {},
    handlers: {},

    run: function() {
      console.log('monkey.run: ', this);
      var handler = this.matchHandler();
      console.log('handler:', handler);
      if (handler !== null) {
        handler.run();
      }
    },

    extend: function(hostname, pathnameList, handler) {
      this.pathnames[hostname] = pathnameList;
      this.handlers[hostname] = handler;
    },

    matchHandler: function() {
      console.log('matchHandler() --');
      var host = location.host,
          url = location.href,
          pathnames;
      if (host in this.pathnames) {
        pathnames = this.pathnames[host];
        if (pathnames.some(function(pathname) {
              return url.startsWith(pathname);
            })) {
          return this.handlers[host];
        }
      }
      return null;
    },
  };

////////////////////////////////////////////////////////////////////////
////  Utils
////////////////////////////////////////////////////////////////////////

  /*
  * JavaScript MD5 1.0.1
  * https://github.com/blueimp/JavaScript-MD5
  *
  * Copyright 2011, Sebastian Tschan
  * https://blueimp.net
  *
  * Licensed under the MIT license:
  * http://www.opensource.org/licenses/MIT
  *
  * Based on
  * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
  * Digest Algorithm, as defined in RFC 1321.
  * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
  * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
  * Distributed under the BSD License
  * See http://pajhome.org.uk/crypt/md5 for more info.
  */

  /*jslint bitwise: true */
  /*global unescape, define */

  (function ($) {
    'use strict';

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safe_add(x, y) {
      var lsw = (x & 0xFFFF) + (y & 0xFFFF),
          msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bit_rol(num, cnt) {
      return (num << cnt) | (num >>> (32 - cnt));
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5_cmn(q, a, b, x, s, t) {
      return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
    }
    function md5_ff(a, b, c, d, x, s, t) {
      return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }
    function md5_gg(a, b, c, d, x, s, t) {
      return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }
    function md5_hh(a, b, c, d, x, s, t) {
      return md5_cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function md5_ii(a, b, c, d, x, s, t) {
      return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binl_md5(x, len) {
      /* append padding */
      x[len >> 5] |= 0x80 << (len % 32);
      x[(((len + 64) >>> 9) << 4) + 14] = len;

      var i, olda, oldb, oldc, oldd,
          a = 1732584193,
          b = -271733879,
          c = -1732584194,
          d = 271733878;

      for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;

        a = md5_ff(a, b, c, d, x[i], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

        a = md5_ii(a, b, c, d, x[i], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
      }
      return [a, b, c, d];
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr(input) {
      var i,
          output = '';
      for (i = 0; i < input.length * 32; i += 8) {
        output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
      }
      return output;
    }

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl(input) {
      var i,
          output = [];
      output[(input.length >> 2) - 1] = undefined;
      for (i = 0; i < output.length; i += 1) {
        output[i] = 0;
      }
      for (i = 0; i < input.length * 8; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
      }
      return output;
    }

    /*
     * Calculate the MD5 of a raw string
     */
    function rstr_md5(s) {
      return binl2rstr(binl_md5(rstr2binl(s), s.length * 8));
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstr_hmac_md5(key, data) {
      var i,
          bkey = rstr2binl(key),
          ipad = [],
          opad = [],
          hash;
      ipad[15] = opad[15] = undefined;
      if (bkey.length > 16) {
        bkey = binl_md5(bkey, key.length * 8);
      }
      for (i = 0; i < 16; i += 1) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
      }
      hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8);
      return binl2rstr(binl_md5(opad.concat(hash), 512 + 128));
    }

    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex(input) {
      var hex_tab = '0123456789abcdef',
          output = '',
          x,
          i;
      for (i = 0; i < input.length; i += 1) {
        x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
      }
      return output;
    }

    /*
     * Encode a string as utf-8
     */
    function str2rstr_utf8(input) {
      return unescape(encodeURIComponent(input));
    }

    /*
     * Take string arguments and return either raw or hex encoded strings
     */
    function raw_md5(s) {
      return rstr_md5(str2rstr_utf8(s));
    }
    function hex_md5(s) {
      return rstr2hex(raw_md5(s));
    }
    function raw_hmac_md5(k, d) {
      return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d));
    }
    function hex_hmac_md5(k, d) {
      return rstr2hex(raw_hmac_md5(k, d));
    }

    function md5(string, key, raw) {
      if (!key) {
        if (!raw) {
          return hex_md5(string);
        }
        return raw_md5(string);
      }
      if (!raw) {
        return hex_hmac_md5(key, string);
      }
      return raw_hmac_md5(key, string);
    }

    if (typeof define === 'function' && define.amd) {
      define(function () {
        return md5;
      });
    } else {
      $.md5 = md5;
    }
  }(this));

  /**
   * base64 function wrap
   * usage: base64.encode(str); base64.decode(base64_str);
   */
  var base64 = {
    encodeChars : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrs' +
                  'tuvwxyz0123456789+/',
    decodeChars : [
  　　-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  　　-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  　　-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
  　　52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
  　　-1,　0,　1,　2,　3,  4,　5,　6,　7,　8,　9, 10, 11, 12, 13, 14,
  　　15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
  　　-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  　　41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1],

    encodeFunction: function(str) {
    　　var out = '',
        len = str.length,
        i = 0,
        c1,
        c2,
        c3;
    
      while(i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if(i === len) {
          out += this.encodeChars.charAt(c1 >> 2);
          out += this.encodeChars.charAt((c1 & 0x3) << 4);
          out += "==";
          break;
        }
        c2 = str.charCodeAt(i++);
        if(i === len) {
          out += this.encodeChars.charAt(c1 >> 2);
          out += this.encodeChars.charAt(((c1 & 0x3)<< 4) | 
              ((c2 & 0xF0) >> 4));
          out += this.encodeChars.charAt((c2 & 0xF) << 2);
          out += "=";
          break;
        }
        c3 = str.charCodeAt(i++);
        out += this.encodeChars.charAt(c1 >> 2);
        out += this.encodeChars.charAt(((c1 & 0x3)<< 4) |
            ((c2 & 0xF0) >> 4));
        out += this.encodeChars.charAt(((c2 & 0xF) << 2) |
            ((c3 & 0xC0) >>6));
        out += this.encodeChars.charAt(c3 & 0x3F);
      }
      return out;
    },

    decodeFunction: function(str) {
      var c1,
        c2,
        c3,
        c4,
        len = str.length,
        out = '',
        i = 0;

      while(i < len) {
        do {
          c1 = this.decodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c1 === -1);
        if(c1 === -1) {
          break;
        }

        do {
          c2 = this.decodeChars[str.charCodeAt(i++) & 0xff];
        } while(i < len && c2 === -1);
        if(c2 === -1) {
          break;
        }
        out += String.fromCharCode((c1 << 2) |
            ((c2 & 0x30) >> 4));
        
        do { 
          c3 = str.charCodeAt(i++) & 0xff;
          if(c3 === 61) {
            return out;
          }
          c3 = this.decodeChars[c3];
        } while(i < len && c3 === -1);
        if(c3 === -1) {
          break;
        }
        out += String.fromCharCode(((c2 & 0XF) << 4) |
            ((c3 & 0x3C) >> 2));

        do { 
          c4 = str.charCodeAt(i++) & 0xff;
          if(c4 === 61) {
            return out;
          }
          c4 = this.decodeChars[c4];
        } while(i < len && c4 === -1);
        if(c4 === -1) {
          break;
        }
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
      };
      return out;
    },

    utf16to8: function(str) {
      var out = '',
        len = str.length,
        i,
        c;

      for(i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
          out += str.charAt(i);
        } else if (c > 0x07FF) {
          out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
          out += String.fromCharCode(0x80 | ((c >>　6) & 0x3F));
          out += String.fromCharCode(0x80 | ((c >>　0) & 0x3F));
        } else {
          out += String.fromCharCode(0xC0 | ((c >>　6) & 0x1F));
          out += String.fromCharCode(0x80 | ((c >>　0) & 0x3F));
        }
      }
      return out;
    },

    utf8to16: function(str) {
  　　var out = '',
          len = str.length,
          i = 0,
          c,
          char2,
          char3;
    
      while(i < len) {
        c = str.charCodeAt(i++);
        switch(c >> 4) {
        // 0xxxxxxx
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
          out += str.charAt(i - 1);
          break;
        // 110x xxxx　 10xx xxxx
        case 12: case 13:
          char2 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x1F) << 6) |
              (char2 & 0x3F));
          break;
        // 1110 xxxx　10xx xxxx　10xx xxxx
        case 14:
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 0x0F) << 12) |
            ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
          break;
        }
      }
      return out;
    },

    // This is encode/decode wrap, which convert chars between UTF-8
    // and UTF-16;
    encode: function(str) {
      return this.encodeFunction(this.utf16to8(str));
    },

    decode: function(str) {
      return this.utf8to16(this.decodeFunction(str));
    },
  };


  /**
   * Create a new <style> tag with str as its content.
   * @param string styleText
   *   - The <style> tag content.
   */
  var addStyle = function(styleText) {
    console.log('addStyle() --');
    var style = document.createElement('style');
    if (document.head) {
      document.head.appendChild(style);
      style.innerHTML = styleText;
    }
  };

  /**
   * Split query parameters in url and convert to object
   */
  var getQueryVariable = function(query) {
    var vars = query.split('&'),
        params = {},
        param,
        i;

    for (i = 0; i < vars.length; i += 1) {
      param = vars[i].split('=');
      params[param[0]] = param[1];
    }
    return params;
  };

  /**
   * Convert string to xml
   * @param string str
   *  - the string to be converted.
   * @return object xml
   *  - the converted xml object.
   */
  var parseXML = function(str) {
    if (document.implementation &&
        document.implementation.createDocument) {
      xmlDoc = new DOMParser().parseFromString(str, 'text/xml');
    } else {
      console.log('parseXML() error: not support current web browser!');
      return null;
    }
    return xmlDoc;
  };

  /**
   * Bitwise overflows in javascript
   */
  var bitwiseAnd = function(a, b) {
    var aArr = a.toString(2).split('').reverse(),
        bArr = b.toString(2).split('').reverse(),
        len = Math.min(aArr.length, bArr.length),
        i,
        result = [];

    for (i = 0; i < len; i++) {
      if (aArr[i] === '1' && bArr[i] === '1') {
        result.push('1');
      } else {
        result.push('0');
      }
    }

    return parseInt(result.reverse().join(''), 2);
  };

  /**
   * UI functions.
   * create UI which has multiples files per video.
   */
  var multiFiles = {

    // videos is an object containing these fields:
    // title, video title
    // formats, title of each video format
    // links, list containing video links of each duration
    videos: null,

    run: function(videos) {
      console.log('multiFiles.run() --');
      this.videos = videos;
      if ((!videos.formats) || (videos.formats.length === 0)) {
        console.error('Error: no video formats specified!');
        return;
      }
      this.removeOldPanels();
      this.createPanel();
    },

    removeOldPanels: function() {
      console.log('removeOldPanels() --');
      var panels = document.querySelectorAll('.monkey-videos-panel'),
          panel,
          i;

      for (i = 0; panel = panels[i]; i += 1) {
        panel.parentElement.removeChild(panel);
      }
    },

    /**
     * Create the control panel.
     */
    createPanel: function() {
      console.log('createPanel() --');
      var panel = document.createElement('div'),
          div,
          form,
          label,
          input,
          span,
          a,
          i,
          playlistWrap,
          playlistToggle,
          that = this;

      addStyle([
        '.monkey-videos-panel {',
          'position: fixed;',
          'right: 10px;',
          'bottom: 0px;',
          'z-index: 99999;',
          'border: 2px solid #ccc;',
          'border-top-left-radius: 14px;',
          'margin: 10px 0px 0px 0px;',
          'padding: 10px 10px 0px 10px;',
          'background-color: #fff;',
          'overflow-y: hidden;',
          'max-height: 90%;',
          'min-width: 100px;',
          'text-align: left;',
        '}',
        '.monkey-videos-panel:hover {',
          'overflow-y: auto;',
        '}',
        '.monkey-videos-panel label {',
          'margin-right: 10px;',
        '}',
        '.monkey-videos-panel .playlist-item {',
          'display: block;',
          'margin-top: 8px;',
        '}',
        '.monkey-videos-panel #playlist-toggle {',
          'height: 10px;',
          'margin-top: 10px;',
        '}',
        '.monkey-videos-panel #playlist-toggle:hover {',
          'cursor: pointer;',
        '}',
        '.monkey-videos-panel .playlist-show {',
          'background-color: #8b82a2;',
          //'border-radius: 0px 0px 5px 5px;',
        '}',
        '.monkey-videos-panel .playlist-hide {',
          'background-color: #462093;',
          //'border-radius: 5px 5px 0px 0px;',
        '}',
      ].join(''));

      panel.className = 'monkey-videos-panel';
      document.body.appendChild(panel);

      playlistWrap = document.createElement('div');
      playlistWrap.className = 'playlist-wrap';
      panel.appendChild(playlistWrap);

      div = document.createElement('div');
      div.className = 'playlist-nav';
      playlistWrap.appendChild(div);

      form = document.createElement('form');
      form.className = 'playlist-format';
      playlistWrap.appendChild(form);
      for (i = 0; i < this.videos.formats.length; i += 1) {
        label = document.createElement('label');
        form.appendChild(label);
        input = document.createElement('input');
        label.appendChild(input);
        input.type = 'radio';
        input.name = 'monkey-videos-format';
        span = document.createElement('span');
        label.appendChild(span);
        span.innerHTML = this.videos.formats[i];

        (function(input, pos) {
          input.addEventListener('change', function() {
            that.modifyList(pos);
            GM_setValue('format', pos);
          }, false);
        })(input, i);
      }
      
      // playlist m3u (with url data schema)
      a = document.createElement('a');
      a.className = 'playlist-m3u';
      a.innerHTML = '播放列表';
      a.title = a.innerHTML;
      a.download = this.videos.title + '.m3u';
      a.href = '';
      form.appendChild(a);

      div = document.createElement('div');
      div.className = 'playlist';
      playlistWrap.appendChild(div);

      playlistToggle = document.createElement('div');
      playlistToggle.id = 'playlist-toggle';
      playlistToggle.title = '隐藏';
      playlistToggle.className = 'playlist-show';
      panel.appendChild(playlistToggle);
      playlistToggle.addEventListener('click', function(event) {
        var wrap = document.querySelector('.monkey-videos-panel .playlist-wrap');
        if (wrap.style.display === 'none') {
          wrap.style.display = 'block';
          event.target.className = 'playlist-show';
          event.target.title = '隐藏';
          GM_setValue('hidePlaylist', false);
        } else {
          wrap.style.display = 'none';
          event.target.title = '显示';
          event.target.className = 'playlist-hide';
          GM_setValue('hidePlaylist', true);
        }
      }, false);

      if (GM_getValue('hidePlaylist', false)) {
        playlistToggle.click();
      }

      this.loadDefault();
    },

    loadDefault: function() {
      console.log('loadDefault() --');
      // Load default type of playlist.
      var currPos = GM_getValue('format', 0),
          formats = this.videos.formats,
          currPlaylist;

      console.log('currPos: ', currPos);
      if (formats.length <= currPos) {
        currPos = formats.length - 1;
      }
      console.log('currPos: ', currPos);

      currPlaylist = document.querySelectorAll(
          '.monkey-videos-panel .playlist-format input')[currPos];

      if (currPlaylist) {
        currPlaylist.checked = true;
        this.modifyList(currPos);
      }
    },

    /**
     * Modify the playlist content.
     *
     * Empty playlist first, and add new links of specific video format.
     */
    modifyList: function(pos) {
      console.log('modifyList(), pos = ', pos);
      var playlist = document.querySelector('.monkey-videos-panel .playlist'),
          url,
          a,
          i;
      
      // Clear its content first
      playlist.innerHTML = '';

      for (i = 0; url = this.videos.links[pos][i]; i += 1) {
        a = document.createElement('a');
        playlist.appendChild(a);
        a.className = 'playlist-item',
        a.href = url;
        if (this.videos.links[pos].length == 1) {
          a.innerHTML = this.videos.title;
        }
        else if (i < 9) {
          a.innerHTML = this.videos.title + '(0' + String(i + 1) + ')';
        } else {
          a.innerHTML = this.videos.title + '(' + String(i + 1) + ')';
        }
        a.title = a.innerHTML;
      }

      // Refresh m3u playlist file.
      document.querySelector('.playlist-m3u').href = this.plsDataScheme();
    },

    /**
     * Generate Playlist using base64 and Data URI scheme.
     * So that we can download directly and same it as a pls file using HTML.
     * URL:http://en.wikipedia.org/wiki/Data_URI_scheme
     * @return string
     *  - Data scheme containting playlist.
     */
    plsDataScheme: function() {
      console.log('plsDataSchema() --');
      return 'data:audio/x-m3u;charset=UTF-8;base64,' +
        base64.encode(this.generatePls());
    },

    /**
     * Generate pls - a multimedia playlist file, like m3u.
     * @return string
     * - playlist content.
     */
    generatePls: function() {
      console.log('generatePls() --');
      var output = [],
          links = document.querySelectorAll('.monkey-videos-panel .playlist-item'),
          a,
          i;

      output.push('#EXTM3U');
      for (i = 0; a = links[i]; i += 1) {
        output.push('#EXTINF:81, ' + a.innerHTML);
        output.push(a.href);
      }
      return output.join('\n');
    },
  };


  var singleFile = {
    // videos is an object containing video info.
    //
    // @title, string, video title
    // @formats, string list, format name of each video
    // @links, string list, video link
    // @msg, string 
    // @ok, bool, is ok is false, @msg will be displayed on playlist-panel
    videos: null,

    run: function(videos) {
      console.log('run() -- ');
      this.videos = videos;
      this.createPanel();
      this.createPlaylist();
    },

    createPanel: function() {
      console.log('createPanel() --');
      var panel = document.createElement('div'),
          playlist = document.createElement('div'),
          playlistToggle = document.createElement('div');

      addStyle([
        '.monkey-videos-panel {',
          'position: fixed;',
          'right: 10px;',
          'bottom: 0px;',
          'z-index: 99999;',
          'border: 2px solid #ccc;',
          'border-top-left-radius: 14px;',
          'margin: 10px 0px 0px 0px;',
          'padding: 10px 10px 0px 10px;',
          'background-color: #fff;',
          'overflow-y: hidden;',
          'max-height: 90%;',
          'min-width: 100px;',
        '}',
        '.monkey-videos-panel:hover {',
          'overflow-y: auto;',
        '}',
        '.monkey-videos-panel label {',
          'margin-right: 10px;',
        '}',
        '.monkey-videos-panel .playlist-item {',
          'display: block;',
        '}',
        '.monkey-videos-panel #playlist-toggle {',
          'height: 10px;',
          'width: 100%;',
          'margin-top: 10px;',
        '}',
        '.monkey-videos-panel #playlist-toggle:hover {',
          'cursor: pointer;',
        '}',
        '.monkey-videos-panel .playlist-show {',
          'background-color: #8b82a2;',
          //'border-radius: 0px 0px 5px 5px;',
        '}',
        '.monkey-videos-panel .playlist-hide {',
          'background-color: #462093;',
          //'border-radius: 5px 5px 0px 0px;',
        '}',
      ].join(''));

      panel.className = 'monkey-videos-panel';
      document.body.appendChild(panel);

      playlist= document.createElement('div');
      playlist.className = 'playlist-wrap';
      panel.appendChild(playlist);

      playlistToggle = document.createElement('div');
      playlistToggle.id = 'playlist-toggle';
      playlistToggle.title = '隐藏';
      playlistToggle.className = 'playlist-show';
      panel.appendChild(playlistToggle);
      playlistToggle.addEventListener('click', function(event) {
        var wrap = document.querySelector('.monkey-videos-panel .playlist-wrap');

        if (wrap.style.display === 'none') {
          wrap.style.display = 'block';
          event.target.className = 'playlist-show';
          event.target.title = '隐藏';
          GM_setValue('hidePlaylist', false);
        } else {
          wrap.style.display = 'none';
          event.target.title = '显示';
          event.target.className = 'playlist-hide';
          GM_setValue('hidePlaylist', true);
        }
      }, false);

      if (GM_getValue('hidePlaylist', false)) {
        playlistToggle.click();
      }
    },

    createPlaylist: function() {
      console.log('createPlayList() -- ');
      var playlist = document.querySelector('.monkey-videos-panel .playlist-wrap'),
          a,
          i;

      if (!this.videos.ok) {
        console.error(this.videos.msg);
        a = document.createElement('span');
        a.title = this.videos.msg;
        a.innerHTML = this.videos.msg;
        playlist.appendChild(a);
        return;
      }

      for (i = 0; i < this.videos.links.length; i += 1) {
        a = document.createElement('a');
        a.className = 'playlist-item';
        a.innerHTML = this.videos.title + '(' + this.videos.formats[i] + ')';
        a.title = a.innerHTML;
        a.href = this.videos.links[i];
        playlist.appendChild(a);
      }
    },
  };

////////////////////////////////////////////////////////////////////////
//// Define video handlers
////////////////////////////////////////////////////////////////////////


/**
 * 56.com
 */
var monkey_56 = {
  title: '',
  id: '',
  json: null,
  videos: {
    'normal': '',
    'clear': '',
    'super': '',
  },

  run: function() {
    console.log('run() --');
    this.getID();
    if (this.id.length > 0) {
      this.getPlaylist();
    } else {
      console.error('Failed to get video id!');
      return;
    }
  },

  /**
   * Get video id
   */
  getID: function() {
    console.log('getID() --');
    var url = location.href,
        idReg = /\/v_(\w+)\.html/,
        idMatch = idReg.exec(url),
        albumIDReg = /_vid-(\w+)\.html/,
        albumIDMatch = albumIDReg.exec(url);

    console.log(idMatch);
    console.log(albumIDMatch);
    if (idMatch && idMatch.length === 2) {
      this.id = idMatch[1]; 
    } else if (albumIDMatch && albumIDMatch.length === 2) {
      this.id = albumIDMatch[1];
    }
    console.log(this);
  },

  /**
   * Get video playlist from a json object
   */
  getPlaylist: function() {
    console.log('getPlaylist() --');
    var url = 'http://vxml.56.com/json/' + this.id + '/?src=out',
        that = this;

    console.log('url: ', url);
    GM_xmlhttpRequest({
      method: 'get',
      url: url,
      onload: function(response) {
        console.log('response:', response);
        var txt = response.responseText,
            json = JSON.parse(txt),
            video,
            i;

        that.json = json;
        if (json.msg == 'ok' && json.status == '1') {
          that.title = json.info.Subject;
          for (i = 0; video = json.info.rfiles[i]; i = i + 1) {
            that.videos[video.type] = video.url;
          }
        }
        that.createUI();
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        },
        formats = ['normal', 'clear', 'super'],
        format_names = ['标清', '高清', '超清'],
        format,
        link,
        i;

    for (i = 0; format = formats[i]; i += 1) {
      if (format in this.videos && this.videos[format].length > 0) {
        videos.links.push([this.videos[format]]);
        videos.formats.push(format_names[i]);
      } else {
        console.error('This video type is not supported: ', format);
      }
    }
    console.log(videos);
    multiFiles.run(videos);
  },
}


monkey.extend('www.56.com', [
  'http://www.56.com/u',
  'http://www.56.com/w',
], monkey_56);

/**
 * acfun.tv
 */
var monkey_acfun = {
  vid: '',
  origUrl: '',

  run: function() {
    this.getVid();
    if (this.vid.length === 0) {
      console.error('Failed to get video id!');
      this.createUI();
    } else {
      this.getVideoLink();
    }
  },

  getVid: function() {
    console.log('getVid()');
    var videos = document.querySelectorAll(
          'div#area-part-view div.l a'),
        video,
        i;

    console.log('videos: ', videos);
    for (i = 0; video = videos[i]; i += 1) {
      if (video.className.search('active') > 0) {
        this.vid = video.getAttribute('data-vid');
        return;
      }
    }
    console.error('Failed to get vid');
  },

  /**
   * Get video link from a json object
   */
  getVideoLink: function() {
    console.log('getVideoLink()');
    console.log(this);
    //var url = 'http://www.acfun.tv/api/getVideoByID.aspx?vid=' + this.vid,
    var url = 'http://www.acfun.tv/video/getVideo.aspx?id=' + this.vid,
        that = this;

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log('response:', response);
        var json = JSON.parse(response.responseText);

        if (json.success && json.sourceUrl.startsWith('http')) {
          that.origUrl = json.sourceUrl;
        }
        that.createUI();
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: '原始地址',
          formats: [],
          links: [],
          ok: true,
          msg: '',
        };

    if (this.origUrl.length === 0) {
      videos.ok = false;
      videos.msg = '暂不支持';
      singleFile.run(videos);
    } else {
      videos.formats.push(' ');
      videos.links.push(this.origUrl);
      singleFile.run(videos);
    }
  },
}

monkey.extend('www.acfun.tv', [
  'http://www.acfun.tv/v/ac',
], monkey_acfun);

/**
 * bilibili.tv
 */
var monkey_bili = {
  cid: '',
  title: '',
  oriurl: '',

  run: function() {
    console.log('run() --');
    this.getTitle();
    this.getCid();
  },

  /**
   * Get video title
   */
  getTitle: function() {
    console.log('getTitle()');
    var metas = document.querySelectorAll('meta'),
        meta,
        i;

    for (i = 0; meta = metas[i]; i += 1) {
      if (meta.hasAttribute('name') &&
          meta.getAttribute('name') === 'title') {
        this.title = meta.getAttribute('content');
        return;
      }
    }
    this.title = document.title;
  },

  /**
   * 获取 content ID.
   */
  getCid: function() {
    console.log('getCid()');
    var scripts = document.querySelectorAll('script'),
        reg = /cid=(\d+)&aid=(\d+)/,
        match,
        i;
    for (i = 0; i < scripts.length; i++) {
      match = reg.exec(scripts[i].innerHTML);
      console.log('match:', match);
      if (match && match.length === 3) {
        this.cid = match[1];
        this.getVideos();
        return;
      }
    } 
    console.error('Failed to get cid!');
  },

  /**
   * Get original video links from interface.bilibili.cn
   */
  getVideos: function() {
    console.log('getVideos() -- ');
    var url = 'http://interface.bilibili.cn/player?cid=' + this.cid,
        that = this;

    console.log('url:', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var reg = /<oriurl>(.+)<\/oriurl>/g,
            txt = response.responseText,
            match = reg.exec(txt);

        console.log('oriurl match:', match);
        if (match && match.length === 2) {
          that.oriurl = match[1];
          that.createUI();
        } else {
          console.error('Failed to get oriurl');
        }
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: '视频的原始地址',
          formats: [''],
          links: [],
          ok: true,
          msg: '',
        };

    videos.formats.push('');
    videos.links.push(this.oriurl);

    singleFile.run(videos);
  },
}

monkey.extend('www.bilibili.com', [
  'http://www.bilibili.com/video/av',
], monkey_bili);


/**
 * cntv.cn
 */
var monkey_cntv = {
  pid: '',
  title: '',
  json: [],
  videos: {
    chapters: [],
    chapters2: [],
  },

  run: function() {
    console.log('run() --');
    this.router();
  },

  router: function() {
    console.log('router() --');
    var href = location.href,
        schema;
    if (href.search('search.cctv.com/playVideo.php?') > -1) {
      schema = this.hashToObject(location.search.substr(1));
      this.pid = schema.detailsid;
      this.title = decodeURI(schema.title);
      this.getVideoInfo();
    } else if (href.search('tv.cntv.cn/video/') > -1) {
      this.pid = href.match(/\/([^\/]+)$/)[1];
      this.title = document.title.substring(0, document.title.length - 8);
      this.getVideoInfo();
    } else {
      this.getPidFromSource();
    }
  },

  /**
   * Get video pid from html source file
   */
  getPidFromSource: function() {
    console.log('getPidFromSource() --');
    var that = this;

    GM_xmlhttpRequest({
      url: location.href,
      method: 'GET',
      onload: function(response) {
        console.log('response:', response);
        that.parsePid(response.responseText);
      },
    });
  },

  /**
   * Parse txt and get pid of video
   */
  parsePid: function(txt) {
    console.log('parsePid() --');
    var pidReg = /code\.begin-->([^<]+)/,
        pidMatch = pidReg.exec(txt),
        titleReg = /title\.begin-->([^<]+)/,
        titleMatch = titleReg.exec(txt);

    if (titleMatch && titleMatch.length === 2) {
      this.title = titleMatch[1];
    } else {
      this.title = document.title;
    }

    console.log('pidMatch:', pidMatch);
    if (pidMatch && pidMatch.length === 2) {
      this.pid = pidMatch[1];
      this.getVideoInfo();
    } else {
      console.error('Failed to get Pid');
      return;
    }
  },

  /**
   * Get video info, including formats and uri
   */
  getVideoInfo: function() {
    console.log('getVideoInfo() --');
    var url = [
          'http://vdn.apps.cntv.cn/api/getHttpVideoInfo.do?',
          'tz=-8&from=000tv&idlr=32&modified=false&idl=32&pid=',
          this.pid,
          '&url=',
          location.href,
        ].join(''),
        that = this;

    console.log('url:', url);
    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: function(response) {
        console.log('response: ', response);
        that.json = JSON.parse(response.responseText);
        console.log('that: ', that);
        that.parseVideos();
      },
    });
  },

  /**
   * Parse video info from json object.
   */
  parseVideos: function() {
    console.log('parseVideos() --');
    var chapter;

    for (chapter in this.json.video) {
      if (chapter.startsWith('chapters')) {
        this.parseChapter(chapter);
      }
    }

    this.createUI();
  },

  /**
   * Parse specified chapter, list of video links.
   */
  parseChapter: function(chapter) {
    console.log('parseChapter() --');
    var item,
        i;

    for (i = 0; item = this.json.video[chapter][i]; i += 1) {
      if (this.videos[chapter] === undefined) {
        this.videos[chapter] = [];
      }
      this.videos[chapter].push(item.url);
    }
  },

  /**
   * Call multiFiles.js to construct UI widgets.
   */
  createUI: function() {
    console.log('createUI() --');
    console.log('this: ', this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
      };

    if (this.videos.chapters.length > 0) {
      videos.formats.push('标清');
      videos.links.push(this.videos.chapters);
    }
    if (this.videos.chapters2.length > 0) {
      videos.formats.push('高清');
      videos.links.push(this.videos.chapters2);
    }

    multiFiles.run(videos);
  },

  /**
   * Create a new <style> tag with str as its content.
   * @param string styleText
   *   - The <style> tag content.
   */
  addStyle: function(styleText) {
    var style = document.createElement('style');
    if (document.head) {
      document.head.appendChild(style);
      style.innerHTML = styleText;
    }
  },

  /**
   * 将URL中的hash转为了个对象/字典, 用于解析链接;
   */
  hashToObject: function(hashTxt) {
    var list = hashTxt.split('&'),
        output = {},
        len = list.length,
        i = 0,
        tmp = '';

    for (i = 0; i < len; i += 1) {
      tmp = list[i].split('=')
      output[tmp[0]] = tmp[1];
    }
    return output;
  },
}

monkey.extend('tv.cntv.cn', [
  'http://tv.cntv.cn/video/',
], monkey_cntv);

monkey.extend('search.cctv.com', [
  'http://search.cctv.com/playVideo.php',
], monkey_cntv);

/**
 * funshion.com
 */
var monkey_funshion = {
  title: '',
  mediaid: '',       // 专辑ID;
  number: '',        // 第几集, 从1计数;
  jobs: 0,

  formats: {
    327680: '标清版',
    491520: '高清版',
    737280: '超清版',
  },
  videos: {
    327680: '',
    491520: '',
    737280: '',
  },

  run: function() {
    console.log('run() --');
    this.router();
  },
  
  /**
   * router control
   */
  router: function() {
    var url = location.href;

    if (url.search('subject/play/') > 1 ||
        url.search('/vplay/') > 1 ) {
      this.getVid();
    } else if (url.search('subject/') > 1) {
      this.addLinks();
    } else if (url.search('uvideo/play/') > 1) {
      this.getUGCID();
    } else {
      console.error('Error: current page is not supported!');
    }
  },

  /**
   * Get UGC video ID.
   * For uvideo/play/'.
   */
  getUGCID: function() {
    console.log('getUGCID() --');
    var urlReg = /uvideo\/play\/(\d+)$/,
        urlMatch = urlReg.exec(location.href);

    console.log('urlMatch: ', urlMatch);
    if (urlMatch.length === 2) {
      this.mediaid = urlMatch[1];
      this.getUGCVideoInfo();
    } else {
      console.error('Failed to parse video ID!');
    }
  },

  getUGCVideoInfo: function() {
    console.log('getUGCVideoInfo() --');
    var url = 'http://api.funshion.com/ajax/get_media_data/ugc/' + this.mediaid,
        that = this;

    console.log('url: ', url);
    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: function(response) {
        console.log('response: ', response);
        that.json = JSON.parse(response.responseText);
        console.log('json: ', that.json);
        that.decodeUGCVideoInfo();
      },
    });
  },

  decodeUGCVideoInfo: function() {
    console.log('decodeUGCVideoInfo() --');
    var url = [
          'http://jobsfe.funshion.com/query/v1/mp4/',
          this.json.data.hashid,
          '.json?file=',
          this.json.data.filename,
        ].join(''),
        that = this;

    console.log('url: ', url);
    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: function(response) {
        console.log('response: ', response);
        that.appendUGCVideo(JSON.parse(response.responseText));
      },
    });
  },

  appendUGCVideo: function(videoJson) {
    console.log('appendUGCVideo() --');
    console.log('this: ', this);
    console.log('videoJson:', videoJson);
    var fileformat = this.fileformats[videoJson.playlist[0].bits];

    info = {
      title: this.json.data.name_cn,
      href: videoJson.playlist[0].urls[0],
    };
    console.log('info: ', info);

    this._appendVideo(info);
  },


  /**
   * Get video ID.
   * For subject/play/'.
   */
  getVid: function() {
    console.log('getVid() --');
    var url = location.href,
        urlReg = /subject\/play\/(\d+)\/(\d+)$/,
        urlMatch = urlReg.exec(url),
        urlReg2 = /\/vplay\/m-(\d+)/,
        urlMatch2 = urlReg2.exec(url);

    console.log('urlMatch: ', urlMatch);
    console.log('urlMatch2: ', urlMatch2);
    if (urlMatch && urlMatch.length === 3) {
      this.mediaid = urlMatch[1];
      this.number = parseInt(urlMatch[2]);
    } else if (urlMatch2 && urlMatch2.length === 2) {
      this.mediaid = urlMatch2[1];
      this.number = 1;
    } else {
      console.error('Failed to parse video ID!');
      return;
    }
    this.getVideoInfo();
  },

  /**
   * Download a json file containing video info
   */
  getVideoInfo: function() {
    console.log('getVideoInfo() --');
    var url = [
          'http://api.funshion.com/ajax/get_web_fsp/',
          this.mediaid,
          '/mp4',
        ].join(''),
        that = this;

    console.log('url: ', url);
    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: function(response) {
        console.log('response: ', response);
        var json = JSON.parse(response.responseText),
            format;
        console.log('json: ', json);
        that.title = json.data.name_cn || that.getTitle();
        if ((! json.data.fsps) || (! json.data.fsps.mult) ||
            (json.data.fsps.mult.length === 0) ||
            (! json.data.fsps.mult[0].cid)) {
          that.createUI();
        }

        that.mediaid = json.data.fsps.mult[0].cid;
        for (format in that.formats) {
          that.jobs = that.jobs + 1;
          that.getVideoLink(format);
        }
      },
    });
  },

  /**
   * Get title from document.tiel
   */
  getTitle: function() {
    console.log('getTitle() --');
    var title = document.title,
        online = title.search(' - 在线观看');

    if (online > -1) {
      return title.substr(0, online);
    } else {
      return title.substr(0, 12) + '..';
    }
  },

  /**
   * Get Video source link.
   */
  getVideoLink: function(format) {
    console.log('getVideoLink() --');
    var url = [
      'http://jobsfe.funshion.com/query/v1/mp4/',
      this.mediaid,
      '.json?bits=',
      format,
      ].join(''),
      that = this;

    console.log('url: ', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log('response: ', response);
        var json = JSON.parse(response.responseText);
        console.log('json: ', json);
        that.videos[format] = json.playlist[0].urls[0];
        that.jobs = that.jobs - 1;
        if (that.jobs === 0) {
          that.createUI();
        }
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        },
        format;

    if (this.videos[327680].length > 0) {
      videos.links.push([this.videos[327680]]);
      videos.formats.push(this.formats[327680]);
    }
    if (this.videos[491520].length > 0) {
      videos.links.push([this.videos[491520]]);
      videos.formats.push(this.formats[491520]);
    }
    if (this.videos[737280].length > 0) {
      videos.links.push([this.videos[737280]]);
      videos.formats.push(this.formats[737280]);
    }

    if (videos.links.length === 0) {
      videos.ok = false;
      videos.msg = 'Video source is not available.';
    }
    multiFiles.run(videos);
  },
}

monkey.extend('fun.tv', [
  'http://fun.tv/vplay/',
], monkey_funshion);

monkey.extend('www.fun.tv', [
  'http://www.fun.tv/vplay/',
], monkey_funshion);

/**
 * ifeng.com
 */
var monkey_ifeng = {
  id: '',
  title: '',
  links: [],

  run: function() {
    console.log('run() --');
    this.getId();
  },

  getId: function() {
    console.log('getId() --');
    var reg = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/,
        match = reg.exec(location.href);

    console.log('match: ', match);
    if (match && match.length === 2) {
      this.id = match[1];
      this.downloadById();
    } else {
      console.error('Failed to get video id');
    }
  },

  downloadById: function() {
    console.log('downloadById() --');
    var length = this.id.length,
        url = [
          'http://v.ifeng.com/video_info_new/',
          this.id[length-2],
          '/',
          this.id.substr(length-2),
          '/',
          this.id,
          '.xml'
         ].join(''),
         that = this;

    console.log('url:', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var xml = new DOMParser().parseFromString(response.responseText,
                                                  'text/xml'),
            item = xml.querySelector('item');

        that.title = item.getAttribute('Name');
        that.links.push(item.getAttribute('VideoPlayUrl'));
        that.createUI();
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        };
    videos.formats.push('标清');
    videos.links.push([this.links]);
    multiFiles.run(videos);
  },
};

monkey.extend('v.ifeng.com', [
  'http://v.ifeng.com/',
], monkey_ifeng);

monkey.extend('phtv.ifeng.com', [
  'http://phtv.ifeng.com/program/',
], monkey_ifeng);

/**
 * iqiyi.com
 */
var monkey_iqiyi = {
  title: '',
  vid: '',  // default vid, data-player-videoid
  uid: '',  // generated uuid/user id
  aid: '',  // album id, data-player-albumid
  tvid: '', // data-player-tvid
  type: 0,  // default type
  rcOrder: [96, 1, 2, 3, 4, 5, 10],
  vip: false, // this video is for VIP only
  rc: {
    96: {name: '240P', links: []},
    1: {name: '320P', links: []},
    2: {name: '480P', links: []},
    3: {name: 'super', links: []},
    4: {name: '720P', links: []},
    5: {name: '1080P', links: []},
    10: {name: '4K', links: []},
  },
  jobs: 0,

  run: function() {
    console.log('run() --');
    this.getTitle();
    this.getVid();
  },

  getTitle: function() {
    console.log('getTitle() --');
    var nav = unsafeWindow.document.querySelector('#navbar em'),
        id,
        title;

    if (nav) {
      title = nav.innerHTML;
    } else {
      title = unsafeWindow.document.title.split('-')[0];
    }
    this.title = title.trim();
  },

  getVid: function() {
    console.log('getVid() --');
    var videoPlay = unsafeWindow.document.querySelector('div#flashbox');
    if (videoPlay && videoPlay.hasAttribute('data-player-videoid')) {
      this.vid = videoPlay.getAttribute('data-player-videoid');
      this.aid = videoPlay.getAttribute('data-player-aid');
      this.tvid = videoPlay.getAttribute('data-player-tvid');
      this.uid = this.hex_guid();
      this.getVideoUrls();
    } else {
      console.error('Error: failed to get video id');
      return;
    }
  },

  getVideoUrls: function() {
    console.log('getVideoUrls() --');
    var tm = this.randint(1000, 2000),
        enc = md5('ts56gh' + tm + this.tvid),
        url = [
          'http://cache.video.qiyi.com/vms?key=fvip&src=p',
          '&tvId=', this.tvid,
          '&vid=', this.vid,
          '&vinfo=1&tm=', tm,
          '&enc=', enc,
          '&qyid=', this.uid,
          '&tn=', Math.random(),
        ].join(''),
        that = this;

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var json = JSON.parse(response.responseText),
            formats,
            format,
            vlink,
            vlink_parts,
            key,
            url,
            i,
            j;

        that.title = json.data.vi.vn;
        if (! json.data.vp.tkl) {
          that.vip = true;
          that.createUI();
        }

        formats = json.data.vp.tkl[0].vs;
        for (i = 0; format = formats[i]; i += 1) {
          if (! that.rc[format.bid]) {
            console.error('Current video type not supported: ', format.bid);
            continue;
          }
          for (j = 0; j < format.fs.length; j += 1) {
            vlink = format.fs[j].l;
            if (! vlink.startsWith('/')) {
              vlink = that.getVrsEncodeCode(vlink);
            }
            vlink_parts = vlink.split('/');
            that.getDispathKey(
                vlink_parts[vlink_parts.length - 1].split('.')[0],
                format.bid, vlink, j);
          }
        }
      },
    });
  },

  getVrsEncodeCode: function(vlink) {
    var loc6 = 0,
        loc2 = [],
        loc3 = vlink.split('-'),
        loc4 = loc3.length,
        i;

    for (i = loc4 - 1; i >= 0; i -= 1) {
      loc6 = this.getVRSXORCode(parseInt(loc3[loc4 - i - 1], 16), i);
      loc2.push(String.fromCharCode(loc6));
    }
    return loc2.reverse().join('');
  },

  getVRSXORCode: function(arg1, arg2) {
    var loc3 = arg2 % 3;
    if (loc3 === 1) {
      return arg1 ^ 121;
    } else if (loc3 === 2) {
      return arg1 ^ 72
    } else {
      return arg1 ^ 103;
    }
  },

  getDispathKey: function(rid, bid, vlink, i) {
    var tp =  ")(*&^flash@#$%a",
        that = this;

    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://data.video.qiyi.com/t?tn=' + Math.random(),
      onload: function(response) {
        var json = JSON.parse(response.responseText),
            time = json.t,
            t = Math.floor(parseInt(time) / 600.0).toString(),
            key = md5(t + tp + rid),
            url = [
              'http://data.video.qiyi.com/', key, '/videos', vlink,
              '?su=', that.uid,
              '&client=&z=&bt=&ct=&tn=', that.randint(10000, 20000),
              ].join('');

          that.rc[bid].links.push('');
          that.jobs += 1;
          that.getFinalURL(bid, i, url);
      },
    });
  },

  getFinalURL: function(bid, i, url) {
    var that = this;
    
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var json = JSON.parse(response.responseText);

        that.rc[bid].links[i] = json.l;
        that.jobs -= 1;
        if (that.jobs === 0) {
          that.createUI();
        }
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var i,
        video,
        videos = {
          title: this.title,
          formats: [],
          links: [],
        },
        links,
        link,
        j;

    if (this.vip) {
      unsafeWindow.alert('VIP only!');
      return;
    }
    for (i = 0; i < this.rcOrder.length; i += 1) {
      video = this.rc[this.rcOrder[i]];
      if (video.links.length > 0) {
        videos.formats.push(video.name);

        // append KEY/UUID string to end of each video link
        links = [];
        for (j = 0; j < video.links.length; j += 1) {
          link = [video.links[j], '?', video.key].join(''); 
          links.push(link);
        }
        videos.links.push(links);
      }
    }
    multiFiles.run(videos);
  },

  /**
   * Convert string to xml
   * @param string str
   *  - the string to be converted.
   * @return object xml
   *  - the converted xml object.
   */
  parseXML: function(str) {
    if (unsafeWindow.document.implementation &&
        unsafeWindow.document.implementation.createDocument) {
      xmlDoc = new DOMParser().parseFromString(str, 'text/xml');
    } else {
      console.log('parseXML() error: not support current web browser!');
      return null;
    }
    return xmlDoc;
  },

  /**
   * Generate a UUID string
   */
  hex_guid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }
    return [s4(), s4(), s4(), s4(), s4(), s4(), s4(), s4()].join('');
  },

  randint: function(start, stop) {
    return parseInt(Math.random() * (stop - start)) + start;
  },
};

monkey.extend('www.iqiyi.com', [
  'http://www.iqiyi.com/v_',
  'http://www.iqiyi.com/jilupian/',
], monkey_iqiyi);

/**
 * letv.com
 */
var monkey_letv = {
  pid: '',
  vid: '',   // video id
  title: '',
  stime: 0, // server timestamp
  tkey: 0,  // time key
  jobs: 0,

  videoUrl: {
    '9': '',
    '21': '',
    '13': '',
  },
  videoFormats: {
    '9': '流畅',
    '13': '超清',
    '21': '高清',
  },

  run: function() {
    console.log('run() -- ');
    var url = location.href;
    this.title = document.title.substr(0, document.title.length-12);

    if (url.search('yuanxian.letv') !== -1) {
      // movie info page.
      this.addLinkToYuanxian();
    } else if (url.search('ptv/pplay/') > 1 ||
               url.search('ptv/vplay/' > 1)) {
      this.getVid();
    } else {
      console.error('I do not know what to do!');
    }
  },

  /**
   * Show original video link in video index page.
   */
  addLinkToYuanxian: function() {
    console.log('addLinkToYuanxian() --');

    var pid = __INFO__.video.pid,
        url = 'http://www.letv.com/ptv/pplay/' + pid + '.html',
        titleLink = document.querySelector('dl.w424 dt a');

    titleLink.href = url;
  },

  /**
   * Get video id
   */
  getVid: function() {
    console.log('getVid() --');

    var vidReg = /letv.com\/ptv\/vplay\/(\d+)\.html$/,
        vidMatch = vidReg.exec(document.location.href);

    console.log('vidMatch: ', vidMatch);
    if (vidMatch && vidMatch.length === 2) {
      this.vid = vidMatch[1];
      this.getVideo();
    } else {
      console.error('Failed to get video ID!');
      return;
    }
  },

  getVideo: function() {
    console.log('getVideo()--');
    var tkey = this.calcTimeKey(Math.floor((new Date()).getTime() / 1000)),
        url = [
          'http://api.letv.com/mms/out/video/playJson?id=', this.vid,
          '&platid=1&splatid=101&format=1&tkey=', tkey,
          '&domain=www.letv.com',
        ].join('');

    console.log('url:', url);
    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: function(response) {
        var obj = JSON.parse(response.responseText);
        console.log('response object:', obj);
      },
    });
  },

  calcTimeKey: function(t) {
    console.log('calcTimeKey:', t);
    var POW = Math.pow(2, 32) - 1;

    function ror(val, rBits) {
      return ((val & POW) >> rBits % 32) | (val << (32 - (rBits % 32)) & POW);
      //return (bitwiseAnd(val, POW) >> rBits % 32) |
      //       bitwiseAnd(val << (32 - (rBits % 32)), POW);
    }

    return ror(ror(t, 773625421 % 13) ^ 773625421, 773625421 % 17);
  },

  /**
   * Get timestamp from server
   */
  getTimestamp: function() {
    console.log('getTimestamp() --', this);

    var tn = Math.random(),
        url = 'http://api.letv.com/time?tn=' + tn.toString(),
        that = this;

    console.log('url:', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log('response:', response);
        var obj = JSON.parse(response.responseText);
        that.stime = parseInt(obj.stime);
        that.tkey = that.getKey(that.stime);
        that.getVideoXML();
      },
    });
  },

  /**
   * Get time key
   * @param integer t, server time
   */
  getKey: function(t) {
    console.log('getKey() --', t);
    for(var e = 0, s = 0; s < 8; s += 1){
            e = 1 & t;
            t >>= 1;
            e <<= 31;
            t += e;
    }
    return t ^ 185025305;
  },

  /**
   * Get video info from an xml file
   */
  getVideoXML: function() {
    console.log('getVideoXML() --');
    var url = [
          'http://api.letv.com/mms/out/common/geturl?',
          'platid=3&splatid=301&playid=0&vtype=9,13,21,28&version=2.0',
          '&tss=no',
          '&vid=', this.vid,
          '&tkey=', this.tkey,
          '&domain=http%3A%2F%2Fwww.letv.com'
          ].join(''),
        that = this;

    console.log('videoXML url: ', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log('response: ', response);
        var json = JSON.parse(response.responseText);
        that.getVideoUrl(json.data[0].infos);
      },
    });
  },

  /**
   * Parse video url
   */
  getVideoUrl: function(videos) {
    console.log('getVideoUrl() --');
    var video,
        i,
        url;


    for (i = 0; video = videos[i]; i = i + 1) {
      url = [
        video.mainUrl,
        '&ctv=pc&m3v=1&termid=1&format=1&hwtype=un&ostype=Linux&tag=letv',
        '&sign=letv&expect=3&pay=0&iscpn=f9051&rateid=1300',
        '&tn=', Math.random()
        ].join('');
      this.getFinalUrl(url, video.vtype);
      this.jobs += 1;
    }
  },

  /**
   * Get final video links
   * @param url, video link,
   * @param type, video type
   */
  getFinalUrl: function(url, type) {
    console.log('getFinalUrl() --', type);
    var that = this;

    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: function(response) {
        var json = JSON.parse(response.responseText);
        that.videoUrl[type] = json.location;
        that.jobs -= 1;
        if (that.jobs === 0) {
          that.createUI();
        }
      },
    });
  },

  /**
   * construct ui widgets.
   */
  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        },
        types = ['9', '21', '13'],
        type,
        url,
        i;
  
    for (i = 0; type = types[i]; i += 1) {
      url = this.videoUrl[type];
      if (url) {
        videos.links.push([this.videoUrl[type]]);
        videos.formats.push(this.videoFormats[type]);
      }
    }

    multiFiles.run(videos);
  },
};

monkey.extend('www.letv.com', [
  'http://www.letv.com/ptv/vplay/',
], monkey_letv);


/**
 * justing.com.cn
 */
var monkey_justing = {
  title: '',
  link: '',

  run: function() {
    console.log('run() --');
    this.getTitle();
    this.createUI();
  },

  getTitle: function() {
    var titleElem = unsafeWindow.document.querySelector('div#title');
    if (titleElem) {
      this.title = titleElem.innerHTML;
      this.link = encodeURI([
          'http://dl.justing.com.cn/page/',
          this.title,
          '.mp3'].join(''));
    }
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          links: [],
          formats: [],
          ok: true,
          msg: '',
        };
    if (this.title.length === 0) {
      videos.ok = false;
      videos.msg = 'Failed to get mp3 link';
    } else {
      videos.links.push([this.link]);
      videos.formats.push('mp3');
    }
    multiFiles.run(videos);
  },


};

monkey.extend('www.justing.com.cn', [
  'http://www.justing.com.cn/page/',
], monkey_justing);

/**
 * ku6.com
 */
var monkey_ku6 = {

  vid: '',
  title: '',
  links: [],
  type: '标清',

  run: function() {
    console.log('run() --');
    this.getVid();
  },

  /**
   * 获取video id, 用于构建下载链接.
   */
  getVid: function() {
    console.log('getVid() --');
    var url = location.href,
        vid_reg = /\/([^\/]+)\.html/,
        vid_match = vid_reg.exec(url);

    console.log(vid_match);
    if (vid_match && vid_match.length == 2) {
      this.vid = vid_match[1];
      this.getVideo();
    }
  },

  getVideo: function() {
    console.log('getVideo() --');
    var url = 'http://v.ku6.com/fetchVideo4Player/' + this.vid + '.html',
        that = this;

    console.log('url:', url);
    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: function(response) {
        console.log('response:', response);
        var video_obj = JSON.parse(response.responseText);
        console.log(video_obj);
        that.title = video_obj.data.t;
        that.links = video_obj.data.f.split(',');
        that.createUI();
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
        };

    if (this.links.length > 0) {
      videos.formats.push(this.type);
      videos.links.push(this.links);
      multiFiles.run(videos);
    } else {
      console.error('this.video is empty');
    }
  },
};

monkey.extend('v.ku6.com', [
  'http://v.ku6.com/',
], monkey_ku6);

/**
 * 163.com
 */
var monkey_netease = {

  plid: '',  // playlist id
  mid: '',   // video id
  raw_vid: '',
  title: '',
  pl_title: '', // playlist title
  videos: {
    sd: '',
    hd: '',
    shd: '',
  },
  types: {
    sd: '标清',
    hd: '高清',
    shd: '超清',
  },
  subs: {
  },

  run: function() {
    console.log('run() --');

    this.getTitle();
    if (document.title.search('网易公开课') > -1) {
      this.getOpenCourseSource();
    } else {
      this.getSource();
    }
  },

  getTitle: function() {
    console.log('getTitle() --');
    this.title = document.title;
  },

  getOpenCourseSource: function() {
    console.log('getOpenCourseSource() --');
    var url = document.location.href.split('/'),
        urlMatch = /([A-Z0-9]{9})_([A-Z0-9]{9})/,
        match = urlMatch.exec(url),
        length = url.length,
        xmlUrl,
        that = this;

    if (! match || match.length !== 3) {
      console.error('Failed to get mid!', match);
      return;
    }
    this.raw_vid = match[0];
    this.plid = match[1];
    this.mid = match[2];
    xmlUrl = [
      'http://live.ws.126.net/movie',
      url[length - 3],
      url[length - 2],
      '2_' + this.raw_vid + '.xml',
      ].join('/');
    console.log('xmlUrl: ', xmlUrl);

    GM_xmlhttpRequest({
      method: 'GET',
      url: xmlUrl,
      onload: function(response) {
        var xml = parseXML(response.responseText),
            type,
            video,
            subs,
            sub,
            subName,
            i;

        //that.title = xml.querySelector('all title').innerHTML;
        that.title = that.title.replace('_网易公开课', '');
        for (type in that.videos) {
          video = xml.querySelector('playurl ' + type +' mp4');
          if (video) {
            that.videos[type] = video.firstChild.data;
            continue;
          }
          video = xml.querySelector('playurl ' + type.toUpperCase() +' mp4');
          if (video) {
            that.videos[type] = video.firstChild.data;
          }
        }
        subs = xml.querySelectorAll('subs sub');
        for (i = 0; sub = subs[i]; i += 1) {
          subName = sub.querySelector('name').innerHTML + '字幕';
          that.subs[subName] = sub.querySelector('url').innerHTML;
        }
        that.getMobileOpenCourse();
      },
    });
  },

  /**
   * AES ECB decrypt is too large to embed, so use another way.
   */
  getMobileOpenCourse: function() {
    console.log('getMobileOpenCourse() --');
    var url = 'http://mobile.open.163.com/movie/' + this.plid + '/getMoviesForAndroid.htm',
        that = this;

    console.log('url: ', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var json = JSON.parse(response.responseText),
            video,
            i;

        for (i = 0; i < json.videoList.length; i += 1) {
          video = json.videoList[i];
          console.log('video:', video);
          if (video.mid === that.mid) {
            that.videos.sd = video.repovideourlmp4Origin;
            that.videos.hd = video.repovideourl;
            that.title = video.title;
            that.pl_title = json.title;
            break;
          }
        }
        that.createUI();
      },
    });
  },

  getSource: function() {
    console.log('getSource() --');
    var scripts = document.querySelectorAll('script'),
        script,
        reg = /<source[\s\S]+src="([^"]+)"/,
        match,
        m3u8Reg = /appsrc\:\s*'([\s\S]+)\.m3u8'/,
        m3u8Match,
        i;

    for (i = 0; script = scripts[i]; i += 1) {
      match = reg.exec(script.innerHTML);
      console.log(match);
      if (match && match.length > 1) {
        this.videos.sd = match[1].replace('-mobile.mp4', '.flv');
        this.createUI();
        return true;
      }
      m3u8Match = m3u8Reg.exec(script.innerHTML);
      console.log(m3u8Match);
      if (m3u8Match && m3u8Match.length > 1) {
        this.videos.sd = m3u8Match[1].replace('-list', '') + '.mp4';
        this.createUI();
        return true;
      }
    }
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        },
        formats = ['sd', 'hd', 'shd'],
        format,
        url,
        subName,
        i;

    if (this.pl_title.length > 0) {
      videos.title = this.title;
    }

    for (i = 0; format = formats[i]; i += 1) {
      url = this.videos[format];
      if (url.length > 0) {
        videos.links.push([url]);
        videos.formats.push(this.types[format]);
      }
    }
    for (subName in this.subs) {
      videos.links.push([this.subs[subName]]);
      videos.formats.push(subName);
    }
    multiFiles.run(videos);
  },
};


monkey.extend('v.163.com', [
  'http://v.163.com/',
], monkey_netease);

monkey.extend('open.163.com', [
  'http://open.163.com/',
], monkey_netease);


/**
 * pps.tv
 */
var monkey_pps = {
  vid: '',
  title: '',
  types: {
    1: '高清',
    2: '标清',
    3: '流畅',
  },
  videoUrl: {
    1: '',
    2: '',
    3: '',
  },
  jobs: 3,
  fromIqiyi: false,

  run: function() {
    console.log('run()');
    if (location.href.search('pps.tv/play_') !== -1) {
      this.getId();
    } else {
      console.error('Failed to get vid!');
    }
  },

  getId: function() {
    console.log('getId() -- ');
    var vidReg = /play_([\s\S]+)\.html/,
        vidMatch = vidReg.exec(document.location.href),
        titleReg = /([\s\S]+)-在线观看/,
        titleMatch = titleReg.exec(document.title);
    if (vidMatch) {
      this.vid = vidMatch[1];
    }
    if (titleMatch) {
      this.title = titleMatch[1];
    }
    if (this.vid.length > 0) {
      this.getUrl(1); // 高清
      this.getUrl(2); // 标清
      this.getUrl(3); // 流畅
    }
  },

  getUrl: function(type) {
    console.log('getUrl()');
    var url = [
      'http://dp.ppstv.com/get_play_url_cdn.php?sid=',
      this.vid,
      '&flash_type=1&type=',
      type,
      ].join(''),
      that = this;

    console.log('url: ', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log(response);
        var txt = response.responseText;

        if (txt.search('.pfv?') > 0) {
          that.videoUrl[type] = txt.substr(0, txt.search('.pfv?') + 4);
        }
        that.jobs -= 1;
        if (that.jobs === 0) {
          that.createUI();
        }
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
        },
        types = [3, 2, 1],
        type,
        i;

    for (i = 0; type = types[i]; i += 1) {
      if (this.videoUrl[type]) {
        videos.links.push([this.videoUrl[type]]);
        videos.formats.push(this.types[type]);
      }
    }
    multiFiles.run(videos);
  },
}

monkey.extend('v.pps.tv', [
  'http://v.pps.tv/play_',
], monkey_pps);

monkey.extend('ipd.pps.tv', [
    'http://ipd.pps.tv/play_',
], monkey_pps);


/**
 * sina.com.cn
 */
var monkey_sina = {
  title: '',
  jobs: 0,
  video: {
    format: '标清',
    vid: '',
    url: '',
    links: [],
  },
  hdVideo: {
    format: '高清',
    vid: '',
    url: '',
    links: [],
  },

  run: function() {
    var loc = location.href;
    if (loc.search('/vlist/') > -1) {
      this.getVlist();
    } else if (loc.search('video.sina.com.cn') > -1 ||
               loc.search('open.sina.com.cn') > -1) {
      this.getVid(loc);
    } else {
      console.error('This page is not supported!');
      return;
    }
  },

  /**
   * e.g.
   * http://video.sina.com.cn/vlist/news/zt/topvideos1/?opsubject_id=top12#118295074
   * http://video.sina.com.cn/news/vlist/zt/chczlj2013/?opsubject_id=top12#109873117
   */
  getVlist: function() {
    console.log('getVlist() --');
    var h4s = document.querySelectorAll('h4.video_btn'),
        h4,
        i,
        lis = document.querySelectorAll('ul#video_list li'),
        li,
        As,
        A,
        j,
        that = this;

    if (h4s && h4s.length > 0) {
      this.getVlistItem(h4s[0].parentElement);
      for (i = 0; i < h4s.length; i += 1) {
        h4 = h4s[i];
        h4.addEventListener('click', function(event) {
          that.getVlistItem(event.target.parentElement);
        }, false);
      }

    } else if (lis && lis.length > 0) {
      this.getVlistItem(lis[0]);
      for (i = 0; i < lis.length; i += 1) {
        li = lis[i];
        As = li.querySelectorAll('a.btn_play');
        for (j = 0; A = As[j]; j += 1) {
          A.href= li.getAttribute('vurl');
        }
        li.addEventListener('click', function(event) {
          that.getVlistItem(event.target);
          event.preventDefault();
          return;
        }, false);
      }
    }
  },

  getVlistItem: function(div) {
    console.log('getVlistItem() --', div);
    if (div.hasAttribute('data-url')) {
      this.getVid(div.getAttribute('data-url'));
    } else if (div.nodeName === 'A' && div.className === 'btn_play') {
      this.getVid(div.parentElement.parentElement.parentElement.getAttribute('vurl'));
    } else if (div.nodeName === 'IMG') {
      this.getVid(div.parentElement.parentElement.parentElement.parentElement.getAttribute('vurl'));
    } else if (div.hasAttribute('vurl')) {
      this.getVid(div.getAttribute('vurl'));
    } else {
      console.error('Failed to get vid!', div);
      return;
    }
  },

  /**
   * Get Video vid and hdVid.
   */
  getVid: function(url) {
    console.log('getVid() --', url);
    var that = this;

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log(response);
        var reg = /vid:['"](\d{5,})['"]/,
            txt = response.responseText,
            match = reg.exec(txt),
            hdReg = /hd_vid:'(\d{5,})'/,
            hdMatch = hdReg.exec(txt),
            titleReg = /\s+title:'([^']+)'/,
            titleMatch = titleReg.exec(txt);
            title2Reg = /VideoTitle : "([^"]+)"/,
            title2Match = title2Reg.exec(txt);

        if (titleMatch) {
          that.title = titleMatch[1];
        } else if (title2Match) {
          that.title = title2Match[1];
        }
        if (hdMatch && hdMatch.length > 1) {
          that.hdVideo.vid = hdMatch[1];
          that.jobs += 1;
          that.getVideoByVid(that.hdVideo);
        }
        if (match && match.length > 1) {
          that.video.vid = match[1];
          that.jobs += 1;
          that.getVideoByVid(that.video);
        }
      },
    });
  },

  /**
   * Calcuate video information url
   */
  getURLByVid: function(vid) {
    console.log('getURLByVid() -- ', vid);
    var randInt = parseInt(Math.random() * 1000),
        time = parseInt(Date.now() / 1000) >> 6,
        key = '';

    key = [
      vid,
      'Z6prk18aWxP278cVAH',
      time,
      randInt,
      ].join('');
    key = md5(key);
    console.log('key: ', key);
    key = key.substring(0, 16) + time;
    console.log('key: ', key);

    return [
      'http://v.iask.com/v_play.php?',
      'vid=', vid,
      '&uid=null',
      '&pid=null',
      '&tid=undefined',
      '&plid=4001',
      '&prid=ja_7_4993252847',
      '&referer=',
      '&ran=', randInt,
      '&r=video.sina.com.cn',
      '&v=4.1.42.35',
      '&p=i',
      '&k=', key,
      ].join('');
  },

  /**
   * Get video info specified by vid.
   */
  getVideoByVid: function(container) {
    console.log('getVideoByVid() --', container);
    console.log(this);
    var that = this;
    container.url = this.getURLByVid(container.vid),

    GM_xmlhttpRequest({
      method: 'GET',
      url: container.url,
      onload: function(response) {
        console.log('response: ', response);
        var reg = /<url>.{9}([^\]]+)/g,
            txt = response.responseText,
            match = reg.exec(txt);

        while (match) {
          container.links.push(match[1]);
          match = reg.exec(txt);
        }

        that.jobs -= 1;
        if (that.jobs === 0) {
          that.createUI();
        }
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          formats: [],
          links: [],
          title: this.title,
        };

    if (this.video.links.length > 0) {
      videos.formats.push(this.video.format);
      videos.links.push(this.video.links);
    }
    if (this.hdVideo.links.length > 0) {
      videos.formats.push(this.hdVideo.format);
      videos.links.push(this.hdVideo.links);
    }
    console.log('videos: ', videos);
    multiFiles.run(videos);
  },
}


monkey.extend('video.sina.com.cn', [
  'http://video.sina.com.cn/',
], monkey_sina);

monkey.extend('open.sina.com.cn', [
  'http://open.sina.com.cn/course/',
], monkey_sina);

/**
 * sohu.com
 */
var monkey_sohu = {
  title: '',
  vid: '',
  plid: '',
  referer: '',
  jobs: 0,
  formats: {
    p1: '标清',
    p2: '高清',
    p3: '超清',
    p4: '原画质'
  },

  p1: {
    json: [],
    su: [],
    clipsURL: [],
    ip: '',
    vid: 0,
    reserveIp: [],
    videos: [],
    params: [],
  },

  p2: {
    json: [],
    su: [],
    vid: 0,
    clipsURL: [],
    ip: '',
    reserveIp: [],
    videos: [],
    params: [],
  },

  p3: {
    json: [],
    su: [],
    clipsURL: [],
    vid: 0,
    ip: '',
    reserveIp: [],
    videos: [],
    params: [],
  },

  p4: {
    json: [],
    su: [],
    clipsURL: [],
    vid: 0,
    ip: '',
    reserveIp: [],
    videos: [],
    params: [],
  },

  run: function() {
    console.log('run() --');
    this.router();
  },

  router: function() {
    console.log('router() -- ');
    var host = document.location.hostname;
    if (host === 'my.tv.sohu.com') {
      this.getUGCId();
    } else if (host === 'tv.sohu.com') {
      this.getId();
    } else {
      console.error('Error: this page is not supported');
    }
  },

  /**
   * Get video id for UGC video
   */
  getUGCId: function() {
    console.log('getUGCId() -- ');
    var scripts = document.querySelectorAll('script'),
        script,
        vidReg = /var vid\s+=\s+'(\d+)'/,
        vidMatch,
        titleReg = /,title:\s+'([^']+)'/,
        titleMatch,
        txt,
        i;

    for (i = 0; script = scripts[i]; i += 1) {
      if (script.innerHTML.search('var vid') > -1) {
        txt = script.innerHTML;
        vidMatch = vidReg.exec(txt);
        console.log('vidMatch: ', vidMatch);
        if (vidMatch && vidMatch.length === 2) {
          this.vid = vidMatch[1];
        }
        console.log('titleMatch: ', titleMatch);
        titleMatch = titleReg.exec(txt);
        if (titleMatch && titleMatch.length === 2) {
          this.title = titleMatch[1];
        }
        break;
      }
    }
    if (this.vid.length > 0) {
      this.referer = escape(location.href);
      this.p2.vid = this.vid;
      this.getUGCVideoJSON('p2');
    } else {
      console.error('Error: failed to get video id!');
    }
  },

  /**
   * Get UGC video info
   */
  getUGCVideoJSON: function(fmt) {
    console.log('getUGCVideoJSON() -- ');
    var that = this,
        url = 'http://my.tv.sohu.com/videinfo.jhtml?m=viewtv&vid=' + this.vid;

    console.log('url: ', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var json = JSON.parse(response.responseText);

        console.log('json: ', json);
        that[fmt].json = json;
        that[fmt].su = json.data.su;
        that[fmt].clipsURL = json.data.clipsURL;

        if (fmt === 'p2') {
          if (json.data.norVid) {
            that.p1.vid = json.data.norVid;
            that.getUGCVideoJSON('p1');
          }
          if (json.data.superVid) {
            that.p3.vid = json.data.superVid;
            that.getUGCVideoJSON('p3');
          }
          if (json.data.oriVid) {
            that.p4.vid = json.data.oriVid;
            that.getUGCVideoJSON('p4');
          }
        }
        that.decUGCVideo(fmt);
      },
    });
  },

  /**
   * Decode UGC video url
   */
  decUGCVideo: function(fmt) {
    console.log('decUGCVideo() -- ');
    var url,
        json = this[fmt].json,
        i;

    for (i = 0; i < json.data.clipsURL.length; i += 1) {
      url = [
        'http://', json.allot, '/' ,
        '?prot=', json.prot, 
        '&file=', json.data.clipsURL[i],
        '&new=', json.data.su[i],
      ].join('');
      console.log('url: ', url);
      this[fmt].videos.push('');
      this.jobs += 1;
      this.decUGCVideo2(fmt, url, i);
    }
  },

  decUGCVideo2: function(fmt, url, i) {
    console.log('decUGCVideo2() -- ');
    var that = this;

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log('response:', response);
        var params = response.responseText.split('|');

        that[fmt].params = params;
        that[fmt].videos[i] = [
          params[0],
          that[fmt].su[i],
          '?key=',
          params[3],
        ].join('');
        
        that.jobs -= 1;
        if (that.jobs === 0) {
          that.createUI();
        }
      },
    });
  },

  /**
   * Get video id
   */
  getId: function() {
    console.log('getId() --');
    var scripts = document.querySelectorAll('script'),
        script,
        vidReg = /var vid="(\d+)";/,
        vidMatch,
        playlistReg = /var playlistId="(\d+)";/,
        playlistMatch,
        i;
    for (i = 0; script = scripts[i]; i += 1) {
      if (script.innerHTML.search('var vid') > -1) {
        txt = script.innerHTML;
        vidMatch = vidReg.exec(txt);
        console.log('vidMatch: ', vidMatch);
        if (vidMatch && vidMatch.length === 2) {
          this.vid = vidMatch[1];
        }
        playlistMatch = playlistReg.exec(txt);
        if (playlistMatch && playlistMatch.length === 2) {
          this.plid = playlistMatch[1];
          break;
        }
      }
    }

    if (this.vid) {
      this.p2.vid = this.vid;
      this.title = document.title.split('-')[0].trim();
      this.referer = escape(location.href);
      this.jobs += 1;
      this.getVideoJSON('p2');
    } else {
      console.error('Failed to get vid!');
    }
  },

  /**
   * Get video info.
   * e.g. http://hot.vrs.sohu.com/vrs_flash.action?vid=1109268&plid=5028903&referer=http%3A//tv.sohu.com/20130426/n374150509.shtml
   */
  getVideoJSON: function(fmt) {
    console.log('getVideoJSON() --');
    console.log('fmt: ', fmt);
    var pref = 'http://hot.vrs.sohu.com/vrs_flash.action',
        url = '',
        that = this;

    // If vid is unset, just return it.
    if (this[fmt].vid === 0) {
      return;
    }

    url = [
      pref, 
      '?vid=', this[fmt].vid,
      '&plid=', this.plid,
      '&out=0',
      '&g=8',
      '&referer=', this.referer,
      '&r=1',
      ].join('');
    console.log('url: ', url);

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log('response: ', response);
        var i = 0;

        console.log(that);
        that.jobs -= 1;
        that[fmt].json = JSON.parse(response.responseText);
        //that.title = that[fmt].json.data.tvName;
        that[fmt].clipsURL = that[fmt].json.data.clipsURL;
        that[fmt].su = that[fmt].json.data.su;
        that.p1.vid = that[fmt].json.data.norVid;
        that.p2.vid = that[fmt].json.data.highVid;
        that.p3.vid = that[fmt].json.data.superVid;
        that.p4.vid = that[fmt].json.data.oriVid;
        that[fmt].ip = that[fmt].json.allot;
        that[fmt].reserveIp = that[fmt].json.reserveIp.split(';');
        for (i in that[fmt].clipsURL) {
          url = [
            'http://', that[fmt].ip, '/',
            '?prot=', that[fmt].json.prot,
            '&file=', that[fmt].clipsURL[i],
            '&new=', that[fmt].su[i],
            ].join('');
          that.jobs += 1;
          that[fmt].videos.push('');
          that.getRealUrl(fmt, url, that[fmt].su[i], i);
        }

        if (fmt === 'p2') {
          if (that.p1.vid > 0) {
            that.jobs += 1;
            that.getVideoJSON('p1');
          }
          if (that.p3.vid > 0) {
            that.jobs += 1;
            that.getVideoJSON('p3');
          }
          if (that.p4.vid > 0) {
            that.jobs += 1;
            that.getVideoJSON('p4');
          }
        }

      },
    });
  },

  /**
   * Get final url from content like this:
   *   http://61.54.26.168/sohu/s26h23eab6/6/|145|182.112.229.55|G69w1ucoqFNj8ww74DxHN-6ZQTkgJZ90FlnqBA..|1|0|2|1518|1
   */
  getRealUrl: function(fmt, url, new_, i) {
    console.log('getRealUrl() --', fmt, url, new_, i);
    var that = this;

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var txt = response.responseText,
            params = txt.split('|'),
            start = params[0],
            key = params[3],
            url = [
              start.substr(0, start.length-1), new_,
              '?key=', key,
            ].join('');

        that[fmt].videos[i] = url;
        that.jobs -= 1;

        // Display UI when all processes ended
        if (that.jobs === 0) {
          that.createUI();
        }
      },
    });
  },

  /**
   * Construct UI widgets
   */
  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          links: [],
          formats: [],
        },
        type,
        i;

    for (type in this.formats) {
      console.log('type: ', type);
      if (this[type].videos.length > 0) {
        videos.links.push(this[type].videos);
        videos.formats.push(this.formats[type]);
      }
    }
    if (videos.formats.length > 0) {
      multiFiles.run(videos);
    }
  },
};

monkey.extend('tv.sohu.com', [
  'http://tv.sohu.com/',
], monkey_sohu);


/**
 * tucao.cc
 */
var monkey_tucao = {

  url: '',
  title: '',
  playerId: '',
  key: '',
  timestamp: '',
  vid: '',
  type: '',
  vids: [],
  pos: 0,
  videos: [],
  format: '标清',
  redirect: false,
  types: {
    sina: 'sina',
    tudou: false,  // redirect to original url
    youku: false,  // redirect to original url
  },

  run: function() {
    console.log('run()');
    this.getVid();
  },

  /**
   * Get video id
   */
  getVid: function() {
    console.log('getVid() -- ');
    var playerCode = document.querySelectorAll(
          'ul#player_code li');

    if (playerCode && playerCode.length === 2) {
      this.vids = playerCode[0].firstChild.nodeValue.split('**');
      if (this.vids[this.vids.length - 1] == '') {
        // remove empty vid
        this.vids.pop();
      }
      this.playerId = playerCode[1].innerHTML;
      this.getTitle();
    }
  },

  /**
   * Get video title
   */
  getTitle: function() {
    console.log('getTitle()');
    var params;

    if (this.vids.length === 1 || location.hash === '') {
      this.pos = 0;
      this.url = location.href;
    } else {
      // hash starts with 1, not 0
      this.pos = parseInt(location.hash.replace('#', '')) - 1;
      this.url = location.href.replace(location.hash, '');
    }
    params = getQueryVariable(this.vids[this.pos].split('|')[0]);
    this.vid = params.vid;
    this.type = params.type;
    if (this.vids.length === 1) {
      this.title = document.title.substr(0, document.title.length - 16);
    } else {
      this.title = this.vids[this.pos].split('|')[1];
    }
    this.getUrl();
  },

  /**
   * Get original url
   */
  getUrl: function(type) {
    console.log('getUrl()');
    var url,
        params,
        that = this;

    if (this.types[this.type] === false) {
      this.redirectTo();
      return;
    }

    this.calcKey();
    url = [
      'http://www.tucao.cc/api/playurl.php',
      '?type=',
      this.type,
      '&vid=',
      this.vid,
      '&key=', this.key,
      '&r=', this.timestamp
      ].join('');

    console.log('url: ', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log(response);
        var xml = parseXML(response.responseText),
            durls = xml.querySelectorAll('durl'),
            durl,
            url,
            i;

        for (i = 0; durl = durls[i]; i += 1) {
          url = durl.querySelector('url'); 
          that.videos.push(
            url.innerHTML.replace('<![CDATA[', '').replace(']]>', ''));
        }

        that.createUI();
      },
    });
  },

  /**
   * 计算这个请求的授权key.
   * 算法来自于: http://www.cnbeining.com/2014/05/serious-businesstucao-cc-c-video-resolution/
   * @return [key, timestamp]
   */
  calcKey: function() {
    console.log('calcKey () --');
    var time = new Date().getTime();

    this.timestamp = Math.round(time / 1000);
    var local3 = this.timestamp ^ 2774181285;
    var local4 = parseInt(this.vid, 10);
    var local5 = local3 + local4;
    local5 = (local5 < 0) ? (-(local5) >> 0) : (local5 >> 0);
    this.key = 'tucao' + local5.toString(16) + '.cc';
  },

  /**
   * Redirect to original url
   */
  redirectTo: function() {
    console.log('redirectTo() --');
    console.log(this);
    var urls = {
          tudou: function(vid) {
            return 'http://www.tudou.com/programs/view/' + vid + '/';
          },
          youku: function(vid) {
            return 'http://v.youku.com/v_show/id_' + vid + '.html';
          },
        };

    this.redirect = true;
    this.videos.push(urls[this.type](this.vid));
    this.formats.push('原始地址');
    this.createUI();
  },

  /**
   * Construct ui widgets
   */
  createUI: function() {
    console.log('createUI() -- ');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        },
        video,
        i;

    videos.links.push(this.videos);
    videos.formats.push(this.format);
    multiFiles.run(videos);
  },

}


monkey.extend('www.tucao.cc', [
  'http://www.tucao.cc/play/',
], monkey_tucao);

/**
 * tudou.com
 */
var monkey_tudou = {

  url:'',   // document.location.href
  title: '',
  iid: '',
  vcode: '',
  segs: {},
  totalJobs: 0,
  formats: {
    2: '240P',       // 流畅
    3: '360P',       // 清晰
    4: '480P',       // 高清
    5: '720P',       // 超清
    52: '240P(mp4)',
    53: '360P(mp4)',
    54: '480P(mp4)',
    99: '原画质'     // 原画质
  },
  links: {
  },

  run: function() {
    console.log('run() --');
    this.router();
  },

  /**
   * Page router control
   */
  router: function() {
    console.log('router() --');
    var scripts = document.querySelectorAll('script'),
        script,
        titleReg = /kw:\s*['"]([^'"]+)['"]/,
        titleMatch,
        iidReg = /iid\s*[:=]\s*(\d+)/,
        iidMatch,
        vcodeReg = /vcode: '([^']+)'/,
        vcodeMatch,
        i;

    for (i = 0; script = scripts[i]; i += 1) {
      if (this.vcode.length === 0) {
        vcodeMatch = vcodeReg.exec(script.innerHTML);
        console.log('vcodeMatch:', vcodeMatch);
        if (vcodeMatch && vcodeMatch.length > 1) {
          this.vcode = vcodeMatch[1];
          this.redirectToYouku();
          return;
        }
      }

      if (this.title.length === 0) {
        titleMatch = titleReg.exec(script.innerHTML);
        console.log('titleMatch:', titleMatch);
        if (titleMatch) {
          this.title = titleMatch[1];
        }
      }

      if (this.iid.length === 0) {
        iidMatch = iidReg.exec(script.innerHTML);
        console.log('iidMatch:', iidMatch);
        if (iidMatch) {
          this.iid = iidMatch[1];
          this.getByIid();
          return;
        }
      }
    }
    //this.getPlayList();
  },

  /**
   * Get video info by vid
   */
  getByIid: function() {
    console.log('getByIid()');
    console.log(this);

    var that = this,
        url = 'http://www.tudou.com/outplay/goto/getItemSegs.action?iid=' +
            this.iid;

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        console.log('respone:', response);
        that.segs = JSON.parse(response.responseText);
        that.getAllVideos();
      },
    });
  },

//  getPlayList: function() {
//    console.log('getPlayList()');
//    console.log(this);
//  },

  /**
   * Get all video links
   */
  getAllVideos: function() {
    console.log('getAllVideos() --');
    console.log(this);
    var key,
        videos,
        video,
        i;

    for (key in this.segs) {
      videos = this.segs[key];
      for (i = 0; video = videos[i]; i += 1) {
        console.log(key, video);
        this.links[key] = [];
        this.totalJobs += 1;
        this.getVideoUrl(key, video['k'], video['no']);
      }
    }
  },


  /**
   * Get video url
   */
  getVideoUrl: function(key, k, num) {
    console.log('getVideoUrl() --');
    var url = 'http://ct.v2.tudou.com/f?id=' + k,
        that = this;

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) { 
        console.log('response:', response);
        var reg = /<f[^>]+>([^<]+)</,
            match = reg.exec(response.responseText);

        if (match && match.length > 1) {
          that.links[key][num] = match[1];
          that.totalJobs -= 1;
          if (that.totalJobs === 0) {
            that.createUI();
          }
        }
      },
    });
  },

  /**
   * Redirect url to youku.com.
   * Because tudou.com use youku.com as video source on /albumplay/ page.
   */
  redirectToYouku: function() {
    var url = 'http://v.youku.com/v_show/id_' + this.vcode + '.html';
    console.log('redirectToYouku:', url);
    this.createUI();
  },

  /**
   * Construct UI widgets
   */
  createUI: function() {
    console.log('createUI()');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        },
        type,
        i;

    if (this.vcode.length > 0) {
      videos.title = '原始地址';
      videos.links.push('http://v.youku.com/v_show/id_' + this.vcode + '.html');
      videos.formats.push('');
      singleFile.run(videos);
    } else {
      for (type in this.links) {
        videos.links.push(this.links[type]);
        videos.formats.push(this.formats[type]);
      }
      console.log('videos: ', videos);
      multiFiles.run(videos);
    }
  },

};

monkey.extend('www.tudou.com', [
  'http://www.tudou.com/albumplay/',
  'http://www.tudou.com/listplay/',
  'http://www.tudou.com/programs/view/',
], monkey_tudou);

/**
 * wasu.cn
 */
var monkey_wasu = {

  id: '',
  key: '',
  url: '',
  title: '',
  link: '',
  format: '高清',

  run: function() {
    console.log('run() --');
    this.getTitle();
  },

  getTitle: function() {
    console.log('getTitle() --');
    var h3 = document.querySelector('div.play_movie div.play_site div.l h3');
    if (h3) {
      this.title = h3.innerHTML;
    } else {
      this.title = document.title.replace(
          '高清电影全集在线观看-正版高清电影-华数TV', '').replace(
          ' 正版高清电影', '');
    }
    this.getVid();
  },

  /**
   * Get video id
   */
  getVid: function() {
    console.log('getVid()--');
    var reg = /show\/id\/(\d+)/,
        match = reg.exec(location.href),
        url,
        that = this;

    if (!match || match.length !== 2) {
      console.error('Failed to get vid!');
      return
    }
    this.vid = match[1];
    url = 'http://www.wasu.cn/wap/play/show/id/' + this.vid,

    console.log('url: ', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var txt = response.responseText,
            keyReg = /'key'\s*:\s*'([^']+)'/,
            urlReg = /'url'\s*:\s*'([^']+)'/,
            keyMatch,
            urlMatch;

        keyMatch = keyReg.exec(txt);
        if (! keyMatch || keyMatch.length !== 2) {
          console.error('Failed to get key: ', keyMatch);
          return;
        }
        that.key = keyMatch[1];
        urlMatch = urlReg.exec(txt);
        that.url = urlMatch[1];
        that.getVideoInfo();
      },
    });
  },

  /**
   * Get video information
   */
  getVideoInfo: function() {
    console.log('getVideoInfo() --');
    var url = [
          'http://www.wasu.cn/wap/Api/getVideoUrl/id/', this.vid,
          '/key/', this.key,
          '/url/', this.url,
          '/type/txt',
        ].join(''),
        that = this;

    console.log('video info link: ', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        that.link = response.responseText;
        that.createUI();
      },
    });
  },

  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        };

    if (this.link.length === 0) {
      videos.ok = false;
      videos.msg = 'Failed to get video link';
    } else {
      videos.formats.push(this.format);
      videos.links.push([this.link]);
    }
    multiFiles.run(videos);
  },

};

monkey.extend('www.wasu.cn', [
  'http://www.wasu.cn/Play/show/id/',
  'http://www.wasu.cn/play/show/id/',
  'http://www.wasu.cn/wap/Play/show/id/',
  'http://www.wasu.cn/wap/play/show/id/',
], monkey_wasu);


/**
 * weiqitv.com
 */
var monkey_weiqitv = {
  sid: '',
  vid: '',
  title: '',
  videos: {},
  formats: {
    'default': '标清flv',  // 640x360
          '2': '高清flv',  // 960x540
          '3': '超清flv',  // 1280x720
          '4': '高清mp4',  // 850x480
          '5': '超清mp4',  // 1280x720
  },

  run: function() {
    console.log('run() -- ');
    this.title = document.title.replace('围棋TV - ', '');
    this.getVid();
  },

  getVid: function() {
    console.log('getVid() --');
    var vidReg = /vid:(\d+),/,
        vidMatch,
        sidReg = /sid:(\d+)\s*/,
        sidMatch,
        scripts = document.querySelectorAll('script'),
        script,
        i;

    for (i = 0; i < scripts.length; i += 1) {
      script = scripts[i];
      vidMatch = vidReg.exec(script.innerHTML);
      if (vidMatch && vidMatch.length === 2) {
        this.vid = vidMatch[1];
        sidMatch = sidReg.exec(script.innerHTML);
        this.sid = sidMatch[1];
        break;
      }
    }
    if (this.vid.length === 0) {
      console.error('Failed to get vid!');
    } else {
      this.getVideoInfo();
    }
  },

  getVideoInfo: function() {
    var that = this,
        url = [
          'http://www.yunsp.com.cn:8080/dispatch/videoPlay/getInfo?',
          'vid=', this.vid,
          '&sid=', this.sid,
          '&isList=0&ecode=notexist',
        ].join('');

    console.log('url: ', url);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var json = JSON.parse(response.responseText),
            videoInfo = json[0].videoInfo,
            format;

        for (format in that.formats) {
          if (format in videoInfo) {
            that.videos[format] = videoInfo[format].url;
          }
        }
        that.createUI();
      },
    });
  },

  /**
   * construct ui widgets.
   */
  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        },
        types = ['default', '4', '2', '5', '3'],
        type,
        url,
        i;
  
    for (i = 0; type = types[i]; i += 1) {
      url = this.videos[type];
      if (url && url.length > 0) {
        videos.links.push([url]);
        videos.formats.push(this.formats[type]);
      }
    }

    multiFiles.run(videos);
  },
};

monkey.extend('www.weiqitv.com', [
  'http://www.weiqitv.com/index/live_back?videoId=',
  'http://www.weiqitv.com/index/video_play?videoId=',
], monkey_weiqitv);

/**
 * youku.com
 */
var monkey_youku = {
  // store xhr result, with json format
  rs: null,
  brs: null,

  // store video formats and its urls
  data: null,
  title: '',
  videoId: '',

  run: function() {
    console.log('run() --');
    this.getVideoId();
  },

  /**
   * Get video id, and stored in yk.videoId.
   *
   * Page url for playing page almost like this:
   *   http://v.youku.com/v_show/id_XMjY1OTk1ODY0.html
   *   http://v.youku.com/v_playlist/f17273995o1p0.html
   */
  getVideoId: function() {
    console.log('getVideoId() --');
    var url = location.href,
        idReg = /(?:id_)(.*)(?:.html)/, 
        idMatch = idReg.exec(url),
        idReg2 = /(?:v_playlist\/f)(.*)(?:o1p\d.html)/,
        idMatch2 = idReg2.exec(url);

    console.log('idMatch: ', idMatch);
    console.log('idMatch2: ', idMatch2);
    if (idMatch && idMatch.length === 2) {
      this.videoId = idMatch[1];
      this.getPlayListMeta();
    } else if (idMatch2 && idMatch2.length === 2) {
      this.videoId = idMatch2[1];
      this.getPlayListMeta();
    } else {
      error('Failed to get video id!');
    }
  },

  /**
   * Get metadata of video playlist
   */
  getPlayListMeta: function() {
    console.log('getPlaylistMeta() --');
    var url = 'http://v.youku.com/player/getPlayList/VideoIDS/' + this.videoId,
        url2 = url + '/Pf/4/ctype/12/ev/1',
        that = this;

    console.log('url2:', url2);
    GM_xmlhttpRequest({
      method: 'GET',
      url: url2,
      onload: function(response) {
        var json = JSON.parse(response.responseText);
        if (json.data.length === 0) {
          console.error('Error: video not found!');
          return;
        }
        that.rs = json.data[0];
        that.title = that.rs.title;
        that.parseVideo();
      }
    });

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function(response) {
        var json = JSON.parse(response.responseText);
        if (json.data.length === 0) {
          console.error('Error: video not found!');
          return;
        }
        that.brs = json.data[0];
        that.parseVideo();
      }
    });
  },

  parseVideo: function() {
    console.log('parseVideo() --');
    if (! this.rs || ! this.brs) {
      return;
    }

    var streamtypes = this.rs.streamtypes,
        streamfileids = this.rs.streamfileids,
        data = {},
        seed = this.rs.seed,
        segs = this.rs.segs,
        key,
        value,
        k,
        v,
        ip = this.rs.ip,
        bsegs = this.brs.segs,
        sid,
        token,
        i,
        k,
        number,
        fileId0,
        fileId,
        ep,
        pass1 = 'becaf9be',
        pass2 = 'bf7e5f01',
        typeArray = {
          'flv': 'flv', 'mp4': 'mp4', 'hd2': 'flv', '3gphd': 'mp4',
          '3gp': 'flv', 'hd3': 'flv'
          },
        sharpness = {
          'flv': 'normal', 'flvhd': 'normal', 'mp4': 'high',
          'hd2': 'super', '3gphd': 'high', '3g': 'normal',
          'hd3': 'original'
        },
        filetype;

    [sid, token] = this.yk_e(pass1, this.yk_na(this.rs.ep)).split('_');
    
    for (key in segs) {
      value = segs[key];
      if (streamtypes.indexOf(key) > -1) {
        for (i in value) {
          v = value[i];
          number = parseInt(v.no, 10).toString(16).toUpperCase();
          if (number.length === 1) {
            number = '0'.concat(number);
          }
          // 构建视频地址K值
          k = v.k;
          if (!k || k === -1) {
            console.log(bsegs, bsegs[key], bsegs[key][i]);
            k = bsegs[key][i]['k'];
          }
          fileId0 = this.getFileId(streamfileids[key], seed);
          fileId = fileId0.substr(0, 8) + number + fileId0.substr(10);
          ep = encodeURIComponent(this.yk_d(
                this.yk_e(pass2, [sid, fileId, token].join('_'))));

          // 判断后缀类型, 获得后缀
          filetype = typeArray[key];
          data[key] = data[key] || [];
          data[key].push([
            'http://k.youku.com/player/getFlvPath/sid/', sid,
            '_00/st/', filetype,
            '/fileid/', fileId,
            '?K=', k,
            '&ctype=12&ev=1&token=', token,
            '&oip=', ip,
            '&ep=', ep,
            ].join(''));
        }
      }
    }
    this.data = data;
    this.createUI();
  },

  /**
   * Get file id of each video file.
   *
   * @param string seed
   *  - the file seed number.
   * @param string fileId
   *  - file Id.
   * @return string
   *  - return decrypted file id.
   */
  getFileId: function(fileId, seed) {
    console.log('getFileId() --');
    function getFileIdMixed(seed) {
      var mixed = [],
          source = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZ/\\:._-1234567890',
          len = source.length,
          index,
          i;
    
      for (i = 0; i < len; i += 1) {
          seed = (seed * 211 + 30031) % 65536;
          index = Math.floor(seed / 65536 * source.length);
          mixed.push(source.charAt(index));
          source = source.replace(source.charAt(index), '');
      }
      return mixed;
    }

    var mixed = getFileIdMixed(seed),
        ids = fileId.split('\*'),
        len = ids.length - 1,
        realId = '',
        idx,
        i;

    for (i = 0; i < len; i += 1) {
      idx = parseInt(ids[i]);
      realId += mixed[idx];
    }
    return realId;
  },

  /**
   * Timestamp
   */
  getSid: function() {
    return String((new Date()).getTime()) + '01';
  },

  /**
   * Decryption
   */
  yk_d: function(s) {
    var len = s.length,
        i = 0,
        result = [],
        e = 0,
        g = 0,
        h,
        chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    if (len === 0) {
      return '';
    }

    while (i < len) {
      e = s.charCodeAt(i) & 255;
      i = i + 1;
      if (i === len) {
        result.push(chars.charAt(e >> 2));
        result.push(chars.charAt((e & 3) << 4));
        result.push('==');
        break
      }
      g = s.charCodeAt(i);
      i = i + 1;
      if (i === len) {
        result.push(chars.charAt(e >> 2));
        result.push(chars.charAt((e & 3) << 4 | (g & 240) >> 4));
        result.push(chars.charAt((g & 15) << 2));
        result.push('=');
        break
      }
      h = s.charCodeAt(i);
      i = i + 1;
      result.push(chars.charAt(e >> 2));
      result.push(chars.charAt((e & 3) << 4 | (g & 240) >> 4));
      result.push(chars.charAt((g & 15) << 2 | (h & 192) >> 6));
      result.push(chars.charAt(h & 63));
    }
    return result.join('');
  },

  yk_na: function(a) {
    if (! a) {
      return '';
    }

    var h = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1],
        i = a.length,
        e = [],
        f = 0,
        b,
        c;

    while (f < i) {
      do {
        c = h[a.charCodeAt(f++) & 255];
      } while (f < i && c === -1);
      if (c === -1) {
        break;
      }

      do {
        b = h[a.charCodeAt(f++) & 255];
      } while (f < i && b === -1);
      if (b === -1) {
        break;
      }
      e.push(String.fromCharCode(c << 2 | (b & 48) >> 4));

      do {
        c = a.charCodeAt(f++) & 255;
        if (c === 61) {
          return e.join('');
        }
        c = h[c];
      } while (f < i && c === -1);
      if (c === -1) {
        break;
      }
      e.push(String.fromCharCode((b & 15) << 4 | (c & 60) >> 2));

      do {
        b = a.charCodeAt(f) & 255;
        f = f + 1;
        if (b === 61) {
          return e.join('');
        }
        b = h[b];
      } while (f < i && b === -1);
      if (b === -1) {
        break;
      }
      e.push(String.fromCharCode((c & 3) << 6 | b));
    }

    return e.join('');
  },

  yk_e: function(a, c) {
    var f = 0,
        i = '',
        e = [],
        q = 0,
        h = 0,
        b = {};
    for (h = 0; h < 256; h = h + 1) {
      b[h] = h;
    }
    for (h = 0; h < 256; h = h + 1) {
      f = ((f + b[h]) + a.charCodeAt(h % a.length)) % 256;
      i = b[h];
      b[h] = b[f];
      b[f] = i;
    }
    for (q = 0, f = 0, h = 0; q < c.length; q = q + 1) {
      h = (h + 1) % 256;
      f = (f + b[h]) % 256;
      i = b[h];
      b[h] = b[f];
      b[f] = i;
      e.push(String.fromCharCode(c.charCodeAt(q) ^ b[(b[h] + b[f]) % 256]));
    }
    return e.join('');
  },

  /**
   * construct video data and create UI widgets.
   */
  createUI: function() {
    console.log('createUI() --');
    console.log(this);
    var videos = {
          title: this.title,
          formats: [],
          links: [],
        },
        types = {
          '3gp': '3G',
          '3gphd': '3G高清',
          flv: '标清',
          flvhd: '高清Flv',
          mp4: '高清',
          hd2: '超清',
          hd3: '1080P',
        },
        type;

    for(type in types) {
      if (type in this.data) {
        videos.formats.push(types[type]);
        videos.links.push(this.data[type]);
      }
    }

    multiFiles.run(videos);
  },
};

monkey.extend('v.youku.com', [
  'http://v.youku.com/v_show/id_',
  'http://v.youku.com/v_playlist/',
], monkey_youku);


/**
 * youtube.com
 */
var monkey_youtube = {
  videoId: '',
  videoInfoUrl: null,
  videoTitle: '',
  stream: null,
  adaptive_fmts: null,
  urlInfo: false,

  // format list comes from https://github.com/rg3/youtube-dl
  formats:  {
    '5': {ext: 'flv', width: 400, height: 240, resolution: '240p'},
    '6': {ext: 'flv', width: 450, height: 270, resolution: '270p'},
    '13': {ext: '3gp', resolution: 'unknown'},
    '17': {ext: '3gp', width: 176, height: 144, resolution: '144p'},
    '18': {ext: 'mp4', width: 640, height: 360, resolution: '360p'},
    '22': {ext: 'mp4', width: 1280, height: 720, resolution: '720p'},
    '34': {ext: 'flv', width: 640, height: 360, resolution: '360p'},
    '35': {ext: 'flv', width: 854, height: 480, resolution: '720p'},
    '36': {ext: '3gp', width: 320, height: 240, resolution: '240p'},
    '37': {ext: 'mp4', width: 1920, height: 1080, resolution: '1080p'},
    '38': {ext: 'mp4', width: 4096, height: 3072, resolution: '4k'},
    '43': {ext: 'webm', width: 640, height: 360, resolution: '360p'},
    '44': {ext: 'webm', width: 854, height: 480, resolution: '480p'},
    '45': {ext: 'webm', width: 1280, height: 720, resolution: '720p'},
    '46': {ext: 'webm', width: 1920, height: 1080, resolution: '1080p'},


    // 3d videos
    '82': {'ext': 'mp4', 'height': 360, 'resolution': '360p', 'format_note': '3D', 'preference': -20},
    '83': {'ext': 'mp4', 'height': 480, 'resolution': '480p', 'format_note': '3D', 'preference': -20},
    '84': {'ext': 'mp4', 'height': 720, 'resolution': '720p', 'format_note': '3D', 'preference': -20},
    '85': {'ext': 'mp4', 'height': 1080, 'resolution': '1080p', 'format_note': '3D', 'preference': -20},
    '100': {'ext': 'webm', 'height': 360, 'resolution': '360p', 'format_note': '3D', 'preference': -20},
    '101': {'ext': 'webm', 'height': 480, 'resolution': '480p', 'format_note': '3D', 'preference': -20},
    '102': {'ext': 'webm', 'height': 720, 'resolution': '720p', 'format_note': '3D', 'preference': -20},

    // Apple HTTP Live Streaming
    '92': {'ext': 'mp4', 'height': 240, 'resolution': '240p', 'format_note': 'HLS', 'preference': -10},
    '93': {'ext': 'mp4', 'height': 360, 'resolution': '360p', 'format_note': 'HLS', 'preference': -10},
    '94': {'ext': 'mp4', 'height': 480, 'resolution': '480p', 'format_note': 'HLS', 'preference': -10},
    '95': {'ext': 'mp4', 'height': 720, 'resolution': '720p', 'format_note': 'HLS', 'preference': -10},
    '96': {'ext': 'mp4', 'height': 1080, 'resolution': '1080p', 'format_note': 'HLS', 'preference': -10},
    '132': {'ext': 'mp4', 'height': 240, 'resolution': '240p', 'format_note': 'HLS', 'preference': -10},
    '151': {'ext': 'mp4', 'height': 72, 'resolution': '72p', 'format_note': 'HLS', 'preference': -10},

    // DASH mp4 video
    '133': {'ext': 'mp4', 'width': 400, 'height': 240, 'resolution': '240p', 'format_note': 'DASH video', 'preference': -40},
    '134': {'ext': 'mp4', 'width': 640, 'height': 360, 'resolution': '360p', 'format_note': 'DASH video', 'preference': -40},
    '135': {'ext': 'mp4', 'width': 854, 'height': 480, 'resolution': '480p', 'format_note': 'DASH video', 'preference': -40},
    '136': {'ext': 'mp4', 'width': 1280, 'height': 720, 'resolution': '720p', 'format_note': 'DASH video', 'preference': -40},
    '137': {'ext': 'mp4', 'width': 1920, 'height': 1080, 'resolution': '1080p', 'format_note': 'DASH video', 'preference': -40},
    '138': {'ext': 'mp4', 'width': 1921, 'height': 1081, 'resolution': '>1080p', 'format_note': 'DASH video', 'preference': -40},
    '160': {'ext': 'mp4', 'width': 256, 'height': 192, 'resolution': '192p', 'format_note': 'DASH video', 'preference': -40},
    '264': {'ext': 'mp4', 'width': 1920, 'height': 1080, 'resolution': '1080p', 'format_note': 'DASH video', 'preference': -40},

    // Dash mp4 audio
    '139': {'ext': 'm4a', 'format_note': 'DASH audio', 'vcodec': 'none', 'abr': 48, 'preference': -50},
    '140': {'ext': 'm4a', 'format_note': 'DASH audio', 'vcodec': 'none', 'abr': 128, 'preference': -50},
    '141': {'ext': 'm4a', 'format_note': 'DASH audio', 'vcodec': 'none', 'abr': 256, 'preference': -50},

    // Dash webm
    '167': {'ext': 'webm', 'height': 360, 'width': 640, 'format_note': 'DASH video', 'container': 'webm', 'vcodec': 'VP8', 'acodec': 'none', 'preference': -40, resolution: '360p'},
    '168': {'ext': 'webm', 'height': 480, 'width': 854, 'format_note': 'DASH video', 'container': 'webm', 'vcodec': 'VP8', 'acodec': 'none', 'preference': -40, resolution: '480p'},
    '169': {'ext': 'webm', 'height': 720, 'width': 1280, 'format_note': 'DASH video', 'container': 'webm', 'vcodec': 'VP8', 'acodec': 'none', 'preference': -40, resolution: '720p'},
    '170': {'ext': 'webm', 'height': 1080, 'width': 1920, 'format_note': 'DASH video', 'container': 'webm', 'vcodec': 'VP8', 'acodec': 'none', 'preference': -40, resolution: '1080p'},
    '218': {'ext': 'webm', 'height': 480, 'width': 854, 'format_note': 'DASH video', 'container': 'webm', 'vcodec': 'VP8', 'acodec': 'none', 'preference': -40, resolution: '480p'},
    '219': {'ext': 'webm', 'height': 480, 'width': 854, 'format_note': 'DASH video', 'container': 'webm', 'vcodec': 'VP8', 'acodec': 'none', 'preference': -40, resolution: '480p'},
    '242': {'ext': 'webm', 'height': 240, 'resolution': '240p', 'format_note': 'DASH webm', 'preference': -40},
    '243': {'ext': 'webm', 'height': 360, 'resolution': '360p', 'format_note': 'DASH webm', 'preference': -40},
    '244': {'ext': 'webm', 'height': 480, 'resolution': '480p', 'format_note': 'DASH webm', 'preference': -40},
    '245': {'ext': 'webm', 'height': 480, 'resolution': '480p', 'format_note': 'DASH webm', 'preference': -40},
    '246': {'ext': 'webm', 'height': 480, 'resolution': '480p', 'format_note': 'DASH webm', 'preference': -40},
    '247': {'ext': 'webm', 'height': 720, 'resolution': '720p', 'format_note': 'DASH webm', 'preference': -40},
    '248': {'ext': 'webm', 'height': 1080, 'resolution': '1080p', 'format_note': 'DASH webm', 'preference': -40},

    // Dash webm audio
    '171': {'ext': 'webm', 'vcodec': 'none', 'format_note': 'DASH webm audio', 'abr': 48, 'preference': -50},
    '172': {'ext': 'webm', 'vcodec': 'none', 'format_note': 'DASH webm audio', 'abr': 256, 'preference': -50},

    // RTMP (unnamed)
    '_rtmp': {'protocol': 'rtmp'},
  },

  run: function() {
    console.log('run() --');
    this.getURLInfo();
  },

  /**
   * parse location.href
   */
  getURLInfo: function() {
    this.urlInfo = this.parseURI(unsafeWindow.location.href);
    if (document.location.href.contains('/embed/')) {
      window.location.href = this.urlInfo.replace('/embed/', '/watch?v=');
    } else {
      this.getVideo();
    }
  },

  /**
   * Get video url info:
   */
  getVideo: function () {
    console.log('getVideo()--');
    var that = this;

    if (!this.urlInfo.params['v']) {
      return;
    }

    this.videoId = this.urlInfo.params['v'];
    this.videoInfoUrl = [
      '/get_video_info',
      '?video_id=', this.videoId,
      //'&el=player_embeded&hl=en&gl=US',
      '&el=html5&hl=en&gl=US',
      '&eurl=https://youtube.googleapis.com/v/', this.videoId,
      ].join('');
    this.videoTitle = unsafeWindow.document.title.substr(
        0, unsafeWindow.document.title.length - 10);

    GM_xmlhttpRequest({
      method: 'GET',
      url: this.videoInfoUrl,
      onload: function(response) {
        console.log('xhr response: ', response);
        that.parseStream(response.responseText);
      },
    });
  },

  /**
   * Parse stream info from xhr text:
   */
  parseStream: function(rawVideoInfo) {
    console.log('parseStream() ---');
    var that = this;

    /**
     * Parse the stream text to Object
     */
    function _parseStream(rawStream){
      var a = decodeURIComponent(rawStream).split(',');
      return a.map(that.urlHashToObject);
    }

    this.videoInfo = this.urlHashToObject(rawVideoInfo);
    this.stream = _parseStream(this.videoInfo.url_encoded_fmt_stream_map);
    this.adaptive_fmts = _parseStream(this.videoInfo.adaptive_fmts)
    this.createUI();
  },

  /**
   * Create download list:
   */
  createUI: function() {
    console.log('createUI() -- ');
    console.log('this: ', this);
    var videos = {
          title: this.videoTitle,
          formats: [],
          links: [],
          ok: true,
          msg: '',
        },
        video,
        format,
        formatName,
        url,
        streams = this.stream.concat(this.adaptive_fmts),
        i;

    for (i = 0; video = streams[i]; i += 1) {
      format = this.formats[video['itag']];
      if (! format) {
        console.error('current format not supported: ', video);
        continue;
      }
      formatName = []
      if ('format_note' in format) {
        formatName.push(format.format_note);
      }
      if ('resolution' in format) {
        if (formatName.length > 0) {
          formatName.push('-');
        }
        formatName.push(format.resolution);
      }
      if ('ext' in format) {
        formatName.push('.');
        formatName.push(format.ext);
      }
      formatName = formatName.join('');
      if (videos.formats.indexOf(formatName) >= 0) {
        continue;
      }
      videos.formats.push(formatName);
      url = decodeURIComponent(video.url);
      if ('sig' in video) {
        url = url + '&signature=' + video.sig
      }
      videos.links.push(url);
    }

    if (videos.links.length === 0) {
      videos.ok = false;
      videos.msg = 'This video does not allowed to download';
    }
    singleFile.run(videos);
  },

  /**
   * Parse URL hash and convert to Object.
   */
  urlHashToObject: function(hashText) {
    var list = hashText.split('&'),
        output = {},
        len = list.length,
        i = 0,
        tmp = '';

    for (i = 0; i < len; i += 1) {
      tmp = list[i].split('=')
      output[tmp[0]] = tmp[1];
    }
    return output;
  },

  /**
   * FROM: http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
   * This function creates a new anchor element and uses location
   * properties (inherent) to get the desired URL data. Some String
   * operations are used (to normalize results across browsers).
   */
  parseURI: function(url) {
    var a =  unsafeWindow.document.createElement('a');
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace(':',''),
      host: a.hostname,
      port: a.port,
      query: a.search,
      params: (function(){
        var ret = {},
            seg = a.search.replace(/^\?/,'').split('&'),
            len = seg.length,
            i = 0,
            s;

        for (i = 0; i< len; i += 1) {
          if (seg[i]) {
            s = seg[i].split('=');
            ret[s[0]] = s[1];
          }
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
      hash: a.hash.replace('#',''),
      path: a.pathname.replace(/^([^\/])/,'/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
      segments: a.pathname.replace(/^\//,'').split('/')
    };
  },
};


monkey.extend('www.youtube.com', [
  'http://www.youtube.com/watch?v=',
  'https://www.youtube.com/watch?v=',
  'http://www.youtube.com/embed/',
  'https://www.youtube.com/embed/',
], monkey_youtube);

  // In the end, get video handler and call it
  monkey.run();

}).call(this);
