// ==UserScript==
// @name        dmzj2bgm
// @description 请通过脚本命令来进行授权与数据同步
// @include     https://i.dmzj.com/record
// @include     https://i.dmzj.com/record#*
// @version     1.0.4.1542891536544
// @Date        2018-11-22 20:58:56
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://raw.githubusercontent.com/dodying/UserJs/master/Logo.png
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// ==/UserScript==
const G = { // 全局变量
  appid: 'bgm2215aeff10bdef4f',
  appkey: '9528074ecdcd72f6df043cca6c7547dd',
  redirectUri: 'userjs',
  refresh: 60 * 60 * 24 * 1,
  SubjectType: [
    '',
    'Book',
    'Anime',
    'Music',
    'Game',
    'Real'
  ],
  CollectionStatus: {
    wish: '想做',
    collect: '做过',
    do: '在做',
    on_hold: '搁置',
    dropped: '抛弃'
  },
  EpStatus: {
    watched: '看过',
    queue: '想看',
    drop: '抛弃'
  }
}

const type = 1

const log = (...args) => {
  console.log(...args)
  try {
    args = args.map(i => typeof i === 'object' ? JSON.stringify(i, null, 2) : i).map(i => `<pre>${i}</pre>`).join('<br>')
    $('.console').html(args)
  } catch (error) {}
}

async function init () {
  addStyle()
  GM_registerMenuCommand('Authorize', authorize)
  GM_registerMenuCommand('dmzj2bgm', async () => {
    let checkSubjectInterval = setInterval(() => {
      if ($('.subjectList').is(':visible')) {
        $('.console').hide()
      } else {
        $('.console').show()
      }
    }, 200)
    $('#dmzj2bgm').show()
    await main()
    $('#dmzj2bgm').hide()
    clearInterval(checkSubjectInterval)
  })
  $('<div id="dmzj2bgm"></div>').html(`<div class="console"></div><div class="subjectList"><div><img></img><br><input type="text" class="subjectSearch"><span class="subjectIgnore">X</span></div><ol></ol></div>`).appendTo('body')
}

