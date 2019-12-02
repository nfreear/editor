// Pre-defines.

// Was: function beep(frequency = 520) { postMessage(`beep(${ frequency })`) }

// Sleep :~ https://stackoverflow.com/questions/19168837/web-worker-sleep (Only safe in a Worker!)
function sleep(milliseconds = 400) {
  const DL = Date.now()
  while (Date.now() < DL + milliseconds) {
    /* no-op. */
  }
}

// Plugins.
