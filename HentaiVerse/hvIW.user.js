// ==UserScript==
// @name        [HV]IW
// @include     http://alt.hentaiverse.org/*
// @exclude     http://alt.hentaiverse.org/equip/*
// @include     http*://hentaiverse.org/*
// @exclude     http*://hentaiverse.org/equip/*
// @version     1.0.3
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://cdn.jsdelivr.net/gh/dodying/UserJs@master/Logo.png
// @run-at      document-end
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
(function () {
  'use strict'

  // 战斗中-监测日志
  if (!gE('#navbar') && GM_getValue('equip') && GM_getValue('tasks', []).length) {
    let observer = new window.MutationObserver(checkLog)
    observer.observe(gE('#battle_main'), {
      childList: true,
      subtree: true
    })
  }

  // container
  let eContainer = gE('body').appendChild(cE('div'))
  eContainer.style = 'position:fixed;top:100px;left:' + (gE('#csp').offsetLeft + gE('#csp').offsetWidth) + 'px;'
  eContainer.innerHTML = '<button name="config">IW Config</button><br><button name="log">IW Log</button>'

  let eConfig = eContainer.querySelector('[name="config"]')
  eConfig.addEventListener('click', function () {
    if (gE('#iwTask')) {
      gE('#iwTask').style.display = gE('#iwTask').style.display === 'none' ? 'block' : 'none'
      return
    }
    let iframe = gE('body').appendChild(cE('iframe'))
    iframe.src = 'about:blank'
    iframe.frameBorder = '0'
    iframe.id = 'iwTask'
    let place = gE('#itemworld_right>.v') || gE('#csp')
    iframe.style = 'background-color:#EDEBDF;z-index:3;border:1px solid #5C0D12;position:absolute;top:' + place.offsetTop + 'px;left:' + place.offsetLeft + 'px;width:' + place.offsetWidth + 'px;height:' + place.offsetHeight + 'px;'
    iframe.onload = function () {
      let doc = iframe.contentWindow.document
      doc.body.innerHTML = '0.规则: 当<b>不</b>满足 <b>当前Upgrades和 * 10 >= 目标Upgrades和 * Potency Tier</b> 时，<b>Reforge</b><br>1. 选择equip后，点击New Task，设置后保存<br>2. 第一个Target选择框留空，表示删除该任务<br>3. 只需设置一个属性时，将第二个Target选择框留空<br>Max Potency Tier: <input name="potencyMax" placeholder="10" type="number"> (Potency Tier ≥ 该值后，停止)<br><input id="pre" type="checkbox"><label for="pre">预模式: 先(X15)到Tier 2, 再(X20)</label><br><input id="targetOnly" type="checkbox"><label for="targetOnly">只要目标完成，不管Tier多少，都停止</label><br><input id="double" type="checkbox"><label for="double">设置双属性时，当设置总值 ≥ <input name="doubleMax" placeholder="8" type="number"> 时，装备出现第三属性就reforge </label><br>'
      // Style
      let style = gE('head', doc).appendChild(cE('style'))
      style.textContent = '*{margin:5px;text-align:center;}table{border:2px solid #000;border-collapse:collapse;margin:0 auto;}table td,table th{border:1px solid #000;}input{text-align:right;width:80px;}'
      //
      let eBtnReset = gE('body', doc).appendChild(cE('button'))
      eBtnReset.textContent = 'I have enough Amnesia Shards'
      eBtnReset.onclick = function () {
        GM_setValue('empty', false)
        window.location = window.location.search
      }
      // Table
      let eTable = gE('body', doc).appendChild(cE('table'))
      let eTbody = eTable.appendChild(cE('tbody'))
      let eTr = eTbody.appendChild(cE('tr'))
      eTr.innerHTML = '<th></th><th>Equip</th><th>Target</th>'
      // Button
      let htmlPotency = [
        '<select name="potency">',
        '<option></option>',
        '<option>Coldproof</option>',
        '<option>Darkproof</option>',
        '<option>Elecproof</option>',
        '<option>Fireproof</option>',
        '<option>Holyproof</option>',
        '<option>Windproof</option>',
        '<option>Capacitor</option>',
        '<option>Juggernaut</option>',
        '<option>Butcher</option>',
        '<option>Fatality</option>',
        '<option>Overpower</option>',
        '<option>Swift Strike</option>',
        '<option>Annihilator</option>',
        '<option>Archmage</option>',
        '<option>Economizer</option>',
        '<option>Penetrator</option>',
        '<option>Spellweaver</option>',
        '</select>'
      ].join('')
      let htmlTier = '<select name="tier">' + [1, 2, 3, 4, 5].map(function (i) {
        return '<option value="' + i + '">' + i + '</option>'
      }).join('') + '</select>'
      let htmlTierMax = '<select name="tierMax">' + [5, 4, 3, 2, 1].map(function (i) {
        return '<option value="' + i + '">' + i + '</option>'
      }).join('') + '</select>'
      let order = 1
      let eBtnNew = gE('body', doc).appendChild(cE('button'))
      eBtnNew.textContent = 'New Task'

      function newTr (obj) {
        obj = obj instanceof Object ? obj : {}
        let equip = obj.equip || unsafeWindow.select_equip
        if (!equip) return
        let title = obj.title || unsafeWindow.dynjs_equip[equip].t
        let url = obj.url || unsafeWindow.dynjs_equip[equip].k
        let token = obj.token || unsafeWindow.select_token
        let type = obj.type || window.location.search.match('&filter=') ? window.location.search.split(/&|=/)[5] : '1handed'
        let eTr = eTbody.appendChild(cE('tr'))
        eTr.innerHTML = '<td>' + (order++) + '</td><td><a name="url" target="_blank" href="/equip/' + equip + '/' + url + '">' + title + '</a><input name="equip" type="hidden" value="' + equip + '"><input name="token" type="hidden" value="' + token + '"><input name="type" type="hidden" value="' + type + '"></td><td><div>' + htmlPotency + ': ' + htmlTier + ' Tier最大值: ' + htmlTierMax + '</div><div>' + htmlPotency + ': ' + htmlTier + ' Tier最大值: ' + htmlTierMax + '</div></td>'
        return eTr
      }
      eBtnNew.onclick = newTr
      let eBtnSave = gE('body', doc).appendChild(cE('button'))
      eBtnSave.textContent = 'Save Config'
      eBtnSave.onclick = function () {
        let tasks = []
        let url = gE('[name="url"]', 'all', doc)
        let equip = gE('[name="equip"]', 'all', doc)
        let token = gE('[name="token"]', 'all', doc)
        let type = gE('[name="type"]', 'all', doc)
        let potency = gE('[name="potency"]', 'all', doc)
        let tier = gE('[name="tier"]', 'all', doc)
        let tierMax = gE('[name="tierMax"]', 'all', doc)
        for (let i = 0; i < equip.length; i++) {
          if (potency[i * 2].value) {
            let _target = []
            _target.push(potency[i * 2].value, tier[i * 2].value, tierMax[i * 2].value)
            if (potency[i * 2 + 1].value) _target.push(potency[i * 2 + 1].value, tier[i * 2 + 1].value, tierMax[i * 2 + 1].value)
            tasks.push({
              equip: equip[i].value,
              title: url[i].textContent,
              url: url[i].getAttribute('href').split('/')[3],
              token: token[i].value,
              type: type[i].value,
              target: _target.join()
            })
          }
        }
        GM_setValue('tasks', tasks)
        GM_setValue('potencyMax', gE('[name="potencyMax"]', doc).value ? gE('[name="potencyMax"]', doc).value * 1 : 10)
        GM_setValue('pre', gE('#pre', doc).checked)
        GM_setValue('targetOnly', gE('#targetOnly', doc).checked)
        GM_setValue('double', gE('#double', doc).checked)
        GM_setValue('doubleMax', gE('[name="doubleMax"]', doc).value ? gE('[name="doubleMax"]', doc).value * 1 : 8)
        gE('body').removeChild(iframe)
        window.location = window.location.search
      }

      if (GM_getValue('tasks', []).length) {
        let tasks = GM_getValue('tasks', [])
        for (let i of tasks) {
          let eTr = newTr(i)
          let potency = gE('[name="potency"]', 'all', eTr)
          let tier = gE('[name="tier"]', 'all', eTr)
          let tierMax = gE('[name="tierMax"]', 'all', eTr)

          let _target = i.target.split(',')
          potency[0].value = _target[0]
          tier[0].value = _target[1]
          tierMax[0].value = _target[2]
          if (_target.length === 6) {
            potency[1].value = _target[3]
            tier[1].value = _target[4]
            tierMax[1].value = _target[5]
          }
        }
      }
      if (GM_getValue('potencyMax')) gE('[name="potencyMax"]', doc).value = GM_getValue('potencyMax')
      gE('#pre', doc).checked = GM_getValue('pre')
      gE('#targetOnly', doc).checked = GM_getValue('targetOnly')
      gE('#double', doc).checked = GM_getValue('double')
      if (GM_getValue('doubleMax')) gE('[name="doubleMax"]', doc).value = GM_getValue('doubleMax')
    }
  })
  let eLog = eContainer.querySelector('[name="log"]')
  eLog.addEventListener('click', function () {
    if (gE('#iwLog')) {
      gE('body').removeChild(gE('#iwLog'))
      return
    }
    let iframe = gE('body').appendChild(cE('iframe'))
    iframe.src = 'about:blank'
    iframe.frameBorder = '0'
    iframe.id = 'iwLog'
    let place = gE('#itemworld_right>.v') || gE('#csp')
    iframe.style = 'background-color:#EDEBDF;z-index:3;border:1px solid #5C0D12;position:absolute;top:' + place.offsetTop + 'px;left:' + place.offsetLeft + 'px;width:' + place.offsetWidth + 'px;height:' + place.offsetHeight + 'px;'
    iframe.onload = function () {
      let log = GM_getValue('log', {})
      let html = ['<tr><th>equip</th><th>time</th><th>info</th></tr>']
      let txt = ['equip\ttime\tinfo']
      let csv = ['equip,time,info']
      for (let i in log) {
        for (let j of log[i]) {
          let _log = [].concat(i, j.split('|||'))
          let _logColor = ''
          if (j.match(/Completed:/)) {
            _logColor = '#00BB00'
          } else if (j.match(/Reforged:/)) {
            _logColor = '#BB0000'
          }
          if (_logColor) _logColor = ' style="color:' + _logColor + '"'
          if (j.match(/Url:/)) _log[2] = _log[2].replace(/(\/equip\/.*)/, '<a href="$1" target="_blank">$1</a>')
          html.push('<tr' + _logColor + '><td>' + _log.join('</td><td>') + '</td></tr>')
          txt.push(_log.join('\t'))
          csv.push(_log.join())
        }
      }

      let doc = iframe.contentWindow.document
      let style = gE('head', doc).appendChild(cE('style'))
      style.textContent = '*{margin:5px;text-align:center;}table{border:2px solid #000;border-collapse:collapse;margin:0 auto;}table td,table th{border:1px solid #000;}input{text-align:right;width:80px;}tr[style]{font-size:large;font-weight:bold;}'

      let logContainer = gE('body', doc).appendChild(cE('div'))

      let htmlA = logContainer.appendChild(cE('a'))
      htmlA.textContent = 'download .HTML'
      htmlA.href = '#'
      htmlA.download = 'log.html'
      htmlA.onclick = function () {
        let htmlBlob = new window.Blob([gE('head', doc).outerHTML + gE('table', doc).outerHTML], {
          type: 'octet/stream'
        })
        htmlA.target = '_blank'
        htmlA.href = URL.createObjectURL(htmlBlob)
      }

      let csvA = logContainer.appendChild(cE('a'))
      csvA.textContent = 'download .CSV'
      csvA.href = '#'
      csvA.download = 'log.csv'
      csvA.onclick = function () {
        let csvBlob = new window.Blob([csv.join('\n')], {
          type: 'octet/stream'
        })
        csvA.target = '_blank'
        csvA.href = URL.createObjectURL(csvBlob)
      }

      let txtA = logContainer.appendChild(cE('a'))
      txtA.textContent = 'download .TXT'
      txtA.href = '#'
      txtA.download = 'log.txt'
      txtA.onclick = function () {
        let csvBlob = new window.Blob([txt.join('\r\n')], {
          type: 'octet/stream'
        })
        txtA.target = '_blank'
        txtA.href = URL.createObjectURL(csvBlob)
      }

      let btnReset = logContainer.appendChild(cE('button'))
      btnReset.textContent = 'Log Reset'
      btnReset.onclick = function () {
        GM_setValue('log', {})
      }

      let table = logContainer.appendChild(cE('table'))
      table.innerHTML = '<tbody>' + html.join('') + '</tbody>'
    }
  })

  // 非战斗时，检查装备
  if (gE('#navbar') && GM_getValue('tasks', []).length && !GM_getValue('empty', false)) {
    let task = GM_getValue('tasks')[0]
    if (!task) return
    let equip = task.equip
    GM_setValue('equip', equip)
    let target = task.target.split(',')
    post('/equip/' + equip + '/' + task.url, function (data) {
      let upgrades = gE('#ep>span', 'all', data)
      if (upgrades.length) { // Potency Tier: >0
        let potency = gE('.eq>div:nth-child(2)', data).textContent.match(/Potency Tier: (\d+)/)[1] * 1 // 当前等级
        upgrades = [...upgrades].map(function (i) {
          let re = i.textContent.match(/(\w+) Lv\.(\d+)/)
          return [re[1], re[2] * 1]
        })
        let tier = 0 // 目标属性和
        let tierNow = 0 // 当前满足的属性和
        let targetOnly = true
        let _tier // 目标属性
        let _tierMax // 目标属性最大值
        let _tierNow // 当前满足的属性
        let checkTierMax = true
        for (let i = 0; i < target.length; i += 3) {
          let name = target[i]
          _tier = target[i + 1] * 1 // 目标属性
          _tierMax = target[i + 2] * 1 // 目标属性
          tier += _tier
          _tierNow = upgrades.filter(function (i) {
            return i[0] === name
          }) // 当前满足的属性
          _tierNow = _tierNow.length ? _tierNow[0][1] * 1 : 0
          tierNow += _tierNow
          if (_tierNow < _tier) targetOnly = false
          if (_tierNow > _tierMax) checkTierMax = false
        }
        let check = tierNow * 10 >= tier * potency &&
          (checkTierMax) &&
          (_tier === tier || !GM_getValue('double') || tier < GM_getValue('doubleMax', 8) || (GM_getValue('double') && tier >= GM_getValue('doubleMax', 8) && potency === tierNow))
        // -> 判断1: 总体成长度满足
        //   -> 判断2: 目标属性小于等于目标属性最大值
        //      -> 判断3: 单属性
        //      -> 判断3: 双属性，但未勾选双属性
        //      -> 判断3: 双属性，勾选双属性，但目标属性和小于设定值
        //      -> 判断3: 双属性，勾选双属性，且目标属性和大于等于设定值，且当前等级等于当前满足的属性和（即无第三属性）
        if (check) {
          if (potency === GM_getValue('potencyMax', 10) || (GM_getValue('targetOnly') && targetOnly)) { // Lv max -> next equip
            addLog('Completed: ' + equip)
            addLog('Url: ' + '/equip/' + equip + '/' + task.url)
            addLog('----------------')
            let tasks = GM_getValue('tasks')
            tasks.splice(0, 1)
            GM_setValue('tasks', tasks)
          }
          startTask(potency < 2) // AND continue iw
        } else { // reforge AND restart
          post('?s=Forge&ss=fo&filter=' + task.type, function () {
            if (gE('#messagebox') && gE('#messagebox').textContent.match('Insufficient amnesia shards')) {
              GM_setValue('empty', true)
            } else {
              let info = [...gE('#ep>span', 'all', data)].map(function (i) {
                return i.textContent
              }).join(' & ')
              addLog('Reforged: ' + equip)
              addLog('Url: ' + '/equip/' + equip + '/' + task.url)
              addLog('Tier: ' + potency + ' & ' + info)
              addLog('----------------')
              startTask(true)
            }
          }, 'select_item=' + equip)
        }
      } else { // Potency Tier: 0
        startTask(true)
      }
    })
  }
})()

