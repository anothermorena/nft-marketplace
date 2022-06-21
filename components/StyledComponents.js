import styled from 'styled-components';
import { COLORS } from '../constants';


export const CodeInput = styled.View`
  border-color: ${COLORS.lightGreen};
  min-width: 15%;
  border-width: 2px;
  border-radius: 5px;
  padding: 12px;
`;

//when a particular digit is focussed we want to apply the following styles
export const CodeInputFocused = styled(CodeInput)`
  border-color: ${COLORS.green};
`;
