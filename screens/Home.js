import {useState} from 'react';
import {View,Text, SafeAreaView, FlatList} from 'react-native';

//local imports
import {COLORS, NFTdata} from "../constants";
import { HomeHeader,NFTCard, FocussedStatusBar } from '../components';

const Home = () => {
  return (
    <SafeAreaView style={{flex:1}}>
        <FocussedStatusBar background={COLORS.primary}/>
    </SafeAreaView>
  )
}

export default Home;