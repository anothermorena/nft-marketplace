import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {useFonts } from 'expo-font';
import Home from './screens/Home';
import Details from './screens/Details';
import Signup from './screens/Signup';
import Verification from './screens/OtpVerificationMsg';


const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  }
}

const App = () => {
  //load the fonts we will be using and all other assets our app will use
  const [loaded] = useFonts({
    InterBold: require("./assets/fonts/Inter-Bold.ttf"),
    InterSemiBold: require("./assets/fonts/Inter-SemiBold.ttf"),
    InterMedium: require("./assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("./assets/fonts/Inter-Regular.ttf"),
    InterLight: require("./assets/fonts/Inter-Light.ttf"),
  });

  if (!loaded) return null;
  
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{headerShown:false}} initialRouteName="Signup">
        <Stack.Screen name="Home" component={Home}/>
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="Verification" component={Verification}/>
        <Stack.Screen name="Details" component={Details}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default  App;
