/* eslint-env browser */
// ==UserScript==
// @name        download
// @version     1.2.7
// @include     *
// ==/UserScript==
// TODO: 支持fetch,xhr
/* global GM_xmlhttpRequest */
(function (window) {
  const storageInit = {
    default: {
      debug: false,
      mode: 'gm_xhr', // one of gm_xhr,fetch,xhr
      retry: 5,
      css: [
        '#gmDownloadDialog{position:fixed;bottom:0;right:0;z-index:999999;background-color:white;border:1px solid black;text-align:center;color:black;overflow-x:hidden;overflow-y:auto;display:none;}',

        '#gmDownloadDialog>.nav-bar>button{width:24px;height:24px;z-index:1000001;padding:0;margin:0;}',
        '#gmDownloadDialog>.nav-bar>[name="pause"]{float:left;}',
        '#gmDownloadDialog>.nav-bar>[name="pause"][value="pause"]::before{content:"⏸️"}',
        '#gmDownloadDialog>.nav-bar>[name="pause"][value="resume"]::before{content:"▶"}',
        '#gmDownloadDialog>.nav-bar>[name="hide"]{float:right;}',
        '#gmDownloadDialog>.nav-bar>[name="hide"]::before{content:"×";color:red;}',
        '#gmDownloadDialog>.nav-bar>[name="total-progress"]{cursor:pointer;width:calc(100% - 65px);margin:4px;}',
        '#gmDownloadDialog>.nav-bar>[name="total-progress"]::before{content:attr(value)" / "attr(max);}',

        '#gmDownloadDialog>.task{overflow-x:hidden;overflow-y:auto;width:300px;height:40vh;}', // display:flex;flex-direction:column;
        '#gmDownloadDialog>.task>div{display:flex;}',
        '#gmDownloadDialog>.task>div>*{margin:0 2px;white-space:nowrap;display:inline-block;}',

        '#gmDownloadDialog>.task>div>a[name="title"]{width:206px;overflow:hidden;text-overflow:ellipsis;text-align:justify;}',
        '#gmDownloadDialog>.task>div>a[name="title"]:empty::before{content:attr(href)}',

        '#gmDownloadDialog>.task>div[status="downloading"]>progress{width:120px;display:inline-block!important;}',
        '#gmDownloadDialog>.task>div[status="downloading"]>progress::before{content:attr(value)" / "attr(max);}',

        '#gmDownloadDialog>.task>div>[name="status"]{width:32px;}',
        '#gmDownloadDialog>.task>div[status="downloading"]>[name="status"]{width:48px;}',
        '#gmDownloadDialog>.task>div[status="downloading"]>[name="status"]::before{content:"下载中";color:#00f;}',
        '#gmDownloadDialog>.task>div[status="error"]>[name="status"]::before{content:"错误";color:#f00;}',
        '#gmDownloadDialog>.task>div[status="timeout"]>[name="status"]::before{content:"超时";color:#f00;}',
        '#gmDownloadDialog>.task>div[status="abort"]>[name="status"]::before{content:"取消";color:#f00;}',
        '#gmDownloadDialog>.task>div[status="load"]>[name="status"]::before{content:"完成";color:#0f0;}',

        '#gmDownloadDialog>.task>div[status="downloading"]>[name="abort"]{width:32px;cursor:pointer;}',
        '#gmDownloadDialog>.task>div[status="downloading"]>[name="abort"]::before{content:"abort";color:#f00;}',
      ].join(''),
      progress: '{order}{title}{progress}{status}{abort}',
      thread: 5,
      onComplete(list) { }, // 当list任务全部完成时(不管是否有下载错误)
      onfailed(res, request) { }, // 当某次请求失败(error/timeout)超过重复次数(之后不再尝试请求)
      onfailedEvery(res, request, type) { }, // 当某次请求失败(error/timeout)
      async checkLoad(res) {}, // 返回布尔，当false时，执行onerror并再次请求

      method: 'GET',
      user: null,
      password: null,
      overrideMimeType: null,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      responseType: 'text',
      timeout: null,
      anonymous: false,
      onabort(res, request) { },
      onerror(res, request) { },
      onload(res, request) { },
      onprogress(res, request) { },
      onreadystatechange(res, request) { },
      ontimeout(res, request) { },
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
    element: {},
    cache: [],
  };

  let storage = { ...JSON.parse(JSON.stringify(storageInit)) };

  const updateProgress = (task, res = {}) => {
    let elem;
    let max = res.lengthComputable ? res.total : 1;
    let value = res.statusText === 'OK' ? max : res.lengthComputable ? res.loaded : 0;
    if (max !== 1 && value !== 0) {
      value = Math.floor(value / max * 100);
      max = 100;
    }
    if (storage.element.dialog.querySelector(`.task>[index="${task.request.index}"]`)) {
      elem = storage.element.dialog.querySelector(`.task>[index="${task.request.index}"]`);
      if (res.lengthComputable) {
        elem.querySelector('progress').setAttribute('value', value);
        elem.querySelector('progress').setAttribute('max', max);
      }
      if (task.request.title) {
        elem.querySelector('[name="title"]').textContent = task.request.title;
      } else if (res.statusText === 'OK' && !elem.querySelector('[name="title"]').textContent) {
        let dom;
        if (typeof res.response === 'string') {
          dom = new window.DOMParser().parseFromString(res.response, 'text/html');
        } else if (res.response instanceof window.Document) {
          dom = res.response;
        }
        if (dom instanceof window.Document) elem.querySelector('[name="title"]').textContent = dom.title;
      }
    } else {
      elem = document.createElement('div');
      elem.setAttribute('index', task.request.index);
      elem.innerHTML = storage.config.progress.replace(/\{(.*?)\}/g, (all, $1) => {
        if ($1 === 'order') {
          return `<span>${task.request.index + 1}</span>`;
        } if ($1 === 'title') {
          const title = task.request.title || '';
          return `<a name="title" href="${task.request.url}" target="_blank">${title}</a>`;
        } if ($1 === 'progress') {
          return `<progress value="${value}" max="${max}" style="display:none;"></progress>`;
        } if ($1 === 'status') {
          return '<span name="status"></span>';
        } if ($1 === 'abort') {
          return '<a name="abort"></a>';
        }
        return '';
      });
      storage.element.dialog.querySelector('.task').appendChild(elem);
    }
    elem.setAttribute('status', task.status);
    elem.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    storage.element.dialog.querySelector('[name="total-progress"]').setAttribute('value', storage.list.filter((i) => i.status && i.status !== 'downloading').length);
  };

  const main = xhr;
  main.sync = xhrSync;
  main.init = (option) => {
    main.stop();
    for (const elem of Object.values(storage.element)) if (elem.parentNode) elem.parentNode.removeChild(elem);
    storage = { ...JSON.parse(JSON.stringify(storageInit)) };
    storage.config = Object.assign(storage.default, option);
    for (const listener of ['onComplete', 'onfailed', 'onfailedEvery', 'checkLoad',
      'onabort', 'onerror', 'onload', 'onprogress', 'onreadystatechange', 'ontimeout']) {
      if (typeof storage.config[listener] !== 'function') storage.config[listener] = function () {};
    }

    const style = document.createElement('style');
    style.id = 'gmDownloadStyle';
    style.textContent = storage.config.css;
    document.head.appendChild(style);
    storage.element.style = style;

    if (document.getElementById('gmDownloadDialog')) document.getElementById('gmDownloadDialog').parentElement.removeChild(document.getElementById('gmDownloadDialog'));
    const dialog = document.createElement('div');
    dialog.id = 'gmDownloadDialog';
    dialog.innerHTML = [
      '<div class="nav-bar">',
      '  <button name="pause" value="pause"></button>',
      '  <progress name="total-progress" value="0" max="1" title="点击清除已完成"></progress>',
      '  <button name="hide"></button>',
      '</div>',
      '<div class="task"></div>',
      '<div class="bottom-bar"></div>',
    ].join('');
    dialog.addEventListener('click', (e) => {
      // TODO
      const name = e.target.getAttribute('name');
      if (name === 'pause') {
        let value = e.target.getAttribute('value');
        if (value === 'pause') {
          main.pause();
          value = 'resume';
        } else {
          main.resume();
          value = 'pause';
        }
        e.target.setAttribute('value', value);
      } else if (name === 'hide') {
        main.hideDialog();
      } else if (name === 'total-progress') {
        for (const i of storage.element.dialog.querySelectorAll('.task>[status="load"]')) {
          i.style.display = 'none';
        }
      } else if (name === 'abort') {
        const index = e.target.parentNode.getAttribute('index') * 1;
        const task = storage.list.find((i) => i.request.index === index);
        if (task && task.abort && typeof task.abort === 'function') task.abort();
      } else {
        // console.log(e.target, name);
      }
    });
    storage.element.dialog = dialog;
  };

  main.list = (urls, option, index = false, start = false) => {
    // urls: string[], option: object
    // urls: object[], option: undefined
    for (const url of urls) {
      const optionThis = { ...option };
      let request = typeof url === 'string' ? { url } : ({ ...url });
      if (!request.url) {
        console.error('user-download: 缺少参数url');
        continue;
      }
      request = Object.assign(optionThis, request);
      request.raw = url;
      request.index = storage.list.length;
      if (typeof index === 'number') {
        storage.list.splice(index, 0, { request });
        index++;
      } else {
        storage.list.push({ request });
      }
    }
    storage.element.dialog.querySelector('[name="total-progress"]').setAttribute('max', storage.list.length);
    if (start && !storage.downloading) main.start();
  };
  main.add = (url, option, index, start) => main.list([url], option, index, start);
  main.start = () => {
    const startTask = (task) => {
      task.status = 'downloading';
      updateProgress(task);

      const request = { ...task.request };
      const tryCallFailed = (res, type) => {
        delete task.abort;
        if (!navigator.onLine) {
          main.pause();
          storage.element.dialog.querySelector('.nav-bar>[name="pause"]').value = 'resume';
        }
        task.retry = typeof task.retry === 'number' && !isNaN(task.retry) ? task.retry + 1 : 1;

        if (typeof task.request.onfailedEvery === 'function') {
          task.request.onfailedEvery(res, task.request, type);
        } else if (typeof storage.config.onfailedEvery === 'function') {
          storage.config.onfailedEvery(res, task.request, type);
        }
        if (task.retry >= storage.config.retry) {
          if (typeof task.request.onfailed === 'function') {
            task.request.onfailed(res, task.request);
          } else if (typeof storage.config.onfailed === 'function') {
            storage.config.onfailed(res, task.request);
          }
        }
      };
      request.onabort = (res) => {
        task.status = 'abort';
        if (typeof task.request.onabort === 'function') {
          task.request.onabort(res, task.request);
        } else if (typeof storage.config.onabort === 'function') {
          storage.config.onabort(res, task.request);
        }
        tryCallFailed(res, 'abort');
        updateProgress(task, res);
      };
      request.onerror = (res) => {
        task.status = 'error';
        if (typeof task.request.onerror === 'function') {
          task.request.onerror(res, task.request);
        } else if (typeof storage.config.onerror === 'function') {
          storage.config.onerror(res, task.request);
        }
        tryCallFailed(res, 'error');
        updateProgress(task, res);
      };
      request.onload = async (res) => {
        let success;
        if (typeof task.request.checkLoad === 'function') {
          success = await task.request.checkLoad(res);
        } else if (typeof storage.config.checkLoad === 'function') {
          success = await storage.config.checkLoad(res);
        }
        if (success === false) {
          request.onerror(res);
          return;
        }

        task.status = 'load';
        task.response = res;
        delete task.abort;
        delete task.retry;
        const resNew = { ...res }; // FIX Violentmonkey
        for (const i of ['response', 'responseText', 'responseXML']) { // FIX Tamermonkey
          try {
            resNew[i] = Object.getOwnPropertyDescriptor(res, i).value || Object.getOwnPropertyDescriptor(res, i).get();
          } catch (error) {
            console.log(error);
          }
        }
        res = resNew;
        if (!request.responseType || request.responseType === 'text') {
          res.response = res.responseText = res.responseText || res.response;
        } else if (request.responseType === 'document') {
          res.response = res.responseXML = res.responseXML || res.response;
        } else if (request.responseType === 'json') {
          try {
            res.response = res.json;
          } catch (error) {}
        }
        if (typeof task.request.onload === 'function') {
          task.request.onload(res, task.request);
        } else if (typeof storage.config.onload === 'function') {
          storage.config.onload(res, task.request);
        }
        updateProgress(task, res);
      };
      request.onprogress = (res) => {
        if (typeof task.request.onprogress === 'function') {
          task.request.onprogress(res, task.request);
        } else if (typeof storage.config.onprogress === 'function') {
          storage.config.onprogress(res, task.request);
        }
        updateProgress(task, res);
      };
      request.onreadystatechange = (res) => {
        if (typeof task.request.onreadystatechange === 'function') {
          task.request.onreadystatechange(res, task.request);
        } else if (typeof storage.config.onreadystatechange === 'function') {
          storage.config.onreadystatechange(res, task.request);
        }
        updateProgress(task, res);
      };
      request.ontimeout = (res) => {
        task.status = 'timeout';
        if (typeof task.request.ontimeout === 'function') {
          task.request.ontimeout(res, task.request);
        } else if (typeof storage.config.ontimeout === 'function') {
          storage.config.ontimeout(res, task.request);
        }
        tryCallFailed(res, 'timeout');
        updateProgress(task, res);
      };
      task.abort = xhr(request).abort;
    };
    const checkDownload = () => {
      if (storage.pause) {
        storage.downloading = false;
        return;
      }
      while (storage.list.filter((i) => i.status === 'downloading').length < storage.config.thread && storage.list.findIndex((i) => i.status === undefined) >= 0) {
        startTask(storage.list.find((i) => i.status === undefined));
      }
      if (storage.list.findIndex((i) => i.status === undefined) === -1) {
        while (storage.list.filter((i) => i.status === 'downloading').length < storage.config.thread && storage.list.findIndex((i) => (i.retry || 0) < storage.config.retry && !(['downloading', 'load'].includes(i.status))) >= 0) {
          startTask(storage.list.find((i) => (i.retry || 0) < storage.config.retry && !(['downloading', 'load'].includes(i.status))));
        }
        if (storage.list.findIndex((i) => i.status !== 'load' && (i.retry || 0) < storage.config.retry) === -1) {
          storage.config.onComplete(storage.list);
          storage.downloading = false;
        } else {
          setTimeout(checkDownload, 200);
        }
      } else {
        setTimeout(checkDownload, 200);
      }
    };
    storage.downloading = true;
    checkDownload();

    if (!document.getElementById('gmDownloadDialog')) document.body.appendChild(storage.element.dialog);
  };
  main.stop = () => {
    storage.pause = true;
    for (let i = 0; i < storage.list.length; i++) {
      storage.list.retry = Infinity;
      if (storage.list.abort) storage.list.abort();
    }
    storage.list = [];
    storage.pause = false;
  };

  main.pause = () => {
    storage.pause = true;
    for (const i of storage.list.filter((i) => 'abort' in i)) i.abort();
  };
  main.resume = () => {
    storage.pause = false;
    if (!storage.downloading) main.start();
  };
  main.retry = () => {
    for (const i of storage.list.filter((i) => 'retry' in i)) storage.list[storage.list.indexOf(i)].retry = 0;
    if (!storage.downloading) main.start();
  };
  main.showDialog = () => {
    storage.element.dialog.style.display = 'block';
  };
  main.hideDialog = () => {
    storage.element.dialog.style.display = 'none';
  };
  main.emptyDialog = () => {
    storage.element.dialog.querySelectorAll('.task').innerHTML = '';
  };
  main.console = () => console.log(storage);
  main.storage = {
    get: (name, value) => (name in storage ? storage[name] : value),
    set: (name, value) => (storage[name] = value),
    config: {
      get: (name, value) => (name in storage.config ? storage.config[name] : value),
      set: (name, value) => (storage.config[name] = value),
    },
    getSelf: () => storage,
  };

  function xhr(url, onload, data = null, opt = {}) {
    if (storage.config.debug) console.log({ url, data });
    if (typeof url === 'object') {
      opt = url;
      url = opt.url;
      data = opt.data;
    }
    opt.onload = onload || opt.onload;
    if (opt.cache) {
      const str = JSON.stringify({ url, data, opt });
      const find = storage.cache.find((i) => i[0] === str);
      if (find) return find[1];
    }
    if ((storage.config.mode === 'gm_xhr' || !['gm_xhr', 'fetch', 'xhr'].includes(storage.config.mode)) && typeof GM_xmlhttpRequest === 'function') { // eslint-disable-line camelcase
      return GM_xmlhttpRequest({
        url,
        data,

        method: opt.method || (data ? 'POST' : storage.config.method || 'GET'),
        user: opt.user || storage.config.user,
        password: opt.password || storage.config.password,
        overrideMimeType: opt.overrideMimeType || storage.config.overrideMimeType || `text/html; charset=${document.characterSet}`,
        headers: opt.headers || storage.config.headers,
        responseType: ['text', 'json', 'blob', 'arraybuffer', 'document'].includes(opt.responseType) ? opt.responseType : storage.config.responseType,
        timeout: opt.timeout || storage.config.timeout,
        anonymous: opt.anonymous || storage.config.anonymous,
        onabort(res) {
          (opt.onabort || storage.config.onabort)(res);
        },
        onerror(res) {
          (opt.onerror || storage.config.onerror)(res);
        },
        onload(res) {
          if (opt.cache) {
            const str = JSON.stringify({ url, data, opt });
            storage.cache.push([str, res]);
          }
          (opt.onload || storage.config.onload)(res);
        },
        onprogress(res) {
          (opt.onprogress || storage.config.onprogress)(res);
        },
        onreadystatechange(res) {
          (opt.onreadystatechange || storage.config.onreadystatechange)(res);
        },
        ontimeout(res) {
          (opt.ontimeout || storage.config.ontimeout)(res);
        },
      });
    }
    if ((storage.config.mode === 'fetch' || !['gm_xhr', 'fetch', 'xhr'].includes(storage.config.mode)) && typeof window.fetch === 'function') { // TODO
      // https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/fetch
      const controller = new window.AbortController();
      const { signal } = controller;
      window.fetch(url, {
        body: data,

        method: opt.method || (data ? 'POST' : storage.config.method || 'GET'),
        // user: opt.user || storage.config.user,
        // password: opt.password || storage.config.password,
        // overrideMimeType: opt.overrideMimeType || storage.config.overrideMimeType || `text/html; charset=${document.characterSet}`,
        // headers: opt.headers || storage.config.headers,
        // responseType: ['text', 'json', 'blob', 'arraybuffer', 'document'].includes(opt.responseType) ? opt.responseType : storage.config.responseType,
        // timeout: opt.timeout || storage.config.timeout,
        // anonymous: opt.anonymous || storage.config.anonymous,

        signal,
      }).then((res) => {
        if (opt.cache) {
          const str = JSON.stringify({ url, data, opt });
          storage.cache.push([str, res]);
        }
        (opt.onload || storage.config.onload)(res);
      }).catch((res) => {
        (opt.onerror || storage.config.onerror)(res);
      });
      return controller;
    }
    if ((storage.config.mode === 'xhr' || !['gm_xhr', 'fetch', 'xhr'].includes(storage.config.mode)) && typeof window.fetch === 'function') { // TODO
      // https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
    }
  }
  function xhrSync(url, data = null, opt = {}) {
    return new Promise((resolve, reject) => {
      const optRaw = { ...opt };
      opt.onload = (res) => {
        (optRaw.onload || storage.config.onload)(res);
        resolve(res);
      };
      for (const event of ['onload', 'onabort', 'onerror', 'ontimeout']) {
        opt[event] = (res) => {
          (optRaw[event] && typeof optRaw[event] === 'function' ? optRaw[event] : storage.config[event])(res);
          if (['onload'].includes(event)) {
            resolve(res);
          } else {
            reject(res);
          }
        };
      }
      xhr(url, opt.onload, data, opt);
    });
  }

  window.xhr = main;
  main.init();
}(typeof window !== 'undefined' ? window : document));
