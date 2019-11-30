/**
 * The live-editor, implmented as an ES6 module.
 */

import * as config from './src/defaults.js';

async function loadEditor(options = {}) {
  const CFG = { ...config.default, ...options }; // Merge!

  console.warn('Editor config:', CFG)

  const $FORM = document.querySelector(CFG.selector);
  // const $playButton = $FORM.querySelector('.run');
  const $console = $FORM.querySelector('.log');
  const $editor  = $FORM.querySelector('.editor');

  const response = await fetch(CFG.sourceJs)
  const source = await response.text();
  $editor.innerText = source;
  console.debug('Editor source loaded!')

  // Inject plugin dispatchers.
  for (const fnName in CFG.plugins) {
    CFG.pluginsCode.push('function ' + fnName + '(p){postMessage(`' + fnName + '(${p})`)}');
  }

  const definesResp = await fetch(CFG.preDefinesJs)
  const defines = await definesResp.text();
  console.debug('Pre-defines loaded!')

  $FORM.addEventListener('submit', ev => {
    ev.preventDefault();

    const code = `${ defines }${ CFG.pluginsCode.join('\n') }\n\n${ $editor.innerText }`;

    console.debug('>>>> The code >>>>\n', code);

    const codeBlob = new Blob([ code ], { type: 'text/javascript' });

    // convert the blob into a pseudo URL
    const bbURL = URL.createObjectURL(codeBlob);

    let worker = new Worker(bbURL);

    // add a listener for messages from the Worker
    worker.addEventListener('message', ev => {
      const M_CALL = ev.data.match(CFG.pluginsRegex);
      const string = (ev.data).toString();
      console.warn('>>', string);
      $console.append(`${string} \n`);

      if (M_CALL) {
        const FUNC  = M_CALL[ 1 ];
        const PARAM = M_CALL[ 2 ] === 'undefined' ? undefined : M_CALL[ 2 ];
        console.debug('Plugin:', M_CALL);

        CFG.plugins[ FUNC ]( PARAM );
      }
    });

    // add a listener for errors from the Worker
    worker.addEventListener('error', er => {
      const string = (er.message).toString();
      $console.append(`ERROR: ${string} \n`);
    });

    // Finally, actually start the worker
    worker.postMessage('start');

    // Put a timeout on the worker to automatically kill the worker
    window.setTimeout(() => {
      worker.terminate();
      console.warn('Worker terminated!', worker)
      worker = null;
    }, CFG.timeout);
  });

  console.debug('Check existence of Worker etc.:', Worker, URL, Blob);
}

// Optional auto-loading.
if (document.querySelector('script[ data-load-editor ]')) {
  loadEditor();
}

export default loadEditor;
