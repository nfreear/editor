/**
 */

((WIN, DOC, selButton, selEditor, selConsole, timeoutSec) => {
  'use strict';

  const $playButton = DOC.querySelector(selButton);
  const $console = DOC.querySelector(selConsole);
  const $editor  = DOC.querySelector(selEditor);

  $playButton.addEventListener('click', ev => {
    const code = $editor.innerText;

    console.warn('Code >>', code);

    const codeBlob = new Blob([ code ], { type: 'text/javascript' });

    // convert the blob into a pseudo URL
    const bbURL = URL.createObjectURL(codeBlob);

    let worker = new Worker(bbURL);

    // add a listener for messages from the Worker
    worker.addEventListener('message', ev => {
      const string = (ev.data).toString();
      $console.append(`${string} \n`);
    });

    // add a listener for errors from the Worker
    worker.addEventListener('error', er => {
      const string = (er.message).toString();
      $console.append(`ERROR: ${string} \n`);
    });

    // Finally, actually start the worker
    worker.postMessage('start');

    // Put a timeout on the worker to automatically kill the worker
    WIN.setTimeout(() => {
      worker.terminate();
      console.warn('Worker terminated!', worker)
      worker = null;
    }, timeoutSec);
  });

  console.debug('Check existence of Worker etc.:', Worker, URL, Blob);

})(window, document, '#run', '#editor', '#console', 10 * 1000);
