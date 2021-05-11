import React, { memo } from 'react';
import { PianoContainer } from '../styles/styles';
import { MIDInumberToNote } from '../lib/helpers';

// Piano start with A0 which is the lowest MIDI number supported (21), and it finished with C8 (108)
const Piano = ({ pressedKeys }) => {
  const isBlackKey = (num) => {
    const mod = num % 12;
    return [1, 4, 6, 9, 11].includes(mod);
  };

  const isKeyPressed = (midiNumber) => {
    const note = MIDInumberToNote(midiNumber);
    const notesPresed = pressedKeys.map(key => key.note);
    console.log({note, notesPresed});
    return (notesPresed.includes(note));
  };

  console.log({pressedKeys})
  return (
    <PianoContainer>
      { [...Array(108 - 21)].map((i, num) => {
        const midiNumber = num + 21;
        return (
          <div key={num} className={`${isBlackKey(num) ? 'black' : 'white'} ${MIDInumberToNote(midiNumber).slice(0,1)} ${isKeyPressed(midiNumber) ? 'pressed' : ''}`}/>
        )
      })}
    </PianoContainer>
  )
}

export default memo(Piano);
