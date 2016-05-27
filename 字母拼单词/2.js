function main(ab_all) {
  if (/[^a-z]/.test(ab_all) || ab_all === '') return;
  //var ab_all = prompt('');
  ab_all = ab_all.toLowerCase();
  var ab = ab_all.split('');
  var ab_re = new Object();
  var word_out = new Array();
  ab_re['old'] = ab_all;
  ab_re['length'] = ab.length;
  for (var i = 0; i < ab.length; i++) {
    ab_re[i.toString(ab.length).toUpperCase()] = ab[i];
  }
  for (var i = 0; i < word_lib.length; i++) {
    var word_lib_ab = word_lib[i];
    //console.log(word_lib_ab);
    for (var j = 0; j < word_lib_ab.length; j++) {
      word_lib_ab[j] = word_lib_ab[j].toLowerCase();
      for (var k = 0; k < ab_re['length']; k++) {
        k2=k.toString(ab.length).toUpperCase();
        word_lib_ab[j] = word_lib_ab[j].replace(ab_re[k2], k2);
      }
      IsNum(word_lib_ab[j]);
    }
  }
  //console.log(ab_re);
  //console.log(word_lib);
  //console.log(word_out);
  for (var i = 0; i < word_out.length; i++) {
    for (var j = 0; j < ab_re['length']; j++) {
      j2 = j.toString(ab.length).toUpperCase();
      var re = new RegExp(j2, 'g');
      word_out[i] = word_out[i].replace(re, ab_re[j2]);
    }
  }
  //console.log(word_out);
  return word_out;
  function IsNum(word) {
    word = word.toString();
    if (/[a-z]/.test(word)) return;
    word_out.push(word);
  }
}
