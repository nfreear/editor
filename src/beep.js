/**
 * Source :~ https://odino.org/emit-a-beeping-sound-with-javascript/
 */

const audio = new AudioContext() // browsers limit the number of concurrent audio contexts, so you better re-use'em

export function beep(frequency = 520, duration = 200, volume = 50) {
  console.warn('Beep ~ frequency:', frequency)

  const osc  = audio.createOscillator()
  const gain = audio.createGain()

  osc.connect(gain)
  osc.frequency.value = parseFloat(frequency)
  osc.type = "square"
  gain.connect(audio.destination)
  gain.gain.value = 0.01 * parseFloat(volume)
  osc.start(audio.currentTime)
  osc.stop(audio.currentTime + parseInt(duration) * 0.001)
}
