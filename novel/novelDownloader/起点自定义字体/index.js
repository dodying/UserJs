const fs = require('fs');
const opentype = require('./opentype');

const fontRaw = opentype.loadSync('./raw.ttf');
const lib = [];
for (const i in fontRaw.glyphs.glyphs) {
  lib.push({
    // raw: fontRaw.glyphs.glyphs[i],
    unicode: String.fromCharCode(fontRaw.glyphs.glyphs[i].unicode).normalize('NFKD'),
    path: fontRaw.glyphs.glyphs[i].path.toPathData(),
  });
}
fs.writeFileSync('raw.json', JSON.stringify(lib, null, 2));

const font = opentype.loadSync('./cutted.ttf');
const libCutted = [];
for (const i in font.glyphs.glyphs) {
  const data = font.glyphs.glyphs[i].path.toPathData();

  const key = lib.filter((i) => i.path === data);
  libCutted.push({
    unicode: key.length ? key[0].unicode : i,
    path: data,
  });
}
fs.writeFileSync('cutted.json', JSON.stringify(libCutted, null, 2));

let often = fs.readFileSync('./常用汉字.json', 'utf-8');
often = JSON.parse(often);
// FIX
often['\u0000'] = ['0000'];
often['户'].push('6236'); // 戶
// FIX
const libOften = [];
for (const i in often) {
  const key = lib.filter((j) => often[i].map((k) => String.fromCharCode(parseInt(k, 16))).includes(j.unicode));
  if (key.length) libOften.push(...key);
  if (!key.length) {
    console.log(i);
  }
}
fs.writeFileSync('often.json', JSON.stringify([...new Set(libOften)], null, 2));
