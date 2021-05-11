import React, { memo, useCallback } from 'react';
import { PianoContainer, PianoKey } from '../styles/styles';
import { MIDInumberToNote } from '../lib/helpers';

// Piano start with A0 which is the lowest MIDI number supported (21), and it finished with C8 (108)
const Piano = ({ pressedKeys, onKeyClicked }) => {
  const isBlackKey = (num) => {
    const mod = num % 12;
    return [1, 4, 6, 9, 11].includes(mod);
  };

  const isKeyPressed = useCallback((midiNumber) => {
    if (!pressedKeys) return;
    const note = MIDInumberToNote(midiNumber);
    const notesPresed = pressedKeys.map(key => key.note);
    return (notesPresed.includes(note));
  }, [pressedKeys]);

  return (
    <PianoContainer>
      { [...Array(108 - 21)].map((i, num) => {
        const midiNumber = num + 21;
        return (
          <PianoKey key={num} onClick={(event) => onKeyClicked(midiNumber, event)} pressed={isKeyPressed(midiNumber)} className={`${isBlackKey(num) ? 'black' : 'white'} ${MIDInumberToNote(midiNumber).slice(0,1)} `}/>
        )
      })}
    </PianoContainer>
  )
}

export default memo(Piano);
