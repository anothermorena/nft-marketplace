//1. import all requred packages,hooks and components
//===================================================
import axios from '../api/axios';
import { COLORS} from "../constants";
import {
  MsgBox,
  IconBg,
  TopHalf,
  InfoText,
  StyledText,
  ButtonText,
  InlineGroup,
  StyledButton,
  EmphasizeText,
  InnerContainer,
  StyledContainer
} from './../components/StyledComponents';
import {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native';
import {Ionicons } from '@expo/vector-icons';
import { FocusedStatusBar } from './../components';
import ResendTimer from './../components/ResendTimer';

const Verification = ({route, navigation}) => {
    const { email } = route.params;
    const [resendingEmail, setResendingEmail] = useState(false);
    const [resendStatus, setResendStatus] = useState('Resend');
    const [timeLeft,setTimeLeft] = useState(null);
    const [targetTime,setTargetTime] = useState(null);
    const [activeResend,setActiveResend] = useState(false);
    const [message, handleMessage] = useState(null);
    let resendTimerInterval;

    const calculateTimeLeft = (finalTime) => { 
        const difference = finalTime - +new Date(); 
        if(difference >= 0 ) {
            setTimeLeft(Math.round(difference/1000));
        } else {
            setTimeLeft(null);
            clearInterval(resendTimerInterval);
            setActiveResend(true);
        }

    }

    const triggerTimer = (targetTimeInSeconds = 30) => { 
        setTargetTime(targetTimeInSeconds);
        setActiveResend(false);
        const finalTime = +new Date() + (targetTimeInSeconds * 1000);

        resendTimerInterval = setInterval(() => {
            calculateTimeLeft(finalTime),1000;  
    });
    }

    useEffect(() => { 
        triggerTimer();

        return () => { 
            clearInterval(resendTimerInterval);
        }
    }, []);

    //resend email function
    const resendEmail = async () => { 
        setResendStatus('Sending');
        setResendingEmail(true);

        const config = {
            headers: {
              'Content-Type': 'application/json'
            }
          }
    
          try {
            const response = await axios.post("/api/send_otp", JSON.stringify({ email: email }), config);
            const result = response.data;
            const { status, message } = result;
    
            if (status !== 'SUCCESS') {
              handleMessage(message);
              setResendStatus('Failed');

            } else {
              handleMessage("A new otp was sent successfully.");
            }
          
          } catch (error) {
            handleMessage('An error occurred. Check your network and try again');
            setResendStatus('Resend');
          }

          setResendingEmail(false);
          triggerTimer();
    }

    //takes the user to the OTP verification input screen
    const otpInputScreen = () => {
      navigation.navigate('OtpVerificationInput',{
        email: email,
        title: 'Account Verification',
        type:'VERIFY_ACCOUNT'
      
      });
    }

  return (
    <SafeAreaView style={{flex:1}}>
      <StyledContainer style={{alignItems: 'center'}}>
        <FocusedStatusBar background={COLORS.primary}/>
        <InnerContainer>
            <TopHalf>
                <IconBg>
                    <Ionicons name="mail-open-outline" size={125} color={COLORS.brand} />
                </IconBg>
            </TopHalf>
            <StyledText>Account Created Successfully</StyledText>
            <InfoText>
                Please verify your account using the OTP sent to 
                <EmphasizeText>
                    {` ${email}`} 
                </EmphasizeText>
            </InfoText>
            <StyledButton onPress={otpInputScreen}>
              <InlineGroup>
                <ButtonText>Proceed</ButtonText>
                <Ionicons name="arrow-forward-circle" size={25} color={COLORS.white} />
              </InlineGroup> 
            </StyledButton>
            {message && <MsgBox>{message}</MsgBox> }
            <ResendTimer 
                activeResend={activeResend}
                resendStatus={resendStatus}
                resendingEmail={resendingEmail}
                timeLeft={timeLeft}
                targetTime={targetTime}
                resendEmail={resendEmail}
            />
          </InnerContainer>
      </StyledContainer>
    </SafeAreaView>
  )
}

export default Verification;