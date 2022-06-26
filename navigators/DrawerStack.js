import { NavigationContainer, DefaultTheme} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {useFonts } from 'expo-font';
//colors
import { COLORS } from "./../constants";
import {Ionicons, MaterialCommunityIcons, FontAwesome5} from '@expo/vector-icons';

import Home from './../screens/Home';
import ChangePassword from './../screens/ChangePassword';
import UpdateProfileDetails from './../screens/UpdateProfileDetails';
import Nfts from './../screens/Nfts';
import Bids from './../screens/Bids';
import WishList from './../screens/WishList';
import CustomDrawer from '../components/CustomDrawer';

const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
      backgroundColor: 'red'
    }
  }

const Drawer = createDrawerNavigator();

const DrawerStack = () => {
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
     <NavigationContainer theme={theme}>
      <Drawer.Navigator 
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.brand,
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontFamily: 'Roboto-Medium',
          fontSize: 15,
        },
      }}>
        <Drawer.Screen name="Home" component={Home}  options={{drawerIcon: () => (<Ionicons name="home-outline" size={22} color={COLORS.white} />)}}/>
        <Drawer.Screen name="My Nft's" component={Nfts}  options={{drawerIcon: () => (<FontAwesome5 name="coins" size={22} color={COLORS.brand} />)}}/>
        <Drawer.Screen name="My Wishlist" component={WishList}  options={{drawerIcon: ({color}) => (<Ionicons name="heart" size={22} color={COLORS.brand} />)}}/>
        <Drawer.Screen name="My Bids" component={Bids}  options={{drawerIcon: () => (<Ionicons name="hammer" size={22} color={COLORS.brand} />)}}/>
        <Drawer.Screen name="Update Profile Details" component={UpdateProfileDetails}   options={{drawerIcon: () => (<MaterialCommunityIcons name="account-edit" size={22} color={COLORS.brand} />)}}/>
        <Drawer.Screen name="Change Password" component={ChangePassword}  options={{drawerIcon: () => (<MaterialCommunityIcons name="account-key" size={22} color={COLORS.brand} />)}} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default DrawerStack;