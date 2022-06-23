import {useState} from 'react';

//react navigation stack
import RootStack from './navigators/RootStack';

//app loading
import AppLoading  from 'expo-app-loading';


//expo secure local storage.
import * as SecureStore from 'expo-secure-store';

//credentials context
import { CredentialsContext } from './components/CredentialsContext';

export default function App() {
  //check if the app is ready using this state. Initial is false
  //this is to monitor our app readiness
  const [appReady, setAppReady] = useState(false);

  const [storedCredentials, setStoredCredentials] = useState("");
  
 
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

  //if the app is not ready, return the app loading component
  if (!appReady) {
    //startAsync takes a function which runs when our app is opened
    //onFinish is a function which runs when the app is ready 
    //if there is an error,the onError function is called to create a new error/warning
    return <AppLoading startAsync={checkLoginCredentials} onFinish={() => setAppReady(true)} onError={console.warn} />;
  }

  return (
    //to able to pass the values that are store with context we can use of the provider that comes with context
    //once the above is done we can then set the initial values of the context 
    <CredentialsContext.Provider value={{ storedCredentials, setStoredCredentials }}>
      <RootStack />
    </CredentialsContext.Provider>
  );
}


