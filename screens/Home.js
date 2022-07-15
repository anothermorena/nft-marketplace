//1. import all requred packages,hooks and components
//===================================================
import axios from './../api/axios';
import {COLORS} from "./../constants";
import {
  TopScreenDivider,
  BottomScreenDivider,
  ScreenDividerContainer,
} from './../components/StyledComponents';
import {useState, useEffect} from 'react';
import { HomeHeader,NFTCard, FocusedStatusBar } from './../components';
import {View, SafeAreaView, FlatList,ActivityIndicator} from 'react-native';

const Home = ({navigation}) => {
    const [nftData, setNftData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        //get nfts from the database
        const fetchNftData = async () => {
          const result = await axios('/api/nfts');
     
          setNftData(result.data);
          setLoading(false);
        };
     
        fetchNftData(); 
        
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
                    renderItem={({item}) => <NFTCard data={item}  buttonText = "Place a Bid" buttonBackgroundColor={COLORS.brand} bidForNft={true}/>}
                    keyExtractor={item => item.nft_id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<HomeHeader onSearch={handleSearch} navigation={navigation} searchBarPlaceHolderText="Search Nfts"/>}
                />
            </View>

            {loading && <ActivityIndicator size="large" color={COLORS.brand} style={{marginVertical:200}}/>}
            
            <ScreenDividerContainer>
              <TopScreenDivider />
              <BottomScreenDivider />
            </ScreenDividerContainer>
        </View>
    </SafeAreaView>
  )
}

export default Home;