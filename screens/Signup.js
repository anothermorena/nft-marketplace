//1. import all requred packages,hooks and components
//===================================================
import * as yup from 'yup';
import { Formik } from 'formik';
import { useState} from 'react';
import axios from './../api/axios';
import { COLORS } from "./../constants";
import {
  Line,
  MsgBox,
  SubTitle,
  TextLink,
  ExtraView,
  PageTitle,
  ExtraText,
  ButtonText,
  FormikError,
  StyledButton,
  InnerContainer,
  StyledFormArea,
  StyledContainer,
  TextLinkContent
} from './../components/StyledComponents';
import {  ActivityIndicator, SafeAreaView } from 'react-native';
import { FocusedStatusBar,SharedTextInput } from './../components';
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

const Signup = ({ navigation }) => {
  //Sign up form validation
  const signupValidationSchema = yup.object().shape({
    firstName: yup
      .string()
      .required('First Name is Required'),
    lastName: yup
      .string()
      .required('Last Name is Required'),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required')
  });

  //set initial states
  const [hidePassword, setHidePassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const handleSignup = async (formValues, setSubmitting) => {
      handleMessage(null);

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

      try {
        const response = await axios.post("/api/users", JSON.stringify({ first_name: formValues.firstName, last_name: formValues.lastName, email: formValues.email, profile_image : "", user_status:"UNVERIFIED", hashed_password: formValues.password }), config);
        const result = response.data;
        const { status, message, email } = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          navigation.navigate('Verification',{
            email: email
          })
        }  
      } catch (error) {
        handleMessage('An error occurred. Check your network and try again');
      }
      setSubmitting(false);
    };

    const handleMessage = (message, type = '') => {
      setMessage(message);
      setMessageType(type);
    };

  return (
    <SafeAreaView style={{flex:1}}>
      <KeyboardAvoidingWrapper>
        <StyledContainer>
          <FocusedStatusBar background={COLORS.primary}/>
            <InnerContainer>
              <PageTitle>NFT Market Place</PageTitle>
              <SubTitle>Create Account</SubTitle>
              <Formik
                initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
                validationSchema={signupValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  if (
                    values.email == '' ||
                    values.password == '' ||
                    values.firstName == '' ||
                    values.lastName == '' ||
                    values.confirmPassword == ''
                  ) {
                    handleMessage('Please fill in all fields');
                    setSubmitting(false);
                  } else if (values.password !== values.confirmPassword) {
                    handleMessage('Passwords do not match');
                    setSubmitting(false);
                  } else {
                    handleSignup(values, setSubmitting);
                  }
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched }) => (
                  <StyledFormArea>
                    <SharedTextInput
                      label="First Name"
                      placeholder="Otsogile "
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                      icon="person"
                    />
                    {touched.firstName && errors.firstName && <FormikError>{errors.firstName}</FormikError>}

                    <SharedTextInput
                      label="Last Name"
                      placeholder="Onalepelo "
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                      icon="person"
                    />
                    {touched.lastName && errors.lastName && <FormikError>{errors.lastName}</FormikError>}

                    <SharedTextInput
                      label="Email Address"
                      placeholder="hireme@morena.dev"
                      placeholderTextColor={COLORS.darkLight}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      icon="mail"
                    />
                    {touched.email && errors.email && <FormikError>{errors.email}</FormikError>}

                    <SharedTextInput
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
                    {touched.password && errors.password && <FormikError>{errors.password}</FormikError>}
                    <SharedTextInput
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
                        <ButtonText>Signup</ButtonText>
                      </StyledButton>
                    )}

                    {isSubmitting && (
                      <StyledButton disabled={true}>
                        <ActivityIndicator size="large" color={COLORS.white} />
                      </StyledButton>
                    )}

                    <Line />
                    <ExtraView>
                        <ExtraText>Already have an account? </ExtraText>
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
  );
};


export default Signup;