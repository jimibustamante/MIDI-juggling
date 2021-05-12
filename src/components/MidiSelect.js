import React, { memo, useState } from 'react';
import { MidiSelect as MidiSelectStyles } from '../styles/styles';

function MidiSelect({ MIDIinputs, startAudioContext }) {
  const [value, setValue] = useState('none');
  
  const onChange = ({ target }) => {
    setValue(target.value);
  };
  
  const inputsList = MIDIinputs ? Object.entries(MIDIinputs) : [];
  return (
    <MidiSelectStyles onClick={startAudioContext}>
      <label>Midi inputs: </label>
      <select value={value} onChange={onChange}>
        <option value='none'>none</option>
        {inputsList.map((input) => 
          <option key={input[0]} value={input[0]} >{input[1].name}</option>          
        )}
        {/* {MIDIinputs.map()} */}
      </select>
    </MidiSelectStyles>
  )
}

export default memo(MidiSelect);
