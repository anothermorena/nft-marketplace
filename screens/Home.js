//1. import all requred packages,hooks and components
//===================================================
import axios from '../api/axios';
import {COLORS} from "../constants";
import * as Network from 'expo-network';
import {useState, useEffect} from 'react';
import { HomeHeader,NFTCard, FocusedStatusBar } from '../components';
import {View, SafeAreaView, FlatList,ActivityIndicator} from 'react-native';

const Home = ({navigation}) => {
    const [nftData, setNftData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userIpAddress, setUserIpAddress] = useState(null);

    useEffect(() => {
        //get nfts from the database
        const fetchNftData = async () => {
          const result = await axios('/api/nfts');
     
          setNftData(result.data);
          setLoading(false);
        };
     
        fetchNftData(); 

        //get users internet protocol address
        const getUserIpAddress = async () => {
          ip = await Network.getIpAddressAsync();
          setUserIpAddress(ip);
        } 

        getUserIpAddress();
        
    },[]);

    //search nft's
    const handleSearch = value => {
      const filteredData = nftData.filter((item) =>
        item.nft_title.toLowerCase().includes(value.toLowerCase())
      );
  
      if (filteredData.length !== 0) setSearchResults(filteredData);
    };

  return (
    <SafeAreaView style={{flex:1}}>
        <FocusedStatusBar background={COLORS.primary}/>
        <View style={{flex: 1}}>
            <View style={{zIndex: 0}}>
                <FlatList 
                    data={searchResults ? searchResults : nftData}
                    renderItem={({item}) => <NFTCard data={item} userIpAddress={userIpAddress} buttonText = "Place a Bid" buttonBackgroundColor={COLORS.brand} bidForNft={true}/>}
                    keyExtractor={item => item.nft_id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<HomeHeader onSearch={handleSearch} navigation={navigation} searchBarPlaceHolderText="Search Nfts"/>}
                />
            </View>

            {loading && <ActivityIndicator size="large" color={COLORS.brand} style={{marginVertical:200}}/>}

            <View style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0, zIndex: -1}}>
                <View style={{ height: 300, backgroundColor: COLORS.brand }} />
                <View style={{ flex: 1, backgroundColor: COLORS.white }} />
            </View>
        </View>
    </SafeAreaView>
  )
}

export default Home;