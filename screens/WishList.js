//1. import all requred packages,hooks and components
//===================================================
import axios from './../api/axios';
import { COLORS } from './../constants';
import {
  TopScreenDivider,
  BottomScreenDivider,
  ScreenDividerContainer,
} from './../components/StyledComponents';
import { useState, useEffect, useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HomeHeader, NFTCard, FocusedStatusBar } from './../components';
import { WishListDataContext } from './../contexts/WishListDataContext';
import {
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';

const WishList = ({ navigation }) => {
  const [wishList, setWishList] = useState(null);
  const [wishListSearchResults, setWishListSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { wishListData, setWishListData } = useContext(WishListDataContext);
  const { nftWishListCount, userIpAddress } = wishListData;

  useEffect(() => {
    //get users wish list from the database
    const fetchNftWishListData = async (userIpAddress) => {
      const result = await axios.get(
        `/api/get_users_wish_list/?user_ip_address=${userIpAddress}`
      );

      setWishList(result.data);
      setLoading(false);
    };

    fetchNftWishListData(userIpAddress);
  }, []);

  //search users wishlist
  const handleSearch = (value) => {
    const filteredData = wishList.filter((item) =>
      item.nft_title.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredData.length !== 0) setWishListSearchResults(filteredData);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FocusedStatusBar background={COLORS.primary} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          <FlatList
            data={wishListSearchResults ? wishListSearchResults : wishList}
            renderItem={({ item }) => (
              <NFTCard
                data={item}
                buttonText='Delete from wishlist'
                buttonBackgroundColor={COLORS.red}
                refreshWishList={setWishList}
                wishList={wishList}
              />
            )}
            keyExtractor={(item) => item.nft_id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <HomeHeader
                onSearch={handleSearch}
                navigation={navigation}
                searchBarPlaceHolderText='Search your nft wish list'
              />
            }
          />
        </View>
        {loading && (
          <ActivityIndicator
            size='large'
            color={COLORS.brand}
            style={{ marginVertical: 200 }}
          />
        )}

        {nftWishListCount == 0 && !loading && (
          <>
            <MaterialCommunityIcons
              name='cart-heart'
              size={64}
              color={COLORS.brand}
              style={{ marginVertical: 250, marginHorizontal: 150 }}
            />
            <Text
              style={{
                textAlign: 'center',
                position: 'absolute',
                bottom: 180,
                left: 120,
              }}
            >
              {' '}
              Your wish list is empty.{' '}
            </Text>
          </>
        )}

        <ScreenDividerContainer>
          <TopScreenDivider />
          <BottomScreenDivider />
        </ScreenDividerContainer>
      </View>
    </SafeAreaView>
  );
};

export default WishList;
