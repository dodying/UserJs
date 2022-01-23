// ==Headers==
// @Name:               常用汉字
// @Description:        常用汉字
// @Version:            1.0.0
// @Author:             dodying
// @Created:            2020-12-02 10:26:16
// @Modified:           2020-12-02 10:26:16
// @Namespace:          https://github.com/dodying/Nodejs
// @SupportURL:         https://github.com/dodying/Nodejs/issues
// @Require:            null
// ==/Headers==

// 设置

// 导入原生模块
const fs = require('fs');

// 导入第三方模块

// Function

// Main
const main = async () => {
  // https://zhs.glyphwiki.org/wiki/GlyphWiki:%E9%AB%98%E5%BA%A6%E3%81%AA%E6%B4%BB%E7%94%A8%E6%96%B9%E6%B3%95
  // http://glyphwiki.org/dump.tar.gz
  // https://zhs.glyphwiki.org/wiki/u6236
  const all = fs.readFileSync('./dump_all_versions.txt', 'utf-8').split(/[\r\n]+/);
  const all1 = all.filter((i) => i.match('^\\s*u(\\w{4})\\\\@\\d+\\s*\\|\\s*u3013\\s*\\|\\s*99:0:0:0:0:200:200:u'));
  const all2 = all.filter((i) => {
    const matched = i.match('^\\s*u(\\w{4})\\\\@\\d+\\s*\\|\\s*u(\\w{4})\\s*\\|');
    return matched && matched[2] !== '3013';
  });
  const often = fs.readFileSync('./常用汉字.txt', 'utf-8').trim().split('');
  const json = {};
  for (const i of often) {
    const charCode = i.charCodeAt(0).toString(16);
    console.log(i, charCode);
    const re1 = `^\\s*u(\\w{4})\\\\@\\d+\\s*\\|\\s*u3013\\s*\\|\\s*99:0:0:0:0:200:200:u${charCode}`; // /^\s*u\w{4}\\@\d+\s*\|\s*u3013\s*\|\s*99:0:0:0:0:200:200:u\w{4}/
    const re2 = `^\\s*u(\\w{4})\\\\@\\d+\\s*\\|\\s*u${charCode}\\s*\\|`;
    const similar = [charCode].concat(
      all1.filter((j) => j.match(re1)).map((j) => j.match(re1)[1]),
      all2.filter((j) => j.match(re2)).map((j) => j.match(re2)[1]),
    );
    json[i] = Array.from(new Set(similar));
  }
  fs.writeFileSync('常用汉字.json', JSON.stringify(json, null, 2));
};

main().then(async () => {
  //
}, async (err) => {
  console.error(err);
  process.exit(1);
});
