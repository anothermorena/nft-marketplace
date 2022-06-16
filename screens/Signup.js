import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';

// formik
import { Formik } from 'formik';

//yup for formik form validation
import * as yup from 'yup';

// builtin react native components
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput} from 'react-native';

// icons
import { Octicons, Ionicons } from '@expo/vector-icons';

// keyboard avoiding view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

// our theme config and other constants
import { COLORS, Constants } from "../constants";

// get status bar height
const StatusBarHeight = Constants.statusBarHeight;

// API client
import axios from './../api/axios';

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

    //Handle sign up form submission
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
        const { status, message, data } = result;

        if (status !== 'SUCCESS') {
          handleMessage(message, status);
        } else {
          //Signup was successful redirect the user to the home page
          navigation.navigate('Home')
       
        }
        setSubmitting(false);
      
      } catch (error) {
        setSubmitting(false);
        handleMessage('An error occurred. Check your network and try again');
        console.log(error.toJSON());
  
      }
    };

    const handleMessage = (message, type = '') => {
      setMessage(message);
      setMessageType(type);
    };

  return (
    <KeyboardAvoidingWrapper>
      <View style={{flex:1,padding: 25, paddingTop: StatusBarHeight + 30, backgroundColor: COLORS.white}}>
        <StatusBar style="dark" />
        <View style={{flex:1, width:'100%', alignItems:'center'}}>
          <Text style={{fontSize:30, textAlign:'center',fontWeight:'bold', color: COLORS.brand}}>NFT Market Place</Text>
          <Text style={{fontSize: 18, marginBottom:20, letterSpacing: 1, fontWeight: 'bold', color:COLORS.tertiary}}>Create Account</Text>

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
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting,errors, touched }) => (
              <View style={{width:'90%'}}>
                <MyTextInput
                  label="First Name"
                  placeholder="Otsogile "
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
                  placeholder="Onalepelo "
                  placeholderTextColor={COLORS.darkLight}
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  value={values.lastName}
                  icon="person"
                />
                 {touched.lastName && errors.lastName &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.lastName}</Text>
                  }
                <MyTextInput
                  label="Email Address"
                  placeholder="andyj@gmail.com"
                  placeholderTextColor={COLORS.darkLight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  icon="mail"
                />
                 {touched.email && errors.email &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
                  }

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
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
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
                
                <Text style={{textAlign:'center', fontSize:13, color: messageType == "SUCCESS" ? COLORS.green : COLORS.red}}>{message}</Text>

                {!isSubmitting && (
                  <TouchableOpacity style={{padding: 15,backgroundColor: COLORS.brand, justifyContent:'center',alignItems:'center', borderRadius:5, marginVertical:5, height:60}} onPress={handleSubmit}>
                    <Text style={{color: COLORS.white, fontSize:16}}>Signup</Text>
                  </TouchableOpacity>
                )}
                {isSubmitting && (
                  <TouchableOpacity style={{padding: 15,backgroundColor: COLORS.brand, justifyContent:'center',alignItems:'center', borderRadius:5, marginVertical:5, height:60}} disabled={true}>
                    <ActivityIndicator size="large" color={COLORS.white} />
                  </TouchableOpacity>
                )}

                <View style={{height:1, width:'100%',backgroundColor:COLORS.darkLight, marginVertical:10}} />
                <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center',padding:10}}>
                  <Text style={{justifyContent:'center',alignContent:'center',color:COLORS.tertiary, fontSize:15}}>Already have an account? </Text>
                  <TouchableOpacity style={{justifyContent:'center', alignItems:'center'}} onPress={() => navigation.navigate('Login')}>
                    <Text style={{color:COLORS.brand, fontSize:15}}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </KeyboardAvoidingWrapper>
  );
};

//this component is only going to be used here hence we created in this file
const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <View style={{position:'absolute',left:15,top:38,zIndex:1}}>
        <Octicons name={icon} size={30} color={COLORS.brand} />
      </View>
      <Text style={{color:COLORS.tertiary,fontSize:13,textAlign:'left'}}>{label}</Text>

    <TextInput style={{backgroundColor: COLORS.secondaryLight,padding:15,paddingLeft:55,paddingRight:55,borderRadius:5,fontSize:16,height:60,marginVertical:3,marginBottom:10}} {...props} />

      {isPassword && (
        <TouchableOpacity style={{position:'absolute',right:15,top:38,zIndex:1}}
          onPress={() => {
            setHidePassword(!hidePassword);
          }}
        >
          <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={30} color={COLORS.darkLight} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Signup;