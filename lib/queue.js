/* eslint-env browser */
(function () {
  const beforeUsed = window.queue;
  var queue = {
    list: [],
    status: [
      // wait, doing, done, failed
    ],
    retry: [],
    result: [],
    config: {
      thread: 10,
      retry: 10, // -1 means try Infinity times
    },
    beforeUsed: window.queue,
    unload: () => {
      window.queue = this.beforeUsed;
    },
    init: () => {
      queue.list = [];
      queue.status = [];
      queue.retry = [];
      queue.result = [];
    },
    set: (key, value = undefined) => {
      if (typeof key === 'string' && typeof value !== undefined) {
        queue.config[key] = value;
      } else if (typeof key === 'object') {
        Object.assign(queue.config, key);
      }
    },
    oneachfailed: null,
    oneachdone: (order, returned = undefined) => {
      console.log(order, returned);
      if (returned === undefined) { // Error
        queue.retry[order] = queue.retry[order] + 1;
        queue.status[order] = 'wait';
        if (queue.config.retry !== -1 && queue.retry[order] > queue.config.retry) queue.status[order] = 'failed';
        if (queue.status[order] === 'failed' && queue.oneachfailed instanceof Function) queue.oneachfailed(order);
      } else {
        queue.status[order] = 'done';
        queue.result[order] = returned;
      }
    },
    pause: () => {
      queue.config.threadBackup = queue.config.thread;
      queue.config.thread = 0;
    },
    resume: () => {
      queue.config.thread = queue.config.threadBackup;
    },
    start: (todo, done, failed = undefined) => {
      if (failed) queue.oneachfailed = failed;

      queue.status = queue.list.map((i) => 'wait');
      queue.retry = queue.list.map((i) => -1);

      let interval;
      interval = setInterval(() => {
        for (let i = 0; i < queue.status.length; i++) {
          if (queue.status[i] !== 'wait') continue;
          if (queue.status.filter((i) => i === 'doing').length >= queue.config.thread) break;
          queue.retry[i] = queue.retry[i] + 1;
          queue.status[i] = 'doing';
          todo(i, queue.list[i], queue.retry[i], queue.oneachdone);
        }
        if (queue.status.every((i) => ['done', 'failed'].includes(i))) {
          clearInterval(interval);
          done(queue.result);
        }
      }, 200);
    },
  };
  window.queue = queue;
}());
