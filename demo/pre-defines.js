// Pre-defines !

function beep(freq = 520) {
  postMessage(`beep(${ freq })`)
}

// https://stackoverflow.com/questions/19168837/web-worker-sleep#

function sleep(ms = 300) {
  const DL = Date.now()
  while (Date.now() < DL + ms) {
    /* no-op. */
  }
};

// ----------------------------------------------