function gE (ele, mode, parent) { // 获取元素
  if (typeof ele === 'object') {
    return ele
  } else if (mode === undefined && parent === undefined) {
    return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele)
  } else if (mode === 'all') {
    return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele)
  } else if (typeof mode === 'object' && parent === undefined) {
    return mode.querySelector(ele)
  }
}

function cE (name) { // 创建元素
  return document.createElement(name)
}

function post (href, func, parm, type) { // post
  let xhr = new window.XMLHttpRequest()
  xhr.open(parm ? 'POST' : 'GET', href)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
  xhr.responseType = type || 'document'
  xhr.onerror = function () {
    xhr = null
    post(href, func, parm, type)
  }
  xhr.onload = function (e) {
    if (e.target.status >= 200 && e.target.status < 400 && typeof func === 'function') {
      let data = e.target.response
      if (xhr.responseType === 'document' && gE('#messagebox', data)) {
        if (gE('#messagebox')) {
          gE('#csp').replaceChild(gE('#messagebox', data), gE('#messagebox'))
        } else {
          gE('#csp').appendChild(gE('#messagebox', data))
        }
      }
      func(data, e)
    }
    xhr = null
  }
  xhr.send(parm)
}

function checkLog (e) {
  if (['pauseChange', 'hvAALog'].includes(e[0].target.className)) return
  let filter = GM_getValue('equip') && gE('#btcp') && gE('#btcp').textContent.match('Item world cleared!') && e.some(function (i) {
    return i.target === gE('#textlog>tbody')
  })
  if (filter) {
    let battleLog = [...gE('#textlog td', 'all')].map(function (i) {
      return i.textContent
    })
    if (!battleLog.includes('You are Victorious!')) return
    battleLog = battleLog.reverse().splice(battleLog.indexOf('You are Victorious!'))
    for (let i of battleLog) {
      if (i.match(/^The equipment/)) {
        addLog('+ ' + i.match(/by (\d+) points/)[1] + 'p')
      } else if (i.match(/^Unlocked innate potential/)) {
        addLog('!!New: ' + i.match(/: (.*)/)[1])
      }
    }
  }
}

