import * as Tone from 'tone';

export const MIDInumberToNote = number => {
  console.log({number})
  return Tone.Frequency(number, "midi").toNote();
}

export const MIDInumberToFrequency = number => {
  return Tone.Midi(number).toFrequency();
}