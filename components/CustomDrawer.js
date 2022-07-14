//1. import all requred packages,constants, hooks and components
//==============================================================
import { useContext } from 'react';
import { COLORS, assets } from "../constants";
import * as SecureStore from 'expo-secure-store';
import {FontAwesome5, AntDesign } from '@expo/vector-icons';
import { CredentialsContext } from './../context/CredentialsContext';
import {View,Text,ImageBackground,Image,TouchableOpacity} from 'react-native';
import {DrawerContentScrollView,DrawerItemList} from '@react-navigation/drawer';


const CustomDrawer = props => {
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  //maor todo fix this mess with conditional rendering not wirking
//get the user's profile details from the credentials context
  if(storedCredentials != null) {
    const {firstName,lastName,profileImage} = storedCredentials;

    //TODO: get the users nft count from the db
    const nftsCount = 20;
   
  }

  //const {firstName,lastName,profileImage} = storedCredentials;
  const nftsCount = 20;
  

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
      {storedCredentials == null ? (<ImageBackground source={assets.drawerBg} style={{padding: 20,height: 160}}/>): (
        <ImageBackground source={assets.drawerBg} style={{padding: 20}}>
        <Image source={{uri: profileImage}} style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}/>
        <Text style={{color: COLORS.white, fontSize: 18, fontFamily: 'InterMedium', marginBottom: 5}}>
          {`${firstName} ` + `${lastName}`}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: COLORS.white, fontFamily: 'InterMedium', marginRight: 5}}>
            {`${nftsCount} `}Nft'(s)
          </Text>
          <FontAwesome5 name="coins" size={14} color={COLORS.white} />
        </View>
      </ImageBackground>
        )}
        <View style={{flex: 1, backgroundColor: COLORS.white, paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
    </DrawerContentScrollView>
        
      {storedCredentials ? (
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={handleUserLogout} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign  name="logout" size={22}  color={COLORS.brand}/>
            <Text style={{fontSize: 15, fontFamily: 'InterRegular', marginLeft: 5}}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      ) : (
        <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="login" size={22}  color={COLORS.brand}/>
            <Text style={{fontSize: 15, fontFamily: 'InterRegular', marginLeft: 5}}>
              Login
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
};

export default CustomDrawer;