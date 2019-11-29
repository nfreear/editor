/**
 * Source :~ https://odino.org/emit-a-beeping-sound-with-javascript/
 */

const audio = new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

export default function(freq = 520, vol = 50, duration = 150) {
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
