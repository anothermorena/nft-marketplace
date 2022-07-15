//1. import all requred packages,constants, hooks and components
//==============================================================
import { useContext } from 'react';
import { COLORS, assets, SIZES} from "../constants";
import * as SecureStore from 'expo-secure-store';
import {PageLogo} from './../components/StyledComponents';
import {FontAwesome5, AntDesign } from '@expo/vector-icons';
import { CredentialsContext } from './../contexts/CredentialsContext';
import {DrawerContentScrollView,DrawerItemList} from '@react-navigation/drawer';
import {View,Text,ImageBackground,TouchableOpacity,StyleSheet} from 'react-native';

const CustomDrawer = props => {
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  //maor todo fix this mess with conditional rendering not wirking
//get the user's profile details from the credentials context
  if(storedCredentials != null) {
    const {firstName,lastName,profileImage,nftCount} = storedCredentials;
   
  }

  const {firstName,lastName,profileImage,nftCount} = storedCredentials;  

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
        <PageLogo resizeMode="cover" source={{uri: profileImage}}  style={{width: 80, height: 80,borderRadius: 40, marginBottom: 10}}/>
        <Text style={{color: COLORS.white, fontSize: 18, fontFamily: 'InterMedium', marginBottom: 5}}>
          {`${firstName} ` + `${lastName}`}
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: COLORS.white, fontFamily: 'InterMedium', marginRight: 5}}>
            {`${nftCount} `}Nft'(s)
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
      <View style={styles.container}>
        <TouchableOpacity onPress={handleUserLogout} style={styles.touchableOpacityPadding}>
        <View style={styles.bottomView}>
            <AntDesign  name="logout" size={22}  color={COLORS.brand}/>
            <Text style={styles.bottomText}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      ) : (
        <View style={styles.container}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Login')} style={styles.touchableOpacityPadding}>
          <View style={styles.bottomView}>
            <AntDesign name="login" size={22}  color={COLORS.brand}/>
            <Text style={styles.bottomText}>
              Login
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
};

//component styles
const styles = StyleSheet.create ({
  bottomText: {
    marginLeft:5, 
    fontSize: SIZES.font,
    fontFamily: 'InterRegular'
  },
  bottomView: {
    flexDirection : 'row',
    alignItems:'center'
  },
  container: {
    padding: 20,
    borderTopWidth: 1, 
    borderTopColor: '#ccc'
  },
  touchableOpacityPadding: {
    paddingVertical: 15
  }
});

export default CustomDrawer;