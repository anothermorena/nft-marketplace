//1. import all requred packages,constants, hooks and components
//==============================================================
import { useContext } from 'react';
import { COLORS, assets, SIZES} from "../constants";
import * as SecureStore from 'expo-secure-store';
import {PageLogo} from './../components/StyledComponents';
import {FontAwesome5, AntDesign } from '@expo/vector-icons';
import { CredentialsContext } from './../contexts/CredentialsContext';
import {View,Text,ImageBackground,TouchableOpacity} from 'react-native';
import {DrawerContentScrollView,DrawerItemList} from '@react-navigation/drawer';

const CustomDrawer = props => {
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  //log out the user
  const handleUserLogout = async () => {
    await SecureStore.deleteItemAsync('nftMarketPlace')
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
  };
  
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: COLORS.brand}}>
          {!storedCredentials && <ImageBackground source={assets.drawerBg} style={{padding: 20,height: 160}}/>}
          {storedCredentials && (
            <ImageBackground source={assets.drawerBg} style={{padding: 20}}>
              <PageLogo resizeMode="cover" source={{uri: storedCredentials.profileImage}}  style={{width: 80, height: 80,borderRadius: 40, marginBottom: 10}}/>
              <Text style={{color: COLORS.white, fontSize: 18, fontFamily: 'InterMedium', marginBottom: 5}}>{`${storedCredentials.firstName} ${storedCredentials.lastName}`}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: COLORS.white, fontFamily: 'InterMedium', marginRight: 5}}>{`${storedCredentials.nftCount} Nft'(s)`}</Text>
                <FontAwesome5 name="coins" size={14} color={COLORS.white} />
              </View>
            </ImageBackground>     
          )}
          <View style={{flex: 1, backgroundColor: COLORS.white, paddingTop: 10}}>
            <DrawerItemList {...props} />
          </View>
      </DrawerContentScrollView>
      <View style={{padding: 20,borderTopWidth: 1,borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={storedCredentials ? handleUserLogout : () => props.navigation.navigate('Login')} style={{flexDirection : 'row',alignItems:'center',paddingVertical: 15}}>
            <AntDesign  name="logout" size={22}  color={COLORS.brand}/>
            <Text style={{marginLeft:5,fontSize: SIZES.font,fontFamily: 'InterRegular'}}> {storedCredentials ? 'Logout' : 'Login'}</Text>
        </TouchableOpacity>   
      </View>
   </View>
  );
};

export default CustomDrawer;