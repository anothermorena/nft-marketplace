//1. import all required packages, hooks, constants and components
//===============================================
import Home from './../screens/Home';
import Login from './../screens/Login';
import { COLORS } from "./../constants";
import Signup from './../screens/Signup';
import Details from './../screens/Details';
import WishList from './../screens/WishList';
import {Ionicons } from '@expo/vector-icons';
import Verification from './../screens/OtpVerificationMsg';
import {createStackNavigator} from '@react-navigation/stack';
import ResetPasswordInput from './../screens/ResetPasswordInput';
import ResetPasswordRequest from './../screens/ResetPasswordRequest';
import OtpVerificationInput from './../screens/OtpVerificationInput';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute,useNavigation } from '@react-navigation/native';


//navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RootStack = () => {
   return (
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
             headerLeft: null
           }}
           initialRouteName="Home"
         >
            <Stack.Screen options={{headerTintColor: COLORS.primary}} name="Home" component={Home}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="ResetPasswordRequest" component={ResetPasswordRequest} />
            <Stack.Screen name="ResetPasswordInput" component={ResetPasswordInput} />
            <Stack.Screen name="Details" component={Details}/>
            <Stack.Screen name="Verification" component={Verification}/>
            <Stack.Screen name="OtpVerificationInput" component={OtpVerificationInput}/>
         </Stack.Navigator>
     )}

     

const TabNavigator = () => {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: COLORS.brand},
        tabBarInactiveTintColor: COLORS.white,
        tabBarActiveTintColor: 'yellow',
      }}>
      <Tab.Screen
        name="Home2"
        component={RootStack}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: COLORS.brand,
          },
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        })}
      />

      <Tab.Screen
        name="WishList"
        component={WishList}
        options={{
          tabBarBadge: 3,
          tabBarBadgeStyle: {backgroundColor: 'yellow'},
          tabBarIcon: ({color, size}) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ham Menu"
        component={Ionicons}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="md-menu" color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: e => {
            // Prevent default action
            e.preventDefault();
            
            //open the drawer navigation
            navigation.openDrawer();
          },
        }}
      />
    </Tab.Navigator>
  );
};

//hide the tab bar for all the details,login,signup, reset password request, input and verification screens
const getTabBarVisibility = route => {

  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  if( routeName == 'Details' || routeName == 'Login' || routeName == 'Signup' || routeName == 'ResetPasswordRequest' || routeName == 'ResetPasswordInput' || routeName == 'Verification' || routeName == 'OtpVerificationInput')return 'none';
  return 'flex';
};

export default TabNavigator;