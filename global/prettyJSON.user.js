/* eslint-env browser */
// ==UserScript==
// @name        []prettyJSON
// @description prettyJSON
// @include     *
// @version     1.1.10
// @modified    2022-03-26 20:15:40
// @author      dodying
// @namespace   https://github.com/dodying/UserJs
// @supportURL  https://github.com/dodying/UserJs/issues
// @icon        https://kgithub.com/dodying/UserJs/raw/master/Logo.png
// @run-at      document-end
// @grant       none
// @noframes
// ==/UserScript==
(function () {
  try {
    let text = document.body.textContent;
    let jsonp = null;
    if (text.match(/^([a-z0-9$_]+)\((.*)\)$/i)) [, jsonp, text] = text.match(/^([a-z0-9$_]+)\((.*)\)$/i);
    /* eslint-disable no-eval */
    const json = jsonp ? window.eval(text) : JSON.parse(text);
    /* eslint-enable no-eval */
    if (typeof json !== 'object') return;
    console.log(json);
    window.$json = json;
    if (JSON.stringify(json) === '{}') return;

    text = JSON.stringify(json, null, 2);
    if (jsonp) text = `${jsonp}(${text})`;
    const arr = text.split(/\n/);
    const pretty = document.createElement('div');
    pretty.classList.add('pretty');
    for (let i = 0; i < arr.length; i++) {
      const elem = document.createElement('p');
      elem.setAttribute('order', i + 1);

      const textThis = arr[i];
      const arrThis = textThis.split(/(\s)/);
      for (let j = 0; j < arrThis.length; j++) {
        if (arrThis[j].match(/^(.*?)(https?:\/\/.*?)(["'].*?)$/)) {
          const matched = arrThis[j].match(/^(.*?)(https?:\/\/.*?)(["'].*?)$/);

          elem.appendChild(document.createTextNode(matched[1]));

          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('href', matched[2]);
          a.textContent = matched[2];
          elem.appendChild(a);

          elem.appendChild(document.createTextNode(matched[3]));
        // } else if (arrThis[j].match(/\s/)) {
        //   const span = document.createElement('span');
        //   span.classList.add('white');
        //   elem.appendChild(span);
        } else {
          elem.appendChild(document.createTextNode(arrThis[j]));
        }
      }
      pretty.appendChild(elem);
    }

    // const raw = document.createElement('div');
    // raw.classList.add('raw');
    // raw.textContent = text;

    const style = document.createElement('style');
    style.textContent = [
      'body{}',
      'body>div{white-space:pre-wrap;word-break:break-word;font-family:Consolas,Monaco,monospace;}',
      'body>div.pretty>p{margin:0;}',
      `body>div.pretty>p::before{content:attr(order);width:${arr.length.toString().length * 12}px;display:inline-block;border-right:solid #000 1px;margin-right:4px;}`,
      'body>div.pretty>p .white::before{content:"·";}',
      'body>div.raw{display:none;}',

      'body{background-color:#ffffff;color:#000000;}',
      'body>div.pretty>p::before{color:#237893;}',
      'body>div.pretty>p .white::before{color: #3333;}',

      '@media (prefers-color-scheme:dark) {',
      '  body{background-color:#1e1e1e;color:#d4d4d4;}',
      '  body>div.pretty>p::before{color:#858585;}',
      '  body>div.pretty>p .white::before{color:#e3e4e229;}',
      '}',
    ].join('');
    document.head.appendChild(style);

    document.body.innerHTML = '';
    document.body.appendChild(pretty);
    // document.body.appendChild(raw);

    // document.body.addEventListener('dblclick', e => {
    //   if (e.target === raw) {
    //     raw.style.display = 'none';
    //     pretty.style.display = 'block';
    //   } else {
    //     pretty.style.display = 'none';
    //     raw.style.display = 'block';
    //   }
    // });
  } catch (error) {
    // console.log(error);
  }
}());
