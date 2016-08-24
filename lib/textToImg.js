function textToImg(txt, size, weight, color) {
  var len = 0;
  var txtArray = txt.split('\n');
  var i;
  for (i = 0; i < txtArray.length; i++) {
    if (len < txtArray[i].length) len = txtArray[i].length;
  }
  if (txtArray.length === 1) txtArray.push('');
  i = 0;
  var fontSize = size;
  var canvas = document.createElement('canvas');
  canvas.width = fontSize * len;
  canvas.height = fontSize * (txtArray.length - 1) + (fontSize / 2);
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = color;
  context.font = weight + ' ' + fontSize + 'px sans-serif';
  context.textBaseline = 'top';
  canvas.style.display = 'none';
  for (var j = 0; j < txtArray.length; j++) {
    context.fillText(txtArray[j], 0, (fontSize / 4 + fontSize * i), canvas.width);
    context.fillText('\n', 0, (fontSize / 4 + fontSize * i++), canvas.width);
  }
  return canvas.toDataURL('image/png');
}