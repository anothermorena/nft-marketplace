import {useState, useEffect, useCallback} from 'react';

import { View } from 'react-native';

//react navigation stack
import RootStack from './navigators/RootStack';

//app loading
import * as SplashScreen from 'expo-splash-screen';

//expo secure local storage.
import * as SecureStore from 'expo-secure-store';

//credentials context
import { CredentialsContext } from './components/CredentialsContext';

export default function App() {
  //check if the app is ready using this state. Initial is false
  //this is to monitor our app readiness
  const [appIsReady, setAppIsReady] = useState(false);

  const [storedCredentials, setStoredCredentials] = useState(""); 
 
  //check if user is authenticated
  const checkLoginCredentials = async () => {
    await SecureStore.getItemAsync('nftMarketPlace')
      .then((result) => {
        if (result !== null) {
          //set the result as our stored credentials
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };

  //if the app is not ready, return the app loading splash screen
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // check if user has stored login credentials in local storage
        checkLoginCredentials();
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {/*
      
        //to able to pass the values that are stored with context we make use of the provider that comes with context
        //once the above is done we can then set the initial values of the context 

      */}
      <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
        <RootStack />
      </CredentialsContext.Provider>
    </View>
 
  );
}


