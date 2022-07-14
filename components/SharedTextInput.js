//1. import all required components
//=================================
import {
  LeftIcon,
  RightIcon,
  StyledTextInput,
  StyledInputLabel
} from './StyledComponents';
import { View,TouchableOpacity } from 'react-native';
import { COLORS } from "./../constants";
import { Octicons, Ionicons, MaterialIcons } from '@expo/vector-icons';

const SharedTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword,createNft,isTime,showTimepicker, ...props }) => {
    return (
      <View>
        <LeftIcon>
          {createNft ? (<MaterialIcons  name={icon} size={30} color={COLORS.brand} />) : (<Octicons name={icon} size={30} color={COLORS.brand} />)}
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
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

        {isTime && (
          <TouchableOpacity onPress={showTimepicker}>
            <StyledTextInput {...props} />
          </TouchableOpacity>
         )}

        {!isTime && <StyledTextInput {...props} />}
      </View>
    );
  };

  export default SharedTextInput;

  