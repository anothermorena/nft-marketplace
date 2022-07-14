//1. import all requred hook and component
import { StatusBar } from 'react-native';
import { useIsFocused } from '@react-navigation/core';

//pass background color and the height of the status bar as props
const FocussedStatusBar = (props) => {

    const isFocused = useIsFocused(); //is statusbar is focused or not

  return isFocused ? <StatusBar  animated={true} {...props}/> : null;
}

export default FocussedStatusBar;