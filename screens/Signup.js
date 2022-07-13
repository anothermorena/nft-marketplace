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
  LeftIcon,
  RightIcon,
  ExtraView,
  PageTitle,
  ExtraText,
  ButtonText,
  FormikError,
  StyledButton,
  InnerContainer,
  StyledFormArea,
  StyledTextInput,
  StyledContainer,
  TextLinkContent,
  StyledInputLabel,
} from './../components/StyledComponents';
import { FocusedStatusBar } from './../components';
import { View, ActivityIndicator} from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
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
                  <MyTextInput
                    label="First Name"
                    placeholder="Otsogile "
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    value={values.firstName}
                    icon="person"
                  />
                  {touched.firstName && errors.firstName && <FormikError>{errors.firstName}</FormikError>}

                  <MyTextInput
                    label="Last Name"
                    placeholder="Onalepelo "
                    placeholderTextColor={COLORS.darkLight}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    value={values.lastName}
                    icon="person"
                  />
                  {touched.lastName && errors.lastName && <FormikError>{errors.lastName}</FormikError>}

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
                  {touched.email && errors.email && <FormikError>{errors.email}</FormikError>}

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
                  {touched.password && errors.password && <FormikError>{errors.password}</FormikError>}
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
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
          <Octicons name={icon} size={30} color={COLORS.brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />

      {isPassword && (
        <RightIcon onPress={() => {setHidePassword(!hidePassword);}}>
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={COLORS.darkLight} />
        </RightIcon>
      )}
    </View>
  );
};

export default Signup;