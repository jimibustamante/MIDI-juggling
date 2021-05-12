import React, { useEffect, useRef, useState } from 'react';
import './styles/App.scss'
import MIDI from './lib/MIDI';
import Piano from './components/Piano';
import MidiSelect from './components/MidiSelect';
import { MIDInumberToNote, MIDInumberToFrequency } from './lib/helpers';
import * as Tone from 'tone';

function App() {
  const MIDIRef = useRef(null);
  const synth = useRef(null);
  const [audioReady, setAudioReady] = useState(false);
  const [pressedKeys, setPressedKey] = useState([]);
  const [MIDIinputs, setMIDIinputs] = useState([]);

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

  const onKeyClicked = (midiNumber, event) => {
    if (audioReady) {
      addKey(midiNumber);
      setTimeout(() => {
        removeKey(midiNumber);
      }, 400);

    } else {
      startAudioContext();
    }
  }

  const onInputsReady = (inputs) => {
    setMIDIinputs(inputs);
  }
  useEffect(() => {
    MIDIRef.current = new MIDI(eventHandler, onInputsReady);
    MIDIRef.current.initialize()
    synth.current = new Tone.PolySynth(Tone.Synth).toDestination();
  }, []);

  const addKey = (MIDInumber) => {
    const note = MIDInumberToNote(MIDInumber);
    const freq = MIDInumberToFrequency(MIDInumber);
    synth.current.triggerAttack(note, Tone.now());
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
    synth.current.triggerRelease(note, Tone.now());
    setPressedKey(currentKeys => {
      if (!currentKeys && !currentKeys.length) return;
      let keys = Object.assign([], currentKeys);
      const index = keys.indexOf(keys.find((key) => key.note === note));
      if (index < 0) return currentKeys;
      keys.splice(index, 1);
      return keys;
    })
  };

  const startAudioContext = () => {
    Tone.start().then(() => {
      setAudioReady(true);
      console.debug('Tone started');
    });
  };

  return (
    <div className='App'>
      <h1>MIDI Juggling</h1>
      {MIDIinputs && (
        <MidiSelect MIDIinputs={MIDIinputs} startAudioContext={startAudioContext} />
      )}
      <Piano pressedKeys={pressedKeys} onKeyClicked={onKeyClicked} />
      <div className='keys'>
        {pressedKeys?.map((key) => {
          const { note } = key;
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
