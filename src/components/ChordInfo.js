import React from 'react';
import { Chord } from '@tonaljs/tonal';
import { ChordInfo as ChordInfoStyles } from '../styles';

export default function ChordInfo({ pressedKeys }) {
  const notes = pressedKeys.map(({note}) => note);
  const chordDetected = Chord.detect(notes);
  return (
    chordDetected ? 
    <ChordInfoStyles>
      <div>
        <span>Chords: 
          {chordDetected.map((chord, index, list) => {
            return ` ${chord}${index < list.length - 1 ? '- ' : ''}`
          })}
        </span>
      </div>
      <div className='keys'>
        <span>Notes:
          {pressedKeys?.map((key, index, list) => {
            const { note } = key;
            return (
              <span key={note} className='note'>
                {` ${note} ${index < list.length - 1 ? '- ' : ''}`}
              </span>
            )
          })}
        </span>
    </div>
    </ChordInfoStyles>
    :
      ''
  )
}
