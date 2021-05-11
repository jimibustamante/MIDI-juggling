import MIDIEvent from './MIDIEvent';

class MIDI {
  constructor(onEvent = () => {}) {
    this.inputs = {};
    this.outputs = {};
    this.onEvent = onEvent;
  }

  async initialize () {
    try {
      console.debug('initialize MIDI')
      const access = await navigator.requestMIDIAccess();
      if (!access) throw new Error();
      const inputs = access.inputs.values();
      const outputs = access.outputs.values();
      for (const input of inputs) this.initializeInput(input);
      for (const output of outputs) this.initializeOutput(output);
      access.onstatechange = ({ port }) => {
        const { type, state } = port;
        if (type === 'input') {
          if (state === 'connected') {
            this.initializeInput(port);
          } else {
            this.teardownInput(port);
          }
        }
        if (type === 'output') {
          if (state === 'connected') {
            this.initializeOutput(port);
          } else {
            this.teardownOutput(port);
          }
        }

      }
    } catch (error) {
      console.error({error})
      alert("You don't have access to MIDI :( You may try another browser instead")
    }
  }

  initializeInput(input) {
    this.sendEvent(input);
    this.inputs[input.id] =input;
    input.onmidimessage = ({ data }) => {
      this.sendEvent(input, data);
    }
    // input.addEventListener('midimessage', ({ data }) => {
    //   this.sendEvent(input, data);
    // })
  }

  initializeOutput(output) {
    this.outputs[output.id] = output;
    this.sendEvent(output);
  }

  teardownInput(input) {
    if (!this.inputs[input.id]) return;
    delete this.inputs[input.id];
  }

  teardownOutput(output) {
    if (!this.outputs[output.id]) return;
    delete this.outputs[output.id];    
  }

  sendEvent(device, data) {
    this.onEvent(new MIDIEvent(device, data))
  }
}
export default MIDI;
