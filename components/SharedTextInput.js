//1. import all required components
//=================================
import {
  LeftIcon,
  RightIcon,
  StyledTextInput,
  StyledInputLabel
} from './StyledComponents';
import { View } from 'react-native';
import { COLORS } from "./../constants";
import { Octicons, Ionicons } from '@expo/vector-icons';

const SharedTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
      <View>
        <LeftIcon>
          <Octicons name={icon} size={30} color={COLORS.brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput {...props} />
        {isPassword && (
          <RightIcon
            onPress={() => {
              //toggle the value of the hide password on press
              setHidePassword(!hidePassword);
            }}
          >
            <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={COLORS.darkLight} />
          </RightIcon>
        )}
      </View>
    );
  };

  export default SharedTextInput;

  