//1. import all requred packages,hooks and components
//===================================================
import * as yup from 'yup';
import { Formik } from 'formik';
import { useState } from 'react';
import axios from './../api/axios';
import { COLORS } from "./../constants";
import {
  Line,
  IconBg,
  MsgBox,
  TopHalf,
  LeftIcon,
  TextLink,
  SubTitle,
  ExtraView,
  ExtraText,
  RightIcon,
  ButtonText,
  FormikError,
  StyledButton,
  StyledFormArea,
  InnerContainer,
  TextLinkContent,
  StyledTextInput,
  StyledContainer,
  StyledInputLabel,
} from './../components/StyledComponents';
import {  FocusedStatusBar } from './../components';
import { View, ActivityIndicator } from 'react-native';
import { Octicons, Ionicons , MaterialCommunityIcons} from '@expo/vector-icons';
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

const ResetPasswordInput = ({ route, navigation }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState();
    const [messageType, setMessageType] = useState();

    //get the email the user used to create the reset password request and the otp
    const { email, code } = route.params;

    //Password Validation schema
    const passwordValidationSchema = yup.object().shape({
        password: yup
        .string()
        .min(8, ({ min }) => `Password must be at least ${min} characters`)
        .required('Password is required')
    });

    const handleResetPassword = async (formValues,setSubmitting) => {
        //clear the error message when ever the reset password is pressed
        handleMessage(null);

        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        }

      try {
        const response = await axios.patch("/api/reset_password", JSON.stringify({ email: email, otp: code, password: formValues.password, confirm_password:formValues.confirmPssword }), config);
        const result = response.data;
        const { status, message } = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          //password reset was successful: redirect the user to the login page
          navigation.navigate('Login');
    
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
    <KeyboardAvoidingWrapper>
        <StyledContainer> 
          <FocusedStatusBar background={COLORS.primary}/>
          <InnerContainer>
          <TopHalf>
                <IconBg>
                    <MaterialCommunityIcons name="lock-reset" size={125} color={COLORS.brand}/>
                </IconBg>
            </TopHalf>
            <SubTitle>Reset Password</SubTitle>
              
            <Formik
               initialValues={{password: '', confirmPassword: ''}}
               validationSchema={passwordValidationSchema}
               onSubmit={(values, { setSubmitting }) => {
                 if (values.password == '' || values.confirmPassword == '') {
                   handleMessage('Please fill in all fields');
                   setSubmitting(false);
                 }  else if (values.password !== values.confirmPassword) {
                    handleMessage('Passwords do not match');
                    setSubmitting(false);
                  } else {
                    handleResetPassword(values, setSubmitting);
                 }
               }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched}) => (
                <StyledFormArea>
                
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
                   {touched.password && errors.password &&
                    <FormikError>{errors.password}</FormikError>
                  }

                  <MyTextInput
                    label="Confirm Password"
                    placeholder="* * * * * * * *"
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    secureTextEntry={hidePassword}
                    icon="lock"
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                  />
                  <MsgBox type={messageType}>{message}</MsgBox>

                  {!isSubmitting && (
                    <StyledButton onPress={handleSubmit}>
                      <ButtonText>Reset Password</ButtonText>
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


const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
      <View>
        <LeftIcon>
          <Octicons name={icon} size={30} color={COLORS.brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput {...props} />
          <RightIcon
            onPress={() => {
              //toggle the value of the hide password on press
              setHidePassword(!hidePassword);
            }}
          >
            <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={COLORS.darkLight} />
          </RightIcon>
      </View>
    );
  };

export default ResetPasswordInput;