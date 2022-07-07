import {useState, useEffect} from 'react';
import {View, SafeAreaView, FlatList,ActivityIndicator} from 'react-native';
import {COLORS} from "../constants";
import { HomeHeader,NFTCard, FocusedStatusBar } from '../components';
import axios from '../api/axios';


const Home = ({navigation}) => {

    const [nftData, setNftData] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [loading, setLoading] = useState(true);

    //get nfts from the database
    useEffect(() => {
        const fetchNftData = async () => {
          const result = await axios(
            '/api/nfts',
          );
     
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
                    renderItem={({item}) => <NFTCard data={item}/>}
                    keyExtractor={item => item.nft_id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<HomeHeader onSearch={handleSearch} navigation={navigation}/>}
                />
            </View>

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

export default Home;