// Pre-defines !

// Was: function beep(frequency = 520) { postMessage(`beep(${ frequency })`) }

// https://stackoverflow.com/questions/19168837/web-worker-sleep#

function sleep(milliseconds = 300) { // 'sleep' only safe in a worker!
  const DL = Date.now()
  while (Date.now() < DL + milliseconds) {
    /* no-op. */
  }
}

// Plugins.
