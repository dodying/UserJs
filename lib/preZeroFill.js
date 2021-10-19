/* eslint-env browser */
function preZeroFill(num, size) { // 用0补足指定位数，来自https://segmentfault.com/q/1010000002607221，作者：captainblue与solar
  if (num >= Math.pow(10, size)) { // 如果num本身位数不小于size位
    return num.toString();
  }
  const _str = Array(size + 1).join('0') + num;
  return _str.slice(_str.length - size);
}
