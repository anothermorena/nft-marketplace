import { View, Text, Image, TextInput, Pressable } from "react-native";
import { COLORS, FONTS, SIZES, assets } from "../constants";
import { EvilIcons } from '@expo/vector-icons';

const HomeHeader = ({ onSearch, navigation }) => {
  return (
    <View style={{backgroundColor: COLORS.brand,padding: SIZES.font}}>
      <View style={{flexDirection: "row",justifyContent: "space-between",alignItems: "center"}}>
      <Text style={{fontFamily: FONTS.bold,fontSize: SIZES.extraLarge,color: COLORS.white}}>NFT Market Place</Text>
        <View style={{ width: 45, height: 45 }}>
          <Pressable onPress={() => navigation.openDrawer()}>
            <Image source={assets.person01} resizeMode="contain"style={{ width: "100%", height: "100%" }}/>
            <Image source={assets.badge} resizeMode="contain" style={{position: "absolute",width: 20,height: 20,bottom: -5,right: 0}}/>
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