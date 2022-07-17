//1. import all requred packages,hooks and components
//===================================================
import axios from './../api/axios';
import {useState, useEffect} from 'react';
import {
    MsgBox,
    IconBg,
    TopHalf,
    InfoText,
    ButtonText,
    StyledText,
    InlineGroup,
    StyledButton,
    EmphasizeText,
    StyledContainer,
} from './../components/StyledComponents';
import { COLORS } from "./../constants";
import { FocusedStatusBar } from './../components';
import ResendTimer from '../components/ResendTimer';
import {Octicons,Ionicons} from '@expo/vector-icons';
import CodeInputField from '../components/CodeInputField';
import VerificationModal from '../components/VerificationModal';
import {ActivityIndicator, View,SafeAreaView} from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';


const OtpVerification = ({route, navigation}) => {
    const { email, title, type} = route.params;
    const [code, setCode] = useState('');
    const [pinReady, setPinReady] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const MAX_CODE_LENGTH = 4;
    const [modalVisible, setModalVisible] = useState(false);
    const [verificationSuccessful, setVerificationSuccessful] = useState(false);
    const [message, handleMessage] = useState(null);
    const [resendingEmail, setResendingEmail] = useState(false);
    const [resendStatus, setResendStatus] = useState('Resend');
    const [timeLeft,setTimeLeft] = useState(null);
    const [targetTime,setTargetTime] = useState(null);

    //active resend will be true whenever the system is ready to allow a resend request
    const [activeResend,setActiveResend] = useState(false);

    //the timer will be triggered at an interval and we use this variable to monitor that
    let resendTimerInterval;

    const calculateTimeLeft = (finalTime) => { 
        const difference = finalTime - +new Date(); //the + before the new keyword is used to convert the date to a number. It is a shorthand for the syntax 
        if(difference >= 0 ) {
            setTimeLeft(Math.round(difference/1000));
        } else {
            //there is no time to wait
            setTimeLeft(null);
            clearInterval(resendTimerInterval);
            setActiveResend(true);//use to activate the resend button
        }
    }

    //trigger the timer function
    const triggerTimer = (targetTimeInSeconds = 30) => { 
        setTargetTime(targetTimeInSeconds);
        setActiveResend(false);
        const finalTime = +new Date() + (targetTimeInSeconds * 1000);
        resendTimerInterval = setInterval(() => {
            calculateTimeLeft(finalTime),1000; //this means our function should be called every second 
        });
    }

    useEffect(() => { 
        triggerTimer();
        //to prevent memory leaks, once the component unmounts, we clear the interval
        return () => { 
            clearInterval(resendTimerInterval);
        }
    }, []);

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

    const submitOTPVerification = async () => {
        setVerifying(true);
        try 
            {
            const response = await axios.patch("/api/verify_otp", JSON.stringify({ email: email, otp: code, request_type: type }), config);
            const result = response.data;
            const { status, message } = result;

            if (status !== 'SUCCESS' && type === "VERIFY_ACCOUNT") {
              //set the error message from received from api endpoint
              handleMessage(message);
              //account verification failed: : show the successful verification modal
              setVerificationSuccessful(false);
              setModalVisible(true);
           
              }
              else if (status !== 'SUCCESS' && type === "RESET_PASSWORD_REQUEST") {
                //set the error message from received from api endpoint
                // we do not use the modals for password reset. 
                handleMessage(message);
             
              }
              else if (status == 'SUCCESS' && type === "VERIFY_ACCOUNT") {
              //Account was verified successfully: show the successful verification modal
              handleMessage(message);
              setVerificationSuccessful(true);
              setModalVisible(true);
             
              } 
              else if (status == 'SUCCESS' && type === "RESET_PASSWORD_REQUEST") {
                //reset password request was successful: redirect the user to the reset password screen 
                navigation.navigate('ResetPasswordInput',{
                    email,
                    code
                  });
            }  
          } catch (error) { 
              handleMessage('An error occurred. Check your network and try again');
              setVerificationSuccessful(false);
          }
          setVerifying(false);
    }

   //resend email function
    const resendEmail = async () => { 
        setResendingEmail(true);

          try {
              await axios.post("/api/send_otp", JSON.stringify({ email: email }), config);
              handleMessage('A new OTP was sent to your email. Please also check it in the spam/junk box if you cannot find it in the inbox folder.');

              //set the resend status to Resend to enable the use to try again just incase the previous attempt did not work
              setResendStatus('Resend');
          
          } catch (error) {
            handleMessage('An error occurred. Check your network and try again');
            setResendStatus('Failed');

            
          }
          setResendingEmail(false);
          setActiveResend(false);
          //disable the resend button for 30 seconds again
          triggerTimer();
    }

  return (
    <SafeAreaView style={{flex:1}}>
        <KeyboardAvoidingWrapper>
            <StyledContainer style={{alignItems:'center'}}>     
                <FocusedStatusBar background={COLORS.primary}/>
                <TopHalf>
                    <IconBg>
                        <Octicons name="lock" size={125} color={COLORS.brand}/>
                    </IconBg>
                </TopHalf>
                <View style={{flex:1, justifyContent:'center',padding:20,justifyContent:'space-around'}}>
                <StyledText>{title}</StyledText>
                <InfoText>
                Please enter the 4 digit code sent to
                <EmphasizeText>
                    {` ${email}`} 
                </EmphasizeText>
                </InfoText>

                <CodeInputField 
                    setPinReady={setPinReady}
                    code={code}
                    setCode={setCode}
                    maxLength={MAX_CODE_LENGTH}
                />
                {!verifying && pinReady && (
                    <StyledButton onPress={submitOTPVerification} style={{backgroundColor:COLORS.green}}>
                        <InlineGroup>
                            <ButtonText>Verify</ButtonText>
                            <Ionicons name="checkmark-circle" size={25} color={COLORS.white}/>
                        </InlineGroup>
                    </StyledButton>
                )}

                {!verifying && !pinReady && (
                <StyledButton style={{backgroundColor:COLORS.lightGreen}}>
                    <InlineGroup> 
                        <ButtonText style={{color:COLORS.primary, fontSize:16}}>Verify</ButtonText>
                        <Ionicons name="checkmark-circle" size={25} color={COLORS.primary}/>
                    </InlineGroup>
                </StyledButton>
                )}

                {verifying  && (
                    <StyledButton style={{backgroundColor:COLORS.green, flexDirection: 'row'}}>
                        <InlineGroup>
                            <ActivityIndicator size="large" color={COLORS.white}/>
                        </InlineGroup>
                    </StyledButton>
                )}

                {message && <MsgBox>{message}</MsgBox> }

                <ResendTimer 
                    activeResend={activeResend}
                    resendStatus={resendStatus}
                    resendingEmail={resendingEmail}
                    timeLeft={timeLeft}
                    targetTime={targetTime}
                    resendEmail={resendEmail}
                />
                </View>
                <VerificationModal 
                    successful = {verificationSuccessful}
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    message={message}
                    navigation={navigation}
                />
            </StyledContainer>   
        </KeyboardAvoidingWrapper>
    </SafeAreaView>
  )
}

export default OtpVerification;