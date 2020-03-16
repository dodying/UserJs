// ==UserScript==
// @name        download
// @grant       GM_xmlhttpRequest
// @version     1.0.1
// ==/UserScript==

(function (window) {
  let storage = {
    default: {
      debug: false,
      retry: 5,
      css: [
        '#gmDownloadDialog{position:fixed;bottom:0;right:0;z-index:999999;background-color:white;border:1px solid black;text-align:center;color:black;overflow-x:hidden;overflow-y:auto;display:none;}',

        '#gmDownloadDialog>[name="hide"]{z-index:1000001;float:right;padding:3px 8px;position:relative;left:1px;top:-1px;border-left:none;border-bottom:none;}',

        '#gmDownloadDialog>[name="total-progress"]{cursor:pointer;width:calc(100% - 50px);margin:4px;}',
        '#gmDownloadDialog>[name="total-progress"]::before{content:attr(value)" / "attr(max);}',

        '#gmDownloadDialog>.task{display:flex;flex-direction:column;}',
        '#gmDownloadDialog>.task>div{display:flex;}',
        '#gmDownloadDialog>.task>div>*{margin:0 2px;white-space:nowrap;display:inline-block;overflow:hidden;text-overflow:ellipsis;}',

        '#gmDownloadDialog>.task>div>a[name="title"]{width:206px;}',

        '#gmDownloadDialog>.task>div[status="downloading"]>progress{width:120px;display:inline-block!important;}',
        '#gmDownloadDialog>.task>div[status="downloading"]>progress::before{content:attr(value)" / "attr(max);}',

        '#gmDownloadDialog>.task>div>[name="status"]{width:32px;}',
        '#gmDownloadDialog>.task>div[status="downloading"]>[name="status"]{width:48px;}',
        '#gmDownloadDialog>.task>div[status="downloading"]>[name="status"]::before{content:"下载中";color:#00f;}',
        '#gmDownloadDialog>.task>div[status="error"]>[name="status"]::before{content:"错误";color:#f00;}',
        '#gmDownloadDialog>.task>div[status="timeout"]>[name="status"]::before{content:"超时";color:#f00;}',
        '#gmDownloadDialog>.task>div[status="abort"]>[name="status"]::before{content:"取消";color:#f00;}',
        '#gmDownloadDialog>.task>div[status="load"]>[name="status"]::before{content:"完成";color:#0f0;}',

        '#gmDownloadDialog>.task>div[status="downloading"]>[name="abort"]{width:32px;}',
        '#gmDownloadDialog>.task>div[status="downloading"]>[name="abort"]::before{content:"abort";color:#f00;}'
      ].join(''),
      progress: '{order}{title}{progress}{status}{abort}',
      thread: 5,
      onComplete () { // 当list任务全部完成时(不管是否有下载错误)

      },

      method: 'GET',
      user: null,
      password: null,
      overrideMimeType: null,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      responseType: null,
      timeout: null,
      anonymous: false,
      onabort () {},
      onerror (res) {},
      onload (res) {},
      onprogress (res) {},
      onreadystatechange (res) {},
      ontimeout (res) {}
    },
    list: [
    // request 请求信息
    // status 状态 undefined,downloading,error,timeout,abort,load
    // retry 重复请求次数
    // abort 终止请求
    // response
    ],
    pause: false,
    downloading: false,
    element: {}
  };

  const updateProgress = (index, res = {}) => {
    let elem;
    let max = res.lengthComputable ? res.total : 1;
    let value = res.statusText === 'OK' ? max : res.lengthComputable ? res.loaded : 0;
    if (max !== 1 && value !== 0) {
      value = Math.floor(value / max * 100);
      max = 100;
    }
    if (storage.element.dialog.querySelector(`.task>[index="${index}"]`)) {
      elem = storage.element.dialog.querySelector(`.task>[index="${index}"]`);
      if (res.lengthComputable) {
        elem.querySelector('progress').setAttribute('value', value);
        elem.querySelector('progress').setAttribute('max', max);
      }
    } else {
      elem = document.createElement('div');
      elem.setAttribute('index', index);
      elem.innerHTML = storage.config.progress.replace(/\{(.*?)\}/g, (all, $1) => {
        if ($1 === 'order') {
          return `<span>${index + 1}</span>`;
        } else if ($1 === 'title') {
          const title = storage.list[index].title || storage.list[index].request.url;
          return `<a name="title" href="${storage.list[index].request.url}" target="_blank">${title}</a>`;
        } else if ($1 === 'progress') {
          return `<progress value="${value}" max="${max}" style="display:none;"></progress>`;
        } else if ($1 === 'status') {
          return '<span name="status"></span>';
        } else if ($1 === 'abort') {
          return '<a name="abort"></a>';
        } else {
          return '';
        }
      });
    }
    elem.setAttribute('status', storage.list[index].status);
    storage.element.dialog.querySelector('.task').appendChild(elem);
    storage.element.dialog.querySelector('[name="total-progress"]').setAttribute('value', storage.list.filter(i => i.status && i.status !== 'downloading').length);
  };

  const main = xhr;
  main.sync = xhrSync;
  main.init = (option) => {
    storage.config = Object.assign(storage.default, option);

    if (!storage.element.style) {
      const style = document.createElement('style');
      style.id = 'gmDownloadStyle';
      style.textContent = storage.config.css;
      document.head.appendChild(style);
      storage.element.style = style;
    }

    if (!storage.element.dialog) {
      const dialog = document.createElement('div');
      dialog.id = 'gmDownloadDialog';
      dialog.innerHTML = [
        '<button name="hide">×</button>',
        '<progress name="total-progress" value="0" max="1" title="点击清除已完成"></progress>',
        '<div class="task"></div>',
        '<div class="button-bar"></div>'
      ].join('');
      dialog.addEventListener('click', (e) => {
        // TODO
        const name = e.target.getAttribute('name');
        // console.log(e.target, name);
        if (name === 'hide') {
          main.hideDialog();
        } else if (name === 'total-progress') {
          for (const i of storage.element.dialog.querySelectorAll('.task>[status="load"]')) {
            i.style.display = 'none';
          }
        } else if (name === 'abort') {
          const index = e.target.parentNode.getAttribute('index');
          if (storage.list[index].abort && typeof storage.list[index].abort === 'function') storage.list[index].abort();
        }
      });
      document.body.appendChild(dialog);
      storage.element.dialog = dialog;
    }
  };

  main.list = (urls, option) => {
  // urls: string[], option: object
  // urls: object[], option: undefined
    for (const url of urls) {
      let request = typeof url === 'string' ? { url: url } : url;
      request = Object.assign(request, option || {});
      storage.list.push({ request });
    }
  };
  main.start = () => {
    const startTask = (index) => {
      storage.list[index].status = 'downloading';
      updateProgress(index);

      const request = storage.list[index].request;
      request.onabort = (res) => {
        storage.list[index].status = 'abort';
        delete storage.list[index].abort;
        storage.list[index].retry = 'retry' in storage.list[index] ? storage.list[index].retry + 1 : 1;
        if (typeof storage.config.onabort === 'function') storage.config.onabort(res);
        updateProgress(index, res);
      };
      request.onerror = (res) => {
        storage.list[index].status = 'error';
        delete storage.list[index].abort;
        storage.list[index].retry = 'retry' in storage.list[index] ? storage.list[index].retry + 1 : 1;
        if (typeof storage.config.onerror === 'function') storage.config.onerror(res);
        updateProgress(index, res);
      };
      request.onload = (res) => {
        storage.list[index].status = 'load';
        storage.list[index].response = res;
        delete storage.list[index].abort;
        delete storage.list[index].retry;
        if (typeof storage.config.onload === 'function') storage.config.onload(res);
        updateProgress(index, res);
      };
      request.onprogress = (res) => {
        if (typeof storage.config.onprogress === 'function') storage.config.onprogress(res);
        updateProgress(index, res);
      };
      request.onreadystatechange = (res) => {
        if (typeof storage.config.onreadystatechange === 'function') storage.config.onreadystatechange(res);
        updateProgress(index, res);
      };
      request.ontimeout = (res) => {
        storage.list[index].status = 'timeout';
        delete storage.list[index].abort;
        storage.list[index].retry = 'retry' in storage.list[index] ? storage.list[index].retry + 1 : 1;
        if (typeof storage.config.ontimeout === 'function') storage.config.ontimeout(res);
        updateProgress(index, res);
      };
      storage.list[index].abort = xhr(request).abort;
    };
    const checkDownload = () => {
      if (storage.pause) {
        storage.downloading = false;
        return;
      }
      while (storage.list.filter(i => i.status === 'downloading').length < storage.config.thread && storage.list.findIndex(i => i.status === undefined) >= 0) {
        const index = storage.list.findIndex(i => i.status === undefined);
        startTask(index);
      }
      if (storage.list.findIndex(i => i.status === undefined) === -1) {
        while (storage.list.filter(i => i.status === 'downloading').length < storage.config.thread && storage.list.findIndex(i => i.retry < storage.config.retry && !(['downloading', 'load'].includes(i.status))) >= 0) {
          const index = storage.list.findIndex(i => i.retry < storage.config.retry && !(['downloading', 'load'].includes(i.status)));
          startTask(index);
        }
        if (storage.list.findIndex(i => i.status !== 'load' && (i.retry || 0) < storage.config.retry) === -1) {
          storage.config.onComplete(storage.list);
          storage.downloading = false;
        } else {
          setTimeout(checkDownload, 200);
        }
      } else {
        setTimeout(checkDownload, 200);
      }
    };
    checkDownload();
    storage.downloading = true;
    storage.element.dialog.querySelector('[name="total-progress"]').setAttribute('max', storage.list.length);
  };
  main.stop = () => {
    for (const i of storage.list.filter(i => 'abort' in i)) i.abort();
    storage.list = [];
  };

  main.pause = () => {
    storage.pause = true;
    for (const i of storage.list.filter(i => 'abort' in i)) i.abort();
  };
  main.resume = () => {
    storage.pause = false;
    if (!storage.downloading) main.start();
  };
  main.retry = () => {
    for (const i of storage.list.filter(i => 'retry' in i)) storage.list[storage.list.indexOf(i)].retry = 0;
    if (!storage.downloading) main.start();
  };
  main.showDialog = () => {
    storage.element.dialog.style.display = 'block';
  };
  main.hideDialog = () => {
    storage.element.dialog.style.display = 'none';
  };
  main.console = () => console.log(storage);
  main.storage = {
    get: () => storage,
    set: (obj) => {
      storage = obj;
    },
    config: {
      get: () => storage.config,
      set: (obj) => {
        storage.config = obj;
      }
    }
  };

  function xhr (url, onload, parm = null, opt = {}) {
    if (storage.config.debug) console.log({ url, parm });
    if (typeof url === 'object') {
      opt = url;
      url = opt.url;
      onload = opt.onload;
      parm = opt.parm;
    }
    return GM_xmlhttpRequest({
      url: url,
      data: parm,

      method: parm ? 'POST' : storage.config.method,
      user: opt.user || storage.config.user,
      password: opt.password || storage.config.password,
      overrideMimeType: opt.overrideMimeType || storage.config.overrideMimeType,
      headers: opt.headers || storage.config.headers,
      responseType: ['text', 'json', 'blob', 'arraybuffer', 'document'].includes(opt.responseType) ? opt.responseType : storage.config.responseType,
      timeout: opt.timeout || storage.config.timeout,
      anonymous: opt.anonymous || storage.config.anonymous,
      onabort (res) {
        (opt.onabort || storage.config.onabort)(res);
      },
      onerror (res) {
        (opt.onerror || storage.config.onerror)(res);
      },
      onload (res) {
        (opt.onload || storage.config.onload)(res);
      },
      onprogress (res) {
        (opt.onprogress || storage.config.onprogress)(res);
      },
      onreadystatechange (res) {
        (opt.onreadystatechange || storage.config.onreadystatechange)(res);
      },
      ontimeout (res) {
        (opt.ontimeout || storage.config.ontimeout)(res);
      }
    });
  }

  function xhrSync (url, parm = null, opt = {}) {
    if (storage.config.debug) console.log({ url, parm });
    if (typeof url === 'object') {
      opt = url;
      url = opt.url;
      parm = opt.parm;
    }
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        data: parm,

        method: parm ? 'POST' : storage.config.method,
        user: opt.user || storage.config.user,
        password: opt.password || storage.config.password,
        overrideMimeType: opt.overrideMimeType || storage.config.overrideMimeType,
        headers: opt.headers || storage.config.headers,
        responseType: ['text', 'json', 'blob', 'arraybuffer', 'document'].includes(opt.responseType) ? opt.responseType : storage.config.responseType,
        timeout: opt.timeout || storage.config.timeout,
        anonymous: opt.anonymous || storage.config.anonymous,
        onabort (res) {
          (opt.onabort || storage.config.onabort)(res);
          reject(res);
        },
        onerror (res) {
          (opt.onerror || storage.config.onerror)(res);
          reject(res);
        },
        onload (res) {
          (opt.onload || storage.config.onload)(res);
          resolve(res);
        },
        onprogress (res) {
          (opt.onprogress || storage.config.onprogress)(res);
        },
        onreadystatechange (res) {
          (opt.onreadystatechange || storage.config.onreadystatechange)(res);
        },
        ontimeout (res) {
          (opt.ontimeout || storage.config.ontimeout)(res);
          reject(res);
        }
      });
    });
  }

  window.xhr = main;
  main.init();
})(typeof window !== 'undefined' ? window : document);
