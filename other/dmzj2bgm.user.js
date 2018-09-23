// ==UserScript==
// @name        dmzj2bgm
// @description 请通过脚本命令来进行授权与数据同步
// @include     https://i.dmzj.com/record
// @include     https://i.dmzj.com/record#*
// @version     1.0.0.1537692308792
// @Date        2018-9-23 16:45:08
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

async function init () {
  addStyle()
  GM_registerMenuCommand('Authorize', authorize)
  GM_registerMenuCommand('dmzj2bgm', main)
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
  let update = async (dmzjId, bgmId, progress, eleToRemove) => {
    await updateStatus(bgmId, token.access_token, progress) // 更新进度
    await delDmzjRecord(dmzjId)
    $(eleToRemove).remove()
  }

  let type
  let typeSpecific = $('.optioned').text()
  if (typeSpecific === '漫画' || typeSpecific === '小说') {
    type = 1
  } else if (typeSpecific === '动画') {
    type = 2
  }

  let idLib = GM_getValue('idLib', {})

  for (let i of $('#my_record_id li').toArray()) {
    let name = $('h3', i).text()
    let progress = $('em', i).text()
    let dmzjId = $('.delOne', i).attr('id').match(/\d+/)[0]
    if (progress.match(/第\d+(话|集)/)) {
      progress = progress.match(/第(0+|)(\d+)(话|集)/)[2]
    } else {
      continue
    }
    if (dmzjId in idLib) {
      await update(dmzjId, idLib[dmzjId], progress, i) // 更新进度
      continue
    }
    let result = await xhrSync('https://api.bgm.tv/search/subject/' + name + '?responseGroup=large')
    if (!result || !result.response) {
      let prompt = window.prompt('无法找到项目，您可以指定搜索关键词', name)
      if (prompt) result = await xhrSync('https://api.bgm.tv/search/subject/' + prompt + '?responseGroup=large')
      if (!result || !result.response) continue
    }
    result = JSON.parse(result.response)
    if (result.code === 404) {
      let prompt = window.prompt('无法找到项目，您可以指定搜索关键词', name)
      if (prompt) result = await xhrSync('https://api.bgm.tv/search/subject/' + prompt + '?responseGroup=large')
      if (!result || !result.response) continue
      result = JSON.parse(result.response)
    }
    if (!result.list) continue
    let list = result.list.filter(i => i.type === type)
    if (!list.length) continue
    let filter = list.filter(i => i.name_cn === name)
    if (filter.length === 1) {
      await update(dmzjId, filter[0].id, progress, i) // 更新进度
      idLib[dmzjId] = filter[0].id
    } else {
      console.log(list)
      let id = await new Promise((resolve, reject) => {
        let container
        container = $('<div class="subjectList"></div>').appendTo('body').on('click', '.subjectBox', e => {
          $(container).remove()
          resolve($(e.currentTarget).attr('name'))
        }).on('click', '.subjectIgnore', e => {
          $(container).remove()
          resolve(null)
        })
        let html = list.map(i => `<li name="${i.id}" class="subjectBox"><div><img src="${i.images.common.replace('http://', 'https://')}"></img><br>${G.SubjectType[i.type]} <a href="${i.url.replace('http://', 'https://')}" target="_blank">${i.name_cn || i.name}</a></div><div>${i.summary.replace(/\n/g, '<br>')}</div></li>`).join('')
        container.html(`<div><img src="${$('img', i).attr('src')}"></img><br><span>${name}</span><span class="subjectIgnore">X</span></div><ol>${html}</ol>`)
      })
      if (id) {
        await update(dmzjId, id, progress, i) // 更新进度
        idLib[dmzjId] = id
      }
    }
  }

  GM_setValue('idLib', idLib)

  window.alert('任务完成')
}

function addStyle () {
  let style = [
    '.subjectList{position:fixed;top:0;width:600px;left:50%;margin-left:-300px;background:#fff;text-align:center;max-height:100%;overflow-y:auto;}',
    '.subjectIgnore{cursor:pointer;float:right;color:red;}',
    '.subjectBox{display:flex;justify-content:center;align-items:center;margin:5px 1px;border:solid 1px black;}',
    '.subjectBox>div:nth-child(2){text-align:justify;}',
    '.subjectList img{width:150px;}'
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

async function updateStatus (id, token, progress) { // 更新进度
  // 改变状态为阅读中
  await xhrSync('https://api.bgm.tv/collection/' + id + '/update', {
    action: 'update',
    subject_id: id,
    status: 'do'
  }, {
    headers: {
      Authorization: 'Bearer ' + token,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
  // 更新进度
  await xhrSync('https://api.bgm.tv/subject/' + id + '/update/watched_eps', {
    subject_id: id,
    watched_eps: progress
  }, {
    headers: {
      Authorization: 'Bearer ' + token,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
}

function xhrSync (url, parm = null, opt = {}) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: parm ? 'POST' : 'GET',
      url: url,
      data: parm instanceof Object ? Object.keys(parm).map(i => i + '=' + parm[i]).join('&') : parm,
      timeout: opt.timeout || 60 * 1000,
      responseType: ['arraybuffer', 'blob', 'json'].includes(opt.responseType) ? opt.responseType : 'text',
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

init().then(() => {
  //
}, (err) => {
  console.error(err)
})
