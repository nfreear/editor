/**
 */

(async (WIN, DOC, selector, timeoutSec, sourceUri) => {
  'use strict';

  const $CTR = DOC.querySelector(selector);
  const $playButton = $CTR.querySelector('.run');
  const $console = $CTR.querySelector('.log');
  const $editor  = $CTR.querySelector('.editor');

  const response = await fetch(sourceUri)
  const source = await response.text();
  $editor.innerText = source;
  console.debug('Editor source loaded!')

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
      console.warn('>>', string);
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

})(window, document, '#editor-wrapper', 10 * 1000, './source.js');