function addLog (text) {
  let log = GM_getValue('log', {})
  let equip = GM_getValue('equip')
  if (!(equip in log)) log[equip] = []
  log[equip].push(new Date().toLocaleString(navigator.language, {
    hour12: false
  }) + '|||' + text)
  GM_setValue('log', log)
}

function startTask (change) {
  if (!GM_getValue('tasks', []).length) return

  function start () {
    let task = GM_getValue('tasks')[0]
    setTimeout(function () {
      post('?s=Battle&ss=iw&filter=' + task.type, function () {
        window.location = window.location.search
      }, 'initid=' + task.equip + '&inittoken=' + task.token)
    }, (Math.random() * 60 + 5) * 1000)
  }
  if (GM_getValue('pre') && change && !gE('#level_readout').textContent.match('IWBTH')) {
    // need change AND challenge != x15
    changeChallenge('6', start)
  } else if (GM_getValue('pre') && !change && !gE('#level_readout').textContent.match('PFUDOR')) {
    // not need change BUT challenge != pre
    changeChallenge('7', start)
  } else {
    start()
  }
}

function changeChallenge (level, func) { // level=1-7
  post('?s=Character&ss=se', function (data) {
    let settings = [...gE('#settings_outer input,#settings_outer select', 'all', data)].map(function (i) {
      if (i.type === 'radio' || i.type === 'checkbox') {
        return i.checked ? i.name + '=' + i.value : ''
      } else {
        return i.name + '=' + i.value
      }
    }).filter(function (i) {
      return i
    }).join('&')
    post('?s=Character&ss=se', function () {
      func()
    }, settings.replace(/difflevel=\d+/, 'difflevel=' + level + 'ch'))
  })
}
