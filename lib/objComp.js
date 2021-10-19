function objComp(obj1, obj2) { // js对象的比较，来自http://www.jb51.net/article/26372.htm
  if (obj1 == obj2) { return true; }
  if (typeof (obj2) === 'undefined' || obj2 == null || typeof (obj2) !== 'object') { return false; }
  let length = 0;
  let length1 = 0;
  for (var ele in obj1) {
    length++;
  }
  for (var ele in obj2) {
    length1++;
  }
  if (length != length1) { return false; }
  if (obj2.constructor == obj1.constructor) {
    for (var ele in obj1) {
      if (typeof (obj1[ele]) === 'object') {
        if (!objComp(obj1[ele], obj2[ele])) { return false; }
      } else if (typeof (obj1[ele]) === 'function') {
        if (!objComp(obj1[ele].toString(), obj2[ele].toString())) { return false; }
      } else if (obj1[ele] != obj2[ele]) { return false; }
    }
    return true;
  }
  return false;
}
