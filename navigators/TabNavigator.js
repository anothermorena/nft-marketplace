// Screen imports
import Home from './../screens/Home';
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Details from './../screens/Details';
import WishList from './../screens/WishList';
import Verification from './../screens/OtpVerificationMsg';
import ResetPasswordInput from './../screens/ResetPasswordInput';
import ResetPasswordRequest from './../screens/ResetPasswordRequest';
import OtpVerificationInput from './../screens/OtpVerificationInput';

// Navigation imports
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
} from '@react-navigation/native';

// Miscellaneous imports
import { useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './../constants';
import { WishListDataContext } from './../contexts/WishListDataContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: COLORS.tertiary,
        headerTransparent: true,
        headerTitle: '',
        headerLeftContainerStyle: { paddingLeft: 20 },
        headerLeft: null,
      }}
      initialRouteName='Home'
    >
      <Stack.Screen
        options={{ headerTintColor: COLORS.primary }}
        name='Home'
        component={Home}
      />
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
      <Stack.Screen
        name='ResetPasswordRequest'
        component={ResetPasswordRequest}
      />
      <Stack.Screen name='ResetPasswordInput' component={ResetPasswordInput} />
      <Stack.Screen name='Details' component={Details} />
      <Stack.Screen name='Verification' component={Verification} />
      <Stack.Screen
        name='OtpVerificationInput'
        component={OtpVerificationInput}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = (props) => {
  const navigation = useNavigation();
  const { wishListData } = useContext(WishListDataContext);
  const { nftWishListCount } = wishListData;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: COLORS.brand },
        tabBarInactiveTintColor: COLORS.white,
        tabBarActiveTintColor: 'yellow',
      }}
    >
      <Tab.Screen
        name='Home2'
        component={RootStack}
        options={({ route }) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: COLORS.brand,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='home-outline' color={color} size={size} />
          ),
        })}
      />
      <Tab.Screen
        name='Wish List'
        component={WishList}
        options={{
          tabBarBadge: nftWishListCount,
          tabBarBadgeStyle: { backgroundColor: 'yellow' },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='heart-outline' color={color} size={size} />
          ),
          tabBarStyle: { display: 'flex', backgroundColor: COLORS.brand },
        }}
      />
      <Tab.Screen
        name='Ham Menu'
        component={Ionicons}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name='md-menu' color={color} size={size} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.openDrawer();
          },
        }}
      />
    </Tab.Navigator>
  );
};

const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  const hiddenRoutes = [
    'Details',
    'Login',
    'Signup',
    'ResetPasswordRequest',
    'ResetPasswordInput',
    'Verification',
    'OtpVerificationInput',
  ];
  return hiddenRoutes.includes(routeName) ? 'none' : 'flex';
};

export default TabNavigator;
