import React, { useState,useContext } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
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
} from './../components/StyledComponents';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { COLORS,assets } from "../constants";
import { Octicons, MaterialIcons} from '@expo/vector-icons';
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';
import axios from './../api/axios';
import { FocusedStatusBar,CircleButton } from './../components';
import * as ImagePicker from 'expo-image-picker';

// credentials context
import { CredentialsContext } from './../components/CredentialsContext';

const UpdateProfileDetails = ({navigation}) => {
      const [message, setMessage] = useState();
      const [messageType, setMessageType] = useState();
      const [image, setImage] = useState(null);

      // credentials context
      const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

      //destructure the data stored in the context
      const { first_name, last_name, profile_image} = storedCredentials.user;

      const { access_token } = storedCredentials;

    //Profile Details Validation
    const profileDetailsValidationSchema = yup.object().shape({
        firstName: yup
        .string()
        .required('Your first name is required'),
        lastName: yup
        .string()
        .required('Your last name is required')
        
    });

    //update users profile image function
    const pickImage = async () => {
      //clear the current image stored in the state
      setImage(null);

      //select an image from the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    };

    const handleUpdateProfileDetails = async (formValues,setSubmitting) => {
        //clear the error message when ever the reset password button is pressed
        handleMessage(null);

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer " + access_token
          }
        }

        //prepare form data to send to the api to update user profile
        let formData =  createFormData(formValues.firstName,formValues.lastName, image);
        
      try {
        const response = await axios.patch("/api/update_profile_details/", formData , config);
        const result = response.data;
        const { status, message } = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          //update the credentials context with the users new profile details

          alert("Your profile details were updated successfully");

          // open the the profile screen
          navigation.navigate('UpdateProfileDetails');

        }
      
      } catch (error) {
        console.log(error);
        handleMessage('An error occurred. Check your network and try again');
      }
      setSubmitting(false);
    };

    const handleMessage = (message, type = 'FAILED') => {
      setMessage(message);
      setMessageType(type);
    };


    const createFormData = (firstName, lastName,uri) => {
        const fileName = uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        const formData = new FormData();
    
        formData.append('first_name', firstName),
        formData.append('last_name', lastName),
        formData.append('profile_image', { 
          uri, 
          name: fileName, 
          type: `image/${fileType}` 
        },
      );
      
      return formData;
    }

  return (
    <KeyboardAvoidingWrapper>
        <StyledContainer style={{paddingBottom:140}}> 
        <FocusedStatusBar background={COLORS.primary}/>
          <CircleButton imgUrl={assets.whiteLeft} handlePress={() => navigation.goBack()} left={15} top={15}  backgroundColor= {COLORS.brand}/>
          <InnerContainer style={{marginVertical: -40}}> 
          <SubTitle style={{marginTop:40}}>Update Your Profile Details</SubTitle>
          <TouchableOpacity onPress={pickImage}>
              {profile_image === "" ? ( 
                <>
                {image !== null ? (
                <> 
                    <PageLogo resizeMode="cover" source={{ uri: image }} style={{borderRadius: 160}}/>
                    <MaterialIcons name="edit" size={30} color={COLORS.brand} style={{position: "absolute",bottom: 200,right: 0}}/>  
                </>
                ) : (
                  <>
                    <PageLogo resizeMode="cover" source={assets.profileAvatar}/>
                    <MaterialIcons name="edit" size={30} color={COLORS.brand} style={{position: "absolute",bottom: 150,right: 20}}/>
                  </>
                )}
                </>
              ):(
              <>
                <PageLogo resizeMode="cover" source={require("./../assets/images/morena.jpg")} style={{borderRadius: 160}}/>
                <MaterialIcons name="edit" size={30} color={COLORS.brand} style={{position: "absolute",bottom: 200,right: 0}}/>
              </>
            )}
          </TouchableOpacity> 
            <Formik
               initialValues={{firstName: first_name,lastName: last_name, profileImage: profile_image}}
               validationSchema={profileDetailsValidationSchema}
               onSubmit={(values, { setSubmitting }) => {
                 if (values.firstName == '' || values.lastName == '') {
                   handleMessage('Please fill in all fields');
                   setSubmitting(false);
                 }   else {
                   handleUpdateProfileDetails(values, setSubmitting);
                 }
               }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched}) => (
                <StyledFormArea>
                
                <MyTextInput
                    label="First Name"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    value={values.firstName}
                    icon="person"
                  />
                   {touched.firstName && errors.firstName &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.firstName}</Text>
                  }
                  
                <MyTextInput
                    label="Last Name"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    value={values.lastName}
                    icon="person"
                  />
                   {touched.lastName && errors.lastName &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.lastName}</Text>
                  }
                  
                  <MsgBox type={messageType}>{message}</MsgBox>

                  {!isSubmitting && (
                    <StyledButton onPress={handleSubmit}>
                      <ButtonText>Update Profile</ButtonText>
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

const MyTextInput = ({ label, icon, ...props }) => {
    return (
      <View>
        <LeftIcon>
          <Octicons name={icon} size={30} color={COLORS.brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput {...props} />
      </View>
    );
  };

export default UpdateProfileDetails;