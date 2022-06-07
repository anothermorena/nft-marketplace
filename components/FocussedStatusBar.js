import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/core';

//the props we are passing in are the background color and the height of the status bar
const FocussedStatusBar = (props) => {
    
    const isFocused = useIsFocused(); //gives us the information if the statusbar is focused or not

  return isFocused ? <StatusBar  animated={true} {...props}/> : null;
}

export default FocussedStatusBar;