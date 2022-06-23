import { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
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
  RightIcon,
  InnerContainer,
  ButtonText,
  MsgBox,
  Line,
  ExtraView,
  ExtraText,
  TextLink,
  TextLinkContent
} from './../components/StyledComponents';
import { View, ActivityIndicator } from 'react-native';

// our theme config and other constants
import { COLORS, Constants } from "../constants";

// get status bar height
const StatusBarHeight = Constants.statusBarHeight;

// icons
import { Octicons, Ionicons } from '@expo/vector-icons';

// keyboard avoiding view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

//import axios
import axios from './../api/axios';

//expo async secure local storage.
import * as SecureStore from 'expo-secure-store';

// credentials context
import { CredentialsContext } from './../components/CredentialsContext';


const Login = ({ navigation }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    // credentials context
    const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);

    const handleLogin = async (credentials,setSubmitting) => {
      //clear the error message whenever the login button is pressed

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
        const { status, message, data } = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          //login was successful persist the login
          persistLogin({ ...data}, message, status);
    
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

  //TODO: move this functiotn to the logout page later
  //log out the user
  const clearLogin = async () => {
    await SecureStore.deleteItemAsync('nftMarketPlace')
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
  };
  

  return (
    <KeyboardAvoidingWrapper>
        <StyledContainer> 
          <StatusBar style="dark" />
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
                    <TextLink onPress={() => navigation.navigate('ResetPassword')}>
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