import { useState} from 'react';
import { Formik } from 'formik';
import {
  StyledContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledInputLabel,
  StyledFormArea,
  StyledButton,
  StyledTextInput,
  LeftIcon,
  InnerContainer,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent
} from './../components/StyledComponents';
import { FocusedStatusBar } from "../components";
import { View, ActivityIndicator, Text } from 'react-native';

// our theme config and other constants
import { COLORS} from "../constants";


// icons
import { Octicons } from '@expo/vector-icons';

// keyboard avoiding view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

//import axios
import axios from './../api/axios';

//yup for formik form validation
import * as yup from 'yup';


const ResetPasswordRequest = ({ navigation }) => {

    //request password reset input validation
    const requestPasswordResetValidationSchema = yup.object().shape({
        email: yup
        .string()
        .email("Please enter a valid email address")
        .required('Email Address is Required')
     });

    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    const handlePasswordResetRequest = async (resetEmail,setSubmitting) => {

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

      try {
        const response = await axios.post("/api/send_otp", JSON.stringify({ email: resetEmail.email }), config);
        const result = response.data;
        const { status, message } = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          //redirect to otp verification input screen
          navigation.navigate('OtpVerificationInput', {email: resetEmail.email, title: 'Password Reset', type:"RESET_PASSWORD_REQUEST"});
        }
        setSubmitting(false);
      
      } catch (error) {
        setSubmitting(false);
        handleMessage('An error occurred. Check your network and try again');
        console.log(error.toJSON());
      }
      
    };

    const handleMessage = (message, type = 'FAILED') => {
      setMessage(message);
      setMessageType(type);
    };

  return (
    <KeyboardAvoidingWrapper>
        <StyledContainer> 
        <FocusedStatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true}/>
          <InnerContainer>
              <PageLogo resizeMode="cover" source={require("./../assets/images/nft-login-image.png")}/>
              <PageTitle>NFT Market Place</PageTitle>
              <SubTitle>Request Password Reset</SubTitle>
              
            <Formik
               initialValues={{ email: ''}}
               validationSchema={requestPasswordResetValidationSchema}
               onSubmit={(values, { setSubmitting }) => {
                 if (values.email == '') {
                   handleMessage('Please fill in the email field');
                   setSubmitting(false);
                 } else {
                    handlePasswordResetRequest(values, setSubmitting);
                 }
               }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting,errors,touched }) => (
                <StyledFormArea>
                  <MyTextInput
                    label="Email Address"
                    placeholder="enter your email"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    icon="mail"
                  />
                  {touched.email && errors.email &&
                    <Text style={{ fontSize: 10, color: 'red', marginBottom:40 }}>{errors.email}</Text>
                  }

                  <MsgBox type={messageType}>{message}</MsgBox>
                 
                  {!isSubmitting && (
                    <StyledButton onPress={handleSubmit}>
                      <ButtonText>Request Password Reset</ButtonText>
                    </StyledButton>
                  )}
                  {isSubmitting && (
                    <StyledButton disabled={true}>
                      <ActivityIndicator size="large" color={COLORS.white} />
                    </StyledButton>
                  )}
              
                  <Line />

                  <ExtraView>
                    <ExtraText>Don't have an account already? </ExtraText>
                    <TextLink onPress={() => navigation.navigate('Signup')}>
                      <TextLinkContent>Signup</TextLinkContent>
                    </TextLink>
                  </ExtraView>

                  <ExtraView>
                  <ExtraText> Or </ExtraText>
                    <TextLink onPress={() => navigation.navigate('Login')}>
                      <TextLinkContent>Login</TextLinkContent>
                    </TextLink>
                  </ExtraView>
                
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

export default ResetPasswordRequest;