//1. import all required constants and components
//===============================================
import {
  InfoText,
  PageTitle,
  ModalView,
  ButtonText,
  StyledButton,
} from './../components/StyledComponents';
import { Modal, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, Constants } from './../constants';
import FocusedStatusBar from './FocusedStatusBar';

const StatusBarHeight = Constants.statusBarHeight;

const VerificationModal = ({
  modalVisible,
  setModalVisible,
  successful,
  message,
  navigation,
}) => {
  const buttonHandler = () => {
    if (successful) {
      //redirect the user to the log in screen
      navigation.navigate('Home');
    }
    setModalVisible(false);
  };

  return (
    <Modal animationType='slide' visible={modalVisible} transparent={true}>
      <View
        style={{
          flex: 1,
          padding: 25,
          paddingTop: StatusBarHeight + 30,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      >
        {!successful && (
          <FailContent buttonHandler={buttonHandler} errorMsg={message} />
        )}
        {successful && <SuccessContent buttonHandler={buttonHandler} />}
      </View>
    </Modal>
  );
};

//content for the modals
const SuccessContent = ({ buttonHandler }) => {
  return (
    <ModalView>
      <FocusedStatusBar background={COLORS.primary} />
      <Ionicons name='checkmark-circle' size={100} color={COLORS.green} />
      <PageTitle
        style={{ fontSize: 25, color: COLORS.tertiary, marginBottom: 10 }}
      >
        Verified
      </PageTitle>
      <InfoText style={{ color: COLORS.tertiary, marginBottom: 15 }}>
        You have successfully verified your account. 😎
      </InfoText>

      <StyledButton
        style={{ backgroundColor: COLORS.green, flexDirection: 'row' }}
        onPress={buttonHandler}
      >
        <ButtonText>Continue to App</ButtonText>
        <Ionicons name='arrow-forward-circle' size={25} color={COLORS.white} />
      </StyledButton>
    </ModalView>
  );
};

const FailContent = ({ errorMsg, buttonHandler }) => {
  return (
    <ModalView>
      <FocusedStatusBar background={COLORS.primary} />
      <Ionicons name='close-circle' size={100} color={COLORS.red} />
      <PageTitle
        style={{ fontSize: 25, color: COLORS.tertiary, marginBottom: 10 }}
      >
        Failed
      </PageTitle>
      <InfoText
        style={{ color: COLORS.tertiary, marginBottom: 15 }}
      >{`Oh Oh 😶! Account verification failed. ${errorMsg}.`}</InfoText>

      <StyledButton
        style={{ backgroundColor: COLORS.red, flexDirection: 'row' }}
        onPress={buttonHandler}
      >
        <ButtonText>Try Again</ButtonText>
        <Ionicons name='arrow-redo-circle' size={25} color={COLORS.white} />
      </StyledButton>
    </ModalView>
  );
};

export default VerificationModal;
