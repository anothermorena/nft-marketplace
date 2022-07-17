//1. import all requred packages,hooks and components
//===================================================
import * as yup from 'yup';
import { useState} from 'react';
import { Formik } from 'formik';
import axios from './../api/axios';
import { COLORS} from "../constants";
import {
  Line,
  MsgBox,
  PageLogo,
  TextLink,
  SubTitle,
  PageTitle,
  ButtonText,
  ExtraView,
  ExtraText,
  FormikError,
  StyledButton,
  InnerContainer,
  StyledFormArea,
  TextLinkContent,
  StyledContainer
} from './../components/StyledComponents';
import { ActivityIndicator, SafeAreaView } from 'react-native';
import { FocusedStatusBar,SharedTextInput } from "./../components";
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

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
      
      } catch (error) {
        handleMessage('An error occurred. Check your network and try again');
      }
      setSubmitting(false); 
    };

    const handleMessage = (message, type = 'FAILED') => {
      setMessage(message);
      setMessageType(type);
    };

  return (
    <SafeAreaView style={{flex:1}}>
      <KeyboardAvoidingWrapper>
          <StyledContainer> 
            <FocusedStatusBar background={COLORS.primary}/>
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
                    <SharedTextInput
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
                      <FormikError style={{marginBottom:40 }}>{errors.email}</FormikError>
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
    </SafeAreaView>
    
  )
}

export default ResetPasswordRequest;