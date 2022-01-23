/* eslint-env browser */
// ==UserScript==
// @name        [NH]nhentai Downloader
// @description
// @include     https://nhentai.net/g/*
// @version     0.0.5
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://gitee.com/dodying/userJs/raw/master/Logo.png
// @run-at      document-end
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     i.nhentai.net
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.js
// @require     https://gitee.com/dodying/userJs/raw/master/lib/queue.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js
// ==/UserScript==
(function () {
  /* global queue JSZip */
  // https://caolan.github.io/async/docs.html#queue
  // https://caolan.github.io/async/docs.html#QueueObject

  if (window.location.href.match(/\/\/nhentai\.net\/g\/\d+\/\d+\//)) return;

  let task; let status; let
    zip;
  const info = unsafeWindow.gallery;
  const CONFIG = GM_getValue('config', {});
  addStyle();
  UI();

  function addStyle() {
    const style = [
      '.nhD-box{text-align:justify;}',

      '.nhD-config-box{position:absolute;top:0;left:0;right:0;background:#1f1f1f;margin-left:25%;margin-right:25%;}',
      '.nhD-config-box>div{text-align:justify;margin:10px 15px;}',
      '.nhD-config-box input[type="number"]{width:60px;}',

      '.nhD-log-box{position:fixed;bottom:0;right:0;background:#1f1f1f;}',
      '.nhD-task-total-box{height:20px;border:2px solid #000;text-align:center;color:white;font-size:1px;}',
      '.nhD-task-total-box>div{float:left;}',
      '.nhD-task-total[style="width: 0%;"]{display:none}',
      '.nhD-task-total[name="succeed"]{background:green;}',
      '.nhD-task-total[name="error"]{background:red;}',
      '.nhD-task-total[name="downloading"]{background:blue;}',
      '.nhD-task-total[name="queue"]{background:white;}',
      '.nhD-log-box>ol{max-height:240px;overflow-y:auto;}',
      '.nhD-task-span[name="abort"]::before{content:"Downloading";color:blue;}',
      '.nhD-task-span[name="abort"][speed]::before{content:attr(speed) " KB/s";}',
      '.nhD-task-span[name="abort"]:hover::before{content:"Click to Abort";color:yellow;cursor:pointer;}',
      '.nhD-task-span[name="timeout"]::before{content:"Timeout";color:red;}',
      '.nhD-task-span[name="error"]::before{content:"Error";color:red;}',
      '.nhD-task-span[name="user"]::before{content:"User Aborted";color:red;}',
      '.nhD-task-span[name="succeed"]::before{content:"Succeed";color:green;}',
      '.nhD-task-pause::before{content:"Pause";}',
      '.nhD-task-pause[name="continue"]::before{content:"Continue";}',
    ];
    $('<style></style>').text(style.join('')).appendTo('head');
  }

  function UI() {
    $('<div class="nhD-box"></div>').appendTo('#info-block');
    $('<button class="btn btn-primary">Download Archive</button>').on('click', () => {
      download();
    }).appendTo('.nhD-box');
    $('<button class="btn btn-primary">Download Info</button>').on('click', () => {
      const blob = new window.Blob([generateInfo()], {
        type: 'text/plain;charset=utf-8',
      });
      $('<a class="btn btn-primary">Click to download</a>').attr('download', `${$('#info>h1').text()}.txt`).attr('href', URL.createObjectURL(blob))[0].click();
    }).appendTo('.nhD-box');
    $('<button class="btn btn-primary">Settings</button>').on('click', () => {
      if ($('.nhD-config-box').length === 0) {
        config();
      } else {
        $('.nhD-config-box').remove();
      }
    }).appendTo('.nhD-box');
  }

  function config() {
    const html = [
      '<div>Download <input type="number" name="thread" placeholder="5"> images at the same time (&lt;=5 is advised)</div>',
      '<div>Abort downloading current image after <input type="number" name="timeout" placeholder="300"> second(s) (0 is never abort)</div>',
      '<div>Skip current image after retried <input type="number" name="retry" placeholder="10"> time(s) (-1 is always retry)</div>',
    ];
    $('<div class="nhD-config-box"></div>').html(html.join('')).appendTo('body');
    $('<button class="btn btn-primary">Save</button>').on('click', () => {
      const _config = {};
      $('.nhD-config-box').find('input:not([type="button"]),select').toArray().forEach((i) => {
        let name; let
          value;
        if (i.type === 'number') {
          name = i.name;
          value = (i.value || i.placeholder) * 1;
          if (isNaN(value)) return;
        } else if (i.type === 'text' || i.type === 'hidden') {
          name = i.name;
          value = i.value || i.placeholder;
        } else if (i.type === 'checkbox') {
          name = i.id;
          value = i.checked;
        } else if (i.type === 'select-one') {
          name = i.name;
          value = i.value;
        }
        _config[name] = value;
      });
      GM_setValue('config', _config);
      Object.assign(CONFIG, _config);
      if (typeof task !== 'undefined') { // task has been start
        task.concurrency = CONFIG.thread;
      }
      $('.nhD-config-box').remove();
    }).appendTo('.nhD-config-box');
    $('<button class="btn btn-primary">Cancel</button>').on('click', () => {
      $('.nhD-config-box').remove();
    }).appendTo('.nhD-config-box');
    $('.nhD-config-box').find('input:not([type="button"]),select').toArray().forEach((i) => {
      let name; let
        value;
      name = i.name || i.id;
      if (!(name in CONFIG)) return;
      value = CONFIG[name];
      if (i.type === 'text' || i.type === 'hidden' || i.type === 'select-one' || i.type === 'number') {
        i.value = value;
      } else if (i.type === 'checkbox') {
        i.checked = value;
      }
    });
  }

  function download() {
    if (typeof task !== 'undefined' && !window.confirm('Downloading but start a new downlader?')) return;

    zip = new JSZip();
    zip.file('info.txt', generateInfo());

    if ($('.nhD-log-box').length) $('.nhD-log-box').remove();
    $('<div class="nhD-log-box"></div>').html('<div class="nhD-task-total-box"><div class="nhD-task-total" name="succeed"></div><div class="nhD-task-total" name="error"></div><div class="nhD-task-total" name="downloading"></div><div class="nhD-task-total" name="queue"></div></div><ol></ol><button class="nhD-task-pause btn btn-primary"></button>').appendTo('body');

    const length = info.num_pages;
    task = unsafeWindow.gallery.images.pages.map((i, order) => {
      const type = i.t === 'j' ? 'jpg' : 'png';
      return {
        url: `https://i.nhentai.net/galleries/${info.media_id}/${order + 1}.${type}`,
        type,
        refer: `https://nhentai.net/g/${info.media_id}/${order + 1}/`,
        loaded: 0,
      };
    });

    status = {
      succeed: 0,
      error: 0,
      downloading: 0,
      queue: length,
      total: length,
    };

    queue.init();
    queue.set({
      thread: CONFIG.thread,
      retry: CONFIG.retry,
    });
    queue.list = queue.list.concat(task);
    queue.start((order, _task, _status, callback) => {
      if (_status === 0) {
        status.queue--;
        status.downloading++;
      } else {
        status.error--;
        // status.downloading++;
      }
      updateStatus();
      const bar = $('<li><progress value="0"></progress> <a class="nhD-task-span" name="abort"></a></li>').attr('name', order + 1).appendTo('.nhD-log-box>ol');
      const progress = bar.find('progress');
      const span = bar.find('.nhD-task-span');
      _task.now = new Date().getTime();
      const xhr = GM_xmlhttpRequest({
        method: 'GET',
        url: _task.url,
        responseType: 'arraybuffer',
        timeout: (CONFIG.timeout === 0 ? Infinity : CONFIG.timeout) * 1000,
        headers: {
          Referer: _task.referer,
          'X-Alt-Referer': _task.referer,
        },
        onprogress(res) {
          bar[0].scrollIntoView();
          const now = new Date().getTime();
          const speed = (res.loaded - _task.loaded) / (now - _task.now) / 1.024;
          progress.attr('value', res.loaded).attr('max', res.total);
          span.attr('speed', speed.toFixed(2));
          _task.loaded = res.loaded;
          _task.now = now;
        },
        onload(res) {
          bar[0].scrollIntoView();
          span.attr('name', 'succeed');
          status.downloading--;
          status.succeed++;
          updateStatus();
          callback(order, {
            order: order + 1,
            type: _task.type,
            content: res.response,
          });
        },
        onerror() {
          bar[0].scrollIntoView();
          span.attr('name', 'error');
          status.error++;
          updateStatus();
          callback(order);
        },
        ontimeout() {
          bar[0].scrollIntoView();
          span.attr('name', 'timeout');
          status.error++;
          updateStatus();
          callback(order);
        },
      });
      span.one('click', (e) => {
        if ($(e.target).is('[name="abort"]')) {
          xhr.abort();
          span.attr('name', 'user');
          if (status.downloading > 0) {
            status.downloading--;
            status.error++;
          }
          updateStatus();
          callback(order);
        }
      });
    }, (result) => {
      result.forEach((i) => {
        zip.file(`${preZeroFill(i.order, String(length).length)}.${i.type}`, i.content);
      });
      zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      }).then((content) => {
        $('.nhD-task-pause').remove();
        const url = URL.createObjectURL(content);
        $('<a class="btn btn-primary">Click to download</a>').attr('download', `${$('#info>h1').text()}.cbz`).attr('href', url).appendTo('.nhD-log-box')[0].click();
      });
    }, (order) => {

    });
    console.log(queue);
    $('.nhD-task-pause').on('click', (e) => {
      if ($(e.target).attr('name') === 'continue') {
        $(e.target).removeAttr('name');
        queue.resume();
      } else {
        queue.pause();
        $('.nhD-task-span[name="abort"]').click(); // 待续
        $(e.target).attr('name', 'continue');
      }
    });
  }

  function updateStatus() {
    for (const i in status) {
      if (i === 'total') continue;
      $(`.nhD-task-total[name="${i}"]`).css('width', `${Math.floor(status[i] / status.total * 100)}%`).text(status[i]);
    }
  }

  function generateInfo() {
    const d = new Date(info.upload_date * 1000);
    const language = $('.tag-container:contains("Languages") a:not(.tag-17249)').text().match(/\w+/)[0];
    const tags = $('.tag-container:not(.hidden)').toArray().map((i) => {
      let main = i.childNodes[0].textContent.trim().replace(/ies:$/, 'y:').replace(/s:$/, ':').toLowerCase();
      if (main === 'tag:') main = 'misc:';
      const sub = $(i).find('a').toArray().map((i) => i.childNodes[0].textContent.trim());
      return `> ${main} ${sub.join(', ')}`;
    });
    const arr = [
      $('#info>h1').text(),
      $('#info>h2').text(),
      window.location.href,
      '',
      `Category: ${$('.tag-container:contains("Categories") a').text().match(/\w+/)[0].toUpperCase()}`,
      'Uploader: nhentai',
      `Posted: ${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`,
      `Language: ${language[0].toUpperCase()}${language.slice(1)}`,
      `Length: ${info.num_pages}`,
      `Favorited: ${$('#favorite .count').text()} times`,
      '',
      'Tags:',
      ...tags,
      `Downloaded at ${new Date().toLocaleString()}`,
    ];
    return arr.join('\r\n');
  }

  function preZeroFill(num, size) {
    if (num >= Math.pow(10, size)) { // 如果num本身位数不小于size位
      return num.toString();
    }
    const _str = Array(size + 1).join('0') + num;
    return _str.slice(_str.length - size);
  }
}());
