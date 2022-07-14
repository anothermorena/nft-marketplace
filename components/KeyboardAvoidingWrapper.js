//1. import all requred constants and components
//==============================================
import { COLORS} from "./../constants";
import { KeyboardAvoidingView, Keyboard, ScrollView, TouchableWithoutFeedback } from 'react-native';

const KeyboardAvoidingWrapper = ({ children }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{children}</TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingWrapper;