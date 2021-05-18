import styled from 'styled-components';

export const defaultTheme = {
  mainColor: '#FFFFFF',
  secondaryColor: '#D0A39B',
  thirdColor: '#97726F',
  darkColor: '#362A2D',
}

const standardPadding = '1rem 2rem';

export const App = styled.div`
  background-color: ${defaultTheme.mainColor};
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 2rem;
  box-sizing: border-box;
`;

export const Main = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
`;

export const ChordInfo = styled.div`
  padding: ${standardPadding};
  .keys {
    padding: 5px 0;
    align-items: center;
    .note {
    }
  }
`;

export const Title = styled.h1`
  color: ${props => props.theme.darkColor};
`;

export const PianoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-x: scroll;
  padding: ${standardPadding};
  --white-width: 1.6rem;
  --black-width: 1.2rem;
  > * {
    flex-shrink: 0;
    box-sizing: border-box;
    &.B, &.D:not(.black), &.E:not(.black), &.G:not(.black), &.A:not(.black) {
      margin-left: calc(var(--black-width) * -1);
    }
    &:first-child {
      margin-left: 0 !important;
    }
  }
  .white {
    width: var(--white-width);
    height: 8rem;
    border-left:1px solid #bbb;
    border-bottom:1px solid #bbb;
    border-radius:0 0 5px 5px;
    box-shadow:-1px 0 0 rgba(255,255,255,0.8) inset,0 0 5px #ccc inset,0 0 3px rgba(0,0,0,0.2);
    background:linear-gradient(to bottom,#eee 0%,#fff 100%)
  }
  .black {
    width: var(--black-width);
    height: 5rem;
    background-color: black;
    z-index: 10;
    transform: translateX(-50%);
    border:1px solid #000;
    border-radius:0 0 3px 3px;
    box-shadow:-1px -1px 2px rgba(255,255,255,0.2) inset,0 -5px 2px 3px rgba(0,0,0,0.6) inset,0 2px 4px rgba(0,0,0,0.5);
    background:linear-gradient(45deg,#222 0%,#555 100%)
  }
`;

export const PianoKey = styled.div`
  ${props => {
    if (props.pressed) {
      return (
        `background: ${props.theme.secondaryColor} !important;`
      )
    }
  }}
`;

export const MidiSelect = styled.div`
  
`;