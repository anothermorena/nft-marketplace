import {View,Text,ImageBackground,Image,TouchableOpacity} from 'react-native';
import {DrawerContentScrollView,DrawerItemList} from '@react-navigation/drawer';
import {Ionicons, FontAwesome5} from '@expo/vector-icons';
import { COLORS, assets } from "../constants";

const CustomDrawer = props => {
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props} contentContainerStyle={{backgroundColor: COLORS.brand}}>
        <ImageBackground source={assets.drawerBg} style={{padding: 20}}>
          <Image source={assets.person01} style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}/>
          <Text style={{color: COLORS.white, fontSize: 18, fontFamily: 'Roboto-Medium', marginBottom: 5}}>
            Morena
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: COLORS.white, fontFamily: 'Roboto-Regular', marginRight: 5}}>
              280 Nft's
            </Text>
            <FontAwesome5 name="coins" size={14} color={COLORS.white} />
          </View>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: COLORS.white, paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={() => {}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="power" size={22}  color={COLORS.brand}/>
            <Text style={{fontSize: 15, fontFamily: 'Roboto-Medium', marginLeft: 5}}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;