async function main () {
  let token = GM_getValue('token')
  if (!token) return window.alert('请先授权')
  let expires = token.expires - new Date().getTime() / 1000
  if (expires <= 0) {
    return window.alert('授权过期，请先重新授权')
  } else if (expires <= G.refresh) {
    await refreshToken()
    token = GM_getValue('token')
  }

  let update = async (bgmId, dmzjId, progress, tags) => {
    if (!dmzjId) dmzjId = $('#dmzj2bgm').data().dmzjId
    if (!progress) progress = $('#dmzj2bgm').data().progress
    if (!tags) tags = $('#dmzj2bgm').data().tags

    await updateStatus(bgmId, token.access_token, progress, tags) // 更新进度
    // await delDmzjRecord(dmzjId)
    $(`#my_record_id>ul>li:has(#del_${dmzjId})`).hide()
  }

  let showList = async keyword => {
    try {
      let res = await xhrSync('https://api.bgm.tv/search/subject/' + keyword + '?responseGroup=large')
      let result = JSON.parse(res.response)
      let list = result.list.filter(i => i.type === type)

      if (list.length === 0) {
        $('.subjectList>ol').html('')
        throw Error('eof')
      }

      let filter = list.filter(i => i.name_cn === $('#dmzj2bgm').data().name || i.name_cn === keyword)
      if (filter.length === 1) {
        await update(filter[0].id) // 更新进度
        $('#dmzj2bgm').data({ result: filter[0].id })
        return true
      } else {
        let html = list.map(i => `<li name="${i.id}" class="subjectBox"><div><a href="${i.images.large.replace('http://', 'https://')}" target="_blank" title="点击查看大图"><img src="${i.images.common.replace('http://', 'https://')}"></img></a><br>${G.SubjectType[i.type]} <a href="${i.url.replace('http://', 'https://')}" target="_blank">${i.name_cn || i.name}</a></div><div>${i.summary.replace(/\n/g, '<br>')}</div></li>`).join('')
        $('.subjectList>ol').html(html)
      }
    } catch (error) {
      if (error.message !== 'eof') console.error(error)
      $('.subjectList>ol').html('')
    }
    $('.subjectList').show()
  }

  // 获取类型
  let typeSpecific = $('.optioned').text()
  if (typeSpecific === '漫画' || typeSpecific === '小说') {
  } else {
    return window.alert('不支持动画记录')
  }

  let idLib = GM_getValue('idLib', { 漫画: {}, 小说: {} })
  let tagLib = GM_getValue('tagLib', { 漫画: {}, 小说: {} })

  // 获取记录
  let userId = decodeURI(document.cookie).match(/my=(\d+)\|/)[1]
  let record = await xhrSync(`https://interface.dmzj.com/api/getReInfo/${typeSpecific === '漫画' ? 'comic' : 'novel'}/${userId}/0`)
  record = JSON.parse(record.response)
  log(record)

  $('.subjectList>div>input.subjectSearch').on({
    keyup: async e => {
      if (e.keyCode === 13) {
        let keyword = $('.subjectSearch').val()
        $('.subjectList').hide()
        let autoUpdate = await showList(keyword)
        if (autoUpdate) $('#dmzj2bgm').data({ done: true })
      }
    }
  })
  $('.subjectList').off('click').on('click', '.subjectBox', e => {
    if ($(e.target).parents().filter('a').length || $(e.target).is('a')) return
    $('.subjectList').hide()
    $('#dmzj2bgm').data({ result: $(e.currentTarget).attr('name') })
  }).on('click', '.subjectIgnore', e => {
    $('.subjectList').hide()
    $('#dmzj2bgm').data({ result: null })
  })

  for (let i of record) {
    let name = typeSpecific === '漫画' ? i.comic_name : i.novel_name
    let progress = [i.chapter_name, i.volume_name]
    let dmzjId = typeSpecific === '漫画' ? i.comic_id : i.lnovel_id
    $('.subjectList>div>img').attr('src', i.cover)
    $('.subjectList>div>input.subjectSearch').val(name)

    if (typeSpecific === '漫画' && progress[0].match(/第[\d.]+(话|集)/)) {
      progress = [parseInt(progress[0].match(/第(0+|)([\d.]+)(话|集)/)[2]).toString()]
    } else if (typeSpecific === '小说' && progress[1].match(/第[一二三四五六七八九十]+卷/)) {
      let volume = parseZhNumber(progress[1].match(/第([一二三四五六七八九十]+)卷/)[1])
      let chapter = progress[0].match(/第[一二三四五六七八九十]+章/) ? parseZhNumber(progress[0].match(/第([一二三四五六七八九十]+)章/)[1]) : 0
      if (progress[0].match(/^(序|转载)/)) {
        chapter = 1
      }
      if (volume === 1 && chapter === 1) volume = 0
      progress = [chapter, volume]
    } else {
      continue
    }

    $('#dmzj2bgm').removeData().data({
      name: name,
      progress: progress,
      dmzjId: dmzjId
    })

    // 获取标签
    let tags
    if (dmzjId in tagLib[typeSpecific]) {
      tags = tagLib[typeSpecific][dmzjId]
    } else if (type === 1) {
      let dmzjInfo = await xhrSync(`https://v3api.dmzj.com/${typeSpecific === '漫画' ? 'comic' : 'novel'}/${dmzjId}.json`)

      try {
        dmzjInfo = JSON.parse(dmzjInfo.response)
      } catch (error) {
        continue
      }

      tags = dmzjInfo.types.some(i => typeof i === 'string') ? dmzjInfo.types[0].split('/') : dmzjInfo.types.map(i => i.tag_name)
      tags.push(typeSpecific)
    } else {
      tags = [typeSpecific]
    }
    if (typeSpecific === '漫画' && tags.includes('轻小说')) {
      tags.splice(tags.indexOf('轻小说'), 1)
      tags.push('轻改')
    } else if (typeSpecific === '小说') {
      tags.splice(tags.indexOf('小说'), 1)
      tags.push('轻小说')
      if (tags.includes('漫画')) {
        tags.splice(tags.indexOf('漫画'), 1)
        tags.push('漫改')
      }
    }
    tagLib[typeSpecific][dmzjId] = tags
    $('#dmzj2bgm').data({ tags: tags })

    // 如果之前保存过id，则使用之前id
    if (dmzjId in idLib[typeSpecific]) {
      await update(idLib[typeSpecific][dmzjId], dmzjId, progress, tags) // 更新进度
      continue
    }

    let autoUpdate = await showList(name)
    if (!autoUpdate) {
      await new Promise((resolve, reject) => {
        let interval
        interval = setInterval(async () => {
          if ('result' in $('#dmzj2bgm').data()) {
            clearInterval(interval)
            await update($('#dmzj2bgm').data().result)
            resolve()
          } else if ('done' in $('#dmzj2bgm').data()) {
            clearInterval(interval)
            resolve()
          }
        }, 200)
      })
    }

    if ($('#dmzj2bgm').data().result) idLib[typeSpecific][dmzjId] = $('#dmzj2bgm').data().result

    GM_setValue('idLib', idLib)
    GM_setValue('tagLib', tagLib)
  }

  window.alert('任务完成')
}

