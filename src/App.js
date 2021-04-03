import React, { useEffect, useRef, useState, useCallback } from 'react';
import MIDI from './lib/MIDI';
import './App.scss';
import { MIDInumberToNote, MIDInumberToFrequency } from './lib/helpers';

const playSound = () => {
  const audioContext = new window.AudioContext({
    latencyHint: 'interactive',
    sampleRate: 44100,
  });
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); 
  oscillator.connect(audioContext.destination);
  const gainNode = audioContext.createGain();
  // console.log({audioContext, oscillator, gainNode});
}

function App() {
  const MIDIRef = useRef(null);
  const [pressedKeys, setPressedKey] = useState([]);

  useEffect(() => {
    MIDIRef.current = new MIDI(eventHandler);
    MIDIRef.current.initialize();
  }, []);

  const addKey = (MIDInumber) => {
    const note = MIDInumberToNote(MIDInumber);
    const freq = MIDInumberToFrequency(MIDInumber);
    setPressedKey(currentKeys => {
      let keys = Object.assign([], currentKeys);
      if (currentKeys.find(key => key.note === note)) return currentKeys;
      keys.push({note, freq});
      keys = keys.sort((a,b) => {
        if (a.freq > b.freq) {
          return 1;
        };
        if (a.freq < b.freq) {
          return -1;
        }
        return 0;
      });
      return keys;
    });
  };

  const removeKey = (MIDInumber) => {
    const note = MIDInumberToNote(MIDInumber);
    setPressedKey(currentKeys => {
      if (!currentKeys.length) return;
      let keys = Object.assign([], currentKeys);
      const index = keys.indexOf(keys.find((key) => key.note === note));
      if (index < 0) return currentKeys;
      keys.splice(index, 1);
      return keys;
    })
  };

  const eventHandler = ({ device, a, b, type }) => {
    if (type === 'note_on') {
      const { value: MIDInumber } = a;
      addKey(MIDInumber);
    }
    if (type === 'note_off') {
      const { value: MIDInumber } = a;
      removeKey(MIDInumber);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <h1>MIDI</h1>
        <div className='keys'>
          {pressedKeys.map((key) => {
            const { note, freq } = key;
            return (
              <div key={note} className='note'>
                {note}
              </div>
            )
          })}
        </div>
      </header>
    </div>
  );
}

export default App;
