import React, { useContext } from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

import { COLORS, FONTS, SIZES } from '../constants';
import { PageLogo } from './../components/StyledComponents';
import { CredentialsContext } from './../contexts/CredentialsContext';

const HomeHeader = ({ onSearch, navigation, searchBarPlaceHolderText }) => {
  const { storedCredentials } = useContext(CredentialsContext);

  const userImageSource =
    storedCredentials &&
    storedCredentials.profileImage &&
    storedCredentials.profileImage.trim() !== ''
      ? { uri: storedCredentials.profileImage }
      : require('./../assets/images/home-avatar.png');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>NFT Market Place</Text>
        <View style={styles.imageContainer}>
          <Pressable onPress={() => navigation.openDrawer()}>
            <PageLogo
              resizeMode='cover'
              source={userImageSource}
              style={styles.userImage}
            />
          </Pressable>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <EvilIcons name='search' size={35} color={COLORS.brand} />
        <TextInput
          placeholder={searchBarPlaceHolderText}
          style={styles.searchInput}
          onChangeText={onSearch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.brand,
    padding: SIZES.font,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.extraLarge,
    color: COLORS.white,
  },
  imageContainer: {
    width: 45,
    height: 45,
  },
  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 200,
  },
  searchContainer: {
    marginTop: SIZES.font,
    width: '100%',
    borderRadius: SIZES.font,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.font,
    paddingVertical: SIZES.small - 2,
  },
  searchInput: {
    flex: 1,
  },
});

export default HomeHeader;
