//1. import all required packages, hooks and components
//=====================================================
import axios from './api/axios';
import { View } from 'react-native';
import 'react-native-gesture-handler';
import * as Network from 'expo-network';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect, useCallback } from 'react';
import DrawerNavigator from './navigators/DrawerNavigator';
import { CredentialsContext } from './contexts/CredentialsContext';
import { WishListDataContext } from './contexts/WishListDataContext';

export default function App() {
  //check if the app is ready using this state. Initial is false
  //this is to monitor our app readiness
  const [appIsReady, setAppIsReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState('');
  const [wishListData, setWishListData] = useState('');

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

  //get users wish list nft count from the database
  const fetchNftWishListCount = async (userIpAddress) => {
    const result = await axios.get(
      `/api/get_users_wish_list_count/?user_ip_address=${userIpAddress}`
    );

    const wishListDataObj = {
      nftWishListCount: result.data.wish_list_nft_count,
      userIpAddress,
    };
    setWishListData(wishListDataObj);
  };

  //if the app is not ready, return the app loading splash screen
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();

        //get users internet protocol address
        let ip = await Network.getIpAddressAsync();

        await fetchNftWishListCount(ip);

        //check if user has stored login credentials in local storage
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
      <CredentialsContext.Provider
        value={{ storedCredentials, setStoredCredentials }}
      >
        <WishListDataContext.Provider value={{ wishListData, setWishListData }}>
          <DrawerNavigator />
        </WishListDataContext.Provider>
      </CredentialsContext.Provider>
    </View>
  );
}
