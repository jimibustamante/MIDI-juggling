import React, { useEffect, useRef, useState } from 'react';
import './styles/App.scss'
import MIDI from './lib/MIDI';
import Piano from './components/Piano';
import { MIDInumberToNote, MIDInumberToFrequency } from './lib/helpers';


function App() {
  const MIDIRef = useRef(null);
  const [pressedKeys, setPressedKey] = useState([]);

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

  return (
    <div className="App">
      <h1>MIDI</h1>
      <Piano />
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
    </div>
  );
}

export default App;
