function Common() {
  var a = function (m) {
    return document.getElementById(m)
  };
  this.goto_arena = function () {
    l('?s=Battle&ss=ar')
  };
  this.goto_ring = function () {
    l('?s=Battle&ss=rb')
  };
  this.goto_grindfest = function () {
    l('?s=Battle&ss=gr')
  };
  this.goto_crysfest = function () {
    l('?s=Battle&ss=cf')
  };
  this.goto_itemworld = function () {
    l('?s=Battle&ss=iw')
  };
  var l = function (m) {
    var n = MAIN_URL + m;
    if (document.location == n) {
      a('form_reload').submit()
    } else {
      document.location = n
    }
  };
  this.findPos = function (n) {
    var o = 0;
    var m = 0;
    if (n.offsetParent) {
      do {
        o += n.offsetLeft;
        m += n.offsetTop
      } while (n = n.offsetParent)
    }
    return [o,
    m]
  };
  this.findPosWithScroll = function (n) {
    var o = 0;
    var m = 0;
    if (n.offsetParent) {
      do {
        o += n.offsetLeft + (n.scrollLeft ? n.scrollLeft : 0);
        m += n.offsetTop + (n.scrollTop ? n.scrollTop : 0)
      } while (n = n.offsetParent)
    }
    return [o,
    m]
  };
  this.findScrollOffset = function (n) {
    var o = 0;
    var m = 0;
    if (n.offsetParent) {
      do {
        o += n.scrollLeft ? n.scrollLeft : 0;
        m += n.scrollTop ? n.scrollTop : 0
      } while (n = n.offsetParent)
    }
    return [o,
    m]
  };
  this.getCursorPosition = function (n) {
    n = n || window.event;
    var o = {
      x: 0,
      y: 0
    };
    if (n.pageX || n.pageY) {
      o.x = n.pageX;
      o.y = n.pageY
    } else {
      var q = document.documentElement;
      var m = document.body;
      o.x = n.clientX + (q.scrollLeft || m.scrollLeft) - (q.clientLeft || 0);
      o.y = n.clientY + (q.scrollTop || m.scrollTop) - (q.clientTop || 0)
    }
    return o
  };
  this.decimalround = function (n, o) {
    var m = Math.round(n * Math.pow(10, o)) / Math.pow(10, o);
    return m
  };
  this.show_popup_box = function (A, u, B, w, q, C, z, v, m, s) {
    var n = a('popup_box');
    var y = [
      0,
      0
    ];
    var o = [
      0,
      0
    ];
    var t = 0;
    if (A != undefined) {
      t = A.offsetWidth;
      y = common.findPosWithScroll(A);
      if (s != '') {
        var r = a(s);
        o[0] = r.scrollLeft;
        o[1] = r.scrollTop
      }
    } else {
    }
    n.style.left = (u == 'right' ? y[0] - o[0] + t + B : y[0] - o[0] - B - q) + 'px';
    n.style.top = (y[1] - o[1] + w) + 'px';
    n.style.width = q + 'px';
    n.style.height = C + 'px';
    n.innerHTML = '<div class="eqt">' + z + '</div><div class="eqc">' + v + '</div><div class="eqb">' + m + '</div>';
    n.style.visibility = 'visible'
  };
  this.hide_popup_box = function () {
    a('popup_box').style.visibility = 'hidden'
  };
  var h = undefined;
  var d = 0;
  var j = 0;
  var e = 0;
  var b = function () {
    var m = h.scrollTop;
    h.scrollTop = d > 0 ? Math.min(h.scrollTop + e, j)  : Math.max(h.scrollTop - e, j);
    if (m != h.scrollTop) {
      setTimeout(b, 1)
    } else {
      h = undefined;
      d = 0;
      j = 0
    }
  };
  this.scrollpane_up = function (o, n, m) {
    if (h == undefined) {
      h = a(o);
      d = - 1;
      j = Math.max(0, h.scrollTop - n);
      e = m != undefined ? 1000 : 25;
      b()
    }
  };
  this.scrollpane_down = function (o, n, m) {
    if (h == undefined) {
      h = a(o);
      d = 1;
      j = h.scrollTop + n;
      e = m != undefined ? 1000 : 25;
      b()
    }
  };
  this.hookEvent = function (n, m, o) {
    if (typeof (n) == 'string') {
      n = document.getElementById(n)
    }
    if (n == null) {
      return
    }
    if (n.addEventListener) {
      if (m == 'mousewheel') {
        n.addEventListener('DOMMouseScroll', o, false)
      }
      n.addEventListener(m, o, false)
    } else {
      if (n.attachEvent) {
        n.attachEvent('on' + m, o)
      }
    }
  };
  this.unhookEvent = function (n, m, o) {
    if (typeof (n) == 'string') {
      n = document.getElementById(n)
    }
    if (n == null) {
      return
    }
    if (n.removeEventListener) {
      if (m == 'mousewheel') {
        n.removeEventListener('DOMMouseScroll', o, false)
      }
      n.removeEventListener(m, o, false)
    } else {
      if (n.detachEvent) {
        n.detachEvent('on' + m, o)
      }
    }
  };
  this.cancelEvent = function (m) {
    m = m ? m : window.event;
    if (m.stopPropagation) {
      m.stopPropagation()
    }
    if (m.preventDefault) {
      m.preventDefault()
    }
    m.cancelBubble = true;
    m.cancel = true;
    m.returnValue = false;
    return false
  };
  this.number_format = function (n) {
    n += '';
    x = n.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var m = /(\d+)(\d{3})/;
    while (m.test(x1)) {
      x1 = x1.replace(m, '$1,$2')
    }
    return x1 + x2
  };
  var k = [
    9,
    5,
    10,
    10,
    10,
    10,
    10,
    10,
    9,
    9,
    4,
    4,
    5,
    10,
    11,
    8,
    8,
    8,
    11,
    11,
    4,
    4,
    4
  ];
  this.get_dynamic_digit_string = function (n) {
    var r = this.number_format(n);
    var m = '';
    var q = 0;
    for (var o = r.length - 1; o >= 0; o--) {
      var s = 0;
      if (r.charAt(o) == ',') {
        s = 11
      } else {
        if (r.charAt(o) == '.') {
          s = 10
        } else {
          if (r.charAt(o) == '+') {
            s = 15
          } else {
            if (r.charAt(o) == ':') {
              s = 22
            } else {
              if (r.charAt(o) == '-') {
                s = 16
              } else {
                s = parseInt(r.charAt(o))
              }
            }
          }
        }
      }
      m = m + '<div style="float:right; margin:0; padding:0; height:12px; width:' + (k[s] + 1) + 'px; background:transparent url(' + IMG_URL + 'font/12b.png) 0px -' + (s * 12) + 'px"></div>';
      q += k[s]
    }
    return '<div style="position:relative; display:inline; height:12px; width:' + q + 'px">' + m + '</div>'
  };
  function f(m, u, v) {
    var q = m.getElementsByTagName('DIV');
    var s = new Array('f2l' + u, 'f2r' + u, 'f4l' + u, 'f4r' + u);
    var t = new Array('f2l' + v, 'f2r' + v, 'f4l' + v, 'f4r' + v);
    var n = v == 'a' ? '#0030CB' : '#5C0D11';
    for (var r = 0; r < q.length; r++) {
      for (var o = 0; o < s.length; o++) {
        q[r].className = q[r].className.replace(s[o], t[o]);
        q[r].style.color = n
      }
    }
  }
  var g = undefined;
  this.set_text_selected = function (n) {
    var m = true;
    if (g != undefined) {
      if (g == n) {
        m = false
      }
      this.set_text_unselected()
    }
    if (m) {
      f(n, 'b', 'a');
      g = n
    }
  };
  this.set_text_unselected = function () {
    if (g != undefined) {
      f(g, 'a', 'b');
      g = undefined
    }
  };
  function i(q, n) {
    for (var r = [
    ]; n > 0; r[--n] = q) {
    }
    return (r.join(''))
  }
  this.sprintf = function () {
    var s = 0,
    r,
    t = arguments[s++],
    v = [
    ],
    q,
    u,
    w,
    n;
    while (t) {
      if (q = /^[^\x25]+/.exec(t)) {
        v.push(q[0])
      } else {
        if (q = /^\x25{2}/.exec(t)) {
          v.push('%')
        } else {
          if (q = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(t)) {
            if (((r = arguments[q[1] || s++]) == null) || (r == undefined)) {
              throw ('Too few arguments.')
            }
            if (/[^s]/.test(q[7]) && (typeof (r) != 'number')) {
              throw ('Expecting number but found ' + typeof (r))
            }
            switch (q[7]) {
              case 'b':
                r = r.toString(2);
                break;
              case 'c':
                r = String.fromCharCode(r);
                break;
              case 'd':
                r = parseInt(r);
                break;
              case 'e':
                r = q[6] ? r.toExponential(q[6])  : r.toExponential();
                break;
              case 'f':
                r = q[6] ? parseFloat(r).toFixed(q[6])  : parseFloat(r);
                break;
              case 'o':
                r = r.toString(8);
                break;
              case 's':
                r = ((r = String(r)) && q[6] ? r.substring(0, q[6])  : r);
                break;
              case 'u':
                r = Math.abs(r);
                break;
              case 'x':
                r = r.toString(16);
                break;
              case 'X':
                r = r.toString(16).toUpperCase();
                break
            }
            r = (/[def]/.test(q[7]) && q[2] && r > 0 ? '+' + r : r);
            w = q[3] ? q[3] == '0' ? '0' : q[3].charAt(1)  : ' ';
            n = q[5] - String(r).length;
            u = q[5] ? i(w, n)  : '';
            v.push(q[4] ? r + u : u + r)
          } else {
            throw ('Huh ?!')
          }
        }
      }
      t = t.substring(q[0].length)
    }
    return v.join('')
  };
  this.hv_debug = function (n) {
    var m = a('debugpane');
    if (m != undefined) {
      m.innerHTML = n + '<br />' + m.innerHTML
    }
  }
}
var common = new Common();
function RPCSession() {
  var e = undefined;
  var d = undefined;
  try {
    e = new XMLHttpRequest()
  } catch (b) {
    try {
      e = new ActiveXObject('Msxml2.XMLHTTP')
    } catch (f) {
      try {
        e = new ActiveXObject('Microsoft.XMLHTTP')
      } catch (a) {
        e = false
      }
    }
  }
  this.dispatch_request = function (g, h) {
    if (this.url != undefined) {
      alert('Session already in use')
    } else {
      this.url = g;
      e.open('GET', this.url, true);
      e.onreadystatechange = function (i) {
        if (i.readyState == 4) {
          if (i.status == 200) {
            if (h != undefined) {
              h(i.responseText)
            }
            this.url = undefined
          } else {
            alert('Server communication failed. Server responded with: ' + i.responseText)
          }
        }
      };
      common.hv_debug('dispatch_request ' + g);
      e.send(null)
    }
  }
}
function get_rpcsession() {
  return new RPCSession()
}
function Itembot() {
  function a(b) {
    return document.getElementById(b)
  }
  this.set_selected_item = function (d) {
    var e = a('bot_item');
    for (var b = 0; b < e.options.length; b++) {
      if (e.options[b].value == d) {
        e.selectedIndex = b;
        e.onchange();
        break
      }
    }
  };
  this.update_bidstats = function () {
    var b = a('bot_item').selectedIndex;
    a('bot_maxcount').value = curcount[b];
    a('bot_maxprice').value = curbid[b];
    a('minprice').innerHTML = common.get_dynamic_digit_string(minprice[b]);
    a('highbid').innerHTML = common.get_dynamic_digit_string(highbid[b]);
    common.set_text_unselected()
  };
  this.modify_task = function () {
    a('itembotform').submit()
  }
}
function init_itembot() {
  return new Itembot()
}
function Shops() {
  function b(n) {
    return document.getElementById(n)
  }
  var j = undefined;
  var d = 0;
  var f = 0;
  var i = undefined;
  var e = 0;
  var a = 0;
  var g = false;
  this.unset_selected_item = function () {
    common.hv_debug('unset_selected_item');
    this.set_selected_item(undefined, 0, 0, 0, undefined)
  };
  this.set_selected_item = function (s, q, n, r, o) {
    common.hv_debug('set_selected_item = ' + s + ' ' + q + ' ' + r + ' ' + n);
    if ((q == d) && (s == j) && (q != 0)) {
      this.unset_selected_item();
      return
    }
    j = s;
    d = q;
    f = Math.min(1, n);
    e = r;
    a = n;
    i = o;
    k()
  };
  this.set_selected_count = function (n) {
    common.hv_debug('set_selected_count = ' + n);
    if (d > 0) {
      f = Math.max(0, Math.min(f + n, a))
    }
    k()
  };
  var h = b('count_field');
  var m = b('cost_field');
  var l = b('sum_field');
  function k() {
    if (h != undefined) {
      h.innerHTML = common.get_dynamic_digit_string(f)
    }
    if (m != undefined) {
      m.innerHTML = common.get_dynamic_digit_string(e)
    }
    if (l != undefined) {
      l.innerHTML = common.get_dynamic_digit_string(f * e)
    }
    g = true;
    if (d < 1 || f < 1) {
      common.hv_debug('No item or count');
      g = false
    } else {
      if (j == 'shop_pane') {
        if (f * e > current_credits) {
          common.hv_debug('Insufficient credits');
          g = false
        }
      }
    }
    b('accept_button').src = IMG_URL + 'shops/accept' + (g ? '' : '_d') + '.png'
  }
  this.commit_transaction = function () {
    if (g) {
      if (confirm('Are you sure you wish to ' + (j == 'shop_pane' ? 'purchase' : 'sell') + ' ' + f + ' "' + i.replace('&#039;', '\'') + '" for ' + common.number_format(f * e) + ' credits ?')) {
        b('select_mode').value = j;
        b('select_item').value = d;
        b('select_count').value = f;
        b('shopform').submit()
      }
    } else {
      alert('Transaction cannot be completed as requested')
    }
  }
}
function init_shops() {
  return new Shops()
}
function ItemWorld() {
  var a = function (g) {
    return document.getElementById(g)
  };
  var f = 0;
  var d = undefined;
  var b = false;
  this.unset_selected_item = function () {
    common.hv_debug('unset_selected_item');
    this.set_selected_item(0, undefined)
  };
  this.set_selected_item = function (h, g) {
    common.hv_debug('set_selected_item = ' + h + ' ' + g);
    if (h == f && h != 0) {
      this.unset_selected_item();
      return
    }
    f = h;
    d = g;
    e()
  };
  function e() {
    b = true;
    if (f < 1) {
      common.hv_debug('No item selected');
      b = false
    } else {
      common.hv_debug('Selected item ' + f);
      b = true
    }
    a('accept_button').src = IMG_URL + 'shops/enteritemworld' + (b ? '' : '_d') + '.png'
  }
  this.commit_transaction = function () {
    if (b) {
      a('select_item').value = f;
      a('shopform').submit()
    } else {
      alert('Transaction cannot be completed as requested')
    }
  }
}
function init_itemworld() {
  return new ItemWorld()
}
function Forge() {
  var a = function (h) {
    return document.getElementById(h)
  };
  var g = 0;
  var d = undefined;
  var b = false;
  this.unset_selected_item = function () {
    common.hv_debug('unset_selected_item');
    this.set_selected_item(0, undefined)
  };
  this.set_selected_item = function (i, h) {
    common.hv_debug('set_selected_item = ' + i + ' ' + h);
    if (i == g && i != 0) {
      this.unset_selected_item();
      return
    }
    g = i;
    d = h;
    f()
  };
  var e = 0;
  this.set_forge_cost = function (i, j) {
    var h = a('forge_cost_div');
    if (i == e) {
      h.innerHTML = typeof default_forge_cost_text !== 'undefined' ? default_forge_cost_text : '';
      e = 0
    } else {
      h.innerHTML = j;
      e = i
    }
  };
  function f() {
    b = true;
    if (g < 1) {
      common.hv_debug('No item selected');
      b = false
    } else {
      common.hv_debug('Selected item ' + g);
      b = true
    }
    var l = a('upgrade_button');
    var k = a('enchant_button');
    var j = a('salvage_button');
    var h = a('reforge_button');
    var m = a('repair_button');
    var i = a('soulfuse_button');
    if (l != undefined) {
      l.src = IMG_URL + 'shops/showupgrades' + (b ? '' : '_d') + '.png'
    }
    if (k != undefined) {
      k.src = IMG_URL + 'shops/showenchants' + (b ? '' : '_d') + '.png'
    }
    if (j != undefined) {
      j.src = IMG_URL + 'shops/salvage' + (b ? '' : '_d') + '.png'
    }
    if (h != undefined) {
      h.src = IMG_URL + 'shops/reforge' + (b ? '' : '_d') + '.png'
    }
    if (m != undefined) {
      m.src = IMG_URL + 'shops/repair' + (b ? '' : '_d') + '.png'
    }
    if (i != undefined) {
      i.src = IMG_URL + 'shops/soulfuse' + (b ? '' : '_d') + '.png'
    }
  }
  this.commit_transaction = function () {
    if (b) {
      a('select_item').value = g;
      a('shopform').submit()
    } else {
      alert('No item selected')
    }
  }
}
function init_forge() {
  return new Forge()
}
function Snowflake() {
  var a = function (m) {
    return document.getElementById(m)
  };
  var j = a('pane_info');
  var b = a('pane_artifact');
  var e = a('pane_trophy');
  var i = a('pane_collectible');
  var d = 0;
  var g = 0;
  var f = undefined;
  var h = false;
  var l = [
    '1handed',
    '2handed',
    'staff',
    'shield',
    'acloth',
    'alight',
    'aheavy'
  ];
  this.unset_selected_item = function () {
    common.hv_debug('unset_selected_item');
    this.set_selected_item(0, undefined)
  };
  this.set_selected_item = function (n, m) {
    common.hv_debug('set_selected_item = ' + n + ' ' + m);
    if (n == d && n != 0) {
      this.unset_selected_item();
      return
    }
    d = n;
    f = m;
    k()
  };
  this.set_selected_reward = function (o, m) {
    common.hv_debug('set_selected_reward = ' + o + ' ' + m);
    if (o == g && o != 0) {
      o = 0
    }
    g = o;
    var n = 0;
    for (n = 1; n <= 7; n++) {
      common.hv_debug('reward_' + n);
      a('reward_' + n).src = IMG_URL + 'shops/' + l[n - 1] + (n == o ? '_on' : '_off') + '.png'
    }
    k()
  };
  function k() {
    h = true;
    var m = 0;
    if (d < 1) {
      common.hv_debug('No item selected');
      h = false;
      m = 1
    } else {
      if (d >= 20000 && d < 30000) {
        common.hv_debug('Selected artifact');
        h = true;
        m = 2
      } else {
        if (d >= 30000 && d < 40000) {
          common.hv_debug('Selected trophy');
          h = g > 0;
          m = 3
        } else {
          if (d >= 70000 && d < 80000) {
            common.hv_debug('Selected collectible');
            h = true;
            m = 4
          }
        }
      }
    }
    j.style.display = m == 1 ? '' : 'none';
    b.style.display = m == 2 ? '' : 'none';
    e.style.display = m == 3 ? '' : 'none';
    i.style.display = m == 4 ? '' : 'none';
    a('accept_button').src = IMG_URL + 'shops/offering' + (h ? '' : '_d') + '.png'
  }
  this.commit_transaction = function () {
    if (h) {
      if (confirm('Are you sure you wish to offer Snowflake a "' + f.replace('&#039;', '\'') + '" ?')) {
        a('select_item').value = d;
        a('select_reward').value = g;
        a('shopform').submit()
      }
    } else {
      alert('Transaction cannot be completed as requested')
    }
  }
}
function init_snowflake() {
  return new Snowflake()
}
function MoogleMail() {
  var b = function (n) {
    return document.getElementById(n)
  };
  var j = b('pane_info');
  var i = b('pane_item');
  var m = b('pane_equip');
  var k = b('pane_credhath');
  var d = 0;
  var h = 0;
  var f = undefined;
  var e = undefined;
  var a = 0;
  var g = false;
  var l = b('accept_button');
  this.unset_selected_item = function () {
    common.hv_debug('unset_selected_item');
    this.set_selected_item(0, undefined)
  };
  this.set_selected_item = function (q, n, o) {
    common.hv_debug('set_selected_item = ' + q + ' ' + o);
    if (q == d && q != 0) {
      this.unset_selected_item();
      return
    }
    if (q > 2) {
      h = 1
    }
    d = q;
    e = o;
    a = n;
    this.update_shop_displays()
  };
  this.set_display_pane = function (n) {
    f = n;
    this.update_shop_displays()
  };
  this.set_selected_count = function (n) {
    var o = undefined;
    if (n > - 1) {
      o = n + '';
      h = Math.max(0, parseInt(o))
    } else {
      o = prompt('How many of this item would you like to attach, kupo?', '1');
      h = Math.max(1, parseInt(o))
    }
  };
  this.update_shop_displays = function () {
    g = true;
    var n = 0;
    if (d < 1 || h < 1) {
      common.hv_debug('No item selected');
      g = false
    } else {
      common.hv_debug('Selected item ' + d);
      g = true
    }
    if (f == 'item') {
      n = 2
    } else {
      if (f == 'equip') {
        n = 3
      } else {
        if (f == 'credhath') {
          n = 4
        } else {
          n = 1
        }
      }
    }
    j.style.display = n == 1 ? '' : 'none';
    i.style.display = n == 2 ? '' : 'none';
    m.style.display = n == 3 ? '' : 'none';
    k.style.display = n == 4 ? '' : 'none';
    l.src = IMG_URL + 'mooglemail/attachselected' + (g ? '' : '_d') + '.png';
    l.style.display = n != 1 ? '' : 'none'
  };
  this.commit_transaction = function () {
    if (g) {
      b('action').value = 'attach_add';
      b('select_item').value = d;
      b('select_count').value = h;
      b('select_pane').value = f;
      b('mailform').submit()
    } else {
      alert('Transaction cannot be completed as requested, kupo!')
    }
  };
  this.mmail_send = function () {
    var o = '';
    if (attach_count > 0) {
      var n = (attach_count == 1 ? 'a' : attach_count + 'x') + ' "' + attach_name + '"';
      if (attach_cod > 0) {
        o = 'You have attached ' + (attach_id < 3 ? attach_name : n) + ', and the CoD is set to ' + attach_cod + ' credits, kupo! '
      } else {
        if (attach_id > 2) {
          o = 'YOU ARE ABOUT TO SEND OUT ' + n + ', BUT YOU HAVE NOT SET A COD, KUPO! The attachment will be a gift, kupo! '
        } else {
          o = 'You are about to send ' + attach_name + '. '
        }
      }
    }
    if (confirm(o + 'Are you sure you wish to send this message, kupo? Sending it will cost you ' + send_cost + ' credits, kupo!')) {
      b('action').value = 'send';
      b('mailform').submit()
    }
  };
  this.mmail_save = function () {
    b('action').value = 'save';
    b('mailform').submit()
  };
  this.mmail_discard = function () {
    if (confirm('Are you sure you wish to discard this message, kupo?')) {
      b('action').value = 'discard';
      b('mailform').submit()
    }
  };
  this.remove_attachment = function () {
    if (mail_state > 0 && attach_cod > 0) {
      if (!confirm('Removing this attachment will deduct ' + attach_cod + ' credits from your account. Are you sure?')) {
        return
      }
    }
    b('action').value = 'attach_remove';
    b('mailform').submit()
  };
  this.return_mail = function () {
    b('action').value = 'return_message';
    b('mailform').submit()
  };
  this.set_cod_amount = function () {
    var n = prompt('Please set a CoD amount for this item, kupo. The recipient must pay this amount to remove the attachment from this mail, kupo.', attach_cod);
    if (n) {
      var o = Math.max(0, parseInt(n));
      b('action').value = 'attach_cod';
      b('action_value').value = o;
      b('mailform').submit()
    }
  }
}
function init_mooglemail() {
  return new MoogleMail()
}
function Equips() {
  var b = 0;
  var d = undefined;
  this.set = function (e, f) {
    b = e;
    d = f
  };
  this.unset = function () {
    b = 0;
    d = undefined
  };
  function a(g) {
    if (g.shiftKey || g.altKey) {
      return
    }
    var f = (window.event) ? g.keyCode : g.which;
    var h = String.fromCharCode(f);
    common.hv_debug('key=' + f + ', keychar=' + h + ', alt=' + g.altKey);
    if (h == 'c') {
      equips.pop_equipwindow()
    }
  }
  this.pop_equipwindow = function () {
    if (b > 0) {
      var f = MAIN_URL + 'pages/showequip.php?eid=' + b + '&key=' + d;
      var e = 450;
      var g = 520;
      common.hv_debug('Opening ' + f);
      window.open(f, '_pu' + (Math.random() + '').replace(/0\./, ''), 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=' + e + ',height=' + g + ',left=' + ((screen.width - e) / 2) + ',top=' + ((screen.height - g) / 2))
    }
  };
  this.hook_copyevent = function () {
    document.onkeypress = a
  };
  this.unhook_copyevent = function () {
    document.onkeypress = null
  };
  this.lock = function (g, f) {
    var e = f.className == 'il' || f.className == 'ilp';
    var h = f.className == 'ilp' || f.className == 'iup';
    f.className = 'i' + (e ? 'u' : 'l') + (h ? 'p' : '');
    var i = get_rpcsession();
    i.dispatch_request(MAIN_URL + 'rpc/rpc_equip.php?act=toggle_lock&eid=' + g + '&val=' + (e ? 0 : 1), undefined)
  };
  this.hover = function (f) {
    f.style.background = '#F2EFDF';
    f.style.border = '1px solid #9B4E03'
  };
  this.unhover = function (f) {
    f.style.background = '';
    f.style.border = '1px solid #5C0D12'
  }
}
function init_equips() {
  var a = new Equips();
  a.hook_copyevent();
  return a
}
function init_equips_nohook() {
  return new Equips()
}
function Healer() {
  var f = function (g) {
    return document.getElementById(g)
  };
  var b = f('healform');
  var e = f('heal_hp');
  var a = f('heal_mp');
  var d = f('heal_sp');
  this.do_heal_hp = function () {
    e.value = '1';
    b.submit()
  };
  this.do_heal_mp = function () {
    a.value = '1';
    b.submit()
  };
  this.do_heal_sp = function () {
    d.value = '1';
    b.submit()
  };
  this.do_heal_all = function () {
    e.value = '1';
    a.value = '1';
    d.value = '1';
    b.submit()
  }
}
function init_healer() {
  return new Healer()
}
function Ability() {
  var b = function (f) {
    return document.getElementById(f)
  };
  var d = b('ability_popup_window');
  var e = b('mainpane');
  var a = b('abilitydiv');
  this.show_ability_popup = function (h, g, i) {
    var j = common.findPosWithScroll(h);
    var f = common.findScrollOffset(a);
    d.innerHTML = '<p style="font-weight:bold; text-align:center">' + g + '</p><p style="text-align:justify">' + i + '</p> ';
    d.style.left = (j[0] - f[0] - 195) + 'px';
    d.style.top = (j[1] - f[1] + 2) + 'px';
    d.style.visibility = 'visible'
  };
  this.hide_ability_popup = function () {
    d.style.visibility = 'hidden'
  }
}
function init_ability() {
  return new Ability()
}
function Training() {
  var b = function (k) {
    return document.getElementById(k)
  };
  var f = b('trainform');
  var e = b('trainid');
  var a = b('traincancelform');
  var h = b('traincancelflag');
  this.start_training = function (k) {
    e.value = k;
    f.submit()
  };
  this.cancel_training = function () {
    h.value = 1;
    a.submit()
  };
  var j = b('progress_bar');
  var i = b('progress_counter_1');
  var d = undefined;
  function g() {
    var k = 0;
    var l = new Date();
    var o = l.getTime() / 1000 + time_skew;
    if (o < end_time) {
      k = 100 - ((end_time - o) * 100 / total_time)
    } else {
      k = 100
    }
    var m = Math.floor(k);
    var n = Math.floor((k - m) * 100);
    i.innerHTML = m + '.' + (n < 10 ? '0' : '') + n;
    j.style.width = (k * 4) + 'px';
    if ((o >= end_time) && typeof reload_to != 'undefined') {
      document.location = reload_to;
      reload_to = undefined;
      clearInterval(d)
    }
  }
  this.do_progress_bar = function () {
    if (typeof reload_to != 'undefined') {
      d = setInterval(g, ticktime)
    }
  }
}
function init_training() {
  return new Training()
}
function Battle() {
  var q = function (w) {
    return document.getElementById(w)
  };
  var t = q('infopane');
  var f = new Array(undefined, undefined);
  var i = new Array(undefined, undefined);
  var l = 'log';
  var a = 'log';
  var n = undefined;
  var j = undefined;
  var b = undefined;
  var h = 1;
  var v = 0;
  var s = false;
  var d = function (w) {
    if (t != undefined) {
      t.innerHTML = w
    }
  };
  this.set_infopane = function (y) {
    var w = undefined;
    switch (y) {
      case 'Attack':
        w = 'Damages a single enemy. Depending on your equipped weapon, this can place certain status effects on the affected monster. To attack, click here, then click your target. Simply clicking an enemy will also perform a normal attack.';
        break;
      case 'Skillbook':
        w = 'Use special skills and magic. To use offensive spells and skills, first click it, then click your target. To use it on yourself, click it twice.';
        break;
      case 'Items':
        w = 'Use various consumable items that can replenish your vitals or augment your power in various ways.';
        break;
      case 'Spirit':
        w = 'Toggle Spirit Channeling.';
        break;
      case 'Defend':
        w = 'Increases your defensive capabilities for the next turn.';
        break;
      case 'Focus':
        w = 'Reduces the chance that your next spell will be resisted. Your defenses and evade chances are lowered for the next turn.';
        break;
      default:
        w = 'Choose from the Battle Actions highlighted above, and use them to defeat your enemies listed to the right. When all enemies are reduced to zero Health, you win. If your Health reaches zero, you are defeated.';
        break
    }
    d('<div class="btii">' + y + '</div><div>' + w + '</div>')
  };
  this.set_infopane_spell = function (D, C, B, z, y, w) {
    var A = '';
    if (z > 0 || y > 0) {
      A = 'Requires ';
      if (z > 0) {
        A += z + ' Magic Points'
      }
      if (z > 0 && y > 0) {
        A += z + ' and '
      }
      if (y > 0) {
        A += y + '% Overcharge'
      }
      A += ' to use.'
    }
    if (w > 0) {
      A += ' Cooldown: ' + w + ' turns.'
    }
    d('<div class="btii">' + D + '</div><div style="position:relative"><div style="float:left; width:601px"><div style="padding-bottom:3px; padding-right:3px">' + C + '</div><div><span style="font-weight:bold">' + A + '</span></div></div><div style="float:left; width:32px; height:32px; position:relative"><img src="' + IMG_URL + 'a/' + B + '.png" style="border:0px; margin:0px; padding:0px; position:absolute; left:3px; top:4px; z-index:3" /><img src="' + IMG_URL + 'ab/b.png" style="border:0px; margin:0px; padding:0px; position:absolute; left:-5px; top:-4px; z-index:3" /></div></div>')
  };
  this.set_infopane_effect = function (A, z, w) {
    var y = undefined;
    if (w == 'autocast') {
      y = 'Expires if magic is depleted to below 10%'
    } else {
      if (w == 'permanent') {
        y = 'Permanent until triggered'
      } else {
        y = 'Expires in ' + w + ' turn' + (w == 1 ? '' : 's')
      }
    }
    d('<div class="btii">' + A + '</div><div style="padding-bottom:3px">' + z + '</div><div><span style="font-weight:bold">' + y + '.</span></div>')
  };
  this.set_infopane_item = function (z, y, w) {
    d('<div class="btii">' + z + '</div><div style="padding-bottom:3px">' + y + '</div><div><span style="font-weight:bold">' + w + ' Item</span></div>')
  };
  this.lock_action = function (y, A, z, w) {
    A = parseInt(A);
    if ((i[A] == y) && (z != 'magic')) {
      f[A] = undefined;
      i[A] = undefined
    } else {
      f[A] = t.innerHTML;
      i[A] = y
    }
    if (A == 0) {
      f[1] = undefined;
      i[1] = undefined
    }
    if (A == 1) {
      if (n != z) {
        if (n != undefined) {
          document.getElementById('ckey_' + n).src = IMG_URL + 'battle/' + n + '_n.png'
        }
        y.src = IMG_URL + 'battle/' + n + '_s.png';
        n = z;
        battle.set_targetmode(z)
      }
      battle.set_selected_subaction(y, w)
    } else {
      if (n == z) {
        if (z == 'magic') {
          this.set_selected_subaction(undefined)
        } else {
          n = undefined
        }
      } else {
        if (n != undefined) {
          document.getElementById('ckey_' + n).src = IMG_URL + 'battle/' + n + '_n.png'
        }
        n = z
      }
      y.src = IMG_URL + 'battle/' + z + '_' + (n == undefined ? 'n' : 's') + '.png';
      battle.set_targetmode(z);
      switch (z) {
        case 'attack':
          battle.toggle_default_pane();
          break;
        case 'magic':
          battle.toggle_magic_pane();
          break;
        case 'items':
          battle.toggle_item_pane();
          break;
        default:
          battle.touch_and_go()
      }
    }
  };
  this.clear_infopane = function () {
    if (f[1] != undefined) {
      d(f[1])
    } else {
      if (f[0] != undefined) {
        d(f[0])
      } else {
        this.set_infopane('Battle Time')
      }
    }
  };
  var k = function (w) {
    q('togpane_' + w).style.display = '';
    l = w
  };
  var m = function (w) {
    q('togpane_' + w).style.display = 'none';
    l = undefined
  };
  this.toggle_pane = function (w) {
    if (w == l) {
      this.toggle_default_pane()
    } else {
      m(l);
      k(w)
    }
  };
  this.toggle_default_pane = function () {
    if (l != a) {
      m(l);
      k(a);
      l = a
    }
  };
  this.toggle_magic_pane = function () {
    if (l == 'magico') {
      this.toggle_pane('magict')
    } else {
      if (l == 'magict') {
        this.toggle_pane('magico')
      } else {
        this.toggle_pane(default_magic_pane)
      }
    }
  };
  this.toggle_magico_pane = function () {
    this.toggle_pane('magico')
  };
  this.toggle_magict_pane = function () {
    this.toggle_pane('magict')
  };
  this.toggle_item_pane = function () {
    this.toggle_pane('item')
  };
  var r = 'attack';
  var u = 0;
  var o = 0;
  this.set_targetmode = function (w) {
    if (r == w && w != 'magic') {
      r = 'attack'
    } else {
      r = w
    }
  };
  this.reset_subattack = function () {
    u = 0;
    o = 0;
    this.set_selected_subaction(undefined)
  };
  this.set_hostile_subattack = function (w) {
    if (o == w) {
      o = 0
    } else {
      o = w
    }
  };
  this.set_friendly_subattack = function (w) {
    if (o == w) {
      u = 0;
      this.touch_and_go()
    } else {
      o = w
    }
  };
  this.hover_target = function (y) {
    if (b != undefined) {
      return
    }
    var z = common.findPosWithScroll(y);
    var w = common.findPosWithScroll(q('monsterpane'));
    z[0] -= w[0];
    z[1] -= w[1];
    g('monster', 1).style.left = (z[0] - 7) + 'px';
    g('monster', 1).style.top = (z[1] + y.offsetHeight / 2 - 3) + 'px';
    g('monster', 2).style.left = (z[0] + y.offsetWidth + 2) + 'px';
    g('monster', 2).style.top = (z[1] + y.offsetHeight / 2 - 3) + 'px';
    g('monster', 1).style.visibility = 'visible';
    g('monster', 2).style.visibility = 'visible'
  };
  this.unhover_target = function () {
    if (b != undefined) {
      return
    }
    g('monster', 1).style.visibility = 'hidden';
    g('monster', 2).style.visibility = 'hidden'
  };
  this.commit_target = function (w) {
    if (b != undefined) {
      return
    }
    b = w;
    u = w;
    this.touch_and_go()
  };
  this.touch_and_go = function () {
    if (!s) {
      s = true;
      q('battleaction').value = 1;
      q('battle_targetmode').value = r;
      q('battle_target').value = u;
      q('battle_subattack').value = o;
      //q('battleform').submit()
    }
  };
  this.battle_continue = function () {
    q('battleaction').value = 0;
    q('battleform').submit()
  };
  var g = function (y, w) {
    return q('ta_' + y + '_' + w)
  };
  var e = function (w) {
    w.style.opacity = 0
  };
  this.set_selected_subaction = function (w, y) {
    if (w == undefined) {
      j = undefined;
      common.set_text_unselected();
      return
    }
    if (j == y) {
      this.set_selected_subaction(undefined)
    } else {
      common.set_text_selected(w)
    }
  };
  this.start_flash_loop = function () {
    setInterval(function () {
      v = common.decimalround(Math.min(1, Math.max(0, v + 0.1 * h)), 2);
      if (v == 0 || v == 1) {
        h *= - 1
      }
      if (b != undefined) {
        g('monster', 1).style.opacity = v;
        g('monster', 2).style.opacity = v
      }
      if (healthflash = q('healthflash')) {
        healthflash.style.opacity = v
      }
      var y = 0;
      var w = undefined;
      while (w = q('effect_expire_' + ++y)) {
        w.style.opacity = (0.8 - v / 2)
      }
    }, 25)
  };
  document.onkeydown = function (E) {
    E = E || window.event;
    var B;
    if (E.target) {
      B = E.target
    } else {
      if (E.srcElement) {
        B = E.srcElement
      }
    }
    if (B.nodeType == 3) {
      B = B.parentNode
    }
    if (B.tagName == 'INPUT' || B.tagName == 'TEXTAREA') {
      return
    }
    var H = (E.keyCode) ? E.keyCode : E.which;
    var D = String.fromCharCode(H);
    var w = undefined;
    var C = undefined;
    var z = undefined;
    var A = - 1;
    switch (H) {
      case 48:
      case 96:
        A = 0;
        break;
      case 49:
      case 97:
        A = 1;
        break;
      case 50:
      case 98:
        A = 2;
        break;
      case 51:
      case 99:
        A = 3;
        break;
      case 52:
      case 100:
        A = 4;
        break;
      case 53:
      case 101:
        A = 5;
        break;
      case 54:
      case 102:
        A = 6;
        break;
      case 55:
      case 103:
        A = 7;
        break;
      case 56:
      case 104:
        A = 8;
        break;
      case 57:
      case 105:
        A = 9;
        break
    }
    var I = false;
    if (E.altKey) {
      if (A >= 0 && A < 10) {
        if (A == 0) {
          A = 10
        }
        I = true;
        var y = q('qb' + A);
        if (y) {
          y.onmouseover();
          y.onclick()
        }
      }
  } else {
    if (H == 13 || H == 32) {
      w = 'ckey_continue'
    } else {
      if (A > - 1) {
        w = 'mkey_' + A
      } else {
        if ((H >= 112 && H <= 123) || D == 'G' || D == 'P') {
          if (l != 'item') {
            w = 'ckey_items'
          }
          if (D == 'G' || D == 'P') {
            C = 'ikey_p'
          } else {
            if (E.ctrlKey) {
              C = 'ikey_n' + (H - 111)
            } else {
              if (E.shiftKey) {
                C = 'ikey_s' + (H - 111)
              } else {
                C = 'ikey_' + (H - 111)
              }
            }
          }
        } else {
          if (!E.ctrlKey && !E.shiftKey) {
            switch (D) {
              case 'Q':
                w = 'ckey_attack';
                break;
              case 'W':
                w = 'ckey_magic';
                break;
              case 'E':
                w = 'ckey_items';
                break;
              case 'S':
                w = 'ckey_spirit';
                break;
              case 'D':
                w = 'ckey_defend';
                break;
              case 'F':
                w = 'ckey_focus';
                break;
              case 'R':
                w = 'ckey_magic';
                z = 'action_recast';
                break
            }
          }
        }
      }
    }
    if (w || C) {
      I = true
    }
    if (w) {
      var y = undefined;
      if (y = q(w)) {
        y.onclick()
      }
    }
    if (z) {
      if (z == 'action_recast') {
        if (recast_spell > 0) {
          var G = q(recast_spell);
          G.onclick();
          if (recast_target > 0) {
            var F = q('mkey_' + (recast_target == 10 ? 0 : recast_target));
            if (F != undefined) {
              F.onclick()
            }
          } else {
            if (recast_target == 0) {
              G.onclick()
            }
          }
        }
      }
    }
    if (C) {
      if (y = q(C)) {
        y.onclick()
      }
    }
  }
  if (I) {
    E.cancelBubble = true;
    E.returnValue = false;
    if (E.stopPropagation) {
      E.stopPropagation();
      E.preventDefault()
    }
    return false
  }
}
}
function init_battle() {
var a = new Battle();
a.clear_infopane();
a.start_flash_loop();
return a
}
function MonsterLab() {
var a = function (b) {
return document.getElementById(b)
};
this.init_primary_attack = function () {
var b = a('selected_patk');
if (b != '') {
  this.set_primary_attack(b)
}
};
this.set_primary_attack = function (b) {
var d = a('selected_patk').value;
if (d.length > 0) {
  a('patk_' + d).src = IMG_URL + 'monster/' + d + '.png';
  a('selected_patk').value = ''
}
if (b.length > 0) {
  a('patk_' + b).src = IMG_URL + 'monster/' + b + '_a.png';
  a('selected_patk').value = b
}
}
}
function init_monsterlab() {
var a = new MonsterLab();
return a
}
function at_display(a) {
win = window.open();
for (var b in a) {
win.document.write(b + ' = ' + a[b] + '<br/>')
}
}
function at_show_aux(a, g) {
var e = document.getElementById(a);
var f = document.getElementById(g);
var d = (f.at_position == 'y') ? e.offsetHeight + 0 : 0;
var b = (f.at_position == 'x') ? e.offsetWidth + 0 : 0;
for (; e; e = e.offsetParent) {
d += e.offsetTop;
b += e.offsetLeft
}
f.style.position = 'absolute';
f.style.top = d + 'px';
f.style.left = b + 'px';
f.style.visibility = 'visible'
}
function at_show() {
p = document.getElementById(this['at_parent']);
c = document.getElementById(this['at_child']);
at_show_aux(p.id, c.id);
clearTimeout(c.at_timeout)
}
function at_hide() {
c = document.getElementById(this['at_child']);
c.at_timeout = setTimeout('document.getElementById(\'' + c.id + '\').style.visibility = \'hidden\'', 100)
}
function at_click() {
p = document.getElementById(this['at_parent']);
c = document.getElementById(this['at_child']);
if (c.style.visibility != 'visible') {
at_show_aux(p.id, c.id)
} else {
c.style.visibility = 'hidden'
}
return false
}
function at_attach(d, f, b, a, e) {
p = document.getElementById(d);
c = document.getElementById(f);
p.at_parent = p.id;
c.at_parent = p.id;
p.at_child = c.id;
c.at_child = c.id;
p.at_position = a;
c.at_position = a;
c.style.position = 'absolute';
c.style.visibility = 'hidden';
switch (b) {
case 'click':
  p.onclick = at_click;
  p.onmouseout = at_hide;
  c.onmouseover = at_show;
  c.onmouseout = at_hide;
  break;
case 'hover':
  p.onmouseover = at_show;
  p.onmouseout = at_hide;
  c.onmouseover = at_show;
  c.onmouseout = at_hide;
  break
}
};