function addStyle () {
  let style = [
    '#dmzj2bgm{display:none;position:fixed;top:0;width:600px;left:50%;margin-left:-300px;background:#fff;max-height:100%;overflow-y:auto;}',
    '.subjectList{text-align:center;display:none;}',
    '.subjectIgnore{cursor:pointer;float:right;color:red;}',
    '.subjectBox{display:flex;justify-content:center;align-items:center;margin:5px 1px;border:solid 1px black;}',
    '.subjectBox>div:nth-child(2){text-align:justify;}',
    '.subjectList img{width:150px;}',
    '.subjectSearch{width:98%;text-align:center;}'
  ]
  $('<style></style>').text(style.join('')).appendTo('head')
}

async function authorize () {
  let authUrl = 'https://bgm.tv/oauth/authorize?client_id=' + G.appid + '&response_type=code'
  let authPage = window.open(authUrl)
  await new Promise((resolve, reject) => {
    let interval
    interval = setInterval(() => {
      if (authPage.closed) {
        clearInterval(interval)
        resolve()
      }
    })
  })
  let code = window.prompt('请输入code或url')
  if (!code) return window.alert('传入值为空')
  if (code.match(/^https:/)) code = code.match(/code=(.*)$/)[1]
  let res = await xhrSync('https://bgm.tv/oauth/access_token', {
    grant_type: 'authorization_code',
    client_id: G.appid,
    client_secret: G.appkey,
    code: code,
    redirect_uri: G.redirectUri
  })
  if (!res.response) return window.alert('请稍后再次尝试授权')
  let token = JSON.parse(res.response)
  token.expires = new Date().getTime() / 1000 + token['expires_in']
  GM_setValue('token', token)
  window.alert('授权完成')
}

async function delDmzjRecord (id) {
  let tid = $('#record_tid_str').val()
  let uid = $('#u_str').val()
  await xhrSync('https://i.dmzj.com/record/delOne', {
    tid: tid,
    uid: uid,
    id: id,
    signature: unsafeWindow.md5('tid=' + tid + '&uid=' + uid + '&id=' + id)
  }, {
    headers: {
      Referer: 'https://i.dmzj.com/record',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

async function refreshToken () {
  let token = GM_getValue('token')
  let res = await xhrSync('https://bgm.tv/oauth/access_token', {
    grant_type: 'refresh_token',
    client_id: G.appid,
    client_secret: G.appkey,
    refresh_token: token.refresh_token,
    redirect_uri: G.redirectUri
  })
  if (!res.response) {
    await refreshToken()
    return
  }
  token = JSON.parse(res.response)
  token.expires = new Date().getTime() / 1000 + token['expires_in']
  GM_setValue('token', token)
}

async function updateStatus (id, token, progress, tags) { // 更新进度
  // 改变状态为阅读中
  await xhrSync('https://api.bgm.tv/collection/' + id + '/update', {
    action: 'update',
    subject_id: id,
    status: 'do',
    tags: tags
  }, {
    headers: {
      Authorization: 'Bearer ' + token,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
  // 更新进度
  let parms = {
    subject_id: id,
    watched_eps: progress[0]
  }
  if (progress[1] !== undefined) parms['watched_vols'] = progress[1]
  await xhrSync('https://api.bgm.tv/subject/' + id + '/update/watched_eps', parms, {
    headers: {
      Authorization: 'Bearer ' + token,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

function xhrSync (url, parm = null, opt = {}) {
  log({ url, parm, opt })
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: parm ? 'POST' : 'GET',
      url: url,
      data: parm instanceof Object ? Object.keys(parm).map(i => i + '=' + parm[i]).join('&') : parm,
      timeout: opt.timeout || 60 * 1000,
      responseType: ['arraybuffer', 'blob', 'json'].includes(opt.responseType) ? opt.responseType : null,
      headers: opt.headers || {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      onload (res) {
        resolve(res)
      },
      ontimeout (res) {
        reject(res)
      },
      onerror (res) {
        reject(res)
      }
    })
  })
}

function parseZhNumber (text) {
  let number = '一二三四五六七八九'
  let num = 0
  for (let i = 0; i < text.length; i++) {
    let t = text[i]
    if (t === '十' && i === 0) {
      num = 10
    } else if (t === '十' && i !== 0) {
      num = 10 * num
    } else if (number.includes(t)) {
      num = num + number.indexOf(t) + 1
    }
  }
  return num
}

init().then(() => {
  //
}, (err) => {
  console.error(err)
})
