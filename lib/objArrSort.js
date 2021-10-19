/* eslint-env browser */
function objArrSort(propertyName) { // 对象数组排序函数，从小到大排序，来自http://www.jb51.net/article/24536.htm
  return function (object1, object2) {
    const value1 = object1[propertyName];
    const value2 = object2[propertyName];
    if (value2 < value1) {
      return 1;
    } if (value2 > value1) {
      return -1;
    }
    return 0;
  };
}
