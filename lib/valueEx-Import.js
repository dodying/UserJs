/*
Usage:
  Paste these in metadata:
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_registerMenuCommand
// @require     http://127.0.0.1:8080/lib/valueEx-Import.js
*/

(function () {
  'use strict';
  let name = GM_info.script.name + ' v' + GM_info.script.version;
  GM_registerMenuCommand(name + ': Export Value', function () {
    let obj = {};
    GM_listValues().forEach(value => {
      obj[value] = GM_getValue(value);
    });
    let text = JSON.stringify(obj, null, 2);
    let blob = new Blob([text], {
      type: 'text/plain;charset=utf-8'
    });
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name + '.storage.json';
    a.click();
  });

  GM_registerMenuCommand(name + ': Import Value', function () {
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = function () {
      if (!input.files || !input.files.length || !confirm('Continue to IMPORT')) return;
      let fr = new FileReader();
      fr.onload = e => {
        let json = e.target.result;
        try {
          json = JSON.parse(json);
        } catch (error) {
          alert('Import Error: Parse Json Data Error');
          return;
        }
        Object.keys(json).forEach(i => {
          GM_setValue(i, json[i]);
        });
        location = location.href;
      }
      fr.readAsText(input.files[0]);
    }
    input.click();
  });
})();
