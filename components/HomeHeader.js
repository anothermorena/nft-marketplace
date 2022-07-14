//1. import all requred constants, hooks and components
import { useContext } from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES} from "../constants";
import {PageLogo} from './../components/StyledComponents';
import { View, Text, TextInput, Pressable } from "react-native";
import { CredentialsContext } from './../context/CredentialsContext';

const HomeHeader = ({ onSearch, navigation,searchBarPlaceHolderText }) => {

  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  //get the user's profile image from the credentials context
  if(storedCredentials != null) {
    const {profileImage} = storedCredentials;
  } 

  //const {profileImage} = storedCredentials;
  
  return (
    <View style={{backgroundColor: COLORS.brand,padding: SIZES.font}}>
      {storedCredentials == null ? ( 
        <>
          <View style={{flexDirection: "row",justifyContent: "center",alignItems: "center"}}>
              <Text style={{fontFamily: FONTS.bold,fontSize: SIZES.extraLarge,color: COLORS.white, textAlign:'center'}}>NFT Market Place</Text>
          </View>
        </>
      ) : (
        <> 
        <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
          <Text style={{fontFamily: FONTS.bold,fontSize: SIZES.extraLarge,color: COLORS.white}}>NFT Market Place</Text>
          <View style={{ width: 45, height: 45 }}>
            <Pressable onPress={() => navigation.openDrawer()}>
              <PageLogo resizeMode="cover" source={{uri: profileImage}}  style={{width: "100%", height: "100%",borderRadius: 200}}/>
            </Pressable>
          </View>
        </View>
        </>
      )}
  
      <View style={{ marginTop: SIZES.font }}>
        <View style={{width: "100%",borderRadius: SIZES.font,backgroundColor: COLORS.white,flexDirection: "row",alignItems: "center",paddingHorizontal: SIZES.font,paddingVertical: SIZES.small - 2}}>
          <EvilIcons  name="search" size={35} color={COLORS.brand}  />
          <TextInput placeholder={searchBarPlaceHolderText} style={{ flex: 1}} onChangeText={onSearch}/>
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;