import {useFonts } from 'expo-font';
//colors
import { COLORS } from "./../constants";

// React Navigation
import {createStackNavigator} from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

// screens
import Home from './../screens/Home';
import Details from './../screens/Details';
import Signup from './../screens/Signup';
import Login from './../screens/Login';
import ResetPasswordRequest from './../screens/ResetPasswordRequest';
import Verification from './../screens/OtpVerificationMsg';
import OtpVerificationInput from './../screens/OtpVerificationInput';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    backgroundColor: 'red'
  }
}


// credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const RootStack = () => {
   //load the fonts we will be using and all other assets our app will use
   const [loaded] = useFonts({
    InterBold: require("./../assets/fonts/Inter-Bold.ttf"),
    InterSemiBold: require("./../assets/fonts/Inter-SemiBold.ttf"),
    InterMedium: require("./../assets/fonts/Inter-Medium.ttf"),
    InterRegular: require("./../assets/fonts/Inter-Regular.ttf"),
    InterLight: require("./../assets/fonts/Inter-Light.ttf"),
  });

  if (!loaded) return null;

  return (
    //to access the values of a context we need to create a consumer for that context
    //we wrap the navigation container in the context consumer
    //but unlike a provider, the child of the consumer should be a function
    <CredentialsContext.Consumer>
    {({ storedCredentials }) => (
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTintColor: COLORS.tertiary,
            headerTransparent: true,
            headerTitle: '',
            headerLeftContainerStyle: {
              paddingLeft: 20,
            },
          }}
          initialRouteName="Login"
        >
          {storedCredentials ? (
            <Stack.Screen
              options={{
                headerTintColor: COLORS.primary,
              }}
              name="ResetPasswordRequest"
              component={ResetPasswordRequest}
            />
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
              <Stack.Screen name="ResetPasswordRequest" component={ResetPasswordRequest} />
              <Stack.Screen name="Details" component={Details}/>
              <Stack.Screen name="Verification" component={Verification}/>
              <Stack.Screen name="OtpVerificationInput" component={OtpVerificationInput}/>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    )}
  </CredentialsContext.Consumer>
  
  );
};

export default RootStack;