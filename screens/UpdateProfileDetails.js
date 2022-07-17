//1. import all requred packages,hooks and components
//===================================================
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from './../api/axios';
import { useState,useContext } from 'react';
import { COLORS,assets } from "./../constants";
import {
  MsgBox,
  PageLogo,
  SubTitle,
  FormikError,
  ButtonText,
  StyledButton,
  InnerContainer,
  StyledFormArea,
  StyledContainer
} from './../components/StyledComponents';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons} from '@expo/vector-icons';
import { CredentialsContext } from './../contexts/CredentialsContext';
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';
import {ActivityIndicator, TouchableOpacity,SafeAreaView } from 'react-native';
import { FocusedStatusBar,CircleButton,SharedTextInput } from './../components';

const UpdateProfileDetails = ({navigation}) => {
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const [image, setImage] = useState(null);
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);
    const { accessToken,firstName,lastName,profileImage} = storedCredentials;

    //profile details validation
    const profileDetailsValidationSchema = yup.object().shape({
        firstName: yup
        .string()
        .required('Your first name is required'),
        lastName: yup
        .string()
        .required('Your last name is required')
        
    });

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
            Authorization: "Bearer " + accessToken
          }
        }

        //prepare form data to send to the api to update user profile
        let formData =  createFormData(formValues.firstName,formValues.lastName, image);
        
      try {
        const response = await axios.patch("/api/update_profile_details/", formData , config);
        const result = response.data;
        const {status, message, data } = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {

          //update the credentials context with the users new profile details
          const newStoredCredentials = {
              ...storedCredentials,
              firstName: data.first_name, 
              lastName: data.last_name, 
              profileImage: data.profile_image    
          }
          setStoredCredentials(newStoredCredentials);
          alert("Your profile details were updated successfully.");
          navigation.navigate('Home');
        }
      
      } catch (error) {
        handleMessage('An error occurred. Check your network and try again');
      }
      setSubmitting(false);
    };

    const handleMessage = (message, type = 'FAILED') => {
      setMessage(message);
      setMessageType(type);
    };


    const createFormData = (firstName, lastName,uri) => {
      const formData = new FormData();

      //check if user uploaded an image
      if (uri) {
        //user uploaded an image: append the file
        const fileName = image.split('/').pop();
        const fileType = fileName.split('.').pop();
        formData.append('profile_image', { 
          uri, 
          name: fileName, 
          type: `image/${fileType}` 
        },
      );
      }
        
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
         
      return formData;
    }

  return (
    <SafeAreaView style={{flex:1}}>
      <KeyboardAvoidingWrapper>
          <StyledContainer style={{paddingBottom:140}}> 
          <FocusedStatusBar background={COLORS.primary}/>
            <CircleButton imgUrl={assets.whiteLeft} handlePress={() => navigation.goBack()} left={15} top={15}  backgroundColor= {COLORS.brand}/>
            <InnerContainer style={{marginVertical: -40}}> 
            <SubTitle style={{marginTop:40}}>Update Your Profile Details</SubTitle>
            <TouchableOpacity onPress={pickImage}>

            {!image && !profileImage && (
                <>
                  <PageLogo resizeMode="cover" source={assets.profileAvatar}/>
                  <MaterialIcons name="edit" size={30} color={COLORS.brand} style={{position: "absolute",bottom: 150,right: 20}}/> 
                </>
              )}

            {image && (
                <>
                  <PageLogo resizeMode="cover" source={{ uri: image }} style={{borderRadius: 160}}/>
                  <MaterialIcons name="edit" size={30} color={COLORS.brand} style={{position: "absolute",bottom: 200,right: 0}}/> 
                </>
              )}
              
              {!image && profileImage && (
                <>
                  <PageLogo resizeMode="cover" source={{uri: profileImage}} style={{borderRadius: 200}}/>
                  <MaterialIcons name="edit" size={30} color={COLORS.brand} style={{position: "absolute",bottom: 200,right: 0}}/>
                </>
              )}
    
            </TouchableOpacity> 
              <Formik
                initialValues={{firstName: firstName,lastName: lastName, profileImage: profileImage}}
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
                  
                  <SharedTextInput
                      label="First Name"
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                      icon="person"
                    />
                    {touched.firstName && errors.firstName &&
                      <FormikError>{errors.firstName}</FormikError>
                    }
                    
                  <SharedTextInput
                      label="Last Name"
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                      icon="person"
                    />
                    {touched.lastName && errors.lastName &&
                      <FormikError>{errors.lastName}</FormikError>
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
    </SafeAreaView> 
  )
}

export default UpdateProfileDetails;