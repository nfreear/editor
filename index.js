/**
 * ( One file for now! )
 */

(async (WIN, DOC, selector, timeoutSec, sourceUri, definesUri) => {
  'use strict';

  const $CTR = DOC.querySelector(selector);
  const $playButton = $CTR.querySelector('.run');
  const $console = $CTR.querySelector('.log');
  const $editor  = $CTR.querySelector('.editor');

  const FUNCTION_REGEX = /^(beep)\((\d*)\)/;

  const response = await fetch(sourceUri)
  const source = await response.text();
  $editor.innerText = source;
  console.debug('Editor source loaded!')

  const definesResp = await fetch(definesUri)
  const defines = await definesResp.text();
  console.debug('Pre-defines loaded!')

  $playButton.addEventListener('click', ev => {
    const code = `${ defines }\n${ $editor.innerText }`;

    console.warn('Code >>', code);

    const codeBlob = new Blob([ code ], { type: 'text/javascript' });

    // convert the blob into a pseudo URL
    const bbURL = URL.createObjectURL(codeBlob);

    let worker = new Worker(bbURL);

    // add a listener for messages from the Worker
    worker.addEventListener('message', ev => {
      const M_CALL = ev.data.match(FUNCTION_REGEX);
      const string = (ev.data).toString();
      console.warn('>>', string);
      $console.append(`${string} \n`);

      if (M_CALL) {
        beep(M_CALL[ 2 ]);
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
    WIN.setTimeout(() => {
      worker.terminate();
      console.warn('Worker terminated!', worker)
      worker = null;
    }, timeoutSec);
  });

  console.debug('Check existence of Worker etc.:', Worker, URL, Blob);

  // https://odino.org/emit-a-beeping-sound-with-javascript/
  const audio = new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

  function beep(freq = 520, vol = 50, duration = 150) {
    console.warn('Beep ~ frequency:', freq)
    const v = audio.createOscillator()
    const u = audio.createGain()
    v.connect(u)
    v.frequency.value = parseFloat(freq)
    v.type = "square"
    u.connect(audio.destination)
    u.gain.value = 0.01 * parseFloat(vol)
    v.start(audio.currentTime)
    v.stop(audio.currentTime + duration * 0.001)
  }

})(window, document, '#editor-wrapper', 10 * 1000, './source.js', './pre-defines.js');
