/**
 * A live-editor for Scribbletune.
 */

import { LiveEditor } from '../index.js';

const Tone = window.Tone;
const scribble = window.scribble;
const $stopButton = document.querySelector('#stopBtn');

console.warn('----> Tone.js / Scribbletune:', Tone, scribble)

const editor = new LiveEditor({
  sourceJs: './scribbletune-source.js',
  // timeout: 20 * 1000,
  callbacks: { start, },
  plugins: { stclip }
})

editor.run()

function start(ev) {
  console.warn('Tone.Transport.start()', ev)

  Tone.Transport.start()
}

$stopButton.addEventListener('click', ev => {
  console.warn('Tone.Transport.stop()', ev)

  Tone.Transport.stop()
})

function stclip(options) {
  options = JSON.parse(options)
  console.warn('scribbletune.clip({}):', typeof options, options)

  const clip = scribble.clip(options)

  console.warn('scribbletune.clip({}) 2:', options, clip)

  clip.start()
}
