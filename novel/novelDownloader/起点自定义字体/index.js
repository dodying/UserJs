const opentype = require('./opentype');
const fs = require('fs');

const fontRaw = opentype.loadSync('./raw.ttf');
const lib = [];
for (const i in fontRaw.glyphs.glyphs) {
  lib.push({
    // raw: fontRaw.glyphs.glyphs[i],
    unicode: String.fromCharCode(fontRaw.glyphs.glyphs[i].unicode).normalize('NFKD'),
    path: fontRaw.glyphs.glyphs[i].path.toPathData()
  });
}
fs.writeFileSync('raw.json', JSON.stringify(lib, null, 2));

const font = opentype.loadSync('./cutted.ttf');
const libCutted = [];
for (const i in font.glyphs.glyphs) {
  const data = font.glyphs.glyphs[i].path.toPathData();

  const key = lib.filter(i => i.path === data);
  libCutted.push({
    unicode: key.length ? key[0].unicode : i,
    path: data
  });
}
fs.writeFileSync('cutted.json', JSON.stringify(libCutted, null, 2));

let often = fs.readFileSync('./常用汉字.txt', 'utf-8').trim().split('');
// https://zhs.glyphwiki.org/wiki/u2e92
often = often.concat('⺒⻔⻜⻢戶⻅⻉⻋⻓⻙⻛⺠⻦⻰⻚⻬⻧⻨⻁⻘⻥⻮⻝⻤⻩'.split(''), libCutted.map(i => i.unicode));
often = new Set(often);
const libOften = [];
for (const i of often) {
  const key = lib.find(j => j.unicode === i);
  if (key) libOften.push(key);
  if (!key) {
    console.log(i);
  }
}
fs.writeFileSync('often.json', JSON.stringify(libOften, null, 2));
