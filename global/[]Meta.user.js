// ==UserScript==
// @name        []Meta
// @description
// @version     1.00
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @author      Dodying
// @namespace   https://github.com/dodying/
// @supportURL  https://github.com/dodying//UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @require     https://raw.githubusercontent.com/wrangr/psl/master/dist/psl.min.js
// @noframes
// @include     *
// @connect     *
// ==/UserScript==
(function() {
  const $ = e => document.querySelector(e);
  const $$ = e => document.querySelectorAll(e);
  const getFav = (url, func = undefined) => {
    GM_xmlhttpRequest({
      method: 'GET',
      timeout: 5000,
      url: url,
      responseType: 'blob',
      onload: res => {
        if (res.status === 200 && res.responseHeaders.match('content-type: image') && !!res.response && res.response.size !== 492) {
          setIcon();
        } else {
          if (func) func();
        }
      },
      onerror: () => {
        if (func) func();
      },
      ontimeout: () => {
        if (func) func();
      }
    });
  };
  const setIcon = (f = true) => {
    var icon = GM_getValue('icon', {});
    icon[location.host] = f;
    GM_setValue('icon', icon);
  };
  const canvasFav = a => {
    var c = document.createElement('canvas');
    var r = 8;
    c.width = 2 * r;
    c.height = 2 * r;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.font = 'bold ' + (r * 2) + 'px sans-serif';
    ctx.fillText(a, r, r);
    return c.toDataURL();
  };
  const newFav = () => {
    var fav = document.createElement('link');
    fav.rel = 'shortcut icon';
    fav.href = canvasFav(psl.parse(location.host).sld.substr(0, 1));
    document.head.appendChild(fav);
    setIcon(false);
  };
  if ($('link[type="application/rss+xml"],link[type="application/atom+xml"]')) {
    [...$$('link[type="application/rss+xml"],link[type="application/atom+xml"]')].forEach((i, j) => {
      GM_registerMenuCommand('RSS-' + j + ':' + (i.title || ''), () => {
        window.open(i.href);
      });
    });
  }
  var icon = GM_getValue('icon', {});
  if (location.host in icon) {
    if (icon[location.host] === false) newFav();
  } else if (!$('link[rel*="icon"]')) {
    getFav(location.origin + '/favicon.ico', () => {
      getFav('https://www.google.com/s2/favicons?domain=' + location.host, newFav);
    });
  }
})();
