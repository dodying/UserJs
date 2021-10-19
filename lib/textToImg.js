/* eslint-env browser */
function textToImg(txt, size, weight, color) {
  let len = 0;
  const txtArray = txt.split('\n');
  let i;
  for (i = 0; i < txtArray.length; i++) {
    if (len < txtArray[i].length) len = txtArray[i].length;
  }
  if (txtArray.length === 1) txtArray.push('');
  i = 0;
  const fontSize = size;
  const canvas = document.createElement('canvas');
  canvas.width = fontSize * len;
  canvas.height = fontSize * (txtArray.length - 1) + (fontSize / 2);
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = `${weight} ${fontSize}px sans-serif`;
  context.textBaseline = 'top';
  canvas.style.display = 'none';
  for (let j = 0; j < txtArray.length; j++) {
    context.fillText(txtArray[j], 0, (fontSize / 4 + fontSize * i), canvas.width);
    context.fillText('\n', 0, (fontSize / 4 + fontSize * i++), canvas.width);
  }
  return canvas.toDataURL('image/png');
}
