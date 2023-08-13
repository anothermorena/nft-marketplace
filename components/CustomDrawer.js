import React, { useContext } from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import { COLORS, assets, SIZES } from '../constants';
import { PageLogo } from '../components/StyledComponents';
import { CredentialsContext } from '../contexts/CredentialsContext';

const CustomDrawer = (props) => {
  const { storedCredentials, setStoredCredentials } =
    useContext(CredentialsContext);

  const handleUserLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('nftMarketPlace');
      setStoredCredentials('');
    } catch (error) {
      console.log(error);
    }
  };

  const renderProfile = () => (
    <ImageBackground source={assets.drawerBg} style={{ padding: 20 }}>
      <PageLogo
        resizeMode='cover'
        source={
          storedCredentials
            ? { uri: storedCredentials.profileImage }
            : require('../assets/images/home-avatar.png')
        }
        style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 10 }}
      />
      {storedCredentials?.accessToken && (
        <>
          <Text style={styles.nameText}>
            {`${storedCredentials.firstName} ${storedCredentials.lastName}`}
          </Text>
          <View style={styles.nftCountContainer}>
            <Text
              style={styles.nftCountText}
            >{`${storedCredentials.nftCount} Nft'(s)`}</Text>
            <FontAwesome5 name='coins' size={14} color={COLORS.white} />
          </View>
        </>
      )}
    </ImageBackground>
  );

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: COLORS.brand }}
      >
        {renderProfile()}
        <View
          style={{ flex: 1, backgroundColor: COLORS.white, paddingTop: 10 }}
        >
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={
            storedCredentials
              ? handleUserLogout
              : () => props.navigation.navigate('Login')
          }
          style={styles.footerButton}
        >
          <AntDesign
            name={storedCredentials ? 'logout' : 'login'}
            size={22}
            color={COLORS.brand}
          />
          <Text style={styles.footerButtonText}>
            {storedCredentials ? 'Logout' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  nameText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'InterMedium',
    marginBottom: 5,
  },
  nftCountContainer: {
    flexDirection: 'row',
  },
  nftCountText: {
    color: COLORS.white,
    fontFamily: 'InterMedium',
    marginRight: 5,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  footerButtonText: {
    marginLeft: 5,
    fontSize: SIZES.font,
    fontFamily: 'InterRegular',
  },
};

export default CustomDrawer;
