import React, { useEffect, useRef, useState } from 'react';
import MIDI from './lib/MIDI';
import Piano from './components/Piano';
import ChordInfo from './components/ChordInfo';
import MidiSelect from './components/MidiSelect';
import { MIDInumberToNote, MIDInumberToFrequency } from './lib/helpers';
import { ThemeProvider } from 'styled-components';
import { App as AppStyle, Main, defaultTheme, Title as TitleStyle } from './styles';
import * as Tone from 'tone';

function App() {
  const MIDIRef = useRef(null);
  const player = useRef(null);
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
    MIDIRef.current.initialize();
    player.current = new Tone.Player()
    synth.current = new Tone.PolySynth(Tone.FMSynth).toDestination();
    synth.current.volume.value = -15;
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
    <ThemeProvider theme={defaultTheme}>
      <AppStyle className='App'>
        <Main>
          <TitleStyle>MIDI Juggling</TitleStyle>
          {MIDIinputs && (
            <MidiSelect MIDIinputs={MIDIinputs} startAudioContext={startAudioContext} />
          )}
          <Piano pressedKeys={pressedKeys} onKeyClicked={onKeyClicked} />
        </Main>
        <ChordInfo pressedKeys={pressedKeys} />
      </AppStyle>
    </ThemeProvider>
  );
}

export default App;
