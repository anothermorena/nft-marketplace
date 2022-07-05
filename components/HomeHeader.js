import { useContext } from 'react';
import { View, Text, TextInput, Pressable } from "react-native";
import { COLORS, FONTS, SIZES, assets} from "../constants";
import { EvilIcons } from '@expo/vector-icons';
import { CredentialsContext } from './../components/CredentialsContext';
import {PageLogo} from './../components/StyledComponents';

const HomeHeader = ({ onSearch, navigation }) => {

  // credentials context
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  //destructure the data stored in the context
  //const { profileImage} = storedCredentials;

  return (
    <View style={{backgroundColor: COLORS.brand,padding: SIZES.font}}>
      <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
      <Text style={{fontFamily: FONTS.bold,fontSize: SIZES.extraLarge,color: COLORS.white}}>NFT Market Place</Text>
        <View style={{ width: 45, height: 45 }}>
          <Pressable onPress={() => navigation.openDrawer()}>
            <PageLogo resizeMode="contain" source={assets.person01} style={{width: "100%", height: "100%",borderRadius: 200}}/>
          </Pressable>
        </View>
      </View>

      <View style={{ marginTop: SIZES.font }}>
        <View style={{width: "100%",borderRadius: SIZES.font,backgroundColor: COLORS.white,flexDirection: "row",alignItems: "center",paddingHorizontal: SIZES.font,paddingVertical: SIZES.small - 2}}>
          <EvilIcons  name="search" size={35} color={COLORS.brand}  />
          <TextInput placeholder="Search NFTs" style={{ flex: 1}} onChangeText={onSearch}/>
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;