//1. import all required packages, constants and components
//===============================================
import {useFonts } from 'expo-font';
import { COLORS } from "../constants";
import TabNavigator from './TabNavigator';
import WishList from '../screens/WishList';
import CreateNft from '../screens/CreateNft';
import ChangePassword from '../screens/ChangePassword';
import CustomDrawer from '../components/CustomDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CredentialsContext } from '../contexts/CredentialsContext';
import UpdateProfileDetails from '../screens/UpdateProfileDetails';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import {Ionicons, MaterialCommunityIcons, FontAwesome5} from '@expo/vector-icons';

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
      backgroundColor: 'red'
    }
  }

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  //const isFocused = useIsFocused();

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
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
     <NavigationContainer theme={theme}>
      <Drawer.Navigator 
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.brand,
        drawerInactiveBackgroundColor: COLORS.white,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: 'InterRegular',
          fontSize: 15,
        },
      }}>
        {storedCredentials ? (
          <>
          <Drawer.Screen name="Home" component={TabNavigator}  options={{drawerIcon: () => (<Ionicons name="home-outline" size={22} color={ COLORS.white} />)}}/>
          <Drawer.Screen name="Create Nft" component={CreateNft}  options={{drawerIcon: () => (<FontAwesome5 name="pen" size={22} color={COLORS.brand} />)}}/>
          <Drawer.Screen name="My Wishlist" component={WishList}  options={{drawerIcon: () => (<Ionicons name="heart" size={22} color={COLORS.brand} />)}}/>
          <Drawer.Screen name="Update Profile Details" component={UpdateProfileDetails}   options={{drawerIcon: () => (<MaterialCommunityIcons name="account-edit" size={22} color={COLORS.brand} />)}}/>
          <Drawer.Screen name="Change Password" component={ChangePassword}  options={{drawerIcon: () => (<MaterialCommunityIcons name="account-key" size={22} color={COLORS.brand} />)}} />
          </> 
        ) : (
          <>
          <Drawer.Screen name="Home" component={TabNavigator}  options={{drawerIcon: () => (<Ionicons name="home-outline" size={22} color={COLORS.white} />)}}/>
          <Drawer.Screen name="My Wishlist" component={WishList}  options={{drawerIcon: () => (<Ionicons name="heart" size={22} color={COLORS.brand} />)}}/>
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
    )}
    </CredentialsContext.Consumer>
  );
}

export default DrawerNavigator;