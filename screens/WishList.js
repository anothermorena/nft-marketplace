import {useState, useEffect} from 'react';
import {View, SafeAreaView, FlatList,ActivityIndicator, Text} from 'react-native';
import {COLORS} from "../constants";
import { HomeHeader,NFTCard, FocusedStatusBar } from '../components';
import axios from '../api/axios';
import * as Network from 'expo-network';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const WishList = ({navigation}) => {

    const [wishList, setWishList] = useState(null);
    const [wishListSearchResults, setWishListSearchResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userIpAddress, setUserIpAddress] = useState(null);

     //get users internet protocol address
     const getUserIpAddress = async () => {
      let ip = await Network.getIpAddressAsync();
      setUserIpAddress(ip);
    } 

    getUserIpAddress();
  
    useEffect(() => {
        //get users wish list from the database
        const fetchNftWishListData = async (userIpAddress) => {
          const result = await axios.get(`/api/get_users_wish_list/?user_ip_address=${userIpAddress}`);
     
          setWishList(result.data);
          setLoading(false);
        };   
     
        fetchNftWishListData(userIpAddress); 

    },[userIpAddress]);


    //search users wishlist
    const handleSearch = value => {
      const filteredData = wishList.filter((item) =>
        item.nft_title.toLowerCase().includes(value.toLowerCase())
      );
  
      if (filteredData.length !== 0) setWishListSearchResults(filteredData);
    };  



  return (
    <SafeAreaView style={{flex:1}}>
        <FocusedStatusBar background={COLORS.primary}/>
        <View style={{flex: 1}}>
            <View style={{zIndex: 0}}>
                <FlatList 
                    data={wishListSearchResults ? wishListSearchResults : wishList}
                    renderItem={({item}) => <NFTCard data={item} userIpAddress={userIpAddress} buttonText = "Delete from wishlist" buttonBackgroundColor={COLORS.red} refreshWishList={setWishList} wishList={wishList}/>}
                    keyExtractor={item => item.nft_id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<HomeHeader onSearch={handleSearch} navigation={navigation} searchBarPlaceHolderText="Search your nft wish list"/>}
                />
            </View>
            {!wishList && (
              <>
              <MaterialCommunityIcons name="cart-heart" size={64} color={COLORS.brand} style={{marginVertical:250, marginHorizontal:150}}/>
              <Text style={{textAlign:"center", position:"absolute", bottom:180, left:120}}> Your wish list empty. </Text>
              </>
            )}
            {loading && <ActivityIndicator size="large" color={COLORS.brand} style={{marginVertical:200}}/>}

            {/* This view is going to act as a background color. It will be displayed behind out nft list*/}
            <View style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0, zIndex: -1}}>
                {/* These two view components splits our sscreen into two. The firstone with a dark background and the second one with a white background */}
                <View style={{ height: 300, backgroundColor: COLORS.brand }} />
                <View style={{ flex: 1, backgroundColor: COLORS.white }} />
            </View>
        </View>
    </SafeAreaView>
  )
}

export default WishList;