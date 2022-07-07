import * as yup from 'yup';
import { Formik } from 'formik';
import axios from './../api/axios';
import {
  StyledContainer,
  PageLogo,
  SubTitle,
  StyledInputLabel,
  StyledFormArea,
  StyledButton,
  StyledTextInput,
  LeftIcon,
  InnerContainer,
  ButtonText,
  MsgBox,
  IconBg
} from './../components/StyledComponents';
import { COLORS,assets } from "../constants";
import * as ImagePicker from 'expo-image-picker';
import React, { useState,useContext } from 'react';
import {Feather, MaterialIcons,Entypo } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker'
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';
import { FocusedStatusBar,CircleButton } from './../components';
import { CredentialsContext } from './../components/CredentialsContext';

const CreateNft = ({navigation}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [image, setImage] = useState(null);
    const [mode, setMode] = useState("time");
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());

    // bidding deadline to be sent to the db
    const [nftBiddingDeadline, setNftBiddingDeadline] = useState();

    // credentials context
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

    //destructure the data stored in the context
    const { accessToken} = storedCredentials;

    //create Nft form fields validation
    const createNftValidationSchema = yup.object().shape({
      nftTitle: yup
        .string()
        .required("Nft Title is required"),
        nftDescription: yup
        .string()
        .required("Nft Description is required"),
        nftPrice: yup
        .number()
        .min(0.1)
        .positive()
        .required("Nft Price is required"),
        biddingDeadline: yup
        .string()  
    });

    //upload nft image function
    const pickImage = async () => {
      //clear the current image stored in the state
      setImage(null);

      //select an image from the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    };

    const handleCreateNft = async (formValues,setSubmitting) => {
        //clear the error message when ever the create nft button is pressed
        handleMessage(null);

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer " + accessToken
          }
        }

        //check if user provided an image for the nft
        if(!image){
          handleMessage('You must upload or select an image for your nft');
          setSubmitting(false);
          return;
        } 

        //prepare form data to send to the api to create the nft
        let formData =  createFormData(formValues.nftTitle,formValues.nftDescription,formValues.nftPrice,formValues.biddingDeadline,image);
        
        try {
          const response = await axios.patch("/api/create_nft/", formData , config);
          const result = response.data;
          const {status, message } = result;

          if (status !== 'SUCCESS') {
            handleMessage(message, status);
          } else {
            //tell the user the nft was created successfully
            alert("Your nft was created successfully.");

            //rediect the user my nft's screen
            navigation.navigate('Nfts');
          }  
        } catch (error) {
         
          handleMessage('An error occurred. Check your network and try again');
        }
        setSubmitting(false);
      };

      //handle api response messages
      const handleMessage = (message, type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
      };


      const createFormData = (nftTitle, nftDescription, nftPrice,biddingDeadline,uri) => {
          //create the form object
          const formData = new FormData();
          const fileName = uri.split('/').pop();
          const fileType = fileName.split('.').pop();

          formData.append('nft_image', { 
            uri, 
            name: fileName, 
            type: `image/${fileType}` 
          });
          formData.append('nft_title', nftTitle);
          formData.append('nft_description', nftDescription);
          formData.append('nft_price', nftPrice);
          formData.append('bidding_deadline', biddingDeadline);
            
          return formData;
      }

      //delete the nft image user selected or uploaded
      const deleteUploadedImage = async () => {
          setImage(null);
      }

      //creates the bidding deadline when user clicks on the bidding deadline input fiedl
      const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        let fTime= tempDate.getHours()+'h '+ tempDate.getMinutes()+'m '+ tempDate.getSeconds()+'s';

        setNftBiddingDeadline(fTime);

      };

      //specifies which mode or picker we want displayed to the user: date/time picker
      const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      }
    
      //display the time picker to the user
      const showTimepicker = () => {
        showMode('time');
      };

  return (
    <KeyboardAvoidingWrapper>
        <StyledContainer style={{paddingBottom:140}}> 
        <FocusedStatusBar background={COLORS.primary}/>
          <CircleButton imgUrl={assets.whiteLeft} handlePress={() => navigation.goBack()} left={15} top={15}  backgroundColor= {COLORS.brand}/>
          <InnerContainer style={{marginVertical: -40}}> 
          <SubTitle style={{marginTop:40}}>Create an NFT</SubTitle>
          {image && (
              <>
                <PageLogo resizeMode="contain" source={{ uri: image }} style={{width:280, height:280, borderRadius: 10}}/>
                <Entypo name="circle-with-cross" size={40} color={COLORS.red} style={{position: "absolute",top: 65,right: 5}} onPress={deleteUploadedImage}/> 
              </>
            )}

           {!image && (
          <TouchableOpacity onPress={pickImage}>
                <IconBg>
                    <Feather name="upload-cloud" size={125} color={COLORS.brand}/>
                </IconBg>
                <Text style={{textAlign: "center", marginBottom:10}}>Click here to upload nft image</Text>
          </TouchableOpacity> 
           )}
            {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
              style={{
                backgroundColor: COLORS.brand,
                color: COLORS.brand,
              }}
            />
          )}

            <Formik
               initialValues={{nftTitle: "",nftDescription: "", nftPrice:"", biddingDeadline:""}}
               validationSchema={createNftValidationSchema}
               onSubmit={(values, { setSubmitting }) => {
                values = { ...values, biddingDeadline: nftBiddingDeadline };
                 if (values.nftTitle == "" || values.nftDescription == "" || values.nftPrice == ""|| values.biddingDeadline == "") {
                   handleMessage("Please fill in all fields");
                   setSubmitting(false);
                 }   else {
                  handleCreateNft(values, setSubmitting);
                 }
               }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched}) => (
                <StyledFormArea>
                
                <MyTextInput
                    label="Nft Title"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('nftTitle')}
                    onBlur={handleBlur('nftTitle')}
                    value={values.nftTitle}
                    icon="title"
                  />
                   {touched.nftTitle && errors.nftTitle &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.nftTitle}</Text>
                  }
                  
                <MyTextInput
                    label="Nft Description"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('nftDescription')}
                    onBlur={handleBlur('nftDescription')}
                    value={values.nftDescription}
                    icon="description"
                    multiline={true}
                    numberOfLines={20}
                    textAlignVertical= "top"
                    height={200}
                  />
                   {touched.nftDescription && errors.nftDescription &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.nftDescription}</Text>
                  }

                  <MyTextInput
                    label="Nft Price"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('nftPrice')}
                    onBlur={handleBlur('nftPrice')}
                    value={values.nftPrice}
                    keyboardType="number-pad"
                    icon="attach-money"
                  />
                   {touched.nftPrice && errors.nftPrice &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.nftPrice}</Text>
                  }

                  <MyTextInput
                    label="Bidding Deadline"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('biddingDeadline')}
                    onBlur={handleBlur('biddingDeadline')}
                    value={nftBiddingDeadline}
                    icon="timer"
                    editable={false}
                    isTime={true}
                    showTimepicker={showTimepicker}
                  />
                   {touched.biddingDeadline && errors.biddingDeadline &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.biddingDeadline}</Text>
                  }
                  
                  <MsgBox type={messageType}>{message}</MsgBox>

                  {!isSubmitting && (
                    <StyledButton onPress={handleSubmit}>
                      <ButtonText>Create Nft</ButtonText>
                    </StyledButton>
                  )}
                  {isSubmitting && (
                    <StyledButton disabled={true}>
                      <ActivityIndicator size="large" color={COLORS.white} />
                    </StyledButton>
                  )}
                </StyledFormArea>
              )}
            </Formik>
          </InnerContainer>
        </StyledContainer>
    </KeyboardAvoidingWrapper>
    
  )
}

const MyTextInput = ({ label, icon, isTime,showTimepicker,...props }) => {
    return (
      <View>
        <LeftIcon>
          <MaterialIcons  name={icon} size={30} color={COLORS.brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
          {isTime && (
          <TouchableOpacity onPress={showTimepicker}>
            <StyledTextInput {...props} />
          </TouchableOpacity>
         )}

        {!isTime && <StyledTextInput {...props} />}
      </View>
    );
  };

export default CreateNft;