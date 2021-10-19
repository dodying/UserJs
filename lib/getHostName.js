function getHostName(url) { // 获取网址域名
  return (/^http(s|):\/\//.test(url)) ? url.split('/')[2] : url.split('/')[0];
}
