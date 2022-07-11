import { View, Text, SafeAreaView, Image, StatusBar, FlatList, TextInput } from "react-native";
import { COLORS, SIZES, assets, SHADOWS, FONTS } from "../constants";
import { CircleButton, RectButton, SubInfo, DetailsDesc, DetailsBid, FocusedStatusBar } from "../components";

const DetailsHeader = ({ data, navigation }) => (
    <View style={{ width: "100%", height: 373 }}>
      <Image
        source={{uri:data.nft_image}}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      />
  
      <CircleButton
        imgUrl={assets.left}
        handlePress={() => navigation.goBack()}
        left={15}
        top={StatusBar.currentHeight + 10}
      />
  
      <CircleButton
        imgUrl={assets.heart}
        right={15}
        top={StatusBar.currentHeight + 10}
      />
    </View>
  );

const Details = ({route, navigation}) => {
  //get the nft data from the route parameters  
  const { data } = route.params;

  return (
    <SafeAreaView style={{flex: 1}}>
      <FocusedStatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true}/>
      <View
        style={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          paddingVertical: SIZES.font,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.5)",
          zIndex: 1,
        }}
      >
        <View style={{flex:1, flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
          <TextInput keyboardType="number-pad" placeholder="Bid Amount"style={{ height: 48, width:150, borderColor: COLORS.brand, borderWidth: 2, borderRadius: SIZES.font,textAlign:"center",margin:10}}/>
          <RectButton minWidth={170} fontSize={SIZES.large} {...SHADOWS.dark} buttonText ="Place a Bid" />
        </View>
        
      </View>
      {data.bids.length > 0 && (
        <FlatList 
        data={data.bids}
        renderItem={({ item }) => <DetailsBid bid={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: SIZES.extraLarge * 3,
        }}
        ListHeaderComponent={() => (
           <>
             <DetailsHeader data={data} navigation={navigation} />
             <SubInfo biddingDeadline={data.bidding_deadline}/>
             <View style={{ padding: SIZES.font }}>
             <DetailsDesc data={data} />
             <Text
                style={{
                  fontSize: SIZES.font,
                  fontFamily: FONTS.semiBold,
                  color: COLORS.primary,
                }}
              >
                Current Bids
              </Text>
             </View>
           </>
         )}
     />

      )} 
      {data.bids.length <= 0 && (
        <>
        <DetailsHeader data={data} navigation={navigation} />
        <SubInfo biddingDeadline={data.bidding_deadline}/>
        <View style={{ padding: SIZES.font }}>
        <DetailsDesc data={data} />
        <Text style={{
            textAlign:"center",  
            fontSize: SIZES.font,
            fontFamily: FONTS.semiBold,
            color: COLORS.primary}}
        > 
            Nft has no Bids
        </Text>
        </View>
      </>
      )} 
        

            <View style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0, zIndex: -1}}>
                <View style={{ flex: 1, backgroundColor: COLORS.white }} />
            </View>

    </SafeAreaView>
  )
}


export default Details;