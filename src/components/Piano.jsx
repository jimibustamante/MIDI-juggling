import React from 'react';
import { PianoContainer } from '../styles/styles';
import { MIDInumberToNote } from '../lib/helpers';

// Piano start with A0 which is the lowest MIDI number supported (21), and it finished with C8 (108)
const Piano = () => {
  const isBlackKey = (num) => {
    const mod = num % 12;
    return [1, 4, 6, 9, 11].includes(mod);
  };
  return (
    <PianoContainer>
      { [...Array(108 - 21)].map((i, num) => {
          const midiNumber = num + 21;
          console.log({midiNumber})
          return (
            <div className={`${isBlackKey(num) ? 'black' : 'white'} ${MIDInumberToNote(midiNumber).slice(0,1)}`}/>
          )
        })
      }
    </PianoContainer>
  )
}

export default Piano;
