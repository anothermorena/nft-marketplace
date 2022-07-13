//1. import all requred packages,hooks and components
//===================================================
import { Formik } from 'formik';
import axios from './../api/axios';
import { COLORS } from "./../constants";
import { useState, useContext } from 'react';
import {
  Line,
  MsgBox,
  PageLogo,
  LeftIcon,
  TextLink,
  SubTitle,
  ExtraText,
  RightIcon,
  PageTitle,
  ExtraView,
  ButtonText,
  StyledButton,
  StyledFormArea,
  InnerContainer,
  TextLinkContent,
  StyledTextInput,
  StyledContainer,
  StyledInputLabel,
} from './../components/StyledComponents';
import * as SecureStore from 'expo-secure-store';
import {  FocusedStatusBar } from './../components';
import { View, ActivityIndicator } from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { CredentialsContext } from './../context/CredentialsContext';
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';


const Login = ({ navigation }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleLogin = async (credentials,setSubmitting) => {
      //clear the error message whenever the login button is pressed
      handleMessage(null);

      const requestBody = {
        body: JSON.stringify(
          `grant_type=&username=${credentials.email}&password=${credentials.password}&scope=&client_id=&client_secret=`
        )
      }

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }

      try {
        const response = await axios.post("/api/login", requestBody, config); 
        const result = response.data;
        //destructure and convert variable names from snake_case to camelCase
        const { access_token: accessToken, status, message, user: {first_name: firstName, last_name: lastName, email, profile_image: profileImage, user_status: userStatus, user_id: userId}} = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          //check if the user's account is verified
          if(userStatus === "UNVERIFIED") {
            alert("Your account is not verified. Verification is required before you can use your account for anything.");
            navigation.navigate('OtpVerificationInput', {email: credentials.email, title: 'Verify Your Account', type:"VERIFY_ACCOUNT"});

          } else {
            //persist the login
            const userObj = {
              accessToken,
              firstName,
              lastName,
              email,
              profileImage,
              userStatus,
              userId
            }

            persistLogin(userObj, message, status);
            //redirect the user to the home screen
            navigation.navigate('Home');
            }
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

    // Persisting login
    const persistLogin = async (credentials, message, status) => {
      await SecureStore.setItemAsync('nftMarketPlace', JSON.stringify(credentials))
        .then(() => {
          //once we are in the then block it means the credentials were successfully stored
          handleMessage(message, status);
          setStoredCredentials(credentials);
        })
        .catch((error) => {
          handleMessage('Persisting login failed');
        });
    };

  return (
    <KeyboardAvoidingWrapper>
        <StyledContainer> 
          <FocusedStatusBar background={COLORS.primary}/>
          <InnerContainer>
              <PageLogo resizeMode="cover" source={require("./../assets/images/nft-login-image.png")}/>
              <PageTitle>NFT Market Place</PageTitle>
              <SubTitle>Account Login</SubTitle>
              
            <Formik
               initialValues={{ email: '', password: '' }}
               onSubmit={(values, { setSubmitting }) => {
                 if (values.email == '' || values.password == '') {
                   handleMessage('Please fill in all fields');
                   setSubmitting(false);
                 } else {
                   handleLogin(values, setSubmitting);
                 }
               }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                <StyledFormArea>
                  <MyTextInput
                    label="Email Address"
                    placeholder="hireme@morena.com"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    icon="mail"
                  />
                  <MyTextInput
                    label="Password"
                    placeholder="* * * * * * * *"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={hidePassword}
                    icon="lock"
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                  />
                  <MsgBox type={messageType}>{message}</MsgBox>

                  {!isSubmitting && (
                    <StyledButton onPress={handleSubmit}>
                      <ButtonText>Login</ButtonText>
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
                    <TextLink onPress={() => navigation.navigate('ResetPasswordRequest')}>
                      <TextLinkContent>Reset Password</TextLinkContent>
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

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
      <View>
        <LeftIcon>
          <Octicons name={icon} size={30} color={COLORS.brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput {...props} />
        {isPassword && (
          <RightIcon
            onPress={() => {
              //toggle the value of the hide password on press
              setHidePassword(!hidePassword);
            }}
          >
            <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={COLORS.darkLight} />
          </RightIcon>
        )}
      </View>
    );
  };

export default Login;