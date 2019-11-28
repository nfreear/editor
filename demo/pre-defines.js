// Pre-defines!'

function beep(freq = 520) {
  postMessage(`beep(${ freq })`)
}

function sleep(ms = 300) {
  const DL = Date.now()
  while (Date.now() < DL + ms) { /*noop*/ }
};
