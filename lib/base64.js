/**
 * 来自http: //www1.tc711.com/tool/js/Base64.js
 */
var base64 = {
  encodeChars:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  decodeChars: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1],
  encode: function(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = '';
    while (i < len) {
      c1 = str.charCodeAt(i++) & 255;
      if (i == len) {
        out += this.encodeChars.charAt(c1 >> 2);
        out += this.encodeChars.charAt((c1 & 3) << 4);
        out += '==';
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        out += this.encodeChars.charAt(c1 >> 2);
        out += this.encodeChars.charAt(((c1 & 3) << 4) | ((c2 & 240) >> 4));
        out += this.encodeChars.charAt((c2 & 15) << 2);
        out += '=';
        break;
      }
      c3 = str.charCodeAt(i++);
      out += this.encodeChars.charAt(c1 >> 2);
      out += this.encodeChars.charAt(((c1 & 3) << 4) | ((c2 & 240) >> 4));
      out += this.encodeChars.charAt(((c2 & 15) << 2) | ((c3 & 192) >> 6));
      out += this.encodeChars.charAt(c3 & 63);
    }
    return out;
  },
  decode: function(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    len = str.length;
    i = 0;
    out = '';
    while (i < len) {
      do {
        c1 = this.decodeChars[str.charCodeAt(i++) & 255];
      }
      while (i < len && c1 == -1);
      if (c1 == -1)
        break;
      do {
        c2 = this.decodeChars[str.charCodeAt(i++) & 255];
      }
      while (i < len && c2 == -1);
      if (c2 == -1)
        break;
      out += String.fromCharCode((c1 << 2) | ((c2 & 48) >> 4));
      do {
        c3 = str.charCodeAt(i++) & 255;
        if (c3 == 61)
          return out;
        c3 = this.decodeChars[c3];
      }
      while (i < len && c3 == -1);
      if (c3 == -1)
        break;
      out += String.fromCharCode(((c2 & 15) << 4) | ((c3 & 60) >> 2));
      do {
        c4 = str.charCodeAt(i++) & 255;
        if (c4 == 61)
          return out;
        c4 = this.decodeChars[c4];
      }
      while (i < len && c4 == -1);
      if (c4 == -1)
        break;
      out += String.fromCharCode(((c3 & 3) << 6) | c4);
    }
    return out;
  },
  utf8to16: function(str) {
    var out, i, len, c;
    var char2, char3;
    out = '';
    len = str.length;
    i = 0;
    while (i < len) {
      c = str.charCodeAt(i++);
      switch (c >> 4) {
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
        case 12:
        case 13:
          char2 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 31) << 6) | (char2 & 63));
          break;
        case 14:
          char2 = str.charCodeAt(i++);
          char3 = str.charCodeAt(i++);
          out += String.fromCharCode(((c & 15) << 12) | ((char2 & 63) << 6) | ((char3 & 63) << 0));
          break;
      }
    }
    return out;
  },
  utf16to8: function(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
      }
    }
    return out;
  }
}
