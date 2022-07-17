//1. import all requred packages, hooks, constants and components
//==============================================================
import axios from './../api/axios';
import {useContext} from 'react';
import { View, Image } from 'react-native';
import { RectButton, CircleButton } from "./Button";
import { SubInfo, EthPrice, NFTTitle } from "./SubInfo";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES, SHADOWS, assets } from "./../constants";
import { WishListDataContext } from './../contexts/WishListDataContext';

const NFTCard = ({data,buttonText,buttonBackgroundColor, bidForNft,refreshWishList,wishList}) => {
    const navigation = useNavigation();
    const { wishListData, setWishListData } = useContext(WishListDataContext);
    const { nftWishListCount, userIpAddress } = wishListData;

    //add nft to wish list
    handleAddNftToWishList = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      try {
        const response = await axios.post("/api/add_nft_to_wish_list/", JSON.stringify({ user_ip_address: userIpAddress, nft_id: data.nft_id }), config);
        const { message, status } = response.data;

        if (status !== 'SUCCESS') { 
          //give the user feedback
          alert(message);
        } else {
          //give the user feedback
          alert(message);
          
          //update the wish list context with the new nft count
          const newWishListData = {
            ...wishListData,
            nftWishListCount: nftWishListCount + 1     
          }
          setWishListData(newWishListData);

        }
      } catch (error) {
        alert('An error occurred. Check your network and try again');
      }

    }

      //delete nft from users wishlist
      const deleteNftFromWishList = async () => {

        try {
         await axios.delete("/api/delete_nft_from_users_wish_list", {
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              nft_id: data.nft_id,
              user_ip_address: userIpAddress
            }
          });
          alert("Successfully deleted nft from your wish list 😎");
          //remove the nft from the displayed users wish list
          refreshWishList(wishList.filter(nft => nft.nft_id !== data.nft_id))
         
          //update the wish list context with the new nft count
         const newWishListData = {
           ...wishListData,
           nftWishListCount: nftWishListCount - 1    
         }
         setWishListData(newWishListData);

        } catch (error) {
          alert("An error occurred. Check your network and try again");
        }
      }

      const viewNftDetails = async () => {
        navigation.navigate("Details", { data })
      }

  return (
    <View style={{ backgroundColor: COLORS.white, borderWidth:2, borderColor:COLORS.brand, borderRadius: SIZES.font, marginBottom: SIZES.extraLarge, margin: SIZES.base,...SHADOWS.dark}}>
         <View style={{ width: "100%",height: 250,}}>
            <Image source={{uri: data.nft_image}} resizeMode="cover" style={{width: "100%",height: "100%", borderTopLeftRadius: SIZES.small, borderTopRightRadius: SIZES.small,}}/>
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
            buttonText = {buttonText}
            backgroundColor={buttonBackgroundColor}
            onPress ={bidForNft ? viewNftDetails : deleteNftFromWishList}
          />
        </View>
      </View>
    </View>
  )
}

export default NFTCard;