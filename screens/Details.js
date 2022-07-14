//1. import all requred packages,hooks and components
//===================================================
import * as yup from 'yup';
import { Formik } from 'formik';
import {useContext} from "react";
import axios from './../api/axios';
import { CredentialsContext } from './../context/CredentialsContext';
import {StyledButton,ButtonText} from './../components/StyledComponents';
import { COLORS, SIZES, assets, FONTS, Constants } from "./../constants";
import { CircleButton, SubInfo, DetailsDesc, BidDetails, FocusedStatusBar } from "./../components";
import { View, Text, SafeAreaView, Image,  FlatList, TextInput,ActivityIndicator,StyleSheet } from "react-native";

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
        top={Constants.statusBarHeight + 10}
      />
  
      <CircleButton
        imgUrl={assets.heart}
        right={15}
        top={Constants.statusBarHeight + 10}
      />
    </View>
  );

const Details = ({route, navigation}) => {
  //get the nft data from the route parameters  
  const { data } = route.params;
  const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

  //bid amount validation schema
  const bidAmountValidationSchema = yup.object().shape({
    bidAmount: yup
    .number()
    .min(0.1)
    .positive()
    .required("Bid Amount is required to place a bid for this nft.")
    
  });

  //makes a request to place a bid for the current nft
  const handlePlaceABid = async (formValues, setSubmitting) => {
    if(!storedCredentials) {
      alert("You must be logged in to bid for nfts.");
      } else {
        //Place the bid
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + storedCredentials.accessToken
          }
        }
        try {
          const response = await axios.post("/api/place_bid", JSON.stringify({ nft_id: data.nft_id,bid_amount:formValues.bidAmount}) , config);
          const result = response.data;
          const {status, message } = result;

          if (status !== 'SUCCESS') {
            alert(message);
          } else {
            //tell the user the bid was placed successfully
            alert(message);
            navigation.navigate('Home');
          }  
        } catch (error) {
          alert('An error occurred. Check your network and try again');
        }
        setSubmitting(false);      
      }
  }

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
        <Formik
               initialValues={{bidAmount: ""}}
               validationSchema={bidAmountValidationSchema}
               onSubmit={(values, { setSubmitting }) => {
                if (values.bidAmount == "") {
                  alert("Bid Amount is required to place a bid");
                  setSubmitting(false);
                }   else {
                  handlePlaceABid(values, setSubmitting);
                }     
  
               }}
            >
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, touched,errors}) => (
              <> 
              <TextInput 
                  keyboardType="number-pad"
                  placeholder="Bid Amount"
                  style={{ 
                    height: 48,
                    width:150,
                    borderColor: COLORS.brand,
                    borderWidth: 2, 
                    borderRadius: SIZES.font,
                    textAlign:"center",
                    margin:5
                    }}
                    value={values.bidAmount}
                    onChangeText={handleChange('bidAmount')}
                    onBlur={handleBlur('bidAmount')}
                    />
                    {touched.bidAmount && errors.bidAmount && alert("Bid Amount is required to place a bid")}
                    
                   {!isSubmitting && (
                    <StyledButton style={styles.styledButtonExtraStyles} onPress={handleSubmit}>
                      <ButtonText style={{textAlign: "center",fontSize:SIZES.font}}>Place a Bid</ButtonText>
                    </StyledButton>
                  )}
                  {isSubmitting && (
                    <StyledButton disabled={true} style={styles.styledButtonExtraStyles}>
                      <ActivityIndicator size="large" color={COLORS.white} />
                    </StyledButton>
                  )}
              </>
            )}
          </Formik>
        </View>
        
      </View>
      {data.bids.length > 0 && (
        <FlatList 
        data={data.bids}
        renderItem={({ item }) => <BidDetails bid={item} />}
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

//extra styles for the submit button to keep our code dry
const styles = StyleSheet.create ({
  styledButtonExtraStyles: {
    height:48, 
    width:150,
    borderRadius: SIZES.font,
    padding: SIZES.small
  }
});

export default Details;