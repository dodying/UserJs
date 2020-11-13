const opentype = require('./opentype');

const fontRaw = opentype.loadSync('raw.ttf');
const lib = [];
for (const i in fontRaw.glyphs.glyphs) {
  lib.push({
    // raw: fontRaw.glyphs.glyphs[i],
    unicode: String.fromCharCode(fontRaw.glyphs.glyphs[i].unicode),
    path: fontRaw.glyphs.glyphs[i].path.toPathData()
  });
}
require('fs').writeFileSync('raw.json', JSON.stringify(lib, null, 2));

const font = opentype.loadSync('cutted.ttf');
const obj = [];
for (const i in font.glyphs.glyphs) {
  const data = font.glyphs.glyphs[i].path.toPathData();

  const key = lib.filter(i => i.path === data);
  obj.push({
    unicode: key.length ? key[0].unicode : i,
    path: data
  });
}
require('fs').writeFileSync('cutted.json', JSON.stringify(obj, null, 2));
