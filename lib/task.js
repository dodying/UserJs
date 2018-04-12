(function() {
  var beforeUsed = window['Task'];
  var Task = function() {
    let _ = this;
    this.config = {
      thread: 10,
      interval: 0.2 * 1000
    };
    this.beforeUsed = beforeUsed;
    this.unload = function() {
      window['Task'] = this.beforeUsed;
    }
    this.init = function() {
      _.list = [];
    }
    this.add = function(...lst) {
      _.list = _.list.concat(...lst);
    }
    this.append = this.add;
    this.prepend = function(...lst) {
      _.list = lst.concat(..._.list);
    }
    this.set = function(key, value) {
      if (key && value) _.config[key] = value;
    }
    this.ondone = function(i, returned) {
      _.doing.splice(_.doing.indexOf(i), 1);
      _.result[_.list.indexOf(i)] = returned;
    }
    this.start = function(func, done) { //done !== this.ondone
      _.doing = [];
      _.newadd = [];
      _.wait = JSON.parse(JSON.stringify(_.list));
      _.result = new Array(_.list.length);

      let interval;
      interval = setInterval(function() {
        for (let i = 0; i < _.wait.length; i++) {
          if ((_.doing.length + _.newadd.length) >= _.config.thread) break;
          _.newadd.push(_.wait[i]);
          _.wait.splice(i, 1);
          i--;
        }
        for (let i = 0; i < _.newadd.length; i++) {
          func(_.newadd[i], _.ondone);
          _.doing.push(_.newadd[i]);
          _.newadd.splice(i, 1);
          i--;
        }
        if (_.wait.length === 0) {
          clearInterval(interval);

          let interval2;
          interval2 = setInterval(function() {
            for (let i = 0; i < _.result.length; i++) {
              if (!_.result[i]) return;
            }
            clearInterval(interval2);
            done(_.result);
          }, _.config.interval);
        }
      }, _.config.interval);
    }
  }
  window['Task'] = Task;
})();
