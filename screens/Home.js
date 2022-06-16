import {useState} from 'react';
import {View, SafeAreaView, FlatList} from 'react-native';

//local imports
import {COLORS, NFTData} from "../constants";
import { HomeHeader,NFTCard, FocusedStatusBar } from '../components';

const Home = () => {

    const [nftData, setNftData] = useState(NFTData);

    const handleSearch = value => {
      if (value.length === 0) {
        setNftData(NFTData);
      }
  
      const filteredData = NFTData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
  
      if (filteredData.length === 0) {
        setNftData(NFTData);
      } else {
        setNftData(filteredData);
      }
    };

  return (
    <SafeAreaView style={{flex:1}}>
        <FocusedStatusBar background={COLORS.primary}/>

        <View style={{flex: 1}}>
            <View style={{zIndex: 0}}>
                <FlatList 
                    data={nftData}
                    renderItem={({item}) => <NFTCard data={item}/>}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={<HomeHeader onSearch={handleSearch} />}
                />
            </View>

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