import { View, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES, SHADOWS, assets } from "../constants";
import { RectButton, CircleButton } from "./Button";
import { SubInfo, EthPrice, NFTTitle } from "./SubInfo";
import axios from './../api/axios';

const NFTCard = ({data,userIpAddress}) => {
    const navigation = useNavigation();

    //add nft to wish list
    handleAddNftToWishList = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      try {
        const response = await axios.post("/api/add_nft_to_wish_list/", JSON.stringify({ user_ip_address: userIpAddress, nft_id: data.nft_id }), config);
        const { message } = response;

        //give the user feedback
        alert(message);

      } catch (error) {
        alert('An error occurred. Check your network and try again');
      }

    }

  return (
    <View style={{ backgroundColor: COLORS.white, borderRadius: SIZES.font, marginBottom: SIZES.extraLarge, margin: SIZES.base,...SHADOWS.dark}}>
         <View style={{ width: "100%",height: 250,}}>
            <Image source={{uri: data.nft_image}} resizeMode="cover" style={{width: "100%",height: "100%", borderTopLeftRadius: SIZES.font, borderTopRightRadius: SIZES.font,}}/>
            <CircleButton imgUrl={assets.heart} right={10} top={10} handleAddNftToWishList={handleAddNftToWishList}/>
        </View>

        <SubInfo biddingDeadline={data.bidding_deadline}/>
        
        <View style={{ width: "100%", padding: SIZES.font }}>
        <NFTTitle
          title={data.nft_title}
          subTitle={data.creator}
          titleSize={SIZES.large}
          subTitleSize={SIZES.small}
        />

        <View
          style={{
            marginTop: SIZES.font,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <EthPrice price={data.nft_price} />
          <RectButton
            minWidth={120}
            fontSize={SIZES.font}
            handlePress={() => navigation.navigate("Details", { data })}
          />
        </View>
      </View>
    </View>
  )
}

export default NFTCard;