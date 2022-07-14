//1. import all required packages constants and components
//==============================================
import styled from 'styled-components';
import { COLORS, Constants } from "./../constants";
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';


// get status bar height
const StatusBarHeight = Constants.statusBarHeight;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 30}px;
  padding-bottom: 45px;
  background-color: ${COLORS.white};
`;

export const InnerContainer = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
`;


export const PageLogo = styled.Image`
  width: 250px;
  height: 250px;
`;

export const CodeInput = styled.View`
  border-color: ${COLORS.lightGreen};
  min-width: 15%;
  border-width: 2px;
  border-radius: 5px;
  padding: 12px;
`;

//when a particular digit is focussed we want to apply the following styles
export const CodeInputFocused = styled(CodeInput)`
  border-color: ${COLORS.green};
`;

//pin input styles
export const CodeInputSection = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    margin-vertical: 30px;

`;

export const HiddenTextInput = styled.TextInput`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

//container for our splits inputs
export const CodeInputsContainer = styled.Pressable`
    width: 70%;
    flex-direction: row;
    justify-content: space-between;
`;


//actual text that will be on the above view
export const CodeInputText = styled.Text`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: ${COLORS.brand};
`;


export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${COLORS.brand};
  padding: 10px;
`;

export const SubTitle = styled.Text`
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${COLORS.tertiary};
`;

export const FormikError = styled.Text`
  font-size: 10px;
  color: ${COLORS.red};
`;

export const StyledText = styled.Text`
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: ${COLORS.brand};
  padding: 10px;
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${COLORS.secondaryLight};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${COLORS.tertiary};
`;

export const StyledInputLabel = styled.Text`
  color: ${COLORS.tertiary};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcon = styled.View`
  left: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${COLORS.brand};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
`;

export const ButtonText = styled.Text`
  color: ${COLORS.white};
  font-size: 16px;
`;

export const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${props => props.type == "SUCCESS" ? COLORS.green : COLORS.red};
`;

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${COLORS.darkLight};
  margin-vertical: 10px;
`;

export const StyledFormArea = styled.View`
  width: 90%;
`;

export const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

export const ExtraText = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${COLORS.tertiary};
  font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const TextLinkContent = styled.Text`
  color: ${COLORS.brand};
  font-size: 15px;

  ${(props) => {
    const {resendStatus} = props;
    if(resendStatus === 'FAILIED') {
      return `color: ${COLORS.red}`;
    } else if (resendStatus === 'SUCCESS') {
      return `color: ${COLORS.green}`;
    }
  }}
`;

//verification components
export const TopHalf = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

export const BottomHalf = styled(TopHalf)`
    justify-content: space-around;
`;

export const IconBg = styled.View`
    width:250px;
    height:250px;
    background-color: ${COLORS.lightGreen};
    border-radius:250px;
    justify-content:center;
    align-items:center;
`;

export const InfoText = styled.Text`
    color: ${COLORS.gray};
    font-size:15px;
    text-align:center;
`;

export const EmphasizeText = styled.Text`
    font-weight:bold;
    font-style:italic;
`;

export const InlineGroup = styled.View`
    flex-direction:row;
    justify-content:center;
    align-items:center;
`;

export const ModalView = styled.View`
  margin: 20px;
  background-color: white;
  border-radius: 20px;
  padding: 35px;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  width: 100%;
`;

//screen divider styles
export const ScreenDividerContainer = styled.View`
  position: absolute; 
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  zIndex: -1;
`;

export const TopScreenDivider = styled.View`
  height: 300px;
  background-color: ${COLORS.brand}; 
`;

export const BottomScreenDivider = styled.View`
  flex: 1; 
  background-color: ${COLORS.white};
`;